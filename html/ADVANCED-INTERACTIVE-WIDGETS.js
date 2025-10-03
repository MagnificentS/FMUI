/**
 * ADVANCED INTERACTIVE WIDGETS
 * Agent 5 - Build sophisticated Football Manager interaction patterns
 * Including formation editors, player attribute sliders, filtering widgets
 */

(function() {
    'use strict';

    console.log('🎛️ ADVANCED INTERACTIVE WIDGETS: Building sophisticated Football Manager controls...');

    const InteractiveWidgets = {
        initialized: false,
        widgets: new Map(),
        
        init() {
            if (this.initialized) return;
            
            console.log('🎛️ WIDGETS: Creating advanced interactive controls...');
            
            this.createFormationEditor();
            this.createPlayerAttributeSliders();
            this.createAdvancedFilters();
            this.createTransferNegotiationWidget();
            this.createTacticalInstructionWidget();
            this.createTrainingProgramWidget();
            this.setupWidgetInteractions();
            
            this.initialized = true;
            console.log('✅ WIDGETS: All interactive widgets implemented');
        },
        
        createFormationEditor() {
            console.log('⚽ Creating formation editor widget...');
            
            const FormationEditor = {
                currentFormation: '4-2-3-1',
                players: {},
                
                init(container) {
                    this.container = container;
                    this.render();
                    this.setupDragDrop();
                },
                
                render() {
                    this.container.innerHTML = `
                        <div class="formation-editor">
                            <div class="formation-controls">
                                <select class="formation-select" onchange="window.FormationEditor.changeFormation(this.value)">
                                    <option value="4-2-3-1" selected>4-2-3-1</option>
                                    <option value="4-3-3">4-3-3</option>
                                    <option value="3-5-2">3-5-2</option>
                                    <option value="4-4-2">4-4-2</option>
                                    <option value="5-3-2">5-3-2</option>
                                </select>
                                <button class="save-formation-btn" onclick="window.FormationEditor.saveFormation()">Save Formation</button>
                            </div>
                            
                            <div class="formation-pitch-editor" id="formation-pitch">
                                <div class="pitch-background">
                                    <!-- Pitch markings -->
                                    <div class="center-line"></div>
                                    <div class="penalty-area top"></div>
                                    <div class="penalty-area bottom"></div>
                                    <div class="center-circle"></div>
                                </div>
                                
                                <div class="player-positions" id="player-positions">
                                    <!-- Draggable player positions -->
                                </div>
                            </div>
                            
                            <div class="available-players">
                                <h4>Available Players</h4>
                                <div class="player-pool" id="player-pool">
                                    <!-- Draggable player list -->
                                </div>
                            </div>
                        </div>
                    `;
                    
                    this.renderPlayers();
                },
                
                renderPlayers() {
                    const positions = this.getFormationPositions(this.currentFormation);
                    const positionsContainer = document.getElementById('player-positions');
                    
                    positionsContainer.innerHTML = '';
                    
                    positions.forEach((pos, index) => {
                        const playerSlot = document.createElement('div');
                        playerSlot.className = 'player-slot';
                        playerSlot.style.cssText = `
                            position: absolute;
                            left: ${pos.x}%;
                            top: ${pos.y}%;
                            width: 40px;
                            height: 40px;
                            background: rgba(0, 148, 204, 0.8);
                            border: 2px solid white;
                            border-radius: 50%;
                            transform: translate(-50%, -50%);
                            cursor: grab;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 8px;
                            font-weight: 600;
                            color: white;
                            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
                        `;
                        
                        playerSlot.textContent = pos.position;
                        playerSlot.dataset.position = pos.position;
                        playerSlot.dataset.index = index;
                        
                        playerSlot.addEventListener('mouseenter', () => {
                            playerSlot.style.transform = 'translate(-50%, -50%) scale(1.2)';
                            playerSlot.style.zIndex = '10';
                        });
                        
                        playerSlot.addEventListener('mouseleave', () => {
                            playerSlot.style.transform = 'translate(-50%, -50%) scale(1)';
                            playerSlot.style.zIndex = '1';
                        });
                        
                        positionsContainer.appendChild(playerSlot);
                    });
                },
                
                getFormationPositions(formation) {
                    const formations = {
                        '4-2-3-1': [
                            { position: 'GK', x: 50, y: 85 },
                            { position: 'LB', x: 20, y: 65 },
                            { position: 'CB', x: 40, y: 70 },
                            { position: 'CB', x: 60, y: 70 },
                            { position: 'RB', x: 80, y: 65 },
                            { position: 'DM', x: 35, y: 50 },
                            { position: 'DM', x: 65, y: 50 },
                            { position: 'LW', x: 20, y: 30 },
                            { position: 'AM', x: 50, y: 35 },
                            { position: 'RW', x: 80, y: 30 },
                            { position: 'ST', x: 50, y: 15 }
                        ],
                        '4-3-3': [
                            { position: 'GK', x: 50, y: 85 },
                            { position: 'LB', x: 20, y: 65 },
                            { position: 'CB', x: 40, y: 70 },
                            { position: 'CB', x: 60, y: 70 },
                            { position: 'RB', x: 80, y: 65 },
                            { position: 'CM', x: 30, y: 45 },
                            { position: 'CM', x: 50, y: 50 },
                            { position: 'CM', x: 70, y: 45 },
                            { position: 'LW', x: 25, y: 20 },
                            { position: 'ST', x: 50, y: 15 },
                            { position: 'RW', x: 75, y: 20 }
                        ]
                    };
                    
                    return formations[formation] || formations['4-2-3-1'];
                },
                
                changeFormation(newFormation) {
                    this.currentFormation = newFormation;
                    console.log(`⚽ Formation changed to: ${newFormation}`);
                    this.renderPlayers();
                    
                    if (window.ZenithMotion) {
                        const container = document.getElementById('formation-pitch');
                        window.ZenithMotion.showSuccessFeedback(container);
                    }
                },
                
                saveFormation() {
                    console.log(`💾 Saving formation: ${this.currentFormation}`);
                    
                    const saveBtn = document.querySelector('.save-formation-btn');
                    if (saveBtn && window.ZenithMotion) {
                        window.ZenithMotion.showSuccessFeedback(saveBtn);
                    }
                }
            };
            
            // Make globally available
            window.FormationEditor = FormationEditor;
            this.widgets.set('formation-editor', FormationEditor);
            
            console.log('✅ Formation editor widget created');
        },
        
        createPlayerAttributeSliders() {
            console.log('📊 Creating player attribute sliders...');
            
            const AttributeSliders = {
                init(container) {
                    this.container = container;
                    this.render();
                },
                
                render() {
                    const attributes = [
                        { name: 'Pace', value: 85, max: 100 },
                        { name: 'Shooting', value: 78, max: 100 },
                        { name: 'Passing', value: 82, max: 100 },
                        { name: 'Dribbling', value: 79, max: 100 },
                        { name: 'Defending', value: 45, max: 100 },
                        { name: 'Physical', value: 76, max: 100 }
                    ];
                    
                    this.container.innerHTML = `
                        <div class="attribute-sliders">
                            ${attributes.map(attr => `
                                <div class="attribute-slider-item">
                                    <div class="slider-header">
                                        <span class="slider-label">${attr.name}</span>
                                        <span class="slider-value">${attr.value}</span>
                                    </div>
                                    <div class="slider-container">
                                        <input 
                                            type="range" 
                                            class="attribute-slider"
                                            min="0" 
                                            max="${attr.max}" 
                                            value="${attr.value}"
                                            data-attribute="${attr.name.toLowerCase()}"
                                            onchange="window.AttributeSliders.updateAttribute(this)"
                                        >
                                        <div class="slider-track">
                                            <div class="slider-fill" style="width: ${attr.value}%; background: ${this.getAttributeColor(attr.value)};"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                },
                
                getAttributeColor(value) {
                    if (value >= 80) return '#00ff88';
                    if (value >= 70) return '#ffb800';
                    if (value >= 60) return '#ffa502';
                    if (value >= 50) return '#ff6b35';
                    return '#ff4757';
                },
                
                updateAttribute(slider) {
                    const attribute = slider.dataset.attribute;
                    const value = parseInt(slider.value);
                    
                    console.log(`📊 Attribute updated: ${attribute} = ${value}`);
                    
                    // Update visual feedback
                    const valueDisplay = slider.closest('.attribute-slider-item').querySelector('.slider-value');
                    const fillBar = slider.closest('.attribute-slider-item').querySelector('.slider-fill');
                    
                    if (valueDisplay) valueDisplay.textContent = value;
                    if (fillBar) {
                        fillBar.style.width = `${value}%`;
                        fillBar.style.background = this.getAttributeColor(value);
                    }
                    
                    // Trigger ZENITH feedback
                    if (window.ZenithMotion) {
                        window.ZenithMotion.showSuccessFeedback(slider);
                    }
                }
            };
            
            window.AttributeSliders = AttributeSliders;
            this.widgets.set('attribute-sliders', AttributeSliders);
            
            console.log('✅ Player attribute sliders created');
        },
        
        createAdvancedFilters() {
            console.log('🔍 Creating advanced filtering widgets...');
            
            const AdvancedFilters = {
                filters: {},
                
                init(container) {
                    this.container = container;
                    this.render();
                },
                
                render() {
                    this.container.innerHTML = `
                        <div class="advanced-filters">
                            <div class="filter-section">
                                <h4>Player Filters</h4>
                                <div class="filter-grid">
                                    <div class="filter-item">
                                        <label>Position</label>
                                        <select class="position-filter" onchange="window.AdvancedFilters.applyFilter('position', this.value)">
                                            <option value="">All Positions</option>
                                            <option value="GK">Goalkeeper</option>
                                            <option value="DEF">Defender</option>
                                            <option value="MID">Midfielder</option>
                                            <option value="ATT">Attacker</option>
                                        </select>
                                    </div>
                                    
                                    <div class="filter-item">
                                        <label>Age Range</label>
                                        <div class="range-slider">
                                            <input type="range" min="16" max="40" value="16" class="age-min" onchange="window.AdvancedFilters.updateAgeRange()">
                                            <input type="range" min="16" max="40" value="40" class="age-max" onchange="window.AdvancedFilters.updateAgeRange()">
                                            <div class="range-display">
                                                <span id="age-display">16 - 40 years</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="filter-item">
                                        <label>Minimum Rating</label>
                                        <div class="rating-slider">
                                            <input type="range" min="0" max="100" value="0" class="rating-filter" onchange="window.AdvancedFilters.applyFilter('rating', this.value)">
                                            <div class="rating-display">
                                                <span id="rating-display">0+</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="filter-item">
                                        <label>Value Range</label>
                                        <select class="value-filter" onchange="window.AdvancedFilters.applyFilter('value', this.value)">
                                            <option value="">Any Value</option>
                                            <option value="under-10m">Under £10M</option>
                                            <option value="10m-50m">£10M - £50M</option>
                                            <option value="50m-100m">£50M - £100M</option>
                                            <option value="over-100m">Over £100M</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="filter-actions">
                                    <button class="apply-filters-btn" onclick="window.AdvancedFilters.applyAllFilters()">Apply Filters</button>
                                    <button class="clear-filters-btn" onclick="window.AdvancedFilters.clearAllFilters()">Clear All</button>
                                </div>
                            </div>
                        </div>
                    `;
                },
                
                applyFilter(filterType, value) {
                    this.filters[filterType] = value;
                    console.log(`🔍 Filter applied: ${filterType} = ${value}`);
                    
                    // Update UI to show filter is active
                    this.updateFilterDisplay();
                },
                
                updateAgeRange() {
                    const minAge = document.querySelector('.age-min').value;
                    const maxAge = document.querySelector('.age-max').value;
                    const display = document.getElementById('age-display');
                    
                    if (display) {
                        display.textContent = `${minAge} - ${maxAge} years`;
                    }
                    
                    this.filters.ageMin = minAge;
                    this.filters.ageMax = maxAge;
                    console.log(`📅 Age range updated: ${minAge} - ${maxAge}`);
                },
                
                updateFilterDisplay() {
                    const activeFilters = Object.keys(this.filters).length;
                    const applyBtn = document.querySelector('.apply-filters-btn');
                    
                    if (applyBtn) {
                        applyBtn.textContent = `Apply Filters (${activeFilters})`;
                        
                        if (activeFilters > 0) {
                            applyBtn.style.background = 'var(--accent-200)';
                            applyBtn.style.color = '#000';
                        } else {
                            applyBtn.style.background = '';
                            applyBtn.style.color = '';
                        }
                    }
                },
                
                applyAllFilters() {
                    console.log('🔍 Applying all filters:', this.filters);
                    
                    if (window.ZenithMotion) {
                        const btn = document.querySelector('.apply-filters-btn');
                        window.ZenithMotion.showSuccessFeedback(btn);
                    }
                },
                
                clearAllFilters() {
                    this.filters = {};
                    console.log('🗑️ All filters cleared');
                    
                    // Reset all filter controls
                    document.querySelectorAll('.position-filter, .value-filter').forEach(select => {
                        select.selectedIndex = 0;
                    });
                    
                    document.querySelectorAll('.age-min').forEach(input => input.value = 16);
                    document.querySelectorAll('.age-max').forEach(input => input.value = 40);
                    document.querySelectorAll('.rating-filter').forEach(input => input.value = 0);
                    
                    this.updateFilterDisplay();
                    this.updateAgeRange();
                }
            };
            
            window.AdvancedFilters = AdvancedFilters;
            this.widgets.set('advanced-filters', AdvancedFilters);
            
            console.log('✅ Advanced filters widget created');
        },
        
        createTransferNegotiationWidget() {
            console.log('💼 Creating transfer negotiation widget...');
            
            const TransferNegotiation = {
                currentNegotiation: null,
                
                init(container) {
                    this.container = container;
                    this.render();
                },
                
                render() {
                    this.container.innerHTML = `
                        <div class="negotiation-widget">
                            <div class="negotiation-header">
                                <h4>Active Negotiations</h4>
                                <button class="start-negotiation-btn" onclick="window.TransferNegotiation.startNewNegotiation()">Start New</button>
                            </div>
                            
                            <div class="negotiations-list">
                                <div class="negotiation-item active">
                                    <div class="negotiation-player">
                                        <span class="player-name">Jeremie Frimpong</span>
                                        <span class="player-club">Bayer Leverkusen</span>
                                    </div>
                                    <div class="negotiation-progress">
                                        <div class="progress-stage">
                                            <span class="stage-label">Personal Terms</span>
                                            <div class="stage-bar">
                                                <div class="stage-fill" style="width: 75%; background: #00ff88;"></div>
                                            </div>
                                        </div>
                                        <div class="progress-stage">
                                            <span class="stage-label">Club Agreement</span>
                                            <div class="stage-bar">
                                                <div class="stage-fill" style="width: 40%; background: #ffb800;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="negotiation-actions">
                                        <button class="negotiate-btn" onclick="window.TransferNegotiation.continueNegotiation('frimpong')">Continue</button>
                                        <button class="withdraw-btn" onclick="window.TransferNegotiation.withdrawNegotiation('frimpong')">Withdraw</button>
                                    </div>
                                </div>
                                
                                <div class="negotiation-item">
                                    <div class="negotiation-player">
                                        <span class="player-name">Victor Osimhen</span>
                                        <span class="player-club">Napoli</span>
                                    </div>
                                    <div class="negotiation-progress">
                                        <div class="progress-stage">
                                            <span class="stage-label">Initial Contact</span>
                                            <div class="stage-bar">
                                                <div class="stage-fill" style="width: 20%; background: #ffa502;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="negotiation-actions">
                                        <button class="negotiate-btn" onclick="window.TransferNegotiation.continueNegotiation('osimhen')">Continue</button>
                                        <button class="withdraw-btn" onclick="window.TransferNegotiation.withdrawNegotiation('osimhen')">Withdraw</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                },
                
                continueNegotiation(playerId) {
                    console.log(`💼 Continuing negotiation for: ${playerId}`);
                    
                    const btn = event.target;
                    if (window.ZenithMotion) {
                        window.ZenithMotion.showLoadingFeedback(btn);
                        
                        setTimeout(() => {
                            window.ZenithMotion.hideLoadingFeedback(btn);
                            window.ZenithMotion.showSuccessFeedback(btn);
                        }, 1500);
                    }
                },
                
                withdrawNegotiation(playerId) {
                    console.log(`❌ Withdrawing negotiation for: ${playerId}`);
                    
                    const btn = event.target;
                    if (window.ZenithMotion) {
                        window.ZenithMotion.showErrorFeedback(btn);
                    }
                }
            };
            
            window.TransferNegotiation = TransferNegotiation;
            this.widgets.set('transfer-negotiation', TransferNegotiation);
            
            console.log('✅ Transfer negotiation widget created');
        },
        
        createTacticalInstructionWidget() {
            console.log('📋 Creating tactical instruction widget...');
            
            const TacticalInstructions = {
                instructions: {},
                
                init(container) {
                    this.container = container;
                    this.render();
                },
                
                render() {
                    const instructionCategories = [
                        {
                            name: 'Attacking',
                            instructions: [
                                { key: 'mentality', label: 'Mentality', options: ['Very Defensive', 'Defensive', 'Balanced', 'Attacking', 'Very Attacking'], default: 'Balanced' },
                                { key: 'width', label: 'Width', options: ['Very Narrow', 'Narrow', 'Balanced', 'Wide', 'Very Wide'], default: 'Balanced' },
                                { key: 'tempo', label: 'Tempo', options: ['Much Slower', 'Slower', 'Balanced', 'Higher', 'Much Higher'], default: 'Balanced' }
                            ]
                        },
                        {
                            name: 'Defensive',
                            instructions: [
                                { key: 'defensive_line', label: 'Defensive Line', options: ['Much Deeper', 'Deeper', 'Balanced', 'Higher', 'Much Higher'], default: 'Balanced' },
                                { key: 'pressing', label: 'Pressing', options: ['Never', 'Less Often', 'Balanced', 'More Often', 'Much More'], default: 'Balanced' },
                                { key: 'tackle', label: 'Tackling', options: ['Stay on Feet', 'Balanced', 'Get Stuck In'], default: 'Balanced' }
                            ]
                        }
                    ];
                    
                    this.container.innerHTML = `
                        <div class="tactical-instructions-widget">
                            ${instructionCategories.map(category => `
                                <div class="instruction-category">
                                    <h4 class="category-title">${category.name}</h4>
                                    <div class="instructions-grid">
                                        ${category.instructions.map(instruction => `
                                            <div class="instruction-item">
                                                <label class="instruction-label">${instruction.label}</label>
                                                <select 
                                                    class="instruction-select"
                                                    data-instruction="${instruction.key}"
                                                    onchange="window.TacticalInstructions.updateInstruction(this)"
                                                >
                                                    ${instruction.options.map(option => `
                                                        <option value="${option}" ${option === instruction.default ? 'selected' : ''}>${option}</option>
                                                    `).join('')}
                                                </select>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                            
                            <div class="instruction-actions">
                                <button class="save-instructions-btn" onclick="window.TacticalInstructions.saveInstructions()">Save Instructions</button>
                                <button class="reset-instructions-btn" onclick="window.TacticalInstructions.resetInstructions()">Reset to Default</button>
                            </div>
                        </div>
                    `;
                },
                
                updateInstruction(select) {
                    const instruction = select.dataset.instruction;
                    const value = select.value;
                    
                    this.instructions[instruction] = value;
                    console.log(`📋 Tactical instruction updated: ${instruction} = ${value}`);
                    
                    if (window.ZenithMotion) {
                        window.ZenithMotion.showSuccessFeedback(select);
                    }
                },
                
                saveInstructions() {
                    console.log('💾 Saving tactical instructions:', this.instructions);
                    
                    const btn = document.querySelector('.save-instructions-btn');
                    if (window.ZenithMotion) {
                        window.ZenithMotion.showSuccessFeedback(btn);
                    }
                }
            };
            
            window.TacticalInstructions = TacticalInstructions;
            this.widgets.set('tactical-instructions', TacticalInstructions);
            
            console.log('✅ Tactical instruction widget created');
        },
        
        createTrainingProgramWidget() {
            console.log('🏃 Creating training program widget...');
            
            const TrainingProgram = {
                programs: {},
                
                init(container) {
                    this.container = container;
                    this.render();
                },
                
                render() {
                    this.container.innerHTML = `
                        <div class="training-program-widget">
                            <div class="program-header">
                                <h4>Training Programs</h4>
                                <button class="create-program-btn" onclick="window.TrainingProgram.createNewProgram()">Create Program</button>
                            </div>
                            
                            <div class="training-schedule">
                                <div class="schedule-day">
                                    <div class="day-header">
                                        <span class="day-name">Monday</span>
                                        <select class="intensity-select" onchange="window.TrainingProgram.updateIntensity('monday', this.value)">
                                            <option value="light">Light</option>
                                            <option value="medium" selected>Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div class="training-focus">
                                        <select class="focus-select" onchange="window.TrainingProgram.updateFocus('monday', this.value)">
                                            <option value="general" selected>General Training</option>
                                            <option value="tactical">Tactical</option>
                                            <option value="physical">Physical</option>
                                            <option value="technical">Technical</option>
                                            <option value="mental">Mental</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="schedule-day">
                                    <div class="day-header">
                                        <span class="day-name">Tuesday</span>
                                        <select class="intensity-select" onchange="window.TrainingProgram.updateIntensity('tuesday', this.value)">
                                            <option value="light">Light</option>
                                            <option value="medium">Medium</option>
                                            <option value="high" selected>High</option>
                                        </select>
                                    </div>
                                    <div class="training-focus">
                                        <select class="focus-select" onchange="window.TrainingProgram.updateFocus('tuesday', this.value)">
                                            <option value="general">General Training</option>
                                            <option value="tactical" selected>Tactical</option>
                                            <option value="physical">Physical</option>
                                            <option value="technical">Technical</option>
                                            <option value="mental">Mental</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="training-effectiveness">
                                    <h4>Program Effectiveness</h4>
                                    <div class="effectiveness-grid">
                                        <div class="effectiveness-item">
                                            <span class="effectiveness-label">Fitness Improvement</span>
                                            <div class="effectiveness-bar">
                                                <div class="effectiveness-fill" style="width: 85%; background: #00ff88;"></div>
                                            </div>
                                            <span class="effectiveness-value">85%</span>
                                        </div>
                                        <div class="effectiveness-item">
                                            <span class="effectiveness-label">Tactical Understanding</span>
                                            <div class="effectiveness-bar">
                                                <div class="effectiveness-fill" style="width: 72%; background: #ffb800;"></div>
                                            </div>
                                            <span class="effectiveness-value">72%</span>
                                        </div>
                                        <div class="effectiveness-item">
                                            <span class="effectiveness-label">Technical Skills</span>
                                            <div class="effectiveness-bar">
                                                <div class="effectiveness-fill" style="width: 68%; background: #ffa502;"></div>
                                            </div>
                                            <span class="effectiveness-value">68%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                },
                
                updateIntensity(day, intensity) {
                    console.log(`🏃 Training intensity updated: ${day} = ${intensity}`);
                    
                    if (window.ZenithMotion) {
                        const select = event.target;
                        window.ZenithMotion.showSuccessFeedback(select);
                    }
                },
                
                updateFocus(day, focus) {
                    console.log(`🎯 Training focus updated: ${day} = ${focus}`);
                    
                    if (window.ZenithMotion) {
                        const select = event.target;
                        window.ZenithMotion.showSuccessFeedback(select);
                    }
                }
            };
            
            window.TrainingProgram = TrainingProgram;
            this.widgets.set('training-program', TrainingProgram);
            
            console.log('✅ Training program widget created');
        },
        
        setupWidgetInteractions() {
            console.log('🎮 Setting up widget interactions...');
            
            // Enhanced drag and drop for widgets
            document.addEventListener('dragstart', (e) => {
                if (e.target.closest('.widget')) {
                    console.log('🎛️ Widget drag started');
                    
                    if (window.ZenithMotion) {
                        e.target.style.transition = `all ${window.ZenithMotion.timing.primary}ms ${window.ZenithMotion.easings.swift}`;
                    }
                }
            });
            
            // Enhanced widget focus management
            document.addEventListener('focusin', (e) => {
                if (e.target.closest('.widget')) {
                    const widget = e.target.closest('.widget');
                    widget.classList.add('widget-focused');
                    
                    if (window.ZenithMotion) {
                        widget.style.boxShadow = '0 0 0 2px rgba(0, 148, 204, 0.5)';
                        widget.style.transition = `box-shadow ${window.ZenithMotion.timing.primary}ms ${window.ZenithMotion.easings.swift}`;
                    }
                }
            });
            
            document.addEventListener('focusout', (e) => {
                if (e.target.closest('.widget')) {
                    const widget = e.target.closest('.widget');
                    widget.classList.remove('widget-focused');
                    
                    setTimeout(() => {
                        widget.style.boxShadow = '';
                    }, 100);
                }
            });
            
            console.log('✅ Widget interactions setup complete');
        }
    };

    // Add widget-specific CSS
    const widgetStyles = `
        /* Advanced Interactive Widgets Styling */
        .formation-editor {
            padding: 12px;
        }
        
        .formation-controls {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            align-items: center;
        }
        
        .formation-pitch-editor {
            width: 100%;
            height: 250px;
            background: linear-gradient(to top, #2d5a27 0%, #4a7c59 100%);
            border-radius: 8px;
            position: relative;
            margin: 16px 0;
            border: 2px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
        }
        
        .pitch-background {
            position: absolute;
            inset: 0;
        }
        
        .center-line {
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            height: 2px;
            background: rgba(255, 255, 255, 0.6);
        }
        
        .penalty-area {
            position: absolute;
            left: 25%;
            right: 25%;
            height: 60px;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 4px;
        }
        
        .penalty-area.top {
            top: 10px;
            border-bottom: none;
        }
        
        .penalty-area.bottom {
            bottom: 10px;
            border-top: none;
        }
        
        .center-circle {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 60px;
            height: 60px;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .player-slot {
            cursor: grab;
            user-select: none;
        }
        
        .player-slot:active {
            cursor: grabbing;
        }
        
        .advanced-filters {
            padding: 12px;
        }
        
        .filter-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 12px 0;
        }
        
        .filter-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .filter-item label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
        }
        
        .filter-item select, .filter-item input {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 8px;
            border-radius: 4px;
            font-size: 11px;
        }
        
        .range-slider {
            position: relative;
            height: 20px;
        }
        
        .range-slider input {
            position: absolute;
            width: 100%;
            height: 4px;
            appearance: none;
            background: transparent;
            cursor: pointer;
        }
        
        .range-slider input::-webkit-slider-thumb {
            appearance: none;
            width: 12px;
            height: 12px;
            background: var(--primary-400);
            border-radius: 50%;
            cursor: pointer;
        }
        
        .filter-actions {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }
        
        .filter-actions button {
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 11px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .apply-filters-btn {
            background: var(--primary-400);
            color: white;
        }
        
        .clear-filters-btn {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
        }
        
        .negotiation-widget {
            padding: 12px;
        }
        
        .negotiations-list {
            margin: 16px 0;
        }
        
        .negotiation-item {
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 6px;
            margin: 8px 0;
            border-left: 3px solid var(--primary-400);
        }
        
        .negotiation-item.active {
            border-left-color: var(--accent-200);
        }
        
        .negotiation-player {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .player-name {
            font-weight: 600;
            color: white;
        }
        
        .player-club {
            color: rgba(255, 255, 255, 0.7);
            font-size: 10px;
        }
        
        .negotiation-progress {
            margin: 8px 0;
        }
        
        .progress-stage {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 4px 0;
        }
        
        .stage-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .stage-bar {
            width: 100px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 8px;
        }
        
        .stage-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .negotiation-actions {
            display: flex;
            gap: 6px;
            margin-top: 8px;
        }
        
        .negotiation-actions button {
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .negotiate-btn {
            background: var(--accent-200);
            color: #000;
        }
        
        .withdraw-btn {
            background: var(--accent-400);
            color: white;
        }
        
        .training-schedule {
            margin: 16px 0;
        }
        
        .schedule-day {
            background: rgba(0, 0, 0, 0.2);
            padding: 12px;
            border-radius: 6px;
            margin: 8px 0;
        }
        
        .day-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .day-name {
            font-weight: 600;
            color: white;
        }
        
        .intensity-select, .focus-select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10px;
        }
        
        .effectiveness-grid {
            margin: 12px 0;
        }
        
        .effectiveness-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 6px 0;
            font-size: 10px;
        }
        
        .effectiveness-bar {
            width: 80px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 8px;
        }
        
        .effectiveness-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = widgetStyles;
    document.head.appendChild(style);

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => InteractiveWidgets.init(), 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => InteractiveWidgets.init(), 2000);
        });
    }

    // Make available for Chrome MCP testing
    window.InteractiveWidgets = InteractiveWidgets;

})();