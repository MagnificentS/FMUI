using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class TrainingUnitBoardEditorViewModel : CardEditorViewModel
{
    private const string AvailableUnitId = "available";

    private readonly Func<TrainingUnitsBoardSnapshot, Task> _persistAsync;
    private readonly ObservableCollection<TrainingUnitAssignmentRowViewModel> _players;
    private readonly ObservableCollection<TrainingUnitCoachAssignmentViewModel> _units;
    private string? _validationMessage;
    private TrainingUnitAssignmentRowViewModel? _selectedPlayer;

    public TrainingUnitBoardEditorViewModel(
        string title,
        string? subtitle,
        TrainingUnitsBoardSnapshot board,
        Func<TrainingUnitsBoardSnapshot, Task> persistAsync)
        : base(title, subtitle)
    {
        if (board is null)
        {
            throw new ArgumentNullException(nameof(board));
        }

        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        var unitOptions = board.Units
            .Select(unit => new TrainingUnitUnitOption(unit.Id, unit.Name))
            .ToList();
        unitOptions.Add(new TrainingUnitUnitOption(AvailableUnitId, "Available Pool"));
        UnitOptions = new ReadOnlyCollection<TrainingUnitUnitOption>(unitOptions);

        _units = new ObservableCollection<TrainingUnitCoachAssignmentViewModel>(
            board.Units.Select(TrainingUnitCoachAssignmentViewModel.FromSnapshot));
        Units = new ReadOnlyCollection<TrainingUnitCoachAssignmentViewModel>(_units);

        foreach (var unit in _units)
        {
            unit.PropertyChanged += OnUnitPropertyChanged;
        }

        var playerRows = new List<TrainingUnitAssignmentRowViewModel>();
        foreach (var unit in board.Units)
        {
            foreach (var member in unit.Members)
            {
                var row = TrainingUnitAssignmentRowViewModel.FromSnapshot(
                    member,
                    unit.Id,
                    UnitOptions);
                row.PropertyChanged += OnPlayerPropertyChanged;
                playerRows.Add(row);
            }
        }

        foreach (var member in board.AvailablePlayers)
        {
            var row = TrainingUnitAssignmentRowViewModel.FromSnapshot(
                member,
                AvailableUnitId,
                UnitOptions);
            row.PropertyChanged += OnPlayerPropertyChanged;
            playerRows.Add(row);
        }

        _players = new ObservableCollection<TrainingUnitAssignmentRowViewModel>(playerRows.OrderBy(p => p.Name));
        Players = new ReadOnlyCollection<TrainingUnitAssignmentRowViewModel>(_players);

        if (_players.Count > 0)
        {
            SelectedPlayer = _players[0];
        }

        UpdateValidation();
    }

    public IReadOnlyList<TrainingUnitCoachAssignmentViewModel> Units { get; }

    public IReadOnlyList<TrainingUnitAssignmentRowViewModel> Players { get; }

    public IReadOnlyList<TrainingUnitUnitOption> UnitOptions { get; }

    public TrainingUnitAssignmentRowViewModel? SelectedPlayer
    {
        get => _selectedPlayer;
        set => SetProperty(ref _selectedPlayer, value);
    }

    public string? ValidationMessage
    {
        get => _validationMessage;
        private set
        {
            if (SetProperty(ref _validationMessage, value))
            {
                OnPropertyChanged(nameof(HasValidationMessage));
            }
        }
    }

    public bool HasValidationMessage => !string.IsNullOrWhiteSpace(ValidationMessage);

    protected override bool CanSave => string.IsNullOrWhiteSpace(ValidationMessage);

    protected override async Task PersistAsync()
    {
        var grouped = _players
            .GroupBy(player => player.SelectedUnitId)
            .ToDictionary(group => group.Key ?? AvailableUnitId, group => group.ToList());

        var updatedUnits = new List<TrainingUnitGroupSnapshot>(_units.Count);
        foreach (var unit in _units)
        {
            var members = grouped.TryGetValue(unit.Id, out var assigned)
                ? assigned
                    .Select(row => row.ToSnapshot())
                    .ToList()
                : new List<TrainingUnitMemberSnapshot>();

            var snapshot = unit.ToSnapshot(members);
            updatedUnits.Add(snapshot);
        }

        var availablePlayers = grouped.TryGetValue(AvailableUnitId, out var available)
            ? available.Select(row => row.ToSnapshot()).ToList()
            : new List<TrainingUnitMemberSnapshot>();

        var board = new TrainingUnitsBoardSnapshot(updatedUnits, availablePlayers);
        await _persistAsync(board).ConfigureAwait(false);
    }

    private void OnPlayerPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(TrainingUnitAssignmentRowViewModel.SelectedUnitId))
        {
            UpdateValidation();
        }
    }

    private void OnUnitPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(TrainingUnitCoachAssignmentViewModel.SelectedCoachId))
        {
            UpdateValidation();
        }
    }

    private void UpdateValidation()
    {
        if (_players.Any(player => string.IsNullOrWhiteSpace(player.SelectedUnitId)))
        {
            ValidationMessage = "Assign every player to a unit before saving.";
            return;
        }

        ValidationMessage = null;
    }
}

