using System;
using System.Collections.Generic;
using System.Windows;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Services;

public interface ICardInteractionService
{
    void Initialize(CardSurfaceMetrics metrics);

    void SetActiveSection(string tabIdentifier, string sectionIdentifier);

    void SetCards(IReadOnlyList<CardViewModel> cards);

    void SelectCard(CardViewModel card, SelectionModifier modifier);

    void ClearSelection();

    void BeginDrag(CardViewModel card);

    void UpdateDrag(CardViewModel card, CardDragDelta delta);

    void CompleteDrag(CardViewModel card, CardDragCompleted completed);

    void BeginResize(CardViewModel card, ResizeHandle handle);

    void UpdateResize(CardViewModel card, CardResizeDelta delta);

    void CompleteResize(CardViewModel card, CardResizeCompleted completed);

    void BeginPlayerDrag(CardViewModel card, FormationPlayerViewModel player);

    void UpdatePlayerDrag(CardViewModel card, FormationPlayerViewModel player, FormationPlayerDragDelta delta);

    void CompletePlayerDrag(CardViewModel card, FormationPlayerViewModel player, FormationPlayerDragCompleted completed);

    void UpdateViewport(Rect viewport);

    void NudgeSelection(int columnDelta, int rowDelta);

    bool HasSelection { get; }

    bool CanUndo { get; }

    bool CanRedo { get; }

    void Undo();

    void Redo();

    event EventHandler? SelectionChanged;

    event EventHandler? HistoryChanged;

    event EventHandler<IReadOnlyList<CardPreviewSnapshot>>? PreviewChanged;
}

public sealed class CardInteractionService : ICardInteractionService
{
    private readonly Dictionary<CardViewModel, InteractionState> _activeStates = new();
    private readonly List<CardViewModel> _trackedCards = new();
    private readonly Dictionary<string, CardViewModel> _cardLookup = new(StringComparer.Ordinal);
    private readonly HashSet<CardViewModel> _selectedCards = new();
    private readonly Stack<CardHistoryEntry> _undoStack = new();
    private readonly Stack<CardHistoryEntry> _redoStack = new();
    private readonly ICardLayoutStateService _stateService;
    private CardSurfaceMetrics _metrics = CardSurfaceMetrics.Default;
    private Rect _viewport;
    private string _activeTab = string.Empty;
    private string _activeSection = string.Empty;
    private CardViewModel? _activeDragController;
    private IReadOnlyList<CardGeometrySnapshot>? _pendingSnapshot;
    private readonly List<CardPreviewSnapshot> _currentPreviews = new();
    private bool _previewHasCollision;
    private PlayerInteractionState? _activePlayerState;

    public CardInteractionService(ICardLayoutStateService stateService)
    {
        _stateService = stateService;
    }

    public void Initialize(CardSurfaceMetrics metrics)
    {
        _metrics = metrics;
        _viewport = new Rect(0, 0, metrics.SurfaceWidth, metrics.SurfaceHeight);
    }

    public void SetActiveSection(string tabIdentifier, string sectionIdentifier)
    {
        _activeTab = tabIdentifier;
        _activeSection = sectionIdentifier;
    }

    public void SetCards(IReadOnlyList<CardViewModel> cards)
    {
        _activeStates.Clear();
        _trackedCards.Clear();
        _trackedCards.AddRange(cards);
        _cardLookup.Clear();
        foreach (var card in cards)
        {
            _cardLookup[card.Id] = card;
        }

        if (_undoStack.Count > 0 || _redoStack.Count > 0)
        {
            _undoStack.Clear();
            _redoStack.Clear();
            OnHistoryChanged();
        }

        _pendingSnapshot = null;
        _activeDragController = null;
        _activePlayerState = null;

        if (_selectedCards.Count > 0)
        {
            foreach (var selected in _selectedCards)
            {
                selected.SetSelected(false);
            }

            _selectedCards.Clear();
            OnSelectionChanged();
        }

        ClearPreview();

        foreach (var card in cards)
        {
            UpdateCardVisibility(card);
        }
    }

