using System;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public readonly struct CardContentContext
{
    public CardContentContext(
        CardDefinition definition,
        uint primaryEntityId,
        ICardContentContextSource? source,
        IServiceProvider services)
    {
        Definition = definition;
        PrimaryEntityId = primaryEntityId;
        Source = source;
        Services = services;
    }

    public CardDefinition Definition { get; }

    public uint PrimaryEntityId { get; }

    public ICardContentContextSource? Source { get; }

    public IServiceProvider Services { get; }
}
