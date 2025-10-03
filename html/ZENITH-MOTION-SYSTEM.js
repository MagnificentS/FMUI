/**
 * ZENITH MOTION SYSTEM
 * Agent 4 - Implement 60fps performance with psychological timing
 * Following ZENITH philosophy: "The interface is the game's subconscious - felt, not seen"
 */

(function() {
    'use strict';

    console.log('✨ ZENITH MOTION SYSTEM: Implementing psychological timing and 60fps performance...');

    const ZenithMotion = {
        initialized: false,
        
        // ZENITH timing constants from CLAUDE.md
        timing: {
            instant: 0,         // Neural response
            primary: 16,        // 1 frame @ 60fps
            secondary: 50,      // 3 frames
            environmental: 100, // Background feedback
            state_transition: 300,
            flow_preservation: 800
        },
        
        // ZENITH easing curves from CLAUDE.md
        easings: {
            swift: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            snappy: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
            human: 'cubic-bezier(0.4, 0.0, 0.1, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            damage: 'cubic-bezier(0.8, 0.0, 0.7, 0.2)',
            power: 'cubic-bezier(0.2, 0.8, 0.3, 1.2)',
            death: 'cubic-bezier(0.4, 0.0, 1, 0.4)'
        },
        
        // Performance monitoring
        performance: {
            frameCount: 0,
            lastFrameTime: performance.now(),
            averageFPS: 60,
            targetFPS: 60
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('✨ ZENITH MOTION: Implementing motion choreography...');
            
            this.injectZenithCSS();
            this.setupPerformanceMonitoring();
            this.enhanceCardMotion();
            this.optimizeInteractions();
            this.implementStaggeredAnimations();
            this.setupAdaptivePerformance();
            
            this.initialized = true;
            console.log('✅ ZENITH MOTION: Motion system active');
        },
        
        injectZenithCSS() {
            console.log('🎨 Injecting ZENITH motion CSS...');
            
            const zenithCSS = `
                /* ZENITH Motion System - Psychological Timing */
                :root {
                    /* ZENITH timing variables */
                    --zenith-instant: 0ms;
                    --zenith-primary: 16ms;
                    --zenith-secondary: 50ms;
                    --zenith-environmental: 100ms;
                    --zenith-transition: 300ms;
                    --zenith-flow: 800ms;
                    
                    /* ZENITH easing functions */
                    --zenith-swift: cubic-bezier(0.4, 0.0, 0.2, 1);
                    --zenith-snappy: cubic-bezier(0.4, 0.0, 0.6, 1);
                    --zenith-human: cubic-bezier(0.4, 0.0, 0.1, 1);
                    --zenith-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    --zenith-damage: cubic-bezier(0.8, 0.0, 0.7, 0.2);
                    --zenith-power: cubic-bezier(0.2, 0.8, 0.3, 1.2);
                }
                
                /* ZENITH Card Motion Enhancement */
                .card {
                    transition: all var(--zenith-transition) var(--zenith-human) !important;
                    will-change: transform, box-shadow !important;
                    backface-visibility: hidden !important;
                }
                
                .card:hover {
                    transform: translateY(-4px) scale(1.02) !important;
                    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3) !important;
                    transition: all var(--zenith-primary) var(--zenith-swift) !important;
                }
                
                .card:active {
                    transform: translateY(-2px) scale(1.01) !important;
                    transition: all var(--zenith-instant) var(--zenith-damage) !important;
                }
                
                /* ZENITH Interactive Element Motion */
                .card-header {
                    transition: background-color var(--zenith-primary) var(--zenith-human) !important;
                }
                
                .card-header:hover {
                    background-color: rgba(255, 255, 255, 0.03) !important;
                }
                
                button, select, input {
                    transition: all var(--zenith-primary) var(--zenith-swift) !important;
                    will-change: transform, background-color !important;
                }
                
                button:hover, select:hover {
                    transform: translateY(-1px) !important;
                    background: rgba(0, 148, 204, 0.3) !important;
                }
                
                button:active, select:active {
                    transform: translateY(0) !important;
                    transition: all var(--zenith-instant) var(--zenith-damage) !important;
                }
                
                /* ZENITH Navigation Motion */
                .nav-tab {
                    transition: all var(--zenith-secondary) var(--zenith-human) !important;
                }
                
                .nav-tab:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 8px rgba(0, 148, 204, 0.3) !important;
                }
                
                .nav-tab.active {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 4px rgba(0, 148, 204, 0.5) !important;
                }
                
                /* ZENITH Resize Handle Motion */
                .resize-handle, .resize-handle-bl {
                    transition: all var(--zenith-secondary) var(--zenith-human) !important;
                    will-change: opacity, transform !important;
                }
                
                .card:hover .resize-handle,
                .card:hover .resize-handle-bl {
                    opacity: 0.8 !important;
                    transform: scale(1.1) !important;
                }
                
                /* ZENITH Chart Animation */
                .chart-container {
                    transition: all var(--zenith-transition) var(--zenith-human) !important;
                }
                
                .chart-container:hover {
                    transform: scale(1.02) !important;
                }
                
                /* ZENITH Staggered Animations */
                .card:nth-child(1) { animation-delay: 0ms; }
                .card:nth-child(2) { animation-delay: 50ms; }
                .card:nth-child(3) { animation-delay: 100ms; }
                .card:nth-child(4) { animation-delay: 150ms; }
                .card:nth-child(5) { animation-delay: 200ms; }
                .card:nth-child(6) { animation-delay: 250ms; }
                .card:nth-child(7) { animation-delay: 300ms; }
                .card:nth-child(8) { animation-delay: 350ms; }
                
                @keyframes zenithCardEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .card {
                    animation: zenithCardEntrance var(--zenith-flow) var(--zenith-human) both;
                }
                
                /* ZENITH Performance Optimizations */
                .tile-container {
                    contain: layout style paint !important;
                    will-change: scroll-position !important;
                }
                
                .card.dragging {
                    will-change: transform !important;
                    transform: translateZ(0) !important; /* Force GPU acceleration */
                }
                
                .card.resizing {
                    will-change: width, height !important;
                }
                
                /* ZENITH Visual Feedback */
                .zenith-success {
                    animation: zenithSuccessPulse 0.6s var(--zenith-bounce);
                }
                
                .zenith-error {
                    animation: zenithErrorShake 0.4s var(--zenith-damage);
                }
                
                .zenith-loading {
                    animation: zenithLoadingPulse 1.2s var(--zenith-human) infinite;
                }
                
                @keyframes zenithSuccessPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(0, 255, 136, 0.6); }
                    100% { transform: scale(1); }
                }
                
                @keyframes zenithErrorShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                
                @keyframes zenithLoadingPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                
                /* ZENITH Accessibility - Respect reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'zenith-motion-system';
            style.textContent = zenithCSS;
            document.head.appendChild(style);
            
            console.log('✅ ZENITH motion CSS injected');
        },
        
        setupPerformanceMonitoring() {
            console.log('📊 Setting up 60fps performance monitoring...');
            
            let frameCount = 0;
            let lastTime = performance.now();
            
            const monitor = (currentTime) => {
                frameCount++;
                
                if (currentTime - lastTime >= 1000) {
                    this.performance.averageFPS = frameCount;
                    
                    if (this.performance.averageFPS < 55) {
                        console.warn(`⚠️ ZENITH: Performance below target (${this.performance.averageFPS}fps)`);
                        this.enablePerformanceMode();
                    } else if (this.performance.averageFPS >= 58) {
                        console.log(`✅ ZENITH: Excellent performance (${this.performance.averageFPS}fps)`);
                    }
                    
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                requestAnimationFrame(monitor);
            };
            
            requestAnimationFrame(monitor);
            console.log('✅ Performance monitoring active');
        },
        
        enhanceCardMotion() {
            console.log('🎴 Enhancing card motion with ZENITH principles...');
            
            // Add smooth card loading animation
            document.querySelectorAll('.card').forEach((card, index) => {
                // Staggered entrance animation
                card.style.animationDelay = `${index * 50}ms`;
                card.classList.add('zenith-card-enhanced');
                
                // Enhanced hover interactions
                this.addCardHoverEnhancements(card);
            });
            
            // Watch for new cards
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList.contains('card')) {
                            this.addCardHoverEnhancements(node);
                        }
                    });
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            console.log('✅ Card motion enhancements applied');
        },
        
        addCardHoverEnhancements(card) {
            // ZENITH hover feedback with psychological timing
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.3)';
                card.style.transition = `all ${this.timing.primary}ms ${this.easings.swift}`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
                card.style.transition = `all ${this.timing.state_transition}ms ${this.easings.human}`;
            });
            
            // Enhanced click feedback
            card.addEventListener('mousedown', () => {
                card.style.transform = 'translateY(-2px) scale(1.01)';
                card.style.transition = `all ${this.timing.instant}ms ${this.easings.damage}`;
            });
            
            card.addEventListener('mouseup', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.transition = `all ${this.timing.primary}ms ${this.easings.swift}`;
            });
        },
        
        optimizeInteractions() {
            console.log('⚡ Optimizing interactions for 60fps...');
            
            // Optimize button interactions
            document.addEventListener('mouseenter', (e) => {
                if (e.target.matches('button, select, input, .nav-tab')) {
                    e.target.style.willChange = 'transform, background-color';
                }
            }, true);
            
            document.addEventListener('mouseleave', (e) => {
                if (e.target.matches('button, select, input, .nav-tab')) {
                    setTimeout(() => {
                        e.target.style.willChange = 'auto';
                    }, this.timing.state_transition);
                }
            }, true);
            
            // Optimize resize handle interactions
            document.addEventListener('mousedown', (e) => {
                if (e.target.matches('.resize-handle, .resize-handle-bl')) {
                    const card = e.target.closest('.card');
                    if (card) {
                        card.style.willChange = 'width, height';
                        card.classList.add('resizing');
                    }
                }
            });
            
            document.addEventListener('mouseup', (e) => {
                const resizingCards = document.querySelectorAll('.card.resizing');
                resizingCards.forEach(card => {
                    setTimeout(() => {
                        card.style.willChange = 'auto';
                        card.classList.remove('resizing');
                    }, this.timing.state_transition);
                });
            });
            
            console.log('✅ Interaction optimizations applied');
        },
        
        implementStaggeredAnimations() {
            console.log('🎭 Implementing staggered animations...');
            
            // Override card loading to use staggered entrance
            const originalLoadPageCards = window.loadPageCards;
            if (originalLoadPageCards) {
                window.loadPageCards = (pageName, submenu) => {
                    // Call original function
                    originalLoadPageCards.call(this, pageName, submenu);
                    
                    // Apply staggered animations to new cards
                    setTimeout(() => {
                        const newCards = document.querySelectorAll(`#${pageName}-page .card`);
                        newCards.forEach((card, index) => {
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px) scale(0.95)';
                            
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                                card.style.transition = `all ${this.timing.flow}ms ${this.easings.human}`;
                            }, index * 50); // ZENITH stagger timing
                        });
                    }, 50);
                };
            }
            
            console.log('✅ Staggered animations implemented');
        },
        
        setupAdaptivePerformance() {
            console.log('🚀 Setting up adaptive performance system...');
            
            // Monitor performance and adapt quality
            setInterval(() => {
                if (this.performance.averageFPS < 45) {
                    this.enableLowPerformanceMode();
                } else if (this.performance.averageFPS > 58) {
                    this.enableHighPerformanceMode();
                }
            }, 2000);
            
            console.log('✅ Adaptive performance system active');
        },
        
        enableLowPerformanceMode() {
            console.log('⚡ ZENITH: Enabling low performance mode...');
            
            document.body.classList.add('zenith-low-performance');
            
            // Reduce animation complexity
            const style = document.createElement('style');
            style.textContent = `
                .zenith-low-performance .card {
                    transition: transform 0.1s ease !important;
                }
                
                .zenith-low-performance .card:hover {
                    transform: translateY(-2px) !important;
                }
                
                .zenith-low-performance .chart-container {
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        enableHighPerformanceMode() {
            console.log('✨ ZENITH: Enabling high performance mode...');
            
            document.body.classList.remove('zenith-low-performance');
            document.body.classList.add('zenith-high-performance');
            
            // Enable enhanced effects
            const style = document.createElement('style');
            style.textContent = `
                .zenith-high-performance .card:hover {
                    filter: brightness(1.05) !important;
                }
                
                .zenith-high-performance .card-header:hover {
                    box-shadow: inset 0 0 10px rgba(0, 148, 204, 0.2) !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        enablePerformanceMode() {
            console.log('🔧 ZENITH: Enabling performance optimization mode...');
            
            // Disable non-essential animations
            document.body.classList.add('zenith-performance-mode');
            
            const performanceCSS = `
                .zenith-performance-mode * {
                    transition-duration: 0.1s !important;
                }
                
                .zenith-performance-mode .card {
                    will-change: auto !important;
                }
                
                .zenith-performance-mode .chart-container {
                    transition: none !important;
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = performanceCSS;
            document.head.appendChild(style);
        },
        
        // ZENITH feedback system
        showSuccessFeedback(element) {
            element.classList.add('zenith-success');
            setTimeout(() => {
                element.classList.remove('zenith-success');
            }, 600);
        },
        
        showErrorFeedback(element) {
            element.classList.add('zenith-error');
            setTimeout(() => {
                element.classList.remove('zenith-error');
            }, 400);
        },
        
        showLoadingFeedback(element) {
            element.classList.add('zenith-loading');
        },
        
        hideLoadingFeedback(element) {
            element.classList.remove('zenith-loading');
        }
    };

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => ZenithMotion.init(), 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ZenithMotion.init(), 1000);
        });
    }

    // Make available for Chrome MCP testing
    window.ZenithMotion = ZenithMotion;

    // Global functions for enhanced interactions
    window.updatePerformancePeriod = function(period) {
        console.log(`📊 ZENITH: Performance period changed to ${period}`);
        if (window.PerformanceCharts) {
            window.PerformanceCharts.updateChartsForPeriod(period);
        }
    };
    
    window.selectPlayer = function(playerId) {
        console.log(`👤 ZENITH: Player selected: ${playerId}`);
        if (window.PerformanceCharts) {
            window.PerformanceCharts.updatePlayerCharts(playerId);
        }
    };
    
    window.changeFormation = function(formation) {
        console.log(`⚽ ZENITH: Formation changed to ${formation}`);
        // Would update formation visualization
    };

})();