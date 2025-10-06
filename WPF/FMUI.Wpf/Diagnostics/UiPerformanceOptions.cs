using System;

namespace FMUI.Wpf.Diagnostics;

public sealed class UiPerformanceOptions
{
    public UiPerformanceOptions(
        double frameBudgetMilliseconds = 16.6,
        double warningFrameBudgetMilliseconds = 12.0,
        int historyLength = 240,
        int gcSampleWindow = 60)
    {
        if (frameBudgetMilliseconds <= 0d)
        {
            throw new ArgumentOutOfRangeException(nameof(frameBudgetMilliseconds));
        }

        if (warningFrameBudgetMilliseconds <= 0d || warningFrameBudgetMilliseconds > frameBudgetMilliseconds)
        {
            throw new ArgumentOutOfRangeException(nameof(warningFrameBudgetMilliseconds));
        }

        if (historyLength <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(historyLength));
        }

        if (gcSampleWindow <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(gcSampleWindow));
        }

        FrameBudgetMilliseconds = frameBudgetMilliseconds;
        WarningFrameBudgetMilliseconds = warningFrameBudgetMilliseconds;
        HistoryLength = historyLength;
        GcSampleWindow = gcSampleWindow;
    }

    public double FrameBudgetMilliseconds { get; }

    public double WarningFrameBudgetMilliseconds { get; }

    public int HistoryLength { get; }

    public int GcSampleWindow { get; }
}
