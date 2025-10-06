using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using FMUI.Wpf.Database;
using FMUI.Wpf.Diagnostics;
using FMUI.Wpf.Events;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Modules;
using FMUI.Wpf.Services;
using FMUI.Wpf.ViewModels;
using FMUI.Wpf.Views;
using FMUI.Wpf.Views.Squad;
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

    private static void ConfigureServices(HostBuilderContext context, IServiceCollection services)
    {
        var baseDirectory = AppContext.BaseDirectory;
        var dataDirectory = Path.Combine(baseDirectory, "data");
        Directory.CreateDirectory(dataDirectory);

        var playerDatabasePath = Path.Combine(dataDirectory, "players.db");
        var firstNamesPath = Path.Combine(dataDirectory, "firstnames.bin");
        var lastNamesPath = Path.Combine(dataDirectory, "lastnames.bin");

        services.AddSingleton(new StringDatabaseOptions(firstNamesPath, lastNamesPath));
        services.AddSingleton<PlayerDatabase>(_ => new PlayerDatabase(playerDatabasePath));
        services.AddSingleton<StringDatabase>();
        services.AddSingleton<SquadService>();
        services.AddSingleton<FormationService>();

        services.AddSingleton<EventSystem>();
        services.AddSingleton(new UiPerformanceOptions());
        services.AddSingleton<UiPerformanceMonitor>();

        services.AddSingleton<ModuleHost>();
        services.AddSingleton<ITurnService, TurnService>();

        services.AddSingleton<TransferModule>();
        services.AddSingleton<FinanceModule>();
        services.AddSingleton<ScoutingModule>();
        services.AddSingleton<MedicalModule>();
        services.AddSingleton<TrainingModule>();
        services.AddSingleton<MediaModule>();
        services.AddSingleton<CompetitionModule>();

        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<TransferModule>());
        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<FinanceModule>());
        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<ScoutingModule>());
        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<MedicalModule>());
        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<TrainingModule>());
        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<MediaModule>());
        services.AddSingleton<IGameModule>(provider => provider.GetRequiredService<CompetitionModule>());

        services.AddSingleton<IEventAggregator, EventAggregator>();
        services.AddSingleton<IClubDataService, ClubDataService>();
        services.AddSingleton<ISquadService, SquadService>();
        services.AddSingleton<ICardLayoutCatalog, CardLayoutCatalog>();
        services.AddSingleton<ICardEditorCatalog, CardEditorCatalog>();
        services.AddSingleton<INavigationCatalog, NavigationCatalog>();
        services.AddSingleton<INavigationPermissionService, NavigationPermissionService>();
        services.AddSingleton<INavigationIndicatorService, NavigationIndicatorService>();
        services.AddSingleton<IUiPerformanceMonitor, UiPerformanceMonitor>();
        services.AddSingleton<ISquadCardDescriptorAdapter, SquadCardDescriptorAdapter>();
        services.AddSingleton<SquadCardContentPool>();
        services.AddSingleton(provider =>
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            var storagePath = Path.Combine(appData, "FMUI", "layout-state.json");
            return new CardLayoutStateOptions(storagePath);
        });
        services.AddSingleton<ICardLayoutStatePersistence, FileCardLayoutStatePersistence>();
        services.AddSingleton<ICardLayoutStateService, CardLayoutStateService>();
        services.AddSingleton<ICardInteractionService, CardInteractionService>();

        services.AddSingleton<CardFactory>();

        services.AddSingleton<CardSurfaceViewModel>();
        services.AddSingleton<MainViewModel>();

        services.AddTransient<Func<string, NavigationSubItem, NavigationSubItemViewModel>>(provider =>
        {
            var indicatorService = provider.GetRequiredService<INavigationIndicatorService>();
            var permissionService = provider.GetRequiredService<INavigationPermissionService>();
            return (tabId, subItem) => new NavigationSubItemViewModel(subItem, tabId, indicatorService, permissionService);
        });

        services.AddTransient<Func<NavigationTab, NavigationTabViewModel>>(provider =>
        {
            var aggregator = provider.GetRequiredService<IEventAggregator>();
            var subItemFactory = provider.GetRequiredService<Func<string, NavigationSubItem, NavigationSubItemViewModel>>();
            var permissionService = provider.GetRequiredService<INavigationPermissionService>();
            return tab => new NavigationTabViewModel(tab, aggregator, subItemFactory, permissionService);
        });

        services.AddSingleton<MainWindow>();
    }
}
