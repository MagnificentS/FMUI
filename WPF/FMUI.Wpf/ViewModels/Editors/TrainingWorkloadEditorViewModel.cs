using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class TrainingWorkloadEditorViewModel : CardEditorViewModel
{
    private readonly Func<TrainingWorkloadHeatmapSnapshot, Task> _persistAsync;
    private string? _legendTitle;
    private string? _legendSubtitle;
    private string? _validationMessage;
    private TrainingWorkloadEditorRowViewModel? _selectedRow;

    public TrainingWorkloadEditorViewModel(
        string title,
        string? subtitle,
        TrainingWorkloadHeatmapSnapshot? snapshot,
        Func<TrainingWorkloadHeatmapSnapshot, Task> persistAsync)
        : base(title, subtitle)
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        Columns = snapshot?.Columns is { Count: > 0 }
            ? new ReadOnlyCollection<string>(snapshot.Columns.ToList())
            : Array.Empty<string>();

        IntensityOptions = snapshot?.Intensities is { Count: > 0 }
            ? new ReadOnlyCollection<TrainingIntensityLevelOptionViewModel>(
                snapshot.Intensities.Select(TrainingIntensityLevelOptionViewModel.FromSnapshot).ToList())
            : Array.Empty<TrainingIntensityLevelOptionViewModel>();

        _legendTitle = snapshot?.LegendTitle;
        _legendSubtitle = snapshot?.LegendSubtitle;

        Rows = new ObservableCollection<TrainingWorkloadEditorRowViewModel>(
            CreateRows(snapshot?.Units));

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

    public ObservableCollection<TrainingWorkloadEditorRowViewModel> Rows { get; }

    public IReadOnlyList<string> Columns { get; }

    public IReadOnlyList<TrainingIntensityLevelOptionViewModel> IntensityOptions { get; }

    public TrainingWorkloadEditorRowViewModel? SelectedRow
    {
        get => _selectedRow;
        set => SetProperty(ref _selectedRow, value);
    }

    public double MinimumLoad => 0;

    public double MaximumLoad => 120;

    public double LoadStep => 5;

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

        var snapshot = new TrainingWorkloadHeatmapSnapshot(
            columns,
            rows,
            intensities,
            string.IsNullOrWhiteSpace(LegendTitle) ? null : LegendTitle,
            string.IsNullOrWhiteSpace(LegendSubtitle) ? null : LegendSubtitle);

        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private IEnumerable<TrainingWorkloadEditorRowViewModel> CreateRows(IReadOnlyList<TrainingWorkloadUnitSnapshot>? units)
    {
        if (units is { Count: > 0 })
        {
            foreach (var unit in units)
            {
                yield return TrainingWorkloadEditorRowViewModel.FromSnapshot(unit, Columns, IntensityOptions);
            }
        }
    }

    private void AttachRowHandlers(TrainingWorkloadEditorRowViewModel row)
    {
        row.PropertyChanged += OnRowPropertyChanged;
        foreach (var cell in row.Cells)
        {
            cell.PropertyChanged += OnCellPropertyChanged;
        }
    }

    private void DetachRowHandlers(TrainingWorkloadEditorRowViewModel row)
    {
        row.PropertyChanged -= OnRowPropertyChanged;
        foreach (var cell in row.Cells)
        {
            cell.PropertyChanged -= OnCellPropertyChanged;
        }
    }

    private void OnRowPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        UpdateValidation();
    }

    private void OnCellPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (string.Equals(e.PropertyName, nameof(TrainingWorkloadEditorCellViewModel.SelectedIntensity), StringComparison.Ordinal) ||
            string.Equals(e.PropertyName, nameof(TrainingWorkloadEditorCellViewModel.Load), StringComparison.Ordinal) ||
            string.Equals(e.PropertyName, nameof(TrainingWorkloadEditorCellViewModel.Detail), StringComparison.Ordinal))
        {
            UpdateValidation();
        }
    }

    private void UpdateValidation()
    {
        if (Rows.Count == 0)
        {
            ValidationMessage = "No training units are available to edit.";
            return;
        }

        if (Columns.Count == 0)
        {
            ValidationMessage = "Define schedule columns before editing workload.";
            return;
        }

        foreach (var row in Rows)
        {
            if (string.IsNullOrWhiteSpace(row.Label))
            {
                ValidationMessage = "All training units require a name.";
                return;
            }

            if (row.Cells.Count != Columns.Count)
            {
                ValidationMessage = $"{row.Label} is missing workload entries for one or more slots.";
                return;
            }

            foreach (var cell in row.Cells)
            {
                if (!cell.HasIntensity)
                {
                    ValidationMessage = $"Select an intensity for {row.Label} – {cell.Column}.";
                    return;
                }

                if (cell.Load < MinimumLoad || cell.Load > MaximumLoad)
                {
                    ValidationMessage = $"{row.Label} – {cell.Column} load must be between {MinimumLoad:0} and {MaximumLoad:0}.";
                    return;
                }
            }
        }

        ValidationMessage = null;
    }
}

