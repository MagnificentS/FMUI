using System.Collections.Generic;

namespace FMUI.Wpf.Models;

public sealed record NavigationSubItem(string Title, string Identifier);

public sealed record NavigationTab(string Title, string Identifier, IReadOnlyList<NavigationSubItem> SubItems);
