using System;
using System.Collections.Generic;
using FMUI.Wpf.Configuration;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface INavigationCatalog
{
    IReadOnlyList<NavigationTab> GetTabs();
}

public sealed class NavigationCatalog : INavigationCatalog
{
    private readonly NavigationLocalizationConfig _config;
    private readonly IStringDatabase _strings;

    public NavigationCatalog(NavigationLocalizationConfig config, IStringDatabase strings)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _strings = strings ?? throw new ArgumentNullException(nameof(strings));
    }

    public IReadOnlyList<NavigationTab> GetTabs()
    {
        var tabs = new List<NavigationTab>(_config.Tabs.Count);
        foreach (var tab in _config.Tabs)
        {
            var sections = new List<NavigationSubItem>(tab.Sections.Count);
            foreach (var section in tab.Sections)
            {
                sections.Add(new NavigationSubItem(_strings.Resolve(section.Label), section.Identifier));
            }

            tabs.Add(new NavigationTab(_strings.Resolve(tab.Label), tab.Identifier, sections));
        }

        return tabs;
    }
}
