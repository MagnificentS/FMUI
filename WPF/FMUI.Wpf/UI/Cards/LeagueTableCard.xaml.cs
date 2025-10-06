using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class LeagueTableCard : UserControl, ICardContent
{
    private const int MaxEntries = 20;

    private readonly CompetitionModule _module;
    private readonly IEventAggregator _eventAggregator;
    private readonly CompetitionModule.TableView[] _buffer;
    private readonly TablePresenter[] _presenters;
    private IDisposable? _subscription;

    public LeagueTableCard(CompetitionModule module, IEventAggregator eventAggregator)
    {
        _module = module ?? throw new ArgumentNullException(nameof(module));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();

        _buffer = new CompetitionModule.TableView[MaxEntries];
        _presenters = new TablePresenter[MaxEntries];

        for (int i = 0; i < MaxEntries; i++)
        {
            var presenter = new TablePresenter();
            _presenters[i] = presenter;
            TableHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.LeagueTable;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        _subscription ??= _eventAggregator.Subscribe<ModuleNotification>(OnNotification);
        Render();
    }

    public void Update(in CardContentContext context)
    {
        Render();
    }

    public void Detach()
    {
        _subscription?.Dispose();
        _subscription = null;
    }

    public void Reset()
    {
        for (int i = 0; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private void OnNotification(ModuleNotification notification)
    {
        if (!string.Equals(notification.ModuleId, CompetitionModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, CompetitionModuleEvents.StateUpdated, StringComparison.Ordinal))
        {
            return;
        }

        var dispatcher = Application.Current?.Dispatcher;
        if (dispatcher is null)
        {
            Render();
            return;
        }

        if (dispatcher.CheckAccess())
        {
            Render();
        }
        else
        {
            dispatcher.Invoke(Render);
        }
    }

    private void Render()
    {
        var span = _buffer.AsSpan();
        int count = _module.CopyTable(span);
        for (int i = 0; i < count; i++)
        {
            ref readonly var view = ref span[i];
            var presenter = _presenters[i];
            presenter.Set(view.Position, view.ClubName, view.Played, view.Points);
            presenter.Show();
        }

        for (int i = count; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private sealed class TablePresenter
    {
        private readonly Border _root;
        private readonly TextBlock _position;
        private readonly TextBlock _club;
        private readonly TextBlock _played;
        private readonly TextBlock _points;

        public TablePresenter()
        {
            _position = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White, TextAlignment.Left);
            _club = CreateTextBlock(14, FontWeights.Normal, Brushes.White, TextAlignment.Left);
            _played = CreateTextBlock(14, FontWeights.Normal, Brushes.White, TextAlignment.Right);
            _points = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White, TextAlignment.Right);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(40) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(40) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(50) });

            Grid.SetColumn(_position, 0);
            grid.Children.Add(_position);
            Grid.SetColumn(_club, 1);
            grid.Children.Add(_club);
            Grid.SetColumn(_played, 2);
            grid.Children.Add(_played);
            Grid.SetColumn(_points, 3);
            grid.Children.Add(_points);

            _root = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34)),
                BorderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(4),
                Padding = new Thickness(8, 4, 8, 4),
                Child = grid,
                Visibility = Visibility.Collapsed
            };
        }

        public UIElement Root => _root;

        public void Set(byte position, string club, byte played, byte points)
        {
            _position.Text = position.ToString(CultureInfo.InvariantCulture);
            _club.Text = club;
            _played.Text = played.ToString(CultureInfo.InvariantCulture);
            _points.Text = points.ToString(CultureInfo.InvariantCulture);
        }

        public void Show() => _root.Visibility = Visibility.Visible;

        public void Hide() => _root.Visibility = Visibility.Collapsed;

        private static TextBlock CreateTextBlock(double size, FontWeight weight, Brush brush, TextAlignment alignment)
        {
            return new TextBlock
            {
                FontSize = size,
                FontWeight = weight,
                Foreground = brush,
                TextAlignment = alignment,
                TextTrimming = TextTrimming.CharacterEllipsis
            };
        }
    }
}
