using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;
using System.Windows.Media.Animation;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Controls;

public sealed class LineChartControl : FrameworkElement
{
    public static readonly DependencyProperty SeriesProperty = DependencyProperty.Register(
        nameof(Series),
        typeof(IReadOnlyList<ChartSeriesViewModel>),
        typeof(LineChartControl),
        new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.AffectsRender, OnSeriesChanged));

    public static readonly DependencyProperty AxisBrushProperty = DependencyProperty.Register(
        nameof(AxisBrush),
        typeof(Brush),
        typeof(LineChartControl),
        new FrameworkPropertyMetadata(BrushUtilities.CreateFrozenBrush("#1F2C3A"), FrameworkPropertyMetadataOptions.AffectsRender));

    public static readonly DependencyProperty GridLineBrushProperty = DependencyProperty.Register(
        nameof(GridLineBrush),
        typeof(Brush),
        typeof(LineChartControl),
        new FrameworkPropertyMetadata(BrushUtilities.CreateFrozenBrush("#14202D"), FrameworkPropertyMetadataOptions.AffectsRender));

    public static readonly DependencyProperty FillOpacityProperty = DependencyProperty.Register(
        nameof(FillOpacity),
        typeof(double),
        typeof(LineChartControl),
        new FrameworkPropertyMetadata(0.18, FrameworkPropertyMetadataOptions.AffectsRender));

    private readonly List<PointHitTestInfo> _hitTestPoints = new();
    private readonly Popup _tooltip;
    private readonly TextBlock _tooltipText;

    public LineChartControl()
    {
        _tooltipText = CreateTooltipTextBlock();
        _tooltip = CreateTooltipPopup(_tooltipText);
        MouseMove += OnMouseMove;
        MouseLeave += OnMouseLeave;
        IsHitTestVisible = true;
    }

    public IReadOnlyList<ChartSeriesViewModel>? Series
    {
        get => (IReadOnlyList<ChartSeriesViewModel>?)GetValue(SeriesProperty);
        set => SetValue(SeriesProperty, value);
    }

    public Brush AxisBrush
    {
        get => (Brush)GetValue(AxisBrushProperty);
        set => SetValue(AxisBrushProperty, value);
    }

    public Brush GridLineBrush
    {
        get => (Brush)GetValue(GridLineBrushProperty);
        set => SetValue(GridLineBrushProperty, value);
    }

    public double FillOpacity
    {
        get => (double)GetValue(FillOpacityProperty);
        set => SetValue(FillOpacityProperty, value);
    }

    public static readonly DependencyProperty AnimationProgressProperty = DependencyProperty.Register(
        nameof(AnimationProgress),
        typeof(double),
        typeof(LineChartControl),
        new FrameworkPropertyMetadata(1d, FrameworkPropertyMetadataOptions.AffectsRender));

    public double AnimationProgress
    {
        get => (double)GetValue(AnimationProgressProperty);
        set => SetValue(AnimationProgressProperty, value);
    }

    protected override void OnRender(DrawingContext drawingContext)
    {
        base.OnRender(drawingContext);

        if (Series is not { Count: > 0 })
        {
            _hitTestPoints.Clear();
            return;
        }

        var width = ActualWidth;
        var height = ActualHeight;

        if (width <= 0 || height <= 0)
        {
            _hitTestPoints.Clear();
            return;
        }

        var allPoints = Series.SelectMany(s => s.Points).ToList();
        if (allPoints.Count == 0)
        {
            _hitTestPoints.Clear();
            return;
        }

        var minValue = Series.Min(s => s.Minimum);
        var maxValue = Series.Max(s => s.Maximum);
        if (Math.Abs(maxValue - minValue) < 0.0001)
        {
            maxValue = minValue + 1;
        }

        const double horizontalPadding = 24;
        const double verticalPadding = 24;

        var chartWidth = Math.Max(0, width - (horizontalPadding * 2));
        var chartHeight = Math.Max(0, height - (verticalPadding * 2));

        var axisPen = new Pen(AxisBrush, 1.2);
        axisPen.Freeze();

        var gridPen = new Pen(GridLineBrush, 0.8) { DashStyle = DashStyles.Dot };
        gridPen.Freeze();

        var origin = new Point(horizontalPadding, height - verticalPadding);
        var verticalEnd = new Point(horizontalPadding, verticalPadding);
        var horizontalEnd = new Point(width - horizontalPadding, height - verticalPadding);

        drawingContext.DrawLine(axisPen, origin, verticalEnd);
        drawingContext.DrawLine(axisPen, origin, horizontalEnd);

        // Draw grid lines at quartiles.
        for (var i = 1; i <= 3; i++)
        {
            var ratio = i / 4.0;
            var y = verticalPadding + chartHeight * (1 - ratio);
            drawingContext.DrawLine(gridPen, new Point(horizontalPadding, y), new Point(width - horizontalPadding, y));
        }

        DrawAxisLabels(drawingContext, minValue, maxValue, origin, horizontalEnd, verticalPadding);

        _hitTestPoints.Clear();

        foreach (var series in Series)
        {
            DrawSeries(drawingContext, series, minValue, maxValue, horizontalPadding, verticalPadding, chartWidth, chartHeight);
        }
    }

    private static void OnSeriesChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is LineChartControl control)
        {
            control.StartEntranceAnimation();
            control.InvalidateVisual();
        }
    }

    private void DrawSeries(
        DrawingContext drawingContext,
        ChartSeriesViewModel series,
        double minimum,
        double maximum,
        double horizontalPadding,
        double verticalPadding,
        double chartWidth,
        double chartHeight)
    {
        if (series.Points.Count == 0)
        {
            return;
        }

        var step = series.Points.Count == 1 ? 0 : chartWidth / (series.Points.Count - 1);
        var progress = Math.Clamp(AnimationProgress, 0, 1);
        var geometry = new StreamGeometry();

        using (var context = geometry.Open())
        {
            for (var i = 0; i < series.Points.Count; i++)
            {
                var point = series.Points[i];
                var x = horizontalPadding + (step * i);
                var normalized = (point.Value - minimum) / (maximum - minimum);
                var animatedNormalized = normalized * progress;
                var y = verticalPadding + chartHeight * (1 - animatedNormalized);

                if (i == 0)
                {
                    context.BeginFigure(new Point(x, y), true, false);
                }
                else
                {
                    context.LineTo(new Point(x, y), true, false);
                }
            }

            var lastPoint = series.Points[^1];
            var firstPoint = series.Points[0];
            var lastX = horizontalPadding + step * (series.Points.Count - 1);
            var lastNormalized = (lastPoint.Value - minimum) / (maximum - minimum);
            var lastY = verticalPadding + chartHeight * (1 - (lastNormalized * progress));
            var firstNormalized = (firstPoint.Value - minimum) / (maximum - minimum);
            var firstY = verticalPadding + chartHeight * (1 - (firstNormalized * progress));

            context.LineTo(new Point(lastX, verticalPadding + chartHeight), true, false);
            context.LineTo(new Point(horizontalPadding, verticalPadding + chartHeight), true, false);
            context.LineTo(new Point(horizontalPadding, firstY), true, false);
        }

        geometry.Freeze();

        var fillBrush = series.Stroke.Clone();
        fillBrush.Opacity = FillOpacity;
        fillBrush.Freeze();

        drawingContext.DrawGeometry(fillBrush, null, geometry);

        var pen = new Pen(series.Stroke, 2.2) { LineJoin = PenLineJoin.Round };
        pen.Freeze();

        var pathGeometry = new StreamGeometry();
        using (var context = pathGeometry.Open())
        {
            for (var i = 0; i < series.Points.Count; i++)
            {
                var point = series.Points[i];
                var x = horizontalPadding + (step * i);
                var normalized = (point.Value - minimum) / (maximum - minimum);
                var animatedNormalized = normalized * progress;
                var y = verticalPadding + chartHeight * (1 - animatedNormalized);

                if (i == 0)
                {
                    context.BeginFigure(new Point(x, y), false, false);
                }
                else
                {
                    context.LineTo(new Point(x, y), true, false);
                }
            }
        }

        pathGeometry.Freeze();
        drawingContext.DrawGeometry(null, pen, pathGeometry);

        foreach (var (point, index) in series.Points.Select((p, i) => (p, i)))
        {
            var x = horizontalPadding + (step * index);
            var normalized = (point.Value - minimum) / (maximum - minimum);
            var animatedNormalized = normalized * progress;
            var y = verticalPadding + chartHeight * (1 - animatedNormalized);
            drawingContext.DrawEllipse(series.Stroke, null, new Point(x, y), 4, 4);

            var label = new FormattedText(
                point.Label,
                CultureInfo.CurrentUICulture,
                FlowDirection.LeftToRight,
                new Typeface("Segoe UI"),
                11,
                AxisBrush,
                VisualTreeHelper.GetDpi(this).PixelsPerDip);

            drawingContext.DrawText(label, new Point(x - label.Width / 2, Math.Max(verticalPadding, y - 24)));

            var bounds = new Rect(new Point(x - 8, y - 8), new Size(16, 16));
            _hitTestPoints.Add(new PointHitTestInfo(bounds, series, point));
        }
    }

    private void DrawAxisLabels(
        DrawingContext drawingContext,
        double minimum,
        double maximum,
        Point origin,
        Point horizontalEnd,
        double verticalPadding)
    {
        var typeface = new Typeface("Segoe UI");
        var dpi = VisualTreeHelper.GetDpi(this).PixelsPerDip;

        var minLabel = new FormattedText(
            minimum.ToString("0.0"),
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            typeface,
            11,
            AxisBrush,
            dpi);

        drawingContext.DrawText(minLabel, new Point(origin.X - minLabel.Width - 6, origin.Y - minLabel.Height));

        var maxLabel = new FormattedText(
            maximum.ToString("0.0"),
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            typeface,
            11,
            AxisBrush,
            dpi);

        drawingContext.DrawText(maxLabel, new Point(origin.X - maxLabel.Width - 6, verticalPadding - (maxLabel.Height / 2)));

        var firstSeries = Series!.FirstOrDefault(s => s.Points.Count > 0);
        if (firstSeries is null)
        {
            return;
        }

        var startLabel = new FormattedText(
            firstSeries.Points.First().Label,
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            typeface,
            11,
            AxisBrush,
            dpi);

        drawingContext.DrawText(startLabel, new Point(origin.X - (startLabel.Width / 2), origin.Y + 6));

        var endLabel = new FormattedText(
            firstSeries.Points.Last().Label,
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            typeface,
            11,
            AxisBrush,
            dpi);

        drawingContext.DrawText(endLabel, new Point(horizontalEnd.X - (endLabel.Width / 2), origin.Y + 6));
    }

    private void StartEntranceAnimation()
    {
        BeginAnimation(AnimationProgressProperty, null);
        var animation = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(520))
        {
            EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut }
        };
        BeginAnimation(AnimationProgressProperty, animation);
    }

    private void OnMouseMove(object sender, System.Windows.Input.MouseEventArgs e)
    {
        if (_hitTestPoints.Count == 0)
        {
            HideTooltip();
            return;
        }

        var position = e.GetPosition(this);
        var hit = _hitTestPoints.FirstOrDefault(info => info.Bounds.Contains(position));
        if (hit.Series is null)
        {
            HideTooltip();
            return;
        }

        _tooltipText.Text = $"{hit.Series.Name}: {hit.Point.Value:0.##}\n{hit.Point.Label}";
        _tooltip.HorizontalOffset = position.X + 12;
        _tooltip.VerticalOffset = position.Y - 32;
        if (!_tooltip.IsOpen)
        {
            _tooltip.IsOpen = true;
        }
    }

    private void OnMouseLeave(object sender, System.Windows.Input.MouseEventArgs e)
    {
        HideTooltip();
    }

    private void HideTooltip()
    {
        if (_tooltip.IsOpen)
        {
            _tooltip.IsOpen = false;
        }
    }

    private static TextBlock CreateTooltipTextBlock()
    {
        return new TextBlock
        {
            FontFamily = new FontFamily("Segoe UI"),
            FontSize = 12,
            Foreground = Brushes.White,
            Margin = new Thickness(12, 8, 12, 8),
            TextWrapping = TextWrapping.Wrap
        };
    }

    private Popup CreateTooltipPopup(UIElement content)
    {
        var border = new Border
        {
            Background = BrushUtilities.CreateFrozenBrush("#1B2734"),
            BorderBrush = BrushUtilities.CreateFrozenBrush("#2EC4B6"),
            BorderThickness = new Thickness(1),
            CornerRadius = new CornerRadius(6),
            Child = content,
            Effect = new System.Windows.Media.Effects.DropShadowEffect
            {
                BlurRadius = 8,
                ShadowDepth = 0,
                Opacity = 0.6,
                Color = Colors.Black
            }
        };

        return new Popup
        {
            Placement = PlacementMode.Relative,
            PlacementTarget = this,
            AllowsTransparency = true,
            StaysOpen = false,
            Child = border
        };
    }

    private readonly struct PointHitTestInfo
    {
        public PointHitTestInfo(Rect bounds, ChartSeriesViewModel series, ChartDataPointViewModel point)
        {
            Bounds = bounds;
            Series = series;
            Point = point;
        }

        public Rect Bounds { get; }

        public ChartSeriesViewModel Series { get; }

        public ChartDataPointViewModel Point { get; }
    }
}
