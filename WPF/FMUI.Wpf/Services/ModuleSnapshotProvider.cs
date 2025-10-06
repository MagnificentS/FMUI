using System;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

public interface IModuleSnapshotProvider
{
    OverviewSnapshot GetOverview();

    SquadSnapshot GetSquad();

    TacticalSnapshot GetTactics();

    TrainingSnapshot GetTraining();

    TransfersSnapshot GetTransfers();

    FinanceSnapshot GetFinance();

    FixturesSnapshot GetFixtures();
}

public sealed class ModuleSnapshotProvider : IModuleSnapshotProvider
{
    private readonly IClubDataService _clubDataService;

    public ModuleSnapshotProvider(IClubDataService clubDataService)
    {
        _clubDataService = clubDataService ?? throw new ArgumentNullException(nameof(clubDataService));
    }

    public OverviewSnapshot GetOverview() => _clubDataService.Current.Overview;

    public SquadSnapshot GetSquad() => _clubDataService.Current.Squad;

    public TacticalSnapshot GetTactics() => _clubDataService.Current.Tactics;

    public TrainingSnapshot GetTraining() => _clubDataService.Current.Training;

    public TransfersSnapshot GetTransfers() => _clubDataService.Current.Transfers;

    public FinanceSnapshot GetFinance() => _clubDataService.Current.Finance;

    public FixturesSnapshot GetFixtures() => _clubDataService.Current.Fixtures;
}
