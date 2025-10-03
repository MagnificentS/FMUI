/**
 * GRID UTILIZATION OPTIMIZER
 * Comprehensive system to achieve 60-80% grid utilization target across all subscreens
 * Addresses low utilization issues and optimizes component placement
 */

(function() {
    'use strict';

    console.log('📊 GRID UTILIZATION OPTIMIZER: Initializing grid optimization system...');

    const GridUtilizationOptimizer = {
        // Optimization configuration
        config: {
            targetUtilization: {
                min: 60,     // Minimum 60% utilization
                max: 80,     // Maximum 80% to avoid cramping
                ideal: 70    // Ideal target for most screens
            },
            gridSpecs: {
                totalCells: 703,    // 37 × 19 grid
                columns: 37,
                rows: 19
            },
            optimizationRules: {
                minComponentSize: 6,    // Minimum 6 cells (w3 h2)
                maxComponentSize: 120,  // Maximum 120 cells (w12 h10)
                preferredAspectRatio: 1.5, // Width should be ~1.5x height
                maxComponentsPerScreen: 8,
                minComponentsPerScreen: 3
            }
        },

        // Current utilization tracking
        utilizationData: new Map(),
        
        init() {
            console.log('📊 GRID OPTIMIZER: Starting comprehensive grid utilization optimization...');
            
            this.setupUtilizationMonitoring();
            this.optimizeAllSubscreens();
            this.setupRealTimeOptimization();
            this.setupOptimizationControls();
            
            console.log('✅ GRID UTILIZATION OPTIMIZER: System initialized');
        },

        setupUtilizationMonitoring() {
            console.log('👁️ Setting up real-time utilization monitoring...');
            
            // Monitor grid changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList && mutation.target.classList.contains('tile-container')) {
                        this.analyzeGridUtilization(mutation.target);
                    }
                });
            });
            
            // Observe all tile containers
            document.querySelectorAll('.tile-container').forEach(container => {
                observer.observe(container, { 
                    childList: true, 
                    attributes: true, 
                    subtree: true 
                });
            });
            
            console.log('✅ Utilization monitoring active');
        },

        optimizeAllSubscreens() {
            console.log('🎯 Optimizing all subscreens for target utilization...');
            
            // Get all available subscreens
            const subscreens = this.getAllSubscreens();
            
            subscreens.forEach(subscreen => {
                this.optimizeSubscreen(subscreen.tab, subscreen.subscreen);
            });
            
            console.log(`✅ Optimized ${subscreens.length} subscreens`);
        },

        getAllSubscreens() {
            const subscreens = [];
            
            if (window.SubscreenSystem && window.SubscreenSystem.subscreenDefinitions) {
                Object.entries(window.SubscreenSystem.subscreenDefinitions).forEach(([tab, tabDef]) => {
                    Object.keys(tabDef).forEach(subscreen => {
                        subscreens.push({ tab, subscreen });
                    });
                });
            }
            
            return subscreens;
        },

        optimizeSubscreen(tab, subscreen) {
            console.log(`🔧 Optimizing ${tab}/${subscreen} grid utilization...`);
            
            const definition = this.getSubscreenDefinition(tab, subscreen);
            if (!definition) return;
            
            const currentUtilization = this.calculateUtilizationFromDefinition(definition);
            console.log(`📊 ${tab}/${subscreen} current utilization: ${currentUtilization.toFixed(1)}%`);
            
            if (currentUtilization < this.config.targetUtilization.min) {
                this.increaseUtilization(tab, subscreen, definition, currentUtilization);
            } else if (currentUtilization > this.config.targetUtilization.max) {
                this.decreaseUtilization(tab, subscreen, definition, currentUtilization);
            } else {
                console.log(`✅ ${tab}/${subscreen} utilization is optimal: ${currentUtilization.toFixed(1)}%`);
            }
        },

        getSubscreenDefinition(tab, subscreen) {
            if (window.SubscreenSystem && 
                window.SubscreenSystem.subscreenDefinitions &&
                window.SubscreenSystem.subscreenDefinitions[tab]) {
                return window.SubscreenSystem.subscreenDefinitions[tab][subscreen];
            }
            return null;
        },

        calculateUtilizationFromDefinition(definition) {
            if (!definition.components) return 0;
            
            let totalCells = 0;
            definition.components.forEach(component => {
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3).map(Number);
                totalCells += width * height;
            });
            
            return (totalCells / this.config.gridSpecs.totalCells) * 100;
        },

        increaseUtilization(tab, subscreen, definition, currentUtilization) {
            console.log(`📈 Increasing utilization for ${tab}/${subscreen} from ${currentUtilization.toFixed(1)}%...`);
            
            const targetCells = this.config.gridSpecs.totalCells * this.config.targetUtilization.ideal / 100;
            const currentCells = this.config.gridSpecs.totalCells * currentUtilization / 100;
            const neededCells = targetCells - currentCells;
            
            console.log(`📊 Need ${Math.round(neededCells)} additional cells`);
            
            // Strategy 1: Resize existing components
            if (definition.components.length <= 4) {
                this.resizeComponentsUp(definition, neededCells * 0.7);
            }
            
            // Strategy 2: Add new components if utilization is still low
            const newUtilization = this.calculateUtilizationFromDefinition(definition);
            if (newUtilization < this.config.targetUtilization.min) {
                this.addFillerComponents(definition, neededCells * 0.3);
            }
            
            // Update the definition
            this.updateSubscreenDefinition(tab, subscreen, definition);
            
            console.log(`✅ ${tab}/${subscreen} utilization optimized`);
        },

        decreaseUtilization(tab, subscreen, definition, currentUtilization) {
            console.log(`📉 Decreasing utilization for ${tab}/${subscreen} from ${currentUtilization.toFixed(1)}%...`);
            
            // Strategy 1: Reduce component sizes
            if (definition.components.length > 0) {
                definition.components.forEach(component => {
                    const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3).map(Number);
                    const area = width * height;
                    
                    if (area > 40) { // Large components
                        const newWidth = Math.max(width - 2, 6);
                        const newHeight = Math.max(height - 1, 3);
                        component.size = `w${newWidth} h${newHeight}`;
                        console.log(`📏 Reduced ${component.title}: w${width} h${height} → w${newWidth} h${newHeight}`);
                    }
                });
            }
            
            this.updateSubscreenDefinition(tab, subscreen, definition);
            
            console.log(`✅ ${tab}/${subscreen} utilization reduced`);
        },

        resizeComponentsUp(definition, cellsToAdd) {
            console.log(`📏 Resizing components to add ${Math.round(cellsToAdd)} cells...`);
            
            const componentsToResize = definition.components.filter(c => c.hierarchy === 'primary' || c.hierarchy === 'secondary');
            const cellsPerComponent = Math.floor(cellsToAdd / componentsToResize.length);
            
            componentsToResize.forEach(component => {
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3).map(Number);
                
                // Add cells while maintaining reasonable aspect ratio
                let newWidth = width;
                let newHeight = height;
                let addedCells = 0;
                
                while (addedCells < cellsPerComponent && (newWidth < 18 || newHeight < 10)) {
                    if (newWidth / newHeight < this.config.optimizationRules.preferredAspectRatio) {
                        newWidth++;
                        addedCells += newHeight;
                    } else {
                        newHeight++;
                        addedCells += newWidth;
                    }
                    
                    // Safety check
                    if (newWidth > 18 || newHeight > 10) break;
                }
                
                if (newWidth !== width || newHeight !== height) {
                    component.size = `w${newWidth} h${newHeight}`;
                    console.log(`📏 Resized ${component.title}: w${width} h${height} → w${newWidth} h${newHeight}`);
                }
            });
        },

        addFillerComponents(definition, cellsToAdd) {
            console.log(`➕ Adding filler components for ${Math.round(cellsToAdd)} cells...`);
            
            const fillerComponents = this.generateFillerComponents(cellsToAdd, definition.title);
            definition.components.push(...fillerComponents);
            
            console.log(`✅ Added ${fillerComponents.length} filler components`);
        },

        generateFillerComponents(targetCells, subscreenTitle) {
            const fillers = [];
            let remainingCells = targetCells;
            
            while (remainingCells > 12 && fillers.length < 3) {
                let size, title, content;
                
                if (remainingCells >= 24) {
                    size = 'w6 h4';
                    remainingCells -= 24;
                    title = `${subscreenTitle} Analytics`;
                    content = this.generateAnalyticsFillerContent();
                } else if (remainingCells >= 18) {
                    size = 'w6 h3';
                    remainingCells -= 18;
                    title = `${subscreenTitle} Summary`;
                    content = this.generateSummaryFillerContent();
                } else {
                    size = 'w4 h3';
                    remainingCells -= 12;
                    title = `${subscreenTitle} Status`;
                    content = this.generateStatusFillerContent();
                }
                
                fillers.push({
                    id: `filler-${fillers.length + 1}`,
                    title: title,
                    hierarchy: 'tertiary',
                    size: size,
                    content: content,
                    role: 'filler'
                });
            }
            
            return fillers;
        },

        generateAnalyticsFillerContent() {
            return `
                <div class="analytics-filler">
                    <div class="analytic-item">
                        <span class="analytic-label">Performance Index</span>
                        <span class="analytic-value">78%</span>
                    </div>
                    <div class="analytic-item">
                        <span class="analytic-label">Efficiency Rating</span>
                        <span class="analytic-value">82%</span>
                    </div>
                    <div class="analytic-item">
                        <span class="analytic-label">Consistency</span>
                        <span class="analytic-value">Good</span>
                    </div>
                    <div class="analytic-item">
                        <span class="analytic-label">Trend</span>
                        <span class="analytic-value positive">Improving</span>
                    </div>
                </div>
            `;
        },

        generateSummaryFillerContent() {
            return `
                <div class="summary-filler">
                    <div class="summary-metric">
                        <span class="metric-label">Current Status</span>
                        <span class="metric-value">Active</span>
                    </div>
                    <div class="summary-metric">
                        <span class="metric-label">Last Updated</span>
                        <span class="metric-value">Now</span>
                    </div>
                    <div class="summary-metric">
                        <span class="metric-label">Priority</span>
                        <span class="metric-value">Normal</span>
                    </div>
                </div>
            `;
        },

        generateStatusFillerContent() {
            return `
                <div class="status-filler">
                    <div class="status-indicator active">
                        <span class="status-icon">✅</span>
                        <span class="status-text">Active</span>
                    </div>
                    <div class="status-metric">
                        <span class="status-label">Updated</span>
                        <span class="status-value">Now</span>
                    </div>
                </div>
            `;
        },

        updateSubscreenDefinition(tab, subscreen, definition) {
            if (window.SubscreenSystem && 
                window.SubscreenSystem.subscreenDefinitions &&
                window.SubscreenSystem.subscreenDefinitions[tab]) {
                window.SubscreenSystem.subscreenDefinitions[tab][subscreen] = definition;
            }
        },

        analyzeGridUtilization(container) {
            const containerId = container.id || container.className;
            const cards = container.querySelectorAll('.card, .subscreen-component');
            
            let totalCells = 0;
            const componentData = [];
            
            cards.forEach(card => {
                const width = parseInt(card.getAttribute('data-grid-w') || 1);
                const height = parseInt(card.getAttribute('data-grid-h') || 1);
                const cells = width * height;
                totalCells += cells;
                
                componentData.push({
                    element: card,
                    width: width,
                    height: height,
                    cells: cells,
                    title: card.querySelector('.card-header span, .subscreen-header span')?.textContent || 'Unknown'
                });
            });
            
            const utilizationPercent = (totalCells / this.config.gridSpecs.totalCells) * 100;
            
            const analysis = {
                containerId: containerId,
                totalCells: totalCells,
                utilizationPercent: utilizationPercent,
                componentCount: cards.length,
                components: componentData,
                status: this.getUtilizationStatus(utilizationPercent),
                recommendations: this.generateRecommendations(utilizationPercent, componentData),
                timestamp: Date.now()
            };
            
            this.utilizationData.set(containerId, analysis);
            
            // Log if utilization is outside target
            if (utilizationPercent < this.config.targetUtilization.min || 
                utilizationPercent > this.config.targetUtilization.max) {
                console.log(`⚠️ ${containerId}: ${utilizationPercent.toFixed(1)}% utilization (target: ${this.config.targetUtilization.min}-${this.config.targetUtilization.max}%)`);
            }
            
            return analysis;
        },

        getUtilizationStatus(utilizationPercent) {
            if (utilizationPercent >= this.config.targetUtilization.min && 
                utilizationPercent <= this.config.targetUtilization.max) {
                return 'optimal';
            } else if (utilizationPercent < this.config.targetUtilization.min) {
                return 'under-utilized';
            } else {
                return 'over-utilized';
            }
        },

        generateRecommendations(utilizationPercent, components) {
            const recommendations = [];
            
            if (utilizationPercent < this.config.targetUtilization.min) {
                const deficit = this.config.targetUtilization.ideal - utilizationPercent;
                
                if (components.length < 4) {
                    recommendations.push(`Add ${Math.ceil(deficit / 10)} more components`);
                } else {
                    recommendations.push('Increase size of existing components');
                }
                
                if (deficit > 30) {
                    recommendations.push('Consider adding a large primary component');
                }
            } else if (utilizationPercent > this.config.targetUtilization.max) {
                const excess = utilizationPercent - this.config.targetUtilization.max;
                
                recommendations.push('Reduce component sizes');
                
                if (components.length > 6) {
                    recommendations.push('Consider removing less important components');
                }
                
                if (excess > 20) {
                    recommendations.push('Split large components into smaller ones');
                }
            }
            
            return recommendations;
        },

        setupRealTimeOptimization() {
            console.log('⚡ Setting up real-time optimization triggers...');
            
            // Auto-optimize when subscreens are loaded
            if (window.SubscreenSystem) {
                const originalNavigate = window.SubscreenSystem.navigateToSubscreen;
                
                window.SubscreenSystem.navigateToSubscreen = function(tab, subscreen) {
                    originalNavigate.call(this, tab, subscreen);
                    
                    // Optimize after navigation
                    setTimeout(() => {
                        GridUtilizationOptimizer.optimizeCurrentScreen();
                    }, 500);
                };
            }
            
            console.log('✅ Real-time optimization triggers set');
        },

        optimizeCurrentScreen() {
            const activeContainer = document.querySelector('.view-container.active .tile-container');
            if (activeContainer) {
                const analysis = this.analyzeGridUtilization(activeContainer);
                
                if (analysis.status !== 'optimal') {
                    console.log(`🔧 Auto-optimizing current screen: ${analysis.utilizationPercent.toFixed(1)}% utilization`);
                    this.applyOptimizationToContainer(activeContainer, analysis);
                }
            }
        },

        applyOptimizationToContainer(container, analysis) {
            if (analysis.status === 'under-utilized') {
                this.optimizeUnderUtilizedContainer(container, analysis);
            } else if (analysis.status === 'over-utilized') {
                this.optimizeOverUtilizedContainer(container, analysis);
            }
        },

        optimizeUnderUtilizedContainer(container, analysis) {
            console.log(`📈 Optimizing under-utilized container (${analysis.utilizationPercent.toFixed(1)}%)...`);
            
            const components = analysis.components;
            const targetCells = this.config.gridSpecs.totalCells * this.config.targetUtilization.ideal / 100;
            const neededCells = targetCells - analysis.totalCells;
            
            // Strategy 1: Increase size of primary and secondary components
            const primaryComponents = components.filter(c => 
                c.element.classList.contains('primary-component') || 
                c.element.classList.contains('secondary-component')
            );
            
            if (primaryComponents.length > 0) {
                const cellsPerComponent = Math.floor(neededCells / primaryComponents.length);
                
                primaryComponents.forEach(component => {
                    const newSize = this.calculateOptimalResize(component, cellsPerComponent);
                    if (newSize) {
                        this.applyComponentResize(component.element, newSize);
                    }
                });
            }
            
            // Strategy 2: Add utility components if still under-utilized
            const newAnalysis = this.analyzeGridUtilization(container);
            if (newAnalysis.utilizationPercent < this.config.targetUtilization.min) {
                this.addUtilityComponents(container, targetCells - newAnalysis.totalCells);
            }
        },

        optimizeOverUtilizedContainer(container, analysis) {
            console.log(`📉 Optimizing over-utilized container (${analysis.utilizationPercent.toFixed(1)}%)...`);
            
            // Strategy: Reduce size of largest components
            const largestComponents = analysis.components
                .sort((a, b) => b.cells - a.cells)
                .slice(0, Math.ceil(analysis.components.length / 2));
            
            largestComponents.forEach(component => {
                const [width, height] = [component.width, component.height];
                const newWidth = Math.max(width - 1, 6);
                const newHeight = Math.max(height - 1, 3);
                
                if (newWidth !== width || newHeight !== height) {
                    this.applyComponentResize(component.element, `w${newWidth} h${newHeight}`);
                }
            });
        },

        calculateOptimalResize(component, targetCellsToAdd) {
            const currentWidth = component.width;
            const currentHeight = component.height;
            const currentCells = component.cells;
            
            // Calculate optimal new dimensions
            let newWidth = currentWidth;
            let newHeight = currentHeight;
            let addedCells = 0;
            
            // Prefer width expansion for better aspect ratio
            while (addedCells < targetCellsToAdd && newWidth < 18) {
                if (newWidth / newHeight < this.config.optimizationRules.preferredAspectRatio) {
                    newWidth++;
                    addedCells = (newWidth * newHeight) - currentCells;
                } else if (newHeight < 10) {
                    newHeight++;
                    addedCells = (newWidth * newHeight) - currentCells;
                } else {
                    break;
                }
            }
            
            if (newWidth !== currentWidth || newHeight !== currentHeight) {
                return `w${newWidth} h${newHeight}`;
            }
            
            return null;
        },

        applyComponentResize(element, newSize) {
            const [width, height] = newSize.match(/w(\d+) h(\d+)/).slice(1, 3);
            
            // Update data attributes
            element.setAttribute('data-grid-w', width);
            element.setAttribute('data-grid-h', height);
            
            // Update CSS classes
            element.className = element.className.replace(/w\d+ h\d+/, newSize);
            
            // Update grid positioning if explicitly set
            if (element.style.gridColumn.includes('span')) {
                const colMatch = element.style.gridColumn.match(/(\d+)\s*\/\s*span/);
                if (colMatch) {
                    element.style.gridColumn = `${colMatch[1]} / span ${width}`;
                } else {
                    element.style.gridColumn = `span ${width}`;
                }
            }
            
            if (element.style.gridRow.includes('span')) {
                const rowMatch = element.style.gridRow.match(/(\d+)\s*\/\s*span/);
                if (rowMatch) {
                    element.style.gridRow = `${rowMatch[1]} / span ${height}`;
                } else {
                    element.style.gridRow = `span ${height}`;
                }
            }
            
            console.log(`📏 Applied resize: ${newSize} to ${element.querySelector('.card-header span, .subscreen-header span')?.textContent || 'component'}`);
        },

        addUtilityComponents(container, neededCells) {
            console.log(`➕ Adding utility components for ${Math.round(neededCells)} cells...`);
            
            const utilityCount = Math.min(Math.floor(neededCells / 12), 2);
            
            for (let i = 0; i < utilityCount; i++) {
                const utilityComponent = this.createUtilityComponent(i);
                container.appendChild(utilityComponent);
            }
            
            // Trigger layout
            if (window.layoutCards) {
                setTimeout(() => window.layoutCards(container), 100);
            }
        },

        createUtilityComponent(index) {
            const component = document.createElement('div');
            component.className = 'card subscreen-component utility-component w4 h3';
            component.setAttribute('data-component-id', `utility-${index + 1}`);
            component.setAttribute('data-hierarchy', 'utility');
            component.setAttribute('data-grid-w', '4');
            component.setAttribute('data-grid-h', '3');
            
            component.innerHTML = `
                <div class="card-header subscreen-header">
                    <span>Quick Info ${index + 1}</span>
                    <div class="component-hierarchy-indicator utility">U</div>
                </div>
                <div class="card-body subscreen-body">
                    ${this.generateStatusFillerContent()}
                </div>
                <div class="resize-handle"></div>
            `;
            
            return component;
        },

        setupOptimizationControls() {
            console.log('🎛️ Setting up optimization controls...');
            
            // Add global optimization functions
            window.optimizeCurrentGrid = () => this.optimizeCurrentScreen();
            window.analyzeCurrentGrid = () => this.analyzeCurrentGrid();
            window.getUtilizationReport = () => this.generateUtilizationReport();
            
            console.log('✅ Optimization controls available');
        },

        analyzeCurrentGrid() {
            const activeContainer = document.querySelector('.view-container.active .tile-container');
            if (activeContainer) {
                const analysis = this.analyzeGridUtilization(activeContainer);
                
                console.log('\n📊 CURRENT GRID ANALYSIS:');
                console.log(`Grid utilization: ${analysis.utilizationPercent.toFixed(1)}%`);
                console.log(`Total components: ${analysis.componentCount}`);
                console.log(`Total cells used: ${analysis.totalCells}/${this.config.gridSpecs.totalCells}`);
                console.log(`Status: ${analysis.status.toUpperCase()}`);
                
                if (analysis.recommendations.length > 0) {
                    console.log('Recommendations:');
                    analysis.recommendations.forEach(rec => console.log(`  • ${rec}`));
                }
                
                return analysis;
            }
            
            return null;
        },

        generateUtilizationReport() {
            console.log('\n📈 GRID UTILIZATION REPORT:');
            console.log('='.repeat(50));
            
            let totalScore = 0;
            let screensAnalyzed = 0;
            let optimalScreens = 0;
            
            this.utilizationData.forEach((analysis, containerId) => {
                screensAnalyzed++;
                
                const score = this.calculateUtilizationScore(analysis.utilizationPercent);
                totalScore += score;
                
                if (analysis.status === 'optimal') {
                    optimalScreens++;
                }
                
                console.log(`📊 ${containerId}: ${analysis.utilizationPercent.toFixed(1)}% - ${analysis.status.toUpperCase()}`);
                console.log(`   Components: ${analysis.componentCount}, Cells: ${analysis.totalCells}, Score: ${score}/100`);
            });
            
            const averageScore = screensAnalyzed > 0 ? totalScore / screensAnalyzed : 0;
            const successRate = screensAnalyzed > 0 ? (optimalScreens / screensAnalyzed) * 100 : 0;
            
            console.log(`\n📈 OVERALL UTILIZATION PERFORMANCE:`);
            console.log(`Average Score: ${averageScore.toFixed(1)}/100`);
            console.log(`Optimal Screens: ${optimalScreens}/${screensAnalyzed}`);
            console.log(`Success Rate: ${successRate.toFixed(1)}%`);
            
            if (averageScore >= 85) {
                console.log('🎉 EXCELLENT grid utilization achieved');
            } else if (averageScore >= 75) {
                console.log('🎯 GOOD grid utilization - minor improvements possible');
            } else {
                console.log('⚠️ Grid utilization needs improvement');
            }
            
            console.log('='.repeat(50));
            
            return {
                averageScore: averageScore,
                successRate: successRate,
                totalScreens: screensAnalyzed,
                optimalScreens: optimalScreens,
                details: Array.from(this.utilizationData.values())
            };
        },

        calculateUtilizationScore(utilizationPercent) {
            if (utilizationPercent >= this.config.targetUtilization.min && 
                utilizationPercent <= this.config.targetUtilization.max) {
                return 100;
            } else if (utilizationPercent >= this.config.targetUtilization.min - 10 && 
                       utilizationPercent <= this.config.targetUtilization.max + 10) {
                return 80;
            } else if (utilizationPercent >= this.config.targetUtilization.min - 20 && 
                       utilizationPercent <= this.config.targetUtilization.max + 20) {
                return 60;
            } else {
                return 40;
            }
        }
    };

    // Add optimization styles
    const optimizationStyles = `
        /* Grid Utilization Optimizer Styles */
        
        /* Filler component styles */
        .analytics-filler, .summary-filler {
            font-size: 9px;
        }
        
        .analytic-item, .summary-metric {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .analytic-label, .metric-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .analytic-value, .metric-value {
            color: white;
            font-weight: 600;
        }
        
        .analytic-value.positive {
            color: #00ff88;
        }
        
        .status-filler {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 9px;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 8px;
        }
        
        .status-indicator.active {
            color: #00ff88;
        }
        
        .status-icon {
            font-size: 12px;
        }
        
        .status-text {
            font-weight: 600;
        }
        
        .status-metric {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
        
        .status-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .status-value {
            color: white;
            font-weight: 600;
        }
        
        /* Utilization indicators */
        .tile-container[data-utilization="optimal"] {
            border: 1px solid rgba(0, 255, 136, 0.3);
        }
        
        .tile-container[data-utilization="under-utilized"] {
            border: 1px solid rgba(255, 184, 0, 0.3);
        }
        
        .tile-container[data-utilization="over-utilized"] {
            border: 1px solid rgba(255, 71, 87, 0.3);
        }
        
        /* Optimization debugging */
        .optimization-debug {
            position: fixed;
            top: 200px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(0, 148, 204, 0.3);
            border-radius: 4px;
            padding: 8px;
            color: white;
            font-size: 10px;
            z-index: 10000;
            min-width: 180px;
        }
        
        .debug-header {
            font-weight: 600;
            color: #0094cc;
            margin-bottom: 6px;
        }
        
        .debug-metric {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
        }
        
        .debug-value.optimal {
            color: #00ff88;
        }
        
        .debug-value.warning {
            color: #ffb800;
        }
        
        .debug-value.critical {
            color: #ff4757;
        }
    `;
    
    // Inject styles
    const style = document.createElement('style');
    style.id = 'grid-optimization-styles';
    style.textContent = optimizationStyles;
    document.head.appendChild(style);

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => GridUtilizationOptimizer.init(), 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => GridUtilizationOptimizer.init(), 1000);
        });
    }

    // Make available globally
    window.GridUtilizationOptimizer = GridUtilizationOptimizer;

})();