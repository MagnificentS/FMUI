using System;
using FMUI.Wpf.Models;
using FMUI.Wpf.UI.Cards;

namespace FMUI.Wpf.ViewModels;

public sealed partial class CardPresenter : ICardContentContextSource
{
    CardDefinition ICardContentContextSource.Definition => _definition;

    bool ICardContentContextSource.TryCreateContext(IServiceProvider services, uint primaryEntityId, out CardContentContext context)
    {
        var resolvedPrimaryEntityId = primaryEntityId != 0u ? primaryEntityId : PrimaryEntityId;
        context = new CardContentContext(_definition, resolvedPrimaryEntityId, this, services);
        return true;
    }
}
