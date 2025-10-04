using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels.Editors;

namespace FMUI.Wpf.Services;

public interface ICardEditorCatalog
{
    bool SupportsEditing(string tabIdentifier, string sectionIdentifier, CardDefinition definition);

    CardEditorViewModel? CreateEditor(string tabIdentifier, string sectionIdentifier, CardDefinition definition);
}

public sealed class CardEditorCatalog : ICardEditorCatalog
{
    private readonly IClubDataService _clubDataService;

    public CardEditorCatalog(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService;
    }

    public bool SupportsEditing(string tabIdentifier, string sectionIdentifier, CardDefinition definition)
    {
        return GetFactory(tabIdentifier, sectionIdentifier, definition) is not null;
    }

    public CardEditorViewModel? CreateEditor(string tabIdentifier, string sectionIdentifier, CardDefinition definition)
    {
        var factory = GetFactory(tabIdentifier, sectionIdentifier, definition);
        return factory?.Invoke();
    }

    private Func<CardEditorViewModel>? GetFactory(string tabIdentifier, string sectionIdentifier, CardDefinition definition)
    {
        if (definition is null)
        {
            return null;
        }

        return (tabIdentifier, sectionIdentifier, definition.Id) switch
        {
            ("tactics", "tactics-overview", "formation-overview") => CreateFormationEditorFactory(),
            ("overview", "club-vision", "competition-objectives") => CreateClubVisionExpectationsBoardFactory(),
            ("overview", "club-vision", "strategic-roadmap") => CreateClubVisionRoadmapFactory(),
            ("overview", "dynamics", "player-issues") => CreateDynamicsPlayerIssuesFactory(),
            ("overview", "dynamics", "morale-heatmap") => CreateDynamicsMoraleHeatmapFactory(),
            ("squad", "players", "key-players") => CreateSquadKeyPlayersFactory(),
            ("training", "training-overview", "training-intensity") => CreateTrainingIntensityFactory(),
            ("training", "training-overview", "focus-areas") => CreateTrainingFocusAreasFactory(),
            ("training", "training-overview", "training-workload-heatmap") => CreateTrainingWorkloadHeatmapFactory(),
            ("training", "training-overview", "training-progression") => CreateTrainingProgressionFactory(),
            ("training", "training-calendar", "weekly-calendar") => CreateTrainingSessionsFactory(),
            ("training", "training-calendar", "week-overview") => CreateTrainingSessionsFactory(),
            ("training", "training-units", "training-unit-board") => CreateTrainingUnitBoardFactory(),
            ("transfers", "transfer-centre", "budget-usage") => CreateTransferBudgetUsageFactory(),
            ("transfers", "transfer-centre", "active-deals") => CreateTransferActiveDealsFactory(),
            ("transfers", "transfer-centre", "recent-activity") => CreateTransferRecentActivityFactory(),
            ("transfers", "scouting", "scout-assignments-board") => CreateScoutAssignmentsFactory(),
            ("transfers", "shortlist", "shortlist-board") => CreateShortlistBoardFactory(),
            ("finances", "finances-summary", "overall-balance") => CreateOverallBalanceFactory(),
            _ => null
        };
    }

    private Func<CardEditorViewModel>? CreateFormationEditorFactory()
    {
        var snapshot = _clubDataService.Current.Tactics;
        var lines = snapshot.FormationLines;
        var playerPool = snapshot.PlayerPool;

        if (playerPool is null || playerPool.Count == 0)
        {
            return null;
        }

        return () => new FormationEditorViewModel(
            "Manage Starting XI",
            "Swap players within the tactical shape.",
            lines,
            playerPool,
            _clubDataService);
    }

    private Func<CardEditorViewModel>? CreateClubVisionExpectationsBoardFactory()
    {
        var board = _clubDataService.Current.Overview.ClubVision.ExpectationBoard;

        return () => new ClubVisionExpectationBoardEditorViewModel(
            "Adjust Competition Objectives",
            "Update board-monitored targets and priorities.",
            board,
            PersistClubVisionExpectationsBoardAsync);
    }