    public void SelectCard(CardViewModel card, SelectionModifier modifier)
    {
        if (!_trackedCards.Contains(card))
        {
            return;
        }

        var changed = false;

        switch (modifier)
        {
            case SelectionModifier.Replace:
                if (_selectedCards.Count != 1 || !_selectedCards.Contains(card))
                {
                    foreach (var selected in _selectedCards)
                    {
                        selected.SetSelected(false);
                    }

                    _selectedCards.Clear();
                    _selectedCards.Add(card);
                    card.SetSelected(true);
                    changed = true;
                }
                break;
            case SelectionModifier.Add:
                if (_selectedCards.Add(card))
                {
                    card.SetSelected(true);
                    changed = true;
                }
                break;
            case SelectionModifier.Toggle:
                if (_selectedCards.Remove(card))
                {
                    card.SetSelected(false);
                    changed = true;
                }
                else
                {
                    _selectedCards.Add(card);
                    card.SetSelected(true);
                    changed = true;
                }
                break;
        }

        if (modifier == SelectionModifier.Replace && _selectedCards.Count == 0)
        {
            _selectedCards.Add(card);
            card.SetSelected(true);
            changed = true;
        }

        if (changed)
        {
            OnSelectionChanged();
        }
    }

    public void ClearSelection()
    {
        if (_selectedCards.Count == 0)
        {
            return;
        }

        foreach (var card in _selectedCards)
        {
            card.SetSelected(false);
        }

        _selectedCards.Clear();
        OnSelectionChanged();
        ClearPreview();
    }

    public void BeginDrag(CardViewModel card)
    {
        if (_selectedCards.Count == 0)
        {
            SelectCard(card, SelectionModifier.Replace);
        }
        else if (!_selectedCards.Contains(card))
        {
            SelectCard(card, SelectionModifier.Replace);
        }

        _activeStates.Clear();

        foreach (var selected in _selectedCards)
        {
            _activeStates[selected] = InteractionState.CreateDrag(selected.Geometry);
        }

        _pendingSnapshot = CaptureSnapshot(_selectedCards);
        _activeDragController = card;
        UpdatePreview();
    }

    public void UpdateDrag(CardViewModel card, CardDragDelta delta)
    {
        if (_activeDragController != card)
        {
            return;
        }

        if (!_activeStates.TryGetValue(card, out var state) || state.Mode != InteractionMode.Drag)
        {
            return;
        }

        state.HorizontalDelta += delta.HorizontalChange;
        state.VerticalDelta += delta.VerticalChange;

        var originLeft = _metrics.CalculateLeft(state.OriginalGeometry.Column);
        var originTop = _metrics.CalculateTop(state.OriginalGeometry.Row);

        var newLeft = originLeft + state.HorizontalDelta;
        var newTop = originTop + state.VerticalDelta;

        var newColumn = _metrics.SnapColumn(newLeft, state.OriginalGeometry.ColumnSpan);
        var newRow = _metrics.SnapRow(newTop, state.OriginalGeometry.RowSpan);

        var columnDelta = newColumn - state.OriginalGeometry.Column;
        var rowDelta = newRow - state.OriginalGeometry.Row;

        foreach (var (selected, selectedState) in _activeStates)
        {
            var original = selectedState.OriginalGeometry;
            var targetColumn = Math.Clamp(original.Column + columnDelta, 0, _metrics.Columns - original.ColumnSpan);
            var targetRow = Math.Clamp(original.Row + rowDelta, 0, _metrics.Rows - original.RowSpan);
            selected.UpdateGeometry(targetColumn, targetRow, original.ColumnSpan, original.RowSpan);
            UpdateCardVisibility(selected);
        }

        UpdatePreview();
    }

