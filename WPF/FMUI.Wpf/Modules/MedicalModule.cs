using System;
using FMUI.Wpf.Collections;

namespace FMUI.Wpf.Modules;

public sealed class MedicalModule : IGameModule
{
    public const string ModuleIdentifier = "Medical";
    private const int InjuryCapacity = 16;

    private readonly ArrayCollection<InjuryEntry> _injuries;
    private ModuleState _state;
    private bool _dirty;

    public event EventHandler<ModuleEventArgs>? ModuleEvent;

    public MedicalModule()
    {
        _injuries = new ArrayCollection<InjuryEntry>(InjuryCapacity);
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
        SeedInjuries();
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

        if ((gameTime.FrameCount & 0xFF) == 0)
        {
            AdvanceRecovery();
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
        _injuries.Clear();
        _state = ModuleState.Uninitialized;
        _dirty = false;
    }

    public void LoadData()
    {
    }

    public void SaveData()
    {
    }

    public int CopyInjuries(Span<InjuryView> destination)
    {
        var span = _injuries.AsSpan();
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
            ref readonly var entry = ref span[i];
            destination[i] = new InjuryView(
                entry.PlayerId,
                entry.FirstNameId,
                entry.LastNameId,
                entry.Injury,
                entry.Status,
                entry.ExpectedReturnWeeks,
                entry.IsDoubtful);
        }

        return length;
    }

    private void AdvanceRecovery()
    {
        var span = _injuries.AsSpan();
        int length = span.Length;
        for (int i = 0; i < length; i++)
        {
            ref var entry = ref span[i];
            if (entry.ExpectedReturnWeeks > 0)
            {
                entry.ExpectedReturnWeeks--;
                if (entry.ExpectedReturnWeeks == 0)
                {
                    entry.Status = "Match Fit";
                    entry.IsDoubtful = false;
                }
            }
        }

        _dirty = true;
    }

    private void SeedInjuries()
    {
        _injuries.Clear();

        ref var first = ref _injuries.AddReference();
        first.PlayerId = 2010;
        first.FirstNameId = 32;
        first.LastNameId = 120;
        first.Injury = "Sprained Knee Ligaments";
        first.Status = "Out";
        first.ExpectedReturnWeeks = 3;
        first.IsDoubtful = false;

        ref var second = ref _injuries.AddReference();
        second.PlayerId = 2011;
        second.FirstNameId = 17;
        second.LastNameId = 88;
        second.Injury = "Hamstring Strain";
        second.Status = "Doubtful";
        second.ExpectedReturnWeeks = 1;
        second.IsDoubtful = true;

        ref var third = ref _injuries.AddReference();
        third.PlayerId = 2012;
        third.FirstNameId = 43;
        third.LastNameId = 133;
        third.Injury = "Groin Tightness";
        third.Status = "Match Fit";
        third.ExpectedReturnWeeks = 0;
        third.IsDoubtful = false;
    }

    private void Publish()
    {
        _dirty = false;
        ModuleEvent?.Invoke(this, new ModuleEventArgs
        {
            EventType = MedicalModuleEvents.StateUpdated,
            Data = null
        });
    }

    private struct InjuryEntry
    {
        public int PlayerId;
        public ushort FirstNameId;
        public ushort LastNameId;
        public string Injury;
        public string Status;
        public byte ExpectedReturnWeeks;
        public bool IsDoubtful;
    }

    public readonly struct InjuryView
    {
        public InjuryView(
            int playerId,
            ushort firstNameId,
            ushort lastNameId,
            string injury,
            string status,
            byte expectedReturnWeeks,
            bool isDoubtful)
        {
            PlayerId = playerId;
            FirstNameId = firstNameId;
            LastNameId = lastNameId;
            Injury = injury;
            Status = status;
            ExpectedReturnWeeks = expectedReturnWeeks;
            IsDoubtful = isDoubtful;
        }

        public int PlayerId { get; }
        public ushort FirstNameId { get; }
        public ushort LastNameId { get; }
        public string Injury { get; }
        public string Status { get; }
        public byte ExpectedReturnWeeks { get; }
        public bool IsDoubtful { get; }
    }
}

public static class MedicalModuleEvents
{
    public const string StateUpdated = "Medical.StateUpdated";
}
