/* ==========================================
   TEAM ANALYSIS CARD - Team-wide Statistics with Visualizations
   ========================================== */

window.TeamAnalysisCard = {
    id: 'team-analysis',
    title: 'Team Analysis',
    pages: ['squad', 'tactics', 'overview'],
    size: 'wide tall',
    
    charts: {
        positionStrength: null,
        ageDistribution: null,
        wageStructure: null
    },
    
    render() {
        return {
            className: 'card wide tall team-analysis-card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <div class="header-controls">
                        <button class="tab-btn active" data-tab="overview" onclick="window.TeamAnalysisCard.switchTab('overview')">Overview</button>
                        <button class="tab-btn" data-tab="positions" onclick="window.TeamAnalysisCard.switchTab('positions')">Positions</button>
                        <button class="tab-btn" data-tab="finance" onclick="window.TeamAnalysisCard.switchTab('finance')">Finance</button>
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
            <div class="team-analysis-content">
                <div class="tab-content" data-tab="overview">
                    ${this.renderOverviewTab()}
                </div>
                <div class="tab-content" data-tab="positions" style="display: none;">
                    ${this.renderPositionsTab()}
                </div>
                <div class="tab-content" data-tab="finance" style="display: none;">
                    ${this.renderFinanceTab()}
                </div>
            </div>
        `;
    },
    
    renderOverviewTab() {
        const teamStats = this.getTeamStatistics();
        return `
            <div class="overview-grid">
                <div class="stat-card">
                    <h4>Squad Size</h4>
                    <div class="stat-value">${teamStats.squadSize}</div>
                    <div class="stat-subtitle">Total Players</div>
                </div>
                <div class="stat-card">
                    <h4>Average Age</h4>
                    <div class="stat-value">${teamStats.averageAge}</div>
                    <div class="stat-subtitle">Years</div>
                </div>
                <div class="stat-card">
                    <h4>Squad Value</h4>
                    <div class="stat-value">${teamStats.totalValue}</div>
                    <div class="stat-subtitle">Market Value</div>
                </div>
                <div class="stat-card">
                    <h4>Foreign Players</h4>
                    <div class="stat-value">${teamStats.foreignPlayers}</div>
                    <div class="stat-subtitle">Non-domestic</div>
                </div>
                
                <div class="chart-section age-chart-section">
                    <h4>Age Distribution</h4>
                    <div class="chart-container">
                        <div id="age-distribution-chart-${this.id}"></div>
                    </div>
                </div>
                
                <div class="chart-section position-strength-section">
                    <h4>Position Strength</h4>
                    <div class="chart-container">
                        <div id="position-strength-chart-${this.id}"></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPositionsTab() {
        return `
            <div class="positions-analysis">
                <div class="position-breakdown">
                    <h4>Position Analysis</h4>
                    <div class="position-grid">
                        ${this.renderPositionBreakdown()}
                    </div>
                </div>
                
                <div class="formation-visualization">
                    <h4>Squad Depth by Position</h4>
                    <div class="formation-grid">
                        ${this.renderFormationDepth()}
                    </div>
                </div>
            </div>
        `;
    },
    
    renderFinanceTab() {
        return `
            <div class="finance-analysis">
                <div class="wage-overview">
                    <h4>Wage Structure</h4>
                    <div class="wage-stats">
                        ${this.renderWageStatistics()}
                    </div>
                </div>
                
                <div class="wage-chart-section">
                    <h4>Wage Distribution</h4>
                    <div class="chart-container">
                        <div id="wage-structure-chart-${this.id}"></div>
                    </div>
                </div>
                
                <div class="value-breakdown">
                    <h4>Value Analysis</h4>
                    <div class="value-chart-container">
                        <div id="value-breakdown-chart-${this.id}"></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderPositionBreakdown() {
        const positions = this.getPositionData();
        return positions.map(pos => `
            <div class="position-item">
                <div class="position-header">
                    <span class="position-name">${pos.name}</span>
                    <span class="position-count">${pos.count} players</span>
                </div>
                <div class="position-details">
                    <div class="detail-item">
                        <span class="detail-label">Avg Rating</span>
                        <span class="detail-value rating-${this.getRatingClass(pos.avgRating)}">${pos.avgRating}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Avg Age</span>
                        <span class="detail-value">${pos.avgAge}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Value</span>
                        <span class="detail-value">${pos.totalValue}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    renderFormationDepth() {
        const formation = {
            GK: { players: 2, strength: 85 },
            CB: { players: 4, strength: 78 },
            LB: { players: 2, strength: 72 },
            RB: { players: 2, strength: 75 },
            DM: { players: 2, strength: 80 },
            CM: { players: 4, strength: 82 },
            AM: { players: 3, strength: 88 },
            LW: { players: 3, strength: 85 },
            RW: { players: 2, strength: 79 },
            ST: { players: 3, strength: 83 }
        };
        
        return Object.entries(formation).map(([pos, data]) => `
            <div class="formation-position">
                <div class="position-label">${pos}</div>
                <div class="position-depth">
                    <div class="depth-indicator">
                        <div class="depth-fill" style="width: ${(data.players / 5) * 100}%"></div>
                    </div>
                    <span class="depth-count">${data.players}</span>
                </div>
                <div class="position-strength">
                    <div class="strength-bar">
                        <div class="strength-fill" style="width: ${data.strength}%; background: ${this.getStrengthColor(data.strength)}"></div>
                    </div>
                    <span class="strength-value">${data.strength}</span>
                </div>
            </div>
        `).join('');
    },
    
    renderWageStatistics() {
        const wageStats = this.getWageStatistics();
        return `
            <div class="wage-stats-grid">
                <div class="wage-stat">
                    <span class="wage-label">Total Weekly Wages</span>
                    <span class="wage-value">${wageStats.totalWeekly}</span>
                </div>
                <div class="wage-stat">
                    <span class="wage-label">Average Weekly Wage</span>
                    <span class="wage-value">${wageStats.averageWeekly}</span>
                </div>
                <div class="wage-stat">
                    <span class="wage-label">Highest Earner</span>
                    <span class="wage-value">${wageStats.highestEarner}</span>
                </div>
                <div class="wage-stat">
                    <span class="wage-label">Wage/Value Ratio</span>
                    <span class="wage-value">${wageStats.wageValueRatio}</span>
                </div>
            </div>
        `;
    },
    
    switchTab(tabName) {
        // Update tab buttons
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (!card) return;
        
        card.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        card.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = content.dataset.tab === tabName ? 'block' : 'none';
        });
        
        // Initialize charts for the active tab
        setTimeout(() => this.initializeChartsForTab(tabName), 100);
    },
    
    initializeChartsForTab(tabName) {
        switch (tabName) {
            case 'overview':
                this.initializeAgeDistributionChart();
                this.initializePositionStrengthChart();
                break;
            case 'finance':
                this.initializeWageStructureChart();
                this.initializeValueBreakdownChart();
                break;
        }
    },
    
    initializeAgeDistributionChart() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`age-distribution-chart-${this.id}`);
        if (!container) return;
        
        const ageData = [
            { label: '18-21', value: 5, color: '#00ff88' },
            { label: '22-25', value: 8, color: '#00d4aa' },
            { label: '26-29', value: 12, color: '#0094cc' },
            { label: '30-33', value: 6, color: '#8066ff' },
            { label: '34+', value: 2, color: '#cc6600' }
        ];
        
        this.charts.ageDistribution = new window.BarChart({
            container: container,
            data: ageData,
            orientation: 'vertical',
            showValues: true,
            animate: true,
            maxHeight: 150
        });
    },
    
    initializePositionStrengthChart() {
        if (!window.PizzaChart) return;
        
        const container = document.getElementById(`position-strength-chart-${this.id}`);
        if (!container) return;
        
        const positionData = [
            { label: 'Attack', value: 85, color: '#ff6b35' },
            { label: 'Midfield', value: 82, color: '#00d4aa' },
            { label: 'Defense', value: 78, color: '#0094cc' },
            { label: 'Goalkeeping', value: 88, color: '#ffb800' }
        ];
        
        this.charts.positionStrength = new window.PizzaChart({
            container: container,
            data: positionData,
            type: 'doughnut',
            size: 140,
            showLegend: false,
            showValues: true,
            animate: true
        });
    },
    
    initializeWageStructureChart() {
        if (!window.PizzaChart) return;
        
        const container = document.getElementById(`wage-structure-chart-${this.id}`);
        if (!container) return;
        
        const wageData = [
            { label: 'High Earners (>£150k)', value: 4, color: '#ff4757' },
            { label: 'Mid Earners (£50-150k)', value: 12, color: '#ffa726' },
            { label: 'Squad Players (<£50k)', value: 17, color: '#00d4aa' }
        ];
        
        this.charts.wageStructure = new window.PizzaChart({
            container: container,
            data: wageData,
            type: 'doughnut',
            size: 160,
            showLegend: true,
            showPercentages: true,
            animate: true
        });
    },
    
    initializeValueBreakdownChart() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`value-breakdown-chart-${this.id}`);
        if (!container) return;
        
        const valueData = [
            { label: 'Attack', value: 285, color: '#ff6b35' },
            { label: 'Midfield', value: 195, color: '#00d4aa' },
            { label: 'Defense', value: 155, color: '#0094cc' },
            { label: 'Goalkeeping', value: 45, color: '#ffb800' }
        ];
        
        new window.BarChart({
            container: container,
            data: valueData,
            orientation: 'horizontal',
            showValues: true,
            valuePrefix: '£',
            valueSuffix: 'M',
            animate: true,
            maxHeight: 120
        });
    },
    
    // Data methods
    getTeamStatistics() {
        return {
            squadSize: 33,
            averageAge: '26.3',
            totalValue: '£680M',
            foreignPlayers: '18/33'
        };
    },
    
    getPositionData() {
        return [
            { name: 'Goalkeeper', count: 2, avgRating: 7.8, avgAge: 28, totalValue: '£45M' },
            { name: 'Centre-back', count: 4, avgRating: 7.4, avgAge: 25, totalValue: '£155M' },
            { name: 'Full-back', count: 4, avgRating: 7.2, avgAge: 24, totalValue: '£85M' },
            { name: 'Defensive Mid', count: 2, avgRating: 7.6, avgAge: 29, totalValue: '£95M' },
            { name: 'Central Mid', count: 6, avgRating: 7.8, avgAge: 26, totalValue: '£165M' },
            { name: 'Attacking Mid', count: 3, avgRating: 8.1, avgAge: 27, totalValue: '£85M' },
            { name: 'Winger', count: 6, avgRating: 7.5, avgAge: 25, totalValue: '£190M' },
            { name: 'Striker', count: 3, avgRating: 7.9, avgAge: 28, totalValue: '£145M' }
        ];
    },
    
    getWageStatistics() {
        return {
            totalWeekly: '£2.8M',
            averageWeekly: '£84k',
            highestEarner: '£350k (M. Rashford)',
            wageValueRatio: '4.2%'
        };
    },
    
    getRatingClass(rating) {
        if (rating >= 8.0) return 'excellent';
        if (rating >= 7.0) return 'good';
        if (rating >= 6.0) return 'average';
        return 'poor';
    },
    
    getStrengthColor(strength) {
        if (strength >= 85) return '#00ff88';
        if (strength >= 75) return '#00d4aa';
        if (strength >= 65) return '#ffa726';
        return '#ff4757';
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.getContent();
                // Re-initialize active tab charts
                const activeTab = card.querySelector('.tab-btn.active')?.dataset.tab || 'overview';
                setTimeout(() => this.initializeChartsForTab(activeTab), 100);
            }
        }
    },
    
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = { positionStrength: null, ageDistribution: null, wageStructure: null };
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.TeamAnalysisCard);
}

