using System;
using System.Globalization;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.UI.Cards;

public sealed partial class PlayerDetailCard : UserControl, ICardContent
{
    private const int AttributeCount = 6;

    private static readonly string[] AttributeNames =
    {
        "PAC",
        "DRI",
        "PAS",
        "DEF",
        "PHY",
        "SHO"
    };

    private readonly double[] _attributeValues;
    private readonly TextBlock[] _attributeLabels;
    private readonly PlayerDatabase _playerDatabase;
    private readonly SquadService _squadService;
    private readonly StringDatabase _stringDatabase;
    private readonly PointCollection _polygonPoints;
    private readonly PointCollection _outlinePoints;
    private bool _hasData;
    private uint _currentPlayerId;

    public PlayerDetailCard(PlayerDatabase playerDatabase, SquadService squadService, StringDatabase stringDatabase)
    {
        InitializeComponent();

        _playerDatabase = playerDatabase ?? throw new ArgumentNullException(nameof(playerDatabase));
        _squadService = squadService ?? throw new ArgumentNullException(nameof(squadService));
        _stringDatabase = stringDatabase ?? throw new ArgumentNullException(nameof(stringDatabase));

        _attributeValues = new double[AttributeCount];
        _attributeLabels = new[]
        {
            AttributeLabel0,
            AttributeLabel1,
            AttributeLabel2,
            AttributeLabel3,
            AttributeLabel4,
            AttributeLabel5
        };

        _polygonPoints = new PointCollection(AttributeCount);
        _outlinePoints = new PointCollection(AttributeCount);

        for (int i = 0; i < AttributeCount; i++)
        {
            _polygonPoints.Add(new Point());
            _outlinePoints.Add(new Point());
        }

        RadarPolygon.Points = _polygonPoints;
        RadarOutline.Points = _outlinePoints;

        AttributeCanvas.SizeChanged += OnAttributeCanvasSizeChanged;

        Reset();
    }

    public CardType Type => CardType.PlayerDetail;

    public FrameworkElement View => this;

    public void Attach(in CardContentContext context)
    {
        Update(in context);
    }

    public void Update(in CardContentContext context)
    {
        uint playerId = ResolvePlayerId(in context);
        if (playerId == 0)
        {
            Reset();
            return;
        }

        _currentPlayerId = playerId;
        ref var player = ref _playerDatabase.GetPlayer(playerId);

        UpdateIdentity(ref player);
        UpdateStatus(ref player);
        UpdateMetrics(ref player);
        UpdateRadar(ref player);

        _hasData = true;
        RenderRadar();
    }

    public void Detach()
    {
        _currentPlayerId = 0;
    }

    public void Reset()
    {
        _currentPlayerId = 0;
        _hasData = false;

        NameText.Text = "Player";
        PositionText.Text = "–";
        AgeText.Text = "–";
        FootText.Text = "–";
        OverallValueText.Text = "0";

        FitnessBar.Value = 0;
        FitnessValueText.Text = "0%";
        MoraleBar.Value = 0;
        MoraleValueText.Text = "0%";

        AppearancesValueText.Text = "0";
        GoalsValueText.Text = "0";
        AssistsValueText.Text = "0";
        AverageRatingValueText.Text = "0.00";

        for (int i = 0; i < AttributeCount; i++)
        {
            _attributeValues[i] = 0;
            _attributeLabels[i].Text = AttributeNames[i];
        }

        RenderRadar();
    }

    private static double ScaleAttribute(byte value)
    {
        return Math.Min(100d, value * 6.25d);
    }

    private uint ResolvePlayerId(in CardContentContext context)
    {
        if (context.PrimaryEntityId != 0)
        {
            return context.PrimaryEntityId;
        }

        if (_squadService.SquadCount > 0)
        {
            ref var player = ref _squadService.GetStartingPlayer(0);
            return player.Id;
        }

        return 0;
    }

    private void UpdateIdentity(ref PlayerData player)
    {
        string name = _stringDatabase.GetFullName(player.FirstNameId, player.LastNameId);
        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = CreateFallbackName(player.Id);
        }

        NameText.Text = name;
        PositionText.Text = GetPositionDisplay((PlayerPosition)player.Position);
        AgeText.Text = player.Age > 0 ? player.Age.ToString(CultureInfo.InvariantCulture) : "–";
        FootText.Text = GetPreferredFoot(player.PreferredFoot);

