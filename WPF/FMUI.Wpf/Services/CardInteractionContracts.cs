using System.Collections.Generic;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

/// <summary>
/// Describes card interaction behaviors that can be invoked without direct presenter references.
/// </summary>
public interface ICardInteractionBehavior
{
    void BeginDrag(string cardId);

    void UpdateDrag(string cardId, in CardDragDelta delta);

    void CompleteDrag(string cardId, in CardDragCompleted completed);

    void BeginResize(string cardId, ResizeHandle handle);

    void UpdateResize(string cardId, in CardResizeDelta delta);

    void CompleteResize(string cardId, in CardResizeCompleted completed);

    void BeginPlayerDrag(string cardId, string playerId);

    void UpdatePlayerDrag(string cardId, string playerId, in FormationPlayerDragDelta delta);

    void CompletePlayerDrag(string cardId, string playerId, in FormationPlayerDragCompleted completed);
}

/// <summary>
/// Provides selection management operations for cards identified by their logical identifiers.
/// </summary>
public interface ICardSelectionBehavior
{
    void Select(string cardId, SelectionModifier modifier);

    void ClearSelection();

    bool IsSelected(string cardId);

    IReadOnlyList<string> GetSelection();
}

/// <summary>
/// Exposes geometry queries and updates for cards without requiring presenter access.
/// </summary>
public interface ICardGeometryManager
{
    bool TryGetGeometry(string cardId, out CardGeometry geometry);

    bool TryUpdateGeometry(string cardId, CardGeometry geometry);

    bool IsPlacementValid(CardGeometry geometry, string? ignoreCardId = null);
}
