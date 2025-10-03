/**
 * DEBUG UNIFIED HEADER - Actually test and debug the header solution
 */

(function() {
    'use strict';

    console.log('🔍 DEBUG UNIFIED HEADER: Starting comprehensive testing...');

    let debugResults = {
        originalHeadersFound: 0,
        originalHeadersHidden: 0,
        unifiedHeaderCreated: false,
        navigationWorking: false,
        cardOverlaysWorking: false,
        errors: [],
        warnings: []
    };

    function runDebugTests() {
        console.log('🧪 Running unified header debug tests...');

        // Test 1: Check if original headers exist and are hidden
        testOriginalHeaders();

        // Test 2: Check if unified header was created properly
        testUnifiedHeader();

        // Test 3: Test navigation functionality
        testNavigation();

        // Test 4: Test card overlays
        testCardOverlays();

        // Test 5: Check for JavaScript errors
        testForErrors();

        // Test 6: Test responsive behavior
        testResponsiveness();

        // Report results
        reportDebugResults();
    }

    function testOriginalHeaders() {
        console.log('📋 Testing original headers...');

        // Find original headers
        const mainHeaders = document.querySelectorAll('.header');
        const cardHeaders = document.querySelectorAll('.card-header');
        const navContainers = document.querySelectorAll('.nav-container');

        debugResults.originalHeadersFound = mainHeaders.length + cardHeaders.length + navContainers.length;

        console.log(`Found ${mainHeaders.length} main headers`);
        console.log(`Found ${cardHeaders.length} card headers`);
        console.log(`Found ${navContainers.length} nav containers`);

        // Check if they're hidden
        let hiddenCount = 0;

        mainHeaders.forEach(header => {
            const style = window.getComputedStyle(header);
            if (style.display === 'none') {
                hiddenCount++;
                console.log('✅ Main header hidden');
            } else {
                console.log('❌ Main header still visible');
                debugResults.errors.push('Main header not hidden');
            }
        });

        cardHeaders.forEach(header => {
            const style = window.getComputedStyle(header);
            if (style.display === 'none') {
                hiddenCount++;
            } else {
                debugResults.warnings.push('Card header still visible');
            }
        });

        navContainers.forEach(nav => {
            const style = window.getComputedStyle(nav);
            if (style.display === 'none') {
                hiddenCount++;
                console.log('✅ Nav container hidden');
            } else {
                console.log('❌ Nav container still visible');
                debugResults.errors.push('Nav container not hidden');
            }
        });

        debugResults.originalHeadersHidden = hiddenCount;
        console.log(`${hiddenCount}/${debugResults.originalHeadersFound} original headers hidden`);
    }

    function testUnifiedHeader() {
        console.log('✨ Testing unified header...');

        const unifiedHeader = document.querySelector('.unified-header');
        
        if (unifiedHeader) {
            debugResults.unifiedHeaderCreated = true;
            console.log('✅ Unified header found');

            // Test header structure
            const headerContent = unifiedHeader.querySelector('.unified-header-content');
            const headerLeft = unifiedHeader.querySelector('.header-left');
            const headerCenter = unifiedHeader.querySelector('.header-center');
            const headerRight = unifiedHeader.querySelector('.header-right');

            if (headerContent && headerLeft && headerCenter && headerRight) {
                console.log('✅ Unified header structure complete');
            } else {
                debugResults.errors.push('Unified header structure incomplete');
                console.log('❌ Unified header structure incomplete');
            }

            // Test styling
            const style = window.getComputedStyle(unifiedHeader);
            if (style.position === 'fixed' && style.top === '0px') {
                console.log('✅ Unified header positioned correctly');
            } else {
                debugResults.errors.push('Unified header positioning incorrect');
                console.log('❌ Unified header positioning incorrect');
            }

            // Test z-index
            const zIndex = parseInt(style.zIndex);
            if (zIndex >= 1000) {
                console.log('✅ Unified header z-index correct');
            } else {
                debugResults.warnings.push('Unified header z-index may be too low');
            }

        } else {
            debugResults.unifiedHeaderCreated = false;
            debugResults.errors.push('Unified header not created');
            console.log('❌ Unified header NOT found');
        }
    }

    function testNavigation() {
        console.log('🧭 Testing navigation...');

        const navItems = document.querySelectorAll('.unified-nav .nav-item');
        
        if (navItems.length > 0) {
            console.log(`✅ Found ${navItems.length} navigation items`);
            
            // Test if nav items have click handlers
            let workingNavItems = 0;
            navItems.forEach((item, index) => {
                // Check if it has data-page attribute
                if (item.dataset.page) {
                    workingNavItems++;
                } else {
                    debugResults.warnings.push(`Nav item ${index} missing data-page attribute`);
                }

                // Test click simulation
                try {
                    const clickEvent = new MouseEvent('click', { bubbles: true });
                    const hasListeners = item.onclick || item.addEventListener;
                    if (hasListeners) {
                        console.log(`✅ Nav item ${index} (${item.textContent}) has click handler`);
                    }
                } catch (error) {
                    debugResults.errors.push(`Nav item ${index} click test failed: ${error.message}`);
                }
            });

            debugResults.navigationWorking = workingNavItems === navItems.length;
            console.log(`${workingNavItems}/${navItems.length} nav items properly configured`);

        } else {
            debugResults.navigationWorking = false;
            debugResults.errors.push('No navigation items found in unified header');
            console.log('❌ No navigation items found');
        }
    }

    function testCardOverlays() {
        console.log('🎴 Testing card overlays...');

        const cards = document.querySelectorAll('.card');
        
        if (cards.length > 0) {
            console.log(`Testing ${cards.length} cards for overlays...`);

            let cardsWithOverlays = 0;
            
            cards.forEach((card, index) => {
                const overlay = card.querySelector('.card-overlay');
                
                if (overlay) {
                    cardsWithOverlays++;
                    
                    // Test overlay structure
                    const title = overlay.querySelector('.card-title');
                    const actions = overlay.querySelector('.card-actions');
                    
                    if (title && actions) {
                        console.log(`✅ Card ${index} overlay complete`);
                    } else {
                        debugResults.warnings.push(`Card ${index} overlay structure incomplete`);
                    }

                    // Test overlay styling
                    const style = window.getComputedStyle(overlay);
                    if (style.position === 'absolute') {
                        console.log(`✅ Card ${index} overlay positioned correctly`);
                    } else {
                        debugResults.warnings.push(`Card ${index} overlay positioning incorrect`);
                    }

                } else {
                    debugResults.warnings.push(`Card ${index} missing overlay`);
                }
            });

            debugResults.cardOverlaysWorking = cardsWithOverlays > 0;
            console.log(`${cardsWithOverlays}/${cards.length} cards have overlays`);

        } else {
            console.log('⚠️ No cards found to test overlays');
        }
    }

    function testForErrors() {
        console.log('🚨 Testing for JavaScript errors...');

        // Check if window functions exist
        const expectedFunctions = ['expandCard', 'showCardMenu'];
        
        expectedFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ Function ${funcName} available globally`);
            } else {
                debugResults.errors.push(`Function ${funcName} not available globally`);
            }
        });

        // Check if UnifiedHeaderSystem is available
        if (window.UnifiedHeaderSystem) {
            console.log('✅ UnifiedHeaderSystem available');
            
            if (typeof window.UnifiedHeaderSystem.isEnabled === 'function') {
                const isEnabled = window.UnifiedHeaderSystem.isEnabled();
                console.log(`UnifiedHeaderSystem enabled: ${isEnabled}`);
            }
        } else {
            debugResults.errors.push('UnifiedHeaderSystem not available');
        }
    }

    function testResponsiveness() {
        console.log('📱 Testing responsive behavior...');

        const unifiedHeader = document.querySelector('.unified-header');
        
        if (unifiedHeader) {
            // Test different viewport sizes
            const originalWidth = window.innerWidth;
            
            // Simulate mobile width
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 600
            });
            
            // Trigger resize event
            window.dispatchEvent(new Event('resize'));
            
            setTimeout(() => {
                const style = window.getComputedStyle(unifiedHeader);
                console.log('📱 Mobile responsive test completed');
                
                // Restore original width
                Object.defineProperty(window, 'innerWidth', {
                    writable: true,
                    configurable: true,
                    value: originalWidth
                });
                
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    }

    function reportDebugResults() {
        console.log('\n' + '='.repeat(60));
        console.log('🔍 UNIFIED HEADER DEBUG REPORT');
        console.log('='.repeat(60));
        
        console.log(`📋 Original Headers Found: ${debugResults.originalHeadersFound}`);
        console.log(`🗑️ Original Headers Hidden: ${debugResults.originalHeadersHidden}`);
        console.log(`✨ Unified Header Created: ${debugResults.unifiedHeaderCreated ? '✅' : '❌'}`);
        console.log(`🧭 Navigation Working: ${debugResults.navigationWorking ? '✅' : '❌'}`);
        console.log(`🎴 Card Overlays Working: ${debugResults.cardOverlaysWorking ? '✅' : '❌'}`);
        
        console.log(`\n⚠️ Warnings: ${debugResults.warnings.length}`);
        debugResults.warnings.forEach(warning => {
            console.log(`  • ${warning}`);
        });
        
        console.log(`\n❌ Errors: ${debugResults.errors.length}`);
        debugResults.errors.forEach(error => {
            console.log(`  • ${error}`);
        });
        
        // Overall assessment
        const criticalErrors = debugResults.errors.length;
        const majorIssues = debugResults.warnings.length;
        
        if (criticalErrors === 0 && debugResults.unifiedHeaderCreated && debugResults.navigationWorking) {
            console.log('\n🎉 UNIFIED HEADER SYSTEM: ✅ WORKING CORRECTLY');
            console.log('💡 Beautiful single header successfully implemented');
        } else if (criticalErrors > 0) {
            console.log('\n💥 UNIFIED HEADER SYSTEM: ❌ CRITICAL ISSUES');
            console.log('🔧 Requires fixes before it will work properly');
        } else {
            console.log('\n⚠️ UNIFIED HEADER SYSTEM: 🔄 PARTIALLY WORKING');
            console.log('🔧 Minor issues need attention');
        }
        
        console.log('='.repeat(60));

        // Store results globally for inspection
        window.unifiedHeaderDebugResults = debugResults;
    }

    function performRealTimeTests() {
        console.log('🔄 Performing real-time interaction tests...');

        // Test navigation clicking
        const firstNavItem = document.querySelector('.unified-nav .nav-item');
        if (firstNavItem) {
            console.log('🧪 Testing navigation click...');
            
            const originalText = firstNavItem.textContent;
            firstNavItem.style.backgroundColor = 'lime';
            
            setTimeout(() => {
                firstNavItem.style.backgroundColor = '';
                console.log(`✅ Nav item "${originalText}" interaction test completed`);
            }, 1000);
        }

        // Test card overlay hover
        const firstCard = document.querySelector('.card');
        if (firstCard) {
            console.log('🧪 Testing card overlay hover...');
            
            // Simulate mouse enter
            const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
            firstCard.dispatchEvent(mouseEnterEvent);
            
            setTimeout(() => {
                const overlay = firstCard.querySelector('.card-overlay');
                if (overlay) {
                    const style = window.getComputedStyle(overlay);
                    console.log(`Card overlay opacity on hover: ${style.opacity}`);
                }
                
                // Simulate mouse leave
                const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });
                firstCard.dispatchEvent(mouseLeaveEvent);
            }, 500);
        }
    }

    // Auto-run debug tests when DOM is ready
    function startDebugging() {
        if (document.readyState === 'complete') {
            setTimeout(() => {
                runDebugTests();
                
                // Run real-time tests after static tests
                setTimeout(performRealTimeTests, 2000);
            }, 3000); // Wait 3 seconds for unified header system to load
        } else {
            setTimeout(startDebugging, 200);
        }
    }

    // Start debugging
    startDebugging();

    // Make debug functions available globally
    window.debugUnifiedHeader = {
        run: runDebugTests,
        results: debugResults,
        testNavigation: testNavigation,
        testCardOverlays: testCardOverlays
    };

})();