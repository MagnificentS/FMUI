using System;
using System.Collections.Generic;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed class CardContentHost
{
    private readonly CardPresenterCollection _presenters;

    public CardContentHost()
        : this(new CardPresenterCollection())
    {
    }

    public CardContentHost(CardPresenterCollection presenters)
    {
        _presenters = presenters ?? throw new ArgumentNullException(nameof(presenters));
    }

    public CardPresenterCollection Presenters => _presenters;

    public void SetSource(IEnumerable<CardViewModel> cards)
    {
        _presenters.Clear();
        _presenters.AddRange(cards);
    }

    public void SetSource(IEnumerable<ICardPresenterDescriptor> descriptors)
    {
        _presenters.Clear();
        _presenters.AddRange(descriptors);
    }

    public IReadOnlyList<ICardPresenterDescriptor> GetDescriptors()
    {
        return _presenters.Items;
    }

    public void Refresh()
    {
        _presenters.RefreshAdapters();
    }
}
