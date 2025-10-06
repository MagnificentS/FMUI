using System;
using System.Collections.Generic;
using System.Globalization;
using FMUI.Wpf.Configuration;
using FMUI.Wpf.Infrastructure;
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
    private readonly IModuleSnapshotProvider _snapshotProvider;
    private readonly IndicatorLocalizationConfig _localization;
    private readonly IStringDatabase _strings;
    private readonly Dictionary<(string Tab, string Section), Func<NavigationIndicatorSnapshot>> _evaluators;

    public NavigationIndicatorService(
        IClubDataService clubDataService,
        IModuleSnapshotProvider snapshotProvider,
        IndicatorLocalizationConfig localization,
        IStringDatabase strings)
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _snapshotProvider = snapshotProvider ?? throw new ArgumentNullException(nameof(snapshotProvider));
        _localization = localization ?? throw new ArgumentNullException(nameof(localization));
        _strings = strings ?? throw new ArgumentNullException(nameof(strings));
        _clubDataService.SnapshotChanged += OnSnapshotChanged;

        _evaluators = new Dictionary<(string Tab, string Section), Func<NavigationIndicatorSnapshot>>(StringComparer.OrdinalIgnoreCase)
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
            return evaluator();
        }

        return NavigationIndicatorSnapshot.None;
    }

    private void OnSnapshotChanged(object? sender, ClubDataSnapshot snapshot)
    {
        IndicatorsChanged?.Invoke(this, EventArgs.Empty);
    }

    private NavigationIndicatorSnapshot EvaluateClubVision()
    {
        var expectations = _snapshotProvider.GetOverview().ClubVision.CompetitionExpectations;
        return BuildListIndicator(expectations, _localization.ClubVision);
    }

    private NavigationIndicatorSnapshot EvaluateDynamics()
    {
        var issues = _snapshotProvider.GetOverview().Dynamics.PlayerIssues;
        return BuildListIndicator(issues, _localization.Dynamics);
    }

    private NavigationIndicatorSnapshot EvaluateMedical()
    {
        var injuries = _snapshotProvider.GetOverview().Medical.InjuryList;
        return BuildListIndicator(injuries, _localization.Medical);
    }

    private NavigationIndicatorSnapshot EvaluateSelectionInfo()
    {
        var concerns = _snapshotProvider.GetSquad().SelectionInfo.FitnessConcerns;
        return BuildListIndicator(concerns, _localization.SquadSelection);
    }

    private NavigationIndicatorSnapshot EvaluateSquadTransfers()
    {
        var interest = _snapshotProvider.GetSquad().Players.TransferInterest;
        return BuildListIndicator(interest, _localization.SquadTransfers);
    }

    private NavigationIndicatorSnapshot EvaluateTrainingMedicalLoad()
    {
        var workload = _snapshotProvider.GetTraining().Overview.MedicalWorkload;
        return BuildListIndicator(workload, _localization.TrainingMedical);
    }

    private NavigationIndicatorSnapshot EvaluateTransferCentre()
    {
        var deals = _snapshotProvider.GetTransfers().Centre.ActiveDeals;
        return BuildListIndicator(deals, _localization.TransferCentre);
    }

    private NavigationIndicatorSnapshot EvaluateFixtureSchedule()
    {
        var fixtures = _snapshotProvider.GetFixtures().Schedule.UpcomingFixtures;
        if (fixtures.Count == 0)
        {
            return NavigationIndicatorSnapshot.None;
        }

        var tooltip = fixtures.Count == 1
            ? string.Format(CultureInfo.CurrentCulture, _strings.Resolve(_localization.FixtureSchedule.NextFixture), fixtures[0].Primary)
            : string.Format(CultureInfo.CurrentCulture, _strings.Resolve(_localization.FixtureSchedule.MultipleFixtures), fixtures.Count);

        return new NavigationIndicatorSnapshot(fixtures.Count, NavigationIndicatorSeverity.Info, tooltip);
    }

    private NavigationIndicatorSnapshot BuildListIndicator(
        IReadOnlyList<ListEntrySnapshot> entries,
        IndicatorMessageConfig messages)
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

        var singularMessage = _strings.Resolve(messages.Singular);
        var pluralMessage = _strings.Resolve(messages.Plural);

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
