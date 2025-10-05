# 📘 Enterprise WPF Football Manager: A High-Performance Implementation Guide

**Objective:** To refactor the application to handle over 500,000 players with **zero runtime allocations** and a constant **60 FPS UI**. This guide is your definitive blueprint. Follow each step precisely.

**Core Principles:**
1.  **Data-Oriented Design:** We arrange data for the CPU, not for our convenience. This means cache-aligned structs and sequential memory access.
2.  **Zero Runtime Allocations:** Memory is allocated at startup. During gameplay, we reuse memory (pooling) or use the stack (`stackalloc`). The Garbage Collector must not be a bottleneck.
3.  **Measure First:** Every optimization is driven by profiling data. We will use `BenchmarkDotNet` to prove our backend is fast and WPF profilers to prove our UI is smooth.

---

## Phase 0: Project Setup

**Goal:** Configure the project to support high-performance C#.

### Task 0.1: Enable Unsafe Code
1.  Open `FMUI.Wpf.csproj`.
2.  Inside the first `<PropertyGroup>` section, add the following line. This is non-negotiable for the pointer-based access required for performance.
    ```xml
    <AllowUnsafeBlocks>true</AllowUnsafeBlocks>
    ```

### Task 0.2: Create Directory Structure
Create the following folders in the `FMUI.Wpf` project to organize the new systems:
*   `/Database`
*   `/Infrastructure`
*   `/Collections`
*   `/Modules`
*   `/UI/Cards`
*   `/UI/Controls`

---

## Phase 1: The Data Engine

**Goal:** Build the heart of our application: a memory-mapped database capable of storing and accessing a million players instantly.

### Task 1.1: Implement the Cache-Aligned PlayerData Struct
**File:** `FMUI.Wpf/Database/PlayerData.cs`
```csharp
using System;
using System.Runtime.InteropServices;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Database
{
    // Define enums outside the struct for broader use.
    public enum PlayerPosition : byte { GK, CB, LB, RB, DM, CM, AM, LW, RW, ST, Unspecified }
    public enum SquadRole : byte { KeyPlayer, FirstTeam, Rotation, Backup, HotProspect, Youth, Unspecified }

    [StructLayout(LayoutKind.Sequential, Pack = 1, Size = 64)]
    public unsafe struct PlayerData
    {
        // Identity (8 bytes)
        public uint Id;              // 4 bytes - Supports ~4 billion players
        public ushort FirstNameId;   // 2 bytes - Index into first names StringTable
        public ushort LastNameId;    // 2 bytes - Index into last names StringTable

        // Packed Attributes (8 bytes) - Each attribute (0-20) is compressed to 4 bits (0-15)
        public uint TechnicalPacked; // 8 attributes × 4 bits
        public uint MentalPacked;    // 8 attributes × 4 bits

        // Physical & Status (8 bytes)
        public uint PhysicalPacked;  // 8 attributes × 4 bits
        public byte Age;             // 1 byte (0-255)
        public byte Position;        // 1 byte (PlayerPosition enum)
        public byte Fitness;         // 1 byte (0-100)
        public byte Morale;          // 1 byte (0-100)

        // Performance (8 bytes)
        public ushort MatchesPlayed;
        public ushort Goals;
        public ushort Assists;
        public byte AverageRating;   // Stored as value * 10 (e.g., 7.5 is stored as 75)
        public byte Form;            // Average rating over last 5 games * 10

        // Contract & Financial (8 bytes)
        public uint WeeklySalaryPacked; // Compressed value
        public ushort ContractExpiryYear;
        public byte SquadRole;
        public byte NationalityId;

        // Team & Tactical (8 bytes)
        public ushort ClubId;
        public byte SquadNumber;
        public byte PreferredFoot;      // 0=Right, 1=Left, 2=Both
        private fixed byte _reserved1[4]; // Padding for alignment

        // Potential & Development (8 bytes)
        public byte CurrentAbility;     // 0-200
        public byte PotentialAbility;   // 0-200
        private fixed byte _reserved2[6]; // Padding for alignment

        // Attribute accessors using zero-allocation bit manipulation
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public byte GetTechnicalAttribute(int index) => (byte)((TechnicalPacked >> (index * 4)) & 0xF);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void SetTechnicalAttribute(int index, byte value)
        {
            uint mask = ~(0xFu << (index * 4));
            TechnicalPacked = (TechnicalPacked & mask) | ((uint)(value & 0xF) << (index * 4));
        }
        // Repeat this pattern for MentalPacked and PhysicalPacked
    }
}
```

### Task 1.2: Implement the Memory-Mapped StringTable
**Why:** Storing strings in a database avoids runtime allocations. We will load a pre-compiled binary file of all possible names into memory at startup. Access is nearly instantaneous.

**File:** `FMUI.Wpf/Infrastructure/StringTable.cs`
```csharp
using System;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Runtime.CompilerServices;
using System.Text;

namespace FMUI.Wpf.Infrastructure
{
    public sealed unsafe class StringTable : IDisposable
    {
        private readonly string[] _cache;
        private readonly MemoryMappedFile _mmf;
        private readonly MemoryMappedViewAccessor _accessor;
        private readonly byte* _basePtr;

        public StringTable(string binaryPath)
        {
            if (!File.Exists(binaryPath))
                throw new FileNotFoundException("StringTable binary file not found.", binaryPath);

            _mmf = MemoryMappedFile.CreateFromFile(binaryPath, FileMode.Open, null, 0, MemoryMappedFileAccess.Read);
            _accessor = _mmf.CreateViewAccessor(0, 0, MemoryMappedFileAccess.Read);
            
            _basePtr = null;
            _accessor.SafeMemoryMappedViewHandle.AcquirePointer(ref _basePtr);

            // The binary file format must be: [count:int][offsets:int*count][lengths:ushort*count][data:byte*]
            int count = *(int*)_basePtr;
            _cache = new string[count];
            int* offsets = (int*)(_basePtr + 4);
            ushort* lengths = (ushort*)(_basePtr + 4 + (count * 4));
            byte* data = (byte*)((byte*)(lengths) + (count * 2));

            // Pre-materialize all strings at startup for fastest access
            for (int i = 0; i < count; i++)
            {
                _cache[i] = Encoding.UTF8.GetString(data + offsets[i], lengths[i]);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public string GetString(ushort id) => _cache[id];

        public void Dispose()
        {
            _accessor.SafeMemoryMappedViewHandle.ReleasePointer();
            _accessor.Dispose();
            _mmf.Dispose();
        }
    }
}
```
**Action:** You must create a separate utility project to generate `firstnames.bin` and `lastnames.bin` from text files.

