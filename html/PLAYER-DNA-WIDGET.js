/**
 * PLAYER DNA VISUALIZATION WIDGET
 * DNA-style circular player archetype analysis based on Research-Docs findings
 * 30:1 data-to-space optimization with 6 complex visualizations in 200px circle
 */

(function() {
    'use strict';

    console.log('🧬 PLAYER DNA WIDGET: Creating DNA visualization system...');

    const PlayerDNAWidget = {
        init() {
            console.log('🧬 DNA WIDGET: Initializing player DNA visualizations...');
            
            this.enhancePlayerContent();
            this.addDNAStyles();
            
            console.log('✅ PLAYER DNA WIDGET: Ready');
        },

        enhancePlayerContent() {
            console.log('🧬 Enhancing player content with DNA visualizations...');
            
            setTimeout(() => {
                this.upgradeExistingPlayerCards();
            }, 200);
        },

        upgradeExistingPlayerCards() {
            document.querySelectorAll('.card').forEach(card => {
                const cardTitle = card.querySelector('.card-header span')?.textContent || '';
                
                if (cardTitle.toLowerCase().includes('squad dna') || 
                    cardTitle.toLowerCase().includes('player') ||
                    cardTitle.toLowerCase().includes('key players') ||
                    cardTitle.toLowerCase().includes('first team')) {
                    
                    this.enhancePlayerCard(card);
                }
            });
        },

        enhancePlayerCard(card) {
            console.log('🧬 Enhancing player card with DNA visualization...');
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody && !cardBody.querySelector('.dna-visualization')) {
                // Add DNA visualization to existing content
                const existingContent = cardBody.innerHTML;
                cardBody.innerHTML = existingContent + this.createDNAVisualizationContent();
                
                setTimeout(() => {
                    this.initializeDNAInteractivity(cardBody);
                }, 100);
            }
        },

        createDNAVisualizationContent() {
            return `
                <div class="dna-visualization">
                    <div class="dna-header">
                        <h4>Squad DNA Analysis</h4>
                        <div class="dna-controls">
                            <button class="dna-player-btn active" onclick="PlayerDNAWidget.switchPlayer(this, 'bruno')">Bruno</button>
                            <button class="dna-player-btn" onclick="PlayerDNAWidget.switchPlayer(this, 'rashford')">Rashford</button>
                            <button class="dna-player-btn" onclick="PlayerDNAWidget.switchPlayer(this, 'casemiro')">Casemiro</button>
                        </div>
                    </div>
                    
                    <div class="dna-container">
                        <!-- Central archetype core (50px x 50px) -->
                        <div class="dna-center">
                            <div class="archetype-icon">🎯</div>
                            <div class="archetype-label">Advanced<br>Playmaker</div>
                            <div class="archetype-rating">95%</div>
                        </div>
                        
                        <!-- 6 complex DNA segments around the circle -->
                        <div class="dna-segment segment-technical" data-category="technical" style="transform: rotate(0deg);">
                            <div class="segment-value">92</div>
                            <div class="segment-label">Technical</div>
                            <div class="dna-helix"></div>
                        </div>
                        
                        <div class="dna-segment segment-mental" data-category="mental" style="transform: rotate(60deg);">
                            <div class="segment-value">88</div>
                            <div class="segment-label">Mental</div>
                            <div class="dna-helix"></div>
                        </div>
                        
                        <div class="dna-segment segment-physical" data-category="physical" style="transform: rotate(120deg);">
                            <div class="segment-value">75</div>
                            <div class="segment-label">Physical</div>
                            <div class="dna-helix"></div>
                        </div>
                        
                        <div class="dna-segment segment-creativity" data-category="creativity" style="transform: rotate(180deg);">
                            <div class="segment-value">95</div>
                            <div class="segment-label">Creativity</div>
                            <div class="dna-helix"></div>
                        </div>
                        
                        <div class="dna-segment segment-leadership" data-category="leadership" style="transform: rotate(240deg);">
                            <div class="segment-value">85</div>
                            <div class="segment-label">Leadership</div>
                            <div class="dna-helix"></div>
                        </div>
                        
                        <div class="dna-segment segment-consistency" data-category="consistency" style="transform: rotate(300deg);">
                            <div class="segment-value">82</div>
                            <div class="segment-label">Consistency</div>
                            <div class="dna-helix"></div>
                        </div>
                        
                        <!-- DNA connecting lines -->
                        <svg class="dna-connections" width="200" height="200" viewBox="0 0 200 200">
                            <g class="connection-lines">
                                <path d="M100,50 Q120,70 100,100 Q80,130 100,150" stroke="#0094cc" stroke-width="2" fill="none" opacity="0.6"/>
                                <path d="M150,100 Q130,80 100,100 Q70,120 50,100" stroke="#00ff88" stroke-width="2" fill="none" opacity="0.6"/>
                                <path d="M100,150 Q80,130 100,100 Q120,70 100,50" stroke="#ffb800" stroke-width="2" fill="none" opacity="0.4"/>
                            </g>
                        </svg>
                    </div>
                    
                    <div class="dna-summary">
                        <div class="player-archetype">
                            <strong>Player Archetype:</strong> Advanced Playmaker
                        </div>
                        <div class="dna-strengths">
                            <strong>DNA Strengths:</strong> Creativity (95), Technical (92), Mental (88)
                        </div>
                        <div class="development-areas">
                            <strong>Development:</strong> Physical conditioning, Pace improvement
                        </div>
                    </div>
                </div>
            `;
        },

        switchPlayer(button, playerKey) {
            const container = button.closest('.dna-visualization');
            
            // Update active button
            container.querySelectorAll('.dna-player-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Player data
            const playerData = {
                bruno: {
                    archetype: 'Advanced Playmaker',
                    icon: '🎯',
                    rating: 95,
                    segments: { technical: 92, mental: 88, physical: 75, creativity: 95, leadership: 85, consistency: 82 },
                    strengths: 'Creativity (95), Technical (92), Mental (88)',
                    development: 'Physical conditioning, Pace improvement'
                },
                rashford: {
                    archetype: 'Inside Forward',
                    icon: '⚡',
                    rating: 88,
                    segments: { technical: 85, mental: 82, physical: 88, creativity: 87, leadership: 78, consistency: 80 },
                    strengths: 'Physical (88), Creativity (87), Technical (85)',
                    development: 'Consistency, Decision making'
                },
                casemiro: {
                    archetype: 'Defensive Midfielder',
                    icon: '🛡️',
                    rating: 90,
                    segments: { technical: 80, mental: 92, physical: 85, creativity: 75, leadership: 90, consistency: 88 },
                    strengths: 'Mental (92), Leadership (90), Consistency (88)',
                    development: 'Creativity, Technical skills'
                }
            };
            
            const player = playerData[playerKey];
            if (player) {
                // Update center
                const center = container.querySelector('.dna-center');
                center.querySelector('.archetype-icon').textContent = player.icon;
                center.querySelector('.archetype-label').innerHTML = player.archetype.replace(' ', '<br>');
                center.querySelector('.archetype-rating').textContent = player.rating + '%';
                
                // Update segments
                Object.entries(player.segments).forEach(([category, value]) => {
                    const segment = container.querySelector(`.segment-${category}`);
                    if (segment) {
                        segment.querySelector('.segment-value').textContent = value;
                        
                        // Update segment color based on value
                        const hue = (value / 100) * 120; // 0 = red, 120 = green
                        segment.style.setProperty('--segment-color', `hsl(${hue}, 70%, 60%)`);
                    }
                });
                
                // Update summary
                const summary = container.querySelector('.dna-summary');
                summary.querySelector('.player-archetype strong').nextSibling.textContent = ' ' + player.archetype;
                summary.querySelector('.dna-strengths strong').nextSibling.textContent = ' ' + player.strengths;
                summary.querySelector('.development-areas strong').nextSibling.textContent = ' ' + player.development;
            }
        },

        initializeDNAInteractivity(container) {
            console.log('🧬 Initializing DNA interactivity...');
            
            // Add hover effects for segments
            const segments = container.querySelectorAll('.dna-segment');
            segments.forEach(segment => {
                segment.addEventListener('mouseenter', () => {
                    segment.classList.add('segment-hover');
                    this.showSegmentTooltip(segment);
                });
                
                segment.addEventListener('mouseleave', () => {
                    segment.classList.remove('segment-hover');
                    this.hideSegmentTooltip();
                });
            });
            
            console.log('✅ DNA interactivity initialized');
        },

        showSegmentTooltip(segment) {
            const category = segment.dataset.category;
            const value = segment.querySelector('.segment-value').textContent;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'dna-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                <div class="tooltip-value">${value}/100</div>
                <div class="tooltip-desc">${this.getCategoryDescription(category)}</div>
            `;
            
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = segment.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 10) + 'px';
        },

        hideSegmentTooltip() {
            const tooltip = document.querySelector('.dna-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        },

        getCategoryDescription(category) {
            const descriptions = {
                technical: 'Ball control, passing, shooting accuracy',
                mental: 'Decision making, composure, concentration', 
                physical: 'Pace, strength, stamina, jumping',
                creativity: 'Vision, flair, unpredictability',
                leadership: 'Influence, communication, example',
                consistency: 'Reliability, form maintenance'
            };
            return descriptions[category] || 'Player attribute category';
        },

        addDNAStyles() {
            const dnaCSS = `
                /* Player DNA Visualization Styles */
                .dna-visualization {
                    margin-top: 16px;
                    padding-top: 12px;
                    border-top: 2px solid rgba(0, 148, 204, 0.3);
                }
                
                .dna-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .dna-header h4 {
                    margin: 0;
                    font-size: 12px;
                    color: #0094cc;
                    font-weight: 600;
                }
                
                .dna-controls {
                    display: flex;
                    gap: 4px;
                }
                
                .dna-player-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .dna-player-btn:hover {
                    background: rgba(0, 148, 204, 0.2);
                    color: white;
                }
                
                .dna-player-btn.active {
                    background: var(--primary-400);
                    color: white;
                    border-color: var(--primary-400);
                }
                
                .dna-container {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    margin: 0 auto;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0, 148, 204, 0.1), transparent);
                }
                
                .dna-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, var(--primary-400), var(--primary-300));
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    box-shadow: 0 4px 12px rgba(0, 148, 204, 0.4);
                }
                
                .archetype-icon {
                    font-size: 14px;
                    margin-bottom: 2px;
                }
                
                .archetype-label {
                    font-size: 5px;
                    font-weight: 600;
                    color: white;
                    text-align: center;
                    line-height: 1;
                    margin-bottom: 1px;
                }
                
                .archetype-rating {
                    font-size: 4px;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 600;
                }
                
                .dna-segment {
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    transform-origin: 50% 80px;
                    width: 30px;
                    height: 60px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .dna-segment:hover {
                    transform: scale(1.1) rotate(var(--rotation, 0deg));
                }
                
                .segment-technical { --segment-color: hsl(110, 70%, 60%); }
                .segment-mental { --segment-color: hsl(105, 70%, 60%); }
                .segment-physical { --segment-color: hsl(90, 70%, 60%); }
                .segment-creativity { --segment-color: hsl(114, 70%, 60%); }
                .segment-leadership { --segment-color: hsl(102, 70%, 60%); }
                .segment-consistency { --segment-color: hsl(98, 70%, 60%); }
                
                .segment-value {
                    width: 24px;
                    height: 24px;
                    background: var(--segment-color);
                    border: 2px solid white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    font-weight: 600;
                    color: white;
                    margin: 0 auto 4px auto;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                }
                
                .segment-label {
                    font-size: 6px;
                    color: rgba(255, 255, 255, 0.8);
                    text-align: center;
                    line-height: 1;
                }
                
                .dna-helix {
                    position: absolute;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: 30px;
                    background: linear-gradient(to bottom, var(--segment-color), transparent);
                    opacity: 0.6;
                }
                
                .dna-connections {
                    position: absolute;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    opacity: 0.4;
                }
                
                .dna-summary {
                    margin-top: 16px;
                    font-size: 9px;
                    line-height: 1.3;
                }
                
                .dna-summary > div {
                    margin-bottom: 4px;
                }
                
                .dna-summary strong {
                    color: #0094cc;
                }
                
                /* DNA Tooltip */
                .dna-tooltip {
                    position: fixed;
                    background: rgba(0, 20, 30, 0.95);
                    border: 1px solid rgba(0, 148, 204, 0.3);
                    border-radius: 6px;
                    padding: 8px;
                    color: white;
                    font-size: 10px;
                    z-index: 1000;
                    pointer-events: none;
                    transform: translateX(-50%) translateY(-100%);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }
                
                .tooltip-title {
                    font-weight: 600;
                    color: #0094cc;
                    margin-bottom: 2px;
                }
                
                .tooltip-value {
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .tooltip-desc {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 8px;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'player-dna-styles';
            style.textContent = dnaCSS;
            document.head.appendChild(style);
            
            console.log('✅ Player DNA styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => PlayerDNAWidget.init(), 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => PlayerDNAWidget.init(), 500);
        });
    }

    // Make available globally
    window.PlayerDNAWidget = PlayerDNAWidget;

})();