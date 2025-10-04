using System;
using System.Globalization;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class NavigationSubItemViewModel : ObservableObject
{
    private bool _isActive;
    private readonly string _tabIdentifier;
    private readonly INavigationIndicatorService _indicatorService;
    private NavigationIndicatorSnapshot _indicator = NavigationIndicatorSnapshot.None;
    private readonly INavigationPermissionService _permissionService;
    private bool _isVisible = true;

    public NavigationSubItemViewModel(
        NavigationSubItem model,
        string tabIdentifier,
        INavigationIndicatorService indicatorService,
        INavigationPermissionService permissionService)
    {
        Model = model;
        _tabIdentifier = tabIdentifier;
        _indicatorService = indicatorService ?? throw new ArgumentNullException(nameof(indicatorService));
        _permissionService = permissionService ?? throw new ArgumentNullException(nameof(permissionService));

        UpdateIndicator();
        _indicatorService.IndicatorsChanged += OnIndicatorsChanged;
        RefreshPermissions();
        _permissionService.PermissionsChanged += OnPermissionsChanged;
    }

    public NavigationSubItem Model { get; }

    public string Title => Model.Title;

    public string Identifier => Model.Identifier;

    public bool IsActive
    {
        get => _isActive;
        set
        {
            if (!IsVisible && value)
            {
                value = false;
            }

            SetProperty(ref _isActive, value);
        }
    }

    public bool HasAlert => _indicator.HasAlert;

    public NavigationIndicatorSeverity Severity => _indicator.Severity;

    public int AlertCount => _indicator.Count;

    public bool IsVisible
    {
        get => _isVisible;
        private set
        {
            if (SetProperty(ref _isVisible, value) && !value && IsActive)
            {
                IsActive = false;
            }
        }
    }

    public string? BadgeText
    {
        get
        {
            if (!HasAlert)
            {
                return null;
            }

            if (AlertCount <= 0)
            {
                return "!";
            }

            return AlertCount > 99
                ? "99+"
                : AlertCount.ToString(CultureInfo.CurrentCulture);
        }
    }

    public string? AlertTooltip => _indicator.Tooltip ?? (HasAlert ? $"{Title} requires attention" : null);

    internal void RefreshPermissions()
    {
        var visible = _permissionService.IsSectionVisible(_tabIdentifier, Identifier);
        IsVisible = visible;
    }

    private void OnIndicatorsChanged(object? sender, EventArgs e)
    {
        UpdateIndicator();
    }

    private void OnPermissionsChanged(object? sender, EventArgs e)
    {
        RefreshPermissions();
    }

    private void UpdateIndicator()
    {
        var indicator = _indicatorService.GetIndicator(_tabIdentifier, Identifier);
        if (_indicator.Equals(indicator))
        {
            return;
        }

        _indicator = indicator;
        OnPropertyChanged(nameof(HasAlert));
        OnPropertyChanged(nameof(Severity));
        OnPropertyChanged(nameof(AlertCount));
        OnPropertyChanged(nameof(BadgeText));
        OnPropertyChanged(nameof(AlertTooltip));
    }
}
