/**
 * PRESERVE INTERACTIVE CONTROLS
 * Fix the card modules to preserve interactive controls while removing headers
 */

(function() {
    'use strict';

    console.log('🎛️ PRESERVE INTERACTIVE CONTROLS: Fixing card modules to preserve controls...');

    function preserveInteractiveControls() {
        // Wait for card modules to load
        if (!window.PerformanceDashboardCard || !window.PlayerDetailCard) {
            setTimeout(preserveInteractiveControls, 500);
            return;
        }

        console.log('🎛️ PRESERVE INTERACTIVE CONTROLS: Re-patching card modules...');

        // Fix the modules that have interactive controls
        const interactiveCardModules = [
            'PerformanceDashboardCard',
            'PlayerDetailCard', 
            'TransferTargetsCard',
            'FinancialOverviewCard',
            'PlayerListCard'
        ];

        interactiveCardModules.forEach(moduleName => {
            const module = window[moduleName];
            if (module && module.render) {
                console.log(`🎛️ Re-patching ${moduleName} to preserve controls...`);
                
                // Store original render function
                const originalRender = module.render;
                
                // Create new render function that preserves controls
                module.render = function() {
                    const result = originalRender.call(this);
                    
                    if (result.innerHTML) {
                        // Extract interactive controls from header before removing it
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = result.innerHTML;
                        
                        const cardHeader = tempDiv.querySelector('.card-header');
                        let controlsHTML = '';
                        
                        if (cardHeader) {
                            // Extract any controls from the header
                            const headerControls = cardHeader.querySelector('.header-controls');
                            if (headerControls) {
                                controlsHTML = headerControls.outerHTML;
                            }
                            
                            // Get any select elements
                            const selects = cardHeader.querySelectorAll('select');
                            selects.forEach(select => {
                                controlsHTML += select.outerHTML;
                            });
                            
                            // Get any buttons (except expand/menu)
                            const buttons = cardHeader.querySelectorAll('button:not(.card-menu-btn):not(.expand-btn)');
                            buttons.forEach(button => {
                                controlsHTML += button.outerHTML;
                            });
                        }
                        
                        // Remove the header but preserve controls
                        result.innerHTML = result.innerHTML
                            .replace(/<div class="card-header"[^>]*>[\s\S]*?<\/div>/g, '')
                            .replace(/^\s*<div class="card-body">\s*/, 
                                `<div class="card-controls-bar">${controlsHTML}</div><div class="card-body" data-card-title="${this.title}">`)
                            .replace(/<div class="resize-handle"><\/div>/g, '<div class="resize-handle"></div><div class="resize-handle-bl"></div>');
                    }
                    
                    return result;
                };
                
                console.log(`✅ Re-patched ${moduleName} with preserved controls`);
            }
        });

        // Add styles for the controls bar
        addControlsBarStyles();

        // Reload cards to apply fixes
        if (window.loadPageCards) {
            console.log('🔄 Reloading cards with preserved controls...');
            setTimeout(() => {
                const currentPage = document.querySelector('.content-page.active');
                if (currentPage) {
                    const pageName = currentPage.id.replace('-page', '');
                    window.loadPageCards(pageName);
                }
            }, 100);
        }

        console.log('✅ PRESERVE INTERACTIVE CONTROLS: All interactive controls preserved');
    }

    function addControlsBarStyles() {
        const styles = `
            /* Controls bar styling */
            .card-controls-bar {
                position: absolute;
                top: 32px;
                left: 12px;
                right: 40px;
                height: 28px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 0 8px;
                z-index: 8;
                opacity: 0;
                transition: all 0.2s ease;
                backdrop-filter: blur(5px);
            }
            
            .card:hover .card-controls-bar {
                opacity: 1;
            }
            
            .card-controls-bar select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 11px;
                cursor: pointer;
            }
            
            .card-controls-bar button {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .card-controls-bar button:hover,
            .card-controls-bar select:hover {
                background: rgba(0, 148, 204, 0.3);
                border-color: rgba(0, 148, 204, 0.5);
            }
            
            /* Adjust card body padding for controls bar */
            .card:has(.card-controls-bar) .card-body {
                padding-top: 70px !important;
            }
            
            /* Ensure controls are above card content */
            .header-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'controls-bar-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        console.log('✅ Controls bar styles added');
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(preserveInteractiveControls, 2000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(preserveInteractiveControls, 2000);
        });
    }

    // Make available globally for manual testing
    window.preserveInteractiveControls = preserveInteractiveControls;

})();