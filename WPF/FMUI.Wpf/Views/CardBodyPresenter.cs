using System.Windows;
using System.Windows.Controls;
using FMUI.Wpf.Services;
using FMUI.Wpf.ViewModels;
using FMUI.Wpf.Views.Squad;
using Microsoft.Extensions.DependencyInjection;

namespace FMUI.Wpf.Views;

public sealed class CardBodyPresenter : ContentControl
{
    public static readonly DependencyProperty CardProperty = DependencyProperty.Register(
        nameof(Card),
        typeof(CardViewModel),
        typeof(CardBodyPresenter),
        new PropertyMetadata(null, OnCardChanged));

    public static readonly DependencyProperty BodyTemplateSelectorProperty = DependencyProperty.Register(
        nameof(BodyTemplateSelector),
        typeof(DataTemplateSelector),
        typeof(CardBodyPresenter),
        new PropertyMetadata(null, OnTemplateSelectorChanged));

    private readonly ISquadCardDescriptorAdapter _adapter;
    private readonly SquadCardContentPool _pool;
    private FrameworkElement? _activeElement;

    public CardBodyPresenter()
    {
        var app = (App)Application.Current;
        _adapter = app.Services.GetRequiredService<ISquadCardDescriptorAdapter>();
        _pool = app.Services.GetRequiredService<SquadCardContentPool>();
        Unloaded += OnUnloaded;
    }

    public CardViewModel? Card
    {
        get => (CardViewModel?)GetValue(CardProperty);
        set => SetValue(CardProperty, value);
    }

    public DataTemplateSelector? BodyTemplateSelector
    {
        get => (DataTemplateSelector?)GetValue(BodyTemplateSelectorProperty);
        set => SetValue(BodyTemplateSelectorProperty, value);
    }

    private static void OnCardChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is CardBodyPresenter presenter)
        {
            presenter.UpdateContent();
        }
    }

    private static void OnTemplateSelectorChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is CardBodyPresenter presenter)
        {
            presenter.UpdateContent();
        }
    }

    private void UpdateContent()
    {
        ReleaseActiveElement();

        var card = Card;
        if (card is not null && _adapter.TryCreate(card, out var descriptor))
        {
            var element = _pool.Acquire(descriptor);
            _activeElement = element;
            Content = element;
            ContentTemplate = null;
            ContentTemplateSelector = null;
            return;
        }

        Content = card;
        ContentTemplate = null;
        ContentTemplateSelector = BodyTemplateSelector;
    }

    private void ReleaseActiveElement()
    {
        if (_activeElement is null)
        {
            return;
        }

        _pool.Release(_activeElement);
        _activeElement = null;
    }

    private void OnUnloaded(object sender, RoutedEventArgs e)
    {
        ReleaseActiveElement();
    }
}
