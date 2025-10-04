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

public sealed class ScoutAssignmentEditorViewModel : CardEditorViewModel
{
    private readonly Func<IReadOnlyList<ScoutAssignmentSnapshot>, Task> _persistAsync;
    private readonly ReadOnlyCollection<string> _stageOptions;
    private readonly ReadOnlyCollection<string> _priorityOptions;
    private readonly ReadOnlyCollection<ScoutAssignmentEditorScoutOptionViewModel> _scoutOptions;
    private readonly RelayCommand _addAssignmentCommand;
    private readonly RelayCommand _removeAssignmentCommand;
    private readonly RelayCommand _moveUpCommand;
    private readonly RelayCommand _moveDownCommand;
    private ScoutAssignmentEditorItemViewModel? _selectedAssignment;

    public ScoutAssignmentEditorViewModel(
        IReadOnlyList<ScoutAssignmentSnapshot>? assignments,
        IReadOnlyList<ScoutOptionSnapshot>? scoutOptions,
        IReadOnlyList<string>? stageOptions,
        IReadOnlyList<string>? priorityOptions,
        Func<IReadOnlyList<ScoutAssignmentSnapshot>, Task> persistAsync)
        : base("Manage Scout Assignments", "Reassign coverage and adjust delivery expectations.")
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        _stageOptions = new ReadOnlyCollection<string>((stageOptions ?? Array.Empty<string>())
            .Where(static option => !string.IsNullOrWhiteSpace(option))
            .Select(static option => option.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList());

        _priorityOptions = new ReadOnlyCollection<string>((priorityOptions ?? Array.Empty<string>())
            .Where(static option => !string.IsNullOrWhiteSpace(option))
            .Select(static option => option.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList());

        var scoutOptionViewModels = (scoutOptions ?? Array.Empty<ScoutOptionSnapshot>())
            .Where(static option => !string.IsNullOrWhiteSpace(option.Name))
            .Select(static option => new ScoutAssignmentEditorScoutOptionViewModel(option))
            .ToList();
        _scoutOptions = new ReadOnlyCollection<ScoutAssignmentEditorScoutOptionViewModel>(scoutOptionViewModels);

        Assignments = new ObservableCollection<ScoutAssignmentEditorItemViewModel>(
            assignments?.Select(assignment => ScoutAssignmentEditorItemViewModel.FromSnapshot(
                assignment,
                GetDefaultStage(),
                GetDefaultPriority()))
            ?? Enumerable.Empty<ScoutAssignmentEditorItemViewModel>());
        Assignments.CollectionChanged += OnAssignmentsCollectionChanged;

        foreach (var assignment in Assignments)
        {
            assignment.PropertyChanged += OnAssignmentPropertyChanged;
        }

        if (Assignments.Count > 0)
        {
            SelectedAssignment = Assignments[0];
        }

        _addAssignmentCommand = new RelayCommand(_ => AddAssignment());
        _removeAssignmentCommand = new RelayCommand(_ => RemoveSelected(), _ => SelectedAssignment is not null);
        _moveUpCommand = new RelayCommand(_ => MoveSelected(-1), _ => CanMove(-1));
        _moveDownCommand = new RelayCommand(_ => MoveSelected(1), _ => CanMove(1));

        NotifyCanSaveChanged();
    }

    public ObservableCollection<ScoutAssignmentEditorItemViewModel> Assignments { get; }

    public ScoutAssignmentEditorItemViewModel? SelectedAssignment
    {
        get => _selectedAssignment;
        set
        {
            if (SetProperty(ref _selectedAssignment, value))
            {
                _removeAssignmentCommand.RaiseCanExecuteChanged();
                _moveUpCommand.RaiseCanExecuteChanged();
                _moveDownCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public IReadOnlyList<string> StageOptions => _stageOptions;

    public IReadOnlyList<string> PriorityOptions => _priorityOptions;

    public IReadOnlyList<ScoutAssignmentEditorScoutOptionViewModel> ScoutOptions => _scoutOptions;

    public ICommand AddAssignmentCommand => _addAssignmentCommand;

    public ICommand RemoveAssignmentCommand => _removeAssignmentCommand;

    public ICommand MoveUpCommand => _moveUpCommand;

    public ICommand MoveDownCommand => _moveDownCommand;

    protected override bool CanSave => Assignments.Count > 0 && Assignments.All(static assignment => assignment.IsValid);

    protected override async Task PersistAsync()
    {
        var snapshot = Assignments
            .Select(assignment => assignment.ToSnapshot())
            .ToList();

        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private void AddAssignment()
    {
        var assignment = new ScoutAssignmentEditorItemViewModel(
            Guid.NewGuid().ToString("N"),
            string.Empty,
            string.Empty,
            string.Empty,
            GetDefaultPriority(),
            GetDefaultStage(),
            "Due in 4 weeks",
            _scoutOptions.FirstOrDefault()?.Name ?? string.Empty,
            string.Empty);

        assignment.PropertyChanged += OnAssignmentPropertyChanged;
        Assignments.Add(assignment);
        SelectedAssignment = assignment;
        NotifyCanSaveChanged();
    }

    private void RemoveSelected()
    {
        var target = SelectedAssignment;
        if (target is null)
        {
            return;
        }

        target.PropertyChanged -= OnAssignmentPropertyChanged;
        var index = Assignments.IndexOf(target);
        Assignments.Remove(target);

        if (Assignments.Count == 0)
        {
            SelectedAssignment = null;
        }
        else if (index >= Assignments.Count)
        {
            SelectedAssignment = Assignments[^1];
        }
        else
        {
            SelectedAssignment = Assignments[index];
        }

        NotifyCanSaveChanged();
    }

    private bool CanMove(int direction)
    {
        if (SelectedAssignment is null)
        {
            return false;
        }

        var index = Assignments.IndexOf(SelectedAssignment);
        var targetIndex = index + direction;
        return index >= 0 && targetIndex >= 0 && targetIndex < Assignments.Count;
    }

    private void MoveSelected(int direction)
    {
        if (!CanMove(direction))
        {
            return;
        }

        var index = Assignments.IndexOf(SelectedAssignment!);
        var target = index + direction;
        Assignments.Move(index, target);
        SelectedAssignment = Assignments[target];
    }

    private void OnAssignmentsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.OldItems is not null)
        {
            foreach (ScoutAssignmentEditorItemViewModel assignment in e.OldItems)
            {
                assignment.PropertyChanged -= OnAssignmentPropertyChanged;
            }
        }

        if (e.NewItems is not null)
        {
            foreach (ScoutAssignmentEditorItemViewModel assignment in e.NewItems)
            {
                assignment.PropertyChanged += OnAssignmentPropertyChanged;
            }
        }

        NotifyCanSaveChanged();
    }

    private void OnAssignmentPropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        NotifyCanSaveChanged();
    }

    private string GetDefaultStage() => _stageOptions.Count > 0 ? _stageOptions[0] : "In Progress";

    private string GetDefaultPriority() => _priorityOptions.Count > 0 ? _priorityOptions[0] : "Medium";
}

public sealed class ScoutAssignmentEditorItemViewModel : ObservableObject
{
    private string _focus;
    private string _role;
    private string _region;
    private string _priority;
    private string _stage;
    private string _deadline;
    private string _scout;
    private string? _notes;

    public ScoutAssignmentEditorItemViewModel(
        string id,
        string focus,
        string role,
        string region,
        string priority,
        string stage,
        string deadline,
        string scout,
        string? notes)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        _focus = focus;
        _role = role;
        _region = region;
        _priority = priority;
        _stage = stage;
        _deadline = deadline;
        _scout = scout;
        _notes = notes;
    }

    public string Id { get; }

    public string Focus
    {
        get => _focus;
        set => SetProperty(ref _focus, value);
    }

    public string Role
    {
        get => _role;
        set => SetProperty(ref _role, value);
    }

    public string Region
    {
        get => _region;
        set => SetProperty(ref _region, value);
    }

    public string Priority
    {
        get => _priority;
        set => SetProperty(ref _priority, value);
    }

    public string Stage
    {
        get => _stage;
        set => SetProperty(ref _stage, value);
    }

    public string Deadline
    {
        get => _deadline;
        set => SetProperty(ref _deadline, value);
    }

    public string Scout
    {
        get => _scout;
        set => SetProperty(ref _scout, value);
    }

    public string? Notes
    {
        get => _notes;
        set => SetProperty(ref _notes, value);
    }

    public bool IsValid => !string.IsNullOrWhiteSpace(Focus)
        && !string.IsNullOrWhiteSpace(Role)
        && !string.IsNullOrWhiteSpace(Priority)
        && !string.IsNullOrWhiteSpace(Stage)
        && !string.IsNullOrWhiteSpace(Scout)
        && !string.IsNullOrWhiteSpace(Deadline);

    public ScoutAssignmentSnapshot ToSnapshot()
    {
        return new ScoutAssignmentSnapshot(
            Id,
            Focus.Trim(),
            Role.Trim(),
            Region.Trim(),
            Priority.Trim(),
            Stage.Trim(),
            Deadline.Trim(),
            Scout.Trim(),
            string.IsNullOrWhiteSpace(Notes) ? null : Notes.Trim());
    }

    public static ScoutAssignmentEditorItemViewModel FromSnapshot(
        ScoutAssignmentSnapshot snapshot,
        string defaultStage,
        string defaultPriority)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new ScoutAssignmentEditorItemViewModel(
            snapshot.Id,
            snapshot.Focus,
            snapshot.Role,
            snapshot.Region,
            string.IsNullOrWhiteSpace(snapshot.Priority) ? defaultPriority : snapshot.Priority,
            string.IsNullOrWhiteSpace(snapshot.Stage) ? defaultStage : snapshot.Stage,
            snapshot.Deadline,
            snapshot.Scout,
            snapshot.Notes);
    }
}

public sealed class ScoutAssignmentEditorScoutOptionViewModel
{
    private readonly ScoutOptionSnapshot _snapshot;

    public ScoutAssignmentEditorScoutOptionViewModel(ScoutOptionSnapshot snapshot)
    {
        _snapshot = snapshot ?? throw new ArgumentNullException(nameof(snapshot));
    }

    public string Id => _snapshot.Id;

    public string Name => _snapshot.Name;

    public string Region => _snapshot.Region;

    public string Availability => _snapshot.Availability;

    public string Display => string.IsNullOrWhiteSpace(Availability)
        ? $"{Name} — {Region}"
        : $"{Name} — {Region} ({Availability})";
}
