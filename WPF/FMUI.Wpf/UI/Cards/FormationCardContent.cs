using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using FMUI.Wpf.Controls;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.UI.Cards;

public sealed class FormationCardContent : ICardContent
{
    private const int PlayerCount = 11;

    private readonly Border _root;
    private readonly FormationCanvas _canvas;
    private readonly TextBlock[] _playerLabels;
    private readonly SquadService _squadService;
    private readonly StringDatabase _stringDatabase;

    public FormationCardContent(SquadService squadService, StringDatabase stringDatabase)
    {
        _squadService = squadService;
        _stringDatabase = stringDatabase;

        _playerLabels = new TextBlock[PlayerCount];

        _canvas = new FormationCanvas
        {
            HorizontalAlignment = HorizontalAlignment.Stretch,
            VerticalAlignment = VerticalAlignment.Stretch,
            MinHeight = 320d
        };

        var grid = new Grid
        {
            Margin = new Thickness(0)
        };
        grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
        grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

        var pitchBorder = new Border
        {
            Background = new SolidColorBrush(Color.FromRgb(0x0E, 0x40, 0x22)),
            CornerRadius = new CornerRadius(16),
            Padding = new Thickness(18),
            BorderBrush = new SolidColorBrush(Color.FromRgb(0x1A, 0xBF, 0x8F)),
            BorderThickness = new Thickness(1d),
            Child = _canvas
        };

        grid.Children.Add(pitchBorder);

        var listPanel = new UniformGrid
        {
            Columns = 2,
            Margin = new Thickness(0, 16, 0, 0)
        };

        for (int i = 0; i < PlayerCount; i++)
        {
            var label = new TextBlock
            {
                Foreground = Brushes.White,
                FontSize = 14,
                Margin = new Thickness(0, 2, 16, 2),
                TextTrimming = TextTrimming.CharacterEllipsis
            };

            _playerLabels[i] = label;
            listPanel.Children.Add(label);
        }

        Grid.SetRow(listPanel, 1);
        grid.Children.Add(listPanel);

        _root = new Border
        {
            Background = Brushes.Transparent,
            Child = grid
        };

        UpdatePlayerNames();
    }

    public CardType Type => CardType.TacticalOverview;

    public FrameworkElement View => _root;

    public void Attach(in CardContentContext context)
    {
        UpdatePlayerNames();
    }

    public void Update(in CardContentContext context)
    {
        UpdatePlayerNames();
    }

    public void Detach()
    {
        _canvas.ResetState();
    }

    public void Reset()
    {
        _canvas.ResetState();
        for (int i = 0; i < PlayerCount; i++)
        {
            _playerLabels[i].Text = string.Empty;
        }

        UpdatePlayerNames();
    }

    private void UpdatePlayerNames()
    {
        if (_squadService.SquadCount < PlayerCount)
        {
            for (int i = 0; i < PlayerCount; i++)
            {
                _playerLabels[i].Text = $"{i + 1}. –";
            }

            return;
        }

        for (int i = 0; i < PlayerCount; i++)
        {
            ref var player = ref _squadService.GetStartingPlayer(i);
            var name = _stringDatabase.GetCompactName(player.FirstNameId, player.LastNameId);
            if (string.IsNullOrEmpty(name))
            {
                name = _stringDatabase.GetFullName(player.FirstNameId, player.LastNameId);
            }

            if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
            {
                var digits = CountDigits(player.Id);
                name = string.Create(7 + digits, player.Id, static (span, value) =>
                {
                    "Player ".AsSpan().CopyTo(span);
                    value.TryFormat(span.Slice(7), out _, default, null);
                });
            }

            _playerLabels[i].Text = $"{i + 1}. {name}";
        }
    }

    private static int CountDigits(uint value)
    {
        if (value >= 1_000_000_000u)
        {
            return 10;
        }

        if (value >= 100_000_000u)
        {
            return 9;
        }

        if (value >= 10_000_000u)
        {
            return 8;
        }

        if (value >= 1_000_000u)
        {
            return 7;
        }

        if (value >= 100_000u)
        {
            return 6;
        }

        if (value >= 10_000u)
        {
            return 5;
        }

        if (value >= 1_000u)
        {
            return 4;
        }

        if (value >= 100u)
        {
            return 3;
        }

        if (value >= 10u)
        {
            return 2;
        }

        return 1;
    }
}