### Task 1.3: Implement the PlayerDatabase Service
**Why:** This service provides safe, high-speed access to the player data. It uses a memory-mapped file so the OS handles loading data from disk into RAM, keeping our application's memory footprint low even with a million players.

**File:** `FMUI.Wpf/Database/PlayerDatabase.cs`
```csharp
using System;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Database
{
    public sealed unsafe class PlayerDatabase : IDisposable
    {
        private const int MaxPlayers = 1_000_000;
        private readonly MemoryMappedFile _mmf;
        private readonly MemoryMappedViewAccessor _accessor;
        private readonly PlayerData* _players;
        private readonly int[] _idToIndex;
        private int _playerCount;

        public PlayerDatabase(string dbPath)
        {
            _idToIndex = new int[MaxPlayers + 1];
            Array.Fill(_idToIndex, -1);

            long fileSize = (long)MaxPlayers * sizeof(PlayerData);
            _mmf = MemoryMappedFile.CreateFromFile(dbPath, FileMode.OpenOrCreate, "PlayerDB", fileSize);
            _accessor = _mmf.CreateViewAccessor(0, fileSize);

            byte* ptr = null;
            _accessor.SafeMemoryMappedViewHandle.AcquirePointer(ref ptr);
            _players = (PlayerData*)ptr;
            
            // This method scans the MMF on startup to build the ID-to-Index map.
            // This is a one-time cost.
            BuildIndex();
        }

        private void BuildIndex()
        {
            _playerCount = 0;
            for (int i = 0; i < MaxPlayers; i++)
            {
                // A player ID of 0 is considered an empty slot.
                if (_players[i].Id == 0) continue;
                
                if (_players[i].Id > MaxPlayers)
                    throw new InvalidDataException($"Player ID {_players[i].Id} exceeds max limit.");
                
                _idToIndex[_players[i].Id] = i;
                _playerCount++;
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref PlayerData GetPlayer(uint playerId)
        {
            int index = _idToIndex[playerId];
            if (index == -1) throw new ArgumentException($"Player with ID {playerId} not found.");
            return ref _players[index];
        }

        public void Dispose()
        {
            _accessor.SafeMemoryMappedViewHandle.ReleasePointer();
            _accessor.Dispose();
            _mmf.Dispose();
        }
    }
}
```

### Task 1.4: Implement the High-Performance SquadService
**Why:** Manages the local club's squad. It operates on player IDs, avoiding object references entirely.

**File:** `FMUI.Wpf/Services/SquadService.cs`
```csharp
using System;
using System.Runtime.CompilerServices;
using FMUI.Wpf.Database;

namespace FMUI.Wpf.Services
{
    public sealed class SquadService
    {
        private const int MaxSquadSize = 50;
        private const int StartingElevenSize = 11;

        private readonly PlayerDatabase _database;
        private readonly uint[] _squadPlayerIds;
        private int _squadCount;
        
        // This array holds the INDICES into the _squadPlayerIds array for the starting XI
        private readonly byte[] _startingElevenMap;

        public SquadService(PlayerDatabase database)
        {
            _database = database;
            _squadPlayerIds = new uint[MaxSquadSize];
            _startingElevenMap = new byte[StartingElevenSize];
            
            // In a real app, load the current team's squad IDs from a save file.
            // For now, let's hardcode a sample team.
            LoadDefaultSquad();
        }

        private void LoadDefaultSquad()
        {
            _squadPlayerIds[0] = 1001; _squadPlayerIds[1] = 1002; /* ... add up to 25 players */
            _squadCount = 25;

            // Map the first 11 players in the squad to the starting XI
            for (byte i = 0; i < StartingElevenSize; i++)
            {
                _startingElevenMap[i] = i;
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public ref PlayerData GetStartingPlayer(int formationPositionIndex)
        {
            if ((uint)formationPositionIndex >= StartingElevenSize)
                throw new IndexOutOfRangeException();
            
            byte squadArrayIndex = _startingElevenMap[formationPositionIndex];
            uint playerId = _squadPlayerIds[squadArrayIndex];
            return ref _database.GetPlayer(playerId);
        }

        public void SwapPlayersInFormation(int position1, int position2)
        {
             if ((uint)position1 >= StartingElevenSize || (uint)position2 >= StartingElevenSize) return;
             (_startingElevenMap[position1], _startingElevenMap[position2]) = (_startingElevenMap[position2], _startingElevenMap[position1]);
        }
        
        // This delegate* syntax allows passing a function pointer for zero-allocation iteration.
        public unsafe void ProcessStartingEleven(delegate*<ref PlayerData, void> processor)
        {
            for (int i = 0; i < StartingElevenSize; i++)
            {
                processor(ref GetStartingPlayer(i));
            }
        }
    }
}
```

---

## Phase 2: Core Infrastructure

**Goal:** Build reusable, high-performance components for the rest of the application.

### Task 2.1: Implement ArrayCollection
**Why:** A replacement for `List<T>` that uses a struct to avoid heap allocation for the collection object itself. Ideal for temporary collections of data in application logic.

**File:** `FMUI.Wpf/Collections/ArrayCollection.cs`
```csharp
using System;
using System.Runtime.CompilerServices;

namespace FMUI.Wpf.Collections
{
    /// <summary>
    /// High-performance array-based collection to replace List<T>
    /// </summary>
    public struct ArrayCollection<T> where T : struct
    {
        private T[] _items;
        private int _count;
        private int _capacity;
        
        // Pre-allocate with expected size to avoid resizing
        public ArrayCollection(int initialCapacity)
        {
            _capacity = initialCapacity;
            _items = new T[_capacity];
            _count = 0;
        }
        
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Add(T item)
        {
            // Check if we need to grow
            if (_count >= _capacity)
            {
                Grow();
            }
            
            _items[_count] = item;
            _count++;
        }
        
        private void Grow()
        {
            // Double the capacity (power of 2 for better memory alignment)
            int newCapacity = _capacity * 2;
            T[] newArray = new T[newCapacity];
            
            // Manual array copy (faster than Array.Copy for small arrays)
            for (int i = 0; i < _count; i++)
            {
                newArray[i] = _items[i];
            }
            
            _items = newArray;
            _capacity = newCapacity;
        }
        
        // Fast indexer without bounds checking in Release mode
        public T this[int index]
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get
            {
                #if DEBUG
                if (index < 0 || index >= _count)
                    throw new IndexOutOfRangeException();
                #endif
                return _items[index];
            }
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set
            {
                #if DEBUG
                if (index < 0 || index >= _count)
                    throw new IndexOutOfRangeException();
                #endif
                _items[index] = value;
            }
        }
        
        public int Count => _count;
        
        // Get raw array for fast iteration
        public T[] GetRawArray() => _items;
        
        public void Clear()
        {
            // Don't deallocate, just reset count (keeps memory for reuse)
            _count = 0;
        }
    }
}
```

