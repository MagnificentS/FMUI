using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class NavigationTabViewModel : ObservableObject
{
    private readonly IEventAggregator _eventAggregator;
    private readonly INavigationPermissionService _permissionService;
    private bool _isSelected;
    private NavigationSubItemViewModel? _activeSubItem;
    private bool _hasAlerts;
    private NavigationIndicatorSeverity _highestSeverity;
    private string? _alertSummary;
    private bool _isVisible = true;

    public NavigationTabViewModel(
        NavigationTab model,
        IEventAggregator eventAggregator,
        Func<string, NavigationSubItem, NavigationSubItemViewModel> subItemFactory,
        INavigationPermissionService permissionService)
    {
        Model = model;
        _eventAggregator = eventAggregator;
        _permissionService = permissionService ?? throw new ArgumentNullException(nameof(permissionService));

        if (subItemFactory is null)
        {
            throw new ArgumentNullException(nameof(subItemFactory));
        }

        var subItems = model.SubItems
            .Select(sub =>
            {
                var viewModel = subItemFactory(model.Identifier, sub);
                viewModel.PropertyChanged += OnSubItemPropertyChanged;
                viewModel.RefreshPermissions();
                return viewModel;
            })
            .ToList();

        SubItems = new ObservableCollection<NavigationSubItemViewModel>(subItems);

        SelectSubItemCommand = new RelayCommand(param =>
        {
            if (param is NavigationSubItemViewModel subItem)
            {
                ActivateSubItem(subItem);
            }
        });

        EnsureActiveSubItemAvailability();

        UpdateAlertState();
        RefreshPermissions();
        _permissionService.PermissionsChanged += OnPermissionsChanged;
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

    public bool IsVisible
    {
        get => _isVisible;
        private set => SetProperty(ref _isVisible, value);
    }

    public bool HasVisibleSubItems => SubItems.Any(item => item.IsVisible);

    public void ActivateSubItem(NavigationSubItemViewModel target)
    {
        if (target is null || !target.IsVisible)
        {
            target = SubItems.FirstOrDefault(item => item.IsVisible);
            if (target is null)
            {
                ActiveSubItem = null;
                return;
            }
        }

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

    public bool HasAlerts
    {
        get => _hasAlerts;
        private set => SetProperty(ref _hasAlerts, value);
    }

    public NavigationIndicatorSeverity HighestSeverity
    {
        get => _highestSeverity;
        private set => SetProperty(ref _highestSeverity, value);
    }

    public string? AlertSummary
    {
        get => _alertSummary;
        private set => SetProperty(ref _alertSummary, value);
    }

    private void PublishSectionChanged(NavigationSubItemViewModel subItem)
    {
        _eventAggregator.Publish(new NavigationSectionChangedEvent(Identifier, subItem.Identifier));
    }

    private void OnSubItemPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(NavigationSubItemViewModel.HasAlert)
            or nameof(NavigationSubItemViewModel.Severity)
            or nameof(NavigationSubItemViewModel.BadgeText))
        {
            UpdateAlertState();
        }

        if (e.PropertyName is nameof(NavigationSubItemViewModel.IsVisible))
        {
            OnPropertyChanged(nameof(HasVisibleSubItems));
            EnsureActiveSubItemAvailability();
        }
    }

    private void UpdateAlertState()
    {
        var severity = NavigationIndicatorSeverity.None;
        var summaries = new List<string>();

        foreach (var subItem in SubItems)
        {
            if (subItem.HasAlert)
            {
                severity = (NavigationIndicatorSeverity)Math.Max((int)severity, (int)subItem.Severity);

                if (!string.IsNullOrWhiteSpace(subItem.AlertTooltip))
                {
                    summaries.Add(subItem.AlertTooltip!);
                }
                else
                {
                    summaries.Add($"{subItem.Title} requires attention");
                }
            }
        }

        HasAlerts = severity != NavigationIndicatorSeverity.None;
        HighestSeverity = severity;
        AlertSummary = summaries.Count > 0 ? string.Join(Environment.NewLine, summaries) : null;
    }

    private void OnPermissionsChanged(object? sender, EventArgs e)
    {
        RefreshPermissions();
        foreach (var subItem in SubItems)
        {
            subItem.RefreshPermissions();
        }

        OnPropertyChanged(nameof(HasVisibleSubItems));
        EnsureActiveSubItemAvailability();
    }

    private void RefreshPermissions()
    {
        IsVisible = _permissionService.IsTabVisible(Identifier);

        if (!IsVisible && IsSelected)
        {
            IsSelected = false;
        }
    }

    private void EnsureActiveSubItemAvailability()
    {
        var target = ActiveSubItem;
        if (target is null || !target.IsVisible)
        {
            target = SubItems.FirstOrDefault(item => item.IsVisible);
            ActiveSubItem = target;
        }

        if (IsSelected && target is not null)
        {
            PublishSectionChanged(target);
        }
    }
}
