using System.Windows;
using System.Windows.Controls;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class CardSurfaceView : UserControl
{
    public CardSurfaceView()
    {
        InitializeComponent();
        Loaded += OnLoaded;
        DataContextChanged += OnDataContextChanged;
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        Focus();
        UpdateViewport();
    }

    private void OnDataContextChanged(object sender, DependencyPropertyChangedEventArgs e)
    {
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
}
