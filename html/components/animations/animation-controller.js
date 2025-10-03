/* ==========================================
   ANIMATION CONTROLLER - Enhanced UI/UX Animation System
   Orchestrated animation sequences with performance monitoring
   Compatible with FM-Base 37x19 grid system
   ========================================== */

/**
 * AnimationController - Master animation orchestration system
 * 
 * Features:
 * - Psychologically-optimized easing curves
 * - Stagger patterns for multiple elements
 * - Page transition management
 * - Performance monitoring and adaptive quality
 * - Integration with existing drag-drop system
 * 
 * Usage:
 *   const animator = new AnimationController();
 *   animator.animateCardEntry(cardElement, 'swift');
 *   animator.staggerCards(cardArray, 'cascade', 50);
 */
class AnimationController {
    constructor() {
        this.isAnimating = false;
        this.performanceMode = 'high'; // 'high', 'medium', 'low'
        this.activeAnimations = new Set();
        this.frameRate = 60;
        this.lastFrameTime = 0;
        
        // Initialize performance monitoring
        this.initPerformanceMonitor();
        
        // Bind methods
        this.animateCardEntry = this.animateCardEntry.bind(this);
        this.animateCardExit = this.animateCardExit.bind(this);
        this.staggerCards = this.staggerCards.bind(this);
        this.transitionPages = this.transitionPages.bind(this);
    }

    /**
     * Psychologically-optimized easing functions
     * Based on Football Manager UI analysis and human perception research
     */
    get easings() {
        return {
            // Mechanical feelings - sharp, precise
            swift: 'cubic-bezier(0.4, 0.0, 0.2, 1)',      // Material Design swift
            snappy: 'cubic-bezier(0.4, 0.0, 0.6, 1)',     // Slightly faster out
            
            // Organic feelings - natural movement
            human: 'cubic-bezier(0.4, 0.0, 0.1, 1)',       // Natural acceleration
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful overshoot
            
            // Game-specific emotions
            damage: 'cubic-bezier(0.8, 0.0, 0.7, 0.2)',   // Sharp hit, slow recover
            power: 'cubic-bezier(0.2, 0.8, 0.3, 1.2)',    // Building energy
            death: 'cubic-bezier(0.4, 0.0, 1, 0.4)',      // Sudden stop
            
            // FM-specific
            card_slide: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth card movement
            menu_open: 'cubic-bezier(0.215, 0.61, 0.355, 1)',   // Menu expansion
            stat_reveal: 'cubic-bezier(0.39, 0.575, 0.565, 1)'  // Data appearance
        };
    }

    /**
     * Stagger patterns for multiple element animations
     */
    get staggerPatterns() {
        return {
            cascade: (i) => i * 50,                          // Linear delay
            exponential: (i) => Math.pow(1.2, i) * 30,      // Accelerating
            random: (i) => Math.random() * 100,             // Chaotic
            wave: (i) => Math.sin(i * 0.5) * 40 + 50,       // Rhythmic
            grid: (i, columns) => {                          // Grid-based 
                const row = Math.floor(i / columns);
                const col = i % columns;
                return (row + col) * 25;
            },
            spiral: (i, total) => {                          // Spiral pattern
                const angle = (i / total) * Math.PI * 2;
                return Math.abs(Math.sin(angle)) * 100;
            }
        };
    }

    /**
     * Initialize performance monitoring system
     */
    initPerformanceMonitor() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            const now = performance.now();
            frameCount++;
            
            if (now - lastTime >= 1000) { // Check every second
                const fps = frameCount;
                frameCount = 0;
                lastTime = now;
                
                // Adapt performance mode based on FPS
                if (fps < 30) {
                    this.performanceMode = 'low';
                } else if (fps < 50) {
                    this.performanceMode = 'medium';
                } else {
                    this.performanceMode = 'high';
                }
                
                this.adaptAnimationQuality();
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        requestAnimationFrame(checkPerformance);
    }

    /**
     * Adapt animation quality based on performance
     */
    adaptAnimationQuality() {
        const quality = {
            low: {
                reducedMotion: true,
                particleCount: 0.2,
                transitionDuration: 0.5
            },
            medium: {
                reducedMotion: false,
                particleCount: 0.6,
                transitionDuration: 0.8
            },
            high: {
                reducedMotion: false,
                particleCount: 1.0,
                transitionDuration: 1.0
            }
        };
        
        const settings = quality[this.performanceMode];
        document.documentElement.style.setProperty('--animation-quality', this.performanceMode);
        document.documentElement.style.setProperty('--transition-duration-multiplier', settings.transitionDuration);
        
        if (settings.reducedMotion) {
            document.documentElement.style.setProperty('--reduce-motion', '1');
        } else {
            document.documentElement.style.setProperty('--reduce-motion', '0');
        }
    }

