using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface ICardLayoutCatalog
{
    event EventHandler<LayoutsChangedEventArgs>? LayoutsChanged;

    bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout);
}

public sealed class CardLayoutCatalog : ICardLayoutCatalog, IDisposable
{
    private readonly IClubDataService _clubDataService;
    private readonly object _sync = new();
    private Dictionary<(string Tab, string Section), CardLayout> _layouts;
    private bool _disposed;

    public CardLayoutCatalog(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService;
        _layouts = BuildLayouts(clubDataService.GetSnapshot());
        _clubDataService.SnapshotChanged += OnSnapshotChanged;
    }

    public event EventHandler<LayoutsChangedEventArgs>? LayoutsChanged;

    public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout)
    {
        lock (_sync)
        {
            return _layouts.TryGetValue((tabIdentifier, sectionIdentifier), out layout);
        }
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        _clubDataService.SnapshotChanged -= OnSnapshotChanged;
        GC.SuppressFinalize(this);
    }

    private void OnSnapshotChanged(object? sender, ClubDataSnapshot snapshot)
    {
        var layouts = BuildLayouts(snapshot);

        lock (_sync)
        {
            _layouts = layouts;
        }

        var keys = layouts.Keys.ToArray();
        LayoutsChanged?.Invoke(this, new LayoutsChangedEventArgs(keys, isGlobal: true));
    }

    private static Dictionary<(string, string), CardLayout> BuildLayouts(ClubDataSnapshot snapshot) =>
        new()
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
                    .Select(line => new FormationLineDefinition(
                        line.Role,
                        line.Players
                            .Select(player => new FormationPlayerDefinition(player.Id, player.Name, player.X, player.Y))
                            .ToList()))
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

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                new CardDefinition(
                    Id: "transition-triggers",
                    Title: "Transition Triggers",
                    Subtitle: "Pressing cues",
                    Kind: CardKind.List,
                    Column: 0,
                    Row: 0,
                    ColumnSpan: 16,
                    RowSpan: 6,
                    Description: "Compact summary of the transition instructions",
                    ListItems: MapInstructionItems(snapshot.InTransition.Items.Take(4).ToList())),
                "Transition Triggers",
                "Pin the key pressing reactions from the transition phase"),
            CreatePreset(
                CreateListCard(
                    "analysis-recommendations",
                    "Analyst Recommendations",
                    "Coaching calls",
                    0,
                    0,
                    17,
                    6,
                    snapshot.Analysis.Recommendations),
                "Analyst Recommendations",
                "Surface the analysis team's tactical guidance on the overview"),
        };

        return CreateLayout("tactics", "tactics-overview", cards, extras);
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

        return CreateLayout("tactics", "set-pieces", cards);
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

        return CreateLayout("tactics", "tactics-analysis", cards);
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

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                CreateListCard(
                    "club-vision-finance-focus",
                    "Finance Focus",
                    "Board-monitored lines",
                    0,
                    0,
                    14,
                    6,
                    clubVision.FinanceSnapshot.Take(4).ToList()),
                "Finance Focus",
                "Compact list of the finance snapshot items under review"),
            CreatePreset(
                CreateListCard(
                    "club-vision-key-objectives",
                    "Competition Objectives (Top 3)",
                    "Season priorities",
                    0,
                    0,
                    14,
                    6,
                    clubVision.CompetitionExpectations.Take(3).ToList()),
                "Competition Objectives (Top 3)",
                "Highlight the highest priority competition targets"),
        };

        return CreateLayout("overview", "club-vision", cards, extras);
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

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                CreateListCard(
                    "dynamics-leadership-core",
                    "Leadership Core",
                    "Influencers & captains",
                    0,
                    0,
                    16,
                    6,
                    dynamics.Influencers),
                "Leadership Core",
                "Quick access to the dressing room leadership group"),
            CreatePreset(
                CreateListCard(
                    "dynamics-social-landscape",
                    "Social Landscape",
                    "Key groups",
                    0,
                    0,
                    18,
                    6,
                    dynamics.SocialGroups.Take(4).ToList()),
                "Social Landscape",
                "Summarise the dominant social groups in the squad"),
        };

        return CreateLayout("overview", "dynamics", cards, extras);
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

        return CreateLayout("overview", "medical-centre", cards);
    }

    private static CardLayout BuildAnalyticsOverview(AnalyticsSnapshot analytics)
    {
        var cards = new List<CardDefinition>
        {
            CreateLineChartCard("expected-goals", "Expected Goals Trend", "Rolling average", analytics.ExpectedGoalsTrend, 0, 0, 12, 5),
            CreateListCard("shot-locations", "Shot Locations", "Chance map", 12, 0, 12, 7, analytics.ShotLocations),
            CreateListCard("possession-zones", "Possession Zones", "Territory split", 24, 0, 13, 7, analytics.PossessionZones),
            CreateListCard("passing-network", "Passing Network", "Combinations", 0, 5, 18, 7, analytics.PassingNetworks),
            CreateListCard("team-comparison", "Team Comparison", "League rank", 18, 5, 9, 7, analytics.TeamComparison),
            CreateListCard("key-stats", "Key Stats", "Performance summary", 27, 5, 10, 7, analytics.KeyStats),
        };

        return CreateLayout("overview", "analytics", cards);
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

        return CreateLayout("squad", "selection-info", cards);
    }

    private static CardLayout BuildSquadPlayers(PlayersSnapshot players)
    {
        var cards = new List<CardDefinition>();

        if (players.Roster is { Count: > 0 })
        {
            cards.Add(CreateSquadTableCard(
                "squad-roster",
                "Squad Roster",
                "Filter, compare, and plan selection",
                MapSquadPlayers(players.Roster),
                column: 0,
                row: 0,
                columnSpan: 25,
                rowSpan: 12));
        }

        cards.Add(CreateListCard("key-players", "Key Players", "Impact metrics", 0, 12, 25, 7, players.KeyPlayers));
        cards.Add(CreateListCard("statistics-leaders", "Statistics Leaders", "Season leaders", 25, 0, 12, 6, players.StatisticsLeaders));
        cards.Add(CreateListCard("emerging-players", "Emerging Players", "Development watch", 25, 6, 12, 4, players.EmergingPlayers));
        cards.Add(CreateListCard("contract-status", "Contract Status", "Expiry overview", 25, 10, 12, 4, players.ContractStatus));
        cards.Add(CreateListCard("transfer-interest", "Transfer Interest", "Clubs monitoring", 25, 14, 12, 5, players.TransferInterest));

        return CreateLayout("squad", "players", cards);
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

        return CreateLayout("squad", "international", cards);
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

        return CreateLayout("squad", "squad-depth", cards);
    }

    private static CardLayout BuildTrainingOverview(TrainingOverviewSnapshot training)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("upcoming-sessions", "Upcoming Sessions", "Next 5 days", 0, 0, 20, 7, training.UpcomingSessions),
            CreateGaugeCard("training-intensity", "Training Intensity", "Overall load", training.Intensity, 20, 0, 9, 7),
            CreateListCard("focus-areas", "Focus Areas", "Current emphasis", 29, 0, 8, 7, training.FocusAreas),
            CreateWorkloadHeatmapCard(training.WorkloadHeatmap),
            CreateListCard("unit-coaches", "Unit Coaches", "Specialist assignments", 28, 7, 9, 5, training.UnitCoaches),
            CreateListCard("medical-workload", "Medical Workload", "Risk watch", 28, 12, 9, 5, training.MedicalWorkload),
            CreateListCard("match-prep", "Match Prep", "Weekend fixture", 28, 17, 9, 2, training.MatchPreparation),
            CreateListCard("individual-focus", "Individual Focus", "Highlighted players", 0, 15, 19, 4, training.IndividualFocus),
            CreateListCard("youth-development", "Youth Development", "Academy focus", 19, 15, 9, 4, training.YouthDevelopment),
        };

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                CreateListCard(
                    "training-medical-flags",
                    "Medical Flags",
                    "Players to monitor",
                    0,
                    0,
                    16,
                    6,
                    training.MedicalWorkload),
                "Medical Flags",
                "Keep the high-risk workload notes pinned to the board"),
            CreatePreset(
                CreateMetricCard(
                    "training-intensity-compact",
                    "Intensity Snapshot",
                    "Daily load",
                    training.Intensity,
                    0,
                    0,
                    10,
                    4),
                "Training Intensity (Compact)",
                "Compact gauge for quick dashboards"),
        };

        return CreateLayout("training", "training-overview", cards, extras);
    }

    private static CardLayout BuildTrainingCalendar(TrainingCalendarSnapshot calendar)
    {
        var orderedSessions = calendar.SessionDetails is { Count: > 0 }
            ? TrainingCalendarFormatter.OrderSessions(calendar.SessionDetails).ToList()
            : new List<TrainingSessionDetailSnapshot>();

        var weekOverviewEntries = orderedSessions.Count > 0
            ? TrainingCalendarFormatter.BuildWeekOverview(orderedSessions)
            : calendar.WeekOverview;

        var calendarCard = CreateTrainingCalendarCard(
            "weekly-calendar",
            "Weekly Calendar",
            "Drag sessions between slots to reschedule.",
            0,
            0,
            28,
            12,
            orderedSessions);

        var cards = new List<CardDefinition>
        {
            calendarCard,
            CreateListCard("rest-days", "Rest Days", "Recovery blocks", 28, 0, 9, 5, calendar.RestDays),
            CreateListCard("match-prep-focus", "Match Prep Focus", "Opponent prep", 28, 5, 9, 4, calendar.MatchPrepFocus),
            CreateListCard("week-overview", "Week Overview", "Session outline", 0, 12, 28, 7, weekOverviewEntries),
            CreateListCard("milestones", "Upcoming Milestones", "Key dates", 28, 9, 9, 10, calendar.UpcomingMilestones),
        };

        return CreateLayout("training", "training-calendar", cards);
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

        return CreateLayout("training", "training-units", cards);
    }

    private static CardLayout BuildTransferCentre(TransferCentreSnapshot centre)
    {
        var negotiations = centre.Negotiations ?? Array.Empty<TransferNegotiationDealSnapshot>();

        var cards = new List<CardDefinition>
        {
            CreateGaugeCard("budget-usage", "Budget Usage", "Committed funds", centre.BudgetUsage, 0, 0, 12, 6),
            CreateNegotiationCard("active-deals", "Active Deals", "Negotiations", 12, 0, 13, 7, negotiations, "Negotiations"),
            CreateListCard("recent-activity", "Recent Activity", "Completed moves", 25, 0, 12, 7, centre.RecentActivity),
            CreateListCard("loan-watch", "Loan Watch", "Development tracker", 0, 6, 18, 6, centre.LoanWatch),
            CreateListCard("clauses", "Clauses", "Financial obligations", 18, 6, 19, 6, centre.Clauses),
        };

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                CreateListCard(
                    "transfer-active-compact",
                    "Active Deals (Compact)",
                    "Urgent negotiations",
                    0,
                    0,
                    15,
                    6,
                    BuildNegotiationSummaries(negotiations, 4)),
                "Active Deals (Compact)",
                "Focus on the most urgent ongoing deals"),
            CreatePreset(
                CreateListCard(
                    "transfer-loan-highlights",
                    "Loan Watch Highlights",
                    "Key performances",
                    0,
                    0,
                    15,
                    6,
                    centre.LoanWatch.Take(3).ToList()),
                "Loan Watch Highlights",
                "Track standout loan performances"),
        };

        return CreateLayout("transfers", "transfer-centre", cards, extras);
    }

    private static CardLayout BuildTransfersScouting(ScoutingSnapshot scouting)
    {
        var cards = new List<CardDefinition>
        {
            CreateScoutAssignmentsCard(
                "scout-assignments-board",
                "Assignments Board",
                "Current focus areas",
                0,
                0,
                18,
                7,
                scouting.AssignmentBoard,
                scouting.AssignmentStages,
                scouting.AssignmentPriorities,
                scouting.ScoutPool),
            CreateListCard("focus-regions", "Focus Regions", "Knowledge coverage", 18, 0, 19, 7, scouting.FocusRegions),
            CreateListCard("knowledge-levels", "Knowledge Levels", "Global insight", 0, 7, 18, 6, scouting.KnowledgeLevels),
            CreateListCard("recommended-players", "Recommended Players", "Scouting priority", 18, 7, 19, 6, scouting.RecommendedPlayers),
            CreateListCard("short-term-focus", "Short-Term Focus", "Upcoming windows", 0, 13, 37, 6, scouting.ShortTermFocus),
        };

        return CreateLayout("transfers", "scouting", cards);
    }

    private static CardLayout BuildTransfersShortlist(ShortlistSnapshot shortlist)
    {
        var cards = new List<CardDefinition>
        {
            CreateShortlistBoardCard(
                "shortlist-board",
                "Shortlist Board",
                "Primary recruitment targets",
                0,
                0,
                18,
                7,
                shortlist.Board,
                shortlist.StatusOptions,
                shortlist.ActionOptions),
            CreateListCard("contract-status", "Contract Status", "Expiry watch", 18, 0, 19, 7, shortlist.ContractStatus),
            CreateListCard("competition", "Competition", "Clubs interested", 0, 7, 18, 6, shortlist.Competition),
            CreateListCard("notes", "Notes", "Scouting insights", 18, 7, 19, 6, shortlist.Notes),
        };

        return CreateLayout("transfers", "shortlist", cards);
    }

    private static CardLayout BuildFinancesSummary(FinanceSummarySnapshot finance)
    {
        var cards = new List<CardDefinition>
        {
            CreateGaugeCard("overall-balance", "Overall Balance", "Current balance", finance.OverallBalance, 0, 0, 12, 6),
            CreateLineChartCard("profit-month", "Profit This Month", "Monthly variance", finance.ProfitThisMonth, 12, 0, 12, 6, "#FF9F1C"),
            CreateListCard("budgets", "Budgets", "Allocation", 24, 0, 13, 6, finance.Budgets),
            CreateListCard("projections", "Projections", "Forecast", 0, 6, 18, 6, finance.Projections),
            CreateListCard("debts", "Debts", "Long-term", 18, 6, 9, 6, finance.Debts),
            CreateListCard("sponsor-deals", "Sponsor Deals", "Commercial partners", 27, 6, 10, 6, finance.SponsorDeals),
            CreateForecastCard("finance-forecast", "Budget Scenario", "Explore allocation changes", finance.Forecast, 0, 12, 37, 7),
        };

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                CreateListCard(
                    "finance-sponsor-deals",
                    "Sponsor Deals Spotlight",
                    "Commercial partners",
                    0,
                    0,
                    16,
                    6,
                    finance.SponsorDeals),
                "Sponsor Deals Spotlight",
                "Highlight active sponsorship agreements"),
            CreatePreset(
                CreateListCard(
                    "finance-debt-obligations",
                    "Debt Obligations",
                    "Repayment schedule",
                    0,
                    0,
                    16,
                    6,
                    finance.Debts),
                "Debt Obligations",
                "Monitor outstanding debt commitments"),
        };

        return CreateLayout("finances", "finances-summary", cards, extras);
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

        return CreateLayout("finances", "finances-income", cards);
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

        return CreateLayout("finances", "finances-expenditure", cards);
    }

    private static CardLayout BuildFixturesSchedule(FixturesScheduleSnapshot schedule)
    {
        var cards = new List<CardDefinition>
        {
            CreateListCard("upcoming-fixtures", "Upcoming Fixtures", "Next matches", 0, 0, 19, 7, schedule.UpcomingFixtures, kind: CardKind.Fixture),
            CreateListCard("travel-plans", "Travel Plans", "Logistics", 19, 0, 18, 7, schedule.TravelPlans),
            CreateTimelineCard("fixture-timeline", "Fixture Timeline", "Next six weeks", schedule.FixtureTimeline, 0, 7, 37, 6),
            CreateListCard("broadcasts", "Broadcasts", "Coverage", 0, 13, 19, 5, schedule.Broadcasts),
            CreateListCard("preparation-focus", "Preparation Focus", "Coaching notes", 19, 13, 18, 5, schedule.PreparationFocus),
        };

        var extras = new List<CardPresetDefinition>
        {
            CreatePreset(
                CreateListCard(
                    "fixtures-upcoming-compact",
                    "Upcoming Fixtures (Compact)",
                    "Next opponents",
                    0,
                    0,
                    19,
                    5,
                    schedule.UpcomingFixtures.Take(3).ToList(),
                    kind: CardKind.Fixture),
                "Upcoming Fixtures (Compact)",
                "Smaller schedule showing the next three matches"),
            CreatePreset(
                CreateListCard(
                    "fixtures-travel-snapshot",
                    "Travel Snapshot",
                    "Logistics focus",
                    0,
                    0,
                    18,
                    6,
                    schedule.TravelPlans.Take(4).ToList()),
                "Travel Snapshot",
                "Keep imminent travel plans pinned"),
        };

        return CreateLayout("fixtures", "fixtures-schedule", cards, extras);
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

        return CreateLayout("fixtures", "fixtures-results", cards);
    }

    private static CardLayout BuildFixturesCalendar(FixturesCalendarSnapshot calendar)
    {
        var calendarCard = new CardDefinition(
            Id: "fixtures-calendar-grid",
            Title: "Monthly Planner",
            Subtitle: "Filter congested periods",
            Kind: CardKind.FixtureCalendar,
            Column: 0,
            Row: 0,
            ColumnSpan: 25,
            RowSpan: 12,
            FixtureCalendar: new FixtureCalendarDefinition(
                MapFixtureFilters(calendar.Filters),
                MapFixtureWeeks(calendar.Weeks),
                "Competition Focus",
                "Toggle competitions to highlight relevant fixtures"));

        var cards = new List<CardDefinition>
        {
            calendarCard,
            CreateListCard("month-overview", "Month Overview", "Fixture density", 25, 0, 12, 5, calendar.MonthOverview),
            CreateListCard("cup-draws", "Cup Draws", "Upcoming ties", 25, 5, 12, 3, calendar.CupDraws),
            CreateListCard("international-breaks", "International Breaks", "Availability", 25, 8, 12, 3, calendar.InternationalBreaks),
            CreateListCard("reminders", "Reminders", "Key admin", 0, 12, 37, 7, calendar.Reminders),
        };

        return CreateLayout("fixtures", "fixtures-calendar", cards);
    }

    private static IReadOnlyList<FixtureCalendarFilterDefinition> MapFixtureFilters(IReadOnlyList<FixtureCalendarFilterSnapshot> filters)
    {
        if (filters is not { Count: > 0 })
        {
            return Array.Empty<FixtureCalendarFilterDefinition>();
        }

        var list = new List<FixtureCalendarFilterDefinition>(filters.Count);
        foreach (var filter in filters)
        {
            list.Add(new FixtureCalendarFilterDefinition(
                filter.Id,
                filter.DisplayName,
                filter.IsDefault,
                filter.Competitions ?? Array.Empty<string>()));
        }

        return list;
    }

    private static IReadOnlyList<FixtureCalendarWeekDefinition> MapFixtureWeeks(IReadOnlyList<FixtureCalendarWeekSnapshot> weeks)
    {
        if (weeks is not { Count: > 0 })
        {
            return Array.Empty<FixtureCalendarWeekDefinition>();
        }

        var mapped = new List<FixtureCalendarWeekDefinition>(weeks.Count);
        foreach (var week in weeks)
        {
            var days = week.Days is { Count: > 0 }
                ? week.Days.Select(MapFixtureDay).ToList()
                : new List<FixtureCalendarDayDefinition>();

            mapped.Add(new FixtureCalendarWeekDefinition(week.Label, days));
        }

        return mapped;
    }

    private static FixtureCalendarDayDefinition MapFixtureDay(FixtureCalendarDaySnapshot day)
    {
        var matches = day.Matches is { Count: > 0 }
            ? day.Matches.Select(MapFixtureMatch).ToList()
            : new List<FixtureCalendarMatchDefinition>();

        return new FixtureCalendarDayDefinition(day.Label, day.Date, matches);
    }

    private static FixtureCalendarMatchDefinition MapFixtureMatch(FixtureCalendarMatchSnapshot match)
    {
        return new FixtureCalendarMatchDefinition(
            match.Id,
            match.Day,
            match.KickOff,
            match.Competition,
            match.Opponent,
            match.Venue,
            match.IsHome,
            match.Importance,
            match.Result,
            match.Broadcast,
            match.TravelNote,
            match.PreparationNote,
            match.Status,
            match.CompetitionAccent,
            MapEntries(match.KeyPeople ?? Array.Empty<ListEntrySnapshot>()),
            MapEntries(match.Preparation ?? Array.Empty<ListEntrySnapshot>()));
    }

    private static CardLayout CreateLayout(
        string tabIdentifier,
        string sectionIdentifier,
        List<CardDefinition> cards,
        IEnumerable<CardPresetDefinition>? extras = null)
    {
        var palette = CreatePalette(cards);

        if (extras is not null)
        {
            foreach (var preset in extras)
            {
                if (palette.All(existing => !string.Equals(existing.Id, preset.Id, StringComparison.Ordinal)))
                {
                    palette.Add(preset);
                }
            }
        }

        return new CardLayout(tabIdentifier, sectionIdentifier, cards, palette);
    }

    private static List<CardPresetDefinition> CreatePalette(IEnumerable<CardDefinition> cards) =>
        cards
            .Select(card => CreatePreset(card))
            .ToList();

    private static CardPresetDefinition CreatePreset(CardDefinition definition, string? displayName = null, string? description = null)
    {
        return new CardPresetDefinition(
            definition.Id,
            displayName ?? definition.Title,
            description ?? definition.Description ?? definition.Subtitle ?? definition.Title,
            definition);
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

    private static IReadOnlyList<ChartDataPointDefinition> MapTrendPoints(IReadOnlyList<TrendDataPointSnapshot> points)
    {
        if (points is null || points.Count == 0)
        {
            return System.Array.Empty<ChartDataPointDefinition>();
        }

        var list = new List<ChartDataPointDefinition>(points.Count);
        foreach (var point in points)
        {
            list.Add(new ChartDataPointDefinition(point.Label, point.Value));
        }

        return list;
    }

    private static IReadOnlyList<GaugeBandDefinition> MapGaugeBands(IReadOnlyList<GaugeBandSnapshot> bands)
    {
        if (bands is null || bands.Count == 0)
        {
            return System.Array.Empty<GaugeBandDefinition>();
        }

        var list = new List<GaugeBandDefinition>(bands.Count);
        foreach (var band in bands)
        {
            list.Add(new GaugeBandDefinition(band.Label, band.Start, band.End, band.Color));
        }

        return list;
    }

    private static IReadOnlyList<TimelineEntryDefinition> MapTimelineEntries(IReadOnlyList<TimelineEntrySnapshot> entries)
    {
        if (entries is null || entries.Count == 0)
        {
            return System.Array.Empty<TimelineEntryDefinition>();
        }

        var list = new List<TimelineEntryDefinition>(entries.Count);
        foreach (var entry in entries)
        {
            list.Add(new TimelineEntryDefinition(entry.Label, entry.Detail, entry.Position, entry.Pill, entry.Accent));
        }

        return list;
    }

    private static IReadOnlyList<FinanceForecastImpactDefinition> MapForecastImpacts(IReadOnlyList<FinanceForecastImpactSnapshot> impacts)
    {
        if (impacts is null || impacts.Count == 0)
        {
            return System.Array.Empty<FinanceForecastImpactDefinition>();
        }

        var list = new List<FinanceForecastImpactDefinition>(impacts.Count);
        foreach (var impact in impacts)
        {
            list.Add(new FinanceForecastImpactDefinition(impact.Label, impact.Format, impact.BaseValue, impact.Sensitivity));
        }

        return list;
    }

    private static ScoutAssignmentDefinition MapScoutAssignment(ScoutAssignmentSnapshot snapshot)
    {
        return new ScoutAssignmentDefinition(
            snapshot.Id,
            snapshot.Focus,
            snapshot.Role,
            snapshot.Region,
            snapshot.Priority,
            snapshot.Stage,
            snapshot.Deadline,
            snapshot.Scout,
            snapshot.Notes);
    }

    private static ScoutOptionDefinition MapScoutOption(ScoutOptionSnapshot snapshot)
    {
        return new ScoutOptionDefinition(snapshot.Id, snapshot.Name, snapshot.Region, snapshot.Availability);
    }

    private static ShortlistPlayerDefinition MapShortlistPlayer(ShortlistPlayerSnapshot snapshot)
    {
        return new ShortlistPlayerDefinition(
            snapshot.Id,
            snapshot.Name,
            snapshot.Position,
            snapshot.Status,
            snapshot.Action,
            snapshot.Priority,
            snapshot.Notes);
    }

    private static CardDefinition CreateLineChartCard(string id, string title, string subtitle, TrendSnapshot trend, int column, int row, int columnSpan, int rowSpan, string seriesColor = "#2EC4B6")
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.LineChart,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            MetricValue: trend.Metric.Value,
            MetricLabel: trend.Metric.Summary,
            PillText: trend.Metric.Pill,
            ChartSeries: new List<ChartSeriesDefinition>
            {
                new(trend.Metric.Value, seriesColor, MapTrendPoints(trend.Points))
            });
    }

    private static CardDefinition CreateGaugeCard(string id, string title, string subtitle, GaugeSnapshot gauge, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.Gauge,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            Gauge: new GaugeDefinition(
                gauge.Minimum,
                gauge.Maximum,
                gauge.Value,
                gauge.Target,
                gauge.Unit,
                MapGaugeBands(gauge.Bands),
                gauge.Metric.Value,
                gauge.Metric.Summary,
                gauge.Metric.Pill),
            ListItems: MapEntries(gauge.SupportingItems ?? Array.Empty<ListEntrySnapshot>()));
    }

    private static CardDefinition CreateTimelineCard(string id, string title, string subtitle, TimelineSnapshot timeline, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.Timeline,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            Timeline: MapTimelineEntries(timeline.Events));
    }

    private static CardDefinition CreateWorkloadHeatmapCard(TrainingWorkloadHeatmapSnapshot? heatmap)
    {
        var definition = MapWorkloadHeatmap(heatmap);

        return new CardDefinition(
            Id: "training-workload-heatmap",
            Title: "Workload Heatmap",
            Subtitle: "Intensity by unit",
            Kind: CardKind.WorkloadHeatmap,
            Column: 0,
            Row: 7,
            ColumnSpan: 28,
            RowSpan: 8,
            WorkloadHeatmap: definition);
    }

    private static CardDefinition CreateForecastCard(string id, string title, string subtitle, FinanceForecastSnapshot forecast, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.Forecast,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            Forecast: new FinanceForecastDefinition(
                forecast.SliderLabel,
                forecast.ValueDisplayFormat,
                forecast.CommitLabel,
                forecast.SummaryLabel,
                forecast.Minimum,
                forecast.Maximum,
                forecast.Step,
                forecast.CurrentPercentage,
                MapForecastImpacts(forecast.Impacts)));
    }

    private static CardDefinition CreateScoutAssignmentsCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        IReadOnlyList<ScoutAssignmentSnapshot>? assignments,
        IReadOnlyList<string>? stageOptions,
        IReadOnlyList<string>? priorityOptions,
        IReadOnlyList<ScoutOptionSnapshot>? scoutPool)
    {
        var assignmentDefinitions = assignments?.Select(MapScoutAssignment).ToList()
            ?? new List<ScoutAssignmentDefinition>();
        var stages = stageOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>();
        var priorities = priorityOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>();
        var options = scoutPool?.Select(MapScoutOption).ToList()
            ?? new List<ScoutOptionDefinition>();

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ScoutAssignments,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ScoutAssignments: new ScoutAssignmentBoardDefinition(assignmentDefinitions, stages, priorities, options));
    }

    private static CardDefinition CreateShortlistBoardCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        IReadOnlyList<ShortlistPlayerSnapshot>? players,
        IReadOnlyList<string>? statusOptions,
        IReadOnlyList<string>? actionOptions)
    {
        var playerDefinitions = players?.Select(MapShortlistPlayer).ToList()
            ?? new List<ShortlistPlayerDefinition>();
        var statuses = statusOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>();
        var actions = actionOptions?.Where(static option => !string.IsNullOrWhiteSpace(option)).ToList()
            ?? new List<string>();

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ShortlistBoard,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ShortlistBoard: new ShortlistBoardDefinition(playerDefinitions, statuses, actions));
    }

    private static CardDefinition CreateSquadTableCard(
        string id,
        string title,
        string subtitle,
        SquadTableDefinition table,
        int column,
        int row,
        int columnSpan,
        int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.SquadTable,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            SquadTable: table);
    }

    private static SquadTableDefinition MapSquadPlayers(IReadOnlyList<SquadPlayerSnapshot> players)
    {
        if (players is null || players.Count == 0)
        {
            return new SquadTableDefinition(Array.Empty<SquadPlayerDefinition>());
        }

        var list = new List<SquadPlayerDefinition>(players.Count);
        foreach (var player in players)
        {
            list.Add(new SquadPlayerDefinition(
                player.Id,
                player.Name,
                player.PositionGroup,
                player.Position,
                player.Role,
                player.Morale,
                player.Condition,
                player.MatchSharpness,
                player.AverageRating,
                player.Appearances,
                player.Minutes,
                player.Nationality,
                player.Status));
        }

        return new SquadTableDefinition(list);
    }

    private static TrainingWorkloadHeatmapDefinition MapWorkloadHeatmap(TrainingWorkloadHeatmapSnapshot? heatmap)
    {
        if (heatmap is null)
        {
            return new TrainingWorkloadHeatmapDefinition(
                Array.Empty<string>(),
                Array.Empty<TrainingWorkloadRowDefinition>(),
                Array.Empty<TrainingIntensityLevelDefinition>());
        }

        var columns = heatmap.Columns is { Count: > 0 }
            ? new List<string>(heatmap.Columns)
            : new List<string>();

        var intensities = heatmap.Intensities is { Count: > 0 }
            ? heatmap.Intensities
                .Select(intensity => new TrainingIntensityLevelDefinition(intensity.Key, intensity.DisplayName, intensity.Color, intensity.LoadValue))
                .ToList()
            : new List<TrainingIntensityLevelDefinition>();

        var rows = new List<TrainingWorkloadRowDefinition>();
        if (heatmap.Units is { Count: > 0 })
        {
            foreach (var unit in heatmap.Units)
            {
                var cells = unit.Cells is { Count: > 0 }
                    ? unit.Cells
                        .Select(cell => new TrainingWorkloadCellDefinition(cell.Column, cell.IntensityKey, cell.Load, cell.Detail))
                        .ToList()
                    : new List<TrainingWorkloadCellDefinition>();

                rows.Add(new TrainingWorkloadRowDefinition(unit.Label, cells));
            }
        }

        return new TrainingWorkloadHeatmapDefinition(columns, rows, intensities, heatmap.LegendTitle, heatmap.LegendSubtitle);
    }

    private static CardDefinition CreateTrainingCalendarCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        IReadOnlyList<TrainingSessionDetailSnapshot> sessions)
    {
        var days = new List<string>(TrainingCalendarFormatter.OrderedDays);
        var daySet = new HashSet<string>(days, StringComparer.OrdinalIgnoreCase);

        var slots = new List<string>(TrainingCalendarFormatter.OrderedSlots);
        var slotSet = new HashSet<string>(slots, StringComparer.OrdinalIgnoreCase);

        if (sessions is not null)
        {
            foreach (var session in sessions)
            {
                if (!string.IsNullOrWhiteSpace(session.Day) && !daySet.Contains(session.Day))
                {
                    daySet.Add(session.Day);
                    days.Add(session.Day);
                }

                if (!string.IsNullOrWhiteSpace(session.Slot) && !slotSet.Contains(session.Slot))
                {
                    slotSet.Add(session.Slot);
                    slots.Add(session.Slot);
                }
            }
        }

        var mappedSessions = sessions is { Count: > 0 }
            ? sessions
                .Select(session => new TrainingCalendarSessionDefinition(
                    session.Id,
                    session.Day,
                    session.Slot,
                    session.Activity,
                    session.Focus,
                    session.Intensity))
                .ToList()
            : new List<TrainingCalendarSessionDefinition>();

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.TrainingCalendar,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            TrainingCalendar: new TrainingCalendarDefinition(days, slots, mappedSessions));
    }

    private static CardDefinition CreateNegotiationCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        IReadOnlyList<TransferNegotiationDealSnapshot> deals,
        string? description)
    {
        var mappedDeals = deals is { Count: > 0 }
            ? deals.Select(MapNegotiationDeal).ToList()
            : new List<TransferNegotiationDealDefinition>();

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.TransferNegotiation,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            Description: description,
            Negotiations: new TransferNegotiationDefinition(mappedDeals));
    }

    private static TransferNegotiationDealDefinition MapNegotiationDeal(TransferNegotiationDealSnapshot deal)
    {
        var terms = deal.Terms is { Count: > 0 }
            ? deal.Terms.Select(MapNegotiationTerm).ToList()
            : new List<TransferNegotiationTermDefinition>();

        return new TransferNegotiationDealDefinition(
            deal.Id,
            deal.Player,
            deal.Position,
            deal.Club,
            deal.Stage,
            deal.Status,
            deal.Deadline,
            deal.Summary,
            deal.Agent,
            deal.Response,
            deal.Accent,
            deal.StageOptions ?? Array.Empty<string>(),
            deal.StatusOptions ?? Array.Empty<string>(),
            terms);
    }

    private static TransferNegotiationTermDefinition MapNegotiationTerm(TransferNegotiationTermSnapshot term)
    {
        return new TransferNegotiationTermDefinition(
            term.Id,
            term.Label,
            term.Format,
            term.Minimum,
            term.Maximum,
            term.Step,
            term.Value,
            term.Target,
            term.Tooltip);
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

    private static IReadOnlyList<ListEntrySnapshot> BuildNegotiationSummaries(
        IReadOnlyList<TransferNegotiationDealSnapshot> deals,
        int take)
    {
        if (deals is null || deals.Count == 0)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        var items = new List<ListEntrySnapshot>();
        var count = Math.Max(0, take);

        foreach (var deal in deals.Take(count))
        {
            items.Add(CreateNegotiationSummary(deal));
        }

        return items;
    }

    private static ListEntrySnapshot CreateNegotiationSummary(TransferNegotiationDealSnapshot deal)
    {
        var feeTerm = deal.Terms?.FirstOrDefault(t => string.Equals(t.Id, "fee", StringComparison.OrdinalIgnoreCase));
        var secondary = feeTerm is not null
            ? string.Format(CultureInfo.InvariantCulture, feeTerm.Format, feeTerm.Value)
            : deal.Stage;

        return new ListEntrySnapshot(
            deal.Player,
            secondary,
            deal.Status,
            deal.Accent);
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

public sealed class LayoutsChangedEventArgs : EventArgs
{
    public LayoutsChangedEventArgs(IReadOnlyList<(string Tab, string Section)> sections, bool isGlobal)
    {
        Sections = sections;
        IsGlobal = isGlobal;
    }

    public IReadOnlyList<(string Tab, string Section)> Sections { get; }

    public bool IsGlobal { get; }
}
