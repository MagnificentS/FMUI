using System;
using System.Collections.Generic;

namespace FMUI.Wpf.Infrastructure;

public interface IStringDatabase
{
    string Resolve(StringToken token);
}

public sealed class StringDatabase : IStringDatabase
{
    private readonly Dictionary<string, string> _resources;

    public StringDatabase(IEnumerable<KeyValuePair<string, string>> resources)
    {
        if (resources is null)
        {
            throw new ArgumentNullException(nameof(resources));
        }

        _resources = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var pair in resources)
        {
            if (string.IsNullOrWhiteSpace(pair.Key))
            {
                continue;
            }

            _resources[pair.Key] = pair.Value ?? string.Empty;
        }
    }

    public string Resolve(StringToken token)
    {
        if (_resources.TryGetValue(token.Id, out var value))
        {
            return value;
        }

        return token.Fallback ?? token.Id;
    }
}
