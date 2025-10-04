using System.Collections.Generic;

namespace FMUI.Wpf.Models;

public sealed record ClubDataSnapshot(
    TacticalSnapshot Tactics,
    OverviewSnapshot Overview,
    SquadSnapshot Squad,
    TrainingSnapshot Training,
    TransfersSnapshot Transfers,
    FinanceSnapshot Finance,
    FixturesSnapshot Fixtures,
    NavigationPermissionsSnapshot? NavigationPermissions = null);

public sealed record NavigationPermissionsSnapshot(
    IReadOnlyList<NavigationTabPermissionSnapshot> Tabs);

public sealed record NavigationTabPermissionSnapshot(
    string TabId,
    bool IsVisible,
    IReadOnlyList<NavigationSectionPermissionSnapshot> Sections);

public sealed record NavigationSectionPermissionSnapshot(
    string SectionId,
    bool IsVisible,
    string? RequiredRole = null);

public sealed record TrendDataPointSnapshot(string Label, double Value);

public sealed record TrendSnapshot(MetricSnapshot Metric, IReadOnlyList<TrendDataPointSnapshot> Points);

public sealed record GaugeBandSnapshot(string Label, double Start, double End, string Color);

public sealed record GaugeSnapshot(
    MetricSnapshot Metric,
    double Minimum,
    double Maximum,
    double Value,
    double Target,
    string Unit,
    IReadOnlyList<GaugeBandSnapshot> Bands,
    IReadOnlyList<ListEntrySnapshot>? SupportingItems = null);

public sealed record TimelineEntrySnapshot(string Label, string? Detail, double Position, string? Pill = null, string? Accent = null);

public sealed record TimelineSnapshot(IReadOnlyList<TimelineEntrySnapshot> Events);

public sealed record TacticalSnapshot(
    string FormationName,
    string SquadLabel,
    string Description,
    string? MentalityPill,
    IReadOnlyList<FormationLineSnapshot> FormationLines,
    IReadOnlyList<FormationPlayerOptionSnapshot> PlayerPool,
    MetricSnapshot Fluidity,
    MetricSnapshot Mentality,
    InstructionSnapshot InPossession,
    InstructionSnapshot InTransition,
    InstructionSnapshot OutOfPossession,
    SetPieceSnapshot SetPieces,
    TacticalAnalysisSnapshot Analysis);

public sealed record FormationPlayerSnapshot(string Id, string Name, double X, double Y);

public sealed record FormationLineSnapshot(string Role, IReadOnlyList<FormationPlayerSnapshot> Players);

public sealed record FormationPlayerOptionSnapshot(string Id, string Name, string? Position = null, string? Detail = null);

public sealed record MetricSnapshot(string Value, string Summary, string? Pill = null);

public sealed record InstructionSnapshot(
    string? Description,
    IReadOnlyList<InstructionItemSnapshot> Items);

public sealed record InstructionItemSnapshot(string Label, string Value, string? Detail = null);

public sealed record SetPieceSnapshot(
    IReadOnlyList<ListEntrySnapshot> AttackingCorners,
    IReadOnlyList<ListEntrySnapshot> DefendingCorners,
    IReadOnlyList<ListEntrySnapshot> FreeKicks,
    IReadOnlyList<ListEntrySnapshot> ThrowIns,
    IReadOnlyList<ListEntrySnapshot> PenaltyTakers);

public sealed record TacticalAnalysisSnapshot(
    MetricSnapshot RecentForm,
    IReadOnlyList<ListEntrySnapshot> Strengths,
    IReadOnlyList<ListEntrySnapshot> Weaknesses,
    IReadOnlyList<ListEntrySnapshot> Statistics,
    IReadOnlyList<ListEntrySnapshot> Recommendations);

public sealed record OverviewSnapshot(
    ClubVisionSnapshot ClubVision,
    DynamicsSnapshot Dynamics,
    MedicalSnapshot Medical,
    AnalyticsSnapshot Analytics);

public sealed record ClubVisionSnapshot(
    MetricSnapshot BoardConfidence,
    MetricSnapshot SupporterConfidence,
    IReadOnlyList<ListEntrySnapshot> CompetitionExpectations,
    IReadOnlyList<ListEntrySnapshot> FiveYearPlan,
    IReadOnlyList<ListEntrySnapshot> FinanceSnapshot,
    IReadOnlyList<ListEntrySnapshot> TopPerformers);

