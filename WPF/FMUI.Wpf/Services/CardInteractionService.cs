using System;
using System.Collections.Generic;
using System.Windows;
using FMUI.Wpf.Collections;
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
    CardViewModel CreateCard(CardDefinition definition, bool isCustom, string? presetId);
    void RemoveCards(IReadOnlyList<CardViewModel> cards);
    IReadOnlyList<CardViewModel> GetSelectedCards();
    bool HasSelection { get; }
    bool CanUndo { get; }
    bool CanRedo { get; }
    void Undo();
    void Redo();
    event EventHandler? SelectionChanged;
    event EventHandler? HistoryChanged;
    event EventHandler<IReadOnlyList<CardPreviewSnapshot>>? PreviewChanged;
    event EventHandler<CardMutationEventArgs>? CardsMutated;
}

public sealed class CardInteractionService : ICardInteractionService
{
    private readonly ICardLayoutStateService _stateService;
    private readonly IClubDataService _clubDataService;
    private readonly ArrayCollection<CardViewModel> _trackedCards = new(64);
    private readonly ArrayCollection<CardViewModel> _selectedCards = new(16);
    private readonly ArrayCollection<InteractionEntry> _activeStates = new(8);
    private readonly ArrayCollection<CardPreviewSnapshot> _previewBuffer = new(8);
    private readonly ArrayStack<CardHistoryEntry> _undoStack = new(32);
    private readonly ArrayStack<CardHistoryEntry> _redoStack = new(32);
    private readonly ArrayCollection<CardViewModel> _addedCardsBuffer = new(8);
    private readonly ArrayCollection<CardViewModel> _removedCardsBuffer = new(8);
    private readonly ArrayCollection<CardViewModel> _scratchCards = new(16);
    private CardGeometry[] _geometryScratch = Array.Empty<CardGeometry>();
    private bool[] _validityScratch = Array.Empty<bool>();
    private CardSurfaceMetrics _metrics = CardSurfaceMetrics.Default;
    private Rect _viewport;
    private string _activeTab = string.Empty;
    private string _activeSection = string.Empty;
    private CardViewModel? _activeDragController;
    private IReadOnlyList<CardGeometrySnapshot>? _pendingSnapshot;
    private PlayerInteractionState? _activePlayerState;
    private bool _previewHasCollision;

    public CardInteractionService(ICardLayoutStateService stateService, IClubDataService clubDataService)
    {
        _stateService = stateService;
        _clubDataService = clubDataService;
    }

    public event EventHandler? SelectionChanged;
    public event EventHandler? HistoryChanged;
    public event EventHandler<IReadOnlyList<CardPreviewSnapshot>>? PreviewChanged;
    public event EventHandler<CardMutationEventArgs>? CardsMutated;

    public bool HasSelection => _selectedCards.Count > 0;
    public bool CanUndo => _undoStack.Count > 0;
    public bool CanRedo => _redoStack.Count > 0;

    public void Initialize(CardSurfaceMetrics metrics)
    {
        _metrics = metrics;
        _viewport = new Rect(0, 0, metrics.SurfaceWidth, metrics.SurfaceHeight);
    }

    public void SetActiveSection(string tabIdentifier, string sectionIdentifier)
    {
        _activeTab = tabIdentifier ?? string.Empty;
        _activeSection = sectionIdentifier ?? string.Empty;
    }

    public void SetCards(IReadOnlyList<CardViewModel> cards)
    {
        _trackedCards.Clear();
        _trackedCards.EnsureCapacity(cards.Count);
        for (var i = 0; i < cards.Count; i++)
        {
            _trackedCards.Add(cards[i]);
        }

        _activeStates.Clear();
        _pendingSnapshot = null;
        _activeDragController = null;
        _activePlayerState = null;
        _previewHasCollision = false;
        _previewBuffer.Clear();

        if (_undoStack.Count > 0 || _redoStack.Count > 0)
        {
            _undoStack.Clear();
            _redoStack.Clear();
            OnHistoryChanged();
        }

        if (_selectedCards.Count > 0)
        {
            var span = _selectedCards.AsSpan();
            for (var i = 0; i < span.Length; i++)
            {
                span[i].SetSelected(false);
            }

            _selectedCards.Clear();
            OnSelectionChanged();
        }

        for (var i = 0; i < cards.Count; i++)
        {
            UpdateCardVisibility(cards[i]);
        }

        ClearPreview();
    }