    private async Task PersistClubVisionExpectationsBoardAsync(ClubVisionExpectationBoardSnapshot board)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var clubVision = snapshot.Overview.ClubVision with { ExpectationBoard = board };
            var overview = snapshot.Overview with { ClubVision = clubVision };
            return snapshot with { Overview = overview };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateClubVisionRoadmapFactory()
    {
        var roadmap = _clubDataService.Current.Overview.ClubVision.Roadmap;

        return () => new ClubVisionRoadmapEditorViewModel(
            "Edit Strategic Roadmap",
            "Manage long-term milestones and board checkpoints.",
            roadmap,
            PersistClubVisionRoadmapAsync);
    }

    private async Task PersistClubVisionRoadmapAsync(ClubVisionRoadmapSnapshot roadmap)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var clubVision = snapshot.Overview.ClubVision with { Roadmap = roadmap };
            var overview = snapshot.Overview with { ClubVision = clubVision };
            return snapshot with { Overview = overview };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateDynamicsPlayerIssuesFactory()
    {
        var snapshot = _clubDataService.Current;
        var items = snapshot.Overview.Dynamics.PlayerIssues;

        return () => new ListCardEditorViewModel(
            "Edit Player Issues",
            "Capture concerns raised by the squad.",
            items,
            PersistDynamicsPlayerIssuesAsync);
    }

    private async Task PersistDynamicsPlayerIssuesAsync(IReadOnlyList<ListEntrySnapshot> items)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var dynamics = snapshot.Overview.Dynamics with { PlayerIssues = items };
            var overview = snapshot.Overview with { Dynamics = dynamics };
            return snapshot with { Overview = overview };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateDynamicsMoraleHeatmapFactory()
    {
        var snapshot = _clubDataService.Current;
        var heatmap = snapshot.Overview.Dynamics.MoraleHeatmap;

        return () => new MoraleHeatmapEditorViewModel(
            "Adjust Dressing Room Morale",
            "Update unit morale levels and supporting notes.",
            heatmap,
            PersistDynamicsMoraleHeatmapAsync);
    }

    private async Task PersistDynamicsMoraleHeatmapAsync(MoraleHeatmapSnapshot heatmap)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var dynamics = snapshot.Overview.Dynamics with { MoraleHeatmap = heatmap };
            var overview = snapshot.Overview with { Dynamics = dynamics };
            return snapshot with { Overview = overview };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateSquadKeyPlayersFactory()
    {
        var snapshot = _clubDataService.Current;
        var items = snapshot.Squad.Players.KeyPlayers;

        return () => new ListCardEditorViewModel(
            "Edit Key Players",
            "Update the squad leaders highlighted on the tactical board.",
            items,
            PersistSquadKeyPlayersAsync);
    }

    private async Task PersistSquadKeyPlayersAsync(IReadOnlyList<ListEntrySnapshot> items)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var players = snapshot.Squad.Players with { KeyPlayers = items };
            var squad = snapshot.Squad with { Players = players };
            return snapshot with { Squad = squad };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTrainingIntensityFactory()
    {
        var snapshot = _clubDataService.Current;
        var gauge = snapshot.Training.Overview.Intensity;

        return () => new GaugeEditorViewModel(
            "Tune Training Intensity",
            "Adjust the workload to balance fitness and freshness.",
            gauge,
            PersistTrainingIntensityAsync);
    }

    private async Task PersistTrainingIntensityAsync(GaugeSnapshot gauge)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var overview = snapshot.Training.Overview with { Intensity = gauge };
            var training = snapshot.Training with { Overview = overview };
            return snapshot with { Training = training };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTrainingFocusAreasFactory()
    {
        var snapshot = _clubDataService.Current;
        var items = snapshot.Training.Overview.FocusAreas;

        return () => new ListCardEditorViewModel(
            "Edit Focus Areas",
            "Direct what the squad concentrates on this week.",
            items,
            PersistTrainingFocusAreasAsync);
    }

    private async Task PersistTrainingFocusAreasAsync(IReadOnlyList<ListEntrySnapshot> items)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var overview = snapshot.Training.Overview with { FocusAreas = items };
            var training = snapshot.Training with { Overview = overview };
            return snapshot with { Training = training };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTrainingProgressionFactory()
    {
        var progression = _clubDataService.Current.Training.Overview.Progression;

        if (progression is null)
        {
            return null;
        }

        return () => new TrainingProgressionEditorViewModel(
            progression,
            _clubDataService);
    }

