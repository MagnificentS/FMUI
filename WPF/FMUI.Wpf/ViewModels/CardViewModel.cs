using System.Collections.Generic;
using System.Collections.ObjectModel;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class CardViewModel : ObservableObject
{
    private readonly CardDefinition _definition;
    private readonly CardSurfaceMetrics _metrics;

    public CardViewModel(CardDefinition definition, CardSurfaceMetrics metrics)
    {
        _definition = definition;
        _metrics = metrics;
        ListItems = definition.ListItems is { Count: > 0 }
            ? new ReadOnlyCollection<CardListItemViewModel>(CreateListItems(definition.ListItems))
            : System.Array.Empty<CardListItemViewModel>();
        FormationLines = definition.FormationLines is { Count: > 0 }
            ? new ReadOnlyCollection<FormationLineViewModel>(CreateFormationLines(definition.FormationLines))
            : System.Array.Empty<FormationLineViewModel>();
    }

    public string Title => _definition.Title;

    public string? Subtitle => _definition.Subtitle;

    public string? Description => _definition.Description;

    public string? PillText => _definition.PillText;

    public string? MetricValue => _definition.MetricValue;

    public string? MetricLabel => _definition.MetricLabel;

    public CardKind Kind => _definition.Kind;

    public IReadOnlyList<CardListItemViewModel> ListItems { get; }

    public IReadOnlyList<FormationLineViewModel> FormationLines { get; }

    public bool HasSubtitle => !string.IsNullOrWhiteSpace(Subtitle);

    public bool HasDescription => !string.IsNullOrWhiteSpace(Description);

    public bool HasPill => !string.IsNullOrWhiteSpace(PillText);

    public bool HasMetric => !string.IsNullOrWhiteSpace(MetricValue);

    public bool HasListItems => ListItems.Count > 0;

    public bool HasFormation => FormationLines.Count > 0;

    public double Left => _metrics.CalculateLeft(_definition.Column);

    public double Top => _metrics.CalculateTop(_definition.Row);

    public double Width => _metrics.CalculateWidth(_definition.ColumnSpan);

    public double Height => _metrics.CalculateHeight(_definition.RowSpan);

    private static IList<CardListItemViewModel> CreateListItems(IReadOnlyList<CardListItem> items)
    {
        var list = new List<CardListItemViewModel>(items.Count);
        foreach (var item in items)
        {
            list.Add(new CardListItemViewModel(item));
        }

        return list;
    }

    private static IList<FormationLineViewModel> CreateFormationLines(IReadOnlyList<FormationLineDefinition> definitions)
    {
        var lines = new List<FormationLineViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            lines.Add(new FormationLineViewModel(definition.Role, definition.Players));
        }

        return lines;
    }
}

public sealed class CardListItemViewModel
{
    private readonly CardListItem _model;

    public CardListItemViewModel(CardListItem model)
    {
        _model = model;
    }

    public string Primary => _model.Primary;

    public string? Secondary => _model.Secondary;

    public string? Tertiary => _model.Tertiary;

    public string? Accent => _model.Accent;

    public bool HasSecondary => !string.IsNullOrWhiteSpace(Secondary);

    public bool HasTertiary => !string.IsNullOrWhiteSpace(Tertiary);

    public bool HasAccent => !string.IsNullOrWhiteSpace(Accent);
}

public sealed class FormationLineViewModel
{
    public FormationLineViewModel(string role, IReadOnlyList<string> players)
    {
        Role = role;
        Players = new ReadOnlyCollection<string>(new List<string>(players));
    }

    public string Role { get; }

    public IReadOnlyList<string> Players { get; }
}
