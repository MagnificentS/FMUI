using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;
using FMUI.Wpf.UI.Cards;

namespace FMUI.Wpf.ViewModels;

public sealed partial class CardPresenter : ObservableObject, ICardPresenterDescriptor
{
    private CardDefinition _definition;
    private readonly CardSurfaceMetrics _metrics;
    private readonly ICardInteractionBehavior _interactionBehavior;
    private readonly ICardSelectionBehavior _selectionBehavior;
    private readonly IClubDataService _clubDataService;
    private readonly Dictionary<string, FormationPlayerViewModel> _formationPlayerLookup = new(StringComparer.OrdinalIgnoreCase);
    private readonly RelayCommand _openEditorCommand;
    private Action<CardPresenter>? _requestEditor;
    private SquadRosterState? _squadRosterState;
    private int _column;
    private int _row;
    private int _columnSpan;
    private int _rowSpan;
    private bool _isVisible = true;
    private bool _isSelected;

    private bool _isEditorAvailable;

    public CardPresenter(
        CardDefinition definition,
        CardSurfaceMetrics metrics,
        ICardInteractionBehavior interactionBehavior,
        ICardSelectionBehavior selectionBehavior,
        IClubDataService clubDataService,
        string tabIdentifier,
        string sectionIdentifier,
        bool isCustom = false,
        string? presetId = null)
    {
        _definition = definition;
        _metrics = metrics;
        _interactionBehavior = interactionBehavior;
        _selectionBehavior = selectionBehavior;
        _clubDataService = clubDataService;
        TabIdentifier = tabIdentifier;
        SectionIdentifier = sectionIdentifier;
        _column = definition.Column;
        _row = definition.Row;
        _columnSpan = definition.ColumnSpan;
        _rowSpan = definition.RowSpan;
        IsCustom = isCustom;
        PresetId = presetId;
        RefreshDefinition(definition, true);
        BeginDragCommand = new RelayCommand(_ => _interactionBehavior.BeginDrag(Id));
        DragDeltaCommand = new RelayCommand(param =>
        {
            if (param is CardDragDelta delta)
            {
                _interactionBehavior.UpdateDrag(Id, delta);
            }
        });
        CompleteDragCommand = new RelayCommand(param =>
        {
            var completed = param as CardDragCompleted ?? new CardDragCompleted(false);
            _interactionBehavior.CompleteDrag(Id, completed);
        });

        BeginResizeCommand = new RelayCommand(param =>
        {
            if (param is ResizeHandle handle)
            {
                _interactionBehavior.BeginResize(Id, handle);
            }
        });

        ResizeDeltaCommand = new RelayCommand(param =>
        {
            if (param is CardResizeDelta delta)
            {
                _interactionBehavior.UpdateResize(Id, delta);
            }
        });

        CompleteResizeCommand = new RelayCommand(param =>
        {
            if (param is CardResizeCompleted completed)
            {
                _interactionBehavior.CompleteResize(Id, completed);
            }
        });

        _openEditorCommand = new RelayCommand(
            _ => _requestEditor?.Invoke(this),
            _ => _isEditorAvailable && _requestEditor is not null);
    }

    public CardDefinition Definition => _definition;

    public string Title => _definition.Title;

    public string Id => _definition.Id;

    string ICardPresenterDescriptor.CardId => Id;

    public string TabIdentifier { get; }

    public string SectionIdentifier { get; }

    public string? Subtitle => _definition.Subtitle;

    public string? Description => _definition.Description;

    public string? PillText => _definition.PillText;

    public string? MetricValue => _definition.MetricValue;

    public string? MetricLabel => _definition.MetricLabel;

    public CardKind Kind => _definition.Kind;

    public bool HasContentHost => _definition.ContentType.HasValue;

    public CardType ContentType => _definition.ContentType ?? CardType.TacticalOverview;

    public uint PrimaryEntityId => _definition.PrimaryEntityId;

    public IReadOnlyList<CardListItemViewModel> ListItems { get; private set; }

    public IReadOnlyList<FormationLineViewModel> FormationLines { get; private set; }

    public IReadOnlyList<FormationPlayerViewModel> FormationPlayers { get; private set; }

    public IReadOnlyList<ChartSeriesViewModel> ChartSeries { get; private set; }

    public GaugeViewModel? Gauge { get; private set; }

    public FinanceForecastViewModel? Forecast { get; private set; }

    public FinanceCashflowViewModel? FinanceCashflow { get; private set; }

    public FinanceBudgetAllocatorViewModel? FinanceBudgetAllocator { get; private set; }

    public FinanceScenarioBoardViewModel? FinanceScenario { get; private set; }

    public TrainingWorkloadHeatmapViewModel? WorkloadHeatmap { get; private set; }

    public MoraleHeatmapViewModel? MoraleHeatmap { get; private set; }

    public TrainingCalendarViewModel? TrainingCalendar { get; private set; }

    public FixtureCalendarViewModel? FixtureCalendar { get; private set; }

    public TransferNegotiationCardViewModel? Negotiations { get; private set; }

    public ScoutAssignmentBoardViewModel? ScoutAssignments { get; private set; }

    public ShortlistBoardViewModel? ShortlistBoard { get; private set; }

    public TrainingUnitBoardViewModel? TrainingUnitBoard { get; private set; }

    public TrainingProgressionViewModel? TrainingProgression { get; private set; }

    public ShotMapViewModel? ShotMap { get; private set; }

    public MedicalTimelineViewModel? MedicalTimeline { get; private set; }

    public IReadOnlyList<TimelineEntryViewModel> TimelineEntries { get; private set; }

    public bool HasSubtitle => !string.IsNullOrWhiteSpace(Subtitle);

    public bool HasDescription => !string.IsNullOrWhiteSpace(Description);

    public bool HasPill => !string.IsNullOrWhiteSpace(PillText);

    public bool HasMetric => !string.IsNullOrWhiteSpace(MetricValue);

    public bool HasListItems => ListItems.Count > 0;

    public bool HasFormation => FormationLines.Count > 0;

