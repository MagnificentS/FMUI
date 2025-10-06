using System;
using System.IO;
using System.Windows;
using System.Collections.Generic;
using FMUI.Wpf.Configuration;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;
using FMUI.Wpf.ViewModels;
using FMUI.Wpf.Views;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FMUI.Wpf;

public partial class App : Application
{
    private IHost? _host;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        _host = Host.CreateDefaultBuilder(e.Args)
            .ConfigureServices(ConfigureServices)
            .Build();

        _host.StartAsync().GetAwaiter().GetResult();

        var mainWindow = _host.Services.GetRequiredService<MainWindow>();
        mainWindow.Show();
    }

    protected override void OnExit(ExitEventArgs e)
    {
        if (_host is not null)
        {
            _host.StopAsync(TimeSpan.FromSeconds(5)).GetAwaiter().GetResult();
            _host.Dispose();
            _host = null;
        }

        base.OnExit(e);
    }

    private static void ConfigureServices(HostBuilderContext context, IServiceCollection services)
    {
        services.AddSingleton<IEventAggregator, EventAggregator>();
        services.AddSingleton<IClubDataService, ClubDataService>();
        services.AddSingleton<IModuleSnapshotProvider, ModuleSnapshotProvider>();

        var navigationLocalization = NavigationLocalizationConfig.CreateDefault();
        var indicatorLocalization = IndicatorLocalizationConfig.CreateDefault();
        services.AddSingleton(navigationLocalization);
        services.AddSingleton(indicatorLocalization);

        var resources = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var pair in NavigationLocalizationConfig.GetResources(navigationLocalization))
        {
            resources[pair.Key] = pair.Value;
        }

        foreach (var pair in IndicatorLocalizationConfig.GetResources(indicatorLocalization))
        {
            resources[pair.Key] = pair.Value;
        }

        services.AddSingleton<IStringDatabase>(new StringDatabase(resources));
        services.AddSingleton<ICardLayoutCatalog, CardLayoutCatalog>();
        services.AddSingleton<ICardEditorCatalog, CardEditorCatalog>();
        services.AddSingleton<INavigationCatalog, NavigationCatalog>();
        services.AddSingleton<INavigationPermissionService, NavigationPermissionService>();
        services.AddSingleton<INavigationIndicatorService, NavigationIndicatorService>();
        services.AddSingleton(provider =>
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            var storagePath = Path.Combine(appData, "FMUI", "layout-state.json");
            return new CardLayoutStateOptions(storagePath);
        });
        services.AddSingleton<ICardLayoutStatePersistence, FileCardLayoutStatePersistence>();
        services.AddSingleton<ICardLayoutStateService, CardLayoutStateService>();
        services.AddSingleton<ICardInteractionService, CardInteractionService>();

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
