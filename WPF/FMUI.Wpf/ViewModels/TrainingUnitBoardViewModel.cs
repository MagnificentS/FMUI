using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class TrainingUnitBoardViewModel
{
    public TrainingUnitBoardViewModel(TrainingUnitBoardDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Units = new ReadOnlyCollection<TrainingUnitUnitViewModel>(
            definition.Units
                .Select(TrainingUnitUnitViewModel.FromDefinition)
                .ToList());

        AvailablePlayers = new ReadOnlyCollection<TrainingUnitMemberViewModel>(
            definition.AvailablePlayers
                .Select(TrainingUnitMemberViewModel.FromDefinition)
                .ToList());

        HasAvailablePlayers = AvailablePlayers.Count > 0;
    }

    public IReadOnlyList<TrainingUnitUnitViewModel> Units { get; }

    public IReadOnlyList<TrainingUnitMemberViewModel> AvailablePlayers { get; }

    public bool HasAvailablePlayers { get; }
}

public sealed class TrainingUnitUnitViewModel
{
    private TrainingUnitUnitViewModel(
        string id,
        string name,
        string? coachId,
        string? coachName,
        string? coachAccent,
        IReadOnlyList<TrainingUnitCoachOptionDefinition> coachOptions,
        IReadOnlyList<TrainingUnitMemberViewModel> members)
    {
        Id = id;
        Name = name;
        CoachId = coachId;
        CoachName = string.IsNullOrWhiteSpace(coachName) ? "Unassigned" : coachName;
        CoachAccent = coachAccent;
        CoachOptions = new ReadOnlyCollection<TrainingUnitCoachOptionDefinition>(coachOptions);
        Members = new ReadOnlyCollection<TrainingUnitMemberViewModel>(members);
        HasMembers = Members.Count > 0;
    }

    public string Id { get; }

    public string Name { get; }

    public string? CoachId { get; }

    public string CoachName { get; }

    public string? CoachAccent { get; }

    public IReadOnlyList<TrainingUnitCoachOptionDefinition> CoachOptions { get; }

    public IReadOnlyList<TrainingUnitMemberViewModel> Members { get; }

    public bool HasMembers { get; }

    public static TrainingUnitUnitViewModel FromDefinition(TrainingUnitGroupDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        var members = definition.Members
            .Select(TrainingUnitMemberViewModel.FromDefinition)
            .ToList();

        return new TrainingUnitUnitViewModel(
            definition.Id,
            definition.Name,
            definition.CoachId,
            definition.CoachName,
            definition.CoachAccent,
            definition.CoachOptions,
            members);
    }
}

public sealed class TrainingUnitMemberViewModel
{
    private TrainingUnitMemberViewModel(
        string id,
        string name,
        string position,
        string role,
        string status,
        string? accent,
        string? detail)
    {
        Id = id;
        Name = name;
        Position = position;
        Role = role;
        Status = status;
        Accent = accent;
        Detail = detail;
        HasDetail = !string.IsNullOrWhiteSpace(detail);
    }

    public string Id { get; }

    public string Name { get; }

    public string Position { get; }

    public string Role { get; }

    public string Status { get; }

    public string? Accent { get; }

    public string? Detail { get; }

    public bool HasDetail { get; }

    public static TrainingUnitMemberViewModel FromDefinition(TrainingUnitMemberDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        return new TrainingUnitMemberViewModel(
            definition.Id,
            definition.Name,
            definition.Position,
            definition.Role,
            definition.Status,
            definition.Accent,
            definition.Detail);
    }
}
