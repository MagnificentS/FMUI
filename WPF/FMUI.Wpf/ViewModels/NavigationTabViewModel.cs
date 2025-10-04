using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class NavigationTabViewModel : ObservableObject
{
    private readonly IEventAggregator _eventAggregator;
    private bool _isSelected;
    private NavigationSubItemViewModel? _activeSubItem;

    public NavigationTabViewModel(NavigationTab model, IEventAggregator eventAggregator)
    {
        Model = model;
        _eventAggregator = eventAggregator;

        SubItems = new ObservableCollection<NavigationSubItemViewModel>(
            model.SubItems.Select(sub => new NavigationSubItemViewModel(sub)));

        SelectSubItemCommand = new RelayCommand(param =>
        {
            if (param is NavigationSubItemViewModel subItem)
            {
                ActivateSubItem(subItem);
            }
        });

        if (SubItems.Count > 0)
        {
            ActivateSubItem(SubItems[0]);
        }
    }

    public NavigationTab Model { get; }

    public string Title => Model.Title;

    public string Identifier => Model.Identifier;

    public ObservableCollection<NavigationSubItemViewModel> SubItems { get; }

    public ICommand SelectSubItemCommand { get; }

    public bool IsSelected
    {
        get => _isSelected;
        set
        {
            if (SetProperty(ref _isSelected, value) && value && ActiveSubItem is not null)
            {
                PublishSectionChanged(ActiveSubItem);
            }
        }
    }

    public NavigationSubItemViewModel? ActiveSubItem
    {
        get => _activeSubItem;
        private set => SetProperty(ref _activeSubItem, value);
    }

    public void ActivateSubItem(NavigationSubItemViewModel target)
    {
        foreach (var item in SubItems)
        {
            item.IsActive = ReferenceEquals(item, target);
        }

        ActiveSubItem = target;

        if (IsSelected)
        {
            PublishSectionChanged(target);
        }
    }

    public void EnsureActiveSectionBroadcast()
    {
        if (IsSelected && ActiveSubItem is not null)
        {
            PublishSectionChanged(ActiveSubItem);
        }
    }

    private void PublishSectionChanged(NavigationSubItemViewModel subItem)
    {
        _eventAggregator.Publish(new NavigationSectionChangedEvent(Identifier, subItem.Identifier));
    }
}
