/* ==========================================
   PLAYER LIST CARD - Modular Component
   ========================================== */

window.PlayerListCard = {
    id: 'player-list',
    title: 'First Team Squad',
    pages: ['squad'],
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
        const players = this.getPlayerData();
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Age</th>
                        <th>Country</th>
                        <th>Value</th>
                        <th>Contract</th>
                        <th>Fitness</th>
                    </tr>
                </thead>
                <tbody>
                    ${players.map(player => `
                        <tr>
                            <td>${player.number}</td>
                            <td>${player.name}</td>
                            <td>${player.position}</td>
                            <td>${player.age}</td>
                            <td>${player.country}</td>
                            <td>${player.value}</td>
                            <td>${player.contract}</td>
                            <td><span class="badge badge-${this.getFitnessClass(player.fitness)}">${player.fitness}%</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    getPlayerData() {
        return [
            { number: 1, name: 'D. de Gea', position: 'GK', age: 32, country: 'Spain', value: '€25M', contract: 2025, fitness: 95 },
            { number: 5, name: 'L. Martinez', position: 'CB', age: 25, country: 'Argentina', value: '€50M', contract: 2027, fitness: 96 },
            { number: 6, name: 'Casemiro', position: 'DM', age: 31, country: 'Brazil', value: '€45M', contract: 2026, fitness: 91 },
            { number: 8, name: 'B. Fernandes', position: 'AM', age: 29, country: 'Portugal', value: '€65M', contract: 2027, fitness: 93 },
            { number: 10, name: 'M. Rashford', position: 'LW', age: 26, country: 'England', value: '€85M', contract: 2028, fitness: 96 },
            { number: 9, name: 'R. Højlund', position: 'ST', age: 20, country: 'Denmark', value: '€65M', contract: 2029, fitness: 94 }
        ];
    },
    
    getFitnessClass(fitness) {
        if (fitness >= 90) return 'success';
        if (fitness >= 75) return 'warning';
        return 'danger';
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
    window.CardRegistry.register(window.PlayerListCard);
}