/**
 * PLAYER COMPONENTS - Football Management UI
 * Comprehensive player visualization system based on DNA visualizations, 
 * pizza charts, and attribute circles research findings.
 * 
 * Features:
 * - DNA Player Archetype Visualization (6 complex viz in 200px circle)
 * - Pizza Chart Performance Analytics (23 discrete ranges)
 * - Attribute Circle Systems (4-stage hierarchy)
 * - Player Card Components (Golden ratio dimensions)
 * - Squad List Widgets (Advanced filtering/sorting)
 * 
 * Performance: 60fps target with optimized rendering
 * Integration: Seamless with existing subscreen system
 */

// =====================================================================
// CORE PLAYER DATA STRUCTURES
// =====================================================================

const PlayerArchetypes = {
    // Central roles
    'complete-midfielder': {
        name: 'Complete Midfielder',
        color: '#2E7D32',
        attributes: ['passing', 'vision', 'tackling', 'workRate', 'technique', 'decisions'],
        description: 'Elite all-around midfielder with exceptional range'
    },
    'box-to-box': {
        name: 'Box-to-Box',
        color: '#1565C0', 
        attributes: ['stamina', 'workRate', 'passing', 'tackling', 'longShots', 'heading'],
        description: 'Dynamic midfielder covering both boxes'
    },
    'deep-lying-playmaker': {
        name: 'Deep-Lying Playmaker',
        color: '#7B1FA2',
        attributes: ['passing', 'vision', 'technique', 'composure', 'positioning', 'decisions'],
        description: 'Orchestrates play from deep positions'
    },
    'advanced-playmaker': {
        name: 'Advanced Playmaker',
        color: '#F57C00',
        attributes: ['passing', 'vision', 'technique', 'flair', 'dribbling', 'decisions'],
        description: 'Creates chances in final third'
    },
    'ball-winning-midfielder': {
        name: 'Ball-Winning Midfielder',
        color: '#C62828',
        attributes: ['tackling', 'workRate', 'aggression', 'positioning', 'stamina', 'strength'],
        description: 'Defensive anchor and ball recovery specialist'
    },
    'wide-midfielder': {
        name: 'Wide Midfielder',
        color: '#00796B',
        attributes: ['pace', 'crossing', 'dribbling', 'workRate', 'stamina', 'acceleration'],
        description: 'Provides width and attacking thrust'
    }
};

const AttributeCategories = {
    technical: {
        name: 'Technical',
        color: '#4CAF50',
        attributes: ['corners', 'crossing', 'dribbling', 'finishing', 'firstTouch', 'freeKicks', 'heading', 'longShots', 'longThrows', 'marking', 'passing', 'penaltyTaking', 'tackling', 'technique']
    },
    mental: {
        name: 'Mental', 
        color: '#2196F3',
        attributes: ['aggression', 'anticipation', 'bravery', 'composure', 'concentration', 'decisions', 'determination', 'flair', 'leadership', 'offTheBall', 'positioning', 'teamwork', 'vision', 'workRate']
    },
    physical: {
        name: 'Physical',
        color: '#FF9800',
        attributes: ['acceleration', 'agility', 'balance', 'jumping', 'naturalFitness', 'pace', 'stamina', 'strength']
    },
    goalkeeping: {
        name: 'Goalkeeping',
        color: '#9C27B0',
        attributes: ['aerialReach', 'commandOfArea', 'communication', 'eccentricity', 'handling', 'kicking', 'oneOnOnes', 'reflexes', 'rushingOut', 'tendencyToPunch', 'throwing']
    }
};

// =====================================================================
// DNA PLAYER ARCHETYPE VISUALIZATION
// =====================================================================

class DNAPlayerVisualization {
    constructor(container, playerData) {
        this.container = container;
        this.playerData = playerData;
        this.radius = 100; // 200px diameter
        this.centerRadius = 25; // 50px diameter
        this.segments = 6;
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.render();
        this.addInteractivity();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 200;
        this.canvas.height = 200;
        this.canvas.className = 'dna-visualization';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }
    
    render() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw outer segments
        this.drawArchetypeSegments(centerX, centerY);
        
        // Draw connecting lines
        this.drawConnectionLines(centerX, centerY);
        
        // Draw center core
        this.drawCenterCore(centerX, centerY);
        
