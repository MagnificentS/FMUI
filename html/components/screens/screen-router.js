/* ==========================================
   SCREEN ROUTER - Navigation & Integration
   ========================================== */

window.ScreenRouter = {
    currentScreen: 'home',
    screens: {
        home: { title: 'Home', icon: '🏠', component: 'HomeScreen' },
        squad: { title: 'Squad', icon: '👥', component: 'SquadScreen' },
        tactics: { title: 'Tactics', icon: '📋', component: 'TacticsScreen' },
        training: { title: 'Training', icon: '🏃', component: 'TrainingScreen' },
        scouting: { title: 'Scouting', icon: '🔍', component: 'ScoutingScreen' },
        transfers: { title: 'Transfers', icon: '💰', component: 'TransfersScreen' },
        club: { title: 'Club', icon: '🏛️', component: 'ClubScreen' },
        competitions: { title: 'Competitions', icon: '🏆', component: 'CompetitionsScreen' },
        inbox: { title: 'Inbox', icon: '📧', component: 'InboxScreen' }
    },

    init() {
        // Load all screen components
        this.loadScreenScripts();
        
        // Set up navigation click handlers
        this.setupNavigation();
        
        // Load initial screen
        this.loadScreen('home');
    },

    /**
     * Register a screen component
     * @param {string} routeName - The route name for the screen
     * @param {object} screenComponent - The screen component
     */
    register(routeName, screenComponent) {
        if (!this.screens[routeName]) {
            this.screens[routeName] = {
                title: routeName.charAt(0).toUpperCase() + routeName.slice(1),
                icon: '📄',
                component: screenComponent
            };
        }
        console.log(`Registered screen: ${routeName}`);
    },

    loadScreenScripts() {
        const scripts = [
            'components/screens/squad-screen.js',
            'components/screens/tactics-screen.js',
            'components/screens/training-screen.js'
        ];
        
        scripts.forEach(src => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement('script');
                script.src = src;
                document.body.appendChild(script);
            }
        });
    },

    setupNavigation() {
        // Hook into existing navigation menu items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screenName = this.getScreenFromNavItem(item.textContent.trim());
                if (screenName) {
                    this.loadScreen(screenName);
                }
            });
        });
    },

    getScreenFromNavItem(text) {
        const mapping = {
            'Home': 'home',
            'Squad': 'squad',
            'Tactics': 'tactics',
            'Training': 'training',
            'Scouting': 'scouting',
            'Transfers': 'transfers',
            'Club': 'club',
            'Competitions': 'competitions',
            'Inbox': 'inbox'
        };
        return mapping[text];
    },

    loadScreen(screenName) {
        const screen = this.screens[screenName];
        if (!screen) return;
        
        this.currentScreen = screenName;
        
        // Update active navigation item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (this.getScreenFromNavItem(item.textContent.trim()) === screenName) {
                item.classList.add('active');
            }
        });
        
        // Load screen content
        const mainPanel = document.querySelector('.main-panel');
        if (mainPanel) {
            const content = this.getScreenContent(screenName);
            mainPanel.innerHTML = content;
            
            // Execute any screen-specific initialization
            this.initializeScreen(screenName);
        }
    },

    getScreenContent(screenName) {
        switch(screenName) {
            case 'squad':
                return window.SquadScreen ? window.SquadScreen.renderSquadView() : this.renderLoadingScreen();
            
            case 'tactics':
                return window.TacticsScreen ? window.TacticsScreen.renderTacticsView() : this.renderLoadingScreen();
            
            case 'training':
                return window.TrainingScreen ? window.TrainingScreen.renderTrainingView() : this.renderLoadingScreen();
            
            case 'scouting':
                return this.renderScoutingScreen();
            
            case 'transfers':
                return this.renderTransfersScreen();
            
            case 'club':
                return this.renderClubScreen();
            
            case 'competitions':
                return this.renderCompetitionsScreen();
            
            case 'inbox':
                return this.renderInboxScreen();
            
            case 'home':
            default:
                return this.renderHomeScreen();
        }
    },

    initializeScreen(screenName) {
        // Screen-specific initialization
        if (screenName === 'squad' && window.SquadScreen) {
            // Squad screen is already initialized
        }
        if (screenName === 'tactics' && window.TacticsScreen) {
            // Tactics screen is already initialized
        }
        if (screenName === 'training' && window.TrainingScreen) {
            // Training screen is already initialized
        }
    },

    renderLoadingScreen() {
        return `
            <div class="loading-screen">
                <div class="loader"></div>
                <p>Loading...</p>
            </div>
        `;
    },

    renderHomeScreen() {
        // Return existing grid/cards view
        const existingContent = document.getElementById('grid-view');
        return existingContent ? existingContent.outerHTML : `
            <div class="home-screen">
                <h2>Dashboard</h2>
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Next Match</h3>
                        <p>Liverpool (H)</p>
                        <p>Saturday 3:00 PM</p>
                    </div>
                    <div class="stat-card">
                        <h3>League Position</h3>
                        <p>3rd</p>
                        <p>W5 D2 L1</p>
                    </div>
                    <div class="stat-card">
                        <h3>Recent Form</h3>
                        <p>WWDLW</p>
                    </div>
                    <div class="stat-card">
                        <h3>Injuries</h3>
                        <p>2 Players</p>
                        <p>Shaw, Martial</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderScoutingScreen() {
        return `
            <div class="scouting-screen">
                <h2>Scouting Network</h2>
                <div class="scouting-tabs">
                    <button class="active">Search Players</button>
                    <button>Shortlist</button>
                    <button>Scout Reports</button>
                    <button>Assignments</button>
                </div>
                <div class="player-search">
                    <div class="search-filters">
                        <input type="text" placeholder="Player Name...">
                        <select><option>All Positions</option></select>
                        <select><option>All Ages</option></select>
                        <select><option>All Nationalities</option></select>
                        <input type="range" placeholder="Max Value">
                        <button class="search-btn">Search</button>
                    </div>
                    <div class="search-results">
                        <table class="scouting-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Position</th>
                                    <th>Club</th>
                                    <th>Value</th>
                                    <th>Ability</th>
                                    <th>Potential</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Jude Bellingham</td>
                                    <td>20</td>
                                    <td>CM</td>
                                    <td>Real Madrid</td>
                                    <td>£120M</td>
                                    <td>⭐⭐⭐⭐⭐</td>
                                    <td>⭐⭐⭐⭐⭐</td>
                                    <td><button>Scout</button></td>
                                </tr>
                                <tr>
                                    <td>Eduardo Camavinga</td>
                                    <td>21</td>
                                    <td>DM/CM</td>
                                    <td>Real Madrid</td>
                                    <td>£85M</td>
                                    <td>⭐⭐⭐⭐</td>
                                    <td>⭐⭐⭐⭐⭐</td>
                                    <td><button>Scout</button></td>
                                </tr>
                                <tr>
                                    <td>Florian Wirtz</td>
                                    <td>20</td>
                                    <td>AM</td>
                                    <td>Bayer Leverkusen</td>
                                    <td>£95M</td>
                                    <td>⭐⭐⭐⭐</td>
                                    <td>⭐⭐⭐⭐⭐</td>
                                    <td><button>Scout</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderTransfersScreen() {
        return `
            <div class="transfers-screen">
                <h2>Transfer Centre</h2>
                <div class="transfer-budget">
                    <div class="budget-card">
                        <h3>Transfer Budget</h3>
                        <p class="budget-amount">£150,000,000</p>
                        <p class="budget-remaining">Remaining: £87,500,000</p>
                    </div>
                    <div class="budget-card">
                        <h3>Wage Budget</h3>
                        <p class="budget-amount">£350,000/week</p>
                        <p class="budget-remaining">Available: £125,000/week</p>
                    </div>
                </div>
                <div class="transfer-tabs">
                    <button class="active">Transfer Hub</button>
                    <button>Incoming</button>
                    <button>Outgoing</button>
                    <button>History</button>
                </div>
                <div class="transfer-activity">
                    <h3>Recent Activity</h3>
                    <div class="transfer-item">
                        <span class="transfer-type incoming">IN</span>
                        <span>Rasmus Højlund - Atalanta - £65M</span>
                        <span class="transfer-date">July 2024</span>
                    </div>
                    <div class="transfer-item">
                        <span class="transfer-type incoming">IN</span>
                        <span>Mason Mount - Chelsea - £55M</span>
                        <span class="transfer-date">July 2024</span>
                    </div>
                    <div class="transfer-item">
                        <span class="transfer-type outgoing">OUT</span>
                        <span>Fred - Fenerbahce - £15M</span>
                        <span class="transfer-date">August 2024</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderClubScreen() {
        return `
            <div class="club-screen">
                <h2>Club Management</h2>
                <div class="club-tabs">
                    <button class="active">Overview</button>
                    <button>Finances</button>
                    <button>Facilities</button>
                    <button>Staff</button>
                    <button>Board</button>
                </div>
                <div class="club-overview">
                    <div class="club-info">
                        <h3>Manchester United FC</h3>
                        <p>Founded: 1878</p>
                        <p>Stadium: Old Trafford (74,310)</p>
                        <p>Manager: Erik ten Hag</p>
                        <p>Chairman: Joel Glazer</p>
                    </div>
                    <div class="club-stats-grid">
                        <div class="club-stat">
                            <h4>Club Value</h4>
                            <p>£4.2 Billion</p>
                        </div>
                        <div class="club-stat">
                            <h4>Revenue</h4>
                            <p>£648M/year</p>
                        </div>
                        <div class="club-stat">
                            <h4>Wage Bill</h4>
                            <p>£384M/year</p>
                        </div>
                        <div class="club-stat">
                            <h4>Profit</h4>
                            <p>£42M</p>
                        </div>
                    </div>
                    <div class="club-objectives">
                        <h4>Season Objectives</h4>
                        <ul>
                            <li>✅ Qualify for Champions League</li>
                            <li>⏳ Reach FA Cup Semi-Final</li>
                            <li>⏳ Finish Top 3 in Premier League</li>
                            <li>❌ Win Europa League</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },

    renderCompetitionsScreen() {
        return `
            <div class="competitions-screen">
                <h2>Competitions</h2>
                <div class="competition-tabs">
                    <button class="active">Premier League</button>
                    <button>Champions League</button>
                    <button>FA Cup</button>
                    <button>Carabao Cup</button>
                </div>
                <div class="league-table">
                    <h3>Premier League Table</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Team</th>
                                <th>P</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GF</th>
                                <th>GA</th>
                                <th>GD</th>
                                <th>Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Manchester City</td>
                                <td>8</td>
                                <td>6</td>
                                <td>2</td>
                                <td>0</td>
                                <td>18</td>
                                <td>6</td>
                                <td>+12</td>
                                <td>20</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Arsenal</td>
                                <td>8</td>
                                <td>6</td>
                                <td>1</td>
                                <td>1</td>
                                <td>17</td>
                                <td>8</td>
                                <td>+9</td>
                                <td>19</td>
                            </tr>
                            <tr class="highlighted">
                                <td>3</td>
                                <td>Manchester United</td>
                                <td>8</td>
                                <td>5</td>
                                <td>2</td>
                                <td>1</td>
                                <td>15</td>
                                <td>9</td>
                                <td>+6</td>
                                <td>17</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Liverpool</td>
                                <td>8</td>
                                <td>5</td>
                                <td>1</td>
                                <td>2</td>
                                <td>16</td>
                                <td>10</td>
                                <td>+6</td>
                                <td>16</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="fixtures">
                    <h3>Upcoming Fixtures</h3>
                    <div class="fixture">
                        <span>Liverpool (H)</span>
                        <span>Premier League</span>
                        <span>Oct 21, 3:00 PM</span>
                    </div>
                    <div class="fixture">
                        <span>West Ham (A)</span>
                        <span>Carabao Cup</span>
                        <span>Oct 24, 8:00 PM</span>
                    </div>
                    <div class="fixture">
                        <span>Chelsea (A)</span>
                        <span>Premier League</span>
                        <span>Oct 28, 5:30 PM</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderInboxScreen() {
        return `
            <div class="inbox-screen">
                <h2>Inbox</h2>
                <div class="inbox-categories">
                    <button class="active">All (12)</button>
                    <button>Board (3)</button>
                    <button>Staff (4)</button>
                    <button>Players (2)</button>
                    <button>Media (3)</button>
                </div>
                <div class="inbox-messages">
                    <div class="message unread">
                        <span class="sender">Board</span>
                        <span class="subject">Monthly Performance Review</span>
                        <span class="preview">The board is pleased with recent results...</span>
                        <span class="date">Today</span>
                    </div>
                    <div class="message unread">
                        <span class="sender">Bruno Fernandes</span>
                        <span class="subject">Team Morale</span>
                        <span class="preview">Boss, the lads are feeling confident...</span>
                        <span class="date">Today</span>
                    </div>
                    <div class="message">
                        <span class="sender">Steve McClaren</span>
                        <span class="subject">Training Report</span>
                        <span class="preview">This week's training went very well...</span>
                        <span class="date">Yesterday</span>
                    </div>
                    <div class="message">
                        <span class="sender">Media</span>
                        <span class="subject">Press Conference Request</span>
                        <span class="preview">Sky Sports would like to schedule...</span>
                        <span class="date">2 days ago</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// Add screen router styles
const routerStyles = `
<style>
.loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.loader {
    width: 50px;
    height: 50px;
    border: 5px solid var(--neutral-400);
    border-top: 5px solid var(--primary-400);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Generic screen styles */
.home-screen,
.scouting-screen,
.transfers-screen,
.club-screen,
.competitions-screen,
.inbox-screen {
    padding: 20px;
    height: 100%;
    overflow-y: auto;
}

.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.stat-card {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

.stat-card h3 {
    color: var(--primary-400);
    margin-bottom: 10px;
    font-size: 14px;
}

.stat-card p {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

/* Scouting styles */
.scouting-tabs,
.transfer-tabs,
.club-tabs,
.competition-tabs {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.scouting-tabs button,
.transfer-tabs button,
.club-tabs button,
.competition-tabs button {
    padding: 8px 16px;
    background: var(--neutral-300);
    border: 1px solid var(--neutral-400);
    color: #aaa;
    cursor: pointer;
}

.scouting-tabs button.active,
.transfer-tabs button.active,
.club-tabs button.active,
.competition-tabs button.active {
    background: var(--primary-300);
    color: white;
}

.search-filters {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.search-filters input,
.search-filters select {
    padding: 8px;
    background: var(--neutral-300);
    border: 1px solid var(--neutral-400);
    color: white;
}

.search-btn {
    padding: 8px 20px;
    background: var(--primary-300);
    border: none;
    color: white;
    cursor: pointer;
}

.scouting-table {
    width: 100%;
    background: var(--neutral-300);
    border-collapse: collapse;
}

.scouting-table th {
    background: var(--neutral-400);
    padding: 10px;
    text-align: left;
    font-size: 12px;
    color: #aaa;
}

.scouting-table td {
    padding: 10px;
    border-bottom: 1px solid var(--neutral-400);
}

.scouting-table button {
    padding: 4px 12px;
    background: var(--primary-300);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 3px;
}

/* Transfer styles */
.transfer-budget {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.budget-card {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.budget-amount {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-400);
    margin: 10px 0;
}

.budget-remaining {
    color: #aaa;
}

.transfer-activity {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.transfer-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border-bottom: 1px solid var(--neutral-400);
}

.transfer-type {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: bold;
}

.transfer-type.incoming {
    background: #4ade80;
    color: black;
}

.transfer-type.outgoing {
    background: #ef4444;
    color: white;
}

.transfer-date {
    margin-left: auto;
    color: #888;
    font-size: 12px;
}

/* Club styles */
.club-info {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.club-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.club-stat {
    background: var(--neutral-300);
    padding: 15px;
    border-radius: 5px;
    text-align: center;
}

.club-stat h4 {
    color: var(--primary-400);
    font-size: 12px;
    margin-bottom: 8px;
}

.club-stat p {
    font-size: 18px;
    font-weight: bold;
}

.club-objectives {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.club-objectives ul {
    list-style: none;
    padding: 0;
}

.club-objectives li {
    padding: 8px 0;
    border-bottom: 1px solid var(--neutral-400);
}

/* Competitions styles */
.league-table {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.league-table table {
    width: 100%;
    border-collapse: collapse;
}

.league-table th {
    background: var(--neutral-400);
    padding: 8px;
    text-align: left;
    font-size: 11px;
    color: #aaa;
}

.league-table td {
    padding: 8px;
    border-bottom: 1px solid var(--neutral-400);
    font-size: 13px;
}

.league-table tr.highlighted {
    background: var(--primary-200);
}

.fixtures {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.fixture {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid var(--neutral-400);
}

/* Inbox styles */
.inbox-categories {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.inbox-categories button {
    padding: 8px 16px;
    background: var(--neutral-300);
    border: 1px solid var(--neutral-400);
    color: #aaa;
    cursor: pointer;
}

.inbox-categories button.active {
    background: var(--primary-300);
    color: white;
}

.inbox-messages {
    background: var(--neutral-300);
    border-radius: 5px;
}

.message {
    display: grid;
    grid-template-columns: 100px 200px 1fr 100px;
    gap: 15px;
    padding: 15px;
    border-bottom: 1px solid var(--neutral-400);
    cursor: pointer;
}

.message:hover {
    background: var(--neutral-400);
}

.message.unread {
    background: rgba(var(--primary-hue), 50%, 50%, 0.1);
}

.message .sender {
    font-weight: bold;
    color: var(--primary-400);
}

.message .subject {
    font-weight: bold;
}

.message .preview {
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.message .date {
    text-align: right;
    color: #888;
    font-size: 12px;
}
</style>
`;

// Inject styles when module loads
if (!document.getElementById('router-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'router-styles';
    styleElement.innerHTML = routerStyles;
    document.head.appendChild(styleElement.firstElementChild);
}

// DISABLED: ScreenRouter breaks existing navigation
// The original switchTab() function in v17.html handles navigation correctly
// ScreenRouter would need major refactoring to work with existing card system
/*
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        ScreenRouter.init();
    }, 100);
});
*/