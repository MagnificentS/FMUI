/* ==========================================
   ARCHETYPE CLASSIFIER - Player archetype classification system
   ========================================== */

window.ArchetypeClassifier = class {
    constructor(options = {}) {
        this.options = {
            classificationSystem: 'modern', // 'traditional', 'modern', 'hybrid'
            showSecondaryArchetypes: true,
            confidenceThreshold: 0.6,
            ...options
        };
        
        this.archetypes = this.initializeArchetypes();
        this.element = null;
    }

    initializeArchetypes() {
        return {
            // Goalkeeper Archetypes
            'Sweeper Keeper': {
                position: ['GK'],
                key_attributes: ['distribution', 'decisions', 'anticipation', 'positioning'],
                physical_requirements: ['acceleration', 'pace'],
                description: 'A goalkeeper who acts as an additional defender, comfortable with the ball at feet',
                style: 'modern',
                color: '#4CAF50'
            },
            'Shot Stopper': {
                position: ['GK'],
                key_attributes: ['reflexes', 'agility', 'concentration', 'positioning'],
                physical_requirements: ['jumping_reach'],
                description: 'A traditional goalkeeper focused on making saves',
                style: 'traditional',
                color: '#2196F3'
            },

            // Defensive Archetypes
            'Ball Playing Defender': {
                position: ['CB', 'LB', 'RB'],
                key_attributes: ['passing', 'technique', 'vision', 'composure'],
                physical_requirements: ['pace'],
                description: 'A defender comfortable on the ball who can start attacks',
                style: 'modern',
                color: '#9C27B0'
            },
            'Stopper': {
                position: ['CB'],
                key_attributes: ['marking', 'tackling', 'heading', 'aggression'],
                physical_requirements: ['strength', 'jumping_reach'],
                description: 'A robust center-back who wins physical battles',
                style: 'traditional',
                color: '#795548'
            },
            'Full Back': {
                position: ['LB', 'RB'],
                key_attributes: ['crossing', 'tackling', 'work_rate', 'stamina'],
                physical_requirements: ['pace', 'acceleration'],
                description: 'A traditional full-back who provides width in attack and defense',
                style: 'traditional',
                color: '#607D8B'
            },
            'Wing Back': {
                position: ['LB', 'RB', 'LWB', 'RWB'],
                key_attributes: ['crossing', 'dribbling', 'work_rate', 'stamina'],
                physical_requirements: ['pace', 'acceleration', 'stamina'],
                description: 'An attacking full-back who provides constant width',
                style: 'modern',
                color: '#FF9800'
            },

            // Midfield Archetypes
            'Deep Lying Playmaker': {
                position: ['DM', 'CM'],
                key_attributes: ['passing', 'vision', 'technique', 'composure'],
                physical_requirements: [],
                description: 'A midfielder who dictates play from deep positions',
                style: 'modern',
                color: '#3F51B5'
            },
            'Box to Box Midfielder': {
                position: ['CM'],
                key_attributes: ['work_rate', 'stamina', 'tackling', 'passing'],
                physical_requirements: ['stamina', 'strength'],
                description: 'A complete midfielder who covers the entire pitch',
                style: 'traditional',
                color: '#009688'
            },
            'Ball Winning Midfielder': {
                position: ['DM', 'CM'],
                key_attributes: ['tackling', 'marking', 'aggression', 'work_rate'],
                physical_requirements: ['strength', 'stamina'],
                description: 'A defensive midfielder focused on breaking up play',
                style: 'traditional',
                color: '#F44336'
            },
            'Advanced Playmaker': {
                position: ['AM', 'CM'],
                key_attributes: ['passing', 'vision', 'technique', 'creativity'],
                physical_requirements: [],
                description: 'A creative midfielder who creates chances for forwards',
                style: 'modern',
                color: '#E91E63'
            },
            'Attacking Midfielder': {
                position: ['AM'],
                key_attributes: ['passing', 'long_shots', 'technique', 'flair'],
                physical_requirements: [],
                description: 'A midfielder who operates between the lines',
                style: 'traditional',
                color: '#FF5722'
            },

            // Forward Archetypes
            'Complete Forward': {
                position: ['ST'],
                key_attributes: ['finishing', 'heading', 'technique', 'off_the_ball'],
                physical_requirements: ['strength', 'jumping_reach'],
                description: 'A complete striker who can do everything',
                style: 'modern',
                color: '#FFD700'
            },
            'Poacher': {
                position: ['ST'],
                key_attributes: ['finishing', 'off_the_ball', 'anticipation', 'composure'],
                physical_requirements: [],
                description: 'A striker who specializes in finding space in the box',
                style: 'traditional',
                color: '#FF6B35'
            },
            'Target Man': {
                position: ['ST'],
                key_attributes: ['heading', 'strength', 'hold_up_play', 'jumping_reach'],
                physical_requirements: ['strength', 'jumping_reach'],
                description: 'A physical striker who holds up play for teammates',
                style: 'traditional',
                color: '#8B4513'
            },
            'False 9': {
                position: ['ST', 'AM'],
                key_attributes: ['passing', 'vision', 'technique', 'dribbling'],
                physical_requirements: [],
                description: 'A striker who drops deep to create space and link play',
                style: 'modern',
                color: '#DA70D6'
            },
            'Inside Forward': {
                position: ['LW', 'RW', 'AM'],
                key_attributes: ['dribbling', 'finishing', 'pace', 'acceleration'],
                physical_requirements: ['pace', 'acceleration'],
                description: 'A wide player who cuts inside to create and score',
                style: 'modern',
                color: '#00CED1'
            },
            'Winger': {
                position: ['LW', 'RW'],
                key_attributes: ['crossing', 'dribbling', 'pace', 'acceleration'],
                physical_requirements: ['pace', 'acceleration'],
                description: 'A traditional wide player who provides width and crosses',
                style: 'traditional',
                color: '#32CD32'
            }
        };
    }

    classifyPlayer(playerData) {
        if (!playerData || !playerData.attributes) {
            return {
                primary: null,
                secondary: [],
                confidence: 0,
                error: 'Insufficient player data'
            };
        }

        const playerPosition = playerData.position;
        const attributes = playerData.attributes;
        
        // Filter archetypes by position
        const relevantArchetypes = Object.entries(this.archetypes).filter(([name, archetype]) => {
            return archetype.position.some(pos => 
                playerPosition.includes(pos) || pos.includes(playerPosition)
            );
        });

        if (relevantArchetypes.length === 0) {
            return {
                primary: null,
                secondary: [],
                confidence: 0,
                error: 'No matching archetypes for position'
            };
        }

        // Calculate archetype scores
        const scores = relevantArchetypes.map(([name, archetype]) => {
            const score = this.calculateArchetypeScore(attributes, archetype);
            return {
                name,
                archetype,
                score,
                confidence: this.calculateConfidence(score, archetype)
            };
        });

        // Sort by score
        scores.sort((a, b) => b.score - a.score);

        // Filter by confidence threshold
        const validResults = scores.filter(result => 
            result.confidence >= this.options.confidenceThreshold
        );

        if (validResults.length === 0) {
            return {
                primary: scores[0] || null,
                secondary: [],
                confidence: scores[0]?.confidence || 0,
                allScores: scores
            };
        }

        return {
            primary: validResults[0],
            secondary: this.options.showSecondaryArchetypes ? validResults.slice(1, 3) : [],
            confidence: validResults[0].confidence,
            allScores: scores
        };
    }

    calculateArchetypeScore(attributes, archetype) {
        let totalScore = 0;
        let attributeCount = 0;

        // Score key attributes (weighted more heavily)
        archetype.key_attributes.forEach(attr => {
            if (attributes[attr] !== undefined) {
                totalScore += attributes[attr] * 2; // Double weight for key attributes
                attributeCount += 2;
            }
        });

        // Score physical requirements
        archetype.physical_requirements.forEach(attr => {
            if (attributes[attr] !== undefined) {
                totalScore += attributes[attr] * 1.5; // 1.5x weight for physical attributes
                attributeCount += 1.5;
            }
        });

        // Score all other relevant attributes
        const allRelevantAttrs = this.getRelevantAttributesForArchetype(archetype);
        allRelevantAttrs.forEach(attr => {
            if (attributes[attr] !== undefined && 
                !archetype.key_attributes.includes(attr) && 
                !archetype.physical_requirements.includes(attr)) {
                totalScore += attributes[attr];
                attributeCount += 1;
            }
        });

        return attributeCount > 0 ? totalScore / attributeCount : 0;
    }

    getRelevantAttributesForArchetype(archetype) {
        // Return different attributes based on position category
        const positionCategories = {
            goalkeeper: ['GK'],
            defender: ['CB', 'LB', 'RB', 'LWB', 'RWB'],
            midfielder: ['DM', 'CM', 'AM'],
            forward: ['ST', 'LW', 'RW']
        };

        for (const [category, positions] of Object.entries(positionCategories)) {
            if (archetype.position.some(pos => positions.includes(pos))) {
                return this.getAttributesByCategory(category);
            }
        }

        return [];
    }

    getAttributesByCategory(category) {
        const attributesByCategory = {
            goalkeeper: ['reflexes', 'handling', 'distribution', 'decisions', 'positioning', 'jumping_reach', 'agility'],
            defender: ['marking', 'tackling', 'heading', 'positioning', 'strength', 'jumping_reach', 'pace', 'passing'],
            midfielder: ['passing', 'vision', 'technique', 'work_rate', 'stamina', 'tackling', 'long_shots'],
            forward: ['finishing', 'dribbling', 'pace', 'acceleration', 'off_the_ball', 'heading', 'strength']
        };

        return attributesByCategory[category] || [];
    }

    calculateConfidence(score, archetype) {
        // Confidence based on score relative to maximum possible (20)
        const normalizedScore = score / 20;
        
        // Adjust confidence based on archetype complexity
        const complexity = archetype.key_attributes.length + archetype.physical_requirements.length;
        const complexityModifier = Math.min(1, complexity / 6); // Max complexity around 6 attributes
        
        return Math.min(1, normalizedScore * complexityModifier);
    }

    render(container, playerData) {
        if (!playerData) {
            console.error('ArchetypeClassifier: No player data provided');
            return;
        }

        const classification = this.classifyPlayer(playerData);
        
        this.element = document.createElement('div');
        this.element.className = 'archetype-classifier-container';
        this.element.innerHTML = this.generateHTML(classification, playerData);
        
        if (container) {
            container.appendChild(this.element);
        }

        this.attachEventHandlers(classification);
        return this.element;
    }

    generateHTML(classification, playerData) {
        if (classification.error) {
            return `
                <div class="archetype-classifier">
                    <div class="classification-error">
                        <p>Unable to classify player: ${classification.error}</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="archetype-classifier">
                <h3 class="classifier-title">Player Archetype Analysis</h3>
                ${this.renderPrimaryArchetype(classification.primary)}
                ${classification.secondary.length > 0 ? this.renderSecondaryArchetypes(classification.secondary) : ''}
                ${this.renderArchetypeComparison(classification, playerData)}
                ${this.renderConfidenceIndicator(classification.confidence)}
            </div>
        `;
    }

    renderPrimaryArchetype(primary) {
        if (!primary) return '<div class="no-classification">No suitable archetype found</div>';

        return `
            <div class="primary-archetype">
                <div class="archetype-badge primary" style="background-color: ${primary.archetype.color}">
                    <div class="archetype-name">${primary.name}</div>
                    <div class="archetype-confidence">${Math.round(primary.confidence * 100)}% match</div>
                </div>
                <div class="archetype-description">
                    <p>${primary.archetype.description}</p>
                    <div class="archetype-style">
                        <span class="style-indicator ${primary.archetype.style}">${primary.archetype.style}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderSecondaryArchetypes(secondary) {
        return `
            <div class="secondary-archetypes">
                <h4>Alternative Classifications</h4>
                <div class="secondary-grid">
                    ${secondary.map(archetype => `
                        <div class="archetype-badge secondary" style="background-color: ${archetype.archetype.color}">
                            <div class="archetype-name">${archetype.name}</div>
                            <div class="archetype-confidence">${Math.round(archetype.confidence * 100)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderArchetypeComparison(classification, playerData) {
        if (!classification.primary) return '';

        const primary = classification.primary;
        const keyAttributes = primary.archetype.key_attributes;
        const playerAttributes = playerData.attributes;

        return `
            <div class="archetype-comparison">
                <h4>Key Attribute Analysis</h4>
                <div class="attribute-comparison">
                    ${keyAttributes.map(attr => {
                        const value = playerAttributes[attr] || 0;
                        const ideal = this.getIdealValue(attr, primary.archetype);
                        const percentage = (value / ideal) * 100;
                        const status = this.getAttributeStatus(percentage);
                        
                        return `
                            <div class="comparison-item">
                                <div class="attribute-info">
                                    <span class="attr-name">${this.formatAttributeName(attr)}</span>
                                    <span class="attr-values">${value}/${ideal}</span>
                                </div>
                                <div class="comparison-bar">
                                    <div class="comparison-fill ${status}" style="width: ${Math.min(100, percentage)}%"></div>
                                </div>
                                <span class="comparison-status ${status}">${Math.round(percentage)}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    renderConfidenceIndicator(confidence) {
        const confidenceLevel = this.getConfidenceLevel(confidence);
        
        return `
            <div class="confidence-indicator">
                <div class="confidence-bar">
                    <div class="confidence-fill ${confidenceLevel}" style="width: ${confidence * 100}%"></div>
                </div>
                <div class="confidence-text">
                    Classification Confidence: <span class="${confidenceLevel}">${Math.round(confidence * 100)}%</span>
                </div>
            </div>
        `;
    }

    attachEventHandlers(classification) {
        if (!this.element) return;

        // Add click handlers for archetype badges
        const badges = this.element.querySelectorAll('.archetype-badge');
        badges.forEach(badge => {
            badge.addEventListener('click', (e) => {
                this.showArchetypeDetails(e, badge, classification);
            });
        });

        // Add hover effects for comparison items
        const comparisonItems = this.element.querySelectorAll('.comparison-item');
        comparisonItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('highlighted');
            });
            item.addEventListener('mouseleave', () => {
                item.classList.remove('highlighted');
            });
        });
    }

    showArchetypeDetails(event, badge, classification) {
        const archetypeName = badge.querySelector('.archetype-name').textContent;
        const archetype = this.archetypes[archetypeName];
        
        if (!archetype) return;

        // Create modal or tooltip with detailed information
        const modal = document.createElement('div');
        modal.className = 'archetype-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.archetype-modal').remove()">×</button>
                <div class="archetype-details">
                    <h3 style="color: ${archetype.color}">${archetypeName}</h3>
                    <p class="archetype-description">${archetype.description}</p>
                    <div class="archetype-requirements">
                        <div class="requirement-section">
                            <h4>Key Attributes</h4>
                            <ul>
                                ${archetype.key_attributes.map(attr => 
                                    `<li>${this.formatAttributeName(attr)}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="requirement-section">
                            <h4>Physical Requirements</h4>
                            <ul>
                                ${archetype.physical_requirements.map(attr => 
                                    `<li>${this.formatAttributeName(attr)}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="archetype-meta">
                        <span class="style-tag ${archetype.style}">${archetype.style} style</span>
                        <span class="position-tags">
                            ${archetype.position.map(pos => `<span class="position-tag">${pos}</span>`).join('')}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Utility methods
    formatAttributeName(attr) {
        return attr.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    getIdealValue(attribute, archetype) {
        // Return ideal values for key attributes based on archetype
        if (archetype.key_attributes.includes(attribute)) return 18;
        if (archetype.physical_requirements.includes(attribute)) return 16;
        return 14;
    }

    getAttributeStatus(percentage) {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 75) return 'good';
        if (percentage >= 60) return 'adequate';
        return 'poor';
    }

    getConfidenceLevel(confidence) {
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.6) return 'medium';
        return 'low';
    }

    // Public methods
    updateClassification(playerData) {
        if (this.element) {
            const classification = this.classifyPlayer(playerData);
            this.element.innerHTML = this.generateHTML(classification, playerData);
            this.attachEventHandlers(classification);
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    // Static utility methods
    static getAllArchetypes() {
        const classifier = new ArchetypeClassifier();
        return classifier.archetypes;
    }

    static getArchetypesByPosition(position) {
        const classifier = new ArchetypeClassifier();
        return Object.entries(classifier.archetypes).filter(([name, archetype]) => {
            return archetype.position.includes(position);
        });
    }
}

// Add CSS styles for archetype classifier
const classifierStyles = document.createElement('style');
classifierStyles.textContent = `
    .archetype-classifier-container {
        width: 100%;
        max-width: 600px;
    }

    .archetype-classifier {
        background: var(--neutral-300);
        border-radius: var(--border-radius);
        padding: 20px;
    }

    .classifier-title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: white;
        margin: 0 0 20px 0;
        text-align: center;
    }

    .classification-error {
        text-align: center;
        padding: 20px;
        color: #8892a0;
    }

    .no-classification {
        text-align: center;
        padding: 20px;
        color: #8892a0;
        font-style: italic;
    }

    /* Primary Archetype */
    .primary-archetype {
        margin-bottom: 20px;
    }

    .archetype-badge {
        padding: 15px 20px;
        border-radius: var(--border-radius);
        color: white;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .archetype-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .archetype-badge.primary {
        font-size: var(--font-size-md);
    }

    .archetype-badge.secondary {
        font-size: var(--font-size-sm);
        padding: 10px 15px;
    }

    .archetype-name {
        font-weight: 600;
        margin-bottom: 5px;
    }

    .archetype-confidence {
        font-size: var(--font-size-sm);
        opacity: 0.9;
    }

    .archetype-description {
        background: var(--neutral-200);
        padding: 15px;
        border-radius: var(--border-radius);
        margin-bottom: 15px;
    }

    .archetype-description p {
        margin: 0 0 10px 0;
        color: #8892a0;
        line-height: 1.5;
    }

    .style-indicator {
        padding: 3px 8px;
        border-radius: 3px;
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
    }

    .style-indicator.traditional {
        background: var(--neutral-400);
        color: white;
    }

    .style-indicator.modern {
        background: var(--primary-300);
        color: white;
    }

    .style-indicator.hybrid {
        background: var(--accent-300);
        color: var(--neutral-100);
    }

    /* Secondary Archetypes */
    .secondary-archetypes {
        margin-bottom: 20px;
    }

    .secondary-archetypes h4 {
        font-size: var(--font-size-md);
        color: white;
        margin: 0 0 10px 0;
    }

    .secondary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
    }

    /* Archetype Comparison */
    .archetype-comparison {
        margin-bottom: 20px;
    }

    .archetype-comparison h4 {
        font-size: var(--font-size-md);
        color: white;
        margin: 0 0 15px 0;
    }

    .attribute-comparison {
        display: grid;
        gap: 10px;
    }

    .comparison-item {
        display: grid;
        grid-template-columns: 1fr 100px 60px;
        align-items: center;
        gap: 10px;
        padding: 8px;
        background: var(--neutral-200);
        border-radius: var(--border-radius);
        transition: background-color 0.2s ease;
    }

    .comparison-item:hover,
    .comparison-item.highlighted {
        background: var(--neutral-400);
    }

    .attribute-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .attr-name {
        color: white;
        font-size: var(--font-size-sm);
    }

    .attr-values {
        color: #8892a0;
        font-size: var(--font-size-xs);
    }

    .comparison-bar {
        height: 6px;
        background: var(--neutral-400);
        border-radius: 3px;
        overflow: hidden;
    }

    .comparison-fill {
        height: 100%;
        transition: width 0.3s ease;
    }

    .comparison-fill.excellent {
        background: var(--accent-200);
    }

    .comparison-fill.good {
        background: var(--accent-300);
    }

    .comparison-fill.adequate {
        background: var(--primary-300);
    }

    .comparison-fill.poor {
        background: var(--accent-400);
    }

    .comparison-status {
        text-align: right;
        font-size: var(--font-size-xs);
        font-weight: 600;
    }

    .comparison-status.excellent {
        color: var(--accent-200);
    }

    .comparison-status.good {
        color: var(--accent-300);
    }

    .comparison-status.adequate {
        color: var(--primary-300);
    }

    .comparison-status.poor {
        color: var(--accent-400);
    }

    /* Confidence Indicator */
    .confidence-indicator {
        text-align: center;
    }

    .confidence-bar {
        width: 100%;
        height: 8px;
        background: var(--neutral-400);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    .confidence-fill {
        height: 100%;
        transition: width 0.3s ease;
    }

    .confidence-fill.high {
        background: var(--accent-200);
    }

    .confidence-fill.medium {
        background: var(--accent-300);
    }

    .confidence-fill.low {
        background: var(--accent-400);
    }

    .confidence-text {
        color: #8892a0;
        font-size: var(--font-size-sm);
    }

    .confidence-text .high {
        color: var(--accent-200);
    }

    .confidence-text .medium {
        color: var(--accent-300);
    }

    .confidence-text .low {
        color: var(--accent-400);
    }

    /* Modal Styles */
    .archetype-modal {
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

    .archetype-modal .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }

    .archetype-modal .modal-content {
        position: relative;
        background: var(--neutral-300);
        border-radius: var(--border-radius);
        max-width: 500px;
        width: 90%;
        max-height: 80%;
        overflow: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .archetype-modal .modal-close {
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

    .archetype-modal .modal-close:hover {
        color: var(--accent-400);
    }

    .archetype-details {
        padding: 30px 20px 20px;
    }

    .archetype-details h3 {
        margin: 0 0 15px 0;
        font-size: var(--font-size-lg);
    }

    .archetype-details .archetype-description {
        color: #8892a0;
        line-height: 1.5;
        margin-bottom: 20px;
        background: none;
        padding: 0;
    }

    .archetype-requirements {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .requirement-section h4 {
        color: white;
        font-size: var(--font-size-md);
        margin: 0 0 10px 0;
    }

    .requirement-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .requirement-section li {
        padding: 5px 0;
        color: #8892a0;
        border-bottom: 1px solid var(--neutral-400);
    }

    .requirement-section li:last-child {
        border-bottom: none;
    }

    .archetype-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }

    .style-tag {
        padding: 5px 10px;
        border-radius: 5px;
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
    }

    .style-tag.traditional {
        background: var(--neutral-400);
        color: white;
    }

    .style-tag.modern {
        background: var(--primary-300);
        color: white;
    }

    .position-tags {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .position-tag {
        padding: 3px 6px;
        background: var(--accent-300);
        color: var(--neutral-100);
        border-radius: 3px;
        font-size: var(--font-size-xs);
        font-weight: 600;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .secondary-grid {
            grid-template-columns: 1fr;
        }

        .comparison-item {
            grid-template-columns: 1fr;
            gap: 5px;
        }

        .archetype-requirements {
            grid-template-columns: 1fr;
        }

        .archetype-meta {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

document.head.appendChild(classifierStyles);