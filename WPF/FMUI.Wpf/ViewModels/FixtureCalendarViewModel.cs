using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class FixtureCalendarViewModel : ObservableObject
{
    private readonly IClubDataService _clubDataService;
    private readonly Dictionary<string, FixtureCalendarMatchViewModel> _matchLookup;
    private FixtureMatchDetailViewModel? _activeDetail;
    private bool _isDetailOpen;

    public FixtureCalendarViewModel(FixtureCalendarDefinition definition, IClubDataService clubDataService)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _matchLookup = new Dictionary<string, FixtureCalendarMatchViewModel>(StringComparer.OrdinalIgnoreCase);

        Filters = new ObservableCollection<FixtureCalendarFilterViewModel>();
        Weeks = new ObservableCollection<FixtureCalendarWeekViewModel>();

        if (definition.Filters is { Count: > 0 })
        {
            foreach (var filter in definition.Filters)
            {
                var filterViewModel = new FixtureCalendarFilterViewModel(this, filter);
                Filters.Add(filterViewModel);
            }
        }

        if (definition.Weeks is { Count: > 0 })
        {
            foreach (var week in definition.Weeks)
            {
                var weekViewModel = new FixtureCalendarWeekViewModel(week);
                foreach (var day in weekViewModel.Days)
                {
                    foreach (var match in day.Matches)
                    {
                        match.ShowDetailRequested += OnMatchDetailRequested;
                        _matchLookup[match.Id] = match;
                    }
                }

                Weeks.Add(weekViewModel);
            }
        }

        ApplyFilters();
    }

    public ObservableCollection<FixtureCalendarFilterViewModel> Filters { get; }

    public ObservableCollection<FixtureCalendarWeekViewModel> Weeks { get; }

    public FixtureMatchDetailViewModel? ActiveDetail
    {
        get => _activeDetail;
        private set => SetProperty(ref _activeDetail, value);
    }

    public bool IsDetailOpen
    {
        get => _isDetailOpen;
        private set => SetProperty(ref _isDetailOpen, value);
    }

    internal void ToggleFilter(FixtureCalendarFilterViewModel filter)
    {
        if (filter is null)
        {
            return;
        }

        if (!Filters.Contains(filter))
        {
            return;
        }

        if (filter.IsCatchAll && !filter.IsActive)
        {
            foreach (var other in Filters)
            {
                other.SetIsActive(ReferenceEquals(other, filter));
            }
        }
        else
        {
            var catchAll = Filters.FirstOrDefault(f => f.IsCatchAll);
            if (catchAll is not null && catchAll.IsActive)
            {
                catchAll.SetIsActive(false);
            }

            filter.SetIsActive(!filter.IsActive);
        }

        if (Filters.All(f => !f.IsActive))
        {
            foreach (var filterViewModel in Filters)
            {
                if (filterViewModel.IsCatchAll)
                {
                    filterViewModel.SetIsActive(true);
                }
            }
        }

        ApplyFilters();
    }

    internal void ShowDetail(FixtureCalendarMatchViewModel match)
    {
        if (match is null)
        {
            return;
        }

        var detail = new FixtureMatchDetailViewModel(match, this);
        ActiveDetail = detail;
        IsDetailOpen = true;
    }

    internal void CloseDetail()
    {
        if (ActiveDetail is null)
        {
            return;
        }

        ActiveDetail.Dispose();
        ActiveDetail = null;
        IsDetailOpen = false;
    }

    internal async Task SaveMatchDetailAsync(FixtureMatchDetailViewModel detail)
    {
        if (detail is null)
        {
            throw new ArgumentNullException(nameof(detail));
        }

        detail.IsBusy = true;
        detail.StatusMessage = "Saving fixture update...";

        try
        {
            await _clubDataService.UpdateAsync(snapshot =>
            {
                var fixtures = snapshot.Fixtures;
                var calendar = fixtures.Calendar;

                var updatedWeeks = calendar.Weeks
                    .Select(week => week with
                    {
                        Days = week.Days
                            .Select(day => day with
                            {
                                Matches = day.Matches
                                    .Select(match => match.Id.Equals(detail.Id, StringComparison.OrdinalIgnoreCase)
                                        ? match with
                                        {
                                            PreparationNote = detail.PreparationNote,
                                            TravelNote = detail.TravelNote,
                                            Status = detail.Status
                                        }
                                        : match)
                                    .ToList()
                            })
                            .ToList()
                    })
                    .ToList();

                var updatedCalendar = calendar with { Weeks = updatedWeeks };
                var updatedFixtures = fixtures with { Calendar = updatedCalendar };
                return snapshot with { Fixtures = updatedFixtures };
            }).ConfigureAwait(true);

            if (_matchLookup.TryGetValue(detail.Id, out var match))
            {
                match.ApplyDetail(detail);
            }

            detail.StatusMessage = "Fixture updated.";
            CloseDetail();
        }
        catch (Exception ex)
        {
            detail.StatusMessage = $"Unable to save fixture: {ex.Message}";
        }
        finally
        {
            detail.IsBusy = false;
        }
    }

    private void OnMatchDetailRequested(object? sender, EventArgs e)
    {
        if (sender is FixtureCalendarMatchViewModel match)
        {
            ShowDetail(match);
        }
    }

    private void ApplyFilters()
    {
        var activeCompetitions = Filters
            .Where(f => f.IsActive)
            .SelectMany(f => f.Competitions)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var hasSpecificFilters = activeCompetitions.Count > 0;

        foreach (var match in _matchLookup.Values)
        {
            if (!hasSpecificFilters)
            {
                match.IsVisible = true;
                continue;
            }

            match.IsVisible = activeCompetitions.Contains(match.CompetitionKey, StringComparer.OrdinalIgnoreCase);
        }
    }
}

