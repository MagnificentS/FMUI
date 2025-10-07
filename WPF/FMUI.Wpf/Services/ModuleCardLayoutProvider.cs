using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using FMUI.Wpf.Database;
using FMUI.Wpf.Collections;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;
using FMUI.Wpf.Modules;
using FMUI.Wpf.UI.Cards;

namespace FMUI.Wpf.Services;

public readonly struct ModuleLayoutChangedEventArgs
{
    public ModuleLayoutChangedEventArgs(string tabIdentifier, string sectionIdentifier)
    {
        TabIdentifier = tabIdentifier;
        SectionIdentifier = sectionIdentifier;
    }

    public string TabIdentifier { get; }

    public string SectionIdentifier { get; }
}

public enum ModuleLayoutKind
{
    Module,
    Legacy,
}

public interface IModuleCardLayoutProvider
{
    event EventHandler<ModuleLayoutChangedEventArgs>? LayoutChanged;

    bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout, out ModuleLayoutKind layoutKind);
}

public sealed class ModuleCardLayoutProvider : IModuleCardLayoutProvider, IDisposable
{
    private const string TransfersTabId = "transfers";
    private const string TransferCentreSectionId = "transfer-centre";
    private const string TransfersScoutingSectionId = "scouting";
    private const string TransfersShortlistSectionId = "shortlist";
    private const int DefaultCardWidth = 18;
    private const int MetricCardHeight = 4;
    private const int TransferCentreCardCount = 5;
    private const int ScoutingCardCount = 5;
    private const int ShortlistCardCount = 4;
    private const int TopTargetCapacity = 6;
    private const int FocusRegionCapacity = 6;
    private const int KnowledgeBandCount = 3;
    private const int ShortTermFocusCapacity = 5;
    private const int RecommendedPlayerCapacity = 6;
    private const int LoanWatchCapacity = 6;
    private const int AssignmentCapacity = 16;
    private const int ScoutOptionCapacity = 16;
    private const int ReportCapacity = 24;
    private const int ShortlistBoardCapacity = 12;
    private const int ShortlistOptionCapacity = 12;
    private const int ShortlistListCapacity = 16;
    private const uint ThousandUnit = 1_000u;
    private const uint MillionUnit = 1_000_000u;
    private const uint ThousandRounding = 100u;
    private const uint MillionRounding = 100_000u;
    private const string AvailableLabel = "Available";
    private const string UnavailableLabel = "Unavailable";
    private const string AvailableAccent = "#2EC4B6";
    private const string UnavailableAccent = "#FF4D6D";
    private const string FocusHighlightAccent = "#4895EF";
    private const string KnowledgeComprehensiveAccent = "#2EC4B6";
    private const string KnowledgeDevelopingAccent = "#FFB703";
    private const string KnowledgeInitialAccent = "#577590";
    private const string PriorityHighAccent = "#F77F00";
    private const string PriorityMediumAccent = "#F8961E";
    private const string PriorityLowAccent = "#6C757D";
    private const string RecommendationPrimaryAccent = "#4361EE";
    private const string RecommendationSecondaryAccent = "#4895EF";
    private const string NegotiationStageInitial = "Initial approach";
    private const string NegotiationStageDiscussion = "Discussions ongoing";
    private const string NegotiationStageAgreement = "Terms agreed";
    private const string NegotiationStageAwaiting = "Awaiting approval";
    private const string LoanWatchActiveDescription = "Deals currently being negotiated.";
    private const string LoanWatchEmptyDescription = "No active negotiations at present.";

    private static readonly CardPresetDefinition[] EmptyPalette = Array.Empty<CardPresetDefinition>();

    private readonly object _sync = new();
    private readonly TransferModule _transferModule;
    private readonly ScoutingModule _scoutingModule;
    private readonly PlayerDatabase _playerDatabase;
    private readonly StringDatabase _stringDatabase;
    private readonly IEventAggregator _eventAggregator;
    private readonly ICardLayoutCatalog _legacyCatalog;
    private readonly TransferModule.TransferTargetView[] _targetBuffer;
    private readonly CardListItem[] _topTargetItems;
    private readonly CardListItem[] _loanWatchItems;
    private readonly CardListItemSegment _topTargetList;
    private readonly CardListItemSegment _loanWatchList;
    private readonly CardDefinition[] _transferCards;
    private readonly IReadOnlyList<CardDefinition> _transferCardsView;
    private readonly CardLayout _transferLayout;
    private readonly ScoutingModule.ScoutAssignmentView[] _assignmentBuffer;
    private readonly ScoutingModule.ScoutReportView[] _reportBuffer;
    private readonly CardListItem[] _focusRegionItems;
    private readonly CardListItem[] _knowledgeItems;
    private readonly CardListItem[] _shortTermFocusItems;
    private readonly CardListItem[] _recommendedPlayerItems;
    private readonly CardListItemSegment _focusRegionList;
    private readonly CardListItemSegment _knowledgeList;
    private readonly CardListItemSegment _shortTermFocusList;
    private readonly CardListItemSegment _recommendedPlayerList;
    private readonly CardDefinition[] _scoutingCards;
    private readonly IReadOnlyList<CardDefinition> _scoutingCardsView;
    private readonly CardLayout _scoutingLayout;
    private readonly CardDefinition[] _shortlistCards;
    private readonly IReadOnlyList<CardDefinition> _shortlistCardsView;
    private readonly CardLayout _shortlistLayout;
    private readonly RegionSummary[] _regionSummaries;
    private readonly KnowledgeBandSummary[] _knowledgeSummaries;
    private readonly FocusAssignmentSummary[] _focusAssignments;
    private readonly ScoutAssignmentDefinition[] _assignmentDefinitions;
    private readonly ScoutOptionDefinition[] _scoutOptionDefinitions;
    private readonly string[] _stageOptions;
    private readonly string[] _priorityOptions;
    private readonly ShortlistPlayerDefinition[] _shortlistPlayers;
    private readonly string[] _shortlistStatusOptions;
    private readonly string[] _shortlistActionOptions;
    private readonly CardListItem[] _shortlistContractItems;
    private readonly CardListItem[] _shortlistCompetitionItems;
    private readonly CardListItem[] _shortlistNotesItems;
    private readonly CardListItemSegment _shortlistContractList;
    private readonly CardListItemSegment _shortlistCompetitionList;
    private readonly CardListItemSegment _shortlistNotesList;
    private string _focusRegionsDescription;
    private string _knowledgeLevelsDescription;
    private string _recommendedPlayersDescription;
    private string _shortTermFocusDescription;
    private string? _focusTopRegion;
    private int _focusTopAverage;
    private bool _focusHasSummary;
    private string? _knowledgeDominantLabel;
    private int _knowledgeDominantCount;
    private bool _knowledgeHasSummary;
    private uint _recommendedTopPlayerId;
    private string? _recommendedTopPlayerName;
    private byte _recommendedTopRating;
    private bool _recommendedHasSummary;
    private int _targetViewCount;
    private string? _shortTermTopFocus;
    private string? _shortTermTopRegion;
    private bool _shortTermHasSummary;
    private IDisposable? _subscription;
    private bool _transferLayoutInitialized;
    private bool _scoutingLayoutInitialized;
    private int _shortlistBoardCount;
    private int _shortlistStatusCount;
    private int _shortlistActionCount;
    private bool _shortlistLayoutInitialized;

    public ModuleCardLayoutProvider(
        TransferModule transferModule,
        ScoutingModule scoutingModule,
        PlayerDatabase playerDatabase,
        StringDatabase stringDatabase,
        IEventAggregator eventAggregator,
        ICardLayoutCatalog legacyCatalog)
    {
        _transferModule = transferModule ?? throw new ArgumentNullException(nameof(transferModule));
        _scoutingModule = scoutingModule ?? throw new ArgumentNullException(nameof(scoutingModule));
        _playerDatabase = playerDatabase ?? throw new ArgumentNullException(nameof(playerDatabase));
        _stringDatabase = stringDatabase ?? throw new ArgumentNullException(nameof(stringDatabase));
        _eventAggregator = eventAggregator ?? throw new ArgumentNullException(nameof(eventAggregator));
        _legacyCatalog = legacyCatalog ?? throw new ArgumentNullException(nameof(legacyCatalog));

        _targetBuffer = new TransferModule.TransferTargetView[TransferModule.MaximumTargetCount];
        _topTargetItems = new CardListItem[TopTargetCapacity];
        _loanWatchItems = new CardListItem[LoanWatchCapacity];
        _topTargetList = new CardListItemSegment(_topTargetItems);
        _loanWatchList = new CardListItemSegment(_loanWatchItems);
        _transferCards = new CardDefinition[TransferCentreCardCount];
        _transferCardsView = Array.AsReadOnly(_transferCards);
        _transferCards[0] = CreateTransferTargetsCard();
        _transferCards[4] = CreateLoanWatchCard();
        _transferLayout = new CardLayout(
            TransfersTabId,
            TransferCentreSectionId,
            _transferCardsView,
            EmptyPalette);

        _assignmentBuffer = new ScoutingModule.ScoutAssignmentView[AssignmentCapacity];
        _reportBuffer = new ScoutingModule.ScoutReportView[ReportCapacity];
        _focusRegionItems = new CardListItem[FocusRegionCapacity];
        _knowledgeItems = new CardListItem[KnowledgeBandCount];
        _shortTermFocusItems = new CardListItem[ShortTermFocusCapacity];
        _recommendedPlayerItems = new CardListItem[RecommendedPlayerCapacity];
        _focusRegionList = new CardListItemSegment(_focusRegionItems);
        _knowledgeList = new CardListItemSegment(_knowledgeItems);
        _shortTermFocusList = new CardListItemSegment(_shortTermFocusItems);
        _recommendedPlayerList = new CardListItemSegment(_recommendedPlayerItems);
        _scoutingCards = new CardDefinition[ScoutingCardCount];
        _scoutingCardsView = Array.AsReadOnly(_scoutingCards);
        _scoutingLayout = new CardLayout(
            TransfersTabId,
            TransfersScoutingSectionId,
            _scoutingCardsView,
            EmptyPalette);
        _shortlistCards = new CardDefinition[ShortlistCardCount];
        _shortlistCardsView = Array.AsReadOnly(_shortlistCards);
        _shortlistLayout = new CardLayout(
            TransfersTabId,
            TransfersShortlistSectionId,
            _shortlistCardsView,
            EmptyPalette);
        _shortlistPlayers = new ShortlistPlayerDefinition[ShortlistBoardCapacity];
        _shortlistStatusOptions = new string[ShortlistOptionCapacity];
        _shortlistActionOptions = new string[ShortlistOptionCapacity];
        _shortlistContractItems = new CardListItem[ShortlistListCapacity];
        _shortlistCompetitionItems = new CardListItem[ShortlistListCapacity];
        _shortlistNotesItems = new CardListItem[ShortlistListCapacity];
        _shortlistContractList = new CardListItemSegment(_shortlistContractItems);
        _shortlistCompetitionList = new CardListItemSegment(_shortlistCompetitionItems);
        _shortlistNotesList = new CardListItemSegment(_shortlistNotesItems);
        var defaultShortlistBoard = CreateDefaultShortlistBoard();
        _shortlistCards[0] = CreateShortlistBoardCard(defaultShortlistBoard);
        _shortlistCards[1] = CreateShortlistContractStatusCard();
        _shortlistCards[2] = CreateShortlistCompetitionCard();
        _shortlistCards[3] = CreateShortlistNotesCard();
        _regionSummaries = new RegionSummary[FocusRegionCapacity];
        _knowledgeSummaries = new KnowledgeBandSummary[KnowledgeBandCount];
        InitializeKnowledgeBands();
        _focusAssignments = new FocusAssignmentSummary[AssignmentCapacity];
        _assignmentDefinitions = new ScoutAssignmentDefinition[AssignmentCapacity];
        _scoutOptionDefinitions = new ScoutOptionDefinition[ScoutOptionCapacity];
        _stageOptions = new string[KnowledgeBandCount * 2];
        _priorityOptions = new string[3];
        _focusRegionsDescription = string.Empty;
        _knowledgeLevelsDescription = string.Empty;
        _recommendedPlayersDescription = string.Empty;
        _shortTermFocusDescription = string.Empty;
        _focusTopRegion = null;
        _focusTopAverage = 0;
        _focusHasSummary = false;
        _knowledgeDominantLabel = null;
        _knowledgeDominantCount = 0;
        _knowledgeHasSummary = false;
        _recommendedTopPlayerId = 0;
        _recommendedTopPlayerName = null;
        _recommendedTopRating = 0;
        _recommendedHasSummary = false;
        _shortTermTopFocus = null;
        _shortTermTopRegion = null;
        _shortTermHasSummary = false;

        _subscription = _eventAggregator.Subscribe<ModuleNotification>(OnModuleNotification);
        _legacyCatalog.LayoutsChanged += OnLegacyLayoutsChanged;
    }

