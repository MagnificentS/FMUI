using System;
using System.Windows.Input;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public sealed class CardPresenterDescriptor : ICardPresenterDescriptor
{
    public CardPresenterDescriptor(
        string cardId,
        CardDefinition definition,
        CardGeometry geometry,
        ICommand beginDragCommand,
        ICommand dragDeltaCommand,
        ICommand completeDragCommand,
        ICommand beginResizeCommand,
        ICommand resizeDeltaCommand,
        ICommand completeResizeCommand,
        ICommand openEditorCommand,
        bool isSelected,
        bool isVisible,
        bool isEditorAvailable)
    {
        CardId = cardId ?? throw new ArgumentNullException(nameof(cardId));
        Definition = definition ?? throw new ArgumentNullException(nameof(definition));
        Geometry = geometry;
        BeginDragCommand = beginDragCommand ?? throw new ArgumentNullException(nameof(beginDragCommand));
        DragDeltaCommand = dragDeltaCommand ?? throw new ArgumentNullException(nameof(dragDeltaCommand));
        CompleteDragCommand = completeDragCommand ?? throw new ArgumentNullException(nameof(completeDragCommand));
        BeginResizeCommand = beginResizeCommand ?? throw new ArgumentNullException(nameof(beginResizeCommand));
        ResizeDeltaCommand = resizeDeltaCommand ?? throw new ArgumentNullException(nameof(resizeDeltaCommand));
        CompleteResizeCommand = completeResizeCommand ?? throw new ArgumentNullException(nameof(completeResizeCommand));
        OpenEditorCommand = openEditorCommand ?? throw new ArgumentNullException(nameof(openEditorCommand));
        IsSelected = isSelected;
        IsVisible = isVisible;
        IsEditorAvailable = isEditorAvailable;
    }

    public string CardId { get; }

    public CardDefinition Definition { get; }

    public CardGeometry Geometry { get; }

    public bool IsSelected { get; }

    public bool IsVisible { get; }

    public bool IsEditorAvailable { get; }

    public ICommand BeginDragCommand { get; }

    public ICommand DragDeltaCommand { get; }

    public ICommand CompleteDragCommand { get; }

    public ICommand BeginResizeCommand { get; }

    public ICommand ResizeDeltaCommand { get; }

    public ICommand CompleteResizeCommand { get; }

    public ICommand OpenEditorCommand { get; }
}
