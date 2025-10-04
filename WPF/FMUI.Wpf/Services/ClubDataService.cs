using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface IClubDataService
{
    ClubDataSnapshot GetSnapshot();
}

public sealed class ClubDataService : IClubDataService
{
    private readonly Lazy<ClubDataSnapshot> _snapshot;

    public ClubDataService()
    {
        _snapshot = new Lazy<ClubDataSnapshot>(LoadSnapshot);
    }

    public ClubDataSnapshot GetSnapshot() => _snapshot.Value;

    private static ClubDataSnapshot LoadSnapshot()
    {
        var baseDirectory = AppContext.BaseDirectory;
        var dataPath = Path.Combine(baseDirectory, "Data", "club-data.json");

        if (!File.Exists(dataPath))
        {
            throw new FileNotFoundException("Unable to locate tactical snapshot seed data.", dataPath);
        }

        using var stream = File.OpenRead(dataPath);
        var document = JsonSerializer.Deserialize<ClubDataDocument>(stream, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (document is null)
        {
            throw new InvalidOperationException("The club data payload could not be deserialized.");
        }

        return document.ToSnapshot();
    }

    private static IReadOnlyList<FormationLineSnapshot> MapLines(IReadOnlyList<FormationLineDocument>? source)
    {
        if (source is null || source.Count == 0)
        {
            return Array.Empty<FormationLineSnapshot>();
        }

        var results = new List<FormationLineSnapshot>(source.Count);
        foreach (var line in source)
        {
            var players = line.Players;
            if (players is null || players.Count == 0)
            {
                results.Add(new FormationLineSnapshot(line.Role, Array.Empty<FormationPlayerSnapshot>()));
                continue;
            }

            var mappedPlayers = new List<FormationPlayerSnapshot>(players.Count);
            foreach (var player in players)
            {
                var id = string.IsNullOrWhiteSpace(player.Id)
                    ? player.Name
                    : player.Id;

                if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(player.Name))
                {
                    continue;
                }

                mappedPlayers.Add(new FormationPlayerSnapshot(id, player.Name, player.X, player.Y));
            }

            results.Add(new FormationLineSnapshot(line.Role, mappedPlayers));
        }

        return results;
    }

    private static InstructionSnapshot MapInstruction(InstructionDocument? document)
    {
        if (document is null)
        {
            return new InstructionSnapshot(null, Array.Empty<InstructionItemSnapshot>());
        }

        var items = document.Items;
        if (items is null || items.Count == 0)
        {
            return new InstructionSnapshot(document.Description, Array.Empty<InstructionItemSnapshot>());
        }

        var mapped = new List<InstructionItemSnapshot>(items.Count);
        foreach (var item in items)
        {
            mapped.Add(new InstructionItemSnapshot(item.Label, item.Value, item.Detail));
        }

        return new InstructionSnapshot(document.Description, mapped);
    }

    private static IReadOnlyList<ListEntrySnapshot> MapEntries(IReadOnlyList<ListEntryDocument>? source)
    {
        if (source is null || source.Count == 0)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        var results = new List<ListEntrySnapshot>(source.Count);
        foreach (var entry in source)
        {
            results.Add(new ListEntrySnapshot(entry.Primary, entry.Secondary, entry.Tertiary, entry.Accent));
        }

        return results;
    }

    private static MetricSnapshot MapMetric(MetricDocument document) =>
        new(document.Value, document.Summary, document.Pill);

    private sealed record ClubDataDocument(
        TacticalDocument Tactics,
        OverviewDocument Overview,
        SquadDocument Squad,
        TrainingDocument Training,
        TransfersDocument Transfers,
        FinanceDocument Finance,
        FixturesDocument Fixtures)
    {
        public ClubDataSnapshot ToSnapshot() => new(
            Tactics.ToSnapshot(),
            Overview.ToSnapshot(),
            Squad.ToSnapshot(),
            Training.ToSnapshot(),
            Transfers.ToSnapshot(),
            Finance.ToSnapshot(),
            Fixtures.ToSnapshot());
    }

