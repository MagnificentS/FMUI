/* ==========================================
   CARD ENHANCER V2 - Uses modular card system
   ========================================== */

window.CardEnhancerV2 = {
    currentTab: 'overview',
    
    init() {
        // Removed switchTab wrapping to prevent conflicts
        // main.html already handles all card loading through loadPageCards
        // which integrates with CardRegistry.getCardsForPage
        
        // Store current tab for reference
        this.currentTab = 'overview';
    },
    
    loadCardsForTab(tab) {
        this.currentTab = tab;
        
        // Get the page container
        const page = document.getElementById(`${tab}-page`);
        if (!page) return;
        
        const container = page.querySelector('.tile-container');
        if (!container) return;
        
        // Use CardRegistry to render appropriate cards
        if (window.CardRegistry) {
            // Mark container as using modular system
            if (!container.dataset.modular) {
                container.dataset.modular = 'true';
                
                // Clear old hardcoded content if it's just placeholder
                const hasPlaceholder = container.textContent.includes('Coming soon') || 
                                     container.children.length === 0;
                
                if (hasPlaceholder) {
                    container.innerHTML = '';
                }
            }
            
            // Render cards from registry
            window.CardRegistry.renderCardsForPage(tab, container);
        }
    },
    
    refreshCurrentTab() {
        this.loadCardsForTab(this.currentTab);
    },
    
    updateCard(cardId) {
        if (window.CardRegistry) {
            window.CardRegistry.updateCard(cardId);
        }
    },
    
    updateAllCards() {
        if (window.CardRegistry) {
            window.CardRegistry.updateAllCards();
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for registry and cards to load
    setTimeout(() => {
        CardEnhancerV2.init();
    }, 600);
});