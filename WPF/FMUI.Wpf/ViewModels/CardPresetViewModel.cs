using System;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class CardPresetViewModel
{
    private readonly CardPresetDefinition _definition;

    public CardPresetViewModel(CardPresetDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
    }

    public string Id => _definition.Id;

    public string DisplayName => _definition.DisplayName;

    public string? Description => _definition.Description;

    public CardKind Kind => _definition.Template.Kind;

    public CardDefinition CreateDefinition()
    {
        var template = _definition.Template;
        return template with
        {
            Id = $"{template.Id}-{Guid.NewGuid():N}"
        };
    }
}
