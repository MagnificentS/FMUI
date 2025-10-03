/**
 * FORCE CLEAN SQUAD
 * Forcefully replace the information overload Squad with clean UX implementation
 * Think Hard about ensuring clean components actually render
 */

(function() {
    'use strict';

    console.log('👥 FORCE CLEAN SQUAD: Think Hard about forcefully implementing clean Squad screen...');

    const ForceCleanSquad = {
        init() {
            console.log('👥 FORCE CLEAN SQUAD: Replacing information overload with clean components...');
            
            // Wait for squad page to be active, then forcefully replace
            this.waitForSquadPage().then(() => {
                this.forceReplaceSquadContent();
            });
        },
        
        async waitForSquadPage() {
            return new Promise((resolve) => {
                const checkSquadActive = () => {
                    const squadPage = document.getElementById('squad-page');
                    if (squadPage && squadPage.classList.contains('active')) {
                        resolve();
                    } else {
                        setTimeout(checkSquadActive, 100);
                    }
                };
                checkSquadActive();
            });
        },
        
        forceReplaceSquadContent() {
            console.log('🔨 Forcefully replacing Squad content with clean UX design...');
            
            const container = document.querySelector('#squad-grid-view .tile-container');
            if (!container) return;
            
            // FORCE clear everything
            container.innerHTML = '';
            
            // Forest of Thoughts: What are the 4 essential Squad components?
            console.log('🌳 Forest of Thoughts: Essential Squad components');
            console.log('🌳 Tree 1: Formation view (primary) - visual formation with player positions');
            console.log('🌳 Tree 2: Key players list (secondary) - filtered top performers');
            console.log('🌳 Tree 3: Squad status (supporting) - morale and availability');
            console.log('🌳 Tree 4: Injury status (supporting) - critical information for team selection');
            
            const cleanSquadComponents = [
                {
                    title: 'Formation View',
                    size: 'w10 h6',
                    cognitiveLoad: 2,
                    content: this.createFormationViewContent()
                },
                {
                    title: 'Key Players',
                    size: 'w8 h6',
                    cognitiveLoad: 2,
                    content: this.createKeyPlayersContent()
                },
                {
                    title: 'Squad Status',
                    size: 'w6 h3',
                    cognitiveLoad: 1,
                    content: this.createSquadStatusContent()
                },
                {
                    title: 'Injury List',
                    size: 'w6 h3',
                    cognitiveLoad: 1,
                    content: this.createInjuryListContent()
                }
            ];
            
            // Validate before rendering
            const totalCognitive = cleanSquadComponents.reduce((sum, comp) => sum + comp.cognitiveLoad, 0);
            console.log(`🧪 Squad validation: ${cleanSquadComponents.length} components, ${totalCognitive}/10 cognitive load`);
            
            if (cleanSquadComponents.length > 4 || totalCognitive > 6) {
                console.error('❌ Squad components exceed UX limits');
                return;
            }
            
            // Render clean components
            cleanSquadComponents.forEach(component => {
                const card = document.createElement('div');
                card.className = `card ${component.size} clean-component squad-clean`;
                
                const [width, height] = component.size.match(/w(\d+) h(\d+)/).slice(1, 3);
                card.setAttribute('data-grid-w', width);
                card.setAttribute('data-grid-h', height);
                card.draggable = false;
                
                card.innerHTML = `
                    <div class="card-header clean-header">
                        <span>${component.title}</span>
                        <div class="card-menu">
                            <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                        </div>
                    </div>
                    <div class="card-body clean-body">
                        ${component.content}
                    </div>
                    <div class="resize-handle"></div>
                    <div class="resize-handle-bl"></div>
                `;
                
                container.appendChild(card);
                console.log(`✅ Clean Squad component: ${component.title} (cognitive load: ${component.cognitiveLoad})`);
            });
            
            // Layout the clean components
            if (window.layoutCards) {
                setTimeout(() => {
                    window.layoutCards(container);
                    console.log('✅ Clean Squad layout applied');
                }, 100);
            }
        },
        
        createFormationViewContent() {
            return `
                <div class="formation-display">
                    <div class="formation-info">
                        <span class="formation-name">4-2-3-1</span>
                        <span class="formation-familiarity">95% Familiar</span>
                    </div>
                    
                    <div class="formation-grid">
                        <div class="formation-row gk">
                            <div class="player-position">
                                <span class="pos-name">GK</span>
                                <span class="player-name">Onana</span>
                                <span class="player-rating">7.4</span>
                            </div>
                        </div>
                        
                        <div class="formation-row defense">
                            <div class="player-position">
                                <span class="pos-name">LB</span>
                                <span class="player-name">Shaw</span>
                                <span class="player-rating">7.3</span>
                            </div>
                            <div class="player-position">
                                <span class="pos-name">CB</span>
                                <span class="player-name">Martinez</span>
                                <span class="player-rating">7.6</span>
                            </div>
                            <div class="player-position">
                                <span class="pos-name">CB</span>
                                <span class="player-name">Varane</span>
                                <span class="player-rating">7.5</span>
                            </div>
                            <div class="player-position">
                                <span class="pos-name">RB</span>
                                <span class="player-name">Dalot</span>
                                <span class="player-rating">7.2</span>
                            </div>
                        </div>
                        
                        <div class="formation-row midfield">
                            <div class="player-position">
                                <span class="pos-name">DM</span>
                                <span class="player-name">Casemiro</span>
                                <span class="player-rating">7.5</span>
                            </div>
                            <div class="player-position">
                                <span class="pos-name">CM</span>
                                <span class="player-name">Mainoo</span>
                                <span class="player-rating">7.3</span>
                            </div>
                        </div>
                        
                        <div class="formation-row attack">
                            <div class="player-position">
                                <span class="pos-name">LW</span>
                                <span class="player-name">Rashford</span>
                                <span class="player-rating">7.8</span>
                            </div>
                            <div class="player-position">
                                <span class="pos-name">AM</span>
                                <span class="player-name">Bruno</span>
                                <span class="player-rating">8.2</span>
                            </div>
                            <div class="player-position">
                                <span class="pos-name">RW</span>
                                <span class="player-name">Garnacho</span>
                                <span class="player-rating">7.4</span>
                            </div>
                        </div>
                        
                        <div class="formation-row striker">
                            <div class="player-position">
                                <span class="pos-name">ST</span>
                                <span class="player-name">Højlund</span>
                                <span class="player-rating">7.2</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createKeyPlayersContent() {
            return `
                <div class="key-players-list">
                    <div class="list-header">
                        <h4>Key Squad Players</h4>
                        <select class="player-filter">
                            <option value="all">All Players</option>
                            <option value="starters">Starters</option>
                            <option value="bench">Bench</option>
                        </select>
                    </div>
                    
                    <div class="players-compact">
                        <div class="player-item star">
                            <span class="player-name">Bruno Fernandes (C)</span>
                            <span class="player-pos">AM</span>
                            <div class="player-rating excellent">8.2</div>
                            <span class="player-status">✓</span>
                        </div>
                        <div class="player-item">
                            <span class="player-name">Marcus Rashford</span>
                            <span class="player-pos">LW</span>
                            <div class="player-rating good">7.8</div>
                            <span class="player-status">✓</span>
                        </div>
                        <div class="player-item">
                            <span class="player-name">Lisandro Martinez</span>
                            <span class="player-pos">CB</span>
                            <div class="player-rating good">7.6</div>
                            <span class="player-status">✓</span>
                        </div>
                        <div class="player-item">
                            <span class="player-name">Casemiro</span>
                            <span class="player-pos">DM</span>
                            <div class="player-rating good">7.5</div>
                            <span class="player-status">✓</span>
                        </div>
                        <div class="player-item">
                            <span class="player-name">Raphael Varane</span>
                            <span class="player-pos">CB</span>
                            <div class="player-rating good">7.5</div>
                            <span class="player-status">✓</span>
                        </div>
                        <div class="player-item injured">
                            <span class="player-name">Luke Shaw</span>
                            <span class="player-pos">LB</span>
                            <div class="player-rating good">7.3</div>
                            <span class="player-status">⚕️</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadStatusContent() {
            return `
                <div class="squad-status-summary">
                    <div class="morale-display excellent">
                        <span class="morale-icon">😊</span>
                        <span class="morale-label">Excellent</span>
                    </div>
                    
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="status-label">Squad Size</span>
                            <span class="status-value">27</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Available</span>
                            <span class="status-value">25</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Avg Age</span>
                            <span class="status-value">26.3</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Value</span>
                            <span class="status-value">£678M</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createInjuryListContent() {
            return `
                <div class="injury-summary">
                    <div class="injury-header">
                        <h4>Current Injuries</h4>
                        <span class="injury-count">2 players</span>
                    </div>
                    
                    <div class="injury-items">
                        <div class="injury-item">
                            <span class="injured-name">L. Shaw</span>
                            <span class="injury-duration">2 weeks</span>
                            <span class="injury-type">Hamstring</span>
                        </div>
                        <div class="injury-item">
                            <span class="injured-name">A. Martial</span>
                            <span class="injury-duration">3 days</span>
                            <span class="injury-type">Knock</span>
                        </div>
                    </div>
                    
                    <div class="return-info">
                        <span class="return-text">1 returning soon</span>
                    </div>
                </div>
            `;
        }
    };

    // Add clean Squad styling
    const cleanSquadStyles = `
        /* Clean Squad Screen Styling */
        .squad-clean {
            border-left: 2px solid rgba(0, 255, 136, 0.3);
        }
        
        /* Formation Display */
        .formation-display {
            text-align: center;
        }
        
        .formation-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .formation-name {
            font-size: 14px;
            font-weight: 700;
            color: white;
        }
        
        .formation-familiarity {
            font-size: 10px;
            color: #00ff88;
            font-weight: 600;
        }
        
        .formation-grid {
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 8px;
            padding: 12px;
            min-height: 120px;
            position: relative;
        }
        
        .formation-row {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 8px 0;
        }
        
        .formation-row.defense {
            justify-content: space-between;
        }
        
        .formation-row.midfield {
            justify-content: space-around;
            margin: 0 20%;
        }
        
        .formation-row.attack {
            justify-content: space-between;
            margin: 0 10%;
        }
        
        .player-position {
            background: rgba(0, 148, 204, 0.9);
            border: 1px solid white;
            border-radius: 4px;
            padding: 4px 6px;
            text-align: center;
            min-width: 50px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .player-position:hover {
            background: rgba(0, 148, 204, 1);
            transform: scale(1.05);
        }
        
        .pos-name {
            display: block;
            font-size: 7px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1;
        }
        
        .player-name {
            display: block;
            font-size: 8px;
            font-weight: 600;
            color: white;
            margin: 1px 0;
        }
        
        .player-rating {
            font-size: 7px;
            color: rgba(255, 255, 255, 0.9);
        }
        
        /* Key Players List */
        .key-players-list {
            padding: 0;
        }
        
        .list-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .list-header h4 {
            margin: 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .player-filter {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
        }
        
        .players-compact {
            max-height: 140px;
            overflow-y: auto;
        }
        
        .player-item {
            display: grid;
            grid-template-columns: 1fr 30px 40px 20px;
            gap: 8px;
            padding: 6px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            align-items: center;
            transition: background 0.2s ease;
        }
        
        .player-item:hover {
            background: rgba(255, 255, 255, 0.02);
            cursor: pointer;
        }
        
        .player-item.star {
            background: rgba(0, 148, 204, 0.1);
            border-left: 2px solid #0094cc;
        }
        
        .player-item.injured {
            opacity: 0.7;
        }
        
        .player-item .player-name {
            font-size: 10px;
            color: white;
            font-weight: 500;
        }
        
        .player-item .player-pos {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
        }
        
        .player-item .player-rating {
            font-size: 10px;
            font-weight: 600;
            text-align: center;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .player-rating.excellent {
            background: rgba(0, 255, 136, 0.2);
            color: #00ff88;
        }
        
        .player-rating.good {
            background: rgba(255, 184, 0, 0.2);
            color: #ffb800;
        }
        
        .player-item .player-status {
            text-align: center;
            font-size: 12px;
        }
        
        /* Squad Status */
        .squad-status-summary {
            text-align: center;
        }
        
        .morale-display {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px;
            border-radius: 6px;
            margin-bottom: 12px;
        }
        
        .morale-display.excellent {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            font-size: 10px;
        }
        
        .status-item {
            text-align: center;
        }
        
        .status-label {
            display: block;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 2px;
            font-size: 9px;
        }
        
        .status-value {
            font-size: 11px;
            font-weight: 600;
            color: white;
        }
        
        /* Injury Summary */
        .injury-summary {
            padding: 0;
        }
        
        .injury-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .injury-header h4 {
            margin: 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .injury-count {
            font-size: 9px;
            color: #ff4757;
            font-weight: 600;
        }
        
        .injury-items {
            margin-bottom: 12px;
        }
        
        .injury-item {
            display: grid;
            grid-template-columns: 1fr 50px 60px;
            gap: 6px;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 9px;
        }
        
        .injured-name {
            color: white;
            font-weight: 500;
        }
        
        .injury-duration {
            color: #ff4757;
            font-weight: 600;
            text-align: center;
        }
        
        .injury-type {
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
        }
        
        .return-info {
            text-align: center;
            font-size: 9px;
            color: #00ff88;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = cleanSquadStyles;
    document.head.appendChild(style);

    // Auto-initialize
    ForceCleanSquad.init();

    // Make available for testing
    window.ForceCleanSquad = ForceCleanSquad;

})();