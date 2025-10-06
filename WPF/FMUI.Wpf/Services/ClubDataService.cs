using System;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface IClubDataService
{
    ClubDataSnapshot Current { get; }

    event EventHandler<ClubDataSnapshot>? SnapshotChanged;

    Task RefreshAsync(CancellationToken cancellationToken = default);

    Task UpdateAsync(Func<ClubDataSnapshot, ClubDataSnapshot> updater, CancellationToken cancellationToken = default);
}

public sealed class ClubDataService : IClubDataService
{
    private readonly SemaphoreSlim _mutex = new(1, 1);
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    private readonly string _basePath;
    private readonly string _overridePath;

    private ClubDataSnapshot _snapshot;

    public ClubDataService()
    {
        var baseDirectory = AppContext.BaseDirectory;
        var dataDirectory = Path.Combine(baseDirectory, "Data");
        Directory.CreateDirectory(dataDirectory);

        _basePath = Path.Combine(dataDirectory, "club-data.json");
        _overridePath = Path.Combine(dataDirectory, "club-data.user.json");
        _snapshot = LoadSnapshot();
    }

    public event EventHandler<ClubDataSnapshot>? SnapshotChanged;

    public ClubDataSnapshot Current => _snapshot;

    public async Task RefreshAsync(CancellationToken cancellationToken = default)
    {
        var snapshot = await Task.Run(LoadSnapshot, cancellationToken).ConfigureAwait(false);
        await SetSnapshotAsync(_ => snapshot, persistOverride: false, cancellationToken).ConfigureAwait(false);
    }

    public Task UpdateAsync(Func<ClubDataSnapshot, ClubDataSnapshot> updater, CancellationToken cancellationToken = default)
    {
        if (updater is null)
        {
            throw new ArgumentNullException(nameof(updater));
        }

        return SetSnapshotAsync(updater, persistOverride: true, cancellationToken);
    }

    private ClubDataSnapshot LoadSnapshot()
    {
        if (!File.Exists(_basePath))
        {
            throw new FileNotFoundException("Unable to locate the club data seed payload.", _basePath);
        }

        var overrideSnapshot = TryLoadSnapshot(_overridePath);
        if (overrideSnapshot is not null)
        {
            return overrideSnapshot;
        }

        var seed = TryLoadSnapshot(_basePath);
        return seed ?? throw new InvalidOperationException("The club data payload could not be deserialized.");
    }

    private ClubDataSnapshot? TryLoadSnapshot(string path)
    {
        if (!File.Exists(path))
        {
            return null;
        }

        using var stream = File.OpenRead(path);
        return JsonSerializer.Deserialize<ClubDataSnapshot>(stream, _serializerOptions);
    }

    private async Task SetSnapshotAsync(
        Func<ClubDataSnapshot, ClubDataSnapshot> mutator,
        bool persistOverride,
        CancellationToken cancellationToken)
    {
        ClubDataSnapshot snapshot;

        await _mutex.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            snapshot = mutator(_snapshot) ?? throw new InvalidOperationException("Club data mutator produced a null snapshot.");
            _snapshot = snapshot;

            if (persistOverride)
            {
                await PersistOverrideAsync(snapshot, cancellationToken).ConfigureAwait(false);
            }
        }
        finally
        {
            _mutex.Release();
        }

        SnapshotChanged?.Invoke(this, snapshot);
    }

    private async Task PersistOverrideAsync(ClubDataSnapshot snapshot, CancellationToken cancellationToken)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(_overridePath)!);

        await using var stream = new FileStream(
            _overridePath,
            FileMode.Create,
            FileAccess.Write,
            FileShare.None,
            4096,
            useAsync: true);

        await JsonSerializer.SerializeAsync(stream, snapshot, _serializerOptions, cancellationToken).ConfigureAwait(false);
        await stream.FlushAsync(cancellationToken).ConfigureAwait(false);
    }
}
