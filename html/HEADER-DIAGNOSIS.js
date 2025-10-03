/**
 * HEADER DIAGNOSIS - Quick check for double header issues
 */

(function() {
    'use strict';
    
    console.log('🔍 HEADER DIAGNOSIS: Analyzing header architecture...');
    
    function analyzeHeaders() {
        // Wait for DOM to be ready
        if (document.readyState !== 'complete') {
            setTimeout(analyzeHeaders, 100);
            return;
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📋 HEADER ARCHITECTURE ANALYSIS');
        console.log('='.repeat(50));
        
        // Find all header-related elements
        const mainHeaders = document.querySelectorAll('.header');
        const cardHeaders = document.querySelectorAll('.card-header');
        const allHeaderElements = document.querySelectorAll('header, [class*="header"]');
        
        console.log(`🏢 Main headers (.header): ${mainHeaders.length}`);
        console.log(`🎴 Card headers (.card-header): ${cardHeaders.length}`);
        console.log(`📊 Total header elements: ${allHeaderElements.length}`);
        
        // Analyze main header
        if (mainHeaders.length === 1) {
            const mainHeader = mainHeaders[0];
            const style = window.getComputedStyle(mainHeader);
            const rect = mainHeader.getBoundingClientRect();
            
            console.log('\n✅ MAIN HEADER ANALYSIS:');
            console.log(`  Position: ${style.position}`);
            console.log(`  Z-index: ${style.zIndex}`);
            console.log(`  Height: ${rect.height}px`);
            console.log(`  Top: ${rect.top}px`);
            console.log(`  Background: ${style.backgroundColor}`);
            
        } else if (mainHeaders.length > 1) {
            console.log('\n❌ PROBLEM: Multiple main headers found!');
            mainHeaders.forEach((header, index) => {
                console.log(`  Header ${index + 1}:`, header);
            });
        } else {
            console.log('\n❌ PROBLEM: No main header found!');
        }
        
        // Analyze card headers
        if (cardHeaders.length > 0) {
            console.log('\n✅ CARD HEADERS ANALYSIS:');
            console.log(`  Count: ${cardHeaders.length}`);
            
            // Check first few for analysis
            cardHeaders.slice(0, 3).forEach((header, index) => {
                const style = window.getComputedStyle(header);
                const rect = header.getBoundingClientRect();
                
                console.log(`  Card ${index + 1}:`);
                console.log(`    Position: ${style.position}`);
                console.log(`    Height: ${rect.height}px`);
                console.log(`    Cursor: ${style.cursor}`);
                console.log(`    Background: ${style.backgroundColor}`);
            });
        }
        
        // Check for conflicts
        console.log('\n🔍 CONFLICT ANALYSIS:');
        
        let conflicts = [];
        
        // Check if main header overlaps cards
        if (mainHeaders.length > 0) {
            const mainHeader = mainHeaders[0];
            const mainRect = mainHeader.getBoundingClientRect();
            
            cardHeaders.forEach((cardHeader, index) => {
                const cardRect = cardHeader.getBoundingClientRect();
                
                // Check for overlap
                if (!(cardRect.bottom <= mainRect.top || 
                      cardRect.top >= mainRect.bottom ||
                      cardRect.right <= mainRect.left || 
                      cardRect.left >= mainRect.right)) {
                    conflicts.push(`Card header ${index + 1} overlaps main header`);
                }
            });
        }
        
        // Check z-index issues
        const allElements = [...mainHeaders, ...cardHeaders];
        allElements.forEach((element, index) => {
            const style = window.getComputedStyle(element);
            const zIndex = parseInt(style.zIndex);
            
            if (element.classList.contains('header') && (isNaN(zIndex) || zIndex < 100)) {
                conflicts.push('Main header has low z-index (may be covered)');
            }
        });
        
        if (conflicts.length === 0) {
            console.log('✅ No conflicts detected');
            console.log('✅ Architecture appears correct:');
            console.log('   • Main header = Global navigation');
            console.log('   • Card headers = Individual card titles');
            console.log('   • This is STANDARD Football Manager UI design');
        } else {
            console.log('❌ Conflicts found:');
            conflicts.forEach(conflict => console.log(`   • ${conflict}`));
        }
        
        // Test interactivity
        console.log('\n🎮 INTERACTIVITY TEST:');
        
        let interactiveElements = 0;
        let totalElements = 0;
        
        // Test card header clicks
        cardHeaders.forEach(header => {
            totalElements++;
            if (header.onclick || header.ondblclick || 
                header.getAttribute('onclick') || header.getAttribute('ondblclick')) {
                interactiveElements++;
            }
        });
        
        console.log(`📱 Interactive card headers: ${interactiveElements}/${totalElements}`);
        
        // Test buttons in cards
        const cardButtons = document.querySelectorAll('.card button, .card-menu-btn');
        let workingButtons = 0;
        
        cardButtons.forEach(button => {
            const style = window.getComputedStyle(button);
            if (style.pointerEvents !== 'none') {
                workingButtons++;
            }
        });
        
        console.log(`🔘 Working buttons: ${workingButtons}/${cardButtons.length}`);
        
        // Final assessment
        console.log('\n' + '='.repeat(50));
        
        if (mainHeaders.length === 1 && cardHeaders.length > 0 && conflicts.length === 0) {
            console.log('🎉 DIAGNOSIS: HEADERS ARE WORKING CORRECTLY');
            console.log('💡 This is NOT a "double header problem"');
            console.log('💡 This is proper Football Manager UI architecture');
        } else {
            console.log('⚠️ DIAGNOSIS: ISSUES DETECTED');
            console.log('🔧 Needs fixing');
        }
        
        console.log('='.repeat(50));
    }
    
    // Run analysis
    analyzeHeaders();
    
    // Make analysis available globally
    window.analyzeHeaders = analyzeHeaders;
    
})();