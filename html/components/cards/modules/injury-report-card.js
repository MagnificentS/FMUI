/* ==========================================
   INJURY REPORT CARD - Modular Component
   ========================================== */

window.InjuryReportCard = {
    id: 'injury-report',
    title: 'Injury Report',
    pages: ['training', 'squad', 'overview'],
    size: 'normal',
    
    render() {
        return {
            className: 'card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                </div>
                <div class="card-body">
                    ${this.getContent()}
                </div>
                <div class="resize-handle"></div>
            `
        };
    },
    
    getContent() {
        const injuries = this.getInjuryList();
        if (injuries.length === 0) {
            return '<div style="text-align: center; color: #4ade80;">No injuries - Full squad available</div>';
        }
        
        return `
            <div class="injury-list-content">
                ${injuries.map(injury => `
                    <div class="stat-row">
                        <span class="stat-label">${injury.player}</span>
                        <span class="stat-value" style="color: ${this.getSeverityColor(injury.severity)};">
                            ${injury.timeOut}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    getInjuryList() {
        return [
            { player: 'L. Shaw', timeOut: '2 weeks', severity: 'medium' },
            { player: 'A. Martial', timeOut: '3 days', severity: 'minor' },
            { player: 'R. Varane', timeOut: 'Available', severity: 'recovered' }
        ];
    },
    
    getSeverityColor(severity) {
        const colors = {
            'severe': '#ef4444',
            'medium': '#fb923c',
            'minor': '#facc15',
            'recovered': '#4ade80'
        };
        return colors[severity] || '#888';
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
    window.CardRegistry.register(window.InjuryReportCard);
}