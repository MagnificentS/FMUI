/**
 * SUBMENU DIRECT FIX
 * Final fix to make submenu items directly clickable without complex routing
 * Simple, direct navigation that just works
 */

(function() {
    'use strict';

    console.log('🎯 SUBMENU DIRECT FIX: Making submenu navigation work directly...');

    const SubmenuDirectFix = {
        init() {
            console.log('🎯 DIRECT FIX: Setting up simple submenu navigation...');
            
            this.waitForDOMReady(() => {
                this.setupDirectSubmenuClicks();
                this.ensureSubmenuVisibility();
                this.addDirectNavStyles();
            });
            
            console.log('✅ SUBMENU DIRECT FIX: Navigation ready');
        },

        waitForDOMReady(callback) {
            if (document.readyState === 'complete') {
                setTimeout(callback, 100);
            } else {
                window.addEventListener('load', () => {
                    setTimeout(callback, 100);
                });
            }
        },

        setupDirectSubmenuClicks() {
            console.log('👆 Setting up direct submenu clicks...');
            
            // Wait for elements to be ready
            setTimeout(() => {
                this.setupTabSubmenuClicks('overview', ['dashboard', 'reports', 'statistics', 'news', 'inbox']);
                this.setupTabSubmenuClicks('squad', ['first-team', 'reserves', 'youth', 'staff', 'reports', 'dynamics']);
                this.setupTabSubmenuClicks('tactics', ['formation', 'instructions', 'set-pieces', 'opposition', 'analysis']);
                this.setupTabSubmenuClicks('training', ['schedule', 'individual', 'coaches', 'facilities', 'reports']);
                this.setupTabSubmenuClicks('transfers', ['transfer-hub', 'scout-reports', 'shortlist', 'loans', 'contracts', 'director']);
                this.setupTabSubmenuClicks('finances', ['overview', 'income', 'expenditure', 'ffp', 'projections', 'sponsors']);
                this.setupTabSubmenuClicks('fixtures', ['calendar', 'results', 'schedule', 'rules', 'history']);
            }, 500);
        },

        setupTabSubmenuClicks(tabName, subscreenNames) {
            const submenu = document.getElementById(`${tabName}-submenu`);
            if (!submenu) return;
            
            const items = submenu.querySelectorAll('.submenu-item');
            
            items.forEach((item, index) => {
                if (subscreenNames[index]) {
                    const subscreenName = subscreenNames[index];
                    
                    // Set data attribute
                    item.setAttribute('data-subscreen', subscreenName);
                    
                    // Remove existing handlers
                    item.onclick = null;
                    item.removeEventListener('click', item._directClickHandler);
                    
                    // Create new direct handler
                    item._directClickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log(`🎯 DIRECT CLICK: ${tabName} → ${subscreenName}`);
                        
                        // Update visual state immediately
                        this.updateActiveSubmenuItem(submenu, item);
                        
                        // Simple content switching
                        this.switchToSubscreen(tabName, subscreenName);
                    };
                    
                    item.addEventListener('click', item._directClickHandler);
                    
                    // Make visually interactive
                    item.style.cursor = 'pointer';
                    item.style.userSelect = 'none';
                    
                    console.log(`👆 Set up direct click: ${tabName}/${subscreenName}`);
                }
            });
            
            console.log(`✅ Tab ${tabName} submenu enhanced`);
        },

        updateActiveSubmenuItem(submenu, clickedItem) {
            // Remove active from all items in submenu
            submenu.querySelectorAll('.submenu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active to clicked item
            clickedItem.classList.add('active');
        },

        switchToSubscreen(tabName, subscreenName) {
            // Simple content switching without complex routing
            const container = document.querySelector(`#${tabName}-grid-view .tile-container`);
            if (container) {
                // Add loading state
                container.classList.add('loading-subscreen');
                
                // Simple content based on subscreen
                setTimeout(() => {
                    this.loadSimpleSubscreenContent(container, tabName, subscreenName);
                    container.classList.remove('loading-subscreen');
                }, 150);
            }
        },

        loadSimpleSubscreenContent(container, tabName, subscreenName) {
            console.log(`📋 Loading simple content: ${tabName}/${subscreenName}`);
            
            container.innerHTML = '';
            
            // Add subscreen identifier
            container.className = `tile-container subscreen-${subscreenName}`;
            
            // Create simple components based on subscreen type
            const components = this.createSimpleComponents(tabName, subscreenName);
            
            components.forEach(component => {
                container.appendChild(component);
            });
            
            console.log(`✅ Loaded ${components.length} components for ${tabName}/${subscreenName}`);
        },

        createSimpleComponents(tabName, subscreenName) {
            const components = [];
            
            // Define simple content based on tab and subscreen
            const contentMap = {
                'overview': {
                    'dashboard': [
                        { title: 'Team Overview', size: 'w12 h6', content: 'Overall team performance and key metrics' },
                        { title: 'Next Match', size: 'w8 h4', content: 'Upcoming fixture details' },
                        { title: 'League Position', size: 'w8 h4', content: '4th in Premier League' },
                        { title: 'Quick Stats', size: 'w6 h3', content: 'Key team statistics' }
                    ],
                    'reports': [
                        { title: 'Season Report', size: 'w14 h8', content: 'Comprehensive season analysis' },
                        { title: 'Performance Metrics', size: 'w10 h6', content: 'Team performance breakdown' },
                        { title: 'Export Tools', size: 'w6 h4', content: 'Report export options' }
                    ],
                    'statistics': [
                        { title: 'Team Statistics', size: 'w16 h8', content: 'Detailed team stats table' },
                        { title: 'Player Stats', size: 'w12 h6', content: 'Individual player statistics' },
                        { title: 'League Comparison', size: 'w8 h5', content: 'How we compare to other teams' }
                    ],
                    'news': [
                        { title: 'Latest News', size: 'w12 h8', content: 'Recent football news and updates' },
                        { title: 'Press Center', size: 'w10 h6', content: 'Press conferences and media' },
                        { title: 'Club News', size: 'w8 h4', content: 'Internal club announcements' }
                    ],
                    'inbox': [
                        { title: 'Messages', size: 'w14 h8', content: 'Inbox messages and communications' },
                        { title: 'Action Items', size: 'w10 h5', content: 'Items requiring attention' },
                        { title: 'Quick Reply', size: 'w8 h5', content: 'Fast response options' }
                    ]
                },
                'squad': {
                    'first-team': [
                        { title: 'Formation & Tactics', size: 'w15 h8', content: 'Current team formation' },
                        { title: 'Key Players', size: 'w12 h8', content: 'Star players overview' },
                        { title: 'Squad Status', size: 'w8 h5', content: 'Team availability and fitness' }
                    ],
                    'reserves': [
                        { title: 'Reserve Squad', size: 'w14 h8', content: 'Reserve team players' },
                        { title: 'Development Progress', size: 'w10 h6', content: 'Player development tracking' },
                        { title: 'Promotion Ready', size: 'w8 h5', content: 'Players ready for first team' }
                    ],
                    'youth': [
                        { title: 'Youth Prospects', size: 'w12 h8', content: 'Academy player prospects' },
                        { title: 'Academy Rating', size: 'w8 h6', content: 'Academy development status' },
                        { title: 'Development Plans', size: 'w10 h5', content: 'Youth development strategy' }
                    ],
                    'staff': [
                        { title: 'Coaching Staff', size: 'w14 h8', content: 'Coaching team overview' },
                        { title: 'Staff Performance', size: 'w10 h6', content: 'Staff effectiveness ratings' },
                        { title: 'Staff Budget', size: 'w8 h5', content: 'Coaching budget allocation' }
                    ],
                    'reports': [
                        { title: 'Squad Analysis', size: 'w16 h8', content: 'Detailed squad performance' },
                        { title: 'Position Analysis', size: 'w10 h6', content: 'Analysis by position' },
                        { title: 'Squad Insights', size: 'w8 h5', content: 'Key squad insights' }
                    ],
                    'dynamics': [
                        { title: 'Team Chemistry', size: 'w12 h6', content: 'Squad harmony and relationships' },
                        { title: 'Leadership', size: 'w8 h6', content: 'Team leaders and influence' },
                        { title: 'Morale Factors', size: 'w8 h5', content: 'What affects team morale' }
                    ]
                }
            };
            
            const tabContent = contentMap[tabName];
            if (!tabContent || !tabContent[subscreenName]) {
                // Default content
                return [this.createSimpleComponent('Default Content', 'w10 h6', `${tabName}/${subscreenName} content`)];
            }
            
            return tabContent[subscreenName].map(comp => 
                this.createSimpleComponent(comp.title, comp.size, comp.content)
            );
        },

        createSimpleComponent(title, size, content) {
            const component = document.createElement('div');
            const [width, height] = size.match(/w(\d+) h(\d+)/).slice(1, 3);
            
            component.className = `card subscreen-component ${size}`;
            component.setAttribute('data-grid-w', width);
            component.setAttribute('data-grid-h', height);
            component.style.gridColumn = `span ${width}`;
            component.style.gridRow = `span ${height}`;
            
            component.innerHTML = `
                <div class="card-header subscreen-header">
                    <span>${title}</span>
                </div>
                <div class="card-body subscreen-body">
                    <div class="simple-content">
                        <p>${content}</p>
                        <div class="content-stats">
                            <div class="stat-row">
                                <span class="stat-label">Status</span>
                                <span class="stat-value">Active</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Updated</span>
                                <span class="stat-value">Now</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Category</span>
                                <span class="stat-value">${title}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            return component;
        },

        ensureSubmenuVisibility() {
            console.log('👁️ Ensuring submenu visibility...');
            
            // Force Overview submenu to be visible on load
            setTimeout(() => {
                const overviewSubmenu = document.getElementById('overview-submenu');
                if (overviewSubmenu) {
                    overviewSubmenu.style.display = 'flex';
                    overviewSubmenu.classList.add('active');
                }
            }, 200);
        },

        addDirectNavStyles() {
            const directNavCSS = `
                /* Direct Navigation Styles */
                .nav-submenu {
                    background: var(--neutral-200) !important;
                    border-bottom: 1px solid rgba(0, 148, 204, 0.2) !important;
                    height: 38px !important;
                    z-index: 95 !important;
                }
                
                .nav-submenu.active {
                    display: flex !important;
                }
                
                .submenu-item {
                    padding: 6px 14px !important;
                    font-size: 12px !important;
                    color: rgba(255,255,255,0.6) !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    border-radius: 4px !important;
                    font-weight: 500 !important;
                    margin: 0 2px !important;
                    user-select: none !important;
                }
                
                .submenu-item:hover {
                    background: rgba(0, 148, 204, 0.2) !important;
                    color: #ffffff !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 6px rgba(0, 148, 204, 0.3) !important;
                }
                
                .submenu-item.active {
                    background: var(--primary-300) !important;
                    color: #ffffff !important;
                    font-weight: 600 !important;
                    box-shadow: 0 2px 4px rgba(0, 148, 204, 0.4) !important;
                }
                
                .submenu-item:active {
                    transform: translateY(0px) !important;
                    background: rgba(0, 148, 204, 0.4) !important;
                }
                
                /* App container positioning without breadcrumbs */
                .app-container {
                    padding-top: 126px !important; /* 40px header + 48px nav + 38px submenu */
                }
                
                /* Simple content styling */
                .simple-content {
                    font-size: 11px;
                }
                
                .simple-content p {
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 12px;
                    line-height: 1.4;
                }
                
                .content-stats {
                    margin-top: 8px;
                }
                
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 4px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 10px;
                }
                
                .stat-label {
                    color: rgba(255, 255, 255, 0.6);
                }
                
                .stat-value {
                    color: white;
                    font-weight: 600;
                }
                
                /* Loading state */
                .loading-subscreen {
                    opacity: 0.8;
                    transition: opacity 0.2s ease;
                }
                
                .loading-subscreen::after {
                    content: 'Loading subscreen...';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 148, 204, 0.9);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 1000;
                    pointer-events: none;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'direct-navigation-styles';
            style.textContent = directNavCSS;
            document.head.appendChild(style);
            
            console.log('✅ Direct navigation styles added');
        }
    };

    // Override existing tab switching to work with direct navigation
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tab, element) {
        console.log(`🔄 Tab switch: ${tab}`);
        
        // Update active nav
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        element.classList.add('active');
        
        // Hide all pages
        document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
        
        // Show selected page
        const page = document.getElementById(tab + '-page');
        if (page) {
            page.classList.add('active');
        }
        
        // Update submenu visibility
        document.querySelectorAll('.nav-submenu').forEach(s => s.classList.remove('active'));
        const submenu = document.getElementById(tab + '-submenu');
        if (submenu) {
            submenu.classList.add('active');
            submenu.style.display = 'flex';
        }
        
        // Load default subscreen content
        setTimeout(() => {
            const defaultSubscreens = {
                'overview': 'dashboard',
                'squad': 'first-team',
                'tactics': 'formation',
                'training': 'schedule',
                'transfers': 'transfer-hub',
                'finances': 'overview',
                'fixtures': 'calendar'
            };
            
            const defaultSubscreen = defaultSubscreens[tab] || 'dashboard';
            SubmenuDirectFix.switchToSubscreen(tab, defaultSubscreen);
            
            // Update active submenu item
            if (submenu) {
                const items = submenu.querySelectorAll('.submenu-item');
                items.forEach(item => item.classList.remove('active'));
                const activeItem = submenu.querySelector(`[data-subscreen="${defaultSubscreen}"]`);
                if (activeItem) activeItem.classList.add('active');
            }
        }, 100);
    };

    // Initialize the fix
    SubmenuDirectFix.init();
    
    // Make available globally
    window.SubmenuDirectFix = SubmenuDirectFix;

})();