using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;
using FMUI.Wpf.Infrastructure.Diagnostics;
using FMUI.Wpf.Infrastructure.Hosting;
using FMUI.Wpf.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FMUI.Wpf.DiagnosticsRunner;

internal static class Program
{
    private static int Main(string[] args)
    {
        var completion = new TaskCompletionSource<int>();
        var thread = new Thread(() => RunStaThread(args, completion))
        {
            IsBackground = false,
            Name = "UiDiagnosticsHarness"
        };
        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();

        return completion.Task.GetAwaiter().GetResult();
    }

    private static void RunStaThread(string[] args, TaskCompletionSource<int> completion)
    {
        var dispatcher = Dispatcher.CurrentDispatcher;
        SynchronizationContext.SetSynchronizationContext(new DispatcherSynchronizationContext(dispatcher));

        dispatcher.InvokeAsync(async () =>
        {
            try
            {
                var exitCode = await RunAsync(args).ConfigureAwait(true);
                completion.TrySetResult(exitCode);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("[Harness] Fatal error: " + ex);
                completion.TrySetResult(1);
            }
            finally
            {
                dispatcher.BeginInvokeShutdown(DispatcherPriority.Background);
            }
        });

        Dispatcher.Run();
    }

    private static async Task<int> RunAsync(string[] args)
    {
        HarnessOptions options;
        try
        {
            options = HarnessCli.Parse(args);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("[Harness] " + ex.Message);
            return 1;
        }

        using var cts = new CancellationTokenSource(options.Timeout);
        Console.CancelKeyPress += (_, eventArgs) =>
        {
            eventArgs.Cancel = true;
            cts.Cancel();
        };

        using var host = AppHostBuilder.Create(Array.Empty<string>()).Build();
        await host.StartAsync(cts.Token).ConfigureAwait(true);

        var navigationCatalog = host.Services.GetRequiredService<INavigationCatalog>();
        var layoutCatalog = host.Services.GetRequiredService<ICardLayoutCatalog>();

        var monitorOptions = new UiPerformanceMonitorOptions
        {
            FrameInterval = TimeSpan.FromMilliseconds(options.FrameIntervalMilliseconds),
            SampleCapacity = options.SampleCapacity
        };

        using var monitor = new UiPerformanceMonitor(Dispatcher.CurrentDispatcher, monitorOptions);
        monitor.StartHeadless();

        var benchmark = new SliceMigrationBenchmark(navigationCatalog, layoutCatalog, monitor);
        var scenarioOptions = new SliceMigrationHarnessOptions
        {
            BeforeSampleFrames = options.BeforeSampleFrames,
            AfterSampleFrames = options.AfterSampleFrames
        };

        SliceMigrationReport report;
        try
        {
            report = await benchmark.ExecuteAsync(scenarioOptions, cts.Token).ConfigureAwait(true);
        }
        catch (OperationCanceledException)
        {
            Console.Error.WriteLine("[Harness] Execution cancelled.");
            return 2;
        }

        DiagnosticsReporter.PrintReport(report);

        var writer = new DiagnosticsBaselineWriter(options.DiagnosticsRoot);
        var baseline = writer.TryLoadBaseline();

        if (baseline is not null)
        {
            var comparer = new DiagnosticsBaselineComparer(options.FrameVariancePercentage, options.AllowedGen2Growth);
            var comparison = comparer.Compare(baseline, report);
            DiagnosticsReporter.PrintComparison(comparison);

            if (options.EnforceBaseline && comparison.HasRegression)
            {
                Console.Error.WriteLine("[Harness] Regression detected. Baseline enforcement active.");
                await writer.WriteBaselineAsync(report, cts.Token).ConfigureAwait(true);
                await host.StopAsync(TimeSpan.FromSeconds(5)).ConfigureAwait(true);
                return 3;
            }
        }
        else
        {
            Console.WriteLine("[Harness] Baseline not found. Creating a new baseline file.");
        }

        await writer.WriteBaselineAsync(report, cts.Token).ConfigureAwait(true);
        await host.StopAsync(TimeSpan.FromSeconds(5)).ConfigureAwait(true);
        return 0;
    }
}