    public void CompleteDrag(CardViewModel card, CardDragCompleted completed)
    {
        if (_activeDragController != card)
        {
            return;
        }

        _activeDragController = null;

        if (!_activeStates.TryGetValue(card, out var state) || state.Mode != InteractionMode.Drag)
        {
            _activeStates.Clear();
            return;
        }

        if (completed.Canceled)
        {
            if (_pendingSnapshot is not null)
            {
                ApplySnapshot(_pendingSnapshot);
            }

            _pendingSnapshot = null;
            _activeStates.Clear();
            ClearPreview();
            return;
        }

        var hasCollision = _previewHasCollision;
        ClearPreview();

        if (hasCollision)
        {
            if (_pendingSnapshot is not null)
            {
                ApplySnapshot(_pendingSnapshot);
            }

            _pendingSnapshot = null;
            _activeStates.Clear();
            return;
        }

        var updated = new List<CardViewModel>(_selectedCards);
        PersistGeometries(updated);

        if (_pendingSnapshot is not null)
        {
            var after = CaptureSnapshot(updated);
            CommitHistory(
                _pendingSnapshot,
                after,
                Array.Empty<FormationPlayerPositionSnapshot>(),
                Array.Empty<FormationPlayerPositionSnapshot>());
            _pendingSnapshot = null;
        }

        _activeStates.Clear();
    }

    public void BeginResize(CardViewModel card, ResizeHandle handle)
    {
        _activeStates.Clear();
        _activeStates[card] = InteractionState.CreateResize(card.Geometry, handle);
        _pendingSnapshot = CaptureSnapshot(new[] { card });
        UpdatePreview();
    }

    public void UpdateResize(CardViewModel card, CardResizeDelta delta)
    {
        if (!_activeStates.TryGetValue(card, out var state) || state.Mode != InteractionMode.Resize)
        {
            return;
        }

        if (state.Handle != delta.Handle)
        {
            return;
        }

        state.HorizontalDelta += delta.HorizontalChange;
        state.VerticalDelta += delta.VerticalChange;

        var (column, row, columnSpan, rowSpan) = state.OriginalGeometry;

        if (state.Handle is ResizeHandle.East or ResizeHandle.SouthEast)
        {
            var spanChange = CalculateSpanChange(state.HorizontalDelta);
            columnSpan = Math.Clamp(state.OriginalGeometry.ColumnSpan + spanChange, 1, _metrics.Columns - column);
        }

        if (state.Handle is ResizeHandle.South or ResizeHandle.SouthEast)
        {
            var spanChange = CalculateSpanChange(state.VerticalDelta);
            rowSpan = Math.Clamp(state.OriginalGeometry.RowSpan + spanChange, 1, _metrics.Rows - row);
        }

        card.UpdateGeometry(column, row, columnSpan, rowSpan);
        UpdateCardVisibility(card);
        UpdatePreview();
    }

    public void CompleteResize(CardViewModel card, CardResizeCompleted completed)
    {
        if (!_activeStates.Remove(card, out var state) || state.Mode != InteractionMode.Resize)
        {
            return;
        }

        if (state.Handle != completed.Handle)
        {
            return;
        }

        if (completed.Canceled)
        {
            card.UpdateGeometry(
                state.OriginalGeometry.Column,
                state.OriginalGeometry.Row,
                state.OriginalGeometry.ColumnSpan,
                state.OriginalGeometry.RowSpan);
            UpdateCardVisibility(card);
            _pendingSnapshot = null;
            ClearPreview();
            return;
        }

        var hasCollision = _previewHasCollision;
        ClearPreview();

        if (hasCollision)
        {
            if (_pendingSnapshot is not null)
            {
                ApplySnapshot(_pendingSnapshot);
                _pendingSnapshot = null;
            }

            card.UpdateGeometry(
                state.OriginalGeometry.Column,
                state.OriginalGeometry.Row,
                state.OriginalGeometry.ColumnSpan,
                state.OriginalGeometry.RowSpan);
            UpdateCardVisibility(card);
            return;
        }

        PersistGeometry(card);

        if (_pendingSnapshot is not null)
        {
            var after = CaptureSnapshot(new[] { card });
            CommitHistory(
                _pendingSnapshot,
                after,
                Array.Empty<FormationPlayerPositionSnapshot>(),
                Array.Empty<FormationPlayerPositionSnapshot>());
            _pendingSnapshot = null;
        }
    }

