/**
 * MATCH & FIXTURE COMPONENTS
 * Football Management UI - Advanced Match Analysis & Visualization
 * Implements timeline visualization, prediction algorithms, and comprehensive match insights
 */

// ===== DESIGN SYSTEM CONSTANTS =====
const MATCH_CONSTANTS = {
    GOLDEN_RATIO: 1.618033988749,
    COLORS: {
        WIN: 'hsl(120, 70%, 45%)',
        DRAW: 'hsl(45, 70%, 55%)', 
        LOSS: 'hsl(0, 70%, 50%)',
        LIVE: 'hsl(220, 80%, 55%)',
        UPCOMING: 'hsl(200, 60%, 60%)',
        COMPLETED: 'hsl(0, 0%, 40%)',
        GOAL: 'hsl(120, 100%, 50%)',
        YELLOW_CARD: 'hsl(45, 100%, 50%)',
        RED_CARD: 'hsl(0, 100%, 50%)',
        SUBSTITUTION: 'hsl(200, 70%, 50%)'
    },
    TIMING: {
        ANIMATION_FAST: 150,
        ANIMATION_STANDARD: 300,
        ANIMATION_SLOW: 500,
        LIVE_UPDATE: 1000
    },
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1440
    }
};

// ===== MATCH TIMELINE COMPONENT =====
class MatchTimeline {
    constructor(containerId, matchData) {
        this.container = document.getElementById(containerId);
        this.matchData = matchData;
        this.currentMinute = 0;
        this.isLive = matchData.status === 'live';
        this.timeline = null;
        this.events = matchData.events || [];
        
        this.init();
    }

    init() {
        this.createTimelineStructure();
        this.renderTimelineTrack();
        this.renderEvents();
        this.setupInteractivity();
        
        if (this.isLive) {
            this.startLiveUpdates();
        }
    }

    createTimelineStructure() {
        this.container.innerHTML = `
            <div class="match-timeline-container">
                <div class="timeline-header">
                    <div class="match-score">
                        <span class="home-team">${this.matchData.homeTeam}</span>
                        <span class="score">${this.matchData.homeScore} - ${this.matchData.awayScore}</span>
                        <span class="away-team">${this.matchData.awayTeam}</span>
                    </div>
                    <div class="match-time ${this.isLive ? 'live' : ''}">
                        ${this.isLive ? this.currentMinute + "'" : 'FT'}
                    </div>
                </div>
                
                <div class="timeline-track">
                    <div class="timeline-progress" style="width: ${this.getProgressWidth()}%"></div>
                    <div class="timeline-scrubber" style="left: ${this.getProgressWidth()}%"></div>
                    <div class="timeline-markers"></div>
                    <div class="timeline-events"></div>
                </div>
                
                <div class="timeline-controls">
                    <div class="time-segments">
                        <span data-time="0">0'</span>
                        <span data-time="15">15'</span>
                        <span data-time="30">30'</span>
                        <span data-time="45">45'</span>
                        <span data-time="60">60'</span>
                        <span data-time="75">75'</span>
                        <span data-time="90">90'</span>
                    </div>
                </div>
                
                <div class="match-stats-panel">
                    <div class="xg-progression">
                        <canvas id="xg-chart" width="400" height="100"></canvas>
                    </div>
                    <div class="key-moments"></div>
                </div>
            </div>
        `;

        this.applyTimelineStyles();
    }

    applyTimelineStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .match-timeline-container {
                background: linear-gradient(135deg, rgba(25, 30, 40, 0.95), rgba(15, 20, 30, 0.98));
                border-radius: 12px;
                padding: 24px;
                margin: 16px 0;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                position: relative;
                overflow: hidden;
            }

            .timeline-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .match-score {
                display: flex;
                align-items: center;
                gap: 16px;
                font-size: 18px;
                font-weight: 600;
            }

            .score {
                background: linear-gradient(45deg, ${MATCH_CONSTANTS.COLORS.LIVE}, ${MATCH_CONSTANTS.COLORS.UPCOMING});
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 24px;
                font-weight: 700;
                color: white;
            }

            .match-time {
                font-size: 20px;
                font-weight: 700;
                padding: 8px 16px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
            }

