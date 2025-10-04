using System.Collections.Generic;
using System.Linq;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface ICardLayoutCatalog
{
    bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout);
}

public sealed class CardLayoutCatalog : ICardLayoutCatalog
{
    private readonly Dictionary<(string Tab, string Section), CardLayout> _layouts;

    public CardLayoutCatalog(IClubDataService clubDataService)
    {
        var snapshot = clubDataService.GetSnapshot();

        _layouts = new Dictionary<(string, string), CardLayout>
        {
            [("overview", "club-vision")] = BuildClubVisionOverview(snapshot.Overview.ClubVision),
            [("overview", "dynamics")] = BuildDynamicsOverview(snapshot.Overview.Dynamics),
            [("overview", "medical-centre")] = BuildMedicalCentre(snapshot.Overview.Medical),
            [("overview", "analytics")] = BuildAnalyticsOverview(snapshot.Overview.Analytics),
            [("squad", "selection-info")] = BuildSquadSelectionInfo(snapshot.Squad.SelectionInfo),
            [("squad", "players")] = BuildSquadPlayers(snapshot.Squad.Players),
            [("squad", "international")] = BuildSquadInternational(snapshot.Squad.International),
            [("squad", "squad-depth")] = BuildSquadDepth(snapshot.Squad.Depth),
            [("tactics", "tactics-overview")] = BuildTacticsOverview(snapshot.Tactics),
            [("tactics", "set-pieces")] = BuildTacticsSetPieces(snapshot.Tactics.SetPieces),
            [("tactics", "tactics-analysis")] = BuildTacticsAnalysis(snapshot.Tactics.Analysis),
            [("training", "training-overview")] = BuildTrainingOverview(snapshot.Training.Overview),
            [("training", "training-calendar")] = BuildTrainingCalendar(snapshot.Training.Calendar),
            [("training", "training-units")] = BuildTrainingUnits(snapshot.Training.Units),
            [("transfers", "transfer-centre")] = BuildTransferCentre(snapshot.Transfers.Centre),
            [("transfers", "scouting")] = BuildTransfersScouting(snapshot.Transfers.Scouting),
            [("transfers", "shortlist")] = BuildTransfersShortlist(snapshot.Transfers.Shortlist),
            [("finances", "finances-summary")] = BuildFinancesSummary(snapshot.Finance.Summary),
            [("finances", "finances-income")] = BuildFinancesIncome(snapshot.Finance.Income),
            [("finances", "finances-expenditure")] = BuildFinancesExpenditure(snapshot.Finance.Expenditure),
            [("fixtures", "fixtures-schedule")] = BuildFixturesSchedule(snapshot.Fixtures.Schedule),
            [("fixtures", "fixtures-results")] = BuildFixturesResults(snapshot.Fixtures.Results),
            [("fixtures", "fixtures-calendar")] = BuildFixturesCalendar(snapshot.Fixtures.Calendar),
        };
    }

