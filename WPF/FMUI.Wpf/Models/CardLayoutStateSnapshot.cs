using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FMUI.Wpf.Models;

public sealed class CardLayoutStateSnapshot
{
    public CardLayoutStateSnapshot()
        : this(new Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>>())
    {
    }

    [JsonConstructor]
    public CardLayoutStateSnapshot(Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>> layouts)
    {
        Layouts = layouts ?? new Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>>();
    }

    public Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>> Layouts { get; }

    public static CardLayoutStateSnapshot Empty { get; } = new();
}
