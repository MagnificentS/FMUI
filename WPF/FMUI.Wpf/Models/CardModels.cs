using System.Collections.Generic;

namespace FMUI.Wpf.Models;

public enum CardKind
{
    Metric,
    List,
    Formation,
    Fixture,
    Status
}

public sealed record CardListItem(string Primary, string? Secondary = null, string? Tertiary = null, string? Accent = null);

public sealed record FormationLineDefinition(string Role, IReadOnlyList<string> Players);

public sealed record CardDefinition(
    string Id,
    string Title,
    string? Subtitle,
    CardKind Kind,
    int Column,
    int Row,
    int ColumnSpan,
    int RowSpan,
    string? MetricValue = null,
    string? MetricLabel = null,
    string? Description = null,
    string? PillText = null,
    IReadOnlyList<CardListItem>? ListItems = null,
    IReadOnlyList<FormationLineDefinition>? FormationLines = null);

public sealed record CardLayout(string TabIdentifier, string SectionIdentifier, IReadOnlyList<CardDefinition> Cards)
{
    public static CardLayout Empty { get; } = new(string.Empty, string.Empty, System.Array.Empty<CardDefinition>());
}
