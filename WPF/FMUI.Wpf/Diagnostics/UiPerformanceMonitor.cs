using System;
using System.Diagnostics;
using System.Windows.Media;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.Diagnostics;

public sealed class UiPerformanceMonitor : IDisposable
{
    private readonly IEventAggregator _eventAggregator;
    private readonly UiPerformanceOptions _options;
    private readonly Process _process;
    private readonly double[] _frameHistory;
    private readonly Stopwatch _frameTimer;
    private UiPerformanceSnapshot _lastSnapshot;
    private double _frameSum;
    private double _frameMax;
    private int _historyIndex;
    private int _sampleCount;
    private bool _historyFilled;
    private bool _isRunning;
    private int _lastGen0;
    private int _lastGen1;
    private int _lastGen2;
    private int _accumulatedGen0;
    private int _accumulatedGen1;
    private int _accumulatedGen2;
    private int _windowFrames;

    public UiPerformanceMonitor(IEventAggregator eventAggregator, UiPerformanceOptions options)
    {
        _eventAggregator = eventAggregator;
        _options = options;
        _process = Process.GetCurrentProcess();
        _frameHistory = new double[options.HistoryLength];
        _frameTimer = Stopwatch.StartNew();
        _lastSnapshot = new UiPerformanceSnapshot(
            lastFrameMilliseconds: 0d,
            averageFrameMilliseconds: 0d,
            maxFrameMilliseconds: 0d,
            warningFrameMilliseconds: _options.WarningFrameBudgetMilliseconds,
            gen0Collections: 0,
            gen1Collections: 0,
            gen2Collections: 0,
            workingSetBytes: _process.WorkingSet64,
            managedMemoryBytes: GC.GetTotalMemory(false));
    }

    public void Start()
    {
        if (_isRunning)
        {
            return;
        }

        _frameTimer.Restart();
        _historyIndex = 0;
        _sampleCount = 0;
        _frameSum = 0d;
        _frameMax = 0d;
        _historyFilled = false;
        _accumulatedGen0 = 0;
        _accumulatedGen1 = 0;
        _accumulatedGen2 = 0;
        _windowFrames = 0;
        _lastGen0 = GC.CollectionCount(0);
        _lastGen1 = GC.CollectionCount(1);
        _lastGen2 = GC.CollectionCount(2);

        CompositionTarget.Rendering += OnRendering;
        _isRunning = true;
    }

    public void Stop()
    {
        if (!_isRunning)
        {
            return;
        }

        CompositionTarget.Rendering -= OnRendering;
        _isRunning = false;
    }

    public UiPerformanceSnapshot GetSnapshot() => _lastSnapshot;

    public void Dispose()
    {
        Stop();
        _process.Dispose();
    }

    private void OnRendering(object? sender, EventArgs e)
    {
        var elapsed = _frameTimer.Elapsed.TotalMilliseconds;
        _frameTimer.Restart();

        if (elapsed <= 0d)
        {
            elapsed = 0.0001d;
        }

        RecordFrame(elapsed);

        var currentGen0 = GC.CollectionCount(0);
        var currentGen1 = GC.CollectionCount(1);
        var currentGen2 = GC.CollectionCount(2);

        var gen0Delta = currentGen0 - _lastGen0;
        var gen1Delta = currentGen1 - _lastGen1;
        var gen2Delta = currentGen2 - _lastGen2;

        _lastGen0 = currentGen0;
        _lastGen1 = currentGen1;
        _lastGen2 = currentGen2;

        _accumulatedGen0 += gen0Delta;
        _accumulatedGen1 += gen1Delta;
        _accumulatedGen2 += gen2Delta;
        _windowFrames++;

        var shouldPublish = elapsed > _options.FrameBudgetMilliseconds || gen2Delta > 0;

        if (_windowFrames >= _options.GcSampleWindow || shouldPublish)
        {
            var snapshot = CaptureSnapshot(elapsed);
            _lastSnapshot = snapshot;

            if (shouldPublish || snapshot.AverageFrameMilliseconds > _options.WarningFrameBudgetMilliseconds)
            {
                _eventAggregator.Publish(new UiPerformanceBudgetExceededEvent(snapshot));
            }

            ResetWindow();
        }
    }

    private void RecordFrame(double elapsed)
    {
        var previous = _frameHistory[_historyIndex];

        if (_historyFilled)
        {
            _frameSum -= previous;
        }

        _frameHistory[_historyIndex] = elapsed;
        _frameSum += elapsed;

        if (!_historyFilled || elapsed > _frameMax)
        {
            _frameMax = elapsed;
        }
        else if (_historyFilled && Math.Abs(previous - _frameMax) < 0.0001d)
        {
            RecalculateMax();
        }

        _historyIndex++;
        if (_historyIndex >= _frameHistory.Length)
        {
            _historyIndex = 0;
            _historyFilled = true;
        }

        _sampleCount = _historyFilled ? _frameHistory.Length : _historyIndex;
        if (_sampleCount <= 0)
        {
            _sampleCount = 1;
        }
    }

    private void RecalculateMax()
    {
        var max = 0d;
        var limit = _historyFilled ? _frameHistory.Length : _historyIndex;
        for (var i = 0; i < limit; i++)
        {
            var value = _frameHistory[i];
            if (value > max)
            {
                max = value;
            }
        }

        _frameMax = max;
    }

    private UiPerformanceSnapshot CaptureSnapshot(double lastFrameMilliseconds)
    {
        var average = _frameSum / _sampleCount;
        var workingSet = GetWorkingSet();
        var managedMemory = GC.GetTotalMemory(false);

        return new UiPerformanceSnapshot(
            lastFrameMilliseconds: lastFrameMilliseconds,
            averageFrameMilliseconds: average,
            maxFrameMilliseconds: _frameMax,
            warningFrameMilliseconds: _options.WarningFrameBudgetMilliseconds,
            gen0Collections: _accumulatedGen0,
            gen1Collections: _accumulatedGen1,
            gen2Collections: _accumulatedGen2,
            workingSetBytes: workingSet,
            managedMemoryBytes: managedMemory);
    }

    private void ResetWindow()
    {
        _accumulatedGen0 = 0;
        _accumulatedGen1 = 0;
        _accumulatedGen2 = 0;
        _windowFrames = 0;
    }

    private long GetWorkingSet()
    {
        _process.Refresh();
        return _process.WorkingSet64;
    }
}
