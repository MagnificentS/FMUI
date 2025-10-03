/* ==========================================
   RESPONSIVE SYSTEM - Adaptive UI Management
   Breakpoint management and performance adaptation
   Compatible with FM-Base 37x19 grid system
   ========================================== */

/**
 * ResponsiveSystem - Advanced responsive design and performance adaptation
 * 
 * Features:
 * - Breakpoint management for different screen sizes
 * - Dynamic font scaling based on viewport
 * - Touch gesture support detection
 * - Density-independent pixel calculations
 * - Performance adaptation (reduce animations on low-end)
 * - Battery level awareness
 * - Network condition adaptation
 * 
 * Usage:
 *   const responsive = new ResponsiveSystem();
 *   responsive.adaptToViewport();
 *   responsive.enableTouchOptimizations();
 */
class ResponsiveSystem {
    constructor() {
        this.viewport = this.getViewportInfo();
        this.device = this.detectDevice();
        this.capabilities = this.detectCapabilities();
        this.performanceProfile = this.createPerformanceProfile();
        
        // Breakpoint definitions based on common FM viewing scenarios
        this.breakpoints = this.initializeBreakpoints();
        
        // Current responsive state
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.scaleFactor = 1;
        this.densityFactor = this.calculateDensityFactor();
        
        // Performance monitoring
        this.performanceMetrics = {
            fps: 60,
            memoryUsage: 0,
            batteryLevel: 1,
            networkType: 'unknown'
        };
        
        // Event listeners
        this.initializeEventListeners();
        
        // Initial adaptation
        this.adaptToCurrentConditions();
        
        // Bind methods
        this.adaptToViewport = this.adaptToViewport.bind(this);
        this.optimizeForDevice = this.optimizeForDevice.bind(this);
        this.updatePerformanceProfile = this.updatePerformanceProfile.bind(this);
    }

    /**
     * Initialize breakpoint definitions
     * Based on Football Manager typical usage scenarios
     */
    initializeBreakpoints() {
        return {
            // Mobile devices (phones)
            mobile: {
                min: 0,
                max: 768,
                gridColumns: 25,
                gridRows: 15,
                cellSize: 28,
                gap: 6,
                fontScale: 0.9,
                description: 'Mobile phones in portrait/landscape'
            },
            
            // Tablets
            tablet: {
                min: 769,
                max: 1024,
                gridColumns: 30,
                gridRows: 17,
                cellSize: 30,
                gap: 7,
                fontScale: 0.95,
                description: 'Tablets and small laptops'
            },
            
            // Small desktops (laptops)
            desktop_small: {
                min: 1025,
                max: 1366,
                gridColumns: 35,
                gridRows: 18,
                cellSize: 31,
                gap: 7,
                fontScale: 1.0,
                description: 'Small desktop screens and laptops'
            },
            
            // Standard desktops (most common FM setup)
            desktop: {
                min: 1367,
                max: 1920,
                gridColumns: 37,
                gridRows: 19,
                cellSize: 32,
                gap: 8,
                fontScale: 1.0,
                description: 'Standard desktop screens'
            },
            
            // Large desktops (enthusiast setups)
            desktop_large: {
                min: 1921,
                max: 2560,
                gridColumns: 45,
                gridRows: 23,
                cellSize: 34,
                gap: 9,
                fontScale: 1.1,
                description: 'Large desktop screens'
            },
            
            // Ultra-wide and 4K displays
            ultra_wide: {
                min: 2561,
                max: Infinity,
                gridColumns: 55,
                gridRows: 27,
                cellSize: 36,
                gap: 10,
                fontScale: 1.2,
                description: 'Ultra-wide and 4K displays'
            }
        };
    }

