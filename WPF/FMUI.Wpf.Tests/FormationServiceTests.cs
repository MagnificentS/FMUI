using System;
using System.IO;
using FMUI.Wpf.Database;
using FMUI.Wpf.Events;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.Tests;

[Category("Formation")]
public sealed class FormationServiceTests : IDisposable
{
    private PlayerDatabase? _database;
    private SquadService? _squadService;
    private EventSystem? _eventSystem;
    private FormationService? _formationService;
    private string? _databasePath;

    private static FormationChangedEvent s_lastFormationEvent;
    private static PlayerPositionChangedEvent s_lastPlayerEvent;
    private static int s_formationEvents;
    private static int s_playerEvents;

    [SetUp]
    public void SetUp()
    {
        ResetStatics();

        _databasePath = Path.Combine(Path.GetTempPath(), $"fmui-tests-{Guid.NewGuid():N}.db");
        _database = new PlayerDatabase(_databasePath);
        _squadService = new SquadService(_database);
        _eventSystem = new EventSystem();

        unsafe
        {
            _eventSystem.Subscribe<FormationChangedEvent>(EventCatalog.Formation.FormationChanged, &OnFormationChanged, null);
            _eventSystem.Subscribe<PlayerPositionChangedEvent>(EventCatalog.Formation.PlayerPositionChanged, &OnPlayerPositionChanged, null);
        }

        _formationService = new FormationService(_squadService, _eventSystem);
        _eventSystem.ProcessEvents();
        ResetStatics();
    }

    [TearDown]
    public void TearDown()
    {
        Dispose();
    }

    [Test]
    public void SetFormation_PublishesFormationChanged()
    {
        _formationService!.SetFormation(FormationType.F442);
        _eventSystem!.ProcessEvents();

        Assert.That(s_formationEvents, Is.EqualTo(1));
        Assert.That(s_lastFormationEvent.Formation.PositionX.Length, Is.EqualTo(11));
    }

    [Test]
    public void MovePlayer_ClampsCoordinatesAndPublishes()
    {
        _formationService!.MovePlayer(3, -1f, 2f);
        _eventSystem!.ProcessEvents();

        Assert.That(s_playerEvents, Is.EqualTo(1));
        Assert.That(s_lastPlayerEvent.Index, Is.EqualTo(3));
        Assert.That(s_lastPlayerEvent.X, Is.InRange(0f, 1f));
        Assert.That(s_lastPlayerEvent.Y, Is.InRange(0f, 1f));

        var formation = _formationService.GetCurrentFormation();
        Assert.That(formation.PositionX[3], Is.EqualTo(s_lastPlayerEvent.X));
        Assert.That(formation.PositionY[3], Is.EqualTo(s_lastPlayerEvent.Y));
    }

    public void Dispose()
    {
        _formationService = null;
        _squadService = null;
        _eventSystem = null;

        _database?.Dispose();
        _database = null;

        if (!string.IsNullOrEmpty(_databasePath) && File.Exists(_databasePath))
        {
            try
            {
                File.Delete(_databasePath);
            }
            catch (IOException)
            {
            }
        }
    }

    private static void ResetStatics()
    {
        s_lastFormationEvent = default;
        s_lastPlayerEvent = default;
        s_formationEvents = 0;
        s_playerEvents = 0;
    }

    private static unsafe void OnFormationChanged(FormationChangedEvent* evt)
    {
        s_lastFormationEvent = *evt;
        s_formationEvents++;
    }

    private static unsafe void OnPlayerPositionChanged(PlayerPositionChangedEvent* evt)
    {
        s_lastPlayerEvent = *evt;
        s_playerEvents++;
    }
}
