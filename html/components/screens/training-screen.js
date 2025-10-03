/* ==========================================
   TRAINING SCREEN - Schedules & Development
   ========================================== */

window.TrainingScreen = {
    weekSchedule: {
        Monday: { type: 'General', intensity: 'Medium', focus: 'Ball Retention', attendance: 22 },
        Tuesday: { type: 'Match Prep', intensity: 'High', focus: 'Attacking Movement', attendance: 23 },
        Wednesday: { type: 'Recovery', intensity: 'Low', focus: 'Stretching', attendance: 21 },
        Thursday: { type: 'Tactical', intensity: 'Medium', focus: 'Set Pieces', attendance: 24 },
        Friday: { type: 'Match Prep', intensity: 'Light', focus: 'Team Shape', attendance: 25 },
        Saturday: { type: 'Match Day', intensity: 'Match', focus: 'Premier League', attendance: 25 },
        Sunday: { type: 'Rest', intensity: 'None', focus: 'Recovery', attendance: 0 }
    },

    trainingPrograms: [
        { name: 'General Fitness', category: 'Physical', duration: '4 weeks', players: 8 },
        { name: 'Attacking Movement', category: 'Tactical', duration: '2 weeks', players: 12 },
        { name: 'Defensive Shape', category: 'Tactical', duration: '3 weeks', players: 10 },
        { name: 'Set Piece Routines', category: 'Set Pieces', duration: '1 week', players: 25 },
        { name: 'Injury Prevention', category: 'Physical', duration: 'Ongoing', players: 25 },
        { name: 'Youth Integration', category: 'Development', duration: '6 weeks', players: 4 }
    ],

    individualTraining: [
        { player: 'Højlund', focus: 'Finishing', coach: 'Van Nistelrooy', progress: 65 },
        { player: 'Antony', focus: 'Weak Foot', coach: 'Assistant', progress: 40 },
        { player: 'Shaw', focus: 'Injury Recovery', coach: 'Physio', progress: 78 },
        { player: 'McTominay', focus: 'Passing Range', coach: 'Scholes', progress: 55 },
        { player: 'Sancho', focus: 'Mental Strength', coach: 'Psychologist', progress: 30 }
    ],

    coaches: [
        { name: 'Erik ten Hag', role: 'Manager', workload: 85, happiness: 'Good' },
        { name: 'Mitchell van der Gaag', role: 'Assistant Manager', workload: 75, happiness: 'Good' },
        { name: 'Steve McClaren', role: 'First Team Coach', workload: 70, happiness: 'Very Good' },
        { name: 'Ruud van Nistelrooy', role: 'Striker Coach', workload: 60, happiness: 'Excellent' },
        { name: 'Richard Hartis', role: 'Goalkeeper Coach', workload: 65, happiness: 'Good' },
        { name: 'Paul Scholes', role: 'Technical Coach', workload: 45, happiness: 'Good' }
    ],

    renderTrainingView() {
        return `
            <div class="training-container">
                <div class="training-header">
                    <div class="training-tabs">
                        <button class="training-tab active" onclick="TrainingScreen.showTab('schedule')">Schedule</button>
                        <button class="training-tab" onclick="TrainingScreen.showTab('programs')">Programs</button>
                        <button class="training-tab" onclick="TrainingScreen.showTab('individual')">Individual</button>
                        <button class="training-tab" onclick="TrainingScreen.showTab('coaches')">Coaches</button>
                        <button class="training-tab" onclick="TrainingScreen.showTab('facilities')">Facilities</button>
                        <button class="training-tab" onclick="TrainingScreen.showTab('reports')">Reports</button>
                    </div>
                    <div class="training-actions">
                        <button class="action-button" onclick="TrainingScreen.autoSchedule()">Auto Schedule</button>
                        <button class="action-button" onclick="TrainingScreen.restDay()">Add Rest Day</button>
                        <button class="action-button" onclick="TrainingScreen.saveTemplate()">Save Template</button>
                    </div>
                </div>
                
                <div class="training-content" id="training-content">
                    ${this.renderScheduleTab()}
                </div>
            </div>
        `;
    },

    renderScheduleTab() {
        return `
            <div class="weekly-schedule">
                <h3>Weekly Training Schedule</h3>
                <div class="schedule-grid">
                    ${Object.entries(this.weekSchedule).map(([day, session]) => 
                        this.renderDaySchedule(day, session)
                    ).join('')}
                </div>
                
                <div class="schedule-summary">
                    <div class="summary-card">
                        <h4>Weekly Overview</h4>
                        <div class="summary-stats">
                            <div class="stat">
                                <span>Training Days:</span>
                                <strong>5</strong>
                            </div>
                            <div class="stat">
                                <span>Rest Days:</span>
                                <strong>1</strong>
                            </div>
                            <div class="stat">
                                <span>Match Days:</span>
                                <strong>1</strong>
                            </div>
                            <div class="stat">
                                <span>Avg Intensity:</span>
                                <strong>Medium</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <h4>Injury Risk</h4>
                        <div class="risk-meter">
                            <div class="risk-bar">
                                <div class="risk-fill" style="width: 35%; background: #facc15;"></div>
                            </div>
                            <span class="risk-label">Moderate (35%)</span>
                        </div>
                        <div class="risk-players">
                            <p>High Risk Players:</p>
                            <span class="player-risk">Shaw (78%)</span>
                            <span class="player-risk">Martial (65%)</span>
                            <span class="player-risk">Varane (52%)</span>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <h4>Next Match</h4>
                        <div class="match-info">
                            <div class="match-opponent">vs Liverpool (H)</div>
                            <div class="match-date">Saturday, 3:00 PM</div>
                            <div class="match-prep">
                                <span>Preparation: </span>
                                <span class="prep-status good">On Track</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderDaySchedule(day, session) {
        const intensityColor = this.getIntensityColor(session.intensity);
        const isMatchDay = session.type === 'Match Day';
        const isRestDay = session.type === 'Rest';
        
        return `
            <div class="day-schedule ${isMatchDay ? 'match-day' : ''} ${isRestDay ? 'rest-day' : ''}">
                <div class="day-header">
                    <h4>${day}</h4>
                    <span class="day-type">${session.type}</span>
                </div>
                <div class="session-details">
                    <div class="session-row">
                        <span>Intensity:</span>
                        <span class="intensity-badge" style="background: ${intensityColor};">${session.intensity}</span>
                    </div>
                    <div class="session-row">
                        <span>Focus:</span>
                        <span>${session.focus}</span>
                    </div>
                    <div class="session-row">
                        <span>Attendance:</span>
                        <span>${session.attendance}/25</span>
                    </div>
                </div>
                ${!isMatchDay && !isRestDay ? `
                    <button class="edit-session" onclick="TrainingScreen.editSession('${day}')">Edit</button>
                ` : ''}
            </div>
        `;
    },

    renderProgramsTab() {
        return `
            <div class="training-programs">
                <h3>Active Training Programs</h3>
                <div class="programs-grid">
                    ${this.trainingPrograms.map(program => this.renderProgram(program)).join('')}
                </div>
                
                <div class="program-actions">
                    <button class="add-program" onclick="TrainingScreen.addProgram()">+ Add New Program</button>
                </div>
            </div>
        `;
    },

    renderProgram(program) {
        const categoryColor = this.getCategoryColor(program.category);
        
        return `
            <div class="program-card">
                <div class="program-header">
                    <h4>${program.name}</h4>
                    <span class="category-badge" style="background: ${categoryColor};">${program.category}</span>
                </div>
                <div class="program-details">
                    <div class="detail-row">
                        <span>Duration:</span>
                        <span>${program.duration}</span>
                    </div>
                    <div class="detail-row">
                        <span>Players:</span>
                        <span>${program.players}</span>
                    </div>
                    <div class="program-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.random() * 100}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="program-actions">
                    <button onclick="TrainingScreen.viewProgram('${program.name}')">View</button>
                    <button onclick="TrainingScreen.editProgram('${program.name}')">Edit</button>
                    <button onclick="TrainingScreen.stopProgram('${program.name}')">Stop</button>
                </div>
            </div>
        `;
    },

    renderIndividualTab() {
        return `
            <div class="individual-training">
                <h3>Individual Training Plans</h3>
                <div class="individual-list">
                    ${this.individualTraining.map(plan => this.renderIndividualPlan(plan)).join('')}
                </div>
                
                <div class="available-players">
                    <h4>Available for Individual Training</h4>
                    <div class="player-select-grid">
                        <div class="player-select">Rashford</div>
                        <div class="player-select">Bruno Fernandes</div>
                        <div class="player-select">Casemiro</div>
                        <div class="player-select">Dalot</div>
                        <div class="player-select">Martinez</div>
                    </div>
                </div>
            </div>
        `;
    },

    renderIndividualPlan(plan) {
        const progressColor = plan.progress >= 70 ? '#4ade80' : plan.progress >= 40 ? '#facc15' : '#ef4444';
        
        return `
            <div class="individual-plan">
                <div class="plan-player">
                    <span class="player-name">${plan.player}</span>
                    <span class="plan-focus">${plan.focus}</span>
                </div>
                <div class="plan-coach">
                    <span>Coach: ${plan.coach}</span>
                </div>
                <div class="plan-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${plan.progress}%; background: ${progressColor};"></div>
                    </div>
                    <span class="progress-text">${plan.progress}%</span>
                </div>
                <div class="plan-actions">
                    <button onclick="TrainingScreen.adjustIntensity('${plan.player}')">Adjust</button>
                    <button onclick="TrainingScreen.stopIndividual('${plan.player}')">Stop</button>
                </div>
            </div>
        `;
    },

    renderCoachesTab() {
        return `
            <div class="coaches-management">
                <h3>Coaching Staff</h3>
                <div class="coaches-grid">
                    ${this.coaches.map(coach => this.renderCoach(coach)).join('')}
                </div>
                
                <div class="coaching-stats">
                    <h4>Coaching Coverage</h4>
                    <div class="coverage-grid">
                        <div class="coverage-item">
                            <span>Attacking:</span>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: 85%; background: #4ade80;"></div>
                            </div>
                        </div>
                        <div class="coverage-item">
                            <span>Defending:</span>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: 75%; background: #84cc16;"></div>
                            </div>
                        </div>
                        <div class="coverage-item">
                            <span>Fitness:</span>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: 60%; background: #facc15;"></div>
                            </div>
                        </div>
                        <div class="coverage-item">
                            <span>Goalkeeping:</span>
                            <div class="coverage-bar">
                                <div class="coverage-fill" style="width: 90%; background: #4ade80;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderCoach(coach) {
        const workloadColor = coach.workload >= 80 ? '#ef4444' : coach.workload >= 60 ? '#facc15' : '#4ade80';
        const happinessEmoji = this.getHappinessEmoji(coach.happiness);
        
        return `
            <div class="coach-card">
                <div class="coach-header">
                    <h4>${coach.name}</h4>
                    <span class="coach-role">${coach.role}</span>
                </div>
                <div class="coach-stats">
                    <div class="stat-row">
                        <span>Workload:</span>
                        <div class="workload-bar">
                            <div class="workload-fill" style="width: ${coach.workload}%; background: ${workloadColor};"></div>
                        </div>
                        <span>${coach.workload}%</span>
                    </div>
                    <div class="stat-row">
                        <span>Happiness:</span>
                        <span>${happinessEmoji} ${coach.happiness}</span>
                    </div>
                </div>
                <div class="coach-actions">
                    <button onclick="TrainingScreen.assignCoach('${coach.name}')">Assign</button>
                    <button onclick="TrainingScreen.coachReport('${coach.name}')">Report</button>
                </div>
            </div>
        `;
    },

    renderFacilitiesTab() {
        return `
            <div class="facilities-overview">
                <h3>Training Facilities</h3>
                <div class="facilities-grid">
                    <div class="facility-card">
                        <h4>Training Ground</h4>
                        <div class="facility-rating">
                            ${'⭐'.repeat(4)}${'☆'.repeat(1)}
                        </div>
                        <div class="facility-details">
                            <p>Carrington Training Complex</p>
                            <p>Capacity: 25 pitches</p>
                            <p>Condition: Excellent</p>
                        </div>
                        <button onclick="TrainingScreen.upgradeFacility('training-ground')">Upgrade</button>
                    </div>
                    
                    <div class="facility-card">
                        <h4>Youth Facilities</h4>
                        <div class="facility-rating">
                            ${'⭐'.repeat(5)}
                        </div>
                        <div class="facility-details">
                            <p>Academy Complex</p>
                            <p>Capacity: 200 youth players</p>
                            <p>Condition: State of the Art</p>
                        </div>
                        <button onclick="TrainingScreen.upgradeFacility('youth')">Maintain</button>
                    </div>
                    
                    <div class="facility-card">
                        <h4>Medical Center</h4>
                        <div class="facility-rating">
                            ${'⭐'.repeat(4)}${'☆'.repeat(1)}
                        </div>
                        <div class="facility-details">
                            <p>Sports Science Department</p>
                            <p>Staff: 12 specialists</p>
                            <p>Condition: Very Good</p>
                        </div>
                        <button onclick="TrainingScreen.upgradeFacility('medical')">Upgrade</button>
                    </div>
                    
                    <div class="facility-card">
                        <h4>Data Analytics</h4>
                        <div class="facility-rating">
                            ${'⭐'.repeat(3)}${'☆'.repeat(2)}
                        </div>
                        <div class="facility-details">
                            <p>Performance Analysis Suite</p>
                            <p>Technology: Good</p>
                            <p>Condition: Adequate</p>
                        </div>
                        <button onclick="TrainingScreen.upgradeFacility('analytics')">Upgrade</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderReportsTab() {
        return `
            <div class="training-reports">
                <h3>Training Reports</h3>
                <div class="reports-list">
                    <div class="report-item">
                        <div class="report-date">Oct 15, 2024</div>
                        <div class="report-title">Weekly Training Summary</div>
                        <div class="report-summary">Overall intensity moderate. 3 players showing fatigue signs.</div>
                        <button onclick="TrainingScreen.viewReport('weekly-1')">View</button>
                    </div>
                    <div class="report-item">
                        <div class="report-date">Oct 14, 2024</div>
                        <div class="report-title">Youth Development Report</div>
                        <div class="report-summary">2 youth players ready for first team training.</div>
                        <button onclick="TrainingScreen.viewReport('youth-1')">View</button>
                    </div>
                    <div class="report-item">
                        <div class="report-date">Oct 12, 2024</div>
                        <div class="report-title">Injury Prevention Analysis</div>
                        <div class="report-summary">Shaw and Martial require modified training loads.</div>
                        <button onclick="TrainingScreen.viewReport('injury-1')">View</button>
                    </div>
                    <div class="report-item">
                        <div class="report-date">Oct 10, 2024</div>
                        <div class="report-title">Tactical Development</div>
                        <div class="report-summary">Team showing improvement in pressing triggers.</div>
                        <button onclick="TrainingScreen.viewReport('tactical-1')">View</button>
                    </div>
                </div>
            </div>
        `;
    },

    showTab(tab) {
        document.querySelectorAll('.training-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        
        const content = document.getElementById('training-content');
        switch(tab) {
            case 'schedule':
                content.innerHTML = this.renderScheduleTab();
                break;
            case 'programs':
                content.innerHTML = this.renderProgramsTab();
                break;
            case 'individual':
                content.innerHTML = this.renderIndividualTab();
                break;
            case 'coaches':
                content.innerHTML = this.renderCoachesTab();
                break;
            case 'facilities':
                content.innerHTML = this.renderFacilitiesTab();
                break;
            case 'reports':
                content.innerHTML = this.renderReportsTab();
                break;
        }
    },

    getIntensityColor(intensity) {
        const colors = {
            'None': '#6b7280',
            'Low': '#4ade80',
            'Light': '#84cc16',
            'Medium': '#facc15',
            'High': '#fb923c',
            'Match': '#ef4444'
        };
        return colors[intensity] || '#6b7280';
    },

    getCategoryColor(category) {
        const colors = {
            'Physical': '#ef4444',
            'Tactical': '#3b82f6',
            'Technical': '#10b981',
            'Mental': '#8b5cf6',
            'Set Pieces': '#f59e0b',
            'Development': '#ec4899'
        };
        return colors[category] || '#6b7280';
    },

    getHappinessEmoji(happiness) {
        const emojis = {
            'Excellent': '😄',
            'Very Good': '😊',
            'Good': '🙂',
            'Okay': '😐',
            'Poor': '☹️',
            'Very Poor': '😡'
        };
        return emojis[happiness] || '😐';
    },

    editSession(day) {
        console.log(`Editing session for ${day}`);
    },

    autoSchedule() {
        console.log('Auto-scheduling training week');
    },

    restDay() {
        console.log('Adding rest day');
    },

    saveTemplate() {
        console.log('Saving training template');
    }
};

// Add Training screen styles
const trainingStyles = `
<style>
.training-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--neutral-200);
    color: #e0e0e0;
}

