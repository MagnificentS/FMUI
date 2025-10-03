/* ==========================================
   CHART CARD ENHANCEMENTS - Working Football Manager Visualizations
   Replaces empty chart containers with interactive charts
   ========================================== */

/**
 * ChartCardEnhancements - Enhances all FM cards with working interactive charts
 * 
 * This script replaces placeholder chart containers with fully functional
 * AttributeCircle, BarChart, and PizzaChart visualizations
 */
window.ChartCardEnhancements = {
    
    // Enhanced card generators with working charts
    enhancedCardGenerators: {
        
        // Performance Dashboard with Interactive Charts
        generatePerformanceDashboard() {
            return `
                <div class="performance-dashboard-enhanced">
                    <div class="dashboard-kpis">
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <span class="kpi-icon">⚽</span>
                                <span class="kpi-label">Goals This Season</span>
                            </div>
                            <div class="kpi-value">17</div>
                            <div class="kpi-change up">+3 vs last month</div>
                            <div class="kpi-chart" id="goals-trend-mini"></div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <span class="kpi-icon">🎯</span>
                                <span class="kpi-label">Average Rating</span>
                            </div>
                            <div class="kpi-value">7.2</div>
                            <div class="kpi-change up">+0.3 improvement</div>
                            <div class="kpi-chart" id="rating-trend-mini"></div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <span class="kpi-icon">🅰️</span>
                                <span class="kpi-label">Assists</span>
                            </div>
                            <div class="kpi-value">5</div>
                            <div class="kpi-change stable">Same as last month</div>
                            <div class="kpi-chart" id="assists-trend-mini"></div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-header">
                                <span class="kpi-icon">⏱️</span>
                                <span class="kpi-label">Minutes Played</span>
                            </div>
                            <div class="kpi-value">2,890</div>
                            <div class="kpi-change up">+120 this month</div>
                            <div class="kpi-chart" id="minutes-trend-mini"></div>
                        </div>
                    </div>
                    
                    <div class="dashboard-main-charts">
                        <div class="chart-section">
                            <h4>Performance Breakdown</h4>
                            <div class="chart-container" id="performance-breakdown-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Recent Form (Last 6 Matches)</h4>
                            <div class="chart-container" id="recent-form-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Squad Comparison (Goals)</h4>
                            <div class="chart-container" id="squad-comparison-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Monthly Progress</h4>
                            <div class="chart-container" id="monthly-progress-chart"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Financial Overview with Interactive Charts
        generateFinancialOverview() {
            return `
                <div class="financial-overview-enhanced">
                    <div class="financial-summary-cards">
                        <div class="financial-card revenue">
                            <div class="card-header">
                                <span class="card-icon">💰</span>
                                <span class="card-title">Total Revenue</span>
                            </div>
                            <div class="card-value">€397M</div>
                            <div class="card-change up">+€15.2M vs last season</div>
                        </div>
                        
                        <div class="financial-card expenses">
                            <div class="card-header">
                                <span class="card-icon">💸</span>
                                <span class="card-title">Operating Expenses</span>
                            </div>
                            <div class="card-value">€282M</div>
                            <div class="card-change down">-€8.5M optimized</div>
                        </div>
                        
                        <div class="financial-card profit">
                            <div class="card-header">
                                <span class="card-icon">📈</span>
                                <span class="card-title">Net Profit</span>
                            </div>
                            <div class="card-value">€115M</div>
                            <div class="card-change up">+€23.7M increase</div>
                        </div>
                        
                        <div class="financial-card ffp">
                            <div class="card-header">
                                <span class="card-icon">⚖️</span>
                                <span class="card-title">FFP Status</span>
                            </div>
                            <div class="card-value">Compliant</div>
                            <div class="card-change up">78% compliance score</div>
                        </div>
                    </div>
                    
                    <div class="financial-charts-grid">
                        <div class="chart-section full-width">
                            <h4>Revenue Breakdown by Source</h4>
                            <div class="chart-container" id="revenue-sources-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Monthly Financial Trend</h4>
                            <div class="chart-container" id="financial-trend-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Expense Categories</h4>
                            <div class="chart-container" id="expense-breakdown-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Budget vs Actual (Quarterly)</h4>
                            <div class="chart-container" id="budget-actual-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>FFP Compliance Tracking</h4>
                            <div class="chart-container" id="ffp-compliance-chart"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Squad Summary with Player Attributes
        generateSquadSummary() {
            return `
                <div class="squad-summary-enhanced">
                    <div class="squad-overview">
                        <div class="squad-stats">
                            <div class="stat-item">
                                <span class="stat-label">Squad Size</span>
                                <span class="stat-value">25</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Average Age</span>
                                <span class="stat-value">26.3</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Total Value</span>
                                <span class="stat-value">€842M</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Injuries</span>
                                <span class="stat-value">3</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="key-players-section">
                        <h4>Key Players Attributes</h4>
                        <div class="players-grid">
                            <div class="player-card">
                                <div class="player-info">
                                    <span class="player-name">Bruno Fernandes</span>
                                    <span class="player-position">AM</span>
                                </div>
                                <div class="player-attributes" id="bruno-attributes"></div>
                            </div>
                            
                            <div class="player-card">
                                <div class="player-info">
                                    <span class="player-name">Marcus Rashford</span>
                                    <span class="player-position">LW</span>
                                </div>
                                <div class="player-attributes" id="rashford-attributes"></div>
                            </div>
                            
                            <div class="player-card">
                                <div class="player-info">
                                    <span class="player-name">Casemiro</span>
                                    <span class="player-position">DM</span>
                                </div>
                                <div class="player-attributes" id="casemiro-attributes"></div>
                            </div>
                            
                            <div class="player-card">
                                <div class="player-info">
                                    <span class="player-name">Rasmus Højlund</span>
                                    <span class="player-position">ST</span>
                                </div>
                                <div class="player-attributes" id="hojlund-attributes"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="squad-analysis">
                        <div class="chart-section">
                            <h4>Position Strength Analysis</h4>
                            <div class="chart-container" id="position-strength-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Age Distribution</h4>
                            <div class="chart-container" id="age-distribution-chart"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Tactical Overview with Formation Visualization
        generateTacticalOverview() {
            return `
                <div class="tactical-overview-enhanced">
                    <div class="formation-section">
                        <h4>Current Formation: 4-2-3-1</h4>
                        <div class="formation-visualization">
                            <div class="pitch-container">
                                <div class="formation-position gk" data-position="GK">
                                    <span class="position-label">GK</span>
                                    <span class="player-name">Onana</span>
                                    <div class="position-rating" id="gk-rating"></div>
                                </div>
                                
                                <div class="formation-position rb" data-position="RB">
                                    <span class="position-label">RB</span>
                                    <span class="player-name">Dalot</span>
                                    <div class="position-rating" id="rb-rating"></div>
                                </div>
                                
                                <div class="formation-position cb1" data-position="CB">
                                    <span class="position-label">CB</span>
                                    <span class="player-name">Varane</span>
                                    <div class="position-rating" id="cb1-rating"></div>
                                </div>
                                
                                <div class="formation-position cb2" data-position="CB">
                                    <span class="position-label">CB</span>
                                    <span class="player-name">Martinez</span>
                                    <div class="position-rating" id="cb2-rating"></div>
                                </div>
                                
                                <div class="formation-position lb" data-position="LB">
                                    <span class="position-label">LB</span>
                                    <span class="player-name">Shaw</span>
                                    <div class="position-rating" id="lb-rating"></div>
                                </div>
                                
                                <div class="formation-position dm1" data-position="DM">
                                    <span class="position-label">DM</span>
                                    <span class="player-name">Casemiro</span>
                                    <div class="position-rating" id="dm1-rating"></div>
                                </div>
                                
                                <div class="formation-position dm2" data-position="CM">
                                    <span class="position-label">CM</span>
                                    <span class="player-name">Mainoo</span>
                                    <div class="position-rating" id="dm2-rating"></div>
                                </div>
                                
                                <div class="formation-position rw" data-position="RW">
                                    <span class="position-label">RW</span>
                                    <span class="player-name">Garnacho</span>
                                    <div class="position-rating" id="rw-rating"></div>
                                </div>
                                
                                <div class="formation-position am" data-position="AM">
                                    <span class="position-label">AM</span>
                                    <span class="player-name">Bruno</span>
                                    <div class="position-rating" id="am-rating"></div>
                                </div>
                                
                                <div class="formation-position lw" data-position="LW">
                                    <span class="position-label">LW</span>
                                    <span class="player-name">Rashford</span>
                                    <div class="position-rating" id="lw-rating"></div>
                                </div>
                                
                                <div class="formation-position st" data-position="ST">
                                    <span class="position-label">ST</span>
                                    <span class="player-name">Højlund</span>
                                    <div class="position-rating" id="st-rating"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tactical-analysis">
                        <div class="chart-section">
                            <h4>Team Shape Effectiveness</h4>
                            <div class="chart-container" id="team-shape-chart"></div>
                        </div>
                        
                        <div class="chart-section">
                            <h4>Tactical Instructions Success Rate</h4>
                            <div class="chart-container" id="tactical-success-chart"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Match Preview with Statistics
        generateMatchPreview() {
            return `
                <div class="match-preview-enhanced">
                    <div class="match-header">
                        <div class="team home">
                            <div class="team-badge">🔴</div>
                            <div class="team-name">Manchester United</div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">Sunday, 15:00</div>
                            <div class="match-competition">Premier League</div>
                            <div class="match-venue">Old Trafford</div>
                        </div>
                        <div class="team away">
                            <div class="team-badge">🔴</div>
                            <div class="team-name">Liverpool</div>
                        </div>
                    </div>
                    
                    <div class="match-stats-comparison">
                        <div class="stats-section">
                            <h4>Head-to-Head Comparison</h4>
                            <div class="chart-container" id="head-to-head-chart"></div>
                        </div>
                        
                        <div class="form-comparison">
                            <div class="team-form home-form">
                                <h5>Manchester United Form</h5>
                                <div class="chart-container" id="home-form-chart"></div>
                            </div>
                            
                            <div class="team-form away-form">
                                <h5>Liverpool Form</h5>
                                <div class="chart-container" id="away-form-chart"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="match-predictions">
                        <div class="prediction-item">
                            <span class="prediction-label">Win Probability</span>
                            <div class="chart-container mini" id="win-probability-chart"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    
    // Initialize enhanced visualizations
    initializeEnhancedCharts() {
        // Performance Dashboard Charts
        this.initializePerformanceCharts();
        
        // Financial Overview Charts
        this.initializeFinancialCharts();
        
        // Player Attribute Charts
        this.initializePlayerAttributeCharts();
        
        // Tactical Charts
        this.initializeTacticalCharts();
        
        // Match Preview Charts
        this.initializeMatchPreviewCharts();
    },
    
    initializePerformanceCharts() {
        // KPI Mini Charts
        this.createMiniBarChart('goals-trend-mini', [2, 3, 1, 4, 3, 4], '#ff6b35');
        this.createMiniBarChart('rating-trend-mini', [6.8, 7.1, 6.9, 7.3, 7.2, 7.4], '#0094cc');
        this.createMiniBarChart('assists-trend-mini', [1, 0, 1, 1, 0, 2], '#00ff88');
        this.createMiniBarChart('minutes-trend-mini', [90, 78, 90, 85, 90, 90], '#ffb800');
        
        // Main Performance Charts
        setTimeout(() => {
            if (document.getElementById('performance-breakdown-chart')) {
                new window.PizzaChart({
                    container: document.getElementById('performance-breakdown-chart'),
                    data: [
                        { label: 'Attack', value: 85, color: '#ff6b35' },
                        { label: 'Creativity', value: 78, color: '#00d4aa' },
                        { label: 'Work Rate', value: 92, color: '#0094cc' },
                        { label: 'Discipline', value: 88, color: '#8066ff' },
                        { label: 'Consistency', value: 76, color: '#ffa726' }
                    ],
                    type: 'doughnut',
                    size: 140,
                    showLegend: true,
                    animate: true
                });
            }
            
            if (document.getElementById('recent-form-chart')) {
                new window.BarChart({
                    container: document.getElementById('recent-form-chart'),
                    data: [
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'L', value: 0, color: '#ff4757' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'D', value: 1, color: '#ffa726' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'W', value: 3, color: '#00ff88' }
                    ],
                    orientation: 'vertical',
                    showValues: false,
                    animate: true,
                    width: 200,
                    height: 100
                });
            }
            
            if (document.getElementById('squad-comparison-chart')) {
                new window.BarChart({
                    container: document.getElementById('squad-comparison-chart'),
                    data: [
                        { label: 'Rashford', value: 17, color: '#ff6b35' },
                        { label: 'Fernandes', value: 8, color: '#00d4aa' },
                        { label: 'Højlund', value: 6, color: '#0094cc' },
                        { label: 'Garnacho', value: 4, color: '#8066ff' }
                    ],
                    orientation: 'horizontal',
                    showValues: true,
                    animate: true,
                    width: 250,
                    height: 120
                });
            }
            
            if (document.getElementById('monthly-progress-chart')) {
                new window.BarChart({
                    container: document.getElementById('monthly-progress-chart'),
                    data: [
                        { label: 'Aug', value: 4, color: '#ff6b35' },
                        { label: 'Sep', value: 6, color: '#ff6b35' },
                        { label: 'Oct', value: 3, color: '#ff6b35' },
                        { label: 'Nov', value: 5, color: '#ff6b35' },
                        { label: 'Dec', value: 7, color: '#ff6b35' },
                        { label: 'Jan', value: 4, color: '#ff6b35' }
                    ],
                    orientation: 'vertical',
                    showValues: true,
                    animate: true,
                    width: 250,
                    height: 120
                });
            }
        }, 100);
    },
    
    initializeFinancialCharts() {
        setTimeout(() => {
            // Revenue Sources Chart
            if (document.getElementById('revenue-sources-chart')) {
                new window.PizzaChart({
                    container: document.getElementById('revenue-sources-chart'),
                    data: [
                        { label: 'TV Rights', value: 142, color: '#ff6b35' },
                        { label: 'Commercial', value: 97, color: '#00ff88' },
                        { label: 'Matchday', value: 85, color: '#0094cc' },
                        { label: 'Player Sales', value: 45, color: '#ffb800' },
                        { label: 'UEFA Prize Money', value: 28, color: '#ff4757' }
                    ],
                    type: 'doughnut',
                    size: 180,
                    showLegend: true,
                    showValues: true,
                    showPercentages: true,
                    animate: true
                });
            }
            
            // Financial Trend Chart
            if (document.getElementById('financial-trend-chart')) {
                new window.BarChart({
                    container: document.getElementById('financial-trend-chart'),
                    data: [
                        { label: 'Jul', value: 25, category: 'Revenue', color: '#00ff88' },
                        { label: 'Aug', value: 45, category: 'Revenue', color: '#00ff88' },
                        { label: 'Sep', value: 38, category: 'Revenue', color: '#00ff88' },
                        { label: 'Oct', value: 52, category: 'Revenue', color: '#00ff88' },
                        { label: 'Nov', value: 41, category: 'Revenue', color: '#00ff88' },
                        { label: 'Dec', value: 67, category: 'Revenue', color: '#00ff88' },
                        { label: 'Jul', value: 32, category: 'Expenses', color: '#ff4757' },
                        { label: 'Aug', value: 28, category: 'Expenses', color: '#ff4757' },
                        { label: 'Sep', value: 35, category: 'Expenses', color: '#ff4757' },
                        { label: 'Oct', value: 31, category: 'Expenses', color: '#ff4757' },
                        { label: 'Nov', value: 29, category: 'Expenses', color: '#ff4757' },
                        { label: 'Dec', value: 38, category: 'Expenses', color: '#ff4757' }
                    ],
                    orientation: 'vertical',
                    type: 'grouped',
                    showValues: true,
                    animate: true,
                    width: 300,
                    height: 160
                });
            }
            
            // Expense Breakdown Chart
            if (document.getElementById('expense-breakdown-chart')) {
                new window.BarChart({
                    container: document.getElementById('expense-breakdown-chart'),
                    data: [
                        { label: 'Player Wages', value: 165, color: '#ff6b35' },
                        { label: 'Staff Salaries', value: 28, color: '#0094cc' },
                        { label: 'Facilities', value: 22, color: '#00ff88' },
                        { label: 'Youth Development', value: 15, color: '#ffb800' },
                        { label: 'Marketing', value: 12, color: '#ff4757' },
                        { label: 'Operations', value: 8, color: '#8066ff' }
                    ],
                    orientation: 'horizontal',
                    showValues: true,
                    animate: true,
                    width: 280,
                    height: 160
                });
            }
            
            // Budget vs Actual Chart
            if (document.getElementById('budget-actual-chart')) {
                new window.BarChart({
                    container: document.getElementById('budget-actual-chart'),
                    data: [
                        { label: 'Q1', value: 78, category: 'Budgeted', color: '#0094cc' },
                        { label: 'Q2', value: 85, category: 'Budgeted', color: '#0094cc' },
                        { label: 'Q3', value: 92, category: 'Budgeted', color: '#0094cc' },
                        { label: 'Q4', value: 88, category: 'Budgeted', color: '#0094cc' },
                        { label: 'Q1', value: 82, category: 'Actual', color: '#ff6b35' },
                        { label: 'Q2', value: 79, category: 'Actual', color: '#ff6b35' },
                        { label: 'Q3', value: 95, category: 'Actual', color: '#ff6b35' },
                        { label: 'Q4', value: 86, category: 'Actual', color: '#ff6b35' }
                    ],
                    orientation: 'vertical',
                    type: 'grouped',
                    showValues: true,
                    animate: true,
                    width: 280,
                    height: 160
                });
            }
            
            // FFP Compliance Chart
            if (document.getElementById('ffp-compliance-chart')) {
                new window.PizzaChart({
                    container: document.getElementById('ffp-compliance-chart'),
                    data: [
                        { label: 'Compliant', value: 78, color: '#00ff88' },
                        { label: 'At Risk', value: 22, color: '#ff4757' }
                    ],
                    type: 'doughnut',
                    size: 120,
                    showLegend: true,
                    showPercentages: true,
                    animate: true
                });
            }
        }, 200);
    },
    
    initializePlayerAttributeCharts() {
        setTimeout(() => {
            // Bruno Fernandes Attributes
            if (document.getElementById('bruno-attributes')) {
                window.AttributeCircle.createMultiple(
                    document.getElementById('bruno-attributes'),
                    [
                        { label: 'Passing', value: 18 },
                        { label: 'Vision', value: 17 },
                        { label: 'Technique', value: 16 },
                        { label: 'Free Kicks', value: 17 }
                    ],
                    { size: 30, animate: true }
                );
            }
            
            // Marcus Rashford Attributes
            if (document.getElementById('rashford-attributes')) {
                window.AttributeCircle.createMultiple(
                    document.getElementById('rashford-attributes'),
                    [
                        { label: 'Pace', value: 18 },
                        { label: 'Finishing', value: 16 },
                        { label: 'Dribbling', value: 15 },
                        { label: 'Flair', value: 17 }
                    ],
                    { size: 30, animate: true }
                );
            }
            
            // Casemiro Attributes
            if (document.getElementById('casemiro-attributes')) {
                window.AttributeCircle.createMultiple(
                    document.getElementById('casemiro-attributes'),
                    [
                        { label: 'Tackling', value: 18 },
                        { label: 'Positioning', value: 17 },
                        { label: 'Passing', value: 15 },
                        { label: 'Heading', value: 16 }
                    ],
                    { size: 30, animate: true }
                );
            }
            
            // Rasmus Højlund Attributes
            if (document.getElementById('hojlund-attributes')) {
                window.AttributeCircle.createMultiple(
                    document.getElementById('hojlund-attributes'),
                    [
                        { label: 'Finishing', value: 15 },
                        { label: 'Pace', value: 16 },
                        { label: 'Strength', value: 17 },
                        { label: 'Potential', value: 18 }
                    ],
                    { size: 30, animate: true }
                );
            }
            
            // Position Strength Chart
            if (document.getElementById('position-strength-chart')) {
                new window.BarChart({
                    container: document.getElementById('position-strength-chart'),
                    data: [
                        { label: 'GK', value: 88, color: '#0094cc' },
                        { label: 'Defence', value: 82, color: '#ff6b35' },
                        { label: 'Midfield', value: 85, color: '#00ff88' },
                        { label: 'Attack', value: 79, color: '#ffb800' }
                    ],
                    orientation: 'vertical',
                    showValues: true,
                    animate: true,
                    width: 200,
                    height: 120
                });
            }
            
            // Age Distribution Chart
            if (document.getElementById('age-distribution-chart')) {
                new window.BarChart({
                    container: document.getElementById('age-distribution-chart'),
                    data: [
                        { label: '18-21', value: 4, color: '#00ff88' },
                        { label: '22-25', value: 8, color: '#0094cc' },
                        { label: '26-29', value: 10, color: '#ff6b35' },
                        { label: '30+', value: 3, color: '#ffb800' }
                    ],
                    orientation: 'vertical',
                    showValues: true,
                    animate: true,
                    width: 200,
                    height: 120
                });
            }
        }, 300);
    },
    
    initializeTacticalCharts() {
        setTimeout(() => {
            // Formation Position Ratings
            const positions = [
                { id: 'gk-rating', value: 16 },
                { id: 'rb-rating', value: 14 },
                { id: 'cb1-rating', value: 17 },
                { id: 'cb2-rating', value: 16 },
                { id: 'lb-rating', value: 15 },
                { id: 'dm1-rating', value: 17 },
                { id: 'dm2-rating', value: 14 },
                { id: 'rw-rating', value: 15 },
                { id: 'am-rating', value: 18 },
                { id: 'lw-rating', value: 16 },
                { id: 'st-rating', value: 14 }
            ];
            
            positions.forEach(pos => {
                const container = document.getElementById(pos.id);
                if (container) {
                    new window.AttributeCircle({
                        container: container,
                        value: pos.value,
                        size: 25,
                        colorMode: 'performance',
                        showLabel: false,
                        showValue: true,
                        animate: true
                    });
                }
            });
            
            // Team Shape Effectiveness Chart
            if (document.getElementById('team-shape-chart')) {
                new window.PizzaChart({
                    container: document.getElementById('team-shape-chart'),
                    data: [
                        { label: 'Attacking', value: 85, color: '#ff6b35' },
                        { label: 'Defending', value: 82, color: '#0094cc' },
                        { label: 'Transitions', value: 78, color: '#00ff88' },
                        { label: 'Set Pieces', value: 88, color: '#ffb800' }
                    ],
                    type: 'doughnut',
                    size: 140,
                    showLegend: true,
                    animate: true
                });
            }
            
            // Tactical Success Chart
            if (document.getElementById('tactical-success-chart')) {
                new window.BarChart({
                    container: document.getElementById('tactical-success-chart'),
                    data: [
                        { label: 'High Press', value: 78, color: '#ff6b35' },
                        { label: 'Build-up Play', value: 85, color: '#0094cc' },
                        { label: 'Counter Attack', value: 82, color: '#00ff88' },
                        { label: 'Set Pieces', value: 88, color: '#ffb800' }
                    ],
                    orientation: 'horizontal',
                    showValues: true,
                    animate: true,
                    width: 250,
                    height: 120
                });
            }
        }, 400);
    },
    
    initializeMatchPreviewCharts() {
        setTimeout(() => {
            // Head-to-Head Comparison Chart
            if (document.getElementById('head-to-head-chart')) {
                new window.BarChart({
                    container: document.getElementById('head-to-head-chart'),
                    data: [
                        { label: 'Goals For', value: 12, category: 'Man United', color: '#ff6b35' },
                        { label: 'Goals Against', value: 7, category: 'Man United', color: '#ff6b35' },
                        { label: 'Possession', value: 58, category: 'Man United', color: '#ff6b35' },
                        { label: 'Goals For', value: 15, category: 'Liverpool', color: '#ff4757' },
                        { label: 'Goals Against', value: 9, category: 'Liverpool', color: '#ff4757' },
                        { label: 'Possession', value: 62, category: 'Liverpool', color: '#ff4757' }
                    ],
                    orientation: 'vertical',
                    type: 'grouped',
                    showValues: true,
                    animate: true,
                    width: 300,
                    height: 140
                });
            }
            
            // Home Form Chart
            if (document.getElementById('home-form-chart')) {
                new window.BarChart({
                    container: document.getElementById('home-form-chart'),
                    data: [
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'D', value: 1, color: '#ffa726' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'L', value: 0, color: '#ff4757' }
                    ],
                    orientation: 'vertical',
                    showValues: false,
                    animate: true,
                    width: 150,
                    height: 80
                });
            }
            
            // Away Form Chart
            if (document.getElementById('away-form-chart')) {
                new window.BarChart({
                    container: document.getElementById('away-form-chart'),
                    data: [
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'W', value: 3, color: '#00ff88' },
                        { label: 'D', value: 1, color: '#ffa726' },
                        { label: 'W', value: 3, color: '#00ff88' }
                    ],
                    orientation: 'vertical',
                    showValues: false,
                    animate: true,
                    width: 150,
                    height: 80
                });
            }
            
            // Win Probability Chart
            if (document.getElementById('win-probability-chart')) {
                new window.PizzaChart({
                    container: document.getElementById('win-probability-chart'),
                    data: [
                        { label: 'Man United Win', value: 42, color: '#ff6b35' },
                        { label: 'Draw', value: 28, color: '#ffa726' },
                        { label: 'Liverpool Win', value: 30, color: '#ff4757' }
                    ],
                    type: 'doughnut',
                    size: 100,
                    showLegend: true,
                    showPercentages: true,
                    animate: true
                });
            }
        }, 500);
    },
    
    // Helper method to create mini bar charts for KPIs
    createMiniBarChart(containerId, data, color) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const maxValue = Math.max(...data);
        const barData = data.map((value, index) => ({
            label: `${index + 1}`,
            value: value,
            color: color
        }));
        
        new window.BarChart({
            container: container,
            data: barData,
            orientation: 'vertical',
            showValues: false,
            showAxis: false,
            animate: true,
            width: 120,
            height: 30,
            margin: { top: 2, right: 2, bottom: 2, left: 2 }
        });
    },
    
    // Replace existing card content with enhanced versions
    replaceCardContent() {
        // Find and replace performance dashboard cards
        const performanceCards = document.querySelectorAll('[data-card-type="performance"], .performance-dashboard-card');
        performanceCards.forEach(card => {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.enhancedCardGenerators.generatePerformanceDashboard();
            }
        });
        
        // Find and replace financial overview cards
        const financialCards = document.querySelectorAll('[data-card-type="financial"], .financial-overview-card');
        financialCards.forEach(card => {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.enhancedCardGenerators.generateFinancialOverview();
            }
        });
        
        // Find and replace squad summary cards
        const squadCards = document.querySelectorAll('[data-card-type="squad"], .squad-summary-card');
        squadCards.forEach(card => {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.enhancedCardGenerators.generateSquadSummary();
            }
        });
        
        // Find and replace tactical overview cards
        const tacticalCards = document.querySelectorAll('[data-card-type="tactical"], .tactical-overview-card');
        tacticalCards.forEach(card => {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.enhancedCardGenerators.generateTacticalOverview();
            }
        });
        
        // Find and replace match preview cards
        const matchCards = document.querySelectorAll('[data-card-type="match"], .match-preview-card');
        matchCards.forEach(card => {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.enhancedCardGenerators.generateMatchPreview();
            }
        });
    },
    
    // Initialize all enhancements
    initialize() {
        console.log('🎯 Initializing Chart Card Enhancements...');
        
        // Wait for chart components to be available
        setTimeout(() => {
            this.replaceCardContent();
            this.initializeEnhancedCharts();
            console.log('✅ Chart Card Enhancements initialized');
        }, 1500);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.ChartCardEnhancements.initialize();
    }, 2000);
});

// Also initialize if already loaded
if (document.readyState === 'complete') {
    setTimeout(() => {
        window.ChartCardEnhancements.initialize();
    }, 2000);
}

console.log('📊 Chart Card Enhancements loaded and ready');