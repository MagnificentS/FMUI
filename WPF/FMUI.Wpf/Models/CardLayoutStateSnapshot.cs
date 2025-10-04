using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FMUI.Wpf.Models;

public sealed class CardLayoutStateSnapshot
{
    public CardLayoutStateSnapshot()
        : this(
            new Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>>(),
            new Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, FormationPlayerState>>>>>())
    {
    }

    [JsonConstructor]
    public CardLayoutStateSnapshot(
        Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>> layouts,
        Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, FormationPlayerState>>>>> formations)
    {
        Layouts = layouts ?? new Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>>();
        Formations = formations ?? new Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, FormationPlayerState>>>>>();
    }

    public Dictionary<string, Dictionary<string, Dictionary<string, CardGeometry>>> Layouts { get; }

    public Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, FormationPlayerState>>>>> Formations { get; }

    public static CardLayoutStateSnapshot Empty { get; } = new();
}

public sealed record FormationPlayerState(string PlayerId, double X, double Y);
