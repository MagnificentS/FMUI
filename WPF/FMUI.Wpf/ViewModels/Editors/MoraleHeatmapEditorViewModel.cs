using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class MoraleHeatmapEditorViewModel : CardEditorViewModel
{
    private readonly Func<MoraleHeatmapSnapshot, Task> _persistAsync;
    private string? _legendTitle;
    private string? _legendSubtitle;
    private string? _validationMessage;
    private MoraleHeatmapEditorRowViewModel? _selectedRow;

    public MoraleHeatmapEditorViewModel(
        string title,
        string? subtitle,
        MoraleHeatmapSnapshot snapshot,
        Func<MoraleHeatmapSnapshot, Task> persistAsync)
        : base(title, subtitle)
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        Columns = snapshot.Columns is { Count: > 0 }
            ? new ReadOnlyCollection<string>(snapshot.Columns.ToList())
            : Array.Empty<string>();

        IntensityOptions = snapshot.Intensities is { Count: > 0 }
            ? new ReadOnlyCollection<MoraleIntensityOptionViewModel>(
                snapshot.Intensities.Select(MoraleIntensityOptionViewModel.FromSnapshot).ToList())
            : Array.Empty<MoraleIntensityOptionViewModel>();

        _legendTitle = snapshot.LegendTitle;
        _legendSubtitle = snapshot.LegendSubtitle;

        Rows = new ObservableCollection<MoraleHeatmapEditorRowViewModel>(
            CreateRows(snapshot.Rows));

        foreach (var row in Rows)
        {
            AttachRowHandlers(row);
        }

        if (Rows.Count > 0)
        {
            SelectedRow = Rows[0];
        }

        UpdateValidation();
    }

    public ObservableCollection<MoraleHeatmapEditorRowViewModel> Rows { get; }

    public IReadOnlyList<string> Columns { get; }

    public IReadOnlyList<MoraleIntensityOptionViewModel> IntensityOptions { get; }

    public MoraleHeatmapEditorRowViewModel? SelectedRow
    {
        get => _selectedRow;
        set => SetProperty(ref _selectedRow, value);
    }

    public string? LegendTitle
    {
        get => _legendTitle;
        set => SetProperty(ref _legendTitle, value);
    }

    public string? LegendSubtitle
    {
        get => _legendSubtitle;
        set => SetProperty(ref _legendSubtitle, value);
    }

    public string? ValidationMessage
    {
        get => _validationMessage;
        private set
        {
            if (SetProperty(ref _validationMessage, value))
            {
                OnPropertyChanged(nameof(HasValidationMessage));
                NotifyCanSaveChanged();
            }
        }
    }

    public bool HasValidationMessage => !string.IsNullOrWhiteSpace(ValidationMessage);

    protected override bool CanSave => string.IsNullOrWhiteSpace(ValidationMessage);

    protected override async Task PersistAsync()
    {
        var rows = Rows.Select(row => row.ToSnapshot()).ToList();
        var intensities = IntensityOptions.Select(option => option.ToSnapshot()).ToList();
        var columns = Columns.ToList();

        var snapshot = new MoraleHeatmapSnapshot(
            columns,
            rows,
            intensities,
            string.IsNullOrWhiteSpace(LegendTitle) ? null : LegendTitle,
            string.IsNullOrWhiteSpace(LegendSubtitle) ? null : LegendSubtitle);

        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private IEnumerable<MoraleHeatmapEditorRowViewModel> CreateRows(IReadOnlyList<MoraleHeatmapRowSnapshot>? rows)
    {
        if (rows is { Count: > 0 })
        {
            foreach (var row in rows)
            {
                yield return MoraleHeatmapEditorRowViewModel.FromSnapshot(row, Columns, IntensityOptions);
            }
        }
    }

    private void AttachRowHandlers(MoraleHeatmapEditorRowViewModel row)
    {
        row.PropertyChanged += OnRowPropertyChanged;
        foreach (var cell in row.Cells)
        {
            cell.PropertyChanged += OnCellPropertyChanged;
        }
    }

    private void OnRowPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        UpdateValidation();
    }

    private void OnCellPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (string.Equals(e.PropertyName, nameof(MoraleHeatmapEditorCellViewModel.SelectedIntensity), StringComparison.Ordinal) ||
            string.Equals(e.PropertyName, nameof(MoraleHeatmapEditorCellViewModel.Label), StringComparison.Ordinal) ||
            string.Equals(e.PropertyName, nameof(MoraleHeatmapEditorCellViewModel.Detail), StringComparison.Ordinal))
        {
            UpdateValidation();
        }
    }

    private void UpdateValidation()
    {
        if (Rows.Count == 0)
        {
            ValidationMessage = "No morale units are available to edit.";
            return;
        }

        if (Columns.Count == 0)
        {
            ValidationMessage = "Define morale columns before editing values.";
            return;
        }

        foreach (var row in Rows)
        {
            if (string.IsNullOrWhiteSpace(row.Label))
            {
                ValidationMessage = "All morale groups require a name.";
                return;
            }

            if (row.Cells.Count != Columns.Count)
            {
                ValidationMessage = $"{row.Label} is missing entries for one or more morale columns.";
                return;
            }

            foreach (var cell in row.Cells)
            {
                if (!cell.HasIntensity)
                {
                    ValidationMessage = $"Select an intensity for {row.Label} – {cell.Column}.";
                    return;
                }

                if (string.IsNullOrWhiteSpace(cell.Label))
                {
                    ValidationMessage = $"Provide a label for the {row.Label} – {cell.Column} morale cell.";
                    return;
                }
            }
        }

        ValidationMessage = null;
    }
}

