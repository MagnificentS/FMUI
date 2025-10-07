using System;
using System.IO;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Modules;
using FMUI.Wpf.Services;
using FMUI.Wpf.ViewModels;
using FMUI.Wpf.Views;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace FMUI.Wpf.Infrastructure.Hosting;

public static class AppHostBuilder
{
    public static IHostBuilder Create(string[] args)
    {
        return Host.CreateDefaultBuilder(args).ConfigureServices(ConfigureServices);
    }

    public static void ConfigureServices(HostBuilderContext context, IServiceCollection services)
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
        services.AddSingleton<ICardLayoutCatalog, CardLayoutCatalog>();
        services.AddSingleton<IModuleCardLayoutProvider, ModuleCardLayoutProvider>();
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
        services.AddSingleton<ICardInteractionBehavior>(provider =>
            (ICardInteractionBehavior)provider.GetRequiredService<ICardInteractionService>());
        services.AddSingleton<ICardSelectionBehavior>(provider =>
            (ICardSelectionBehavior)provider.GetRequiredService<ICardInteractionService>());
        services.AddSingleton<ICardGeometryManager>(provider =>
            (ICardGeometryManager)provider.GetRequiredService<ICardInteractionService>());

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