    private sealed record TacticalDocument(
        string FormationName,
        string SquadLabel,
        string Description,
        string? MentalityPill,
        IReadOnlyList<FormationLineDocument> FormationLines,
        MetricDocument Fluidity,
        MetricDocument Mentality,
        InstructionDocument InPossession,
        InstructionDocument InTransition,
        InstructionDocument OutOfPossession,
        SetPieceDocument SetPieces,
        TacticalAnalysisDocument Analysis)
    {
        public TacticalSnapshot ToSnapshot() => new(
            FormationName,
            SquadLabel,
            Description,
            MentalityPill,
            MapLines(FormationLines),
            MapMetric(Fluidity),
            MapMetric(Mentality),
            MapInstruction(InPossession),
            MapInstruction(InTransition),
            MapInstruction(OutOfPossession),
            SetPieces.ToSnapshot(),
            Analysis.ToSnapshot());
    }

    private sealed record SetPieceDocument(
        IReadOnlyList<ListEntryDocument> AttackingCorners,
        IReadOnlyList<ListEntryDocument> DefendingCorners,
        IReadOnlyList<ListEntryDocument> FreeKicks,
        IReadOnlyList<ListEntryDocument> ThrowIns,
        IReadOnlyList<ListEntryDocument> PenaltyTakers)
    {
        public SetPieceSnapshot ToSnapshot() => new(
            MapEntries(AttackingCorners),
            MapEntries(DefendingCorners),
            MapEntries(FreeKicks),
            MapEntries(ThrowIns),
            MapEntries(PenaltyTakers));
    }

    private sealed record TacticalAnalysisDocument(
        MetricDocument RecentForm,
        IReadOnlyList<ListEntryDocument> Strengths,
        IReadOnlyList<ListEntryDocument> Weaknesses,
        IReadOnlyList<ListEntryDocument> Statistics,
        IReadOnlyList<ListEntryDocument> Recommendations)
    {
        public TacticalAnalysisSnapshot ToSnapshot() => new(
            MapMetric(RecentForm),
            MapEntries(Strengths),
            MapEntries(Weaknesses),
            MapEntries(Statistics),
            MapEntries(Recommendations));
    }

    private sealed record OverviewDocument(
        ClubVisionDocument ClubVision,
        DynamicsDocument Dynamics,
        MedicalDocument Medical,
        AnalyticsDocument Analytics)
    {
        public OverviewSnapshot ToSnapshot() => new(
            ClubVision.ToSnapshot(),
            Dynamics.ToSnapshot(),
            Medical.ToSnapshot(),
            Analytics.ToSnapshot());
    }

    private sealed record ClubVisionDocument(
        MetricDocument BoardConfidence,
        MetricDocument SupporterConfidence,
        IReadOnlyList<ListEntryDocument> CompetitionExpectations,
        IReadOnlyList<ListEntryDocument> FiveYearPlan,
        IReadOnlyList<ListEntryDocument> FinanceSnapshot,
        IReadOnlyList<ListEntryDocument> TopPerformers)
    {
        public ClubVisionSnapshot ToSnapshot() => new(
            MapMetric(BoardConfidence),
            MapMetric(SupporterConfidence),
            MapEntries(CompetitionExpectations),
            MapEntries(FiveYearPlan),
            MapEntries(FinanceSnapshot),
            MapEntries(TopPerformers));
    }

    private sealed record DynamicsDocument(
        MetricDocument TeamCohesion,
        MetricDocument DressingRoomAtmosphere,
        MetricDocument ManagerialSupport,
        IReadOnlyList<ListEntryDocument> SocialGroups,
        IReadOnlyList<ListEntryDocument> Influencers,
        IReadOnlyList<ListEntryDocument> PlayerIssues,
        IReadOnlyList<ListEntryDocument> Meetings,
        IReadOnlyList<ListEntryDocument> PraiseMoments)
    {
        public DynamicsSnapshot ToSnapshot() => new(
            MapMetric(TeamCohesion),
            MapMetric(DressingRoomAtmosphere),
            MapMetric(ManagerialSupport),
            MapEntries(SocialGroups),
            MapEntries(Influencers),
            MapEntries(PlayerIssues),
            MapEntries(Meetings),
            MapEntries(PraiseMoments));
    }

    private sealed record MedicalDocument(
        IReadOnlyList<ListEntryDocument> InjuryList,
        MetricDocument RiskAssessment,
        IReadOnlyList<ListEntryDocument> RiskBreakdown,
        IReadOnlyList<ListEntryDocument> RehabProgress,
        MetricDocument WorkloadMonitoring,
        IReadOnlyList<ListEntryDocument> StaffNotes)
    {
        public MedicalSnapshot ToSnapshot() => new(
            MapEntries(InjuryList),
            MapMetric(RiskAssessment),
            MapEntries(RiskBreakdown),
            MapEntries(RehabProgress),
            MapMetric(WorkloadMonitoring),
            MapEntries(StaffNotes));
    }

