/**
 * FM-Base Application Initializer
 * Bootstrap all components in correct order, check dependencies,
 * initialize data pipeline, and setup state management.
 */

(function() {
    'use strict';

    const AppInitializer = {
        // Initialization state
        initialized: false,
        initStartTime: null,
        loadedComponents: new Set(),
        failedComponents: new Set(),
        initPromise: null,

        // Component dependencies mapping
        dependencies: {
            'state-manager': [],
            'utils': [],
            'data-pipeline': ['state-manager', 'utils'],
            'data-binding': ['state-manager', 'data-pipeline'],
            'layout-manager': ['state-manager', 'utils'],
            'responsive-system': ['layout-manager'],
            'animation-controller': ['utils'],
            'card-registry': ['state-manager'],
            'card-manager': ['card-registry', 'layout-manager', 'animation-controller'],
            'card-enhancer-v2': ['card-manager'],
            'screen-router': ['state-manager']
            // Removed non-existent: visualizations, player-components, card-modules
        },

        /**
         * Initialize the application
         * @returns {Promise} Initialization promise
         */
        async init() {
            if (this.initPromise) {
                return this.initPromise;
            }

            this.initStartTime = performance.now();
            console.log('🚀 FM-Base initialization started');

            this.initPromise = this._performInit();
            return this.initPromise;
        },

        /**
         * Perform the actual initialization
         * @private
         */
        async _performInit() {
            try {
                // 1. Validate environment
                this._validateEnvironment();

                // 2. Initialize configuration
                if (window.AppConfig) {
                    window.AppConfig.init();
                } else {
                    throw new Error('AppConfig not found');
                }

                // 3. Setup performance monitoring
                this._setupPerformanceMonitoring();

                // 4. Load components in dependency order
                await this._loadComponents();

                // 5. Initialize data systems
                await this._initializeDataSystems();

                // 6. Setup layout system
                await this._initializeLayoutSystem();

                // 7. Register card modules
                await this._registerCardModules();

                // 8. Initialize screens
                await this._initializeScreens();

                // 9. Setup event listeners
                this._setupEventListeners();

                // 10. Load saved state
                await this._loadSavedState();

                // 11. Final validation
                this._validateInitialization();

                // 12. Initialize Main UI - ZENITH Architecture Fix
                // The core issue: DOM timing and scope conflicts
                if (typeof window.initializeMainUI === 'function') {
                    // Ensure DOM is actually ready before initialization
                    const initMainUI = () => {
                        console.log('🎮 ZENITH: Initializing main UI with proper timing...');
                        
                        // Verify critical elements exist
                        const overviewPage = document.getElementById('overview-page');
                        if (!overviewPage) {
                            console.warn('ZENITH: Pages not yet in DOM, waiting...');
                            // If elements don't exist, wait for next frame
                            requestAnimationFrame(() => {
                                window.initializeMainUI();
                            });
                        } else {
                            console.log('✅ ZENITH: DOM verified, initializing UI');
                            window.initializeMainUI();
                        }
                    };
                    
                    // Use proper DOM ready detection
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        // DOM is ready now
                        setTimeout(initMainUI, 100);
                    } else {
                        // Wait for DOM to be ready
                        document.addEventListener('DOMContentLoaded', () => {
                            setTimeout(initMainUI, 100);
                        });
                    }
                } else {
                    console.warn('Main UI initialization function not found');
                }

                const initTime = performance.now() - this.initStartTime;
                console.log(`✅ FM-Base initialized successfully in ${initTime.toFixed(2)}ms`);

                this.initialized = true;
                this._dispatchEvent('app:initialized', { initTime });

                return true;

            } catch (error) {
                console.error('❌ FM-Base initialization failed:', error);
                this._dispatchEvent('app:init-failed', { error });
                throw error;
            }
        },

        /**
         * Validate the environment has required dependencies
         * @private
         */
        _validateEnvironment() {
            const required = ['document', 'window', 'localStorage', 'performance'];
            const missing = required.filter(dep => typeof window[dep] === 'undefined');
            
            if (missing.length > 0) {
                throw new Error(`Missing required environment dependencies: ${missing.join(', ')}`);
            }

            // Check for CSS Grid support
            if (!CSS.supports('display', 'grid')) {
                console.warn('CSS Grid not supported, layout may be compromised');
            }

            // Check for modern JavaScript features
            try {
                new Map();
                new Set();
                new Promise(() => {});
            } catch (e) {
                throw new Error('Modern JavaScript features not supported');
            }
        },

        /**
         * Setup performance monitoring
         * @private
         */
        _setupPerformanceMonitoring() {
            if (!window.AppConfig?.features?.performanceMonitoring) return;

            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
                        }
                    }
                });
                observer.observe({ entryTypes: ['longtask'] });
            }

            // Monitor memory leaks
            let lastMemoryCheck = 0;
            setInterval(() => {
                if (performance.memory) {
                    const currentMemory = performance.memory.usedJSHeapSize;
                    if (lastMemoryCheck > 0) {
                        const growth = currentMemory - lastMemoryCheck;
                        if (growth > 5 * 1024 * 1024) { // 5MB growth
                            console.warn(`Memory growth detected: ${(growth / 1024 / 1024).toFixed(2)}MB`);
                        }
                    }
                    lastMemoryCheck = currentMemory;
                }
            }, 30000);
        },

        /**
         * Load components in correct dependency order
         * @private
         */
        async _loadComponents() {
            const loadOrder = this._calculateLoadOrder();
            
            for (const componentName of loadOrder) {
                try {
                    await this._loadComponent(componentName);
                    this.loadedComponents.add(componentName);
                } catch (error) {
                    console.error(`Failed to load component: ${componentName}`, error);
                    this.failedComponents.add(componentName);
                    
                    // Don't fail the entire initialization for non-critical components
                    if (this._isCriticalComponent(componentName)) {
                        throw error;
                    }
                }
            }
        },

        /**
         * Calculate component load order based on dependencies
         * @private
         */
        _calculateLoadOrder() {
            const order = [];
            const visited = new Set();
            const visiting = new Set();

            const visit = (component) => {
                if (visiting.has(component)) {
                    throw new Error(`Circular dependency detected: ${component}`);
                }
                if (visited.has(component)) return;

                visiting.add(component);

                const deps = this.dependencies[component] || [];
                for (const dep of deps) {
                    visit(dep);
                }

                visiting.delete(component);
                visited.add(component);
                order.push(component);
            };

            for (const component of Object.keys(this.dependencies)) {
                visit(component);
            }

            return order;
        },

        /**
         * Load a single component
         * @private
         */
        async _loadComponent(componentName) {
            // Check if component is already loaded
            const globalName = this._getGlobalName(componentName);
            
            // Special handling for components that have both class and instance
            if (componentName === 'utils' && (window.FMUtils || window.fmUtils)) {
                return window.FMUtils || window.fmUtils;
            }
            
            if (window[globalName]) {
                return window[globalName];
            }

            // Check dependencies
            const deps = this.dependencies[componentName] || [];
            const missingDeps = deps.filter(dep => !this.loadedComponents.has(dep));
            if (missingDeps.length > 0) {
                throw new Error(`Missing dependencies for ${componentName}: ${missingDeps.join(', ')}`);
            }

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error(`Component ${componentName} failed to load within timeout`));
                }, 5000);

                // Wait for component to be available
                const checkComponent = () => {
                    if (window[globalName]) {
                        clearTimeout(timeout);
                        resolve(window[globalName]);
                    } else {
                        setTimeout(checkComponent, 50);
                    }
                };

                checkComponent();
            });
        },

        /**
         * Get global variable name for component
         * @private
         */
        _getGlobalName(componentName) {
            // Special cases for components with custom global names
            const specialCases = {
                'utils': 'FMUtils',
                'animation-controller': 'AnimationController',
                'layout-manager': 'LayoutManager',
                'responsive-system': 'ResponsiveSystem',
                'state-manager': 'StateManager',
                'data-pipeline': 'DataPipeline',
                'data-binding': 'DataBinding',
                'card-registry': 'CardRegistry',
                'card-manager': 'CardManager',
                'card-enhancer': 'CardEnhancer',
                'card-enhancer-v2': 'CardEnhancerV2',
                'screen-router': 'ScreenRouter',
                'attribute-circle': 'AttributeCircle',
                'bar-chart': 'BarChart',
                'pizza-chart': 'PizzaChart',
                'player-profile': 'PlayerProfile',
                'comparison-tool': 'ComparisonTool',
                'archetype-classifier': 'ArchetypeClassifier'
            };
            
            if (specialCases[componentName]) {
                return specialCases[componentName];
            }
            
            return componentName
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('');
        },

        /**
         * Check if component is critical for app initialization
         * @private
         */
        _isCriticalComponent(componentName) {
            const critical = [
                'state-manager',
                'utils',
                'layout-manager',
                'card-manager',
                'card-registry'
            ];
            return critical.includes(componentName);
        },

        /**
         * Initialize data systems
         * @private
         */
        async _initializeDataSystems() {
            console.log('📊 Initializing data systems...');

            // Initialize state manager
            if (window.stateManager) {
                // Already instantiated
                console.log('✅ StateManager already initialized');
            } else if (window.StateManager) {
                // Create instance
                window.stateManager = new window.StateManager();
            }

            // Initialize data pipeline
            if (window.dataPipeline) {
                // Already instantiated
                console.log('✅ DataPipeline already initialized');
            } else if (window.DataPipeline) {
                // Create instance
                window.dataPipeline = new window.DataPipeline();
            }

            // Setup data binding
            if (window.dataBinding) {
                // Already instantiated
                console.log('✅ DataBinding already initialized');
            } else if (window.DataBinding) {
                // Create instance
                window.dataBinding = new window.DataBinding();
            }
        },

        /**
         * Initialize layout system
         * @private
         */
        async _initializeLayoutSystem() {
            console.log('🎨 Initializing layout system...');

            // Layout manager - already instantiated as window.fmLayout
            if (window.fmLayout) {
                console.log('✅ LayoutManager already initialized as fmLayout');
            } else if (window.LayoutManager) {
                // Create instance if needed
                window.fmLayout = new window.LayoutManager();
            }

            // Responsive system - already instantiated as window.fmResponsive
            if (window.fmResponsive) {
                console.log('✅ ResponsiveSystem already initialized as fmResponsive');
            } else if (window.ResponsiveSystem) {
                // Create instance if needed
                window.fmResponsive = new window.ResponsiveSystem();
            }

            // Animation controller - already instantiated as window.fmAnimator
            if (window.fmAnimator) {
                console.log('✅ AnimationController already initialized as fmAnimator');
            } else if (window.AnimationController) {
                // Create instance if needed
                window.fmAnimator = new window.AnimationController();
            }
        },

        /**
         * Register all card modules
         * @private
         */
        async _registerCardModules() {
            console.log('🎴 Checking card modules...');

            if (!window.CardRegistry) {
                throw new Error('CardRegistry not available');
            }

            // Cards auto-register themselves when loaded
            // Just verify they're registered
            const registeredCards = window.CardRegistry.getRegisteredTypes();
            console.log(`✅ ${registeredCards.length} cards already registered`);
            
            // Don't re-register cards - they handle it themselves
        },

        /**
         * Get card type from module name
         * @private
         */
        _getCardTypeFromModule(moduleName) {
            return moduleName
                .replace(/Card$/, '')
                .replace(/([A-Z])/g, '-$1')
                .toLowerCase()
                .slice(1);
        },

        /**
         * Initialize screen system
         * @private
         */
        async _initializeScreens() {
            console.log('🖥️ Initializing screens...');

            if (window.ScreenRouter) {
                window.ScreenRouter.init();

                // Register available screens
                const screens = ['SquadScreen', 'TacticsScreen', 'TrainingScreen'];
                for (const screenName of screens) {
                    if (window[screenName]) {
                        const routeName = screenName.replace('Screen', '').toLowerCase();
                        window.ScreenRouter.register(routeName, window[screenName]);
                    }
                }
            }
        },

        /**
         * Setup global event listeners
         * @private
         */
        _setupEventListeners() {
            // Handle window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this._dispatchEvent('app:resize');
                }, window.AppConfig?.events?.throttleMs?.resize || 100);
            });

            // Handle visibility change (tab switching)
            document.addEventListener('visibilitychange', () => {
                this._dispatchEvent('app:visibility-change', {
                    hidden: document.hidden
                });
            });

            // Handle keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                this._handleKeyboardShortcuts(e);
            });

            // Handle errors
            window.addEventListener('error', (e) => {
                console.error('Global error:', e.error);
                this._dispatchEvent('app:error', { error: e.error });
            });

            // Handle unhandled promise rejections
            window.addEventListener('unhandledrejection', (e) => {
                console.error('Unhandled promise rejection:', e.reason);
                this._dispatchEvent('app:unhandled-rejection', { reason: e.reason });
            });
        },

        /**
         * Handle keyboard shortcuts
         * @private
         */
        _handleKeyboardShortcuts(e) {
            // Only handle shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const shortcuts = {
                // Debug shortcuts (Ctrl/Cmd + Shift + key)
                'KeyD': () => this._toggleDebugMode(),
                'KeyG': () => this._toggleGridLines(),
                'KeyP': () => this._togglePerformanceMonitor(),
                
                // Layout shortcuts (Ctrl/Cmd + key)
                'KeyS': () => this._saveLayout(),
                'KeyR': () => this._resetLayout(),
                'KeyF': () => this._toggleFullscreen()
            };

            const key = e.code;
            const hasModifier = e.ctrlKey || e.metaKey;
            const hasShift = e.shiftKey;

            if (shortcuts[key] && hasModifier) {
                e.preventDefault();
                shortcuts[key]();
            }
        },

        /**
         * Toggle debug mode
         * @private
         */
        _toggleDebugMode() {
            if (window.AppConfig) {
                window.AppConfig.debug.enableLogging = !window.AppConfig.debug.enableLogging;
                console.log(`Debug mode: ${window.AppConfig.debug.enableLogging ? 'ON' : 'OFF'}`);
            }
        },

        /**
         * Toggle grid lines
         * @private
         */
        _toggleGridLines() {
            if (window.AppConfig && window.LayoutManager) {
                window.AppConfig.debug.showGridLines = !window.AppConfig.debug.showGridLines;
                window.LayoutManager.toggleGridLines();
            }
        },

        /**
         * Toggle performance monitor
         * @private
         */
        _togglePerformanceMonitor() {
            // Implementation would depend on performance monitoring UI
            console.log('Performance monitor toggle requested');
        },

        /**
         * Save current layout
         * @private
         */
        _saveLayout() {
            if (window.LayoutManager) {
                window.LayoutManager.saveLayout();
                console.log('Layout saved');
            }
        },

        /**
         * Reset layout to default
         * @private
         */
        _resetLayout() {
            if (window.LayoutManager) {
                window.LayoutManager.resetLayout();
                console.log('Layout reset');
            }
        },

        /**
         * Toggle fullscreen
         * @private
         */
        _toggleFullscreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        },

        /**
         * Load saved application state
         * @private
         */
        async _loadSavedState() {
            console.log('💾 Loading saved state...');

            try {
                // Load layout state
                if (window.fmLayout && typeof window.fmLayout.loadLayout === 'function') {
                    window.fmLayout.loadLayout();
                } else {
                    console.log('Layout loading skipped - loadLayout not available');
                }

                // Load user preferences
                const preferences = localStorage.getItem(
                    window.AppConfig?.storage?.prefix + 'user-preferences'
                );
                if (preferences) {
                    const parsed = JSON.parse(preferences);
                    this._applyUserPreferences(parsed);
                }

            } catch (error) {
                console.warn('Failed to load saved state:', error);
            }
        },

        /**
         * Apply user preferences
         * @private
         */
        _applyUserPreferences(preferences) {
            if (preferences.theme && window.AppConfig) {
                window.AppConfig.theme.default = preferences.theme;
                window.AppConfig.applyTheme();
            }

            if (preferences.accessibility) {
                Object.assign(window.AppConfig.accessibility, preferences.accessibility);
            }
        },

        /**
         * Validate initialization completed successfully
         * @private
         */
        _validateInitialization() {
            const required = ['LayoutManager', 'CardManager', 'StateManager'];
            const missing = required.filter(component => !window[component]);

            if (missing.length > 0) {
                throw new Error(`Critical components failed to initialize: ${missing.join(', ')}`);
            }

            // Check if minimum cards are registered
            if (window.CardRegistry && window.CardRegistry.getRegisteredTypes().length === 0) {
                console.warn('No card types registered');
            }
        },

        /**
         * Dispatch custom event
         * @private
         */
        _dispatchEvent(eventName, detail = {}) {
            const event = new CustomEvent(eventName, { detail });
            document.dispatchEvent(event);
        },

        /**
         * Get initialization status
         */
        getStatus() {
            return {
                initialized: this.initialized,
                loadedComponents: Array.from(this.loadedComponents),
                failedComponents: Array.from(this.failedComponents),
                initTime: this.initStartTime ? performance.now() - this.initStartTime : null
            };
        },

        /**
         * Cleanup and destroy
         */
        destroy() {
            this.initialized = false;
            this.loadedComponents.clear();
            this.failedComponents.clear();
            this.initPromise = null;
            
            // Cleanup components in reverse order
            const loadOrder = this._calculateLoadOrder().reverse();
            for (const componentName of loadOrder) {
                const globalName = this._getGlobalName(componentName);
                if (window[globalName] && typeof window[globalName].destroy === 'function') {
                    window[globalName].destroy();
                }
            }
        }
    };

    // Export to global scope
    if (typeof window !== 'undefined') {
        window.AppInitializer = AppInitializer;
    }

    // Auto-initialize when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                AppInitializer.init().catch(console.error);
            });
        } else {
            // DOM already loaded
            setTimeout(() => {
                AppInitializer.init().catch(console.error);
            }, 0);
        }
    }

    // Export for Node.js environments
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AppInitializer;
    }

})();