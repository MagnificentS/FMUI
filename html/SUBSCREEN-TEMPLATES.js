/**
 * SUBSCREEN TEMPLATES SYSTEM
 * Reusable template patterns for consistent subscreen layouts
 * Provides Detail, List, Dashboard, and Analysis view templates
 */

(function() {
    'use strict';

    console.log('📋 SUBSCREEN TEMPLATES: Initializing reusable template system...');

    const SubscreenTemplates = {
        // Template definitions with optimal grid utilization
        templates: {
            detail: {
                name: 'Detail View',
                description: 'Large primary component with supporting details',
                targetUtilization: 72,
                pattern: [
                    { role: 'primary-detail', hierarchy: 'primary', size: 'w18 h10', zone: 'top-left' },
                    { role: 'supporting-info', hierarchy: 'secondary', size: 'w9 h6', zone: 'top-right' },
                    { role: 'actions', hierarchy: 'utility', size: 'w6 h4', zone: 'bottom-right' },
                    { role: 'context', hierarchy: 'tertiary', size: 'w8 h5', zone: 'bottom-left' }
                ]
            },
            list: {
                name: 'List View',
                description: 'Table/list primary with filters and actions',
                targetUtilization: 75,
                pattern: [
                    { role: 'data-table', hierarchy: 'primary', size: 'w16 h8', zone: 'top-left' },
                    { role: 'filters', hierarchy: 'secondary', size: 'w8 h4', zone: 'top-right' },
                    { role: 'actions', hierarchy: 'secondary', size: 'w8 h4', zone: 'center-right' },
                    { role: 'summary', hierarchy: 'tertiary', size: 'w6 h3', zone: 'bottom-left' },
                    { role: 'quick-stats', hierarchy: 'tertiary', size: 'w6 h3', zone: 'bottom-center' }
                ]
            },
            dashboard: {
                name: 'Dashboard View',
                description: 'Multiple balanced components showing KPIs',
                targetUtilization: 70,
                pattern: [
                    { role: 'main-kpi', hierarchy: 'primary', size: 'w12 h6', zone: 'top-left' },
                    { role: 'secondary-kpi-1', hierarchy: 'secondary', size: 'w8 h4', zone: 'top-right' },
                    { role: 'secondary-kpi-2', hierarchy: 'secondary', size: 'w8 h4', zone: 'center-left' },
                    { role: 'trend-chart', hierarchy: 'secondary', size: 'w10 h5', zone: 'center' },
                    { role: 'status-panel', hierarchy: 'tertiary', size: 'w6 h3', zone: 'bottom-left' },
                    { role: 'alerts', hierarchy: 'utility', size: 'w6 h3', zone: 'bottom-right' }
                ]
            },
            analysis: {
                name: 'Analysis View',
                description: 'Chart/graph primary with data breakdown',
                targetUtilization: 68,
                pattern: [
                    { role: 'main-chart', hierarchy: 'primary', size: 'w16 h8', zone: 'top-left' },
                    { role: 'data-breakdown', hierarchy: 'secondary', size: 'w10 h6', zone: 'top-right' },
                    { role: 'insights', hierarchy: 'secondary', size: 'w8 h5', zone: 'bottom-left' },
                    { role: 'controls', hierarchy: 'tertiary', size: 'w6 h4', zone: 'bottom-right' }
                ]
            }
        },

        // Template instantiation functions
        createFromTemplate(templateName, customizations = {}) {
            console.log(`🏗️ Creating subscreen from ${templateName} template...`);
            
            const template = this.templates[templateName];
            if (!template) {
                console.error(`Template ${templateName} not found`);
                return null;
            }
            
            const subscreen = {
                title: customizations.title || template.name,
                template: templateName,
                targetUtilization: template.targetUtilization,
                components: []
            };
            
            // Create components from template pattern
            template.pattern.forEach((componentPattern, index) => {
                const component = this.createTemplateComponent(componentPattern, customizations, index);
                subscreen.components.push(component);
            });
            
            console.log(`✅ Created ${subscreen.components.length} components from ${templateName} template`);
            return subscreen;
        },

        createTemplateComponent(pattern, customizations, index) {
            const customComponent = customizations.components?.[index] || customizations.components?.[pattern.role];
            
            return {
                id: customComponent?.id || pattern.role,
                title: customComponent?.title || this.getDefaultTitle(pattern.role),
                hierarchy: pattern.hierarchy,
                size: customComponent?.size || pattern.size,
                position: this.calculateZonePosition(pattern.zone, pattern.size),
                content: customComponent?.content || this.generateTemplateContent(pattern.role, pattern.hierarchy),
                role: pattern.role
            };
        },

        getDefaultTitle(role) {
            const titleMap = {
                'primary-detail': 'Main Information',
                'supporting-info': 'Supporting Details',
                'actions': 'Quick Actions',
                'context': 'Context Info',
                'data-table': 'Data Table',
                'filters': 'Filters & Search',
                'summary': 'Summary',
                'quick-stats': 'Quick Stats',
                'main-kpi': 'Key Performance',
                'secondary-kpi-1': 'Secondary Metrics',
                'secondary-kpi-2': 'Additional KPIs',
                'trend-chart': 'Trends',
                'status-panel': 'Status',
                'alerts': 'Alerts',
                'main-chart': 'Analysis Chart',
                'data-breakdown': 'Data Breakdown',
                'insights': 'Insights',
                'controls': 'Controls'
            };
            
            return titleMap[role] || role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        },

        calculateZonePosition(zoneName, size) {
            const zones = {
                'top-left': { col: 1, row: 1 },
                'top-center': { col: 16, row: 1 },
                'top-right': { col: 28, row: 1 },
                'center-left': { col: 1, row: 9 },
                'center': { col: 16, row: 9 },
                'center-right': { col: 28, row: 9 },
                'bottom-left': { col: 1, row: 15 },
                'bottom-center': { col: 13, row: 15 },
                'bottom-right': { col: 25, row: 15 }
            };
            
            return zones[zoneName] || { col: 1, row: 1 };
        },

        generateTemplateContent(role, hierarchy) {
            const contentGenerators = {
                'primary-detail': () => `
                    <div class="primary-detail-content">
                        <div class="detail-header">Primary Information</div>
                        <div class="detail-body">
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Status</span>
                                    <span class="info-value">Active</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Priority</span>
                                    <span class="info-value">High</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Progress</span>
                                    <span class="info-value">75%</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Last Updated</span>
                                    <span class="info-value">Now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                'data-table': () => `
                    <div class="template-data-table">
                        <div class="table-header">
                            <span class="table-title">Data Overview</span>
                            <span class="table-count">25 items</span>
                        </div>
                        <div class="table-content">
                            <div class="table-row header">
                                <span class="col-1">Name</span>
                                <span class="col-2">Value</span>
                                <span class="col-3">Status</span>
                            </div>
                            <div class="table-row">
                                <span class="col-1">Item 1</span>
                                <span class="col-2">100</span>
                                <span class="col-3">Active</span>
                            </div>
                            <div class="table-row">
                                <span class="col-1">Item 2</span>
                                <span class="col-2">85</span>
                                <span class="col-3">Active</span>
                            </div>
                            <div class="table-row">
                                <span class="col-1">Item 3</span>
                                <span class="col-2">92</span>
                                <span class="col-3">Pending</span>
                            </div>
                        </div>
                    </div>
                `,
                'main-kpi': () => `
                    <div class="kpi-display">
                        <div class="kpi-value-large">87%</div>
                        <div class="kpi-label">Overall Performance</div>
                        <div class="kpi-trend positive">↗️ +5% this week</div>
                        <div class="kpi-context">
                            <div class="context-item">
                                <span class="context-label">Previous</span>
                                <span class="context-value">82%</span>
                            </div>
                            <div class="context-item">
                                <span class="context-label">Target</span>
                                <span class="context-value">90%</span>
                            </div>
                        </div>
                    </div>
                `,
                'main-chart': () => `
                    <div class="chart-container">
                        <div class="chart-header">
                            <span class="chart-title">Performance Analysis</span>
                            <select class="chart-period">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Season</option>
                            </select>
                        </div>
                        <div class="chart-area">
                            <div class="chart-placeholder">
                                <div class="chart-bars">
                                    <div class="chart-bar" style="height: 60%;"></div>
                                    <div class="chart-bar" style="height: 80%;"></div>
                                    <div class="chart-bar" style="height: 45%;"></div>
                                    <div class="chart-bar" style="height: 75%;"></div>
                                    <div class="chart-bar" style="height: 90%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            };
            
            const generator = contentGenerators[role];
            return generator ? generator() : this.generateDefaultTemplateContent(hierarchy);
        },

        generateDefaultTemplateContent(hierarchy) {
            const itemCounts = { primary: 6, secondary: 4, tertiary: 3, utility: 2 };
            const count = itemCounts[hierarchy] || 3;
            
            let content = '<div class="template-default-content">';
            for (let i = 0; i < count; i++) {
                content += `
                    <div class="stat-row">
                        <span class="stat-label">${hierarchy} Item ${i + 1}</span>
                        <span class="stat-value">Value ${i + 1}</span>
                    </div>
                `;
            }
            content += '</div>';
            
            return content;
        },

        // Quick template application functions
        applyDetailTemplate(tab, subscreen, customizations = {}) {
            return this.applyTemplate('detail', tab, subscreen, customizations);
        },

        applyListTemplate(tab, subscreen, customizations = {}) {
            return this.applyTemplate('list', tab, subscreen, customizations);
        },

        applyDashboardTemplate(tab, subscreen, customizations = {}) {
            return this.applyTemplate('dashboard', tab, subscreen, customizations);
        },

        applyAnalysisTemplate(tab, subscreen, customizations = {}) {
            return this.applyTemplate('analysis', tab, subscreen, customizations);
        },

        applyTemplate(templateName, tab, subscreen, customizations = {}) {
            console.log(`🎨 Applying ${templateName} template to ${tab}/${subscreen}`);
            
            const subscreenDef = this.createFromTemplate(templateName, customizations);
            if (!subscreenDef) return;
            
            // Update the subscreen system with this template
            if (window.SubscreenSystem && window.SubscreenSystem.subscreenDefinitions) {
                if (!window.SubscreenSystem.subscreenDefinitions[tab]) {
                    window.SubscreenSystem.subscreenDefinitions[tab] = {};
                }
                
                window.SubscreenSystem.subscreenDefinitions[tab][subscreen] = {
                    title: subscreenDef.title,
                    targetUtilization: subscreenDef.targetUtilization,
                    components: subscreenDef.components,
                    template: templateName
                };
                
                console.log(`✅ Applied ${templateName} template to ${tab}/${subscreen}`);
                
                // If this is the current subscreen, reload it
                if (window.SubscreenSystem.currentSubscreen.tab === tab && 
                    window.SubscreenSystem.currentSubscreen.subscreen === subscreen) {
                    window.SubscreenSystem.loadSubscreenContent(tab, subscreen);
                }
            }
        },

        // Template validation and optimization
        validateTemplate(templateName) {
            const template = this.templates[templateName];
            if (!template) return { valid: false, errors: ['Template not found'] };
            
            const validation = {
                valid: true,
                errors: [],
                warnings: [],
                gridUtilization: 0,
                hierarchyBalance: true
            };
            
            let totalCells = 0;
            const hierarchyCounts = { primary: 0, secondary: 0, tertiary: 0, utility: 0 };
            
            template.pattern.forEach(component => {
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3).map(Number);
                totalCells += width * height;
                hierarchyCounts[component.hierarchy]++;
            });
            
            validation.gridUtilization = (totalCells / 703) * 100;
            
            // Validate utilization
            if (validation.gridUtilization < 60) {
                validation.warnings.push(`Low grid utilization: ${validation.gridUtilization.toFixed(1)}%`);
            } else if (validation.gridUtilization > 85) {
                validation.warnings.push(`High grid utilization: ${validation.gridUtilization.toFixed(1)}%`);
            }
            
            // Validate hierarchy balance
            if (hierarchyCounts.primary === 0) {
                validation.errors.push('No primary component defined');
                validation.valid = false;
            }
            
            if (hierarchyCounts.primary > 2) {
                validation.warnings.push('Multiple primary components may confuse hierarchy');
            }
            
            return validation;
        },

        // Get optimal template for content type
        getOptimalTemplate(contentType, componentCount = 4) {
            const recommendations = {
                'player-data': 'list',
                'match-info': 'detail',
                'statistics': 'analysis',
                'overview': 'dashboard',
                'reports': 'analysis',
                'settings': 'detail',
                'schedule': 'list'
            };
            
            const template = recommendations[contentType];
            if (template) {
                console.log(`💡 Recommended template for ${contentType}: ${template}`);
                return template;
            }
            
            // Fallback recommendations based on component count
            if (componentCount <= 3) return 'detail';
            if (componentCount <= 5) return 'dashboard';
            return 'list';
        },

        // Template modification utilities
        resizeComponentInTemplate(templateName, componentRole, newSize) {
            const template = this.templates[templateName];
            if (!template) return false;
            
            const component = template.pattern.find(c => c.role === componentRole);
            if (component) {
                const oldSize = component.size;
                component.size = newSize;
                console.log(`📏 Resized ${componentRole} in ${templateName}: ${oldSize} → ${newSize}`);
                return true;
            }
            
            return false;
        },

        addComponentToTemplate(templateName, componentConfig) {
            const template = this.templates[templateName];
            if (!template) return false;
            
            template.pattern.push(componentConfig);
            console.log(`➕ Added component ${componentConfig.role} to ${templateName} template`);
            
            // Revalidate template
            const validation = this.validateTemplate(templateName);
            if (!validation.valid) {
                console.warn(`⚠️ Template ${templateName} validation failed after adding component`);
                validation.errors.forEach(error => console.warn(`  • ${error}`));
            }
            
            return true;
        },

        // Template analysis and optimization
        analyzeTemplateUsage() {
            const usage = {
                templateCounts: { detail: 0, list: 0, dashboard: 0, analysis: 0 },
                avgUtilization: {},
                mostUsed: null,
                leastUsed: null
            };
            
            // Analyze current subscreens to see which templates they match
            if (window.SubscreenSystem && window.SubscreenSystem.subscreenDefinitions) {
                Object.values(window.SubscreenSystem.subscreenDefinitions).forEach(tabDef => {
                    Object.values(tabDef).forEach(subscreenDef => {
                        if (subscreenDef.template) {
                            usage.templateCounts[subscreenDef.template]++;
                        }
                    });
                });
            }
            
            // Find most and least used templates
            const counts = Object.entries(usage.templateCounts);
            usage.mostUsed = counts.reduce((a, b) => a[1] > b[1] ? a : b)[0];
            usage.leastUsed = counts.reduce((a, b) => a[1] < b[1] ? a : b)[0];
            
            console.log('📊 Template usage analysis:', usage);
            return usage;
        }
    };

    // Add template-specific styles
    const templateStyles = `
        /* Template System Styles */
        
        /* Detail Template Styles */
        .primary-detail-content {
            padding: 0;
        }
        
        .detail-header {
            font-size: 14px;
            font-weight: 600;
            color: white;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-body {
            flex: 1;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 11px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .info-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .info-value {
            color: white;
            font-weight: 600;
        }
        
        /* List Template Styles */
        .template-data-table {
            font-size: 10px;
        }
        
        .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .table-title {
            font-size: 12px;
            font-weight: 600;
            color: white;
        }
        
        .table-count {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .table-content {
            flex: 1;
        }
        
        .table-row {
            display: grid;
            grid-template-columns: 1fr 60px 60px;
            gap: 8px;
            padding: 4px 0;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .table-row.header {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .col-1, .col-2, .col-3 {
            color: rgba(255, 255, 255, 0.9);
            font-size: 10px;
        }
        
        /* Dashboard Template Styles */
        .kpi-display {
            text-align: center;
            padding: 0;
        }
        
        .kpi-value-large {
            font-size: 32px;
            font-weight: 700;
            color: var(--primary-400);
            margin-bottom: 8px;
        }
        
        .kpi-label {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 8px;
        }
        
        .kpi-trend {
            font-size: 10px;
            margin-bottom: 16px;
        }
        
        .kpi-trend.positive {
            color: #00ff88;
        }
        
        .kpi-trend.negative {
            color: #ff4757;
        }
        
        .kpi-context {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 9px;
        }
        
        .context-item {
            display: flex;
            justify-content: space-between;
        }
        
        .context-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .context-value {
            color: white;
            font-weight: 600;
        }
        
        /* Analysis Template Styles */
        .chart-container {
            font-size: 10px;
        }
        
        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .chart-title {
            font-size: 12px;
            font-weight: 600;
            color: white;
        }
        
        .chart-period {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
        }
        
        .chart-area {
            height: 80px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            position: relative;
            overflow: hidden;
        }
        
        .chart-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            padding: 8px;
        }
        
        .chart-bars {
            display: flex;
            gap: 4px;
            height: 100%;
            align-items: flex-end;
            flex: 1;
            justify-content: space-around;
        }
        
        .chart-bar {
            width: 12px;
            background: linear-gradient(to top, #0094cc, #00ff88);
            border-radius: 2px 2px 0 0;
            transition: height 0.3s ease;
        }
        
        /* Template Default Content */
        .template-default-content {
            font-size: 10px;
        }
        
        .template-default-content .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .template-default-content .stat-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .template-default-content .stat-value {
            color: white;
            font-weight: 600;
        }
    `;
    
    // Inject template styles
    const style = document.createElement('style');
    style.id = 'subscreen-template-styles';
    style.textContent = templateStyles;
    document.head.appendChild(style);
    
    // Initialize template system
    console.log('✅ SUBSCREEN TEMPLATES: Template system ready');
    
    // Make available globally
    window.SubscreenTemplates = SubscreenTemplates;

})();