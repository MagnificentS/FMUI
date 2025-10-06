using System;
using System.Runtime.CompilerServices;
using FMUI.Wpf.Database;

namespace FMUI.Wpf.Services
{
    public sealed class SquadService
    {
        private const int MaxSquadSize = 50;
        private const int StartingElevenSize = 11;
        private const byte DefaultFitness = 85;
        private const byte DefaultMorale = 80;
        private const byte DefaultAverageRating = 70;
        private const byte DefaultForm = 68;

        private static readonly PlayerPosition[] DefaultStartingPositions = new[]
        {
            PlayerPosition.GK,
            PlayerPosition.RB,
            PlayerPosition.CB,
            PlayerPosition.CB,
            PlayerPosition.LB,
            PlayerPosition.DM,
            PlayerPosition.CM,
            PlayerPosition.CM,
            PlayerPosition.RW,
            PlayerPosition.LW,
            PlayerPosition.ST
        };

        private readonly PlayerDatabase _database;
        private readonly uint[] _squadPlayerIds;
        private readonly byte[] _startingElevenMap;
        private int _squadCount;

        public int SquadCount
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get => _squadCount;
        }

        public SquadService(PlayerDatabase database)
        {
            _database = database;
            _squadPlayerIds = new uint[MaxSquadSize];
            _startingElevenMap = new byte[StartingElevenSize];

            LoadDefaultSquad();
        }

        private void LoadDefaultSquad()
        {
            const int defaultCount = 25;
            for (int i = 0; i < defaultCount; i++)
            {
                uint playerId = (uint)(1001 + i);
                _squadPlayerIds[i] = playerId;
                ref var player = ref _database.GetPlayer(playerId);
                InitializePlaceholderPlayer(ref player, i);
            }

            _squadCount = defaultCount;

            for (byte i = 0; i < StartingElevenSize; i++)
            {
                _startingElevenMap[i] = i;
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref PlayerData GetStartingPlayer(int formationPositionIndex)
        {
            if ((uint)formationPositionIndex >= StartingElevenSize)
            {
                throw new IndexOutOfRangeException();
            }

            byte squadArrayIndex = _startingElevenMap[formationPositionIndex];
            uint playerId = _squadPlayerIds[squadArrayIndex];
            return ref _database.GetPlayer(playerId);
        }

        public void SwapPlayersInFormation(int position1, int position2)
        {
            if ((uint)position1 >= StartingElevenSize || (uint)position2 >= StartingElevenSize)
            {
                return;
            }

            byte temp = _startingElevenMap[position1];
            _startingElevenMap[position1] = _startingElevenMap[position2];
            _startingElevenMap[position2] = temp;
        }

        public unsafe void ProcessStartingEleven(delegate*<ref PlayerData, void> processor)
        {
            for (int i = 0; i < StartingElevenSize; i++)
            {
                processor(ref GetStartingPlayer(i));
            }
        }

        private static void InitializePlaceholderPlayer(ref PlayerData player, int index)
        {
            if (player.FirstNameId != 0 || player.LastNameId != 0 || player.CurrentAbility != 0)
            {
                return;
            }

            player.Age = (byte)(22 + (index % 10));
            player.Position = (byte)(index < DefaultStartingPositions.Length
                ? DefaultStartingPositions[index]
                : PlayerPosition.Unspecified);
            player.Fitness = DefaultFitness;
            player.Morale = DefaultMorale;
            player.MatchesPlayed = 0;
            player.Goals = 0;
            player.Assists = 0;
            player.AverageRating = DefaultAverageRating;
            player.Form = DefaultForm;
            player.ClubId = 1;
            player.SquadNumber = (byte)((index % 50) + 1);
            player.PreferredFoot = (byte)(index % 3);
            player.SquadRole = (byte)(index < 3 ? SquadRole.KeyPlayer : SquadRole.FirstTeam);
            player.CurrentAbility = (byte)(110 + (index % 20));
            player.PotentialAbility = (byte)Math.Min(200, player.CurrentAbility + 20);

            byte technicalBase = (byte)(8 + (index % 6));
            byte mentalBase = (byte)(7 + ((index + 2) % 6));
            byte physicalBase = (byte)(9 + ((index + 4) % 5));

            for (int i = 0; i < 8; i++)
            {
                player.SetTechnicalAttribute(i, technicalBase);
                player.SetMentalAttribute(i, mentalBase);
                player.SetPhysicalAttribute(i, physicalBase);
            }
        }
    }
}

