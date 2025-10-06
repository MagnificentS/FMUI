using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class TransferTargetsCard : UserControl, ICardContent
{
    private const string AvailableLabel = "Available";
    private const string UnavailableLabel = "Unavailable";

    private readonly TransferModule _module;
    private readonly PlayerDatabase _playerDatabase;
    private readonly StringDatabase _stringDatabase;
    private readonly IEventAggregator _eventAggregator;
    private readonly TransferModule.TransferTargetView[] _buffer;
    private readonly TransferTargetPresenter[] _presenters;
    private IDisposable? _subscription;

    public TransferTargetsCard(
        TransferModule module,
        PlayerDatabase playerDatabase,
        StringDatabase stringDatabase,
        IEventAggregator eventAggregator)
    {
        InitializeComponent();

        _module = module ?? throw new ArgumentNullException(nameof(module));
        _playerDatabase = playerDatabase ?? throw new ArgumentNullException(nameof(playerDatabase));
        _stringDatabase = stringDatabase ?? throw new ArgumentNullException(nameof(stringDatabase));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        _buffer = new TransferModule.TransferTargetView[TransferModule.MaximumTargetCount];
        _presenters = new TransferTargetPresenter[_buffer.Length];

        for (int i = 0; i < _presenters.Length; i++)
        {
            var presenter = new TransferTargetPresenter();
            _presenters[i] = presenter;
            TargetRowsHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.TransferTargets;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        _subscription ??= _eventAggregator.Subscribe<ModuleNotification>(OnModuleNotification);
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        RenderState();
    }

    public void Detach()
    {
        _subscription?.Dispose();
        _subscription = null;
    }

    public void Reset()
    {
        TransferBudgetValue.Text = "£0";
        WageBudgetValue.Text = "£0";

        for (int i = 0; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private void OnModuleNotification(ModuleNotification notification)
    {
        if (!string.Equals(notification.ModuleId, TransferModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, TransferModuleEvents.StateUpdated, StringComparison.Ordinal))
        {
            return;
        }

        var dispatcher = Application.Current?.Dispatcher;
        if (dispatcher is null)
        {
            RenderState();
            return;
        }

        if (dispatcher.CheckAccess())
        {
            RenderState();
        }
        else
        {
            dispatcher.Invoke(RenderState);
        }
    }

    private void RenderState()
    {
        TransferBudgetValue.Text = FormatCurrency(_module.TransferBudget);
        WageBudgetValue.Text = FormatCurrency(_module.WageBudget);

        var span = _buffer.AsSpan();
        int count = _module.CopyTargets(span);

        for (int i = 0; i < count; i++)
        {
            ref readonly var target = ref span[i];
            var presenter = _presenters[i];
            presenter.Set(
                ResolvePlayerName(target.PlayerId),
                FormatCurrency(target.AskingPrice),
                FormatCurrency(target.WageDemand),
                target.ScoutRating.ToString(CultureInfo.InvariantCulture),
                FormatPercentage(target.InterestLevel),
                target.IsAvailable ? AvailableLabel : UnavailableLabel,
                target.IsAvailable);
            presenter.Show();
        }

        for (int i = count; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private string ResolvePlayerName(int playerId)
    {
        if (playerId <= 0)
        {
            return "Player";
        }

        uint id = (uint)playerId;
        ref var player = ref _playerDatabase.GetPlayer(id);
        string name = _stringDatabase.GetCompactName(player.FirstNameId, player.LastNameId);

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = _stringDatabase.GetFullName(player.FirstNameId, player.LastNameId);
        }

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            int digits = CountDigits(id);
            name = string.Create(7 + digits, id, static (span, value) =>
            {
                "Player ".AsSpan().CopyTo(span);
                value.TryFormat(span.Slice(7), out _, default, CultureInfo.InvariantCulture);
            });
        }

        return name;
    }

    private static string FormatCurrency(uint value)
    {
        if (value >= 1_000_000)
        {
            double millions = value / 1_000_000d;
            return string.Format(CultureInfo.InvariantCulture, "£{0:0.#}M", millions);
        }

        if (value >= 10_000)
        {
            double thousands = value / 1_000d;
            return string.Format(CultureInfo.InvariantCulture, "£{0:0.#}k", thousands);
        }

        return string.Format(CultureInfo.InvariantCulture, "£{0:N0}", value);
    }

    private static string FormatPercentage(byte value)
    {
        return string.Format(CultureInfo.InvariantCulture, "{0}%", value);
    }

    private static int CountDigits(uint value)
    {
        if (value >= 1_000_000_000u)
        {
            return 10;
        }

        if (value >= 100_000_000u)
        {
            return 9;
        }

        if (value >= 10_000_000u)
        {
            return 8;
        }

        if (value >= 1_000_000u)
        {
            return 7;
        }

        if (value >= 100_000u)
        {
            return 6;
        }

        if (value >= 10_000u)
        {
            return 5;
        }

        if (value >= 1_000u)
        {
            return 4;
        }

        if (value >= 100u)
        {
            return 3;
        }

        if (value >= 10u)
        {
            return 2;
        }

        return 1;
    }

    private sealed class TransferTargetPresenter
    {
        private readonly TextBlock _name;
        private readonly TextBlock _price;
        private readonly TextBlock _wage;
        private readonly TextBlock _scout;
        private readonly TextBlock _interest;
        private readonly TextBlock _status;
        private readonly Border _statusPill;

        public TransferTargetPresenter()
        {
            Root = new Border
            {
                Background = GetBrush("OverlayListItemBrush", Brushes.Transparent),
                BorderBrush = GetBrush("OverlayListItemBorderBrush", Brushes.Transparent),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(12),
                Padding = new Thickness(12, 8, 12, 8)
            };

            var grid = new Grid
            {
                ColumnDefinitions =
                {
                    new ColumnDefinition { Width = new GridLength(2, GridUnitType.Star) },
                    new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) },
                    new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) },
                    new ColumnDefinition { Width = GridLength.Auto },
                    new ColumnDefinition { Width = GridLength.Auto },
                    new ColumnDefinition { Width = GridLength.Auto }
                }
            };

            _name = CreateTextBlock(TextAlignment.Left);
            _price = CreateTextBlock(TextAlignment.Right);
            _wage = CreateTextBlock(TextAlignment.Right);
            _scout = CreateTextBlock(TextAlignment.Right);
            _interest = CreateTextBlock(TextAlignment.Right);
            _status = new TextBlock
            {
                FontSize = 12,
                FontWeight = FontWeights.SemiBold,
                Foreground = Brushes.White,
                Margin = new Thickness(0)
            };

            _statusPill = new Border
            {
                Background = GetBrush("AccentPrimaryBrush", Brushes.SeaGreen),
                CornerRadius = new CornerRadius(10),
                Padding = new Thickness(10, 4, 10, 4),
                Child = _status,
                HorizontalAlignment = HorizontalAlignment.Right
            };

            grid.Children.Add(_name);
            grid.Children.Add(_price);
            grid.Children.Add(_wage);
            grid.Children.Add(_scout);
            grid.Children.Add(_interest);
            grid.Children.Add(_statusPill);

            Grid.SetColumn(_name, 0);
            Grid.SetColumn(_price, 1);
            Grid.SetColumn(_wage, 2);
            Grid.SetColumn(_scout, 3);
            Grid.SetColumn(_interest, 4);
            Grid.SetColumn(_statusPill, 5);

            Root.Child = grid;
            Hide();
        }

        public Border Root { get; }

        public void Set(string name, string price, string wage, string scout, string interest, string status, bool isAvailable)
        {
            _name.Text = name;
            _price.Text = price;
            _wage.Text = wage;
            _scout.Text = scout;
            _interest.Text = interest;
            _status.Text = status;
            _statusPill.Background = isAvailable
                ? GetBrush("AccentPrimaryBrush", Brushes.SeaGreen)
                : GetBrush("OverlayListItemBorderBrush", Brushes.Gray);
        }

        public void Show()
        {
            Root.Visibility = Visibility.Visible;
        }

        public void Hide()
        {
            Root.Visibility = Visibility.Collapsed;
        }

        private static TextBlock CreateTextBlock(TextAlignment alignment)
        {
            return new TextBlock
            {
                FontSize = 13,
                Foreground = GetBrush("PrimaryTextBrush", Brushes.White),
                TextAlignment = alignment,
                Margin = new Thickness(0, 0, 12, 0)
            };
        }

        private static Brush GetBrush(string key, Brush fallback)
        {
            if (Application.Current?.Resources[key] is Brush brush)
            {
                return brush;
            }

            return fallback;
        }
    }
}