            .match-time.live {
                background: ${MATCH_CONSTANTS.COLORS.LIVE};
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .timeline-track {
                position: relative;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin: 24px 0;
                overflow: visible;
            }

            .timeline-progress {
                height: 100%;
                background: linear-gradient(90deg, ${MATCH_CONSTANTS.COLORS.LIVE}, ${MATCH_CONSTANTS.COLORS.WIN});
                border-radius: 4px;
                transition: width ${MATCH_CONSTANTS.TIMING.ANIMATION_STANDARD}ms ease;
            }

            .timeline-scrubber {
                position: absolute;
                top: -6px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                transform: translateX(-50%);
                transition: left ${MATCH_CONSTANTS.TIMING.ANIMATION_STANDARD}ms ease;
            }

            .timeline-scrubber:hover {
                transform: translateX(-50%) scale(1.2);
            }

            .timeline-events {
                position: absolute;
                top: -20px;
                left: 0;
                right: 0;
                height: 48px;
            }

            .timeline-event {
                position: absolute;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                transform: translateX(-50%);
                transition: transform ${MATCH_CONSTANTS.TIMING.ANIMATION_FAST}ms ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 700;
                color: white;
            }

            .timeline-event:hover {
                transform: translateX(-50%) scale(1.3);
            }

            .timeline-event.goal {
                background: ${MATCH_CONSTANTS.COLORS.GOAL};
                box-shadow: 0 0 12px ${MATCH_CONSTANTS.COLORS.GOAL}50;
            }

            .timeline-event.yellow-card {
                background: ${MATCH_CONSTANTS.COLORS.YELLOW_CARD};
            }

            .timeline-event.red-card {
                background: ${MATCH_CONSTANTS.COLORS.RED_CARD};
            }

            .timeline-event.substitution {
                background: ${MATCH_CONSTANTS.COLORS.SUBSTITUTION};
            }

            .time-segments {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .time-segments span {
                cursor: pointer;
                transition: color ${MATCH_CONSTANTS.TIMING.ANIMATION_FAST}ms ease;
            }

            .time-segments span:hover {
                color: white;
            }

            .match-stats-panel {
                margin-top: 24px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }

            .xg-progression {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 16px;
            }

            .key-moments {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 16px;
            }

            @media (max-width: ${MATCH_CONSTANTS.BREAKPOINTS.MOBILE}px) {
                .match-stats-panel {
                    grid-template-columns: 1fr;
                }
                
                .match-score {
                    flex-direction: column;
                    gap: 8px;
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    renderEvents() {
        const eventsContainer = this.container.querySelector('.timeline-events');
        
        this.events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = `timeline-event ${event.type}`;
            eventElement.style.left = `${(event.minute / 90) * 100}%`;
            eventElement.textContent = this.getEventIcon(event.type);
            eventElement.title = `${event.minute}' - ${event.description}`;
            
            eventElement.addEventListener('click', () => this.showEventDetail(event));
            eventsContainer.appendChild(eventElement);
        });
    }

    getEventIcon(type) {
        const icons = {
            'goal': '⚽',
            'yellow-card': '🟨',
            'red-card': '🟥',
            'substitution': '🔄'
        };
        return icons[type] || '•';
    }

    getProgressWidth() {
        const totalMinutes = this.matchData.status === 'completed' ? 90 : this.currentMinute;
        return Math.min((totalMinutes / 90) * 100, 100);
    }

    startLiveUpdates() {
        this.liveInterval = setInterval(() => {
            this.updateLiveData();
        }, MATCH_CONSTANTS.TIMING.LIVE_UPDATE);
    }

    updateLiveData() {
        // Simulate live data updates
        this.currentMinute++;
        
        const progressBar = this.container.querySelector('.timeline-progress');
        const scrubber = this.container.querySelector('.timeline-scrubber');
        const timeDisplay = this.container.querySelector('.match-time');
        
        const width = this.getProgressWidth();
        progressBar.style.width = `${width}%`;
        scrubber.style.left = `${width}%`;
        timeDisplay.textContent = this.currentMinute + "'";
        
        if (this.currentMinute >= 90) {
            clearInterval(this.liveInterval);
            this.isLive = false;
            timeDisplay.textContent = 'FT';
            timeDisplay.classList.remove('live');
        }
    }

    showEventDetail(event) {
        // Create event detail popup
        const popup = document.createElement('div');
        popup.className = 'event-detail-popup';
        popup.innerHTML = `
            <div class="event-detail-content">
                <h3>${event.minute}' - ${event.type.replace('-', ' ').toUpperCase()}</h3>
                <p>${event.description}</p>
                <div class="event-stats">
                    ${event.player ? `<span>Player: ${event.player}</span>` : ''}
                    ${event.xG ? `<span>xG: ${event.xG}</span>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Position popup and add close functionality
        setTimeout(() => popup.classList.add('visible'), 10);
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('visible');
                setTimeout(() => popup.remove(), 300);
            }
        });
    }
}

