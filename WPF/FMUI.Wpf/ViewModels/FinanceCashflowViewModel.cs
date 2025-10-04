using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class FinanceCashflowViewModel : ObservableObject
{
    private readonly FinanceCashflowDefinition _definition;
    private readonly ReadOnlyCollection<FinanceCashflowCategoryViewModel> _categories;
    private FinanceCashflowCategoryViewModel? _selectedCategory;
    private IReadOnlyList<FinanceCashflowItemViewModel> _activeItems;

    public FinanceCashflowViewModel(FinanceCashflowDefinition definition)
    {
        _definition = definition ?? throw new ArgumentNullException(nameof(definition));
        var categories = definition.Categories
            ?.Select(category => new FinanceCashflowCategoryViewModel(category))
            .ToList() ?? new List<FinanceCashflowCategoryViewModel>();

        _categories = new ReadOnlyCollection<FinanceCashflowCategoryViewModel>(categories);
        _activeItems = Array.Empty<FinanceCashflowItemViewModel>();

        if (_categories.Count > 0)
        {
            SelectedCategory = _categories[0];
        }
    }

    public string SummaryLabel => _definition.SummaryLabel;

    public string SummaryValue
    {
        get
        {
            var selectedAmount = SelectedCategory?.Amount ?? TotalAmount;
            return string.Format(
                CultureInfo.InvariantCulture,
                _definition.SummaryFormat,
                selectedAmount,
                TotalAmount);
        }
    }

    public IReadOnlyList<FinanceCashflowCategoryViewModel> Categories => _categories;

    public FinanceCashflowCategoryViewModel? SelectedCategory
    {
        get => _selectedCategory;
        set
        {
            if (SetProperty(ref _selectedCategory, value))
            {
                _activeItems = value?.Items ?? Array.Empty<FinanceCashflowItemViewModel>();
                OnPropertyChanged(nameof(Items));
                OnPropertyChanged(nameof(SummaryValue));
                OnPropertyChanged(nameof(SelectedCategoryName));
                OnPropertyChanged(nameof(SelectedCategoryDescription));
                OnPropertyChanged(nameof(HasSelectedCategoryDescription));
            }
        }
    }

    public string SelectedCategoryName => SelectedCategory?.Name ?? "Cash flow";

    public string? SelectedCategoryDescription => SelectedCategory?.Description;

    public bool HasSelectedCategoryDescription => !string.IsNullOrWhiteSpace(SelectedCategoryDescription);

    public IReadOnlyList<FinanceCashflowItemViewModel> Items => _activeItems;

    private double TotalAmount => _categories.Sum(category => category.Amount);
}

public sealed class FinanceCashflowCategoryViewModel
{
    internal FinanceCashflowCategoryViewModel(FinanceCashflowCategoryDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Name = definition.Name;
        Description = definition.Description;
        Amount = definition.Amount;
        Format = definition.Format;
        Accent = definition.Accent;
        Items = new ReadOnlyCollection<FinanceCashflowItemViewModel>(
            definition.Items?.Select(item => new FinanceCashflowItemViewModel(item)).ToList()
            ?? new List<FinanceCashflowItemViewModel>());
    }

    public string Name { get; }

    public string? Description { get; }

    public double Amount { get; }

    public string Format { get; }

    public string? Accent { get; }

    public IReadOnlyList<FinanceCashflowItemViewModel> Items { get; }

    public string DisplayAmount => string.Format(CultureInfo.InvariantCulture, Format, Amount);
}

public sealed class FinanceCashflowItemViewModel
{
    internal FinanceCashflowItemViewModel(FinanceCashflowItemDefinition definition)
    {
        if (definition is null)
        {
            throw new ArgumentNullException(nameof(definition));
        }

        Id = definition.Id;
        Name = definition.Name;
        Amount = definition.Amount;
        Format = definition.Format;
        Accent = definition.Accent;
        Detail = definition.Detail;
    }

    public string Id { get; }

    public string Name { get; }

    public double Amount { get; }

    public string Format { get; }

    public string? Accent { get; }

    public string? Detail { get; }

    public string DisplayAmount => string.Format(CultureInfo.InvariantCulture, Format, Amount);
}
