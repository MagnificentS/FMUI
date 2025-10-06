using System;
using FMUI.Wpf.Collections;

namespace FMUI.Wpf.Modules;

public sealed class CompetitionModule : IGameModule
{
    public const string ModuleIdentifier = "Competition";
    private const int TableCapacity = 20;

    private readonly ArrayCollection<TableEntry> _table;
    private ModuleState _state;
    private bool _dirty;

    public event EventHandler<ModuleEventArgs>? ModuleEvent;

    public CompetitionModule()
    {
        _table = new ArrayCollection<TableEntry>(TableCapacity);
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
        SeedTable();
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

        if ((gameTime.FrameCount & 0x1FF) == 0)
        {
            RotateForm();
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
        _table.Clear();
        _state = ModuleState.Uninitialized;
        _dirty = false;
    }

    public void LoadData()
    {
    }

    public void SaveData()
    {
    }

    public int CopyTable(Span<TableView> destination)
    {
        var span = _table.AsSpan();
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
            destination[i] = new TableView(
                (byte)(i + 1),
                entry.ClubName,
                entry.Played,
                entry.Wins,
                entry.Draws,
                entry.Losses,
                entry.GoalDifference,
                entry.Points);
        }

        return length;
    }

    private void SeedTable()
    {
        _table.Clear();
        for (int i = 0; i < SeedNames.Length; i++)
        {
            ref var entry = ref _table.AddReference();
            entry.ClubName = SeedNames[i];
            entry.Played = 12;
            entry.Wins = (byte)(8 - (i % 4));
            entry.Draws = (byte)(2 + (i % 3));
            entry.Losses = (byte)(2 + (i % 2));
            entry.GoalDifference = (short)(18 - (i * 2));
            entry.Points = (byte)(entry.Wins * 3 + entry.Draws);
        }
    }

    private void RotateForm()
    {
        var span = _table.AsSpan();
        int length = span.Length;
        if (length == 0)
        {
            return;
        }

        for (int i = 0; i < length; i++)
        {
            ref var entry = ref span[i];
            entry.Points = (byte)Math.Max(0, entry.Points - (i % 2));
        }

        _dirty = true;
    }

    private void Publish()
    {
        _dirty = false;
        ModuleEvent?.Invoke(this, new ModuleEventArgs
        {
            EventType = CompetitionModuleEvents.StateUpdated,
            Data = null
        });
    }

    private struct TableEntry
    {
        public string ClubName;
        public byte Played;
        public byte Wins;
        public byte Draws;
        public byte Losses;
        public short GoalDifference;
        public byte Points;
    }

    private static readonly string[] SeedNames =
    {
        "Arsenal",
        "Manchester City",
        "Liverpool",
        "Newcastle",
        "Manchester United",
        "Tottenham",
        "Chelsea",
        "Brighton",
        "Aston Villa",
        "West Ham"
    };

    public readonly struct TableView
    {
        public TableView(
            byte position,
            string clubName,
            byte played,
            byte wins,
            byte draws,
            byte losses,
            short goalDifference,
            byte points)
        {
            Position = position;
            ClubName = clubName;
            Played = played;
            Wins = wins;
            Draws = draws;
            Losses = losses;
            GoalDifference = goalDifference;
            Points = points;
        }

        public byte Position { get; }
        public string ClubName { get; }
        public byte Played { get; }
        public byte Wins { get; }
        public byte Draws { get; }
        public byte Losses { get; }
        public short GoalDifference { get; }
        public byte Points { get; }
    }
}

public static class CompetitionModuleEvents
{
    public const string StateUpdated = "Competition.StateUpdated";
}
