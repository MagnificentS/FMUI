using System.Windows;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class MainWindow : Window
{
    public MainWindow(MainViewModel viewModel)
    {
        InitializeComponent();
        DataContext = viewModel;
    }
}