    public bool HasFormationPlayers => FormationPlayers.Count > 0;

    public bool HasChartSeries => ChartSeries.Count > 0;

    public bool HasGauge => Gauge is not null;

    public bool HasForecast => Forecast is not null;

    public bool HasWorkloadHeatmap => WorkloadHeatmap is not null;

    public bool HasMoraleHeatmap => MoraleHeatmap is not null;

    public bool HasTrainingCalendar => TrainingCalendar is not null;

    public bool HasFixtureCalendar => FixtureCalendar is not null;

    public bool HasNegotiations => Negotiations is not null && Negotiations.HasDeals;

    public bool HasScoutAssignments => ScoutAssignments is not null;

    public bool HasShortlistBoard => ShortlistBoard is not null;

    public bool HasTrainingProgression => TrainingProgression is not null;

    public bool HasShotMap => ShotMap is not null;

    public bool HasMedicalTimeline => MedicalTimeline is not null && MedicalTimeline.HasEntries;

    public bool HasTimeline => TimelineEntries.Count > 0;

    public double Left => _metrics.CalculateLeft(_column);

    public double Top => _metrics.CalculateTop(_row);

    public double Width => _metrics.CalculateWidth(_columnSpan);

    public double Height => _metrics.CalculateHeight(_rowSpan);

    public CardSurfaceMetrics Metrics => _metrics;

    public CardGeometry Geometry => new(_column, _row, _columnSpan, _rowSpan);

    public bool IsCustom { get; }

    public string? PresetId { get; }

    public bool IsVisible
    {
        get => _isVisible;
        private set => SetProperty(ref _isVisible, value);
    }

    public bool IsSelected
    {
        get => _isSelected;
        private set => SetProperty(ref _isSelected, value);
    }

