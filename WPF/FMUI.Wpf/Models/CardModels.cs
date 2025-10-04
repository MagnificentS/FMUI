using System.Collections.Generic;

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
    SquadTable,
    FixtureCalendar,
    TransferNegotiation,
    ScoutAssignments,
    ShortlistBoard
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

public sealed record FormationPlayerDefinition(string Id, string Name, double X, double Y);

public sealed record FormationLineDefinition(string Role, IReadOnlyList<FormationPlayerDefinition> Players);

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
    FixtureCalendarDefinition? FixtureCalendar = null,
    TransferNegotiationDefinition? Negotiations = null,
    ScoutAssignmentBoardDefinition? ScoutAssignments = null,
    ShortlistBoardDefinition? ShortlistBoard = null);

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
