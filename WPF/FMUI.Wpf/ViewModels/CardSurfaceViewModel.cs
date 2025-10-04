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
using FMUI.Wpf.ViewModels.Editors;

namespace FMUI.Wpf.ViewModels;

public sealed class CardSurfaceViewModel : ObservableObject, IDisposable
{
    private readonly ICardLayoutCatalog _catalog;
    private readonly ICardInteractionService _interactionService;
    private readonly ICardLayoutStateService _stateService;
    private readonly ICardEditorCatalog _editorCatalog;
    private readonly IClubDataService _clubDataService;
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
    private readonly ObservableCollection<CardPresetViewModel> _palette = new();
    private readonly RelayCommand _openPaletteCommand;
    private readonly RelayCommand _closePaletteCommand;
    private readonly RelayCommand _createCardCommand;
    private readonly RelayCommand _removeSelectedCardsCommand;
    private readonly RelayCommand _closeEditorCommand;
    private string _currentTabIdentifier = string.Empty;
    private string _currentSectionIdentifier = string.Empty;
    private CardEditorViewModel? _activeEditor;
    private bool _isEditorOpen;

    public CardSurfaceViewModel(
        ICardLayoutCatalog catalog,
        ICardInteractionService interactionService,
        ICardLayoutStateService stateService,
        ICardEditorCatalog editorCatalog,
        IEventAggregator eventAggregator,
        IClubDataService clubDataService)
    {
        _catalog = catalog;
        _interactionService = interactionService;
        _stateService = stateService;
        _editorCatalog = editorCatalog;
        _clubDataService = clubDataService;
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
        _openPaletteCommand = new RelayCommand(() => IsPaletteOpen = true, () => _palette.Count > 0);
        _closePaletteCommand = new RelayCommand(() => IsPaletteOpen = false);
        _createCardCommand = new RelayCommand(CreateSelectedCard, () => SelectedPreset is not null);
        _removeSelectedCardsCommand = new RelayCommand(RemoveSelectedCards, () => _interactionService.HasSelection);
        _closeEditorCommand = new RelayCommand(CloseEditor);
        _interactionService.SelectionChanged += OnSelectionChanged;
        _interactionService.HistoryChanged += OnHistoryChanged;
        _interactionService.PreviewChanged += OnPreviewChanged;
        _interactionService.CardsMutated += OnCardsMutated;
        Previews = new ReadOnlyObservableCollection<CardPreviewViewModel>(_previews);
        Palette = new ReadOnlyObservableCollection<CardPresetViewModel>(_palette);
        _catalog.LayoutsChanged += OnLayoutsChanged;
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

    public ReadOnlyObservableCollection<CardPresetViewModel> Palette { get; }

    private bool _isPaletteOpen;
    public bool IsPaletteOpen
    {
        get => _isPaletteOpen;
        private set
        {
            if (SetProperty(ref _isPaletteOpen, value) && value)
            {
                if (SelectedPreset is null && _palette.Count > 0)
                {
                    SelectedPreset = _palette[0];
                }
            }
        }
    }

    private CardPresetViewModel? _selectedPreset;
    public CardPresetViewModel? SelectedPreset
    {
        get => _selectedPreset;
        set
        {
            if (SetProperty(ref _selectedPreset, value))
            {
                _createCardCommand.RaiseCanExecuteChanged();
            }
        }
    }

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

    public ICommand OpenPaletteCommand => _openPaletteCommand;

    public ICommand ClosePaletteCommand => _closePaletteCommand;

    public ICommand CreateCardCommand => _createCardCommand;

    public ICommand RemoveSelectedCardsCommand => _removeSelectedCardsCommand;

    public ICommand CloseEditorCommand => _closeEditorCommand;

    public CardEditorViewModel? ActiveEditor
    {
        get => _activeEditor;
        private set => SetProperty(ref _activeEditor, value);
    }

    public bool IsEditorOpen
    {
        get => _isEditorOpen;
        private set => SetProperty(ref _isEditorOpen, value);
    }

    public void Dispose()
    {
        Cards.CollectionChanged -= OnCardsCollectionChanged;
        _interactionService.SelectionChanged -= OnSelectionChanged;
        _interactionService.HistoryChanged -= OnHistoryChanged;
        _interactionService.PreviewChanged -= OnPreviewChanged;
        _interactionService.CardsMutated -= OnCardsMutated;
        _subscription.Dispose();
        _catalog.LayoutsChanged -= OnLayoutsChanged;
        _interactionService.SetCards(Array.Empty<CardViewModel>());
    }

    private void Clear()
    {
        Cards.Clear();
        EmptyMessage = "Select a section to view its tactical dashboard.";
        _interactionService.SetActiveSection(string.Empty, string.Empty);
        _interactionService.SetCards(Array.Empty<CardViewModel>());
        _palette.Clear();
        SelectedPreset = null;
        IsPaletteOpen = false;
        CloseEditor();
        _openPaletteCommand.RaiseCanExecuteChanged();
        _removeSelectedCardsCommand.RaiseCanExecuteChanged();
        _currentTabIdentifier = string.Empty;
        _currentSectionIdentifier = string.Empty;
    }

    private void LoadSection(string tabIdentifier, string sectionIdentifier)
    {
        _palette.Clear();
        SelectedPreset = null;
        IsPaletteOpen = false;
        CloseEditor();
        _currentTabIdentifier = tabIdentifier;
        _currentSectionIdentifier = sectionIdentifier;

        if (_catalog.TryGetLayout(tabIdentifier, sectionIdentifier, out var layout))
        {
            foreach (var preset in layout.Palette)
            {
                _palette.Add(new CardPresetViewModel(preset));
            }

            Cards.Clear();
            _interactionService.SetActiveSection(tabIdentifier, sectionIdentifier);

            foreach (var definition in layout.Cards)
            {
                if (_stateService.IsCardRemoved(tabIdentifier, sectionIdentifier, definition.Id))
                {
                    continue;
                }

                var card = new CardViewModel(definition, Metrics, _interactionService, _clubDataService, isCustom: false, presetId: null);
                ApplyPersistedState(tabIdentifier, sectionIdentifier, card);
                ConfigureEditor(card);
                Cards.Add(card);
            }

            var customCards = _stateService.GetCustomCards(tabIdentifier, sectionIdentifier);
            foreach (var custom in customCards)
            {
                var card = new CardViewModel(custom.Definition, Metrics, _interactionService, _clubDataService, isCustom: true, presetId: custom.PresetId);
                ApplyPersistedState(tabIdentifier, sectionIdentifier, card);
                ConfigureEditor(card);
                Cards.Add(card);
            }

            EmptyMessage = Cards.Count == 0
                ? "No cards pinned yet. Open the catalog to add tactical widgets."
                : null;

            _interactionService.SetCards(Cards);
            _interactionService.UpdateViewport(_viewport);
            _openPaletteCommand.RaiseCanExecuteChanged();
            SelectedPreset = _palette.FirstOrDefault();
            _removeSelectedCardsCommand.RaiseCanExecuteChanged();
        }
        else
        {
            Cards.Clear();
            EmptyMessage = "Layout coming soon for this section.";
            _interactionService.SetActiveSection(string.Empty, string.Empty);
            _interactionService.SetCards(Array.Empty<CardViewModel>());
            _openPaletteCommand.RaiseCanExecuteChanged();
            _removeSelectedCardsCommand.RaiseCanExecuteChanged();
            CloseEditor();
        }
    }

    private void OnLayoutsChanged(object? sender, LayoutsChangedEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(_currentTabIdentifier) || string.IsNullOrWhiteSpace(_currentSectionIdentifier))
        {
            return;
        }

        var shouldReload = e.IsGlobal || e.Sections.Any(section =>
            string.Equals(section.Tab, _currentTabIdentifier, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(section.Section, _currentSectionIdentifier, StringComparison.OrdinalIgnoreCase));

        if (!shouldReload)
        {
            return;
        }

        void Reload() => LoadSection(_currentTabIdentifier, _currentSectionIdentifier);

        var dispatcher = System.Windows.Application.Current?.Dispatcher;
        if (dispatcher is null || dispatcher.CheckAccess())
        {
            Reload();
        }
        else
        {
            dispatcher.Invoke(Reload);
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
        _removeSelectedCardsCommand.RaiseCanExecuteChanged();
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

    private void ApplyPersistedState(string tabIdentifier, string sectionIdentifier, CardViewModel card)
    {
        if (_stateService.TryGetGeometry(tabIdentifier, sectionIdentifier, card.Id, out var geometry))
        {
            card.UpdateGeometry(geometry.Column, geometry.Row, geometry.ColumnSpan, geometry.RowSpan);
        }

        if (card.HasFormationPlayers &&
            _stateService.TryGetFormationPlayers(tabIdentifier, sectionIdentifier, card.Id, out var players))
        {
            card.ApplyFormationState(players);
        }
    }

    private void OnCardsMutated(object? sender, CardMutationEventArgs e)
    {
        if (e.AddedCards.Count > 0)
        {
            foreach (var card in e.AddedCards)
            {
                if (!Cards.Contains(card))
                {
                    Cards.Add(card);
                }
                ConfigureEditor(card);
            }
        }

        if (e.RemovedCards.Count > 0)
        {
            foreach (var card in e.RemovedCards)
            {
                Cards.Remove(card);
            }

            if (e.RemovedCards.Count > 0)
            {
                CloseEditor();
            }
        }

        if (e.Origin == MutationOrigin.User && e.AddedCards.Count > 0)
        {
            IsPaletteOpen = false;
        }

        if (Cards.Count == 0)
        {
            EmptyMessage = "No cards pinned yet. Open the catalog to add tactical widgets.";
        }
        else if (!string.IsNullOrWhiteSpace(EmptyMessage))
        {
            EmptyMessage = null;
        }

        OnPropertyChanged(nameof(HasCards));
    }

    private void CreateSelectedCard()
    {
        var preset = SelectedPreset;
        if (preset is null)
        {
            return;
        }

        var definition = preset.CreateDefinition();
        _interactionService.CreateCard(definition, isCustom: true, presetId: preset.Id);
    }

    private void RemoveSelectedCards()
    {
        var selection = _interactionService.GetSelectedCards();
        if (selection.Count == 0)
        {
            return;
        }

        _interactionService.RemoveCards(selection);
    }

    private void ConfigureEditor(CardViewModel card)
    {
        if (card is null)
        {
            return;
        }

        if (string.IsNullOrWhiteSpace(_currentTabIdentifier) || string.IsNullOrWhiteSpace(_currentSectionIdentifier))
        {
            card.ConfigureEditor(null, false);
            return;
        }

        var supportsEditing = _editorCatalog.SupportsEditing(_currentTabIdentifier, _currentSectionIdentifier, card.Definition);
        card.ConfigureEditor(OnEditorRequested, supportsEditing);
    }

    private void OnEditorRequested(CardViewModel card)
    {
        if (string.IsNullOrWhiteSpace(_currentTabIdentifier) || string.IsNullOrWhiteSpace(_currentSectionIdentifier))
        {
            return;
        }

        var editor = _editorCatalog.CreateEditor(_currentTabIdentifier, _currentSectionIdentifier, card.Definition);
        if (editor is null)
        {
            return;
        }

        CloseEditor();
        IsPaletteOpen = false;
        ActiveEditor = editor;
        ActiveEditor.CloseRequested += OnEditorCloseRequested;
        IsEditorOpen = true;
    }

    private void OnEditorCloseRequested(object? sender, EventArgs e)
    {
        CloseEditor();
    }

    private void CloseEditor()
    {
        if (ActiveEditor is not null)
        {
            ActiveEditor.CloseRequested -= OnEditorCloseRequested;
            ActiveEditor = null;
        }

        IsEditorOpen = false;
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
