/* ==========================================
   SIMPLE FIX - Remove complexity, make it work
   ========================================== */

// This file contains the SIMPLE fix for FM-Base initialization issues

// STEP 1: Wait for EVERYTHING to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting simple initialization');
    
    // STEP 2: Small delay to ensure all scripts are executed
    setTimeout(function() {
        console.log('Attempting simple initialization...');
        
        // STEP 3: Check if pages exist
        const pages = {
            overview: document.getElementById('overview-page'),
            squad: document.getElementById('squad-page'),
            tactics: document.getElementById('tactics-page'),
            training: document.getElementById('training-page'),
            transfers: document.getElementById('transfers-page'),
            finances: document.getElementById('finances-page'),
            fixtures: document.getElementById('fixtures-page')
        };
        
        // STEP 4: Log what we found
        console.log('Page elements found:');
        for (let page in pages) {
            console.log(`  ${page}: ${pages[page] ? 'YES' : 'NO'}`);
        }
        
        // STEP 5: If we have the main UI function, call it
        if (typeof window.initializeMainUI === 'function') {
            console.log('Calling initializeMainUI...');
            try {
                window.initializeMainUI();
                console.log('✓ initializeMainUI completed');
            } catch (e) {
                console.error('✗ initializeMainUI failed:', e);
            }
        } else {
            console.warn('initializeMainUI not found');
        }
        
        // STEP 6: Ensure navigation works
        if (typeof window.switchTab === 'function') {
            console.log('✓ switchTab function available');
        } else {
            console.error('✗ switchTab function NOT available');
            // Try to make it available
            if (typeof switchTab === 'function') {
                window.switchTab = switchTab;
                console.log('✓ Made switchTab globally available');
            }
        }
        
        // STEP 7: Log final status
        console.log('====================================');
        console.log('Simple initialization complete');
        console.log('Try clicking navigation tabs now');
        console.log('====================================');
        
    }, 1000); // 1000ms delay to be absolutely sure DOM is ready
});