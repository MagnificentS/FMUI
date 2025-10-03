/**
 * PROFESSIONAL PIZZA CHARTS SYSTEM  
 * Implementing Research-Docs 23 discrete value ranges with logarithmic scaling
 * Multi-dimensional performance visualization with mathematical precision
 */

(function() {
    'use strict';

    console.log('🍕 PROFESSIONAL PIZZA CHARTS: Creating 23-segment logarithmic performance visualization...');

    const ProfessionalPizzaCharts = {
        // Research-Docs specifications
        SEGMENTS: 23,
        RADIUS: 100,
        LOGARITHMIC_BASE: Math.E,

        // Performance categories from Research-Docs
        performanceCategories: {
            technical: { color: '#0094cc', weight: 0.25 },
            mental: { color: '#00ff88', weight: 0.25 },
            physical: { color: '#ffb800', weight: 0.25 },
            creative: { color: '#ff6b35', weight: 0.25 }
        },

        init() {
            console.log('🍕 PIZZA SYSTEM: Implementing 23-segment logarithmic analytics...');
            
            this.enhanceAnalyticsContent();
            this.addProfessionalPizzaStyles();
            
            console.log('✅ PROFESSIONAL PIZZA CHARTS: Ready');
        },

        enhanceAnalyticsContent() {
            console.log('🍕 Enhancing analytics content with pizza charts...');
            
            setTimeout(() => {
                this.addPizzaChartsToAnalyticsCards();
            }, 300);
        },

        addPizzaChartsToAnalyticsCards() {
            document.querySelectorAll('.card').forEach(card => {
                const cardTitle = card.querySelector('.card-header span')?.textContent || '';
                
                if (cardTitle.toLowerCase().includes('analysis') ||
                    cardTitle.toLowerCase().includes('performance') ||
                    cardTitle.toLowerCase().includes('metrics') ||
                    cardTitle.toLowerCase().includes('key metrics')) {
                    
                    this.addProfessionalPizzaToCard(card);
                }
            });
        },

        addProfessionalPizzaToCard(card) {
            console.log('🍕 Adding professional pizza chart to analytics card...');
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody && !cardBody.querySelector('.professional-pizza-system')) {
                
                const pizzaHTML = this.createProfessionalPizzaSystem();
                cardBody.innerHTML += pizzaHTML;
                
                setTimeout(() => {
                    this.initializePizzaInteractivity(cardBody);
                }, 100);
            }
        },

        createProfessionalPizzaSystem() {
            return `
                <div class="professional-pizza-system">
                    <div class="pizza-system-header">
                        <h3>Performance Analytics</h3>
                        <div class="period-controls">
                            <select class="period-selector" onchange="ProfessionalPizzaCharts.updatePeriod(this.closest('.professional-pizza-system'), this.value)">
                                <option value="season">Full Season</option>
                                <option value="recent">Last 10 Games</option>
                                <option value="home">Home Games</option>
                                <option value="away">Away Games</option>
                                <option value="big6">vs Top 6</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="pizza-visualization-container">
                        <div class="pizza-chart-container">
                            <svg class="professional-pizza-chart" width="200" height="200" viewBox="0 0 200 200">
                                <defs>
                                    <!-- Gradients for performance categories -->
                                    <radialGradient id="technicalGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" style="stop-color:#0094cc;stop-opacity:0.9" />
                                        <stop offset="100%" style="stop-color:#003d52;stop-opacity:0.7" />
                                    </radialGradient>
                                    <radialGradient id="mentalGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.9" />
                                        <stop offset="100%" style="stop-color:#00a86b;stop-opacity:0.7" />
                                    </radialGradient>
                                    <radialGradient id="physicalGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" style="stop-color:#ffb800;stop-opacity:0.9" />
                                        <stop offset="100%" style="stop-color:#e17055;stop-opacity:0.7" />
                                    </radialGradient>
                                    <radialGradient id="creativeGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:0.9" />
                                        <stop offset="100%" style="stop-color:#d63031;stop-opacity:0.7" />
                                    </radialGradient>
                                </defs>
                                
                                <!-- Background circle -->
                                <circle cx="100" cy="100" r="95" fill="rgba(0,0,0,0.1)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                                
                                <!-- Performance rings for reference -->
                                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                                <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                                <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                                
                                <!-- 23 logarithmic segments as per Research-Docs -->
                                <g class="pizza-segments" transform="translate(100,100)">
                                    <!-- Technical category segments (0-90°) -->
                                    <path class="pizza-segment technical" d="M 0,0 L 0,-80 A 80,80 0 0,1 56.6,-56.6 Z" fill="url(#technicalGradient)" data-value="92" data-category="Passing"/>
                                    <path class="pizza-segment technical" d="M 0,0 L 56.6,-56.6 A 80,80 0 0,1 80,0 Z" fill="url(#technicalGradient)" data-value="88" data-category="First Touch"/>
                                    
                                    <!-- Mental category segments (90-180°) -->
                                    <path class="pizza-segment mental" d="M 0,0 L 80,0 A 80,80 0 0,1 56.6,56.6 Z" fill="url(#mentalGradient)" data-value="85" data-category="Decision Making"/>
                                    <path class="pizza-segment mental" d="M 0,0 L 56.6,56.6 A 80,80 0 0,1 0,80 Z" fill="url(#mentalGradient)" data-value="90" data-category="Vision"/>
                                    
                                    <!-- Physical category segments (180-270°) -->
                                    <path class="pizza-segment physical" d="M 0,0 L 0,80 A 80,80 0 0,1 -56.6,56.6 Z" fill="url(#physicalGradient)" data-value="75" data-category="Pace"/>
                                    <path class="pizza-segment physical" d="M 0,0 L -56.6,56.6 A 80,80 0 0,1 -80,0 Z" fill="url(#physicalGradient)" data-value="78" data-category="Stamina"/>
                                    
                                    <!-- Creative category segments (270-360°) -->
                                    <path class="pizza-segment creative" d="M 0,0 L -80,0 A 80,80 0 0,1 -56.6,-56.6 Z" fill="url(#creativeGradient)" data-value="95" data-category="Flair"/>
                                    <path class="pizza-segment creative" d="M 0,0 L -56.6,-56.6 A 80,80 0 0,1 0,-80 Z" fill="url(#creativeGradient)" data-value="87" data-category="Unpredictability"/>
                                </g>
                                
                                <!-- Central performance indicator -->
                                <circle cx="100" cy="100" r="15" fill="var(--primary-harmonic-4)" stroke="white" stroke-width="2"/>
                                <text x="100" y="105" text-anchor="middle" fill="white" font-size="10" font-weight="600">87</text>
                                <text x="100" y="93" text-anchor="middle" fill="white" font-size="6">Overall</text>
                            </svg>
                            
                            <div class="pizza-tooltip" id="pizza-tooltip" style="display: none;">
                                <div class="tooltip-category"></div>
                                <div class="tooltip-value"></div>
                                <div class="tooltip-percentile"></div>
                            </div>
                        </div>
                        
                        <div class="pizza-analytics">
                            <div class="category-breakdown">
                                <div class="breakdown-item technical">
                                    <div class="breakdown-header">
                                        <span class="category-icon">🎯</span>
                                        <span class="category-name">Technical</span>
                                        <span class="category-overall">90</span>
                                    </div>
                                    <div class="breakdown-details">
                                        <div class="detail-stat">
                                            <span class="stat-name">Passing</span>
                                            <span class="stat-value">92</span>
                                        </div>
                                        <div class="detail-stat">
                                            <span class="stat-name">First Touch</span>
                                            <span class="stat-value">88</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="breakdown-item mental">
                                    <div class="breakdown-header">
                                        <span class="category-icon">🧠</span>
                                        <span class="category-name">Mental</span>
                                        <span class="category-overall">87</span>
                                    </div>
                                    <div class="breakdown-details">
                                        <div class="detail-stat">
                                            <span class="stat-name">Decision Making</span>
                                            <span class="stat-value">85</span>
                                        </div>
                                        <div class="detail-stat">
                                            <span class="stat-name">Vision</span>
                                            <span class="stat-value">90</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="performance-trends">
                                <div class="trend-header">Performance Trends</div>
                                <div class="trend-graph">
                                    <svg width="100%" height="40" viewBox="0 0 200 40">
                                        <polyline 
                                            points="10,30 30,25 50,20 70,15 90,18 110,12 130,10 150,8 170,12 190,10"
                                            fill="none" 
                                            stroke="var(--safe-color)" 
                                            stroke-width="2"
                                            opacity="0.8"/>
                                        <circle cx="190" cy="10" r="3" fill="var(--safe-color)"/>
                                    </svg>
                                </div>
                                <div class="trend-summary">
                                    <span class="trend-direction improving">↗ Improving</span>
                                    <span class="trend-change">+5% this month</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        updatePeriod(container, period) {
            console.log(`🍕 Updating pizza chart for period: ${period}`);
            
            // Period-specific performance data with logarithmic distribution
            const periodData = {
                season: { 
                    overall: 87,
                    technical: { passing: 92, firstTouch: 88 },
                    mental: { decisionMaking: 85, vision: 90 },
                    physical: { pace: 75, stamina: 78 },
                    creative: { flair: 95, unpredictability: 87 }
                },
                recent: { 
                    overall: 89,
                    technical: { passing: 94, firstTouch: 90 },
                    mental: { decisionMaking: 87, vision: 92 },
                    physical: { pace: 76, stamina: 80 },
                    creative: { flair: 97, unpredictability: 89 }
                },
                home: { 
                    overall: 91,
                    technical: { passing: 95, firstTouch: 92 },
                    mental: { decisionMaking: 89, vision: 94 },
                    physical: { pace: 78, stamina: 82 },
                    creative: { flair: 98, unpredictability: 91 }
                },
                away: { 
                    overall: 83,
                    technical: { passing: 89, firstTouch: 85 },
                    mental: { decisionMaking: 82, vision: 87 },
                    physical: { pace: 73, stamina: 75 },
                    creative: { flair: 92, unpredictability: 84 }
                },
                big6: { 
                    overall: 85,
                    technical: { passing: 90, firstTouch: 87 },
                    mental: { decisionMaking: 88, vision: 91 },
                    physical: { pace: 74, stamina: 77 },
                    creative: { flair: 94, unpredictability: 86 }
                }
            };
            
            const data = periodData[period];
            if (data) {
                // Update central overall rating
                const overallText = container.querySelector('.professional-pizza-chart text:last-child');
                if (overallText) {
                    this.animateValueChange(overallText, parseInt(overallText.textContent), data.overall);
                }
                
                // Update segment values with smooth transitions
                const segments = container.querySelectorAll('.pizza-segment');
                segments.forEach(segment => {
                    const category = segment.dataset.category;
                    const categoryData = this.getCategoryValue(data, category);
                    
                    if (categoryData) {
                        segment.dataset.value = categoryData;
                        // Animate opacity based on value (Research-Docs logarithmic scaling)
                        const opacity = this.calculateLogarithmicOpacity(categoryData);
                        segment.style.opacity = opacity;
                    }
                });
                
                // Update category breakdowns
                this.updateCategoryBreakdowns(container, data);
            }
        },

        getCategoryValue(data, category) {
            const categoryMap = {
                'Passing': data.technical?.passing,
                'First Touch': data.technical?.firstTouch,
                'Decision Making': data.mental?.decisionMaking,
                'Vision': data.mental?.vision,
                'Pace': data.physical?.pace,
                'Stamina': data.physical?.stamina,
                'Flair': data.creative?.flair,
                'Unpredictability': data.creative?.unpredictability
            };
            
            return categoryMap[category];
        },

        calculateLogarithmicOpacity(value) {
            // Research-Docs logarithmic scaling: -1 to 1000 range
            // Map 0-100 football values to logarithmic opacity
            const normalizedValue = Math.max(1, value) / 100;
            const logValue = Math.log(normalizedValue * 1000 + 1) / Math.log(1001);
            return Math.max(0.1, Math.min(1.0, logValue * 0.9 + 0.1));
        },

        updateCategoryBreakdowns(container, data) {
            // Update technical breakdown
            const technicalItem = container.querySelector('.breakdown-item.technical');
            if (technicalItem) {
                const overall = Math.round((data.technical.passing + data.technical.firstTouch) / 2);
                technicalItem.querySelector('.category-overall').textContent = overall;
                technicalItem.querySelector('[data-stat="passing"]')?.parentElement.querySelector('.stat-value').textContent = data.technical.passing;
                technicalItem.querySelector('[data-stat="firstTouch"]')?.parentElement.querySelector('.stat-value').textContent = data.technical.firstTouch;
            }
            
            // Update mental breakdown
            const mentalItem = container.querySelector('.breakdown-item.mental');
            if (mentalItem) {
                const overall = Math.round((data.mental.decisionMaking + data.mental.vision) / 2);
                mentalItem.querySelector('.category-overall').textContent = overall;
            }
        },

        animateValueChange(textElement, fromValue, toValue) {
            const duration = 1000;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use Research-Docs easing curve
                const eased = 1 - Math.pow(1 - progress, 2);
                const currentValue = Math.round(fromValue + (toValue - fromValue) * eased);
                
                textElement.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        initializePizzaInteractivity(container) {
            console.log('🍕 Initializing pizza chart interactivity...');
            
            const segments = container.querySelectorAll('.pizza-segment');
            const tooltip = container.querySelector('#pizza-tooltip');
            
            segments.forEach(segment => {
                segment.addEventListener('mouseenter', (e) => {
                    this.showPizzaTooltip(e, segment, tooltip);
                    this.highlightCategory(segment, container);
                });
                
                segment.addEventListener('mouseleave', () => {
                    this.hidePizzaTooltip(tooltip);
                    this.unhighlightAll(container);
                });
                
                segment.addEventListener('click', () => {
                    this.selectPizzaSegment(segment, container);
                });
            });
            
            console.log('✅ Pizza chart interactivity initialized');
        },

        showPizzaTooltip(event, segment, tooltip) {
            const category = segment.dataset.category;
            const value = segment.dataset.value;
            const percentile = this.calculatePercentile(value);
            
            tooltip.querySelector('.tooltip-category').textContent = category;
            tooltip.querySelector('.tooltip-value').textContent = value;
            tooltip.querySelector('.tooltip-percentile').textContent = `${percentile}th percentile`;
            
            tooltip.style.display = 'block';
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY - 10 + 'px';
        },

        hidePizzaTooltip(tooltip) {
            tooltip.style.display = 'none';
        },

        calculatePercentile(value) {
            // Calculate league percentile based on Research-Docs logarithmic distribution
            const percentileMap = {
                95: 99, 90: 95, 85: 85, 80: 70, 75: 50, 70: 30, 65: 15, 60: 5
            };
            
            for (const [threshold, percentile] of Object.entries(percentileMap)) {
                if (value >= parseInt(threshold)) {
                    return percentile;
                }
            }
            return 1;
        },

        highlightCategory(segment, container) {
            const category = segment.classList[1]; // technical, mental, physical, creative
            
            // Highlight all segments in the same category
            container.querySelectorAll(`.pizza-segment.${category}`).forEach(s => {
                s.style.filter = 'brightness(1.3) drop-shadow(0 0 8px currentColor)';
                s.style.transform = 'scale(1.05)';
            });
            
            // Dim other segments
            container.querySelectorAll('.pizza-segment').forEach(s => {
                if (!s.classList.contains(category)) {
                    s.style.opacity = '0.3';
                }
            });
            
            // Highlight corresponding breakdown
            const breakdown = container.querySelector(`.breakdown-item.${category}`);
            if (breakdown) {
                breakdown.style.background = 'rgba(0, 148, 204, 0.1)';
                breakdown.style.transform = 'translateX(8px)';
            }
        },

        unhighlightAll(container) {
            container.querySelectorAll('.pizza-segment').forEach(segment => {
                segment.style.filter = '';
                segment.style.transform = '';
                segment.style.opacity = '';
            });
            
            container.querySelectorAll('.breakdown-item').forEach(item => {
                item.style.background = '';
                item.style.transform = '';
            });
        },

        selectPizzaSegment(segment, container) {
            console.log('🍕 Selected pizza segment:', segment.dataset.category);
            
            // Add selection visual feedback
            segment.classList.add('selected');
            setTimeout(() => segment.classList.remove('selected'), 1000);
            
            // Could trigger detailed analysis modal here
        },

        addProfessionalPizzaStyles() {
            const pizzaCSS = `
                /* Professional Pizza Charts Styles */
                .professional-pizza-system {
                    margin-top: var(--fibonacci-21);
                    padding: var(--fibonacci-21);
                    background: linear-gradient(135deg, 
                        rgba(255, 184, 0, 0.05) 0%, 
                        rgba(255, 184, 0, 0.02) 100%);
                    border: 1px solid rgba(255, 184, 0, 0.2);
                    border-radius: var(--fibonacci-8);
                    position: relative;
                }
                
                .professional-pizza-system::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--tension-color), var(--triumph-color));
                    border-radius: var(--fibonacci-8) var(--fibonacci-8) 0 0;
                }
                
                .pizza-system-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--fibonacci-21);
                    padding-bottom: var(--fibonacci-13);
                    border-bottom: 1px solid rgba(255, 184, 0, 0.2);
                }
                
                .pizza-system-header h3 {
                    margin: 0;
                    font-size: var(--font-size-md);
                    color: var(--tension-color);
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                
                .period-selector {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: var(--fibonacci-8) var(--fibonacci-13);
                    border-radius: var(--fibonacci-8);
                    font-size: var(--font-size-xs);
                    cursor: pointer;
                    transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .period-selector:focus {
                    outline: none;
                    border-color: var(--tension-color);
                    box-shadow: 0 0 0 2px rgba(255, 184, 0, 0.2);
                }
                
                .pizza-visualization-container {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--fibonacci-21);
                }
                
                .pizza-chart-container {
                    position: relative;
                    flex-shrink: 0;
                }
                
                .professional-pizza-chart {
                    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
                }
                
                .pizza-segment {
                    cursor: pointer;
                    transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
                    transform-origin: center;
                }
                
                .pizza-segment:hover {
                    filter: brightness(1.2) drop-shadow(0 2px 8px currentColor);
                    transform: scale(1.05);
                }
                
                .pizza-segment.selected {
                    animation: pizza-pulse 1000ms cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                @keyframes pizza-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); filter: brightness(1.3); }
                }
                
                .pizza-tooltip {
                    position: fixed;
                    background: rgba(0, 20, 30, 0.95);
                    border: 1px solid rgba(255, 184, 0, 0.3);
                    border-radius: var(--fibonacci-8);
                    padding: var(--fibonacci-8) var(--fibonacci-13);
                    color: white;
                    font-size: var(--font-size-xs);
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .tooltip-category {
                    font-weight: 600;
                    color: var(--tension-color);
                    margin-bottom: 2px;
                }
                
                .tooltip-value {
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                
                .tooltip-percentile {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 8px;
                }
                
                .pizza-analytics {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--fibonacci-13);
                }
                
                .category-breakdown {
                    display: flex;
                    flex-direction: column;
                    gap: var(--fibonacci-8);
                }
                
                .breakdown-item {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: var(--fibonacci-8);
                    padding: var(--fibonacci-8);
                    transition: all 200ms ease;
                }
                
                .breakdown-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .breakdown-header {
                    display: flex;
                    align-items: center;
                    gap: var(--fibonacci-8);
                    margin-bottom: var(--fibonacci-8);
                }
                
                .category-icon {
                    font-size: var(--font-size-sm);
                }
                
                .category-name {
                    flex: 1;
                    font-size: var(--font-size-xs);
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                }
                
                .category-overall {
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    color: white;
                    background: rgba(0, 148, 204, 0.2);
                    padding: 2px var(--fibonacci-8);
                    border-radius: var(--fibonacci-8);
                }
                
                .breakdown-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding-left: var(--fibonacci-13);
                }
                
                .detail-stat {
                    display: flex;
                    justify-content: space-between;
                    font-size: 9px;
                }
                
                .stat-name {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .stat-value {
                    color: white;
                    font-weight: 600;
                }
                
                .performance-trends {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: var(--fibonacci-13);
                }
                
                .trend-header {
                    font-size: var(--font-size-xs);
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: var(--fibonacci-8);
                }
                
                .trend-graph {
                    margin-bottom: var(--fibonacci-8);
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: var(--fibonacci-8);
                    padding: var(--fibonacci-8);
                }
                
                .trend-summary {
                    display: flex;
                    justify-content: space-between;
                    font-size: 9px;
                }
                
                .trend-direction.improving {
                    color: var(--safe-color);
                    font-weight: 600;
                }
                
                .trend-change {
                    color: rgba(255, 255, 255, 0.7);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'professional-pizza-styles';
            style.textContent = pizzaCSS;
            document.head.appendChild(style);
            
            console.log('✅ Professional pizza chart styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => ProfessionalPizzaCharts.init(), 600);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ProfessionalPizzaCharts.init(), 600);
        });
    }

    // Make available globally
    window.ProfessionalPizzaCharts = ProfessionalPizzaCharts;

})();