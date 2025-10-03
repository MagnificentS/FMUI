/* ==========================================
   PERFORMANCE DASHBOARD CARD - Multi-visualization Performance Overview
   ========================================== */

window.PerformanceDashboardCard = {
    id: 'performance-dashboard',
    title: 'Performance Dashboard',
    pages: ['overview', 'performance', 'analytics'],
    size: 'extra-wide tall',
    
    charts: {
        goalsTrend: null,
        formChart: null,
        performanceRadar: null,
        comparisonChart: null
    },
    
    currentPeriod: 'season',
    selectedMetric: 'goals',
    
    render() {
        return {
            className: 'card extra-wide tall performance-dashboard-card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <div class="header-controls">
                        <select class="period-selector" onchange="window.PerformanceDashboardCard.changePeriod(this.value)">
                            <option value="month" ${this.currentPeriod === 'month' ? 'selected' : ''}>Last Month</option>
                            <option value="season" ${this.currentPeriod === 'season' ? 'selected' : ''}>This Season</option>
                            <option value="year" ${this.currentPeriod === 'year' ? 'selected' : ''}>Last 12 Months</option>
                            <option value="career" ${this.currentPeriod === 'career' ? 'selected' : ''}>Career</option>
                        </select>
                        <select class="metric-selector" onchange="window.PerformanceDashboardCard.changeMetric(this.value)">
                            <option value="goals" ${this.selectedMetric === 'goals' ? 'selected' : ''}>Goals</option>
                            <option value="assists" ${this.selectedMetric === 'assists' ? 'selected' : ''}>Assists</option>
                            <option value="rating" ${this.selectedMetric === 'rating' ? 'selected' : ''}>Rating</option>
                            <option value="performance" ${this.selectedMetric === 'performance' ? 'selected' : ''}>Performance</option>
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
            <div class="dashboard-content">
                <div class="kpi-section">
                    ${this.renderKPICards()}
                </div>
                
                <div class="charts-grid">
                    <div class="chart-card trend-chart">
                        <h4>${this.getMetricLabel()} Trend</h4>
                        <div class="chart-container">
                            <div id="trend-chart-${this.id}"></div>
                        </div>
                    </div>
                    
                    <div class="chart-card form-chart">
                        <h4>Recent Form</h4>
                        <div class="chart-container">
                            <div id="form-chart-${this.id}"></div>
                        </div>
                    </div>
                    
                    <div class="chart-card performance-radar">
                        <h4>Performance Radar</h4>
                        <div class="chart-container">
                            <div id="performance-radar-${this.id}"></div>
                        </div>
                    </div>
                    
                    <div class="chart-card comparison-chart">
                        <h4>Squad Comparison</h4>
                        <div class="chart-container">
                            <div id="comparison-chart-${this.id}"></div>
                        </div>
                    </div>
                </div>
                
                <div class="detailed-metrics">
                    ${this.renderDetailedMetrics()}
                </div>
            </div>
        `;
    },
    
    renderKPICards() {
        const kpis = this.getKPIData();
        return `
            <div class="kpi-grid">
                ${kpis.map(kpi => `
                    <div class="kpi-card ${kpi.trend}">
                        <div class="kpi-header">
                            <span class="kpi-label">${kpi.label}</span>
                            <span class="kpi-trend-icon">${this.getTrendIcon(kpi.trend)}</span>
                        </div>
                        <div class="kpi-value">${kpi.value}</div>
                        <div class="kpi-subtitle">
                            <span class="kpi-change ${kpi.trend}">${kpi.change}</span>
                            <span class="kpi-period">vs ${this.getPreviousPeriod()}</span>
                        </div>
                        <div class="kpi-sparkline">
                            ${this.renderSparkline(kpi.sparklineData)}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderSparkline(data) {
        if (!data || data.length === 0) return '';
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        return `
            <svg class="sparkline-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                <polyline 
                    points="${points}" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="1.5"
                    vector-effect="non-scaling-stroke" />
            </svg>
        `;
    },
    
    renderDetailedMetrics() {
        const metrics = this.getDetailedMetrics();
        return `
            <div class="metrics-section">
                <h4>Detailed Performance Metrics</h4>
                <div class="metrics-table">
                    <div class="table-header">
                        <span class="metric-name">Metric</span>
                        <span class="metric-current">Current</span>
                        <span class="metric-target">Target</span>
                        <span class="metric-progress">Progress</span>
                        <span class="metric-trend">Trend</span>
                    </div>
                    ${metrics.map(metric => `
                        <div class="table-row">
                            <span class="metric-name">
                                <span class="metric-icon">${metric.icon}</span>
                                ${metric.name}
                            </span>
                            <span class="metric-current">${metric.current}</span>
                            <span class="metric-target">${metric.target}</span>
                            <span class="metric-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${metric.progress}%"></div>
                                </div>
                                <span class="progress-text">${metric.progress}%</span>
                            </span>
                            <span class="metric-trend ${metric.trendDirection}">
                                ${this.getTrendIcon(metric.trendDirection)}
                                ${metric.trendValue}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    changePeriod(period) {
        this.currentPeriod = period;
        this.update();
        this.initializeCharts();
    },
    
    changeMetric(metric) {
        this.selectedMetric = metric;
        this.update();
        this.initializeCharts();
    },
    
    initializeCharts() {
        setTimeout(() => {
            this.initializeTrendChart();
            this.initializeFormChart();
            this.initializePerformanceRadar();
            this.initializeComparisonChart();
        }, 100);
    },
    
    initializeTrendChart() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`trend-chart-${this.id}`);
        if (!container) return;
        
        const trendData = this.getTrendData();
        
        if (this.charts.goalsTrend) {
            this.charts.goalsTrend.destroy();
        }
        
        this.charts.goalsTrend = new window.BarChart({
            container: container,
            data: trendData,
            orientation: 'vertical',
            showValues: true,
            animate: true,
            maxHeight: 120,
            colors: ['var(--primary-300)', 'var(--accent-200)', 'var(--accent-300)', 'var(--accent-400)']
        });
    },
    
    initializeFormChart() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`form-chart-${this.id}`);
        if (!container) return;
        
        const formData = [
            { label: 'W', value: 3, color: '#00ff88' },
            { label: 'L', value: -1, color: '#ff4757' },
            { label: 'W', value: 3, color: '#00ff88' },
            { label: 'D', value: 1, color: '#ffa726' },
            { label: 'W', value: 3, color: '#00ff88' },
            { label: 'W', value: 3, color: '#00ff88' }
        ];
        
        if (this.charts.formChart) {
            this.charts.formChart.destroy();
        }
        
        this.charts.formChart = new window.BarChart({
            container: container,
            data: formData,
            orientation: 'vertical',
            showValues: false,
            animate: true,
            maxHeight: 120
        });
    },
    
    initializePerformanceRadar() {
        if (!window.PizzaChart) return;
        
        const container = document.getElementById(`performance-radar-${this.id}`);
        if (!container) return;
        
        const radarData = [
            { label: 'Attack', value: 85, color: '#ff6b35' },
            { label: 'Creativity', value: 78, color: '#00d4aa' },
            { label: 'Work Rate', value: 92, color: '#0094cc' },
            { label: 'Discipline', value: 88, color: '#8066ff' },
            { label: 'Consistency', value: 76, color: '#ffa726' }
        ];
        
        if (this.charts.performanceRadar) {
            this.charts.performanceRadar.destroy();
        }
        
        this.charts.performanceRadar = new window.PizzaChart({
            container: container,
            data: radarData,
            type: 'doughnut',
            size: 140,
            showLegend: false,
            showValues: true,
            animate: true
        });
    },
    
    initializeComparisonChart() {
        if (!window.BarChart) return;
        
        const container = document.getElementById(`comparison-chart-${this.id}`);
        if (!container) return;
        
        const comparisonData = [
            { label: 'Rashford', value: 17, color: '#ff6b35' },
            { label: 'Fernandes', value: 14, color: '#00d4aa' },
            { label: 'Højlund', value: 8, color: '#0094cc' },
            { label: 'Garnacho', value: 6, color: '#8066ff' }
        ];
        
        if (this.charts.comparisonChart) {
            this.charts.comparisonChart.destroy();
        }
        
        this.charts.comparisonChart = new window.BarChart({
            container: container,
            data: comparisonData,
            orientation: 'horizontal',
            showValues: true,
            animate: true,
            maxHeight: 120
        });
    },
    
    // Data methods
    getKPIData() {
        const baseData = {
            season: {
                goals: { value: 17, change: '+3', trend: 'up', sparklineData: [12, 14, 15, 16, 16, 17] },
                assists: { value: 5, change: '+1', trend: 'up', sparklineData: [3, 4, 4, 4, 5, 5] },
                rating: { value: 7.2, change: '+0.3', trend: 'up', sparklineData: [6.8, 6.9, 7.0, 7.1, 7.1, 7.2] },
                minutes: { value: 2890, change: '+120', trend: 'up', sparklineData: [2600, 2700, 2770, 2820, 2860, 2890] }
            },
            month: {
                goals: { value: 4, change: '+2', trend: 'up', sparklineData: [2, 2, 3, 3, 4, 4] },
                assists: { value: 1, change: '0', trend: 'stable', sparklineData: [1, 1, 1, 1, 1, 1] },
                rating: { value: 7.8, change: '+0.5', trend: 'up', sparklineData: [7.2, 7.3, 7.5, 7.6, 7.7, 7.8] },
                minutes: { value: 380, change: '+45', trend: 'up', sparklineData: [320, 335, 350, 365, 375, 380] }
            }
        };
        
        const data = baseData[this.currentPeriod] || baseData.season;
        
        return [
            { label: 'Goals', ...data.goals },
            { label: 'Assists', ...data.assists },
            { label: 'Avg Rating', ...data.rating },
            { label: 'Minutes', ...data.minutes }
        ];
    },
    
    getTrendData() {
        const trendData = {
            goals: {
                season: [
                    { label: 'Aug', value: 2, color: '#ff6b35' },
                    { label: 'Sep', value: 3, color: '#ff6b35' },
                    { label: 'Oct', value: 4, color: '#ff6b35' },
                    { label: 'Nov', value: 2, color: '#ff6b35' },
                    { label: 'Dec', value: 3, color: '#ff6b35' },
                    { label: 'Jan', value: 3, color: '#ff6b35' }
                ],
                month: [
                    { label: 'Week 1', value: 1, color: '#ff6b35' },
                    { label: 'Week 2', value: 0, color: '#ff6b35' },
                    { label: 'Week 3', value: 2, color: '#ff6b35' },
                    { label: 'Week 4', value: 1, color: '#ff6b35' }
                ]
            },
            assists: {
                season: [
                    { label: 'Aug', value: 1, color: '#00d4aa' },
                    { label: 'Sep', value: 1, color: '#00d4aa' },
                    { label: 'Oct', value: 0, color: '#00d4aa' },
                    { label: 'Nov', value: 1, color: '#00d4aa' },
                    { label: 'Dec', value: 1, color: '#00d4aa' },
                    { label: 'Jan', value: 1, color: '#00d4aa' }
                ]
            },
            rating: {
                season: [
                    { label: 'Aug', value: 6.8, color: '#0094cc' },
                    { label: 'Sep', value: 7.1, color: '#0094cc' },
                    { label: 'Oct', value: 7.3, color: '#0094cc' },
                    { label: 'Nov', value: 6.9, color: '#0094cc' },
                    { label: 'Dec', value: 7.4, color: '#0094cc' },
                    { label: 'Jan', value: 7.6, color: '#0094cc' }
                ]
            }
        };
        
        return trendData[this.selectedMetric]?.[this.currentPeriod] || trendData.goals.season;
    },
    
    getDetailedMetrics() {
        return [
            {
                icon: '⚽',
                name: 'Goals Scored',
                current: 17,
                target: 20,
                progress: 85,
                trendDirection: 'up',
                trendValue: '+12%'
            },
            {
                icon: '🎯',
                name: 'Shot Accuracy',
                current: '68%',
                target: '70%',
                progress: 97,
                trendDirection: 'up',
                trendValue: '+3%'
            },
            {
                icon: '🅰️',
                name: 'Assists',
                current: 5,
                target: 8,
                progress: 63,
                trendDirection: 'stable',
                trendValue: '0%'
            },
            {
                icon: '⭐',
                name: 'Average Rating',
                current: 7.2,
                target: 7.5,
                progress: 96,
                trendDirection: 'up',
                trendValue: '+4%'
            },
            {
                icon: '🏃',
                name: 'Distance Covered (km/game)',
                current: 11.2,
                target: 11.0,
                progress: 102,
                trendDirection: 'up',
                trendValue: '+2%'
            },
            {
                icon: '💪',
                name: 'Duels Won',
                current: '58%',
                target: '60%',
                progress: 97,
                trendDirection: 'down',
                trendValue: '-1%'
            },
            {
                icon: '🔄',
                name: 'Pass Completion',
                current: '84%',
                target: '85%',
                progress: 99,
                trendDirection: 'up',
                trendValue: '+2%'
            },
            {
                icon: '🏥',
                name: 'Fitness Level',
                current: '94%',
                target: '95%',
                progress: 99,
                trendDirection: 'stable',
                trendValue: '0%'
            }
        ];
    },
    
    getMetricLabel() {
        const labels = {
            goals: 'Goals',
            assists: 'Assists',
            rating: 'Average Rating',
            performance: 'Performance Index'
        };
        return labels[this.selectedMetric] || 'Goals';
    },
    
    getPreviousPeriod() {
        const periods = {
            month: 'last month',
            season: 'last season',
            year: 'previous year',
            career: 'career avg'
        };
        return periods[this.currentPeriod] || 'last season';
    },
    
    getTrendIcon(trend) {
        const icons = {
            up: '📈',
            down: '📉',
            stable: '➡️'
        };
        return icons[trend] || '➡️';
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            const periodSelector = card.querySelector('.period-selector');
            const metricSelector = card.querySelector('.metric-selector');
            
            if (body) {
                body.innerHTML = this.getContent();
                this.initializeCharts();
            }
            
            if (periodSelector) {
                periodSelector.value = this.currentPeriod;
            }
            
            if (metricSelector) {
                metricSelector.value = this.selectedMetric;
            }
        }
    },
    
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        this.charts = { goalsTrend: null, formChart: null, performanceRadar: null, comparisonChart: null };
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.PerformanceDashboardCard);
}

// Add custom styles for performance dashboard card
const performanceDashboardStyles = document.createElement('style');
performanceDashboardStyles.textContent = `
    .performance-dashboard-card .header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .period-selector,
    .metric-selector {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .dashboard-content {
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 20px;
        height: 100%;
        overflow: hidden;
    }
    
    .kpi-section {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
    }
    
    .kpi-card {
        background: var(--neutral-300);
        padding: 15px;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--neutral-400);
        transition: all 0.2s ease;
    }
    
    .kpi-card.up {
        border-left-color: var(--accent-200);
    }
    
    .kpi-card.down {
        border-left-color: var(--accent-400);
    }
    
    .kpi-card.stable {
        border-left-color: var(--accent-300);
    }
    
    .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .kpi-label {
        font-size: 12px;
        color: #8892a0;
        font-weight: 500;
    }
    
    .kpi-trend-icon {
        font-size: 14px;
    }
    
    .kpi-value {
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin-bottom: 6px;
        line-height: 1;
    }
    
    .kpi-subtitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    
    .kpi-change {
        font-size: 11px;
        font-weight: 600;
    }
    
    .kpi-change.up {
        color: var(--accent-200);
    }
    
    .kpi-change.down {
        color: var(--accent-400);
    }
    
    .kpi-change.stable {
        color: var(--accent-300);
    }
    
    .kpi-period {
        font-size: 10px;
        color: rgba(255,255,255,0.6);
    }
    
    .kpi-sparkline {
        height: 20px;
        margin-top: 8px;
    }
    
    .sparkline-svg {
        width: 100%;
        height: 100%;
        color: var(--primary-300);
    }
    
    .charts-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 15px;
        overflow: hidden;
    }
    
    .chart-card {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
    }
    
    .chart-card h4 {
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
        min-height: 120px;
    }
    
    .detailed-metrics {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        overflow-y: auto;
        max-height: 300px;
    }
    
    .metrics-section h4 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .metrics-table {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
    .table-header {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr;
        gap: 15px;
        padding: 8px 0;
        border-bottom: 1px solid var(--neutral-400);
        margin-bottom: 8px;
        font-size: 11px;
        color: #8892a0;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .table-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr;
        gap: 15px;
        padding: 8px 0;
        border-radius: 4px;
        transition: background-color 0.2s ease;
        align-items: center;
    }
    
    .table-row:hover {
        background: var(--neutral-300);
    }
    
    .metric-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: white;
        font-weight: 500;
    }
    
    .metric-icon {
        font-size: 14px;
    }
    
    .metric-current,
    .metric-target {
        font-size: 12px;
        color: white;
        font-weight: 600;
        text-align: center;
    }
    
    .metric-progress {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .progress-bar {
        flex: 1;
        height: 6px;
        background: var(--neutral-400);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: var(--primary-300);
        border-radius: 3px;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        font-size: 10px;
        color: rgba(255,255,255,0.8);
        min-width: 35px;
        text-align: right;
    }
    
    .metric-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 600;
        justify-content: center;
    }
    
    .metric-trend.up {
        color: var(--accent-200);
    }
    
    .metric-trend.down {
        color: var(--accent-400);
    }
    
    .metric-trend.stable {
        color: var(--accent-300);
    }
    
    /* Responsive adjustments */
    @media (max-width: 1400px) {
        .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .charts-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, auto);
        }
        
        .chart-container {
            min-height: 100px;
        }
    }
    
    @media (max-width: 1200px) {
        .dashboard-content {
            grid-template-rows: auto auto 1fr;
        }
        
        .detailed-metrics {
            max-height: 200px;
        }
    }
    
    @media (max-width: 768px) {
        .kpi-grid {
            grid-template-columns: 1fr;
        }
        
        .charts-grid {
            gap: 10px;
        }
        
        .chart-card {
            padding: 10px;
        }
        
        .table-header,
        .table-row {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 10px;
        }
        
        .metric-progress,
        .metric-trend {
            display: none;
        }
        
        .kpi-value {
            font-size: 20px;
        }
        
        .detailed-metrics {
            max-height: 150px;
        }
    }
    
    /* Animation for KPI cards */
    @keyframes kpiPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .kpi-card:hover {
        animation: kpiPulse 0.3s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    /* Sparkline animations */
    .sparkline-svg polyline {
        stroke-dasharray: 200;
        stroke-dashoffset: 200;
        animation: drawSparkline 1s ease-out forwards;
    }
    
    @keyframes drawSparkline {
        to {
            stroke-dashoffset: 0;
        }
    }
`;

document.head.appendChild(performanceDashboardStyles);