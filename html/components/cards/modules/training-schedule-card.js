/* ==========================================
   TRAINING SCHEDULE CARD - Modular Component
   ========================================== */

window.TrainingScheduleCard = {
    id: 'training-schedule',
    title: "This Week's Training",
    pages: ['training', 'overview'],
    size: 'wide',
    
    render() {
        return {
            className: 'card wide',
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
        const schedule = this.getWeekSchedule();
        return `
            <div class="training-schedule-content">
                ${Object.entries(schedule).map(([day, session]) => `
                    <div class="stat-row">
                        <span class="stat-label">${day}</span>
                        <span class="stat-value" style="${this.getDayStyle(session)}">${session}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    getWeekSchedule() {
        return {
            Monday: 'General - Medium',
            Tuesday: 'Match Prep - High',
            Wednesday: 'Recovery - Low',
            Thursday: 'Tactical - Medium',
            Friday: 'Set Pieces - Light',
            Saturday: 'Match Day',
            Sunday: 'Rest'
        };
    },
    
    getDayStyle(session) {
        if (session.includes('Match Day')) return 'color: var(--primary-400);';
        if (session.includes('Rest')) return 'color: #888;';
        if (session.includes('High')) return 'color: #fb923c;';
        if (session.includes('Low')) return 'color: #4ade80;';
        return '';
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
    window.CardRegistry.register(window.TrainingScheduleCard);
}