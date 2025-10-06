using System;
using System.IO;
using System.Windows;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
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

    public IServiceProvider Services => _host?.Services
        ?? throw new InvalidOperationException("The application host has not been initialized.");

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
