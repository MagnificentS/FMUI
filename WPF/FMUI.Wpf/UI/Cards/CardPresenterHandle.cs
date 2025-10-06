using System;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

/// <summary>
/// Wraps a card presenter so pooled content can obtain contexts without
/// depending on the concrete card implementation. Initially bridges the
/// legacy <see cref="CardPresenter"/> but can host descriptor presenters
/// once available.
/// </summary>
public readonly struct CardPresenterHandle
{
    public CardPresenterHandle(ICardContentContextSource source, CardPresenter viewModel)
    {
        Source = source ?? throw new ArgumentNullException(nameof(source));
        ViewModel = viewModel ?? throw new ArgumentNullException(nameof(viewModel));
    }

    public CardPresenterHandle(CardPresenter viewModel)
        : this(viewModel, viewModel)
    {
    }

    public ICardContentContextSource Source { get; }

    public CardPresenter ViewModel { get; }

    public CardDefinition Definition => Source.Definition;

    public bool TryCreateContext(IServiceProvider services, uint primaryEntityId, out CardContentContext context)
    {
        return Source.TryCreateContext(services, primaryEntityId, out context);
    }
}
