using System.Windows;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = new MainViewModel();
    }
}