    private sealed record AnalyticsDocument(
        MetricDocument ExpectedGoalsTrend,
        IReadOnlyList<ListEntryDocument> ShotLocations,
        IReadOnlyList<ListEntryDocument> PossessionZones,
        IReadOnlyList<ListEntryDocument> PassingNetworks,
        IReadOnlyList<ListEntryDocument> TeamComparison,
        IReadOnlyList<ListEntryDocument> KeyStats)
    {
        public AnalyticsSnapshot ToSnapshot() => new(
            MapMetric(ExpectedGoalsTrend),
            MapEntries(ShotLocations),
            MapEntries(PossessionZones),
            MapEntries(PassingNetworks),
            MapEntries(TeamComparison),
            MapEntries(KeyStats));
    }

    private sealed record SquadDocument(
        SelectionInfoDocument SelectionInfo,
        PlayersDocument Players,
        InternationalDocument International,
        SquadDepthDocument Depth)
    {
        public SquadSnapshot ToSnapshot() => new(
            SelectionInfo.ToSnapshot(),
            Players.ToSnapshot(),
            International.ToSnapshot(),
            Depth.ToSnapshot());
    }

    private sealed record SelectionInfoDocument(
        IReadOnlyList<ListEntryDocument> MatchdayReadiness,
        IReadOnlyList<ListEntryDocument> FitnessConcerns,
        IReadOnlyList<ListEntryDocument> Suspensions,
        IReadOnlyList<ListEntryDocument> RecentForm,
        IReadOnlyList<ListEntryDocument> TrainingFocus)
    {
        public SelectionInfoSnapshot ToSnapshot() => new(
            MapEntries(MatchdayReadiness),
            MapEntries(FitnessConcerns),
            MapEntries(Suspensions),
            MapEntries(RecentForm),
            MapEntries(TrainingFocus));
    }

    private sealed record PlayersDocument(
        IReadOnlyList<ListEntryDocument> KeyPlayers,
        IReadOnlyList<ListEntryDocument> EmergingPlayers,
        IReadOnlyList<ListEntryDocument> ContractStatus,
        IReadOnlyList<ListEntryDocument> StatisticsLeaders,
        IReadOnlyList<ListEntryDocument> TransferInterest)
    {
        public PlayersSnapshot ToSnapshot() => new(
            MapEntries(KeyPlayers),
            MapEntries(EmergingPlayers),
            MapEntries(ContractStatus),
            MapEntries(StatisticsLeaders),
            MapEntries(TransferInterest));
    }

    private sealed record InternationalDocument(
        IReadOnlyList<ListEntryDocument> CallUps,
        IReadOnlyList<ListEntryDocument> TravelPlans,
        IReadOnlyList<ListEntryDocument> Availability,
        IReadOnlyList<ListEntryDocument> ScoutingReports)
    {
        public InternationalSnapshot ToSnapshot() => new(
            MapEntries(CallUps),
            MapEntries(TravelPlans),
            MapEntries(Availability),
            MapEntries(ScoutingReports));
    }

    private sealed record SquadDepthDocument(
        IReadOnlyList<ListEntryDocument> DepthChart,
        IReadOnlyList<ListEntryDocument> RoleBattles,
        IReadOnlyList<ListEntryDocument> YouthDepth,
        IReadOnlyList<ListEntryDocument> PositionalRatings)
    {
        public SquadDepthSnapshot ToSnapshot() => new(
            MapEntries(DepthChart),
            MapEntries(RoleBattles),
            MapEntries(YouthDepth),
            MapEntries(PositionalRatings));
    }

    private sealed record TrainingDocument(
        TrainingOverviewDocument Overview,
        TrainingCalendarDocument Calendar,
        TrainingUnitsDocument Units)
    {
        public TrainingSnapshot ToSnapshot() => new(
            Overview.ToSnapshot(),
            Calendar.ToSnapshot(),
            Units.ToSnapshot());
    }

