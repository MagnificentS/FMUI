using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using System.Windows.Media;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public sealed class ShotMapViewModel : ObservableObject
{
    private const double DefaultPitchWidth = 120d;
    private const double DefaultPitchHeight = 80d;

    private readonly ReadOnlyCollection<ShotMapFilterViewModel> _filters;
    private readonly ReadOnlyCollection<ShotMapEventViewModel> _shots;
    private readonly RelayCommand _selectShotCommand;
    private readonly RelayCommand _clearSelectionCommand;
    private readonly Dictionary<string, ShotMapFilterViewModel> _filterLookup;
    private ShotMapEventViewModel? _selectedShot;
    private string _summary;
    private readonly double _pitchWidth;
    private readonly double _pitchHeight;

    public ShotMapViewModel(ShotMapDefinition definition)
    {
        _pitchWidth = definition.PitchWidth <= 0 ? DefaultPitchWidth : definition.PitchWidth;
        _pitchHeight = definition.PitchHeight <= 0 ? DefaultPitchHeight : definition.PitchHeight;

        _filters = new ReadOnlyCollection<ShotMapFilterViewModel>(CreateFilters(definition.Filters));
        foreach (var filter in _filters)
        {
            filter.PropertyChanged += OnFilterPropertyChanged;
        }

        _filterLookup = _filters.ToDictionary(f => f.Key, StringComparer.OrdinalIgnoreCase);
        _shots = new ReadOnlyCollection<ShotMapEventViewModel>(CreateShots(definition.Events, _filterLookup, _pitchWidth, _pitchHeight));

        _selectShotCommand = new RelayCommand(
            parameter =>
            {
                if (parameter is ShotMapEventViewModel shot && shot.IsVisible)
                {
                    SelectedShot = shot;
                }
            },
            parameter => parameter is ShotMapEventViewModel shot && shot.IsVisible);

        _clearSelectionCommand = new RelayCommand(
            _ => SelectedShot = null,
            _ => SelectedShot is not null);

        UpdateShotVisibility();
        _summary = BuildSummary();
    }

    public IReadOnlyList<ShotMapFilterViewModel> Filters => _filters;

    public IReadOnlyList<ShotMapEventViewModel> Shots => _shots;

    public double PitchWidth => _pitchWidth;

    public double PitchHeight => _pitchHeight;

    public ICommand SelectShotCommand => _selectShotCommand;

    public ICommand ClearSelectionCommand => _clearSelectionCommand;

    public ShotMapEventViewModel? SelectedShot
    {
        get => _selectedShot;
        private set
        {
            if (SetProperty(ref _selectedShot, value))
            {
                foreach (var shot in _shots)
                {
                    shot.IsSelected = shot == value;
                }

                _clearSelectionCommand.RaiseCanExecuteChanged();
                OnPropertyChanged(nameof(HasSelectedShot));
            }
        }
    }

    public bool HasSelectedShot => SelectedShot is not null;

    public string Summary
    {
        get => _summary;
        private set => SetProperty(ref _summary, value);
    }

    private void OnFilterPropertyChanged(object? sender, PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(ShotMapFilterViewModel.IsEnabled))
        {
            UpdateShotVisibility();
            Summary = BuildSummary();
            _selectShotCommand.RaiseCanExecuteChanged();
        }
    }

    private void UpdateShotVisibility()
    {
        foreach (var shot in _shots)
        {
            var isEnabled = shot.Filter is null || shot.Filter.IsEnabled;
            shot.IsVisible = isEnabled;

            if (!isEnabled && ReferenceEquals(SelectedShot, shot))
            {
                SelectedShot = null;
            }
        }
    }

    private string BuildSummary()
    {
        var total = _shots.Count;
        if (total == 0)
        {
            return "No shots recorded";
        }

        var visible = _shots.Count(s => s.IsVisible);
        var goals = _shots.Count(s => s.IsVisible && s.Filter?.IsGoal == true);
        var onTarget = _shots.Count(s => s.IsVisible && s.Filter?.IsOnTarget == true);

        return $"{visible} of {total} shots shown • {goals} goals • {onTarget} on target";
    }

    private static List<ShotMapFilterViewModel> CreateFilters(IReadOnlyList<ShotMapFilterDefinition> definitions)
    {
        if (definitions is null || definitions.Count == 0)
        {
            return new List<ShotMapFilterViewModel>();
        }

        var list = new List<ShotMapFilterViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            list.Add(new ShotMapFilterViewModel(definition));
        }

        return list;
    }

    private static List<ShotMapEventViewModel> CreateShots(
        IReadOnlyList<ShotMapEventDefinition> definitions,
        Dictionary<string, ShotMapFilterViewModel> filterLookup,
        double pitchWidth,
        double pitchHeight)
    {
        if (definitions is null || definitions.Count == 0)
        {
            return new List<ShotMapEventViewModel>();
        }

        var list = new List<ShotMapEventViewModel>(definitions.Count);
        foreach (var definition in definitions)
        {
            filterLookup.TryGetValue(definition.OutcomeKey, out var filter);
            list.Add(new ShotMapEventViewModel(definition, filter, pitchWidth, pitchHeight));
        }

        return list;
    }
}

