using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class TrainingCalendarViewModel : ObservableObject
{
    private readonly IClubDataService _clubDataService;
    private readonly IReadOnlyList<string> _days;
    private readonly IReadOnlyList<string> _slots;
    private readonly Dictionary<string, TrainingCalendarSlotViewModel> _slotLookup;
    private bool _isBusy;
    private string? _statusMessage;

    public TrainingCalendarViewModel(TrainingCalendarDefinition definition, IClubDataService clubDataService)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _days = definition.Days?.Count > 0 ? definition.Days : Array.Empty<string>();
        _slots = definition.Slots?.Count > 0 ? definition.Slots : Array.Empty<string>();
        _slotLookup = new Dictionary<string, TrainingCalendarSlotViewModel>(StringComparer.OrdinalIgnoreCase);

        Days = new ObservableCollection<TrainingCalendarDayViewModel>();

        foreach (var day in _days)
        {
            var dayViewModel = new TrainingCalendarDayViewModel(day, _slots);
            Days.Add(dayViewModel);

            foreach (var slot in dayViewModel.Slots)
            {
                _slotLookup[CreateSlotKey(day, slot.Slot)] = slot;
            }
        }

        if (definition.Sessions is { Count: > 0 })
        {
            foreach (var session in definition.Sessions)
            {
                var sessionViewModel = new TrainingCalendarSessionViewModel(session);

                if (!TryGetSlot(session.Day, session.Slot, out var slotViewModel))
                {
                    continue;
                }

                slotViewModel.InsertSession(sessionViewModel, slotViewModel.Sessions.Count);
            }
        }
    }

    public ObservableCollection<TrainingCalendarDayViewModel> Days { get; }

    public IReadOnlyList<string> Slots => _slots;

    public bool IsBusy
    {
        get => _isBusy;
        private set
        {
            if (SetProperty(ref _isBusy, value))
            {
                OnPropertyChanged(nameof(CanInteract));
            }
        }
    }

    public bool CanInteract => !IsBusy;

    public string? StatusMessage
    {
        get => _statusMessage;
        private set
        {
            if (SetProperty(ref _statusMessage, value))
            {
                OnPropertyChanged(nameof(HasStatusMessage));
            }
        }
    }

    public bool HasStatusMessage => !string.IsNullOrWhiteSpace(StatusMessage);

    internal bool TryGetSlot(string day, string slot, out TrainingCalendarSlotViewModel slotViewModel)
    {
        return _slotLookup.TryGetValue(CreateSlotKey(day, slot), out slotViewModel!);
    }

    internal async Task<bool> MoveSessionAsync(TrainingCalendarSessionViewModel session, TrainingCalendarSlotViewModel targetSlot, int targetIndex)
    {
        if (session is null)
        {
            throw new ArgumentNullException(nameof(session));
        }

        if (targetSlot is null)
        {
            throw new ArgumentNullException(nameof(targetSlot));
        }

        if (IsBusy)
        {
            return false;
        }

        if (!TryGetSlot(session.Day, session.Slot, out var originalSlot))
        {
            return false;
        }

        var originalIndex = originalSlot.Sessions.IndexOf(session);
        if (originalIndex < 0)
        {
            return false;
        }

        if (ReferenceEquals(originalSlot, targetSlot))
        {
            if (targetIndex > originalSlot.Sessions.Count)
            {
                targetIndex = originalSlot.Sessions.Count;
            }

            if (targetIndex > originalIndex)
            {
                targetIndex--;
            }

            if (targetIndex == originalIndex)
            {
                return false;
            }
        }
        else
        {
            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            else if (targetIndex > targetSlot.Sessions.Count)
            {
                targetIndex = targetSlot.Sessions.Count;
            }
        }

        originalSlot.RemoveSession(session);
        targetSlot.InsertSession(session, targetIndex);

        try
        {
            IsBusy = true;
            StatusMessage = $"Moving to {targetSlot.Day} {targetSlot.Slot}...";

            var updatedSessions = Days
                .SelectMany(day => day.Slots.SelectMany(slot => slot.Sessions.Select(item => item.ToSnapshot())))
                .ToList();

            var ordered = TrainingCalendarFormatter.OrderSessions(updatedSessions);
            var overview = TrainingCalendarFormatter.BuildWeekOverview(ordered).ToList();

            await _clubDataService.UpdateAsync(snapshot =>
            {
                var calendar = snapshot.Training.Calendar with
                {
                    SessionDetails = ordered,
                    WeekOverview = overview
                };

                var training = snapshot.Training with { Calendar = calendar };
                return snapshot with { Training = training };
            }).ConfigureAwait(true);

            StatusMessage = $"Session moved to {targetSlot.Day} {targetSlot.Slot}.";
            return true;
        }
        catch (Exception ex)
        {
            // revert
            targetSlot.RemoveSession(session);
            originalSlot.InsertSession(session, originalIndex);
            StatusMessage = $"Unable to move session: {ex.Message}";
            return false;
        }
        finally
        {
            IsBusy = false;
        }
    }

    private static string CreateSlotKey(string day, string slot)
    {
        return $"{day}|{slot}";
    }
}

