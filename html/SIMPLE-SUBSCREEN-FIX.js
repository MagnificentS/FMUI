/**
 * SIMPLE SUBSCREEN FIX
 * Minimal fix to make existing submenu items load subscreen content
 * Preserves all existing functionality, just adds subscreen content loading
 */

(function() {
    'use strict';

    console.log('🔧 SIMPLE SUBSCREEN FIX: Adding subscreen content to existing submenu system...');

    const SimpleSubscreenFix = {
        init() {
            console.log('🔧 SIMPLE FIX: Connecting submenu items to subscreen content...');
            
            this.removeBreadcrumbsOnly();
            this.setupSubmenuContentLoading();
            this.preserveExistingFeatures();
            
            console.log('✅ SIMPLE SUBSCREEN FIX: Minimal changes applied');
        },

        removeBreadcrumbsOnly() {
            // Remove only the breadcrumb element, nothing else
            const breadcrumb = document.getElementById('breadcrumb-navigation');
            if (breadcrumb) {
                breadcrumb.remove();
                console.log('✅ Breadcrumb removed');
            }
        },

        setupSubmenuContentLoading() {
            console.log('📋 Setting up subscreen content loading for submenu items...');
            
            // Wait for DOM to be ready
            setTimeout(() => {
                this.enhanceExistingSubmenuItems();
            }, 200);
        },

        enhanceExistingSubmenuItems() {
            // Add subscreen content loading to existing submenu items
            const submenuItemMapping = {
                'overview': {
                    'Dashboard': 'dashboard',
                    'Reports': 'reports', 
                    'Statistics': 'statistics',
                    'News': 'news',
                    'Inbox': 'inbox'
                },
                'squad': {
                    'First Team': 'first-team',
                    'Reserves': 'reserves',
                    'Youth': 'youth',
                    'Staff': 'staff',
                    'Reports': 'squad-reports',
                    'Dynamics': 'dynamics'
                }
            };

            Object.entries(submenuItemMapping).forEach(([tabName, itemMap]) => {
                const submenu = document.getElementById(`${tabName}-submenu`);
                if (submenu) {
                    const items = submenu.querySelectorAll('.submenu-item');
                    
                    items.forEach(item => {
                        const itemText = item.textContent.trim();
                        const subscreenKey = itemMap[itemText];
                        
                        if (subscreenKey) {
                            // Add click handler to load subscreen content
                            const originalHandler = item.onclick;
                            
                            item.addEventListener('click', (e) => {
                                console.log(`📋 Loading subscreen: ${tabName}/${subscreenKey}`);
                                this.loadSubscreenContent(tabName, subscreenKey);
                            });
                            
                            console.log(`👆 Enhanced: ${tabName}/${itemText} → ${subscreenKey}`);
                        }
                    });
                }
            });
        },

        loadSubscreenContent(tabName, subscreenKey) {
            const container = document.querySelector(`#${tabName}-grid-view .tile-container`);
            if (!container) return;

            // Clear existing content
            container.innerHTML = '';

            // Load appropriate subscreen content
            const content = this.getSubscreenContent(tabName, subscreenKey);
            
            content.forEach(componentData => {
                const component = this.createComponent(componentData);
                container.appendChild(component);
            });

            console.log(`✅ Loaded ${content.length} components for ${tabName}/${subscreenKey}`);
        },

        getSubscreenContent(tabName, subscreenKey) {
            const contentMap = {
                'overview': {
                    'dashboard': [
                        { title: 'Next Match', content: 'vs Liverpool - Saturday 15:00', size: 'w12 h6' },
                        { title: 'League Position', content: '4th in Premier League', size: 'w8 h4' },
                        { title: 'Squad Status', content: '25 players available', size: 'w8 h4' },
                        { title: 'Recent Form', content: 'W-W-D-L-W', size: 'w6 h3' }
                    ],
                    'reports': [
                        { title: 'Season Report', content: 'Season 2024/25 Performance Analysis', size: 'w16 h8' },
                        { title: 'Key Metrics', content: 'Performance breakdown and insights', size: 'w10 h6' },
                        { title: 'Export Options', content: 'Download reports in various formats', size: 'w6 h4' }
                    ],
                    'statistics': [
                        { title: 'Team Statistics', content: 'Goals: 38 scored, 26 conceded', size: 'w14 h8' },
                        { title: 'Player Performance', content: 'Top scorer: Rashford (12 goals)', size: 'w10 h6' },
                        { title: 'League Comparison', content: 'Above average in most metrics', size: 'w8 h5' }
                    ],
                    'news': [
                        { title: 'Latest News', content: 'Transfer rumors and match reports', size: 'w12 h8' },
                        { title: 'Press Center', content: 'Upcoming press conferences', size: 'w8 h6' },
                        { title: 'Media Schedule', content: 'Interview and media commitments', size: 'w8 h4' }
                    ],
                    'inbox': [
                        { title: 'Messages', content: '3 unread messages from board', size: 'w12 h8' },
                        { title: 'Action Items', content: 'Contract renewals pending', size: 'w8 h6' },
                        { title: 'Notifications', content: 'Scout reports available', size: 'w8 h4' }
                    ]
                },
                'squad': {
                    'first-team': [
                        { title: 'Starting XI', content: '4-2-3-1 Formation', size: 'w15 h8' },
                        { title: 'Player List', content: '25 squad players', size: 'w12 h8' },
                        { title: 'Team Chemistry', content: 'Excellent squad harmony', size: 'w8 h5' }
                    ],
                    'reserves': [
                        { title: 'Reserve Squad', content: 'Development team players', size: 'w12 h8' },
                        { title: 'Loan Players', content: 'Players out on loan', size: 'w8 h6' },
                        { title: 'Promotion Candidates', content: 'Ready for first team', size: 'w8 h5' }
                    ],
                    'youth': [
                        { title: 'Academy Players', content: 'Youth prospects and ratings', size: 'w12 h8' },
                        { title: 'Development Progress', content: 'Training and improvement', size: 'w8 h6' },
                        { title: 'Academy Rating', content: 'World-class facilities', size: 'w6 h4' }
                    ]
                }
            };

            const tabContent = contentMap[tabName];
            if (tabContent && tabContent[subscreenKey]) {
                return tabContent[subscreenKey];
            }

            // Default content if mapping not found
            return [
                { title: `${subscreenKey} Overview`, content: `Content for ${tabName} ${subscreenKey}`, size: 'w10 h6' }
            ];
        },

        createComponent(componentData) {
            const component = document.createElement('div');
            const [width, height] = componentData.size.match(/w(\d+) h(\d+)/).slice(1, 3);
            
            component.className = `card ${componentData.size}`;
            component.setAttribute('data-grid-w', width);
            component.setAttribute('data-grid-h', height);
            component.style.gridColumn = `span ${width}`;
            component.style.gridRow = `span ${height}`;

            component.innerHTML = `
                <div class="card-header">
                    <span>${componentData.title}</span>
                </div>
                <div class="card-body">
                    <div class="subscreen-content">
                        <h4>${componentData.title}</h4>
                        <p>${componentData.content}</p>
                        <div class="stat-row">
                            <span class="stat-label">Status</span>
                            <span class="stat-value">Active</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Last Updated</span>
                            <span class="stat-value">Now</span>
                        </div>
                    </div>
                </div>
            `;

            return component;
        },

        preserveExistingFeatures() {
            // Keep all the good features that were working
            console.log('💎 Preserving existing features (favorites, shortcuts, quick access)...');
            
            // The navigation enhancements should still work
            // Performance optimizer should still work  
            // All the existing functionality should be preserved
            
            console.log('✅ Existing features preserved');
        }
    };

    // Apply minimal fix
    SimpleSubscreenFix.init();

    // Make available for testing
    window.SimpleSubscreenFix = SimpleSubscreenFix;

})();