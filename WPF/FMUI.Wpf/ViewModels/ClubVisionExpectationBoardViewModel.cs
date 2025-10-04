using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class ClubVisionExpectationBoardViewModel : ObservableObject
{
    private readonly ReadOnlyCollection<ClubVisionExpectationRowViewModel> _objectives;
    private readonly ReadOnlyCollection<ClubVisionExpectationFilterViewModel> _statusFilters;
    private readonly RelayCommand _selectStatusCommand;
    private ClubVisionExpectationFilterViewModel? _selectedStatus;
    private string _summary;

    public ClubVisionExpectationBoardViewModel(ClubVisionExpectationBoardDefinition definition, IClubDataService clubDataService)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        if (clubDataService is null)
        {
            throw new ArgumentNullException(nameof(clubDataService));
        }

        _objectives = new ReadOnlyCollection<ClubVisionExpectationRowViewModel>(
            definition.Objectives?
                .Select(ClubVisionExpectationRowViewModel.FromDefinition)
                .ToList() ?? new List<ClubVisionExpectationRowViewModel>());

        _statusFilters = new ReadOnlyCollection<ClubVisionExpectationFilterViewModel>(
            BuildFilters(_objectives, definition.StatusOptions));

        _selectStatusCommand = new RelayCommand(
            parameter =>
            {
                if (parameter is ClubVisionExpectationFilterViewModel filter)
                {
                    SelectedStatus = filter;
                }
            },
            parameter => parameter is ClubVisionExpectationFilterViewModel filter && filter != SelectedStatus);

        _summary = BuildSummary();

        if (_statusFilters.Count > 0)
        {
            SelectedStatus = _statusFilters[0];
        }
    }

    public IReadOnlyList<ClubVisionExpectationRowViewModel> Objectives => _objectives;

    public IReadOnlyList<ClubVisionExpectationFilterViewModel> StatusFilters => _statusFilters;

    public ICommand SelectStatusCommand => _selectStatusCommand;

    public ClubVisionExpectationFilterViewModel? SelectedStatus
    {
        get => _selectedStatus;
        private set
        {
            if (SetProperty(ref _selectedStatus, value))
            {
                foreach (var filter in _statusFilters)
                {
                    filter.IsSelected = ReferenceEquals(filter, value);
                }

                UpdateObjectiveVisibility(value);
                _summary = BuildSummary();
                OnPropertyChanged(nameof(Summary));
                _selectStatusCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public string Summary => _summary;

    public bool HasObjectives => _objectives.Count > 0;

    private void UpdateObjectiveVisibility(ClubVisionExpectationFilterViewModel? filter)
    {
        if (filter is null || filter.Key is null)
        {
            foreach (var objective in _objectives)
            {
                objective.IsVisible = true;
            }

            return;
        }

        var key = filter.Key;
        foreach (var objective in _objectives)
        {
            objective.IsVisible = string.Equals(objective.Status, key, StringComparison.OrdinalIgnoreCase);
        }
    }

    private string BuildSummary()
    {
        if (_objectives.Count == 0)
        {
            return "No objectives configured";
        }

        var visible = _objectives.Count(o => o.IsVisible);
        var total = _objectives.Count;
        var urgent = _objectives.Count(o => o.IsVisible && o.IsUrgent);

        if (visible == total)
        {
            return urgent > 0
                ? $"{total} objectives • {urgent} urgent" : $"{total} objectives monitored";
        }

        return urgent > 0
            ? $"{visible} of {total} objectives shown • {urgent} urgent"
            : $"{visible} of {total} objectives shown";
    }

    private static List<ClubVisionExpectationFilterViewModel> BuildFilters(
        IReadOnlyList<ClubVisionExpectationRowViewModel> objectives,
        IReadOnlyList<string> statusOptions)
    {
        var filters = new List<ClubVisionExpectationFilterViewModel>
        {
            ClubVisionExpectationFilterViewModel.CreateAll(objectives)
        };

        if (statusOptions is { Count: > 0 })
        {
            foreach (var option in statusOptions.Where(o => !string.IsNullOrWhiteSpace(o)))
            {
                filters.Add(ClubVisionExpectationFilterViewModel.Create(option, objectives));
            }
        }

        return filters;
    }
}

public sealed class ClubVisionExpectationRowViewModel : ObservableObject
{
    private bool _isVisible = true;

    private ClubVisionExpectationRowViewModel(
        string id,
        string objective,
        string competition,
        string priority,
        string status,
        string deadline,
        string? notes,
        string? accent,
        bool isUrgent)
    {
        Id = id;
        Objective = objective;
        Competition = competition;
        Priority = priority;
        Status = status;
        Deadline = deadline;
        Notes = notes;
        Accent = accent;
        IsUrgent = isUrgent;
    }

    public string Id { get; }

    public string Objective { get; }

    public string Competition { get; }

    public string Priority { get; }

    public string Status { get; }

    public string Deadline { get; }

    public string? Notes { get; }

    public string? Accent { get; }

    public bool IsUrgent { get; }

    public bool IsVisible
    {
        get => _isVisible;
        set => SetProperty(ref _isVisible, value);
    }

    public static ClubVisionExpectationRowViewModel FromDefinition(ClubVisionExpectationDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        var urgent = string.Equals(definition.Priority, "Critical", StringComparison.OrdinalIgnoreCase)
            || string.Equals(definition.Priority, "High", StringComparison.OrdinalIgnoreCase);

        return new ClubVisionExpectationRowViewModel(
            definition.Id,
            definition.Objective,
            definition.Competition,
            definition.Priority,
            definition.Status,
            definition.Deadline,
            definition.Notes,
            definition.Accent,
            urgent);
    }
}

public sealed class ClubVisionExpectationFilterViewModel : ObservableObject
{
    private bool _isSelected;

    private ClubVisionExpectationFilterViewModel(string? key, string label, int count)
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

    public static ClubVisionExpectationFilterViewModel CreateAll(IReadOnlyList<ClubVisionExpectationRowViewModel> objectives)
    {
        var count = objectives?.Count ?? 0;
        return new ClubVisionExpectationFilterViewModel(null, count == 1 ? "All (1)" : $"All ({count})", count);
    }

    public static ClubVisionExpectationFilterViewModel Create(
        string status,
        IReadOnlyList<ClubVisionExpectationRowViewModel> objectives)
    {
        if (objectives is null || objectives.Count == 0)
        {
            return new ClubVisionExpectationFilterViewModel(status, status, 0);
        }

        var count = objectives.Count(obj => string.Equals(obj.Status, status, StringComparison.OrdinalIgnoreCase));
        var label = count == 0 ? status : $"{status} ({count})";
        return new ClubVisionExpectationFilterViewModel(status, label, count);
    }
}
