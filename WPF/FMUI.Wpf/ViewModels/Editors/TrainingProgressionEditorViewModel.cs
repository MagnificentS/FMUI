using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class TrainingProgressionEditorViewModel : CardEditorViewModel
{
    private readonly IClubDataService _clubDataService;
    private static readonly IReadOnlyList<string> DefaultColourOptions = Array.AsReadOnly(new[]
    {
        "#3E8EF7",
        "#53D769",
        "#FFB545",
        "#F95B78",
        "#8B6CFF",
        "#40C4FF",
        "#32C766",
        "#FF6F61",
        "#6BD5E1",
        "#A970FF"
    });

    private readonly ObservableCollection<string> _periods;
    private readonly ObservableCollection<TrainingProgressionPeriodEditorViewModel> _periodEntries;
    private string _metricValue;
    private string _metricLabel;
    private string _summary;
    private double _minimum;
    private double _maximum;
    private TrainingProgressionSeriesEditorViewModel? _selectedSeries;
    private string? _validationMessage;
    private readonly RelayCommand _removePeriodCommand;
    private readonly RelayCommand _addPeriodCommand;
    private bool _synchronisingPeriods;

    public TrainingProgressionEditorViewModel(
        TrainingProgressionSnapshot snapshot,
        IClubDataService clubDataService)
        : base("Adjust Training Progression", "Update development trends, highlights, and scenario ranges.")
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _metricValue = snapshot.MetricValue;
        _metricLabel = snapshot.MetricLabel;
        _summary = snapshot.Summary;
        _minimum = snapshot.Minimum;
        _maximum = snapshot.Maximum;
        _periods = new ObservableCollection<string>(snapshot.Periods?.ToList() ?? new List<string>());
        _periodEntries = new ObservableCollection<TrainingProgressionPeriodEditorViewModel>();
        Periods = new ReadOnlyObservableCollection<string>(_periods);
        PeriodEntries = new ReadOnlyObservableCollection<TrainingProgressionPeriodEditorViewModel>(_periodEntries);
        ColourOptions = DefaultColourOptions;

        Series = new ObservableCollection<TrainingProgressionSeriesEditorViewModel>(
            snapshot.Series?.Select(series => new TrainingProgressionSeriesEditorViewModel(series, OnSeriesChanged, OnSeriesPointsChanged))
            ?? new List<TrainingProgressionSeriesEditorViewModel>());
        Series.CollectionChanged += OnSeriesCollectionChanged;

        Highlights = new ObservableCollection<TrainingProgressionHighlightEditorViewModel>(
            snapshot.Highlights?.Select(item => new TrainingProgressionHighlightEditorViewModel(item, UpdateValidationState))
            ?? new List<TrainingProgressionHighlightEditorViewModel>());
        Highlights.CollectionChanged += OnHighlightsCollectionChanged;

        foreach (var series in Series)
        {
            series.Points.CollectionChanged += OnPointsCollectionChanged;
        }

        AddSeriesCommand = new RelayCommand(_ => AddSeries());
        RemoveSeriesCommand = new RelayCommand(param => RemoveSeries(param as TrainingProgressionSeriesEditorViewModel), param => param is TrainingProgressionSeriesEditorViewModel);
        AddHighlightCommand = new RelayCommand(_ => AddHighlight());
        RemoveHighlightCommand = new RelayCommand(param => RemoveHighlight(param as TrainingProgressionHighlightEditorViewModel), param => param is TrainingProgressionHighlightEditorViewModel);
        _addPeriodCommand = new RelayCommand(_ => AddPeriod());
        _removePeriodCommand = new RelayCommand(param => RemovePeriod(param as TrainingProgressionPeriodEditorViewModel), param => param is TrainingProgressionPeriodEditorViewModel && CanRemovePeriods);

        SynchronisePeriodEditors();
        NotifyPeriodStateChanged();
        UpdateValidationState();
    }

    public ObservableCollection<TrainingProgressionSeriesEditorViewModel> Series { get; }

    public ObservableCollection<TrainingProgressionHighlightEditorViewModel> Highlights { get; }

    public ReadOnlyObservableCollection<string> Periods { get; }

    public ReadOnlyObservableCollection<TrainingProgressionPeriodEditorViewModel> PeriodEntries { get; }

    public IReadOnlyList<string> ColourOptions { get; }

    public ICommand AddSeriesCommand { get; }

    public ICommand RemoveSeriesCommand { get; }

    public ICommand AddHighlightCommand { get; }

    public ICommand RemoveHighlightCommand { get; }

    public ICommand AddPeriodCommand => _addPeriodCommand;

    public ICommand RemovePeriodCommand => _removePeriodCommand;

    public TrainingProgressionSeriesEditorViewModel? SelectedSeries
    {
        get => _selectedSeries;
        set => SetProperty(ref _selectedSeries, value);
    }

    public string MetricValue
    {
        get => _metricValue;
        set
        {
            if (SetProperty(ref _metricValue, value))
            {
                UpdateValidationState();
            }
        }
    }

    public string MetricLabel
    {
        get => _metricLabel;
        set
        {
            if (SetProperty(ref _metricLabel, value))
            {
                UpdateValidationState();
            }
        }
    }

    public string Summary
    {
        get => _summary;
        set
        {
            if (SetProperty(ref _summary, value))
            {
                UpdateValidationState();
            }
        }
    }

    public double Minimum
    {
        get => _minimum;
        set
        {
            if (SetProperty(ref _minimum, value))
            {
                UpdateValidationState();
            }
        }
    }

    public double Maximum
    {
        get => _maximum;
        set
        {
            if (SetProperty(ref _maximum, value))
            {
                UpdateValidationState();
            }
        }
    }

    public string? ValidationMessage
    {
        get => _validationMessage;
        private set
        {
            if (SetProperty(ref _validationMessage, value))
            {
                NotifyCanSaveChanged();
            }
        }
    }

    protected override bool CanSave => string.IsNullOrEmpty(ValidationMessage);

    protected override async Task PersistAsync()
    {
        var progression = new TrainingProgressionSnapshot(
            MetricValue,
            MetricLabel,
            Summary,
            _periods.ToList(),
            Minimum,
            Maximum,
            Series.Select(series => series.ToSnapshot()).ToList(),
            Highlights.Select(highlight => highlight.ToSnapshot()).ToList());

        await _clubDataService.UpdateAsync(snapshot =>
        {
            var overview = snapshot.Training.Overview with { Progression = progression };
            var training = snapshot.Training with { Overview = overview };
            return snapshot with { Training = training };
        }).ConfigureAwait(false);
    }

    private void AddSeries()
    {
        var newSeries = new TrainingProgressionSeriesEditorViewModel(
            new TrainingProgressionSeriesSnapshot(
                Guid.NewGuid().ToString("N"),
                "New Trajectory",
                "#3E8EF7",
                null,
                false,
                CreateDefaultPoints()),
            OnSeriesChanged,
            OnSeriesPointsChanged);

        newSeries.Points.CollectionChanged += OnPointsCollectionChanged;
        Series.Add(newSeries);
        SelectedSeries = newSeries;
        UpdateValidationState();
    }

    private void AddPeriod()
    {
        var baseLabel = $"Week {_periods.Count + 1}";
        var label = CreateUniquePeriodName(baseLabel);

        _periods.Add(label);
        foreach (var series in Series)
        {
            series.EnsurePointForPeriod(label, Minimum);
        }

        SynchronisePeriodEditors();
        NotifyPeriodStateChanged();
        UpdateValidationState();
    }

    private string CreateUniquePeriodName(string baseLabel)
    {
        var attempt = 1;
        var candidate = baseLabel;
        while (_periods.Any(period => string.Equals(period, candidate, StringComparison.OrdinalIgnoreCase)))
        {
            attempt++;
            candidate = $"{baseLabel} {attempt}";
        }

        return candidate;
    }

    private void RemovePeriod(TrainingProgressionPeriodEditorViewModel? period)
    {
        if (period is null || _periods.Count <= 1)
        {
            return;
        }

        var index = _periodEntries.IndexOf(period);
        if (index < 0 || index >= _periods.Count)
        {
            return;
        }

        var removedLabel = _periods[index];
        _periods.RemoveAt(index);

        foreach (var series in Series)
        {
            series.RemovePointsForPeriod(removedLabel);
        }

        SynchronisePeriodEditors();
        NotifyPeriodStateChanged();
        RecalculatePeriods();
        UpdateValidationState();
    }

    private IReadOnlyList<TrainingProgressionPointSnapshot> CreateDefaultPoints()
    {
        if (_periods.Count == 0)
        {
            _periods.Add("Week 1");
        }

        var snapshots = new List<TrainingProgressionPointSnapshot>();
        foreach (var period in _periods)
        {
            snapshots.Add(new TrainingProgressionPointSnapshot(period, Minimum, null));
        }

        return snapshots;
    }

    private void RemoveSeries(TrainingProgressionSeriesEditorViewModel? series)
    {
        if (series is null)
        {
            return;
        }

        series.Points.CollectionChanged -= OnPointsCollectionChanged;
        Series.Remove(series);
        if (ReferenceEquals(SelectedSeries, series))
        {
            SelectedSeries = Series.FirstOrDefault();
        }

        UpdateValidationState();
        RecalculatePeriods();
    }

    private void AddHighlight()
    {
        var highlight = new TrainingProgressionHighlightEditorViewModel(new ListEntrySnapshot("New highlight", null, null, null), UpdateValidationState);
        Highlights.Add(highlight);
        UpdateValidationState();
    }

    private void RemoveHighlight(TrainingProgressionHighlightEditorViewModel? highlight)
    {
        if (highlight is null)
        {
            return;
        }

        Highlights.Remove(highlight);
        UpdateValidationState();
    }

    private void OnSeriesCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.NewItems is not null)
        {
            foreach (TrainingProgressionSeriesEditorViewModel series in e.NewItems)
            {
                series.Points.CollectionChanged += OnPointsCollectionChanged;
            }
        }

        if (e.OldItems is not null)
        {
            foreach (TrainingProgressionSeriesEditorViewModel series in e.OldItems)
            {
                series.Points.CollectionChanged -= OnPointsCollectionChanged;
            }
        }

        UpdateValidationState();
        RecalculatePeriods();
    }

    private void OnHighlightsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        UpdateValidationState();
    }

    private void OnPointsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        RecalculatePeriods();
        UpdateValidationState();
    }

    private void OnSeriesChanged()
    {
        UpdateValidationState();
    }

    private void OnSeriesPointsChanged()
    {
        RecalculatePeriods();
        UpdateValidationState();
    }

    private void RecalculatePeriods()
    {
        var ordered = new List<string>(_periods);
        var observed = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var result = new List<string>();

        foreach (var period in ordered)
        {
            if (observed.Add(period))
            {
                result.Add(period);
            }
        }

        foreach (var point in Series.SelectMany(series => series.Points))
        {
            if (string.IsNullOrWhiteSpace(point.Period))
            {
                continue;
            }

            if (observed.Add(point.Period))
            {
                result.Add(point.Period);
            }
        }

        _periods.Clear();
        foreach (var period in result)
        {
            _periods.Add(period);
        }

        SynchronisePeriodEditors();
        NotifyPeriodStateChanged();
    }

    private void UpdateValidationState()
    {
        if (string.IsNullOrWhiteSpace(MetricLabel))
        {
            ValidationMessage = "Metric label is required.";
            return;
        }

        if (string.IsNullOrWhiteSpace(MetricValue))
        {
            ValidationMessage = "Metric value is required.";
            return;
        }

        if (Maximum <= Minimum)
        {
            ValidationMessage = "Maximum must be greater than minimum.";
            return;
        }

        if (_periods.Count == 0)
        {
            ValidationMessage = "At least one timeline period is required.";
            return;
        }

        if (_periods.Any(string.IsNullOrWhiteSpace))
        {
            ValidationMessage = "Timeline periods cannot be empty.";
            return;
        }

        var duplicatePeriod = _periods
            .GroupBy(period => period, StringComparer.OrdinalIgnoreCase)
            .FirstOrDefault(group => group.Count() > 1);
        if (duplicatePeriod is not null)
        {
            ValidationMessage = $"Timeline period '{duplicatePeriod.Key}' is defined more than once.";
            return;
        }

        if (Series.Count == 0)
        {
            ValidationMessage = "At least one progression series is required.";
            return;
        }

        foreach (var series in Series)
        {
            if (string.IsNullOrWhiteSpace(series.Name))
            {
                ValidationMessage = "Series names cannot be empty.";
                return;
            }

            if (string.IsNullOrWhiteSpace(series.Color))
            {
                ValidationMessage = "Series colours cannot be empty.";
                return;
            }

            if (!IsValidHexColour(series.Color))
            {
                ValidationMessage = $"Series '{series.Name}' has an invalid colour. Use #RRGGBB or #AARRGGBB.";
                return;
            }

            if (!string.IsNullOrWhiteSpace(series.Accent) && !IsValidHexColour(series.Accent))
            {
                ValidationMessage = $"Series '{series.Name}' has an invalid accent colour.";
                return;
            }

            if (series.Points.Count == 0)
            {
                ValidationMessage = $"Series '{series.Name}' must contain at least one data point.";
                return;
            }

            foreach (var point in series.Points)
            {
                if (string.IsNullOrWhiteSpace(point.Period))
                {
                    ValidationMessage = $"Series '{series.Name}' has a point without a period label.";
                    return;
                }
            }
        }

        ValidationMessage = null;
    }

    private void SynchronisePeriodEditors()
    {
        _synchronisingPeriods = true;
        try
        {
            while (_periodEntries.Count > _periods.Count)
            {
                _periodEntries.RemoveAt(_periodEntries.Count - 1);
            }

            while (_periodEntries.Count < _periods.Count)
            {
                var periodViewModel = new TrainingProgressionPeriodEditorViewModel(
                    _periods[_periodEntries.Count],
                    OnPeriodRenamed);
                _periodEntries.Add(periodViewModel);
            }

            for (var index = 0; index < _periods.Count; index++)
            {
                _periodEntries[index].UpdateFromOwner(_periods[index]);
            }
        }
        finally
        {
            _synchronisingPeriods = false;
        }
    }

    private void OnPeriodRenamed(TrainingProgressionPeriodEditorViewModel period, string previous, string current)
    {
        if (_synchronisingPeriods)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(current))
        {
            period.UpdateFromOwner(previous);
            UpdateValidationState();
            return;
        }

        var index = _periodEntries.IndexOf(period);
        if (index < 0)
        {
            return;
        }

        _periods[index] = current;

        foreach (var series in Series)
        {
            series.RenamePeriod(previous, current);
        }

        UpdateValidationState();
    }

    private void NotifyPeriodStateChanged()
    {
        OnPropertyChanged(nameof(CanRemovePeriods));
        _removePeriodCommand.RaiseCanExecuteChanged();
    }

    public bool CanRemovePeriods => _periods.Count > 1;

    private static bool IsValidHexColour(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var span = value.AsSpan().Trim();
        if (span.Length != 7 && span.Length != 9)
        {
            return false;
        }

        if (span[0] != '#')
        {
            return false;
        }

        for (var index = 1; index < span.Length; index++)
        {
            if (!Uri.IsHexDigit(span[index]))
            {
                return false;
            }
        }

        return true;
    }
}

