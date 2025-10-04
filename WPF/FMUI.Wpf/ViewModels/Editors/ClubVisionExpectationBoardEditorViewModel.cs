using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class ClubVisionExpectationBoardEditorViewModel : CardEditorViewModel
{
    private readonly Func<ClubVisionExpectationBoardSnapshot, Task> _persistAsync;
    private readonly RelayCommand _removeObjectiveCommand;
    private readonly RelayCommand _moveUpCommand;
    private readonly RelayCommand _moveDownCommand;
    private ClubVisionExpectationEditorItemViewModel? _selectedObjective;
    private string? _validationMessage;

    public ClubVisionExpectationBoardEditorViewModel(
        string title,
        string? subtitle,
        ClubVisionExpectationBoardSnapshot board,
        Func<ClubVisionExpectationBoardSnapshot, Task> persistAsync)
        : base(title, subtitle)
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        Objectives = new ObservableCollection<ClubVisionExpectationEditorItemViewModel>(
            board.Objectives?.Select(ClubVisionExpectationEditorItemViewModel.FromSnapshot)
            ?? Enumerable.Empty<ClubVisionExpectationEditorItemViewModel>());

        foreach (var objective in Objectives)
        {
            objective.PropertyChanged += OnObjectivePropertyChanged;
        }

        StatusOptions = new ObservableCollection<string>(board.StatusOptions ?? Array.Empty<string>());
        PriorityOptions = new ObservableCollection<string>(board.PriorityOptions ?? Array.Empty<string>());

        AddObjectiveCommand = new RelayCommand(_ => AddObjective());
        _removeObjectiveCommand = new RelayCommand(_ => RemoveSelectedObjective(), _ => SelectedObjective is not null);
        _moveUpCommand = new RelayCommand(_ => MoveSelected(-1), _ => CanMove(-1));
        _moveDownCommand = new RelayCommand(_ => MoveSelected(1), _ => CanMove(1));

        if (Objectives.Count > 0)
        {
            SelectedObjective = Objectives[0];
        }

        UpdateValidation();
    }

    public ObservableCollection<ClubVisionExpectationEditorItemViewModel> Objectives { get; }

    public ObservableCollection<string> StatusOptions { get; }

    public ObservableCollection<string> PriorityOptions { get; }

    public ICommand AddObjectiveCommand { get; }

    public ICommand RemoveObjectiveCommand => _removeObjectiveCommand;

    public ICommand MoveUpCommand => _moveUpCommand;

    public ICommand MoveDownCommand => _moveDownCommand;

    public ClubVisionExpectationEditorItemViewModel? SelectedObjective
    {
        get => _selectedObjective;
        set
        {
            if (SetProperty(ref _selectedObjective, value))
            {
                _removeObjectiveCommand.RaiseCanExecuteChanged();
                _moveUpCommand.RaiseCanExecuteChanged();
                _moveDownCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public string? ValidationMessage
    {
        get => _validationMessage;
        private set
        {
            if (SetProperty(ref _validationMessage, value))
            {
                OnPropertyChanged(nameof(HasValidationMessage));
                NotifyCanSaveChanged();
            }
        }
    }

    public bool HasValidationMessage => !string.IsNullOrWhiteSpace(ValidationMessage);

    protected override bool CanSave => string.IsNullOrWhiteSpace(ValidationMessage);

    protected override async Task PersistAsync()
    {
        var objectives = Objectives
            .Select(objective => objective.ToSnapshot())
            .ToList();

        var statusOptions = StatusOptions
            .Concat(objectives.Select(objective => objective.Status))
            .Where(option => !string.IsNullOrWhiteSpace(option))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var priorityOptions = PriorityOptions
            .Concat(objectives.Select(objective => objective.Priority))
            .Where(option => !string.IsNullOrWhiteSpace(option))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var snapshot = new ClubVisionExpectationBoardSnapshot(objectives, statusOptions, priorityOptions);
        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private void AddObjective()
    {
        var priority = PriorityOptions.FirstOrDefault() ?? "Medium";
        var status = StatusOptions.FirstOrDefault() ?? "On Course";

        var objective = new ClubVisionExpectationEditorItemViewModel(
            Guid.NewGuid().ToString("N"),
            "New objective",
            "Competition",
            priority,
            status,
            "TBD",
            string.Empty,
            string.Empty);

        objective.PropertyChanged += OnObjectivePropertyChanged;
        Objectives.Add(objective);
        SelectedObjective = objective;
        UpdateValidation();
    }

    private void RemoveSelectedObjective()
    {
        var objective = SelectedObjective;
        if (objective is null)
        {
            return;
        }

        objective.PropertyChanged -= OnObjectivePropertyChanged;
        var index = Objectives.IndexOf(objective);
        Objectives.Remove(objective);

        if (Objectives.Count > 0)
        {
            var target = Math.Clamp(index, 0, Objectives.Count - 1);
            SelectedObjective = Objectives[target];
        }
        else
        {
            SelectedObjective = null;
        }

        UpdateValidation();
    }

    private bool CanMove(int direction)
    {
        if (SelectedObjective is null)
        {
            return false;
        }

        var index = Objectives.IndexOf(SelectedObjective);
        var target = index + direction;
        return index >= 0 && target >= 0 && target < Objectives.Count;
    }

    private void MoveSelected(int direction)
    {
        if (SelectedObjective is null)
        {
            return;
        }

        var index = Objectives.IndexOf(SelectedObjective);
        var target = index + direction;
        if (index < 0 || target < 0 || target >= Objectives.Count)
        {
            return;
        }

        Objectives.Move(index, target);
        UpdateValidation();
    }

    private void OnObjectivePropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(ClubVisionExpectationEditorItemViewModel.Objective)
            or nameof(ClubVisionExpectationEditorItemViewModel.Status)
            or nameof(ClubVisionExpectationEditorItemViewModel.Deadline))
        {
            UpdateValidation();
        }
    }

    private void UpdateValidation()
    {
        if (Objectives.Count == 0)
        {
            ValidationMessage = "Add at least one objective.";
            return;
        }

        foreach (var objective in Objectives)
        {
            if (string.IsNullOrWhiteSpace(objective.Objective))
            {
                ValidationMessage = "Objectives require a description.";
                return;
            }

            if (string.IsNullOrWhiteSpace(objective.Status))
            {
                ValidationMessage = "Set a status for each objective.";
                return;
            }

            if (string.IsNullOrWhiteSpace(objective.Deadline))
            {
                ValidationMessage = "Provide a deadline for each objective.";
                return;
            }
        }

        ValidationMessage = null;
    }
}

public sealed class ClubVisionExpectationEditorItemViewModel : ObservableObject
{
    private string _objective;
    private string _competition;
    private string _priority;
    private string _status;
    private string _deadline;
    private string? _notes;
    private string? _accent;

    public ClubVisionExpectationEditorItemViewModel(
        string id,
        string objective,
        string competition,
        string priority,
        string status,
        string deadline,
        string? notes,
        string? accent)
    {
        Id = id;
        _objective = objective;
        _competition = competition;
        _priority = priority;
        _status = status;
        _deadline = deadline;
        _notes = notes;
        _accent = accent;
    }

    public string Id { get; }

    public string Objective
    {
        get => _objective;
        set => SetProperty(ref _objective, value);
    }

    public string Competition
    {
        get => _competition;
        set => SetProperty(ref _competition, value);
    }

    public string Priority
    {
        get => _priority;
        set => SetProperty(ref _priority, value);
    }

    public string Status
    {
        get => _status;
        set => SetProperty(ref _status, value);
    }

    public string Deadline
    {
        get => _deadline;
        set => SetProperty(ref _deadline, value);
    }

    public string? Notes
    {
        get => _notes;
        set => SetProperty(ref _notes, value);
    }

    public string? Accent
    {
        get => _accent;
        set => SetProperty(ref _accent, value);
    }

    public ClubVisionExpectationSnapshot ToSnapshot() => new(
        Id,
        Objective.Trim(),
        string.IsNullOrWhiteSpace(Competition) ? "" : Competition.Trim(),
        string.IsNullOrWhiteSpace(Priority) ? "Medium" : Priority.Trim(),
        Status.Trim(),
        Deadline.Trim(),
        string.IsNullOrWhiteSpace(Notes) ? null : Notes.Trim(),
        string.IsNullOrWhiteSpace(Accent) ? null : Accent.Trim());

    public static ClubVisionExpectationEditorItemViewModel FromSnapshot(ClubVisionExpectationSnapshot snapshot)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new ClubVisionExpectationEditorItemViewModel(
            snapshot.Id,
            snapshot.Objective,
            snapshot.Competition,
            snapshot.Priority,
            snapshot.Status,
            snapshot.Deadline,
            snapshot.Notes,
            snapshot.Accent);
    }
}
