using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class ClubVisionRoadmapCard : UserControl, ICardContent
{
    private readonly Brush _filterBackground;
    private readonly Brush _filterBorder;
    private readonly Brush _filterForeground;
    private readonly Brush _filterSelectedBackground;
    private readonly Brush _filterSelectedBorder;
    private readonly Brush _filterSelectedForeground;
    private readonly Brush _phaseBackground;
    private readonly Brush _phaseBorder;
    private readonly SolidColorBrush _statusBrush;

    private StatusPresenter[] _statusPresenters;
    private PhasePresenter[] _phasePresenters;
    private int _statusCount;
    private int _phaseCount;
    private int _activeStatusIndex;

    public ClubVisionRoadmapCard()
    {
        InitializeComponent();

        _filterBackground = BrushUtilities.CreateFrozenBrush("#152032");
        _filterBorder = BrushUtilities.CreateFrozenBrush("#233246");
        _filterForeground = (Brush)Application.Current.FindResource("NeutralTextBrush");
        _filterSelectedBackground = BrushUtilities.CreateFrozenBrush("#1E2C3F");
        _filterSelectedBorder = BrushUtilities.CreateFrozenBrush("#3AA0FF");
        _filterSelectedForeground = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _phaseBackground = BrushUtilities.CreateFrozenBrush("#142031");
        _phaseBorder = BrushUtilities.CreateFrozenBrush("#233246");
        _statusBrush = BrushUtilities.CreateFrozenBrush("#2EC4B6");

        _statusPresenters = Array.Empty<StatusPresenter>();
        _phasePresenters = Array.Empty<PhasePresenter>();
        _activeStatusIndex = 0;
    }

    public CardType Type => CardType.ClubVisionRoadmap;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var definition = context.Definition.ClubVisionRoadmap;
        if (definition is null || definition.Phases is null)
        {
            Reset();
            return;
        }

        var phases = definition.Phases;
        var phaseCount = phases.Count;
        EnsurePhaseCapacity(phaseCount);
        _phaseCount = phaseCount;

        for (int i = 0; i < phaseCount; i++)
        {
            ref readonly var phase = ref phases[i];
            _phasePresenters[i].Set(in phase, _phaseBackground, _phaseBorder, _statusBrush);
        }

        for (int i = phaseCount; i < _phasePresenters.Length; i++)
        {
            _phasePresenters[i].Hide();
        }

        BuildStatuses(definition);

        if (_statusCount == 0)
        {
            SummaryText.Text = "No milestones captured";
            return;
        }

        if (_activeStatusIndex >= _statusCount)
        {
            _activeStatusIndex = 0;
        }

        SelectStatus(_activeStatusIndex);
    }

    public void Detach()
    {
        // no-op
    }

    public void Reset()
    {
        _statusCount = 0;
        _phaseCount = 0;
        _activeStatusIndex = 0;
        SummaryText.Text = "No milestones captured";

        for (int i = 0; i < _statusPresenters.Length; i++)
        {
            _statusPresenters[i].Hide();
        }

        for (int i = 0; i < _phasePresenters.Length; i++)
        {
            _phasePresenters[i].Hide();
        }
    }

    private void EnsureStatusCapacity(int required)
    {
        if (_statusPresenters.Length >= required)
        {
            return;
        }

        int newLength = _statusPresenters.Length == 0 ? 4 : _statusPresenters.Length;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newArray = new StatusPresenter[newLength];
        for (int i = 0; i < _statusPresenters.Length; i++)
        {
            newArray[i] = _statusPresenters[i];
        }

        for (int i = _statusPresenters.Length; i < newLength; i++)
        {
            var presenter = new StatusPresenter(StatusHost, OnStatusSelected, _filterBackground, _filterBorder, _filterForeground, _filterSelectedBackground, _filterSelectedBorder, _filterSelectedForeground);
            newArray[i] = presenter;
        }

        _statusPresenters = newArray;
    }

    private void EnsurePhaseCapacity(int required)
    {
        if (_phasePresenters.Length >= required)
        {
            return;
        }

        int newLength = _phasePresenters.Length == 0 ? 4 : _phasePresenters.Length;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newArray = new PhasePresenter[newLength];
        for (int i = 0; i < _phasePresenters.Length; i++)
        {
            newArray[i] = _phasePresenters[i];
        }

        for (int i = _phasePresenters.Length; i < newLength; i++)
        {
            var presenter = new PhasePresenter(PhaseHost);
            newArray[i] = presenter;
        }

        _phasePresenters = newArray;
    }

    private void BuildStatuses(ClubVisionRoadmapDefinition definition)
    {
        var phases = definition.Phases;
        var options = definition.StatusOptions;
        int optionCount = options?.Count ?? 0;
        int required = optionCount + 1;
        EnsureStatusCapacity(required);
        _statusCount = required;

        int total = _phaseCount;
        _statusPresenters[0].Configure(0, null, FormatAllLabel(total));

        for (int i = 0; i < optionCount; i++)
        {
            string option = options![i];
            int count = CountStatus(phases, option);
            string label = count == 0 ? option : string.Create(option.Length + 3 + CountDigits(count), (option, count), static (span, state) =>
            {
                var (name, totalCount) = state;
                name.CopyTo(span);
                int offset = name.Length;
                span[offset++] = ' ';
                span[offset++] = '(';
                totalCount.TryFormat(span[offset..], out int written, default);
                span[offset + written] = ')';
            });
            _statusPresenters[i + 1].Configure(i + 1, option, label);
        }

        for (int i = required; i < _statusPresenters.Length; i++)
        {
            _statusPresenters[i].Hide();
        }
    }

    private void SelectStatus(int index)
    {
        if (_statusCount == 0)
        {
            SummaryText.Text = "No milestones captured";
            return;
        }

        if (index < 0 || index >= _statusCount)
        {
            index = 0;
        }

        _activeStatusIndex = index;
        string? key = _statusPresenters[index].Key;

        int visibleCount = 0;
        int atRiskCount = 0;
        for (int i = 0; i < _statusCount; i++)
        {
            _statusPresenters[i].SetSelected(i == index);
        }

        for (int i = 0; i < _phaseCount; i++)
        {
            ref var presenter = ref _phasePresenters[i];
            bool isVisible = key is null || presenter.MatchesStatus(key);
            presenter.SetVisible(isVisible);
            if (isVisible)
            {
                visibleCount++;
                if (presenter.IsAtRisk)
                {
                    atRiskCount++;
                }
            }
        }

        SummaryText.Text = BuildSummary(visibleCount, _phaseCount, atRiskCount);
    }

    private void OnStatusSelected(int index)
    {
        SelectStatus(index);
    }

    private static int CountStatus(IReadOnlyList<ClubVisionRoadmapPhaseDefinition> phases, string status)
    {
        if (phases is null)
        {
            return 0;
        }

        int count = 0;
        for (int i = 0; i < phases.Count; i++)
        {
            var phase = phases[i];
            if (string.Equals(phase.Status, status, StringComparison.OrdinalIgnoreCase))
            {
                count++;
            }
        }

        return count;
    }

    private static string FormatAllLabel(int total)
    {
        int digits = CountDigits(total);
        return string.Create(6 + digits, total, static (span, value) =>
        {
            span[0] = 'A';
            span[1] = 'l';
            span[2] = 'l';
            span[3] = ' ';
            span[4] = '(';
            value.TryFormat(span[5..], out int written, default);
            span[5 + written] = ')';
        });
    }

    private static string BuildSummary(int visible, int total, int atRisk)
    {
        if (total == 0)
        {
            return "No milestones captured";
        }

        Span<char> buffer = stackalloc char[96];
        int offset = 0;

        if (visible == total)
        {
            offset += WriteNumber(buffer[offset..], total);
            if (atRisk > 0)
            {
                offset += WriteLiteral(buffer[offset..], " milestones • ");
                offset += WriteNumber(buffer[offset..], atRisk);
                offset += WriteLiteral(buffer[offset..], " flagged");
            }
            else
            {
                offset += WriteLiteral(buffer[offset..], " milestones on record");
            }
        }
        else
        {
            offset += WriteNumber(buffer[offset..], visible);
            offset += WriteLiteral(buffer[offset..], " of ");
            offset += WriteNumber(buffer[offset..], total);
            offset += WriteLiteral(buffer[offset..], " milestones shown");
            if (atRisk > 0)
            {
                offset += WriteLiteral(buffer[offset..], " • ");
                offset += WriteNumber(buffer[offset..], atRisk);
                offset += WriteLiteral(buffer[offset..], " flagged");
            }
        }

        return new string(buffer[..offset]);
    }

    private static int WriteLiteral(Span<char> destination, string text)
    {
        text.AsSpan().CopyTo(destination);
        return text.Length;
    }

    private static int WriteNumber(Span<char> destination, int value)
    {
        if (!value.TryFormat(destination, out int written, default))
        {
            destination[0] = '0';
            written = 1;
        }

        return written;
    }

    private static int CountDigits(int value)
    {
        if (value >= 1000000000) return 10;
        if (value >= 100000000) return 9;
        if (value >= 10000000) return 8;
        if (value >= 1000000) return 7;
        if (value >= 100000) return 6;
        if (value >= 10000) return 5;
        if (value >= 1000) return 4;
        if (value >= 100) return 3;
        if (value >= 10) return 2;
        return 1;
    }

    private sealed class StatusPresenter
    {
        private readonly Button _button;
        private readonly Action<int> _callback;
        private readonly Brush _background;
        private readonly Brush _border;
        private readonly Brush _foreground;
        private readonly Brush _selectedBackground;
        private readonly Brush _selectedBorder;
        private readonly Brush _selectedForeground;
        private int _index;
        private string? _key;

        public StatusPresenter(Panel host, Action<int> callback, Brush background, Brush border, Brush foreground, Brush selectedBackground, Brush selectedBorder, Brush selectedForeground)
        {
            _callback = callback;
            _background = background;
            _border = border;
            _foreground = foreground;
            _selectedBackground = selectedBackground;
            _selectedBorder = selectedBorder;
            _selectedForeground = selectedForeground;

            _button = new Button
            {
                Padding = new Thickness(12, 6, 12, 6),
                Margin = new Thickness(0, 0, 8, 8),
                Background = background,
                BorderBrush = border,
                BorderThickness = new Thickness(1),
                Foreground = foreground,
                FontWeight = FontWeights.SemiBold,
                Cursor = System.Windows.Input.Cursors.Hand,
                Focusable = false
            };
            _button.Click += OnClick;
            host.Children.Add(_button);
        }

        public string? Key => _key;

        public void Configure(int index, string? key, string label)
        {
            _index = index;
            _key = key;
            _button.Content = label;
            _button.Visibility = Visibility.Visible;
            SetSelected(index == 0);
        }

        public void SetSelected(bool isSelected)
        {
            if (isSelected)
            {
                _button.IsEnabled = false;
                _button.Background = _selectedBackground;
                _button.BorderBrush = _selectedBorder;
                _button.Foreground = _selectedForeground;
            }
            else
            {
                _button.IsEnabled = true;
                _button.Background = _background;
                _button.BorderBrush = _border;
                _button.Foreground = _foreground;
            }
        }

        public void Hide()
        {
            _button.Visibility = Visibility.Collapsed;
        }

        private void OnClick(object sender, RoutedEventArgs e)
        {
            _callback(_index);
        }
    }

    private sealed class PhasePresenter
    {
        private readonly Border _root;
        private readonly TextBlock _title;
        private readonly Border _accent;
        private readonly TextBlock _accentText;
        private readonly TextBlock _timeline;
        private readonly TextBlock _description;
        private readonly TextBlock _status;
        private string _statusKey = string.Empty;
        private bool _isAtRisk;

        public PhasePresenter(Panel host)
        {
            _title = new TextBlock
            {
                FontSize = 16,
                FontWeight = FontWeights.SemiBold,
                Foreground = (Brush)Application.Current.FindResource("PrimaryTextBrush")
            };

            _accentText = new TextBlock
            {
                FontSize = 12,
                Foreground = (Brush)Application.Current.FindResource("PrimaryTextBrush"),
                FontWeight = FontWeights.SemiBold
            };

            _accent = new Border
            {
                Child = _accentText,
                CornerRadius = new CornerRadius(8),
                Margin = new Thickness(12, 0, 0, 0),
                Padding = new Thickness(8, 2, 8, 2),
                Visibility = Visibility.Collapsed
            };

            var titlePanel = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                Margin = new Thickness(0, 0, 0, 8)
            };
            titlePanel.Children.Add(_title);
            titlePanel.Children.Add(_accent);

            _timeline = new TextBlock
            {
                FontSize = 13,
                Foreground = (Brush)Application.Current.FindResource("NeutralTextBrush"),
                Margin = new Thickness(0, 0, 0, 8)
            };

            _description = new TextBlock
            {
                FontSize = 13,
                Foreground = (Brush)Application.Current.FindResource("NeutralTextBrush"),
                TextWrapping = TextWrapping.Wrap,
                Visibility = Visibility.Collapsed
            };

            _status = new TextBlock
            {
                FontSize = 13,
                FontWeight = FontWeights.SemiBold,
                Foreground = BrushUtilities.CreateFrozenBrush("#2EC4B6")
            };

            var grid = new Grid();
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

            Grid.SetRow(titlePanel, 0);
            grid.Children.Add(titlePanel);

            Grid.SetRow(_timeline, 1);
            grid.Children.Add(_timeline);

            Grid.SetRow(_description, 2);
            grid.Children.Add(_description);

            Grid.SetRow(_status, 3);
            _status.Margin = new Thickness(0, 8, 0, 0);
            grid.Children.Add(_status);

            _root = new Border
            {
                Background = BrushUtilities.CreateFrozenBrush("#142031"),
                BorderBrush = BrushUtilities.CreateFrozenBrush("#233246"),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(12),
                Padding = new Thickness(16),
                Margin = new Thickness(0, 0, 0, 12),
                Child = grid
            };

            host.Children.Add(_root);
        }

        public bool IsAtRisk => _isAtRisk;

        public void Set(in ClubVisionRoadmapPhaseDefinition definition, Brush background, Brush border, SolidColorBrush statusBrush)
        {
            _statusKey = definition.Status ?? string.Empty;
            _isAtRisk = IsStatusAtRisk(definition.Status);

            _root.Background = background;
            _root.BorderBrush = border;

            _title.Text = definition.Title;
            _timeline.Text = definition.Timeline;

            if (!string.IsNullOrWhiteSpace(definition.Description))
            {
                _description.Text = definition.Description;
                _description.Visibility = Visibility.Visible;
            }
            else
            {
                _description.Visibility = Visibility.Collapsed;
            }

            if (!string.IsNullOrWhiteSpace(definition.Accent))
            {
                _accent.Background = BrushUtilities.CreateFrozenBrush(definition.Accent!, statusBrush);
                _accentText.Text = definition.Pill ?? definition.Accent!;
                _accent.Visibility = Visibility.Visible;
            }
            else if (!string.IsNullOrWhiteSpace(definition.Pill))
            {
                _accent.Background = BrushUtilities.CreateFrozenBrush("#1F2C3D");
                _accentText.Text = definition.Pill!;
                _accent.Visibility = Visibility.Visible;
            }
            else
            {
                _accent.Visibility = Visibility.Collapsed;
            }

            _status.Foreground = statusBrush;
            _status.Text = definition.Status;
            _root.Visibility = Visibility.Visible;
        }

        public bool MatchesStatus(string status)
        {
            return string.Equals(_statusKey, status, StringComparison.OrdinalIgnoreCase);
        }

        public void SetVisible(bool visible)
        {
            _root.Visibility = visible ? Visibility.Visible : Visibility.Collapsed;
        }

        public void Hide()
        {
            _root.Visibility = Visibility.Collapsed;
        }

        private static bool IsStatusAtRisk(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
            {
                return false;
            }

            return string.Equals(status, "At Risk", StringComparison.OrdinalIgnoreCase)
                || string.Equals(status, "Behind", StringComparison.OrdinalIgnoreCase)
                || string.Equals(status, "Off Track", StringComparison.OrdinalIgnoreCase);
        }
    }
}
