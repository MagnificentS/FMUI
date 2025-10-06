using FMUI.Wpf.Models;

namespace FMUI.Wpf.Views.Squad;

public interface ISquadCardContent
{
    void Bind(SquadCardDescriptor descriptor);

    void Unbind();
}
