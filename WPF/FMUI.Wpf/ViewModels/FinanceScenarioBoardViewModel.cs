using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class FinanceScenarioBoardViewModel : ObservableObject
{
    private readonly IClubDataService _clubDataService;
    private FinanceScenarioDefinition _definition;
    private readonly ReadOnlyCollection<FinanceScenarioOptionViewModel> _options;
    private readonly AsyncRelayCommand _saveCommand;
    private readonly RelayCommand _resetCommand;
    private bool _isSaving;
    private string? _statusMessage;

    public FinanceScenarioBoardViewModel(FinanceScenarioDefinition definition, IClubDataService clubDataService)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));

        var options = definition.Options
            ?.Select(option => new FinanceScenarioOptionViewModel(option, OnOptionChanged))
            .ToList() ?? new List<FinanceScenarioOptionViewModel>();

        _options = new ReadOnlyCollection<FinanceScenarioOptionViewModel>(options);
        _saveCommand = new AsyncRelayCommand(SaveAsync, () => IsDirty && !IsSaving);
        _resetCommand = new RelayCommand(_ => Reset(), _ => IsDirty && !IsSaving);
    }

    public IReadOnlyList<FinanceScenarioOptionViewModel> Options => _options;

    public string SummaryLabel => _definition.SummaryLabel;

    public string SummaryValue => string.Format(
        CultureInfo.InvariantCulture,
        _definition.SummaryFormat,
        TotalImpact,
        SelectedCount);

    public string CommitLabel => _definition.CommitLabel;

    public string ResetLabel => _definition.ResetLabel;

    public double TotalImpact => _options.Sum(option => option.IsSelected ? option.Impact : 0d);

    public int SelectedCount => _options.Count(option => option.IsSelected);

    public bool IsDirty => _options.Any(option => option.IsDirty);

    public bool IsSaving
    {
        get => _isSaving;
        private set
        {
            if (SetProperty(ref _isSaving, value))
            {
                _saveCommand.RaiseCanExecuteChanged();
                _resetCommand.RaiseCanExecuteChanged();
                OnPropertyChanged(nameof(CanSave));
            }
        }
    }

    public string? StatusMessage
    {
        get => _statusMessage;
        private set
        {
            if (SetProperty(ref _statusMessage, value))
            {
                OnPropertyChanged(nameof(HasStatusMessage));
            }
        }
    }

    public bool HasStatusMessage => !string.IsNullOrWhiteSpace(StatusMessage);

    public ICommand SaveCommand => _saveCommand;

    public ICommand ResetCommand => _resetCommand;

    public bool CanSave => IsDirty && !IsSaving;

    private void OnOptionChanged()
    {
        OnPropertyChanged(nameof(TotalImpact));
        OnPropertyChanged(nameof(SelectedCount));
        OnPropertyChanged(nameof(SummaryValue));
        OnPropertyChanged(nameof(IsDirty));
        _saveCommand.RaiseCanExecuteChanged();
        _resetCommand.RaiseCanExecuteChanged();
        StatusMessage = null;
    }

    private async Task SaveAsync()
    {
        if (!IsDirty)
        {
            return;
        }

        try
        {
            IsSaving = true;
            StatusMessage = "Saving scenarios...";

            var snapshotOptions = _options.Select(option => option.CreateSnapshot()).ToList();

            await _clubDataService.UpdateAsync(snapshot =>
            {
                var finance = snapshot.Finance;
                var summary = finance.Summary;
                var scenario = summary.ScenarioBoard with { Options = snapshotOptions };
                var updatedSummary = summary with { ScenarioBoard = scenario };
                var updatedFinance = finance with { Summary = updatedSummary };
                return snapshot with { Finance = updatedFinance };
            }).ConfigureAwait(true);

            foreach (var option in _options)
            {
                option.Commit();
            }

            _definition = _definition with { Options = snapshotOptions.Select(MapDefinition).ToList() };
            StatusMessage = "Scenario saved";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Unable to save scenarios: {ex.Message}";
        }
        finally
        {
            IsSaving = false;
        }

        OnPropertyChanged(nameof(IsDirty));
        _saveCommand.RaiseCanExecuteChanged();
        _resetCommand.RaiseCanExecuteChanged();
    }

    private void Reset()
    {
        foreach (var option in _options)
        {
            option.Reset();
        }

        StatusMessage = "Changes reverted";
        OnPropertyChanged(nameof(TotalImpact));
        OnPropertyChanged(nameof(SelectedCount));
        OnPropertyChanged(nameof(SummaryValue));
        OnPropertyChanged(nameof(IsDirty));
        _saveCommand.RaiseCanExecuteChanged();
        _resetCommand.RaiseCanExecuteChanged();
    }

    private static FinanceScenarioOptionDefinition MapDefinition(FinanceScenarioOptionSnapshot snapshot)
    {
        return new FinanceScenarioOptionDefinition(
            snapshot.Id,
            snapshot.Title,
            snapshot.Detail,
            snapshot.Impact,
            snapshot.Format,
            snapshot.IsSelected,
            snapshot.Accent);
    }
}

public sealed class FinanceScenarioOptionViewModel : ObservableObject
{
    private readonly Action _changed;
    private bool _isSelected;
    private bool _baselineSelected;

    internal FinanceScenarioOptionViewModel(FinanceScenarioOptionDefinition definition, Action changed)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        _changed = changed ?? throw new ArgumentNullException(nameof(changed));
        Id = definition.Id;
        Title = definition.Title;
        Detail = definition.Detail;
        Impact = definition.Impact;
        Format = definition.Format;
        Accent = definition.Accent;
        _isSelected = definition.IsSelected;
        _baselineSelected = definition.IsSelected;
    }

    public string Id { get; }

    public string Title { get; }

    public string Detail { get; }

    public double Impact { get; }

    public string Format { get; }

    public string? Accent { get; }

    public bool IsSelected
    {
        get => _isSelected;
        set
        {
            if (SetProperty(ref _isSelected, value))
            {
                OnPropertyChanged(nameof(DisplayImpact));
                OnPropertyChanged(nameof(IsDirty));
                _changed();
            }
        }
    }

    public string DisplayImpact => string.Format(CultureInfo.InvariantCulture, Format, Impact);

    public bool IsDirty => _isSelected != _baselineSelected;

    public void Reset()
    {
        IsSelected = _baselineSelected;
    }

    public void Commit()
    {
        _baselineSelected = _isSelected;
        OnPropertyChanged(nameof(IsDirty));
    }

    public FinanceScenarioOptionSnapshot CreateSnapshot()
    {
        return new FinanceScenarioOptionSnapshot(
            Id,
            Title,
            Detail,
            Impact,
            Format,
            IsSelected,
            Accent);
    }
}