    public void SelectCard(CardViewModel card, SelectionModifier modifier)
    {
        if (!IsTracked(card))
        {
            return;
        }

        var changed = false;
        switch (modifier)
        {
            case SelectionModifier.Replace:
                if (_selectedCards.Count == 1 && ReferenceEquals(_selectedCards[0], card))
                {
                    return;
                }

                ClearCurrentSelection();
                _selectedCards.Add(card);
                card.SetSelected(true);
                changed = true;
                break;
            case SelectionModifier.Add:
                if (!IsCardSelected(card))
                {
                    _selectedCards.Add(card);
                    card.SetSelected(true);
                    changed = true;
                }
                break;
            case SelectionModifier.Toggle:
                var index = IndexOfSelected(card);
                if (index >= 0)
                {
                    _selectedCards.RemoveAt(index);
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

        var span = _selectedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            span[i].SetSelected(false);
        }

        _selectedCards.Clear();
        OnSelectionChanged();
        ClearPreview();
    }

    public void BeginDrag(CardViewModel card)
    {
        if (_selectedCards.Count == 0 || !IsCardSelected(card))
        {
            SelectCard(card, SelectionModifier.Replace);
        }

        _activeStates.Clear();
        var selection = _selectedCards.AsSpan();
        for (var i = 0; i < selection.Length; i++)
        {
            var entry = new InteractionEntry(selection[i], InteractionState.CreateDrag(selection[i].Geometry));
            _activeStates.Add(entry);
        }

        _pendingSnapshot = CaptureSnapshot(selection);
        _activeDragController = card;
        UpdatePreview();
    }

    public void UpdateDrag(CardViewModel card, CardDragDelta delta)
    {
        if (_activeDragController != card)
        {
            return;
        }

        if (!TryGetInteraction(card, out var state))
        {
            return;
        }

        if (state.Mode != InteractionMode.Drag)
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

        var span = _activeStates.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            var selected = span[i].Card;
            var selectedState = span[i].State;
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

        if (!TryGetInteraction(card, out var state) || state.Mode != InteractionMode.Drag)
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

        var selection = _selectedCards.AsSpan();
        PersistGeometries(selection);

        if (_pendingSnapshot is not null)
        {
            var after = CaptureSnapshot(selection);
            CommitHistory(
                _pendingSnapshot,
                after,
                Array.Empty<FormationPlayerPositionSnapshot>(),
                Array.Empty<FormationPlayerPositionSnapshot>(),
                Array.Empty<CardMutationSnapshot>(),
                Array.Empty<CardMutationSnapshot>());
            _pendingSnapshot = null;
        }

        _activeStates.Clear();
    }

    public void BeginResize(CardViewModel card, ResizeHandle handle)
    {
        _activeStates.Clear();
        _activeStates.Add(new InteractionEntry(card, InteractionState.CreateResize(card.Geometry, handle)));
        Span<CardViewModel> single = stackalloc CardViewModel[1];
        single[0] = card;
        _pendingSnapshot = CaptureSnapshot(single);
        UpdatePreview();
    }

    public void UpdateResize(CardViewModel card, CardResizeDelta delta)
    {
        if (!TryGetInteraction(card, out var state) || state.Mode != InteractionMode.Resize)
        {
            return;
        }

        if (state.Handle != delta.Handle)
        {
            return;
        }

        state.HorizontalDelta += delta.HorizontalChange;
        state.VerticalDelta += delta.VerticalChange;

        var column = state.OriginalGeometry.Column;
        var row = state.OriginalGeometry.Row;
        var columnSpan = state.OriginalGeometry.ColumnSpan;
        var rowSpan = state.OriginalGeometry.RowSpan;

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
        if (!TryRemoveInteraction(card, out var state) || state.Mode != InteractionMode.Resize)
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
            Span<CardViewModel> single = stackalloc CardViewModel[1];
            single[0] = card;
            var after = CaptureSnapshot(single);
            CommitHistory(
                _pendingSnapshot,
                after,
                Array.Empty<FormationPlayerPositionSnapshot>(),
                Array.Empty<FormationPlayerPositionSnapshot>(),
                Array.Empty<CardMutationSnapshot>(),
                Array.Empty<CardMutationSnapshot>());
            _pendingSnapshot = null;
        }
    }

