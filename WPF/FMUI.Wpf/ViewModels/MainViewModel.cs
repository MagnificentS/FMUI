using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class MainViewModel : ObservableObject
{
    private NavigationTabViewModel? _selectedTab;
    private bool _isCompactHeader;
    private bool _useCompactNavigation;

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

        foreach (var tab in Tabs)
        {
            tab.PropertyChanged += OnTabPropertyChanged;
        }

        SelectTabCommand = new RelayCommand(param =>
        {
            if (param is NavigationTabViewModel tab)
            {
                SelectTab(tab);
            }
        });

        EnsureSelectedTabAvailability();
    }

    public ObservableCollection<NavigationTabViewModel> Tabs { get; }

    public NavigationTabViewModel? SelectedTab
    {
        get => _selectedTab;
        private set => SetProperty(ref _selectedTab, value);
    }

    public CardSurfaceViewModel CardSurface { get; }

    public ICommand SelectTabCommand { get; }

    public bool IsCompactHeader
    {
        get => _isCompactHeader;
        private set => SetProperty(ref _isCompactHeader, value);
    }

    public bool UseCompactNavigation
    {
        get => _useCompactNavigation;
        private set => SetProperty(ref _useCompactNavigation, value);
    }

    public void UpdateViewport(double width)
    {
        const double compactHeaderThreshold = 1500;
        const double compactNavigationThreshold = 1320;

        IsCompactHeader = width < compactHeaderThreshold;
        UseCompactNavigation = width < compactNavigationThreshold;
    }

    private void SelectTab(NavigationTabViewModel tab)
    {
        if (!tab.IsVisible || !tab.HasVisibleSubItems)
        {
            EnsureSelectedTabAvailability();
            return;
        }

        if (SelectedTab == tab)
        {
            tab.EnsureActiveSectionBroadcast();
            return;
        }

        var active = tab.ActiveSubItem;
        if (active is null || !active.IsVisible)
        {
            var fallback = tab.SubItems.FirstOrDefault(item => item.IsVisible);
            if (fallback is not null)
            {
                tab.ActivateSubItem(fallback);
            }
        }

        foreach (var t in Tabs)
        {
            t.IsSelected = ReferenceEquals(t, tab);
        }

        SelectedTab = tab;
        tab.EnsureActiveSectionBroadcast();
    }

    private void EnsureSelectedTabAvailability()
    {
        if (SelectedTab is not null && (!SelectedTab.IsVisible || !SelectedTab.HasVisibleSubItems))
        {
            SelectedTab.IsSelected = false;
            SelectedTab = null;
        }

        if (SelectedTab is null)
        {
            var next = Tabs.FirstOrDefault(tab => tab.IsVisible && tab.HasVisibleSubItems);
            if (next is null)
            {
                foreach (var tab in Tabs)
                {
                    tab.IsSelected = false;
                }

                return;
            }

            foreach (var tab in Tabs)
            {
                tab.IsSelected = ReferenceEquals(tab, next);
            }

            SelectedTab = next;
            next.EnsureActiveSectionBroadcast();
        }
    }

    private void OnTabPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(NavigationTabViewModel.IsVisible)
            or nameof(NavigationTabViewModel.HasVisibleSubItems))
        {
            EnsureSelectedTabAvailability();
        }
    }
}
