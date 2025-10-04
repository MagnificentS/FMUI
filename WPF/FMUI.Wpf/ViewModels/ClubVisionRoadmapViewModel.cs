using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class ClubVisionRoadmapViewModel : ObservableObject
{
    private readonly ReadOnlyCollection<ClubVisionRoadmapPhaseViewModel> _phases;
    private readonly ReadOnlyCollection<ClubVisionRoadmapStatusViewModel> _statusFilters;
    private readonly RelayCommand _selectStatusCommand;
    private ClubVisionRoadmapStatusViewModel? _selectedStatus;
    private string _summary;

    public ClubVisionRoadmapViewModel(ClubVisionRoadmapDefinition definition, IClubDataService clubDataService)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (clubDataService is null)
        {
            throw new ArgumentNullException(nameof(clubDataService));
        }

        _phases = new ReadOnlyCollection<ClubVisionRoadmapPhaseViewModel>(
            definition.Phases?
                .Select(ClubVisionRoadmapPhaseViewModel.FromDefinition)
                .ToList() ?? new List<ClubVisionRoadmapPhaseViewModel>());

        _statusFilters = new ReadOnlyCollection<ClubVisionRoadmapStatusViewModel>(
            BuildStatusFilters(_phases, definition.StatusOptions));

        _selectStatusCommand = new RelayCommand(
            parameter =>
            {
                if (parameter is ClubVisionRoadmapStatusViewModel status)
                {
                    SelectedStatus = status;
                }
            },
            parameter => parameter is ClubVisionRoadmapStatusViewModel status && status != SelectedStatus);

        _summary = BuildSummary();

        if (_statusFilters.Count > 0)
        {
            SelectedStatus = _statusFilters[0];
        }
    }

    public IReadOnlyList<ClubVisionRoadmapPhaseViewModel> Phases => _phases;

    public IReadOnlyList<ClubVisionRoadmapStatusViewModel> StatusFilters => _statusFilters;

    public ICommand SelectStatusCommand => _selectStatusCommand;

    public ClubVisionRoadmapStatusViewModel? SelectedStatus
    {
        get => _selectedStatus;
        private set
        {
            if (SetProperty(ref _selectedStatus, value))
            {
                foreach (var status in _statusFilters)
                {
                    status.IsSelected = ReferenceEquals(status, value);
                }

                UpdatePhaseVisibility(value);
                _summary = BuildSummary();
                OnPropertyChanged(nameof(Summary));
                _selectStatusCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public string Summary => _summary;

    private void UpdatePhaseVisibility(ClubVisionRoadmapStatusViewModel? status)
    {
        if (status is null || status.Key is null)
        {
            foreach (var phase in _phases)
            {
                phase.IsVisible = true;
            }

            return;
        }

        var key = status.Key;
        foreach (var phase in _phases)
        {
            phase.IsVisible = string.Equals(phase.Status, key, StringComparison.OrdinalIgnoreCase);
        }
    }

    private string BuildSummary()
    {
        if (_phases.Count == 0)
        {
            return "No milestones captured";
        }

        var visible = _phases.Count(p => p.IsVisible);
        var total = _phases.Count;
        var atRisk = _phases.Count(p => p.IsVisible && p.IsAtRisk);

        if (visible == total)
        {
            return atRisk > 0
                ? $"{total} milestones • {atRisk} flagged" : $"{total} milestones on record";
        }

        return atRisk > 0
            ? $"{visible} of {total} milestones shown • {atRisk} flagged"
            : $"{visible} of {total} milestones shown";
    }

    private static List<ClubVisionRoadmapStatusViewModel> BuildStatusFilters(
        IReadOnlyList<ClubVisionRoadmapPhaseViewModel> phases,
        IReadOnlyList<string> options)
    {
        var filters = new List<ClubVisionRoadmapStatusViewModel>
        {
            ClubVisionRoadmapStatusViewModel.CreateAll(phases)
        };

        if (options is { Count: > 0 })
        {
            foreach (var option in options.Where(o => !string.IsNullOrWhiteSpace(o)))
            {
                filters.Add(ClubVisionRoadmapStatusViewModel.Create(option, phases));
            }
        }

        return filters;
    }
}

public sealed class ClubVisionRoadmapPhaseViewModel : ObservableObject
{
    private bool _isVisible = true;

    private ClubVisionRoadmapPhaseViewModel(
        string id,
        string title,
        string timeline,
        string status,
        string? description,
        string? accent,
        string? pill,
        bool isAtRisk)
    {
        Id = id;
        Title = title;
        Timeline = timeline;
        Status = status;
        Description = description;
        Accent = accent;
        Pill = pill;
        IsAtRisk = isAtRisk;
    }

    public string Id { get; }

    public string Title { get; }

    public string Timeline { get; }

    public string Status { get; }

    public string? Description { get; }

    public string? Accent { get; }

    public string? Pill { get; }

    public bool IsAtRisk { get; }

    public bool IsVisible
    {
        get => _isVisible;
        set => SetProperty(ref _isVisible, value);
    }

    public static ClubVisionRoadmapPhaseViewModel FromDefinition(ClubVisionRoadmapPhaseDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        var isAtRisk = string.Equals(definition.Status, "At Risk", StringComparison.OrdinalIgnoreCase)
            || string.Equals(definition.Status, "Behind", StringComparison.OrdinalIgnoreCase)
            || string.Equals(definition.Status, "Off Track", StringComparison.OrdinalIgnoreCase);

        return new ClubVisionRoadmapPhaseViewModel(
            definition.Id,
            definition.Title,
            definition.Timeline,
            definition.Status,
            definition.Description,
            definition.Accent,
            definition.Pill,
            isAtRisk);
    }
}

public sealed class ClubVisionRoadmapStatusViewModel : ObservableObject
{
    private bool _isSelected;

    private ClubVisionRoadmapStatusViewModel(string? key, string label, int count)
    {
        Key = key;
        Label = label;
        Count = count;
    }

    public string? Key { get; }

    public string Label { get; }

    public int Count { get; }

    public bool IsSelected
    {
        get => _isSelected;
        set => SetProperty(ref _isSelected, value);
    }

    public static ClubVisionRoadmapStatusViewModel CreateAll(IReadOnlyList<ClubVisionRoadmapPhaseViewModel> phases)
    {
        var count = phases?.Count ?? 0;
        return new ClubVisionRoadmapStatusViewModel(null, count == 1 ? "All (1)" : $"All ({count})", count);
    }

    public static ClubVisionRoadmapStatusViewModel Create(string status, IReadOnlyList<ClubVisionRoadmapPhaseViewModel> phases)
    {
        if (phases is null || phases.Count == 0)
        {
            return new ClubVisionRoadmapStatusViewModel(status, status, 0);
        }

        var count = phases.Count(phase => string.Equals(phase.Status, status, StringComparison.OrdinalIgnoreCase));
        var label = count == 0 ? status : $"{status} ({count})";
        return new ClubVisionRoadmapStatusViewModel(status, label, count);
    }
}
