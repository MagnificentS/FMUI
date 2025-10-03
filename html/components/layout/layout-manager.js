/* ==========================================
   LAYOUT MANAGER - Golden Ratio & Grid Management System
   Advanced layout calculations and optimization
   Compatible with FM-Base 37x19 grid system
   ========================================== */

/**
 * LayoutManager - Advanced layout management with golden ratio calculations
 * 
 * Features:
 * - Golden ratio layout calculations (φ = 1.618)
 * - Responsive grid management beyond 37x19
 * - Card size optimization algorithms
 * - Spacing and padding harmonization
 * - Layout preset templates
 * - Automatic collision detection and resolution
 * 
 * Usage:
 *   const layout = new LayoutManager();
 *   const optimalSize = layout.calculateOptimalCardSize(content);
 *   layout.arrangeCardsOptimally(cardArray);
 */
class LayoutManager {
    constructor() {
        // Mathematical constants
        this.φ = 1.618033988749; // Golden ratio
        this.φ2 = this.φ * this.φ; // φ squared
        this.φInverse = 1 / this.φ; // φ inverse
        
        // Grid configuration (from CSS variables)
        this.updateGridConfig();
        
        // Layout presets based on Football Manager analysis
        this.presets = this.initializePresets();
        
        // Performance optimization
        this.layoutCache = new Map();
        this.lastCacheClean = Date.now();
        
        // Bind methods
        this.calculateOptimalCardSize = this.calculateOptimalCardSize.bind(this);
        this.arrangeCardsOptimally = this.arrangeCardsOptimally.bind(this);
        this.optimizeLayout = this.optimizeLayout.bind(this);
    }

    /**
     * Update grid configuration from CSS variables
     */
    updateGridConfig() {
        const root = document.documentElement;
        const getVar = (name) => parseInt(getComputedStyle(root).getPropertyValue(name)) || 0;
        
        this.grid = {
            columns: getVar('--grid-columns') || 37,
            rows: getVar('--grid-rows') || 19,
            cellSize: getVar('--grid-cell-size') || 32,
            gap: getVar('--grid-gap') || 8,
            paddingV: getVar('--grid-padding-v') || 18,
            paddingH: getVar('--grid-padding-h') || 16,
            minCardWidth: getVar('--min-card-width') || 6,
            minCardHeight: getVar('--min-card-height') || 3,
            defaultCardWidth: getVar('--default-card-width') || 14,
            defaultCardHeight: getVar('--default-card-height') || 8
        };
        
        // Calculate derived values
        this.grid.totalWidth = this.grid.columns * this.grid.cellSize + 
                              (this.grid.columns - 1) * this.grid.gap;
        this.grid.totalHeight = this.grid.rows * this.grid.cellSize + 
                               (this.grid.rows - 1) * this.grid.gap;
    }

    /**
     * Initialize layout presets based on golden ratio principles
     */
    initializePresets() {
        return {
            // Golden rectangle variations
            golden_landscape: {
                width: Math.round(this.grid.minCardWidth * this.φ),
                height: this.grid.minCardWidth,
                description: 'Golden ratio landscape (1.618:1)'
            },
            golden_portrait: {
                width: this.grid.minCardWidth,
                height: Math.round(this.grid.minCardWidth * this.φ),
                description: 'Golden ratio portrait (1:1.618)'
            },
            
            // Fibonacci sequence based sizes
            fibonacci_small: { width: 8, height: 5, description: 'Fibonacci 8:5' },
            fibonacci_medium: { width: 13, height: 8, description: 'Fibonacci 13:8' },
            fibonacci_large: { width: 21, height: 13, description: 'Fibonacci 21:13' },
            
            // FM-specific presets
            stat_card: { width: 6, height: 3, description: 'Small stat display' },
            info_card: { width: 10, height: 6, description: 'Standard info card' },
            detail_card: { width: 14, height: 8, description: 'Detailed information' },
            overview_card: { width: 18, height: 11, description: 'Large overview' },
            full_width: { width: 37, height: 8, description: 'Full width card' },
            
            // Square variations
            square_small: { width: 6, height: 6, description: 'Small square' },
            square_medium: { width: 10, height: 10, description: 'Medium square' },
            square_large: { width: 14, height: 14, description: 'Large square' },
            
            // Root rectangles (mathematical ratios)
            root_2: {
                width: Math.round(this.grid.minCardWidth * 1.414),
                height: this.grid.minCardWidth,
                description: 'Root 2 rectangle (DIN/ISO standard)'
            },
            root_3: {
                width: Math.round(this.grid.minCardWidth * 1.732),
                height: this.grid.minCardWidth,
                description: 'Root 3 rectangle (hexagonal harmony)'
            },
            
            // Content-driven presets
            player_card: { width: 8, height: 12, description: 'Player information' },
            match_card: { width: 16, height: 9, description: 'Match details (16:9)' },
            table_card: { width: 20, height: 12, description: 'League table display' },
            tactics_card: { width: 15, height: 15, description: 'Tactical overview' }
        };
    }