    private Func<CardEditorViewModel>? CreateTrainingWorkloadHeatmapFactory()
    {
        var snapshot = _clubDataService.Current;
        var heatmap = snapshot.Training.Overview.WorkloadHeatmap;

        if (heatmap is null)
        {
            return null;
        }

        return () => new TrainingWorkloadEditorViewModel(
            "Adjust Workload Heatmap",
            "Balance unit intensity across the weekly schedule.",
            heatmap,
            PersistTrainingWorkloadHeatmapAsync);
    }

    private async Task PersistTrainingWorkloadHeatmapAsync(TrainingWorkloadHeatmapSnapshot heatmap)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var overview = snapshot.Training.Overview with { WorkloadHeatmap = heatmap };
            var training = snapshot.Training with { Overview = overview };
            return snapshot with { Training = training };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTrainingSessionsFactory()
    {
        var snapshot = _clubDataService.Current;
        var sessions = snapshot.Training.Calendar.SessionDetails;

        return () => new TrainingSessionEditorViewModel(
            "Configure Training Sessions",
            "Reschedule slots and adjust focus areas for the upcoming week.",
            sessions,
            PersistTrainingSessionsAsync);
    }

    private async Task PersistTrainingSessionsAsync(IReadOnlyList<TrainingSessionDetailSnapshot> sessions)
    {
        var orderedSessions = TrainingCalendarFormatter.OrderSessions(sessions).ToList();
        var overview = TrainingCalendarFormatter.BuildWeekOverview(orderedSessions).ToList();

        await _clubDataService.UpdateAsync(snapshot =>
        {
            var calendar = snapshot.Training.Calendar with
            {
                SessionDetails = orderedSessions,
                WeekOverview = overview
            };
            var training = snapshot.Training with { Calendar = calendar };
            return snapshot with { Training = training };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTrainingUnitBoardFactory()
    {
        var snapshot = _clubDataService.Current;
        var units = snapshot.Training.Units;
        var board = units.Board;

        if (board is null)
        {
            return null;
        }

        return () => new TrainingUnitBoardEditorViewModel(
            "Manage Training Units",
            "Assign players and coaches across the senior, youth, and goalkeeping groups.",
            board,
            PersistTrainingUnitBoardAsync);
    }

    private async Task PersistTrainingUnitBoardAsync(TrainingUnitsBoardSnapshot board)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var units = snapshot.Training.Units;

            var updatedUnits = units with
            {
                Board = board,
                SeniorUnit = CreateTrainingUnitListEntries(board, "senior"),
                YouthUnit = CreateTrainingUnitListEntries(board, "youth"),
                GoalkeepingUnit = CreateTrainingUnitListEntries(board, "goalkeeping"),
                CoachAssignments = CreateTrainingCoachAssignments(board)
            };

            var training = snapshot.Training with { Units = updatedUnits };
            return snapshot with { Training = training };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTransferBudgetUsageFactory()
    {
        var snapshot = _clubDataService.Current;
        var gauge = snapshot.Transfers.Centre.BudgetUsage;

        return () => new GaugeEditorViewModel(
            "Adjust Budget Usage",
            "Reflect committed and available funds.",
            gauge,
            PersistTransferBudgetUsageAsync);
    }

    private async Task PersistTransferBudgetUsageAsync(GaugeSnapshot gauge)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var centre = snapshot.Transfers.Centre with { BudgetUsage = gauge };
            var transfers = snapshot.Transfers with { Centre = centre };
            return snapshot with { Transfers = transfers };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateTransferActiveDealsFactory()
    {
        var snapshot = _clubDataService.Current.Transfers.Centre;
        var deals = snapshot.Negotiations ?? Array.Empty<TransferNegotiationDealSnapshot>();
        var summaries = snapshot.ActiveDeals ?? Array.Empty<ListEntrySnapshot>();

        return () => new TransferNegotiationEditorViewModel(
            deals,
            summaries,
            _clubDataService);
    }

    private Func<CardEditorViewModel>? CreateTransferRecentActivityFactory()
    {
        var snapshot = _clubDataService.Current;
        var items = snapshot.Transfers.Centre.RecentActivity;

        return () => new ListCardEditorViewModel(
            "Edit Recent Activity",
            "Log the latest completed moves.",
            items,
            PersistTransferRecentActivityAsync);
    }

    private async Task PersistTransferRecentActivityAsync(IReadOnlyList<ListEntrySnapshot> items)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var centre = snapshot.Transfers.Centre with { RecentActivity = items };
            var transfers = snapshot.Transfers with { Centre = centre };
            return snapshot with { Transfers = transfers };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateScoutAssignmentsFactory()
    {
        var scouting = _clubDataService.Current.Transfers.Scouting;

        return () => new ScoutAssignmentEditorViewModel(
            scouting.AssignmentBoard,
            scouting.ScoutPool,
            scouting.AssignmentStages,
            scouting.AssignmentPriorities,
            PersistScoutAssignmentsAsync);
    }

    private async Task PersistScoutAssignmentsAsync(IReadOnlyList<ScoutAssignmentSnapshot> assignments)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var scouting = snapshot.Transfers.Scouting;
            var assignmentList = assignments ?? Array.Empty<ScoutAssignmentSnapshot>();
            var summaries = assignmentList
                .Select(assignment => new ListEntrySnapshot(
                    assignment.Focus,
                    string.IsNullOrWhiteSpace(assignment.Role)
                        ? assignment.Region
                        : $"{assignment.Role} • {assignment.Region}",
                    assignment.Deadline,
                    string.IsNullOrWhiteSpace(assignment.Scout) ? null : assignment.Scout))
                .ToList();

            var updatedScouting = scouting with
            {
                AssignmentBoard = assignmentList,
                Assignments = summaries
            };

            var transfers = snapshot.Transfers with { Scouting = updatedScouting };
            return snapshot with { Transfers = transfers };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateShortlistBoardFactory()
    {
        var shortlist = _clubDataService.Current.Transfers.Shortlist;

        return () => new ShortlistEditorViewModel(
            shortlist.Board,
            shortlist.StatusOptions,
            shortlist.ActionOptions,
            PersistShortlistBoardAsync);
    }

    private async Task PersistShortlistBoardAsync(IReadOnlyList<ShortlistPlayerSnapshot> players)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var shortlist = snapshot.Transfers.Shortlist;
            var board = players ?? Array.Empty<ShortlistPlayerSnapshot>();
            var priorityTargets = board
                .Select(player => new ListEntrySnapshot(
                    player.Name,
                    player.Position,
                    player.Status,
                    player.Priority))
                .ToList();

            var updatedShortlist = shortlist with
            {
                Board = board,
                PriorityTargets = priorityTargets
            };

            var transfers = snapshot.Transfers with { Shortlist = updatedShortlist };
            return snapshot with { Transfers = transfers };
        }).ConfigureAwait(false);
    }

