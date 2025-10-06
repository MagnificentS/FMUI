using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using FMUI.Wpf.Controls;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed class LineChartCardContent : ICardContent
{
    private readonly Grid _root;
    private readonly TextBlock _metricValue;
    private readonly TextBlock _metricLabel;
    private readonly LineChartControl _chart;
    private ChartSeriesViewModel[]? _series;
    private IReadOnlyList<ChartSeriesDefinition>? _source;

    public LineChartCardContent()
    {
        _metricValue = new TextBlock();
        _metricValue.SetResourceReference(FrameworkElement.StyleProperty, "CardMetricValueTextStyle");

        _metricLabel = new TextBlock { Margin = new Thickness(12, 16, 0, 0) };
        _metricLabel.SetResourceReference(FrameworkElement.StyleProperty, "CardMetricLabelTextStyle");

        var header = new StackPanel
        {
            Orientation = Orientation.Horizontal,
            Margin = new Thickness(0, 0, 0, 12)
        };
        header.Children.Add(_metricValue);
        header.Children.Add(_metricLabel);

        _chart = new LineChartControl
        {
            MinHeight = 180,
            Margin = new Thickness(0, 0, 0, 8)
        };

        _root = new Grid();
        _root.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
        _root.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
        _root.Children.Add(header);
        Grid.SetRow(_chart, 1);
        _root.Children.Add(_chart);
    }

    public CardType Type => CardType.LineChart;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        Update(context);
    }

    public void Update(in CardContentContext context)
    {
        _metricValue.Text = context.Definition.MetricValue ?? string.Empty;
        _metricLabel.Text = context.Definition.MetricLabel ?? string.Empty;

        var hasLabel = !string.IsNullOrWhiteSpace(_metricLabel.Text);
        _metricLabel.Visibility = hasLabel ? Visibility.Visible : Visibility.Collapsed;

        var seriesDefinitions = context.Definition.ChartSeries;
        if (seriesDefinitions is null || seriesDefinitions.Count == 0)
        {
            _chart.Series = null;
            return;
        }

        if (!ReferenceEquals(_source, seriesDefinitions))
        {
            _source = seriesDefinitions;
            AllocateSeries(seriesDefinitions);
        }

        _chart.Series = _series;
    }

    public void Detach()
    {
    }

    public void Reset()
    {
        _metricValue.Text = string.Empty;
        _metricLabel.Text = string.Empty;
        _metricLabel.Visibility = Visibility.Collapsed;
        _chart.Series = null;
        _source = null;
        _series = null;
    }

    private void AllocateSeries(IReadOnlyList<ChartSeriesDefinition> definitions)
    {
        if (definitions.Count == 0)
        {
            _series = Array.Empty<ChartSeriesViewModel>();
            return;
        }

        var series = new ChartSeriesViewModel[definitions.Count];
        for (int i = 0; i < definitions.Count; i++)
        {
            series[i] = new ChartSeriesViewModel(definitions[i]);
        }

        _series = series;
    }
}