public sealed class ShotMapFilterViewModel : ObservableObject
{
    private readonly ShotMapFilterDefinition _definition;
    private bool _isEnabled;

    public ShotMapFilterViewModel(ShotMapFilterDefinition definition)
    {
        _definition = definition;
        _isEnabled = definition.IsDefault;
        Brush = BrushUtilities.CreateFrozenBrush(definition.Color, Brushes.DeepSkyBlue);
        IsGoal = string.Equals(definition.Key, "goal", StringComparison.OrdinalIgnoreCase);
        IsOnTarget = IsGoal || string.Equals(definition.Key, "on-target", StringComparison.OrdinalIgnoreCase);
    }

    public string Key => _definition.Key;

    public string DisplayName => _definition.DisplayName;

    public Brush Brush { get; }

    public bool IsGoal { get; }

    public bool IsOnTarget { get; }

    public bool IsEnabled
    {
        get => _isEnabled;
        set => SetProperty(ref _isEnabled, value);
    }
}

public sealed class ShotMapEventViewModel : ObservableObject
{
    private const double TokenSize = 16d;

    private readonly ShotMapEventDefinition _definition;
    private readonly double _pitchWidth;
    private readonly double _pitchHeight;
    private readonly SolidColorBrush _fillBrush;
    private bool _isVisible = true;
    private bool _isSelected;

    public ShotMapEventViewModel(ShotMapEventDefinition definition, ShotMapFilterViewModel? filter, double pitchWidth, double pitchHeight)
    {
        _definition = definition;
        Filter = filter;
        _pitchWidth = pitchWidth <= 0 ? 120d : pitchWidth;
        _pitchHeight = pitchHeight <= 0 ? 80d : pitchHeight;

        var baseColor = !string.IsNullOrWhiteSpace(definition.Accent)
            ? BrushUtilities.CreateFrozenBrush(definition.Accent!, Brushes.DeepSkyBlue)
            : filter?.Brush as SolidColorBrush ?? BrushUtilities.CreateFrozenBrush("#FF2EC4B6", Brushes.DeepSkyBlue);

        _fillBrush = baseColor;
    }

    public ShotMapFilterViewModel? Filter { get; }

    public string Player => _definition.Player;

    public string Minute => _definition.Minute;

    public string OutcomeKey => _definition.OutcomeKey;

    public string OutcomeDisplay => Filter?.DisplayName ?? OutcomeKey;

    public string? Assist => _definition.Assist;

    public string? BodyPart => _definition.BodyPart;

    public double? ExpectedGoals => _definition.ExpectedGoals;

    public string? Detail => _definition.Detail;

    public Brush FillBrush => _fillBrush;

    public Brush StrokeBrush => Brushes.White;

    public double NormalizedX => Math.Clamp(_definition.X / _pitchWidth, 0d, 1d);

    public double NormalizedY => Math.Clamp(_definition.Y / _pitchHeight, 0d, 1d);

    public double CanvasLeft => Math.Clamp(_definition.X, 0d, _pitchWidth) - (TokenSize / 2d);

    public double CanvasTop => Math.Clamp(_definition.Y, 0d, _pitchHeight) - (TokenSize / 2d);

    public double Diameter => TokenSize;

    public bool IsVisible
    {
        get => _isVisible;
        set => SetProperty(ref _isVisible, value);
    }

    public bool IsSelected
    {
        get => _isSelected;
        set => SetProperty(ref _isSelected, value);
    }

    public string Tooltip
    {
        get
        {
            var parts = new List<string>
            {
                $"{Minute} — {Player}",
                $"Outcome: {OutcomeDisplay}"
            };

            if (ExpectedGoals is not null)
            {
                parts.Add($"xG: {ExpectedGoals:0.00}");
            }

            if (!string.IsNullOrWhiteSpace(Assist))
            {
                parts.Add($"Assist: {Assist}");
            }

            if (!string.IsNullOrWhiteSpace(BodyPart))
            {
                parts.Add($"Body Part: {BodyPart}");
            }

            if (!string.IsNullOrWhiteSpace(Detail))
            {
                parts.Add(_definition.Detail!);
            }

            return string.Join("\n", parts);
        }
    }
}
