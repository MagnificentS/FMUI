/**
 * FIX ALL CARD MODULES
 * Remove headers from all card render functions
 */

(function() {
    'use strict';

    console.log('🔧 FIX ALL CARD MODULES: Removing headers from card render functions...');

    function fixCardModules() {
        // Wait for card modules to load
        if (!window.SquadSummaryCard || !window.PerformanceDashboardCard) {
            setTimeout(fixCardModules, 500);
            return;
        }

        console.log('🔧 FIX ALL CARD MODULES: Patching card render functions...');

        const cardModules = [
            'SquadSummaryCard',
            'PerformanceDashboardCard', 
            'UpcomingFixturesCard',
            'TrainingScheduleCard',
            'TransferTargetsCard',
            'FinancialOverviewCard',
            'LeagueTableCard',
            'PlayerListCard',
            'TacticalOverviewCard',
            'TacticalShapeCard',
            'TeamAnalysisCard',
            'TransferBudgetCard',
            'MatchPreviewCard',
            'InjuryReportCard',
            'PlayerDetailCard'
        ];

        let fixedCount = 0;

        cardModules.forEach(moduleName => {
            const module = window[moduleName];
            if (module && module.render) {
                console.log(`🔧 Patching ${moduleName}...`);
                
                // Store original render function
                const originalRender = module.render;
                
                // Create new render function without headers
                module.render = function() {
                    const result = originalRender.call(this);
                    
                    // Remove header from innerHTML
                    if (result.innerHTML) {
                        result.innerHTML = result.innerHTML
                            .replace(/<div class="card-header"[^>]*>[\s\S]*?<\/div>/g, '')
                            .replace(/^\s*<div class="card-body">\s*/, '<div class="card-body" data-card-title="' + this.title + '">')
                            .replace(/<div class="resize-handle"><\/div>/g, '<div class="resize-handle"></div><div class="resize-handle-bl"></div>');
                    }
                    
                    return result;
                };
                
                fixedCount++;
                console.log(`✅ Fixed ${moduleName}`);
            } else {
                console.log(`⚠️ Module ${moduleName} not found or has no render function`);
            }
        });

        console.log(`✅ FIX ALL CARD MODULES: Fixed ${fixedCount} card modules`);
        
        // Reload cards to apply fixes
        if (window.loadPageCards) {
            console.log('🔄 Reloading cards with fixed modules...');
            setTimeout(() => {
                window.loadPageCards('overview');
            }, 100);
        }
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(fixCardModules, 1000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(fixCardModules, 1000);
        });
    }

})();