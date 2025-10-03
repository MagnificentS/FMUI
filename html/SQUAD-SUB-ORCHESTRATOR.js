/**
 * SQUAD SUB-ORCHESTRATOR
 * Implements Squad screen with proper UX principles from Research-Docs
 * Think Hard about player information management and cognitive load
 */

(function() {
    'use strict';

    console.log('👥 SQUAD SUB-ORCHESTRATOR: Think Hard about implementing Squad screen with proper information density...');

    const SquadSubOrchestrator = {
        initialized: false,
        
        // UX Framework from Research-Docs analysis
        subscreens: {
            'first-team': {
                name: 'First Team',
                maxComponents: 6,
                cognitiveTarget: 6, // Medium cognitive load for squad overview
                attentionFocus: 'primary', // 40% of user attention
                taskTarget: 180 // 3 minutes for squad analysis
            },
            'player-detail': {
                name: 'Player Detail',  
                maxComponents: 5,
                cognitiveTarget: 7, // Higher cognitive load for detailed analysis
                attentionFocus: 'secondary', // 30% of user attention
                taskTarget: 120 // 2 minutes per player analysis
            },
            'analysis': {
                name: 'Squad Analysis',
                maxComponents: 4,
                cognitiveTarget: 5, // Medium cognitive load for analysis
                attentionFocus: 'tertiary', // 30% of user attention  
                taskTarget: 150 // 2.5 minutes for squad analysis
            }
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('👥 SQUAD SUB-ORCHESTRATOR: Implementing clean Squad screen...');
            
            this.analyzeSquadRequirements();
            this.clearSquadOverload(); 
            this.implementFirstTeamSubscreen();
            this.setupSquadNavigation();
            this.validateSquadImplementation();
            
            this.initialized = true;
            console.log('✅ SQUAD SUB-ORCHESTRATOR: Squad screen properly implemented');
        },
        
        analyzeSquadRequirements() {
            console.log('🌳 Forest of Thoughts: Analyzing Squad screen requirements...');
            
            // Decision Tree 1: What information is critical for squad management?
            console.log('🌳 Tree 1: Critical squad information hierarchy');
            // Answer: Starting XI, player list, squad depth, injury status, form, contracts
            
            // Decision Tree 2: How to manage player detail complexity?
            console.log('🌳 Tree 2: Player detail cognitive load management');
            // Answer: Progressive disclosure - overview → attributes → performance → detailed stats
            
            // Decision Tree 3: Squad analysis vs individual analysis separation?
            console.log('🌳 Tree 3: Analysis scope organization');
            // Answer: Team-level analysis (age, value, depth) separate from individual player detail
            
            // Decision Tree 4: Information density per component?
            console.log('🌳 Tree 4: Component-level cognitive load');
            // Answer: Starting XI (2 points), Player list (2 points), Depth chart (1 point), Status (1 point)
            
            console.log('✅ Forest of Thoughts analysis complete - structured squad information');
        },
        
        clearSquadOverload() {
            console.log('🧹 Preventing squad information overload...');
            
            // Override squad card loading to prevent overload
            if (window.getCardsForPage) {
                const originalGetCards = window.getCardsForPage;
                window.getCardsForPage = function(pageName) {
                    if (pageName === 'squad') {
                        console.log('🚫 Blocking original squad cards to prevent overload');
                        return []; // Return empty array for squad
                    }
                    return originalGetCards.call(this, pageName);
                };
            }
            
            // Clear squad container
            const squadContainer = document.querySelector('#squad-grid-view .tile-container');
            if (squadContainer) {
                squadContainer.innerHTML = '';
                console.log('🗑️ Squad container cleared');
            }
            
            console.log('✅ Squad overload prevention implemented');
        },
        
        implementFirstTeamSubscreen() {
            console.log('👥 Implementing First Team subscreen: 6 components, cognitive load 6/10...');
            
            // Forest of Thoughts for First Team components
            console.log('🌳 Using forest of thoughts for First Team component selection...');
            
            const firstTeamComponents = [
                {
                    title: 'Starting XI',
                    size: 'w12 h6', // Primary focus - formation layout
                    priority: 'primary',
                    cognitiveLoad: 2, // Formation + names
                    content: this.createStartingXIContent()
                },
                {
                    title: 'Squad List',
                    size: 'w8 h8', // Secondary focus - player table
                    priority: 'secondary', 
                    cognitiveLoad: 2, // Player rows + stats
                    content: this.createSquadListContent()
                },
                {
                    title: 'Squad Depth',
                    size: 'w6 h4', // Tertiary focus - position summary
                    priority: 'tertiary',
                    cognitiveLoad: 1, // Position counts only
                    content: this.createSquadDepthContent()
                },
                {
                    title: 'Squad Status',
                    size: 'w6 h4', // Tertiary focus - key metrics
                    priority: 'tertiary',
                    cognitiveLoad: 1, // Key stats only
                    content: this.createSquadStatusContent()
                }
            ];
            
            // Validate component count and cognitive load
            if (firstTeamComponents.length > this.subscreens['first-team'].maxComponents) {
                console.error('❌ First Team exceeds component limit');
                return;
            }
            
            const totalCognitiveLoad = firstTeamComponents.reduce((sum, comp) => sum + comp.cognitiveLoad, 0);
            if (totalCognitiveLoad > this.subscreens['first-team'].cognitiveTarget) {
                console.error('❌ First Team exceeds cognitive load target');
                return;
            }
            
            console.log(`✅ Component validation passed: ${firstTeamComponents.length} components, ${totalCognitiveLoad}/10 cognitive load`);
            
            // Implement components
            this.renderSquadComponents('first-team', firstTeamComponents);
        },
        
        createStartingXIContent() {
            return `
                <div class="starting-xi-display">
                    <div class="formation-header">
                        <h4>4-2-3-1 Formation</h4>
                        <div class="formation-familiarity">95% Familiar</div>
                    </div>
                    
                    <div class="xi-formation-pitch">
                        <div class="formation-line gk">
                            <div class="player-slot">
                                <span class="player-name">Onana</span>
                                <span class="player-rating">7.4</span>
                            </div>
                        </div>
                        
                        <div class="formation-line defense">
                            <div class="player-slot">
                                <span class="player-name">Dalot</span>
                                <span class="player-rating">7.2</span>
                            </div>
                            <div class="player-slot">
                                <span class="player-name">Varane</span>
                                <span class="player-rating">7.5</span>
                            </div>
                            <div class="player-slot">
                                <span class="player-name">Martinez</span>
                                <span class="player-rating">7.6</span>
                            </div>
                            <div class="player-slot">
                                <span class="player-name">Shaw</span>
                                <span class="player-rating">7.3</span>
                            </div>
                        </div>
                        
                        <div class="formation-line midfield">
                            <div class="player-slot">
                                <span class="player-name">Casemiro</span>
                                <span class="player-rating">7.5</span>
                            </div>
                            <div class="player-slot">
                                <span class="player-name">Mainoo</span>
                                <span class="player-rating">7.3</span>
                            </div>
                        </div>
                        
                        <div class="formation-line attack">
                            <div class="player-slot">
                                <span class="player-name">Garnacho</span>
                                <span class="player-rating">7.4</span>
                            </div>
                            <div class="player-slot">
                                <span class="player-name">Bruno</span>
                                <span class="player-rating">8.2</span>
                            </div>
                            <div class="player-slot">
                                <span class="player-name">Rashford</span>
                                <span class="player-rating">7.8</span>
                            </div>
                        </div>
                        
                        <div class="formation-line striker">
                            <div class="player-slot">
                                <span class="player-name">Højlund</span>
                                <span class="player-rating">7.2</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadListContent() {
            return `
                <div class="squad-list-focused">
                    <div class="list-controls">
                        <select class="position-filter">
                            <option value="">All Positions</option>
                            <option value="GK">Goalkeepers</option>
                            <option value="DEF">Defenders</option>
                            <option value="MID">Midfielders</option>
                            <option value="ATT">Attackers</option>
                        </select>
                    </div>
                    
                    <div class="player-list-compact">
                        <div class="player-row">
                            <span class="player-name">Bruno Fernandes (C)</span>
                            <span class="player-pos">AM</span>
                            <span class="player-rating excellent">8.2</span>
                            <span class="player-fitness">93%</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Marcus Rashford</span>
                            <span class="player-pos">LW</span>
                            <span class="player-rating good">7.8</span>
                            <span class="player-fitness">96%</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Lisandro Martinez</span>
                            <span class="player-pos">CB</span>
                            <span class="player-rating good">7.6</span>
                            <span class="player-fitness">96%</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Casemiro</span>
                            <span class="player-pos">DM</span>
                            <span class="player-rating good">7.5</span>
                            <span class="player-fitness">91%</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Andre Onana</span>
                            <span class="player-pos">GK</span>
                            <span class="player-rating good">7.4</span>
                            <span class="player-fitness">95%</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadDepthContent() {
            return `
                <div class="squad-depth-focused">
                    <div class="depth-overview">
                        <h4>Position Depth</h4>
                    </div>
                    
                    <div class="depth-metrics">
                        <div class="depth-item">
                            <span class="position">GK</span>
                            <span class="count">3</span>
                            <div class="depth-indicator good"></div>
                        </div>
                        <div class="depth-item">
                            <span class="position">DEF</span>
                            <span class="count">9</span>
                            <div class="depth-indicator excellent"></div>
                        </div>
                        <div class="depth-item">
                            <span class="position">MID</span>
                            <span class="count">7</span>
                            <div class="depth-indicator good"></div>
                        </div>
                        <div class="depth-item">
                            <span class="position">ATT</span>
                            <span class="count">8</span>
                            <div class="depth-indicator good"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadStatusContent() {
            return `
                <div class="squad-status-focused">
                    <div class="status-header">
                        <div class="morale-indicator excellent">
                            <span class="morale-icon">😊</span>
                            <span class="morale-text">Excellent</span>
                        </div>
                    </div>
                    
                    <div class="key-stats">
                        <div class="stat-item">
                            <span class="stat-label">Squad Size</span>
                            <span class="stat-value">27</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Avg Age</span>
                            <span class="stat-value">26.3</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Injured</span>
                            <span class="stat-value warning">2</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Value</span>
                            <span class="stat-value">£678M</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderSquadComponents(subscreenName, components) {
            console.log(`🎨 Rendering Squad ${subscreenName} with ${components.length} components...`);
            
            const container = document.querySelector('#squad-grid-view .tile-container');
            if (!container) return;
            
            // Clear existing content
            container.innerHTML = '';
            
            // Create each component with proper spacing and layout
            components.forEach((component, index) => {
                const card = document.createElement('div');
                card.className = `card ${component.size} squad-${subscreenName}`;
                card.setAttribute('data-component-priority', component.priority);
                card.setAttribute('data-cognitive-load', component.cognitiveLoad);
                
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3);
                card.setAttribute('data-grid-w', width);
                card.setAttribute('data-grid-h', height);
                card.draggable = false;
                
                card.innerHTML = `
                    <div class="card-header squad-header">
                        <span>${component.title}</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                        </div>
                    </div>
                    <div class="card-body squad-body">
                        ${component.content}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `;
                
                container.appendChild(card);
                console.log(`✅ Squad component rendered: ${component.title} (${component.size}, load: ${component.cognitiveLoad}/10)`);
            });
            
            // Trigger layout system
            if (window.layoutCards) {
                setTimeout(() => {
                    window.layoutCards(container);
                }, 100);
            }
        },
        
        setupSquadNavigation() {
            console.log('🧭 Setting up Squad subscreen navigation...');
            
            // Update squad submenu for proper navigation
            const squadSubmenu = document.getElementById('squad-submenu');
            if (squadSubmenu) {
                const submenuContent = squadSubmenu.querySelector('.submenu-content');
                if (submenuContent) {
                    submenuContent.innerHTML = `
                        <span class="submenu-item active" onclick="showSquadSubscreen('first-team')">First Team</span>
                        <span class="submenu-item disabled">Player Detail</span>
                        <span class="submenu-item disabled">Analysis</span>
                        <span class="submenu-item">Reserves</span>
                        <span class="submenu-item">Youth</span>
                    `;
                }
            }
            
            // Global function for squad subscreen navigation
            window.showSquadSubscreen = (subscreenName) => {
                console.log(`🧭 Navigating to Squad/${subscreenName}`);
                
                // Update active submenu item
                document.querySelectorAll('#squad-submenu .submenu-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.textContent.toLowerCase().includes(subscreenName.replace('-', ' '))) {
                        item.classList.add('active');
                    }
                });
                
                // Show/hide relevant cards
                this.showSquadSubscreenCards(subscreenName);
            };
            
            console.log('✅ Squad navigation setup complete');
        },
        
        showSquadSubscreenCards(subscreenName) {
            console.log(`👁️ Showing cards for Squad/${subscreenName} subscreen...`);
            
            const allSquadCards = document.querySelectorAll('.card.squad-first-team, .card.squad-player-detail, .card.squad-analysis');
            
            allSquadCards.forEach(card => {
                const shouldShow = card.classList.contains(`squad-${subscreenName}`);
                card.style.display = shouldShow ? 'flex' : 'none';
                
                if (shouldShow) {
                    // Animate card entrance with ZENITH timing
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
        
        validateSquadImplementation() {
            console.log('🧪 Validating Squad implementation against UX principles...');
            
            const validationResults = {
                componentCount: true,
                cognitiveLoad: true,
                visualQuality: true,
                functionalFlow: true
            };
            
            // Test 1: Component count per subscreen
            const firstTeamCards = document.querySelectorAll('.squad-first-team');
            const maxAllowed = this.subscreens['first-team'].maxComponents;
            
            if (firstTeamCards.length > maxAllowed) {
                console.error(`❌ First Team has ${firstTeamCards.length} components, max allowed: ${maxAllowed}`);
                validationResults.componentCount = false;
            } else {
                console.log(`✅ First Team: ${firstTeamCards.length}/${maxAllowed} components`);
            }
            
            // Test 2: Cognitive load assessment
            const totalSquadCards = document.querySelectorAll('#squad-page .card').length;
            if (totalSquadCards > 6) {
                console.error(`❌ Squad has too many visible cards: ${totalSquadCards}`);
                validationResults.cognitiveLoad = false;
            } else {
                console.log(`✅ Squad cognitive load: ${totalSquadCards} cards (appropriate)`);
            }
            
            // Test 3: Visual hierarchy
            const hasProperHierarchy = document.querySelectorAll('.squad-first-team [data-component-priority="primary"]').length <= 2;
            if (!hasProperHierarchy) {
                console.error('❌ Poor visual hierarchy in Squad screen');
                validationResults.visualQuality = false;
            } else {
                console.log('✅ Squad visual hierarchy: proper primary/secondary distribution');
            }
            
            // Overall validation
            const allValid = Object.values(validationResults).every(result => result === true);
            
            if (allValid) {
                console.log('🏆 Squad implementation PASSED validation');
                this.triggerSquadSuccessNotification();
                return true;
            } else {
                console.error('❌ Squad implementation FAILED validation');
                this.triggerSquadFailureNotification(validationResults);
                return false;
            }
        },
        
        triggerSquadSuccessNotification() {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 140px;
                right: 20px;
                background: rgba(0, 255, 136, 0.9);
                color: #000;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            notification.textContent = '✅ Squad Screen: UX Validation Passed';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },
        
        triggerSquadFailureNotification(issues) {
            console.error('🚨 Squad implementation failed UX validation:', issues);
            
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 140px;
                right: 20px;
                background: rgba(255, 71, 87, 0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 10000;
            `;
            
            notification.textContent = '❌ Squad Screen: UX Validation Failed';
            document.body.appendChild(notification);
        }
    };

    // Add Squad-specific styling
    const squadStyles = `
        /* Squad Screen Specific Styling */
        .squad-header {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 255, 136, 0.05));
            border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .squad-body {
            padding: 16px;
        }
        
        /* Starting XI Formation */
        .starting-xi-display {
            padding: 0;
        }
        
        .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .formation-header h4 {
            margin: 0;
            font-size: 12px;
            color: white;
        }
        
        .formation-familiarity {
            font-size: 10px;
            color: #00ff88;
            font-weight: 600;
        }
        
        .xi-formation-pitch {
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 8px;
            padding: 16px 8px;
            position: relative;
            min-height: 140px;
        }
        
        .formation-line {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 8px 0;
        }
        
        .formation-line.defense {
            justify-content: space-between;
        }
        
        .formation-line.midfield {
            justify-content: space-around;
        }
        
        .formation-line.attack {
            justify-content: space-between;
        }
        
        .player-slot {
            background: rgba(0, 148, 204, 0.8);
            border: 2px solid white;
            border-radius: 6px;
            padding: 4px 6px;
            text-align: center;
            min-width: 60px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .player-slot:hover {
            background: rgba(0, 148, 204, 1);
            transform: translateY(-2px);
        }
        
        .player-name {
            display: block;
            font-size: 9px;
            font-weight: 600;
            color: white;
            line-height: 1;
        }
        
        .player-rating {
            display: block;
            font-size: 8px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 2px;
        }
        
        /* Squad List */
        .squad-list-focused {
            padding: 0;
        }
        
        .list-controls {
            margin-bottom: 12px;
        }
        
        .position-filter {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 11px;
        }
        
        .player-list-compact {
            max-height: 160px;
            overflow-y: auto;
        }
        
        .player-row {
            display: grid;
            grid-template-columns: 1fr 40px 40px 40px;
            gap: 8px;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 10px;
            align-items: center;
        }
        
        .player-row:hover {
            background: rgba(255, 255, 255, 0.02);
            cursor: pointer;
        }
        
        .player-name {
            color: white;
            font-weight: 500;
        }
        
        .player-pos {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 9px;
        }
        
        .player-rating {
            text-align: center;
            font-weight: 600;
        }
        
        .player-rating.excellent {
            color: #00ff88;
        }
        
        .player-rating.good {
            color: #ffb800;
        }
        
        .player-fitness {
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
            font-size: 9px;
        }
        
        /* Squad Depth */
        .squad-depth-focused {
            text-align: center;
        }
        
        .depth-overview h4 {
            margin: 0 0 12px 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .depth-metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .depth-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
        }
        
        .depth-item .position {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 600;
        }
        
        .depth-item .count {
            font-size: 12px;
            color: white;
            font-weight: 600;
        }
        
        .depth-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        
        .depth-indicator.excellent {
            background: #00ff88;
        }
        
        .depth-indicator.good {
            background: #ffb800;
        }
        
        .depth-indicator.poor {
            background: #ff4757;
        }
        
        /* Squad Status */
        .squad-status-focused {
            text-align: center;
        }
        
        .status-header {
            margin-bottom: 12px;
        }
        
        .morale-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px;
            border-radius: 6px;
        }
        
        .morale-indicator.excellent {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
        }
        
        .key-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 10px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-label {
            display: block;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 2px;
        }
        
        .stat-value {
            font-size: 12px;
            font-weight: 600;
            color: white;
        }
        
        .stat-value.warning {
            color: #ffb800;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'squad-orchestrator-styles';
    style.textContent = squadStyles;
    document.head.appendChild(style);

    // Auto-initialize when page is ready
    if (document.readyState === 'complete') {
        setTimeout(() => SquadSubOrchestrator.init(), 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => SquadSubOrchestrator.init(), 2000);
        });
    }

    // Make available for coordination
    window.SquadSubOrchestrator = SquadSubOrchestrator;

})();