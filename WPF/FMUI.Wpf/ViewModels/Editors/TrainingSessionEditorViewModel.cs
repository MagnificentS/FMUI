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

public sealed class TrainingSessionEditorViewModel : CardEditorViewModel
{
    private static readonly string[] DefaultDays =
    {
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    };

    private static readonly string[] DefaultSlots =
    {
        "Morning",
        "Afternoon",
        "Evening"
    };

    private readonly Func<IReadOnlyList<TrainingSessionDetailSnapshot>, Task> _persistAsync;
    private readonly RelayCommand _removeSessionCommand;
    private readonly RelayCommand _moveUpCommand;
    private readonly RelayCommand _moveDownCommand;
    private TrainingSessionEditorItemViewModel? _selectedSession;
    private string? _validationMessage;

    public TrainingSessionEditorViewModel(
        string title,
        string? subtitle,
        IReadOnlyList<TrainingSessionDetailSnapshot>? sessions,
        Func<IReadOnlyList<TrainingSessionDetailSnapshot>, Task> persistAsync)
        : base(title, subtitle)
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));

        Sessions = new ObservableCollection<TrainingSessionEditorItemViewModel>(
            sessions?.Select(TrainingSessionEditorItemViewModel.FromSnapshot)
            ?? Enumerable.Empty<TrainingSessionEditorItemViewModel>());
        Sessions.CollectionChanged += OnSessionsCollectionChanged;

        foreach (var session in Sessions)
        {
            session.PropertyChanged += OnSessionPropertyChanged;
        }

        DayOptions = Array.AsReadOnly(DefaultDays);
        SlotOptions = Array.AsReadOnly(DefaultSlots);

        _removeSessionCommand = new RelayCommand(_ => RemoveSelectedSession(), _ => SelectedSession is not null);
        _moveUpCommand = new RelayCommand(_ => MoveSelected(-1), _ => CanMove(-1));
        _moveDownCommand = new RelayCommand(_ => MoveSelected(1), _ => CanMove(1));
        AddSessionCommand = new RelayCommand(_ => AddSession());

        if (Sessions.Count > 0)
        {
            SelectedSession = Sessions[0];
        }

        UpdateValidation();
    }

    public ObservableCollection<TrainingSessionEditorItemViewModel> Sessions { get; }

    public IReadOnlyList<string> DayOptions { get; }

    public IReadOnlyList<string> SlotOptions { get; }

    public TrainingSessionEditorItemViewModel? SelectedSession
    {
        get => _selectedSession;
        set
        {
            if (SetProperty(ref _selectedSession, value))
            {
                _removeSessionCommand.RaiseCanExecuteChanged();
                _moveUpCommand.RaiseCanExecuteChanged();
                _moveDownCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public ICommand AddSessionCommand { get; }

    public ICommand RemoveSessionCommand => _removeSessionCommand;

    public ICommand MoveUpCommand => _moveUpCommand;

    public ICommand MoveDownCommand => _moveDownCommand;

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
        var snapshot = Sessions
            .Select(session => session.ToSnapshot())
            .ToList();

        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private void AddSession()
    {
        var baseDay = SelectedSession?.Day;
        var day = !string.IsNullOrWhiteSpace(baseDay) ? baseDay! : DayOptions[0];
        var slot = GetAvailableSlot(day) ?? SlotOptions[0];

        var session = new TrainingSessionEditorItemViewModel(
            Guid.NewGuid().ToString("N"),
            day,
            slot,
            string.Empty,
            string.Empty,
            string.Empty);

        session.PropertyChanged += OnSessionPropertyChanged;
        Sessions.Add(session);
        SelectedSession = session;
        UpdateValidation();
    }

    private void RemoveSelectedSession()
    {
        var session = SelectedSession;
        if (session is null)
        {
            return;
        }

        session.PropertyChanged -= OnSessionPropertyChanged;
        var index = Sessions.IndexOf(session);
        Sessions.Remove(session);

        if (Sessions.Count > 0)
        {
            var target = Math.Clamp(index, 0, Sessions.Count - 1);
            SelectedSession = Sessions[target];
        }
        else
        {
            SelectedSession = null;
        }

        UpdateValidation();
    }

    private bool CanMove(int direction)
    {
        if (SelectedSession is null)
        {
            return false;
        }

        var index = Sessions.IndexOf(SelectedSession);
        if (index < 0)
        {
            return false;
        }

        var target = index + direction;
        return target >= 0 && target < Sessions.Count;
    }

    private void MoveSelected(int direction)
    {
        if (SelectedSession is null)
        {
            return;
        }

        var index = Sessions.IndexOf(SelectedSession);
        var target = index + direction;
        if (index < 0 || target < 0 || target >= Sessions.Count)
        {
            return;
        }

        Sessions.Move(index, target);
        SelectedSession = Sessions[target];
        UpdateValidation();
    }

    private void OnSessionsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.OldItems is not null)
        {
            foreach (TrainingSessionEditorItemViewModel item in e.OldItems)
            {
                item.PropertyChanged -= OnSessionPropertyChanged;
            }
        }

        if (e.NewItems is not null)
        {
            foreach (TrainingSessionEditorItemViewModel item in e.NewItems)
            {
                item.PropertyChanged += OnSessionPropertyChanged;
            }
        }

        UpdateValidation();
    }

    private void OnSessionPropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        UpdateValidation();
    }

    private void UpdateValidation()
    {
        if (Sessions.Count == 0)
        {
            ValidationMessage = "Add at least one training session before saving.";
            NotifyCanSaveChanged();
            return;
        }

        if (Sessions.Any(session => string.IsNullOrWhiteSpace(session.Day) || string.IsNullOrWhiteSpace(session.Slot)))
        {
            ValidationMessage = "Assign a day and slot to every session.";
            NotifyCanSaveChanged();
            return;
        }

        if (Sessions.Any(session => string.IsNullOrWhiteSpace(session.Activity)))
        {
            ValidationMessage = "Provide an activity for every session.";
            NotifyCanSaveChanged();
            return;
        }

        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var session in Sessions)
        {
            var key = $"{session.Day.Trim()}::{session.Slot.Trim()}";
            if (!seen.Add(key))
            {
                ValidationMessage = "Each day and slot combination can only be scheduled once.";
                NotifyCanSaveChanged();
                return;
            }
        }

        ValidationMessage = null;
        NotifyCanSaveChanged();
    }

    private string? GetAvailableSlot(string day)
    {
        foreach (var slot in SlotOptions)
        {
            var exists = Sessions.Any(session =>
                string.Equals(session.Day, day, StringComparison.OrdinalIgnoreCase) &&
                string.Equals(session.Slot, slot, StringComparison.OrdinalIgnoreCase));

            if (!exists)
            {
                return slot;
            }
        }

        return null;
    }
}

