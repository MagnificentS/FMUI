using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.UI.Cards;

public sealed class MedicalTimelineCardContent : ICardContent
{
    private readonly Border _root;
    private readonly StackPanel _entriesHost;
    private MedicalTimelineRow[] _rows;
    private int _rowsLength;
    private readonly Brush _primaryBrush;
    private readonly Brush _secondaryBrush;
    private readonly Brush _accentBrush;
    private readonly SolidColorBrush _pillBackground;

    public MedicalTimelineCardContent()
    {
        _primaryBrush = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _secondaryBrush = (Brush)Application.Current.FindResource("NeutralTextBrush");
        _accentBrush = (Brush)Application.Current.FindResource("AccentPrimaryBrush");
        _pillBackground = new SolidColorBrush(Color.FromRgb(0x24, 0x39, 0x52));

        _entriesHost = new StackPanel
        {
            Orientation = Orientation.Vertical,
            Margin = new Thickness(0)
        };

        _root = new Border
        {
            Background = Brushes.Transparent,
            Child = _entriesHost,
            Visibility = Visibility.Collapsed
        };

        _rows = Array.Empty<MedicalTimelineRow>();
        _rowsLength = 0;
    }

    public CardType Type => CardType.MedicalTimeline;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var timeline = context.Definition.MedicalTimeline;
        var entries = timeline?.Entries;
        var count = entries?.Count ?? 0;

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
            var entry = entries![i];
            _rows[i].Update(entry, _primaryBrush, _secondaryBrush, _accentBrush, _pillBackground);
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

        var newLength = _rowsLength == 0 ? 2 : _rowsLength;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newRows = new MedicalTimelineRow[newLength];
        for (int i = 0; i < _rowsLength; i++)
        {
            newRows[i] = _rows[i];
        }

        for (int i = _rowsLength; i < newLength; i++)
        {
            var row = new MedicalTimelineRow();
            newRows[i] = row;
            _entriesHost.Children.Add(row.View);
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

    private sealed class MedicalTimelineRow
    {
        private readonly Border _container;
        private readonly TextBlock _player;
        private readonly TextBlock _diagnosis;
        private readonly TextBlock _status;
        private readonly TextBlock _return;
        private readonly TextBlock _notes;
        private readonly StackPanel _phaseHost;
        private TimelinePhaseRow[] _phases;
        private int _phasesLength;
        private readonly SolidColorBrush _statusBrush;

        public MedicalTimelineRow()
        {
            _container = new Border
            {
                Background = new SolidColorBrush(Color.FromArgb(0x22, 0x24, 0x39, 0x52)),
                CornerRadius = new CornerRadius(6),
                Padding = new Thickness(12),
                Margin = new Thickness(0, 6, 0, 6)
            };

            var root = new StackPanel
            {
                Orientation = Orientation.Vertical
            };

            var header = new Grid
            {
                Margin = new Thickness(0, 0, 0, 6)
            };

            header.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            header.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
            header.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });

            _player = new TextBlock
            {
                FontSize = 16,
                FontWeight = FontWeights.SemiBold,
                TextTrimming = TextTrimming.CharacterEllipsis
            };

            _diagnosis = new TextBlock
            {
                FontSize = 13,
                Margin = new Thickness(0, 4, 0, 0),
                TextTrimming = TextTrimming.CharacterEllipsis
            };

            _statusBrush = new SolidColorBrush(Color.FromRgb(0x2E, 0xC4, 0xB6));

            _status = new TextBlock
            {
                FontSize = 13,
                FontWeight = FontWeights.SemiBold,
                Margin = new Thickness(12, 0, 0, 0),
                TextTrimming = TextTrimming.CharacterEllipsis,
                Foreground = _statusBrush
            };

            _return = new TextBlock
            {
                FontSize = 13,
                Margin = new Thickness(12, 0, 0, 0),
                TextTrimming = TextTrimming.CharacterEllipsis
            };

            Grid.SetColumn(_player, 0);
            header.Children.Add(_player);

            var statusPanel = new StackPanel
            {
                Orientation = Orientation.Horizontal
            };

            statusPanel.Children.Add(_status);
            statusPanel.Children.Add(_return);

            Grid.SetColumn(statusPanel, 1);
            Grid.SetColumnSpan(statusPanel, 2);
            header.Children.Add(statusPanel);

            root.Children.Add(header);
            root.Children.Add(_diagnosis);

            _notes = new TextBlock
            {
                FontSize = 12,
                Margin = new Thickness(0, 6, 0, 0),
                TextWrapping = TextWrapping.Wrap,
                Visibility = Visibility.Collapsed
            };

            root.Children.Add(_notes);

            _phaseHost = new StackPanel
            {
                Orientation = Orientation.Vertical,
                Margin = new Thickness(0, 8, 0, 0)
            };

            root.Children.Add(_phaseHost);
            _container.Child = root;

            _phases = Array.Empty<TimelinePhaseRow>();
            _phasesLength = 0;
        }

        public FrameworkElement View => _container;

