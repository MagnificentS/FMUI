using System;

namespace FMUI.Wpf.DiagnosticsRunner;

public static class HarnessCli
{
    public static HarnessOptions Parse(string[] args)
    {
        var options = new HarnessOptions();
        if (args is null)
        {
            return options;
        }

        var index = 0;
        while (index < args.Length)
        {
            var argument = args[index];
            if (string.Equals(argument, "--diagnostics-root", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length)
                {
                    throw new ArgumentException("Missing value for --diagnostics-root");
                }

                index++;
                options.DiagnosticsRoot = args[index];
            }
            else if (string.Equals(argument, "--enforce-baseline", StringComparison.OrdinalIgnoreCase))
            {
                options.EnforceBaseline = true;
            }
            else if (string.Equals(argument, "--timeout", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length)
                {
                    throw new ArgumentException("Missing value for --timeout");
                }

                index++;
                if (!int.TryParse(args[index], out var seconds) || seconds <= 0)
                {
                    throw new ArgumentException("Timeout must be a positive integer representing seconds.");
                }

                options.Timeout = TimeSpan.FromSeconds(seconds);
            }
            else if (string.Equals(argument, "--frame-variance", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length)
                {
                    throw new ArgumentException("Missing value for --frame-variance");
                }

                index++;
                if (!double.TryParse(args[index], out var variance) || variance < 0)
                {
                    throw new ArgumentException("Frame variance must be non-negative.");
                }

                options.FrameVariancePercentage = variance;
            }
            else if (string.Equals(argument, "--before-frames", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length)
                {
                    throw new ArgumentException("Missing value for --before-frames");
                }

                index++;
                options.BeforeSampleFrames = ParseFrameCount(args[index]);
            }
            else if (string.Equals(argument, "--after-frames", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length)
                {
                    throw new ArgumentException("Missing value for --after-frames");
                }

                index++;
                options.AfterSampleFrames = ParseFrameCount(args[index]);
            }
            else if (string.Equals(argument, "--frame-interval", StringComparison.OrdinalIgnoreCase))
            {
                if (index + 1 >= args.Length)
                {
                    throw new ArgumentException("Missing value for --frame-interval");
                }

                index++;
                if (!int.TryParse(args[index], out var milliseconds) || milliseconds <= 0)
                {
                    throw new ArgumentException("Frame interval must be a positive integer representing milliseconds.");
                }

                options.FrameIntervalMilliseconds = milliseconds;
            }
            else
            {
                throw new ArgumentException($"Unrecognized argument: {argument}");
            }

            index++;
        }

        return options;
    }

    private static int ParseFrameCount(string value)
    {
        if (!int.TryParse(value, out var frames) || frames <= 0)
        {
            throw new ArgumentException("Frame count must be a positive integer.");
        }

        return frames;
    }
}
