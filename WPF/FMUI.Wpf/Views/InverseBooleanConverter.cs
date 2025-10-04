using System;
using System.Globalization;
using System.Windows.Data;

namespace FMUI.Wpf.Views;

public sealed class InverseBooleanConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is bool flag)
        {
            return !flag;
        }

        return true;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotSupportedException("InverseBooleanConverter does not support ConvertBack.");
    }
}