        public void Update(
            MedicalTimelineEntryDefinition entry,
            Brush primaryBrush,
            Brush secondaryBrush,
            Brush accentBrush,
            SolidColorBrush defaultPillBackground)
        {
            _player.Text = entry.Player ?? string.Empty;
            _player.Foreground = primaryBrush;

            _diagnosis.Text = entry.Diagnosis ?? string.Empty;
            _diagnosis.Foreground = secondaryBrush;

            _status.Text = entry.Status ?? string.Empty;
            var fallbackColor = Colors.White;
            if (accentBrush is SolidColorBrush accentSolid)
            {
                fallbackColor = accentSolid.Color;
            }

            if (CardColorParser.TryParse(entry.Accent, out var accentColor))
            {
                _statusBrush.Color = accentColor;
            }
            else
            {
                _statusBrush.Color = fallbackColor;
            }

            _return.Text = entry.ExpectedReturn ?? string.Empty;
            _return.Foreground = secondaryBrush;

            if (!string.IsNullOrEmpty(entry.Notes))
            {
                _notes.Text = entry.Notes!;
                _notes.Foreground = secondaryBrush;
                _notes.Visibility = Visibility.Visible;
            }
            else
            {
                _notes.Text = string.Empty;
                _notes.Visibility = Visibility.Collapsed;
            }

            var phases = entry.Phases;
            var count = phases?.Count ?? 0;
            EnsurePhaseCapacity(count);
            SetActivePhaseCount(count);

            for (int i = 0; i < count; i++)
            {
                var phase = phases![i];
                _phases[i].Update(phase, primaryBrush, secondaryBrush, defaultPillBackground);
            }
        }

        public void Reset()
        {
            _player.Text = string.Empty;
            _diagnosis.Text = string.Empty;
            _status.Text = string.Empty;
            _return.Text = string.Empty;
            _notes.Text = string.Empty;
            _notes.Visibility = Visibility.Collapsed;

            for (int i = 0; i < _phasesLength; i++)
            {
                _phases[i].Reset();
            }
        }

        public void SetActive(bool isActive)
        {
            _container.Visibility = isActive ? Visibility.Visible : Visibility.Collapsed;
            if (!isActive)
            {
                Reset();
            }
        }

        private void EnsurePhaseCapacity(int required)
        {
            if (_phasesLength >= required)
            {
                return;
            }

            var newLength = _phasesLength == 0 ? 3 : _phasesLength;
            while (newLength < required)
            {
                newLength <<= 1;
            }

            var newRows = new TimelinePhaseRow[newLength];
            for (int i = 0; i < _phasesLength; i++)
            {
                newRows[i] = _phases[i];
            }

            for (int i = _phasesLength; i < newLength; i++)
            {
                var row = new TimelinePhaseRow();
                newRows[i] = row;
                _phaseHost.Children.Add(row.View);
            }

            _phases = newRows;
            _phasesLength = newLength;
        }

        private void SetActivePhaseCount(int count)
        {
            for (int i = 0; i < _phasesLength; i++)
            {
                var isActive = i < count;
                _phases[i].SetActive(isActive);
            }
        }
    }

    private sealed class TimelinePhaseRow
    {
        private readonly Grid _root;
        private readonly Border _bullet;
        private readonly Border _line;
        private readonly TextBlock _label;
        private readonly TextBlock _detail;
        private readonly Border _pillContainer;
        private readonly TextBlock _pillText;
        private readonly SolidColorBrush _pillBackground;

        public TimelinePhaseRow()
        {
            _root = new Grid
            {
                Margin = new Thickness(0, 4, 0, 4)
            };

            _root.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(20) });
            _root.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });

            _line = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x24, 0x39, 0x52)),
                Width = 2,
                Margin = new Thickness(0, 0, 0, 0),
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Stretch
            };

            Grid.SetColumn(_line, 0);
            _root.Children.Add(_line);

            _bullet = new Border
            {
                Width = 8,
                Height = 8,
                CornerRadius = new CornerRadius(4),
                Background = new SolidColorBrush(Color.FromRgb(0x2E, 0xC4, 0xB6)),
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };

            Grid.SetColumn(_bullet, 0);
            _root.Children.Add(_bullet);

            var content = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                Margin = new Thickness(12, 0, 0, 0)
            };

            _label = new TextBlock
            {
                FontSize = 13,
                FontWeight = FontWeights.SemiBold,
                TextTrimming = TextTrimming.CharacterEllipsis
            };

            _detail = new TextBlock
            {
                FontSize = 12,
                Margin = new Thickness(8, 0, 0, 0),
                TextTrimming = TextTrimming.CharacterEllipsis,
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
                CornerRadius = new CornerRadius(8),
                Padding = new Thickness(6, 2, 6, 2),
                Margin = new Thickness(8, 0, 0, 0),
                Child = _pillText,
                Visibility = Visibility.Collapsed
            };

            content.Children.Add(_label);
            content.Children.Add(_detail);
            content.Children.Add(_pillContainer);

            Grid.SetColumn(content, 1);
            _root.Children.Add(content);
        }

        public FrameworkElement View => _root;

        public void Update(
            TimelineEntryDefinition entry,
            Brush labelBrush,
            Brush detailBrush,
            SolidColorBrush defaultBackground)
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
                UpdateAccent(entry.Accent, defaultBackground);
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
            if (string.IsNullOrEmpty(accent))
            {
                _pillBackground.Color = defaultBackground.Color;
                return;
            }

            if (CardColorParser.TryParse(accent, out var color))
            {
                _pillBackground.Color = color;
                return;
            }

            _pillBackground.Color = defaultBackground.Color;
        }
    }
}
