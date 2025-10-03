/* ==========================================
   LEAGUE TABLE CARD - Modular Component
   ========================================== */

window.LeagueTableCard = {
    id: 'league-table',
    title: 'League Table',
    pages: ['overview', 'fixtures'],
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
        const standings = this.getStandings();
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    ${standings.map(team => `
                        <tr ${team.isUs ? 'style="background: rgba(var(--primary-hue), 50%, 50%, 0.2);"' : ''}>
                            <td>${team.position}</td>
                            <td>${team.name}</td>
                            <td>${team.played}</td>
                            <td>${team.won}</td>
                            <td>${team.drawn}</td>
                            <td>${team.lost}</td>
                            <td>${team.goalDiff > 0 ? '+' : ''}${team.goalDiff}</td>
                            <td><strong>${team.points}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    getStandings() {
        return [
            { position: 1, name: 'Man City', played: 8, won: 6, drawn: 2, lost: 0, goalDiff: 12, points: 20, isUs: false },
            { position: 2, name: 'Arsenal', played: 8, won: 6, drawn: 1, lost: 1, goalDiff: 9, points: 19, isUs: false },
            { position: 3, name: 'Man United', played: 8, won: 5, drawn: 2, lost: 1, goalDiff: 6, points: 17, isUs: true },
            { position: 4, name: 'Liverpool', played: 8, won: 5, drawn: 1, lost: 2, goalDiff: 6, points: 16, isUs: false },
            { position: 5, name: 'Chelsea', played: 8, won: 4, drawn: 2, lost: 2, goalDiff: 3, points: 14, isUs: false }
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
    window.CardRegistry.register(window.LeagueTableCard);
}