/* ==========================================
   TRANSFER TARGETS CARD - Modular Component
   ========================================== */

window.TransferTargetsCard = {
    id: 'transfer-targets',
    title: 'Transfer Targets',
    pages: ['transfers'],
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
        const targets = this.getTargets();
        return `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Club</th>
                        <th>Position</th>
                        <th>Age</th>
                        <th>Value</th>
                        <th>Interest</th>
                    </tr>
                </thead>
                <tbody>
                    ${targets.map(target => `
                        <tr>
                            <td>${target.name}</td>
                            <td>${target.club}</td>
                            <td>${target.position}</td>
                            <td>${target.age}</td>
                            <td>${target.value}</td>
                            <td><span class="badge badge-${this.getInterestClass(target.interest)}">${target.interest}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    getTargets() {
        return [
            { name: 'J. Bellingham', club: 'Real Madrid', position: 'CM', age: 20, value: '€120M', interest: 'Low' },
            { name: 'F. Wirtz', club: 'Leverkusen', position: 'AM', age: 20, value: '€95M', interest: 'Medium' },
            { name: 'J. Frimpong', club: 'Leverkusen', position: 'RB', age: 23, value: '€40M', interest: 'High' },
            { name: 'A. Onana', club: 'Inter', position: 'GK', age: 27, value: '€50M', interest: 'High' }
        ];
    },
    
    getInterestClass(interest) {
        const classes = {
            'High': 'success',
            'Medium': 'warning',
            'Low': 'danger'
        };
        return classes[interest] || 'secondary';
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
    window.CardRegistry.register(window.TransferTargetsCard);
}