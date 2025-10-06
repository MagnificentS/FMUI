using System;
using System.Globalization;
using FMUI.Wpf.Collections;
using FMUI.Wpf.Models;
using FMUI.Wpf.UI.Cards;

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
    private CardLayoutCatalogEntry[] _layouts;
    private (string Tab, string Section)[] _layoutKeys;
    private bool _disposed;

    public CardLayoutCatalog(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService;
        var buildResult = BuildLayouts(clubDataService.GetSnapshot());
        _layouts = buildResult.Layouts;
        _layoutKeys = buildResult.Keys;
        _clubDataService.SnapshotChanged += OnSnapshotChanged;
    }

    public event EventHandler<LayoutsChangedEventArgs>? LayoutsChanged;

    public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout)
    {
        lock (_sync)
        {
            var layouts = _layouts;
            for (var i = 0; i < layouts.Length; i++)
            {
                ref readonly var entry = ref layouts[i];
                if (string.Equals(entry.Tab, tabIdentifier, StringComparison.Ordinal) &&
                    string.Equals(entry.Section, sectionIdentifier, StringComparison.Ordinal))
                {
                    layout = entry.Layout;
                    return true;
                }
            }
        }

        layout = CardLayout.Empty;
        return false;
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
        var buildResult = BuildLayouts(snapshot);
        ArrayReadOnlyList<(string Tab, string Section)> sections;

        lock (_sync)
        {
            _layouts = buildResult.Layouts;
            _layoutKeys = buildResult.Keys;
            sections = new ArrayReadOnlyList<(string Tab, string Section)>(_layoutKeys, _layoutKeys.Length);
        }

        LayoutsChanged?.Invoke(this, new LayoutsChangedEventArgs(sections, isGlobal: true));
    }

    private static LayoutBuildResult BuildLayouts(ClubDataSnapshot snapshot)
    {
        const int LayoutCount = 23;
        var layouts = new CardLayoutCatalogEntry[LayoutCount];
        var keys = new (string Tab, string Section)[LayoutCount];
        var index = 0;

        AddLayout(layouts, keys, index++, "overview", "club-vision", BuildClubVisionOverview(snapshot.Overview.ClubVision));
        AddLayout(layouts, keys, index++, "overview", "dynamics", BuildDynamicsOverview(snapshot.Overview.Dynamics));
        AddLayout(layouts, keys, index++, "overview", "medical-centre", BuildMedicalCentre(snapshot.Overview.Medical));
        AddLayout(layouts, keys, index++, "overview", "analytics", BuildAnalyticsOverview(snapshot.Overview.Analytics));
        AddLayout(layouts, keys, index++, "squad", "selection-info", BuildSquadSelectionInfo(snapshot.Squad.SelectionInfo));
        AddLayout(layouts, keys, index++, "squad", "players", BuildSquadPlayers(snapshot.Squad.Players));
        AddLayout(layouts, keys, index++, "squad", "international", BuildSquadInternational(snapshot.Squad.International));
        AddLayout(layouts, keys, index++, "squad", "squad-depth", BuildSquadDepth(snapshot.Squad.Depth));
        AddLayout(layouts, keys, index++, "tactics", "tactics-overview", BuildTacticsOverview(snapshot.Tactics));
        AddLayout(layouts, keys, index++, "tactics", "set-pieces", BuildTacticsSetPieces(snapshot.Tactics.SetPieces));
        AddLayout(layouts, keys, index++, "tactics", "tactics-analysis", BuildTacticsAnalysis(snapshot.Tactics.Analysis));
        AddLayout(layouts, keys, index++, "training", "training-overview", BuildTrainingOverview(snapshot.Training.Overview));
        AddLayout(layouts, keys, index++, "training", "training-calendar", BuildTrainingCalendar(snapshot.Training.Calendar));
        AddLayout(layouts, keys, index++, "training", "training-units", BuildTrainingUnits(snapshot.Training.Units));
        AddLayout(layouts, keys, index++, "transfers", "transfer-centre", BuildTransferCentre(snapshot.Transfers.Centre));
        AddLayout(layouts, keys, index++, "transfers", "scouting", BuildTransfersScouting(snapshot.Transfers.Scouting));
        AddLayout(layouts, keys, index++, "transfers", "shortlist", BuildTransfersShortlist(snapshot.Transfers.Shortlist));
        AddLayout(layouts, keys, index++, "finances", "finances-summary", BuildFinancesSummary(snapshot.Finance.Summary));
        AddLayout(layouts, keys, index++, "finances", "finances-income", BuildFinancesIncome(snapshot.Finance.Income));
        AddLayout(layouts, keys, index++, "finances", "finances-expenditure", BuildFinancesExpenditure(snapshot.Finance.Expenditure));
        AddLayout(layouts, keys, index++, "fixtures", "fixtures-schedule", BuildFixturesSchedule(snapshot.Fixtures.Schedule));
        AddLayout(layouts, keys, index++, "fixtures", "fixtures-results", BuildFixturesResults(snapshot.Fixtures.Results));
        AddLayout(layouts, keys, index++, "fixtures", "fixtures-calendar", BuildFixturesCalendar(snapshot.Fixtures.Calendar));

#if DEBUG
        if (index != LayoutCount)
        {
            throw new InvalidOperationException($"Layout count mismatch. Expected {LayoutCount}, built {index}.");
        }
#endif

        return new LayoutBuildResult(layouts, keys);
    }

    private static void AddLayout(CardLayoutCatalogEntry[] layouts, (string Tab, string Section)[] keys, int index, string tab, string section, CardLayout layout)
    {
        layouts[index] = new CardLayoutCatalogEntry(tab, section, layout);
        keys[index] = (tab, section);
    }

    private readonly struct LayoutBuildResult
    {
        public LayoutBuildResult(CardLayoutCatalogEntry[] layouts, (string Tab, string Section)[] keys)
        {
            Layouts = layouts;
            Keys = keys;
        }

        public CardLayoutCatalogEntry[] Layouts { get; }

        public (string Tab, string Section)[] Keys { get; }
    }

    private readonly struct CardLayoutCatalogEntry
    {
        public CardLayoutCatalogEntry(string tab, string section, CardLayout layout)
        {
            Tab = tab;
            Section = section;
            Layout = layout;
        }

        public string Tab { get; }

        public string Section { get; }

        public CardLayout Layout { get; }
    }

    private static CardLayout BuildTacticsOverview(TacticalSnapshot snapshot)
    {
        var cards = new ArrayCollection<CardDefinition>(10);
        cards.Add(new CardDefinition(
            Id: "formation-overview",
            Title: snapshot.FormationName,
            Subtitle: snapshot.SquadLabel,
            Kind: CardKind.ContentHost,
            Column: 0,
            Row: 0,
            ColumnSpan: 22,
            RowSpan: 14,
            Description: snapshot.Description,
            PillText: snapshot.MentalityPill,
            FormationLines: MapFormationLines(snapshot.FormationLines),
            ContentType: CardType.TacticalOverview));
        cards.Add(CreateMetricCard("team-fluidity", "Team Fluidity", "Shape cohesion", snapshot.Fluidity, 22, 0, 7, 5));
        cards.Add(CreateMetricCard("mentality", "Mentality", "In possession mindset", snapshot.Mentality, 29, 0, 8, 5));
        cards.Add(new CardDefinition(
            Id: "in-possession",
            Title: "In Possession",
            Subtitle: "Selected instructions",
            Kind: CardKind.List,
            Column: 22,
            Row: 5,
            ColumnSpan: 15,
            RowSpan: 7,
            Description: snapshot.InPossession.Description,
            ListItems: MapInstructionItems(snapshot.InPossession.Items),
            ContentType: CardType.SquadSummary));
        cards.Add(new CardDefinition(
            Id: "in-transition",
            Title: "In Transition",
            Subtitle: "Moment reactions",
            Kind: CardKind.List,
            Column: 22,
            Row: 12,
            ColumnSpan: 15,
            RowSpan: 7,
            ListItems: MapInstructionItems(snapshot.InTransition.Items),
            ContentType: CardType.SquadSummary));
        cards.Add(new CardDefinition(
            Id: "out-of-possession",
            Title: "Out Of Possession",
            Subtitle: "Defensive block",
            Kind: CardKind.List,
            Column: 0,
            Row: 14,
            ColumnSpan: 18,
            RowSpan: 5,
            ListItems: MapInstructionItems(snapshot.OutOfPossession.Items),
            ContentType: CardType.SquadSummary));
        cards.Add(CreateFixtureCard());
        cards.Add(new CardDefinition(
            Id: "tactical-familiarity",
            Title: "Tactical Familiarity",
            Subtitle: "Team understanding",
            Kind: CardKind.Status,
            Column: 0,
            Row: 14,
            ColumnSpan: 8,
            RowSpan: 5,
            ListItems: new CardListItem[]
            {
                new("Mentality", "Accomplished"),
                new("Passing Style", "Fluid"),
                new("Pressing", "Highly Responsive"),
                new("Creative Freedom", "Well Adapted"),
            },
            ContentType: CardType.SquadSummary));
        cards.Add(new CardDefinition(
            Id: "fitness-report",
            Title: "Fitness Report",
            Subtitle: "Medical Centre",
            Kind: CardKind.List,
            Column: 8,
            Row: 14,
            ColumnSpan: 10,
            RowSpan: 5,
            ListItems: new CardListItem[]
            {
                new("Gabriel Jesus", "Out (2-3 weeks)", "Sprained Knee Ligaments"),
                new("Thomas Partey", "Doubtful", "Lacking match fitness"),
                new("Oleksandr Zinchenko", "Match Fit", "Ready for selection"),
            },
            ContentType: CardType.SquadSummary));
        cards.Add(new CardDefinition(
            Id: "recent-form",
            Title: "Recent Form",
            Subtitle: "Last five fixtures",
            Kind: CardKind.List,
            Column: 18,
            Row: 14,
            ColumnSpan: 19,
            RowSpan: 5,
            ListItems: new CardListItem[]
            {
                new("vs Man City", "W 2-1", "Premier League", "Sat"),
                new("vs Chelsea", "D 0-0", "Premier League", "Wed"),
                new("vs Everton", "W 3-0", "Premier League", "Sun"),
                new("vs PSG", "L 1-2", "Champions League", "Tue"),
                new("vs Leicester", "W 4-1", "Premier League", "Sat"),
            },
            ContentType: CardType.SquadSummary));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
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
                ListItems: MapInstructionItems(TakeInstructionItems(snapshot.InTransition.Items, 4))),
            "Transition Triggers",
            "Pin the key pressing reactions from the transition phase"));
        extras.Add(CreatePreset(
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
            "Surface the analysis team's tactical guidance on the overview"));

        return CreateLayout("tactics", "tactics-overview", cards, extras);
    }

    private static IReadOnlyList<FormationLineDefinition> MapFormationLines(IReadOnlyList<FormationLineSnapshot> lines)
    {
        if (lines is null || lines.Count == 0)
        {
            return Array.Empty<FormationLineDefinition>();
        }

        var mappedLines = new ArrayCollection<FormationLineDefinition>(lines.Count);
        for (int i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            var players = line.Players;
            var playerCollection = players is { Count: > 0 }
                ? new ArrayCollection<FormationPlayerDefinition>(players.Count)
                : new ArrayCollection<FormationPlayerDefinition>(0);

            if (players is { Count: > 0 })
            {
                for (int playerIndex = 0; playerIndex < players.Count; playerIndex++)
                {
                    var player = players[playerIndex];
                    playerCollection.Add(new FormationPlayerDefinition(player.Id, player.Name, player.X, player.Y));
                }
            }

            mappedLines.Add(new FormationLineDefinition(
                line.Role,
                new ArrayReadOnlyList<FormationPlayerDefinition>(playerCollection.GetRawArray(), playerCollection.Count)));
        }

        return new ArrayReadOnlyList<FormationLineDefinition>(mappedLines.GetRawArray(), mappedLines.Count);
    }

    private static CardLayout BuildTacticsSetPieces(SetPieceSnapshot setPieces)
    {
        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(CreateListCard("attacking-corners", "Attacking Corners", "Delivery plans", 0, 0, 18, 7, setPieces.AttackingCorners));
        cards.Add(CreateListCard("defending-corners", "Defending Corners", "Assignments", 18, 0, 19, 7, setPieces.DefendingCorners));
        cards.Add(CreateListCard("free-kicks", "Free Kicks", "Primary takers", 0, 7, 18, 6, setPieces.FreeKicks));
        cards.Add(CreateListCard("throw-ins", "Throw-Ins", "Routine focus", 18, 7, 19, 6, setPieces.ThrowIns));
        cards.Add(CreateListCard("penalty-takers", "Penalty Order", "Hierarchy", 0, 13, 37, 6, setPieces.PenaltyTakers));

        return CreateLayout("tactics", "set-pieces", cards);
    }

    private static CardLayout BuildTacticsAnalysis(TacticalAnalysisSnapshot analysis)
    {
        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(CreateMetricCard("recent-form", "Recent Form", "Last five matches", analysis.RecentForm, 0, 0, 12, 5));
        cards.Add(CreateListCard("strengths", "Strengths", "Where we excel", 12, 0, 12, 7, analysis.Strengths));
        cards.Add(CreateListCard("weaknesses", "Weaknesses", "Risks to manage", 24, 0, 13, 7, analysis.Weaknesses));
        cards.Add(CreateListCard("key-statistics", "Key Statistics", "Performance snapshot", 0, 5, 18, 7, analysis.Statistics));
        cards.Add(CreateListCard("recommendations", "Recommendations", "Coaching directives", 18, 5, 19, 7, analysis.Recommendations));

        return CreateLayout("tactics", "tactics-analysis", cards);
    }

    private static CardLayout BuildClubVisionOverview(ClubVisionSnapshot clubVision)
    {
        var cards = new ArrayCollection<CardDefinition>(6);
        cards.Add(CreateMetricCard("board-confidence", "Board Confidence", "Season to date", clubVision.BoardConfidence, 0, 0, 12, 6));
        cards.Add(CreateMetricCard("supporter-confidence", "Supporter Confidence", "Mood of the terraces", clubVision.SupporterConfidence, 12, 0, 12, 6));
        cards.Add(CreateClubVisionExpectationBoardCard(
            "competition-objectives",
            "Competition Objectives",
            "Season targets and board expectations",
            24,
            0,
            13,
            9,
            clubVision.ExpectationBoard));
        cards.Add(CreateClubVisionRoadmapCard(
            "strategic-roadmap",
            "Strategic Roadmap",
            "Five-year milestones and status",
            0,
            6,
            24,
            6,
            clubVision.Roadmap));
        cards.Add(CreateListCard("finance-snapshot", "Finance Snapshot", "Month to date", 0, 12, 18, 7, clubVision.FinanceSnapshot));
        cards.Add(CreateListCard("top-performers", "Top Performers", "Last five matches", 18, 12, 19, 7, clubVision.TopPerformers));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
            CreateListCard(
                "club-vision-finance-focus",
                "Finance Focus",
                "Board-monitored lines",
                0,
                0,
                14,
                6,
                TakeEntries(clubVision.FinanceSnapshot, 4)),
            "Finance Focus",
            "Compact list of the finance snapshot items under review"));

        extras.Add(CreatePreset(
            CreateListCard(
                "club-vision-key-objectives",
                "Competition Objectives (Top 3)",
                "Season priorities",
                0,
                0,
                14,
                6,
                TakeEntries(clubVision.CompetitionExpectations, 3)),
            "Competition Objectives (Top 3)",
            "Highlight the highest priority competition targets"));

        return CreateLayout("overview", "club-vision", cards, extras);
    }

    private static CardLayout BuildDynamicsOverview(DynamicsSnapshot dynamics)
    {
        var cards = new ArrayCollection<CardDefinition>(9);
        cards.Add(CreateMetricCard("team-cohesion", "Team Cohesion", "Unit synergy", dynamics.TeamCohesion, 0, 0, 12, 5));
        cards.Add(CreateMetricCard("dressing-room", "Dressing Room Atmosphere", "Mood", dynamics.DressingRoomAtmosphere, 12, 0, 12, 5));
        cards.Add(CreateMetricCard("managerial-support", "Managerial Support", "Leadership trust", dynamics.ManagerialSupport, 24, 0, 13, 5));
        cards.Add(CreateListCard("social-groups", "Social Groups", "Relationships", 0, 5, 18, 7, dynamics.SocialGroups));
        cards.Add(CreateListCard("influencers", "Influencers", "Leadership core", 18, 5, 9, 7, dynamics.Influencers));
        cards.Add(CreateMoraleHeatmapCard(dynamics.MoraleHeatmap));
        cards.Add(CreateListCard("player-issues", "Player Issues", "Concerns raised", 27, 5, 10, 7, dynamics.PlayerIssues));
        cards.Add(CreateListCard("meetings", "Upcoming Meetings", "Engagement diary", 18, 12, 9, 7, dynamics.Meetings));
        cards.Add(CreateListCard("praise", "Recent Praise", "Positive feedback", 27, 12, 10, 7, dynamics.PraiseMoments));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
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
            "Quick access to the dressing room leadership group"));

        extras.Add(CreatePreset(
            CreateListCard(
                "dynamics-social-landscape",
                "Social Landscape",
                "Key groups",
                0,
                0,
                18,
                6,
                TakeEntries(dynamics.SocialGroups, 4)),
            "Social Landscape",
            "Summarise the dominant social groups in the squad"));

        return CreateLayout("overview", "dynamics", cards, extras);
    }

    private static CardLayout BuildMedicalCentre(MedicalSnapshot medical)
    {
        var cards = new ArrayCollection<CardDefinition>(7);
        cards.Add(CreateContentHostCard("injury-report", "Injury Report", "Current status", 0, 0, 19, 7, CardType.InjuryList));
        cards.Add(CreateMetricCard("risk-assessment", "Risk Assessment", "Squad readiness", medical.RiskAssessment, 19, 0, 9, 5));
        cards.Add(CreateMetricCard("workload-monitoring", "Workload Monitoring", "Training load", medical.WorkloadMonitoring, 28, 0, 9, 5));
        cards.Add(CreateListCard("rehab-progress", "Rehab Progress", "Return timelines", 0, 7, 19, 5, medical.RehabProgress));
        cards.Add(CreateListCard("risk-breakdown", "Risk Breakdown", "Likelihood overview", 19, 5, 18, 7, medical.RiskBreakdown));
        cards.Add(CreateListCard("staff-notes", "Staff Notes", "Medical guidance", 0, 12, 19, 7, medical.StaffNotes));
        cards.Add(CreateMedicalTimelineCard("medical-timeline", "Injury Timeline", "Rehab phases", medical.Timeline, 19, 12, 18, 7));

        return CreateLayout("overview", "medical-centre", cards);
    }

    private static CardLayout BuildAnalyticsOverview(AnalyticsSnapshot analytics)
    {
        var cards = new ArrayCollection<CardDefinition>(6);
        cards.Add(CreateLineChartCard("expected-goals", "Expected Goals Trend", "Rolling average", analytics.ExpectedGoalsTrend, 0, 0, 12, 5));
        cards.Add(CreateShotMapCard("shot-map", "Shot Map", "Location & outcome", analytics.ShotMap, 12, 0, 12, 7));
        cards.Add(CreateListCard("possession-zones", "Possession Zones", "Territory split", 24, 0, 13, 7, analytics.PossessionZones));
        cards.Add(CreateListCard("passing-network", "Passing Network", "Combinations", 0, 5, 18, 7, analytics.PassingNetworks));
        cards.Add(CreateListCard("team-comparison", "Team Comparison", "League rank", 18, 5, 9, 7, analytics.TeamComparison));
        cards.Add(CreateListCard("key-stats", "Key Stats", "Performance summary", 27, 5, 10, 7, analytics.KeyStats));

        return CreateLayout("overview", "analytics", cards);
    }

    private static CardLayout BuildSquadSelectionInfo(SelectionInfoSnapshot selection)
    {
        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(CreateListCard("matchday-readiness", "Matchday Readiness", "Squad availability", 0, 0, 19, 6, selection.MatchdayReadiness));
        cards.Add(CreateListCard("fitness-concerns", "Fitness Concerns", "Players to monitor", 19, 0, 18, 6, selection.FitnessConcerns));
        cards.Add(CreateListCard("suspensions", "Suspensions", "Unavailable", 0, 6, 18, 5, selection.Suspensions));
        cards.Add(CreateListCard("recent-form", "Recent Form", "Performance trend", 18, 6, 19, 5, selection.RecentForm));
        cards.Add(CreateListCard("training-focus", "Training Focus", "Session priorities", 0, 11, 37, 8, selection.TrainingFocus));

        return CreateLayout("squad", "selection-info", cards);
    }

    private static CardLayout BuildSquadPlayers(PlayersSnapshot players)
    {
        var cards = new ArrayCollection<CardDefinition>(7);
        uint primaryEntityId = 0;

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

            primaryEntityId = ParsePlayerId(players.Roster[0].Id);
        }

        cards.Add(new CardDefinition(
            Id: "player-detail",
            Title: "Player Profile",
            Subtitle: "Key attributes",
            Kind: CardKind.ContentHost,
            Column: 25,
            Row: 0,
            ColumnSpan: 12,
            RowSpan: 6,
            ContentType: CardType.PlayerDetail,
            PrimaryEntityId: primaryEntityId));

        cards.Add(CreateListCard("statistics-leaders", "Statistics Leaders", "Season leaders", 25, 6, 12, 4, players.StatisticsLeaders));
        cards.Add(CreateListCard("emerging-players", "Emerging Players", "Development watch", 25, 10, 12, 4, players.EmergingPlayers));
        cards.Add(CreateListCard("contract-status", "Contract Status", "Expiry overview", 25, 14, 12, 3, players.ContractStatus));
        cards.Add(CreateListCard("transfer-interest", "Transfer Interest", "Clubs monitoring", 25, 17, 12, 2, players.TransferInterest));
        cards.Add(CreateListCard("key-players", "Key Players", "Impact metrics", 0, 12, 25, 7, players.KeyPlayers));

        return CreateLayout("squad", "players", cards);
    }

    private static CardLayout BuildSquadInternational(InternationalSnapshot international)
    {
        var cards = new ArrayCollection<CardDefinition>(4);
        cards.Add(CreateListCard("call-ups", "International Call-Ups", "Current squads", 0, 0, 18, 7, international.CallUps));
        cards.Add(CreateListCard("travel-plans", "Travel Plans", "Logistics", 18, 0, 19, 7, international.TravelPlans));
        cards.Add(CreateListCard("availability", "Availability", "Return timelines", 0, 7, 18, 6, international.Availability));
        cards.Add(CreateListCard("scouting-reports", "Scouting Reports", "Talent radar", 18, 7, 19, 6, international.ScoutingReports));

        return CreateLayout("squad", "international", cards);
    }

    private static CardLayout BuildSquadDepth(SquadDepthSnapshot depth)
    {
        var cards = new ArrayCollection<CardDefinition>(4);
        cards.Add(CreateListCard("depth-chart", "Depth Chart", "Primary options", 0, 0, 18, 7, depth.DepthChart));
        cards.Add(CreateListCard("role-battles", "Role Battles", "Selection dilemmas", 18, 0, 19, 7, depth.RoleBattles));
        cards.Add(CreateListCard("youth-depth", "Youth Depth", "Academy coverage", 0, 7, 18, 6, depth.YouthDepth));
        cards.Add(CreateListCard("positional-ratings", "Positional Ratings", "Star levels", 18, 7, 19, 6, depth.PositionalRatings));

        return CreateLayout("squad", "squad-depth", cards);
    }

    private static CardLayout BuildTrainingOverview(TrainingOverviewSnapshot training)
    {
        var cards = new ArrayCollection<CardDefinition>(10);
        cards.Add(CreateContentHostCard("upcoming-sessions", "Upcoming Sessions", "Next 5 days", 0, 0, 20, 7, CardType.TrainingSchedule));
        cards.Add(CreateGaugeCard("training-intensity", "Training Intensity", "Overall load", training.Intensity, 20, 0, 9, 7));
        cards.Add(CreateListCard("focus-areas", "Focus Areas", "Current emphasis", 29, 0, 8, 7, training.FocusAreas));
        cards.Add(CreateWorkloadHeatmapCard(training.WorkloadHeatmap));
        cards.Add(CreateListCard("unit-coaches", "Unit Coaches", "Specialist assignments", 28, 7, 9, 4, training.UnitCoaches));
        cards.Add(CreateListCard("medical-workload", "Medical Workload", "Risk watch", 28, 11, 9, 3, training.MedicalWorkload));
        cards.Add(CreateListCard("match-prep", "Match Prep", "Weekend fixture", 28, 14, 9, 2, training.MatchPreparation));
        cards.Add(CreateTrainingProgressionCard("training-progression", "Development Trends", "Progress over last month", 0, 15, 20, 4, training.Progression));
        cards.Add(CreateListCard("individual-focus", "Individual Focus", "Highlighted players", 20, 15, 8, 4, training.IndividualFocus));
        cards.Add(CreateContentHostCard("youth-development", "Youth Development", "Academy focus", 28, 16, 9, 3, CardType.YouthDevelopment));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
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
            "Keep the high-risk workload notes pinned to the board"));
        extras.Add(CreatePreset(
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
            "Compact gauge for quick dashboards"));

        return CreateLayout("training", "training-overview", cards, extras);
    }

    private static CardLayout BuildTrainingCalendar(TrainingCalendarSnapshot calendar)
    {
        var orderedSessions = calendar.SessionDetails is { Count: > 0 }
            ? TrainingCalendarFormatter.OrderSessions(calendar.SessionDetails)
            : Array.Empty<TrainingSessionDetailSnapshot>();

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

        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(calendarCard);
        cards.Add(CreateListCard("rest-days", "Rest Days", "Recovery blocks", 28, 0, 9, 5, calendar.RestDays));
        cards.Add(CreateListCard("match-prep-focus", "Match Prep Focus", "Opponent prep", 28, 5, 9, 4, calendar.MatchPrepFocus));
        cards.Add(CreateListCard("week-overview", "Week Overview", "Session outline", 0, 12, 28, 7, weekOverviewEntries));
        cards.Add(CreateListCard("milestones", "Upcoming Milestones", "Key dates", 28, 9, 9, 10, calendar.UpcomingMilestones));

        return CreateLayout("training", "training-calendar", cards);
    }

    private static CardLayout BuildTrainingUnits(TrainingUnitsSnapshot units)
    {
        var cards = new ArrayCollection<CardDefinition>(5);

        if (units.Board is not null)
        {
            cards.Add(CreateTrainingUnitBoardCard(
                "training-unit-board",
                "Training Unit Assignments",
                "Manage player distribution across units.",
                0,
                0,
                28,
                12,
                units.Board));
        }

        cards.Add(CreateListCard("senior-unit", "Senior Unit", "First team", 28, 0, 9, 4, units.SeniorUnit));
        cards.Add(CreateListCard("youth-unit", "Youth Unit", "Development squads", 28, 4, 9, 4, units.YouthUnit));
        cards.Add(CreateListCard("goalkeeping-unit", "Goalkeeping", "Shot-stopping focus", 28, 8, 9, 4, units.GoalkeepingUnit));
        cards.Add(CreateListCard("coach-assignments", "Coach Assignments", "Specialists", 0, 12, 28, 4, units.CoachAssignments));

        return CreateLayout("training", "training-units", cards);
    }

    private static CardLayout BuildTransferCentre(TransferCentreSnapshot centre)
    {
        var negotiations = centre.Negotiations ?? Array.Empty<TransferNegotiationDealSnapshot>();

        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(new CardDefinition(
            Id: "transfer-targets",
            Title: "Transfer Targets",
            Subtitle: "Priority signings",
            Kind: CardKind.ContentHost,
            Column: 0,
            Row: 0,
            ColumnSpan: 12,
            RowSpan: 6,
            ContentType: CardType.TransferTargets));
        cards.Add(CreateNegotiationCard("active-deals", "Active Deals", "Negotiations", 12, 0, 13, 7, negotiations, "Negotiations"));
        cards.Add(CreateListCard("recent-activity", "Recent Activity", "Completed moves", 25, 0, 12, 7, centre.RecentActivity));
        cards.Add(CreateListCard("loan-watch", "Loan Watch", "Development tracker", 0, 6, 18, 6, centre.LoanWatch));
        cards.Add(CreateListCard("clauses", "Clauses", "Financial obligations", 18, 6, 19, 6, centre.Clauses));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
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
            "Focus on the most urgent ongoing deals"));
        extras.Add(CreatePreset(
            CreateListCard(
                "transfer-loan-highlights",
                "Loan Watch Highlights",
                "Key performances",
                0,
                0,
                15,
                6,
                TakeEntries(centre.LoanWatch, 3)),
            "Loan Watch Highlights",
            "Track standout loan performances"));

        return CreateLayout("transfers", "transfer-centre", cards, extras);
    }

    private static CardLayout BuildTransfersScouting(ScoutingSnapshot scouting)
    {
        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(CreateScoutAssignmentsCard(
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
            scouting.ScoutPool));
        cards.Add(CreateListCard("focus-regions", "Focus Regions", "Knowledge coverage", 18, 0, 19, 7, scouting.FocusRegions));
        cards.Add(CreateListCard("knowledge-levels", "Knowledge Levels", "Global insight", 0, 7, 18, 6, scouting.KnowledgeLevels));
        cards.Add(CreateListCard("recommended-players", "Recommended Players", "Scouting priority", 18, 7, 19, 6, scouting.RecommendedPlayers));
        cards.Add(CreateListCard("short-term-focus", "Short-Term Focus", "Upcoming windows", 0, 13, 37, 6, scouting.ShortTermFocus));

        return CreateLayout("transfers", "scouting", cards);
    }

    private static CardLayout BuildTransfersShortlist(ShortlistSnapshot shortlist)
    {
        var cards = new ArrayCollection<CardDefinition>(4);
        cards.Add(CreateShortlistBoardCard(
            "shortlist-board",
            "Shortlist Board",
            "Primary recruitment targets",
            0,
            0,
            18,
            7,
            shortlist.Board,
            shortlist.StatusOptions,
            shortlist.ActionOptions));
        cards.Add(CreateListCard("contract-status", "Contract Status", "Expiry watch", 18, 0, 19, 7, shortlist.ContractStatus));
        cards.Add(CreateListCard("competition", "Competition", "Clubs interested", 0, 7, 18, 6, shortlist.Competition));
        cards.Add(CreateListCard("notes", "Notes", "Scouting insights", 18, 7, 19, 6, shortlist.Notes));

        return CreateLayout("transfers", "shortlist", cards);
    }

    private static CardLayout BuildFinancesSummary(FinanceSummarySnapshot finance)
    {
        var cards = new ArrayCollection<CardDefinition>(9);
        cards.Add(CreateContentHostCard("finance-overview", "Financial Overview", "Club finances", 0, 0, 18, 6, CardType.FinancialOverview));
        cards.Add(CreateContentHostCard("finance-transfer-budget", "Transfer Resources", "Current headroom", 18, 0, 19, 6, CardType.TransferBudget));
        cards.Add(CreateFinanceBudgetAllocatorCard("budget-allocation", "Budget Allocation", "Adjust departmental spend", finance.BudgetAllocator, 24, 6, 13, 5));
        cards.Add(CreateFinanceCashflowCard("cashflow-drilldown", "Cash Flow", "Dive into income and spend", finance.Cashflow, 0, 6, 24, 7));
        cards.Add(CreateListCard("projections", "Projections", "Forecast", 24, 6, 13, 3, finance.Projections));
        cards.Add(CreateListCard("debts", "Debts", "Long-term", 24, 9, 13, 3, finance.Debts));
        cards.Add(CreateListCard("sponsor-deals", "Sponsor Deals", "Commercial partners", 24, 12, 13, 3, finance.SponsorDeals));
        cards.Add(CreateFinanceScenarioCard("scenario-board", "Financial Scenarios", "Toggle initiatives", finance.ScenarioBoard, 0, 13, 24, 6));
        cards.Add(CreateForecastCard("finance-forecast", "Budget Scenario", "Explore allocation changes", finance.Forecast, 24, 15, 13, 4));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
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
            "Highlight active sponsorship agreements"));
        extras.Add(CreatePreset(
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
            "Monitor outstanding debt commitments"));

        return CreateLayout("finances", "finances-summary", cards, extras);
    }

    private static CardLayout BuildFinancesIncome(FinanceIncomeSnapshot income)
    {
        var cards = new ArrayCollection<CardDefinition>(4);
        cards.Add(CreateListCard("revenue-streams", "Revenue Streams", "Month to date", 0, 0, 18, 7, income.RevenueStreams));
        cards.Add(CreateListCard("matchday-income", "Matchday Income", "Breakdown", 18, 0, 19, 7, income.MatchdayIncome));
        cards.Add(CreateListCard("commercial-income", "Commercial Income", "Year on year", 0, 7, 18, 6, income.CommercialIncome));
        cards.Add(CreateListCard("competition-prizes", "Competition Prizes", "Earnings", 18, 7, 19, 6, income.CompetitionPrizes));

        return CreateLayout("finances", "finances-income", cards);
    }

    private static CardLayout BuildFinancesExpenditure(FinanceExpenditureSnapshot expenditure)
    {
        var cards = new ArrayCollection<CardDefinition>(4);
        cards.Add(CreateListCard("major-costs", "Major Costs", "Primary spend", 0, 0, 18, 7, expenditure.MajorCosts));
        cards.Add(CreateListCard("wage-breakdown", "Wage Breakdown", "Squad allocation", 18, 0, 19, 7, expenditure.WageBreakdown));
        cards.Add(CreateListCard("transfer-spending", "Transfer Spending", "Window summary", 0, 7, 18, 6, expenditure.TransferSpending));
        cards.Add(CreateListCard("operational-costs", "Operational Costs", "Club operations", 18, 7, 19, 6, expenditure.OperationalCosts));

        return CreateLayout("finances", "finances-expenditure", cards);
    }

    private static CardLayout BuildFixturesSchedule(FixturesScheduleSnapshot schedule)
    {
        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(CreateListCard("upcoming-fixtures", "Upcoming Fixtures", "Next matches", 0, 0, 19, 7, schedule.UpcomingFixtures, kind: CardKind.Fixture));
        cards.Add(CreateListCard("travel-plans", "Travel Plans", "Logistics", 19, 0, 18, 7, schedule.TravelPlans));
        cards.Add(CreateTimelineCard("fixture-timeline", "Fixture Timeline", "Next six weeks", schedule.FixtureTimeline, 0, 7, 37, 6));
        cards.Add(CreateListCard("broadcasts", "Broadcasts", "Coverage", 0, 13, 19, 5, schedule.Broadcasts));
        cards.Add(CreateListCard("preparation-focus", "Preparation Focus", "Coaching notes", 19, 13, 18, 5, schedule.PreparationFocus));

        var extras = new ArrayCollection<CardPresetDefinition>(2);
        extras.Add(CreatePreset(
            CreateListCard(
                "fixtures-upcoming-compact",
                "Upcoming Fixtures (Compact)",
                "Next opponents",
                0,
                0,
                19,
                5,
                TakeEntries(schedule.UpcomingFixtures, 3),
                kind: CardKind.Fixture),
            "Upcoming Fixtures (Compact)",
            "Smaller schedule showing the next three matches"));
        extras.Add(CreatePreset(
            CreateListCard(
                "fixtures-travel-snapshot",
                "Travel Snapshot",
                "Logistics focus",
                0,
                0,
                18,
                6,
                TakeEntries(schedule.TravelPlans, 4)),
            "Travel Snapshot",
            "Keep imminent travel plans pinned"));

        return CreateLayout("fixtures", "fixtures-schedule", cards, extras);
    }

    private static CardLayout BuildFixturesResults(FixturesResultsSnapshot results)
    {
        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(CreateListCard("recent-results", "Recent Results", "Form guide", 0, 0, 19, 7, results.RecentResults, kind: CardKind.Fixture));
        cards.Add(CreateListCard("player-ratings", "Player Ratings", "Highlights", 19, 0, 18, 5, results.PlayerRatings));
        cards.Add(CreateListCard("trends", "Trends", "Performance patterns", 19, 5, 18, 5, results.Trends));
        cards.Add(CreateListCard("key-moments", "Key Moments", "Decisive events", 0, 7, 19, 5, results.KeyMoments));
        cards.Add(CreateContentHostCard("league-table", "League Table", "Standings", 0, 12, 19, 5, CardType.LeagueTable));

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

        var cards = new ArrayCollection<CardDefinition>(5);
        cards.Add(calendarCard);
        cards.Add(CreateListCard("month-overview", "Month Overview", "Fixture density", 25, 0, 12, 5, calendar.MonthOverview));
        cards.Add(CreateListCard("cup-draws", "Cup Draws", "Upcoming ties", 25, 5, 12, 3, calendar.CupDraws));
        cards.Add(CreateListCard("international-breaks", "International Breaks", "Availability", 25, 8, 12, 3, calendar.InternationalBreaks));
        cards.Add(CreateListCard("reminders", "Reminders", "Key admin", 0, 12, 37, 7, calendar.Reminders));

        return CreateLayout("fixtures", "fixtures-calendar", cards);
    }

    private static IReadOnlyList<FixtureCalendarFilterDefinition> MapFixtureFilters(IReadOnlyList<FixtureCalendarFilterSnapshot> filters)
    {
        if (filters is not { Count: > 0 })
        {
            return Array.Empty<FixtureCalendarFilterDefinition>();
        }

        var collection = new ArrayCollection<FixtureCalendarFilterDefinition>(filters.Count);
        for (int i = 0; i < filters.Count; i++)
        {
            var filter = filters[i];
            collection.Add(new FixtureCalendarFilterDefinition(
                filter.Id,
                filter.DisplayName,
                filter.IsDefault,
                filter.Competitions ?? Array.Empty<string>()));
        }

        return new ArrayReadOnlyList<FixtureCalendarFilterDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<FixtureCalendarWeekDefinition> MapFixtureWeeks(IReadOnlyList<FixtureCalendarWeekSnapshot> weeks)
    {
        if (weeks is not { Count: > 0 })
        {
            return Array.Empty<FixtureCalendarWeekDefinition>();
        }

        var mapped = new ArrayCollection<FixtureCalendarWeekDefinition>(weeks.Count);
        for (int i = 0; i < weeks.Count; i++)
        {
            var week = weeks[i];
            IReadOnlyList<FixtureCalendarDayDefinition> days;
            if (week.Days is { Count: > 0 })
            {
                var dayCollection = new ArrayCollection<FixtureCalendarDayDefinition>(week.Days.Count);
                for (int j = 0; j < week.Days.Count; j++)
                {
                    dayCollection.Add(MapFixtureDay(week.Days[j]));
                }

                days = new ArrayReadOnlyList<FixtureCalendarDayDefinition>(dayCollection.GetRawArray(), dayCollection.Count);
            }
            else
            {
                days = Array.Empty<FixtureCalendarDayDefinition>();
            }

            mapped.Add(new FixtureCalendarWeekDefinition(week.Label, days));
        }

        return new ArrayReadOnlyList<FixtureCalendarWeekDefinition>(mapped.GetRawArray(), mapped.Count);
    }

    private static FixtureCalendarDayDefinition MapFixtureDay(FixtureCalendarDaySnapshot day)
    {
        IReadOnlyList<FixtureCalendarMatchDefinition> matches;
        if (day.Matches is { Count: > 0 })
        {
            var collection = new ArrayCollection<FixtureCalendarMatchDefinition>(day.Matches.Count);
            for (int i = 0; i < day.Matches.Count; i++)
            {
                collection.Add(MapFixtureMatch(day.Matches[i]));
            }

            matches = new ArrayReadOnlyList<FixtureCalendarMatchDefinition>(collection.GetRawArray(), collection.Count);
        }
        else
        {
            matches = Array.Empty<FixtureCalendarMatchDefinition>();
        }

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
        ArrayCollection<CardDefinition> cards,
        ArrayCollection<CardPresetDefinition>? extras = null)
    {
        var cardArray = cards.GetRawArray();
        var cardCount = cards.Count;
        var palette = new ArrayCollection<CardPresetDefinition>(cardCount + (extras?.Count ?? 0));

        for (int i = 0; i < cardCount; i++)
        {
            palette.Add(CreatePreset(cardArray[i]));
        }

        if (extras.HasValue)
        {
            var extrasValue = extras.Value;
            var extrasArray = extrasValue.GetRawArray();
            var extrasCount = extrasValue.Count;

            for (int i = 0; i < extrasCount; i++)
            {
                var preset = extrasArray[i];
                if (!PaletteContains(palette, preset.Id))
                {
                    palette.Add(preset);
                }
            }
        }

        return new CardLayout(
            tabIdentifier,
            sectionIdentifier,
            new ArrayReadOnlyList<CardDefinition>(cardArray, cardCount),
            new ArrayReadOnlyList<CardPresetDefinition>(palette.GetRawArray(), palette.Count));
    }

    private static bool PaletteContains(ArrayCollection<CardPresetDefinition> palette, string id)
    {
        var array = palette.GetRawArray();
        var count = palette.Count;
        for (int i = 0; i < count; i++)
        {
            if (string.Equals(array[i].Id, id, StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }

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
        if (items is null || items.Count == 0)
        {
            return System.Array.Empty<CardListItem>();
        }

        var mapped = new ArrayCollection<CardListItem>(items.Count);
        for (int i = 0; i < items.Count; i++)
        {
            var item = items[i];
            mapped.Add(new CardListItem(item.Label, item.Value, item.Detail));
        }

        return new ArrayReadOnlyList<CardListItem>(mapped.GetRawArray(), mapped.Count);
    }

    private static IReadOnlyList<CardListItem> MapEntries(IReadOnlyList<ListEntrySnapshot> entries)
    {
        if (entries is null || entries.Count == 0)
        {
            return System.Array.Empty<CardListItem>();
        }

        var collection = new ArrayCollection<CardListItem>(entries.Count);
        for (int i = 0; i < entries.Count; i++)
        {
            var entry = entries[i];
            collection.Add(new CardListItem(entry.Primary, entry.Secondary, entry.Tertiary, entry.Accent));
        }

        return new ArrayReadOnlyList<CardListItem>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<ListEntrySnapshot> TakeEntries(
        IReadOnlyList<ListEntrySnapshot> source,
        int maximum)
    {
        if (source is null || source.Count == 0 || maximum <= 0)
        {
            return System.Array.Empty<ListEntrySnapshot>();
        }

        var limit = source.Count < maximum ? source.Count : maximum;
        var collection = new ArrayCollection<ListEntrySnapshot>(limit);

        for (int i = 0; i < limit; i++)
        {
            collection.Add(source[i]);
        }

        return new ArrayReadOnlyList<ListEntrySnapshot>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<InstructionItemSnapshot> TakeInstructionItems(
        IReadOnlyList<InstructionItemSnapshot> source,
        int maximum)
    {
        if (source is null || source.Count == 0 || maximum <= 0)
        {
            return System.Array.Empty<InstructionItemSnapshot>();
        }

        var limit = source.Count < maximum ? source.Count : maximum;
        var collection = new ArrayCollection<InstructionItemSnapshot>(limit);

        for (int i = 0; i < limit; i++)
        {
            collection.Add(source[i]);
        }

        return new ArrayReadOnlyList<InstructionItemSnapshot>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<ChartDataPointDefinition> MapTrendPoints(IReadOnlyList<TrendDataPointSnapshot> points)
    {
        if (points is null || points.Count == 0)
        {
            return System.Array.Empty<ChartDataPointDefinition>();
        }

        var collection = new ArrayCollection<ChartDataPointDefinition>(points.Count);
        for (var i = 0; i < points.Count; i++)
        {
            var point = points[i];
            collection.Add(new ChartDataPointDefinition(point.Label, point.Value));
        }

        return new ArrayReadOnlyList<ChartDataPointDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<GaugeBandDefinition> MapGaugeBands(IReadOnlyList<GaugeBandSnapshot> bands)
    {
        if (bands is null || bands.Count == 0)
        {
            return System.Array.Empty<GaugeBandDefinition>();
        }

        var collection = new ArrayCollection<GaugeBandDefinition>(bands.Count);
        for (var i = 0; i < bands.Count; i++)
        {
            var band = bands[i];
            collection.Add(new GaugeBandDefinition(band.Label, band.Start, band.End, band.Color));
        }

        return new ArrayReadOnlyList<GaugeBandDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<TimelineEntryDefinition> MapTimelineEntries(IReadOnlyList<TimelineEntrySnapshot> entries)
    {
        if (entries is null || entries.Count == 0)
        {
            return System.Array.Empty<TimelineEntryDefinition>();
        }

        var collection = new ArrayCollection<TimelineEntryDefinition>(entries.Count);
        for (var i = 0; i < entries.Count; i++)
        {
            var entry = entries[i];
            collection.Add(new TimelineEntryDefinition(entry.Label, entry.Detail, entry.Position, entry.Pill, entry.Accent));
        }

        return new ArrayReadOnlyList<TimelineEntryDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<ShotMapFilterDefinition> MapShotFilters(IReadOnlyList<ShotMapFilterSnapshot> filters)
    {
        if (filters is null || filters.Count == 0)
        {
            return System.Array.Empty<ShotMapFilterDefinition>();
        }

        var collection = new ArrayCollection<ShotMapFilterDefinition>(filters.Count);
        for (var i = 0; i < filters.Count; i++)
        {
            var filter = filters[i];
            collection.Add(new ShotMapFilterDefinition(filter.Key, filter.DisplayName, filter.Color, filter.IsDefault));
        }

        return new ArrayReadOnlyList<ShotMapFilterDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static IReadOnlyList<ShotMapEventDefinition> MapShotEvents(IReadOnlyList<ShotMapEventSnapshot> events)
    {
        if (events is null || events.Count == 0)
        {
            return System.Array.Empty<ShotMapEventDefinition>();
        }

        var collection = new ArrayCollection<ShotMapEventDefinition>(events.Count);
        for (var i = 0; i < events.Count; i++)
        {
            var shot = events[i];
            collection.Add(new ShotMapEventDefinition(
                shot.Id,
                shot.Player,
                shot.Minute,
                shot.OutcomeKey,
                shot.X,
                shot.Y,
                shot.ExpectedGoals,
                shot.Assist,
                shot.BodyPart,
                shot.Detail,
                shot.Accent));
        }

        return new ArrayReadOnlyList<ShotMapEventDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static ShotMapDefinition MapShotMap(ShotMapSnapshot snapshot)
    {
        if (snapshot is null)
        {
            return new ShotMapDefinition(120, 80, System.Array.Empty<ShotMapFilterDefinition>(), System.Array.Empty<ShotMapEventDefinition>());
        }

        return new ShotMapDefinition(
            snapshot.PitchWidth,
            snapshot.PitchHeight,
            MapShotFilters(snapshot.Filters),
            MapShotEvents(snapshot.Events));
    }

    private static MedicalTimelineDefinition MapMedicalTimeline(MedicalTimelineSnapshot snapshot)
    {
        if (snapshot is null || snapshot.Entries is null || snapshot.Entries.Count == 0)
        {
            return new MedicalTimelineDefinition(System.Array.Empty<MedicalTimelineEntryDefinition>());
        }

        var collection = new ArrayCollection<MedicalTimelineEntryDefinition>(snapshot.Entries.Count);
        for (var i = 0; i < snapshot.Entries.Count; i++)
        {
            var entry = snapshot.Entries[i];
            collection.Add(new MedicalTimelineEntryDefinition(
                entry.Id,
                entry.Player,
                entry.Diagnosis,
                entry.Status,
                entry.ExpectedReturn,
                MapTimelineEntries(entry.Phases),
                entry.Notes,
                entry.Accent));
        }

        return new MedicalTimelineDefinition(new ArrayReadOnlyList<MedicalTimelineEntryDefinition>(collection.GetRawArray(), collection.Count));
    }

    private static IReadOnlyList<FinanceForecastImpactDefinition> MapForecastImpacts(IReadOnlyList<FinanceForecastImpactSnapshot> impacts)
    {
        if (impacts is null || impacts.Count == 0)
        {
            return System.Array.Empty<FinanceForecastImpactDefinition>();
        }

        var collection = new ArrayCollection<FinanceForecastImpactDefinition>(impacts.Count);
        for (var i = 0; i < impacts.Count; i++)
        {
            var impact = impacts[i];
            collection.Add(new FinanceForecastImpactDefinition(impact.Label, impact.Format, impact.BaseValue, impact.Sensitivity));
        }

        return new ArrayReadOnlyList<FinanceForecastImpactDefinition>(collection.GetRawArray(), collection.Count);
    }

    private static FinanceBudgetAllocatorDefinition MapFinanceBudgetAllocator(FinanceBudgetAllocationSnapshot snapshot)
    {
        if (snapshot is null)
        {
            return new FinanceBudgetAllocatorDefinition(
                string.Empty,
                string.Empty,
                "{0:+\u00a3#,##0;-\u00a3#,##0;\u00a30} \u2022 \u00a3{1:#,##0}",
                System.Array.Empty<FinanceBudgetAllocationLineDefinition>());
        }

        var lineSnapshots = snapshot.Lines;
        if (lineSnapshots is null || lineSnapshots.Count == 0)
        {
            return new FinanceBudgetAllocatorDefinition(
                snapshot.CommitLabel,
                snapshot.ResetLabel,
                snapshot.SummaryFormat,
                System.Array.Empty<FinanceBudgetAllocationLineDefinition>());
        }

        var lines = new ArrayCollection<FinanceBudgetAllocationLineDefinition>(lineSnapshots.Count);
        for (var i = 0; i < lineSnapshots.Count; i++)
        {
            var line = lineSnapshots[i];
            lines.Add(new FinanceBudgetAllocationLineDefinition(
                line.Id,
                line.Label,
                line.Description,
                line.Minimum,
                line.Maximum,
                line.Step,
                line.Value,
                line.Baseline,
                line.Format,
                line.Accent));
        }

        return new FinanceBudgetAllocatorDefinition(
            snapshot.CommitLabel,
            snapshot.ResetLabel,
            snapshot.SummaryFormat,
            new ArrayReadOnlyList<FinanceBudgetAllocationLineDefinition>(lines.GetRawArray(), lines.Count));
    }

    private static FinanceCashflowDefinition MapFinanceCashflow(FinanceCashflowSnapshot snapshot)
    {
        if (snapshot is null)
        {
            return new FinanceCashflowDefinition(
                string.Empty,
                "{0:0.0} \u2022 {1:0.0}",
                System.Array.Empty<FinanceCashflowCategoryDefinition>());
        }

        var categorySnapshots = snapshot.Categories;
        if (categorySnapshots is null || categorySnapshots.Count == 0)
        {
            return new FinanceCashflowDefinition(
                snapshot.SummaryLabel,
                snapshot.SummaryFormat,
                System.Array.Empty<FinanceCashflowCategoryDefinition>());
        }

        var categories = new ArrayCollection<FinanceCashflowCategoryDefinition>(categorySnapshots.Count);
        for (var i = 0; i < categorySnapshots.Count; i++)
        {
            var category = categorySnapshots[i];
            var itemSnapshots = category.Items;
            ArrayReadOnlyList<FinanceCashflowItemDefinition> items;

            if (itemSnapshots is null || itemSnapshots.Count == 0)
            {
                items = new ArrayReadOnlyList<FinanceCashflowItemDefinition>(System.Array.Empty<FinanceCashflowItemDefinition>(), 0);
            }
            else
            {
                var itemCollection = new ArrayCollection<FinanceCashflowItemDefinition>(itemSnapshots.Count);
                for (var j = 0; j < itemSnapshots.Count; j++)
                {
                    var item = itemSnapshots[j];
                    itemCollection.Add(new FinanceCashflowItemDefinition(
                        item.Id,
                        item.Name,
                        item.Amount,
                        item.Format,
                        item.Accent,
                        item.Detail));
                }

                items = new ArrayReadOnlyList<FinanceCashflowItemDefinition>(itemCollection.GetRawArray(), itemCollection.Count);
            }

            categories.Add(new FinanceCashflowCategoryDefinition(
                category.Id,
                category.Name,
                category.Description,
                category.Amount,
                category.Format,
                category.Accent,
                items));
        }

        return new FinanceCashflowDefinition(
            snapshot.SummaryLabel,
            snapshot.SummaryFormat,
            new ArrayReadOnlyList<FinanceCashflowCategoryDefinition>(categories.GetRawArray(), categories.Count));
    }

    private static FinanceScenarioDefinition MapFinanceScenario(FinanceScenarioBoardSnapshot snapshot)
    {
        if (snapshot is null)
        {
            return new FinanceScenarioDefinition(
                string.Empty,
                "{0:+0.0;-0.0;0.0} \u2022 {1}",
                string.Empty,
                string.Empty,
                System.Array.Empty<FinanceScenarioOptionDefinition>());
        }

        var optionSnapshots = snapshot.Options;
        ArrayReadOnlyList<FinanceScenarioOptionDefinition> options;

        if (optionSnapshots is null || optionSnapshots.Count == 0)
        {
            options = new ArrayReadOnlyList<FinanceScenarioOptionDefinition>(System.Array.Empty<FinanceScenarioOptionDefinition>(), 0);
        }
        else
        {
            var optionCollection = new ArrayCollection<FinanceScenarioOptionDefinition>(optionSnapshots.Count);
            for (var i = 0; i < optionSnapshots.Count; i++)
            {
                var option = optionSnapshots[i];
                optionCollection.Add(new FinanceScenarioOptionDefinition(
                    option.Id,
                    option.Title,
                    option.Detail,
                    option.Impact,
                    option.Format,
                    option.IsSelected,
                    option.Accent));
            }

            options = new ArrayReadOnlyList<FinanceScenarioOptionDefinition>(optionCollection.GetRawArray(), optionCollection.Count);
        }

        return new FinanceScenarioDefinition(
            snapshot.SummaryLabel,
            snapshot.SummaryFormat,
            snapshot.CommitLabel,
            snapshot.ResetLabel,
            options);
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
        var series = new ChartSeriesDefinition[1];
        series[0] = new ChartSeriesDefinition(trend.Metric.Value, seriesColor, MapTrendPoints(trend.Points));

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
            ChartSeries: new ArrayReadOnlyList<ChartSeriesDefinition>(series, 1),
            ContentType: CardType.LineChart);
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
            ListItems: MapEntries(gauge.SupportingItems ?? Array.Empty<ListEntrySnapshot>()),
            ContentType: CardType.Gauge);
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
            Timeline: MapTimelineEntries(timeline.Events),
            ContentType: CardType.Timeline);
    }

    private static CardDefinition CreateShotMapCard(string id, string title, string subtitle, ShotMapSnapshot shotMap, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ShotMap,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ShotMap: MapShotMap(shotMap));
    }

    private static CardDefinition CreateMedicalTimelineCard(string id, string title, string subtitle, MedicalTimelineSnapshot timeline, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.MedicalTimeline,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            MedicalTimeline: MapMedicalTimeline(timeline),
            ContentType: CardType.MedicalTimeline);
    }

    private static CardDefinition CreateTrainingProgressionCard(
        string id,
        string title,
        string subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        TrainingProgressionSnapshot progression)
    {
        if (progression is null)
        {
            throw new ArgumentNullException(nameof(progression));
        }

        var highlights = MapEntries(progression.Highlights ?? Array.Empty<ListEntrySnapshot>());
        var definition = MapTrainingProgression(progression);

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.TrainingProgression,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            MetricValue: progression.MetricValue,
            MetricLabel: progression.MetricLabel,
            Description: progression.Summary,
            ListItems: highlights,
            TrainingProgression: definition);
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

    private static CardDefinition CreateClubVisionRoadmapCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        ClubVisionRoadmapSnapshot roadmap)
    {
        var phasesCollection = new ArrayCollection<ClubVisionRoadmapPhaseDefinition>(roadmap.Phases?.Count ?? 4);
        if (roadmap.Phases is { Count: > 0 })
        {
            for (var i = 0; i < roadmap.Phases.Count; i++)
            {
                var phase = roadmap.Phases[i];
                phasesCollection.Add(new ClubVisionRoadmapPhaseDefinition(
                    phase.Id,
                    phase.Title,
                    phase.Timeline,
                    phase.Status,
                    phase.Description,
                    phase.Accent,
                    phase.Pill));
            }
        }

        var statusCollection = new ArrayCollection<string>(roadmap.StatusOptions?.Count ?? 4);
        if (roadmap.StatusOptions is { Count: > 0 })
        {
            for (var i = 0; i < roadmap.StatusOptions.Count; i++)
            {
                statusCollection.Add(roadmap.StatusOptions[i]);
            }
        }

        var pillCollection = new ArrayCollection<string>(roadmap.PillOptions?.Count ?? 4);
        if (roadmap.PillOptions is { Count: > 0 })
        {
            for (var i = 0; i < roadmap.PillOptions.Count; i++)
            {
                pillCollection.Add(roadmap.PillOptions[i]);
            }
        }

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ContentHost,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ClubVisionRoadmap: new ClubVisionRoadmapDefinition(
                new ArrayReadOnlyList<ClubVisionRoadmapPhaseDefinition>(phasesCollection.GetRawArray(), phasesCollection.Count),
                new ArrayReadOnlyList<string>(statusCollection.GetRawArray(), statusCollection.Count),
                new ArrayReadOnlyList<string>(pillCollection.GetRawArray(), pillCollection.Count)),
            ContentType: CardType.ClubVisionRoadmap);
    }

    private static CardDefinition CreateClubVisionExpectationBoardCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        ClubVisionExpectationBoardSnapshot board)
    {
        var objectiveCollection = new ArrayCollection<ClubVisionExpectationDefinition>(board.Objectives?.Count ?? 4);
        if (board.Objectives is { Count: > 0 })
        {
            for (var i = 0; i < board.Objectives.Count; i++)
            {
                var objective = board.Objectives[i];
                objectiveCollection.Add(new ClubVisionExpectationDefinition(
                    objective.Id,
                    objective.Objective,
                    objective.Competition,
                    objective.Priority,
                    objective.Status,
                    objective.Deadline,
                    objective.Notes,
                    objective.Accent));
            }
        }

        var statusCollection = new ArrayCollection<string>(board.StatusOptions?.Count ?? 4);
        if (board.StatusOptions is { Count: > 0 })
        {
            for (var i = 0; i < board.StatusOptions.Count; i++)
            {
                statusCollection.Add(board.StatusOptions[i]);
            }
        }

        var priorityCollection = new ArrayCollection<string>(board.PriorityOptions?.Count ?? 4);
        if (board.PriorityOptions is { Count: > 0 })
        {
            for (var i = 0; i < board.PriorityOptions.Count; i++)
            {
                priorityCollection.Add(board.PriorityOptions[i]);
            }
        }

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ContentHost,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ClubVisionExpectations: new ClubVisionExpectationBoardDefinition(
                new ArrayReadOnlyList<ClubVisionExpectationDefinition>(objectiveCollection.GetRawArray(), objectiveCollection.Count),
                new ArrayReadOnlyList<string>(statusCollection.GetRawArray(), statusCollection.Count),
                new ArrayReadOnlyList<string>(priorityCollection.GetRawArray(), priorityCollection.Count)),
            ContentType: CardType.ClubVisionExpectations);
    }

    private static CardDefinition CreateMoraleHeatmapCard(MoraleHeatmapSnapshot? heatmap)
    {
        var definition = MapMoraleHeatmap(heatmap);

        return new CardDefinition(
            Id: "morale-heatmap",
            Title: "Morale Heatmap",
            Subtitle: "Mood by unit",
            Kind: CardKind.MoraleHeatmap,
            Column: 0,
            Row: 12,
            ColumnSpan: 18,
            RowSpan: 7,
            MoraleHeatmap: definition);
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

    private static CardDefinition CreateFinanceBudgetAllocatorCard(
        string id,
        string title,
        string subtitle,
        FinanceBudgetAllocationSnapshot snapshot,
        int column,
        int row,
        int columnSpan,
        int rowSpan)
    {
        var definition = MapFinanceBudgetAllocator(snapshot);

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.FinanceBudgetAllocator,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            FinanceBudgetAllocator: definition);
    }

    private static CardDefinition CreateFinanceCashflowCard(
        string id,
        string title,
        string subtitle,
        FinanceCashflowSnapshot snapshot,
        int column,
        int row,
        int columnSpan,
        int rowSpan)
    {
        var definition = MapFinanceCashflow(snapshot);

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.FinanceCashflow,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            FinanceCashflow: definition);
    }

    private static CardDefinition CreateFinanceScenarioCard(
        string id,
        string title,
        string subtitle,
        FinanceScenarioBoardSnapshot snapshot,
        int column,
        int row,
        int columnSpan,
        int rowSpan)
    {
        var definition = MapFinanceScenario(snapshot);

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.FinanceScenarioBoard,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            FinanceScenario: definition);
    }

    private static CardDefinition CreateContentHostCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        CardType contentType,
        uint primaryEntityId = 0)
    {
        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ContentHost,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ContentType: contentType,
            PrimaryEntityId: primaryEntityId);
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
        return CreateContentHostCard(id, title, subtitle, column, row, columnSpan, rowSpan, CardType.ScoutingReport);
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
        var playerCollection = new ArrayCollection<ShortlistPlayerDefinition>(players?.Count ?? 0);
        if (players is { Count: > 0 })
        {
            for (var i = 0; i < players.Count; i++)
            {
                playerCollection.Add(MapShortlistPlayer(players[i]));
            }
        }

        var statusCollection = new ArrayCollection<string>(statusOptions?.Count ?? 0);
        if (statusOptions is { Count: > 0 })
        {
            for (var i = 0; i < statusOptions.Count; i++)
            {
                var option = statusOptions[i];
                if (!string.IsNullOrWhiteSpace(option))
                {
                    statusCollection.Add(option);
                }
            }
        }

        var actionCollection = new ArrayCollection<string>(actionOptions?.Count ?? 0);
        if (actionOptions is { Count: > 0 })
        {
            for (var i = 0; i < actionOptions.Count; i++)
            {
                var option = actionOptions[i];
                if (!string.IsNullOrWhiteSpace(option))
                {
                    actionCollection.Add(option);
                }
            }
        }

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.ShortlistBoard,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            ShortlistBoard: new ShortlistBoardDefinition(
                new ArrayReadOnlyList<ShortlistPlayerDefinition>(playerCollection.GetRawArray(), playerCollection.Count),
                new ArrayReadOnlyList<string>(statusCollection.GetRawArray(), statusCollection.Count),
                new ArrayReadOnlyList<string>(actionCollection.GetRawArray(), actionCollection.Count)));
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

        var list = new ArrayCollection<SquadPlayerDefinition>(players.Count);
        for (var i = 0; i < players.Count; i++)
        {
            var player = players[i];
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

        return new SquadTableDefinition(new ArrayReadOnlyList<SquadPlayerDefinition>(list.GetRawArray(), list.Count));
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

        var columnCollection = new ArrayCollection<string>(heatmap.Columns?.Count ?? 0);
        if (heatmap.Columns is { Count: > 0 })
        {
            for (var i = 0; i < heatmap.Columns.Count; i++)
            {
                columnCollection.Add(heatmap.Columns[i]);
            }
        }

        var intensityCollection = new ArrayCollection<TrainingIntensityLevelDefinition>(heatmap.Intensities?.Count ?? 0);
        if (heatmap.Intensities is { Count: > 0 })
        {
            for (var i = 0; i < heatmap.Intensities.Count; i++)
            {
                var intensity = heatmap.Intensities[i];
                intensityCollection.Add(new TrainingIntensityLevelDefinition(
                    intensity.Key,
                    intensity.DisplayName,
                    intensity.Color,
                    intensity.LoadValue));
            }
        }

        var rowCollection = new ArrayCollection<TrainingWorkloadRowDefinition>(heatmap.Units?.Count ?? 0);
        if (heatmap.Units is { Count: > 0 })
        {
            for (var i = 0; i < heatmap.Units.Count; i++)
            {
                var unit = heatmap.Units[i];
                var cellCollection = new ArrayCollection<TrainingWorkloadCellDefinition>(unit.Cells?.Count ?? 0);
                if (unit.Cells is { Count: > 0 })
                {
                    for (var j = 0; j < unit.Cells.Count; j++)
                    {
                        var cell = unit.Cells[j];
                        cellCollection.Add(new TrainingWorkloadCellDefinition(cell.Column, cell.IntensityKey, cell.Load, cell.Detail));
                    }
                }

                rowCollection.Add(new TrainingWorkloadRowDefinition(
                    unit.Label,
                    new ArrayReadOnlyList<TrainingWorkloadCellDefinition>(cellCollection.GetRawArray(), cellCollection.Count)));
            }
        }

        return new TrainingWorkloadHeatmapDefinition(
            new ArrayReadOnlyList<string>(columnCollection.GetRawArray(), columnCollection.Count),
            new ArrayReadOnlyList<TrainingWorkloadRowDefinition>(rowCollection.GetRawArray(), rowCollection.Count),
            new ArrayReadOnlyList<TrainingIntensityLevelDefinition>(intensityCollection.GetRawArray(), intensityCollection.Count),
            heatmap.LegendTitle,
            heatmap.LegendSubtitle);
    }

    private static TrainingProgressionDefinition MapTrainingProgression(TrainingProgressionSnapshot progression)
    {
        var periodCollection = new ArrayCollection<string>(progression.Periods?.Count ?? 0);
        if (progression.Periods is { Count: > 0 })
        {
            for (var i = 0; i < progression.Periods.Count; i++)
            {
                periodCollection.Add(progression.Periods[i]);
            }
        }

        var seriesCollection = new ArrayCollection<TrainingProgressionSeriesDefinition>(progression.Series?.Count ?? 0);
        if (progression.Series is { Count: > 0 })
        {
            for (var i = 0; i < progression.Series.Count; i++)
            {
                var seriesSnapshot = progression.Series[i];
                var pointsCollection = new ArrayCollection<TrainingProgressionPointDefinition>(seriesSnapshot.Points?.Count ?? 0);

                if (seriesSnapshot.Points is { Count: > 0 })
                {
                    for (var j = 0; j < seriesSnapshot.Points.Count; j++)
                    {
                        var point = seriesSnapshot.Points[j];
                        pointsCollection.Add(new TrainingProgressionPointDefinition(point.Period, point.Value, point.Detail));
                    }
                }

                seriesCollection.Add(new TrainingProgressionSeriesDefinition(
                    seriesSnapshot.Id,
                    seriesSnapshot.Name,
                    seriesSnapshot.Color,
                    seriesSnapshot.Accent,
                    seriesSnapshot.IsHighlighted,
                    new ArrayReadOnlyList<TrainingProgressionPointDefinition>(pointsCollection.GetRawArray(), pointsCollection.Count)));
            }
        }

        return new TrainingProgressionDefinition(
            new ArrayReadOnlyList<string>(periodCollection.GetRawArray(), periodCollection.Count),
            progression.Minimum,
            progression.Maximum,
            progression.Summary,
            new ArrayReadOnlyList<TrainingProgressionSeriesDefinition>(seriesCollection.GetRawArray(), seriesCollection.Count));
    }

    private static MoraleHeatmapDefinition MapMoraleHeatmap(MoraleHeatmapSnapshot? heatmap)
    {
        if (heatmap is null)
        {
            return new MoraleHeatmapDefinition(
                Array.Empty<string>(),
                Array.Empty<MoraleHeatmapRowDefinition>(),
                Array.Empty<MoraleIntensityDefinition>());
        }

        var columnCollection = new ArrayCollection<string>(heatmap.Columns?.Count ?? 0);
        if (heatmap.Columns is { Count: > 0 })
        {
            for (var i = 0; i < heatmap.Columns.Count; i++)
            {
                columnCollection.Add(heatmap.Columns[i]);
            }
        }

        var intensityCollection = new ArrayCollection<MoraleIntensityDefinition>(heatmap.Intensities?.Count ?? 0);
        if (heatmap.Intensities is { Count: > 0 })
        {
            for (var i = 0; i < heatmap.Intensities.Count; i++)
            {
                var intensity = heatmap.Intensities[i];
                intensityCollection.Add(new MoraleIntensityDefinition(
                    intensity.Key,
                    intensity.DisplayName,
                    intensity.Color,
                    intensity.Description));
            }
        }

        var rowCollection = new ArrayCollection<MoraleHeatmapRowDefinition>(heatmap.Rows?.Count ?? 0);
        if (heatmap.Rows is { Count: > 0 })
        {
            for (var i = 0; i < heatmap.Rows.Count; i++)
            {
                var row = heatmap.Rows[i];
                var cellCollection = new ArrayCollection<MoraleHeatmapCellDefinition>(row.Cells?.Count ?? 0);
                if (row.Cells is { Count: > 0 })
                {
                    for (var j = 0; j < row.Cells.Count; j++)
                    {
                        var cell = row.Cells[j];
                        cellCollection.Add(new MoraleHeatmapCellDefinition(
                            cell.Column,
                            cell.IntensityKey,
                            cell.Label,
                            cell.Detail));
                    }
                }

                rowCollection.Add(new MoraleHeatmapRowDefinition(
                    row.Label,
                    new ArrayReadOnlyList<MoraleHeatmapCellDefinition>(cellCollection.GetRawArray(), cellCollection.Count)));
            }
        }

        return new MoraleHeatmapDefinition(
            new ArrayReadOnlyList<string>(columnCollection.GetRawArray(), columnCollection.Count),
            new ArrayReadOnlyList<MoraleHeatmapRowDefinition>(rowCollection.GetRawArray(), rowCollection.Count),
            new ArrayReadOnlyList<MoraleIntensityDefinition>(intensityCollection.GetRawArray(), intensityCollection.Count),
            heatmap.LegendTitle,
            heatmap.LegendSubtitle);
    }

    private static CardDefinition CreateTrainingUnitBoardCard(
        string id,
        string title,
        string? subtitle,
        int column,
        int row,
        int columnSpan,
        int rowSpan,
        TrainingUnitsBoardSnapshot board)
    {
        var unitCollection = new ArrayCollection<TrainingUnitGroupDefinition>(board.Units?.Count ?? 0);

        if (board.Units is { Count: > 0 })
        {
            for (var i = 0; i < board.Units.Count; i++)
            {
                var unit = board.Units[i];

                var coachOptionsCollection = new ArrayCollection<TrainingUnitCoachOptionDefinition>(unit.CoachOptions?.Count ?? 0);
                string? coachName = null;
                string? coachAccent = null;

                if (unit.CoachOptions is { Count: > 0 })
                {
                    for (var j = 0; j < unit.CoachOptions.Count; j++)
                    {
                        var option = unit.CoachOptions[j];
                        coachOptionsCollection.Add(new TrainingUnitCoachOptionDefinition(option.Id, option.Name, option.Accent));

                        if (unit.CoachId is not null && coachName is null && string.Equals(option.Id, unit.CoachId, StringComparison.OrdinalIgnoreCase))
                        {
                            coachName = option.Name;
                            coachAccent = option.Accent;
                        }
                    }
                }

                var memberCollection = new ArrayCollection<TrainingUnitMemberDefinition>(unit.Members?.Count ?? 0);
                if (unit.Members is { Count: > 0 })
                {
                    for (var j = 0; j < unit.Members.Count; j++)
                    {
                        var member = unit.Members[j];
                        memberCollection.Add(new TrainingUnitMemberDefinition(
                            member.Id,
                            member.Name,
                            member.Position,
                            member.Role,
                            member.Status,
                            member.Accent,
                            member.Detail));
                    }
                }

                unitCollection.Add(new TrainingUnitGroupDefinition(
                    unit.Id,
                    unit.Name,
                    unit.CoachId,
                    coachName,
                    coachAccent,
                    new ArrayReadOnlyList<TrainingUnitCoachOptionDefinition>(coachOptionsCollection.GetRawArray(), coachOptionsCollection.Count),
                    new ArrayReadOnlyList<TrainingUnitMemberDefinition>(memberCollection.GetRawArray(), memberCollection.Count)));
            }
        }

        var availableCollection = new ArrayCollection<TrainingUnitMemberDefinition>(board.AvailablePlayers?.Count ?? 0);
        if (board.AvailablePlayers is { Count: > 0 })
        {
            for (var i = 0; i < board.AvailablePlayers.Count; i++)
            {
                var member = board.AvailablePlayers[i];
                availableCollection.Add(new TrainingUnitMemberDefinition(
                    member.Id,
                    member.Name,
                    member.Position,
                    member.Role,
                    member.Status,
                    member.Accent,
                    member.Detail));
            }
        }

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.TrainingUnitBoard,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            TrainingUnitBoard: new TrainingUnitBoardDefinition(
                new ArrayReadOnlyList<TrainingUnitGroupDefinition>(unitCollection.GetRawArray(), unitCollection.Count),
                new ArrayReadOnlyList<TrainingUnitMemberDefinition>(availableCollection.GetRawArray(), availableCollection.Count)));
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
        var orderedDays = TrainingCalendarFormatter.OrderedDays;
        var dayCollection = new ArrayCollection<string>(orderedDays.Count + (sessions?.Count ?? 0));
        for (int i = 0; i < orderedDays.Count; i++)
        {
            dayCollection.Add(orderedDays[i]);
        }

        var orderedSlots = TrainingCalendarFormatter.OrderedSlots;
        var slotCollection = new ArrayCollection<string>(orderedSlots.Count + (sessions?.Count ?? 0));
        for (int i = 0; i < orderedSlots.Count; i++)
        {
            slotCollection.Add(orderedSlots[i]);
        }

        var mappedSessions = new ArrayCollection<TrainingCalendarSessionDefinition>(sessions?.Count ?? 0);

        if (sessions is { Count: > 0 })
        {
            for (int i = 0; i < sessions.Count; i++)
            {
                var session = sessions[i];

                if (!string.IsNullOrWhiteSpace(session.Day) && !ContainsIgnoreCase(dayCollection, session.Day))
                {
                    dayCollection.Add(session.Day);
                }

                if (!string.IsNullOrWhiteSpace(session.Slot) && !ContainsIgnoreCase(slotCollection, session.Slot))
                {
                    slotCollection.Add(session.Slot);
                }

                mappedSessions.Add(new TrainingCalendarSessionDefinition(
                    session.Id,
                    session.Day,
                    session.Slot,
                    session.Activity,
                    session.Focus,
                    session.Intensity));
            }
        }

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: subtitle,
            Kind: CardKind.TrainingCalendar,
            Column: column,
            Row: row,
            ColumnSpan: columnSpan,
            RowSpan: rowSpan,
            TrainingCalendar: new TrainingCalendarDefinition(
                new ArrayReadOnlyList<string>(dayCollection.GetRawArray(), dayCollection.Count),
                new ArrayReadOnlyList<string>(slotCollection.GetRawArray(), slotCollection.Count),
                new ArrayReadOnlyList<TrainingCalendarSessionDefinition>(mappedSessions.GetRawArray(), mappedSessions.Count)));
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
        var mappedDeals = new ArrayCollection<TransferNegotiationDealDefinition>(deals?.Count ?? 0);

        if (deals is { Count: > 0 })
        {
            for (int i = 0; i < deals.Count; i++)
            {
                mappedDeals.Add(MapNegotiationDeal(deals[i]));
            }
        }

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
            Negotiations: new TransferNegotiationDefinition(new ArrayReadOnlyList<TransferNegotiationDealDefinition>(mappedDeals.GetRawArray(), mappedDeals.Count)));
    }

    private static TransferNegotiationDealDefinition MapNegotiationDeal(TransferNegotiationDealSnapshot deal)
    {
        var terms = new ArrayCollection<TransferNegotiationTermDefinition>(deal.Terms?.Count ?? 0);
        if (deal.Terms is { Count: > 0 })
        {
            for (int i = 0; i < deal.Terms.Count; i++)
            {
                terms.Add(MapNegotiationTerm(deal.Terms[i]));
            }
        }

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
            new ArrayReadOnlyList<TransferNegotiationTermDefinition>(terms.GetRawArray(), terms.Count));
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
            PillText: metric.Pill,
            ContentType: CardType.Metric);
    }

    private static CardDefinition CreateListCard(string id, string title, string? subtitle, int column, int row, int columnSpan, int rowSpan, IReadOnlyList<ListEntrySnapshot> entries, string? description = null, CardKind kind = CardKind.List)
    {
        CardType? contentType = null;
        if (kind == CardKind.List || kind == CardKind.Status)
        {
            contentType = CardType.SquadSummary;
        }
        else if (kind == CardKind.Fixture)
        {
            contentType = CardType.UpcomingFixtures;
        }

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
            ListItems: MapEntries(entries),
            ContentType: contentType);
    }

    private static bool ContainsIgnoreCase(ArrayCollection<string> collection, string value)
    {
        var array = collection.GetRawArray();
        var count = collection.Count;
        for (int i = 0; i < count; i++)
        {
            if (string.Equals(array[i], value, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }

    private static IReadOnlyList<ListEntrySnapshot> BuildNegotiationSummaries(
        IReadOnlyList<TransferNegotiationDealSnapshot> deals,
        int take)
    {
        if (deals is null || deals.Count == 0 || take <= 0)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        var limit = take < deals.Count ? take : deals.Count;
        var items = new ArrayCollection<ListEntrySnapshot>(limit);

        for (int i = 0; i < limit; i++)
        {
            items.Add(CreateNegotiationSummary(deals[i]));
        }

        return new ArrayReadOnlyList<ListEntrySnapshot>(items.GetRawArray(), items.Count);
    }

    private static uint ParsePlayerId(string? identifier)
    {
        if (string.IsNullOrEmpty(identifier))
        {
            return 0;
        }

        if (uint.TryParse(identifier, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value))
        {
            return value;
        }

        return 0;
    }

    private static ListEntrySnapshot CreateNegotiationSummary(TransferNegotiationDealSnapshot deal)
    {
        TransferNegotiationTermSnapshot? feeTerm = null;

        if (deal.Terms is { Count: > 0 })
        {
            for (int i = 0; i < deal.Terms.Count; i++)
            {
                var term = deal.Terms[i];
                if (string.Equals(term.Id, "fee", StringComparison.OrdinalIgnoreCase))
                {
                    feeTerm = term;
                    break;
                }
            }
        }

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
            ListItems: new CardListItem[]
            {
                new("Venue", "Emirates Stadium"),
                new("Kick-Off", "Sat 17:30"),
                new("Form", "Arsenal WWWDL", "Man City WWLWW"),
            },
            ContentType: CardType.UpcomingFixtures);
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