public sealed class TrainingUnitCoachAssignmentViewModel : ObservableObject
{
    private string? _selectedCoachId;

    private TrainingUnitCoachAssignmentViewModel(
        string id,
        string name,
        string? coachId,
        IReadOnlyList<TrainingUnitCoachSnapshot> coachOptions)
    {
        Id = id;
        Name = name;
        _selectedCoachId = coachId;
        CoachOptions = new ReadOnlyCollection<TrainingUnitCoachSnapshot>(coachOptions);
    }

    public string Id { get; }

    public string Name { get; }

    public IReadOnlyList<TrainingUnitCoachSnapshot> CoachOptions { get; }

    public string? SelectedCoachId
    {
        get => _selectedCoachId;
        set => SetProperty(ref _selectedCoachId, value);
    }

    public static TrainingUnitCoachAssignmentViewModel FromSnapshot(TrainingUnitGroupSnapshot snapshot)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new TrainingUnitCoachAssignmentViewModel(
            snapshot.Id,
            snapshot.Name,
            snapshot.CoachId,
            snapshot.CoachOptions);
    }

    public TrainingUnitGroupSnapshot ToSnapshot(IReadOnlyList<TrainingUnitMemberSnapshot> members)
    {
        return new TrainingUnitGroupSnapshot(
            Id,
            Name,
            SelectedCoachId,
            CoachOptions,
            members);
    }
}

public sealed class TrainingUnitAssignmentRowViewModel : ObservableObject
{
    private string? _selectedUnitId;

    private TrainingUnitAssignmentRowViewModel(
        string id,
        string name,
        string position,
        string role,
        string status,
        string? accent,
        string? detail,
        string? unitId,
        IReadOnlyList<TrainingUnitUnitOption> unitOptions)
    {
        Id = id;
        Name = name;
        Position = position;
        Role = role;
        Status = status;
        Accent = accent;
        Detail = detail;
        UnitOptions = unitOptions;
        _selectedUnitId = unitId;
    }

    public string Id { get; }

    public string Name { get; }

    public string Position { get; }

    public string Role { get; }

    public string Status { get; }

    public string? Accent { get; }

    public string? Detail { get; }

    public IReadOnlyList<TrainingUnitUnitOption> UnitOptions { get; }

    public string? SelectedUnitId
    {
        get => _selectedUnitId;
        set => SetProperty(ref _selectedUnitId, value);
    }

    public static TrainingUnitAssignmentRowViewModel FromSnapshot(
        TrainingUnitMemberSnapshot snapshot,
        string? unitId,
        IReadOnlyList<TrainingUnitUnitOption> unitOptions)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new TrainingUnitAssignmentRowViewModel(
            snapshot.Id,
            snapshot.Name,
            snapshot.Position,
            snapshot.Role,
            snapshot.Status,
            snapshot.Accent,
            snapshot.Detail,
            unitId,
            unitOptions);
    }

    public TrainingUnitMemberSnapshot ToSnapshot()
    {
        return new TrainingUnitMemberSnapshot(
            Id,
            Name,
            Position,
            Role,
            Status,
            Accent,
            Detail);
    }
}

public sealed record TrainingUnitUnitOption(string Id, string Name);
