using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class YouthDevelopmentCard : UserControl, ICardContent
{
    private const int MaxProspects = 16;

    private readonly MediaModule _module;
    private readonly PlayerDatabase _playerDatabase;
    private readonly StringDatabase _stringDatabase;
    private readonly IEventAggregator _eventAggregator;
    private readonly MediaModule.YouthProspectView[] _buffer;
    private readonly ProspectPresenter[] _presenters;
    private IDisposable? _subscription;

    public YouthDevelopmentCard(
        MediaModule module,
        PlayerDatabase playerDatabase,
        StringDatabase stringDatabase,
        IEventAggregator eventAggregator)
    {
        _module = module ?? throw new ArgumentNullException(nameof(module));
        _playerDatabase = playerDatabase ?? throw new ArgumentNullException(nameof(playerDatabase));
        _stringDatabase = stringDatabase ?? throw new ArgumentNullException(nameof(stringDatabase));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();

        _buffer = new MediaModule.YouthProspectView[MaxProspects];
        _presenters = new ProspectPresenter[MaxProspects];

        for (int i = 0; i < MaxProspects; i++)
        {
            var presenter = new ProspectPresenter();
            _presenters[i] = presenter;
            ProspectHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.YouthDevelopment;

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
        if (!string.Equals(notification.ModuleId, MediaModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, MediaModuleEvents.StateUpdated, StringComparison.Ordinal))
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
        int count = _module.CopyProspects(span);
        for (int i = 0; i < count; i++)
        {
            ref readonly var view = ref span[i];
            var presenter = _presenters[i];
            presenter.Set(
                ResolveName(view.PlayerId, view.FirstNameId, view.LastNameId),
                view.Position,
                view.Overview,
                view.Rating,
                view.ExcitementLevel);
            presenter.Show();
        }

        for (int i = count; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private string ResolveName(int playerId, ushort firstNameId, ushort lastNameId)
    {
        if (playerId > 0)
        {
            ref var player = ref _playerDatabase.GetPlayer((uint)playerId);
            firstNameId = player.FirstNameId;
            lastNameId = player.LastNameId;
        }

        string name = _stringDatabase.GetFullName(firstNameId, lastNameId);
        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = _stringDatabase.GetCompactName(firstNameId, lastNameId);
        }

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            return "Prospect";
        }

        return name;
    }

    private sealed class ProspectPresenter
    {
        private readonly Border _root;
        private readonly TextBlock _name;
        private readonly TextBlock _position;
        private readonly TextBlock _summary;
        private readonly TextBlock _rating;

        public ProspectPresenter()
        {
            _name = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White);
            _position = CreateTextBlock(12, FontWeights.Normal, Brushes.White);
            _summary = CreateTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _rating = CreateTextBlock(12, FontWeights.Normal, Brushes.White);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(140) });

            var stack = new StackPanel
            {
                Orientation = Orientation.Vertical,
                Spacing = 2
            };
            stack.Children.Add(_name);
            stack.Children.Add(_position);
            stack.Children.Add(_summary);
            Grid.SetColumn(stack, 0);
            grid.Children.Add(stack);

            Grid.SetColumn(_rating, 1);
            _rating.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_rating);

            _root = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34)),
                BorderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(4),
                Padding = new Thickness(10, 6, 10, 6),
                Child = grid,
                Visibility = Visibility.Collapsed
            };
        }

        public UIElement Root => _root;

        public void Set(string name, string position, string overview, byte rating, byte excitement)
        {
            _name.Text = name;
            _position.Text = position;
            _summary.Text = overview;
            _rating.Text = string.Format(CultureInfo.InvariantCulture, "Rating {0}/100 • Excitement {1}/10", rating, excitement);
        }

        public void Show() => _root.Visibility = Visibility.Visible;

        public void Hide() => _root.Visibility = Visibility.Collapsed;

        private static TextBlock CreateTextBlock(double size, FontWeight weight, Brush brush)
        {
            return new TextBlock
            {
                FontSize = size,
                FontWeight = weight,
                Foreground = brush,
                TextTrimming = TextTrimming.CharacterEllipsis
            };
        }
    }
}
