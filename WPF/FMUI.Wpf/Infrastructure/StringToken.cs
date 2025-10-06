using System;

namespace FMUI.Wpf.Infrastructure;

public readonly struct StringToken : IEquatable<StringToken>
{
    public StringToken(string id, string? fallback = null)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new ArgumentException("Token identifier cannot be null or whitespace.", nameof(id));
        }

        Id = id;
        Fallback = fallback;
    }

    public string Id { get; }

    public string? Fallback { get; }

    public bool Equals(StringToken other) => string.Equals(Id, other.Id, StringComparison.Ordinal);

    public override bool Equals(object? obj) => obj is StringToken token && Equals(token);

    public override int GetHashCode() => StringComparer.Ordinal.GetHashCode(Id);

    public override string ToString() => Id;

    public static StringToken Create(string id, string fallback) => new(id, fallback);
}
