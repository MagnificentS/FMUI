using System;
using System.Globalization;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;
using FMUI.Wpf.Events;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FMUI.Wpf.Controls;

/// <summary>
/// High-performance tactical canvas that renders the current formation without ViewModel indirection.
/// </summary>
public sealed class FormationCanvas : Canvas
{
    private const int PlayerCount = 11;
    private const double PlayerTokenSize = 40d;
    private const double PitchLineThickness = 2d;
    private const double PenaltyAreaDepthRatio = 0.18d;
    private const double PenaltyAreaWidthRatio = 0.6d;
    private const double SixYardDepthRatio = 0.08d;
    private const double SixYardWidthRatio = 0.32d;

    private static readonly object ActiveSync = new();
    private static FormationCanvas?[] s_activeCanvases = new FormationCanvas?[4];
    private static int s_activeCount;
    private static bool s_subscriptionsInitialized;
    private static bool s_eventPumpAttached;
    private static EventSystem? s_eventSystem;
    private static FormationService? s_formationService;
    private static SquadService? s_squadService;
    private static StringDatabase? s_stringDatabase;
    private static readonly EventHandler RenderingPump = OnRendering;

    private static readonly Action<object?> ApplyFormationCallback = state =>
    {
        if (state is FormationCanvas canvas)
        {
            canvas.ApplyPendingFormation();
        }
    };

    private static readonly Action<object?> ApplyPlayerMoveCallback = state =>
    {
        if (state is FormationCanvas canvas)
        {
            canvas.ApplyPendingPlayerMove();
        }
    };

    private readonly PlayerPresenter[] _players;
    private Rectangle? _pitch;
    private Ellipse? _centerCircle;
    private Rectangle? _topPenaltyArea;
    private Rectangle? _bottomPenaltyArea;
    private Rectangle? _topSixYard;
    private Rectangle? _bottomSixYard;
    private Line? _halfwayLine;
    private Ellipse? _centerSpot;

    private FormationData _formation;
    private FormationData _pendingFormation;
    private bool _hasPendingFormation;

    private PendingMove _pendingMove;
    private bool _hasPendingMove;

    private FormationService? _formationService;
    private SquadService? _squadService;
    private StringDatabase? _stringDatabase;

    private bool _isDragging;
    private int _dragIndex;
    private double _dragOffsetX;
    private double _dragOffsetY;

    public FormationCanvas()
    {
        UseLayoutRounding = true;
        ClipToBounds = true;
        Background = Brushes.Transparent;

        _formation = FormationData.Create442();
        _pendingFormation = _formation;
        _players = new PlayerPresenter[PlayerCount];

        InitializePitch();
        InitializePlayers();

        Loaded += OnLoaded;
        Unloaded += OnUnloaded;
        SizeChanged += OnSizeChanged;
    }

    private void OnLoaded(object sender, RoutedEventArgs e)
    {
        RegisterCanvas(this);
    }

    private void OnUnloaded(object sender, RoutedEventArgs e)
    {
        UnregisterCanvas(this);
    }

    private void OnSizeChanged(object sender, SizeChangedEventArgs e)
    {
        UpdatePitchGeometry(e.NewSize.Width, e.NewSize.Height);
        UpdatePlayerPositions();
    }

