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
    private readonly CardLayoutCatalog _cardCatalog;

    public MainViewModel()
    {
        _cardCatalog = new CardLayoutCatalog();
        var tabs = NavigationCatalog.BuildDefaultTabs()
            .Select(model => new NavigationTabViewModel(model))
            .ToList();

        Tabs = new ObservableCollection<NavigationTabViewModel>(tabs);
        CardSurface = new CardSurfaceViewModel(_cardCatalog);

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
        if (SelectedTab is not null)
        {
            SelectedTab.PropertyChanged -= OnSelectedTabPropertyChanged;
        }

        foreach (var t in Tabs)
        {
            t.IsSelected = ReferenceEquals(t, tab);
        }

        SelectedTab = tab;
        SelectedTab.PropertyChanged += OnSelectedTabPropertyChanged;

        UpdateSurfaceFromSelection();
    }

    private void OnSelectedTabPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(NavigationTabViewModel.ActiveSubItem))
        {
            UpdateSurfaceFromSelection();
        }
    }

    private void UpdateSurfaceFromSelection()
    {
        var subItem = SelectedTab?.ActiveSubItem;
        if (SelectedTab is null || subItem is null)
        {
            CardSurface.Clear();
            return;
        }

        CardSurface.LoadSection(SelectedTab.Identifier, subItem.Identifier);
    }
}
