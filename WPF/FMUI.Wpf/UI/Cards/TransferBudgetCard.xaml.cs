using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using FMUI.Wpf.Modules;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class TransferBudgetCard : UserControl, ICardContent
{
    private readonly FinanceModule _financeModule;
    private readonly IEventAggregator _eventAggregator;
    private IDisposable? _subscription;

    public TransferBudgetCard(FinanceModule financeModule, IEventAggregator eventAggregator)
    {
        _financeModule = financeModule ?? throw new ArgumentNullException(nameof(financeModule));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();
        Reset();
    }

    public CardType Type => CardType.TransferBudget;

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
        TransferBudgetValue.Text = FormatCurrency(0);
        WageBudgetValue.Text = FormatCurrency(0);
        WageUsageBar.Value = 0;
        WageUsageLabel.Text = "";
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
        var state = _financeModule.CurrentState;
        TransferBudgetValue.Text = FormatCurrency(state.TransferBudget);
        WageBudgetValue.Text = FormatCurrency(state.WageBudget);

        uint wageCapacity = state.WageBudget;
        if (wageCapacity == 0)
        {
            WageUsageBar.Value = 0;
            WageUsageLabel.Text = "No wages available";
            return;
        }

        uint currentUsage = wageCapacity / 2;
        double usagePercent = (double)currentUsage / wageCapacity * 100d;
        WageUsageBar.Value = usagePercent;
        WageUsageLabel.Text = string.Format(CultureInfo.InvariantCulture, "{0}% of wage budget committed", usagePercent.ToString("0", CultureInfo.InvariantCulture));
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
}
