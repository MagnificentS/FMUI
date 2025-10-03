/**
 * UNIFIED HEADER SYSTEM
 * Eliminates ugly double headers with a single adaptive header
 * Based on ZENITH philosophy: "felt, not seen"
 */

(function() {
    'use strict';

    console.log('🎨 UNIFIED HEADER: Creating single adaptive header system...');

    let headerSystem = {
        initialized: false,
        currentContext: 'overview',
        adaptiveElements: new Map(),
        contextualData: new Map()
    };

    function initializeUnifiedHeader() {
        if (headerSystem.initialized) return;

        console.log('🔄 UNIFIED HEADER: Replacing multiple headers with single adaptive system...');
        
        // 1. Remove existing header clutter
        eliminateHeaderClutter();
        
        // 2. Create unified adaptive header
        createUnifiedHeader();
        
        // 3. Transform cards to headerless design
        transformCardsToHeaderless();
        
        // 4. Add contextual overlays for card controls
        addContextualOverlays();
        
        // 5. Setup adaptive behavior
        setupAdaptiveBehavior();
        
        headerSystem.initialized = true;
        console.log('✨ UNIFIED HEADER: Beautiful single-header interface created');
    }

    function eliminateHeaderClutter() {
        console.log('🗑️ UNIFIED HEADER: Eliminating visual clutter...');
        
        // Hide the ugly main header
        const mainHeader = document.querySelector('.header');
        if (mainHeader) {
            mainHeader.style.display = 'none';
            console.log('✅ Removed cluttered main header');
        }
        
        // Hide card headers (we'll replace with elegant overlays)
        const cardHeaders = document.querySelectorAll('.card-header');
        cardHeaders.forEach(header => {
            header.style.display = 'none';
        });
        console.log(`✅ Hidden ${cardHeaders.length} redundant card headers`);
        
        // Adjust content positioning
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.style.marginTop = '0';
        }
    }

    function createUnifiedHeader() {
        console.log('🎨 UNIFIED HEADER: Creating beautiful unified header...');
        
        const unifiedHeader = document.createElement('div');
        unifiedHeader.className = 'unified-header';
        unifiedHeader.innerHTML = `
            <div class="unified-header-content">
                <!-- Left: Team context (adaptive) -->
                <div class="header-left">
                    <div class="team-indicator">
                        <div class="team-badge-mini"></div>
                        <span class="team-name">Manchester United</span>
                    </div>
                </div>
                
                <!-- Center: Contextual navigation -->
                <div class="header-center">
                    <nav class="unified-nav">
                        <button class="nav-item active" data-page="overview">Overview</button>
                        <button class="nav-item" data-page="squad">Squad</button>
                        <button class="nav-item" data-page="tactics">Tactics</button>
                        <button class="nav-item" data-page="training">Training</button>
                        <button class="nav-item" data-page="transfers">Transfers</button>
                        <button class="nav-item" data-page="finances">Finances</button>
                        <button class="nav-item" data-page="fixtures">Fixtures</button>
                    </nav>
                </div>
                
                <!-- Right: Time and contextual actions -->
                <div class="header-right">
                    <div class="time-display">
                        <span class="date">15 Aug 2024</span>
                        <span class="time">14:30</span>
                    </div>
                    <button class="continue-btn" onclick="advanceTime()">Continue</button>
                </div>
            </div>
        `;
        
        // Insert at top of body
        document.body.insertBefore(unifiedHeader, document.body.firstChild);
        
        // Add beautiful styling
        addUnifiedHeaderStyles();
    }

    function addUnifiedHeaderStyles() {
        const styles = `
            /* UNIFIED HEADER SYSTEM - Beautiful single header */
            .unified-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 56px;
                background: linear-gradient(135deg, 
                    rgba(0, 10, 15, 0.95) 0%, 
                    rgba(0, 20, 30, 0.98) 50%, 
                    rgba(0, 10, 15, 0.95) 100%);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(0, 148, 204, 0.2);
                z-index: 1000;
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
            }
            
            .unified-header-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                max-width: 1680px;
                margin: 0 auto;
                padding: 0 24px;
            }
            
            /* Left Section - Team Context */
            .header-left {
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 200px;
            }
            
            .team-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }
            
            .team-indicator:hover {
                opacity: 1;
            }
            
            .team-badge-mini {
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #0094cc, #005a7a);
                border-radius: 50%;
                border: 2px solid rgba(0, 148, 204, 0.3);
            }
            
            .team-name {
                font-size: 14px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.9);
            }
            
            /* Center Section - Navigation */
            .header-center {
                flex: 1;
                display: flex;
                justify-content: center;
            }
            
            .unified-nav {
                display: flex;
                gap: 2px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 4px;
            }
            
            .nav-item {
                padding: 8px 16px;
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 13px;
                font-weight: 500;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
                position: relative;
            }
            
            .nav-item:hover {
                color: rgba(255, 255, 255, 0.9);
                background: rgba(255, 255, 255, 0.05);
            }
            
            .nav-item.active {
                color: white;
                background: rgba(0, 148, 204, 0.3);
                box-shadow: 0 0 0 1px rgba(0, 148, 204, 0.4);
            }
            
            /* Right Section - Time & Actions */
            .header-right {
                display: flex;
                align-items: center;
                gap: 16px;
                min-width: 200px;
                justify-content: flex-end;
            }
            
            .time-display {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.2;
            }
            
            .continue-btn {
                padding: 8px 20px;
                background: linear-gradient(135deg, #00ff88, #00cc6a);
                color: #000;
                border: none;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
                box-shadow: 0 2px 8px rgba(0, 255, 136, 0.3);
            }
            
            .continue-btn:hover {
                background: linear-gradient(135deg, #00ff88, #00dd77);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
            }
            
            /* Adjust page content for unified header */
            .nav-container {
                display: none !important;
            }
            
            .main-container {
                margin-top: 56px !important;
            }
            
            .content-area {
                padding-top: 20px !important;
            }
            
            /* Card overlay system - replaces ugly card headers */
            .card {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
            }
            
            .card:hover .card-overlay {
                opacity: 1;
                backdrop-filter: blur(10px);
            }
            
            .card-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 40px;
                background: linear-gradient(135deg, 
                    rgba(0, 0, 0, 0.8) 0%, 
                    rgba(0, 20, 30, 0.6) 100%);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 12px;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
                z-index: 10;
            }
            
            .card-title {
                font-size: 12px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.9);
            }
            
            .card-actions {
                display: flex;
                gap: 8px;
            }
            
            .card-action {
                width: 24px;
                height: 24px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 4px;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            
            .card-action:hover {
                background: rgba(0, 148, 204, 0.3);
                color: white;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function transformCardsToHeaderless() {
        console.log('🎨 UNIFIED HEADER: Creating headerless card design...');
        
        // Adjust main container for new header
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.marginTop = '56px';
        }
        
        // Process each card
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            // Get card title from hidden header
            const hiddenHeader = card.querySelector('.card-header');
            const cardTitle = hiddenHeader ? 
                hiddenHeader.querySelector('span')?.textContent || `Card ${index + 1}` :
                `Card ${index + 1}`;
            
            // Create elegant overlay
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            overlay.innerHTML = `
                <span class="card-title">${cardTitle}</span>
                <div class="card-actions">
                    <button class="card-action" title="Expand" onclick="expandCard(this)">⤢</button>
                    <button class="card-action" title="Menu" onclick="showCardMenu(this)">⋯</button>
                </div>
            `;
            
            card.appendChild(overlay);
            
            // Adjust card content padding
            const cardBody = card.querySelector('.card-body, .card-content');
            if (cardBody) {
                cardBody.style.paddingTop = '12px';
            }
        });
        
        console.log(`✨ Transformed ${cards.length} cards to headerless design`);
    }

    function addContextualOverlays() {
        console.log('🎯 UNIFIED HEADER: Adding contextual overlays...');
        
        // Global functions for card actions
        window.expandCard = function(button) {
            const card = button.closest('.card');
            const cardTitle = card.querySelector('.card-title').textContent;
            console.log(`🔍 Expanding card: ${cardTitle}`);
            
            // Expand logic here
            if (window.expandCardFromHeader) {
                const mockHeader = { closest: () => card };
                window.expandCardFromHeader(mockHeader);
            }
        };
        
        window.showCardMenu = function(button) {
            const card = button.closest('.card');
            const cardTitle = card.querySelector('.card-title').textContent;
            console.log(`⋯ Opening menu for: ${cardTitle}`);
            
            // Create contextual menu
            createContextualMenu(button, card);
        };
    }

    function createContextualMenu(button, card) {
        // Remove existing menus
        document.querySelectorAll('.contextual-menu').forEach(menu => menu.remove());
        
        const menu = document.createElement('div');
        menu.className = 'contextual-menu';
        menu.innerHTML = `
            <div class="menu-item" onclick="this.parentElement.remove(); expandCard(this)">Expand</div>
            <div class="menu-item" onclick="this.parentElement.remove(); console.log('Remove card')">Remove</div>
            <div class="menu-item" onclick="this.parentElement.remove(); console.log('Replace card')">Replace</div>
        `;
        
        // Position menu
        const rect = button.getBoundingClientRect();
        menu.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 5}px;
            right: ${window.innerWidth - rect.right}px;
            background: rgba(0, 20, 30, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 148, 204, 0.3);
            border-radius: 6px;
            padding: 4px 0;
            min-width: 120px;
            z-index: 2000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        document.body.appendChild(menu);
        
        // Auto-close on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    function setupAdaptiveBehavior() {
        console.log('🧠 UNIFIED HEADER: Setting up adaptive behavior...');
        
        // Navigation handling
        const navItems = document.querySelectorAll('.unified-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Switch page
                const pageName = this.dataset.page;
                if (window.directFixSwitchToPage) {
                    window.directFixSwitchToPage(pageName);
                }
                
                headerSystem.currentContext = pageName;
                console.log(`📄 Switched to: ${pageName}`);
            });
        });
    }

    // Auto-initialize when ready
    function waitForReady() {
        if (document.readyState === 'complete' && document.querySelector('.card')) {
            setTimeout(initializeUnifiedHeader, 1000);
        } else {
            setTimeout(waitForReady, 200);
        }
    }

    waitForReady();

    // Global access
    window.UnifiedHeaderSystem = {
        init: initializeUnifiedHeader,
        isEnabled: () => headerSystem.initialized
    };

})();