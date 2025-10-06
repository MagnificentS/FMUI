using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using FMUI.Wpf.UI.Cards;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Collections;

public sealed class CardPresenterCollection : IList<CardPresenter>, IReadOnlyList<CardPresenter>, INotifyCollectionChanged, INotifyPropertyChanged
{
    private ArrayCollection<CardPresenterHandle> _items;

    public CardPresenterCollection(int capacity = 16)
    {
        if (capacity <= 0)
        {
            capacity = 4;
        }

        _items = new ArrayCollection<CardPresenterHandle>(capacity);
    }

    public event NotifyCollectionChangedEventHandler? CollectionChanged;

    public event PropertyChangedEventHandler? PropertyChanged;

    public int Count => _items.Count;

    public bool IsReadOnly => false;

    public CardPresenter this[int index]
    {
        get => _items[index].ViewModel;
        set
        {
            if ((uint)index >= (uint)_items.Count)
            {
                throw new ArgumentOutOfRangeException(nameof(index));
            }

            var oldHandle = _items[index];
            var oldItem = oldHandle.ViewModel;
            if (ReferenceEquals(oldItem, value))
            {
                return;
            }

            _items[index] = new CardPresenterHandle(value);
            OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Replace, value, oldItem, index));
        }
    }

    public void Add(CardPresenter item)
    {
        _items.Add(new CardPresenterHandle(item));
        OnCountChanged();
        OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, item, _items.Count - 1));
    }

    public void Clear()
    {
        if (_items.Count == 0)
        {
            return;
        }

        _items.Clear();
        OnCountChanged();
        OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
    }

    public bool Contains(CardPresenter item)
    {
        return IndexOf(item) >= 0;
    }

    public void CopyTo(CardPresenter[] array, int arrayIndex)
    {
        if (array is null)
        {
            throw new ArgumentNullException(nameof(array));
        }

        if ((uint)arrayIndex > (uint)array.Length)
        {
            throw new ArgumentOutOfRangeException(nameof(arrayIndex));
        }

        var span = _items.AsSpan();
        if (span.Length > array.Length - arrayIndex)
        {
            throw new ArgumentException("Destination array is not large enough.", nameof(array));
        }

        for (int i = 0; i < span.Length; i++)
        {
            array[arrayIndex + i] = span[i].ViewModel;
        }
    }

    public IEnumerator<CardPresenter> GetEnumerator()
    {
        return new Enumerator(_items.AsSpan());
    }

    public int IndexOf(CardPresenter item)
    {
        var span = _items.AsSpan();
        for (int i = 0; i < span.Length; i++)
        {
            if (ReferenceEquals(span[i].ViewModel, item))
            {
                return i;
            }
        }

        return -1;
    }

    public void Insert(int index, CardPresenter item)
    {
        if ((uint)index > (uint)_items.Count)
        {
            throw new ArgumentOutOfRangeException(nameof(index));
        }

        // Append to ensure capacity, then shift items into place.
        _items.Add(new CardPresenterHandle(item));
        var span = _items.AsSpan();
        for (int i = span.Length - 1; i > index; i--)
        {
            span[i] = span[i - 1];
        }

        span[index] = new CardPresenterHandle(item);
        OnCountChanged();
        OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, item, index));
    }

    public bool Remove(CardPresenter item)
    {
        var index = IndexOf(item);
        if (index < 0)
        {
            return false;
        }

        RemoveAt(index);
        return true;
    }

    public void RemoveAt(int index)
    {
        if ((uint)index >= (uint)_items.Count)
        {
            throw new ArgumentOutOfRangeException(nameof(index));
        }

        var removed = _items[index];
        _items.RemoveAt(index);
        OnCountChanged();
        OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Remove, removed.ViewModel, index));
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    public CardPresenterHandle GetHandle(int index)
    {
        if ((uint)index >= (uint)_items.Count)
        {
            throw new ArgumentOutOfRangeException(nameof(index));
        }

        return _items[index];
    }

    public ReadOnlySpan<CardPresenterHandle> AsHandlesSpan() => _items.AsSpan();

    private void OnCollectionChanged(NotifyCollectionChangedEventArgs args)
    {
        CollectionChanged?.Invoke(this, args);
    }

    private void OnCountChanged()
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Count)));
    }

    private struct Enumerator : IEnumerator<CardPresenter>
    {
        private readonly ReadOnlySpan<CardPresenterHandle> _span;
        private int _index;

        public Enumerator(ReadOnlySpan<CardPresenterHandle> span)
        {
            _span = span;
            _index = -1;
        }

        public CardPresenter Current => _span[_index].ViewModel;

        object IEnumerator.Current => Current;

        public bool MoveNext()
        {
            int next = _index + 1;
            if (next >= _span.Length)
            {
                return false;
            }

            _index = next;
            return true;
        }

        public void Reset()
        {
            _index = -1;
        }

        public void Dispose()
        {
        }
    }
}
