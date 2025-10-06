using System;
using System.IO;

namespace FMUI.Wpf.DiagnosticsRunner;

public sealed class HarnessOptions
{
    public HarnessOptions()
    {
        var diagnosticsRoot = Environment.GetEnvironmentVariable("FMUI_DIAGNOSTICS_ROOT");
        if (!string.IsNullOrWhiteSpace(diagnosticsRoot))
        {
            DiagnosticsRoot = diagnosticsRoot!;
        }
        else
        {
            DiagnosticsRoot = Path.Combine(AppContext.BaseDirectory, "diagnostics");
        }

        BeforeSampleFrames = 60;
        AfterSampleFrames = 120;
        SampleCapacity = 512;
        FrameIntervalMilliseconds = 16;
        FrameVariancePercentage = 12.5;
        AllowedGen2Growth = 0;
        Timeout = TimeSpan.FromSeconds(60);
    }

    public string DiagnosticsRoot { get; set; }

    public bool EnforceBaseline { get; set; }

    public int BeforeSampleFrames { get; set; }

    public int AfterSampleFrames { get; set; }

    public int SampleCapacity { get; set; }

    public int FrameIntervalMilliseconds { get; set; }

    public double FrameVariancePercentage { get; set; }

    public int AllowedGen2Growth { get; set; }

    public TimeSpan Timeout { get; set; }
}
