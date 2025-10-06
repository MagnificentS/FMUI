using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.Configuration;

public sealed record NavigationSectionConfig(string Identifier, StringToken Label);

public sealed record NavigationTabConfig(string Identifier, StringToken Label, IReadOnlyList<NavigationSectionConfig> Sections);

public sealed class NavigationLocalizationConfig
{
    public NavigationLocalizationConfig(IReadOnlyList<NavigationTabConfig> tabs)
    {
        Tabs = tabs ?? throw new ArgumentNullException(nameof(tabs));
    }

    public IReadOnlyList<NavigationTabConfig> Tabs { get; }

    public static NavigationLocalizationConfig CreateDefault()
    {
        var tabs = new List<NavigationTabConfig>
        {
            new(
                "overview",
                StringToken.Create("nav.tab.overview", "Overview"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("club-vision", StringToken.Create("nav.section.clubVision", "Club Vision")),
                    new("dynamics", StringToken.Create("nav.section.dynamics", "Dynamics")),
                    new("medical-centre", StringToken.Create("nav.section.medicalCentre", "Medical Centre")),
                    new("analytics", StringToken.Create("nav.section.analytics", "Analytics")),
                })),
            new(
                "squad",
                StringToken.Create("nav.tab.squad", "Squad"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("selection-info", StringToken.Create("nav.section.selectionInfo", "Selection Info")),
                    new("players", StringToken.Create("nav.section.players", "Players")),
                    new("international", StringToken.Create("nav.section.international", "International")),
                    new("squad-depth", StringToken.Create("nav.section.squadDepth", "Squad Depth")),
                })),
            new(
                "tactics",
                StringToken.Create("nav.tab.tactics", "Tactics"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("tactics-overview", StringToken.Create("nav.section.tacticsOverview", "Overview")),
                    new("set-pieces", StringToken.Create("nav.section.setPieces", "Set Pieces")),
                    new("tactics-analysis", StringToken.Create("nav.section.tacticsAnalysis", "Analysis")),
                })),
            new(
                "training",
                StringToken.Create("nav.tab.training", "Training"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("training-overview", StringToken.Create("nav.section.trainingOverview", "Overview")),
                    new("training-calendar", StringToken.Create("nav.section.trainingCalendar", "Calendar")),
                    new("training-units", StringToken.Create("nav.section.trainingUnits", "Units")),
                })),
            new(
                "transfers",
                StringToken.Create("nav.tab.transfers", "Transfers"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("transfer-centre", StringToken.Create("nav.section.transferCentre", "Centre")),
                    new("scouting", StringToken.Create("nav.section.scouting", "Scouting")),
                    new("shortlist", StringToken.Create("nav.section.shortlist", "Shortlist")),
                })),
            new(
                "finances",
                StringToken.Create("nav.tab.finances", "Finances"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("finances-summary", StringToken.Create("nav.section.financesSummary", "Summary")),
                    new("finances-income", StringToken.Create("nav.section.financesIncome", "Income")),
                    new("finances-expenditure", StringToken.Create("nav.section.financesExpenditure", "Expenditure")),
                })),
            new(
                "fixtures",
                StringToken.Create("nav.tab.fixtures", "Fixtures"),
                new ReadOnlyCollection<NavigationSectionConfig>(new List<NavigationSectionConfig>
                {
                    new("fixtures-schedule", StringToken.Create("nav.section.fixturesSchedule", "Schedule")),
                    new("fixtures-results", StringToken.Create("nav.section.fixturesResults", "Results")),
                    new("fixtures-calendar", StringToken.Create("nav.section.fixturesCalendar", "Calendar")),
                })),
        };

        return new NavigationLocalizationConfig(new ReadOnlyCollection<NavigationTabConfig>(tabs));
    }

    public static IEnumerable<KeyValuePair<string, string>> GetResources(NavigationLocalizationConfig config)
    {
        foreach (var tab in config.Tabs)
        {
            yield return new KeyValuePair<string, string>(tab.Label.Id, tab.Label.Fallback ?? tab.Label.Id);
            foreach (var section in tab.Sections)
            {
                yield return new KeyValuePair<string, string>(section.Label.Id, section.Label.Fallback ?? section.Label.Id);
            }
        }
    }
}
