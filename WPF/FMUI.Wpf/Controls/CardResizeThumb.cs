using System.Windows;
using System.Windows.Controls.Primitives;
using System.Windows.Input;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Controls;

public sealed class CardResizeThumb : Thumb
{
    public static readonly DependencyProperty HandleProperty = DependencyProperty.Register(
        nameof(Handle),
        typeof(ResizeHandle),
        typeof(CardResizeThumb),
        new PropertyMetadata(ResizeHandle.SouthEast));

    public static readonly DependencyProperty DragStartedCommandProperty = DependencyProperty.Register(
        nameof(DragStartedCommand),
        typeof(ICommand),
        typeof(CardResizeThumb));

    public static readonly DependencyProperty DragDeltaCommandProperty = DependencyProperty.Register(
        nameof(DragDeltaCommand),
        typeof(ICommand),
        typeof(CardResizeThumb));

    public static readonly DependencyProperty DragCompletedCommandProperty = DependencyProperty.Register(
        nameof(DragCompletedCommand),
        typeof(ICommand),
        typeof(CardResizeThumb));

    public ResizeHandle Handle
    {
        get => (ResizeHandle)GetValue(HandleProperty);
        set => SetValue(HandleProperty, value);
    }

    public ICommand? DragStartedCommand
    {
        get => (ICommand?)GetValue(DragStartedCommandProperty);
        set => SetValue(DragStartedCommandProperty, value);
    }

    public ICommand? DragDeltaCommand
    {
        get => (ICommand?)GetValue(DragDeltaCommandProperty);
        set => SetValue(DragDeltaCommandProperty, value);
    }

    public ICommand? DragCompletedCommand
    {
        get => (ICommand?)GetValue(DragCompletedCommandProperty);
        set => SetValue(DragCompletedCommandProperty, value);
    }

    protected override void OnDragStarted(DragStartedEventArgs e)
    {
        base.OnDragStarted(e);
        if (DragStartedCommand?.CanExecute(Handle) == true)
        {
            DragStartedCommand.Execute(Handle);
        }
    }

    protected override void OnDragDelta(DragDeltaEventArgs e)
    {
        base.OnDragDelta(e);
        var parameter = new CardResizeDelta(Handle, e.HorizontalChange, e.VerticalChange);
        if (DragDeltaCommand?.CanExecute(parameter) == true)
        {
            DragDeltaCommand.Execute(parameter);
        }
    }

    protected override void OnDragCompleted(DragCompletedEventArgs e)
    {
        base.OnDragCompleted(e);
        var parameter = new CardResizeCompleted(Handle, e.Canceled);
        if (DragCompletedCommand?.CanExecute(parameter) == true)
        {
            DragCompletedCommand.Execute(parameter);
        }
    }
}
