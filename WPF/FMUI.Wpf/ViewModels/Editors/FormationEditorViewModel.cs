using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class FormationEditorViewModel : CardEditorViewModel
{
    private readonly IClubDataService _clubDataService;
    private readonly ReadOnlyCollection<FormationLineEditorViewModel> _lines;
    private readonly ReadOnlyCollection<FormationSlotEditorViewModel> _slots;
    private readonly ReadOnlyCollection<FormationPlayerOptionViewModel> _options;
    private string? _validationMessage;

    public FormationEditorViewModel(
        string title,
        string? subtitle,
        IReadOnlyList<FormationLineSnapshot> lines,
        IReadOnlyList<FormationPlayerOptionSnapshot> options,
        IClubDataService clubDataService)
        : base(title, subtitle)
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));

        if (lines is null)
        {
            throw new ArgumentNullException(nameof(lines));
        }

        if (options is null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        var optionViewModels = options
            .Select(option => new FormationPlayerOptionViewModel(option.Id, option.Name, option.Position, option.Detail))
            .ToList();

        var optionLookup = new HashSet<string>(optionViewModels.Select(option => option.Id), StringComparer.OrdinalIgnoreCase);

        _options = new ReadOnlyCollection<FormationPlayerOptionViewModel>(optionViewModels);

        var slotCollection = new List<FormationSlotEditorViewModel>();
        var lineCollection = new List<FormationLineEditorViewModel>();

        foreach (var line in lines)
        {
            var slots = new List<FormationSlotEditorViewModel>();
            var index = 1;
            foreach (var player in line.Players)
            {
                if (!optionLookup.Contains(player.Id))
                {
                    optionViewModels.Add(new FormationPlayerOptionViewModel(player.Id, player.Name, position: null, detail: null));
                    optionLookup.Add(player.Id);
                }

                var slot = new FormationSlotEditorViewModel(
                    owner: this,
                    slotId: player.Id,
                    role: line.Role,
                    label: line.Players.Count > 1 ? $"{line.Role} {index}" : line.Role,
                    normalizedX: player.X,
                    normalizedY: player.Y,
                    selectedPlayerId: player.Id);

                slots.Add(slot);
                slotCollection.Add(slot);
                index++;
            }

            lineCollection.Add(new FormationLineEditorViewModel(line.Role, slots));
        }

        _lines = new ReadOnlyCollection<FormationLineEditorViewModel>(lineCollection);
        _slots = new ReadOnlyCollection<FormationSlotEditorViewModel>(slotCollection);

        UpdateValidationState();
    }

    public IReadOnlyList<FormationLineEditorViewModel> Lines => _lines;

    public string? ValidationMessage
    {
        get => _validationMessage;
        private set
        {
            if (SetProperty(ref _validationMessage, value))
            {
                NotifyCanSaveChanged();
                OnPropertyChanged(nameof(HasValidationMessage));
            }
        }
    }

    public bool HasValidationMessage => !string.IsNullOrWhiteSpace(ValidationMessage);

    protected override bool CanSave => string.IsNullOrWhiteSpace(ValidationMessage);

    internal IReadOnlyList<FormationPlayerOptionViewModel> GetAvailablePlayers(FormationSlotEditorViewModel requester)
    {
        var assigned = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var slot in _slots)
        {
            if (ReferenceEquals(slot, requester))
            {
                continue;
            }

            if (!string.IsNullOrWhiteSpace(slot.SelectedPlayerId))
            {
                assigned.Add(slot.SelectedPlayerId);
            }
        }

        return _options
            .Where(option => string.Equals(option.Id, requester.SelectedPlayerId, StringComparison.OrdinalIgnoreCase) ||
                             !assigned.Contains(option.Id))
            .OrderBy(option => option.DisplayName, StringComparer.CurrentCultureIgnoreCase)
            .ToList();
    }

    internal void HandleSlotSelectionChanged()
    {
        foreach (var slot in _slots)
        {
            slot.NotifyAvailablePlayersChanged();
        }

        UpdateValidationState();
    }

    private void UpdateValidationState()
    {
        foreach (var slot in _slots)
        {
            if (string.IsNullOrWhiteSpace(slot.SelectedPlayerId))
            {
                ValidationMessage = "Assign a player to every position before saving.";
                return;
            }
        }

        var duplicates = _slots
            .Where(slot => !string.IsNullOrWhiteSpace(slot.SelectedPlayerId))
            .GroupBy(slot => slot.SelectedPlayerId, StringComparer.OrdinalIgnoreCase)
            .FirstOrDefault(group => group.Count() > 1);

        if (duplicates is not null)
        {
            ValidationMessage = "Each player can only occupy a single position.";
            return;
        }

        ValidationMessage = null;
    }

    protected override async Task PersistAsync()
    {
        var updatedLines = new List<FormationLineSnapshot>(_lines.Count);
        foreach (var line in _lines)
        {
            var players = new List<FormationPlayerSnapshot>(line.Slots.Count);
            foreach (var slot in line.Slots)
            {
                var option = _options.First(o => string.Equals(o.Id, slot.SelectedPlayerId, StringComparison.OrdinalIgnoreCase));
                players.Add(new FormationPlayerSnapshot(option.Id, ComposeDisplayName(option), slot.NormalizedX, slot.NormalizedY));
            }

            updatedLines.Add(new FormationLineSnapshot(line.Role, players));
        }

        await _clubDataService.UpdateAsync(snapshot =>
        {
            var tactics = snapshot.Tactics with { FormationLines = updatedLines };
            return snapshot with { Tactics = tactics };
        }).ConfigureAwait(false);
    }

    private static string ComposeDisplayName(FormationPlayerOptionViewModel option)
    {
        if (!string.IsNullOrWhiteSpace(option.Detail))
        {
            return option.DisplayName.Contains('(')
                ? option.DisplayName
                : $"{option.DisplayName} ({option.Detail})";
        }

        return option.DisplayName;
    }
}