public sealed class TrainingProgressionSeriesEditorViewModel : ObservableObject
{
    private readonly Action _requestValidation;
    private readonly Action _pointsChanged;
    private readonly RelayCommand _addPointCommand;
    private readonly RelayCommand _removePointCommand;
    private string _name;
    private string _color;
    private string? _accent;
    private bool _isHighlighted;

    public TrainingProgressionSeriesEditorViewModel(
        TrainingProgressionSeriesSnapshot snapshot,
        Action requestValidation,
        Action pointsChanged)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        _requestValidation = requestValidation ?? throw new ArgumentNullException(nameof(requestValidation));
        _pointsChanged = pointsChanged ?? throw new ArgumentNullException(nameof(pointsChanged));
        Id = snapshot.Id;
        _name = snapshot.Name;
        _color = snapshot.Color;
        _accent = snapshot.Accent;
        _isHighlighted = snapshot.IsHighlighted;
        Points = new ObservableCollection<TrainingProgressionPointEditorViewModel>(
            snapshot.Points?.Select(point => new TrainingProgressionPointEditorViewModel(point, OnPointChanged))
            ?? new List<TrainingProgressionPointEditorViewModel>());
        _addPointCommand = new RelayCommand(_ => AddPoint());
        _removePointCommand = new RelayCommand(param => RemovePoint(param as TrainingProgressionPointEditorViewModel), param => param is TrainingProgressionPointEditorViewModel);
    }

    public string Id { get; }

    public ObservableCollection<TrainingProgressionPointEditorViewModel> Points { get; }

    public string Name
    {
        get => _name;
        set
        {
            if (SetProperty(ref _name, value))
            {
                _requestValidation();
            }
        }
    }

    public string Color
    {
        get => _color;
        set
        {
            if (SetProperty(ref _color, value))
            {
                _requestValidation();
            }
        }
    }

    public string? Accent
    {
        get => _accent;
        set
        {
            if (SetProperty(ref _accent, value))
            {
                _requestValidation();
            }
        }
    }

    public bool IsHighlighted
    {
        get => _isHighlighted;
        set
        {
            if (SetProperty(ref _isHighlighted, value))
            {
                _requestValidation();
            }
        }
    }

    public ICommand AddPointCommand => _addPointCommand;

    public ICommand RemovePointCommand => _removePointCommand;

    public TrainingProgressionSeriesSnapshot ToSnapshot()
    {
        return new TrainingProgressionSeriesSnapshot(
            Id,
            Name,
            Color,
            Accent,
            IsHighlighted,
            Points.Select(point => point.ToSnapshot()).ToList());
    }

    public void EnsurePointForPeriod(string period, double defaultValue)
    {
        if (Points.Any(point => string.Equals(point.Period, period, StringComparison.OrdinalIgnoreCase)))
        {
            return;
        }

        Points.Add(new TrainingProgressionPointEditorViewModel(
            new TrainingProgressionPointSnapshot(period, defaultValue, null),
            OnPointChanged));
        _pointsChanged();
    }

    public void RemovePointsForPeriod(string period)
    {
        for (var index = Points.Count - 1; index >= 0; index--)
        {
            if (string.Equals(Points[index].Period, period, StringComparison.OrdinalIgnoreCase))
            {
                Points.RemoveAt(index);
            }
        }

        _pointsChanged();
    }

    public void RenamePeriod(string previous, string current)
    {
        foreach (var point in Points)
        {
            if (string.Equals(point.Period, previous, StringComparison.OrdinalIgnoreCase))
            {
                point.Period = current;
            }
        }
    }

    private void AddPoint()
    {
        var nextIndex = Points.Count + 1;
        var point = new TrainingProgressionPointEditorViewModel(
            new TrainingProgressionPointSnapshot($"Week {nextIndex}", 0, null),
            OnPointChanged);
        Points.Add(point);
        _pointsChanged();
    }

    private void RemovePoint(TrainingProgressionPointEditorViewModel? point)
    {
        if (point is null)
        {
            return;
        }

        Points.Remove(point);
        _pointsChanged();
    }

    private void OnPointChanged()
    {
        _pointsChanged();
    }
}

