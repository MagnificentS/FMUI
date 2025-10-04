using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public partial class FixtureCalendarView : UserControl
{
    public FixtureCalendarView()
    {
        InitializeComponent();
    }

    private void OnOverlayBackgroundMouseDown(object sender, MouseButtonEventArgs e)
    {
        if (DataContext is not FixtureCalendarViewModel viewModel)
        {
            return;
        }

        if (FindAncestor<Border>(e.OriginalSource as DependencyObject) is { DataContext: FixtureMatchDetailViewModel })
        {
            return;
        }

        viewModel.CloseDetail();
    }

    private static T? FindAncestor<T>(DependencyObject? source) where T : DependencyObject
    {
        while (source is not null)
        {
            if (source is T typed)
            {
                return typed;
            }

            source = VisualTreeHelper.GetParent(source);
        }

        return null;
    }
}
