using System;
using FMUI.Wpf.Collections;

namespace FMUI.Wpf.Modules;

public sealed class MediaModule : IGameModule
{
    public const string ModuleIdentifier = "Media";
    private const int ProspectCapacity = 12;

    private readonly ArrayCollection<YouthProspect> _prospects;
    private ModuleState _state;
    private bool _dirty;

    public event EventHandler<ModuleEventArgs>? ModuleEvent;

    public MediaModule()
    {
        _prospects = new ArrayCollection<YouthProspect>(ProspectCapacity);
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
        SeedProspects();
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

        if ((gameTime.FrameCount & 0x7F) == 0)
        {
            RotateSpotlight();
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
        _prospects.Clear();
        _state = ModuleState.Uninitialized;
        _dirty = false;
    }

    public void LoadData()
    {
    }

    public void SaveData()
    {
    }

    public int CopyProspects(Span<YouthProspectView> destination)
    {
        var span = _prospects.AsSpan();
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
            ref readonly var prospect = ref span[i];
            destination[i] = new YouthProspectView(
                prospect.PlayerId,
                prospect.FirstNameId,
                prospect.LastNameId,
                prospect.Position,
                prospect.Overview,
                prospect.Rating,
                prospect.ExcitementLevel);
        }

        return length;
    }

    private void SeedProspects()
    {
        _prospects.Clear();
        for (int i = 0; i < 10; i++)
        {
            ref var prospect = ref _prospects.AddReference();
            prospect.PlayerId = 4000 + i;
            prospect.FirstNameId = (ushort)(50 + i);
            prospect.LastNameId = (ushort)(90 + i);
            prospect.Position = PositionSeeds[i % PositionSeeds.Length];
            prospect.Overview = OverviewSeeds[i % OverviewSeeds.Length];
            prospect.Rating = (byte)(65 + ((i * 3) % 15));
            prospect.ExcitementLevel = (byte)(prospect.Rating / 10);
        }
    }

    private void RotateSpotlight()
    {
        var span = _prospects.AsSpan();
        int length = span.Length;
        for (int i = 0; i < length; i++)
        {
            ref var prospect = ref span[i];
            prospect.ExcitementLevel = (byte)((prospect.ExcitementLevel + 1) % 10);
        }

        _dirty = true;
    }

    private void Publish()
    {
        _dirty = false;
        ModuleEvent?.Invoke(this, new ModuleEventArgs
        {
            EventType = MediaModuleEvents.StateUpdated,
            Data = null
        });
    }

    private struct YouthProspect
    {
        public int PlayerId;
        public ushort FirstNameId;
        public ushort LastNameId;
        public string Position;
        public string Overview;
        public byte Rating;
        public byte ExcitementLevel;
    }

    private static readonly string[] PositionSeeds =
    {
        "GK",
        "RB",
        "CB",
        "LB",
        "DM",
        "CM",
        "AM",
        "ST"
    };

    private static readonly string[] OverviewSeeds =
    {
        "Explosive pace with room to grow",
        "Technically gifted midfield hub",
        "Tall centre-back with leadership",
        "Creative winger with flair"
    };

    public readonly struct YouthProspectView
    {
        public YouthProspectView(
            int playerId,
            ushort firstNameId,
            ushort lastNameId,
            string position,
            string overview,
            byte rating,
            byte excitementLevel)
        {
            PlayerId = playerId;
            FirstNameId = firstNameId;
            LastNameId = lastNameId;
            Position = position;
            Overview = overview;
            Rating = rating;
            ExcitementLevel = excitementLevel;
        }

        public int PlayerId { get; }
        public ushort FirstNameId { get; }
        public ushort LastNameId { get; }
        public string Position { get; }
        public string Overview { get; }
        public byte Rating { get; }
        public byte ExcitementLevel { get; }
    }
}

public static class MediaModuleEvents
{
    public const string StateUpdated = "Media.StateUpdated";
}
