using System;
using System.Threading;
using System.Threading.Tasks;
using FMUI.Wpf.Infrastructure.Diagnostics;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.DiagnosticsRunner;

public sealed class SliceMigrationBenchmark
{
    private readonly INavigationCatalog _navigationCatalog;
    private readonly ICardLayoutCatalog _layoutCatalog;
    private readonly UiPerformanceMonitor _monitor;

    public SliceMigrationBenchmark(
        INavigationCatalog navigationCatalog,
        ICardLayoutCatalog layoutCatalog,
        UiPerformanceMonitor monitor)
    {
        _navigationCatalog = navigationCatalog ?? throw new ArgumentNullException(nameof(navigationCatalog));
        _layoutCatalog = layoutCatalog ?? throw new ArgumentNullException(nameof(layoutCatalog));
        _monitor = monitor ?? throw new ArgumentNullException(nameof(monitor));
    }

    public async Task<SliceMigrationReport> ExecuteAsync(SliceMigrationHarnessOptions options, CancellationToken cancellationToken)
    {
        if (options is null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        var tabs = _navigationCatalog.GetTabs();
        var sliceCount = CountSlices(tabs);
        var records = new SliceMigrationRecord[sliceCount];
        var recordIndex = 0;

        for (var tabIndex = 0; tabIndex < tabs.Count; tabIndex++)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var tab = tabs[tabIndex];
            var subItems = tab.SubItems;
            for (var subIndex = 0; subIndex < subItems.Count; subIndex++)
            {
                cancellationToken.ThrowIfCancellationRequested();
                var subItem = subItems[subIndex];
                var slice = new SliceIdentifier(tab.Identifier, subItem.Identifier);

                _monitor.ResetSamples();
                await _monitor.WaitForSamplesAsync(options.BeforeSampleFrames, cancellationToken).ConfigureAwait(true);
                var before = _monitor.CaptureSnapshot(CreateLabel(slice, "before"));

                SimulateMigration(slice);

                _monitor.ResetSamples();
                await _monitor.WaitForSamplesAsync(options.AfterSampleFrames, cancellationToken).ConfigureAwait(true);
                var after = _monitor.CaptureSnapshot(CreateLabel(slice, "after"));

                records[recordIndex] = new SliceMigrationRecord(slice, before, after);
                recordIndex++;
            }
        }

        return new SliceMigrationReport(DateTime.UtcNow, records, _monitor.Mode);
    }

    private void SimulateMigration(SliceIdentifier slice)
    {
        if (!_layoutCatalog.TryGetLayout(slice.Tab, slice.Section, out var layout))
        {
            throw new InvalidOperationException(string.Concat("Layout not found for ", slice.Tab, ":", slice.Section));
        }

        var cards = layout.Cards;
        var count = cards.Count;
        for (var i = 0; i < count; i++)
        {
            var card = cards[i];
            _ = card.Id;
            _ = card.Title;
            _ = card.Kind;
        }
    }

    private static int CountSlices(System.Collections.Generic.IReadOnlyList<NavigationTab> tabs)
    {
        var total = 0;
        for (var i = 0; i < tabs.Count; i++)
        {
            var subItems = tabs[i].SubItems;
            total += subItems.Count;
        }

        return total;
    }

    private static string CreateLabel(SliceIdentifier slice, string stage)
    {
        return string.Concat(slice.Tab, ":", slice.Section, ":", stage);
    }
}

public readonly struct SliceIdentifier
{
    public SliceIdentifier(string tab, string section)
    {
        Tab = tab;
        Section = section;
    }

    public string Tab { get; }

    public string Section { get; }
}

public readonly struct SliceMigrationRecord
{
    public SliceMigrationRecord(SliceIdentifier slice, UiPerformanceSnapshot before, UiPerformanceSnapshot after)
    {
        Slice = slice;
        Before = before;
        After = after;
    }

    public SliceIdentifier Slice { get; }

    public UiPerformanceSnapshot Before { get; }

    public UiPerformanceSnapshot After { get; }
}

public sealed class SliceMigrationReport
{
    public SliceMigrationReport(DateTime generatedUtc, SliceMigrationRecord[] records, UiPerformanceMonitorMode mode)
    {
        GeneratedUtc = generatedUtc;
        Records = records;
        Mode = mode;
    }

    public DateTime GeneratedUtc { get; }

    public SliceMigrationRecord[] Records { get; }

    public UiPerformanceMonitorMode Mode { get; }
}
