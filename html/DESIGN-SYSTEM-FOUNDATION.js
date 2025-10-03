/**
 * ================================================
 * FOOTBALL MANAGER UI - DESIGN SYSTEM FOUNDATION
 * ================================================
 * 
 * Mathematical foundation implementing ZENITH principles:
 * - Golden Ratio Layout System (φ = 1.618)
 * - Fibonacci Spacing System (8px base unit)
 * - HSV Color Harmony Mathematics
 * - Performance Optimization (60fps constraints)
 * - Component Hierarchy Framework
 * - Accessibility Foundation
 * 
 * Version: 1.0.0
 * Author: ZENITH Design System
 * Generated: 2024
 */

(function(global) {
    'use strict';

    // ==========================================
    // MATHEMATICAL CONSTANTS & RATIOS
    // ==========================================
    
    const GOLDEN_RATIO = 1.618033988749894;
    const GOLDEN_RATIO_INVERSE = 0.618033988749894;
    const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];
    const BASE_UNIT = 8; // 8px base unit for Fibonacci spacing
    
    // Derived mathematical constants
    const PHI_SQUARED = GOLDEN_RATIO * GOLDEN_RATIO; // 2.618
    const ROOT_PHI = Math.sqrt(GOLDEN_RATIO); // 1.272
    const PHI_CUBED = GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO; // 4.236
    
    // Sacred geometry ratios
    const SACRED_RATIOS = {
        golden: GOLDEN_RATIO,
        silver: 1 + Math.sqrt(2), // 2.414
        bronze: (3 + Math.sqrt(13)) / 2, // 3.303
        root2: Math.sqrt(2), // 1.414
        root3: Math.sqrt(3), // 1.732
        root5: Math.sqrt(5), // 2.236
        rule_of_thirds: 1 / 3, // 0.333
        rabatment: Math.sqrt(2) - 1 // 0.414
    };

    // ==========================================
    // FIBONACCI SPACING SYSTEM
    // ==========================================
    
    const FIBONACCI_SCALE = {
        // Generate Fibonacci-based spacing scale
        values: FIBONACCI_SEQUENCE.map(n => n * BASE_UNIT),
        
        // Get Fibonacci value by index
        get: function(index) {
            return this.values[Math.min(index, this.values.length - 1)];
        },
        
        // Find closest Fibonacci value
        closest: function(value) {
            const target = value / BASE_UNIT;
            let closest = this.values[0];
            let minDiff = Math.abs(target - closest);
            
            for (let i = 1; i < this.values.length; i++) {
                const diff = Math.abs(target - this.values[i]);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = this.values[i];
                }
            }
            return closest;
        },
        
        // Generate spacing utilities
        spacing: {
            xs: BASE_UNIT,           // 8px
            sm: BASE_UNIT * 2,       // 16px  
            md: BASE_UNIT * 3,       // 24px
            lg: BASE_UNIT * 5,       // 40px
            xl: BASE_UNIT * 8,       // 64px
            xxl: BASE_UNIT * 13,     // 104px
            xxxl: BASE_UNIT * 21     // 168px
        }
    };

    // ==========================================
    // GOLDEN RATIO LAYOUT SYSTEM
    // ==========================================
    
    const GOLDEN_LAYOUT = {
        // Generate golden ratio based dimensions
        dimensions: {
            // Standard golden rectangles
            small: { width: 233, height: 144 },      // φ ratio
            medium: { width: 377, height: 233 },     // φ ratio
            large: { width: 610, height: 377 },      // φ ratio
            
            // Generate dynamic golden rectangle
            rectangle: function(width) {
                return {
                    width: width,
                    height: Math.round(width / GOLDEN_RATIO)
                };
            },
            
            // Golden spiral segments
            spiral: function(size) {
                return [
                    size,
                    Math.round(size / GOLDEN_RATIO),
                    Math.round(size / PHI_SQUARED),
                    Math.round(size / PHI_CUBED)
                ];
            }
        },
        
        // Grid proportions based on golden ratio
        grid: {
            // Generate golden ratio grid columns
            columns: function(total = 12) {
                const golden = Math.round(total * GOLDEN_RATIO_INVERSE);
                return {
                    primary: golden,
                    secondary: total - golden,
                    ratio: golden / (total - golden)
                };
            },
            
            // Golden section points
            sections: {
                major: GOLDEN_RATIO_INVERSE, // 0.618
                minor: 1 - GOLDEN_RATIO_INVERSE, // 0.382
                points: [0, 0.382, 0.618, 1.0]
            }
        },
        
        // Typography scaling using golden ratio
        typography: {
            scale: function(baseSize = 16) {
                return {
                    xs: Math.round(baseSize / PHI_SQUARED),      // ~6px
                    sm: Math.round(baseSize / GOLDEN_RATIO),     // ~10px
                    base: baseSize,                              // 16px
                    md: Math.round(baseSize * ROOT_PHI),         // ~20px
                    lg: Math.round(baseSize * GOLDEN_RATIO),     // ~26px
                    xl: Math.round(baseSize * PHI_SQUARED),      // ~42px
                    xxl: Math.round(baseSize * PHI_CUBED)        // ~68px
                };
            }
        }
    };

    // ==========================================
    // COLOR HARMONY MATHEMATICS
    // ==========================================
    
    const COLOR_HARMONY = {
        // HSV color temperature mapping for game states
        gameStates: {
            safe: { h: 130, s: 35, v: 75 },         // Soft greens
            tension: { h: 40, s: 65, v: 85 },       // Warning ambers
            danger: { h: 8, s: 80, v: 80 },         // Blood reds
            mystery: { h: 260, s: 50, v: 40 },      // Deep purples
            triumph: { h: 50, s: 90, v: 95 },       // Victory golds
            neutral: { h: 220, s: 30, v: 70 },      // UI neutrals
            focus: { h: 210, s: 90, v: 85 },        // Primary actions
            secondary: { h: 190, s: 60, v: 75 }     // Secondary actions
        },
        
        // Generate harmonic color progressions
        harmony: {
            // Analogous harmony (±30° hue shift)
            analogous: function(baseHue, count = 3) {
                const colors = [];
                const step = 60 / (count - 1);
                for (let i = 0; i < count; i++) {
                    colors.push({
                        h: (baseHue - 30 + (i * step)) % 360,
                        s: 60 + (Math.sin(i * Math.PI / count) * 20),
                        v: 70 + (Math.cos(i * Math.PI / count) * 15)
                    });
                }
                return colors;
            },
            
            // Triadic harmony (120° intervals)
            triadic: function(baseHue) {
                return [
                    { h: baseHue, s: 70, v: 80 },
                    { h: (baseHue + 120) % 360, s: 70, v: 80 },
                    { h: (baseHue + 240) % 360, s: 70, v: 80 }
                ];
            },
            
            // Split complementary (150° and 210°)
            splitComplementary: function(baseHue) {
                return [
                    { h: baseHue, s: 70, v: 80 },
                    { h: (baseHue + 150) % 360, s: 70, v: 80 },
                    { h: (baseHue + 210) % 360, s: 70, v: 80 }
                ];
            },
            
            // Tetradic harmony (90° intervals)
            tetradic: function(baseHue) {
                return [
                    { h: baseHue, s: 70, v: 80 },
                    { h: (baseHue + 90) % 360, s: 70, v: 80 },
                    { h: (baseHue + 180) % 360, s: 70, v: 80 },
                    { h: (baseHue + 270) % 360, s: 70, v: 80 }
                ];
            }
        },
        
        // Convert HSV to CSS values
        toCSS: function(hsv) {
            return `hsl(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
        },
        
        // Generate dynamic color palette
        generatePalette: function(baseColor, mood = 'neutral', count = 5) {
            const moodConfig = this.gameStates[mood];
            if (!moodConfig) return [];
            
            const palette = [];
            for (let i = 0; i < count; i++) {
                const factor = i / (count - 1);
                palette.push({
                    h: (moodConfig.h + (factor * 30)) % 360,
                    s: Math.max(10, moodConfig.s - (factor * 20)),
                    v: Math.max(20, moodConfig.v - (factor * 15))
                });
            }
            return palette;
        }
    };

    // ==========================================
    // COMPONENT HIERARCHY FRAMEWORK
    // ==========================================
    
    const COMPONENT_HIERARCHY = {
        // 4-tier priority system with mathematical scaling
        tiers: {
            critical: {
                priority: 1,
                zIndex: 1000,
                scale: 1.0,
                opacity: 1.0,
                contrast: 7.0, // WCAG AAA
                updateRate: '60fps'
            },
            primary: {
                priority: 2,
                zIndex: 100,
                scale: GOLDEN_RATIO_INVERSE, // 0.618
                opacity: 0.95,
                contrast: 4.5, // WCAG AA
                updateRate: '30fps'
            },
            secondary: {
                priority: 3,
                zIndex: 10,
                scale: Math.pow(GOLDEN_RATIO_INVERSE, 2), // 0.382
                opacity: 0.8,
                contrast: 3.0,
                updateRate: '15fps'
            },
            ambient: {
                priority: 4,
                zIndex: 1,
                scale: Math.pow(GOLDEN_RATIO_INVERSE, 3), // 0.236
                opacity: 0.6,
                contrast: 2.0,
                updateRate: 'event-driven'
            }
        },
        
        // Calculate visual hierarchy weight
        calculateWeight: function(element) {
            const size = element.offsetWidth * element.offsetHeight;
            const position = element.getBoundingClientRect();
            const center = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            };
            
            // Distance from center (closer = higher weight)
            const distance = Math.sqrt(
                Math.pow(position.left + position.width/2 - center.x, 2) +
                Math.pow(position.top + position.height/2 - center.y, 2)
            );
            
            // Visual weight calculation
            return (size / 1000) * (1 / (distance / 100 + 1));
        }
    };

    // ==========================================
    // ANIMATION TIMING MATHEMATICS
    // ==========================================
    
    const ANIMATION_TIMING = {
        // Psychologically-optimized easing curves
        easings: {
            // Mechanical feelings
            swift: [0.4, 0.0, 0.2, 1],
            snappy: [0.4, 0.0, 0.6, 1],
            
            // Organic feelings
            human: [0.4, 0.0, 0.1, 1],
            bounce: [0.68, -0.55, 0.265, 1.55],
            
            // Game-specific
            damage: [0.8, 0.0, 0.7, 0.2],
            power: [0.2, 0.8, 0.3, 1.2],
            death: [0.4, 0.0, 1, 0.4],
            
            // Golden ratio based
            golden: [GOLDEN_RATIO_INVERSE, 0, 1 - GOLDEN_RATIO_INVERSE, 1]
        },
        
        // Duration calculations based on golden ratio
        durations: {
            instant: 0,
            micro: Math.round(100 / GOLDEN_RATIO), // ~62ms
            short: Math.round(200 / GOLDEN_RATIO), // ~124ms
            medium: 200, // Base duration
            long: Math.round(200 * GOLDEN_RATIO), // ~324ms
            slow: Math.round(200 * PHI_SQUARED), // ~524ms
            
            // Calculate optimal duration for distance
            forDistance: function(pixels) {
                return Math.max(100, Math.min(500, pixels * 0.5));
            }
        },
        
        // Stagger patterns for multiple elements
        stagger: {
            cascade: (i) => i * 50,
            exponential: (i) => Math.pow(GOLDEN_RATIO, i) * 30,
            fibonacci: (i) => FIBONACCI_SEQUENCE[Math.min(i, FIBONACCI_SEQUENCE.length - 1)] * 10,
            wave: (i) => Math.sin(i * GOLDEN_RATIO_INVERSE) * 40 + 50,
            golden: (i) => i * 100 * GOLDEN_RATIO_INVERSE
        }
    };

    // ==========================================
    // PERFORMANCE OPTIMIZATION FRAMEWORK
    // ==========================================
    
    const PERFORMANCE = {
        // 60fps mathematical constraints
        frameConstraints: {
            targetFPS: 60,
            frameTime: 1000 / 60, // 16.67ms
            budgetPerFrame: 10, // 10ms for JS execution
            maxAnimations: 10, // Concurrent animations
            maxParticles: 100 // Particle system limit
        },
        
        // Memory budgets with golden ratio scaling
        memoryBudgets: {
            textures: 32 * 1024 * 1024, // 32MB
            meshes: Math.round(16 * 1024 * 1024 * GOLDEN_RATIO), // ~26MB
            animations: 8 * 1024 * 1024, // 8MB
            audio: Math.round(16 * 1024 * 1024 * GOLDEN_RATIO_INVERSE) // ~10MB
        },
        
        // Performance monitoring utilities
        monitor: {
            frameTime: 0,
            lastFrame: performance.now(),
            samples: new Array(60).fill(16.67),
            sampleIndex: 0,
            
            update: function() {
                const now = performance.now();
                this.frameTime = now - this.lastFrame;
                this.lastFrame = now;
                
                this.samples[this.sampleIndex] = this.frameTime;
                this.sampleIndex = (this.sampleIndex + 1) % this.samples.length;
            },
            
            getAverageFPS: function() {
                const avgFrameTime = this.samples.reduce((a, b) => a + b) / this.samples.length;
                return Math.round(1000 / avgFrameTime);
            },
            
            isPerformant: function() {
                return this.getAverageFPS() >= 55; // 5fps tolerance
            }
        },
        
        // Optimization triggers
        optimize: {
            // Reduce quality when performance drops
            onPerformanceDrop: function() {
                if (!PERFORMANCE.monitor.isPerformant()) {
                    document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
                    console.warn('Performance optimization: Reducing animation duration');
                }
            },
            
            // Restore quality when performance improves
            onPerformanceRestore: function() {
                if (PERFORMANCE.monitor.isPerformant()) {
                    document.documentElement.style.setProperty('--animation-duration-multiplier', '1');
                }
            }
        }
    };

    // ==========================================
    // ACCESSIBILITY FOUNDATION
    // ==========================================
    
    const ACCESSIBILITY = {
        // Mathematical precision for universal access
        contrast: {
            // WCAG contrast ratio calculations
            calculateRatio: function(color1, color2) {
                const l1 = this.getLuminance(color1);
                const l2 = this.getLuminance(color2);
                const lighter = Math.max(l1, l2);
                const darker = Math.min(l1, l2);
                return (lighter + 0.05) / (darker + 0.05);
            },
            
            getLuminance: function(rgb) {
                const [r, g, b] = rgb.map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * r + 0.7152 * g + 0.0722 * b;
            },
            
            // Ensure minimum contrast ratios
            meetsWCAG: function(ratio, level = 'AA') {
                const requirements = {
                    'AA': 4.5,
                    'AAA': 7.0,
                    'AA_large': 3.0,
                    'AAA_large': 4.5
                };
                return ratio >= requirements[level];
            }
        },
        
        // Motion and timing preferences
        motion: {
            // Respect user motion preferences
            respectsPreferences: function() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            },
            
            // Adjust animations for accessibility
            adjustForMotion: function(duration) {
                if (this.respectsPreferences()) {
                    return Math.min(duration, 200); // Cap at 200ms
                }
                return duration;
            }
        },
        
        // Focus management with mathematical precision
        focus: {
            // Calculate optimal focus ring size based on golden ratio
            ringSize: function(elementSize) {
                return Math.max(2, Math.round(elementSize * 0.1 * GOLDEN_RATIO));
            },
            
            // Focus trap implementation
            trapFocus: function(container) {
                const focusableElements = container.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                container.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        } else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        }
    };

    // ==========================================
    // CSS CUSTOM PROPERTIES GENERATION
    // ==========================================
    
    const CSS_PROPERTIES = {
        // Generate CSS custom properties for all mathematical relationships
        generate: function() {
            const root = document.documentElement;
            
            // Golden ratio properties
            root.style.setProperty('--golden-ratio', GOLDEN_RATIO);
            root.style.setProperty('--golden-ratio-inverse', GOLDEN_RATIO_INVERSE);
            root.style.setProperty('--phi-squared', PHI_SQUARED);
            root.style.setProperty('--root-phi', ROOT_PHI);
            
            // Fibonacci spacing scale
            FIBONACCI_SCALE.values.forEach((value, index) => {
                root.style.setProperty(`--fib-${index}`, `${value}px`);
            });
            
            // Spacing utilities
            Object.entries(FIBONACCI_SCALE.spacing).forEach(([key, value]) => {
                root.style.setProperty(`--spacing-${key}`, `${value}px`);
            });
            
            // Typography scale
            const typeScale = GOLDEN_LAYOUT.typography.scale(16);
            Object.entries(typeScale).forEach(([key, value]) => {
                root.style.setProperty(`--font-size-${key}`, `${value}px`);
            });
            
            // Animation durations
            Object.entries(ANIMATION_TIMING.durations).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    root.style.setProperty(`--duration-${key}`, `${value}ms`);
                }
            });
            
            // Component hierarchy
            Object.entries(COMPONENT_HIERARCHY.tiers).forEach(([tier, config]) => {
                root.style.setProperty(`--z-${tier}`, config.zIndex);
                root.style.setProperty(`--scale-${tier}`, config.scale);
                root.style.setProperty(`--opacity-${tier}`, config.opacity);
            });
            
            // Game state colors
            Object.entries(COLOR_HARMONY.gameStates).forEach(([state, hsv]) => {
                root.style.setProperty(`--color-${state}`, COLOR_HARMONY.toCSS(hsv));
            });
        }
    };

    // ==========================================
    // COMPONENT BASE CLASSES
    // ==========================================
    
    const COMPONENT_BASES = {
        // Base component class with mathematical foundation
        Component: class {
            constructor(element, options = {}) {
                this.element = element;
                this.options = { ...this.defaults, ...options };
                this.tier = options.tier || 'secondary';
                this.initialize();
            }
            
            get defaults() {
                return {
                    duration: ANIMATION_TIMING.durations.medium,
                    easing: ANIMATION_TIMING.easings.human,
                    respectMotion: true
                };
            }
            
            initialize() {
                this.applyHierarchy();
                this.bindEvents();
            }
            
            applyHierarchy() {
                const tierConfig = COMPONENT_HIERARCHY.tiers[this.tier];
                if (tierConfig) {
                    this.element.style.zIndex = tierConfig.zIndex;
                    this.element.style.opacity = tierConfig.opacity;
                }
            }
            
            animate(properties, options = {}) {
                const duration = ACCESSIBILITY.motion.adjustForMotion(
                    options.duration || this.options.duration
                );
                
                const easing = options.easing || this.options.easing;
                const easingString = Array.isArray(easing) 
                    ? `cubic-bezier(${easing.join(', ')})` 
                    : easing;
                
                return this.element.animate(properties, {
                    duration,
                    easing: easingString,
                    fill: 'both'
                });
            }
            
            bindEvents() {
                // Override in subclasses
            }
        },
        
        // Card component with golden ratio sizing
        Card: class extends this.Component {
            constructor(element, options = {}) {
                super(element, options);
                this.applyGoldenRatio();
            }
            
            applyGoldenRatio() {
                if (this.options.autoResize) {
                    const width = this.element.offsetWidth;
                    const goldenHeight = width / GOLDEN_RATIO;
                    this.element.style.height = `${goldenHeight}px`;
                }
            }
            
            expand() {
                const scale = GOLDEN_RATIO;
                return this.animate({
                    transform: [`scale(1)`, `scale(${scale})`]
                });
            }
            
            collapse() {
                const scale = GOLDEN_RATIO_INVERSE;
                return this.animate({
                    transform: [`scale(1)`, `scale(${scale})`]
                });
            }
        },
        
        // Modal component with focus management
        Modal: class extends this.Component {
            constructor(element, options = {}) {
                super(element, { tier: 'critical', ...options });
            }
            
            open() {
                ACCESSIBILITY.focus.trapFocus(this.element);
                return this.animate({
                    opacity: [0, 1],
                    transform: ['scale(0.9)', 'scale(1)']
                });
            }
            
            close() {
                return this.animate({
                    opacity: [1, 0],
                    transform: ['scale(1)', 'scale(0.9)']
                });
            }
        }
    };

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    const UTILITIES = {
        // Mathematical interpolation functions
        lerp: function(a, b, t) {
            return a + (b - a) * t;
        },
        
        // Smooth step function
        smoothStep: function(edge0, edge1, x) {
            const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        },
        
        // Golden ratio spiral calculation
        goldenSpiral: function(t, size = 100) {
            const angle = t * Math.PI * 2;
            const radius = size * Math.pow(GOLDEN_RATIO, t);
            return {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            };
        },
        
        // Responsive scaling based on viewport
        responsiveScale: function(baseSize, minSize = baseSize * 0.5, maxSize = baseSize * 2) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const diagonal = Math.sqrt(vw * vw + vh * vh);
            const scale = Math.max(0.5, Math.min(2, diagonal / 1000));
            return Math.max(minSize, Math.min(maxSize, baseSize * scale));
        },
        
        // Debounce utility with golden ratio timing
        debounce: function(func, delay = ANIMATION_TIMING.durations.medium) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },
        
        // Throttle utility
        throttle: function(func, delay = ANIMATION_TIMING.durations.micro) {
            let lastCall = 0;
            return function (...args) {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    return func.apply(this, args);
                }
            };
        }
    };

    // ==========================================
    // INITIALIZATION & API
    // ==========================================
    
    const DesignSystem = {
        // Core modules
        GOLDEN_RATIO,
        FIBONACCI_SCALE,
        GOLDEN_LAYOUT,
        COLOR_HARMONY,
        COMPONENT_HIERARCHY,
        ANIMATION_TIMING,
        PERFORMANCE,
        ACCESSIBILITY,
        
        // Component bases
        Component: COMPONENT_BASES.Component,
        Card: COMPONENT_BASES.Card,
        Modal: COMPONENT_BASES.Modal,
        
        // Utilities
        utils: UTILITIES,
        
        // Initialization
        init: function(options = {}) {
            console.log('🎯 Initializing ZENITH Design System Foundation...');
            
            // Generate CSS custom properties
            CSS_PROPERTIES.generate();
            
            // Start performance monitoring
            if (options.monitor !== false) {
                this.startPerformanceMonitoring();
            }
            
            // Apply initial optimizations
            this.applyInitialOptimizations();
            
            console.log('✅ Design System Foundation initialized');
            return this;
        },
        
        // Performance monitoring
        startPerformanceMonitoring: function() {
            const monitor = () => {
                PERFORMANCE.monitor.update();
                PERFORMANCE.optimize.onPerformanceDrop();
                requestAnimationFrame(monitor);
            };
            requestAnimationFrame(monitor);
        },
        
        // Apply initial optimizations
        applyInitialOptimizations: function() {
            // Reduce motion if preferred
            if (ACCESSIBILITY.motion.respectsPreferences()) {
                document.documentElement.style.setProperty('--animation-duration-multiplier', '0.3');
            }
            
            // Set up viewport-based scaling
            const updateScale = UTILITIES.throttle(() => {
                const scale = UTILITIES.responsiveScale(1);
                document.documentElement.style.setProperty('--responsive-scale', scale);
            }, 100);
            
            window.addEventListener('resize', updateScale);
            updateScale();
        },
        
        // Create color palette for game state
        createGamePalette: function(state, count = 5) {
            return COLOR_HARMONY.generatePalette(null, state, count);
        },
        
        // Create component with hierarchy
        createComponent: function(element, type = 'Component', options = {}) {
            const ComponentClass = COMPONENT_BASES[type];
            if (!ComponentClass) {
                throw new Error(`Component type "${type}" not found`);
            }
            return new ComponentClass(element, options);
        },
        
        // Get Fibonacci spacing value
        spacing: function(index) {
            return FIBONACCI_SCALE.get(index);
        },
        
        // Calculate golden ratio dimensions
        goldenDimensions: function(width) {
            return GOLDEN_LAYOUT.dimensions.rectangle(width);
        },
        
        // Version info
        version: '1.0.0',
        
        // Debug utilities
        debug: {
            showGrid: function() {
                document.body.style.backgroundImage = `
                    linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px)
                `;
                document.body.style.backgroundSize = `${FIBONACCI_SCALE.spacing.md}px ${FIBONACCI_SCALE.spacing.md}px`;
            },
            
            hideGrid: function() {
                document.body.style.backgroundImage = 'none';
            },
            
            logPerformance: function() {
                console.table({
                    'Average FPS': PERFORMANCE.monitor.getAverageFPS(),
                    'Frame Time': `${PERFORMANCE.monitor.frameTime.toFixed(2)}ms`,
                    'Performance': PERFORMANCE.monitor.isPerformant() ? '✅ Good' : '⚠️ Poor'
                });
            }
        }
    };

    // ==========================================
    // CSS INJECTION
    // ==========================================
    
    // Inject fundamental CSS for the design system
    const injectFoundationCSS = function() {
        const css = `
        /* ZENITH Design System Foundation CSS */
        
        :root {
            /* Base mathematical constants */
            --golden-ratio: ${GOLDEN_RATIO};
            --phi-inverse: ${GOLDEN_RATIO_INVERSE};
            --base-unit: ${BASE_UNIT}px;
            
            /* Responsive scaling */
            --responsive-scale: 1;
            --animation-duration-multiplier: 1;
        }
        
        /* Fibonacci spacing utilities */
        .space-xs { gap: var(--spacing-xs); }
        .space-sm { gap: var(--spacing-sm); }
        .space-md { gap: var(--spacing-md); }
        .space-lg { gap: var(--spacing-lg); }
        .space-xl { gap: var(--spacing-xl); }
        
        /* Golden ratio layout helpers */
        .golden-rect {
            aspect-ratio: var(--golden-ratio) / 1;
        }
        
        .golden-rect-inverse {
            aspect-ratio: 1 / var(--golden-ratio);
        }
        
        /* Component hierarchy */
        .tier-critical { z-index: var(--z-critical); opacity: var(--opacity-critical); }
        .tier-primary { z-index: var(--z-primary); opacity: var(--opacity-primary); }
        .tier-secondary { z-index: var(--z-secondary); opacity: var(--opacity-secondary); }
        .tier-ambient { z-index: var(--z-ambient); opacity: var(--opacity-ambient); }
        
        /* Animation foundation */
        .animate-swift { transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1); }
        .animate-human { transition-timing-function: cubic-bezier(0.4, 0.0, 0.1, 1); }
        .animate-bounce { transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-golden { transition-timing-function: cubic-bezier(${GOLDEN_RATIO_INVERSE}, 0, ${1 - GOLDEN_RATIO_INVERSE}, 1); }
        
        /* Performance optimizations */
        .gpu-accelerate {
            transform: translateZ(0);
            will-change: transform, opacity;
        }
        
        /* Accessibility enhancements */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
        }
        
        /* Focus management */
        .focus-ring {
            outline: 2px solid var(--color-focus);
            outline-offset: 2px;
            border-radius: 2px;
        }
        
        /* Golden spiral grid */
        .spiral-grid {
            display: grid;
            grid-template-columns: 
                1fr 
                calc(1fr * var(--phi-inverse)) 
                calc(1fr * var(--phi-inverse) * var(--phi-inverse));
            gap: var(--spacing-md);
        }
        
        /* Responsive utilities */
        .scale-responsive {
            transform: scale(var(--responsive-scale));
        }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // ==========================================
    // EXPORT TO GLOBAL SCOPE
    // ==========================================
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectFoundationCSS();
            DesignSystem.init();
        });
    } else {
        injectFoundationCSS();
        DesignSystem.init();
    }
    
    // Expose to global scope
    global.DesignSystem = DesignSystem;
    global.ZENITH = DesignSystem; // Alias for easier access
    
    // AMD/CommonJS compatibility
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DesignSystem;
    } else if (typeof define === 'function' && define.amd) {
        define(() => DesignSystem);
    }

})(typeof window !== 'undefined' ? window : global);

