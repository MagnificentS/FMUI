namespace FMUI.Wpf.UI.Cards;

public enum CardType
{
    PlayerDetail = 0,
    SquadSummary = 1,
    TacticalOverview = 2,
    TrainingSchedule = 3,
    TransferTargets = 4,
    TransferBudget = 5,
    FinancialOverview = 6,
    LeagueTable = 7,
    UpcomingFixtures = 8,
    InjuryList = 9,
    ScoutingReport = 10,
    ContractNegotiations = 11,
    YouthDevelopment = 12,
    Metric = 13,
    LineChart = 14,
    Gauge = 15,
    Timeline = 16,
    MedicalTimeline = 17,
    ClubVisionRoadmap = 18,
    ClubVisionExpectations = 19
}

public static class CardTypeMetadata
{
    public const int Count = 20;
}
