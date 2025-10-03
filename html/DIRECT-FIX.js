/* DIRECT FIX - The simplest possible solution */

// Wait for window.load (everything including images)
window.addEventListener('load', function() {
    console.log('🔧 DIRECT FIX: Window fully loaded, starting initialization...');
    
    // Add another delay to be absolutely sure
    setTimeout(function() {
        console.log('🔧 DIRECT FIX: Final delay complete, checking DOM...');
        
        // Check if pages exist NOW
        const overviewPage = document.getElementById('overview-page');
        const squadPage = document.getElementById('squad-page');
        const tacticsPage = document.getElementById('tactics-page');
        
        console.log('🔧 DIRECT FIX: Page check results:');
        console.log('  overview-page:', overviewPage ? 'FOUND' : 'NOT FOUND');
        console.log('  squad-page:', squadPage ? 'FOUND' : 'NOT FOUND');
        console.log('  tactics-page:', tacticsPage ? 'FOUND' : 'NOT FOUND');
        
        if (overviewPage) {
            console.log('✅ DIRECT FIX: Pages found! Initializing...');
            
            // Make overview page visible
            overviewPage.classList.add('active');
            
            // Remove active from others
            document.querySelectorAll('.content-page').forEach(page => {
                if (page !== overviewPage) {
                    page.classList.remove('active');
                }
            });
            
            // Try to call the main initialization if it exists
            if (typeof window.initializeMainUI === 'function') {
                try {
                    window.initializeMainUI();
                    console.log('✅ DIRECT FIX: initializeMainUI completed successfully');
                } catch (e) {
                    console.error('❌ DIRECT FIX: initializeMainUI failed:', e);
                }
            }
            
            // Make navigation work
            setupBasicNavigation();
            
            console.log('🎉 DIRECT FIX: Initialization complete!');
            
        } else {
            console.error('💥 DIRECT FIX: Still cannot find overview-page element');
            console.log('🔍 DIRECT FIX: Debugging - listing all elements with id:');
            
            const allElementsWithId = document.querySelectorAll('[id]');
            allElementsWithId.forEach(el => {
                console.log(`  - ${el.id}: ${el.tagName}`);
            });
        }
        
    }, 2000); // 2 second delay
});

function setupBasicNavigation() {
    console.log('🧭 DIRECT FIX: Setting up basic navigation...');
    
    // Find all navigation items and set up click handlers
    const navItems = document.querySelectorAll('.nav-tab, .nav-item, [onclick*="switchTab"]');
    
    navItems.forEach(item => {
        const originalOnClick = item.getAttribute('onclick');
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract page name from onclick or text content
            let pageName = null;
            
            if (originalOnClick) {
                const match = originalOnClick.match(/switchTab\(['"]([^'"]+)['"]/);
                if (match) pageName = match[1];
            }
            
            if (!pageName) {
                pageName = item.textContent.trim().toLowerCase();
            }
            
            console.log(`🧭 DIRECT FIX: Switching to page: ${pageName}`);
            
            // Simple page switching
            switchToPage(pageName);
        });
    });
}

function switchToPage(pageName) {
    console.log(`📄 DIRECT FIX: Switching to page: ${pageName}`);
    
    // Hide all pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`✅ DIRECT FIX: Activated page: ${pageName}`);
        
        // Update navigation active state
        document.querySelectorAll('.nav-tab, .nav-item').forEach(nav => {
            nav.classList.remove('active');
            if (nav.textContent.trim().toLowerCase() === pageName) {
                nav.classList.add('active');
            }
        });
        
        // Try to load cards for this page if function exists
        if (typeof window.loadPageCards === 'function') {
            try {
                window.loadPageCards(pageName);
                console.log(`🎴 DIRECT FIX: Loaded cards for ${pageName}`);
            } catch (e) {
                console.warn(`⚠️ DIRECT FIX: Could not load cards for ${pageName}:`, e);
            }
        }
        
    } else {
        console.error(`❌ DIRECT FIX: Could not find page: ${pageName}-page`);
    }
}

// Make functions globally available
window.directFixSwitchToPage = switchToPage;