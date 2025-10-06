using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class InjuryListCard : UserControl, ICardContent
{
    private const int MaxInjuries = 16;

    private readonly MedicalModule _medicalModule;
    private readonly PlayerDatabase _playerDatabase;
    private readonly StringDatabase _stringDatabase;
    private readonly IEventAggregator _eventAggregator;
    private readonly MedicalModule.InjuryView[] _buffer;
    private readonly InjuryPresenter[] _presenters;
    private IDisposable? _subscription;

    public InjuryListCard(
        MedicalModule medicalModule,
        PlayerDatabase playerDatabase,
        StringDatabase stringDatabase,
        IEventAggregator eventAggregator)
    {
        _medicalModule = medicalModule ?? throw new ArgumentNullException(nameof(medicalModule));
        _playerDatabase = playerDatabase ?? throw new ArgumentNullException(nameof(playerDatabase));
        _stringDatabase = stringDatabase ?? throw new ArgumentNullException(nameof(stringDatabase));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));

        InitializeComponent();

        _buffer = new MedicalModule.InjuryView[MaxInjuries];
        _presenters = new InjuryPresenter[MaxInjuries];

        for (int i = 0; i < MaxInjuries; i++)
        {
            var presenter = new InjuryPresenter();
            _presenters[i] = presenter;
            InjuryHost.Children.Add(presenter.Root);
        }

        Reset();
    }

    public CardType Type => CardType.InjuryList;

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
        if (!string.Equals(notification.ModuleId, MedicalModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            return;
        }

        if (!string.Equals(notification.EventType, MedicalModuleEvents.StateUpdated, StringComparison.Ordinal))
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
        int count = _medicalModule.CopyInjuries(span);
        for (int i = 0; i < count; i++)
        {
            ref readonly var entry = ref span[i];
            var presenter = _presenters[i];
            presenter.Set(
                ResolvePlayerName((uint)entry.PlayerId, entry.FirstNameId, entry.LastNameId),
                entry.Injury,
                entry.Status,
                entry.ExpectedReturnWeeks,
                entry.IsDoubtful);
            presenter.Show();
        }

        for (int i = count; i < _presenters.Length; i++)
        {
            _presenters[i].Hide();
        }
    }

    private string ResolvePlayerName(uint playerId, ushort firstNameId, ushort lastNameId)
    {
        if (playerId > 0)
        {
            ref var player = ref _playerDatabase.GetPlayer(playerId);
            firstNameId = player.FirstNameId;
            lastNameId = player.LastNameId;
        }

        string name = _stringDatabase.GetFullName(firstNameId, lastNameId);
        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = _stringDatabase.GetCompactName(firstNameId, lastNameId);
        }

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            return "Player";
        }

        return name;
    }

    private sealed class InjuryPresenter
    {
        private readonly Border _root;
        private readonly TextBlock _name;
        private readonly TextBlock _injury;
        private readonly TextBlock _status;
        private readonly TextBlock _return;

        public InjuryPresenter()
        {
            _name = CreateTextBlock(14, FontWeights.SemiBold, Brushes.White);
            _injury = CreateTextBlock(12, FontWeights.Normal, (Brush)Application.Current.FindResource("NeutralTextBrush"));
            _status = CreateTextBlock(12, FontWeights.Normal, Brushes.White);
            _return = CreateTextBlock(12, FontWeights.Normal, Brushes.White);

            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(120) });

            var stack = new StackPanel
            {
                Orientation = Orientation.Vertical,
                Spacing = 2
            };
            stack.Children.Add(_name);
            stack.Children.Add(_injury);
            Grid.SetColumn(stack, 0);
            grid.Children.Add(stack);

            Grid.SetColumn(_status, 1);
            _status.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_status);

            Grid.SetColumn(_return, 2);
            _return.VerticalAlignment = VerticalAlignment.Center;
            grid.Children.Add(_return);

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

        public void Set(string name, string injury, string status, byte returnWeeks, bool doubtful)
        {
            _name.Text = name;
            _injury.Text = injury;
            _status.Text = doubtful ? string.Concat(status, " (Doubtful)") : status;
            _return.Text = returnWeeks == 0
                ? "Available"
                : string.Format(CultureInfo.InvariantCulture, "{0} week(s)", returnWeeks);
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