    private sealed record TrainingOverviewDocument(
        IReadOnlyList<ListEntryDocument> UpcomingSessions,
        MetricDocument Intensity,
        IReadOnlyList<ListEntryDocument> FocusAreas,
        IReadOnlyList<ListEntryDocument> UnitCoaches,
        IReadOnlyList<ListEntryDocument> MedicalWorkload,
        IReadOnlyList<ListEntryDocument> MatchPreparation,
        IReadOnlyList<ListEntryDocument> IndividualFocus,
        IReadOnlyList<ListEntryDocument> YouthDevelopment)
    {
        public TrainingOverviewSnapshot ToSnapshot() => new(
            MapEntries(UpcomingSessions),
            MapMetric(Intensity),
            MapEntries(FocusAreas),
            MapEntries(UnitCoaches),
            MapEntries(MedicalWorkload),
            MapEntries(MatchPreparation),
            MapEntries(IndividualFocus),
            MapEntries(YouthDevelopment));
    }

    private sealed record TrainingCalendarDocument(
        IReadOnlyList<ListEntryDocument> WeekOverview,
        IReadOnlyList<ListEntryDocument> RestDays,
        IReadOnlyList<ListEntryDocument> MatchPrepFocus,
        IReadOnlyList<ListEntryDocument> UpcomingMilestones)
    {
        public TrainingCalendarSnapshot ToSnapshot() => new(
            MapEntries(WeekOverview),
            MapEntries(RestDays),
            MapEntries(MatchPrepFocus),
            MapEntries(UpcomingMilestones));
    }

    private sealed record TrainingUnitsDocument(
        IReadOnlyList<ListEntryDocument> SeniorUnit,
        IReadOnlyList<ListEntryDocument> YouthUnit,
        IReadOnlyList<ListEntryDocument> GoalkeepingUnit,
        IReadOnlyList<ListEntryDocument> CoachAssignments)
    {
        public TrainingUnitsSnapshot ToSnapshot() => new(
            MapEntries(SeniorUnit),
            MapEntries(YouthUnit),
            MapEntries(GoalkeepingUnit),
            MapEntries(CoachAssignments));
    }

    private sealed record TransfersDocument(
        TransferCentreDocument Centre,
        ScoutingDocument Scouting,
        ShortlistDocument Shortlist)
    {
        public TransfersSnapshot ToSnapshot() => new(
            Centre.ToSnapshot(),
            Scouting.ToSnapshot(),
            Shortlist.ToSnapshot());
    }

    private sealed record TransferCentreDocument(
        MetricDocument BudgetUsage,
        IReadOnlyList<ListEntryDocument> ActiveDeals,
        IReadOnlyList<ListEntryDocument> RecentActivity,
        IReadOnlyList<ListEntryDocument> LoanWatch,
        IReadOnlyList<ListEntryDocument> Clauses)
    {
        public TransferCentreSnapshot ToSnapshot() => new(
            MapMetric(BudgetUsage),
            MapEntries(ActiveDeals),
            MapEntries(RecentActivity),
            MapEntries(LoanWatch),
            MapEntries(Clauses));
    }

    private sealed record ScoutingDocument(
        IReadOnlyList<ListEntryDocument> Assignments,
        IReadOnlyList<ListEntryDocument> FocusRegions,
        IReadOnlyList<ListEntryDocument> KnowledgeLevels,
        IReadOnlyList<ListEntryDocument> RecommendedPlayers,
        IReadOnlyList<ListEntryDocument> ShortTermFocus)
    {
        public ScoutingSnapshot ToSnapshot() => new(
            MapEntries(Assignments),
            MapEntries(FocusRegions),
            MapEntries(KnowledgeLevels),
            MapEntries(RecommendedPlayers),
            MapEntries(ShortTermFocus));
    }

    private sealed record ShortlistDocument(
        IReadOnlyList<ListEntryDocument> PriorityTargets,
        IReadOnlyList<ListEntryDocument> ContractStatus,
        IReadOnlyList<ListEntryDocument> Competition,
        IReadOnlyList<ListEntryDocument> Notes)
    {
        public ShortlistSnapshot ToSnapshot() => new(
            MapEntries(PriorityTargets),
            MapEntries(ContractStatus),
            MapEntries(Competition),
            MapEntries(Notes));
    }

    private sealed record FinanceDocument(
        FinanceSummaryDocument Summary,
        FinanceIncomeDocument Income,
        FinanceExpenditureDocument Expenditure)
    {
        public FinanceSnapshot ToSnapshot() => new(
            Summary.ToSnapshot(),
            Income.ToSnapshot(),
            Expenditure.ToSnapshot());
    }

