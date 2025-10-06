using System;
using System.Collections.Generic;
using System.Windows;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Views.Squad;

public sealed class SquadCardContentPool
{
    private readonly Stack<SquadListCardControl> _listPool = new();
    private readonly Stack<SquadRosterCardControl> _rosterPool = new();

    public FrameworkElement Acquire(SquadCardDescriptor descriptor)
    {
        if (descriptor is SquadRosterCardDescriptor roster)
        {
            var control = _rosterPool.Count > 0 ? _rosterPool.Pop() : new SquadRosterCardControl();
            control.Bind(roster);
            return control;
        }

        if (descriptor is SquadListCardDescriptor list)
        {
            var control = _listPool.Count > 0 ? _listPool.Pop() : new SquadListCardControl();
            control.Bind(list);
            return control;
        }

        throw new NotSupportedException($"Unsupported squad descriptor type: {descriptor?.GetType().Name}");
    }

    public void Release(FrameworkElement element)
    {
        switch (element)
        {
            case SquadRosterCardControl roster:
                roster.Unbind();
                _rosterPool.Push(roster);
                break;
            case SquadListCardControl list:
                list.Unbind();
                _listPool.Push(list);
                break;
        }
    }
}
