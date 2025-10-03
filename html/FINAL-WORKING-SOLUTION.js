/**
 * FINAL WORKING SOLUTION
 * The definitive fix for double headers based on execution flow analysis
 */

(function() {
    'use strict';

    console.log('🎯 FINAL SOLUTION: Starting definitive header fix...');

    // Execution plan based on simulated browser testing
    const executionPlan = {
        phase1: 'Wait for DOM and scripts to be ready',
        phase2: 'Analyze current header situation', 
        phase3: 'Apply targeted fixes based on findings',
        phase4: 'Validate and report results'
    };

    let solutionState = {
        startTime: performance.now(),
        phase: 1,
        issues: [],
        fixes: [],
        success: false
    };

    function executePhase1() {
        console.log('📋 PHASE 1: Waiting for complete readiness...');
        
        // Wait for everything to be absolutely ready
        const checkReadiness = () => {
            const isReady = document.readyState === 'complete' && 
                           document.body && 
                           document.head &&
                           document.querySelectorAll('script').length > 10; // Ensure scripts loaded
            
            if (isReady) {
                solutionState.phase = 2;
                setTimeout(executePhase2, 1000); // 1 second buffer
            } else {
                setTimeout(checkReadiness, 100);
            }
        };
        
        checkReadiness();
    }

    function executePhase2() {
        console.log('🔍 PHASE 2: Analyzing current header situation...');
        
        try {
            // Count all headers
            const mainHeaders = document.querySelectorAll('.header');
            const cardHeaders = document.querySelectorAll('.card-header');
            const navContainers = document.querySelectorAll('.nav-container');
            const unifiedHeaders = document.querySelectorAll('.unified-header');
            
            console.log('📊 Current header inventory:');
            console.log(`  Main headers: ${mainHeaders.length}`);
            console.log(`  Card headers: ${cardHeaders.length}`);
            console.log(`  Nav containers: ${navContainers.length}`);
            console.log(`  Unified headers: ${unifiedHeaders.length}`);
            
            // Identify specific issues
            if (mainHeaders.length > 0) {
                solutionState.issues.push('Main header exists and needs hiding');
            }
            
            if (navContainers.length > 0) {
                solutionState.issues.push('Nav container exists and needs hiding');
            }
            
            if (cardHeaders.length > 0) {
                solutionState.issues.push(`${cardHeaders.length} card headers need hiding`);
            }
            
            if (unifiedHeaders.length === 0) {
                solutionState.issues.push('Unified header needs creation');
            } else if (unifiedHeaders.length > 1) {
                solutionState.issues.push('Multiple unified headers need cleanup');
            }
            
            solutionState.phase = 3;
            executePhase3();
            
        } catch (error) {
            console.error('💥 PHASE 2 ERROR:', error);
            fallbackToBasicFix();
        }
    }

    function executePhase3() {
        console.log('🔧 PHASE 3: Applying targeted fixes...');
        
        try {
            // Fix each identified issue
            solutionState.issues.forEach(issue => {
                applyTargetedFix(issue);
            });
            
            // Ensure working navigation
            ensureWorkingNavigation();
            
            // Add visual enhancements
            addVisualEnhancements();
            
            solutionState.phase = 4;
            setTimeout(executePhase4, 500);
            
        } catch (error) {
            console.error('💥 PHASE 3 ERROR:', error);
            fallbackToBasicFix();
        }
    }

    function applyTargetedFix(issue) {
        console.log(`🔧 Fixing: ${issue}`);
        
        if (issue.includes('Main header exists')) {
            const mainHeader = document.querySelector('.header');
            if (mainHeader) {
                mainHeader.style.display = 'none';
                solutionState.fixes.push('Hidden main header');
            }
        }
        
        if (issue.includes('Nav container exists')) {
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.style.display = 'none';
                solutionState.fixes.push('Hidden nav container');
            }
        }
        
        if (issue.includes('card headers need hiding')) {
            const cardHeaders = document.querySelectorAll('.card-header');
            cardHeaders.forEach(header => {
                header.style.display = 'none';
            });
            solutionState.fixes.push(`Hidden ${cardHeaders.length} card headers`);
        }
        
        if (issue.includes('Unified header needs creation')) {
            createSimpleUnifiedHeader();
            solutionState.fixes.push('Created unified header');
        }
        
        if (issue.includes('Multiple unified headers')) {
            const unifiedHeaders = document.querySelectorAll('.unified-header');
            for (let i = 1; i < unifiedHeaders.length; i++) {
                unifiedHeaders[i].remove();
            }
            solutionState.fixes.push('Removed duplicate unified headers');
        }
    }

    function createSimpleUnifiedHeader() {
        console.log('🎨 Creating simple, working unified header...');
        
        const header = document.createElement('div');
        header.className = 'unified-header-simple';
        header.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 24px; background: linear-gradient(135deg, rgba(0, 10, 15, 0.95), rgba(0, 20, 30, 0.98)); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0, 148, 204, 0.2);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #0094cc, #005a7a); border-radius: 50%; border: 2px solid rgba(0, 148, 204, 0.3);"></div>
                    <span style="font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">Manchester United</span>
                </div>
                
                <nav style="display: flex; gap: 2px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 4px;">
                    <button class="simple-nav-btn" data-page="overview" style="padding: 8px 16px; background: rgba(0, 148, 204, 0.3); border: none; color: white; font-size: 13px; border-radius: 6px; cursor: pointer;">Overview</button>
                    <button class="simple-nav-btn" data-page="squad" style="padding: 8px 16px; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font-size: 13px; border-radius: 6px; cursor: pointer;">Squad</button>
                    <button class="simple-nav-btn" data-page="tactics" style="padding: 8px 16px; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font-size: 13px; border-radius: 6px; cursor: pointer;">Tactics</button>
                    <button class="simple-nav-btn" data-page="training" style="padding: 8px 16px; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font-size: 13px; border-radius: 6px; cursor: pointer;">Training</button>
                    <button class="simple-nav-btn" data-page="transfers" style="padding: 8px 16px; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font-size: 13px; border-radius: 6px; cursor: pointer;">Transfers</button>
                    <button class="simple-nav-btn" data-page="finances" style="padding: 8px 16px; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font-size: 13px; border-radius: 6px; cursor: pointer;">Finances</button>
                    <button class="simple-nav-btn" data-page="fixtures" style="padding: 8px 16px; background: transparent; border: none; color: rgba(255, 255, 255, 0.7); font-size: 13px; border-radius: 6px; cursor: pointer;">Fixtures</button>
                </nav>
                
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="display: flex; flex-direction: column; align-items: flex-end; font-size: 12px; color: rgba(255, 255, 255, 0.8);">
                        <span>15 Aug 2024</span>
                        <span>14:30</span>
                    </div>
                    <button onclick="if(window.advanceTime) window.advanceTime()" style="padding: 8px 20px; background: linear-gradient(135deg, #00ff88, #00cc6a); color: #000; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Continue</button>
                </div>
            </div>
        `;
        
        header.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10000;
            height: 56px;
        `;
        
        document.body.insertBefore(header, document.body.firstChild);
        
        // Add navigation functionality
        const navButtons = header.querySelectorAll('.simple-nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active state
                navButtons.forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = 'rgba(255, 255, 255, 0.7)';
                });
                
                this.style.background = 'rgba(0, 148, 204, 0.3)';
                this.style.color = 'white';
                
                // Navigate
                const pageName = this.dataset.page;
                console.log(`🧭 Simple nav to: ${pageName}`);
                
                if (window.directFixSwitchToPage) {
                    window.directFixSwitchToPage(pageName);
                }
            });
            
            // Add hover effects
            btn.addEventListener('mouseenter', function() {
                if (this.style.background === 'transparent') {
                    this.style.background = 'rgba(255, 255, 255, 0.05)';
                }
            });
            
            btn.addEventListener('mouseleave', function() {
                if (!this.dataset.page || this.style.background !== 'rgba(0, 148, 204, 0.3)') {
                    this.style.background = 'transparent';
                }
            });
        });
        
        // Adjust body margin for header
        document.body.style.marginTop = '56px';
    }

    function ensureWorkingNavigation() {
        console.log('🧭 Ensuring navigation functionality...');
        
        // Make sure directFixSwitchToPage is available
        if (!window.directFixSwitchToPage) {
            console.log('🔧 Creating fallback navigation function...');
            
            window.directFixSwitchToPage = function(pageName) {
                console.log(`📄 FALLBACK NAV: Switching to ${pageName}`);
                
                // Hide all pages
                document.querySelectorAll('.content-page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Show target page
                const targetPage = document.getElementById(pageName + '-page');
                if (targetPage) {
                    targetPage.classList.add('active');
                    console.log(`✅ FALLBACK NAV: Activated ${pageName} page`);
                } else {
                    console.error(`❌ FALLBACK NAV: Page not found: ${pageName}-page`);
                }
            };
        }
    }

    function addVisualEnhancements() {
        console.log('✨ Adding visual enhancements...');
        
        // Simple card hover effects
        const style = document.createElement('style');
        style.textContent = `
            .card {
                transition: all 0.2s ease !important;
                border-radius: 8px !important;
                overflow: hidden !important;
            }
            
            .card:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
            }
            
            /* Make sure card content has proper spacing */
            .card-body, .card-content {
                padding-top: 16px !important;
            }
            
            /* Improve button responsiveness */
            .card button, .card select {
                pointer-events: auto !important;
                z-index: 10 !important;
            }
            
            /* Enhanced resize handles */
            .resize-handle, .resize-handle-bl {
                opacity: 0.5 !important;
                transition: opacity 0.2s ease !important;
            }
            
            .card:hover .resize-handle,
            .card:hover .resize-handle-bl {
                opacity: 1 !important;
            }
        `;
        
        document.head.appendChild(style);
        solutionState.fixes.push('Added visual enhancements');
    }

    function executePhase4() {
        console.log('📊 PHASE 4: Validation and reporting...');
        
        try {
            // Count final header state
            const visibleMainHeaders = Array.from(document.querySelectorAll('.header')).filter(h => {
                return window.getComputedStyle(h).display !== 'none';
            }).length;
            
            const visibleCardHeaders = Array.from(document.querySelectorAll('.card-header')).filter(h => {
                return window.getComputedStyle(h).display !== 'none';
            }).length;
            
            const visibleNavContainers = Array.from(document.querySelectorAll('.nav-container')).filter(n => {
                return window.getComputedStyle(n).display !== 'none';
            }).length;
            
            const unifiedHeaders = document.querySelectorAll('.unified-header-simple, .unified-header');
            
            console.log('\n📊 FINAL HEADER COUNT:');
            console.log(`  Visible main headers: ${visibleMainHeaders}`);
            console.log(`  Visible card headers: ${visibleCardHeaders}`);
            console.log(`  Visible nav containers: ${visibleNavContainers}`);
            console.log(`  Unified headers: ${unifiedHeaders.length}`);
            
            // Calculate success
            const totalOldHeaders = visibleMainHeaders + visibleCardHeaders + visibleNavContainers;
            const hasUnifiedHeader = unifiedHeaders.length === 1;
            
            solutionState.success = totalOldHeaders === 0 && hasUnifiedHeader;
            
            // Report final results
            generateFinalReport(totalOldHeaders, hasUnifiedHeader);
            
        } catch (error) {
            console.error('💥 PHASE 4 ERROR:', error);
            solutionState.success = false;
        }
    }

    function generateFinalReport(totalOldHeaders, hasUnifiedHeader) {
        const duration = performance.now() - solutionState.startTime;
        
        console.log('\n' + '='.repeat(70));
        console.log('🏆 FINAL WORKING SOLUTION - EXECUTION REPORT');
        console.log('='.repeat(70));
        console.log(`⏰ Total execution time: ${duration.toFixed(2)}ms`);
        console.log(`🔧 Issues identified: ${solutionState.issues.length}`);
        console.log(`✅ Fixes applied: ${solutionState.fixes.length}`);
        
        console.log('\n📋 Issues Identified:');
        solutionState.issues.forEach(issue => {
            console.log(`  • ${issue}`);
        });
        
        console.log('\n🔧 Fixes Applied:');
        solutionState.fixes.forEach(fix => {
            console.log(`  • ${fix}`);
        });
        
        console.log('\n🎯 FINAL RESULT:');
        
        if (solutionState.success) {
            console.log('🎉 SUCCESS: ✅ DOUBLE HEADERS ELIMINATED');
            console.log('✨ Beautiful single header interface achieved');
            console.log('🎮 Navigation functional, cards clean');
            
            // Show success indicator
            showSuccessIndicator(true);
            
        } else {
            console.log('⚠️ PARTIAL SUCCESS: Issues remain');
            console.log(`Old headers still visible: ${totalOldHeaders}`);
            console.log(`Unified header created: ${hasUnifiedHeader}`);
            
            // Show partial success indicator
            showSuccessIndicator(false);
        }
        
        console.log('='.repeat(70));
        
        // Make report globally available
        window.finalSolutionReport = {
            success: solutionState.success,
            duration: duration,
            issues: solutionState.issues,
            fixes: solutionState.fixes,
            oldHeadersVisible: totalOldHeaders,
            unifiedHeaderExists: hasUnifiedHeader
        };
    }

    function showSuccessIndicator(success) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            padding: 12px 18px;
            background: ${success ? 'linear-gradient(135deg, #00ff88, #00cc6a)' : 'linear-gradient(135deg, #ffa502, #ff6348)'};
            color: ${success ? '#000' : '#fff'};
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            z-index: 20000;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            animation: slideInFromRight 0.5s ease;
        `;
        
        indicator.innerHTML = success ? 
            '🎉 DOUBLE HEADERS ELIMINATED!' : 
            '⚠️ PARTIAL SUCCESS - CHECK CONSOLE';
        
        // Add animation
        if (!document.getElementById('indicator-animation')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'indicator-animation';
            animStyle.textContent = `
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(animStyle);
        }
        
        document.body.appendChild(indicator);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 500);
        }, 8000);
    }

    function fallbackToBasicFix() {
        console.log('🔧 FALLBACK: Applying basic header hiding...');
        
        try {
            // Just hide everything we can find
            const elements = document.querySelectorAll('.header, .nav-container, .card-header');
            elements.forEach(el => {
                el.style.display = 'none';
            });
            
            console.log(`✅ FALLBACK: Hidden ${elements.length} header elements`);
            solutionState.fixes.push(`Fallback: hidden ${elements.length} elements`);
            
        } catch (error) {
            console.error('💥 FALLBACK FAILED:', error);
        }
    }

    // Start execution
    executePhase1();
    
    // Global access for manual testing
    window.FinalWorkingSolution = {
        state: solutionState,
        retry: executePhase1,
        forceHideHeaders: fallbackToBasicFix
    };

})();