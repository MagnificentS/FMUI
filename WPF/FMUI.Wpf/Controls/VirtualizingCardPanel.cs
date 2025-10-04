using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Media;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Controls;

public sealed class VirtualizingCardPanel : VirtualizingPanel, IScrollInfo
{
    private const double ScrollLineDelta = 38d;
    private const double VisibilityPadding = 160d;

    public static readonly DependencyProperty SurfaceWidthProperty =
        DependencyProperty.Register(
            nameof(SurfaceWidth),
            typeof(double),
            typeof(VirtualizingCardPanel),
            new FrameworkPropertyMetadata(0d, FrameworkPropertyMetadataOptions.AffectsMeasure, OnSurfaceSizeChanged));

    public static readonly DependencyProperty SurfaceHeightProperty =
        DependencyProperty.Register(
            nameof(SurfaceHeight),
            typeof(double),
            typeof(VirtualizingCardPanel),
            new FrameworkPropertyMetadata(0d, FrameworkPropertyMetadataOptions.AffectsMeasure, OnSurfaceSizeChanged));

    private readonly Dictionary<int, UIElement> _realized = new();
    private Size _extent;
    private Size _viewport;
    private Point _offset;

    public VirtualizingCardPanel()
    {
        ClipToBounds = true;
    }

    public double SurfaceWidth
    {
        get => (double)GetValue(SurfaceWidthProperty);
        set => SetValue(SurfaceWidthProperty, value);
    }

    public double SurfaceHeight
    {
        get => (double)GetValue(SurfaceHeightProperty);
        set => SetValue(SurfaceHeightProperty, value);
    }

    public bool CanHorizontallyScroll { get; set; } = true;

    public bool CanVerticallyScroll { get; set; } = true;

    public double ExtentWidth => _extent.Width;

    public double ExtentHeight => _extent.Height;

    public double ViewportWidth => _viewport.Width;

    public double ViewportHeight => _viewport.Height;

    public double HorizontalOffset => _offset.X;

    public double VerticalOffset => _offset.Y;

    public ScrollViewer? ScrollOwner { get; set; }

    public void LineDown() => SetVerticalOffset(VerticalOffset + ScrollLineDelta);

    public void LineLeft() => SetHorizontalOffset(HorizontalOffset - ScrollLineDelta);

    public void LineRight() => SetHorizontalOffset(HorizontalOffset + ScrollLineDelta);

    public void LineUp() => SetVerticalOffset(VerticalOffset - ScrollLineDelta);

    public Rect MakeVisible(Visual visual, Rect rectangle)
    {
        if (visual is UIElement element && InternalChildren.Contains(element))
        {
            if (ItemContainerGenerator.ItemFromContainer(element) is CardViewModel card)
            {
                var bounds = new Rect(new Point(card.Left, card.Top), new Size(card.Width, card.Height));
                EnsureVisible(bounds);
                return bounds;
            }
        }

        return rectangle;
    }

    public void MouseWheelDown() => SetVerticalOffset(VerticalOffset + ScrollLineDelta * 3);

    public void MouseWheelLeft() => SetHorizontalOffset(HorizontalOffset - ScrollLineDelta * 3);

    public void MouseWheelRight() => SetHorizontalOffset(HorizontalOffset + ScrollLineDelta * 3);

    public void MouseWheelUp() => SetVerticalOffset(VerticalOffset - ScrollLineDelta * 3);

    public void PageDown() => SetVerticalOffset(VerticalOffset + ViewportHeight);

    public void PageLeft() => SetHorizontalOffset(HorizontalOffset - ViewportWidth);

    public void PageRight() => SetHorizontalOffset(HorizontalOffset + ViewportWidth);

    public void PageUp() => SetVerticalOffset(VerticalOffset - ViewportHeight);

    public void SetHorizontalOffset(double offset)
    {
        var newOffset = Clamp(offset, 0, Math.Max(0, ExtentWidth - ViewportWidth));
        if (!DoubleUtil.AreClose(newOffset, _offset.X))
        {
            _offset.X = newOffset;
            InvalidateMeasure();
            ScrollOwner?.InvalidateScrollInfo();
        }
    }

    public void SetVerticalOffset(double offset)
    {
        var newOffset = Clamp(offset, 0, Math.Max(0, ExtentHeight - ViewportHeight));
        if (!DoubleUtil.AreClose(newOffset, _offset.Y))
        {
            _offset.Y = newOffset;
            InvalidateMeasure();
            ScrollOwner?.InvalidateScrollInfo();
        }
    }

    protected override void OnItemsChanged(object sender, ItemsChangedEventArgs args)
    {
        base.OnItemsChanged(sender, args);

        switch (args.Action)
        {
            case NotifyCollectionChangedAction.Reset:
                ClearRealized();
                break;
            case NotifyCollectionChangedAction.Remove:
            case NotifyCollectionChangedAction.Replace:
            case NotifyCollectionChangedAction.Move:
                ClearRealized();
                break;
        }
    }

    protected override Size MeasureOverride(Size availableSize)
    {
        UpdateScrollData(availableSize);

        if (ItemsControl.GetItemsOwner(this) is not ItemsControl owner)
        {
            return availableSize;
        }

        var viewportRect = new Rect(_offset, _viewport);
        viewportRect.Inflate(VisibilityPadding, VisibilityPadding);

        var generator = ItemContainerGenerator;
        var required = new HashSet<int>();

        for (var index = 0; index < owner.Items.Count; index++)
        {
            if (owner.Items[index] is not CardViewModel card)
            {
                continue;
            }

            if (!viewportRect.IntersectsWith(card.GetBounds()))
            {
                continue;
            }

            required.Add(index);
            EnsureChild(generator, index);
        }

        CleanupChildren(generator, required);

        foreach (var index in required)
        {
            if (_realized.TryGetValue(index, out var child) && owner.Items[index] is CardViewModel card)
            {
                child.Measure(new Size(card.Width, card.Height));
            }
        }

        return availableSize;
    }

