using System;
using FMUI.Wpf.Collections;

namespace FMUI.Wpf.Modules;

public sealed class FinanceModule : IGameModule
{
    public const string ModuleIdentifier = "Finance";
    private const int MetricCapacity = 8;

    private FinanceState _state;
    private readonly ArrayCollection<FinanceMetric> _incomeMetrics;
    private readonly ArrayCollection<FinanceMetric> _expenditureMetrics;
    private ModuleState _moduleState;
    private bool _dirty;

    public event EventHandler<ModuleEventArgs>? ModuleEvent;

    public FinanceModule()
    {
        _state = new FinanceState(75_000_000u, 58_000_000u, 12_500_000u, 4_750_000u);
        _incomeMetrics = new ArrayCollection<FinanceMetric>(MetricCapacity);
        _expenditureMetrics = new ArrayCollection<FinanceMetric>(MetricCapacity);
        _moduleState = ModuleState.Uninitialized;
        _dirty = false;
    }

    public ModuleState State => _moduleState;

    public string ModuleId => ModuleIdentifier;

    public FinanceState CurrentState => _state;

    public void Initialize()
    {
        if (_moduleState != ModuleState.Uninitialized)
        {
            return;
        }

        _moduleState = ModuleState.Initializing;
        SeedIncome();
        SeedExpenditure();
        _moduleState = ModuleState.Ready;
        Publish();
    }

    public void Start()
    {
        if (_moduleState == ModuleState.Ready || _moduleState == ModuleState.Paused)
        {
            _moduleState = ModuleState.Running;
        }
    }

    public void Update(GameTime gameTime)
    {
        if (_moduleState != ModuleState.Running)
        {
            return;
        }

        if ((gameTime.FrameCount & 0x7F) == 0)
        {
            AdjustForecast();
        }

        if (_dirty)
        {
            Publish();
        }
    }

    public void Stop()
    {
        if (_moduleState == ModuleState.Running)
        {
            _moduleState = ModuleState.Paused;
        }
    }

    public void Cleanup()
    {
        _incomeMetrics.Clear();
        _expenditureMetrics.Clear();
        _moduleState = ModuleState.Uninitialized;
        _dirty = false;
    }

    public void LoadData()
    {
        // Placeholder for persistence.
    }

    public void SaveData()
    {
        // Placeholder for persistence.
    }

    public int CopyIncome(Span<FinanceMetricView> destination)
    {
        return CopyMetrics(_incomeMetrics.AsSpan(), destination);
    }

    public int CopyExpenditure(Span<FinanceMetricView> destination)
    {
        return CopyMetrics(_expenditureMetrics.AsSpan(), destination);
    }

    private static int CopyMetrics(ReadOnlySpan<FinanceMetric> source, Span<FinanceMetricView> destination)
    {
        int length = source.Length;
        if (length == 0)
        {
            return 0;
        }

        if (length > destination.Length)
        {
            length = destination.Length;
        }

        for (int i = 0; i < length; i++)
        {
            ref readonly var metric = ref source[i];
            destination[i] = new FinanceMetricView(metric.Label, metric.CurrentValue, metric.ProjectedValue);
        }

        return length;
    }

    private void AdjustForecast()
    {
        var incomeSpan = _incomeMetrics.AsSpan();
        for (int i = 0; i < incomeSpan.Length; i++)
        {
            ref var metric = ref incomeSpan[i];
            metric.ProjectedValue = (uint)(metric.CurrentValue + (metric.CurrentValue / 20));
        }

        var expenseSpan = _expenditureMetrics.AsSpan();
        for (int i = 0; i < expenseSpan.Length; i++)
        {
            ref var metric = ref expenseSpan[i];
            metric.ProjectedValue = (uint)(metric.CurrentValue + (metric.CurrentValue / 15));
        }

        _dirty = true;
    }

    private void Publish()
    {
        _dirty = false;
        ModuleEvent?.Invoke(this, new ModuleEventArgs
        {
            EventType = FinanceModuleEvents.StateUpdated,
            Data = null
        });
    }

    private void SeedIncome()
    {
        _incomeMetrics.Clear();
        AddIncome("Sponsorship", 26_000_000u, 27_500_000u);
        AddIncome("Broadcast", 32_000_000u, 33_250_000u);
        AddIncome("Matchday", 9_500_000u, 10_000_000u);
        AddIncome("Merchandising", 7_250_000u, 7_800_000u);
    }

    private void AddIncome(string label, uint current, uint projected)
    {
        ref var metric = ref _incomeMetrics.AddReference();
        metric.Label = label;
        metric.CurrentValue = current;
        metric.ProjectedValue = projected;
    }

    private void SeedExpenditure()
    {
        _expenditureMetrics.Clear();
        AddExpense("Wages", 24_000_000u, 25_500_000u);
        AddExpense("Bonuses", 6_500_000u, 7_000_000u);
        AddExpense("Scouting", 2_100_000u, 2_250_000u);
        AddExpense("Facilities", 4_750_000u, 5_200_000u);
    }

    private void AddExpense(string label, uint current, uint projected)
    {
        ref var metric = ref _expenditureMetrics.AddReference();
        metric.Label = label;
        metric.CurrentValue = current;
        metric.ProjectedValue = projected;
    }

    private struct FinanceMetric
    {
        public string Label;
        public uint CurrentValue;
        public uint ProjectedValue;
    }

    public readonly struct FinanceState
    {
        public FinanceState(uint revenue, uint expenditure, uint transferBudget, uint wageBudget)
        {
            Revenue = revenue;
            Expenditure = expenditure;
            TransferBudget = transferBudget;
            WageBudget = wageBudget;
        }

        public uint Revenue { get; }
        public uint Expenditure { get; }
        public uint TransferBudget { get; }
        public uint WageBudget { get; }
    }

    public readonly struct FinanceMetricView
    {
        public FinanceMetricView(string label, uint currentValue, uint projectedValue)
        {
            Label = label;
            CurrentValue = currentValue;
            ProjectedValue = projectedValue;
        }

        public string Label { get; }
        public uint CurrentValue { get; }
        public uint ProjectedValue { get; }
    }
}

public static class FinanceModuleEvents
{
    public const string StateUpdated = "Finance.StateUpdated";
}
