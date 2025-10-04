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

public sealed class TimelineControl : FrameworkElement
{
    public static readonly DependencyProperty ItemsProperty = DependencyProperty.Register(
        nameof(Items),
        typeof(IReadOnlyList<TimelineEntryViewModel>),
        typeof(TimelineControl),
        new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.AffectsRender, OnItemsChanged));

    public static readonly DependencyProperty AxisBrushProperty = DependencyProperty.Register(
        nameof(AxisBrush),
        typeof(Brush),
        typeof(TimelineControl),
        new FrameworkPropertyMetadata(BrushUtilities.CreateFrozenBrush("#1F2C3A"), FrameworkPropertyMetadataOptions.AffectsRender));

    public static readonly DependencyProperty PillBackgroundProperty = DependencyProperty.Register(
        nameof(PillBackground),
        typeof(Brush),
        typeof(TimelineControl),
        new FrameworkPropertyMetadata(BrushUtilities.CreateFrozenBrush("#233447"), FrameworkPropertyMetadataOptions.AffectsRender));

    public static readonly DependencyProperty AnimationProgressProperty = DependencyProperty.Register(
        nameof(AnimationProgress),
        typeof(double),
        typeof(TimelineControl),
        new FrameworkPropertyMetadata(1d, FrameworkPropertyMetadataOptions.AffectsRender));

    private static readonly QuadraticEase EntryEase = new() { EasingMode = EasingMode.EaseOut };

    private readonly List<TimelineHitTestInfo> _hitTest = new();
    private readonly Popup _tooltip;
    private readonly TextBlock _tooltipText;

    public TimelineControl()
    {
        _tooltipText = CreateTooltipText();
        _tooltip = CreateTooltipPopup(_tooltipText);
        MouseMove += OnMouseMove;
        MouseLeave += (_, _) => HideTooltip();
    }

    public IReadOnlyList<TimelineEntryViewModel>? Items
    {
        get => (IReadOnlyList<TimelineEntryViewModel>?)GetValue(ItemsProperty);
        set => SetValue(ItemsProperty, value);
    }

    public Brush AxisBrush
    {
        get => (Brush)GetValue(AxisBrushProperty);
        set => SetValue(AxisBrushProperty, value);
    }

    public Brush PillBackground
    {
        get => (Brush)GetValue(PillBackgroundProperty);
        set => SetValue(PillBackgroundProperty, value);
    }

    public double AnimationProgress
    {
        get => (double)GetValue(AnimationProgressProperty);
        set => SetValue(AnimationProgressProperty, value);
    }

    protected override void OnRender(DrawingContext drawingContext)
    {
        base.OnRender(drawingContext);

        if (Items is not { Count: > 0 })
        {
            _hitTest.Clear();
            HideTooltip();
            return;
        }

        var width = ActualWidth;
        var height = ActualHeight;
        if (width <= 0 || height <= 0)
        {
            _hitTest.Clear();
            HideTooltip();
            return;
        }

        const double horizontalPadding = 36;
        const double axisY = 0.6;
        var axisPen = new Pen(AxisBrush, 1.4) { StartLineCap = PenLineCap.Round, EndLineCap = PenLineCap.Round };
        axisPen.Freeze();

        var axisTop = height * axisY;
        drawingContext.DrawLine(axisPen, new Point(horizontalPadding, axisTop), new Point(width - horizontalPadding, axisTop));

        var ordered = Items.OrderBy(i => i.Position).ToList();
        _hitTest.Clear();
        var total = ordered.Count;
        var progress = Math.Clamp(AnimationProgress, 0, 1);

        for (var index = 0; index < total; index++)
        {
            var item = ordered[index];
            var start = (double)index / total;
            var end = (double)(index + 1) / total;
            var entryProgress = Math.Clamp((progress - start) / Math.Max(0.0001, end - start), 0, 1);
            DrawEntry(drawingContext, item, horizontalPadding, width, axisTop, entryProgress);
        }
    }

    private static void OnItemsChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is TimelineControl control)
        {
            control.StartEntranceAnimation();
            control.InvalidateVisual();
        }
    }

    private void DrawEntry(
        DrawingContext drawingContext,
        TimelineEntryViewModel entry,
        double horizontalPadding,
        double width,
        double axisTop,
        double progress)
    {
        var clamped = Math.Clamp(entry.Position, 0, 1);
        var x = horizontalPadding + (clamped * (width - (horizontalPadding * 2)));

        var accentBrush = entry.AccentBrush ?? BrushUtilities.CreateFrozenBrush("#2EC4B6");
        var markerRadius = entry.HasPill ? 8 : 6;
        var eased = EntryEase.Ease(progress);
        var verticalOffset = (1 - eased) * 18;

        drawingContext.PushOpacity(eased);
        drawingContext.DrawEllipse(accentBrush, null, new Point(x, axisTop - verticalOffset), markerRadius, markerRadius);

        var label = CreateText(entry.Label, 14, FontWeights.SemiBold, accentBrush);
        var labelOrigin = new Point(x - label.Width / 2, axisTop - 48 - verticalOffset);
        drawingContext.DrawText(label, labelOrigin);

        Rect? bounds = null;

        if (entry.HasDetail)
        {
            var detail = CreateText(entry.Detail!, 12, FontWeights.Normal, AxisBrush);
            var detailOrigin = new Point(x - detail.Width / 2, axisTop - 28 - verticalOffset);
            drawingContext.DrawText(detail, detailOrigin);
            bounds = new Rect(new Point(Math.Min(labelOrigin.X, detailOrigin.X), detailOrigin.Y - 8),
                new Size(Math.Max(label.Width, detail.Width), 56));
        }
        else
        {
            bounds = new Rect(labelOrigin, new Size(label.Width, 40));
        }

        if (entry.HasPill)
        {
            var pillRect = DrawPill(drawingContext, entry.Pill!, accentBrush, new Point(x, axisTop + 18 - verticalOffset));
            bounds = bounds.HasValue ? Rect.Union(bounds.Value, pillRect) : pillRect;
        }

        drawingContext.Pop();

        var hitRect = bounds ?? new Rect(new Point(x - 12, axisTop - 60 - verticalOffset), new Size(24, 72));
        _hitTest.Add(new TimelineHitTestInfo(hitRect, entry));
    }

    private FormattedText CreateText(string text, double size, FontWeight weight, Brush brush)
    {
        return new FormattedText(
            text,
            CultureInfo.CurrentUICulture,
            FlowDirection.LeftToRight,
            new Typeface(new FontFamily("Segoe UI"), FontStyles.Normal, weight, FontStretches.Normal),
            size,
            brush,
            VisualTreeHelper.GetDpi(this).PixelsPerDip);
    }

    private Rect DrawPill(DrawingContext drawingContext, string text, Brush accent, Point origin)
    {
        var pillText = CreateText(text, 11, FontWeights.SemiBold, Brushes.White);
        var padding = new Size(12, 6);
        var rect = new Rect(
            origin.X - (pillText.Width / 2) - padding.Width,
            origin.Y,
            pillText.Width + (padding.Width * 2),
            pillText.Height + (padding.Height * 2));

        var baseBrush = PillBackground as SolidColorBrush ?? BrushUtilities.CreateFrozenBrush("#233447");
        var background = new SolidColorBrush(baseBrush.Color)
        {
            Opacity = 0.92
        };
        background.Freeze();

        drawingContext.DrawRoundedRectangle(background, null, rect, 12, 12);
        drawingContext.DrawRoundedRectangle(null, new Pen(accent, 1.2), rect, 12, 12);
        drawingContext.DrawText(pillText, new Point(rect.Left + padding.Width, rect.Top + padding.Height - 1));

        return rect;
    }

    private void StartEntranceAnimation()
    {
        BeginAnimation(AnimationProgressProperty, null);
        var animation = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(560))
        {
            EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut }
        };
        BeginAnimation(AnimationProgressProperty, animation);
    }

    private void OnMouseMove(object? sender, System.Windows.Input.MouseEventArgs e)
    {
        if (_hitTest.Count == 0)
        {
            HideTooltip();
            return;
        }

        var position = e.GetPosition(this);
        var hit = _hitTest.FirstOrDefault(info => info.Bounds.Contains(position));
        if (hit.Entry is null)
        {
            HideTooltip();
            return;
        }

        _tooltipText.Text = hit.Entry.HasDetail
            ? $"{hit.Entry.Label}\n{hit.Entry.Detail}"
            : hit.Entry.Label;

        if (hit.Entry.HasPill)
        {
            _tooltipText.Text += $"\n{hit.Entry.Pill}";
        }

        _tooltip.HorizontalOffset = position.X + 12;
        _tooltip.VerticalOffset = position.Y - 28;
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

    private static TextBlock CreateTooltipText()
    {
        return new TextBlock
        {
            FontFamily = new FontFamily("Segoe UI"),
            FontSize = 12,
            Foreground = Brushes.White,
            TextWrapping = TextWrapping.Wrap,
            Margin = new Thickness(12, 8, 12, 8)
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

    private readonly struct TimelineHitTestInfo
    {
        public TimelineHitTestInfo(Rect bounds, TimelineEntryViewModel entry)
        {
            Bounds = bounds;
            Entry = entry;
        }

        public Rect Bounds { get; }

        public TimelineEntryViewModel Entry { get; }
    }
}
