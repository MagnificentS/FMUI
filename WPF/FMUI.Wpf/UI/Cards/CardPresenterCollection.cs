using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.UI.Cards;

public sealed class CardPresenterCollection
{
    private readonly List<ICardPresenterDescriptor> _descriptors;
    private readonly List<CardViewModelDescriptorAdapter> _activeAdapters;
    private readonly Stack<CardViewModelDescriptorAdapter> _adapterPool;

    public CardPresenterCollection()
        : this(initialCapacity: 8)
    {
    }

    public CardPresenterCollection(int initialCapacity)
    {
        if (initialCapacity <= 0)
        {
            initialCapacity = 4;
        }

        _descriptors = new List<ICardPresenterDescriptor>(initialCapacity);
        _activeAdapters = new List<CardViewModelDescriptorAdapter>(initialCapacity);
        _adapterPool = new Stack<CardViewModelDescriptorAdapter>(initialCapacity);
    }

    public IReadOnlyList<ICardPresenterDescriptor> Items => _descriptors;

    public int Count => _descriptors.Count;

    public void Clear()
    {
        for (var i = 0; i < _activeAdapters.Count; i++)
        {
            ReturnAdapter(_activeAdapters[i]);
        }

        _activeAdapters.Clear();
        _descriptors.Clear();
    }

    public void Add(ICardPresenterDescriptor descriptor)
    {
        if (descriptor is CardViewModelDescriptorAdapter adapter)
        {
            RegisterAdapter(adapter);
            return;
        }

        _descriptors.Add(descriptor);
    }

    public void AddRange(IEnumerable<ICardPresenterDescriptor> descriptors)
    {
        foreach (var descriptor in descriptors)
        {
            Add(descriptor);
        }
    }

    public void Add(CardViewModel viewModel)
    {
        var adapter = RentAdapter();
        adapter.Attach(viewModel);
        RegisterAdapter(adapter);
    }

    public void AddRange(IEnumerable<CardViewModel> viewModels)
    {
        foreach (var viewModel in viewModels)
        {
            Add(viewModel);
        }
    }

    public void RefreshAdapters()
    {
        for (var i = 0; i < _activeAdapters.Count; i++)
        {
            _activeAdapters[i].RefreshState();
        }
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    private void RegisterAdapter(CardViewModelDescriptorAdapter adapter)
    {
        if (adapter.ViewModel is null)
        {
            throw new InvalidOperationException("Adapter must be attached before registration.");
        }

        adapter.RefreshState();
        _activeAdapters.Add(adapter);
        _descriptors.Add(adapter);
    }

    private CardViewModelDescriptorAdapter RentAdapter()
    {
        return _adapterPool.Count > 0 ? _adapterPool.Pop() : new CardViewModelDescriptorAdapter();
    }

    private void ReturnAdapter(CardViewModelDescriptorAdapter adapter)
    {
        adapter.Detach();
        _adapterPool.Push(adapter);
    }
}