    public void BeginPlayerDrag(CardViewModel card, FormationPlayerViewModel player)
    {
        if (!_trackedCards.Contains(card) || !card.HasFormationPlayers)
        {
            return;
        }

        var snapshot = CaptureFormationSnapshot(card);
        _activePlayerState = PlayerInteractionState.Create(card, player, snapshot);
    }

    public void UpdatePlayerDrag(CardViewModel card, FormationPlayerViewModel player, FormationPlayerDragDelta delta)
    {
        if (_activePlayerState is not { } state || state.Card != card || state.Player != player)
        {
            return;
        }

        var pitchWidth = Math.Max(delta.PitchWidth, 1d);
        var pitchHeight = Math.Max(delta.PitchHeight, 1d);
        var tokenWidth = Math.Max(delta.TokenSize, 0d);
        var normalizedX = state.CurrentX + (delta.HorizontalChange / pitchWidth);
        var normalizedY = state.CurrentY + (delta.VerticalChange / pitchHeight);

        var halfTokenX = tokenWidth <= 0d ? 0d : (tokenWidth / 2d) / pitchWidth;
        var halfTokenY = tokenWidth <= 0d ? 0d : (tokenWidth / 2d) / pitchHeight;

        var minX = halfTokenX > 0d && halfTokenX < 0.5d ? halfTokenX : 0d;
        var maxX = halfTokenX > 0d && halfTokenX < 0.5d ? 1d - halfTokenX : 1d;
        var minY = halfTokenY > 0d && halfTokenY < 0.5d ? halfTokenY : 0d;
        var maxY = halfTokenY > 0d && halfTokenY < 0.5d ? 1d - halfTokenY : 1d;

        var clampedX = Math.Clamp(normalizedX, minX, maxX);
        var clampedY = Math.Clamp(normalizedY, minY, maxY);

        player.UpdateNormalizedPosition(clampedX, clampedY);
        state.CurrentX = clampedX;
        state.CurrentY = clampedY;
    }

    public void CompletePlayerDrag(CardViewModel card, FormationPlayerViewModel player, FormationPlayerDragCompleted completed)
    {
        if (_activePlayerState is not { } state || state.Card != card || state.Player != player)
        {
            return;
        }

        _activePlayerState = null;

        if (completed.Canceled)
        {
            ApplyPlayerSnapshot(state.Before);
            return;
        }

        var after = CaptureFormationSnapshot(card);
        if (ArePlayerSnapshotsEqual(state.Before, after))
        {
            return;
        }

        PersistFormationPlayers(card);
        CommitHistory(
            Array.Empty<CardGeometrySnapshot>(),
            Array.Empty<CardGeometrySnapshot>(),
            state.Before,
            after);
    }

    public void UpdateViewport(Rect viewport)
    {
        if (double.IsNaN(viewport.Width) || double.IsNaN(viewport.Height) || viewport.Width <= 0 || viewport.Height <= 0)
        {
            _viewport = new Rect(0, 0, _metrics.SurfaceWidth, _metrics.SurfaceHeight);
        }
        else
        {
            _viewport = viewport;
        }

        foreach (var card in _trackedCards)
        {
            UpdateCardVisibility(card);
        }
    }

    public void NudgeSelection(int columnDelta, int rowDelta)
    {
        if (_selectedCards.Count == 0)
        {
            return;
        }

        var before = CaptureSnapshot(_selectedCards);
        var changed = false;

        foreach (var card in _selectedCards)
        {
            var geometry = card.Geometry;
            var newColumn = Math.Clamp(geometry.Column + columnDelta, 0, _metrics.Columns - geometry.ColumnSpan);
            var newRow = Math.Clamp(geometry.Row + rowDelta, 0, _metrics.Rows - geometry.RowSpan);

            if (newColumn != geometry.Column || newRow != geometry.Row)
            {
                card.UpdateGeometry(newColumn, newRow, geometry.ColumnSpan, geometry.RowSpan);
                UpdateCardVisibility(card);
                changed = true;
            }
        }

        if (!changed)
        {
            return;
        }

        PersistGeometries(_selectedCards);
        var after = CaptureSnapshot(_selectedCards);
        CommitHistory(
            before,
            after,
            Array.Empty<FormationPlayerPositionSnapshot>(),
            Array.Empty<FormationPlayerPositionSnapshot>());
    }