public sealed class TrainingSessionEditorItemViewModel : ObservableObject
{
    private string _day;
    private string _slot;
    private string _activity;
    private string? _focus;
    private string? _intensity;

    public TrainingSessionEditorItemViewModel(
        string id,
        string day,
        string slot,
        string activity,
        string? focus,
        string? intensity)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        _day = day ?? string.Empty;
        _slot = slot ?? string.Empty;
        _activity = activity ?? string.Empty;
        _focus = focus;
        _intensity = intensity;
    }

    public string Id { get; }

    public string Day
    {
        get => _day;
        set => SetProperty(ref _day, value);
    }

    public string Slot
    {
        get => _slot;
        set => SetProperty(ref _slot, value);
    }

    public string Activity
    {
        get => _activity;
        set => SetProperty(ref _activity, value);
    }

    public string? Focus
    {
        get => _focus;
        set => SetProperty(ref _focus, value);
    }

    public string? Intensity
    {
        get => _intensity;
        set => SetProperty(ref _intensity, value);
    }

    public static TrainingSessionEditorItemViewModel FromSnapshot(TrainingSessionDetailSnapshot snapshot)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        return new TrainingSessionEditorItemViewModel(
            snapshot.Id,
            snapshot.Day,
            snapshot.Slot,
            snapshot.Activity,
            snapshot.Focus,
            snapshot.Intensity);
    }

    public TrainingSessionDetailSnapshot ToSnapshot()
    {
        return new TrainingSessionDetailSnapshot(
            Id,
            Day,
            Slot,
            Activity,
            string.IsNullOrWhiteSpace(Focus) ? null : Focus,
            string.IsNullOrWhiteSpace(Intensity) ? null : Intensity);
    }
}
