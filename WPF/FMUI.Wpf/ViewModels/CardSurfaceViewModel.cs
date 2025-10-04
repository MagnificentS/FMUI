using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class CardSurfaceViewModel : ObservableObject, IDisposable
{
    private readonly ICardLayoutCatalog _catalog;
    private readonly ICardInteractionService _interactionService;
    private readonly ICardLayoutStateService _stateService;
    private readonly IDisposable _subscription;
    private string? _emptyMessage;
    private Rect _viewport;
    private readonly RelayCommand _undoCommand;
    private readonly RelayCommand _redoCommand;
    private readonly RelayCommand _nudgeLeftCommand;
    private readonly RelayCommand _nudgeRightCommand;
    private readonly RelayCommand _nudgeUpCommand;
    private readonly RelayCommand _nudgeDownCommand;
    private readonly RelayCommand _clearSelectionCommand;
    private readonly ObservableCollection<CardPreviewViewModel> _previews = new();

    public CardSurfaceViewModel(
        ICardLayoutCatalog catalog,
        ICardInteractionService interactionService,
        ICardLayoutStateService stateService,
        IEventAggregator eventAggregator)
    {
        _catalog = catalog;
        _interactionService = interactionService;
        _stateService = stateService;
        Metrics = CardSurfaceMetrics.Default;
        _viewport = new Rect(0, 0, Metrics.SurfaceWidth, Metrics.SurfaceHeight);
        _interactionService.Initialize(Metrics);
        Cards.CollectionChanged += OnCardsCollectionChanged;
        EmptyMessage = "Select a section to view its tactical dashboard.";
        _subscription = eventAggregator.Subscribe<NavigationSectionChangedEvent>(OnNavigationSectionChanged);
        _undoCommand = new RelayCommand(() => _interactionService.Undo(), () => _interactionService.CanUndo);
        _redoCommand = new RelayCommand(() => _interactionService.Redo(), () => _interactionService.CanRedo);
        _nudgeLeftCommand = CreateNudgeCommand(-1, 0);
        _nudgeRightCommand = CreateNudgeCommand(1, 0);
        _nudgeUpCommand = CreateNudgeCommand(0, -1);
        _nudgeDownCommand = CreateNudgeCommand(0, 1);
        _clearSelectionCommand = new RelayCommand(() => _interactionService.ClearSelection(), () => _interactionService.HasSelection);
        _interactionService.SelectionChanged += OnSelectionChanged;
        _interactionService.HistoryChanged += OnHistoryChanged;
        _interactionService.PreviewChanged += OnPreviewChanged;
        Previews = new ReadOnlyObservableCollection<CardPreviewViewModel>(_previews);
    }

    public ObservableCollection<CardViewModel> Cards { get; } = new();

    public CardSurfaceMetrics Metrics { get; }

    public double SurfaceWidth => Metrics.SurfaceWidth;

    public double SurfaceHeight => Metrics.SurfaceHeight;

    public bool HasCards => Cards.Count > 0;

    public bool HasSelection => _interactionService.HasSelection;

    public ReadOnlyObservableCollection<CardPreviewViewModel> Previews { get; }

    public bool HasPreview => _previews.Count > 0;

    public bool PreviewHasCollision => _previews.Any(preview => !preview.IsValid);

    public string? EmptyMessage
    {
        get => _emptyMessage;
        private set => SetProperty(ref _emptyMessage, value);
    }

    public ICommand UndoCommand => _undoCommand;

    public ICommand RedoCommand => _redoCommand;

    public ICommand NudgeLeftCommand => _nudgeLeftCommand;

    public ICommand NudgeRightCommand => _nudgeRightCommand;

    public ICommand NudgeUpCommand => _nudgeUpCommand;

    public ICommand NudgeDownCommand => _nudgeDownCommand;

    public ICommand ClearSelectionCommand => _clearSelectionCommand;

    public void Dispose()
    {
        Cards.CollectionChanged -= OnCardsCollectionChanged;
        _interactionService.SelectionChanged -= OnSelectionChanged;
        _interactionService.HistoryChanged -= OnHistoryChanged;
        _interactionService.PreviewChanged -= OnPreviewChanged;
        _subscription.Dispose();
        _interactionService.SetCards(Array.Empty<CardViewModel>());
    }

    private void Clear()
    {
        Cards.Clear();
        EmptyMessage = "Select a section to view its tactical dashboard.";
        _interactionService.SetActiveSection(string.Empty, string.Empty);
        _interactionService.SetCards(Array.Empty<CardViewModel>());
    }

    private void LoadSection(string tabIdentifier, string sectionIdentifier)
    {
        if (_catalog.TryGetLayout(tabIdentifier, sectionIdentifier, out var layout) && layout.Cards.Count > 0)
        {
            Cards.Clear();
            _interactionService.SetActiveSection(tabIdentifier, sectionIdentifier);
            foreach (var definition in layout.Cards)
            {
                var card = new CardViewModel(definition, Metrics, _interactionService);
                if (_stateService.TryGetGeometry(tabIdentifier, sectionIdentifier, card.Id, out var geometry))
                {
                    card.UpdateGeometry(geometry.Column, geometry.Row, geometry.ColumnSpan, geometry.RowSpan);
                }

                Cards.Add(card);
            }

            EmptyMessage = null;
            _interactionService.SetCards(Cards);
            _interactionService.UpdateViewport(_viewport);
        }
        else
        {
            Cards.Clear();
            EmptyMessage = "Layout coming soon for this section.";
            _interactionService.SetActiveSection(string.Empty, string.Empty);
            _interactionService.SetCards(Array.Empty<CardViewModel>());
        }
    }

    private void OnNavigationSectionChanged(NavigationSectionChangedEvent navigationEvent)
    {
        if (string.IsNullOrWhiteSpace(navigationEvent.SectionIdentifier))
        {
            Clear();
            return;
        }

        LoadSection(navigationEvent.TabIdentifier, navigationEvent.SectionIdentifier);
    }

    private void OnCardsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        OnPropertyChanged(nameof(HasCards));
    }

    public void UpdateViewport(Rect viewport)
    {
        _viewport = viewport;
        _interactionService.UpdateViewport(viewport);
    }

    private RelayCommand CreateNudgeCommand(int columnDelta, int rowDelta) =>
        new(() => _interactionService.NudgeSelection(columnDelta, rowDelta), () => _interactionService.HasSelection);

    private void OnSelectionChanged(object? sender, EventArgs e)
    {
        OnPropertyChanged(nameof(HasSelection));
        _nudgeLeftCommand.RaiseCanExecuteChanged();
        _nudgeRightCommand.RaiseCanExecuteChanged();
        _nudgeUpCommand.RaiseCanExecuteChanged();
        _nudgeDownCommand.RaiseCanExecuteChanged();
        _clearSelectionCommand.RaiseCanExecuteChanged();
    }

    private void OnHistoryChanged(object? sender, EventArgs e)
    {
        _undoCommand.RaiseCanExecuteChanged();
        _redoCommand.RaiseCanExecuteChanged();
    }

    private void OnPreviewChanged(object? sender, IReadOnlyList<CardPreviewSnapshot> snapshots)
    {
        _previews.Clear();

        foreach (var snapshot in snapshots)
        {
            _previews.Add(new CardPreviewViewModel(snapshot, Metrics));
        }

        OnPropertyChanged(nameof(HasPreview));
        OnPropertyChanged(nameof(PreviewHasCollision));
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

    public int SnapColumn(double left, int span)
    {
        var cellSize = TileSize + Gap;
        var normalized = Math.Round((left - Padding) / cellSize, MidpointRounding.AwayFromZero);
        var column = (int)Math.Clamp(normalized, 0, Columns - span);
        return column;
    }

    public int SnapRow(double top, int span)
    {
        var cellSize = TileSize + Gap;
        var normalized = Math.Round((top - Padding) / cellSize, MidpointRounding.AwayFromZero);
        var row = (int)Math.Clamp(normalized, 0, Rows - span);
        return row;
    }
}

public sealed class CardPreviewViewModel
{
    private readonly CardPreviewSnapshot _snapshot;
    private readonly CardSurfaceMetrics _metrics;

    public CardPreviewViewModel(CardPreviewSnapshot snapshot, CardSurfaceMetrics metrics)
    {
        _snapshot = snapshot;
        _metrics = metrics;
    }

    public string CardId => _snapshot.CardId;

    public double Left => _metrics.CalculateLeft(_snapshot.Geometry.Column);

    public double Top => _metrics.CalculateTop(_snapshot.Geometry.Row);

    public double Width => _metrics.CalculateWidth(_snapshot.Geometry.ColumnSpan);

    public double Height => _metrics.CalculateHeight(_snapshot.Geometry.RowSpan);

    public bool IsValid => _snapshot.IsValid;
}