    public event EventHandler<ModuleLayoutChangedEventArgs>? LayoutChanged;

    public bool TryGetLayout(string tabIdentifier, string sectionIdentifier, out CardLayout layout, out ModuleLayoutKind layoutKind)
    {
        if (IsTransferCentre(tabIdentifier, sectionIdentifier))
        {
            lock (_sync)
            {
                UpdateTransferCentreLayout();
                layout = _transferLayout;
            }

            layoutKind = ModuleLayoutKind.Module;
            return true;
        }

        if (IsTransfersScouting(tabIdentifier, sectionIdentifier))
        {
            lock (_sync)
            {
                UpdateScoutingLayout();
                layout = _scoutingLayout;
            }

            layoutKind = ModuleLayoutKind.Module;
            return true;
        }

        if (IsTransfersShortlist(tabIdentifier, sectionIdentifier))
        {
            lock (_sync)
            {
                UpdateShortlistLayout();
                layout = _shortlistLayout;
            }

            layoutKind = ModuleLayoutKind.Module;
            return true;
        }

        if (_legacyCatalog.TryGetLayout(tabIdentifier, sectionIdentifier, out layout))
        {
            layoutKind = ModuleLayoutKind.Legacy;
            return true;
        }

        layoutKind = ModuleLayoutKind.Legacy;
        layout = CardLayout.Empty;
        return false;
    }

    public void Dispose()
    {
        var subscription = _subscription;
        if (subscription is not null)
        {
            subscription.Dispose();
            _subscription = null;
        }

        _legacyCatalog.LayoutsChanged -= OnLegacyLayoutsChanged;
    }

    private void OnLegacyLayoutsChanged(object? sender, LayoutsChangedEventArgs e)
    {
        var sections = e.Sections;
        for (var i = 0; i < sections.Count; i++)
        {
            var section = sections[i];
            RaiseLayoutChanged(section.Tab, section.Section);
        }
    }

    private void OnModuleNotification(ModuleNotification notification)
    {
        if (string.Equals(notification.ModuleId, TransferModule.ModuleIdentifier, StringComparison.Ordinal))
        {
            if (!string.Equals(notification.EventType, TransferModuleEvents.StateUpdated, StringComparison.Ordinal))
            {
                return;
            }

            bool changed;
            bool shortlistChanged;
            lock (_sync)
            {
                changed = UpdateTransferCentreLayout();
                shortlistChanged = UpdateShortlistLayout();
            }

            if (changed)
            {
                RaiseLayoutChanged(TransfersTabId, TransferCentreSectionId);
            }

            if (shortlistChanged)
            {
                RaiseLayoutChanged(TransfersTabId, TransfersShortlistSectionId);
            }

            return;
        }

        if (!string.Equals(notification.ModuleId, ScoutingModule.ModuleIdentifier, StringComparison.Ordinal) ||
            !string.Equals(notification.EventType, ScoutingModuleEvents.StateUpdated, StringComparison.Ordinal))
        {
            return;
        }

        bool scoutingChanged;
        bool scoutingShortlistChanged;
        lock (_sync)
        {
            scoutingChanged = UpdateScoutingLayout();
            scoutingShortlistChanged = UpdateShortlistLayout();
        }

        if (scoutingChanged)
        {
            RaiseLayoutChanged(TransfersTabId, TransfersScoutingSectionId);
        }

        if (scoutingShortlistChanged)
        {
            RaiseLayoutChanged(TransfersTabId, TransfersShortlistSectionId);
        }
    }

    private bool UpdateTransferCentreLayout()
    {
        var changed = false;

        if (!_transferLayoutInitialized)
        {
            _transferCards[0] = CreateTransferTargetsCard();
            changed = true;
        }

        var transferBudgetCard = CreateBudgetMetricCard(
            "transfer-centre-budget",
            "Transfer Budget",
            _transferModule.TransferBudget,
            18,
            0,
            includeRemainingLabel: true);

        if (!transferBudgetCard.Equals(_transferCards[1]))
        {
            _transferCards[1] = transferBudgetCard;
            changed = true;
        }

        var wageBudgetCard = CreateBudgetMetricCard(
            "transfer-centre-wages",
            "Wage Budget",
            _transferModule.WageBudget,
            27,
            0,
            includeRemainingLabel: false);

        if (!wageBudgetCard.Equals(_transferCards[2]))
        {
            _transferCards[2] = wageBudgetCard;
            changed = true;
        }

        var topTargetsCard = CreateTopTargetSummaryCard();
        if (!topTargetsCard.Equals(_transferCards[3]))
        {
            _transferCards[3] = topTargetsCard;
            changed = true;
        }

        var loanWatchCard = CreateLoanWatchCard();
        if (!_transferLayoutInitialized || !loanWatchCard.Equals(_transferCards[4]))
        {
            _transferCards[4] = loanWatchCard;
            changed = true;
        }

        if (!_transferLayoutInitialized)
        {
            _transferLayoutInitialized = true;
        }

        return changed;
    }

    private bool UpdateScoutingLayout()
    {
        var changed = false;

        var assignmentCount = _scoutingModule.CopyAssignments(_assignmentBuffer);
        if (assignmentCount < 0)
        {
            assignmentCount = 0;
        }

        var reportCount = _scoutingModule.CopyReports(_reportBuffer);
        if (reportCount < 0)
        {
            reportCount = 0;
        }

        var assignmentBoard = BuildScoutAssignmentBoard(assignmentCount);
        var assignmentsCard = CreateScoutAssignmentsCard(assignmentBoard);
        if (!_scoutingLayoutInitialized || !assignmentsCard.Equals(_scoutingCards[0]))
        {
            _scoutingCards[0] = assignmentsCard;
            changed = true;
        }

        var focusCount = PopulateFocusRegions(assignmentCount, out var hasFocusSummary, out var focusRegion, out var focusAverage);
        _focusRegionList.SetCount(focusCount);
        var focusDescriptionChanged = UpdateFocusRegionsDescription(hasFocusSummary, focusRegion, focusAverage);
        if (!_scoutingLayoutInitialized)
        {
            _scoutingCards[1] = CreateFocusRegionsCard(_focusRegionsDescription);
            changed = true;
        }
        else if (focusDescriptionChanged)
        {
            _scoutingCards[1] = _scoutingCards[1] with { Description = _focusRegionsDescription };
            changed = true;
        }

        var knowledgeCount = PopulateKnowledgeBands(assignmentCount, out var hasKnowledgeSummary, out var knowledgeLabel, out var knowledgeCountValue);
        _knowledgeList.SetCount(knowledgeCount);
        var knowledgeDescriptionChanged = UpdateKnowledgeLevelsDescription(hasKnowledgeSummary, knowledgeLabel, knowledgeCountValue);
        if (!_scoutingLayoutInitialized)
        {
            _scoutingCards[2] = CreateKnowledgeLevelsCard(_knowledgeLevelsDescription);
            changed = true;
        }
        else if (knowledgeDescriptionChanged)
        {
            _scoutingCards[2] = _scoutingCards[2] with { Description = _knowledgeLevelsDescription };
            changed = true;
        }

        var recommendedCount = PopulateRecommendedPlayers(reportCount, out var hasRecommendation, out var recommendedPlayerId, out var recommendedPlayerName, out var recommendedRating);
        _recommendedPlayerList.SetCount(recommendedCount);
        var recommendedDescriptionChanged = UpdateRecommendedPlayersDescription(hasRecommendation, recommendedPlayerId, recommendedPlayerName, recommendedRating);
        if (!_scoutingLayoutInitialized)
        {
            _scoutingCards[3] = CreateRecommendedPlayersCard(_recommendedPlayersDescription);
            changed = true;
        }
        else if (recommendedDescriptionChanged)
        {
            _scoutingCards[3] = _scoutingCards[3] with { Description = _recommendedPlayersDescription };
            changed = true;
        }

        var shortTermCount = PopulateShortTermFocus(assignmentCount, out var hasShortTermSummary, out var shortTermFocus, out var shortTermRegion);
        _shortTermFocusList.SetCount(shortTermCount);
        var shortTermDescriptionChanged = UpdateShortTermFocusDescription(hasShortTermSummary, shortTermFocus, shortTermRegion);
        if (!_scoutingLayoutInitialized)
        {
            _scoutingCards[4] = CreateShortTermFocusCard(_shortTermFocusDescription);
            changed = true;
        }
        else if (shortTermDescriptionChanged)
        {
            _scoutingCards[4] = _scoutingCards[4] with { Description = _shortTermFocusDescription };
            changed = true;
        }

        if (!_scoutingLayoutInitialized)
        {
            _scoutingLayoutInitialized = true;
        }

        return changed;
    }

