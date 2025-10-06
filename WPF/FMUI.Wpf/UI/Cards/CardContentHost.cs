using System.Windows;
using System.Windows.Controls;
using FMUI.Wpf.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FMUI.Wpf.UI.Cards;

public sealed class CardContentHost : ContentControl
{
    public static readonly DependencyProperty CardTypeProperty = DependencyProperty.Register(
        nameof(CardType),
        typeof(CardType),
        typeof(CardContentHost),
        new PropertyMetadata(CardType.TacticalOverview, OnCardTypeChanged));

    public static readonly DependencyProperty PrimaryEntityIdProperty = DependencyProperty.Register(
        nameof(PrimaryEntityId),
        typeof(uint),
        typeof(CardContentHost),
        new PropertyMetadata(0u, OnPrimaryEntityIdChanged));

    private CardFactory? _factory;
    private ICardContent? _content;
    private bool _isLoaded;
    private CardContentContext _context;
    private bool _hasContext;

    public CardContentHost()
    {
        Loaded += OnLoaded;
        Unloaded += OnUnloaded;
        DataContextChanged += OnDataContextChanged;
    }

    public CardType CardType
    {
        get => (CardType)GetValue(CardTypeProperty);
        set => SetValue(CardTypeProperty, value);
    }

    public uint PrimaryEntityId
    {
        get => (uint)GetValue(PrimaryEntityIdProperty);
        set => SetValue(PrimaryEntityIdProperty, value);
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        _isLoaded = true;
        AcquireContent();
    }

    private void OnUnloaded(object sender, RoutedEventArgs e)
    {
        _isLoaded = false;
        ReleaseContent();
    }

    private void AcquireContent()
    {
        if (!_isLoaded || _content is not null)
        {
            return;
        }

        if (!TryBuildContext(out _context))
        {
            return;
        }

        _hasContext = true;

        _factory ??= App.ServiceProvider.GetRequiredService<CardFactory>();
        _content = _factory.Rent(CardType);
        _content.Attach(_context);
        Content = _content.View;
        _content.Update(_context);
    }

    private void ReleaseContent()
    {
        if (_content is null)
        {
            return;
        }

        Content = null;
        if (_hasContext)
        {
            _content.Detach();
        }

        var factory = _factory ?? App.ServiceProvider.GetRequiredService<CardFactory>();
        factory.Return(_content);
        _content = null;
        _hasContext = false;
        _context = default;
    }

    private static void OnCardTypeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is not CardContentHost host)
        {
            return;
        }

        if (!host._isLoaded)
        {
            return;
        }

        host.ReleaseContent();
        host.AcquireContent();
    }

    private static void OnPrimaryEntityIdChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is not CardContentHost host || host._content is null)
        {
            return;
        }

        if (host.TryBuildContext(out var context))
        {
            host._context = context;
            host._hasContext = true;
            host._content.Update(context);
        }
    }

    private void OnDataContextChanged(object? sender, DependencyPropertyChangedEventArgs e)
    {
        if (!_isLoaded)
        {
            return;
        }

        if (_content is null)
        {
            ReleaseContent();
            AcquireContent();
            return;
        }

        if (TryBuildContext(out var context))
        {
            _context = context;
            _hasContext = true;
            _content.Update(context);
        }
    }

    private bool TryBuildContext(out CardContentContext context)
    {
        context = default;

        if (DataContext is not ICardContentContextSource source)
        {
            return false;
        }

        var services = App.ServiceProvider;
        return source.TryCreateContext(services, PrimaryEntityId, out context);
    }
}
