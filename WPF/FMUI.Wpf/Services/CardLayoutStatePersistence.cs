using System;
using System.IO;
using System.Text.Json;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface ICardLayoutStatePersistence
{
    CardLayoutStateSnapshot Load();

    void Save(CardLayoutStateSnapshot snapshot);
}

public sealed record CardLayoutStateOptions(string StoragePath);

public sealed class FileCardLayoutStatePersistence : ICardLayoutStatePersistence
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        WriteIndented = true
    };

    private readonly string _storagePath;

    public FileCardLayoutStatePersistence(CardLayoutStateOptions options)
    {
        if (string.IsNullOrWhiteSpace(options.StoragePath))
        {
            throw new ArgumentException("Storage path cannot be null or empty.", nameof(options));
        }

        _storagePath = options.StoragePath;
    }

    public CardLayoutStateSnapshot Load()
    {
        try
        {
            if (!File.Exists(_storagePath))
            {
                return CardLayoutStateSnapshot.Empty;
            }

            using var stream = File.OpenRead(_storagePath);
            var snapshot = JsonSerializer.Deserialize<CardLayoutStateSnapshot>(stream, SerializerOptions);
            return snapshot ?? CardLayoutStateSnapshot.Empty;
        }
        catch (IOException)
        {
            return CardLayoutStateSnapshot.Empty;
        }
        catch (JsonException)
        {
            return CardLayoutStateSnapshot.Empty;
        }
    }

    public void Save(CardLayoutStateSnapshot snapshot)
    {
        try
        {
            var directory = Path.GetDirectoryName(_storagePath);
            if (!string.IsNullOrWhiteSpace(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var temporaryPath = _storagePath + ".tmp";
            using (var stream = File.Create(temporaryPath))
            {
                JsonSerializer.Serialize(stream, snapshot, SerializerOptions);
            }

            File.Move(temporaryPath, _storagePath, overwrite: true);
        }
        catch (IOException)
        {
            // Persisting layout state is a non-critical operation; ignore transient IO failures.
        }
        catch (UnauthorizedAccessException)
        {
            // Persisting layout state is a non-critical operation; ignore access violations.
        }
    }
}
