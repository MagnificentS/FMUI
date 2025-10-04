using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Input;
using System.Windows.Media;

namespace FMUI.Wpf.Infrastructure.Behaviors;

public static class ListBoxDragReorderBehavior
{
    private const string DragDataFormat = "FMUI.Wpf.ListBoxDragReorderBehavior.Item";

    public static readonly DependencyProperty EnableReorderProperty = DependencyProperty.RegisterAttached(
        "EnableReorder",
        typeof(bool),
        typeof(ListBoxDragReorderBehavior),
        new PropertyMetadata(false, OnEnableReorderChanged));

    private static readonly Dictionary<ListBox, Point> DragStartPoints = new();

    public static bool GetEnableReorder(DependencyObject obj) => (bool)obj.GetValue(EnableReorderProperty);

    public static void SetEnableReorder(DependencyObject obj, bool value) => obj.SetValue(EnableReorderProperty, value);

    private static void OnEnableReorderChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
    {
        if (d is not ListBox listBox)
        {
            return;
        }

        var enable = (bool)e.NewValue;
        if (enable)
        {
            listBox.AllowDrop = true;
            listBox.PreviewMouseLeftButtonDown += OnPreviewMouseLeftButtonDown;
            listBox.PreviewMouseMove += OnPreviewMouseMove;
            listBox.Drop += OnDrop;
            listBox.DragOver += OnDragOver;
        }
        else
        {
            listBox.AllowDrop = false;
            listBox.PreviewMouseLeftButtonDown -= OnPreviewMouseLeftButtonDown;
            listBox.PreviewMouseMove -= OnPreviewMouseMove;
            listBox.Drop -= OnDrop;
            listBox.DragOver -= OnDragOver;
            DragStartPoints.Remove(listBox);
        }
    }

    private static void OnPreviewMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (sender is not ListBox listBox)
        {
            return;
        }

        var item = GetItemContainer(listBox, e.OriginalSource as DependencyObject);
        if (item is null || IsTextBoxDescendant(e.OriginalSource as DependencyObject))
        {
            return;
        }

        DragStartPoints[listBox] = e.GetPosition(listBox);
    }

    private static void OnPreviewMouseMove(object sender, MouseEventArgs e)
    {
        if (sender is not ListBox listBox)
        {
            return;
        }

        if (e.LeftButton != MouseButtonState.Pressed)
        {
            DragStartPoints.Remove(listBox);
            return;
        }

        if (!DragStartPoints.TryGetValue(listBox, out var startPoint))
        {
            return;
        }

        var currentPoint = e.GetPosition(listBox);
        if (Math.Abs(currentPoint.X - startPoint.X) < SystemParameters.MinimumHorizontalDragDistance &&
            Math.Abs(currentPoint.Y - startPoint.Y) < SystemParameters.MinimumVerticalDragDistance)
        {
            return;
        }

        var item = GetItemContainer(listBox, e.OriginalSource as DependencyObject);
        if (item is null)
        {
            return;
        }

        var data = listBox.ItemContainerGenerator.ItemFromContainer(item);
        if (data is null)
        {
            return;
        }

        listBox.SelectedItem = data;
        DragStartPoints.Remove(listBox);
        var dragData = new DataObject(DragDataFormat, data);
        DragDrop.DoDragDrop(listBox, dragData, DragDropEffects.Move);
    }

    private static void OnDragOver(object sender, DragEventArgs e)
    {
        if (sender is not ListBox listBox)
        {
            return;
        }

        if (!e.Data.GetDataPresent(DragDataFormat) || listBox.ItemsSource is not IList)
        {
            e.Effects = DragDropEffects.None;
            e.Handled = true;
            return;
        }

        e.Effects = DragDropEffects.Move;
        e.Handled = true;
    }

    private static void OnDrop(object sender, DragEventArgs e)
    {
        if (sender is not ListBox listBox || listBox.ItemsSource is not IList items)
        {
            return;
        }

        if (!e.Data.GetDataPresent(DragDataFormat))
        {
            e.Handled = true;
            return;
        }

        var data = e.Data.GetData(DragDataFormat);
        if (data is null)
        {
            e.Handled = true;
            return;
        }

        var oldIndex = items.IndexOf(data);
        if (oldIndex < 0)
        {
            e.Handled = true;
            return;
        }

        var targetContainer = GetItemContainer(listBox, e.OriginalSource as DependencyObject);
        var newIndex = items.Count;
        if (targetContainer is not null)
        {
            newIndex = listBox.ItemContainerGenerator.IndexFromContainer(targetContainer);
            if (newIndex < 0)
            {
                newIndex = items.Count;
            }
            else
            {
                var position = e.GetPosition(targetContainer);
                if (position.Y > targetContainer.ActualHeight / 2)
                {
                    newIndex++;
                }
            }
        }

        if (newIndex == oldIndex)
        {
            e.Handled = true;
            return;
        }

        Move(items, oldIndex, newIndex);
        listBox.SelectedItem = data;
        e.Handled = true;
    }

    private static void Move(IList items, int oldIndex, int newIndex)
    {
        if (newIndex >= items.Count)
        {
            newIndex = items.Count - 1;
        }

        if (newIndex < 0)
        {
            newIndex = 0;
        }

        if (oldIndex == newIndex)
        {
            return;
        }

        // Try to use ObservableCollection<T>.Move via reflection when available.
        var moveMethod = items.GetType().GetMethod(
            "Move",
            BindingFlags.Public | BindingFlags.Instance,
            null,
            new[] { typeof(int), typeof(int) },
            null);
        if (moveMethod is not null)
        {
            moveMethod.Invoke(items, new object[] { oldIndex, newIndex });
            return;
        }

        var item = items[oldIndex];
        items.RemoveAt(oldIndex);
        if (oldIndex < newIndex)
        {
            newIndex--;
        }

        if (newIndex > items.Count)
        {
            newIndex = items.Count;
        }

        items.Insert(newIndex, item);
    }

    private static ListBoxItem? GetItemContainer(ItemsControl listBox, DependencyObject? originalSource)
    {
        return originalSource is null ? null : FindVisualParent<ListBoxItem>(originalSource);
    }

    private static bool IsTextBoxDescendant(DependencyObject? source)
    {
        return source is not null && FindVisualParent<TextBoxBase>(source) is not null;
    }

    private static T? FindVisualParent<T>(DependencyObject? child) where T : DependencyObject
    {
        while (child is not null)
        {
            if (child is T typed)
            {
                return typed;
            }

            child = VisualTreeHelper.GetParent(child);
        }

        return null;
    }
}
