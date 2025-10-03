/**
 * IMPLEMENT PERFORMANCE CHARTS
 * Create working visualizations for Performance Dashboard and other cards
 * Following ZENITH principles with 60fps performance
 */

(function() {
    'use strict';

    console.log('📊 IMPLEMENT PERFORMANCE CHARTS: Creating Football Manager quality visualizations...');

    const PerformanceCharts = {
        initialized: false,
        charts: new Map(),
        
        init() {
            if (this.initialized) return;
            
            console.log('📊 PERFORMANCE CHARTS: Initializing visualization system...');
            
            // Wait for visualization components to be ready
            this.waitForDependencies().then(() => {
                this.createPerformanceDashboardCharts();
                this.createPlayerAttributeCharts();
                this.createTacticalVisualization();
                this.createFinancialCharts();
                this.setupChartInteractions();
                
                this.initialized = true;
                console.log('✅ PERFORMANCE CHARTS: All visualizations implemented');
            });
        },
        
        async waitForDependencies() {
            return new Promise((resolve) => {
                const checkDeps = () => {
                    if (window.AttributeCircle && window.BarChart && window.PizzaChart) {
                        resolve();
                    } else {
                        setTimeout(checkDeps, 100);
                    }
                };
                checkDeps();
            });
        },
        
        createPerformanceDashboardCharts() {
            console.log('📈 Creating Performance Dashboard charts...');
            
            // Find Performance Dashboard card
            const performanceCards = document.querySelectorAll('.card').forEach(card => {
                const titleSpan = card.querySelector('.card-header span');
                if (titleSpan && titleSpan.textContent.includes('Performance Dashboard')) {
                    this.enhancePerformanceDashboard(card);
                }
            });
        },
        
        enhancePerformanceDashboard(card) {
            console.log('📈 Enhancing Performance Dashboard with working charts...');
            
            // Create trend chart
            const trendChartContainer = card.querySelector('#trend-chart-performance-dashboard');
            if (trendChartContainer) {
                const trendChart = new window.BarChart({
                    container: trendChartContainer,
                    data: [
                        { label: 'Aug', value: 15 },
                        { label: 'Sep', value: 18 },
                        { label: 'Oct', value: 22 },
                        { label: 'Nov', value: 17 },
                        { label: 'Dec', value: 25 }
                    ],
                    orientation: 'vertical',
                    height: 120,
                    animate: true
                });
                
                this.charts.set('performance-trend', trendChart);
                console.log('✅ Performance trend chart created');
            }
            
            // Create form chart  
            const formChartContainer = card.querySelector('#form-chart-performance-dashboard');
            if (formChartContainer) {
                const formChart = new window.BarChart({
                    container: formChartContainer,
                    data: [
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'D', value: 1, color: '#ffb800' },
                        { label: 'L', value: 0, color: '#ff4757' },
                        { label: 'W', value: 3, color: '#00ff88' }
                    ],
                    orientation: 'vertical',
                    height: 80,
                    animate: true
                });
                
                this.charts.set('performance-form', formChart);
                console.log('✅ Performance form chart created');
            }
            
            // Create performance radar
            const radarContainer = card.querySelector('#performance-radar-performance-dashboard');
            if (radarContainer) {
                const radarChart = new window.PizzaChart({
                    container: radarContainer,
                    data: [
                        { label: 'Attack', value: 85 },
                        { label: 'Defense', value: 78 },
                        { label: 'Midfield', value: 82 },
                        { label: 'Pace', value: 79 },
                        { label: 'Passing', value: 88 },
                        { label: 'Physical', value: 76 }
                    ],
                    type: 'radar',
                    size: 120
                });
                
                this.charts.set('performance-radar', radarChart);
                console.log('✅ Performance radar chart created');
            }
        },
        
        createPlayerAttributeCharts() {
            console.log('👤 Creating Player attribute visualizations...');
            
            // Find Player Detail cards
            document.querySelectorAll('.card').forEach(card => {
                const titleSpan = card.querySelector('.card-header span');
                if (titleSpan && titleSpan.textContent.includes('Player')) {
                    this.enhancePlayerCard(card);
                }
            });
        },
        
        enhancePlayerCard(card) {
            console.log('👤 Enhancing Player card with attribute circles...');
            
            // Create attribute circles for key attributes
            const attributeContainer = card.querySelector('.player-attributes') || this.createAttributeContainer(card);
            
            const keyAttributes = [
                { name: 'Pace', value: 85, color: '#ff6b35' },
                { name: 'Shooting', value: 78, color: '#00ff88' },
                { name: 'Passing', value: 82, color: '#0094cc' },
                { name: 'Dribbling', value: 79, color: '#ffb800' },
                { name: 'Defending', value: 45, color: '#ff4757' },
                { name: 'Physical', value: 76, color: '#8066ff' }
            ];
            
            keyAttributes.forEach(attr => {
                const circle = new window.AttributeCircle({
                    container: attributeContainer,
                    value: attr.value,
                    label: attr.name,
                    size: 32,
                    customColor: attr.color,
                    animate: true
                });
                
                this.charts.set(`player-${attr.name.toLowerCase()}`, circle);
            });
            
            console.log('✅ Player attribute circles created');
        },
        
        createAttributeContainer(card) {
            const container = document.createElement('div');
            container.className = 'player-attributes';
            container.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin: 16px 0;
            `;
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.appendChild(container);
            }
            
            return container;
        },
        
        createTacticalVisualization() {
            console.log('⚽ Creating Tactical visualizations...');
            
            // Find Tactical cards
            document.querySelectorAll('.card').forEach(card => {
                const titleSpan = card.querySelector('.card-header span');
                if (titleSpan && (titleSpan.textContent.includes('Formation') || titleSpan.textContent.includes('Tactical'))) {
                    this.enhanceTacticalCard(card);
                }
            });
        },
        
        enhanceTacticalCard(card) {
            console.log('⚽ Enhancing Tactical card with formation visualization...');
            
            // Create formation heat map
            const heatMapContainer = this.createHeatMapContainer(card);
            
            // Simple heat map using colored divs (can be enhanced with canvas later)
            const formationData = [
                { position: 'GK', heat: 60, x: 50, y: 85 },
                { position: 'CB', heat: 75, x: 35, y: 70 },
                { position: 'CB', heat: 78, x: 65, y: 70 },
                { position: 'LB', heat: 82, x: 15, y: 60 },
                { position: 'RB', heat: 79, x: 85, y: 60 },
                { position: 'DM', heat: 85, x: 50, y: 55 },
                { position: 'CM', heat: 88, x: 40, y: 40 },
                { position: 'CM', heat: 84, x: 60, y: 40 },
                { position: 'LW', heat: 90, x: 20, y: 25 },
                { position: 'RW', heat: 87, x: 80, y: 25 },
                { position: 'ST', heat: 92, x: 50, y: 15 }
            ];
            
            formationData.forEach(player => {
                const playerDot = document.createElement('div');
                playerDot.className = 'formation-player';
                playerDot.style.cssText = `
                    position: absolute;
                    left: ${player.x}%;
                    top: ${player.y}%;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: hsla(${player.heat * 1.2}, 70%, 60%, 0.8);
                    border: 2px solid white;
                    transform: translate(-50%, -50%);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
                `;
                
                playerDot.title = `${player.position}: ${player.heat}% effectiveness`;
                
                playerDot.addEventListener('mouseenter', () => {
                    playerDot.style.transform = 'translate(-50%, -50%) scale(1.3)';
                    playerDot.style.zIndex = '10';
                });
                
                playerDot.addEventListener('mouseleave', () => {
                    playerDot.style.transform = 'translate(-50%, -50%) scale(1)';
                    playerDot.style.zIndex = '1';
                });
                
                heatMapContainer.appendChild(playerDot);
            });
            
            console.log('✅ Tactical formation heat map created');
        },
        
        createHeatMapContainer(card) {
            const container = document.createElement('div');
            container.className = 'formation-heat-map';
            container.style.cssText = `
                position: relative;
                width: 100%;
                height: 200px;
                background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
                border-radius: 8px;
                margin: 16px 0;
                overflow: hidden;
            `;
            
            // Add pitch markings
            const pitchMarkings = document.createElement('div');
            pitchMarkings.innerHTML = `
                <div style="position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: rgba(255,255,255,0.3);"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.3);"></div>
                <div style="position: absolute; left: 30%; right: 30%; top: 10%; height: 1px; background: rgba(255,255,255,0.2);"></div>
                <div style="position: absolute; left: 30%; right: 30%; bottom: 10%; height: 1px; background: rgba(255,255,255,0.2);"></div>
            `;
            container.appendChild(pitchMarkings);
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.appendChild(container);
            }
            
            return container;
        },
        
        createFinancialCharts() {
            console.log('💰 Creating Financial visualizations...');
            
            document.querySelectorAll('.card').forEach(card => {
                const titleSpan = card.querySelector('.card-header span');
                if (titleSpan && titleSpan.textContent.includes('Financial')) {
                    this.enhanceFinancialCard(card);
                }
            });
        },
        
        enhanceFinancialCard(card) {
            console.log('💰 Enhancing Financial card with charts...');
            
            const chartContainer = document.createElement('div');
            chartContainer.className = 'financial-charts';
            chartContainer.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin: 16px 0;
            `;
            
            // Revenue breakdown pie chart
            const revenueContainer = document.createElement('div');
            revenueContainer.style.height = '120px';
            
            const revenueChart = new window.PizzaChart({
                container: revenueContainer,
                data: [
                    { label: 'TV Rights', value: 215, color: '#0094cc' },
                    { label: 'Commercial', value: 275, color: '#00ff88' },
                    { label: 'Matchday', value: 110, color: '#ffb800' },
                    { label: 'Other', value: 45, color: '#ff6b35' }
                ],
                size: 100,
                showLabels: true
            });
            
            // Expense breakdown
            const expenseContainer = document.createElement('div');
            expenseContainer.style.height = '120px';
            
            const expenseChart = new window.BarChart({
                container: expenseContainer,
                data: [
                    { label: 'Wages', value: 198 },
                    { label: 'Operations', value: 87 },
                    { label: 'Transfers', value: 125 }
                ],
                orientation: 'horizontal',
                height: 100,
                colors: ['#ff4757', '#ffa502', '#ff6b35']
            });
            
            chartContainer.appendChild(revenueContainer);
            chartContainer.appendChild(expenseContainer);
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.appendChild(chartContainer);
            }
            
            this.charts.set('financial-revenue', revenueChart);
            this.charts.set('financial-expense', expenseChart);
            
            console.log('✅ Financial charts created');
        },
        
        setupChartInteractions() {
            console.log('🎮 Setting up chart interactions...');
            
            // Connect dropdown changes to chart updates
            document.addEventListener('change', (e) => {
                if (e.target.matches('.period-selector')) {
                    const period = e.target.value;
                    console.log(`📊 Updating charts for period: ${period}`);
                    this.updateChartsForPeriod(period);
                }
                
                if (e.target.matches('.metric-selector')) {
                    const metric = e.target.value;
                    console.log(`📊 Updating charts for metric: ${metric}`);
                    this.updateChartsForMetric(metric);
                }
                
                if (e.target.matches('.player-selector')) {
                    const playerId = e.target.value;
                    console.log(`👤 Updating player charts for: ${playerId}`);
                    this.updatePlayerCharts(playerId);
                }
            });
            
            console.log('✅ Chart interactions setup complete');
        },
        
        updateChartsForPeriod(period) {
            // Update chart data based on selected period
            const periodData = {
                month: { goals: 8, assists: 3, rating: 7.1 },
                season: { goals: 17, assists: 5, rating: 7.2 },
                year: { goals: 25, assists: 12, rating: 7.4 },
                career: { goals: 156, assists: 78, rating: 7.6 }
            };
            
            const data = periodData[period] || periodData.season;
            
            // Update trend chart if it exists
            const trendChart = this.charts.get('performance-trend');
            if (trendChart && trendChart.updateData) {
                trendChart.updateData([
                    { label: 'Goals', value: data.goals },
                    { label: 'Assists', value: data.assists },
                    { label: 'Rating', value: data.rating * 10 }
                ]);
            }
        },
        
        updateChartsForMetric(metric) {
            // Update chart focus based on selected metric
            console.log(`Updating chart focus to: ${metric}`);
        },
        
        updatePlayerCharts(playerId) {
            // Update player-specific visualizations
            if (!playerId) return;
            
            console.log(`Updating player visualizations for ID: ${playerId}`);
            
            // Mock player data
            const playerData = {
                '1': { pace: 95, shooting: 88, passing: 75, dribbling: 92, defending: 35, physical: 82 },
                '2': { pace: 65, shooting: 82, passing: 95, dribbling: 85, defending: 55, physical: 78 },
                '3': { pace: 70, shooting: 45, passing: 88, dribbling: 65, defending: 92, physical: 89 }
            };
            
            const attributes = playerData[playerId];
            if (attributes) {
                // Update attribute circles
                Object.entries(attributes).forEach(([attr, value]) => {
                    const circle = this.charts.get(`player-${attr}`);
                    if (circle && circle.updateValue) {
                        circle.updateValue(value);
                    }
                });
            }
        }
    };

    // Auto-initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => PerformanceCharts.init(), 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => PerformanceCharts.init(), 2000);
        });
    }

    // Make available globally for Chrome MCP testing
    window.PerformanceCharts = PerformanceCharts;

})();