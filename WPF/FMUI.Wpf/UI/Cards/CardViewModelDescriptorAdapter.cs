using System;
using System.Diagnostics;
using System.Windows.Input;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed class CardViewModelDescriptorAdapter : ICardPresenterDescriptor
{
    private CardViewModel? _viewModel;
    private string? _cardId;
    private CardDefinition? _definition;
    private ICommand? _beginDragCommand;
    private ICommand? _dragDeltaCommand;
    private ICommand? _completeDragCommand;
    private ICommand? _beginResizeCommand;
    private ICommand? _resizeDeltaCommand;
    private ICommand? _completeResizeCommand;
    private ICommand? _openEditorCommand;
    private CardGeometry _geometry;
    private bool _isSelected;
    private bool _isVisible;
    private bool _isEditorAvailable;

    public CardViewModel? ViewModel => _viewModel;

    public void Attach(CardViewModel viewModel)
    {
        _viewModel = viewModel ?? throw new ArgumentNullException(nameof(viewModel));
        _cardId = viewModel.Id;
        _definition = viewModel.Definition;
        _beginDragCommand = viewModel.BeginDragCommand;
        _dragDeltaCommand = viewModel.DragDeltaCommand;
        _completeDragCommand = viewModel.CompleteDragCommand;
        _beginResizeCommand = viewModel.BeginResizeCommand;
        _resizeDeltaCommand = viewModel.ResizeDeltaCommand;
        _completeResizeCommand = viewModel.CompleteResizeCommand;
        _openEditorCommand = viewModel.OpenEditorCommand;
        RefreshState();
    }

    public void RefreshState()
    {
        if (_viewModel is null)
        {
            _geometry = default;
            _isSelected = false;
            _isVisible = false;
            _isEditorAvailable = false;
            return;
        }

        _geometry = _viewModel.Geometry;
        _isSelected = _viewModel.IsSelected;
        _isVisible = _viewModel.IsVisible;
        _isEditorAvailable = _viewModel.IsEditorAvailable;
    }

    public void Detach()
    {
        _viewModel = null;
        _cardId = null;
        _definition = null;
        _beginDragCommand = null;
        _dragDeltaCommand = null;
        _completeDragCommand = null;
        _beginResizeCommand = null;
        _resizeDeltaCommand = null;
        _completeResizeCommand = null;
        _openEditorCommand = null;
        _geometry = default;
        _isSelected = false;
        _isVisible = false;
        _isEditorAvailable = false;
    }

    private void EnsureAttached()
    {
        if (_viewModel is null)
        {
            throw new InvalidOperationException("Adapter is not attached to a CardViewModel instance.");
        }
    }

    public string CardId
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_cardId is not null);
            return _cardId!;
        }
    }

    public CardDefinition Definition
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_definition is not null);
            return _definition!;
        }
    }

    public CardGeometry Geometry
    {
        get
        {
            EnsureAttached();
            return _geometry;
        }
    }

    public bool IsSelected
    {
        get
        {
            EnsureAttached();
            return _isSelected;
        }
    }

    public bool IsVisible
    {
        get
        {
            EnsureAttached();
            return _isVisible;
        }
    }

    public bool IsEditorAvailable
    {
        get
        {
            EnsureAttached();
            return _isEditorAvailable;
        }
    }

    public ICommand BeginDragCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_beginDragCommand is not null);
            return _beginDragCommand!;
        }
    }

    public ICommand DragDeltaCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_dragDeltaCommand is not null);
            return _dragDeltaCommand!;
        }
    }

    public ICommand CompleteDragCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_completeDragCommand is not null);
            return _completeDragCommand!;
        }
    }

    public ICommand BeginResizeCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_beginResizeCommand is not null);
            return _beginResizeCommand!;
        }
    }

    public ICommand ResizeDeltaCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_resizeDeltaCommand is not null);
            return _resizeDeltaCommand!;
        }
    }

    public ICommand CompleteResizeCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_completeResizeCommand is not null);
            return _completeResizeCommand!;
        }
    }

    public ICommand OpenEditorCommand
    {
        get
        {
            EnsureAttached();
            Debug.Assert(_openEditorCommand is not null);
            return _openEditorCommand!;
        }
    }
}
