using System.Collections.Generic;
using FMUI.Wpf.UI.Cards;

namespace FMUI.Wpf.Models;

public enum CardKind
{
    Metric,
    List,
    Formation,
    Fixture,
    Status,
    LineChart,
    Gauge,
    Timeline,
    TrainingCalendar,
    Forecast,
    WorkloadHeatmap,
    MoraleHeatmap,
    SquadTable,
    FixtureCalendar,
    TransferNegotiation,
    ScoutAssignments,
    ShortlistBoard,
    TrainingUnitBoard,
    TrainingProgression,
    ShotMap,
    MedicalTimeline,
    ClubVisionRoadmap,
    ClubVisionExpectations,
    FinanceCashflow,
    FinanceBudgetAllocator,
    FinanceScenarioBoard,
    ContentHost
}

public sealed record ChartDataPointDefinition(string Label, double Value);

public sealed record ChartSeriesDefinition(string Name, string Color, IReadOnlyList<ChartDataPointDefinition> Points);

public sealed record GaugeBandDefinition(string Label, double Start, double End, string Color);

public sealed record GaugeDefinition(
    double Minimum,
    double Maximum,
    double Value,
    double Target,
    string Unit,
    IReadOnlyList<GaugeBandDefinition> Bands,
    string? DisplayValue = null,
    string? DisplaySummary = null,
    string? DisplayPill = null);

public sealed record TimelineEntryDefinition(string Label, string? Detail, double Position, string? Pill = null, string? Accent = null);

public sealed record CardListItem(string Primary, string? Secondary = null, string? Tertiary = null, string? Accent = null);

public sealed record ScoutOptionDefinition(string Id, string Name, string Region, string Availability);

public sealed record ScoutAssignmentDefinition(
    string Id,
    string Focus,
    string Role,
    string Region,
    string Priority,
    string Stage,
    string Deadline,
    string Scout,
    string? Notes = null);

public sealed record ScoutAssignmentBoardDefinition(
    IReadOnlyList<ScoutAssignmentDefinition> Assignments,
    IReadOnlyList<string> StageOptions,
    IReadOnlyList<string> PriorityOptions,
    IReadOnlyList<ScoutOptionDefinition> ScoutOptions);

public sealed record ShortlistPlayerDefinition(
    string Id,
    string Name,
    string Position,
    string Status,
    string Action,
    string? Priority = null,
    string? Notes = null);

public sealed record ShortlistBoardDefinition(
    IReadOnlyList<ShortlistPlayerDefinition> Players,
    IReadOnlyList<string> StatusOptions,
    IReadOnlyList<string> ActionOptions);

public sealed record TrainingUnitCoachOptionDefinition(string Id, string Name, string? Accent = null);

public sealed record TrainingUnitMemberDefinition(
    string Id,
    string Name,
    string Position,
    string Role,
    string Status,
    string? Accent = null,
    string? Detail = null);

public sealed record TrainingUnitGroupDefinition(
    string Id,
    string Name,
    string? CoachId,
    string? CoachName,
    string? CoachAccent,
    IReadOnlyList<TrainingUnitCoachOptionDefinition> CoachOptions,
    IReadOnlyList<TrainingUnitMemberDefinition> Members);

public sealed record TrainingUnitBoardDefinition(
    IReadOnlyList<TrainingUnitGroupDefinition> Units,
    IReadOnlyList<TrainingUnitMemberDefinition> AvailablePlayers);

public sealed record TrainingProgressionPointDefinition(string Period, double Value, string? Detail = null);

public sealed record TrainingProgressionSeriesDefinition(
    string Id,
    string Name,
    string Color,
    string? Accent,
    bool IsHighlighted,
    IReadOnlyList<TrainingProgressionPointDefinition> Points);

public sealed record TrainingProgressionDefinition(
    IReadOnlyList<string> Periods,
    double Minimum,
    double Maximum,
    string? Summary,
    IReadOnlyList<TrainingProgressionSeriesDefinition> Series);

public sealed record FormationPlayerDefinition(string Id, string Name, double X, double Y);

public sealed record FormationLineDefinition(string Role, IReadOnlyList<FormationPlayerDefinition> Players);

public sealed record ShotMapFilterDefinition(string Key, string DisplayName, string Color, bool IsDefault);

public sealed record ShotMapEventDefinition(
    string Id,
    string Player,
    string Minute,
    string OutcomeKey,
    double X,
    double Y,
    double? ExpectedGoals = null,
    string? Assist = null,
    string? BodyPart = null,
    string? Detail = null,
    string? Accent = null);

public sealed record ShotMapDefinition(
    double PitchWidth,
    double PitchHeight,
    IReadOnlyList<ShotMapFilterDefinition> Filters,
    IReadOnlyList<ShotMapEventDefinition> Events);

