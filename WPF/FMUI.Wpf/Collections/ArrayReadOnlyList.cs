using System.Collections;
using System.Collections.Generic;

namespace FMUI.Wpf.Collections
{
    /// <summary>
    /// Lightweight adapter that exposes an array segment as <see cref="IReadOnlyList{T}"/> without allocations.
    /// </summary>
    public readonly struct ArrayReadOnlyList<T> : IReadOnlyList<T>
    {
        private readonly T[] _items;
        private readonly int _count;

        public ArrayReadOnlyList(T[] items, int count)
        {
            _items = items;
            _count = count < 0 ? 0 : count;
        }

        public int Count => _count;

        public T this[int index] => _items[index];

        public Enumerator GetEnumerator() => new Enumerator(_items, _count);

        IEnumerator<T> IEnumerable<T>.GetEnumerator() => GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public struct Enumerator : IEnumerator<T>
        {
            private readonly T[] _items;
            private readonly int _count;
            private int _index;

            public Enumerator(T[] items, int count)
            {
                _items = items;
                _count = count;
                _index = -1;
            }

            public readonly T Current => _items[_index];

            readonly object IEnumerator.Current => Current!;

            public bool MoveNext()
            {
                var next = _index + 1;
                if (next >= _count)
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
}
