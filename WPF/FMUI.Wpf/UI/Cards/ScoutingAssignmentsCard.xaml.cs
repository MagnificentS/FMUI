using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class ScoutingAssignmentsCard : UserControl, ICardContent
{
    private const int MaxAssignments = 16;
    private const int MaxProspects = 16;

    private readonly ScoutingModule _module;
    private readonly PlayerDatabase _playerDatabase;
    private readonly StringDatabase _stringDatabase;
    private readonly IEventAggregator _eventAggregator;
    private readonly ScoutingModule.ScoutAssignmentView[] _assignmentBuffer;
    private readonly ScoutingModule.ScoutReportView[] _prospectBuffer;
    private readonly AssignmentPresenter[] _assignmentPresenters;
    private readonly ProspectPresenter[] _prospectPresenters;
    private IDisposable? _subscription;

    public ScoutingAssignmentsCard(
        ScoutingModule module,
        PlayerDatabase playerDatabase,
        StringDatabase stringDatabase,
        IEventAggregator eventAggregator)
    {
        _module = module ?? throw new ArgumentNullException(nameof(module));
        _playerDatabase = playerDatabase ?? throw new ArgumentNullException(nameof(playerDatabase));
        _stringDatabase = stringDatabase ?? throw new ArgumentNullException(nameof(stringDatabase));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();

        _assignmentBuffer = new ScoutingModule.ScoutAssignmentView[MaxAssignments];
        _prospectBuffer = new ScoutingModule.ScoutReportView[MaxProspects];
        _assignmentPresenters = new AssignmentPresenter[MaxAssignments];
        _prospectPresenters = new ProspectPresenter[MaxProspects];

        for (int i = 0; i < MaxAssignments; i++)
        {
            var presenter = new AssignmentPresenter();
            _assignmentPresenters[i] = presenter;
            AssignmentsHost.Children.Add(presenter.Root);
        }

        for (int i = 0; i < MaxProspects; i++)
        {
            var presenter = new ProspectPresenter();
            _prospectPresenters[i] = presenter;
            ProspectsHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.ScoutingReport;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        _subscription ??= _eventAggregator.Subscribe<ModuleNotification>(OnModuleNotification);
        RenderState();
    }

    public void Update(in CardContentContext context)
    {
        RenderState();
    }

    public void Detach()
    {
        _subscription?.Dispose();
        _subscription = null;
    }

    public void Reset()
    {
        for (int i = 0; i < _assignmentPresenters.Length; i++)
        {
            _assignmentPresenters[i].Hide();
        }

        for (int i = 0; i < _prospectPresenters.Length; i++)
        {
            _prospectPresenters[i].Hide();
        }
    }

    private void OnModuleNotification(ModuleNotification notification)
    {
        if (!string.Equals(notification.ModuleId, ScoutingModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, ScoutingModuleEvents.StateUpdated, StringComparison.Ordinal))
        {
            return;
        }

        var dispatcher = Application.Current?.Dispatcher;
        if (dispatcher is null)
        {
            RenderState();
            return;
        }

        if (dispatcher.CheckAccess())
        {
            RenderState();
        }
        else
        {
            dispatcher.Invoke(RenderState);
        }
    }

    private void RenderState()
    {
        var assignmentSpan = _assignmentBuffer.AsSpan();
        int assignmentCount = _module.CopyAssignments(assignmentSpan);
        for (int i = 0; i < assignmentCount; i++)
        {
            ref readonly var view = ref assignmentSpan[i];
            var presenter = _assignmentPresenters[i];
            presenter.Set(
                ResolveName(view.ScoutFirstNameId, view.ScoutLastNameId),
                view.Region,
                view.FocusArea,
                view.ProgressPercent,
                view.PriorityLevel);
            presenter.Show();
        }

        for (int i = assignmentCount; i < _assignmentPresenters.Length; i++)
        {
            _assignmentPresenters[i].Hide();
        }

        var prospectSpan = _prospectBuffer.AsSpan();
        int prospectCount = _module.CopyReports(prospectSpan);
        for (int i = 0; i < prospectCount; i++)
        {
            ref readonly var view = ref prospectSpan[i];
            var presenter = _prospectPresenters[i];
            presenter.Set(
                ResolvePlayerName((uint)view.PlayerId, view.PlayerId),
                view.PositionCode,
                view.StatusLabel,
                view.OverallRating,
                view.PotentialRating,
                view.IsPriorityTarget);
            presenter.Show();
        }

        for (int i = prospectCount; i < _prospectPresenters.Length; i++)
        {
            _prospectPresenters[i].Hide();
        }
    }

    private static TextBlock CreateTextBlock(double size, FontWeight weight, Brush brush)
    {
        return new TextBlock
        {
            FontSize = size,
            FontWeight = weight,
            Foreground = brush,
            TextTrimming = TextTrimming.CharacterEllipsis
        };
    }

    private string ResolveName(ushort firstId, ushort lastId)
    {
        string name = _stringDatabase.GetFullName(firstId, lastId);
        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = _stringDatabase.GetCompactName(firstId, lastId);
        }

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            return "Scout";
        }

        return name;
    }

    private string ResolvePlayerName(uint playerId, int fallback)
    {
        if (playerId == 0)
        {
            return string.Create(11, fallback, static (span, id) =>
            {
                "Prospect ".AsSpan().CopyTo(span);
                id.TryFormat(span.Slice(9), out _, default, CultureInfo.InvariantCulture);
            });
        }

        ref var player = ref _playerDatabase.GetPlayer(playerId);
        string name = _stringDatabase.GetCompactName(player.FirstNameId, player.LastNameId);
        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = _stringDatabase.GetFullName(player.FirstNameId, player.LastNameId);
        }

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            return string.Create(11, fallback, static (span, id) =>
            {
                "Prospect ".AsSpan().CopyTo(span);
                id.TryFormat(span.Slice(9), out _, default, CultureInfo.InvariantCulture);
            });
        }

        return name;
    }

    private sealed class AssignmentPresenter
    {
        private readonly Border _root;
        private readonly TextBlock _name;
        private readonly TextBlock _region;
        private readonly TextBlock _focus;
        private readonly TextBlock _progress;
        private readonly TextBlock _priority;

        public AssignmentPresenter()
        {
            _name = CreateRowTextBlock(14, FontWeights.SemiBold, Brushes.White);
            _region = CreateRowTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _focus = CreateRowTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _progress = CreateRowTextBlock(12, FontWeights.Normal, Brushes.White);
            _priority = CreateRowTextBlock(12, FontWeights.Normal, Brushes.White);

            var grid = new Grid
            {
                Margin = new Thickness(0),
            };

            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(140) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(80) });

            var detailPanel = new StackPanel
            {
                Orientation = Orientation.Vertical,
                Spacing = 2
            };
            detailPanel.Children.Add(_name);
            detailPanel.Children.Add(_focus);
            Grid.SetColumn(detailPanel, 0);
            grid.Children.Add(detailPanel);

            Grid.SetColumn(_region, 1);
            _region.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_region);

            Grid.SetColumn(_progress, 2);
            _progress.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_progress);

            Grid.SetColumn(_priority, 3);
            _priority.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_priority);

            _root = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34)),
                BorderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(4),
                Padding = new Thickness(12, 8, 12, 8),
                Child = grid,
                Visibility = Visibility.Collapsed
            };
        }

        public UIElement Root => _root;

        public void Set(string name, string region, string focus, byte progress, byte priority)
        {
            _name.Text = name;
            _region.Text = region;
            _focus.Text = focus;
            _progress.Text = string.Format(CultureInfo.InvariantCulture, "{0}% complete", progress);
            _priority.Text = priority switch
            {
                1 => "High",
                2 => "Medium",
                _ => "Low"
            };
        }

        public void Show() => _root.Visibility = Visibility.Visible;

        public void Hide() => _root.Visibility = Visibility.Collapsed;

        private static TextBlock CreateRowTextBlock(double size, FontWeight weight, Brush brush)
        {
            return CreateTextBlock(size, weight, brush);
        }
    }

    private sealed class ProspectPresenter
    {
        private readonly Border _root;
        private readonly TextBlock _name;
        private readonly TextBlock _position;
        private readonly TextBlock _status;
        private readonly TextBlock _ratings;

        public ProspectPresenter()
        {
            _name = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White);
            _position = CreateTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _status = CreateTextBlock(12, FontWeights.Normal, Brushes.White);
            _ratings = CreateTextBlock(12, FontWeights.Normal, Brushes.White);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(100) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(140) });

            var stack = new StackPanel
            {
                Orientation = Orientation.Vertical,
                Spacing = 2
            };
            stack.Children.Add(_name);
            stack.Children.Add(_position);
            Grid.SetColumn(stack, 0);
            grid.Children.Add(stack);

            Grid.SetColumn(_status, 1);
            _status.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_status);

            Grid.SetColumn(_ratings, 2);
            _ratings.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_ratings);

            _root = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34)),
                BorderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(4),
                Padding = new Thickness(12, 8, 12, 8),
                Child = grid,
                Visibility = Visibility.Collapsed
            };
        }

        public UIElement Root => _root;

        public void Set(string name, string position, string status, byte rating, byte potential, bool priority)
        {
            _name.Text = name;
            _position.Text = position;
            _status.Text = priority ? string.Concat("Priority • ", status) : status;
            _ratings.Text = string.Format(CultureInfo.InvariantCulture, "{0}/100 current • {1}/100 potential", rating, potential);
        }

        public void Show() => _root.Visibility = Visibility.Visible;

        public void Hide() => _root.Visibility = Visibility.Collapsed;
    }
}
