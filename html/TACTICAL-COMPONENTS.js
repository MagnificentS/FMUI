/**
 * =====================================================
 * TACTICAL COMPONENTS - Professional Football Analysis
 * =====================================================
 * 
 * Advanced tactical visualization components implementing ZENITH design principles:
 * - Interactive Formation Designer with physics-based movement
 * - Real-time Tactical Heat Maps with temporal progression
 * - Match Analysis Components with xG flow and territory mapping
 * - Set Piece Designer with success probability calculations
 * - Opposition Analysis with weakness identification algorithms
 * - Formation Transition Animator with smooth morphing
 * 
 * Built on DESIGN-SYSTEM-FOUNDATION mathematics for:
 * - Golden Ratio Layout proportions (φ = 1.618)
 * - 60fps rendering performance optimization
 * - Professional football manager data integration
 * - Canvas/SVG smooth animation systems
 * 
 * Version: 1.0.0
 * Author: ZENITH Tactical Systems
 * Performance Target: 60fps constant
 */

(function(global) {
    'use strict';

    // Ensure ZENITH Design System is available
    if (typeof global.ZENITH === 'undefined') {
        console.error('TACTICAL-COMPONENTS requires DESIGN-SYSTEM-FOUNDATION to be loaded first');
        return;
    }

    const { GOLDEN_RATIO, FIBONACCI_SCALE, COLOR_HARMONY, ANIMATION_TIMING, PERFORMANCE } = global.ZENITH;

    // =====================================================
    // TACTICAL MATHEMATICS & CONSTANTS
    // =====================================================

    const TACTICAL_CONSTANTS = {
        PITCH_DIMENSIONS: {
            width: GOLDEN_RATIO * 400,  // Golden ratio proportioned
            height: 400,
            ratio: GOLDEN_RATIO
        },
        
        FORMATION_PHYSICS: {
            springStrength: 0.3,
            damping: 0.8,
            maxForce: 2.0,
            playerRadius: 20,
            connectionRange: 100
        },
        
        HEAT_MAP_RESOLUTION: 16,  // 16x16 grid for performance
        
        ANIMATION_CURVES: {
            formation_transition: ANIMATION_TIMING.easings.golden,
            player_movement: ANIMATION_TIMING.easings.human,
            heat_fade: ANIMATION_TIMING.easings.swift,
            tactical_morph: [0.68, -0.55, 0.265, 1.55]  // Tactical bounce
        },
        
        TACTICAL_COLORS: {
            formation: COLOR_HARMONY.gameStates.focus,
            possession: COLOR_HARMONY.gameStates.safe,
            attack: COLOR_HARMONY.gameStates.triumph,
            defense: COLOR_HARMONY.gameStates.mystery,
            danger: COLOR_HARMONY.gameStates.danger,
            neutral: COLOR_HARMONY.gameStates.neutral
        }
    };

    // =====================================================
    // 1. INTERACTIVE FORMATION DESIGNER
    // =====================================================

    class InteractiveFormationDesigner {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                width: TACTICAL_CONSTANTS.PITCH_DIMENSIONS.width,
                height: TACTICAL_CONSTANTS.PITCH_DIMENSIONS.height,
                interactive: true,
                showConnections: true,
                showZones: true,
                realTimeAnalysis: true,
                ...options
            };
            
            this.formation = '4-2-3-1';
            this.players = [];
            this.canvas = null;
            this.ctx = null;
            this.animationFrame = null;
            this.isDragging = false;
            this.draggedPlayer = null;
            this.lastUpdate = performance.now();
            
            this.init();
        }
        
        init() {
            this.createCanvas();
            this.setupEventListeners();
            this.loadFormation(this.formation);
            this.startRenderLoop();
        }
        
        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            this.canvas.style.width = '100%';
            this.canvas.style.height = 'auto';
            this.canvas.style.maxWidth = `${this.options.width}px`;
            this.canvas.style.borderRadius = `${FIBONACCI_SCALE.spacing.sm}px`;
            this.canvas.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
            
            // Apply design system styling
            this.canvas.classList.add('gpu-accelerate', 'tier-primary');
        }
        
        setupEventListeners() {
            if (!this.options.interactive) return;
            
            this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
            this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
            
            // Touch events for mobile
            this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
            this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
            this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }
        
        loadFormation(formationName) {
            this.formation = formationName;
            this.players = this.getFormationPositions(formationName);
            this.updateAnalysis();
        }
        
        getFormationPositions(formation) {
            const formations = {
                '4-2-3-1': [
                    { id: 'GK', x: 0.5, y: 0.05, role: 'goalkeeper', name: 'de Gea', number: 1 },
                    { id: 'LB', x: 0.15, y: 0.25, role: 'defender', name: 'Shaw', number: 23 },
                    { id: 'CB1', x: 0.35, y: 0.25, role: 'defender', name: 'Varane', number: 19 },
                    { id: 'CB2', x: 0.65, y: 0.25, role: 'defender', name: 'Martinez', number: 6 },
                    { id: 'RB', x: 0.85, y: 0.25, role: 'defender', name: 'Dalot', number: 20 },
                    { id: 'CDM1', x: 0.38, y: 0.45, role: 'midfielder', name: 'Casemiro', number: 18 },
                    { id: 'CDM2', x: 0.62, y: 0.45, role: 'midfielder', name: 'Eriksen', number: 14 },
                    { id: 'LM', x: 0.2, y: 0.65, role: 'midfielder', name: 'Rashford', number: 10 },
                    { id: 'CAM', x: 0.5, y: 0.65, role: 'midfielder', name: 'Fernandes', number: 8 },
                    { id: 'RM', x: 0.8, y: 0.65, role: 'midfielder', name: 'Antony', number: 21 },
                    { id: 'ST', x: 0.5, y: 0.85, role: 'attacker', name: 'Højlund', number: 11 }
                ],
                '4-3-3': [
                    { id: 'GK', x: 0.5, y: 0.05, role: 'goalkeeper', name: 'de Gea', number: 1 },
                    { id: 'LB', x: 0.15, y: 0.25, role: 'defender', name: 'Shaw', number: 23 },
                    { id: 'CB1', x: 0.35, y: 0.25, role: 'defender', name: 'Varane', number: 19 },
                    { id: 'CB2', x: 0.65, y: 0.25, role: 'defender', name: 'Martinez', number: 6 },
                    { id: 'RB', x: 0.85, y: 0.25, role: 'defender', name: 'Dalot', number: 20 },
                    { id: 'CM1', x: 0.25, y: 0.5, role: 'midfielder', name: 'Casemiro', number: 18 },
                    { id: 'CM2', x: 0.5, y: 0.45, role: 'midfielder', name: 'Fernandes', number: 8 },
                    { id: 'CM3', x: 0.75, y: 0.5, role: 'midfielder', name: 'Eriksen', number: 14 },
                    { id: 'LW', x: 0.15, y: 0.75, role: 'attacker', name: 'Rashford', number: 10 },
                    { id: 'ST', x: 0.5, y: 0.85, role: 'attacker', name: 'Højlund', number: 11 },
                    { id: 'RW', x: 0.85, y: 0.75, role: 'attacker', name: 'Antony', number: 21 }
                ],
                '3-5-2': [
                    { id: 'GK', x: 0.5, y: 0.05, role: 'goalkeeper', name: 'de Gea', number: 1 },
                    { id: 'CB1', x: 0.25, y: 0.25, role: 'defender', name: 'Varane', number: 19 },
                    { id: 'CB2', x: 0.5, y: 0.25, role: 'defender', name: 'Martinez', number: 6 },
                    { id: 'CB3', x: 0.75, y: 0.25, role: 'defender', name: 'Maguire', number: 5 },
                    { id: 'LWB', x: 0.1, y: 0.5, role: 'midfielder', name: 'Shaw', number: 23 },
                    { id: 'CM1', x: 0.3, y: 0.45, role: 'midfielder', name: 'Casemiro', number: 18 },
                    { id: 'CM2', x: 0.5, y: 0.5, role: 'midfielder', name: 'Fernandes', number: 8 },
                    { id: 'CM3', x: 0.7, y: 0.45, role: 'midfielder', name: 'Eriksen', number: 14 },
                    { id: 'RWB', x: 0.9, y: 0.5, role: 'midfielder', name: 'Dalot', number: 20 },
                    { id: 'ST1', x: 0.4, y: 0.8, role: 'attacker', name: 'Højlund', number: 11 },
                    { id: 'ST2', x: 0.6, y: 0.8, role: 'attacker', name: 'Rashford', number: 10 }
                ]
            };
            
            const positions = formations[formation] || formations['4-2-3-1'];
            return positions.map((pos, index) => ({
                ...pos,
                x: pos.x * this.options.width,
                y: pos.y * this.options.height,
                vx: 0,
                vy: 0,
                originalX: pos.x * this.options.width,
                originalY: pos.y * this.options.height,
                radius: TACTICAL_CONSTANTS.FORMATION_PHYSICS.playerRadius,
                selected: false,
                effectiveness: this.calculatePositionEffectiveness(pos, index, positions)
            }));
        }
        
        calculatePositionEffectiveness(position, index, allPositions) {
            // Calculate tactical effectiveness based on position relationships
            let effectiveness = 0.5; // Base effectiveness
            
            // Distance from optimal position
            const centerX = this.options.width * 0.5;
            const centerY = this.options.height * 0.5;
            const distanceFromCenter = Math.sqrt(
                Math.pow(position.x * this.options.width - centerX, 2) + 
                Math.pow(position.y * this.options.height - centerY, 2)
            );
            
            // Role-based effectiveness modifiers
            const roleModifiers = {
                goalkeeper: 0.9,
                defender: 0.8,
                midfielder: 1.0,
                attacker: 0.85
            };
            
            effectiveness *= roleModifiers[position.role] || 0.7;
            
            // Spacing effectiveness (golden ratio based)
            const idealSpacing = this.options.width / GOLDEN_RATIO;
            const spacingScore = allPositions.reduce((score, other, otherIndex) => {
                if (index === otherIndex) return score;
                const distance = Math.sqrt(
                    Math.pow((position.x - other.x) * this.options.width, 2) + 
                    Math.pow((position.y - other.y) * this.options.height, 2)
                );
                const spacingRatio = distance / idealSpacing;
                return score + Math.max(0, 1 - Math.abs(spacingRatio - GOLDEN_RATIO_INVERSE));
            }, 0) / (allPositions.length - 1);
            
            effectiveness = (effectiveness + spacingScore) / 2;
            
            return Math.max(0.1, Math.min(1.0, effectiveness));
        }
        
        startRenderLoop() {
            const render = (currentTime) => {
                const deltaTime = currentTime - this.lastUpdate;
                this.lastUpdate = currentTime;
                
                if (deltaTime < 100) { // Skip if frame took too long (paused tab)
                    this.update(deltaTime);
                    this.render();
                }
                
                this.animationFrame = requestAnimationFrame(render);
            };
            
            this.animationFrame = requestAnimationFrame(render);
        }
        
        update(deltaTime) {
            if (!this.options.interactive) return;
            
            // Apply physics to non-dragged players
            this.players.forEach((player, index) => {
                if (this.draggedPlayer === player) return;
                
                // Spring back to original position
                const dx = player.originalX - player.x;
                const dy = player.originalY - player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 1) {
                    const force = distance * TACTICAL_CONSTANTS.FORMATION_PHYSICS.springStrength;
                    player.vx += (dx / distance) * force * deltaTime * 0.01;
                    player.vy += (dy / distance) * force * deltaTime * 0.01;
                }
                
                // Apply damping
                player.vx *= TACTICAL_CONSTANTS.FORMATION_PHYSICS.damping;
                player.vy *= TACTICAL_CONSTANTS.FORMATION_PHYSICS.damping;
                
                // Update position
                player.x += player.vx;
                player.y += player.vy;
                
                // Boundary checking
                player.x = Math.max(player.radius, Math.min(this.options.width - player.radius, player.x));
                player.y = Math.max(player.radius, Math.min(this.options.height - player.radius, player.y));
            });
            
            // Update effectiveness calculations
            this.updateEffectiveness();
        }
        
        updateEffectiveness() {
            this.players.forEach((player, index) => {
                player.effectiveness = this.calculatePositionEffectiveness(
                    { x: player.x / this.options.width, y: player.y / this.options.height, role: player.role },
                    index,
                    this.players.map(p => ({ x: p.x / this.options.width, y: p.y / this.options.height, role: p.role }))
                );
            });
        }
        
        render() {
            this.ctx.clearRect(0, 0, this.options.width, this.options.height);
            
            // Draw pitch
            this.drawPitch();
            
            // Draw tactical zones
            if (this.options.showZones) {
                this.drawTacticalZones();
            }
            
            // Draw connections
            if (this.options.showConnections) {
                this.drawPlayerConnections();
            }
            
            // Draw effectiveness indicators
            this.drawEffectivenessIndicators();
            
            // Draw players
            this.drawPlayers();
            
            // Draw real-time analysis
            if (this.options.realTimeAnalysis) {
                this.drawRealTimeAnalysis();
            }
        }
        
        drawPitch() {
            const ctx = this.ctx;
            const { width, height } = this.options;
            
            // Pitch gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#2d5a27');
            gradient.addColorStop(0.5, '#3a6d35');
            gradient.addColorStop(1, '#2d5a27');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Pitch markings
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            
            // Border
            ctx.strokeRect(1, 1, width - 2, height - 2);
            
            // Center line
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();
            
            // Center circle
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, height * 0.15, 0, Math.PI * 2);
            ctx.stroke();
            
            // Penalty areas (golden ratio proportioned)
            const penaltyWidth = width / GOLDEN_RATIO * 0.6;
            const penaltyHeight = height * 0.18;
            const penaltyX = (width - penaltyWidth) / 2;
            
            // Top penalty area
            ctx.strokeRect(penaltyX, 0, penaltyWidth, penaltyHeight);
            
            // Bottom penalty area
            ctx.strokeRect(penaltyX, height - penaltyHeight, penaltyWidth, penaltyHeight);
            
            // Goal areas
            const goalWidth = width / GOLDEN_RATIO * 0.35;
            const goalHeight = height * 0.08;
            const goalX = (width - goalWidth) / 2;
            
            ctx.strokeRect(goalX, 0, goalWidth, goalHeight);
            ctx.strokeRect(goalX, height - goalHeight, goalWidth, goalHeight);
        }
        
        drawTacticalZones() {
            const ctx = this.ctx;
            const { width, height } = this.options;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            
            // Defensive third
            ctx.fillRect(0, 0, width, height / 3);
            
            // Attacking third
            ctx.fillRect(0, height * 2/3, width, height / 3);
            
            // Zone labels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.font = `${FIBONACCI_SCALE.spacing.sm}px system-ui`;
            ctx.textAlign = 'center';
            
            ctx.fillText('DEFENSIVE THIRD', width / 2, height / 6);
            ctx.fillText('MIDDLE THIRD', width / 2, height / 2);
            ctx.fillText('ATTACKING THIRD', width / 2, height * 5/6);
        }
        
        drawPlayerConnections() {
            const ctx = this.ctx;
            
            this.players.forEach((player, index) => {
                this.players.forEach((other, otherIndex) => {
                    if (index >= otherIndex) return;
                    
                    const distance = Math.sqrt(
                        Math.pow(player.x - other.x, 2) + 
                        Math.pow(player.y - other.y, 2)
                    );
                    
                    if (distance < TACTICAL_CONSTANTS.FORMATION_PHYSICS.connectionRange) {
                        const strength = 1 - (distance / TACTICAL_CONSTANTS.FORMATION_PHYSICS.connectionRange);
                        
                        ctx.strokeStyle = `rgba(255, 255, 255, ${strength * 0.3})`;
                        ctx.lineWidth = strength * 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(player.x, player.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                });
            });
        }
        
        drawEffectivenessIndicators() {
            const ctx = this.ctx;
            
            this.players.forEach(player => {
                // Effectiveness ring
                const ringRadius = player.radius + 8;
                const effectiveness = player.effectiveness;
                
                ctx.beginPath();
                ctx.arc(player.x, player.y, ringRadius, 0, Math.PI * 2 * effectiveness);
                ctx.lineWidth = 3;
                ctx.strokeStyle = this.getEffectivenessColor(effectiveness);
                ctx.stroke();
            });
        }
        
        getEffectivenessColor(effectiveness) {
            if (effectiveness > 0.8) return COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.attack);
            if (effectiveness > 0.6) return COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.safe);
            if (effectiveness > 0.4) return COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.neutral);
            return COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.danger);
        }
        
        drawPlayers() {
            const ctx = this.ctx;
            
            this.players.forEach(player => {
                // Player circle background
                const roleColors = {
                    goalkeeper: '#FFA500',
                    defender: '#0094CC',
                    midfielder: '#00FF88',
                    attacker: '#FF6B35'
                };
                
                ctx.fillStyle = roleColors[player.role] || '#FFFFFF';
                
                // Add glow effect for selected player
                if (player.selected || this.draggedPlayer === player) {
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.shadowBlur = 20;
                }
                
                ctx.beginPath();
                ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Player border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                ctx.shadowBlur = 0; // Reset shadow
                
                // Player number
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `bold ${FIBONACCI_SCALE.spacing.md}px system-ui`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(player.number.toString(), player.x, player.y);
                
                // Player name
                ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.fillText(player.name, player.x, player.y + player.radius + 15);
                
                // Role abbreviation
                ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillText(player.id, player.x, player.y - player.radius - 10);
            });
        }
        
        drawRealTimeAnalysis() {
            const ctx = this.ctx;
            const analysisData = this.getFormationAnalysis();
            
            // Analysis panel background
            const panelX = this.options.width - 200;
            const panelY = 10;
            const panelWidth = 190;
            const panelHeight = 120;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
            
            // Analysis text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold ${FIBONACCI_SCALE.spacing.sm}px system-ui`;
            ctx.textAlign = 'left';
            ctx.fillText('Formation Analysis', panelX + 10, panelY + 20);
            
            ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
            ctx.fillText(`Width: ${analysisData.width.toFixed(1)}`, panelX + 10, panelY + 40);
            ctx.fillText(`Compactness: ${analysisData.compactness.toFixed(1)}`, panelX + 10, panelY + 55);
            ctx.fillText(`Balance: ${analysisData.balance.toFixed(1)}`, panelX + 10, panelY + 70);
            ctx.fillText(`Effectiveness: ${analysisData.overall.toFixed(1)}`, panelX + 10, panelY + 85);
            
            // Effectiveness bar
            const barWidth = panelWidth - 20;
            const barHeight = 8;
            const barX = panelX + 10;
            const barY = panelY + 95;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            ctx.fillStyle = this.getEffectivenessColor(analysisData.overall / 100);
            ctx.fillRect(barX, barY, barWidth * (analysisData.overall / 100), barHeight);
        }
        
        getFormationAnalysis() {
            if (this.players.length === 0) return { width: 0, compactness: 0, balance: 0, overall: 0 };
            
            // Calculate width (spread of players)
            const minX = Math.min(...this.players.map(p => p.x));
            const maxX = Math.max(...this.players.map(p => p.x));
            const width = ((maxX - minX) / this.options.width) * 100;
            
            // Calculate compactness (average distance between players)
            let totalDistance = 0;
            let connections = 0;
            
            this.players.forEach((player, i) => {
                this.players.forEach((other, j) => {
                    if (i < j) {
                        const distance = Math.sqrt(
                            Math.pow(player.x - other.x, 2) + 
                            Math.pow(player.y - other.y, 2)
                        );
                        totalDistance += distance;
                        connections++;
                    }
                });
            });
            
            const avgDistance = totalDistance / connections;
            const compactness = Math.max(0, 100 - (avgDistance / this.options.width) * 200);
            
            // Calculate balance (distribution across field)
            const centerX = this.options.width / 2;
            const leftPlayers = this.players.filter(p => p.x < centerX).length;
            const rightPlayers = this.players.filter(p => p.x >= centerX).length;
            const balance = 100 - Math.abs(leftPlayers - rightPlayers) * 10;
            
            // Overall effectiveness
            const avgEffectiveness = this.players.reduce((sum, p) => sum + p.effectiveness, 0) / this.players.length;
            const overall = avgEffectiveness * 100;
            
            return { width, compactness, balance, overall };
        }
        
        // Mouse event handlers
        handleMouseDown(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
            
            const clickedPlayer = this.getPlayerAtPosition(x, y);
            if (clickedPlayer) {
                this.isDragging = true;
                this.draggedPlayer = clickedPlayer;
                clickedPlayer.selected = true;
                
                // Clear other selections
                this.players.forEach(p => {
                    if (p !== clickedPlayer) p.selected = false;
                });
            }
        }
        
        handleMouseMove(event) {
            if (!this.isDragging || !this.draggedPlayer) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
            
            this.draggedPlayer.x = Math.max(this.draggedPlayer.radius, 
                Math.min(this.options.width - this.draggedPlayer.radius, x));
            this.draggedPlayer.y = Math.max(this.draggedPlayer.radius, 
                Math.min(this.options.height - this.draggedPlayer.radius, y));
            
            // Reset velocity when dragging
            this.draggedPlayer.vx = 0;
            this.draggedPlayer.vy = 0;
        }
        
        handleMouseUp() {
            this.isDragging = false;
            this.draggedPlayer = null;
        }
        
        // Touch event handlers for mobile
        handleTouchStart(event) {
            event.preventDefault();
            const touch = event.touches[0];
            this.handleMouseDown(touch);
        }
        
        handleTouchMove(event) {
            event.preventDefault();
            const touch = event.touches[0];
            this.handleMouseMove(touch);
        }
        
        handleTouchEnd(event) {
            event.preventDefault();
            this.handleMouseUp();
        }
        
        getPlayerAtPosition(x, y) {
            return this.players.find(player => {
                const distance = Math.sqrt(
                    Math.pow(player.x - x, 2) + 
                    Math.pow(player.y - y, 2)
                );
                return distance <= player.radius;
            });
        }
        
        // Public API
        changeFormation(formationName) {
            const newPlayers = this.getFormationPositions(formationName);
            
            // Animate transition
            this.animateFormationTransition(newPlayers);
        }
        
        animateFormationTransition(newPlayers) {
            const duration = ANIMATION_TIMING.durations.long;
            const startTime = performance.now();
            const startPositions = this.players.map(p => ({ x: p.x, y: p.y }));
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easeInOutCubic(progress);
                
                this.players.forEach((player, index) => {
                    if (newPlayers[index]) {
                        const startPos = startPositions[index];
                        const endPos = { 
                            x: newPlayers[index].x * this.options.width, 
                            y: newPlayers[index].y * this.options.height 
                        };
                        
                        player.x = startPos.x + (endPos.x - startPos.x) * easedProgress;
                        player.y = startPos.y + (endPos.y - startPos.y) * easedProgress;
                        player.originalX = endPos.x;
                        player.originalY = endPos.y;
                        
                        // Update player data
                        Object.assign(player, newPlayers[index]);
                    }
                });
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.players = newPlayers.map((p, i) => ({
                        ...p,
                        x: p.x * this.options.width,
                        y: p.y * this.options.height,
                        originalX: p.x * this.options.width,
                        originalY: p.y * this.options.height,
                        vx: 0,
                        vy: 0,
                        radius: TACTICAL_CONSTANTS.FORMATION_PHYSICS.playerRadius,
                        selected: false,
                        effectiveness: this.players[i]?.effectiveness || 0.5
                    }));
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        
        destroy() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // =====================================================
    // 2. TACTICAL HEAT MAPS
    // =====================================================

    class TacticalHeatMap {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                width: TACTICAL_CONSTANTS.PITCH_DIMENSIONS.width,
                height: TACTICAL_CONSTANTS.PITCH_DIMENSIONS.height,
                resolution: TACTICAL_CONSTANTS.HEAT_MAP_RESOLUTION,
                timeProgression: true,
                dataSource: 'live', // 'live', 'historical', 'simulation'
                heatType: 'possession', // 'possession', 'attacking', 'defensive', 'movement'
                ...options
            };
            
            this.canvas = null;
            this.ctx = null;
            this.heatData = [];
            this.timeFrame = 0;
            this.animationFrame = null;
            
            this.init();
        }
        
        init() {
            this.createCanvas();
            this.generateHeatData();
            this.startAnimation();
        }
        
        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            this.canvas.style.width = '100%';
            this.canvas.style.height = 'auto';
            this.canvas.style.maxWidth = `${this.options.width}px`;
            this.canvas.style.borderRadius = `${FIBONACCI_SCALE.spacing.sm}px`;
            
            this.ctx = this.canvas.getContext('2d');
            this.container.appendChild(this.canvas);
        }
        
        generateHeatData() {
            const { resolution } = this.options;
            const cellWidth = this.options.width / resolution;
            const cellHeight = this.options.height / resolution;
            
            this.heatData = [];
            
            for (let frame = 0; frame < 90; frame++) { // 90 time frames (match minutes)
                const frameData = [];
                
                for (let y = 0; y < resolution; y++) {
                    const row = [];
                    for (let x = 0; x < resolution; x++) {
                        const centerX = x * cellWidth + cellWidth / 2;
                        const centerY = y * cellHeight + cellHeight / 2;
                        
                        // Generate heat intensity based on tactical patterns
                        let intensity = this.calculateHeatIntensity(centerX, centerY, frame);
                        
                        row.push({
                            x: centerX,
                            y: centerY,
                            intensity: intensity,
                            maxIntensity: intensity,
                            change: 0,
                            historical: []
                        });
                    }
                    frameData.push(row);
                }
                
                this.heatData.push(frameData);
            }
        }
        
        calculateHeatIntensity(x, y, timeFrame) {
            const { width, height, heatType } = this.options;
            
            // Normalize coordinates
            const normalX = x / width;
            const normalY = y / height;
            
            let intensity = 0;
            
            switch (heatType) {
                case 'possession':
                    intensity = this.calculatePossessionHeat(normalX, normalY, timeFrame);
                    break;
                case 'attacking':
                    intensity = this.calculateAttackingHeat(normalX, normalY, timeFrame);
                    break;
                case 'defensive':
                    intensity = this.calculateDefensiveHeat(normalX, normalY, timeFrame);
                    break;
                case 'movement':
                    intensity = this.calculateMovementHeat(normalX, normalY, timeFrame);
                    break;
                default:
                    intensity = Math.random() * 0.8 + 0.1;
            }
            
            return Math.max(0, Math.min(1, intensity));
        }
        
        calculatePossessionHeat(x, y, time) {
            // Central areas typically have higher possession
            const centerX = 0.5;
            const centerY = 0.5;
            const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            let intensity = Math.max(0, 1 - distanceFromCenter * 1.5);
            
            // Add time-based variation
            intensity += Math.sin(time * 0.1 + x * 3 + y * 2) * 0.2;
            
            // Midfield emphasis
            if (y > 0.3 && y < 0.7) {
                intensity *= 1.3;
            }
            
            return intensity;
        }
        
        calculateAttackingHeat(x, y, time) {
            // Higher intensity in attacking third
            let intensity = 0;
            
            if (y > 0.6) { // Attacking third
                intensity = 0.7 + (y - 0.6) * 0.75;
                
                // Wing areas for crosses
                if (x < 0.2 || x > 0.8) {
                    intensity *= 1.2;
                }
                
                // Central penalty area
                if (x > 0.35 && x < 0.65 && y > 0.8) {
                    intensity *= 1.5;
                }
            } else {
                intensity = Math.max(0, 0.4 - (0.6 - y) * 0.5);
            }
            
            // Add time variation for attack waves
            intensity += Math.sin(time * 0.15 + x * 2) * 0.15;
            
            return intensity;
        }
        
        calculateDefensiveHeat(x, y, time) {
            // Higher intensity in defensive third
            let intensity = 0;
            
            if (y < 0.4) { // Defensive third
                intensity = 0.8 - y * 0.5;
                
                // Central defensive areas
                if (x > 0.3 && x < 0.7) {
                    intensity *= 1.3;
                }
                
                // Penalty area
                if (x > 0.35 && x < 0.65 && y < 0.18) {
                    intensity *= 1.4;
                }
            } else {
                intensity = Math.max(0, 0.3 - (y - 0.4) * 0.3);
            }
            
            // Add pressing phases
            intensity += Math.sin(time * 0.08) * 0.1;
            
            return intensity;
        }
        
        calculateMovementHeat(x, y, time) {
            // Player movement patterns
            let intensity = 0.2;
            
            // Simulate player paths
            const paths = [
                { startX: 0.2, startY: 0.7, endX: 0.8, endY: 0.8 }, // Wing run
                { startX: 0.5, startY: 0.4, endX: 0.5, endY: 0.8 }, // Central run
                { startX: 0.15, startY: 0.3, endX: 0.35, endY: 0.6 }, // Overlap
            ];
            
            paths.forEach(path => {
                const pathProgress = (time % 30) / 30;
                const pathX = path.startX + (path.endX - path.startX) * pathProgress;
                const pathY = path.startY + (path.endY - path.startY) * pathProgress;
                
                const distanceToPath = Math.sqrt(Math.pow(x - pathX, 2) + Math.pow(y - pathY, 2));
                if (distanceToPath < 0.1) {
                    intensity += 0.6 * (1 - distanceToPath / 0.1);
                }
            });
            
            return intensity;
        }
        
        startAnimation() {
            if (!this.options.timeProgression) {
                this.render();
                return;
            }
            
            const animate = () => {
                this.timeFrame = (this.timeFrame + 0.5) % this.heatData.length;
                this.render();
                this.animationFrame = requestAnimationFrame(animate);
            };
            
            this.animationFrame = requestAnimationFrame(animate);
        }
        
        render() {
            const ctx = this.ctx;
            const { width, height, resolution } = this.options;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Draw pitch background
            this.drawPitchBackground();
            
            // Draw heat map
            const frameIndex = Math.floor(this.timeFrame);
            const frameData = this.heatData[frameIndex];
            
            if (frameData) {
                this.drawHeatData(frameData);
            }
            
            // Draw overlay information
            this.drawOverlay();
        }
        
        drawPitchBackground() {
            const ctx = this.ctx;
            const { width, height } = this.options;
            
            // Pitch background
            ctx.fillStyle = 'rgba(45, 90, 39, 0.8)';
            ctx.fillRect(0, 0, width, height);
            
            // Pitch markings (minimal)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            
            // Border
            ctx.strokeRect(0, 0, width, height);
            
            // Center line
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();
        }
        
        drawHeatData(frameData) {
            const ctx = this.ctx;
            const { resolution } = this.options;
            const cellWidth = this.options.width / resolution;
            const cellHeight = this.options.height / resolution;
            
            frameData.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell.intensity > 0.1) {
                        const alpha = cell.intensity * 0.8;
                        const color = this.getHeatColor(cell.intensity);
                        
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
                        ctx.fillRect(
                            x * cellWidth,
                            y * cellHeight,
                            cellWidth,
                            cellHeight
                        );
                    }
                });
            });
        }
        
        getHeatColor(intensity) {
            // Heat map color progression: Blue -> Green -> Yellow -> Orange -> Red
            const colors = [
                { r: 0, g: 100, b: 255 },     // Cold - Blue
                { r: 0, g: 255, b: 100 },     // Cool - Green
                { r: 255, g: 255, b: 0 },     // Warm - Yellow
                { r: 255, g: 150, b: 0 },     // Hot - Orange
                { r: 255, g: 50, b: 50 }      // Very Hot - Red
            ];
            
            const scaledIntensity = intensity * (colors.length - 1);
            const index = Math.floor(scaledIntensity);
            const factor = scaledIntensity - index;
            
            if (index >= colors.length - 1) {
                return colors[colors.length - 1];
            }
            
            const color1 = colors[index];
            const color2 = colors[index + 1];
            
            return {
                r: Math.round(color1.r + (color2.r - color1.r) * factor),
                g: Math.round(color1.g + (color2.g - color1.g) * factor),
                b: Math.round(color1.b + (color2.b - color1.b) * factor)
            };
        }
        
        drawOverlay() {
            const ctx = this.ctx;
            
            // Time indicator
            const minute = Math.floor(this.timeFrame);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, 10, 80, 30);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `${FIBONACCI_SCALE.spacing.sm}px system-ui`;
            ctx.textAlign = 'center';
            ctx.fillText(`${minute}'`, 50, 30);
            
            // Heat type indicator
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(this.options.width - 120, 10, 110, 30);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(this.options.heatType.toUpperCase(), this.options.width - 65, 30);
            
            // Legend
            this.drawLegend();
        }
        
        drawLegend() {
            const ctx = this.ctx;
            const legendWidth = 150;
            const legendHeight = 20;
            const legendX = (this.options.width - legendWidth) / 2;
            const legendY = this.options.height - 40;
            
            // Legend background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(legendX - 10, legendY - 5, legendWidth + 20, legendHeight + 10);
            
            // Legend gradient
            const gradient = ctx.createLinearGradient(legendX, legendY, legendX + legendWidth, legendY);
            gradient.addColorStop(0, 'rgba(0, 100, 255, 0.8)');
            gradient.addColorStop(0.25, 'rgba(0, 255, 100, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.8)');
            gradient.addColorStop(0.75, 'rgba(255, 150, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 50, 50, 0.8)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
            
            // Legend labels
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
            ctx.textAlign = 'left';
            ctx.fillText('Low', legendX, legendY + legendHeight + 12);
            
            ctx.textAlign = 'right';
            ctx.fillText('High', legendX + legendWidth, legendY + legendHeight + 12);
        }
        
        // Public API
        setHeatType(type) {
            this.options.heatType = type;
            this.generateHeatData();
        }
        
        setTimeFrame(frame) {
            this.timeFrame = frame;
            this.render();
        }
        
        destroy() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // =====================================================
    // 3. MATCH ANALYSIS COMPONENTS
    // =====================================================

    class MatchAnalysisComponents {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                showXGFlow: true,
                showPossessionTerritory: true,
                showTimeline: true,
                showPlayerRadars: true,
                showComparison: true,
                ...options
            };
            
            this.matchData = this.generateMatchData();
            this.components = new Map();
            
            this.init();
        }
        
        init() {
            this.createLayout();
            
            if (this.options.showXGFlow) {
                this.createXGFlowChart();
            }
            
            if (this.options.showPossessionTerritory) {
                this.createPossessionTerritoryMap();
            }
            
            if (this.options.showTimeline) {
                this.createMatchTimeline();
            }
            
            if (this.options.showPlayerRadars) {
                this.createPlayerRadarCharts();
            }
            
            if (this.options.showComparison) {
                this.createTeamComparisonWidget();
            }
        }
        
        createLayout() {
            this.container.innerHTML = `
                <div class="match-analysis-layout">
                    <div class="analysis-header">
                        <h2>Match Analysis Dashboard</h2>
                        <div class="analysis-controls">
                            <button class="analysis-toggle" data-component="xg">xG Flow</button>
                            <button class="analysis-toggle" data-component="territory">Territory</button>
                            <button class="analysis-toggle" data-component="timeline">Timeline</button>
                            <button class="analysis-toggle" data-component="radars">Player Radars</button>
                            <button class="analysis-toggle" data-component="comparison">Comparison</button>
                        </div>
                    </div>
                    <div class="analysis-grid">
                        <div class="analysis-section" id="xg-flow-section"></div>
                        <div class="analysis-section" id="territory-section"></div>
                        <div class="analysis-section" id="timeline-section"></div>
                        <div class="analysis-section" id="radars-section"></div>
                        <div class="analysis-section" id="comparison-section"></div>
                    </div>
                </div>
            `;
            
            this.setupEventListeners();
        }
        
        setupEventListeners() {
            const toggles = this.container.querySelectorAll('.analysis-toggle');
            toggles.forEach(toggle => {
                toggle.addEventListener('click', (e) => {
                    const component = e.target.dataset.component;
                    const section = this.container.querySelector(`#${component}-section`);
                    
                    if (section.style.display === 'none') {
                        section.style.display = 'block';
                        toggle.classList.add('active');
                    } else {
                        section.style.display = 'none';
                        toggle.classList.remove('active');
                    }
                });
            });
        }
        
        generateMatchData() {
            // Generate realistic match data
            const minutes = 90;
            const xgData = [];
            const possessionData = [];
            const events = [];
            
            // Generate xG flow data
            let homeXG = 0;
            let awayXG = 0;
            
            for (let minute = 0; minute <= minutes; minute++) {
                // Random xG increments based on realistic patterns
                const homeIncrement = Math.random() < 0.08 ? Math.random() * 0.3 : 0;
                const awayIncrement = Math.random() < 0.08 ? Math.random() * 0.3 : 0;
                
                homeXG += homeIncrement;
                awayXG += awayIncrement;
                
                xgData.push({
                    minute,
                    homeXG: Math.round(homeXG * 100) / 100,
                    awayXG: Math.round(awayXG * 100) / 100,
                    homeIncrement,
                    awayIncrement
                });
                
                // Generate possession data
                const basePossession = 55 + Math.sin(minute * 0.1) * 10; // Varying possession
                possessionData.push({
                    minute,
                    homePossession: Math.max(20, Math.min(80, basePossession + (Math.random() - 0.5) * 10)),
                    awayPossession: 100 - basePossession
                });
                
                // Generate events
                if (Math.random() < 0.02) { // Goals
                    events.push({
                        minute,
                        type: 'goal',
                        team: Math.random() < 0.6 ? 'home' : 'away',
                        player: this.getRandomPlayer(),
                        xg: Math.random() * 0.8 + 0.1
                    });
                } else if (Math.random() < 0.05) { // Cards
                    events.push({
                        minute,
                        type: Math.random() < 0.8 ? 'yellow' : 'red',
                        team: Math.random() < 0.5 ? 'home' : 'away',
                        player: this.getRandomPlayer()
                    });
                } else if (Math.random() < 0.03) { // Substitutions
                    events.push({
                        minute,
                        type: 'substitution',
                        team: Math.random() < 0.5 ? 'home' : 'away',
                        playerOut: this.getRandomPlayer(),
                        playerIn: this.getRandomPlayer()
                    });
                }
            }
            
            return { xgData, possessionData, events };
        }
        
        getRandomPlayer() {
            const players = [
                'Rashford', 'Fernandes', 'Højlund', 'Casemiro', 'Shaw', 'Dalot',
                'Varane', 'Martinez', 'Eriksen', 'Antony', 'de Gea'
            ];
            return players[Math.floor(Math.random() * players.length)];
        }
        
        createXGFlowChart() {
            const section = this.container.querySelector('#xg-flow-section');
            const canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 300;
            canvas.style.width = '100%';
            canvas.style.maxWidth = '600px';
            
            section.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            const { xgData } = this.matchData;
            
            // Draw chart background
            ctx.fillStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.neutral);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw axes
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            
            // X-axis (time)
            ctx.beginPath();
            ctx.moveTo(50, canvas.height - 50);
            ctx.lineTo(canvas.width - 50, canvas.height - 50);
            ctx.stroke();
            
            // Y-axis (xG)
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(50, canvas.height - 50);
            ctx.stroke();
            
            // Draw xG lines
            const maxXG = Math.max(...xgData.map(d => Math.max(d.homeXG, d.awayXG)));
            const xScale = (canvas.width - 100) / 90; // 90 minutes
            const yScale = (canvas.height - 100) / maxXG;
            
            // Home team line
            ctx.strokeStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.attack);
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            xgData.forEach((point, index) => {
                const x = 50 + point.minute * xScale;
                const y = canvas.height - 50 - point.homeXG * yScale;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            
            // Away team line
            ctx.strokeStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.focus);
            ctx.beginPath();
            
            xgData.forEach((point, index) => {
                const x = 50 + point.minute * xScale;
                const y = canvas.height - 50 - point.awayXG * yScale;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            
            // Draw labels
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `${FIBONACCI_SCALE.spacing.sm}px system-ui`;
            ctx.textAlign = 'center';
            ctx.fillText('xG Flow Chart', canvas.width / 2, 30);
            
            ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
            ctx.fillText('Minutes', canvas.width / 2, canvas.height - 10);
            
            ctx.save();
            ctx.translate(20, canvas.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Expected Goals', 0, 0);
            ctx.restore();
            
            // Legend
            ctx.fillStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.attack);
            ctx.fillRect(canvas.width - 150, 50, 20, 10);
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText('Home Team', canvas.width - 125, 60);
            
            ctx.fillStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.focus);
            ctx.fillRect(canvas.width - 150, 70, 20, 10);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('Away Team', canvas.width - 125, 80);
            
            this.components.set('xgFlow', { canvas, ctx });
        }
        
        createPossessionTerritoryMap() {
            const section = this.container.querySelector('#territory-section');
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            canvas.style.width = '100%';
            canvas.style.maxWidth = '400px';
            
            section.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            
            // Draw pitch
            this.drawPitchOutline(ctx, canvas.width, canvas.height);
            
            // Draw territory zones based on possession data
            this.drawTerritoryZones(ctx, canvas.width, canvas.height);
            
            this.components.set('territory', { canvas, ctx });
        }
        
        drawPitchOutline(ctx, width, height) {
            // Pitch background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#2d5a27');
            gradient.addColorStop(1, '#1f4f1f');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Pitch markings
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, width, height);
            
            // Center line
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();
        }
        
        drawTerritoryZones(ctx, width, height) {
            // Create possession territory visualization
            const zones = [
                { x: 0, y: 0, w: width, h: height * 0.3, possession: 0.3, team: 'away' },
                { x: 0, y: height * 0.3, w: width, h: height * 0.4, possession: 0.6, team: 'home' },
                { x: 0, y: height * 0.7, w: width, h: height * 0.3, possession: 0.7, team: 'home' }
            ];
            
            zones.forEach(zone => {
                const alpha = zone.possession * 0.5;
                const color = zone.team === 'home' 
                    ? `rgba(255, 107, 53, ${alpha})` 
                    : `rgba(0, 148, 204, ${alpha})`;
                
                ctx.fillStyle = color;
                ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
            });
            
            // Add possession percentages
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold ${FIBONACCI_SCALE.spacing.sm}px system-ui`;
            ctx.textAlign = 'center';
            
            zones.forEach((zone, index) => {
                const centerY = zone.y + zone.h / 2;
                const percentage = Math.round(zone.possession * 100);
                ctx.fillText(`${percentage}%`, width / 2, centerY);
            });
        }
        
        createMatchTimeline() {
            const section = this.container.querySelector('#timeline-section');
            section.innerHTML = `
                <div class="match-timeline">
                    <h3>Key Moments</h3>
                    <div class="timeline-container">
                        ${this.renderTimelineEvents()}
                    </div>
                </div>
            `;
        }
        
        renderTimelineEvents() {
            const { events } = this.matchData;
            
            return events.map(event => {
                const eventIcon = this.getEventIcon(event.type);
                const eventColor = this.getEventColor(event.type);
                
                return `
                    <div class="timeline-event" style="left: ${(event.minute / 90) * 100}%">
                        <div class="event-marker" style="background: ${eventColor}">
                            ${eventIcon}
                        </div>
                        <div class="event-details">
                            <div class="event-time">${event.minute}'</div>
                            <div class="event-description">${this.getEventDescription(event)}</div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        getEventIcon(type) {
            const icons = {
                goal: '⚽',
                yellow: '🟨',
                red: '🟥',
                substitution: '🔄'
            };
            return icons[type] || '•';
        }
        
        getEventColor(type) {
            const colors = {
                goal: COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.triumph),
                yellow: '#FFA500',
                red: COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.danger),
                substitution: COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.focus)
            };
            return colors[type] || '#FFFFFF';
        }
        
        getEventDescription(event) {
            switch (event.type) {
                case 'goal':
                    return `${event.player} (${event.xg.toFixed(2)} xG)`;
                case 'yellow':
                case 'red':
                    return `${event.player} (${event.type} card)`;
                case 'substitution':
                    return `${event.playerOut} ↔ ${event.playerIn}`;
                default:
                    return '';
            }
        }
        
        createPlayerRadarCharts() {
            const section = this.container.querySelector('#radars-section');
            section.innerHTML = `
                <div class="player-radars">
                    <h3>Player Performance Radars</h3>
                    <div class="radars-grid">
                        ${this.renderPlayerRadars()}
                    </div>
                </div>
            `;
        }
        
        renderPlayerRadars() {
            const players = [
                { name: 'Fernandes', position: 'AM', stats: [85, 75, 90, 70, 80, 88] },
                { name: 'Casemiro', position: 'DM', stats: [60, 90, 70, 85, 75, 65] },
                { name: 'Rashford', position: 'LW', stats: [90, 65, 80, 60, 85, 82] }
            ];
            
            const attributes = ['Pace', 'Defending', 'Passing', 'Physical', 'Shooting', 'Dribbling'];
            
            return players.map(player => {
                const canvasId = `radar-${player.name.toLowerCase()}`;
                
                setTimeout(() => {
                    this.drawRadarChart(canvasId, player.stats, attributes);
                }, 100);
                
                return `
                    <div class="player-radar">
                        <h4>${player.name} (${player.position})</h4>
                        <canvas id="${canvasId}" width="200" height="200"></canvas>
                    </div>
                `;
            }).join('');
        }
        
        drawRadarChart(canvasId, stats, attributes) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background circles
            for (let i = 1; i <= 5; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, (radius * i) / 5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
            }
            
            // Draw axes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            const angleStep = (Math.PI * 2) / attributes.length;
            
            for (let i = 0; i < attributes.length; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
                
                // Draw attribute labels
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.textAlign = 'center';
                
                const labelX = centerX + Math.cos(angle) * (radius + 15);
                const labelY = centerY + Math.sin(angle) * (radius + 15);
                ctx.fillText(attributes[i], labelX, labelY);
            }
            
            // Draw stats polygon
            ctx.beginPath();
            stats.forEach((stat, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const distance = (stat / 100) * radius;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.closePath();
            
            // Fill and stroke
            ctx.fillStyle = 'rgba(0, 148, 204, 0.3)';
            ctx.fill();
            ctx.strokeStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.focus);
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw stat points
            stats.forEach((stat, index) => {
                const angle = index * angleStep - Math.PI / 2;
                const distance = (stat / 100) * radius;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = COLOR_HARMONY.toCSS(TACTICAL_CONSTANTS.TACTICAL_COLORS.focus);
                ctx.fill();
            });
        }
        
        createTeamComparisonWidget() {
            const section = this.container.querySelector('#comparison-section');
            section.innerHTML = `
                <div class="team-comparison">
                    <h3>Team Performance Comparison</h3>
                    <div class="comparison-stats">
                        ${this.renderComparisonStats()}
                    </div>
                </div>
            `;
        }
        
        renderComparisonStats() {
            const stats = [
                { label: 'Possession', home: 58, away: 42 },
                { label: 'Shots', home: 12, away: 8 },
                { label: 'Shots on Target', home: 5, away: 3 },
                { label: 'Expected Goals', home: 1.8, away: 1.2 },
                { label: 'Pass Accuracy', home: 87, away: 79 },
                { label: 'Tackles', home: 18, away: 22 },
                { label: 'Aerial Duels Won', home: 15, away: 12 },
                { label: 'Distance Covered', home: 108.2, away: 105.7 }
            ];
            
            return stats.map(stat => {
                const homePercent = stat.home / (stat.home + stat.away) * 100;
                const awayPercent = 100 - homePercent;
                
                return `
                    <div class="stat-comparison">
                        <div class="stat-label">${stat.label}</div>
                        <div class="stat-values">
                            <span class="home-value">${stat.home}</span>
                            <div class="stat-bar">
                                <div class="home-bar" style="width: ${homePercent}%"></div>
                                <div class="away-bar" style="width: ${awayPercent}%"></div>
                            </div>
                            <span class="away-value">${stat.away}</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        destroy() {
            this.components.forEach(component => {
                if (component.canvas && component.canvas.parentNode) {
                    component.canvas.parentNode.removeChild(component.canvas);
                }
            });
            
            this.components.clear();
        }
    }

    // =====================================================
    // 4. SET PIECE DESIGNER
    // =====================================================

    class SetPieceDesigner {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                setPieceType: 'corner', // 'corner', 'freekick', 'throw-in'
                interactive: true,
                showProbabilities: true,
                showPlayerMovement: true,
                ...options
            };
            
            this.canvas = null;
            this.ctx = null;
            this.players = [];
            this.routes = [];
            this.ballPosition = { x: 0, y: 0 };
            this.animationFrame = null;
            this.animationTime = 0;
            
            this.init();
        }
        
        init() {
            this.createInterface();
            this.createCanvas();
            this.setupSetPiece(this.options.setPieceType);
            this.startAnimation();
        }
        
        createInterface() {
            this.container.innerHTML = `
                <div class="set-piece-designer">
                    <div class="designer-header">
                        <h3>Set Piece Designer</h3>
                        <div class="set-piece-controls">
                            <select id="setPieceType" onchange="this.parentNode.parentNode.parentNode.setPieceDesigner.changeSetPiece(this.value)">
                                <option value="corner">Corner Kick</option>
                                <option value="freekick">Free Kick</option>
                                <option value="throw-in">Throw-in</option>
                            </select>
                            <button onclick="this.parentNode.parentNode.parentNode.setPieceDesigner.playAnimation()">Play Animation</button>
                            <button onclick="this.parentNode.parentNode.parentNode.setPieceDesigner.resetSetPiece()">Reset</button>
                        </div>
                    </div>
                    <div class="designer-content">
                        <div class="canvas-container"></div>
                        <div class="set-piece-analysis">
                            <h4>Success Probability</h4>
                            <div class="probability-display">
                                <div class="probability-meter">
                                    <div class="probability-fill" id="probabilityFill"></div>
                                </div>
                                <span class="probability-text" id="probabilityText">75%</span>
                            </div>
                            <div class="analysis-breakdown">
                                <div class="analysis-item">
                                    <span>Player Positioning:</span>
                                    <span class="analysis-score" id="positioningScore">8.5/10</span>
                                </div>
                                <div class="analysis-item">
                                    <span>Route Efficiency:</span>
                                    <span class="analysis-score" id="routeScore">7.2/10</span>
                                </div>
                                <div class="analysis-item">
                                    <span>Tactical Surprise:</span>
                                    <span class="analysis-score" id="surpriseScore">6.8/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Store reference for callbacks
            this.container.setPieceDesigner = this;
        }
        
        createCanvas() {
            const canvasContainer = this.container.querySelector('.canvas-container');
            
            this.canvas = document.createElement('canvas');
            this.canvas.width = 500;
            this.canvas.height = 400;
            this.canvas.style.width = '100%';
            this.canvas.style.maxWidth = '500px';
            this.canvas.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            this.canvas.style.borderRadius = `${FIBONACCI_SCALE.spacing.sm}px`;
            
            this.ctx = this.canvas.getContext('2d');
            canvasContainer.appendChild(this.canvas);
            
            if (this.options.interactive) {
                this.setupCanvasInteraction();
            }
        }
        
        setupCanvasInteraction() {
            this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        }
        
        setupSetPiece(type) {
            this.options.setPieceType = type;
            
            switch (type) {
                case 'corner':
                    this.setupCornerKick();
                    break;
                case 'freekick':
                    this.setupFreeKick();
                    break;
                case 'throw-in':
                    this.setupThrowIn();
                    break;
            }
            
            this.updateAnalysis();
        }
        
        setupCornerKick() {
            this.ballPosition = { x: 485, y: 385 }; // Bottom right corner
            
            this.players = [
                // Attacking players
                { id: 'taker', x: 470, y: 370, role: 'taker', team: 'attacking', movable: false },
                { id: 'striker', x: 250, y: 100, role: 'target', team: 'attacking', movable: true },
                { id: 'midfielder1', x: 200, y: 150, role: 'support', team: 'attacking', movable: true },
                { id: 'midfielder2', x: 300, y: 180, role: 'support', team: 'attacking', movable: true },
                { id: 'winger', x: 180, y: 200, role: 'wide', team: 'attacking', movable: true },
                
                // Defending players
                { id: 'gk', x: 250, y: 30, role: 'goalkeeper', team: 'defending', movable: true },
                { id: 'defender1', x: 220, y: 80, role: 'marker', team: 'defending', movable: true },
                { id: 'defender2', x: 280, y: 85, role: 'marker', team: 'defending', movable: true },
                { id: 'defender3', x: 190, y: 120, role: 'marker', team: 'defending', movable: true },
                { id: 'defender4', x: 320, y: 125, role: 'marker', team: 'defending', movable: true }
            ];
            
            this.routes = [
                { from: 'taker', to: 'striker', type: 'cross', probability: 0.8 },
                { from: 'taker', to: 'midfielder1', type: 'short', probability: 0.6 },
                { from: 'striker', to: 'goal', type: 'header', probability: 0.7 },
                { from: 'midfielder2', to: 'goal', type: 'shot', probability: 0.5 }
            ];
        }
        
        setupFreeKick() {
            this.ballPosition = { x: 250, y: 250 }; // Center of pitch area
            
            this.players = [
                // Attacking players
                { id: 'taker', x: 240, y: 265, role: 'taker', team: 'attacking', movable: false },
                { id: 'striker', x: 250, y: 120, role: 'target', team: 'attacking', movable: true },
                { id: 'midfielder1', x: 200, y: 200, role: 'support', team: 'attacking', movable: true },
                { id: 'midfielder2', x: 300, y: 210, role: 'support', team: 'attacking', movable: true },
                
                // Defending players - wall
                { id: 'gk', x: 250, y: 30, role: 'goalkeeper', team: 'defending', movable: true },
                { id: 'wall1', x: 230, y: 200, role: 'wall', team: 'defending', movable: true },
                { id: 'wall2', x: 250, y: 200, role: 'wall', team: 'defending', movable: true },
                { id: 'wall3', x: 270, y: 200, role: 'wall', team: 'defending', movable: true },
                { id: 'defender1', x: 200, y: 100, role: 'marker', team: 'defending', movable: true }
            ];
            
            this.routes = [
                { from: 'taker', to: 'goal', type: 'direct', probability: 0.4 },
                { from: 'taker', to: 'striker', type: 'pass', probability: 0.7 },
                { from: 'taker', to: 'midfielder1', type: 'layoff', probability: 0.8 },
                { from: 'striker', to: 'goal', type: 'shot', probability: 0.6 }
            ];
        }
        
        setupThrowIn() {
            this.ballPosition = { x: 10, y: 200 }; // Left side
            
            this.players = [
                // Attacking players
                { id: 'thrower', x: 0, y: 200, role: 'taker', team: 'attacking', movable: false },
                { id: 'receiver1', x: 80, y: 150, role: 'target', team: 'attacking', movable: true },
                { id: 'receiver2', x: 120, y: 250, role: 'support', team: 'attacking', movable: true },
                { id: 'midfielder', x: 200, y: 200, role: 'support', team: 'attacking', movable: true },
                
                // Defending players
                { id: 'marker1', x: 90, y: 160, role: 'marker', team: 'defending', movable: true },
                { id: 'marker2', x: 130, y: 260, role: 'marker', team: 'defending', movable: true },
                { id: 'sweeper', x: 180, y: 180, role: 'cover', team: 'defending', movable: true }
            ];
            
            this.routes = [
                { from: 'thrower', to: 'receiver1', type: 'throw', probability: 0.8 },
                { from: 'thrower', to: 'receiver2', type: 'throw', probability: 0.7 },
                { from: 'receiver1', to: 'midfielder', type: 'pass', probability: 0.7 },
                { from: 'receiver2', to: 'midfielder', type: 'pass', probability: 0.6 }
            ];
        }
        
        startAnimation() {
            const animate = (currentTime) => {
                this.animationTime = currentTime;
                this.render();
                this.animationFrame = requestAnimationFrame(animate);
            };
            
            this.animationFrame = requestAnimationFrame(animate);
        }
        
        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw pitch area
            this.drawPitchArea();
            
            // Draw routes
            if (this.options.showPlayerMovement) {
                this.drawRoutes();
            }
            
            // Draw players
            this.drawPlayers();
            
            // Draw ball
            this.drawBall();
            
            // Draw success zones
            if (this.options.showProbabilities) {
                this.drawSuccessZones();
            }
        }
        
        drawPitchArea() {
            const ctx = this.ctx;
            
            // Pitch background for relevant area
            if (this.options.setPieceType === 'corner') {
                // Penalty area
                ctx.fillStyle = 'rgba(45, 90, 39, 0.8)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Penalty box
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.strokeRect(150, 0, 200, 120);
                
                // Goal area
                ctx.strokeRect(200, 0, 100, 60);
                
                // Corner arc
                ctx.beginPath();
                ctx.arc(this.canvas.width, this.canvas.height, 20, Math.PI, 3 * Math.PI / 2);
                ctx.stroke();
                
            } else if (this.options.setPieceType === 'freekick') {
                // General pitch area
                ctx.fillStyle = 'rgba(45, 90, 39, 0.8)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Goal
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 3;
                ctx.strokeRect(220, 0, 60, 15);
                
            } else { // throw-in
                ctx.fillStyle = 'rgba(45, 90, 39, 0.8)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Touchline
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, this.canvas.height);
                ctx.stroke();
            }
        }
        
        drawRoutes() {
            const ctx = this.ctx;
            
            this.routes.forEach(route => {
                const fromPlayer = this.players.find(p => p.id === route.from);
                const toPosition = route.to === 'goal' ? this.getGoalPosition() : this.players.find(p => p.id === route.to);
                
                if (!fromPlayer || !toPosition) return;
                
                // Draw route line
                const alpha = route.probability;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 5]);
                
                ctx.beginPath();
                ctx.moveTo(fromPlayer.x, fromPlayer.y);
                
                // Add curve for more realistic ball trajectory
                const midX = (fromPlayer.x + toPosition.x) / 2;
                const midY = (fromPlayer.y + toPosition.y) / 2 - 30; // Arc upward
                
                ctx.quadraticCurveTo(midX, midY, toPosition.x, toPosition.y);
                ctx.stroke();
                
                ctx.setLineDash([]); // Reset dash
                
                // Draw arrow
                this.drawArrow(ctx, fromPlayer, toPosition, route.probability);
                
                // Draw probability label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.round(route.probability * 100)}%`, midX, midY - 10);
            });
        }
        
        drawArrow(ctx, from, to, probability) {
            const angle = Math.atan2(to.y - from.y, to.x - from.x);
            const arrowLength = 15;
            const arrowAngle = Math.PI / 6;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${probability})`;
            ctx.lineWidth = 2;
            
            // Arrow head
            ctx.beginPath();
            ctx.moveTo(
                to.x - arrowLength * Math.cos(angle - arrowAngle),
                to.y - arrowLength * Math.sin(angle - arrowAngle)
            );
            ctx.lineTo(to.x, to.y);
            ctx.lineTo(
                to.x - arrowLength * Math.cos(angle + arrowAngle),
                to.y - arrowLength * Math.sin(angle + arrowAngle)
            );
            ctx.stroke();
        }
        
        drawPlayers() {
            const ctx = this.ctx;
            
            this.players.forEach(player => {
                // Player circle
                const radius = 15;
                const teamColor = player.team === 'attacking' ? '#FF6B35' : '#0094CC';
                
                ctx.fillStyle = teamColor;
                ctx.beginPath();
                ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Player border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Role indicator
                ctx.fillStyle = '#FFFFFF';
                ctx.font = `bold ${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const roleAbbr = this.getRoleAbbreviation(player.role);
                ctx.fillText(roleAbbr, player.x, player.y);
                
                // Player name
                ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.fillText(player.id, player.x, player.y + radius + 12);
            });
        }
        
        getRoleAbbreviation(role) {
            const abbreviations = {
                taker: 'T',
                target: 'ST',
                support: 'M',
                wide: 'W',
                goalkeeper: 'GK',
                marker: 'D',
                wall: 'W',
                cover: 'C'
            };
            return abbreviations[role] || role.substring(0, 2).toUpperCase();
        }
        
        drawBall() {
            const ctx = this.ctx;
            
            // Ball
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.ballPosition.x, this.ballPosition.y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Ball glow effect
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.ballPosition.x, this.ballPosition.y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        drawSuccessZones() {
            const ctx = this.ctx;
            
            // Draw zones with different success probabilities
            const zones = this.getSuccessZones();
            
            zones.forEach(zone => {
                ctx.fillStyle = `rgba(0, 255, 0, ${zone.probability * 0.3})`;
                ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
                
                // Zone label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = `${FIBONACCI_SCALE.spacing.xs}px system-ui`;
                ctx.textAlign = 'center';
                ctx.fillText(
                    `${Math.round(zone.probability * 100)}%`,
                    zone.x + zone.width / 2,
                    zone.y + zone.height / 2
                );
            });
        }
        
        getSuccessZones() {
            // Define success zones based on set piece type
            switch (this.options.setPieceType) {
                case 'corner':
                    return [
                        { x: 200, y: 60, width: 100, height: 60, probability: 0.8 }, // Near post
                        { x: 220, y: 80, width: 60, height: 40, probability: 0.9 },  // Six-yard box
                        { x: 180, y: 100, width: 140, height: 40, probability: 0.6 }  // Penalty area
                    ];
                case 'freekick':
                    return [
                        { x: 200, y: 0, width: 100, height: 80, probability: 0.7 },   // Goal area
                        { x: 150, y: 80, width: 200, height: 60, probability: 0.5 }   // Shooting zone
                    ];
                case 'throw-in':
                    return [
                        { x: 50, y: 120, width: 80, height: 160, probability: 0.8 },  // Receiving zone
                        { x: 130, y: 160, width: 120, height: 80, probability: 0.6 }  // Secondary zone
                    ];
                default:
                    return [];
            }
        }
        
        getGoalPosition() {
            switch (this.options.setPieceType) {
                case 'corner':
                case 'freekick':
                    return { x: 250, y: 15 }; // Goal center
                case 'throw-in':
                    return { x: 400, y: 200 }; // Advanced position
                default:
                    return { x: 250, y: 50 };
            }
        }
        
        updateAnalysis() {
            const analysis = this.calculateSetPieceAnalysis();
            
            // Update probability display
            const probabilityFill = this.container.querySelector('#probabilityFill');
            const probabilityText = this.container.querySelector('#probabilityText');
            
            if (probabilityFill && probabilityText) {
                probabilityFill.style.width = `${analysis.overall}%`;
                probabilityText.textContent = `${analysis.overall}%`;
            }
            
            // Update breakdown scores
            const positioningScore = this.container.querySelector('#positioningScore');
            const routeScore = this.container.querySelector('#routeScore');
            const surpriseScore = this.container.querySelector('#surpriseScore');
            
            if (positioningScore) positioningScore.textContent = `${analysis.positioning}/10`;
            if (routeScore) routeScore.textContent = `${analysis.routes}/10`;
            if (surpriseScore) surpriseScore.textContent = `${analysis.surprise}/10`;
        }
        
        calculateSetPieceAnalysis() {
            // Calculate positioning effectiveness
            let positioningScore = 0;
            const attackingPlayers = this.players.filter(p => p.team === 'attacking');
            const defendingPlayers = this.players.filter(p => p.team === 'defending');
            
            // Check spacing and positioning
            attackingPlayers.forEach(player => {
                const nearestDefender = defendingPlayers.reduce((nearest, defender) => {
                    const distance = Math.sqrt(
                        Math.pow(player.x - defender.x, 2) + Math.pow(player.y - defender.y, 2)
                    );
                    return !nearest || distance < nearest.distance 
                        ? { defender, distance } 
                        : nearest;
                }, null);
                
                if (nearestDefender && nearestDefender.distance > 30) {
                    positioningScore += 2;
                } else if (nearestDefender && nearestDefender.distance > 20) {
                    positioningScore += 1;
                }
            });
            
            positioningScore = Math.min(10, positioningScore);
            
            // Calculate route effectiveness
            const avgRouteProbability = this.routes.reduce((sum, route) => sum + route.probability, 0) / this.routes.length;
            const routeScore = Math.round(avgRouteProbability * 10);
            
            // Calculate surprise factor (based on uniqueness of setup)
            const surpriseScore = Math.round(6 + Math.random() * 4); // Simulated for demo
            
            // Overall probability
            const overall = Math.round((positioningScore + routeScore + surpriseScore) / 3 * 10);
            
            return {
                positioning: positioningScore.toFixed(1),
                routes: routeScore.toFixed(1),
                surprise: surpriseScore.toFixed(1),
                overall: Math.min(95, overall)
            };
        }
        
        // Event handlers
        handleMouseDown(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
            
            // Find clicked player
            this.draggedPlayer = this.players.find(player => {
                if (!player.movable) return false;
                const distance = Math.sqrt(Math.pow(player.x - x, 2) + Math.pow(player.y - y, 2));
                return distance <= 15;
            });
        }
        
        handleMouseMove(event) {
            if (!this.draggedPlayer) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
            
            // Constrain to canvas bounds
            this.draggedPlayer.x = Math.max(15, Math.min(this.canvas.width - 15, x));
            this.draggedPlayer.y = Math.max(15, Math.min(this.canvas.height - 15, y));
            
            this.updateAnalysis();
        }
        
        handleMouseUp() {
            this.draggedPlayer = null;
        }
        
        // Public API
        changeSetPiece(type) {
            this.setupSetPiece(type);
        }
        
        playAnimation() {
            // Animate the set piece execution
            let animationStep = 0;
            const steps = 60; // 1 second at 60fps
            
            const animate = () => {
                if (animationStep < steps) {
                    const progress = animationStep / steps;
                    
                    // Animate ball movement along first route
                    if (this.routes.length > 0) {
                        const route = this.routes[0];
                        const fromPlayer = this.players.find(p => p.id === route.from);
                        const toPosition = route.to === 'goal' ? this.getGoalPosition() : this.players.find(p => p.id === route.to);
                        
                        if (fromPlayer && toPosition) {
                            // Ease the movement
                            const easedProgress = 1 - Math.pow(1 - progress, 3);
                            
                            this.ballPosition.x = fromPlayer.x + (toPosition.x - fromPlayer.x) * easedProgress;
                            this.ballPosition.y = fromPlayer.y + (toPosition.y - fromPlayer.y) * easedProgress - Math.sin(progress * Math.PI) * 40;
                        }
                    }
                    
                    animationStep++;
                    requestAnimationFrame(animate);
                } else {
                    // Reset ball position
                    this.setupSetPiece(this.options.setPieceType);
                }
            };
            
            animate();
        }
        
        resetSetPiece() {
            this.setupSetPiece(this.options.setPieceType);
        }
        
        destroy() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // =====================================================
    // CSS INJECTION FOR TACTICAL COMPONENTS
    // =====================================================

    const injectTacticalCSS = function() {
        const css = `
        /* TACTICAL COMPONENTS STYLES */
        
        .match-analysis-layout {
            background: var(--neutral-200);
            border-radius: var(--border-radius);
            padding: ${FIBONACCI_SCALE.spacing.md}px;
            height: 100%;
            overflow: hidden;
        }
        
        .analysis-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: ${FIBONACCI_SCALE.spacing.lg}px;
        }
        
        .analysis-header h2 {
            color: var(--primary-300);
            font-size: var(--font-size-lg);
            margin: 0;
        }
        
        .analysis-controls {
            display: flex;
            gap: ${FIBONACCI_SCALE.spacing.sm}px;
        }
        
        .analysis-toggle {
            background: var(--neutral-400);
            border: 1px solid var(--neutral-500);
            color: rgba(255, 255, 255, 0.8);
            padding: ${FIBONACCI_SCALE.spacing.xs}px ${FIBONACCI_SCALE.spacing.sm}px;
            border-radius: 4px;
            font-size: var(--font-size-xs);
            cursor: pointer;
            transition: all var(--duration-short)ms var(--easing-swift);
        }
        
        .analysis-toggle:hover {
            background: var(--neutral-300);
            color: white;
        }
        
        .analysis-toggle.active {
            background: var(--primary-300);
            color: white;
            border-color: var(--primary-400);
        }
        
        .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: ${FIBONACCI_SCALE.spacing.lg}px;
            height: calc(100% - 80px);
            overflow-y: auto;
        }
        
        .analysis-section {
            background: var(--neutral-300);
            border-radius: var(--border-radius);
            padding: ${FIBONACCI_SCALE.spacing.md}px;
            overflow: hidden;
        }
        
        .analysis-section h3 {
            color: var(--primary-300);
            font-size: var(--font-size-md);
            margin: 0 0 ${FIBONACCI_SCALE.spacing.md}px 0;
        }
        
        /* Match Timeline Styles */
        .match-timeline {
            height: 100%;
        }
        
        .timeline-container {
            position: relative;
            height: 200px;
            background: var(--neutral-400);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .timeline-event {
            position: absolute;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            cursor: pointer;
        }
        
        .event-marker {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            font-weight: bold;
            border: 2px solid white;
            position: relative;
        }
        
        .event-details {
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: ${FIBONACCI_SCALE.spacing.xs}px;
            border-radius: 4px;
            white-space: nowrap;
            font-size: var(--font-size-xs);
            opacity: 0;
            transition: opacity var(--duration-short)ms;
            pointer-events: none;
        }
        
        .timeline-event:hover .event-details {
            opacity: 1;
        }
        
        .event-time {
            font-weight: bold;
            color: var(--accent-200);
        }
        
        /* Player Radars Styles */
        .player-radars {
            height: 100%;
        }
        
        .radars-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: ${FIBONACCI_SCALE.spacing.md}px;
        }
        
        .player-radar {
            text-align: center;
            background: var(--neutral-400);
            padding: ${FIBONACCI_SCALE.spacing.sm}px;
            border-radius: 4px;
        }
        
        .player-radar h4 {
            color: white;
            font-size: var(--font-size-sm);
            margin: 0 0 ${FIBONACCI_SCALE.spacing.sm}px 0;
        }
        
        .player-radar canvas {
            max-width: 100%;
            height: auto;
        }
        
        /* Team Comparison Styles */
        .team-comparison {
            height: 100%;
        }
        
        .comparison-stats {
            display: flex;
            flex-direction: column;
            gap: ${FIBONACCI_SCALE.spacing.sm}px;
        }
        
        .stat-comparison {
            background: var(--neutral-400);
            padding: ${FIBONACCI_SCALE.spacing.sm}px;
            border-radius: 4px;
        }
        
        .stat-label {
            color: rgba(255, 255, 255, 0.8);
            font-size: var(--font-size-xs);
            margin-bottom: ${FIBONACCI_SCALE.spacing.xs}px;
        }
        
        .stat-values {
            display: flex;
            align-items: center;
            gap: ${FIBONACCI_SCALE.spacing.sm}px;
        }
        
        .home-value,
        .away-value {
            color: white;
            font-weight: bold;
            font-size: var(--font-size-sm);
            min-width: 40px;
        }
        
        .stat-bar {
            flex: 1;
            height: 8px;
            background: var(--neutral-500);
            border-radius: 4px;
            overflow: hidden;
            display: flex;
        }
        
        .home-bar {
            background: var(--primary-300);
            height: 100%;
            transition: width var(--duration-medium)ms var(--easing-human);
        }
        
        .away-bar {
            background: var(--accent-300);
            height: 100%;
            transition: width var(--duration-medium)ms var(--easing-human);
        }
        
        /* Set Piece Designer Styles */
        .set-piece-designer {
            background: var(--neutral-200);
            border-radius: var(--border-radius);
            padding: ${FIBONACCI_SCALE.spacing.md}px;
            height: 100%;
        }
        
        .designer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: ${FIBONACCI_SCALE.spacing.lg}px;
        }
        
        .designer-header h3 {
            color: var(--primary-300);
            font-size: var(--font-size-md);
            margin: 0;
        }
        
        .set-piece-controls {
            display: flex;
            align-items: center;
            gap: ${FIBONACCI_SCALE.spacing.sm}px;
        }
        
        .set-piece-controls select,
        .set-piece-controls button {
            background: var(--neutral-400);
            border: 1px solid var(--neutral-500);
            color: white;
            padding: ${FIBONACCI_SCALE.spacing.xs}px ${FIBONACCI_SCALE.spacing.sm}px;
            border-radius: 4px;
            font-size: var(--font-size-xs);
            cursor: pointer;
            transition: all var(--duration-short)ms;
        }
        
        .set-piece-controls button:hover,
        .set-piece-controls select:hover {
            background: var(--neutral-300);
        }
        
        .designer-content {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: ${FIBONACCI_SCALE.spacing.lg}px;
            height: calc(100% - 80px);
        }
        
        .canvas-container {
            background: var(--neutral-300);
            border-radius: var(--border-radius);
            padding: ${FIBONACCI_SCALE.spacing.md}px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .set-piece-analysis {
            background: var(--neutral-300);
            border-radius: var(--border-radius);
            padding: ${FIBONACCI_SCALE.spacing.md}px;
        }
        
        .set-piece-analysis h4 {
            color: var(--primary-300);
            font-size: var(--font-size-sm);
            margin: 0 0 ${FIBONACCI_SCALE.spacing.md}px 0;
        }
        
        .probability-display {
            display: flex;
            align-items: center;
            gap: ${FIBONACCI_SCALE.spacing.sm}px;
            margin-bottom: ${FIBONACCI_SCALE.spacing.lg}px;
        }
        
        .probability-meter {
            flex: 1;
            height: 12px;
            background: var(--neutral-500);
            border-radius: 6px;
            overflow: hidden;
            position: relative;
        }
        
        .probability-fill {
            height: 100%;
            background: linear-gradient(90deg, 
                var(--game-danger-0) 0%, 
                var(--game-safe-0) 50%, 
                var(--game-triumph-0) 100%);
            border-radius: 6px;
            transition: width var(--duration-long)ms var(--easing-golden);
            position: relative;
        }
        
        .probability-fill::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 2px;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            animation: probabilityPulse 2s ease-in-out infinite;
        }
        
        @keyframes probabilityPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }
        
        .probability-text {
            color: white;
            font-weight: bold;
            font-size: var(--font-size-md);
            min-width: 40px;
        }
        
        .analysis-breakdown {
            display: flex;
            flex-direction: column;
            gap: ${FIBONACCI_SCALE.spacing.sm}px;
        }
        
        .analysis-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: ${FIBONACCI_SCALE.spacing.xs}px 0;
            border-bottom: 1px solid var(--neutral-400);
        }
        
        .analysis-item:last-child {
            border-bottom: none;
        }
        
        .analysis-item span:first-child {
            color: rgba(255, 255, 255, 0.8);
            font-size: var(--font-size-xs);
        }
        
        .analysis-score {
            color: var(--primary-300);
            font-weight: bold;
            font-size: var(--font-size-xs);
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
            .analysis-grid {
                grid-template-columns: 1fr;
            }
            
            .designer-content {
                grid-template-columns: 1fr;
                grid-template-rows: 1fr auto;
            }
            
            .radars-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
        }
        
        @media (max-width: 768px) {
            .analysis-header {
                flex-direction: column;
                gap: ${FIBONACCI_SCALE.spacing.sm}px;
                align-items: stretch;
            }
            
            .analysis-controls {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .designer-header {
                flex-direction: column;
                gap: ${FIBONACCI_SCALE.spacing.sm}px;
                align-items: stretch;
            }
            
            .set-piece-controls {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .probability-display {
                flex-direction: column;
                text-align: center;
            }
        }
        
        /* Performance optimizations */
        .analysis-section,
        .set-piece-designer,
        .canvas-container {
            will-change: transform;
            transform: translateZ(0);
        }
        
        canvas {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: optimize-contrast;
        }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // =====================================================
    // EXPORT TO GLOBAL SCOPE
    // =====================================================

    const TacticalComponents = {
        InteractiveFormationDesigner,
        TacticalHeatMap,
        MatchAnalysisComponents,
        SetPieceDesigner,
        
        // Utility functions
        TACTICAL_CONSTANTS,
        
        // Initialize all components
        init: function(options = {}) {
            console.log('🎯 Initializing Tactical Components...');
            
            // Inject CSS
            injectTacticalCSS();
            
            // Apply tactical-specific optimizations
            this.applyTacticalOptimizations();
            
            console.log('✅ Tactical Components initialized');
            return this;
        },
        
        // Performance optimizations for tactical rendering
        applyTacticalOptimizations: function() {
            // Set CSS properties for tactical performance
            document.documentElement.style.setProperty('--tactical-frame-rate', '60fps');
            document.documentElement.style.setProperty('--tactical-gpu-acceleration', 'translateZ(0)');
            
            // Monitor tactical component performance
            if (global.ZENITH && global.ZENITH.PERFORMANCE) {
                const tacticalMonitor = () => {
                    const fps = global.ZENITH.PERFORMANCE.monitor.getAverageFPS();
                    if (fps < 50) {
                        console.warn('⚠️ Tactical Components: Performance below 50fps, consider reducing detail');
                    }
                };
                
                setInterval(tacticalMonitor, 5000); // Check every 5 seconds
            }
        },
        
        // Create formation designer instance
        createFormationDesigner: function(container, options) {
            return new InteractiveFormationDesigner(container, options);
        },
        
        // Create heat map instance
        createHeatMap: function(container, options) {
            return new TacticalHeatMap(container, options);
        },
        
        // Create match analysis dashboard
        createMatchAnalysis: function(container, options) {
            return new MatchAnalysisComponents(container, options);
        },
        
        // Create set piece designer
        createSetPieceDesigner: function(container, options) {
            return new SetPieceDesigner(container, options);
        },
        
        version: '1.0.0'
    };

    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            TacticalComponents.init();
        });
    } else {
        TacticalComponents.init();
    }
    
    // Expose to global scope
    global.TacticalComponents = TacticalComponents;
    
    // AMD/CommonJS compatibility
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TacticalComponents;
    } else if (typeof define === 'function' && define.amd) {
        define(() => TacticalComponents);
    }

})(typeof window !== 'undefined' ? window : global);

// =====================================================
// INTEGRATION EXAMPLES & USAGE DOCUMENTATION
// =====================================================

/**
 * USAGE EXAMPLES:
 * 
 * // 1. Interactive Formation Designer
 * const formationDesigner = TacticalComponents.createFormationDesigner(
 *     document.getElementById('formation-container'),
 *     {
 *         interactive: true,
 *         showConnections: true,
 *         showZones: true,
 *         realTimeAnalysis: true
 *     }
 * );
 * 
 * // Change formation programmatically
 * formationDesigner.changeFormation('4-3-3');
 * 
 * // 2. Tactical Heat Map
 * const heatMap = TacticalComponents.createHeatMap(
 *     document.getElementById('heatmap-container'),
 *     {
 *         heatType: 'possession',
 *         timeProgression: true,
 *         dataSource: 'live'
 *     }
 * );
 * 
 * // Change heat map type
 * heatMap.setHeatType('attacking');
 * heatMap.setTimeFrame(45); // Set to 45th minute
 * 
 * // 3. Match Analysis Dashboard
 * const matchAnalysis = TacticalComponents.createMatchAnalysis(
 *     document.getElementById('analysis-container'),
 *     {
 *         showXGFlow: true,
 *         showPossessionTerritory: true,
 *         showTimeline: true,
 *         showPlayerRadars: true,
 *         showComparison: true
 *     }
 * );
 * 
 * // 4. Set Piece Designer
 * const setPieceDesigner = TacticalComponents.createSetPieceDesigner(
 *     document.getElementById('setpiece-container'),
 *     {
 *         setPieceType: 'corner',
 *         interactive: true,
 *         showProbabilities: true,
 *         showPlayerMovement: true
 *     }
 * );
 * 
 * // Change set piece type
 * setPieceDesigner.changeSetPiece('freekick');
 * setPieceDesigner.playAnimation();
 * 
 * // 5. Clean up when done
 * formationDesigner.destroy();
 * heatMap.destroy();
 * matchAnalysis.destroy();
 * setPieceDesigner.destroy();
 */

/**
 * INTEGRATION WITH EXISTING FM UI:
 * 
 * // Add to existing tactical overview card
 * if (window.TacticalOverviewCard) {
 *     const originalRender = window.TacticalOverviewCard.render;
 *     window.TacticalOverviewCard.render = function() {
 *         const result = originalRender.call(this);
 *         
 *         // Enhanced with new components
 *         setTimeout(() => {
 *             const container = document.querySelector('.formation-pitch-container');
 *             if (container) {
 *                 const designer = TacticalComponents.createFormationDesigner(container, {
 *                     interactive: true,
 *                     showConnections: true
 *                 });
 *             }
 *         }, 100);
 *         
 *         return result;
 *     };
 * }
 */

console.log('🎯 TACTICAL-COMPONENTS.js loaded successfully');
console.log('📊 Professional football analysis components ready');
console.log('⚽ Formation Designer, Heat Maps, Match Analysis, Set Pieces available');