    public bool IsEditorAvailable
    {
        get => _isEditorAvailable;
        private set
        {
            if (SetProperty(ref _isEditorAvailable, value))
            {
                _openEditorCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public ICommand BeginDragCommand { get; }

    public ICommand DragDeltaCommand { get; }

    public ICommand CompleteDragCommand { get; }

    public ICommand BeginResizeCommand { get; }

    public ICommand ResizeDeltaCommand { get; }

    public ICommand CompleteResizeCommand { get; }

    public ICommand OpenEditorCommand => _openEditorCommand;

    public Rect GetBounds() => new(Left, Top, Width, Height);

    public void UpdateDefinition(CardDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (!string.Equals(definition.Id, _definition.Id, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Cannot replace card definition with a different identifier.");
        }

        RefreshDefinition(definition, false);
    }

    internal void RequestSelection(SelectionModifier modifier)
    {
        if (!string.IsNullOrWhiteSpace(Id))
        {
            _selectionBehavior.Select(Id, modifier);
        }
    }

    internal void ConfigureEditor(Action<CardPresenter>? requestEditor, bool isAvailable)
    {
        _requestEditor = requestEditor;
        IsEditorAvailable = isAvailable && requestEditor is not null;
    }

    internal SquadRosterState GetSquadRosterState()
    {
        if (_definition.SquadTable is null)
        {
            throw new InvalidOperationException("The card does not contain squad roster data.");
        }

        return _squadRosterState ??= new SquadRosterState(_definition.SquadTable);
    }

    internal void UpdateGeometry(int column, int row, int columnSpan, int rowSpan)
    {
        if (_column != column)
        {
            _column = column;
            OnPropertyChanged(nameof(Left));
        }

        if (_row != row)
        {
            _row = row;
            OnPropertyChanged(nameof(Top));
        }

        if (_columnSpan != columnSpan)
        {
            _columnSpan = columnSpan;
            OnPropertyChanged(nameof(Width));
        }

        if (_rowSpan != rowSpan)
        {
            _rowSpan = rowSpan;
            OnPropertyChanged(nameof(Height));
        }
    }

    internal void SetVisibility(bool visible)
    {
        IsVisible = visible;
    }

    internal void SetSelected(bool selected)
    {
        IsSelected = selected;
    }

    internal bool TryGetFormationPlayer(string playerId, out FormationPlayerViewModel player)
        => _formationPlayerLookup.TryGetValue(playerId, out player!);

    internal IReadOnlyList<FormationPlayerState> GetFormationPlayerStates()
    {
        if (!HasFormationPlayers)
        {
            return System.Array.Empty<FormationPlayerState>();
        }

        var states = new List<FormationPlayerState>(FormationPlayers.Count);
        foreach (var player in FormationPlayers)
        {
            states.Add(new FormationPlayerState(player.Id, player.NormalizedX, player.NormalizedY));
        }

        return states;
    }

    internal void ApplyFormationState(IReadOnlyList<FormationPlayerState> states)
    {
        if (!HasFormationPlayers || states is null || states.Count == 0)
        {
            return;
        }

        foreach (var state in states)
        {
            if (_formationPlayerLookup.TryGetValue(state.PlayerId, out var player))
            {
                player.UpdateNormalizedPosition(state.X, state.Y);
            }
        }
    }

    internal void UpdateFormationPlayer(string playerId, double normalizedX, double normalizedY)
    {
        if (_formationPlayerLookup.TryGetValue(playerId, out var player))
        {
            player.UpdateNormalizedPosition(normalizedX, normalizedY);
        }
    }

    private void RefreshDefinition(CardDefinition definition, bool isInitial)
    {
        _definition = definition;

        if (!isInitial)
        {
            OnPropertyChanged(nameof(Definition));
            OnPropertyChanged(nameof(Title));
            OnPropertyChanged(nameof(Subtitle));
            OnPropertyChanged(nameof(Description));
            OnPropertyChanged(nameof(PillText));
            OnPropertyChanged(nameof(MetricValue));
            OnPropertyChanged(nameof(MetricLabel));
            OnPropertyChanged(nameof(Kind));
            OnPropertyChanged(nameof(ContentType));
            OnPropertyChanged(nameof(HasContentHost));
            OnPropertyChanged(nameof(PrimaryEntityId));
            OnPropertyChanged(nameof(HasSubtitle));
            OnPropertyChanged(nameof(HasDescription));
            OnPropertyChanged(nameof(HasPill));
            OnPropertyChanged(nameof(HasMetric));
        }

        IReadOnlyList<CardListItemViewModel> listItems;
        if (definition.ListItems is { Count: > 0 })
        {
            listItems = new ReadOnlyCollection<CardListItemViewModel>(CreateListItems(definition.ListItems));
        }
        else
        {
            listItems = System.Array.Empty<CardListItemViewModel>();
        }

        if (!ReferenceEquals(ListItems, listItems))
        {
            ListItems = listItems;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(ListItems));
                OnPropertyChanged(nameof(HasListItems));
            }
        }

        ReadOnlyCollection<FormationLineViewModel> formationLines;
        ReadOnlyCollection<FormationPlayerViewModel> formationPlayers;
        if (definition.FormationLines is { Count: > 0 })
        {
            _formationPlayerLookup.Clear();
            var formation = CreateFormationViewModels(definition.FormationLines, _interactionBehavior, this);
            formationLines = formation.Lines;
            formationPlayers = formation.Players;
        }
        else
        {
            _formationPlayerLookup.Clear();
            formationLines = new ReadOnlyCollection<FormationLineViewModel>(System.Array.Empty<FormationLineViewModel>());
            formationPlayers = new ReadOnlyCollection<FormationPlayerViewModel>(System.Array.Empty<FormationPlayerViewModel>());
        }

        if (!ReferenceEquals(FormationLines, formationLines))
        {
            FormationLines = formationLines;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(FormationLines));
                OnPropertyChanged(nameof(HasFormation));
            }
        }

        if (!ReferenceEquals(FormationPlayers, formationPlayers))
        {
            FormationPlayers = formationPlayers;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(FormationPlayers));
                OnPropertyChanged(nameof(HasFormationPlayers));
            }
        }

        IReadOnlyList<ChartSeriesViewModel> chartSeries;
        if (definition.ChartSeries is { Count: > 0 })
        {
            chartSeries = new ReadOnlyCollection<ChartSeriesViewModel>(CreateChartSeries(definition.ChartSeries));
        }
        else
        {
            chartSeries = System.Array.Empty<ChartSeriesViewModel>();
        }

        if (!ReferenceEquals(ChartSeries, chartSeries))
        {
            ChartSeries = chartSeries;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(ChartSeries));
                OnPropertyChanged(nameof(HasChartSeries));
            }
        }

        var gauge = definition.Gauge is not null ? new GaugeViewModel(definition.Gauge) : null;
        if (!Equals(Gauge, gauge))
        {
            Gauge = gauge;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(Gauge));
                OnPropertyChanged(nameof(HasGauge));
            }
        }

        var forecast = definition.Forecast is not null
            ? new FinanceForecastViewModel(definition.Forecast, _clubDataService)
            : null;
        if (!Equals(Forecast, forecast))
        {
            Forecast = forecast;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(Forecast));
                OnPropertyChanged(nameof(HasForecast));
            }
        }

        var workloadHeatmap = definition.WorkloadHeatmap is not null
            ? new TrainingWorkloadHeatmapViewModel(definition.WorkloadHeatmap)
            : null;
        if (!Equals(WorkloadHeatmap, workloadHeatmap))
        {
            WorkloadHeatmap = workloadHeatmap;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(WorkloadHeatmap));
                OnPropertyChanged(nameof(HasWorkloadHeatmap));
            }
        }

        var moraleHeatmap = definition.MoraleHeatmap is not null
            ? new MoraleHeatmapViewModel(definition.MoraleHeatmap)
            : null;
        if (!Equals(MoraleHeatmap, moraleHeatmap))
        {
            MoraleHeatmap = moraleHeatmap;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(MoraleHeatmap));
                OnPropertyChanged(nameof(HasMoraleHeatmap));
            }
        }

        var trainingCalendar = definition.TrainingCalendar is not null
            ? new TrainingCalendarViewModel(definition.TrainingCalendar, _clubDataService)
            : null;
        if (!Equals(TrainingCalendar, trainingCalendar))
        {
            TrainingCalendar = trainingCalendar;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(TrainingCalendar));
                OnPropertyChanged(nameof(HasTrainingCalendar));
            }
        }

        var fixtureCalendar = definition.FixtureCalendar is not null
            ? new FixtureCalendarViewModel(definition.FixtureCalendar, _clubDataService)
            : null;
        if (!Equals(FixtureCalendar, fixtureCalendar))
        {
            FixtureCalendar = fixtureCalendar;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(FixtureCalendar));
                OnPropertyChanged(nameof(HasFixtureCalendar));
            }
        }

        var negotiations = definition.Negotiations is not null
            ? new TransferNegotiationCardViewModel(definition.Negotiations)
            : null;
        if (!Equals(Negotiations, negotiations))
        {
            Negotiations = negotiations;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(Negotiations));
                OnPropertyChanged(nameof(HasNegotiations));
            }
        }

        var scoutAssignments = definition.ScoutAssignments is not null
            ? new ScoutAssignmentBoardViewModel(definition.ScoutAssignments)
            : null;
        if (!Equals(ScoutAssignments, scoutAssignments))
        {
            ScoutAssignments = scoutAssignments;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(ScoutAssignments));
                OnPropertyChanged(nameof(HasScoutAssignments));
            }
        }

        var shortlistBoard = definition.ShortlistBoard is not null
            ? new ShortlistBoardViewModel(definition.ShortlistBoard)
            : null;
        if (!Equals(ShortlistBoard, shortlistBoard))
        {
            ShortlistBoard = shortlistBoard;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(ShortlistBoard));
                OnPropertyChanged(nameof(HasShortlistBoard));
            }
        }

        var trainingUnitBoard = definition.TrainingUnitBoard is not null
            ? new TrainingUnitBoardViewModel(definition.TrainingUnitBoard)
            : null;
        if (!Equals(TrainingUnitBoard, trainingUnitBoard))
        {
            TrainingUnitBoard = trainingUnitBoard;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(TrainingUnitBoard));
            }
        }

        var trainingProgression = definition.TrainingProgression is not null
            ? new TrainingProgressionViewModel(definition.TrainingProgression)
            : null;
        if (!Equals(TrainingProgression, trainingProgression))
        {
            TrainingProgression = trainingProgression;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(TrainingProgression));
                OnPropertyChanged(nameof(HasTrainingProgression));
            }
        }

        var shotMap = definition.ShotMap is not null
            ? new ShotMapViewModel(definition.ShotMap)
            : null;
        if (!Equals(ShotMap, shotMap))
        {
            ShotMap = shotMap;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(ShotMap));
                OnPropertyChanged(nameof(HasShotMap));
            }
        }

        var medicalTimeline = definition.MedicalTimeline is not null
            ? new MedicalTimelineViewModel(definition.MedicalTimeline)
            : null;
        if (!Equals(MedicalTimeline, medicalTimeline))
        {
            MedicalTimeline = medicalTimeline;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(MedicalTimeline));
                OnPropertyChanged(nameof(HasMedicalTimeline));
            }
        }

        IReadOnlyList<TimelineEntryViewModel> timelineEntries;
        if (definition.Timeline is { Count: > 0 })
        {
            timelineEntries = new ReadOnlyCollection<TimelineEntryViewModel>(CreateTimeline(definition.Timeline));
        }
        else
        {
            timelineEntries = System.Array.Empty<TimelineEntryViewModel>();
        }

        if (!ReferenceEquals(TimelineEntries, timelineEntries))
        {
            TimelineEntries = timelineEntries;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(TimelineEntries));
                OnPropertyChanged(nameof(HasTimeline));
            }
        }

        var financeCashflow = definition.FinanceCashflow is not null
            ? new FinanceCashflowViewModel(definition.FinanceCashflow)
            : null;
        if (!Equals(FinanceCashflow, financeCashflow))
        {
            FinanceCashflow = financeCashflow;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(FinanceCashflow));
            }
        }

        var financeBudgetAllocator = definition.FinanceBudgetAllocator is not null
            ? new FinanceBudgetAllocatorViewModel(definition.FinanceBudgetAllocator, _clubDataService)
            : null;
        if (!Equals(FinanceBudgetAllocator, financeBudgetAllocator))
        {
            FinanceBudgetAllocator = financeBudgetAllocator;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(FinanceBudgetAllocator));
            }
        }

        var financeScenario = definition.FinanceScenario is not null
            ? new FinanceScenarioBoardViewModel(definition.FinanceScenario, _clubDataService)
            : null;
        if (!Equals(FinanceScenario, financeScenario))
        {
            FinanceScenario = financeScenario;
            if (!isInitial)
            {
                OnPropertyChanged(nameof(FinanceScenario));
            }
        }
    }

    private static IList<CardListItemViewModel> CreateListItems(IReadOnlyList<CardListItem> items)
    {
        var list = new List<CardListItemViewModel>(items.Count);
        foreach (var item in items)
        {
            list.Add(new CardListItemViewModel(item));
        }

        return list;
    }

    private static (ReadOnlyCollection<FormationLineViewModel> Lines, ReadOnlyCollection<FormationPlayerViewModel> Players) CreateFormationViewModels(
        IReadOnlyList<FormationLineDefinition> definitions,
        ICardInteractionBehavior interactionBehavior,
        CardPresenter owner)
    {
        var allPlayers = new List<FormationPlayerViewModel>();
        var lines = new List<FormationLineViewModel>(definitions.Count);

        foreach (var definition in definitions)
        {
            var linePlayers = new List<FormationPlayerViewModel>();
            foreach (var player in definition.Players)
            {
                var playerViewModel = new FormationPlayerViewModel(
                    player.Id,
                    player.Name,
                    player.X,
                    player.Y,
                    interactionBehavior,
                    owner.Id);
                linePlayers.Add(playerViewModel);
                allPlayers.Add(playerViewModel);
                owner._formationPlayerLookup[player.Id] = playerViewModel;
            }

            lines.Add(new FormationLineViewModel(definition.Role, linePlayers));
        }

        return (
            new ReadOnlyCollection<FormationLineViewModel>(lines),
            new ReadOnlyCollection<FormationPlayerViewModel>(allPlayers));
    }

    private static IList<ChartSeriesViewModel> CreateChartSeries(IReadOnlyList<ChartSeriesDefinition> definitions)
    {
        var series = new List<ChartSeriesViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            series.Add(new ChartSeriesViewModel(definition));
        }

        return series;
    }

    private static IList<TimelineEntryViewModel> CreateTimeline(IReadOnlyList<TimelineEntryDefinition> definitions)
    {
        var entries = new List<TimelineEntryViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            entries.Add(new TimelineEntryViewModel(definition));
        }

        return entries;
    }
}