    public void BeginPlayerDrag(CardViewModel card, FormationPlayerViewModel player)
    {
        if (!IsTracked(card) || !card.HasFormationPlayers)
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
            after,
            Array.Empty<CardMutationSnapshot>(),
            Array.Empty<CardMutationSnapshot>());
    }

    public void UpdateViewport(Rect viewport)
    {
        if (double.IsNaN(viewport.Width) || double.IsNaN(viewport.Height) || viewport.Width <= 0 || viewport.Height <= 0)
        {
            return;
        }

        _viewport = viewport;
        var span = _trackedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            UpdateCardVisibility(span[i]);
        }
    }

    public void NudgeSelection(int columnDelta, int rowDelta)
    {
        if (_selectedCards.Count == 0)
        {
            return;
        }

        Span<CardViewModel> selectionSpan = stackalloc CardViewModel[_selectedCards.Count];
        var selected = _selectedCards.AsSpan();
        for (var i = 0; i < selected.Length; i++)
        {
            selectionSpan[i] = selected[i];
        }

        var before = CaptureSnapshot(selectionSpan);

        for (var i = 0; i < selectionSpan.Length; i++)
        {
            var card = selectionSpan[i];
            var geometry = card.Geometry;
            var newColumn = Math.Clamp(geometry.Column + columnDelta, 0, _metrics.Columns - geometry.ColumnSpan);
            var newRow = Math.Clamp(geometry.Row + rowDelta, 0, _metrics.Rows - geometry.RowSpan);
            card.UpdateGeometry(newColumn, newRow, geometry.ColumnSpan, geometry.RowSpan);
            UpdateCardVisibility(card);
        }

        UpdatePreview();

        var after = CaptureSnapshot(selectionSpan);
        PersistGeometries(selectionSpan);

        CommitHistory(
            before,
            after,
            Array.Empty<FormationPlayerPositionSnapshot>(),
            Array.Empty<FormationPlayerPositionSnapshot>(),
            Array.Empty<CardMutationSnapshot>(),
            Array.Empty<CardMutationSnapshot>());
    }

    public CardViewModel CreateCard(CardDefinition definition, bool isCustom, string? presetId)
    {
        CancelActiveInteraction();

        var geometry = ResolveSpawnGeometry(definition);
        if (geometry.Column != definition.Column || geometry.Row != definition.Row ||
            geometry.ColumnSpan != definition.ColumnSpan || geometry.RowSpan != definition.RowSpan)
        {
            definition = definition with
            {
                Column = geometry.Column,
                Row = geometry.Row,
                ColumnSpan = geometry.ColumnSpan,
                RowSpan = geometry.RowSpan
            };
        }

        var card = new CardViewModel(definition, _metrics, this, _clubDataService, isCustom, presetId);
        card.UpdateGeometry(geometry.Column, geometry.Row, geometry.ColumnSpan, geometry.RowSpan);

        RegisterCard(card, select: true);
        PersistGeometry(card);

        if (!string.IsNullOrWhiteSpace(_activeTab) && !string.IsNullOrWhiteSpace(_activeSection))
        {
            if (isCustom)
            {
                _stateService.AddOrUpdateCustomCard(_activeTab, _activeSection, new CustomCardState(definition, presetId));
            }
            else
            {
                _stateService.RestoreRemovedCard(_activeTab, _activeSection, definition.Id);
            }
        }

        var mutation = CreateMutationSnapshot(card);
        CommitHistory(
            Array.Empty<CardGeometrySnapshot>(),
            Array.Empty<CardGeometrySnapshot>(),
            Array.Empty<FormationPlayerPositionSnapshot>(),
            Array.Empty<FormationPlayerPositionSnapshot>(),
            new[] { mutation },
            Array.Empty<CardMutationSnapshot>());

        CardsMutated?.Invoke(this, new CardMutationEventArgs(MutationOrigin.User, new[] { card }, Array.Empty<CardViewModel>()));
        return card;
    }

    public void RemoveCards(IReadOnlyList<CardViewModel> cards)
    {
        CancelActiveInteraction();
        if (cards.Count == 0)
        {
            return;
        }

        _scratchCards.Clear();
        _scratchCards.EnsureCapacity(cards.Count);
        for (var i = 0; i < cards.Count; i++)
        {
            _scratchCards.Add(cards[i]);
        }

        var toRemove = _scratchCards.AsSpan();
        var geometryBefore = CaptureSnapshot(toRemove);
        var formationBefore = CaptureFormationSnapshots(toRemove);
        var removedSnapshots = CaptureMutations(toRemove);

        for (var i = 0; i < toRemove.Length; i++)
        {
            RemoveCardInternal(toRemove[i], persistState: true);
        }

        CommitHistory(
            geometryBefore,
            Array.Empty<CardGeometrySnapshot>(),
            formationBefore,
            Array.Empty<FormationPlayerPositionSnapshot>(),
            Array.Empty<CardMutationSnapshot>(),
            removedSnapshots);

        var removedCards = CreateCardArray(toRemove);
        CardsMutated?.Invoke(this, new CardMutationEventArgs(MutationOrigin.User, Array.Empty<CardViewModel>(), removedCards));
    }

    public IReadOnlyList<CardViewModel> GetSelectedCards()
    {
        if (_selectedCards.Count == 0)
        {
            return Array.Empty<CardViewModel>();
        }

        var span = _selectedCards.AsSpan();
        var result = new CardViewModel[span.Length];
        for (var i = 0; i < span.Length; i++)
        {
            result[i] = span[i];
        }

        return result;
    }

    public void Undo()
    {
        if (_undoStack.Count == 0)
        {
            return;
        }

        var entry = _undoStack.Pop();
        _addedCardsBuffer.Clear();
        _removedCardsBuffer.Clear();

        if (entry.AddedCards is { Count: > 0 })
        {
            for (var i = 0; i < entry.AddedCards.Count; i++)
            {
                var card = RemoveCardFromSnapshot(entry.AddedCards[i]);
                if (card is not null)
                {
                    _removedCardsBuffer.Add(card);
                }
            }
        }

        if (entry.RemovedCards is { Count: > 0 })
        {
            for (var i = 0; i < entry.RemovedCards.Count; i++)
            {
                var card = AddCardFromSnapshot(entry.RemovedCards[i], select: false);
                if (card is not null)
                {
                    _addedCardsBuffer.Add(card);
                }
            }
        }

        ApplySnapshot(entry.GeometryBefore);
        ApplyPlayerSnapshot(entry.PlayersBefore);
        _redoStack.Push(entry);
        OnHistoryChanged();

        if (_addedCardsBuffer.Count > 0 || _removedCardsBuffer.Count > 0)
        {
            RaiseMutationEvent(MutationOrigin.UndoRedo);
        }
    }

    public void Redo()
    {
        if (_redoStack.Count == 0)
        {
            return;
        }

        var entry = _redoStack.Pop();
        _addedCardsBuffer.Clear();
        _removedCardsBuffer.Clear();

        if (entry.AddedCards is { Count: > 0 })
        {
            for (var i = 0; i < entry.AddedCards.Count; i++)
            {
                var card = AddCardFromSnapshot(entry.AddedCards[i], select: false);
                if (card is not null)
                {
                    _addedCardsBuffer.Add(card);
                }
            }
        }

        if (entry.RemovedCards is { Count: > 0 })
        {
            for (var i = 0; i < entry.RemovedCards.Count; i++)
            {
                var card = RemoveCardFromSnapshot(entry.RemovedCards[i]);
                if (card is not null)
                {
                    _removedCardsBuffer.Add(card);
                }
            }
        }

        ApplySnapshot(entry.GeometryAfter);
        ApplyPlayerSnapshot(entry.PlayersAfter);
        _undoStack.Push(entry);
        OnHistoryChanged();

        if (_addedCardsBuffer.Count > 0 || _removedCardsBuffer.Count > 0)
        {
            RaiseMutationEvent(MutationOrigin.UndoRedo);
        }
    }

    private void RaiseMutationEvent(MutationOrigin origin)
    {
        var added = CreateCardArray(_addedCardsBuffer);
        var removed = CreateCardArray(_removedCardsBuffer);
        CardsMutated?.Invoke(this, new CardMutationEventArgs(origin, added, removed));
    }

    private static CardViewModel[] CreateCardArray(ArrayCollection<CardViewModel> source)
    {
        if (source.Count == 0)
        {
            return Array.Empty<CardViewModel>();
        }

        var span = source.AsSpan();
        var result = new CardViewModel[span.Length];
        for (var i = 0; i < span.Length; i++)
        {
            result[i] = span[i];
        }

        return result;
    }

    private static CardViewModel[] CreateCardArray(ReadOnlySpan<CardViewModel> span)
    {
        if (span.Length == 0)
        {
            return Array.Empty<CardViewModel>();
        }

        var result = new CardViewModel[span.Length];
        for (var i = 0; i < span.Length; i++)
        {
            result[i] = span[i];
        }

        return result;
    }

    private void RegisterCard(CardViewModel card, bool select)
    {
        if (IsTracked(card))
        {
            return;
        }

        _trackedCards.Add(card);
        UpdateCardVisibility(card);

        if (select)
        {
            ClearCurrentSelection();
            _selectedCards.Add(card);
            card.SetSelected(true);
            OnSelectionChanged();
        }
    }

    private CardViewModel? AddCardFromSnapshot(CardMutationSnapshot snapshot, bool select)
    {
        if (string.IsNullOrWhiteSpace(_activeTab) || string.IsNullOrWhiteSpace(_activeSection))
        {
            return null;
        }

        var card = new CardViewModel(
            snapshot.Definition,
            _metrics,
            this,
            _clubDataService,
            _activeTab,
            _activeSection,
            snapshot.IsCustom,
            snapshot.PresetId);
        RegisterCard(card, select);
        PersistGeometry(card);

        if (snapshot.IsCustom)
        {
            _stateService.AddOrUpdateCustomCard(_activeTab, _activeSection, new CustomCardState(snapshot.Definition, snapshot.PresetId));
        }
        else
        {
            _stateService.RestoreRemovedCard(_activeTab, _activeSection, snapshot.Definition.Id);
        }

        if (snapshot.FormationPlayers is { Count: > 0 })
        {
            card.ApplyFormationState(snapshot.FormationPlayers);
            PersistFormationPlayers(card);
        }

        return card;
    }

    private CardViewModel? RemoveCardFromSnapshot(CardMutationSnapshot snapshot)
    {
        var card = FindCardById(snapshot.Definition.Id);
        if (card is null)
        {
            return null;
        }

        RemoveCardInternal(card, persistState: true);
        return card;
    }

    private void RemoveCardInternal(CardViewModel card, bool persistState)
    {
        _trackedCards.Remove(card);
        RemoveInteraction(card);

        if (RemoveFromSelection(card))
        {
            card.SetSelected(false);
            OnSelectionChanged();
        }

        card.SetVisibility(false);

        if (!persistState || string.IsNullOrWhiteSpace(_activeTab) || string.IsNullOrWhiteSpace(_activeSection))
        {
            return;
        }

        _stateService.RemoveCardState(_activeTab, _activeSection, card.Id);

        if (card.IsCustom)
        {
            _stateService.RemoveCustomCard(_activeTab, _activeSection, card.Id);
        }
        else
        {
            _stateService.MarkCardRemoved(_activeTab, _activeSection, card.Id);
        }
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

        var activeSpan = _activeStates.AsSpan();
        EnsureScratchCapacity(activeSpan.Length);

        for (var i = 0; i < activeSpan.Length; i++)
        {
            _geometryScratch[i] = activeSpan[i].Card.Geometry;
            _validityScratch[i] = true;
        }

        for (var i = 0; i < activeSpan.Length; i++)
        {
            var card = activeSpan[i].Card;
            var geometry = _geometryScratch[i];

            var trackedSpan = _trackedCards.AsSpan();
            for (var j = 0; j < trackedSpan.Length; j++)
            {
                var other = trackedSpan[j];
                if (ReferenceEquals(other, card) || IsCardActive(other))
                {
                    continue;
                }

                if (IsOverlap(geometry, other.Geometry))
                {
                    _validityScratch[i] = false;
                    break;
                }
            }
        }

        for (var i = 0; i < activeSpan.Length; i++)
        {
            for (var j = i + 1; j < activeSpan.Length; j++)
            {
                if (IsOverlap(_geometryScratch[i], _geometryScratch[j]))
                {
                    _validityScratch[i] = false;
                    _validityScratch[j] = false;
                }
            }
        }

        _previewBuffer.Clear();
        var hasCollision = false;
        for (var i = 0; i < activeSpan.Length; i++)
        {
            var isValid = _validityScratch[i];
            if (!isValid)
            {
                hasCollision = true;
            }

            _previewBuffer.Add(new CardPreviewSnapshot(activeSpan[i].Card.Id, _geometryScratch[i], isValid));
        }

        _previewHasCollision = hasCollision;
        var previewList = new ArrayReadOnlyList<CardPreviewSnapshot>(_previewBuffer.GetRawArray(), _previewBuffer.Count);
        PreviewChanged?.Invoke(this, previewList);
    }

    private void ClearPreview()
    {
        if (_previewBuffer.Count == 0 && !_previewHasCollision)
        {
            return;
        }

        _previewBuffer.Clear();
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

    private void PersistGeometries(ReadOnlySpan<CardViewModel> cards)
    {
        if (string.IsNullOrWhiteSpace(_activeTab) || string.IsNullOrWhiteSpace(_activeSection))
        {
            return;
        }

        for (var i = 0; i < cards.Length; i++)
        {
            _stateService.UpdateGeometry(_activeTab, _activeSection, cards[i].Id, cards[i].Geometry);
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

    private static CardGeometrySnapshot[] CaptureSnapshot(ReadOnlySpan<CardViewModel> cards)
    {
        if (cards.Length == 0)
        {
            return Array.Empty<CardGeometrySnapshot>();
        }

        var snapshots = new CardGeometrySnapshot[cards.Length];
        for (var i = 0; i < cards.Length; i++)
        {
            var card = cards[i];
            snapshots[i] = new CardGeometrySnapshot(card.Id, card.Geometry);
        }

        Array.Sort(snapshots, static (left, right) => string.CompareOrdinal(left.CardId, right.CardId));
        return snapshots;
    }

    private FormationPlayerPositionSnapshot[] CaptureFormationSnapshot(CardViewModel card)
    {
        if (!card.HasFormationPlayers)
        {
            return Array.Empty<FormationPlayerPositionSnapshot>();
        }

        var players = card.FormationPlayers;
        var snapshots = new FormationPlayerPositionSnapshot[players.Count];
        for (var i = 0; i < players.Count; i++)
        {
            var player = players[i];
            snapshots[i] = new FormationPlayerPositionSnapshot(card.Id, player.Id, player.NormalizedX, player.NormalizedY);
        }

        Array.Sort(snapshots, static (left, right) =>
        {
            var comparison = string.CompareOrdinal(left.CardId, right.CardId);
            return comparison != 0 ? comparison : string.CompareOrdinal(left.PlayerId, right.PlayerId);
        });

        return snapshots;
    }

    private FormationPlayerPositionSnapshot[] CaptureFormationSnapshots(ReadOnlySpan<CardViewModel> cards)
    {
        var totalPlayers = 0;
        for (var i = 0; i < cards.Length; i++)
        {
            if (cards[i].HasFormationPlayers)
            {
                totalPlayers += cards[i].FormationPlayers.Count;
            }
        }

        if (totalPlayers == 0)
        {
            return Array.Empty<FormationPlayerPositionSnapshot>();
        }

        var snapshots = new FormationPlayerPositionSnapshot[totalPlayers];
        var index = 0;
        for (var i = 0; i < cards.Length; i++)
        {
            var card = cards[i];
            if (!card.HasFormationPlayers)
            {
                continue;
            }

            var players = card.FormationPlayers;
            for (var j = 0; j < players.Count; j++)
            {
                var player = players[j];
                snapshots[index++] = new FormationPlayerPositionSnapshot(card.Id, player.Id, player.NormalizedX, player.NormalizedY);
            }
        }

        Array.Sort(snapshots, static (left, right) =>
        {
            var comparison = string.CompareOrdinal(left.CardId, right.CardId);
            return comparison != 0 ? comparison : string.CompareOrdinal(left.PlayerId, right.PlayerId);
        });

        return snapshots;
    }

    private CardMutationSnapshot[] CaptureMutations(ReadOnlySpan<CardViewModel> cards)
    {
        if (cards.Length == 0)
        {
            return Array.Empty<CardMutationSnapshot>();
        }

        var snapshots = new CardMutationSnapshot[cards.Length];
        for (var i = 0; i < cards.Length; i++)
        {
            snapshots[i] = CreateMutationSnapshot(cards[i]);
        }

        return snapshots;
    }

    private void ApplySnapshot(IReadOnlyList<CardGeometrySnapshot> snapshot)
    {
        if (snapshot is null || snapshot.Count == 0)
        {
            return;
        }

        _scratchCards.Clear();
        for (var i = 0; i < snapshot.Count; i++)
        {
            var card = FindCardById(snapshot[i].CardId);
            if (card is null)
            {
                continue;
            }

            var geometry = snapshot[i].Geometry;
            card.UpdateGeometry(geometry.Column, geometry.Row, geometry.ColumnSpan, geometry.RowSpan);
            UpdateCardVisibility(card);
            _scratchCards.Add(card);
        }

        if (_scratchCards.Count > 0)
        {
            PersistGeometries(_scratchCards.AsSpan());
        }
    }

    private void ApplyPlayerSnapshot(IReadOnlyList<FormationPlayerPositionSnapshot> snapshot)
    {
        if (snapshot is null || snapshot.Count == 0)
        {
            return;
        }

        _scratchCards.Clear();
        for (var i = 0; i < snapshot.Count; i++)
        {
            var card = FindCardById(snapshot[i].CardId);
            if (card is null)
            {
                continue;
            }

            card.UpdateFormationPlayer(snapshot[i].PlayerId, snapshot[i].X, snapshot[i].Y);
            if (!_scratchCards.Contains(card))
            {
                _scratchCards.Add(card);
            }
        }

        var span = _scratchCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            PersistFormationPlayers(span[i]);
        }
    }

    private void CommitHistory(
        IReadOnlyList<CardGeometrySnapshot> geometryBefore,
        IReadOnlyList<CardGeometrySnapshot> geometryAfter,
        IReadOnlyList<FormationPlayerPositionSnapshot> playersBefore,
        IReadOnlyList<FormationPlayerPositionSnapshot> playersAfter,
        IReadOnlyList<CardMutationSnapshot> addedCards,
        IReadOnlyList<CardMutationSnapshot> removedCards)
    {
        if (AreSnapshotsEqual(geometryBefore, geometryAfter) &&
            ArePlayerSnapshotsEqual(playersBefore, playersAfter) &&
            AreMutationSnapshotsEqual(addedCards, removedCards))
        {
            return;
        }

        _undoStack.Push(new CardHistoryEntry(geometryBefore, geometryAfter, playersBefore, playersAfter, addedCards, removedCards));
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

    private static bool ArePlayerSnapshotsEqual(IReadOnlyList<FormationPlayerPositionSnapshot> left, IReadOnlyList<FormationPlayerPositionSnapshot> right)
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

    private static bool AreMutationSnapshotsEqual(IReadOnlyList<CardMutationSnapshot> added, IReadOnlyList<CardMutationSnapshot> removed)
    {
        return added.Count == 0 && removed.Count == 0;
    }

    private CardGeometry ResolveSpawnGeometry(CardDefinition definition)
    {
        var spanColumns = Math.Clamp(definition.ColumnSpan, 1, _metrics.Columns);
        var spanRows = Math.Clamp(definition.RowSpan, 1, _metrics.Rows);
        var maxColumn = Math.Max(0, _metrics.Columns - spanColumns);
        var maxRow = Math.Max(0, _metrics.Rows - spanRows);
        var startColumn = Math.Clamp(definition.Column, 0, maxColumn);
        var startRow = Math.Clamp(definition.Row, 0, maxRow);

        var totalPositions = (maxColumn + 1) * (maxRow + 1);
        if (totalPositions <= 0)
        {
            return new CardGeometry(0, 0, spanColumns, spanRows);
        }

        var startIndex = 0;
        var index = 0;
        for (var row = 0; row <= maxRow; row++)
        {
            for (var column = 0; column <= maxColumn; column++)
            {
                if (column == startColumn && row == startRow)
                {
                    startIndex = index;
                }

                index++;
            }
        }

        index = 0;
        for (var offset = 0; offset < totalPositions; offset++)
        {
            var current = (startIndex + offset) % totalPositions;
            var row = current / (maxColumn + 1);
            var column = current - (row * (maxColumn + 1));
            var candidate = new CardGeometry(column, row, spanColumns, spanRows);
            if (!HasCollision(candidate))
            {
                return candidate;
            }
        }

        return new CardGeometry(startColumn, startRow, spanColumns, spanRows);
    }

    private bool HasCollision(CardGeometry candidate)
    {
        var span = _trackedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (IsOverlap(candidate, span[i].Geometry))
            {
                return true;
            }
        }

        return false;
    }

    private void CancelActiveInteraction()
    {
        if (_pendingSnapshot is not null)
        {
            ApplySnapshot(_pendingSnapshot);
            _pendingSnapshot = null;
        }

        if (_activePlayerState is not null)
        {
            ApplyPlayerSnapshot(_activePlayerState.Before);
            _activePlayerState = null;
        }

        _activeStates.Clear();
        _activeDragController = null;
        ClearPreview();
    }

    private CardMutationSnapshot CreateMutationSnapshot(CardViewModel card)
    {
        var formationState = card.HasFormationPlayers ? card.GetFormationPlayerStates() : Array.Empty<FormationPlayerState>();
        return new CardMutationSnapshot(card.Definition, card.PresetId, card.IsCustom, formationState);
    }

    private void OnSelectionChanged() => SelectionChanged?.Invoke(this, EventArgs.Empty);

    private void OnHistoryChanged() => HistoryChanged?.Invoke(this, EventArgs.Empty);

    private bool TryGetInteraction(CardViewModel card, out InteractionState state)
    {
        var span = _activeStates.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i].Card, card))
            {
                state = span[i].State;
                return true;
            }
        }

        state = InteractionState.Empty;
        return false;
    }

    private bool TryRemoveInteraction(CardViewModel card, out InteractionState state)
    {
        var span = _activeStates.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i].Card, card))
            {
                state = span[i].State;
                _activeStates.RemoveAt(i);
                return true;
            }
        }

        state = InteractionState.Empty;
        return false;
    }

    private void RemoveInteraction(CardViewModel card)
    {
        var span = _activeStates.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i].Card, card))
            {
                _activeStates.RemoveAt(i);
                return;
            }
        }
    }

    private bool IsCardActive(CardViewModel card)
    {
        var span = _activeStates.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i].Card, card))
            {
                return true;
            }
        }

        return false;
    }

    private bool IsTracked(CardViewModel card)
    {
        var span = _trackedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i], card))
            {
                return true;
            }
        }

        return false;
    }

    private CardViewModel? FindCardById(string id)
    {
        var span = _trackedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (string.Equals(span[i].Id, id, StringComparison.Ordinal))
            {
                return span[i];
            }
        }

        return null;
    }

    private bool IsCardSelected(CardViewModel card) => IndexOfSelected(card) >= 0;

    private bool RemoveFromSelection(CardViewModel card)
    {
        var index = IndexOfSelected(card);
        if (index < 0)
        {
            return false;
        }

        _selectedCards.RemoveAt(index);
        return true;
    }

    private int IndexOfSelected(CardViewModel card)
    {
        var span = _selectedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i], card))
            {
                return i;
            }
        }

        return -1;
    }

    private void ClearCurrentSelection()
    {
        var span = _selectedCards.AsSpan();
        for (var i = 0; i < span.Length; i++)
        {
            span[i].SetSelected(false);
        }

        _selectedCards.Clear();
    }

    private void EnsureScratchCapacity(int required)
    {
        if (_geometryScratch.Length < required)
        {
            _geometryScratch = new CardGeometry[required << 1];
        }

        if (_validityScratch.Length < required)
        {
            _validityScratch = new bool[required << 1];
        }
    }

    private readonly struct InteractionEntry
    {
        public InteractionEntry(CardViewModel card, InteractionState state)
        {
            Card = card;
            State = state;
        }

        public CardViewModel Card { get; }
        public InteractionState State { get; }
    }

    private sealed class InteractionState
    {
        private InteractionState(InteractionMode mode, CardGeometry geometry, ResizeHandle handle)
        {
            Mode = mode;
            OriginalGeometry = geometry;
            Handle = handle;
        }

        public static readonly InteractionState Empty = new(InteractionMode.Drag, default, ResizeHandle.SouthEast);

        public static InteractionState CreateDrag(CardGeometry geometry) => new(InteractionMode.Drag, geometry, ResizeHandle.SouthEast);

        public static InteractionState CreateResize(CardGeometry geometry, ResizeHandle handle) => new(InteractionMode.Resize, geometry, handle);

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
        private PlayerInteractionState(CardViewModel card, FormationPlayerViewModel player, IReadOnlyList<FormationPlayerPositionSnapshot> before)
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

        public static PlayerInteractionState Create(CardViewModel card, FormationPlayerViewModel player, IReadOnlyList<FormationPlayerPositionSnapshot> before)
            => new(card, player, before);
    }
}

public enum MutationOrigin
{
    User,
    UndoRedo
}

public sealed class CardMutationEventArgs : EventArgs
{
    public CardMutationEventArgs(MutationOrigin origin, IReadOnlyList<CardViewModel> addedCards, IReadOnlyList<CardViewModel> removedCards)
    {
        Origin = origin;
        AddedCards = addedCards ?? Array.Empty<CardViewModel>();
        RemovedCards = removedCards ?? Array.Empty<CardViewModel>();
    }

    public MutationOrigin Origin { get; }
    public IReadOnlyList<CardViewModel> AddedCards { get; }
    public IReadOnlyList<CardViewModel> RemovedCards { get; }
}
