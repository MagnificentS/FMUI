/**
 * Football Manager Player Data Module
 * Central database and squad management
 * File size: <800 lines
 */

// Squad Roster Data
const SQUAD_ROSTER = [
    // Starting XI Players
    { id: 1, name: 'Andre Onana', position: 'GK', number: 1, nationality: 'CMR', age: 28, rating: 85, condition: 95, morale: 78 },
    { id: 2, name: 'Diogo Dalot', position: 'RB', number: 20, nationality: 'POR', age: 25, rating: 78, condition: 88, morale: 82 },
    { id: 3, name: 'Luke Shaw', position: 'LB', number: 23, nationality: 'ENG', age: 29, rating: 82, condition: 72, morale: 69 },
    { id: 4, name: 'Raphael Varane', position: 'CB', number: 19, nationality: 'FRA', age: 31, rating: 84, condition: 90, morale: 78 },
    { id: 5, name: 'Lisandro Martinez', position: 'CB', number: 6, nationality: 'ARG', age: 26, rating: 86, condition: 94, morale: 85 },
    { id: 6, name: 'Casemiro', position: 'DM', number: 18, nationality: 'BRA', age: 32, rating: 88, condition: 85, morale: 72 },
    { id: 7, name: 'Kobbie Mainoo', position: 'CM', number: 37, nationality: 'ENG', age: 19, rating: 76, condition: 92, morale: 88 },
    { id: 8, name: 'Bruno Fernandes', position: 'AM', number: 8, nationality: 'POR', age: 29, rating: 89, condition: 88, morale: 74 },
    { id: 9, name: 'Marcus Rashford', position: 'LW', number: 10, nationality: 'ENG', age: 26, rating: 85, condition: 78, morale: 66 },
    { id: 10, name: 'Alejandro Garnacho', position: 'RW', number: 17, nationality: 'ARG', age: 20, rating: 79, condition: 91, morale: 81 },
    { id: 11, name: 'Rasmus Hojlund', position: 'ST', number: 11, nationality: 'DEN', age: 21, rating: 81, condition: 89, morale: 83 },
    
    // Bench Players
    { id: 12, name: 'Tom Heaton', position: 'GK', number: 22, nationality: 'ENG', age: 38, rating: 72, condition: 85, morale: 70 },
    { id: 13, name: 'Harry Maguire', position: 'CB', number: 5, nationality: 'ENG', age: 31, rating: 78, condition: 87, morale: 65 },
    { id: 14, name: 'Aaron Wan-Bissaka', position: 'RB', number: 29, nationality: 'ENG', age: 26, rating: 76, condition: 89, morale: 72 },
    { id: 15, name: 'Mason Mount', position: 'CM', number: 7, nationality: 'ENG', age: 25, rating: 77, condition: 83, morale: 68 },
    { id: 16, name: 'Antony', position: 'RW', number: 21, nationality: 'BRA', age: 24, rating: 75, condition: 86, morale: 71 },
    { id: 17, name: 'Anthony Martial', position: 'ST', number: 9, nationality: 'FRA', age: 28, rating: 76, condition: 71, morale: 63 },
    { id: 18, name: 'Christian Eriksen', position: 'CM', number: 14, nationality: 'DEN', age: 32, rating: 80, condition: 88, morale: 75 },
    { id: 19, name: 'Amad Diallo', position: 'RW', number: 16, nationality: 'CIV', age: 22, rating: 74, condition: 92, morale: 77 },
    { id: 20, name: 'Scott McTominay', position: 'CM', number: 39, nationality: 'SCO', age: 27, rating: 75, condition: 87, morale: 73 },
    { id: 21, name: 'Altay Bayindir', position: 'GK', number: 1, nationality: 'TUR', age: 26, rating: 73, condition: 89, morale: 74 },
    { id: 22, name: 'Victor Lindelof', position: 'CB', number: 2, nationality: 'SWE', age: 30, rating: 77, condition: 84, morale: 67 },
    { id: 23, name: 'Tyrell Malacia', position: 'LB', number: 12, nationality: 'NED', age: 25, rating: 74, condition: 65, morale: 45 },
    { id: 24, name: 'Sofyan Amrabat', position: 'DM', number: 4, nationality: 'MAR', age: 28, rating: 76, condition: 88, morale: 71 },
    { id: 25, name: 'Facundo Pellistri', position: 'RW', number: 28, nationality: 'URU', age: 22, rating: 71, condition: 90, morale: 79 },
    { id: 26, name: 'Hannibal Mejbri', position: 'CM', number: 46, nationality: 'TUN', age: 21, rating: 69, condition: 93, morale: 82 },
    { id: 27, name: 'Sergio Reguilon', position: 'LB', number: 15, nationality: 'ESP', age: 27, rating: 75, condition: 86, morale: 73 }
];

