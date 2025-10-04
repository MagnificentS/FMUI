using System.Collections.Generic;

namespace FMUI.Wpf.Models;

public sealed record NavigationSubItem(string Title, string Identifier);

public sealed record NavigationTab(string Title, string Identifier, IReadOnlyList<NavigationSubItem> SubItems);

public enum NavigationIndicatorSeverity
{
    None = 0,
    Info = 1,
    Warning = 2,
    Critical = 3
}

public sealed record NavigationIndicatorSnapshot(int Count, NavigationIndicatorSeverity Severity, string? Tooltip)
{
    public static NavigationIndicatorSnapshot None { get; } = new(0, NavigationIndicatorSeverity.None, null);

    public bool HasAlert => Severity != NavigationIndicatorSeverity.None;
}
