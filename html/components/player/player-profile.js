/* ==========================================
   PLAYER PROFILE - Comprehensive player profile display
   ========================================== */

window.PlayerProfile = class {
    constructor(playerData, options = {}) {
        this.playerData = playerData;
        this.options = {
            showAttributes: true,
            showPerformance: true,
            showContract: true,
            showMedia: true,
            ...options
        };
        this.element = null;
        this.attributeCategories = {
            technical: ['crossing', 'dribbling', 'finishing', 'first_touch', 'free_kick_taking', 'heading', 'long_shots', 'long_throws', 'marking', 'passing', 'penalty_taking', 'tackling', 'technique'],
            mental: ['aggression', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions', 'determination', 'flair', 'leadership', 'off_the_ball', 'positioning', 'teamwork', 'vision', 'work_rate'],
            physical: ['acceleration', 'agility', 'balance', 'jumping_reach', 'natural_fitness', 'pace', 'stamina', 'strength']
        };
    }

    render(container) {
        if (!this.playerData) {
            console.error('PlayerProfile: No player data provided');
            return;
        }

        this.element = document.createElement('div');
        this.element.className = 'player-profile-container';
        this.element.innerHTML = this.generateHTML();
        
        if (container) {
            container.appendChild(this.element);
        }

        this.attachEventHandlers();
        return this.element;
    }

    generateHTML() {
        return `
            <div class="player-profile">
                ${this.renderBasicInfo()}
                ${this.options.showAttributes ? this.renderAttributes() : ''}
                ${this.options.showPerformance ? this.renderPerformance() : ''}
                ${this.options.showContract ? this.renderContract() : ''}
                ${this.options.showMedia ? this.renderMedia() : ''}
            </div>
        `;
    }

    renderBasicInfo() {
        const player = this.playerData;
        return `
            <div class="profile-section basic-info">
                <div class="player-header">
                    <div class="player-photo">
                        <img src="${player.photo || '/assets/player-placeholder.png'}" 
                             alt="${player.name}" 
                             onerror="this.src='/assets/player-placeholder.png'">
                        <div class="player-number">${player.number || ''}</div>
                    </div>
                    <div class="player-identity">
                        <h1 class="player-name">${player.name}</h1>
                        <div class="player-details">
                            <span class="position badge badge-position">${player.position}</span>
                            <span class="age">${player.age} years</span>
                            <div class="nationality">
                                <img src="${this.getFlagUrl(player.nationality)}" 
                                     alt="${player.nationality}" 
                                     class="flag">
                                <span>${player.nationality}</span>
                            </div>
                        </div>
                        <div class="player-club">
                            <img src="${player.club_logo || '/assets/club-placeholder.png'}" 
                                 alt="${player.club}" 
                                 class="club-logo">
                            <span class="club-name">${player.club}</span>
                        </div>
                    </div>
                </div>
                <div class="quick-stats">
                    <div class="stat-item">
                        <span class="stat-label">Current Ability</span>
                        <div class="stat-value">
                            <div class="ability-bar">
                                <div class="ability-fill" style="width: ${(player.current_ability || 0) / 200 * 100}%"></div>
                            </div>
                            <span class="ability-text">${player.current_ability || 'Unknown'}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Potential Ability</span>
                        <div class="stat-value">
                            <div class="ability-bar">
                                <div class="ability-fill potential" style="width: ${(player.potential_ability || 0) / 200 * 100}%"></div>
                            </div>
                            <span class="ability-text">${player.potential_ability || 'Unknown'}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Preferred Foot</span>
                        <span class="stat-value">${player.preferred_foot || 'Right'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Height / Weight</span>
                        <span class="stat-value">${player.height || 'Unknown'} / ${player.weight || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderAttributes() {
        const player = this.playerData;
        if (!player.attributes) return '';

        return `
            <div class="profile-section attributes-section">
                <h2 class="section-title">Attributes</h2>
                <div class="attributes-container">
                    ${Object.entries(this.attributeCategories).map(([category, attributes]) => `
                        <div class="attribute-category">
                            <h3 class="category-title">${this.formatCategoryName(category)}</h3>
                            <div class="attribute-grid">
                                ${attributes.map(attr => {
                                    const value = player.attributes[attr] || 0;
                                    return `
                                        <div class="attribute-item">
                                            <span class="attribute-name">${this.formatAttributeName(attr)}</span>
                                            <div class="attribute-bar">
                                                <div class="attribute-fill" style="width: ${value * 5}%"></div>
                                                <span class="attribute-value">${value}</span>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPerformance() {
        const player = this.playerData;
        const performance = player.performance || {};
        
        return `
            <div class="profile-section performance-section">
                <h2 class="section-title">Performance Statistics</h2>
                <div class="performance-grid">
                    <div class="performance-item">
                        <span class="perf-label">Appearances</span>
                        <span class="perf-value">${performance.appearances || 0}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Goals</span>
                        <span class="perf-value">${performance.goals || 0}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Assists</span>
                        <span class="perf-value">${performance.assists || 0}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Average Rating</span>
                        <span class="perf-value rating-${this.getRatingClass(performance.avg_rating)}">${performance.avg_rating || 'N/A'}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Yellow Cards</span>
                        <span class="perf-value">${performance.yellow_cards || 0}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Red Cards</span>
                        <span class="perf-value">${performance.red_cards || 0}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Minutes Played</span>
                        <span class="perf-value">${performance.minutes || 0}</span>
                    </div>
                    <div class="performance-item">
                        <span class="perf-label">Fitness</span>
                        <span class="perf-value badge badge-${this.getFitnessClass(performance.fitness)}">${performance.fitness || 0}%</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderContract() {
        const player = this.playerData;
        const contract = player.contract || {};
        
        return `
            <div class="profile-section contract-section">
                <h2 class="section-title">Contract & Value</h2>
                <div class="contract-grid">
                    <div class="contract-item">
                        <span class="contract-label">Current Value</span>
                        <span class="contract-value value-amount">${player.value || 'Unknown'}</span>
                    </div>
                    <div class="contract-item">
                        <span class="contract-label">Contract Expires</span>
                        <span class="contract-value">${contract.expires || 'Unknown'}</span>
                    </div>
                    <div class="contract-item">
                        <span class="contract-label">Weekly Wage</span>
                        <span class="contract-value">${contract.wage || 'Unknown'}</span>
                    </div>
                    <div class="contract-item">
                        <span class="contract-label">Release Clause</span>
                        <span class="contract-value">${contract.release_clause || 'None'}</span>
                    </div>
                    <div class="contract-item">
                        <span class="contract-label">Squad Status</span>
                        <span class="contract-value badge badge-status">${player.squad_status || 'First Team'}</span>
                    </div>
                    <div class="contract-item">
                        <span class="contract-label">Injury Status</span>
                        <span class="contract-value badge badge-${this.getInjuryClass(player.injury_status)}">${player.injury_status || 'Fit'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderMedia() {
        const player = this.playerData;
        
        return `
            <div class="profile-section media-section">
                <h2 class="section-title">Media & Personality</h2>
                <div class="media-grid">
                    <div class="media-item">
                        <span class="media-label">Personality</span>
                        <span class="media-value">${player.personality || 'Unknown'}</span>
                    </div>
                    <div class="media-item">
                        <span class="media-label">Media Handling</span>
                        <span class="media-value">${player.media_handling || 'Unknown'}</span>
                    </div>
                    <div class="media-item">
                        <span class="media-label">Pressure Handling</span>
                        <span class="media-value">${player.pressure_handling || 'Unknown'}</span>
                    </div>
                    <div class="media-item">
                        <span class="media-label">Injury Proneness</span>
                        <span class="media-value">${player.injury_proneness || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventHandlers() {
        if (!this.element) return;

        // Add click handlers for expandable sections
        const sectionTitles = this.element.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            title.addEventListener('click', (e) => {
                const section = e.target.closest('.profile-section');
                section.classList.toggle('collapsed');
            });
        });

        // Add attribute hover tooltips
        const attributeItems = this.element.querySelectorAll('.attribute-item');
        attributeItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.showAttributeTooltip(e, item);
            });
            item.addEventListener('mouseleave', () => {
                this.hideAttributeTooltip();
            });
        });
    }

    showAttributeTooltip(event, attributeItem) {
        const attributeName = attributeItem.querySelector('.attribute-name').textContent;
        const attributeValue = attributeItem.querySelector('.attribute-value').textContent;
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'attribute-tooltip';
        tooltip.innerHTML = `
            <strong>${attributeName}</strong><br>
            Value: ${attributeValue}/20<br>
            ${this.getAttributeDescription(attributeName)}
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = attributeItem.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
        
        this.currentTooltip = tooltip;
    }

    hideAttributeTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    getAttributeDescription(attributeName) {
        const descriptions = {
            'Crossing': 'Ability to deliver crosses from wide positions',
            'Dribbling': 'Ability to beat opponents with the ball',
            'Finishing': 'Ability to score goals from inside the penalty area',
            'First Touch': 'Ability to control the ball when receiving passes',
            'Free Kick Taking': 'Ability to take direct free kicks',
            'Heading': 'Ability to play the ball with the head',
            'Long Shots': 'Ability to score from outside the penalty area',
            'Marking': 'Ability to mark opposing players defensively',
            'Passing': 'General passing ability and accuracy',
            'Penalty Taking': 'Ability to score from penalty kicks',
            'Tackling': 'Ability to win the ball from opponents',
            'Technique': 'Technical ability with the ball'
        };
        return descriptions[attributeName] || 'No description available';
    }

    // Utility methods
    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatAttributeName(attr) {
        return attr.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    getFlagUrl(nationality) {
        return `/assets/flags/${nationality.toLowerCase().replace(/\s+/g, '-')}.png`;
    }

    getFitnessClass(fitness) {
        if (fitness >= 90) return 'success';
        if (fitness >= 75) return 'warning';
        return 'danger';
    }

    getRatingClass(rating) {
        if (rating >= 8.0) return 'excellent';
        if (rating >= 7.0) return 'good';
        if (rating >= 6.0) return 'average';
        return 'poor';
    }

    getInjuryClass(status) {
        if (!status || status === 'Fit') return 'success';
        if (status.includes('Minor')) return 'warning';
        return 'danger';
    }

    // Public methods
    updatePlayer(newPlayerData) {
        this.playerData = { ...this.playerData, ...newPlayerData };
        if (this.element) {
            this.element.innerHTML = this.generateHTML();
            this.attachEventHandlers();
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        this.hideAttributeTooltip();
    }

    // Static method for creating modal player profiles
    static showModal(playerData, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'player-profile-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.player-profile-modal').remove()">×</button>
                <div class="modal-body"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const profile = new PlayerProfile(playerData, options);
        const modalBody = modal.querySelector('.modal-body');
        profile.render(modalBody);
        
        return { modal, profile };
    }
}

// Add CSS styles for player profile
const profileStyles = document.createElement('style');
profileStyles.textContent = `
    .player-profile-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }

    .player-profile {
        background: var(--neutral-300);
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    .profile-section {
        border-bottom: 1px solid var(--neutral-400);
        padding: 20px;
    }

    .profile-section:last-child {
        border-bottom: none;
    }

    .section-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: #fff;
        margin: 0 0 15px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section-title::after {
        content: '▼';
        transition: transform 0.2s ease;
    }

    .profile-section.collapsed .section-title::after {
        transform: rotate(-90deg);
    }

    .profile-section.collapsed > *:not(.section-title) {
        display: none;
    }

    /* Basic Info Styles */
    .player-header {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
    }

    .player-photo {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: var(--border-radius);
        overflow: hidden;
        border: 2px solid var(--neutral-400);
    }

    .player-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .player-number {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: var(--primary-300);
        color: white;
        padding: 2px 6px;
        border-radius: 2px;
        font-size: var(--font-size-sm);
        font-weight: 600;
    }

    .player-identity {
        flex: 1;
    }

    .player-name {
        font-size: var(--font-size-xl);
        font-weight: 700;
        color: white;
        margin: 0 0 10px 0;
    }

    .player-details {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
        flex-wrap: wrap;
    }

    .nationality {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .flag {
        width: 20px;
        height: 15px;
        object-fit: cover;
        border-radius: 2px;
    }

    .player-club {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .club-logo {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }

    .quick-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .stat-label {
        font-size: var(--font-size-sm);
        color: #8892a0;
    }

    .stat-value {
        color: white;
        font-weight: 500;
    }

    .ability-bar {
        width: 100%;
        height: 8px;
        background: var(--neutral-400);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 2px;
    }

    .ability-fill {
        height: 100%;
        background: var(--primary-300);
        transition: width 0.3s ease;
    }

    .ability-fill.potential {
        background: var(--accent-300);
    }

    /* Attributes Styles */
    .attributes-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .attribute-category {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }

    .category-title {
        font-size: var(--font-size-md);
        font-weight: 600;
        color: var(--primary-300);
        margin: 0 0 10px 0;
    }

    .attribute-grid {
        display: grid;
        gap: 8px;
    }

    .attribute-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border-radius: 2px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .attribute-item:hover {
        background: var(--neutral-400);
    }

    .attribute-name {
        font-size: var(--font-size-sm);
        color: #8892a0;
        flex: 1;
    }

    .attribute-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100px;
    }

    .attribute-fill {
        height: 4px;
        background: var(--primary-300);
        border-radius: 2px;
        flex: 1;
        transition: width 0.3s ease;
    }

    .attribute-value {
        font-size: var(--font-size-sm);
        color: white;
        font-weight: 500;
        min-width: 20px;
        text-align: right;
    }

    /* Performance Styles */
    .performance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .performance-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
        text-align: center;
        padding: 10px;
        background: var(--neutral-200);
        border-radius: var(--border-radius);
    }

    .perf-label {
        font-size: var(--font-size-sm);
        color: #8892a0;
    }

    .perf-value {
        font-size: var(--font-size-md);
        font-weight: 600;
        color: white;
    }

    .rating-excellent { color: var(--accent-200); }
    .rating-good { color: var(--accent-300); }
    .rating-average { color: #8892a0; }
    .rating-poor { color: var(--accent-400); }

    /* Contract Styles */
    .contract-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .contract-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: var(--neutral-200);
        border-radius: var(--border-radius);
    }

    .contract-label {
        font-size: var(--font-size-sm);
        color: #8892a0;
    }

    .contract-value {
        font-weight: 500;
        color: white;
    }

    .value-amount {
        color: var(--accent-300);
        font-weight: 600;
    }

    /* Media Styles */
    .media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .media-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: var(--neutral-200);
        border-radius: var(--border-radius);
    }

    .media-label {
        font-size: var(--font-size-sm);
        color: #8892a0;
    }

    .media-value {
        font-weight: 500;
        color: white;
    }

    /* Badges */
    .badge {
        padding: 2px 8px;
        border-radius: 3px;
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
    }

    .badge-position {
        background: var(--primary-300);
        color: white;
    }

    .badge-success {
        background: var(--accent-200);
        color: var(--neutral-100);
    }

    .badge-warning {
        background: var(--accent-300);
        color: var(--neutral-100);
    }

    .badge-danger {
        background: var(--accent-400);
        color: white;
    }

    .badge-status {
        background: var(--neutral-400);
        color: white;
    }

    /* Tooltip */
    .attribute-tooltip {
        position: absolute;
        background: var(--neutral-100);
        color: white;
        padding: 8px 12px;
        border-radius: var(--border-radius);
        font-size: var(--font-size-sm);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 200px;
        border: 1px solid var(--neutral-400);
    }

    /* Modal Styles */
    .player-profile-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }

    .modal-content {
        position: relative;
        background: var(--neutral-300);
        border-radius: var(--border-radius);
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
    }

    .modal-close:hover {
        color: var(--accent-400);
    }

    .modal-body {
        padding: 20px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .player-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .player-details {
            justify-content: center;
        }

        .attributes-container {
            grid-template-columns: 1fr;
        }

        .quick-stats,
        .performance-grid,
        .contract-grid,
        .media-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(profileStyles);