    public bool HasSelection => _selectedCards.Count > 0;

    public bool CanUndo => _undoStack.Count > 0;

    public bool CanRedo => _redoStack.Count > 0;

    public event EventHandler? SelectionChanged;

    public event EventHandler? HistoryChanged;

    public event EventHandler<IReadOnlyList<CardPreviewSnapshot>>? PreviewChanged;

    public void Undo()
    {
        if (_undoStack.Count == 0)
        {
            return;
        }

        var entry = _undoStack.Pop();
        ApplySnapshot(entry.GeometryBefore);
        ApplyPlayerSnapshot(entry.PlayersBefore);
        _redoStack.Push(entry);
        OnHistoryChanged();
    }

    public void Redo()
    {
        if (_redoStack.Count == 0)
        {
            return;
        }

        var entry = _redoStack.Pop();
        ApplySnapshot(entry.GeometryAfter);
        ApplyPlayerSnapshot(entry.PlayersAfter);
        _undoStack.Push(entry);
        OnHistoryChanged();
    }

    private void UpdateCardVisibility(CardViewModel card)
    {
        var bounds = card.GetBounds();
        var paddedViewport = _viewport;
        var padding = _metrics.TileSize + _metrics.Gap;
        paddedViewport.Inflate(padding * 2, padding * 2);
        var visible = paddedViewport.IntersectsWith(bounds);
        card.SetVisibility(visible);
    }

    private void UpdatePreview()
    {
        if (_activeStates.Count == 0)
        {
            ClearPreview();
            return;
        }

        var activeCards = new List<CardViewModel>(_activeStates.Keys);
        var activeSet = new HashSet<CardViewModel>(activeCards);
        var validity = new Dictionary<CardViewModel, bool>(activeCards.Count);
        var geometries = new Dictionary<CardViewModel, CardGeometry>(activeCards.Count);

        foreach (var card in activeCards)
        {
            validity[card] = true;
            geometries[card] = card.Geometry;
        }

        foreach (var card in activeCards)
        {
            var geometry = geometries[card];
            foreach (var other in _trackedCards)
            {
                if (ReferenceEquals(other, card) || activeSet.Contains(other))
                {
                    continue;
                }

                if (IsOverlap(geometry, other.Geometry))
                {
                    validity[card] = false;
                    break;
                }
            }
        }

        for (var i = 0; i < activeCards.Count; i++)
        {
            var first = activeCards[i];
            var firstGeometry = geometries[first];
            for (var j = i + 1; j < activeCards.Count; j++)
            {
                var second = activeCards[j];
                if (IsOverlap(firstGeometry, geometries[second]))
                {
                    validity[first] = false;
                    validity[second] = false;
                }
            }
        }

        var previews = new List<CardPreviewSnapshot>(activeCards.Count);
        var hasCollision = false;

        foreach (var card in activeCards)
        {
            var isValid = validity[card];
            if (!isValid)
            {
                hasCollision = true;
            }

            previews.Add(new CardPreviewSnapshot(card.Id, geometries[card], isValid));
        }

        _previewHasCollision = hasCollision;
        _currentPreviews.Clear();
        _currentPreviews.AddRange(previews);
        PreviewChanged?.Invoke(this, _currentPreviews.ToArray());
    }

    private void ClearPreview()
    {
        if (_currentPreviews.Count == 0 && !_previewHasCollision)
        {
            return;
        }

        _currentPreviews.Clear();
        _previewHasCollision = false;
        PreviewChanged?.Invoke(this, Array.Empty<CardPreviewSnapshot>());
    }

