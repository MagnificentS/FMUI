using System;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Collections
{
    /// <summary>
    /// High-performance array-backed collection replacing <see cref="System.Collections.Generic.List{T}"/>.
    /// Avoids iterator allocations and supports both value and reference types.
    /// </summary>
    /// <typeparam name="T">Element type.</typeparam>
    public struct ArrayCollection<T>
    {
        private T[] _items;
        private int _count;
        private int _capacity;

        public ArrayCollection(int initialCapacity)
        {
            if (initialCapacity <= 0)
            {
                initialCapacity = 4;
            }

            _capacity = initialCapacity;
            _items = new T[_capacity];
            _count = 0;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Add(T item)
        {
            if (_count >= _capacity)
            {
                Grow();
            }

            _items[_count] = item;
            _count++;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void AddRange(ReadOnlySpan<T> items)
        {
            for (var i = 0; i < items.Length; i++)
            {
                Add(items[i]);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref T AddReference()
        {
            if (_count >= _capacity)
            {
                Grow();
            }

            _count++;
            return ref _items[_count - 1];
        }

        private void Grow()
        {
            var newCapacity = _capacity == 0 ? 4 : _capacity << 1;
            var newArray = new T[newCapacity];
            for (var i = 0; i < _count; i++)
            {
                newArray[i] = _items[i];
            }

            _items = newArray;
            _capacity = newCapacity;
        }

        public T this[int index]
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get
            {
#if DEBUG
                if ((uint)index >= (uint)_count)
                {
                    throw new IndexOutOfRangeException();
                }
#endif
                return _items[index];
            }
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set
            {
#if DEBUG
                if ((uint)index >= (uint)_count)
                {
                    throw new IndexOutOfRangeException();
                }
#endif
                _items[index] = value;
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref T GetReference(int index)
        {
#if DEBUG
            if ((uint)index >= (uint)_count)
            {
                throw new IndexOutOfRangeException();
            }
#endif
            return ref _items[index];
        }

        public int Count
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get => _count;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public T[] GetRawArray() => _items;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Span<T> AsSpan() => new Span<T>(_items, 0, _count);

        public void Clear()
        {
            _count = 0;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool RemoveAt(int index)
        {
#if DEBUG
            if ((uint)index >= (uint)_count)
            {
                throw new IndexOutOfRangeException();
            }
#endif
            var next = index + 1;
            for (var i = next; i < _count; i++)
            {
                _items[i - 1] = _items[i];
            }

            _count--;
            return true;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Remove(T item)
        {
            var index = IndexOf(item);
            if (index < 0)
            {
                return false;
            }

            RemoveAt(index);
            return true;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public int IndexOf(T item)
        {
            for (var i = 0; i < _count; i++)
            {
                if (Equals(_items[i], item))
                {
                    return i;
                }
            }

            return -1;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Contains(T item)
        {
            return IndexOf(item) >= 0;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void EnsureCapacity(int capacity)
        {
            if (capacity <= _capacity)
            {
                return;
            }

            while (_capacity < capacity)
            {
                Grow();
            }
        }
    }
}