public sealed record MedicalTimelineEntryDefinition(
    string Id,
    string Player,
    string Diagnosis,
    string Status,
    string ExpectedReturn,
    IReadOnlyList<TimelineEntryDefinition> Phases,
    string? Notes = null,
    string? Accent = null);

public sealed record MedicalTimelineDefinition(IReadOnlyList<MedicalTimelineEntryDefinition> Entries);

public sealed record FinanceForecastImpactDefinition(string Label, string Format, double BaseValue, double Sensitivity);

public sealed record FinanceForecastDefinition(
    string SliderLabel,
    string ValueDisplayFormat,
    string CommitLabel,
    string SummaryLabel,
    double Minimum,
    double Maximum,
    double Step,
    double Value,
    IReadOnlyList<FinanceForecastImpactDefinition> Impacts);

public sealed record TrainingIntensityLevelDefinition(string Key, string DisplayName, string Color, double LoadValue);

public sealed record TrainingWorkloadCellDefinition(string Column, string IntensityKey, double Load, string? Detail = null);

public sealed record TrainingWorkloadRowDefinition(string Label, IReadOnlyList<TrainingWorkloadCellDefinition> Cells);

public sealed record TrainingWorkloadHeatmapDefinition(
    IReadOnlyList<string> Columns,
    IReadOnlyList<TrainingWorkloadRowDefinition> Rows,
    IReadOnlyList<TrainingIntensityLevelDefinition> Intensities,
    string? LegendTitle = null,
    string? LegendSubtitle = null);

public sealed record MoraleIntensityDefinition(string Key, string DisplayName, string Color, string? Description = null);

public sealed record MoraleHeatmapCellDefinition(string Column, string IntensityKey, string Label, string? Detail = null);

public sealed record MoraleHeatmapRowDefinition(string Label, IReadOnlyList<MoraleHeatmapCellDefinition> Cells);

public sealed record MoraleHeatmapDefinition(
    IReadOnlyList<string> Columns,
    IReadOnlyList<MoraleHeatmapRowDefinition> Rows,
    IReadOnlyList<MoraleIntensityDefinition> Intensities,
    string? LegendTitle = null,
    string? LegendSubtitle = null);

public sealed record ClubVisionRoadmapPhaseDefinition(
    string Id,
    string Title,
    string Timeline,
    string Status,
    string? Description = null,
    string? Accent = null,
    string? Pill = null);

public sealed record ClubVisionRoadmapDefinition(
    IReadOnlyList<ClubVisionRoadmapPhaseDefinition> Phases,
    IReadOnlyList<string> StatusOptions,
    IReadOnlyList<string> PillOptions);

public sealed record ClubVisionExpectationDefinition(
    string Id,
    string Objective,
    string Competition,
    string Priority,
    string Status,
    string Deadline,
    string? Notes = null,
    string? Accent = null);

public sealed record ClubVisionExpectationBoardDefinition(
    IReadOnlyList<ClubVisionExpectationDefinition> Objectives,
    IReadOnlyList<string> StatusOptions,
    IReadOnlyList<string> PriorityOptions);

public sealed record FixtureCalendarFilterDefinition(
    string Id,
    string DisplayName,
    bool IsDefault,
    IReadOnlyList<string> Competitions);

public sealed record FixtureCalendarMatchDefinition(
    string Id,
    string Day,
    string KickOff,
    string Competition,
    string Opponent,
    string Venue,
    bool IsHome,
    string Importance,
    string? Result = null,
    string? Broadcast = null,
    string? TravelNote = null,
    string? PreparationNote = null,
    string? Status = null,
    string? CompetitionAccent = null,
    IReadOnlyList<CardListItem>? KeyPeople = null,
    IReadOnlyList<CardListItem>? Preparation = null);

public sealed record FixtureCalendarDayDefinition(
    string Label,
    string Date,
    IReadOnlyList<FixtureCalendarMatchDefinition> Matches);

public sealed record FixtureCalendarWeekDefinition(
    string Label,
    IReadOnlyList<FixtureCalendarDayDefinition> Days);

public sealed record FixtureCalendarDefinition(
    IReadOnlyList<FixtureCalendarFilterDefinition> Filters,
    IReadOnlyList<FixtureCalendarWeekDefinition> Weeks,
    string? LegendTitle = null,
    string? LegendSubtitle = null);

public sealed record TransferNegotiationTermDefinition(
    string Id,
    string Label,
    string Format,
    double Minimum,
    double Maximum,
    double Step,
    double Value,
    double Target,
    string? Tooltip = null);

public sealed record TransferNegotiationDealDefinition(
    string Id,
    string Player,
    string Position,
    string Club,
    string Stage,
    string Status,
    string Deadline,
    string Summary,
    string Agent,
    string Response,
    string? Accent,
    IReadOnlyList<string> StageOptions,
    IReadOnlyList<string> StatusOptions,
    IReadOnlyList<TransferNegotiationTermDefinition> Terms);

