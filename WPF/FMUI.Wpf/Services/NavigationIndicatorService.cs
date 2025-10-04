using System;
using System.Collections.Generic;
using System.Globalization;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface INavigationIndicatorService
{
    event EventHandler? IndicatorsChanged;

    NavigationIndicatorSnapshot GetIndicator(string tabIdentifier, string sectionIdentifier);
}

public sealed class NavigationIndicatorService : INavigationIndicatorService
{
    private static readonly string[] CriticalKeywords =
    {
        "critical",
        "injur",
        "fracture",
        "sprain",
        "strain",
        "tear",
        "rupture",
        "out",
        "severe",
        "urgent",
        "crisis",
        "eliminated",
        "hamstring",
        "groin",
        "knee",
        "ankle",
        "fractured"
    };

    private static readonly string[] WarningKeywords =
    {
        "medium",
        "monitor",
        "fatigue",
        "fatigued",
        "tight",
        "tightness",
        "manage",
        "late test",
        "consider",
        "decision",
        "assess",
        "loan",
        "progress",
        "negotiat",
        "alert",
        "pending",
        "caution",
        "long haul"
    };

    private readonly IClubDataService _clubDataService;
    private readonly Dictionary<(string Tab, string Section), Func<ClubDataSnapshot, NavigationIndicatorSnapshot>> _evaluators;

    public NavigationIndicatorService(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _clubDataService.SnapshotChanged += OnSnapshotChanged;

        _evaluators = new Dictionary<(string Tab, string Section), Func<ClubDataSnapshot, NavigationIndicatorSnapshot>>(StringComparer.OrdinalIgnoreCase)
        {
            [("overview", "club-vision")] = EvaluateClubVision,
            [("overview", "dynamics")] = EvaluateDynamics,
            [("overview", "medical-centre")] = EvaluateMedical,
            [("squad", "selection-info")] = EvaluateSelectionInfo,
            [("squad", "players")] = EvaluateSquadTransfers,
            [("training", "training-overview")] = EvaluateTrainingMedicalLoad,
            [("transfers", "transfer-centre")] = EvaluateTransferCentre,
            [("fixtures", "fixtures-schedule")] = EvaluateFixtureSchedule
        };
    }

    public event EventHandler? IndicatorsChanged;

    public NavigationIndicatorSnapshot GetIndicator(string tabIdentifier, string sectionIdentifier)
    {
        if (string.IsNullOrWhiteSpace(tabIdentifier))
        {
            throw new ArgumentException("Tab identifier cannot be null or whitespace.", nameof(tabIdentifier));
        }

        if (string.IsNullOrWhiteSpace(sectionIdentifier))
        {
            throw new ArgumentException("Section identifier cannot be null or whitespace.", nameof(sectionIdentifier));
        }

        if (_evaluators.TryGetValue((tabIdentifier, sectionIdentifier), out var evaluator))
        {
            var snapshot = _clubDataService.GetSnapshot();
            return evaluator(snapshot);
        }

        return NavigationIndicatorSnapshot.None;
    }

    private void OnSnapshotChanged(object? sender, ClubDataSnapshot snapshot)
    {
        IndicatorsChanged?.Invoke(this, EventArgs.Empty);
    }

    private static NavigationIndicatorSnapshot EvaluateClubVision(ClubDataSnapshot snapshot)
    {
        var expectations = snapshot.Overview.ClubVision.CompetitionExpectations;
        return BuildListIndicator(
            expectations,
            singularMessage: "{0} expectation is off target",
            pluralMessage: "{0} competition expectations need action");
    }

    private static NavigationIndicatorSnapshot EvaluateDynamics(ClubDataSnapshot snapshot)
    {
        var issues = snapshot.Overview.Dynamics.PlayerIssues;
        return BuildListIndicator(
            issues,
            singularMessage: "Issue raised by {0}",
            pluralMessage: "{0} player issues require attention");
    }

    private static NavigationIndicatorSnapshot EvaluateMedical(ClubDataSnapshot snapshot)
    {
        var injuries = snapshot.Overview.Medical.InjuryList;
        return BuildListIndicator(
            injuries,
            singularMessage: "Medical flag for {0}",
            pluralMessage: "{0} medical cases active");
    }

    private static NavigationIndicatorSnapshot EvaluateSelectionInfo(ClubDataSnapshot snapshot)
    {
        var concerns = snapshot.Squad.SelectionInfo.FitnessConcerns;
        return BuildListIndicator(
            concerns,
            singularMessage: "Fitness concern: {0}",
            pluralMessage: "{0} fitness concerns to manage");
    }

