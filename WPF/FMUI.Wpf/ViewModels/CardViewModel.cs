using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class CardViewModel : ObservableObject
{
    private readonly CardDefinition _definition;
    private readonly CardSurfaceMetrics _metrics;
    private readonly ICardInteractionService _interactionService;
    private readonly Dictionary<string, FormationPlayerViewModel> _formationPlayerLookup = new(StringComparer.OrdinalIgnoreCase);
    private int _column;
    private int _row;
    private int _columnSpan;
    private int _rowSpan;
    private bool _isVisible = true;
    private bool _isSelected;

    public CardViewModel(CardDefinition definition, CardSurfaceMetrics metrics, ICardInteractionService interactionService)
    {
        _definition = definition;
        _metrics = metrics;
        _interactionService = interactionService;
        _column = definition.Column;
        _row = definition.Row;
        _columnSpan = definition.ColumnSpan;
        _rowSpan = definition.RowSpan;
        ListItems = definition.ListItems is { Count: > 0 }
            ? new ReadOnlyCollection<CardListItemViewModel>(CreateListItems(definition.ListItems))
            : System.Array.Empty<CardListItemViewModel>();

        if (definition.FormationLines is { Count: > 0 })
        {
            var formation = CreateFormationViewModels(definition.FormationLines, interactionService, this);
            FormationLines = formation.Lines;
            FormationPlayers = formation.Players;
        }
        else
        {
            FormationLines = System.Array.Empty<FormationLineViewModel>();
            FormationPlayers = System.Array.Empty<FormationPlayerViewModel>();
        }
        BeginDragCommand = new RelayCommand(_ => _interactionService.BeginDrag(this));
        DragDeltaCommand = new RelayCommand(param =>
        {
            if (param is CardDragDelta delta)
            {
                _interactionService.UpdateDrag(this, delta);
            }
        });
        CompleteDragCommand = new RelayCommand(param =>
        {
            var completed = param as CardDragCompleted ?? new CardDragCompleted(false);
            _interactionService.CompleteDrag(this, completed);
        });

        BeginResizeCommand = new RelayCommand(param =>
        {
            if (param is ResizeHandle handle)
            {
                _interactionService.BeginResize(this, handle);
            }
        });

        ResizeDeltaCommand = new RelayCommand(param =>
        {
            if (param is CardResizeDelta delta)
            {
                _interactionService.UpdateResize(this, delta);
            }
        });

        CompleteResizeCommand = new RelayCommand(param =>
        {
            if (param is CardResizeCompleted completed)
            {
                _interactionService.CompleteResize(this, completed);
            }
        });
    }

    public string Title => _definition.Title;

    public string Id => _definition.Id;

    public string? Subtitle => _definition.Subtitle;

    public string? Description => _definition.Description;

    public string? PillText => _definition.PillText;

    public string? MetricValue => _definition.MetricValue;

    public string? MetricLabel => _definition.MetricLabel;

    public CardKind Kind => _definition.Kind;

    public IReadOnlyList<CardListItemViewModel> ListItems { get; }

    public IReadOnlyList<FormationLineViewModel> FormationLines { get; }

    public IReadOnlyList<FormationPlayerViewModel> FormationPlayers { get; }

    public bool HasSubtitle => !string.IsNullOrWhiteSpace(Subtitle);

    public bool HasDescription => !string.IsNullOrWhiteSpace(Description);

    public bool HasPill => !string.IsNullOrWhiteSpace(PillText);

    public bool HasMetric => !string.IsNullOrWhiteSpace(MetricValue);

    public bool HasListItems => ListItems.Count > 0;

    public bool HasFormation => FormationLines.Count > 0;

    public bool HasFormationPlayers => FormationPlayers.Count > 0;

    public double Left => _metrics.CalculateLeft(_column);

    public double Top => _metrics.CalculateTop(_row);

    public double Width => _metrics.CalculateWidth(_columnSpan);

    public double Height => _metrics.CalculateHeight(_rowSpan);

    public CardSurfaceMetrics Metrics => _metrics;

    public CardGeometry Geometry => new(_column, _row, _columnSpan, _rowSpan);

    public bool IsVisible
    {
        get => _isVisible;
        private set => SetProperty(ref _isVisible, value);
    }

    public bool IsSelected
    {
        get => _isSelected;
        private set => SetProperty(ref _isSelected, value);
    }

    public ICommand BeginDragCommand { get; }

    public ICommand DragDeltaCommand { get; }

    public ICommand CompleteDragCommand { get; }

    public ICommand BeginResizeCommand { get; }

    public ICommand ResizeDeltaCommand { get; }

    public ICommand CompleteResizeCommand { get; }

    public Rect GetBounds() => new(Left, Top, Width, Height);

    internal void RequestSelection(SelectionModifier modifier)
    {
        _interactionService.SelectCard(this, modifier);
    }

    internal void UpdateGeometry(int column, int row, int columnSpan, int rowSpan)
    {
        if (_column != column)
        {
            _column = column;
            OnPropertyChanged(nameof(Left));
        }

        if (_row != row)
        {
            _row = row;
            OnPropertyChanged(nameof(Top));
        }

        if (_columnSpan != columnSpan)
        {
            _columnSpan = columnSpan;
            OnPropertyChanged(nameof(Width));
        }

        if (_rowSpan != rowSpan)
        {
            _rowSpan = rowSpan;
            OnPropertyChanged(nameof(Height));
        }
    }

    internal void SetVisibility(bool visible)
    {
        IsVisible = visible;
    }

    internal void SetSelected(bool selected)
    {
        IsSelected = selected;
    }

    internal bool TryGetFormationPlayer(string playerId, out FormationPlayerViewModel player)
        => _formationPlayerLookup.TryGetValue(playerId, out player!);

    internal IReadOnlyList<FormationPlayerState> GetFormationPlayerStates()
    {
        if (!HasFormationPlayers)
        {
            return System.Array.Empty<FormationPlayerState>();
        }

        var states = new List<FormationPlayerState>(FormationPlayers.Count);
        foreach (var player in FormationPlayers)
        {
            states.Add(new FormationPlayerState(player.Id, player.NormalizedX, player.NormalizedY));
        }

        return states;
    }

    internal void ApplyFormationState(IReadOnlyList<FormationPlayerState> states)
    {
        if (!HasFormationPlayers || states is null || states.Count == 0)
        {
            return;
        }

        foreach (var state in states)
        {
            if (_formationPlayerLookup.TryGetValue(state.PlayerId, out var player))
            {
                player.UpdateNormalizedPosition(state.X, state.Y);
            }
        }
    }

    internal void UpdateFormationPlayer(string playerId, double normalizedX, double normalizedY)
    {
        if (_formationPlayerLookup.TryGetValue(playerId, out var player))
        {
            player.UpdateNormalizedPosition(normalizedX, normalizedY);
        }
    }

    private static IList<CardListItemViewModel> CreateListItems(IReadOnlyList<CardListItem> items)
    {
        var list = new List<CardListItemViewModel>(items.Count);
        foreach (var item in items)
        {
            list.Add(new CardListItemViewModel(item));
        }

        return list;
    }

    private static (ReadOnlyCollection<FormationLineViewModel> Lines, ReadOnlyCollection<FormationPlayerViewModel> Players) CreateFormationViewModels(
        IReadOnlyList<FormationLineDefinition> definitions,
        ICardInteractionService interactionService,
        CardViewModel owner)
    {
        var allPlayers = new List<FormationPlayerViewModel>();
        var lines = new List<FormationLineViewModel>(definitions.Count);

        foreach (var definition in definitions)
        {
            var linePlayers = new List<FormationPlayerViewModel>();
            foreach (var player in definition.Players)
            {
                var playerViewModel = new FormationPlayerViewModel(
                    player.Id,
                    player.Name,
                    player.X,
                    player.Y,
                    interactionService,
                    owner);
                linePlayers.Add(playerViewModel);
                allPlayers.Add(playerViewModel);
                owner._formationPlayerLookup[player.Id] = playerViewModel;
            }

            lines.Add(new FormationLineViewModel(definition.Role, linePlayers));
        }

        return (
            new ReadOnlyCollection<FormationLineViewModel>(lines),
            new ReadOnlyCollection<FormationPlayerViewModel>(allPlayers));
    }
}

