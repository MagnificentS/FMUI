using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Windows.Data;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.Models;

public enum SquadCardDescriptorKind
{
    SelectionList,
    Roster,
    InternationalList,
    DepthList
}

public abstract record SquadCardDescriptor(
    string CardId,
    string TabIdentifier,
    string SectionIdentifier,
    SquadCardDescriptorKind Kind);

public sealed record SquadListCardDescriptor(
    string CardId,
    string TabIdentifier,
    string SectionIdentifier,
    SquadCardDescriptorKind Kind,
    IReadOnlyList<CardListItem> Items) : SquadCardDescriptor(CardId, TabIdentifier, SectionIdentifier, Kind)
{
    public SquadListCardDescriptor EnsureKind(SquadCardDescriptorKind kind)
    {
        if (Kind != kind)
        {
            throw new InvalidOperationException($"Descriptor kind mismatch. Expected {kind}, found {Kind}.");
        }

        return this;
    }
}

public sealed record SquadRosterCardDescriptor(
    string CardId,
    string TabIdentifier,
    string SectionIdentifier,
    SquadRosterState State) : SquadCardDescriptor(CardId, TabIdentifier, SectionIdentifier, SquadCardDescriptorKind.Roster);

public sealed class SquadRosterState : ObservableObject
{
    private const string AllFilter = "All";

    private readonly ObservableCollection<SquadPlayerRowState> _players;
    private readonly ListCollectionView _view;
    private readonly RelayCommand _clearFiltersCommand;
    private readonly RelayCommand _compareCommand;
    private readonly RelayCommand _clearSelectionCommand;
    private readonly RelayCommand _dismissComparisonCommand;
    private readonly ReadOnlyCollection<string> _positionFilters;
    private readonly ReadOnlyCollection<string> _roleFilters;
    private string _selectedPositionFilter = AllFilter;
    private string _selectedRoleFilter = AllFilter;
    private string? _searchText;
    private int _selectedCount;
    private bool _hasComparison;
    private string? _comparisonSummary;
    private IReadOnlyList<string> _comparisonPlayers = Array.Empty<string>();
    private IReadOnlyList<SquadComparisonMetric> _comparisonMetrics = Array.Empty<SquadComparisonMetric>();

    public SquadRosterState(SquadTableDefinition definition)
    {
        _players = new ObservableCollection<SquadPlayerRowState>(CreatePlayers(definition.Players));
        foreach (var player in _players)
        {
            player.PropertyChanged += OnPlayerPropertyChanged;
        }

        _view = (ListCollectionView)CollectionViewSource.GetDefaultView(_players);
        _view.Filter = FilterPlayer;
        _view.SortDescriptions.Add(new SortDescription(nameof(SquadPlayerRowState.AverageRating), ListSortDirection.Descending));

        _positionFilters = new ReadOnlyCollection<string>(BuildFilterList(definition.Players.Select(p => p.PositionGroup)));
        _roleFilters = new ReadOnlyCollection<string>(BuildFilterList(definition.Players.Select(p => p.Role)));

        PositionFilters = _positionFilters;
        RoleFilters = _roleFilters;

        _clearFiltersCommand = new RelayCommand(ClearFilters);
        _compareCommand = new RelayCommand(ExecuteCompare, () => SelectedCount >= 2);
        _clearSelectionCommand = new RelayCommand(ClearSelection, () => SelectedCount > 0);
        _dismissComparisonCommand = new RelayCommand(() => HasComparison = false);
    }

    public ICollectionView PlayersView => _view;

    public IReadOnlyList<string> PositionFilters { get; }

    public IReadOnlyList<string> RoleFilters { get; }

    public string SelectedPositionFilter
    {
        get => _selectedPositionFilter;
        set
        {
            if (SetProperty(ref _selectedPositionFilter, NormalizeFilter(value)))
            {
                RefreshFilters();
            }
        }
    }

    public string SelectedRoleFilter
    {
        get => _selectedRoleFilter;
        set
        {
            if (SetProperty(ref _selectedRoleFilter, NormalizeFilter(value)))
            {
                RefreshFilters();
            }
        }
    }

    public string? SearchText
    {
        get => _searchText;
        set
        {
            if (SetProperty(ref _searchText, value))
            {
                RefreshFilters();
            }
        }
    }

