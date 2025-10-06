using System;

namespace FMUI.Wpf.DiagnosticsRunner;

public sealed class DiagnosticsBaselineComparer
{
    private readonly double _frameVariancePercentage;
    private readonly int _allowedGen2Growth;

    public DiagnosticsBaselineComparer(double frameVariancePercentage, int allowedGen2Growth)
    {
        if (frameVariancePercentage < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(frameVariancePercentage));
        }

        _frameVariancePercentage = frameVariancePercentage;
        _allowedGen2Growth = allowedGen2Growth;
    }

    public DiagnosticsComparisonResult Compare(SliceMigrationReport baseline, SliceMigrationReport current)
    {
        if (baseline is null)
        {
            throw new ArgumentNullException(nameof(baseline));
        }

        if (current is null)
        {
            throw new ArgumentNullException(nameof(current));
        }

        var baselineRecords = baseline.Records;
        var currentRecords = current.Records;
        var regressionCapacity = currentRecords.Length;
        var regressions = regressionCapacity > 0 ? new SliceRegression[regressionCapacity] : Array.Empty<SliceRegression>();
        var regressionCount = 0;
        var missingBaselineSlices = 0;

        for (var i = 0; i < currentRecords.Length; i++)
        {
            var currentRecord = currentRecords[i];
            var baselineIndex = FindBaselineIndex(currentRecord.Slice, baselineRecords);
            if (baselineIndex < 0)
            {
                missingBaselineSlices++;
                continue;
            }

            var baselineRecord = baselineRecords[baselineIndex];
            var baselineAverage = baselineRecord.After.Frame.AverageMilliseconds;
            var currentAverage = currentRecord.After.Frame.AverageMilliseconds;
            var frameDelta = CalculateDeltaPercentage(baselineAverage, currentAverage);
            var baselineGen2 = baselineRecord.After.Gc.Gen2Collections;
            var currentGen2 = currentRecord.After.Gc.Gen2Collections;
            var gen2Delta = currentGen2 - baselineGen2;

            var frameRegression = frameDelta > _frameVariancePercentage;
            var gcRegression = gen2Delta > _allowedGen2Growth;

            if (frameRegression || gcRegression)
            {
                if (regressionCount >= regressions.Length)
                {
                    Array.Resize(ref regressions, regressionCount + 1);
                }

                regressions[regressionCount] = new SliceRegression(
                    currentRecord.Slice,
                    baselineAverage,
                    currentAverage,
                    frameDelta,
                    baselineGen2,
                    currentGen2,
                    frameRegression,
                    gcRegression);
                regressionCount++;
            }
        }

        if (regressionCount != regressions.Length)
        {
            var trimmed = new SliceRegression[regressionCount];
            for (var i = 0; i < regressionCount; i++)
            {
                trimmed[i] = regressions[i];
            }

            regressions = trimmed;
        }

        return new DiagnosticsComparisonResult(regressions, missingBaselineSlices, currentRecords.Length);
    }

    private static int FindBaselineIndex(SliceIdentifier slice, SliceMigrationRecord[] baselineRecords)
    {
        for (var i = 0; i < baselineRecords.Length; i++)
        {
            var candidate = baselineRecords[i].Slice;
            if (string.Equals(candidate.Tab, slice.Tab, StringComparison.Ordinal) &&
                string.Equals(candidate.Section, slice.Section, StringComparison.Ordinal))
            {
                return i;
            }
        }

        return -1;
    }

    private static double CalculateDeltaPercentage(double baseline, double current)
    {
        if (baseline <= 0.000001)
        {
            return current <= 0.000001 ? 0.0 : double.PositiveInfinity;
        }

        return (current - baseline) / baseline * 100.0;
    }
}

public sealed class DiagnosticsComparisonResult
{
    public DiagnosticsComparisonResult(SliceRegression[] regressions, int missingBaselineSlices, int sliceCount)
    {
        Regressions = regressions;
        MissingBaselineSlices = missingBaselineSlices;
        SliceCount = sliceCount;
    }

    public SliceRegression[] Regressions { get; }

    public int MissingBaselineSlices { get; }

    public int SliceCount { get; }

    public bool HasRegression => MissingBaselineSlices > 0 || (Regressions.Length > 0);
}

public readonly struct SliceRegression
{
    public SliceRegression(
        SliceIdentifier slice,
        double baselineAverage,
        double currentAverage,
        double frameDeltaPercentage,
        int baselineGen2,
        int currentGen2,
        bool frameBudgetExceeded,
        bool gen2BudgetExceeded)
    {
        Slice = slice;
        BaselineAverage = baselineAverage;
        CurrentAverage = currentAverage;
        FrameDeltaPercentage = frameDeltaPercentage;
        BaselineGen2 = baselineGen2;
        CurrentGen2 = currentGen2;
        FrameBudgetExceeded = frameBudgetExceeded;
        Gen2BudgetExceeded = gen2BudgetExceeded;
    }

    public SliceIdentifier Slice { get; }

    public double BaselineAverage { get; }

    public double CurrentAverage { get; }

    public double FrameDeltaPercentage { get; }

    public int BaselineGen2 { get; }

    public int CurrentGen2 { get; }

    public bool FrameBudgetExceeded { get; }

    public bool Gen2BudgetExceeded { get; }
}