    private void InitializePitch()
    {
        var gradient = new LinearGradientBrush(Color.FromRgb(0x08, 0x3C, 0x19), Color.FromRgb(0x0C, 0x5A, 0x20), 90d)
        {
            MappingMode = BrushMappingMode.Absolute
        };

        _pitch = new Rectangle
        {
            Fill = gradient,
            RadiusX = 6d,
            RadiusY = 6d
        };

        _centerCircle = new Ellipse
        {
            Stroke = Brushes.White,
            StrokeThickness = PitchLineThickness,
            Fill = Brushes.Transparent
        };

        _halfwayLine = new Line
        {
            Stroke = Brushes.White,
            StrokeThickness = PitchLineThickness
        };

        _centerSpot = new Ellipse
        {
            Width = 6d,
            Height = 6d,
            Fill = Brushes.White
        };

        _topPenaltyArea = new Rectangle
        {
            Stroke = Brushes.White,
            StrokeThickness = PitchLineThickness,
            Fill = Brushes.Transparent
        };

        _bottomPenaltyArea = new Rectangle
        {
            Stroke = Brushes.White,
            StrokeThickness = PitchLineThickness,
            Fill = Brushes.Transparent
        };

        _topSixYard = new Rectangle
        {
            Stroke = Brushes.White,
            StrokeThickness = PitchLineThickness,
            Fill = Brushes.Transparent
        };

        _bottomSixYard = new Rectangle
        {
            Stroke = Brushes.White,
            StrokeThickness = PitchLineThickness,
            Fill = Brushes.Transparent
        };

        Children.Add(_pitch);
        Children.Add(_topPenaltyArea);
        Children.Add(_bottomPenaltyArea);
        Children.Add(_topSixYard);
        Children.Add(_bottomSixYard);
        Children.Add(_centerCircle);
        Children.Add(_halfwayLine);
        Children.Add(_centerSpot);
    }

    private void InitializePlayers()
    {
        for (int i = 0; i < PlayerCount; i++)
        {
            var presenter = new PlayerPresenter(this, i);
            _players[i] = presenter;
            Children.Add(presenter);
        }
    }

    private void UpdatePitchGeometry(double width, double height)
    {
        if (_pitch is null || _centerCircle is null || _halfwayLine is null ||
            _topPenaltyArea is null || _bottomPenaltyArea is null ||
            _topSixYard is null || _bottomSixYard is null || _centerSpot is null)
        {
            return;
        }

        _pitch.Width = width;
        _pitch.Height = height;
        Canvas.SetLeft(_pitch, 0d);
        Canvas.SetTop(_pitch, 0d);

        double circleDiameter = height * 0.2d;
        if (circleDiameter < 60d)
        {
            circleDiameter = 60d;
        }

        _centerCircle.Width = circleDiameter;
        _centerCircle.Height = circleDiameter;
        Canvas.SetLeft(_centerCircle, (width - circleDiameter) * 0.5d);
        Canvas.SetTop(_centerCircle, (height - circleDiameter) * 0.5d);

        _halfwayLine.X1 = 0d;
        _halfwayLine.X2 = width;
        double halfY = height * 0.5d;
        _halfwayLine.Y1 = halfY;
        _halfwayLine.Y2 = halfY;

        double penaltyWidth = width * PenaltyAreaWidthRatio;
        double penaltyHeight = height * PenaltyAreaDepthRatio;
        double penaltyX = (width - penaltyWidth) * 0.5d;

        _topPenaltyArea.Width = penaltyWidth;
        _topPenaltyArea.Height = penaltyHeight;
        Canvas.SetLeft(_topPenaltyArea, penaltyX);
        Canvas.SetTop(_topPenaltyArea, 0d);

        _bottomPenaltyArea.Width = penaltyWidth;
        _bottomPenaltyArea.Height = penaltyHeight;
        Canvas.SetLeft(_bottomPenaltyArea, penaltyX);
        Canvas.SetTop(_bottomPenaltyArea, height - penaltyHeight);

        double sixWidth = width * SixYardWidthRatio;
        double sixHeight = height * SixYardDepthRatio;
        double sixX = (width - sixWidth) * 0.5d;

        _topSixYard.Width = sixWidth;
        _topSixYard.Height = sixHeight;
        Canvas.SetLeft(_topSixYard, sixX);
        Canvas.SetTop(_topSixYard, 0d);

        _bottomSixYard.Width = sixWidth;
        _bottomSixYard.Height = sixHeight;
        Canvas.SetLeft(_bottomSixYard, sixX);
        Canvas.SetTop(_bottomSixYard, height - sixHeight);

        Canvas.SetLeft(_centerSpot, (width - _centerSpot.Width) * 0.5d);
        Canvas.SetTop(_centerSpot, (height - _centerSpot.Height) * 0.5d);
    }

    internal void UpdateFormation(FormationData formation)
    {
        _formation = formation;
        UpdatePlayerPositions();
    }

