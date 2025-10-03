/**
 * CREATE ADVANCED CARDS
 * Restore the sophisticated card modules with the clean v19-old structure
 */

(function() {
    'use strict';

    console.log('🎨 CREATE ADVANCED CARDS: Building sophisticated card modules...');

    // Enhanced Performance Dashboard Card
    window.PerformanceDashboardCard = {
        id: 'performance-dashboard',
        title: 'Performance Dashboard',
        pages: ['overview'],
        currentPeriod: 'season',
        selectedMetric: 'goals',
        
        render() {
            return {
                className: 'card w11 h6',
                draggable: true,
                innerHTML: `
                    <div class="card-header">
                        <span>${this.title}</span>
                        <div class="card-menu">
                            <select class="period-selector" onchange="window.PerformanceDashboardCard.changePeriod(this.value)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px; border-radius: 3px; font-size: 10px; margin-right: 6px;">
                                <option value="month">Last Month</option>
                                <option value="season" selected>This Season</option>
                                <option value="year">Last 12 Months</option>
                                <option value="career">Career</option>
                            </select>
                            <select class="metric-selector" onchange="window.PerformanceDashboardCard.changeMetric(this.value)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px; border-radius: 3px; font-size: 10px; margin-right: 6px;">
                                <option value="goals" selected>Goals</option>
                                <option value="assists">Assists</option>
                                <option value="rating">Rating</option>
                                <option value="performance">Performance</option>
                            </select>
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                        </div>
                    </div>
                    <div class="card-body">
                        ${this.getContent()}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `
            };
        },
        
        getContent() {
            return `
                <div class="dashboard-content">
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-label">Goals</div>
                            <div class="kpi-value">17</div>
                            <div class="kpi-change">+3 vs last season</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Assists</div>
                            <div class="kpi-value">5</div>
                            <div class="kpi-change">+1 vs last season</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Avg Rating</div>
                            <div class="kpi-value">7.2</div>
                            <div class="kpi-change">+0.3 vs last season</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Minutes</div>
                            <div class="kpi-value">2890</div>
                            <div class="kpi-change">+120 vs last season</div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        changePeriod(period) {
            this.currentPeriod = period;
            console.log(`Performance period changed to: ${period}`);
            // Refresh card content based on new period
        },
        
        changeMetric(metric) {
            this.selectedMetric = metric;
            console.log(`Performance metric changed to: ${metric}`);
            // Refresh card content based on new metric
        }
    };

    // Enhanced Player Detail Card
    window.PlayerDetailCard = {
        id: 'player-detail',
        title: 'Player Profile',
        pages: ['squad'],
        selectedPlayer: null,
        
        render() {
            return {
                className: 'card w10 h8',
                draggable: true,
                innerHTML: `
                    <div class="card-header">
                        <span>${this.title}</span>
                        <div class="card-menu">
                            <select class="player-selector" onchange="window.PlayerDetailCard.selectPlayer(this.value)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px; border-radius: 3px; font-size: 10px; margin-right: 6px;">
                                <option value="">Select Player...</option>
                                <option value="1">Marcus Rashford (LW)</option>
                                <option value="2">Bruno Fernandes (AM)</option>
                                <option value="3">Lisandro Martinez (CB)</option>
                                <option value="4">Casemiro (DM)</option>
                                <option value="5">Kobbie Mainoo (CM)</option>
                            </select>
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                        </div>
                    </div>
                    <div class="card-body">
                        ${this.getContent()}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `
            };
        },
        
        getContent() {
            if (!this.selectedPlayer) {
                return `
                    <div class="empty-state">
                        <div class="empty-icon">👤</div>
                        <h3>No Player Selected</h3>
                        <p>Choose a player from the dropdown to view their detailed profile and attributes.</p>
                    </div>
                `;
            }
            
            return `
                <div class="player-profile">
                    <div class="player-stats">
                        <div class="stat-row">
                            <span class="stat-label">Position</span>
                            <span class="stat-value">Left Winger</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Age</span>
                            <span class="stat-value">26</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Value</span>
                            <span class="stat-value">£85M</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Contract</span>
                            <span class="stat-value">2028</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        selectPlayer(playerId) {
            this.selectedPlayer = playerId;
            console.log(`Player selected: ${playerId}`);
            
            // Find the card and update its content
            const cards = document.querySelectorAll('.card');
            for (let card of cards) {
                const titleSpan = card.querySelector('.card-header span');
                if (titleSpan && titleSpan.textContent === this.title) {
                    const cardBody = card.querySelector('.card-body');
                    if (cardBody) {
                        cardBody.innerHTML = this.getContent();
                    }
                    break;
                }
            }
        }
    };

    // Register the advanced cards
    function registerAdvancedCards() {
        if (window.CardRegistry) {
            console.log('🎨 Registering advanced cards with CardRegistry...');
            window.CardRegistry.register(window.PerformanceDashboardCard);
            window.CardRegistry.register(window.PlayerDetailCard);
        }
        
        // Replace the simple cards with advanced ones
        replaceCardsWithAdvanced();
    }

    function replaceCardsWithAdvanced() {
        console.log('🔄 Replacing simple cards with advanced modules...');
        
        // Replace Performance Dashboard in overview
        const overviewContainer = document.querySelector('#overview-grid-view .tile-container');
        if (overviewContainer) {
            const performanceCardHTML = window.PerformanceDashboardCard.render().innerHTML;
            const performanceCardElement = document.createElement('div');
            performanceCardElement.className = 'card w11 h6';
            performanceCardElement.setAttribute('data-grid-w', '11');
            performanceCardElement.setAttribute('data-grid-h', '6');
            performanceCardElement.draggable = false;
            performanceCardElement.innerHTML = performanceCardHTML;
            
            // Add to container
            overviewContainer.appendChild(performanceCardElement);
            console.log('✅ Added Performance Dashboard to overview');
        }
        
        // Replace Player Detail in squad
        const squadContainer = document.querySelector('#squad-grid-view .tile-container');
        if (squadContainer) {
            const playerCardHTML = window.PlayerDetailCard.render().innerHTML;
            const playerCardElement = document.createElement('div');
            playerCardElement.className = 'card w10 h8';
            playerCardElement.setAttribute('data-grid-w', '10');
            playerCardElement.setAttribute('data-grid-h', '8');
            playerCardElement.draggable = false;
            playerCardElement.innerHTML = playerCardHTML;
            
            // Add to container
            squadContainer.appendChild(playerCardElement);
            console.log('✅ Added Player Detail to squad');
        }
        
        // Re-initialize card features for new cards
        if (window.initializeCardFeatures) {
            setTimeout(() => {
                window.initializeCardFeatures();
            }, 100);
        }
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(registerAdvancedCards, 1000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(registerAdvancedCards, 1000);
        });
    }

    console.log('✅ CREATE ADVANCED CARDS: Advanced card system ready');

})();