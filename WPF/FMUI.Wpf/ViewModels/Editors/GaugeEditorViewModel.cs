using System;
using System.Threading.Tasks;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class GaugeEditorViewModel : CardEditorViewModel
{
    private readonly Func<GaugeSnapshot, Task> _persistAsync;
    private readonly GaugeSnapshot _original;
    private double _value;
    private double _target;
    private string _displayValue;
    private string _summary;
    private string? _pill;

    public GaugeEditorViewModel(
        string title,
        string? subtitle,
        GaugeSnapshot gauge,
        Func<GaugeSnapshot, Task> persistAsync)
        : base(title, subtitle)
    {
        _original = gauge;
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));
        _value = gauge.Value;
        _target = gauge.Target;
        _displayValue = gauge.Metric.Value;
        _summary = gauge.Metric.Summary;
        _pill = gauge.Metric.Pill;
    }

    public double Minimum => _original.Minimum;

    public double Maximum => _original.Maximum;

    public string Unit => _original.Unit;

    public double Value
    {
        get => _value;
        set
        {
            if (SetProperty(ref _value, value))
            {
                NotifyCanSaveChanged();
            }
        }
    }

    public double Target
    {
        get => _target;
        set
        {
            if (SetProperty(ref _target, value))
            {
                NotifyCanSaveChanged();
            }
        }
    }

    public string DisplayValue
    {
        get => _displayValue;
        set
        {
            if (SetProperty(ref _displayValue, value ?? string.Empty))
            {
                NotifyCanSaveChanged();
            }
        }
    }

    public string Summary
    {
        get => _summary;
        set
        {
            if (SetProperty(ref _summary, value ?? string.Empty))
            {
                NotifyCanSaveChanged();
            }
        }
    }

    public string? Pill
    {
        get => _pill;
        set
        {
            if (SetProperty(ref _pill, value))
            {
                NotifyCanSaveChanged();
            }
        }
    }

    protected override bool CanSave
    {
        get
        {
            if (double.IsNaN(Value) || double.IsNaN(Target))
            {
                return false;
            }

            if (Value < Minimum || Value > Maximum)
            {
                return false;
            }

            if (Target < Minimum || Target > Maximum)
            {
                return false;
            }

            return !string.IsNullOrWhiteSpace(DisplayValue);
        }
    }

    protected override async Task PersistAsync()
    {
        var clampedValue = Math.Clamp(Value, Minimum, Maximum);
        var clampedTarget = Math.Clamp(Target, Minimum, Maximum);
        var metric = new MetricSnapshot(
            string.IsNullOrWhiteSpace(DisplayValue) ? $"{clampedValue:0.#}{Unit}" : DisplayValue.Trim(),
            Summary?.Trim() ?? string.Empty,
            string.IsNullOrWhiteSpace(Pill) ? null : Pill.Trim());

        var updated = _original with
        {
            Value = clampedValue,
            Target = clampedTarget,
            Metric = metric
        };

        await _persistAsync(updated).ConfigureAwait(false);
    }
}
