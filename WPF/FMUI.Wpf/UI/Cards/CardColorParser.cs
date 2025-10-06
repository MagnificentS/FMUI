using System;
using System.Windows.Media;

namespace FMUI.Wpf.UI.Cards;

internal static class CardColorParser
{
    public static bool TryParse(string? value, out Color color)
    {
        color = default;
        if (string.IsNullOrEmpty(value))
        {
            return false;
        }

        var span = value.AsSpan();
        if (span.Length == 7 && span[0] == '#')
        {
            if (TryParseHex(span.Slice(1, 2), out var r) &&
                TryParseHex(span.Slice(3, 2), out var g) &&
                TryParseHex(span.Slice(5, 2), out var b))
            {
                color = Color.FromRgb(r, g, b);
                return true;
            }
        }
        else if (span.Length == 9 && span[0] == '#')
        {
            if (TryParseHex(span.Slice(1, 2), out var a) &&
                TryParseHex(span.Slice(3, 2), out var r) &&
                TryParseHex(span.Slice(5, 2), out var g) &&
                TryParseHex(span.Slice(7, 2), out var b))
            {
                color = Color.FromArgb(a, r, g, b);
                return true;
            }
        }

        return false;
    }

    private static bool TryParseHex(ReadOnlySpan<char> span, out byte value)
    {
        value = 0;
        int high = ParseHexDigit(span[0]);
        int low = ParseHexDigit(span[1]);
        if (high < 0 || low < 0)
        {
            return false;
        }

        value = (byte)((high << 4) | low);
        return true;
    }

    private static int ParseHexDigit(char c)
    {
        if (c >= '0' && c <= '9')
        {
            return c - '0';
        }

        if (c >= 'a' && c <= 'f')
        {
            return 10 + (c - 'a');
        }

        if (c >= 'A' && c <= 'F')
        {
            return 10 + (c - 'A');
        }

        return -1;
    }
}