// Central Formation Database - Single Source of Truth
let centralFormationDB = {
    currentPhase: 'attacking',
    players: [
        { index: 0, id: 1, name: 'Onana', position: 'GK', role: 'SK', number: 1, tacticalPos: { x: 34, y: 98 } },
        { index: 1, id: 3, name: 'Shaw', position: 'LB', role: 'WB', number: 23, tacticalPos: { x: 10, y: 82 } },
        { index: 2, id: 4, name: 'Varane', position: 'CB', role: 'BPD', number: 19, tacticalPos: { x: 22, y: 86 } },
        { index: 3, id: 5, name: 'Martinez', position: 'CB', role: 'CD', number: 6, tacticalPos: { x: 46, y: 86 } },
        { index: 4, id: 2, name: 'Dalot', position: 'RB', role: 'WB', number: 20, tacticalPos: { x: 58, y: 82 } },
        { index: 5, id: 6, name: 'Casemiro', position: 'DM', role: 'DLP', number: 18, tacticalPos: { x: 26, y: 70 } },
        { index: 6, id: 7, name: 'Mainoo', position: 'CM', role: 'BBM', number: 37, tacticalPos: { x: 42, y: 70 } },
        { index: 7, id: 9, name: 'Rashford', position: 'LW', role: 'IF', number: 10, tacticalPos: { x: 10, y: 38 } },
        { index: 8, id: 8, name: 'Bruno', position: 'AM', role: 'AP', number: 8, tacticalPos: { x: 34, y: 50 } },
        { index: 9, id: 10, name: 'Garnacho', position: 'RW', role: 'W', number: 17, tacticalPos: { x: 58, y: 38 } },
        { index: 10, id: 11, name: 'Hojlund', position: 'ST', role: 'CF', number: 11, tacticalPos: { x: 34, y: 18 } }
    ]
};

// Squad Slots Structure (matching central database indices)
let globalSquadSlots = [
    // Starting XI slots (1-11) - MUST match central DB order
    { id: 1, position: 'GK', role: 'SK', assignedPlayer: null },
    { id: 2, position: 'LB', role: 'WB', assignedPlayer: null },
    { id: 3, position: 'CB', role: 'BPD', assignedPlayer: null },
    { id: 4, position: 'CB', role: 'CD', assignedPlayer: null },
    { id: 5, position: 'RB', role: 'WB', assignedPlayer: null },
    { id: 6, position: 'DM', role: 'DLP', assignedPlayer: null },
    { id: 7, position: 'CM', role: 'BBM', assignedPlayer: null },
    { id: 8, position: 'LW', role: 'IF', assignedPlayer: null },
    { id: 9, position: 'AM', role: 'AP', assignedPlayer: null },
    { id: 10, position: 'RW', role: 'W', assignedPlayer: null },
    { id: 11, position: 'ST', role: 'CF', assignedPlayer: null },
    // Substitute slots (12-22)
    { id: 12, position: 'Sub01', role: '', assignedPlayer: null },
    { id: 13, position: 'Sub02', role: '', assignedPlayer: null },
    { id: 14, position: 'Sub03', role: '', assignedPlayer: null },
    { id: 15, position: 'Sub04', role: '', assignedPlayer: null },
    { id: 16, position: 'Sub05', role: '', assignedPlayer: null },
    { id: 17, position: 'Sub06', role: '', assignedPlayer: null },
    { id: 18, position: 'Sub07', role: '', assignedPlayer: null },
    { id: 19, position: 'Sub08', role: '', assignedPlayer: null },
    { id: 20, position: 'Sub09', role: '', assignedPlayer: null },
    { id: 21, position: 'Sub10', role: '', assignedPlayer: null },
    { id: 22, position: 'Sub11', role: '', assignedPlayer: null }
];

// Grid Configuration
const GRID_CONFIG = {
    columns: 37,
    rows: 19, 
    cellSize: 32,
    gap: 8,
    paddingV: 8,
    defaultCardWidth: 8,
    defaultCardHeight: 5
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

// Export all configuration
window.FM_SQUAD_ROSTER = SQUAD_ROSTER;
window.FM_CENTRAL_DB = centralFormationDB;
window.FM_SQUAD_SLOTS = globalSquadSlots;