/* ==========================================
   CARD ENHANCER - Works WITH existing navigation
   ========================================== */

window.CardEnhancer = {
    // This enhances existing cards instead of replacing them
    currentTab: 'overview',
    
    init() {
        // Hook into the existing switchTab function
        const originalSwitchTab = window.switchTab;
        window.switchTab = (tab, element) => {
            // Call original function first
            if (originalSwitchTab) {
                originalSwitchTab(tab, element);
            }
            // Then enhance the cards for that tab
            this.enhanceCardsForTab(tab);
        };
        
        // Enhance initial cards
        this.enhanceCardsForTab('overview');
    },
    
    enhanceCardsForTab(tab) {
        this.currentTab = tab;
        
        // Wait for DOM to update
        setTimeout(() => {
            switch(tab) {
                case 'overview':
                    this.enhanceOverviewCards();
                    break;
                case 'squad':
                    this.enhanceSquadCards();
                    break;
                case 'tactics':
                    this.enhanceTacticsCards();
                    break;
                case 'training':
                    this.enhanceTrainingCards();
                    break;
                case 'transfers':
                    this.enhanceTransferCards();
                    break;
                case 'finances':
                    this.enhanceFinanceCards();
                    break;
                case 'fixtures':
                    this.enhanceFixtureCards();
                    break;
            }
        }, 10);
    },
    
    enhanceOverviewCards() {
        // Find and enhance existing cards in overview page
        const page = document.getElementById('overview-page');
        if (!page) return;
        
        // Update Match Preview card with live data
        const matchCard = page.querySelector('.card-header span:contains("Match Preview")');
        if (matchCard) {
            const cardBody = matchCard.closest('.card').querySelector('.card-body');
            if (cardBody && !cardBody.dataset.enhanced) {
                cardBody.dataset.enhanced = 'true';
                // Add dynamic content while preserving structure
                const existingContent = cardBody.innerHTML;
                cardBody.innerHTML = existingContent + `
                    <div class="enhancement-note" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--neutral-400); font-size: 11px; color: #888;">
                        Last updated: ${new Date().toLocaleTimeString()}
                    </div>
                `;
            }
        }
    },
    
    enhanceSquadCards() {
        const page = document.getElementById('squad-page');
        if (!page) return;
        
        // Check if we have the Football Manager squad screen available
        if (window.SquadScreen) {
            // Find the main card container
            const container = page.querySelector('.tile-container');
            if (container && !container.dataset.enhanced) {
                container.dataset.enhanced = 'true';
                
                // Add a new detailed squad card
                const detailedCard = document.createElement('div');
                detailedCard.className = 'card wide tall';
                detailedCard.draggable = true;
                detailedCard.innerHTML = `
                    <div class="card-header">
                        <span>Squad Analysis</span>
                        <button class="expand-btn" onclick="expandCard(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <circle cx="12" cy="12" r="6"/>
                                <circle cx="12" cy="12" r="2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="squad-stats">
                            <div class="stat-row"><span class="stat-label">Average Age</span><span class="stat-value">26.4</span></div>
                            <div class="stat-row"><span class="stat-label">Foreign Players</span><span class="stat-value">14/17</span></div>
                            <div class="stat-row"><span class="stat-label">Total Value</span><span class="stat-value">€678M</span></div>
                            <div class="stat-row"><span class="stat-label">Wage Budget Used</span><span class="stat-value">82%</span></div>
                            <div class="stat-row"><span class="stat-label">Morale</span><span class="stat-value" style="color: #4ade80;">Superb</span></div>
                        </div>
                    </div>
                    <div class="resize-handle"></div>
                `;
                container.appendChild(detailedCard);
            }
        }
    },
    
    enhanceTacticsCards() {
        const page = document.getElementById('tactics-page');
        if (!page) return;
        
        const container = page.querySelector('.tile-container');
        if (container && !container.dataset.enhanced) {
            container.dataset.enhanced = 'true';
            
            // Add tactical analysis card
            const tacticsCard = document.createElement('div');
            tacticsCard.className = 'card';
            tacticsCard.draggable = true;
            tacticsCard.innerHTML = `
                <div class="card-header">
                    <span>Recent Tactical Performance</span>
                </div>
                <div class="card-body">
                    <div class="stat-row"><span class="stat-label">Possession Avg</span><span class="stat-value">58%</span></div>
                    <div class="stat-row"><span class="stat-label">Pass Completion</span><span class="stat-value">86%</span></div>
                    <div class="stat-row"><span class="stat-label">Pressing Success</span><span class="stat-value">72%</span></div>
                    <div class="stat-row"><span class="stat-label">xG per Match</span><span class="stat-value">2.14</span></div>
                </div>
                <div class="resize-handle"></div>
            `;
            container.appendChild(tacticsCard);
        }
    },
    
    enhanceTrainingCards() {
        const page = document.getElementById('training-page');
        if (!page) return;
        
        const container = page.querySelector('.tile-container');
        if (container) {
            // Clear placeholder and add real training cards
            if (!container.dataset.enhanced) {
                container.dataset.enhanced = 'true';
                container.innerHTML = `
                    <div class="card wide" draggable="true">
                        <div class="card-header">
                            <span>This Week's Schedule</span>
                            <button class="expand-btn" onclick="expandCard(this)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <circle cx="12" cy="12" r="6"/>
                                    <circle cx="12" cy="12" r="2"/>
                                </svg>
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="training-schedule">
                                <div class="stat-row"><span class="stat-label">Monday</span><span class="stat-value">General - Medium</span></div>
                                <div class="stat-row"><span class="stat-label">Tuesday</span><span class="stat-value">Match Prep - High</span></div>
                                <div class="stat-row"><span class="stat-label">Wednesday</span><span class="stat-value">Recovery - Low</span></div>
                                <div class="stat-row"><span class="stat-label">Thursday</span><span class="stat-value">Tactical - Medium</span></div>
                                <div class="stat-row"><span class="stat-label">Friday</span><span class="stat-value">Set Pieces - Light</span></div>
                                <div class="stat-row"><span class="stat-label">Saturday</span><span class="stat-value" style="color: var(--primary-400);">Match Day</span></div>
                                <div class="stat-row"><span class="stat-label">Sunday</span><span class="stat-value" style="color: #888;">Rest</span></div>
                            </div>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                    
                    <div class="card" draggable="true">
                        <div class="card-header">
                            <span>Injury Report</span>
                        </div>
                        <div class="card-body">
                            <div class="injury-list">
                                <div class="stat-row"><span class="stat-label">L. Shaw</span><span class="stat-value" style="color: #ef4444;">2 weeks</span></div>
                                <div class="stat-row"><span class="stat-label">A. Martial</span><span class="stat-value" style="color: #facc15;">3 days</span></div>
                                <div class="stat-row"><span class="stat-label">R. Varane</span><span class="stat-value" style="color: #4ade80;">Available</span></div>
                            </div>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                    
                    <div class="card" draggable="true">
                        <div class="card-header">
                            <span>Training Focus</span>
                        </div>
                        <div class="card-body">
                            <div class="stat-row"><span class="stat-label">Team Cohesion</span><span class="stat-value">75%</span></div>
                            <div class="stat-row"><span class="stat-label">Fitness Level</span><span class="stat-value">82%</span></div>
                            <div class="stat-row"><span class="stat-label">Tactical Familiarity</span><span class="stat-value">68%</span></div>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
            }
        }
    },
    
    enhanceTransferCards() {
        const page = document.getElementById('transfers-page');
        if (!page) return;
        
        const container = page.querySelector('.tile-container');
        if (container && !container.dataset.enhanced) {
            container.dataset.enhanced = 'true';
            container.innerHTML = `
                <div class="card wide" draggable="true">
                    <div class="card-header">
                        <span>Transfer Targets</span>
                        <button class="expand-btn" onclick="expandCard(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <circle cx="12" cy="12" r="6"/>
                                <circle cx="12" cy="12" r="2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-body">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Club</th>
                                    <th>Position</th>
                                    <th>Value</th>
                                    <th>Interest</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>J. Bellingham</td><td>Real Madrid</td><td>CM</td><td>€120M</td><td><span class="badge badge-danger">Low</span></td></tr>
                                <tr><td>F. Wirtz</td><td>Leverkusen</td><td>AM</td><td>€95M</td><td><span class="badge badge-warning">Medium</span></td></tr>
                                <tr><td>J. Frimpong</td><td>Leverkusen</td><td>RB</td><td>€40M</td><td><span class="badge badge-success">High</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="resize-handle"></div>
                </div>
                
                <div class="card" draggable="true">
                    <div class="card-header">
                        <span>Budget Status</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-row"><span class="stat-label">Transfer Budget</span><span class="stat-value">€150M</span></div>
                        <div class="stat-row"><span class="stat-label">Spent</span><span class="stat-value" style="color: #ef4444;">€62.5M</span></div>
                        <div class="stat-row"><span class="stat-label">Remaining</span><span class="stat-value" style="color: #4ade80;">€87.5M</span></div>
                        <div class="stat-row"><span class="stat-label">Wage Budget</span><span class="stat-value">€350k/w</span></div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
        }
    },
    
    enhanceFinanceCards() {
        const page = document.getElementById('finances-page');
        if (!page) return;
        
        const container = page.querySelector('.tile-container');
        if (container && !container.dataset.enhanced) {
            container.dataset.enhanced = 'true';
            container.innerHTML = `
                <div class="card wide" draggable="true">
                    <div class="card-header">
                        <span>Financial Overview</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-row"><span class="stat-label">Revenue YTD</span><span class="stat-value" style="color: #4ade80;">€324M</span></div>
                        <div class="stat-row"><span class="stat-label">Expenses YTD</span><span class="stat-value" style="color: #ef4444;">€282M</span></div>
                        <div class="stat-row"><span class="stat-label">Profit/Loss</span><span class="stat-value" style="color: #4ade80;">+€42M</span></div>
                        <div class="stat-row"><span class="stat-label">Cash Balance</span><span class="stat-value">€185M</span></div>
                        <div class="stat-row"><span class="stat-label">FFP Status</span><span class="stat-value" style="color: #4ade80;">Compliant</span></div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
                
                <div class="card" draggable="true">
                    <div class="card-header">
                        <span>Sponsorship Deals</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-row"><span class="stat-label">Shirt Sponsor</span><span class="stat-value">€75M/year</span></div>
                        <div class="stat-row"><span class="stat-label">Stadium Rights</span><span class="stat-value">€50M/year</span></div>
                        <div class="stat-row"><span class="stat-label">Kit Manufacturer</span><span class="stat-value">€100M/year</span></div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
        }
    },
    
    enhanceFixtureCards() {
        const page = document.getElementById('fixtures-page');
        if (!page) return;
        
        const container = page.querySelector('.tile-container');
        if (container && !container.dataset.enhanced) {
            container.dataset.enhanced = 'true';
            container.innerHTML = `
                <div class="card wide tall" draggable="true">
                    <div class="card-header">
                        <span>Upcoming Fixtures</span>
                        <button class="expand-btn" onclick="expandCard(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <circle cx="12" cy="12" r="6"/>
                                <circle cx="12" cy="12" r="2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-body">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Competition</th>
                                    <th>Opponent</th>
                                    <th>Venue</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Oct 21</td><td>Premier League</td><td>Liverpool</td><td>Home</td></tr>
                                <tr><td>Oct 24</td><td>Carabao Cup</td><td>West Ham</td><td>Away</td></tr>
                                <tr><td>Oct 28</td><td>Premier League</td><td>Chelsea</td><td>Away</td></tr>
                                <tr><td>Nov 1</td><td>Champions League</td><td>Bayern Munich</td><td>Home</td></tr>
                                <tr><td>Nov 4</td><td>Premier League</td><td>Arsenal</td><td>Home</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="resize-handle"></div>
                </div>
                
                <div class="card" draggable="true">
                    <div class="card-header">
                        <span>Recent Results</span>
                    </div>
                    <div class="card-body">
                        <div class="stat-row"><span class="stat-label">vs Tottenham</span><span class="stat-value" style="color: #4ade80;">W 2-1</span></div>
                        <div class="stat-row"><span class="stat-label">vs Barcelona</span><span class="stat-value" style="color: #facc15;">D 1-1</span></div>
                        <div class="stat-row"><span class="stat-label">vs Newcastle</span><span class="stat-value" style="color: #4ade80;">W 3-0</span></div>
                        <div class="stat-row"><span class="stat-label">vs Man City</span><span class="stat-value" style="color: #ef4444;">L 0-2</span></div>
                    </div>
                    <div class="resize-handle"></div>
                </div>
            `;
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all other scripts are loaded
    setTimeout(() => {
        CardEnhancer.init();
    }, 200);
});