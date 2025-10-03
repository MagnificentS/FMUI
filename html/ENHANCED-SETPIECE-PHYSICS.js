/**
 * ENHANCED SET PIECE PHYSICS SYSTEM
 * Professional-grade interactive set piece designer with real player physics
 * Based on Research-Docs spatial innovation and professional tactical analysis
 */

(function() {
    'use strict';

    console.log('🎯 ENHANCED SET PIECE PHYSICS: Creating professional set piece interaction system...');

    const EnhancedSetPiecePhysics = {
        // Physics constants optimized for set piece interactions
        DRAG_SENSITIVITY: 1.2,
        SNAP_ZONES: {
            nearPost: { x: 60, y: 40, radius: 12 },
            farPost: { x: 30, y: 45, radius: 12 },
            central: { x: 45, y: 35, radius: 10 },
            edge: { x: 75, y: 55, radius: 15 },
            penalty: { x: 50, y: 50, radius: 8 }
        },

        init() {
            console.log('🎯 SET PIECE PHYSICS: Implementing professional interaction system...');
            
            this.enhanceSetPieceInteractivity();
            this.addAdvancedSetPieceStyles();
            
            console.log('✅ ENHANCED SET PIECE PHYSICS: Ready');
        },

        enhanceSetPieceInteractivity() {
            console.log('🎯 Enhancing set piece interactivity with professional physics...');
            
            setTimeout(() => {
                this.upgradeSetPieceWidgets();
            }, 400);
        },

        upgradeSetPieceWidgets() {
            // Find set piece widgets and enhance them
            document.querySelectorAll('.setpiece-designer, .setpiece-pitch').forEach(widget => {
                this.addProfessionalSetPiecePhysics(widget);
            });
        },

        addProfessionalSetPiecePhysics(widget) {
            console.log('🎯 Adding professional physics to set piece widget...');
            
            const players = widget.querySelectorAll('.setpiece-player');
            players.forEach(player => {
                this.addSetPiecePlayerPhysics(player, widget);
            });
            
            // Add set piece type switching with smooth transitions
            const typeButtons = widget.querySelectorAll('.setpiece-btn');
            typeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.smoothSetPieceTransition(widget, button.dataset.type);
                });
            });
            
            console.log(`✅ Enhanced ${players.length} set piece players with professional physics`);
        },

        addSetPiecePlayerPhysics(player, widget) {
            let isDragging = false;
            let physics = {
                velocity: { x: 0, y: 0 },
                spring: 0.2,
                friction: 0.8,
                magneticForce: 0.1
            };

            // Professional interaction setup
            player.style.cursor = 'grab';
            player.style.transition = 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)';

            // Mouse interaction
            player.addEventListener('mousedown', (e) => {
                this.startSetPieceDrag(player, physics, e);
                isDragging = true;
            });

            // Drag movement
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                this.updateSetPiecePlayerPhysics(player, widget, physics, e);
            });

            // End drag
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    this.endSetPieceDrag(player, widget, physics);
                    isDragging = false;
                }
            });

            // Professional hover effects
            player.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    this.addSetPieceHoverEffect(player);
                }
            });

            player.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    this.removeSetPieceHoverEffect(player);
                }
            });
        },

        startSetPieceDrag(player, physics, event) {
            console.log('🎯 Starting set piece drag with professional feedback...');
            
            // Professional drag visual feedback
            player.style.cursor = 'grabbing';
            player.style.transform = 'translate(-50%, -50%) scale(1.2)';
            player.style.zIndex = '300';
            player.style.filter = 'drop-shadow(0 16px 32px rgba(255, 184, 0, 0.8))';
            player.style.transition = 'none';
            
            // Add drag state class
            player.classList.add('setpiece-dragging');
            
            // Store drag start data
            physics.startX = parseFloat(player.style.left) || 50;
            physics.startY = parseFloat(player.style.top) || 50;
            physics.mouseStartX = event.clientX;
            physics.mouseStartY = event.clientY;
            
            // Reset physics
            physics.velocity = { x: 0, y: 0 };
            
            // Show tactical zones
            this.showTacticalZones(player);
            
            event.preventDefault();
        },

        updateSetPiecePlayerPhysics(player, widget, physics, event) {
            const rect = widget.getBoundingClientRect();
            
            // Calculate movement delta
            const deltaX = (event.clientX - physics.mouseStartX) * this.DRAG_SENSITIVITY;
            const deltaY = (event.clientY - physics.mouseStartY) * this.DRAG_SENSITIVITY;
            
            // Convert to percentage
            const percentDeltaX = (deltaX / rect.width) * 100;
            const percentDeltaY = (deltaY / rect.height) * 100;
            
            // Calculate target with constraints
            const targetX = Math.max(5, Math.min(95, physics.startX + percentDeltaX));
            const targetY = Math.max(5, Math.min(95, physics.startY + percentDeltaY));
            
            // Apply magnetic snapping to optimal zones
            const snapPosition = this.calculateMagneticSnap(targetX, targetY);
            
            // Update position
            player.style.left = snapPosition.x + '%';
            player.style.top = snapPosition.y + '%';
            
            // Real-time effectiveness calculation
            this.updateSetPieceEffectivenessRealtime(widget);
            
            // Show positioning feedback
            this.showSetPiecePositioningFeedback(player, snapPosition);
        },

        calculateMagneticSnap(targetX, targetY) {
            // Magnetic snapping to optimal tactical positions
            let bestSnap = { x: targetX, y: targetY, distance: Infinity };
            
            Object.entries(this.SNAP_ZONES).forEach(([zoneName, zone]) => {
                const distance = Math.sqrt((targetX - zone.x)**2 + (targetY - zone.y)**2);
                
                if (distance < zone.radius && distance < bestSnap.distance) {
                    bestSnap = { x: zone.x, y: zone.y, distance, zone: zoneName };
                }
            });
            
            // Apply magnetic pull if within snap zone
            if (bestSnap.distance < Infinity) {
                const pullStrength = 1 - (bestSnap.distance / this.SNAP_ZONES[bestSnap.zone].radius);
                return {
                    x: targetX + (bestSnap.x - targetX) * pullStrength * 0.3,
                    y: targetY + (bestSnap.y - targetY) * pullStrength * 0.3
                };
            }
            
            return { x: targetX, y: targetY };
        },

        endSetPieceDrag(player, widget, physics) {
            console.log('🎯 Ending set piece drag with physics resolution...');
            
            // Restore visual state
            player.style.cursor = 'grab';
            player.style.transform = 'translate(-50%, -50%) scale(1)';
            player.style.zIndex = '';
            player.style.filter = '';
            player.style.transition = 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            player.classList.remove('setpiece-dragging');
            
            // Final snap to optimal position
            this.finalSnapToSetPiecePosition(player);
            
            // Hide tactical zones and feedback
            this.hideTacticalZones();
            this.hideSetPiecePositioningFeedback();
            
            // Final effectiveness update
            setTimeout(() => {
                this.updateSetPieceEffectivenessRealtime(widget);
            }, 100);
        },

        showTacticalZones(player) {
            // Show visual indicators for optimal positioning zones
            Object.entries(this.SNAP_ZONES).forEach(([zoneName, zone]) => {
                const zoneIndicator = document.createElement('div');
                zoneIndicator.className = `tactical-zone ${zoneName}`;
                zoneIndicator.style.cssText = `
                    position: absolute;
                    left: ${zone.x}%;
                    top: ${zone.y}%;
                    width: ${zone.radius * 2}px;
                    height: ${zone.radius * 2}px;
                    border-radius: 50%;
                    background: rgba(0, 255, 136, 0.2);
                    border: 2px dashed rgba(0, 255, 136, 0.5);
                    transform: translate(-50%, -50%);
                    z-index: 5;
                    pointer-events: none;
                    animation: zone-pulse 2s infinite;
                `;
                
                const pitchSection = player.closest('.setpiece-pitch').querySelector('.pitch-section');
                if (pitchSection) {
                    pitchSection.appendChild(zoneIndicator);
                }
            });
        },

        hideTacticalZones() {
            document.querySelectorAll('.tactical-zone').forEach(zone => {
                zone.style.opacity = '0';
                setTimeout(() => zone.remove(), 200);
            });
        },

        updateSetPieceEffectivenessRealtime(widget) {
            const players = widget.querySelectorAll('.setpiece-player.attacking');
            const effectiveness = this.calculateSetPieceEffectiveness(players);
            
            // Update probability bars with smooth animation
            const shotBar = widget.querySelector('.probability-fill');
            const goalBar = widget.querySelectorAll('.probability-fill')[1];
            const shotPercent = widget.querySelector('.metric-percent');
            const goalPercent = widget.querySelectorAll('.metric-percent')[1];
            
            if (shotBar && shotPercent) {
                shotBar.style.width = effectiveness.shotProbability + '%';
                shotPercent.textContent = effectiveness.shotProbability + '%';
            }
            
            if (goalBar && goalPercent) {
                goalBar.style.width = effectiveness.goalProbability + '%';
                goalPercent.textContent = effectiveness.goalProbability + '%';
            }
            
            // Update threat zones based on positioning
            this.updateThreatZoneAnalysis(widget, players);
        },

        calculateSetPieceEffectiveness(players) {
            // Professional set piece analysis algorithms
            let shotProbability = 45; // Base probability
            let goalProbability = 12; // Base probability
            
            Array.from(players).forEach(player => {
                const x = parseFloat(player.style.left) || 50;
                const y = parseFloat(player.style.top) || 50;
                const role = player.dataset.role;
                
                // Zone-based effectiveness calculation
                if (this.isInOptimalZone(x, y, 'nearPost')) {
                    shotProbability += 15;
                    goalProbability += 5;
                } else if (this.isInOptimalZone(x, y, 'farPost')) {
                    shotProbability += 12;
                    goalProbability += 4;
                } else if (this.isInOptimalZone(x, y, 'central')) {
                    shotProbability += 10;
                    goalProbability += 3;
                } else if (this.isInOptimalZone(x, y, 'edge')) {
                    shotProbability += 8;
                    goalProbability += 2;
                }
                
                // Role-specific bonuses
                if (role === 'corner-taker' && x > 80 && y > 65) {
                    shotProbability += 5; // Good angle for delivery
                }
                
                // Penalty area positioning bonus
                if (x > 30 && x < 70 && y > 20 && y < 60) {
                    shotProbability += 3;
                    goalProbability += 1;
                }
            });
            
            return {
                shotProbability: Math.max(0, Math.min(100, Math.round(shotProbability))),
                goalProbability: Math.max(0, Math.min(100, Math.round(goalProbability)))
            };
        },

        isInOptimalZone(x, y, zoneName) {
            const zone = this.SNAP_ZONES[zoneName];
            if (!zone) return false;
            
            const distance = Math.sqrt((x - zone.x)**2 + (y - zone.y)**2);
            return distance < zone.radius;
        },

        updateThreatZoneAnalysis(widget, players) {
            // Calculate threat level for each zone
            const threatZones = widget.querySelectorAll('.zone');
            
            threatZones.forEach(zone => {
                const zoneName = zone.classList[1]; // near-post, central, far-post
                const threat = this.calculateZoneThreat(zoneName, players);
                
                const threatSpan = zone.querySelector('.zone-threat');
                if (threatSpan) {
                    threatSpan.textContent = threat.level;
                    threatSpan.className = `zone-threat ${threat.class}`;
                }
            });
        },

        calculateZoneThreat(zoneName, players) {
            const zoneMap = {
                'near-post': this.SNAP_ZONES.nearPost,
                'central': this.SNAP_ZONES.central,  
                'far-post': this.SNAP_ZONES.farPost
            };
            
            const zone = zoneMap[zoneName];
            if (!zone) return { level: 'Low', class: 'low' };
            
            // Count players in zone
            let playersInZone = 0;
            Array.from(players).forEach(player => {
                const x = parseFloat(player.style.left) || 50;
                const y = parseFloat(player.style.top) || 50;
                
                if (this.isInOptimalZone(x, y, zoneName.replace('-', ''))) {
                    playersInZone++;
                }
            });
            
            // Determine threat level
            if (playersInZone >= 2) return { level: 'Very High', class: 'very-high' };
            if (playersInZone === 1) return { level: 'High', class: 'high' };
            if (zoneName === 'central') return { level: 'Medium', class: 'medium' };
            return { level: 'Low', class: 'low' };
        },

        smoothSetPieceTransition(widget, setPieceType) {
            console.log(`🎯 Smooth transition to ${setPieceType} setup...`);
            
            const setups = {
                corner: [
                    { role: 'corner-taker', x: 85, y: 70 },
                    { role: 'near-post', x: 60, y: 40 },
                    { role: 'central', x: 45, y: 35 },
                    { role: 'far-post', x: 30, y: 45 },
                    { role: 'edge-box', x: 75, y: 55 }
                ],
                freekick: [
                    { role: 'taker', x: 50, y: 65 },
                    { role: 'wall-jumper', x: 40, y: 45 },
                    { role: 'runner', x: 60, y: 45 },
                    { role: 'target', x: 50, y: 25 },
                    { role: 'support', x: 70, y: 55 }
                ],
                throwin: [
                    { role: 'thrower', x: 5, y: 50 },
                    { role: 'short-option', x: 20, y: 40 },
                    { role: 'long-target', x: 60, y: 30 },
                    { role: 'support', x: 40, y: 60 },
                    { role: 'cover', x: 25, y: 70 }
                ]
            };
            
            const setup = setups[setPieceType];
            if (setup) {
                const attackingPlayers = widget.querySelectorAll('.setpiece-player.attacking');
                
                attackingPlayers.forEach((player, index) => {
                    if (setup[index]) {
                        const target = setup[index];
                        
                        // Staggered smooth transition
                        player.style.transition = `all ${400 + index * 100}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
                        player.style.left = target.x + '%';
                        player.style.top = target.y + '%';
                        
                        // Update role
                        player.dataset.role = target.role;
                        const instructionSpan = player.querySelector('.player-instruction');
                        if (instructionSpan) {
                            instructionSpan.textContent = this.getRoleDisplayName(target.role);
                        }
                        
                        // Add transition effect
                        player.classList.add('setpiece-transitioning');
                        setTimeout(() => {
                            player.classList.remove('setpiece-transitioning');
                        }, 400 + index * 100);
                    }
                });
                
                // Update pitch visual for different set piece types
                this.updatePitchVisualization(widget, setPieceType);
                
                // Update effectiveness after transition
                setTimeout(() => {
                    this.updateSetPieceEffectivenessRealtime(widget);
                }, 400 + attackingPlayers.length * 100);
            }
        },

        updatePitchVisualization(widget, setPieceType) {
            const pitch = widget.querySelector('.setpiece-pitch');
            if (pitch) {
                // Remove existing setup classes
                pitch.classList.remove('corner-setup', 'freekick-setup', 'throwin-setup');
                pitch.classList.add(`${setPieceType}-setup`);
                
                // Add visual indicators for the set piece type
                this.addSetPieceTypeIndicators(pitch, setPieceType);
            }
        },

        addSetPieceTypeIndicators(pitch, type) {
            // Remove existing indicators
            pitch.querySelectorAll('.setpiece-indicator').forEach(el => el.remove());
            
            const indicators = {
                corner: '<div class="setpiece-indicator corner-flag" style="position: absolute; right: 5%; bottom: 5%; width: 8px; height: 8px; background: var(--triumph-color); border-radius: 50%;"></div>',
                freekick: '<div class="setpiece-indicator ball" style="position: absolute; left: 50%; top: 65%; width: 6px; height: 6px; background: white; border-radius: 50%; transform: translate(-50%, -50%);"></div>',
                throwin: '<div class="setpiece-indicator sideline" style="position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.6);"></div>'
            };
            
            if (indicators[type]) {
                pitch.innerHTML += indicators[type];
            }
        },

        showSetPiecePositioningFeedback(player, position) {
            const role = player.dataset.role;
            const zone = this.identifyTacticalZone(position.x, position.y);
            
            let feedbackEl = document.getElementById('setpiece-feedback');
            if (!feedbackEl) {
                feedbackEl = document.createElement('div');
                feedbackEl.id = 'setpiece-feedback';
                feedbackEl.className = 'setpiece-positioning-feedback';
                document.body.appendChild(feedbackEl);
            }
            
            feedbackEl.innerHTML = `
                <div class="feedback-role">${role.toUpperCase()}</div>
                <div class="feedback-zone">${zone}</div>
                <div class="feedback-effectiveness">Effectiveness: ${this.calculatePositionEffectiveness(position)}%</div>
            `;
            feedbackEl.style.display = 'block';
        },

        hideSetPiecePositioningFeedback() {
            const feedbackEl = document.getElementById('setpiece-feedback');
            if (feedbackEl) {
                feedbackEl.style.display = 'none';
            }
        },

        identifyTacticalZone(x, y) {
            if (x > 55 && y < 45) return '🎯 PRIME SCORING ZONE';
            if (x > 40 && x < 60 && y < 50) return '⚽ GOAL THREAT AREA';
            if (x < 20 || x > 80) return '📐 WIDE POSITION';
            if (y > 60) return '🛡️ DEFENSIVE AREA';
            return '⚖️ CENTRAL AREA';
        },

        calculatePositionEffectiveness(position) {
            // Calculate effectiveness based on position optimality
            let effectiveness = 50; // Base effectiveness
            
            // Distance to goal effectiveness
            const goalDistance = Math.sqrt((position.x - 50)**2 + (position.y - 20)**2);
            effectiveness += Math.max(0, (50 - goalDistance) / 2);
            
            // Central positioning bonus
            if (position.x > 40 && position.x < 60) {
                effectiveness += 15;
            }
            
            // Penalty area bonus
            if (position.x > 30 && position.x < 70 && position.y > 20 && position.y < 60) {
                effectiveness += 10;
            }
            
            return Math.max(0, Math.min(100, Math.round(effectiveness)));
        },

        getRoleDisplayName(role) {
            const roleMap = {
                'corner-taker': 'Taker',
                'near-post': 'Near',
                'central': 'Central', 
                'far-post': 'Far',
                'edge-box': 'Edge',
                'taker': 'Taker',
                'wall-jumper': 'Jump',
                'runner': 'Run',
                'target': 'Target',
                'support': 'Support',
                'thrower': 'Throw',
                'short-option': 'Short',
                'long-target': 'Long',
                'cover': 'Cover'
            };
            
            return roleMap[role] || role;
        },

        addSetPieceHoverEffect(player) {
            player.style.transform = 'translate(-50%, -50%) scale(1.1)';
            player.style.filter = 'drop-shadow(0 6px 12px rgba(255, 184, 0, 0.5))';
            player.style.zIndex = '20';
        },

        removeSetPieceHoverEffect(player) {
            player.style.transform = 'translate(-50%, -50%) scale(1)';
            player.style.filter = '';
            player.style.zIndex = '';
        },

        finalSnapToSetPiecePosition(player) {
            const currentX = parseFloat(player.style.left);
            const currentY = parseFloat(player.style.top);
            
            // Find best snap position
            const snapPosition = this.calculateMagneticSnap(currentX, currentY);
            
            if (Math.abs(snapPosition.x - currentX) > 1 || Math.abs(snapPosition.y - currentY) > 1) {
                player.style.left = snapPosition.x + '%';
                player.style.top = snapPosition.y + '%';
                
                // Visual feedback for final snap
                player.classList.add('final-setpiece-snap');
                setTimeout(() => player.classList.remove('final-setpiece-snap'), 500);
            }
        },

        addAdvancedSetPieceStyles() {
            const setPieceCSS = `
                /* Enhanced Set Piece Physics Styles */
                .setpiece-dragging {
                    transform: translate(-50%, -50%) scale(1.2) !important;
                    filter: drop-shadow(0 16px 32px rgba(255, 184, 0, 0.8)) !important;
                    z-index: 300 !important;
                    cursor: grabbing !important;
                }
                
                .setpiece-transitioning {
                    filter: drop-shadow(0 6px 12px rgba(255, 184, 0, 0.6));
                }
                
                .final-setpiece-snap {
                    animation: setpiece-snap-feedback 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
                
                @keyframes setpiece-snap-feedback {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    40% { transform: translate(-50%, -50%) scale(1.25); filter: drop-shadow(0 8px 16px rgba(0, 255, 136, 0.8)); }
                    100% { transform: translate(-50%, -50%) scale(1); filter: none; }
                }
                
                @keyframes zone-pulse {
                    0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
                }
                
                .setpiece-positioning-feedback {
                    position: fixed;
                    top: 140px;
                    right: 20px;
                    background: rgba(255, 184, 0, 0.95);
                    color: black;
                    padding: var(--fibonacci-13) var(--fibonacci-21);
                    border-radius: var(--fibonacci-8);
                    font-size: var(--font-size-xs);
                    font-weight: 600;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 184, 0, 0.8);
                }
                
                .feedback-role {
                    font-size: var(--font-size-sm);
                    margin-bottom: 4px;
                    color: #1a1d24;
                }
                
                .feedback-zone {
                    margin-bottom: 4px;
                    color: #22262f;
                }
                
                .feedback-effectiveness {
                    font-weight: 700;
                    color: #003d52;
                }
                
                /* Zone threat indicators */
                .zone-threat.very-high { color: var(--danger-color); font-weight: 700; }
                .zone-threat.high { color: #ff6b35; font-weight: 600; }
                .zone-threat.medium { color: var(--tension-color); font-weight: 500; }
                .zone-threat.low { color: rgba(255, 255, 255, 0.6); font-weight: 400; }
                
                /* Enhanced setpiece players */
                .setpiece-player {
                    cursor: grab;
                    transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .setpiece-player:hover {
                    transform: translate(-50%, -50%) scale(1.1);
                    filter: drop-shadow(0 6px 12px rgba(255, 184, 0, 0.5));
                    z-index: 20;
                }
                
                .setpiece-player.attacking {
                    background: radial-gradient(circle, #0094cc, #006ba6);
                    border: 2px solid white;
                    box-shadow: 0 2px 8px rgba(0, 148, 204, 0.3);
                }
                
                .setpiece-player.defending {
                    background: radial-gradient(circle, #ff4757, #c44569);
                    border: 2px solid white;
                    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
                }
                
                /* Set piece pitch enhancements */
                .setpiece-pitch {
                    position: relative;
                    background: linear-gradient(to top, #1a3d1a 0%, #2d5a2d 50%, #1a3d1a 100%);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    border-radius: var(--fibonacci-8);
                    overflow: hidden;
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
                }
                
                /* Pitch markings with professional styling */
                .goal-line, .six-yard-box, .penalty-area, .corner-arc {
                    border-color: rgba(255, 255, 255, 0.6);
                    box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'enhanced-setpiece-physics-styles';
            style.textContent = setPieceCSS;
            document.head.appendChild(style);
            
            console.log('✅ Enhanced set piece physics styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => EnhancedSetPiecePhysics.init(), 800);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => EnhancedSetPiecePhysics.init(), 800);
        });
    }

    // Make available globally
    window.EnhancedSetPiecePhysics = EnhancedSetPiecePhysics;

})();