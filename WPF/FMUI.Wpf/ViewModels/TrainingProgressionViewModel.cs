using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Media;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class TrainingProgressionViewModel
{
    public TrainingProgressionViewModel(TrainingProgressionDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Periods = new ReadOnlyCollection<string>(definition.Periods?.ToList() ?? new List<string>());
        Minimum = definition.Minimum;
        Maximum = definition.Maximum;
        Summary = definition.Summary;

        var series = new List<TrainingProgressionSeriesViewModel>();
        var chartSeries = new List<ChartSeriesViewModel>();

        if (definition.Series is { Count: > 0 })
        {
            foreach (var seriesDefinition in definition.Series)
            {
                var viewModel = new TrainingProgressionSeriesViewModel(seriesDefinition);
                series.Add(viewModel);
                chartSeries.Add(viewModel.ChartSeries);
            }
        }

        Series = new ReadOnlyCollection<TrainingProgressionSeriesViewModel>(series);
        ChartSeries = new ReadOnlyCollection<ChartSeriesViewModel>(chartSeries);
    }

    public IReadOnlyList<string> Periods { get; }

    public double Minimum { get; }

    public double Maximum { get; }

    public string? Summary { get; }

    public IReadOnlyList<TrainingProgressionSeriesViewModel> Series { get; }

    public IReadOnlyList<ChartSeriesViewModel> ChartSeries { get; }

    public bool HasSeries => Series.Count > 0;
}

public sealed class TrainingProgressionSeriesViewModel
{
    private static readonly Brush DefaultStroke = BrushUtilities.CreateFrozenBrush("#3E8EF7");
    private readonly TrainingProgressionSeriesDefinition _definition;

    public TrainingProgressionSeriesViewModel(TrainingProgressionSeriesDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));

        var points = definition.Points is { Count: > 0 }
            ? definition.Points.Select(point => new TrainingProgressionPointViewModel(point)).ToList()
            : new List<TrainingProgressionPointViewModel>();

        Points = new ReadOnlyCollection<TrainingProgressionPointViewModel>(points);

        var chartPoints = points.Select(point => new ChartDataPointDefinition(point.Period, point.Value)).ToList();
        var chartDefinition = new ChartSeriesDefinition(definition.Name, definition.Color, chartPoints);
        ChartSeries = new ChartSeriesViewModel(chartDefinition);
        Stroke = BrushUtilities.CreateFrozenBrush(definition.Color, DefaultStroke);
    }

    public string Id => _definition.Id;

    public string Name => _definition.Name;

    public string Color => _definition.Color;

    public string? Accent => _definition.Accent;

    public bool IsHighlighted => _definition.IsHighlighted;

    public IReadOnlyList<TrainingProgressionPointViewModel> Points { get; }

    public ChartSeriesViewModel ChartSeries { get; }

    public Brush Stroke { get; }

    public TrainingProgressionPointViewModel? LatestPoint => Points.Count > 0 ? Points[^1] : null;

    public string LatestValueDisplay => LatestPoint is null ? "—" : FormatValue(LatestPoint.Value);

    public string? LatestDetail => LatestPoint?.Detail;

    public bool HasLatestDetail => !string.IsNullOrWhiteSpace(LatestDetail);

    private static string FormatValue(double value)
    {
        return value.ToString(value >= 0 ? "+0.0" : "-0.0");
    }
}

public sealed class TrainingProgressionPointViewModel
{
    private readonly TrainingProgressionPointDefinition _definition;

    public TrainingProgressionPointViewModel(TrainingProgressionPointDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
    }

    public string Period => _definition.Period;

    public double Value => _definition.Value;

    public string DisplayValue => Value.ToString("0.0");

    public string? Detail => _definition.Detail;
}
