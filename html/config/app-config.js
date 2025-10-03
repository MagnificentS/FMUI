/**
 * FM-Base Application Configuration
 * Central configuration file for all app settings, component initialization,
 * performance thresholds, and feature flags.
 */

(function() {
    'use strict';

    const AppConfig = {
        // Application metadata
        version: '1.0.0',
        name: 'FM-Base',
        buildDate: new Date().toISOString(),

        // Performance thresholds
        performance: {
            targetFPS: 60,
            maxMemoryMB: 150,
            maxInitialLoadMs: 3000,
            maxComponentLoadMs: 100,
            maxAnimationDurationMs: 300,
            dragDropThrottleMs: 16, // 60fps
            resizeDebounceMs: 100,
            searchDebounceMs: 250
        },

        // Feature flags
        features: {
            darkMode: true,
            animations: true,
            particleEffects: true,
            soundEffects: false,
            hapticFeedback: true,
            experimentalFeatures: false,
            debugMode: false,
            performanceMonitoring: true,
            autoSave: true,
            offlineMode: false
        },

        // Component initialization settings
        components: {
            // Load order is critical - dependencies first
            loadOrder: [
                'utils',
                'state-manager',
                'data-pipeline',
                'data-binding',
                'layout-manager',
                'responsive-system',
                'animation-controller',
                'card-registry',
                'card-manager',
                'card-enhancer-v2',
                'screen-router',
                'visualizations',
                'player-components',
                'card-modules'
            ],

            // Component-specific settings
            settings: {
                'layout-manager': {
                    gridColumns: 37,
                    gridRows: 19,
                    cellSize: 32,
                    gap: 8,
                    minCardWidth: 6,
                    minCardHeight: 3,
                    maxCards: 50
                },

                'responsive-system': {
                    breakpoints: {
                        mobile: 768,
                        tablet: 1024,
                        desktop: 1440,
                        ultrawide: 2560
                    },
                    debounceMs: 100
                },

                'animation-controller': {
                    easings: {
                        swift: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
                        snappy: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
                        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                    },
                    durations: {
                        fast: 150,
                        normal: 250,
                        slow: 400
                    }
                },

                'card-manager': {
                    autoSaveMs: 5000,
                    maxHistory: 50,
                    snapTolerance: 16
                },

                'data-pipeline': {
                    refreshIntervalMs: 30000,
                    retryAttempts: 3,
                    timeoutMs: 10000
                }
            }
        },

        // API endpoints and data sources
        api: {
            baseURL: '/api/v1',
            timeout: 10000,
            retryAttempts: 3,
            endpoints: {
                players: '/players',
                squads: '/squads',
                matches: '/matches',
                tactics: '/tactics',
                training: '/training',
                transfers: '/transfers',
                finances: '/finances',
                leagues: '/leagues'
            }
        },

        // Theme configuration
        theme: {
            default: 'dark',
            schemes: {
                dark: {
                    name: 'FM Dark',
                    primary: '#0094cc',
                    secondary: '#ff6b35',
                    success: '#00ff88',
                    warning: '#ffb800',
                    error: '#ff4757',
                    background: '#0a0b0d',
                    surface: '#12141a'
                },
                light: {
                    name: 'FM Light',
                    primary: '#005a7a',
                    secondary: '#cc4a1c',
                    success: '#00cc6a',
                    warning: '#cc9400',
                    error: '#cc2f3f',
                    background: '#f5f5f5',
                    surface: '#ffffff'
                }
            }
        },

        // Grid system configuration
        grid: {
            columns: 37,
            rows: 19,
            cellSize: 32,
            gap: 8,
            padding: {
                vertical: 18,
                horizontal: 16
            },
            constraints: {
                minCardWidth: 6,
                minCardHeight: 3,
                defaultCardWidth: 14,
                defaultCardHeight: 8,
                maxCardWidth: 25,
                maxCardHeight: 15
            }
        },

        // Card registry configuration
        cards: {
            // Default card configurations
            defaults: {
                resizable: true,
                draggable: true,
                collapsible: true,
                closable: true,
                refreshable: true,
                exportable: false,
                priority: 1
            },

            // Registered card types
            types: {
                'player-detail': {
                    name: 'Player Detail',
                    category: 'players',
                    defaultSize: { width: 14, height: 10 },
                    minSize: { width: 10, height: 8 },
                    maxSize: { width: 20, height: 15 },
                    priority: 3
                },
                'squad-summary': {
                    name: 'Squad Summary',
                    category: 'squad',
                    defaultSize: { width: 12, height: 8 },
                    minSize: { width: 8, height: 6 },
                    priority: 2
                },
                'tactical-overview': {
                    name: 'Tactical Overview',
                    category: 'tactics',
                    defaultSize: { width: 16, height: 12 },
                    minSize: { width: 12, height: 8 },
                    priority: 2
                },
                'performance-dashboard': {
                    name: 'Performance Dashboard',
                    category: 'analytics',
                    defaultSize: { width: 18, height: 10 },
                    minSize: { width: 14, height: 8 },
                    priority: 1
                },
                'upcoming-fixtures': {
                    name: 'Upcoming Fixtures',
                    category: 'matches',
                    defaultSize: { width: 10, height: 8 },
                    minSize: { width: 8, height: 6 },
                    priority: 2
                },
                'training-schedule': {
                    name: 'Training Schedule',
                    category: 'training',
                    defaultSize: { width: 12, height: 8 },
                    minSize: { width: 8, height: 6 },
                    priority: 1
                },
                'transfer-targets': {
                    name: 'Transfer Targets',
                    category: 'transfers',
                    defaultSize: { width: 14, height: 10 },
                    minSize: { width: 10, height: 8 },
                    priority: 1
                },
                'financial-overview': {
                    name: 'Financial Overview',
                    category: 'finances',
                    defaultSize: { width: 12, height: 8 },
                    minSize: { width: 8, height: 6 },
                    priority: 1
                },
                'league-table': {
                    name: 'League Table',
                    category: 'leagues',
                    defaultSize: { width: 10, height: 12 },
                    minSize: { width: 8, height: 8 },
                    priority: 2
                }
            }
        },

        // Accessibility settings
        accessibility: {
            highContrast: false,
            reducedMotion: false,
            screenReader: false,
            keyboardNavigation: true,
            focusIndicators: true,
            minimumClickTarget: 44 // pixels
        },

        // Debug and development settings
        debug: {
            enableLogging: false,
            enableProfiling: false,
            showGridLines: false,
            showComponentBounds: false,
            logLevel: 'warn', // error, warn, info, debug
            enableHotReload: false
        },

        // Local storage keys
        storage: {
            prefix: 'fm-base-',
            keys: {
                layout: 'layout',
                theme: 'theme',
                settings: 'settings',
                cardStates: 'card-states',
                userPreferences: 'user-preferences'
            }
        },

        // Event system configuration
        events: {
            maxListeners: 100,
            bubbling: true,
            throttleMs: {
                resize: 100,
                scroll: 16,
                mousemove: 16,
                drag: 16
            }
        },

        // Animation and transition configurations
        animations: {
            // Standard durations following Material Design
            durations: {
                entering: 225,
                leaving: 195,
                standard: 300,
                complex: 375,
                emphasized: 500
            },

            // Easing curves optimized for UI
            easings: {
                standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
                decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
                accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
                sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
                emphasized: 'cubic-bezier(0.2, 0.0, 0, 1)'
            },

            // Stagger patterns for sequential animations
            stagger: {
                cascade: 50,
                wave: 100,
                random: 150
            }
        },

        // Validation rules
        validation: {
            cardName: {
                minLength: 1,
                maxLength: 50,
                pattern: /^[a-zA-Z0-9\s\-_]+$/
            },
            cardSize: {
                minWidth: 6,
                maxWidth: 25,
                minHeight: 3,
                maxHeight: 15
            }
        },

        // Initialize method
        init() {
            // Set up performance monitoring
            if (this.features.performanceMonitoring) {
                this.initPerformanceMonitoring();
            }

            // Load user preferences
            this.loadUserPreferences();

            // Apply theme
            this.applyTheme();

            console.log(`${this.name} v${this.version} initialized`);
            return this;
        },

        // Performance monitoring setup
        initPerformanceMonitoring() {
            // FPS monitoring disabled - causing console spam and performance issues
            // TODO: Implement throttled FPS monitoring that only logs significant drops
            return;
            
            /* DISABLED
            if (typeof window !== 'undefined' && window.performance) {
                // Monitor FPS
                let frameCount = 0;
                let lastTime = performance.now();
                
                const measureFPS = () => {
                    frameCount++;
                    const currentTime = performance.now();
                    
                    if (currentTime - lastTime >= 1000) {
                        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                        
                        if (fps < this.performance.targetFPS * 0.8) {
                            console.warn(`Low FPS detected: ${fps}fps`);
                        }
                        
                        frameCount = 0;
                        lastTime = currentTime;
                    }
                    
                    requestAnimationFrame(measureFPS);
                };
                
                requestAnimationFrame(measureFPS);
            }
            */

            if (typeof window !== 'undefined' && window.performance) {
                // Monitor memory usage
                if (performance.memory) {
                    setInterval(() => {
                        const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
                        if (memoryMB > this.performance.maxMemoryMB) {
                            console.warn(`High memory usage: ${memoryMB.toFixed(1)}MB`);
                        }
                    }, 5000);
                }
            }
        },

        // Load user preferences from localStorage
        loadUserPreferences() {
            if (typeof localStorage !== 'undefined') {
                try {
                    const preferences = localStorage.getItem(this.storage.prefix + this.storage.keys.userPreferences);
                    if (preferences) {
                        const parsed = JSON.parse(preferences);
                        Object.assign(this.features, parsed.features || {});
                        Object.assign(this.accessibility, parsed.accessibility || {});
                    }
                } catch (e) {
                    console.warn('Failed to load user preferences:', e);
                }
            }
        },

        // Apply current theme
        applyTheme() {
            if (typeof document !== 'undefined') {
                const theme = this.theme.schemes[this.theme.default];
                const root = document.documentElement;
                
                Object.entries(theme).forEach(([key, value]) => {
                    if (key !== 'name') {
                        root.style.setProperty(`--theme-${key}`, value);
                    }
                });
            }
        },

        // Save user preferences
        saveUserPreferences() {
            if (typeof localStorage !== 'undefined') {
                try {
                    const preferences = {
                        features: this.features,
                        accessibility: this.accessibility,
                        theme: this.theme.default
                    };
                    localStorage.setItem(
                        this.storage.prefix + this.storage.keys.userPreferences,
                        JSON.stringify(preferences)
                    );
                } catch (e) {
                    console.warn('Failed to save user preferences:', e);
                }
            }
        }
    };

    // Export to global scope
    if (typeof window !== 'undefined') {
        window.AppConfig = AppConfig;
    }

    // Export for Node.js environments
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AppConfig;
    }

})();