    private Func<CardEditorViewModel>? CreateOverallBalanceFactory()
    {
        var snapshot = _clubDataService.Current;
        var gauge = snapshot.Finance.Summary.OverallBalance;

        return () => new GaugeEditorViewModel(
            "Adjust Overall Balance",
            "Reflect the club's latest financial position.",
            gauge,
            PersistOverallBalanceAsync);
    }

    private async Task PersistOverallBalanceAsync(GaugeSnapshot gauge)
    {
        await _clubDataService.UpdateAsync(snapshot =>
        {
            var summary = snapshot.Finance.Summary with { OverallBalance = gauge };
            var finance = snapshot.Finance with { Summary = summary };
            return snapshot with { Finance = finance };
        }).ConfigureAwait(false);
    }

    private static IReadOnlyList<ListEntrySnapshot> CreateTrainingUnitListEntries(
        TrainingUnitsBoardSnapshot board,
        string unitId)
    {
        if (board is null)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        var unit = board.Units.FirstOrDefault(u => string.Equals(u.Id, unitId, StringComparison.OrdinalIgnoreCase));
        if (unit is null)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        return unit.Members
            .Select(member => new ListEntrySnapshot(
                member.Name,
                member.Position,
                member.Status,
                member.Accent))
            .ToList();
    }

    private static IReadOnlyList<ListEntrySnapshot> CreateTrainingCoachAssignments(TrainingUnitsBoardSnapshot board)
    {
        if (board is null)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        return board.Units
            .Select(unit =>
            {
                var coach = unit.CoachOptions.FirstOrDefault(option => string.Equals(option.Id, unit.CoachId, StringComparison.OrdinalIgnoreCase));
                var coachName = coach?.Name ?? "Unassigned";
                return new ListEntrySnapshot(unit.Name, coachName, null, coach?.Accent);
            })
            .ToList();
    }
}