// Add custom styles for team analysis card
const teamAnalysisStyles = document.createElement('style');
teamAnalysisStyles.textContent = `
    .team-analysis-card .header-controls {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .tab-btn {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: rgba(255,255,255,0.7);
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .tab-btn:hover {
        background: var(--neutral-300);
        color: white;
    }
    
    .tab-btn.active {
        background: var(--primary-300);
        color: white;
        border-color: var(--primary-400);
    }
    
    .team-analysis-content {
        height: 100%;
        overflow-y: auto;
    }
    
    .tab-content {
        height: 100%;
    }
    
    /* Overview Tab Styles */
    .overview-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto auto;
        gap: 15px;
        height: 100%;
    }
    
    .stat-card {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        text-align: center;
    }
    
    .stat-card h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
        color: #8892a0;
        font-weight: 500;
    }
    
    .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin-bottom: 4px;
    }
    
    .stat-subtitle {
        font-size: 10px;
        color: rgba(255,255,255,0.6);
    }
    
    .chart-section {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        grid-column: span 2;
    }
    
    .chart-section h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .chart-container {
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    /* Positions Tab Styles */
    .positions-analysis {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        height: 100%;
    }
    
    .position-breakdown,
    .formation-visualization {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .position-breakdown h4,
    .formation-visualization h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .position-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .position-item {
        background: var(--neutral-300);
        padding: 10px;
        border-radius: 4px;
    }
    
    .position-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .position-name {
        font-weight: 600;
        color: white;
        font-size: 12px;
    }
    
    .position-count {
        font-size: 10px;
        color: rgba(255,255,255,0.6);
    }
    
    .position-details {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .detail-label {
        font-size: 9px;
        color: #8892a0;
        margin-bottom: 2px;
    }
    
    .detail-value {
        font-size: 11px;
        font-weight: 600;
        color: white;
    }
    
    .formation-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .formation-position {
        background: var(--neutral-300);
        padding: 8px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .position-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--primary-300);
        text-align: center;
    }
    
    .position-depth {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .depth-indicator {
        flex: 1;
        height: 4px;
        background: var(--neutral-400);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .depth-fill {
        height: 100%;
        background: var(--accent-200);
        transition: width 0.3s ease;
    }
    
    .depth-count {
        font-size: 10px;
        color: white;
        min-width: 10px;
    }
    
    .position-strength {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .strength-bar {
        flex: 1;
        height: 4px;
        background: var(--neutral-400);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .strength-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
    
    .strength-value {
        font-size: 10px;
        color: white;
        min-width: 15px;
    }
    
    /* Finance Tab Styles */
    .finance-analysis {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
        gap: 20px;
        height: 100%;
    }
    
    .wage-overview {
        grid-column: 1 / -1;
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .wage-overview h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .wage-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
    }
    
    .wage-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 10px;
        background: var(--neutral-300);
        border-radius: 4px;
    }
    
    .wage-label {
        font-size: 10px;
        color: #8892a0;
        margin-bottom: 5px;
    }
    
    .wage-value {
        font-size: 14px;
        font-weight: 600;
        color: white;
    }
    
    .wage-chart-section,
    .value-breakdown {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .wage-chart-section h4,
    .value-breakdown h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .value-chart-container {
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    /* Rating colors */
    .rating-excellent { color: var(--accent-200); }
    .rating-good { color: var(--accent-300); }
    .rating-average { color: #8892a0; }
    .rating-poor { color: var(--accent-400); }
    
    /* Responsive adjustments */
    @media (max-width: 1200px) {
        .overview-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, auto);
        }
        
        .chart-section {
            grid-column: span 1;
        }
        
        .wage-stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 768px) {
        .overview-grid {
            grid-template-columns: 1fr;
        }
        
        .positions-analysis,
        .finance-analysis {
            grid-template-columns: 1fr;
        }
        
        .wage-stats-grid {
            grid-template-columns: 1fr;
        }
        
        .position-details {
            grid-template-columns: 1fr;
        }
        
        .formation-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(teamAnalysisStyles);