using System;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Collections
{
    /// <summary>
    /// Lightweight stack backed by an array to replace <see cref="System.Collections.Generic.Stack{T}"/>.
    /// </summary>
    /// <typeparam name="T">Element type.</typeparam>
    public struct ArrayStack<T>
    {
        private T[] _items;
        private int _count;

        public ArrayStack(int initialCapacity)
        {
            if (initialCapacity <= 0)
            {
                initialCapacity = 4;
            }

            _items = new T[initialCapacity];
            _count = 0;
        }

        public int Count
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get => _count;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Clear()
        {
            _count = 0;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Push(T value)
        {
            if (_items.Length <= _count)
            {
                Grow();
            }

            _items[_count] = value;
            _count++;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public T Pop()
        {
#if DEBUG
            if (_count == 0)
            {
                throw new InvalidOperationException("Stack is empty");
            }
#endif
            var index = _count - 1;
            var value = _items[index];
            _items[index] = default!;
            _count = index;
            return value;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public T Peek()
        {
#if DEBUG
            if (_count == 0)
            {
                throw new InvalidOperationException("Stack is empty");
            }
#endif
            return _items[_count - 1];
        }

        private void Grow()
        {
            var newLength = _items.Length == 0 ? 4 : _items.Length << 1;
            var newItems = new T[newLength];
            for (var i = 0; i < _count; i++)
            {
                newItems[i] = _items[i];
            }

            _items = newItems;
        }
    }
}
