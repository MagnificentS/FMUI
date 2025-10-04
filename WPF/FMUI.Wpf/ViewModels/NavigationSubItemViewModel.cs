using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class NavigationSubItemViewModel : ObservableObject
{
    private bool _isActive;

    public NavigationSubItemViewModel(NavigationSubItem model)
    {
        Model = model;
    }

    public NavigationSubItem Model { get; }

    public string Title => Model.Title;

    public string Identifier => Model.Identifier;

    public bool IsActive
    {
        get => _isActive;
        set => SetProperty(ref _isActive, value);
    }
}