public sealed class FormationLineEditorViewModel
{
    public FormationLineEditorViewModel(string role, IReadOnlyList<FormationSlotEditorViewModel> slots)
    {
        Role = role ?? throw new ArgumentNullException(nameof(role));
        Slots = slots ?? throw new ArgumentNullException(nameof(slots));
    }

    public string Role { get; }

    public IReadOnlyList<FormationSlotEditorViewModel> Slots { get; }
}

public sealed class FormationSlotEditorViewModel : ObservableObject
{
    private readonly FormationEditorViewModel _owner;
    private string? _selectedPlayerId;

    public FormationSlotEditorViewModel(
        FormationEditorViewModel owner,
        string slotId,
        string role,
        string label,
        double normalizedX,
        double normalizedY,
        string? selectedPlayerId)
    {
        _owner = owner ?? throw new ArgumentNullException(nameof(owner));
        SlotId = slotId ?? throw new ArgumentNullException(nameof(slotId));
        Role = role ?? throw new ArgumentNullException(nameof(role));
        Label = label ?? throw new ArgumentNullException(nameof(label));
        NormalizedX = normalizedX;
        NormalizedY = normalizedY;
        _selectedPlayerId = selectedPlayerId;
    }

    public string SlotId { get; }

    public string Role { get; }

    public string Label { get; }

    public double NormalizedX { get; }

    public double NormalizedY { get; }

    public string? SelectedPlayerId
    {
        get => _selectedPlayerId;
        set
        {
            if (SetProperty(ref _selectedPlayerId, value))
            {
                _owner.HandleSlotSelectionChanged();
            }
        }
    }

    public IReadOnlyList<FormationPlayerOptionViewModel> AvailablePlayers => _owner.GetAvailablePlayers(this);

    internal void NotifyAvailablePlayersChanged() => OnPropertyChanged(nameof(AvailablePlayers));
}

public sealed class FormationPlayerOptionViewModel
{
    public FormationPlayerOptionViewModel(string id, string displayName, string? position, string? detail)
    {
        Id = id ?? throw new ArgumentNullException(nameof(id));
        DisplayName = displayName ?? throw new ArgumentNullException(nameof(displayName));
        Position = position;
        Detail = detail;
    }

    public string Id { get; }

    public string DisplayName { get; }

    public string? Position { get; }

    public string? Detail { get; }
}
