using System.Collections.ObjectModel;
using System.Collections.Specialized;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class CardSurfaceViewModel : ObservableObject
{
    private readonly CardLayoutCatalog _catalog;
    private string? _emptyMessage;

    public CardSurfaceViewModel(CardLayoutCatalog catalog)
    {
        _catalog = catalog;
        Metrics = CardSurfaceMetrics.Default;
        Cards.CollectionChanged += OnCardsCollectionChanged;
        EmptyMessage = "Select a section to view its tactical dashboard.";
    }

    public ObservableCollection<CardViewModel> Cards { get; } = new();

    public CardSurfaceMetrics Metrics { get; }

    public double SurfaceWidth => Metrics.SurfaceWidth;

    public double SurfaceHeight => Metrics.SurfaceHeight;

    public bool HasCards => Cards.Count > 0;

    public string? EmptyMessage
    {
        get => _emptyMessage;
        private set => SetProperty(ref _emptyMessage, value);
    }

    public void Clear()
    {
        Cards.Clear();
        EmptyMessage = "Select a section to view its tactical dashboard.";
    }

    public void LoadSection(string tabIdentifier, string sectionIdentifier)
    {
        if (_catalog.TryGetLayout(tabIdentifier, sectionIdentifier, out var layout) && layout.Cards.Count > 0)
        {
            Cards.Clear();
            foreach (var definition in layout.Cards)
            {
                Cards.Add(new CardViewModel(definition, Metrics));
            }

            EmptyMessage = null;
        }
        else
        {
            Cards.Clear();
            EmptyMessage = "Layout coming soon for this section.";
        }
    }

    private void OnCardsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        OnPropertyChanged(nameof(HasCards));
    }
}

public sealed record CardSurfaceMetrics(int Columns, int Rows, double TileSize, double Gap, double Padding)
{
    public static CardSurfaceMetrics Default { get; } = new(37, 19, 32, 6, 18);

    public double SurfaceWidth => Padding * 2 + Columns * TileSize + (Columns - 1) * Gap;

    public double SurfaceHeight => Padding * 2 + Rows * TileSize + (Rows - 1) * Gap;

    public double CalculateLeft(int column) => Padding + column * (TileSize + Gap);

    public double CalculateTop(int row) => Padding + row * (TileSize + Gap);

    public double CalculateWidth(int span) => span * TileSize + (span - 1) * Gap;

    public double CalculateHeight(int span) => span * TileSize + (span - 1) * Gap;
}
