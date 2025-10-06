using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class ClubVisionExpectationsCard : UserControl, ICardContent
{
    private readonly Brush _filterBackground;
    private readonly Brush _filterBorder;
    private readonly Brush _filterForeground;
    private readonly Brush _filterSelectedBackground;
    private readonly Brush _filterSelectedBorder;
    private readonly Brush _filterSelectedForeground;
    private readonly Brush _objectiveBackground;
    private readonly Brush _objectiveBorder;
    private readonly Brush _statusBackground;
    private readonly Brush _statusBorder;
    private readonly Brush _statusForeground;
    private readonly Brush _pillFallbackBrush;

    private FilterPresenter[] _filters;
    private ObjectivePresenter[] _objectives;
    private int _filterCount;
    private int _objectiveCount;
    private int _activeFilterIndex;

    public ClubVisionExpectationsCard()
    {
        InitializeComponent();

        _filterBackground = BrushUtilities.CreateFrozenBrush("#152032");
        _filterBorder = BrushUtilities.CreateFrozenBrush("#233246");
        _filterForeground = (Brush)Application.Current.FindResource("NeutralTextBrush");
        _filterSelectedBackground = BrushUtilities.CreateFrozenBrush("#1E2C3F");
        _filterSelectedBorder = BrushUtilities.CreateFrozenBrush("#3AA0FF");
        _filterSelectedForeground = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _objectiveBackground = BrushUtilities.CreateFrozenBrush("#182436");
        _objectiveBorder = BrushUtilities.CreateFrozenBrush("#233246");
        _statusBackground = BrushUtilities.CreateFrozenBrush("#1F2C3D");
        _statusBorder = BrushUtilities.CreateFrozenBrush("#2EC4B6");
        _statusForeground = (Brush)Application.Current.FindResource("PrimaryTextBrush");
        _pillFallbackBrush = BrushUtilities.CreateFrozenBrush("#233447");

        _filters = Array.Empty<FilterPresenter>();
        _objectives = Array.Empty<ObjectivePresenter>();
        _activeFilterIndex = 0;
    }

    public CardType Type => CardType.ClubVisionExpectations;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        var definition = context.Definition.ClubVisionExpectations;
        if (definition is null || definition.Objectives is null)
        {
            Reset();
            return;
        }

        var objectives = definition.Objectives;
        int count = objectives.Count;
        EnsureObjectiveCapacity(count);
        _objectiveCount = count;

        for (int i = 0; i < count; i++)
        {
            ref readonly var objective = ref objectives[i];
            _objectives[i].Set(in objective, _objectiveBackground, _objectiveBorder, _statusBackground, _statusBorder, _statusForeground);
        }

        for (int i = count; i < _objectives.Length; i++)
        {
            _objectives[i].Hide();
        }

        BuildFilters(definition);

        if (_filterCount == 0)
        {
            SummaryText.Text = "No objectives configured";
            return;
        }

        if (_activeFilterIndex >= _filterCount)
        {
            _activeFilterIndex = 0;
        }

        SelectFilter(_activeFilterIndex);
    }

    public void Detach()
    {
        // no-op
    }

    public void Reset()
    {
        _filterCount = 0;
        _objectiveCount = 0;
        _activeFilterIndex = 0;
        SummaryText.Text = "No objectives configured";

        for (int i = 0; i < _filters.Length; i++)
        {
            _filters[i].Hide();
        }

        for (int i = 0; i < _objectives.Length; i++)
        {
            _objectives[i].Hide();
        }
    }

    private void EnsureFilterCapacity(int required)
    {
        if (_filters.Length >= required)
        {
            return;
        }

        int newLength = _filters.Length == 0 ? 4 : _filters.Length;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newArray = new FilterPresenter[newLength];
        for (int i = 0; i < _filters.Length; i++)
        {
            newArray[i] = _filters[i];
        }

        for (int i = _filters.Length; i < newLength; i++)
        {
            var presenter = new FilterPresenter(FilterHost, OnFilterSelected, _filterBackground, _filterBorder, _filterForeground, _filterSelectedBackground, _filterSelectedBorder, _filterSelectedForeground);
            newArray[i] = presenter;
        }

        _filters = newArray;
    }

    private void EnsureObjectiveCapacity(int required)
    {
        if (_objectives.Length >= required)
        {
            return;
        }

        int newLength = _objectives.Length == 0 ? 4 : _objectives.Length;
        while (newLength < required)
        {
            newLength <<= 1;
        }

        var newArray = new ObjectivePresenter[newLength];
        for (int i = 0; i < _objectives.Length; i++)
        {
            newArray[i] = _objectives[i];
        }

        for (int i = _objectives.Length; i < newLength; i++)
        {
            var presenter = new ObjectivePresenter(ObjectiveHost);
            newArray[i] = presenter;
        }

        _objectives = newArray;
    }

    private void BuildFilters(ClubVisionExpectationBoardDefinition definition)
    {
        var options = definition.StatusOptions;
        int optionCount = options?.Count ?? 0;
        int required = optionCount + 1;
        EnsureFilterCapacity(required);
        _filterCount = required;

        _filters[0].Configure(0, null, FormatAllLabel(_objectiveCount));

        for (int i = 0; i < optionCount; i++)
        {
            string option = options![i];
            int count = CountStatus(option);
            string label = count == 0 ? option : CreateLabeledOption(option, count);
            _filters[i + 1].Configure(i + 1, option, label);
        }

        for (int i = required; i < _filters.Length; i++)
        {
            _filters[i].Hide();
        }
    }

    private void SelectFilter(int index)
    {
        if (_filterCount == 0)
        {
            SummaryText.Text = "No objectives configured";
            return;
        }

        if (index < 0 || index >= _filterCount)
        {
            index = 0;
        }

        _activeFilterIndex = index;
        string? key = _filters[index].Key;

        for (int i = 0; i < _filterCount; i++)
        {
            _filters[i].SetSelected(i == index);
        }

        int visibleCount = 0;
        int urgentCount = 0;
        for (int i = 0; i < _objectiveCount; i++)
        {
            ref var objective = ref _objectives[i];
            bool isVisible = key is null || objective.MatchesStatus(key);
            objective.SetVisible(isVisible);
            if (isVisible)
            {
                visibleCount++;
                if (objective.IsUrgent)
                {
                    urgentCount++;
                }
            }
        }

        SummaryText.Text = BuildSummary(visibleCount, _objectiveCount, urgentCount);
    }

    private void OnFilterSelected(int index)
    {
        SelectFilter(index);
    }

    private int CountStatus(string status)
    {
        int count = 0;
        for (int i = 0; i < _objectiveCount; i++)
        {
            if (_objectives[i].MatchesStatus(status))
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

    private static string CreateLabeledOption(string option, int count)
    {
        int digits = CountDigits(count);
        return string.Create(option.Length + digits + 3, (option, count), static (span, state) =>
        {
            var (text, number) = state;
            text.CopyTo(span);
            int offset = text.Length;
            span[offset++] = ' ';
            span[offset++] = '(';
            number.TryFormat(span[offset..], out int written, default);
            span[offset + written] = ')';
        });
    }

    private static string BuildSummary(int visible, int total, int urgent)
    {
        if (total == 0)
        {
            return "No objectives configured";
        }

        Span<char> buffer = stackalloc char[96];
        int offset = 0;

        if (visible == total)
        {
            offset += WriteNumber(buffer[offset..], total);
            if (urgent > 0)
            {
                offset += WriteLiteral(buffer[offset..], " objectives • ");
                offset += WriteNumber(buffer[offset..], urgent);
                offset += WriteLiteral(buffer[offset..], " urgent");
            }
            else
            {
                offset += WriteLiteral(buffer[offset..], " objectives monitored");
            }
        }
        else
        {
            offset += WriteNumber(buffer[offset..], visible);
            offset += WriteLiteral(buffer[offset..], " of ");
            offset += WriteNumber(buffer[offset..], total);
            offset += WriteLiteral(buffer[offset..], " objectives shown");
            if (urgent > 0)
            {
                offset += WriteLiteral(buffer[offset..], " • ");
                offset += WriteNumber(buffer[offset..], urgent);
                offset += WriteLiteral(buffer[offset..], " urgent");
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

    private sealed class FilterPresenter
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

        public FilterPresenter(Panel host, Action<int> callback, Brush background, Brush border, Brush foreground, Brush selectedBackground, Brush selectedBorder, Brush selectedForeground)
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

        public void SetSelected(bool selected)
        {
            if (selected)
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

    private sealed class ObjectivePresenter
    {
        private readonly Border _root;
        private readonly TextBlock _objective;
        private readonly Border _priorityPill;
        private readonly TextBlock _priorityText;
        private readonly TextBlock _competition;
        private readonly TextBlock _deadline;
        private readonly Border _statusContainer;
        private readonly TextBlock _status;
        private readonly TextBlock _notes;
        private string _statusKey = string.Empty;
        private bool _isUrgent;

        public ObjectivePresenter(Panel host)
        {
            _objective = new TextBlock
            {
                FontSize = 15,
                FontWeight = FontWeights.SemiBold,
                Foreground = (Brush)Application.Current.FindResource("PrimaryTextBrush")
            };

            _priorityText = new TextBlock
            {
                FontSize = 12,
                FontWeight = FontWeights.SemiBold,
                Foreground = (Brush)Application.Current.FindResource("PrimaryTextBrush")
            };

            _priorityPill = new Border
            {
                Child = _priorityText,
                CornerRadius = new CornerRadius(8),
                Margin = new Thickness(12, 0, 0, 0),
                Padding = new Thickness(8, 2, 8, 2),
                Visibility = Visibility.Collapsed
            };

            var titlePanel = new StackPanel
            {
                Orientation = Orientation.Horizontal
            };
            titlePanel.Children.Add(_objective);
            titlePanel.Children.Add(_priorityPill);

            _competition = new TextBlock
            {
                FontSize = 13,
                Foreground = (Brush)Application.Current.FindResource("NeutralTextBrush"),
                Margin = new Thickness(0, 6, 12, 0)
            };

            _deadline = new TextBlock
            {
                FontSize = 13,
                Foreground = (Brush)Application.Current.FindResource("PrimaryTextBrush"),
                Margin = new Thickness(6, 0, 0, 0)
            };

            var deadlineLabel = new TextBlock
            {
                FontSize = 13,
                Foreground = (Brush)Application.Current.FindResource("NeutralTextBrush"),
                Text = "Deadline:",
                Margin = new Thickness(0, 6, 0, 0)
            };

            var deadlinePanel = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                Margin = new Thickness(0, 6, 12, 0)
            };
            deadlinePanel.Children.Add(deadlineLabel);
            deadlinePanel.Children.Add(_deadline);

            _status = new TextBlock
            {
                FontSize = 13,
                FontWeight = FontWeights.SemiBold,
                HorizontalAlignment = HorizontalAlignment.Right
            };

            _statusContainer = new Border
            {
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(8),
                Padding = new Thickness(10, 4, 10, 4),
                HorizontalAlignment = HorizontalAlignment.Right,
                Child = _status
            };

            _notes = new TextBlock
            {
                FontSize = 13,
                Foreground = (Brush)Application.Current.FindResource("NeutralTextBrush"),
                TextWrapping = TextWrapping.Wrap,
                Margin = new Thickness(0, 8, 0, 0),
                Visibility = Visibility.Collapsed
            };

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(2, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

            Grid.SetColumnSpan(titlePanel, 3);
            grid.Children.Add(titlePanel);

            Grid.SetRow(_competition, 1);
            Grid.SetColumn(_competition, 0);
            grid.Children.Add(_competition);

            Grid.SetRow(deadlinePanel, 1);
            Grid.SetColumn(deadlinePanel, 1);
            grid.Children.Add(deadlinePanel);

            Grid.SetRow(_statusContainer, 1);
            Grid.SetColumn(_statusContainer, 2);
            grid.Children.Add(_statusContainer);

            Grid.SetRow(_notes, 2);
            Grid.SetColumnSpan(_notes, 3);
            grid.Children.Add(_notes);

            _root = new Border
            {
                Background = BrushUtilities.CreateFrozenBrush("#182436"),
                BorderBrush = BrushUtilities.CreateFrozenBrush("#233246"),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(10),
                Padding = new Thickness(12),
                Margin = new Thickness(0, 0, 0, 12),
                Child = grid
            };

            host.Children.Add(_root);
        }

        public bool IsUrgent => _isUrgent;

        public void Set(in ClubVisionExpectationDefinition definition, Brush background, Brush border, Brush statusBackground, Brush statusBorder, Brush statusForeground)
        {
            _statusKey = definition.Status ?? string.Empty;
            _isUrgent = IsUrgentPriority(definition.Priority);

            _root.Background = background;
            _root.BorderBrush = border;

            _objective.Text = definition.Objective;

            if (!string.IsNullOrWhiteSpace(definition.Accent))
            {
                _priorityPill.Background = BrushUtilities.CreateFrozenBrush(definition.Accent!, (SolidColorBrush?)_pillFallbackBrush);
                _priorityText.Text = definition.Priority;
                _priorityPill.Visibility = Visibility.Visible;
            }
            else if (!string.IsNullOrWhiteSpace(definition.Priority))
            {
                _priorityPill.Background = _pillFallbackBrush;
                _priorityText.Text = definition.Priority!;
                _priorityPill.Visibility = Visibility.Visible;
            }
            else
            {
                _priorityPill.Visibility = Visibility.Collapsed;
            }

            _competition.Text = definition.Competition;
            _deadline.Text = definition.Deadline;

            _statusContainer.Background = statusBackground;
            _statusContainer.BorderBrush = statusBorder;
            _status.Text = definition.Status;
            _status.Foreground = statusForeground;

            if (!string.IsNullOrWhiteSpace(definition.Notes))
            {
                _notes.Text = definition.Notes;
                _notes.Visibility = Visibility.Visible;
            }
            else
            {
                _notes.Visibility = Visibility.Collapsed;
            }

            _root.Visibility = Visibility.Visible;
        }

        public bool MatchesStatus(string status)
        {
            return string.Equals(_statusKey, status, StringComparison.OrdinalIgnoreCase);
        }

        public bool IsVisible => _root.Visibility == Visibility.Visible;

        public void SetVisible(bool visible)
        {
            _root.Visibility = visible ? Visibility.Visible : Visibility.Collapsed;
        }

        public void Hide()
        {
            _root.Visibility = Visibility.Collapsed;
        }

        private static bool IsUrgentPriority(string priority)
        {
            if (string.IsNullOrWhiteSpace(priority))
            {
                return false;
            }

            return string.Equals(priority, "Critical", StringComparison.OrdinalIgnoreCase)
                || string.Equals(priority, "High", StringComparison.OrdinalIgnoreCase);
        }
    }
}
