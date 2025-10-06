using System;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Database
{
    public sealed unsafe class PlayerDatabase : IDisposable
    {
        private const int MaxPlayers = 1_000_000;
        private readonly MemoryMappedFile _memoryMappedFile;
        private readonly MemoryMappedViewAccessor _viewAccessor;
        private readonly PlayerData* _players;
        private readonly int[] _idToIndex;
        private int _playerCount;
        private int _nextFreeIndex;
        private bool _disposed;

        public PlayerDatabase(string dbPath)
        {
            _idToIndex = new int[MaxPlayers + 1];
            Array.Fill(_idToIndex, -1);

            long fileSize = (long)MaxPlayers * sizeof(PlayerData);
            _memoryMappedFile = MemoryMappedFile.CreateFromFile(dbPath, FileMode.OpenOrCreate, "PlayerDB", fileSize);
            _viewAccessor = _memoryMappedFile.CreateViewAccessor(0, fileSize);

            byte* pointer = null;
            _viewAccessor.SafeMemoryMappedViewHandle.AcquirePointer(ref pointer);
            _players = (PlayerData*)pointer;

            BuildIndex();
        }

        private void BuildIndex()
        {
            _playerCount = 0;
            _nextFreeIndex = 0;

            for (int i = 0; i < MaxPlayers; i++)
            {
                uint playerId = _players[i].Id;
                if (playerId == 0)
                {
                    if (_nextFreeIndex <= i)
                    {
                        _nextFreeIndex = i;
                    }
                    continue;
                }

                if (playerId > MaxPlayers)
                {
                    throw new InvalidDataException($"Player ID {playerId} exceeds max limit.");
                }

                _idToIndex[playerId] = i;
                _playerCount++;

                if (i >= _nextFreeIndex)
                {
                    _nextFreeIndex = i + 1;
                }
            }

            if (_nextFreeIndex >= MaxPlayers)
            {
                _nextFreeIndex = 0;
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref PlayerData GetPlayer(uint playerId)
        {
            return ref EnsurePlayer(playerId);
        }

        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            _disposed = true;
            _viewAccessor.SafeMemoryMappedViewHandle.ReleasePointer();
            _viewAccessor.Dispose();
            _memoryMappedFile.Dispose();
        }

        private ref PlayerData EnsurePlayer(uint playerId)
        {
            if (playerId == 0 || playerId > MaxPlayers)
            {
                throw new ArgumentOutOfRangeException(nameof(playerId));
            }

            int index = _idToIndex[playerId];
            if (index == -1)
            {
                index = AllocateSlot();
                ref var player = ref _players[index];
                player = default;
                player.Id = playerId;
                _idToIndex[playerId] = index;
                _playerCount++;
                return ref player;
            }

            return ref _players[index];
        }

        private int AllocateSlot()
        {
            for (int i = _nextFreeIndex; i < MaxPlayers; i++)
            {
                if (_players[i].Id == 0)
                {
                    _nextFreeIndex = i + 1;
                    if (_nextFreeIndex >= MaxPlayers)
                    {
                        _nextFreeIndex = 0;
                    }

                    return i;
                }
            }

            for (int i = 0; i < _nextFreeIndex; i++)
            {
                if (_players[i].Id == 0)
                {
                    _nextFreeIndex = i + 1;
                    if (_nextFreeIndex >= MaxPlayers)
                    {
                        _nextFreeIndex = 0;
                    }

                    return i;
                }
            }

            throw new InvalidOperationException("Player database capacity exceeded.");
        }
    }
}

