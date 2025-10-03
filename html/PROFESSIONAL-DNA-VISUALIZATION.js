/**
 * PROFESSIONAL DNA VISUALIZATION SYSTEM
 * Implementing Research-Docs 30:1 data compression with circular spatial architecture
 * 6 complex visualizations in 200px diameter with 50px interactive core
 */

(function() {
    'use strict';

    console.log('🧬 PROFESSIONAL DNA: Creating Research-Docs compliant DNA visualization...');

    const ProfessionalDNAVisualization = {
        // Research-Docs specifications
        CIRCLE_DIAMETER: 200,
        CENTER_CORE_SIZE: 50,
        SEGMENTS: 6,
        DATA_COMPRESSION_RATIO: 30, // 30:1 as per Research-Docs

        init() {
            console.log('🧬 DNA SYSTEM: Implementing 30:1 data compression visualization...');
            
            this.enhanceSquadContent();
            this.addProfessionalDNAStyles();
            
            console.log('✅ PROFESSIONAL DNA VISUALIZATION: Ready');
        },

        enhanceSquadContent() {
            console.log('🧬 Enhancing squad content with professional DNA visualization...');
            
            setTimeout(() => {
                this.addDNAToSquadCards();
            }, 300);
        },

        addDNAToSquadCards() {
            // Add DNA visualization to Squad cards
            document.querySelectorAll('.card').forEach(card => {
                const cardTitle = card.querySelector('.card-header span')?.textContent || '';
                
                if (cardTitle.toLowerCase().includes('first team') ||
                    cardTitle.toLowerCase().includes('squad') ||
                    cardTitle.toLowerCase().includes('starting xi')) {
                    
                    this.addProfessionalDNAToCard(card);
                }
            });
        },

        addProfessionalDNAToCard(card) {
            console.log('🧬 Adding professional DNA visualization to card...');
            
            const cardBody = card.querySelector('.card-body');
            if (cardBody && !cardBody.querySelector('.professional-dna-system')) {
                
                // Add DNA visualization as enhancement to existing content
                const dnaHTML = this.createProfessionalDNASystem();
                cardBody.innerHTML += dnaHTML;
                
                setTimeout(() => {
                    this.initializeDNAInteractivity(cardBody);
                }, 100);
            }
        },

        createProfessionalDNASystem() {
            return `
                <div class="professional-dna-system">
                    <div class="dna-system-header">
                        <h3>Squad DNA Analysis</h3>
                        <div class="player-selector">
                            <button class="dna-player-select active" data-player="bruno" onclick="ProfessionalDNAVisualization.switchPlayer('bruno', this)">Bruno</button>
                            <button class="dna-player-select" data-player="rashford" onclick="ProfessionalDNAVisualization.switchPlayer('rashford', this)">Rashford</button>
                            <button class="dna-player-select" data-player="casemiro" onclick="ProfessionalDNAVisualization.switchPlayer('casemiro', this)">Casemiro</button>
                        </div>
                    </div>
                    
                    <div class="dna-visualization-container">
                        <svg class="dna-circle" width="200" height="200" viewBox="0 0 200 200">
                            <!-- Background circle with gradient -->
                            <defs>
                                <radialGradient id="dnaBackgroundGradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" style="stop-color:rgba(0,148,204,0.1);stop-opacity:1" />
                                    <stop offset="70%" style="stop-color:rgba(0,148,204,0.05);stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
                                </radialGradient>
                                
                                <!-- DNA helix gradient -->
                                <linearGradient id="helixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#0094cc;stop-opacity:0.8" />
                                    <stop offset="50%" style="stop-color:#00ff88;stop-opacity:0.6" />
                                    <stop offset="100%" style="stop-color:#ffb800;stop-opacity:0.4" />
                                </linearGradient>
                            </defs>
                            
                            <!-- Background -->
                            <circle cx="100" cy="100" r="95" fill="url(#dnaBackgroundGradient)" stroke="rgba(0,148,204,0.2)" stroke-width="1"/>
                            
                            <!-- Performance rings -->
                            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                            <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                            <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                            
                            <!-- DNA segments (6 segments at 60° intervals) -->
                            <g class="dna-segments">
                                <!-- Technical segment (0°) -->
                                <g class="dna-segment" data-category="technical" transform="rotate(0 100 100)">
                                    <path d="M 100,20 L 100,50" stroke="url(#helixGradient)" stroke-width="3"/>
                                    <circle cx="100" cy="30" r="12" fill="#0094cc" stroke="white" stroke-width="2"/>
                                    <text x="100" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="600">92</text>
                                    <text x="100" y="15" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6">Technical</text>
                                </g>
                                
                                <!-- Mental segment (60°) -->
                                <g class="dna-segment" data-category="mental" transform="rotate(60 100 100)">
                                    <path d="M 100,20 L 100,50" stroke="url(#helixGradient)" stroke-width="3"/>
                                    <circle cx="100" cy="30" r="12" fill="#00ff88" stroke="white" stroke-width="2"/>
                                    <text x="100" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="600">88</text>
                                    <text x="100" y="15" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6">Mental</text>
                                </g>
                                
                                <!-- Physical segment (120°) -->
                                <g class="dna-segment" data-category="physical" transform="rotate(120 100 100)">
                                    <path d="M 100,20 L 100,50" stroke="url(#helixGradient)" stroke-width="3"/>
                                    <circle cx="100" cy="30" r="12" fill="#ffb800" stroke="white" stroke-width="2"/>
                                    <text x="100" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="600">75</text>
                                    <text x="100" y="15" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6">Physical</text>
                                </g>
                                
                                <!-- Creativity segment (180°) -->
                                <g class="dna-segment" data-category="creativity" transform="rotate(180 100 100)">
                                    <path d="M 100,20 L 100,50" stroke="url(#helixGradient)" stroke-width="3"/>
                                    <circle cx="100" cy="30" r="12" fill="#ff6b35" stroke="white" stroke-width="2"/>
                                    <text x="100" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="600">95</text>
                                    <text x="100" y="15" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6">Creative</text>
                                </g>
                                
                                <!-- Leadership segment (240°) -->
                                <g class="dna-segment" data-category="leadership" transform="rotate(240 100 100)">
                                    <path d="M 100,20 L 100,50" stroke="url(#helixGradient)" stroke-width="3"/>
                                    <circle cx="100" cy="30" r="12" fill="#ff4757" stroke="white" stroke-width="2"/>
                                    <text x="100" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="600">85</text>
                                    <text x="100" y="15" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6">Leadership</text>
                                </g>
                                
                                <!-- Consistency segment (300°) -->
                                <g class="dna-segment" data-category="consistency" transform="rotate(300 100 100)">
                                    <path d="M 100,20 L 100,50" stroke="url(#helixGradient)" stroke-width="3"/>
                                    <circle cx="100" cy="30" r="12" fill="#7209b7" stroke="white" stroke-width="2"/>
                                    <text x="100" y="35" text-anchor="middle" fill="white" font-size="8" font-weight="600">82</text>
                                    <text x="100" y="15" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="6">Consistency</text>
                                </g>
                            </g>
                            
                            <!-- Central core (50px diameter as per Research-Docs) -->
                            <circle cx="100" cy="100" r="25" fill="url(#dnaBackgroundGradient)" stroke="var(--primary-harmonic-4)" stroke-width="2"/>
                            <circle cx="100" cy="100" r="20" fill="var(--primary-harmonic-4)" opacity="0.9"/>
                            
                            <!-- Archetype display -->
                            <text x="100" y="95" text-anchor="middle" fill="white" font-size="6" font-weight="600">ADVANCED</text>
                            <text x="100" y="105" text-anchor="middle" fill="white" font-size="6" font-weight="600">PLAYMAKER</text>
                            <text x="100" y="115" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="4">95% Match</text>
                            
                            <!-- DNA helix connecting lines -->
                            <g class="dna-helix-connections" opacity="0.4">
                                <path d="M100,50 Q120,70 100,100 Q80,130 100,150" stroke="var(--primary-harmonic-3)" stroke-width="2" fill="none"/>
                                <path d="M150,100 Q130,80 100,100 Q70,120 50,100" stroke="var(--safe-color)" stroke-width="2" fill="none"/>
                                <path d="M100,150 Q80,130 100,100 Q120,70 100,50" stroke="var(--triumph-color)" stroke-width="1" fill="none"/>
                            </g>
                        </svg>
                        
                        <div class="dna-legend">
                            <div class="legend-item technical">
                                <div class="legend-color" style="background: #0094cc;"></div>
                                <span class="legend-label">Technical</span>
                                <span class="legend-value">92</span>
                                <div class="legend-bar">
                                    <div class="legend-fill" style="width: 92%; background: #0094cc;"></div>
                                </div>
                            </div>
                            <div class="legend-item mental">
                                <div class="legend-color" style="background: #00ff88;"></div>
                                <span class="legend-label">Mental</span>
                                <span class="legend-value">88</span>
                                <div class="legend-bar">
                                    <div class="legend-fill" style="width: 88%; background: #00ff88;"></div>
                                </div>
                            </div>
                            <div class="legend-item physical">
                                <div class="legend-color" style="background: #ffb800;"></div>
                                <span class="legend-label">Physical</span>
                                <span class="legend-value">75</span>
                                <div class="legend-bar">
                                    <div class="legend-fill" style="width: 75%; background: #ffb800;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dna-insights">
                        <div class="insight-header">DNA Analysis</div>
                        <div class="insights-grid">
                            <div class="insight-strength">
                                <span class="insight-icon">⭐</span>
                                <span class="insight-text">Elite creativity and vision</span>
                                <span class="insight-percentage">95%</span>
                            </div>
                            <div class="insight-strength">
                                <span class="insight-icon">🎯</span>
                                <span class="insight-text">Exceptional technical ability</span>
                                <span class="insight-percentage">92%</span>
                            </div>
                            <div class="insight-development">
                                <span class="insight-icon">📈</span>
                                <span class="insight-text">Physical development potential</span>
                                <span class="insight-percentage">75%</span>
                            </div>
                        </div>
                        
                        <div class="archetype-analysis">
                            <div class="archetype-match">
                                <strong>Archetype Match:</strong> Advanced Playmaker (95%)
                            </div>
                            <div class="similar-players">
                                <strong>Similar Players:</strong> De Bruyne (93%), Ødegaard (89%), Modric (87%)
                            </div>
                            <div class="optimal-role">
                                <strong>Optimal Role:</strong> Central attacking midfielder, free roam
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        switchPlayer(playerKey, button) {
            console.log(`🧬 Switching DNA visualization to: ${playerKey}`);
            
            // Update active button
            const container = button.closest('.professional-dna-system');
            container.querySelectorAll('.dna-player-select').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Player data with Research-Docs level detail
            const playerData = {
                bruno: {
                    archetype: 'ADVANCED\nPLAYMAKER',
                    match: 95,
                    attributes: { technical: 92, mental: 88, physical: 75, creativity: 95, leadership: 85, consistency: 82 },
                    insights: [
                        { type: 'strength', icon: '⭐', text: 'Elite creativity and vision', percentage: 95 },
                        { type: 'strength', icon: '🎯', text: 'Exceptional technical ability', percentage: 92 },
                        { type: 'development', icon: '📈', text: 'Physical development potential', percentage: 75 }
                    ],
                    similar: 'De Bruyne (93%), Ødegaard (89%), Modric (87%)',
                    role: 'Central attacking midfielder, free roam'
                },
                rashford: {
                    archetype: 'INSIDE\nFORWARD',
                    match: 88,
                    attributes: { technical: 85, mental: 82, physical: 88, creativity: 87, leadership: 78, consistency: 80 },
                    insights: [
                        { type: 'strength', icon: '⚡', text: 'Exceptional pace and power', percentage: 88 },
                        { type: 'strength', icon: '⚽', text: 'Clinical finishing ability', percentage: 85 },
                        { type: 'development', icon: '🎯', text: 'Consistency improvement needed', percentage: 80 }
                    ],
                    similar: 'Vinicius Jr (92%), Sterling (85%), Son (83%)',
                    role: 'Left wing, cut inside, get in behind'
                },
                casemiro: {
                    archetype: 'DEFENSIVE\nMIDFIELDER',
                    match: 90,
                    attributes: { technical: 80, mental: 92, physical: 85, creativity: 75, leadership: 90, consistency: 88 },
                    insights: [
                        { type: 'strength', icon: '🛡️', text: 'Dominant defensive presence', percentage: 92 },
                        { type: 'strength', icon: '👑', text: 'Natural leadership qualities', percentage: 90 },
                        { type: 'development', icon: '🎨', text: 'Creative passing development', percentage: 75 }
                    ],
                    similar: 'Rodri (94%), Fabinho (88%), Kanté (85%)',
                    role: 'Defensive midfielder, deep lying playmaker'
                }
            };
            
            const player = playerData[playerKey];
            if (player) {
                this.updateDNAVisualization(container, player);
            }
        },

        updateDNAVisualization(container, playerData) {
            // Update central archetype
            const archetypeTexts = container.querySelectorAll('.dna-circle text');
            if (archetypeTexts[0]) archetypeTexts[0].textContent = playerData.archetype.split('\n')[0];
            if (archetypeTexts[1]) archetypeTexts[1].textContent = playerData.archetype.split('\n')[1];
            if (archetypeTexts[2]) archetypeTexts[2].textContent = playerData.match + '% Match';
            
            // Update segment values with smooth animation
            Object.entries(playerData.attributes).forEach(([category, value], index) => {
                const segment = container.querySelector(`[data-category="${category}"]`);
                if (segment) {
                    const valueText = segment.querySelector('text:nth-child(3)');
                    if (valueText) {
                        this.animateValueChange(valueText, parseInt(valueText.textContent), value);
                    }
                    
                    // Update segment color based on value
                    const circle = segment.querySelector('circle');
                    if (circle) {
                        const hue = (value / 100) * 120; // 0 = red, 120 = green
                        circle.setAttribute('fill', `hsl(${hue}, 70%, 60%)`);
                    }
                }
            });
            
            // Update legend
            const legendItems = container.querySelectorAll('.legend-item');
            ['technical', 'mental', 'physical'].forEach((category, index) => {
                if (legendItems[index] && playerData.attributes[category]) {
                    const value = playerData.attributes[category];
                    legendItems[index].querySelector('.legend-value').textContent = value;
                    legendItems[index].querySelector('.legend-fill').style.width = value + '%';
                }
            });
            
            // Update insights
            const insightsGrid = container.querySelector('.insights-grid');
            if (insightsGrid) {
                insightsGrid.innerHTML = '';
                playerData.insights.forEach(insight => {
                    const insightElement = document.createElement('div');
                    insightElement.className = `insight-${insight.type}`;
                    insightElement.innerHTML = `
                        <span class="insight-icon">${insight.icon}</span>
                        <span class="insight-text">${insight.text}</span>
                        <span class="insight-percentage">${insight.percentage}%</span>
                    `;
                    insightsGrid.appendChild(insightElement);
                });
            }
            
            // Update archetype analysis
            const matchElement = container.querySelector('.archetype-match');
            if (matchElement) {
                matchElement.innerHTML = `<strong>Archetype Match:</strong> ${playerData.archetype.replace('\n', ' ')} (${playerData.match}%)`;
            }
            
            const similarElement = container.querySelector('.similar-players');
            if (similarElement) {
                similarElement.innerHTML = `<strong>Similar Players:</strong> ${playerData.similar}`;
            }
            
            const roleElement = container.querySelector('.optimal-role');
            if (roleElement) {
                roleElement.innerHTML = `<strong>Optimal Role:</strong> ${playerData.role}`;
            }
        },

        animateValueChange(textElement, fromValue, toValue) {
            const duration = 800;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use easing curve for smooth animation
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(fromValue + (toValue - fromValue) * eased);
                
                textElement.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        },

        initializeDNAInteractivity(container) {
            console.log('🧬 Initializing DNA interactivity...');
            
            // Add hover effects for segments
            const segments = container.querySelectorAll('.dna-segment');
            segments.forEach(segment => {
                segment.addEventListener('mouseenter', () => {
                    segment.style.filter = 'drop-shadow(0 4px 8px rgba(0, 148, 204, 0.5))';
                    segment.style.transform = `rotate(${segment.style.transform.match(/\d+/)[0]}deg) scale(1.1)`;
                });
                
                segment.addEventListener('mouseleave', () => {
                    segment.style.filter = '';
                    segment.style.transform = `rotate(${segment.style.transform.match(/\d+/)[0]}deg) scale(1)`;
                });
            });
            
            console.log('✅ DNA interactivity initialized');
        },

        addProfessionalDNAStyles() {
            const dnaCSS = `
                /* Professional DNA Visualization Styles */
                .professional-dna-system {
                    margin-top: var(--fibonacci-21);
                    padding: var(--fibonacci-21);
                    background: linear-gradient(135deg, 
                        rgba(0, 148, 204, 0.05) 0%, 
                        rgba(0, 148, 204, 0.02) 100%);
                    border: 1px solid rgba(0, 148, 204, 0.2);
                    border-radius: var(--fibonacci-8);
                    position: relative;
                }
                
                .professional-dna-system::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary-harmonic-4), var(--triumph-color), var(--safe-color));
                    border-radius: var(--fibonacci-8) var(--fibonacci-8) 0 0;
                }
                
                .dna-system-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--fibonacci-21);
                    padding-bottom: var(--fibonacci-13);
                    border-bottom: 1px solid rgba(0, 148, 204, 0.2);
                }
                
                .dna-system-header h3 {
                    margin: 0;
                    font-size: var(--font-size-md);
                    color: var(--primary-harmonic-4);
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                
                .player-selector {
                    display: flex;
                    gap: var(--fibonacci-8);
                }
                
                .dna-player-select {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.7);
                    padding: var(--fibonacci-8) var(--fibonacci-13);
                    border-radius: var(--fibonacci-8);
                    font-size: var(--font-size-xs);
                    cursor: pointer;
                    transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .dna-player-select:hover {
                    background: rgba(0, 148, 204, 0.2);
                    color: white;
                    transform: translateY(-1px);
                }
                
                .dna-player-select.active {
                    background: var(--primary-harmonic-4);
                    color: white;
                    border-color: var(--primary-harmonic-4);
                    box-shadow: 0 2px 8px rgba(0, 148, 204, 0.3);
                }
                
                .dna-visualization-container {
                    display: flex;
                    align-items: center;
                    gap: var(--fibonacci-21);
                    margin-bottom: var(--fibonacci-21);
                }
                
                .dna-circle {
                    flex-shrink: 0;
                    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
                }
                
                .dna-segment {
                    cursor: pointer;
                    transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
                }
                
                .dna-segment:hover {
                    filter: drop-shadow(0 4px 8px rgba(0, 148, 204, 0.5));
                }
                
                .dna-legend {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--fibonacci-8);
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: var(--fibonacci-8);
                    padding: var(--fibonacci-8);
                    border-radius: var(--fibonacci-8);
                    background: rgba(255, 255, 255, 0.02);
                    transition: all 200ms ease;
                }
                
                .legend-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(4px);
                }
                
                .legend-color {
                    width: var(--fibonacci-13);
                    height: var(--fibonacci-13);
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    flex-shrink: 0;
                }
                
                .legend-label {
                    font-size: var(--font-size-xs);
                    color: rgba(255, 255, 255, 0.8);
                    min-width: 50px;
                }
                
                .legend-value {
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    color: white;
                    min-width: 20px;
                    text-align: right;
                }
                
                .legend-bar {
                    flex: 1;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 0 var(--fibonacci-8);
                }
                
                .legend-fill {
                    height: 100%;
                    transition: width 600ms cubic-bezier(0.4, 0.0, 0.2, 1);
                    border-radius: 2px;
                }
                
                .dna-insights {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: var(--fibonacci-13);
                }
                
                .insight-header {
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    color: var(--primary-harmonic-4);
                    margin-bottom: var(--fibonacci-13);
                }
                
                .insights-grid {
                    display: flex;
                    flex-direction: column;
                    gap: var(--fibonacci-8);
                    margin-bottom: var(--fibonacci-13);
                }
                
                .insight-strength, .insight-development {
                    display: flex;
                    align-items: center;
                    gap: var(--fibonacci-8);
                    padding: var(--fibonacci-8);
                    border-radius: var(--fibonacci-8);
                }
                
                .insight-strength {
                    background: linear-gradient(90deg, rgba(0, 255, 136, 0.1), transparent);
                    border-left: 3px solid var(--safe-color);
                }
                
                .insight-development {
                    background: linear-gradient(90deg, rgba(255, 184, 0, 0.1), transparent);
                    border-left: 3px solid var(--tension-color);
                }
                
                .insight-icon {
                    font-size: var(--font-size-sm);
                    flex-shrink: 0;
                }
                
                .insight-text {
                    flex: 1;
                    font-size: var(--font-size-xs);
                    color: rgba(255, 255, 255, 0.9);
                }
                
                .insight-percentage {
                    font-size: var(--font-size-xs);
                    font-weight: 600;
                    color: var(--primary-harmonic-4);
                }
                
                .archetype-analysis {
                    font-size: var(--font-size-xs);
                    line-height: 1.4;
                }
                
                .archetype-analysis > div {
                    margin-bottom: var(--fibonacci-8);
                    color: rgba(255, 255, 255, 0.8);
                }
                
                .archetype-analysis strong {
                    color: var(--primary-harmonic-4);
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'professional-dna-styles';
            style.textContent = dnaCSS;
            document.head.appendChild(style);
            
            console.log('✅ Professional DNA styles added');
        }
    };

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => ProfessionalDNAVisualization.init(), 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => ProfessionalDNAVisualization.init(), 500);
        });
    }

    // Make available globally
    window.ProfessionalDNAVisualization = ProfessionalDNAVisualization;

})();