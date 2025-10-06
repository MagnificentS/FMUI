using System.Windows;

namespace FMUI.Wpf.UI.Cards;

public interface ICardContent
{
    CardType Type { get; }

    FrameworkElement View { get; }

    void Attach(in CardContentContext context);

    void Update(in CardContentContext context);

    void Detach();

    void Reset();
}
