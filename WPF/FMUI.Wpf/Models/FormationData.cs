using System.Runtime.InteropServices;

namespace FMUI.Wpf.Models;

/// <summary>
/// Tactical formation data structure backed by contiguous arrays for cache-friendly access.
/// </summary>
[StructLayout(LayoutKind.Sequential)]
public struct FormationData
{
    public FormationType Type;
    public unsafe fixed float PositionX[11];
    public unsafe fixed float PositionY[11];
    public unsafe fixed byte PlayerRole[11];
    public byte Mentality;
    public byte Width;
    public byte TempoValue;
    public byte PressingIntensity;
    public byte DefensiveLine;

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
            // Goalkeeper
            formation.PositionX[0] = 0.5f;
            formation.PositionY[0] = 0.05f;
            formation.PlayerRole[0] = (byte)PlayerRole.GK;

            // Defence
            formation.PositionX[1] = 0.15f;
            formation.PositionY[1] = 0.25f;
            formation.PlayerRole[1] = (byte)PlayerRole.FB_Support;

            formation.PositionX[2] = 0.35f;
            formation.PositionY[2] = 0.20f;
            formation.PlayerRole[2] = (byte)PlayerRole.CB_Defend;

            formation.PositionX[3] = 0.65f;
            formation.PositionY[3] = 0.20f;
            formation.PlayerRole[3] = (byte)PlayerRole.CB_Defend;

            formation.PositionX[4] = 0.85f;
            formation.PositionY[4] = 0.25f;
            formation.PlayerRole[4] = (byte)PlayerRole.FB_Support;

            // Midfield
            formation.PositionX[5] = 0.15f;
            formation.PositionY[5] = 0.50f;
            formation.PlayerRole[5] = (byte)PlayerRole.W_Support;

            formation.PositionX[6] = 0.40f;
            formation.PositionY[6] = 0.45f;
            formation.PlayerRole[6] = (byte)PlayerRole.CM_Support;

            formation.PositionX[7] = 0.60f;
            formation.PositionY[7] = 0.45f;
            formation.PlayerRole[7] = (byte)PlayerRole.CM_Support;

            formation.PositionX[8] = 0.85f;
            formation.PositionY[8] = 0.50f;
            formation.PlayerRole[8] = (byte)PlayerRole.W_Support;

            // Attack
            formation.PositionX[9] = 0.40f;
            formation.PositionY[9] = 0.75f;
            formation.PlayerRole[9] = (byte)PlayerRole.AF_Attack;

            formation.PositionX[10] = 0.60f;
            formation.PositionY[10] = 0.75f;
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
    GK = 0,
    SK_Defend = 1,
    SK_Support = 2,
    SK_Attack = 3,

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

    W_Defend = 60,
    W_Support = 61,
    W_Attack = 62,
    IW_Support = 63,
    IW_Attack = 64,
    IF_Support = 65,
    IF_Attack = 66,

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
