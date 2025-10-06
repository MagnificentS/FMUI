using System;
using System.Runtime.CompilerServices;
using System.Threading;

namespace FMUI.Wpf.Events
{
    /// <summary>
    /// Lock-free event system with zero allocations.
    /// </summary>
    public sealed unsafe class EventSystem
    {
        private const int MaxEventTypes = 256;
        private const int MaxHandlersPerType = 64;
        private const int EventQueueSize = 4096;

        private struct EventHandler
        {
            public delegate*<void*, void> Function;
            public void* Target;
            public int Priority;
        }

        private struct QueuedEvent
        {
            public ushort EventType;
            public ushort DataSize;
            public fixed byte Data[60];
        }

        private readonly EventHandler[][] _handlers;
        private readonly int[] _handlerCounts;
        private readonly QueuedEvent[] _eventQueue;
        private int _queueHead;
        private int _queueTail;

        [ThreadStatic]
        private static QueuedEvent[]? _threadLocalBuffer;

        public EventSystem()
        {
            _handlers = new EventHandler[MaxEventTypes][];
            _handlerCounts = new int[MaxEventTypes];
            _eventQueue = new QueuedEvent[EventQueueSize];

            for (int i = 0; i < MaxEventTypes; i++)
            {
                _handlers[i] = new EventHandler[MaxHandlersPerType];
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Subscribe<T>(ushort eventType, delegate*<T*, void> handler, void* target, int priority = 0)
            where T : unmanaged
        {
            if (eventType >= MaxEventTypes || handler is null)
            {
                return;
            }

            int count = Interlocked.Increment(ref _handlerCounts[eventType]) - 1;
            if (count >= MaxHandlersPerType)
            {
                _handlerCounts[eventType] = MaxHandlersPerType;
                return;
            }

            _handlers[eventType][count] = new EventHandler
            {
                Function = (delegate*<void*, void>)handler,
                Target = target,
                Priority = priority
            };

            for (int i = count; i > 0 && _handlers[eventType][i].Priority > _handlers[eventType][i - 1].Priority; i--)
            {
                (_handlers[eventType][i], _handlers[eventType][i - 1]) = (_handlers[eventType][i - 1], _handlers[eventType][i]);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Publish<T>(ushort eventType, ref T data) where T : unmanaged
        {
            if (sizeof(T) > 60)
            {
                throw new ArgumentException("Event data too large");
            }

            int tail = _queueTail;
            int nextTail = (tail + 1) % EventQueueSize;

            if (nextTail == _queueHead)
            {
                return;
            }

            fixed (T* dataPtr = &data)
            {
                var evt = new QueuedEvent
                {
                    EventType = eventType,
                    DataSize = (ushort)sizeof(T)
                };

                Unsafe.CopyBlock(evt.Data, dataPtr, (uint)sizeof(T));
                _eventQueue[tail] = evt;
            }

            Interlocked.Exchange(ref _queueTail, nextTail);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Publish<T>(ushort eventType) where T : unmanaged
        {
            T data = default;
            Publish(eventType, ref data);
        }

        public void ProcessEvents()
        {
            while (_queueHead != _queueTail)
            {
                var evt = _eventQueue[_queueHead];
                _queueHead = (_queueHead + 1) % EventQueueSize;

                ProcessEvent(evt.EventType, evt.Data);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void ProcessEvent(ushort eventType, byte* data)
        {
            if (eventType >= MaxEventTypes)
            {
                return;
            }

            int count = _handlerCounts[eventType];
            var handlers = _handlers[eventType];

            for (int i = 0; i < count; i++)
            {
                handlers[i].Function(data);
            }
        }
    }
}
