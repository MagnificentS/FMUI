using System;
using System.Threading;
using System.Threading.Tasks;

namespace FMUI.Wpf.Modules
{
    public sealed class TurnService : ITurnService, IDisposable
    {
        private readonly ModuleHost _moduleHost;
        private readonly object _stateLock;
        private DateTime _lastTurnDate;
        private bool _initialized;

        public TurnService(ModuleHost moduleHost)
        {
            _moduleHost = moduleHost;
            _stateLock = new object();
            _lastTurnDate = DateTime.UtcNow;
            _initialized = false;
        }

        public ValueTask InitializeAsync(CancellationToken cancellationToken)
        {
            if (_initialized)
            {
                return ValueTask.CompletedTask;
            }

            _moduleHost.InitializeModules();
            _moduleHost.StartModules();
            _initialized = true;
            return ValueTask.CompletedTask;
        }

        public ValueTask ProcessAiTurnAsync(DateTime currentDate, CancellationToken cancellationToken)
        {
            if (!_initialized)
            {
                throw new InvalidOperationException("Turn service is not initialized.");
            }

            TimeSpan delta;
            lock (_stateLock)
            {
                delta = currentDate - _lastTurnDate;
                if (delta <= TimeSpan.Zero)
                {
                    delta = TimeSpan.FromHours(1);
                }

                _lastTurnDate = currentDate;
            }

            var task = Task.Run(() => _moduleHost.ProcessModules(currentDate, delta, cancellationToken), cancellationToken);
            return new ValueTask(task);
        }

        public void Shutdown()
        {
            if (!_initialized)
            {
                return;
            }

            _moduleHost.StopModules();
            _initialized = false;
        }

        public void Dispose()
        {
            _moduleHost.Dispose();
        }
    }
}
