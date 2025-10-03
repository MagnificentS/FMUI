/* ==========================================
   SQUAD SCREEN - Detailed Football Manager Style
   ========================================== */

window.SquadScreen = {
    players: [
        // Goalkeepers
        { id: 1, name: "David de Gea", position: "GK", age: 32, nationality: "Spain", value: "£25M", wage: "£150k", contract: "2025", 
          attributes: { handling: 18, reflexes: 19, positioning: 17, kicking: 15, communication: 16 },
          form: 7.42, morale: "Good", fitness: 95, sharpness: 88 },
        { id: 2, name: "Tom Heaton", position: "GK", age: 37, nationality: "England", value: "£2M", wage: "£45k", contract: "2024",
          attributes: { handling: 14, reflexes: 13, positioning: 15, kicking: 12, communication: 15 },
          form: 6.21, morale: "Okay", fitness: 88, sharpness: 75 },
        
        // Defenders
        { id: 3, name: "Raphaël Varane", position: "DC", age: 30, nationality: "France", value: "£35M", wage: "£180k", contract: "2025",
          attributes: { marking: 17, tackling: 16, positioning: 18, heading: 17, pace: 15 },
          form: 7.65, morale: "Superb", fitness: 92, sharpness: 90, injured: false },
        { id: 4, name: "Lisandro Martínez", position: "DC", age: 25, nationality: "Argentina", value: "£50M", wage: "£120k", contract: "2027",
          attributes: { marking: 16, tackling: 18, positioning: 16, heading: 14, pace: 14 },
          form: 7.89, morale: "Superb", fitness: 96, sharpness: 94 },
        { id: 5, name: "Luke Shaw", position: "DL", age: 28, nationality: "England", value: "£28M", wage: "£150k", contract: "2026",
          attributes: { crossing: 15, tackling: 14, positioning: 15, pace: 16, stamina: 15 },
          form: 7.12, morale: "Good", fitness: 78, sharpness: 82, injured: "Hamstring - 2 weeks" },
        { id: 6, name: "Diogo Dalot", position: "DR", age: 24, nationality: "Portugal", value: "£22M", wage: "£85k", contract: "2026",
          attributes: { crossing: 14, tackling: 13, positioning: 14, pace: 17, stamina: 16 },
          form: 6.98, morale: "Good", fitness: 94, sharpness: 88 },
        
        // Midfielders
        { id: 7, name: "Casemiro", position: "DM", age: 31, nationality: "Brazil", value: "£45M", wage: "£200k", contract: "2026",
          attributes: { tackling: 18, positioning: 19, passing: 16, vision: 15, leadership: 18 },
          form: 7.78, morale: "Superb", fitness: 91, sharpness: 89 },
        { id: 8, name: "Bruno Fernandes", position: "AM", age: 29, nationality: "Portugal", value: "£65M", wage: "£240k", contract: "2027",
          attributes: { passing: 18, vision: 19, technique: 17, longshots: 17, leadership: 17 },
          form: 8.12, morale: "Superb", fitness: 93, sharpness: 95, captain: true },
        { id: 9, name: "Christian Eriksen", position: "CM", age: 31, nationality: "Denmark", value: "£15M", wage: "£150k", contract: "2025",
          attributes: { passing: 18, vision: 17, technique: 17, longshots: 15, freekicks: 18 },
          form: 7.01, morale: "Good", fitness: 87, sharpness: 85 },
        { id: 10, name: "Scott McTominay", position: "CM", age: 27, nationality: "Scotland", value: "£25M", wage: "£100k", contract: "2026",
          attributes: { tackling: 14, positioning: 13, passing: 13, workrate: 17, stamina: 16 },
          form: 6.65, morale: "Okay", fitness: 95, sharpness: 87 },
        
        // Wingers
        { id: 11, name: "Marcus Rashford", position: "AML", age: 26, nationality: "England", value: "£85M", wage: "£200k", contract: "2028",
          attributes: { pace: 19, dribbling: 17, finishing: 16, technique: 16, flair: 17 },
          form: 7.95, morale: "Superb", fitness: 96, sharpness: 93 },
        { id: 12, name: "Antony", position: "AMR", age: 23, nationality: "Brazil", value: "£55M", wage: "£140k", contract: "2028",
          attributes: { pace: 17, dribbling: 18, crossing: 14, technique: 16, flair: 18 },
          form: 6.88, morale: "Good", fitness: 92, sharpness: 86 },
        { id: 13, name: "Jadon Sancho", position: "AMR/AML", age: 23, nationality: "England", value: "£45M", wage: "£180k", contract: "2027",
          attributes: { pace: 16, dribbling: 18, passing: 15, technique: 17, creativity: 16 },
          form: 6.42, morale: "Poor", fitness: 88, sharpness: 79 },
        
        // Strikers
        { id: 14, name: "Rasmus Højlund", position: "ST", age: 20, nationality: "Denmark", value: "£65M", wage: "£120k", contract: "2029",
          attributes: { finishing: 15, heading: 14, pace: 17, strength: 15, positioning: 14 },
          form: 7.34, morale: "Good", fitness: 94, sharpness: 91 },
        { id: 15, name: "Anthony Martial", position: "ST", age: 28, nationality: "France", value: "£20M", wage: "£180k", contract: "2024",
          attributes: { finishing: 16, dribbling: 15, pace: 15, technique: 16, composure: 15 },
          form: 6.22, morale: "Okay", fitness: 72, sharpness: 68, injured: "Knock - 3 days" }
    ],

    renderSquadView() {
        return `
            <div class="squad-container">
                <div class="squad-header">
                    <div class="squad-tabs">
                        <button class="squad-tab active" onclick="SquadScreen.showTab('overview')">Overview</button>
                        <button class="squad-tab" onclick="SquadScreen.showTab('tactics')">Tactics</button>
                        <button class="squad-tab" onclick="SquadScreen.showTab('report')">Report</button>
                        <button class="squad-tab" onclick="SquadScreen.showTab('dynamics')">Dynamics</button>
                        <button class="squad-tab" onclick="SquadScreen.showTab('training')">Training</button>
                    </div>
                    <div class="squad-filters">
                        <select class="position-filter">
                            <option value="all">All Positions</option>
                            <option value="GK">Goalkeepers</option>
                            <option value="DEF">Defenders</option>
                            <option value="MID">Midfielders</option>
                            <option value="ATT">Attackers</option>
                        </select>
                        <select class="view-mode">
                            <option value="list">List View</option>
                            <option value="depth">Depth Chart</option>
                            <option value="comparison">Comparison</option>
                        </select>
                    </div>
                </div>
                
                <div class="squad-content" id="squad-content">
                    ${this.renderOverviewTab()}
                </div>
            </div>
        `;
    },

    renderOverviewTab() {
        return `
            <div class="squad-overview">
                <div class="squad-stats-bar">
                    <div class="stat-item">
                        <span class="stat-label">Squad Size</span>
                        <span class="stat-value">${this.players.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Average Age</span>
                        <span class="stat-value">${this.calculateAverageAge()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Value</span>
                        <span class="stat-value">£678M</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Weekly Wages</span>
                        <span class="stat-value">£2.4M</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Injured</span>
                        <span class="stat-value injured">${this.getInjuredCount()}</span>
                    </div>
                </div>
                
                <table class="squad-table">
                    <thead>
                        <tr>
                            <th class="sticky-col">#</th>
                            <th class="name-col">Name</th>
                            <th>Pos</th>
                            <th>Age</th>
                            <th>Nat</th>
                            <th>Value</th>
                            <th>Wage</th>
                            <th>Contract</th>
                            <th>Form</th>
                            <th>Morale</th>
                            <th>Fitness</th>
                            <th>Sharp</th>
                            <th class="actions-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.players.map(player => this.renderPlayerRow(player)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderPlayerRow(player) {
        const injuryClass = player.injured ? 'injured-player' : '';
        const captainBadge = player.captain ? '<span class="captain-badge">C</span>' : '';
        const formColor = this.getFormColor(player.form);
        const moraleIcon = this.getMoraleIcon(player.morale);
        const fitnessBar = this.renderFitnessBar(player.fitness);
        
        return `
            <tr class="${injuryClass}" onclick="SquadScreen.showPlayerDetails(${player.id})">
                <td class="sticky-col">${player.id}</td>
                <td class="name-col">
                    ${player.name} ${captainBadge}
                    ${player.injured ? `<span class="injury-indicator" title="${player.injured}">🏥</span>` : ''}
                </td>
                <td class="position-badge ${this.getPositionClass(player.position)}">${player.position}</td>
                <td>${player.age}</td>
                <td class="nationality">
                    <img src="https://flagcdn.com/16x12/${this.getFlagCode(player.nationality)}.png" alt="${player.nationality}" title="${player.nationality}">
                </td>
                <td>${player.value}</td>
                <td>${player.wage}/w</td>
                <td>${player.contract}</td>
                <td style="color: ${formColor}; font-weight: bold;">${player.form.toFixed(2)}</td>
                <td>${moraleIcon}</td>
                <td>${fitnessBar}</td>
                <td>${player.sharpness}%</td>
                <td class="actions-col">
                    <button class="action-btn" onclick="event.stopPropagation(); SquadScreen.dropPlayer(${player.id})" title="Drop from Squad">📋</button>
                    <button class="action-btn" onclick="event.stopPropagation(); SquadScreen.trainPlayer(${player.id})" title="Individual Training">🏃</button>
                    <button class="action-btn" onclick="event.stopPropagation(); SquadScreen.contractPlayer(${player.id})" title="Contract">📝</button>
                </td>
            </tr>
        `;
    },

    showPlayerDetails(playerId) {
        const player = this.players.find(p => p.id === playerId);
        if (!player) return;
        
        const detailsHTML = `
            <div class="player-details-modal">
                <div class="player-header">
                    <h2>${player.name}</h2>
                    <span class="position-badge ${this.getPositionClass(player.position)}">${player.position}</span>
                </div>
                <div class="player-info-grid">
                    <div class="info-section">
                        <h3>Personal Information</h3>
                        <div class="info-row"><span>Age:</span> <span>${player.age}</span></div>
                        <div class="info-row"><span>Nationality:</span> <span>${player.nationality}</span></div>
                        <div class="info-row"><span>Value:</span> <span>${player.value}</span></div>
                        <div class="info-row"><span>Wage:</span> <span>${player.wage}/week</span></div>
                        <div class="info-row"><span>Contract:</span> <span>Until ${player.contract}</span></div>
                    </div>
                    <div class="info-section">
                        <h3>Key Attributes</h3>
                        ${Object.entries(player.attributes).map(([key, value]) => 
                            `<div class="attribute-row">
                                <span>${key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <div class="attribute-bar">
                                    <div class="attribute-fill" style="width: ${value * 5}%; background: ${this.getAttributeColor(value)};"></div>
                                    <span class="attribute-value">${value}</span>
                                </div>
                            </div>`
                        ).join('')}
                    </div>
                    <div class="info-section">
                        <h3>Current Status</h3>
                        <div class="info-row"><span>Form:</span> <span style="color: ${this.getFormColor(player.form)}">${player.form.toFixed(2)}</span></div>
                        <div class="info-row"><span>Morale:</span> <span>${player.morale}</span></div>
                        <div class="info-row"><span>Fitness:</span> <span>${player.fitness}%</span></div>
                        <div class="info-row"><span>Match Sharpness:</span> <span>${player.sharpness}%</span></div>
                        ${player.injured ? `<div class="info-row injury"><span>Injury:</span> <span>${player.injured}</span></div>` : ''}
                    </div>
                </div>
                <button class="close-modal" onclick="this.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', detailsHTML);
    },

    calculateAverageAge() {
        const total = this.players.reduce((sum, p) => sum + p.age, 0);
        return (total / this.players.length).toFixed(1);
    },

    getInjuredCount() {
        return this.players.filter(p => p.injured).length;
    },

    getFormColor(form) {
        if (form >= 7.5) return '#4ade80';
        if (form >= 7.0) return '#84cc16';
        if (form >= 6.5) return '#facc15';
        if (form >= 6.0) return '#fb923c';
        return '#ef4444';
    },

    getMoraleIcon(morale) {
        const icons = {
            'Superb': '😄',
            'Good': '🙂',
            'Okay': '😐',
            'Poor': '☹️',
            'Abysmal': '😡'
        };
        return icons[morale] || '😐';
    },

    renderFitnessBar(fitness) {
        const color = fitness >= 90 ? '#4ade80' : fitness >= 75 ? '#facc15' : '#ef4444';
        return `<div class="fitness-bar"><div class="fitness-fill" style="width: ${fitness}%; background: ${color};"></div></div>`;
    },

    getPositionClass(position) {
        if (position === 'GK') return 'pos-gk';
        if (['DC', 'DL', 'DR', 'WBL', 'WBR'].includes(position)) return 'pos-def';
        if (['DM', 'CM', 'AM'].includes(position)) return 'pos-mid';
        if (['AML', 'AMR', 'ST'].includes(position)) return 'pos-att';
        return '';
    },

    getFlagCode(nationality) {
        const flags = {
            'England': 'gb-eng',
            'Spain': 'es',
            'France': 'fr',
            'Brazil': 'br',
            'Portugal': 'pt',
            'Argentina': 'ar',
            'Denmark': 'dk',
            'Scotland': 'gb-sct',
            'Netherlands': 'nl'
        };
        return flags[nationality] || 'un';
    },

    getAttributeColor(value) {
        if (value >= 18) return '#4ade80';
        if (value >= 15) return '#84cc16';
        if (value >= 12) return '#facc15';
        if (value >= 10) return '#fb923c';
        return '#ef4444';
    },

    showTab(tab) {
        document.querySelectorAll('.squad-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        const content = document.getElementById('squad-content');
        switch(tab) {
            case 'overview':
                content.innerHTML = this.renderOverviewTab();
                break;
            case 'tactics':
                content.innerHTML = TacticsScreen.renderTacticsView();
                break;
            case 'report':
                content.innerHTML = this.renderReportTab();
                break;
            case 'dynamics':
                content.innerHTML = this.renderDynamicsTab();
                break;
            case 'training':
                content.innerHTML = TrainingScreen.renderTrainingView();
                break;
        }
    },

    renderReportTab() {
        return `
            <div class="squad-report">
                <h3>Squad Report</h3>
                <div class="report-sections">
                    <div class="report-section">
                        <h4>Strengths</h4>
                        <ul>
                            <li>Strong defensive midfield presence with Casemiro</li>
                            <li>Creative attacking options with Bruno Fernandes</li>
                            <li>Good pace on the wings with Rashford and Antony</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h4>Weaknesses</h4>
                        <ul>
                            <li>Lack of depth at striker position</li>
                            <li>Aging goalkeeper situation</li>
                            <li>Injury concerns with key players</li>
                        </ul>
                    </div>
                    <div class="report-section">
                        <h4>Recommendations</h4>
                        <ul>
                            <li>Sign a backup striker in the transfer window</li>
                            <li>Scout for a young goalkeeper prospect</li>
                            <li>Manage Luke Shaw's fitness carefully</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    renderDynamicsTab() {
        return `
            <div class="squad-dynamics">
                <h3>Squad Dynamics</h3>
                <div class="dynamics-grid">
                    <div class="dynamics-card">
                        <h4>Team Leaders</h4>
                        <div class="leader-item">Bruno Fernandes (Captain)</div>
                        <div class="leader-item">Casemiro (Vice-Captain)</div>
                        <div class="leader-item">Raphaël Varane (Team Leader)</div>
                    </div>
                    <div class="dynamics-card">
                        <h4>Social Groups</h4>
                        <div class="social-group">Portuguese Speaking: Bruno, Dalot, Antony, Casemiro</div>
                        <div class="social-group">English Core: Rashford, Shaw, McTominay</div>
                        <div class="social-group">Young Talents: Højlund, Antony, Sancho</div>
                    </div>
                    <div class="dynamics-card">
                        <h4>Team Cohesion</h4>
                        <div class="cohesion-bar">
                            <div class="cohesion-fill" style="width: 75%; background: #4ade80;"></div>
                            <span>75%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    dropPlayer(playerId) {
        console.log(`Dropping player ${playerId} from squad`);
    },

    trainPlayer(playerId) {
        console.log(`Setting individual training for player ${playerId}`);
    },

    contractPlayer(playerId) {
        console.log(`Opening contract negotiations for player ${playerId}`);
    }
};

// Add Squad screen styles
const squadStyles = `
<style>
.squad-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--neutral-200);
    color: #e0e0e0;
}

.squad-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: var(--neutral-300);
    border-bottom: 1px solid var(--neutral-400);
}

.squad-tabs {
    display: flex;
    gap: 5px;
}

.squad-tab {
    padding: 8px 16px;
    background: var(--neutral-200);
    border: 1px solid var(--neutral-400);
    color: #a0a0a0;
    cursor: pointer;
    transition: all 0.2s;
}

.squad-tab.active {
    background: var(--primary-300);
    color: white;
    border-color: var(--primary-400);
}

.squad-filters {
    display: flex;
    gap: 10px;
}

.squad-filters select {
    padding: 6px 12px;
    background: var(--neutral-200);
    border: 1px solid var(--neutral-400);
    color: #e0e0e0;
}

.squad-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.squad-stats-bar {
    display: flex;
    gap: 20px;
    padding: 15px;
    background: var(--neutral-300);
    border-radius: 5px;
    margin-bottom: 20px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
}

.stat-value.injured {
    color: #ef4444;
}

.squad-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--neutral-300);
}

.squad-table th {
    background: var(--neutral-400);
    padding: 10px;
    text-align: left;
    font-size: 12px;
    color: #a0a0a0;
    border-bottom: 2px solid var(--neutral-500);
}

.squad-table td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--neutral-400);
    font-size: 13px;
}

.squad-table tr:hover {
    background: var(--neutral-400);
    cursor: pointer;
}

.injured-player {
    opacity: 0.7;
}

.injury-indicator {
    margin-left: 5px;
    font-size: 12px;
}

.captain-badge {
    background: gold;
    color: black;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
    margin-left: 5px;
}

.position-badge {
    padding: 3px 6px;
    border-radius: 3px;
    font-weight: bold;
    font-size: 11px;
}

.pos-gk { background: #8b5cf6; }
.pos-def { background: #3b82f6; }
.pos-mid { background: #10b981; }
.pos-att { background: #ef4444; }

.fitness-bar {
    width: 60px;
    height: 8px;
    background: var(--neutral-400);
    border-radius: 4px;
    overflow: hidden;
}

.fitness-fill {
    height: 100%;
    transition: width 0.3s;
}

.action-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 2px 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.action-btn:hover {
    opacity: 1;
}

.player-details-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--neutral-200);
    border: 2px solid var(--neutral-400);
    border-radius: 10px;
    padding: 30px;
    z-index: 10000;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.player-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--neutral-400);
}

.player-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.info-section h3 {
    color: var(--primary-400);
    margin-bottom: 15px;
    font-size: 14px;
    text-transform: uppercase;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid var(--neutral-400);
}

.attribute-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.attribute-bar {
    flex: 1;
    height: 18px;
    background: var(--neutral-400);
    border-radius: 9px;
    position: relative;
    overflow: hidden;
}

.attribute-fill {
    height: 100%;
    border-radius: 9px;
    transition: width 0.3s;
}

.attribute-value {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 11px;
    font-weight: bold;
    color: white;
}

.close-modal {
    margin-top: 20px;
    padding: 10px 20px;
    background: var(--primary-300);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.close-modal:hover {
    background: var(--primary-400);
}

.report-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.report-section {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.report-section h4 {
    color: var(--primary-400);
    margin-bottom: 10px;
}

.report-section ul {
    list-style: none;
    padding: 0;
}

.report-section li {
    padding: 5px 0;
    padding-left: 20px;
    position: relative;
}

.report-section li:before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--primary-400);
}

.dynamics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.dynamics-card {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.dynamics-card h4 {
    color: var(--primary-400);
    margin-bottom: 15px;
}

.leader-item,
.social-group {
    padding: 8px;
    margin-bottom: 5px;
    background: var(--neutral-400);
    border-radius: 3px;
}

.cohesion-bar {
    position: relative;
    height: 30px;
    background: var(--neutral-400);
    border-radius: 15px;
    overflow: hidden;
}

.cohesion-fill {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    font-weight: bold;
}
</style>
`;

// Inject styles when module loads
if (!document.getElementById('squad-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'squad-styles';
    styleElement.innerHTML = squadStyles;
    document.head.appendChild(styleElement.firstElementChild);
}