// ==========================================
// DESIGN SYSTEM INTEGRATION HELPERS
// ==========================================

/**
 * Integration helper for existing Football Manager UI
 * Provides seamless integration with current main.html structure
 */
(function() {
    'use strict';
    
    // Wait for both Design System and FM UI to be ready
    const initializeIntegration = function() {
        if (typeof window.ZENITH === 'undefined' || typeof window.GRID_CONFIG === 'undefined') {
            setTimeout(initializeIntegration, 100);
            return;
        }
        
        console.log('🔗 Integrating ZENITH Design System with FM UI...');
        
        // Enhance existing grid system with golden ratio
        if (window.GRID_CONFIG) {
            // Apply golden ratio to grid proportions
            const goldenColumns = ZENITH.GOLDEN_LAYOUT.grid.columns(window.GRID_CONFIG.columns);
            
            // Update CSS custom properties
            document.documentElement.style.setProperty('--grid-golden-primary', goldenColumns.primary);
            document.documentElement.style.setProperty('--grid-golden-secondary', goldenColumns.secondary);
        }
        
        // Enhance card creation with design system
        if (typeof window.createCardFromData === 'function') {
            const originalCreateCard = window.createCardFromData;
            window.createCardFromData = function(cardData, pageName) {
                const card = originalCreateCard.call(this, cardData, pageName);
                
                // Apply design system enhancements
                card.classList.add('tier-secondary', 'animate-human');
                
                // Create design system component
                const cardComponent = new ZENITH.Card(card, {
                    tier: 'secondary',
                    autoResize: false
                });
                
                return card;
            };
        }
        
        // Enhance color system
        const applyGameStateColors = function() {
            const states = ['safe', 'tension', 'danger', 'mystery', 'triumph'];
            states.forEach(state => {
                const palette = ZENITH.createGamePalette(state, 3);
                palette.forEach((color, index) => {
                    const cssColor = ZENITH.COLOR_HARMONY.toCSS(color);
                    document.documentElement.style.setProperty(
                        `--game-${state}-${index}`, 
                        cssColor
                    );
                });
            });
        };
        
        applyGameStateColors();
        
        // Enhance animations with performance monitoring
        const enhanceAnimations = function() {
            // Monitor and optimize existing animations
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.addEventListener('transitionstart', () => {
                    if (!ZENITH.PERFORMANCE.monitor.isPerformant()) {
                        card.style.transitionDuration = '0.1s';
                    }
                });
            });
        };
        
        enhanceAnimations();
        
        // Add debug helpers
        window.ZENITH_DEBUG = {
            showMathematicalGrid: function() {
                ZENITH.debug.showGrid();
                console.log('📐 Mathematical grid overlay enabled');
            },
            
            hideMathematicalGrid: function() {
                ZENITH.debug.hideGrid();
                console.log('📐 Mathematical grid overlay disabled');
            },
            
            analyzeColorHarmony: function() {
                const colors = ZENITH.COLOR_HARMONY.harmony.analogous(220, 5);
                console.table(colors.map(color => ({
                    HSV: `${color.h}°, ${color.s}%, ${color.v}%`,
                    CSS: ZENITH.COLOR_HARMONY.toCSS(color)
                })));
            },
            
            measurePerformance: function() {
                ZENITH.debug.logPerformance();
            },
            
            goldenRatioInfo: function() {
                console.table({
                    'Golden Ratio (φ)': ZENITH.GOLDEN_RATIO,
                    'φ⁻¹ (Inverse)': ZENITH.GOLDEN_RATIO_INVERSE,
                    'φ² (Squared)': ZENITH.GOLDEN_RATIO * ZENITH.GOLDEN_RATIO,
                    '√φ (Root)': Math.sqrt(ZENITH.GOLDEN_RATIO)
                });
            }
        };
        
        console.log('✅ ZENITH Design System integration complete');
        console.log('🔧 Debug helpers available via window.ZENITH_DEBUG');
    };
    
    // Start integration
    initializeIntegration();
})();