    public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout) =>
        _layouts.TryGetValue((tabIdentifier, sectionIdentifier), out layout);

    private static CardLayout BuildTacticsOverview(TacticalSnapshot snapshot)
    {
        var cards = new List<CardDefinition>
        {
            new(
                Id: "formation-overview",
                Title: snapshot.FormationName,
                Subtitle: snapshot.SquadLabel,
                Kind: CardKind.Formation,
                Column: 0,
                Row: 0,
                ColumnSpan: 22,
                RowSpan: 14,
                Description: snapshot.Description,
                PillText: snapshot.MentalityPill,
                FormationLines: snapshot.FormationLines
                    .Select(line => new FormationLineDefinition(line.Role, line.Players))
                    .ToList()),
            CreateMetricCard("team-fluidity", "Team Fluidity", "Shape cohesion", snapshot.Fluidity, 22, 0, 7, 5),
            CreateMetricCard("mentality", "Mentality", "In possession mindset", snapshot.Mentality, 29, 0, 8, 5),
            new(
                Id: "in-possession",
                Title: "In Possession",
                Subtitle: "Selected instructions",
                Kind: CardKind.List,
                Column: 22,
                Row: 5,
                ColumnSpan: 15,
                RowSpan: 7,
                Description: snapshot.InPossession.Description,
                ListItems: MapInstructionItems(snapshot.InPossession.Items)),
            new(
                Id: "in-transition",
                Title: "In Transition",
                Subtitle: "Moment reactions",
                Kind: CardKind.List,
                Column: 22,
                Row: 12,
                ColumnSpan: 15,
                RowSpan: 7,
                ListItems: MapInstructionItems(snapshot.InTransition.Items)),
            new(
                Id: "out-of-possession",
                Title: "Out Of Possession",
                Subtitle: "Defensive block",
                Kind: CardKind.List,
                Column: 0,
                Row: 14,
                ColumnSpan: 18,
                RowSpan: 5,
                ListItems: MapInstructionItems(snapshot.OutOfPossession.Items)),
            CreateFixtureCard(),
            new(
                Id: "tactical-familiarity",
                Title: "Tactical Familiarity",
                Subtitle: "Team understanding",
                Kind: CardKind.Status,
                Column: 0,
                Row: 14,
                ColumnSpan: 8,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("Mentality", "Accomplished"),
                    new("Passing Style", "Fluid"),
                    new("Pressing", "Highly Responsive"),
                    new("Creative Freedom", "Well Adapted"),
                }),
            new(
                Id: "fitness-report",
                Title: "Fitness Report",
                Subtitle: "Medical Centre",
                Kind: CardKind.List,
                Column: 8,
                Row: 14,
                ColumnSpan: 10,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("Gabriel Jesus", "Out (2-3 weeks)", "Sprained Knee Ligaments"),
                    new("Thomas Partey", "Doubtful", "Lacking match fitness"),
                    new("Oleksandr Zinchenko", "Match Fit", "Ready for selection"),
                }),
            new(
                Id: "recent-form",
                Title: "Recent Form",
                Subtitle: "Last five fixtures",
                Kind: CardKind.List,
                Column: 18,
                Row: 14,
                ColumnSpan: 19,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("vs Man City", "W 2-1", "Premier League", "Sat"),
                    new("vs Chelsea", "D 0-0", "Premier League", "Wed"),
                    new("vs Everton", "W 3-0", "Premier League", "Sun"),
                    new("vs PSG", "L 1-2", "Champions League", "Tue"),
                    new("vs Leicester", "W 4-1", "Premier League", "Sat"),
                }),
        };

        return new CardLayout("tactics", "tactics-overview", cards);
    }

    private static CardLayout BuildTacticsSetPieces(SetPieceSnapshot setPieces)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("attacking-corners", "Attacking Corners", "Delivery plans", 0, 0, 18, 7, setPieces.AttackingCorners),
            CreateListCard("defending-corners", "Defending Corners", "Assignments", 18, 0, 19, 7, setPieces.DefendingCorners),
            CreateListCard("free-kicks", "Free Kicks", "Primary takers", 0, 7, 18, 6, setPieces.FreeKicks),
            CreateListCard("throw-ins", "Throw-Ins", "Routine focus", 18, 7, 19, 6, setPieces.ThrowIns),
            CreateListCard("penalty-takers", "Penalty Order", "Hierarchy", 0, 13, 37, 6, setPieces.PenaltyTakers),
        };

        return new CardLayout("tactics", "set-pieces", cards);
    }

    private static CardLayout BuildTacticsAnalysis(TacticalAnalysisSnapshot analysis)
    {
        var cards = new List<CardDefinition>
        {
            CreateMetricCard("recent-form", "Recent Form", "Last five matches", analysis.RecentForm, 0, 0, 12, 5),
            CreateListCard("strengths", "Strengths", "Where we excel", 12, 0, 12, 7, analysis.Strengths),
            CreateListCard("weaknesses", "Weaknesses", "Risks to manage", 24, 0, 13, 7, analysis.Weaknesses),
            CreateListCard("key-statistics", "Key Statistics", "Performance snapshot", 0, 5, 18, 7, analysis.Statistics),
            CreateListCard("recommendations", "Recommendations", "Coaching directives", 18, 5, 19, 7, analysis.Recommendations),
        };

        return new CardLayout("tactics", "tactics-analysis", cards);
    }

    private static CardLayout BuildClubVisionOverview(ClubVisionSnapshot clubVision)
    {
        var cards = new List<CardDefinition>
        {
            CreateMetricCard("board-confidence", "Board Confidence", "Season to date", clubVision.BoardConfidence, 0, 0, 12, 6),
            CreateMetricCard("supporter-confidence", "Supporter Confidence", "Mood of the terraces", clubVision.SupporterConfidence, 12, 0, 12, 6),
            CreateListCard("competition-expectations", "Competition Expectations", "Key objectives", 24, 0, 13, 9, clubVision.CompetitionExpectations),
            CreateListCard("five-year-plan", "Five Year Plan", "Strategic milestones", 0, 6, 24, 6, clubVision.FiveYearPlan),
            CreateListCard("finance-snapshot", "Finance Snapshot", "Month to date", 0, 12, 18, 7, clubVision.FinanceSnapshot),
            CreateListCard("top-performers", "Top Performers", "Last five matches", 18, 12, 19, 7, clubVision.TopPerformers),
        };

        return new CardLayout("overview", "club-vision", cards);
    }

    private static CardLayout BuildDynamicsOverview(DynamicsSnapshot dynamics)
    {
        var cards = new List<CardDefinition>
        {
            CreateMetricCard("team-cohesion", "Team Cohesion", "Unit synergy", dynamics.TeamCohesion, 0, 0, 12, 5),
            CreateMetricCard("dressing-room", "Dressing Room Atmosphere", "Mood", dynamics.DressingRoomAtmosphere, 12, 0, 12, 5),
            CreateMetricCard("managerial-support", "Managerial Support", "Leadership trust", dynamics.ManagerialSupport, 24, 0, 13, 5),
            CreateListCard("social-groups", "Social Groups", "Relationships", 0, 5, 18, 7, dynamics.SocialGroups),
            CreateListCard("influencers", "Influencers", "Leadership core", 18, 5, 9, 7, dynamics.Influencers),
            CreateListCard("player-issues", "Player Issues", "Concerns raised", 27, 5, 10, 7, dynamics.PlayerIssues),
            CreateListCard("meetings", "Upcoming Meetings", "Engagement diary", 0, 12, 18, 7, dynamics.Meetings),
            CreateListCard("praise", "Recent Praise", "Positive feedback", 18, 12, 19, 7, dynamics.PraiseMoments),
        };

        return new CardLayout("overview", "dynamics", cards);
    }

    private static CardLayout BuildMedicalCentre(MedicalSnapshot medical)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("injury-report", "Injury Report", "Current status", 0, 0, 19, 7, medical.InjuryList),
            CreateMetricCard("risk-assessment", "Risk Assessment", "Squad readiness", medical.RiskAssessment, 19, 0, 9, 5),
            CreateMetricCard("workload-monitoring", "Workload Monitoring", "Training load", medical.WorkloadMonitoring, 28, 0, 9, 5),
            CreateListCard("rehab-progress", "Rehab Progress", "Return timelines", 0, 7, 19, 5, medical.RehabProgress),
            CreateListCard("risk-breakdown", "Risk Breakdown", "Likelihood overview", 19, 5, 18, 7, medical.RiskBreakdown),
            CreateListCard("staff-notes", "Staff Notes", "Medical guidance", 0, 12, 19, 7, medical.StaffNotes),
        };

        return new CardLayout("overview", "medical-centre", cards);
    }

    private static CardLayout BuildAnalyticsOverview(AnalyticsSnapshot analytics)
    {
        var cards = new List<CardDefinition>
        {
            CreateMetricCard("expected-goals", "Expected Goals Trend", "Rolling average", analytics.ExpectedGoalsTrend, 0, 0, 12, 5),
            CreateListCard("shot-locations", "Shot Locations", "Chance map", 12, 0, 12, 7, analytics.ShotLocations),
            CreateListCard("possession-zones", "Possession Zones", "Territory split", 24, 0, 13, 7, analytics.PossessionZones),
            CreateListCard("passing-network", "Passing Network", "Combinations", 0, 5, 18, 7, analytics.PassingNetworks),
            CreateListCard("team-comparison", "Team Comparison", "League rank", 18, 5, 9, 7, analytics.TeamComparison),
            CreateListCard("key-stats", "Key Stats", "Performance summary", 27, 5, 10, 7, analytics.KeyStats),
        };

        return new CardLayout("overview", "analytics", cards);
    }

    private static CardLayout BuildSquadSelectionInfo(SelectionInfoSnapshot selection)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("matchday-readiness", "Matchday Readiness", "Squad availability", 0, 0, 19, 6, selection.MatchdayReadiness),
            CreateListCard("fitness-concerns", "Fitness Concerns", "Players to monitor", 19, 0, 18, 6, selection.FitnessConcerns),
            CreateListCard("suspensions", "Suspensions", "Unavailable", 0, 6, 18, 5, selection.Suspensions),
            CreateListCard("recent-form", "Recent Form", "Performance trend", 18, 6, 19, 5, selection.RecentForm),
            CreateListCard("training-focus", "Training Focus", "Session priorities", 0, 11, 37, 8, selection.TrainingFocus),
        };

        return new CardLayout("squad", "selection-info", cards);
    }

    private static CardLayout BuildSquadPlayers(PlayersSnapshot players)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("key-players", "Key Players", "Impact metrics", 0, 0, 19, 7, players.KeyPlayers),
            CreateListCard("statistics-leaders", "Statistics Leaders", "Season leaders", 19, 0, 18, 7, players.StatisticsLeaders),
            CreateListCard("emerging-players", "Emerging Players", "Development watch", 0, 7, 12, 5, players.EmergingPlayers),
            CreateListCard("contract-status", "Contract Status", "Expiry overview", 12, 7, 13, 5, players.ContractStatus),
            CreateListCard("transfer-interest", "Transfer Interest", "Clubs monitoring", 25, 7, 12, 5, players.TransferInterest),
        };

        return new CardLayout("squad", "players", cards);
    }

    private static CardLayout BuildSquadInternational(InternationalSnapshot international)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("call-ups", "International Call-Ups", "Current squads", 0, 0, 18, 7, international.CallUps),
            CreateListCard("travel-plans", "Travel Plans", "Logistics", 18, 0, 19, 7, international.TravelPlans),
            CreateListCard("availability", "Availability", "Return timelines", 0, 7, 18, 6, international.Availability),
            CreateListCard("scouting-reports", "Scouting Reports", "Talent radar", 18, 7, 19, 6, international.ScoutingReports),
        };

        return new CardLayout("squad", "international", cards);
    }

    private static CardLayout BuildSquadDepth(SquadDepthSnapshot depth)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("depth-chart", "Depth Chart", "Primary options", 0, 0, 18, 7, depth.DepthChart),
            CreateListCard("role-battles", "Role Battles", "Selection dilemmas", 18, 0, 19, 7, depth.RoleBattles),
            CreateListCard("youth-depth", "Youth Depth", "Academy coverage", 0, 7, 18, 6, depth.YouthDepth),
            CreateListCard("positional-ratings", "Positional Ratings", "Star levels", 18, 7, 19, 6, depth.PositionalRatings),
        };

        return new CardLayout("squad", "squad-depth", cards);
    }

    private static CardLayout BuildTrainingOverview(TrainingOverviewSnapshot training)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("upcoming-sessions", "Upcoming Sessions", "Next 5 days", 0, 0, 20, 7, training.UpcomingSessions),
            CreateMetricCard("training-intensity", "Training Intensity", "Overall load", training.Intensity, 20, 0, 9, 5),
            CreateListCard("focus-areas", "Focus Areas", "Current emphasis", 29, 0, 8, 7, training.FocusAreas),
            CreateListCard("unit-coaches", "Unit Coaches", "Specialist assignments", 0, 7, 18, 7, training.UnitCoaches),
            CreateListCard("medical-workload", "Medical Workload", "Risk watch", 18, 7, 10, 5, training.MedicalWorkload),
            CreateListCard("match-prep", "Match Prep", "Weekend fixture", 28, 7, 9, 7, training.MatchPreparation),
            CreateListCard("individual-focus", "Individual Focus", "Highlighted players", 0, 14, 19, 5, training.IndividualFocus),
            CreateListCard("youth-development", "Youth Development", "Academy focus", 19, 14, 18, 5, training.YouthDevelopment),
        };

        return new CardLayout("training", "training-overview", cards);
    }

    private static CardLayout BuildTrainingCalendar(TrainingCalendarSnapshot calendar)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("week-overview", "Week Overview", "Session outline", 0, 0, 19, 7, calendar.WeekOverview),
            CreateListCard("rest-days", "Rest Days", "Recovery blocks", 19, 0, 18, 5, calendar.RestDays),
            CreateListCard("match-prep-focus", "Match Prep Focus", "Opponent prep", 19, 5, 18, 5, calendar.MatchPrepFocus),
            CreateListCard("milestones", "Upcoming Milestones", "Key dates", 0, 7, 37, 7, calendar.UpcomingMilestones),
        };

        return new CardLayout("training", "training-calendar", cards);
    }

    private static CardLayout BuildTrainingUnits(TrainingUnitsSnapshot units)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("senior-unit", "Senior Unit", "First team", 0, 0, 18, 7, units.SeniorUnit),
            CreateListCard("youth-unit", "Youth Unit", "Development squads", 18, 0, 19, 7, units.YouthUnit),
            CreateListCard("goalkeeping-unit", "Goalkeeping", "Shot-stopping focus", 0, 7, 18, 6, units.GoalkeepingUnit),
            CreateListCard("coach-assignments", "Coach Assignments", "Specialists", 18, 7, 19, 6, units.CoachAssignments),
        };

        return new CardLayout("training", "training-units", cards);
    }

    private static CardLayout BuildTransferCentre(TransferCentreSnapshot centre)
    {
        var cards = new List<CardDefinition>
        {
            CreateMetricCard("budget-usage", "Budget Usage", "Committed funds", centre.BudgetUsage, 0, 0, 12, 5),
            CreateListCard("active-deals", "Active Deals", "Negotiations", 12, 0, 13, 7, centre.ActiveDeals),
            CreateListCard("recent-activity", "Recent Activity", "Completed moves", 25, 0, 12, 7, centre.RecentActivity),
            CreateListCard("loan-watch", "Loan Watch", "Development tracker", 0, 5, 18, 7, centre.LoanWatch),
            CreateListCard("clauses", "Clauses", "Financial obligations", 18, 7, 19, 7, centre.Clauses),
        };

        return new CardLayout("transfers", "transfer-centre", cards);
    }

    private static CardLayout BuildTransfersScouting(ScoutingSnapshot scouting)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("assignments", "Assignments", "Current focuses", 0, 0, 18, 7, scouting.Assignments),
            CreateListCard("focus-regions", "Focus Regions", "Knowledge coverage", 18, 0, 19, 7, scouting.FocusRegions),
            CreateListCard("knowledge-levels", "Knowledge Levels", "Global insight", 0, 7, 18, 6, scouting.KnowledgeLevels),
            CreateListCard("recommended-players", "Recommended Players", "Scouting priority", 18, 7, 19, 6, scouting.RecommendedPlayers),
            CreateListCard("short-term-focus", "Short-Term Focus", "Upcoming windows", 0, 13, 37, 6, scouting.ShortTermFocus),
        };

        return new CardLayout("transfers", "scouting", cards);
    }

    private static CardLayout BuildTransfersShortlist(ShortlistSnapshot shortlist)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("priority-targets", "Priority Targets", "Primary options", 0, 0, 18, 7, shortlist.PriorityTargets),
            CreateListCard("contract-status", "Contract Status", "Expiry watch", 18, 0, 19, 7, shortlist.ContractStatus),
            CreateListCard("competition", "Competition", "Clubs interested", 0, 7, 18, 6, shortlist.Competition),
            CreateListCard("notes", "Notes", "Scouting insights", 18, 7, 19, 6, shortlist.Notes),
        };

        return new CardLayout("transfers", "shortlist", cards);
    }

    private static CardLayout BuildFinancesSummary(FinanceSummarySnapshot finance)
    {
        var cards = new List<CardDefinition>
        {
            CreateMetricCard("overall-balance", "Overall Balance", "Current balance", finance.OverallBalance, 0, 0, 12, 5),
            CreateMetricCard("profit-month", "Profit This Month", "Monthly variance", finance.ProfitThisMonth, 12, 0, 12, 5),
            CreateListCard("budgets", "Budgets", "Allocation", 24, 0, 13, 5, finance.Budgets),
            CreateListCard("projections", "Projections", "Forecast", 0, 5, 18, 7, finance.Projections),
            CreateListCard("debts", "Debts", "Long-term", 18, 5, 9, 7, finance.Debts),
            CreateListCard("sponsor-deals", "Sponsor Deals", "Commercial partners", 27, 5, 10, 7, finance.SponsorDeals),
        };

        return new CardLayout("finances", "finances-summary", cards);
    }

    private static CardLayout BuildFinancesIncome(FinanceIncomeSnapshot income)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("revenue-streams", "Revenue Streams", "Month to date", 0, 0, 18, 7, income.RevenueStreams),
            CreateListCard("matchday-income", "Matchday Income", "Breakdown", 18, 0, 19, 7, income.MatchdayIncome),
            CreateListCard("commercial-income", "Commercial Income", "Year on year", 0, 7, 18, 6, income.CommercialIncome),
            CreateListCard("competition-prizes", "Competition Prizes", "Earnings", 18, 7, 19, 6, income.CompetitionPrizes),
        };

        return new CardLayout("finances", "finances-income", cards);
    }

    private static CardLayout BuildFinancesExpenditure(FinanceExpenditureSnapshot expenditure)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("major-costs", "Major Costs", "Primary spend", 0, 0, 18, 7, expenditure.MajorCosts),
            CreateListCard("wage-breakdown", "Wage Breakdown", "Squad allocation", 18, 0, 19, 7, expenditure.WageBreakdown),
            CreateListCard("transfer-spending", "Transfer Spending", "Window summary", 0, 7, 18, 6, expenditure.TransferSpending),
            CreateListCard("operational-costs", "Operational Costs", "Club operations", 18, 7, 19, 6, expenditure.OperationalCosts),
        };

        return new CardLayout("finances", "finances-expenditure", cards);
    }

    private static CardLayout BuildFixturesSchedule(FixturesScheduleSnapshot schedule)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("upcoming-fixtures", "Upcoming Fixtures", "Next matches", 0, 0, 19, 7, schedule.UpcomingFixtures, kind: CardKind.Fixture),
            CreateListCard("travel-plans", "Travel Plans", "Logistics", 19, 0, 18, 7, schedule.TravelPlans),
            CreateListCard("broadcasts", "Broadcasts", "Coverage", 0, 7, 19, 5, schedule.Broadcasts),
            CreateListCard("preparation-focus", "Preparation Focus", "Coaching notes", 19, 7, 18, 5, schedule.PreparationFocus),
        };

        return new CardLayout("fixtures", "fixtures-schedule", cards);
    }

    private static CardLayout BuildFixturesResults(FixturesResultsSnapshot results)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("recent-results", "Recent Results", "Form guide", 0, 0, 19, 7, results.RecentResults, kind: CardKind.Fixture),
            CreateListCard("player-ratings", "Player Ratings", "Highlights", 19, 0, 18, 5, results.PlayerRatings),
            CreateListCard("trends", "Trends", "Performance patterns", 19, 5, 18, 5, results.Trends),
            CreateListCard("key-moments", "Key Moments", "Decisive events", 0, 7, 19, 5, results.KeyMoments),
        };

        return new CardLayout("fixtures", "fixtures-results", cards);
    }

    private static CardLayout BuildFixturesCalendar(FixturesCalendarSnapshot calendar)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("month-overview", "Month Overview", "Fixture density", 0, 0, 19, 7, calendar.MonthOverview),
            CreateListCard("cup-draws", "Cup Draws", "Upcoming ties", 19, 0, 18, 5, calendar.CupDraws),
            CreateListCard("international-breaks", "International Breaks", "Availability", 19, 5, 18, 5, calendar.InternationalBreaks),
            CreateListCard("reminders", "Reminders", "Key admin", 0, 7, 37, 7, calendar.Reminders),
        };

        return new CardLayout("fixtures", "fixtures-calendar", cards);
    }

    private static IReadOnlyList<CardListItem> MapInstructionItems(IReadOnlyList<InstructionItemSnapshot> items)
    {
        if (items.Count == 0)
        {
            return System.Array.Empty<CardListItem>();
        }

        var mapped = new List<CardListItem>(items.Count);
        foreach (var item in items)
        {
            mapped.Add(new CardListItem(item.Label, item.Value, item.Detail));
        }

        return mapped;
    }

    private static IReadOnlyList<CardListItem> MapEntries(IReadOnlyList<ListEntrySnapshot> entries)
    {
        if (entries is null || entries.Count == 0)
        {
            return System.Array.Empty<CardListItem>();
        }

        var list = new List<CardListItem>(entries.Count);
        foreach (var entry in entries)
        {
            list.Add(new CardListItem(entry.Primary, entry.Secondary, entry.Tertiary, entry.Accent));
        }

        return list;
    }

    private static CardDefinition CreateMetricCard(string id, string title, string subtitle, MetricSnapshot metric, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.Metric,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            MetricValue: metric.Value,
            MetricLabel: metric.Summary,
            PillText: metric.Pill);
    }

    private static CardDefinition CreateListCard(string id, string title, string? subtitle, int column, int row, int columnSpan, int rowSpan, IReadOnlyList<ListEntrySnapshot> entries, string? description = null, CardKind kind = CardKind.List)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: kind,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            Description: description,
            ListItems: MapEntries(entries));
    }

    private static CardDefinition CreateFixtureCard()
    {
        return new CardDefinition(
            Id: "match-preview",
            Title: "Next Fixture",
            Subtitle: "Premier League",
            Kind: CardKind.Fixture,
            Column: 18,
            Row: 0,
            ColumnSpan: 19,
            RowSpan: 7,
            Description: "Arsenal vs Manchester City",
            ListItems: new List<CardListItem>
            {
                new("Venue", "Emirates Stadium"),
                new("Kick-Off", "Sat 17:30"),
                new("Form", "Arsenal WWWDL", "Man City WWLWW"),
            });
    }
}
