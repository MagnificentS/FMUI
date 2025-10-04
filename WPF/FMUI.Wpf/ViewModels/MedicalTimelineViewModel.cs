using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Media;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class MedicalTimelineViewModel
{
    private readonly ReadOnlyCollection<MedicalTimelineEntryViewModel> _entries;

    public MedicalTimelineViewModel(MedicalTimelineDefinition definition)
    {
        _entries = new ReadOnlyCollection<MedicalTimelineEntryViewModel>(CreateEntries(definition.Entries));
        Summary = _entries.Count == 0
            ? "No active injuries"
            : $"{_entries.Count} active cases";
    }

    public IReadOnlyList<MedicalTimelineEntryViewModel> Entries => _entries;

    public string Summary { get; }

    public bool HasEntries => _entries.Count > 0;

    private static List<MedicalTimelineEntryViewModel> CreateEntries(IReadOnlyList<MedicalTimelineEntryDefinition> definitions)
    {
        if (definitions is null || definitions.Count == 0)
        {
            return new List<MedicalTimelineEntryViewModel>();
        }

        var list = new List<MedicalTimelineEntryViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            list.Add(new MedicalTimelineEntryViewModel(definition));
        }

        return list;
    }
}

public sealed class MedicalTimelineEntryViewModel
{
    private readonly MedicalTimelineEntryDefinition _definition;
    private readonly ReadOnlyCollection<TimelineEntryViewModel> _phases;

    public MedicalTimelineEntryViewModel(MedicalTimelineEntryDefinition definition)
    {
        _definition = definition;
        _phases = new ReadOnlyCollection<TimelineEntryViewModel>(CreatePhases(definition.Phases));
        AccentBrush = string.IsNullOrWhiteSpace(definition.Accent)
            ? BrushUtilities.CreateFrozenBrush("#FF2EC4B6", Brushes.SlateBlue)
            : BrushUtilities.CreateFrozenBrush(definition.Accent!, Brushes.SlateBlue);
    }

    public string Player => _definition.Player;

    public string Diagnosis => _definition.Diagnosis;

    public string Status => _definition.Status;

    public string ExpectedReturn => _definition.ExpectedReturn;

    public string? Notes => _definition.Notes;

    public IReadOnlyList<TimelineEntryViewModel> Phases => _phases;

    public bool HasNotes => !string.IsNullOrWhiteSpace(Notes);

    public Brush AccentBrush { get; }

    private static List<TimelineEntryViewModel> CreatePhases(IReadOnlyList<TimelineEntryDefinition> definitions)
    {
        if (definitions is null || definitions.Count == 0)
        {
            return new List<TimelineEntryViewModel>();
        }

        var list = new List<TimelineEntryViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            list.Add(new TimelineEntryViewModel(definition));
        }

        return list;
    }
}
