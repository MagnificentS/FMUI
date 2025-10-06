using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Modules;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class FinanceOverviewCard : UserControl, ICardContent
{
    private const int MaxMetrics = 12;

    private readonly FinanceModule _module;
    private readonly IEventAggregator _eventAggregator;
    private readonly FinanceModule.FinanceMetricView[] _incomeBuffer;
    private readonly FinanceModule.FinanceMetricView[] _expenditureBuffer;
    private readonly MetricPresenter[] _incomePresenters;
    private readonly MetricPresenter[] _expenditurePresenters;
    private IDisposable? _subscription;

    public FinanceOverviewCard(FinanceModule module, IEventAggregator eventAggregator)
    {
        _module = module ?? throw new ArgumentNullException(nameof(module));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();

        _incomeBuffer = new FinanceModule.FinanceMetricView[MaxMetrics];
        _expenditureBuffer = new FinanceModule.FinanceMetricView[MaxMetrics];
        _incomePresenters = new MetricPresenter[MaxMetrics];
        _expenditurePresenters = new MetricPresenter[MaxMetrics];

        for (int i = 0; i < MaxMetrics; i++)
        {
            var presenter = new MetricPresenter();
            _incomePresenters[i] = presenter;
            IncomeHost.Children.Add(presenter.Root);
        }

        for (int i = 0; i < MaxMetrics; i++)
        {
            var presenter = new MetricPresenter();
            _expenditurePresenters[i] = presenter;
            ExpenditureHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.FinancialOverview;

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
        RevenueValue.Text = FormatCurrency(0);
        ExpenditureValue.Text = FormatCurrency(0);
        TransferBudgetValue.Text = FormatCurrency(0);
        WageBudgetValue.Text = FormatCurrency(0);

        for (int i = 0; i < _incomePresenters.Length; i++)
        {
            _incomePresenters[i].Hide();
        }

        for (int i = 0; i < _expenditurePresenters.Length; i++)
        {
            _expenditurePresenters[i].Hide();
        }
    }

    private void OnNotification(ModuleNotification notification)
    {
        if (!string.Equals(notification.ModuleId, FinanceModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, FinanceModuleEvents.StateUpdated, StringComparison.Ordinal))
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
        var state = _module.CurrentState;
        RevenueValue.Text = FormatCurrency(state.Revenue);
        ExpenditureValue.Text = FormatCurrency(state.Expenditure);
        TransferBudgetValue.Text = FormatCurrency(state.TransferBudget);
        WageBudgetValue.Text = FormatCurrency(state.WageBudget);

        var incomeSpan = _incomeBuffer.AsSpan();
        int incomeCount = _module.CopyIncome(incomeSpan);
        for (int i = 0; i < incomeCount; i++)
        {
            ref readonly var view = ref incomeSpan[i];
            var presenter = _incomePresenters[i];
            presenter.Set(view.Label, view.CurrentValue, view.ProjectedValue);
            presenter.Show();
        }

        for (int i = incomeCount; i < _incomePresenters.Length; i++)
        {
            _incomePresenters[i].Hide();
        }

        var expenditureSpan = _expenditureBuffer.AsSpan();
        int expenditureCount = _module.CopyExpenditure(expenditureSpan);
        for (int i = 0; i < expenditureCount; i++)
        {
            ref readonly var view = ref expenditureSpan[i];
            var presenter = _expenditurePresenters[i];
            presenter.Set(view.Label, view.CurrentValue, view.ProjectedValue);
            presenter.Show();
        }

        for (int i = expenditureCount; i < _expenditurePresenters.Length; i++)
        {
            _expenditurePresenters[i].Hide();
        }
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

    private sealed class MetricPresenter
    {
        private readonly Border _root;
        private readonly TextBlock _label;
        private readonly TextBlock _current;
        private readonly TextBlock _projected;

        public MetricPresenter()
        {
            _label = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White);
            _current = CreateTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _projected = CreateTextBlock(12, FontWeights.Normal, Brushes.White);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });

            Grid.SetColumn(_label, 0);
            grid.Children.Add(_label);

            Grid.SetColumn(_current, 1);
            _current.HorizontalAlignment = HorizontalAlignment.Right;
            grid.Children.Add(_current);

            Grid.SetColumn(_projected, 2);
            _projected.HorizontalAlignment = HorizontalAlignment.Right;
            grid.Children.Add(_projected);

            _root = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34)),
                BorderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(4),
                Padding = new Thickness(12, 6, 12, 6),
                Child = grid,
                Visibility = Visibility.Collapsed
            };
        }

        public UIElement Root => _root;

        public void Set(string label, uint current, uint projected)
        {
            _label.Text = label;
            _current.Text = string.Format(CultureInfo.InvariantCulture, "{0}", FormatCurrency(current));
            _projected.Text = string.Format(CultureInfo.InvariantCulture, "{0}", FormatCurrency(projected));
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

        private static string FormatCurrency(uint value)
        {
            return FinanceOverviewCard.FormatCurrency(value);
        }
    }
}