public sealed class FixtureCalendarFilterViewModel : ObservableObject
{
    private readonly FixtureCalendarViewModel _owner;
    private bool _isActive;

    internal FixtureCalendarFilterViewModel(FixtureCalendarViewModel owner, FixtureCalendarFilterDefinition definition)
    {
        _owner = owner ?? throw new ArgumentNullException(nameof(owner));
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Id = definition.Id;
        DisplayName = definition.DisplayName;
        Competitions = definition.Competitions ?? Array.Empty<string>();
        _isActive = definition.IsDefault;
        ToggleCommand = new RelayCommand(_ => _owner.ToggleFilter(this));
    }

    public string Id { get; }

    public string DisplayName { get; }

    public IReadOnlyList<string> Competitions { get; }

    public ICommand ToggleCommand { get; }

    public bool IsActive
    {
        get => _isActive;
        private set => SetProperty(ref _isActive, value);
    }

    internal bool IsCatchAll => Competitions.Count == 0;

    internal void SetIsActive(bool isActive)
    {
        IsActive = isActive;
    }
}

public sealed class FixtureCalendarWeekViewModel
{
    public FixtureCalendarWeekViewModel(FixtureCalendarWeekDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Label = definition.Label;
        Days = new ObservableCollection<FixtureCalendarDayViewModel>();

        if (definition.Days is { Count: > 0 })
        {
            foreach (var day in definition.Days)
            {
                Days.Add(new FixtureCalendarDayViewModel(day));
            }
        }
    }

    public string Label { get; }

    public ObservableCollection<FixtureCalendarDayViewModel> Days { get; }
}

public sealed class FixtureCalendarDayViewModel
{
    public FixtureCalendarDayViewModel(FixtureCalendarDayDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Label = definition.Label;
        Date = definition.Date;
        Matches = new ObservableCollection<FixtureCalendarMatchViewModel>();

        if (definition.Matches is { Count: > 0 })
        {
            foreach (var match in definition.Matches)
            {
                Matches.Add(new FixtureCalendarMatchViewModel(match));
            }
        }
    }

    public string Label { get; }

    public string Date { get; }

    public ObservableCollection<FixtureCalendarMatchViewModel> Matches { get; }
}

public sealed class FixtureCalendarMatchViewModel : ObservableObject
{
    private bool _isVisible = true;

    internal FixtureCalendarMatchViewModel(FixtureCalendarMatchDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Id = definition.Id;
        Day = definition.Day;
        KickOff = definition.KickOff;
        Competition = definition.Competition;
        CompetitionKey = string.IsNullOrWhiteSpace(definition.Competition) ? "all" : definition.Competition;
        Opponent = definition.Opponent;
        Venue = definition.Venue;
        IsHome = definition.IsHome;
        Importance = definition.Importance;
        Result = definition.Result;
        Broadcast = definition.Broadcast;
        TravelNote = definition.TravelNote;
        PreparationNote = definition.PreparationNote;
        Status = definition.Status;
        CompetitionAccent = definition.CompetitionAccent;
        KeyPeople = definition.KeyPeople is { Count: > 0 }
            ? definition.KeyPeople.Select(item => new CardListItemViewModel(item)).ToList()
            : Array.Empty<CardListItemViewModel>();
        Preparation = definition.Preparation is { Count: > 0 }
            ? definition.Preparation.Select(item => new CardListItemViewModel(item)).ToList()
            : Array.Empty<CardListItemViewModel>();

        ShowDetailCommand = new RelayCommand(_ => ShowDetailRequested?.Invoke(this, EventArgs.Empty));
    }

