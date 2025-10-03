/* ==========================================
   CARD REGISTRY - Central registration system
   ========================================== */

window.CardRegistry = {
    cards: new Map(),
    pageCards: new Map(),
    
    register(card) {
        if (!card.id || !card.render) {
            console.error('Card must have id and render method', card);
            return;
        }
        
        // Store card reference
        this.cards.set(card.id, card);
        
        // Register which pages this card appears on
        if (card.pages && Array.isArray(card.pages)) {
            card.pages.forEach(page => {
                if (!this.pageCards.has(page)) {
                    this.pageCards.set(page, []);
                }
                this.pageCards.get(page).push(card.id);
            });
        }
        
        console.log(`Card registered: ${card.id} for pages: ${card.pages?.join(', ') || 'none'}`);
    },
    
    getCardsForPage(pageName) {
        const cardIds = this.pageCards.get(pageName) || [];
        return cardIds.map(id => this.cards.get(id)).filter(Boolean);
    },
    
    getCard(cardId) {
        return this.cards.get(cardId);
    },
    
    getRegisteredTypes() {
        return Array.from(this.cards.keys());
    },
    
    renderCardsForPage(pageName, container) {
        if (!container) return;
        
        const cards = this.getCardsForPage(pageName);
        
        // Clear existing content if it's just placeholder
        if (container.children.length === 1 && container.children[0].textContent.includes('Coming soon')) {
            container.innerHTML = '';
        }
        
        // Don't clear if there are already cards
        const existingCardIds = [...container.querySelectorAll('[data-card-id]')].map(el => el.dataset.cardId);
        
        cards.forEach(card => {
            // Skip if card already exists
            if (existingCardIds.includes(card.id)) {
                return;
            }
            
            // Create card element
            const cardConfig = card.render();
            const cardElement = document.createElement('div');
            cardElement.className = cardConfig.className || 'card';
            cardElement.draggable = cardConfig.draggable !== false;
            cardElement.dataset.cardId = card.id;
            cardElement.innerHTML = cardConfig.innerHTML;
            
            container.appendChild(cardElement);
        });
    },
    
    updateCard(cardId) {
        const card = this.cards.get(cardId);
        if (card && card.update) {
            card.update();
        }
    },
    
    updateAllCards() {
        this.cards.forEach(card => {
            if (card.update) {
                card.update();
            }
        });
    },
    
    loadAllCardModules() {
        // List of all card modules to load
        const cardModules = [
            'match-preview-card.js',
            'squad-summary-card.js',
            'training-schedule-card.js',
            'injury-report-card.js',
            'transfer-budget-card.js',
            'league-table-card.js',
            'tactical-overview-card.js',
            'financial-overview-card.js',
            'player-list-card.js',
            'transfer-targets-card.js',
            'upcoming-fixtures-card.js',
            // New integrated visualization cards
            'player-detail-card.js',
            'team-analysis-card.js',
            'tactical-shape-card.js',
            'performance-dashboard-card.js'
        ];
        
        // Load each module
        cardModules.forEach(module => {
            const script = document.createElement('script');
            script.src = `components/cards/modules/${module}`;
            script.async = false;
            document.body.appendChild(script);
        });
    }
};

// Initialize registry when DOM is ready
// Commented out - cards are loaded via script tags in HTML
// document.addEventListener('DOMContentLoaded', function() {
//     // Load all card modules
//     setTimeout(() => {
//         CardRegistry.loadAllCardModules();
//     }, 50);
// });