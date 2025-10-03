/* ==========================================
   COMPARISON TOOL - Player comparison interface
   ========================================== */

window.ComparisonTool = class {
    constructor(options = {}) {
        this.options = {
            maxPlayers: 3,
            showRadarChart: true,
            showStatisticalDiff: true,
            showStrengthsWeaknesses: true,
            comparisonMode: 'side-by-side', // 'side-by-side', 'overlay', 'matrix'
            ...options
        };
        
        this.players = [];
        this.element = null;
        this.attributeCategories = {
            technical: ['crossing', 'dribbling', 'finishing', 'first_touch', 'free_kick_taking', 'heading', 'long_shots', 'long_throws', 'marking', 'passing', 'penalty_taking', 'tackling', 'technique'],
            mental: ['aggression', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions', 'determination', 'flair', 'leadership', 'off_the_ball', 'positioning', 'teamwork', 'vision', 'work_rate'],
            physical: ['acceleration', 'agility', 'balance', 'jumping_reach', 'natural_fitness', 'pace', 'stamina', 'strength']
        };
    }

    addPlayer(playerData) {
        if (this.players.length >= this.options.maxPlayers) {
            console.warn(`ComparisonTool: Maximum of ${this.options.maxPlayers} players allowed`);
            return false;
        }

        if (!playerData || !playerData.attributes) {
            console.error('ComparisonTool: Invalid player data');
            return false;
        }

        // Check if player already exists
        const existingPlayer = this.players.find(p => p.id === playerData.id || p.name === playerData.name);
        if (existingPlayer) {
            console.warn('ComparisonTool: Player already in comparison');
            return false;
        }

        this.players.push(playerData);
        this.refresh();
        return true;
    }

    removePlayer(playerId) {
        const index = this.players.findIndex(p => p.id === playerId || p.name === playerId);
        if (index !== -1) {
            this.players.splice(index, 1);
            this.refresh();
            return true;
        }
        return false;
    }

    clearPlayers() {
        this.players = [];
        this.refresh();
    }

    render(container) {
        this.element = document.createElement('div');
        this.element.className = 'comparison-tool-container';
        this.element.innerHTML = this.generateHTML();
        
        if (container) {
            container.appendChild(this.element);
        }

        this.attachEventHandlers();
        return this.element;
    }

    generateHTML() {
        if (this.players.length === 0) {
            return this.renderEmptyState();
        }

        return `
            <div class="comparison-tool">
                <div class="comparison-header">
                    <h2 class="comparison-title">Player Comparison</h2>
                    <div class="comparison-controls">
                        <select class="comparison-mode-select">
                            <option value="side-by-side" ${this.options.comparisonMode === 'side-by-side' ? 'selected' : ''}>Side by Side</option>
                            <option value="overlay" ${this.options.comparisonMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                            <option value="matrix" ${this.options.comparisonMode === 'matrix' ? 'selected' : ''}>Matrix</option>
                        </select>
                        <button class="clear-comparison-btn">Clear All</button>
                    </div>
                </div>
                
                <div class="player-selector">
                    ${this.renderPlayerSelector()}
                </div>
                
                <div class="comparison-content">
                    ${this.renderBasicComparison()}
                    ${this.options.showRadarChart ? this.renderRadarChart() : ''}
                    ${this.renderAttributeComparison()}
                    ${this.options.showStatisticalDiff ? this.renderStatisticalDifferences() : ''}
                    ${this.options.showStrengthsWeaknesses ? this.renderStrengthsWeaknesses() : ''}
                </div>
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="comparison-tool empty-state">
                <div class="empty-message">
                    <h3>No Players Selected</h3>
                    <p>Add up to ${this.options.maxPlayers} players to compare their attributes and performance.</p>
                    <div class="player-selector">
                        ${this.renderPlayerSelector()}
                    </div>
                </div>
            </div>
        `;
    }

    renderPlayerSelector() {
        return `
            <div class="player-selector-controls">
                <input type="text" class="player-search" placeholder="Search for a player to add..." />
                <button class="add-player-btn" disabled>Add Player</button>
            </div>
            <div class="selected-players">
                ${this.players.map((player, index) => `
                    <div class="selected-player" data-player-id="${player.id || player.name}">
                        <img src="${player.photo || '/assets/player-placeholder.png'}" 
                             alt="${player.name}" 
                             class="player-avatar"
                             onerror="this.src='/assets/player-placeholder.png'">
                        <div class="player-info">
                            <span class="player-name">${player.name}</span>
                            <span class="player-position">${player.position}</span>
                        </div>
                        <button class="remove-player-btn" data-player-id="${player.id || player.name}">×</button>
                    </div>
                `).join('')}
                ${this.players.length < this.options.maxPlayers ? `
                    <div class="add-player-slot">
                        <span class="add-icon">+</span>
                        <span class="add-text">Add Player</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderBasicComparison() {
        return `
            <div class="basic-comparison section">
                <h3 class="section-title">Basic Information</h3>
                <div class="basic-comparison-grid">
                    ${this.renderBasicInfoRow('Name', 'name')}
                    ${this.renderBasicInfoRow('Age', 'age')}
                    ${this.renderBasicInfoRow('Position', 'position')}
                    ${this.renderBasicInfoRow('Nationality', 'nationality')}
                    ${this.renderBasicInfoRow('Club', 'club')}
                    ${this.renderBasicInfoRow('Value', 'value')}
                    ${this.renderBasicInfoRow('Current Ability', 'current_ability')}
                    ${this.renderBasicInfoRow('Potential Ability', 'potential_ability')}
                    ${this.renderBasicInfoRow('Height', 'height')}
                    ${this.renderBasicInfoRow('Weight', 'weight')}
                    ${this.renderBasicInfoRow('Preferred Foot', 'preferred_foot')}
                </div>
            </div>
        `;
    }

    renderBasicInfoRow(label, property) {
        return `
            <div class="comparison-row">
                <div class="row-label">${label}</div>
                ${this.players.map((player, index) => `
                    <div class="player-value player-${index}">
                        ${this.formatBasicValue(player[property], property)}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderRadarChart() {
        if (this.players.length < 2) return '';

        return `
            <div class="radar-chart-section section">
                <h3 class="section-title">Attribute Radar Comparison</h3>
                <div class="radar-chart-container">
                    <canvas id="comparison-radar-chart" width="400" height="400"></canvas>
                    <div class="radar-legend">
                        ${this.players.map((player, index) => `
                            <div class="legend-item">
                                <div class="legend-color player-${index}"></div>
                                <span class="legend-name">${player.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="radar-controls">
                    <label for="radar-category">Category:</label>
                    <select id="radar-category">
                        <option value="all">All Attributes</option>
                        <option value="technical">Technical</option>
                        <option value="mental">Mental</option>
                        <option value="physical">Physical</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderAttributeComparison() {
        return `
            <div class="attribute-comparison-section section">
                <h3 class="section-title">Detailed Attribute Comparison</h3>
                <div class="attribute-categories">
                    ${Object.entries(this.attributeCategories).map(([category, attributes]) => `
                        <div class="attribute-category">
                            <h4 class="category-title">${this.formatCategoryName(category)}</h4>
                            <div class="attribute-grid">
                                ${attributes.map(attr => this.renderAttributeRow(attr)).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderAttributeRow(attribute) {
        const values = this.players.map(player => player.attributes[attribute] || 0);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);

        return `
            <div class="attribute-row">
                <div class="attribute-name">${this.formatAttributeName(attribute)}</div>
                ${this.players.map((player, index) => {
                    const value = player.attributes[attribute] || 0;
                    const isMax = value === maxValue && maxValue !== minValue;
                    const isMin = value === minValue && maxValue !== minValue;
                    
                    return `
                        <div class="attribute-value player-${index} ${isMax ? 'best' : ''} ${isMin ? 'worst' : ''}">
                            <div class="value-bar">
                                <div class="value-fill" style="width: ${value * 5}%"></div>
                            </div>
                            <span class="value-text">${value}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderStatisticalDifferences() {
        if (this.players.length < 2) return '';

        return `
            <div class="statistical-differences section">
                <h3 class="section-title">Statistical Analysis</h3>
                <div class="stats-grid">
                    ${this.renderStatisticalGrid()}
                </div>
                <div class="difference-matrix">
                    ${this.renderDifferenceMatrix()}
                </div>
            </div>
        `;
    }

    renderStatisticalGrid() {
        const stats = this.calculatePlayerStatistics();
        
        return `
            <div class="stats-table">
                <div class="stats-header">
                    <div class="stat-label">Player</div>
                    <div class="stat-label">Avg Score</div>
                    <div class="stat-label">Top 5 Avg</div>
                    <div class="stat-label">Variance</div>
                    <div class="stat-label">Strengths</div>
                    <div class="stat-label">Weaknesses</div>
                </div>
                ${this.players.map((player, index) => {
                    const playerStats = stats[index];
                    return `
                        <div class="stats-row player-${index}">
                            <div class="stat-value">${player.name}</div>
                            <div class="stat-value">${playerStats.average.toFixed(1)}</div>
                            <div class="stat-value">${playerStats.topFiveAverage.toFixed(1)}</div>
                            <div class="stat-value">${playerStats.variance.toFixed(1)}</div>
                            <div class="stat-value">${playerStats.strengthsCount}</div>
                            <div class="stat-value">${playerStats.weaknessesCount}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderDifferenceMatrix() {
        if (this.players.length !== 2) return '';

        const differences = this.calculateAttributeDifferences();
        
        return `
            <div class="difference-matrix-container">
                <h4>Head-to-Head Differences</h4>
                <div class="difference-list">
                    ${differences.map(diff => `
                        <div class="difference-item ${diff.advantage}">
                            <span class="diff-attribute">${this.formatAttributeName(diff.attribute)}</span>
                            <span class="diff-values">${diff.player1Value} vs ${diff.player2Value}</span>
                            <span class="diff-amount">${diff.difference > 0 ? '+' : ''}${diff.difference}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderStrengthsWeaknesses() {
        return `
            <div class="strengths-weaknesses section">
                <h3 class="section-title">Strengths & Weaknesses Analysis</h3>
                <div class="sw-grid">
                    ${this.players.map((player, index) => {
                        const analysis = this.analyzePlayerStrengthsWeaknesses(player);
                        return `
                            <div class="player-analysis player-${index}">
                                <h4 class="player-analysis-title">${player.name}</h4>
                                <div class="sw-content">
                                    <div class="strengths">
                                        <h5>Strengths</h5>
                                        <ul>
                                            ${analysis.strengths.map(strength => 
                                                `<li><span class="attribute">${this.formatAttributeName(strength.attribute)}</span> 
                                                <span class="value">(${strength.value})</span></li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                    <div class="weaknesses">
                                        <h5>Weaknesses</h5>
                                        <ul>
                                            ${analysis.weaknesses.map(weakness => 
                                                `<li><span class="attribute">${this.formatAttributeName(weakness.attribute)}</span> 
                                                <span class="value">(${weakness.value})</span></li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                </div>
                                <div class="overall-rating">
                                    <span class="rating-label">Overall Rating:</span>
                                    <span class="rating-value">${analysis.overallRating.toFixed(1)}/20</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    attachEventHandlers() {
        if (!this.element) return;

        // Player removal
        const removeButtons = this.element.querySelectorAll('.remove-player-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const playerId = e.target.dataset.playerId;
                this.removePlayer(playerId);
            });
        });

        // Clear all
        const clearBtn = this.element.querySelector('.clear-comparison-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearPlayers();
            });
        }

        // Comparison mode change
        const modeSelect = this.element.querySelector('.comparison-mode-select');
        if (modeSelect) {
            modeSelect.addEventListener('change', (e) => {
                this.options.comparisonMode = e.target.value;
                this.refresh();
            });
        }

        // Radar chart category change
        const radarCategory = this.element.querySelector('#radar-category');
        if (radarCategory) {
            radarCategory.addEventListener('change', (e) => {
                this.updateRadarChart(e.target.value);
            });
        }

        // Player search
        const searchInput = this.element.querySelector('.player-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handlePlayerSearch(e.target.value);
            });
        }

        // Initialize radar chart if needed
        if (this.options.showRadarChart && this.players.length >= 2) {
            setTimeout(() => this.initializeRadarChart(), 100);
        }
    }

    initializeRadarChart() {
        const canvas = this.element.querySelector('#comparison-radar-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.drawRadarChart(ctx, 'all');
    }

    drawRadarChart(ctx, category) {
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get attributes for the category
        const attributes = category === 'all' 
            ? Object.values(this.attributeCategories).flat()
            : this.attributeCategories[category] || [];

        if (attributes.length === 0) return;

        const angleStep = (2 * Math.PI) / attributes.length;

        // Draw radar grid
        this.drawRadarGrid(ctx, centerX, centerY, radius, attributes.length);

        // Draw attribute labels
        this.drawRadarLabels(ctx, centerX, centerY, radius + 20, attributes, angleStep);

        // Draw player data
        this.players.forEach((player, index) => {
            this.drawPlayerRadar(ctx, player, attributes, centerX, centerY, radius, angleStep, index);
        });
    }

    drawRadarGrid(ctx, centerX, centerY, radius, sides) {
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1;

        // Draw concentric circles
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (radius * i) / 4, 0, 2 * Math.PI);
            ctx.stroke();
        }

        // Draw spokes
        const angleStep = (2 * Math.PI) / sides;
        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    drawRadarLabels(ctx, centerX, centerY, radius, attributes, angleStep) {
        ctx.fillStyle = '#8892a0';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        attributes.forEach((attr, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const label = this.formatAttributeName(attr);
            ctx.fillText(label, x, y);
        });
    }

    drawPlayerRadar(ctx, player, attributes, centerX, centerY, radius, angleStep, playerIndex) {
        const colors = ['#FF6B35', '#00CED1', '#FFD700'];
        const color = colors[playerIndex % colors.length];
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color + '20'; // Add transparency
        ctx.lineWidth = 2;

        const points = [];
        attributes.forEach((attr, index) => {
            const value = player.attributes[attr] || 0;
            const normalizedValue = value / 20; // Normalize to 0-1
            const pointRadius = radius * normalizedValue;
            
            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * pointRadius;
            const y = centerY + Math.sin(angle) * pointRadius;
            
            points.push({ x, y });
        });

        // Draw filled area
        ctx.beginPath();
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.closePath();
        ctx.fill();

        // Draw outline
        ctx.beginPath();
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.closePath();
        ctx.stroke();

        // Draw points
        ctx.fillStyle = color;
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    updateRadarChart(category) {
        const canvas = this.element.querySelector('#comparison-radar-chart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            this.drawRadarChart(ctx, category);
        }
    }

    // Analysis methods
    calculatePlayerStatistics() {
        return this.players.map(player => {
            const attributes = player.attributes;
            const values = Object.values(attributes).filter(v => typeof v === 'number');
            
            if (values.length === 0) {
                return {
                    average: 0,
                    topFiveAverage: 0,
                    variance: 0,
                    strengthsCount: 0,
                    weaknessesCount: 0
                };
            }

            const average = values.reduce((sum, val) => sum + val, 0) / values.length;
            const topFive = values.sort((a, b) => b - a).slice(0, 5);
            const topFiveAverage = topFive.reduce((sum, val) => sum + val, 0) / topFive.length;
            
            const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
            
            const strengthsCount = values.filter(v => v >= 15).length;
            const weaknessesCount = values.filter(v => v <= 8).length;

            return {
                average,
                topFiveAverage,
                variance,
                strengthsCount,
                weaknessesCount
            };
        });
    }

    calculateAttributeDifferences() {
        if (this.players.length !== 2) return [];

        const player1 = this.players[0];
        const player2 = this.players[1];
        const differences = [];

        Object.keys(player1.attributes).forEach(attr => {
            const value1 = player1.attributes[attr] || 0;
            const value2 = player2.attributes[attr] || 0;
            const difference = value1 - value2;

            if (difference !== 0) {
                differences.push({
                    attribute: attr,
                    player1Value: value1,
                    player2Value: value2,
                    difference,
                    advantage: difference > 0 ? 'player-0' : 'player-1'
                });
            }
        });

        return differences.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
    }

    analyzePlayerStrengthsWeaknesses(player) {
        const attributes = player.attributes;
        const attributeList = Object.entries(attributes)
            .filter(([attr, value]) => typeof value === 'number')
            .map(([attr, value]) => ({ attribute: attr, value }));

        // Sort by value
        attributeList.sort((a, b) => b.value - a.value);

        const strengths = attributeList.filter(attr => attr.value >= 15).slice(0, 5);
        const weaknesses = attributeList.filter(attr => attr.value <= 8).slice(0, 5);
        
        const totalValue = attributeList.reduce((sum, attr) => sum + attr.value, 0);
        const overallRating = totalValue / attributeList.length;

        return {
            strengths,
            weaknesses,
            overallRating
        };
    }

    handlePlayerSearch(query) {
        // This would integrate with the player database
        // For now, just enable/disable the add button
        const addBtn = this.element.querySelector('.add-player-btn');
        if (addBtn) {
            addBtn.disabled = query.length < 3;
        }
    }

    // Utility methods
    formatBasicValue(value, property) {
        if (value === null || value === undefined) return 'N/A';
        
        switch (property) {
            case 'current_ability':
            case 'potential_ability':
                return `${value}/200`;
            case 'value':
                return value || 'Unknown';
            default:
                return value;
        }
    }

    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatAttributeName(attr) {
        return attr.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Public methods
    refresh() {
        if (this.element) {
            this.element.innerHTML = this.generateHTML();
            this.attachEventHandlers();
        }
    }

    getPlayers() {
        return [...this.players];
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        this.players = [];
    }

    // Static method for quick comparisons
    static compare(player1, player2, container) {
        const tool = new ComparisonTool();
        tool.addPlayer(player1);
        tool.addPlayer(player2);
        return tool.render(container);
    }
}

// Add CSS styles for comparison tool
const comparisonStyles = document.createElement('style');
comparisonStyles.textContent = `
    .comparison-tool-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .comparison-tool {
        background: var(--neutral-300);
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    .comparison-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: var(--neutral-200);
        border-bottom: 1px solid var(--neutral-400);
    }

    .comparison-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: white;
        margin: 0;
    }

    .comparison-controls {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .comparison-mode-select {
        padding: 6px 10px;
        background: var(--neutral-400);
        border: 1px solid var(--neutral-300);
        border-radius: var(--border-radius);
        color: white;
        cursor: pointer;
    }

    .clear-comparison-btn {
        padding: 6px 12px;
        background: var(--accent-400);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: var(--font-size-sm);
    }

    .clear-comparison-btn:hover {
        background: #d32f2f;
    }

    /* Empty State */
    .empty-state {
        padding: 40px;
        text-align: center;
    }

    .empty-message h3 {
        color: white;
        margin: 0 0 10px 0;
    }

    .empty-message p {
        color: #8892a0;
        margin: 0 0 20px 0;
    }

    /* Player Selector */
    .player-selector {
        padding: 20px;
        background: var(--neutral-200);
        border-bottom: 1px solid var(--neutral-400);
    }

    .player-selector-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    .player-search {
        flex: 1;
        padding: 8px 12px;
        background: var(--neutral-400);
        border: 1px solid var(--neutral-300);
        border-radius: var(--border-radius);
        color: white;
    }

    .player-search::placeholder {
        color: #8892a0;
    }

    .add-player-btn {
        padding: 8px 16px;
        background: var(--primary-300);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
    }

    .add-player-btn:disabled {
        background: var(--neutral-400);
        cursor: not-allowed;
    }

    .selected-players {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .selected-player {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--neutral-300);
        padding: 10px;
        border-radius: var(--border-radius);
        border: 2px solid transparent;
    }

    .selected-player.player-0 { border-color: #FF6B35; }
    .selected-player.player-1 { border-color: #00CED1; }
    .selected-player.player-2 { border-color: #FFD700; }

    .player-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    .player-info {
        display: flex;
        flex-direction: column;
    }

    .player-name {
        color: white;
        font-weight: 500;
        font-size: var(--font-size-sm);
    }

    .player-position {
        color: #8892a0;
        font-size: var(--font-size-xs);
    }

    .remove-player-btn {
        background: var(--accent-400);
        color: white;
        border: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .add-player-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--neutral-400);
        border: 2px dashed #8892a0;
        border-radius: var(--border-radius);
        padding: 15px 20px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .add-player-slot:hover {
        background: var(--neutral-300);
    }

    .add-icon {
        font-size: 24px;
        color: #8892a0;
        margin-bottom: 5px;
    }

    .add-text {
        color: #8892a0;
        font-size: var(--font-size-sm);
    }

    /* Comparison Content */
    .comparison-content {
        padding: 20px;
    }

    .section {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--neutral-400);
    }

    .section:last-child {
        border-bottom: none;
    }

    .section-title {
        font-size: var(--font-size-md);
        font-weight: 600;
        color: white;
        margin: 0 0 15px 0;
    }

    /* Basic Comparison */
    .basic-comparison-grid {
        display: grid;
        gap: 8px;
    }

    .comparison-row {
        display: grid;
        grid-template-columns: 150px repeat(var(--player-count, 3), 1fr);
        gap: 10px;
        align-items: center;
        padding: 8px;
        background: var(--neutral-200);
        border-radius: var(--border-radius);
    }

    .row-label {
        font-weight: 500;
        color: #8892a0;
        font-size: var(--font-size-sm);
    }

    .player-value {
        color: white;
        font-size: var(--font-size-sm);
        text-align: center;
        padding: 5px;
        border-radius: 3px;
    }

    .player-value.player-0 { background: rgba(255, 107, 53, 0.2); }
    .player-value.player-1 { background: rgba(0, 206, 209, 0.2); }
    .player-value.player-2 { background: rgba(255, 215, 0, 0.2); }

    /* Radar Chart */
    .radar-chart-container {
        display: flex;
        align-items: center;
        gap: 30px;
        justify-content: center;
        margin-bottom: 15px;
    }

    .radar-legend {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .legend-color {
        width: 20px;
        height: 4px;
        border-radius: 2px;
    }

    .legend-color.player-0 { background: #FF6B35; }
    .legend-color.player-1 { background: #00CED1; }
    .legend-color.player-2 { background: #FFD700; }

    .legend-name {
        color: white;
        font-size: var(--font-size-sm);
    }

    .radar-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: center;
    }

    .radar-controls label {
        color: #8892a0;
        font-size: var(--font-size-sm);
    }

    .radar-controls select {
        padding: 4px 8px;
        background: var(--neutral-400);
        border: 1px solid var(--neutral-300);
        border-radius: var(--border-radius);
        color: white;
    }

    /* Attribute Comparison */
    .attribute-categories {
        display: grid;
        gap: 20px;
    }

    .attribute-category {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }

    .category-title {
        font-size: var(--font-size-md);
        color: var(--primary-300);
        margin: 0 0 10px 0;
    }

    .attribute-grid {
        display: grid;
        gap: 6px;
    }

    .attribute-row {
        display: grid;
        grid-template-columns: 150px repeat(var(--player-count, 3), 1fr);
        gap: 10px;
        align-items: center;
        padding: 5px;
    }

    .attribute-name {
        font-size: var(--font-size-sm);
        color: #8892a0;
    }

    .attribute-value {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 3px;
        transition: background-color 0.2s ease;
    }

    .attribute-value.best {
        background: rgba(76, 175, 80, 0.3);
    }

    .attribute-value.worst {
        background: rgba(244, 67, 54, 0.3);
    }

    .value-bar {
        flex: 1;
        height: 4px;
        background: var(--neutral-400);
        border-radius: 2px;
        overflow: hidden;
    }

    .value-fill {
        height: 100%;
        background: var(--primary-300);
        transition: width 0.3s ease;
    }

    .value-text {
        font-size: var(--font-size-xs);
        color: white;
        font-weight: 500;
        min-width: 20px;
        text-align: right;
    }

    /* Statistical Differences */
    .stats-grid {
        margin-bottom: 20px;
    }

    .stats-table {
        display: grid;
        gap: 5px;
    }

    .stats-header,
    .stats-row {
        display: grid;
        grid-template-columns: 150px repeat(5, 1fr);
        gap: 10px;
        padding: 8px;
        border-radius: var(--border-radius);
    }

    .stats-header {
        background: var(--neutral-400);
    }

    .stats-row {
        background: var(--neutral-200);
    }

    .stat-label {
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: white;
    }

    .stat-value {
        font-size: var(--font-size-sm);
        color: white;
        text-align: center;
    }

    .difference-matrix-container h4 {
        color: white;
        margin: 0 0 10px 0;
    }

    .difference-list {
        display: grid;
        gap: 5px;
        max-height: 300px;
        overflow-y: auto;
    }

    .difference-item {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 10px;
        padding: 8px;
        background: var(--neutral-200);
        border-radius: var(--border-radius);
        align-items: center;
    }

    .difference-item.player-0 {
        border-left: 4px solid #FF6B35;
    }

    .difference-item.player-1 {
        border-left: 4px solid #00CED1;
    }

    .diff-attribute {
        color: white;
        font-size: var(--font-size-sm);
    }

    .diff-values {
        color: #8892a0;
        font-size: var(--font-size-xs);
    }

    .diff-amount {
        color: white;
        font-weight: 600;
        font-size: var(--font-size-sm);
        text-align: right;
    }

    /* Strengths & Weaknesses */
    .sw-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .player-analysis {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        border-top: 4px solid;
    }

    .player-analysis.player-0 { border-top-color: #FF6B35; }
    .player-analysis.player-1 { border-top-color: #00CED1; }
    .player-analysis.player-2 { border-top-color: #FFD700; }

    .player-analysis-title {
        color: white;
        margin: 0 0 15px 0;
        font-size: var(--font-size-md);
    }

    .sw-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
    }

    .strengths h5,
    .weaknesses h5 {
        color: white;
        margin: 0 0 8px 0;
        font-size: var(--font-size-sm);
    }

    .strengths h5 {
        color: var(--accent-200);
    }

    .weaknesses h5 {
        color: var(--accent-400);
    }

    .strengths ul,
    .weaknesses ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .strengths li,
    .weaknesses li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3px 0;
        border-bottom: 1px solid var(--neutral-400);
        font-size: var(--font-size-xs);
    }

    .strengths li:last-child,
    .weaknesses li:last-child {
        border-bottom: none;
    }

    .attribute {
        color: white;
        flex: 1;
    }

    .value {
        color: #8892a0;
        font-weight: 600;
    }

    .overall-rating {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        border-top: 1px solid var(--neutral-400);
    }

    .rating-label {
        color: #8892a0;
        font-size: var(--font-size-sm);
    }

    .rating-value {
        color: white;
        font-weight: 600;
        font-size: var(--font-size-sm);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .comparison-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }

        .radar-chart-container {
            flex-direction: column;
            gap: 15px;
        }

        .radar-legend {
            flex-direction: row;
            justify-content: center;
        }

        .comparison-row,
        .attribute-row,
        .stats-header,
        .stats-row {
            grid-template-columns: 1fr;
            gap: 5px;
        }

        .sw-content {
            grid-template-columns: 1fr;
        }

        .selected-players {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(comparisonStyles);