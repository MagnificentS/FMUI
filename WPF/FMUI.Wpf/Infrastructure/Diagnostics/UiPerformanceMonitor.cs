using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;

namespace FMUI.Wpf.Infrastructure.Diagnostics;

public enum UiPerformanceMonitorMode
{
    Unknown = 0,
    Headless = 1,
}

public sealed class UiPerformanceMonitorOptions
{
    public UiPerformanceMonitorOptions()
    {
        FrameInterval = TimeSpan.FromMilliseconds(16.0);
        SampleCapacity = 512;
    }

    public TimeSpan FrameInterval { get; set; }

    public int SampleCapacity { get; set; }
}

public readonly struct UiFrameMetrics
{
    public UiFrameMetrics(int frameCount, double averageMilliseconds, double maxMilliseconds)
    {
        FrameCount = frameCount;
        AverageMilliseconds = averageMilliseconds;
        MaxMilliseconds = maxMilliseconds;
    }

    public int FrameCount { get; }

    public double AverageMilliseconds { get; }

    public double MaxMilliseconds { get; }
}

public readonly struct UiGcMetrics
{
    public UiGcMetrics(int gen0, int gen1, int gen2, long allocatedBytes)
    {
        Gen0Collections = gen0;
        Gen1Collections = gen1;
        Gen2Collections = gen2;
        AllocatedBytes = allocatedBytes;
    }

    public int Gen0Collections { get; }

    public int Gen1Collections { get; }

    public int Gen2Collections { get; }

    public long AllocatedBytes { get; }
}

public readonly struct UiPerformanceSnapshot
{
    public UiPerformanceSnapshot(string label, DateTime timestampUtc, UiFrameMetrics frame, UiGcMetrics gc, UiPerformanceMonitorMode mode)
    {
        Label = label;
        TimestampUtc = timestampUtc;
        Frame = frame;
        Gc = gc;
        Mode = mode;
    }

    public string Label { get; }

    public DateTime TimestampUtc { get; }

    public UiFrameMetrics Frame { get; }

    public UiGcMetrics Gc { get; }

    public UiPerformanceMonitorMode Mode { get; }
}

public sealed class UiPerformanceMonitor : IDisposable
{
    private readonly Dispatcher _dispatcher;
    private readonly UiPerformanceMonitorOptions _options;
    private readonly double[] _frameSamples;
    private readonly object _sync = new();
    private readonly Stopwatch _stopwatch = new();

    private DispatcherTimer? _timer;
    private bool _disposed;
    private bool _hasLastTick;
    private long _lastTick;
    private int _sampleCount;
    private TaskCompletionSource<bool>? _waiter;
    private int _waiterTarget;
    private GcSnapshot _gcBaseline;

    public UiPerformanceMonitor(Dispatcher dispatcher, UiPerformanceMonitorOptions options)
    {
        _dispatcher = dispatcher ?? throw new ArgumentNullException(nameof(dispatcher));
        _options = options ?? throw new ArgumentNullException(nameof(options));

        if (_options.SampleCapacity <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(options), "Sample capacity must be positive.");
        }

        if (_options.FrameInterval <= TimeSpan.Zero)
        {
            throw new ArgumentOutOfRangeException(nameof(options), "Frame interval must be greater than zero.");
        }

