/**
 * SQUAD SUBSCREENS IMPLEMENTATION
 * Complete squad management subscreens with football-specific content
 * First Team, Reserves, Youth, Staff, Reports, Dynamics with optimal layouts
 */

(function() {
    'use strict';

    console.log('👥 SQUAD SUBSCREENS: Implementing comprehensive squad management subscreens...');

    const SquadSubscreens = {
        init() {
            console.log('👥 SQUAD: Setting up all Squad management subscreens...');
            
            this.setupFirstTeamSubscreen();
            this.setupReservesSubscreen();
            this.setupYouthSubscreen();
            this.setupStaffSubscreen();
            this.setupReportsSubscreen();
            this.setupDynamicsSubscreen();
            
            console.log('✅ SQUAD SUBSCREENS: All squad subscreens configured');
        },

        setupFirstTeamSubscreen() {
            console.log('⭐ Setting up First Team subscreen...');
            
            const firstTeamCustomization = {
                title: 'First Team Squad',
                components: {
                    'primary-detail': {
                        id: 'formation-tactics',
                        title: 'Current Formation & Tactics',
                        content: this.generateFormationTacticsContent()
                    },
                    'supporting-info': {
                        id: 'key-players',
                        title: 'Key Players',
                        content: this.generateKeyPlayersContent()
                    },
                    'actions': {
                        id: 'squad-actions',
                        title: 'Quick Actions',
                        content: this.generateSquadActionsContent()
                    },
                    'context': {
                        id: 'squad-overview',
                        title: 'Squad Overview',
                        content: this.generateSquadOverviewContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyDetailTemplate('squad', 'first-team', firstTeamCustomization);
            }
            
            console.log('✅ First Team subscreen configured');
        },

        setupReservesSubscreen() {
            console.log('🔄 Setting up Reserves subscreen...');
            
            const reservesCustomization = {
                title: 'Reserve Squad',
                components: {
                    'data-table': {
                        id: 'reserve-players',
                        title: 'Reserve Squad Players',
                        content: this.generateReservePlayersContent()
                    },
                    'filters': {
                        id: 'reserve-filters',
                        title: 'Filter & Search',
                        content: this.generateReserveFiltersContent()
                    },
                    'actions': {
                        id: 'development-actions',
                        title: 'Development Actions',
                        content: this.generateDevelopmentActionsContent()
                    },
                    'summary': {
                        id: 'reserve-summary',
                        title: 'Reserve Summary',
                        content: this.generateReserveSummaryContent()
                    },
                    'quick-stats': {
                        id: 'promotion-candidates',
                        title: 'Promotion Ready',
                        content: this.generatePromotionCandidatesContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyListTemplate('squad', 'reserves', reservesCustomization);
            }
            
            console.log('✅ Reserves subscreen configured');
        },

        setupYouthSubscreen() {
            console.log('🌱 Setting up Youth subscreen...');
            
            const youthCustomization = {
                title: 'Youth Development',
                components: {
                    'main-kpi': {
                        id: 'academy-rating',
                        title: 'Academy Rating',
                        content: this.generateAcademyRatingContent()
                    },
                    'secondary-kpi-1': {
                        id: 'youth-prospects',
                        title: 'Top Prospects',
                        content: this.generateYouthProspectsContent()
                    },
                    'secondary-kpi-2': {
                        id: 'development-progress',
                        title: 'Development Progress',
                        content: this.generateDevelopmentProgressContent()
                    },
                    'trend-chart': {
                        id: 'youth-progression',
                        title: 'Youth Progression Trends',
                        content: this.generateYouthProgressionContent()
                    },
                    'status-panel': {
                        id: 'academy-status',
                        title: 'Academy Status',
                        content: this.generateAcademyStatusContent()
                    },
                    'alerts': {
                        id: 'youth-alerts',
                        title: 'Youth Alerts',
                        content: this.generateYouthAlertsContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyDashboardTemplate('squad', 'youth', youthCustomization);
            }
            
            console.log('✅ Youth subscreen configured');
        },

        setupStaffSubscreen() {
            console.log('👔 Setting up Staff subscreen...');
            
            const staffCustomization = {
                title: 'Coaching Staff',
                components: {
                    'data-table': {
                        id: 'coaching-staff',
                        title: 'Coaching Staff Overview',
                        content: this.generateCoachingStaffContent()
                    },
                    'filters': {
                        id: 'staff-filters',
                        title: 'Staff Categories',
                        content: this.generateStaffFiltersContent()
                    },
                    'actions': {
                        id: 'staff-actions',
                        title: 'Staff Management',
                        content: this.generateStaffActionsContent()
                    },
                    'summary': {
                        id: 'staff-performance',
                        title: 'Staff Performance',
                        content: this.generateStaffPerformanceContent()
                    },
                    'quick-stats': {
                        id: 'staff-budget',
                        title: 'Staff Budget',
                        content: this.generateStaffBudgetContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyListTemplate('squad', 'staff', staffCustomization);
            }
            
            console.log('✅ Staff subscreen configured');
        },

        setupReportsSubscreen() {
            console.log('📊 Setting up Squad Reports subscreen...');
            
            const reportsCustomization = {
                title: 'Squad Analysis Reports',
                components: {
                    'main-chart': {
                        id: 'squad-analysis',
                        title: 'Squad Performance Analysis',
                        content: this.generateSquadAnalysisContent()
                    },
                    'data-breakdown': {
                        id: 'position-analysis',
                        title: 'Position Analysis',
                        content: this.generatePositionAnalysisContent()
                    },
                    'insights': {
                        id: 'squad-insights',
                        title: 'Squad Insights',
                        content: this.generateSquadInsightsContent()
                    },
                    'controls': {
                        id: 'report-settings',
                        title: 'Report Settings',
                        content: this.generateReportSettingsContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyAnalysisTemplate('squad', 'reports', reportsCustomization);
            }
            
            console.log('✅ Squad Reports subscreen configured');
        },

        setupDynamicsSubscreen() {
            console.log('🤝 Setting up Squad Dynamics subscreen...');
            
            const dynamicsCustomization = {
                title: 'Squad Dynamics & Chemistry',
                components: {
                    'primary-detail': {
                        id: 'team-chemistry',
                        title: 'Team Chemistry Overview',
                        content: this.generateTeamChemistryContent()
                    },
                    'supporting-info': {
                        id: 'leadership-hierarchy',
                        title: 'Leadership Hierarchy',
                        content: this.generateLeadershipHierarchyContent()
                    },
                    'actions': {
                        id: 'dynamics-actions',
                        title: 'Team Building',
                        content: this.generateDynamicsActionsContent()
                    },
                    'context': {
                        id: 'morale-factors',
                        title: 'Morale Factors',
                        content: this.generateMoraleFactorsContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyDetailTemplate('squad', 'dynamics', dynamicsCustomization);
            }
            
            console.log('✅ Squad Dynamics subscreen configured');
        },

        // Content generators for First Team
        generateFormationTacticsContent() {
            return `
                <div class="formation-tactics-display">
                    <div class="tactics-header">
                        <div class="formation-name">4-2-3-1 Formation</div>
                        <div class="tactics-status">
                            <span class="familiarity">95% Familiar</span>
                            <span class="effectiveness">High Effectiveness</span>
                        </div>
                    </div>
                    <div class="formation-grid">
                        <div class="formation-visual">
                            <div class="player-slot gk" data-position="GK">
                                <span class="player-name">Onana</span>
                                <span class="player-rating">7.4</span>
                            </div>
                            <div class="player-slot def" data-position="LB">
                                <span class="player-name">Shaw</span>
                                <span class="player-rating">7.3</span>
                            </div>
                            <div class="player-slot def" data-position="CB">
                                <span class="player-name">Martinez</span>
                                <span class="player-rating">7.6</span>
                            </div>
                            <div class="player-slot def" data-position="CB">
                                <span class="player-name">Varane</span>
                                <span class="player-rating">7.5</span>
                            </div>
                            <div class="player-slot def" data-position="RB">
                                <span class="player-name">Dalot</span>
                                <span class="player-rating">7.2</span>
                            </div>
                            <div class="player-slot mid" data-position="DM">
                                <span class="player-name">Casemiro</span>
                                <span class="player-rating">7.5</span>
                            </div>
                            <div class="player-slot mid" data-position="CM">
                                <span class="player-name">Mainoo</span>
                                <span class="player-rating">7.3</span>
                            </div>
                            <div class="player-slot att" data-position="LW">
                                <span class="player-name">Rashford</span>
                                <span class="player-rating">7.8</span>
                            </div>
                            <div class="player-slot att" data-position="AM">
                                <span class="player-name">Bruno (C)</span>
                                <span class="player-rating">8.2</span>
                            </div>
                            <div class="player-slot att" data-position="RW">
                                <span class="player-name">Garnacho</span>
                                <span class="player-rating">7.4</span>
                            </div>
                            <div class="player-slot str" data-position="ST">
                                <span class="player-name">Højlund</span>
                                <span class="player-rating">7.2</span>
                            </div>
                        </div>
                    </div>
                    <div class="tactics-summary">
                        <div class="tactic-stat">
                            <span class="stat-label">Style</span>
                            <span class="stat-value">Balanced Attack</span>
                        </div>
                        <div class="tactic-stat">
                            <span class="stat-label">Mentality</span>
                            <span class="stat-value">Positive</span>
                        </div>
                        <div class="tactic-stat">
                            <span class="stat-label">Recent Form</span>
                            <span class="stat-value">WWDLW</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateKeyPlayersContent() {
            return `
                <div class="key-players-display">
                    <div class="player-category captain">
                        <div class="category-header">Captain</div>
                        <div class="player-info-card">
                            <div class="player-details">
                                <span class="player-name">Bruno Fernandes</span>
                                <span class="player-position">AM</span>
                            </div>
                            <div class="player-metrics">
                                <span class="player-rating excellent">8.2</span>
                                <span class="player-form">📈</span>
                            </div>
                        </div>
                    </div>
                    <div class="player-category star">
                        <div class="category-header">Star Players</div>
                        <div class="player-info-card">
                            <div class="player-details">
                                <span class="player-name">Marcus Rashford</span>
                                <span class="player-position">LW/ST</span>
                            </div>
                            <div class="player-metrics">
                                <span class="player-rating good">7.8</span>
                                <span class="player-form">📈</span>
                            </div>
                        </div>
                        <div class="player-info-card">
                            <div class="player-details">
                                <span class="player-name">Lisandro Martinez</span>
                                <span class="player-position">CB</span>
                            </div>
                            <div class="player-metrics">
                                <span class="player-rating good">7.6</span>
                                <span class="player-form">➡️</span>
                            </div>
                        </div>
                    </div>
                    <div class="player-category emerging">
                        <div class="category-header">Emerging Talent</div>
                        <div class="player-info-card">
                            <div class="player-details">
                                <span class="player-name">Kobbie Mainoo</span>
                                <span class="player-position">CM</span>
                            </div>
                            <div class="player-metrics">
                                <span class="player-rating promising">7.3</span>
                                <span class="player-form">📈</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        generateSquadActionsContent() {
            return `
                <div class="squad-quick-actions">
                    <button class="action-btn primary">Set Formation</button>
                    <button class="action-btn secondary">Team Selection</button>
                    <button class="action-btn secondary">Individual Training</button>
                    <button class="action-btn utility">Squad Report</button>
                </div>
            `;
        },

        generateSquadOverviewContent() {
            return `
                <div class="squad-overview-stats">
                    <div class="overview-stat">
                        <span class="stat-label">Squad Size</span>
                        <span class="stat-value">25 players</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Average Age</span>
                        <span class="stat-value">26.3 years</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Average Rating</span>
                        <span class="stat-value">7.2</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Squad Value</span>
                        <span class="stat-value">£678M</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Injuries</span>
                        <span class="stat-value warning">3 players</span>
                    </div>
                    <div class="overview-stat">
                        <span class="stat-label">Suspensions</span>
                        <span class="stat-value">0 players</span>
                    </div>
                </div>
            `;
        },

        // Content generators for Reserves
        generateReservePlayersContent() {
            return `
                <div class="reserve-players-table">
                    <table class="players-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Pos</th>
                                <th>Age</th>
                                <th>Rating</th>
                                <th>Potential</th>
                                <th>Form</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="player-row promotion-ready">
                                <td class="player-name">Amad Diallo</td>
                                <td class="player-pos">RW</td>
                                <td class="player-age">22</td>
                                <td class="player-rating">6.8</td>
                                <td class="player-potential high">8.2</td>
                                <td class="player-form">📈</td>
                                <td class="player-status ready">Ready</td>
                            </tr>
                            <tr class="player-row">
                                <td class="player-name">Facundo Pellistri</td>
                                <td class="player-pos">RW</td>
                                <td class="player-age">22</td>
                                <td class="player-rating">6.5</td>
                                <td class="player-potential medium">7.5</td>
                                <td class="player-form">➡️</td>
                                <td class="player-status developing">Developing</td>
                            </tr>
                            <tr class="player-row">
                                <td class="player-name">Hannibal Mejbri</td>
                                <td class="player-pos">CM</td>
                                <td class="player-age">21</td>
                                <td class="player-rating">6.3</td>
                                <td class="player-potential high">8.0</td>
                                <td class="player-form">📈</td>
                                <td class="player-status developing">Developing</td>
                            </tr>
                            <tr class="player-row">
                                <td class="player-name">Brandon Williams</td>
                                <td class="player-pos">LB</td>
                                <td class="player-age">24</td>
                                <td class="player-rating">6.7</td>
                                <td class="player-potential medium">7.2</td>
                                <td class="player-form">➡️</td>
                                <td class="player-status backup">Backup</td>
                            </tr>
                            <tr class="player-row">
                                <td class="player-name">Willy Kambwala</td>
                                <td class="player-pos">CB</td>
                                <td class="player-age">20</td>
                                <td class="player-rating">6.1</td>
                                <td class="player-potential high">7.8</td>
                                <td class="player-form">📈</td>
                                <td class="player-status developing">Developing</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        },

        generatePromotionCandidatesContent() {
            return `
                <div class="promotion-candidates">
                    <div class="candidate-item ready">
                        <div class="candidate-name">Amad Diallo</div>
                        <div class="candidate-readiness">Ready Now</div>
                    </div>
                    <div class="candidate-item near-ready">
                        <div class="candidate-name">H. Mejbri</div>
                        <div class="candidate-readiness">2-3 months</div>
                    </div>
                    <div class="candidate-item developing">
                        <div class="candidate-name">W. Kambwala</div>
                        <div class="candidate-readiness">6+ months</div>
                    </div>
                </div>
            `;
        },

        // Content generators for Youth
        generateAcademyRatingContent() {
            return `
                <div class="academy-rating-display">
                    <div class="rating-value">92%</div>
                    <div class="rating-label">Academy Rating</div>
                    <div class="rating-context">
                        <div class="rating-stat">
                            <span class="stat-label">Facilities</span>
                            <span class="stat-value">World Class</span>
                        </div>
                        <div class="rating-stat">
                            <span class="stat-label">Coaching</span>
                            <span class="stat-value">Excellent</span>
                        </div>
                        <div class="rating-stat">
                            <span class="stat-label">Youth Intake</span>
                            <span class="stat-value">Very Good</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateYouthProspectsContent() {
            return `
                <div class="youth-prospects">
                    <div class="prospect-item exceptional">
                        <div class="prospect-info">
                            <span class="prospect-name">Alejandro Garnacho</span>
                            <span class="prospect-age">20</span>
                        </div>
                        <div class="prospect-rating">
                            <span class="current-rating">7.4</span>
                            <span class="potential-rating">8.8</span>
                        </div>
                    </div>
                    <div class="prospect-item high">
                        <div class="prospect-info">
                            <span class="prospect-name">Kobbie Mainoo</span>
                            <span class="prospect-age">19</span>
                        </div>
                        <div class="prospect-rating">
                            <span class="current-rating">7.3</span>
                            <span class="potential-rating">8.5</span>
                        </div>
                    </div>
                    <div class="prospect-item promising">
                        <div class="prospect-info">
                            <span class="prospect-name">Omari Forson</span>
                            <span class="prospect-age">19</span>
                        </div>
                        <div class="prospect-rating">
                            <span class="current-rating">6.1</span>
                            <span class="potential-rating">7.8</span>
                        </div>
                    </div>
                </div>
            `;
        },

        // Content generators for Staff
        generateCoachingStaffContent() {
            return `
                <div class="coaching-staff-table">
                    <table class="staff-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Rating</th>
                                <th>Wage</th>
                                <th>Contract</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="staff-row">
                                <td class="staff-name">Erik ten Hag</td>
                                <td class="staff-role">Manager</td>
                                <td class="staff-rating">8.5</td>
                                <td class="staff-wage">£200K/w</td>
                                <td class="staff-contract">2026</td>
                                <td class="staff-performance excellent">Excellent</td>
                            </tr>
                            <tr class="staff-row">
                                <td class="staff-name">Mitchell van der Gaag</td>
                                <td class="staff-role">Assistant Coach</td>
                                <td class="staff-rating">7.8</td>
                                <td class="staff-wage">£50K/w</td>
                                <td class="staff-contract">2025</td>
                                <td class="staff-performance good">Good</td>
                            </tr>
                            <tr class="staff-row">
                                <td class="staff-name">Steve McClaren</td>
                                <td class="staff-role">Coach</td>
                                <td class="staff-rating">7.5</td>
                                <td class="staff-wage">£40K/w</td>
                                <td class="staff-contract">2025</td>
                                <td class="staff-performance good">Good</td>
                            </tr>
                            <tr class="staff-row">
                                <td class="staff-name">Craig Mawson</td>
                                <td class="staff-role">Goalkeeping Coach</td>
                                <td class="staff-rating">7.2</td>
                                <td class="staff-wage">£25K/w</td>
                                <td class="staff-contract">2024</td>
                                <td class="staff-performance good">Good</td>
                            </tr>
                            <tr class="staff-row">
                                <td class="staff-name">Derek Ramsay</td>
                                <td class="staff-role">Fitness Coach</td>
                                <td class="staff-rating">7.8</td>
                                <td class="staff-wage">£30K/w</td>
                                <td class="staff-contract">2025</td>
                                <td class="staff-performance excellent">Excellent</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        },

        // Content generators for Dynamics
        generateTeamChemistryContent() {
            return `
                <div class="team-chemistry-overview">
                    <div class="chemistry-score">
                        <div class="chemistry-value">87%</div>
                        <div class="chemistry-label">Team Chemistry</div>
                        <div class="chemistry-trend positive">↗ Improving</div>
                    </div>
                    <div class="chemistry-factors">
                        <div class="factor-grid">
                            <div class="chemistry-factor positive">
                                <span class="factor-icon">⚽</span>
                                <span class="factor-name">Recent Success</span>
                                <span class="factor-impact">+15</span>
                            </div>
                            <div class="chemistry-factor positive">
                                <span class="factor-icon">🏆</span>
                                <span class="factor-name">Team Spirit</span>
                                <span class="factor-impact">+12</span>
                            </div>
                            <div class="chemistry-factor neutral">
                                <span class="factor-icon">💼</span>
                                <span class="factor-name">New Signings</span>
                                <span class="factor-impact">±0</span>
                            </div>
                            <div class="chemistry-factor negative">
                                <span class="factor-icon">🏥</span>
                                <span class="factor-name">Key Injuries</span>
                                <span class="factor-impact">-5</span>
                            </div>
                        </div>
                    </div>
                    <div class="chemistry-recommendation">
                        <div class="recommendation-header">Recommendation</div>
                        <div class="recommendation-text">Team bonding activities during international break could further improve chemistry</div>
                    </div>
                </div>
            `;
        },

        generateLeadershipHierarchyContent() {
            return `
                <div class="leadership-hierarchy">
                    <div class="leadership-level captain">
                        <div class="level-header">Captain</div>
                        <div class="leader-card">
                            <span class="leader-name">Bruno Fernandes</span>
                            <span class="leader-influence">95% Influence</span>
                        </div>
                    </div>
                    <div class="leadership-level vice-captain">
                        <div class="level-header">Vice Captain</div>
                        <div class="leader-card">
                            <span class="leader-name">Casemiro</span>
                            <span class="leader-influence">82% Influence</span>
                        </div>
                    </div>
                    <div class="leadership-level influencers">
                        <div class="level-header">Key Influencers</div>
                        <div class="influencer-list">
                            <div class="influencer-item">
                                <span class="influencer-name">Marcus Rashford</span>
                                <span class="influencer-type">Popular</span>
                            </div>
                            <div class="influencer-item">
                                <span class="influencer-name">Lisandro Martinez</span>
                                <span class="influencer-type">Determined</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };

    // Add Squad-specific styles
    const squadStyles = `
        /* Squad Subscreens Styles */
        
        /* Formation Tactics Display */
        .formation-tactics-display {
            padding: 0;
        }
        
        .tactics-header {
            margin-bottom: 16px;
            text-align: center;
        }
        
        .formation-name {
            font-size: 16px;
            font-weight: 700;
            color: var(--primary-400);
            margin-bottom: 8px;
        }
        
        .tactics-status {
            display: flex;
            justify-content: center;
            gap: 16px;
            font-size: 10px;
        }
        
        .familiarity {
            color: #00ff88;
            font-weight: 600;
        }
        
        .effectiveness {
            color: #ffb800;
            font-weight: 600;
        }
        
        .formation-grid {
            margin-bottom: 16px;
        }
        
        .formation-visual {
            position: relative;
            height: 160px;
            background: linear-gradient(to top, #1a2f1a 0%, #2d4a2d 100%);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: grid;
            grid-template-areas: 
                "lw am rw"
                ". st ."
                "cm1 . cm2"
                "dm . ."
                "lb cb1 cb2 rb"
                ". gk .";
            justify-items: center;
            align-items: center;
            padding: 8px;
        }
        
        .player-slot {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 6px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .player-slot:hover {
            transform: scale(1.1);
            z-index: 10;
        }
        
        .player-slot.gk { background: #ff6b35; }
        .player-slot.def { background: #0094cc; }
        .player-slot.mid { background: #00ff88; }
        .player-slot.att { background: #ffb800; }
        .player-slot.str { background: #ff4757; }
        
        .player-slot .player-name {
            font-size: 5px;
            line-height: 1;
        }
        
        .player-slot .player-rating {
            font-size: 4px;
            opacity: 0.8;
        }
        
        /* Key Players Display */
        .key-players-display {
            font-size: 10px;
        }
        
        .player-category {
            margin-bottom: 12px;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .player-category.captain {
            border: 1px solid #ffb800;
        }
        
        .player-category.star {
            border: 1px solid #00ff88;
        }
        
        .player-category.emerging {
            border: 1px solid #0094cc;
        }
        
        .category-header {
            background: rgba(0, 0, 0, 0.2);
            padding: 4px 8px;
            font-size: 9px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .player-info-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background: rgba(255, 255, 255, 0.02);
        }
        
        .player-details {
            flex: 1;
        }
        
        .player-info-card .player-name {
            color: white;
            font-weight: 500;
            display: block;
            font-size: 10px;
        }
        
        .player-info-card .player-position {
            color: rgba(255, 255, 255, 0.6);
            font-size: 8px;
        }
        
        .player-metrics {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .player-rating.excellent {
            color: #00ff88;
            font-weight: 700;
        }
        
        .player-rating.good {
            color: #ffb800;
            font-weight: 600;
        }
        
        .player-rating.promising {
            color: #0094cc;
            font-weight: 600;
        }
        
        /* Squad Actions */
        .squad-quick-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .action-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .action-btn.primary {
            background: var(--primary-400);
            color: white;
        }
        
        .action-btn.secondary {
            background: var(--accent-200);
            color: black;
        }
        
        .action-btn.utility {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        .action-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        /* Reserve Players Table */
        .reserve-players-table {
            font-size: 9px;
        }
        
        .players-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .players-table th {
            text-align: left;
            padding: 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.7);
            font-weight: 600;
            font-size: 8px;
        }
        
        .players-table td {
            padding: 3px 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 9px;
        }
        
        .player-row.promotion-ready {
            background: rgba(0, 255, 136, 0.1);
        }
        
        .player-potential.high {
            color: #00ff88;
            font-weight: 600;
        }
        
        .player-potential.medium {
            color: #ffb800;
        }
        
        .player-status.ready {
            color: #00ff88;
            font-weight: 600;
        }
        
        .player-status.developing {
            color: #0094cc;
        }
        
        .player-status.backup {
            color: #ffb800;
        }
        
        /* Academy Rating Display */
        .academy-rating-display {
            text-align: center;
        }
        
        .rating-value {
            font-size: 36px;
            font-weight: 700;
            color: var(--primary-400);
            margin-bottom: 8px;
        }
        
        .rating-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 16px;
        }
        
        .rating-context {
            font-size: 10px;
        }
        
        .rating-stat {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
        }
        
        /* Team Chemistry */
        .team-chemistry-overview {
            text-align: center;
        }
        
        .chemistry-score {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .chemistry-value {
            font-size: 32px;
            font-weight: 700;
            color: #00ff88;
        }
        
        .chemistry-label {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin: 4px 0;
        }
        
        .chemistry-trend.positive {
            font-size: 10px;
            color: #00ff88;
        }
        
        .factor-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-bottom: 16px;
        }
        
        .chemistry-factor {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px;
            border-radius: 3px;
            font-size: 9px;
        }
        
        .chemistry-factor.positive {
            background: rgba(0, 255, 136, 0.1);
        }
        
        .chemistry-factor.negative {
            background: rgba(255, 71, 87, 0.1);
        }
        
        .chemistry-factor.neutral {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .factor-impact {
            margin-left: auto;
            font-weight: 600;
        }
        
        .chemistry-factor.positive .factor-impact {
            color: #00ff88;
        }
        
        .chemistry-factor.negative .factor-impact {
            color: #ff4757;
        }
        
        /* Leadership Hierarchy */
        .leadership-hierarchy {
            font-size: 10px;
        }
        
        .leadership-level {
            margin-bottom: 12px;
        }
        
        .level-header {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 6px;
            text-transform: uppercase;
        }
        
        .leader-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background: rgba(0, 148, 204, 0.1);
            border-radius: 4px;
            border-left: 2px solid #0094cc;
        }
        
        .leader-name {
            color: white;
            font-weight: 600;
        }
        
        .leader-influence {
            color: #0094cc;
            font-size: 9px;
        }
        
        .influencer-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .influencer-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 6px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 3px;
        }
        
        .influencer-name {
            color: white;
            font-size: 9px;
        }
        
        .influencer-type {
            color: rgba(255, 255, 255, 0.6);
            font-size: 8px;
            font-style: italic;
        }
    `;
    
    // Inject styles
    const style = document.createElement('style');
    style.id = 'squad-subscreens-styles';
    style.textContent = squadStyles;
    document.head.appendChild(style);

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => SquadSubscreens.init(), 800);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => SquadSubscreens.init(), 800);
        });
    }

    // Make available globally
    window.SquadSubscreens = SquadSubscreens;

})();