    private bool UpdateShortlistLayout()
    {
        var changed = false;

        var targetCount = _transferModule.CopyTargets(_targetBuffer);
        if (targetCount < 0)
        {
            targetCount = 0;
        }

        var reportCount = _scoutingModule.CopyReports(_reportBuffer);
        if (reportCount < 0)
        {
            reportCount = 0;
        }

        var boardDefinition = BuildShortlistBoard(targetCount, reportCount);
        var boardCard = CreateShortlistBoardCard(boardDefinition);
        if (!_shortlistLayoutInitialized || !_shortlistCards[0].Equals(boardCard))
        {
            _shortlistCards[0] = boardCard;
            changed = true;
        }

        var contractChanged = PopulateShortlistContractStatus(targetCount, reportCount, out var contractCount);
        _shortlistContractList.SetCount(contractCount);
        if (contractChanged)
        {
            changed = true;
        }

        var competitionChanged = PopulateShortlistCompetition(targetCount, reportCount, out var competitionCount);
        _shortlistCompetitionList.SetCount(competitionCount);
        if (competitionChanged)
        {
            changed = true;
        }

        var notesChanged = PopulateShortlistNotes(targetCount, reportCount, out var notesCount);
        _shortlistNotesList.SetCount(notesCount);
        if (notesChanged)
        {
            changed = true;
        }

        if (!_shortlistLayoutInitialized)
        {
            _shortlistLayoutInitialized = true;
            changed = true;
        }

        return changed;
    }

    private CardDefinition CreateTransferTargetsCard() => new(
        Id: "transfer-targets",
        Title: "Transfer Targets",
        Subtitle: "Priority signings",
        Kind: CardKind.ContentHost,
        Column: 0,
        Row: 0,
        ColumnSpan: DefaultCardWidth,
        RowSpan: 8,
        ContentType: CardType.TransferTargets);

    private CardDefinition CreateBudgetMetricCard(
        string id,
        string title,
        uint value,
        int column,
        int row,
        bool includeRemainingLabel)
    {
        var metricValue = FormatCurrency(value);
        var label = includeRemainingLabel ? "Remaining allocation" : "Weekly headroom";

        return new CardDefinition(
            Id: id,
            Title: title,
            Subtitle: null,
            Kind: CardKind.Metric,
            Column: column,
            Row: row,
            ColumnSpan: 9,
            RowSpan: MetricCardHeight,
            MetricValue: metricValue,
            MetricLabel: label);
    }

    private CardDefinition CreateTopTargetSummaryCard()
    {
        var count = PopulateTopTargetSummaries(TopTargetCapacity);
        _topTargetList.SetCount(count);

        return new CardDefinition(
            Id: "transfer-target-summary",
            Title: "Top Targets",
            Subtitle: "Scout intelligence",
            Kind: CardKind.List,
            Column: 0,
            Row: 8,
            ColumnSpan: DefaultCardWidth,
            RowSpan: 7,
            Description: "Snapshot of the highest priority recruitment targets",
            ListItems: _topTargetList);
    }

    private CardDefinition CreateLoanWatchCard()
    {
        var count = PopulateLoanWatchList(LoanWatchCapacity);
        _loanWatchList.SetCount(count);

        var description = count == 0 ? LoanWatchEmptyDescription : LoanWatchActiveDescription;

        return new CardDefinition(
            Id: "loan-watch",
            Title: "Negotiations",
            Subtitle: "Active deals",
            Kind: CardKind.List,
            Column: 0,
            Row: 15,
            ColumnSpan: DefaultCardWidth,
            RowSpan: 4,
            Description: description,
            ListItems: _loanWatchList);
    }

    private int PopulateLoanWatchList(int maxItems)
    {
        var total = _targetViewCount;
        if (total <= 0)
        {
            return 0;
        }

        var span = _targetBuffer.AsSpan();
        var count = 0;

        for (var i = 0; i < total && count < maxItems; i++)
        {
            ref readonly var target = ref span[i];
            if (target.IsAvailable)
            {
                continue;
            }

            var name = ResolvePlayerName(target.PlayerId);
            var fee = FormatCurrency(target.AskingPrice);
            var wage = FormatCurrency(target.WageDemand);
            var interestText = CreateInterestText(target.InterestLevel);
            var stage = DetermineNegotiationStage(target.InterestLevel);
            var tertiary = CombineAvailabilityAndInterest(stage, interestText);
            var accent = GetNegotiationAccent(target.InterestLevel);

            _loanWatchItems[count] = new CardListItem(
                Primary: name,
                Secondary: CombineFeeAndWage(fee, wage),
                Tertiary: tertiary,
                Accent: accent);

            count++;
        }

        return count;
    }

    private static string DetermineNegotiationStage(byte interestLevel)
    {
        if (interestLevel >= 85)
        {
            return NegotiationStageAwaiting;
        }

        if (interestLevel >= 70)
        {
            return NegotiationStageAgreement;
        }

        if (interestLevel >= 55)
        {
            return NegotiationStageDiscussion;
        }

        return NegotiationStageInitial;
    }

    private static string GetNegotiationAccent(byte interestLevel)
    {
        if (interestLevel >= 85)
        {
            return RecommendationPrimaryAccent;
        }

        if (interestLevel >= 70)
        {
            return RecommendationSecondaryAccent;
        }

        return PriorityMediumAccent;
    }

    private int PopulateTopTargetSummaries(int maxItems)
    {
        var span = _targetBuffer.AsSpan();
        var copied = _transferModule.CopyTargets(span);
        if (copied <= 0)
        {
            _targetViewCount = 0;
            return 0;
        }

        if (copied > span.Length)
        {
            copied = span.Length;
        }

        _targetViewCount = copied;

        var limit = copied > maxItems ? maxItems : copied;

        for (var i = 0; i < limit; i++)
        {
            ref readonly var target = ref span[i];
            var name = ResolvePlayerName(target.PlayerId);
            var fee = FormatCurrency(target.AskingPrice);
            var wage = FormatCurrency(target.WageDemand);
            var interest = CreateInterestText(target.InterestLevel);
            var availability = target.IsAvailable ? AvailableLabel : UnavailableLabel;
            var tertiary = CombineAvailabilityAndInterest(availability, interest);
            var secondary = CombineFeeAndWage(fee, wage);
            var accent = target.IsAvailable ? AvailableAccent : UnavailableAccent;

            _topTargetItems[i] = new CardListItem(
                Primary: name,
                Secondary: secondary,
                Tertiary: tertiary,
                Accent: accent);
        }

        return limit;
    }