// ===== FIXTURE LIST COMPONENT =====
class FixtureList {
    constructor(containerId, fixtures) {
        this.container = document.getElementById(containerId);
        this.fixtures = fixtures;
        this.filters = {
            competition: 'all',
            difficulty: 'all',
            venue: 'all',
            timeframe: 'upcoming'
        };
        
        this.init();
    }

    init() {
        this.createFixtureStructure();
        this.renderFilters();
        this.renderFixtures();
        this.setupEventListeners();
    }

    createFixtureStructure() {
        this.container.innerHTML = `
            <div class="fixture-list-container">
                <div class="fixture-header">
                    <h2>Fixtures & Results</h2>
                    <div class="fixture-filters">
                        <select class="filter-competition">
                            <option value="all">All Competitions</option>
                            <option value="league">League</option>
                            <option value="cup">Cup</option>
                            <option value="european">European</option>
                        </select>
                        
                        <select class="filter-difficulty">
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                        
                        <select class="filter-venue">
                            <option value="all">All Venues</option>
                            <option value="home">Home</option>
                            <option value="away">Away</option>
                        </select>
                        
                        <select class="filter-timeframe">
                            <option value="upcoming">Upcoming</option>
                            <option value="recent">Recent</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                </div>
                
                <div class="fixture-grid">
                    <!-- Fixtures will be rendered here -->
                </div>
            </div>
        `;

        this.applyFixtureStyles();
    }

    applyFixtureStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fixture-list-container {
                background: rgba(25, 30, 40, 0.95);
                border-radius: 12px;
                padding: 24px;
                margin: 16px 0;
            }

