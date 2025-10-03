/**
 * FOOTBALL MANAGER SUBSCREEN SYSTEM
 * Comprehensive subscreen management with routing, state persistence, and component hierarchy
 * Builds upon existing navigation and grid system in main.html
 */

(function() {
    'use strict';

    console.log('🚀 SUBSCREEN SYSTEM: Initializing comprehensive subscreen architecture...');

    const SubscreenSystem = {
        // State management for subscreens
        subscreenStates: new Map(),
        currentSubscreen: { tab: 'overview', subscreen: 'dashboard' },
        
        // Component hierarchy definitions
        componentHierarchy: {
            primary: { minSize: 'w12 h6', priority: 1, color: '#0094cc' },
            secondary: { minSize: 'w8 h4', priority: 2, color: '#00ff88' },
            tertiary: { minSize: 'w6 h3', priority: 3, color: '#ffb800' },
            utility: { minSize: 'w4 h2', priority: 4, color: '#ff6b35' }
        },
        
        // Subscreen definitions with proper grid utilization
        subscreenDefinitions: {
            overview: {
                dashboard: {
                    title: 'Dashboard',
                    targetUtilization: 70,
                    components: [
                        { id: 'next-match', title: 'Next Match', hierarchy: 'primary', size: 'w12 h6', position: { col: 1, row: 1 } },
                        { id: 'league-position', title: 'League Position', hierarchy: 'secondary', size: 'w8 h4', position: { col: 13, row: 1 } },
                        { id: 'recent-form', title: 'Recent Form', hierarchy: 'secondary', size: 'w8 h4', position: { col: 21, row: 1 } },
                        { id: 'quick-stats', title: 'Quick Stats', hierarchy: 'tertiary', size: 'w6 h3', position: { col: 29, row: 1 } },
                        { id: 'squad-fitness', title: 'Squad Fitness', hierarchy: 'tertiary', size: 'w6 h3', position: { col: 1, row: 7 } },
                        { id: 'upcoming-fixtures', title: 'Upcoming Fixtures', hierarchy: 'secondary', size: 'w10 h5', position: { col: 7, row: 7 } }
                    ]
                },
                reports: {
                    title: 'Reports',
                    targetUtilization: 75,
                    components: [
                        { id: 'season-report', title: 'Season Report', hierarchy: 'primary', size: 'w16 h8', position: { col: 1, row: 1 } },
                        { id: 'performance-metrics', title: 'Performance Metrics', hierarchy: 'secondary', size: 'w10 h6', position: { col: 17, row: 1 } },
                        { id: 'player-reports', title: 'Player Reports', hierarchy: 'secondary', size: 'w12 h5', position: { col: 1, row: 9 } },
                        { id: 'export-tools', title: 'Export Tools', hierarchy: 'utility', size: 'w6 h4', position: { col: 27, row: 1 } }
                    ]
                },
                statistics: {
                    title: 'Statistics',
                    targetUtilization: 72,
                    components: [
                        { id: 'team-stats', title: 'Team Statistics', hierarchy: 'primary', size: 'w14 h8', position: { col: 1, row: 1 } },
                        { id: 'player-stats', title: 'Player Performance', hierarchy: 'secondary', size: 'w12 h6', position: { col: 15, row: 1 } },
                        { id: 'historical-data', title: 'Historical Comparison', hierarchy: 'secondary', size: 'w8 h5', position: { col: 1, row: 9 } },
                        { id: 'league-comparison', title: 'League Comparison', hierarchy: 'tertiary', size: 'w8 h5', position: { col: 9, row: 9 } }
                    ]
                },
                news: {
                    title: 'News',
                    targetUtilization: 68,
                    components: [
                        { id: 'news-feed', title: 'Latest News', hierarchy: 'primary', size: 'w12 h8', position: { col: 1, row: 1 } },
                        { id: 'press-conferences', title: 'Press Conferences', hierarchy: 'secondary', size: 'w10 h6', position: { col: 13, row: 1 } },
                        { id: 'media-schedule', title: 'Media Schedule', hierarchy: 'tertiary', size: 'w8 h4', position: { col: 23, row: 1 } },
                        { id: 'club-announcements', title: 'Club News', hierarchy: 'tertiary', size: 'w6 h5', position: { col: 1, row: 9 } }
                    ]
                },
                inbox: {
                    title: 'Inbox',
                    targetUtilization: 65,
                    components: [
                        { id: 'messages', title: 'Messages', hierarchy: 'primary', size: 'w14 h8', position: { col: 1, row: 1 } },
                        { id: 'action-items', title: 'Action Required', hierarchy: 'secondary', size: 'w10 h5', position: { col: 15, row: 1 } },
                        { id: 'board-requests', title: 'Board Communications', hierarchy: 'secondary', size: 'w8 h5', position: { col: 25, row: 1 } },
                        { id: 'quick-reply', title: 'Quick Actions', hierarchy: 'utility', size: 'w6 h4', position: { col: 1, row: 9 } }
                    ]
                }
            },
            squad: {
                'first-team': {
                    title: 'First Team',
                    targetUtilization: 73,
                    components: [
                        { id: 'formation-display', title: 'Current Formation', hierarchy: 'primary', size: 'w15 h8', position: { col: 1, row: 1 } },
                        { id: 'player-cards', title: 'Player Overview', hierarchy: 'secondary', size: 'w12 h8', position: { col: 16, row: 1 } },
                        { id: 'squad-status', title: 'Squad Status', hierarchy: 'secondary', size: 'w8 h5', position: { col: 1, row: 9 } },
                        { id: 'team-chemistry', title: 'Team Chemistry', hierarchy: 'tertiary', size: 'w6 h5', position: { col: 9, row: 9 } },
                        { id: 'captain-info', title: 'Leadership', hierarchy: 'tertiary', size: 'w6 h4', position: { col: 28, row: 1 } }
                    ]
                },
                reserves: {
                    title: 'Reserves',
                    targetUtilization: 70,
                    components: [
                        { id: 'reserve-squad', title: 'Reserve Squad', hierarchy: 'primary', size: 'w14 h8', position: { col: 1, row: 1 } },
                        { id: 'development-progress', title: 'Development Progress', hierarchy: 'secondary', size: 'w10 h6', position: { col: 15, row: 1 } },
                        { id: 'promotion-candidates', title: 'Promotion Ready', hierarchy: 'secondary', size: 'w8 h5', position: { col: 25, row: 1 } },
                        { id: 'reserve-fixtures', title: 'Reserve Fixtures', hierarchy: 'tertiary', size: 'w8 h4', position: { col: 1, row: 9 } }
                    ]
                },
                youth: {
                    title: 'Youth',
                    targetUtilization: 68,
                    components: [
                        { id: 'youth-prospects', title: 'Youth Prospects', hierarchy: 'primary', size: 'w12 h8', position: { col: 1, row: 1 } },
                        { id: 'academy-status', title: 'Academy Status', hierarchy: 'secondary', size: 'w8 h6', position: { col: 13, row: 1 } },
                        { id: 'development-plans', title: 'Development Plans', hierarchy: 'secondary', size: 'w10 h5', position: { col: 21, row: 1 } },
                        { id: 'youth-coaching', title: 'Youth Coaching', hierarchy: 'tertiary', size: 'w6 h4', position: { col: 1, row: 9 } }
                    ]
                }
                // Additional squad subscreens will be added here
            }
            // Additional tabs will be implemented progressively
        },
        
        init() {
            console.log('🚀 SUBSCREEN SYSTEM: Setting up routing and state management...');
            
            this.setupStateManagement();
            this.enhanceSubmenus();
            this.setupRouting();
            this.initializeSubscreens();
            
            console.log('✅ SUBSCREEN SYSTEM: Architecture initialized');
        },
        
        setupStateManagement() {
            console.log('📊 Setting up subscreen state management...');
            
            // Initialize state for each tab/subscreen combination
            Object.keys(this.subscreenDefinitions).forEach(tab => {
                Object.keys(this.subscreenDefinitions[tab]).forEach(subscreen => {
                    const stateKey = `${tab}-${subscreen}`;
                    this.subscreenStates.set(stateKey, {
                        tab: tab,
                        subscreen: subscreen,
                        isActive: false,
                        isLoaded: false,
                        components: [],
                        lastAccessed: null,
                        customizations: {}
                    });
                });
            });
            
            console.log(`✅ Initialized state for ${this.subscreenStates.size} subscreens`);
        },
        
        enhanceSubmenus() {
            console.log('🔗 Enhancing submenu integration...');
            
            // Map existing submenu items to subscreens
            const submenuMappings = {
                'overview-submenu': ['dashboard', 'reports', 'statistics', 'news', 'inbox'],
                'squad-submenu': ['first-team', 'reserves', 'youth', 'staff', 'reports', 'dynamics'],
                'tactics-submenu': ['formation', 'instructions', 'set-pieces', 'opposition', 'analysis'],
                'training-submenu': ['schedule', 'individual', 'coaches', 'facilities', 'reports'],
                'transfers-submenu': ['transfer-hub', 'scout-reports', 'shortlist', 'loans', 'contracts', 'director'],
                'finances-submenu': ['overview', 'income', 'expenditure', 'ffp', 'projections', 'sponsors'],
                'fixtures-submenu': ['calendar', 'results', 'schedule', 'rules', 'history']
            };
            
            Object.entries(submenuMappings).forEach(([submenuId, subscreenIds]) => {
                const submenu = document.getElementById(submenuId);
                if (submenu) {
                    const items = submenu.querySelectorAll('.submenu-item');
                    items.forEach((item, index) => {
                        if (subscreenIds[index]) {
                            item.setAttribute('data-subscreen', subscreenIds[index]);
                            
                            // Remove any existing click handlers
                            item.removeEventListener('click', item.subscreenClickHandler);
                            
                            // Add new click handler
                            item.subscreenClickHandler = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const tab = submenuId.replace('-submenu', '');
                                console.log(`🔄 Direct submenu click: ${tab}/${subscreenIds[index]}`);
                                this.navigateToSubscreen(tab, subscreenIds[index]);
                            };
                            
                            item.addEventListener('click', item.subscreenClickHandler);
                            
                            // Make it obviously clickable
                            item.style.cursor = 'pointer';
                            item.style.userSelect = 'none';
                        }
                    });
                }
            });
            
            console.log('✅ Enhanced submenu integration with subscreen navigation');
        },
        
        setupRouting() {
            console.log('🗺️ Setting up subscreen routing system...');
            
            // Create a routing function that works with existing tab system
            window.navigateToSubscreen = (tab, subscreen) => {
                this.navigateToSubscreen(tab, subscreen);
            };
            
            // Enhance existing tab switching to remember subscreen state
            const originalSwitchTab = window.switchTab;
            window.switchTab = (tab, element) => {
                // Call original function
                originalSwitchTab(tab, element);
                
                // Load the last active subscreen for this tab
                const lastSubscreen = this.getLastActiveSubscreen(tab);
                this.navigateToSubscreen(tab, lastSubscreen);
            };
            
            console.log('✅ Subscreen routing system established');
        },
        
        navigateToSubscreen(tab, subscreen) {
            console.log(`🧭 Navigating to ${tab}/${subscreen}`);
            
            // Update current subscreen
            this.currentSubscreen = { tab, subscreen };
            
            // Update submenu active state
            this.updateSubmenuActiveState(tab, subscreen);
            
            // Load subscreen content
            this.loadSubscreenContent(tab, subscreen);
            
            // Update state
            const stateKey = `${tab}-${subscreen}`;
            const state = this.subscreenStates.get(stateKey);
            if (state) {
                state.lastAccessed = Date.now();
                state.isActive = true;
                
                // Deactivate other subscreens for this tab
                this.subscreenStates.forEach((otherState, otherKey) => {
                    if (otherState.tab === tab && otherKey !== stateKey) {
                        otherState.isActive = false;
                    }
                });
            }
        },
        
        updateSubmenuActiveState(tab, subscreen) {
            const submenu = document.getElementById(`${tab}-submenu`);
            if (submenu) {
                // Remove active class from all submenu items
                submenu.querySelectorAll('.submenu-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to current subscreen
                const activeItem = submenu.querySelector(`[data-subscreen="${subscreen}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                } else {
                    // If exact match not found, activate first item as fallback
                    const firstItem = submenu.querySelector('.submenu-item');
                    if (firstItem) firstItem.classList.add('active');
                }
            }
        },
        
        loadSubscreenContent(tab, subscreen) {
            console.log(`📋 Loading content for ${tab}/${subscreen}`);
            
            const definition = this.subscreenDefinitions[tab]?.[subscreen];
            if (!definition) {
                console.warn(`No definition found for ${tab}/${subscreen}`);
                return;
            }
            
            const container = document.querySelector(`#${tab}-grid-view .tile-container`);
            if (!container) {
                console.warn(`No container found for ${tab}`);
                return;
            }
            
            // Clear existing content
            container.innerHTML = '';
            
            // Add subscreen identifier class
            container.classList.add(`subscreen-${subscreen}`);
            
            // Create components based on definition
            const components = this.createSubscreenComponents(definition);
            
            // Add components to container
            components.forEach(component => {
                container.appendChild(component);
            });
            
            // Calculate and log utilization
            const utilization = this.calculateGridUtilization(container);
            console.log(`📊 ${tab}/${subscreen} grid utilization: ${utilization.toFixed(1)}% (target: ${definition.targetUtilization}%)`);
            
            // Mark as loaded
            const stateKey = `${tab}-${subscreen}`;
            const state = this.subscreenStates.get(stateKey);
            if (state) {
                state.isLoaded = true;
                state.components = components;
            }
        },
        
        createSubscreenComponents(definition) {
            console.log(`🏗️ Creating ${definition.components.length} components for ${definition.title}`);
            
            const components = [];
            
            definition.components.forEach(componentDef => {
                const component = this.createComponent(componentDef);
                components.push(component);
            });
            
            return components;
        },
        
        createComponent(componentDef) {
            const component = document.createElement('div');
            component.className = `card ${componentDef.size} subscreen-component ${componentDef.hierarchy}-component`;
            component.setAttribute('data-component-id', componentDef.id);
            component.setAttribute('data-hierarchy', componentDef.hierarchy);
            
            // Set explicit grid position
            if (componentDef.position) {
                const { col, row } = componentDef.position;
                const [width, height] = componentDef.size.match(/w(\d+) h(\d+)/).slice(1, 3);
                component.style.gridColumn = `${col} / span ${width}`;
                component.style.gridRow = `${row} / span ${height}`;
                component.setAttribute('data-grid-w', width);
                component.setAttribute('data-grid-h', height);
            }
            
            // Add hierarchy styling
            const hierarchyConfig = this.componentHierarchy[componentDef.hierarchy];
            if (hierarchyConfig) {
                component.style.borderLeft = `3px solid ${hierarchyConfig.color}`;
            }
            
            // Create component content
            const content = this.generateComponentContent(componentDef);
            
            component.innerHTML = `
                <div class="card-header subscreen-header">
                    <span>${componentDef.title}</span>
                    <div class="component-hierarchy-indicator ${componentDef.hierarchy}">
                        ${componentDef.hierarchy.charAt(0).toUpperCase()}
                    </div>
                </div>
                <div class="card-body subscreen-body">
                    ${content}
                </div>
                <div class="resize-handle"></div>
            `;
            
            return component;
        },
        
        generateComponentContent(componentDef) {
            // Generate appropriate content based on component type and hierarchy
            const contentGenerators = {
                'next-match': () => this.generateNextMatchContent(),
                'league-position': () => this.generateLeaguePositionContent(),
                'recent-form': () => this.generateRecentFormContent(),
                'quick-stats': () => this.generateQuickStatsContent(),
                'squad-fitness': () => this.generateSquadFitnessContent(),
                'upcoming-fixtures': () => this.generateUpcomingFixturesContent(),
                'season-report': () => this.generateSeasonReportContent(),
                'performance-metrics': () => this.generatePerformanceMetricsContent(),
                'formation-display': () => this.generateFormationDisplayContent(),
                'player-cards': () => this.generatePlayerCardsContent()
            };
            
            const generator = contentGenerators[componentDef.id];
            if (generator) {
                return generator();
            }
            
            // Default content for components without specific generators
            return this.generateDefaultContent(componentDef);
        },
        
        generateDefaultContent(componentDef) {
            const infoCount = this.getInfoCountForHierarchy(componentDef.hierarchy);
            let content = `<div class="component-content">`;
            
            for (let i = 0; i < infoCount; i++) {
                content += `
                    <div class="stat-row">
                        <span class="stat-label">${componentDef.hierarchy} Item ${i + 1}</span>
                        <span class="stat-value">Value ${i + 1}</span>
                    </div>
                `;
            }
            
            content += `</div>`;
            return content;
        },
        
        getInfoCountForHierarchy(hierarchy) {
            const counts = {
                'primary': 6,
                'secondary': 4,
                'tertiary': 3,
                'utility': 2
            };
            return counts[hierarchy] || 3;
        },
        
        calculateGridUtilization(container) {
            const cards = container.querySelectorAll('.card');
            let totalCells = 0;
            
            cards.forEach(card => {
                const width = parseInt(card.getAttribute('data-grid-w') || 1);
                const height = parseInt(card.getAttribute('data-grid-h') || 1);
                totalCells += width * height;
            });
            
            return (totalCells / 703) * 100; // 703 = 37 * 19 total grid cells
        },
        
        getLastActiveSubscreen(tab) {
            // Find the most recently accessed subscreen for this tab
            let lastSubscreen = 'dashboard'; // Default fallback
            let lastAccessTime = 0;
            
            this.subscreenStates.forEach((state, key) => {
                if (state.tab === tab && state.lastAccessed && state.lastAccessed > lastAccessTime) {
                    lastAccessTime = state.lastAccessed;
                    lastSubscreen = state.subscreen;
                }
            });
            
            // If no subscreen has been accessed, use the first available one
            const availableSubscreens = Object.keys(this.subscreenDefinitions[tab] || {});
            if (availableSubscreens.length > 0 && !this.subscreenDefinitions[tab][lastSubscreen]) {
                lastSubscreen = availableSubscreens[0];
            }
            
            return lastSubscreen;
        },
        
        initializeSubscreens() {
            console.log('🎬 Initializing default subscreen...');
            
            // Initialize with Overview/Dashboard by default
            setTimeout(() => {
                this.navigateToSubscreen('overview', 'dashboard');
            }, 100);
        },
        
        // Content generators for specific components
        generateNextMatchContent() {
            return `
                <div class="next-match-display">
                    <div class="match-header">
                        <div class="opponent">vs Liverpool</div>
                        <div class="match-type">Premier League</div>
                    </div>
                    <div class="match-details">
                        <div class="match-info">
                            <span class="info-label">Date:</span>
                            <span class="info-value">Saturday, 15:00</span>
                        </div>
                        <div class="match-info">
                            <span class="info-label">Venue:</span>
                            <span class="info-value">Old Trafford</span>
                        </div>
                        <div class="match-info">
                            <span class="info-label">Form:</span>
                            <span class="info-value">W-W-D-L-W</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        generateLeaguePositionContent() {
            return `
                <div class="league-position">
                    <div class="position-display">
                        <div class="position-number">4th</div>
                        <div class="position-context">in Premier League</div>
                    </div>
                    <div class="position-stats">
                        <div class="stat-item">
                            <span class="stat-label">Points</span>
                            <span class="stat-value">42</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Goal Diff</span>
                            <span class="stat-value">+12</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateRecentFormContent() {
            return `
                <div class="recent-form">
                    <div class="form-header">Last 5 Matches</div>
                    <div class="form-display">
                        <div class="form-result win">W</div>
                        <div class="form-result win">W</div>
                        <div class="form-result draw">D</div>
                        <div class="form-result loss">L</div>
                        <div class="form-result win">W</div>
                    </div>
                    <div class="form-stats">
                        <div class="stat-item">
                            <span class="stat-label">Points</span>
                            <span class="stat-value">10/15</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Goals</span>
                            <span class="stat-value">8-5</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateQuickStatsContent() {
            return `
                <div class="quick-stats">
                    <div class="stat-item">
                        <span class="stat-label">Squad Size</span>
                        <span class="stat-value">25</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Injuries</span>
                        <span class="stat-value">3</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Morale</span>
                        <span class="stat-value">High</span>
                    </div>
                </div>
            `;
        },

        generateSquadFitnessContent() {
            return `
                <div class="squad-fitness">
                    <div class="fitness-header">Squad Fitness</div>
                    <div class="fitness-bar">
                        <div class="fitness-fill" style="width: 82%;"></div>
                        <span class="fitness-text">82%</span>
                    </div>
                    <div class="fitness-details">
                        <div class="stat-item">
                            <span class="stat-label">Match Ready</span>
                            <span class="stat-value">22</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Needs Rest</span>
                            <span class="stat-value">3</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateUpcomingFixturesContent() {
            return `
                <div class="upcoming-fixtures">
                    <div class="fixture-item">
                        <span class="fixture-date">Sat</span>
                        <span class="fixture-opponent">Liverpool (H)</span>
                        <span class="fixture-comp">PL</span>
                    </div>
                    <div class="fixture-item">
                        <span class="fixture-date">Wed</span>
                        <span class="fixture-opponent">Fulham (A)</span>
                        <span class="fixture-comp">PL</span>
                    </div>
                    <div class="fixture-item">
                        <span class="fixture-date">Sat</span>
                        <span class="fixture-opponent">Brighton (H)</span>
                        <span class="fixture-comp">PL</span>
                    </div>
                    <div class="fixture-item">
                        <span class="fixture-date">Tue</span>
                        <span class="fixture-opponent">Bayern (A)</span>
                        <span class="fixture-comp">UCL</span>
                    </div>
                </div>
            `;
        },

        generateSeasonReportContent() {
            return `
                <div class="season-report">
                    <div class="report-header">Season 2024/25 Report</div>
                    <div class="report-grid">
                        <div class="report-stat">
                            <span class="stat-label">Matches Played</span>
                            <span class="stat-value">20</span>
                        </div>
                        <div class="report-stat">
                            <span class="stat-label">Points</span>
                            <span class="stat-value">42</span>
                        </div>
                        <div class="report-stat">
                            <span class="stat-label">Goals For</span>
                            <span class="stat-value">38</span>
                        </div>
                        <div class="report-stat">
                            <span class="stat-label">Goals Against</span>
                            <span class="stat-value">26</span>
                        </div>
                        <div class="report-stat">
                            <span class="stat-label">League Position</span>
                            <span class="stat-value">4th</span>
                        </div>
                        <div class="report-stat">
                            <span class="stat-label">Points/Game</span>
                            <span class="stat-value">2.1</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generatePerformanceMetricsContent() {
            return `
                <div class="performance-metrics">
                    <div class="metric-item">
                        <span class="metric-label">xG</span>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: 75%;"></div>
                        </div>
                        <span class="metric-value">1.8</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Possession</span>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: 58%;"></div>
                        </div>
                        <span class="metric-value">58%</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Pass Accuracy</span>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: 84%;"></div>
                        </div>
                        <span class="metric-value">84%</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Shots on Target</span>
                        <div class="metric-bar">
                            <div class="metric-fill" style="width: 67%;"></div>
                        </div>
                        <span class="metric-value">67%</span>
                    </div>
                </div>
            `;
        },

        generateFormationDisplayContent() {
            return `
                <div class="formation-display">
                    <div class="formation-header">
                        <span class="formation-name">4-2-3-1</span>
                        <span class="formation-familiarity">95% Familiar</span>
                    </div>
                    <div class="formation-pitch">
                        <div class="player-position gk" style="left: 50%; top: 85%;">
                            <span class="player-name">Onana</span>
                        </div>
                        <div class="player-position def" style="left: 20%; top: 65%;">
                            <span class="player-name">Shaw</span>
                        </div>
                        <div class="player-position def" style="left: 35%; top: 70%;">
                            <span class="player-name">Martinez</span>
                        </div>
                        <div class="player-position def" style="left: 65%; top: 70%;">
                            <span class="player-name">Varane</span>
                        </div>
                        <div class="player-position def" style="left: 80%; top: 65%;">
                            <span class="player-name">Dalot</span>
                        </div>
                        <div class="player-position mid" style="left: 35%; top: 45%;">
                            <span class="player-name">Casemiro</span>
                        </div>
                        <div class="player-position mid" style="left: 65%; top: 45%;">
                            <span class="player-name">Mainoo</span>
                        </div>
                        <div class="player-position att" style="left: 20%; top: 25%;">
                            <span class="player-name">Rashford</span>
                        </div>
                        <div class="player-position att" style="left: 50%; top: 30%;">
                            <span class="player-name">Bruno</span>
                        </div>
                        <div class="player-position att" style="left: 80%; top: 25%;">
                            <span class="player-name">Garnacho</span>
                        </div>
                        <div class="player-position str" style="left: 50%; top: 10%;">
                            <span class="player-name">Højlund</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generatePlayerCardsContent() {
            return `
                <div class="player-cards">
                    <div class="player-card captain">
                        <div class="player-info">
                            <span class="player-name">Bruno Fernandes (C)</span>
                            <span class="player-position">AM</span>
                        </div>
                        <div class="player-stats">
                            <span class="player-rating">8.2</span>
                            <span class="player-form">📈</span>
                        </div>
                    </div>
                    <div class="player-card">
                        <div class="player-info">
                            <span class="player-name">Marcus Rashford</span>
                            <span class="player-position">LW</span>
                        </div>
                        <div class="player-stats">
                            <span class="player-rating">7.8</span>
                            <span class="player-form">📈</span>
                        </div>
                    </div>
                    <div class="player-card">
                        <div class="player-info">
                            <span class="player-name">Rasmus Højlund</span>
                            <span class="player-position">ST</span>
                        </div>
                        <div class="player-stats">
                            <span class="player-rating">7.2</span>
                            <span class="player-form">➡️</span>
                        </div>
                    </div>
                    <div class="player-card">
                        <div class="player-info">
                            <span class="player-name">Kobbie Mainoo</span>
                            <span class="player-position">CM</span>
                        </div>
                        <div class="player-stats">
                            <span class="player-rating">7.3</span>
                            <span class="player-form">📈</span>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    
    // Add subscreen-specific styles
    const subscreenStyles = `
        /* Subscreen System Styles */
        .subscreen-component {
            border-radius: 6px;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
        }
        
        .subscreen-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--neutral-100);
            padding: 8px 12px;
            height: 36px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .subscreen-header span {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-400);
        }
        
        .component-hierarchy-indicator {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 700;
            color: white;
        }
        
        .component-hierarchy-indicator.primary {
            background: #0094cc;
        }
        
        .component-hierarchy-indicator.secondary {
            background: #00ff88;
        }
        
        .component-hierarchy-indicator.tertiary {
            background: #ffb800;
        }
        
        .component-hierarchy-indicator.utility {
            background: #ff6b35;
        }
        
        .subscreen-body {
            padding: 12px;
            overflow: auto;
            flex: 1;
        }
        
        /* Component Content Styles */
        .next-match-display {
            text-align: center;
        }
        
        .match-header {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .opponent {
            font-size: 16px;
            font-weight: 700;
            color: white;
            margin-bottom: 4px;
        }
        
        .match-type {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .match-details {
            font-size: 11px;
        }
        
        .match-info {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
        }
        
        .info-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .info-value {
            color: white;
            font-weight: 600;
        }
        
        .league-position {
            text-align: center;
        }
        
        .position-display {
            margin-bottom: 16px;
        }
        
        .position-number {
            font-size: 24px;
            font-weight: 700;
            color: var(--primary-400);
        }
        
        .position-context {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .position-stats {
            font-size: 10px;
        }
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 11px;
        }
        
        .stat-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .stat-value {
            color: white;
            font-weight: 600;
        }
        
        /* Enhanced submenu styling for direct access */
        .submenu-item {
            cursor: pointer !important;
            transition: all 0.2s ease;
            user-select: none !important;
            border-radius: 4px;
            margin: 0 2px;
            position: relative;
        }
        
        .submenu-item:hover {
            background: rgba(0, 148, 204, 0.2) !important;
            color: #ffffff !important;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 148, 204, 0.3);
        }
        
        .submenu-item.active {
            background: var(--primary-300) !important;
            color: #ffffff !important;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(0, 148, 204, 0.4);
        }
        
        /* Add click indication */
        .submenu-item:active {
            transform: translateY(0px);
            background: rgba(0, 148, 204, 0.4) !important;
        }
        
        /* Grid optimization for subscreens */
        .tile-container[class*="subscreen-"] {
            grid-auto-flow: row dense;
        }
        
        /* Component hover effects */
        .subscreen-component:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
        .primary-component {
            border-left-width: 4px;
        }
        
        .secondary-component {
            border-left-width: 3px;
        }
        
        .tertiary-component {
            border-left-width: 2px;
        }
        
        .utility-component {
            border-left-width: 1px;
        }
        
        /* Content-specific styles */
        .recent-form {
            text-align: center;
        }
        
        .form-header {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 8px;
        }
        
        .form-display {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-bottom: 12px;
        }
        
        .form-result {
            width: 20px;
            height: 20px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 600;
            color: white;
        }
        
        .form-result.win {
            background: #00ff88;
        }
        
        .form-result.draw {
            background: #ffb800;
        }
        
        .form-result.loss {
            background: #ff4757;
        }
        
        .quick-stats .stat-item {
            margin: 6px 0;
            font-size: 10px;
        }
        
        .squad-fitness {
            text-align: center;
        }
        
        .fitness-header {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 8px;
        }
        
        .fitness-bar {
            position: relative;
            height: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            margin-bottom: 8px;
            overflow: hidden;
        }
        
        .fitness-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff88, #0094cc);
            transition: width 0.3s ease;
        }
        
        .fitness-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 9px;
            font-weight: 600;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .fitness-details {
            font-size: 9px;
        }
        
        .upcoming-fixtures {
            font-size: 10px;
        }
        
        .fixture-item {
            display: grid;
            grid-template-columns: 30px 1fr 30px;
            gap: 8px;
            align-items: center;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .fixture-date {
            color: rgba(255, 255, 255, 0.6);
            font-size: 9px;
            text-align: center;
        }
        
        .fixture-opponent {
            color: white;
            font-weight: 500;
        }
        
        .fixture-comp {
            color: var(--primary-400);
            font-size: 8px;
            text-align: center;
            font-weight: 600;
        }
        
        .season-report {
            text-align: center;
        }
        
        .report-header {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .report-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 10px;
        }
        
        .report-stat {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .performance-metrics {
            font-size: 10px;
        }
        
        .metric-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
        }
        
        .metric-label {
            width: 60px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 9px;
        }
        
        .metric-bar {
            flex: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        
        .metric-fill {
            height: 100%;
            background: linear-gradient(90deg, #0094cc, #00ff88);
            transition: width 0.3s ease;
        }
        
        .metric-value {
            width: 35px;
            text-align: right;
            color: white;
            font-weight: 600;
            font-size: 9px;
        }
        
        .formation-display {
            text-align: center;
        }
        
        .formation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .formation-name {
            font-size: 14px;
            font-weight: 700;
            color: var(--primary-400);
        }
        
        .formation-familiarity {
            font-size: 9px;
            color: #00ff88;
        }
        
        .formation-pitch {
            position: relative;
            height: 120px;
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .player-position {
            position: absolute;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid white;
            font-size: 6px;
            font-weight: 600;
            color: white;
        }
        
        .player-position.gk {
            background: #ff6b35;
        }
        
        .player-position.def {
            background: #0094cc;
        }
        
        .player-position.mid {
            background: #00ff88;
        }
        
        .player-position.att {
            background: #ffb800;
        }
        
        .player-position.str {
            background: #ff4757;
        }
        
        .player-name {
            font-size: 6px;
            text-align: center;
        }
        
        .player-cards {
            font-size: 10px;
        }
        
        .player-cards .player-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .player-cards .player-card.captain {
            border-left: 2px solid #ffb800;
            padding-left: 6px;
        }
        
        .player-info {
            flex: 1;
        }
        
        .player-cards .player-name {
            color: white;
            font-weight: 500;
            display: block;
            font-size: 10px;
        }
        
        .player-cards .player-position {
            color: rgba(255, 255, 255, 0.6);
            font-size: 8px;
        }
        
        .player-stats {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .player-rating {
            color: #00ff88;
            font-weight: 600;
            font-size: 10px;
        }
        
        .player-form {
            font-size: 8px;
        }
    `;
    
    // Inject styles
    const style = document.createElement('style');
    style.id = 'subscreen-system-styles';
    style.textContent = subscreenStyles;
    document.head.appendChild(style);
    
    // Initialize when DOM is ready
    if (document.readyState === 'complete') {
        setTimeout(() => SubscreenSystem.init(), 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => SubscreenSystem.init(), 500);
        });
    }
    
    // Make available globally for testing and integration
    window.SubscreenSystem = SubscreenSystem;
    
})();