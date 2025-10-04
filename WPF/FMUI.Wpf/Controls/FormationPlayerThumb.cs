using System.Windows;
using System.Windows.Controls.Primitives;
using System.Windows.Input;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Controls;

public sealed class FormationPlayerThumb : Thumb
{
    public static readonly DependencyProperty BeginDragCommandProperty = DependencyProperty.Register(
        nameof(BeginDragCommand),
        typeof(ICommand),
        typeof(FormationPlayerThumb));

    public static readonly DependencyProperty DragDeltaCommandProperty = DependencyProperty.Register(
        nameof(DragDeltaCommand),
        typeof(ICommand),
        typeof(FormationPlayerThumb));

    public static readonly DependencyProperty DragCompletedCommandProperty = DependencyProperty.Register(
        nameof(DragCompletedCommand),
        typeof(ICommand),
        typeof(FormationPlayerThumb));

    public static readonly DependencyProperty PitchWidthProperty = DependencyProperty.Register(
        nameof(PitchWidth),
        typeof(double),
        typeof(FormationPlayerThumb),
        new FrameworkPropertyMetadata(double.NaN));

    public static readonly DependencyProperty PitchHeightProperty = DependencyProperty.Register(
        nameof(PitchHeight),
        typeof(double),
        typeof(FormationPlayerThumb),
        new FrameworkPropertyMetadata(double.NaN));

    public static readonly DependencyProperty TokenSizeProperty = DependencyProperty.Register(
        nameof(TokenSize),
        typeof(double),
        typeof(FormationPlayerThumb),
        new FrameworkPropertyMetadata(0d));

    public ICommand? BeginDragCommand
    {
        get => (ICommand?)GetValue(BeginDragCommandProperty);
        set => SetValue(BeginDragCommandProperty, value);
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

    public double PitchWidth
    {
        get => (double)GetValue(PitchWidthProperty);
        set => SetValue(PitchWidthProperty, value);
    }

    public double PitchHeight
    {
        get => (double)GetValue(PitchHeightProperty);
        set => SetValue(PitchHeightProperty, value);
    }

    public double TokenSize
    {
        get => (double)GetValue(TokenSizeProperty);
        set => SetValue(TokenSizeProperty, value);
    }

    protected override void OnDragStarted(DragStartedEventArgs e)
    {
        base.OnDragStarted(e);

        if (BeginDragCommand?.CanExecute(null) == true)
        {
            BeginDragCommand.Execute(null);
        }
    }

    protected override void OnDragDelta(DragDeltaEventArgs e)
    {
        base.OnDragDelta(e);

        var parameter = new FormationPlayerDragDelta(
            e.HorizontalChange,
            e.VerticalChange,
            double.IsNaN(PitchWidth) ? ActualWidth : PitchWidth,
            double.IsNaN(PitchHeight) ? ActualHeight : PitchHeight,
            TokenSize);

        if (DragDeltaCommand?.CanExecute(parameter) == true)
        {
            DragDeltaCommand.Execute(parameter);
        }
    }

    protected override void OnDragCompleted(DragCompletedEventArgs e)
    {
        base.OnDragCompleted(e);

        var parameter = new FormationPlayerDragCompleted(e.Canceled);
        if (DragCompletedCommand?.CanExecute(parameter) == true)
        {
            DragCompletedCommand.Execute(parameter);
        }
    }
}
