/* ==========================================
   CHART INTEGRATION SYSTEM - Football Manager Visualizations
   Comprehensive integration of AttributeCircle, BarChart, PizzaChart components
   Forest of Thoughts implementation for 20 chart decisions
   ========================================== */

/**
 * ChartIntegrationSystem - Master coordinator for all Football Manager charts
 * 
 * Forest of Thoughts Chart Decisions (20 implementations):
 * 1. Performance Dashboard - BarChart for trends, PizzaChart for breakdowns
 * 2. Player Attributes - AttributeCircle for skill visualization
 * 3. Financial Overview - PizzaChart for revenue, BarChart for trends
 * 4. Tactical Analysis - AttributeCircle for positions, heat maps
 * 5. Team Form - BarChart for W/D/L results with color coding
 * 6. Squad Comparison - BarChart for player stat comparisons
 * 7. Training Progress - AttributeCircle for skill development
 * 8. Transfer Analysis - BarChart for values, PizzaChart for budgets
 * 9. Injury Report - AttributeCircle for fitness levels
 * 10. Match Analysis - BarChart for match statistics
 * 11. League Standing - BarChart for points progression
 * 12. Youth Development - AttributeCircle for potential tracking
 * 13. Tactical Heat Maps - AttributeCircle overlays on pitch
 * 14. Financial Compliance - PizzaChart for FFP breakdown
 * 15. Player Development - BarChart for attribute progression
 * 16. Opposition Analysis - AttributeCircle for team strengths
 * 17. Season Objectives - PizzaChart for completion status
 * 18. Contract Negotiations - BarChart for wage comparisons
 * 19. Scout Reports - AttributeCircle for player ratings
 * 20. Performance Trends - BarChart for long-term analysis
 */
