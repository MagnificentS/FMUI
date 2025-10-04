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

public sealed class ClubVisionRoadmapEditorViewModel : CardEditorViewModel
{
    private readonly Func<ClubVisionRoadmapSnapshot, Task> _persistAsync;
    private readonly RelayCommand _removePhaseCommand;
    private readonly RelayCommand _moveUpCommand;
    private readonly RelayCommand _moveDownCommand;
    private ClubVisionRoadmapPhaseEditorViewModel? _selectedPhase;
    private string? _validationMessage;

    public ClubVisionRoadmapEditorViewModel(
        string title,
        string? subtitle,
        ClubVisionRoadmapSnapshot roadmap,
        Func<ClubVisionRoadmapSnapshot, Task> persistAsync)
        : base(title, subtitle)
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        Phases = new ObservableCollection<ClubVisionRoadmapPhaseEditorViewModel>(
            roadmap.Phases?.Select(ClubVisionRoadmapPhaseEditorViewModel.FromSnapshot)
            ?? Enumerable.Empty<ClubVisionRoadmapPhaseEditorViewModel>());

        foreach (var phase in Phases)
        {
            phase.PropertyChanged += OnPhasePropertyChanged;
        }

        StatusOptions = new ObservableCollection<string>(roadmap.StatusOptions ?? Array.Empty<string>());
        PillOptions = new ObservableCollection<string>(roadmap.PillOptions ?? Array.Empty<string>());

        AddPhaseCommand = new RelayCommand(_ => AddPhase());
        _removePhaseCommand = new RelayCommand(_ => RemoveSelectedPhase(), _ => SelectedPhase is not null);
        _moveUpCommand = new RelayCommand(_ => MoveSelected(-1), _ => CanMove(-1));
        _moveDownCommand = new RelayCommand(_ => MoveSelected(1), _ => CanMove(1));

        if (Phases.Count > 0)
        {
            SelectedPhase = Phases[0];
        }

        UpdateValidation();
    }

    public ObservableCollection<ClubVisionRoadmapPhaseEditorViewModel> Phases { get; }

    public ObservableCollection<string> StatusOptions { get; }

    public ObservableCollection<string> PillOptions { get; }

    public ICommand AddPhaseCommand { get; }

    public ICommand RemovePhaseCommand => _removePhaseCommand;

    public ICommand MoveUpCommand => _moveUpCommand;

    public ICommand MoveDownCommand => _moveDownCommand;

    public ClubVisionRoadmapPhaseEditorViewModel? SelectedPhase
    {
        get => _selectedPhase;
        set
        {
            if (SetProperty(ref _selectedPhase, value))
            {
                _removePhaseCommand.RaiseCanExecuteChanged();
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
        var phases = Phases
            .Select(phase => phase.ToSnapshot())
            .ToList();

        var statusOptions = StatusOptions
            .Concat(phases.Select(phase => phase.Status))
            .Where(option => !string.IsNullOrWhiteSpace(option))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var pillOptions = PillOptions
            .Concat(phases.Select(phase => phase.Pill))
            .Where(option => !string.IsNullOrWhiteSpace(option))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var snapshot = new ClubVisionRoadmapSnapshot(phases, statusOptions, pillOptions);
        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private void AddPhase()
    {
        var phase = new ClubVisionRoadmapPhaseEditorViewModel(
            Guid.NewGuid().ToString("N"),
            "New milestone",
            "TBD",
            StatusOptions.FirstOrDefault() ?? "Planned",
            string.Empty,
            string.Empty,
            string.Empty);

        phase.PropertyChanged += OnPhasePropertyChanged;
        Phases.Add(phase);
        SelectedPhase = phase;
        UpdateValidation();
    }

    private void RemoveSelectedPhase()
    {
        var phase = SelectedPhase;
        if (phase is null)
        {
            return;
        }

        phase.PropertyChanged -= OnPhasePropertyChanged;
        var index = Phases.IndexOf(phase);
        Phases.Remove(phase);

        if (Phases.Count > 0)
        {
            var target = Math.Clamp(index, 0, Phases.Count - 1);
            SelectedPhase = Phases[target];
        }
        else
        {
            SelectedPhase = null;
        }

        UpdateValidation();
    }

    private bool CanMove(int direction)
    {
        if (SelectedPhase is null)
        {
            return false;
        }

        var index = Phases.IndexOf(SelectedPhase);
        var target = index + direction;
        return index >= 0 && target >= 0 && target < Phases.Count;
    }

    private void MoveSelected(int direction)
    {
        if (SelectedPhase is null)
        {
            return;
        }

        var index = Phases.IndexOf(SelectedPhase);
        var target = index + direction;
        if (index < 0 || target < 0 || target >= Phases.Count)
        {
            return;
        }

        Phases.Move(index, target);
        UpdateValidation();
    }

    private void OnPhasePropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName is nameof(ClubVisionRoadmapPhaseEditorViewModel.Title)
            or nameof(ClubVisionRoadmapPhaseEditorViewModel.Status)
            or nameof(ClubVisionRoadmapPhaseEditorViewModel.Timeline))
        {
            UpdateValidation();
        }
    }

    private void UpdateValidation()
    {
        if (Phases.Count == 0)
        {
            ValidationMessage = "Add at least one milestone to continue.";
            return;
        }

        foreach (var phase in Phases)
        {
            if (string.IsNullOrWhiteSpace(phase.Title))
            {
                ValidationMessage = "Milestones require a title.";
                return;
            }

            if (string.IsNullOrWhiteSpace(phase.Status))
            {
                ValidationMessage = "Select a status for each milestone.";
                return;
            }

            if (string.IsNullOrWhiteSpace(phase.Timeline))
            {
                ValidationMessage = "Provide a timeline for each milestone.";
                return;
            }
        }

        ValidationMessage = null;
    }
}

