/**
 * CLEAN OVERVIEW IMPLEMENTATION
 * Following Research-Docs UX principles: cognitive load management, progressive disclosure
 * Think Hard about information density and user attention management
 */

(function() {
    'use strict';

    console.log('📊 CLEAN OVERVIEW: Think Hard about implementing Overview with proper UX principles...');

    const CleanOverview = {
        initialized: false,
        
        // UX Principles from Research-Docs
        maxComponentsPerSubscreen: 4,
        cognitiveLoadTarget: 4, // Out of 10 
        attentionDistribution: {
            primary: 0.40,   // Next Match gets primary focus
            secondary: 0.60  // Other 3 components share secondary focus
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('📊 CLEAN OVERVIEW: Implementing clean, focused Overview screen...');
            
            // Forest of Thoughts analysis for Overview content
            this.analyzeOverviewRequirements();
            
            // Clear any existing overload
            this.clearInformationOverload();
            
            // Implement clean Dashboard subscreen only
            this.implementDashboardSubscreen();
            
            // Setup subscreen navigation
            this.setupCleanNavigation();
            
            // Validate implementation
            this.validateUXPrinciples();
            
            this.initialized = true;
            console.log('✅ CLEAN OVERVIEW: Clean implementation complete');
        },
        
        analyzeOverviewRequirements() {
            console.log('🌳 Forest of Thoughts: Analyzing Overview requirements...');
            
            // Decision Tree 1: What does a manager need to see immediately on Overview?
            console.log('🌳 Tree 1: Critical information for quick decision making');
            // Answer: Next match (most urgent), league position (context), squad status (readiness), recent form (confidence)
            
            // Decision Tree 2: How much cognitive load can we use?
            console.log('🌳 Tree 2: Cognitive load distribution');
            // Answer: Target 4/10 total, 1 point per component, 4 components max
            
            // Decision Tree 3: How to organize attention hierarchy?
            console.log('🌳 Tree 3: Attention distribution planning');
            // Answer: Next Match gets 40% attention (larger), other 3 get 20% each
            
            // Decision Tree 4: What about other information (tactics, finances, etc.)?
            console.log('🌳 Tree 4: Information categorization');
            // Answer: Belongs in dedicated screens, not Overview. Overview = quick scan only
            
            console.log('✅ Forest of Thoughts analysis complete - clean 4-component Overview');
        },
        
        clearInformationOverload() {
            console.log('🧹 Clearing information overload from Overview...');
            
            // Override the original card loading functions to prevent overload
            if (window.loadPageCards) {
                const originalLoadPageCards = window.loadPageCards;
                window.loadPageCards = function(pageName) {
                    if (pageName === 'overview') {
                        console.log('🚫 Blocking original overview cards to prevent overload');
                        return; // Block original overview loading
                    }
                    return originalLoadPageCards.call(this, pageName);
                };
            }
            
            // Clear any existing cards
            const overviewContainer = document.querySelector('#overview-grid-view .tile-container');
            if (overviewContainer) {
                overviewContainer.innerHTML = '';
                console.log('🗑️ Overview container cleared');
            }
            
            // Also clear the overview page generation functions
            if (window.getCardsForPage) {
                const originalGetCards = window.getCardsForPage;
                window.getCardsForPage = function(pageName) {
                    if (pageName === 'overview') {
                        console.log('🚫 Blocking original overview card generation');
                        return []; // Return empty array for overview
                    }
                    return originalGetCards.call(this, pageName);
                };
            }
            
            console.log('✅ Information overload prevention implemented');
        },
        
        implementDashboardSubscreen() {
            console.log('📋 Implementing Dashboard subscreen: 4 components, cognitive load 4/10...');
            
            const dashboardComponents = [
                {
                    title: 'Next Match',
                    size: 'w10 h5', // Primary focus - larger size
                    cognitiveLoad: 1,
                    content: this.createFocusedNextMatchContent()
                },
                {
                    title: 'League Position',
                    size: 'w6 h3', // Secondary focus
                    cognitiveLoad: 1,
                    content: this.createFocusedLeagueContent()
                },
                {
                    title: 'Squad Status',
                    size: 'w6 h3', // Secondary focus
                    cognitiveLoad: 1,
                    content: this.createFocusedSquadContent()
                },
                {
                    title: 'Recent Form',
                    size: 'w8 h3', // Secondary focus
                    cognitiveLoad: 1,
                    content: this.createFocusedFormContent()
                }
            ];
            
            // Validate before implementation
            const totalComponents = dashboardComponents.length;
            const totalCognitiveLoad = dashboardComponents.reduce((sum, comp) => sum + comp.cognitiveLoad, 0);
            
            if (totalComponents > this.maxComponentsPerSubscreen) {
                console.error(`❌ Too many components: ${totalComponents} > ${this.maxComponentsPerSubscreen}`);
                return;
            }
            
            if (totalCognitiveLoad > this.cognitiveLoadTarget) {
                console.error(`❌ Cognitive load too high: ${totalCognitiveLoad} > ${this.cognitiveLoadTarget}`);
                return;
            }
            
            console.log(`✅ Component validation passed: ${totalComponents} components, ${totalCognitiveLoad}/10 cognitive load`);
            
            // Implement the clean components
            this.renderCleanComponents(dashboardComponents);
        },
        
        createFocusedNextMatchContent() {
            // Simple, focused content - no information overload
            return `
                <div class="focused-next-match">
                    <div class="match-primary">
                        <div class="opponent">Liverpool (A)</div>
                        <div class="timing">Sunday, 15:00</div>
                        <div class="competition">Premier League</div>
                    </div>
                    
                    <div class="match-context">
                        <div class="context-item">
                            <span class="label">Their Form</span>
                            <span class="value">W-D-W-L-W</span>
                        </div>
                        <div class="context-item">
                            <span class="label">Last Meeting</span>
                            <span class="value">L 0-2</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createFocusedLeagueContent() {
            // Minimal league information - just essentials
            return `
                <div class="focused-league">
                    <div class="position-main">
                        <div class="rank">4th</div>
                        <div class="points">17 pts</div>
                    </div>
                    
                    <div class="position-context">
                        <div class="gap">+1 from 5th</div>
                        <div class="target">3 pts to 3rd</div>
                    </div>
                </div>
            `;
        },
        
        createFocusedSquadContent() {
            // Essential squad info only
            return `
                <div class="focused-squad">
                    <div class="squad-status excellent">
                        <div class="status-icon">😊</div>
                        <div class="status-text">Excellent</div>
                    </div>
                    
                    <div class="squad-metrics">
                        <div class="metric">
                            <span class="label">Available</span>
                            <span class="value">25</span>
                        </div>
                        <div class="metric">
                            <span class="label">Injured</span>
                            <span class="value warning">2</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createFocusedFormContent() {
            // Simple form visualization
            return `
                <div class="focused-form">
                    <div class="form-display">
                        <div class="result-badge win">W</div>
                        <div class="result-badge win">W</div>
                        <div class="result-badge draw">D</div>
                        <div class="result-badge loss">L</div>
                        <div class="result-badge win">W</div>
                    </div>
                    
                    <div class="form-summary">
                        <span class="summary-text">10/15 points</span>
                        <span class="trend-indicator positive">↗️</span>
                    </div>
                </div>
            `;
        },
        
        renderCleanComponents(components) {
            console.log(`🎨 Rendering ${components.length} clean, focused components...`);
            
            const container = document.querySelector('#overview-grid-view .tile-container');
            if (!container) return;
            
            components.forEach((component, index) => {
                const card = document.createElement('div');
                card.className = `card ${component.size} clean-overview`;
                
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3);
                card.setAttribute('data-grid-w', width);
                card.setAttribute('data-grid-h', height);
                card.draggable = false;
                
                card.innerHTML = `
                    <div class="card-header clean-header">
                        <span>${component.title}</span>
                    </div>
                    <div class="card-body clean-body">
                        ${component.content}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `;
                
                container.appendChild(card);
                console.log(`✅ Clean component rendered: ${component.title} (${component.size}, cognitive load: ${component.cognitiveLoad})`);
            });
            
            // Layout the cards properly
            if (window.layoutCards) {
                setTimeout(() => {
                    window.layoutCards(container);
                }, 100);
            }
        },
        
        setupCleanNavigation() {
            console.log('🧭 Setting up clean subscreen navigation...');
            
            // Keep submenu simple - just Dashboard for now
            const overviewSubmenu = document.getElementById('overview-submenu');
            if (overviewSubmenu) {
                const submenuContent = overviewSubmenu.querySelector('.submenu-content');
                if (submenuContent) {
                    submenuContent.innerHTML = `
                        <span class="submenu-item active">Dashboard</span>
                        <span class="submenu-item disabled">Performance</span>
                        <span class="submenu-item disabled">News</span>
                    `;
                }
            }
            
            console.log('✅ Clean navigation setup - Dashboard only (others disabled until validated)');
        },
        
        validateUXPrinciples() {
            console.log('🧪 Validating against Research-Docs UX principles...');
            
            const overviewCards = document.querySelectorAll('#overview-page .card.clean-overview');
            const componentCount = overviewCards.length;
            
            // Test 1: Component count
            if (componentCount > this.maxComponentsPerSubscreen) {
                console.error(`❌ UX VIOLATION: ${componentCount} components > ${this.maxComponentsPerSubscreen} max`);
                return false;
            }
            
            // Test 2: Visual hierarchy
            const primaryComponents = document.querySelectorAll('.card.w10, .card.w12').length;
            const secondaryComponents = document.querySelectorAll('.card.w6, .card.w8').length;
            
            if (primaryComponents > 2) {
                console.error(`❌ UX VIOLATION: Too many primary components: ${primaryComponents}`);
                return false;
            }
            
            // Test 3: Information density per card
            let informationOverload = false;
            overviewCards.forEach(card => {
                const infoElements = card.querySelectorAll('.stat-row, .metric, .context-item, .result-badge').length;
                if (infoElements > 6) {
                    console.error(`❌ UX VIOLATION: Card has ${infoElements} info elements (too many)`);
                    informationOverload = true;
                }
            });
            
            if (informationOverload) return false;
            
            // Test 4: Visual quality check
            const hasCleanStyling = document.getElementById('clean-overview-styles') !== null;
            if (!hasCleanStyling) {
                this.addCleanStyling();
            }
            
            console.log(`✅ UX VALIDATION PASSED: ${componentCount} components, clean hierarchy, appropriate density`);
            return true;
        },
        
        addCleanStyling() {
            const cleanStyles = `
                /* Clean Overview Styling - Following UX Principles */
                .clean-overview {
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
                }
                
                .clean-overview:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }
                
                .clean-header {
                    background: linear-gradient(135deg, rgba(0, 148, 204, 0.1), rgba(0, 148, 204, 0.05));
                    border-bottom: 1px solid rgba(0, 148, 204, 0.2);
                    padding: 8px 12px;
                    font-size: 11px;
                    font-weight: 600;
                }
                
                .clean-body {
                    padding: 12px;
                }
                
                /* Next Match Styling */
                .focused-next-match {
                    text-align: center;
                }
                
                .match-primary {
                    margin-bottom: 12px;
                }
                
                .opponent {
                    font-size: 16px;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 4px;
                }
                
                .timing {
                    font-size: 12px;
                    color: #0094cc;
                    margin-bottom: 2px;
                }
                
                .competition {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .match-context {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    font-size: 10px;
                }
                
                .context-item {
                    text-align: center;
                }
                
                .context-item .label {
                    display: block;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 2px;
                }
                
                .context-item .value {
                    color: white;
                    font-weight: 600;
                }
                
                /* League Position Styling */
                .focused-league {
                    text-align: center;
                }
                
                .position-main {
                    margin-bottom: 8px;
                }
                
                .rank {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0094cc;
                    line-height: 1;
                }
                
                .points {
                    font-size: 12px;
                    color: white;
                    font-weight: 600;
                }
                
                .position-context {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .gap, .target {
                    display: block;
                    margin: 2px 0;
                }
                
                /* Squad Status Styling */
                .focused-squad {
                    text-align: center;
                }
                
                .squad-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    margin-bottom: 12px;
                    padding: 8px;
                    border-radius: 6px;
                }
                
                .squad-status.excellent {
                    background: rgba(0, 255, 136, 0.1);
                    color: #00ff88;
                }
                
                .squad-metrics {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    font-size: 10px;
                }
                
                .metric {
                    text-align: center;
                }
                
                .metric .label {
                    display: block;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 2px;
                }
                
                .metric .value {
                    color: white;
                    font-weight: 600;
                    font-size: 12px;
                }
                
                .metric .value.warning {
                    color: #ffb800;
                }
                
                /* Form Styling */
                .focused-form {
                    text-align: center;
                }
                
                .form-display {
                    display: flex;
                    justify-content: center;
                    gap: 4px;
                    margin-bottom: 12px;
                }
                
                .result-badge {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 9px;
                    font-weight: 600;
                }
                
                .result-badge.win {
                    background: #00ff88;
                    color: #000;
                }
                
                .result-badge.draw {
                    background: #ffb800;
                    color: #000;
                }
                
                .result-badge.loss {
                    background: #ff4757;
                    color: white;
                }
                
                .form-summary {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 11px;
                }
                
                .summary-text {
                    color: white;
                    font-weight: 600;
                }
                
                .trend-indicator.positive {
                    color: #00ff88;
                }
                
                /* Responsive behavior */
                @media (max-width: 1200px) {
                    .clean-overview {
                        margin: 2px;
                    }
                    
                    .clean-body {
                        padding: 8px;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'clean-overview-styles';
            style.textContent = cleanStyles;
            document.head.appendChild(style);
            
            console.log('✅ Clean styling applied');
        }
    };

    // Initialize immediately to intercept original card loading
    CleanOverview.init();

    // Make available for testing
    window.CleanOverview = CleanOverview;

})();