.training-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: var(--neutral-300);
    border-bottom: 1px solid var(--neutral-400);
}

.training-tabs {
    display: flex;
    gap: 5px;
}

.training-tab {
    padding: 8px 16px;
    background: var(--neutral-200);
    border: 1px solid var(--neutral-400);
    color: #a0a0a0;
    cursor: pointer;
    transition: all 0.2s;
}

.training-tab.active {
    background: var(--primary-300);
    color: white;
    border-color: var(--primary-400);
}

.training-actions {
    display: flex;
    gap: 10px;
}

.action-button {
    padding: 8px 16px;
    background: var(--primary-300);
    border: none;
    color: white;
    border-radius: 3px;
    cursor: pointer;
}

.action-button:hover {
    background: var(--primary-400);
}

.training-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.weekly-schedule h3 {
    margin-bottom: 20px;
    color: var(--primary-400);
}

.schedule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

.day-schedule {
    background: var(--neutral-300);
    border-radius: 5px;
    padding: 15px;
    border: 1px solid var(--neutral-400);
}

.day-schedule.match-day {
    border-color: var(--primary-400);
    background: linear-gradient(135deg, var(--neutral-300), var(--primary-200));
}

.day-schedule.rest-day {
    opacity: 0.6;
}

.day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--neutral-400);
}

