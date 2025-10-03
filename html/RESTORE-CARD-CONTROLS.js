/**
 * RESTORE CARD CONTROLS
 * Restore interactive controls that were accidentally removed with headers
 */

(function() {
    'use strict';

    console.log('🔧 RESTORE CARD CONTROLS: Restoring interactive controls...');

    function restoreCardControls() {
        // Wait for modules to load
        if (!window.PerformanceDashboardCard) {
            setTimeout(restoreCardControls, 500);
            return;
        }

        console.log('🔧 RESTORE CARD CONTROLS: Re-patching modules to preserve controls...');

        // COMPLETELY UNDO the broken FIX-ALL-CARD-MODULES patches
        // and replace with proper solutions

        // Re-patch PerformanceDashboardCard properly
        if (window.PerformanceDashboardCard) {
            window.PerformanceDashboardCard.render = function() {
                return {
                    className: 'card extra-wide tall performance-dashboard-card',
                    draggable: true,
                    innerHTML: `
                        <div class="card-title-bar" data-card-title="${this.title}">
                            <span class="card-title-text">${this.title}</span>
                            <div class="card-controls">
                                <select class="period-selector" onchange="window.PerformanceDashboardCard.changePeriod(this.value)" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px; border-radius: 3px; font-size: 11px;">
                                    <option value="month" ${this.currentPeriod === 'month' ? 'selected' : ''}>Last Month</option>
                                    <option value="season" ${this.currentPeriod === 'season' ? 'selected' : ''}>This Season</option>
                                    <option value="year" ${this.currentPeriod === 'year' ? 'selected' : ''}>Last 12 Months</option>
                                    <option value="career" ${this.currentPeriod === 'career' ? 'selected' : ''}>Career</option>
                                </select>
                                <select class="metric-selector" onchange="window.PerformanceDashboardCard.changeMetric(this.value)" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px; border-radius: 3px; font-size: 11px;">
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
            console.log('✅ Fixed PerformanceDashboardCard with working controls');
        }

        // Re-patch PlayerDetailCard properly
        if (window.PlayerDetailCard) {
            window.PlayerDetailCard.render = function() {
                return {
                    className: 'card player-detail-card',
                    draggable: true,
                    innerHTML: `
                        <div class="card-title-bar" data-card-title="${this.title}">
                            <span class="card-title-text">${this.title}</span>
                            <div class="card-controls">
                                <select class="player-selector" onchange="window.PlayerDetailCard.selectPlayer(this.value)" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px; border-radius: 3px; font-size: 11px;">
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
            console.log('✅ Fixed PlayerDetailCard with working controls');
        }

        // Add clean title bar styling
        addTitleBarStyles();

        // Reload the cards to apply fixes
        reloadCardsWithControls();

        console.log('✅ RESTORE CARD CONTROLS: Interactive controls restored');
    }

    function addTitleBarStyles() {
        const styles = `
            /* Clean card title bar (replaces ugly headers) */
            .card-title-bar {
                position: relative;
                background: linear-gradient(135deg, rgba(18, 20, 26, 0.8), rgba(26, 29, 36, 0.6));
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(5px);
                height: 32px;
                z-index: 5;
            }
            
            .card-title-text {
                font-size: 11px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.8);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }
            
            .card-controls {
                display: flex;
                gap: 6px;
                align-items: center;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            
            .card:hover .card-controls {
                opacity: 1;
            }
            
            .card-controls select,
            .card-controls button {
                font-size: 10px !important;
                padding: 3px 6px !important;
                height: 22px !important;
                line-height: 1 !important;
            }
            
            .card-controls select:hover,
            .card-controls button:hover {
                background: rgba(0, 148, 204, 0.3) !important;
                border-color: rgba(0, 148, 204, 0.5) !important;
            }
            
            /* Ensure controls are clickable */
            .card-controls * {
                pointer-events: auto !important;
                z-index: 10 !important;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'title-bar-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function reloadCardsWithControls() {
        console.log('🔄 Reloading cards with restored controls...');
        
        // Find the current active page and reload its cards
        const activePage = document.querySelector('.content-page.active');
        if (activePage && window.loadPageCards) {
            const pageName = activePage.id.replace('-page', '');
            console.log(`🔄 Reloading ${pageName} page cards...`);
            
            setTimeout(() => {
                window.loadPageCards(pageName);
            }, 100);
        }
    }

    // Auto-run when ready (AFTER other fixes)
    if (document.readyState === 'complete') {
        setTimeout(restoreCardControls, 3000); // Wait for other scripts
    } else {
        window.addEventListener('load', function() {
            setTimeout(restoreCardControls, 3000);
        });
    }

    // Make available for manual testing
    window.restoreCardControls = restoreCardControls;

})();