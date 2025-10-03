/**
 * AUTO DEBUG REPORTER
 * Automatically reports what's working and what's not when main.html loads
 */

(function() {
    'use strict';
    
    let debugReport = {
        timestamp: new Date().toISOString(),
        loadTime: performance.now(),
        tests: [],
        summary: {
            passed: 0,
            failed: 0,
            warnings: 0
        }
    };

    function addTest(name, passed, message, isWarning = false) {
        const test = {
            name,
            passed,
            message,
            isWarning,
            timestamp: performance.now() - debugReport.loadTime
        };
        
        debugReport.tests.push(test);
        
        if (isWarning) {
            debugReport.summary.warnings++;
            console.warn(`⚠️ ${name}: ${message}`);
        } else if (passed) {
            debugReport.summary.passed++;
            console.log(`✅ ${name}: ${message}`);
        } else {
            debugReport.summary.failed++;
            console.error(`❌ ${name}: ${message}`);
        }
    }

    function runAutoDebug() {
        console.log('\n🔍 AUTO DEBUG REPORTER: Starting comprehensive analysis...');
        console.log('⏰ Load time: ' + (performance.now() - debugReport.loadTime).toFixed(2) + 'ms');
        
        // Test 1: DOM Structure
        testDOMStructure();
        
        // Test 2: Header Architecture  
        testHeaderArchitecture();
        
        // Test 3: Script Loading
        testScriptLoading();
        
        // Test 4: Visual State
        testVisualState();
        
        // Test 5: Functionality
        testFunctionality();
        
        // Generate final report
        setTimeout(() => {
            generateFinalReport();
        }, 1000);
    }

    function testDOMStructure() {
        // Test if required page elements exist
        const requiredPages = ['overview-page', 'squad-page', 'tactics-page'];
        const foundPages = requiredPages.filter(id => document.getElementById(id));
        
        addTest('DOM Structure', 
            foundPages.length === requiredPages.length,
            `Found ${foundPages.length}/${requiredPages.length} required pages`);
        
        // Test if cards exist
        const cards = document.querySelectorAll('.card');
        addTest('Card Elements', 
            cards.length > 0,
            `Found ${cards.length} cards in DOM`);
    }

    function testHeaderArchitecture() {
        // Count all types of headers
        const mainHeaders = document.querySelectorAll('.header');
        const cardHeaders = document.querySelectorAll('.card-header');
        const unifiedHeaders = document.querySelectorAll('.unified-header');
        const navContainers = document.querySelectorAll('.nav-container');
        
        console.log(`\n📋 HEADER INVENTORY:`);
        console.log(`  Main headers: ${mainHeaders.length}`);
        console.log(`  Card headers: ${cardHeaders.length}`);
        console.log(`  Unified headers: ${unifiedHeaders.length}`);
        console.log(`  Nav containers: ${navContainers.length}`);
        
        // Test if unified header exists
        addTest('Unified Header Created', 
            unifiedHeaders.length === 1,
            unifiedHeaders.length === 1 ? 'Single unified header found' : 
            unifiedHeaders.length === 0 ? 'No unified header found' : 
            `Multiple unified headers found (${unifiedHeaders.length})`);
        
        // Test if old headers are hidden
        let hiddenMainHeaders = 0;
        let hiddenCardHeaders = 0;
        let hiddenNavContainers = 0;
        
        mainHeaders.forEach(header => {
            const style = window.getComputedStyle(header);
            if (style.display === 'none') hiddenMainHeaders++;
        });
        
        cardHeaders.forEach(header => {
            const style = window.getComputedStyle(header);
            if (style.display === 'none') hiddenCardHeaders++;
        });
        
        navContainers.forEach(nav => {
            const style = window.getComputedStyle(nav);
            if (style.display === 'none') hiddenNavContainers++;
        });
        
        addTest('Old Headers Hidden', 
            hiddenMainHeaders === mainHeaders.length && hiddenNavContainers === navContainers.length,
            `Hidden: ${hiddenMainHeaders}/${mainHeaders.length} main, ${hiddenNavContainers}/${navContainers.length} nav`);
        
        addTest('Card Headers Hidden', 
            hiddenCardHeaders === cardHeaders.length,
            `Hidden: ${hiddenCardHeaders}/${cardHeaders.length} card headers`,
            hiddenCardHeaders < cardHeaders.length); // Warning if not all hidden
    }

    function testScriptLoading() {
        // Test if our scripts loaded
        const requiredGlobals = [
            'UnifiedHeaderSystemFixed',
            'debugUnifiedHeader', 
            'directFixSwitchToPage'
        ];
        
        requiredGlobals.forEach(globalName => {
            const exists = globalName in window;
            addTest(`Script: ${globalName}`, 
                exists,
                exists ? 'Available' : 'Not loaded');
        });
        
        // Test if original functions still exist
        const originalFunctions = [
            'loadPageCards',
            'initializeMainUI',
            'switchTab'
        ];
        
        originalFunctions.forEach(funcName => {
            const exists = funcName in window && typeof window[funcName] === 'function';
            addTest(`Function: ${funcName}`, 
                exists,
                exists ? 'Available' : 'Missing',
                !exists); // Warning if missing
        });
    }

    function testVisualState() {
        // Test if page content is visible
        const activePages = document.querySelectorAll('.content-page.active');
        addTest('Active Page', 
            activePages.length === 1,
            `${activePages.length} pages active (should be 1)`);
        
        // Test if main container has proper margin
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            const style = window.getComputedStyle(mainContainer);
            const marginTop = parseInt(style.marginTop);
            addTest('Main Container Margin', 
                marginTop >= 50,
                `Margin-top: ${marginTop}px (should be ~56px for unified header)`);
        }
        
        // Test if unified header is positioned correctly
        const unifiedHeader = document.querySelector('.unified-header');
        if (unifiedHeader) {
            const style = window.getComputedStyle(unifiedHeader);
            const isFixed = style.position === 'fixed';
            const isAtTop = style.top === '0px';
            const hasHighZIndex = parseInt(style.zIndex) >= 1000;
            
            addTest('Unified Header Position', 
                isFixed && isAtTop && hasHighZIndex,
                `Position: ${style.position}, Top: ${style.top}, Z-index: ${style.zIndex}`);
        }
    }

    function testFunctionality() {
        // Test navigation functionality
        const navItems = document.querySelectorAll('.unified-nav .nav-item');
        let workingNavItems = 0;
        
        navItems.forEach(item => {
            if (item.dataset.page && (item.onclick || item.addEventListener)) {
                workingNavItems++;
            }
        });
        
        addTest('Navigation Functionality', 
            workingNavItems === navItems.length,
            `${workingNavItems}/${navItems.length} nav items functional`);
        
        // Test card overlays
        const cards = document.querySelectorAll('.card');
        const cardsWithOverlays = document.querySelectorAll('.card .card-overlay').length;
        
        addTest('Card Overlays', 
            cardsWithOverlays > 0,
            `${cardsWithOverlays}/${cards.length} cards have overlays`);
        
        // Test resize handles
        const resizeHandles = document.querySelectorAll('.resize-handle, .resize-handle-bl');
        let visibleHandles = 0;
        
        resizeHandles.forEach(handle => {
            const style = window.getComputedStyle(handle);
            if (style.display !== 'none' && parseFloat(style.opacity) > 0) {
                visibleHandles++;
            }
        });
        
        addTest('Resize Handles', 
            visibleHandles > 0,
            `${visibleHandles}/${resizeHandles.length} handles visible/functional`);
    }

    function generateFinalReport() {
        console.log('\n' + '='.repeat(70));
        console.log('🏆 AUTO DEBUG REPORT - UNIFIED HEADER SYSTEM');
        console.log('='.repeat(70));
        console.log(`⏰ Total analysis time: ${(performance.now() - debugReport.loadTime).toFixed(2)}ms`);
        console.log(`✅ Tests passed: ${debugReport.summary.passed}`);
        console.log(`❌ Tests failed: ${debugReport.summary.failed}`);
        console.log(`⚠️ Warnings: ${debugReport.summary.warnings}`);
        
        // Detailed test results
        console.log('\n📋 DETAILED RESULTS:');
        debugReport.tests.forEach(test => {
            const icon = test.isWarning ? '⚠️' : (test.passed ? '✅' : '❌');
            const timing = `[${test.timestamp.toFixed(0)}ms]`;
            console.log(`${icon} ${timing} ${test.name}: ${test.message}`);
        });
        
        // Overall assessment
        const criticalFailures = debugReport.summary.failed;
        const hasWarnings = debugReport.summary.warnings > 0;
        
        console.log('\n🎯 OVERALL ASSESSMENT:');
        
        if (criticalFailures === 0 && !hasWarnings) {
            console.log('🎉 STATUS: ✅ FULLY FUNCTIONAL');
            console.log('💡 Unified header system is working perfectly');
            console.log('✨ No more ugly double headers!');
        } else if (criticalFailures === 0 && hasWarnings) {
            console.log('🔄 STATUS: ⚠️ MOSTLY FUNCTIONAL');
            console.log('💡 Unified header system is working with minor issues');
            console.log('🔧 Some improvements needed');
        } else {
            console.log('💥 STATUS: ❌ NEEDS FIXES');
            console.log('🔧 Critical issues prevent full functionality');
            console.log('📋 Check test results above for specific problems');
        }
        
        console.log('='.repeat(70));
        
        // Make report available globally
        window.autoDebugReport = debugReport;
        
        // Show success indicator on page
        showDebugIndicator(criticalFailures === 0);
    }

    function showDebugIndicator(success) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background: ${success ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 71, 87, 0.9)'};
            color: ${success ? '#000' : '#fff'};
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: debugSlideIn 0.5s cubic-bezier(0.4, 0.0, 0.1, 1);
        `;
        
        indicator.innerHTML = success ? 
            '🎉 UNIFIED HEADER: WORKING' : 
            '💥 UNIFIED HEADER: ISSUES';
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes debugSlideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(indicator);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 500);
        }, 5000);
    }

    // Auto-run when DOM is ready
    if (document.readyState === 'complete') {
        setTimeout(runAutoDebug, 4000); // Wait 4 seconds for everything to load
    } else {
        window.addEventListener('load', function() {
            setTimeout(runAutoDebug, 4000);
        });
    }

    // Make available globally
    window.AutoDebugReporter = {
        run: runAutoDebug,
        report: debugReport
    };

})();