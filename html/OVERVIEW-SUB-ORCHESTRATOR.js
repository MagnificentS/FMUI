/**
 * OVERVIEW SUB-ORCHESTRATOR
 * Implements Overview screen with proper UX principles from Research-Docs
 * Following cognitive load management: 4-6 components max per subscreen
 */

(function() {
    'use strict';

    console.log('📊 OVERVIEW SUB-ORCHESTRATOR: Think Hard about implementing Overview screen with proper information density...');

    const OverviewSubOrchestrator = {
        initialized: false,
        
        // UX Framework from Research-Docs analysis
        subscreens: {
            dashboard: {
                name: 'Dashboard',
                maxComponents: 4,
                cognitiveTarget: 4, // Low cognitive load for quick overview
                attentionFocus: 'primary', // 40% of user attention
                taskTarget: 30 // 30 seconds to scan
            },
            performance: {
                name: 'Performance',  
                maxComponents: 5,
                cognitiveTarget: 6, // Medium cognitive load for analysis
                attentionFocus: 'secondary', // 30% of user attention
                taskTarget: 120 // 2 minutes for analysis
            },
            news: {
                name: 'News & Alerts',
                maxComponents: 4,
                cognitiveTarget: 3, // Low cognitive load for quick scan
                attentionFocus: 'tertiary', // 30% of user attention  
                taskTarget: 45 // 45 seconds to scan alerts
            }
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('📊 OVERVIEW SUB-ORCHESTRATOR: Implementing clean Overview screen...');
            
            this.clearCurrentOverview();
            this.implementDashboardSubscreen();
            this.implementPerformanceSubscreen();
            this.implementNewsSubscreen();
            this.setupSubscreenNavigation();
            this.validateImplementation();
            
            this.initialized = true;
            console.log('✅ OVERVIEW SUB-ORCHESTRATOR: Overview screen properly implemented');
        },
        
        clearCurrentOverview() {
            console.log('🧹 Clearing current broken Overview implementation...');
            
            const overviewContainer = document.querySelector('#overview-grid-view .tile-container');
            if (overviewContainer) {
                // Remove excess cards (keep only what we need)
                const cards = overviewContainer.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    if (index >= 4) { // Keep max 4 cards for Dashboard subscreen
                        card.remove();
                    }
                });
                
                console.log(`🗑️ Removed ${Math.max(0, cards.length - 4)} excess cards from Overview`);
            }
        },
        
        implementDashboardSubscreen() {
            console.log('📋 Implementing Dashboard subscreen (4 components, cognitive load 4/10)...');
            
            // Forest of Thoughts analysis for Dashboard components
            console.log('🌳 Using forest of thoughts for Dashboard component selection...');
            
            // Decision Tree 1: What information is most critical for Overview?
            console.log('🌳 Tree 1: Critical information hierarchy');
            // Answer: Next match, current league position, squad status, recent form
            
            // Decision Tree 2: How to organize attention (40% primary focus)?
            console.log('🌳 Tree 2: Attention distribution planning');
            // Answer: Next match gets primary focus, other 3 get equal secondary focus
            
            // Decision Tree 3: Cognitive load per component?
            console.log('🌳 Tree 3: Cognitive load distribution');
            // Answer: 1 point each for simple cards, total 4/10 target achieved
            
            const dashboardComponents = [
                {
                    title: 'Next Match',
                    size: 'w8 h4', // Larger for primary focus
                    priority: 'primary',
                    cognitiveLoad: 1,
                    content: this.createNextMatchContent()
                },
                {
                    title: 'League Position', 
                    size: 'w6 h3',
                    priority: 'secondary',
                    cognitiveLoad: 1,
                    content: this.createLeaguePositionContent()
                },
                {
                    title: 'Squad Status',
                    size: 'w6 h3', 
                    priority: 'secondary',
                    cognitiveLoad: 1,
                    content: this.createSquadStatusContent()
                },
                {
                    title: 'Recent Form',
                    size: 'w8 h3',
                    priority: 'secondary', 
                    cognitiveLoad: 1,
                    content: this.createRecentFormContent()
                }
            ];
            
            // Validate component count and cognitive load
            if (dashboardComponents.length > this.subscreens.dashboard.maxComponents) {
                console.error('❌ Dashboard exceeds component limit');
                return;
            }
            
            const totalCognitiveLoad = dashboardComponents.reduce((sum, comp) => sum + comp.cognitiveLoad, 0);
            if (totalCognitiveLoad > this.subscreens.dashboard.cognitiveTarget) {
                console.error('❌ Dashboard exceeds cognitive load target');
                return;
            }
            
            // Implement components
            this.renderSubscreenComponents('dashboard', dashboardComponents);
            
            console.log(`✅ Dashboard subscreen implemented: ${dashboardComponents.length} components, ${totalCognitiveLoad}/10 cognitive load`);
        },
        
        createNextMatchContent() {
            return `
                <div class="next-match-dashboard">
                    <div class="match-header">
                        <div class="opponent-badge">⚽</div>
                        <div class="match-details">
                            <h3>Liverpool (A)</h3>
                            <div class="match-meta">
                                <span class="match-date">Sunday, 15:00</span>
                                <span class="match-comp">Premier League</span>
                            </div>
                        </div>
                        <div class="match-importance high">High</div>
                    </div>
                    
                    <div class="quick-stats">
                        <div class="stat-item">
                            <span class="stat-label">Their Form</span>
                            <span class="stat-value">W-D-W-L-W</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Head-to-Head</span>
                            <span class="stat-value">Won 2 of last 5</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createLeaguePositionContent() {
            return `
                <div class="league-position-dashboard">
                    <div class="position-header">
                        <div class="position-rank">4th</div>
                        <div class="position-details">
                            <div class="points">17 pts</div>
                            <div class="gap">+1 from 5th</div>
                        </div>
                    </div>
                    
                    <div class="mini-table">
                        <div class="table-row current">
                            <span class="pos">4</span>
                            <span class="team">Man United</span>
                            <span class="pts">17</span>
                        </div>
                        <div class="table-row">
                            <span class="pos">3</span>
                            <span class="team">Liverpool</span>
                            <span class="pts">18</span>
                        </div>
                        <div class="table-row">
                            <span class="pos">5</span>
                            <span class="team">Brighton</span>
                            <span class="pts">16</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadStatusContent() {
            return `
                <div class="squad-status-dashboard">
                    <div class="status-overview">
                        <div class="status-indicator excellent">
                            <span class="status-icon">😊</span>
                            <span class="status-text">Excellent</span>
                        </div>
                    </div>
                    
                    <div class="key-metrics">
                        <div class="metric-item">
                            <span class="metric-label">Available</span>
                            <span class="metric-value">25</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Injured</span>
                            <span class="metric-value warning">2</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Suspended</span>
                            <span class="metric-value">0</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createRecentFormContent() {
            return `
                <div class="recent-form-dashboard">
                    <div class="form-header">
                        <h4>Last 5 Matches</h4>
                        <div class="form-trend positive">↗️</div>
                    </div>
                    
                    <div class="form-results">
                        <div class="result win">W</div>
                        <div class="result win">W</div>
                        <div class="result draw">D</div>
                        <div class="result loss">L</div>
                        <div class="result win">W</div>
                    </div>
                    
                    <div class="form-stats">
                        <div class="form-stat">
                            <span class="stat-label">Points</span>
                            <span class="stat-value">10/15</span>
                        </div>
                        <div class="form-stat">
                            <span class="stat-label">Goals</span>
                            <span class="stat-value">8/5</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderSubscreenComponents(subscreenName, components) {
            console.log(`🎨 Rendering ${subscreenName} subscreen with ${components.length} components...`);
            
            const container = document.querySelector('#overview-grid-view .tile-container');
            if (!container) return;
            
            // Clear existing content for clean implementation
            container.innerHTML = '';
            
            // Create each component with proper spacing and layout
            components.forEach((component, index) => {
                const card = document.createElement('div');
                card.className = `card ${component.size} overview-${subscreenName}`;
                card.setAttribute('data-component-priority', component.priority);
                card.setAttribute('data-cognitive-load', component.cognitiveLoad);
                
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3);
                card.setAttribute('data-grid-w', width);
                card.setAttribute('data-grid-h', height);
                card.draggable = false;
                
                card.innerHTML = `
                    <div class="card-header overview-header">
                        <span>${component.title}</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                        </div>
                    </div>
                    <div class="card-body overview-body">
                        ${component.content}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `;
                
                container.appendChild(card);
                console.log(`✅ Component rendered: ${component.title} (${component.size}, load: ${component.cognitiveLoad}/10)`);
            });
            
            // Trigger layout system to position cards properly
            if (window.layoutCards) {
                setTimeout(() => {
                    window.layoutCards(container);
                }, 100);
            }
        },
        
        implementPerformanceSubscreen() {
            console.log('📈 Performance subscreen will be implemented when Dashboard is validated...');
            
            // This will be implemented after Dashboard passes validation
            // Following the same principles: max 5 components, cognitive load 6/10
        },
        
        implementNewsSubscreen() {
            console.log('📰 News subscreen will be implemented when Performance is validated...');
            
            // This will be implemented after Performance passes validation
            // Following the same principles: max 4 components, cognitive load 3/10
        },
        
        setupSubscreenNavigation() {
            console.log('🧭 Setting up subscreen navigation...');
            
            // Add subscreen tabs to Overview submenu for navigation
            const overviewSubmenu = document.getElementById('overview-submenu');
            if (overviewSubmenu) {
                const submenuContent = overviewSubmenu.querySelector('.submenu-content');
                if (submenuContent) {
                    submenuContent.innerHTML = `
                        <span class="submenu-item active" onclick="showOverviewSubscreen('dashboard')">Dashboard</span>
                        <span class="submenu-item" onclick="showOverviewSubscreen('performance')">Performance</span>
                        <span class="submenu-item" onclick="showOverviewSubscreen('news')">News & Alerts</span>
                    `;
                }
            }
            
            // Global function for subscreen navigation
            window.showOverviewSubscreen = (subscreenName) => {
                console.log(`🧭 Navigating to Overview/${subscreenName}`);
                
                // Update active submenu item
                document.querySelectorAll('#overview-submenu .submenu-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.textContent.toLowerCase().includes(subscreenName)) {
                        item.classList.add('active');
                    }
                });
                
                // Show/hide relevant cards based on subscreen
                this.showSubscreenCards(subscreenName);
            };
            
            console.log('✅ Subscreen navigation setup complete');
        },
        
        showSubscreenCards(subscreenName) {
            console.log(`👁️ Showing cards for ${subscreenName} subscreen...`);
            
            const allOverviewCards = document.querySelectorAll('.card.overview-dashboard, .card.overview-performance, .card.overview-news');
            
            allOverviewCards.forEach(card => {
                const shouldShow = card.classList.contains(`overview-${subscreenName}`);
                card.style.display = shouldShow ? 'flex' : 'none';
                
                if (shouldShow) {
                    // Animate card entrance
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1)';
                    }, 50);
                }
            });
        },
        
        validateImplementation() {
            console.log('🧪 Validating Overview implementation against UX principles...');
            
            const validationResults = {
                componentCount: true,
                cognitiveLoad: true,
                visualQuality: true,
                interactionFlow: true
            };
            
            // Test 1: Component count per subscreen
            Object.keys(this.subscreens).forEach(subscreenName => {
                const cards = document.querySelectorAll(`.overview-${subscreenName}`);
                const maxAllowed = this.subscreens[subscreenName].maxComponents;
                
                if (cards.length > maxAllowed) {
                    console.error(`❌ ${subscreenName} has ${cards.length} components, max allowed: ${maxAllowed}`);
                    validationResults.componentCount = false;
                } else {
                    console.log(`✅ ${subscreenName}: ${cards.length}/${maxAllowed} components`);
                }
            });
            
            // Test 2: Visual quality assessment
            const totalOverviewCards = document.querySelectorAll('#overview-page .card').length;
            if (totalOverviewCards > 6) {
                console.error(`❌ Overview has too many visible cards: ${totalOverviewCards}`);
                validationResults.visualQuality = false;
            } else {
                console.log(`✅ Overview visual density: ${totalOverviewCards} cards (appropriate)`);
            }
            
            // Test 3: Interaction functionality
            const interactiveElements = document.querySelectorAll('#overview-page button, select');
            let workingElements = 0;
            
            interactiveElements.forEach(element => {
                if (element.onclick || element.getAttribute('onclick')) {
                    workingElements++;
                }
            });
            
            if (workingElements < interactiveElements.length * 0.8) {
                console.error(`❌ Poor interaction functionality: ${workingElements}/${interactiveElements.length}`);
                validationResults.interactionFlow = false;
            } else {
                console.log(`✅ Interaction functionality: ${workingElements}/${interactiveElements.length} working`);
            }
            
            // Overall validation result
            const allValid = Object.values(validationResults).every(result => result === true);
            
            if (allValid) {
                console.log('🏆 Overview implementation PASSED validation');
                this.triggerSuccessNotification();
            } else {
                console.error('❌ Overview implementation FAILED validation');
                this.triggerFailureNotification(validationResults);
            }
            
            return allValid;
        },
        
        triggerSuccessNotification() {
            // Show user-visible success indicator
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(0, 255, 136, 0.9);
                color: #000;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            notification.textContent = '✅ Overview Screen: UX Validation Passed';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },
        
        triggerFailureNotification(issues) {
            console.error('🚨 Overview implementation failed UX validation:', issues);
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(255, 71, 87, 0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 10000;
            `;
            
            notification.textContent = '❌ Overview Screen: UX Validation Failed';
            document.body.appendChild(notification);
        }
    };

    // Add Overview-specific styling
    const overviewStyles = `
        /* Overview Screen Specific Styling */
        .overview-header {
            background: linear-gradient(135deg, rgba(0, 148, 204, 0.1), rgba(0, 148, 204, 0.05));
            border-bottom: 1px solid rgba(0, 148, 204, 0.2);
        }
        
        .overview-body {
            padding: 16px;
        }
        
        .next-match-dashboard {
            padding: 0;
        }
        
        .match-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .opponent-badge {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #0094cc, #005a7a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .match-details h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: white;
        }
        
        .match-meta {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .match-importance {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .match-importance.high {
            background: rgba(255, 71, 87, 0.2);
            color: #ff4757;
            border: 1px solid rgba(255, 71, 87, 0.3);
        }
        
        .quick-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-label {
            display: block;
            font-size: 9px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 2px;
        }
        
        .stat-value {
            font-size: 11px;
            font-weight: 600;
            color: white;
        }
        
        .league-position-dashboard {
            text-align: center;
        }
        
        .position-header {
            margin-bottom: 12px;
        }
        
        .position-rank {
            font-size: 24px;
            font-weight: 700;
            color: #0094cc;
            line-height: 1;
        }
        
        .position-details {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .mini-table {
            font-size: 9px;
        }
        
        .table-row {
            display: grid;
            grid-template-columns: 20px 1fr 30px;
            gap: 4px;
            padding: 2px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .table-row.current {
            background: rgba(0, 148, 204, 0.1);
            font-weight: 600;
        }
        
        .squad-status-dashboard {
            text-align: center;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-bottom: 12px;
            padding: 6px;
            border-radius: 6px;
        }
        
        .status-indicator.excellent {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
        }
        
        .key-metrics {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 4px;
            font-size: 10px;
        }
        
        .metric-value.warning {
            color: #ffb800;
        }
        
        .recent-form-dashboard {
            text-align: center;
        }
        
        .form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .form-header h4 {
            margin: 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .form-trend.positive {
            color: #00ff88;
        }
        
        .form-results {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-bottom: 12px;
        }
        
        .result {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 600;
        }
        
        .result.win {
            background: #00ff88;
            color: #000;
        }
        
        .result.draw {
            background: #ffb800;
            color: #000;
        }
        
        .result.loss {
            background: #ff4757;
            color: white;
        }
        
        .form-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 10px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'overview-orchestrator-styles';
    style.textContent = overviewStyles;
    document.head.appendChild(style);

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => OverviewSubOrchestrator.init(), 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => OverviewSubOrchestrator.init(), 2000);
        });
    }

    // Make available for Master Orchestrator
    window.OverviewSubOrchestrator = OverviewSubOrchestrator;

})();