    private string ResolvePlayerName(int playerId)
    {
        if (playerId <= 0)
        {
            return "Player";
        }

        var id = (uint)playerId;
        ref var player = ref _playerDatabase.GetPlayer(id);
        var name = _stringDatabase.GetCompactName(player.FirstNameId, player.LastNameId);

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            name = _stringDatabase.GetFullName(player.FirstNameId, player.LastNameId);
        }

        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            var digits = CountDigits(id);
            name = string.Create(7 + digits, id, static (span, value) =>
            {
                "Player ".AsSpan().CopyTo(span);
                value.TryFormat(span.Slice(7), out _, provider: CultureInfo.InvariantCulture);
            });
        }

        return name;
    }

    private static string CombineFeeAndWage(string fee, string wage)
    {
        var feeLength = fee.Length;
        var wageLength = wage.Length;

        return string.Create(4 + feeLength + 8 + wageLength, (fee, wage), static (span, state) =>
        {
            const string FeeLabel = "Fee ";
            const string Separator = " • Wage ";

            FeeLabel.AsSpan().CopyTo(span);
            var offset = FeeLabel.Length;
            state.fee.AsSpan().CopyTo(span.Slice(offset));
            offset += state.fee.Length;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            state.wage.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string CombineAvailabilityAndInterest(string availability, string interest)
    {
        return string.Create(availability.Length + 3 + interest.Length, (availability, interest), static (span, state) =>
        {
            const string Separator = " • ";
            state.availability.AsSpan().CopyTo(span);
            var offset = state.availability.Length;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            state.interest.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private CardDefinition CreateScoutAssignmentsCard(ScoutAssignmentBoardDefinition board) => new(
        Id: "scout-assignments-board",
        Title: "Assignments Board",
        Subtitle: "Current focus areas",
        Kind: CardKind.ScoutAssignments,
        Column: 0,
        Row: 0,
        ColumnSpan: 18,
        RowSpan: 7,
        ScoutAssignments: board);

    private CardDefinition CreateFocusRegionsCard(string description) => new(
        Id: "focus-regions",
        Title: "Focus Regions",
        Subtitle: "Knowledge coverage",
        Kind: CardKind.List,
        Column: 18,
        Row: 0,
        ColumnSpan: 19,
        RowSpan: 7,
        Description: description,
        ListItems: _focusRegionList);

    private CardDefinition CreateKnowledgeLevelsCard(string description) => new(
        Id: "knowledge-levels",
        Title: "Knowledge Levels",
        Subtitle: "Global insight",
        Kind: CardKind.List,
        Column: 0,
        Row: 7,
        ColumnSpan: 18,
        RowSpan: 6,
        Description: description,
        ListItems: _knowledgeList);

    private CardDefinition CreateRecommendedPlayersCard(string description) => new(
        Id: "recommended-players",
        Title: "Recommended Players",
        Subtitle: "Scouting priority",
        Kind: CardKind.List,
        Column: 18,
        Row: 7,
        ColumnSpan: 19,
        RowSpan: 6,
        Description: description,
        ListItems: _recommendedPlayerList);

    private CardDefinition CreateShortTermFocusCard(string description) => new(
        Id: "short-term-focus",
        Title: "Short-Term Focus",
        Subtitle: "Upcoming windows",
        Kind: CardKind.List,
        Column: 0,
        Row: 13,
        ColumnSpan: 37,
        RowSpan: 6,
        Description: description,
        ListItems: _shortTermFocusList);

    private CardDefinition CreateShortlistBoardCard(ShortlistBoardDefinition board) => new(
        Id: "shortlist-board",
        Title: "Shortlist Board",
        Subtitle: "Primary recruitment targets",
        Kind: CardKind.ShortlistBoard,
        Column: 0,
        Row: 0,
        ColumnSpan: DefaultCardWidth,
        RowSpan: 7,
        ShortlistBoard: board);

    private CardDefinition CreateShortlistContractStatusCard() => new(
        Id: "contract-status",
        Title: "Contract Status",
        Subtitle: "Expiry watch",
        Kind: CardKind.List,
        Column: DefaultCardWidth,
        Row: 0,
        ColumnSpan: 19,
        RowSpan: 7,
        Description: "Track contract expiries and wage demands for leading targets.",
        ListItems: _shortlistContractList);

    private CardDefinition CreateShortlistCompetitionCard() => new(
        Id: "competition",
        Title: "Competition",
        Subtitle: "Clubs interested",
        Kind: CardKind.List,
        Column: 0,
        Row: 7,
        ColumnSpan: DefaultCardWidth,
        RowSpan: 6,
        Description: "Gauge market interest in each priority target.",
        ListItems: _shortlistCompetitionList);

    private CardDefinition CreateShortlistNotesCard() => new(
        Id: "notes",
        Title: "Notes",
        Subtitle: "Scouting insights",
        Kind: CardKind.List,
        Column: DefaultCardWidth,
        Row: 7,
        ColumnSpan: 19,
        RowSpan: 6,
        Description: "Latest scouting observations and recommended next steps.",
        ListItems: _shortlistNotesList);

    private ShortlistBoardDefinition CreateDefaultShortlistBoard()
    {
        _shortlistBoardCount = 0;
        SeedDefaultShortlistStatuses();
        SeedDefaultShortlistActions();
        return new ShortlistBoardDefinition(
            new ArrayReadOnlyList<ShortlistPlayerDefinition>(_shortlistPlayers, 0),
            new ArrayReadOnlyList<string>(_shortlistStatusOptions, _shortlistStatusCount),
            new ArrayReadOnlyList<string>(_shortlistActionOptions, _shortlistActionCount));
    }

    private ShortlistBoardDefinition BuildShortlistBoard(int targetCount, int reportCount)
    {
        var clamped = ClampCount(targetCount, ShortlistBoardCapacity);
        var previousBoardCount = _shortlistBoardCount;
        var previousStatusCount = _shortlistStatusCount;
        var previousActionCount = _shortlistActionCount;
        var statusCount = 0;
        var actionCount = 0;

        if (clamped == 0)
        {
            ClearShortlistPlayers(previousBoardCount, 0);
            SeedDefaultShortlistStatuses();
            SeedDefaultShortlistActions();
            return new ShortlistBoardDefinition(
                new ArrayReadOnlyList<ShortlistPlayerDefinition>(_shortlistPlayers, 0),
                new ArrayReadOnlyList<string>(_shortlistStatusOptions, _shortlistStatusCount),
                new ArrayReadOnlyList<string>(_shortlistActionOptions, _shortlistActionCount));
        }

        for (var i = 0; i < clamped; i++)
        {
            ref readonly var target = ref _targetBuffer[i];
            uint playerId = target.PlayerId > 0 ? (uint)target.PlayerId : 0u;
            var name = ResolvePlayerName(target.PlayerId);
            var positionLabel = "–";

            if (playerId != 0)
            {
                ref var player = ref _playerDatabase.GetPlayer(playerId);
                positionLabel = FormatPlayerPosition((PlayerPosition)player.Position);
            }

            var reportIndex = FindReportIndex(reportCount, target.PlayerId);
            var hasReport = reportIndex >= 0;
            var statusLabel = DetermineAvailabilityStatus(target.IsAvailable);
            var priorityLabel = DetermineShortlistPriority(target.ScoutRating, hasReport && _reportBuffer[reportIndex].IsPriorityTarget);
            var actionLabel = DetermineShortlistAction(target.IsAvailable, target.InterestLevel, priorityLabel);
            string note;

            if (hasReport)
            {
                ref readonly var report = ref _reportBuffer[reportIndex];
                if (!string.IsNullOrWhiteSpace(report.PositionCode))
                {
                    positionLabel = report.PositionCode;
                }

                if (!string.IsNullOrWhiteSpace(report.StatusLabel))
                {
                    statusLabel = report.StatusLabel;
                }

                note = CreateShortlistNote(target.ScoutRating, target.InterestLevel, true, report);
            }
            else
            {
                note = CreateShortlistNote(target.ScoutRating, target.InterestLevel, false, default);
            }

            var identifier = FormatPlayerIdentifier(playerId);
            _shortlistPlayers[i] = new ShortlistPlayerDefinition(
                identifier,
                name,
                positionLabel,
                statusLabel,
                actionLabel,
                priorityLabel,
                note);

            statusCount = AddUniqueString(_shortlistStatusOptions, statusCount, statusLabel);
            actionCount = AddUniqueString(_shortlistActionOptions, actionCount, actionLabel);
        }

        ClearShortlistPlayers(previousBoardCount, clamped);

        if (statusCount == 0)
        {
            SeedDefaultShortlistStatuses();
        }
        else
        {
            ClearShortlistOptionRange(_shortlistStatusOptions, statusCount, previousStatusCount);
            _shortlistStatusCount = statusCount;
        }

        if (actionCount == 0)
        {
            SeedDefaultShortlistActions();
        }
        else
        {
            ClearShortlistOptionRange(_shortlistActionOptions, actionCount, previousActionCount);
            _shortlistActionCount = actionCount;
        }

        _shortlistBoardCount = clamped;

        return new ShortlistBoardDefinition(
            new ArrayReadOnlyList<ShortlistPlayerDefinition>(_shortlistPlayers, clamped),
            new ArrayReadOnlyList<string>(_shortlistStatusOptions, _shortlistStatusCount),
            new ArrayReadOnlyList<string>(_shortlistActionOptions, _shortlistActionCount));
    }

    private ScoutAssignmentBoardDefinition BuildScoutAssignmentBoard(int assignmentCount)
    {
        var clamped = ClampCount(assignmentCount, AssignmentCapacity);

        var stageCount = 0;
        var priorityCount = 0;
        var scoutOptionCount = 0;

        if (clamped == 0)
        {
            stageCount = SeedDefaultStages();
            priorityCount = SeedDefaultPriorities();

            return new ScoutAssignmentBoardDefinition(
                new ArrayReadOnlyList<ScoutAssignmentDefinition>(_assignmentDefinitions, 0),
                new ArrayReadOnlyList<string>(_stageOptions, stageCount),
                new ArrayReadOnlyList<string>(_priorityOptions, priorityCount),
                new ArrayReadOnlyList<ScoutOptionDefinition>(_scoutOptionDefinitions, 0));
        }

        for (var i = 0; i < clamped; i++)
        {
            var view = _assignmentBuffer[i];
            var focus = string.IsNullOrWhiteSpace(view.FocusArea) ? "General scouting" : view.FocusArea;
            var region = string.IsNullOrWhiteSpace(view.Region) ? "Global" : view.Region;
            var priority = FormatPriorityLabel(view.PriorityLevel);
            var stage = DetermineStage(view.ProgressPercent);
            var scoutName = ResolveScoutName(view.ScoutFirstNameId, view.ScoutLastNameId);

            _assignmentDefinitions[i] = new ScoutAssignmentDefinition(
                FormatAssignmentId(view.AssignmentId),
                focus,
                ResolveAssignmentRole(view.PriorityLevel),
                region,
                priority,
                stage,
                FormatDeadline(view.ProgressPercent),
                scoutName,
                FormatAssignmentNotes(focus, region));

            stageCount = AddUniqueString(_stageOptions, stageCount, stage);
            priorityCount = AddUniqueString(_priorityOptions, priorityCount, priority);

            var scoutId = FormatScoutOptionId(view.ScoutFirstNameId, view.ScoutLastNameId);
            if (FindScoutOptionIndex(scoutOptionCount, scoutId) < 0 && scoutOptionCount < _scoutOptionDefinitions.Length)
            {
                _scoutOptionDefinitions[scoutOptionCount] = new ScoutOptionDefinition(
                    scoutId,
                    scoutName,
                    region,
                    DetermineScoutAvailability(view.ProgressPercent));
                scoutOptionCount++;
            }
        }

        if (stageCount == 0)
        {
            stageCount = SeedDefaultStages();
        }

        if (priorityCount == 0)
        {
            priorityCount = SeedDefaultPriorities();
        }

        return new ScoutAssignmentBoardDefinition(
            new ArrayReadOnlyList<ScoutAssignmentDefinition>(_assignmentDefinitions, clamped),
            new ArrayReadOnlyList<string>(_stageOptions, stageCount),
            new ArrayReadOnlyList<string>(_priorityOptions, priorityCount),
            new ArrayReadOnlyList<ScoutOptionDefinition>(_scoutOptionDefinitions, scoutOptionCount));
    }

    private int PopulateFocusRegions(int assignmentCount, out bool hasSummary, out string topRegion, out int averageProgress)
    {
        var clamped = ClampCount(assignmentCount, AssignmentCapacity);

        for (var i = 0; i < _regionSummaries.Length; i++)
        {
            _regionSummaries[i].Reset();
        }

        var summaryCount = 0;
        for (var i = 0; i < clamped; i++)
        {
            var view = _assignmentBuffer[i];
            var region = string.IsNullOrWhiteSpace(view.Region) ? "Global" : view.Region;

            var index = -1;
            for (var j = 0; j < summaryCount; j++)
            {
                if (string.Equals(_regionSummaries[j].Region, region, StringComparison.Ordinal))
                {
                    index = j;
                    break;
                }
            }

            if (index < 0)
            {
                if (summaryCount >= _regionSummaries.Length)
                {
                    continue;
                }

                index = summaryCount++;
                _regionSummaries[index].Region = region;
                _regionSummaries[index].AssignmentCount = 0;
                _regionSummaries[index].ProgressTotal = 0;
            }

            _regionSummaries[index].AssignmentCount++;
            _regionSummaries[index].ProgressTotal += view.ProgressPercent;
        }

        if (summaryCount == 0)
        {
            hasSummary = false;
            topRegion = string.Empty;
            averageProgress = 0;
            for (var i = 0; i < FocusRegionCapacity; i++)
            {
                _focusRegionItems[i] = default!;
            }

            return 0;
        }

        SortRegionSummaries(summaryCount);

        var limit = summaryCount > FocusRegionCapacity ? FocusRegionCapacity : summaryCount;
        for (var i = 0; i < limit; i++)
        {
            ref readonly var summary = ref _regionSummaries[i];
            var secondary = FormatAssignmentCount(summary.AssignmentCount);
            var average = summary.AssignmentCount > 0
                ? (summary.ProgressTotal + (summary.AssignmentCount / 2)) / summary.AssignmentCount
                : 0;
            var tertiary = FormatAverageProgressText(average);
            var accent = i == 0 ? FocusHighlightAccent : null;
            _focusRegionItems[i] = new CardListItem(summary.Region, secondary, tertiary, accent);
        }

        for (var i = limit; i < FocusRegionCapacity; i++)
        {
            _focusRegionItems[i] = default!;
        }

        ref readonly var top = ref _regionSummaries[0];
        var topAverage = top.AssignmentCount > 0
            ? (top.ProgressTotal + (top.AssignmentCount / 2)) / top.AssignmentCount
            : 0;
        hasSummary = true;
        topRegion = top.Region;
        averageProgress = topAverage;

        return limit;
    }

    private int PopulateKnowledgeBands(int assignmentCount, out bool hasSummary, out string dominantLabel, out int dominantCount)
    {
        ResetKnowledgeSummaries();

        var clamped = ClampCount(assignmentCount, AssignmentCapacity);
        for (var i = 0; i < clamped; i++)
        {
            var index = ResolveKnowledgeBandIndex(_assignmentBuffer[i].ProgressPercent);
            if ((uint)index < (uint)_knowledgeSummaries.Length)
            {
                _knowledgeSummaries[index].Count++;
                _knowledgeSummaries[index].ProgressTotal += _assignmentBuffer[i].ProgressPercent;
            }
        }

        var itemCount = 0;
        var dominantIndex = -1;
        for (var i = 0; i < _knowledgeSummaries.Length; i++)
        {
            ref readonly var band = ref _knowledgeSummaries[i];
            if (band.Count == 0)
            {
                continue;
            }

            var average = (band.ProgressTotal + (band.Count / 2)) / band.Count;
            var secondary = FormatAssignmentCount(band.Count);
            var tertiary = FormatAverageProgressText(average);
            _knowledgeItems[itemCount] = new CardListItem(band.Label, secondary, tertiary, band.Accent);
            if (dominantIndex < 0 || band.Count > _knowledgeSummaries[dominantIndex].Count)
            {
                dominantIndex = i;
            }

            itemCount++;
        }

        for (var i = itemCount; i < KnowledgeBandCount; i++)
        {
            _knowledgeItems[i] = default!;
        }

        if (itemCount == 0)
        {
            hasSummary = false;
            dominantLabel = string.Empty;
            dominantCount = 0;
            return 0;
        }

        var dominantBand = _knowledgeSummaries[dominantIndex];
        hasSummary = true;
        dominantLabel = dominantBand.Label;
        dominantCount = dominantBand.Count;
        return itemCount;
    }

    private int PopulateRecommendedPlayers(int reportCount, out bool hasSummary, out uint topPlayerId, out string topPlayerName, out byte topOverall)
    {
        var clamped = ClampCount(reportCount, ReportCapacity);
        if (clamped == 0)
        {
            hasSummary = false;
            topPlayerId = 0;
            topPlayerName = string.Empty;
            topOverall = 0;
            for (var i = 0; i < RecommendedPlayerCapacity; i++)
            {
                _recommendedPlayerItems[i] = default!;
            }

            return 0;
        }

        var span = _reportBuffer.AsSpan(0, clamped);
        SortPlayerRecommendations(span);

        var limit = clamped > RecommendedPlayerCapacity ? RecommendedPlayerCapacity : clamped;
        var firstPlayerId = 0u;
        string firstPlayerName = string.Empty;
        byte firstOverall = 0;
        for (var i = 0; i < limit; i++)
        {
            ref readonly var report = ref span[i];
            var name = ResolvePlayerName(report.PlayerId);
            var secondary = FormatRatingPair(report.OverallRating, report.PotentialRating);
            var tertiary = FormatPlayerStatus(report.PositionCode, report.StatusLabel);
            var accent = report.IsPriorityTarget ? RecommendationPrimaryAccent : RecommendationSecondaryAccent;
            _recommendedPlayerItems[i] = new CardListItem(name, secondary, tertiary, accent);
            if (i == 0)
            {
                firstPlayerId = report.PlayerId;
                firstPlayerName = name;
                firstOverall = report.OverallRating;
            }
        }

        for (var i = limit; i < RecommendedPlayerCapacity; i++)
        {
            _recommendedPlayerItems[i] = default!;
        }

        hasSummary = true;
        topPlayerId = firstPlayerId;
        topPlayerName = firstPlayerName;
        topOverall = firstOverall;
        return limit;
    }

    private int PopulateShortTermFocus(int assignmentCount, out bool hasSummary, out string focus, out string region)
    {
        var clamped = ClampCount(assignmentCount, AssignmentCapacity);
        if (clamped == 0)
        {
            hasSummary = false;
            focus = string.Empty;
            region = string.Empty;
            for (var i = 0; i < ShortTermFocusCapacity; i++)
            {
                _shortTermFocusItems[i] = default!;
            }

            return 0;
        }

        for (var i = 0; i < clamped; i++)
        {
            var view = _assignmentBuffer[i];
            _focusAssignments[i].Focus = string.IsNullOrWhiteSpace(view.FocusArea) ? "General scouting" : view.FocusArea;
            _focusAssignments[i].Region = string.IsNullOrWhiteSpace(view.Region) ? "Global" : view.Region;
            _focusAssignments[i].Priority = FormatPriorityLabel(view.PriorityLevel);
            _focusAssignments[i].PriorityLevel = view.PriorityLevel;
            _focusAssignments[i].Progress = view.ProgressPercent;
            _focusAssignments[i].Scout = ResolveScoutName(view.ScoutFirstNameId, view.ScoutLastNameId);
        }

        SortFocusAssignments(clamped);

        var limit = clamped > ShortTermFocusCapacity ? ShortTermFocusCapacity : clamped;
        for (var i = 0; i < limit; i++)
        {
            ref readonly var entry = ref _focusAssignments[i];
            var secondary = FormatRegionAndScout(entry.Region, entry.Scout);
            var tertiary = FormatPriorityAndProgress(entry.Priority, entry.Progress);
            var accent = entry.PriorityLevel <= 1
                ? PriorityHighAccent
                : entry.PriorityLevel == 2
                    ? PriorityMediumAccent
                    : PriorityLowAccent;
            _shortTermFocusItems[i] = new CardListItem(entry.Focus, secondary, tertiary, accent);
        }

        for (var i = limit; i < ShortTermFocusCapacity; i++)
        {
            _shortTermFocusItems[i] = default!;
        }

        hasSummary = true;
        focus = _focusAssignments[0].Focus;
        region = _focusAssignments[0].Region;
        return limit;
    }

    private bool PopulateShortlistContractStatus(int targetCount, int reportCount, out int count)
    {
        var previousCount = _shortlistContractList.Count;
        var limit = ClampCount(targetCount, ShortlistListCapacity);
        var changed = limit != previousCount;

        for (var i = 0; i < limit; i++)
        {
            ref readonly var target = ref _targetBuffer[i];
            var name = ResolvePlayerName(target.PlayerId);
            ushort expiryYear = 0;

            if (target.PlayerId > 0)
            {
                ref var player = ref _playerDatabase.GetPlayer((uint)target.PlayerId);
                expiryYear = player.ContractExpiryYear;
            }

            var expiry = FormatContractExpiry(expiryYear);
            var wage = FormatWeeklyWage(target.WageDemand);
            var secondary = CombineContractSummary(expiry, wage);
            var reportIndex = FindReportIndex(reportCount, target.PlayerId);
            var statusLabel = reportIndex >= 0 && !string.IsNullOrWhiteSpace(_reportBuffer[reportIndex].StatusLabel)
                ? _reportBuffer[reportIndex].StatusLabel
                : DetermineAvailabilityStatus(target.IsAvailable);
            var tertiary = CombineSegments(CreateInterestText(target.InterestLevel), statusLabel);
            var accent = target.IsAvailable ? AvailableAccent : UnavailableAccent;

            var item = new CardListItem(name, secondary, tertiary, accent);
            var previousItem = _shortlistContractItems[i];
            if (previousItem is null || !previousItem.Equals(item))
            {
                changed = true;
            }

            _shortlistContractItems[i] = item;
        }

        for (var i = limit; i < previousCount; i++)
        {
            if (_shortlistContractItems[i] is not null)
            {
                _shortlistContractItems[i] = default!;
                changed = true;
            }
        }

        count = limit;
        return changed;
    }

    private bool PopulateShortlistCompetition(int targetCount, int reportCount, out int count)
    {
        var previousCount = _shortlistCompetitionList.Count;
        var limit = ClampCount(targetCount, ShortlistListCapacity);
        var changed = limit != previousCount;

        for (var i = 0; i < limit; i++)
        {
            ref readonly var target = ref _targetBuffer[i];
            var name = ResolvePlayerName(target.PlayerId);
            var interestCategory = DetermineInterestCategory(target.InterestLevel);
            var availability = DetermineAvailabilityStatus(target.IsAvailable);
            var secondary = CombineSegments(interestCategory, availability);
            var reportIndex = FindReportIndex(reportCount, target.PlayerId);
            string tertiary;

            if (reportIndex >= 0)
            {
                ref readonly var report = ref _reportBuffer[reportIndex];
                tertiary = CombineSegments(DeterminePriorityDescriptor(report.IsPriorityTarget), report.StatusLabel);
            }
            else
            {
                tertiary = FormatRatingLabel("OVR", target.ScoutRating);
            }

            var accent = SelectCompetitionAccent(target.InterestLevel, target.IsAvailable);
            var item = new CardListItem(name, secondary, tertiary, accent);
            var previousItem = _shortlistCompetitionItems[i];
            if (previousItem is null || !previousItem.Equals(item))
            {
                changed = true;
            }

            _shortlistCompetitionItems[i] = item;
        }

        for (var i = limit; i < previousCount; i++)
        {
            if (_shortlistCompetitionItems[i] is not null)
            {
                _shortlistCompetitionItems[i] = default!;
                changed = true;
            }
        }

        count = limit;
        return changed;
    }

    private bool PopulateShortlistNotes(int targetCount, int reportCount, out int count)
    {
        var previousCount = _shortlistNotesList.Count;
        var clamped = ClampCount(reportCount, ShortlistListCapacity);
        var changed = clamped != previousCount;

        if (clamped == 0)
        {
            for (var i = 0; i < previousCount; i++)
            {
                if (_shortlistNotesItems[i] is not null)
                {
                    _shortlistNotesItems[i] = default!;
                    changed = true;
                }
            }

            count = 0;
            return changed;
        }

        var span = _reportBuffer.AsSpan(0, clamped);
        SortPlayerRecommendations(span);

        for (var i = 0; i < clamped; i++)
        {
            ref readonly var report = ref span[i];
            var name = ResolvePlayerName(report.PlayerId);
            var secondary = FormatRatingPair(report.OverallRating, report.PotentialRating);
            var targetIndex = FindTargetIndex(targetCount, report.PlayerId);
            string interestSegment = string.Empty;
            if (targetIndex >= 0)
            {
                interestSegment = CreateInterestText(_targetBuffer[targetIndex].InterestLevel);
            }

            var tertiary = CombineSegments(report.StatusLabel, DeterminePriorityDescriptor(report.IsPriorityTarget), interestSegment);
            var accent = report.IsPriorityTarget ? RecommendationPrimaryAccent : RecommendationSecondaryAccent;

            var item = new CardListItem(name, secondary, tertiary, accent);
            var previousItem = _shortlistNotesItems[i];
            if (previousItem is null || !previousItem.Equals(item))
            {
                changed = true;
            }

            _shortlistNotesItems[i] = item;
        }

        for (var i = clamped; i < previousCount; i++)
        {
            if (_shortlistNotesItems[i] is not null)
            {
                _shortlistNotesItems[i] = default!;
                changed = true;
            }
        }

        count = clamped;
        return changed;
    }

    private int FindReportIndex(int reportCount, int playerId)
    {
        if (playerId <= 0 || reportCount <= 0)
        {
            return -1;
        }

        var clamped = ClampCount(reportCount, ReportCapacity);
        for (var i = 0; i < clamped; i++)
        {
            if (_reportBuffer[i].PlayerId == playerId)
            {
                return i;
            }
        }

        return -1;
    }

    private int FindTargetIndex(int targetCount, int playerId)
    {
        if (playerId <= 0 || targetCount <= 0)
        {
            return -1;
        }

        var clamped = ClampCount(targetCount, _targetBuffer.Length);
        for (var i = 0; i < clamped; i++)
        {
            if (_targetBuffer[i].PlayerId == playerId)
            {
                return i;
            }
        }

        return -1;
    }

    private void ClearShortlistPlayers(int previousCount, int currentCount)
    {
        for (var i = currentCount; i < previousCount; i++)
        {
            _shortlistPlayers[i] = default!;
        }
    }

    private void ClearShortlistOptionRange(string[] storage, int newCount, int previousCount)
    {
        for (var i = newCount; i < previousCount && i < storage.Length; i++)
        {
            storage[i] = string.Empty;
        }
    }

    private void SeedDefaultShortlistStatuses()
    {
        var previous = _shortlistStatusCount;
        _shortlistStatusOptions[0] = AvailableLabel;
        _shortlistStatusOptions[1] = "Negotiating";
        _shortlistStatusOptions[2] = "Monitoring";
        _shortlistStatusOptions[3] = UnavailableLabel;
        _shortlistStatusCount = 4;
        ClearShortlistOptionRange(_shortlistStatusOptions, _shortlistStatusCount, previous);
    }

    private void SeedDefaultShortlistActions()
    {
        var previous = _shortlistActionCount;
        _shortlistActionOptions[0] = "Approach to sign";
        _shortlistActionOptions[1] = "Open negotiations";
        _shortlistActionOptions[2] = "Prepare bid";
        _shortlistActionOptions[3] = "Scout further";
        _shortlistActionOptions[4] = "Monitor progress";
        _shortlistActionCount = 5;
        ClearShortlistOptionRange(_shortlistActionOptions, _shortlistActionCount, previous);
    }

    private static string DetermineAvailabilityStatus(bool isAvailable) => isAvailable ? AvailableLabel : UnavailableLabel;

    private static string DetermineShortlistPriority(byte scoutRating, bool isPriorityTarget)
    {
        if (isPriorityTarget || scoutRating >= 85)
        {
            return "High";
        }

        if (scoutRating >= 75)
        {
            return "Medium";
        }

        return "Low";
    }

    private static string DetermineShortlistAction(bool isAvailable, byte interestLevel, string priority)
    {
        if (isAvailable && interestLevel >= 70)
        {
            return "Approach to sign";
        }

        if (isAvailable)
        {
            return "Open negotiations";
        }

        if (priority.Length > 0 && priority[0] == 'H')
        {
            return "Prepare bid";
        }

        if (interestLevel >= 65)
        {
            return "Scout further";
        }

        return "Monitor progress";
    }

    private string CreateShortlistNote(byte scoutRating, byte interestLevel, bool hasReport, ScoutingModule.ScoutReportView report)
    {
        var ratingSegment = FormatRatingLabel("OVR", scoutRating);
        var interestSegment = CreateInterestText(interestLevel);

        if (!hasReport)
        {
            return CombineSegments(ratingSegment, interestSegment);
        }

        var potentialSegment = FormatRatingLabel("POT", report.PotentialRating);
        var statusSegment = string.IsNullOrWhiteSpace(report.StatusLabel) ? string.Empty : report.StatusLabel;
        return CombineSegments(statusSegment, ratingSegment, potentialSegment, interestSegment);
    }

    private static string FormatRatingLabel(string prefix, byte value)
    {
        var digits = CountDigits(value);
        return string.Create(prefix.Length + 1 + digits, (prefix, value), static (span, state) =>
        {
            state.prefix.AsSpan().CopyTo(span);
            var offset = state.prefix.Length;
            span[offset] = ' ';
            state.value.TryFormat(span.Slice(offset + 1), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string CombineSegments(string first, string second)
    {
        return CombineSegments(first, second, string.Empty, string.Empty);
    }

    private static string CombineSegments(string first, string second, string third)
    {
        return CombineSegments(first, second, third, string.Empty);
    }

    private static string CombineSegments(string first, string second, string third, string fourth)
    {
        var count = 0;
        var total = 0;

        if (!string.IsNullOrWhiteSpace(first))
        {
            count++;
            total += first.Length;
        }

        if (!string.IsNullOrWhiteSpace(second))
        {
            count++;
            total += second.Length;
        }

        if (!string.IsNullOrWhiteSpace(third))
        {
            count++;
            total += third.Length;
        }

        if (!string.IsNullOrWhiteSpace(fourth))
        {
            count++;
            total += fourth.Length;
        }

        if (count == 0)
        {
            return string.Empty;
        }

        total += (count - 1) * 3;
        return string.Create(total, (first, second, third, fourth), static (span, state) =>
        {
            var offset = 0;
            AppendSegment(ref offset, span, state.first);
            AppendSegment(ref offset, span, state.second);
            AppendSegment(ref offset, span, state.third);
            AppendSegment(ref offset, span, state.fourth);
        });
    }

    private static void AppendSegment(ref int offset, Span<char> destination, string segment)
    {
        if (string.IsNullOrWhiteSpace(segment))
        {
            return;
        }

        if (offset > 0)
        {
            const string Separator = " • ";
            Separator.AsSpan().CopyTo(destination.Slice(offset));
            offset += Separator.Length;
        }

        segment.AsSpan().CopyTo(destination.Slice(offset));
        offset += segment.Length;
    }

    private static string FormatPlayerIdentifier(uint playerId)
    {
        if (playerId == 0u)
        {
            return "Unassigned";
        }

        var digits = CountDigits(playerId);
        return string.Create(digits + 1, playerId, static (span, value) =>
        {
            span[0] = '#';
            value.TryFormat(span.Slice(1), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string FormatPlayerPosition(PlayerPosition position)
    {
        return position switch
        {
            PlayerPosition.GK => "GK",
            PlayerPosition.CB => "CB",
            PlayerPosition.LB => "LB",
            PlayerPosition.RB => "RB",
            PlayerPosition.DM => "DM",
            PlayerPosition.CM => "CM",
            PlayerPosition.AM => "AM",
            PlayerPosition.LW => "LW",
            PlayerPosition.RW => "RW",
            PlayerPosition.ST => "ST",
            _ => "–"
        };
    }

    private static string FormatContractExpiry(ushort year)
    {
        if (year == 0)
        {
            return "Expiry unknown";
        }

        var digits = CountDigits(year);
        const string Prefix = "Expires ";
        return string.Create(Prefix.Length + digits, year, static (span, value) =>
        {
            Prefix.AsSpan().CopyTo(span);
            value.TryFormat(span.Slice(Prefix.Length), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string FormatWeeklyWage(uint wage)
    {
        var baseValue = FormatCurrency(wage);
        return string.Create(baseValue.Length + 3, baseValue, static (span, value) =>
        {
            value.AsSpan().CopyTo(span);
            var offset = value.Length;
            span[offset] = '/';
            span[offset + 1] = 'w';
            span[offset + 2] = 'k';
        });
    }

    private static string CombineContractSummary(string expiry, string wage)
    {
        const string Separator = " • ";
        const string WageLabel = "Wage ";
        return string.Create(expiry.Length + Separator.Length + WageLabel.Length + wage.Length, (expiry, wage), static (span, state) =>
        {
            state.expiry.AsSpan().CopyTo(span);
            var offset = state.expiry.Length;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            WageLabel.AsSpan().CopyTo(span.Slice(offset));
            offset += WageLabel.Length;
            state.wage.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string DetermineInterestCategory(byte interestLevel)
    {
        if (interestLevel >= 80)
        {
            return "High interest";
        }

        if (interestLevel >= 60)
        {
            return "Moderate interest";
        }

        if (interestLevel >= 40)
        {
            return "Cautious interest";
        }

        return "Low interest";
    }

    private static string SelectCompetitionAccent(byte interestLevel, bool isAvailable)
    {
        if (isAvailable && interestLevel >= 70)
        {
            return RecommendationPrimaryAccent;
        }

        if (interestLevel >= 60)
        {
            return RecommendationSecondaryAccent;
        }

        return isAvailable ? AvailableAccent : PriorityLowAccent;
    }

    private static string DeterminePriorityDescriptor(bool isPriorityTarget)
    {
        return isPriorityTarget ? "Priority target" : "Development target";
    }

    private bool UpdateFocusRegionsDescription(bool hasSummary, string topRegion, int averageProgress)
    {
        const string NoAssignmentsDescription = "No active assignments yet.";

        if (!hasSummary)
        {
            var changed = _focusHasSummary || !string.Equals(_focusRegionsDescription, NoAssignmentsDescription, StringComparison.Ordinal);
            _focusHasSummary = false;
            _focusTopRegion = null;
            _focusTopAverage = 0;
            _focusRegionsDescription = NoAssignmentsDescription;
            return changed;
        }

        if (_focusHasSummary &&
            string.Equals(_focusTopRegion, topRegion, StringComparison.Ordinal) &&
            _focusTopAverage == averageProgress)
        {
            return false;
        }

        _focusHasSummary = true;
        _focusTopRegion = topRegion;
        _focusTopAverage = averageProgress;
        _focusRegionsDescription = FormatFocusDescription(topRegion, averageProgress);
        return true;
    }

    private bool UpdateKnowledgeLevelsDescription(bool hasSummary, string dominantLabel, int dominantCount)
    {
        const string PendingDescription = "Assignments will populate knowledge once scouts report.";

        if (!hasSummary)
        {
            var changed = _knowledgeHasSummary || !string.Equals(_knowledgeLevelsDescription, PendingDescription, StringComparison.Ordinal);
            _knowledgeHasSummary = false;
            _knowledgeDominantLabel = null;
            _knowledgeDominantCount = 0;
            _knowledgeLevelsDescription = PendingDescription;
            return changed;
        }

        if (_knowledgeHasSummary &&
            string.Equals(_knowledgeDominantLabel, dominantLabel, StringComparison.Ordinal) &&
            _knowledgeDominantCount == dominantCount)
        {
            return false;
        }

        _knowledgeHasSummary = true;
        _knowledgeDominantLabel = dominantLabel;
        _knowledgeDominantCount = dominantCount;
        _knowledgeLevelsDescription = FormatKnowledgeDescription(dominantLabel, dominantCount);
        return true;
    }

    private bool UpdateRecommendedPlayersDescription(bool hasSummary, uint topPlayerId, string topPlayerName, byte topOverall)
    {
        const string PendingDescription = "Scouting reports will appear as scouts complete assignments.";

        if (!hasSummary)
        {
            var changed = _recommendedHasSummary || !string.Equals(_recommendedPlayersDescription, PendingDescription, StringComparison.Ordinal);
            _recommendedHasSummary = false;
            _recommendedTopPlayerId = 0;
            _recommendedTopPlayerName = null;
            _recommendedTopRating = 0;
            _recommendedPlayersDescription = PendingDescription;
            return changed;
        }

        if (_recommendedHasSummary &&
            _recommendedTopPlayerId == topPlayerId &&
            string.Equals(_recommendedTopPlayerName, topPlayerName, StringComparison.Ordinal) &&
            _recommendedTopRating == topOverall)
        {
            return false;
        }

        _recommendedHasSummary = true;
        _recommendedTopPlayerId = topPlayerId;
        _recommendedTopPlayerName = topPlayerName;
        _recommendedTopRating = topOverall;
        _recommendedPlayersDescription = FormatRecommendedDescription(topPlayerName, topOverall);
        return true;
    }

    private bool UpdateShortTermFocusDescription(bool hasSummary, string focus, string region)
    {
        const string PendingDescription = "No priority assignments scheduled.";

        if (!hasSummary)
        {
            var changed = _shortTermHasSummary || !string.Equals(_shortTermFocusDescription, PendingDescription, StringComparison.Ordinal);
            _shortTermHasSummary = false;
            _shortTermTopFocus = null;
            _shortTermTopRegion = null;
            _shortTermFocusDescription = PendingDescription;
            return changed;
        }

        if (_shortTermHasSummary &&
            string.Equals(_shortTermTopFocus, focus, StringComparison.Ordinal) &&
            string.Equals(_shortTermTopRegion, region, StringComparison.Ordinal))
        {
            return false;
        }

        _shortTermHasSummary = true;
        _shortTermTopFocus = focus;
        _shortTermTopRegion = region;
        _shortTermFocusDescription = FormatShortTermDescription(focus, region);
        return true;
    }

    private static int ClampCount(int value, int maximum)
    {
        if (value <= 0)
        {
            return 0;
        }

        return value > maximum ? maximum : value;
    }

    private int AddUniqueString(string[] storage, int count, string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return count;
        }

        for (var i = 0; i < count; i++)
        {
            if (string.Equals(storage[i], value, StringComparison.Ordinal))
            {
                return count;
            }
        }

        if (count >= storage.Length)
        {
            return count;
        }

        storage[count] = value;
        return count + 1;
    }

    private int SeedDefaultStages()
    {
        _stageOptions[0] = "Initial Report";
        _stageOptions[1] = "Detailed Analysis";
        _stageOptions[2] = "Final Recommendation";
        return 3;
    }

    private int SeedDefaultPriorities()
    {
        _priorityOptions[0] = "High";
        _priorityOptions[1] = "Medium";
        _priorityOptions[2] = "Low";
        return 3;
    }

    private static string FormatAssignmentId(ushort assignmentId)
    {
        var digits = CountDigits((uint)assignmentId);
        return string.Create(4 + digits, assignmentId, static (span, value) =>
        {
            "ASG-".AsSpan().CopyTo(span);
            value.TryFormat(span.Slice(4), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string FormatPriorityLabel(byte priorityLevel) => priorityLevel switch
    {
        1 => "High",
        2 => "Medium",
        _ => "Low"
    };

    private static string ResolveAssignmentRole(byte priorityLevel) => priorityLevel switch
    {
        1 => "Lead Scout",
        2 => "Senior Scout",
        _ => "Regional Scout"
    };

    private static string DetermineStage(byte progressPercent)
    {
        if (progressPercent >= 85)
        {
            return "Final Recommendation";
        }

        if (progressPercent >= 55)
        {
            return "Detailed Analysis";
        }

        return "Initial Report";
    }

    private static string DetermineScoutAvailability(byte progressPercent)
    {
        if (progressPercent >= 80)
        {
            return "Returning Soon";
        }

        if (progressPercent >= 40)
        {
            return "On Assignment";
        }

        return "Available";
    }

    private static string FormatDeadline(byte progressPercent)
    {
        var days = 28 - ((progressPercent * 18) / 100);
        if (days < 4)
        {
            days = 4;
        }

        var suffix = days == 1 ? " day" : " days";
        var digits = CountDigits((uint)days);
        return string.Create(7 + digits + suffix.Length, (days, suffix), static (span, state) =>
        {
            const string Prefix = "Due in ";
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.days.TryFormat(span.Slice(offset), out var written, provider: CultureInfo.InvariantCulture);
            offset += written;
            state.suffix.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string FormatAssignmentNotes(string focus, string region)
    {
        return string.Create(focus.Length + region.Length + 4, (focus, region), static (span, state) =>
        {
            state.focus.AsSpan().CopyTo(span);
            var offset = state.focus.Length;
            " in ".AsSpan().CopyTo(span.Slice(offset));
            offset += 4;
            state.region.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private string ResolveScoutName(ushort firstNameId, ushort lastNameId)
    {
        var name = _stringDatabase.GetFullName(firstNameId, lastNameId);
        if (string.IsNullOrEmpty(name) || ReferenceEquals(name, _stringDatabase.MissingValue))
        {
            var digits = CountDigits((uint)(firstNameId + lastNameId));
            name = string.Create(6 + digits, (uint)(firstNameId + lastNameId), static (span, value) =>
            {
                "Scout ".AsSpan().CopyTo(span);
                value.TryFormat(span.Slice(6), out _, provider: CultureInfo.InvariantCulture);
            });
        }

        return name;
    }

    private static string FormatAssignmentCount(int count)
    {
        var digits = CountDigits((uint)count);
        return string.Create(13 + digits, count, static (span, value) =>
        {
            const string Prefix = "Assignments: ";
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            value.TryFormat(span.Slice(offset), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string FormatAverageProgressText(int average)
    {
        var percentage = FormatPercentageValue(average);
        const string Prefix = "Avg progress ";
        return string.Create(Prefix.Length + percentage.Length, percentage, static (span, value) =>
        {
            const string InnerPrefix = "Avg progress ";
            InnerPrefix.AsSpan().CopyTo(span);
            value.AsSpan().CopyTo(span.Slice(InnerPrefix.Length));
        });
    }

    private static string FormatFocusDescription(string region, int averageProgress)
    {
        var percentage = FormatPercentageValue(averageProgress);
        const string Prefix = "Strongest coverage in ";
        const string SuffixPrefix = " (avg ";
        return string.Create(Prefix.Length + region.Length + SuffixPrefix.Length + percentage.Length + 1, (region, percentage), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.region.AsSpan().CopyTo(span.Slice(offset));
            offset += state.region.Length;
            SuffixPrefix.AsSpan().CopyTo(span.Slice(offset));
            offset += SuffixPrefix.Length;
            state.percentage.AsSpan().CopyTo(span.Slice(offset));
            offset += state.percentage.Length;
            span[offset] = ')';
        });
    }

    private static string FormatKnowledgeDescription(string label, int count)
    {
        var digits = CountDigits((uint)count);
        const string Prefix = "Focus on ";
        const string Suffix = " (";
        const string Tail = " assignments)";
        return string.Create(Prefix.Length + label.Length + Suffix.Length + digits + Tail.Length, (label, count), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.label.AsSpan().CopyTo(span.Slice(offset));
            offset += state.label.Length;
            Suffix.AsSpan().CopyTo(span.Slice(offset));
            offset += Suffix.Length;
            state.count.TryFormat(span.Slice(offset), out var written, provider: CultureInfo.InvariantCulture);
            offset += written;
            Tail.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string FormatRegionAndScout(string region, string scout)
    {
        const string Prefix = "Region ";
        const string Separator = " • Scout ";
        return string.Create(Prefix.Length + region.Length + Separator.Length + scout.Length, (region, scout), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.region.AsSpan().CopyTo(span.Slice(offset));
            offset += state.region.Length;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            state.scout.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string FormatPriorityAndProgress(string priority, byte progress)
    {
        var percentage = FormatPercentage(progress);
        const string Prefix = "Priority ";
        const string Separator = " • ";
        return string.Create(Prefix.Length + priority.Length + Separator.Length + percentage.Length, (priority, percentage), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.priority.AsSpan().CopyTo(span.Slice(offset));
            offset += state.priority.Length;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            state.percentage.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string FormatShortTermDescription(string focus, string region)
    {
        const string Prefix = "Priority on ";
        const string InLabel = " in ";
        return string.Create(Prefix.Length + focus.Length + InLabel.Length + region.Length, (focus, region), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.focus.AsSpan().CopyTo(span.Slice(offset));
            offset += state.focus.Length;
            InLabel.AsSpan().CopyTo(span.Slice(offset));
            offset += InLabel.Length;
            state.region.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string FormatRatingPair(byte overall, byte potential)
    {
        var overallDigits = CountDigits(overall);
        var potentialDigits = CountDigits(potential);
        const string Prefix = "OVR ";
        const string Separator = " • POT ";
        return string.Create(Prefix.Length + overallDigits + Separator.Length + potentialDigits, (overall, potential), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.overall.TryFormat(span.Slice(offset), out var written, provider: CultureInfo.InvariantCulture);
            offset += written;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            state.potential.TryFormat(span.Slice(offset), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private static string FormatPlayerStatus(string position, string status)
    {
        const string Prefix = "Position ";
        const string Separator = " • ";
        return string.Create(Prefix.Length + position.Length + Separator.Length + status.Length, (position, status), static (span, state) =>
        {
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.position.AsSpan().CopyTo(span.Slice(offset));
            offset += state.position.Length;
            Separator.AsSpan().CopyTo(span.Slice(offset));
            offset += Separator.Length;
            state.status.AsSpan().CopyTo(span.Slice(offset));
        });
    }

    private static string FormatRecommendedDescription(string name, byte overall)
    {
        var digits = CountDigits(overall);
        return string.Create(name.Length + digits + 25, (name, overall), static (span, state) =>
        {
            const string Prefix = "Top recommendation ";
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            state.name.AsSpan().CopyTo(span.Slice(offset));
            offset += state.name.Length;
            const string SuffixPrefix = " (OVR ";
            SuffixPrefix.AsSpan().CopyTo(span.Slice(offset));
            offset += SuffixPrefix.Length;
            state.overall.TryFormat(span.Slice(offset), out var written, provider: CultureInfo.InvariantCulture);
            offset += written;
            span[offset] = ')';
        });
    }

    private static string FormatScoutOptionId(ushort firstNameId, ushort lastNameId)
    {
        var firstDigits = CountDigits((uint)firstNameId);
        var lastDigits = CountDigits((uint)lastNameId);
        return string.Create(firstDigits + lastDigits + 1, (firstNameId, lastNameId), static (span, state) =>
        {
            state.firstNameId.TryFormat(span, out var written, provider: CultureInfo.InvariantCulture);
            span[written] = '-';
            state.lastNameId.TryFormat(span.Slice(written + 1), out _, provider: CultureInfo.InvariantCulture);
        });
    }

    private int FindScoutOptionIndex(int count, string scoutId)
    {
        for (var i = 0; i < count; i++)
        {
            if (string.Equals(_scoutOptionDefinitions[i].Id, scoutId, StringComparison.Ordinal))
            {
                return i;
            }
        }

        return -1;
    }

    private void InitializeKnowledgeBands()
    {
        _knowledgeSummaries[0] = new KnowledgeBandSummary("Comprehensive Coverage", 80, 101, KnowledgeComprehensiveAccent);
        _knowledgeSummaries[1] = new KnowledgeBandSummary("Developing Insight", 50, 80, KnowledgeDevelopingAccent);
        _knowledgeSummaries[2] = new KnowledgeBandSummary("Initial Scouting", 0, 50, KnowledgeInitialAccent);
    }

    private static string FormatPercentage(byte value)
    {
        var digits = CountDigits(value);
        return string.Create(digits + 1, value, static (span, state) =>
        {
            state.TryFormat(span, out var written, provider: CultureInfo.InvariantCulture);
            span[written] = '%';
        });
    }

    private static string FormatPercentageValue(int value)
    {
        if (value < 0)
        {
            value = 0;
        }
        else if (value > 100)
        {
            value = 100;
        }

        var digits = CountDigits((uint)value);
        return string.Create(digits + 1, value, static (span, state) =>
        {
            state.TryFormat(span, out var written, provider: CultureInfo.InvariantCulture);
            span[written] = '%';
        });
    }

    private void SortRegionSummaries(int count)
    {
        for (var i = 0; i < count - 1; i++)
        {
            var best = i;
            for (var j = i + 1; j < count; j++)
            {
                if (_regionSummaries[j].AssignmentCount > _regionSummaries[best].AssignmentCount ||
                    (_regionSummaries[j].AssignmentCount == _regionSummaries[best].AssignmentCount &&
                     _regionSummaries[j].ProgressTotal > _regionSummaries[best].ProgressTotal))
                {
                    best = j;
                }
            }

            if (best != i)
            {
                (_regionSummaries[i], _regionSummaries[best]) = (_regionSummaries[best], _regionSummaries[i]);
            }
        }
    }

    private void SortFocusAssignments(int count)
    {
        for (var i = 0; i < count - 1; i++)
        {
            var best = i;
            for (var j = i + 1; j < count; j++)
            {
                if (_focusAssignments[j].PriorityLevel < _focusAssignments[best].PriorityLevel ||
                    (_focusAssignments[j].PriorityLevel == _focusAssignments[best].PriorityLevel &&
                     _focusAssignments[j].Progress > _focusAssignments[best].Progress))
                {
                    best = j;
                }
            }

            if (best != i)
            {
                (_focusAssignments[i], _focusAssignments[best]) = (_focusAssignments[best], _focusAssignments[i]);
            }
        }
    }

    private static void SortPlayerRecommendations(Span<ScoutingModule.ScoutReportView> reports)
    {
        for (var i = 0; i < reports.Length - 1; i++)
        {
            var best = i;
            for (var j = i + 1; j < reports.Length; j++)
            {
                ref readonly var candidate = ref reports[j];
                ref readonly var current = ref reports[best];
                if (candidate.IsPriorityTarget && !current.IsPriorityTarget)
                {
                    best = j;
                }
                else if (candidate.IsPriorityTarget == current.IsPriorityTarget)
                {
                    if (candidate.OverallRating > current.OverallRating ||
                        (candidate.OverallRating == current.OverallRating && candidate.PotentialRating > current.PotentialRating))
                    {
                        best = j;
                    }
                }
            }

            if (best != i)
            {
                (reports[i], reports[best]) = (reports[best], reports[i]);
            }
        }
    }

    private void ResetKnowledgeSummaries()
    {
        for (var i = 0; i < _knowledgeSummaries.Length; i++)
        {
            _knowledgeSummaries[i].Reset();
        }
    }

    private int ResolveKnowledgeBandIndex(byte progressPercent)
    {
        for (var i = 0; i < _knowledgeSummaries.Length; i++)
        {
            ref readonly var band = ref _knowledgeSummaries[i];
            if (progressPercent >= band.Minimum && progressPercent < band.Maximum)
            {
                return i;
            }
        }

        return _knowledgeSummaries.Length - 1;
    }

    private static string CreateInterestText(byte interest)
    {
        var digits = CountDigits(interest);
        return string.Create(11 + digits, interest, static (span, value) =>
        {
            const string Prefix = "Interest: ";
            Prefix.AsSpan().CopyTo(span);
            var offset = Prefix.Length;
            value.TryFormat(span.Slice(offset), out var written, provider: CultureInfo.InvariantCulture);
            span[offset + written] = '%';
        });
    }

    private static string FormatCurrency(uint value)
    {
        if (value >= MillionUnit)
        {
            return FormatWithSuffix(value, MillionUnit, MillionRounding, 'M');
        }

        if (value >= 10_000u)
        {
            return FormatWithSuffix(value, ThousandUnit, ThousandRounding, 'k');
        }

        Span<char> buffer = stackalloc char[16];
        if (!value.TryFormat(buffer, out var digits, "N0", CultureInfo.InvariantCulture))
        {
            digits = 0;
        }

        return string.Create(digits + 1, (value, digits), static (span, state) =>
        {
            span[0] = '£';
            state.value.TryFormat(span.Slice(1), out _, "N0", CultureInfo.InvariantCulture);
        });
    }

    private static string FormatWithSuffix(uint value, uint unit, uint roundingUnit, char suffix)
    {
        var whole = value / unit;
        var remainder = value % unit;
        var tenth = (remainder + (roundingUnit / 2u)) / roundingUnit;

        if (tenth >= 10u)
        {
            whole += 1u;
            tenth = 0u;
            if (unit == ThousandUnit && whole >= ThousandUnit)
            {
                return FormatWithSuffix(value, MillionUnit, MillionRounding, 'M');
            }
        }

        var digits = CountDigits(whole);

        if (tenth == 0u)
        {
            return string.Create(digits + 2, (whole, digits, suffix), static (span, state) =>
            {
                span[0] = '£';
                state.whole.TryFormat(span.Slice(1), out _, provider: CultureInfo.InvariantCulture);
                span[state.digits + 1] = state.suffix;
            });
        }

        return string.Create(digits + 3, (whole, digits, suffix, tenth), static (span, state) =>
        {
            span[0] = '£';
            state.whole.TryFormat(span.Slice(1), out _, provider: CultureInfo.InvariantCulture);
            var index = state.digits + 1;
            span[index] = '.';
            span[index + 1] = (char)('0' + state.tenth);
            span[index + 2] = state.suffix;
        });
    }

    private static int CountDigits(uint value)
    {
        if (value >= 1_000_000_000u)
        {
            return 10;
        }

        if (value >= 100_000_000u)
        {
            return 9;
        }

        if (value >= 10_000_000u)
        {
            return 8;
        }

        if (value >= 1_000_000u)
        {
            return 7;
        }

        if (value >= 100_000u)
        {
            return 6;
        }

        if (value >= 10_000u)
        {
            return 5;
        }

        if (value >= 1_000u)
        {
            return 4;
        }

        if (value >= 100u)
        {
            return 3;
        }

        if (value >= 10u)
        {
            return 2;
        }

        return 1;
    }

    private static int CountDigits(byte value) => value >= 100 ? 3 : value >= 10 ? 2 : 1;

    private static bool IsTransferCentre(string tabIdentifier, string sectionIdentifier)
    {
        return string.Equals(tabIdentifier, TransfersTabId, StringComparison.OrdinalIgnoreCase) &&
               string.Equals(sectionIdentifier, TransferCentreSectionId, StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsTransfersScouting(string tabIdentifier, string sectionIdentifier)
    {
        return string.Equals(tabIdentifier, TransfersTabId, StringComparison.OrdinalIgnoreCase) &&
               string.Equals(sectionIdentifier, TransfersScoutingSectionId, StringComparison.OrdinalIgnoreCase);
    }

    private void RaiseLayoutChanged(string tabIdentifier, string sectionIdentifier)
    {
        LayoutChanged?.Invoke(this, new ModuleLayoutChangedEventArgs(tabIdentifier, sectionIdentifier));
    }

    private struct RegionSummary
    {
        public string Region;
        public int AssignmentCount;
        public int ProgressTotal;

        public void Reset()
        {
            Region = string.Empty;
            AssignmentCount = 0;
            ProgressTotal = 0;
        }
    }

    private struct KnowledgeBandSummary
    {
        public KnowledgeBandSummary(string label, byte minimum, byte maximum, string accent)
        {
            Label = label;
            Minimum = minimum;
            Maximum = maximum;
            Accent = accent;
            Count = 0;
            ProgressTotal = 0;
        }

        public string Label;
        public byte Minimum;
        public byte Maximum;
        public string Accent;
        public int Count;
        public int ProgressTotal;

        public void Reset()
        {
            Count = 0;
            ProgressTotal = 0;
        }
    }

    private struct FocusAssignmentSummary
    {
        public string Focus;
        public string Region;
        public string Priority;
        public byte PriorityLevel;
        public byte Progress;
        public string Scout;
    }

    private sealed class CardListItemSegment : IReadOnlyList<CardListItem>
    {
        private readonly CardListItem[] _items;
        private int _count;

        public CardListItemSegment(CardListItem[] items)
        {
            _items = items;
            _count = 0;
        }

        public int Count => _count;

        public CardListItem this[int index]
        {
            get
            {
                if ((uint)index >= (uint)_count)
                {
                    throw new ArgumentOutOfRangeException(nameof(index));
                }

                return _items[index];
            }
        }

        public void SetCount(int count)
        {
            var previous = _count;

            if (count < 0)
            {
                count = 0;
            }

            if (count > _items.Length)
            {
                count = _items.Length;
            }

            _count = count;

            for (var i = count; i < previous; i++)
            {
                _items[i] = default!;
            }
        }

        public Enumerator GetEnumerator() => new Enumerator(_items, _count);

        IEnumerator<CardListItem> IEnumerable<CardListItem>.GetEnumerator() => GetEnumerator();

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

        public struct Enumerator : IEnumerator<CardListItem>
        {
            private readonly CardListItem[] _items;
            private readonly int _count;
            private int _index;

            public Enumerator(CardListItem[] items, int count)
            {
                _items = items;
                _count = count;
                _index = -1;
            }

            public CardListItem Current => _items[_index];

            object IEnumerator.Current => Current;

            public bool MoveNext()
            {
                var next = _index + 1;
                if (next >= _count)
                {
                    return false;
                }

                _index = next;
                return true;
            }

            public void Reset()
            {
                _index = -1;
            }

            public void Dispose()
            {
            }
        }
    }
}