    private void UpdatePlayerPositions()
    {
        double canvasWidth = ActualWidth;
        double canvasHeight = ActualHeight;

        if (canvasWidth <= 0d || canvasHeight <= 0d)
        {
            return;
        }

        unsafe
        {
            for (int i = 0; i < PlayerCount; i++)
            {
                double x = _formation.PositionX[i];
                double y = _formation.PositionY[i];
                SetPlayerPosition(i, x, y, canvasWidth, canvasHeight);
            }
        }
    }

    private void UpdatePlayerLabels()
    {
        var squad = _squadService;
        var strings = _stringDatabase;

        if (squad is null || strings is null || squad.SquadCount < PlayerCount)
        {
            for (int i = 0; i < PlayerCount; i++)
            {
                _players[i].UpdateFallbackLabel(i);
            }

            return;
        }

        for (int i = 0; i < PlayerCount; i++)
        {
            ref var player = ref squad.GetStartingPlayer(i);
            var fullName = strings.GetFullName(player.FirstNameId, player.LastNameId);
            var compactName = strings.GetCompactName(player.FirstNameId, player.LastNameId);
            _players[i].UpdateLabel(compactName, fullName);
        }
    }

    private void SetPlayerPosition(int index, double normalizedX, double normalizedY, double canvasWidth, double canvasHeight)
    {
        if ((uint)index >= PlayerCount)
        {
            return;
        }

        var presenter = _players[index];
        double maxX = canvasWidth - PlayerTokenSize;
        double maxY = canvasHeight - PlayerTokenSize;

        double clampedX = normalizedX;
        if (clampedX < 0d)
        {
            clampedX = 0d;
        }
        else if (clampedX > 1d)
        {
            clampedX = 1d;
        }

        double clampedY = normalizedY;
        if (clampedY < 0d)
        {
            clampedY = 0d;
        }
        else if (clampedY > 1d)
        {
            clampedY = 1d;
        }

        double pixelX = clampedX * maxX;
        double pixelY = clampedY * maxY;

        Canvas.SetLeft(presenter, pixelX);
        Canvas.SetTop(presenter, pixelY);
    }

    private void BeginDrag(int index, Point pointer)
    {
        if ((uint)index >= PlayerCount || ActualWidth <= 0d || ActualHeight <= 0d)
        {
            return;
        }

        var presenter = _players[index];
        double currentLeft = Canvas.GetLeft(presenter);
        double currentTop = Canvas.GetTop(presenter);

        _dragIndex = index;
        _isDragging = true;
        _dragOffsetX = pointer.X - (currentLeft + (PlayerTokenSize * 0.5d));
        _dragOffsetY = pointer.Y - (currentTop + (PlayerTokenSize * 0.5d));
    }

    private void UpdateDrag(Point pointer)
    {
        if (!_isDragging || _formationService is null || ActualWidth <= 0d || ActualHeight <= 0d)
        {
            return;
        }

        double centerX = pointer.X - _dragOffsetX;
        double centerY = pointer.Y - _dragOffsetY;

        double widthRange = ActualWidth - PlayerTokenSize;
        double heightRange = ActualHeight - PlayerTokenSize;

        if (widthRange <= 0d || heightRange <= 0d)
        {
            return;
        }

        double normalizedX = centerX / widthRange;
        double normalizedY = centerY / heightRange;

        _formationService.MovePlayer(_dragIndex, (float)normalizedX, (float)normalizedY);
        unsafe
        {
            _formation.PositionX[_dragIndex] = (float)normalizedX;
            _formation.PositionY[_dragIndex] = (float)normalizedY;
        }

        SetPlayerPosition(_dragIndex, normalizedX, normalizedY, ActualWidth, ActualHeight);
    }

    private void EndDrag(Point pointer)
    {
        if (!_isDragging)
        {
            return;
        }

        _isDragging = false;
        UpdateDrag(pointer);
    }

    private void ApplyPendingFormation()
    {
        if (!_hasPendingFormation)
        {
            return;
        }

        _formation = _pendingFormation;
        _hasPendingFormation = false;
        UpdatePlayerLabels();
        UpdatePlayerPositions();
    }

