using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;

namespace FMUI.Wpf.Services;

public interface IUiPerformanceMonitor
{
    void Record(string scope, string metric, TimeSpan duration, int? sampleSize = null);

    IDisposable Measure(string scope, string metric, int? sampleSize = null);

    IReadOnlyList<UiPerformanceSample> GetRecentSamples();
}

public sealed class UiPerformanceMonitor : IUiPerformanceMonitor
{
    private const int MaxSamples = 256;

    private readonly ConcurrentQueue<UiPerformanceSample> _samples = new();
    private readonly object _sync = new();

    public void Record(string scope, string metric, TimeSpan duration, int? sampleSize = null)
    {
        var sample = new UiPerformanceSample(
            scope,
            metric,
            duration,
            sampleSize,
            DateTimeOffset.UtcNow);

        lock (_sync)
        {
            _samples.Enqueue(sample);
            while (_samples.Count > MaxSamples && _samples.TryDequeue(out _))
            {
            }
        }

        Debug.WriteLine($"[UI PERF] {scope}:{metric} — {duration.TotalMilliseconds:F2} ms (n={sampleSize?.ToString() ?? "-"})");
    }

    public IDisposable Measure(string scope, string metric, int? sampleSize = null) =>
        new Measurement(this, scope, metric, sampleSize);

    public IReadOnlyList<UiPerformanceSample> GetRecentSamples()
    {
        return _samples.ToArray();
    }

    private sealed class Measurement : IDisposable
    {
        private readonly UiPerformanceMonitor _monitor;
        private readonly string _scope;
        private readonly string _metric;
        private readonly int? _sampleSize;
        private readonly Stopwatch _stopwatch;
        private int _disposed;

        public Measurement(UiPerformanceMonitor monitor, string scope, string metric, int? sampleSize)
        {
            _monitor = monitor;
            _scope = scope;
            _metric = metric;
            _sampleSize = sampleSize;
            _stopwatch = Stopwatch.StartNew();
        }

        public void Dispose()
        {
            if (Interlocked.Exchange(ref _disposed, 1) == 1)
            {
                return;
            }

            _stopwatch.Stop();
            _monitor.Record(_scope, _metric, _stopwatch.Elapsed, _sampleSize);
        }
    }
}

public readonly record struct UiPerformanceSample(
    string Scope,
    string Metric,
    TimeSpan Duration,
    int? SampleSize,
    DateTimeOffset Timestamp);
