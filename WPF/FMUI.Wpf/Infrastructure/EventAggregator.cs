using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace FMUI.Wpf.Infrastructure;

public interface IEventAggregator
{
    void Publish<TEvent>(TEvent eventData);
    IDisposable Subscribe<TEvent>(Action<TEvent> handler);
}

public sealed class EventAggregator : IEventAggregator
{
    private readonly ConcurrentDictionary<Type, List<ISubscription>> _subscriptions = new();

    public void Publish<TEvent>(TEvent eventData)
    {
        if (eventData is null)
        {
            throw new ArgumentNullException(nameof(eventData));
        }

        if (_subscriptions.TryGetValue(typeof(TEvent), out var handlers))
        {
            ISubscription[] snapshot;
            lock (handlers)
            {
                snapshot = handlers.ToArray();
            }

            foreach (var subscription in snapshot)
            {
                subscription.Invoke(eventData);
            }
        }
    }

    public IDisposable Subscribe<TEvent>(Action<TEvent> handler)
    {
        if (handler is null)
        {
            throw new ArgumentNullException(nameof(handler));
        }

        var subscription = new Subscription<TEvent>(this, handler);
        var handlers = _subscriptions.GetOrAdd(typeof(TEvent), _ => new List<ISubscription>());

        lock (handlers)
        {
            handlers.Add(subscription);
        }

        return subscription;
    }

    private void Unsubscribe(Type eventType, ISubscription subscription)
    {
        if (_subscriptions.TryGetValue(eventType, out var handlers))
        {
            lock (handlers)
            {
                handlers.Remove(subscription);
            }
        }
    }

    private interface ISubscription : IDisposable
    {
        void Invoke(object eventData);
    }

    private sealed class Subscription<TEvent> : ISubscription
    {
        private readonly EventAggregator _owner;
        private readonly Action<TEvent> _handler;
        private bool _isDisposed;

        public Subscription(EventAggregator owner, Action<TEvent> handler)
        {
            _owner = owner;
            _handler = handler;
        }

        public void Invoke(object eventData)
        {
            if (_isDisposed)
            {
                return;
            }

            if (eventData is TEvent typed)
            {
                _handler(typed);
            }
        }

        public void Dispose()
        {
            if (_isDisposed)
            {
                return;
            }

            _isDisposed = true;
            _owner.Unsubscribe(typeof(TEvent), this);
        }
    }
}
