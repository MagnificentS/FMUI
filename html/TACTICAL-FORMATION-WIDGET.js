/**
 * TACTICAL FORMATION WIDGET
 * Interactive formation designer based on Research-Docs findings
 * Professional-grade tactical visualization for football management
 */

(function() {
    'use strict';

    console.log('⚽ TACTICAL FORMATION WIDGET: Creating interactive formation designer...');

    const TacticalFormationWidget = {
        init() {
            console.log('⚽ FORMATION WIDGET: Initializing tactical components...');
            
            this.enhanceFormationContent();
            this.addTacticalStyles();
            
            console.log('✅ TACTICAL FORMATION WIDGET: Ready');
        },

        enhanceFormationContent() {
            console.log('⚽ Enhancing formation content with interactive elements...');
            
            // Look for formation-related content and enhance it
            setTimeout(() => {
                this.upgradeExistingFormationCards();
            }, 200);
        },

        upgradeExistingFormationCards() {
            // Find formation-related cards and upgrade them
            document.querySelectorAll('.card').forEach(card => {
                const cardTitle = card.querySelector('.card-header span')?.textContent || '';
                
                if (cardTitle.toLowerCase().includes('formation') || 
                    cardTitle.toLowerCase().includes('tactical') ||
                    cardTitle.toLowerCase().includes('current formation')) {
                    
                    this.enhanceFormationCard(card);
                }
            });
        },

        enhanceFormationCard(card) {
            console.log('⚽ Enhancing formation card with interactive pitch...');
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.innerHTML = this.createInteractiveFormationContent();
                
                // Initialize interactive features
                setTimeout(() => {
                    this.initializeFormationInteractivity(cardBody);
                }, 100);
            }
        },

        createInteractiveFormationContent() {
            return `
                <div class="formation-widget">
                    <div class="formation-header">
                        <div class="formation-selector">
                            <select class="formation-dropdown">
                                <option value="4-2-3-1" selected>4-2-3-1</option>
                                <option value="4-3-3">4-3-3</option>
                                <option value="3-5-2">3-5-2</option>
                                <option value="4-4-2">4-4-2</option>
                                <option value="5-3-2">5-3-2</option>
                            </select>
                        </div>
                        <div class="formation-stats">
                            <span class="formation-familiarity">95% Familiar</span>
                            <span class="formation-effectiveness">High Effectiveness</span>
                        </div>
                    </div>
                    
                    <div class="interactive-pitch">
                        <div class="pitch-background"></div>
                        <div class="player-positions">
                            <!-- Goalkeeper -->
                            <div class="player-position gk" data-position="GK" style="left: 50%; top: 85%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Onana</span>
                                    <span class="player-rating">7.4</span>
                                </div>
                            </div>
                            
                            <!-- Defense -->
                            <div class="player-position def" data-position="LB" style="left: 15%; top: 65%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Shaw</span>
                                    <span class="player-rating">7.3</span>
                                </div>
                            </div>
                            <div class="player-position def" data-position="CB" style="left: 35%; top: 70%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Martinez</span>
                                    <span class="player-rating">7.6</span>
                                </div>
                            </div>
                            <div class="player-position def" data-position="CB" style="left: 65%; top: 70%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Varane</span>
                                    <span class="player-rating">7.5</span>
                                </div>
                            </div>
                            <div class="player-position def" data-position="RB" style="left: 85%; top: 65%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Dalot</span>
                                    <span class="player-rating">7.2</span>
                                </div>
                            </div>
                            
                            <!-- Midfield -->
                            <div class="player-position mid" data-position="DM" style="left: 30%; top: 45%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Casemiro</span>
                                    <span class="player-rating">7.5</span>
                                </div>
                            </div>
                            <div class="player-position mid" data-position="CM" style="left: 70%; top: 45%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Mainoo</span>
                                    <span class="player-rating">7.3</span>
                                </div>
                            </div>
                            
                            <!-- Attack -->
                            <div class="player-position att" data-position="LW" style="left: 15%; top: 25%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Rashford</span>
                                    <span class="player-rating">7.8</span>
                                </div>
                            </div>
                            <div class="player-position att" data-position="AM" style="left: 50%; top: 30%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Bruno (C)</span>
                                    <span class="player-rating">8.2</span>
                                </div>
                            </div>
                            <div class="player-position att" data-position="RW" style="left: 85%; top: 25%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Garnacho</span>
                                    <span class="player-rating">7.4</span>
                                </div>
                            </div>
                            
                            <!-- Striker -->
                            <div class="player-position str" data-position="ST" style="left: 50%; top: 10%;" draggable="true">
                                <div class="player-circle">
                                    <span class="player-name">Højlund</span>
                                    <span class="player-rating">7.2</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="formation-analysis">
                            <div class="analysis-metrics">
                                <div class="metric">
                                    <span class="metric-name">Width</span>
                                    <div class="metric-bar">
                                        <div class="metric-fill" style="width: 75%;"></div>
                                    </div>
                                    <span class="metric-value">75</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-name">Compactness</span>
                                    <div class="metric-bar">
                                        <div class="metric-fill" style="width: 82%;"></div>
                                    </div>
                                    <span class="metric-value">82</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-name">Balance</span>
                                    <div class="metric-bar">
                                        <div class="metric-fill" style="width: 88%;"></div>
                                    </div>
                                    <span class="metric-value">88</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        initializeFormationInteractivity(container) {
            console.log('⚽ Initializing formation interactivity...');
            
            const playerPositions = container.querySelectorAll('.player-position');
            const formationDropdown = container.querySelector('.formation-dropdown');
            
            // Make players draggable
            playerPositions.forEach(player => {
                this.makePlayerDraggable(player);
            });
            
            // Formation switching
            if (formationDropdown) {
                formationDropdown.addEventListener('change', (e) => {
                    this.switchFormation(container, e.target.value);
                });
            }
            
            console.log('✅ Formation interactivity initialized');
        },

        makePlayerDraggable(player) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;
            
            player.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = player.getBoundingClientRect();
                const parentRect = player.parentElement.getBoundingClientRect();
                startLeft = ((rect.left - parentRect.left) / parentRect.width) * 100;
                startTop = ((rect.top - parentRect.top) / parentRect.height) * 100;
                
                player.classList.add('dragging');
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const parentRect = player.parentElement.getBoundingClientRect();
                
                const newLeft = startLeft + (deltaX / parentRect.width) * 100;
                const newTop = startTop + (deltaY / parentRect.height) * 100;
                
                // Constrain to pitch boundaries
                const constrainedLeft = Math.max(5, Math.min(95, newLeft));
                const constrainedTop = Math.max(5, Math.min(95, newTop));
                
                player.style.left = constrainedLeft + '%';
                player.style.top = constrainedTop + '%';
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    player.classList.remove('dragging');
                    this.updateFormationAnalysis(player.closest('.formation-widget'));
                }
            });
        },

        switchFormation(container, formation) {
            console.log(`⚽ Switching to ${formation} formation...`);
            
            const formations = {
                '4-2-3-1': {
                    'GK': { left: 50, top: 85 },
                    'LB': { left: 15, top: 65 }, 'CB': { left: 35, top: 70 }, 'CB2': { left: 65, top: 70 }, 'RB': { left: 85, top: 65 },
                    'DM': { left: 30, top: 45 }, 'CM': { left: 70, top: 45 },
                    'LW': { left: 15, top: 25 }, 'AM': { left: 50, top: 30 }, 'RW': { left: 85, top: 25 },
                    'ST': { left: 50, top: 10 }
                },
                '4-3-3': {
                    'GK': { left: 50, top: 85 },
                    'LB': { left: 15, top: 65 }, 'CB': { left: 35, top: 70 }, 'CB2': { left: 65, top: 70 }, 'RB': { left: 85, top: 65 },
                    'CM': { left: 30, top: 45 }, 'CM2': { left: 50, top: 40 }, 'CM3': { left: 70, top: 45 },
                    'LW': { left: 20, top: 15 }, 'ST': { left: 50, top: 10 }, 'RW': { left: 80, top: 15 }
                }
            };
            
            const formationData = formations[formation];
            if (formationData) {
                const players = container.querySelectorAll('.player-position');
                const positions = Object.keys(formationData);
                
                players.forEach((player, index) => {
                    if (positions[index]) {
                        const pos = formationData[positions[index]];
                        player.style.left = pos.left + '%';
                        player.style.top = pos.top + '%';
                        player.classList.add('formation-transition');
                        
                        setTimeout(() => {
                            player.classList.remove('formation-transition');
                        }, 500);
                    }
                });
                
                this.updateFormationAnalysis(container);
            }
        },

        updateFormationAnalysis(container) {
            // Calculate formation metrics based on player positions
            const players = container.querySelectorAll('.player-position');
            const metrics = this.calculateFormationMetrics(players);
            
            // Update the metric bars
            const metricBars = container.querySelectorAll('.metric-fill');
            const metricValues = container.querySelectorAll('.metric-value');
            
            if (metricBars[0]) {
                metricBars[0].style.width = metrics.width + '%';
                metricValues[0].textContent = metrics.width;
            }
            if (metricBars[1]) {
                metricBars[1].style.width = metrics.compactness + '%';
                metricValues[1].textContent = metrics.compactness;
            }
            if (metricBars[2]) {
                metricBars[2].style.width = metrics.balance + '%';
                metricValues[2].textContent = metrics.balance;
            }
        },

        calculateFormationMetrics(players) {
            // Calculate width based on player spread
            let leftmost = 100, rightmost = 0;
            players.forEach(player => {
                const left = parseFloat(player.style.left);
                leftmost = Math.min(leftmost, left);
                rightmost = Math.max(rightmost, left);
            });
            const width = Math.min(100, Math.max(50, rightmost - leftmost + 20));
            
            // Calculate compactness based on average distance between players
            let totalDistance = 0;
            let comparisons = 0;
            for (let i = 0; i < players.length; i++) {
                for (let j = i + 1; j < players.length; j++) {
                    const player1 = players[i];
                    const player2 = players[j];
                    const x1 = parseFloat(player1.style.left);
                    const y1 = parseFloat(player1.style.top);
                    const x2 = parseFloat(player2.style.left);
                    const y2 = parseFloat(player2.style.top);
                    
                    const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
                    totalDistance += distance;
                    comparisons++;
                }
            }
            const avgDistance = totalDistance / comparisons;
            const compactness = Math.max(0, Math.min(100, 100 - (avgDistance / 2)));
            
            // Calculate balance based on symmetry
            const leftSide = Array.from(players).filter(p => parseFloat(p.style.left) < 50).length;
            const rightSide = Array.from(players).filter(p => parseFloat(p.style.left) > 50).length;
            const balance = Math.max(0, 100 - Math.abs(leftSide - rightSide) * 10);
            
            return {
                width: Math.round(width),
                compactness: Math.round(compactness),
                balance: Math.round(balance)
            };
        },

        addTacticalStyles() {
            const tacticalCSS = `
                /* Tactical Formation Widget Styles */
                .formation-widget {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .formation-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .formation-dropdown {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                }
                
                .formation-dropdown:focus {
                    outline: none;
                    border-color: var(--primary-400);
                    box-shadow: 0 0 0 2px rgba(0, 148, 204, 0.2);
                }
                
                .formation-stats {
                    display: flex;
                    gap: 12px;
                    font-size: 10px;
                }
                
                .formation-familiarity {
                    color: #00ff88;
                    font-weight: 600;
                }
                
                .formation-effectiveness {
                    color: #ffb800;
                    font-weight: 600;
                }
                
                .interactive-pitch {
                    flex: 1;
                    position: relative;
                    background: linear-gradient(to top, #1a3d1a 0%, #2d5a2d 50%, #1a3d1a 100%);
                    border-radius: 8px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    min-height: 200px;
                }
                
                .pitch-background {
                    position: absolute;
                    inset: 0;
                    background: 
                        /* Center circle */
                        radial-gradient(circle at 50% 50%, transparent 20px, rgba(255,255,255,0.1) 21px, rgba(255,255,255,0.1) 22px, transparent 23px),
                        /* Penalty boxes */
                        linear-gradient(to bottom, 
                            transparent 0%, transparent 15%, 
                            rgba(255,255,255,0.05) 15%, rgba(255,255,255,0.05) 25%, transparent 25%,
                            transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05) 85%, transparent 85%);
                    pointer-events: none;
                }
                
                .player-position {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    cursor: move;
                    z-index: 10;
                    transition: all 0.2s ease;
                }
                
                .player-position.dragging {
                    z-index: 20;
                    transform: translate(-50%, -50%) scale(1.1);
                }
                
                .player-position.formation-transition {
                    transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .player-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 6px;
                    font-weight: 600;
                    color: white;
                    text-align: center;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                }
                
                .player-position:hover .player-circle {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
                }
                
                .player-position.gk .player-circle {
                    background: linear-gradient(135deg, #ff6b35, #e55039);
                }
                
                .player-position.def .player-circle {
                    background: linear-gradient(135deg, #0094cc, #006ba6);
                }
                
                .player-position.mid .player-circle {
                    background: linear-gradient(135deg, #00ff88, #00d68f);
                }
                
                .player-position.att .player-circle {
                    background: linear-gradient(135deg, #ffb800, #f39c12);
                }
                
                .player-position.str .player-circle {
                    background: linear-gradient(135deg, #ff4757, #c44569);
                }
                
                .player-name {
                    font-size: 5px;
                    line-height: 1;
                    margin-bottom: 1px;
                }
                
                .player-rating {
                    font-size: 4px;
                    opacity: 0.9;
                    line-height: 1;
                }
                
                .formation-analysis {
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .analysis-metrics {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                
                .metric {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 9px;
                }
                
                .metric-name {
                    width: 60px;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .metric-bar {
                    flex: 1;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                }
                
                .metric-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #0094cc, #00ff88);
                    transition: width 0.3s ease;
                }
                
                .metric-value {
                    width: 20px;
                    text-align: right;
                    color: white;
                    font-weight: 600;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'tactical-formation-styles';
            style.textContent = tacticalCSS;
            document.head.appendChild(style);
            
            console.log('✅ Tactical formation styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => TacticalFormationWidget.init(), 300);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => TacticalFormationWidget.init(), 300);
        });
    }

    // Make available globally
    window.TacticalFormationWidget = TacticalFormationWidget;

})();