        // Draw performance indicators
        this.drawPerformanceIndicators(centerX, centerY);
    }
    
    drawArchetypeSegments(centerX, centerY) {
        const angleStep = (Math.PI * 2) / this.segments;
        
        this.segments.forEach((_, index) => {
            const startAngle = angleStep * index - Math.PI / 2;
            const endAngle = startAngle + angleStep;
            
            // Get archetype strength for this segment
            const strength = this.getArchetypeStrength(index);
            const segmentRadius = this.radius * (0.6 + 0.4 * strength);
            
            // Color based on dominant archetype
            const archetype = this.getDominantArchetype(index);
            const color = PlayerArchetypes[archetype]?.color || '#666';
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, segmentRadius, startAngle, endAngle);
            this.ctx.closePath();
            
            // Gradient fill
            const gradient = this.ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, segmentRadius);
            gradient.addColorStop(0, color + '40');
            gradient.addColorStop(1, color + 'AA');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Stroke
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
    
    drawConnectionLines(centerX, centerY) {
        // Draw DNA-like connecting lines between segments
        const angleStep = (Math.PI * 2) / this.segments;
        
        for (let i = 0; i < this.segments; i++) {
            const angle1 = angleStep * i - Math.PI / 2;
            const angle2 = angleStep * ((i + 1) % this.segments) - Math.PI / 2;
            
            const radius1 = this.radius * 0.7;
            const radius2 = this.radius * 0.8;
            
            const x1 = centerX + Math.cos(angle1) * radius1;
            const y1 = centerY + Math.sin(angle1) * radius1;
            const x2 = centerX + Math.cos(angle2) * radius2;
            const y2 = centerY + Math.sin(angle2) * radius2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.bezierCurveTo(
                centerX + Math.cos(angle1) * 40,
                centerY + Math.sin(angle1) * 40,
                centerX + Math.cos(angle2) * 40,
                centerY + Math.sin(angle2) * 40,
                x2, y2
            );
            
            this.ctx.strokeStyle = '#ffffff40';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    drawCenterCore(centerX, centerY) {
        // Main archetype indicator
        const dominantArchetype = this.getDominantPlayerArchetype();
        const archetypeData = PlayerArchetypes[dominantArchetype];
        
        // Outer ring
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.centerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = archetypeData.color + 'DD';
        this.ctx.fill();
        this.ctx.strokeStyle = archetypeData.color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Inner core with pulse effect
        const pulseRadius = this.centerRadius * 0.6 + Math.sin(Date.now() * 0.003) * 3;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        
        // Archetype initial
        this.ctx.fillStyle = archetypeData.color;
        this.ctx.font = 'bold 14px "Segoe UI"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(archetypeData.name.split(' ').map(w => w[0]).join(''), centerX, centerY);
    }
    
    drawPerformanceIndicators(centerX, centerY) {
        // Small indicators around the circle
        const indicators = [
            { label: 'FORM', value: this.playerData.form, angle: 0 },
            { label: 'CONF', value: this.playerData.confidence, angle: Math.PI / 3 },
            { label: 'FIT', value: this.playerData.fitness, angle: 2 * Math.PI / 3 },
            { label: 'MOR', value: this.playerData.morale, angle: Math.PI },
            { label: 'INJ', value: 1 - this.playerData.injury, angle: 4 * Math.PI / 3 },
            { label: 'EXP', value: this.playerData.experience, angle: 5 * Math.PI / 3 }
        ];
        
        indicators.forEach(indicator => {
            const indicatorRadius = this.radius + 15;
            const x = centerX + Math.cos(indicator.angle) * indicatorRadius;
            const y = centerY + Math.sin(indicator.angle) * indicatorRadius;
            
            // Color based on value
            const color = this.getPerformanceColor(indicator.value);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            // Label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '8px "Segoe UI"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(indicator.label, x, y - 12);
        });
    }
    
    getArchetypeStrength(segmentIndex) {
        // Calculate how well player fits each archetype segment
        // This would analyze player attributes vs archetype requirements
        return Math.random() * 0.8 + 0.2; // Placeholder
    }
    
    getDominantArchetype(segmentIndex) {
        // Return the archetype that best fits this segment
        const archetypes = Object.keys(PlayerArchetypes);
        return archetypes[segmentIndex % archetypes.length];
    }
    
    getDominantPlayerArchetype() {
        // Analyze player attributes to determine best archetype match
        return 'complete-midfielder'; // Placeholder
    }
    
    getPerformanceColor(value) {
        if (value >= 0.8) return '#4CAF50';
        if (value >= 0.6) return '#8BC34A';
        if (value >= 0.4) return '#FFC107';
        if (value >= 0.2) return '#FF9800';
        return '#F44336';
    }
    
    addInteractivity() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if click is in center
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            
            if (distance <= this.centerRadius) {
                this.showArchetypeDetails();
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            // Add hover effects
            this.canvas.style.cursor = 'pointer';
        });
    }
    
    showArchetypeDetails() {
        // Show detailed archetype breakdown
        console.log('Show archetype details modal');
    }
}

// =====================================================================
// PIZZA CHART PERFORMANCE ANALYTICS
// =====================================================================

class PizzaChartAnalytics {
    constructor(container, playerData) {
        this.container = container;
        this.playerData = playerData;
        this.radius = 100;
        this.segments = 23; // 23 discrete value ranges
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.calculateSegments();
        this.render();
        this.addInteractivity();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 220;
        this.canvas.height = 220;
        this.canvas.className = 'pizza-chart';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
    }
    
