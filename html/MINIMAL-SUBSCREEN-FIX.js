/**
 * MINIMAL SUBSCREEN FIX
 * Disable all complex modules and add simple submenu → content functionality
 * Preserve favorites, shortcuts, and other good features
 */

(function() {
    'use strict';

    console.log('🔧 MINIMAL SUBSCREEN FIX: Disabling complex modules and adding simple submenu functionality...');

    const MinimalFix = {
        init() {
            console.log('🔧 MINIMAL: Going back to simple approach...');
            
            this.disableComplexModules();
            this.removeBreadcrumbOnly();
            this.addSimpleSubmenuContent();
            this.preserveGoodFeatures();
            
            console.log('✅ MINIMAL SUBSCREEN FIX: Simple functionality restored');
        },

        disableComplexModules() {
            console.log('🚫 Disabling conflicting modules...');
            
            // Disable any functions that might interfere with our content loading
            if (window.loadPageCards) {
                window.loadPageCards = () => console.log('🚫 loadPageCards disabled');
            }
            
            if (window.loadAllPages) {
                window.loadAllPages = () => console.log('🚫 loadAllPages disabled');
            }
            
            // Disable the original tab initialization that might be overriding our content
            const originalInit = window.initializeCardFeatures;
            if (originalInit) {
                window.initializeCardFeatures = () => {
                    console.log('🔧 initializeCardFeatures called but not overriding content');
                    // Only run if no custom content is loaded
                    if (!document.querySelector('.interactive-formation-card, .setpiece-designer')) {
                        originalInit();
                    }
                };
            }
            
            console.log('✅ Conflicting modules disabled');
        },

        removeBreadcrumbOnly() {
            // Just remove breadcrumb element, nothing else
            const breadcrumb = document.getElementById('breadcrumb-navigation');
            if (breadcrumb) {
                breadcrumb.remove();
                console.log('✅ Breadcrumb removed');
            }
        },

        addSimpleSubmenuContent() {
            console.log('📋 Adding submenu content loading...');
            
            // Override the original switchTab function to work with our system
            this.overrideTabSwitching();
            
            // Wait for DOM to be ready
            setTimeout(() => {
                this.setupSimpleSubmenuClicks();
                // Load default content on page load
                this.loadDefaultContent();
            }, 100);
        },

        overrideTabSwitching() {
            console.log('🔧 Overriding tab switching to work with our content system...');
            
            // Store the original switchTab function
            const originalSwitchTab = window.switchTab;
            
            // Override with our enhanced version
            window.switchTab = (tab, element) => {
                console.log(`🔄 Enhanced tab switch to: ${tab}`);
                
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
                }
                
                // Load default content for this tab instead of using pageStates
                setTimeout(() => {
                    this.loadDefaultContentForTab(tab);
                }, 50);
                
                console.log(`✅ Enhanced tab switch to ${tab} complete`);
            };
            
            console.log('✅ Tab switching overridden');
        },

        loadDefaultContentForTab(tab) {
            console.log(`🏠 Loading default content for ${tab}...`);
            
            const defaultContent = {
                'overview': () => this.createDashboardContent(),
                'squad': () => this.createFirstTeamContent(),
                'tactics': () => this.createFormationContent(),
                'training': () => this.createTrainingScheduleContent(),
                'transfers': () => this.createTransferHubContent(),
                'finances': () => this.createFinancesOverviewContent(),
                'fixtures': () => this.createCalendarContent()
            };
            
            const contentCreator = defaultContent[tab];
            if (contentCreator) {
                const content = contentCreator();
                this.loadContentForTab(tab, content);
                
                // Set the first submenu item as active
                const submenu = document.getElementById(`${tab}-submenu`);
                if (submenu) {
                    const firstItem = submenu.querySelector('.submenu-item');
                    if (firstItem) {
                        submenu.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                        firstItem.classList.add('active');
                    }
                }
                
                console.log(`✅ Default content loaded for ${tab}`);
            }
        },

        loadDefaultContent() {
            console.log('🏠 Loading default Overview Dashboard content...');
            
            // Only load default content once on initial page load
            if (!this.hasLoadedDefault) {
                this.loadContentForTab('overview', this.createDashboardContent());
                this.hasLoadedDefault = true;
                
                // Ensure Overview tab and Dashboard submenu item are active
                const overviewTab = document.querySelector('button[onclick*="overview"]');
                if (overviewTab) {
                    overviewTab.classList.add('active');
                }
                
                const overviewSubmenu = document.getElementById('overview-submenu');
                if (overviewSubmenu) {
                    overviewSubmenu.classList.add('active');
                    const dashboardItem = overviewSubmenu.querySelector('.submenu-item');
                    if (dashboardItem) {
                        dashboardItem.classList.add('active');
                    }
                }
                
                console.log('✅ Default Overview Dashboard loaded');
            }
        },

        setupSimpleSubmenuClicks() {
            console.log('👆 Setting up simple submenu clicks...');
            
            // Overview submenu
            this.setupSubmenuForTab('overview', {
                'Dashboard': () => this.createDashboardContent(),
                'Reports': () => this.createReportsContent(),
                'Statistics': () => this.createStatisticsContent(),
                'News': () => this.createNewsContent(),
                'Inbox': () => this.createInboxContent()
            });
            
            // Squad submenu  
            this.setupSubmenuForTab('squad', {
                'First Team': () => this.createFirstTeamContent(),
                'Reserves': () => this.createReservesContent(),
                'Youth': () => this.createYouthContent(),
                'Staff': () => this.createStaffContent(),
                'Reports': () => this.createSquadReportsContent(),
                'Dynamics': () => this.createDynamicsContent()
            });

            // Tactics submenu
            this.setupSubmenuForTab('tactics', {
                'Formation': () => this.createFormationContent(),
                'Instructions': () => this.createInstructionsContent(),
                'Set Pieces': () => this.createSetPiecesContent(),
                'Opposition': () => this.createOppositionContent(),
                'Analysis': () => this.createTacticsAnalysisContent()
            });

            // Training submenu  
            this.setupSubmenuForTab('training', {
                'Schedule': () => this.createTrainingScheduleContent(),
                'Individual': () => this.createIndividualTrainingContent(),
                'Coaches': () => this.createCoachesContent(),
                'Facilities': () => this.createFacilitiesContent(),
                'Reports': () => this.createTrainingReportsContent()
            });

            // Transfers submenu
            this.setupSubmenuForTab('transfers', {
                'Transfer Hub': () => this.createTransferHubContent(),
                'Scout Reports': () => this.createScoutReportsContent(),
                'Shortlist': () => this.createShortlistContent(),
                'Loans': () => this.createLoansContent(),
                'Contract Offers': () => this.createContractOffersContent(),
                'Director': () => this.createDirectorContent()
            });

            // Finances submenu
            this.setupSubmenuForTab('finances', {
                'Overview': () => this.createFinancesOverviewContent(),
                'Income': () => this.createIncomeContent(),
                'Expenditure': () => this.createExpenditureContent(),
                'FFP': () => this.createFFPContent(),
                'Projections': () => this.createProjectionsContent(),
                'Sponsors': () => this.createSponsorsContent()
            });

            // Fixtures submenu
            this.setupSubmenuForTab('fixtures', {
                'Calendar': () => this.createCalendarContent(),
                'Results': () => this.createResultsContent(),
                'Schedule': () => this.createFixturesScheduleContent(),
                'Rules': () => this.createRulesContent(),
                'History': () => this.createHistoryContent()
            });
            
            console.log('✅ Simple submenu clicks set up');
        },

        setupSubmenuForTab(tabName, contentMap) {
            const submenu = document.getElementById(`${tabName}-submenu`);
            if (!submenu) return;
            
            const items = submenu.querySelectorAll('.submenu-item');
            
            items.forEach(item => {
                const itemText = item.textContent.trim();
                const contentCreator = contentMap[itemText];
                
                if (contentCreator) {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`🔍 SUBMENU CLICK: ${tabName}/${itemText}`);
                        console.log(`🔍 Content creator type:`, typeof contentCreator);
                        
                        // Update active state
                        items.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        
                        // Call the content creator function to get fresh content
                        const content = typeof contentCreator === 'function' ? contentCreator() : contentCreator;
                        console.log(`🔍 Generated content:`, content.length, 'components');
                        console.log(`🔍 First component title:`, content[0]?.includes ? 'HTML' : 'Unknown');
                        
                        // Load content
                        this.loadContentForTab(tabName, content);
                    });
                    
                    console.log(`👆 Set up: ${tabName}/${itemText}`);
                }
            });
        },

        loadContentForTab(tabName, components) {
            console.log(`🔍 Loading content for tab: ${tabName}`);
            
            // Ensure the correct page is active first
            document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
            const targetPage = document.getElementById(`${tabName}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                console.log(`✅ Activated ${tabName} page`);
            }
            
            const container = document.querySelector(`#${tabName}-grid-view .tile-container`);
            if (!container) {
                console.error(`❌ Container not found for ${tabName}`);
                return;
            }
            
            console.log(`📋 Found container for ${tabName}, loading ${components.length} components`);
            
            // Clear existing content
            container.innerHTML = '';
            
            // Add components
            components.forEach(componentHTML => {
                container.innerHTML += componentHTML;
            });
            
            // CRITICAL FIX: Re-run enhancement scripts after content loads
            setTimeout(() => {
                this.enhanceNewlyLoadedContent(container, tabName);
            }, 50);
            
            console.log(`✅ Loaded content for ${tabName}`);
        },

        enhanceNewlyLoadedContent(container, tabName) {
            console.log(`🎨 Enhancing newly loaded content for ${tabName}...`);
            
            // Re-run tactical enhancements for tactics-related content
            if (window.TacticalFormationWidget && tabName === 'tactics') {
                window.TacticalFormationWidget.upgradeExistingFormationCards();
            }
            
            if (window.SetPieceDesignerWidget && tabName === 'tactics') {
                window.SetPieceDesignerWidget.upgradeExistingSetPieceCards();
            }
            
            // Re-initialize card functionality for new cards
            if (window.initializeCardFeatures) {
                window.initializeCardFeatures();
            }
            
            console.log(`✅ Content enhanced for ${tabName}`);
        },

        // Simple content creators
        createDashboardContent() {
            return [
                this.createCard('Next Match', 'vs Liverpool - Saturday 15:00<br>Premier League', 'w12 h6'),
                this.createCard('League Position', '4th in Premier League<br>42 points from 20 games', 'w8 h4'),
                this.createCard('Squad Status', '25 players available<br>3 injured, 0 suspended', 'w8 h4'),
                this.createCard('Recent Form', 'W-W-D-L-W<br>10 points from last 5 games', 'w6 h3')
            ];
        },

        createReportsContent() {
            return [
                this.createCard('Season Report', 'Season 2024/25 Performance Analysis<br>Goals: 38 scored, 26 conceded', 'w16 h8'),
                this.createCard('Key Metrics', 'xG: 1.8 per game<br>Possession: 58%<br>Pass Accuracy: 84%', 'w10 h6'),
                this.createCard('Export Options', 'Download reports<br>PDF, Excel, CSV formats', 'w6 h4')
            ];
        },

        createStatisticsContent() {
            return [
                this.createCard('Team Statistics', 'League Performance<br>Goals For: 38<br>Goals Against: 26<br>Clean Sheets: 9', 'w14 h8'),
                this.createCard('Player Stats', 'Top Scorer: Rashford (12)<br>Top Assists: Bruno (8)<br>Best Rating: Bruno (8.2)', 'w10 h6'),
                this.createCard('League Comparison', 'Above average in:<br>Goals scored, Pass accuracy<br>Below average in: Possession', 'w8 h5')
            ];
        },

        createNewsContent() {
            return [
                this.createCard('Latest News', 'Transfer Window Updates<br>Contract Extension Talks<br>Injury Recovery News', 'w12 h8'),
                this.createCard('Press Center', 'Pre-match conference: Friday<br>Post-match interviews<br>Media obligations', 'w8 h6'),
                this.createCard('Media Schedule', 'Upcoming interviews<br>Photo shoots<br>Press commitments', 'w8 h4')
            ];
        },

        createInboxContent() {
            return [
                this.createCard('Messages', '3 unread messages<br>Board: Transfer budget update<br>Agent: Contract offer', 'w12 h8'),
                this.createCard('Action Items', 'Contract renewals: 2<br>Medical updates: 1<br>Board meetings: 1', 'w8 h6'),
                this.createCard('Notifications', 'Scout reports: 5 new<br>Youth promotions: 2<br>Loan recalls: 1', 'w8 h4')
            ];
        },

        createFirstTeamContent() {
            return [
                this.createCard('Starting XI', '4-2-3-1 Formation<br>95% familiarity<br>High effectiveness vs 4-4-2', 'w15 h8'),
                this.createCard('Key Players', 'Bruno Fernandes (C) - 8.2<br>Marcus Rashford - 7.8<br>Casemiro - 7.5', 'w12 h8'),
                this.createCard('Squad Fitness', 'Average fitness: 82%<br>Match ready: 22 players<br>Needs rest: 3 players', 'w8 h5')
            ];
        },

        createReservesContent() {
            return [
                this.createCard('Reserve Squad', 'Amad Diallo - Ready<br>Hannibal Mejbri - Developing<br>Brandon Williams - Backup', 'w12 h8'),
                this.createCard('Loan Watch', 'Greenwood - 8 goals at Getafe<br>Amrabat - Option to buy<br>5 others developing', 'w8 h6'),
                this.createCard('Promotion Ready', 'Amad Diallo: Ready now<br>H. Mejbri: 2-3 months<br>W. Kambwala: 6+ months', 'w8 h5')
            ];
        },

        createYouthContent() {
            return [
                this.createCard('Academy Rating', '92% Academy Rating<br>World Class facilities<br>Excellent coaching staff', 'w12 h8'),
                this.createCard('Top Prospects', 'Alejandro Garnacho: 8.8 potential<br>Kobbie Mainoo: 8.5 potential<br>Omari Forson: 7.8 potential', 'w8 h6'),
                this.createCard('Development', 'U23: 2nd place<br>U18: 1st place<br>Youth intake: Very good', 'w6 h4')
            ];
        },

        createStaffContent() {
            return [
                this.createCard('Coaching Staff', 'Erik ten Hag - Manager (8.5)<br>Mitchell van der Gaag - Assistant<br>Steve McClaren - Coach', 'w12 h8'),
                this.createCard('Staff Performance', 'Excellent: 2 staff<br>Good: 3 staff<br>Adequate: 0 staff', 'w8 h6'),
                this.createCard('Staff Budget', 'Total wages: £315K/week<br>Available budget: £50K/week<br>Next review: June 2024', 'w6 h4')
            ];
        },

        createSquadReportsContent() {
            return [
                this.createCard('Squad Analysis', 'Performance trends<br>Position strengths/weaknesses<br>Tactical effectiveness', 'w14 h8'),
                this.createCard('Player Development', 'Improvement rates<br>Training effectiveness<br>Potential assessments', 'w8 h6'),
                this.createCard('Recommendations', 'Transfer priorities<br>Contract renewals<br>Tactical adjustments', 'w8 h5')
            ];
        },

        createDynamicsContent() {
            return [
                this.createCard('Team Chemistry', '87% team chemistry<br>Improving trend<br>Strong leadership group', 'w12 h6'),
                this.createCard('Leadership', 'Captain: Bruno Fernandes<br>Vice: Casemiro<br>Influencers: Rashford, Martinez', 'w8 h6'),
                this.createCard('Morale Factors', 'Positive: Recent wins (+15)<br>Negative: Key injuries (-5)<br>Overall: Excellent', 'w8 h5')
            ];
        },

        // Tactics content creators
        createFormationContent() {
            return [
                this.createInteractiveFormationCard(),
                this.createCard('Formation Analysis', 'Defensive stability: 82%<br>Attacking threat: 78%<br>Balance: Excellent', 'w9 h6'),
                this.createCard('Alternative Formations', '4-3-3 Gegenpress: 72%<br>3-5-2 Counter: 68%<br>4-4-2 Route One: 65%', 'w8 h5')
            ];
        },

        createInteractiveFormationCard() {
            const [width, height] = ['15', '8'];
            
            return `
                <div class="card w15 h8" data-grid-w="15" data-grid-h="8" style="grid-column: span 15; grid-row: span 8;">
                    <div class="card-header">
                        <span>Interactive Formation Designer</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                            <div class="card-menu-dropdown">
                                <div class="card-menu-item" onclick="pinCard(this)">Pin</div>
                                <div class="card-menu-item" onclick="removeCard(this)">Remove</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="formation-widget">
                            <div class="formation-header">
                                <div class="formation-selector">
                                    <select class="formation-dropdown" onchange="TacticalFormationWidget.switchFormation(this.closest('.formation-widget'), this.value)">
                                        <option value="4-2-3-1" selected>4-2-3-1</option>
                                        <option value="4-3-3">4-3-3</option>
                                        <option value="3-5-2">3-5-2</option>
                                        <option value="4-4-2">4-4-2</option>
                                    </select>
                                </div>
                                <div class="formation-stats">
                                    <span class="formation-familiarity">95% Familiar</span>
                                    <span class="formation-effectiveness">High Effectiveness</span>
                                </div>
                            </div>
                            
                            <div class="interactive-pitch">
                                <div class="pitch-background"></div>
                                <div class="player-positions">
                                    <!-- Goalkeeper -->
                                    <div class="player-position gk" data-position="GK" style="left: 50%; top: 85%;">
                                        <div class="player-circle">
                                            <span class="player-name">Onana</span>
                                            <span class="player-rating">7.4</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Defense -->
                                    <div class="player-position def" data-position="LB" style="left: 15%; top: 65%;">
                                        <div class="player-circle">
                                            <span class="player-name">Shaw</span>
                                            <span class="player-rating">7.3</span>
                                        </div>
                                    </div>
                                    <div class="player-position def" data-position="CB" style="left: 35%; top: 70%;">
                                        <div class="player-circle">
                                            <span class="player-name">Martinez</span>
                                            <span class="player-rating">7.6</span>
                                        </div>
                                    </div>
                                    <div class="player-position def" data-position="CB" style="left: 65%; top: 70%;">
                                        <div class="player-circle">
                                            <span class="player-name">Varane</span>
                                            <span class="player-rating">7.5</span>
                                        </div>
                                    </div>
                                    <div class="player-position def" data-position="RB" style="left: 85%; top: 65%;">
                                        <div class="player-circle">
                                            <span class="player-name">Dalot</span>
                                            <span class="player-rating">7.2</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Midfield -->
                                    <div class="player-position mid" data-position="DM" style="left: 30%; top: 45%;">
                                        <div class="player-circle">
                                            <span class="player-name">Casemiro</span>
                                            <span class="player-rating">7.5</span>
                                        </div>
                                    </div>
                                    <div class="player-position mid" data-position="CM" style="left: 70%; top: 45%;">
                                        <div class="player-circle">
                                            <span class="player-name">Mainoo</span>
                                            <span class="player-rating">7.3</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Attack -->
                                    <div class="player-position att" data-position="LW" style="left: 15%; top: 25%;">
                                        <div class="player-circle">
                                            <span class="player-name">Rashford</span>
                                            <span class="player-rating">7.8</span>
                                        </div>
                                    </div>
                                    <div class="player-position att" data-position="AM" style="left: 50%; top: 30%;">
                                        <div class="player-circle">
                                            <span class="player-name">Bruno (C)</span>
                                            <span class="player-rating">8.2</span>
                                        </div>
                                    </div>
                                    <div class="player-position att" data-position="RW" style="left: 85%; top: 25%;">
                                        <div class="player-circle">
                                            <span class="player-name">Garnacho</span>
                                            <span class="player-rating">7.4</span>
                                        </div>
                                    </div>
                                    
                                    <!-- Striker -->
                                    <div class="player-position str" data-position="ST" style="left: 50%; top: 10%;">
                                        <div class="player-circle">
                                            <span class="player-name">Højlund</span>
                                            <span class="player-rating">7.2</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="formation-analysis">
                                    <div class="analysis-metrics">
                                        <div class="metric">
                                            <span class="metric-name">Width</span>
                                            <div class="metric-bar">
                                                <div class="metric-fill" style="width: 75%;"></div>
                                            </div>
                                            <span class="metric-value">75</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-name">Compactness</span>
                                            <div class="metric-bar">
                                                <div class="metric-fill" style="width: 82%;"></div>
                                            </div>
                                            <span class="metric-value">82</span>
                                        </div>
                                        <div class="metric">
                                            <span class="metric-name">Balance</span>
                                            <div class="metric-bar">
                                                <div class="metric-fill" style="width: 88%;"></div>
                                            </div>
                                            <span class="metric-value">88</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
        },

        createInstructionsContent() {
            return [
                this.createCard('Team Instructions', 'Mentality: Positive<br>Width: Fairly Wide<br>Tempo: Higher<br>Pressing: More Often', 'w12 h8'),
                this.createCard('Player Instructions', 'Bruno: Advanced Playmaker<br>Rashford: Inside Forward<br>Casemiro: Deep Lying Playmaker', 'w10 h6'),
                this.createCard('Situational', 'Leading: Hold possession<br>Losing: Push higher<br>Drawing: More direct', 'w8 h5')
            ];
        },

        createSetPiecesContent() {
            return [
                this.createInteractiveSetPieceCard(),
                this.createCard('Set Piece Takers', 'Corners: Bruno Fernandes<br>Free Kicks: Rashford/Bruno<br>Penalties: Bruno<br>Throw-ins: Shaw (Long)', 'w10 h6'),
                this.createCard('Effectiveness', 'Corner conversion: 12%<br>Free kick success: 18%<br>Penalty record: 85%', 'w8 h5')
            ];
        },

        createInteractiveSetPieceCard() {
            return `
                <div class="card w14 h8" data-grid-w="14" data-grid-h="8" style="grid-column: span 14; grid-row: span 8;">
                    <div class="card-header">
                        <span>Set Piece Designer</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                            <div class="card-menu-dropdown">
                                <div class="card-menu-item" onclick="pinCard(this)">Pin</div>
                                <div class="card-menu-item" onclick="removeCard(this)">Remove</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="setpiece-designer">
                            <div class="setpiece-controls">
                                <div class="setpiece-type-selector">
                                    <button class="setpiece-btn active" data-type="corner" onclick="SetPieceDesignerWidget.switchSetPieceType(this.closest('.setpiece-designer'), 'corner'); this.parentElement.querySelectorAll('.setpiece-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">Corner</button>
                                    <button class="setpiece-btn" data-type="freekick" onclick="SetPieceDesignerWidget.switchSetPieceType(this.closest('.setpiece-designer'), 'freekick'); this.parentElement.querySelectorAll('.setpiece-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">Free Kick</button>
                                    <button class="setpiece-btn" data-type="throwin" onclick="SetPieceDesignerWidget.switchSetPieceType(this.closest('.setpiece-designer'), 'throwin'); this.parentElement.querySelectorAll('.setpiece-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');">Throw In</button>
                                </div>
                                <div class="setpiece-stats">
                                    <span class="success-rate">Success Rate: <strong>18%</strong></span>
                                    <span class="last-goal">Last Goal: 3 games ago</span>
                                </div>
                            </div>
                            
                            <div class="setpiece-pitch corner-setup">
                                <div class="pitch-section">
                                    <!-- Goal and penalty area markings -->
                                    <div class="goal-line"></div>
                                    <div class="six-yard-box"></div>
                                    <div class="penalty-area"></div>
                                    <div class="corner-arc"></div>
                                    
                                    <!-- Attacking players -->
                                    <div class="setpiece-player attacking" style="left: 85%; top: 70%;" data-role="corner-taker">
                                        <span class="player-name">Bruno</span>
                                        <span class="player-instruction">Taker</span>
                                    </div>
                                    
                                    <div class="setpiece-player attacking" style="left: 60%; top: 40%;" data-role="near-post">
                                        <span class="player-name">Martinez</span>
                                        <span class="player-instruction">Near Post</span>
                                    </div>
                                    
                                    <div class="setpiece-player attacking" style="left: 45%; top: 35%;" data-role="central">
                                        <span class="player-name">Varane</span>
                                        <span class="player-instruction">Central</span>
                                    </div>
                                    
                                    <div class="setpiece-player attacking" style="left: 30%; top: 45%;" data-role="far-post">
                                        <span class="player-name">Casemiro</span>
                                        <span class="player-instruction">Far Post</span>
                                    </div>
                                    
                                    <div class="setpiece-player attacking" style="left: 75%; top: 55%;" data-role="edge-box">
                                        <span class="player-name">Rashford</span>
                                        <span class="player-instruction">Edge</span>
                                    </div>
                                    
                                    <!-- Defending players -->
                                    <div class="setpiece-player defending" style="left: 50%; top: 20%;" data-role="goalkeeper">
                                        <span class="player-name">Keeper</span>
                                        <span class="player-instruction">Goal</span>
                                    </div>
                                    
                                    <div class="setpiece-player defending" style="left: 62%; top: 42%;" data-role="marker">
                                        <span class="player-name">Opp</span>
                                        <span class="player-instruction">Mark</span>
                                    </div>
                                    
                                    <!-- Movement arrows -->
                                    <div class="movement-arrow" style="left: 85%; top: 65%;">
                                        <svg width="30" height="15" viewBox="0 0 30 15">
                                            <defs>
                                                <marker id="arrowhead-corner" markerWidth="8" markerHeight="6" 
                                                        refX="7" refY="3" orient="auto">
                                                    <polygon points="0 0, 8 3, 0 6" fill="#00ff88"/>
                                                </marker>
                                            </defs>
                                            <line x1="5" y1="7" x2="25" y2="7" stroke="#00ff88" stroke-width="1.5" marker-end="url(#arrowhead-corner)"/>
                                        </svg>
                                    </div>
                                </div>
                                
                                <div class="setpiece-analysis">
                                    <div class="analysis-header">Set Piece Analysis</div>
                                    <div class="threat-zones">
                                        <div class="zone near-post">
                                            <span class="zone-label">Near Post</span>
                                            <span class="zone-threat">High</span>
                                        </div>
                                        <div class="zone central">
                                            <span class="zone-label">Central</span>
                                            <span class="zone-threat">Medium</span>
                                        </div>
                                        <div class="zone far-post">
                                            <span class="zone-label">Far Post</span>
                                            <span class="zone-threat">High</span>
                                        </div>
                                    </div>
                                    
                                    <div class="setpiece-effectiveness">
                                        <div class="effectiveness-metric">
                                            <span class="metric-label">Shot Probability</span>
                                            <div class="probability-bar">
                                                <div class="probability-fill" style="width: 65%;"></div>
                                            </div>
                                            <span class="metric-percent">65%</span>
                                        </div>
                                        <div class="effectiveness-metric">
                                            <span class="metric-label">Goal Probability</span>
                                            <div class="probability-bar">
                                                <div class="probability-fill" style="width: 18%;"></div>
                                            </div>
                                            <span class="metric-percent">18%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
        },

        createOppositionContent() {
            return [
                this.createCard('Next Opposition', 'Liverpool Analysis<br>Formation: 4-3-3<br>Strengths: High press, pace<br>Weaknesses: High line', 'w12 h8'),
                this.createCard('Counter Tactics', 'Long balls to bypass press<br>Quick transitions<br>Target their high line', 'w8 h6'),
                this.createCard('Key Players', 'Salah: Press tightly<br>Van Dijk: Avoid crosses<br>Klopp system: Quick passing', 'w8 h5')
            ];
        },

        createTacticsAnalysisContent() {
            return [
                this.createCard('Tactical Effectiveness', 'Pressing success: 84%<br>Build-up play: 76%<br>Chance creation: 71%', 'w14 h8'),
                this.createCard('vs Top 6', 'Record: 3W 2D 1L<br>Avg goals: 1.8<br>Defensive: Strong', 'w8 h6'),
                this.createCard('Home vs Away', 'Home: 85% win rate<br>Away: 62% win rate<br>Tactics adjustment needed', 'w8 h5')
            ];
        },

        // Training content creators
        createTrainingScheduleContent() {
            return [
                this.createCard('Weekly Schedule', 'Monday: Recovery (Light)<br>Tuesday: Tactical (Medium)<br>Wednesday: Physical (High)<br>Thursday: Technical (Medium)<br>Friday: Set Pieces (Light)', 'w14 h8'),
                this.createCard('Match Preparation', 'Focus: Defensive shape<br>Opposition analysis complete<br>Team talk: Passionate', 'w8 h6'),
                this.createCard('Intensity', 'Overall: Medium<br>Match prep: High<br>Recovery: Low', 'w8 h5')
            ];
        },

        createIndividualTrainingContent() {
            return [
                this.createCard('Individual Programs', 'Højlund: Finishing (75%)<br>Mainoo: Passing (82%)<br>Garnacho: Decision making (68%)<br>Antony: Weak foot (45%)', 'w12 h8'),
                this.createCard('Progress Tracking', 'Best trainer: Bruno<br>Most improved: Mainoo<br>Needs attention: Sancho', 'w8 h6'),
                this.createCard('Focus Areas', 'Technical: 40%<br>Physical: 30%<br>Mental: 30%', 'w6 h4')
            ];
        },

        createCoachesContent() {
            return [
                this.createCard('Coaching Staff', 'Erik ten Hag: Manager<br>Mitchell van der Gaag: Assistant<br>Steve McClaren: Coach<br>Craig Mawson: GK Coach', 'w12 h8'),
                this.createCard('Staff Ratings', 'Tactical: Excellent<br>Man Management: Good<br>Motivation: Excellent', 'w8 h6'),
                this.createCard('Coaching Focus', 'Attacking: 40%<br>Defensive: 35%<br>Set pieces: 25%', 'w6 h4')
            ];
        },

        createFacilitiesContent() {
            return [
                this.createCard('Training Facilities', 'Carrington: World Class<br>Youth facilities: Excellent<br>Medical center: State of art', 'w12 h6'),
                this.createCard('Capacity', 'Pitches: 16 available<br>Gym: Modern equipment<br>Recovery: Hydrotherapy', 'w8 h5'),
                this.createCard('Utilization', 'Peak usage: 85%<br>Availability: High<br>Maintenance: Excellent', 'w8 h5')
            ];
        },

        createTrainingReportsContent() {
            return [
                this.createCard('Training Analysis', 'Squad fitness: 87%<br>Match sharpness: 78%<br>Injury risk: Medium', 'w12 h8'),
                this.createCard('Individual Reports', 'Improving: 15 players<br>Stable: 8 players<br>Declining: 2 players', 'w8 h6'),
                this.createCard('Recommendations', 'Increase fitness work<br>Focus on set pieces<br>Youth integration', 'w8 h5')
            ];
        },

        // Transfers content creators
        createTransferHubContent() {
            return [
                this.createCard('Transfer Targets', 'J. Frimpong (RB): £40M<br>J. Branthwaite (CB): £60M<br>A. Onana (CM): £50M<br>I. Toney (ST): £70M', 'w14 h8'),
                this.createCard('Transfer Budget', 'Available: £55M<br>Spent: £65M<br>Sales: £32M<br>Net: -£33M', 'w8 h6'),
                this.createCard('Priority', 'Central defender: High<br>Right back: Medium<br>Striker: Medium', 'w8 h5')
            ];
        },

        createScoutReportsContent() {
            return [
                this.createCard('Latest Reports', 'Frimpong: 4/5 stars<br>Branthwaite: 4/5 stars<br>Olise: 3/5 stars<br>New reports: 12', 'w12 h8'),
                this.createCard('Scout Network', 'Active scouts: 8<br>Regions covered: Europe<br>Priority targets: 3', 'w8 h6'),
                this.createCard('Recommendations', 'Sign Frimpong: Yes<br>Monitor Branthwaite<br>Continue watching Olise', 'w8 h5')
            ];
        },

        createShortlistContent() {
            return [
                this.createCard('Transfer Shortlist', 'Defenders: 3 targets<br>Midfielders: 2 targets<br>Forwards: 1 target<br>Total: 6 players', 'w12 h8'),
                this.createCard('Age Profiles', 'Under 23: 4 players<br>23-27: 2 players<br>Over 27: 0 players', 'w8 h6'),
                this.createCard('Value Range', 'Under £30M: 2<br>£30-50M: 3<br>£50M+: 1', 'w6 h4')
            ];
        },

        createLoansContent() {
            return [
                this.createCard('Loan Watch', 'Greenwood: Getafe (8 goals)<br>Amrabat: Option to buy<br>Pellistri: In consideration', 'w12 h8'),
                this.createCard('Loan Policy', 'Out: Development focus<br>In: Squad depth<br>Recalls: 2 possible', 'w8 h6'),
                this.createCard('Performance', 'Excellent: 2 players<br>Good: 1 player<br>Below expectations: 0', 'w6 h4')
            ];
        },

        createContractOffersContent() {
            return [
                this.createCard('Pending Offers', 'Rashford: Extension talks<br>Mainoo: New deal offered<br>Varane: Considering options', 'w12 h8'),
                this.createCard('Expiring Contracts', '6 months: Varane, Martial<br>1 year: Evans<br>2 years: Maguire', 'w8 h6'),
                this.createCard('Negotiations', 'Active: 3<br>Stalled: 1<br>Completed: 2', 'w6 h4')
            ];
        },

        createDirectorContent() {
            return [
                this.createCard('Director Communications', 'Transfer budget: Approved<br>Wage structure: Under review<br>Youth investment: Increase', 'w12 h8'),
                this.createCard('Board Priorities', '1. Top 4 finish<br>2. Youth development<br>3. Financial stability', 'w8 h6'),
                this.createCard('Next Meeting', 'Date: Next Friday<br>Agenda: Summer planning<br>Items: 5', 'w6 h4')
            ];
        },

        // Finances content creators  
        createFinancesOverviewContent() {
            return [
                this.createCard('Financial Overview', 'Current balance: £45.2M<br>Transfer budget: £120M<br>Remaining: £55M<br>FFP status: Compliant', 'w14 h8'),
                this.createCard('Revenue Streams', 'Matchday: £110M/year<br>Commercial: £275M/year<br>Broadcasting: £215M/year', 'w8 h6'),
                this.createCard('Key Metrics', 'Revenue growth: +8%<br>Profit margin: 12%<br>Debt ratio: Low', 'w8 h5')
            ];
        },

        createIncomeContent() {
            return [
                this.createCard('Revenue Breakdown', 'Stadium: £3.8M/match<br>Merchandise: £125M/year<br>TV money: £215M/year<br>Sponsorship: £150M/year', 'w14 h8'),
                this.createCard('Seasonal Trends', 'Q1: £145M<br>Q2: £140M<br>Q3: £150M<br>Q4: £145M', 'w8 h6'),
                this.createCard('Growth Areas', 'Commercial: +15%<br>Matchday: +5%<br>Digital: +25%', 'w8 h5')
            ];
        },

        createExpenditureContent() {
            return [
                this.createCard('Expense Breakdown', 'Wages: £198M/year<br>Operations: £87M/year<br>Transfers: £125M/year<br>Infrastructure: £45M', 'w14 h8'),
                this.createCard('Wage Structure', 'Casemiro: £350K/w<br>Varane: £340K/w<br>Bruno: £300K/w<br>Rashford: £300K/w', 'w8 h6'),
                this.createCard('Cost Control', 'Wage cap: 70%<br>Current: 65%<br>Savings target: £20M', 'w8 h5')
            ];
        },

        createFFPContent() {
            return [
                this.createCard('FFP Compliance', 'Status: Compliant<br>Margin: £48M<br>Next review: June 2024<br>Risk level: Low', 'w12 h8'),
                this.createCard('Squad Cost', 'Total cost: 82%<br>Allowable: 100%<br>Efficiency: Good', 'w8 h6'),
                this.createCard('Projections', '2024: Safe<br>2025: Monitor<br>2026: Review needed', 'w6 h4')
            ];
        },

        createProjectionsContent() {
            return [
                this.createCard('Season Projection', 'Revenue: £590M<br>Profit: £45M<br>Growth: +8%<br>Performance: Strong', 'w12 h8'),
                this.createCard('Transfer Impact', 'Spending: £65M<br>Sales needed: £20M<br>Net position: -£45M', 'w8 h6'),
                this.createCard('Long-term', '3-year outlook: Positive<br>Stadium upgrade: 2025<br>Youth investment: Ongoing', 'w8 h5')
            ];
        },

        createSponsorsContent() {
            return [
                this.createCard('Sponsorship Portfolio', 'TeamViewer: £47M/year<br>Adidas: £90M/year<br>Stadium rights: Available<br>Partners: 15 active', 'w12 h8'),
                this.createCard('Renewal Status', 'Expiring 2024: 2 deals<br>Under negotiation: 3<br>New opportunities: 5', 'w8 h6'),
                this.createCard('Performance', 'Value increase: 12%<br>Activation rate: 85%<br>ROI: Excellent', 'w8 h5')
            ];
        },

        // Fixtures content creators
        createCalendarContent() {
            return [
                this.createCard('Upcoming Fixtures', 'Sat: Liverpool (H) - PL<br>Wed: Fulham (A) - PL<br>Sat: Brighton (H) - PL<br>Tue: Bayern (A) - UCL', 'w14 h8'),
                this.createCard('Fixture Congestion', 'Next 7 days: 3 matches<br>Next 14 days: 5 matches<br>Rotation: Recommended', 'w8 h6'),
                this.createCard('Competition Status', 'Premier League: 4th<br>Champions League: Group<br>FA Cup: 4th Round', 'w8 h5')
            ];
        },

        createResultsContent() {
            return [
                this.createCard('Recent Results', 'vs Arsenal: W 2-1<br>@ Chelsea: D 1-1<br>vs City: L 0-2<br>vs Spurs: W 3-1', 'w12 h8'),
                this.createCard('Form Analysis', 'Last 5: WWDLW<br>Points: 10/15<br>Goals for/against: 8/5', 'w8 h6'),
                this.createCard('Performance', 'Home: 9W 1D 0L<br>Away: 3W 2D 3L<br>vs Top 6: 3W 1D 2L', 'w8 h5')
            ];
        },

        createFixturesScheduleContent() {
            return [
                this.createCard('Match Schedule', 'This week: 2 matches<br>Next week: 1 match<br>International break: None<br>Training days: 4', 'w12 h8'),
                this.createCard('Competition Load', 'Premier League: 20 played<br>Champions League: 6 played<br>Cup competitions: 3 played', 'w8 h6'),
                this.createCard('Recovery Time', 'Between matches: 72h avg<br>Ideal: 96h<br>Risk level: Medium', 'w8 h5')
            ];
        },

        createRulesContent() {
            return [
                this.createCard('Competition Rules', 'Premier League: 38 games<br>Substitutions: 5 allowed<br>VAR: In use<br>Points: 3 for win', 'w12 h8'),
                this.createCard('Squad Regulations', 'Max squad: 25 players<br>Homegrown: 8 required<br>Foreign: 17 max', 'w8 h6'),
                this.createCard('Fair Play', 'Yellow cards: 23<br>Red cards: 1<br>Disciplinary points: Low', 'w6 h4')
            ];
        },

        createHistoryContent() {
            return [
                this.createCard('Historical Performance', 'Last season: 3rd place<br>Previous: 6th place<br>Best: 1st place (20 titles)<br>Worst: 7th place', 'w12 h8'),
                this.createCard('Head-to-Head', 'vs Liverpool: W2 D1 L2<br>vs City: W1 D2 L2<br>vs Arsenal: W3 D1 L1', 'w8 h6'),
                this.createCard('Milestones', 'Next: 100 PL wins<br>Manager tenure: 1.5 years<br>Stadium: 111 years', 'w8 h5')
            ];
        },

        createCard(title, content, size) {
            const [width, height] = size.match(/w(\d+) h(\d+)/).slice(1, 3);
            
            return `
                <div class="card ${size}" data-grid-w="${width}" data-grid-h="${height}" style="grid-column: span ${width}; grid-row: span ${height};">
                    <div class="card-header">
                        <span>${title}</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                            <div class="card-menu-dropdown">
                                <div class="card-menu-item" onclick="pinCard(this)">Pin</div>
                                <div class="card-menu-item" onclick="removeCard(this)">Remove</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="simple-content">
                            ${content}
                        </div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
        },

        preserveGoodFeatures() {
            console.log('💎 Preserving navigation enhancements (favorites, shortcuts, quick access)...');
            
            // Add navigation buttons to header
            this.addNavigationButtons();
            
            // Add simple CSS fix for positioning
            const simpleCSS = `
                /* Simple positioning fix */
                .app-container {
                    padding-top: 108px !important; /* 40px header + 48px nav + 20px margin */
                }
                
                .submenu-item {
                    cursor: pointer !important;
                    user-select: none !important;
                }
                
                .submenu-item:hover {
                    background: rgba(0, 148, 204, 0.15) !important;
                    color: #ffffff !important;
                }
                
                .submenu-item.active {
                    background: var(--primary-100) !important;
                    color: #ffffff !important;
                }
                
                .simple-content {
                    line-height: 1.4;
                    font-size: 12px;
                }
                
                /* Navigation buttons in header */
                .nav-buttons {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    margin-right: 12px;
                }
                
                .nav-btn {
                    width: 30px;
                    height: 30px;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .nav-btn:hover {
                    background: rgba(0,148,204,0.3);
                    border-color: rgba(0,148,204,0.5);
                    color: #ffffff;
                    transform: translateY(-1px);
                }
                
                .nav-btn svg {
                    width: 16px;
                    height: 16px;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'minimal-subscreen-styles';
            style.textContent = simpleCSS;
            document.head.appendChild(style);
            
            console.log('✅ Good features preserved');
        },

        addNavigationButtons() {
            console.log('🔘 Adding navigation buttons to header...');
            
            // Add navigation buttons to the header right section
            const headerRight = document.querySelector('.header-right-buttons');
            if (headerRight) {
                // Create navigation buttons container
                const navButtons = document.createElement('div');
                navButtons.className = 'nav-buttons';
                navButtons.innerHTML = `
                    <button class="nav-btn" onclick="NavigationEnhancements.toggleQuickAccess()" title="Quick Access & Favorites">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                        </svg>
                    </button>
                    <button class="nav-btn" onclick="NavigationEnhancements.showQuickSearch()" title="Search (Ctrl+K)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                        </svg>
                    </button>
                    <button class="nav-btn" onclick="NavigationEnhancements.showNavigationHistory()" title="History">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
                        </svg>
                    </button>
                `;
                
                // Insert before the date-time button
                const dateTimeBtn = headerRight.querySelector('.date-time-btn');
                if (dateTimeBtn) {
                    headerRight.insertBefore(navButtons, dateTimeBtn);
                } else {
                    headerRight.appendChild(navButtons);
                }
                
                console.log('✅ Navigation buttons added to header');
            }
        }
    };

    // Apply the minimal fix immediately
    MinimalFix.init();

    // Make available for testing
    window.MinimalFix = MinimalFix;

})();