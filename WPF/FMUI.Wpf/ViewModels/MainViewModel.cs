using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class MainViewModel : ObservableObject
{
    private NavigationTabViewModel? _selectedTab;

    public MainViewModel(
        INavigationCatalog navigationCatalog,
        Func<NavigationTab, NavigationTabViewModel> tabFactory,
        CardSurfaceViewModel cardSurface)
    {
        CardSurface = cardSurface;

        var tabs = navigationCatalog
            .GetTabs()
            .Select(tabFactory)
            .ToList();

        Tabs = new ObservableCollection<NavigationTabViewModel>(tabs);

        SelectTabCommand = new RelayCommand(param =>
        {
            if (param is NavigationTabViewModel tab)
            {
                SelectTab(tab);
            }
        });

        if (Tabs.Count > 0)
        {
            SelectTab(Tabs[0]);
        }
    }

    public ObservableCollection<NavigationTabViewModel> Tabs { get; }

    public NavigationTabViewModel? SelectedTab
    {
        get => _selectedTab;
        private set => SetProperty(ref _selectedTab, value);
    }

    public CardSurfaceViewModel CardSurface { get; }

    public ICommand SelectTabCommand { get; }

    private void SelectTab(NavigationTabViewModel tab)
    {
        if (SelectedTab == tab)
        {
            tab.EnsureActiveSectionBroadcast();
            return;
        }

        foreach (var t in Tabs)
        {
            t.IsSelected = ReferenceEquals(t, tab);
        }

        SelectedTab = tab;
    }
}
