using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class TrainingCalendarView : UserControl
{
    private const string DragDataFormat = "FMUI.Wpf.TrainingCalendar.Session";
    private Point? _dragStartPoint;

    public TrainingCalendarView()
    {
        InitializeComponent();
    }

    private void OnSessionPreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        _dragStartPoint = e.GetPosition(this);
    }

    private void OnSessionPreviewMouseLeftButtonUp(object sender, MouseButtonEventArgs e)
    {
        _dragStartPoint = null;
    }

    private void OnSessionPreviewMouseMove(object sender, MouseEventArgs e)
    {
        if (e.LeftButton != MouseButtonState.Pressed || _dragStartPoint is null)
        {
            return;
        }

        var current = e.GetPosition(this);
        if (Math.Abs(current.X - _dragStartPoint.Value.X) < SystemParameters.MinimumHorizontalDragDistance &&
            Math.Abs(current.Y - _dragStartPoint.Value.Y) < SystemParameters.MinimumVerticalDragDistance)
        {
            return;
        }

        if (sender is not FrameworkElement element)
        {
            return;
        }

        if (element.DataContext is not TrainingCalendarSessionViewModel session)
        {
            return;
        }

        if (DataContext is not TrainingCalendarViewModel viewModel || !viewModel.CanInteract)
        {
            return;
        }

        _dragStartPoint = null;
        var data = new DataObject(DragDataFormat, session);
        DragDrop.DoDragDrop(element, data, DragDropEffects.Move);
    }

    private void OnSlotDragOver(object sender, DragEventArgs e)
    {
        e.Handled = true;
        if (!ValidatePayload(sender, e, out _))
        {
            e.Effects = DragDropEffects.None;
            return;
        }

        e.Effects = DragDropEffects.Move;
    }

    private async void OnSlotDrop(object sender, DragEventArgs e)
    {
        e.Handled = true;
        if (!ValidatePayload(sender, e, out var payload))
        {
            return;
        }

        var (viewModel, session, slot) = payload;
        var index = slot.Sessions.Count;

        if (e.OriginalSource is FrameworkElement element && element.DataContext is TrainingCalendarSessionViewModel target)
        {
            var candidate = slot.Sessions.IndexOf(target);
            if (candidate >= 0)
            {
                index = candidate;
                var position = e.GetPosition(element);
                if (position.Y > element.ActualHeight / 2)
                {
                    index++;
                }
            }
        }

        await viewModel.MoveSessionAsync(session, slot, index).ConfigureAwait(true);
    }

    private bool ValidatePayload(object sender, DragEventArgs e, out (TrainingCalendarViewModel ViewModel, TrainingCalendarSessionViewModel Session, TrainingCalendarSlotViewModel Slot) payload)
    {
        payload = default;
        if (DataContext is not TrainingCalendarViewModel viewModel || !viewModel.CanInteract)
        {
            return false;
        }

        if (sender is not FrameworkElement element || element.DataContext is not TrainingCalendarSlotViewModel slot)
        {
            return false;
        }

        if (!e.Data.GetDataPresent(DragDataFormat))
        {
            return false;
        }

        if (e.Data.GetData(DragDataFormat) is not TrainingCalendarSessionViewModel session)
        {
            return false;
        }

        payload = (viewModel, session, slot);
        return true;
    }
}
