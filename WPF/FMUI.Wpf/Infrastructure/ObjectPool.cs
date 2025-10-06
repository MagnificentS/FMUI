using System;
using System.Collections.Concurrent;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Infrastructure
{
    /// <summary>
    /// Thread-safe object pool for reusing objects and reducing GC pressure.
    /// </summary>
    /// <typeparam name="T">Reference type stored in the pool.</typeparam>
    public sealed class ObjectPool<T> where T : class
    {
        private readonly ConcurrentBag<T> _objects = new ConcurrentBag<T>();
        private readonly Func<T> _objectGenerator;
        private readonly Action<T>? _resetAction;
        private int _currentCount;
        private readonly int _maxSize;

        public ObjectPool(Func<T> objectGenerator, Action<T>? resetAction = null, int maxSize = 128)
        {
            _objectGenerator = objectGenerator ?? throw new ArgumentNullException(nameof(objectGenerator));
            _resetAction = resetAction;
            _maxSize = maxSize > 0 ? maxSize : 1;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public T Rent()
        {
            if (_objects.TryTake(out var item))
            {
                System.Threading.Interlocked.Decrement(ref _currentCount);
                return item;
            }

            return _objectGenerator();
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Return(T item)
        {
            if (item is null)
            {
                return;
            }

            int count = System.Threading.Interlocked.CompareExchange(ref _currentCount, 0, 0);
            if (count >= _maxSize)
            {
                return;
            }

            _resetAction?.Invoke(item);

            _objects.Add(item);
            System.Threading.Interlocked.Increment(ref _currentCount);
        }
    }
}
