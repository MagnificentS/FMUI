/**
 * Football Manager Configuration Module
 * All constants, colors, and configuration data
 * File size: <500 lines
 */

// Grid and Tactical Configuration
const TACTICAL_CONFIG = {
    GRID_SIZE: 4, // 4 meters per grid square
    PITCH: {
        WIDTH: 68, // meters
        HEIGHT: 108, // meters
        VIEWBOX: "0 -1 68 109"
    },
    PLAYER: {
        RADIUS: 2.25,
        STROKE_WIDTH: 0.3,
        FONTS: {
            NUMBER: 2,
            NAME: 2.2,
            POSITION: 2.4
        }
    }
};

// Position-based Color System
const POSITION_COLORS = {
    GK: { primary: '#FFcc00', secondary: '#CCA300', shadow: 'rgba(255,204,0,0.4)' },
    LB: { primary: '#0096CC', secondary: '#0078A3', shadow: 'rgba(0,150,204,0.4)' },
    CB: { primary: '#0096CC', secondary: '#0078A3', shadow: 'rgba(0,150,204,0.4)' },
    RB: { primary: '#0096CC', secondary: '#0078A3', shadow: 'rgba(0,150,204,0.4)' },
    DM: { primary: '#00E078', secondary: '#00B862', shadow: 'rgba(0,224,120,0.4)' },
    CM: { primary: '#00E078', secondary: '#00B862', shadow: 'rgba(0,224,120,0.4)' },
    AM: { primary: '#00E078', secondary: '#00B862', shadow: 'rgba(0,224,120,0.4)' },
    LW: { primary: '#FF0032', secondary: '#CC0029', shadow: 'rgba(255,0,50,0.4)' },
    RW: { primary: '#FF0032', secondary: '#CC0029', shadow: 'rgba(255,0,50,0.4)' },
    ST: { primary: '#FF0032', secondary: '#CC0029', shadow: 'rgba(255,0,50,0.4)' }
};

// Morale Configuration (5-direction system)
const MORALE_CONFIG = {
    DELIGHTED: { min: 80, color: '#008080', rotation: '0deg' },
    HAPPY: { min: 60, color: '#00ff00', rotation: '45deg' },
    CONTENT: { min: 40, color: '#ffff00', rotation: '90deg' },
    UNHAPPY: { min: 20, color: '#ff8800', rotation: '135deg' },
    DEJECTED: { min: 0, color: '#ff0000', rotation: '180deg' }
};

// Layout Configuration
const LAYOUT_CONFIG = {
    FORMATION_DETAILS: '0 0 30%',
    TACTICAL_COLUMN: '0 0 30%',
    PLAYER_SELECTION: '0 0 40%'
};

// Squad Configuration
const SQUAD_CONFIG = {
    STARTING_XI: 11,
    SUBSTITUTES: 11,
    TOTAL_SLOTS: 22,
    SLOT_HEIGHT: '42px'
};

// Role Options by Position
const ROLE_OPTIONS = {
    GK: ['SK'],
    LB: ['WB', 'BPD', 'CD'],
    CB: ['BPD', 'CD'], 
    RB: ['WB', 'BPD', 'CD'],
    DM: ['DLP', 'BBM'],
    CM: ['BBM', 'DLP', 'AP'],
    AM: ['AP', 'IF'],
    LW: ['IF', 'W'],
    RW: ['W', 'IF'],
    ST: ['CF']
};

// Utility Functions
function getPositionColor(position) {
    return POSITION_COLORS[position?.toUpperCase()] || POSITION_COLORS.CM;
}

function getPositionColorVariable(position) {
    const colors = getPositionColor(position);
    return colors.primary;
}

function getRoleDropdownColor(position) {
    const colors = getPositionColor(position);
    return colors.secondary;
}

function getPositionClass(position) {
    const pos = position?.toUpperCase();
    if (pos === 'GK') return 'goalkeeper';
    if (['CB', 'LB', 'RB', 'WB'].includes(pos)) return 'defender';
    if (['CM', 'DM', 'AM'].includes(pos)) return 'midfielder';
    if (['ST', 'CF', 'LW', 'RW'].includes(pos)) return 'forward';
    return 'midfielder';
}

// Export for use in other modules
window.FM_CONFIG = {
    TACTICAL_CONFIG,
    POSITION_COLORS,
    MORALE_CONFIG,
    LAYOUT_CONFIG,
    SQUAD_CONFIG,
    ROLE_OPTIONS,
    getPositionColor,
    getPositionColorVariable,
    getRoleDropdownColor,
    getPositionClass
};