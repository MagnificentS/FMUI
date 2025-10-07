using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using FMUI.Wpf.Collections;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;
using FMUI.Wpf.ViewModels;
using Xunit;

namespace FMUI.Wpf.Tests;

public sealed class CardPresenterTests
{
    [Fact]
    public void RefreshDefinition_ReappliesGeometryAndNotifiesBindings()
    {
        var presenter = new CardPresenter(
            CreateDefinition("card-1", column: 0, row: 0, columnSpan: 4, rowSpan: 4),
            CardSurfaceMetrics.Default,
            new StubInteractionService(),
            new StubClubDataService(),
            "tab",
            "section");

        var changed = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        presenter.PropertyChanged += (_, args) =>
        {
            if (!string.IsNullOrEmpty(args.PropertyName))
            {
                changed.Add(args.PropertyName!);
            }
        };

        var updatedDefinition = CreateDefinition("card-1", column: 5, row: 3, columnSpan: 2, rowSpan: 6);

        presenter.RefreshDefinition(updatedDefinition, isInitialDefinition: false);

        Assert.Equal(5, presenter.Geometry.Column);
        Assert.Equal(3, presenter.Geometry.Row);
        Assert.Equal(2, presenter.Geometry.ColumnSpan);
        Assert.Equal(6, presenter.Geometry.RowSpan);
        Assert.Contains(nameof(CardPresenter.Left), changed);
        Assert.Contains(nameof(CardPresenter.Top), changed);
        Assert.Contains(nameof(CardPresenter.Width), changed);
        Assert.Contains(nameof(CardPresenter.Height), changed);
    }

    private static CardDefinition CreateDefinition(string id, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            id,
            "Title",
            null,
            CardKind.List,
            column,
            row,
            columnSpan,
            rowSpan);
    }
}

public sealed class CardSurfaceViewModelTests
{
    [Fact]
    public void ReloadingLayout_ReusesExistingCardAndAppliesDefinitionGeometry()
    {
        var catalog = new StubCardLayoutCatalog();
        var stateService = new StubCardLayoutStateService();
        var interactionService = new StubInteractionService();
        var editorCatalog = new StubCardEditorCatalog();
        var clubDataService = new StubClubDataService();
        var eventAggregator = new EventAggregator();

        catalog.SetLayout("tab", "section", CreateLayout("tab", "section", CreateDefinition("card-1", 0, 0, 4, 4)));

        var viewModel = new CardSurfaceViewModel(
            catalog,
            interactionService,
            stateService,
            editorCatalog,
            eventAggregator,
            clubDataService);

        eventAggregator.Publish(new NavigationSectionChangedEvent("tab", "section"));

        Assert.Single(viewModel.Cards);
        var originalCard = viewModel.Cards[0];

        catalog.SetLayout("tab", "section", CreateLayout("tab", "section", CreateDefinition("card-1", 6, 5, 3, 7)));
        catalog.RaiseLayoutsChanged(("tab", "section"));

        Assert.Single(viewModel.Cards);
        var updatedCard = viewModel.Cards[0];
        Assert.Same(originalCard, updatedCard);
        Assert.Equal(6, updatedCard.Geometry.Column);
        Assert.Equal(5, updatedCard.Geometry.Row);
        Assert.Equal(3, updatedCard.Geometry.ColumnSpan);
        Assert.Equal(7, updatedCard.Geometry.RowSpan);
    }

    [Fact]
    public void ReloadingLayout_WithPersistedGeometry_OverridesDefinition()
    {
        var catalog = new StubCardLayoutCatalog();
        var stateService = new StubCardLayoutStateService();
        var interactionService = new StubInteractionService();
        var editorCatalog = new StubCardEditorCatalog();
        var clubDataService = new StubClubDataService();
        var eventAggregator = new EventAggregator();

        catalog.SetLayout("tab", "section", CreateLayout("tab", "section", CreateDefinition("card-1", 0, 0, 4, 4)));

        var viewModel = new CardSurfaceViewModel(
            catalog,
            interactionService,
            stateService,
            editorCatalog,
            eventAggregator,
            clubDataService);

        eventAggregator.Publish(new NavigationSectionChangedEvent("tab", "section"));

        Assert.Single(viewModel.Cards);
        var originalCard = viewModel.Cards[0];

        stateService.SetGeometry("tab", "section", originalCard.Id, new CardGeometry(1, 2, 5, 3));

        catalog.SetLayout("tab", "section", CreateLayout("tab", "section", CreateDefinition("card-1", 6, 7, 2, 2)));
        catalog.RaiseLayoutsChanged(("tab", "section"));

        Assert.Single(viewModel.Cards);
        var updatedCard = viewModel.Cards[0];
        Assert.Same(originalCard, updatedCard);
        Assert.Equal(1, updatedCard.Geometry.Column);
        Assert.Equal(2, updatedCard.Geometry.Row);
        Assert.Equal(5, updatedCard.Geometry.ColumnSpan);
        Assert.Equal(3, updatedCard.Geometry.RowSpan);
    }

    private static CardDefinition CreateDefinition(string id, int column, int row, int columnSpan, int rowSpan)
    {
        return new CardDefinition(
            id,
            "Title",
            null,
            CardKind.List,
            column,
            row,
            columnSpan,
            rowSpan);
    }

    private static CardLayout CreateLayout(string tab, string section, CardDefinition definition)
    {
        return new CardLayout(
            tab,
            section,
            new[] { definition },
            Array.Empty<CardPresetDefinition>());
    }
}

internal sealed class StubInteractionService : ICardInteractionService
{
    public bool HasSelection => false;

    public bool CanUndo => false;

