using System;
using System.Globalization;

namespace FMUI.Wpf.DiagnosticsRunner;

public static class DiagnosticsReporter
{
    public static void PrintReport(SliceMigrationReport report)
    {
        if (report is null)
        {
            return;
        }

        Console.WriteLine("[Harness] Slice migration diagnostics generated at " + report.GeneratedUtc.ToString("u", CultureInfo.InvariantCulture));
        Console.WriteLine("[Harness] Mode: " + report.Mode);
        Console.WriteLine("[Harness] Slices processed: " + report.Records.Length);
    }

    public static void PrintComparison(DiagnosticsComparisonResult result)
    {
        if (result is null)
        {
            return;
        }

        if (result.MissingBaselineSlices > 0)
        {
            Console.WriteLine("[Harness] Warning: Missing baseline entries for " + result.MissingBaselineSlices + " slices.");
        }

        var regressions = result.Regressions;
        if (regressions.Length == 0)
        {
            Console.WriteLine("[Harness] No performance regressions detected.");
            return;
        }

        Console.WriteLine("[Harness] Potential regressions detected:");
        for (var i = 0; i < regressions.Length; i++)
        {
            var regression = regressions[i];
            var slice = regression.Slice;
            var message = string.Concat(
                "  • ",
                slice.Tab,
                ":",
                slice.Section,
                " | Avg Frame Δ=",
                regression.FrameDeltaPercentage.ToString("F2", CultureInfo.InvariantCulture),
                "% (",
                regression.BaselineAverage.ToString("F3", CultureInfo.InvariantCulture),
                "→",
                regression.CurrentAverage.ToString("F3", CultureInfo.InvariantCulture),
                ")",
                " | Gen2=",
                regression.BaselineGen2.ToString(CultureInfo.InvariantCulture),
                "→",
                regression.CurrentGen2.ToString(CultureInfo.InvariantCulture));

            if (regression.FrameBudgetExceeded)
            {
                message = string.Concat(message, " [Frame]");
            }

            if (regression.Gen2BudgetExceeded)
            {
                message = string.Concat(message, " [GC]");
            }

            Console.WriteLine(message);
        }
    }
}
