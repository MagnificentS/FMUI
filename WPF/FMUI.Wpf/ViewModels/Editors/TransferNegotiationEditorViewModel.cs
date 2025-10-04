using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class TransferNegotiationEditorViewModel : CardEditorViewModel
{
    private static readonly string[] DefaultStageOptions =
    {
        "Initial Talks",
        "Negotiating",
        "Finalising Terms",
        "Awaiting Response"
    };

    private static readonly string[] DefaultStatusOptions =
    {
        "Monitoring",
        "Negotiating",
        "Awaiting Response",
        "Accepted"
    };

    private readonly IClubDataService _clubDataService;
    private readonly ObservableCollection<TransferNegotiationDealEditorViewModel> _deals;
    private readonly RelayCommand _addDealCommand;
    private readonly RelayCommand _removeDealCommand;
    private TransferNegotiationDealEditorViewModel? _selectedDeal;
    private string? _validationMessage;
    private bool _hasCollectionChanges;

    public TransferNegotiationEditorViewModel(
        IReadOnlyList<TransferNegotiationDealSnapshot> deals,
        IReadOnlyList<ListEntrySnapshot> summaries,
        IClubDataService clubDataService)
        : base(
            "Manage Active Deals",
            "Tune offers, stages, and feedback across ongoing transfer negotiations.")
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));

        _deals = new ObservableCollection<TransferNegotiationDealEditorViewModel>(
            (deals ?? Array.Empty<TransferNegotiationDealSnapshot>())
                .Select(TransferNegotiationDealEditorViewModel.FromSnapshot));

        _deals.CollectionChanged += OnDealsCollectionChanged;

        foreach (var deal in _deals)
        {
            AttachDeal(deal);
        }

        if (_deals.Count > 0)
        {
            SelectedDeal = _deals[0];
        }

        _addDealCommand = new RelayCommand(_ => AddDeal());
        _removeDealCommand = new RelayCommand(_ => RemoveSelectedDeal(), () => SelectedDeal is not null);

        NotifyCanSaveChanged();
    }

    public ObservableCollection<TransferNegotiationDealEditorViewModel> Deals => _deals;

    public TransferNegotiationDealEditorViewModel? SelectedDeal
    {
        get => _selectedDeal;
        set
        {
            if (SetProperty(ref _selectedDeal, value))
            {
                _removeDealCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public string? ValidationMessage
    {
        get => _validationMessage;
        private set
        {
            if (SetProperty(ref _validationMessage, value))
            {
                OnPropertyChanged(nameof(HasValidationMessage));
            }
        }
    }

    public bool HasValidationMessage => !string.IsNullOrWhiteSpace(ValidationMessage);

    public ICommand AddDealCommand => _addDealCommand;

    public ICommand RemoveSelectedDealCommand => _removeDealCommand;

    protected override bool CanSave
    {
        get
        {
            var isDirty = _hasCollectionChanges || Deals.Any(deal => deal.IsDirty);
            ValidationMessage = Validate();
            return isDirty && string.IsNullOrWhiteSpace(ValidationMessage);
        }
    }

    protected override async Task PersistAsync()
    {
        var dealSnapshots = Deals.Select(deal => deal.ToSnapshot()).ToList();
        var summaries = dealSnapshots.Select(CreateSummary).ToList();

        await _clubDataService.UpdateAsync(snapshot =>
        {
            var centre = snapshot.Transfers.Centre with
            {
                Negotiations = dealSnapshots,
                ActiveDeals = summaries
            };

            var transfers = snapshot.Transfers with { Centre = centre };
            return snapshot with { Transfers = transfers };
        }).ConfigureAwait(false);

        foreach (var deal in Deals)
        {
            deal.AcceptChanges();
        }

        _hasCollectionChanges = false;
    }

    private void AddDeal()
    {
        var stageOptions = BuildOptionSet(
            DefaultStageOptions,
            deal => deal.StageOptions.Concat(new[] { deal.Stage }));
        var statusOptions = BuildOptionSet(
            DefaultStatusOptions,
            deal => deal.StatusOptions.Concat(new[] { deal.Status }));

        var template = SelectedDeal ?? _deals.FirstOrDefault();
        var termTemplates = template is not null
            ? template.Terms.Select(term => term.ToSnapshot()).ToList()
            : CreateDefaultTerms();

        var newDeal = TransferNegotiationDealEditorViewModel.CreateNew(
            stageOptions,
            statusOptions,
            termTemplates);

        _deals.Add(newDeal);
        SelectedDeal = newDeal;
    }

    private void RemoveSelectedDeal()
    {
        if (SelectedDeal is null)
        {
            return;
        }

        var index = _deals.IndexOf(SelectedDeal);
        if (index < 0)
        {
            return;
        }

        _deals.RemoveAt(index);

        if (_deals.Count == 0)
        {
            SelectedDeal = null;
            return;
        }

        var nextIndex = Math.Clamp(index, 0, _deals.Count - 1);
        SelectedDeal = _deals[nextIndex];
    }

    private void OnDealsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.Action == NotifyCollectionChangedAction.Reset)
        {
            foreach (var deal in _deals)
            {
                AttachDeal(deal);
            }

            NotifyCanSaveChanged();
            return;
        }

        if (e.OldItems is not null)
        {
            foreach (TransferNegotiationDealEditorViewModel deal in e.OldItems)
            {
                DetachDeal(deal);
            }
        }

        if (e.NewItems is not null)
        {
            foreach (TransferNegotiationDealEditorViewModel deal in e.NewItems)
            {
                AttachDeal(deal);
            }
        }

        _hasCollectionChanges = IsCollectionDifferentFromSnapshot();
        NotifyCanSaveChanged();
    }

    private void AttachDeal(TransferNegotiationDealEditorViewModel deal)
    {
        deal.PropertyChanged += OnDealPropertyChanged;
    }

    private void DetachDeal(TransferNegotiationDealEditorViewModel deal)
    {
        deal.PropertyChanged -= OnDealPropertyChanged;
    }

    private string? Validate()
    {
        if (_deals.Count == 0)
        {
            return null;
        }

        foreach (var deal in _deals)
        {
            if (string.IsNullOrWhiteSpace(deal.Player))
            {
                return "Player name is required for every negotiation.";
            }

            if (string.IsNullOrWhiteSpace(deal.Position))
            {
                return "Add a position so recruitment can stay aligned.";
            }

            if (string.IsNullOrWhiteSpace(deal.Club))
            {
                return "Club name is required for every negotiation.";
            }

            if (string.IsNullOrWhiteSpace(deal.Stage))
            {
                return "Specify a stage for every negotiation.";
            }

            if (string.IsNullOrWhiteSpace(deal.Status))
            {
                return "Specify a status for every negotiation.";
            }
        }

        return null;
    }

    private IReadOnlyList<string> BuildOptionSet(
        IReadOnlyList<string> defaults,
        Func<TransferNegotiationDealEditorViewModel, IEnumerable<string>> selector)
    {
        var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var ordered = new List<string>();

        void AppendRange(IEnumerable<string> values)
        {
            if (values is null)
            {
                return;
            }

            foreach (var value in values)
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    continue;
                }

                if (set.Add(value))
                {
                    ordered.Add(value);
                }
            }
        }

        if (defaults is not null)
        {
            AppendRange(defaults);
        }

        foreach (var deal in _deals)
        {
            AppendRange(selector(deal));
        }

        return ordered;
    }

    private bool IsCollectionDifferentFromSnapshot()
    {
        var baseline = _clubDataService.Current.Transfers.Centre.Negotiations
            ?? Array.Empty<TransferNegotiationDealSnapshot>();

        if (baseline.Count != _deals.Count)
        {
            return true;
        }

        var baselineIds = baseline
            .Select(deal => deal.Id)
            .OrderBy(id => id, StringComparer.Ordinal)
            .ToArray();

        var currentIds = _deals
            .Select(deal => deal.Id)
            .OrderBy(id => id, StringComparer.Ordinal)
            .ToArray();

        return !baselineIds.SequenceEqual(currentIds, StringComparer.Ordinal);
    }

    private static IReadOnlyList<TransferNegotiationTermSnapshot> CreateDefaultTerms()
    {
        return new List<TransferNegotiationTermSnapshot>
        {
            new(
                "fee",
                "Transfer Fee",
                "£{0:0.0}M",
                5d,
                100d,
                0.5d,
                15d,
                20d,
                "Guaranteed fee offered to the selling club."),
            new(
                "wage",
                "Weekly Wages",
                "£{0:0}K p/w",
                10d,
                400d,
                5d,
                80d,
                100d,
                "Weekly salary for the player."),
            new(
                "bonus",
                "Signing Bonus",
                "£{0:0.0}M",
                0d,
                20d,
                0.25d,
                1d,
                2d,
                "Upfront bonus requested by the agent.")
        };
    }

    private void OnDealPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(TransferNegotiationDealEditorViewModel.IsDirty) ||
            e.PropertyName == nameof(TransferNegotiationDealEditorViewModel.Player) ||
            e.PropertyName == nameof(TransferNegotiationDealEditorViewModel.Club) ||
            e.PropertyName == nameof(TransferNegotiationDealEditorViewModel.Stage) ||
            e.PropertyName == nameof(TransferNegotiationDealEditorViewModel.Status))
        {
            NotifyCanSaveChanged();
        }
    }

    private static ListEntrySnapshot CreateSummary(TransferNegotiationDealSnapshot deal)
    {
        var feeTerm = deal.Terms?.FirstOrDefault(term =>
            string.Equals(term.Id, "fee", StringComparison.OrdinalIgnoreCase));

        var secondary = feeTerm is not null
            ? string.Format(CultureInfo.InvariantCulture, feeTerm.Format, feeTerm.Value)
            : deal.Stage;

        return new ListEntrySnapshot(deal.Player, secondary, deal.Status, deal.Accent);
    }
}

