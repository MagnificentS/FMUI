/**
 * TRAINING & ACADEMY COMPONENTS
 * Advanced training systems for football management with spatial innovation
 * 
 * Features:
 * - Training Schedule Planner with drag-and-drop
 * - Individual Player Development tracking
 * - Youth Academy Dashboard
 * - Fitness Monitoring Components
 * - Coaching Staff Analysis
 * - Training Session Designer
 */

class TrainingSystem {
    constructor() {
        this.φ = 1.618033988749;
        this.container = null;
        this.currentView = 'schedule';
        this.draggedElement = null;
        this.trainingData = this.generateTrainingData();
        this.initializeSystem();
    }

    generateTrainingData() {
        const playerNames = [
            'Marcus Johnson', 'David Rodriguez', 'Alex Thompson', 'James Wilson',
            'Michael Brown', 'Robert Garcia', 'William Martinez', 'Thomas Anderson',
            'Daniel Lee', 'Christopher Taylor', 'Joshua Davis', 'Kevin Miller',
            'Anthony Moore', 'Mark Jackson', 'Steven White', 'Andrew Harris',
            'Ryan Clark', 'Brian Lewis', 'Nicholas Young', 'Matthew Walker',
            'Carlos Hernandez', 'Diego Morales', 'Pablo Sanchez', 'Luis Gomez',
            'Alessandro Rossi', 'Marco Ferrari', 'Giovanni Bianchi', 'Francesco Romano'
        ];

        const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'ST', 'LW', 'RW'];
        const trainingCategories = ['Technical', 'Physical', 'Mental', 'Tactical'];
        const drillTypes = ['Shooting', 'Passing', 'Crossing', 'Defending', 'Fitness', 'Set Pieces'];

