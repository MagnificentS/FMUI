/* ==========================================
   SQUAD SUMMARY CARD - Modular Component
   ========================================== */

window.SquadSummaryCard = {
    id: 'squad-summary',
    title: 'Squad Summary',
    pages: ['overview', 'squad'],
    size: 'normal',
    
    render() {
        return {
            className: 'card',
            draggable: true,
            innerHTML: `
                <div class="card-body" data-card-title="${this.title}">
                    ${this.getContent()}
                </div>
                <div class="resize-handle"></div>
                <div class="resize-handle-bl"></div>
            `
        };
    },
    
    getContent() {
        const stats = this.getSquadStats();
        return `
            <div class="squad-summary-content">
                <div class="stat-row"><span class="stat-label">Total Players</span><span class="stat-value">${stats.total}</span></div>
                <div class="stat-row"><span class="stat-label">Average Age</span><span class="stat-value">${stats.avgAge}</span></div>
                <div class="stat-row"><span class="stat-label">Injured</span><span class="stat-value" style="color: #ef4444;">${stats.injured}</span></div>
                <div class="stat-row"><span class="stat-label">Suspended</span><span class="stat-value" style="color: #facc15;">${stats.suspended}</span></div>
                <div class="stat-row"><span class="stat-label">Team Value</span><span class="stat-value">${stats.value}</span></div>
            </div>
        `;
    },
    
    getSquadStats() {
        return {
            total: 28,
            avgAge: 26.4,
            injured: 2,
            suspended: 1,
            value: '€678M'
        };
    },
    
    update() {
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
    window.CardRegistry.register(window.SquadSummaryCard);
}