.day-header h4 {
    color: white;
    font-size: 16px;
}

.day-type {
    font-size: 11px;
    color: #888;
    text-transform: uppercase;
}

.session-details {
    margin-bottom: 10px;
}

.session-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 13px;
}

.intensity-badge {
    padding: 2px 6px;
    border-radius: 3px;
    color: white;
    font-size: 11px;
}

.edit-session {
    width: 100%;
    padding: 5px;
    background: var(--neutral-400);
    border: 1px solid var(--neutral-500);
    color: white;
    cursor: pointer;
    border-radius: 3px;
}

.edit-session:hover {
    background: var(--neutral-500);
}

.schedule-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.summary-card {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.summary-card h4 {
    color: var(--primary-400);
    margin-bottom: 15px;
}

.summary-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.stat {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
}

.risk-meter {
    margin-bottom: 15px;
}

.risk-bar {
    height: 20px;
    background: var(--neutral-400);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 5px;
}

.risk-fill {
    height: 100%;
}

.risk-label {
    font-size: 12px;
    color: #facc15;
}

.risk-players p {
    margin: 10px 0 5px;
    font-size: 12px;
    color: #888;
}

.player-risk {
    display: inline-block;
    padding: 3px 8px;
    background: var(--neutral-400);
    border-radius: 3px;
    margin-right: 5px;
    font-size: 11px;
}

.match-info {
    font-size: 14px;
}

.match-opponent {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.match-date {
    color: #888;
    margin-bottom: 10px;
}

.prep-status {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
}

.prep-status.good {
    background: #4ade80;
    color: black;
}

.programs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.program-card {
    background: var(--neutral-300);
    border-radius: 5px;
    padding: 15px;
}

.program-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.category-badge {
    padding: 3px 8px;
    border-radius: 3px;
    color: white;
    font-size: 10px;
}

.program-details {
    margin-bottom: 10px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 12px;
}

.program-progress {
    margin: 10px 0;
}

.progress-bar {
    height: 8px;
    background: var(--neutral-400);
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-400);
}

.program-actions {
    display: flex;
    gap: 5px;
}

.program-actions button {
    flex: 1;
    padding: 5px;
    background: var(--neutral-400);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    font-size: 11px;
}

.program-actions button:hover {
    background: var(--neutral-500);
}

.add-program {
    padding: 10px 20px;
    background: var(--primary-300);
    border: none;
    color: white;
    border-radius: 3px;
    cursor: pointer;
}

.individual-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.individual-plan {
    background: var(--neutral-300);
    padding: 15px;
    border-radius: 5px;
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 1fr;
    align-items: center;
    gap: 15px;
}

.plan-player {
    display: flex;
    flex-direction: column;
}

.player-name {
    font-weight: bold;
    margin-bottom: 3px;
}

.plan-focus {
    font-size: 12px;
    color: #888;
}

.plan-coach {
    font-size: 12px;
    color: #aaa;
}

.plan-progress {
    display: flex;
    align-items: center;
    gap: 10px;
}

.progress-text {
    font-size: 12px;
    font-weight: bold;
}

.plan-actions {
    display: flex;
    gap: 5px;
}

.plan-actions button {
    padding: 5px 10px;
    background: var(--neutral-400);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    font-size: 11px;
}

.available-players {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.available-players h4 {
    margin-bottom: 15px;
    color: var(--primary-400);
}

.player-select-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.player-select {
    padding: 8px 15px;
    background: var(--neutral-400);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s;
}

.player-select:hover {
    background: var(--primary-300);
}

.coaches-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

.coach-card {
    background: var(--neutral-300);
    padding: 15px;
    border-radius: 5px;
}

.coach-header {
    margin-bottom: 10px;
}

.coach-header h4 {
    margin-bottom: 3px;
}

.coach-role {
    font-size: 11px;
    color: #888;
}

.coach-stats {
    margin-bottom: 10px;
}

.workload-bar {
    display: inline-block;
    width: 60px;
    height: 8px;
    background: var(--neutral-400);
    border-radius: 4px;
    overflow: hidden;
    margin: 0 5px;
}

.workload-fill {
    height: 100%;
}

.coach-actions {
    display: flex;
    gap: 5px;
}

.coach-actions button {
    flex: 1;
    padding: 5px;
    background: var(--neutral-400);
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 3px;
    font-size: 11px;
}

.coaching-stats {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.coverage-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
}

.coverage-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.coverage-item span:first-child {
    width: 100px;
    font-size: 12px;
}

.coverage-bar {
    flex: 1;
    height: 16px;
    background: var(--neutral-400);
    border-radius: 8px;
    overflow: hidden;
}

.coverage-fill {
    height: 100%;
}

.facilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.facility-card {
    background: var(--neutral-300);
    padding: 20px;
    border-radius: 5px;
}

.facility-card h4 {
    margin-bottom: 10px;
    color: var(--primary-400);
}

.facility-rating {
    margin-bottom: 15px;
    font-size: 18px;
}

.facility-details {
    margin-bottom: 15px;
}

.facility-details p {
    margin-bottom: 5px;
    font-size: 12px;
    color: #aaa;
}

.facility-card button {
    width: 100%;
    padding: 8px;
    background: var(--primary-300);
    border: none;
    color: white;
    border-radius: 3px;
    cursor: pointer;
}

.reports-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.report-item {
    background: var(--neutral-300);
    padding: 15px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 20px;
}

.report-date {
    font-size: 11px;
    color: #888;
    min-width: 80px;
}

.report-title {
    font-weight: bold;
    min-width: 200px;
}

.report-summary {
    flex: 1;
    font-size: 13px;
    color: #aaa;
}

.report-item button {
    padding: 5px 15px;
    background: var(--neutral-400);
    border: none;
    color: white;
    border-radius: 3px;
    cursor: pointer;
}

.report-item button:hover {
    background: var(--primary-300);
}
</style>
`;

// Inject styles when module loads
if (!document.getElementById('training-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'training-styles';
    styleElement.innerHTML = trainingStyles;
    document.head.appendChild(styleElement.firstElementChild);
}