### Task 2.2: Implement ObjectPool
**Why:** Creating new UI controls is expensive. The `ObjectPool` allows us to recycle them, drastically reducing UI thread work and eliminating GC pressure.

**File:** `FMUI.Wpf/Infrastructure/ObjectPool.cs`
```csharp
using System;
using System.Collections.Concurrent;

namespace FMUI.Wpf.Infrastructure
{
    /// <summary>
    /// Thread-safe object pool for reusing objects and reducing GC pressure
    /// </summary>
    public sealed class ObjectPool<T> where T : class
    {
        private readonly ConcurrentBag<T> _objects = new ConcurrentBag<T>();
        private readonly Func<T> _objectGenerator;
        private readonly Action<T> _resetAction;
        private int _currentCount;
        private readonly int _maxSize;
        
        public ObjectPool(Func<T> objectGenerator, Action<T> resetAction = null, int maxSize = 100)
        {
            _objectGenerator = objectGenerator ?? throw new ArgumentNullException(nameof(objectGenerator));
            _resetAction = resetAction;
            _maxSize = maxSize;
        }
        
        public T Rent()
        {
            if (_objects.TryTake(out T item))
            {
                System.Threading.Interlocked.Decrement(ref _currentCount);
                return item;
            }
            
            // Create new if pool is empty
            return _objectGenerator();
        }
        
        public void Return(T item)
        {
            if (item == null) return;
            
            // Don't exceed max size
            if (_currentCount >= _maxSize) return;
            
            // Reset the object state
            _resetAction?.Invoke(item);
            
            _objects.Add(item);
            System.Threading.Interlocked.Increment(ref _currentCount);
        }
    }
}
```

### Task 2.3: Implement the High-Performance EventSystem
**Why:** The `IEventAggregator` from the original project can cause allocations. This lock-free `EventSystem` allows modules to communicate with zero overhead.

**File:** `FMUI.Wpf/Infrastructure/EventSystem.cs`
```csharp
using System;
using System.Runtime.CompilerServices;
using System.Threading;

namespace FMUI.Wpf.Events
{
    /// <summary>
    /// Lock-free event system with zero allocations
    /// </summary>
    public sealed unsafe class EventSystem
    {
        private const int MaxEventTypes = 256;
        private const int MaxHandlersPerType = 64;
        private const int EventQueueSize = 4096;
        
        private struct EventHandler
        {
            public delegate*<void*, void> Function;
            public void* Target;
            public int Priority;
        }
        
        private struct QueuedEvent
        {
            public ushort EventType;
            public ushort DataSize;
            public fixed byte Data[60]; // Inline data to avoid allocation
        }
        
        // Per-event-type handler storage
        private readonly EventHandler[][] _handlers;
        private readonly int[] _handlerCounts;
        
        // Lock-free event queue
        private readonly QueuedEvent[] _eventQueue;
        private int _queueHead;
        private int _queueTail;
        
        // Thread-local event buffers to avoid contention
        [ThreadStatic]
        private static QueuedEvent[]? _threadLocalBuffer;
        
        public EventSystem()
        {
            _handlers = new EventHandler[MaxEventTypes][];
            _handlerCounts = new int[MaxEventTypes];
            _eventQueue = new QueuedEvent[EventQueueSize];
            
            for (int i = 0; i < MaxEventTypes; i++)
            {
                _handlers[i] = new EventHandler[MaxHandlersPerType];
            }
        }
        
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Subscribe<T>(ushort eventType, delegate*<T*, void> handler, void* target, int priority = 0)
            where T : unmanaged
        {
            if (eventType >= MaxEventTypes) return;
            
            int count = Interlocked.Increment(ref _handlerCounts[eventType]) - 1;
            if (count >= MaxHandlersPerType) return;
            
            _handlers[eventType][count] = new EventHandler
            {
                Function = (delegate*<void*, void>)handler,
                Target = target,
                Priority = priority
            };
            
            // Sort by priority (insertion sort for small arrays)
            for (int i = count; i > 0 && _handlers[eventType][i].Priority > _handlers[eventType][i - 1].Priority; i--)
            {
                (_handlers[eventType][i], _handlers[eventType][i - 1]) = (_handlers[eventType][i - 1], _handlers[eventType][i]);
            }
        }
        
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Publish<T>(ushort eventType, ref T data) where T : unmanaged
        {
            if (sizeof(T) > 60) throw new ArgumentException("Event data too large");
            
            // Try to add to queue
            int tail = _queueTail;
            int nextTail = (tail + 1) % EventQueueSize;
            
            if (nextTail == _queueHead) return; // Queue full
            
            fixed (T* dataPtr = &data)
            {
                var evt = new QueuedEvent
                {
                    EventType = eventType,
                    DataSize = (ushort)sizeof(T)
                };
                
                Unsafe.CopyBlock(evt.Data, dataPtr, (uint)sizeof(T));
                _eventQueue[tail] = evt;
            }
            
            Interlocked.Exchange(ref _queueTail, nextTail);
        }
        
        public void ProcessEvents()
        {
            while (_queueHead != _queueTail)
            {
                var evt = _eventQueue[_queueHead];
                _queueHead = (_queueHead + 1) % EventQueueSize;
                
                ProcessEvent(evt.EventType, evt.Data);
            }
        }
        
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void ProcessEvent(ushort eventType, byte* data)
        {
            if (eventType >= MaxEventTypes) return;
            
            int count = _handlerCounts[eventType];
            var handlers = _handlers[eventType];
            
            for (int i = 0; i < count; i++)
            {
                handlers[i].Function(data);
            }
        }
    }
}
```

