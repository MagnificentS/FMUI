using System.Windows;
using System.Windows.Controls;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Views;

public sealed class CardBodyTemplateSelector : DataTemplateSelector
{
    public DataTemplate? MetricTemplate { get; set; }

    public DataTemplate? ListTemplate { get; set; }

    public DataTemplate? FormationTemplate { get; set; }

    public DataTemplate? FixtureTemplate { get; set; }

    public DataTemplate? StatusTemplate { get; set; }

    public DataTemplate? LineChartTemplate { get; set; }

    public DataTemplate? GaugeTemplate { get; set; }

    public DataTemplate? TimelineTemplate { get; set; }

    public DataTemplate? TrainingCalendarTemplate { get; set; }

    public DataTemplate? ForecastTemplate { get; set; }

    public DataTemplate? WorkloadHeatmapTemplate { get; set; }

    public DataTemplate? MoraleHeatmapTemplate { get; set; }

    public DataTemplate? SquadTableTemplate { get; set; }

    public DataTemplate? FixtureCalendarTemplate { get; set; }

    public DataTemplate? TransferNegotiationTemplate { get; set; }

    public DataTemplate? ScoutAssignmentsTemplate { get; set; }

    public DataTemplate? ShortlistBoardTemplate { get; set; }

    public DataTemplate? TrainingUnitBoardTemplate { get; set; }

    public DataTemplate? TrainingProgressionTemplate { get; set; }

    public DataTemplate? ShotMapTemplate { get; set; }

    public DataTemplate? MedicalTimelineTemplate { get; set; }

    public DataTemplate? FinanceCashflowTemplate { get; set; }

    public DataTemplate? FinanceBudgetAllocatorTemplate { get; set; }

    public DataTemplate? FinanceScenarioTemplate { get; set; }

    public DataTemplate? ContentHostTemplate { get; set; }

    public override DataTemplate? SelectTemplate(object item, DependencyObject container)
    {
        if (item is CardViewModel card)
        {
            if (card.HasContentHost && ContentHostTemplate is not null)
            {
                return ContentHostTemplate;
            }

            return card.Kind switch
            {
                CardKind.Metric => MetricTemplate ?? base.SelectTemplate(item, container),
                CardKind.List => ListTemplate ?? base.SelectTemplate(item, container),
                CardKind.Formation => FormationTemplate ?? base.SelectTemplate(item, container),
                CardKind.Fixture => FixtureTemplate ?? base.SelectTemplate(item, container),
                CardKind.Status => StatusTemplate ?? base.SelectTemplate(item, container),
                CardKind.LineChart => LineChartTemplate ?? base.SelectTemplate(item, container),
                CardKind.Gauge => GaugeTemplate ?? base.SelectTemplate(item, container),
                CardKind.Timeline => TimelineTemplate ?? base.SelectTemplate(item, container),
                CardKind.TrainingCalendar => TrainingCalendarTemplate ?? base.SelectTemplate(item, container),
                CardKind.Forecast => ForecastTemplate ?? base.SelectTemplate(item, container),
                CardKind.WorkloadHeatmap => WorkloadHeatmapTemplate ?? base.SelectTemplate(item, container),
                CardKind.MoraleHeatmap => MoraleHeatmapTemplate ?? base.SelectTemplate(item, container),
                CardKind.SquadTable => SquadTableTemplate ?? base.SelectTemplate(item, container),
                CardKind.FixtureCalendar => FixtureCalendarTemplate ?? base.SelectTemplate(item, container),
                CardKind.TransferNegotiation => TransferNegotiationTemplate ?? base.SelectTemplate(item, container),
                CardKind.ScoutAssignments => ScoutAssignmentsTemplate ?? base.SelectTemplate(item, container),
                CardKind.ShortlistBoard => ShortlistBoardTemplate ?? base.SelectTemplate(item, container),
                CardKind.TrainingUnitBoard => TrainingUnitBoardTemplate ?? base.SelectTemplate(item, container),
                CardKind.TrainingProgression => TrainingProgressionTemplate ?? base.SelectTemplate(item, container),
                CardKind.ShotMap => ShotMapTemplate ?? base.SelectTemplate(item, container),
                CardKind.MedicalTimeline => MedicalTimelineTemplate ?? base.SelectTemplate(item, container),
                CardKind.FinanceCashflow => FinanceCashflowTemplate ?? base.SelectTemplate(item, container),
                CardKind.FinanceBudgetAllocator => FinanceBudgetAllocatorTemplate ?? base.SelectTemplate(item, container),
                CardKind.FinanceScenarioBoard => FinanceScenarioTemplate ?? base.SelectTemplate(item, container),
                CardKind.ContentHost => ContentHostTemplate ?? base.SelectTemplate(item, container),
                _ => base.SelectTemplate(item, container)
            };
        }

        return base.SelectTemplate(item, container);
    }
}