    protected override Size ArrangeOverride(Size finalSize)
    {
        foreach (var (index, child) in _realized.ToList())
        {
            if (ItemContainerGenerator.ItemFromContainer(child) is not CardViewModel card)
            {
                continue;
            }

            var rect = new Rect(card.Left, card.Top, card.Width, card.Height);
            child.Arrange(rect);
        }

        return finalSize;
    }

    private void EnsureChild(IItemContainerGenerator generator, int itemIndex)
    {
        if (_realized.ContainsKey(itemIndex))
        {
            return;
        }

        var position = generator.GeneratorPositionFromIndex(itemIndex);
        var direction = GeneratorDirection.Forward;

        using (generator.StartAt(position, direction, true))
        {
            var child = (UIElement)generator.GenerateNext(out var newlyRealized);
            if (newlyRealized)
            {
                var insertIndex = position.Index;
                if (insertIndex < 0 || insertIndex > InternalChildren.Count)
                {
                    insertIndex = InternalChildren.Count;
                }

                InsertInternalChild(insertIndex, child);
            }
            else if (!InternalChildren.Contains(child))
            {
                InsertInternalChild(InternalChildren.Count, child);
            }

            generator.PrepareItemContainer(child);
            _realized[itemIndex] = child;
        }
    }

    private void CleanupChildren(IItemContainerGenerator generator, HashSet<int> keep)
    {
        foreach (var index in _realized.Keys.Except(keep).ToList())
        {
            var position = generator.GeneratorPositionFromIndex(index);
            if (position.Index >= 0)
            {
                generator.Remove(position, 1);
                RemoveInternalChildRange(position.Index, 1);
            }
            else if (_realized.TryGetValue(index, out var child))
            {
                var childIndex = InternalChildren.IndexOf(child);
                if (childIndex >= 0)
                {
                    RemoveInternalChildRange(childIndex, 1);
                }
            }

            _realized.Remove(index);
        }
    }

    private void ClearRealized()
    {
        if (InternalChildren.Count > 0)
        {
            RemoveInternalChildRange(0, InternalChildren.Count);
        }

        _realized.Clear();
        InvalidateMeasure();
    }

    private void UpdateScrollData(Size availableSize)
    {
        var viewportWidth = double.IsInfinity(availableSize.Width) || double.IsNaN(availableSize.Width)
            ? SurfaceWidth
            : availableSize.Width;
        var viewportHeight = double.IsInfinity(availableSize.Height) || double.IsNaN(availableSize.Height)
            ? SurfaceHeight
            : availableSize.Height;

        if (DoubleUtil.LessThanOrClose(viewportWidth, 0))
        {
            viewportWidth = SurfaceWidth;
        }

        if (DoubleUtil.LessThanOrClose(viewportHeight, 0))
        {
            viewportHeight = SurfaceHeight;
        }

        var extentWidth = Math.Max(SurfaceWidth, viewportWidth);
        var extentHeight = Math.Max(SurfaceHeight, viewportHeight);

        if (!DoubleUtil.AreClose(_viewport.Width, viewportWidth) || !DoubleUtil.AreClose(_viewport.Height, viewportHeight))
        {
            _viewport = new Size(viewportWidth, viewportHeight);
            ScrollOwner?.InvalidateScrollInfo();
        }

        if (!DoubleUtil.AreClose(_extent.Width, extentWidth) || !DoubleUtil.AreClose(_extent.Height, extentHeight))
        {
            _extent = new Size(extentWidth, extentHeight);
            ScrollOwner?.InvalidateScrollInfo();
        }

        CoerceOffsets();
    }

    private void EnsureVisible(Rect bounds)
    {
        var horizontal = HorizontalOffset;
        var vertical = VerticalOffset;

        if (bounds.Left < horizontal)
        {
            horizontal = bounds.Left;
        }
        else if (bounds.Right > horizontal + ViewportWidth)
        {
            horizontal = bounds.Right - ViewportWidth;
        }

        if (bounds.Top < vertical)
        {
            vertical = bounds.Top;
        }
        else if (bounds.Bottom > vertical + ViewportHeight)
        {
            vertical = bounds.Bottom - ViewportHeight;
        }

        SetHorizontalOffset(horizontal);
        SetVerticalOffset(vertical);
    }

    private void CoerceOffsets()
    {
        SetHorizontalOffset(HorizontalOffset);
        SetVerticalOffset(VerticalOffset);
    }

    private static void OnSurfaceSizeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is VirtualizingCardPanel panel)
        {
            panel.InvalidateMeasure();
        }
    }

    private static double Clamp(double value, double min, double max)
    {
        if (double.IsNaN(value))
        {
            return min;
        }

        if (value < min)
        {
            return min;
        }

        if (value > max)
        {
            return max;
        }

        return value;
    }

    private static class DoubleUtil
    {
        private const double Epsilon = 0.0001d;

        public static bool AreClose(double x, double y) => Math.Abs(x - y) < Epsilon;

        public static bool LessThanOrClose(double x, double y) => x < y || AreClose(x, y);
    }
}
