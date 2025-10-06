using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public sealed class TimelineCardContent : ICardContent
{
    private readonly Border _root;
    private readonly StackPanel _itemsHost;
    private TimelineRow[] _rows;
    private int _rowsLength;
    private readonly Brush _labelBrush;
    private readonly Brush _detailBrush;
    private readonly Brush _pillForeground;
    private readonly SolidColorBrush _defaultPillBackground;

    public TimelineCardContent()
    {
        _labelBrush = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _detailBrush = (Brush)Application.Current.FindResource("NeutralTextBrush");
        _pillForeground = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _defaultPillBackground = new SolidColorBrush(Color.FromRgb(0x24, 0x39, 0x52));

        _itemsHost = new StackPanel
        {
            Orientation = Orientation.Vertical,
            Margin = new Thickness(0)
        };

        _root = new Border
        {
            Background = Brushes.Transparent,
            Child = _itemsHost,
            Visibility = Visibility.Collapsed
        };

        _rows = Array.Empty<TimelineRow>();
        _rowsLength = 0;
    }

    public CardType Type => CardType.Timeline;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var timeline = context.Definition.Timeline;
        var count = timeline?.Count ?? 0;

        if (count == 0)
        {
            SetActiveRowCount(0);
            _root.Visibility = Visibility.Collapsed;
            return;
        }

        _root.Visibility = Visibility.Visible;
        EnsureRowCapacity(count);
        SetActiveRowCount(count);

        for (int i = 0; i < count; i++)
        {
            var entry = timeline![i];
            _rows[i].Update(entry, _labelBrush, _detailBrush, _pillForeground, _defaultPillBackground);
        }
    }

    public void Detach()
    {
        // no-op
    }

    public void Reset()
    {
        for (int i = 0; i < _rowsLength; i++)
        {
            _rows[i].Reset();
        }

        _root.Visibility = Visibility.Collapsed;
    }

    private void EnsureRowCapacity(int required)
    {
        if (_rowsLength >= required)
        {
            return;
        }

        var newLength = _rowsLength == 0 ? 4 : _rowsLength;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newRows = new TimelineRow[newLength];
        for (int i = 0; i < _rowsLength; i++)
        {
            newRows[i] = _rows[i];
        }

        for (int i = _rowsLength; i < newLength; i++)
        {
            var row = new TimelineRow();
            newRows[i] = row;
            _itemsHost.Children.Add(row.View);
        }

        _rows = newRows;
        _rowsLength = newLength;
    }

    private void SetActiveRowCount(int count)
    {
        for (int i = 0; i < _rowsLength; i++)
        {
            var isActive = i < count;
            _rows[i].SetActive(isActive);
        }
    }

    private sealed class TimelineRow
    {
        private readonly Grid _root;
        private readonly Border _bullet;
        private readonly Border _line;
        private readonly TextBlock _label;
        private readonly TextBlock _detail;
        private readonly Border _pillContainer;
        private readonly TextBlock _pillText;
        private readonly SolidColorBrush _pillBackground;

        public TimelineRow()
        {
            _root = new Grid
            {
                Margin = new Thickness(0, 6, 0, 6)
            };

            _root.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(24) });
            _root.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
            _root.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });

            _line = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x24, 0x39, 0x52)),
                Width = 2,
                HorizontalAlignment = HorizontalAlignment.Center,
                Margin = new Thickness(0, 4, 0, 4)
            };

            Grid.SetColumn(_line, 0);
            Grid.SetRowSpan(_line, 2);
            _root.Children.Add(_line);

            _bullet = new Border
            {
                Width = 10,
                Height = 10,
                CornerRadius = new CornerRadius(5),
                Background = new SolidColorBrush(Color.FromRgb(0x2E, 0xC4, 0xB6)),
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };

            Grid.SetColumn(_bullet, 0);
            _root.Children.Add(_bullet);

            _label = new TextBlock
            {
                FontSize = 14,
                FontWeight = FontWeights.SemiBold,
                TextTrimming = TextTrimming.CharacterEllipsis,
                Margin = new Thickness(12, 0, 0, 0)
            };
            Grid.SetColumn(_label, 1);
            Grid.SetColumnSpan(_label, 2);
            _root.Children.Add(_label);

            var detailsPanel = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                Margin = new Thickness(12, 4, 0, 0)
            };

            _detail = new TextBlock
            {
                FontSize = 12,
                TextTrimming = TextTrimming.CharacterEllipsis,
                Margin = new Thickness(0, 0, 8, 0),
                Visibility = Visibility.Collapsed
            };

            _pillText = new TextBlock
            {
                FontSize = 11,
                FontWeight = FontWeights.SemiBold,
                Foreground = Brushes.White
            };

            _pillBackground = new SolidColorBrush(Color.FromRgb(0x2E, 0xC4, 0xB6));

            _pillContainer = new Border
            {
                Background = _pillBackground,
                CornerRadius = new CornerRadius(10),
                Padding = new Thickness(8, 2, 8, 2),
                Child = _pillText,
                Visibility = Visibility.Collapsed
            };

            detailsPanel.Children.Add(_detail);
            detailsPanel.Children.Add(_pillContainer);

            Grid.SetColumn(detailsPanel, 1);
            Grid.SetColumnSpan(detailsPanel, 2);
            Grid.SetRow(detailsPanel, 1);
            _root.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            _root.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            _root.Children.Add(detailsPanel);
        }

        public FrameworkElement View => _root;

        public void Update(
            TimelineEntryDefinition entry,
            Brush labelBrush,
            Brush detailBrush,
            Brush pillForeground,
            SolidColorBrush defaultPillBackground)
        {
            _label.Text = entry.Label ?? string.Empty;
            _label.Foreground = labelBrush;

            if (!string.IsNullOrEmpty(entry.Detail))
            {
                _detail.Text = entry.Detail!;
                _detail.Foreground = detailBrush;
                _detail.Visibility = Visibility.Visible;
            }
            else
            {
                _detail.Text = string.Empty;
                _detail.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrEmpty(entry.Pill))
            {
                _pillText.Text = entry.Pill!;
                _pillText.Foreground = pillForeground;
                UpdateAccent(entry.Accent, defaultPillBackground);
                _pillContainer.Visibility = Visibility.Visible;
            }
            else
            {
                _pillText.Text = string.Empty;
                _pillContainer.Visibility = Visibility.Collapsed;
            }
        }

        public void Reset()
        {
            _label.Text = string.Empty;
            _detail.Text = string.Empty;
            _detail.Visibility = Visibility.Collapsed;
            _pillText.Text = string.Empty;
            _pillContainer.Visibility = Visibility.Collapsed;
        }

        public void SetActive(bool isActive)
        {
            _root.Visibility = isActive ? Visibility.Visible : Visibility.Collapsed;
            if (!isActive)
            {
                Reset();
            }
        }

        private void UpdateAccent(string? accent, SolidColorBrush defaultBackground)
        {
            if (CardColorParser.TryParse(accent, out var color))
            {
                _pillBackground.Color = color;
                return;
            }

            _pillBackground.Color = defaultBackground.Color;
        }
    }
}