    calculateSegments() {
        // Group attributes into meaningful segments
        this.segmentData = [
            { name: 'Crossing', value: this.playerData.crossing, category: 'technical' },
            { name: 'Dribbling', value: this.playerData.dribbling, category: 'technical' },
            { name: 'Finishing', value: this.playerData.finishing, category: 'technical' },
            { name: 'First Touch', value: this.playerData.firstTouch, category: 'technical' },
            { name: 'Free Kicks', value: this.playerData.freeKicks, category: 'technical' },
            { name: 'Heading', value: this.playerData.heading, category: 'technical' },
            { name: 'Long Shots', value: this.playerData.longShots, category: 'technical' },
            { name: 'Marking', value: this.playerData.marking, category: 'technical' },
            { name: 'Passing', value: this.playerData.passing, category: 'technical' },
            { name: 'Tackling', value: this.playerData.tackling, category: 'technical' },
            { name: 'Technique', value: this.playerData.technique, category: 'technical' },
            { name: 'Aggression', value: this.playerData.aggression, category: 'mental' },
            { name: 'Anticipation', value: this.playerData.anticipation, category: 'mental' },
            { name: 'Bravery', value: this.playerData.bravery, category: 'mental' },
            { name: 'Composure', value: this.playerData.composure, category: 'mental' },
            { name: 'Concentration', value: this.playerData.concentration, category: 'mental' },
            { name: 'Decisions', value: this.playerData.decisions, category: 'mental' },
            { name: 'Determination', value: this.playerData.determination, category: 'mental' },
            { name: 'Flair', value: this.playerData.flair, category: 'mental' },
            { name: 'Leadership', value: this.playerData.leadership, category: 'mental' },
            { name: 'Off The Ball', value: this.playerData.offTheBall, category: 'mental' },
            { name: 'Positioning', value: this.playerData.positioning, category: 'mental' },
            { name: 'Teamwork', value: this.playerData.teamwork, category: 'mental' },
            { name: 'Vision', value: this.playerData.vision, category: 'mental' },
            { name: 'Work Rate', value: this.playerData.workRate, category: 'mental' },
            { name: 'Acceleration', value: this.playerData.acceleration, category: 'physical' },
            { name: 'Agility', value: this.playerData.agility, category: 'physical' },
            { name: 'Balance', value: this.playerData.balance, category: 'physical' },
            { name: 'Jumping', value: this.playerData.jumping, category: 'physical' },
            { name: 'Natural Fitness', value: this.playerData.naturalFitness, category: 'physical' },
            { name: 'Pace', value: this.playerData.pace, category: 'physical' },
            { name: 'Stamina', value: this.playerData.stamina, category: 'physical' },
            { name: 'Strength', value: this.playerData.strength, category: 'physical' }
        ].slice(0, this.segments); // Take only 23 segments
    }
    
    render() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background circles
        this.drawBackgroundGrid(centerX, centerY);
        
        // Draw segments
        this.drawSegments(centerX, centerY);
        
        // Draw labels
        this.drawLabels(centerX, centerY);
        