public sealed record DynamicsSnapshot(
    MetricSnapshot TeamCohesion,
    MetricSnapshot DressingRoomAtmosphere,
    MetricSnapshot ManagerialSupport,
    IReadOnlyList<ListEntrySnapshot> SocialGroups,
    IReadOnlyList<ListEntrySnapshot> Influencers,
    IReadOnlyList<ListEntrySnapshot> PlayerIssues,
    IReadOnlyList<ListEntrySnapshot> Meetings,
    IReadOnlyList<ListEntrySnapshot> PraiseMoments);

public sealed record MedicalSnapshot(
    IReadOnlyList<ListEntrySnapshot> InjuryList,
    MetricSnapshot RiskAssessment,
    IReadOnlyList<ListEntrySnapshot> RiskBreakdown,
    IReadOnlyList<ListEntrySnapshot> RehabProgress,
    MetricSnapshot WorkloadMonitoring,
    IReadOnlyList<ListEntrySnapshot> StaffNotes);

public sealed record AnalyticsSnapshot(
    TrendSnapshot ExpectedGoalsTrend,
    IReadOnlyList<ListEntrySnapshot> ShotLocations,
    IReadOnlyList<ListEntrySnapshot> PossessionZones,
    IReadOnlyList<ListEntrySnapshot> PassingNetworks,
    IReadOnlyList<ListEntrySnapshot> TeamComparison,
    IReadOnlyList<ListEntrySnapshot> KeyStats);

public sealed record SquadSnapshot(
    SelectionInfoSnapshot SelectionInfo,
    PlayersSnapshot Players,
    InternationalSnapshot International,
    SquadDepthSnapshot Depth);

public sealed record SelectionInfoSnapshot(
    IReadOnlyList<ListEntrySnapshot> MatchdayReadiness,
    IReadOnlyList<ListEntrySnapshot> FitnessConcerns,
    IReadOnlyList<ListEntrySnapshot> Suspensions,
    IReadOnlyList<ListEntrySnapshot> RecentForm,
    IReadOnlyList<ListEntrySnapshot> TrainingFocus);

public sealed record PlayersSnapshot(
    IReadOnlyList<ListEntrySnapshot> KeyPlayers,
    IReadOnlyList<ListEntrySnapshot> EmergingPlayers,
    IReadOnlyList<ListEntrySnapshot> ContractStatus,
    IReadOnlyList<ListEntrySnapshot> StatisticsLeaders,
    IReadOnlyList<ListEntrySnapshot> TransferInterest,
    IReadOnlyList<SquadPlayerSnapshot> Roster);

public sealed record InternationalSnapshot(
    IReadOnlyList<ListEntrySnapshot> CallUps,
    IReadOnlyList<ListEntrySnapshot> TravelPlans,
    IReadOnlyList<ListEntrySnapshot> Availability,
    IReadOnlyList<ListEntrySnapshot> ScoutingReports);

public sealed record SquadDepthSnapshot(
    IReadOnlyList<ListEntrySnapshot> DepthChart,
    IReadOnlyList<ListEntrySnapshot> RoleBattles,
    IReadOnlyList<ListEntrySnapshot> YouthDepth,
    IReadOnlyList<ListEntrySnapshot> PositionalRatings);

