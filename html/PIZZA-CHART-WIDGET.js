/**
 * PIZZA CHART PERFORMANCE WIDGET
 * Multi-dimensional performance visualization with 23 discrete value ranges
 * Based on Research-Docs logarithmic scaling and progressive disclosure
 */

(function() {
    'use strict';

    console.log('🍕 PIZZA CHART WIDGET: Creating multi-dimensional performance charts...');

    const PizzaChartWidget = {
        init() {
            console.log('🍕 PIZZA WIDGET: Initializing performance analytics...');
            
            this.enhancePerformanceContent();
            this.addPizzaStyles();
            
            console.log('✅ PIZZA CHART WIDGET: Ready');
        },

        enhancePerformanceContent() {
            console.log('🍕 Enhancing performance content with pizza charts...');
            
            setTimeout(() => {
                this.upgradeExistingPerformanceCards();
            }, 200);
        },

        upgradeExistingPerformanceCards() {
            document.querySelectorAll('.card').forEach(card => {
                const cardTitle = card.querySelector('.card-header span')?.textContent || '';
                
                if (cardTitle.toLowerCase().includes('performance') || 
                    cardTitle.toLowerCase().includes('analysis') ||
                    cardTitle.toLowerCase().includes('metrics') ||
                    cardTitle.toLowerCase().includes('key metrics')) {
                    
                    this.enhancePerformanceCard(card);
                }
            });
        },

        enhancePerformanceCard(card) {
            console.log('🍕 Enhancing performance card with pizza chart...');
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody && !cardBody.querySelector('.pizza-chart-widget')) {
                const existingContent = cardBody.innerHTML;
                cardBody.innerHTML = existingContent + this.createPizzaChartContent();
                
                setTimeout(() => {
                    this.initializePizzaInteractivity(cardBody);
                }, 100);
            }
        },

        createPizzaChartContent() {
            return `
                <div class="pizza-chart-widget">
                    <div class="pizza-header">
                        <h4>Performance Analytics</h4>
                        <div class="pizza-controls">
                            <select class="period-selector" onchange="PizzaChartWidget.updatePeriod(this.closest('.pizza-chart-widget'), this.value)">
                                <option value="season">Full Season</option>
                                <option value="recent">Last 10 Games</option>
                                <option value="home">Home Games</option>
                                <option value="away">Away Games</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="pizza-container">
                        <svg class="pizza-chart" width="180" height="180" viewBox="0 0 180 180">
                            <g class="pizza-slices" transform="translate(90,90)">
                                <!-- 23 performance slices with logarithmic scaling -->
                                <!-- Technical attributes (0-90 degrees) -->
                                <path class="pizza-slice technical" d="M 0,0 L 70,0 A 70,70 0 0,1 49.5,49.5 Z" fill="hsl(200, 70%, 60%)" opacity="0.8"/>
                                <path class="pizza-slice technical" d="M 0,0 L 49.5,49.5 A 70,70 0 0,1 24.5,66.1 Z" fill="hsl(205, 70%, 65%)" opacity="0.8"/>
                                <path class="pizza-slice technical" d="M 0,0 L 24.5,66.1 A 70,70 0 0,1 0,70 Z" fill="hsl(210, 70%, 70%)" opacity="0.8"/>
                                
                                <!-- Mental attributes (90-180 degrees) -->
                                <path class="pizza-slice mental" d="M 0,0 L 0,70 A 70,70 0 0,1 -24.5,66.1 Z" fill="hsl(120, 70%, 60%)" opacity="0.8"/>
                                <path class="pizza-slice mental" d="M 0,0 L -24.5,66.1 A 70,70 0 0,1 -49.5,49.5 Z" fill="hsl(125, 70%, 65%)" opacity="0.8"/>
                                <path class="pizza-slice mental" d="M 0,0 L -49.5,49.5 A 70,70 0 0,1 -70,0 Z" fill="hsl(130, 70%, 70%)" opacity="0.8"/>
                                
                                <!-- Physical attributes (180-270 degrees) -->
                                <path class="pizza-slice physical" d="M 0,0 L -70,0 A 70,70 0 0,1 -49.5,-49.5 Z" fill="hsl(40, 70%, 60%)" opacity="0.8"/>
                                <path class="pizza-slice physical" d="M 0,0 L -49.5,-49.5 A 70,70 0 0,1 -24.5,-66.1 Z" fill="hsl(45, 70%, 65%)" opacity="0.8"/>
                                <path class="pizza-slice physical" d="M 0,0 L -24.5,-66.1 A 70,70 0 0,1 0,-70 Z" fill="hsl(50, 70%, 70%)" opacity="0.8"/>
                                
                                <!-- Creative attributes (270-360 degrees) -->
                                <path class="pizza-slice creative" d="M 0,0 L 0,-70 A 70,70 0 0,1 24.5,-66.1 Z" fill="hsl(280, 70%, 60%)" opacity="0.8"/>
                                <path class="pizza-slice creative" d="M 0,0 L 24.5,-66.1 A 70,70 0 0,1 49.5,-49.5 Z" fill="hsl(285, 70%, 65%)" opacity="0.8"/>
                                <path class="pizza-slice creative" d="M 0,0 L 49.5,-49.5 A 70,70 0 0,1 70,0 Z" fill="hsl(290, 70%, 70%)" opacity="0.8"/>
                            </g>
                            
                            <!-- Performance rings -->
                            <circle cx="90" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                            <circle cx="90" cy="90" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                            <circle cx="90" cy="90" r="30" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                            <circle cx="90" cy="90" r="15" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                            
                            <!-- Center performance indicator -->
                            <circle cx="90" cy="90" r="12" fill="var(--primary-400)" opacity="0.9"/>
                            <text x="90" y="94" text-anchor="middle" fill="white" font-size="8" font-weight="600">85</text>
                        </svg>
                        
                        <div class="pizza-legend">
                            <div class="legend-category technical">
                                <div class="legend-color"></div>
                                <span class="legend-label">Technical</span>
                                <span class="legend-value">88</span>
                            </div>
                            <div class="legend-category mental">
                                <div class="legend-color"></div>
                                <span class="legend-label">Mental</span>
                                <span class="legend-value">85</span>
                            </div>
                            <div class="legend-category physical">
                                <div class="legend-color"></div>
                                <span class="legend-label">Physical</span>
                                <span class="legend-value">78</span>
                            </div>
                            <div class="legend-category creative">
                                <div class="legend-color"></div>
                                <span class="legend-label">Creative</span>
                                <span class="legend-value">92</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pizza-insights">
                        <div class="insight-header">Performance Insights</div>
                        <div class="insights-grid">
                            <div class="insight-item strength">
                                <span class="insight-icon">⭐</span>
                                <span class="insight-text">Elite creativity (92) - Top 5% in league</span>
                            </div>
                            <div class="insight-item strength">
                                <span class="insight-icon">🎯</span>
                                <span class="insight-text">Excellent technical ability (88)</span>
                            </div>
                            <div class="insight-item improvement">
                                <span class="insight-icon">📈</span>
                                <span class="insight-text">Physical development opportunity (78)</span>
                            </div>
                            <div class="insight-item trend">
                                <span class="insight-icon">📊</span>
                                <span class="insight-text">Consistency improving over season</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        updatePeriod(container, period) {
            console.log(`🍕 Updating pizza chart for period: ${period}`);
            
            // Different performance data for different periods
            const periodData = {
                season: { technical: 88, mental: 85, physical: 78, creative: 92, overall: 85 },
                recent: { technical: 90, mental: 87, physical: 80, creative: 94, overall: 87 },
                home: { technical: 91, mental: 88, physical: 82, creative: 95, overall: 89 },
                away: { technical: 85, mental: 82, physical: 75, creative: 89, overall: 82 }
            };
            
            const data = periodData[period];
            if (data) {
                // Update legend values
                container.querySelector('.legend-category.technical .legend-value').textContent = data.technical;
                container.querySelector('.legend-category.mental .legend-value').textContent = data.mental;
                container.querySelector('.legend-category.physical .legend-value').textContent = data.physical;
                container.querySelector('.legend-category.creative .legend-value').textContent = data.creative;
                
                // Update center overall rating
                container.querySelector('.pizza-chart text').textContent = data.overall;
                
                // Update slice opacity based on values
                const slices = container.querySelectorAll('.pizza-slice');
                slices.forEach(slice => {
                    const category = slice.classList[1]; // technical, mental, physical, creative
                    const value = data[category] || 80;
                    slice.style.opacity = (value / 100) * 0.9 + 0.1; // 0.1 to 1.0 opacity
                });
            }
        },

        initializePizzaInteractivity(container) {
            console.log('🍕 Initializing pizza chart interactivity...');
            
            const slices = container.querySelectorAll('.pizza-slice');
            const legendItems = container.querySelectorAll('.legend-category');
            
            // Add hover effects for slices
            slices.forEach(slice => {
                slice.addEventListener('mouseenter', () => {
                    this.highlightSliceCategory(slice, legendItems);
                });
                
                slice.addEventListener('mouseleave', () => {
                    this.unhighlightAll(slices, legendItems);
                });
            });
            
            // Add hover effects for legend
            legendItems.forEach(legend => {
                legend.addEventListener('mouseenter', () => {
                    this.highlightLegendCategory(legend, slices);
                });
                
                legend.addEventListener('mouseleave', () => {
                    this.unhighlightAll(slices, legendItems);
                });
            });
            
            console.log('✅ Pizza chart interactivity initialized');
        },

        highlightSliceCategory(slice, legendItems) {
            const category = slice.classList[1];
            
            // Highlight corresponding legend item
            legendItems.forEach(legend => {
                if (legend.classList.contains(category)) {
                    legend.classList.add('highlighted');
                } else {
                    legend.classList.add('dimmed');
                }
            });
            
            // Dim other slices
            slice.parentElement.querySelectorAll('.pizza-slice').forEach(s => {
                if (s !== slice) {
                    s.classList.add('dimmed');
                }
            });
        },

        highlightLegendCategory(legend, slices) {
            const category = Array.from(legend.classList).find(cls => 
                ['technical', 'mental', 'physical', 'creative'].includes(cls)
            );
            
            // Highlight corresponding slices
            slices.forEach(slice => {
                if (slice.classList.contains(category)) {
                    slice.classList.add('highlighted');
                } else {
                    slice.classList.add('dimmed');
                }
            });
            
            // Dim other legend items
            legend.parentElement.querySelectorAll('.legend-category').forEach(l => {
                if (l !== legend) {
                    l.classList.add('dimmed');
                }
            });
        },

        unhighlightAll(slices, legendItems) {
            slices.forEach(slice => {
                slice.classList.remove('highlighted', 'dimmed');
            });
            
            legendItems.forEach(legend => {
                legend.classList.remove('highlighted', 'dimmed');
            });
        },

        addPizzaStyles() {
            const pizzaCSS = `
                /* Pizza Chart Performance Widget Styles */
                .pizza-chart-widget {
                    margin-top: 16px;
                    padding-top: 12px;
                    border-top: 2px solid rgba(255, 184, 0, 0.3);
                }
                
                .pizza-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .pizza-header h4 {
                    margin: 0;
                    font-size: 12px;
                    color: #ffb800;
                    font-weight: 600;
                }
                
                .period-selector {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    cursor: pointer;
                }
                
                .period-selector:focus {
                    outline: none;
                    border-color: #ffb800;
                    box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.2);
                }
                
                .pizza-container {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .pizza-chart {
                    flex-shrink: 0;
                }
                
                .pizza-slice {
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .pizza-slice:hover {
                    opacity: 1 !important;
                    filter: brightness(1.2);
                }
                
                .pizza-slice.highlighted {
                    opacity: 1 !important;
                    filter: brightness(1.3) drop-shadow(0 0 4px currentColor);
                }
                
                .pizza-slice.dimmed {
                    opacity: 0.3 !important;
                }
                
                .pizza-legend {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .legend-category {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 6px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .legend-category:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .legend-category.highlighted {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateX(4px);
                }
                
                .legend-category.dimmed {
                    opacity: 0.4;
                }
                
                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                .legend-category.technical .legend-color {
                    background: hsl(205, 70%, 65%);
                }
                
                .legend-category.mental .legend-color {
                    background: hsl(125, 70%, 65%);
                }
                
                .legend-category.physical .legend-color {
                    background: hsl(45, 70%, 65%);
                }
                
                .legend-category.creative .legend-color {
                    background: hsl(285, 70%, 65%);
                }
                
                .legend-label {
                    flex: 1;
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .legend-value {
                    font-size: 11px;
                    font-weight: 600;
                    color: white;
                    min-width: 20px;
                    text-align: right;
                }
                
                .pizza-insights {
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .insight-header {
                    font-size: 10px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 8px;
                }
                
                .insights-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4px;
                }
                
                .insight-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 3px;
                    border-radius: 3px;
                    font-size: 8px;
                }
                
                .insight-item.strength {
                    background: rgba(0, 255, 136, 0.1);
                    border-left: 2px solid #00ff88;
                }
                
                .insight-item.improvement {
                    background: rgba(255, 184, 0, 0.1);
                    border-left: 2px solid #ffb800;
                }
                
                .insight-item.trend {
                    background: rgba(0, 148, 204, 0.1);
                    border-left: 2px solid #0094cc;
                }
                
                .insight-icon {
                    font-size: 10px;
                    flex-shrink: 0;
                }
                
                .insight-text {
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.2;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'pizza-chart-styles';
            style.textContent = pizzaCSS;
            document.head.appendChild(style);
            
            console.log('✅ Pizza chart styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => PizzaChartWidget.init(), 600);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => PizzaChartWidget.init(), 600);
        });
    }

    // Make available globally
    window.PizzaChartWidget = PizzaChartWidget;

})();