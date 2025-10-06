using System;
using System.IO;
using BenchmarkDotNet.Attributes;
using FMUI.Wpf.Database;

namespace FMUI.Wpf.Benchmarks;

[MemoryDiagnoser]
public class DatabaseBenchmarks : IDisposable
{
    private PlayerDatabase? _database;
    private uint[] _randomPlayerIds = Array.Empty<uint>();
    private string? _databasePath;

    [GlobalSetup]
    public void Setup()
    {
        _databasePath = Path.Combine(AppContext.BaseDirectory, "players.db");
        _database = new PlayerDatabase(_databasePath);

        var random = new Random(42);
        _randomPlayerIds = new uint[1000];
        for (var i = 0; i < _randomPlayerIds.Length; i++)
        {
            _randomPlayerIds[i] = (uint)random.Next(1, 500_000);
        }
    }

    [Benchmark]
    public void GetPlayerSequential()
    {
        if (_database is null)
        {
            return;
        }

        for (uint i = 1; i <= 1000; i++)
        {
            ref var player = ref _database.GetPlayer(i);
            player.Age = player.Age;
        }
    }

    [Benchmark]
    public void GetPlayerRandom()
    {
        if (_database is null)
        {
            return;
        }

        for (var i = 0; i < _randomPlayerIds.Length; i++)
        {
            ref var player = ref _database.GetPlayer(_randomPlayerIds[i]);
            player.Fitness = player.Fitness;
        }
    }

    [GlobalCleanup]
    public void Cleanup()
    {
        Dispose();
    }

    public void Dispose()
    {
        _database?.Dispose();
        _database = null;

        if (!string.IsNullOrEmpty(_databasePath) && File.Exists(_databasePath))
        {
            try
            {
                File.Delete(_databasePath);
            }
            catch (IOException)
            {
            }
        }
    }
}
