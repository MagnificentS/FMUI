using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class ShortlistEditorViewModel : CardEditorViewModel
{
    private readonly Func<IReadOnlyList<ShortlistPlayerSnapshot>, Task> _persistAsync;
    private readonly ReadOnlyCollection<string> _statusOptions;
    private readonly ReadOnlyCollection<string> _actionOptions;
    private readonly RelayCommand _addPlayerCommand;
    private readonly RelayCommand _removePlayerCommand;
    private readonly RelayCommand _moveUpCommand;
    private readonly RelayCommand _moveDownCommand;
    private ShortlistEditorItemViewModel? _selectedPlayer;

    public ShortlistEditorViewModel(
        IReadOnlyList<ShortlistPlayerSnapshot>? players,
        IReadOnlyList<string>? statusOptions,
        IReadOnlyList<string>? actionOptions,
        Func<IReadOnlyList<ShortlistPlayerSnapshot>, Task> persistAsync)
        : base("Curate Shortlist", "Organise targets, priorities, and next actions for the recruitment team.")
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        _statusOptions = new ReadOnlyCollection<string>((statusOptions ?? Array.Empty<string>())
            .Where(static option => !string.IsNullOrWhiteSpace(option))
            .Select(static option => option.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList());

        _actionOptions = new ReadOnlyCollection<string>((actionOptions ?? Array.Empty<string>())
            .Where(static option => !string.IsNullOrWhiteSpace(option))
            .Select(static option => option.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList());

        Players = new ObservableCollection<ShortlistEditorItemViewModel>(
            players?.Select(player => ShortlistEditorItemViewModel.FromSnapshot(
                player,
                GetDefaultStatus(),
                GetDefaultAction()))
            ?? Enumerable.Empty<ShortlistEditorItemViewModel>());

        Players.CollectionChanged += OnPlayersCollectionChanged;

        foreach (var player in Players)
        {
            player.PropertyChanged += OnPlayerPropertyChanged;
        }

        if (Players.Count > 0)
        {
            SelectedPlayer = Players[0];
        }

        _addPlayerCommand = new RelayCommand(_ => AddPlayer());
        _removePlayerCommand = new RelayCommand(_ => RemoveSelected(), _ => SelectedPlayer is not null);
        _moveUpCommand = new RelayCommand(_ => MoveSelected(-1), _ => CanMove(-1));
        _moveDownCommand = new RelayCommand(_ => MoveSelected(1), _ => CanMove(1));

        NotifyCanSaveChanged();
    }

    public ObservableCollection<ShortlistEditorItemViewModel> Players { get; }

    public ShortlistEditorItemViewModel? SelectedPlayer
    {
        get => _selectedPlayer;
        set
        {
            if (SetProperty(ref _selectedPlayer, value))
            {
                _removePlayerCommand.RaiseCanExecuteChanged();
                _moveUpCommand.RaiseCanExecuteChanged();
                _moveDownCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public IReadOnlyList<string> StatusOptions => _statusOptions;

    public IReadOnlyList<string> ActionOptions => _actionOptions;

    public ICommand AddPlayerCommand => _addPlayerCommand;

    public ICommand RemovePlayerCommand => _removePlayerCommand;

    public ICommand MoveUpCommand => _moveUpCommand;

    public ICommand MoveDownCommand => _moveDownCommand;

    protected override bool CanSave => Players.Count > 0 && Players.All(static player => player.IsValid);

    protected override async Task PersistAsync()
    {
        var snapshot = Players.Select(player => player.ToSnapshot()).ToList();
        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private void AddPlayer()
    {
        var player = new ShortlistEditorItemViewModel(
            Guid.NewGuid().ToString("N"),
            string.Empty,
            string.Empty,
            GetDefaultStatus(),
            GetDefaultAction(),
            string.Empty,
            string.Empty);

        player.PropertyChanged += OnPlayerPropertyChanged;
        Players.Add(player);
        SelectedPlayer = player;
        NotifyCanSaveChanged();
    }

    private void RemoveSelected()
    {
        var target = SelectedPlayer;
        if (target is null)
        {
            return;
        }

        target.PropertyChanged -= OnPlayerPropertyChanged;
        var index = Players.IndexOf(target);
        Players.Remove(target);

        if (Players.Count == 0)
        {
            SelectedPlayer = null;
        }
        else if (index >= Players.Count)
        {
            SelectedPlayer = Players[^1];
        }
        else
        {
            SelectedPlayer = Players[index];
        }

        NotifyCanSaveChanged();
    }

    private bool CanMove(int direction)
    {
        if (SelectedPlayer is null)
        {
            return false;
        }

        var index = Players.IndexOf(SelectedPlayer);
        var targetIndex = index + direction;
        return index >= 0 && targetIndex >= 0 && targetIndex < Players.Count;
    }

    private void MoveSelected(int direction)
    {
        if (!CanMove(direction))
        {
            return;
        }

        var index = Players.IndexOf(SelectedPlayer!);
        var target = index + direction;
        Players.Move(index, target);
        SelectedPlayer = Players[target];
    }

    private void OnPlayersCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.OldItems is not null)
        {
            foreach (ShortlistEditorItemViewModel player in e.OldItems)
            {
                player.PropertyChanged -= OnPlayerPropertyChanged;
            }
        }

        if (e.NewItems is not null)
        {
            foreach (ShortlistEditorItemViewModel player in e.NewItems)
            {
                player.PropertyChanged += OnPlayerPropertyChanged;
            }
        }

        NotifyCanSaveChanged();
    }

    private void OnPlayerPropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        NotifyCanSaveChanged();
    }

    private string GetDefaultStatus() => _statusOptions.Count > 0 ? _statusOptions[0] : "Monitor";

    private string GetDefaultAction() => _actionOptions.Count > 0 ? _actionOptions[0] : "Hold";
}

public sealed class ShortlistEditorItemViewModel : ObservableObject
{
    private string _name;
    private string _position;
    private string _status;
    private string _action;
    private string? _priority;
    private string? _notes;

    public ShortlistEditorItemViewModel(
        string id,
        string name,
        string position,
        string status,
        string action,
        string? priority,
        string? notes)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        _name = name;
        _position = position;
        _status = status;
        _action = action;
        _priority = priority;
        _notes = notes;
    }

    public string Id { get; }

    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value);
    }

    public string Position
    {
        get => _position;
        set => SetProperty(ref _position, value);
    }

    public string Status
    {
        get => _status;
        set => SetProperty(ref _status, value);
    }

    public string Action
    {
        get => _action;
        set => SetProperty(ref _action, value);
    }

    public string? Priority
    {
        get => _priority;
        set => SetProperty(ref _priority, value);
    }

    public string? Notes
    {
        get => _notes;
        set => SetProperty(ref _notes, value);
    }

    public bool IsValid => !string.IsNullOrWhiteSpace(Name)
        && !string.IsNullOrWhiteSpace(Position)
        && !string.IsNullOrWhiteSpace(Status)
        && !string.IsNullOrWhiteSpace(Action);

    public ShortlistPlayerSnapshot ToSnapshot()
    {
        return new ShortlistPlayerSnapshot(
            Id,
            Name.Trim(),
            Position.Trim(),
            Status.Trim(),
            Action.Trim(),
            string.IsNullOrWhiteSpace(Priority) ? null : Priority.Trim(),
            string.IsNullOrWhiteSpace(Notes) ? null : Notes.Trim());
    }

    public static ShortlistEditorItemViewModel FromSnapshot(
        ShortlistPlayerSnapshot snapshot,
        string defaultStatus,
        string defaultAction)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new ShortlistEditorItemViewModel(
            snapshot.Id,
            snapshot.Name,
            snapshot.Position,
            string.IsNullOrWhiteSpace(snapshot.Status) ? defaultStatus : snapshot.Status,
            string.IsNullOrWhiteSpace(snapshot.Action) ? defaultAction : snapshot.Action,
            snapshot.Priority,
            snapshot.Notes);
    }
}
