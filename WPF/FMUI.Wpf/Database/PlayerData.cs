using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace FMUI.Wpf.Database
{
    public enum PlayerPosition : byte
    {
        GK,
        CB,
        LB,
        RB,
        DM,
        CM,
        AM,
        LW,
        RW,
        ST,
        Unspecified
    }

    public enum SquadRole : byte
    {
        KeyPlayer,
        FirstTeam,
        Rotation,
        Backup,
        HotProspect,
        Youth,
        Unspecified
    }

    [StructLayout(LayoutKind.Sequential, Pack = 1, Size = 64)]
    public unsafe struct PlayerData
    {
        private const uint AttributeMask = 0xFu;

        // Identity (8 bytes)
        public uint Id;
        public ushort FirstNameId;
        public ushort LastNameId;

        // Packed Attributes (8 bytes)
        public uint TechnicalPacked;
        public uint MentalPacked;

        // Physical & Status (8 bytes)
        public uint PhysicalPacked;
        public byte Age;
        public byte Position;
        public byte Fitness;
        public byte Morale;

        // Performance (8 bytes)
        public ushort MatchesPlayed;
        public ushort Goals;
        public ushort Assists;
        public byte AverageRating;
        public byte Form;

        // Contract & Financial (8 bytes)
        public uint WeeklySalaryPacked;
        public ushort ContractExpiryYear;
        public byte SquadRole;
        public byte NationalityId;

        // Team & Tactical (8 bytes)
        public ushort ClubId;
        public byte SquadNumber;
        public byte PreferredFoot;
        private fixed byte _reserved1[4];

        // Potential & Development (8 bytes)
        public byte CurrentAbility;
        public byte PotentialAbility;
        private fixed byte _reserved2[6];

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public byte GetTechnicalAttribute(int index)
        {
            return (byte)((TechnicalPacked >> (index * 4)) & AttributeMask);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void SetTechnicalAttribute(int index, byte value)
        {
            uint mask = ~(AttributeMask << (index * 4));
            TechnicalPacked = (TechnicalPacked & mask) | ((uint)(value & AttributeMask) << (index * 4));
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public byte GetMentalAttribute(int index)
        {
            return (byte)((MentalPacked >> (index * 4)) & AttributeMask);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void SetMentalAttribute(int index, byte value)
        {
            uint mask = ~(AttributeMask << (index * 4));
            MentalPacked = (MentalPacked & mask) | ((uint)(value & AttributeMask) << (index * 4));
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public byte GetPhysicalAttribute(int index)
        {
            return (byte)((PhysicalPacked >> (index * 4)) & AttributeMask);
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void SetPhysicalAttribute(int index, byte value)
        {
            uint mask = ~(AttributeMask << (index * 4));
            PhysicalPacked = (PhysicalPacked & mask) | ((uint)(value & AttributeMask) << (index * 4));
        }
    }
}