            .fixture-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                flex-wrap: wrap;
                gap: 16px;
            }

            .fixture-filters {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .fixture-filters select {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                padding: 8px 12px;
                color: white;
                font-size: 14px;
            }

            .fixture-grid {
                display: grid;
                gap: 16px;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            }

            .fixture-card {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                transition: all ${MATCH_CONSTANTS.TIMING.ANIMATION_STANDARD}ms ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .fixture-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .fixture-card.completed {
                opacity: 0.8;
            }

            .fixture-card.live {
                border-color: ${MATCH_CONSTANTS.COLORS.LIVE};
                box-shadow: 0 0 20px ${MATCH_CONSTANTS.COLORS.LIVE}30;
            }

            .fixture-date {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 8px;
            }

            .fixture-teams {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }

            .team-info {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
            }

            .team-logo {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
            }

            .fixture-score {
                font-size: 24px;
                font-weight: 700;
                color: white;
            }

            .fixture-competition {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(0, 0, 0, 0.6);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                color: white;
            }

            .fixture-prediction {
                display: flex;
                justify-content: space-between;
                margin-top: 12px;
                font-size: 12px;
            }

            .prediction-item {
                text-align: center;
                flex: 1;
            }

            .prediction-percentage {
                font-weight: 700;
                color: ${MATCH_CONSTANTS.COLORS.UPCOMING};
            }

            .difficulty-indicator {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
            }

            .difficulty-easy { background: ${MATCH_CONSTANTS.COLORS.WIN}; }
            .difficulty-medium { background: ${MATCH_CONSTANTS.COLORS.DRAW}; }
            .difficulty-hard { background: ${MATCH_CONSTANTS.COLORS.LOSS}; }

            .venue-indicator {
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
            }

            @media (max-width: ${MATCH_CONSTANTS.BREAKPOINTS.MOBILE}px) {
                .fixture-header {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .fixture-filters {
                    justify-content: center;
                }
                
                .fixture-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    renderFixtures() {
        const grid = this.container.querySelector('.fixture-grid');
        const filteredFixtures = this.getFilteredFixtures();
        
        grid.innerHTML = filteredFixtures.map(fixture => this.createFixtureCard(fixture)).join('');
    }

    createFixtureCard(fixture) {
        const difficultyClass = `difficulty-${fixture.difficulty}`;
        const statusClass = fixture.status || 'upcoming';
        
        return `
            <div class="fixture-card ${statusClass}" data-fixture-id="${fixture.id}">
                <div class="difficulty-indicator ${difficultyClass}"></div>
                <div class="fixture-competition">${fixture.competition}</div>
                
                <div class="fixture-date">${this.formatDate(fixture.date)}</div>
                
                <div class="fixture-teams">
                    <div class="team-info">
                        <div class="team-logo" style="background-color: ${fixture.homeTeam.color}"></div>
                        <span>${fixture.homeTeam.name}</span>
                        ${fixture.venue === 'home' ? '<span class="venue-indicator">H</span>' : ''}
                    </div>
                    
                    <div class="fixture-score">
                        ${fixture.status === 'completed' ? 
                            `${fixture.homeScore} - ${fixture.awayScore}` : 
                            fixture.status === 'live' ? 
                                `${fixture.homeScore} - ${fixture.awayScore}` :
                                'vs'
                        }
                    </div>
                    
                    <div class="team-info">
                        ${fixture.venue === 'away' ? '<span class="venue-indicator">A</span>' : ''}
                        <span>${fixture.awayTeam.name}</span>
                        <div class="team-logo" style="background-color: ${fixture.awayTeam.color}"></div>
                    </div>
                </div>
                
                ${fixture.status === 'upcoming' ? this.renderPrediction(fixture.prediction) : ''}
                ${fixture.status === 'live' ? '<div class="live-indicator">LIVE</div>' : ''}
            </div>
        `;
    }

    renderPrediction(prediction) {
        if (!prediction) return '';
        
        return `
            <div class="fixture-prediction">
                <div class="prediction-item">
                    <div class="prediction-percentage">${prediction.win}%</div>
                    <div>Win</div>
                </div>
                <div class="prediction-item">
                    <div class="prediction-percentage">${prediction.draw}%</div>
                    <div>Draw</div>
                </div>
                <div class="prediction-item">
                    <div class="prediction-percentage">${prediction.loss}%</div>
                    <div>Loss</div>
                </div>
            </div>
        `;
    }

    getFilteredFixtures() {
        return this.fixtures.filter(fixture => {
            if (this.filters.competition !== 'all' && fixture.competition.toLowerCase() !== this.filters.competition) {
                return false;
            }
            
            if (this.filters.difficulty !== 'all' && fixture.difficulty !== this.filters.difficulty) {
                return false;
            }
            
            if (this.filters.venue !== 'all' && fixture.venue !== this.filters.venue) {
                return false;
            }
            
            if (this.filters.timeframe !== 'all') {
                const now = new Date();
                const fixtureDate = new Date(fixture.date);
                
                if (this.filters.timeframe === 'upcoming' && fixtureDate < now) {
                    return false;
                }
                
                if (this.filters.timeframe === 'recent' && fixtureDate > now) {
                    return false;
                }
            }
            
            return true;
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
        if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
        
        return date.toLocaleDateString();
    }

    setupEventListeners() {
        // Filter change listeners
        this.container.querySelector('.filter-competition').addEventListener('change', (e) => {
            this.filters.competition = e.target.value;
            this.renderFixtures();
        });
        
        this.container.querySelector('.filter-difficulty').addEventListener('change', (e) => {
            this.filters.difficulty = e.target.value;
            this.renderFixtures();
        });
        
        this.container.querySelector('.filter-venue').addEventListener('change', (e) => {
            this.filters.venue = e.target.value;
            this.renderFixtures();
        });
        
        this.container.querySelector('.filter-timeframe').addEventListener('change', (e) => {
            this.filters.timeframe = e.target.value;
            this.renderFixtures();
        });
        
        // Fixture card click listeners
        this.container.addEventListener('click', (e) => {
            const fixtureCard = e.target.closest('.fixture-card');
            if (fixtureCard) {
                const fixtureId = fixtureCard.dataset.fixtureId;
                this.openFixtureDetail(fixtureId);
            }
        });
    }

    openFixtureDetail(fixtureId) {
        const fixture = this.fixtures.find(f => f.id === fixtureId);
        if (fixture) {
            // Create detailed fixture view
            window.showFixtureDetail(fixture);
        }
    }
}

// ===== MATCH PREDICTION WIDGET =====
class MatchPredictionWidget {
    constructor(containerId, matchData) {
        this.container = document.getElementById(containerId);
        this.matchData = matchData;
        this.predictions = this.calculatePredictions();
        
        this.init();
    }

    init() {
        this.createPredictionStructure();
        this.renderPredictions();
        this.animatePredictions();
    }

    createPredictionStructure() {
        this.container.innerHTML = `
            <div class="prediction-widget">
                <div class="prediction-header">
                    <h3>Match Prediction</h3>
                    <div class="confidence-score">
                        <span class="confidence-label">Confidence:</span>
                        <span class="confidence-value">${this.predictions.confidence}%</span>
                    </div>
                </div>
                
                <div class="prediction-bars">
                    <div class="prediction-bar home">
                        <div class="bar-fill" data-percentage="${this.predictions.homeWin}"></div>
                        <div class="bar-label">
                            <span class="team-name">${this.matchData.homeTeam}</span>
                            <span class="percentage">${this.predictions.homeWin}%</span>
                        </div>
                    </div>
                    
                    <div class="prediction-bar draw">
                        <div class="bar-fill" data-percentage="${this.predictions.draw}"></div>
                        <div class="bar-label">
                            <span class="team-name">Draw</span>
                            <span class="percentage">${this.predictions.draw}%</span>
                        </div>
                    </div>
                    
                    <div class="prediction-bar away">
                        <div class="bar-fill" data-percentage="${this.predictions.awayWin}"></div>
                        <div class="bar-label">
                            <span class="team-name">${this.matchData.awayTeam}</span>
                            <span class="percentage">${this.predictions.awayWin}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="prediction-details">
                    <div class="detail-item">
                        <span class="detail-label">Most Likely Score:</span>
                        <span class="detail-value">${this.predictions.mostLikelyScore}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Goals (O/U 2.5):</span>
                        <span class="detail-value">${this.predictions.totalGoals}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Both Teams Score:</span>
                        <span class="detail-value">${this.predictions.bothTeamsScore}%</span>
                    </div>
                </div>
            </div>
        `;

        this.applyPredictionStyles();
    }

    applyPredictionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .prediction-widget {
                background: linear-gradient(135deg, rgba(25, 30, 40, 0.95), rgba(15, 20, 30, 0.98));
                border-radius: 12px;
                padding: 24px;
                margin: 16px 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .prediction-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }

            .confidence-score {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
            }

            .confidence-value {
                background: ${MATCH_CONSTANTS.COLORS.LIVE};
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 700;
            }

            .prediction-bars {
                margin-bottom: 24px;
            }

            .prediction-bar {
                margin-bottom: 16px;
                position: relative;
            }

            .bar-fill {
                height: 40px;
                border-radius: 6px;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1));
                position: relative;
                overflow: hidden;
                transition: width ${MATCH_CONSTANTS.TIMING.ANIMATION_SLOW}ms ease;
                width: 0%;
            }

            .prediction-bar.home .bar-fill {
                background: linear-gradient(90deg, ${MATCH_CONSTANTS.COLORS.WIN}, ${MATCH_CONSTANTS.COLORS.WIN}80);
            }

            .prediction-bar.draw .bar-fill {
                background: linear-gradient(90deg, ${MATCH_CONSTANTS.COLORS.DRAW}, ${MATCH_CONSTANTS.COLORS.DRAW}80);
            }

            .prediction-bar.away .bar-fill {
                background: linear-gradient(90deg, ${MATCH_CONSTANTS.COLORS.LIVE}, ${MATCH_CONSTANTS.COLORS.LIVE}80);
            }

            .bar-label {
                position: absolute;
                top: 0;
                left: 12px;
                right: 12px;
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                color: white;
                z-index: 2;
            }

            .prediction-details {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
            }

            .detail-label {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
            }

            .detail-value {
                font-weight: 700;
                color: white;
            }
        `;
        
        document.head.appendChild(style);
    }

    calculatePredictions() {
        // Advanced prediction algorithm based on multiple factors
        const homeStrength = this.matchData.homeTeam.strength || 75;
        const awayStrength = this.matchData.awayTeam.strength || 72;
        const homeAdvantage = 5; // Home field advantage
        const formFactor = this.calculateFormFactor();
        
        // Base probabilities
        let homeWin = Math.max(10, Math.min(80, homeStrength - awayStrength + homeAdvantage + formFactor));
        let awayWin = Math.max(10, Math.min(80, awayStrength - homeStrength + formFactor));
        let draw = Math.max(15, 100 - homeWin - awayWin);
        
        // Normalize to 100%
        const total = homeWin + draw + awayWin;
        homeWin = Math.round((homeWin / total) * 100);
        awayWin = Math.round((awayWin / total) * 100);
        draw = 100 - homeWin - awayWin;
        
        // Calculate additional predictions
        const avgGoals = this.calculateExpectedGoals();
        const bothTeamsScore = this.calculateBothTeamsScore();
        
        return {
            homeWin,
            draw,
            awayWin,
            confidence: Math.round(Math.max(homeWin, draw, awayWin) + Math.random() * 10),
            mostLikelyScore: this.getMostLikelyScore(homeWin, awayWin, draw),
            totalGoals: avgGoals > 2.5 ? 'Over 2.5' : 'Under 2.5',
            bothTeamsScore: Math.round(bothTeamsScore)
        };
    }

    calculateFormFactor() {
        // Simulate form calculation based on recent results
        const homeForm = this.matchData.homeTeam.recentForm || [1, 1, 0, 1, 1]; // W=1, D=0.5, L=0
        const awayForm = this.matchData.awayTeam.recentForm || [0, 1, 1, 0, 1];
        
        const homeFormScore = homeForm.reduce((a, b) => a + b, 0) / homeForm.length;
        const awayFormScore = awayForm.reduce((a, b) => a + b, 0) / awayForm.length;
        
        return (homeFormScore - awayFormScore) * 10;
    }

    calculateExpectedGoals() {
        const homeAttack = this.matchData.homeTeam.attack || 75;
        const awayDefense = this.matchData.awayTeam.defense || 72;
        const awayAttack = this.matchData.awayTeam.attack || 73;
        const homeDefense = this.matchData.homeTeam.defense || 76;
        
        const homeXG = (homeAttack / awayDefense) * 1.3; // Home advantage
        const awayXG = (awayAttack / homeDefense) * 1.0;
        
        return homeXG + awayXG;
    }

    calculateBothTeamsScore() {
        const expectedGoals = this.calculateExpectedGoals();
        const homeAttack = this.matchData.homeTeam.attack || 75;
        const awayAttack = this.matchData.awayTeam.attack || 73;
        
        // Higher attack values and more expected goals increase BTTS probability
        return Math.min(85, (homeAttack + awayAttack) / 2 + expectedGoals * 5);
    }

    getMostLikelyScore(homeWin, awayWin, draw) {
        if (homeWin > awayWin && homeWin > draw) {
            return Math.random() > 0.5 ? '2-1' : '1-0';
        } else if (awayWin > homeWin && awayWin > draw) {
            return Math.random() > 0.5 ? '1-2' : '0-1';
        } else {
            return Math.random() > 0.5 ? '1-1' : '0-0';
        }
    }

    animatePredictions() {
        setTimeout(() => {
            const bars = this.container.querySelectorAll('.bar-fill');
            bars.forEach(bar => {
                const percentage = bar.dataset.percentage;
                bar.style.width = `${percentage}%`;
            });
        }, 200);
    }
}

// ===== SEASON CALENDAR VISUALIZATION =====
class SeasonCalendar {
    constructor(containerId, fixtures) {
        this.container = document.getElementById(containerId);
        this.fixtures = fixtures;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        
        this.init();
    }

    init() {
        this.createCalendarStructure();
        this.renderCalendar();
        this.setupNavigation();
    }

    createCalendarStructure() {
        this.container.innerHTML = `
            <div class="season-calendar">
                <div class="calendar-header">
                    <button class="nav-btn prev-month">‹</button>
                    <h3 class="calendar-title">${this.getMonthName(this.currentMonth)} ${this.currentYear}</h3>
                    <button class="nav-btn next-month">›</button>
                </div>
                
                <div class="calendar-grid">
                    <div class="calendar-weekdays">
                        <div class="weekday">Sun</div>
                        <div class="weekday">Mon</div>
                        <div class="weekday">Tue</div>
                        <div class="weekday">Wed</div>
                        <div class="weekday">Thu</div>
                        <div class="weekday">Fri</div>
                        <div class="weekday">Sat</div>
                    </div>
                    <div class="calendar-days">
                        <!-- Days will be rendered here -->
                    </div>
                </div>
                
                <div class="calendar-legend">
                    <div class="legend-item">
                        <div class="legend-color league"></div>
                        <span>League</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color cup"></div>
                        <span>Cup</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color european"></div>
                        <span>European</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color international"></div>
                        <span>International Break</span>
                    </div>
                </div>
            </div>
        `;

        this.applyCalendarStyles();
    }

    applyCalendarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .season-calendar {
                background: rgba(25, 30, 40, 0.95);
                border-radius: 12px;
                padding: 24px;
                margin: 16px 0;
            }

            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }

            .nav-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 6px;
                width: 40px;
                height: 40px;
                color: white;
                font-size: 18px;
                cursor: pointer;
                transition: background ${MATCH_CONSTANTS.TIMING.ANIMATION_FAST}ms ease;
            }

            .nav-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .calendar-title {
                font-size: 20px;
                font-weight: 700;
                color: white;
            }

            .calendar-grid {
                margin-bottom: 24px;
            }

            .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 1px;
                margin-bottom: 8px;
            }

            .weekday {
                text-align: center;
                padding: 8px;
                font-size: 12px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.7);
            }

            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 1px;
            }

            .calendar-day {
                aspect-ratio: 1;
                background: rgba(255, 255, 255, 0.05);
                display: flex;
                flex-direction: column;
                padding: 4px;
                position: relative;
                cursor: pointer;
                transition: background ${MATCH_CONSTANTS.TIMING.ANIMATION_FAST}ms ease;
            }

            .calendar-day:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .calendar-day.other-month {
                opacity: 0.3;
            }

            .calendar-day.today {
                background: ${MATCH_CONSTANTS.COLORS.LIVE}30;
                border: 2px solid ${MATCH_CONSTANTS.COLORS.LIVE};
            }

            .day-number {
                font-size: 12px;
                font-weight: 600;
                color: white;
                margin-bottom: 2px;
            }

            .day-fixtures {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 1px;
            }

            .fixture-dot {
                height: 3px;
                border-radius: 1px;
                margin-bottom: 1px;
            }

            .fixture-dot.league { background: ${MATCH_CONSTANTS.COLORS.WIN}; }
            .fixture-dot.cup { background: ${MATCH_CONSTANTS.COLORS.DRAW}; }
            .fixture-dot.european { background: ${MATCH_CONSTANTS.COLORS.LIVE}; }
            .fixture-dot.international { background: ${MATCH_CONSTANTS.COLORS.LOSS}; }

            .calendar-legend {
                display: flex;
                justify-content: center;
                gap: 24px;
                flex-wrap: wrap;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
            }

            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
            }

            .legend-color.league { background: ${MATCH_CONSTANTS.COLORS.WIN}; }
            .legend-color.cup { background: ${MATCH_CONSTANTS.COLORS.DRAW}; }
            .legend-color.european { background: ${MATCH_CONSTANTS.COLORS.LIVE}; }
            .legend-color.international { background: ${MATCH_CONSTANTS.COLORS.LOSS}; }
        `;
        
        document.head.appendChild(style);
    }

    renderCalendar() {
        const daysContainer = this.container.querySelector('.calendar-days');
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const today = new Date();
        daysContainer.innerHTML = '';
        
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(currentDate, today);
            daysContainer.appendChild(dayElement);
        }
    }

    createDayElement(date, today) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() !== this.currentMonth) {
            dayElement.classList.add('other-month');
        }
        
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        const dayFixtures = this.getFixturesForDate(date);
        
        dayElement.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            <div class="day-fixtures">
                ${dayFixtures.map(fixture => 
                    `<div class="fixture-dot ${fixture.competition.toLowerCase()}" title="${fixture.opponent}"></div>`
                ).join('')}
            </div>
        `;
        
        if (dayFixtures.length > 0) {
            dayElement.addEventListener('click', () => this.showDayFixtures(date, dayFixtures));
        }
        
        return dayElement;
    }

    getFixturesForDate(date) {
        return this.fixtures.filter(fixture => {
            const fixtureDate = new Date(fixture.date);
            return fixtureDate.toDateString() === date.toDateString();
        });
    }

    showDayFixtures(date, fixtures) {
        // Create a popup showing fixtures for the selected date
        const popup = document.createElement('div');
        popup.className = 'day-fixtures-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h4>${date.toLocaleDateString()}</h4>
                <div class="popup-fixtures">
                    ${fixtures.map(fixture => `
                        <div class="popup-fixture">
                            <span class="fixture-time">${new Date(fixture.date).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                            <span class="fixture-match">${fixture.homeTeam.name} vs ${fixture.awayTeam.name}</span>
                            <span class="fixture-comp">${fixture.competition}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('visible'), 10);
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('visible');
                setTimeout(() => popup.remove(), 300);
            }
        });
    }

    setupNavigation() {
        this.container.querySelector('.prev-month').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.updateCalendar();
        });
        
        this.container.querySelector('.next-month').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.updateCalendar();
        });
    }

    updateCalendar() {
        this.container.querySelector('.calendar-title').textContent = 
            `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
        this.renderCalendar();
    }

    getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }
}

// ===== UTILITY FUNCTIONS =====
window.showFixtureDetail = function(fixture) {
    // Create detailed fixture analysis view
    const modal = document.createElement('div');
    modal.className = 'fixture-detail-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${fixture.homeTeam.name} vs ${fixture.awayTeam.name}</h2>
                <button class="close-modal">×</button>
            </div>
            <div class="modal-body">
                <div class="fixture-detail-tabs">
                    <button class="tab-btn active" data-tab="overview">Overview</button>
                    <button class="tab-btn" data-tab="prediction">Prediction</button>
                    <button class="tab-btn" data-tab="form">Form</button>
                    <button class="tab-btn" data-tab="h2h">Head to Head</button>
                </div>
                <div class="tab-content">
                    <!-- Tab content will be loaded dynamically -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('visible'), 10);
    
    // Setup modal event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        }
    });
};

// ===== EXPORT CLASSES =====
window.MatchTimeline = MatchTimeline;
window.FixtureList = FixtureList;
window.MatchPredictionWidget = MatchPredictionWidget;
window.SeasonCalendar = SeasonCalendar;

// ===== SAMPLE DATA FOR TESTING =====
window.SAMPLE_MATCH_DATA = {
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    events: [
        { minute: 23, type: 'goal', description: 'Aubameyang scores from close range', player: 'Aubameyang', xG: 0.8 },
        { minute: 34, type: 'yellow-card', description: 'Tactical foul', player: 'Jorginho' },
        { minute: 67, type: 'goal', description: 'Header from corner', player: 'Thiago Silva', xG: 0.3 },
        { minute: 78, type: 'substitution', description: 'Tactical change' },
        { minute: 89, type: 'goal', description: 'Counter-attack finish', player: 'Saka', xG: 0.6 }
    ]
};

window.SAMPLE_FIXTURES = [
    {
        id: 1,
        date: '2024-01-20T15:00:00Z',
        homeTeam: { name: 'Arsenal', color: '#EF0107' },
        awayTeam: { name: 'Chelsea', color: '#034694' },
        venue: 'home',
        competition: 'League',
        difficulty: 'hard',
        status: 'upcoming',
        prediction: { win: 45, draw: 30, loss: 25 }
    },
    {
        id: 2,
        date: '2024-01-24T20:00:00Z',
        homeTeam: { name: 'Liverpool', color: '#C8102E' },
        awayTeam: { name: 'Arsenal', color: '#EF0107' },
        venue: 'away',
        competition: 'Cup',
        difficulty: 'medium',
        status: 'upcoming',
        prediction: { win: 35, draw: 35, loss: 30 }
    }
];

console.log('Match Components loaded successfully! 🏆');
console.log('Available classes: MatchTimeline, FixtureList, MatchPredictionWidget, SeasonCalendar');