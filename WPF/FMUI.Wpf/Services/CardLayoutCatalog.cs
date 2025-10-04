using System.Collections.Generic;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public sealed class CardLayoutCatalog
{
    private readonly Dictionary<(string Tab, string Section), CardLayout> _layouts;

    public CardLayoutCatalog()
    {
        _layouts = new Dictionary<(string, string), CardLayout>
        {
            [("tactics", "tactics-overview")] = BuildTacticsOverview(),
            [("overview", "club-vision")] = BuildClubVisionOverview(),
            [("training", "training-overview")] = BuildTrainingOverview(),
        };
    }

    public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout)
    {
        return _layouts.TryGetValue((tabIdentifier, sectionIdentifier), out layout);
    }

    private static CardLayout BuildTacticsOverview()
    {
        var cards = new List<CardDefinition>
        {
            new(
                Id: "formation-overview",
                Title: "4-2-3-1 Wide",
                Subtitle: "Starting XI",
                Kind: CardKind.Formation,
                Column: 0,
                Row: 0,
                ColumnSpan: 22,
                RowSpan: 14,
                Description: "Balanced attacking structure with inverted wingers tucking inside to overload the half-spaces.",
                PillText: "Positive",
                FormationLines: new List<FormationLineDefinition>
                {
                    new("Striker", new[] { "Ivan Toney (AF)" }),
                    new("Attacking Midfield", new[] { "Phil Foden (IW)", "Martin Ødegaard (AP)", "Bukayo Saka (IW)" }),
                    new("Midfield Pivot", new[] { "Declan Rice (HB)", "Youri Tielemans (BBM)" }),
                    new("Defence", new[] { "Kieran Tierney (WB)", "Gabriel (CD)", "Ben White (BPD)", "Takehiro Tomiyasu (WB)" }),
                    new("Goalkeeper", new[] { "Aaron Ramsdale (SK)" }),
                }),
            new(
                Id: "team-fluidity",
                Title: "Team Fluidity",
                Subtitle: "Shape cohesion",
                Kind: CardKind.Metric,
                Column: 22,
                Row: 0,
                ColumnSpan: 7,
                RowSpan: 5,
                MetricValue: "Highly Fluid",
                MetricLabel: "Players interchange positions freely, supporting overloads down both flanks.",
                PillText: "Excellent"),
            new(
                Id: "mentality",
                Title: "Mentality",
                Subtitle: "In possession mindset",
                Kind: CardKind.Metric,
                Column: 29,
                Row: 0,
                ColumnSpan: 8,
                RowSpan: 5,
                MetricValue: "Positive",
                MetricLabel: "Balanced risk taking with emphasis on progressive runs and penetrative passing."),
            new(
                Id: "in-possession",
                Title: "In Possession",
                Subtitle: "Selected instructions",
                Kind: CardKind.List,
                Column: 22,
                Row: 5,
                ColumnSpan: 15,
                RowSpan: 7,
                Description: "Encourage roaming play through the channels to destabilise compact blocks.",
                ListItems: new List<CardListItem>
                {
                    new("Width", "Fairly Wide"),
                    new("Approach Play", "Play Out Of Defence"),
                    new("Final Third", "Work Ball Into Box"),
                    new("Tempo", "Higher"),
                    new("Passing", "Shorter"),
                }),
            new(
                Id: "in-transition",
                Title: "In Transition",
                Subtitle: "Moment reactions",
                Kind: CardKind.List,
                Column: 22,
                Row: 12,
                ColumnSpan: 15,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("When Possession Has Been Lost", "Counter-Press"),
                    new("When Possession Has Been Won", "Counter"),
                    new("Goalkeeper In Possession", "Distribute Quickly", "Full-Backs"),
                }),
            new(
                Id: "out-of-possession",
                Title: "Out Of Possession",
                Subtitle: "Defensive block",
                Kind: CardKind.List,
                Column: 0,
                Row: 14,
                ColumnSpan: 18,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("Defensive Line", "Higher"),
                    new("Line Of Engagement", "Higher"),
                    new("Pressing", "More Often"),
                    new("Tackling", "Stay On Feet"),
                }),
            new(
                Id: "recent-form",
                Title: "Recent Form",
                Subtitle: "Last five fixtures",
                Kind: CardKind.List,
                Column: 18,
                Row: 14,
                ColumnSpan: 19,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("vs Man City", "W 2-1", "Premier League", "Sat"),
                    new("vs Chelsea", "D 0-0", "Premier League", "Wed"),
                    new("vs Everton", "W 3-0", "Premier League", "Sun"),
                    new("vs PSG", "L 1-2", "Champions League", "Tue"),
                    new("vs Leicester", "W 4-1", "Premier League", "Sat"),
                }),
        };

        return new CardLayout("tactics", "tactics-overview", cards);
    }

    private static CardLayout BuildClubVisionOverview()
    {
        var cards = new List<CardDefinition>
        {
            new(
                Id: "board-confidence",
                Title: "Board Confidence",
                Subtitle: "Season to date",
                Kind: CardKind.Metric,
                Column: 0,
                Row: 0,
                ColumnSpan: 12,
                RowSpan: 6,
                MetricValue: "A",
                MetricLabel: "Board delighted with league position and financial prudence.",
                PillText: "Secure"),
            new(
                Id: "supporter-confidence",
                Title: "Supporter Confidence",
                Subtitle: "Mood of the terraces",
                Kind: CardKind.Metric,
                Column: 12,
                Row: 0,
                ColumnSpan: 12,
                RowSpan: 6,
                MetricValue: "A-",
                MetricLabel: "Fans are thrilled by attacking football and marquee signings."),
            new(
                Id: "competition-expectations",
                Title: "Competition Expectations",
                Subtitle: "Key objectives",
                Kind: CardKind.List,
                Column: 24,
                Row: 0,
                ColumnSpan: 13,
                RowSpan: 9,
                ListItems: new List<CardListItem>
                {
                    new("Premier League", "Qualify for Champions League", "Current: 1st"),
                    new("Champions League", "Reach Quarter Final", "Current: Group B - 1st"),
                    new("FA Cup", "Reach Semi Final", "Current: Starts Jan"),
                    new("Carabao Cup", "Reach Final", "Current: Eliminated"),
                }),
            new(
                Id: "five-year-plan",
                Title: "Five Year Plan",
                Subtitle: "Strategic milestones",
                Kind: CardKind.List,
                Column: 0,
                Row: 6,
                ColumnSpan: 24,
                RowSpan: 6,
                ListItems: new List<CardListItem>
                {
                    new("2023/24", "Maintain club stature", "Premier League top four"),
                    new("2024/25", "Expand stadium capacity", "Board planning"),
                    new("2025/26", "Win a major trophy", "Minimum expectation"),
                }),
            new(
                Id: "finance-snapshot",
                Title: "Finance Snapshot",
                Subtitle: "Month to date",
                Kind: CardKind.List,
                Column: 0,
                Row: 12,
                ColumnSpan: 18,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("Overall Balance", "£182M"),
                    new("Transfer Budget", "£48M"),
                    new("Wage Budget", "£3.2M p/w", "Committed: £3.0M"),
                    new("Scouting Budget", "£2.4M"),
                }),
            new(
                Id: "top-performers",
                Title: "Top Performers",
                Subtitle: "Last five matches",
                Kind: CardKind.List,
                Column: 18,
                Row: 12,
                ColumnSpan: 19,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("Bukayo Saka", "3 goals", "Average Rating 7.94"),
                    new("Martin Ødegaard", "4 assists", "Average Rating 7.71"),
                    new("Declan Rice", "92% pass completion", "Average Rating 7.48"),
                }),
        };

        return new CardLayout("overview", "club-vision", cards);
    }

    private static CardLayout BuildTrainingOverview()
    {
        var cards = new List<CardDefinition>
        {
            new(
                Id: "upcoming-sessions",
                Title: "Upcoming Sessions",
                Subtitle: "Next 5 days",
                Kind: CardKind.List,
                Column: 0,
                Row: 0,
                ColumnSpan: 20,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("Mon", "Recovery", "Unit split: Senior"),
                    new("Tue", "Tactical - Shape", "Match Prep Focus"),
                    new("Wed", "Attacking - Wings", "High Intensity"),
                    new("Thu", "Match Preview", "Medium Intensity"),
                    new("Fri", "Match Practice", "Set Pieces"),
                }),
            new(
                Id: "training-intensity",
                Title: "Training Intensity",
                Subtitle: "Overall load",
                Kind: CardKind.Metric,
                Column: 20,
                Row: 0,
                ColumnSpan: 9,
                RowSpan: 5,
                MetricValue: "High",
                MetricLabel: "Condition monitored closely. Two players nearing risk threshold.",
                PillText: "Alert"),
            new(
                Id: "focus-areas",
                Title: "Focus Areas",
                Subtitle: "Current emphasis",
                Kind: CardKind.List,
                Column: 29,
                Row: 0,
                ColumnSpan: 8,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("Team Focus", "Attacking Movement"),
                    new("Match Focus", "Counter-Press"),
                    new("Individual", "Finishing", "6 players"),
                }),
            new(
                Id: "unit-coaches",
                Title: "Unit Coaches",
                Subtitle: "Specialist assignments",
                Kind: CardKind.List,
                Column: 0,
                Row: 7,
                ColumnSpan: 18,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("Goalkeeping", "Javi García", "Focus: Shot Stopping"),
                    new("Defence", "Stefan Schwarz", "Focus: Positioning"),
                    new("Midfield", "Carles Cuadrat", "Focus: Ball Retention"),
                    new("Attack", "Dennis Bergkamp", "Focus: Off The Ball"),
                }),
            new(
                Id: "medical-workload",
                Title: "Medical Workload",
                Subtitle: "Risk watch",
                Kind: CardKind.List,
                Column: 18,
                Row: 7,
                ColumnSpan: 10,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("High", "Ødegaard", "Tight calf"),
                    new("Medium", "Tierney", "Match Sharpness 68%"),
                    new("Medium", "Toney", "Match Sharpness 71%"),
                }),
            new(
                Id: "match-prep",
                Title: "Match Prep",
                Subtitle: "Weekend fixture",
                Kind: CardKind.List,
                Column: 28,
                Row: 7,
                ColumnSpan: 9,
                RowSpan: 7,
                ListItems: new List<CardListItem>
                {
                    new("Opponent", "Manchester City"),
                    new("Scout Summary", "Threat: Haaland aerially"),
                    new("Key Focus", "Limit crosses", "Double up on wings"),
                }),
            new(
                Id: "individual-focus",
                Title: "Individual Focus",
                Subtitle: "Highlighted players",
                Kind: CardKind.List,
                Column: 0,
                Row: 14,
                ColumnSpan: 19,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("Bukayo Saka", "Final Third Runs", "Progress: 73%"),
                    new("William Saliba", "Marking", "Progress: 61%"),
                    new("Emile Smith Rowe", "Agility", "Progress: 42%"),
                }),
            new(
                Id: "youth-development",
                Title: "Youth Development",
                Subtitle: "Academy focus",
                Kind: CardKind.List,
                Column: 19,
                Row: 14,
                ColumnSpan: 18,
                RowSpan: 5,
                ListItems: new List<CardListItem>
                {
                    new("U21", "Pressing Triggers", "Lead: Per Mertesacker"),
                    new("U18", "Technical Passing", "Lead: Jack Wilshere"),
                    new("U18", "Shape", "5-2-3"),
                }),
        };

        return new CardLayout("training", "training-overview", cards);
    }
}