    private sealed record FinanceSummaryDocument(
        MetricDocument OverallBalance,
        MetricDocument ProfitThisMonth,
        IReadOnlyList<ListEntryDocument> Budgets,
        IReadOnlyList<ListEntryDocument> Projections,
        IReadOnlyList<ListEntryDocument> Debts,
        IReadOnlyList<ListEntryDocument> SponsorDeals)
    {
        public FinanceSummarySnapshot ToSnapshot() => new(
            MapMetric(OverallBalance),
            MapMetric(ProfitThisMonth),
            MapEntries(Budgets),
            MapEntries(Projections),
            MapEntries(Debts),
            MapEntries(SponsorDeals));
    }

    private sealed record FinanceIncomeDocument(
        IReadOnlyList<ListEntryDocument> RevenueStreams,
        IReadOnlyList<ListEntryDocument> MatchdayIncome,
        IReadOnlyList<ListEntryDocument> CommercialIncome,
        IReadOnlyList<ListEntryDocument> CompetitionPrizes)
    {
        public FinanceIncomeSnapshot ToSnapshot() => new(
            MapEntries(RevenueStreams),
            MapEntries(MatchdayIncome),
            MapEntries(CommercialIncome),
            MapEntries(CompetitionPrizes));
    }

    private sealed record FinanceExpenditureDocument(
        IReadOnlyList<ListEntryDocument> MajorCosts,
        IReadOnlyList<ListEntryDocument> WageBreakdown,
        IReadOnlyList<ListEntryDocument> TransferSpending,
        IReadOnlyList<ListEntryDocument> OperationalCosts)
    {
        public FinanceExpenditureSnapshot ToSnapshot() => new(
            MapEntries(MajorCosts),
            MapEntries(WageBreakdown),
            MapEntries(TransferSpending),
            MapEntries(OperationalCosts));
    }

    private sealed record FixturesDocument(
        FixturesScheduleDocument Schedule,
        FixturesResultsDocument Results,
        FixturesCalendarDocument Calendar)
    {
        public FixturesSnapshot ToSnapshot() => new(
            Schedule.ToSnapshot(),
            Results.ToSnapshot(),
            Calendar.ToSnapshot());
    }

    private sealed record FixturesScheduleDocument(
        IReadOnlyList<ListEntryDocument> UpcomingFixtures,
        IReadOnlyList<ListEntryDocument> TravelPlans,
        IReadOnlyList<ListEntryDocument> Broadcasts,
        IReadOnlyList<ListEntryDocument> PreparationFocus)
    {
        public FixturesScheduleSnapshot ToSnapshot() => new(
            MapEntries(UpcomingFixtures),
            MapEntries(TravelPlans),
            MapEntries(Broadcasts),
            MapEntries(PreparationFocus));
    }

    private sealed record FixturesResultsDocument(
        IReadOnlyList<ListEntryDocument> RecentResults,
        IReadOnlyList<ListEntryDocument> PlayerRatings,
        IReadOnlyList<ListEntryDocument> Trends,
        IReadOnlyList<ListEntryDocument> KeyMoments)
    {
        public FixturesResultsSnapshot ToSnapshot() => new(
            MapEntries(RecentResults),
            MapEntries(PlayerRatings),
            MapEntries(Trends),
            MapEntries(KeyMoments));
    }

    private sealed record FixturesCalendarDocument(
        IReadOnlyList<ListEntryDocument> MonthOverview,
        IReadOnlyList<ListEntryDocument> CupDraws,
        IReadOnlyList<ListEntryDocument> InternationalBreaks,
        IReadOnlyList<ListEntryDocument> Reminders)
    {
        public FixturesCalendarSnapshot ToSnapshot() => new(
            MapEntries(MonthOverview),
            MapEntries(CupDraws),
            MapEntries(InternationalBreaks),
            MapEntries(Reminders));
    }

    private sealed record FormationLineDocument(string Role, IReadOnlyList<FormationPlayerDocument>? Players);

    private sealed record FormationPlayerDocument(string? Id, string Name, double X, double Y);

    private sealed record MetricDocument(string Value, string Summary, string? Pill);

    private sealed record InstructionDocument(string? Description, IReadOnlyList<InstructionItemDocument>? Items);

    private sealed record InstructionItemDocument(string Label, string Value, string? Detail);

    private sealed record ListEntryDocument(string Primary, string? Secondary, string? Tertiary, string? Accent);
}
