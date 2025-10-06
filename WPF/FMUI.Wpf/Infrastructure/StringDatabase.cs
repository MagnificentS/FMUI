using System;
using System.IO;

namespace FMUI.Wpf.Infrastructure;

/// <summary>
/// Provides localized string lookup backed by pooled string tables with graceful fallbacks.
/// </summary>
public sealed class StringDatabase : IDisposable
{
    private readonly StringTable?[] _tables;
    private readonly string _missingValue;
    private bool _disposed;

    public StringDatabase(StringDatabaseOptions options)
    {
        if (options is null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        _tables = new StringTable?[EnumCount];
        _tables[(int)StringTableKind.FirstNames] = TryLoad(options.FirstNamesPath);
        _tables[(int)StringTableKind.LastNames] = TryLoad(options.LastNamesPath);
        _missingValue = options.MissingValue;
    }

    public string GetString(StringTableKind kind, ushort id)
    {
        var table = _tables[(int)kind];
        if (table is null)
        {
            return _missingValue;
        }

        if (id >= table.Count)
        {
            return _missingValue;
        }

        return table.GetString(id);
    }

    public string GetFullName(ushort firstNameId, ushort lastNameId)
    {
        var first = GetString(StringTableKind.FirstNames, firstNameId);
        var last = GetString(StringTableKind.LastNames, lastNameId);

        bool firstMissing = string.IsNullOrEmpty(first) || ReferenceEquals(first, _missingValue);
        bool lastMissing = string.IsNullOrEmpty(last) || ReferenceEquals(last, _missingValue);

        if (firstMissing && lastMissing)
        {
            return _missingValue;
        }

        if (firstMissing)
        {
            return last;
        }

        if (lastMissing)
        {
            return first;
        }

        return string.Concat(first, " ", last);
    }

    public string GetCompactName(ushort firstNameId, ushort lastNameId)
    {
        var last = GetString(StringTableKind.LastNames, lastNameId);
        var first = GetString(StringTableKind.FirstNames, firstNameId);

        bool lastMissing = string.IsNullOrEmpty(last) || ReferenceEquals(last, _missingValue);
        bool firstMissing = string.IsNullOrEmpty(first) || ReferenceEquals(first, _missingValue);

        if (lastMissing && firstMissing)
        {
            return _missingValue;
        }

        if (lastMissing)
        {
            return firstMissing ? _missingValue : first;
        }

        if (firstMissing)
        {
            return last;
        }

        int targetLength = last.Length + 3;
        Span<char> buffer = targetLength <= 256
            ? stackalloc char[targetLength]
            : new char[targetLength];

        buffer[0] = first[0];
        buffer[1] = '.';
        buffer[2] = ' ';
        last.AsSpan().CopyTo(buffer.Slice(3));
        return new string(buffer);
    }

    public string MissingValue => _missingValue;

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        for (int i = 0; i < _tables.Length; i++)
        {
            _tables[i]?.Dispose();
            _tables[i] = null;
        }
    }

    private static StringTable? TryLoad(string path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return null;
        }

        if (!File.Exists(path))
        {
            return null;
        }

        try
        {
            return new StringTable(path);
        }
        catch (IOException)
        {
            return null;
        }
        catch (UnauthorizedAccessException)
        {
            return null;
        }
    }

    private const int EnumCount = ((int)StringTableKind.LastNames) + 1;
}

public enum StringTableKind : byte
{
    FirstNames = 0,
    LastNames = 1
}
