using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public sealed class AccentToBrushConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string accent && !string.IsNullOrWhiteSpace(accent))
        {
            return BrushUtilities.CreateFrozenBrush(accent, Brushes.DeepSkyBlue);
        }

        return Brushes.Transparent;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotSupportedException("AccentToBrushConverter does not support ConvertBack.");
    }
}