    private void ApplyPendingPlayerMove()
    {
        if (!_hasPendingMove)
        {
            return;
        }

        unsafe
        {
            _formation.PositionX[_pendingMove.Index] = _pendingMove.X;
            _formation.PositionY[_pendingMove.Index] = _pendingMove.Y;
        }

        SetPlayerPosition(_pendingMove.Index, _pendingMove.X, _pendingMove.Y, ActualWidth, ActualHeight);
        _hasPendingMove = false;
    }

    private void DispatchFormationUpdate()
    {
        if (Dispatcher.CheckAccess())
        {
            ApplyPendingFormation();
        }
        else
        {
            Dispatcher.Invoke(ApplyFormationCallback, this);
        }
    }

    private void DispatchPlayerMoveUpdate()
    {
        if (Dispatcher.CheckAccess())
        {
            ApplyPendingPlayerMove();
        }
        else
        {
            Dispatcher.Invoke(ApplyPlayerMoveCallback, this);
        }
    }

    private void UpdateFormationImmediate(FormationData formation)
    {
        _formation = formation;
        _pendingFormation = formation;
        _hasPendingFormation = false;
        UpdatePlayerLabels();
        UpdatePlayerPositions();
    }

    private static void RegisterCanvas(FormationCanvas canvas)
    {
        lock (ActiveSync)
        {
            EnsureSubscriptions();
            var formationService = s_formationService;
            canvas.RegisterResolvedServices(formationService, s_squadService, s_stringDatabase);

            if (s_activeCount == s_activeCanvases.Length)
            {
                var newArray = new FormationCanvas[s_activeCount << 1];
                for (int i = 0; i < s_activeCount; i++)
                {
                    newArray[i] = s_activeCanvases[i];
                }

                s_activeCanvases = newArray;
            }

            for (int i = 0; i < s_activeCount; i++)
            {
                if (ReferenceEquals(s_activeCanvases[i], canvas))
                {
                    return;
                }
            }

            s_activeCanvases[s_activeCount] = canvas;
            s_activeCount++;
        }

        if (s_formationService is not null)
        {
            var formation = s_formationService.GetCurrentFormation();
            canvas.UpdateFormationImmediate(formation);
        }

        s_eventSystem?.ProcessEvents();
    }

    private void RegisterResolvedServices(FormationService? formationService, SquadService? squadService, StringDatabase? stringDatabase)
    {
        if (formationService is not null)
        {
            _formationService = formationService;
        }

        if (squadService is not null)
        {
            _squadService = squadService;
        }

        if (stringDatabase is not null)
        {
            _stringDatabase = stringDatabase;
        }

        UpdatePlayerLabels();
    }

    private static void UnregisterCanvas(FormationCanvas canvas)
    {
        lock (ActiveSync)
        {
            for (int i = 0; i < s_activeCount; i++)
            {
                if (ReferenceEquals(s_activeCanvases[i], canvas))
                {
                    int lastIndex = s_activeCount - 1;
                    s_activeCanvases[i] = s_activeCanvases[lastIndex];
                    s_activeCanvases[lastIndex] = null;
                    s_activeCount = lastIndex;
                    break;
                }
            }
        }
    }

    private static unsafe void EnsureSubscriptions()
    {
        if (s_subscriptionsInitialized)
        {
            return;
        }

        var provider = App.ServiceProvider;
        s_eventSystem = provider.GetRequiredService<EventSystem>();
        s_formationService = provider.GetRequiredService<FormationService>();
        s_squadService = provider.GetRequiredService<SquadService>();
        s_stringDatabase = provider.GetRequiredService<StringDatabase>();

        s_eventSystem.Subscribe<FormationChangedEvent>(EventCatalog.Formation.FormationChanged, &OnFormationChanged, null);
        s_eventSystem.Subscribe<PlayerPositionChangedEvent>(EventCatalog.Formation.PlayerPositionChanged, &OnPlayerPositionChanged, null);

        if (!s_eventPumpAttached)
        {
            CompositionTarget.Rendering += RenderingPump;
            s_eventPumpAttached = true;
        }

        s_subscriptionsInitialized = true;
    }

