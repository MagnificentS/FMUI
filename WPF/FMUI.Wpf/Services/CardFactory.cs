using System;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Modules;
using FMUI.Wpf.UI.Cards;
using Microsoft.Extensions.DependencyInjection;

namespace FMUI.Wpf.Services;

public sealed class CardFactory
{
    private readonly ObjectPool<ICardContent>?[] _pools;
    private readonly Func<IServiceProvider, ICardContent>?[] _factories;
    private readonly IServiceProvider _serviceProvider;

    public CardFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        _pools = new ObjectPool<ICardContent>?[CardTypeMetadata.Count];
        _factories = new Func<IServiceProvider, ICardContent>?[CardTypeMetadata.Count];

        Register(
            CardType.PlayerDetail,
            provider => new PlayerDetailCard(
                provider.GetRequiredService<PlayerDatabase>(),
                provider.GetRequiredService<SquadService>(),
                provider.GetRequiredService<StringDatabase>()),
            maxPoolSize: 8);

        Register(
            CardType.TacticalOverview,
            provider => new FormationCardContent(
                provider.GetRequiredService<SquadService>(),
                provider.GetRequiredService<StringDatabase>()),
            maxPoolSize: 8);

        Register(
            CardType.TransferTargets,
            provider => new TransferTargetsCard(
                provider.GetRequiredService<TransferModule>(),
                provider.GetRequiredService<PlayerDatabase>(),
                provider.GetRequiredService<StringDatabase>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 16);

        Register(
            CardType.SquadSummary,
            _ => new ListCardContent(),
            maxPoolSize: 24);

        Register(
            CardType.ScoutingReport,
            provider => new ScoutingAssignmentsCard(
                provider.GetRequiredService<ScoutingModule>(),
                provider.GetRequiredService<PlayerDatabase>(),
                provider.GetRequiredService<StringDatabase>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 16);

        Register(
            CardType.FinancialOverview,
            provider => new FinanceOverviewCard(
                provider.GetRequiredService<FinanceModule>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 8);

        Register(
            CardType.TransferBudget,
            provider => new TransferBudgetCard(
                provider.GetRequiredService<FinanceModule>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 8);

        Register(
            CardType.InjuryList,
            provider => new InjuryListCard(
                provider.GetRequiredService<MedicalModule>(),
                provider.GetRequiredService<PlayerDatabase>(),
                provider.GetRequiredService<StringDatabase>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 12);

        Register(
            CardType.LeagueTable,
            provider => new LeagueTableCard(
                provider.GetRequiredService<CompetitionModule>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 8);

        Register(
            CardType.TrainingSchedule,
            provider => new TrainingScheduleCard(
                provider.GetRequiredService<TrainingModule>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 12);

        Register(
            CardType.YouthDevelopment,
            provider => new YouthDevelopmentCard(
                provider.GetRequiredService<MediaModule>(),
                provider.GetRequiredService<PlayerDatabase>(),
                provider.GetRequiredService<StringDatabase>(),
                provider.GetRequiredService<IEventAggregator>()),
            maxPoolSize: 12);

        Register(
            CardType.ContractNegotiations,
            _ => new ListCardContent(),
            maxPoolSize: 16);

        Register(
            CardType.Metric,
            _ => new MetricCardContent(),
            maxPoolSize: 32);

        Register(
            CardType.LineChart,
            _ => new LineChartCardContent(),
            maxPoolSize: 16);

        Register(
            CardType.Gauge,
            _ => new GaugeCardContent(),
            maxPoolSize: 16);

        Register(
            CardType.UpcomingFixtures,
            _ => new FixtureCardContent(),
            maxPoolSize: 16);

        Register(
            CardType.Timeline,
            _ => new TimelineCardContent(),
            maxPoolSize: 16);

        Register(
            CardType.MedicalTimeline,
            _ => new MedicalTimelineCardContent(),
            maxPoolSize: 8);

        Register(
            CardType.ClubVisionRoadmap,
            _ => new ClubVisionRoadmapCard(),
            maxPoolSize: 8);

        Register(
            CardType.ClubVisionExpectations,
            _ => new ClubVisionExpectationsCard(),
            maxPoolSize: 8);
    }

    public ICardContent Rent(CardType type)
    {
        var pool = _pools[(int)type];
        if (pool is null)
        {
            var factory = _factories[(int)type];
            if (factory is null)
            {
                throw new InvalidOperationException($"No card factory registered for card type '{type}'.");
            }

            pool = CreatePool(type, factory, 8);
            _pools[(int)type] = pool;
        }

        return pool.Rent();
    }

    public void Return(ICardContent content)
    {
        if (content is null)
        {
            return;
        }

        var index = (int)content.Type;
        var pool = _pools[index];
        if (pool is null)
        {
            var factory = _factories[index];
            if (factory is null)
            {
                return;
            }

            pool = CreatePool(content.Type, factory, 8);
            _pools[index] = pool;
        }

        pool.Return(content);
    }

    private void Register(CardType type, Func<IServiceProvider, ICardContent> factory, int maxPoolSize)
    {
        var index = (int)type;
        _factories[index] = factory;
        _pools[index] = CreatePool(type, factory, maxPoolSize);
    }

    private ObjectPool<ICardContent> CreatePool(CardType type, Func<IServiceProvider, ICardContent> factory, int maxPoolSize)
    {
        return new ObjectPool<ICardContent>(
            () => factory(_serviceProvider),
            static card => card.Reset(),
            maxPoolSize);
    }
}
