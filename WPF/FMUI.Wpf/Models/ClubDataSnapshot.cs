using System.Collections.Generic;

namespace FMUI.Wpf.Models;

public sealed record ClubDataSnapshot(
    TacticalSnapshot Tactics,
    OverviewSnapshot Overview,
    SquadSnapshot Squad,
    TrainingSnapshot Training,
    TransfersSnapshot Transfers,
    FinanceSnapshot Finance,
    FixturesSnapshot Fixtures);

public sealed record TacticalSnapshot(
    string FormationName,
    string SquadLabel,
    string Description,
    string? MentalityPill,
    IReadOnlyList<FormationLineSnapshot> FormationLines,
    MetricSnapshot Fluidity,
    MetricSnapshot Mentality,
    InstructionSnapshot InPossession,
    InstructionSnapshot InTransition,
    InstructionSnapshot OutOfPossession,
    SetPieceSnapshot SetPieces,
    TacticalAnalysisSnapshot Analysis);

public sealed record FormationLineSnapshot(string Role, IReadOnlyList<string> Players);

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
    MetricSnapshot ExpectedGoalsTrend,
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
    IReadOnlyList<ListEntrySnapshot> TransferInterest);

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

public sealed record TrainingSnapshot(
    TrainingOverviewSnapshot Overview,
    TrainingCalendarSnapshot Calendar,
    TrainingUnitsSnapshot Units);

public sealed record TrainingOverviewSnapshot(
    IReadOnlyList<ListEntrySnapshot> UpcomingSessions,
    MetricSnapshot Intensity,
    IReadOnlyList<ListEntrySnapshot> FocusAreas,
    IReadOnlyList<ListEntrySnapshot> UnitCoaches,
    IReadOnlyList<ListEntrySnapshot> MedicalWorkload,
    IReadOnlyList<ListEntrySnapshot> MatchPreparation,
    IReadOnlyList<ListEntrySnapshot> IndividualFocus,
    IReadOnlyList<ListEntrySnapshot> YouthDevelopment);

public sealed record TrainingCalendarSnapshot(
    IReadOnlyList<ListEntrySnapshot> WeekOverview,
    IReadOnlyList<ListEntrySnapshot> RestDays,
    IReadOnlyList<ListEntrySnapshot> MatchPrepFocus,
    IReadOnlyList<ListEntrySnapshot> UpcomingMilestones);

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
    MetricSnapshot BudgetUsage,
    IReadOnlyList<ListEntrySnapshot> ActiveDeals,
    IReadOnlyList<ListEntrySnapshot> RecentActivity,
    IReadOnlyList<ListEntrySnapshot> LoanWatch,
    IReadOnlyList<ListEntrySnapshot> Clauses);

public sealed record ScoutingSnapshot(
    IReadOnlyList<ListEntrySnapshot> Assignments,
    IReadOnlyList<ListEntrySnapshot> FocusRegions,
    IReadOnlyList<ListEntrySnapshot> KnowledgeLevels,
    IReadOnlyList<ListEntrySnapshot> RecommendedPlayers,
    IReadOnlyList<ListEntrySnapshot> ShortTermFocus);

public sealed record ShortlistSnapshot(
    IReadOnlyList<ListEntrySnapshot> PriorityTargets,
    IReadOnlyList<ListEntrySnapshot> ContractStatus,
    IReadOnlyList<ListEntrySnapshot> Competition,
    IReadOnlyList<ListEntrySnapshot> Notes);

public sealed record FinanceSnapshot(
    FinanceSummarySnapshot Summary,
    FinanceIncomeSnapshot Income,
    FinanceExpenditureSnapshot Expenditure);

public sealed record FinanceSummarySnapshot(
    MetricSnapshot OverallBalance,
    MetricSnapshot ProfitThisMonth,
    IReadOnlyList<ListEntrySnapshot> Budgets,
    IReadOnlyList<ListEntrySnapshot> Projections,
    IReadOnlyList<ListEntrySnapshot> Debts,
    IReadOnlyList<ListEntrySnapshot> SponsorDeals);

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

public sealed record FixturesSnapshot(
    FixturesScheduleSnapshot Schedule,
    FixturesResultsSnapshot Results,
    FixturesCalendarSnapshot Calendar);

public sealed record FixturesScheduleSnapshot(
    IReadOnlyList<ListEntrySnapshot> UpcomingFixtures,
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
    IReadOnlyList<ListEntrySnapshot> Reminders);

public sealed record ListEntrySnapshot(
    string Primary,
    string? Secondary = null,
    string? Tertiary = null,
    string? Accent = null);