    private static void OnRendering(object? sender, EventArgs e)
    {
        s_eventSystem?.ProcessEvents();
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private static unsafe void OnFormationChanged(FormationChangedEvent* evt)
    {
        var formation = evt->Formation;

        lock (ActiveSync)
        {
            for (int i = 0; i < s_activeCount; i++)
            {
                var canvas = s_activeCanvases[i];
                if (canvas is null)
                {
                    continue;
                }

                canvas._pendingFormation = formation;
                canvas._hasPendingFormation = true;
                canvas.DispatchFormationUpdate();
            }
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private static unsafe void OnPlayerPositionChanged(PlayerPositionChangedEvent* evt)
    {
        var index = evt->Index;
        var x = evt->X;
        var y = evt->Y;

        lock (ActiveSync)
        {
            for (int i = 0; i < s_activeCount; i++)
            {
                var canvas = s_activeCanvases[i];
                if (canvas is null)
                {
                    continue;
                }

                canvas._pendingMove = new PendingMove
                {
                    Index = index,
                    X = x,
                    Y = y
                };
                canvas._hasPendingMove = true;
                canvas.DispatchPlayerMoveUpdate();
            }
        }
    }

    private struct PendingMove
    {
        public int Index;
        public float X;
        public float Y;
    }

    public void ResetState()
    {
        _hasPendingFormation = false;
        _hasPendingMove = false;
        _pendingFormation = _formationService is not null
            ? _formationService.GetCurrentFormation()
            : FormationData.Create442();
        _formation = _pendingFormation;
        UpdatePlayerLabels();
        UpdatePlayerPositions();
    }

    private sealed class PlayerPresenter : Canvas
    {
        private readonly FormationCanvas _owner;
        private readonly int _index;
        private readonly Ellipse _token;
        private readonly TextBlock _label;

        public PlayerPresenter(FormationCanvas owner, int index)
        {
            _owner = owner;
            _index = index;
            Width = PlayerTokenSize;
            Height = PlayerTokenSize;
            IsHitTestVisible = true;

            _token = new Ellipse
            {
                Width = PlayerTokenSize,
                Height = PlayerTokenSize,
                Fill = Brushes.Crimson,
                Stroke = Brushes.White,
                StrokeThickness = 2d
            };

            _label = new TextBlock
            {
                Width = PlayerTokenSize,
                Height = PlayerTokenSize,
                Text = string.Empty,
                Foreground = Brushes.White,
                FontWeight = FontWeights.Bold,
                FontSize = 16d,
                TextAlignment = TextAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };

            Children.Add(_token);
            Children.Add(_label);
            UpdateFallbackLabel(index);
        }

        public void UpdateLabel(string compact, string full)
        {
            _label.Text = compact;
            ToolTipService.SetToolTip(this, full);
        }

        public void UpdateFallbackLabel(int ordinal)
        {
            string fallback = (ordinal + 1).ToString(CultureInfo.InvariantCulture);
            _label.Text = fallback;
            ToolTipService.SetToolTip(this, fallback);
        }

        protected override void OnMouseLeftButtonDown(MouseButtonEventArgs e)
        {
            base.OnMouseLeftButtonDown(e);
            CaptureMouse();
            var position = e.GetPosition(_owner);
            _owner.BeginDrag(_index, position);
            e.Handled = true;
        }

        protected override void OnMouseMove(MouseEventArgs e)
        {
            base.OnMouseMove(e);
            if (IsMouseCaptured)
            {
                var position = e.GetPosition(_owner);
                _owner.UpdateDrag(position);
            }
        }

        protected override void OnMouseLeftButtonUp(MouseButtonEventArgs e)
        {
            base.OnMouseLeftButtonUp(e);
            if (IsMouseCaptured)
            {
                ReleaseMouseCapture();
                var position = e.GetPosition(_owner);
                _owner.EndDrag(position);
                e.Handled = true;
            }
        }
    }
}