        _frameSamples = new double[_options.SampleCapacity];
        _gcBaseline = CaptureGcSnapshot();
        Mode = UiPerformanceMonitorMode.Unknown;
    }

    public UiPerformanceMonitorMode Mode { get; private set; }

    public void StartHeadless()
    {
        EnsureNotDisposed();
        if (Mode != UiPerformanceMonitorMode.Unknown)
        {
            return;
        }

        Mode = UiPerformanceMonitorMode.Headless;
        _stopwatch.Restart();
        _hasLastTick = false;
        _sampleCount = 0;
        _timer = new DispatcherTimer(_options.FrameInterval, DispatcherPriority.Render, OnTimerTick, _dispatcher);
        _timer.Start();
    }

    public void ResetSamples()
    {
        EnsureNotDisposed();
        lock (_sync)
        {
            _sampleCount = 0;
            _hasLastTick = false;
            _lastTick = 0;
            _waiter = null;
            _waiterTarget = 0;
            _gcBaseline = CaptureGcSnapshot();
            for (var i = 0; i < _frameSamples.Length; i++)
            {
                _frameSamples[i] = 0.0;
            }
        }
    }

    public async Task WaitForSamplesAsync(int minimumSamples, CancellationToken cancellationToken)
    {
        EnsureNotDisposed();
        if (minimumSamples <= 0)
        {
            return;
        }

        TaskCompletionSource<bool>? waiter;
        lock (_sync)
        {
            if (minimumSamples > _frameSamples.Length)
            {
                minimumSamples = _frameSamples.Length;
            }

            if (_sampleCount >= minimumSamples)
            {
                return;
            }

            if (_waiter is null || minimumSamples > _waiterTarget)
            {
                _waiterTarget = minimumSamples;
                var tcs = new TaskCompletionSource<bool>(TaskCreationOptions.RunContinuationsAsynchronously);
                if (cancellationToken.CanBeCanceled)
                {
                    cancellationToken.Register(static state =>
                    {
                        var source = (TaskCompletionSource<bool>)state!;
                        source.TrySetCanceled();
                    }, tcs);
                }

                _waiter = tcs;
            }

            waiter = _waiter;
        }

        if (waiter is not null)
        {
            await waiter.Task.ConfigureAwait(true);
        }
    }

    public UiPerformanceSnapshot CaptureSnapshot(string label)
    {
        EnsureNotDisposed();
        if (label is null)
        {
            throw new ArgumentNullException(nameof(label));
        }

        UiFrameMetrics frame;
        UiGcMetrics gc;
        lock (_sync)
        {
            frame = ComputeFrameMetrics();
            var current = CaptureGcSnapshot();
            gc = new UiGcMetrics(
                current.Gen0 - _gcBaseline.Gen0,
                current.Gen1 - _gcBaseline.Gen1,
                current.Gen2 - _gcBaseline.Gen2,
                current.AllocatedBytes - _gcBaseline.AllocatedBytes);
        }

        return new UiPerformanceSnapshot(label, DateTime.UtcNow, frame, gc, Mode);
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        if (_timer is not null)
        {
            _timer.Stop();
            _timer.Tick -= OnTimerTick;
            _timer = null;
        }
    }

    private void OnTimerTick(object? sender, EventArgs e)
    {
        if (!_stopwatch.IsRunning)
        {
            _stopwatch.Start();
        }

        var now = _stopwatch.ElapsedTicks;
        if (!_hasLastTick)
        {
            _hasLastTick = true;
            _lastTick = now;
            return;
        }

        var deltaTicks = now - _lastTick;
        _lastTick = now;
        if (deltaTicks <= 0)
        {
            return;
        }

        double frameMilliseconds = (double)deltaTicks * 1000.0 / Stopwatch.Frequency;
        TaskCompletionSource<bool>? waiterToSignal = null;
        lock (_sync)
        {
            if (_sampleCount < _frameSamples.Length)
            {
                _frameSamples[_sampleCount] = frameMilliseconds;
                _sampleCount++;
            }

            if (_waiter is not null && _sampleCount >= _waiterTarget)
            {
                waiterToSignal = _waiter;
                _waiter = null;
                _waiterTarget = 0;
            }
        }

        waiterToSignal?.TrySetResult(true);
    }

    private UiFrameMetrics ComputeFrameMetrics()
    {
        var count = _sampleCount;
        if (count == 0)
        {
            return new UiFrameMetrics(0, 0.0, 0.0);
        }

        double sum = 0.0;
        double max = 0.0;
        for (var i = 0; i < count; i++)
        {
            var sample = _frameSamples[i];
            sum += sample;
            if (sample > max)
            {
                max = sample;
            }
        }

        var average = sum / count;
        return new UiFrameMetrics(count, average, max);
    }

    private GcSnapshot CaptureGcSnapshot()
    {
        return new GcSnapshot(
            GC.CollectionCount(0),
            GC.CollectionCount(1),
            GC.CollectionCount(2),
            GC.GetTotalMemory(false));
    }

    private void EnsureNotDisposed()
    {
        if (_disposed)
        {
            throw new ObjectDisposedException(nameof(UiPerformanceMonitor));
        }
    }

    private readonly struct GcSnapshot
    {
        public GcSnapshot(int gen0, int gen1, int gen2, long allocatedBytes)
        {
            Gen0 = gen0;
            Gen1 = gen1;
            Gen2 = gen2;
            AllocatedBytes = allocatedBytes;
        }

        public int Gen0 { get; }

        public int Gen1 { get; }

        public int Gen2 { get; }

        public long AllocatedBytes { get; }
    }
}
