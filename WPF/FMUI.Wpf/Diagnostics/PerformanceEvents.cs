namespace FMUI.Wpf.Diagnostics;

public readonly struct UiPerformanceSnapshot
{
    public UiPerformanceSnapshot(
        double lastFrameMilliseconds,
        double averageFrameMilliseconds,
        double maxFrameMilliseconds,
        double warningFrameMilliseconds,
        int gen0Collections,
        int gen1Collections,
        int gen2Collections,
        long workingSetBytes,
        long managedMemoryBytes)
    {
        LastFrameMilliseconds = lastFrameMilliseconds;
        AverageFrameMilliseconds = averageFrameMilliseconds;
        MaxFrameMilliseconds = maxFrameMilliseconds;
        WarningFrameMilliseconds = warningFrameMilliseconds;
        Gen0Collections = gen0Collections;
        Gen1Collections = gen1Collections;
        Gen2Collections = gen2Collections;
        WorkingSetBytes = workingSetBytes;
        ManagedMemoryBytes = managedMemoryBytes;
    }

    public double LastFrameMilliseconds { get; }

    public double AverageFrameMilliseconds { get; }

    public double MaxFrameMilliseconds { get; }

    public double WarningFrameMilliseconds { get; }

    public int Gen0Collections { get; }

    public int Gen1Collections { get; }

    public int Gen2Collections { get; }

    public long WorkingSetBytes { get; }

    public long ManagedMemoryBytes { get; }
}

public readonly struct UiPerformanceBudgetExceededEvent
{
    public UiPerformanceBudgetExceededEvent(UiPerformanceSnapshot snapshot)
    {
        Snapshot = snapshot;
    }

    public UiPerformanceSnapshot Snapshot { get; }
}
