using System;

namespace FMUI.Wpf.Modules
{
    public readonly struct ModuleNotification
    {
        public readonly string ModuleId;
        public readonly string EventType;
        public readonly object? Data;

        public ModuleNotification(string moduleId, string eventType, object? data)
        {
            ModuleId = moduleId;
            EventType = eventType;
            Data = data;
        }
    }
}
