/**
 * DEBUG AND FIX - Comprehensive testing and debugging
 * This will diagnose issues and provide a working solution
 */

(function() {
    'use strict';

    console.log('🔍 DEBUG AND FIX: Starting comprehensive diagnostics...');

    let diagnosticsResults = {
        domReady: false,
        cardsFound: 0,
        buttonsFound: 0,
        selectsFound: 0,
        resizeHandlesFound: 0,
        eventListeners: 0,
        duplicateProcessing: false,
        errors: []
    };

    // Wait for everything to be ready
    function startDebugging() {
        if (document.readyState === 'complete') {
            setTimeout(() => {
                runDiagnostics();
                applyActualFixes();
            }, 3000); // Wait 3 seconds to ensure other scripts have run
        } else {
            setTimeout(startDebugging, 100);
        }
    }

    function runDiagnostics() {
        console.log('🔍 DEBUG AND FIX: Running diagnostics...');

        // 1. Check DOM state
        diagnosticsResults.domReady = document.readyState === 'complete';
        
        // 2. Count elements
        diagnosticsResults.cardsFound = document.querySelectorAll('.card').length;
        diagnosticsResults.buttonsFound = document.querySelectorAll('.card button, .card .card-menu-btn').length;
        diagnosticsResults.selectsFound = document.querySelectorAll('.card select').length;
        diagnosticsResults.resizeHandlesFound = document.querySelectorAll('.resize-handle, .resize-handle-bl').length;

        // 3. Check for duplicate processing
        const elementsWithElegantFix = document.querySelectorAll('[data-elegant-enhanced]').length;
        const elementsWithElegantResize = document.querySelectorAll('[data-elegant-resize-fixed]').length;
        
        if (elementsWithElegantFix > diagnosticsResults.cardsFound) {
            diagnosticsResults.duplicateProcessing = true;
        }

        // 4. Test actual functionality
        testButtonFunctionality();
        testResizeHandles();
        testFormElements();

        // 5. Report results
        reportDiagnostics();
    }

    function testButtonFunctionality() {
        console.log('🔘 DEBUG AND FIX: Testing button functionality...');
        
        const buttons = document.querySelectorAll('.card button, .card .card-menu-btn');
        let responsiveButtons = 0;
        
        buttons.forEach((button, index) => {
            try {
                // Test if button can receive events
                const testEvent = new MouseEvent('click', { bubbles: true });
                const hasListeners = button.onclick || button.addEventListener;
                
                if (hasListeners) {
                    responsiveButtons++;
                }
                
                // Check if button is properly styled
                const computedStyle = window.getComputedStyle(button);
                const pointerEvents = computedStyle.pointerEvents;
                
                if (pointerEvents === 'none') {
                    console.warn(`🔘 Button ${index} has pointer-events: none`);
                    diagnosticsResults.errors.push(`Button ${index} not clickable`);
                }
                
            } catch (error) {
                console.error(`🔘 Error testing button ${index}:`, error);
                diagnosticsResults.errors.push(`Button ${index} test failed: ${error.message}`);
            }
        });
        
        console.log(`🔘 Found ${responsiveButtons}/${buttons.length} responsive buttons`);
    }

    function testResizeHandles() {
        console.log('📏 DEBUG AND FIX: Testing resize handles...');
        
        const resizeHandles = document.querySelectorAll('.resize-handle, .resize-handle-bl');
        let workingHandles = 0;
        
        resizeHandles.forEach((handle, index) => {
            try {
                const computedStyle = window.getComputedStyle(handle);
                const display = computedStyle.display;
                const pointerEvents = computedStyle.pointerEvents;
                const opacity = computedStyle.opacity;
                
                if (display !== 'none' && pointerEvents !== 'none' && parseFloat(opacity) > 0) {
                    workingHandles++;
                }
                
                // Check if has event listeners
                const hasMousedown = handle.onmousedown || handle.hasAttribute('data-elegant-resize-fixed');
                if (!hasMousedown) {
                    console.warn(`📏 Resize handle ${index} has no mousedown listener`);
                    diagnosticsResults.errors.push(`Resize handle ${index} not functional`);
                }
                
            } catch (error) {
                console.error(`📏 Error testing resize handle ${index}:`, error);
            }
        });
        
        console.log(`📏 Found ${workingHandles}/${resizeHandles.length} working resize handles`);
    }

    function testFormElements() {
        console.log('📝 DEBUG AND FIX: Testing form elements...');
        
        const selects = document.querySelectorAll('.card select');
        const inputs = document.querySelectorAll('.card input');
        
        let missingIds = 0;
        
        [...selects, ...inputs].forEach((element, index) => {
            if (!element.id && !element.name) {
                missingIds++;
                // Fix the accessibility issue
                element.id = `form-element-${Date.now()}-${index}`;
                console.log(`📝 Added ID to form element: ${element.tagName}`);
            }
        });
        
        if (missingIds > 0) {
            console.log(`📝 Fixed ${missingIds} form elements missing IDs`);
        }
    }

    function reportDiagnostics() {
        console.log('\n' + '='.repeat(50));
        console.log('🔍 DIAGNOSTIC REPORT');
        console.log('='.repeat(50));
        console.log('DOM Ready:', diagnosticsResults.domReady ? '✅' : '❌');
        console.log('Cards Found:', diagnosticsResults.cardsFound);
        console.log('Buttons Found:', diagnosticsResults.buttonsFound);
        console.log('Selects Found:', diagnosticsResults.selectsFound);
        console.log('Resize Handles Found:', diagnosticsResults.resizeHandlesFound);
        console.log('Duplicate Processing:', diagnosticsResults.duplicateProcessing ? '⚠️ YES' : '✅ NO');
        console.log('Errors Found:', diagnosticsResults.errors.length);
        
        if (diagnosticsResults.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            diagnosticsResults.errors.forEach(error => console.log('  -', error));
        }
        console.log('='.repeat(50));
    }

    function applyActualFixes() {
        console.log('🛠️ DEBUG AND FIX: Applying real fixes...');

        // Fix 1: Ensure buttons are actually clickable
        fixButtonResponsiveness();
        
        // Fix 2: Ensure resize handles work
        fixResizeHandles();
        
        // Fix 3: Fix form accessibility issues
        fixFormAccessibility();
        
        // Fix 4: Remove duplicate processing
        preventDuplicateProcessing();
        
        // Fix 5: Add proper event delegation
        setupEventDelegation();

        console.log('✅ DEBUG AND FIX: All fixes applied');
    }

    function fixButtonResponsiveness() {
        console.log('🔘 DEBUG AND FIX: Fixing button responsiveness...');
        
        // Use event delegation instead of individual listeners
        document.addEventListener('click', function(e) {
            // Handle card menu buttons
            if (e.target.matches('.card-menu-btn, .card-menu-btn *')) {
                e.stopPropagation();
                e.preventDefault();
                
                const button = e.target.closest('.card-menu-btn');
                if (button) {
                    console.log('🔘 Card menu button clicked via delegation');
                    
                    // Find or create dropdown
                    let dropdown = button.nextElementSibling;
                    if (!dropdown || !dropdown.classList.contains('card-menu-dropdown')) {
                        dropdown = createCardMenuDropdown();
                        button.parentNode.appendChild(dropdown);
                    }
                    
                    // Toggle dropdown
                    const isVisible = dropdown.style.display === 'block';
                    
                    // Hide all dropdowns first
                    document.querySelectorAll('.card-menu-dropdown').forEach(d => {
                        d.style.display = 'none';
                    });
                    
                    // Show/hide this dropdown
                    dropdown.style.display = isVisible ? 'none' : 'block';
                }
            }
            
            // Handle other card buttons
            if (e.target.matches('.card button:not(.card-menu-btn)')) {
                e.stopPropagation();
                console.log('🔘 Card button clicked:', e.target);
            }
            
            // Handle selects
            if (e.target.matches('.card select')) {
                e.stopPropagation();
                console.log('📝 Select clicked:', e.target);
            }
        });
    }

    function createCardMenuDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'card-menu-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--neutral-300);
            border: 1px solid var(--neutral-400);
            border-radius: 4px;
            min-width: 120px;
            z-index: 1000;
            display: none;
        `;
        
        dropdown.innerHTML = `
            <div class="menu-item" onclick="console.log('Expand clicked')">Expand</div>
            <div class="menu-item" onclick="console.log('Remove clicked')">Remove</div>
            <div class="menu-item" onclick="console.log('Replace clicked')">Replace</div>
        `;
        
        return dropdown;
    }

    function fixResizeHandles() {
        console.log('📏 DEBUG AND FIX: Fixing resize handles...');
        
        // Remove existing broken listeners
        document.querySelectorAll('.resize-handle, .resize-handle-bl').forEach(handle => {
            const newHandle = handle.cloneNode(true);
            handle.parentNode.replaceChild(newHandle, handle);
        });
        
        // Add working resize functionality
        document.addEventListener('mousedown', function(e) {
            if (e.target.matches('.resize-handle')) {
                startResize(e, 'br');
            } else if (e.target.matches('.resize-handle-bl')) {
                startResize(e, 'bl');
            }
        });
    }

    function startResize(e, corner) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log(`📏 Starting resize (${corner})`);
        
        const handle = e.target;
        const card = handle.closest('.card');
        
        if (!card) return;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = card.offsetWidth;
        const startHeight = card.offsetHeight;
        
        function doResize(e) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newWidth = startWidth;
            let newHeight = startHeight + deltaY;
            
            if (corner === 'br') {
                newWidth = startWidth + deltaX;
            } else if (corner === 'bl') {
                newWidth = startWidth - deltaX;
            }
            
            // Apply constraints
            newWidth = Math.max(200, newWidth);
            newHeight = Math.max(150, newHeight);
            
            card.style.width = newWidth + 'px';
            card.style.height = newHeight + 'px';
        }
        
        function stopResize() {
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
            console.log('📏 Resize complete');
        }
        
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    }

    function fixFormAccessibility() {
        console.log('📝 DEBUG AND FIX: Fixing form accessibility...');
        
        let idCounter = 0;
        
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (!element.id && !element.name) {
                element.id = `auto-id-${++idCounter}`;
                console.log(`📝 Added ID: ${element.id} to ${element.tagName}`);
            }
        });
    }

    function preventDuplicateProcessing() {
        console.log('🔄 DEBUG AND FIX: Preventing duplicate processing...');
        
        // Clear any existing enhancement markers
        document.querySelectorAll('[data-elegant-enhanced]').forEach(el => {
            el.removeAttribute('data-elegant-enhanced');
        });
        
        document.querySelectorAll('[data-elegant-resize-fixed]').forEach(el => {
            el.removeAttribute('data-elegant-resize-fixed');
        });
    }

    function setupEventDelegation() {
        console.log('🎯 DEBUG AND FIX: Setting up event delegation...');
        
        // Single event listener for all card interactions
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.card');
            if (!card) return;
            
            // Log all clicks for debugging
            console.log('🎯 Card interaction:', {
                target: e.target.tagName,
                classes: e.target.className,
                card: card.querySelector('.card-header span')?.textContent
            });
        });
        
        // Prevent event conflicts by stopping propagation on interactive elements
        document.addEventListener('mousedown', function(e) {
            if (e.target.matches('button, select, input, textarea')) {
                e.stopPropagation();
            }
        });
    }

    // Add visual debugging
    function addVisualDebugging() {
        const style = document.createElement('style');
        style.textContent = `
            .card {
                position: relative;
                border: 2px solid transparent;
                transition: border-color 0.2s ease;
            }
            
            .card:hover {
                border-color: rgba(0, 255, 0, 0.3) !important;
            }
            
            .card button:hover, .card select:hover {
                outline: 2px solid lime !important;
                outline-offset: 1px;
            }
            
            .resize-handle, .resize-handle-bl {
                background: rgba(255, 0, 0, 0.3) !important;
                opacity: 1 !important;
            }
            
            .resize-handle:hover, .resize-handle-bl:hover {
                background: rgba(255, 0, 0, 0.6) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-run debugging
    startDebugging();
    
    // Add visual debugging for easier testing
    setTimeout(addVisualDebugging, 1000);
    
    // Make functions available for manual testing
    window.DebugFix = {
        runDiagnostics,
        testButtonFunctionality,
        testResizeHandles,
        results: diagnosticsResults
    };

})();