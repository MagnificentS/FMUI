using System;
using System.Collections.Generic;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface INavigationPermissionService
{
    event EventHandler? PermissionsChanged;

    bool IsTabVisible(string tabId);

    bool IsSectionVisible(string tabId, string sectionId);
}

public sealed class NavigationPermissionService : INavigationPermissionService
{
    private readonly IClubDataService _clubDataService;
    private readonly object _sync = new();
    private Dictionary<string, bool> _tabVisibility = new(StringComparer.OrdinalIgnoreCase);
    private Dictionary<(string Tab, string Section), bool> _sectionVisibility =
        new(TabSectionComparer.Instance);

    public NavigationPermissionService(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));

        ApplySnapshot(clubDataService.Current.NavigationPermissions);
        _clubDataService.SnapshotChanged += OnSnapshotChanged;
    }

    public event EventHandler? PermissionsChanged;

    public bool IsTabVisible(string tabId)
    {
        if (string.IsNullOrWhiteSpace(tabId))
        {
            return true;
        }

        lock (_sync)
        {
            return !_tabVisibility.TryGetValue(tabId, out var isVisible) || isVisible;
        }
    }

    public bool IsSectionVisible(string tabId, string sectionId)
    {
        if (string.IsNullOrWhiteSpace(tabId) || string.IsNullOrWhiteSpace(sectionId))
        {
            return true;
        }

        lock (_sync)
        {
            return !_sectionVisibility.TryGetValue((tabId, sectionId), out var isVisible) || isVisible;
        }
    }

    private void OnSnapshotChanged(object? sender, ClubDataSnapshot snapshot)
    {
        ApplySnapshot(snapshot.NavigationPermissions);
    }

    private void ApplySnapshot(NavigationPermissionsSnapshot? permissions)
    {
        var tabVisibility = new Dictionary<string, bool>(StringComparer.OrdinalIgnoreCase);
        var sectionVisibility = new Dictionary<(string Tab, string Section), bool>(TabSectionComparer.Instance);

        if (permissions?.Tabs is { Count: > 0 })
        {
            foreach (var tab in permissions.Tabs)
            {
                var tabId = tab.TabId ?? string.Empty;
                tabVisibility[tabId] = tab.IsVisible;

                if (tab.Sections is { Count: > 0 })
                {
                    foreach (var section in tab.Sections)
                    {
                        sectionVisibility[(tabId, section.SectionId ?? string.Empty)] = section.IsVisible;
                    }
                }
            }
        }

        lock (_sync)
        {
            _tabVisibility = tabVisibility;
            _sectionVisibility = sectionVisibility;
        }

        PermissionsChanged?.Invoke(this, EventArgs.Empty);
    }

    private sealed class TabSectionComparer : IEqualityComparer<(string Tab, string Section)>
    {
        public static TabSectionComparer Instance { get; } = new();

        public bool Equals((string Tab, string Section) x, (string Tab, string Section) y)
        {
            return string.Equals(x.Tab, y.Tab, StringComparison.OrdinalIgnoreCase)
                   && string.Equals(x.Section, y.Section, StringComparison.OrdinalIgnoreCase);
        }

        public int GetHashCode((string Tab, string Section) obj)
        {
            unchecked
            {
                var hash = 17;
                hash = (hash * 23) + StringComparer.OrdinalIgnoreCase.GetHashCode(obj.Tab ?? string.Empty);
                hash = (hash * 23) + StringComparer.OrdinalIgnoreCase.GetHashCode(obj.Section ?? string.Empty);
                return hash;
            }
        }
    }
}
