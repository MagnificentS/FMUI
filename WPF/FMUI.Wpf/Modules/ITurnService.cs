using System;
using System.Threading;
using System.Threading.Tasks;

namespace FMUI.Wpf.Modules
{
    public interface ITurnService
    {
        ValueTask InitializeAsync(CancellationToken cancellationToken);
        ValueTask ProcessAiTurnAsync(DateTime currentDate, CancellationToken cancellationToken);
        void Shutdown();
    }
}
