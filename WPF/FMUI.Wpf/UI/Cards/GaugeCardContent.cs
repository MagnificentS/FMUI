using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Controls;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed class GaugeCardContent : ICardContent
{
    private readonly Grid _root;
    private readonly RadialGaugeControl _gauge;
    private readonly TextBlock _summaryText;
    private readonly ListCardContent _supportingList;
    private GaugeDefinition? _sourceDefinition;
    private GaugeViewModel? _viewModel;

    public GaugeCardContent()
    {
        _gauge = new RadialGaugeControl
        {
            Margin = new Thickness(0, 0, 18, 0),
            MinHeight = 220
        };

        _summaryText = new TextBlock
        {
            Foreground = (Brush)Application.Current.FindResource("NeutralTextBrush"),
            FontSize = 13,
            TextWrapping = TextWrapping.Wrap,
            Margin = new Thickness(0, 0, 0, 12),
            Visibility = Visibility.Collapsed
        };

        _supportingList = new ListCardContent();
        _supportingList.View.Margin = new Thickness(0);

        var sidebar = new StackPanel
        {
            VerticalAlignment = VerticalAlignment.Center
        };
        sidebar.Children.Add(_summaryText);
        sidebar.Children.Add(_supportingList.View);

        _root = new Grid();
        _root.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(2, GridUnitType.Star) });
        _root.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
        _root.Children.Add(_gauge);
        Grid.SetColumn(sidebar, 1);
        _root.Children.Add(sidebar);
    }

    public CardType Type => CardType.Gauge;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        _supportingList.Attach(context);
        Update(context);
    }

    public void Update(in CardContentContext context)
    {
        var definition = context.Definition.Gauge;
        if (definition is null)
        {
            _gauge.Gauge = null;
            _summaryText.Visibility = Visibility.Collapsed;
            _supportingList.Reset();
            return;
        }

        if (!ReferenceEquals(_sourceDefinition, definition))
        {
            _sourceDefinition = definition;
            _viewModel = new GaugeViewModel(definition);
        }

        _gauge.Gauge = _viewModel;
        _gauge.DisplayValue = definition.Value;

        var summary = definition.DisplaySummary;
        if (string.IsNullOrWhiteSpace(summary))
        {
            _summaryText.Text = string.Empty;
            _summaryText.Visibility = Visibility.Collapsed;
        }
        else
        {
            _summaryText.Text = summary!;
            _summaryText.Visibility = Visibility.Visible;
        }

        _supportingList.Update(context);
    }

    public void Detach()
    {
        _supportingList.Detach();
    }

    public void Reset()
    {
        _gauge.Gauge = null;
        _sourceDefinition = null;
        _viewModel = null;
        _summaryText.Text = string.Empty;
        _summaryText.Visibility = Visibility.Collapsed;
        _supportingList.Reset();
    }
}
