using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;
using FMUI.Wpf.ViewModels;
using NUnit.Framework;

namespace FMUI.Wpf.Tests;

[Category("Cards")]
public sealed class CardPresenterTests
{
    [Test]
    public void UpdateDefinition_ReappliesDefinitionGeometry()
    {
        var definition = new CardDefinition(
            "card-1",
            "Test",
            null,
            CardKind.Metric,
            1,
            2,
            2,
            3);

        var presenter = CreatePresenter(definition);
        var observed = new List<string>();
        presenter.PropertyChanged += CapturePropertyChange;

        var updatedDefinition = definition with
        {
            Column = 4,
            Row = 5,
            ColumnSpan = 3,
            RowSpan = 1
        };

        presenter.UpdateDefinition(updatedDefinition);

        var geometry = presenter.Geometry;
        Assert.That(geometry.Column, Is.EqualTo(4));
        Assert.That(geometry.Row, Is.EqualTo(5));
        Assert.That(geometry.ColumnSpan, Is.EqualTo(3));
        Assert.That(geometry.RowSpan, Is.EqualTo(1));
        Assert.That(observed.Contains(nameof(CardPresenter.Left)), Is.True);
        Assert.That(observed.Contains(nameof(CardPresenter.Top)), Is.True);
        Assert.That(observed.Contains(nameof(CardPresenter.Width)), Is.True);
        Assert.That(observed.Contains(nameof(CardPresenter.Height)), Is.True);

        presenter.PropertyChanged -= CapturePropertyChange;

        void CapturePropertyChange(object? sender, PropertyChangedEventArgs args)
        {
            if (args.PropertyName is not null)
            {
                observed.Add(args.PropertyName);
            }
        }
    }

    [Test]
    public void ApplyPersistedState_OverridesDefinitionGeometry()
    {
        var definition = new CardDefinition(
            "card-2",
            "Test",
            null,
            CardKind.Metric,
            0,
            0,
            2,
            2);

        var presenter = CreatePresenter(definition);
        var updatedDefinition = definition with
        {
            Column = 6,
            Row = 7,
            ColumnSpan = 3,
            RowSpan = 2
        };
        presenter.UpdateDefinition(updatedDefinition);

        var stateService = new TestLayoutStateService();
        var persisted = new CardGeometry(2, 3, 4, 5);
        stateService.UpdateGeometry("tab", "section", presenter.Id, persisted);

        var interactionService = new TestInteractionService();
        var layoutProvider = new TestModuleCardLayoutProvider();
        var surface = CreateSurfaceViewModel(layoutProvider, interactionService, stateService);

        try
        {
            InvokeApplyPersistedState(surface, "tab", "section", presenter);
        }
        finally
        {
            surface.Dispose();
        }

        var geometry = presenter.Geometry;
        Assert.That(geometry.Column, Is.EqualTo(persisted.Column));
        Assert.That(geometry.Row, Is.EqualTo(persisted.Row));
        Assert.That(geometry.ColumnSpan, Is.EqualTo(persisted.ColumnSpan));
        Assert.That(geometry.RowSpan, Is.EqualTo(persisted.RowSpan));
    }

    private static CardPresenter CreatePresenter(CardDefinition definition)
    {
        var interactionService = new TestInteractionService();
        var clubDataService = new NullClubDataService();
        return new CardPresenter(
            definition,
            CardSurfaceMetrics.Default,
            interactionService,
            interactionService,
            clubDataService,
            "tab",
            "section");
    }

    private static CardSurfaceViewModel CreateSurfaceViewModel(
        IModuleCardLayoutProvider layoutProvider,
        TestInteractionService interactionService,
        ICardLayoutStateService stateService)
    {
        var editorCatalog = new NullCardEditorCatalog();
        var aggregator = new EventAggregator();
        var clubDataService = new NullClubDataService();
        return new CardSurfaceViewModel(
            layoutProvider,
            interactionService,
            interactionService,
            interactionService,
            stateService,
            editorCatalog,
            aggregator,
            clubDataService);
    }

    private static void InvokeApplyPersistedState(
        CardSurfaceViewModel surface,
        string tab,
        string section,
        CardPresenter presenter)
    {
        var method = typeof(CardSurfaceViewModel).GetMethod(
            "ApplyPersistedState",
            BindingFlags.Instance | BindingFlags.NonPublic);

        if (method is null)
        {
            throw new InvalidOperationException("Unable to locate ApplyPersistedState method.");
        }

        method.Invoke(surface, new object[] { tab, section, presenter });
    }

