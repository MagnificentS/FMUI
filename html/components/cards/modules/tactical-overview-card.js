/* ==========================================
   TACTICAL OVERVIEW CARD - Modular Component
   ========================================== */

window.TacticalOverviewCard = {
    id: 'tactical-overview',
    title: 'Formation & Style',
    pages: ['tactics', 'overview'],
    size: 'extra-wide tall',
    
    // Forest of Thoughts Trees 1-8: Tactical visualization state management
    currentFormation: '4-2-3-1',
    heatMapMode: 'positioning',
    charts: {
        formationDiagram: null,
        tacticalHeatMap: null,
        styleRadar: null,
        intensityMeters: null
    },
    
    render() {
        return {
            className: 'card extra-wide tall tactical-overview-card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <div class="header-controls">
                        <select class="formation-selector" onchange="window.TacticalOverviewCard.changeFormation(this.value)">
                            <option value="4-2-3-1" ${this.currentFormation === '4-2-3-1' ? 'selected' : ''}>4-2-3-1</option>
                            <option value="4-3-3" ${this.currentFormation === '4-3-3' ? 'selected' : ''}>4-3-3</option>
                            <option value="3-5-2" ${this.currentFormation === '3-5-2' ? 'selected' : ''}>3-5-2</option>
                            <option value="4-4-2" ${this.currentFormation === '4-4-2' ? 'selected' : ''}>4-4-2</option>
                            <option value="5-3-2" ${this.currentFormation === '5-3-2' ? 'selected' : ''}>5-3-2</option>
                        </select>
                        <select class="heatmap-selector" onchange="window.TacticalOverviewCard.changeHeatMap(this.value)">
                            <option value="positioning" ${this.heatMapMode === 'positioning' ? 'selected' : ''}>Positioning</option>
                            <option value="attack" ${this.heatMapMode === 'attack' ? 'selected' : ''}>Attack Heat</option>
                            <option value="defense" ${this.heatMapMode === 'defense' ? 'selected' : ''}>Defense Heat</option>
                            <option value="possession" ${this.heatMapMode === 'possession' ? 'selected' : ''}>Possession</option>
                        </select>
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
            <div class="tactical-overview-content">
                <div class="formation-section">
                    <div class="formation-pitch-container">
                        <h4>Formation: ${this.currentFormation}</h4>
                        <div class="formation-pitch" id="formation-pitch-${this.id}">
                            <!-- SVG formation diagram will be inserted here -->
                        </div>
                        <div class="formation-stats">
                            ${this.renderFormationStats()}
                        </div>
                    </div>
                    
                    <div class="tactical-style-radar">
                        <h4>Playing Style Analysis</h4>
                        <div class="style-radar-container" id="style-radar-${this.id}">
                            <!-- Style radar chart will be inserted here -->
                        </div>
                    </div>
                </div>
                
                <div class="tactical-instructions">
                    <div class="heat-map-section">
                        <h4>Tactical Heat Map - ${this.getHeatMapTitle()}</h4>
                        <div class="heat-map-container" id="heat-map-${this.id}">
                            <!-- Heat map visualization will be inserted here -->
                        </div>
                    </div>
                    
                    <div class="intensity-meters">
                        <h4>Tactical Intensity</h4>
                        <div class="meters-container" id="intensity-meters-${this.id}">
                            ${this.renderIntensityMeters()}
                        </div>
                    </div>
                </div>
                
                <div class="tactical-details">
                    <div class="instruction-sliders">
                        <h4>Tactical Instructions</h4>
                        ${this.renderTacticalSliders()}
                    </div>
                    
                    <div class="team-mentality">
                        <h4>Team Mentality</h4>
                        ${this.renderMentalityIndicator()}
                    </div>
                </div>
            </div>
        `;
    },
    
    // Forest of Thoughts Tree 9-12: Formation positioning algorithms
    getFormationPositions(formation) {
        const formations = {
            '4-2-3-1': {
                gk: [{x: 50, y: 90}],
                def: [{x: 20, y: 75}, {x: 40, y: 75}, {x: 60, y: 75}, {x: 80, y: 75}],
                mid: [{x: 35, y: 55}, {x: 65, y: 55}, {x: 25, y: 35}, {x: 50, y: 35}, {x: 75, y: 35}],
                att: [{x: 50, y: 15}]
            },
            '4-3-3': {
                gk: [{x: 50, y: 90}],
                def: [{x: 20, y: 75}, {x: 40, y: 75}, {x: 60, y: 75}, {x: 80, y: 75}],
                mid: [{x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 55}],
                att: [{x: 25, y: 20}, {x: 50, y: 15}, {x: 75, y: 20}]
            },
            '3-5-2': {
                gk: [{x: 50, y: 90}],
                def: [{x: 30, y: 75}, {x: 50, y: 75}, {x: 70, y: 75}],
                mid: [{x: 15, y: 55}, {x: 35, y: 45}, {x: 50, y: 50}, {x: 65, y: 45}, {x: 85, y: 55}],
                att: [{x: 40, y: 20}, {x: 60, y: 20}]
            },
            '4-4-2': {
                gk: [{x: 50, y: 90}],
                def: [{x: 20, y: 75}, {x: 40, y: 75}, {x: 60, y: 75}, {x: 80, y: 75}],
                mid: [{x: 20, y: 50}, {x: 40, y: 50}, {x: 60, y: 50}, {x: 80, y: 50}],
                att: [{x: 40, y: 20}, {x: 60, y: 20}]
            },
            '5-3-2': {
                gk: [{x: 50, y: 90}],
                def: [{x: 15, y: 75}, {x: 30, y: 75}, {x: 50, y: 75}, {x: 70, y: 75}, {x: 85, y: 75}],
                mid: [{x: 30, y: 50}, {x: 50, y: 50}, {x: 70, y: 50}],
                att: [{x: 40, y: 20}, {x: 60, y: 20}]
            }
        };
        return formations[formation] || formations['4-2-3-1'];
    },
    
    // Forest of Thoughts Tree 13-15: SVG formation rendering
    renderFormationDiagram() {
        setTimeout(() => {
            const container = document.getElementById(`formation-pitch-${this.id}`);
            if (!container) return;
            
            const positions = this.getFormationPositions(this.currentFormation);
            const width = 280;
            const height = 400;
            
            let svgContent = `
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="formation-svg">
                    <!-- Pitch background -->
                    <rect x="10" y="10" width="${width-20}" height="${height-20}" 
                          fill="var(--neutral-300)" stroke="var(--neutral-400)" stroke-width="2" rx="4"/>
                    
                    <!-- Pitch markings -->
                    <line x1="10" y1="${height/2}" x2="${width-10}" y2="${height/2}" 
                          stroke="var(--neutral-400)" stroke-width="1"/>
                    <circle cx="${width/2}" cy="${height/2}" r="30" 
                            fill="none" stroke="var(--neutral-400)" stroke-width="1"/>
                    
                    <!-- Penalty areas -->
                    <rect x="60" y="10" width="160" height="50" 
                          fill="none" stroke="var(--neutral-400)" stroke-width="1"/>
                    <rect x="60" y="${height-60}" width="160" height="50" 
                          fill="none" stroke="var(--neutral-400)" stroke-width="1"/>
                    
                    <!-- Goal areas -->
                    <rect x="100" y="10" width="80" height="20" 
                          fill="none" stroke="var(--neutral-400)" stroke-width="1"/>
                    <rect x="100" y="${height-30}" width="80" height="20" 
                          fill="none" stroke="var(--neutral-400)" stroke-width="1"/>
            `;
            
            // Render players
            const colors = {
                gk: '#ffb800',  // Yellow
                def: '#0094cc', // Blue  
                mid: '#00ff88', // Green
                att: '#ff6b35'  // Orange
            };
            
            Object.entries(positions).forEach(([line, players]) => {
                players.forEach((pos, index) => {
                    const x = (pos.x / 100) * (width - 40) + 20;
                    const y = (pos.y / 100) * (height - 40) + 20;
                    
                    svgContent += `
                        <circle cx="${x}" cy="${y}" r="12" 
                                fill="${colors[line]}" 
                                stroke="#ffffff" 
                                stroke-width="2"
                                class="player-position ${line}"
                                data-position="${line}-${index}">
                            <title>${line.toUpperCase()} ${index + 1}</title>
                        </circle>
                        <text x="${x}" y="${y + 4}" 
                              text-anchor="middle" 
                              font-size="8" 
                              font-weight="600" 
                              fill="#ffffff" 
                              pointer-events="none">
                            ${line === 'gk' ? 'GK' : (index + 1)}
                        </text>
                    `;
                });
            });
            
            svgContent += '</svg>';
            container.innerHTML = svgContent;
            
            // Add interaction events
            this.addFormationInteractions(container);
        }, 100);
    },
    
    // Forest of Thoughts Tree 16-18: Heat map generation
    renderTacticalHeatMap() {
        setTimeout(() => {
            const container = document.getElementById(`heat-map-${this.id}`);
            if (!container) return;
            
            const heatMapData = this.getHeatMapData();
            const width = 280;
            const height = 200;
            const gridSize = 20;
            
            let svgContent = `
                <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="heat-map-svg">
                    <!-- Pitch outline -->
                    <rect x="10" y="10" width="${width-20}" height="${height-20}" 
                          fill="var(--neutral-300)" stroke="var(--neutral-400)" stroke-width="1" rx="2"/>
            `;
            
            // Generate heat map grid
            for (let x = 0; x < width - 20; x += gridSize) {
                for (let y = 0; y < height - 20; y += gridSize) {
                    const intensity = this.calculateHeatIntensity(x, y, heatMapData);
                    const opacity = intensity / 100;
                    const color = this.getHeatMapColor(intensity);
                    
                    if (intensity > 5) {
                        svgContent += `
                            <rect x="${x + 10}" y="${y + 10}" 
                                  width="${gridSize}" height="${gridSize}" 
                                  fill="${color}" 
                                  opacity="${opacity * 0.7}"
                                  data-intensity="${intensity}"/>
                        `;
                    }
                }
            }
            
            svgContent += '</svg>';
            container.innerHTML = svgContent;
        }, 150);
    },
    
    // Forest of Thoughts Tree 19-20: Data generation and utility methods
    renderFormationStats() {
        return `
            <div class="formation-stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Defensive Width</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: 65%"></div>
                    </div>
                    <span class="stat-value">65%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Offensive Support</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: 80%"></div>
                    </div>
                    <span class="stat-value">80%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Compactness</span>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: 75%"></div>
                    </div>
                    <span class="stat-value">75%</span>
                </div>
            </div>
        `;
    },
    
    renderIntensityMeters() {
        const tactics = this.getTacticalData();
        const intensities = {
            'Pressing': 85,
            'Aggression': 70,
            'Creativity': 75,
            'Discipline': 90
        };
        
        return Object.entries(intensities).map(([label, value]) => `
            <div class="intensity-meter">
                <span class="meter-label">${label}</span>
                <div class="meter-container">
                    <div class="meter-fill" style="width: ${value}%; background: ${this.getIntensityColor(value)}"></div>
                </div>
                <span class="meter-value">${value}%</span>
            </div>
        `).join('');
    },
    
    renderTacticalSliders() {
        const sliders = [
            { label: 'Mentality', value: 50, id: 'mentality' },
            { label: 'Team Width', value: 65, id: 'width' },
            { label: 'Tempo', value: 55, id: 'tempo' },
            { label: 'Defensive Line', value: 60, id: 'defense' }
        ];
        
        return sliders.map(slider => `
            <div class="tactical-slider">
                <label for="${slider.id}-slider">${slider.label}</label>
                <input type="range" id="${slider.id}-slider" 
                       min="0" max="100" value="${slider.value}"
                       class="slider"
                       onchange="window.TacticalOverviewCard.updateSlider('${slider.id}', this.value)">
                <span class="slider-value">${slider.value}%</span>
            </div>
        `).join('');
    },
    
    renderMentalityIndicator() {
        return `
            <div class="mentality-indicator">
                <div class="mentality-scale">
                    <div class="scale-markers">
                        <span class="marker defensive">Very Defensive</span>
                        <span class="marker balanced active">Balanced</span>
                        <span class="marker attacking">Very Attacking</span>
                    </div>
                    <div class="mentality-needle" style="left: 50%"></div>
                </div>
            </div>
        `;
    },
    
    initializeStyleRadar() {
        if (!window.PizzaChart) return;
        
        setTimeout(() => {
            const container = document.getElementById(`style-radar-${this.id}`);
            if (!container) return;
            
            const styleData = [
                { label: 'Possession', value: 75, color: '#0094cc' },
                { label: 'Pressing', value: 85, color: '#ff6b35' },
                { label: 'Creativity', value: 70, color: '#00ff88' },
                { label: 'Discipline', value: 90, color: '#ffb800' },
                { label: 'Width', value: 65, color: '#ff4757' }
            ];
            
            if (this.charts.styleRadar) {
                this.charts.styleRadar.destroy();
            }
            
            this.charts.styleRadar = new window.PizzaChart({
                container: container,
                data: styleData,
                type: 'doughnut',
                size: 160,
                showLegend: true,
                showValues: true,
                animate: true
            });
        }, 200);
    },
    
    // Event handlers and data methods
    changeFormation(formation) {
        this.currentFormation = formation;
        this.update();
        this.initializeVisualizations();
    },
    
    changeHeatMap(mode) {
        this.heatMapMode = mode;
        this.renderTacticalHeatMap();
    },
    
    updateSlider(sliderId, value) {
        console.log(`Updated ${sliderId} to ${value}%`);
        // Update visualization based on slider changes
    },
    
    getHeatMapTitle() {
        const titles = {
            positioning: 'Average Positioning',
            attack: 'Attacking Actions',
            defense: 'Defensive Actions', 
            possession: 'Ball Possession'
        };
        return titles[this.heatMapMode] || 'Positioning';
    },
    
    getHeatMapData() {
        // Simulated heat map data based on formation and mode
        return {
            attack: [[70, 30, 85], [60, 25, 75], [80, 35, 90]],
            defense: [[30, 75, 45], [25, 80, 40], [35, 70, 50]],
            positioning: [[50, 50, 65], [45, 55, 60], [55, 45, 70]],
            possession: [[60, 40, 70], [55, 45, 65], [65, 35, 75]]
        }[this.heatMapMode] || [];
    },
    
    calculateHeatIntensity(x, y, data) {
        // Calculate heat intensity for given position
        const gridX = Math.floor(x / 80);
        const gridY = Math.floor(y / 60);
        return (data[gridY] && data[gridY][gridX]) ? data[gridY][gridX] : Math.random() * 60 + 20;
    },
    
    getHeatMapColor(intensity) {
        if (intensity > 80) return '#ff4757';      // High intensity - Red
        if (intensity > 60) return '#ff6b35';     // Medium-high - Orange  
        if (intensity > 40) return '#ffb800';     // Medium - Yellow
        if (intensity > 20) return '#00ff88';     // Medium-low - Green
        return '#0094cc';                         // Low - Blue
    },
    
    getIntensityColor(value) {
        if (value > 85) return '#ff4757';
        if (value > 70) return '#ff6b35'; 
        if (value > 50) return '#ffb800';
        return '#00ff88';
    },
    
    addFormationInteractions(container) {
        const playerPositions = container.querySelectorAll('.player-position');
        playerPositions.forEach(player => {
            player.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.2)';
                e.target.style.filter = 'brightness(1.3)';
            });
            
            player.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.filter = 'brightness(1)';
            });
        });
    },
    
    initializeVisualizations() {
        this.renderFormationDiagram();
        this.renderTacticalHeatMap();
        this.initializeStyleRadar();
    },
    
    getTacticalData() {
        return {
            formation: this.currentFormation,
            mentality: 'Balanced',
            style: 'Possession',
            defensiveLine: 'Normal',
            width: 'Fairly Wide',
            tempo: 'Normal'
        };
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            const formationSelector = card.querySelector('.formation-selector');
            const heatMapSelector = card.querySelector('.heatmap-selector');
            
            if (body) {
                body.innerHTML = this.getContent();
                this.initializeVisualizations();
            }
            
            if (formationSelector) {
                formationSelector.value = this.currentFormation;
            }
            
            if (heatMapSelector) {
                heatMapSelector.value = this.heatMapMode;
            }
        }
    },
    
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = { formationDiagram: null, tacticalHeatMap: null, styleRadar: null, intensityMeters: null };
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.TacticalOverviewCard);
}

// Add comprehensive styles for tactical overview card
const tacticalOverviewStyles = document.createElement('style');
tacticalOverviewStyles.textContent = `
    .tactical-overview-card .header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .formation-selector,
    .heatmap-selector {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .tactical-overview-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 20px;
        height: 100%;
        overflow: hidden;
    }
    
    .formation-section {
        grid-column: 1 / 2;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .tactical-instructions {
        grid-column: 2 / 3;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .tactical-details {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .formation-pitch-container,
    .tactical-style-radar,
    .heat-map-section,
    .intensity-meters,
    .instruction-sliders,
    .team-mentality {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .tactical-overview-content h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    /* Formation Pitch Styling */
    .formation-pitch {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
        margin-bottom: 15px;
    }
    
    .formation-svg {
        border-radius: 4px;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
    }
    
    .player-position {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .player-position:hover {
        filter: brightness(1.3) drop-shadow(0 2px 6px rgba(255,255,255,0.4));
    }
    
    .player-position.gk {
        filter: drop-shadow(0 2px 4px rgba(255, 184, 0, 0.5));
    }
    
    .player-position.def {
        filter: drop-shadow(0 2px 4px rgba(0, 148, 204, 0.5));
    }
    
    .player-position.mid {
        filter: drop-shadow(0 2px 4px rgba(0, 255, 136, 0.5));
    }
    
    .player-position.att {
        filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.5));
    }
    
    /* Formation Stats */
    .formation-stats-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .stat-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .stat-label {
        font-size: 11px;
        color: #8892a0;
        min-width: 90px;
        font-weight: 500;
    }
    
    .stat-bar {
        flex: 1;
        height: 6px;
        background: var(--neutral-400);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .stat-fill {
        height: 100%;
        background: var(--primary-300);
        transition: width 0.3s ease;
        border-radius: 3px;
    }
    
    .stat-value {
        font-size: 11px;
        color: white;
        font-weight: 600;
        min-width: 30px;
    }
    
    /* Heat Map Styling */
    .heat-map-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
    }
    
    .heat-map-svg {
        border-radius: 4px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    .heat-map-svg rect[data-intensity] {
        transition: opacity 0.3s ease;
    }
    
    .heat-map-svg rect[data-intensity]:hover {
        stroke: rgba(255,255,255,0.8);
        stroke-width: 1;
    }
    
    /* Style Radar Container */
    .style-radar-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 180px;
    }
    
    /* Intensity Meters */
    .meters-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .intensity-meter {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .meter-label {
        font-size: 11px;
        color: #8892a0;
        min-width: 70px;
        font-weight: 500;
    }
    
    .meter-container {
        flex: 1;
        height: 8px;
        background: var(--neutral-400);
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    }
    
    .meter-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
        position: relative;
    }
    
    .meter-fill::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 2px;
        height: 100%;
        background: rgba(255,255,255,0.3);
        animation: meterPulse 2s ease-in-out infinite;
    }
    
    @keyframes meterPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    
    .meter-value {
        font-size: 11px;
        color: white;
        font-weight: 600;
        min-width: 35px;
        text-align: right;
    }
    
    /* Tactical Sliders */
    .instruction-sliders {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .tactical-slider {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .tactical-slider label {
        font-size: 11px;
        color: #8892a0;
        font-weight: 500;
    }
    
    .tactical-slider .slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: var(--neutral-400);
        outline: none;
        appearance: none;
        cursor: pointer;
    }
    
    .tactical-slider .slider::-webkit-slider-thumb {
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-300);
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .tactical-slider .slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-300);
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .slider-value {
        font-size: 11px;
        color: white;
        font-weight: 600;
        text-align: right;
    }
    
    /* Mentality Indicator */
    .mentality-indicator {
        padding: 10px 0;
    }
    
    .mentality-scale {
        position: relative;
        height: 40px;
        background: var(--neutral-300);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .scale-markers {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        padding: 0 15px;
        position: relative;
        z-index: 2;
    }
    
    .marker {
        font-size: 10px;
        color: rgba(255,255,255,0.6);
        font-weight: 500;
        text-align: center;
        flex: 1;
    }
    
    .marker.active {
        color: white;
        font-weight: 600;
    }
    
    .mentality-needle {
        position: absolute;
        top: 50%;
        width: 3px;
        height: 20px;
        background: var(--primary-300);
        border-radius: 2px;
        transform: translate(-50%, -50%);
        transition: left 0.3s ease;
        z-index: 3;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .mentality-needle::before {
        content: '';
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid var(--primary-300);
    }
    
    .mentality-needle::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid var(--primary-300);
    }
    
    /* Responsive Design */
    @media (max-width: 1400px) {
        .tactical-overview-content {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
        }
        
        .formation-section,
        .tactical-instructions {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .tactical-details {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 1200px) {
        .formation-section,
        .tactical-instructions {
            grid-template-columns: 1fr;
        }
        
        .formation-pitch {
            min-height: 250px;
        }
        
        .heat-map-container {
            min-height: 150px;
        }
        
        .style-radar-container {
            min-height: 140px;
        }
    }
    
    @media (max-width: 768px) {
        .tactical-overview-content {
            gap: 15px;
        }
        
        .formation-pitch-container,
        .tactical-style-radar,
        .heat-map-section,
        .intensity-meters,
        .instruction-sliders,
        .team-mentality {
            padding: 12px;
        }
        
        .formation-pitch {
            min-height: 200px;
        }
        
        .heat-map-container {
            min-height: 120px;
        }
        
        .style-radar-container {
            min-height: 120px;
        }
        
        .formation-svg,
        .heat-map-svg {
            max-width: 100%;
            height: auto;
        }
    }
    
    /* Animation enhancements */
    .formation-pitch-container,
    .tactical-style-radar,
    .heat-map-section,
    .intensity-meters {
        animation: fadeInScale 0.4s ease-out;
    }
    
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: scale(0.95);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .player-position {
        animation: playerAppear 0.6s ease-out backwards;
    }
    
    .player-position.gk { animation-delay: 0.1s; }
    .player-position.def { animation-delay: 0.2s; }
    .player-position.mid { animation-delay: 0.3s; }
    .player-position.att { animation-delay: 0.4s; }
    
    @keyframes playerAppear {
        0% {
            opacity: 0;
            transform: scale(0) rotate(180deg);
        }
        70% {
            transform: scale(1.1) rotate(-10deg);
        }
        100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
    
    .meter-fill {
        animation: meterFill 1s ease-out;
    }
    
    @keyframes meterFill {
        0% {
            width: 0%;
        }
    }
    
    .stat-fill {
        animation: statFill 0.8s ease-out 0.2s backwards;
    }
    
    @keyframes statFill {
        0% {
            width: 0%;
        }
    }
`;

document.head.appendChild(tacticalOverviewStyles);