    /**
     * Calculate optimal card size based on content and golden ratio principles
     * @param {Object} contentInfo - Information about card content
     * @param {string} preferredRatio - Preferred aspect ratio ('golden', 'square', 'auto')
     * @returns {Object} Optimal size {width, height, reasoning}
     */
    calculateOptimalCardSize(contentInfo = {}, preferredRatio = 'auto') {
        const {
            contentType = 'general',
            textLength = 0,
            hasImage = false,
            hasChart = false,
            dataRows = 0,
            dataColumns = 0,
            priority = 'medium'
        } = contentInfo;

        let baseWidth = this.grid.minCardWidth;
        let baseHeight = this.grid.minCardHeight;
        let reasoning = [];

        // Content-driven sizing
        if (contentType === 'player') {
            baseWidth = 8;
            baseHeight = 12;
            reasoning.push('Player card optimized for portrait layout');
        } else if (contentType === 'match') {
            baseWidth = 16;
            baseHeight = 9;
            reasoning.push('Match card using 16:9 aspect ratio');
        } else if (contentType === 'table' && dataRows > 0) {
            baseWidth = Math.max(12, Math.min(25, dataColumns * 3));
            baseHeight = Math.max(6, Math.min(15, dataRows + 3));
            reasoning.push(`Table sized for ${dataRows} rows, ${dataColumns} columns`);
        } else if (contentType === 'chart' || hasChart) {
            // Charts benefit from golden ratio
            baseWidth = Math.round(this.grid.minCardWidth * this.φ);
            baseHeight = this.grid.minCardWidth;
            reasoning.push('Chart using golden ratio for visual balance');
        }

        // Text length adjustments
        if (textLength > 0) {
            const textFactor = Math.sqrt(textLength / 100); // Square root scaling
            baseWidth = Math.max(baseWidth, Math.ceil(baseWidth * textFactor));
            baseHeight = Math.max(baseHeight, Math.ceil(baseHeight * (textFactor * 0.7)));
            reasoning.push(`Text length adjusted by factor ${textFactor.toFixed(2)}`);
        }

        // Image accommodations
        if (hasImage) {
            baseHeight += 2; // Extra space for images
            reasoning.push('Extra height for image content');
        }

        // Priority adjustments
        const priorityMultipliers = {
            low: 0.8,
            medium: 1.0,
            high: 1.2,
            critical: 1.4
        };
        
        const multiplier = priorityMultipliers[priority] || 1.0;
        if (multiplier !== 1.0) {
            baseWidth = Math.ceil(baseWidth * multiplier);
            baseHeight = Math.ceil(baseHeight * multiplier);
            reasoning.push(`${priority} priority scaling: ${multiplier}x`);
        }

        // Apply preferred ratio
        if (preferredRatio === 'golden') {
            const currentRatio = baseWidth / baseHeight;
            if (currentRatio < this.φ) {
                baseWidth = Math.ceil(baseHeight * this.φ);
            } else {
                baseHeight = Math.ceil(baseWidth / this.φ);
            }
            reasoning.push('Adjusted to golden ratio');
        } else if (preferredRatio === 'square') {
            const maxDimension = Math.max(baseWidth, baseHeight);
            baseWidth = baseHeight = maxDimension;
            reasoning.push('Adjusted to square aspect ratio');
        }

        // Ensure grid constraints
        baseWidth = Math.max(this.grid.minCardWidth, Math.min(this.grid.columns, baseWidth));
        baseHeight = Math.max(this.grid.minCardHeight, Math.min(this.grid.rows, baseHeight));

        return {
            width: baseWidth,
            height: baseHeight,
            aspectRatio: baseWidth / baseHeight,
            reasoning: reasoning,
            preset: this.findClosestPreset(baseWidth, baseHeight)
        };
    }