        // Draw legend
        this.drawLegend();
    }
    
    drawBackgroundGrid(centerX, centerY) {
        // Concentric circles for reference
        const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
        
        levels.forEach(level => {
            const radius = this.radius * level;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffffff20';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
        
        // Radial lines
        const angleStep = (Math.PI * 2) / this.segments;
        for (let i = 0; i < this.segments; i++) {
            const angle = angleStep * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * this.radius;
            const y = centerY + Math.sin(angle) * this.radius;
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = '#ffffff10';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    drawSegments(centerX, centerY) {
        const angleStep = (Math.PI * 2) / this.segments;
        
        this.segmentData.forEach((segment, index) => {
            const startAngle = angleStep * index - Math.PI / 2;
            const endAngle = startAngle + angleStep;
            
            // Logarithmic scaling for better visualization
            const scaledValue = this.applyLogarithmicScaling(segment.value);
            const segmentRadius = this.radius * scaledValue;
            
            // Color based on category and performance
            const color = this.getSegmentColor(segment);
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, segmentRadius, startAngle, endAngle);
            this.ctx.closePath();
            
            this.ctx.fillStyle = color;
            this.ctx.fill();
            
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
    
    drawLabels(centerX, centerY) {
        const angleStep = (Math.PI * 2) / this.segments;
        
        this.segmentData.forEach((segment, index) => {
            const angle = angleStep * index - Math.PI / 2 + angleStep / 2;
            const labelRadius = this.radius + 15;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            
            // Abbreviate attribute names
            const label = this.abbreviateAttribute(segment.name);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '9px "Segoe UI"';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Rotate text for better readability
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI / 2);
            this.ctx.fillText(label, 0, 0);
            this.ctx.restore();
            
            // Value display
            this.ctx.fillStyle = '#ffffffCC';
            this.ctx.font = '8px "Segoe UI"';
            this.ctx.fillText(segment.value.toString(), x, y + 12);
        });
    }
    
    drawLegend() {
        // Category legend
        const categories = Object.keys(AttributeCategories);
        const legendX = 10;
        const legendY = 10;
        
        categories.forEach((category, index) => {
            const categoryData = AttributeCategories[category];
            const y = legendY + index * 20;
            
            // Color box
            this.ctx.fillStyle = categoryData.color;
            this.ctx.fillRect(legendX, y, 12, 12);
            
            // Label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '11px "Segoe UI"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(categoryData.name, legendX + 18, y + 9);
        });
    }
    
    applyLogarithmicScaling(value) {
        // Logarithmic scaling for better data distribution
        const normalized = value / 20; // Assuming 20 is max attribute value
        return 0.1 + 0.9 * Math.log(1 + normalized * 9) / Math.log(10);
    }
    
    getSegmentColor(segment) {
        const categoryColor = AttributeCategories[segment.category].color;
        const performance = segment.value / 20; // Normalize to 0-1
        
        // Adjust opacity based on performance
        const alpha = 0.3 + 0.7 * performance;
        return categoryColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    }
    
    abbreviateAttribute(name) {
        const abbreviations = {
            'Crossing': 'CRO',
            'Dribbling': 'DRI',
            'Finishing': 'FIN',
            'First Touch': 'FIR',
            'Free Kicks': 'FRE',
            'Heading': 'HEA',
            'Long Shots': 'LON',
            'Marking': 'MAR',
            'Passing': 'PAS',
            'Tackling': 'TAC',
            'Technique': 'TEC',
            'Aggression': 'AGG',
            'Anticipation': 'ANT',
            'Bravery': 'BRA',
            'Composure': 'COM',
            'Concentration': 'CON',
            'Decisions': 'DEC',
            'Determination': 'DET',
            'Flair': 'FLA',
            'Leadership': 'LEA',
            'Off The Ball': 'OTB',
            'Positioning': 'POS',
            'Teamwork': 'TEA',
            'Vision': 'VIS',
            'Work Rate': 'WOR',
            'Acceleration': 'ACC',
            'Agility': 'AGI',
            'Balance': 'BAL',
            'Jumping': 'JUM',
            'Natural Fitness': 'NAT',
            'Pace': 'PAC',
            'Stamina': 'STA',
            'Strength': 'STR'
        };
        
        return abbreviations[name] || name.substring(0, 3).toUpperCase();
    }
    
    addInteractivity() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const segment = this.getSegmentFromCoordinates(x, y);
            if (segment) {
                this.showTooltip(segment, e.clientX, e.clientY);
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }
    
    getSegmentFromCoordinates(x, y) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const angle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;
        const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
        
        const segmentIndex = Math.floor(normalizedAngle / (Math.PI * 2) * this.segments);
        return this.segmentData[segmentIndex];
    }
    
    showTooltip(segment, x, y) {
        // Implementation for tooltip display
        console.log(`Show tooltip for ${segment.name}: ${segment.value}`);
    }
    
    hideTooltip() {
        // Implementation for tooltip hiding
    }
}

// =====================================================================
// ATTRIBUTE CIRCLE SYSTEMS
// =====================================================================

class AttributeCircleSystem {
    constructor(container, attributes) {
        this.container = container;
        this.attributes = attributes;
        this.hierarchyLevels = ['Low', 'Average', 'Good', 'Excellent'];
        this.colors = {
            'Low': '#F44336',
            'Average': '#FF9800', 
            'Good': '#4CAF50',
            'Excellent': '#2196F3'
        };
        
        this.init();
    }
    
    init() {
        this.createAttributeGrid();
    }
    
    createAttributeGrid() {
        const grid = document.createElement('div');
        grid.className = 'attribute-grid';
        
        this.attributes.forEach(attribute => {
            const circle = this.createAttributeCircle(attribute);
            grid.appendChild(circle);
        });
        
        this.container.appendChild(grid);
    }
    
    createAttributeCircle(attribute) {
        const container = document.createElement('div');
        container.className = 'attribute-circle-container';
        
        const circle = document.createElement('div');
        circle.className = 'attribute-circle';
        
        const level = this.getAttributeLevel(attribute.value);
        const color = this.colors[level];
        
        // Set circle size based on value
        const size = 20 + (attribute.value / 20) * 30; // 20-50px range
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.backgroundColor = color;
        circle.style.borderRadius = '50%';
        circle.style.display = 'flex';
        circle.style.alignItems = 'center';
        circle.style.justifyContent = 'center';
        circle.style.margin = '2px';
        circle.style.position = 'relative';
        circle.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        // Value display
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = attribute.value;
        valueDisplay.style.color = '#ffffff';
        valueDisplay.style.fontSize = '10px';
        valueDisplay.style.fontWeight = 'bold';
        circle.appendChild(valueDisplay);
        
        // Label
        const label = document.createElement('div');
        label.className = 'attribute-label';
        label.textContent = attribute.name;
        label.style.fontSize = '9px';
        label.style.color = '#ffffff';
        label.style.textAlign = 'center';
        label.style.marginTop = '2px';
        
        container.appendChild(circle);
        container.appendChild(label);
        
        // Hover effects
        circle.addEventListener('mouseenter', () => {
            circle.style.transform = 'scale(1.2)';
            circle.style.boxShadow = `0 0 15px ${color}`;
        });
        
        circle.addEventListener('mouseleave', () => {
            circle.style.transform = 'scale(1)';
            circle.style.boxShadow = 'none';
        });
        
        return container;
    }
    
    getAttributeLevel(value) {
        if (value >= 15) return 'Excellent';
        if (value >= 12) return 'Good';
        if (value >= 8) return 'Average';
        return 'Low';
    }
}

// =====================================================================
// PLAYER CARD COMPONENTS
// =====================================================================

class PlayerCard {
    constructor(container, playerData) {
        this.container = container;
        this.playerData = playerData;
        this.goldenRatio = 1.618;
        this.baseWidth = 350;
        this.baseHeight = this.baseWidth / this.goldenRatio; // ~216px
        
        this.init();
    }
    
    init() {
        this.createCardStructure();
        this.addAnimations();
    }
    
    createCardStructure() {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.style.cssText = `
            width: ${this.baseWidth}px;
            height: ${this.baseHeight}px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border-radius: 8px;
            border: 1px solid #444;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        `;
        
        // Header section (name, position, rating)
        const header = this.createHeader();
        card.appendChild(header);
        
        // Main content area
        const content = this.createContent();
        card.appendChild(content);
        
        // Status indicators
        const status = this.createStatusBar();
        card.appendChild(status);
        
        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
            card.style.borderColor = '#666';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            card.style.borderColor = '#444';
        });
        
        this.container.appendChild(card);
    }
    
    createHeader() {
        const header = document.createElement('div');
        header.className = 'player-card-header';
        header.style.cssText = `
            padding: 12px 16px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        // Left side - name and position
        const nameSection = document.createElement('div');
        nameSection.innerHTML = `
            <div style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 2px;">
                ${this.playerData.name}
            </div>
            <div style="color: #aaa; font-size: 12px;">
                ${this.playerData.position} • ${this.playerData.age} years
            </div>
        `;
        
        // Right side - overall rating
        const rating = document.createElement('div');
        rating.className = 'overall-rating';
        const ratingColor = this.getRatingColor(this.playerData.overall);
        rating.style.cssText = `
            background: ${ratingColor};
            color: #ffffff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        rating.textContent = this.playerData.overall;
        
        header.appendChild(nameSection);
        header.appendChild(rating);
        
        return header;
    }
    
    createContent() {
        const content = document.createElement('div');
        content.className = 'player-card-content';
        content.style.cssText = `
            padding: 12px 16px;
            display: flex;
            gap: 16px;
            height: calc(100% - 80px);
        `;
        
        // Left side - key attributes
        const attributes = this.createKeyAttributes();
        content.appendChild(attributes);
        
        // Right side - mini visualization
        const visualization = document.createElement('div');
        visualization.className = 'mini-visualization';
        visualization.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        
        // Add mini DNA visualization
        const miniDNA = document.createElement('div');
        miniDNA.style.cssText = `
            width: 80px;
            height: 80px;
            position: relative;
        `;
        new DNAPlayerVisualization(miniDNA, this.playerData);
        visualization.appendChild(miniDNA);
        
        content.appendChild(visualization);
        
        return content;
    }
    
    createKeyAttributes() {
        const attributes = document.createElement('div');
        attributes.className = 'key-attributes';
        attributes.style.cssText = `
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        `;
        
        const keyAttrs = [
            { name: 'Passing', value: this.playerData.passing },
            { name: 'Dribbling', value: this.playerData.dribbling },
            { name: 'Shooting', value: this.playerData.finishing },
            { name: 'Defense', value: this.playerData.tackling },
            { name: 'Physical', value: this.playerData.strength },
            { name: 'Pace', value: this.playerData.pace }
        ];
        
        keyAttrs.forEach(attr => {
            const attrElement = document.createElement('div');
            attrElement.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 0;
                border-bottom: 1px solid #333;
            `;
            
            const name = document.createElement('span');
            name.textContent = attr.name;
            name.style.color = '#ccc';
            name.style.fontSize = '11px';
            
            const value = document.createElement('span');
            value.textContent = attr.value;
            value.style.color = this.getAttributeColor(attr.value);
            value.style.fontSize = '12px';
            value.style.fontWeight = 'bold';
            
            attrElement.appendChild(name);
            attrElement.appendChild(value);
            attributes.appendChild(attrElement);
        });
        
        return attributes;
    }
    
    createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.className = 'status-bar';
        statusBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, 
                ${this.getFormColor()} 0%, 
                ${this.getFormColor()} 25%,
                ${this.getFitnessColor()} 25%, 
                ${this.getFitnessColor()} 50%,
                ${this.getMoraleColor()} 50%, 
                ${this.getMoraleColor()} 75%,
                ${this.getInjuryColor()} 75%, 
                ${this.getInjuryColor()} 100%
            );
        `;
        
        return statusBar;
    }
    
    getRatingColor(rating) {
        if (rating >= 85) return '#2196F3'; // Blue - World Class
        if (rating >= 80) return '#4CAF50'; // Green - Excellent  
        if (rating >= 75) return '#8BC34A'; // Light Green - Good
        if (rating >= 70) return '#FFC107'; // Amber - Average
        if (rating >= 65) return '#FF9800'; // Orange - Below Average
        return '#F44336'; // Red - Poor
    }
    
    getAttributeColor(value) {
        if (value >= 16) return '#2196F3';
        if (value >= 13) return '#4CAF50';
        if (value >= 10) return '#FFC107';
        return '#F44336';
    }
    
    getFormColor() {
        const form = this.playerData.form || 0.7;
        return this.getPerformanceColor(form);
    }
    
    getFitnessColor() {
        const fitness = this.playerData.fitness || 0.8;
        return this.getPerformanceColor(fitness);
    }
    
    getMoraleColor() {
        const morale = this.playerData.morale || 0.75;
        return this.getPerformanceColor(morale);
    }
    
    getInjuryColor() {
        const injury = 1 - (this.playerData.injury || 0);
        return this.getPerformanceColor(injury);
    }
    
    getPerformanceColor(value) {
        if (value >= 0.8) return '#4CAF50';
        if (value >= 0.6) return '#8BC34A';
        if (value >= 0.4) return '#FFC107';
        if (value >= 0.2) return '#FF9800';
        return '#F44336';
    }
    
    addAnimations() {
        // Progressive disclosure animations
        const elements = this.container.querySelectorAll('.player-card *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// =====================================================================
// SQUAD LIST WIDGETS
// =====================================================================

class SquadListWidget {
    constructor(container, playersData) {
        this.container = container;
        this.playersData = playersData;
        this.filteredPlayers = [...playersData];
        this.sortBy = 'overall';
        this.sortOrder = 'desc';
        this.filterBy = 'all';
        this.viewMode = 'grid'; // grid or list
        
        this.init();
    }
    
    init() {
        this.createControls();
        this.createPlayerGrid();
        this.applyFiltersAndSort();
    }
    
    createControls() {
        const controls = document.createElement('div');
        controls.className = 'squad-controls';
        controls.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #1a1a1a;
            border-radius: 8px;
            margin-bottom: 16px;
            gap: 16px;
        `;
        
        // Filter controls
        const filters = this.createFilterControls();
        controls.appendChild(filters);
        
        // Sort controls
        const sorting = this.createSortControls();
        controls.appendChild(sorting);
        
        // View mode toggle
        const viewToggle = this.createViewToggle();
        controls.appendChild(viewToggle);
        
        this.container.appendChild(controls);
    }
    
    createFilterControls() {
        const filterGroup = document.createElement('div');
        filterGroup.className = 'filter-group';
        filterGroup.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;
        
        // Position filter
        const positionFilter = document.createElement('select');
        positionFilter.className = 'position-filter';
        positionFilter.style.cssText = `
            background: #2d2d2d;
            color: #ffffff;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
        `;
        
        const positions = ['All', 'GK', 'DEF', 'MID', 'ATT'];
        positions.forEach(pos => {
            const option = document.createElement('option');
            option.value = pos.toLowerCase();
            option.textContent = pos;
            positionFilter.appendChild(option);
        });
        
        positionFilter.addEventListener('change', (e) => {
            this.filterBy = e.target.value;
            this.applyFiltersAndSort();
        });
        
        // Search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search players...';
        searchInput.className = 'player-search';
        searchInput.style.cssText = `
            background: #2d2d2d;
            color: #ffffff;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
            width: 200px;
        `;
        
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.applyFiltersAndSort();
        });
        
        filterGroup.appendChild(positionFilter);
        filterGroup.appendChild(searchInput);
        
        return filterGroup;
    }
    
    createSortControls() {
        const sortGroup = document.createElement('div');
        sortGroup.className = 'sort-group';
        sortGroup.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;
        
        const sortSelect = document.createElement('select');
        sortSelect.className = 'sort-select';
        sortSelect.style.cssText = `
            background: #2d2d2d;
            color: #ffffff;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
        `;
        
        const sortOptions = [
            { value: 'overall', text: 'Overall Rating' },
            { value: 'name', text: 'Name' },
            { value: 'age', text: 'Age' },
            { value: 'position', text: 'Position' },
            { value: 'value', text: 'Transfer Value' },
            { value: 'wage', text: 'Wage' }
        ];
        
        sortOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            sortSelect.appendChild(optionElement);
        });
        
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFiltersAndSort();
        });
        
        // Sort order toggle
        const sortOrderBtn = document.createElement('button');
        sortOrderBtn.className = 'sort-order-btn';
        sortOrderBtn.textContent = '↓';
        sortOrderBtn.style.cssText = `
            background: #2d2d2d;
            color: #ffffff;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        sortOrderBtn.addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
            sortOrderBtn.textContent = this.sortOrder === 'desc' ? '↓' : '↑';
            this.applyFiltersAndSort();
        });
        
        sortGroup.appendChild(sortSelect);
        sortGroup.appendChild(sortOrderBtn);
        
        return sortGroup;
    }
    
    createViewToggle() {
        const viewToggle = document.createElement('div');
        viewToggle.className = 'view-toggle';
        viewToggle.style.cssText = `
            display: flex;
            background: #2d2d2d;
            border: 1px solid #444;
            border-radius: 4px;
            overflow: hidden;
        `;
        
        const gridBtn = document.createElement('button');
        gridBtn.textContent = '⊞';
        gridBtn.className = 'view-btn grid-btn';
        this.styleViewBtn(gridBtn, this.viewMode === 'grid');
        
        const listBtn = document.createElement('button');
        listBtn.textContent = '☰';
        listBtn.className = 'view-btn list-btn';
        this.styleViewBtn(listBtn, this.viewMode === 'list');
        
        gridBtn.addEventListener('click', () => {
            this.viewMode = 'grid';
            this.styleViewBtn(gridBtn, true);
            this.styleViewBtn(listBtn, false);
            this.renderPlayers();
        });
        
        listBtn.addEventListener('click', () => {
            this.viewMode = 'list';
            this.styleViewBtn(listBtn, true);
            this.styleViewBtn(gridBtn, false);
            this.renderPlayers();
        });
        
        viewToggle.appendChild(gridBtn);
        viewToggle.appendChild(listBtn);
        
        return viewToggle;
    }
    
    styleViewBtn(btn, active) {
        btn.style.cssText = `
            background: ${active ? '#4CAF50' : 'transparent'};
            color: #ffffff;
            border: none;
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        `;
    }
    
    createPlayerGrid() {
        this.playerGrid = document.createElement('div');
        this.playerGrid.className = 'player-grid';
        this.container.appendChild(this.playerGrid);
    }
    
    applyFiltersAndSort() {
        // Apply filters
        this.filteredPlayers = this.playersData.filter(player => {
            // Position filter
            if (this.filterBy !== 'all' && !player.position.toLowerCase().includes(this.filterBy)) {
                return false;
            }
            
            // Search filter
            if (this.searchTerm && !player.name.toLowerCase().includes(this.searchTerm)) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        this.filteredPlayers.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (this.sortOrder === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
        
        this.renderPlayers();
    }
    
    renderPlayers() {
        this.playerGrid.innerHTML = '';
        
        if (this.viewMode === 'grid') {
            this.renderGridView();
        } else {
            this.renderListView();
        }
    }
    
    renderGridView() {
        this.playerGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 16px;
            padding: 16px;
        `;
        
        this.filteredPlayers.forEach(player => {
            const cardContainer = document.createElement('div');
            new PlayerCard(cardContainer, player);
            this.playerGrid.appendChild(cardContainer);
        });
    }
    
    renderListView() {
        this.playerGrid.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
        `;
        
        this.filteredPlayers.forEach(player => {
            const listItem = this.createListItem(player);
            this.playerGrid.appendChild(listItem);
        });
    }
    
    createListItem(player) {
        const item = document.createElement('div');
        item.className = 'player-list-item';
        item.style.cssText = `
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        item.innerHTML = `
            <div style="flex: 2; color: #ffffff; font-weight: 500;">${player.name}</div>
            <div style="flex: 1; color: #aaa; text-align: center;">${player.position}</div>
            <div style="flex: 1; color: #aaa; text-align: center;">${player.age}</div>
            <div style="flex: 1; color: ${this.getRatingColor(player.overall)}; text-align: center; font-weight: bold;">
                ${player.overall}
            </div>
            <div style="flex: 1; color: #aaa; text-align: center;">${player.value || 'N/A'}</div>
            <div style="flex: 1; text-align: center;">
                <div style="width: 60px; height: 4px; background: linear-gradient(90deg, 
                    ${this.getFormColor()} 0%, ${this.getFormColor()} 25%,
                    ${this.getFitnessColor()} 25%, ${this.getFitnessColor()} 50%,
                    ${this.getMoraleColor()} 50%, ${this.getMoraleColor()} 75%,
                    ${this.getInjuryColor()} 75%, ${this.getInjuryColor()} 100%
                ); border-radius: 2px;"></div>
            </div>
        `;
        
        item.addEventListener('mouseenter', () => {
            item.style.background = '#2d2d2d';
            item.style.borderColor = '#555';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = '#1a1a1a';
            item.style.borderColor = '#333';
        });
        
        return item;
    }
    
    getRatingColor(rating) {
        if (rating >= 85) return '#2196F3';
        if (rating >= 80) return '#4CAF50';
        if (rating >= 75) return '#8BC34A';
        if (rating >= 70) return '#FFC107';
        if (rating >= 65) return '#FF9800';
        return '#F44336';
    }
    
    getFormColor() { return '#4CAF50'; }
    getFitnessColor() { return '#2196F3'; }
    getMoraleColor() { return '#FF9800'; }
    getInjuryColor() { return '#F44336'; }
}

// =====================================================================
// CSS STYLES
// =====================================================================

const playerComponentsCSS = `
/* DNA Visualization */
.dna-visualization {
    border-radius: 50%;
    background: radial-gradient(circle, #1a1a1a 0%, #000000 100%);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.dna-visualization:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

/* Pizza Chart */
.pizza-chart {
    background: radial-gradient(circle, #1a1a1a 0%, #000000 70%);
    border-radius: 50%;
    cursor: crosshair;
}

/* Attribute Grid */
.attribute-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 8px;
    padding: 16px;
    background: #1a1a1a;
    border-radius: 8px;
}

.attribute-circle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.attribute-circle {
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.attribute-label {
    transition: color 0.3s ease;
}

.attribute-circle-container:hover .attribute-label {
    color: #4CAF50 !important;
}

/* Player Card */
.player-card {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 1px solid #444;
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.player-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.overall-rating {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* Squad Controls */
.squad-controls select,
.squad-controls input,
.squad-controls button {
    transition: all 0.2s ease;
}

.squad-controls select:hover,
.squad-controls input:hover,
.squad-controls button:hover {
    border-color: #666;
    background: #333;
}

.squad-controls select:focus,
.squad-controls input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* Player List Item */
.player-list-item {
    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.player-list-item:hover {
    transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .player-card {
        width: 100% !important;
        max-width: 350px;
    }
    
    .squad-controls {
        flex-direction: column !important;
        gap: 12px !important;
    }
    
    .filter-group,
    .sort-group {
        width: 100%;
        justify-content: space-between;
    }
    
    .attribute-grid {
        grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)) !important;
    }
}

/* Performance Optimizations */
.player-grid * {
    will-change: transform;
}

.dna-visualization,
.pizza-chart {
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
}

/* Accessibility */
.player-card:focus,
.player-list-item:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
}

/* Loading States */
.loading-shimmer {
    background: linear-gradient(90deg, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.textContent = playerComponentsCSS;
document.head.appendChild(styleElement);

// =====================================================================
// INTEGRATION HELPERS
// =====================================================================

/**
 * Integration helper for subscreen system
 */
window.PlayerComponents = {
    DNAPlayerVisualization,
    PizzaChartAnalytics, 
    AttributeCircleSystem,
    PlayerCard,
    SquadListWidget,
    
    // Quick creation helpers
    createDNAViz: (container, playerData) => new DNAPlayerVisualization(container, playerData),
    createPizzaChart: (container, playerData) => new PizzaChartAnalytics(container, playerData),
    createAttributeCircles: (container, attributes) => new AttributeCircleSystem(container, attributes),
    createPlayerCard: (container, playerData) => new PlayerCard(container, playerData),
    createSquadList: (container, playersData) => new SquadListWidget(container, playersData),
    
    // Sample data generators
    generateSamplePlayer: () => ({
        name: 'Sample Player',
        position: 'CM',
        age: 25,
        overall: 82,
        // Technical attributes
        crossing: 14, dribbling: 16, finishing: 12, firstTouch: 15,
        freeKicks: 8, heading: 11, longShots: 13, marking: 9,
        passing: 17, tackling: 13, technique: 16,
        // Mental attributes  
        aggression: 12, anticipation: 15, bravery: 13, composure: 16,
        concentration: 14, decisions: 15, determination: 16, flair: 14,
        leadership: 11, offTheBall: 13, positioning: 14, teamwork: 16,
        vision: 17, workRate: 15,
        // Physical attributes
        acceleration: 13, agility: 15, balance: 14, jumping: 12,
        naturalFitness: 16, pace: 13, stamina: 17, strength: 14,
        // Status
        form: 0.8, confidence: 0.75, fitness: 0.9, morale: 0.85,
        injury: 0, experience: 0.7, value: '€25M', wage: '€75k'
    }),
    
    generateSampleSquad: (count = 25) => {
        const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'];
        const squad = [];
        
        for (let i = 0; i < count; i++) {
            const player = window.PlayerComponents.generateSamplePlayer();
            player.name = `Player ${i + 1}`;
            player.position = positions[Math.floor(Math.random() * positions.length)];
            player.age = 18 + Math.floor(Math.random() * 15);
            player.overall = 60 + Math.floor(Math.random() * 30);
            
            // Randomize all attributes
            Object.keys(player).forEach(key => {
                if (typeof player[key] === 'number' && key !== 'age' && key !== 'overall') {
                    if (key.includes('form') || key.includes('confidence') || key.includes('fitness') || key.includes('morale') || key.includes('injury') || key.includes('experience')) {
                        player[key] = Math.random();
                    } else {
                        player[key] = 1 + Math.floor(Math.random() * 20);
                    }
                }
            });
            
            squad.push(player);
        }
        
        return squad;
    }
};

console.log('✅ Player Components loaded successfully');
console.log('Available components:', Object.keys(window.PlayerComponents));
console.log('Usage examples:');
console.log('- PlayerComponents.createDNAViz(container, playerData)');
console.log('- PlayerComponents.createPizzaChart(container, playerData)');
console.log('- PlayerComponents.createPlayerCard(container, playerData)');
console.log('- PlayerComponents.createSquadList(container, playersData)');