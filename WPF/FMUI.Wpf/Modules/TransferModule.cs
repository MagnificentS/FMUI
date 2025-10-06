using System;
using FMUI.Wpf.Collections;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.Modules
{
    public sealed class TransferModule : IGameModule
    {
        private const int MaxTargets = 64;
        private const int TargetBatchSize = 20;
        private const byte MinScoutRating = 50;
        private const byte MaxScoutRating = 95;
        private const byte MinInterest = 30;
        private const byte MaxInterest = 90;

        private readonly SquadService _squadService;

        private ArrayCollection<TransferTarget> _targets;
        private uint _transferBudget;
        private uint _wageBudget;
        private ModuleState _state;
        private int _negotiationTick;
        private bool _stateDirty;

        public event EventHandler<ModuleEventArgs>? ModuleEvent;

        public TransferModule(SquadService squadService)
        {
            _squadService = squadService;
            _targets = new ArrayCollection<TransferTarget>(TargetBatchSize);
            _transferBudget = 0;
            _wageBudget = 0;
            _state = ModuleState.Uninitialized;
            _negotiationTick = 0;
            _stateDirty = false;
        }

        public const string ModuleIdentifier = "Transfer";

        public const int MaximumTargetCount = MaxTargets;

        public string ModuleId => ModuleIdentifier;

        public ModuleState State => _state;

        public uint TransferBudget => _transferBudget;

        public uint WageBudget => _wageBudget;

        public void Initialize()
        {
            _state = ModuleState.Initializing;
            _transferBudget = 50_000_000;
            _wageBudget = 250_000;
            _targets.Clear();

            GenerateTransferTargets();

            _state = ModuleState.Ready;
            PublishState();
        }

        public void Start()
        {
            if (_state != ModuleState.Ready && _state != ModuleState.Paused)
            {
                return;
            }

            _state = ModuleState.Running;
        }

        public void Update(GameTime gameTime)
        {
            if (_state != ModuleState.Running)
            {
                return;
            }

            UpdateTargetAvailability(gameTime.FrameCount);
            ProcessNegotiations(gameTime.FrameCount);

            if (_stateDirty)
            {
                PublishState();
            }
        }

        public void Stop()
        {
            if (_state == ModuleState.Running)
            {
                _state = ModuleState.Paused;
            }
        }

        public void Cleanup()
        {
            _targets.Clear();
            _state = ModuleState.Uninitialized;
            _stateDirty = false;
        }

        public void LoadData()
        {
            // TODO: Load persisted transfer data once persistence is available.
        }

        public void SaveData()
        {
            // TODO: Persist transfer data when a storage provider is ready.
        }

        public void MakeBid(int targetIndex, uint bidAmount)
        {
            if (_state != ModuleState.Running)
            {
                return;
            }

            if ((uint)targetIndex >= (uint)_targets.Count)
            {
                return;
            }

            var target = _targets[targetIndex];

            if (bidAmount > _transferBudget)
            {
                RaiseEvent("BidRejected", "InsufficientBudget");
                return;
            }

            if (target.WageDemand > _wageBudget)
            {
                RaiseEvent("BidRejected", "WageBudgetExceeded");
                return;
            }

            uint acceptanceThreshold = (uint)(target.AskingPrice * 9 / 10);
            if (bidAmount >= acceptanceThreshold)
            {
                _transferBudget -= bidAmount;
                _wageBudget -= target.WageDemand;
                target.IsAvailable = false;
                target.InterestLevel = (byte)Math.Min(100, target.InterestLevel + 10);
                _targets[targetIndex] = target;
                RaiseEvent("BidAccepted", target);
                _stateDirty = true;
                PublishState();
            }
            else
            {
                RaiseEvent("BidRejected", "OfferTooLow");
            }
        }

        public int CopyTargets(Span<TransferTargetView> destination)
        {
            var source = _targets.AsSpan();
            int length = source.Length;
            if (length == 0)
            {
                return 0;
            }

            int targetLength = destination.Length;
            if (length > targetLength)
            {
                length = targetLength;
            }

            for (int i = 0; i < length; i++)
            {
                ref readonly var entry = ref source[i];
                destination[i] = new TransferTargetView(
                    entry.PlayerId,
                    entry.AskingPrice,
                    entry.WageDemand,
                    entry.ScoutRating,
                    entry.InterestLevel,
                    entry.IsAvailable);
            }

            return length;
        }

        private void GenerateTransferTargets()
        {
            var randomSeed = (uint)_squadService.SquadCount;
            for (int i = 0; i < TargetBatchSize && i < MaxTargets; i++)
            {
                ref var entry = ref _targets.AddReference();
                entry.PlayerId = 10_000 + i;
                entry.AskingPrice = (uint)(5_000_000 + (i * 750_000));
                entry.WageDemand = (uint)(40_000 + (i * 2_500));
                entry.ScoutRating = (byte)(MinScoutRating + ((randomSeed + (uint)i * 7) % (MaxScoutRating - MinScoutRating + 1)));
                entry.InterestLevel = (byte)(MinInterest + ((randomSeed + (uint)i * 13) % (MaxInterest - MinInterest + 1)));
                entry.IsAvailable = (i % 3) != 0;
            }

            _stateDirty = true;
        }

        private void UpdateTargetAvailability(long frameCount)
        {
            bool changed = false;
            for (int i = 0; i < _targets.Count; i++)
            {
                var target = _targets[i];
                if (frameCount % 16 == (i % 16))
                {
                    target.IsAvailable = !target.IsAvailable;
                    changed = true;
                }

                if (target.IsAvailable && target.InterestLevel < MaxInterest)
                {
                    target.InterestLevel++;
                    changed = true;
                }

                _targets[i] = target;
            }

            if (changed)
            {
                _stateDirty = true;
            }
        }

        private void ProcessNegotiations(long frameCount)
        {
            if (_targets.Count == 0)
            {
                return;
            }

            _negotiationTick++;
            if ((_negotiationTick & 7) != 0)
            {
                return;
            }

            int index = (int)(frameCount % _targets.Count);
            var target = _targets[index];
            if (!target.IsAvailable)
            {
                return;
            }

            if (target.InterestLevel >= 80)
            {
                RaiseEvent("NegotiationProgress", target);
                _stateDirty = true;
            }
        }

        private void RaiseEvent(string eventType, object? data)
        {
            ModuleEvent?.Invoke(this, new ModuleEventArgs(eventType, data));
        }

        private void PublishState()
        {
            _stateDirty = false;
            RaiseEvent(TransferModuleEvents.StateUpdated, null);
        }

        private struct TransferTarget
        {
            public int PlayerId;
            public uint AskingPrice;
            public uint WageDemand;
            public byte ScoutRating;
            public byte InterestLevel;
            public bool IsAvailable;
        }

        public readonly struct TransferTargetView
        {
            public readonly int PlayerId;
            public readonly uint AskingPrice;
            public readonly uint WageDemand;
            public readonly byte ScoutRating;
            public readonly byte InterestLevel;
            public readonly bool IsAvailable;

            public TransferTargetView(
                int playerId,
                uint askingPrice,
                uint wageDemand,
                byte scoutRating,
                byte interestLevel,
                bool isAvailable)
            {
                PlayerId = playerId;
                AskingPrice = askingPrice;
                WageDemand = wageDemand;
                ScoutRating = scoutRating;
                InterestLevel = interestLevel;
                IsAvailable = isAvailable;
            }
        }
    }

    public static class TransferModuleEvents
    {
        public const string StateUpdated = "StateUpdated";
    }
}
