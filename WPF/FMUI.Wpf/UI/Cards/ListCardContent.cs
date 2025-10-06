using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public sealed class ListCardContent : ICardContent
{
    private readonly Border _root;
    private readonly StackPanel _itemsHost;
    private ListCardRow[] _rows;
    private int _rowsLength;
    private readonly Brush _primaryBrush;
    private readonly Brush _secondaryBrush;
    private readonly Brush _accentBrush;
    private readonly Brush _borderBrush;
    private readonly Style? _toolTipStyle;

    public ListCardContent()
    {
        _primaryBrush = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _secondaryBrush = (Brush)Application.Current.FindResource("NeutralTextBrush");
        _accentBrush = (Brush)Application.Current.FindResource("AccentPrimaryBrush");
        _borderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39));
        _toolTipStyle = Application.Current.TryFindResource("CardToolTipStyle") as Style;

        _itemsHost = new StackPanel
        {
            Margin = new Thickness(0),
            Orientation = Orientation.Vertical
        };

        _root = new Border
        {
            Background = Brushes.Transparent,
            Child = _itemsHost
        };

        _rows = Array.Empty<ListCardRow>();
        _rowsLength = 0;
    }

    public CardType Type => CardType.SquadSummary;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var items = context.Definition.ListItems;
        var count = items?.Count ?? 0;

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
            var item = items![i];
            _rows[i].Update(item, _primaryBrush, _secondaryBrush, _accentBrush, _toolTipStyle);
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

        int newLength = _rowsLength == 0 ? 4 : _rowsLength;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newArray = new ListCardRow[newLength];
        for (int i = 0; i < _rowsLength; i++)
        {
            newArray[i] = _rows[i];
        }

        for (int i = _rowsLength; i < newLength; i++)
        {
            var row = new ListCardRow(_borderBrush);
            newArray[i] = row;
            _itemsHost.Children.Add(row.View);
        }

        _rows = newArray;
        _rowsLength = newLength;
    }

    private void SetActiveRowCount(int activeCount)
    {
        for (int i = 0; i < _rowsLength; i++)
        {
            var isActive = i < activeCount;
            _rows[i].SetActive(isActive);
            if (!isActive)
            {
                _rows[i].Reset();
            }
        }
    }

    private sealed class ListCardRow
    {
        private static readonly Brush HoverBrush = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34));
        private readonly Border _container;
        private readonly TextBlock _primary;
        private readonly TextBlock _secondary;
        private readonly TextBlock _tertiary;
        private readonly Border _accent;
        private readonly TextBlock _accentText;
        private readonly TextBlock _toolTipPrimary;
        private readonly TextBlock _toolTipSecondary;
        private readonly TextBlock _toolTipTertiary;
        private readonly TextBlock _toolTipAccent;
        private readonly ToolTip _toolTip;
        private readonly Brush _defaultBackground;

        public ListCardRow(Brush borderBrush)
        {
            _defaultBackground = Brushes.Transparent;

            _primary = new TextBlock
            {
                FontSize = 14,
                Foreground = Brushes.White,
                TextTrimming = TextTrimming.CharacterEllipsis
            };

            _secondary = new TextBlock
            {
                FontSize = 13,
                Foreground = Brushes.Gray,
                TextAlignment = TextAlignment.Right,
                TextTrimming = TextTrimming.CharacterEllipsis,
                Visibility = Visibility.Collapsed
            };

            _tertiary = new TextBlock
            {
                FontSize = 13,
                Foreground = Brushes.Gray,
                TextTrimming = TextTrimming.CharacterEllipsis,
                Visibility = Visibility.Collapsed
            };

            _accentText = new TextBlock
            {
                FontSize = 11,
                FontWeight = FontWeights.SemiBold,
                Foreground = Brushes.White
            };

            _accent = new Border
            {
                Background = new SolidColorBrush(Color.FromArgb(0x22, 0x2E, 0xC4, 0xB6)),
                Padding = new Thickness(8, 2, 8, 2),
                CornerRadius = new CornerRadius(10),
                Margin = new Thickness(0, 0, 8, 0),
                Child = _accentText,
                Visibility = Visibility.Collapsed
            };

            var trailing = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                HorizontalAlignment = HorizontalAlignment.Right
            };
            trailing.Children.Add(_accent);
            trailing.Children.Add(_tertiary);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(2, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });

            grid.Children.Add(_primary);
            Grid.SetColumn(_secondary, 1);
            grid.Children.Add(_secondary);
            Grid.SetColumn(trailing, 2);
            grid.Children.Add(trailing);

            _container = new Border
            {
                Margin = new Thickness(0, 0, 0, 10),
                Padding = new Thickness(0, 0, 0, 8),
                BorderThickness = new Thickness(0, 0, 0, 1),
                BorderBrush = borderBrush,
                Background = _defaultBackground,
                Child = grid
            };

            _container.MouseEnter += (_, _) => _container.Background = HoverBrush;
            _container.MouseLeave += (_, _) => _container.Background = _defaultBackground;

            _toolTipPrimary = new TextBlock { FontWeight = FontWeights.SemiBold };
            _toolTipSecondary = new TextBlock { Margin = new Thickness(0, 6, 0, 0), Visibility = Visibility.Collapsed };
            _toolTipTertiary = new TextBlock { Margin = new Thickness(0, 4, 0, 0), Visibility = Visibility.Collapsed };
            _toolTipAccent = new TextBlock { Margin = new Thickness(0, 4, 0, 0), Visibility = Visibility.Collapsed };

            var toolTipPanel = new StackPanel();
            toolTipPanel.Children.Add(_toolTipPrimary);
            toolTipPanel.Children.Add(_toolTipSecondary);
            toolTipPanel.Children.Add(_toolTipTertiary);
            toolTipPanel.Children.Add(_toolTipAccent);

            _toolTip = new ToolTip
            {
                Content = toolTipPanel
            };

            _container.ToolTip = _toolTip;
        }

        public FrameworkElement View => _container;

        public void Update(CardListItem item, Brush primaryBrush, Brush secondaryBrush, Brush accentBrush, Style? toolTipStyle)
        {
            _primary.Text = item.Primary;
            _primary.Foreground = primaryBrush;

            if (!string.IsNullOrEmpty(item.Secondary))
            {
                _secondary.Text = item.Secondary;
                _secondary.Visibility = Visibility.Visible;
                _secondary.Foreground = secondaryBrush;
            }
            else
            {
                _secondary.Text = string.Empty;
                _secondary.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrEmpty(item.Tertiary))
            {
                _tertiary.Text = item.Tertiary;
                _tertiary.Visibility = Visibility.Visible;
                _tertiary.Foreground = secondaryBrush;
            }
            else
            {
                _tertiary.Text = string.Empty;
                _tertiary.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrEmpty(item.Accent))
            {
                _accent.Visibility = Visibility.Visible;
                _accentText.Text = item.Accent;
                _accentText.Foreground = accentBrush;
            }
            else
            {
                _accent.Visibility = Visibility.Collapsed;
                _accentText.Text = string.Empty;
            }

            _toolTipPrimary.Text = item.Primary;
            _toolTipPrimary.Foreground = primaryBrush;

            if (!string.IsNullOrEmpty(item.Secondary))
            {
                _toolTipSecondary.Text = item.Secondary;
                _toolTipSecondary.Foreground = secondaryBrush;
                _toolTipSecondary.Visibility = Visibility.Visible;
            }
            else
            {
                _toolTipSecondary.Text = string.Empty;
                _toolTipSecondary.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrEmpty(item.Tertiary))
            {
                _toolTipTertiary.Text = item.Tertiary;
                _toolTipTertiary.Foreground = secondaryBrush;
                _toolTipTertiary.Visibility = Visibility.Visible;
            }
            else
            {
                _toolTipTertiary.Text = string.Empty;
                _toolTipTertiary.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrEmpty(item.Accent))
            {
                _toolTipAccent.Text = item.Accent;
                _toolTipAccent.Foreground = accentBrush;
                _toolTipAccent.Visibility = Visibility.Visible;
            }
            else
            {
                _toolTipAccent.Text = string.Empty;
                _toolTipAccent.Visibility = Visibility.Collapsed;
            }

            if (toolTipStyle is not null)
            {
                _toolTip.Style = toolTipStyle;
            }
        }

        public void SetActive(bool isActive)
        {
            _container.Visibility = isActive ? Visibility.Visible : Visibility.Collapsed;
        }

        public void Reset()
        {
            _primary.Text = string.Empty;
            _secondary.Text = string.Empty;
            _secondary.Visibility = Visibility.Collapsed;
            _tertiary.Text = string.Empty;
            _tertiary.Visibility = Visibility.Collapsed;
            _accentText.Text = string.Empty;
            _accent.Visibility = Visibility.Collapsed;
            _toolTipPrimary.Text = string.Empty;
            _toolTipSecondary.Text = string.Empty;
            _toolTipSecondary.Visibility = Visibility.Collapsed;
            _toolTipTertiary.Text = string.Empty;
            _toolTipTertiary.Visibility = Visibility.Collapsed;
            _toolTipAccent.Text = string.Empty;
            _toolTipAccent.Visibility = Visibility.Collapsed;
            _container.Background = _defaultBackground;
        }
    }
}
