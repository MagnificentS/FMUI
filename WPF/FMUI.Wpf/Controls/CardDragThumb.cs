using System.Windows;
using System.Windows.Controls.Primitives;
using System.Windows.Input;
using System.Windows.Media;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;
using FMUI.Wpf.Views;

namespace FMUI.Wpf.Controls;

public class CardDragThumb : Thumb
{
    public static readonly DependencyProperty DragStartedCommandProperty = DependencyProperty.Register(
        nameof(DragStartedCommand),
        typeof(ICommand),
        typeof(CardDragThumb));

    public static readonly DependencyProperty DragDeltaCommandProperty = DependencyProperty.Register(
        nameof(DragDeltaCommand),
        typeof(ICommand),
        typeof(CardDragThumb));

    public static readonly DependencyProperty DragCompletedCommandProperty = DependencyProperty.Register(
        nameof(DragCompletedCommand),
        typeof(ICommand),
        typeof(CardDragThumb));

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

    protected override void OnPreviewMouseLeftButtonDown(MouseButtonEventArgs e)
    {
        base.OnPreviewMouseLeftButtonDown(e);

        if (DataContext is CardPresenter card)
        {
            var modifiers = Keyboard.Modifiers;
            var selectionModifier = SelectionModifier.Replace;

            if ((modifiers & ModifierKeys.Control) == ModifierKeys.Control)
            {
                selectionModifier = SelectionModifier.Toggle;
            }
            else if ((modifiers & ModifierKeys.Shift) == ModifierKeys.Shift)
            {
                selectionModifier = SelectionModifier.Add;
            }

            card.RequestSelection(selectionModifier);
        }

        if (FindAncestor<CardSurfaceView>(this) is { } surface)
        {
            surface.Focus();
        }
    }

    protected override void OnDragStarted(DragStartedEventArgs e)
    {
        base.OnDragStarted(e);
        if (DragStartedCommand?.CanExecute(null) == true)
        {
            DragStartedCommand.Execute(null);
        }
    }

    protected override void OnDragDelta(DragDeltaEventArgs e)
    {
        base.OnDragDelta(e);
        var parameter = new CardDragDelta(e.HorizontalChange, e.VerticalChange);
        if (DragDeltaCommand?.CanExecute(parameter) == true)
        {
            DragDeltaCommand.Execute(parameter);
        }
    }

    protected override void OnDragCompleted(DragCompletedEventArgs e)
    {
        base.OnDragCompleted(e);
        var parameter = new CardDragCompleted(e.Canceled);
        if (DragCompletedCommand?.CanExecute(parameter) == true)
        {
            DragCompletedCommand.Execute(parameter);
        }
    }

    private static T? FindAncestor<T>(DependencyObject? current)
        where T : DependencyObject
    {
        while (current is not null && current is not T)
        {
            current = VisualTreeHelper.GetParent(current);
        }

        return current as T;
    }
}