public sealed class TransferNegotiationDealEditorViewModel : ObservableObject
{
    private string _initialPlayer;
    private string _initialPosition;
    private string _initialClub;
    private string? _initialAccent;
    private string _initialStage;
    private string _initialStatus;
    private string _initialDeadline;
    private string _initialSummary;
    private string _initialAgent;
    private string _initialResponse;
    private readonly ObservableCollection<string> _stageOptions;
    private readonly ObservableCollection<string> _statusOptions;
    private readonly ObservableCollection<TransferNegotiationTermEditorViewModel> _terms;
    private readonly RelayCommand _resetCommand;

    private string _player;
    private string _position;
    private string _club;
    private string? _accent;
    private string _stage;
    private string _status;
    private string _deadline;
    private string _summary;
    private string _agent;
    private string _response;
    private bool _isNew;

    private TransferNegotiationDealEditorViewModel(TransferNegotiationDealSnapshot snapshot)
    {
        if (snapshot is null)
        {
            throw new ArgumentNullException(nameof(snapshot));
        }

        Id = snapshot.Id;
        _initialPlayer = snapshot.Player;
        _initialPosition = snapshot.Position;
        _initialClub = snapshot.Club;
        _initialAccent = snapshot.Accent;

        _player = snapshot.Player;
        _position = snapshot.Position;
        _club = snapshot.Club;
        _accent = snapshot.Accent;

        _initialStage = snapshot.Stage;
        _initialStatus = snapshot.Status;
        _initialDeadline = snapshot.Deadline;
        _initialSummary = snapshot.Summary;
        _initialAgent = snapshot.Agent;
        _initialResponse = snapshot.Response;

        _stage = snapshot.Stage;
        _status = snapshot.Status;
        _deadline = snapshot.Deadline;
        _summary = snapshot.Summary;
        _agent = snapshot.Agent;
        _response = snapshot.Response;

        _stageOptions = CreateOptionList(snapshot.StageOptions, snapshot.Stage);
        _statusOptions = CreateOptionList(snapshot.StatusOptions, snapshot.Status);

        _terms = new ObservableCollection<TransferNegotiationTermEditorViewModel>(
            (snapshot.Terms ?? Array.Empty<TransferNegotiationTermSnapshot>())
                .Select(TransferNegotiationTermEditorViewModel.FromSnapshot));

        foreach (var term in _terms)
        {
            term.PropertyChanged += OnTermPropertyChanged;
        }

        _resetCommand = new RelayCommand(_ => Reset(), () => IsDirty);
    }