    public event EventHandler? ShowDetailRequested;

    public string Id { get; }

    public string Day { get; }

    public string KickOff { get; }

    public string Competition { get; }

    public string CompetitionKey { get; }

    public string Opponent { get; }

    public string Venue { get; }

    public bool IsHome { get; }

    public string Importance { get; }

    public string? Result { get; private set; }

    public string? Broadcast { get; private set; }

    public string? TravelNote { get; private set; }

    public string? PreparationNote { get; private set; }

    public string? Status { get; private set; }

    public string? CompetitionAccent { get; }

    public IReadOnlyList<CardListItemViewModel> KeyPeople { get; }

    public IReadOnlyList<CardListItemViewModel> Preparation { get; }

    public ICommand ShowDetailCommand { get; }

    public bool IsVisible
    {
        get => _isVisible;
        internal set => SetProperty(ref _isVisible, value);
    }

    internal void ApplyDetail(FixtureMatchDetailViewModel detail)
    {
        Result = detail.Result;
        TravelNote = detail.TravelNote;
        PreparationNote = detail.PreparationNote;
        Status = detail.Status;
        OnPropertyChanged(nameof(Result));
        OnPropertyChanged(nameof(TravelNote));
        OnPropertyChanged(nameof(PreparationNote));
        OnPropertyChanged(nameof(Status));
    }
}

public sealed class FixtureMatchDetailViewModel : ObservableObject, IDisposable
{
    private readonly FixtureCalendarMatchViewModel _match;
    private readonly FixtureCalendarViewModel _owner;
    private readonly AsyncRelayCommand _saveCommand;
    private readonly RelayCommand _closeCommand;
    private bool _isBusy;
    private string? _statusMessage;
    private string _preparationNote;
    private string? _travelNote;
    private string? _status;

    internal FixtureMatchDetailViewModel(FixtureCalendarMatchViewModel match, FixtureCalendarViewModel owner)
    {
        _match = match ?? throw new ArgumentNullException(nameof(match));
        _owner = owner ?? throw new ArgumentNullException(nameof(owner));

        _preparationNote = match.PreparationNote ?? string.Empty;
        _travelNote = match.TravelNote;
        _status = match.Status;

        Id = match.Id;
        Opponent = match.Opponent;
        Competition = match.Competition;
        KickOff = match.KickOff;
        Venue = match.Venue;
        IsHome = match.IsHome;
        Importance = match.Importance;
        Result = match.Result;
        Broadcast = match.Broadcast;
        KeyPeople = match.KeyPeople;
        Preparation = match.Preparation;

        _saveCommand = new AsyncRelayCommand(SaveAsync, () => !IsBusy);
        _closeCommand = new RelayCommand(_ => _owner.CloseDetail());
    }

    public string Id { get; }

    public string Opponent { get; }

    public string Competition { get; }

    public string KickOff { get; }

    public string Venue { get; }

    public bool IsHome { get; }

    public string Importance { get; }

    public string? Result { get; }

    public string? Broadcast { get; }

    public IReadOnlyList<CardListItemViewModel> KeyPeople { get; }

    public IReadOnlyList<CardListItemViewModel> Preparation { get; }

    public bool IsBusy
    {
        get => _isBusy;
        set
        {
            if (SetProperty(ref _isBusy, value))
            {
                _saveCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public string? StatusMessage
    {
        get => _statusMessage;
        set => SetProperty(ref _statusMessage, value);
    }

    public string PreparationNote
    {
        get => _preparationNote;
        set => SetProperty(ref _preparationNote, value);
    }

    public string? TravelNote
    {
        get => _travelNote;
        set => SetProperty(ref _travelNote, value);
    }

    public string? Status
    {
        get => _status;
        set => SetProperty(ref _status, value);
    }

    public ICommand SaveCommand => _saveCommand;

    public ICommand CloseCommand => _closeCommand;

    internal async Task SaveAsync()
    {
        await _owner.SaveMatchDetailAsync(this).ConfigureAwait(true);
    }

    public void Dispose()
    {
        _saveCommand.Dispose();
    }
}
