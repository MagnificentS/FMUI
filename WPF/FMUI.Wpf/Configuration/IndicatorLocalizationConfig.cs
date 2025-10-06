using System;
using System.Collections.Generic;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.Configuration;

public sealed record IndicatorMessageConfig(StringToken Singular, StringToken Plural);

public sealed record IndicatorScheduleMessageConfig(StringToken NextFixture, StringToken MultipleFixtures);

public sealed class IndicatorLocalizationConfig
{
    public IndicatorLocalizationConfig(
        IndicatorMessageConfig clubVision,
        IndicatorMessageConfig dynamics,
        IndicatorMessageConfig medical,
        IndicatorMessageConfig squadSelection,
        IndicatorMessageConfig squadTransfers,
        IndicatorMessageConfig trainingMedical,
        IndicatorMessageConfig transferCentre,
        IndicatorScheduleMessageConfig fixtureSchedule)
    {
        ClubVision = clubVision ?? throw new ArgumentNullException(nameof(clubVision));
        Dynamics = dynamics ?? throw new ArgumentNullException(nameof(dynamics));
        Medical = medical ?? throw new ArgumentNullException(nameof(medical));
        SquadSelection = squadSelection ?? throw new ArgumentNullException(nameof(squadSelection));
        SquadTransfers = squadTransfers ?? throw new ArgumentNullException(nameof(squadTransfers));
        TrainingMedical = trainingMedical ?? throw new ArgumentNullException(nameof(trainingMedical));
        TransferCentre = transferCentre ?? throw new ArgumentNullException(nameof(transferCentre));
        FixtureSchedule = fixtureSchedule ?? throw new ArgumentNullException(nameof(fixtureSchedule));
    }

    public IndicatorMessageConfig ClubVision { get; }

    public IndicatorMessageConfig Dynamics { get; }

    public IndicatorMessageConfig Medical { get; }

    public IndicatorMessageConfig SquadSelection { get; }

    public IndicatorMessageConfig SquadTransfers { get; }

    public IndicatorMessageConfig TrainingMedical { get; }

    public IndicatorMessageConfig TransferCentre { get; }

    public IndicatorScheduleMessageConfig FixtureSchedule { get; }

    public static IndicatorLocalizationConfig CreateDefault()
    {
        return new IndicatorLocalizationConfig(
            clubVision: new IndicatorMessageConfig(
                StringToken.Create("indicator.clubVision.singular", "{0} expectation is off target"),
                StringToken.Create("indicator.clubVision.plural", "{0} competition expectations need action")),
            dynamics: new IndicatorMessageConfig(
                StringToken.Create("indicator.dynamics.singular", "Issue raised by {0}"),
                StringToken.Create("indicator.dynamics.plural", "{0} player issues require attention")),
            medical: new IndicatorMessageConfig(
                StringToken.Create("indicator.medical.singular", "Medical flag for {0}"),
                StringToken.Create("indicator.medical.plural", "{0} medical cases active")),
            squadSelection: new IndicatorMessageConfig(
                StringToken.Create("indicator.selection.singular", "Fitness concern: {0}"),
                StringToken.Create("indicator.selection.plural", "{0} fitness concerns to manage")),
            squadTransfers: new IndicatorMessageConfig(
                StringToken.Create("indicator.squadTransfers.singular", "Transfer interest in {0}"),
                StringToken.Create("indicator.squadTransfers.plural", "{0} players attracting bids")),
            trainingMedical: new IndicatorMessageConfig(
                StringToken.Create("indicator.trainingMedical.singular", "Training risk: {0}"),
                StringToken.Create("indicator.trainingMedical.plural", "{0} players flagged by medical team")),
            transferCentre: new IndicatorMessageConfig(
                StringToken.Create("indicator.transferCentre.singular", "Deal in progress: {0}"),
                StringToken.Create("indicator.transferCentre.plural", "{0} active deals underway")),
            fixtureSchedule: new IndicatorScheduleMessageConfig(
                StringToken.Create("indicator.fixtureSchedule.next", "Next fixture: {0}"),
                StringToken.Create("indicator.fixtureSchedule.multi", "{0} fixtures this fortnight")));
    }

    public static IEnumerable<KeyValuePair<string, string>> GetResources(IndicatorLocalizationConfig config)
    {
        yield return CreatePair(config.ClubVision.Singular);
        yield return CreatePair(config.ClubVision.Plural);

        yield return CreatePair(config.Dynamics.Singular);
        yield return CreatePair(config.Dynamics.Plural);

        yield return CreatePair(config.Medical.Singular);
        yield return CreatePair(config.Medical.Plural);

        yield return CreatePair(config.SquadSelection.Singular);
        yield return CreatePair(config.SquadSelection.Plural);

        yield return CreatePair(config.SquadTransfers.Singular);
        yield return CreatePair(config.SquadTransfers.Plural);

        yield return CreatePair(config.TrainingMedical.Singular);
        yield return CreatePair(config.TrainingMedical.Plural);

        yield return CreatePair(config.TransferCentre.Singular);
        yield return CreatePair(config.TransferCentre.Plural);

        yield return CreatePair(config.FixtureSchedule.NextFixture);
        yield return CreatePair(config.FixtureSchedule.MultipleFixtures);
    }

    private static KeyValuePair<string, string> CreatePair(StringToken token)
    {
        return new KeyValuePair<string, string>(token.Id, token.Fallback ?? token.Id);
    }
}