    /**
     * Get comprehensive viewport information
     */
    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
            availableWidth: window.screen.availWidth,
            availableHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            refreshRate: this.estimateRefreshRate()
        };
    }

    /**
     * Detect device type and capabilities
     */
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        
        return {
            type: this.getDeviceType(),
            os: this.getOperatingSystem(),
            browser: this.getBrowser(),
            isMobile: /mobile|android|iphone|ipad|phone/i.test(userAgent),
            isTablet: maxTouchPoints > 1 && !this.isMobile,
            isDesktop: maxTouchPoints === 0 || /win|mac|linux/i.test(platform),
            isTouch: maxTouchPoints > 0,
            maxTouchPoints,
            hasKeyboard: !this.isMobile && maxTouchPoints === 0,
            hasMouse: !this.isMobile
        };
    }

    /**
     * Detect system capabilities
     */
    detectCapabilities() {
        return {
            hardwareConcurrency: navigator.hardwareConcurrency || 2,
            memory: navigator.deviceMemory || 4, // GB estimate
            connection: this.getConnectionInfo(),
            battery: this.getBatteryInfo(),
            webgl: this.detectWebGL(),
            webgl2: this.detectWebGL2(),
            css3d: this.detectCSS3D(),
            flexbox: this.detectFlexbox(),
            grid: this.detectCSSGrid(),
            animations: this.detectAnimationSupport(),
            reducedMotion: this.detectReducedMotion()
        };
    }

    /**
     * Create performance profile based on device capabilities
     */
    createPerformanceProfile() {
        const score = this.calculatePerformanceScore();
        
        if (score >= 80) {
            return {
                tier: 'high',
                animations: 'full',
                particleCount: 1.0,
                transitionDuration: 1.0,
                complexEffects: true,
                description: 'High-end device with full effects'
            };
        } else if (score >= 60) {
            return {
                tier: 'medium',
                animations: 'reduced',
                particleCount: 0.7,
                transitionDuration: 0.8,
                complexEffects: false,
                description: 'Mid-range device with reduced effects'
            };
        } else {
            return {
                tier: 'low',
                animations: 'minimal',
                particleCount: 0.3,
                transitionDuration: 0.5,
                complexEffects: false,
                description: 'Low-end device with minimal effects'
            };
        }
    }

    /**
     * Calculate device performance score (0-100)
     */
    calculatePerformanceScore() {
        let score = 50; // Base score
        
        // CPU cores
        score += Math.min(20, this.capabilities.hardwareConcurrency * 3);
        
        // Memory
        score += Math.min(20, this.capabilities.memory * 3);
        
        // Graphics capabilities
        if (this.capabilities.webgl2) score += 15;
        else if (this.capabilities.webgl) score += 10;
        
        // Display
        if (this.viewport.pixelRatio > 2) score -= 5; // High DPI = more work
        if (this.viewport.refreshRate > 60) score += 5;
        
        // Device type adjustments
        if (this.device.isMobile) score -= 10;
        if (this.device.isTablet) score -= 5;
        
        // Connection quality
        const connection = this.capabilities.connection;
        if (connection.effectiveType === '4g') score += 5;
        else if (connection.effectiveType === '3g') score -= 5;
        else if (connection.effectiveType === '2g') score -= 15;
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get current breakpoint based on viewport
     */
    getCurrentBreakpoint() {
        const width = this.viewport.width;
        
        for (const [name, breakpoint] of Object.entries(this.breakpoints)) {
            if (width >= breakpoint.min && width <= breakpoint.max) {
                return { name, ...breakpoint };
            }
        }
        
        return { name: 'desktop', ...this.breakpoints.desktop }; // Fallback
    }

    /**
     * Calculate density-independent pixels factor
     */
    calculateDensityFactor() {
        const baseDpi = 96; // Standard desktop DPI
        const currentDpi = this.viewport.pixelRatio * baseDpi;
        return currentDpi / baseDpi;
    }

    /**
     * Initialize responsive event listeners
     */
    initializeEventListeners() {
        // Viewport changes
        window.addEventListener('resize', this.debounce(() => {
            this.handleViewportChange();
        }, 250));
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleViewportChange(), 100);
        });
        
        // Performance monitoring
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.monitorBattery(battery);
            });
        }
        
        // Network monitoring
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.handleNetworkChange();
            });
        }
        
        // Reduced motion preferences
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            mediaQuery.addEventListener('change', () => {
                this.handleReducedMotionChange(mediaQuery.matches);
            });
        }
        
        // Visibility changes (for performance optimization)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * Handle viewport dimension changes
     */
    handleViewportChange() {
        const oldViewport = this.viewport;
        const oldBreakpoint = this.currentBreakpoint;
        
        this.viewport = this.getViewportInfo();
        this.currentBreakpoint = this.getCurrentBreakpoint();
        
        // Check if breakpoint changed
        if (oldBreakpoint.name !== this.currentBreakpoint.name) {
            this.handleBreakpointChange(oldBreakpoint, this.currentBreakpoint);
        }
        
        // Update scale factor
        this.updateScaleFactor();
        
        // Trigger responsive adaptations
        this.adaptToCurrentConditions();
        
        // Dispatch custom event
        this.dispatchResponsiveEvent('viewportchange', {
            oldViewport,
            newViewport: this.viewport,
            oldBreakpoint: oldBreakpoint.name,
            newBreakpoint: this.currentBreakpoint.name
        });
    }

    /**
     * Handle breakpoint transitions
     */
    handleBreakpointChange(oldBreakpoint, newBreakpoint) {
        console.log(`Breakpoint changed: ${oldBreakpoint.name} → ${newBreakpoint.name}`);
        
        // Update CSS variables for new breakpoint
        this.updateCSSVariables(newBreakpoint);
        
        // Adapt existing content
        this.adaptExistingContent(oldBreakpoint, newBreakpoint);
        
        // Update performance profile if needed
        this.updatePerformanceProfile();
    }

    /**
     * Update CSS custom properties for current breakpoint
     */
    updateCSSVariables(breakpoint) {
        const root = document.documentElement;
        
        root.style.setProperty('--grid-columns', breakpoint.gridColumns);
        root.style.setProperty('--grid-rows', breakpoint.gridRows);
        root.style.setProperty('--grid-cell-size', `${breakpoint.cellSize}px`);
        root.style.setProperty('--grid-gap', `${breakpoint.gap}px`);
        
        // Calculate new container dimensions
        const containerWidth = (breakpoint.gridColumns * breakpoint.cellSize) + 
                              ((breakpoint.gridColumns - 1) * breakpoint.gap) + 
                              (2 * parseInt(getComputedStyle(root).getPropertyValue('--grid-padding-h')));
        
        const containerHeight = (breakpoint.gridRows * breakpoint.cellSize) + 
                               ((breakpoint.gridRows - 1) * breakpoint.gap) + 
                               (2 * parseInt(getComputedStyle(root).getPropertyValue('--grid-padding-v')));
        
        root.style.setProperty('--container-width', `${containerWidth}px`);
        root.style.setProperty('--container-height', `${containerHeight}px`);
        
        // Font scaling
        root.style.setProperty('--responsive-font-scale', breakpoint.fontScale);
        
        // Performance adaptations
        root.style.setProperty('--performance-tier', this.performanceProfile.tier);
        root.style.setProperty('--animation-duration-scale', this.performanceProfile.transitionDuration);
    }

    /**
     * Update dynamic scale factor
     */
    updateScaleFactor() {
        // Base scale on viewport size relative to design breakpoint
        const designWidth = 1920; // Design reference width
        const currentWidth = this.viewport.width;
        
        let scale = Math.min(1.2, Math.max(0.8, currentWidth / designWidth));
        
        // Adjust for device pixel ratio
        scale *= Math.min(1.1, this.viewport.pixelRatio * 0.5 + 0.5);
        
        // Round to reasonable precision
        this.scaleFactor = Math.round(scale * 100) / 100;
        
        document.documentElement.style.setProperty('--responsive-scale', this.scaleFactor);
    }

    /**
     * Adapt existing content to new breakpoint
     */
    adaptExistingContent(oldBreakpoint, newBreakpoint) {
        // Scale existing cards proportionally
        const cards = document.querySelectorAll('.card');
        const scaleX = newBreakpoint.gridColumns / oldBreakpoint.gridColumns;
        const scaleY = newBreakpoint.gridRows / oldBreakpoint.gridRows;
        
        cards.forEach(card => {
            if (card.dataset.gridX && card.dataset.gridY) {
                const newX = Math.round(parseInt(card.dataset.gridX) * scaleX);
                const newY = Math.round(parseInt(card.dataset.gridY) * scaleY);
                const newWidth = Math.round(parseInt(card.dataset.gridWidth || '14') * scaleX);
                const newHeight = Math.round(parseInt(card.dataset.gridHeight || '8') * scaleY);
                
                // Update positions
                this.updateCardPosition(card, newX, newY, newWidth, newHeight);
            }
        });
        
        // Update touch targets for mobile
        if (newBreakpoint.name === 'mobile' && oldBreakpoint.name !== 'mobile') {
            this.optimizeForTouch();
        }
    }

    /**
     * Update card position and size
     */
    updateCardPosition(card, x, y, width, height) {
        // Ensure within bounds
        x = Math.max(0, Math.min(this.currentBreakpoint.gridColumns - width, x));
        y = Math.max(0, Math.min(this.currentBreakpoint.gridRows - height, y));
        
        // Update CSS
        card.style.gridColumnStart = x + 1;
        card.style.gridColumnEnd = x + width + 1;
        card.style.gridRowStart = y + 1;
        card.style.gridRowEnd = y + height + 1;
        
        // Update data attributes
        card.dataset.gridX = x;
        card.dataset.gridY = y;
        card.dataset.gridWidth = width;
        card.dataset.gridHeight = height;
    }

    /**
     * Optimize interface for touch devices
     */
    optimizeForTouch() {
        const touchOptimizations = {
            minTouchTarget: 44, // 44px minimum touch target
            tapHighlight: 'none',
            userSelect: 'none',
            touchAction: 'manipulation'
        };
        
        // Apply touch optimizations
        document.documentElement.style.setProperty('--min-touch-target', `${touchOptimizations.minTouchTarget}px`);
        
        // Add touch-specific CSS class
        document.body.classList.add('touch-device');
        
        // Enable touch gesture detection
        this.enableTouchGestures();
    }

    /**
     * Enable touch gesture support
     */
    enableTouchGestures() {
        if (!this.device.isTouch) return;
        
        let touchStartData = null;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartData = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                    time: Date.now(),
                    target: e.target
                };
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (touchStartData && e.changedTouches.length === 1) {
                const touchEnd = e.changedTouches[0];
                const deltaX = touchEnd.clientX - touchStartData.x;
                const deltaY = touchEnd.clientY - touchStartData.y;
                const deltaTime = Date.now() - touchStartData.time;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const velocity = distance / deltaTime;
                
                // Detect gestures
                if (deltaTime < 300 && distance < 10) {
                    // Tap
                    this.handleTouchTap(touchStartData.target, touchStartData);
                } else if (velocity > 0.5 && distance > 50) {
                    // Swipe
                    const direction = Math.abs(deltaX) > Math.abs(deltaY) ?
                        (deltaX > 0 ? 'right' : 'left') :
                        (deltaY > 0 ? 'down' : 'up');
                    
                    this.handleTouchSwipe(direction, { deltaX, deltaY, velocity });
                }
                
                touchStartData = null;
            }
        }, { passive: true });
    }

    /**
     * Handle touch tap gestures
     */
    handleTouchTap(target, data) {
        // Enhanced tap feedback for touch devices
        if (target.classList.contains('card-header')) {
            // Add touch feedback animation
            target.style.transform = 'scale(0.98)';
            setTimeout(() => {
                target.style.transform = '';
            }, 150);
        }
    }

    /**
     * Handle touch swipe gestures
     */
    handleTouchSwipe(direction, data) {
        // Implement swipe navigation between screens
        this.dispatchResponsiveEvent('swipe', { direction, data });
    }

    /**
     * Monitor battery level for performance adaptation
     */
    monitorBattery(battery) {
        const updateBatteryStatus = () => {
            this.performanceMetrics.batteryLevel = battery.level;
            
            // Reduce performance on low battery
            if (battery.level < 0.2 && !battery.charging) {
                this.adaptForLowBattery();
            } else if (battery.level > 0.5 || battery.charging) {
                this.restoreNormalPerformance();
            }
        };
        
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        updateBatteryStatus();
    }

    /**
     * Handle network condition changes
     */
    handleNetworkChange() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.performanceMetrics.networkType = connection.effectiveType;
            
            // Adapt to slow connections
            if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
                this.adaptForSlowNetwork();
            } else {
                this.restoreNormalNetworking();
            }
        }
    }

    /**
     * Handle reduced motion preference changes
     */
    handleReducedMotionChange(isReduced) {
        const root = document.documentElement;
        
        if (isReduced) {
            root.style.setProperty('--reduce-motion', '1');
            root.classList.add('reduce-motion');
        } else {
            root.style.setProperty('--reduce-motion', '0');
            root.classList.remove('reduce-motion');
        }
        
        this.capabilities.reducedMotion = isReduced;
        this.updatePerformanceProfile();
    }

    /**
     * Handle visibility changes for performance
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause expensive operations when tab is hidden
            this.pauseNonEssentialOperations();
        } else {
            // Resume operations when tab becomes visible
            this.resumeOperations();
        }
    }

    /**
     * Adapt for low battery conditions
     */
    adaptForLowBattery() {
        const root = document.documentElement;
        root.style.setProperty('--low-battery-mode', '1');
        root.style.setProperty('--animation-duration-scale', '0.3');
        root.classList.add('low-battery');
        
        console.log('Adapted for low battery');
    }

    /**
     * Restore normal performance
     */
    restoreNormalPerformance() {
        const root = document.documentElement;
        root.style.setProperty('--low-battery-mode', '0');
        root.style.setProperty('--animation-duration-scale', this.performanceProfile.transitionDuration);
        root.classList.remove('low-battery');
    }

    /**
     * Adapt for slow network conditions
     */
    adaptForSlowNetwork() {
        // Reduce network-dependent features
        document.documentElement.classList.add('slow-network');
        console.log('Adapted for slow network');
    }

    /**
     * Restore normal networking features
     */
    restoreNormalNetworking() {
        document.documentElement.classList.remove('slow-network');
    }

    /**
     * Pause non-essential operations
     */
    pauseNonEssentialOperations() {
        // Pause animations
        document.documentElement.style.setProperty('--pause-animations', '1');
        
        // Cancel any pending RAF callbacks
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Resume operations
     */
    resumeOperations() {
        document.documentElement.style.setProperty('--pause-animations', '0');
    }

    /**
     * Get optimal font size for current conditions
     */
    getOptimalFontSize(baseSize) {
        const scaleFactor = this.currentBreakpoint.fontScale * this.scaleFactor;
        const densityAdjustment = Math.min(1.1, this.densityFactor * 0.2 + 0.8);
        
        return Math.round(baseSize * scaleFactor * densityAdjustment);
    }

    /**
     * Get optimal spacing for current conditions
     */
    getOptimalSpacing(baseSpacing) {
        const scale = this.scaleFactor;
        const touch = this.device.isTouch ? 1.2 : 1.0;
        
        return Math.round(baseSpacing * scale * touch);
    }

    /**
     * Check if feature should be enabled based on capabilities
     */
    shouldEnableFeature(feature) {
        const features = {
            animations: this.performanceProfile.tier !== 'low' && !this.capabilities.reducedMotion,
            complexEffects: this.performanceProfile.tier === 'high',
            particleEffects: this.performanceProfile.tier !== 'low' && this.performanceMetrics.batteryLevel > 0.3,
            heavyProcessing: this.capabilities.hardwareConcurrency > 2 && this.performanceProfile.tier === 'high',
            autoplay: !this.device.isMobile && this.performanceMetrics.networkType !== '2g'
        };
        
        return features[feature] || false;
    }

    /**
     * Adapt to all current conditions
     */
    adaptToCurrentConditions() {
        this.updateCSSVariables(this.currentBreakpoint);
        this.updateScaleFactor();
        
        if (this.device.isTouch) {
            this.optimizeForTouch();
        }
        
        // Apply performance adaptations
        this.applyPerformanceAdaptations();
    }

    /**
     * Apply performance-based adaptations
     */
    applyPerformanceAdaptations() {
        const root = document.documentElement;
        
        // Set performance tier
        root.setAttribute('data-performance-tier', this.performanceProfile.tier);
        
        // Animation settings
        if (!this.shouldEnableFeature('animations')) {
            root.classList.add('reduce-animations');
        }
        
        // Complex effects
        if (!this.shouldEnableFeature('complexEffects')) {
            root.classList.add('reduce-effects');
        }
        
        // Memory management
        if (this.capabilities.memory < 4) {
            root.classList.add('low-memory');
        }
    }

    /**
     * Dispatch custom responsive events
     */
    dispatchResponsiveEvent(type, detail) {
        const event = new CustomEvent(`responsive:${type}`, {
            detail: { ...detail, system: this.getStatus() },
            bubbles: true
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Get current system status
     */
    getStatus() {
        return {
            breakpoint: this.currentBreakpoint.name,
            viewport: this.viewport,
            device: this.device,
            performanceProfile: this.performanceProfile,
            capabilities: this.capabilities,
            metrics: this.performanceMetrics,
            scaleFactor: this.scaleFactor,
            densityFactor: this.densityFactor
        };
    }

    /**
     * Adapt layout and components to current viewport
     */
    adaptToViewport() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update current breakpoint
        const oldBreakpoint = this.currentBreakpoint;
        this.updateBreakpoint();
        
        // Update grid dimensions
        this.updateGridDimensions();
        
        // Apply viewport-specific optimizations
        if (oldBreakpoint !== this.currentBreakpoint) {
            this.applyBreakpointChanges();
        }
        
        // Update density factor
        this.updateDensityFactor();
        
        console.log(`Adapted to viewport: ${width}x${height} (${this.currentBreakpoint})`);
    }
    
    /**
     * Optimize interface for specific device capabilities
     */
    optimizeForDevice() {
        const device = this.getDeviceInfo();
        
        // Apply device-specific optimizations
        if (device.hasTouch) {
            this.enableTouchOptimizations();
        }
        
        // Adjust performance based on device capabilities
        if (device.deviceType === 'mobile') {
            this.performanceTier = 'low';
        } else if (device.performanceScore < 5) {
            this.performanceTier = 'medium';
        } else {
            this.performanceTier = 'high';
        }
        
        // Apply performance adaptations
        this.applyPerformanceAdaptations();
        
        console.log(`Optimized for device: ${device.deviceType} (${this.performanceTier} performance)`);
    }
    
    /**
     * Update performance profile based on current conditions
     */
    updatePerformanceProfile() {
        this.performanceProfile = this.createPerformanceProfile();
        this.applyPerformanceAdaptations();
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Device detection helpers
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipod|phone/i.test(userAgent)) return 'mobile';
        if (/tablet|ipad/i.test(userAgent)) return 'tablet';
        return 'desktop';
    }

    getOperatingSystem() {
        const platform = navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/win/i.test(platform)) return 'windows';
        if (/mac/i.test(platform)) return 'macos';
        if (/linux/i.test(platform)) return 'linux';
        if (/android/i.test(userAgent)) return 'android';
        if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
        
        return 'unknown';
    }

    getBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome')) return 'chrome';
        if (userAgent.includes('firefox')) return 'firefox';
        if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
        if (userAgent.includes('edge')) return 'edge';
        
        return 'unknown';
    }

    // Capability detection helpers
    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType || 'unknown',
                downlink: conn.downlink || 0,
                rtt: conn.rtt || 0,
                saveData: conn.saveData || false
            };
        }
        
        return { effectiveType: 'unknown', downlink: 0, rtt: 0, saveData: false };
    }

    getBatteryInfo() {
        // Battery API is deprecated but still useful for optimization
        return {
            level: 1,
            charging: true,
            chargingTime: Infinity,
            dischargingTime: Infinity
        };
    }

    detectWebGL() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    }

    detectWebGL2() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl2'));
    }

    detectCSS3D() {
        const element = document.createElement('div');
        return 'perspective' in element.style;
    }

    detectFlexbox() {
        const element = document.createElement('div');
        return 'flex' in element.style;
    }

    detectCSSGrid() {
        const element = document.createElement('div');
        return 'grid' in element.style;
    }

    detectAnimationSupport() {
        const element = document.createElement('div');
        return 'animation' in element.style;
    }

    detectReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    estimateRefreshRate() {
        // Simple refresh rate estimation
        return screen.refreshRate || 60;
    }

    /**
     * Force responsive recalculation
     */
    forceRecalculation() {
        this.viewport = this.getViewportInfo();
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.adaptToCurrentConditions();
    }

    /**
     * Get responsive recommendations
     */
    getRecommendations() {
        const recommendations = [];
        
        if (this.performanceProfile.tier === 'low') {
            recommendations.push({
                type: 'performance',
                message: 'Consider reducing visual effects for better performance',
                action: 'disable_animations'
            });
        }
        
        if (this.device.isTouch && this.currentBreakpoint.name === 'desktop') {
            recommendations.push({
                type: 'touch',
                message: 'Touch device detected on desktop layout - consider touch optimizations',
                action: 'enable_touch_mode'
            });
        }
        
        if (this.viewport.aspectRatio < 1.3) {
            recommendations.push({
                type: 'layout',
                message: 'Narrow aspect ratio detected - consider vertical layout optimizations',
                action: 'optimize_for_vertical'
            });
        }
        
        return recommendations;
    }
}

// Export to global scope for FM-Base integration
if (typeof window !== 'undefined') {
    window.ResponsiveSystem = ResponsiveSystem;
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.fmResponsive = new ResponsiveSystem();
        });
    } else {
        window.fmResponsive = new ResponsiveSystem();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveSystem;
}