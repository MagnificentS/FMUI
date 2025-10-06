using System;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace FMUI.Wpf.DiagnosticsRunner;

public sealed class DiagnosticsBaselineWriter
{
    private readonly string _diagnosticsRoot;
    private readonly JsonSerializerOptions _serializerOptions;
    private const string BaselineFileName = "ui-performance-baseline.json";

    public DiagnosticsBaselineWriter(string diagnosticsRoot)
    {
        if (string.IsNullOrWhiteSpace(diagnosticsRoot))
        {
            throw new ArgumentException("Diagnostics root must be provided.", nameof(diagnosticsRoot));
        }

        _diagnosticsRoot = diagnosticsRoot;
        _serializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    public string BaselinePath => Path.Combine(_diagnosticsRoot, BaselineFileName);

    public SliceMigrationReport? TryLoadBaseline()
    {
        var path = BaselinePath;
        if (!File.Exists(path))
        {
            return null;
        }

        using var stream = File.OpenRead(path);
        return JsonSerializer.Deserialize<SliceMigrationReport>(stream, _serializerOptions);
    }

    public async Task WriteBaselineAsync(SliceMigrationReport report, CancellationToken cancellationToken)
    {
        if (report is null)
        {
            throw new ArgumentNullException(nameof(report));
        }

        Directory.CreateDirectory(_diagnosticsRoot);
        var path = BaselinePath;
        await using var stream = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true);
        await JsonSerializer.SerializeAsync(stream, report, _serializerOptions, cancellationToken).ConfigureAwait(true);
        await stream.FlushAsync(cancellationToken).ConfigureAwait(true);
    }
}