    public int SelectedCount
    {
        get => _selectedCount;
        private set
        {
            if (SetProperty(ref _selectedCount, value))
            {
                _compareCommand.RaiseCanExecuteChanged();
                _clearSelectionCommand.RaiseCanExecuteChanged();

                if (value < 2 && HasComparison)
                {
                    HasComparison = false;
                }
            }
        }
    }

    public bool HasComparison
    {
        get => _hasComparison;
        private set
        {
            if (SetProperty(ref _hasComparison, value) && !value)
            {
                ComparisonSummary = null;
                ComparisonPlayers = Array.Empty<string>();
                ComparisonMetrics = Array.Empty<SquadComparisonMetric>();
            }
        }
    }

    public string? ComparisonSummary
    {
        get => _comparisonSummary;
        private set => SetProperty(ref _comparisonSummary, value);
    }

    public IReadOnlyList<string> ComparisonPlayers
    {
        get => _comparisonPlayers;
        private set
        {
            if (SetProperty(ref _comparisonPlayers, value))
            {
                OnPropertyChanged(nameof(ComparisonPlayersDisplay));
            }
        }
    }

    public string ComparisonPlayersDisplay => _comparisonPlayers.Count == 0
        ? string.Empty
        : string.Join(" • ", _comparisonPlayers);

    public IReadOnlyList<SquadComparisonMetric> ComparisonMetrics
    {
        get => _comparisonMetrics;
        private set => SetProperty(ref _comparisonMetrics, value);
    }

    public ICommand ClearFiltersCommand => _clearFiltersCommand;

    public ICommand CompareCommand => _compareCommand;

    public ICommand ClearSelectionCommand => _clearSelectionCommand;

    public ICommand DismissComparisonCommand => _dismissComparisonCommand;

    private void ClearFilters()
    {
        SelectedPositionFilter = AllFilter;
        SelectedRoleFilter = AllFilter;
        SearchText = string.Empty;
    }

    private void ClearSelection()
    {
        foreach (var player in _players)
        {
            player.IsSelected = false;
        }
    }

    private void ExecuteCompare()
    {
        var selected = _players.Where(p => p.IsSelected).ToList();
        if (selected.Count < 2)
        {
            HasComparison = false;
            return;
        }

        var metrics = new List<SquadComparisonMetric>
        {
            SquadComparisonMetric.Create("Average Rating", selected, p => p.AverageRating, "0.00"),
            SquadComparisonMetric.Create("Condition", selected, p => p.ConditionPercentage, "0", "%"),
            SquadComparisonMetric.Create("Sharpness", selected, p => p.MatchSharpnessPercentage, "0", "%"),
            SquadComparisonMetric.Create("Minutes", selected, p => p.Minutes, "0", " min")
        };

        ComparisonMetrics = new ReadOnlyCollection<SquadComparisonMetric>(metrics);
        ComparisonPlayers = new ReadOnlyCollection<string>(selected.Select(p => p.Name).ToList());
        ComparisonSummary = selected.Count == 2
            ? $"{selected[0].Name} vs {selected[1].Name}"
            : $"Comparing {selected.Count} players";
        HasComparison = true;
    }

    private void RefreshFilters()
    {
        _view.Refresh();
    }

