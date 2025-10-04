using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class TransferNegotiationCardViewModel
{
    public TransferNegotiationCardViewModel(TransferNegotiationDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Deals = definition.Deals is { Count: > 0 }
            ? definition.Deals.Select(deal => new TransferNegotiationDealCardViewModel(deal)).ToList()
            : new List<TransferNegotiationDealCardViewModel>();
    }

    public IReadOnlyList<TransferNegotiationDealCardViewModel> Deals { get; }

    public bool HasDeals => Deals.Count > 0;
}

public sealed class TransferNegotiationDealCardViewModel
{
    public TransferNegotiationDealCardViewModel(TransferNegotiationDealDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Player = definition.Player;
        Position = definition.Position;
        Club = definition.Club;
        Stage = definition.Stage;
        Status = definition.Status;
        Deadline = definition.Deadline;
        Summary = definition.Summary;
        Agent = definition.Agent;
        Response = definition.Response;
        Accent = definition.Accent;

        Terms = definition.Terms is { Count: > 0 }
            ? definition.Terms.Select(term => new TransferNegotiationTermCardViewModel(term)).ToList()
            : new List<TransferNegotiationTermCardViewModel>();
    }

    public string Player { get; }

    public string Position { get; }

    public string Club { get; }

    public string Stage { get; }

    public string Status { get; }

    public string Deadline { get; }

    public string Summary { get; }

    public string Agent { get; }

    public string Response { get; }

    public string? Accent { get; }

    public IReadOnlyList<TransferNegotiationTermCardViewModel> Terms { get; }

    public bool HasSummary => !string.IsNullOrWhiteSpace(Summary);

    public bool HasAgent => !string.IsNullOrWhiteSpace(Agent);

    public bool HasResponse => !string.IsNullOrWhiteSpace(Response);

    public bool HasAccent => !string.IsNullOrWhiteSpace(Accent);
}

public sealed class TransferNegotiationTermCardViewModel
{
    private readonly TransferNegotiationTermDefinition _definition;

    public TransferNegotiationTermCardViewModel(TransferNegotiationTermDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        DisplayValue = string.Format(CultureInfo.InvariantCulture, definition.Format, definition.Value);
        TargetDisplay = string.Format(CultureInfo.InvariantCulture, definition.Format, definition.Target);
        DeltaDisplay = string.Format(
            CultureInfo.InvariantCulture,
            definition.Format,
            definition.Value - definition.Target);
        Progress = CalculateProgress(definition.Value, definition.Target, definition.Maximum);
        IsTargetMet = definition.Value >= definition.Target;
    }

    public string Label => _definition.Label;

    public string DisplayValue { get; }

    public string TargetDisplay { get; }

    public string DeltaDisplay { get; }

    public double Progress { get; }

    public bool IsTargetMet { get; }

    public string? Tooltip => _definition.Tooltip;

    private static double CalculateProgress(double value, double target, double maximum)
    {
        if (target <= 0 && maximum <= 0)
        {
            return value > 0 ? 1d : 0d;
        }

        var denominator = target > 0 ? target : maximum;
        if (denominator <= 0)
        {
            return 0d;
        }

        var ratio = value / denominator;
        if (double.IsNaN(ratio) || double.IsInfinity(ratio))
        {
            return 0d;
        }

        return Math.Clamp(ratio, 0d, 1d);
    }
}
