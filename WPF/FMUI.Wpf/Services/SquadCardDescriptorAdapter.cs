using System;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Services;

public interface ISquadCardDescriptorAdapter
{
    bool TryCreate(CardViewModel card, out SquadCardDescriptor descriptor);
}

public sealed class SquadCardDescriptorAdapter : ISquadCardDescriptorAdapter
{
    private readonly IUiPerformanceMonitor _monitor;

    public SquadCardDescriptorAdapter(IUiPerformanceMonitor monitor)
    {
        _monitor = monitor ?? throw new ArgumentNullException(nameof(monitor));
    }

    public bool TryCreate(CardViewModel card, out SquadCardDescriptor descriptor)
    {
        if (card is null)
        {
            throw new ArgumentNullException(nameof(card));
        }

        descriptor = default!;

        if (!string.Equals(card.TabIdentifier, "squad", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        switch (card.Definition.Kind)
        {
            case CardKind.SquadTable when card.Definition.SquadTable is not null:
                var squadCount = card.Definition.SquadTable.Players?.Count ?? 0;
                using (_monitor.Measure("SquadCards", "AdaptRoster", squadCount))
                {
                    var rosterState = card.GetSquadRosterState();
                    descriptor = new SquadRosterCardDescriptor(
                        card.Id,
                        card.TabIdentifier,
                        card.SectionIdentifier,
                        rosterState);
                }
                return true;

            case CardKind.List when card.Definition.ListItems is { Count: > 0 } listItems:
            case CardKind.Status when card.Definition.ListItems is { Count: > 0 } listItems:
                using (_monitor.Measure("SquadCards", "AdaptList", listItems.Count))
                {
                    descriptor = new SquadListCardDescriptor(
                        card.Id,
                        card.TabIdentifier,
                        card.SectionIdentifier,
                        ResolveKind(card.SectionIdentifier),
                        listItems);
                }
                return true;
        }

        return false;
    }

    private static SquadCardDescriptorKind ResolveKind(string sectionIdentifier) =>
        sectionIdentifier switch
        {
            "selection-info" => SquadCardDescriptorKind.SelectionList,
            "international" => SquadCardDescriptorKind.InternationalList,
            "squad-depth" => SquadCardDescriptorKind.DepthList,
            _ => SquadCardDescriptorKind.SelectionList
        };
}
