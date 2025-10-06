using System.Collections.Generic;

namespace FMUI.Wpf.Models;

public readonly record struct CardDragDelta(double HorizontalChange, double VerticalChange);

public readonly record struct CardDragCompleted(bool Canceled);

public enum ResizeHandle
{
    East,
    South,
    SouthEast
}

public readonly record struct CardResizeDelta(ResizeHandle Handle, double HorizontalChange, double VerticalChange);

public readonly record struct CardResizeCompleted(ResizeHandle Handle, bool Canceled);

public readonly record struct CardGeometry(int Column, int Row, int ColumnSpan, int RowSpan);

public readonly record struct CardGeometrySnapshot(string CardId, CardGeometry Geometry);

public readonly record struct CardPreviewSnapshot(string CardId, CardGeometry Geometry, bool IsValid);

public readonly record struct FormationPlayerDragDelta(double HorizontalChange, double VerticalChange, double PitchWidth, double PitchHeight, double TokenSize);

public readonly record struct FormationPlayerDragCompleted(bool Canceled);

public readonly record struct FormationPlayerPositionSnapshot(string CardId, string PlayerId, double X, double Y);

public enum SelectionModifier
{
    Replace,
    Add,
    Toggle
}

public readonly record struct CardMutationSnapshot(
    CardDefinition Definition,
    string? PresetId,
    bool IsCustom,
    IReadOnlyList<FormationPlayerPositionSnapshot> FormationPlayers);

public readonly record struct CardHistoryEntry(
    IReadOnlyList<CardGeometrySnapshot> GeometryBefore,
    IReadOnlyList<CardGeometrySnapshot> GeometryAfter,
    IReadOnlyList<FormationPlayerPositionSnapshot> PlayersBefore,
    IReadOnlyList<FormationPlayerPositionSnapshot> PlayersAfter,
    IReadOnlyList<CardMutationSnapshot> AddedCards,
    IReadOnlyList<CardMutationSnapshot> RemovedCards);
