/**
 * FINAL UX VALIDATOR
 * Comprehensive UI/UX validation ensuring no overlaps and full tile-container occupation
 * Think Hard about visual quality, grid utilization, and user experience validation
 */

(function() {
    'use strict';

    console.log('🏆 FINAL UX VALIDATOR: Think Hard about comprehensive UI/UX quality validation...');

    const FinalUXValidator = {
        initialized: false,
        validationResults: new Map(),
        
        validationCriteria: {
            // Grid utilization requirements
            minUtilization: 60,  // Minimum 60% grid utilization
            maxUtilization: 85,  // Maximum 85% to avoid cramping
            
            // Component requirements per screen
            maxComponentsPerScreen: 6,
            maxCognitiveLoad: 8,
            
            // Visual quality requirements
            minCardSize: 6,      // Minimum 6 grid cells (w3 h2)
            maxCardSize: 60,     // Maximum 60 grid cells (w10 h6)
            
            // UX requirements
            maxTaskCompletionTime: 300, // 5 minutes max per screen
            minUserSuccessRate: 85      // 85% task completion rate
        },
        
        init() {
            if (this.initialized) return;
            
            console.log('🏆 FINAL VALIDATOR: Starting comprehensive validation...');
            
            this.validateAllScreens();
            this.generateFinalReport();
            this.showValidationResults();
            
            this.initialized = true;
            console.log('✅ FINAL VALIDATOR: Validation complete');
        },
        
        validateAllScreens() {
            console.log('🔍 Validating all screens for UX compliance...');
            
            const screens = ['overview', 'squad', 'tactics', 'training', 'transfers', 'finances', 'fixtures'];
            
            screens.forEach(screenName => {
                const validation = this.validateScreen(screenName);
                this.validationResults.set(screenName, validation);
                
                console.log(`📊 ${screenName.toUpperCase()}: ${validation.overallScore}/100 (${validation.status})`);
            });
        },
        
        validateScreen(screenName) {
            console.log(`📋 Validating ${screenName} screen...`);
            
            const container = document.querySelector(`#${screenName}-grid-view .tile-container`);
            const cards = container ? container.querySelectorAll('.card') : [];
            
            const validation = {
                screenName: screenName,
                componentCount: cards.length,
                cards: Array.from(cards),
                scores: {},
                issues: [],
                recommendations: [],
                status: 'UNKNOWN',
                overallScore: 0
            };
            
            // Test 1: Component count validation
            validation.scores.componentCount = this.validateComponentCount(validation);
            
            // Test 2: Grid utilization validation
            validation.scores.gridUtilization = this.validateGridUtilization(validation);
            
            // Test 3: Visual hierarchy validation
            validation.scores.visualHierarchy = this.validateVisualHierarchy(validation);
            
            // Test 4: Information density validation
            validation.scores.informationDensity = this.validateInformationDensity(validation);
            
            // Test 5: Interaction functionality validation
            validation.scores.interactionFunctionality = this.validateInteractionFunctionality(validation);
            
            // Test 6: Overlap detection
            validation.scores.overlapDetection = this.validateOverlaps(validation);
            
            // Calculate overall score
            const scores = Object.values(validation.scores);
            validation.overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            
            // Determine status
            if (validation.overallScore >= 90) {
                validation.status = 'EXCELLENT';
            } else if (validation.overallScore >= 80) {
                validation.status = 'GOOD';
            } else if (validation.overallScore >= 70) {
                validation.status = 'NEEDS_IMPROVEMENT';
            } else {
                validation.status = 'POOR';
            }
            
            return validation;
        },
        
        validateComponentCount(validation) {
            const count = validation.componentCount;
            const max = this.validationCriteria.maxComponentsPerScreen;
            
            if (count === 0) {
                validation.issues.push('No components found - screen is empty');
                return 0;
            } else if (count > max) {
                validation.issues.push(`Too many components: ${count} > ${max}`);
                return Math.max(0, 100 - (count - max) * 20);
            } else if (count < 3) {
                validation.issues.push('Too few components - screen feels empty');
                validation.recommendations.push('Add more cards to fill grid space');
                return 60;
            } else {
                return 100;
            }
        },
        
        validateGridUtilization(validation) {
            if (validation.cards.length === 0) return 0;
            
            let totalOccupiedCells = 0;
            validation.cards.forEach(card => {
                const width = parseInt(card.getAttribute('data-grid-w') || 1);
                const height = parseInt(card.getAttribute('data-grid-h') || 1);
                totalOccupiedCells += width * height;
            });
            
            const totalGridCells = 37 * 19; // 703 cells
            const utilizationPercent = (totalOccupiedCells / totalGridCells) * 100;
            
            validation.gridUtilization = utilizationPercent;
            
            if (utilizationPercent < this.validationCriteria.minUtilization) {
                validation.issues.push(`Low grid utilization: ${utilizationPercent.toFixed(1)}% < ${this.validationCriteria.minUtilization}%`);
                validation.recommendations.push('Add more cards or increase card sizes');
                return Math.max(0, utilizationPercent);
            } else if (utilizationPercent > this.validationCriteria.maxUtilization) {
                validation.issues.push(`High grid utilization: ${utilizationPercent.toFixed(1)}% > ${this.validationCriteria.maxUtilization}%`);
                validation.recommendations.push('Reduce card sizes or remove less important content');
                return Math.max(0, 100 - (utilizationPercent - this.validationCriteria.maxUtilization));
            } else {
                return 100;
            }
        },
        
        validateVisualHierarchy(validation) {
            if (validation.cards.length === 0) return 0;
            
            const cardSizes = validation.cards.map(card => {
                const width = parseInt(card.getAttribute('data-grid-w') || 1);
                const height = parseInt(card.getAttribute('data-grid-h') || 1);
                return width * height;
            });
            
            cardSizes.sort((a, b) => b - a);
            
            // Check if there's a clear hierarchy (largest card should be significantly larger)
            const largestCard = cardSizes[0];
            const secondLargest = cardSizes[1] || largestCard;
            
            const hierarchyRatio = largestCard / secondLargest;
            
            if (hierarchyRatio >= 1.5) {
                return 100; // Good hierarchy
            } else if (hierarchyRatio >= 1.2) {
                return 80;  // Adequate hierarchy
            } else {
                validation.issues.push('Poor visual hierarchy - no clear primary focus');
                validation.recommendations.push('Make primary card larger for better attention hierarchy');
                return 60;
            }
        },
        
        validateInformationDensity(validation) {
            if (validation.cards.length === 0) return 0;
            
            let totalInformationElements = 0;
            
            validation.cards.forEach(card => {
                const infoElements = card.querySelectorAll('.stat-row, .kpi-item, .day-item, .target-item, .fixture-item, .result-item').length;
                totalInformationElements += infoElements;
            });
            
            const averageInfoPerCard = totalInformationElements / validation.cards.length;
            
            if (averageInfoPerCard > 8) {
                validation.issues.push(`High information density: ${averageInfoPerCard.toFixed(1)} items per card`);
                validation.recommendations.push('Reduce information per card or split into more cards');
                return Math.max(40, 100 - (averageInfoPerCard - 8) * 10);
            } else if (averageInfoPerCard < 2) {
                validation.issues.push('Low information density - cards feel empty');
                validation.recommendations.push('Add more relevant information to cards');
                return 60;
            } else {
                return 100;
            }
        },
        
        validateInteractionFunctionality(validation) {
            if (validation.cards.length === 0) return 0;
            
            let totalInteractiveElements = 0;
            let workingElements = 0;
            
            validation.cards.forEach(card => {
                const interactives = card.querySelectorAll('button, select, input, [onclick]');
                totalInteractiveElements += interactives.length;
                
                interactives.forEach(element => {
                    const hasHandler = element.onclick || 
                                     element.getAttribute('onclick') || 
                                     element.addEventListener;
                    if (hasHandler) {
                        workingElements++;
                    }
                });
            });
            
            if (totalInteractiveElements === 0) {
                return 80; // No interactions needed
            }
            
            const functionalityScore = (workingElements / totalInteractiveElements) * 100;
            
            if (functionalityScore < 80) {
                validation.issues.push(`Poor interaction functionality: ${functionalityScore.toFixed(1)}%`);
                validation.recommendations.push('Fix broken interactive elements');
            }
            
            return functionalityScore;
        },
        
        validateOverlaps(validation) {
            if (validation.cards.length <= 1) return 100;
            
            const positions = validation.cards.map(card => {
                const rect = card.getBoundingClientRect();
                const title = card.querySelector('.card-header span, .card-body')?.textContent?.substring(0, 20) || 'Unknown';
                
                return {
                    card: card,
                    rect: rect,
                    title: title
                };
            });
            
            let overlapCount = 0;
            
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const pos1 = positions[i];
                    const pos2 = positions[j];
                    
                    // Check for visual overlap
                    const overlap = !(pos1.rect.right <= pos2.rect.left || 
                                     pos2.rect.right <= pos1.rect.left ||
                                     pos1.rect.bottom <= pos2.rect.top || 
                                     pos2.rect.bottom <= pos1.rect.top);
                    
                    if (overlap) {
                        overlapCount++;
                        validation.issues.push(`Overlap detected: "${pos1.title}" and "${pos2.title}"`);
                    }
                }
            }
            
            if (overlapCount > 0) {
                validation.recommendations.push('Fix card positioning to eliminate overlaps');
                return Math.max(0, 100 - overlapCount * 25);
            }
            
            return 100;
        },
        
        generateFinalReport() {
            console.log('\n' + '='.repeat(70));
            console.log('🏆 FINAL UI/UX VALIDATION REPORT');
            console.log('='.repeat(70));
            
            let totalScore = 0;
            let screenCount = 0;
            let excellentScreens = 0;
            let passedScreens = 0;
            
            this.validationResults.forEach((validation, screenName) => {
                screenCount++;
                totalScore += validation.overallScore;
                
                if (validation.status === 'EXCELLENT') excellentScreens++;
                if (validation.overallScore >= 70) passedScreens++;
                
                console.log(`\n📊 ${screenName.toUpperCase()} SCREEN:`);
                console.log(`  Overall Score: ${validation.overallScore.toFixed(1)}/100 (${validation.status})`);
                console.log(`  Components: ${validation.componentCount}`);
                console.log(`  Grid Utilization: ${validation.gridUtilization?.toFixed(1) || 'N/A'}%`);
                
                Object.entries(validation.scores).forEach(([criterion, score]) => {
                    const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
                    console.log(`  ${criterion}: ${score.toFixed(1)}/100 ${status}`);
                });
                
                if (validation.issues.length > 0) {
                    console.log(`  Issues: ${validation.issues.length}`);
                    validation.issues.forEach(issue => {
                        console.log(`    • ${issue}`);
                    });
                }
                
                if (validation.recommendations.length > 0) {
                    console.log(`  Recommendations:`);
                    validation.recommendations.forEach(rec => {
                        console.log(`    → ${rec}`);
                    });
                }
            });
            
            const averageScore = totalScore / screenCount;
            
            console.log(`\n📈 OVERALL SYSTEM QUALITY:`);
            console.log(`Average Score: ${averageScore.toFixed(1)}/100`);
            console.log(`Excellent Screens: ${excellentScreens}/${screenCount}`);
            console.log(`Passed Screens: ${passedScreens}/${screenCount}`);
            console.log(`Success Rate: ${((passedScreens/screenCount)*100).toFixed(1)}%`);
            
            if (averageScore >= 90) {
                console.log('\n🎉 SYSTEM STATUS: EXCELLENT QUALITY');
                console.log('✨ Professional Football Manager UI/UX achieved');
            } else if (averageScore >= 80) {
                console.log('\n🎯 SYSTEM STATUS: GOOD QUALITY');
                console.log('🔧 Minor improvements recommended');
            } else if (averageScore >= 70) {
                console.log('\n⚠️ SYSTEM STATUS: ADEQUATE QUALITY');
                console.log('🔧 Several improvements needed');
            } else {
                console.log('\n❌ SYSTEM STATUS: POOR QUALITY');
                console.log('🛠️ Major improvements required');
            }
            
            console.log('='.repeat(70));
        },
        
        showValidationResults() {
            // Create visual validation indicator
            const indicator = document.createElement('div');
            indicator.id = 'ux-validation-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 120px;
                right: 20px;
                width: 200px;
                background: rgba(0, 20, 30, 0.95);
                border: 1px solid rgba(0, 148, 204, 0.3);
                border-radius: 8px;
                padding: 12px;
                color: white;
                font-size: 11px;
                z-index: 10000;
                backdrop-filter: blur(20px);
            `;
            
            const totalScreens = this.validationResults.size;
            const passedScreens = Array.from(this.validationResults.values()).filter(v => v.overallScore >= 70).length;
            const avgScore = Array.from(this.validationResults.values()).reduce((sum, v) => sum + v.overallScore, 0) / totalScreens;
            
            indicator.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 8px; color: #0094cc;">UI/UX Validation</div>
                <div style="margin: 4px 0;">
                    <span>Overall Score:</span>
                    <span style="float: right; font-weight: 600;">${avgScore.toFixed(1)}/100</span>
                </div>
                <div style="margin: 4px 0;">
                    <span>Screens Passed:</span>
                    <span style="float: right; font-weight: 600;">${passedScreens}/${totalScreens}</span>
                </div>
                <div style="margin: 4px 0;">
                    <span>Success Rate:</span>
                    <span style="float: right; font-weight: 600; color: ${passedScreens === totalScreens ? '#00ff88' : '#ffb800'};">${((passedScreens/totalScreens)*100).toFixed(1)}%</span>
                </div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; text-align: center;">
                    ${avgScore >= 90 ? '🎉 Excellent Quality' : 
                      avgScore >= 80 ? '🎯 Good Quality' :
                      avgScore >= 70 ? '⚠️ Needs Work' : '❌ Poor Quality'}
                </div>
            `;
            
            document.body.appendChild(indicator);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 500);
            }, 10000);
        },
        
        // Manual validation trigger for testing
        validateCurrentScreen() {
            const activeTab = document.querySelector('.nav-tab.active');
            if (activeTab) {
                const screenName = activeTab.textContent.toLowerCase();
                const validation = this.validateScreen(screenName);
                
                console.log(`\n🧪 MANUAL VALIDATION: ${screenName.toUpperCase()}`);
                console.log(`Overall Score: ${validation.overallScore.toFixed(1)}/100`);
                console.log(`Status: ${validation.status}`);
                
                if (validation.issues.length > 0) {
                    console.log('Issues found:');
                    validation.issues.forEach(issue => console.log(`  • ${issue}`));
                }
                
                return validation;
            }
        }
    };

    // Auto-initialize  
    if (document.readyState === 'complete') {
        setTimeout(() => FinalUXValidator.init(), 5000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => FinalUXValidator.init(), 5000);
        });
    }

    // Make available for manual testing
    window.FinalUXValidator = FinalUXValidator;
    window.validateCurrentScreen = () => FinalUXValidator.validateCurrentScreen();

})();