    private sealed class TestInteractionService :
        ICardInteractionService,
        ICardInteractionBehavior,
        ICardSelectionBehavior
    {
        public event EventHandler? SelectionChanged;
        public event EventHandler? HistoryChanged;
        public event EventHandler<IReadOnlyList<CardPreviewSnapshot>>? PreviewChanged;
        public event EventHandler<CardMutationEventArgs>? CardsMutated;

        public bool HasSelection => false;
        public bool CanUndo => false;
        public bool CanRedo => false;

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

        public void UpdateViewport(System.Windows.Rect viewport)
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

        public void BeginDrag(string cardId)
        {
        }

        public void UpdateDrag(string cardId, in CardDragDelta delta)
        {
        }

        public void CompleteDrag(string cardId, in CardDragCompleted completed)
        {
        }

        public void BeginResize(string cardId, ResizeHandle handle)
        {
        }

        public void UpdateResize(string cardId, in CardResizeDelta delta)
        {
        }

        public void CompleteResize(string cardId, in CardResizeCompleted completed)
        {
        }

        public void BeginPlayerDrag(string cardId, string playerId)
        {
        }

        public void UpdatePlayerDrag(string cardId, string playerId, in FormationPlayerDragDelta delta)
        {
        }

        public void CompletePlayerDrag(string cardId, string playerId, in FormationPlayerDragCompleted completed)
        {
        }

        public void Select(string cardId, SelectionModifier modifier)
        {
        }

        public bool IsSelected(string cardId)
        {
            return false;
        }

        public IReadOnlyList<string> GetSelection()
        {
            return Array.Empty<string>();
        }
    }

    private sealed class NullClubDataService : IClubDataService
    {
        public ClubDataSnapshot Current => throw new NotImplementedException();

        public event EventHandler<ClubDataSnapshot>? SnapshotChanged;

        public Task RefreshAsync(CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Func<ClubDataSnapshot, ClubDataSnapshot> updater, CancellationToken cancellationToken = default)
        {
            return Task.CompletedTask;
        }
    }

    private sealed class TestLayoutStateService : ICardLayoutStateService
    {
        private GeometryEntry[] _geometryEntries = Array.Empty<GeometryEntry>();
        private int _geometryCount;

        public bool TryGetGeometry(string tabIdentifier, string sectionIdentifier, string cardId, out CardGeometry geometry)
        {
            for (var i = 0; i < _geometryCount; i++)
            {
                ref readonly var entry = ref _geometryEntries[i];
                if (entry.Matches(tabIdentifier, sectionIdentifier, cardId))
                {
                    geometry = entry.Geometry;
                    return true;
                }
            }

            geometry = default;
            return false;
        }

        public void UpdateGeometry(string tabIdentifier, string sectionIdentifier, string cardId, CardGeometry geometry)
        {
            for (var i = 0; i < _geometryCount; i++)
            {
                ref var entry = ref _geometryEntries[i];
                if (entry.Matches(tabIdentifier, sectionIdentifier, cardId))
                {
                    entry.Geometry = geometry;
                    return;
                }
            }

            EnsureGeometryCapacity(_geometryCount + 1);
            _geometryEntries[_geometryCount] = new GeometryEntry(tabIdentifier, sectionIdentifier, cardId, geometry);
            _geometryCount++;
        }

        public void ResetSection(string tabIdentifier, string sectionIdentifier)
        {
        }

        public bool TryGetFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, out IReadOnlyList<FormationPlayerState> players)
        {
            players = Array.Empty<FormationPlayerState>();
            return false;
        }

        public void UpdateFormationPlayers(string tabIdentifier, string sectionIdentifier, string cardId, IReadOnlyList<FormationPlayerState> players)
        {
        }

        private void EnsureGeometryCapacity(int capacity)
        {
            if (_geometryEntries.Length >= capacity)
            {
                return;
            }

            var newSize = _geometryEntries.Length == 0 ? 4 : _geometryEntries.Length * 2;
            if (newSize < capacity)
            {
                newSize = capacity;
            }

            Array.Resize(ref _geometryEntries, newSize);
        }

        private readonly struct GeometryEntry
        {
            public GeometryEntry(string tab, string section, string cardId, CardGeometry geometry)
            {
                Tab = tab;
                Section = section;
                CardId = cardId;
                Geometry = geometry;
            }

            public string Tab { get; }
            public string Section { get; }
            public string CardId { get; }
            public CardGeometry Geometry { get; set; }

            public bool Matches(string tab, string section, string cardId)
            {
                return string.Equals(Tab, tab, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(Section, section, StringComparison.OrdinalIgnoreCase) &&
                    string.Equals(CardId, cardId, StringComparison.OrdinalIgnoreCase);
            }
        }
    }

    private sealed class NullCardEditorCatalog : ICardEditorCatalog
    {
        public bool SupportsEditing(string tabIdentifier, string sectionIdentifier, CardDefinition definition)
        {
            return false;
        }

        public ViewModels.Editors.CardEditorViewModel? CreateEditor(string tabIdentifier, string sectionIdentifier, CardDefinition definition)
        {
            return null;
        }
    }

    private sealed class TestModuleCardLayoutProvider : IModuleCardLayoutProvider
    {
        public event EventHandler<ModuleLayoutChangedEventArgs>? LayoutChanged;

        public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout, out ModuleLayoutKind layoutKind)
        {
            layout = CardLayout.Empty;
            layoutKind = ModuleLayoutKind.Module;
            return false;
        }
    }
}