public sealed class MoraleHeatmapEditorRowViewModel : ObservableObject
{
    private string _label;

    private MoraleHeatmapEditorRowViewModel(
        string label,
        IReadOnlyList<MoraleHeatmapEditorCellViewModel> cells)
    {
        _label = label;
        Cells = new ObservableCollection<MoraleHeatmapEditorCellViewModel>(cells);
    }

    public ObservableCollection<MoraleHeatmapEditorCellViewModel> Cells { get; }

    public string Label
    {
        get => _label;
        set => SetProperty(ref _label, value);
    }

    public MoraleHeatmapRowSnapshot ToSnapshot()
    {
        return new MoraleHeatmapRowSnapshot(
            Label,
            Cells.Select(cell => cell.ToSnapshot()).ToList());
    }

    public static MoraleHeatmapEditorRowViewModel FromSnapshot(
        MoraleHeatmapRowSnapshot snapshot,
        IReadOnlyList<string> columns,
        IReadOnlyList<MoraleIntensityOptionViewModel> intensities)
    {
        var lookup = snapshot.Cells?.ToDictionary(cell => cell.Column, StringComparer.OrdinalIgnoreCase)
                     ?? new Dictionary<string, MoraleHeatmapCellSnapshot>(StringComparer.OrdinalIgnoreCase);

        var cells = new List<MoraleHeatmapEditorCellViewModel>(columns.Count);
        foreach (var column in columns)
        {
            lookup.TryGetValue(column, out var cell);
            cells.Add(MoraleHeatmapEditorCellViewModel.FromSnapshot(column, cell, intensities));
        }

        return new MoraleHeatmapEditorRowViewModel(snapshot.Label, cells);
    }
}

public sealed class MoraleHeatmapEditorCellViewModel : ObservableObject
{
    private MoraleIntensityOptionViewModel? _selectedIntensity;
    private string _label;
    private string? _detail;

    private MoraleHeatmapEditorCellViewModel(
        string column,
        string label,
        string? detail,
        MoraleIntensityOptionViewModel? selected,
        IReadOnlyList<MoraleIntensityOptionViewModel> options)
    {
        Column = column;
        _label = label;
        _detail = detail;
        _selectedIntensity = selected;
        IntensityOptions = options;
    }

    public string Column { get; }

    public IReadOnlyList<MoraleIntensityOptionViewModel> IntensityOptions { get; }

    public string Label
    {
        get => _label;
        set => SetProperty(ref _label, value);
    }

    public string? Detail
    {
        get => _detail;
        set => SetProperty(ref _detail, value);
    }

    public MoraleIntensityOptionViewModel? SelectedIntensity
    {
        get => _selectedIntensity;
        set => SetProperty(ref _selectedIntensity, value);
    }

    public bool HasIntensity => SelectedIntensity is not null;

    public MoraleHeatmapCellSnapshot ToSnapshot()
    {
        var key = SelectedIntensity?.Key ?? string.Empty;
        return new MoraleHeatmapCellSnapshot(
            Column,
            key,
            string.IsNullOrWhiteSpace(Label) ? "—" : Label,
            string.IsNullOrWhiteSpace(Detail) ? null : Detail);
    }

    public static MoraleHeatmapEditorCellViewModel FromSnapshot(
        string column,
        MoraleHeatmapCellSnapshot? snapshot,
        IReadOnlyList<MoraleIntensityOptionViewModel> options)
    {
        MoraleIntensityOptionViewModel? selected = null;

        if (snapshot is not null && !string.IsNullOrWhiteSpace(snapshot.IntensityKey))
        {
            selected = options.FirstOrDefault(option =>
                string.Equals(option.Key, snapshot.IntensityKey, StringComparison.OrdinalIgnoreCase));
        }

        return new MoraleHeatmapEditorCellViewModel(
            column,
            snapshot?.Label ?? string.Empty,
            snapshot?.Detail,
            selected,
            options);
    }
}

public sealed class MoraleIntensityOptionViewModel : ObservableObject
{
    private string _displayName;
    private string _color;
    private string? _description;

    private MoraleIntensityOptionViewModel(string key, string displayName, string color, string? description)
    {
        Key = key;
        _displayName = displayName;
        _color = color;
        _description = description;
    }

    public string Key { get; }

    public string DisplayName
    {
        get => _displayName;
        set => SetProperty(ref _displayName, value);
    }

    public string Color
    {
        get => _color;
        set => SetProperty(ref _color, value);
    }

    public string? Description
    {
        get => _description;
        set => SetProperty(ref _description, value);
    }

    public MoraleIntensitySnapshot ToSnapshot()
    {
        return new MoraleIntensitySnapshot(
            Key,
            DisplayName,
            Color,
            string.IsNullOrWhiteSpace(Description) ? null : Description);
    }

    public static MoraleIntensityOptionViewModel FromSnapshot(MoraleIntensitySnapshot snapshot)
    {
        return new MoraleIntensityOptionViewModel(snapshot.Key, snapshot.DisplayName, snapshot.Color, snapshot.Description);
    }
}
