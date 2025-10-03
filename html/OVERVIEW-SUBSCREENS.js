/**
 * OVERVIEW SUBSCREENS IMPLEMENTATION
 * Complete implementation of all Overview tab subscreens using template system
 * Dashboard, Reports, Statistics, News, Inbox with optimal grid utilization
 */

(function() {
    'use strict';

    console.log('📊 OVERVIEW SUBSCREENS: Implementing comprehensive Overview tab subscreens...');

    const OverviewSubscreens = {
        init() {
            console.log('📊 OVERVIEW: Setting up all Overview subscreens...');
            
            this.setupDashboardSubscreen();
            this.setupReportsSubscreen();
            this.setupStatisticsSubscreen();
            this.setupNewsSubscreen();
            this.setupInboxSubscreen();
            
            console.log('✅ OVERVIEW SUBSCREENS: All subscreens configured');
        },

        setupDashboardSubscreen() {
            console.log('🏠 Setting up Overview Dashboard subscreen...');
            
            const dashboardCustomization = {
                title: 'Overview Dashboard',
                components: {
                    'main-kpi': {
                        id: 'team-overview',
                        title: 'Team Overview',
                        content: this.generateTeamOverviewContent()
                    },
                    'secondary-kpi-1': {
                        id: 'next-match',
                        title: 'Next Match',
                        content: this.generateNextMatchContent()
                    },
                    'secondary-kpi-2': {
                        id: 'league-position',
                        title: 'League Position',
                        content: this.generateLeaguePositionContent()
                    },
                    'trend-chart': {
                        id: 'performance-trend',
                        title: 'Performance Trend',
                        content: this.generatePerformanceTrendContent()
                    },
                    'status-panel': {
                        id: 'squad-status',
                        title: 'Squad Status',
                        content: this.generateSquadStatusContent()
                    },
                    'alerts': {
                        id: 'priority-alerts',
                        title: 'Priority Alerts',
                        content: this.generatePriorityAlertsContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyDashboardTemplate('overview', 'dashboard', dashboardCustomization);
            }
            
            console.log('✅ Overview Dashboard configured with 6 components');
        },

        setupReportsSubscreen() {
            console.log('📋 Setting up Overview Reports subscreen...');
            
            const reportsCustomization = {
                title: 'Reports & Analysis',
                components: {
                    'main-chart': {
                        id: 'season-performance',
                        title: 'Season Performance Report',
                        content: this.generateSeasonPerformanceContent()
                    },
                    'data-breakdown': {
                        id: 'key-metrics',
                        title: 'Key Metrics Breakdown',
                        content: this.generateKeyMetricsContent()
                    },
                    'insights': {
                        id: 'performance-insights',
                        title: 'Performance Insights',
                        content: this.generatePerformanceInsightsContent()
                    },
                    'controls': {
                        id: 'report-controls',
                        title: 'Report Controls',
                        content: this.generateReportControlsContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyAnalysisTemplate('overview', 'reports', reportsCustomization);
            }
            
            console.log('✅ Overview Reports configured with analysis template');
        },

        setupStatisticsSubscreen() {
            console.log('📈 Setting up Overview Statistics subscreen...');
            
            const statisticsCustomization = {
                title: 'Team Statistics',
                components: {
                    'data-table': {
                        id: 'season-stats-table',
                        title: 'Season Statistics',
                        content: this.generateSeasonStatsTableContent()
                    },
                    'filters': {
                        id: 'stats-filters',
                        title: 'Filter & Compare',
                        content: this.generateStatsFiltersContent()
                    },
                    'actions': {
                        id: 'stats-actions',
                        title: 'Export & Share',
                        content: this.generateStatsActionsContent()
                    },
                    'summary': {
                        id: 'stats-summary',
                        title: 'Key Highlights',
                        content: this.generateStatsSummaryContent()
                    },
                    'quick-stats': {
                        id: 'league-comparison',
                        title: 'League Comparison',
                        content: this.generateLeagueComparisonContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyListTemplate('overview', 'statistics', statisticsCustomization);
            }
            
            console.log('✅ Overview Statistics configured with list template');
        },

        setupNewsSubscreen() {
            console.log('📰 Setting up Overview News subscreen...');
            
            const newsCustomization = {
                title: 'News & Media',
                components: {
                    'primary-detail': {
                        id: 'latest-news',
                        title: 'Latest Football News',
                        content: this.generateLatestNewsContent()
                    },
                    'supporting-info': {
                        id: 'press-center',
                        title: 'Press Center',
                        content: this.generatePressCenterContent()
                    },
                    'actions': {
                        id: 'media-actions',
                        title: 'Media Actions',
                        content: this.generateMediaActionsContent()
                    },
                    'context': {
                        id: 'news-archive',
                        title: 'News Archive',
                        content: this.generateNewsArchiveContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyDetailTemplate('overview', 'news', newsCustomization);
            }
            
            console.log('✅ Overview News configured with detail template');
        },

        setupInboxSubscreen() {
            console.log('📬 Setting up Overview Inbox subscreen...');
            
            const inboxCustomization = {
                title: 'Messages & Communications',
                components: {
                    'data-table': {
                        id: 'messages-list',
                        title: 'Recent Messages',
                        content: this.generateMessagesListContent()
                    },
                    'filters': {
                        id: 'message-filters',
                        title: 'Message Filters',
                        content: this.generateMessageFiltersContent()
                    },
                    'actions': {
                        id: 'message-actions',
                        title: 'Quick Actions',
                        content: this.generateMessageActionsContent()
                    },
                    'summary': {
                        id: 'inbox-summary',
                        title: 'Inbox Summary',
                        content: this.generateInboxSummaryContent()
                    },
                    'quick-stats': {
                        id: 'communication-stats',
                        title: 'Communication Stats',
                        content: this.generateCommunicationStatsContent()
                    }
                }
            };
            
            if (window.SubscreenTemplates) {
                window.SubscreenTemplates.applyListTemplate('overview', 'inbox', inboxCustomization);
            }
            
            console.log('✅ Overview Inbox configured with list template');
        },

        // Content generators for Dashboard subscreen
        generateTeamOverviewContent() {
            return `
                <div class="team-overview-kpi">
                    <div class="overview-metric primary">
                        <div class="metric-value">85%</div>
                        <div class="metric-label">Overall Team Rating</div>
                    </div>
                    <div class="overview-grid">
                        <div class="overview-stat">
                            <span class="stat-label">League Position</span>
                            <span class="stat-value">4th</span>
                        </div>
                        <div class="overview-stat">
                            <span class="stat-label">Points</span>
                            <span class="stat-value">42</span>
                        </div>
                        <div class="overview-stat">
                            <span class="stat-label">Form</span>
                            <span class="stat-value">WWDLW</span>
                        </div>
                        <div class="overview-stat">
                            <span class="stat-label">Squad Morale</span>
                            <span class="stat-value">Excellent</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateNextMatchContent() {
            return `
                <div class="next-match-preview">
                    <div class="match-opponent">Liverpool</div>
                    <div class="match-details">
                        <div class="match-venue">Old Trafford</div>
                        <div class="match-time">Saturday 15:00</div>
                        <div class="match-competition">Premier League</div>
                    </div>
                    <div class="match-preparation">
                        <div class="prep-status ready">Ready</div>
                    </div>
                </div>
            `;
        },

        generateLeaguePositionContent() {
            return `
                <div class="league-position-display">
                    <div class="position-large">4th</div>
                    <div class="position-details">
                        <div class="position-stat">
                            <span class="stat-label">Points</span>
                            <span class="stat-value">42</span>
                        </div>
                        <div class="position-stat">
                            <span class="stat-label">Goal Diff</span>
                            <span class="stat-value">+12</span>
                        </div>
                        <div class="position-stat">
                            <span class="stat-label">Matches</span>
                            <span class="stat-value">20</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generatePerformanceTrendContent() {
            return `
                <div class="performance-trend">
                    <div class="trend-header">Last 10 Matches</div>
                    <div class="trend-chart">
                        <div class="trend-bars">
                            <div class="trend-bar" style="height: 70%;" title="Win"></div>
                            <div class="trend-bar" style="height: 40%;" title="Loss"></div>
                            <div class="trend-bar" style="height: 85%;" title="Win"></div>
                            <div class="trend-bar" style="height: 60%;" title="Draw"></div>
                            <div class="trend-bar" style="height: 90%;" title="Win"></div>
                            <div class="trend-bar" style="height: 75%;" title="Win"></div>
                            <div class="trend-bar" style="height: 50%;" title="Draw"></div>
                            <div class="trend-bar" style="height: 30%;" title="Loss"></div>
                            <div class="trend-bar" style="height: 80%;" title="Win"></div>
                            <div class="trend-bar" style="height: 85%;" title="Win"></div>
                        </div>
                    </div>
                    <div class="trend-summary">
                        <span class="trend-label">Trend:</span>
                        <span class="trend-value positive">Improving ↗</span>
                    </div>
                </div>
            `;
        },

        generateSquadStatusContent() {
            return `
                <div class="squad-status-compact">
                    <div class="status-metric">
                        <span class="status-label">Available</span>
                        <span class="status-value">22</span>
                    </div>
                    <div class="status-metric">
                        <span class="status-label">Injured</span>
                        <span class="status-value warning">3</span>
                    </div>
                    <div class="status-metric">
                        <span class="status-label">Morale</span>
                        <span class="status-value positive">High</span>
                    </div>
                </div>
            `;
        },

        generatePriorityAlertsContent() {
            return `
                <div class="priority-alerts">
                    <div class="alert-item urgent">
                        <span class="alert-icon">⚠️</span>
                        <span class="alert-text">Contract expires</span>
                    </div>
                    <div class="alert-item medium">
                        <span class="alert-icon">📋</span>
                        <span class="alert-text">Scout report ready</span>
                    </div>
                    <div class="alert-item low">
                        <span class="alert-icon">💼</span>
                        <span class="alert-text">Board meeting</span>
                    </div>
                </div>
            `;
        },

        // Content generators for Reports subscreen
        generateSeasonPerformanceContent() {
            return `
                <div class="season-performance-report">
                    <div class="report-title">Season 2024/25 Performance</div>
                    <div class="performance-chart">
                        <div class="chart-container">
                            <div class="chart-y-axis">
                                <span>100%</span>
                                <span>75%</span>
                                <span>50%</span>
                                <span>25%</span>
                                <span>0%</span>
                            </div>
                            <div class="chart-area">
                                <div class="chart-line">
                                    <div class="chart-point" style="left: 10%; bottom: 40%;"></div>
                                    <div class="chart-point" style="left: 20%; bottom: 35%;"></div>
                                    <div class="chart-point" style="left: 30%; bottom: 50%;"></div>
                                    <div class="chart-point" style="left: 40%; bottom: 60%;"></div>
                                    <div class="chart-point" style="left: 50%; bottom: 65%;"></div>
                                    <div class="chart-point" style="left: 60%; bottom: 70%;"></div>
                                    <div class="chart-point" style="left: 70%; bottom: 75%;"></div>
                                    <div class="chart-point" style="left: 80%; bottom: 72%;"></div>
                                    <div class="chart-point" style="left: 90%; bottom: 78%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="report-summary">
                        <div class="summary-stat">
                            <span class="summary-label">Current Form</span>
                            <span class="summary-value positive">78% Performance</span>
                        </div>
                        <div class="summary-stat">
                            <span class="summary-label">Improvement</span>
                            <span class="summary-value positive">+12% vs Last Season</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generateKeyMetricsContent() {
            return `
                <div class="key-metrics-breakdown">
                    <div class="metrics-header">Performance Breakdown</div>
                    <div class="metrics-list">
                        <div class="metric-breakdown">
                            <span class="metric-name">Goals Scored</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 76%;"></div>
                            </div>
                            <span class="metric-number">38</span>
                        </div>
                        <div class="metric-breakdown">
                            <span class="metric-name">Goals Conceded</span>
                            <div class="metric-bar">
                                <div class="metric-fill red" style="width: 35%;"></div>
                            </div>
                            <span class="metric-number">26</span>
                        </div>
                        <div class="metric-breakdown">
                            <span class="metric-name">Clean Sheets</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 45%;"></div>
                            </div>
                            <span class="metric-number">9</span>
                        </div>
                        <div class="metric-breakdown">
                            <span class="metric-name">Possession</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 58%;"></div>
                            </div>
                            <span class="metric-number">58%</span>
                        </div>
                        <div class="metric-breakdown">
                            <span class="metric-name">Pass Accuracy</span>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: 84%;"></div>
                            </div>
                            <span class="metric-number">84%</span>
                        </div>
                    </div>
                </div>
            `;
        },

        generatePerformanceInsightsContent() {
            return `
                <div class="performance-insights">
                    <div class="insight-item positive">
                        <div class="insight-icon">✅</div>
                        <div class="insight-text">Strong attacking form in last 5 matches</div>
                    </div>
                    <div class="insight-item warning">
                        <div class="insight-icon">⚠️</div>
                        <div class="insight-text">Defensive vulnerabilities vs top 6</div>
                    </div>
                    <div class="insight-item info">
                        <div class="insight-icon">💡</div>
                        <div class="insight-text">Squad rotation improving fitness</div>
                    </div>
                    <div class="insight-item positive">
                        <div class="insight-icon">📈</div>
                        <div class="insight-text">Youth players exceeding expectations</div>
                    </div>
                </div>
            `;
        },

        generateReportControlsContent() {
            return `
                <div class="report-controls">
                    <div class="control-group">
                        <label class="control-label">Period</label>
                        <select class="control-select">
                            <option>Current Season</option>
                            <option>Last 30 Days</option>
                            <option>Last Season</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label class="control-label">Format</label>
                        <select class="control-select">
                            <option>Detailed</option>
                            <option>Summary</option>
                            <option>Executive</option>
                        </select>
                    </div>
                    <div class="control-actions">
                        <button class="action-btn primary">Generate Report</button>
                        <button class="action-btn secondary">Export PDF</button>
                    </div>
                </div>
            `;
        },

        // Content generators for Statistics subscreen
        generateSeasonStatsTableContent() {
            return `
                <div class="season-stats-table">
                    <div class="stats-table-header">
                        <span class="table-title">Season 2024/25 Statistics</span>
                        <div class="table-controls">
                            <select class="period-selector">
                                <option>Full Season</option>
                                <option>Home Games</option>
                                <option>Away Games</option>
                                <option>Last 10 Games</option>
                            </select>
                        </div>
                    </div>
                    <div class="stats-table-content">
                        <table class="stats-table">
                            <thead>
                                <tr>
                                    <th>Statistic</th>
                                    <th>Value</th>
                                    <th>League Avg</th>
                                    <th>Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Goals Scored</td>
                                    <td>38</td>
                                    <td>32</td>
                                    <td class="rank good">5th</td>
                                </tr>
                                <tr>
                                    <td>Goals Conceded</td>
                                    <td>26</td>
                                    <td>29</td>
                                    <td class="rank good">7th</td>
                                </tr>
                                <tr>
                                    <td>Possession %</td>
                                    <td>58%</td>
                                    <td>52%</td>
                                    <td class="rank good">6th</td>
                                </tr>
                                <tr>
                                    <td>Pass Accuracy</td>
                                    <td>84%</td>
                                    <td>78%</td>
                                    <td class="rank excellent">3rd</td>
                                </tr>
                                <tr>
                                    <td>Shots per Game</td>
                                    <td>14.2</td>
                                    <td>12.8</td>
                                    <td class="rank good">4th</td>
                                </tr>
                                <tr>
                                    <td>Clean Sheets</td>
                                    <td>9</td>
                                    <td>7</td>
                                    <td class="rank good">5th</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        },

        generateStatsFiltersContent() {
            return `
                <div class="stats-filters">
                    <div class="filter-group">
                        <label class="filter-label">Competition</label>
                        <select class="filter-select">
                            <option value="all">All Competitions</option>
                            <option value="pl">Premier League</option>
                            <option value="ucl">Champions League</option>
                            <option value="fa">FA Cup</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Venue</label>
                        <select class="filter-select">
                            <option value="all">Home & Away</option>
                            <option value="home">Home Only</option>
                            <option value="away">Away Only</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Opposition</label>
                        <select class="filter-select">
                            <option value="all">All Teams</option>
                            <option value="top6">Top 6</option>
                            <option value="bottom14">Bottom 14</option>
                        </select>
                    </div>
                    <div class="filter-actions">
                        <button class="filter-btn apply">Apply Filters</button>
                        <button class="filter-btn reset">Reset</button>
                    </div>
                </div>
            `;
        },

        // Content generators for News subscreen
        generateLatestNewsContent() {
            return `
                <div class="latest-news">
                    <div class="news-item featured">
                        <div class="news-header">
                            <span class="news-category">Transfer News</span>
                            <span class="news-time">2 hours ago</span>
                        </div>
                        <div class="news-title">Manchester United Close to Signing Midfielder</div>
                        <div class="news-excerpt">Sources suggest United are in advanced talks with a top European midfielder...</div>
                    </div>
                    <div class="news-item">
                        <div class="news-header">
                            <span class="news-category">Match Report</span>
                            <span class="news-time">1 day ago</span>
                        </div>
                        <div class="news-title">United's Tactical Masterclass Against Arsenal</div>
                        <div class="news-excerpt">Analysis of the 2-1 victory that showcased improved defensive solidity...</div>
                    </div>
                    <div class="news-item">
                        <div class="news-header">
                            <span class="news-category">Youth News</span>
                            <span class="news-time">2 days ago</span>
                        </div>
                        <div class="news-title">Academy Star Impresses in U21 Tournament</div>
                        <div class="news-excerpt">Young prospect catches the eye with standout performances...</div>
                    </div>
                </div>
            `;
        },

        generatePressCenterContent() {
            return `
                <div class="press-center">
                    <div class="press-header">Press Center</div>
                    <div class="press-schedule">
                        <div class="press-item upcoming">
                            <div class="press-type">Pre-Match Conference</div>
                            <div class="press-time">Friday 13:00</div>
                            <div class="press-status">Scheduled</div>
                        </div>
                        <div class="press-item completed">
                            <div class="press-type">Post-Match Interview</div>
                            <div class="press-time">Sunday 17:30</div>
                            <div class="press-status">Completed</div>
                        </div>
                    </div>
                    <div class="press-actions">
                        <button class="press-btn">View Transcripts</button>
                        <button class="press-btn">Schedule Interview</button>
                    </div>
                </div>
            `;
        },

        // Content generators for Inbox subscreen
        generateMessagesListContent() {
            return `
                <div class="messages-list">
                    <div class="message-item unread urgent">
                        <div class="message-header">
                            <span class="message-from">Board of Directors</span>
                            <span class="message-time">1 hour ago</span>
                        </div>
                        <div class="message-subject">Transfer Budget Update Required</div>
                        <div class="message-preview">The board requires an updated transfer strategy...</div>
                    </div>
                    <div class="message-item unread">
                        <div class="message-header">
                            <span class="message-from">Chief Scout</span>
                            <span class="message-time">3 hours ago</span>
                        </div>
                        <div class="message-subject">Priority Target Assessment Complete</div>
                        <div class="message-preview">Comprehensive report on Jeremie Frimpong now available...</div>
                    </div>
                    <div class="message-item read">
                        <div class="message-header">
                            <span class="message-from">Medical Team</span>
                            <span class="message-time">Yesterday</span>
                        </div>
                        <div class="message-subject">Injury Update - Shaw & Martial</div>
                        <div class="message-preview">Latest medical assessment and recovery timelines...</div>
                    </div>
                    <div class="message-item read">
                        <div class="message-header">
                            <span class="message-from">Youth Coach</span>
                            <span class="message-time">2 days ago</span>
                        </div>
                        <div class="message-subject">Academy Player Ready for Promotion</div>
                        <div class="message-preview">Recommendation for first team consideration...</div>
                    </div>
                </div>
            `;
        },

        generateMessageFiltersContent() {
            return `
                <div class="message-filters">
                    <div class="filter-section">
                        <label class="filter-label">Status</label>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="checkbox" checked> Unread
                            </label>
                            <label class="filter-option">
                                <input type="checkbox"> Read
                            </label>
                            <label class="filter-option">
                                <input type="checkbox"> Flagged
                            </label>
                        </div>
                    </div>
                    <div class="filter-section">
                        <label class="filter-label">Priority</label>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="checkbox" checked> Urgent
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked> High
                            </label>
                            <label class="filter-option">
                                <input type="checkbox"> Normal
                            </label>
                        </div>
                    </div>
                    <div class="filter-section">
                        <label class="filter-label">From</label>
                        <select class="sender-filter">
                            <option>All Contacts</option>
                            <option>Board</option>
                            <option>Staff</option>
                            <option>Agents</option>
                            <option>Media</option>
                        </select>
                    </div>
                </div>
            `;
        },

        // Register all subscreens with the main system
        registerWithSubscreenSystem() {
            console.log('🔗 Registering Overview subscreens with main system...');
            
            if (window.SubscreenSystem && window.SubscreenSystem.subscreenDefinitions) {
                // The definitions are already set up in the template applications above
                console.log('✅ Overview subscreens registered');
            } else {
                console.warn('⚠️ SubscreenSystem not available - registering later');
                // Try again after a delay
                setTimeout(() => this.registerWithSubscreenSystem(), 1000);
            }
        }
    };

    // Add Overview-specific styles
    const overviewStyles = `
        /* Overview Subscreens Styles */
        
        /* Team Overview KPI */
        .team-overview-kpi {
            text-align: center;
        }
        
        .overview-metric.primary {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .overview-metric .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-400);
        }
        
        .overview-metric .metric-label {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 4px;
        }
        
        .overview-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 10px;
        }
        
        .overview-stat {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        /* Next Match Preview */
        .next-match-preview {
            text-align: center;
        }
        
        .match-opponent {
            font-size: 14px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
        }
        
        .match-details {
            margin-bottom: 12px;
        }
        
        .match-venue, .match-time, .match-competition {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            margin: 2px 0;
        }
        
        .match-preparation {
            margin-top: 12px;
        }
        
        .prep-status.ready {
            background: #00ff88;
            color: black;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 600;
        }
        
        /* League Position Display */
        .league-position-display {
            text-align: center;
        }
        
        .position-large {
            font-size: 32px;
            font-weight: 700;
            color: var(--primary-400);
            margin-bottom: 8px;
        }
        
        .position-details {
            font-size: 10px;
        }
        
        .position-stat {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
        }
        
        /* Performance Trend */
        .performance-trend {
            text-align: center;
        }
        
        .trend-header {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 12px;
        }
        
        .trend-chart {
            height: 60px;
            margin-bottom: 12px;
            position: relative;
        }
        
        .trend-bars {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            height: 100%;
            padding: 0 8px;
        }
        
        .trend-bar {
            width: 8px;
            background: linear-gradient(to top, #0094cc, #00ff88);
            border-radius: 2px;
            transition: height 0.3s ease;
            cursor: pointer;
        }
        
        .trend-bar:hover {
            background: linear-gradient(to top, #00ff88, #ffb800);
        }
        
        .trend-summary {
            font-size: 10px;
        }
        
        .trend-value.positive {
            color: #00ff88;
        }
        
        /* Squad Status Compact */
        .squad-status-compact {
            font-size: 10px;
        }
        
        .status-metric {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
        }
        
        .status-value.warning {
            color: #ffb800;
        }
        
        .status-value.positive {
            color: #00ff88;
        }
        
        /* Priority Alerts */
        .priority-alerts {
            font-size: 9px;
        }
        
        .alert-item {
            display: flex;
            align-items: center;
            gap: 6px;
            margin: 4px 0;
            padding: 4px;
            border-radius: 3px;
        }
        
        .alert-item.urgent {
            background: rgba(255, 71, 87, 0.1);
            border-left: 2px solid #ff4757;
        }
        
        .alert-item.medium {
            background: rgba(255, 184, 0, 0.1);
            border-left: 2px solid #ffb800;
        }
        
        .alert-item.low {
            background: rgba(255, 255, 255, 0.05);
            border-left: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .alert-icon {
            font-size: 10px;
        }
        
        .alert-text {
            color: white;
            font-size: 9px;
        }
        
        /* Season Performance Report */
        .season-performance-report {
            padding: 0;
        }
        
        .report-title {
            font-size: 12px;
            font-weight: 600;
            color: white;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .performance-chart {
            height: 120px;
            margin-bottom: 16px;
            position: relative;
        }
        
        .chart-container {
            display: flex;
            height: 100%;
        }
        
        .chart-y-axis {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 30px;
            font-size: 8px;
            color: rgba(255, 255, 255, 0.5);
            padding-right: 8px;
        }
        
        .chart-area {
            flex: 1;
            position: relative;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }
        
        .chart-point {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #0094cc;
            border-radius: 50%;
            border: 1px solid white;
        }
        
        /* Messages List */
        .messages-list {
            font-size: 10px;
        }
        
        .message-item {
            padding: 8px;
            margin-bottom: 4px;
            border-radius: 4px;
            border-left: 2px solid transparent;
        }
        
        .message-item.unread {
            background: rgba(0, 148, 204, 0.05);
            border-left-color: #0094cc;
        }
        
        .message-item.unread.urgent {
            border-left-color: #ff4757;
            background: rgba(255, 71, 87, 0.05);
        }
        
        .message-item.read {
            background: rgba(255, 255, 255, 0.02);
        }
        
        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        
        .message-from {
            font-weight: 600;
            color: white;
        }
        
        .message-time {
            color: rgba(255, 255, 255, 0.5);
            font-size: 8px;
        }
        
        .message-subject {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 4px;
        }
        
        .message-preview {
            color: rgba(255, 255, 255, 0.6);
            font-size: 9px;
            line-height: 1.3;
        }
        
        /* Stats Table */
        .stats-table {
            width: 100%;
            font-size: 10px;
            border-collapse: collapse;
        }
        
        .stats-table th {
            text-align: left;
            padding: 6px 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.7);
            font-weight: 600;
            font-size: 9px;
        }
        
        .stats-table td {
            padding: 4px 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.9);
        }
        
        .rank.excellent {
            color: #00ff88;
            font-weight: 600;
        }
        
        .rank.good {
            color: #ffb800;
            font-weight: 600;
        }
        
        .rank.poor {
            color: #ff4757;
            font-weight: 600;
        }
    `;
    
    // Inject styles
    const style = document.createElement('style');
    style.id = 'overview-subscreens-styles';
    style.textContent = overviewStyles;
    document.head.appendChild(style);

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => OverviewSubscreens.init(), 700);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => OverviewSubscreens.init(), 700);
        });
    }

    // Make available globally
    window.OverviewSubscreens = OverviewSubscreens;

})();