using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class TrainingScheduleCard : UserControl, ICardContent
{
    private const int MaxSessions = 16;

    private readonly TrainingModule _module;
    private readonly IEventAggregator _eventAggregator;
    private readonly TrainingModule.TrainingSessionView[] _buffer;
    private readonly SessionPresenter[] _presenters;
    private IDisposable? _subscription;

    public TrainingScheduleCard(TrainingModule module, IEventAggregator eventAggregator)
    {
        _module = module ?? throw new ArgumentNullException(nameof(module));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();

        _buffer = new TrainingModule.TrainingSessionView[MaxSessions];
        _presenters = new SessionPresenter[MaxSessions];

        for (int i = 0; i < MaxSessions; i++)
        {
            var presenter = new SessionPresenter();
            _presenters[i] = presenter;
            ScheduleHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.TrainingSchedule;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        _subscription ??= _eventAggregator.Subscribe<ModuleNotification>(OnNotification);
        Render();
    }

    public void Update(in CardContentContext context)
    {
        Render();
    }

    public void Detach()
    {
        _subscription?.Dispose();
        _subscription = null;
    }

    public void Reset()
    {
        for (int i = 0; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private void OnNotification(ModuleNotification notification)
    {
        if (!string.Equals(notification.ModuleId, TrainingModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, TrainingModuleEvents.StateUpdated, StringComparison.Ordinal))
        {
            return;
        }

        var dispatcher = Application.Current?.Dispatcher;
        if (dispatcher is null)
        {
            Render();
            return;
        }

        if (dispatcher.CheckAccess())
        {
            Render();
        }
        else
        {
            dispatcher.Invoke(Render);
        }
    }

    private void Render()
    {
        var span = _buffer.AsSpan();
        int count = _module.CopySessions(span);
        for (int i = 0; i < count; i++)
        {
            ref readonly var view = ref span[i];
            var presenter = _presenters[i];
            presenter.Set(view.Day, view.TimeOfDay, view.Focus, view.Intensity, view.IsMatchPreparation);
            presenter.Show();
        }

        for (int i = count; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private sealed class SessionPresenter
    {
        private readonly Border _root;
        private readonly TextBlock _time;
        private readonly TextBlock _focus;
        private readonly TextBlock _intensity;
        private readonly TextBlock _badge;

        public SessionPresenter()
        {
            _time = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White);
            _focus = CreateTextBlock(12, FontWeights.Normal, Brushes.White);
            _intensity = CreateTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _badge = CreateTextBlock(12, FontWeights.SemiBold, Brushes.White);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(90) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });

            Grid.SetColumn(_time, 0);
            grid.Children.Add(_time);
            Grid.SetColumn(_focus, 1);
            grid.Children.Add(_focus);
            Grid.SetColumn(_intensity, 2);
            grid.Children.Add(_intensity);
            Grid.SetColumn(_badge, 3);
            grid.Children.Add(_badge);

            _root = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(0x16, 0x24, 0x34)),
                BorderBrush = new SolidColorBrush(Color.FromRgb(0x1F, 0x2A, 0x39)),
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(4),
                Padding = new Thickness(10, 6, 10, 6),
                Child = grid,
                Visibility = Visibility.Collapsed
            };
        }

        public UIElement Root => _root;

        public void Set(string day, string timeOfDay, string focus, string intensity, bool matchPreparation)
        {
            _time.Text = string.Concat(day, " ", timeOfDay);
            _focus.Text = focus;
            _intensity.Text = intensity;
            _badge.Text = matchPreparation ? "Match Prep" : string.Empty;
        }

        public void Show() => _root.Visibility = Visibility.Visible;

        public void Hide() => _root.Visibility = Visibility.Collapsed;

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
    }
}