public sealed class ClubVisionRoadmapPhaseEditorViewModel : ObservableObject
{
    private string _title;
    private string _timeline;
    private string _status;
    private string? _description;
    private string? _accent;
    private string? _pill;

    public ClubVisionRoadmapPhaseEditorViewModel(
        string id,
        string title,
        string timeline,
        string status,
        string? description,
        string? accent,
        string? pill)
    {
        Id = id;
        _title = title;
        _timeline = timeline;
        _status = status;
        _description = description;
        _accent = accent;
        _pill = pill;
    }

    public string Id { get; }

    public string Title
    {
        get => _title;
        set => SetProperty(ref _title, value);
    }

    public string Timeline
    {
        get => _timeline;
        set => SetProperty(ref _timeline, value);
    }

    public string Status
    {
        get => _status;
        set => SetProperty(ref _status, value);
    }

    public string? Description
    {
        get => _description;
        set => SetProperty(ref _description, value);
    }

    public string? Accent
    {
        get => _accent;
        set => SetProperty(ref _accent, value);
    }

    public string? Pill
    {
        get => _pill;
        set => SetProperty(ref _pill, value);
    }

    public ClubVisionRoadmapPhaseSnapshot ToSnapshot() => new(
        Id,
        Title.Trim(),
        Timeline.Trim(),
        Status.Trim(),
        string.IsNullOrWhiteSpace(Description) ? null : Description.Trim(),
        string.IsNullOrWhiteSpace(Accent) ? null : Accent.Trim(),
        string.IsNullOrWhiteSpace(Pill) ? null : Pill.Trim());

    public static ClubVisionRoadmapPhaseEditorViewModel FromSnapshot(ClubVisionRoadmapPhaseSnapshot snapshot)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new ClubVisionRoadmapPhaseEditorViewModel(
            snapshot.Id,
            snapshot.Title,
            snapshot.Timeline,
            snapshot.Status,
            snapshot.Description,
            snapshot.Accent,
            snapshot.Pill);
    }
}
