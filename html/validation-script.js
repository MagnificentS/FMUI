/**
 * FM-Base Comprehensive Validation Script
 * Performs thorough validation of all components, configurations, and integrations
 */

(function() {
    'use strict';

    const ValidationSuite = {
        results: {
            passed: 0,
            failed: 0,
            warnings: 0,
            tests: []
        },

        /**
         * Run all validation tests
         */
        async runValidation() {
            console.log('🔍 Starting FM-Base Comprehensive Validation...');
            console.log('='.repeat(60));

            const startTime = performance.now();

            // Core validation tests
            await this.validateEnvironment();
            await this.validateConfiguration();
            await this.validateCoreComponents();
            await this.validateCardSystem();
            await this.validateVisualizationSystem();
            await this.validateDataSystems();
            await this.validateLayoutSystem();
            await this.validatePerformance();
            await this.validateAccessibility();
            await this.validateBrowserCompatibility();

            const totalTime = performance.now() - startTime;

            console.log('='.repeat(60));
            console.log('📊 VALIDATION SUMMARY');
            console.log('='.repeat(60));
            console.log(`✅ Passed: ${this.results.passed}`);
            console.log(`❌ Failed: ${this.results.failed}`);
            console.log(`⚠️  Warnings: ${this.results.warnings}`);
            console.log(`⏱️  Total Time: ${totalTime.toFixed(2)}ms`);
            console.log('='.repeat(60));

            if (this.results.failed === 0) {
                console.log('🎉 ALL VALIDATIONS PASSED! FM-Base is ready for production.');
            } else {
                console.log('🔧 Some validations failed. Please check the details above.');
            }

            return {
                success: this.results.failed === 0,
                summary: this.results,
                totalTime
            };
        },

        /**
         * Validate browser environment
         */
        async validateEnvironment() {
            console.log('🌐 Validating Environment...');

            this.test('Window object exists', () => typeof window !== 'undefined');
            this.test('Document object exists', () => typeof document !== 'undefined');
            this.test('LocalStorage available', () => {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch (e) {
                    return false;
                }
            });
            this.test('Performance API available', () => typeof performance !== 'undefined');
            this.test('RequestAnimationFrame available', () => typeof requestAnimationFrame !== 'undefined');
            this.test('CSS Grid supported', () => CSS.supports('display', 'grid'));
            this.test('ES6 Features supported', () => {
                try {
                    eval('const test = () => {}; class Test {}; const {a} = {a: 1};');
                    return true;
                } catch (e) {
                    return false;
                }
            });
        },

        /**
         * Validate application configuration
         */
        async validateConfiguration() {
            console.log('⚙️  Validating Configuration...');

            this.test('AppConfig exists', () => typeof window.AppConfig !== 'undefined');
            
            if (window.AppConfig) {
                this.test('AppConfig has version', () => !!window.AppConfig.version);
                this.test('AppConfig has performance settings', () => !!window.AppConfig.performance);
                this.test('AppConfig has features', () => !!window.AppConfig.features);
                this.test('AppConfig has components config', () => !!window.AppConfig.components);
                this.test('AppConfig has grid config', () => !!window.AppConfig.grid);
                this.test('AppConfig has theme config', () => !!window.AppConfig.theme);
                this.test('AppConfig has cards config', () => !!window.AppConfig.cards);
                
                // Validate critical performance thresholds
                this.test('Performance target FPS is reasonable', () => 
                    window.AppConfig.performance.targetFPS >= 30 && window.AppConfig.performance.targetFPS <= 120);
                this.test('Memory limit is reasonable', () => 
                    window.AppConfig.performance.maxMemoryMB >= 50 && window.AppConfig.performance.maxMemoryMB <= 500);
                this.test('Init time limit is reasonable', () => 
                    window.AppConfig.performance.maxInitialLoadMs >= 1000 && window.AppConfig.performance.maxInitialLoadMs <= 10000);
            }
        },

        /**
         * Validate core components
         */
        async validateCoreComponents() {
            console.log('🔧 Validating Core Components...');

            const coreComponents = [
                { name: 'Utils', required: true },
                { name: 'StateManager', required: true },
                { name: 'DataPipeline', required: true },
                { name: 'DataBinding', required: true },
                { name: 'LayoutManager', required: true },
                { name: 'ResponsiveSystem', required: false },
                { name: 'AnimationController', required: false }
            ];

            coreComponents.forEach(({ name, required }) => {
                const exists = typeof window[name] !== 'undefined';
                if (required) {
                    this.test(`${name} component exists`, () => exists);
                } else {
                    this.testWarning(`${name} component exists`, () => exists);
                }

                if (exists && window[name]) {
                    // Check for common methods
                    if (window[name].init) {
                        this.test(`${name} has init method`, () => typeof window[name].init === 'function');
                    }
                    if (window[name].destroy) {
                        this.test(`${name} has destroy method`, () => typeof window[name].destroy === 'function');
                    }
                }
            });

            // Test StateManager functionality
            if (window.StateManager) {
                this.test('StateManager can set state', () => {
                    try {
                        window.StateManager.setState('test', 'value');
                        return true;
                    } catch (e) {
                        return false;
                    }
                });

                this.test('StateManager can get state', () => {
                    try {
                        return window.StateManager.getState('test') === 'value';
                    } catch (e) {
                        return false;
                    }
                });
            }
        },

        /**
         * Validate card system
         */
        async validateCardSystem() {
            console.log('🎴 Validating Card System...');

            this.test('CardRegistry exists', () => typeof window.CardRegistry !== 'undefined');
            this.test('CardManager exists', () => typeof window.CardManager !== 'undefined');
            this.test('CardEnhancer exists', () => typeof window.CardEnhancer !== 'undefined');

            if (window.CardRegistry) {
                this.test('CardRegistry has register method', () => 
                    typeof window.CardRegistry.register === 'function');
                this.test('CardRegistry has getRegisteredTypes method', () => 
                    typeof window.CardRegistry.getRegisteredTypes === 'function');

                // Check registered card types
                try {
                    const registeredTypes = window.CardRegistry.getRegisteredTypes();
                    this.test('Card types are registered', () => Array.isArray(registeredTypes) && registeredTypes.length > 0);
                    
                    console.log(`   📋 Registered card types: ${registeredTypes.join(', ')}`);

                    // Validate specific card modules
                    const expectedCards = [
                        'player-detail', 'squad-summary', 'tactical-overview',
                        'performance-dashboard', 'upcoming-fixtures', 'training-schedule',
                        'transfer-targets', 'financial-overview', 'league-table'
                    ];

                    expectedCards.forEach(cardType => {
                        this.testWarning(`${cardType} card is registered`, () => 
                            registeredTypes.includes(cardType));
                    });

                } catch (e) {
                    this.test('CardRegistry getRegisteredTypes works', () => false);
                }
            }

            // Test card module availability
            const cardModules = [
                'PlayerDetailCard', 'SquadSummaryCard', 'TacticalOverviewCard',
                'PerformanceDashboardCard', 'UpcomingFixturesCard', 'TrainingScheduleCard',
                'TransferTargetsCard', 'FinancialOverviewCard', 'LeagueTableCard',
                'PlayerListCard', 'TacticalShapeCard', 'TeamAnalysisCard',
                'TransferBudgetCard', 'MatchPreviewCard', 'InjuryReportCard'
            ];

            cardModules.forEach(module => {
                this.testWarning(`${module} module exists`, () => typeof window[module] !== 'undefined');
                
                if (window[module]) {
                    this.test(`${module} has render method`, () => 
                        typeof window[module].render === 'function');
                }
            });
        },

        /**
         * Validate visualization system
         */
        async validateVisualizationSystem() {
            console.log('📈 Validating Visualization System...');

            const vizComponents = ['AttributeCircle', 'BarChart', 'PizzaChart'];

            vizComponents.forEach(component => {
                this.test(`${component} exists`, () => typeof window[component] !== 'undefined');
                
                if (window[component]) {
                    // Check if it's a constructor function or has create method
                    this.test(`${component} is constructable or has create method`, () => 
                        typeof window[component] === 'function' || typeof window[component].create === 'function');
                }
            });

            // Test if we can create visualization instances
            if (window.AttributeCircle && typeof window.AttributeCircle === 'function') {
                this.test('AttributeCircle can be instantiated', () => {
                    try {
                        const container = document.createElement('div');
                        const circle = new window.AttributeCircle(container, {
                            data: [{ name: 'Test', value: 50 }],
                            size: 100
                        });
                        return true;
                    } catch (e) {
                        return false;
                    }
                });
            }
        },

        /**
         * Validate data systems
         */
        async validateDataSystems() {
            console.log('💾 Validating Data Systems...');

            if (window.DataPipeline) {
                this.test('DataPipeline has init method', () => 
                    typeof window.DataPipeline.init === 'function');
                this.test('DataPipeline has fetch method', () => 
                    typeof window.DataPipeline.fetch === 'function');
                this.test('DataPipeline has transform method', () => 
                    typeof window.DataPipeline.transform === 'function');
            }

            if (window.DataBinding) {
                this.test('DataBinding has bind method', () => 
                    typeof window.DataBinding.bind === 'function');
                this.test('DataBinding has init method', () => 
                    typeof window.DataBinding.init === 'function');
            }

            // Test state management
            if (window.StateManager) {
                this.test('StateManager can handle multiple state keys', () => {
                    try {
                        window.StateManager.setState('test1', 'value1');
                        window.StateManager.setState('test2', 'value2');
                        return window.StateManager.getState('test1') === 'value1' &&
                               window.StateManager.getState('test2') === 'value2';
                    } catch (e) {
                        return false;
                    }
                });

                this.test('StateManager can handle object values', () => {
                    try {
                        const testObj = { name: 'test', value: 123 };
                        window.StateManager.setState('testObj', testObj);
                        const retrieved = window.StateManager.getState('testObj');
                        return retrieved && retrieved.name === 'test' && retrieved.value === 123;
                    } catch (e) {
                        return false;
                    }
                });
            }
        },

        /**
         * Validate layout system
         */
        async validateLayoutSystem() {
            console.log('🎨 Validating Layout System...');

            if (window.LayoutManager) {
                this.test('LayoutManager has init method', () => 
                    typeof window.LayoutManager.init === 'function');
                this.test('LayoutManager has addCard method', () => 
                    typeof window.LayoutManager.addCard === 'function');
                this.test('LayoutManager has removeCard method', () => 
                    typeof window.LayoutManager.removeCard === 'function');
                this.test('LayoutManager has saveLayout method', () => 
                    typeof window.LayoutManager.saveLayout === 'function');
                this.test('LayoutManager has loadLayout method', () => 
                    typeof window.LayoutManager.loadLayout === 'function');
            }

            if (window.ResponsiveSystem) {
                this.test('ResponsiveSystem has init method', () => 
                    typeof window.ResponsiveSystem.init === 'function');
                this.test('ResponsiveSystem has getBreakpoint method', () => 
                    typeof window.ResponsiveSystem.getBreakpoint === 'function');
            }

            // Test CSS Grid setup
            this.test('CSS Grid variables are defined', () => {
                const rootStyle = getComputedStyle(document.documentElement);
                return rootStyle.getPropertyValue('--grid-columns').trim() !== '' &&
                       rootStyle.getPropertyValue('--grid-rows').trim() !== '';
            });
        },

        /**
         * Validate performance characteristics
         */
        async validatePerformance() {
            console.log('⚡ Validating Performance...');

            // Check if AppInitializer exists and has status
            if (window.AppInitializer) {
                this.test('AppInitializer exists', () => true);
                
                try {
                    const status = window.AppInitializer.getStatus();
                    
                    this.test('AppInitializer provides status', () => !!status);
                    
                    if (status.initTime) {
                        this.test('Initialization time under 3 seconds', () => status.initTime < 3000);
                        console.log(`   ⏱️  Initialization time: ${status.initTime.toFixed(2)}ms`);
                    }

                    if (status.loadedComponents) {
                        this.test('Components loaded successfully', () => status.loadedComponents.length > 0);
                        console.log(`   📦 Components loaded: ${status.loadedComponents.length}`);
                    }

                    if (status.failedComponents) {
                        this.test('No component failures', () => status.failedComponents.length === 0);
                        if (status.failedComponents.length > 0) {
                            console.log(`   ❌ Failed components: ${status.failedComponents.join(', ')}`);
                        }
                    }
                } catch (e) {
                    this.test('AppInitializer getStatus works', () => false);
                }
            }

            // Check memory usage if available
            if (performance.memory) {
                const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
                this.test('Memory usage under 150MB', () => memoryMB < 150);
                console.log(`   💾 Memory usage: ${memoryMB.toFixed(1)}MB`);
            }

            // Check for potential performance issues
            this.test('No excessive global variables', () => {
                const globalKeys = Object.keys(window).filter(key => 
                    key.startsWith('FM') || key.includes('Card') || key.includes('Manager'));
                return globalKeys.length < 50; // Reasonable limit
            });
        },

        /**
         * Validate accessibility features
         */
        async validateAccessibility() {
            console.log('♿ Validating Accessibility...');

            // Check for accessibility configurations
            if (window.AppConfig && window.AppConfig.accessibility) {
                this.test('Accessibility configuration exists', () => true);
                this.test('Keyboard navigation enabled', () => 
                    window.AppConfig.accessibility.keyboardNavigation === true);
                this.test('Focus indicators enabled', () => 
                    window.AppConfig.accessibility.focusIndicators === true);
            }

            // Check CSS for accessibility features
            this.test('Focus visible styles defined', () => {
                const styleSheets = Array.from(document.styleSheets);
                return styleSheets.some(sheet => {
                    try {
                        return Array.from(sheet.cssRules).some(rule => 
                            rule.selectorText && rule.selectorText.includes('focus-visible'));
                    } catch (e) {
                        return false;
                    }
                });
            });

            // Check for high contrast support
            this.test('High contrast support available', () => {
                return CSS.supports('(forced-colors: active)') || 
                       document.querySelector('meta[name="color-scheme"]') !== null;
            });

            // Check minimum click target size
            this.test('Minimum click target size configured', () => {
                return window.AppConfig && 
                       window.AppConfig.accessibility && 
                       window.AppConfig.accessibility.minimumClickTarget >= 44;
            });
        },

        /**
         * Validate browser compatibility
         */
        async validateBrowserCompatibility() {
            console.log('🌍 Validating Browser Compatibility...');

            const features = [
                { name: 'Fetch API', test: () => typeof fetch === 'function' },
                { name: 'Promise', test: () => typeof Promise === 'function' },
                { name: 'Arrow Functions', test: () => {
                    try { eval('(() => {})'); return true; } catch (e) { return false; }
                }},
                { name: 'Template Literals', test: () => {
                    try { eval('`test`'); return true; } catch (e) { return false; }
                }},
                { name: 'Destructuring', test: () => {
                    try { eval('const {a} = {a: 1}'); return true; } catch (e) { return false; }
                }},
                { name: 'Classes', test: () => {
                    try { eval('class Test {}'); return true; } catch (e) { return false; }
                }},
                { name: 'Modules', test: () => typeof Symbol !== 'undefined' },
                { name: 'Intersection Observer', test: () => typeof IntersectionObserver === 'function' },
                { name: 'Custom Elements', test: () => typeof customElements !== 'undefined' },
                { name: 'CSS Custom Properties', test: () => CSS.supports('color', 'var(--test)') }
            ];

            features.forEach(({ name, test }) => {
                this.testWarning(`${name} support`, test);
            });

            // Browser identification
            const userAgent = navigator.userAgent;
            console.log(`   🌐 User Agent: ${userAgent}`);
            console.log(`   🗣️  Language: ${navigator.language}`);
            console.log(`   💻 Platform: ${navigator.platform}`);
        },

        /**
         * Helper method to run a test
         */
        test(name, testFn, critical = true) {
            try {
                const result = testFn();
                if (result) {
                    console.log(`   ✅ ${name}`);
                    this.results.passed++;
                } else {
                    console.log(`   ❌ ${name}`);
                    this.results.failed++;
                }
                this.results.tests.push({ name, result, critical });
                return result;
            } catch (error) {
                console.log(`   ❌ ${name} (Error: ${error.message})`);
                this.results.failed++;
                this.results.tests.push({ name, result: false, critical, error: error.message });
                return false;
            }
        },

        /**
         * Helper method to run a warning test
         */
        testWarning(name, testFn) {
            try {
                const result = testFn();
                if (result) {
                    console.log(`   ✅ ${name}`);
                    this.results.passed++;
                } else {
                    console.log(`   ⚠️  ${name}`);
                    this.results.warnings++;
                }
                this.results.tests.push({ name, result, critical: false });
                return result;
            } catch (error) {
                console.log(`   ⚠️  ${name} (Error: ${error.message})`);
                this.results.warnings++;
                this.results.tests.push({ name, result: false, critical: false, error: error.message });
                return false;
            }
        }
    };

    // Export to global scope
    window.ValidationSuite = ValidationSuite;

    // Auto-run validation if in testing mode
    if (window.location.search.includes('validate=true')) {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ValidationSuite.runValidation(), 1000);
        });
    }

})();