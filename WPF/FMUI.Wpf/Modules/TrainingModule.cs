using System;
using FMUI.Wpf.Collections;

namespace FMUI.Wpf.Modules;

public sealed class TrainingModule : IGameModule
{
    public const string ModuleIdentifier = "Training";
    private const int SessionCapacity = 14;

    private readonly ArrayCollection<TrainingSession> _sessions;
    private ModuleState _state;
    private bool _dirty;

    public event EventHandler<ModuleEventArgs>? ModuleEvent;

    public TrainingModule()
    {
        _sessions = new ArrayCollection<TrainingSession>(SessionCapacity);
        _state = ModuleState.Uninitialized;
        _dirty = false;
    }

    public ModuleState State => _state;

    public string ModuleId => ModuleIdentifier;

    public void Initialize()
    {
        if (_state != ModuleState.Uninitialized)
        {
            return;
        }

        _state = ModuleState.Initializing;
        SeedSessions();
        _state = ModuleState.Ready;
        Publish();
    }

    public void Start()
    {
        if (_state == ModuleState.Ready || _state == ModuleState.Paused)
        {
            _state = ModuleState.Running;
        }
    }

    public void Update(GameTime gameTime)
    {
        if (_state != ModuleState.Running)
        {
            return;
        }

        if ((gameTime.FrameCount & 0x3F) == 0)
        {
            RotateFocus();
        }

        if (_dirty)
        {
            Publish();
        }
    }

    public void Stop()
    {
        if (_state == ModuleState.Running)
        {
            _state = ModuleState.Paused;
        }
    }

    public void Cleanup()
    {
        _sessions.Clear();
        _state = ModuleState.Uninitialized;
        _dirty = false;
    }

    public void LoadData()
    {
    }

    public void SaveData()
    {
    }

    public int CopySessions(Span<TrainingSessionView> destination)
    {
        var span = _sessions.AsSpan();
        int length = span.Length;
        if (length == 0)
        {
            return 0;
        }

        if (length > destination.Length)
        {
            length = destination.Length;
        }

        for (int i = 0; i < length; i++)
        {
            ref readonly var session = ref span[i];
            destination[i] = new TrainingSessionView(
                session.Day,
                session.TimeOfDay,
                session.Focus,
                session.Intensity,
                session.IsMatchPreparation);
        }

        return length;
    }

    private void SeedSessions()
    {
        _sessions.Clear();

        string[] focuses =
        {
            "Attacking Patterns",
            "Defensive Shape",
            "Transition Play",
            "Set Pieces",
            "Rest and Recovery",
            "Match Preview"
        };

        string[] intensities =
        {
            "High",
            "Medium",
            "Low"
        };

        for (int i = 0; i < 12; i++)
        {
            ref var session = ref _sessions.AddReference();
            session.Day = DaySeeds[i % DaySeeds.Length];
            session.TimeOfDay = TimeSeeds[i % TimeSeeds.Length];
            session.Focus = focuses[i % focuses.Length];
            session.Intensity = intensities[i % intensities.Length];
            session.IsMatchPreparation = (i % 5) == 0;
        }
    }

    private void RotateFocus()
    {
        var span = _sessions.AsSpan();
        int length = span.Length;
        for (int i = 0; i < length; i++)
        {
            ref var session = ref span[i];
            session.IsMatchPreparation = !session.IsMatchPreparation && (i % 4 == 0);
        }

        _dirty = true;
    }

    private void Publish()
    {
        _dirty = false;
        ModuleEvent?.Invoke(this, new ModuleEventArgs
        {
            EventType = TrainingModuleEvents.StateUpdated,
            Data = null
        });
    }

    private struct TrainingSession
    {
        public string Day;
        public string TimeOfDay;
        public string Focus;
        public string Intensity;
        public bool IsMatchPreparation;
    }

    private static readonly string[] DaySeeds =
    {
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    };

    private static readonly string[] TimeSeeds =
    {
        "AM",
        "PM",
        "Evening"
    };

    public readonly struct TrainingSessionView
    {
        public TrainingSessionView(string day, string timeOfDay, string focus, string intensity, bool isMatchPreparation)
        {
            Day = day;
            TimeOfDay = timeOfDay;
            Focus = focus;
            Intensity = intensity;
            IsMatchPreparation = isMatchPreparation;
        }

        public string Day { get; }
        public string TimeOfDay { get; }
        public string Focus { get; }
        public string Intensity { get; }
        public bool IsMatchPreparation { get; }
    }
}

public static class TrainingModuleEvents
{
    public const string StateUpdated = "Training.StateUpdated";
}
