using System;
using System.Globalization;
using System.Windows.Data;

namespace FMUI.Wpf.Views;

public sealed class RelativePositionConverter : IMultiValueConverter
{
    public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
    {
        if (values.Length < 2)
        {
            return 0d;
        }

        if (values[0] is double normalized && values[1] is double size)
        {
            var tokenSize = 0d;

            switch (parameter)
            {
                case double numeric:
                    tokenSize = numeric;
                    break;
                case string text when double.TryParse(text, NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed):
                    tokenSize = parsed;
                    break;
            }

            var clampedNormalized = Math.Clamp(normalized, 0d, 1d);
            var available = Math.Max(size, 0d);
            var offset = tokenSize / 2d;
            return (clampedNormalized * available) - offset;
        }

        return 0d;
    }

    public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
        => throw new NotSupportedException();
}
