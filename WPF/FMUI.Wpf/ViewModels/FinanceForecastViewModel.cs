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

public sealed class FinanceForecastViewModel : ObservableObject
{
    private readonly IClubDataService _clubDataService;
    private FinanceForecastDefinition _definition;
    private readonly ReadOnlyCollection<FinanceForecastImpactItemViewModel> _impacts;
    private readonly AsyncRelayCommand _saveCommand;
    private double _value;
    private double _baseline;
    private bool _isSaving;
    private string? _statusMessage;

    public FinanceForecastViewModel(FinanceForecastDefinition definition, IClubDataService clubDataService)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _value = definition.Value;
        _baseline = definition.Value;
        var impacts = new List<FinanceForecastImpactItemViewModel>(definition.Impacts.Count);
        foreach (var impact in definition.Impacts)
        {
            impacts.Add(new FinanceForecastImpactItemViewModel(impact, _baseline));
        }

        _impacts = new ReadOnlyCollection<FinanceForecastImpactItemViewModel>(impacts);
        UpdateImpacts();
        _saveCommand = new AsyncRelayCommand(SaveAsync, () => IsDirty && !_isSaving);
    }

    public string SliderLabel => _definition.SliderLabel;

    public double Minimum => _definition.Minimum;

    public double Maximum => _definition.Maximum;

    public double Step => _definition.Step;

    public bool UseTicks => Step > 0;

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

    public double Value
    {
        get => _value;
        set
        {
            if (value < Minimum)
            {
                value = Minimum;
            }
            else if (value > Maximum)
            {
                value = Maximum;
            }

            if (SetProperty(ref _value, value))
            {
                UpdateImpacts();
                OnPropertyChanged(nameof(ValueDisplay));
                OnPropertyChanged(nameof(IsDirty));
                OnPropertyChanged(nameof(SummaryValue));
                StatusMessage = null;
                _saveCommand.RaiseCanExecuteChanged();
                OnPropertyChanged(nameof(CanSave));
            }
        }
    }

    public string ValueDisplay => string.Format(CultureInfo.InvariantCulture, _definition.ValueDisplayFormat, Value);

    public string SummaryLabel => _definition.SummaryLabel;

    public string SummaryValue => _impacts.Count > 0 ? _impacts[0].DisplayValue : string.Empty;

    public IReadOnlyList<FinanceForecastImpactItemViewModel> Impacts => _impacts;

    public bool IsDirty => !AreClose(_value, _baseline);

    public bool IsSaving
    {
        get => _isSaving;
        private set
        {
            if (SetProperty(ref _isSaving, value))
            {
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

    public bool CanSave => IsDirty && !IsSaving;

    private static bool AreClose(double x, double y) => Math.Abs(x - y) < 0.0001;

    private void UpdateImpacts()
    {
        foreach (var impact in _impacts)
        {
            impact.Update(Value, _baseline);
        }

        OnPropertyChanged(nameof(SummaryValue));
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
            StatusMessage = "Saving forecast...";

            var updatedImpacts = _impacts
                .Select(impact => impact.CreateSnapshot())
                .ToList();

            var newValue = Value;

            await _clubDataService.UpdateAsync(snapshot =>
            {
                var finance = snapshot.Finance;
                var summary = finance.Summary;
                var forecast = summary.Forecast;
                var updatedForecast = forecast with
                {
                    CurrentPercentage = newValue,
                    Impacts = updatedImpacts
                };

                var updatedSummary = summary with { Forecast = updatedForecast };
                var updatedFinance = finance with { Summary = updatedSummary };
                return snapshot with { Finance = updatedFinance };
            }).ConfigureAwait(true);

            foreach (var impact in _impacts)
            {
                impact.Commit();
            }

            _definition = _definition with { Value = newValue };
            _baseline = newValue;

            OnPropertyChanged(nameof(IsDirty));
            OnPropertyChanged(nameof(CanSave));
            _saveCommand.RaiseCanExecuteChanged();
            StatusMessage = "Forecast saved";
        }
        catch (Exception ex)
        {
            StatusMessage = $"Unable to save forecast: {ex.Message}";
        }
        finally
        {
            IsSaving = false;
            _saveCommand.RaiseCanExecuteChanged();
            OnPropertyChanged(nameof(CanSave));
        }
    }
}

public sealed class FinanceForecastImpactItemViewModel : ObservableObject
{
    private readonly FinanceForecastImpactDefinition _definition;
    private double _baseValue;
    private double _currentValue;
    private string _displayValue = string.Empty;

    public FinanceForecastImpactItemViewModel(FinanceForecastImpactDefinition definition, double baseline)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        _baseValue = definition.BaseValue;
        Update(baseline, baseline);
    }

    public string Label => _definition.Label;

    public string DisplayValue
    {
        get => _displayValue;
        private set => SetProperty(ref _displayValue, value);
    }

    public double CurrentValue
    {
        get => _currentValue;
        private set => SetProperty(ref _currentValue, value);
    }

    public void Update(double sliderValue, double baseline)
    {
        var delta = sliderValue - baseline;
        var value = _baseValue + (delta * _definition.Sensitivity);
        CurrentValue = value;
        DisplayValue = string.Format(CultureInfo.InvariantCulture, _definition.Format, value);
    }

    public FinanceForecastImpactSnapshot CreateSnapshot()
    {
        return new FinanceForecastImpactSnapshot(
            _definition.Label,
            _definition.Format,
            CurrentValue,
            _definition.Sensitivity);
    }

    public void Commit()
    {
        _baseValue = CurrentValue;
    }
}