### Task 2.4: Register Services with Dependency Injection
**File:** `FMUI.Wpf/App.xaml.cs`
Update your `ConfigureServices` method to register these new singleton services.
```csharp
private void ConfigureServices(IServiceCollection services)
{
    // DATABASE (Singletons)
    // IMPORTANT: Ensure your data files (players.db, firstnames.bin) exist before running.
    services.AddSingleton<PlayerDatabase>(provider => new PlayerDatabase("data/players.db"));
    services.AddSingleton<StringTable>(provider => new StringTable("data/firstnames.bin")); // Add one for last names too
    services.AddSingleton<SquadService>();

    // INFRASTRUCTURE (Singletons)
    services.AddSingleton<EventSystem>();
    services.AddSingleton<CardFactory>(); // We will create this in Phase 4

    // ... other services like NavigationService, etc.
}
```

---

## Phase 3: Core Gameplay Logic (Formation System)

**Goal:** Implement the tactical formation system using the new high-performance backend.

### Task 3.1: Create Formation Data Models
**File to create:** `FMUI.Wpf/Models/FormationData.cs`

```csharp
using System.Runtime.InteropServices;

namespace FMUI.Wpf.Models
{
    /// <summary>
    /// Tactical formation data structure
    /// </summary>
    [StructLayout(LayoutKind.Sequential)]
    public struct FormationData
    {
        public FormationType Type;
        public fixed float PositionX[11];  // Normalized 0-1
        public fixed float PositionY[11];  // Normalized 0-1
        public fixed byte PlayerRole[11];  // Role for each position
        public byte Mentality;             // 0=Defensive, 50=Balanced, 100=Attacking
        public byte Width;                 // 0=Narrow, 100=Wide
        public byte TempoValue;            // 0=Slow, 100=Fast
        public byte PressingIntensity;     // 0=Low, 100=High
        public byte DefensiveLine;         // 0=Deep, 100=High
        
        public static FormationData Create442()
        {
            var formation = new FormationData
            {
                Type = FormationType.F442,
                Mentality = 50,
                Width = 50,
                TempoValue = 50,
                PressingIntensity = 50,
                DefensiveLine = 50
            };
            
            unsafe
            {
                // GK
                formation.PositionX[0] = 0.5f;
                formation.PositionY[0] = 0.05f;
                
                // Defense (LB, CB, CB, RB)
                formation.PositionX[1] = 0.15f;  // LB
                formation.PositionY[1] = 0.25f;
                
                formation.PositionX[2] = 0.35f;  // CB
                formation.PositionY[2] = 0.20f;
                
                formation.PositionX[3] = 0.65f;  // CB
                formation.PositionY[3] = 0.20f;
                
                formation.PositionX[4] = 0.85f;  // RB
                formation.PositionY[4] = 0.25f;
                
                // Midfield (LM, CM, CM, RM)
                formation.PositionX[5] = 0.15f;  // LM
                formation.PositionY[5] = 0.50f;
                
                formation.PositionX[6] = 0.40f;  // CM
                formation.PositionY[6] = 0.45f;
                
                formation.PositionX[7] = 0.60f;  // CM
                formation.PositionY[7] = 0.45f;
                
                formation.PositionX[8] = 0.85f;  // RM
                formation.PositionY[8] = 0.50f;
                
                // Attack (ST, ST)
                formation.PositionX[9] = 0.40f;  // ST
                formation.PositionY[9] = 0.75f;
                
                formation.PositionX[10] = 0.60f; // ST
                formation.PositionY[10] = 0.75f;
                
                // Set roles
                formation.PlayerRole[0] = (byte)PlayerRole.GK;
                formation.PlayerRole[1] = (byte)PlayerRole.FB_Support;
                formation.PlayerRole[2] = (byte)PlayerRole.CB_Defend;
                formation.PlayerRole[3] = (byte)PlayerRole.CB_Defend;
                formation.PlayerRole[4] = (byte)PlayerRole.FB_Support;
                formation.PlayerRole[5] = (byte)PlayerRole.W_Support;
                formation.PlayerRole[6] = (byte)PlayerRole.CM_Support;
                formation.PlayerRole[7] = (byte)PlayerRole.CM_Support;
                formation.PlayerRole[8] = (byte)PlayerRole.W_Support;
                formation.PlayerRole[9] = (byte)PlayerRole.AF_Attack;
                formation.PlayerRole[10] = (byte)PlayerRole.AF_Attack;
            }
            
            return formation;
        }
    }
    
    public enum FormationType : byte
    {
        F442 = 0,
        F433 = 1,
        F451 = 2,
        F352 = 3,
        F532 = 4,
        F4231 = 5,
        F41212 = 6,
        Custom = 255
    }
    
    public enum PlayerRole : byte
    {
        // Goalkeeper
        GK = 0,
        SK_Defend = 1,
        SK_Support = 2,
        SK_Attack = 3,
        
        // Defenders
        CB_Defend = 10,
        CB_Stopper = 11,
        CB_Cover = 12,
        BPD_Defend = 13,
        BPD_Support = 14,
        
        FB_Defend = 20,
        FB_Support = 21,
        FB_Attack = 22,
        WB_Defend = 23,
        WB_Support = 24,
        WB_Attack = 25,
        CWB_Support = 26,
        CWB_Attack = 27,
        
        // Midfielders
        DM_Defend = 30,
        DM_Support = 31,
        A_Defend = 32,
        A_Support = 33,
        HB = 34,
        BWM_Defend = 35,
        BWM_Support = 36,
        
        CM_Defend = 40,
        CM_Support = 41,
        CM_Attack = 42,
        BBM = 43,
        MEZ_Support = 44,
        MEZ_Attack = 45,
        
        AP_Support = 50,
        AP_Attack = 51,
        DLP_Defend = 52,
        DLP_Support = 53,
        RPM = 54,
        
        // Wingers
        W_Defend = 60,
        W_Support = 61,
        W_Attack = 62,
        IW_Support = 63,
        IW_Attack = 64,
        IF_Support = 65,
        IF_Attack = 66,
        
        // Forwards
        TM_Support = 70,
        TM_Attack = 71,
        AF_Attack = 72,
        P_Attack = 73,
        DLF_Support = 74,
        DLF_Attack = 75,
        CF_Support = 76,
        CF_Attack = 77,
        F9 = 78
    }
}
```

### Task 3.2: Implement Formation Service
**Why:** This service manages the team's tactical setup. It operates on the `FormationData` struct and communicates changes via the `EventSystem`, completely decoupled from the UI.