    private void PersistGeometry(CardViewModel card)
    {
        if (string.IsNullOrWhiteSpace(_activeTab) || string.IsNullOrWhiteSpace(_activeSection))
        {
            return;
        }

        _stateService.UpdateGeometry(_activeTab, _activeSection, card.Id, card.Geometry);
    }

    private void PersistGeometries(IEnumerable<CardViewModel> cards)
    {
        if (string.IsNullOrWhiteSpace(_activeTab) || string.IsNullOrWhiteSpace(_activeSection))
        {
            return;
        }

        foreach (var card in cards)
        {
            _stateService.UpdateGeometry(_activeTab, _activeSection, card.Id, card.Geometry);
        }
    }

    private void PersistFormationPlayers(CardViewModel card)
    {
        if (string.IsNullOrWhiteSpace(_activeTab) || string.IsNullOrWhiteSpace(_activeSection))
        {
            return;
        }

        var states = card.GetFormationPlayerStates();
        if (states.Count == 0)
        {
            return;
        }

        _stateService.UpdateFormationPlayers(_activeTab, _activeSection, card.Id, states);
    }

    private int CalculateSpanChange(double delta)
    {
        var cellSize = _metrics.TileSize + _metrics.Gap;
        return (int)Math.Round(delta / cellSize, MidpointRounding.AwayFromZero);
    }

    private IReadOnlyList<CardGeometrySnapshot> CaptureSnapshot(IEnumerable<CardViewModel> cards)
    {
        var list = new List<CardGeometrySnapshot>();
        foreach (var card in cards)
        {
            list.Add(new CardGeometrySnapshot(card.Id, card.Geometry));
        }

        list.Sort((left, right) => string.CompareOrdinal(left.CardId, right.CardId));
        return list;
    }

    private IReadOnlyList<FormationPlayerPositionSnapshot> CaptureFormationSnapshot(CardViewModel card)
    {
        if (!card.HasFormationPlayers)
        {
            return Array.Empty<FormationPlayerPositionSnapshot>();
        }

        var list = new List<FormationPlayerPositionSnapshot>(card.FormationPlayers.Count);
        foreach (var player in card.FormationPlayers)
        {
            list.Add(new FormationPlayerPositionSnapshot(card.Id, player.Id, player.NormalizedX, player.NormalizedY));
        }

        list.Sort(static (left, right) =>
        {
            var cardComparison = string.CompareOrdinal(left.CardId, right.CardId);
            return cardComparison != 0
                ? cardComparison
                : string.CompareOrdinal(left.PlayerId, right.PlayerId);
        });

        return list;
    }

    private void ApplySnapshot(IReadOnlyList<CardGeometrySnapshot> snapshot)
    {
        var updated = new List<CardViewModel>();

        foreach (var geometrySnapshot in snapshot)
        {
            if (!_cardLookup.TryGetValue(geometrySnapshot.CardId, out var card))
            {
                continue;
            }

            var geometry = geometrySnapshot.Geometry;
            card.UpdateGeometry(geometry.Column, geometry.Row, geometry.ColumnSpan, geometry.RowSpan);
            UpdateCardVisibility(card);
            updated.Add(card);
        }

        if (updated.Count > 0)
        {
            PersistGeometries(updated);
        }
    }

    private void ApplyPlayerSnapshot(IReadOnlyList<FormationPlayerPositionSnapshot> snapshot)
    {
        if (snapshot is null || snapshot.Count == 0)
        {
            return;
        }

        var updatedCards = new HashSet<CardViewModel>();

        foreach (var playerSnapshot in snapshot)
        {
            if (!_cardLookup.TryGetValue(playerSnapshot.CardId, out var card))
            {
                continue;
            }

            card.UpdateFormationPlayer(playerSnapshot.PlayerId, playerSnapshot.X, playerSnapshot.Y);
            updatedCards.Add(card);
        }

        foreach (var card in updatedCards)
        {
            PersistFormationPlayers(card);
        }
    }