public sealed class TrainingProgressionPeriodEditorViewModel : ObservableObject
{
    private readonly Action<TrainingProgressionPeriodEditorViewModel, string, string> _onRenamed;
    private bool _suppressNotification;
    private string _name;

    internal TrainingProgressionPeriodEditorViewModel(
        string name,
        Action<TrainingProgressionPeriodEditorViewModel, string, string> onRenamed)
    {
        _name = name ?? throw new ArgumentNullException(nameof(name));
        _onRenamed = onRenamed ?? throw new ArgumentNullException(nameof(onRenamed));
    }

    public string Name
    {
        get => _name;
        set
        {
            var newValue = value ?? string.Empty;
            if (string.Equals(_name, newValue, StringComparison.Ordinal))
            {
                return;
            }

            var previous = _name;
            _name = newValue;
            OnPropertyChanged();

            if (!_suppressNotification)
            {
                _onRenamed(this, previous, newValue);
            }
        }
    }

    internal void UpdateFromOwner(string name)
    {
        try
        {
            _suppressNotification = true;
            Name = name;
        }
        finally
        {
            _suppressNotification = false;
        }
    }
}

public sealed class TrainingProgressionPointEditorViewModel : ObservableObject
{
    private readonly Action _onChanged;
    private string _period;
    private double _value;
    private string? _detail;

