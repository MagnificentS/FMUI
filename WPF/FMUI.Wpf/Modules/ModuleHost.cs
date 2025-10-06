using System;
using System.Collections.Generic;
using System.Threading;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.Modules
{
    public sealed class ModuleHost : IDisposable
    {
        private readonly IEventAggregator _eventAggregator;
        private readonly IGameModule[] _modules;
        private long _frameCounter;
        private bool _isRunning;

        public ModuleHost(IEventAggregator eventAggregator, IEnumerable<IGameModule> modules)
        {
            _eventAggregator = eventAggregator;
            _modules = CreateModuleArray(modules);
            _frameCounter = 0;
            _isRunning = false;

            for (int i = 0; i < _modules.Length; i++)
            {
                _modules[i].ModuleEvent += OnModuleEvent;
            }
        }

        public void InitializeModules()
        {
            for (int i = 0; i < _modules.Length; i++)
            {
                var module = _modules[i];
                if (module.State != ModuleState.Uninitialized)
                {
                    continue;
                }

                module.Initialize();
                module.LoadData();
            }
        }

        public void StartModules()
        {
            if (_isRunning)
            {
                return;
            }

            for (int i = 0; i < _modules.Length; i++)
            {
                var module = _modules[i];
                if (module.State == ModuleState.Ready || module.State == ModuleState.Paused)
                {
                    module.Start();
                }
            }

            _isRunning = true;
        }

        public void ProcessModules(DateTime currentDate, TimeSpan deltaTime, CancellationToken cancellationToken)
        {
            if (!_isRunning)
            {
                return;
            }

            var gameTime = new GameTime
            {
                CurrentDate = currentDate,
                DeltaTime = deltaTime,
                FrameCount = Interlocked.Increment(ref _frameCounter)
            };

            for (int i = 0; i < _modules.Length; i++)
            {
                cancellationToken.ThrowIfCancellationRequested();
                _modules[i].Update(gameTime);
            }
        }

        public void StopModules()
        {
            if (!_isRunning)
            {
                return;
            }

            for (int i = 0; i < _modules.Length; i++)
            {
                var module = _modules[i];
                module.Stop();
                module.SaveData();
                module.Cleanup();
            }

            _isRunning = false;
        }

        private void OnModuleEvent(object? sender, ModuleEventArgs e)
        {
            if (sender is not IGameModule module)
            {
                return;
            }

            if (string.IsNullOrEmpty(e.EventType))
            {
                return;
            }

            var notification = new ModuleNotification(module.ModuleId, e.EventType, e.Data);
            _eventAggregator.Publish(notification);
        }

        private static IGameModule[] CreateModuleArray(IEnumerable<IGameModule> modules)
        {
            if (modules is null)
            {
                throw new ArgumentNullException(nameof(modules));
            }

            IGameModule[] buffer = new IGameModule[4];
            int count = 0;

            foreach (var module in modules)
            {
                if (count >= buffer.Length)
                {
                    var expanded = new IGameModule[buffer.Length << 1];
                    for (int i = 0; i < buffer.Length; i++)
                    {
                        expanded[i] = buffer[i];
                    }

                    buffer = expanded;
                }

                buffer[count] = module;
                count++;
            }

            var result = new IGameModule[count];
            for (int i = 0; i < count; i++)
            {
                result[i] = buffer[i];
            }

            return result;
        }

        public void Dispose()
        {
            for (int i = 0; i < _modules.Length; i++)
            {
                _modules[i].ModuleEvent -= OnModuleEvent;
            }
        }
    }
}