public sealed record TransferNegotiationDefinition(
    IReadOnlyList<TransferNegotiationDealDefinition> Deals);

public sealed record TrainingCalendarSessionDefinition(
    string Id,
    string Day,
    string Slot,
    string Activity,
    string? Focus = null,
    string? Intensity = null);

public sealed record TrainingCalendarDefinition(
    IReadOnlyList<string> Days,
    IReadOnlyList<string> Slots,
    IReadOnlyList<TrainingCalendarSessionDefinition> Sessions);

public sealed record SquadPlayerDefinition(
    string Id,
    string Name,
    string PositionGroup,
    string Position,
    string Role,
    string Morale,
    double Condition,
    double MatchSharpness,
    double AverageRating,
    int Appearances,
    int Minutes,
    string? Nationality = null,
    string? Status = null);

public sealed record SquadTableDefinition(IReadOnlyList<SquadPlayerDefinition> Players);

public sealed record FinanceCashflowItemDefinition(
    string Id,
    string Name,
    double Amount,
    string Format,
    string? Accent = null,
    string? Detail = null);

public sealed record FinanceCashflowCategoryDefinition(
    string Id,
    string Name,
    string? Description,
    double Amount,
    string Format,
    string? Accent,
    IReadOnlyList<FinanceCashflowItemDefinition> Items);

public sealed record FinanceCashflowDefinition(
    string SummaryLabel,
    string SummaryFormat,
    IReadOnlyList<FinanceCashflowCategoryDefinition> Categories);

public sealed record FinanceBudgetAllocationLineDefinition(
    string Id,
    string Label,
    string? Description,
    double Minimum,
    double Maximum,
    double Step,
    double Value,
    double Baseline,
    string Format,
    string? Accent = null);

public sealed record FinanceBudgetAllocatorDefinition(
    string CommitLabel,
    string ResetLabel,
    string SummaryFormat,
    IReadOnlyList<FinanceBudgetAllocationLineDefinition> Lines);

public sealed record FinanceScenarioOptionDefinition(
    string Id,
    string Title,
    string Detail,
    double Impact,
    string Format,
    bool IsSelected,
    string? Accent = null);

public sealed record FinanceScenarioDefinition(
    string SummaryLabel,
    string SummaryFormat,
    string CommitLabel,
    string ResetLabel,
    IReadOnlyList<FinanceScenarioOptionDefinition> Options);

public sealed record CardDefinition(
    string Id,
    string Title,
    string? Subtitle,
    CardKind Kind,
    int Column,
    int Row,
    int ColumnSpan,
    int RowSpan,
    string? MetricValue = null,
    string? MetricLabel = null,
    string? Description = null,
    string? PillText = null,
    IReadOnlyList<CardListItem>? ListItems = null,
    IReadOnlyList<FormationLineDefinition>? FormationLines = null,
    IReadOnlyList<ChartSeriesDefinition>? ChartSeries = null,
    GaugeDefinition? Gauge = null,
    IReadOnlyList<TimelineEntryDefinition>? Timeline = null,
    SquadTableDefinition? SquadTable = null,
    TrainingCalendarDefinition? TrainingCalendar = null,
    FinanceForecastDefinition? Forecast = null,
    TrainingWorkloadHeatmapDefinition? WorkloadHeatmap = null,
    MoraleHeatmapDefinition? MoraleHeatmap = null,
    FixtureCalendarDefinition? FixtureCalendar = null,
    TransferNegotiationDefinition? Negotiations = null,
    ScoutAssignmentBoardDefinition? ScoutAssignments = null,
    ShortlistBoardDefinition? ShortlistBoard = null,
    TrainingUnitBoardDefinition? TrainingUnitBoard = null,
    TrainingProgressionDefinition? TrainingProgression = null,
    ShotMapDefinition? ShotMap = null,
    MedicalTimelineDefinition? MedicalTimeline = null,
    ClubVisionRoadmapDefinition? ClubVisionRoadmap = null,
    ClubVisionExpectationBoardDefinition? ClubVisionExpectations = null,
    FinanceCashflowDefinition? FinanceCashflow = null,
    FinanceBudgetAllocatorDefinition? FinanceBudgetAllocator = null,
    FinanceScenarioDefinition? FinanceScenario = null,
    CardType? ContentType = null,
    uint PrimaryEntityId = 0);

public sealed record CardPresetDefinition(string Id, string DisplayName, string? Description, CardDefinition Template);

public sealed record CardLayout(
    string TabIdentifier,
    string SectionIdentifier,
    IReadOnlyList<CardDefinition> Cards,
    IReadOnlyList<CardPresetDefinition> Palette)
{
    public static CardLayout Empty { get; } = new(
        string.Empty,
        string.Empty,
        System.Array.Empty<CardDefinition>(),
        System.Array.Empty<CardPresetDefinition>());
}
