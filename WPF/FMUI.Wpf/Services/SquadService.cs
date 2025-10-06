using System;
using System.Threading;
using System.Threading.Tasks;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface ISquadService
{
    SquadSnapshot Current { get; }

    event EventHandler<SquadSnapshot>? SnapshotChanged;

    SquadSnapshot GetSnapshot();

    Task UpdateAsync(Func<SquadSnapshot, SquadSnapshot> updater, CancellationToken cancellationToken = default);
}

public sealed class SquadService : ISquadService, IDisposable
{
    private readonly IClubDataService _clubDataService;
    private SquadSnapshot _snapshot;
    private bool _disposed;

    public SquadService(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
        _snapshot = clubDataService.Current.Squad;
        _clubDataService.SnapshotChanged += OnClubSnapshotChanged;
    }

    public event EventHandler<SquadSnapshot>? SnapshotChanged;

    public SquadSnapshot Current => _snapshot;

    public SquadSnapshot GetSnapshot() => _snapshot;

    public async Task UpdateAsync(Func<SquadSnapshot, SquadSnapshot> updater, CancellationToken cancellationToken = default)
    {
        if (updater is null)
        {
            throw new ArgumentNullException(nameof(updater));
        }

        await _clubDataService.UpdateAsync(snapshot =>
        {
            var updated = updater(snapshot.Squad);
            return snapshot with { Squad = updated };
        }, cancellationToken).ConfigureAwait(false);
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        _clubDataService.SnapshotChanged -= OnClubSnapshotChanged;
        GC.SuppressFinalize(this);
    }

    private void OnClubSnapshotChanged(object? sender, ClubDataSnapshot snapshot)
    {
        _snapshot = snapshot.Squad;
        SnapshotChanged?.Invoke(this, _snapshot);
    }
}
