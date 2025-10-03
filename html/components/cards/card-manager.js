/* ==========================================
   CARD MANAGER - Fixed expansion toggle & dots
   ========================================== */

// Override the expandCard function to properly toggle
window.CardManager = {
    expandedCard: null,
    
    expandCard(button) {
        const card = button.closest('.card');
        const container = card.parentElement;
        const cards = [...container.querySelectorAll('.card')];
        
        // Get current page context
        const currentPage = card.closest('.content-page');
        if (!currentPage) return;
        
        // If this card is already expanded, collapse it
        if (this.expandedCard === card) {
            this.collapseCard();
            return;
        }
        
        // Otherwise expand this card
        this.expandedCard = card;
        card.classList.add('expanded');
        
        // Switch views ONLY in current page
        const gridView = currentPage.querySelector('#grid-view');
        const singleView = currentPage.querySelector('#single-view');
        
        if (gridView && singleView) {
            gridView.classList.remove('active');
            singleView.classList.add('active');
        }
        
        // Create indicators with tooltips
        this.createIndicators(cards, card);
        
        // Clone card to single view
        const singleContainer = document.querySelector('#single-view .tile-container');
        if (singleContainer) {
            singleContainer.innerHTML = '';
            const clonedCard = card.cloneNode(true);
            
            // Fix the expand button on cloned card to collapse
            const expandBtn = clonedCard.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.onclick = () => this.collapseCard();
            }
            
            singleContainer.appendChild(clonedCard);
        }
    },
    
    collapseCard() {
        if (this.expandedCard) {
            // Get current page context
            const currentPage = this.expandedCard.closest('.content-page');
            
            this.expandedCard.classList.remove('expanded');
            this.expandedCard = null;
            
            if (!currentPage) return;
            
            // Switch back to grid view ONLY in current page
            const gridView = currentPage.querySelector('#grid-view');
            const singleView = currentPage.querySelector('#single-view');
            
            if (gridView && singleView) {
                gridView.classList.add('active');
                singleView.classList.remove('active');
            }
            
            // Hide indicators
            const indicators = document.getElementById('cardIndicators');
            if (indicators) {
                indicators.classList.remove('active');
            }
        }
    },
    
    createIndicators(cards, activeCard) {
        const indicators = document.getElementById('cardIndicators');
        if (!indicators) return;
        
        // Build indicator HTML with tooltips
        let html = '';
        cards.forEach((card, index) => {
            const titleElement = card.querySelector('.card-header span');
            const title = titleElement ? titleElement.textContent : `Card ${index + 1}`;
            const isActive = card === activeCard ? 'active' : '';
            
            html += `<div class="card-indicator ${isActive}" 
                         data-tooltip="${title}"
                         onclick="CardManagerFixed.selectCard(${index})"
                         style="position: relative;">
                         ${index + 1}
                         <span class="indicator-tooltip">${title}</span>
                     </div>`;
        });
        
        indicators.innerHTML = html;
        indicators.classList.add('active');
        
        // Add tooltip styles if not present
        this.ensureTooltipStyles();
    },
    
    selectCard(index) {
        const container = document.querySelector('#grid-view .tile-container');
        if (!container) return;
        
        const cards = [...container.querySelectorAll('.card')];
        const selectedCard = cards[index];
        
        if (selectedCard && selectedCard !== this.expandedCard) {
            // Update expanded card reference
            if (this.expandedCard) {
                this.expandedCard.classList.remove('expanded');
            }
            
            this.expandedCard = selectedCard;
            selectedCard.classList.add('expanded');
            
            // Update indicators
            document.querySelectorAll('.card-indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
            
            // Update single view
            const singleContainer = document.querySelector('#single-view .tile-container');
            if (singleContainer) {
                singleContainer.innerHTML = '';
                const clonedCard = selectedCard.cloneNode(true);
                
                const expandBtn = clonedCard.querySelector('.expand-btn');
                if (expandBtn) {
                    expandBtn.onclick = () => this.collapseCard();
                }
                
                singleContainer.appendChild(clonedCard);
            }
        }
    },
    
    ensureTooltipStyles() {
        // Check if tooltip styles exist
        if (!document.getElementById('tooltip-styles')) {
            const style = document.createElement('style');
            style.id = 'tooltip-styles';
            style.textContent = `
                .indicator-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--neutral-100, #0a0b0d);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 3px;
                    font-size: 10px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    margin-bottom: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    z-index: 1000;
                }
                
                .card-indicator:hover .indicator-tooltip {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Replace the global expandCard function
window.expandCard = function(button) {
    CardManagerFixed.expandCard(button);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Replace all expand button onclick handlers
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.onclick = function() {
            CardManagerFixed.expandCard(this);
        };
    });
});