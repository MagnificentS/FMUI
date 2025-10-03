/**
 * RICH VISUAL ENHANCEMENT SYSTEM
 * Implementing Research-Docs findings with v19.html styling and ZENITH principles
 * Mathematical precision foundation + spatial innovation synthesis
 */

(function() {
    'use strict';

    console.log('🎨 RICH VISUAL ENHANCEMENT: Implementing Research-Docs mathematical precision + spatial innovation...');

    const RichVisualEnhancement = {
        // Mathematical constants from Research-Docs
        PHI: 1.618033988749,
        FIBONACCI: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
        BASE_UNIT: 8,

        // Color system from Research-Docs emotional mapping
        gameStates: {
            safe: { h: 130, s: 35, v: 75 },      // Soft greens
            tension: { h: 40, s: 65, v: 85 },    // Warning ambers  
            danger: { h: 8, s: 80, v: 80 },      // Blood reds
            mystery: { h: 260, s: 50, v: 40 },   // Deep purples
            triumph: { h: 50, s: 90, v: 95 }     // Victory golds
        },

        init() {
            console.log('🎨 VISUAL ENHANCEMENT: Starting mathematical foundation implementation...');
            
            this.implementMathematicalFoundation();
            this.enhanceVisualHierarchy();
            this.addInteractivePhysics();
            this.implementZenithTimingSystem();
            
            console.log('✅ RICH VISUAL ENHANCEMENT: Mathematical precision + spatial innovation ready');
        },

        implementMathematicalFoundation() {
            console.log('📐 Implementing golden ratio and fibonacci spacing...');
            
            // Add mathematical CSS properties based on Research-Docs
            const mathematicalCSS = `
                :root {
                    /* Mathematical Constants from Research-Docs */
                    --phi: 1.618033988749;
                    --fibonacci-8: 8px;
                    --fibonacci-13: 13px;
                    --fibonacci-21: 21px;
                    --fibonacci-34: 34px;
                    --fibonacci-55: 55px;
                    --fibonacci-89: 89px;
                    
                    /* Golden Ratio Proportions */
                    --golden-width-1: 350px;     /* 1 unit */
                    --golden-width-phi: 567px;   /* φ × 350 */
                    --golden-width-2phi: 1134px; /* 2φ × 350 */
                    
                    /* ZENITH Color Harmony with v19.html Integration */
                    --safe-color: hsl(130, 35%, 75%);
                    --tension-color: hsl(40, 65%, 85%);
                    --danger-color: hsl(8, 80%, 80%);
                    --mystery-color: hsl(260, 50%, 40%);
                    --triumph-color: hsl(50, 90%, 95%);
                    
                    /* Enhanced v19.html colors with harmonic relationships */
                    --primary-harmonic-1: #003d52;
                    --primary-harmonic-2: #005a7a;
                    --primary-harmonic-3: #0077a3;
                    --primary-harmonic-4: #0094cc;
                    --primary-harmonic-5: #00b3ff;
                    
                    /* Professional shadows with golden ratio scaling */
                    --shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.12);
                    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);
                    --shadow-md: 0 4px 21px rgba(0, 0, 0, 0.18);
                    --shadow-lg: 0 8px 55px rgba(0, 0, 0, 0.21);
                    --shadow-xl: 0 13px 89px rgba(0, 0, 0, 0.24);
                }
                
                /* Mathematical Card Enhancement */
                .card {
                    /* Golden ratio proportions */
                    min-width: calc(var(--fibonacci-89) * 4);
                    border-radius: var(--fibonacci-8);
                    box-shadow: var(--shadow-md);
                    transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                
                .card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary-400), transparent);
                    opacity: 0;
                    transition: opacity 300ms ease;
                }
                
                .card:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: var(--shadow-lg);
                }
                
                .card:hover::before {
                    opacity: 1;
                }
                
                /* Enhanced Card Headers with Mathematical Typography */
                .card-header {
                    background: linear-gradient(135deg, 
                        rgba(0, 148, 204, 0.15) 0%, 
                        rgba(0, 148, 204, 0.05) 100%);
                    border-bottom: 1px solid rgba(0, 148, 204, 0.2);
                    padding: var(--fibonacci-13) var(--fibonacci-21);
                    height: calc(var(--fibonacci-34) + var(--fibonacci-8));
                }
                
                .card-header span {
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    color: var(--primary-harmonic-4);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    line-height: calc(var(--font-size-sm) * 1.5);
                }
                
                /* Enhanced Card Bodies with Information Hierarchy */
                .card-body {
                    padding: var(--fibonacci-21);
                    background: linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.02) 0%, 
                        transparent 100%);
                }
                
                /* Mathematical Spacing for Content */
                .stat-row, .metric, .analysis-item {
                    margin-bottom: var(--fibonacci-13);
                    padding: var(--fibonacci-8) 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .stat-label, .metric-label {
                    font-size: var(--font-size-xs);
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }
                
                .stat-value, .metric-value {
                    font-size: var(--font-size-sm);
                    color: white;
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'mathematical-foundation-styles';
            style.textContent = mathematicalCSS;
            document.head.appendChild(style);
            
            console.log('✅ Mathematical foundation styles implemented');
        },

        enhanceVisualHierarchy() {
            console.log('🎯 Enhancing visual hierarchy with Research-Docs principles...');
            
            // Enhance existing cards with proper information hierarchy
            setTimeout(() => {
                document.querySelectorAll('.card').forEach(card => {
                    this.enhanceCardInformationHierarchy(card);
                });
            }, 200);
        },

        enhanceCardInformationHierarchy(card) {
            const cardBody = card.querySelector('.card-body');
            if (!cardBody) return;
            
            // Find and enhance content based on card type
            const cardTitle = card.querySelector('.card-header span')?.textContent || '';
            
            if (cardTitle.includes('Formation') || cardTitle.includes('Interactive Formation')) {
                this.enhanceFormationCardHierarchy(cardBody);
            } else if (cardTitle.includes('Set Piece') || cardTitle.includes('Designer')) {
                this.enhanceSetPieceCardHierarchy(cardBody);
            } else {
                this.enhanceGenericCardHierarchy(cardBody);
            }
        },

        enhanceFormationCardHierarchy(cardBody) {
            // Add mathematical enhancements to formation cards
            const formationWidget = cardBody.querySelector('.formation-widget');
            if (formationWidget) {
                // Add sophisticated formation analysis
                const analysisSection = formationWidget.querySelector('.formation-analysis');
                if (analysisSection) {
                    analysisSection.innerHTML = `
                        <div class="mathematical-analysis">
                            <div class="analysis-title">Tactical Analysis</div>
                            <div class="metrics-grid">
                                <div class="metric-group">
                                    <div class="metric">
                                        <span class="metric-icon">📐</span>
                                        <span class="metric-name">Width</span>
                                        <div class="metric-bar">
                                            <div class="metric-fill" style="width: 75%; background: var(--triumph-color);"></div>
                                        </div>
                                        <span class="metric-value">75</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-icon">🎯</span>
                                        <span class="metric-name">Compactness</span>
                                        <div class="metric-bar">
                                            <div class="metric-fill" style="width: 82%; background: var(--safe-color);"></div>
                                        </div>
                                        <span class="metric-value">82</span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-icon">⚖️</span>
                                        <span class="metric-name">Balance</span>
                                        <div class="metric-bar">
                                            <div class="metric-fill" style="width: 88%; background: var(--safe-color);"></div>
                                        </div>
                                        <span class="metric-value">88</span>
                                    </div>
                                </div>
                                <div class="tactical-insights">
                                    <div class="insight strength">
                                        <span class="insight-icon">✅</span>
                                        <span class="insight-text">Excellent defensive stability</span>
                                    </div>
                                    <div class="insight improvement">
                                        <span class="insight-icon">📈</span>
                                        <span class="insight-text">Can improve width in attack</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        },

        enhanceSetPieceCardHierarchy(cardBody) {
            // Add sophisticated set piece analysis
            const setPieceWidget = cardBody.querySelector('.setpiece-designer');
            if (setPieceWidget) {
                const analysisSection = setPieceWidget.querySelector('.setpiece-analysis');
                if (analysisSection) {
                    analysisSection.innerHTML = `
                        <div class="setpiece-mathematical-analysis">
                            <div class="analysis-title">Set Piece Analytics</div>
                            <div class="threat-assessment">
                                <div class="threat-zone high-threat">
                                    <span class="zone-icon">🔥</span>
                                    <span class="zone-name">Near Post</span>
                                    <div class="threat-bar">
                                        <div class="threat-fill" style="width: 85%; background: var(--danger-color);"></div>
                                    </div>
                                    <span class="threat-percentage">85%</span>
                                </div>
                                <div class="threat-zone medium-threat">
                                    <span class="zone-icon">⚠️</span>
                                    <span class="zone-name">Central</span>
                                    <div class="threat-bar">
                                        <div class="threat-fill" style="width: 65%; background: var(--tension-color);"></div>
                                    </div>
                                    <span class="threat-percentage">65%</span>
                                </div>
                                <div class="threat-zone high-threat">
                                    <span class="zone-icon">🎯</span>
                                    <span class="zone-name">Far Post</span>
                                    <div class="threat-bar">
                                        <div class="threat-fill" style="width: 78%; background: var(--danger-color);"></div>
                                    </div>
                                    <span class="threat-percentage">78%</span>
                                </div>
                            </div>
                            <div class="probability-analysis">
                                <div class="prob-metric">
                                    <span class="prob-label">Shot Probability</span>
                                    <span class="prob-value triumph">65%</span>
                                </div>
                                <div class="prob-metric">
                                    <span class="prob-label">Goal Probability</span>
                                    <span class="prob-value safe">18%</span>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        },

        enhanceGenericCardHierarchy(cardBody) {
            // Enhance content with proper information hierarchy
            const content = cardBody.innerHTML;
            
            // Check if it's basic content that needs enhancement
            if (content.includes('<br>')) {
                const lines = content.split('<br>');
                let enhancedContent = '<div class="enhanced-content">';
                
                lines.forEach((line, index) => {
                    if (line.trim()) {
                        const hierarchy = index === 0 ? 'primary' : (index === 1 ? 'secondary' : 'tertiary');
                        enhancedContent += `
                            <div class="content-item ${hierarchy}">
                                <div class="item-content">${line.trim()}</div>
                                ${index === 0 ? '<div class="primary-indicator"></div>' : ''}
                            </div>
                        `;
                    }
                });
                
                enhancedContent += '</div>';
                cardBody.innerHTML = enhancedContent;
            }
        },

        addInteractivePhysics() {
            console.log('⚡ Adding interactive physics to formation and set piece widgets...');
            
            // Add physics to player positions
            setTimeout(() => {
                this.makePlayersPhysicallyInteractive();
            }, 300);
        },

        makePlayersPhysicallyInteractive() {
            const players = document.querySelectorAll('.player-position, .setpiece-player');
            
            players.forEach(player => {
                this.addPhysicsToPlayer(player);
            });
            
            console.log(`✅ Added physics to ${players.length} players`);
        },

        addPhysicsToPlayer(player) {
            let isDragging = false;
            let physics = {
                velocity: { x: 0, y: 0 },
                spring: 0.15,
                friction: 0.85,
                snapDistance: 20
            };

            player.style.transition = 'none';
            player.style.cursor = 'grab';

            player.addEventListener('mousedown', (e) => {
                isDragging = true;
                player.style.cursor = 'grabbing';
                player.classList.add('dragging-physics');
                
                // Add visual feedback
                player.style.transform = 'translate(-50%, -50%) scale(1.1)';
                player.style.zIndex = '100';
                player.style.filter = 'drop-shadow(0 8px 16px rgba(0, 148, 204, 0.5))';
                
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const rect = player.parentElement.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                // Constrain to field boundaries with physics
                const constrainedX = Math.max(5, Math.min(95, x));
                const constrainedY = Math.max(5, Math.min(95, y));

                // Apply spring physics
                const targetX = constrainedX;
                const targetY = constrainedY;
                const currentX = parseFloat(player.style.left) || 50;
                const currentY = parseFloat(player.style.top) || 50;

                physics.velocity.x += (targetX - currentX) * physics.spring;
                physics.velocity.y += (targetY - currentY) * physics.spring;
                physics.velocity.x *= physics.friction;
                physics.velocity.y *= physics.friction;

                const newX = currentX + physics.velocity.x;
                const newY = currentY + physics.velocity.y;

                player.style.left = newX + '%';
                player.style.top = newY + '%';

                // Update formation analysis in real-time
                this.updateFormationMetricsRealtime(player);
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    player.style.cursor = 'grab';
                    player.classList.remove('dragging-physics');
                    
                    // Restore normal state with spring animation
                    player.style.transform = 'translate(-50%, -50%) scale(1)';
                    player.style.zIndex = '';
                    player.style.filter = '';
                    player.style.transition = 'all 200ms cubic-bezier(0.4, 0.0, 0.1, 1)';
                    
                    // Final position validation and snapping
                    this.snapToOptimalPosition(player);
                }
            });
        },

        updateFormationMetricsRealtime(player) {
            const formationWidget = player.closest('.formation-widget');
            if (formationWidget) {
                const players = formationWidget.querySelectorAll('.player-position');
                const metrics = this.calculateAdvancedFormationMetrics(players);
                
                // Update metric bars with smooth animation
                const metricBars = formationWidget.querySelectorAll('.metric-fill');
                if (metricBars[0]) {
                    metricBars[0].style.width = metrics.width + '%';
                    metricBars[0].parentElement.nextElementSibling.textContent = metrics.width;
                }
                if (metricBars[1]) {
                    metricBars[1].style.width = metrics.compactness + '%';
                    metricBars[1].parentElement.nextElementSibling.textContent = metrics.compactness;
                }
                if (metricBars[2]) {
                    metricBars[2].style.width = metrics.balance + '%';
                    metricBars[2].parentElement.nextElementSibling.textContent = metrics.balance;
                }
            }
        },

        calculateAdvancedFormationMetrics(players) {
            // Advanced tactical calculations based on Research-Docs
            let leftmost = 100, rightmost = 0, topmost = 100, bottommost = 0;
            let totalX = 0, totalY = 0;
            
            players.forEach(player => {
                const x = parseFloat(player.style.left) || 50;
                const y = parseFloat(player.style.top) || 50;
                
                leftmost = Math.min(leftmost, x);
                rightmost = Math.max(rightmost, x);
                topmost = Math.min(topmost, y);
                bottommost = Math.max(bottommost, y);
                totalX += x;
                totalY += y;
            });
            
            // Calculate sophisticated metrics
            const width = Math.min(100, Math.max(40, (rightmost - leftmost) * 1.2));
            const height = Math.min(100, Math.max(40, (bottommost - topmost) * 1.2));
            const compactness = Math.max(0, 100 - ((width + height) / 2 - 30));
            
            // Balance calculation using center of mass
            const centerX = totalX / players.length;
            const centerY = totalY / players.length;
            const balance = Math.max(0, 100 - Math.abs(centerX - 50) * 2);
            
            return {
                width: Math.round(width),
                compactness: Math.round(compactness),
                balance: Math.round(balance)
            };
        },

        snapToOptimalPosition(player) {
            // Snap to optimal tactical positions based on role
            const role = player.dataset.position || player.dataset.role;
            const optimalPositions = {
                'GK': { x: 50, y: 85 },
                'LB': { x: 15, y: 65 }, 'CB': { x: 35, y: 70 }, 'RB': { x: 85, y: 65 },
                'DM': { x: 30, y: 45 }, 'CM': { x: 70, y: 45 },
                'LW': { x: 15, y: 25 }, 'AM': { x: 50, y: 30 }, 'RW': { x: 85, y: 25 },
                'ST': { x: 50, y: 10 }
            };
            
            const optimal = optimalPositions[role];
            if (optimal) {
                const currentX = parseFloat(player.style.left);
                const currentY = parseFloat(player.style.top);
                const distance = Math.sqrt((currentX - optimal.x)**2 + (currentY - optimal.y)**2);
                
                // Snap if within 15% of optimal position
                if (distance < 15) {
                    player.style.left = optimal.x + '%';
                    player.style.top = optimal.y + '%';
                    player.classList.add('snapped-position');
                    setTimeout(() => player.classList.remove('snapped-position'), 500);
                }
            }
        },

        implementZenithTimingSystem() {
            console.log('⏱️ Implementing ZENITH timing system...');
            
            const zenithTimingCSS = `
                /* ZENITH Psychological Timing System */
                .zenith-instant { transition: all 0ms; }
                .zenith-primary { transition: all 16ms cubic-bezier(0.4, 0.0, 0.2, 1); }
                .zenith-secondary { transition: all 50ms cubic-bezier(0.4, 0.0, 0.1, 1); }
                .zenith-environmental { transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55); }
                
                /* Game-specific timing */
                .timing-swift { transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1); }
                .timing-human { transition: all 300ms cubic-bezier(0.4, 0.0, 0.1, 1); }
                .timing-power { transition: all 400ms cubic-bezier(0.2, 0.8, 0.3, 1.2); }
                
                /* Physics feedback */
                .dragging-physics {
                    transition: none !important;
                    filter: drop-shadow(0 8px 16px rgba(0, 148, 204, 0.5)) !important;
                }
                
                .snapped-position {
                    animation: snap-feedback 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                @keyframes snap-feedback {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.15); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
                
                /* Enhanced visual hierarchy */
                .content-item.primary {
                    font-size: var(--font-size-md);
                    font-weight: 600;
                    color: var(--primary-harmonic-4);
                    margin-bottom: var(--fibonacci-13);
                }
                
                .content-item.secondary {
                    font-size: var(--font-size-sm);
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: var(--fibonacci-8);
                }
                
                .content-item.tertiary {
                    font-size: var(--font-size-xs);
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: var(--fibonacci-8);
                }
                
                .primary-indicator {
                    width: 3px;
                    height: 100%;
                    background: var(--primary-harmonic-4);
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'zenith-timing-styles';
            style.textContent = zenithTimingCSS;
            document.head.appendChild(style);
            
            console.log('✅ ZENITH timing system implemented');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => RichVisualEnhancement.init(), 400);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => RichVisualEnhancement.init(), 400);
        });
    }

    // Make available globally
    window.RichVisualEnhancement = RichVisualEnhancement;

})();