    /**
     * Animate card entry with enhanced effects
     * @param {HTMLElement} card - Card element to animate
     * @param {string} easing - Easing function name
     * @param {number} delay - Animation delay in ms
     */
    animateCardEntry(card, easing = 'swift', delay = 0) {
        if (!card) return Promise.resolve();
        
        return new Promise((resolve) => {
            // Prepare card for animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            card.style.filter = 'blur(2px)';
            
            const animationId = `card-entry-${Date.now()}-${Math.random()}`;
            this.activeAnimations.add(animationId);
            
            setTimeout(() => {
                card.style.transition = `all 400ms ${this.easings[easing]}, 
                                       filter 300ms ${this.easings[easing]}`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.filter = 'blur(0)';
                
                // Add subtle glow effect for high performance mode
                if (this.performanceMode === 'high') {
                    card.style.boxShadow = `0 0 20px rgba(0, 119, 163, 0.3), 
                                          inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
                    
                    setTimeout(() => {
                        card.style.boxShadow = '';
                    }, 600);
                }
                
                setTimeout(() => {
                    card.style.transition = '';
                    this.activeAnimations.delete(animationId);
                    resolve();
                }, 400);
            }, delay);
        });
    }

    /**
     * Animate card exit with sophisticated effects
     * @param {HTMLElement} card - Card element to animate
     * @param {string} direction - Exit direction ('up', 'down', 'left', 'right', 'scale')
     */
    animateCardExit(card, direction = 'scale') {
        if (!card) return Promise.resolve();
        
        return new Promise((resolve) => {
            const animationId = `card-exit-${Date.now()}-${Math.random()}`;
            this.activeAnimations.add(animationId);
            
            const transforms = {
                up: 'translateY(-100px) scale(0.8)',
                down: 'translateY(100px) scale(0.8)',
                left: 'translateX(-100px) scale(0.8)',
                right: 'translateX(100px) scale(0.8)',
                scale: 'scale(0.8)',
                collapse: 'scaleY(0) translateY(-50%)'
            };
            
            card.style.transition = `all 300ms ${this.easings.swift}, 
                                   filter 200ms ${this.easings.swift}`;
            card.style.opacity = '0';
            card.style.transform = transforms[direction] || transforms.scale;
            card.style.filter = 'blur(1px)';
            
            setTimeout(() => {
                this.activeAnimations.delete(animationId);
                resolve();
            }, 300);
        });
    }

    /**
     * Stagger animation for multiple cards
     * @param {Array} cards - Array of card elements
     * @param {string} pattern - Stagger pattern name
     * @param {number} baseDelay - Base delay between elements
     */
    staggerCards(cards, pattern = 'cascade', baseDelay = 50) {
        if (!cards || !cards.length) return Promise.resolve();
        
        const staggerFn = this.staggerPatterns[pattern];
        if (!staggerFn) {
            console.warn(`Unknown stagger pattern: ${pattern}`);
            return Promise.resolve();
        }
        
        const promises = cards.map((card, index) => {
            const delay = staggerFn(index, Math.ceil(Math.sqrt(cards.length)));
            return this.animateCardEntry(card, 'swift', delay);
        });
        
        return Promise.all(promises);
    }

    /**
     * Orchestrated page transitions
     * @param {HTMLElement} fromPage - Current page element
     * @param {HTMLElement} toPage - Target page element
     * @param {string} direction - Transition direction
     */
    transitionPages(fromPage, toPage, direction = 'horizontal') {
        if (!fromPage || !toPage) return Promise.resolve();
        
        return new Promise((resolve) => {
            this.isAnimating = true;
            
            // Prepare transition container
            const container = fromPage.parentElement;
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            
            // Setup pages for transition
            fromPage.style.position = 'absolute';
            fromPage.style.width = '100%';
            fromPage.style.height = '100%';
            fromPage.style.top = '0';
            fromPage.style.left = '0';
            
            toPage.style.position = 'absolute';
            toPage.style.width = '100%';
            toPage.style.height = '100%';
            toPage.style.top = '0';
            
            // Set initial positions based on direction
            if (direction === 'horizontal') {
                toPage.style.left = '100%';
            } else if (direction === 'vertical') {
                toPage.style.left = '0';
                toPage.style.top = '100%';
            } else if (direction === 'fade') {
                toPage.style.left = '0';
                toPage.style.opacity = '0';
                fromPage.style.opacity = '1';
            }
            
            toPage.classList.add('active');
            
            // Animate transition
            setTimeout(() => {
                const duration = this.performanceMode === 'low' ? 200 : 400;
                const easing = this.easings.menu_open;
                
                fromPage.style.transition = `all ${duration}ms ${easing}`;
                toPage.style.transition = `all ${duration}ms ${easing}`;
                
                if (direction === 'horizontal') {
                    fromPage.style.transform = 'translateX(-100%)';
                    toPage.style.left = '0';
                } else if (direction === 'vertical') {
                    fromPage.style.transform = 'translateY(-100%)';
                    toPage.style.top = '0';
                } else if (direction === 'fade') {
                    fromPage.style.opacity = '0';
                    toPage.style.opacity = '1';
                }
                
                setTimeout(() => {
                    // Clean up
                    fromPage.classList.remove('active');
                    fromPage.style.position = '';
                    fromPage.style.transform = '';
                    fromPage.style.transition = '';
                    
                    toPage.style.position = '';
                    toPage.style.left = '';
                    toPage.style.top = '';
                    toPage.style.opacity = '';
                    toPage.style.transition = '';
                    
                    this.isAnimating = false;
                    resolve();
                }, duration);
            }, 16); // One frame delay
        });
    }

    /**
     * Animate drag feedback during card movement
     * @param {HTMLElement} card - Card being dragged
     * @param {boolean} isDragging - Current drag state
     */
    animateDragFeedback(card, isDragging) {
        if (!card) return;
        
        if (isDragging) {
            card.style.transition = 'box-shadow 150ms ease, transform 150ms ease';
            card.style.transform = 'scale(1.02) rotate(0.5deg)';
            card.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.3), 
                                  0 0 0 2px rgba(0, 119, 163, 0.5)`;
            card.style.zIndex = '1000';
        } else {
            card.style.transition = 'all 200ms ease';
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.zIndex = '';
        }
    }

    /**
     * Animate resize feedback during card resizing
     * @param {HTMLElement} card - Card being resized
     * @param {boolean} isResizing - Current resize state
     */
    animateResizeFeedback(card, isResizing) {
        if (!card) return;
        
        if (isResizing) {
            card.style.outline = '2px solid rgba(0, 119, 163, 0.7)';
            card.style.outlineOffset = '2px';
        } else {
            card.style.outline = '';
            card.style.outlineOffset = '';
        }
    }

    /**
     * Animate grid snap feedback
     * @param {HTMLElement} gridOverlay - Grid overlay element
     * @param {Object} snapPosition - {x, y, width, height} in grid coordinates
     */
    animateGridSnap(gridOverlay, snapPosition) {
        if (!gridOverlay || !snapPosition) return;
        
        const { x, y, width, height } = snapPosition;
        const cellSize = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--grid-cell-size'));
        const gap = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--grid-gap'));
        
        // Create snap indicator
        const indicator = gridOverlay.querySelector('.snap-indicator') || 
                         document.createElement('div');
        indicator.className = 'snap-indicator';
        
        indicator.style.position = 'absolute';
        indicator.style.left = `${x * (cellSize + gap)}px`;
        indicator.style.top = `${y * (cellSize + gap)}px`;
        indicator.style.width = `${width * cellSize + (width - 1) * gap}px`;
        indicator.style.height = `${height * cellSize + (height - 1) * gap}px`;
        indicator.style.border = '2px solid rgba(0, 119, 163, 0.8)';
        indicator.style.borderRadius = 'var(--border-radius)';
        indicator.style.backgroundColor = 'rgba(0, 119, 163, 0.1)';
        indicator.style.transition = 'all 150ms ease';
        indicator.style.pointerEvents = 'none';
        
        if (!gridOverlay.contains(indicator)) {
            gridOverlay.appendChild(indicator);
        }
        
        // Pulse effect
        indicator.style.transform = 'scale(1.05)';
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Clear all active animations (emergency stop)
     */
    clearAllAnimations() {
        this.activeAnimations.forEach(id => {
            // In a real implementation, we'd track animation references
            // and cancel them here
        });
        this.activeAnimations.clear();
        this.isAnimating = false;
    }

    /**
     * Get current animation status
     */
    getStatus() {
        return {
            isAnimating: this.isAnimating,
            performanceMode: this.performanceMode,
            activeAnimations: this.activeAnimations.size,
            frameRate: this.frameRate
        };
    }
}

// Export to global scope for FM-Base integration
if (typeof window !== 'undefined') {
    window.AnimationController = AnimationController;
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.fmAnimator = new AnimationController();
        });
    } else {
        window.fmAnimator = new AnimationController();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}