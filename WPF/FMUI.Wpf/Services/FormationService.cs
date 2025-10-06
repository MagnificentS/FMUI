using FMUI.Wpf.Events;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public struct FormationChangedEvent
{
    public FormationData Formation;
}

public struct PlayerPositionChangedEvent
{
    public int Index;
    public float X;
    public float Y;
}

public sealed class FormationService
{
    private FormationData _currentFormation;
    private readonly SquadService _squadService;
    private readonly EventSystem _eventSystem;

    public FormationService(SquadService squadService, EventSystem eventSystem)
    {
        _squadService = squadService;
        _eventSystem = eventSystem;
        _currentFormation = FormationData.Create442();

        // Ensure we have a valid starting eleven before publishing formation data.
        if (_squadService.SquadCount >= 11)
        {
            var evt = new FormationChangedEvent { Formation = _currentFormation };
            _eventSystem.Publish(EventCatalog.Formation.FormationChanged, ref evt);
        }
    }

    public void SetFormation(FormationType type)
    {
        if (_squadService.SquadCount < 11)
        {
            return;
        }

        _currentFormation = type switch
        {
            FormationType.F442 => FormationData.Create442(),
            _ => FormationData.Create442()
        };

        var evt = new FormationChangedEvent { Formation = _currentFormation };
        _eventSystem.Publish(EventCatalog.Formation.FormationChanged, ref evt);
    }

    public unsafe void MovePlayer(int positionIndex, float normalizedX, float normalizedY)
    {
        if ((uint)positionIndex >= 11)
        {
            return;
        }

        if (normalizedX < 0f)
        {
            normalizedX = 0f;
        }
        else if (normalizedX > 1f)
        {
            normalizedX = 1f;
        }

        if (normalizedY < 0f)
        {
            normalizedY = 0f;
        }
        else if (normalizedY > 1f)
        {
            normalizedY = 1f;
        }

        _currentFormation.PositionX[positionIndex] = normalizedX;
        _currentFormation.PositionY[positionIndex] = normalizedY;

        var evt = new PlayerPositionChangedEvent
        {
            Index = positionIndex,
            X = normalizedX,
            Y = normalizedY
        };

        _eventSystem.Publish(EventCatalog.Formation.PlayerPositionChanged, ref evt);
    }

    public FormationData GetCurrentFormation()
    {
        return _currentFormation;
    }
}
