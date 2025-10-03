/**
 * SET PIECE DESIGNER WIDGET
 * Interactive set piece designer based on Research-Docs findings
 * Professional-grade set piece visualization and planning
 */

(function() {
    'use strict';

    console.log('⚽ SET PIECE DESIGNER: Creating interactive set piece planning widget...');

    const SetPieceDesignerWidget = {
        init() {
            console.log('⚽ SET PIECE WIDGET: Initializing set piece designer...');
            
            this.enhanceSetPieceContent();
            this.addSetPieceStyles();
            
            console.log('✅ SET PIECE DESIGNER WIDGET: Ready');
        },

        enhanceSetPieceContent() {
            console.log('⚽ Enhancing set piece content with interactive designer...');
            
            setTimeout(() => {
                this.upgradeExistingSetPieceCards();
            }, 200);
        },

        upgradeExistingSetPieceCards() {
            document.querySelectorAll('.card').forEach(card => {
                const cardTitle = card.querySelector('.card-header span')?.textContent || '';
                
                if (cardTitle.toLowerCase().includes('set piece') || 
                    cardTitle.toLowerCase().includes('corners') ||
                    cardTitle.toLowerCase().includes('free kick')) {
                    
                    this.enhanceSetPieceCard(card);
                }
            });
        },

        enhanceSetPieceCard(card) {
            console.log('⚽ Enhancing set piece card with interactive designer...');
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody) {
                cardBody.innerHTML = this.createSetPieceDesignerContent();
                
                setTimeout(() => {
                    this.initializeSetPieceInteractivity(cardBody);
                }, 100);
            }
        },

        createSetPieceDesignerContent() {
            return `
                <div class="setpiece-designer">
                    <div class="setpiece-controls">
                        <div class="setpiece-type-selector">
                            <button class="setpiece-btn active" data-type="corner">Corner</button>
                            <button class="setpiece-btn" data-type="freekick">Free Kick</button>
                            <button class="setpiece-btn" data-type="throwin">Throw In</button>
                        </div>
                        <div class="setpiece-stats">
                            <span class="success-rate">Success Rate: <strong>18%</strong></span>
                            <span class="last-goal">Last Goal: 3 games ago</span>
                        </div>
                    </div>
                    
                    <div class="setpiece-pitch corner-setup">
                        <div class="pitch-section">
                            <!-- Goal and penalty area -->
                            <div class="goal-line"></div>
                            <div class="six-yard-box"></div>
                            <div class="penalty-area"></div>
                            <div class="corner-arc"></div>
                            
                            <!-- Player positions for corner -->
                            <div class="setpiece-player attacking" style="left: 85%; top: 70%;" data-role="corner-taker">
                                <span class="player-name">Bruno</span>
                                <span class="player-instruction">Taker</span>
                            </div>
                            
                            <div class="setpiece-player attacking" style="left: 60%; top: 40%;" data-role="near-post">
                                <span class="player-name">Martinez</span>
                                <span class="player-instruction">Near Post</span>
                            </div>
                            
                            <div class="setpiece-player attacking" style="left: 45%; top: 35%;" data-role="central">
                                <span class="player-name">Varane</span>
                                <span class="player-instruction">Central</span>
                            </div>
                            
                            <div class="setpiece-player attacking" style="left: 30%; top: 45%;" data-role="far-post">
                                <span class="player-name">Casemiro</span>
                                <span class="player-instruction">Far Post</span>
                            </div>
                            
                            <div class="setpiece-player attacking" style="left: 75%; top: 55%;" data-role="edge-box">
                                <span class="player-name">Bruno</span>
                                <span class="player-instruction">Edge</span>
                            </div>
                            
                            <div class="setpiece-player defending" style="left: 50%; top: 20%;" data-role="goalkeeper">
                                <span class="player-name">Keeper</span>
                                <span class="player-instruction">Goal</span>
                            </div>
                            
                            <!-- Movement arrows -->
                            <div class="movement-arrow" style="left: 85%; top: 70%;">
                                <svg width="40" height="20" viewBox="0 0 40 20">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                                refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#00ff88"/>
                                        </marker>
                                    </defs>
                                    <line x1="5" y1="10" x2="35" y2="10" stroke="#00ff88" stroke-width="2" marker-end="url(#arrowhead)"/>
                                </svg>
                            </div>
                        </div>
                        
                        <div class="setpiece-analysis">
                            <div class="analysis-header">Set Piece Analysis</div>
                            <div class="threat-zones">
                                <div class="zone near-post">
                                    <span class="zone-label">Near Post</span>
                                    <span class="zone-threat">High</span>
                                </div>
                                <div class="zone central">
                                    <span class="zone-label">Central</span>
                                    <span class="zone-threat">Medium</span>
                                </div>
                                <div class="zone far-post">
                                    <span class="zone-label">Far Post</span>
                                    <span class="zone-threat">High</span>
                                </div>
                            </div>
                            
                            <div class="setpiece-effectiveness">
                                <div class="effectiveness-metric">
                                    <span class="metric-label">Shot Probability</span>
                                    <div class="probability-bar">
                                        <div class="probability-fill" style="width: 65%;"></div>
                                    </div>
                                    <span class="metric-percent">65%</span>
                                </div>
                                <div class="effectiveness-metric">
                                    <span class="metric-label">Goal Probability</span>
                                    <div class="probability-bar">
                                        <div class="probability-fill" style="width: 18%;"></div>
                                    </div>
                                    <span class="metric-percent">18%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        initializeSetPieceInteractivity(container) {
            console.log('⚽ Initializing set piece interactivity...');
            
            const typeButtons = container.querySelectorAll('.setpiece-btn');
            const players = container.querySelectorAll('.setpiece-player');
            
            // Set piece type switching
            typeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.switchSetPieceType(container, button.dataset.type);
                    
                    // Update active state
                    typeButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                });
            });
            
            // Make players draggable
            players.forEach(player => {
                this.makeSetPiecePlayerDraggable(player, container);
            });
            
            console.log('✅ Set piece interactivity initialized');
        },

        switchSetPieceType(container, type) {
            console.log(`⚽ Switching to ${type} setup...`);
            
            const pitch = container.querySelector('.setpiece-pitch');
            
            // Remove existing type classes
            pitch.classList.remove('corner-setup', 'freekick-setup', 'throwin-setup');
            pitch.classList.add(`${type}-setup`);
            
            // Update player positions based on set piece type
            const setups = {
                corner: {
                    positions: [
                        { role: 'corner-taker', left: 85, top: 70 },
                        { role: 'near-post', left: 60, top: 40 },
                        { role: 'central', left: 45, top: 35 },
                        { role: 'far-post', left: 30, top: 45 },
                        { role: 'edge-box', left: 75, top: 55 }
                    ]
                },
                freekick: {
                    positions: [
                        { role: 'taker', left: 50, top: 65 },
                        { role: 'wall-jumper', left: 40, top: 45 },
                        { role: 'runner', left: 60, top: 45 },
                        { role: 'target', left: 50, top: 25 },
                        { role: 'support', left: 70, top: 55 }
                    ]
                },
                throwin: {
                    positions: [
                        { role: 'thrower', left: 5, top: 50 },
                        { role: 'short-option', left: 20, top: 40 },
                        { role: 'long-target', left: 60, top: 30 },
                        { role: 'support', left: 40, top: 60 },
                        { role: 'cover', left: 25, top: 70 }
                    ]
                }
            };
            
            const setup = setups[type];
            if (setup) {
                const players = container.querySelectorAll('.setpiece-player.attacking');
                setup.positions.forEach((pos, index) => {
                    if (players[index]) {
                        players[index].style.left = pos.left + '%';
                        players[index].style.top = pos.top + '%';
                        players[index].dataset.role = pos.role;
                        players[index].classList.add('setpiece-transition');
                        
                        setTimeout(() => {
                            players[index].classList.remove('setpiece-transition');
                        }, 500);
                    }
                });
                
                this.updateSetPieceAnalysis(container, type);
            }
        },

        makeSetPiecePlayerDraggable(player, container) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;
            
            player.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = player.getBoundingClientRect();
                const parentRect = player.closest('.setpiece-pitch').getBoundingClientRect();
                startLeft = ((rect.left - parentRect.left) / parentRect.width) * 100;
                startTop = ((rect.top - parentRect.top) / parentRect.height) * 100;
                
                player.classList.add('dragging');
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const parentRect = player.closest('.setpiece-pitch').getBoundingClientRect();
                
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
                    this.updateSetPieceAnalysis(container, 'corner');
                }
            });
        },

        updateSetPieceAnalysis(container, type) {
            // Calculate set piece effectiveness based on player positions
            const attackingPlayers = container.querySelectorAll('.setpiece-player.attacking');
            const analysis = this.calculateSetPieceEffectiveness(attackingPlayers, type);
            
            // Update probability bars
            const shotBar = container.querySelector('.probability-fill');
            const goalBar = container.querySelectorAll('.probability-fill')[1];
            const shotPercent = container.querySelector('.metric-percent');
            const goalPercent = container.querySelectorAll('.metric-percent')[1];
            
            if (shotBar && shotPercent) {
                shotBar.style.width = analysis.shotProbability + '%';
                shotPercent.textContent = analysis.shotProbability + '%';
            }
            
            if (goalBar && goalPercent) {
                goalBar.style.width = analysis.goalProbability + '%';
                goalPercent.textContent = analysis.goalProbability + '%';
            }
        },

        calculateSetPieceEffectiveness(players, type) {
            // Calculate effectiveness based on player positioning
            let shotProbability = 50; // Base probability
            let goalProbability = 15; // Base probability
            
            // Analyze player positions for tactical advantage
            const centerX = 50;
            const goalY = 20;
            
            Array.from(players).forEach(player => {
                const x = parseFloat(player.style.left);
                const y = parseFloat(player.style.top);
                
                // Distance to goal affects probability
                const distanceToGoal = Math.sqrt((x - centerX)**2 + (y - goalY)**2);
                
                if (distanceToGoal < 30) {
                    shotProbability += 5;
                    goalProbability += 2;
                } else if (distanceToGoal > 50) {
                    shotProbability -= 3;
                    goalProbability -= 1;
                }
                
                // Central positions are more effective
                if (x > 40 && x < 60) {
                    shotProbability += 3;
                    goalProbability += 1;
                }
            });
            
            return {
                shotProbability: Math.max(0, Math.min(100, Math.round(shotProbability))),
                goalProbability: Math.max(0, Math.min(100, Math.round(goalProbability)))
            };
        },

        addSetPieceStyles() {
            const setPieceCSS = `
                /* Set Piece Designer Styles */
                .setpiece-designer {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .setpiece-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .setpiece-type-selector {
                    display: flex;
                    gap: 4px;
                }
                
                .setpiece-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .setpiece-btn:hover {
                    background: rgba(0, 148, 204, 0.2);
                    color: white;
                }
                
                .setpiece-btn.active {
                    background: var(--primary-400);
                    color: white;
                    border-color: var(--primary-400);
                }
                
                .setpiece-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    font-size: 8px;
                }
                
                .success-rate {
                    color: #00ff88;
                }
                
                .last-goal {
                    color: rgba(255, 255, 255, 0.6);
                }
                
                .setpiece-pitch {
                    flex: 1;
                    position: relative;
                    background: linear-gradient(to top, #1a3d1a 0%, #2d5a2d 100%);
                    border-radius: 6px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    min-height: 160px;
                    overflow: hidden;
                }
                
                .pitch-section {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
                
                /* Pitch markings */
                .goal-line {
                    position: absolute;
                    bottom: 5%;
                    left: 35%;
                    width: 30%;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.6);
                }
                
                .six-yard-box {
                    position: absolute;
                    bottom: 5%;
                    left: 42%;
                    width: 16%;
                    height: 15%;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-bottom: none;
                }
                
                .penalty-area {
                    position: absolute;
                    bottom: 5%;
                    left: 30%;
                    width: 40%;
                    height: 35%;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-bottom: none;
                }
                
                .corner-arc {
                    position: absolute;
                    bottom: 5%;
                    right: 5%;
                    width: 20px;
                    height: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 50%;
                    border-left: none;
                    border-bottom: none;
                }
                
                .setpiece-player {
                    position: absolute;
                    transform: translate(-50%, -50%);
                    cursor: move;
                    z-index: 10;
                    transition: all 0.2s ease;
                }
                
                .setpiece-player.attacking {
                    width: 28px;
                    height: 28px;
                    background: linear-gradient(135deg, #0094cc, #006ba6);
                    border: 2px solid white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .setpiece-player.defending {
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #ff4757, #c44569);
                    border: 1px solid white;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .setpiece-player.dragging {
                    z-index: 20;
                    transform: translate(-50%, -50%) scale(1.2);
                    box-shadow: 0 4px 16px rgba(0, 148, 204, 0.5);
                }
                
                .setpiece-player.setpiece-transition {
                    transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .setpiece-player .player-name {
                    font-size: 4px;
                    font-weight: 600;
                    color: white;
                    line-height: 1;
                    margin-bottom: 1px;
                }
                
                .setpiece-player .player-instruction {
                    font-size: 3px;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1;
                }
                
                .movement-arrow {
                    position: absolute;
                    pointer-events: none;
                    z-index: 5;
                }
                
                .setpiece-analysis {
                    margin-top: 8px;
                    padding-top: 6px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .analysis-header {
                    font-size: 9px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 6px;
                }
                
                .threat-zones {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                
                .zone {
                    flex: 1;
                    text-align: center;
                    padding: 3px;
                    border-radius: 3px;
                    background: rgba(0, 0, 0, 0.2);
                }
                
                .zone-label {
                    display: block;
                    font-size: 7px;
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 2px;
                }
                
                .zone-threat {
                    font-size: 7px;
                    font-weight: 600;
                }
                
                .zone.near-post .zone-threat,
                .zone.far-post .zone-threat {
                    color: #ff4757;
                }
                
                .zone.central .zone-threat {
                    color: #ffb800;
                }
                
                .setpiece-effectiveness {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .effectiveness-metric {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 8px;
                }
                
                .metric-label {
                    width: 50px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 7px;
                }
                
                .probability-bar {
                    flex: 1;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .probability-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #ff4757, #ffb800, #00ff88);
                    transition: width 0.3s ease;
                }
                
                .metric-percent {
                    width: 25px;
                    text-align: right;
                    color: white;
                    font-weight: 600;
                    font-size: 7px;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'setpiece-designer-styles';
            style.textContent = setPieceCSS;
            document.head.appendChild(style);
            
            console.log('✅ Set piece designer styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => SetPieceDesignerWidget.init(), 400);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => SetPieceDesignerWidget.init(), 400);
        });
    }

    // Make available globally
    window.SetPieceDesignerWidget = SetPieceDesignerWidget;

})();