    public TrainingProgressionPointEditorViewModel(TrainingProgressionPointSnapshot snapshot, Action onChanged)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        _onChanged = onChanged ?? throw new ArgumentNullException(nameof(onChanged));
        _period = snapshot.Period;
        _value = snapshot.Value;
        _detail = snapshot.Detail;
    }

    public string Period
    {
        get => _period;
        set
        {
            if (SetProperty(ref _period, value))
            {
                _onChanged();
            }
        }
    }

    public double Value
    {
        get => _value;
        set
        {
            if (SetProperty(ref _value, value))
            {
                _onChanged();
            }
        }
    }

    public string? Detail
    {
        get => _detail;
        set
        {
            if (SetProperty(ref _detail, value))
            {
                _onChanged();
            }
        }
    }

    public TrainingProgressionPointSnapshot ToSnapshot()
    {
        return new TrainingProgressionPointSnapshot(Period, Value, Detail);
    }
}

public sealed class TrainingProgressionHighlightEditorViewModel : ObservableObject
{
    private readonly Action _onChanged;
    private string _primary;
    private string? _secondary;
    private string? _tertiary;
    private string? _accent;

    public TrainingProgressionHighlightEditorViewModel(ListEntrySnapshot snapshot, Action onChanged)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        _onChanged = onChanged ?? throw new ArgumentNullException(nameof(onChanged));
        _primary = snapshot.Primary;
        _secondary = snapshot.Secondary;
        _tertiary = snapshot.Tertiary;
        _accent = snapshot.Accent;
    }

    public string Primary
    {
        get => _primary;
        set
        {
            if (SetProperty(ref _primary, value))
            {
                _onChanged();
            }
        }
    }

    public string? Secondary
    {
        get => _secondary;
        set
        {
            if (SetProperty(ref _secondary, value))
            {
                _onChanged();
            }
        }
    }

    public string? Tertiary
    {
        get => _tertiary;
        set
        {
            if (SetProperty(ref _tertiary, value))
            {
                _onChanged();
            }
        }
    }

    public string? Accent
    {
        get => _accent;
        set
        {
            if (SetProperty(ref _accent, value))
            {
                _onChanged();
            }
        }
    }

    public ListEntrySnapshot ToSnapshot()
    {
        return new ListEntrySnapshot(Primary, Secondary, Tertiary, Accent);
    }
}