    public bool CanRedo => false;

    public event EventHandler? SelectionChanged
    {
        add { }
        remove { }
    }

    public event EventHandler? HistoryChanged
    {
        add { }
        remove { }
    }

    public event EventHandler<IReadOnlyList<CardPreviewSnapshot>>? PreviewChanged
    {
        add { }
        remove { }
    }

    public event EventHandler<CardMutationEventArgs>? CardsMutated
    {
        add { }
        remove { }
    }

    public void Initialize(CardSurfaceMetrics metrics)
    {
    }

    public void SetActiveSection(string tabIdentifier, string sectionIdentifier)
    {
    }

    public void SetCards(IReadOnlyList<CardPresenter> cards)
    {
    }

    public void SelectCard(CardPresenter card, SelectionModifier modifier)
    {
    }

    public void ClearSelection()
    {
    }

    public void BeginDrag(CardPresenter card)
    {
    }

    public void UpdateDrag(CardPresenter card, CardDragDelta delta)
    {
    }

    public void CompleteDrag(CardPresenter card, CardDragCompleted completed)
    {
    }

    public void BeginResize(CardPresenter card, ResizeHandle handle)
    {
    }

    public void UpdateResize(CardPresenter card, CardResizeDelta delta)
    {
    }

    public void CompleteResize(CardPresenter card, CardResizeCompleted completed)
    {
    }

    public void BeginPlayerDrag(CardPresenter card, FormationPlayerViewModel player)
    {
    }

    public void UpdatePlayerDrag(CardPresenter card, FormationPlayerViewModel player, FormationPlayerDragDelta delta)
    {
    }

    public void CompletePlayerDrag(CardPresenter card, FormationPlayerViewModel player, FormationPlayerDragCompleted completed)
    {
    }

    public void UpdateViewport(Rect viewport)
    {
    }

    public void NudgeSelection(int columnDelta, int rowDelta)
    {
    }

    public CardPresenter CreateCard(CardDefinition definition, bool isCustom, string? presetId)
    {
        throw new NotSupportedException();
    }

    public void RemoveCards(IReadOnlyList<CardPresenter> cards)
    {
    }

    public IReadOnlyList<CardPresenter> GetSelectedCards()
    {
        return Array.Empty<CardPresenter>();
    }

    public void Undo()
    {
    }

    public void Redo()
    {
    }
}

internal sealed class StubClubDataService : IClubDataService
{
    public ClubDataSnapshot Current => throw new NotSupportedException();

    public event EventHandler<ClubDataSnapshot>? SnapshotChanged
    {
        add { }
        remove { }
    }

    public Task RefreshAsync(CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Func<ClubDataSnapshot, ClubDataSnapshot> updater, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}

internal sealed class StubCardEditorCatalog : ICardEditorCatalog
{
    public bool SupportsEditing(string tabIdentifier, string sectionIdentifier, CardDefinition definition) => false;

    public CardEditorViewModel? CreateEditor(string tabIdentifier, string sectionIdentifier, CardDefinition definition) => null;
}

internal sealed class StubCardLayoutStateService : ICardLayoutStateService
{
    private readonly Dictionary<(string Tab, string Section, string CardId), CardGeometry> _geometries = new(StringComparer.OrdinalIgnoreCase);

    public bool TryGetGeometry(string tabIdentifier, string sectionIdentifier, string cardId, out CardGeometry geometry)
    {
        return _geometries.TryGetValue((tabIdentifier, sectionIdentifier, cardId), out geometry);
    }

    public void UpdateGeometry(string tabIdentifier, string sectionIdentifier, string cardId, CardGeometry geometry)
    {
        _geometries[(tabIdentifier, sectionIdentifier, cardId)] = geometry;
    }

    public void ResetSection(string tabIdentifier, string sectionIdentifier)
    {
        var keys = _geometries.Keys
            .Where(key => string.Equals(key.Tab, tabIdentifier, StringComparison.OrdinalIgnoreCase) &&
                          string.Equals(key.Section, sectionIdentifier, StringComparison.OrdinalIgnoreCase))
            .ToArray();

        foreach (var key in keys)
        {
            _geometries.Remove(key);
        }
    }

    public bool TryGetFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, out IReadOnlyList<FormationPlayerState> players)
    {
        players = Array.Empty<FormationPlayerState>();
        return false;
    }

    public void UpdateFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, IReadOnlyList<FormationPlayerState> players)
    {
    }

    public void SetGeometry(string tabIdentifier, string sectionIdentifier, string cardId, CardGeometry geometry)
    {
        _geometries[(tabIdentifier, sectionIdentifier, cardId)] = geometry;
    }
}

internal sealed class StubCardLayoutCatalog : ICardLayoutCatalog
{
    private readonly Dictionary<(string Tab, string Section), CardLayout> _layouts = new(StringComparer.OrdinalIgnoreCase);

    public event EventHandler<LayoutsChangedEventArgs>? LayoutsChanged;

    public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout)
    {
        return _layouts.TryGetValue((tabIdentifier, sectionIdentifier), out layout);
    }

    public void SetLayout(string tabIdentifier, string sectionIdentifier, CardLayout layout)
    {
        _layouts[(tabIdentifier, sectionIdentifier)] = layout;
    }

    public void RaiseLayoutsChanged(params (string Tab, string Section)[] sections)
    {
        var payload = sections.Length == 0 ? Array.Empty<(string Tab, string Section)>() : sections;
        LayoutsChanged?.Invoke(
            this,
            new LayoutsChangedEventArgs(
                new ArrayReadOnlyList<(string Tab, string Section)>(payload, payload.Length),
                isGlobal: false));
    }
}
