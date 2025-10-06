using System.Windows.Input;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public interface ICardPresenterDescriptor
{
    string CardId { get; }

    CardDefinition Definition { get; }

    CardGeometry Geometry { get; }

    bool IsSelected { get; }

    bool IsVisible { get; }

    bool IsEditorAvailable { get; }

    ICommand BeginDragCommand { get; }

    ICommand DragDeltaCommand { get; }

    ICommand CompleteDragCommand { get; }

    ICommand BeginResizeCommand { get; }

    ICommand ResizeDeltaCommand { get; }

    ICommand CompleteResizeCommand { get; }

    ICommand OpenEditorCommand { get; }
}