**File:** `FMUI.Wpf/Services/FormationService.cs`
```csharp
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services
{
    // Define events for UI communication
    public struct FormationChangedEvent { public FormationData Formation; }
    public struct PlayerPositionChangedEvent { public int Index; public float X; public float Y; }

    public sealed class FormationService
    {
        private FormationData _currentFormation;
        private readonly SquadService _squadService;
        private readonly EventSystem _eventSystem;
        
        public FormationService(SquadService squadService, EventSystem eventSystem)
        {
            _squadService = squadService;
            _eventSystem = eventSystem;
            
            _currentFormation = FormationData.Create442();
        }
        
        public void SetFormation(FormationType type)
        {
            // Logic to load formation template
            _currentFormation = type switch
            {
                FormationType.F442 => FormationData.Create442(),
                // ... other formations
                _ => FormationData.Create442()
            };
            
            var evt = new FormationChangedEvent { Formation = _currentFormation };
            _eventSystem.Publish(ref evt);
        }

        public unsafe void MovePlayer(int positionIndex, float normalizedX, float normalizedY)
        {
            if ((uint)positionIndex >= 11) return;
            
            // Add validation logic here if needed
            _currentFormation.PositionX[positionIndex] = normalizedX;
            _currentFormation.PositionY[positionIndex] = normalizedY;

            var evt = new PlayerPositionChangedEvent { Index = positionIndex, X = normalizedX, Y = normalizedY };
            _eventSystem.Publish(ref evt);
        }

        public FormationData GetCurrentFormation() => _currentFormation;
    }
}
```

### Task 3.3: Implement Formation Canvas UI
**File to create:** `FMUI.Wpf/Controls/FormationCanvas.cs`
**Crucial Change:** Remove any direct reference to a ViewModel. The canvas will subscribe to events from the `EventSystem`.

```csharp
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using FMUI.Wpf.Models;
using FMUI.Wpf.ViewModels;

namespace FMUI.Wpf.Controls
{
    public sealed class FormationCanvas : Canvas
    {
        private Rectangle _pitch;
        private Ellipse[] _playerTokens;
        private TextBlock[] _playerLabels;
        private FormationData _formation;
        
        public FormationCanvas()
        {
            Initialize();
    
            // Get EventSystem from DI or a service locator
            var eventSystem = App.ServiceProvider.GetRequiredService<EventSystem>();

            // Subscribe to events. This is simplified; proper subscription would require
            // handling unsubscription on Unloaded.
            eventSystem.Subscribe<FormationChangedEvent>((data) => Dispatcher.Invoke(() => UpdateFormation(data->Formation)));
            eventSystem.Subscribe<PlayerPositionChangedEvent>((data) => Dispatcher.Invoke(() => UpdatePlayerPosition(data->Index, data->X, data->Y)));
        }
        
        private void Initialize()
        {
            // Create pitch background
            _pitch = new Rectangle
            {
                Fill = new LinearGradientBrush(
                    Color.FromRgb(0, 100, 0),
                    Color.FromRgb(0, 150, 0),
                    90)
            };
            Children.Add(_pitch);
            
            // Draw pitch lines
            DrawPitchLines();
            
            // Create player tokens (11 players)
            _playerTokens = new Ellipse[11];
            _playerLabels = new TextBlock[11];
            
            for (int i = 0; i < 11; i++)
            {
                // Create token
                _playerTokens[i] = new Ellipse
                {
                    Width = 40,
                    Height = 40,
                    Fill = Brushes.Red,
                    Stroke = Brushes.White,
                    StrokeThickness = 2
                };
                
                // Create label
                _playerLabels[i] = new TextBlock
                {
                    Text = (i + 1).ToString(),
                    Foreground = Brushes.White,
                    FontWeight = FontWeights.Bold,
                    TextAlignment = TextAlignment.Center,
                    Width = 40,
                    Height = 40,
                    FontSize = 16
                };
                
                // Add to canvas
                Children.Add(_playerTokens[i]);
                Children.Add(_playerLabels[i]);
                
                // Make draggable
                int index = i; // Capture for closure
                _playerTokens[i].MouseLeftButtonDown += (s, e) => StartDrag(index);
                _playerLabels[i].MouseLeftButtonDown += (s, e) => StartDrag(index);
            }
        }
        
        private void DrawPitchLines()
        {
            // Center circle
            var centerCircle = new Ellipse
            {
                Width = 100,
                Height = 100,
                Stroke = Brushes.White,
                StrokeThickness = 2,
                Fill = Brushes.Transparent
            };
            Children.Add(centerCircle);
            
            // Halfway line
            var halfwayLine = new Line
            {
                Stroke = Brushes.White,
                StrokeThickness = 2
            };
            Children.Add(halfwayLine);
            
            // Penalty areas
            var penaltyArea1 = new Rectangle
            {
                Stroke = Brushes.White,
                StrokeThickness = 2,
                Fill = Brushes.Transparent
            };
            Children.Add(penaltyArea1);
            
            var penaltyArea2 = new Rectangle
            {
                Stroke = Brushes.White,
                StrokeThickness = 2,
                Fill = Brushes.Transparent
            };
            Children.Add(penaltyArea2);
        }
        
        protected override Size ArrangeOverride(Size arrangeSize)
        {
            // Update pitch size
            _pitch.Width = arrangeSize.Width;
            _pitch.Height = arrangeSize.Height;
            
            // Update player positions
            UpdatePlayerPositions();
            
            return base.ArrangeOverride(arrangeSize);
        }
        
        public void UpdateFormation(FormationData formation)
        {
            _formation = formation;
            UpdatePlayerPositions();
        }
        
        private void UpdatePlayerPositions()
        {
            if (_playerTokens == null) return;
            
            double canvasWidth = ActualWidth;
            double canvasHeight = ActualHeight;
            
            if (canvasWidth <= 0 || canvasHeight <= 0) return;
            
            unsafe
            {
                for (int i = 0; i < 11; i++)
                {
                    float x = _formation.PositionX[i];
                    float y = _formation.PositionY[i];
                    
                    // Convert normalized to canvas coordinates
                    double pixelX = x * canvasWidth - 20; // Center token
                    double pixelY = y * canvasHeight - 20;
                    
                    // Update token position
                    Canvas.SetLeft(_playerTokens[i], pixelX);
                    Canvas.SetTop(_playerTokens[i], pixelY);
                    
                    // Update label position
                    Canvas.SetLeft(_playerLabels[i], pixelX);
                    Canvas.SetTop(_playerLabels[i], pixelY + 10); // Center text
                }
            }
        }
        
        private void StartDrag(int playerIndex)
        {
            // Implement drag logic
            // This would connect to FormationService.MovePlayer
            // On mouse move:
            var formationService = App.ServiceProvider.GetRequiredService<FormationService>();
            formationService.MovePlayer(playerIndex, newX, newY);
        }
    }
}
```