window.ChartIntegrationSystem = {
    // Chart instance registry
    charts: new Map(),
    
    // Chart type mappings for Football Manager contexts
    chartMappings: {
        'performance-dashboard': ['BarChart', 'PizzaChart'],
        'player-attributes': ['AttributeCircle'],
        'financial-overview': ['PizzaChart', 'BarChart'],
        'tactical-analysis': ['AttributeCircle'],
        'team-form': ['BarChart'],
        'squad-comparison': ['BarChart'],
        'training-progress': ['AttributeCircle'],
        'transfer-analysis': ['BarChart', 'PizzaChart'],
        'injury-report': ['AttributeCircle'],
        'match-analysis': ['BarChart'],
        'league-standing': ['BarChart'],
        'youth-development': ['AttributeCircle'],
        'tactical-heatmap': ['AttributeCircle'],
        'financial-compliance': ['PizzaChart'],
        'player-development': ['BarChart'],
        'opposition-analysis': ['AttributeCircle'],
        'season-objectives': ['PizzaChart'],
        'contract-negotiations': ['BarChart'],
        'scout-reports': ['AttributeCircle'],
        'performance-trends': ['BarChart']
    },
    
    // Initialize all chart systems
    initialize() {
        console.log('🎯 Initializing Football Manager Chart Integration System...');
        
        // Ensure chart components are loaded
        this.waitForChartComponents().then(() => {
            this.initializeAllCharts();
            this.attachEventListeners();
            this.startAutoRefresh();
            console.log('✅ Chart Integration System fully initialized');
        }).catch(error => {
            console.error('❌ Chart Integration System failed to initialize:', error);
        });
    },
    
    // Wait for all chart components to be available
    waitForChartComponents() {
        return new Promise((resolve, reject) => {
            const maxAttempts = 50;
            let attempts = 0;
            
            const checkComponents = () => {
                attempts++;
                
                if (window.AttributeCircle && window.BarChart && window.PizzaChart) {
                    console.log('✅ All chart components loaded');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Chart components failed to load within timeout'));
                } else {
                    console.log(`⏳ Waiting for chart components... (${attempts}/${maxAttempts})`);
                    setTimeout(checkComponents, 100);
                }
            };
            
            checkComponents();
        });
    },
    
    // Initialize all charts found in the DOM
    initializeAllCharts() {
        // Find all chart containers
        const chartContainers = document.querySelectorAll('[id*="chart"], [class*="chart-container"]');
        
        chartContainers.forEach(container => {
            this.initializeChartContainer(container);
        });
        
        // Initialize specific Football Manager card charts
        this.initializePerformanceDashboard();
        this.initializeFinancialCharts();
        this.initializePlayerAttributeCharts();
        this.initializeTacticalCharts();
        this.initializeAdditionalCharts();
    },
    
    // Initialize a specific chart container
    initializeChartContainer(container) {
        const containerId = container.id;
        const containerClass = container.className;
        
        // Determine chart type based on ID and context
        const chartType = this.determineChartType(containerId, containerClass);
        
        if (chartType && !this.charts.has(containerId)) {
            this.createChart(chartType, container);
        }
    },
    
    // Determine appropriate chart type for container
    determineChartType(containerId, containerClass) {
        // Performance dashboard charts
        if (containerId.includes('trend-chart') || containerId.includes('form-chart')) {
            return 'BarChart';
        }
        if (containerId.includes('performance-radar') || containerId.includes('revenue-breakdown')) {
            return 'PizzaChart';
        }
        if (containerId.includes('comparison-chart') || containerId.includes('expense-analysis')) {
            return 'BarChart';
        }
        if (containerId.includes('attribute') || containerClass.includes('attribute')) {
            return 'AttributeCircle';
        }
        
        // Default fallbacks
        if (containerClass.includes('bar-chart') || containerId.includes('bar')) {
            return 'BarChart';
        }
        if (containerClass.includes('pizza-chart') || containerId.includes('pizza')) {
            return 'PizzaChart';
        }
        if (containerClass.includes('circle') || containerId.includes('circle')) {
            return 'AttributeCircle';
        }
        
        return null;
    },
    
    // Create a chart instance
    createChart(chartType, container) {
        const containerId = container.id;
        const data = this.generateDataForChart(containerId, chartType);
        
        try {
            let chart;
            
            switch (chartType) {
                case 'BarChart':
                    chart = new window.BarChart({
                        container: container,
                        data: data.chartData,
                        orientation: data.options.orientation || 'vertical',
                        type: data.options.type || 'single',
                        showValues: true,
                        showTooltip: true,
                        animate: true,
                        width: data.options.width || 300,
                        height: data.options.height || 160,
                        colors: data.options.colors || this.getFootballManagerColors()
                    });
                    break;
                    
                case 'PizzaChart':
                    chart = new window.PizzaChart({
                        container: container,
                        data: data.chartData,
                        type: data.options.type || 'doughnut',
                        size: data.options.size || 160,
                        showLegend: true,
                        showValues: true,
                        showPercentages: true,
                        animate: true,
                        colors: data.options.colors || this.getFootballManagerColors()
                    });
                    break;
                    
                case 'AttributeCircle':
                    if (Array.isArray(data.chartData)) {
                        chart = window.AttributeCircle.createMultiple(
                            container,
                            data.chartData,
                            {
                                size: data.options.size || 32,
                                colorMode: 'performance',
                                animate: true,
                                showLabel: true,
                                showValue: true
                            }
                        );
                    } else {
                        chart = new window.AttributeCircle({
                            container: container,
                            value: data.chartData.value || 0,
                            label: data.chartData.label || '',
                            size: data.options.size || 32,
                            colorMode: 'performance',
                            animate: true,
                            showLabel: true,
                            showValue: true
                        });
                    }
                    break;
            }
            
            if (chart) {
                this.charts.set(containerId, {
                    instance: chart,
                    type: chartType,
                    container: container,
                    data: data
                });
                
                console.log(`✅ Created ${chartType} chart: ${containerId}`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to create ${chartType} chart for ${containerId}:`, error);
        }
    },
    
    // Generate appropriate data for chart type and context
    generateDataForChart(containerId, chartType) {
        // Performance Dashboard Data
        if (containerId.includes('trend-chart')) {
            return this.generateTrendData();
        }
        if (containerId.includes('form-chart')) {
            return this.generateFormData();
        }
        if (containerId.includes('performance-radar')) {
            return this.generatePerformanceRadarData();
        }
        if (containerId.includes('comparison-chart')) {
            return this.generateComparisonData();
        }
        
        // Financial Charts Data
        if (containerId.includes('revenue-breakdown')) {
            return this.generateRevenueBreakdownData();
        }
        if (containerId.includes('monthly-trend')) {
            return this.generateMonthlyTrendData();
        }
        if (containerId.includes('expense-analysis')) {
            return this.generateExpenseAnalysisData();
        }
        if (containerId.includes('budget-comparison')) {
            return this.generateBudgetComparisonData();
        }
        
        // Player Attribute Data
        if (containerId.includes('attribute') || containerId.includes('player-stats')) {
            return this.generatePlayerAttributeData();
        }
        
        // Tactical Charts Data
        if (containerId.includes('tactical') || containerId.includes('formation')) {
            return this.generateTacticalData();
        }
        
        // Default fallback data
        return this.generateDefaultData(chartType);
    },
    
    // Specific chart data generators
    generateTrendData() {
        return {
            chartData: [
                { label: 'Aug', value: 4, color: '#ff6b35' },
                { label: 'Sep', value: 6, color: '#ff6b35' },
                { label: 'Oct', value: 3, color: '#ff6b35' },
                { label: 'Nov', value: 5, color: '#ff6b35' },
                { label: 'Dec', value: 7, color: '#ff6b35' },
                { label: 'Jan', value: 4, color: '#ff6b35' }
            ],
            options: {
                orientation: 'vertical',
                width: 280,
                height: 120
            }
        };
    },
    
    generateFormData() {
        return {
            chartData: [
                { label: 'W', value: 3, color: '#00ff88' },
                { label: 'L', value: 0, color: '#ff4757' },
                { label: 'W', value: 3, color: '#00ff88' },
                { label: 'D', value: 1, color: '#ffa726' },
                { label: 'W', value: 3, color: '#00ff88' },
                { label: 'W', value: 3, color: '#00ff88' }
            ],
            options: {
                orientation: 'vertical',
                width: 200,
                height: 120,
                showValues: false
            }
        };
    },
    
    generatePerformanceRadarData() {
        return {
            chartData: [
                { label: 'Attack', value: 85, color: '#ff6b35' },
                { label: 'Creativity', value: 78, color: '#00d4aa' },
                { label: 'Work Rate', value: 92, color: '#0094cc' },
                { label: 'Discipline', value: 88, color: '#8066ff' },
                { label: 'Consistency', value: 76, color: '#ffa726' }
            ],
            options: {
                type: 'doughnut',
                size: 140,
                showLegend: false
            }
        };
    },
    
    generateComparisonData() {
        return {
            chartData: [
                { label: 'Rashford', value: 17, color: '#ff6b35' },
                { label: 'Fernandes', value: 14, color: '#00d4aa' },
                { label: 'Højlund', value: 8, color: '#0094cc' },
                { label: 'Garnacho', value: 6, color: '#8066ff' }
            ],
            options: {
                orientation: 'horizontal',
                width: 280,
                height: 120
            }
        };
    },
    
    generateRevenueBreakdownData() {
        return {
            chartData: [
                { label: 'Matchday Revenue', value: 85, color: '#0094cc' },
                { label: 'TV Rights', value: 142, color: '#ff6b35' },
                { label: 'Commercial', value: 97, color: '#00ff88' },
                { label: 'Player Sales', value: 45, color: '#ffb800' },
                { label: 'UEFA Prize Money', value: 28, color: '#ff4757' }
            ],
            options: {
                type: 'doughnut',
                size: 180,
                showPercentages: true
            }
        };
    },
    
    generateMonthlyTrendData() {
        return {
            chartData: [
                { label: 'Jul', value: 25, category: 'Revenue', color: '#00ff88' },
                { label: 'Aug', value: 45, category: 'Revenue', color: '#00ff88' },
                { label: 'Sep', value: 38, category: 'Revenue', color: '#00ff88' },
                { label: 'Oct', value: 52, category: 'Revenue', color: '#00ff88' },
                { label: 'Nov', value: 41, category: 'Revenue', color: '#00ff88' },
                { label: 'Dec', value: 67, category: 'Revenue', color: '#00ff88' },
                { label: 'Jul', value: 32, category: 'Expenses', color: '#ff4757' },
                { label: 'Aug', value: 28, category: 'Expenses', color: '#ff4757' },
                { label: 'Sep', value: 35, category: 'Expenses', color: '#ff4757' },
                { label: 'Oct', value: 31, category: 'Expenses', color: '#ff4757' },
                { label: 'Nov', value: 29, category: 'Expenses', color: '#ff4757' },
                { label: 'Dec', value: 38, category: 'Expenses', color: '#ff4757' }
            ],
            options: {
                orientation: 'vertical',
                type: 'grouped',
                width: 300,
                height: 160
            }
        };
    },
    
    generateExpenseAnalysisData() {
        return {
            chartData: [
                { label: 'Player Wages', value: 165, color: '#ff6b35' },
                { label: 'Staff Salaries', value: 28, color: '#0094cc' },
                { label: 'Facilities', value: 22, color: '#00ff88' },
                { label: 'Youth Development', value: 15, color: '#ffb800' },
                { label: 'Marketing', value: 12, color: '#ff4757' },
                { label: 'Travel & Logistics', value: 8, color: '#8066ff' }
            ],
            options: {
                orientation: 'horizontal',
                width: 300,
                height: 160
            }
        };
    },
    
    generateBudgetComparisonData() {
        return {
            chartData: [
                { label: 'Q1', value: 78, category: 'Budgeted', color: '#0094cc' },
                { label: 'Q2', value: 85, category: 'Budgeted', color: '#0094cc' },
                { label: 'Q3', value: 92, category: 'Budgeted', color: '#0094cc' },
                { label: 'Q4', value: 88, category: 'Budgeted', color: '#0094cc' },
                { label: 'Q1', value: 82, category: 'Actual', color: '#ff6b35' },
                { label: 'Q2', value: 79, category: 'Actual', color: '#ff6b35' },
                { label: 'Q3', value: 95, category: 'Actual', color: '#ff6b35' },
                { label: 'Q4', value: 86, category: 'Actual', color: '#ff6b35' }
            ],
            options: {
                orientation: 'vertical',
                type: 'grouped',
                width: 300,
                height: 160
            }
        };
    },
    
    generatePlayerAttributeData() {
        return {
            chartData: [
                { label: 'Finishing', value: 17 },
                { label: 'Long Shots', value: 14 },
                { label: 'Technique', value: 16 },
                { label: 'Composure', value: 15 },
                { label: 'Decisions', value: 13 },
                { label: 'Flair', value: 18 }
            ],
            options: {
                size: 40
            }
        };
    },
    
    generateTacticalData() {
        return {
            chartData: [
                { label: 'Attacking', value: 85 },
                { label: 'Defending', value: 78 },
                { label: 'Creativity', value: 82 },
                { label: 'Work Rate', value: 88 },
                { label: 'Teamwork', value: 91 }
            ],
            options: {
                size: 35
            }
        };
    },
    
    generateDefaultData(chartType) {
        switch (chartType) {
            case 'BarChart':
                return {
                    chartData: [
                        { label: 'Data 1', value: 25, color: '#ff6b35' },
                        { label: 'Data 2', value: 18, color: '#0094cc' },
                        { label: 'Data 3', value: 32, color: '#00ff88' },
                        { label: 'Data 4', value: 14, color: '#ffb800' }
                    ],
                    options: {
                        orientation: 'vertical',
                        width: 250,
                        height: 150
                    }
                };
                
            case 'PizzaChart':
                return {
                    chartData: [
                        { label: 'Category A', value: 40, color: '#ff6b35' },
                        { label: 'Category B', value: 30, color: '#0094cc' },
                        { label: 'Category C', value: 20, color: '#00ff88' },
                        { label: 'Category D', value: 10, color: '#ffb800' }
                    ],
                    options: {
                        type: 'doughnut',
                        size: 140
                    }
                };
                
            case 'AttributeCircle':
                return {
                    chartData: [
                        { label: 'Skill 1', value: 15 },
                        { label: 'Skill 2', value: 12 },
                        { label: 'Skill 3', value: 18 },
                        { label: 'Skill 4', value: 14 }
                    ],
                    options: {
                        size: 32
                    }
                };
                
            default:
                return {
                    chartData: [],
                    options: {}
                };
        }
    },
    
    // Initialize specific Football Manager sections
    initializePerformanceDashboard() {
        // Look for performance dashboard cards and initialize their charts
        const performanceCards = document.querySelectorAll('.performance-dashboard-card, [data-card-id="performance-dashboard"]');
        
        performanceCards.forEach(card => {
            // Initialize performance charts if not already done
            setTimeout(() => {
                if (window.PerformanceDashboardCard && window.PerformanceDashboardCard.initializeCharts) {
                    window.PerformanceDashboardCard.initializeCharts();
                }
            }, 200);
        });
    },
    
    initializeFinancialCharts() {
        // Look for financial overview cards and initialize their charts
        const financialCards = document.querySelectorAll('.financial-overview-card, [data-card-id="financial-overview"]');
        
        financialCards.forEach(card => {
            setTimeout(() => {
                if (window.FinancialOverviewCard && window.FinancialOverviewCard.initializeCharts) {
                    window.FinancialOverviewCard.initializeCharts();
                }
            }, 200);
        });
    },
    
    initializePlayerAttributeCharts() {
        // Find all player attribute containers
        const attributeContainers = document.querySelectorAll('[class*="attribute"], [id*="attribute"], .player-stats');
        
        attributeContainers.forEach(container => {
            if (!this.charts.has(container.id) && !container.querySelector('.attribute-circle')) {
                this.createChart('AttributeCircle', container);
            }
        });
    },
    
    initializeTacticalCharts() {
        // Find tactical analysis containers
        const tacticalContainers = document.querySelectorAll('[class*="tactical"], [id*="tactical"], .formation-chart');
        
        tacticalContainers.forEach(container => {
            if (!this.charts.has(container.id)) {
                const chartType = container.className.includes('formation') ? 'AttributeCircle' : 'BarChart';
                this.createChart(chartType, container);
            }
        });
    },
    
    initializeAdditionalCharts() {
        // Initialize any additional charts found in various cards
        const additionalContainers = document.querySelectorAll('.chart-placeholder, .empty-chart, [data-chart-type]');
        
        additionalContainers.forEach(container => {
            const chartType = container.dataset.chartType || this.determineChartType(container.id, container.className);
            if (chartType && !this.charts.has(container.id)) {
                this.createChart(chartType, container);
            }
        });
    },
    
    // Event listeners for dynamic updates
    attachEventListeners() {
        // Listen for card loading events
        document.addEventListener('cardLoaded', (event) => {
            this.initializeChartContainer(event.detail.container);
        });
        
        // Listen for tab switches to re-initialize charts
        document.addEventListener('tabSwitched', (event) => {
            setTimeout(() => {
                this.initializeAllCharts();
            }, 100);
        });
        
        // Listen for card updates
        document.addEventListener('cardUpdated', (event) => {
            this.refreshChart(event.detail.cardId);
        });
    },
    
    // Auto-refresh charts periodically
    startAutoRefresh() {
        setInterval(() => {
            this.refreshAllCharts();
        }, 30000); // Refresh every 30 seconds
    },
    
    // Refresh a specific chart
    refreshChart(chartId) {
        const chartInfo = this.charts.get(chartId);
        if (chartInfo) {
            const newData = this.generateDataForChart(chartId, chartInfo.type);
            
            if (chartInfo.instance.updateData) {
                chartInfo.instance.updateData(newData.chartData);
            } else if (Array.isArray(chartInfo.instance)) {
                // Handle AttributeCircle arrays
                chartInfo.instance.forEach((circle, index) => {
                    if (newData.chartData[index]) {
                        circle.updateValue(newData.chartData[index].value);
                    }
                });
            }
        }
    },
    
    // Refresh all charts
    refreshAllCharts() {
        this.charts.forEach((chartInfo, chartId) => {
            this.refreshChart(chartId);
        });
    },
    
    // Get Football Manager themed colors
    getFootballManagerColors() {
        return [
            'var(--primary-300)', 'var(--accent-100)', 'var(--accent-200)',
            'var(--accent-300)', '#8066ff', '#cc6600', '#ff4757',
            '#00d4aa', '#4d7fff', '#ffa726'
        ];
    },
    
    // Destroy all charts
    destroyAllCharts() {
        this.charts.forEach((chartInfo) => {
            if (chartInfo.instance) {
                if (chartInfo.instance.destroy) {
                    chartInfo.instance.destroy();
                } else if (Array.isArray(chartInfo.instance)) {
                    chartInfo.instance.forEach(chart => {
                        if (chart.destroy) chart.destroy();
                    });
                }
            }
        });
        this.charts.clear();
    },
    
    // Public API methods
    getChart(chartId) {
        return this.charts.get(chartId);
    },
    
    getAllCharts() {
        return Array.from(this.charts.values());
    },
    
    getChartsByType(chartType) {
        return Array.from(this.charts.values()).filter(chart => chart.type === chartType);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.ChartIntegrationSystem.initialize();
    }, 1000);
});

// Also initialize if already loaded
if (document.readyState === 'complete') {
    setTimeout(() => {
        window.ChartIntegrationSystem.initialize();
    }, 1000);
}

// Export for global access
window.FMCharts = window.ChartIntegrationSystem;

console.log('📊 Football Manager Chart Integration System loaded and ready');