        double overall = Math.Round(player.CurrentAbility / 2.0, MidpointRounding.AwayFromZero);
        OverallValueText.Text = overall.ToString("F0", CultureInfo.InvariantCulture);
    }

    private void UpdateStatus(ref PlayerData player)
    {
        FitnessBar.Value = player.Fitness;
        MoraleBar.Value = player.Morale;
        FitnessValueText.Text = FormatPercentage(player.Fitness);
        MoraleValueText.Text = FormatPercentage(player.Morale);
    }

    private void UpdateMetrics(ref PlayerData player)
    {
        AppearancesValueText.Text = player.MatchesPlayed.ToString(CultureInfo.InvariantCulture);
        GoalsValueText.Text = player.Goals.ToString(CultureInfo.InvariantCulture);
        AssistsValueText.Text = player.Assists.ToString(CultureInfo.InvariantCulture);
        AverageRatingValueText.Text = (player.AverageRating / 10.0).ToString("0.00", CultureInfo.InvariantCulture);
    }

    private void UpdateRadar(ref PlayerData player)
    {
        _attributeValues[0] = ScaleAttribute(player.GetPhysicalAttribute(0));
        _attributeValues[1] = ScaleAttribute(player.GetTechnicalAttribute(1));
        _attributeValues[2] = ScaleAttribute(player.GetTechnicalAttribute(2));
        _attributeValues[3] = ScaleAttribute(player.GetMentalAttribute(0));
        _attributeValues[4] = ScaleAttribute(player.GetPhysicalAttribute(2));
        _attributeValues[5] = ScaleAttribute(player.GetTechnicalAttribute(0));

        for (int i = 0; i < AttributeCount; i++)
        {
            int rounded = (int)Math.Round(_attributeValues[i], MidpointRounding.AwayFromZero);
            _attributeLabels[i].Text = FormatAttributeLabel(AttributeNames[i], rounded);
        }
    }

    private void RenderRadar()
    {
        double width = AttributeCanvas.ActualWidth;
        double height = AttributeCanvas.ActualHeight;
        if (width <= 0d || height <= 0d)
        {
            return;
        }

        double centerX = width * 0.5d;
        double centerY = height * 0.5d;
        double radius = Math.Max(24d, Math.Min(centerX, centerY) - 24d);

        for (int i = 0; i < AttributeCount; i++)
        {
            double angle = (Math.PI * 2d * i / AttributeCount) - (Math.PI * 0.5d);
            double normalized = _hasData ? Math.Max(0.05d, Math.Min(1d, _attributeValues[i] * 0.01d)) : 0.25d;
            double x = centerX + Math.Cos(angle) * radius * normalized;
            double y = centerY + Math.Sin(angle) * radius * normalized;
            _polygonPoints[i] = new Point(x, y);

            double outlineX = centerX + Math.Cos(angle) * radius;
            double outlineY = centerY + Math.Sin(angle) * radius;
            _outlinePoints[i] = new Point(outlineX, outlineY);

            double labelRadius = radius + 18d;
            double labelX = centerX + Math.Cos(angle) * labelRadius;
            double labelY = centerY + Math.Sin(angle) * labelRadius;
            Canvas.SetLeft(_attributeLabels[i], labelX - 22d);
            Canvas.SetTop(_attributeLabels[i], labelY - 10d);
        }

        RadarPolygon.Points = _polygonPoints;
        RadarOutline.Points = _outlinePoints;
    }

    private static string FormatPercentage(byte value)
    {
        int digits = value >= 100 ? 3 : value >= 10 ? 2 : 1;
        return string.Create(digits + 1, value, static (span, number) =>
        {
            number.TryFormat(span, out int written, provider: CultureInfo.InvariantCulture);
            span[written] = '%';
        });
    }

    private static string FormatAttributeLabel(string code, int value)
    {
        int digits = value < 0 ? CountDigits((uint)(-value)) + 1 : CountDigits((uint)value);
        int length = code.Length + 1 + digits;
        return string.Create(length, (code, value), static (span, state) =>
        {
            state.code.AsSpan().CopyTo(span);
            int offset = state.code.Length;
            span[offset] = ' ';
            state.value.TryFormat(span.Slice(offset + 1), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string GetPositionDisplay(PlayerPosition position)
    {
        return position switch
        {
            PlayerPosition.GK => "GK",
            PlayerPosition.CB => "CB",
            PlayerPosition.LB => "LB",
            PlayerPosition.RB => "RB",
            PlayerPosition.DM => "DM",
            PlayerPosition.CM => "CM",
            PlayerPosition.AM => "AM",
            PlayerPosition.LW => "LW",
            PlayerPosition.RW => "RW",
            PlayerPosition.ST => "ST",
            _ => "–"
        };
    }

    private static string GetPreferredFoot(byte foot)
    {
        return foot switch
        {
            0 => "Right",
            1 => "Left",
            2 => "Either",
            _ => "–"
        };
    }

    private static string CreateFallbackName(uint playerId)
    {
        if (playerId == 0)
        {
            return "Player";
        }

        int digitCount = CountDigits(playerId);
        return string.Create(7 + digitCount, playerId, static (span, id) =>
        {
            "Player ".AsSpan().CopyTo(span);
            id.TryFormat(span.Slice(7), out _, default, CultureInfo.InvariantCulture);
        });
    }

    private static int CountDigits(uint value)
    {
        if (value >= 1_000_000_000u) return 10;
        if (value >= 100_000_000u) return 9;
        if (value >= 10_000_000u) return 8;
        if (value >= 1_000_000u) return 7;
        if (value >= 100_000u) return 6;
        if (value >= 10_000u) return 5;
        if (value >= 1_000u) return 4;
        if (value >= 100u) return 3;
        if (value >= 10u) return 2;
        return 1;
    }

    private void OnAttributeCanvasSizeChanged(object sender, SizeChangedEventArgs e)
    {
        RenderRadar();
    }
}