    public string Id { get; }

    public string Player
    {
        get => _player;
        set
        {
            if (SetProperty(ref _player, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string Position
    {
        get => _position;
        set
        {
            if (SetProperty(ref _position, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string Club
    {
        get => _club;
        set
        {
            if (SetProperty(ref _club, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string? Accent
    {
        get => _accent;
        set
        {
            if (SetProperty(ref _accent, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string Stage
    {
        get => _stage;
        set
        {
            if (SetProperty(ref _stage, value))
            {
                EnsureOption(_stageOptions, value);
                OnDirtyChanged();
            }
        }
    }

    public string Status
    {
        get => _status;
        set
        {
            if (SetProperty(ref _status, value))
            {
                EnsureOption(_statusOptions, value);
                OnDirtyChanged();
            }
        }
    }

    public string Deadline
    {
        get => _deadline;
        set
        {
            if (SetProperty(ref _deadline, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string Summary
    {
        get => _summary;
        set
        {
            if (SetProperty(ref _summary, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string Agent
    {
        get => _agent;
        set
        {
            if (SetProperty(ref _agent, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public string Response
    {
        get => _response;
        set
        {
            if (SetProperty(ref _response, value))
            {
                OnDirtyChanged();
            }
        }
    }

    public ObservableCollection<string> StageOptions => _stageOptions;

    public ObservableCollection<string> StatusOptions => _statusOptions;

    public ObservableCollection<TransferNegotiationTermEditorViewModel> Terms => _terms;

    public bool HasStageOptions => _stageOptions.Count > 0;

    public bool HasStatusOptions => _statusOptions.Count > 0;

    public bool IsDirty =>
        _isNew ||
        !string.Equals(_player, _initialPlayer, StringComparison.Ordinal) ||
        !string.Equals(_position, _initialPosition, StringComparison.Ordinal) ||
        !string.Equals(_club, _initialClub, StringComparison.Ordinal) ||
        !string.Equals(_accent ?? string.Empty, _initialAccent ?? string.Empty, StringComparison.Ordinal) ||
        !string.Equals(_stage, _initialStage, StringComparison.Ordinal) ||
        !string.Equals(_status, _initialStatus, StringComparison.Ordinal) ||
        !string.Equals(_deadline, _initialDeadline, StringComparison.Ordinal) ||
        !string.Equals(_summary, _initialSummary, StringComparison.Ordinal) ||
        !string.Equals(_agent, _initialAgent, StringComparison.Ordinal) ||
        !string.Equals(_response, _initialResponse, StringComparison.Ordinal) ||
        _terms.Any(term => term.IsDirty);

    public ICommand ResetCommand => _resetCommand;

    public static TransferNegotiationDealEditorViewModel CreateNew(
        IReadOnlyList<string> stageOptions,
        IReadOnlyList<string> statusOptions,
        IReadOnlyList<TransferNegotiationTermSnapshot> terms)
    {
        var stageList = stageOptions?.ToList() ?? new List<string>();
        var statusList = statusOptions?.ToList() ?? new List<string>();
        var termSnapshots = terms?.Select(term => term with { }).ToList() ?? new List<TransferNegotiationTermSnapshot>();

        var snapshot = new TransferNegotiationDealSnapshot(
            Guid.NewGuid().ToString("N"),
            string.Empty,
            string.Empty,
            string.Empty,
            stageList.FirstOrDefault() ?? string.Empty,
            statusList.FirstOrDefault() ?? string.Empty,
            string.Empty,
            string.Empty,
            string.Empty,
            string.Empty,
            null,
            stageList,
            statusList,
            termSnapshots);

        var viewModel = new TransferNegotiationDealEditorViewModel(snapshot)
        {
            _isNew = true
        };

        viewModel._initialPlayer = string.Empty;
        viewModel._initialPosition = string.Empty;
        viewModel._initialClub = string.Empty;
        viewModel._initialAccent = null;
        viewModel._initialDeadline = string.Empty;
        viewModel._initialSummary = string.Empty;
        viewModel._initialAgent = string.Empty;
        viewModel._initialResponse = string.Empty;

        viewModel._resetCommand.RaiseCanExecuteChanged();
        viewModel.OnPropertyChanged(nameof(IsDirty));

        return viewModel;
    }

    public static TransferNegotiationDealEditorViewModel FromSnapshot(TransferNegotiationDealSnapshot snapshot)
        => new(snapshot);

    public TransferNegotiationDealSnapshot ToSnapshot()
    {
        var termSnapshots = _terms.Select(term => term.ToSnapshot()).ToList();

        return new TransferNegotiationDealSnapshot(
            Id,
            _player,
            _position,
            _club,
            Stage,
            Status,
            Deadline,
            Summary,
            Agent,
            Response,
            Accent,
            _stageOptions.ToList(),
            _statusOptions.ToList(),
            termSnapshots);
    }

    public void AcceptChanges()
    {
        _initialPlayer = _player;
        _initialPosition = _position;
        _initialClub = _club;
        _initialAccent = _accent;
        _initialStage = _stage;
        _initialStatus = _status;
        _initialDeadline = _deadline;
        _initialSummary = _summary;
        _initialAgent = _agent;
        _initialResponse = _response;
        _isNew = false;

        foreach (var term in _terms)
        {
            term.AcceptChanges();
        }

        _resetCommand.RaiseCanExecuteChanged();
        OnPropertyChanged(nameof(IsDirty));
    }

    private void Reset()
    {
        Player = _initialPlayer;
        Position = _initialPosition;
        Club = _initialClub;
        Accent = _initialAccent;
        Stage = _initialStage;
        Status = _initialStatus;
        Deadline = _initialDeadline;
        Summary = _initialSummary;
        Agent = _initialAgent;
        Response = _initialResponse;

        foreach (var term in _terms)
        {
            term.Reset();
        }

        OnDirtyChanged();
    }

    private void OnDirtyChanged()
    {
        _resetCommand.RaiseCanExecuteChanged();
        OnPropertyChanged(nameof(IsDirty));
    }

    private void OnTermPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(TransferNegotiationTermEditorViewModel.IsDirty))
        {
            OnDirtyChanged();
        }
    }

    private static ObservableCollection<string> CreateOptionList(IReadOnlyList<string>? options, string value)
    {
        var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (options is { Count: > 0 })
        {
            foreach (var option in options)
            {
                if (!string.IsNullOrWhiteSpace(option))
                {
                    set.Add(option);
                }
            }
        }

        if (!string.IsNullOrWhiteSpace(value))
        {
            set.Add(value);
        }

        return new ObservableCollection<string>(set);
    }

    private static void EnsureOption(ObservableCollection<string> list, string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return;
        }

        if (!list.Any(item => string.Equals(item, value, StringComparison.OrdinalIgnoreCase)))
        {
            list.Add(value);
        }
    }
}

public sealed class TransferNegotiationTermEditorViewModel : ObservableObject
{
    private readonly string _id;
    private readonly string _label;
    private readonly string _format;
    private readonly double _minimum;
    private readonly double _maximum;
    private readonly double _step;
    private readonly double _target;
    private readonly string? _tooltip;
    private double _baseline;
    private double _value;
    private readonly RelayCommand _resetCommand;

    private TransferNegotiationTermEditorViewModel(TransferNegotiationTermSnapshot snapshot)
    {
        _id = snapshot.Id;
        _label = snapshot.Label;
        _format = snapshot.Format;
        _minimum = snapshot.Minimum;
        _maximum = snapshot.Maximum;
        _step = snapshot.Step;
        _target = snapshot.Target;
        _tooltip = snapshot.Tooltip;
        _baseline = snapshot.Value;
        _value = snapshot.Value;
        _resetCommand = new RelayCommand(_ => Reset(), () => IsDirty);
    }

    public string Label => _label;

    public string? Tooltip => _tooltip;

    public double Minimum => _minimum;

    public double Maximum => _maximum;

    public double Target => _target;

    public double Value
    {
        get => _value;
        set
        {
            var clamped = Math.Clamp(value, _minimum, _maximum <= _minimum ? value : _maximum);
            if (SetProperty(ref _value, clamped))
            {
                OnPropertyChanged(nameof(DisplayValue));
                OnPropertyChanged(nameof(DeltaDisplay));
                OnPropertyChanged(nameof(IsDirty));
                OnPropertyChanged(nameof(Progress));
                OnPropertyChanged(nameof(MeetsTarget));
                _resetCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public string DisplayValue => string.Format(CultureInfo.InvariantCulture, _format, Value);

    public string TargetDisplay => string.Format(CultureInfo.InvariantCulture, _format, _target);

    public string DeltaDisplay => string.Format(CultureInfo.InvariantCulture, _format, Value - _target);

    public double Progress
    {
        get
        {
            if (_target > 0)
            {
                var ratio = Value / _target;
                return Math.Clamp(ratio, 0d, 1d);
            }

            var range = _maximum - _minimum;
            if (range <= 0)
            {
                return 0d;
            }

            var relative = (Value - _minimum) / range;
            return Math.Clamp(relative, 0d, 1d);
        }
    }

    public bool MeetsTarget => Value >= _target;

    public double TickFrequency
    {
        get
        {
            if (_step > 0)
            {
                return _step;
            }

            var range = _maximum - _minimum;
            return range <= 0 ? 1d : Math.Max(range / 20d, 0.5d);
        }
    }

    public bool IsDirty => Math.Abs(Value - _baseline) > 0.0001;

    public ICommand ResetCommand => _resetCommand;

    public static TransferNegotiationTermEditorViewModel FromSnapshot(TransferNegotiationTermSnapshot snapshot)
        => new(snapshot);

    public TransferNegotiationTermSnapshot ToSnapshot()
    {
        return new TransferNegotiationTermSnapshot(
            _id,
            _label,
            _format,
            _minimum,
            _maximum,
            _step,
            Value,
            _target,
            _tooltip);
    }

    public void AcceptChanges()
    {
        _baseline = Value;
        _resetCommand.RaiseCanExecuteChanged();
        OnPropertyChanged(nameof(IsDirty));
    }

    public void Reset()
    {
        Value = _baseline;
        OnPropertyChanged(nameof(IsDirty));
    }
}
