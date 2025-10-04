using System;
using System.Collections.Generic;
using System.Linq;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface ICardLayoutStateService
{
    bool TryGetGeometry(string tabIdentifier, string sectionIdentifier, string cardId, out CardGeometry geometry);

    void UpdateGeometry(string tabIdentifier, string sectionIdentifier, string cardId, CardGeometry geometry);

    void ResetSection(string tabIdentifier, string sectionIdentifier);

    bool TryGetFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, out IReadOnlyList<FormationPlayerState> players);

    void UpdateFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, IReadOnlyList<FormationPlayerState> players);
}

public sealed class CardLayoutStateService : ICardLayoutStateService
{
    private readonly object _gate = new();
    private readonly Dictionary<(string Tab, string Section), Dictionary<string, CardGeometry>> _state;
    private readonly Dictionary<(string Tab, string Section, string CardId), Dictionary<string, FormationPlayerState>> _formationState;
    private readonly ICardLayoutStatePersistence _persistence;

    public CardLayoutStateService(ICardLayoutStatePersistence persistence)
    {
        _persistence = persistence;
        var snapshot = persistence.Load();
        _state = InitializeState(snapshot);
        _formationState = InitializeFormationState(snapshot);
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
            var removed = false;
            if (_state.Remove((tabIdentifier, sectionIdentifier)))
            {
                removed = true;
            }

            var keysToRemove = new List<(string Tab, string Section, string CardId)>();
            foreach (var key in _formationState.Keys)
            {
                if (string.Equals(key.Tab, tabIdentifier, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(key.Section, sectionIdentifier, StringComparison.OrdinalIgnoreCase))
                {
                    keysToRemove.Add(key);
                }
            }

            foreach (var key in keysToRemove)
            {
                if (_formationState.Remove(key))
                {
                    removed = true;
                }
            }

            if (removed)
            {
                Persist();
            }
        }
    }

    public bool TryGetFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, out IReadOnlyList<FormationPlayerState> players)
    {
        lock (_gate)
        {
            players = Array.Empty<FormationPlayerState>();

            if (!_formationState.TryGetValue((tabIdentifier, sectionIdentifier, cardId), out var snapshot))
            {
                return false;
            }

            if (snapshot.Count == 0)
            {
                return false;
            }

            players = snapshot.Values.ToList();
            return true;
        }
    }

    public void UpdateFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, IReadOnlyList<FormationPlayerState> players)
    {
        lock (_gate)
        {
            if (players is null || players.Count == 0)
            {
                if (_formationState.Remove((tabIdentifier, sectionIdentifier, cardId)))
                {
                    Persist();
                }

                return;
            }

            if (!_formationState.TryGetValue((tabIdentifier, sectionIdentifier, cardId), out var cardPlayers))
            {
                cardPlayers = new Dictionary<string, FormationPlayerState>(StringComparer.OrdinalIgnoreCase);
                _formationState[(tabIdentifier, sectionIdentifier, cardId)] = cardPlayers;
            }

            cardPlayers.Clear();
            foreach (var player in players)
            {
                if (string.IsNullOrWhiteSpace(player.PlayerId))
                {
                    continue;
                }

                cardPlayers[player.PlayerId] = player;
            }

            Persist();
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

    private Dictionary<(string Tab, string Section, string CardId), Dictionary<string, FormationPlayerState>> InitializeFormationState(CardLayoutStateSnapshot snapshot)
    {
        var state = new Dictionary<(string, string, string), Dictionary<string, FormationPlayerState>>();

        if (snapshot.Formations is null)
        {
            return state;
        }

        foreach (var tab in snapshot.Formations)
        {
            foreach (var section in tab.Value)
            {
                foreach (var card in section.Value)
                {
                    state[(tab.Key, section.Key, card.Key)] = new Dictionary<string, FormationPlayerState>(card.Value, StringComparer.OrdinalIgnoreCase);
                }
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

        var formations = new Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, FormationPlayerState>>>>(StringComparer.OrdinalIgnoreCase);

        foreach (var (key, players) in _formationState)
        {
            if (!formations.TryGetValue(key.Tab, out var sectionDictionary))
            {
                sectionDictionary = new Dictionary<string, Dictionary<string, Dictionary<string, FormationPlayerState>>>(StringComparer.OrdinalIgnoreCase);
                formations[key.Tab] = sectionDictionary;
            }

            if (!sectionDictionary.TryGetValue(key.Section, out var cardDictionary))
            {
                cardDictionary = new Dictionary<string, Dictionary<string, FormationPlayerState>>(StringComparer.OrdinalIgnoreCase);
                sectionDictionary[key.Section] = cardDictionary;
            }

            cardDictionary[key.CardId] = new Dictionary<string, FormationPlayerState>(players, StringComparer.OrdinalIgnoreCase);
        }

        _persistence.Save(new CardLayoutStateSnapshot(layouts, formations));
    }
}
