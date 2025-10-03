/**
 * COMPONENT HIERARCHY FRAMEWORK
 * Comprehensive system for managing visual hierarchy, information density, and component priorities
 * Works with the Subscreen System to ensure proper UX structure
 */

(function() {
    'use strict';

    console.log('📊 COMPONENT HIERARCHY: Initializing visual hierarchy and information density framework...');

    const ComponentHierarchy = {
        // Enhanced hierarchy definitions with detailed specifications
        hierarchySpecs: {
            primary: {
                name: 'Primary Focus',
                description: 'Main content that users focus on first',
                sizing: {
                    minWidth: 12,
                    minHeight: 6,
                    maxWidth: 18,
                    maxHeight: 10,
                    defaultSize: 'w14 h8'
                },
                styling: {
                    borderColor: '#0094cc',
                    borderWidth: '4px',
                    backgroundColor: 'rgba(0, 148, 204, 0.05)',
                    priority: 1
                },
                contentGuidelines: {
                    maxInfoItems: 8,
                    minInfoItems: 4,
                    allowCharts: true,
                    allowInteractions: true,
                    textSize: 'medium'
                },
                positioning: {
                    preferredZones: ['top-left', 'center-left', 'top-center'],
                    avoidZones: ['bottom-right'],
                    snapToGrid: true
                }
            },
            secondary: {
                name: 'Supporting Information',
                description: 'Important supporting content that complements primary focus',
                sizing: {
                    minWidth: 8,
                    minHeight: 4,
                    maxWidth: 12,
                    maxHeight: 8,
                    defaultSize: 'w10 h6'
                },
                styling: {
                    borderColor: '#00ff88',
                    borderWidth: '3px',
                    backgroundColor: 'rgba(0, 255, 136, 0.03)',
                    priority: 2
                },
                contentGuidelines: {
                    maxInfoItems: 6,
                    minInfoItems: 3,
                    allowCharts: true,
                    allowInteractions: true,
                    textSize: 'medium'
                },
                positioning: {
                    preferredZones: ['top-right', 'center-right', 'center'],
                    avoidZones: [],
                    snapToGrid: true
                }
            },
            tertiary: {
                name: 'Detail Information',
                description: 'Detailed information that provides context and additional data',
                sizing: {
                    minWidth: 6,
                    minHeight: 3,
                    maxWidth: 8,
                    maxHeight: 6,
                    defaultSize: 'w6 h4'
                },
                styling: {
                    borderColor: '#ffb800',
                    borderWidth: '2px',
                    backgroundColor: 'rgba(255, 184, 0, 0.02)',
                    priority: 3
                },
                contentGuidelines: {
                    maxInfoItems: 5,
                    minInfoItems: 2,
                    allowCharts: false,
                    allowInteractions: true,
                    textSize: 'small'
                },
                positioning: {
                    preferredZones: ['bottom-left', 'bottom-center', 'side-panels'],
                    avoidZones: ['top-center'],
                    snapToGrid: true
                }
            },
            utility: {
                name: 'Quick Actions',
                description: 'Small utility components for quick actions and status indicators',
                sizing: {
                    minWidth: 4,
                    minHeight: 2,
                    maxWidth: 6,
                    maxHeight: 4,
                    defaultSize: 'w4 h3'
                },
                styling: {
                    borderColor: '#ff6b35',
                    borderWidth: '1px',
                    backgroundColor: 'rgba(255, 107, 53, 0.02)',
                    priority: 4
                },
                contentGuidelines: {
                    maxInfoItems: 3,
                    minInfoItems: 1,
                    allowCharts: false,
                    allowInteractions: true,
                    textSize: 'small'
                },
                positioning: {
                    preferredZones: ['corners', 'edge-spaces'],
                    avoidZones: ['center'],
                    snapToGrid: true
                }
            }
        },

        // Information density management
        densityRules: {
            maxTotalItems: 30,      // Maximum information items across all components in a subscreen
            idealTotalItems: 20,    // Ideal total for good cognitive load
            minTotalItems: 8,       // Minimum to avoid feeling empty
            
            // Rules per component hierarchy
            densityLimits: {
                primary: { min: 4, max: 8, ideal: 6 },
                secondary: { min: 3, max: 6, ideal: 4 },
                tertiary: { min: 2, max: 5, ideal: 3 },
                utility: { min: 1, max: 3, ideal: 2 }
            }
        },

        // Visual layout zones for optimal component placement
        layoutZones: {
            'top-left': { 
                priority: 1, 
                rect: { x: 1, y: 1, width: 15, height: 8 },
                description: 'Prime attention area - ideal for primary components'
            },
            'top-center': { 
                priority: 2, 
                rect: { x: 16, y: 1, width: 12, height: 8 },
                description: 'Central focus area - good for primary or secondary'
            },
            'top-right': { 
                priority: 3, 
                rect: { x: 28, y: 1, width: 10, height: 8 },
                description: 'Secondary attention area'
            },
            'center-left': { 
                priority: 4, 
                rect: { x: 1, y: 9, width: 15, height: 6 },
                description: 'Good for secondary components'
            },
            'center': { 
                priority: 5, 
                rect: { x: 16, y: 9, width: 12, height: 6 },
                description: 'Balanced area for secondary components'
            },
            'center-right': { 
                priority: 6, 
                rect: { x: 28, y: 9, width: 10, height: 6 },
                description: 'Secondary support area'
            },
            'bottom-left': { 
                priority: 7, 
                rect: { x: 1, y: 15, width: 12, height: 5 },
                description: 'Good for tertiary components'
            },
            'bottom-center': { 
                priority: 8, 
                rect: { x: 13, y: 15, width: 12, height: 5 },
                description: 'Tertiary information area'
            },
            'bottom-right': { 
                priority: 9, 
                rect: { x: 25, y: 15, width: 13, height: 5 },
                description: 'Least prominent area - utility components'
            }
        },

        init() {
            console.log('📊 COMPONENT HIERARCHY: Setting up visual hierarchy framework...');
            
            this.setupHierarchyStyles();
            this.setupLayoutValidation();
            this.setupContentDensityManagement();
            this.setupHierarchyMetrics();
            
            console.log('✅ COMPONENT HIERARCHY: Framework initialized');
        },

        setupHierarchyStyles() {
            console.log('🎨 Setting up hierarchy visual styles...');
            
            const hierarchyCSS = `
                /* Component Hierarchy Visual Framework */
                
                /* Primary Components - Main Focus */
                .primary-component {
                    border-left: 4px solid #0094cc !important;
                    background: linear-gradient(135deg, 
                        rgba(0, 148, 204, 0.05) 0%, 
                        rgba(0, 148, 204, 0.02) 100%) !important;
                    box-shadow: 0 4px 16px rgba(0, 148, 204, 0.1) !important;
                    position: relative;
                }
                
                .primary-component::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #0094cc, transparent);
                    opacity: 0.6;
                }
                
                .primary-component .subscreen-header {
                    background: linear-gradient(135deg, 
                        rgba(0, 148, 204, 0.1) 0%, 
                        rgba(0, 148, 204, 0.05) 100%) !important;
                    border-bottom: 2px solid rgba(0, 148, 204, 0.2) !important;
                }
                
                .primary-component .subscreen-header span {
                    color: #0094cc !important;
                    font-weight: 700 !important;
                    font-size: 13px !important;
                }
                
                /* Secondary Components - Supporting */
                .secondary-component {
                    border-left: 3px solid #00ff88 !important;
                    background: linear-gradient(135deg, 
                        rgba(0, 255, 136, 0.03) 0%, 
                        rgba(0, 255, 136, 0.01) 100%) !important;
                    box-shadow: 0 3px 12px rgba(0, 255, 136, 0.08) !important;
                }
                
                .secondary-component .subscreen-header {
                    background: rgba(0, 255, 136, 0.05) !important;
                    border-bottom: 1px solid rgba(0, 255, 136, 0.15) !important;
                }
                
                .secondary-component .subscreen-header span {
                    color: #00ff88 !important;
                    font-weight: 600 !important;
                    font-size: 12px !important;
                }
                
                /* Tertiary Components - Details */
                .tertiary-component {
                    border-left: 2px solid #ffb800 !important;
                    background: linear-gradient(135deg, 
                        rgba(255, 184, 0, 0.02) 0%, 
                        rgba(255, 184, 0, 0.005) 100%) !important;
                    box-shadow: 0 2px 8px rgba(255, 184, 0, 0.06) !important;
                }
                
                .tertiary-component .subscreen-header {
                    background: rgba(255, 184, 0, 0.03) !important;
                    border-bottom: 1px solid rgba(255, 184, 0, 0.1) !important;
                }
                
                .tertiary-component .subscreen-header span {
                    color: #ffb800 !important;
                    font-weight: 500 !important;
                    font-size: 11px !important;
                }
                
                /* Utility Components - Quick Actions */
                .utility-component {
                    border-left: 1px solid #ff6b35 !important;
                    background: linear-gradient(135deg, 
                        rgba(255, 107, 53, 0.02) 0%, 
                        rgba(255, 107, 53, 0.005) 100%) !important;
                    box-shadow: 0 1px 4px rgba(255, 107, 53, 0.04) !important;
                }
                
                .utility-component .subscreen-header {
                    background: rgba(255, 107, 53, 0.02) !important;
                    border-bottom: 1px solid rgba(255, 107, 53, 0.08) !important;
                    height: 28px !important;
                    padding: 4px 8px !important;
                }
                
                .utility-component .subscreen-header span {
                    color: #ff6b35 !important;
                    font-weight: 500 !important;
                    font-size: 10px !important;
                }
                
                /* Hierarchy Indicators */
                .component-hierarchy-indicator {
                    font-size: 8px !important;
                    width: 16px !important;
                    height: 16px !important;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                }
                
                /* Content Density Indicators */
                .density-optimal {
                    border-right: 2px solid rgba(0, 255, 136, 0.5) !important;
                }
                
                .density-high {
                    border-right: 2px solid rgba(255, 184, 0, 0.7) !important;
                }
                
                .density-low {
                    border-right: 2px solid rgba(255, 107, 53, 0.5) !important;
                }
                
                /* Hover effects maintain hierarchy */
                .primary-component:hover {
                    box-shadow: 0 8px 24px rgba(0, 148, 204, 0.2) !important;
                    transform: translateY(-3px) !important;
                }
                
                .secondary-component:hover {
                    box-shadow: 0 6px 18px rgba(0, 255, 136, 0.15) !important;
                    transform: translateY(-2px) !important;
                }
                
                .tertiary-component:hover {
                    box-shadow: 0 4px 12px rgba(255, 184, 0, 0.12) !important;
                    transform: translateY(-1px) !important;
                }
                
                .utility-component:hover {
                    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.08) !important;
                    transform: translateY(-1px) !important;
                }
                
                /* Content styling based on hierarchy */
                .primary-component .subscreen-body {
                    font-size: 12px !important;
                    line-height: 1.4 !important;
                }
                
                .secondary-component .subscreen-body {
                    font-size: 11px !important;
                    line-height: 1.3 !important;
                }
                
                .tertiary-component .subscreen-body {
                    font-size: 10px !important;
                    line-height: 1.2 !important;
                }
                
                .utility-component .subscreen-body {
                    font-size: 9px !important;
                    line-height: 1.1 !important;
                    padding: 8px !important;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'component-hierarchy-styles';
            style.textContent = hierarchyCSS;
            document.head.appendChild(style);
            
            console.log('✅ Hierarchy visual styles applied');
        },

        setupLayoutValidation() {
            console.log('📐 Setting up layout zone validation...');
            
            // Create layout validation function
            window.validateComponentLayout = (components) => {
                return this.validateComponentPlacement(components);
            };
            
            // Create layout optimization function
            window.optimizeComponentLayout = (components) => {
                return this.optimizeLayout(components);
            };
            
            console.log('✅ Layout validation system ready');
        },

        validateComponentPlacement(components) {
            const validation = {
                score: 0,
                issues: [],
                recommendations: [],
                zoneUtilization: {}
            };
            
            let primaryInOptimalZone = false;
            let hierarchyScore = 0;
            
            components.forEach(component => {
                const hierarchy = component.getAttribute('data-hierarchy');
                const position = this.getComponentPosition(component);
                const zone = this.getZoneForPosition(position);
                
                if (hierarchy === 'primary' && ['top-left', 'top-center'].includes(zone)) {
                    primaryInOptimalZone = true;
                    hierarchyScore += 30;
                } else if (hierarchy === 'secondary' && ['top-right', 'center-left', 'center'].includes(zone)) {
                    hierarchyScore += 20;
                } else if (hierarchy === 'tertiary' && ['bottom-left', 'bottom-center'].includes(zone)) {
                    hierarchyScore += 15;
                } else if (hierarchy === 'utility' && zone === 'bottom-right') {
                    hierarchyScore += 10;
                }
            });
            
            if (!primaryInOptimalZone) {
                validation.issues.push('Primary component not in optimal attention zone');
                validation.recommendations.push('Move primary component to top-left or top-center');
            }
            
            validation.score = Math.min(100, hierarchyScore);
            return validation;
        },

        setupContentDensityManagement() {
            console.log('📋 Setting up content density management...');
            
            // Create density monitoring function
            window.monitorContentDensity = () => {
                return this.analyzeContentDensity();
            };
            
            // Create density optimization function
            window.optimizeContentDensity = () => {
                this.optimizeInformationDensity();
            };
            
            console.log('✅ Content density management ready');
        },

        analyzeContentDensity() {
            const analysis = {
                totalItems: 0,
                componentDensities: {},
                densityScore: 0,
                recommendations: []
            };
            
            document.querySelectorAll('.subscreen-component').forEach(component => {
                const hierarchy = component.getAttribute('data-hierarchy');
                const infoElements = component.querySelectorAll('.stat-row, .stat-item, .match-info, .info-item').length;
                
                analysis.totalItems += infoElements;
                analysis.componentDensities[component.getAttribute('data-component-id')] = {
                    hierarchy: hierarchy,
                    items: infoElements,
                    limit: this.densityRules.densityLimits[hierarchy]
                };
                
                // Add density indicator classes
                const limits = this.densityRules.densityLimits[hierarchy];
                component.classList.remove('density-optimal', 'density-high', 'density-low');
                
                if (infoElements >= limits.min && infoElements <= limits.max) {
                    component.classList.add('density-optimal');
                } else if (infoElements > limits.max) {
                    component.classList.add('density-high');
                    analysis.recommendations.push(`Reduce content in ${component.getAttribute('data-component-id')} (${infoElements}>${limits.max})`);
                } else if (infoElements < limits.min) {
                    component.classList.add('density-low');
                    analysis.recommendations.push(`Add content to ${component.getAttribute('data-component-id')} (${infoElements}<${limits.min})`);
                }
            });
            
            // Calculate overall density score
            if (analysis.totalItems >= this.densityRules.minTotalItems && 
                analysis.totalItems <= this.densityRules.maxTotalItems) {
                analysis.densityScore = 100;
            } else if (analysis.totalItems > this.densityRules.maxTotalItems) {
                analysis.densityScore = Math.max(0, 100 - (analysis.totalItems - this.densityRules.maxTotalItems) * 5);
            } else {
                analysis.densityScore = Math.max(0, (analysis.totalItems / this.densityRules.minTotalItems) * 100);
            }
            
            return analysis;
        },

        setupHierarchyMetrics() {
            console.log('📊 Setting up hierarchy performance metrics...');
            
            // Create metrics collection system
            this.hierarchyMetrics = {
                attentionFlow: [],
                usagePatterns: {},
                effectivenessScores: {},
                lastUpdate: Date.now()
            };
            
            // Track component interactions for hierarchy effectiveness
            document.addEventListener('click', (e) => {
                const component = e.target.closest('.subscreen-component');
                if (component) {
                    this.recordComponentInteraction(component);
                }
            });
            
            console.log('✅ Hierarchy metrics system active');
        },

        recordComponentInteraction(component) {
            const hierarchy = component.getAttribute('data-hierarchy');
            const componentId = component.getAttribute('data-component-id');
            const timestamp = Date.now();
            
            // Record attention flow
            this.hierarchyMetrics.attentionFlow.push({
                componentId,
                hierarchy,
                timestamp,
                expectedPriority: this.hierarchySpecs[hierarchy].styling.priority
            });
            
            // Update usage patterns
            if (!this.hierarchyMetrics.usagePatterns[componentId]) {
                this.hierarchyMetrics.usagePatterns[componentId] = {
                    clicks: 0,
                    hierarchy: hierarchy,
                    firstInteraction: timestamp,
                    lastInteraction: timestamp
                };
            }
            
            this.hierarchyMetrics.usagePatterns[componentId].clicks++;
            this.hierarchyMetrics.usagePatterns[componentId].lastInteraction = timestamp;
        },

        getComponentPosition(component) {
            const gridColumn = component.style.gridColumn;
            const gridRow = component.style.gridRow;
            
            const columnMatch = gridColumn.match(/(\d+)\s*\/\s*span\s*(\d+)/);
            const rowMatch = gridRow.match(/(\d+)\s*\/\s*span\s*(\d+)/);
            
            if (columnMatch && rowMatch) {
                return {
                    col: parseInt(columnMatch[1]),
                    row: parseInt(rowMatch[1]),
                    width: parseInt(columnMatch[2]),
                    height: parseInt(rowMatch[2])
                };
            }
            
            return { col: 1, row: 1, width: 1, height: 1 };
        },

        getZoneForPosition(position) {
            for (const [zoneName, zoneSpec] of Object.entries(this.layoutZones)) {
                const zone = zoneSpec.rect;
                if (position.col >= zone.x && 
                    position.col < zone.x + zone.width &&
                    position.row >= zone.y && 
                    position.row < zone.y + zone.height) {
                    return zoneName;
                }
            }
            return 'unzoned';
        },

        // Public API for component creation with hierarchy enforcement
        createHierarchicalComponent(definition) {
            const hierarchySpec = this.hierarchySpecs[definition.hierarchy];
            if (!hierarchySpec) {
                console.warn(`Unknown hierarchy: ${definition.hierarchy}`);
                return null;
            }
            
            // Enforce size constraints
            const [width, height] = definition.size.match(/w(\d+) h(\d+)/).slice(1, 3).map(Number);
            const minWidth = hierarchySpec.sizing.minWidth;
            const minHeight = hierarchySpec.sizing.minHeight;
            const maxWidth = hierarchySpec.sizing.maxWidth;
            const maxHeight = hierarchySpec.sizing.maxHeight;
            
            const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, width));
            const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));
            
            if (constrainedWidth !== width || constrainedHeight !== height) {
                console.log(`📏 Size constrained for ${definition.hierarchy}: w${width} h${height} → w${constrainedWidth} h${constrainedHeight}`);
                definition.size = `w${constrainedWidth} h${constrainedHeight}`;
            }
            
            return definition;
        },

        // Get hierarchy statistics for current screen
        getHierarchyStats() {
            const stats = {
                componentCounts: { primary: 0, secondary: 0, tertiary: 0, utility: 0 },
                totalGridCells: 0,
                utilizationByHierarchy: {},
                densityAnalysis: this.analyzeContentDensity(),
                layoutValidation: null
            };
            
            const components = document.querySelectorAll('.subscreen-component');
            components.forEach(component => {
                const hierarchy = component.getAttribute('data-hierarchy');
                if (hierarchy) {
                    stats.componentCounts[hierarchy]++;
                    
                    const width = parseInt(component.getAttribute('data-grid-w') || 1);
                    const height = parseInt(component.getAttribute('data-grid-h') || 1);
                    const cells = width * height;
                    
                    stats.totalGridCells += cells;
                    
                    if (!stats.utilizationByHierarchy[hierarchy]) {
                        stats.utilizationByHierarchy[hierarchy] = 0;
                    }
                    stats.utilizationByHierarchy[hierarchy] += cells;
                }
            });
            
            stats.layoutValidation = this.validateComponentPlacement(Array.from(components));
            
            return stats;
        }
    };

    // Initialize component hierarchy framework
    if (document.readyState === 'complete') {
        setTimeout(() => ComponentHierarchy.init(), 600);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ComponentHierarchy.init(), 600);
        });
    }

    // Make available globally
    window.ComponentHierarchy = ComponentHierarchy;

})();