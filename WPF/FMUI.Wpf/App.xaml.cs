using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using FMUI.Wpf.Diagnostics;
using FMUI.Wpf.Modules;
using FMUI.Wpf.Views;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FMUI.Wpf;

public partial class App : Application
{
    private IHost? _host;

    public static IServiceProvider ServiceProvider
    {
        get
        {
            if (Current is not App app || app._host is null)
            {
                throw new InvalidOperationException("Application host is not initialized.");
            }

            return app._host.Services;
        }
    }

    protected override async void OnStartup(StartupEventArgs e)
    {
        ShutdownMode = ShutdownMode.OnExplicitShutdown;
        base.OnStartup(e);

        _host = AppHostBuilder
            .Create(e.Args)
            .Build();

        await _host.StartAsync().ConfigureAwait(true);

        var turnService = _host.Services.GetRequiredService<ITurnService>();
        await turnService.InitializeAsync(CancellationToken.None).ConfigureAwait(true);

        var performanceMonitor = _host.Services.GetRequiredService<UiPerformanceMonitor>();
        performanceMonitor.Start();

        var mainWindow = _host.Services.GetRequiredService<MainWindow>();
        MainWindow = mainWindow;
        ShutdownMode = ShutdownMode.OnMainWindowClose;
        mainWindow.Show();
    }

    protected override async void OnExit(ExitEventArgs e)
    {
        if (_host is not null)
        {
            try
            {
                var turnService = _host.Services.GetRequiredService<ITurnService>();
                turnService.Shutdown();

                var performanceMonitor = _host.Services.GetRequiredService<UiPerformanceMonitor>();
                performanceMonitor.Stop();

                await _host.StopAsync(TimeSpan.FromSeconds(5)).ConfigureAwait(true);
            }
            finally
            {
                _host.Dispose();
                _host = null;
            }
        }

        base.OnExit(e);
    }

}
