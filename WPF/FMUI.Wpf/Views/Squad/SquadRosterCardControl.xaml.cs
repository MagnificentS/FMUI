using System;
using System.Windows.Controls;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Views.Squad;

public partial class SquadRosterCardControl : UserControl, ISquadCardContent
{
    private SquadRosterCardDescriptor? _descriptor;

    public SquadRosterCardControl()
    {
        InitializeComponent();
    }

    public void Bind(SquadCardDescriptor descriptor)
    {
        _descriptor = descriptor as SquadRosterCardDescriptor
            ?? throw new InvalidOperationException("Invalid descriptor supplied to SquadRosterCardControl.");
        DataContext = _descriptor.State;
    }

    public void Unbind()
    {
        DataContext = null;
        _descriptor = null;
    }
}
