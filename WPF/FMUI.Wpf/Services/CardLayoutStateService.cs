using System;
using System.Collections.Generic;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface ICardLayoutStateService
{
    bool TryGetGeometry(string tabIdentifier, string sectionIdentifier, string cardId, out CardGeometry geometry);

    void UpdateGeometry(string tabIdentifier, string sectionIdentifier, string cardId, CardGeometry geometry);

    void ResetSection(string tabIdentifier, string sectionIdentifier);
}

public sealed class CardLayoutStateService : ICardLayoutStateService
{
    private readonly object _gate = new();
    private readonly Dictionary<(string Tab, string Section), Dictionary<string, CardGeometry>> _state;
    private readonly ICardLayoutStatePersistence _persistence;

    public CardLayoutStateService(ICardLayoutStatePersistence persistence)
    {
        _persistence = persistence;
        _state = InitializeState(persistence.Load());
    }

    public bool TryGetGeometry(string tabIdentifier, string sectionIdentifier, string cardId, out CardGeometry geometry)
    {
        lock (_gate)
        {
            geometry = default;

            if (!_state.TryGetValue((tabIdentifier, sectionIdentifier), out var section))
            {
                return false;
            }

            return section.TryGetValue(cardId, out geometry);
        }
    }

    public void UpdateGeometry(string tabIdentifier, string sectionIdentifier, string cardId, CardGeometry geometry)
    {
        lock (_gate)
        {
            if (!_state.TryGetValue((tabIdentifier, sectionIdentifier), out var section))
            {
                section = new Dictionary<string, CardGeometry>(StringComparer.OrdinalIgnoreCase);
                _state[(tabIdentifier, sectionIdentifier)] = section;
            }

            section[cardId] = geometry;
            Persist();
        }
    }

    public void ResetSection(string tabIdentifier, string sectionIdentifier)
    {
        lock (_gate)
        {
            if (_state.Remove((tabIdentifier, sectionIdentifier)))
            {
                Persist();
            }
        }
    }

    private Dictionary<(string Tab, string Section), Dictionary<string, CardGeometry>> InitializeState(CardLayoutStateSnapshot snapshot)
    {
        var state = new Dictionary<(string Tab, string Section), Dictionary<string, CardGeometry>>();

        if (snapshot.Layouts is null)
        {
            return state;
        }

        foreach (var tab in snapshot.Layouts)
        {
            foreach (var section in tab.Value)
            {
                state[(tab.Key, section.Key)] = new Dictionary<string, CardGeometry>(section.Value, StringComparer.OrdinalIgnoreCase);
            }
        }

        return state;
    }

    private void Persist()
    {
        var layouts = new Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>>(StringComparer.OrdinalIgnoreCase);

        foreach (var (key, cards) in _state)
        {
            if (!layouts.TryGetValue(key.Tab, out var sectionDictionary))
            {
                sectionDictionary = new Dictionary<string, Dictionary<string, CardGeometry>>(StringComparer.OrdinalIgnoreCase);
                layouts[key.Tab] = sectionDictionary;
            }

            sectionDictionary[key.Section] = new Dictionary<string, CardGeometry>(cards, StringComparer.OrdinalIgnoreCase);
        }

        _persistence.Save(new CardLayoutStateSnapshot(layouts));
    }
}