public sealed class TrainingCalendarDayViewModel : ObservableObject
{
    public TrainingCalendarDayViewModel(string day, IReadOnlyList<string> slots)
    {
        Day = day;
        Slots = new ObservableCollection<TrainingCalendarSlotViewModel>(
            slots?.Select(slot => new TrainingCalendarSlotViewModel(day, slot))
            ?? Array.Empty<TrainingCalendarSlotViewModel>());
    }

    public string Day { get; }

    public ObservableCollection<TrainingCalendarSlotViewModel> Slots { get; }
}

public sealed class TrainingCalendarSlotViewModel : ObservableObject
{
    public TrainingCalendarSlotViewModel(string day, string slot)
    {
        Day = day;
        Slot = slot;
        Sessions = new ObservableCollection<TrainingCalendarSessionViewModel>();
        Sessions.CollectionChanged += (_, __) => OnPropertyChanged(nameof(HasSessions));
    }

    public string Day { get; }

    public string Slot { get; }

    public ObservableCollection<TrainingCalendarSessionViewModel> Sessions { get; }

    public bool HasSessions => Sessions.Count > 0;

    internal void InsertSession(TrainingCalendarSessionViewModel session, int index)
    {
        if (session is null)
        {
            throw new ArgumentNullException(nameof(session));
        }

        if (index < 0 || index > Sessions.Count)
        {
            index = Sessions.Count;
        }

        Sessions.Insert(index, session);
        session.UpdatePosition(Day, Slot);
    }

    internal bool RemoveSession(TrainingCalendarSessionViewModel session)
    {
        if (session is null)
        {
            return false;
        }

        var index = Sessions.IndexOf(session);
        if (index < 0)
        {
            return false;
        }

        Sessions.RemoveAt(index);
        session.UpdatePosition(string.Empty, string.Empty);
        return true;
    }
}

public sealed class TrainingCalendarSessionViewModel : ObservableObject
{
    public TrainingCalendarSessionViewModel(TrainingCalendarSessionDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Id = definition.Id;
        Activity = definition.Activity;
        Focus = definition.Focus;
        Intensity = definition.Intensity;
        Day = definition.Day;
        Slot = definition.Slot;
    }

    public string Id { get; }

    public string Activity { get; }

    public string? Focus { get; }

    public string? Intensity { get; }

    public string Day { get; private set; }

    public string Slot { get; private set; }

    public string? FocusDisplay => string.IsNullOrWhiteSpace(Focus) ? null : Focus;

    public string? IntensityDisplay => string.IsNullOrWhiteSpace(Intensity) ? null : Intensity;

    public bool HasFocus => !string.IsNullOrWhiteSpace(Focus);

    public bool HasIntensity => !string.IsNullOrWhiteSpace(Intensity);

    public TrainingSessionDetailSnapshot ToSnapshot()
    {
        return new TrainingSessionDetailSnapshot(Id, Day, Slot, Activity, Focus, Intensity);
    }

    internal void UpdatePosition(string day, string slot)
    {
        if (!string.Equals(Day, day, StringComparison.OrdinalIgnoreCase))
        {
            Day = day;
            OnPropertyChanged(nameof(Day));
        }

        if (!string.Equals(Slot, slot, StringComparison.OrdinalIgnoreCase))
        {
            Slot = slot;
            OnPropertyChanged(nameof(Slot));
        }
    }
}