    private void CommitHistory(
        IReadOnlyList<CardGeometrySnapshot> geometryBefore,
        IReadOnlyList<CardGeometrySnapshot> geometryAfter,
        IReadOnlyList<FormationPlayerPositionSnapshot> playersBefore,
        IReadOnlyList<FormationPlayerPositionSnapshot> playersAfter)
    {
        if (AreSnapshotsEqual(geometryBefore, geometryAfter) && ArePlayerSnapshotsEqual(playersBefore, playersAfter))
        {
            return;
        }

        _undoStack.Push(new CardHistoryEntry(geometryBefore, geometryAfter, playersBefore, playersAfter));
        _redoStack.Clear();
        OnHistoryChanged();
    }

    private static bool IsOverlap(CardGeometry first, CardGeometry second)
    {
        var firstColumnEnd = first.Column + first.ColumnSpan;
        var secondColumnEnd = second.Column + second.ColumnSpan;
        if (firstColumnEnd <= second.Column || secondColumnEnd <= first.Column)
        {
            return false;
        }

        var firstRowEnd = first.Row + first.RowSpan;
        var secondRowEnd = second.Row + second.RowSpan;
        if (firstRowEnd <= second.Row || secondRowEnd <= first.Row)
        {
            return false;
        }

        return true;
    }

    private static bool AreSnapshotsEqual(IReadOnlyList<CardGeometrySnapshot> left, IReadOnlyList<CardGeometrySnapshot> right)
    {
        if (left.Count != right.Count)
        {
            return false;
        }

        for (var i = 0; i < left.Count; i++)
        {
            if (!left[i].Equals(right[i]))
            {
                return false;
            }
        }

        return true;
    }

    private static bool ArePlayerSnapshotsEqual(
        IReadOnlyList<FormationPlayerPositionSnapshot> left,
        IReadOnlyList<FormationPlayerPositionSnapshot> right)
    {
        if (left.Count != right.Count)
        {
            return false;
        }

        for (var i = 0; i < left.Count; i++)
        {
            if (!left[i].Equals(right[i]))
            {
                return false;
            }
        }

        return true;
    }

    private void OnSelectionChanged()
    {
        SelectionChanged?.Invoke(this, EventArgs.Empty);
    }

    private void OnHistoryChanged()
    {
        HistoryChanged?.Invoke(this, EventArgs.Empty);
    }

    private sealed class InteractionState
    {
        private InteractionState(InteractionMode mode, CardGeometry geometry, ResizeHandle handle)
        {
            Mode = mode;
            OriginalGeometry = geometry;
            Handle = handle;
        }

        public static InteractionState CreateDrag(CardGeometry geometry) =>
            new(InteractionMode.Drag, geometry, ResizeHandle.SouthEast);

        public static InteractionState CreateResize(CardGeometry geometry, ResizeHandle handle) =>
            new(InteractionMode.Resize, geometry, handle);

        public InteractionMode Mode { get; }

        public CardGeometry OriginalGeometry { get; }

        public ResizeHandle Handle { get; }

        public double HorizontalDelta { get; set; }

        public double VerticalDelta { get; set; }
    }

    private enum InteractionMode
    {
        Drag,
        Resize
    }

    private sealed class PlayerInteractionState
    {
        private PlayerInteractionState(
            CardViewModel card,
            FormationPlayerViewModel player,
            IReadOnlyList<FormationPlayerPositionSnapshot> before)
        {
            Card = card;
            Player = player;
            Before = before;
            StartX = player.NormalizedX;
            StartY = player.NormalizedY;
            CurrentX = StartX;
            CurrentY = StartY;
        }

        public CardViewModel Card { get; }

        public FormationPlayerViewModel Player { get; }

        public IReadOnlyList<FormationPlayerPositionSnapshot> Before { get; }

        public double StartX { get; }

        public double StartY { get; }

        public double CurrentX { get; set; }

        public double CurrentY { get; set; }

        public static PlayerInteractionState Create(
            CardViewModel card,
            FormationPlayerViewModel player,
            IReadOnlyList<FormationPlayerPositionSnapshot> before) =>
            new(card, player, before);
    }
}