public sealed record SquadPlayerSnapshot(
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

public sealed record TrainingSnapshot(
    TrainingOverviewSnapshot Overview,
    TrainingCalendarSnapshot Calendar,
    TrainingUnitsSnapshot Units);

public sealed record TrainingOverviewSnapshot(
    IReadOnlyList<ListEntrySnapshot> UpcomingSessions,
    GaugeSnapshot Intensity,
    TrainingWorkloadHeatmapSnapshot WorkloadHeatmap,
    IReadOnlyList<ListEntrySnapshot> FocusAreas,
    IReadOnlyList<ListEntrySnapshot> UnitCoaches,
    IReadOnlyList<ListEntrySnapshot> MedicalWorkload,
    IReadOnlyList<ListEntrySnapshot> MatchPreparation,
    IReadOnlyList<ListEntrySnapshot> IndividualFocus,
    IReadOnlyList<ListEntrySnapshot> YouthDevelopment);

public sealed record TrainingWorkloadHeatmapSnapshot(
    IReadOnlyList<string> Columns,
    IReadOnlyList<TrainingWorkloadUnitSnapshot> Units,
    IReadOnlyList<TrainingIntensityLevelSnapshot> Intensities,
    string? LegendTitle = null,
    string? LegendSubtitle = null);

public sealed record TrainingWorkloadUnitSnapshot(
    string Label,
    IReadOnlyList<TrainingWorkloadCellSnapshot> Cells);

public sealed record TrainingWorkloadCellSnapshot(
    string Column,
    string IntensityKey,
    double Load,
    string? Detail = null);

public sealed record TrainingIntensityLevelSnapshot(
    string Key,
    string DisplayName,
    string Color,
    double LoadValue);

public sealed record TrainingCalendarSnapshot(
    IReadOnlyList<ListEntrySnapshot> WeekOverview,
    IReadOnlyList<TrainingSessionDetailSnapshot> SessionDetails,
    IReadOnlyList<ListEntrySnapshot> RestDays,
    IReadOnlyList<ListEntrySnapshot> MatchPrepFocus,
    IReadOnlyList<ListEntrySnapshot> UpcomingMilestones);

public sealed record TrainingSessionDetailSnapshot(
    string Id,
    string Day,
    string Slot,
    string Activity,
    string? Focus = null,
    string? Intensity = null);

public sealed record TrainingUnitsSnapshot(
    IReadOnlyList<ListEntrySnapshot> SeniorUnit,
    IReadOnlyList<ListEntrySnapshot> YouthUnit,
    IReadOnlyList<ListEntrySnapshot> GoalkeepingUnit,
    IReadOnlyList<ListEntrySnapshot> CoachAssignments);

public sealed record TransfersSnapshot(
    TransferCentreSnapshot Centre,
    ScoutingSnapshot Scouting,
    ShortlistSnapshot Shortlist);

public sealed record TransferCentreSnapshot(
    GaugeSnapshot BudgetUsage,
    IReadOnlyList<ListEntrySnapshot> ActiveDeals,
    IReadOnlyList<ListEntrySnapshot> RecentActivity,
    IReadOnlyList<ListEntrySnapshot> LoanWatch,
    IReadOnlyList<ListEntrySnapshot> Clauses,
    IReadOnlyList<TransferNegotiationDealSnapshot>? Negotiations = null);

public sealed record TransferNegotiationTermSnapshot(
    string Id,
    string Label,
    string Format,
    double Minimum,
    double Maximum,
    double Step,
    double Value,
    double Target,
    string? Tooltip = null);

public sealed record TransferNegotiationDealSnapshot(
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
    IReadOnlyList<TransferNegotiationTermSnapshot> Terms);

public sealed record ScoutOptionSnapshot(
    string Id,
    string Name,
    string Region,
    string Availability);

public sealed record ScoutAssignmentSnapshot(
    string Id,
    string Focus,
    string Role,
    string Region,
    string Priority,
    string Stage,
    string Deadline,
    string Scout,
    string? Notes = null);

public sealed record ScoutingSnapshot(
    IReadOnlyList<ListEntrySnapshot> Assignments,
    IReadOnlyList<ListEntrySnapshot> FocusRegions,
    IReadOnlyList<ListEntrySnapshot> KnowledgeLevels,
    IReadOnlyList<ListEntrySnapshot> RecommendedPlayers,
    IReadOnlyList<ListEntrySnapshot> ShortTermFocus,
    IReadOnlyList<ScoutAssignmentSnapshot> AssignmentBoard,
    IReadOnlyList<ScoutOptionSnapshot> ScoutPool,
    IReadOnlyList<string> AssignmentStages,
    IReadOnlyList<string> AssignmentPriorities);

public sealed record ShortlistPlayerSnapshot(
    string Id,
    string Name,
    string Position,
    string Status,
    string Action,
    string? Priority = null,
    string? Notes = null);

public sealed record ShortlistSnapshot(
    IReadOnlyList<ListEntrySnapshot> PriorityTargets,
    IReadOnlyList<ListEntrySnapshot> ContractStatus,
    IReadOnlyList<ListEntrySnapshot> Competition,
    IReadOnlyList<ListEntrySnapshot> Notes,
    IReadOnlyList<ShortlistPlayerSnapshot> Board,
    IReadOnlyList<string> StatusOptions,
    IReadOnlyList<string> ActionOptions);

public sealed record FinanceSnapshot(
    FinanceSummarySnapshot Summary,
    FinanceIncomeSnapshot Income,
    FinanceExpenditureSnapshot Expenditure);

public sealed record FinanceSummarySnapshot(
    GaugeSnapshot OverallBalance,
    TrendSnapshot ProfitThisMonth,
    IReadOnlyList<ListEntrySnapshot> Budgets,
    IReadOnlyList<ListEntrySnapshot> Projections,
    IReadOnlyList<ListEntrySnapshot> Debts,
    IReadOnlyList<ListEntrySnapshot> SponsorDeals,
    FinanceForecastSnapshot Forecast);

public sealed record FinanceIncomeSnapshot(
    IReadOnlyList<ListEntrySnapshot> RevenueStreams,
    IReadOnlyList<ListEntrySnapshot> MatchdayIncome,
    IReadOnlyList<ListEntrySnapshot> CommercialIncome,
    IReadOnlyList<ListEntrySnapshot> CompetitionPrizes);

public sealed record FinanceExpenditureSnapshot(
    IReadOnlyList<ListEntrySnapshot> MajorCosts,
    IReadOnlyList<ListEntrySnapshot> WageBreakdown,
    IReadOnlyList<ListEntrySnapshot> TransferSpending,
    IReadOnlyList<ListEntrySnapshot> OperationalCosts);

public sealed record FinanceForecastSnapshot(
    string SliderLabel,
    string ValueDisplayFormat,
    string CommitLabel,
    string SummaryLabel,
    double Minimum,
    double Maximum,
    double Step,
    double CurrentPercentage,
    IReadOnlyList<FinanceForecastImpactSnapshot> Impacts);

public sealed record FinanceForecastImpactSnapshot(
    string Label,
    string Format,
    double BaseValue,
    double Sensitivity);

public sealed record FixturesSnapshot(
    FixturesScheduleSnapshot Schedule,
    FixturesResultsSnapshot Results,
    FixturesCalendarSnapshot Calendar);

public sealed record FixturesScheduleSnapshot(
    IReadOnlyList<ListEntrySnapshot> UpcomingFixtures,
    TimelineSnapshot FixtureTimeline,
    IReadOnlyList<ListEntrySnapshot> TravelPlans,
    IReadOnlyList<ListEntrySnapshot> Broadcasts,
    IReadOnlyList<ListEntrySnapshot> PreparationFocus);

public sealed record FixturesResultsSnapshot(
    IReadOnlyList<ListEntrySnapshot> RecentResults,
    IReadOnlyList<ListEntrySnapshot> PlayerRatings,
    IReadOnlyList<ListEntrySnapshot> Trends,
    IReadOnlyList<ListEntrySnapshot> KeyMoments);

public sealed record FixturesCalendarSnapshot(
    IReadOnlyList<ListEntrySnapshot> MonthOverview,
    IReadOnlyList<ListEntrySnapshot> CupDraws,
    IReadOnlyList<ListEntrySnapshot> InternationalBreaks,
    IReadOnlyList<ListEntrySnapshot> Reminders,
    IReadOnlyList<FixtureCalendarFilterSnapshot> Filters,
    IReadOnlyList<FixtureCalendarWeekSnapshot> Weeks);

public sealed record FixtureCalendarFilterSnapshot(
    string Id,
    string DisplayName,
    bool IsDefault,
    IReadOnlyList<string> Competitions);

public sealed record FixtureCalendarWeekSnapshot(
    string Label,
    IReadOnlyList<FixtureCalendarDaySnapshot> Days);

public sealed record FixtureCalendarDaySnapshot(
    string Label,
    string Date,
    IReadOnlyList<FixtureCalendarMatchSnapshot> Matches);

public sealed record FixtureCalendarMatchSnapshot(
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
    IReadOnlyList<ListEntrySnapshot>? KeyPeople = null,
    IReadOnlyList<ListEntrySnapshot>? Preparation = null);

public sealed record ListEntrySnapshot(
    string Primary,
    string? Secondary = null,
    string? Tertiary = null,
    string? Accent = null);
