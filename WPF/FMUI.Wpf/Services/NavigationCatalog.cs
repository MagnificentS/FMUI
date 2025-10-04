using System.Collections.Generic;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public static class NavigationCatalog
{
    public static IReadOnlyList<NavigationTab> BuildDefaultTabs() => new List<NavigationTab>
    {
        new("Overview", "overview", new List<NavigationSubItem>
        {
            new("Club Vision", "club-vision"),
            new("Dynamics", "dynamics"),
            new("Medical Centre", "medical-centre"),
            new("Analytics", "analytics"),
        }),
        new("Squad", "squad", new List<NavigationSubItem>
        {
            new("Selection Info", "selection-info"),
            new("Players", "players"),
            new("International", "international"),
            new("Squad Depth", "squad-depth"),
        }),
        new("Tactics", "tactics", new List<NavigationSubItem>
        {
            new("Overview", "tactics-overview"),
            new("Set Pieces", "set-pieces"),
            new("Analysis", "tactics-analysis"),
        }),
        new("Training", "training", new List<NavigationSubItem>
        {
            new("Overview", "training-overview"),
            new("Calendar", "training-calendar"),
            new("Units", "training-units"),
        }),
        new("Transfers", "transfers", new List<NavigationSubItem>
        {
            new("Centre", "transfer-centre"),
            new("Scouting", "scouting"),
            new("Shortlist", "shortlist"),
        }),
        new("Finances", "finances", new List<NavigationSubItem>
        {
            new("Summary", "finances-summary"),
            new("Income", "finances-income"),
            new("Expenditure", "finances-expenditure"),
        }),
        new("Fixtures", "fixtures", new List<NavigationSubItem>
        {
            new("Schedule", "fixtures-schedule"),
            new("Results", "fixtures-results"),
            new("Calendar", "fixtures-calendar"),
        }),
    };
}