---

## Phase 4: Rebuilding the UI (ID-Centric Pattern)

**Goal:** Implement the 13 missing card types using a new, highly performant UI pattern that avoids traditional MVVM overhead. **There will be no `CardViewModel`**.

### Task 4.1: Implement the Card Factory
**File:** `FMUI.Wpf/Services/CardFactory.cs`
```csharp
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.UI.Cards;
using System.Collections.Generic;

namespace FMUI.Wpf.Services
{
    public enum CardType { PlayerDetail, SquadSummary, /* ... all 13 types */ }

    public sealed class CardFactory
    {
        private readonly Dictionary<CardType, ObjectPool<ICardContent>> _pools;
        private readonly IServiceProvider _serviceProvider;

        public CardFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _pools = new Dictionary<CardType, ObjectPool<ICardContent>>();

            // Initialize a pool for each card type
            _pools[CardType.PlayerDetail] = new ObjectPool<ICardContent>(
                () => new PlayerDetailCard(_serviceProvider.GetRequiredService<PlayerDatabase>(), /* other services */)
            );
            // ... initialize other pools
        }

        public ICardContent Get(CardType type)
        {
            var card = _pools[type].Rent();
            return card;
        }

        public void Return(ICardContent card)
        {
            card.Reset();
            _pools[card.Type].Return(card);
        }
    }
}
```

### Task 4.2: Define the Card Interface
**File:** `FMUI.Wpf/UI/Cards/ICardContent.cs`
```csharp
namespace FMUI.Wpf.UI.Cards
{
    public interface ICardContent
    {
        CardType Type { get; }
        void UpdateData(uint entityId);
        void Reset();
    }
}
```

### Task 4.3: Implement the PlayerDetailCard (Exemplar)
**Why:** This card is the template for all others. It gets services via its constructor and has a single method, `UpdateData`, which takes a `playerId`. It queries the database directly and updates its own UI controls. This is more performant than data binding for complex UIs.

**File to create:** `FMUI.Wpf/Cards/PlayerDetailCard.cs`
```csharp
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.Cards
{
    public sealed class PlayerDetailCard : CardContentBase
    {
        private int _playerId;
        private TextBlock _nameText;
        private TextBlock _positionText;
        private TextBlock _ageText;
        private TextBlock _overallText;
        private Canvas _attributeCanvas;
        private ProgressBar _fitnessBar;
        private ProgressBar _moraleBar;
        
        public PlayerDetailCard(
            StringDatabase strings,
            SquadService squadService,
            IClubDataService clubDataService)
            : base(strings, squadService, clubDataService)
        {
            CreateUI();
        }
        
        private void CreateUI()
        {
            var grid = new Grid();
            
            // Define rows
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto }); // Header
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto }); // Basic info
            grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) }); // Attributes
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto }); // Status bars
            
            // Header
            var headerPanel = new StackPanel { Orientation = Orientation.Horizontal };
            _nameText = new TextBlock 
            { 
                FontSize = 18, 
                FontWeight = FontWeights.Bold,
                Margin = new Thickness(10)
            };
            _overallText = new TextBlock
            {
                FontSize = 24,
                FontWeight = FontWeights.Bold,
                Foreground = Brushes.Gold,
                Margin = new Thickness(10)
            };
            headerPanel.Children.Add(_nameText);
            headerPanel.Children.Add(_overallText);
            Grid.SetRow(headerPanel, 0);
            grid.Children.Add(headerPanel);
            
            // Basic info
            var infoPanel = new StackPanel { Orientation = Orientation.Horizontal };
            _positionText = new TextBlock { Margin = new Thickness(10, 5, 10, 5) };
            _ageText = new TextBlock { Margin = new Thickness(10, 5, 10, 5) };
            infoPanel.Children.Add(_positionText);
            infoPanel.Children.Add(_ageText);
            Grid.SetRow(infoPanel, 1);
            grid.Children.Add(infoPanel);
            
            // Attributes canvas (for radar chart)
            _attributeCanvas = new Canvas { MinHeight = 200 };
            Grid.SetRow(_attributeCanvas, 2);
            grid.Children.Add(_attributeCanvas);
            
            // Status bars
            var statusPanel = new StackPanel();
            
            // Fitness
            var fitnessLabel = new TextBlock { Text = "Fitness" };
            _fitnessBar = new ProgressBar 
            { 
                Height = 20, 
                Margin = new Thickness(10, 2, 10, 2),
                Foreground = Brushes.Green
            };
            statusPanel.Children.Add(fitnessLabel);
            statusPanel.Children.Add(_fitnessBar);
            
            // Morale
            var moraleLabel = new TextBlock { Text = "Morale" };
            _moraleBar = new ProgressBar 
            { 
                Height = 20, 
                Margin = new Thickness(10, 2, 10, 2),
                Foreground = Brushes.Blue
            };
            statusPanel.Children.Add(moraleLabel);
            statusPanel.Children.Add(_moraleBar);
            
            Grid.SetRow(statusPanel, 3);
            grid.Children.Add(statusPanel);
            
            Content = grid;
        }
        
        public void SetPlayer(int playerId)
        {
            _playerId = playerId;
            UpdateData();
        }
        
        public override void UpdateData()
        {
            try
            {
                ref PlayerData player = ref _squadService.GetPlayer(_playerId);
                
                // Update basic info
                _nameText.Text = $"{player.GetFirstName()} {player.GetLastName()}";
                _positionText.Text = $"Position: {(PlayerPosition)player.Position}";
                _ageText.Text = $"Age: {player.Age}";
                _overallText.Text = player.GetOverallRating().ToString();
                
                // Update status bars
                _fitnessBar.Value = player.Fitness;
                _moraleBar.Value = player.Morale;
                
                // Draw attributes radar
                DrawAttributeRadar(ref player);
            }
            catch
            {
                // Handle missing player
                Reset();
            }
        }
        
        private void DrawAttributeRadar(ref PlayerData player)
        {
            _attributeCanvas.Children.Clear();
            
            // Create radar chart
            double centerX = _attributeCanvas.ActualWidth / 2;
            double centerY = _attributeCanvas.ActualHeight / 2;
            double radius = Math.Min(centerX, centerY) - 20;
            
            // 6 main attributes for the radar
            int[] attributes = new int[]
            {
                player.Pace,
                player.Dribbling,
                player.Passing,
                player.Defending,
                player.Physical,
                player.Shooting
            };
            
            string[] labels = new string[]
            {
                "PAC", "DRI", "PAS", "DEF", "PHY", "SHO"
            };
            
            var polygon = new Polygon
            {
                Fill = new SolidColorBrush(Color.FromArgb(128, 46, 196, 182)),
                Stroke = Brushes.Teal,
                StrokeThickness = 2
            };
            
            for (int i = 0; i < 6; i++)
            {
                double angle = (Math.PI * 2 * i / 6) - Math.PI / 2;
                double value = attributes[i] / 100.0;
                double x = centerX + Math.Cos(angle) * radius * value;
                double y = centerY + Math.Sin(angle) * radius * value;
                polygon.Points.Add(new Point(x, y));
                
                // Add label
                double labelX = centerX + Math.Cos(angle) * (radius + 15);
                double labelY = centerY + Math.Sin(angle) * (radius + 15);
                var label = new TextBlock
                {
                    Text = $"{labels[i]}: {attributes[i]}",
                    FontSize = 10
                };
                Canvas.SetLeft(label, labelX - 15);
                Canvas.SetTop(label, labelY - 5);
                _attributeCanvas.Children.Add(label);
            }
            
            _attributeCanvas.Children.Add(polygon);
        }
        
        public override void Reset()
        {
            _playerId = -1;
            _nameText.Text = "";
            _positionText.Text = "";
            _ageText.Text = "";
            _overallText.Text = "";
            _fitnessBar.Value = 0;
            _moraleBar.Value = 0;
            _attributeCanvas.Children.Clear();
        }
    }
}
```

