/**
 * RESTORE ORIGINAL DESIGN
 * Use the clean v19-old.html card design with ZENITH principles
 * Remove excessive padding and ensure full screen layout
 */

(function() {
    'use strict';

    console.log('🎨 RESTORE ORIGINAL DESIGN: Implementing clean v19-old design with ZENITH enhancements...');

    function restoreOriginalDesign() {
        // Wait for everything to load
        if (!document.querySelector('.card') || !window.PerformanceDashboardCard) {
            setTimeout(restoreOriginalDesign, 500);
            return;
        }

        console.log('🎨 RESTORE ORIGINAL DESIGN: Applying clean card design...');

        // 1. Remove excessive padding and restore clean layout
        removeExcessivePadding();

        // 2. Restore original card structure for all modules
        restoreOriginalCardStructure();

        // 3. Ensure full screen layout utilization
        optimizeScreenLayout();

        // 4. Apply ZENITH enhancements without breaking the design
        applyZenithEnhancements();

        // 5. Reload cards with clean design
        reloadWithCleanDesign();

        console.log('✅ RESTORE ORIGINAL DESIGN: Clean design restored');
    }

    function removeExcessivePadding() {
        console.log('🗑️ Removing excessive padding and spacing...');

        const cleanupStyles = `
            /* Remove excessive padding - restore original clean design */
            .card-body {
                padding: 12px !important; /* Reduced from 20px+ nonsense */
            }
            
            .tile-container {
                padding: 0 !important; /* Remove any added padding */
                gap: var(--grid-gap) !important; /* Use original grid gap only */
            }
            
            .main-container {
                padding: 0 !important; /* Remove container padding */
                margin-top: 88px !important; /* Header (40px) + Nav (48px) = 88px */
            }
            
            .content-page {
                padding: 0 !important;
                margin: 0 !important;
            }
            
            .view-container {
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            /* Full screen utilization - ZENITH principle */
            .app-container {
                width: 100vw !important;
                height: 100vh !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: hidden;
            }
            
            .main-panel {
                width: 100% !important;
                height: calc(100vh - 88px) !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: auto;
            }
        `;

        const style = document.createElement('style');
        style.id = 'cleanup-padding-styles';
        style.textContent = cleanupStyles;
        document.head.appendChild(style);

        console.log('✅ Excessive padding removed');
    }

    function restoreOriginalCardStructure() {
        console.log('🔧 Restoring original card structure...');

        // Restore Performance Dashboard with original structure + working controls
        if (window.PerformanceDashboardCard) {
            window.PerformanceDashboardCard.render = function() {
                return {
                    className: 'card extra-wide tall performance-dashboard-card',
                    draggable: true,
                    innerHTML: `
                        <div class="card-header">
                            <span>${this.title}</span>
                            <div class="header-controls">
                                <select class="period-selector" onchange="window.PerformanceDashboardCard.changePeriod(this.value)">
                                    <option value="month" ${this.currentPeriod === 'month' ? 'selected' : ''}>Last Month</option>
                                    <option value="season" ${this.currentPeriod === 'season' ? 'selected' : ''}>This Season</option>
                                    <option value="year" ${this.currentPeriod === 'year' ? 'selected' : ''}>Last 12 Months</option>
                                    <option value="career" ${this.currentPeriod === 'career' ? 'selected' : ''}>Career</option>
                                </select>
                                <select class="metric-selector" onchange="window.PerformanceDashboardCard.changeMetric(this.value)">
                                    <option value="goals" ${this.selectedMetric === 'goals' ? 'selected' : ''}>Goals</option>
                                    <option value="assists" ${this.selectedMetric === 'assists' ? 'selected' : ''}>Assists</option>
                                    <option value="rating" ${this.selectedMetric === 'rating' ? 'selected' : ''}>Rating</option>
                                    <option value="performance" ${this.selectedMetric === 'performance' ? 'selected' : ''}>Performance</option>
                                </select>
                            </div>
                        </div>
                        <div class="card-body">
                            ${this.getContent()}
                        </div>
                        <div class="resize-handle"></div>
                        <div class="resize-handle-bl"></div>
                    `
                };
            };
            console.log('✅ Restored PerformanceDashboardCard with original structure');
        }

        // Restore Player Detail with original structure + working controls
        if (window.PlayerDetailCard) {
            window.PlayerDetailCard.render = function() {
                return {
                    className: 'card player-detail-card',
                    draggable: true,
                    innerHTML: `
                        <div class="card-header">
                            <span>${this.title}</span>
                            <div class="header-controls">
                                <select class="player-selector" onchange="window.PlayerDetailCard.selectPlayer(this.value)">
                                    <option value="">Select Player...</option>
                                    <option value="1">Marcus Rashford (LW)</option>
                                    <option value="2">Bruno Fernandes (AM)</option>
                                    <option value="3">Lisandro Martinez (CB)</option>
                                </select>
                            </div>
                        </div>
                        <div class="card-body">
                            ${this.getContent()}
                        </div>
                        <div class="resize-handle"></div>
                        <div class="resize-handle-bl"></div>
                    `
                };
            };
            console.log('✅ Restored PlayerDetailCard with original structure');
        }

        // Restore all other cards to original clean structure
        const simpleCardModules = [
            'SquadSummaryCard', 'UpcomingFixturesCard', 'TrainingScheduleCard', 
            'TransferTargetsCard', 'FinancialOverviewCard', 'LeagueTableCard',
            'PlayerListCard', 'TacticalOverviewCard', 'TacticalShapeCard',
            'TeamAnalysisCard', 'TransferBudgetCard', 'MatchPreviewCard', 'InjuryReportCard'
        ];

        simpleCardModules.forEach(moduleName => {
            const module = window[moduleName];
            if (module && module.render) {
                const originalRender = module.render;
                module.render = function() {
                    return {
                        className: 'card',
                        draggable: true,
                        innerHTML: `
                            <div class="card-header">
                                <span>${this.title}</span>
                            </div>
                            <div class="card-body">
                                ${this.getContent ? this.getContent() : 'Content loading...'}
                            </div>
                            <div class="resize-handle"></div>
                            <div class="resize-handle-bl"></div>
                        `
                    };
                };
                console.log(`✅ Restored ${moduleName} to original structure`);
            }
        });
    }

    function optimizeScreenLayout() {
        console.log('📐 Optimizing screen layout for full utilization...');

        // Apply ZENITH full-screen layout principles
        const layoutStyles = `
            /* ZENITH Full Screen Layout Optimization */
            html, body {
                width: 100% !important;
                height: 100% !important;
                overflow: hidden !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* Use every pixel efficiently - ZENITH principle */
            .tile-container {
                width: 100% !important;
                height: 100% !important;
                padding: var(--grid-padding-v) var(--grid-padding-h) !important;
                box-sizing: border-box;
                overflow: auto;
            }
            
            /* Remove wasted space around grid */
            .view-container {
                width: 100% !important;
                height: calc(100vh - 88px) !important; /* Full height minus headers */
                overflow: hidden;
            }
            
            /* Cards should use original clean styling */
            .card {
                background: var(--neutral-200) !important;
                border-radius: var(--border-radius) !important;
                box-shadow: 0 var(--shadow-intensity) calc(var(--shadow-intensity) * 1.5) rgba(0,0,0,0.38) !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                position: relative !important;
            }
            
            /* Original card header styling */
            .card-header {
                background: var(--neutral-100) !important;
                padding: 6px 12px !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                height: 35px !important;
                box-sizing: border-box;
            }
            
            .card-header span {
                color: var(--primary-400) !important;
                font-size: 11px !important;
                font-weight: 600 !important;
            }
            
            /* Original card body styling */
            .card-body {
                flex: 1 !important;
                padding: 12px !important; /* Clean, not excessive */
                overflow: auto !important;
                background: transparent !important;
            }
            
            /* Header controls styling */
            .header-controls {
                display: flex;
                gap: 6px;
                align-items: center;
            }
            
            .header-controls select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 10px;
                cursor: pointer;
            }
            
            .header-controls select:hover {
                background: rgba(0, 148, 204, 0.3);
                border-color: rgba(0, 148, 204, 0.5);
            }
            
            /* Ensure controls are clickable */
            .header-controls * {
                pointer-events: auto !important;
                z-index: 10 !important;
            }
        `;

        const style = document.createElement('style');
        style.id = 'zenith-layout-optimization';
        style.textContent = layoutStyles;
        document.head.appendChild(style);

        console.log('✅ Screen layout optimized for full utilization');
    }

    function applyZenithEnhancements() {
        console.log('✨ Applying ZENITH enhancements...');

        // ZENITH timing and motion enhancements
        const zenithStyles = `
            /* ZENITH Motion Choreography */
            .card {
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1) !important;
            }
            
            .card:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2) !important;
            }
            
            /* ZENITH 60fps Performance */
            * {
                will-change: auto;
            }
            
            .card:hover {
                will-change: transform, box-shadow;
            }
            
            /* ZENITH Psychological Timing - 16ms primary feedback */
            .card-header:hover {
                background: rgba(18, 20, 26, 0.8) !important;
                transition: background-color 16ms ease !important;
            }
            
            /* ZENITH Sacred Geometry - Golden Ratio Spacing */
            .card-body {
                line-height: 1.618 !important; /* Golden ratio */
            }
        `;

        const style = document.createElement('style');
        style.id = 'zenith-enhancements';
        style.textContent = zenithStyles;
        document.head.appendChild(style);

        console.log('✅ ZENITH enhancements applied');
    }

    function reloadWithCleanDesign() {
        console.log('🔄 Reloading cards with clean original design...');

        // Reload the current page to apply clean design
        const activePage = document.querySelector('.content-page.active');
        if (activePage && window.loadPageCards) {
            const pageName = activePage.id.replace('-page', '');
            console.log(`🔄 Reloading ${pageName} with clean design...`);
            
            setTimeout(() => {
                window.loadPageCards(pageName);
            }, 100);
        }
    }

    // Debug the final layout
    function debugFinalLayout() {
        setTimeout(() => {
            console.log('\n🔍 ZENITH LAYOUT DEBUG:');
            
            const viewport = {
                width: window.innerWidth,
                height: window.innerHeight
            };
            
            const mainPanel = document.querySelector('.main-panel');
            const tileContainer = document.querySelector('.tile-container');
            const cards = document.querySelectorAll('.card');
            
            console.log(`📏 Viewport: ${viewport.width}x${viewport.height}`);
            
            if (mainPanel) {
                console.log(`📏 Main Panel: ${mainPanel.offsetWidth}x${mainPanel.offsetHeight}`);
            }
            
            if (tileContainer) {
                console.log(`📏 Tile Container: ${tileContainer.offsetWidth}x${tileContainer.offsetHeight}`);
                console.log(`📏 Container Padding: ${window.getComputedStyle(tileContainer).padding}`);
            }
            
            console.log(`🎴 Cards: ${cards.length} total`);
            
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                console.log(`   Card ${index}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)} at (${rect.left.toFixed(0)}, ${rect.top.toFixed(0)})`);
            });
            
            // Check for wasted space
            const usedHeight = mainPanel ? mainPanel.offsetHeight : 0;
            const wastedSpace = viewport.height - usedHeight - 88; // 88px for headers
            
            console.log(`📊 Space utilization: ${((usedHeight / (viewport.height - 88)) * 100).toFixed(1)}%`);
            console.log(`📊 Wasted space: ${wastedSpace}px`);
            
            if (wastedSpace > 50) {
                console.warn('⚠️ ZENITH WARNING: Significant wasted vertical space detected');
            } else {
                console.log('✅ ZENITH: Efficient space utilization achieved');
            }
            
        }, 2000);
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(() => {
            restoreOriginalDesign();
            debugFinalLayout();
        }, 3000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(() => {
                restoreOriginalDesign();
                debugFinalLayout();
            }, 3000);
        });
    }

    // Make available for manual testing
    window.restoreOriginalDesign = restoreOriginalDesign;

})();