public sealed class TrainingWorkloadEditorRowViewModel : ObservableObject
{
    private string _label;

    private TrainingWorkloadEditorRowViewModel(
        string label,
        IReadOnlyList<TrainingWorkloadEditorCellViewModel> cells)
    {
        _label = label;
        Cells = new ObservableCollection<TrainingWorkloadEditorCellViewModel>(cells);
    }

    public ObservableCollection<TrainingWorkloadEditorCellViewModel> Cells { get; }

    public string Label
    {
        get => _label;
        set => SetProperty(ref _label, value);
    }

    public static TrainingWorkloadEditorRowViewModel FromSnapshot(
        TrainingWorkloadUnitSnapshot snapshot,
        IReadOnlyList<string> columns,
        IReadOnlyList<TrainingIntensityLevelOptionViewModel> intensityOptions)
    {
        var lookup = snapshot.Cells?.ToDictionary(cell => cell.Column, StringComparer.OrdinalIgnoreCase)
                     ?? new Dictionary<string, TrainingWorkloadCellSnapshot>(StringComparer.OrdinalIgnoreCase);

        var cells = new List<TrainingWorkloadEditorCellViewModel>(columns.Count);
        foreach (var column in columns)
        {
            lookup.TryGetValue(column, out var cellSnapshot);
            cells.Add(new TrainingWorkloadEditorCellViewModel(column, cellSnapshot, intensityOptions));
        }

        return new TrainingWorkloadEditorRowViewModel(snapshot.Label, cells);
    }

    public TrainingWorkloadUnitSnapshot ToSnapshot()
    {
        var cells = Cells.Select(cell => cell.ToSnapshot()).ToList();
        return new TrainingWorkloadUnitSnapshot(Label, cells);
    }
}

public sealed class TrainingWorkloadEditorCellViewModel : ObservableObject
{
    private TrainingIntensityLevelOptionViewModel? _selectedIntensity;
    private double _load;
    private string? _detail;

    public TrainingWorkloadEditorCellViewModel(
        string column,
        TrainingWorkloadCellSnapshot? snapshot,
        IReadOnlyList<TrainingIntensityLevelOptionViewModel> options)
    {
        Column = column;
        IntensityOptions = options;

        if (snapshot is not null)
        {
            _selectedIntensity = options.FirstOrDefault(option => option.Matches(snapshot.IntensityKey));
            _load = snapshot.Load;
            _detail = snapshot.Detail;
        }
        else if (options.Count > 0)
        {
            _selectedIntensity = options[0];
            _load = options[0].LoadValue;
        }
    }

    public string Column { get; }

    public IReadOnlyList<TrainingIntensityLevelOptionViewModel> IntensityOptions { get; }

    public TrainingIntensityLevelOptionViewModel? SelectedIntensity
    {
        get => _selectedIntensity;
        set
        {
            if (SetProperty(ref _selectedIntensity, value))
            {
                OnPropertyChanged(nameof(HasIntensity));
            }
        }
    }

    public bool HasIntensity => SelectedIntensity is not null;

    public double Load
    {
        get => _load;
        set => SetProperty(ref _load, value);
    }

    public string? Detail
    {
        get => _detail;
        set => SetProperty(ref _detail, value);
    }

    public TrainingWorkloadCellSnapshot ToSnapshot()
    {
        var intensityKey = SelectedIntensity?.Key ?? string.Empty;
        var detail = string.IsNullOrWhiteSpace(Detail) ? null : Detail;
        return new TrainingWorkloadCellSnapshot(Column, intensityKey, Load, detail);
    }
}

public sealed class TrainingIntensityLevelOptionViewModel
{
    private readonly TrainingIntensityLevelSnapshot _snapshot;

    private TrainingIntensityLevelOptionViewModel(TrainingIntensityLevelSnapshot snapshot)
    {
        _snapshot = snapshot ?? throw new ArgumentNullException(nameof(snapshot));
    }

    public string Key => _snapshot.Key;

    public string DisplayName => _snapshot.DisplayName;

    public string Color => _snapshot.Color;

    public double LoadValue => _snapshot.LoadValue;

    public bool Matches(string? key) => string.Equals(Key, key, StringComparison.OrdinalIgnoreCase);

    public TrainingIntensityLevelSnapshot ToSnapshot() => new(Key, DisplayName, Color, LoadValue);

    public static TrainingIntensityLevelOptionViewModel FromSnapshot(TrainingIntensityLevelSnapshot snapshot) => new(snapshot);
}