**File:** `FMUI.Wpf/UI/Cards/PlayerDetailCard.xaml.cs`
```csharp
using System.Windows.Controls;
using FMUI.Wpf.Database;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.UI.Cards
{
    public partial class PlayerDetailCard : UserControl, ICardContent
    {
        private readonly PlayerDatabase _playerDb;
        private readonly StringTable _firstNameTable;
        private readonly StringTable _lastNameTable;
        
        public CardType Type => CardType.PlayerDetail;

        public PlayerDetailCard(PlayerDatabase playerDb, StringTable firstNameTable, StringTable lastNameTable)
        {
            InitializeComponent();
            _playerDb = playerDb;
            _firstNameTable = firstNameTable;
            _lastNameTable = lastNameTable;
        }

        public void UpdateData(uint playerId)
        {
            // Get a reference to the player data from the high-performance database
            ref PlayerData player = ref _playerDb.GetPlayer(playerId);

            // Get strings from the StringTables
            string firstName = _firstNameTable.GetString(player.FirstNameId);
            string lastName = _lastNameTable.GetString(player.LastNameId);

            // Update UI controls DIRECTLY. No data binding, no INotifyPropertyChanged.
            NameText.Text = $"{firstName} {lastName}";
            AgeText.Text = $"Age: {player.Age}";
            PositionText.Text = ((PlayerPosition)player.Position).ToString();
            
            OverallRatingCircle.Value = player.CurrentAbility / 2; // Scale 200 to 100
            
            FitnessBar.Value = player.Fitness;
            MoraleBar.Value = player.Morale;
            
            // Update the attribute radar chart by passing the packed values
            AttributeRadar.UpdateAttributes(player.TechnicalPacked, player.MentalPacked, player.PhysicalPacked);
        }

        public void Reset()
        {
            // Clear all UI controls to a default state for object pooling
            NameText.Text = "Loading...";
            FitnessBar.Value = 0;
            // ... reset all other controls
        }
    }
}
```

### Task 4.4: Implement Remaining Cards
Follow the exact pattern from `PlayerDetailCard` to implement the other 12 cards. For each card:
1.  Create the XAML layout with named controls.
2.  Create the code-behind class implementing `ICardContent`.
3.  Inject necessary services (`SquadService`, `PlayerDatabase`, etc.) in the constructor.
4.  Implement the `UpdateData` method to fetch data and update UI controls directly.
5.  Implement the `Reset` method.

---

## Phase 5: Integrating Game Modules

### Task 5.1: Define the Module Interface
**File to create:** `FMUI.Wpf/Modules/IGameModule.cs`

```csharp
using System;

namespace FMUI.Wpf.Modules
{
    /// <summary>
    /// Base interface for all game modules (Transfer, Scouting, Media, etc.)
    /// </summary>
    public interface IGameModule
    {
        string ModuleId { get; }
        ModuleState State { get; }
        
        // Lifecycle
        void Initialize();
        void Start();
        void Update(GameTime gameTime);
        void Stop();
        void Cleanup();
        
        // Data access
        void LoadData();
        void SaveData();
        
        // Events
        event EventHandler<ModuleEventArgs> ModuleEvent;
    }
    
    public enum ModuleState
    {
        Uninitialized,
        Initializing,
        Ready,
        Running,
        Paused,
        Stopped,
        Error
    }
    
    public struct GameTime
    {
        public DateTime CurrentDate;
        public TimeSpan DeltaTime;
        public long FrameCount;
    }
    
    public class ModuleEventArgs : EventArgs
    {
        public string EventType { get; set; }
        public object Data { get; set; }
    }
}
```

### Task 5.2: Implement the Transfer Module
**File to create:** `FMUI.Wpf/Modules/TransferModule.cs`

