using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace FMUI.Wpf.Views;

public sealed class NullToVisibilityConverter : IValueConverter
{
    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (targetType != typeof(Visibility) && targetType != typeof(object))
        {
            throw new NotSupportedException("NullToVisibilityConverter can only target Visibility properties.");
        }

        return value switch
        {
            null => Visibility.Collapsed,
            string s when string.IsNullOrWhiteSpace(s) => Visibility.Collapsed,
            _ => Visibility.Visible
        };
    }

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture) => throw new NotSupportedException();
}
