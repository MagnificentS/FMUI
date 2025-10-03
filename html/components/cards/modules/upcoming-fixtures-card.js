/* ==========================================
   UPCOMING FIXTURES CARD - Modular Component
   ========================================== */

window.UpcomingFixturesCard = {
    id: 'upcoming-fixtures',
    title: 'Upcoming Fixtures',
    pages: ['fixtures', 'overview'],
    size: 'wide tall',
    
    render() {
        return {
            className: 'card wide tall',
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
        const fixtures = this.getFixtures();
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Competition</th>
                        <th>Opponent</th>
                        <th>Venue</th>
                    </tr>
                </thead>
                <tbody>
                    ${fixtures.map(fixture => `
                        <tr>
                            <td>${fixture.date}</td>
                            <td>${fixture.time}</td>
                            <td>${fixture.competition}</td>
                            <td>${fixture.opponent}</td>
                            <td>${fixture.venue}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    getFixtures() {
        return [
            { date: 'Oct 21', time: '15:00', competition: 'Premier League', opponent: 'Liverpool', venue: 'Home' },
            { date: 'Oct 24', time: '20:00', competition: 'Carabao Cup', opponent: 'West Ham', venue: 'Away' },
            { date: 'Oct 28', time: '17:30', competition: 'Premier League', opponent: 'Chelsea', venue: 'Away' },
            { date: 'Nov 1', time: '20:00', competition: 'Champions League', opponent: 'Bayern Munich', venue: 'Home' },
            { date: 'Nov 4', time: '14:00', competition: 'Premier League', opponent: 'Arsenal', venue: 'Home' },
            { date: 'Nov 8', time: '20:00', competition: 'Europa League', opponent: 'Roma', venue: 'Away' }
        ];
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
    window.CardRegistry.register(window.UpcomingFixturesCard);
}