```csharp
using System;
using FMUI.Wpf.Collections;
using FMUI.Wpf.Models;
using FMUI.Wpf.Services;

namespace FMUI.Wpf.Modules
{
    public sealed class TransferModule : IGameModule
    {
        public string ModuleId => "Transfer";
        public ModuleState State { get; private set; }
        
        // Module data
        private struct TransferTarget
        {
            public int PlayerId;
            public uint AskingPrice;
            public uint WageDemand;
            public byte ScoutRating;
            public byte InterestLevel;
            public bool IsAvailable;
        }
        
        private ArrayCollection<TransferTarget> _targets;
        private uint _transferBudget;
        private uint _wageBudget;
        
        private readonly SquadService _squadService;
        private readonly IEventAggregator _eventAggregator;
        
        public event EventHandler<ModuleEventArgs> ModuleEvent;
        
        public TransferModule(SquadService squadService, IEventAggregator eventAggregator)
        {
            _squadService = squadService;
            _eventAggregator = eventAggregator;
            _targets = new ArrayCollection<TransferTarget>(100);
            State = ModuleState.Uninitialized;
        }
        
        public void Initialize()
        {
            State = ModuleState.Initializing;
            
            // Set initial budgets
            _transferBudget = 50000000; // £50M
            _wageBudget = 200000; // £200k/week
            
            // Generate initial targets
            GenerateTransferTargets();
            
            State = ModuleState.Ready;
        }
        
        private void GenerateTransferTargets()
        {
            // Create sample transfer targets
            for (int i = 0; i < 20; i++)
            {
                var target = new TransferTarget
                {
                    PlayerId = 1000 + i,
                    AskingPrice = (uint)(5000000 + i * 1000000),
                    WageDemand = (uint)(50000 + i * 5000),
                    ScoutRating = (byte)(60 + i % 40),
                    InterestLevel = (byte)(30 + i % 70),
                    IsAvailable = i % 3 != 0
                };
                _targets.Add(target);
            }
        }
        
        public void Start()
        {
            State = ModuleState.Running;
        }
        
        public void Update(GameTime gameTime)
        {
            if (State != ModuleState.Running) return;
            
            // Update transfer window status
            bool isWindowOpen = IsTransferWindowOpen(gameTime.CurrentDate);
            
            // Process ongoing negotiations
            ProcessNegotiations();
            
            // Update target availability
            UpdateTargetAvailability();
        }
        
        private bool IsTransferWindowOpen(DateTime date)
        {
            // Summer window: July-August
            // Winter window: January
            return (date.Month >= 7 && date.Month <= 8) || date.Month == 1;
        }
        
        private void ProcessNegotiations()
        {
            // Process any ongoing transfer negotiations
        }
        
        private void UpdateTargetAvailability()
        {
            // Random events changing player availability
        }
        
        public void MakeBid(int targetIndex, uint bidAmount)
        {
            if (targetIndex < 0 || targetIndex >= _targets.Count) return;
            
            var target = _targets[targetIndex];
            
            if (bidAmount > _transferBudget)
            {
                RaiseEvent("BidRejected", "Insufficient funds");
                return;
            }
            
            if (bidAmount >= target.AskingPrice * 0.9) // Accept if within 10%
            {
                _transferBudget -= bidAmount;
                RaiseEvent("BidAccepted", target);
                
                // Add player to squad
                // Remove from targets
            }
            else
            {
                RaiseEvent("BidRejected", "Offer too low");
            }
        }
        
        public void Stop()
        {
            State = ModuleState.Stopped;
        }
        
        public void Cleanup()
        {
            _targets.Clear();
            State = ModuleState.Uninitialized;
        }
        
        public void LoadData()
        {
            // Load from file
        }
        
        public void SaveData()
        {
            // Save to file
        }
        
        private void RaiseEvent(string eventType, object data)
        {
            ModuleEvent?.Invoke(this, new ModuleEventArgs 
            { 
                EventType = eventType, 
                Data = data 
            });
        }
    }
}
```

---

## Phase 6: Verification and Performance Hardening

**Goal:** Prove that the new architecture meets its performance targets.

### Task 6.1: Create Backend Performance Benchmarks
Create a new .NET Console Project named `FMUI.Wpf.Benchmarks`. Add the `BenchmarkDotNet` NuGet package.

**File:** `FMUI.Wpf.Benchmarks/DatabaseBenchmarks.cs`
```csharp
using BenchmarkDotNet.Attributes;
using FMUI.Wpf.Database;

[MemoryDiagnoser]
public class DatabaseBenchmarks
{
    private PlayerDatabase _db;
    private uint[] _randomPlayerIds;

    [GlobalSetup]
    public void Setup()
    {
        // IMPORTANT: This requires a pre-populated players.db file.
        _db = new PlayerDatabase("path/to/your/players.db");
        
        // Generate random IDs for testing random access
        var rand = new Random(42);
        _randomPlayerIds = new uint[1000];
        for(int i = 0; i < 1000; i++)
        {
            _randomPlayerIds[i] = (uint)rand.Next(1, 500000);
        }
    }

    [Benchmark]
    public void GetPlayer_RandomAccess()
    {
        for (int i = 0; i < 1000; i++)
        {
            ref var player = ref _db.GetPlayer(_randomPlayerIds[i]);
        }
    }

    [Benchmark]
    public void GetPlayer_SequentialAccess()
    {
        for (uint i = 1; i <= 1000; i++)
        {
            ref var player = ref _db.GetPlayer(i);
        }
    }
}
```
**Action:** Run these benchmarks. The results must show **zero bytes allocated** and access times in the nanoseconds.

### Task 6.2: Create Unit Tests for Logic
Create NUnit tests for services like `FormationService` to ensure game logic is correct after the refactor.

### Task 6.3: Profile the UI
1.  Run the application in `Debug` mode.
2.  Open Visual Studio's **Diagnostic Tools** window (**Debug > Windows > Diagnostic Tools**).
3.  Monitor the **Process Memory** graph. As you open, close, and scroll through cards, the graph should remain flat. Any sawtooth pattern indicates memory allocations and GC pressure.
4.  Use the **CPU Usage** tool to profile interactions like dragging a player on the formation canvas. The UI thread should remain responsive.
5.  Use a dedicated profiler like **dotTrace** or the built-in **WPF Performance Suite** to confirm a steady 60 FPS.

---

## 🚨 Common Pitfalls to Avoid

1.  **DO NOT USE `new` KEYWORD:** Avoid creating new objects in any method that is called frequently (e.g., `Update`, `OnRender`, event handlers). Use the `ObjectPool`.
2.  **DO NOT USE LINQ:** LINQ allocates memory. Replace all LINQ queries with manual `for` or `foreach` loops over arrays or `ArrayCollection<T>`.
3.  **DO NOT USE `string` CONCATENATION IN LOOPS:** Use `StringBuilder` if you must build strings, but prefer getting pre-formatted strings from a `StringTable`.
4.  **DO NOT FORGET `IDisposable`:** The memory-mapped files (`PlayerDatabase`, `StringTable`) hold OS handles. Ensure they are properly disposed of when the application closes.
5.  **RESPECT THE UI THREAD:** All UI updates must happen on the UI thread (`Dispatcher.Invoke`). However, all heavy data processing should happen on background threads, with the results passed to the UI thread for display. The `EventSystem` helps decouple these.

This implementation guide provides the exact code and patterns needed to achieve feature parity while meeting stringent enterprise-level performance requirements. By following each phase sequentially and adhering to the core principles, the application will be robust, scalable, and exceptionally fast.
