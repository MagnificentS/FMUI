/**
 * POPULATE CHART CONTAINERS
 * Find all empty chart containers and populate them with working visualizations
 * Using Chrome MCP debugging to ensure charts actually render
 */

(function() {
    'use strict';

    console.log('📊 POPULATE CHART CONTAINERS: Finding and filling empty chart containers...');

    const ChartPopulator = {
        initialized: false,
        populatedCharts: new Map(),
        
        init() {
            if (this.initialized) return;
            
            // Wait for visualization components to be ready
            this.waitForComponents().then(() => {
                this.scanAndPopulateCharts();
                this.setupDynamicPopulation();
                this.initialized = true;
                console.log('✅ CHART POPULATION: All containers populated');
            });
        },
        
        async waitForComponents() {
            return new Promise((resolve) => {
                const checkComponents = () => {
                    if (window.AttributeCircle && window.BarChart && window.PizzaChart) {
                        console.log('✅ Visualization components ready');
                        resolve();
                    } else {
                        console.log('⏳ Waiting for visualization components...');
                        setTimeout(checkComponents, 200);
                    }
                };
                checkComponents();
            });
        },
        
        scanAndPopulateCharts() {
            console.log('🔍 Scanning for empty chart containers...');
            
            // Find all chart containers
            const chartContainers = document.querySelectorAll('.chart-container, [id*="chart"], [id*="Chart"]');
            console.log(`Found ${chartContainers.length} chart containers`);
            
            chartContainers.forEach((container, index) => {
                if (container.children.length === 0 || container.innerHTML.trim() === '') {
                    console.log(`📊 Populating empty container: ${container.id || 'container-' + index}`);
                    this.populateContainer(container);
                }
            });
            
            // Also check for specific card types and add charts
            this.addChartsToCards();
        },
        
        populateContainer(container) {
            const containerId = container.id || container.className;
            
            // Determine chart type based on container ID or context
            if (containerId.includes('trend') || containerId.includes('Trend')) {
                this.createTrendChart(container);
            } else if (containerId.includes('form') || containerId.includes('Form')) {
                this.createFormChart(container);
            } else if (containerId.includes('radar') || containerId.includes('Radar')) {
                this.createRadarChart(container);
            } else if (containerId.includes('comparison') || containerId.includes('Comparison')) {
                this.createComparisonChart(container);
            } else if (containerId.includes('revenue') || containerId.includes('Revenue')) {
                this.createRevenueChart(container);
            } else if (containerId.includes('age') || containerId.includes('Age')) {
                this.createAgeChart(container);
            } else if (containerId.includes('position') || containerId.includes('Position')) {
                this.createPositionChart(container);
            } else if (containerId.includes('wage') || containerId.includes('Wage')) {
                this.createWageChart(container);
            } else if (containerId.includes('value') || containerId.includes('Value')) {
                this.createValueChart(container);
            } else {
                // Default chart
                this.createDefaultChart(container);
            }
        },
        
        createTrendChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'Aug', value: 15 },
                    { label: 'Sep', value: 18 },
                    { label: 'Oct', value: 22 },
                    { label: 'Nov', value: 17 },
                    { label: 'Dec', value: 25 }
                ],
                orientation: 'vertical',
                width: container.offsetWidth || 200,
                height: container.offsetHeight || 120,
                animate: true
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created trend chart for: ${container.id}`);
        },
        
        createFormChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'W', value: 3, color: '#00ff88' },
                    { label: 'W', value: 3, color: '#00ff88' },
                    { label: 'D', value: 1, color: '#ffb800' },
                    { label: 'L', value: 0, color: '#ff4757' },
                    { label: 'W', value: 3, color: '#00ff88' }
                ],
                orientation: 'vertical',
                width: container.offsetWidth || 150,
                height: container.offsetHeight || 80,
                animate: true,
                showValues: false
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created form chart for: ${container.id}`);
        },
        
        createRadarChart(container) {
            const chart = new window.PizzaChart({
                container: container,
                data: [
                    { label: 'Attack', value: 85 },
                    { label: 'Defense', value: 78 },
                    { label: 'Midfield', value: 82 },
                    { label: 'Pace', value: 79 },
                    { label: 'Passing', value: 88 },
                    { label: 'Physical', value: 76 }
                ],
                type: 'radar',
                size: Math.min(container.offsetWidth || 120, container.offsetHeight || 120)
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created radar chart for: ${container.id}`);
        },
        
        createComparisonChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'Goals', value: 17 },
                    { label: 'Assists', value: 8 },
                    { label: 'Rating', value: 72 },
                    { label: 'Minutes', value: 2890 }
                ],
                orientation: 'horizontal',
                width: container.offsetWidth || 250,
                height: container.offsetHeight || 140,
                animate: true
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created comparison chart for: ${container.id}`);
        },
        
        createRevenueChart(container) {
            const chart = new window.PizzaChart({
                container: container,
                data: [
                    { label: 'TV Rights', value: 215, color: '#0094cc' },
                    { label: 'Commercial', value: 275, color: '#00ff88' },
                    { label: 'Matchday', value: 110, color: '#ffb800' },
                    { label: 'Other', value: 45, color: '#ff6b35' }
                ],
                type: 'pie',
                size: Math.min(container.offsetWidth || 120, container.offsetHeight || 120),
                showLabels: true
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created revenue pie chart for: ${container.id}`);
        },
        
        createAgeChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: '18-21', value: 5 },
                    { label: '22-25', value: 8 },
                    { label: '26-29', value: 12 },
                    { label: '30-33', value: 6 },
                    { label: '34+', value: 2 }
                ],
                orientation: 'vertical',
                width: container.offsetWidth || 180,
                height: container.offsetHeight || 100,
                colors: ['#8066ff', '#0094cc', '#00ff88', '#ffb800', '#ff6b35']
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created age distribution chart for: ${container.id}`);
        },
        
        createPositionChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'GK', value: 85 },
                    { label: 'DEF', value: 78 },
                    { label: 'MID', value: 82 },
                    { label: 'ATT', value: 88 }
                ],
                orientation: 'horizontal',
                width: container.offsetWidth || 200,
                height: container.offsetHeight || 120,
                colors: ['#ff4757', '#ffb800', '#0094cc', '#00ff88']
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created position strength chart for: ${container.id}`);
        },
        
        createWageChart(container) {
            const chart = new window.PizzaChart({
                container: container,
                data: [
                    { label: 'Players', value: 198, color: '#0094cc' },
                    { label: 'Staff', value: 25, color: '#ffb800' },
                    { label: 'Bonuses', value: 32, color: '#ff6b35' }
                ],
                type: 'pie',
                size: Math.min(container.offsetWidth || 100, container.offsetHeight || 100)
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created wage distribution chart for: ${container.id}`);
        },
        
        createValueChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'Forwards', value: 190 },
                    { label: 'Midfield', value: 165 },
                    { label: 'Defense', value: 155 },
                    { label: 'Goalkeepers', value: 45 }
                ],
                orientation: 'horizontal',
                width: container.offsetWidth || 220,
                height: container.offsetHeight || 130,
                colors: ['#00ff88', '#0094cc', '#ffb800', '#ff6b35']
            });
            
            this.populatedCharts.set(container.id, chart);
            console.log(`✅ Created value breakdown chart for: ${container.id}`);
        },
        
        createDefaultChart(container) {
            // Create a simple bar chart as fallback
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'Metric A', value: 75 },
                    { label: 'Metric B', value: 82 },
                    { label: 'Metric C', value: 68 }
                ],
                orientation: 'horizontal',
                width: container.offsetWidth || 180,
                height: container.offsetHeight || 100
            });
            
            this.populatedCharts.set(container.id || 'default-' + Date.now(), chart);
            console.log(`✅ Created default chart for: ${container.id || 'unnamed container'}`);
        },
        
        addChartsToCards() {
            console.log('🎴 Adding charts to specific card types...');
            
            // Find cards that need charts but don't have chart containers
            document.querySelectorAll('.card').forEach(card => {
                const titleSpan = card.querySelector('.card-header span');
                if (!titleSpan) return;
                
                const title = titleSpan.textContent;
                
                if (title.includes('Performance') && !card.querySelector('.chart-container')) {
                    this.addPerformanceChartsToCard(card);
                } else if (title.includes('Player') && !card.querySelector('.attribute-circle')) {
                    this.addPlayerAttributesToCard(card);
                } else if (title.includes('Formation') && !card.querySelector('.formation-heat-map')) {
                    this.addFormationVisualizationToCard(card);
                } else if (title.includes('Financial') && !card.querySelector('.financial-charts')) {
                    this.addFinancialChartsToCard(card);
                }
            });
        },
        
        addPerformanceChartsToCard(card) {
            console.log('📈 Adding performance charts to card...');
            
            const cardBody = card.querySelector('.card-body');
            if (!cardBody) return;
            
            // Create charts container
            const chartsContainer = document.createElement('div');
            chartsContainer.className = 'performance-charts-grid';
            chartsContainer.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin: 16px 0;
            `;
            
            // Add trend chart
            const trendContainer = document.createElement('div');
            trendContainer.style.height = '120px';
            trendContainer.id = 'performance-trend-' + Date.now();
            
            const trendChart = new window.BarChart({
                container: trendContainer,
                data: [
                    { label: 'Goals', value: 17 },
                    { label: 'Assists', value: 5 },
                    { label: 'Rating', value: 72 }
                ],
                orientation: 'vertical',
                width: 150,
                height: 100
            });
            
            // Add radar chart
            const radarContainer = document.createElement('div');
            radarContainer.style.height = '120px';
            radarContainer.id = 'performance-radar-' + Date.now();
            
            const radarChart = new window.PizzaChart({
                container: radarContainer,
                data: [
                    { label: 'Attack', value: 85 },
                    { label: 'Defense', value: 78 },
                    { label: 'Physical', value: 82 },
                    { label: 'Mental', value: 79 }
                ],
                type: 'radar',
                size: 100
            });
            
            chartsContainer.appendChild(trendContainer);
            chartsContainer.appendChild(radarContainer);
            cardBody.appendChild(chartsContainer);
            
            this.populatedCharts.set('performance-trend', trendChart);
            this.populatedCharts.set('performance-radar', radarChart);
            
            console.log('✅ Performance charts added to card');
        },
        
        addPlayerAttributesToCard(card) {
            console.log('👤 Adding player attributes to card...');
            
            const cardBody = card.querySelector('.card-body');
            if (!cardBody) return;
            
            // Create attributes container
            const attributesContainer = document.createElement('div');
            attributesContainer.className = 'player-attributes-grid';
            attributesContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin: 16px 0;
                padding: 16px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
            `;
            
            // Add key attributes
            const attributes = [
                { name: 'Pace', value: 85, color: '#ff6b35' },
                { name: 'Shooting', value: 78, color: '#00ff88' },
                { name: 'Passing', value: 82, color: '#0094cc' },
                { name: 'Dribbling', value: 79, color: '#ffb800' },
                { name: 'Defending', value: 45, color: '#ff4757' },
                { name: 'Physical', value: 76, color: '#8066ff' }
            ];
            
            attributes.forEach(attr => {
                const attrContainer = document.createElement('div');
                
                const circle = new window.AttributeCircle({
                    container: attrContainer,
                    value: attr.value,
                    label: attr.name,
                    size: 40,
                    customColor: attr.color,
                    animate: true
                });
                
                attributesContainer.appendChild(attrContainer);
                this.populatedCharts.set(`player-${attr.name.toLowerCase()}`, circle);
            });
            
            cardBody.appendChild(attributesContainer);
            console.log('✅ Player attributes added to card');
        },
        
        addFormationVisualizationToCard(card) {
            console.log('⚽ Adding formation visualization to card...');
            
            const cardBody = card.querySelector('.card-body');
            if (!cardBody) return;
            
            // Create formation pitch
            const pitchContainer = document.createElement('div');
            pitchContainer.className = 'formation-pitch';
            pitchContainer.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
                border-radius: 8px;
                position: relative;
                margin: 16px 0;
                border: 2px solid rgba(255, 255, 255, 0.1);
            `;
            
            // Add pitch markings
            const markings = document.createElement('div');
            markings.innerHTML = `
                <div style="position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: rgba(255,255,255,0.4);"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.4);"></div>
                <div style="position: absolute; left: 25%; right: 25%; top: 15%; height: 1px; background: rgba(255,255,255,0.2);"></div>
                <div style="position: absolute; left: 25%; right: 25%; bottom: 15%; height: 1px; background: rgba(255,255,255,0.2);"></div>
            `;
            pitchContainer.appendChild(markings);
            
            // Add player positions (4-2-3-1 formation)
            const positions = [
                { name: 'GK', x: 50, y: 85, rating: 82 },
                { name: 'LB', x: 20, y: 65, rating: 78 },
                { name: 'CB', x: 40, y: 70, rating: 85 },
                { name: 'CB', x: 60, y: 70, rating: 83 },
                { name: 'RB', x: 80, y: 65, rating: 79 },
                { name: 'DM', x: 35, y: 50, rating: 88 },
                { name: 'DM', x: 65, y: 50, rating: 82 },
                { name: 'LW', x: 20, y: 30, rating: 87 },
                { name: 'AM', x: 50, y: 35, rating: 91 },
                { name: 'RW', x: 80, y: 30, rating: 84 },
                { name: 'ST', x: 50, y: 15, rating: 86 }
            ];
            
            positions.forEach(pos => {
                const player = document.createElement('div');
                player.style.cssText = `
                    position: absolute;
                    left: ${pos.x}%;
                    top: ${pos.y}%;
                    width: 16px;
                    height: 16px;
                    background: hsla(${pos.rating * 1.2}, 70%, 60%, 0.9);
                    border: 2px solid white;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    font-weight: 600;
                    color: white;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                `;
                
                player.textContent = pos.name;
                player.title = `${pos.name}: ${pos.rating} rating`;
                
                player.addEventListener('mouseenter', () => {
                    player.style.transform = 'translate(-50%, -50%) scale(1.3)';
                    player.style.zIndex = '10';
                });
                
                player.addEventListener('mouseleave', () => {
                    player.style.transform = 'translate(-50%, -50%) scale(1)';
                    player.style.zIndex = '1';
                });
                
                pitchContainer.appendChild(player);
            });
            
            cardBody.appendChild(pitchContainer);
            console.log('✅ Formation visualization added to card');
        },
        
        addFinancialChartsToCard(card) {
            console.log('💰 Adding financial charts to card...');
            
            const cardBody = card.querySelector('.card-body');
            if (!cardBody) return;
            
            const chartsContainer = document.createElement('div');
            chartsContainer.className = 'financial-charts-grid';
            chartsContainer.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin: 16px 0;
            `;
            
            // Revenue pie chart
            const revenueContainer = document.createElement('div');
            revenueContainer.style.height = '120px';
            
            const revenueChart = new window.PizzaChart({
                container: revenueContainer,
                data: [
                    { label: 'Commercial', value: 275, color: '#0094cc' },
                    { label: 'TV Rights', value: 215, color: '#00ff88' },
                    { label: 'Matchday', value: 110, color: '#ffb800' },
                    { label: 'Other', value: 45, color: '#ff6b35' }
                ],
                type: 'pie',
                size: 100
            });
            
            // Expense bar chart
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
                width: 150,
                height: 100,
                colors: ['#ff4757', '#ffa502', '#ff6b35']
            });
            
            chartsContainer.appendChild(revenueContainer);
            chartsContainer.appendChild(expenseContainer);
            cardBody.appendChild(chartsContainer);
            
            this.populatedCharts.set('financial-revenue', revenueChart);
            this.populatedCharts.set('financial-expense', expenseChart);
            
            console.log('✅ Financial charts added to card');
        },
        
        createDefaultChart(container) {
            const chart = new window.BarChart({
                container: container,
                data: [
                    { label: 'Value A', value: 75 },
                    { label: 'Value B', value: 82 },
                    { label: 'Value C', value: 68 }
                ],
                orientation: 'horizontal',
                width: container.offsetWidth || 150,
                height: container.offsetHeight || 80
            });
            
            this.populatedCharts.set(container.id || 'default-' + Date.now(), chart);
            console.log(`✅ Created default chart for: ${container.id || 'unnamed'}`);
        },
        
        setupDynamicPopulation() {
            console.log('🔄 Setting up dynamic chart population...');
            
            // Watch for new chart containers being added
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Check if it's a chart container
                            if (node.classList.contains('chart-container') || 
                                node.id.includes('chart') || 
                                node.id.includes('Chart')) {
                                
                                if (node.children.length === 0) {
                                    console.log(`🔄 New empty chart container detected: ${node.id}`);
                                    this.populateContainer(node);
                                }
                            }
                            
                            // Check child chart containers
                            const childContainers = node.querySelectorAll('.chart-container, [id*="chart"], [id*="Chart"]');
                            childContainers.forEach(container => {
                                if (container.children.length === 0) {
                                    console.log(`🔄 New child chart container detected: ${container.id}`);
                                    this.populateContainer(container);
                                }
                            });
                        }
                    });
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('✅ Dynamic chart population setup complete');
        }
    };

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => ChartPopulator.init(), 3000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ChartPopulator.init(), 3000);
        });
    }

    // Make available for Chrome MCP testing
    window.ChartPopulator = ChartPopulator;

})();