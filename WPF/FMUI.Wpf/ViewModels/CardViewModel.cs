using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.ViewModels;

public sealed class CardViewModel : ObservableObject
{
    private readonly CardDefinition _definition;
    private readonly CardSurfaceMetrics _metrics;
    private readonly ICardInteractionService _interactionService;
    private int _column;
    private int _row;
    private int _columnSpan;
    private int _rowSpan;
    private bool _isVisible = true;
    private bool _isSelected;

    public CardViewModel(CardDefinition definition, CardSurfaceMetrics metrics, ICardInteractionService interactionService)
    {
        _definition = definition;
        _metrics = metrics;
        _interactionService = interactionService;
        _column = definition.Column;
        _row = definition.Row;
        _columnSpan = definition.ColumnSpan;
        _rowSpan = definition.RowSpan;
        ListItems = definition.ListItems is { Count: > 0 }
            ? new ReadOnlyCollection<CardListItemViewModel>(CreateListItems(definition.ListItems))
            : System.Array.Empty<CardListItemViewModel>();
        FormationLines = definition.FormationLines is { Count: > 0 }
            ? new ReadOnlyCollection<FormationLineViewModel>(CreateFormationLines(definition.FormationLines))
            : System.Array.Empty<FormationLineViewModel>();
        BeginDragCommand = new RelayCommand(_ => _interactionService.BeginDrag(this));
        DragDeltaCommand = new RelayCommand(param =>
        {
            if (param is CardDragDelta delta)
            {
                _interactionService.UpdateDrag(this, delta);
            }
        });
        CompleteDragCommand = new RelayCommand(param =>
        {
            var completed = param as CardDragCompleted ?? new CardDragCompleted(false);
            _interactionService.CompleteDrag(this, completed);
        });

        BeginResizeCommand = new RelayCommand(param =>
        {
            if (param is ResizeHandle handle)
            {
                _interactionService.BeginResize(this, handle);
            }
        });

        ResizeDeltaCommand = new RelayCommand(param =>
        {
            if (param is CardResizeDelta delta)
            {
                _interactionService.UpdateResize(this, delta);
            }
        });

        CompleteResizeCommand = new RelayCommand(param =>
        {
            if (param is CardResizeCompleted completed)
            {
                _interactionService.CompleteResize(this, completed);
            }
        });
    }

    public string Title => _definition.Title;

    public string Id => _definition.Id;

    public string? Subtitle => _definition.Subtitle;

    public string? Description => _definition.Description;

    public string? PillText => _definition.PillText;

    public string? MetricValue => _definition.MetricValue;

    public string? MetricLabel => _definition.MetricLabel;

    public CardKind Kind => _definition.Kind;

    public IReadOnlyList<CardListItemViewModel> ListItems { get; }

    public IReadOnlyList<FormationLineViewModel> FormationLines { get; }

    public bool HasSubtitle => !string.IsNullOrWhiteSpace(Subtitle);

    public bool HasDescription => !string.IsNullOrWhiteSpace(Description);

    public bool HasPill => !string.IsNullOrWhiteSpace(PillText);

    public bool HasMetric => !string.IsNullOrWhiteSpace(MetricValue);

    public bool HasListItems => ListItems.Count > 0;

    public bool HasFormation => FormationLines.Count > 0;

    public double Left => _metrics.CalculateLeft(_column);

    public double Top => _metrics.CalculateTop(_row);

    public double Width => _metrics.CalculateWidth(_columnSpan);

    public double Height => _metrics.CalculateHeight(_rowSpan);

    public CardSurfaceMetrics Metrics => _metrics;

    public CardGeometry Geometry => new(_column, _row, _columnSpan, _rowSpan);

    public bool IsVisible
    {
        get => _isVisible;
        private set => SetProperty(ref _isVisible, value);
    }

    public bool IsSelected
    {
        get => _isSelected;
        private set => SetProperty(ref _isSelected, value);
    }

    public ICommand BeginDragCommand { get; }

    public ICommand DragDeltaCommand { get; }

    public ICommand CompleteDragCommand { get; }

    public ICommand BeginResizeCommand { get; }

    public ICommand ResizeDeltaCommand { get; }

    public ICommand CompleteResizeCommand { get; }

    public Rect GetBounds() => new(Left, Top, Width, Height);

    internal void RequestSelection(SelectionModifier modifier)
    {
        _interactionService.SelectCard(this, modifier);
    }

    internal void UpdateGeometry(int column, int row, int columnSpan, int rowSpan)
    {
        if (_column != column)
        {
            _column = column;
            OnPropertyChanged(nameof(Left));
        }

        if (_row != row)
        {
            _row = row;
            OnPropertyChanged(nameof(Top));
        }

        if (_columnSpan != columnSpan)
        {
            _columnSpan = columnSpan;
            OnPropertyChanged(nameof(Width));
        }

        if (_rowSpan != rowSpan)
        {
            _rowSpan = rowSpan;
            OnPropertyChanged(nameof(Height));
        }
    }

    internal void SetVisibility(bool visible)
    {
        IsVisible = visible;
    }

    internal void SetSelected(bool selected)
    {
        IsSelected = selected;
    }

    private static IList<CardListItemViewModel> CreateListItems(IReadOnlyList<CardListItem> items)
    {
        var list = new List<CardListItemViewModel>(items.Count);
        foreach (var item in items)
        {
            list.Add(new CardListItemViewModel(item));
        }

        return list;
    }

    private static IList<FormationLineViewModel> CreateFormationLines(IReadOnlyList<FormationLineDefinition> definitions)
    {
        var lines = new List<FormationLineViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            lines.Add(new FormationLineViewModel(definition.Role, definition.Players));
        }

        return lines;
    }
}

public sealed class CardListItemViewModel
{
    private readonly CardListItem _model;

    public CardListItemViewModel(CardListItem model)
    {
        _model = model;
    }

    public string Primary => _model.Primary;

    public string? Secondary => _model.Secondary;

    public string? Tertiary => _model.Tertiary;

    public string? Accent => _model.Accent;

    public bool HasSecondary => !string.IsNullOrWhiteSpace(Secondary);

    public bool HasTertiary => !string.IsNullOrWhiteSpace(Tertiary);

    public bool HasAccent => !string.IsNullOrWhiteSpace(Accent);
}

public sealed class FormationLineViewModel
{
    public FormationLineViewModel(string role, IReadOnlyList<string> players)
    {
        Role = role;
        Players = new ReadOnlyCollection<string>(new List<string>(players));
    }

    public string Role { get; }

    public IReadOnlyList<string> Players { get; }
}
