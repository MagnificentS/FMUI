/**
 * PERFORMANCE OPTIMIZER
 * Lazy loading, caching, and performance optimizations for the subscreen system
 * Prevents performance issues and validation loops identified in issues.txt
 */

(function() {
    'use strict';

    console.log('⚡ PERFORMANCE OPTIMIZER: Initializing performance optimization system...');

    const PerformanceOptimizer = {
        // Performance configuration
        config: {
            lazyLoadThreshold: 100,     // Load content when within 100px of viewport
            cacheTimeout: 300000,       // Cache content for 5 minutes
            maxConcurrentLoads: 3,      // Limit concurrent content loading
            debounceDelay: 150,         // Debounce UI updates
            maxValidationFrequency: 2000 // Max one validation per 2 seconds
        },

        // Performance tracking
        performanceMetrics: {
            loadTimes: new Map(),
            cacheHits: 0,
            cacheMisses: 0,
            layoutOperations: 0,
            validationCount: 0,
            lastValidationTime: 0
        },

        // Content cache
        contentCache: new Map(),
        loadingQueue: [],
        isLoading: false,

        init() {
            console.log('⚡ PERFORMANCE: Setting up optimization systems...');
            
            this.setupLazyLoading();
            this.setupContentCaching();
            this.setupPerformanceMonitoring();
            this.setupValidationThrottling();
            this.setupLayoutOptimization();
            
            console.log('✅ PERFORMANCE OPTIMIZER: All optimizations active');
        },

        setupLazyLoading() {
            console.log('🔄 Setting up lazy loading system...');
            
            // Create intersection observer for lazy loading
            this.lazyLoadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadComponentContent(entry.target);
                        this.lazyLoadObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: `${this.config.lazyLoadThreshold}px`
            });
            
            // Override subscreen content loading to use lazy loading
            if (window.SubscreenSystem) {
                const originalLoadContent = window.SubscreenSystem.loadSubscreenContent;
                
                window.SubscreenSystem.loadSubscreenContent = (tab, subscreen) => {
                    return this.lazyLoadSubscreenContent(tab, subscreen, originalLoadContent);
                };
            }
            
            console.log('✅ Lazy loading system active');
        },

        lazyLoadSubscreenContent(tab, subscreen, originalLoader) {
            console.log(`🔄 Lazy loading ${tab}/${subscreen}...`);
            
            const startTime = performance.now();
            const cacheKey = `${tab}-${subscreen}`;
            
            // Check cache first
            if (this.contentCache.has(cacheKey)) {
                const cached = this.contentCache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.config.cacheTimeout) {
                    console.log(`💾 Cache hit for ${tab}/${subscreen}`);
                    this.performanceMetrics.cacheHits++;
                    this.applyCachedContent(tab, subscreen, cached.content);
                    return;
                }
            }
            
            // Cache miss - load content
            this.performanceMetrics.cacheMisses++;
            console.log(`🔄 Cache miss for ${tab}/${subscreen} - loading content`);
            
            // Add to loading queue
            this.addToLoadingQueue({
                tab: tab,
                subscreen: subscreen,
                loader: originalLoader,
                startTime: startTime,
                cacheKey: cacheKey
            });
            
            this.processLoadingQueue();
        },

        addToLoadingQueue(loadTask) {
            this.loadingQueue.push(loadTask);
            
            // Limit queue size
            if (this.loadingQueue.length > 10) {
                this.loadingQueue = this.loadingQueue.slice(-10);
            }
        },

        processLoadingQueue() {
            if (this.isLoading || this.loadingQueue.length === 0) {
                return;
            }
            
            this.isLoading = true;
            const task = this.loadingQueue.shift();
            
            // Show loading indicator
            this.showLoadingIndicator(task.tab, task.subscreen);
            
            // Execute loading with timeout
            setTimeout(() => {
                try {
                    // Call original loader
                    task.loader.call(window.SubscreenSystem, task.tab, task.subscreen);
                    
                    // Cache the result
                    this.cacheSubscreenContent(task.cacheKey, task.tab, task.subscreen);
                    
                    // Record performance
                    const loadTime = performance.now() - task.startTime;
                    this.performanceMetrics.loadTimes.set(task.cacheKey, loadTime);
                    
                    console.log(`⚡ Loaded ${task.tab}/${task.subscreen} in ${loadTime.toFixed(1)}ms`);
                    
                } catch (error) {
                    console.error(`Error loading ${task.tab}/${task.subscreen}:`, error);
                }
                
                // Hide loading indicator
                this.hideLoadingIndicator();
                
                this.isLoading = false;
                
                // Process next item in queue
                setTimeout(() => this.processLoadingQueue(), 50);
                
            }, 16); // Next frame
        },

        showLoadingIndicator(tab, subscreen) {
            const container = document.querySelector(`#${tab}-grid-view .tile-container`);
            if (container) {
                const indicator = document.createElement('div');
                indicator.className = 'loading-indicator';
                indicator.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">Loading ${this.formatSubscreenName(tab, subscreen)}...</div>
                    </div>
                `;
                
                container.appendChild(indicator);
            }
        },

        hideLoadingIndicator() {
            const indicators = document.querySelectorAll('.loading-indicator');
            indicators.forEach(indicator => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 200);
            });
        },

        setupContentCaching() {
            console.log('💾 Setting up content caching system...');
            
            // Set up cache cleanup interval
            setInterval(() => {
                this.cleanupCache();
            }, 60000); // Cleanup every minute
            
            console.log('✅ Content caching system active');
        },

        cacheSubscreenContent(cacheKey, tab, subscreen) {
            const container = document.querySelector(`#${tab}-grid-view .tile-container`);
            if (container) {
                const content = container.innerHTML;
                this.contentCache.set(cacheKey, {
                    content: content,
                    timestamp: Date.now(),
                    tab: tab,
                    subscreen: subscreen
                });
                
                console.log(`💾 Cached content for ${cacheKey}`);
            }
        },

        applyCachedContent(tab, subscreen, content) {
            const container = document.querySelector(`#${tab}-grid-view .tile-container`);
            if (container) {
                container.innerHTML = content;
                
                // Re-initialize any event handlers that were cached
                this.reinitializeCachedContent(container);
            }
        },

        reinitializeCachedContent(container) {
            // Re-setup event handlers for cached content
            container.querySelectorAll('[onclick]').forEach(element => {
                // onclick attributes are preserved in cached HTML
            });
            
            // Re-setup any drag/drop functionality
            if (window.initializeCardFeatures) {
                setTimeout(() => window.initializeCardFeatures(), 50);
            }
        },

        cleanupCache() {
            const now = Date.now();
            const toDelete = [];
            
            this.contentCache.forEach((cached, key) => {
                if (now - cached.timestamp > this.config.cacheTimeout) {
                    toDelete.push(key);
                }
            });
            
            toDelete.forEach(key => {
                this.contentCache.delete(key);
            });
            
            if (toDelete.length > 0) {
                console.log(`🗑️ Cleaned up ${toDelete.length} expired cache entries`);
            }
        },

        setupPerformanceMonitoring() {
            console.log('📊 Setting up performance monitoring...');
            
            // Monitor critical performance metrics
            this.performanceMonitor = setInterval(() => {
                this.collectPerformanceMetrics();
            }, 10000); // Check every 10 seconds
            
            // Add performance overlay
            this.createPerformanceOverlay();
            
            console.log('✅ Performance monitoring active');
        },

        collectPerformanceMetrics() {
            const metrics = {
                memory: this.getMemoryUsage(),
                cacheEfficiency: this.calculateCacheEfficiency(),
                avgLoadTime: this.calculateAverageLoadTime(),
                validationFrequency: this.performanceMetrics.validationCount,
                layoutOperations: this.performanceMetrics.layoutOperations,
                timestamp: Date.now()
            };
            
            // Reset counters
            this.performanceMetrics.validationCount = 0;
            this.performanceMetrics.layoutOperations = 0;
            
            // Log if performance is concerning
            if (metrics.avgLoadTime > 500) {
                console.warn(`⚠️ High load times: ${metrics.avgLoadTime.toFixed(1)}ms average`);
            }
            
            if (metrics.cacheEfficiency < 0.7) {
                console.warn(`⚠️ Low cache efficiency: ${(metrics.cacheEfficiency * 100).toFixed(1)}%`);
            }
            
            this.updatePerformanceOverlay(metrics);
        },

        getMemoryUsage() {
            if (performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
                };
            }
            return null;
        },

        calculateCacheEfficiency() {
            const total = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses;
            return total > 0 ? this.performanceMetrics.cacheHits / total : 0;
        },

        calculateAverageLoadTime() {
            const loadTimes = Array.from(this.performanceMetrics.loadTimes.values());
            return loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0;
        },

        setupValidationThrottling() {
            console.log('⏱️ Setting up validation throttling to prevent loops...');
            
            // Throttle validation calls
            if (window.FinalUXValidator && window.FinalUXValidator.validateScreen) {
                const originalValidate = window.FinalUXValidator.validateScreen;
                
                window.FinalUXValidator.validateScreen = (screenName) => {
                    const now = Date.now();
                    
                    if (now - this.performanceMetrics.lastValidationTime < this.config.maxValidationFrequency) {
                        console.log(`⏱️ Validation throttled for ${screenName}`);
                        return;
                    }
                    
                    this.performanceMetrics.lastValidationTime = now;
                    this.performanceMetrics.validationCount++;
                    
                    return originalValidate.call(window.FinalUXValidator, screenName);
                };
            }
            
            console.log('✅ Validation throttling active');
        },

        setupLayoutOptimization() {
            console.log('📐 Setting up layout optimization...');
            
            // Debounce layout operations
            let layoutTimeout;
            
            if (window.layoutCards) {
                const originalLayoutCards = window.layoutCards;
                
                window.layoutCards = (container) => {
                    clearTimeout(layoutTimeout);
                    
                    layoutTimeout = setTimeout(() => {
                        this.performanceMetrics.layoutOperations++;
                        
                        const startTime = performance.now();
                        originalLayoutCards.call(this, container);
                        const endTime = performance.now();
                        
                        console.log(`📐 Layout operation: ${(endTime - startTime).toFixed(1)}ms`);
                        
                    }, this.config.debounceDelay);
                };
            }
            
            // Optimize grid operations
            this.setupGridOptimization();
            
            console.log('✅ Layout optimization active');
        },

        setupGridOptimization() {
            console.log('🎯 Setting up grid rendering optimization...');
            
            // Use requestAnimationFrame for grid updates
            window.optimizedGridUpdate = (callback) => {
                requestAnimationFrame(() => {
                    callback();
                });
            };
            
            // Batch DOM updates
            window.batchGridUpdates = (updates) => {
                requestAnimationFrame(() => {
                    updates.forEach(update => update());
                });
            };
            
            console.log('✅ Grid optimization ready');
        },

        createPerformanceOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'performance-overlay';
            overlay.className = 'performance-overlay hidden';
            
            overlay.innerHTML = `
                <div class="performance-content">
                    <div class="performance-header">
                        <span class="performance-title">Performance Monitor</span>
                        <button class="performance-toggle" onclick="PerformanceOptimizer.togglePerformanceOverlay()">×</button>
                    </div>
                    <div class="performance-metrics" id="performance-metrics">
                        <!-- Metrics populated dynamically -->
                    </div>
                    <div class="performance-actions">
                        <button class="perf-btn" onclick="PerformanceOptimizer.clearCache()">Clear Cache</button>
                        <button class="perf-btn" onclick="PerformanceOptimizer.optimizeNow()">Optimize Now</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Add toggle shortcut (Ctrl+Shift+P)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                    e.preventDefault();
                    this.togglePerformanceOverlay();
                }
            });
        },

        updatePerformanceOverlay(metrics) {
            const metricsContainer = document.getElementById('performance-metrics');
            if (!metricsContainer) return;
            
            let metricsHTML = '';
            
            // Cache metrics
            metricsHTML += `
                <div class="metric-item">
                    <span class="metric-label">Cache Efficiency</span>
                    <span class="metric-value ${metrics.cacheEfficiency > 0.7 ? 'good' : 'warning'}">
                        ${(metrics.cacheEfficiency * 100).toFixed(1)}%
                    </span>
                </div>
            `;
            
            // Load time metrics
            metricsHTML += `
                <div class="metric-item">
                    <span class="metric-label">Avg Load Time</span>
                    <span class="metric-value ${metrics.avgLoadTime < 200 ? 'good' : 'warning'}">
                        ${metrics.avgLoadTime.toFixed(1)}ms
                    </span>
                </div>
            `;
            
            // Memory usage
            if (metrics.memory) {
                metricsHTML += `
                    <div class="metric-item">
                        <span class="metric-label">Memory Usage</span>
                        <span class="metric-value ${metrics.memory.used < 50 ? 'good' : 'warning'}">
                            ${metrics.memory.used}MB
                        </span>
                    </div>
                `;
            }
            
            // Validation frequency
            metricsHTML += `
                <div class="metric-item">
                    <span class="metric-label">Validation Rate</span>
                    <span class="metric-value ${metrics.validationFrequency < 5 ? 'good' : 'critical'}">
                        ${metrics.validationFrequency}/10s
                    </span>
                </div>
            `;
            
            // Layout operations
            metricsHTML += `
                <div class="metric-item">
                    <span class="metric-label">Layout Ops</span>
                    <span class="metric-value ${metrics.layoutOperations < 3 ? 'good' : 'warning'}">
                        ${metrics.layoutOperations}/10s
                    </span>
                </div>
            `;
            
            metricsContainer.innerHTML = metricsHTML;
        },

        togglePerformanceOverlay() {
            const overlay = document.getElementById('performance-overlay');
            if (overlay) {
                overlay.classList.toggle('hidden');
            }
        },

        clearCache() {
            this.contentCache.clear();
            this.performanceMetrics.cacheHits = 0;
            this.performanceMetrics.cacheMisses = 0;
            console.log('🗑️ Performance cache cleared');
        },

        optimizeNow() {
            console.log('⚡ Running immediate optimization...');
            
            // Clear any pending operations
            this.loadingQueue = [];
            this.isLoading = false;
            
            // Optimize current screen
            if (window.GridUtilizationOptimizer && window.GridUtilizationOptimizer.optimizeCurrentScreen) {
                window.GridUtilizationOptimizer.optimizeCurrentScreen();
            }
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            console.log('✅ Immediate optimization complete');
        },

        // Preloading strategies
        preloadAdjacentSubscreens() {
            const currentSubscreen = window.SubscreenSystem?.currentSubscreen;
            if (!currentSubscreen) return;
            
            // Preload adjacent subscreens in the same tab
            const submenu = document.querySelector(`#${currentSubscreen.tab}-submenu`);
            if (submenu) {
                const items = Array.from(submenu.querySelectorAll('.submenu-item'));
                const current = submenu.querySelector('.submenu-item.active');
                const currentIndex = items.indexOf(current);
                
                // Preload previous and next subscreens
                const toPreload = [];
                if (currentIndex > 0) toPreload.push(items[currentIndex - 1]);
                if (currentIndex < items.length - 1) toPreload.push(items[currentIndex + 1]);
                
                toPreload.forEach(item => {
                    const subscreen = item.getAttribute('data-subscreen');
                    if (subscreen) {
                        this.preloadSubscreen(currentSubscreen.tab, subscreen);
                    }
                });
            }
        },

        preloadSubscreen(tab, subscreen) {
            const cacheKey = `${tab}-${subscreen}`;
            
            if (!this.contentCache.has(cacheKey)) {
                console.log(`🔄 Preloading ${tab}/${subscreen}...`);
                
                // Add to low-priority loading queue
                setTimeout(() => {
                    if (window.SubscreenSystem && window.SubscreenSystem.loadSubscreenContent) {
                        const container = document.querySelector(`#${tab}-grid-view .tile-container`);
                        const originalContent = container?.innerHTML;
                        
                        // Load content silently
                        window.SubscreenSystem.loadSubscreenContent(tab, subscreen);
                        
                        // Cache it
                        this.cacheSubscreenContent(cacheKey, tab, subscreen);
                        
                        // Restore original content
                        if (originalContent && container) {
                            container.innerHTML = originalContent;
                        }
                    }
                }, 1000);
            }
        },

        // Performance analysis
        generatePerformanceReport() {
            console.log('\n⚡ PERFORMANCE ANALYSIS REPORT:');
            console.log('='.repeat(50));
            
            const cacheEfficiency = this.calculateCacheEfficiency();
            const avgLoadTime = this.calculateAverageLoadTime();
            const totalOperations = this.performanceMetrics.layoutOperations + this.performanceMetrics.validationCount;
            
            console.log(`💾 Cache Efficiency: ${(cacheEfficiency * 100).toFixed(1)}%`);
            console.log(`⏱️ Average Load Time: ${avgLoadTime.toFixed(1)}ms`);
            console.log(`🔄 Total Operations: ${totalOperations}`);
            console.log(`💾 Cache Entries: ${this.contentCache.size}`);
            console.log(`📊 Validation Count: ${this.performanceMetrics.validationCount}`);
            console.log(`📐 Layout Operations: ${this.performanceMetrics.layoutOperations}`);
            
            // Performance score
            let score = 100;
            if (avgLoadTime > 300) score -= 20;
            if (cacheEfficiency < 0.7) score -= 15;
            if (this.performanceMetrics.validationCount > 10) score -= 25;
            if (this.performanceMetrics.layoutOperations > 5) score -= 15;
            
            console.log(`\n📈 PERFORMANCE SCORE: ${Math.max(0, score)}/100`);
            
            if (score >= 90) {
                console.log('🎉 EXCELLENT performance');
            } else if (score >= 75) {
                console.log('🎯 GOOD performance');
            } else if (score >= 60) {
                console.log('⚠️ ADEQUATE performance - improvements recommended');
            } else {
                console.log('❌ POOR performance - optimization required');
            }
            
            console.log('='.repeat(50));
            
            return { score, metrics };
        },

        formatSubscreenName(tab, subscreen) {
            return `${this.formatTabName(tab)} ${this.formatSubscreenName(subscreen)}`;
        },

        formatTabName(tab) {
            return tab.charAt(0).toUpperCase() + tab.slice(1);
        }
    };

    // Add performance optimization styles
    const performanceStyles = `
        /* Performance Optimization Styles */
        
        /* Loading Indicator */
        .loading-indicator {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(2px);
            transition: opacity 0.2s ease;
        }
        
        .loading-content {
            background: rgba(0, 20, 30, 0.95);
            border: 1px solid rgba(0, 148, 204, 0.3);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            color: white;
        }
        
        .loading-spinner {
            width: 24px;
            height: 24px;
            border: 2px solid rgba(0, 148, 204, 0.3);
            border-top: 2px solid #0094cc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 12px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-text {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        /* Performance Overlay */
        .performance-overlay {
            position: fixed;
            top: 120px;
            left: 20px;
            width: 200px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(255, 107, 53, 0.3);
            border-radius: 6px;
            color: white;
            font-size: 10px;
            z-index: 10000;
            transition: opacity 0.2s ease;
        }
        
        .performance-overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .performance-header {
            background: rgba(255, 107, 53, 0.2);
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 107, 53, 0.2);
        }
        
        .performance-title {
            font-weight: 600;
            color: #ff6b35;
            font-size: 11px;
        }
        
        .performance-toggle {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            font-size: 14px;
        }
        
        .performance-metrics {
            padding: 8px;
        }
        
        .metric-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 4px 0;
        }
        
        .metric-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 9px;
        }
        
        .metric-value {
            font-weight: 600;
            font-size: 9px;
        }
        
        .metric-value.good {
            color: #00ff88;
        }
        
        .metric-value.warning {
            color: #ffb800;
        }
        
        .metric-value.critical {
            color: #ff4757;
        }
        
        .performance-actions {
            padding: 6px 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            gap: 6px;
        }
        
        .perf-btn {
            flex: 1;
            background: rgba(255, 107, 53, 0.1);
            border: 1px solid rgba(255, 107, 53, 0.3);
            color: #ff6b35;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 8px;
            transition: all 0.2s ease;
        }
        
        .perf-btn:hover {
            background: rgba(255, 107, 53, 0.2);
            border-color: #ff6b35;
        }
        
        /* Performance optimizations */
        .subscreen-component {
            contain: layout style paint;
        }
        
        .subscreen-component.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        /* Reduce motion for performance */
        @media (prefers-reduced-motion: reduce) {
            .subscreen-component,
            .loading-indicator,
            .performance-overlay {
                transition: none;
                animation: none;
            }
        }
        
        /* Optimize scroll performance */
        .card-body,
        .subscreen-body {
            contain: strict;
            overflow-anchor: none;
        }
        
        /* Optimize rendering layers */
        .primary-component {
            will-change: transform;
        }
        
        .secondary-component:hover,
        .tertiary-component:hover,
        .utility-component:hover {
            will-change: transform;
        }
    `;
    
    // Inject styles
    const style = document.createElement('style');
    style.id = 'performance-optimization-styles';
    style.textContent = performanceStyles;
    document.head.appendChild(style);

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => PerformanceOptimizer.init(), 1100);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => PerformanceOptimizer.init(), 1100);
        });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (PerformanceOptimizer.performanceMonitor) {
            clearInterval(PerformanceOptimizer.performanceMonitor);
        }
    });

    // Make available globally
    window.PerformanceOptimizer = PerformanceOptimizer;

})();