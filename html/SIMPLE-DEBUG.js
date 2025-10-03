/**
 * SIMPLE DEBUG - Just open the page and see what's wrong
 */

(function() {
    'use strict';

    console.log('🔍 SIMPLE DEBUG: Starting basic debugging...');

    function debugCurrentState() {
        console.log('\n=== CURRENT STATE DEBUG ===');
        console.log('Time:', new Date().toLocaleTimeString());
        console.log('DOM Ready:', document.readyState);
        
        // Count elements
        const headers = document.querySelectorAll('.header');
        const navContainers = document.querySelectorAll('.nav-container');
        const cardHeaders = document.querySelectorAll('.card-header');
        const cards = document.querySelectorAll('.card');
        const buttons = document.querySelectorAll('.card button');
        const selects = document.querySelectorAll('.card select');
        const resizeHandles = document.querySelectorAll('.resize-handle, .resize-handle-bl');
        
        console.log('\n📊 ELEMENT COUNT:');
        console.log(`Headers (.header): ${headers.length}`);
        console.log(`Nav containers: ${navContainers.length}`);
        console.log(`Card headers: ${cardHeaders.length}`);
        console.log(`Cards: ${cards.length}`);
        console.log(`Buttons in cards: ${buttons.length}`);
        console.log(`Selects in cards: ${selects.length}`);
        console.log(`Resize handles: ${resizeHandles.length}`);
        
        // Check visibility
        console.log('\n👁️ VISIBILITY CHECK:');
        
        headers.forEach((header, i) => {
            const style = window.getComputedStyle(header);
            console.log(`Header ${i}: display=${style.display}, position=${style.position}`);
        });
        
        navContainers.forEach((nav, i) => {
            const style = window.getComputedStyle(nav);
            console.log(`Nav ${i}: display=${style.display}, position=${style.position}`);
        });
        
        console.log(`Card headers visible: ${Array.from(cardHeaders).filter(h => window.getComputedStyle(h).display !== 'none').length}/${cardHeaders.length}`);
        
        // Test basic functionality
        console.log('\n🧪 FUNCTIONALITY TEST:');
        
        // Test if navigation works
        const navTabs = document.querySelectorAll('.nav-tab');
        const workingNavTabs = Array.from(navTabs).filter(tab => tab.onclick || tab.getAttribute('onclick'));
        console.log(`Working nav tabs: ${workingNavTabs.length}/${navTabs.length}`);
        
        // Test if buttons are clickable
        const clickableButtons = Array.from(buttons).filter(btn => {
            const style = window.getComputedStyle(btn);
            return style.pointerEvents !== 'none';
        });
        console.log(`Clickable buttons: ${clickableButtons.length}/${buttons.length}`);
        
        // Test if resize handles have listeners
        let workingResizeHandles = 0;
        resizeHandles.forEach(handle => {
            if (handle.onmousedown || handle.hasAttribute('data-resize-initialized')) {
                workingResizeHandles++;
            }
        });
        console.log(`Working resize handles: ${workingResizeHandles}/${resizeHandles.length}`);
        
        console.log('\n=== END DEBUG ===\n');
        
        // Store results globally
        window.debugResults = {
            timestamp: Date.now(),
            headers: headers.length,
            navContainers: navContainers.length,
            cardHeaders: cardHeaders.length,
            cards: cards.length,
            buttons: buttons.length,
            workingNavTabs: workingNavTabs.length,
            clickableButtons: clickableButtons.length,
            workingResizeHandles: workingResizeHandles
        };
    }

    // Run debug every 2 seconds to track changes
    function startDebugging() {
        debugCurrentState();
        
        // Run again in 5 seconds to see what changed
        setTimeout(() => {
            console.log('🔄 SIMPLE DEBUG: Running follow-up check...');
            debugCurrentState();
        }, 5000);
        
        // Run again in 10 seconds for final check
        setTimeout(() => {
            console.log('🔄 SIMPLE DEBUG: Running final check...');
            debugCurrentState();
            
            // Show summary
            console.log('\n🎯 SIMPLE DEBUG: Complete. Check window.debugResults for data.');
        }, 10000);
    }

    // Auto-start when page loads
    if (document.readyState === 'complete') {
        setTimeout(startDebugging, 1000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(startDebugging, 1000);
        });
    }

    // Make debug function available for manual testing
    window.runSimpleDebug = debugCurrentState;

})();