internal static class BrushUtilities
{
    private static readonly BrushConverter Converter = new();

    public static SolidColorBrush CreateFrozenBrush(string color, SolidColorBrush? fallback = null)
    {
        if (string.IsNullOrWhiteSpace(color))
        {
            return fallback ?? Brushes.Transparent;
        }

        try
        {
            var brush = (SolidColorBrush)Converter.ConvertFromString(color)!;
            if (!brush.IsFrozen)
            {
                brush.Freeze();
            }

            return brush;
        }
        catch
        {
            return fallback ?? Brushes.Transparent;
        }
    }
}

public sealed class ChartSeriesViewModel
{
    private readonly ChartSeriesDefinition _definition;

    public ChartSeriesViewModel(ChartSeriesDefinition definition)
    {
        _definition = definition;
        Points = new ReadOnlyCollection<ChartDataPointViewModel>(CreatePoints(definition.Points));
        Stroke = BrushUtilities.CreateFrozenBrush(definition.Color, Brushes.DeepSkyBlue);
    }

    public string Name => _definition.Name;

    public IReadOnlyList<ChartDataPointViewModel> Points { get; }

    public Brush Stroke { get; }

    public double Minimum => Points.Count == 0 ? 0 : Points.Min(p => p.Value);

    public double Maximum => Points.Count == 0 ? 0 : Points.Max(p => p.Value);