    private void OnPlayerPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(SquadPlayerRowState.IsSelected))
        {
            SelectedCount = _players.Count(player => player.IsSelected);
        }
    }

    private bool FilterPlayer(object? item)
    {
        if (item is not SquadPlayerRowState player)
        {
            return false;
        }

        if (!string.Equals(_selectedPositionFilter, AllFilter, StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(player.PositionGroup, _selectedPositionFilter, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        if (!string.Equals(_selectedRoleFilter, AllFilter, StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(player.Role, _selectedRoleFilter, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(_searchText))
        {
            return true;
        }

        var comparison = _searchText.Trim();
        if (comparison.Length == 0)
        {
            return true;
        }

        return player.Name.Contains(comparison, StringComparison.OrdinalIgnoreCase)
            || player.Position.Contains(comparison, StringComparison.OrdinalIgnoreCase)
            || player.Role.Contains(comparison, StringComparison.OrdinalIgnoreCase)
            || (!string.IsNullOrWhiteSpace(player.Nationality) &&
                player.Nationality.Contains(comparison, StringComparison.OrdinalIgnoreCase));
    }

    private static string NormalizeFilter(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? AllFilter : value;
    }

    private static List<SquadPlayerRowState> CreatePlayers(IReadOnlyList<SquadPlayerDefinition> definitions)
    {
        if (definitions is null || definitions.Count == 0)
        {
            return new List<SquadPlayerRowState>();
        }

        var players = new List<SquadPlayerRowState>(definitions.Count);
        foreach (var definition in definitions)
        {
            players.Add(new SquadPlayerRowState(definition));
        }

        return players;
    }

    private static List<string> BuildFilterList(IEnumerable<string> source)
    {
        var list = new List<string> { AllFilter };
        if (source is not null)
        {
            foreach (var value in source
                .Where(static v => !string.IsNullOrWhiteSpace(v))
                .Select(static v => v.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(static v => v, StringComparer.OrdinalIgnoreCase))
            {
                list.Add(value);
            }
        }

        return list;
    }
}

public sealed class SquadPlayerRowState : ObservableObject
{
    private bool _isSelected;

    public SquadPlayerRowState(SquadPlayerDefinition definition)
    {
        Id = definition.Id;
        Name = definition.Name;
        PositionGroup = definition.PositionGroup;
        Position = definition.Position;
        Role = definition.Role;
        Morale = definition.Morale;
        Condition = definition.Condition;
        MatchSharpness = definition.MatchSharpness;
        AverageRating = definition.AverageRating;
        Appearances = definition.Appearances;
        Minutes = definition.Minutes;
        Nationality = definition.Nationality;
        Status = definition.Status;
    }

    public string Id { get; }

    public string Name { get; }

    public string PositionGroup { get; }

    public string Position { get; }

    public string Role { get; }

    public string Morale { get; }

    public double Condition { get; }

    public double MatchSharpness { get; }

    public double AverageRating { get; }

    public int Appearances { get; }

    public int Minutes { get; }

    public string? Nationality { get; }

    public string? Status { get; }

    public bool HasStatus => !string.IsNullOrWhiteSpace(Status);

    public double ConditionPercentage => Condition * 100.0;

    public double MatchSharpnessPercentage => MatchSharpness * 100.0;

    public string ConditionDisplay => Condition.ToString("P0", CultureInfo.InvariantCulture);

    public string MatchSharpnessDisplay => MatchSharpness.ToString("P0", CultureInfo.InvariantCulture);

    public string AverageRatingDisplay => AverageRating.ToString("0.00", CultureInfo.InvariantCulture);

    public string AppearancesDisplay => Appearances.ToString("N0", CultureInfo.InvariantCulture);

    public string MinutesDisplay => Minutes.ToString("N0", CultureInfo.InvariantCulture);

    public bool IsSelected
    {
        get => _isSelected;
        set => SetProperty(ref _isSelected, value);
    }
}

public sealed class SquadComparisonMetric
{
    public SquadComparisonMetric(string metric, string leaderName, string leaderValue, bool isTie)
    {
        Metric = metric;
        LeaderName = leaderName;
        LeaderValue = leaderValue;
        IsTie = isTie;
    }

    public string Metric { get; }

    public string LeaderName { get; }

    public string LeaderValue { get; }

    public bool IsTie { get; }

    public string? TieBadge => IsTie ? "Tied" : null;

    public static SquadComparisonMetric Create(
        string metric,
        IReadOnlyList<SquadPlayerRowState> players,
        Func<SquadPlayerRowState, double> selector,
        string format,
        string? suffix = null)
    {
        if (players is null || players.Count == 0)
        {
            return new SquadComparisonMetric(metric, "—", "—", false);
        }

        var max = players.Max(selector);
        var tolerance = Math.Abs(max) < 0.0001 ? 0.0005 : Math.Max(Math.Abs(max) * 0.0005, 0.0005);
        var leaders = players
            .Where(player => Math.Abs(selector(player) - max) <= tolerance)
            .Select(player => player.Name)
            .ToList();

        var formatted = max.ToString(format, CultureInfo.InvariantCulture);
        if (!string.IsNullOrWhiteSpace(suffix))
        {
            formatted += suffix;
        }

        var leaderName = string.Join(" • ", leaders);
        return new SquadComparisonMetric(metric, leaderName, formatted, leaders.Count > 1);
    }
}
