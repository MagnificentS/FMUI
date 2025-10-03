/**
 * BUTTON FIX - Simple solution for responsive buttons and controls
 * Just make the buttons work - no over-engineering
 */

(function() {
    'use strict';

    console.log('🔘 BUTTON FIX: Making buttons and controls actually responsive...');

    function fixButtons() {
        // Wait for cards to be loaded
        if (document.querySelectorAll('.card').length === 0) {
            setTimeout(fixButtons, 500);
            return;
        }

        console.log('🔘 BUTTON FIX: Setting up responsive button controls...');

        // Fix card menu buttons
        document.addEventListener('click', function(e) {
            // Handle card menu buttons
            if (e.target.matches('.card-menu-btn, .card-menu-btn *')) {
                e.stopPropagation();
                e.preventDefault();
                
                const button = e.target.closest('.card-menu-btn');
                if (button) {
                    console.log('🔘 Card menu button clicked');
                    toggleCardMenu(button);
                }
                return;
            }

            // Handle other buttons in cards
            if (e.target.matches('.card button')) {
                e.stopPropagation();
                console.log('🔘 Card button clicked:', e.target.textContent);
                
                // Let the button's original onclick work if it has one
                if (e.target.onclick) {
                    e.target.onclick(e);
                }
                return;
            }
        });

        // Fix select elements
        document.addEventListener('change', function(e) {
            if (e.target.matches('.card select')) {
                e.stopPropagation();
                console.log('📋 Select changed:', e.target.value);
                
                // Trigger original onchange if it exists
                if (e.target.onchange) {
                    e.target.onchange(e);
                }
            }
        });

        // Fix input elements
        document.addEventListener('input', function(e) {
            if (e.target.matches('.card input')) {
                e.stopPropagation();
                console.log('📝 Input changed:', e.target.value);
            }
        });

        // Ensure all form elements have IDs for accessibility
        let idCounter = 0;
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (!element.id && !element.name) {
                element.id = `form-control-${++idCounter}`;
            }
        });

        console.log('✅ BUTTON FIX: All controls made responsive');
    }

    function toggleCardMenu(button) {
        // Find existing dropdown or create one
        let dropdown = button.nextElementSibling;
        
        if (!dropdown || !dropdown.classList.contains('card-menu-dropdown')) {
            dropdown = createCardMenuDropdown();
            button.parentNode.appendChild(dropdown);
        }

        // Toggle visibility
        const isVisible = dropdown.style.display === 'block';
        
        // Hide all other dropdowns
        document.querySelectorAll('.card-menu-dropdown').forEach(d => {
            d.style.display = 'none';
        });

        // Show/hide this dropdown
        dropdown.style.display = isVisible ? 'none' : 'block';
    }

    function createCardMenuDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'card-menu-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: rgba(18, 20, 26, 0.95);
            border: 1px solid rgba(0, 148, 204, 0.3);
            border-radius: 4px;
            min-width: 120px;
            z-index: 1000;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        dropdown.innerHTML = `
            <div class="menu-item" onclick="console.log('Expand clicked'); this.parentElement.style.display='none';">Expand</div>
            <div class="menu-item" onclick="console.log('Remove clicked'); this.parentElement.style.display='none';">Remove</div>
            <div class="menu-item" onclick="console.log('Replace clicked'); this.parentElement.style.display='none';">Replace</div>
        `;

        // Add menu item styling
        const menuStyle = document.createElement('style');
        menuStyle.textContent = `
            .card-menu-dropdown .menu-item {
                padding: 8px 12px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s ease;
            }
            
            .card-menu-dropdown .menu-item:hover {
                background: rgba(0, 148, 204, 0.2);
                color: white;
            }
        `;
        
        if (!document.getElementById('menu-styles')) {
            menuStyle.id = 'menu-styles';
            document.head.appendChild(menuStyle);
        }

        return dropdown;
    }

    // Auto-run when ready
    if (document.readyState === 'complete') {
        setTimeout(fixButtons, 2500);
    } else {
        window.addEventListener('load', function() {
            setTimeout(fixButtons, 2500);
        });
    }

})();