    private static IList<ChartDataPointViewModel> CreatePoints(IReadOnlyList<ChartDataPointDefinition> points)
    {
        var list = new List<ChartDataPointViewModel>(points.Count);
        foreach (var point in points)
        {
            list.Add(new ChartDataPointViewModel(point));
        }

        return list;
    }
}

public sealed class ChartDataPointViewModel
{
    private readonly ChartDataPointDefinition _definition;

    public ChartDataPointViewModel(ChartDataPointDefinition definition)
    {
        _definition = definition;
    }

    public string Label => _definition.Label;

    public double Value => _definition.Value;
}

public sealed class GaugeViewModel
{
    private readonly GaugeDefinition _definition;

    public GaugeViewModel(GaugeDefinition definition)
    {
        _definition = definition;
        Bands = new ReadOnlyCollection<GaugeBandViewModel>(CreateBands(definition.Bands));
    }

    public double Minimum => _definition.Minimum;

    public double Maximum => _definition.Maximum;

    public double Value => _definition.Value;

    public double Target => _definition.Target;

    public string Unit => _definition.Unit;

    public IReadOnlyList<GaugeBandViewModel> Bands { get; }

    public string DisplayValue => _definition.DisplayValue ?? $"{Value:0.#}{Unit}";

    public string? DisplaySummary => _definition.DisplaySummary;

    public string? DisplayPill => _definition.DisplayPill;

    public bool HasDisplayPill => !string.IsNullOrWhiteSpace(DisplayPill);

    private static IList<GaugeBandViewModel> CreateBands(IReadOnlyList<GaugeBandDefinition> bands)
    {
        var list = new List<GaugeBandViewModel>(bands.Count);
        foreach (var band in bands)
        {
            list.Add(new GaugeBandViewModel(band));
        }

        return list;
    }
}

public sealed class GaugeBandViewModel
{
    private readonly GaugeBandDefinition _definition;

    public GaugeBandViewModel(GaugeBandDefinition definition)
    {
        _definition = definition;
        Brush = BrushUtilities.CreateFrozenBrush(definition.Color, Brushes.Gray);
    }

    public string Label => _definition.Label;

    public double Start => _definition.Start;

    public double End => _definition.End;

    public Brush Brush { get; }
}

public sealed class TimelineEntryViewModel
{
    private readonly TimelineEntryDefinition _definition;

    public TimelineEntryViewModel(TimelineEntryDefinition definition)
    {
        _definition = definition;
    }

    public string Label => _definition.Label;

    public string? Detail => _definition.Detail;

    public double Position => _definition.Position;

    public string? Pill => _definition.Pill;

    public string? Accent => _definition.Accent;

    public bool HasDetail => !string.IsNullOrWhiteSpace(Detail);

    public bool HasPill => !string.IsNullOrWhiteSpace(Pill);

    public Brush? AccentBrush => string.IsNullOrWhiteSpace(Accent)
        ? null
        : BrushUtilities.CreateFrozenBrush(Accent!, Brushes.SlateBlue);
}


public sealed class ScoutAssignmentBoardViewModel
{
    public ScoutAssignmentBoardViewModel(ScoutAssignmentBoardDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Assignments = new ReadOnlyCollection<ScoutAssignmentRowViewModel>(
            definition.Assignments?.Select(static assignment => new ScoutAssignmentRowViewModel(assignment)).ToList()
            ?? new List<ScoutAssignmentRowViewModel>());

        StageOptions = new ReadOnlyCollection<string>(
            definition.StageOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>());

        PriorityOptions = new ReadOnlyCollection<string>(
            definition.PriorityOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>());

        ScoutOptions = new ReadOnlyCollection<ScoutOptionViewModel>(
            definition.ScoutOptions?.Select(static option => new ScoutOptionViewModel(option)).ToList()
            ?? new List<ScoutOptionViewModel>());

        TotalAssignments = Assignments.Count;
        HighPriorityAssignments = Assignments.Count(static assignment => assignment.IsHighPriority);
        AwaitingReportAssignments = Assignments.Count(static assignment => assignment.IsAwaitingReport);
    }

    public IReadOnlyList<ScoutAssignmentRowViewModel> Assignments { get; }

    public IReadOnlyList<string> StageOptions { get; }

    public IReadOnlyList<string> PriorityOptions { get; }

    public IReadOnlyList<ScoutOptionViewModel> ScoutOptions { get; }

    public int TotalAssignments { get; }

    public int HighPriorityAssignments { get; }

    public int AwaitingReportAssignments { get; }

    public bool HasAssignments => Assignments.Count > 0;
}

public sealed class ScoutAssignmentRowViewModel
{
    private readonly ScoutAssignmentDefinition _definition;

    public ScoutAssignmentRowViewModel(ScoutAssignmentDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        PriorityBrush = CreatePriorityBrush(definition.Priority);
        StageBrush = CreateStageBrush(definition.Stage);
    }

    public string Id => _definition.Id;

    public string Focus => _definition.Focus;

    public string Role => _definition.Role;

    public string Region => _definition.Region;

    public string Priority => _definition.Priority;

    public string Stage => _definition.Stage;

    public string Deadline => _definition.Deadline;

    public string Scout => _definition.Scout;

    public string? Notes => _definition.Notes;

    public bool HasNotes => !string.IsNullOrWhiteSpace(Notes);

    public Brush PriorityBrush { get; }

    public Brush StageBrush { get; }

    public bool IsHighPriority => string.Equals(Priority, "High", StringComparison.OrdinalIgnoreCase);

    public bool IsAwaitingReport => string.Equals(Stage, "Awaiting Report", StringComparison.OrdinalIgnoreCase);

