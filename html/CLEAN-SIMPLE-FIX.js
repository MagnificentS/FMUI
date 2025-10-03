/**
 * CLEAN SIMPLE FIX
 * Stop all the complexity and just make it work properly
 */

(function() {
    'use strict';

    console.log('🧹 CLEAN SIMPLE FIX: Stopping all complexity and making it work...');

    function applyCleanFix() {
        // Wait for cards to load
        if (document.querySelectorAll('.card').length === 0) {
            setTimeout(applyCleanFix, 500);
            return;
        }

        console.log('🧹 CLEAN SIMPLE FIX: Cleaning up the mess...');

        // Fix each card individually to remove duplicate headers
        const cards = document.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            cleanupCard(card, index);
        });

        // Remove all my broken scripts' effects
        removeExcessivePadding();
        
        // Make resize handles work
        fixResizeHandles();

        console.log(`✅ CLEAN SIMPLE FIX: Fixed ${cards.length} cards`);
    }

    function cleanupCard(card, index) {
        try {
            // Get the actual content
            const content = extractCleanContent(card);
            const cardTitle = extractCardTitle(card);
            
            // Rebuild card with clean structure
            card.innerHTML = `
                <div class="card-header">
                    <span>${cardTitle}</span>
                    <div class="card-menu">
                        <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                    </div>
                </div>
                <div class="card-body">
                    ${content}
                </div>
                <div class="resize-handle"></div>
                <div class="resize-handle-bl"></div>
            `;
            
            console.log(`✅ Cleaned card ${index}: ${cardTitle}`);
            
        } catch (error) {
            console.error(`Failed to clean card ${index}:`, error);
        }
    }

    function extractCardTitle(card) {
        // Try to find card title from various sources
        const headerSpan = card.querySelector('.card-header span');
        const dataTitle = card.dataset.cardTitle;
        const dataCardTitle = card.querySelector('[data-card-title]')?.dataset.cardTitle;
        
        return headerSpan?.textContent || dataTitle || dataCardTitle || 'Card';
    }

    function extractCleanContent(card) {
        // Find the actual content, avoiding nested headers
        const cardBodies = card.querySelectorAll('.card-body');
        
        // Look for content in nested card bodies
        for (let body of cardBodies) {
            const content = body.innerHTML;
            
            // Skip if it contains another card-header (nested mess)
            if (content.includes('class="card-header"')) {
                continue;
            }
            
            // Look for actual content divs
            const contentDivs = body.querySelectorAll('.squad-summary-content, .tactical-content, .dashboard-content, .financial-content, .injury-list-content, .team-analysis-content, .training-schedule-content, .match-preview-content');
            
            if (contentDivs.length > 0) {
                return Array.from(contentDivs).map(div => div.outerHTML).join('');
            }
            
            // Look for stat-rows or tables
            const statRows = body.querySelectorAll('.stat-row');
            const tables = body.querySelectorAll('table');
            
            if (statRows.length > 0 || tables.length > 0) {
                return body.innerHTML;
            }
        }
        
        // Fallback - return any text content
        return card.textContent.trim() || 'Loading...';
    }

    function removeExcessivePadding() {
        // Simple CSS to remove padding
        const style = document.createElement('style');
        style.textContent = `
            .card-body {
                padding: 8px !important;
            }
            
            .tile-container {
                padding: 16px !important;
            }
            
            .card {
                margin: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    function fixResizeHandles() {
        // Simple resize functionality
        document.addEventListener('mousedown', function(e) {
            if (e.target.matches('.resize-handle')) {
                startResize(e, 'br');
            } else if (e.target.matches('.resize-handle-bl')) {
                startResize(e, 'bl');
            }
        });

        function startResize(e, corner) {
            e.preventDefault();
            const card = e.target.closest('.card');
            if (!card) return;

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = card.offsetWidth;
            const startHeight = card.offsetHeight;

            function doResize(e) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newWidth = corner === 'bl' ? startWidth - deltaX : startWidth + deltaX;
                let newHeight = startHeight + deltaY;

                newWidth = Math.max(150, newWidth);
                newHeight = Math.max(100, newHeight);

                card.style.width = newWidth + 'px';
                card.style.height = newHeight + 'px';
            }

            function stopResize() {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            }

            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
        }
    }

    // Auto-run
    if (document.readyState === 'complete') {
        setTimeout(applyCleanFix, 4000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(applyCleanFix, 4000);
        });
    }

})();