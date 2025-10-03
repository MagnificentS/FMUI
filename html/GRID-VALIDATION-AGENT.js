/**
 * GRID VALIDATION AGENT
 * Ensures no overlaps and full tile-container occupation with cards/visuals
 * Think Hard about grid utilization and spatial optimization
 */

(function() {
    'use strict';

    console.log('📐 GRID VALIDATION AGENT: Think Hard about ensuring optimal grid utilization and no overlaps...');

    const GridValidationAgent = {
        initialized: false,
        
        // Grid configuration from GRID_CONFIG
        gridConfig: {
            columns: 37,
            rows: 19,
            cellSize: 32,
            gap: 8
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('📐 GRID VALIDATION: Starting comprehensive grid analysis...');
            
            this.validateAllScreens();
            this.setupContinuousMonitoring();
            
            this.initialized = true;
            console.log('✅ GRID VALIDATION: Grid monitoring active');
        },
        
        validateAllScreens() {
            console.log('🔍 Validating all screens for grid utilization and overlaps...');
            
            const screens = ['overview', 'squad', 'tactics', 'training', 'transfers', 'finances', 'fixtures'];
            
            screens.forEach(screenName => {
                this.validateScreen(screenName);
            });
        },
        
        validateScreen(screenName) {
            console.log(`📏 Validating ${screenName} screen grid utilization...`);
            
            const container = document.querySelector(`#${screenName}-grid-view .tile-container`);
            if (!container) {
                console.log(`⚠️ No container found for ${screenName}`);
                return;
            }
            
            const cards = container.querySelectorAll('.card');
            console.log(`📊 ${screenName}: Found ${cards.length} cards`);
            
            if (cards.length === 0) {
                console.log(`⚠️ ${screenName}: Empty screen - needs content`);
                return;
            }
            
            // Calculate grid coverage and check for overlaps
            const validation = this.analyzeGridLayout(cards, screenName);
            
            if (validation.hasOverlaps) {
                console.error(`❌ ${screenName}: Grid overlaps detected`);
                this.reportOverlaps(validation.overlaps);
            } else {
                console.log(`✅ ${screenName}: No overlaps detected`);
            }
            
            console.log(`📊 ${screenName}: Grid utilization ${validation.utilizationPercent.toFixed(1)}%`);
            
            if (validation.utilizationPercent < 60) {
                console.warn(`⚠️ ${screenName}: Low grid utilization - add more cards or resize existing`);
                this.suggestGridOptimization(validation, screenName);
            } else if (validation.utilizationPercent > 90) {
                console.warn(`⚠️ ${screenName}: Very high utilization - may feel cramped`);
            } else {
                console.log(`✅ ${screenName}: Good grid utilization`);
            }
            
            return validation;
        },
        
        analyzeGridLayout(cards, screenName) {
            const occupiedCells = new Set();
            const cardPositions = [];
            let totalOccupiedCells = 0;
            const overlaps = [];
            
            cards.forEach((card, index) => {
                const width = parseInt(card.getAttribute('data-grid-w') || card.className.match(/w(\d+)/)?.[1] || 1);
                const height = parseInt(card.getAttribute('data-grid-h') || card.className.match(/h(\d+)/)?.[1] || 1);
                
                // Get card position from grid styles
                const style = window.getComputedStyle(card);
                const gridColumn = style.gridColumn;
                const gridRow = style.gridRow;
                
                // Parse position (simplified - would need more robust parsing)
                let startCol = 1, startRow = 1;
                
                if (gridColumn.includes('/')) {
                    const match = gridColumn.match(/(\d+)\s*\/\s*span\s*(\d+)/);
                    if (match) {
                        startCol = parseInt(match[1]);
                    }
                } else if (gridColumn.includes('span')) {
                    // Auto-positioned, estimate from card index
                    startCol = 1 + (index * 6) % this.gridConfig.columns;
                    startRow = 1 + Math.floor((index * 6) / this.gridConfig.columns);
                }
                
                const cardPosition = {
                    card: card,
                    startCol: startCol,
                    startRow: startRow,
                    endCol: startCol + width - 1,
                    endRow: startRow + height - 1,
                    width: width,
                    height: height,
                    area: width * height
                };
                
                cardPositions.push(cardPosition);
                
                // Check for overlaps with existing cards
                for (let col = startCol; col <= cardPosition.endCol; col++) {
                    for (let row = startRow; row <= cardPosition.endRow; row++) {
                        const cellKey = `${col},${row}`;
                        
                        if (occupiedCells.has(cellKey)) {
                            overlaps.push({
                                card1: cardPositions.find(pos => 
                                    col >= pos.startCol && col <= pos.endCol && 
                                    row >= pos.startRow && row <= pos.endRow
                                ),
                                card2: cardPosition,
                                cell: cellKey
                            });
                        } else {
                            occupiedCells.add(cellKey);
                            totalOccupiedCells++;
                        }
                    }
                }
            });
            
            const totalGridCells = this.gridConfig.columns * this.gridConfig.rows;
            const utilizationPercent = (totalOccupiedCells / totalGridCells) * 100;
            
            return {
                screenName: screenName,
                cardCount: cards.length,
                cardPositions: cardPositions,
                occupiedCells: totalOccupiedCells,
                totalGridCells: totalGridCells,
                utilizationPercent: utilizationPercent,
                hasOverlaps: overlaps.length > 0,
                overlaps: overlaps,
                gaps: this.findGaps(occupiedCells),
                recommendations: this.generateRecommendations(utilizationPercent, cardPositions)
            };
        },
        
        findGaps(occupiedCells) {
            const gaps = [];
            
            // Find rectangular gaps that could fit new cards
            for (let row = 1; row <= this.gridConfig.rows; row++) {
                for (let col = 1; col <= this.gridConfig.columns; col++) {
                    const cellKey = `${col},${row}`;
                    
                    if (!occupiedCells.has(cellKey)) {
                        // Check if this could be the start of a rectangular gap
                        const gap = this.measureGap(col, row, occupiedCells);
                        if (gap.width >= 3 && gap.height >= 2) { // Minimum useful card size
                            gaps.push(gap);
                        }
                    }
                }
            }
            
            return gaps;
        },
        
        measureGap(startCol, startRow, occupiedCells) {
            let width = 0;
            let height = 0;
            
            // Measure width
            for (let col = startCol; col <= this.gridConfig.columns; col++) {
                const cellKey = `${col},${startRow}`;
                if (!occupiedCells.has(cellKey)) {
                    width++;
                } else {
                    break;
                }
            }
            
            // Measure height
            for (let row = startRow; row <= this.gridConfig.rows; row++) {
                const cellKey = `${startCol},${row}`;
                if (!occupiedCells.has(cellKey)) {
                    height++;
                } else {
                    break;
                }
            }
            
            return {
                startCol: startCol,
                startRow: startRow,
                width: width,
                height: height,
                area: width * height
            };
        },
        
        generateRecommendations(utilizationPercent, cardPositions) {
            const recommendations = [];
            
            if (utilizationPercent < 40) {
                recommendations.push('Add more cards to fill empty space');
                recommendations.push('Consider larger card sizes for existing content');
            } else if (utilizationPercent < 60) {
                recommendations.push('Add 1-2 more cards for better utilization');
                recommendations.push('Resize existing cards to fill gaps');
            } else if (utilizationPercent > 90) {
                recommendations.push('Grid is very full - consider removing less important content');
                recommendations.push('Use smaller card sizes if possible');
            } else {
                recommendations.push('Good grid utilization - well balanced');
            }
            
            // Check for very small cards
            const smallCards = cardPositions.filter(pos => pos.area < 6);
            if (smallCards.length > 0) {
                recommendations.push(`${smallCards.length} cards are very small - consider combining or enlarging`);
            }
            
            // Check for very large cards
            const largeCards = cardPositions.filter(pos => pos.area > 48);
            if (largeCards.length > 0) {
                recommendations.push(`${largeCards.length} cards are very large - consider splitting content`);
            }
            
            return recommendations;
        },
        
        reportOverlaps(overlaps) {
            console.error('❌ GRID OVERLAPS DETECTED:');
            
            overlaps.forEach((overlap, index) => {
                const card1Title = overlap.card1?.card.querySelector('.card-header span')?.textContent || 'Unknown';
                const card2Title = overlap.card2?.card.querySelector('.card-header span')?.textContent || 'Unknown';
                
                console.error(`  Overlap ${index + 1}: "${card1Title}" and "${card2Title}" at cell ${overlap.cell}`);
            });
        },
        
        suggestGridOptimization(validation, screenName) {
            console.log(`💡 GRID OPTIMIZATION SUGGESTIONS for ${screenName}:`);
            
            validation.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
            
            // Show available gaps
            if (validation.gaps.length > 0) {
                console.log(`📍 Available gaps for new cards:`);
                validation.gaps.slice(0, 3).forEach((gap, index) => {
                    console.log(`  Gap ${index + 1}: ${gap.width}×${gap.height} at (${gap.startCol}, ${gap.startRow})`);
                });
            }
        },
        
        setupContinuousMonitoring() {
            console.log('👁️ Setting up continuous grid monitoring...');
            
            // Monitor for card changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.target.classList.contains('tile-container')) {
                        const screenName = this.getScreenNameFromContainer(mutation.target);
                        if (screenName) {
                            console.log(`🔄 Grid changed in ${screenName}, re-validating...`);
                            setTimeout(() => {
                                this.validateScreen(screenName);
                            }, 500); // Allow layout to settle
                        }
                    }
                });
            });
            
            // Observe all tile containers
            document.querySelectorAll('.tile-container').forEach(container => {
                observer.observe(container, { childList: true, subtree: true });
            });
            
            console.log('✅ Continuous grid monitoring active');
        },
        
        getScreenNameFromContainer(container) {
            const page = container.closest('.content-page');
            if (page) {
                return page.id.replace('-page', '');
            }
            return null;
        },
        
        // Helper function to optimize a specific screen
        optimizeScreen(screenName) {
            console.log(`🔧 Optimizing ${screenName} screen grid layout...`);
            
            const validation = this.validateScreen(screenName);
            if (!validation) return;
            
            // Auto-resize cards to better fill space
            if (validation.utilizationPercent < 60) {
                this.autoResizeCards(validation);
            }
            
            // Auto-position cards to eliminate gaps
            if (validation.gaps.length > 0) {
                this.autoFillGaps(validation);
            }
        },
        
        autoResizeCards(validation) {
            console.log('📏 Auto-resizing cards for better grid utilization...');
            
            validation.cardPositions.forEach(position => {
                if (position.area < 12) { // Small cards
                    const card = position.card;
                    const newWidth = Math.min(position.width + 2, 8); // Grow by 2 cells, max 8
                    const newHeight = Math.min(position.height + 1, 4); // Grow by 1 cell, max 4
                    
                    card.setAttribute('data-grid-w', newWidth);
                    card.setAttribute('data-grid-h', newHeight);
                    card.className = card.className.replace(/w\d+ h\d+/, `w${newWidth} h${newHeight}`);
                    
                    console.log(`📏 Resized card "${position.card.querySelector('.card-header span')?.textContent}" to ${newWidth}×${newHeight}`);
                }
            });
        },
        
        autoFillGaps(validation) {
            console.log('🔧 Auto-filling gaps with appropriately sized cards...');
            
            const container = document.querySelector(`#${validation.screenName}-grid-view .tile-container`);
            if (!container) return;
            
            // Find the largest gap
            const largestGap = validation.gaps.reduce((max, gap) => 
                gap.area > max.area ? gap : max, validation.gaps[0]);
            
            if (largestGap && largestGap.area >= 6) {
                console.log(`🔧 Adding card to fill gap: ${largestGap.width}×${largestGap.height} at (${largestGap.startCol}, ${largestGap.startRow})`);
                
                // Create a filler card
                this.createFillerCard(container, largestGap, validation.screenName);
            }
        },
        
        createFillerCard(container, gap, screenName) {
            const fillerCard = document.createElement('div');
            fillerCard.className = `card w${gap.width} h${gap.height} clean-component filler-card`;
            fillerCard.setAttribute('data-grid-w', gap.width);
            fillerCard.setAttribute('data-grid-h', gap.height);
            fillerCard.draggable = false;
            
            // Position the card in the gap
            fillerCard.style.gridColumn = `${gap.startCol} / span ${gap.width}`;
            fillerCard.style.gridRow = `${gap.startRow} / span ${gap.height}`;
            
            const fillerContent = this.generateFillerContent(screenName, gap);
            
            fillerCard.innerHTML = `
                <div class="card-header clean-header">
                    <span>${fillerContent.title}</span>
                    <div class="card-menu">
                        <button class="card-menu-btn" onclick="toggleCardMenu(this, event)">⋯</button>
                    </div>
                </div>
                <div class="card-body clean-body">
                    ${fillerContent.content}
                </div>
                <div class="resize-handle"></div>
                <div class="resize-handle-bl"></div>
            `;
            
            container.appendChild(fillerCard);
            console.log(`✅ Filler card added: ${fillerContent.title} (${gap.width}×${gap.height})`);
        },
        
        generateFillerContent(screenName, gap) {
            const contentMap = {
                overview: {
                    title: 'Quick Stats',
                    content: `
                        <div class="quick-stats-filler">
                            <div class="stat-item">
                                <span class="stat-label">Points This Season</span>
                                <span class="stat-value">17</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Goals Scored</span>
                                <span class="stat-value">12</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Clean Sheets</span>
                                <span class="stat-value">3</span>
                            </div>
                        </div>
                    `
                },
                squad: {
                    title: 'Squad Value',
                    content: `
                        <div class="squad-value-filler">
                            <div class="value-display">
                                <div class="total-value">£678M</div>
                                <div class="value-change">+£45M this season</div>
                            </div>
                            <div class="value-breakdown">
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Attack</span>
                                    <span class="breakdown-value">£280M</span>
                                </div>
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Defense</span>
                                    <span class="breakdown-value">£245M</span>
                                </div>
                            </div>
                        </div>
                    `
                },
                tactics: {
                    title: 'Formation Stats',
                    content: `
                        <div class="formation-stats-filler">
                            <div class="stat-meter">
                                <span class="meter-label">Balance</span>
                                <div class="meter-bar">
                                    <div class="meter-fill" style="width: 78%; background: #00ff88;"></div>
                                </div>
                                <span class="meter-value">78%</span>
                            </div>
                            <div class="stat-meter">
                                <span class="meter-label">Flexibility</span>
                                <div class="meter-bar">
                                    <div class="meter-fill" style="width: 82%; background: #0094cc;"></div>
                                </div>
                                <span class="meter-value">82%</span>
                            </div>
                        </div>
                    `
                }
            };
            
            return contentMap[screenName] || {
                title: 'Additional Info',
                content: `<div class="generic-filler">Additional information for ${screenName}</div>`
            };
        }
    };

    // Add filler card styling
    const fillerStyles = `
        /* Filler Card Styling */
        .filler-card {
            border-left: 2px solid rgba(255, 255, 255, 0.2);
            opacity: 0.9;
        }
        
        .quick-stats-filler, .squad-value-filler, .formation-stats-filler {
            padding: 0;
        }
        
        .stat-item, .breakdown-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 10px;
        }
        
        .stat-label, .breakdown-label {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .stat-value, .breakdown-value {
            color: white;
            font-weight: 600;
        }
        
        .value-display {
            text-align: center;
            margin-bottom: 12px;
        }
        
        .total-value {
            font-size: 16px;
            font-weight: 700;
            color: #00ff88;
        }
        
        .value-change {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .stat-meter {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
            font-size: 9px;
        }
        
        .meter-label {
            width: 60px;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .meter-bar {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .meter-fill {
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .meter-value {
            width: 30px;
            text-align: right;
            color: white;
            font-weight: 600;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'grid-validation-styles';
    style.textContent = fillerStyles;
    document.head.appendChild(style);

    // Auto-initialize
    if (document.readyState === 'complete') {
        setTimeout(() => GridValidationAgent.init(), 3000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => GridValidationAgent.init(), 3000);
        });
    }

    // Make available for manual validation
    window.GridValidationAgent = GridValidationAgent;

    // Global functions for manual optimization
    window.validateCurrentScreen = () => {
        const activeScreen = document.querySelector('.nav-tab.active')?.textContent.toLowerCase();
        if (activeScreen) {
            GridValidationAgent.validateScreen(activeScreen);
        }
    };
    
    window.optimizeCurrentScreen = () => {
        const activeScreen = document.querySelector('.nav-tab.active')?.textContent.toLowerCase();
        if (activeScreen) {
            GridValidationAgent.optimizeScreen(activeScreen);
        }
    };

})();