    private static Brush CreatePriorityBrush(string priority)
    {
        if (string.Equals(priority, "High", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FFE05D5D", Brushes.IndianRed);
        }

        if (string.Equals(priority, "Medium", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF3AA0FF", Brushes.SteelBlue);
        }

        if (string.Equals(priority, "Low", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF2EC4B6", Brushes.CadetBlue);
        }

        return BrushUtilities.CreateFrozenBrush("#FF2B3545", Brushes.DimGray);
    }

    private static Brush CreateStageBrush(string stage)
    {
        if (string.Equals(stage, "New", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF2EC4B6", Brushes.Teal);
        }

        if (string.Equals(stage, "In Progress", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF3AA0FF", Brushes.DodgerBlue);
        }

        if (string.Equals(stage, "Awaiting Report", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FFE4B123", Brushes.Goldenrod);
        }

        if (string.Equals(stage, "Complete", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF4CE577", Brushes.SeaGreen);
        }

        return BrushUtilities.CreateFrozenBrush("#FF2B3545", Brushes.SlateGray);
    }
}

public sealed class ScoutOptionViewModel
{
    private readonly ScoutOptionDefinition _definition;

    public ScoutOptionViewModel(ScoutOptionDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
    }

    public string Id => _definition.Id;

    public string Name => _definition.Name;

    public string Region => _definition.Region;

    public string Availability => _definition.Availability;

    public string Display => string.IsNullOrWhiteSpace(Availability)
        ? $"{Name} • {Region}"
        : $"{Name} • {Region} ({Availability})";
}

public sealed class ShortlistBoardViewModel
{
    public ShortlistBoardViewModel(ShortlistBoardDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Players = new ReadOnlyCollection<ShortlistPlayerRowViewModel>(
            definition.Players?.Select(static player => new ShortlistPlayerRowViewModel(player)).ToList()
            ?? new List<ShortlistPlayerRowViewModel>());

        StatusOptions = new ReadOnlyCollection<string>(
            definition.StatusOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>());

        ActionOptions = new ReadOnlyCollection<string>(
            definition.ActionOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>());

        MakeOfferCount = Players.Count(static player => player.IsMakeOffer);
        ScoutFollowUpCount = Players.Count(static player => player.RequiresScoutFollowUp);
        PriorityTargetCount = Players.Count(static player => player.IsPriorityTarget);
    }

    public IReadOnlyList<ShortlistPlayerRowViewModel> Players { get; }

    public IReadOnlyList<string> StatusOptions { get; }

    public IReadOnlyList<string> ActionOptions { get; }

    public int MakeOfferCount { get; }

    public int ScoutFollowUpCount { get; }

    public int PriorityTargetCount { get; }

    public bool HasPlayers => Players.Count > 0;
}

public sealed class ShortlistPlayerRowViewModel
{
    private readonly ShortlistPlayerDefinition _definition;

    public ShortlistPlayerRowViewModel(ShortlistPlayerDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        StatusBrush = CreateStatusBrush(definition.Status);
        ActionBrush = CreateActionBrush(definition.Action);
    }

    public string Id => _definition.Id;

    public string Name => _definition.Name;

    public string Position => _definition.Position;

    public string Status => _definition.Status;

    public string Action => _definition.Action;

    public string? Priority => _definition.Priority;

    public string? Notes => _definition.Notes;

    public bool HasPriority => !string.IsNullOrWhiteSpace(Priority);

    public bool HasNotes => !string.IsNullOrWhiteSpace(Notes);

    public Brush StatusBrush { get; }

    public Brush ActionBrush { get; }

    public bool IsMakeOffer => string.Equals(Status, "Make Offer", StringComparison.OrdinalIgnoreCase);

    public bool RequiresScoutFollowUp => string.Equals(Action, "Assign Scout", StringComparison.OrdinalIgnoreCase)
        || string.Equals(Status, "Scout", StringComparison.OrdinalIgnoreCase);

    public bool IsPriorityTarget => string.Equals(Priority, "Priority", StringComparison.OrdinalIgnoreCase);

    private static Brush CreateStatusBrush(string status)
    {
        if (string.Equals(status, "Make Offer", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF2EC4B6", Brushes.Teal);
        }

        if (string.Equals(status, "Monitor", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF3AA0FF", Brushes.SteelBlue);
        }

        if (string.Equals(status, "Scout", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FFE4B123", Brushes.DarkGoldenrod);
        }

        if (string.Equals(status, "No Action", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF2B3545", Brushes.Gray);
        }

        return BrushUtilities.CreateFrozenBrush("#FF2B3545", Brushes.DimGray);
    }

    private static Brush CreateActionBrush(string action)
    {
        if (string.Equals(action, "Advance", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF4CE577", Brushes.SeaGreen);
        }

        if (string.Equals(action, "Assign Scout", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FF3AA0FF", Brushes.DodgerBlue);
        }

        if (string.Equals(action, "Hold", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FFE4B123", Brushes.DarkGoldenrod);
        }

        if (string.Equals(action, "Remove", StringComparison.OrdinalIgnoreCase))
        {
            return BrushUtilities.CreateFrozenBrush("#FFE05D5D", Brushes.IndianRed);
        }

        return BrushUtilities.CreateFrozenBrush("#FF2B3545", Brushes.DimGray);
    }
}

public sealed class MoraleHeatmapViewModel
{
    public MoraleHeatmapViewModel(MoraleHeatmapDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        var columns = definition.Columns?.ToList() ?? new List<string>();
        var columnSet = new HashSet<string>(columns, StringComparer.OrdinalIgnoreCase);

        if (definition.Rows is { Count: > 0 })
        {
            foreach (var row in definition.Rows)
            {
                if (row.Cells is { Count: > 0 })
                {
                    foreach (var cell in row.Cells)
                    {
                        if (!string.IsNullOrWhiteSpace(cell.Column) && columnSet.Add(cell.Column))
                        {
                            columns.Add(cell.Column);
                        }
                    }
                }
            }
        }

        Columns = new ReadOnlyCollection<string>(columns);

        var intensities = new Dictionary<string, MoraleIntensityViewModel>(StringComparer.OrdinalIgnoreCase);
        if (definition.Intensities is { Count: > 0 })
        {
            foreach (var intensity in definition.Intensities)
            {
                intensities[intensity.Key] = new MoraleIntensityViewModel(intensity);
            }
        }

        Intensities = new ReadOnlyCollection<MoraleIntensityViewModel>(intensities.Values.ToList());

        if (definition.Rows is { Count: > 0 })
        {
            var rows = new List<MoraleHeatmapRowViewModel>(definition.Rows.Count);
            foreach (var row in definition.Rows)
            {
                rows.Add(new MoraleHeatmapRowViewModel(row, Columns, intensities));
            }

            Rows = new ReadOnlyCollection<MoraleHeatmapRowViewModel>(rows);
        }
        else
        {
            Rows = Array.Empty<MoraleHeatmapRowViewModel>();
        }

        LegendTitle = definition.LegendTitle;
        LegendSubtitle = definition.LegendSubtitle;
    }

    public IReadOnlyList<string> Columns { get; }

    public IReadOnlyList<MoraleHeatmapRowViewModel> Rows { get; }

    public IReadOnlyList<MoraleIntensityViewModel> Intensities { get; }

    public string? LegendTitle { get; }

    public string? LegendSubtitle { get; }

    public bool HasLegendTitle => !string.IsNullOrWhiteSpace(LegendTitle);

    public bool HasLegendSubtitle => !string.IsNullOrWhiteSpace(LegendSubtitle);

    public bool HasLegend => Intensities.Count > 0;
}

public sealed class MoraleHeatmapRowViewModel
{
    public MoraleHeatmapRowViewModel(
        MoraleHeatmapRowDefinition definition,
        IReadOnlyList<string> columns,
        IReadOnlyDictionary<string, MoraleIntensityViewModel> intensities)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Label = definition.Label;

        var cells = new List<MoraleHeatmapCellViewModel>(columns.Count);
        var lookup = definition.Cells?.ToDictionary(cell => cell.Column, StringComparer.OrdinalIgnoreCase)
                     ?? new Dictionary<string, MoraleHeatmapCellDefinition>(StringComparer.OrdinalIgnoreCase);

        foreach (var column in columns)
        {
            lookup.TryGetValue(column, out var cell);
            cells.Add(new MoraleHeatmapCellViewModel(column, cell, intensities));
        }

        Cells = new ReadOnlyCollection<MoraleHeatmapCellViewModel>(cells);
    }

    public string Label { get; }

    public IReadOnlyList<MoraleHeatmapCellViewModel> Cells { get; }
}

public sealed class MoraleHeatmapCellViewModel
{
    private readonly MoraleHeatmapCellDefinition? _definition;
    private readonly MoraleIntensityViewModel? _intensity;

    public MoraleHeatmapCellViewModel(
        string column,
        MoraleHeatmapCellDefinition? definition,
        IReadOnlyDictionary<string, MoraleIntensityViewModel> intensities)
    {
        Column = column;
        _definition = definition;

        if (definition is not null && intensities.TryGetValue(definition.IntensityKey, out var intensity))
        {
            _intensity = intensity;
        }
    }

    public string Column { get; }

    public string DisplayLabel => string.IsNullOrWhiteSpace(_definition?.Label) ? "—" : _definition!.Label;

    public string IntensityDisplay => _intensity?.DisplayName ?? "Unassigned";

    public string? Detail => _definition?.Detail;

    public bool HasDetail => !string.IsNullOrWhiteSpace(Detail);

    public Brush BackgroundBrush => _intensity?.Brush ?? BrushUtilities.CreateFrozenBrush("#1A2534", Brushes.DimGray);

    public string Tooltip
    {
        get
        {
            if (_definition is null)
            {
                return $"{Column}: No morale data";
            }

            var detail = string.IsNullOrWhiteSpace(_definition.Detail) ? string.Empty : $"\n{_definition.Detail}";
            var descriptor = _intensity?.Description;
            var descriptorText = string.IsNullOrWhiteSpace(descriptor) ? string.Empty : $"\n{descriptor}";
            return $"{_definition.Label} — {IntensityDisplay}{detail}{descriptorText}";
        }
    }
}

public sealed class MoraleIntensityViewModel
{
    private readonly MoraleIntensityDefinition _definition;

    public MoraleIntensityViewModel(MoraleIntensityDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        Brush = BrushUtilities.CreateFrozenBrush(definition.Color, Brushes.SlateBlue);
    }

    public string Key => _definition.Key;

    public string DisplayName => _definition.DisplayName;

    public string? Description => _definition.Description;

    public Brush Brush { get; }
}

public sealed class TrainingWorkloadHeatmapViewModel
{
    public TrainingWorkloadHeatmapViewModel(TrainingWorkloadHeatmapDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Columns = new ReadOnlyCollection<string>(definition.Columns?.ToList() ?? new List<string>());

        var intensities = new Dictionary<string, TrainingIntensityLevelViewModel>(StringComparer.OrdinalIgnoreCase);
        if (definition.Intensities is not null)
        {
            foreach (var intensity in definition.Intensities)
            {
                intensities[intensity.Key] = new TrainingIntensityLevelViewModel(intensity);
            }
        }

        Intensities = new ReadOnlyCollection<TrainingIntensityLevelViewModel>(intensities.Values.ToList());

        if (definition.Rows is not null)
        {
            var rows = new List<TrainingWorkloadHeatmapRowViewModel>(definition.Rows.Count);
            foreach (var row in definition.Rows)
            {
                rows.Add(new TrainingWorkloadHeatmapRowViewModel(row, Columns, intensities));
            }

            Rows = new ReadOnlyCollection<TrainingWorkloadHeatmapRowViewModel>(rows);
        }
        else
        {
            Rows = Array.Empty<TrainingWorkloadHeatmapRowViewModel>();
        }

        LegendTitle = definition.LegendTitle;
        LegendSubtitle = definition.LegendSubtitle;
    }

    public IReadOnlyList<string> Columns { get; }

    public IReadOnlyList<TrainingWorkloadHeatmapRowViewModel> Rows { get; }

    public IReadOnlyList<TrainingIntensityLevelViewModel> Intensities { get; }

    public string? LegendTitle { get; }

    public string? LegendSubtitle { get; }

    public bool HasLegendTitle => !string.IsNullOrWhiteSpace(LegendTitle);

    public bool HasLegendSubtitle => !string.IsNullOrWhiteSpace(LegendSubtitle);

    public bool HasLegend => Intensities.Count > 0;
}

public sealed class TrainingWorkloadHeatmapRowViewModel
{
    public TrainingWorkloadHeatmapRowViewModel(
        TrainingWorkloadRowDefinition definition,
        IReadOnlyList<string> columns,
        IReadOnlyDictionary<string, TrainingIntensityLevelViewModel> intensities)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Label = definition.Label;

        var cells = new List<TrainingWorkloadHeatmapCellViewModel>(columns.Count);
        var lookup = definition.Cells?.ToDictionary(cell => cell.Column, StringComparer.OrdinalIgnoreCase)
                     ?? new Dictionary<string, TrainingWorkloadCellDefinition>(StringComparer.OrdinalIgnoreCase);

        foreach (var column in columns)
        {
            lookup.TryGetValue(column, out var cell);
            cells.Add(new TrainingWorkloadHeatmapCellViewModel(column, cell, intensities));
        }

        Cells = new ReadOnlyCollection<TrainingWorkloadHeatmapCellViewModel>(cells);
    }

    public string Label { get; }

    public IReadOnlyList<TrainingWorkloadHeatmapCellViewModel> Cells { get; }
}

public sealed class TrainingWorkloadHeatmapCellViewModel
{
    private readonly TrainingWorkloadCellDefinition? _definition;
    private readonly TrainingIntensityLevelViewModel? _intensity;

    public TrainingWorkloadHeatmapCellViewModel(
        string column,
        TrainingWorkloadCellDefinition? definition,
        IReadOnlyDictionary<string, TrainingIntensityLevelViewModel> intensities)
    {
        Column = column;
        _definition = definition;

        if (definition is not null && intensities.TryGetValue(definition.IntensityKey, out var intensity))
        {
            _intensity = intensity;
        }
    }

    public string Column { get; }

    public double Load => _definition?.Load ?? 0;

    public string DisplayLoad => Load.Equals(0) ? "0" : Load.ToString("0.#");

    public string IntensityDisplay => _intensity?.DisplayName ?? "Unassigned";

    public Brush BackgroundBrush => _intensity?.Brush ?? BrushUtilities.CreateFrozenBrush("#1A2534", Brushes.DimGray);

    public string Tooltip => _definition is null
        ? $"{Column}: No session load configured"
        : string.IsNullOrWhiteSpace(_definition.Detail)
            ? $"{Column}: {IntensityDisplay} ({DisplayLoad})"
            : $"{Column}: {IntensityDisplay} ({DisplayLoad})\n{_definition.Detail}";
}

public sealed class TrainingIntensityLevelViewModel
{
    private readonly TrainingIntensityLevelDefinition _definition;

    public TrainingIntensityLevelViewModel(TrainingIntensityLevelDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        Brush = BrushUtilities.CreateFrozenBrush(definition.Color, Brushes.SlateBlue);
    }

    public string Key => _definition.Key;

    public string DisplayName => _definition.DisplayName;

    public Brush Brush { get; }

    public double LoadValue => _definition.LoadValue;
}

public sealed class CardListItemViewModel
{
    private readonly CardListItem _model;

    public CardListItemViewModel(CardListItem model)
    {
        _model = model;
    }

    public string Primary => _model.Primary;

    public string? Secondary => _model.Secondary;

    public string? Tertiary => _model.Tertiary;

    public string? Accent => _model.Accent;

    public bool HasSecondary => !string.IsNullOrWhiteSpace(Secondary);

    public bool HasTertiary => !string.IsNullOrWhiteSpace(Tertiary);

    public bool HasAccent => !string.IsNullOrWhiteSpace(Accent);
}

public sealed class FormationLineViewModel
{
    public FormationLineViewModel(string role, IReadOnlyList<FormationPlayerViewModel> players)
    {
        Role = role;
        Players = new ReadOnlyCollection<FormationPlayerViewModel>(new List<FormationPlayerViewModel>(players));
    }

    public string Role { get; }

    public IReadOnlyList<FormationPlayerViewModel> Players { get; }
}

public sealed class FormationPlayerViewModel : ObservableObject
{
    private readonly ICardInteractionBehavior _interactionBehavior;
    private readonly string _cardId;
    private double _normalizedX;
    private double _normalizedY;

    public FormationPlayerViewModel(
        string id,
        string name,
        double normalizedX,
        double normalizedY,
        ICardInteractionBehavior interactionBehavior,
        string cardId)
    {
        Id = id;
        Name = name;
        _normalizedX = normalizedX;
        _normalizedY = normalizedY;
        _interactionBehavior = interactionBehavior;
        _cardId = cardId;

        BeginDragCommand = new RelayCommand(_ => _interactionBehavior.BeginPlayerDrag(_cardId, Id));
        DragDeltaCommand = new RelayCommand(parameter =>
        {
            if (parameter is FormationPlayerDragDelta delta)
            {
                _interactionBehavior.UpdatePlayerDrag(_cardId, Id, delta);
            }
        });
        CompleteDragCommand = new RelayCommand(parameter =>
        {
            var completed = parameter as FormationPlayerDragCompleted ?? new FormationPlayerDragCompleted(false);
            _interactionBehavior.CompletePlayerDrag(_cardId, Id, completed);
        });
    }

    public string Id { get; }

    public string Name { get; }

    public double NormalizedX
    {
        get => _normalizedX;
        private set => SetProperty(ref _normalizedX, value);
    }

    public double NormalizedY
    {
        get => _normalizedY;
        private set => SetProperty(ref _normalizedY, value);
    }

    public ICommand BeginDragCommand { get; }

    public ICommand DragDeltaCommand { get; }

    public ICommand CompleteDragCommand { get; }

    internal void UpdateNormalizedPosition(double normalizedX, double normalizedY)
    {
        NormalizedX = normalizedX;
        NormalizedY = normalizedY;
    }
}
