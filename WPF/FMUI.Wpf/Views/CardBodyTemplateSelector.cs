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

    public override DataTemplate? SelectTemplate(object item, DependencyObject container)
    {
        if (item is CardViewModel card)
        {
            return card.Kind switch
            {
                CardKind.Metric => MetricTemplate ?? base.SelectTemplate(item, container),
                CardKind.List => ListTemplate ?? base.SelectTemplate(item, container),
                CardKind.Formation => FormationTemplate ?? base.SelectTemplate(item, container),
                CardKind.Fixture => FixtureTemplate ?? base.SelectTemplate(item, container),
                CardKind.Status => StatusTemplate ?? base.SelectTemplate(item, container),
                _ => base.SelectTemplate(item, container)
            };
        }

        return base.SelectTemplate(item, container);
    }
}
