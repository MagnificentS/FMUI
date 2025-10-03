/* ==========================================
   FINANCIAL OVERVIEW CARD - Modular Component
   ========================================== */

window.FinancialOverviewCard = {
    id: 'financial-overview',
    title: 'Financial Overview',
    pages: ['finances', 'overview'],
    size: 'extra-wide tall',
    
    // Forest of Thoughts Financial Visualization State
    currentPeriod: 'season',
    viewMode: 'overview',
    charts: {
        revenueBreakdown: null,
        monthlyTrend: null,
        expenseAnalysis: null,
        ffpTracking: null,
        budgetComparison: null
    },
    
    render() {
        return {
            className: 'card extra-wide tall financial-overview-card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <div class="header-controls">
                        <select class="period-selector" onchange="window.FinancialOverviewCard.changePeriod(this.value)">
                            <option value="month" ${this.currentPeriod === 'month' ? 'selected' : ''}>This Month</option>
                            <option value="season" ${this.currentPeriod === 'season' ? 'selected' : ''}>This Season</option>
                            <option value="year" ${this.currentPeriod === 'year' ? 'selected' : ''}>Financial Year</option>
                            <option value="3year" ${this.currentPeriod === '3year' ? 'selected' : ''}>3 Year View</option>
                        </select>
                        <select class="view-selector" onchange="window.FinancialOverviewCard.changeView(this.value)">
                            <option value="overview" ${this.viewMode === 'overview' ? 'selected' : ''}>Overview</option>
                            <option value="detailed" ${this.viewMode === 'detailed' ? 'selected' : ''}>Detailed Analysis</option>
                            <option value="ffp" ${this.viewMode === 'ffp' ? 'selected' : ''}>FFP Compliance</option>
                            <option value="projections" ${this.viewMode === 'projections' ? 'selected' : ''}>Projections</option>
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
            <div class="financial-overview-content">
                <div class="financial-summary">
                    ${this.renderFinancialKPIs()}
                </div>
                
                <div class="financial-charts">
                    <div class="revenue-section">
                        <div class="revenue-breakdown-chart">
                            <h4>Revenue Breakdown</h4>
                            <div class="chart-container" id="revenue-breakdown-${this.id}">
                                <!-- Revenue breakdown pizza chart -->
                            </div>
                        </div>
                        
                        <div class="monthly-trend-chart">
                            <h4>Monthly Financial Trend</h4>
                            <div class="chart-container" id="monthly-trend-${this.id}">
                                <!-- Monthly trend line chart -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="expense-section">
                        <div class="expense-analysis-chart">
                            <h4>Expense Analysis</h4>
                            <div class="chart-container" id="expense-analysis-${this.id}">
                                <!-- Expense breakdown bar chart -->
                            </div>
                        </div>
                        
                        <div class="budget-comparison-chart">
                            <h4>Budget vs Actual</h4>
                            <div class="chart-container" id="budget-comparison-${this.id}">
                                <!-- Budget comparison chart -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ffp-compliance">
                    <div class="ffp-status-section">
                        <h4>FFP Compliance Tracking</h4>
                        <div class="ffp-dashboard">
                            ${this.renderFFPDashboard()}
                        </div>
                    </div>
                    
                    <div class="financial-projections">
                        <h4>Financial Projections</h4>
                        <div class="projections-container" id="ffp-tracking-${this.id}">
                            <!-- FFP tracking and projections -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Forest of Thoughts Financial KPI Rendering
    renderFinancialKPIs() {
        const finances = this.getFinancialData();
        const kpis = [
            {
                label: 'Total Revenue',
                value: finances.revenue,
                change: '+€15.2M',
                trend: 'up',
                icon: '💰',
                color: 'var(--accent-200)'
            },
            {
                label: 'Operating Expenses',
                value: finances.expenses,
                change: '-€8.5M',
                trend: 'down',
                icon: '💸',
                color: 'var(--accent-400)'
            },
            {
                label: 'Net Profit',
                value: `€${finances.profit}M`,
                change: '+€6.7M',
                trend: 'up',
                icon: '📈',
                color: finances.profit > 0 ? 'var(--accent-200)' : 'var(--accent-400)'
            },
            {
                label: 'Cash Balance',
                value: finances.cash,
                change: '+€22.1M',
                trend: 'up',
                icon: '🏦',
                color: 'var(--primary-300)'
            },
            {
                label: 'FFP Compliance',
                value: finances.ffpCompliant ? 'Compliant' : 'At Risk',
                change: finances.ffpCompliant ? 'Safe' : 'Warning',
                trend: finances.ffpCompliant ? 'up' : 'down',
                icon: '⚖️',
                color: finances.ffpCompliant ? 'var(--accent-200)' : 'var(--accent-400)'
            },
            {
                label: 'Transfer Budget',
                value: '€85M',
                change: 'Available',
                trend: 'stable',
                icon: '🔄',
                color: 'var(--accent-300)'
            }
        ];
        
        return `
            <div class="financial-kpis">
                ${kpis.map(kpi => `
                    <div class="financial-kpi ${kpi.trend}">
                        <div class="kpi-header">
                            <span class="kpi-icon">${kpi.icon}</span>
                            <span class="kpi-label">${kpi.label}</span>
                        </div>
                        <div class="kpi-value" style="color: ${kpi.color};">${kpi.value}</div>
                        <div class="kpi-change">
                            <span class="change-indicator ${kpi.trend}">${this.getTrendIcon(kpi.trend)}</span>
                            <span class="change-text">${kpi.change}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderFFPDashboard() {
        const ffpData = this.getFFPData();
        return `
            <div class="ffp-dashboard-content">
                <div class="ffp-meter-section">
                    <div class="ffp-compliance-meter">
                        <div class="meter-label">FFP Compliance Score</div>
                        <div class="circular-meter">
                            <svg class="meter-svg" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--neutral-400)" stroke-width="8"/>
                                <circle cx="50" cy="50" r="45" fill="none" stroke="${this.getFFPStatusColor(ffpData.complianceScore)}" 
                                        stroke-width="8" stroke-dasharray="283" stroke-dashoffset="${283 - (ffpData.complianceScore / 100) * 283}"
                                        transform="rotate(-90 50 50)" class="meter-progress"/>
                                <text x="50" y="45" text-anchor="middle" class="meter-value">${ffpData.complianceScore}%</text>
                                <text x="50" y="58" text-anchor="middle" class="meter-status">${ffpData.status}</text>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="ffp-thresholds">
                        <div class="threshold-item">
                            <span class="threshold-label">Revenue Target</span>
                            <div class="threshold-bar">
                                <div class="threshold-fill" style="width: ${(ffpData.revenueProgress)}%; background: var(--accent-200);"></div>
                            </div>
                            <span class="threshold-value">${ffpData.revenueProgress}%</span>
                        </div>
                        <div class="threshold-item">
                            <span class="threshold-label">Expense Limit</span>
                            <div class="threshold-bar">
                                <div class="threshold-fill" style="width: ${(ffpData.expenseProgress)}%; background: ${ffpData.expenseProgress > 85 ? 'var(--accent-400)' : 'var(--accent-300)'};"></div>
                            </div>
                            <span class="threshold-value">${ffpData.expenseProgress}%</span>
                        </div>
                        <div class="threshold-item">
                            <span class="threshold-label">Squad Cost</span>
                            <div class="threshold-bar">
                                <div class="threshold-fill" style="width: ${(ffpData.squadCostProgress)}%; background: var(--primary-300);"></div>
                            </div>
                            <span class="threshold-value">${ffpData.squadCostProgress}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="ffp-warnings">
                    ${this.renderFFPWarnings(ffpData)}
                </div>
            </div>
        `;
    },
    
    renderFFPWarnings(ffpData) {
        const warnings = [];
        
        if (ffpData.expenseProgress > 85) {
            warnings.push({
                level: 'warning',
                message: 'Approaching expense limit threshold',
                action: 'Consider reducing non-essential costs'
            });
        }
        
        if (ffpData.squadCostProgress > 90) {
            warnings.push({
                level: 'danger',
                message: 'Squad cost ratio critically high',
                action: 'Player sales or wage reductions required'
            });
        }
        
        if (ffpData.complianceScore < 70) {
            warnings.push({
                level: 'danger',
                message: 'FFP compliance at risk',
                action: 'Immediate financial review needed'
            });
        }
        
        if (warnings.length === 0) {
            warnings.push({
                level: 'success',
                message: 'All FFP metrics within acceptable ranges',
                action: 'Continue current financial strategy'
            });
        }
        
        return `
            <div class="warnings-list">
                ${warnings.map(warning => `
                    <div class="warning-item ${warning.level}">
                        <div class="warning-icon">${this.getWarningIcon(warning.level)}</div>
                        <div class="warning-content">
                            <div class="warning-message">${warning.message}</div>
                            <div class="warning-action">${warning.action}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Financial Chart Initialization
    initializeCharts() {
        setTimeout(() => {
            this.initializeRevenueBreakdown();
            this.initializeMonthlyTrend();
            this.initializeExpenseAnalysis();
            this.initializeBudgetComparison();
            this.initializeFFPTracking();
        }, 100);
    },
    
    initializeRevenueBreakdown() {
        if (!window.PizzaChart) return;
        
        const container = document.getElementById(`revenue-breakdown-${this.id}`);
        if (!container) return;
        
        const revenueData = [
            { label: 'Matchday Revenue', value: 85, color: '#0094cc' },
            { label: 'TV Rights', value: 142, color: '#ff6b35' },
            { label: 'Commercial', value: 97, color: '#00ff88' },
            { label: 'Player Sales', value: 45, color: '#ffb800' },
            { label: 'UEFA Prize Money', value: 28, color: '#ff4757' }
        ];
        
        if (this.charts.revenueBreakdown) {
            this.charts.revenueBreakdown.destroy();
        }
        
        this.charts.revenueBreakdown = new window.PizzaChart({
            container: container,
            data: revenueData,
            type: 'doughnut',
            size: 180,
            showLegend: true,
            showValues: true,
            showPercentages: true,
            animate: true
        });
    },
    
    initializeMonthlyTrend() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`monthly-trend-${this.id}`);
        if (!container) return;
        
        const trendData = [
            { label: 'Jul', value: 25, category: 'Revenue', color: '#00ff88' },
            { label: 'Aug', value: 45, category: 'Revenue', color: '#00ff88' },
            { label: 'Sep', value: 38, category: 'Revenue', color: '#00ff88' },
            { label: 'Oct', value: 52, category: 'Revenue', color: '#00ff88' },
            { label: 'Nov', value: 41, category: 'Revenue', color: '#00ff88' },
            { label: 'Dec', value: 67, category: 'Revenue', color: '#00ff88' },
            { label: 'Jul', value: -32, category: 'Expenses', color: '#ff4757' },
            { label: 'Aug', value: -28, category: 'Expenses', color: '#ff4757' },
            { label: 'Sep', value: -35, category: 'Expenses', color: '#ff4757' },
            { label: 'Oct', value: -31, category: 'Expenses', color: '#ff4757' },
            { label: 'Nov', value: -29, category: 'Expenses', color: '#ff4757' },
            { label: 'Dec', value: -38, category: 'Expenses', color: '#ff4757' }
        ];
        
        if (this.charts.monthlyTrend) {
            this.charts.monthlyTrend.destroy();
        }
        
        this.charts.monthlyTrend = new window.BarChart({
            container: container,
            data: trendData,
            orientation: 'vertical',
            type: 'grouped',
            showValues: true,
            animate: true,
            width: 300,
            height: 160
        });
    },
    
    initializeExpenseAnalysis() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`expense-analysis-${this.id}`);
        if (!container) return;
        
        const expenseData = [
            { label: 'Player Wages', value: 165, color: '#ff6b35' },
            { label: 'Staff Salaries', value: 28, color: '#0094cc' },
            { label: 'Facilities', value: 22, color: '#00ff88' },
            { label: 'Youth Development', value: 15, color: '#ffb800' },
            { label: 'Marketing', value: 12, color: '#ff4757' },
            { label: 'Travel & Logistics', value: 8, color: '#8066ff' }
        ];
        
        if (this.charts.expenseAnalysis) {
            this.charts.expenseAnalysis.destroy();
        }
        
        this.charts.expenseAnalysis = new window.BarChart({
            container: container,
            data: expenseData,
            orientation: 'horizontal',
            showValues: true,
            animate: true,
            width: 300,
            height: 160
        });
    },
    
    initializeBudgetComparison() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`budget-comparison-${this.id}`);
        if (!container) return;
        
        const budgetData = [
            { label: 'Q1', value: 78, category: 'Budgeted', color: '#0094cc' },
            { label: 'Q2', value: 85, category: 'Budgeted', color: '#0094cc' },
            { label: 'Q3', value: 92, category: 'Budgeted', color: '#0094cc' },
            { label: 'Q4', value: 88, category: 'Budgeted', color: '#0094cc' },
            { label: 'Q1', value: 82, category: 'Actual', color: '#ff6b35' },
            { label: 'Q2', value: 79, category: 'Actual', color: '#ff6b35' },
            { label: 'Q3', value: 95, category: 'Actual', color: '#ff6b35' },
            { label: 'Q4', value: 86, category: 'Actual', color: '#ff6b35' }
        ];
        
        if (this.charts.budgetComparison) {
            this.charts.budgetComparison.destroy();
        }
        
        this.charts.budgetComparison = new window.BarChart({
            container: container,
            data: budgetData,
            orientation: 'vertical',
            type: 'grouped',
            showValues: true,
            animate: true,
            width: 300,
            height: 160
        });
    },
    
    initializeFFPTracking() {
        const container = document.getElementById(`ffp-tracking-${this.id}`);
        if (!container) return;
        
        container.innerHTML = `
            <div class="ffp-projection-chart">
                <div class="projection-timeline">
                    <div class="timeline-item past">
                        <div class="timeline-date">2023</div>
                        <div class="timeline-status compliant">✓ Compliant</div>
                        <div class="timeline-amount">€42M profit</div>
                    </div>
                    <div class="timeline-item current">
                        <div class="timeline-date">2024</div>
                        <div class="timeline-status compliant">✓ On Track</div>
                        <div class="timeline-amount">€38M projected</div>
                    </div>
                    <div class="timeline-item future">
                        <div class="timeline-date">2025</div>
                        <div class="timeline-status warning">⚠ Watch</div>
                        <div class="timeline-amount">€15M projected</div>
                    </div>
                    <div class="timeline-item future">
                        <div class="timeline-date">2026</div>
                        <div class="timeline-status danger">⚠ Risk</div>
                        <div class="timeline-amount">€8M projected</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Event Handlers and Data Methods
    changePeriod(period) {
        this.currentPeriod = period;
        this.update();
        this.initializeCharts();
    },
    
    changeView(view) {
        this.viewMode = view;
        this.update();
        this.initializeCharts();
    },
    
    getFinancialData() {
        const baseData = {
            season: {
                revenue: '€397M',
                expenses: '€282M',
                profit: 115,
                cash: '€185M',
                ffpCompliant: true
            },
            month: {
                revenue: '€32M',
                expenses: '€28M',
                profit: 4,
                cash: '€185M',
                ffpCompliant: true
            },
            year: {
                revenue: '€456M',
                expenses: '€389M',
                profit: 67,
                cash: '€185M',
                ffpCompliant: true
            },
            '3year': {
                revenue: '€1.2B',
                expenses: '€1.05B',
                profit: 150,
                cash: '€185M',
                ffpCompliant: true
            }
        };
        
        return baseData[this.currentPeriod] || baseData.season;
    },
    
    getFFPData() {
        return {
            complianceScore: 78,
            status: 'Compliant',
            revenueProgress: 85,
            expenseProgress: 72,
            squadCostProgress: 68,
            threeYearTrend: 'stable'
        };
    },
    
    getFFPStatusColor(score) {
        if (score >= 80) return 'var(--accent-200)';
        if (score >= 60) return 'var(--accent-300)';
        return 'var(--accent-400)';
    },
    
    getTrendIcon(trend) {
        const icons = {
            up: '📈',
            down: '📉',
            stable: '➡️'
        };
        return icons[trend] || '➡️';
    },
    
    getWarningIcon(level) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            danger: '🚨'
        };
        return icons[level] || '⚠️';
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            const periodSelector = card.querySelector('.period-selector');
            const viewSelector = card.querySelector('.view-selector');
            
            if (body) {
                body.innerHTML = this.getContent();
                this.initializeCharts();
            }
            
            if (periodSelector) {
                periodSelector.value = this.currentPeriod;
            }
            
            if (viewSelector) {
                viewSelector.value = this.viewMode;
            }
        }
    },
    
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = { revenueBreakdown: null, monthlyTrend: null, expenseAnalysis: null, ffpTracking: null, budgetComparison: null };
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.FinancialOverviewCard);
}

// Add comprehensive styles for financial overview card
const financialOverviewStyles = document.createElement('style');
financialOverviewStyles.textContent = `
    .financial-overview-card .header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .period-selector,
    .view-selector {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .financial-overview-content {
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 20px;
        height: 100%;
        overflow: hidden;
    }
    
    /* Financial KPIs Section */
    .financial-summary {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .financial-kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 15px;
    }
    
    .financial-kpi {
        background: var(--neutral-300);
        padding: 15px;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--neutral-400);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .financial-kpi.up {
        border-left-color: var(--accent-200);
    }
    
    .financial-kpi.down {
        border-left-color: var(--accent-400);
    }
    
    .financial-kpi.stable {
        border-left-color: var(--accent-300);
    }
    
    .financial-kpi:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .kpi-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
    }
    
    .kpi-icon {
        font-size: 16px;
    }
    
    .kpi-label {
        font-size: 12px;
        color: #8892a0;
        font-weight: 500;
    }
    
    .kpi-value {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        line-height: 1;
    }
    
    .kpi-change {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
    }
    
    .change-indicator {
        font-size: 12px;
    }
    
    .change-text {
        color: rgba(255,255,255,0.8);
        font-weight: 500;
    }
    
    /* Financial Charts Grid */
    .financial-charts {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        overflow: hidden;
    }
    
    .revenue-section,
    .expense-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .revenue-breakdown-chart,
    .monthly-trend-chart,
    .expense-analysis-chart,
    .budget-comparison-chart {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
    }
    
    .financial-charts h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .chart-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 180px;
    }
    
    /* FFP Compliance Section */
    .ffp-compliance {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .ffp-status-section,
    .financial-projections {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .ffp-compliance h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    /* FFP Dashboard */
    .ffp-dashboard-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .ffp-meter-section {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    
    .ffp-compliance-meter {
        flex-shrink: 0;
    }
    
    .meter-label {
        font-size: 11px;
        color: #8892a0;
        text-align: center;
        margin-bottom: 8px;
        font-weight: 500;
    }
    
    .circular-meter {
        width: 100px;
        height: 100px;
    }
    
    .meter-svg {
        width: 100%;
        height: 100%;
    }
    
    .meter-progress {
        transition: stroke-dashoffset 1s ease-out;
    }
    
    .meter-value {
        font-size: 14px;
        font-weight: 700;
        fill: white;
    }
    
    .meter-status {
        font-size: 10px;
        fill: rgba(255,255,255,0.8);
        font-weight: 500;
    }
    
    .ffp-thresholds {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .threshold-item {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .threshold-label {
        font-size: 11px;
        color: #8892a0;
        min-width: 80px;
        font-weight: 500;
    }
    
    .threshold-bar {
        flex: 1;
        height: 6px;
        background: var(--neutral-400);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .threshold-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s ease;
    }
    
    .threshold-value {
        font-size: 11px;
        color: white;
        font-weight: 600;
        min-width: 35px;
        text-align: right;
    }
    
    /* FFP Warnings */
    .warnings-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .warning-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid;
    }
    
    .warning-item.success {
        background: rgba(0, 255, 136, 0.1);
        border-left-color: var(--accent-200);
    }
    
    .warning-item.warning {
        background: rgba(255, 184, 0, 0.1);
        border-left-color: var(--accent-300);
    }
    
    .warning-item.danger {
        background: rgba(255, 71, 87, 0.1);
        border-left-color: var(--accent-400);
    }
    
    .warning-icon {
        font-size: 16px;
        flex-shrink: 0;
        margin-top: 2px;
    }
    
    .warning-content {
        flex: 1;
    }
    
    .warning-message {
        font-size: 12px;
        color: white;
        font-weight: 500;
        margin-bottom: 4px;
    }
    
    .warning-action {
        font-size: 11px;
        color: rgba(255,255,255,0.7);
        line-height: 1.3;
    }
    
    /* Financial Projections */
    .projections-container {
        min-height: 180px;
        display: flex;
        align-items: center;
    }
    
    .ffp-projection-chart {
        width: 100%;
    }
    
    .projection-timeline {
        display: flex;
        justify-content: space-between;
        position: relative;
    }
    
    .projection-timeline::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--neutral-400);
        z-index: 1;
    }
    
    .timeline-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        position: relative;
        z-index: 2;
        background: var(--neutral-200);
        padding: 8px;
        border-radius: 4px;
        min-width: 80px;
    }
    
    .timeline-item::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--neutral-400);
        transform: translate(-50%, -50%);
        z-index: 3;
    }
    
    .timeline-item.past::before {
        background: var(--accent-200);
    }
    
    .timeline-item.current::before {
        background: var(--primary-300);
        box-shadow: 0 0 8px var(--primary-300);
    }
    
    .timeline-item.future::before {
        background: var(--accent-300);
    }
    
    .timeline-date {
        font-size: 11px;
        color: white;
        font-weight: 600;
    }
    
    .timeline-status {
        font-size: 10px;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: 3px;
    }
    
    .timeline-status.compliant {
        background: rgba(0, 255, 136, 0.2);
        color: var(--accent-200);
    }
    
    .timeline-status.warning {
        background: rgba(255, 184, 0, 0.2);
        color: var(--accent-300);
    }
    
    .timeline-status.danger {
        background: rgba(255, 71, 87, 0.2);
        color: var(--accent-400);
    }
    
    .timeline-amount {
        font-size: 10px;
        color: rgba(255,255,255,0.8);
        text-align: center;
    }
    
    /* Responsive Design */
    @media (max-width: 1400px) {
        .financial-charts {
            grid-template-columns: 1fr;
        }
        
        .revenue-section,
        .expense-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .ffp-compliance {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 1200px) {
        .financial-kpis {
            grid-template-columns: repeat(3, 1fr);
        }
        
        .revenue-section,
        .expense-section {
            grid-template-columns: 1fr;
        }
        
        .chart-container {
            min-height: 140px;
        }
        
        .ffp-meter-section {
            flex-direction: column;
            text-align: center;
        }
        
        .circular-meter {
            width: 80px;
            height: 80px;
        }
    }
    
    @media (max-width: 768px) {
        .financial-overview-content {
            gap: 15px;
        }
        
        .financial-kpis {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        
        .financial-kpi {
            padding: 12px;
        }
        
        .kpi-value {
            font-size: 18px;
        }
        
        .chart-container {
            min-height: 120px;
        }
        
        .financial-charts,
        .ffp-compliance {
            gap: 15px;
        }
        
        .revenue-breakdown-chart,
        .monthly-trend-chart,
        .expense-analysis-chart,
        .budget-comparison-chart,
        .ffp-status-section,
        .financial-projections {
            padding: 12px;
        }
        
        .projection-timeline {
            flex-direction: column;
            gap: 10px;
        }
        
        .projection-timeline::before {
            top: 0;
            bottom: 0;
            left: 50%;
            width: 2px;
            height: auto;
        }
        
        .timeline-item {
            min-width: auto;
            width: 100%;
        }
    }
    
    /* Animation Enhancements */
    .financial-kpi {
        animation: slideInScale 0.4s ease-out;
    }
    
    .financial-kpi:nth-child(1) { animation-delay: 0.1s; }
    .financial-kpi:nth-child(2) { animation-delay: 0.2s; }
    .financial-kpi:nth-child(3) { animation-delay: 0.3s; }
    .financial-kpi:nth-child(4) { animation-delay: 0.4s; }
    .financial-kpi:nth-child(5) { animation-delay: 0.5s; }
    .financial-kpi:nth-child(6) { animation-delay: 0.6s; }
    
    @keyframes slideInScale {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .threshold-fill {
        animation: fillBar 1s ease-out 0.5s backwards;
    }
    
    @keyframes fillBar {
        0% {
            width: 0%;
        }
    }
    
    .warning-item {
        animation: slideInLeft 0.3s ease-out;
    }
    
    .warning-item:nth-child(1) { animation-delay: 0.1s; }
    .warning-item:nth-child(2) { animation-delay: 0.2s; }
    .warning-item:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes slideInLeft {
        0% {
            opacity: 0;
            transform: translateX(-20px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .timeline-item {
        animation: timelineAppear 0.5s ease-out;
    }
    
    .timeline-item:nth-child(1) { animation-delay: 0.1s; }
    .timeline-item:nth-child(2) { animation-delay: 0.2s; }
    .timeline-item:nth-child(3) { animation-delay: 0.3s; }
    .timeline-item:nth-child(4) { animation-delay: 0.4s; }
    
    @keyframes timelineAppear {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    /* Hover Effects */
    .revenue-breakdown-chart:hover,
    .monthly-trend-chart:hover,
    .expense-analysis-chart:hover,
    .budget-comparison-chart:hover,
    .ffp-status-section:hover,
    .financial-projections:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(financialOverviewStyles);