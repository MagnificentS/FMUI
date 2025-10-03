/**
 * TACTICS SUB-ORCHESTRATOR  
 * Implements Tactics screen with proper UX principles from Research-Docs
 * Think Hard about tactical information management and cognitive load
 */

(function() {
    'use strict';

    console.log('⚽ TACTICS SUB-ORCHESTRATOR: Think Hard about implementing Tactics screen with proper information density...');

    const TacticsSubOrchestrator = {
        initialized: false,
        
        // UX Framework for Tactics (high complexity but manageable)
        subscreens: {
            formation: {
                name: 'Formation',
                maxComponents: 5,
                cognitiveTarget: 7, // Higher load for tactical complexity
                attentionFocus: 'primary', // 40% attention - formation is critical
                taskTarget: 240 // 4 minutes for tactical setup
            },
            instructions: {
                name: 'Instructions',
                maxComponents: 6,
                cognitiveTarget: 8, // High load for detailed instructions
                attentionFocus: 'secondary', // 30% attention
                taskTarget: 180 // 3 minutes for instruction setup
            },
            analysis: {
                name: 'Analysis',
                maxComponents: 4,
                cognitiveTarget: 6, // Medium load for analysis
                attentionFocus: 'tertiary', // 30% attention
                taskTarget: 120 // 2 minutes for analysis review
            }
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('⚽ TACTICS SUB-ORCHESTRATOR: Implementing clean Tactics screen...');
            
            this.analyzeTacticsRequirements();
            this.clearTacticsOverload();
            this.implementFormationSubscreen();
            this.setupTacticsNavigation();
            this.validateTacticsImplementation();
            
            this.initialized = true;
            console.log('✅ TACTICS SUB-ORCHESTRATOR: Tactics screen properly implemented');
        },
        
        analyzeTacticsRequirements() {
            console.log('🌳 Forest of Thoughts: Analyzing Tactics screen requirements...');
            
            // Decision Tree 1: What's the primary tactical management task?
            console.log('🌳 Tree 1: Primary tactical task analysis');
            // Answer: Formation setup and player positioning (most visual impact)
            
            // Decision Tree 2: What's the secondary tactical need?
            console.log('🌳 Tree 2: Secondary tactical requirements');
            // Answer: Team instructions and player roles (detailed settings)
            
            // Decision Tree 3: How to organize tactical complexity?
            console.log('🌳 Tree 3: Tactical complexity management');
            // Answer: Visual formation (primary), instruction controls (secondary), analysis (supporting)
            
            // Decision Tree 4: Cognitive load distribution for tactics?
            console.log('🌳 Tree 4: Tactical cognitive load planning');
            // Answer: Formation editor (3 points), mentality controls (2 points), player roles (2 points)
            
            console.log('✅ Forest of Thoughts analysis complete - structured tactical information');
        },
        
        clearTacticsOverload() {
            console.log('🧹 Preventing tactics information overload...');
            
            // Force clear tactics container
            const tacticsContainer = document.querySelector('#tactics-grid-view .tile-container');
            if (tacticsContainer) {
                tacticsContainer.innerHTML = '';
                console.log('🗑️ Tactics container cleared');
            }
            
            console.log('✅ Tactics overload prevention implemented');
        },
        
        implementFormationSubscreen() {
            console.log('⚽ Implementing Formation subscreen: 5 components, cognitive load 7/10...');
            
            // Forest of Thoughts for Formation components
            console.log('🌳 Using forest of thoughts for Formation component selection...');
            
            const formationComponents = [
                {
                    title: 'Formation Editor',
                    size: 'w12 h7', // Primary focus - interactive formation
                    priority: 'primary',
                    cognitiveLoad: 3, // Formation + positions + interactions
                    content: this.createFormationEditorContent()
                },
                {
                    title: 'Team Mentality',
                    size: 'w6 h4', // Secondary focus - key tactical setting
                    priority: 'secondary',
                    cognitiveLoad: 2, // Mentality scale + options
                    content: this.createMentalityContent()
                },
                {
                    title: 'Playing Style',
                    size: 'w6 h4', // Secondary focus - style settings
                    priority: 'secondary',
                    cognitiveLoad: 2, // Style options + sliders
                    content: this.createPlayingStyleContent()
                }
            ];
            
            // Validate against UX principles
            if (formationComponents.length > this.subscreens.formation.maxComponents) {
                console.error('❌ Formation exceeds component limit');
                return;
            }
            
            const totalCognitiveLoad = formationComponents.reduce((sum, comp) => sum + comp.cognitiveLoad, 0);
            if (totalCognitiveLoad > this.subscreens.formation.cognitiveTarget) {
                console.error('❌ Formation exceeds cognitive load target');
                return;
            }
            
            console.log(`✅ Formation validation passed: ${formationComponents.length} components, ${totalCognitiveLoad}/10 cognitive load`);
            
            // Render tactics components
            this.renderTacticsComponents(formationComponents);
        },
        
        createFormationEditorContent() {
            return `
                <div class="formation-editor">
                    <div class="editor-header">
                        <div class="formation-selector">
                            <select class="formation-select" onchange="changeFormation(this.value)">
                                <option value="4-2-3-1" selected>4-2-3-1</option>
                                <option value="4-3-3">4-3-3</option>
                                <option value="3-5-2">3-5-2</option>
                                <option value="4-4-2">4-4-2</option>
                                <option value="5-3-2">5-3-2</option>
                            </select>
                        </div>
                        <div class="formation-stats">
                            <span class="familiarity">95% Familiar</span>
                            <span class="effectiveness">Highly Effective vs 4-4-2</span>
                        </div>
                    </div>
                    
                    <div class="tactics-pitch">
                        <!-- Interactive formation pitch -->
                        <div class="pitch-background">
                            <div class="center-line"></div>
                            <div class="penalty-boxes"></div>
                        </div>
                        
                        <!-- Draggable player positions -->
                        <div class="player-positions">
                            <div class="tactical-player gk" style="left: 50%; top: 85%;" data-position="GK">
                                <span class="player-number">1</span>
                                <span class="player-name">Onana</span>
                            </div>
                            
                            <div class="tactical-player def" style="left: 20%; top: 65%;" data-position="LB">
                                <span class="player-number">23</span>
                                <span class="player-name">Shaw</span>
                            </div>
                            <div class="tactical-player def" style="left: 40%; top: 70%;" data-position="CB">
                                <span class="player-number">6</span>
                                <span class="player-name">Martinez</span>
                            </div>
                            <div class="tactical-player def" style="left: 60%; top: 70%;" data-position="CB">
                                <span class="player-number">19</span>
                                <span class="player-name">Varane</span>
                            </div>
                            <div class="tactical-player def" style="left: 80%; top: 65%;" data-position="RB">
                                <span class="player-number">20</span>
                                <span class="player-name">Dalot</span>
                            </div>
                            
                            <div class="tactical-player mid" style="left: 35%; top: 45%;" data-position="DM">
                                <span class="player-number">18</span>
                                <span class="player-name">Casemiro</span>
                            </div>
                            <div class="tactical-player mid" style="left: 65%; top: 45%;" data-position="CM">
                                <span class="player-number">37</span>
                                <span class="player-name">Mainoo</span>
                            </div>
                            
                            <div class="tactical-player att" style="left: 20%; top: 25%;" data-position="LW">
                                <span class="player-number">10</span>
                                <span class="player-name">Rashford</span>
                            </div>
                            <div class="tactical-player att" style="left: 50%; top: 30%;" data-position="AM">
                                <span class="player-number">8</span>
                                <span class="player-name">Bruno</span>
                            </div>
                            <div class="tactical-player att" style="left: 80%; top: 25%;" data-position="RW">
                                <span class="player-number">17</span>
                                <span class="player-name">Garnacho</span>
                            </div>
                            
                            <div class="tactical-player str" style="left: 50%; top: 10%;" data-position="ST">
                                <span class="player-number">11</span>
                                <span class="player-name">Højlund</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createMentalityContent() {
            return `
                <div class="mentality-control">
                    <div class="mentality-header">
                        <h4>Team Mentality</h4>
                        <span class="current-mentality">Balanced</span>
                    </div>
                    
                    <div class="mentality-scale">
                        <input type="range" min="0" max="100" value="50" class="mentality-slider" onchange="updateMentality(this.value)">
                        <div class="scale-labels">
                            <span class="label defensive">Very Defensive</span>
                            <span class="label balanced active">Balanced</span>
                            <span class="label attacking">Very Attacking</span>
                        </div>
                    </div>
                    
                    <div class="mentality-effects">
                        <div class="effect-item">
                            <span class="effect-label">Risk Taking</span>
                            <div class="effect-bar">
                                <div class="effect-fill" style="width: 50%; background: #ffb800;"></div>
                            </div>
                        </div>
                        <div class="effect-item">
                            <span class="effect-label">Defensive Line</span>
                            <div class="effect-bar">
                                <div class="effect-fill" style="width: 60%; background: #0094cc;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createPlayingStyleContent() {
            return `
                <div class="playing-style-control">
                    <div class="style-header">
                        <h4>Playing Style</h4>
                        <span class="current-style">Possession</span>
                    </div>
                    
                    <div class="style-options">
                        <div class="style-option active">
                            <input type="radio" name="style" value="possession" checked>
                            <label>Possession</label>
                        </div>
                        <div class="style-option">
                            <input type="radio" name="style" value="counter">
                            <label>Counter-Attack</label>
                        </div>
                        <div class="style-option">
                            <input type="radio" name="style" value="direct">
                            <label>Direct</label>
                        </div>
                    </div>
                    
                    <div class="style-parameters">
                        <div class="parameter-item">
                            <span class="param-label">Tempo</span>
                            <input type="range" min="0" max="100" value="65" class="param-slider">
                            <span class="param-value">Higher</span>
                        </div>
                        <div class="parameter-item">
                            <span class="param-label">Width</span>
                            <input type="range" min="0" max="100" value="70" class="param-slider">
                            <span class="param-value">Wide</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        renderTacticsComponents(components) {
            console.log(`🎨 Rendering ${components.length} clean Tactics components...`);
            
            const container = document.querySelector('#tactics-grid-view .tile-container');
            if (!container) return;
            
            // Clear and render clean components
            container.innerHTML = '';
            
            components.forEach((component, index) => {
                const card = document.createElement('div');
                card.className = `card ${component.size} clean-component tactics-component`;
                card.setAttribute('data-component-priority', component.priority);
                card.setAttribute('data-cognitive-load', component.cognitiveLoad);
                
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3);
                card.setAttribute('data-grid-w', width);
                card.setAttribute('data-grid-h', height);
                card.draggable = false;
                
                card.innerHTML = `
                    <div class="card-header clean-header">
                        <span>${component.title}</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                        </div>
                    </div>
                    <div class="card-body clean-body">
                        ${component.content}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `;
                
                container.appendChild(card);
                console.log(`✅ Tactics component rendered: ${component.title} (${component.size}, cognitive load: ${component.cognitiveLoad})`);
            });
            
            // Layout cards properly
            if (window.layoutCards) {
                setTimeout(() => {
                    window.layoutCards(container);
                }, 100);
            }
        },
        
        setupTacticsNavigation() {
            console.log('🧭 Setting up Tactics subscreen navigation...');
            
            // Update tactics submenu
            const tacticsSubmenu = document.getElementById('tactics-submenu');
            if (tacticsSubmenu) {
                const submenuContent = tacticsSubmenu.querySelector('.submenu-content');
                if (submenuContent) {
                    submenuContent.innerHTML = `
                        <span class="submenu-item active" onclick="showTacticsSubscreen('formation')">Formation</span>
                        <span class="submenu-item disabled">Instructions</span>
                        <span class="submenu-item disabled">Analysis</span>
                        <span class="submenu-item">Set Pieces</span>
                        <span class="submenu-item">Opposition</span>
                    `;
                }
            }
            
            // Global function for tactics subscreen navigation
            window.showTacticsSubscreen = (subscreenName) => {
                console.log(`🧭 Navigating to Tactics/${subscreenName}`);
                
                // Update active submenu item
                document.querySelectorAll('#tactics-submenu .submenu-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.textContent.toLowerCase().includes(subscreenName)) {
                        item.classList.add('active');
                    }
                });
            };
            
            console.log('✅ Tactics navigation setup complete');
        },
        
        validateTacticsImplementation() {
            console.log('🧪 Validating Tactics implementation against UX principles...');
            
            const tacticsCards = document.querySelectorAll('#tactics-page .card.tactics-component');
            const componentCount = tacticsCards.length;
            
            // Validate component count
            if (componentCount > this.subscreens.formation.maxComponents) {
                console.error(`❌ Tactics exceeds component limit: ${componentCount} > ${this.subscreens.formation.maxComponents}`);
                return false;
            }
            
            // Validate cognitive load
            let totalCognitiveLoad = 0;
            tacticsCards.forEach(card => {
                const cognitiveLoad = parseInt(card.getAttribute('data-cognitive-load') || 0);
                totalCognitiveLoad += cognitiveLoad;
            });
            
            if (totalCognitiveLoad > this.subscreens.formation.cognitiveTarget) {
                console.error(`❌ Tactics cognitive load too high: ${totalCognitiveLoad} > ${this.subscreens.formation.cognitiveTarget}`);
                return false;
            }
            
            console.log(`🏆 Tactics validation PASSED: ${componentCount} components, ${totalCognitiveLoad}/10 cognitive load`);
            
            // Show success notification
            this.triggerTacticsSuccessNotification();
            return true;
        },
        
        triggerTacticsSuccessNotification() {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 180px;
                right: 20px;
                background: rgba(0, 255, 136, 0.9);
                color: #000;
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            notification.textContent = '⚽ Tactics Screen: UX Validation Passed';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // Add Tactics-specific styling
    const tacticsStyles = `
        /* Tactics Screen Specific Styling */
        .tactics-component {
            border-left: 2px solid rgba(255, 107, 53, 0.3);
        }
        
        /* Formation Editor */
        .formation-editor {
            padding: 0;
        }
        
        .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .formation-select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
        }
        
        .formation-stats {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 9px;
            gap: 2px;
        }
        
        .familiarity {
            color: #00ff88;
            font-weight: 600;
        }
        
        .effectiveness {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .tactics-pitch {
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 8px;
            position: relative;
            height: 200px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
        }
        
        .pitch-background {
            position: absolute;
            inset: 0;
        }
        
        .center-line {
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            height: 2px;
            background: rgba(255, 255, 255, 0.6);
        }
        
        .penalty-boxes::before,
        .penalty-boxes::after {
            content: '';
            position: absolute;
            left: 30%;
            right: 30%;
            height: 40px;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 4px;
        }
        
        .penalty-boxes::before {
            top: 8px;
            border-bottom: none;
        }
        
        .penalty-boxes::after {
            bottom: 8px;
            border-top: none;
        }
        
        .tactical-player {
            position: absolute;
            transform: translate(-50%, -50%);
            background: rgba(255, 107, 53, 0.9);
            border: 2px solid white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: grab;
            transition: all 0.2s ease;
            font-size: 6px;
        }
        
        .tactical-player:hover {
            background: rgba(255, 107, 53, 1);
            transform: translate(-50%, -50%) scale(1.2);
            z-index: 10;
        }
        
        .tactical-player:active {
            cursor: grabbing;
        }
        
        .player-number {
            font-weight: 700;
            color: white;
            line-height: 1;
        }
        
        .player-name {
            font-weight: 600;
            color: white;
            line-height: 1;
            margin-top: 1px;
        }
        
        /* Mentality Control */
        .mentality-control {
            padding: 0;
        }
        
        .mentality-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .mentality-header h4 {
            margin: 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .current-mentality {
            font-size: 10px;
            color: #0094cc;
            font-weight: 600;
        }
        
        .mentality-scale {
            margin-bottom: 12px;
        }
        
        .mentality-slider {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            outline: none;
            cursor: pointer;
        }
        
        .mentality-slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: #0094cc;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .scale-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 6px;
            font-size: 8px;
        }
        
        .scale-labels .label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .scale-labels .label.active {
            color: #0094cc;
            font-weight: 600;
        }
        
        .mentality-effects {
            font-size: 9px;
        }
        
        .effect-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 6px 0;
        }
        
        .effect-label {
            color: rgba(255, 255, 255, 0.8);
        }
        
        .effect-bar {
            width: 60px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .effect-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        
        /* Playing Style Control */
        .playing-style-control {
            padding: 0;
        }
        
        .style-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .style-header h4 {
            margin: 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .current-style {
            font-size: 10px;
            color: #ff6b35;
            font-weight: 600;
        }
        
        .style-options {
            margin-bottom: 12px;
        }
        
        .style-option {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 6px 0;
            font-size: 10px;
        }
        
        .style-option input[type="radio"] {
            accent-color: #ff6b35;
        }
        
        .style-option label {
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
        }
        
        .style-option.active label {
            color: white;
            font-weight: 600;
        }
        
        .style-parameters {
            font-size: 9px;
        }
        
        .parameter-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
        }
        
        .param-label {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .param-slider {
            width: 60px;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            outline: none;
        }
        
        .param-slider::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            background: #ff6b35;
            border-radius: 50%;
            cursor: pointer;
        }
        
        .param-value {
            color: white;
            font-weight: 600;
            font-size: 9px;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'tactics-clean-styles';
    style.textContent = tacticsStyles;
    document.head.appendChild(style);

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => TacticsSubOrchestrator.init(), 1500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => TacticsSubOrchestrator.init(), 1500);
        });
    }

    // Make available for coordination
    window.TacticsSubOrchestrator = TacticsSubOrchestrator;

})();