        return {
            players: playerNames.map((name, index) => ({
                id: index + 1,
                name: name,
                age: 16 + Math.floor(Math.random() * 20),
                position: positions[Math.floor(Math.random() * positions.length)],
                overall: 45 + Math.floor(Math.random() * 50),
                potential: 60 + Math.floor(Math.random() * 35),
                fitness: Math.random() * 100,
                condition: Math.random() * 100,
                morale: Math.random() * 100,
                form: Math.random() * 100,
                sharpness: Math.random() * 100,
                attributes: {
                    technical: Math.floor(Math.random() * 20) + 1,
                    mental: Math.floor(Math.random() * 20) + 1,
                    physical: Math.floor(Math.random() * 20) + 1,
                    goalkeeper: position === 'GK' ? Math.floor(Math.random() * 20) + 1 : null
                },
                development: {
                    progressThisMonth: Math.random() * 5,
                    trainingFocus: trainingCategories[Math.floor(Math.random() * trainingCategories.length)],
                    injuryRisk: Math.random() * 100,
                    trainingHappiness: Math.random() * 100
                },
                trainingHistory: this.generateTrainingHistory()
            })),
            
            schedule: this.generateWeeklySchedule(),
            
            academy: {
                rating: 3.5,
                facilities: 4,
                coaching: 3,
                juniorsCoaching: 4,
                youthRecruitment: 3,
                youthCoaching: 4,
                graduates: this.generateGraduates(),
                intake: this.generateIntake()
            },
            
            staff: this.generateCoachingStaff(),
            
            sessions: this.generateTrainingSessions()
        };
    }

    generateTrainingHistory() {
        const history = [];
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            history.push({
                date: date.toISOString().split('T')[0],
                fitness: Math.random() * 100,
                sharpness: Math.random() * 100,
                condition: Math.random() * 100,
                trainingRating: Math.random() * 10
            });
        }
        return history;
    }

    generateWeeklySchedule() {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const sessions = ['Morning Training', 'Afternoon Training', 'Recovery', 'Match Day', 'Rest'];
        
        return days.map(day => ({
            day: day,
            sessions: [
                {
                    time: '09:00',
                    type: sessions[Math.floor(Math.random() * sessions.length)],
                    intensity: Math.random() * 5,
                    duration: 60 + Math.random() * 60,
                    focus: ['Technical', 'Physical', 'Tactical', 'Mental'][Math.floor(Math.random() * 4)]
                },
                {
                    time: '15:00',
                    type: sessions[Math.floor(Math.random() * sessions.length)],
                    intensity: Math.random() * 5,
                    duration: 60 + Math.random() * 60,
                    focus: ['Technical', 'Physical', 'Tactical', 'Mental'][Math.floor(Math.random() * 4)]
                }
            ]
        }));
    }

    generateGraduates() {
        return [
            { name: 'Marcus Thompson', year: 2023, currentClub: 'Manchester United', value: '£25M', success: 95 },
            { name: 'Jake Wilson', year: 2022, currentClub: 'Chelsea', value: '£18M', success: 88 },
            { name: 'Alex Rodriguez', year: 2021, currentClub: 'Arsenal', value: '£12M', success: 82 },
            { name: 'David Brown', year: 2020, currentClub: 'Liverpool', value: '£8M', success: 75 },
            { name: 'Sam Johnson', year: 2019, currentClub: 'Tottenham', value: '£6M', success: 70 }
        ];
    }

    generateIntake() {
        return [
            { name: 'Oliver Martinez', age: 16, potential: 85, position: 'ST', nationality: 'Spain' },
            { name: 'Liam O\'Connor', age: 17, potential: 78, position: 'CM', nationality: 'Ireland' },
            { name: 'Noah Anderson', age: 16, potential: 82, position: 'CB', nationality: 'England' },
            { name: 'Lucas Silva', age: 17, potential: 89, position: 'LW', nationality: 'Brazil' }
        ];
    }

    generateCoachingStaff() {
        return [
            {
                name: 'John Smith',
                role: 'Head of Youth Development',
                speciality: 'Technical',
                reputation: 4,
                effectiveness: 85,
                contract: '2025-06-30'
            },
            {
                name: 'Carlos Rodriguez',
                role: 'Fitness Coach',
                speciality: 'Physical',
                reputation: 3,
                effectiveness: 78,
                contract: '2024-12-31'
            },
            {
                name: 'Sarah Johnson',
                role: 'Goalkeeping Coach',
                speciality: 'Technical',
                reputation: 4,
                effectiveness: 92,
                contract: '2026-06-30'
            }
        ];
    }

    generateTrainingSessions() {
        return [
            {
                name: 'Technical Finishing',
                focus: 'Technical',
                intensity: 3,
                duration: 90,
                drills: ['1v1 Finishing', 'Weak Foot Practice', 'Volleys'],
                effectiveness: 85
            },
            {
                name: 'Physical Conditioning',
                focus: 'Physical',
                intensity: 5,
                duration: 75,
                drills: ['Sprint Intervals', 'Strength Training', 'Agility'],
                effectiveness: 78
            },
            {
                name: 'Tactical Patterns',
                focus: 'Tactical',
                intensity: 2,
                duration: 120,
                drills: ['Positional Play', 'Set Pieces', 'Pressing'],
                effectiveness: 88
            }
        ];
    }

    initializeSystem() {
        this.createMainInterface();
        this.attachEventListeners();
    }

    createMainInterface() {
        this.container = document.createElement('div');
        this.container.className = 'training-system';
        this.container.innerHTML = `
            <div class="training-header">
                <h1 class="training-title">Training & Academy Center</h1>
                <div class="training-nav">
                    <button class="nav-btn active" data-view="schedule">Schedule</button>
                    <button class="nav-btn" data-view="development">Development</button>
                    <button class="nav-btn" data-view="academy">Academy</button>
                    <button class="nav-btn" data-view="fitness">Fitness</button>
                    <button class="nav-btn" data-view="staff">Staff</button>
                    <button class="nav-btn" data-view="designer">Designer</button>
                </div>
            </div>
            <div class="training-content">
                ${this.renderScheduleView()}
            </div>
        `;

        this.addStyles();
        document.body.appendChild(this.container);
    }

    renderScheduleView() {
        return `
            <div class="schedule-view">
                <div class="schedule-controls">
                    <div class="week-navigation">
                        <button class="week-btn">&lt; Previous Week</button>
                        <span class="current-week">Week of March 18, 2024</span>
                        <button class="week-btn">Next Week &gt;</button>
                    </div>
                    <div class="schedule-actions">
                        <button class="action-btn">Save Template</button>
                        <button class="action-btn">Load Template</button>
                        <button class="action-btn">Auto-Generate</button>
                    </div>
                </div>
                
                <div class="schedule-grid">
                    <div class="schedule-header">
                        <div class="time-column">Time</div>
                        ${this.trainingData.schedule.map(day => `
                            <div class="day-column">${day.day}</div>
                        `).join('')}
                    </div>
                    
                    <div class="schedule-body">
                        ${this.renderTimeSlots()}
                    </div>
                </div>
                
                <div class="session-library">
                    <h3>Session Library</h3>
                    <div class="session-items">
                        ${this.trainingData.sessions.map(session => `
                            <div class="session-item draggable" data-session="${session.name}">
                                <div class="session-name">${session.name}</div>
                                <div class="session-details">
                                    <span class="intensity-${Math.floor(session.intensity)}">
                                        Intensity: ${session.intensity}/5
                                    </span>
                                    <span>${session.duration}min</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="workload-overview">
                    <h3>Squad Workload Analysis</h3>
                    <div class="workload-chart">
                        ${this.renderWorkloadChart()}
                    </div>
                </div>
            </div>
        `;
    }

    renderTimeSlots() {
        const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
        
        return times.map(time => `
            <div class="time-row">
                <div class="time-label">${time}</div>
                ${this.trainingData.schedule.map(day => `
                    <div class="schedule-cell drop-zone" data-time="${time}" data-day="${day.day}">
                        ${this.getSessionForTimeSlot(day.day, time)}
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    getSessionForTimeSlot(day, time) {
        // Find existing session for this time slot
        const dayData = this.trainingData.schedule.find(d => d.day === day);
        const session = dayData?.sessions.find(s => s.time === time);
        
        if (session) {
            return `
                <div class="scheduled-session intensity-${Math.floor(session.intensity)}">
                    <div class="session-type">${session.type}</div>
                    <div class="session-focus">${session.focus}</div>
                    <div class="session-duration">${session.duration}min</div>
                </div>
            `;
        }
        
        return '<div class="empty-slot">Drop session here</div>';
    }

    renderWorkloadChart() {
        return `
            <div class="workload-bars">
                ${this.trainingData.players.slice(0, 11).map(player => `
                    <div class="player-workload">
                        <div class="player-name">${player.name.split(' ')[1]}</div>
                        <div class="workload-bar">
                            <div class="load-segment training" style="width: ${player.fitness * 0.4}%"></div>
                            <div class="load-segment recovery" style="width: ${(100 - player.fitness) * 0.3}%"></div>
                            <div class="load-segment rest" style="width: ${Math.random() * 20 + 10}%"></div>
                        </div>
                        <div class="injury-risk ${player.development.injuryRisk > 70 ? 'high' : player.development.injuryRisk > 40 ? 'medium' : 'low'}">
                            ${Math.floor(player.development.injuryRisk)}%
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderDevelopmentView() {
        return `
            <div class="development-view">
                <div class="development-controls">
                    <div class="player-selector">
                        <select id="playerSelect">
                            <option value="">Select Player</option>
                            ${this.trainingData.players.map(player => `
                                <option value="${player.id}">${player.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="view-options">
                        <button class="view-btn active" data-view="individual">Individual</button>
                        <button class="view-btn" data-view="comparison">Comparison</button>
                        <button class="view-btn" data-view="squad">Squad Overview</button>
                    </div>
                </div>
                
                <div class="development-content">
                    ${this.renderIndividualDevelopment()}
                </div>
            </div>
        `;
    }

    renderIndividualDevelopment() {
        const player = this.trainingData.players[0]; // Default to first player
        
        return `
            <div class="individual-development">
                <div class="player-card">
                    <div class="player-info">
                        <h3>${player.name}</h3>
                        <div class="player-stats">
                            <span class="position">${player.position}</span>
                            <span class="age">Age: ${player.age}</span>
                            <span class="overall">Overall: ${player.overall}</span>
                            <span class="potential">Potential: ${player.potential}</span>
                        </div>
                    </div>
                    
                    <div class="development-progress">
                        <div class="progress-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" class="progress-bg"></circle>
                                <circle cx="50" cy="50" r="40" class="progress-fill" 
                                        style="stroke-dasharray: ${(player.overall / player.potential) * 251.2} 251.2"></circle>
                            </svg>
                            <div class="progress-text">
                                <span class="current">${player.overall}</span>
                                <span class="max">/${player.potential}</span>
                            </div>
                        </div>
                        <div class="progress-details">
                            <div class="progress-this-month">
                                <span>+${player.development.progressThisMonth.toFixed(1)}</span>
                                <small>This Month</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="attribute-development">
                    <h4>Attribute Development</h4>
                    <div class="attribute-grid">
                        ${Object.entries(player.attributes).map(([attr, value]) => 
                            value !== null ? `
                                <div class="attribute-item">
                                    <div class="attribute-name">${attr.charAt(0).toUpperCase() + attr.slice(1)}</div>
                                    <div class="attribute-bar">
                                        <div class="bar-fill" style="width: ${(value / 20) * 100}%"></div>
                                        <span class="attribute-value">${value}</span>
                                    </div>
                                    <div class="attribute-trend ${Math.random() > 0.5 ? 'up' : 'down'}">
                                        ${Math.random() > 0.5 ? '↗' : '↘'}
                                    </div>
                                </div>
                            ` : ''
                        ).join('')}
                    </div>
                </div>
                
                <div class="training-focus">
                    <h4>Training Focus Recommendations</h4>
                    <div class="focus-options">
                        <div class="focus-option recommended">
                            <div class="focus-type">Technical Training</div>
                            <div class="focus-benefit">+15% finishing development</div>
                            <div class="focus-duration">4-6 weeks recommended</div>
                        </div>
                        <div class="focus-option">
                            <div class="focus-type">Physical Conditioning</div>
                            <div class="focus-benefit">+10% stamina & pace</div>
                            <div class="focus-duration">3-4 weeks recommended</div>
                        </div>
                        <div class="focus-option">
                            <div class="focus-type">Mental Training</div>
                            <div class="focus-benefit">+12% decisions & composure</div>
                            <div class="focus-duration">2-3 weeks recommended</div>
                        </div>
                    </div>
                </div>
                
                <div class="development-chart">
                    <h4>Development Timeline</h4>
                    <div class="timeline-chart">
                        ${this.renderDevelopmentTimeline(player)}
                    </div>
                </div>
            </div>
        `;
    }

    renderDevelopmentTimeline(player) {
        return `
            <svg class="timeline-svg" viewBox="0 0 800 200">
                <defs>
                    <linearGradient id="developmentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#4CAF50;stop-opacity:0.2" />
                    </linearGradient>
                </defs>
                
                <!-- Grid lines -->
                ${Array.from({length: 5}, (_, i) => `
                    <line x1="50" y1="${40 + i * 30}" x2="750" y2="${40 + i * 30}" 
                          stroke="#333" stroke-width="0.5" opacity="0.3"/>
                `).join('')}
                
                <!-- Development curve -->
                <path d="M 50 150 Q 200 140 350 120 Q 500 100 650 80 Q 700 70 750 60" 
                      stroke="#4CAF50" stroke-width="3" fill="none"/>
                      
                <!-- Data points -->
                ${player.trainingHistory.slice(-12).map((point, i) => `
                    <circle cx="${50 + i * 58}" cy="${160 - (point.trainingRating * 10)}" 
                            r="4" fill="#4CAF50" opacity="0.8">
                        <title>Rating: ${point.trainingRating.toFixed(1)}</title>
                    </circle>
                `).join('')}
                
                <!-- Axis labels -->
                <text x="25" y="50" text-anchor="middle" class="axis-label">10</text>
                <text x="25" y="110" text-anchor="middle" class="axis-label">5</text>
                <text x="25" y="170" text-anchor="middle" class="axis-label">0</text>
            </svg>
        `;
    }

    renderAcademyView() {
        return `
            <div class="academy-view">
                <div class="academy-overview">
                    <div class="academy-rating">
                        <h3>Academy Rating</h3>
                        <div class="rating-display">
                            <div class="rating-stars">
                                ${this.renderStars(this.trainingData.academy.rating)}
                            </div>
                            <span class="rating-value">${this.trainingData.academy.rating}/5</span>
                        </div>
                    </div>
                    
                    <div class="academy-facilities">
                        <h4>Facilities & Staff</h4>
                        <div class="facility-grid">
                            <div class="facility-item">
                                <span class="facility-name">Training Facilities</span>
                                <div class="facility-rating">
                                    ${this.renderStars(this.trainingData.academy.facilities)}
                                </div>
                            </div>
                            <div class="facility-item">
                                <span class="facility-name">Youth Coaching</span>
                                <div class="facility-rating">
                                    ${this.renderStars(this.trainingData.academy.youthCoaching)}
                                </div>
                            </div>
                            <div class="facility-item">
                                <span class="facility-name">Youth Recruitment</span>
                                <div class="facility-rating">
                                    ${this.renderStars(this.trainingData.academy.youthRecruitment)}
                                </div>
                            </div>
                            <div class="facility-item">
                                <span class="facility-name">Juniors Coaching</span>
                                <div class="facility-rating">
                                    ${this.renderStars(this.trainingData.academy.juniorsCoaching)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="academy-graduates">
                    <h4>Recent Graduates</h4>
                    <div class="graduates-list">
                        ${this.trainingData.academy.graduates.map(graduate => `
                            <div class="graduate-item">
                                <div class="graduate-info">
                                    <span class="graduate-name">${graduate.name}</span>
                                    <span class="graduate-year">Class of ${graduate.year}</span>
                                </div>
                                <div class="graduate-success">
                                    <span class="current-club">${graduate.currentClub}</span>
                                    <span class="market-value">${graduate.value}</span>
                                    <div class="success-bar">
                                        <div class="success-fill" style="width: ${graduate.success}%"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="youth-intake">
                    <h4>Youth Intake 2024</h4>
                    <div class="intake-prospects">
                        ${this.trainingData.academy.intake.map(prospect => `
                            <div class="prospect-card">
                                <div class="prospect-header">
                                    <span class="prospect-name">${prospect.name}</span>
                                    <span class="prospect-age">Age: ${prospect.age}</span>
                                </div>
                                <div class="prospect-details">
                                    <span class="prospect-position">${prospect.position}</span>
                                    <span class="prospect-nationality">${prospect.nationality}</span>
                                </div>
                                <div class="prospect-potential">
                                    <span>Potential: ${prospect.potential}</span>
                                    <div class="potential-bar">
                                        <div class="potential-fill" style="width: ${prospect.potential}%"></div>
                                    </div>
                                </div>
                                <div class="prospect-actions">
                                    <button class="scout-btn">Scout Report</button>
                                    <button class="contract-btn">Offer Contract</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="academy-investment">
                    <h4>Investment Analysis</h4>
                    <div class="investment-chart">
                        ${this.renderInvestmentROI()}
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return `
            ${'★'.repeat(fullStars)}
            ${hasHalfStar ? '☆' : ''}
            ${'☆'.repeat(emptyStars)}
        `;
    }

    renderInvestmentROI() {
        return `
            <div class="roi-metrics">
                <div class="roi-item">
                    <span class="roi-label">Investment (5 years)</span>
                    <span class="roi-value">£25M</span>
                </div>
                <div class="roi-item">
                    <span class="roi-label">Graduate Sales</span>
                    <span class="roi-value">£69M</span>
                </div>
                <div class="roi-item success">
                    <span class="roi-label">ROI</span>
                    <span class="roi-value">+176%</span>
                </div>
            </div>
            
            <div class="roi-breakdown">
                <h5>Revenue Breakdown</h5>
                <div class="breakdown-chart">
                    <div class="revenue-bar">
                        <div class="revenue-segment sales" style="width: 65%">Sales</div>
                        <div class="revenue-segment loans" style="width: 20%">Loans</div>
                        <div class="revenue-segment squad" style="width: 15%">Squad Value</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderFitnessView() {
        return `
            <div class="fitness-view">
                <div class="fitness-overview">
                    <div class="squad-fitness-heat">
                        <h4>Squad Fitness Overview</h4>
                        <div class="fitness-grid">
                            ${this.trainingData.players.slice(0, 25).map(player => `
                                <div class="player-fitness-cell fitness-${this.getFitnessLevel(player.fitness)}">
                                    <span class="player-initials">${this.getInitials(player.name)}</span>
                                    <span class="fitness-value">${Math.floor(player.fitness)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="fitness-legend">
                            <span class="legend-item fitness-excellent">Excellent (90+)</span>
                            <span class="legend-item fitness-good">Good (75-89)</span>
                            <span class="legend-item fitness-average">Average (60-74)</span>
                            <span class="legend-item fitness-poor">Poor (&lt;60)</span>
                        </div>
                    </div>
                    
                    <div class="injury-risk-analysis">
                        <h4>Injury Risk Assessment</h4>
                        <div class="risk-chart">
                            ${this.renderInjuryRiskChart()}
                        </div>
                    </div>
                </div>
                
                <div class="individual-monitoring">
                    <h4>Individual Player Monitoring</h4>
                    <div class="monitoring-controls">
                        <select class="player-select-fitness">
                            ${this.trainingData.players.map(player => `
                                <option value="${player.id}">${player.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="player-fitness-details">
                        ${this.renderPlayerFitnessDetails(this.trainingData.players[0])}
                    </div>
                </div>
                
                <div class="match-readiness">
                    <h4>Match Readiness Report</h4>
                    <div class="readiness-list">
                        ${this.trainingData.players.slice(0, 11).map(player => `
                            <div class="readiness-item">
                                <div class="player-info">
                                    <span class="player-name">${player.name}</span>
                                    <span class="player-position">${player.position}</span>
                                </div>
                                <div class="readiness-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Fitness</span>
                                        <div class="metric-bar fitness">
                                            <div class="bar-fill" style="width: ${player.fitness}%"></div>
                                        </div>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Condition</span>
                                        <div class="metric-bar condition">
                                            <div class="bar-fill" style="width: ${player.condition}%"></div>
                                        </div>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Sharpness</span>
                                        <div class="metric-bar sharpness">
                                            <div class="bar-fill" style="width: ${player.sharpness}%"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="readiness-status ${this.getReadinessStatus(player)}">
                                    ${this.getReadinessStatus(player).toUpperCase()}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getFitnessLevel(fitness) {
        if (fitness >= 90) return 'excellent';
        if (fitness >= 75) return 'good';
        if (fitness >= 60) return 'average';
        return 'poor';
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('');
    }

    getReadinessStatus(player) {
        const avgFitness = (player.fitness + player.condition + player.sharpness) / 3;
        if (avgFitness >= 85) return 'ready';
        if (avgFitness >= 70) return 'available';
        if (avgFitness >= 55) return 'doubtful';
        return 'unavailable';
    }

    renderInjuryRiskChart() {
        const riskLevels = this.trainingData.players.reduce((acc, player) => {
            const risk = player.development.injuryRisk;
            if (risk >= 80) acc.high++;
            else if (risk >= 50) acc.medium++;
            else acc.low++;
            return acc;
        }, { high: 0, medium: 0, low: 0 });

        const total = riskLevels.high + riskLevels.medium + riskLevels.low;

        return `
            <div class="risk-distribution">
                <div class="risk-segment high" style="width: ${(riskLevels.high / total) * 100}%">
                    <span>High Risk: ${riskLevels.high}</span>
                </div>
                <div class="risk-segment medium" style="width: ${(riskLevels.medium / total) * 100}%">
                    <span>Medium Risk: ${riskLevels.medium}</span>
                </div>
                <div class="risk-segment low" style="width: ${(riskLevels.low / total) * 100}%">
                    <span>Low Risk: ${riskLevels.low}</span>
                </div>
            </div>
        `;
    }

    renderPlayerFitnessDetails(player) {
        return `
            <div class="fitness-trends">
                <div class="trend-chart">
                    <h5>30-Day Fitness Trend</h5>
                    <svg class="trend-svg" viewBox="0 0 400 150">
                        <!-- Fitness line -->
                        <polyline points="${player.trainingHistory.map((point, i) => 
                            `${10 + i * 12},${140 - (point.fitness * 1.2)}`
                        ).join(' ')}" 
                        stroke="#4CAF50" stroke-width="2" fill="none"/>
                        
                        <!-- Condition line -->
                        <polyline points="${player.trainingHistory.map((point, i) => 
                            `${10 + i * 12},${140 - (point.condition * 1.2)}`
                        ).join(' ')}" 
                        stroke="#2196F3" stroke-width="2" fill="none"/>
                        
                        <!-- Sharpness line -->
                        <polyline points="${player.trainingHistory.map((point, i) => 
                            `${10 + i * 12},${140 - (point.sharpness * 1.2)}`
                        ).join(' ')}" 
                        stroke="#FF9800" stroke-width="2" fill="none"/>
                    </svg>
                    <div class="trend-legend">
                        <span class="legend-fitness">Fitness</span>
                        <span class="legend-condition">Condition</span>
                        <span class="legend-sharpness">Sharpness</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderStaffView() {
        return `
            <div class="staff-view">
                <div class="staff-overview">
                    <h4>Coaching Staff Analysis</h4>
                    <div class="staff-grid">
                        ${this.trainingData.staff.map(coach => `
                            <div class="coach-card">
                                <div class="coach-header">
                                    <h5>${coach.name}</h5>
                                    <span class="coach-role">${coach.role}</span>
                                </div>
                                <div class="coach-stats">
                                    <div class="stat-item">
                                        <span class="stat-label">Speciality</span>
                                        <span class="stat-value">${coach.speciality}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Reputation</span>
                                        <div class="reputation-stars">
                                            ${this.renderStars(coach.reputation)}
                                        </div>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Effectiveness</span>
                                        <div class="effectiveness-bar">
                                            <div class="bar-fill" style="width: ${coach.effectiveness}%"></div>
                                            <span>${coach.effectiveness}%</span>
                                        </div>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Contract Until</span>
                                        <span class="stat-value">${coach.contract}</span>
                                    </div>
                                </div>
                                <div class="coach-actions">
                                    <button class="action-btn">Extend Contract</button>
                                    <button class="action-btn">View Details</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="staff-performance">
                    <h4>Staff Performance Tracking</h4>
                    <div class="performance-chart">
                        ${this.renderStaffPerformanceChart()}
                    </div>
                </div>
                
                <div class="staff-recommendations">
                    <h4>Recruitment Recommendations</h4>
                    <div class="recommendation-list">
                        <div class="recommendation-item">
                            <div class="recommendation-role">Defensive Coach</div>
                            <div class="recommendation-reason">Current defensive training effectiveness is below optimal</div>
                            <div class="recommendation-priority high">High Priority</div>
                        </div>
                        <div class="recommendation-item">
                            <div class="recommendation-role">Sports Scientist</div>
                            <div class="recommendation-reason">Advanced fitness monitoring capabilities needed</div>
                            <div class="recommendation-priority medium">Medium Priority</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStaffPerformanceChart() {
        return `
            <div class="performance-metrics">
                ${this.trainingData.staff.map(coach => `
                    <div class="coach-performance">
                        <div class="coach-name">${coach.name}</div>
                        <div class="performance-graph">
                            <div class="performance-bar">
                                <div class="performance-fill" style="width: ${coach.effectiveness}%">
                                    ${coach.effectiveness}%
                                </div>
                            </div>
                        </div>
                        <div class="performance-trend ${Math.random() > 0.5 ? 'up' : 'stable'}">
                            ${Math.random() > 0.5 ? '↗ Improving' : '→ Stable'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderDesignerView() {
        return `
            <div class="designer-view">
                <div class="session-builder">
                    <h4>Training Session Designer</h4>
                    <div class="builder-interface">
                        <div class="drill-library">
                            <h5>Drill Library</h5>
                            <div class="drill-categories">
                                <button class="category-btn active" data-category="technical">Technical</button>
                                <button class="category-btn" data-category="physical">Physical</button>
                                <button class="category-btn" data-category="tactical">Tactical</button>
                                <button class="category-btn" data-category="mental">Mental</button>
                            </div>
                            <div class="drill-list">
                                ${this.renderDrillList('technical')}
                            </div>
                        </div>
                        
                        <div class="session-canvas">
                            <h5>Session Timeline</h5>
                            <div class="timeline-container">
                                <div class="timeline-track" id="sessionTimeline">
                                    <div class="time-markers">
                                        ${Array.from({length: 13}, (_, i) => `
                                            <div class="time-marker" style="left: ${i * 7.69}%">
                                                ${i * 10}min
                                            </div>
                                        `).join('')}
                                    </div>
                                    <div class="drill-track" data-track="warmup">
                                        <span class="track-label">Warm-up</span>
                                    </div>
                                    <div class="drill-track" data-track="main">
                                        <span class="track-label">Main Phase</span>
                                    </div>
                                    <div class="drill-track" data-track="cooldown">
                                        <span class="track-label">Cool-down</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="session-properties">
                            <h5>Session Properties</h5>
                            <div class="property-controls">
                                <div class="control-group">
                                    <label>Session Name</label>
                                    <input type="text" placeholder="Enter session name">
                                </div>
                                <div class="control-group">
                                    <label>Duration</label>
                                    <input type="range" min="30" max="180" value="90">
                                    <span>90 minutes</span>
                                </div>
                                <div class="control-group">
                                    <label>Intensity</label>
                                    <input type="range" min="1" max="5" value="3">
                                    <span>3/5</span>
                                </div>
                                <div class="control-group">
                                    <label>Focus Area</label>
                                    <select>
                                        <option>Technical</option>
                                        <option>Physical</option>
                                        <option>Tactical</option>
                                        <option>Mental</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="session-analytics">
                    <h4>Session Effectiveness Prediction</h4>
                    <div class="analytics-panel">
                        <div class="effectiveness-meter">
                            <div class="meter-gauge">
                                <div class="gauge-fill" style="transform: rotate(${Math.random() * 180}deg)"></div>
                                <div class="gauge-center">
                                    <span class="effectiveness-score">78%</span>
                                    <small>Predicted Effectiveness</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="effectiveness-breakdown">
                            <div class="breakdown-item">
                                <span class="breakdown-label">Player Engagement</span>
                                <div class="breakdown-bar">
                                    <div class="bar-fill" style="width: 85%"></div>
                                </div>
                                <span class="breakdown-value">85%</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Skill Development</span>
                                <div class="breakdown-bar">
                                    <div class="bar-fill" style="width: 72%"></div>
                                </div>
                                <span class="breakdown-value">72%</span>
                            </div>
                            <div class="breakdown-item">
                                <span class="breakdown-label">Fitness Impact</span>
                                <div class="breakdown-bar">
                                    <div class="bar-fill" style="width: 68%"></div>
                                </div>
                                <span class="breakdown-value">68%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderDrillList(category) {
        const drills = {
            technical: [
                { name: '1v1 Finishing', duration: 15, intensity: 3, description: 'Individual finishing practice' },
                { name: 'Passing Accuracy', duration: 20, intensity: 2, description: 'Short and long passing drills' },
                { name: 'Ball Control', duration: 10, intensity: 2, description: 'First touch and close control' },
                { name: 'Crossing Practice', duration: 15, intensity: 3, description: 'Wide play and crossing' }
            ],
            physical: [
                { name: 'Sprint Intervals', duration: 20, intensity: 5, description: 'High intensity running' },
                { name: 'Strength Training', duration: 30, intensity: 4, description: 'Core and leg strength' },
                { name: 'Agility Ladders', duration: 15, intensity: 3, description: 'Quick feet and coordination' },
                { name: 'Endurance Running', duration: 25, intensity: 3, description: 'Aerobic fitness building' }
            ],
            tactical: [
                { name: 'Positional Play', duration: 25, intensity: 2, description: 'Formation and positioning' },
                { name: 'Pressing Triggers', duration: 20, intensity: 3, description: 'When and how to press' },
                { name: 'Set Piece Practice', duration: 30, intensity: 2, description: 'Corners and free kicks' },
                { name: 'Counter Attack', duration: 20, intensity: 4, description: 'Quick transition play' }
            ],
            mental: [
                { name: 'Decision Making', duration: 20, intensity: 2, description: 'Quick thinking scenarios' },
                { name: 'Concentration', duration: 15, intensity: 1, description: 'Focus under pressure' },
                { name: 'Communication', duration: 10, intensity: 1, description: 'On-field communication' },
                { name: 'Visualization', duration: 15, intensity: 1, description: 'Mental preparation techniques' }
            ]
        };

        return drills[category].map(drill => `
            <div class="drill-item draggable" data-drill="${drill.name}">
                <div class="drill-header">
                    <span class="drill-name">${drill.name}</span>
                    <span class="drill-duration">${drill.duration}min</span>
                </div>
                <div class="drill-details">
                    <span class="drill-intensity intensity-${drill.intensity}">
                        ${'●'.repeat(drill.intensity)}${'○'.repeat(5 - drill.intensity)}
                    </span>
                    <span class="drill-description">${drill.description}</span>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Navigation
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-btn')) {
                this.switchView(e.target.dataset.view);
            }
        });

        // Drag and drop for schedule
        this.container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable')) {
                this.draggedElement = e.target;
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        this.container.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                e.target.classList.add('drag-over');
            }
        });

        this.container.addEventListener('dragleave', (e) => {
            e.target.classList.remove('drag-over');
        });

        this.container.addEventListener('drop', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                this.handleDrop(e.target, this.draggedElement);
            }
        });

        // Make draggable items actually draggable
        this.container.addEventListener('dragstart', (e) => {
            if (e.target.closest('.draggable')) {
                const draggable = e.target.closest('.draggable');
                draggable.style.opacity = '0.5';
            }
        });

        this.container.addEventListener('dragend', (e) => {
            if (e.target.closest('.draggable')) {
                const draggable = e.target.closest('.draggable');
                draggable.style.opacity = '1';
            }
        });

        // Player selection
        this.container.addEventListener('change', (e) => {
            if (e.target.id === 'playerSelect' || e.target.classList.contains('player-select-fitness')) {
                this.handlePlayerSelection(e.target.value);
            }
        });

        // Category switching in designer
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                this.switchDrillCategory(e.target.dataset.category);
            }
        });
    }

    handleDrop(dropZone, draggedElement) {
        if (!draggedElement) return;

        const sessionName = draggedElement.dataset.session;
        const time = dropZone.dataset.time;
        const day = dropZone.dataset.day;

        // Create scheduled session element
        const sessionElement = document.createElement('div');
        sessionElement.className = 'scheduled-session intensity-3';
        sessionElement.innerHTML = `
            <div class="session-type">${sessionName}</div>
            <div class="session-focus">Technical</div>
            <div class="session-duration">90min</div>
            <button class="remove-session" onclick="this.parentElement.remove()">×</button>
        `;

        // Replace empty slot
        dropZone.innerHTML = '';
        dropZone.appendChild(sessionElement);

        console.log(`Scheduled ${sessionName} for ${day} at ${time}`);
    }

    handlePlayerSelection(playerId) {
        if (!playerId) return;
        
        const player = this.trainingData.players.find(p => p.id == playerId);
        if (player && this.currentView === 'development') {
            this.updateDevelopmentView(player);
        } else if (player && this.currentView === 'fitness') {
            this.updateFitnessView(player);
        }
    }

    updateDevelopmentView(player) {
        const contentArea = this.container.querySelector('.development-content');
        contentArea.innerHTML = this.renderIndividualDevelopment();
    }

    updateFitnessView(player) {
        const detailsArea = this.container.querySelector('.player-fitness-details');
        if (detailsArea) {
            detailsArea.innerHTML = this.renderPlayerFitnessDetails(player);
        }
    }

    switchView(viewName) {
        this.currentView = viewName;
        
        // Update navigation
        this.container.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update content
        const contentArea = this.container.querySelector('.training-content');
        switch (viewName) {
            case 'schedule':
                contentArea.innerHTML = this.renderScheduleView();
                break;
            case 'development':
                contentArea.innerHTML = this.renderDevelopmentView();
                break;
            case 'academy':
                contentArea.innerHTML = this.renderAcademyView();
                break;
            case 'fitness':
                contentArea.innerHTML = this.renderFitnessView();
                break;
            case 'staff':
                contentArea.innerHTML = this.renderStaffView();
                break;
            case 'designer':
                contentArea.innerHTML = this.renderDesignerView();
                break;
        }

        // Re-enable draggable items
        this.enableDragAndDrop();
    }

    switchDrillCategory(category) {
        // Update category buttons
        this.container.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update drill list
        const drillList = this.container.querySelector('.drill-list');
        if (drillList) {
            drillList.innerHTML = this.renderDrillList(category);
            this.enableDragAndDrop();
        }
    }

    enableDragAndDrop() {
        // Make all draggable items actually draggable
        this.container.querySelectorAll('.draggable').forEach(item => {
            item.draggable = true;
        });
    }

    addStyles() {
        const styles = `
            <style>
            .training-system {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #ffffff;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                min-height: 100vh;
                padding: 20px;
            }

            .training-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
            }

            .training-title {
                font-size: 2.5em;
                font-weight: 300;
                margin: 0;
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .training-nav {
                display: flex;
                gap: 10px;
            }

            .nav-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .nav-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .nav-btn.active {
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                border-color: #4CAF50;
            }

            /* Schedule View Styles */
            .schedule-view {
                display: grid;
                grid-template-columns: 1fr 300px;
                gap: 30px;
                grid-template-rows: auto 1fr auto;
            }

            .schedule-controls {
                grid-column: 1 / -1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .week-navigation {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .week-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .week-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .current-week {
                font-size: 1.2em;
                font-weight: 600;
            }

            .schedule-actions {
                display: flex;
                gap: 10px;
            }

            .action-btn {
                background: linear-gradient(45deg, #2196F3, #03A9F4);
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
            }

            .schedule-grid {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .schedule-header {
                display: grid;
                grid-template-columns: 100px repeat(7, 1fr);
                gap: 10px;
                margin-bottom: 20px;
                font-weight: 600;
                color: #4CAF50;
            }

            .schedule-body {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .time-row {
                display: grid;
                grid-template-columns: 100px repeat(7, 1fr);
                gap: 10px;
                align-items: center;
            }

            .time-label {
                font-weight: 600;
                color: #888;
                text-align: center;
            }

            .schedule-cell {
                min-height: 80px;
                background: rgba(255, 255, 255, 0.03);
                border: 2px dashed rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
            }

            .schedule-cell.drag-over {
                border-color: #4CAF50;
                background: rgba(76, 175, 80, 0.1);
            }

            .scheduled-session {
                width: 100%;
                height: 100%;
                padding: 10px;
                border-radius: 6px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
            }

            .intensity-1 { background: linear-gradient(135deg, #4CAF50, #66BB6A); }
            .intensity-2 { background: linear-gradient(135deg, #8BC34A, #9CCC65); }
            .intensity-3 { background: linear-gradient(135deg, #FFC107, #FFD54F); }
            .intensity-4 { background: linear-gradient(135deg, #FF9800, #FFB74D); }
            .intensity-5 { background: linear-gradient(135deg, #F44336, #EF5350); }

            .session-type {
                font-weight: 600;
                font-size: 0.9em;
            }

            .session-focus {
                font-size: 0.8em;
                opacity: 0.8;
            }

            .session-duration {
                font-size: 0.7em;
                opacity: 0.7;
            }

            .empty-slot {
                color: #666;
                font-style: italic;
            }

            .remove-session {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(244, 67, 54, 0.8);
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .session-library {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .session-library h3 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .session-items {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .session-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: grab;
                transition: all 0.3s ease;
            }

            .session-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(5px);
            }

            .session-item.draggable {
                user-select: none;
            }

            .session-item:active {
                cursor: grabbing;
            }

            .session-name {
                font-weight: 600;
                display: block;
                margin-bottom: 5px;
            }

            .session-details {
                display: flex;
                justify-content: space-between;
                font-size: 0.8em;
                opacity: 0.8;
            }

            .workload-overview {
                grid-column: 1 / -1;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .workload-overview h3 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .workload-bars {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .player-workload {
                display: grid;
                grid-template-columns: 100px 1fr 60px;
                gap: 15px;
                align-items: center;
            }

            .player-name {
                font-weight: 500;
                color: #ccc;
            }

            .workload-bar {
                height: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                display: flex;
                overflow: hidden;
            }

            .load-segment {
                height: 100%;
                transition: width 0.3s ease;
            }

            .load-segment.training {
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
            }

            .load-segment.recovery {
                background: linear-gradient(90deg, #FFC107, #FFD54F);
            }

            .load-segment.rest {
                background: linear-gradient(90deg, #2196F3, #42A5F5);
            }

            .injury-risk {
                text-align: center;
                font-size: 0.8em;
                font-weight: 600;
                padding: 4px 8px;
                border-radius: 4px;
            }

            .injury-risk.low {
                background: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }

            .injury-risk.medium {
                background: rgba(255, 193, 7, 0.2);
                color: #FFC107;
            }

            .injury-risk.high {
                background: rgba(244, 67, 54, 0.2);
                color: #F44336;
            }

            /* Development View Styles */
            .development-view {
                display: flex;
                flex-direction: column;
                gap: 30px;
            }

            .development-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .player-selector select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 10px 15px;
                border-radius: 6px;
                font-size: 1em;
                min-width: 200px;
            }

            .view-options {
                display: flex;
                gap: 10px;
            }

            .view-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .view-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .view-btn.active {
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                border-color: #4CAF50;
            }

            .individual-development {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                grid-template-rows: auto auto auto;
            }

            .player-card {
                background: rgba(255, 255, 255, 0.05);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .player-info h3 {
                margin: 0 0 10px 0;
                font-size: 1.5em;
                color: #4CAF50;
            }

            .player-stats {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }

            .player-stats span {
                background: rgba(255, 255, 255, 0.1);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9em;
            }

            .development-progress {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .progress-circle {
                position: relative;
                width: 100px;
                height: 100px;
            }

            .progress-circle svg {
                transform: rotate(-90deg);
                width: 100%;
                height: 100%;
            }

            .progress-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.1);
                stroke-width: 8;
            }

            .progress-fill {
                fill: none;
                stroke: #4CAF50;
                stroke-width: 8;
                stroke-linecap: round;
                transition: stroke-dasharray 0.5s ease;
            }

            .progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                font-weight: 600;
            }

            .progress-text .current {
                font-size: 1.5em;
                color: #4CAF50;
            }

            .progress-text .max {
                font-size: 1em;
                color: #888;
            }

            .progress-this-month {
                text-align: center;
            }

            .progress-this-month span {
                display: block;
                font-size: 1.2em;
                font-weight: 600;
                color: #4CAF50;
            }

            .progress-this-month small {
                color: #888;
            }

            .attribute-development {
                grid-column: 1 / -1;
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .attribute-development h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .attribute-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }

            .attribute-item {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .attribute-name {
                min-width: 80px;
                font-weight: 500;
                color: #ccc;
            }

            .attribute-bar {
                flex: 1;
                height: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                position: relative;
                overflow: hidden;
            }

            .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                border-radius: 10px;
                transition: width 0.5s ease;
            }

            .attribute-value {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.8em;
                font-weight: 600;
                color: #ffffff;
            }

            .attribute-trend {
                font-size: 1.2em;
                font-weight: bold;
            }

            .attribute-trend.up {
                color: #4CAF50;
            }

            .attribute-trend.down {
                color: #F44336;
            }

            .training-focus {
                grid-column: 1 / -1;
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .training-focus h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .focus-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }

            .focus-option {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .focus-option:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }

            .focus-option.recommended {
                border-color: #4CAF50;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
            }

            .focus-type {
                font-weight: 600;
                font-size: 1.1em;
                margin-bottom: 8px;
                color: #4CAF50;
            }

            .focus-benefit {
                color: #ccc;
                margin-bottom: 5px;
            }

            .focus-duration {
                font-size: 0.9em;
                color: #888;
            }

            .development-chart {
                grid-column: 1 / -1;
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .development-chart h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .timeline-svg {
                width: 100%;
                height: 200px;
            }

            .axis-label {
                fill: #888;
                font-size: 12px;
            }

            /* Academy View Styles */
            .academy-view {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                grid-template-rows: auto auto auto;
            }

            .academy-overview {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .academy-rating {
                text-align: center;
                margin-bottom: 25px;
            }

            .academy-rating h3 {
                margin-top: 0;
                color: #4CAF50;
            }

            .rating-display {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
            }

            .rating-stars {
                font-size: 1.5em;
                color: #FFD700;
            }

            .rating-value {
                font-size: 1.2em;
                font-weight: 600;
                color: #4CAF50;
            }

            .academy-facilities h4 {
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .facility-grid {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .facility-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .facility-name {
                font-weight: 500;
                color: #ccc;
            }

            .facility-rating {
                color: #FFD700;
            }

            .academy-graduates {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .academy-graduates h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .graduates-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .graduate-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .graduate-info {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .graduate-name {
                font-weight: 600;
                color: #4CAF50;
            }

            .graduate-year {
                font-size: 0.9em;
                color: #888;
            }

            .graduate-success {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 5px;
            }

            .current-club {
                font-weight: 500;
                color: #ccc;
            }

            .market-value {
                font-weight: 600;
                color: #4CAF50;
            }

            .success-bar {
                width: 100px;
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
            }

            .success-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                border-radius: 3px;
                transition: width 0.5s ease;
            }

            .youth-intake {
                grid-column: 1 / -1;
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .youth-intake h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .intake-prospects {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
            }

            .prospect-card {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }

            .prospect-card:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }

            .prospect-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .prospect-name {
                font-weight: 600;
                color: #4CAF50;
            }

            .prospect-age {
                font-size: 0.9em;
                color: #888;
            }

            .prospect-details {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }

            .prospect-position {
                background: rgba(33, 150, 243, 0.2);
                color: #2196F3;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                font-weight: 600;
            }

            .prospect-nationality {
                color: #ccc;
                font-size: 0.9em;
            }

            .prospect-potential {
                margin-bottom: 15px;
            }

            .potential-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-top: 5px;
            }

            .potential-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .prospect-actions {
                display: flex;
                gap: 10px;
            }

            .scout-btn, .contract-btn {
                flex: 1;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9em;
            }

            .scout-btn:hover, .contract-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .contract-btn {
                background: linear-gradient(45deg, #4CAF50, #66BB6A);
                border-color: #4CAF50;
            }

            .academy-investment {
                grid-column: 1 / -1;
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .academy-investment h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .roi-metrics {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 25px;
            }

            .roi-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .roi-item.success {
                background: rgba(76, 175, 80, 0.1);
                border-color: #4CAF50;
            }

            .roi-label {
                font-size: 0.9em;
                color: #888;
                margin-bottom: 10px;
            }

            .roi-value {
                font-size: 1.5em;
                font-weight: 600;
                color: #4CAF50;
            }

            .roi-breakdown h5 {
                color: #4CAF50;
                margin-bottom: 15px;
            }

            .revenue-bar {
                height: 40px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                display: flex;
                overflow: hidden;
            }

            .revenue-segment {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                color: #ffffff;
                transition: all 0.3s ease;
            }

            .revenue-segment.sales {
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
            }

            .revenue-segment.loans {
                background: linear-gradient(90deg, #2196F3, #42A5F5);
            }

            .revenue-segment.squad {
                background: linear-gradient(90deg, #FF9800, #FFB74D);
            }

            /* Fitness View Styles */
            .fitness-view {
                display: flex;
                flex-direction: column;
                gap: 30px;
            }

            .fitness-overview {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }

            .squad-fitness-heat {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .squad-fitness-heat h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .fitness-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }

            .player-fitness-cell {
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .player-fitness-cell:hover {
                transform: scale(1.05);
            }

            .fitness-excellent {
                background: linear-gradient(135deg, #4CAF50, #66BB6A);
            }

            .fitness-good {
                background: linear-gradient(135deg, #8BC34A, #9CCC65);
            }

            .fitness-average {
                background: linear-gradient(135deg, #FFC107, #FFD54F);
            }

            .fitness-poor {
                background: linear-gradient(135deg, #F44336, #EF5350);
            }

            .player-initials {
                font-weight: 600;
                font-size: 0.8em;
            }

            .fitness-value {
                font-size: 0.7em;
                opacity: 0.8;
            }

            .fitness-legend {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .legend-item {
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8em;
                font-weight: 500;
            }

            .legend-item.fitness-excellent {
                background: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }

            .legend-item.fitness-good {
                background: rgba(139, 195, 74, 0.2);
                color: #8BC34A;
            }

            .legend-item.fitness-average {
                background: rgba(255, 193, 7, 0.2);
                color: #FFC107;
            }

            .legend-item.fitness-poor {
                background: rgba(244, 67, 54, 0.2);
                color: #F44336;
            }

            .injury-risk-analysis {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .injury-risk-analysis h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .risk-distribution {
                height: 60px;
                display: flex;
                border-radius: 8px;
                overflow: hidden;
            }

            .risk-segment {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                color: #ffffff;
                transition: all 0.3s ease;
            }

            .risk-segment.high {
                background: linear-gradient(135deg, #F44336, #EF5350);
            }

            .risk-segment.medium {
                background: linear-gradient(135deg, #FF9800, #FFB74D);
            }

            .risk-segment.low {
                background: linear-gradient(135deg, #4CAF50, #66BB6A);
            }

            .individual-monitoring {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .individual-monitoring h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .monitoring-controls {
                margin-bottom: 20px;
            }

            .player-select-fitness {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 10px 15px;
                border-radius: 6px;
                font-size: 1em;
                min-width: 200px;
            }

            .trend-chart h5 {
                color: #4CAF50;
                margin-bottom: 15px;
            }

            .trend-svg {
                width: 100%;
                height: 150px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
            }

            .trend-legend {
                display: flex;
                gap: 20px;
                justify-content: center;
                margin-top: 10px;
            }

            .legend-fitness {
                color: #4CAF50;
                font-weight: 500;
            }

            .legend-condition {
                color: #2196F3;
                font-weight: 500;
            }

            .legend-sharpness {
                color: #FF9800;
                font-weight: 500;
            }

            .match-readiness {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .match-readiness h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .readiness-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .readiness-item {
                display: grid;
                grid-template-columns: 200px 1fr 100px;
                gap: 20px;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .readiness-metrics {
                display: flex;
                gap: 15px;
            }

            .metric {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .metric-label {
                font-size: 0.8em;
                color: #888;
            }

            .metric-bar {
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                overflow: hidden;
            }

            .metric-bar.fitness .bar-fill {
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
            }

            .metric-bar.condition .bar-fill {
                background: linear-gradient(90deg, #2196F3, #42A5F5);
            }

            .metric-bar.sharpness .bar-fill {
                background: linear-gradient(90deg, #FF9800, #FFB74D);
            }

            .readiness-status {
                text-align: center;
                font-weight: 600;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9em;
            }

            .readiness-status.ready {
                background: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }

            .readiness-status.available {
                background: rgba(139, 195, 74, 0.2);
                color: #8BC34A;
            }

            .readiness-status.doubtful {
                background: rgba(255, 193, 7, 0.2);
                color: #FFC107;
            }

            .readiness-status.unavailable {
                background: rgba(244, 67, 54, 0.2);
                color: #F44336;
            }

            /* Staff View Styles */
            .staff-view {
                display: flex;
                flex-direction: column;
                gap: 30px;
            }

            .staff-overview {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .staff-overview h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .staff-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 20px;
            }

            .coach-card {
                background: rgba(255, 255, 255, 0.05);
                padding: 20px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }

            .coach-card:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }

            .coach-header {
                margin-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 10px;
            }

            .coach-header h5 {
                margin: 0 0 5px 0;
                color: #4CAF50;
                font-size: 1.2em;
            }

            .coach-role {
                color: #888;
                font-size: 0.9em;
            }

            .coach-stats {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 15px;
            }

            .stat-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .stat-label {
                color: #ccc;
                font-size: 0.9em;
            }

            .stat-value {
                color: #ffffff;
                font-weight: 500;
            }

            .reputation-stars {
                color: #FFD700;
            }

            .effectiveness-bar {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 100px;
            }

            .effectiveness-bar .bar-fill {
                flex: 1;
                height: 12px;
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                border-radius: 6px;
                position: relative;
            }

            .effectiveness-bar span {
                font-size: 0.8em;
                font-weight: 600;
                color: #4CAF50;
            }

            .coach-actions {
                display: flex;
                gap: 10px;
            }

            .coach-actions .action-btn {
                flex: 1;
                font-size: 0.9em;
                padding: 8px 12px;
            }

            .staff-performance {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .staff-performance h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .performance-metrics {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .coach-performance {
                display: grid;
                grid-template-columns: 150px 1fr 100px;
                gap: 20px;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .performance-graph {
                display: flex;
                align-items: center;
            }

            .performance-bar {
                flex: 1;
                height: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
            }

            .performance-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-weight: 600;
                font-size: 0.8em;
                transition: width 0.5s ease;
            }

            .performance-trend {
                text-align: center;
                font-size: 0.9em;
                font-weight: 500;
            }

            .performance-trend.up {
                color: #4CAF50;
            }

            .performance-trend.stable {
                color: #888;
            }

            .staff-recommendations {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .staff-recommendations h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .recommendation-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .recommendation-item {
                display: grid;
                grid-template-columns: 150px 1fr 100px;
                gap: 20px;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .recommendation-role {
                font-weight: 600;
                color: #4CAF50;
            }

            .recommendation-reason {
                color: #ccc;
                font-size: 0.9em;
            }

            .recommendation-priority {
                text-align: center;
                font-weight: 600;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 0.8em;
            }

            .recommendation-priority.high {
                background: rgba(244, 67, 54, 0.2);
                color: #F44336;
            }

            .recommendation-priority.medium {
                background: rgba(255, 193, 7, 0.2);
                color: #FFC107;
            }

            /* Designer View Styles */
            .designer-view {
                display: grid;
                grid-template-rows: 1fr auto;
                gap: 30px;
                height: calc(100vh - 150px);
            }

            .session-builder {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                overflow: hidden;
            }

            .session-builder h4 {
                margin: 0;
                padding: 20px 25px;
                background: rgba(76, 175, 80, 0.1);
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
            }

            .builder-interface {
                display: grid;
                grid-template-columns: 250px 1fr 250px;
                height: 500px;
            }

            .drill-library {
                padding: 20px;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                overflow-y: auto;
            }

            .drill-library h5 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .drill-categories {
                display: flex;
                flex-direction: column;
                gap: 5px;
                margin-bottom: 20px;
            }

            .category-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                font-size: 0.9em;
            }

            .category-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .category-btn.active {
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                border-color: #4CAF50;
            }

            .drill-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .drill-item {
                background: rgba(255, 255, 255, 0.05);
                padding: 12px;
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: grab;
                transition: all 0.3s ease;
            }

            .drill-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(3px);
            }

            .drill-item:active {
                cursor: grabbing;
            }

            .drill-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }

            .drill-name {
                font-weight: 600;
                font-size: 0.9em;
                color: #4CAF50;
            }

            .drill-duration {
                font-size: 0.8em;
                color: #888;
            }

            .drill-details {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }

            .drill-intensity {
                font-size: 0.8em;
                color: #FFD700;
            }

            .drill-description {
                font-size: 0.7em;
                color: #999;
            }

            .session-canvas {
                padding: 20px;
                overflow-y: auto;
            }

            .session-canvas h5 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .timeline-container {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                padding: 20px;
                min-height: 400px;
            }

            .timeline-track {
                position: relative;
                height: 350px;
            }

            .time-markers {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                position: relative;
            }

            .time-marker {
                font-size: 0.8em;
                color: #888;
                position: relative;
            }

            .time-marker::after {
                content: '';
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 1px;
                height: 320px;
                background: rgba(255, 255, 255, 0.1);
            }

            .drill-track {
                height: 80px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                margin-bottom: 15px;
                position: relative;
                border: 2px dashed rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                padding: 0 15px;
            }

            .track-label {
                font-weight: 600;
                color: #888;
                font-size: 0.9em;
            }

            .session-properties {
                padding: 20px;
                border-left: 1px solid rgba(255, 255, 255, 0.1);
                overflow-y: auto;
            }

            .session-properties h5 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .property-controls {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .control-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .control-group label {
                font-weight: 500;
                color: #ccc;
                font-size: 0.9em;
            }

            .control-group input[type="text"] {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9em;
            }

            .control-group input[type="range"] {
                appearance: none;
                background: rgba(255, 255, 255, 0.1);
                height: 6px;
                border-radius: 3px;
                outline: none;
            }

            .control-group input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #4CAF50;
                cursor: pointer;
            }

            .control-group select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9em;
            }

            .session-analytics {
                background: rgba(255, 255, 255, 0.02);
                padding: 25px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .session-analytics h4 {
                margin-top: 0;
                color: #4CAF50;
                border-bottom: 1px solid rgba(76, 175, 80, 0.3);
                padding-bottom: 10px;
            }

            .analytics-panel {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 30px;
                align-items: center;
            }

            .effectiveness-meter {
                display: flex;
                justify-content: center;
            }

            .meter-gauge {
                position: relative;
                width: 150px;
                height: 150px;
            }

            .gauge-fill {
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                bottom: 10px;
                border-radius: 50%;
                background: conic-gradient(from 0deg, #4CAF50 0deg, #4CAF50 140deg, rgba(255,255,255,0.1) 140deg);
                transform-origin: center;
            }

            .gauge-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                background: rgba(255, 255, 255, 0.1);
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .effectiveness-score {
                font-size: 1.5em;
                font-weight: 600;
                color: #4CAF50;
            }

            .effectiveness-breakdown {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .breakdown-item {
                display: grid;
                grid-template-columns: 120px 1fr 50px;
                gap: 15px;
                align-items: center;
            }

            .breakdown-label {
                font-size: 0.9em;
                color: #ccc;
            }

            .breakdown-bar {
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                overflow: hidden;
            }

            .breakdown-bar .bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #66BB6A);
                border-radius: 6px;
                transition: width 0.5s ease;
            }

            .breakdown-value {
                font-size: 0.9em;
                font-weight: 600;
                color: #4CAF50;
                text-align: right;
            }

            /* Responsive Design */
            @media (max-width: 1200px) {
                .training-system {
                    padding: 15px;
                }

                .training-header {
                    flex-direction: column;
                    gap: 20px;
                }

                .training-nav {
                    flex-wrap: wrap;
                }

                .schedule-view {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto auto;
                }

                .schedule-grid {
                    grid-column: 1;
                }

                .session-library {
                    grid-column: 1;
                }

                .workload-overview {
                    grid-column: 1;
                }

                .builder-interface {
                    grid-template-columns: 1fr;
                    grid-template-rows: 200px 1fr 200px;
                    height: auto;
                }

                .drill-library {
                    border-right: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .session-properties {
                    border-left: none;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
            }

            @media (max-width: 768px) {
                .schedule-header {
                    grid-template-columns: 80px repeat(7, 1fr);
                    font-size: 0.8em;
                }

                .time-row {
                    grid-template-columns: 80px repeat(7, 1fr);
                }

                .schedule-cell {
                    min-height: 60px;
                }

                .fitness-grid {
                    grid-template-columns: repeat(4, 1fr);
                }

                .fitness-legend {
                    flex-direction: column;
                    align-items: center;
                }

                .individual-development {
                    grid-template-columns: 1fr;
                }

                .academy-overview {
                    grid-column: 1 / -1;
                }

                .analytics-panel {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize the Training System
document.addEventListener('DOMContentLoaded', () => {
    new TrainingSystem();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrainingSystem;
}