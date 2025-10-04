using System.Windows;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class MainWindow : Window
{
    private readonly MainViewModel _viewModel;

    public MainWindow(MainViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        DataContext = viewModel;

        Loaded += OnLoaded;
        SizeChanged += OnSizeChanged;
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        _viewModel.UpdateViewport(ActualWidth);
    }

    private void OnSizeChanged(object sender, SizeChangedEventArgs e)
    {
        _viewModel.UpdateViewport(e.NewSize.Width);
    }
}
