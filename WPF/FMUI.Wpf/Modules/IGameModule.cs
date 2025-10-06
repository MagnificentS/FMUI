using System;

namespace FMUI.Wpf.Modules
{
    public interface IGameModule
    {
        string ModuleId { get; }
        ModuleState State { get; }

        void Initialize();
        void Start();
        void Update(GameTime gameTime);
        void Stop();
        void Cleanup();

        void LoadData();
        void SaveData();

        event EventHandler<ModuleEventArgs>? ModuleEvent;
    }

    public enum ModuleState
    {
        Uninitialized,
        Initializing,
        Ready,
        Running,
        Paused,
        Stopped,
        Error
    }

    public struct GameTime
    {
        public DateTime CurrentDate;
        public TimeSpan DeltaTime;
        public long FrameCount;
    }

    public sealed class ModuleEventArgs : EventArgs
    {
        public string EventType { get; set; }
        public object? Data { get; set; }

        public ModuleEventArgs(string eventType, object? data)
        {
            EventType = eventType;
            Data = data;
        }
    }
}
