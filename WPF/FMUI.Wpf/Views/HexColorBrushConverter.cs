using System;
using System.Collections.Concurrent;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace FMUI.Wpf.Views;

public sealed class HexColorBrushConverter : IValueConverter
{
    private static readonly ConcurrentDictionary<string, SolidColorBrush> Cache = new(StringComparer.OrdinalIgnoreCase);
    private static readonly SolidColorBrush TransparentBrush;

    static HexColorBrushConverter()
    {
        TransparentBrush = new SolidColorBrush(Colors.Transparent);
        TransparentBrush.Freeze();
    }

    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string text && TryCreateBrush(text, out var brush))
        {
            return brush;
        }

        return TransparentBrush;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        return Binding.DoNothing;
    }

    private static bool TryCreateBrush(string value, out SolidColorBrush brush)
    {
        var key = value?.Trim();
        if (string.IsNullOrWhiteSpace(key))
        {
            brush = TransparentBrush;
            return false;
        }

        brush = Cache.GetOrAdd(key, static colour =>
        {
            try
            {
                var color = (Color)ColorConverter.ConvertFromString(colour)!;
                var solidColorBrush = new SolidColorBrush(color);
                solidColorBrush.Freeze();
                return solidColorBrush;
            }
            catch
            {
                return TransparentBrush;
            }
        });

        return !ReferenceEquals(brush, TransparentBrush);
    }
}
