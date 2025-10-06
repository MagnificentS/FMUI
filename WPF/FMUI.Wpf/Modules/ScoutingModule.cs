using System;
using FMUI.Wpf.Collections;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.Modules;

public sealed class ScoutingModule : IGameModule
{
    public const string ModuleIdentifier = "Scouting";
    private const int InitialAssignmentCapacity = 16;
    private const int InitialReportCapacity = 16;

    private readonly ArrayCollection<ScoutAssignment> _assignments;
    private readonly ArrayCollection<ScoutReport> _reports;
    private ModuleState _state;
    private bool _stateDirty;
    private readonly Random _random;

    public event EventHandler<ModuleEventArgs>? ModuleEvent;

    public ScoutingModule()
    {
        _assignments = new ArrayCollection<ScoutAssignment>(InitialAssignmentCapacity);
        _reports = new ArrayCollection<ScoutReport>(InitialReportCapacity);
        _state = ModuleState.Uninitialized;
        _stateDirty = false;
        _random = new Random(1979);
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
        SeedAssignments();
        SeedReports();
        _state = ModuleState.Ready;
        PublishState();
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
            AdvanceAssignments();
        }

        if (_stateDirty)
        {
            PublishState();
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
        _assignments.Clear();
        _reports.Clear();
        _state = ModuleState.Uninitialized;
        _stateDirty = false;
    }

    public void LoadData()
    {
        // Hook for persistence integration.
    }

    public void SaveData()
    {
        // Hook for persistence integration.
    }

    public int CopyAssignments(Span<ScoutAssignmentView> destination)
    {
        var span = _assignments.AsSpan();
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
            ref readonly var assignment = ref span[i];
            destination[i] = new ScoutAssignmentView(
                assignment.AssignmentId,
                assignment.ScoutFirstNameId,
                assignment.ScoutLastNameId,
                assignment.Region,
                assignment.FocusArea,
                assignment.ProgressPercent,
                assignment.PriorityLevel);
        }

        return length;
    }

    public int CopyReports(Span<ScoutReportView> destination)
    {
        var span = _reports.AsSpan();
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
            ref readonly var report = ref span[i];
            destination[i] = new ScoutReportView(
                report.PlayerId,
                report.PositionCode,
                report.OverallRating,
                report.PotentialRating,
                report.StatusLabel,
                report.IsPriorityTarget);
        }

        return length;
    }

    private void SeedAssignments()
    {
        _assignments.Clear();
        for (int i = 0; i < 12; i++)
        {
            ref var assignment = ref _assignments.AddReference();
            assignment.AssignmentId = (ushort)(100 + i);
            assignment.ScoutFirstNameId = (ushort)(10 + i);
            assignment.ScoutLastNameId = (ushort)(60 + i);
            assignment.Region = RegionSeeds[i % RegionSeeds.Length];
            assignment.FocusArea = FocusSeeds[i % FocusSeeds.Length];
            assignment.ProgressPercent = (byte)(35 + ((i * 17) % 55));
            assignment.PriorityLevel = (byte)((i % 3) + 1);
        }
    }

    private void SeedReports()
    {
        _reports.Clear();
        for (int i = 0; i < 16; i++)
        {
            ref var report = ref _reports.AddReference();
            report.PlayerId = 30_000 + i;
            report.PositionCode = PositionSeeds[i % PositionSeeds.Length];
            report.OverallRating = (byte)(60 + ((i * 9) % 20));
            report.PotentialRating = (byte)(report.OverallRating + 10);
            report.StatusLabel = StatusSeeds[i % StatusSeeds.Length];
            report.IsPriorityTarget = (i & 1) == 0;
        }
    }

    private void AdvanceAssignments()
    {
        var span = _assignments.AsSpan();
        int length = span.Length;
        for (int i = 0; i < length; i++)
        {
            ref var assignment = ref span[i];
            assignment.ProgressPercent = (byte)Math.Min(100, assignment.ProgressPercent + (byte)_random.Next(1, 5));
        }

        _stateDirty = true;
    }

    private void PublishState()
    {
        _stateDirty = false;
        ModuleEvent?.Invoke(this, new ModuleEventArgs
        {
            EventType = ScoutingModuleEvents.StateUpdated,
            Data = null
        });
    }

    private static readonly string[] RegionSeeds =
    {
        "Western Europe",
        "South America",
        "Eastern Europe",
        "Africa",
        "Scandinavia",
        "Central Europe"
    };

    private static readonly string[] FocusSeeds =
    {
        "Ball Playing Defenders",
        "Dynamic Wingers",
        "Complete Forwards",
        "Deep Lying Playmakers",
        "Box-to-Box Midfielders"
    };

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

    private static readonly string[] StatusSeeds =
    {
        "Highly Recommended",
        "Worth Monitoring",
        "Limited Interest"
    };

    private struct ScoutAssignment
    {
        public ushort AssignmentId;
        public ushort ScoutFirstNameId;
        public ushort ScoutLastNameId;
        public string Region;
        public string FocusArea;
        public byte ProgressPercent;
        public byte PriorityLevel;
    }

    private struct ScoutReport
    {
        public int PlayerId;
        public string PositionCode;
        public byte OverallRating;
        public byte PotentialRating;
        public string StatusLabel;
        public bool IsPriorityTarget;
    }

    public readonly struct ScoutAssignmentView
    {
        public ScoutAssignmentView(
            ushort assignmentId,
            ushort scoutFirstNameId,
            ushort scoutLastNameId,
            string region,
            string focusArea,
            byte progressPercent,
            byte priorityLevel)
        {
            AssignmentId = assignmentId;
            ScoutFirstNameId = scoutFirstNameId;
            ScoutLastNameId = scoutLastNameId;
            Region = region;
            FocusArea = focusArea;
            ProgressPercent = progressPercent;
            PriorityLevel = priorityLevel;
        }

        public ushort AssignmentId { get; }
        public ushort ScoutFirstNameId { get; }
        public ushort ScoutLastNameId { get; }
        public string Region { get; }
        public string FocusArea { get; }
        public byte ProgressPercent { get; }
        public byte PriorityLevel { get; }
    }

    public readonly struct ScoutReportView
    {
        public ScoutReportView(
            int playerId,
            string positionCode,
            byte overallRating,
            byte potentialRating,
            string statusLabel,
            bool isPriorityTarget)
        {
            PlayerId = playerId;
            PositionCode = positionCode;
            OverallRating = overallRating;
            PotentialRating = potentialRating;
            StatusLabel = statusLabel;
            IsPriorityTarget = isPriorityTarget;
        }

        public int PlayerId { get; }
        public string PositionCode { get; }
        public byte OverallRating { get; }
        public byte PotentialRating { get; }
        public string StatusLabel { get; }
        public bool IsPriorityTarget { get; }
    }
}

public static class ScoutingModuleEvents
{
    public const string StateUpdated = "Scouting.StateUpdated";
}
