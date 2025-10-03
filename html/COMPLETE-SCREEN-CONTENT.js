/**
 * COMPLETE SCREEN CONTENT
 * Agent 3 - Create rich, professional Football Manager content for all screens
 * Following ZENITH principles with sophisticated interactive elements
 */

(function() {
    'use strict';

    console.log('🎮 COMPLETE SCREEN CONTENT: Building professional Football Manager screens...');

    const ScreenContentEnhancer = {
        initialized: false,
        
        init() {
            if (this.initialized) return;
            
            console.log('🎮 SCREEN CONTENT: Enhancing all screens with rich content...');
            
            this.enhanceOverviewScreen();
            this.enhanceSquadScreen();
            this.enhanceTacticsScreen();
            this.enhanceTrainingScreen();
            this.enhanceTransfersScreen();
            this.enhanceFinancesScreen();
            this.enhanceFixturesScreen();
            this.setupSubmenus();
            
            this.initialized = true;
            console.log('✅ SCREEN CONTENT: All screens enhanced');
        },
        
        enhanceOverviewScreen() {
            console.log('🏠 Enhancing Overview screen...');
            
            // Add Performance Dashboard card if not present
            this.addCardToPage('overview', {
                title: 'Performance Dashboard',
                size: 'w11 h6',
                content: this.createPerformanceDashboardContent()
            });
            
            // Add Team Morale card
            this.addCardToPage('overview', {
                title: 'Team Morale & Dynamics',
                size: 'w6 h4',
                content: this.createTeamMoraleContent()
            });
            
            // Add Next Match Analysis
            this.addCardToPage('overview', {
                title: 'Next Match Analysis',
                size: 'w8 h5',
                content: this.createMatchAnalysisContent()
            });
            
            console.log('✅ Overview screen enhanced');
        },
        
        enhanceSquadScreen() {
            console.log('👥 Enhancing Squad screen...');
            
            // Add Player Detail with attribute visualization
            this.addCardToPage('squad', {
                title: 'Player Detail & Attributes',
                size: 'w10 h8',
                content: this.createPlayerDetailContent()
            });
            
            // Add Squad Depth Analysis
            this.addCardToPage('squad', {
                title: 'Squad Depth Analysis',
                size: 'w7 h6',
                content: this.createSquadDepthContent()
            });
            
            // Add Player Comparison Tool
            this.addCardToPage('squad', {
                title: 'Player Comparison',
                size: 'w9 h7',
                content: this.createPlayerComparisonContent()
            });
            
            console.log('✅ Squad screen enhanced');
        },
        
        enhanceTacticsScreen() {
            console.log('⚽ Enhancing Tactics screen...');
            
            // Add Formation Editor
            this.addCardToPage('tactics', {
                title: 'Formation Editor',
                size: 'w12 h8',
                content: this.createFormationEditorContent()
            });
            
            // Add Tactical Analysis
            this.addCardToPage('tactics', {
                title: 'Tactical Analysis',
                size: 'w8 h6',
                content: this.createTacticalAnalysisContent()
            });
            
            // Add Player Instructions
            this.addCardToPage('tactics', {
                title: 'Player Instructions',
                size: 'w6 h7',
                content: this.createPlayerInstructionsContent()
            });
            
            console.log('✅ Tactics screen enhanced');
        },
        
        enhanceTrainingScreen() {
            console.log('🏃 Enhancing Training screen...');
            
            // Add Individual Training Programs
            this.addCardToPage('training', {
                title: 'Individual Training',
                size: 'w10 h7',
                content: this.createIndividualTrainingContent()
            });
            
            // Add Fitness Tracking
            this.addCardToPage('training', {
                title: 'Fitness & Condition',
                size: 'w7 h5',
                content: this.createFitnessTrackingContent()
            });
            
            // Add Development Progress
            this.addCardToPage('training', {
                title: 'Development Progress',
                size: 'w8 h6',
                content: this.createDevelopmentProgressContent()
            });
            
            console.log('✅ Training screen enhanced');
        },
        
        enhanceTransfersScreen() {
            console.log('💰 Enhancing Transfers screen...');
            
            // Add Scouting Network
            this.addCardToPage('transfers', {
                title: 'Scouting Network',
                size: 'w11 h7',
                content: this.createScoutingNetworkContent()
            });
            
            // Add Transfer Analysis
            this.addCardToPage('transfers', {
                title: 'Transfer Market Analysis',
                size: 'w9 h6',
                content: this.createTransferAnalysisContent()
            });
            
            // Add Negotiation Tracker
            this.addCardToPage('transfers', {
                title: 'Active Negotiations',
                size: 'w7 h5',
                content: this.createNegotiationTrackerContent()
            });
            
            console.log('✅ Transfers screen enhanced');
        },
        
        enhanceFinancesScreen() {
            console.log('💳 Enhancing Finances screen...');
            
            // Add FFP Analysis
            this.addCardToPage('finances', {
                title: 'FFP Compliance Dashboard',
                size: 'w10 h6',
                content: this.createFFPAnalysisContent()
            });
            
            // Add Revenue Projections
            this.addCardToPage('finances', {
                title: 'Revenue Projections',
                size: 'w8 h7',
                content: this.createRevenueProjectionsContent()
            });
            
            // Add Wage Structure Analysis
            this.addCardToPage('finances', {
                title: 'Wage Structure',
                size: 'w9 h6',
                content: this.createWageStructureContent()
            });
            
            console.log('✅ Finances screen enhanced');
        },
        
        enhanceFixturesScreen() {
            console.log('📅 Enhancing Fixtures screen...');
            
            // Add Match Preparation
            this.addCardToPage('fixtures', {
                title: 'Match Preparation Hub',
                size: 'w10 h7',
                content: this.createMatchPrepContent()
            });
            
            // Add Competition Progress
            this.addCardToPage('fixtures', {
                title: 'Competition Progress',
                size: 'w8 h6',
                content: this.createCompetitionProgressContent()
            });
            
            // Add Performance Trends
            this.addCardToPage('fixtures', {
                title: 'Performance Trends',
                size: 'w9 h5',
                content: this.createPerformanceTrendsContent()
            });
            
            console.log('✅ Fixtures screen enhanced');
        },
        
        addCardToPage(pageName, cardConfig) {
            const container = document.querySelector(`#${pageName}-grid-view .tile-container`);
            if (!container) return;
            
            // Create card element
            const card = document.createElement('div');
            card.className = `card ${cardConfig.size}`;
            card.setAttribute('data-grid-w', cardConfig.size.match(/w(\d+)/)[1]);
            card.setAttribute('data-grid-h', cardConfig.size.match(/h(\d+)/)[1]);
            card.draggable = false;
            
            card.innerHTML = `
                <div class="card-header">
                    <span>${cardConfig.title}</span>
                    <div class="card-menu">
                        <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                    </div>
                </div>
                <div class="card-body">
                    ${cardConfig.content}
                </div>
                <div class="resize-handle"></div>
                <div class="resize-handle-bl"></div>
            `;
            
            container.appendChild(card);
            console.log(`✅ Added ${cardConfig.title} to ${pageName} screen`);
        },
        
        createPerformanceDashboardContent() {
            return `
                <div class="dashboard-header">
                    <div class="dashboard-controls">
                        <select class="period-selector" onchange="updatePerformancePeriod(this.value)">
                            <option value="month">Last Month</option>
                            <option value="season" selected>This Season</option>
                            <option value="year">Last 12 Months</option>
                            <option value="career">Career</option>
                        </select>
                        <select class="metric-selector" onchange="updatePerformanceMetric(this.value)">
                            <option value="goals" selected>Goals</option>
                            <option value="assists">Assists</option>
                            <option value="rating">Rating</option>
                            <option value="performance">Performance</option>
                        </select>
                    </div>
                </div>
                
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Goals Scored</div>
                        <div class="kpi-value">17</div>
                        <div class="kpi-change positive">+3 vs last season</div>
                        <div class="kpi-trend">📈</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Assists</div>
                        <div class="kpi-value">5</div>
                        <div class="kpi-change positive">+1 vs last season</div>
                        <div class="kpi-trend">📈</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Average Rating</div>
                        <div class="kpi-value">7.2</div>
                        <div class="kpi-change positive">+0.3 vs last season</div>
                        <div class="kpi-trend">📈</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Minutes Played</div>
                        <div class="kpi-value">2890</div>
                        <div class="kpi-change positive">+120 vs last season</div>
                        <div class="kpi-trend">📈</div>
                    </div>
                </div>
                
                <div class="charts-section">
                    <div class="chart-card">
                        <h4>Performance Trend</h4>
                        <div class="chart-container" id="performance-trend-chart"></div>
                    </div>
                    <div class="chart-card">
                        <h4>Performance Radar</h4>
                        <div class="chart-container" id="performance-radar-chart"></div>
                    </div>
                </div>
            `;
        },
        
        createPlayerDetailContent() {
            return `
                <div class="player-selector-section">
                    <select class="player-selector" onchange="selectPlayer(this.value)">
                        <option value="">Select Player...</option>
                        <option value="rashford">Marcus Rashford (LW)</option>
                        <option value="bruno">Bruno Fernandes (AM)</option>
                        <option value="martinez">Lisandro Martinez (CB)</option>
                        <option value="casemiro">Casemiro (DM)</option>
                        <option value="mainoo">Kobbie Mainoo (CM)</option>
                    </select>
                </div>
                
                <div class="player-profile-grid">
                    <div class="player-basic-info">
                        <div class="player-photo-placeholder">👤</div>
                        <div class="player-details">
                            <h3>Select a player</h3>
                            <p>Choose a player from the dropdown to view detailed attributes and performance data.</p>
                        </div>
                    </div>
                    
                    <div class="player-attributes-section">
                        <h4>Key Attributes</h4>
                        <div class="attributes-grid" id="player-attributes-grid"></div>
                    </div>
                    
                    <div class="player-stats-section">
                        <h4>Performance Stats</h4>
                        <div class="chart-container" id="player-performance-chart"></div>
                    </div>
                </div>
            `;
        },
        
        createFormationEditorContent() {
            return `
                <div class="formation-controls">
                    <div class="formation-selector">
                        <select onchange="changeFormation(this.value)">
                            <option value="4-2-3-1" selected>4-2-3-1</option>
                            <option value="4-3-3">4-3-3</option>
                            <option value="3-5-2">3-5-2</option>
                            <option value="4-4-2">4-4-2</option>
                            <option value="5-3-2">5-3-2</option>
                        </select>
                    </div>
                    <div class="mentality-selector">
                        <select onchange="changeMentality(this.value)">
                            <option value="very-defensive">Very Defensive</option>
                            <option value="defensive">Defensive</option>
                            <option value="balanced" selected>Balanced</option>
                            <option value="attacking">Attacking</option>
                            <option value="very-attacking">Very Attacking</option>
                        </select>
                    </div>
                </div>
                
                <div class="formation-pitch" id="formation-editor-pitch">
                    <!-- Interactive formation editor will be created here -->
                </div>
                
                <div class="formation-stats">
                    <div class="stat-item">
                        <span class="stat-label">Formation Familiarity</span>
                        <span class="stat-value">95%</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: 95%; background: #00ff88;"></div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tactical Discipline</span>
                        <span class="stat-value">82%</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: 82%; background: #ffb800;"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createScoutingNetworkContent() {
            return `
                <div class="scouting-controls">
                    <div class="search-filters">
                        <input type="text" placeholder="Player name..." class="player-search">
                        <select class="position-filter">
                            <option value="">All Positions</option>
                            <option value="GK">Goalkeeper</option>
                            <option value="DEF">Defender</option>
                            <option value="MID">Midfielder</option>
                            <option value="ATT">Attacker</option>
                        </select>
                        <select class="age-filter">
                            <option value="">All Ages</option>
                            <option value="youth">Under 21</option>
                            <option value="prime">21-30</option>
                            <option value="experienced">Over 30</option>
                        </select>
                    </div>
                </div>
                
                <div class="scout-targets-grid">
                    <div class="target-card priority-high">
                        <div class="target-header">
                            <span class="target-name">Jude Bellingham</span>
                            <span class="target-rating">⭐⭐⭐⭐⭐</span>
                        </div>
                        <div class="target-details">
                            <span class="target-position">CM</span>
                            <span class="target-age">21</span>
                            <span class="target-value">£150M</span>
                            <span class="target-interest">Unlikely</span>
                        </div>
                        <div class="target-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 15%; background: #ff4757;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="target-card priority-medium">
                        <div class="target-header">
                            <span class="target-name">Jeremie Frimpong</span>
                            <span class="target-rating">⭐⭐⭐⭐</span>
                        </div>
                        <div class="target-details">
                            <span class="target-position">RB</span>
                            <span class="target-age">23</span>
                            <span class="target-value">£35M</span>
                            <span class="target-interest">Possible</span>
                        </div>
                        <div class="target-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 65%; background: #ffb800;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="target-card priority-high">
                        <div class="target-header">
                            <span class="target-name">Victor Osimhen</span>
                            <span class="target-rating">⭐⭐⭐⭐⭐</span>
                        </div>
                        <div class="target-details">
                            <span class="target-position">ST</span>
                            <span class="target-age">25</span>
                            <span class="target-value">£120M</span>
                            <span class="target-interest">Interested</span>
                        </div>
                        <div class="target-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%; background: #00ff88;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="scouting-stats">
                    <div class="stat-row">
                        <span class="stat-label">Active Scouts</span>
                        <span class="stat-value">12</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">New Reports</span>
                        <span class="stat-value">8</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Shortlist Players</span>
                        <span class="stat-value">24</span>
                    </div>
                </div>
            `;
        },
        
        createFFPAnalysisContent() {
            return `
                <div class="ffp-status-header">
                    <div class="ffp-status-indicator compliant">
                        <span class="status-icon">✅</span>
                        <span class="status-text">FFP Compliant</span>
                    </div>
                    <div class="ffp-margin">
                        <span class="margin-label">Safety Margin</span>
                        <span class="margin-value">£48M</span>
                    </div>
                </div>
                
                <div class="ffp-breakdown">
                    <div class="ffp-category">
                        <div class="category-header">
                            <span class="category-name">Revenue (3-year)</span>
                            <span class="category-value">£1.74B</span>
                        </div>
                        <div class="category-breakdown">
                            <div class="breakdown-item">
                                <span class="item-name">Matchday</span>
                                <span class="item-value">£330M</span>
                                <div class="item-bar">
                                    <div class="item-fill" style="width: 19%; background: #0094cc;"></div>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="item-name">Broadcasting</span>
                                <span class="item-value">£645M</span>
                                <div class="item-bar">
                                    <div class="item-fill" style="width: 37%; background: #00ff88;"></div>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="item-name">Commercial</span>
                                <span class="item-value">£765M</span>
                                <div class="item-bar">
                                    <div class="item-fill" style="width: 44%; background: #ffb800;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ffp-category">
                        <div class="category-header">
                            <span class="category-name">Allowable Expenses</span>
                            <span class="category-value">£1.69B</span>
                        </div>
                        <div class="category-breakdown">
                            <div class="breakdown-item">
                                <span class="item-name">Player Costs</span>
                                <span class="item-value">£894M</span>
                                <div class="item-bar">
                                    <div class="item-fill" style="width: 53%; background: #ff6b35;"></div>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="item-name">Infrastructure</span>
                                <span class="item-value">£285M</span>
                                <div class="item-bar">
                                    <div class="item-fill" style="width: 17%; background: #8066ff;"></div>
                                </div>
                            </div>
                            <div class="breakdown-item">
                                <span class="item-name">Operations</span>
                                <span class="item-value">£511M</span>
                                <div class="item-bar">
                                    <div class="item-fill" style="width: 30%; background: #ff4757;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ffp-projection">
                    <h4>Next Assessment: June 2025</h4>
                    <div class="projection-chart" id="ffp-projection-chart"></div>
                </div>
            `;
        },
        
        createTeamMoraleContent() {
            return `
                <div class="morale-overview">
                    <div class="overall-morale excellent">
                        <div class="morale-icon">😊</div>
                        <div class="morale-text">
                            <div class="morale-level">Excellent</div>
                            <div class="morale-description">Squad is highly motivated</div>
                        </div>
                    </div>
                </div>
                
                <div class="morale-factors">
                    <div class="factor-item positive">
                        <span class="factor-icon">🏆</span>
                        <span class="factor-text">Recent victories</span>
                        <span class="factor-impact">+2</span>
                    </div>
                    <div class="factor-item positive">
                        <span class="factor-icon">💰</span>
                        <span class="factor-text">Contract renewals</span>
                        <span class="factor-impact">+1</span>
                    </div>
                    <div class="factor-item negative">
                        <span class="factor-icon">🤕</span>
                        <span class="factor-text">Key player injuries</span>
                        <span class="factor-impact">-1</span>
                    </div>
                </div>
                
                <div class="team-harmony">
                    <div class="harmony-stat">
                        <span class="harmony-label">Dressing Room Unity</span>
                        <span class="harmony-value">87%</span>
                        <div class="harmony-bar">
                            <div class="harmony-fill" style="width: 87%; background: #00ff88;"></div>
                        </div>
                    </div>
                    <div class="harmony-stat">
                        <span class="harmony-label">Leadership Influence</span>
                        <span class="harmony-value">92%</span>
                        <div class="harmony-bar">
                            <div class="harmony-fill" style="width: 92%; background: #0094cc;"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createMatchAnalysisContent() {
            return `
                <div class="match-analysis">
                    <div class="opponent-info">
                        <div class="opponent-header">
                            <h4>Liverpool (A)</h4>
                            <span class="match-date">Sunday, 15:00</span>
                        </div>
                        <div class="opponent-stats">
                            <div class="stat-item">
                                <span class="stat-label">League Position</span>
                                <span class="stat-value">4th</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Recent Form</span>
                                <span class="stat-value">W-D-W-L-W</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Goals For/Against</span>
                                <span class="stat-value">24/18</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="head-to-head">
                        <h4>Head to Head (Last 5)</h4>
                        <div class="h2h-results">
                            <div class="h2h-result win">W 3-1</div>
                            <div class="h2h-result loss">L 0-2</div>
                            <div class="h2h-result draw">D 1-1</div>
                            <div class="h2h-result win">W 2-0</div>
                            <div class="h2h-result loss">L 1-3</div>
                        </div>
                    </div>
                    
                    <div class="key-battles">
                        <h4>Key Battles</h4>
                        <div class="battle-item">
                            <span class="our-player">Rashford</span>
                            <span class="vs">vs</span>
                            <span class="their-player">Alexander-Arnold</span>
                        </div>
                        <div class="battle-item">
                            <span class="our-player">Bruno</span>
                            <span class="vs">vs</span>
                            <span class="their-player">Fabinho</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createTeamMoraleContent() {
            return `
                <div class="morale-overview">
                    <div class="overall-morale excellent">
                        <div class="morale-icon">😊</div>
                        <div class="morale-text">
                            <div class="morale-level">Excellent</div>
                            <div class="morale-description">Squad is highly motivated</div>
                        </div>
                    </div>
                </div>
                
                <div class="morale-factors">
                    <div class="factor-item positive">
                        <span class="factor-icon">🏆</span>
                        <span class="factor-text">Recent victories</span>
                        <span class="factor-impact">+2</span>
                    </div>
                    <div class="factor-item positive">
                        <span class="factor-icon">💰</span>
                        <span class="factor-text">Contract renewals</span>
                        <span class="factor-impact">+1</span>
                    </div>
                    <div class="factor-item negative">
                        <span class="factor-icon">🤕</span>
                        <span class="factor-text">Key player injuries</span>
                        <span class="factor-impact">-1</span>
                    </div>
                </div>
                
                <div class="team-harmony">
                    <div class="harmony-stat">
                        <span class="harmony-label">Dressing Room Unity</span>
                        <span class="harmony-value">87%</span>
                        <div class="harmony-bar">
                            <div class="harmony-fill" style="width: 87%; background: #00ff88;"></div>
                        </div>
                    </div>
                    <div class="harmony-stat">
                        <span class="harmony-label">Leadership Influence</span>
                        <span class="harmony-value">92%</span>
                        <div class="harmony-bar">
                            <div class="harmony-fill" style="width: 92%; background: #0094cc;"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadDepthContent() {
            return `
                <div class="squad-depth-analysis">
                    <div class="position-depth-grid">
                        <div class="depth-item">
                            <div class="position-label">Goalkeepers</div>
                            <div class="depth-bar">
                                <div class="depth-fill excellent" style="width: 85%;"></div>
                            </div>
                            <span class="depth-rating">85</span>
                        </div>
                        <div class="depth-item">
                            <div class="position-label">Centre-backs</div>
                            <div class="depth-bar">
                                <div class="depth-fill good" style="width: 78%;"></div>
                            </div>
                            <span class="depth-rating">78</span>
                        </div>
                        <div class="depth-item">
                            <div class="position-label">Full-backs</div>
                            <div class="depth-bar">
                                <div class="depth-fill average" style="width: 65%;"></div>
                            </div>
                            <span class="depth-rating">65</span>
                        </div>
                        <div class="depth-item">
                            <div class="position-label">Midfielders</div>
                            <div class="depth-bar">
                                <div class="depth-fill excellent" style="width: 88%;"></div>
                            </div>
                            <span class="depth-rating">88</span>
                        </div>
                        <div class="depth-item">
                            <div class="position-label">Wingers</div>
                            <div class="depth-bar">
                                <div class="depth-fill good" style="width: 82%;"></div>
                            </div>
                            <span class="depth-rating">82</span>
                        </div>
                        <div class="depth-item">
                            <div class="position-label">Strikers</div>
                            <div class="depth-bar">
                                <div class="depth-fill average" style="width: 72%;"></div>
                            </div>
                            <span class="depth-rating">72</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createPlayerComparisonContent() {
            return `
                <div class="player-comparison-tool">
                    <div class="comparison-selectors">
                        <div class="player-select-section">
                            <label>Player 1</label>
                            <select class="player-1-select">
                                <option value="rashford" selected>Marcus Rashford</option>
                                <option value="sancho">Jadon Sancho</option>
                                <option value="garnacho">Alejandro Garnacho</option>
                            </select>
                        </div>
                        <div class="vs-indicator">VS</div>
                        <div class="player-select-section">
                            <label>Player 2</label>
                            <select class="player-2-select">
                                <option value="antony" selected>Antony</option>
                                <option value="sancho">Jadon Sancho</option>
                                <option value="pellistri">Facundo Pellistri</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="comparison-grid">
                        <div class="comparison-attribute">
                            <span class="attr-name">Pace</span>
                            <div class="attr-comparison">
                                <div class="attr-bar player-1">
                                    <div class="attr-fill" style="width: 95%; background: #00ff88;"></div>
                                    <span class="attr-value">95</span>
                                </div>
                                <div class="attr-bar player-2">
                                    <div class="attr-fill" style="width: 78%; background: #ffb800;"></div>
                                    <span class="attr-value">78</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="comparison-attribute">
                            <span class="attr-name">Finishing</span>
                            <div class="attr-comparison">
                                <div class="attr-bar player-1">
                                    <div class="attr-fill" style="width: 82%; background: #ffb800;"></div>
                                    <span class="attr-value">82</span>
                                </div>
                                <div class="attr-bar player-2">
                                    <div class="attr-fill" style="width: 75%; background: #ffa502;"></div>
                                    <span class="attr-value">75</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="comparison-attribute">
                            <span class="attr-name">Dribbling</span>
                            <div class="attr-comparison">
                                <div class="attr-bar player-1">
                                    <div class="attr-fill" style="width: 88%; background: #00ff88;"></div>
                                    <span class="attr-value">88</span>
                                </div>
                                <div class="attr-bar player-2">
                                    <div class="attr-fill" style="width: 85%; background: #00ff88;"></div>
                                    <span class="attr-value">85</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createTacticalAnalysisContent() {
            return `
                <div class="tactical-analysis">
                    <div class="analysis-metrics">
                        <div class="metric-card">
                            <span class="metric-label">Possession</span>
                            <span class="metric-value">64%</span>
                            <div class="metric-trend positive">+5%</div>
                        </div>
                        <div class="metric-card">
                            <span class="metric-label">Pass Accuracy</span>
                            <span class="metric-value">87%</span>
                            <div class="metric-trend positive">+2%</div>
                        </div>
                        <div class="metric-card">
                            <span class="metric-label">Shots per Game</span>
                            <span class="metric-value">14.2</span>
                            <div class="metric-trend negative">-1.3</div>
                        </div>
                    </div>
                    
                    <div class="tactical-effectiveness">
                        <h4>Tactical Effectiveness</h4>
                        <div class="effectiveness-grid">
                            <div class="effectiveness-item">
                                <span class="effectiveness-label">Pressing</span>
                                <div class="effectiveness-bar">
                                    <div class="effectiveness-fill" style="width: 82%; background: #00ff88;"></div>
                                </div>
                                <span class="effectiveness-value">82%</span>
                            </div>
                            <div class="effectiveness-item">
                                <span class="effectiveness-label">Counter-attacks</span>
                                <div class="effectiveness-bar">
                                    <div class="effectiveness-fill" style="width: 76%; background: #ffb800;"></div>
                                </div>
                                <span class="effectiveness-value">76%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createPlayerInstructionsContent() {
            return `
                <div class="player-instructions">
                    <div class="instruction-player-selector">
                        <select class="player-instruction-select">
                            <option value="rashford">Marcus Rashford (LW)</option>
                            <option value="bruno">Bruno Fernandes (AM)</option>
                            <option value="casemiro">Casemiro (DM)</option>
                        </select>
                    </div>
                    
                    <div class="instructions-grid">
                        <div class="instruction-category">
                            <h4>Movement</h4>
                            <div class="instruction-options">
                                <label><input type="checkbox" checked> Roam from Position</label>
                                <label><input type="checkbox"> Move into Channels</label>
                                <label><input type="checkbox" checked> Get Further Forward</label>
                            </div>
                        </div>
                        
                        <div class="instruction-category">
                            <h4>Attacking</h4>
                            <div class="instruction-options">
                                <label><input type="checkbox" checked> Cut Inside</label>
                                <label><input type="checkbox"> Sit Narrower</label>
                                <label><input type="checkbox"> Take More Risks</label>
                            </div>
                        </div>
                        
                        <div class="instruction-category">
                            <h4>Defensive</h4>
                            <div class="instruction-options">
                                <label><input type="checkbox"> Mark Tighter</label>
                                <label><input type="checkbox" checked> Press More Often</label>
                                <label><input type="checkbox"> Stay Wider</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createIndividualTrainingContent() {
            return `
                <div class="individual-training">
                    <div class="training-player-selector">
                        <select class="training-player-select">
                            <option value="rashford">Marcus Rashford</option>
                            <option value="mainoo">Kobbie Mainoo</option>
                            <option value="hojlund">Rasmus Højlund</option>
                        </select>
                    </div>
                    
                    <div class="training-program">
                        <div class="program-section">
                            <h4>Technical Focus</h4>
                            <div class="training-options">
                                <label><input type="radio" name="technical" value="finishing" checked> Finishing</label>
                                <label><input type="radio" name="technical" value="crossing"> Crossing</label>
                                <label><input type="radio" name="technical" value="passing"> Passing</label>
                            </div>
                        </div>
                        
                        <div class="program-section">
                            <h4>Physical Focus</h4>
                            <div class="training-options">
                                <label><input type="radio" name="physical" value="pace"> Pace</label>
                                <label><input type="radio" name="physical" value="strength" checked> Strength</label>
                                <label><input type="radio" name="physical" value="stamina"> Stamina</label>
                            </div>
                        </div>
                        
                        <div class="program-section">
                            <h4>Intensity</h4>
                            <div class="intensity-slider">
                                <input type="range" min="1" max="5" value="3" class="intensity-range">
                                <div class="intensity-labels">
                                    <span>Light</span>
                                    <span>Medium</span>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createFitnessTrackingContent() {
            return `
                <div class="fitness-tracking">
                    <div class="fitness-overview">
                        <div class="fitness-stat">
                            <span class="fitness-label">Squad Fitness</span>
                            <span class="fitness-value">85%</span>
                            <div class="fitness-bar">
                                <div class="fitness-fill" style="width: 85%; background: #00ff88;"></div>
                            </div>
                        </div>
                        <div class="fitness-stat">
                            <span class="fitness-label">Match Sharpness</span>
                            <span class="fitness-value">78%</span>
                            <div class="fitness-bar">
                                <div class="fitness-fill" style="width: 78%; background: #ffb800;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="fitness-alerts">
                        <div class="alert-item warning">
                            <span class="alert-icon">⚠️</span>
                            <span class="alert-text">3 players below 80% fitness</span>
                        </div>
                        <div class="alert-item info">
                            <span class="alert-icon">ℹ️</span>
                            <span class="alert-text">Recovery session recommended</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createDevelopmentProgressContent() {
            return `
                <div class="development-progress">
                    <div class="progress-overview">
                        <h4>Youth Development</h4>
                        <div class="development-stats">
                            <div class="dev-stat">
                                <span class="dev-label">Players in Development</span>
                                <span class="dev-value">8</span>
                            </div>
                            <div class="dev-stat">
                                <span class="dev-label">Average Progress</span>
                                <span class="dev-value">+12%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress-players">
                        <div class="progress-player">
                            <span class="player-name">K. Mainoo</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 85%; background: #00ff88;"></div>
                            </div>
                            <span class="progress-value">+15%</span>
                        </div>
                        <div class="progress-player">
                            <span class="player-name">A. Garnacho</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 72%; background: #ffb800;"></div>
                            </div>
                            <span class="progress-value">+8%</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createTransferAnalysisContent() {
            return `
                <div class="transfer-analysis">
                    <div class="market-overview">
                        <h4>Transfer Market Overview</h4>
                        <div class="market-stats">
                            <div class="market-stat">
                                <span class="stat-label">Average Value Increase</span>
                                <span class="stat-value">+8.5%</span>
                            </div>
                            <div class="market-stat">
                                <span class="stat-label">Active Targets</span>
                                <span class="stat-value">12</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="position-needs">
                        <h4>Priority Positions</h4>
                        <div class="needs-grid">
                            <div class="need-item high">
                                <span class="need-position">Right-back</span>
                                <span class="need-priority">High</span>
                            </div>
                            <div class="need-item medium">
                                <span class="need-position">Striker</span>
                                <span class="need-priority">Medium</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createNegotiationTrackerContent() {
            return `
                <div class="negotiation-tracker">
                    <div class="active-negotiations">
                        <div class="negotiation-item">
                            <div class="negotiation-header">
                                <span class="player-name">J. Frimpong</span>
                                <span class="negotiation-status active">Active</span>
                            </div>
                            <div class="negotiation-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 65%; background: #ffb800;"></div>
                                </div>
                                <span class="progress-text">Personal terms agreed</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createRevenueProjectionsContent() {
            return `
                <div class="revenue-projections">
                    <div class="projection-timeline">
                        <h4>Revenue Forecast (Next 3 Years)</h4>
                        <div class="timeline-chart" id="revenue-timeline-chart"></div>
                    </div>
                    
                    <div class="revenue-breakdown">
                        <div class="revenue-source">
                            <span class="source-name">Commercial</span>
                            <span class="source-value">£275M</span>
                            <div class="source-trend positive">+12%</div>
                        </div>
                        <div class="revenue-source">
                            <span class="source-name">Broadcasting</span>
                            <span class="source-value">£215M</span>
                            <div class="source-trend stable">0%</div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createWageStructureContent() {
            return `
                <div class="wage-structure">
                    <div class="wage-overview">
                        <div class="wage-total">
                            <span class="wage-label">Total Weekly Wages</span>
                            <span class="wage-value">£2.96M</span>
                        </div>
                        <div class="wage-budget">
                            <span class="budget-label">Weekly Budget</span>
                            <span class="budget-value">£3.8M</span>
                            <div class="budget-usage">
                                <div class="usage-bar">
                                    <div class="usage-fill" style="width: 78%; background: #ffb800;"></div>
                                </div>
                                <span class="usage-text">78% used</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createMatchPrepContent() {
            return `
                <div class="match-prep">
                    <div class="prep-checklist">
                        <h4>Preparation Checklist</h4>
                        <div class="checklist-item completed">
                            <span class="check-icon">✅</span>
                            <span class="check-text">Team Selection Complete</span>
                        </div>
                        <div class="checklist-item completed">
                            <span class="check-icon">✅</span>
                            <span class="check-text">Tactical Instructions Set</span>
                        </div>
                        <div class="checklist-item pending">
                            <span class="check-icon">⏳</span>
                            <span class="check-text">Opposition Analysis</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createCompetitionProgressContent() {
            return `
                <div class="competition-progress">
                    <div class="competition-item">
                        <div class="comp-header">
                            <span class="comp-name">Premier League</span>
                            <span class="comp-position">4th</span>
                        </div>
                        <div class="comp-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 30%; background: #0094cc;"></div>
                            </div>
                            <span class="progress-text">8/38 matches</span>
                        </div>
                    </div>
                    
                    <div class="competition-item">
                        <div class="comp-header">
                            <span class="comp-name">Champions League</span>
                            <span class="comp-position">Group Stage</span>
                        </div>
                        <div class="comp-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 50%; background: #00ff88;"></div>
                            </div>
                            <span class="progress-text">3/6 matches</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createPerformanceTrendsContent() {
            return `
                <div class="performance-trends">
                    <div class="trend-metrics">
                        <div class="trend-item">
                            <span class="trend-label">Goals per Game</span>
                            <span class="trend-value">2.1</span>
                            <div class="trend-chart-mini" id="goals-trend-mini"></div>
                        </div>
                        <div class="trend-item">
                            <span class="trend-label">Clean Sheets</span>
                            <span class="trend-value">3</span>
                            <div class="trend-chart-mini" id="cleansheets-trend-mini"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        setupSubmenus() {
            console.log('📋 Setting up working submenus...');
            
            // Make submenu items clickable and functional
            document.querySelectorAll('.submenu-item').forEach(item => {
                if (!item.onclick && !item.hasAttribute('onclick')) {
                    item.addEventListener('click', () => {
                        // Update active state
                        const submenu = item.closest('.nav-submenu');
                        if (submenu) {
                            submenu.querySelectorAll('.submenu-item').forEach(s => s.classList.remove('active'));
                            item.classList.add('active');
                        }
                        
                        const submenuText = item.textContent;
                        console.log(`Submenu clicked: ${submenuText}`);
                        
                        // Load different content based on submenu
                        this.loadSubmenuContent(submenuText);
                    });
                }
            });
            
            console.log('✅ Submenus setup complete');
        },
        
        loadSubmenuContent(submenuName) {
            console.log(`🔄 Loading content for submenu: ${submenuName}`);
            
            // This would load different card configurations based on submenu
            // For now, just log the action
            const activeTab = document.querySelector('.nav-tab.active');
            if (activeTab) {
                const tabName = activeTab.textContent.toLowerCase();
                console.log(`Loading ${submenuName} content for ${tabName} tab`);
            }
        }
    };

    // Add CSS for enhanced content
    const enhancedStyles = `
        /* Enhanced screen content styles */
        .dashboard-controls {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .dashboard-controls select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin: 16px 0;
        }
        
        .kpi-card {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid var(--primary-400);
        }
        
        .kpi-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 4px;
        }
        
        .kpi-value {
            font-size: 18px;
            font-weight: 700;
            color: white;
            margin-bottom: 4px;
        }
        
        .kpi-change {
            font-size: 9px;
            font-weight: 500;
        }
        
        .kpi-change.positive {
            color: #00ff88;
        }
        
        .kpi-change.negative {
            color: #ff4757;
        }
        
        .kpi-trend {
            float: right;
            font-size: 12px;
        }
        
        .charts-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 16px 0;
        }
        
        .chart-card {
            background: rgba(0, 0, 0, 0.2);
            padding: 12px;
            border-radius: 6px;
        }
        
        .chart-card h4 {
            margin: 0 0 8px 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .formation-controls {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .formation-controls select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
        }
        
        .formation-pitch {
            width: 100%;
            height: 200px;
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 8px;
            position: relative;
            margin: 16px 0;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .scout-targets-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
            margin: 16px 0;
        }
        
        .target-card {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid;
        }
        
        .target-card.priority-high {
            border-left-color: #ff4757;
        }
        
        .target-card.priority-medium {
            border-left-color: #ffb800;
        }
        
        .target-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .target-name {
            font-weight: 600;
            color: white;
        }
        
        .target-details {
            display: flex;
            gap: 12px;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 8px;
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .player-selector-section {
            margin-bottom: 16px;
        }
        
        .player-selector {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
        }
        
        .attributes-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 12px 0;
        }
        
        .ffp-status-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 12px;
            background: rgba(0, 255, 136, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(0, 255, 136, 0.3);
        }
        
        .ffp-status-indicator.compliant {
            color: #00ff88;
            font-weight: 600;
        }
        
        .ffp-breakdown {
            margin: 16px 0;
        }
        
        .ffp-category {
            margin-bottom: 16px;
            background: rgba(0, 0, 0, 0.2);
            padding: 12px;
            border-radius: 6px;
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 6px 0;
            font-size: 10px;
        }
        
        .item-bar {
            width: 60px;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .item-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = enhancedStyles;
    document.head.appendChild(styleElement);

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => ScreenContentEnhancer.init(), 4000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ScreenContentEnhancer.init(), 4000);
        });
    }

    // Make available for Chrome MCP testing
    window.ScreenContentEnhancer = ScreenContentEnhancer;

})();