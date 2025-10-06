using System;
using System.Collections.Generic;
using System.Windows;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels;

public interface ICardPresenterDescriptor
{
    string CardId { get; }

    CardGeometry Geometry { get; }

    CardDefinition Definition { get; }

    bool IsCustom { get; }

    string? PresetId { get; }

    bool HasFormationPlayers { get; }

    IReadOnlyList<FormationPlayerViewModel> FormationPlayers { get; }

    void SetSelected(bool selected);

    void SetVisibility(bool visible);

    void UpdateGeometry(int column, int row, int columnSpan, int rowSpan);

    Rect GetBounds();

    IReadOnlyList<FormationPlayerState> GetFormationPlayerStates();

    void ApplyFormationState(IReadOnlyList<FormationPlayerState> states);

    void UpdateFormationPlayer(string playerId, double normalizedX, double normalizedY);
}

public sealed class CardViewModelDescriptorAdapter : ICardPresenterDescriptor
{
    public CardViewModelDescriptorAdapter(CardViewModel viewModel)
    {
        ViewModel = viewModel ?? throw new ArgumentNullException(nameof(viewModel));
    }

    public CardViewModel ViewModel { get; }

    public string CardId => ViewModel.Id;

    public CardGeometry Geometry => ViewModel.Geometry;

    public CardDefinition Definition => ViewModel.Definition;

    public bool IsCustom => ViewModel.IsCustom;

    public string? PresetId => ViewModel.PresetId;

    public bool HasFormationPlayers => ViewModel.HasFormationPlayers;

    public IReadOnlyList<FormationPlayerViewModel> FormationPlayers => ViewModel.FormationPlayers;

    public void SetSelected(bool selected) => ViewModel.SetSelected(selected);

    public void SetVisibility(bool visible) => ViewModel.SetVisibility(visible);

    public void UpdateGeometry(int column, int row, int columnSpan, int rowSpan)
        => ViewModel.UpdateGeometry(column, row, columnSpan, rowSpan);

    public Rect GetBounds() => ViewModel.GetBounds();

    public IReadOnlyList<FormationPlayerState> GetFormationPlayerStates()
        => ViewModel.GetFormationPlayerStates();

    public void ApplyFormationState(IReadOnlyList<FormationPlayerState> states)
        => ViewModel.ApplyFormationState(states);

    public void UpdateFormationPlayer(string playerId, double normalizedX, double normalizedY)
        => ViewModel.UpdateFormationPlayer(playerId, normalizedX, normalizedY);
}

public readonly struct CardPresenter
{
    public const int InvalidId = -1;

    public CardPresenter(int presenterId, ICardPresenterDescriptor descriptor, bool isAdapter)
    {
        PresenterId = presenterId;
        Descriptor = descriptor ?? throw new ArgumentNullException(nameof(descriptor));
        IsAdapter = isAdapter;
    }

    public int PresenterId { get; }

    public ICardPresenterDescriptor Descriptor { get; }

    public bool IsAdapter { get; }

    public static CardPresenter CreateAdapter(int presenterId, CardViewModelDescriptorAdapter adapter)
        => new(presenterId, adapter, true);
}
