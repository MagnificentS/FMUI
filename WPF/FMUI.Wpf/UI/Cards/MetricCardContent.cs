using System.Windows;
using System.Windows.Controls;

namespace FMUI.Wpf.UI.Cards;

public sealed class MetricCardContent : ICardContent
{
    private readonly StackPanel _root;
    private readonly TextBlock _metricValue;
    private readonly TextBlock _metricLabel;
    private readonly ToolTip _toolTip;
    private readonly TextBlock _toolTipText;
    private bool _hasTooltip;

    public MetricCardContent()
    {
        _metricValue = new TextBlock();
        _metricLabel = new TextBlock { Margin = new Thickness(0, 8, 0, 0) };
        _toolTipText = new TextBlock
        {
            TextWrapping = TextWrapping.Wrap,
            MaxWidth = 280d
        };

        _toolTip = new ToolTip
        {
            Content = _toolTipText
        };

        if (Application.Current.TryFindResource("CardToolTipStyle") is Style toolTipStyle)
        {
            _toolTip.Style = toolTipStyle;
        }

        if (Application.Current.TryFindResource("CardMetricValueTextStyle") is Style valueStyle)
        {
            _metricValue.Style = valueStyle;
        }

        if (Application.Current.TryFindResource("CardMetricLabelTextStyle") is Style labelStyle)
        {
            _metricLabel.Style = labelStyle;
        }

        _root = new StackPanel();
        ToolTipService.SetInitialShowDelay(_root, 250);
        ToolTipService.SetShowDuration(_root, 8000);
        ToolTipService.SetIsEnabled(_root, false);
        _root.Children.Add(_metricValue);
        _root.Children.Add(_metricLabel);
    }

    public CardType Type => CardType.Metric;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var definition = context.Definition;

        _metricValue.Text = definition.MetricValue ?? string.Empty;
        _metricLabel.Text = definition.MetricLabel ?? string.Empty;

        var description = definition.Description;
        if (!string.IsNullOrEmpty(description))
        {
            _toolTipText.Text = description;
            _root.ToolTip = _toolTip;
            ToolTipService.SetIsEnabled(_root, true);
            _hasTooltip = true;
        }
        else if (_hasTooltip)
        {
            _toolTipText.Text = string.Empty;
            _root.ToolTip = null;
            ToolTipService.SetIsEnabled(_root, false);
            _hasTooltip = false;
        }
    }

    public void Detach()
    {
        if (!_hasTooltip)
        {
            return;
        }

        _toolTip.IsOpen = false;
    }

    public void Reset()
    {
        _metricValue.Text = string.Empty;
        _metricLabel.Text = string.Empty;
        if (_hasTooltip)
        {
            _toolTipText.Text = string.Empty;
            _root.ToolTip = null;
            ToolTipService.SetIsEnabled(_root, false);
            _hasTooltip = false;
        }
    }
}
