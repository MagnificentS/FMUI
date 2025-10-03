/* ==========================================
   PLAYER DETAIL CARD - Integrated Player Profile with Visualizations
   ========================================== */

window.PlayerDetailCard = {
    id: 'player-detail',
    title: 'Player Profile',
    pages: ['squad', 'tactics'],
    size: 'extra-wide tall',
    
    // Selected player data (this would normally come from a selected player)
    selectedPlayer: null,
    attributeCircles: [],
    
    render() {
        return {
            className: 'card extra-wide tall player-detail-card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                    <div class="header-controls">
                        <select class="player-selector" onchange="window.PlayerDetailCard.selectPlayer(this.value)">
                            <option value="">Select Player...</option>
                            ${this.getPlayerOptions()}
                        </select>
                        <button class="expand-btn" onclick="expandCard(this)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <circle cx="12" cy="12" r="6"/>
                                <circle cx="12" cy="12" r="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    ${this.getContent()}
                </div>
                <div class="resize-handle"></div>
            `
        };
    },
    
    getContent() {
        if (!this.selectedPlayer) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">👤</div>
                    <h3>No Player Selected</h3>
                    <p>Choose a player from the dropdown to view their detailed profile and attributes.</p>
                </div>
            `;
        }
        
        return `
            <div class="player-detail-content">
                <div class="player-main-info">
                    <div class="player-overview">
                        <div class="player-photo-section">
                            <img src="${this.selectedPlayer.photo || '/assets/player-placeholder.png'}" 
                                 alt="${this.selectedPlayer.name}" 
                                 class="player-photo"
                                 onerror="this.src='/assets/player-placeholder.png'">
                            <div class="player-number">${this.selectedPlayer.number || ''}</div>
                        </div>
                        <div class="player-identity">
                            <h1 class="player-name">${this.selectedPlayer.name}</h1>
                            <div class="player-basic-info">
                                <span class="position badge badge-position">${this.selectedPlayer.position}</span>
                                <span class="age">${this.selectedPlayer.age} years</span>
                                <div class="nationality">
                                    <img src="${this.getFlagUrl(this.selectedPlayer.nationality)}" 
                                         alt="${this.selectedPlayer.nationality}" 
                                         class="flag">
                                    <span>${this.selectedPlayer.nationality}</span>
                                </div>
                            </div>
                            <div class="archetype-classification">
                                <span class="archetype-badge">${this.getPlayerArchetype()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quick-abilities">
                        <div class="ability-item">
                            <span class="ability-label">Current Ability</span>
                            <div class="ability-display">
                                <div class="ability-bar">
                                    <div class="ability-fill" style="width: ${(this.selectedPlayer.current_ability || 0) / 200 * 100}%"></div>
                                </div>
                                <span class="ability-value">${this.selectedPlayer.current_ability || 'Unknown'}</span>
                            </div>
                        </div>
                        <div class="ability-item">
                            <span class="ability-label">Potential Ability</span>
                            <div class="ability-display">
                                <div class="ability-bar potential">
                                    <div class="ability-fill" style="width: ${(this.selectedPlayer.potential_ability || 0) / 200 * 100}%"></div>
                                </div>
                                <span class="ability-value">${this.selectedPlayer.potential_ability || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="attributes-visualization">
                    <h3>Key Attributes</h3>
                    <div class="attributes-circles-container" id="player-attributes-${this.id}">
                        <!-- Attribute circles will be inserted here -->
                    </div>
                </div>
                
                <div class="performance-metrics">
                    <h3>Season Performance</h3>
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <span class="metric-label">Appearances</span>
                            <span class="metric-value">${this.selectedPlayer.performance?.appearances || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Goals</span>
                            <span class="metric-value">${this.selectedPlayer.performance?.goals || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Assists</span>
                            <span class="metric-value">${this.selectedPlayer.performance?.assists || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Avg Rating</span>
                            <span class="metric-value rating-${this.getRatingClass(this.selectedPlayer.performance?.avg_rating)}">${this.selectedPlayer.performance?.avg_rating || 'N/A'}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Minutes</span>
                            <span class="metric-value">${this.selectedPlayer.performance?.minutes || 0}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Fitness</span>
                            <span class="metric-value badge badge-${this.getFitnessClass(this.selectedPlayer.performance?.fitness)}">${this.selectedPlayer.performance?.fitness || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    getPlayerOptions() {
        const players = this.getSamplePlayers();
        return players.map(player => 
            `<option value="${player.id}" ${this.selectedPlayer?.id === player.id ? 'selected' : ''}>${player.name} (${player.position})</option>`
        ).join('');
    },
    
    getSamplePlayers() {
        return [
            {
                id: 1, name: 'Marcus Rashford', position: 'LW', age: 26, number: 10,
                nationality: 'England', current_ability: 170, potential_ability: 185,
                photo: '/assets/players/rashford.jpg',
                attributes: {
                    pace: 17, acceleration: 18, finishing: 15, dribbling: 16, technique: 14,
                    passing: 13, crossing: 12, heading: 11, tackling: 6, marking: 5,
                    composure: 14, decisions: 13, flair: 18, teamwork: 15, workRate: 16
                },
                performance: { appearances: 38, goals: 17, assists: 5, avg_rating: 7.2, minutes: 2890, fitness: 94 }
            },
            {
                id: 2, name: 'Bruno Fernandes', position: 'AM', age: 29, number: 8,
                nationality: 'Portugal', current_ability: 175, potential_ability: 175,
                photo: '/assets/players/bruno.jpg',
                attributes: {
                    pace: 12, acceleration: 13, finishing: 16, dribbling: 15, technique: 17,
                    passing: 18, crossing: 16, heading: 12, tackling: 8, marking: 7,
                    composure: 16, decisions: 17, flair: 17, teamwork: 16, workRate: 18
                },
                performance: { appearances: 45, goals: 14, assists: 13, avg_rating: 7.8, minutes: 3420, fitness: 92 }
            },
            {
                id: 3, name: 'Lisandro Martinez', position: 'CB', age: 25, number: 6,
                nationality: 'Argentina', current_ability: 165, potential_ability: 175,
                photo: '/assets/players/martinez.jpg',
                attributes: {
                    pace: 13, acceleration: 14, finishing: 6, dribbling: 12, technique: 14,
                    passing: 15, crossing: 8, heading: 13, tackling: 17, marking: 16,
                    composure: 16, decisions: 15, flair: 11, teamwork: 17, workRate: 16
                },
                performance: { appearances: 35, goals: 2, assists: 1, avg_rating: 7.4, minutes: 3150, fitness: 96 }
            }
        ];
    },
    
    selectPlayer(playerId) {
        if (!playerId) {
            this.selectedPlayer = null;
        } else {
            this.selectedPlayer = this.getSamplePlayers().find(p => p.id == playerId);
        }
        this.update();
        this.initializeAttributeCircles();
    },
    
    initializeAttributeCircles() {
        if (!this.selectedPlayer || !this.selectedPlayer.attributes) return;
        
        // Clear existing circles
        this.attributeCircles.forEach(circle => circle.destroy());
        this.attributeCircles = [];
        
        // Wait for DOM update
        setTimeout(() => {
            const container = document.getElementById(`player-attributes-${this.id}`);
            if (!container) return;
            
            // Get key attributes based on position
            const keyAttributes = this.getKeyAttributesForPosition(this.selectedPlayer.position);
            const attributeData = keyAttributes.map(attr => ({
                label: this.formatAttributeName(attr),
                value: this.selectedPlayer.attributes[attr] || 0,
                name: attr
            }));
            
            // Create attribute circles
            this.attributeCircles = window.AttributeCircle.createMultiple(
                container,
                attributeData,
                {
                    size: 45,
                    colorMode: 'performance',
                    animate: true,
                    showLabel: true,
                    showValue: true
                }
            );
            
            // Apply layout management
            if (window.LayoutManager) {
                const layout = new LayoutManager();
                layout.optimizeComponentSpacing(container);
            }
            
            // Add animation controller
            if (window.AnimationController) {
                window.AnimationController.staggerAnimate(this.attributeCircles.map(c => c.element), {
                    delay: 100,
                    duration: 800
                });
            }
        }, 100);
    },
    
    getKeyAttributesForPosition(position) {
        const positionAttributes = {
            'GK': ['handling', 'reflexes', 'distribution', 'composure', 'positioning'],
            'CB': ['heading', 'marking', 'tackling', 'composure', 'passing', 'pace'],
            'LB': ['pace', 'crossing', 'tackling', 'stamina', 'dribbling'],
            'RB': ['pace', 'crossing', 'tackling', 'stamina', 'dribbling'],
            'DM': ['tackling', 'passing', 'composure', 'workRate', 'positioning'],
            'CM': ['passing', 'technique', 'decisions', 'stamina', 'teamwork'],
            'AM': ['technique', 'passing', 'flair', 'composure', 'finishing'],
            'LW': ['pace', 'dribbling', 'crossing', 'finishing', 'flair'],
            'RW': ['pace', 'dribbling', 'crossing', 'finishing', 'flair'],
            'ST': ['finishing', 'composure', 'pace', 'heading', 'technique']
        };
        
        return positionAttributes[position] || ['pace', 'technique', 'passing', 'finishing', 'composure'];
    },
    
    getPlayerArchetype() {
        if (!this.selectedPlayer || !window.ArchetypeClassifier) {
            return 'Unknown';
        }
        
        // Use the archetype classifier if available
        return window.ArchetypeClassifier.classifyPlayer(this.selectedPlayer) || 'Balanced Player';
    },
    
    formatAttributeName(attr) {
        return attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    
    getFlagUrl(nationality) {
        return `/assets/flags/${nationality.toLowerCase().replace(/\s+/g, '-')}.png`;
    },
    
    getFitnessClass(fitness) {
        if (fitness >= 90) return 'success';
        if (fitness >= 75) return 'warning';
        return 'danger';
    },
    
    getRatingClass(rating) {
        if (rating >= 8.0) return 'excellent';
        if (rating >= 7.0) return 'good';
        if (rating >= 6.0) return 'average';
        return 'poor';
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            const selector = card.querySelector('.player-selector');
            if (body) {
                body.innerHTML = this.getContent();
                this.initializeAttributeCircles();
            }
            if (selector && this.selectedPlayer) {
                selector.value = this.selectedPlayer.id;
            }
        }
    },
    
    destroy() {
        this.attributeCircles.forEach(circle => circle.destroy());
        this.attributeCircles = [];
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.PlayerDetailCard);
}

// Add custom styles for player detail card
const playerDetailStyles = document.createElement('style');
playerDetailStyles.textContent = `
    .player-detail-card .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .header-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .player-selector {
        background: var(--neutral-400);
        border: 1px solid var(--neutral-500);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    
    .player-detail-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 20px;
        height: 100%;
    }
    
    .player-main-info {
        grid-column: 1 / -1;
        display: flex;
        gap: 20px;
        align-items: flex-start;
    }
    
    .player-overview {
        display: flex;
        gap: 15px;
        flex: 1;
    }
    
    .player-photo-section {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: var(--border-radius);
        overflow: hidden;
        border: 2px solid var(--neutral-400);
        flex-shrink: 0;
    }
    
    .player-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .player-number {
        position: absolute;
        bottom: 2px;
        right: 2px;
        background: var(--primary-300);
        color: white;
        padding: 1px 4px;
        border-radius: 2px;
        font-size: 10px;
        font-weight: 600;
    }
    
    .player-identity {
        flex: 1;
    }
    
    .player-name {
        font-size: 18px;
        font-weight: 700;
        color: white;
        margin: 0 0 8px 0;
        line-height: 1.2;
    }
    
    .player-basic-info {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        flex-wrap: wrap;
    }
    
    .nationality {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: rgba(255,255,255,0.8);
    }
    
    .flag {
        width: 16px;
        height: 12px;
        object-fit: cover;
        border-radius: 1px;
    }
    
    .archetype-classification {
        margin-top: 5px;
    }
    
    .archetype-badge {
        background: var(--accent-200);
        color: var(--neutral-100);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .quick-abilities {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 200px;
    }
    
    .ability-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .ability-label {
        font-size: 11px;
        color: #8892a0;
        font-weight: 500;
    }
    
    .ability-display {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .ability-bar {
        flex: 1;
        height: 6px;
        background: var(--neutral-400);
        border-radius: 3px;
        overflow: hidden;
    }
    
    .ability-fill {
        height: 100%;
        background: var(--primary-300);
        transition: width 0.3s ease;
    }
    
    .ability-bar.potential .ability-fill {
        background: var(--accent-300);
    }
    
    .ability-value {
        font-size: 12px;
        color: white;
        font-weight: 600;
        min-width: 30px;
    }
    
    .attributes-visualization {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .attributes-visualization h3 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .attributes-circles-container {
        min-height: 120px;
    }
    
    .performance-metrics {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
    }
    
    .performance-metrics h3 {
        margin: 0 0 15px 0;
        font-size: 14px;
        color: var(--primary-300);
        font-weight: 600;
    }
    
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 10px;
    }
    
    .metric-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 8px 4px;
        background: var(--neutral-300);
        border-radius: 4px;
    }
    
    .metric-label {
        font-size: 10px;
        color: #8892a0;
        margin-bottom: 4px;
    }
    
    .metric-value {
        font-size: 14px;
        font-weight: 600;
        color: white;
    }
    
    .rating-excellent { color: var(--accent-200); }
    .rating-good { color: var(--accent-300); }
    .rating-average { color: #8892a0; }
    .rating-poor { color: var(--accent-400); }
    
    .badge {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
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
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        text-align: center;
        color: rgba(255,255,255,0.6);
    }
    
    .empty-icon {
        font-size: 48px;
        margin-bottom: 15px;
        opacity: 0.5;
    }
    
    .empty-state h3 {
        margin: 0 0 8px 0;
        color: rgba(255,255,255,0.8);
    }
    
    .empty-state p {
        margin: 0;
        font-size: 14px;
        max-width: 300px;
        line-height: 1.4;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .player-detail-content {
            grid-template-columns: 1fr;
        }
        
        .player-main-info {
            flex-direction: column;
            gap: 15px;
        }
        
        .player-overview {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        
        .metrics-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
`;

document.head.appendChild(playerDetailStyles);