using System;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public readonly struct CardContentContext
{
    public CardContentContext(
        CardDefinition definition,
        uint primaryEntityId,
        CardViewModel? viewModel,
        IServiceProvider services)
    {
        Definition = definition;
        PrimaryEntityId = primaryEntityId;
        ViewModel = viewModel;
        Services = services;
    }

    public CardDefinition Definition { get; }

    public uint PrimaryEntityId { get; }

    public CardViewModel? ViewModel { get; }

    public IServiceProvider Services { get; }
}