    /**
     * Find the closest preset to given dimensions
     * @param {number} width - Target width
     * @param {number} height - Target height
     * @returns {string} Closest preset name
     */
    findClosestPreset(width, height) {
        let bestMatch = null;
        let bestScore = Infinity;

        for (const [name, preset] of Object.entries(this.presets)) {
            const widthDiff = Math.abs(preset.width - width);
            const heightDiff = Math.abs(preset.height - height);
            const score = widthDiff + heightDiff;

            if (score < bestScore) {
                bestScore = score;
                bestMatch = name;
            }
        }

        return bestMatch;
    }

    /**
     * Arrange cards optimally using golden ratio and flow principles
     * @param {Array} cards - Array of card elements or card data
     * @param {Object} options - Arrangement options
     * @returns {Array} Optimal positions for each card
     */
    arrangeCardsOptimally(cards, options = {}) {
        const {
            algorithm = 'golden_spiral',
            prioritizeImportant = true,
            allowOverlap = false,
            compactness = 0.8,
            flowDirection = 'ltr'
        } = options;

        if (!cards || cards.length === 0) return [];

        // Sort cards by priority if requested
        let sortedCards = [...cards];
        if (prioritizeImportant) {
            sortedCards.sort((a, b) => {
                const priorityA = this.getCardPriority(a);
                const priorityB = this.getCardPriority(b);
                return priorityB - priorityA; // Higher priority first
            });
        }

        // Choose arrangement algorithm
        switch (algorithm) {
            case 'golden_spiral':
                return this.arrangeInGoldenSpiral(sortedCards, options);
            case 'fibonacci_grid':
                return this.arrangeInFibonacciGrid(sortedCards, options);
            case 'priority_zones':
                return this.arrangeInPriorityZones(sortedCards, options);
            case 'compact_fill':
                return this.arrangeCompactFill(sortedCards, options);
            default:
                return this.arrangeInGoldenSpiral(sortedCards, options);
        }
    }

    /**
     * Arrange cards in a golden spiral pattern
     * @param {Array} cards - Card elements
     * @param {Object} options - Options
     * @returns {Array} Positions
     */
    arrangeInGoldenSpiral(cards, options) {
        const positions = [];
        const occupiedCells = new Set();
        const center = {
            x: Math.floor(this.grid.columns / 2),
            y: Math.floor(this.grid.rows / 2)
        };

        cards.forEach((card, index) => {
            const cardSize = this.getCardSize(card);
            const angle = (index / cards.length) * Math.PI * 2 * this.φ;
            const radius = Math.sqrt(index) * 2;
            
            let x = Math.round(center.x + Math.cos(angle) * radius);
            let y = Math.round(center.y + Math.sin(angle) * radius);
            
            // Ensure within bounds
            x = Math.max(0, Math.min(this.grid.columns - cardSize.width, x));
            y = Math.max(0, Math.min(this.grid.rows - cardSize.height, y));
            
            // Find first available position if collision detected
            const position = this.findAvailablePosition(x, y, cardSize, occupiedCells);
            this.markOccupied(position.x, position.y, cardSize, occupiedCells);
            
            positions.push({
                ...position,
                ...cardSize,
                index,
                algorithm: 'golden_spiral'
            });
        });

        return positions;
    }

    /**
     * Arrange cards in Fibonacci-based grid
     * @param {Array} cards - Card elements
     * @param {Object} options - Options
     * @returns {Array} Positions
     */
    arrangeInFibonacciGrid(cards, options) {
        const positions = [];
        const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34];
        const occupiedCells = new Set();
        
        let currentX = 0;
        let currentY = 0;
        let sectionIndex = 0;

