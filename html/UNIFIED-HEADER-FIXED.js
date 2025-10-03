/**
 * UNIFIED HEADER SYSTEM - FIXED VERSION
 * Eliminates ugly double headers with proper error handling and timing
 */

(function() {
    'use strict';

    console.log('🎨 UNIFIED HEADER (FIXED): Starting improved header system...');

    let headerSystem = {
        initialized: false,
        currentContext: 'overview',
        retryCount: 0,
        maxRetries: 10
    };

    function initializeUnifiedHeader() {
        if (headerSystem.initialized) {
            console.log('🔄 UNIFIED HEADER: Already initialized, skipping...');
            return;
        }

        try {
            console.log('🔄 UNIFIED HEADER: Attempting initialization...');
            
            // Check if we have the minimum required elements
            if (!validateRequiredElements()) {
                if (headerSystem.retryCount < headerSystem.maxRetries) {
                    headerSystem.retryCount++;
                    console.log(`⏳ UNIFIED HEADER: Retry ${headerSystem.retryCount}/${headerSystem.maxRetries} in 1 second...`);
                    setTimeout(initializeUnifiedHeader, 1000);
                    return;
                } else {
                    console.error('💥 UNIFIED HEADER: Max retries reached, initialization failed');
                    return;
                }
            }

            // Proceed with initialization
            console.log('✅ UNIFIED HEADER: Required elements found, proceeding...');
            
            // 1. Create unified header first (before hiding others)
            createUnifiedHeader();
            
            // 2. Remove existing header clutter
            eliminateHeaderClutter();
            
            // 3. Transform cards to headerless design
            transformCardsToHeaderless();
            
            // 4. Setup navigation behavior
            setupNavigation();
            
            // 5. Add styles
            addUnifiedHeaderStyles();
            
            headerSystem.initialized = true;
            console.log('✨ UNIFIED HEADER: Successfully initialized!');
            
        } catch (error) {
            console.error('💥 UNIFIED HEADER: Initialization error:', error);
            
            // Try fallback approach
            console.log('🔧 UNIFIED HEADER: Attempting fallback initialization...');
            fallbackInitialization();
        }
    }

    function validateRequiredElements() {
        // Check for body element (minimum requirement)
        if (!document.body) {
            console.log('⏳ UNIFIED HEADER: Waiting for document.body...');
            return false;
        }

        // Check if we can find at least one of the elements we need to modify
        const hasMainHeader = document.querySelector('.header');
        const hasNavContainer = document.querySelector('.nav-container');
        const hasMainContainer = document.querySelector('.main-container, body');

        if (!hasMainContainer) {
            console.log('⏳ UNIFIED HEADER: Waiting for main container...');
            return false;
        }

        console.log(`✅ UNIFIED HEADER: Validation - Main header: ${!!hasMainHeader}, Nav: ${!!hasNavContainer}, Container: ${!!hasMainContainer}`);
        return true;
    }

    function createUnifiedHeader() {
        console.log('🎨 UNIFIED HEADER: Creating unified header...');
        
        // Check if already exists
        if (document.querySelector('.unified-header')) {
            console.log('⚠️ UNIFIED HEADER: Already exists, removing old version...');
            document.querySelector('.unified-header').remove();
        }

        const unifiedHeader = document.createElement('div');
        unifiedHeader.className = 'unified-header';
        unifiedHeader.innerHTML = `
            <div class="unified-header-content">
                <div class="header-left">
                    <div class="team-indicator">
                        <div class="team-badge-mini"></div>
                        <span class="team-name">Manchester United</span>
                    </div>
                </div>
                
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
                
                <div class="header-right">
                    <div class="time-display">
                        <span class="date">15 Aug 2024</span>
                        <span class="time">14:30</span>
                    </div>
                    <button class="continue-btn" onclick="if(window.advanceTime) window.advanceTime()">Continue</button>
                </div>
            </div>
        `;
        
        // Insert at top of body
        document.body.insertBefore(unifiedHeader, document.body.firstChild);
        console.log('✅ UNIFIED HEADER: Created and inserted');
    }

    function eliminateHeaderClutter() {
        console.log('🗑️ UNIFIED HEADER: Eliminating header clutter...');
        
        try {
            // Hide main header
            const mainHeader = document.querySelector('.header');
            if (mainHeader) {
                mainHeader.style.display = 'none';
                console.log('✅ UNIFIED HEADER: Hidden main header');
            } else {
                console.log('ℹ️ UNIFIED HEADER: No main header found to hide');
            }
            
            // Hide navigation container
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.style.display = 'none';
                console.log('✅ UNIFIED HEADER: Hidden nav container');
            } else {
                console.log('ℹ️ UNIFIED HEADER: No nav container found to hide');
            }
            
            // Hide card headers (we'll handle these individually)
            const cardHeaders = document.querySelectorAll('.card-header');
            console.log(`🎴 UNIFIED HEADER: Found ${cardHeaders.length} card headers to hide`);
            
            cardHeaders.forEach((header, index) => {
                header.style.display = 'none';
                console.log(`✅ UNIFIED HEADER: Hidden card header ${index + 1}`);
            });
            
            // Adjust main container margin
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                mainContainer.style.marginTop = '56px';
                console.log('✅ UNIFIED HEADER: Adjusted main container margin');
            }
            
        } catch (error) {
            console.error('💥 UNIFIED HEADER: Error hiding elements:', error);
        }
    }

    function transformCardsToHeaderless() {
        console.log('🎨 UNIFIED HEADER: Transforming cards to headerless design...');
        
        try {
            const cards = document.querySelectorAll('.card');
            console.log(`🎴 UNIFIED HEADER: Found ${cards.length} cards to transform`);
            
            if (cards.length === 0) {
                console.log('⚠️ UNIFIED HEADER: No cards found yet, will retry when cards are loaded...');
                
                // Watch for cards being added
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1 && node.classList.contains('card')) {
                                console.log('🎴 UNIFIED HEADER: New card detected, transforming...');
                                transformSingleCard(node);
                            }
                        });
                    });
                });
                
                observer.observe(document.body, { childList: true, subtree: true });
                return;
            }
            
            cards.forEach((card, index) => {
                transformSingleCard(card, index);
            });
            
        } catch (error) {
            console.error('💥 UNIFIED HEADER: Error transforming cards:', error);
        }
    }

    function transformSingleCard(card, index = 0) {
        try {
            // Skip if already transformed
            if (card.querySelector('.card-overlay')) {
                return;
            }

            // Get card title from hidden header or generate one
            let cardTitle = `Card ${index + 1}`;
            const hiddenHeader = card.querySelector('.card-header');
            if (hiddenHeader) {
                const titleSpan = hiddenHeader.querySelector('span');
                if (titleSpan && titleSpan.textContent.trim()) {
                    cardTitle = titleSpan.textContent.trim();
                }
            }
            
            // Create elegant overlay
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            overlay.innerHTML = `
                <span class="card-title">${cardTitle}</span>
                <div class="card-actions">
                    <button class="card-action" title="Expand" data-action="expand">⤢</button>
                    <button class="card-action" title="Menu" data-action="menu">⋯</button>
                </div>
            `;
            
            // Add event listeners to overlay buttons
            const expandBtn = overlay.querySelector('[data-action="expand"]');
            const menuBtn = overlay.querySelector('[data-action="menu"]');
            
            if (expandBtn) {
                expandBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleCardExpand(card, cardTitle);
                });
            }
            
            if (menuBtn) {
                menuBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleCardMenu(card, cardTitle, e.target);
                });
            }
            
            card.appendChild(overlay);
            
            // Adjust card content padding if needed
            const cardBody = card.querySelector('.card-body, .card-content');
            if (cardBody) {
                cardBody.style.paddingTop = '12px';
            }
            
            console.log(`✅ UNIFIED HEADER: Transformed card "${cardTitle}"`);
            
        } catch (error) {
            console.error(`💥 UNIFIED HEADER: Error transforming card ${index}:`, error);
        }
    }

    function handleCardExpand(card, cardTitle) {
        console.log(`🔍 UNIFIED HEADER: Expanding card "${cardTitle}"`);
        
        // Try to use existing expand functionality
        if (window.expandCardFromHeader) {
            try {
                const mockHeader = { closest: () => card };
                window.expandCardFromHeader(mockHeader);
            } catch (error) {
                console.warn('Could not use existing expand function:', error);
                // Fallback expand behavior
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            }
        } else {
            console.log('No existing expand function found, implementing basic expand');
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        }
    }

    function handleCardMenu(card, cardTitle, button) {
        console.log(`⋯ UNIFIED HEADER: Opening menu for "${cardTitle}"`);
        
        // Remove existing menus
        document.querySelectorAll('.unified-contextual-menu').forEach(menu => menu.remove());
        
        const menu = document.createElement('div');
        menu.className = 'unified-contextual-menu';
        menu.innerHTML = `
            <div class="menu-item" data-action="expand">Expand</div>
            <div class="menu-item" data-action="remove">Remove</div>
            <div class="menu-item" data-action="replace">Replace</div>
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
        
        // Add menu item listeners
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const action = this.dataset.action;
                console.log(`Menu action: ${action} for card "${cardTitle}"`);
                
                switch (action) {
                    case 'expand':
                        handleCardExpand(card, cardTitle);
                        break;
                    case 'remove':
                        card.style.opacity = '0';
                        setTimeout(() => card.remove(), 300);
                        break;
                    case 'replace':
                        console.log('Replace functionality would go here');
                        break;
                }
                
                menu.remove();
            });
        });
        
        document.body.appendChild(menu);
        
        // Auto-close on click outside
        setTimeout(() => {
            const closeHandler = function(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeHandler);
                }
            };
            document.addEventListener('click', closeHandler);
        }, 100);
    }

    function setupNavigation() {
        console.log('🧭 UNIFIED HEADER: Setting up navigation...');
        
        try {
            const navItems = document.querySelectorAll('.unified-nav .nav-item');
            console.log(`🧭 UNIFIED HEADER: Found ${navItems.length} nav items`);
            
            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Update active state
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Get page name
                    const pageName = this.dataset.page;
                    console.log(`🧭 UNIFIED HEADER: Navigating to ${pageName}`);
                    
                    // Try to use existing navigation
                    if (window.directFixSwitchToPage) {
                        window.directFixSwitchToPage(pageName);
                    } else if (window.switchTab) {
                        window.switchTab(pageName, this);
                    } else {
                        console.warn('No navigation function available, implementing basic navigation');
                        // Basic navigation fallback
                        document.querySelectorAll('.content-page').forEach(page => {
                            page.classList.remove('active');
                        });
                        
                        const targetPage = document.getElementById(`${pageName}-page`);
                        if (targetPage) {
                            targetPage.classList.add('active');
                        }
                    }
                    
                    headerSystem.currentContext = pageName;
                });
            });
            
        } catch (error) {
            console.error('💥 UNIFIED HEADER: Error setting up navigation:', error);
        }
    }

    function addUnifiedHeaderStyles() {
        // Check if styles already added
        if (document.getElementById('unified-header-styles')) {
            return;
        }

        const styles = `
            /* UNIFIED HEADER SYSTEM STYLES */
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
            
            /* Card overlay system */
            .card {
                position: relative;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
            }
            
            .card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            
            .card:hover .card-overlay {
                opacity: 1;
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

            /* Menu styles */
            .unified-contextual-menu {
                animation: menuSlideIn 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
            }
            
            @keyframes menuSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .unified-contextual-menu .menu-item {
                padding: 8px 16px;
                color: rgba(255, 255, 255, 0.8);
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s ease;
                border-left: 3px solid transparent;
            }
            
            .unified-contextual-menu .menu-item:hover {
                background: rgba(0, 148, 204, 0.2);
                color: white;
                border-left-color: #0094cc;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'unified-header-styles';
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        
        console.log('✅ UNIFIED HEADER: Styles added');
    }

    function fallbackInitialization() {
        console.log('🔧 UNIFIED HEADER: Running fallback initialization...');
        
        try {
            // At minimum, just hide the main header if it exists
            const mainHeader = document.querySelector('.header');
            if (mainHeader) {
                mainHeader.style.display = 'none';
                console.log('✅ UNIFIED HEADER: Fallback - hidden main header');
            }
            
            // Add a simple unified header
            if (!document.querySelector('.unified-header')) {
                const simpleHeader = document.createElement('div');
                simpleHeader.className = 'unified-header';
                simpleHeader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 56px;
                    background: rgba(0, 20, 30, 0.95);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 14px;
                `;
                simpleHeader.textContent = 'Manchester United - Football Manager Interface';
                document.body.insertBefore(simpleHeader, document.body.firstChild);
                console.log('✅ UNIFIED HEADER: Fallback header created');
            }
            
        } catch (error) {
            console.error('💥 UNIFIED HEADER: Fallback initialization failed:', error);
        }
    }

    // Auto-initialize with proper timing
    function startInitialization() {
        if (document.readyState === 'complete') {
            // Wait a bit for other scripts to finish
            setTimeout(initializeUnifiedHeader, 2000);
        } else {
            // Wait for page to be fully loaded
            window.addEventListener('load', function() {
                setTimeout(initializeUnifiedHeader, 2000);
            });
        }
    }

    // Start initialization
    startInitialization();

    // Global access for debugging
    window.UnifiedHeaderSystemFixed = {
        init: initializeUnifiedHeader,
        isEnabled: () => headerSystem.initialized,
        retry: () => {
            headerSystem.initialized = false;
            headerSystem.retryCount = 0;
            initializeUnifiedHeader();
        }
    };

    console.log('📋 UNIFIED HEADER (FIXED): System loaded, initialization will start automatically');

})();