/* ==========================================
   MATCH PREVIEW CARD - Modular Component
   ========================================== */

window.MatchPreviewCard = {
    id: 'match-preview',
    title: 'Match Preview',
    pages: ['overview', 'fixtures'],
    size: 'normal',
    
    render() {
        return {
            className: 'card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <button class="expand-btn" onclick="expandCard(this)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="6"/>
                            <circle cx="12" cy="12" r="2"/>
                        </svg>
                    </button>
                </div>
                <div class="card-body">
                    ${this.getContent()}
                </div>
                <div class="resize-handle"></div>
            `
        };
    },
    
    getContent() {
        const nextMatch = this.getNextMatch();
        return `
            <div class="match-preview-content">
                <div class="stat-row"><span class="stat-label">Opponent</span><span class="stat-value">${nextMatch.opponent}</span></div>
                <div class="stat-row"><span class="stat-label">Competition</span><span class="stat-value">${nextMatch.competition}</span></div>
                <div class="stat-row"><span class="stat-label">Venue</span><span class="stat-value">${nextMatch.venue}</span></div>
                <div class="stat-row"><span class="stat-label">Date</span><span class="stat-value">${nextMatch.date}</span></div>
                <div class="stat-row"><span class="stat-label">Form</span><span class="stat-value">${nextMatch.form}</span></div>
            </div>
        `;
    },
    
    getNextMatch() {
        // In real app, this would fetch from data source
        return {
            opponent: 'Liverpool',
            competition: 'Premier League',
            venue: 'Home',
            date: 'Oct 21, 3:00 PM',
            form: 'WWDLW'
        };
    },
    
    update() {
        // Called to refresh card data
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.getContent();
            }
        }
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.MatchPreviewCard);
}