/**
 * ADD CLEAN CARD TITLES
 * Add minimal, elegant card identification without ugly nested headers
 */

(function() {
    'use strict';

    console.log('🎯 ADD CLEAN CARD TITLES: Adding elegant card identification...');

    function addCleanCardTitles() {
        // Wait for cards to be loaded
        if (document.querySelectorAll('.card').length === 0) {
            setTimeout(addCleanCardTitles, 500);
            return;
        }

        console.log('🎯 ADD CLEAN CARD TITLES: Processing cards...');

        const cards = document.querySelectorAll('.card');
        console.log(`Found ${cards.length} cards to add titles to`);

        cards.forEach((card, index) => {
            // Skip if already has clean title
            if (card.querySelector('.clean-card-title')) {
                return;
            }

            // Get card title from data attribute
            const cardTitle = card.dataset.cardTitle || 
                            card.querySelector('[data-card-title]')?.dataset.cardTitle ||
                            `Card ${index + 1}`;

            console.log(`Adding clean title to: "${cardTitle}"`);

            // Create clean title element
            const titleElement = document.createElement('div');
            titleElement.className = 'clean-card-title';
            titleElement.textContent = cardTitle;
            
            // Insert as first child of card
            card.insertBefore(titleElement, card.firstChild);

            console.log(`✅ Added clean title: "${cardTitle}"`);
        });

        // Add clean title styling
        addCleanTitleStyles();

        console.log(`✅ ADD CLEAN CARD TITLES: Processed ${cards.length} cards`);
    }

    function addCleanTitleStyles() {
        // Check if styles already added
        if (document.getElementById('clean-card-title-styles')) {
            return;
        }

        const styles = `
            /* Clean card title styling */
            .clean-card-title {
                position: absolute;
                top: 8px;
                left: 12px;
                font-size: 11px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.7);
                background: rgba(0, 0, 0, 0.6);
                padding: 4px 8px;
                border-radius: 4px;
                z-index: 5;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                pointer-events: none;
                opacity: 0.8;
            }
            
            .card:hover .clean-card-title {
                opacity: 1;
                color: rgba(255, 255, 255, 0.9);
                background: rgba(0, 20, 30, 0.8);
                border-color: rgba(0, 148, 204, 0.3);
            }
            
            /* Adjust floating menu position to avoid conflict with title */
            .floating-card-menu {
                top: 8px !important;
                right: 8px !important;
            }
            
            /* Ensure card content doesn't overlap with title */
            .card-body {
                padding-top: 40px !important;
            }
            
            /* Make sure titles are readable on all backgrounds */
            .clean-card-title {
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: calc(100% - 60px); /* Leave space for floating menu */
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'clean-card-title-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        console.log('✅ Clean card title styles added');
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(addCleanCardTitles, 4500);
    } else {
        window.addEventListener('load', function() {
            setTimeout(addCleanCardTitles, 4500);
        });
    }

})();