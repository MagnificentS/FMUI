using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;
using System.Windows.Media.Animation;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Controls;

public sealed class RadialGaugeControl : FrameworkElement
{
    public static readonly DependencyProperty GaugeProperty = DependencyProperty.Register(
        nameof(Gauge),
        typeof(GaugeViewModel),
        typeof(RadialGaugeControl),
        new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.AffectsRender, OnGaugeChanged));

    public static readonly DependencyProperty AxisBrushProperty = DependencyProperty.Register(
        nameof(AxisBrush),
        typeof(Brush),
        typeof(RadialGaugeControl),
        new FrameworkPropertyMetadata(BrushUtilities.CreateFrozenBrush("#1F2C3A"), FrameworkPropertyMetadataOptions.AffectsRender));

    public static readonly DependencyProperty ValueBrushProperty = DependencyProperty.Register(
        nameof(ValueBrush),
        typeof(Brush),
        typeof(RadialGaugeControl),
        new FrameworkPropertyMetadata(BrushUtilities.CreateFrozenBrush("#2EC4B6"), FrameworkPropertyMetadataOptions.AffectsRender));

    public static readonly DependencyProperty DisplayValueProperty = DependencyProperty.Register(
        nameof(DisplayValue),
        typeof(double),
        typeof(RadialGaugeControl),
        new FrameworkPropertyMetadata(0d, FrameworkPropertyMetadataOptions.AffectsRender));

    private readonly Popup _tooltip;
    private readonly TextBlock _tooltipText;

    public RadialGaugeControl()
    {
        _tooltipText = CreateTooltipTextBlock();
        _tooltip = CreateTooltipPopup(_tooltipText);
        MouseMove += OnMouseMove;
        MouseLeave += (_, _) => HideTooltip();
    }

    public GaugeViewModel? Gauge
    {
        get => (GaugeViewModel?)GetValue(GaugeProperty);
        set => SetValue(GaugeProperty, value);
    }

    public Brush AxisBrush
    {
        get => (Brush)GetValue(AxisBrushProperty);
        set => SetValue(AxisBrushProperty, value);
    }

    public Brush ValueBrush
    {
        get => (Brush)GetValue(ValueBrushProperty);
        set => SetValue(ValueBrushProperty, value);
    }

    public double DisplayValue
    {
        get => (double)GetValue(DisplayValueProperty);
        set => SetValue(DisplayValueProperty, value);
    }

    protected override void OnRender(DrawingContext drawingContext)
    {
        base.OnRender(drawingContext);

        if (Gauge is null)
        {
            HideTooltip();
            return;
        }

        var width = ActualWidth;
        var height = ActualHeight;
        if (width <= 0 || height <= 0)
        {
            HideTooltip();
            return;
        }

        var center = new Point(width / 2, height / 2 + 20);
        var radius = Math.Min(width, height * 1.6) / 2.6;
        var innerRadius = radius * 0.68;

        DrawBands(drawingContext, Gauge, center, radius, innerRadius);
        DrawAxis(drawingContext, center, radius, innerRadius);
        DrawValue(drawingContext, Gauge, center, radius, innerRadius);
    }

    private static void OnGaugeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is RadialGaugeControl control)
        {
            control.StartAnimation();
            control.UpdateTooltipContent();
            control.InvalidateVisual();
        }
    }

    private void DrawBands(DrawingContext drawingContext, GaugeViewModel gauge, Point center, double radius, double innerRadius)
    {
        foreach (var band in gauge.Bands)
        {
            var geometry = CreateArcGeometry(center, radius, innerRadius, band.Start, band.End);
            drawingContext.DrawGeometry(band.Brush, null, geometry);
        }
    }

    private void DrawAxis(DrawingContext drawingContext, Point center, double radius, double innerRadius)
    {
        var pen = new Pen(AxisBrush, 2);
        pen.Freeze();

        var background = BrushUtilities.CreateFrozenBrush("#0C121A");
        var axisGeometry = CreateArcGeometry(center, radius, innerRadius, 0, 1);
        drawingContext.DrawGeometry(background, pen, axisGeometry);
    }

    private void DrawValue(DrawingContext drawingContext, GaugeViewModel gauge, Point center, double radius, double innerRadius)
    {
        var ratio = (DisplayValue - gauge.Minimum) / (gauge.Maximum - gauge.Minimum);
        ratio = Math.Clamp(ratio, 0, 1);

        var geometry = CreateArcGeometry(center, radius, innerRadius, 0, ratio);
        drawingContext.DrawGeometry(ValueBrush, null, geometry);

        var targetRatio = (gauge.Target - gauge.Minimum) / (gauge.Maximum - gauge.Minimum);
        targetRatio = Math.Clamp(targetRatio, 0, 1);
        DrawNeedle(drawingContext, center, radius, targetRatio);

        DrawCenterText(drawingContext, gauge, center);
    }

    private void DrawCenterText(DrawingContext drawingContext, GaugeViewModel gauge, Point center)
    {
        var dpi = VisualTreeHelper.GetDpi(this).PixelsPerDip;
        var valueText = new FormattedText(
            gauge.DisplayValue,
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            new Typeface("Segoe UI Semibold"),
            24,
            Brushes.White,
            dpi);

        drawingContext.DrawText(valueText, new Point(center.X - valueText.Width / 2, center.Y - valueText.Height));

        var summary = gauge.DisplaySummary ?? $"Target {gauge.Target:0.#}{gauge.Unit}";
        var targetText = new FormattedText(
            summary,
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            new Typeface("Segoe UI"),
            12,
            AxisBrush,
            dpi);

        var summaryOrigin = new Point(center.X - targetText.Width / 2, center.Y + 12);
        drawingContext.DrawText(targetText, summaryOrigin);

        if (gauge.HasDisplayPill)
        {
            DrawPill(drawingContext, gauge.DisplayPill!, new Point(center.X, summaryOrigin.Y + targetText.Height + 6));
        }
    }

    private void DrawPill(DrawingContext drawingContext, string text, Point anchor)
    {
        var dpi = VisualTreeHelper.GetDpi(this).PixelsPerDip;
        var pillText = new FormattedText(
            text,
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            new Typeface("Segoe UI Semibold"),
            11,
            Brushes.White,
            dpi);

        var padding = new Size(12, 5);
        var rect = new Rect(
            anchor.X - (pillText.Width / 2) - padding.Width,
            anchor.Y,
            pillText.Width + (padding.Width * 2),
            pillText.Height + (padding.Height * 2));

        var background = BrushUtilities.CreateFrozenBrush("#233447");
        drawingContext.DrawRoundedRectangle(background, new Pen(ValueBrush, 1.2), rect, 10, 10);
        drawingContext.DrawText(pillText, new Point(rect.Left + padding.Width, rect.Top + padding.Height - 1));
    }

    private void DrawNeedle(DrawingContext drawingContext, Point center, double radius, double ratio)
    {
        var angle = DegreeToRadian(135 + (270 * ratio));
        var needleLength = radius * 0.88;
        var endPoint = new Point(center.X + needleLength * Math.Cos(angle), center.Y + needleLength * Math.Sin(angle));

        var pen = new Pen(BrushUtilities.CreateFrozenBrush("#E5B83F"), 3)
        {
            StartLineCap = PenLineCap.Round,
            EndLineCap = PenLineCap.Round
        };
        pen.Freeze();

        drawingContext.DrawLine(pen, center, endPoint);
    }

    private static Geometry CreateArcGeometry(Point center, double radius, double innerRadius, double startRatio, double endRatio)
    {
        var startAngle = DegreeToRadian(135 + (270 * startRatio));
        var endAngle = DegreeToRadian(135 + (270 * endRatio));

        var outerStart = new Point(center.X + radius * Math.Cos(startAngle), center.Y + radius * Math.Sin(startAngle));
        var outerEnd = new Point(center.X + radius * Math.Cos(endAngle), center.Y + radius * Math.Sin(endAngle));
        var innerStart = new Point(center.X + innerRadius * Math.Cos(endAngle), center.Y + innerRadius * Math.Sin(endAngle));
        var innerEnd = new Point(center.X + innerRadius * Math.Cos(startAngle), center.Y + innerRadius * Math.Sin(startAngle));

        var geometry = new StreamGeometry();
        using (var context = geometry.Open())
        {
            context.BeginFigure(outerStart, true, true);
            context.ArcTo(outerEnd, new Size(radius, radius), 0, endRatio - startRatio > 0.5, SweepDirection.Clockwise, true, false);
            context.LineTo(innerStart, true, false);
            context.ArcTo(innerEnd, new Size(innerRadius, innerRadius), 0, endRatio - startRatio > 0.5, SweepDirection.Counterclockwise, true, false);
        }

        geometry.Freeze();
        return geometry;
    }

    private static double DegreeToRadian(double degree) => degree * (Math.PI / 180);

    private void StartAnimation()
    {
        if (Gauge is null)
        {
            return;
        }

        var current = DisplayValue;
        var target = Gauge.Value;
        BeginAnimation(DisplayValueProperty, null);
        var animation = new DoubleAnimation(current, target, TimeSpan.FromMilliseconds(540))
        {
            EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut }
        };
        BeginAnimation(DisplayValueProperty, animation);
    }

    private void OnMouseMove(object? sender, System.Windows.Input.MouseEventArgs e)
    {
        if (Gauge is null)
        {
            HideTooltip();
            return;
        }

        var position = e.GetPosition(this);
        _tooltipText.Text = $"{Gauge.DisplayValue}\nTarget {Gauge.Target:0.#}{Gauge.Unit}";
        _tooltip.HorizontalOffset = position.X + 16;
        _tooltip.VerticalOffset = position.Y - 24;
        if (!_tooltip.IsOpen)
        {
            _tooltip.IsOpen = true;
        }
    }

    private void HideTooltip()
    {
        if (_tooltip.IsOpen)
        {
            _tooltip.IsOpen = false;
        }
    }

    private void UpdateTooltipContent()
    {
        if (Gauge is null)
        {
            HideTooltip();
            return;
        }

        _tooltipText.Text = $"{Gauge.DisplayValue}\nTarget {Gauge.Target:0.#}{Gauge.Unit}";
    }

    private static TextBlock CreateTooltipTextBlock()
    {
        return new TextBlock
        {
            FontFamily = new FontFamily("Segoe UI"),
            FontSize = 12,
            Foreground = Brushes.White,
            Margin = new Thickness(12, 8, 12, 8)
        };
    }

    private Popup CreateTooltipPopup(UIElement content)
    {
        var border = new Border
        {
            Background = BrushUtilities.CreateFrozenBrush("#1B2734"),
            BorderBrush = BrushUtilities.CreateFrozenBrush("#E5B83F"),
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
}