        cards.forEach((card, index) => {
            const cardSize = this.getCardSize(card);
            const sectionWidth = fibonacci[sectionIndex % fibonacci.length];
            
            // Find position within current Fibonacci section
            const position = this.findAvailablePosition(currentX, currentY, cardSize, occupiedCells);
            this.markOccupied(position.x, position.y, cardSize, occupiedCells);
            
            positions.push({
                ...position,
                ...cardSize,
                index,
                algorithm: 'fibonacci_grid'
            });
            
            // Advance to next position
            currentX += cardSize.width + 1;
            if (currentX + cardSize.width > this.grid.columns) {
                currentX = 0;
                currentY += Math.max(5, fibonacci[sectionIndex % fibonacci.length]);
                sectionIndex++;
            }
        });

        return positions;
    }

    /**
     * Arrange cards in priority-based zones
     * @param {Array} cards - Card elements
     * @param {Object} options - Options
     * @returns {Array} Positions
     */
    arrangeInPriorityZones(cards, options) {
        const positions = [];
        const occupiedCells = new Set();
        
        // Define priority zones using golden ratio divisions
        const zones = {
            critical: { x: 0, y: 0, width: Math.floor(this.grid.columns / this.φ), height: Math.floor(this.grid.rows / this.φ) },
            high: { x: Math.floor(this.grid.columns / this.φ), y: 0, width: this.grid.columns - Math.floor(this.grid.columns / this.φ), height: Math.floor(this.grid.rows / this.φ) },
            medium: { x: 0, y: Math.floor(this.grid.rows / this.φ), width: Math.floor(this.grid.columns / this.φ), height: this.grid.rows - Math.floor(this.grid.rows / this.φ) },
            low: { x: Math.floor(this.grid.columns / this.φ), y: Math.floor(this.grid.rows / this.φ), width: this.grid.columns - Math.floor(this.grid.columns / this.φ), height: this.grid.rows - Math.floor(this.grid.rows / this.φ) }
        };

        cards.forEach((card, index) => {
            const cardSize = this.getCardSize(card);
            const priority = this.getCardPriority(card);
            
            // Determine target zone
            let targetZone;
            if (priority >= 0.8) targetZone = zones.critical;
            else if (priority >= 0.6) targetZone = zones.high;
            else if (priority >= 0.4) targetZone = zones.medium;
            else targetZone = zones.low;
            
            // Find position within zone
            const position = this.findAvailablePositionInZone(targetZone, cardSize, occupiedCells);
            this.markOccupied(position.x, position.y, cardSize, occupiedCells);
            
            positions.push({
                ...position,
                ...cardSize,
                index,
                priority,
                zone: Object.keys(zones).find(key => zones[key] === targetZone),
                algorithm: 'priority_zones'
            });
        });

        return positions;
    }

    /**
     * Arrange cards with compact fill algorithm
     * @param {Array} cards - Card elements
     * @param {Object} options - Options
     * @returns {Array} Positions
     */
    arrangeCompactFill(cards, options) {
        const positions = [];
        const occupiedCells = new Set();
        
        // Sort by size (largest first for better packing)
        const sortedCards = [...cards].sort((a, b) => {
            const sizeA = this.getCardSize(a);
            const sizeB = this.getCardSize(b);
            return (sizeB.width * sizeB.height) - (sizeA.width * sizeA.height);
        });

        sortedCards.forEach((card, index) => {
            const cardSize = this.getCardSize(card);
            const position = this.findOptimalCompactPosition(cardSize, occupiedCells);
            this.markOccupied(position.x, position.y, cardSize, occupiedCells);
            
            positions.push({
                ...position,
                ...cardSize,
                index: cards.indexOf(card), // Preserve original index
                algorithm: 'compact_fill'
            });
        });

        return positions;
    }

    /**
     * Get card size from element or default
     * @param {HTMLElement|Object} card - Card element or data
     * @returns {Object} {width, height}
     */
    getCardSize(card) {
        if (card.dataset && card.dataset.width && card.dataset.height) {
            return {
                width: parseInt(card.dataset.width),
                height: parseInt(card.dataset.height)
            };
        }
        
        if (card.width && card.height) {
            return { width: card.width, height: card.height };
        }
        
        return {
            width: this.grid.defaultCardWidth,
            height: this.grid.defaultCardHeight
        };
    }

    /**
     * Get card priority (0-1 scale)
     * @param {HTMLElement|Object} card - Card element or data
     * @returns {number} Priority value
     */
    getCardPriority(card) {
        if (card.dataset && card.dataset.priority) {
            return parseFloat(card.dataset.priority);
        }
        
        if (card.priority !== undefined) {
            return parseFloat(card.priority);
        }
        
        // Default priority based on card type
        const className = card.className || card.class || '';
        if (className.includes('critical')) return 0.9;
        if (className.includes('important')) return 0.7;
        if (className.includes('secondary')) return 0.3;
        
        return 0.5; // Default medium priority
    }

    /**
     * Find available position starting from given coordinates
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     * @param {Object} size - {width, height}
     * @param {Set} occupiedCells - Set of occupied cell keys
     * @returns {Object} {x, y}
     */
    findAvailablePosition(startX, startY, size, occupiedCells) {
        // Spiral search pattern for optimal placement
        const maxDistance = Math.max(this.grid.columns, this.grid.rows);
        
        for (let distance = 0; distance < maxDistance; distance++) {
            for (let angle = 0; angle < 360; angle += 45) {
                const x = Math.round(startX + Math.cos(angle * Math.PI / 180) * distance);
                const y = Math.round(startY + Math.sin(angle * Math.PI / 180) * distance);
                
                if (this.isPositionAvailable(x, y, size, occupiedCells)) {
                    return { x, y };
                }
            }
        }
        
        // Fallback: linear search
        for (let y = 0; y <= this.grid.rows - size.height; y++) {
            for (let x = 0; x <= this.grid.columns - size.width; x++) {
                if (this.isPositionAvailable(x, y, size, occupiedCells)) {
                    return { x, y };
                }
            }
        }
        
        return { x: 0, y: 0 }; // Last resort
    }

    /**
     * Find available position within a specific zone
     * @param {Object} zone - Zone boundaries
     * @param {Object} size - Card size
     * @param {Set} occupiedCells - Occupied cells
     * @returns {Object} Position
     */
    findAvailablePositionInZone(zone, size, occupiedCells) {
        for (let y = zone.y; y <= zone.y + zone.height - size.height; y++) {
            for (let x = zone.x; x <= zone.x + zone.width - size.width; x++) {
                if (this.isPositionAvailable(x, y, size, occupiedCells)) {
                    return { x, y };
                }
            }
        }
        
        // If no space in zone, find globally
        return this.findAvailablePosition(zone.x, zone.y, size, occupiedCells);
    }

    /**
     * Find optimal position for compact packing
     * @param {Object} size - Card size
     * @param {Set} occupiedCells - Occupied cells
     * @returns {Object} Position
     */
    findOptimalCompactPosition(size, occupiedCells) {
        let bestPosition = { x: 0, y: 0 };
        let bestScore = Infinity;
        
        for (let y = 0; y <= this.grid.rows - size.height; y++) {
            for (let x = 0; x <= this.grid.columns - size.width; x++) {
                if (this.isPositionAvailable(x, y, size, occupiedCells)) {
                    // Score based on distance to top-left and proximity to other cards
                    const distance = Math.sqrt(x * x + y * y);
                    const neighbors = this.countNeighbors(x, y, size, occupiedCells);
                    const score = distance - neighbors * 5; // Prefer positions with neighbors
                    
                    if (score < bestScore) {
                        bestScore = score;
                        bestPosition = { x, y };
                    }
                }
            }
        }
        
        return bestPosition;
    }

    /**
     * Check if position is available for card placement
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} size - Card size
     * @param {Set} occupiedCells - Occupied cells
     * @returns {boolean} Is available
     */
    isPositionAvailable(x, y, size, occupiedCells) {
        if (x < 0 || y < 0 || 
            x + size.width > this.grid.columns || 
            y + size.height > this.grid.rows) {
            return false;
        }
        
        for (let dy = 0; dy < size.height; dy++) {
            for (let dx = 0; dx < size.width; dx++) {
                const cellKey = `${x + dx},${y + dy}`;
                if (occupiedCells.has(cellKey)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Mark cells as occupied
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} size - Card size
     * @param {Set} occupiedCells - Occupied cells set
     */
    markOccupied(x, y, size, occupiedCells) {
        for (let dy = 0; dy < size.height; dy++) {
            for (let dx = 0; dx < size.width; dx++) {
                const cellKey = `${x + dx},${y + dy}`;
                occupiedCells.add(cellKey);
            }
        }
    }

    /**
     * Count neighboring occupied cells
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} size - Card size
     * @param {Set} occupiedCells - Occupied cells
     * @returns {number} Neighbor count
     */
    countNeighbors(x, y, size, occupiedCells) {
        let count = 0;
        const checkPositions = [
            [-1, 0], [size.width, 0], [0, -1], [0, size.height],
            [-1, -1], [size.width, -1], [-1, size.height], [size.width, size.height]
        ];
        
        checkPositions.forEach(([dx, dy]) => {
            const cellKey = `${x + dx},${y + dy}`;
            if (occupiedCells.has(cellKey)) count++;
        });
        
        return count;
    }

    /**
     * Optimize existing layout for better visual harmony
     * @param {Array} cards - Current card positions
     * @returns {Array} Optimized positions
     */
    optimizeLayout(cards) {
        if (!cards || cards.length === 0) return [];
        
        const cacheKey = this.generateLayoutCacheKey(cards);
        if (this.layoutCache.has(cacheKey)) {
            return this.layoutCache.get(cacheKey);
        }
        
        // Clean cache periodically
        if (Date.now() - this.lastCacheClean > 300000) { // 5 minutes
            this.layoutCache.clear();
            this.lastCacheClean = Date.now();
        }
        
        const optimized = this.performLayoutOptimization(cards);
        this.layoutCache.set(cacheKey, optimized);
        
        return optimized;
    }

    /**
     * Perform actual layout optimization
     * @param {Array} cards - Card positions
     * @returns {Array} Optimized positions
     */
    performLayoutOptimization(cards) {
        // Calculate current layout quality
        const quality = this.calculateLayoutQuality(cards);
        
        // If quality is already high, minor adjustments only
        if (quality.overall > 0.8) {
            return this.microOptimize(cards);
        }
        
        // Otherwise, perform full optimization
        return this.fullOptimize(cards);
    }

    /**
     * Calculate layout quality metrics
     * @param {Array} cards - Card positions
     * @returns {Object} Quality metrics
     */
    calculateLayoutQuality(cards) {
        const metrics = {
            alignment: this.calculateAlignmentScore(cards),
            spacing: this.calculateSpacingScore(cards),
            balance: this.calculateBalanceScore(cards),
            efficiency: this.calculateEfficiencyScore(cards),
            goldenRatio: this.calculateGoldenRatioScore(cards)
        };
        
        metrics.overall = Object.values(metrics).reduce((sum, score) => sum + score, 0) / 5;
        
        return metrics;
    }

    /**
     * Calculate alignment score
     * @param {Array} cards - Card positions
     * @returns {number} Alignment score (0-1)
     */
    calculateAlignmentScore(cards) {
        const alignmentLines = { x: new Set(), y: new Set() };
        
        cards.forEach(card => {
            alignmentLines.x.add(card.x);
            alignmentLines.x.add(card.x + card.width);
            alignmentLines.y.add(card.y);
            alignmentLines.y.add(card.y + card.height);
        });
        
        // Score based on how many cards align on common lines
        const totalAlignments = alignmentLines.x.size + alignmentLines.y.size;
        const expectedAlignments = cards.length * 2;
        
        return Math.max(0, 1 - (totalAlignments / expectedAlignments));
    }

    /**
     * Calculate spacing harmony score
     * @param {Array} cards - Card positions
     * @returns {number} Spacing score (0-1)
     */
    calculateSpacingScore(cards) {
        const gaps = [];
        
        cards.forEach((card, i) => {
            cards.slice(i + 1).forEach(otherCard => {
                const xGap = Math.max(0, Math.min(card.x + card.width, otherCard.x + otherCard.width) - 
                                     Math.max(card.x, otherCard.x));
                const yGap = Math.max(0, Math.min(card.y + card.height, otherCard.y + otherCard.height) - 
                                     Math.max(card.y, otherCard.y));
                
                if (xGap === 0 || yGap === 0) { // Adjacent cards
                    gaps.push(Math.abs(xGap - yGap));
                }
            });
        });
        
        if (gaps.length === 0) return 1;
        
        const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
        const gapVariance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
        
        return Math.max(0, 1 - (gapVariance / (avgGap * avgGap + 1)));
    }

    /**
     * Calculate visual balance score
     * @param {Array} cards - Card positions
     * @returns {number} Balance score (0-1)
     */
    calculateBalanceScore(cards) {
        const centerX = this.grid.columns / 2;
        const centerY = this.grid.rows / 2;
        
        let totalWeight = 0;
        let weightedX = 0;
        let weightedY = 0;
        
        cards.forEach(card => {
            const weight = card.width * card.height;
            const cardCenterX = card.x + card.width / 2;
            const cardCenterY = card.y + card.height / 2;
            
            totalWeight += weight;
            weightedX += weight * cardCenterX;
            weightedY += weight * cardCenterY;
        });
        
        const balanceX = Math.abs(weightedX / totalWeight - centerX) / centerX;
        const balanceY = Math.abs(weightedY / totalWeight - centerY) / centerY;
        
        return Math.max(0, 1 - (balanceX + balanceY) / 2);
    }

    /**
     * Calculate space efficiency score
     * @param {Array} cards - Card positions
     * @returns {number} Efficiency score (0-1)
     */
    calculateEfficiencyScore(cards) {
        const usedCells = cards.reduce((sum, card) => sum + (card.width * card.height), 0);
        const totalCells = this.grid.columns * this.grid.rows;
        
        return usedCells / totalCells;
    }

    /**
     * Calculate golden ratio adherence score
     * @param {Array} cards - Card positions
     * @returns {number} Golden ratio score (0-1)
     */
    calculateGoldenRatioScore(cards) {
        let totalScore = 0;
        
        cards.forEach(card => {
            const ratio = card.width / card.height;
            const goldenDistance = Math.abs(ratio - this.φ);
            const inverseGoldenDistance = Math.abs(ratio - this.φInverse);
            const squareDistance = Math.abs(ratio - 1);
            
            // Score based on proximity to pleasing ratios
            const minDistance = Math.min(goldenDistance, inverseGoldenDistance, squareDistance);
            totalScore += Math.max(0, 1 - minDistance);
        });
        
        return cards.length > 0 ? totalScore / cards.length : 0;
    }

    /**
     * Generate cache key for layout
     * @param {Array} cards - Card positions
     * @returns {string} Cache key
     */
    generateLayoutCacheKey(cards) {
        return cards.map(card => `${card.x},${card.y},${card.width},${card.height}`).join('|');
    }

    /**
     * Perform micro-optimizations on good layouts
     * @param {Array} cards - Card positions
     * @returns {Array} Micro-optimized positions
     */
    microOptimize(cards) {
        // Small adjustments for perfect alignment
        return cards.map(card => ({
            ...card,
            x: this.snapToNearestAlignment(card.x, cards, 'x'),
            y: this.snapToNearestAlignment(card.y, cards, 'y')
        }));
    }

    /**
     * Perform full layout optimization
     * @param {Array} cards - Card positions
     * @returns {Array} Fully optimized positions
     */
    fullOptimize(cards) {
        // Re-arrange using optimal algorithm
        return this.arrangeCardsOptimally(cards, { algorithm: 'priority_zones' });
    }

    /**
     * Snap coordinate to nearest alignment line
     * @param {number} coord - Current coordinate
     * @param {Array} cards - All cards
     * @param {string} axis - 'x' or 'y'
     * @returns {number} Snapped coordinate
     */
    snapToNearestAlignment(coord, cards, axis) {
        const alignmentLines = new Set();
        
        cards.forEach(card => {
            alignmentLines.add(card[axis]);
            alignmentLines.add(card[axis] + (axis === 'x' ? card.width : card.height));
        });
        
        let nearest = coord;
        let minDistance = Infinity;
        
        alignmentLines.forEach(line => {
            const distance = Math.abs(line - coord);
            if (distance < minDistance && distance <= 2) { // Within 2 cells
                minDistance = distance;
                nearest = line;
            }
        });
        
        return nearest;
    }

    /**
     * Get layout analysis for debugging
     * @param {Array} cards - Card positions
     * @returns {Object} Analysis data
     */
    analyzeLayout(cards) {
        const quality = this.calculateLayoutQuality(cards);
        const coverage = this.calculateCoverage(cards);
        const gaps = this.findGaps(cards);
        
        return {
            quality,
            coverage,
            gaps,
            recommendations: this.generateRecommendations(quality, gaps)
        };
    }

    /**
     * Calculate grid coverage
     * @param {Array} cards - Card positions
     * @returns {Object} Coverage data
     */
    calculateCoverage(cards) {
        const occupied = new Set();
        
        cards.forEach(card => {
            for (let y = card.y; y < card.y + card.height; y++) {
                for (let x = card.x; x < card.x + card.width; x++) {
                    occupied.add(`${x},${y}`);
                }
            }
        });
        
        const totalCells = this.grid.columns * this.grid.rows;
        const occupiedCells = occupied.size;
        
        return {
            percentage: (occupiedCells / totalCells) * 100,
            occupiedCells,
            totalCells,
            emptyCells: totalCells - occupiedCells
        };
    }

    /**
     * Find significant gaps in layout
     * @param {Array} cards - Card positions
     * @returns {Array} Gap data
     */
    findGaps(cards) {
        const occupied = new Set();
        
        cards.forEach(card => {
            for (let y = card.y; y < card.y + card.height; y++) {
                for (let x = card.x; x < card.x + card.width; x++) {
                    occupied.add(`${x},${y}`);
                }
            }
        });
        
        const gaps = [];
        
        // Find rectangular gaps
        for (let y = 0; y < this.grid.rows; y++) {
            for (let x = 0; x < this.grid.columns; x++) {
                if (!occupied.has(`${x},${y}`)) {
                    const gap = this.measureGap(x, y, occupied);
                    if (gap.width >= 3 && gap.height >= 3) { // Significant gaps only
                        gaps.push(gap);
                    }
                }
            }
        }
        
        return gaps;
    }

    /**
     * Measure gap size starting from point
     * @param {number} startX - Start X
     * @param {number} startY - Start Y
     * @param {Set} occupied - Occupied cells
     * @returns {Object} Gap dimensions
     */
    measureGap(startX, startY, occupied) {
        let width = 0;
        let height = 0;
        
        // Measure width
        for (let x = startX; x < this.grid.columns; x++) {
            if (occupied.has(`${x},${startY}`)) break;
            width++;
        }
        
        // Measure height
        for (let y = startY; y < this.grid.rows; y++) {
            if (occupied.has(`${startX},${y}`)) break;
            height++;
        }
        
        return { x: startX, y: startY, width, height };
    }

    /**
     * Generate layout recommendations
     * @param {Object} quality - Quality metrics
     * @param {Array} gaps - Gap data
     * @returns {Array} Recommendations
     */
    generateRecommendations(quality, gaps) {
        const recommendations = [];
        
        if (quality.alignment < 0.7) {
            recommendations.push({
                type: 'alignment',
                severity: 'medium',
                message: 'Consider aligning cards to common grid lines for better visual order'
            });
        }
        
        if (quality.balance < 0.6) {
            recommendations.push({
                type: 'balance',
                severity: 'high',
                message: 'Layout appears visually unbalanced. Redistribute cards more evenly'
            });
        }
        
        if (quality.efficiency < 0.4) {
            recommendations.push({
                type: 'efficiency',
                severity: 'low',
                message: 'Consider using available space more efficiently'
            });
        }
        
        if (gaps.length > 3) {
            recommendations.push({
                type: 'gaps',
                severity: 'medium',
                message: `Found ${gaps.length} significant gaps. Consider consolidating cards`
            });
        }
        
        return recommendations;
    }
}

// Export to global scope for FM-Base integration
if (typeof window !== 'undefined') {
    window.LayoutManager = LayoutManager;
    
    // Auto-initialize if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.fmLayout = new LayoutManager();
        });
    } else {
        window.fmLayout = new LayoutManager();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutManager;
}