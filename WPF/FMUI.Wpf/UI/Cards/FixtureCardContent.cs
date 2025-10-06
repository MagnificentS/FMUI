using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public sealed class FixtureCardContent : ICardContent
{
    private readonly StackPanel _root;
    private readonly Border _headlineBorder;
    private readonly TextBlock _headlineText;
    private readonly StackPanel _itemsHost;
    private FixtureRow[] _rows;
    private int _rowsLength;
    private readonly Brush _headlineBackground;
    private readonly Brush _primaryBrush;
    private readonly Brush _secondaryBrush;
    private readonly Brush _accentBrush;

    public FixtureCardContent()
    {
        _headlineBackground = new SolidColorBrush(Color.FromRgb(0x19, 0x20, 0x2E));
        _primaryBrush = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _secondaryBrush = (Brush)Application.Current.FindResource("NeutralTextBrush");
        _accentBrush = (Brush)Application.Current.FindResource("AccentPrimaryBrush");

        _headlineText = new TextBlock
        {
            FontSize = 20,
            FontWeight = FontWeights.SemiBold,
            Foreground = Brushes.White
        };

        var headlineStack = new StackPanel();
        headlineStack.Children.Add(_headlineText);

        _headlineBorder = new Border
        {
            Background = _headlineBackground,
            CornerRadius = new CornerRadius(14),
            Padding = new Thickness(16),
            Margin = new Thickness(0, 0, 0, 16),
            Child = headlineStack,
            Visibility = Visibility.Collapsed
        };

        _itemsHost = new StackPanel
        {
            Orientation = Orientation.Vertical
        };

        _root = new StackPanel();
        _root.Children.Add(_headlineBorder);
        _root.Children.Add(_itemsHost);

        _rows = Array.Empty<FixtureRow>();
        _rowsLength = 0;
    }

    public CardType Type => CardType.UpcomingFixtures;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var definition = context.Definition;
        var items = definition.ListItems;
        var count = items?.Count ?? 0;

        if (!string.IsNullOrEmpty(definition.Description))
        {
            _headlineText.Text = definition.Description!;
            _headlineBorder.Visibility = Visibility.Visible;
        }
        else
        {
            _headlineText.Text = string.Empty;
            _headlineBorder.Visibility = Visibility.Collapsed;
        }

        if (count == 0)
        {
            SetActiveRowCount(0);
            return;
        }

        EnsureRowCapacity(count);
        SetActiveRowCount(count);

        for (int i = 0; i < count; i++)
        {
            var item = items![i];
            _rows[i].Update(item, _primaryBrush, _secondaryBrush, _accentBrush);
        }
    }

    public void Detach()
    {
    }

    public void Reset()
    {
        _headlineText.Text = string.Empty;
        _headlineBorder.Visibility = Visibility.Collapsed;

        for (int i = 0; i < _rowsLength; i++)
        {
            _rows[i].Reset();
        }
    }

    private void EnsureRowCapacity(int required)
    {
        if (_rowsLength >= required)
        {
            return;
        }

        int newLength = _rowsLength == 0 ? 4 : _rowsLength;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newArray = new FixtureRow[newLength];
        for (int i = 0; i < _rowsLength; i++)
        {
            newArray[i] = _rows[i];
        }

        for (int i = _rowsLength; i < newLength; i++)
        {
            var row = new FixtureRow();
            newArray[i] = row;
            _itemsHost.Children.Add(row.View);
        }

        _rows = newArray;
        _rowsLength = newLength;
    }

    private void SetActiveRowCount(int active)
    {
        for (int i = 0; i < _rowsLength; i++)
        {
            var isActive = i < active;
            _rows[i].SetActive(isActive);
            if (!isActive)
            {
                _rows[i].Reset();
            }
        }
    }

    private sealed class FixtureRow
    {
        private static readonly Thickness AccentMargin = new(12, 0, 0, 0);
        private readonly Grid _grid;
        private readonly TextBlock _label;
        private readonly TextBlock _value;
        private readonly TextBlock _detail;
        private readonly Border _accentContainer;
        private readonly TextBlock _accentText;

        public FixtureRow()
        {
            _label = new TextBlock
            {
                FontSize = 13,
                Margin = new Thickness(0, 0, 0, 0)
            };

            _value = new TextBlock
            {
                FontSize = 14,
                FontWeight = FontWeights.SemiBold
            };

            _detail = new TextBlock
            {
                FontSize = 13,
                Margin = new Thickness(0, 2, 0, 0),
                Visibility = Visibility.Collapsed
            };

            _accentText = new TextBlock
            {
                FontSize = 11,
                FontWeight = FontWeights.SemiBold
            };

            _accentContainer = new Border
            {
                Background = new SolidColorBrush(Color.FromArgb(0x22, 0x2E, 0xC4, 0xB6)),
                CornerRadius = new CornerRadius(10),
                Padding = new Thickness(8, 2, 8, 2),
                Margin = AccentMargin,
                Child = _accentText,
                Visibility = Visibility.Collapsed
            };

            var rightStack = new StackPanel
            {
                Orientation = Orientation.Vertical,
                Margin = new Thickness(16, 0, 0, 0)
            };

            var valueRow = new StackPanel
            {
                Orientation = Orientation.Horizontal
            };
            valueRow.Children.Add(_value);
            valueRow.Children.Add(_accentContainer);

            rightStack.Children.Add(valueRow);
            rightStack.Children.Add(_detail);

            _grid = new Grid
            {
                Margin = new Thickness(0, 0, 0, 12)
            };
            _grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
            _grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });

            _grid.Children.Add(_label);
            Grid.SetColumn(rightStack, 1);
            _grid.Children.Add(rightStack);
        }

        public FrameworkElement View => _grid;

        public void Update(CardListItem item, Brush primaryBrush, Brush secondaryBrush, Brush accentBrush)
        {
            _label.Text = item.Primary;
            _label.Foreground = secondaryBrush;

            _value.Text = item.Secondary ?? string.Empty;
            _value.Foreground = primaryBrush;

            if (!string.IsNullOrEmpty(item.Tertiary))
            {
                _detail.Text = item.Tertiary;
                _detail.Foreground = secondaryBrush;
                _detail.Visibility = Visibility.Visible;
            }
            else
            {
                _detail.Text = string.Empty;
                _detail.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrEmpty(item.Accent))
            {
                _accentContainer.Visibility = Visibility.Visible;
                _accentText.Text = item.Accent;
                _accentText.Foreground = accentBrush;
            }
            else
            {
                _accentContainer.Visibility = Visibility.Collapsed;
                _accentText.Text = string.Empty;
            }
        }

        public void SetActive(bool isActive)
        {
            _grid.Visibility = isActive ? Visibility.Visible : Visibility.Collapsed;
        }

        public void Reset()
        {
            _label.Text = string.Empty;
            _value.Text = string.Empty;
            _detail.Text = string.Empty;
            _detail.Visibility = Visibility.Collapsed;
            _accentText.Text = string.Empty;
            _accentContainer.Visibility = Visibility.Collapsed;
            _grid.Visibility = Visibility.Collapsed;
        }
    }
}
