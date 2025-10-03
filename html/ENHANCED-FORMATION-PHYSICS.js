/**
 * ENHANCED FORMATION PHYSICS SYSTEM
 * Professional-grade interactive formation designer with real physics
 * Based on Research-Docs spatial innovation and ZENITH interaction principles
 */

(function() {
    'use strict';

    console.log('⚽ ENHANCED FORMATION PHYSICS: Creating professional interactive formation system...');

    const EnhancedFormationPhysics = {
        // Physics constants based on Research-Docs optimization
        SPRING_STRENGTH: 0.15,
        FRICTION: 0.85,
        SNAP_THRESHOLD: 15,
        ANIMATION_DURATION: 300,

        init() {
            console.log('⚽ FORMATION PHYSICS: Implementing professional interaction system...');
            
            this.enhanceFormationInteractivity();
            this.addAdvancedPhysicsStyles();
            
            console.log('✅ ENHANCED FORMATION PHYSICS: Ready');
        },

        enhanceFormationInteractivity() {
            console.log('⚽ Enhancing formation interactivity with professional physics...');
            
            setTimeout(() => {
                this.upgradeFormationWidgets();
            }, 400);
        },

        upgradeFormationWidgets() {
            // Find formation widgets and enhance them
            document.querySelectorAll('.formation-widget, .interactive-pitch').forEach(widget => {
                this.addProfessionalPhysicsToFormation(widget);
            });
        },

        addProfessionalPhysicsToFormation(widget) {
            console.log('⚽ Adding professional physics to formation widget...');
            
            const players = widget.querySelectorAll('.player-position, .player-circle');
            players.forEach(player => {
                this.addAdvancedPhysics(player, widget);
            });
            
            // Add formation switching with smooth transitions
            const formationDropdown = widget.querySelector('.formation-dropdown');
            if (formationDropdown) {
                formationDropdown.addEventListener('change', (e) => {
                    this.smoothFormationTransition(widget, e.target.value);
                });
            }
            
            console.log(`✅ Enhanced ${players.length} players with professional physics`);
        },

        addAdvancedPhysics(player, widget) {
            let isDragging = false;
            let physics = {
                velocity: { x: 0, y: 0 },
                acceleration: { x: 0, y: 0 },
                spring: this.SPRING_STRENGTH,
                friction: this.FRICTION,
                mass: 1.0
            };

            // Professional interaction states
            player.style.cursor = 'grab';
            player.style.transition = 'all 200ms cubic-bezier(0.4, 0.0, 0.1, 1)';

            // Mouse/touch interaction
            player.addEventListener('mousedown', (e) => {
                this.startDragInteraction(player, physics, e);
                isDragging = true;
            });

            player.addEventListener('touchstart', (e) => {
                this.startDragInteraction(player, physics, e.touches[0]);
                isDragging = true;
            });

            // Drag movement with physics
            const handleMove = (e) => {
                if (!isDragging) return;
                this.updatePlayerPhysics(player, widget, physics, e);
            };

            document.addEventListener('mousemove', handleMove);
            document.addEventListener('touchmove', (e) => handleMove(e.touches[0]));

            // End drag interaction
            const handleEnd = () => {
                if (isDragging) {
                    this.endDragInteraction(player, widget, physics);
                    isDragging = false;
                }
            };

            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchend', handleEnd);

            // Add hover effects
            player.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    this.addHoverEffect(player);
                }
            });

            player.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    this.removeHoverEffect(player);
                }
            });
        },

        startDragInteraction(player, physics, event) {
            console.log('⚽ Starting drag interaction with professional physics...');
            
            // Visual feedback for drag start
            player.style.cursor = 'grabbing';
            player.style.transform = 'translate(-50%, -50%) scale(1.15)';
            player.style.zIndex = '200';
            player.style.filter = 'drop-shadow(0 12px 24px rgba(0, 148, 204, 0.6))';
            player.style.transition = 'filter 100ms ease, z-index 0ms';
            
            // Add professional drag indicator
            player.classList.add('professional-dragging');
            
            // Store initial position
            physics.startX = parseFloat(player.style.left) || 50;
            physics.startY = parseFloat(player.style.top) || 50;
            physics.mouseStartX = event.clientX;
            physics.mouseStartY = event.clientY;
            
            // Reset velocity
            physics.velocity = { x: 0, y: 0 };
            
            event.preventDefault();
        },

        updatePlayerPhysics(player, widget, physics, event) {
            const rect = widget.getBoundingClientRect();
            
            // Calculate mouse delta
            const deltaX = event.clientX - physics.mouseStartX;
            const deltaY = event.clientY - physics.mouseStartY;
            
            // Convert to percentage coordinates
            const percentDeltaX = (deltaX / rect.width) * 100;
            const percentDeltaY = (deltaY / rect.height) * 100;
            
            // Calculate target position
            const targetX = physics.startX + percentDeltaX;
            const targetY = physics.startY + percentDeltaY;
            
            // Apply field boundary constraints
            const constrainedX = Math.max(8, Math.min(92, targetX));
            const constrainedY = Math.max(8, Math.min(92, targetY));
            
            // Apply physics simulation
            const currentX = parseFloat(player.style.left) || 50;
            const currentY = parseFloat(player.style.top) || 50;
            
            // Spring physics toward target position
            physics.acceleration.x = (constrainedX - currentX) * physics.spring;
            physics.acceleration.y = (constrainedY - currentY) * physics.spring;
            
            // Update velocity with acceleration
            physics.velocity.x = (physics.velocity.x + physics.acceleration.x) * physics.friction;
            physics.velocity.y = (physics.velocity.y + physics.acceleration.y) * physics.friction;
            
            // Apply velocity to position
            const newX = currentX + physics.velocity.x;
            const newY = currentY + physics.velocity.y;
            
            player.style.left = newX + '%';
            player.style.top = newY + '%';
            
            // Real-time tactical analysis update
            this.updateTacticalAnalysisRealtime(widget);
            
            // Visual feedback for positioning zones
            this.showPositioningFeedback(player, newX, newY);
        },

        endDragInteraction(player, widget, physics) {
            console.log('⚽ Ending drag interaction with physics resolution...');
            
            // Restore visual state with spring animation
            player.style.cursor = 'grab';
            player.style.transform = 'translate(-50%, -50%) scale(1)';
            player.style.zIndex = '';
            player.style.filter = '';
            player.style.transition = 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            player.classList.remove('professional-dragging');
            
            // Snap to optimal position if close enough
            this.snapToOptimalTacticalPosition(player);
            
            // Final tactical analysis update
            setTimeout(() => {
                this.updateTacticalAnalysisRealtime(widget);
                this.hidePositioningFeedback();
            }, 100);
        },

        addHoverEffect(player) {
            player.style.transform = 'translate(-50%, -50%) scale(1.08)';
            player.style.filter = 'drop-shadow(0 4px 12px rgba(0, 148, 204, 0.4))';
            player.style.zIndex = '10';
        },

        removeHoverEffect(player) {
            player.style.transform = 'translate(-50%, -50%) scale(1)';
            player.style.filter = '';
            player.style.zIndex = '';
        },

        smoothFormationTransition(widget, formation) {
            console.log(`⚽ Smooth transition to ${formation} formation...`);
            
            const formations = {
                '4-2-3-1': [
                    { role: 'GK', x: 50, y: 85 },
                    { role: 'LB', x: 15, y: 65 }, { role: 'CB', x: 35, y: 70 }, 
                    { role: 'CB', x: 65, y: 70 }, { role: 'RB', x: 85, y: 65 },
                    { role: 'DM', x: 30, y: 45 }, { role: 'CM', x: 70, y: 45 },
                    { role: 'LW', x: 15, y: 25 }, { role: 'AM', x: 50, y: 30 }, 
                    { role: 'RW', x: 85, y: 25 }, { role: 'ST', x: 50, y: 10 }
                ],
                '4-3-3': [
                    { role: 'GK', x: 50, y: 85 },
                    { role: 'LB', x: 15, y: 65 }, { role: 'CB', x: 35, y: 70 }, 
                    { role: 'CB', x: 65, y: 70 }, { role: 'RB', x: 85, y: 65 },
                    { role: 'CM', x: 25, y: 45 }, { role: 'CM', x: 50, y: 40 }, { role: 'CM', x: 75, y: 45 },
                    { role: 'LW', x: 20, y: 15 }, { role: 'ST', x: 50, y: 10 }, { role: 'RW', x: 80, y: 15 }
                ],
                '3-5-2': [
                    { role: 'GK', x: 50, y: 85 },
                    { role: 'CB', x: 25, y: 70 }, { role: 'CB', x: 50, y: 75 }, { role: 'CB', x: 75, y: 70 },
                    { role: 'LWB', x: 10, y: 50 }, { role: 'CM', x: 35, y: 45 }, 
                    { role: 'CM', x: 65, y: 45 }, { role: 'RWB', x: 90, y: 50 },
                    { role: 'AM', x: 50, y: 25 }, { role: 'ST', x: 35, y: 10 }, { role: 'ST', x: 65, y: 10 }
                ]
            };
            
            const formationData = formations[formation];
            if (formationData) {
                const players = widget.querySelectorAll('.player-position, .player-circle');
                
                players.forEach((player, index) => {
                    if (formationData[index]) {
                        const target = formationData[index];
                        
                        // Smooth transition with staggered timing
                        player.style.transition = `all ${this.ANIMATION_DURATION + index * 50}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
                        player.style.left = target.x + '%';
                        player.style.top = target.y + '%';
                        
                        // Add transition effect
                        player.classList.add('formation-transitioning');
                        setTimeout(() => {
                            player.classList.remove('formation-transitioning');
                        }, this.ANIMATION_DURATION + index * 50);
                    }
                });
                
                // Update tactical analysis after transition
                setTimeout(() => {
                    this.updateTacticalAnalysisRealtime(widget);
                }, this.ANIMATION_DURATION + players.length * 50);
            }
        },

        updateTacticalAnalysisRealtime(widget) {
            const players = widget.querySelectorAll('.player-position, .player-circle');
            const metrics = this.calculateProfessionalTacticalMetrics(players);
            
            // Update metric displays with smooth animation
            const metricBars = widget.querySelectorAll('.metric-fill');
            const metricValues = widget.querySelectorAll('.metric-value');
            
            if (metricBars[0] && metricValues[0]) {
                metricBars[0].style.width = metrics.width + '%';
                this.animateNumber(metricValues[0], metrics.width);
            }
            if (metricBars[1] && metricValues[1]) {
                metricBars[1].style.width = metrics.compactness + '%';
                this.animateNumber(metricValues[1], metrics.compactness);
            }
            if (metricBars[2] && metricValues[2]) {
                metricBars[2].style.width = metrics.balance + '%';
                this.animateNumber(metricValues[2], metrics.balance);
            }
            
            // Update tactical insights
            this.updateTacticalInsights(widget, metrics);
        },

        calculateProfessionalTacticalMetrics(players) {
            // Professional tactical calculations based on Research-Docs
            let positions = [];
            
            players.forEach(player => {
                const x = parseFloat(player.style.left) || 50;
                const y = parseFloat(player.style.top) || 50;
                positions.push({ x, y });
            });
            
            // Advanced width calculation considering attacking vs defensive positions
            const attackingPositions = positions.filter(p => p.y < 60);
            const defensivePositions = positions.filter(p => p.y > 60);
            
            const attackingWidth = this.calculateLineWidth(attackingPositions);
            const defensiveWidth = this.calculateLineWidth(defensivePositions);
            const overallWidth = Math.max(40, Math.min(100, (attackingWidth + defensiveWidth) / 2));
            
            // Professional compactness calculation
            const compactness = this.calculateFormationCompactness(positions);
            
            // Balance calculation using center of mass and symmetry
            const balance = this.calculateFormationBalance(positions);
            
            return {
                width: Math.round(overallWidth),
                compactness: Math.round(compactness),
                balance: Math.round(balance),
                attackingWidth: Math.round(attackingWidth),
                defensiveWidth: Math.round(defensiveWidth)
            };
        },

        calculateLineWidth(positions) {
            if (positions.length < 2) return 50;
            
            let minX = 100, maxX = 0;
            positions.forEach(pos => {
                minX = Math.min(minX, pos.x);
                maxX = Math.max(maxX, pos.x);
            });
            
            return Math.max(30, Math.min(100, (maxX - minX) * 1.2));
        },

        calculateFormationCompactness(positions) {
            // Calculate average distance between all players
            let totalDistance = 0;
            let comparisons = 0;
            
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const dx = positions[i].x - positions[j].x;
                    const dy = positions[i].y - positions[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    totalDistance += distance;
                    comparisons++;
                }
            }
            
            const avgDistance = totalDistance / comparisons;
            return Math.max(0, Math.min(100, 100 - (avgDistance / 3)));
        },

        calculateFormationBalance(positions) {
            // Calculate center of mass and symmetry
            let totalX = 0, totalY = 0;
            positions.forEach(pos => {
                totalX += pos.x;
                totalY += pos.y;
            });
            
            const centerX = totalX / positions.length;
            const centerY = totalY / positions.length;
            
            // Balance based on symmetry around center line
            const leftSidePlayers = positions.filter(p => p.x < 50).length;
            const rightSidePlayers = positions.filter(p => p.x > 50).length;
            const symmetryBalance = Math.max(0, 100 - Math.abs(leftSidePlayers - rightSidePlayers) * 15);
            
            // Position balance (not too far from center)
            const positionBalance = Math.max(0, 100 - Math.abs(centerX - 50) * 2);
            
            return (symmetryBalance + positionBalance) / 2;
        },

        updateTacticalInsights(widget, metrics) {
            // Add tactical insights based on formation metrics
            let insightsContainer = widget.querySelector('.tactical-insights');
            if (!insightsContainer) {
                insightsContainer = document.createElement('div');
                insightsContainer.className = 'tactical-insights';
                widget.appendChild(insightsContainer);
            }
            
            const insights = [];
            
            if (metrics.width > 85) {
                insights.push({ type: 'strength', icon: '⚡', text: 'Excellent attacking width' });
            } else if (metrics.width < 60) {
                insights.push({ type: 'improvement', icon: '📏', text: 'Formation too narrow' });
            }
            
            if (metrics.compactness > 80) {
                insights.push({ type: 'strength', icon: '🔒', text: 'Great defensive compactness' });
            } else if (metrics.compactness < 50) {
                insights.push({ type: 'warning', icon: '⚠️', text: 'Formation too spread out' });
            }
            
            if (metrics.balance > 85) {
                insights.push({ type: 'strength', icon: '⚖️', text: 'Perfect formation balance' });
            } else if (metrics.balance < 60) {
                insights.push({ type: 'improvement', icon: '🔄', text: 'Rebalance player positions' });
            }
            
            insightsContainer.innerHTML = insights.map(insight => `
                <div class="tactical-insight ${insight.type}">
                    <span class="insight-icon">${insight.icon}</span>
                    <span class="insight-text">${insight.text}</span>
                </div>
            `).join('');
        },

        snapToOptimalTacticalPosition(player) {
            // Smart snapping based on tactical roles and positions
            const currentX = parseFloat(player.style.left);
            const currentY = parseFloat(player.style.top);
            
            // Define tactical zones and optimal positions
            const tacticalZones = [
                { zone: 'goal', x: 50, y: 85, radius: 10 },
                { zone: 'defense', x: 35, y: 70, radius: 15 },
                { zone: 'midfield', x: 50, y: 45, radius: 20 },
                { zone: 'attack', x: 50, y: 25, radius: 18 }
            ];
            
            // Find closest tactical zone
            let closestZone = null;
            let minDistance = Infinity;
            
            tacticalZones.forEach(zone => {
                const distance = Math.sqrt((currentX - zone.x)**2 + (currentY - zone.y)**2);
                if (distance < zone.radius && distance < minDistance) {
                    minDistance = distance;
                    closestZone = zone;
                }
            });
            
            // Snap to optimal position if within threshold
            if (closestZone && minDistance < this.SNAP_THRESHOLD) {
                player.style.left = closestZone.x + '%';
                player.style.top = closestZone.y + '%';
                
                // Visual feedback for snapping
                player.classList.add('tactical-snap');
                setTimeout(() => player.classList.remove('tactical-snap'), 600);
                
                console.log(`⚽ Snapped to ${closestZone.zone} position`);
            }
        },

        showPositioningFeedback(player, x, y) {
            // Show tactical positioning feedback during drag
            const role = player.dataset.position || 'PLAYER';
            let feedback = '';
            
            if (y < 20) feedback = '⚽ ATTACKING ZONE';
            else if (y < 40) feedback = '🎯 MIDFIELD ZONE';  
            else if (y < 70) feedback = '⚖️ CENTRAL ZONE';
            else feedback = '🛡️ DEFENSIVE ZONE';
            
            // Add temporary feedback indicator
            let feedbackEl = document.getElementById('positioning-feedback');
            if (!feedbackEl) {
                feedbackEl = document.createElement('div');
                feedbackEl.id = 'positioning-feedback';
                feedbackEl.className = 'positioning-feedback';
                document.body.appendChild(feedbackEl);
            }
            
            feedbackEl.textContent = `${role}: ${feedback}`;
            feedbackEl.style.display = 'block';
        },

        hidePositioningFeedback() {
            const feedbackEl = document.getElementById('positioning-feedback');
            if (feedbackEl) {
                feedbackEl.style.display = 'none';
            }
        },

        animateNumber(element, targetValue) {
            const currentValue = parseInt(element.textContent) || 0;
            const duration = 400;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 2);
                const value = Math.round(currentValue + (targetValue - currentValue) * eased);
                
                element.textContent = value;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        addAdvancedPhysicsStyles() {
            const physicsCSS = `
                /* Enhanced Formation Physics Styles */
                .professional-dragging {
                    z-index: 200 !important;
                    transform: translate(-50%, -50%) scale(1.15) !important;
                    filter: drop-shadow(0 12px 24px rgba(0, 148, 204, 0.6)) !important;
                    cursor: grabbing !important;
                }
                
                .formation-transitioning {
                    filter: drop-shadow(0 4px 8px rgba(255, 184, 0, 0.5));
                }
                
                .tactical-snap {
                    animation: tactical-snap-feedback 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                @keyframes tactical-snap-feedback {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    30% { transform: translate(-50%, -50%) scale(1.2); filter: drop-shadow(0 8px 16px rgba(0, 255, 136, 0.6)); }
                    100% { transform: translate(-50%, -50%) scale(1); filter: none; }
                }
                
                .tactical-insights {
                    margin-top: var(--fibonacci-13);
                    padding-top: var(--fibonacci-13);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .tactical-insight {
                    display: flex;
                    align-items: center;
                    gap: var(--fibonacci-8);
                    padding: var(--fibonacci-8);
                    margin-bottom: var(--fibonacci-8);
                    border-radius: var(--fibonacci-8);
                    font-size: var(--font-size-xs);
                    animation: insight-appear 400ms ease-out;
                }
                
                @keyframes insight-appear {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .tactical-insight.strength {
                    background: linear-gradient(90deg, rgba(0, 255, 136, 0.15), transparent);
                    border-left: 3px solid var(--safe-color);
                }
                
                .tactical-insight.improvement {
                    background: linear-gradient(90deg, rgba(255, 184, 0, 0.15), transparent);
                    border-left: 3px solid var(--tension-color);
                }
                
                .tactical-insight.warning {
                    background: linear-gradient(90deg, rgba(255, 71, 87, 0.15), transparent);
                    border-left: 3px solid var(--danger-color);
                }
                
                .positioning-feedback {
                    position: fixed;
                    top: 120px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 148, 204, 0.95);
                    color: white;
                    padding: var(--fibonacci-8) var(--fibonacci-21);
                    border-radius: var(--fibonacci-8);
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: feedback-pulse 2s infinite;
                }
                
                @keyframes feedback-pulse {
                    0%, 100% { opacity: 0.9; }
                    50% { opacity: 1; }
                }
                
                /* Enhanced player circles with Research-Docs styling */
                .player-circle, .player-position {
                    transition: all 200ms cubic-bezier(0.4, 0.0, 0.1, 1);
                    cursor: grab;
                    position: relative;
                }
                
                .player-circle:hover, .player-position:hover {
                    transform: translate(-50%, -50%) scale(1.08);
                    filter: drop-shadow(0 4px 12px rgba(0, 148, 204, 0.4));
                    z-index: 10;
                }
                
                /* Professional visual states */
                .gk .player-circle { 
                    background: radial-gradient(circle, #ff6b35, #e55039);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                }
                
                .def .player-circle { 
                    background: radial-gradient(circle, #0094cc, #006ba6);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                }
                
                .mid .player-circle { 
                    background: radial-gradient(circle, #00ff88, #00d68f);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                }
                
                .att .player-circle { 
                    background: radial-gradient(circle, #ffb800, #f39c12);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                }
                
                .str .player-circle { 
                    background: radial-gradient(circle, #ff4757, #c44569);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'enhanced-formation-physics-styles';
            style.textContent = physicsCSS;
            document.head.appendChild(style);
            
            console.log('✅ Enhanced formation physics styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => EnhancedFormationPhysics.init(), 700);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => EnhancedFormationPhysics.init(), 700);
        });
    }

    // Make available globally
    window.EnhancedFormationPhysics = EnhancedFormationPhysics;

})();