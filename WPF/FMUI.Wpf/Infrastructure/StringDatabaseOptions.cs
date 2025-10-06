using System;

namespace FMUI.Wpf.Infrastructure;

/// <summary>
/// Describes the binary assets required to hydrate the localized string database.
/// </summary>
public sealed class StringDatabaseOptions
{
    public StringDatabaseOptions(string firstNamesPath, string lastNamesPath, string missingValue)
    {
        FirstNamesPath = firstNamesPath ?? throw new ArgumentNullException(nameof(firstNamesPath));
        LastNamesPath = lastNamesPath ?? throw new ArgumentNullException(nameof(lastNamesPath));
        MissingValue = string.IsNullOrEmpty(missingValue) ? "Unknown" : missingValue;
    }

    public StringDatabaseOptions(string firstNamesPath, string lastNamesPath)
        : this(firstNamesPath, lastNamesPath, "Unknown")
    {
    }

    public string FirstNamesPath { get; }

    public string LastNamesPath { get; }

    public string MissingValue { get; }
}
