/**
 * ZENITH VISUAL SYSTEMS
 * Agent 6 - Apply golden ratio layouts and color harmony systems
 * Implementing ZENITH philosophy: sacred geometry and psychological color mapping
 */

(function() {
    'use strict';

    console.log('🎨 ZENITH VISUAL SYSTEMS: Implementing sacred geometry and color harmony...');

    const ZenithVisual = {
        initialized: false,
        
        // Golden ratio and derivatives from CLAUDE.md
        φ: 1.618033988749,
        layouts: {
            golden_rect: [1, 1.618033988749],
            fibonacci_spiral: [1, 1, 2, 3, 5, 8, 13, 21],
            rule_of_thirds: [0.333, 0.667],
            rabatment: [0.207, 0.793]
        },
        
        // Emotional color temperature mapping from CLAUDE.md
        gameStates: {
            safe: { h: 130, s: 35, l: 75 },        // Soft greens
            tension: { h: 40, s: 65, l: 85 },      // Warning ambers
            danger: { h: 8, s: 80, l: 80 },        // Blood reds
            mystery: { h: 260, s: 50, l: 40 },     // Deep purples
            triumph: { h: 50, s: 90, l: 95 }       // Victory golds
        },
        
        currentState: 'safe',
        
        init() {
            if (this.initialized) return;
            
            console.log('🎨 ZENITH VISUAL: Applying sacred geometry and color systems...');
            
            this.implementSacredGeometry();
            this.setupColorHarmonySystem();
            this.applyGoldenRatioLayouts();
            this.implementAdaptiveContrast();
            this.setupEmotionalColorMapping();
            this.enhanceTypographySystem();
            
            this.initialized = true;
            console.log('✅ ZENITH VISUAL: Visual systems active');
        },
        
        implementSacredGeometry() {
            console.log('📐 Implementing sacred geometry layouts...');
            
            const sacredGeometryCSS = `
                /* ZENITH Sacred Geometry System */
                :root {
                    /* Golden ratio variables */
                    --φ: 1.618033988749;
                    --φ-inverse: 0.618033988749;
                    
                    /* Fibonacci spacing sequence */
                    --fib-1: 1px;
                    --fib-2: 2px;
                    --fib-3: 3px;
                    --fib-5: 5px;
                    --fib-8: 8px;
                    --fib-13: 13px;
                    --fib-21: 21px;
                    --fib-34: 34px;
                    
                    /* Rule of thirds */
                    --third-1: 33.333%;
                    --third-2: 66.667%;
                    
                    /* Sacred rectangles */
                    --rect-√2: 1.414;
                    --rect-√3: 1.732;
                    --rect-√5: 2.236;
                }
                
                /* Apply golden ratio to grid system */
                .tile-container {
                    /* Use golden ratio for grid proportions */
                    aspect-ratio: var(--φ) !important;
                }
                
                /* Golden ratio card proportions */
                .card.golden {
                    aspect-ratio: var(--φ) !important;
                }
                
                .card.golden-inverse {
                    aspect-ratio: var(--φ-inverse) !important;
                }
                
                /* Fibonacci spacing for elements */
                .card-header {
                    padding: var(--fib-8) var(--fib-13) !important;
                }
                
                .card-body {
                    padding: var(--fib-13) !important;
                }
                
                .stat-row {
                    margin: var(--fib-8) 0 !important;
                    padding: var(--fib-5) 0 !important;
                }
                
                .kpi-card {
                    padding: var(--fib-13) !important;
                    margin: var(--fib-8) !important;
                }
                
                /* Rule of thirds composition */
                .card-header {
                    height: calc(100% / var(--φ) / var(--φ)) !important; /* Double golden division */
                }
                
                .card-body {
                    flex: var(--φ) !important; /* Golden ratio proportion */
                }
                
                /* Sacred geometry proportional scaling */
                .performance-charts-grid {
                    grid-template-columns: var(--φ)fr 1fr !important;
                }
                
                .financial-charts-grid {
                    grid-template-columns: 1fr var(--φ)fr !important;
                }
                
                /* Dynamic layout breathing (from CLAUDE.md) */
                @keyframes zenithBreathing {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                
                .card {
                    animation: zenithBreathing 10s ease-in-out infinite;
                    animation-play-state: paused;
                }
                
                .card:hover {
                    animation-play-state: running;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'zenith-sacred-geometry';
            style.textContent = sacredGeometryCSS;
            document.head.appendChild(style);
            
            console.log('✅ Sacred geometry implemented');
        },
        
        setupColorHarmonySystem() {
            console.log('🌈 Setting up color harmony system...');
            
            const colorHarmonyCSS = `
                /* ZENITH Color Harmony System */
                :root {
                    /* Base harmony system (hue = 220 from CLAUDE.md) */
                    --primary-hue: 220;
                    
                    /* Analogous harmony */
                    --analogous-1: hsl(calc(var(--primary-hue) - 30), 70%, 60%);
                    --analogous-2: hsl(var(--primary-hue), 70%, 60%);
                    --analogous-3: hsl(calc(var(--primary-hue) + 30), 70%, 60%);
                    
                    /* Triadic harmony */
                    --triadic-1: hsl(var(--primary-hue), 70%, 60%);
                    --triadic-2: hsl(calc(var(--primary-hue) + 120), 70%, 60%);
                    --triadic-3: hsl(calc(var(--primary-hue) + 240), 70%, 60%);
                    
                    /* Split complementary */
                    --split-comp-1: hsl(var(--primary-hue), 70%, 60%);
                    --split-comp-2: hsl(calc(var(--primary-hue) + 150), 70%, 60%);
                    --split-comp-3: hsl(calc(var(--primary-hue) + 210), 70%, 60%);
                    
                    /* Emotional states */
                    --color-safe: hsl(130, 35%, 75%);
                    --color-tension: hsl(40, 65%, 85%);
                    --color-danger: hsl(8, 80%, 80%);
                    --color-mystery: hsl(260, 50%, 40%);
                    --color-triumph: hsl(50, 90%, 95%);
                }
                
                /* Apply harmonic colors to interface elements */
                .card:nth-child(3n+1) {
                    border-left: 2px solid var(--analogous-1);
                }
                
                .card:nth-child(3n+2) {
                    border-left: 2px solid var(--analogous-2);
                }
                
                .card:nth-child(3n+3) {
                    border-left: 2px solid var(--analogous-3);
                }
                
                /* Emotional state applications */
                .kpi-card.positive {
                    background: linear-gradient(135deg, 
                        hsla(130, 35%, 75%, 0.1),
                        hsla(130, 35%, 75%, 0.05)
                    );
                    border-left-color: var(--color-safe);
                }
                
                .kpi-card.warning {
                    background: linear-gradient(135deg, 
                        hsla(40, 65%, 85%, 0.1),
                        hsla(40, 65%, 85%, 0.05)
                    );
                    border-left-color: var(--color-tension);
                }
                
                .kpi-card.negative {
                    background: linear-gradient(135deg, 
                        hsla(8, 80%, 80%, 0.1),
                        hsla(8, 80%, 80%, 0.05)
                    );
                    border-left-color: var(--color-danger);
                }
                
                .kpi-card.excellent {
                    background: linear-gradient(135deg, 
                        hsla(50, 90%, 95%, 0.1),
                        hsla(50, 90%, 95%, 0.05)
                    );
                    border-left-color: var(--color-triumph);
                }
                
                /* Adaptive color transitions (800-1200ms from CLAUDE.md) */
                .card {
                    transition: border-color 800ms ease-in-out, 
                                background-color 1000ms ease-in-out;
                }
                
                .kpi-card {
                    transition: all 800ms cubic-bezier(0.4, 0.0, 0.1, 1);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'zenith-color-harmony';
            style.textContent = colorHarmonyCSS;
            document.head.appendChild(style);
            
            console.log('✅ Color harmony system implemented');
        },
        
        applyGoldenRatioLayouts() {
            console.log('📏 Applying golden ratio layouts...');
            
            // Apply golden ratio to specific cards
            document.querySelectorAll('.card').forEach((card, index) => {
                const titleSpan = card.querySelector('.card-header span');
                if (!titleSpan) return;
                
                const title = titleSpan.textContent;
                
                // Apply golden ratio to key cards
                if (title.includes('Performance Dashboard')) {
                    card.classList.add('golden');
                } else if (title.includes('League Table')) {
                    card.classList.add('golden-inverse');
                }
                
                // Apply harmonic proportions to card grids
                const cardBody = card.querySelector('.card-body');
                if (cardBody) {
                    const grids = cardBody.querySelectorAll('.kpi-grid, .charts-grid, .stats-grid');
                    grids.forEach(grid => {
                        // Use golden ratio for grid proportions
                        if (grid.classList.contains('kpi-grid')) {
                            grid.style.gridTemplateColumns = `${this.φ}fr 1fr`;
                        } else if (grid.classList.contains('charts-grid')) {
                            grid.style.gridTemplateColumns = `1fr ${this.φ}fr`;
                        }
                    });
                }
            });
            
            console.log('✅ Golden ratio layouts applied');
        },
        
        implementAdaptiveContrast() {
            console.log('🔆 Implementing adaptive contrast system...');
            
            // Sample background luminance and adjust contrast
            const adaptContrast = () => {
                const sampleElements = document.querySelectorAll('.card, .card-header, .kpi-card');
                
                sampleElements.forEach(element => {
                    const style = window.getComputedStyle(element);
                    const bgColor = style.backgroundColor;
                    
                    // Calculate luminance (simplified)
                    const rgb = bgColor.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
                        
                        // Adjust text contrast based on background luminance
                        if (luminance > 0.5) {
                            element.style.color = 'rgba(0, 0, 0, 0.87)';
                        } else {
                            element.style.color = 'rgba(255, 255, 255, 0.87)';
                        }
                    }
                });
            };
            
            // Run adaptive contrast on load and resize
            adaptContrast();
            window.addEventListener('resize', adaptContrast);
            
            console.log('✅ Adaptive contrast system implemented');
        },
        
        setupEmotionalColorMapping() {
            console.log('😊 Setting up emotional color mapping...');
            
            // Apply emotional states to different interface areas
            this.setGameState('safe'); // Default state
            
            // Setup state change handlers
            document.addEventListener('click', (e) => {
                if (e.target.matches('.kpi-change.positive')) {
                    this.triggerColorTransition('triumph', 2000);
                } else if (e.target.matches('.kpi-change.negative')) {
                    this.triggerColorTransition('tension', 1500);
                }
            });
            
            console.log('✅ Emotional color mapping setup complete');
        },
        
        setGameState(state) {
            if (!this.gameStates[state]) return;
            
            console.log(`🎨 Setting emotional state: ${state}`);
            
            const colors = this.gameStates[state];
            const rootStyle = document.documentElement.style;
            
            rootStyle.setProperty('--emotional-h', colors.h);
            rootStyle.setProperty('--emotional-s', `${colors.s}%`);
            rootStyle.setProperty('--emotional-l', `${colors.l}%`);
            
            this.currentState = state;
            
            // Apply state-specific styling
            document.body.className = document.body.className.replace(/zenith-state-\w+/g, '');
            document.body.classList.add(`zenith-state-${state}`);
        },
        
        triggerColorTransition(targetState, duration = 1000) {
            console.log(`🌈 Color transition: ${this.currentState} → ${targetState}`);
            
            const startColors = this.gameStates[this.currentState];
            const endColors = this.gameStates[targetState];
            
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Smooth color interpolation
                const h = startColors.h + (endColors.h - startColors.h) * progress;
                const s = startColors.s + (endColors.s - startColors.s) * progress;
                const l = startColors.l + (endColors.l - startColors.l) * progress;
                
                const rootStyle = document.documentElement.style;
                rootStyle.setProperty('--emotional-h', h);
                rootStyle.setProperty('--emotional-s', `${s}%`);
                rootStyle.setProperty('--emotional-l', `${l}%`);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.currentState = targetState;
                    
                    // Return to safe state after emotional peak
                    if (targetState !== 'safe') {
                        setTimeout(() => {
                            this.triggerColorTransition('safe', 2000);
                        }, 1000);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        },
        
        enhanceTypographySystem() {
            console.log('📝 Enhancing typography with ZENITH principles...');
            
            const typographyCSS = `
                /* ZENITH Typography Engineering */
                :root {
                    /* Distance-based scaling from CLAUDE.md */
                    --base-font-size: 16px; /* Desktop 60cm viewing distance */
                    
                    /* Contrast requirements by context */
                    --contrast-critical: 7; /* Critical info like health/status */
                    --contrast-primary: 4.5; /* Menu items */
                    --contrast-secondary: 3; /* Flavor text */
                    --contrast-decorative: 2; /* Atmospheric */
                    
                    /* Dynamic font weight for motion */
                    --font-weight-static: 400;
                    --font-weight-motion: 600;
                }
                
                /* Football Manager specific typography */
                .card-header span {
                    font-weight: var(--font-weight-motion) !important;
                    font-size: calc(var(--base-font-size) * 0.6875) !important; /* 11px */
                    line-height: var(--φ) !important; /* Golden ratio line height */
                    letter-spacing: 0.02em !important;
                }
                
                .stat-label {
                    font-weight: var(--font-weight-static) !important;
                    font-size: calc(var(--base-font-size) * 0.6875) !important;
                    color: rgba(255, 255, 255, 0.7) !important; /* Secondary contrast */
                }
                
                .stat-value {
                    font-weight: var(--font-weight-motion) !important;
                    font-size: calc(var(--base-font-size) * 0.6875) !important;
                    color: rgba(255, 255, 255, 0.95) !important; /* Primary contrast */
                }
                
                .kpi-value {
                    font-weight: 700 !important;
                    font-size: calc(var(--base-font-size) * 1.125) !important; /* 18px */
                    color: white !important; /* Critical contrast */
                    line-height: 1 !important;
                }
                
                .kpi-label {
                    font-weight: 500 !important;
                    font-size: calc(var(--base-font-size) * 0.625) !important; /* 10px */
                    color: rgba(255, 255, 255, 0.7) !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                }
                
                /* Velocity-based font weight (from CLAUDE.md) */
                .card.dragging .card-header span {
                    font-weight: 700 !important;
                    transition: font-weight 0.1s ease !important;
                }
                
                .card:not(.dragging) .card-header span {
                    font-weight: 600 !important;
                    transition: font-weight 0.3s ease !important;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'zenith-typography';
            style.textContent = typographyCSS;
            document.head.appendChild(style);
            
            console.log('✅ Typography system enhanced');
        },
        
        // Dynamic color palette generation (from CLAUDE.md)
        generatePalette(baseColor, mood, count) {
            const moods = {
                aggressive: { saturation: 1.2, value: 0.9, spread: 180 },
                calm: { saturation: 0.6, value: 0.7, spread: 60 },
                mysterious: { saturation: 0.8, value: 0.4, spread: 90 },
                triumphant: { saturation: 1.0, value: 1.0, spread: 120 }
            };
            
            const config = moods[mood] || moods.calm;
            const palette = [];
            
            for (let i = 0; i < count; i++) {
                const hueOffset = (i / count) * config.spread - config.spread / 2;
                const hue = (baseColor + hueOffset + 360) % 360;
                
                palette.push({
                    h: hue,
                    s: config.saturation * 50, // Convert to percentage
                    l: config.value * 50       // Convert to percentage
                });
            }
            
            return palette;
        },
        
        // Apply generated palette to elements
        applyDynamicPalette(elements, mood = 'calm') {
            const palette = this.generatePalette(220, mood, elements.length);
            
            elements.forEach((element, index) => {
                const color = palette[index];
                element.style.background = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
            });
        },
        
        // Compositional tension from CLAUDE.md
        applyCompositionalTension() {
            console.log('⚡ Applying compositional tension...');
            
            // Asymmetric balance using visual mass (size × contrast × saturation)
            document.querySelectorAll('.card').forEach((card, index) => {
                const mass = this.calculateVisualMass(card);
                
                // Apply diagonal dynamics (22.5° and 67.5° angles)
                if (mass > 0.7) {
                    card.style.transform += ' rotate(0.5deg)';
                } else if (mass < 0.3) {
                    card.style.transform += ' rotate(-0.5deg)';
                }
            });
            
            console.log('✅ Compositional tension applied');
        },
        
        calculateVisualMass(element) {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            
            // Size component
            const size = (rect.width * rect.height) / (window.innerWidth * window.innerHeight);
            
            // Contrast component (simplified)
            const contrast = 0.5; // Would calculate from actual colors
            
            // Saturation component (simplified)
            const saturation = 0.5; // Would extract from computed styles
            
            return size * contrast * saturation;
        }
    };

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => ZenithVisual.init(), 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ZenithVisual.init(), 500);
        });
    }

    // Make available for Chrome MCP testing
    window.ZenithVisual = ZenithVisual;

})();