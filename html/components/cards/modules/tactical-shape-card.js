/* ==========================================
   TACTICAL SHAPE CARD - Formation and Tactical Visualization
   ========================================== */

window.TacticalShapeCard = {
    id: 'tactical-shape',
    title: 'Tactical Setup',
    pages: ['tactics', 'match'],
    size: 'wide tall',
    
    currentFormation: '4-2-3-1',
    selectedPlayer: null,
    heatMapMode: false,
    
    render() {
        return {
            className: 'card wide tall tactical-shape-card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <div class="header-controls">
                        <select class="formation-selector" onchange="window.TacticalShapeCard.changeFormation(this.value)">
                            <option value="4-2-3-1" ${this.currentFormation === '4-2-3-1' ? 'selected' : ''}>4-2-3-1</option>
                            <option value="4-3-3" ${this.currentFormation === '4-3-3' ? 'selected' : ''}>4-3-3</option>
                            <option value="3-5-2" ${this.currentFormation === '3-5-2' ? 'selected' : ''}>3-5-2</option>
                            <option value="4-4-2" ${this.currentFormation === '4-4-2' ? 'selected' : ''}>4-4-2</option>
                            <option value="5-3-2" ${this.currentFormation === '5-3-2' ? 'selected' : ''}>5-3-2</option>
                        </select>
                        <button class="mode-btn ${this.heatMapMode ? '' : 'active'}" onclick="window.TacticalShapeCard.toggleMode(false)">
                            Formation
                        </button>
                        <button class="mode-btn ${this.heatMapMode ? 'active' : ''}" onclick="window.TacticalShapeCard.toggleMode(true)">
                            Heat Map
                        </button>
                        <button class="expand-btn" onclick="expandCard(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <circle cx="12" cy="12" r="6"/>
                                <circle cx="12" cy="12" r="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    ${this.getContent()}
                </div>
                <div class="resize-handle"></div>
            `
        };
    },
    
    getContent() {
        return `
            <div class="tactical-content">
                <div class="pitch-container">
                    <div class="football-pitch">
                        ${this.renderPitchMarkings()}
                        ${this.heatMapMode ? this.renderHeatMap() : this.renderFormation()}
                    </div>
                </div>
                
                <div class="tactical-info">
                    ${this.renderTacticalInstructions()}
                    ${this.selectedPlayer ? this.renderPlayerDetails() : this.renderFormationInfo()}
                </div>
            </div>
        `;
    },
    
    renderPitchMarkings() {
        return `
            <div class="pitch-markings">
                <!-- Penalty areas -->
                <div class="penalty-area penalty-area-top"></div>
                <div class="penalty-area penalty-area-bottom"></div>
                
                <!-- Goal areas -->
                <div class="goal-area goal-area-top"></div>
                <div class="goal-area goal-area-bottom"></div>
                
                <!-- Center circle -->
                <div class="center-circle"></div>
                <div class="center-line"></div>
                
                <!-- Goals -->
                <div class="goal goal-top"></div>
                <div class="goal goal-bottom"></div>
                
                <!-- Corner arcs -->
                <div class="corner-arc corner-tl"></div>
                <div class="corner-arc corner-tr"></div>
                <div class="corner-arc corner-bl"></div>
                <div class="corner-arc corner-br"></div>
            </div>
        `;
    },
    
    renderFormation() {
        const formation = this.getFormationData(this.currentFormation);
        const players = this.getPlayersForFormation();
        
        return `
            <div class="formation-display">
                ${formation.positions.map((position, index) => {
                    const player = players[index] || { name: 'TBD', number: '?' };
                    return `
                        <div class="player-position" 
                             style="left: ${position.x}%; top: ${position.y}%;"
                             data-position="${position.role}"
                             data-player-id="${player.id || 0}"
                             onclick="window.TacticalShapeCard.selectPlayer(${player.id || 0}, '${position.role}')">
                            <div class="player-marker ${this.selectedPlayer?.id === player.id ? 'selected' : ''}">
                                <span class="player-number">${player.number}</span>
                                <div class="player-name">${player.name}</div>
                                <div class="player-role">${position.role}</div>
                            </div>
                            <div class="position-connections">
                                ${this.getPositionConnections(position, formation.positions)}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                <!-- Formation shape lines -->
                <div class="formation-lines">
                    ${this.renderFormationLines(formation)}
                </div>
            </div>
        `;
    },
    
    renderHeatMap() {
        const heatMapData = this.getHeatMapData();
        return `
            <div class="heat-map-display">
                ${heatMapData.map(zone => `
                    <div class="heat-zone" 
                         style="left: ${zone.x}%; top: ${zone.y}%; width: ${zone.width}%; height: ${zone.height}%;"
                         data-intensity="${zone.intensity}">
                        <div class="heat-overlay" style="opacity: ${zone.intensity / 100}; background: ${this.getHeatColor(zone.intensity)};"></div>
                        <div class="heat-label">${zone.intensity}%</div>
                    </div>
                `).join('')}
                
                <!-- Player movement arrows -->
                <div class="movement-arrows">
                    ${this.renderMovementPatterns()}
                </div>
            </div>
        `;
    },
    
    renderFormationLines(formation) {
        const lines = formation.lines || [];
        return lines.map(line => `
            <svg class="formation-line">
                <line x1="${line.x1}%" y1="${line.y1}%" 
                      x2="${line.x2}%" y2="${line.y2}%" 
                      stroke="rgba(255,255,255,0.3)" 
                      stroke-width="1" 
                      stroke-dasharray="3,3"/>
            </svg>
        `).join('');
    },
    
    renderMovementPatterns() {
        const patterns = [
            { fromX: 20, fromY: 70, toX: 35, toY: 50, player: 'LB', type: 'overlap' },
            { fromX: 80, fromY: 70, toX: 65, toY: 50, player: 'RB', type: 'overlap' },
            { fromX: 50, fromY: 40, toX: 50, toY: 25, player: 'AM', type: 'forward' },
            { fromX: 30, fromY: 30, toX: 45, toY: 35, player: 'LW', type: 'cut-inside' }
        ];
        
        return patterns.map(pattern => `
            <div class="movement-arrow" 
                 style="left: ${pattern.fromX}%; top: ${pattern.fromY}%;">
                <svg width="30" height="30" viewBox="0 0 30 30">
                    <defs>
                        <marker id="arrowhead-${pattern.type}" markerWidth="10" markerHeight="7" 
                                refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="${this.getMovementColor(pattern.type)}" />
                        </marker>
                    </defs>
                    <line x1="5" y1="15" x2="25" y2="15" 
                          stroke="${this.getMovementColor(pattern.type)}" 
                          stroke-width="2" 
                          marker-end="url(#arrowhead-${pattern.type})" />
                </svg>
                <div class="movement-label">${pattern.type}</div>
            </div>
        `).join('');
    },
    
    renderTacticalInstructions() {
        const instructions = this.getTacticalInstructions();
        return `
            <div class="tactical-instructions">
                <h4>Tactical Instructions</h4>
                <div class="instructions-grid">
                    ${Object.entries(instructions).map(([category, items]) => `
                        <div class="instruction-category">
                            <h5>${category}</h5>
                            <div class="instruction-items">
                                ${items.map(item => `
                                    <div class="instruction-item ${item.active ? 'active' : ''}">
                                        <span class="instruction-name">${item.name}</span>
                                        <div class="instruction-toggle" onclick="window.TacticalShapeCard.toggleInstruction('${category}', '${item.name}')">
                                            <div class="toggle-slider ${item.active ? 'active' : ''}"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    renderFormationInfo() {
        const info = this.getFormationInfo(this.currentFormation);
        return `
            <div class="formation-info">
                <h4>Formation: ${this.currentFormation}</h4>
                <div class="formation-details">
                    <div class="formation-stats">
                        <div class="stat-item">
                            <span class="stat-label">Style</span>
                            <span class="stat-value">${info.style}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Mentality</span>
                            <span class="stat-value">${info.mentality}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Width</span>
                            <span class="stat-value">${info.width}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Tempo</span>
                            <span class="stat-value">${info.tempo}</span>
                        </div>
                    </div>
                    <div class="formation-description">
                        <p>${info.description}</p>
                    </div>
                    <div class="formation-strengths">
                        <h5>Key Strengths</h5>
                        <ul>
                            ${info.strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPlayerDetails() {
        return `
            <div class="player-details">
                <h4>${this.selectedPlayer.name} (${this.selectedPlayer.position})</h4>
                <div class="player-role-info">
                    <div class="role-description">
                        <h5>Role Instructions</h5>
                        <div class="role-duties">
                            ${this.selectedPlayer.duties.map(duty => `
                                <div class="duty-item">
                                    <span class="duty-icon">${duty.icon}</span>
                                    <span class="duty-text">${duty.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="player-attributes">
                        <h5>Key Attributes</h5>
                        <div class="attributes-list">
                            ${this.selectedPlayer.keyAttributes.map(attr => `
                                <div class="attr-item">
                                    <span class="attr-name">${attr.name}</span>
                                    <div class="attr-bar">
                                        <div class="attr-fill" style="width: ${attr.value * 5}%"></div>
                                    </div>
                                    <span class="attr-value">${attr.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Event handlers
    changeFormation(formation) {
        this.currentFormation = formation;
        this.selectedPlayer = null;
        this.update();
    },
    
    toggleMode(heatMap) {
        this.heatMapMode = heatMap;
        this.selectedPlayer = null;
        this.update();
    },
    
    selectPlayer(playerId, position) {
        if (this.heatMapMode) return;
        
        const players = this.getPlayersForFormation();
        const player = players.find(p => p.id === playerId);
        if (player) {
            this.selectedPlayer = {
                ...player,
                position: position,
                duties: this.getPlayerDuties(position),
                keyAttributes: this.getPlayerKeyAttributes(player, position)
            };
            this.update();
        }
    },
    
    toggleInstruction(category, instruction) {
        // This would update the tactical instruction state
        console.log(`Toggling ${instruction} in ${category}`);
        // For demo purposes, just update the UI
        this.update();
    },
    
    // Data methods
    getFormationData(formation) {
        const formations = {
            '4-2-3-1': {
                positions: [
                    { x: 50, y: 10, role: 'GK' },
                    { x: 15, y: 25, role: 'LB' }, { x: 35, y: 25, role: 'CB' }, { x: 65, y: 25, role: 'CB' }, { x: 85, y: 25, role: 'RB' },
                    { x: 35, y: 45, role: 'DM' }, { x: 65, y: 45, role: 'DM' },
                    { x: 15, y: 65, role: 'LM' }, { x: 50, y: 65, role: 'AM' }, { x: 85, y: 65, role: 'RM' },
                    { x: 50, y: 85, role: 'ST' }
                ]
            },
            '4-3-3': {
                positions: [
                    { x: 50, y: 10, role: 'GK' },
                    { x: 15, y: 25, role: 'LB' }, { x: 35, y: 25, role: 'CB' }, { x: 65, y: 25, role: 'CB' }, { x: 85, y: 25, role: 'RB' },
                    { x: 25, y: 50, role: 'CM' }, { x: 50, y: 45, role: 'CM' }, { x: 75, y: 50, role: 'CM' },
                    { x: 15, y: 75, role: 'LW' }, { x: 50, y: 85, role: 'ST' }, { x: 85, y: 75, role: 'RW' }
                ]
            },
            '3-5-2': {
                positions: [
                    { x: 50, y: 10, role: 'GK' },
                    { x: 25, y: 25, role: 'CB' }, { x: 50, y: 25, role: 'CB' }, { x: 75, y: 25, role: 'CB' },
                    { x: 10, y: 50, role: 'LWB' }, { x: 30, y: 45, role: 'CM' }, { x: 50, y: 45, role: 'CM' }, { x: 70, y: 45, role: 'CM' }, { x: 90, y: 50, role: 'RWB' },
                    { x: 40, y: 80, role: 'ST' }, { x: 60, y: 80, role: 'ST' }
                ]
            },
            '4-4-2': {
                positions: [
                    { x: 50, y: 10, role: 'GK' },
                    { x: 15, y: 25, role: 'LB' }, { x: 35, y: 25, role: 'CB' }, { x: 65, y: 25, role: 'CB' }, { x: 85, y: 25, role: 'RB' },
                    { x: 15, y: 55, role: 'LM' }, { x: 35, y: 50, role: 'CM' }, { x: 65, y: 50, role: 'CM' }, { x: 85, y: 55, role: 'RM' },
                    { x: 40, y: 80, role: 'ST' }, { x: 60, y: 80, role: 'ST' }
                ]
            },
            '5-3-2': {
                positions: [
                    { x: 50, y: 10, role: 'GK' },
                    { x: 10, y: 25, role: 'LWB' }, { x: 25, y: 25, role: 'CB' }, { x: 50, y: 25, role: 'CB' }, { x: 75, y: 25, role: 'CB' }, { x: 90, y: 25, role: 'RWB' },
                    { x: 25, y: 55, role: 'CM' }, { x: 50, y: 50, role: 'CM' }, { x: 75, y: 55, role: 'CM' },
                    { x: 40, y: 80, role: 'ST' }, { x: 60, y: 80, role: 'ST' }
                ]
            }
        };
        
        return formations[formation] || formations['4-2-3-1'];
    },
    
    getPlayersForFormation() {
        return [
            { id: 1, name: 'de Gea', number: '1' },
            { id: 2, name: 'Shaw', number: '23' },
            { id: 3, name: 'Martinez', number: '6' },
            { id: 4, name: 'Varane', number: '19' },
            { id: 5, name: 'Dalot', number: '20' },
            { id: 6, name: 'Casemiro', number: '18' },
            { id: 7, name: 'Eriksen', number: '14' },
            { id: 8, name: 'Rashford', number: '10' },
            { id: 9, name: 'Fernandes', number: '8' },
            { id: 10, name: 'Antony', number: '21' },
            { id: 11, name: 'Højlund', number: '11' }
        ];
    },
    
    getHeatMapData() {
        return [
            { x: 10, y: 20, width: 30, height: 25, intensity: 45 },
            { x: 40, y: 35, width: 20, height: 30, intensity: 78 },
            { x: 60, y: 40, width: 25, height: 25, intensity: 62 },
            { x: 80, y: 25, width: 15, height: 20, intensity: 35 },
            { x: 25, y: 65, width: 50, height: 20, intensity: 85 },
            { x: 45, y: 80, width: 10, height: 15, intensity: 92 }
        ];
    },
    
    getTacticalInstructions() {
        return {
            'In Possession': [
                { name: 'Play Out of Defence', active: true },
                { name: 'Shorter Passing', active: false },
                { name: 'Higher Tempo', active: true },
                { name: 'Be More Expressive', active: true }
            ],
            'In Transition': [
                { name: 'Counter-Press', active: true },
                { name: 'Counter', active: false },
                { name: 'Distribute to Centre-Backs', active: true }
            ],
            'Out of Possession': [
                { name: 'Higher Defensive Line', active: true },
                { name: 'Use Offside Trap', active: false },
                { name: 'Press More Intensely', active: true },
                { name: 'Prevent Short GK Distribution', active: true }
            ]
        };
    },
    
    getFormationInfo(formation) {
        const info = {
            '4-2-3-1': {
                style: 'Attacking',
                mentality: 'Positive',
                width: 'Fairly Wide',
                tempo: 'Higher',
                description: 'A balanced formation that provides defensive stability through the double pivot while offering attacking creativity through the advanced playmaker.',
                strengths: ['Strong defensive midfield presence', 'Creative attacking midfield', 'Wide attacking options', 'Single striker focus']
            },
            '4-3-3': {
                style: 'Attacking',
                mentality: 'Positive',
                width: 'Wide',
                tempo: 'Higher',
                description: 'An aggressive attacking formation that utilizes width and quick passing combinations to break down defensive lines.',
                strengths: ['Excellent width in attack', 'Midfield control', 'High pressing capability', 'Multiple goal threats']
            },
            '3-5-2': {
                style: 'Control',
                mentality: 'Balanced',
                width: 'Wide',
                tempo: 'Standard',
                description: 'A flexible formation offering numerical superiority in midfield with attacking wing-backs providing width.',
                strengths: ['Midfield dominance', 'Attacking wing-backs', 'Defensive stability', 'Two striker partnership']
            }
        };
        
        return info[formation] || info['4-2-3-1'];
    },
    
    getPlayerDuties(position) {
        const duties = {
            'GK': [
                { icon: '🥅', text: 'Distribute quickly to full-backs' },
                { icon: '👀', text: 'Sweep behind defensive line' },
                { icon: '📢', text: 'Organize defensive line' }
            ],
            'CB': [
                { icon: '🛡️', text: 'Mark opposition striker' },
                { icon: '📤', text: 'Play forward passes to midfield' },
                { icon: '🏃', text: 'Cover for advancing full-backs' }
            ],
            'LB': [
                { icon: '⬆️', text: 'Overlap in attacking phases' },
                { icon: '✂️', text: 'Cut out crosses from right wing' },
                { icon: '🔄', text: 'Recycle possession when needed' }
            ],
            'DM': [
                { icon: '🛡️', text: 'Screen back four' },
                { icon: '🔄', text: 'Distribute from deep' },
                { icon: '⚡', text: 'Press opposition playmaker' }
            ],
            'AM': [
                { icon: '🎯', text: 'Create chances for striker' },
                { icon: '🏃', text: 'Make late runs into box' },
                { icon: '🔄', text: 'Link midfield and attack' }
            ],
            'ST': [
                { icon: '⚽', text: 'Finish scoring opportunities' },
                { icon: '🏃', text: 'Make runs in behind' },
                { icon: '📤', text: 'Hold up play for team' }
            ]
        };
        
        return duties[position] || duties['ST'];
    },
    
    getPlayerKeyAttributes(player, position) {
        // This would normally be based on actual player data
        const mockAttributes = {
            'GK': [
                { name: 'Reflexes', value: 16 },
                { name: 'Distribution', value: 14 },
                { name: 'Handling', value: 15 }
            ],
            'CB': [
                { name: 'Heading', value: 17 },
                { name: 'Marking', value: 16 },
                { name: 'Passing', value: 14 }
            ],
            'LB': [
                { name: 'Pace', value: 15 },
                { name: 'Crossing', value: 13 },
                { name: 'Tackling', value: 14 }
            ],
            'DM': [
                { name: 'Tackling', value: 17 },
                { name: 'Passing', value: 16 },
                { name: 'Work Rate', value: 18 }
            ],
            'AM': [
                { name: 'Technique', value: 18 },
                { name: 'Vision', value: 17 },
                { name: 'Passing', value: 17 }
            ],
            'ST': [
                { name: 'Finishing', value: 16 },
                { name: 'Pace', value: 17 },
                { name: 'Composure', value: 15 }
            ]
        };
        
        return mockAttributes[position] || mockAttributes['ST'];
    },
    
    getPositionConnections(position, allPositions) {
        // This would show tactical connections between positions
        return '';
    },
    
    getHeatColor(intensity) {
        if (intensity >= 80) return '#ff4757';
        if (intensity >= 60) return '#ffa726';
        if (intensity >= 40) return '#ffeb3b';
        return '#4caf50';
    },
    
    getMovementColor(type) {
        const colors = {
            'overlap': '#00ff88',
            'forward': '#0094cc',
            'cut-inside': '#ff6b35',
            'drift': '#8066ff'
        };
        return colors[type] || '#ffffff';
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            const formationSelector = card.querySelector('.formation-selector');
            const modeBtns = card.querySelectorAll('.mode-btn');
            
            if (body) {
                body.innerHTML = this.getContent();
            }
            
            if (formationSelector) {
                formationSelector.value = this.currentFormation;
            }
            
            modeBtns.forEach(btn => {
                const isHeatMap = btn.textContent.trim() === 'Heat Map';
                btn.classList.toggle('active', isHeatMap === this.heatMapMode);
            });
        }
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.TacticalShapeCard);
}

// Add custom styles for tactical shape card
const tacticalShapeStyles = document.createElement('style');
tacticalShapeStyles.textContent = `
    .tactical-shape-card .header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .formation-selector {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .mode-btn {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: rgba(255,255,255,0.7);
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .mode-btn:hover {
        background: var(--neutral-300);
        color: white;
    }
    
    .mode-btn.active {
        background: var(--primary-300);
        color: white;
        border-color: var(--primary-400);
    }
    
    .tactical-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        height: 100%;
    }
    
    .pitch-container {
        background: var(--neutral-200);
        border-radius: var(--border-radius);
        padding: 15px;
        overflow: hidden;
    }
    
    .football-pitch {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 400px;
        background: linear-gradient(180deg, #2d5a27 0%, #3a6d35 50%, #2d5a27 100%);
        border-radius: 4px;
        border: 2px solid #ffffff;
        overflow: hidden;
    }
    
    .pitch-markings {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    
    .penalty-area {
        position: absolute;
        border: 2px solid rgba(255,255,255,0.8);
        background: transparent;
    }
    
    .penalty-area-top {
        top: 0;
        left: 25%;
        width: 50%;
        height: 18%;
    }
    
    .penalty-area-bottom {
        bottom: 0;
        left: 25%;
        width: 50%;
        height: 18%;
    }
    
    .goal-area {
        position: absolute;
        border: 2px solid rgba(255,255,255,0.8);
        background: transparent;
    }
    
    .goal-area-top {
        top: 0;
        left: 37.5%;
        width: 25%;
        height: 8%;
    }
    
    .goal-area-bottom {
        bottom: 0;
        left: 37.5%;
        width: 25%;
        height: 8%;
    }
    
    .center-circle {
        position: absolute;
        top: 40%;
        left: 40%;
        width: 20%;
        height: 20%;
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        background: transparent;
    }
    
    .center-line {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background: rgba(255,255,255,0.8);
    }
    
    .goal {
        position: absolute;
        background: rgba(255,255,255,0.9);
        border: 2px solid #ffffff;
    }
    
    .goal-top {
        top: -2px;
        left: 45%;
        width: 10%;
        height: 4%;
    }
    
    .goal-bottom {
        bottom: -2px;
        left: 45%;
        width: 10%;
        height: 4%;
    }
    
    .corner-arc {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        background: transparent;
    }
    
    .corner-tl { top: -10px; left: -10px; }
    .corner-tr { top: -10px; right: -10px; }
    .corner-bl { bottom: -10px; left: -10px; }
    .corner-br { bottom: -10px; right: -10px; }
    
    .formation-display,
    .heat-map-display {
        position: relative;
        width: 100%;
        height: 100%;
    }
    
    .player-position {
        position: absolute;
        transform: translate(-50%, -50%);
        cursor: pointer;
        z-index: 10;
    }
    
    .player-marker {
        background: var(--primary-300);
        border: 2px solid #ffffff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
    }
    
    .player-marker:hover {
        background: var(--primary-200);
        transform: scale(1.1);
        box-shadow: 0 0 15px rgba(255,255,255,0.5);
    }
    
    .player-marker.selected {
        background: var(--accent-300);
        box-shadow: 0 0 20px var(--accent-300);
        border-color: var(--accent-200);
    }
    
    .player-number {
        font-size: 14px;
        font-weight: 700;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }
    
    .player-name,
    .player-role {
        position: absolute;
        font-size: 9px;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        white-space: nowrap;
        pointer-events: none;
    }
    
    .player-name {
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
    }
    
    .player-role {
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--accent-200);
    }
    
    .heat-zone {
        position: absolute;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .heat-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        mix-blend-mode: multiply;
    }
    
    .heat-label {
        position: relative;
        z-index: 1;
        font-size: 10px;
        font-weight: 600;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }
    
    .movement-arrows {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    
    .movement-arrow {
        position: absolute;
        transform: translate(-50%, -50%);
    }
    
    .movement-label {
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 8px;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        white-space: nowrap;
    }
    
    .tactical-info {
        display: flex;
        flex-direction: column;
        gap: 15px;
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        overflow-y: auto;
    }
    
    .tactical-instructions h4,
    .formation-info h4,
    .player-details h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .instructions-grid {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .instruction-category h5 {
        margin: 0 0 8px 0;
        font-size: 12px;
        color: white;
        font-weight: 600;
    }
    
    .instruction-items {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .instruction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        background: var(--neutral-300);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .instruction-item:hover {
        background: var(--neutral-400);
    }
    
    .instruction-item.active {
        background: var(--primary-400);
    }
    
    .instruction-name {
        font-size: 11px;
        color: white;
    }
    
    .instruction-toggle {
        width: 30px;
        height: 16px;
        background: var(--neutral-500);
        border-radius: 8px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .instruction-item.active .instruction-toggle {
        background: var(--accent-200);
    }
    
    .toggle-slider {
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: all 0.2s ease;
    }
    
    .toggle-slider.active {
        left: 16px;
    }
    
    .formation-stats {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .stat-item {
        display: flex;
        flex-direction: column;
        text-align: center;
        padding: 8px;
        background: var(--neutral-300);
        border-radius: 4px;
    }
    
    .stat-label {
        font-size: 10px;
        color: #8892a0;
        margin-bottom: 4px;
    }
    
    .stat-value {
        font-size: 12px;
        font-weight: 600;
        color: white;
    }
    
    .formation-description p {
        font-size: 11px;
        color: rgba(255,255,255,0.8);
        line-height: 1.4;
        margin: 0 0 15px 0;
    }
    
    .formation-strengths h5 {
        margin: 0 0 8px 0;
        font-size: 12px;
        color: var(--accent-200);
        font-weight: 600;
    }
    
    .formation-strengths ul {
        margin: 0;
        padding-left: 15px;
    }
    
    .formation-strengths li {
        font-size: 10px;
        color: rgba(255,255,255,0.8);
        margin-bottom: 4px;
        line-height: 1.3;
    }
    
    .player-role-info {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .role-duties {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .duty-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px;
        background: var(--neutral-300);
        border-radius: 4px;
    }
    
    .duty-icon {
        font-size: 14px;
    }
    
    .duty-text {
        font-size: 11px;
        color: rgba(255,255,255,0.9);
        line-height: 1.3;
    }
    
    .attributes-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .attr-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
    }
    
    .attr-name {
        font-size: 10px;
        color: rgba(255,255,255,0.8);
        min-width: 60px;
    }
    
    .attr-bar {
        flex: 1;
        height: 4px;
        background: var(--neutral-400);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .attr-fill {
        height: 100%;
        background: var(--primary-300);
        border-radius: 2px;
        transition: width 0.3s ease;
    }
    
    .attr-value {
        font-size: 10px;
        color: white;
        font-weight: 600;
        min-width: 15px;
        text-align: right;
    }
    
    /* Responsive adjustments */
    @media (max-width: 1200px) {
        .tactical-content {
            grid-template-columns: 1fr;
            grid-template-rows: 2fr 1fr;
        }
        
        .formation-stats {
            grid-template-columns: repeat(4, 1fr);
        }
    }
    
    @media (max-width: 768px) {
        .tactical-content {
            grid-template-rows: 1fr auto;
        }
        
        .football-pitch {
            min-height: 300px;
        }
        
        .player-marker {
            width: 30px;
            height: 30px;
        }
        
        .player-number {
            font-size: 11px;
        }
        
        .player-name,
        .player-role {
            font-size: 8px;
        }
        
        .formation-stats {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;

document.head.appendChild(tacticalShapeStyles);