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

public sealed class FinanceBudgetAllocatorViewModel : ObservableObject
{
    private readonly IClubDataService _clubDataService;
    private FinanceBudgetAllocatorDefinition _definition;
    private readonly ReadOnlyCollection<FinanceBudgetAllocationLineViewModel> _lines;
    private readonly AsyncRelayCommand _saveCommand;
    private readonly RelayCommand _resetCommand;
    private bool _isSaving;
    private string? _statusMessage;

    public FinanceBudgetAllocatorViewModel(FinanceBudgetAllocatorDefinition definition, IClubDataService clubDataService)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));

        var lines = definition.Lines
            ?.Select(line => new FinanceBudgetAllocationLineViewModel(line, OnLineChanged))
            .ToList() ?? new List<FinanceBudgetAllocationLineViewModel>();

        _lines = new ReadOnlyCollection<FinanceBudgetAllocationLineViewModel>(lines);
        _saveCommand = new AsyncRelayCommand(SaveAsync, () => IsDirty && !IsSaving);
        _resetCommand = new RelayCommand(_ => Reset(), _ => IsDirty && !IsSaving);
    }

    public IReadOnlyList<FinanceBudgetAllocationLineViewModel> Lines => _lines;

    public string SummaryText => string.Format(
        CultureInfo.InvariantCulture,
        _definition.SummaryFormat,
        Remaining,
        TotalBaseline);

    public string CommitLabel => _definition.CommitLabel;

    public string ResetLabel => _definition.ResetLabel;

    public double TotalBaseline => _lines.Sum(line => line.Baseline);

    public double TotalValue => _lines.Sum(line => line.Value);

    public double Remaining => TotalBaseline - TotalValue;

    public bool IsDirty => _lines.Any(line => line.IsDirty);

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

    private void OnLineChanged()
    {
        OnPropertyChanged(nameof(SummaryText));
        OnPropertyChanged(nameof(TotalValue));
        OnPropertyChanged(nameof(Remaining));
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
            StatusMessage = "Saving budget allocations...";

            var updatedLines = _lines
                .Select(line => line.CreateSnapshot())
                .ToList();

            await _clubDataService.UpdateAsync(snapshot =>
            {
                var finance = snapshot.Finance;
                var summary = finance.Summary;
                var allocator = summary.BudgetAllocator with { Lines = updatedLines };
                var updatedSummary = summary with { BudgetAllocator = allocator };
                var updatedFinance = finance with { Summary = updatedSummary };
                return snapshot with { Finance = updatedFinance };
            }).ConfigureAwait(true);

            foreach (var line in _lines)
            {
                line.Commit();
            }

            _definition = _definition with { Lines = updatedLines.Select(MapDefinition).ToList() };

            StatusMessage = "Budget allocation saved";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Unable to save budget allocation: {ex.Message}";
        }
        finally
        {
            IsSaving = false;
        }

        OnPropertyChanged(nameof(IsDirty));
        OnPropertyChanged(nameof(SummaryText));
        OnPropertyChanged(nameof(Remaining));
        OnPropertyChanged(nameof(TotalValue));
        _saveCommand.RaiseCanExecuteChanged();
        _resetCommand.RaiseCanExecuteChanged();
    }

    private void Reset()
    {
        foreach (var line in _lines)
        {
            line.Reset();
        }

        StatusMessage = "Changes reverted";
        OnPropertyChanged(nameof(SummaryText));
        OnPropertyChanged(nameof(Remaining));
        OnPropertyChanged(nameof(TotalValue));
        OnPropertyChanged(nameof(IsDirty));
        _saveCommand.RaiseCanExecuteChanged();
        _resetCommand.RaiseCanExecuteChanged();
    }

    private static FinanceBudgetAllocationLineDefinition MapDefinition(FinanceBudgetAllocationLineSnapshot snapshot)
    {
        return new FinanceBudgetAllocationLineDefinition(
            snapshot.Id,
            snapshot.Label,
            snapshot.Description,
            snapshot.Minimum,
            snapshot.Maximum,
            snapshot.Step,
            snapshot.Value,
            snapshot.Baseline,
            snapshot.Format,
            snapshot.Accent);
    }
}

public sealed class FinanceBudgetAllocationLineViewModel : ObservableObject
{
    private readonly Action _changed;
    private double _value;
    private double _baseline;

    internal FinanceBudgetAllocationLineViewModel(FinanceBudgetAllocationLineDefinition definition, Action changed)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        _changed = changed ?? throw new ArgumentNullException(nameof(changed));
        Id = definition.Id;
        Label = definition.Label;
        Description = definition.Description;
        Minimum = definition.Minimum;
        Maximum = definition.Maximum;
        Step = definition.Step;
        _value = definition.Value;
        _baseline = definition.Baseline;
        Format = definition.Format;
        Accent = definition.Accent;
    }

    public string Id { get; }

    public string Label { get; }

    public string? Description { get; }

    public double Minimum { get; }

    public double Maximum { get; }

    public double Step { get; }

    public double TickFrequency
    {
        get
        {
            if (Step > 0)
            {
                return Step;
            }

            var range = Maximum - Minimum;
            return range <= 0 ? 1 : Math.Max(range / 20d, 1d);
        }
    }

    public bool UseTicks => Step > 0;

    public string Format { get; }

    public string? Accent { get; }

    public double Baseline => _baseline;

    public double Value
    {
        get => _value;
        set
        {
            var clamped = Math.Clamp(value, Minimum, Maximum);
            if (SetProperty(ref _value, clamped))
            {
                OnPropertyChanged(nameof(DisplayValue));
                OnPropertyChanged(nameof(IsDirty));
                _changed();
            }
        }
    }

    public string DisplayValue => string.Format(CultureInfo.InvariantCulture, Format, Value);

    public string RangeDisplay => string.Format(
        CultureInfo.InvariantCulture,
        "{0} – {1}",
        string.Format(CultureInfo.InvariantCulture, Format, Minimum),
        string.Format(CultureInfo.InvariantCulture, Format, Maximum));

    public bool IsDirty => !AreClose(Value, _baseline);

    public void Reset()
    {
        Value = _baseline;
    }

    public void Commit()
    {
        _baseline = _value;
        OnPropertyChanged(nameof(IsDirty));
    }

    public FinanceBudgetAllocationLineSnapshot CreateSnapshot()
    {
        return new FinanceBudgetAllocationLineSnapshot(
            Id,
            Label,
            Description,
            Minimum,
            Maximum,
            Step,
            Value,
            _baseline,
            Format,
            Accent);
    }

    private static bool AreClose(double x, double y) => Math.Abs(x - y) < 0.0001;
}