    private static NavigationIndicatorSnapshot EvaluateSquadTransfers(ClubDataSnapshot snapshot)
    {
        var interest = snapshot.Squad.Players.TransferInterest;
        return BuildListIndicator(
            interest,
            singularMessage: "Transfer interest in {0}",
            pluralMessage: "{0} players attracting bids");
    }

    private static NavigationIndicatorSnapshot EvaluateTrainingMedicalLoad(ClubDataSnapshot snapshot)
    {
        var workload = snapshot.Training.Overview.MedicalWorkload;
        return BuildListIndicator(
            workload,
            singularMessage: "Training risk: {0}",
            pluralMessage: "{0} players flagged by medical team");
    }

    private static NavigationIndicatorSnapshot EvaluateTransferCentre(ClubDataSnapshot snapshot)
    {
        var deals = snapshot.Transfers.Centre.ActiveDeals;
        return BuildListIndicator(
            deals,
            singularMessage: "Deal in progress: {0}",
            pluralMessage: "{0} active deals underway");
    }

    private static NavigationIndicatorSnapshot EvaluateFixtureSchedule(ClubDataSnapshot snapshot)
    {
        var fixtures = snapshot.Fixtures.Schedule.UpcomingFixtures;
        if (fixtures.Count == 0)
        {
            return NavigationIndicatorSnapshot.None;
        }

        var tooltip = fixtures.Count == 1
            ? string.Format(CultureInfo.CurrentCulture, "Next fixture: {0}", fixtures[0].Primary)
            : string.Format(CultureInfo.CurrentCulture, "{0} fixtures this fortnight", fixtures.Count);

        return new NavigationIndicatorSnapshot(fixtures.Count, NavigationIndicatorSeverity.Info, tooltip);
    }

    private static NavigationIndicatorSnapshot BuildListIndicator(
        IReadOnlyList<ListEntrySnapshot> entries,
        string singularMessage,
        string pluralMessage)
    {
        if (entries is null || entries.Count == 0)
        {
            return NavigationIndicatorSnapshot.None;
        }

        var severity = NavigationIndicatorSeverity.None;
        var concerningCount = 0;
        string? firstLabel = null;

        foreach (var entry in entries)
        {
            var entrySeverity = EvaluateEntrySeverity(entry);
            if (entrySeverity >= NavigationIndicatorSeverity.Warning)
            {
                concerningCount++;
                firstLabel ??= entry.Primary ?? entry.Secondary ?? entry.Tertiary ?? "item";
            }

            severity = Max(severity, entrySeverity);
        }

        if (concerningCount == 0)
        {
            return NavigationIndicatorSnapshot.None;
        }

        var tooltip = concerningCount == 1
            ? string.Format(CultureInfo.CurrentCulture, singularMessage, firstLabel)
            : string.Format(CultureInfo.CurrentCulture, pluralMessage, concerningCount);

        return new NavigationIndicatorSnapshot(concerningCount, severity, tooltip);
    }

    private static NavigationIndicatorSeverity EvaluateEntrySeverity(ListEntrySnapshot entry)
    {
        if (entry is null)
        {
            return NavigationIndicatorSeverity.None;
        }

        var severity = NavigationIndicatorSeverity.None;

        severity = Max(severity, EvaluateTextSeverity(entry.Accent));
        severity = Max(severity, EvaluateTextSeverity(entry.Primary));
        severity = Max(severity, EvaluateTextSeverity(entry.Secondary));
        severity = Max(severity, EvaluateTextSeverity(entry.Tertiary));

        return severity;
    }

    private static NavigationIndicatorSeverity EvaluateTextSeverity(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return NavigationIndicatorSeverity.None;
        }

        var text = value.Trim();
        var comparison = CultureInfo.CurrentCulture.CompareInfo;

        foreach (var keyword in CriticalKeywords)
        {
            if (comparison.IndexOf(text, keyword, CompareOptions.IgnoreCase | CompareOptions.IgnoreNonSpace) >= 0)
            {
                return NavigationIndicatorSeverity.Critical;
            }
        }

        foreach (var keyword in WarningKeywords)
        {
            if (comparison.IndexOf(text, keyword, CompareOptions.IgnoreCase | CompareOptions.IgnoreNonSpace) >= 0)
            {
                return NavigationIndicatorSeverity.Warning;
            }
        }

        return NavigationIndicatorSeverity.Info;
    }

    private static NavigationIndicatorSeverity Max(NavigationIndicatorSeverity left, NavigationIndicatorSeverity right)
    {
        return (NavigationIndicatorSeverity)Math.Max((int)left, (int)right);
    }
}
