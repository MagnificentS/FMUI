using System;
using System.Windows.Controls;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Views.Squad;

public partial class SquadListCardControl : UserControl, ISquadCardContent
{
    private SquadListCardDescriptor? _descriptor;

    public SquadListCardControl()
    {
        InitializeComponent();
    }

    public void Bind(SquadCardDescriptor descriptor)
    {
        _descriptor = descriptor as SquadListCardDescriptor
            ?? throw new InvalidOperationException("Invalid descriptor supplied to SquadListCardControl.");
        DataContext = _descriptor;
    }

    public void Unbind()
    {
        DataContext = null;
        _descriptor = null;
    }
}
