/**
 * CARD HOVER FIX - Show floating menu on hover
 * Since we removed nested headers, need to show controls on hover
 */

(function() {
    'use strict';

    console.log('🎯 CARD HOVER FIX: Setting up clean hover interactions...');

    function setupCardHover() {
        // Wait for cards to be loaded
        if (document.querySelectorAll('.card').length === 0) {
            setTimeout(setupCardHover, 500);
            return;
        }

        console.log('🎯 CARD HOVER FIX: Adding hover functionality to cards...');

        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const floatingMenu = card.querySelector('.floating-card-menu');
            
            if (floatingMenu) {
                // Show menu on card hover
                card.addEventListener('mouseenter', function() {
                    floatingMenu.style.opacity = '1';
                });
                
                card.addEventListener('mouseleave', function() {
                    floatingMenu.style.opacity = '0';
                });
                
                console.log(`✅ Added hover to card: ${card.dataset.cardTitle || 'Unknown'}`);
            }
        });

        console.log(`✅ CARD HOVER FIX: Setup complete for ${cards.length} cards`);
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(setupCardHover, 4000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(setupCardHover, 4000);
        });
    }

})();