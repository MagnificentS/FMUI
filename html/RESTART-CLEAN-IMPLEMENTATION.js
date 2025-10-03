/**
 * RESTART CLEAN IMPLEMENTATION
 * Start the whole process again with proper header/navigation baseline
 * Think Hard about fixing fundamental layout issues before implementing screens
 */

(function() {
    'use strict';

    console.log('🔄 RESTART CLEAN IMPLEMENTATION: Think Hard about starting fresh with proper baseline...');

    const RestartCleanImplementation = {
        initialized: false,
        
        init() {
            if (this.initialized) return;
            
            console.log('🔄 RESTART: Starting complete clean implementation...');
            
            // Step 1: Fix fundamental layout issues
            this.fixHeaderAndNavigation();
            
            // Step 2: Clear all broken implementations  
            this.clearAllBrokenImplementations();
            
            // Step 3: Establish clean baseline
            this.establishCleanBaseline();
            
            // Step 4: Implement systematic screen-by-screen rebuild
            this.beginSystematicRebuild();
            
            this.initialized = true;
            console.log('✅ RESTART: Clean implementation initialized');
        },
        
        fixHeaderAndNavigation() {
            console.log('🔧 Fixing header and navigation positioning...');
            
            // Fix header positioning
            const header = document.querySelector('.header');
            if (header) {
                header.style.cssText = `
                    background: var(--primary-200);
                    height: 40px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    z-index: 100;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                `;
                console.log('✅ Header positioning fixed');
            }
            
            // Fix navigation positioning
            const nav = document.querySelector('.nav-container');
            if (nav) {
                nav.style.cssText = `
                    background: var(--neutral-300);
                    height: 48px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    position: fixed;
                    top: 40px;
                    left: 0;
                    right: 0;
                    z-index: 99;
                    border-bottom: 1px solid var(--neutral-400);
                `;
                console.log('✅ Navigation positioning fixed');
            }
            
            // Fix main content positioning
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.style.marginTop = '88px'; // 40px header + 48px nav
                console.log('✅ Main content positioning fixed');
            }
            
            console.log('✅ Header and navigation layout fixed');
        },
        
        clearAllBrokenImplementations() {
            console.log('🧹 Clearing all broken implementations...');
            
            // Remove all previous broken scripts
            const brokenScripts = [
                'CREATE-ADVANCED-CARDS.js',
                'IMPLEMENT-PERFORMANCE-CHARTS.js',
                'POPULATE-CHART-CONTAINERS.js', 
                'COMPLETE-SCREEN-CONTENT.js',
                'ZENITH-MOTION-SYSTEM.js',
                'ADVANCED-INTERACTIVE-WIDGETS.js',
                'ZENITH-VISUAL-SYSTEMS.js',
                'END-TO-END-INTEGRATION.js',
                'ZENITH-QUALITY-ASSURANCE.js'
            ];
            
            brokenScripts.forEach(scriptName => {
                const script = document.querySelector(`script[src="${scriptName}"]`);
                if (script) {
                    script.remove();
                    console.log(`🗑️ Removed broken script: ${scriptName}`);
                }
            });
            
            // Override all original page loading functions
            if (window.loadSquadPage) {
                window.loadSquadPage = () => {
                    console.log('🚫 Blocking original squad page loading');
                    // Do nothing - let clean implementation handle it
                };
            }
            
            if (window.loadTacticsPage) {
                window.loadTacticsPage = () => {
                    console.log('🚫 Blocking original tactics page loading');
                };
            }
            
            if (window.loadTrainingPage) {
                window.loadTrainingPage = () => {
                    console.log('🚫 Blocking original training page loading');
                };
            }
            
            if (window.loadTransfersPage) {
                window.loadTransfersPage = () => {
                    console.log('🚫 Blocking original transfers page loading');
                };
            }
            
            if (window.loadFinancesPage) {
                window.loadFinancesPage = () => {
                    console.log('🚫 Blocking original finances page loading');
                };
            }
            
            if (window.loadFixturesPage) {
                window.loadFixturesPage = () => {
                    console.log('🚫 Blocking original fixtures page loading');
                };
            }
            
            // Clear excessive cards from all screens  
            document.querySelectorAll('.content-page').forEach(page => {
                const container = page.querySelector('.tile-container');
                if (container && page.id !== 'overview-page') { // Keep overview clean implementation
                    container.innerHTML = '';
                    console.log(`🗑️ Cleared ${page.id}`);
                }
            });
            
            console.log('✅ All broken implementations cleared');
        },
        
        establishCleanBaseline() {
            console.log('📐 Establishing clean baseline with proper UX principles...');
            
            // Add baseline CSS for all screens
            const baselineCSS = `
                /* Clean Baseline - Research-Docs UX Principles */
                body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                    font-family: -apple-system, 'Inter', 'Segoe UI', sans-serif;
                    background: #0a0b0d;
                    color: #e4e6eb;
                }
                
                .header {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    z-index: 100 !important;
                }
                
                .nav-container {
                    position: fixed !important;
                    top: 40px !important;
                    left: 0 !important;
                    right: 0 !important;
                    z-index: 99 !important;
                }
                
                .app-container {
                    margin-top: 88px !important;
                    min-height: calc(100vh - 88px);
                }
                
                .nav-submenu {
                    position: fixed;
                    top: 88px;
                    left: 0;
                    right: 0;
                    height: 32px;
                    background: rgba(26, 29, 36, 0.95);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 98;
                    display: none;
                    align-items: center;
                    padding: 0 20px;
                }
                
                .nav-submenu.active {
                    display: flex;
                }
                
                .main-panel {
                    padding-top: 32px; /* Account for submenu */
                }
                
                /* Clean component styling */
                .clean-component {
                    background: var(--neutral-200) !important;
                    border-radius: var(--border-radius) !important;
                    box-shadow: 0 var(--shadow-intensity) calc(var(--shadow-intensity) * 1.5) rgba(0,0,0,0.38) !important;
                    overflow: hidden !important;
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1) !important;
                }
                
                .clean-component:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2) !important;
                }
                
                .clean-header {
                    background: var(--neutral-100) !important;
                    padding: 8px 12px !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    height: 32px !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .clean-header span {
                    color: var(--primary-400) !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                }
                
                .clean-body {
                    padding: 12px !important;
                    overflow: auto !important;
                }
                
                /* Submenu styling */
                .submenu-item {
                    padding: 6px 12px;
                    margin: 0 4px;
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .submenu-item.active {
                    background: rgba(0, 148, 204, 0.3);
                    color: white;
                }
                
                .submenu-item.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .submenu-item:not(.disabled):not(.active):hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.9);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'clean-baseline-styles';
            style.textContent = baselineCSS;
            document.head.appendChild(style);
            
            console.log('✅ Clean baseline established');
        },
        
        beginSystematicRebuild() {
            console.log('🚀 Beginning systematic screen-by-screen rebuild...');
            
            // Phase 1: Overview (already clean)
            console.log('✅ Phase 1: Overview - Already implemented with clean 4-component design');
            
            // Phase 2: Squad screen implementation
            this.implementSquadScreen();
            
            // Phase 3: Will continue with other screens after Squad validation
            console.log('⏳ Phases 3-7: Pending Squad validation...');
        },
        
        implementSquadScreen() {
            console.log('👥 Implementing Squad screen with UX principles...');
            
            // Forest of Thoughts for Squad screen
            console.log('🌳 Forest of Thoughts: Squad screen component decisions...');
            
            // Decision Tree 1: What's the primary squad management task?
            console.log('🌳 Tree 1: Primary squad task analysis');
            // Answer: View starting XI and player status for team selection
            
            // Decision Tree 2: What's the secondary analysis need?
            console.log('🌳 Tree 2: Secondary analysis requirements');
            // Answer: Individual player evaluation and squad depth assessment
            
            // Decision Tree 3: How to organize squad information?
            console.log('🌳 Tree 3: Information architecture');
            // Answer: Formation view (primary), Player list (secondary), Depth/Status (supporting)
            
            const squadComponents = [
                {
                    title: 'First Team Formation',
                    size: 'w10 h6', // Primary focus
                    cognitiveLoad: 2,
                    content: this.createFormationViewContent()
                },
                {
                    title: 'Player List', 
                    size: 'w8 h6', // Secondary focus
                    cognitiveLoad: 2,
                    content: this.createPlayerListContent()
                },
                {
                    title: 'Squad Status',
                    size: 'w6 h3', // Supporting
                    cognitiveLoad: 1,
                    content: this.createSquadStatusContent()
                },
                {
                    title: 'Injury Report',
                    size: 'w6 h3', // Supporting
                    cognitiveLoad: 1,
                    content: this.createInjuryReportContent()
                }
            ];
            
            // Validate against UX principles
            if (squadComponents.length > 6) {
                console.error('❌ Squad exceeds component limit');
                return;
            }
            
            const totalCognitiveLoad = squadComponents.reduce((sum, comp) => sum + comp.cognitiveLoad, 0);
            if (totalCognitiveLoad > 6) {
                console.error('❌ Squad exceeds cognitive load target');
                return;
            }
            
            console.log(`✅ Squad validation passed: ${squadComponents.length} components, ${totalCognitiveLoad}/10 cognitive load`);
            
            // Render squad components
            this.renderSquadComponents(squadComponents);
        },
        
        createFormationViewContent() {
            return `
                <div class="formation-view">
                    <div class="formation-title">
                        <h4>4-2-3-1 Starting XI</h4>
                        <div class="formation-confidence">95% Familiar</div>
                    </div>
                    
                    <div class="formation-pitch">
                        <div class="pitch-player gk" style="left: 50%; top: 85%;">
                            <span class="name">Onana</span>
                            <span class="rating">7.4</span>
                        </div>
                        
                        <div class="pitch-player def" style="left: 20%; top: 65%;">
                            <span class="name">Shaw</span>
                            <span class="rating">7.3</span>
                        </div>
                        <div class="pitch-player def" style="left: 40%; top: 70%;">
                            <span class="name">Martinez</span>
                            <span class="rating">7.6</span>
                        </div>
                        <div class="pitch-player def" style="left: 60%; top: 70%;">
                            <span class="name">Varane</span>
                            <span class="rating">7.5</span>
                        </div>
                        <div class="pitch-player def" style="left: 80%; top: 65%;">
                            <span class="name">Dalot</span>
                            <span class="rating">7.2</span>
                        </div>
                        
                        <div class="pitch-player mid" style="left: 35%; top: 45%;">
                            <span class="name">Casemiro</span>
                            <span class="rating">7.5</span>
                        </div>
                        <div class="pitch-player mid" style="left: 65%; top: 45%;">
                            <span class="name">Mainoo</span>
                            <span class="rating">7.3</span>
                        </div>
                        
                        <div class="pitch-player att" style="left: 20%; top: 25%;">
                            <span class="name">Rashford</span>
                            <span class="rating">7.8</span>
                        </div>
                        <div class="pitch-player att" style="left: 50%; top: 30%;">
                            <span class="name">Bruno</span>
                            <span class="rating">8.2</span>
                        </div>
                        <div class="pitch-player att" style="left: 80%; top: 25%;">
                            <span class="name">Garnacho</span>
                            <span class="rating">7.4</span>
                        </div>
                        
                        <div class="pitch-player str" style="left: 50%; top: 10%;">
                            <span class="name">Højlund</span>
                            <span class="rating">7.2</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createPlayerListContent() {
            return `
                <div class="player-list-clean">
                    <div class="list-header">
                        <h4>Squad Players</h4>
                        <select class="filter-select">
                            <option value="">All Players</option>
                            <option value="first-team">First Team</option>
                            <option value="reserves">Reserves</option>
                        </select>
                    </div>
                    
                    <div class="player-rows">
                        <div class="player-row highlight">
                            <span class="player-name">Bruno Fernandes (C)</span>
                            <span class="player-pos">AM</span>
                            <span class="player-rating excellent">8.2</span>
                            <span class="player-status available">✓</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Marcus Rashford</span>
                            <span class="player-pos">LW</span>
                            <span class="player-rating good">7.8</span>
                            <span class="player-status available">✓</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Lisandro Martinez</span>
                            <span class="player-pos">CB</span>
                            <span class="player-rating good">7.6</span>
                            <span class="player-status available">✓</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Casemiro</span>
                            <span class="player-pos">DM</span>
                            <span class="player-rating good">7.5</span>
                            <span class="player-status available">✓</span>
                        </div>
                        <div class="player-row">
                            <span class="player-name">Luke Shaw</span>
                            <span class="player-pos">LB</span>
                            <span class="player-rating average">7.3</span>
                            <span class="player-status injured">⚕️</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createSquadStatusContent() {
            return `
                <div class="squad-status-clean">
                    <div class="status-overview">
                        <div class="morale-display excellent">
                            <span class="morale-icon">😊</span>
                            <span class="morale-text">Excellent</span>
                        </div>
                    </div>
                    
                    <div class="status-metrics">
                        <div class="metric-row">
                            <span class="metric-label">Total Players</span>
                            <span class="metric-value">27</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Available</span>
                            <span class="metric-value">25</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">Injured</span>
                            <span class="metric-value warning">2</span>
                        </div>
                    </div>
                </div>
            `;
        },
        
        createInjuryReportContent() {
            return `
                <div class="injury-report-clean">
                    <div class="injury-header">
                        <h4>Current Injuries</h4>
                        <span class="injury-count">2 players</span>
                    </div>
                    
                    <div class="injury-list">
                        <div class="injury-item">
                            <span class="injured-player">L. Shaw</span>
                            <span class="injury-time">2 weeks</span>
                            <span class="injury-type">Hamstring</span>
                        </div>
                        <div class="injury-item">
                            <span class="injured-player">A. Martial</span>
                            <span class="injury-time">3 days</span>
                            <span class="injury-type">Knock</span>
                        </div>
                    </div>
                    
                    <div class="injury-summary">
                        <span class="return-soon">1 returning this week</span>
                    </div>
                </div>
            `;
        },
        
        renderSquadComponents(components) {
            console.log(`🎨 Rendering ${components.length} clean Squad components...`);
            
            const container = document.querySelector('#squad-grid-view .tile-container');
            if (!container) return;
            
            // Clear and render clean components
            container.innerHTML = '';
            
            components.forEach((component, index) => {
                const card = document.createElement('div');
                card.className = `card ${component.size} clean-component squad-component`;
                
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
                console.log(`✅ Squad component rendered: ${component.title} (${component.size}, cognitive load: ${component.cognitiveLoad})`);
            });
            
            // Layout cards properly
            if (window.layoutCards) {
                setTimeout(() => {
                    window.layoutCards(container);
                }, 100);
            }
        }
    };

    // Add enhanced styling for the clean implementation
    const enhancedStyles = `
        /* Formation View Styling */
        .formation-view {
            padding: 0;
        }
        
        .formation-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .formation-title h4 {
            margin: 0;
            font-size: 12px;
            color: white;
        }
        
        .formation-confidence {
            font-size: 10px;
            color: #00ff88;
            font-weight: 600;
        }
        
        .formation-pitch {
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 8px;
            position: relative;
            height: 160px;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .pitch-player {
            position: absolute;
            transform: translate(-50%, -50%);
            background: rgba(0, 148, 204, 0.9);
            border: 2px solid white;
            border-radius: 6px;
            padding: 4px 6px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 50px;
        }
        
        .pitch-player:hover {
            background: rgba(0, 148, 204, 1);
            transform: translate(-50%, -50%) scale(1.1);
            z-index: 10;
        }
        
        .pitch-player .name {
            display: block;
            font-size: 8px;
            font-weight: 600;
            color: white;
            line-height: 1;
        }
        
        .pitch-player .rating {
            display: block;
            font-size: 7px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 1px;
        }
        
        /* Player List Styling */
        .player-list-clean {
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
        
        .filter-select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
        }
        
        .player-rows {
            max-height: 140px;
            overflow-y: auto;
        }
        
        .player-row {
            display: grid;
            grid-template-columns: 1fr 40px 40px 30px;
            gap: 8px;
            padding: 6px 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 10px;
            align-items: center;
            transition: background 0.2s ease;
        }
        
        .player-row:hover {
            background: rgba(255, 255, 255, 0.02);
            cursor: pointer;
        }
        
        .player-row.highlight {
            background: rgba(0, 148, 204, 0.1);
            border-left: 2px solid #0094cc;
        }
        
        .player-name {
            color: white;
            font-weight: 500;
        }
        
        .player-pos {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 9px;
        }
        
        .player-rating {
            text-align: center;
            font-weight: 600;
        }
        
        .player-rating.excellent {
            color: #00ff88;
        }
        
        .player-rating.good {
            color: #ffb800;
        }
        
        .player-rating.average {
            color: #ffa502;
        }
        
        .player-status {
            text-align: center;
        }
        
        .player-status.available {
            color: #00ff88;
        }
        
        .player-status.injured {
            color: #ff4757;
        }
        
        /* Squad Status Styling */
        .squad-status-clean {
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
        
        .status-metrics {
            font-size: 10px;
        }
        
        .metric-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .metric-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .metric-value {
            color: white;
            font-weight: 600;
        }
        
        .metric-value.warning {
            color: #ffb800;
        }
        
        /* Injury Report Styling */
        .injury-report-clean {
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
        
        .injury-list {
            margin-bottom: 12px;
        }
        
        .injury-item {
            display: grid;
            grid-template-columns: 1fr 60px 60px;
            gap: 8px;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 10px;
        }
        
        .injured-player {
            color: white;
            font-weight: 500;
        }
        
        .injury-time {
            color: #ff4757;
            font-weight: 600;
            text-align: center;
        }
        
        .injury-type {
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            font-size: 9px;
        }
        
        .injury-summary {
            text-align: center;
            font-size: 9px;
            color: #00ff88;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = enhancedStyles;
    document.head.appendChild(style);

    // Initialize immediately
    RestartCleanImplementation.init();

    // Make available for coordination
    window.RestartCleanImplementation = RestartCleanImplementation;

})();