public sealed class CardListItemViewModel
{
    private readonly CardListItem _model;

    public CardListItemViewModel(CardListItem model)
    {
        _model = model;
    }

    public string Primary => _model.Primary;

    public string? Secondary => _model.Secondary;

    public string? Tertiary => _model.Tertiary;

    public string? Accent => _model.Accent;

    public bool HasSecondary => !string.IsNullOrWhiteSpace(Secondary);

    public bool HasTertiary => !string.IsNullOrWhiteSpace(Tertiary);

    public bool HasAccent => !string.IsNullOrWhiteSpace(Accent);
}

public sealed class FormationLineViewModel
{
    public FormationLineViewModel(string role, IReadOnlyList<FormationPlayerViewModel> players)
    {
        Role = role;
        Players = new ReadOnlyCollection<FormationPlayerViewModel>(new List<FormationPlayerViewModel>(players));
    }

    public string Role { get; }

    public IReadOnlyList<FormationPlayerViewModel> Players { get; }
}

public sealed class FormationPlayerViewModel : ObservableObject
{
    private readonly ICardInteractionService _interactionService;
    private readonly CardViewModel _owner;
    private double _normalizedX;
    private double _normalizedY;

    public FormationPlayerViewModel(
        string id,
        string name,
        double normalizedX,
        double normalizedY,
        ICardInteractionService interactionService,
        CardViewModel owner)
    {
        Id = id;
        Name = name;
        _normalizedX = normalizedX;
        _normalizedY = normalizedY;
        _interactionService = interactionService;
        _owner = owner;

        BeginDragCommand = new RelayCommand(_ => _interactionService.BeginPlayerDrag(_owner, this));
        DragDeltaCommand = new RelayCommand(parameter =>
        {
            if (parameter is FormationPlayerDragDelta delta)
            {
                _interactionService.UpdatePlayerDrag(_owner, this, delta);
            }
        });
        CompleteDragCommand = new RelayCommand(parameter =>
        {
            var completed = parameter as FormationPlayerDragCompleted ?? new FormationPlayerDragCompleted(false);
            _interactionService.CompletePlayerDrag(_owner, this, completed);
        });
    }

    public string Id { get; }

    public string Name { get; }

    public double NormalizedX
    {
        get => _normalizedX;
        private set => SetProperty(ref _normalizedX, value);
    }

    public double NormalizedY
    {
        get => _normalizedY;
        private set => SetProperty(ref _normalizedY, value);
    }

    public ICommand BeginDragCommand { get; }

    public ICommand DragDeltaCommand { get; }

    public ICommand CompleteDragCommand { get; }

    internal void UpdateNormalizedPosition(double normalizedX, double normalizedY)
    {
        NormalizedX = normalizedX;
        NormalizedY = normalizedY;
    }
}
