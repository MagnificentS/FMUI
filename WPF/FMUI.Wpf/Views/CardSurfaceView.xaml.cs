using System;
using System.ComponentModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Threading;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class CardSurfaceView : UserControl
{
    private CardSurfaceViewModel? _viewModel;

    public CardSurfaceView()
    {
        InitializeComponent();
        Loaded += OnLoaded;
        Unloaded += OnUnloaded;
        DataContextChanged += OnDataContextChanged;
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        Focus();
        UpdateViewport();
    }

    private void OnUnloaded(object sender, RoutedEventArgs e)
    {
        if (_viewModel is not null)
        {
            _viewModel.PropertyChanged -= OnViewModelPropertyChanged;
            _viewModel = null;
        }
    }

    private void OnDataContextChanged(object sender, DependencyPropertyChangedEventArgs e)
    {
        if (_viewModel is not null)
        {
            _viewModel.PropertyChanged -= OnViewModelPropertyChanged;
        }

        _viewModel = e.NewValue as CardSurfaceViewModel;
        if (_viewModel is not null)
        {
            _viewModel.PropertyChanged += OnViewModelPropertyChanged;
        }

        UpdateViewport();
    }

    private void OnSurfaceLoaded(object sender, RoutedEventArgs e)
    {
        UpdateViewport();
    }

    private void OnSurfaceScrollChanged(object sender, ScrollChangedEventArgs e)
    {
        UpdateViewport();
    }

    private void OnSurfaceSizeChanged(object sender, SizeChangedEventArgs e)
    {
        UpdateViewport();
    }

    private void UpdateViewport()
    {
        if (DataContext is not CardSurfaceViewModel viewModel)
        {
            return;
        }

        if (SurfaceScrollViewer is null)
        {
            return;
        }

        var viewport = new Rect(
            SurfaceScrollViewer.HorizontalOffset,
            SurfaceScrollViewer.VerticalOffset,
            SurfaceScrollViewer.ViewportWidth,
            SurfaceScrollViewer.ViewportHeight);

        viewModel.UpdateViewport(viewport);
    }

    private void OnViewModelPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (string.Equals(e.PropertyName, nameof(CardSurfaceViewModel.IsPaletteOpen), StringComparison.Ordinal))
        {
            if (_viewModel?.IsPaletteOpen == true)
            {
                Dispatcher.BeginInvoke(DispatcherPriority.Input, new Action(() =>
                {
                    if (PaletteListBox is null)
                    {
                        return;
                    }

                    if (PaletteListBox.SelectedIndex < 0 && PaletteListBox.Items.Count > 0)
                    {
                        PaletteListBox.SelectedIndex = 0;
                    }

                    PaletteListBox.Focus();
                    if (PaletteListBox.SelectedItem is not null)
                    {
                        PaletteListBox.ScrollIntoView(PaletteListBox.SelectedItem);
                    }
                }));
            }
            else
            {
                Dispatcher.BeginInvoke(DispatcherPriority.Input, new Action(() =>
                {
                    SurfaceScrollViewer?.Focus();
                }));
            }

            return;
        }

        if (string.Equals(e.PropertyName, nameof(CardSurfaceViewModel.IsEditorOpen), StringComparison.Ordinal))
        {
            if (_viewModel?.IsEditorOpen == true)
            {
                Dispatcher.BeginInvoke(DispatcherPriority.Input, new Action(() =>
                {
                    if (EditorOverlayRoot is not null)
                    {
                        EditorOverlayRoot.Focus();
                        EditorOverlayRoot.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
                    }
                }));
            }
            else
            {
                Dispatcher.BeginInvoke(DispatcherPriority.Input, new Action(() =>
                {
                    SurfaceScrollViewer?.Focus();
                }));
            }
        }
    }

    private void OnPaletteBackdropClicked(object sender, MouseButtonEventArgs e)
    {
        if (_viewModel?.ClosePaletteCommand is ICommand command && command.CanExecute(null))
        {
            command.Execute(null);
            e.Handled = true;
        }
    }

    private void OnEditorBackdropClicked(object sender, MouseButtonEventArgs e)
    {
        if (_viewModel?.CloseEditorCommand is ICommand command && command.CanExecute(null))
        {
            command.Execute(null);
            e.Handled = true;
        }
    }
}
