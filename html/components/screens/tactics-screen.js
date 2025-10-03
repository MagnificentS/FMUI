/* ==========================================
   TACTICS SCREEN - Formation & Instructions
   ========================================== */

window.TacticsScreen = {
    currentFormation: '4-2-3-1',
    formations: {
        '4-4-2': { defenders: 4, midfielders: 4, attackers: 2, shape: 'flat' },
        '4-3-3': { defenders: 4, midfielders: 3, attackers: 3, shape: 'attacking' },
        '4-2-3-1': { defenders: 4, midfielders: 5, attackers: 1, shape: 'balanced' },
        '3-5-2': { defenders: 3, midfielders: 5, attackers: 2, shape: 'wingback' },
        '5-3-2': { defenders: 5, midfielders: 3, attackers: 2, shape: 'defensive' },
        '4-1-2-1-2': { defenders: 4, midfielders: 4, attackers: 2, shape: 'diamond' }
    },

    teamInstructions: {
        mentality: 'Balanced',
        tempo: 'Normal',
        width: 'Fairly Wide',
        passingDirectness: 'Mixed',
        defensiveLine: 'Normal',
        pressingIntensity: 'Medium',
        timewasting: 'Sometimes'
    },

    playerRoles: {
        GK: ['Sweeper Keeper', 'Traditional Keeper'],
        DC: ['Ball Playing Defender', 'No-Nonsense Centre Back', 'Libero'],
        DL: ['Complete Wing Back', 'Defensive Full Back', 'Inverted Wing Back'],
        DR: ['Complete Wing Back', 'Defensive Full Back', 'Inverted Wing Back'],
        DM: ['Deep Lying Playmaker', 'Anchor Man', 'Ball Winning Midfielder'],
        CM: ['Box to Box', 'Mezzala', 'Central Midfielder'],
        AM: ['Advanced Playmaker', 'Shadow Striker', 'Attacking Midfielder'],
        AML: ['Inside Forward', 'Winger', 'Wide Playmaker'],
        AMR: ['Inside Forward', 'Winger', 'Wide Playmaker'],
        ST: ['Complete Forward', 'Target Man', 'Pressing Forward', 'False 9']
    },

    selectedLineup: {
        GK: { player: 'De Gea', role: 'Sweeper Keeper', duty: 'Support' },
        DL: { player: 'Shaw', role: 'Complete Wing Back', duty: 'Attack' },
        DC1: { player: 'Varane', role: 'Ball Playing Defender', duty: 'Defend' },
        DC2: { player: 'Martinez', role: 'No-Nonsense Centre Back', duty: 'Defend' },
        DR: { player: 'Dalot', role: 'Complete Wing Back', duty: 'Support' },
        DM1: { player: 'Casemiro', role: 'Anchor Man', duty: 'Defend' },
        DM2: { player: 'Eriksen', role: 'Deep Lying Playmaker', duty: 'Support' },
        AML: { player: 'Rashford', role: 'Inside Forward', duty: 'Attack' },
        AMC: { player: 'Bruno', role: 'Advanced Playmaker', duty: 'Attack' },
        AMR: { player: 'Antony', role: 'Winger', duty: 'Attack' },
        ST: { player: 'Højlund', role: 'Complete Forward', duty: 'Support' }
    },

    renderTacticsView() {
        return `
            <div class="tactics-container">
                <div class="tactics-sidebar">
                    <div class="formation-selector">
                        <h3>Formation</h3>
                        <select onchange="TacticsScreen.changeFormation(this.value)" value="${this.currentFormation}">
                            ${Object.keys(this.formations).map(f => 
                                `<option value="${f}" ${f === this.currentFormation ? 'selected' : ''}>${f}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="team-instructions">
                        <h3>Team Instructions</h3>
                        <div class="instruction-group">
                            <label>Mentality</label>
                            <select onchange="TacticsScreen.updateInstruction('mentality', this.value)">
                                <option>Very Defensive</option>
                                <option>Defensive</option>
                                <option selected>Balanced</option>
                                <option>Attacking</option>
                                <option>Very Attacking</option>
                            </select>
                        </div>
                        <div class="instruction-group">
                            <label>Tempo</label>
                            <input type="range" min="0" max="100" value="50" onchange="TacticsScreen.updateTempo(this.value)">
                            <span class="tempo-label">Normal</span>
                        </div>
                        <div class="instruction-group">
                            <label>Width</label>
                            <input type="range" min="0" max="100" value="60" onchange="TacticsScreen.updateWidth(this.value)">
                            <span class="width-label">Fairly Wide</span>
                        </div>
                        <div class="instruction-group">
                            <label>Passing</label>
                            <select onchange="TacticsScreen.updateInstruction('passingDirectness', this.value)">
                                <option>Short</option>
                                <option selected>Mixed</option>
                                <option>Direct</option>
                                <option>Long Ball</option>
                            </select>
                        </div>
                        <div class="instruction-group">
                            <label>Defensive Line</label>
                            <input type="range" min="0" max="100" value="50" onchange="TacticsScreen.updateDefensiveLine(this.value)">
                            <span class="line-label">Normal</span>
                        </div>
                        <div class="instruction-group">
                            <label>Pressing</label>
                            <select onchange="TacticsScreen.updateInstruction('pressingIntensity', this.value)">
                                <option>Very Low</option>
                                <option>Low</option>
                                <option selected>Medium</option>
                                <option>High</option>
                                <option>Extremely Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div class="preset-tactics">
                        <h3>Preset Tactics</h3>
                        <button onclick="TacticsScreen.loadPreset('tiki-taka')">Tiki-Taka</button>
                        <button onclick="TacticsScreen.loadPreset('gegenpress')">Gegenpress</button>
                        <button onclick="TacticsScreen.loadPreset('counter')">Counter Attack</button>
                        <button onclick="TacticsScreen.loadPreset('wing-play')">Wing Play</button>
                        <button onclick="TacticsScreen.loadPreset('park-bus')">Park the Bus</button>
                    </div>
                </div>
                
                <div class="tactics-main">
                    <div class="pitch-container">
                        <div class="pitch">
                            ${this.renderPitch()}
                        </div>
                        <div class="bench-area">
                            <h4>Substitutes</h4>
                            <div class="bench-players">
                                <div class="bench-player">Heaton (GK)</div>
                                <div class="bench-player">Maguire (DC)</div>
                                <div class="bench-player">Wan-Bissaka (DR)</div>
                                <div class="bench-player">McTominay (CM)</div>
                                <div class="bench-player">Mount (AM)</div>
                                <div class="bench-player">Sancho (AML)</div>
                                <div class="bench-player">Martial (ST)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="player-instructions">
                        <h3>Individual Instructions</h3>
                        <div class="selected-player-info">
                            <span>Select a player on the pitch to set individual instructions</span>
                        </div>
                    </div>
                </div>
                
                <div class="tactics-analysis">
                    <h3>Tactical Analysis</h3>
                    <div class="analysis-cards">
                        <div class="analysis-card">
                            <h4>Strengths</h4>
                            <ul>
                                <li>Good width from wing backs</li>
                                <li>Strong defensive midfield screen</li>
                                <li>Creative options in final third</li>
                            </ul>
                        </div>
                        <div class="analysis-card">
                            <h4>Weaknesses</h4>
                            <ul>
                                <li>Vulnerable to counter attacks</li>
                                <li>Gaps between midfield lines</li>
                                <li>Over-reliance on wing play</li>
                            </ul>
                        </div>
                        <div class="analysis-card">
                            <h4>Key Partnerships</h4>
                            <ul>
                                <li>Bruno ↔ Højlund</li>
                                <li>Casemiro ↔ Eriksen</li>
                                <li>Shaw ↔ Rashford</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderPitch() {
        const positions = this.getFormationPositions(this.currentFormation);
        return `
            <div class="pitch-lines">
                <div class="center-circle"></div>
                <div class="penalty-area top"></div>
                <div class="penalty-area bottom"></div>
                <div class="goal-area top"></div>
                <div class="goal-area bottom"></div>
                <div class="halfway-line"></div>
            </div>
            <div class="formation-positions">
                ${positions.map(pos => this.renderPosition(pos)).join('')}
            </div>
        `;
    },

    renderPosition(pos) {
        const player = this.selectedLineup[pos.key] || { player: 'Empty', role: 'None', duty: 'None' };
        const roleAbbr = this.getRoleAbbreviation(player.role);
        const dutyClass = player.duty.toLowerCase();
        
        return `
            <div class="pitch-position ${dutyClass}" 
                 style="left: ${pos.x}%; top: ${pos.y}%;"
                 onclick="TacticsScreen.selectPlayer('${pos.key}')"
                 data-position="${pos.key}">
                <div class="player-marker">
                    <div class="player-number">${pos.number || ''}</div>
                    <div class="player-name">${player.player}</div>
                    <div class="player-role">${roleAbbr}</div>
                </div>
            </div>
        `;
    },

    getFormationPositions(formation) {
        const positions = {
            '4-2-3-1': [
                { key: 'GK', x: 50, y: 90, number: 1 },
                { key: 'DL', x: 15, y: 70, number: 3 },
                { key: 'DC1', x: 35, y: 75, number: 4 },
                { key: 'DC2', x: 65, y: 75, number: 5 },
                { key: 'DR', x: 85, y: 70, number: 2 },
                { key: 'DM1', x: 35, y: 55, number: 6 },
                { key: 'DM2', x: 65, y: 55, number: 8 },
                { key: 'AML', x: 20, y: 35, number: 11 },
                { key: 'AMC', x: 50, y: 35, number: 10 },
                { key: 'AMR', x: 80, y: 35, number: 7 },
                { key: 'ST', x: 50, y: 15, number: 9 }
            ],
            '4-3-3': [
                { key: 'GK', x: 50, y: 90, number: 1 },
                { key: 'DL', x: 15, y: 70, number: 3 },
                { key: 'DC1', x: 35, y: 75, number: 4 },
                { key: 'DC2', x: 65, y: 75, number: 5 },
                { key: 'DR', x: 85, y: 70, number: 2 },
                { key: 'CM1', x: 30, y: 50, number: 6 },
                { key: 'CM2', x: 50, y: 45, number: 8 },
                { key: 'CM3', x: 70, y: 50, number: 10 },
                { key: 'LW', x: 20, y: 25, number: 11 },
                { key: 'ST', x: 50, y: 15, number: 9 },
                { key: 'RW', x: 80, y: 25, number: 7 }
            ],
            '4-4-2': [
                { key: 'GK', x: 50, y: 90, number: 1 },
                { key: 'DL', x: 15, y: 70, number: 3 },
                { key: 'DC1', x: 35, y: 75, number: 4 },
                { key: 'DC2', x: 65, y: 75, number: 5 },
                { key: 'DR', x: 85, y: 70, number: 2 },
                { key: 'ML', x: 15, y: 45, number: 11 },
                { key: 'CM1', x: 35, y: 50, number: 6 },
                { key: 'CM2', x: 65, y: 50, number: 8 },
                { key: 'MR', x: 85, y: 45, number: 7 },
                { key: 'ST1', x: 35, y: 20, number: 9 },
                { key: 'ST2', x: 65, y: 20, number: 10 }
            ]
        };
        
        return positions[formation] || positions['4-2-3-1'];
    },

    getRoleAbbreviation(role) {
        const abbr = {
            'Sweeper Keeper': 'SK',
            'Traditional Keeper': 'GK',
            'Ball Playing Defender': 'BPD',
            'No-Nonsense Centre Back': 'NCB',
            'Complete Wing Back': 'CWB',
            'Defensive Full Back': 'FB',
            'Inverted Wing Back': 'IWB',
            'Deep Lying Playmaker': 'DLP',
            'Anchor Man': 'A',
            'Ball Winning Midfielder': 'BWM',
            'Box to Box': 'B2B',
            'Mezzala': 'MEZ',
            'Central Midfielder': 'CM',
            'Advanced Playmaker': 'AP',
            'Shadow Striker': 'SS',
            'Attacking Midfielder': 'AM',
            'Inside Forward': 'IF',
            'Winger': 'W',
            'Wide Playmaker': 'WP',
            'Complete Forward': 'CF',
            'Target Man': 'TM',
            'Pressing Forward': 'PF',
            'False 9': 'F9'
        };
        return abbr[role] || role.substring(0, 3);
    },

    selectPlayer(positionKey) {
        const player = this.selectedLineup[positionKey];
        if (!player) return;
        
        const instructionsDiv = document.querySelector('.selected-player-info');
        instructionsDiv.innerHTML = `
            <div class="player-instruction-panel">
                <h4>${player.player} - ${positionKey}</h4>
                <div class="instruction-row">
                    <label>Role:</label>
                    <select onchange="TacticsScreen.updatePlayerRole('${positionKey}', this.value)">
                        ${this.playerRoles[this.getPositionType(positionKey)].map(role => 
                            `<option ${role === player.role ? 'selected' : ''}>${role}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="instruction-row">
                    <label>Duty:</label>
                    <select onchange="TacticsScreen.updatePlayerDuty('${positionKey}', this.value)">
                        <option ${player.duty === 'Defend' ? 'selected' : ''}>Defend</option>
                        <option ${player.duty === 'Support' ? 'selected' : ''}>Support</option>
                        <option ${player.duty === 'Attack' ? 'selected' : ''}>Attack</option>
                    </select>
                </div>
                <div class="instruction-toggles">
                    <label><input type="checkbox"> Take More Risks</label>
                    <label><input type="checkbox"> Shoot More Often</label>
                    <label><input type="checkbox"> Move Into Channels</label>
                    <label><input type="checkbox"> Hold Position</label>
                    <label><input type="checkbox"> Get Forward</label>
                    <label><input type="checkbox"> Stay Wider</label>
                </div>
            </div>
        `;
    },

    getPositionType(positionKey) {
        if (positionKey === 'GK') return 'GK';
        if (positionKey.includes('DC')) return 'DC';
        if (positionKey === 'DL') return 'DL';
        if (positionKey === 'DR') return 'DR';
        if (positionKey.includes('DM')) return 'DM';
        if (positionKey.includes('CM')) return 'CM';
        if (positionKey.includes('AM')) return 'AM';
        if (positionKey === 'AML' || positionKey === 'ML' || positionKey === 'LW') return 'AML';
        if (positionKey === 'AMR' || positionKey === 'MR' || positionKey === 'RW') return 'AMR';
        if (positionKey.includes('ST')) return 'ST';
        return 'CM';
    },

    changeFormation(formation) {
        this.currentFormation = formation;
        document.querySelector('.pitch').innerHTML = this.renderPitch();
    },

    updateInstruction(key, value) {
        this.teamInstructions[key] = value;
        console.log(`Updated ${key} to ${value}`);
    },

    updateTempo(value) {
        const labels = ['Very Slow', 'Slow', 'Normal', 'High', 'Extremely High'];
        const index = Math.floor(value / 25);
        document.querySelector('.tempo-label').textContent = labels[index];
    },

    updateWidth(value) {
        const labels = ['Very Narrow', 'Narrow', 'Standard', 'Fairly Wide', 'Very Wide'];
        const index = Math.floor(value / 25);
        document.querySelector('.width-label').textContent = labels[index];
    },

    updateDefensiveLine(value) {
        const labels = ['Very Deep', 'Deep', 'Normal', 'High', 'Very High'];
        const index = Math.floor(value / 25);
        document.querySelector('.line-label').textContent = labels[index];
    },

    loadPreset(preset) {
        const presets = {
            'tiki-taka': {
                mentality: 'Attacking',
                tempo: 75,
                width: 40,
                passingDirectness: 'Short',
                defensiveLine: 75,
                pressingIntensity: 'High'
            },
            'gegenpress': {
                mentality: 'Very Attacking',
                tempo: 90,
                width: 60,
                passingDirectness: 'Mixed',
                defensiveLine: 90,
                pressingIntensity: 'Extremely Urgent'
            },
            'counter': {
                mentality: 'Defensive',
                tempo: 60,
                width: 50,
                passingDirectness: 'Direct',
                defensiveLine: 25,
                pressingIntensity: 'Low'
            },
            'wing-play': {
                mentality: 'Balanced',
                tempo: 50,
                width: 90,
                passingDirectness: 'Mixed',
                defensiveLine: 50,
                pressingIntensity: 'Medium'
            },
            'park-bus': {
                mentality: 'Very Defensive',
                tempo: 25,
                width: 30,
                passingDirectness: 'Long Ball',
                defensiveLine: 10,
                pressingIntensity: 'Very Low'
            }
        };
        
        const settings = presets[preset];
        if (settings) {
            Object.assign(this.teamInstructions, settings);
            this.updateUI();
            console.log(`Loaded ${preset} preset`);
        }
    },

    updateUI() {
        // Update UI elements to reflect new settings
        const container = document.querySelector('.tactics-container');
        if (container) {
            container.innerHTML = this.renderTacticsView();
        }
    },

    updatePlayerRole(positionKey, role) {
        this.selectedLineup[positionKey].role = role;
        this.updateUI();
    },

    updatePlayerDuty(positionKey, duty) {
        this.selectedLineup[positionKey].duty = duty;
        this.updateUI();
    }
};

// Add Tactics screen styles
const tacticsStyles = `
<style>
.tactics-container {
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    height: 100%;
    background: var(--neutral-200);
    gap: 20px;
    padding: 20px;
}

.tactics-sidebar {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
    overflow-y: auto;
}

.formation-selector select {
    width: 100%;
    padding: 8px;
    background: var(--neutral-400);
    border: 1px solid var(--neutral-500);
    color: white;
    margin-top: 10px;
}

.team-instructions {
    margin-top: 30px;
}

.instruction-group {
    margin-bottom: 15px;
}

.instruction-group label {
    display: block;
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
}

.instruction-group select,
.instruction-group input[type="range"] {
    width: 100%;
    padding: 5px;
    background: var(--neutral-400);
    border: 1px solid var(--neutral-500);
    color: white;
}

.preset-tactics {
    margin-top: 30px;
}

.preset-tactics button {
    display: block;
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
    background: var(--primary-300);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    transition: background 0.2s;
}

.preset-tactics button:hover {
    background: var(--primary-400);
}

.tactics-main {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.pitch-container {
    background: var(--neutral-300);
    border-radius: 5px;
    padding: 20px;
}

.pitch {
    position: relative;
    width: 100%;
    height: 500px;
    background: linear-gradient(180deg, #2a7f2a 0%, #1f5f1f 50%, #2a7f2a 100%);
    border: 2px solid white;
    border-radius: 5px;
    overflow: hidden;
}

.pitch-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.center-circle {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 2px solid white;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.penalty-area {
    position: absolute;
    width: 40%;
    height: 80px;
    border: 2px solid white;
    left: 30%;
}

.penalty-area.top {
    top: 0;
    border-top: none;
}

.penalty-area.bottom {
    bottom: 0;
    border-bottom: none;
}

.goal-area {
    position: absolute;
    width: 20%;
    height: 40px;
    border: 2px solid white;
    left: 40%;
}

.goal-area.top {
    top: 0;
    border-top: none;
}

.goal-area.bottom {
    bottom: 0;
    border-bottom: none;
}

.halfway-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: white;
    top: 50%;
}

.formation-positions {
    position: absolute;
    inset: 0;
}

.pitch-position {
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.3s;
}

.player-marker {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--primary-400);
    border: 3px solid white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: all 0.2s;
}

.pitch-position:hover .player-marker {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.pitch-position.defend .player-marker {
    background: #3b82f6;
}

.pitch-position.support .player-marker {
    background: #10b981;
}

.pitch-position.attack .player-marker {
    background: #ef4444;
}

.player-number {
    font-size: 16px;
    font-weight: bold;
    color: white;
}

.player-name {
    font-size: 9px;
    color: white;
    white-space: nowrap;
}

.player-role {
    font-size: 8px;
    color: rgba(255,255,255,0.8);
    font-weight: bold;
}

.bench-area {
    background: var(--neutral-300);
    padding: 15px;
    border-radius: 5px;
    margin-top: 10px;
}

.bench-players {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.bench-player {
    padding: 5px 10px;
    background: var(--neutral-400);
    border-radius: 3px;
    font-size: 12px;
    cursor: move;
}

.player-instructions {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.selected-player-info {
    color: #aaa;
    font-size: 14px;
}

.player-instruction-panel {
    background: var(--neutral-400);
    padding: 15px;
    border-radius: 5px;
}

.instruction-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.instruction-row select {
    width: 60%;
    padding: 5px;
    background: var(--neutral-500);
    border: 1px solid var(--neutral-600);
    color: white;
}

.instruction-toggles {
    margin-top: 15px;
}

.instruction-toggles label {
    display: block;
    margin-bottom: 8px;
    font-size: 12px;
}

.instruction-toggles input[type="checkbox"] {
    margin-right: 8px;
}

.tactics-analysis {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
    overflow-y: auto;
}

.analysis-cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
}

.analysis-card {
    background: var(--neutral-400);
    padding: 15px;
    border-radius: 5px;
}

.analysis-card h4 {
    color: var(--primary-400);
    margin-bottom: 10px;
    font-size: 14px;
}

.analysis-card ul {
    list-style: none;
    padding: 0;
}

.analysis-card li {
    padding: 5px 0;
    font-size: 12px;
    color: #ccc;
}

.analysis-card li:before {
    content: '→ ';
    color: var(--primary-400);
    font-weight: bold;
}
</style>
`;

// Inject styles when module loads
if (!document.getElementById('tactics-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'tactics-styles';
    styleElement.innerHTML = tacticsStyles;
    document.head.appendChild(styleElement.firstElementChild);
}