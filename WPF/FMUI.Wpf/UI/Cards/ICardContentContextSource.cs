using System;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public interface ICardContentContextSource
{
    CardDefinition Definition { get; }

    bool TryCreateContext(IServiceProvider services, uint primaryEntityId, out CardContentContext context);
}
