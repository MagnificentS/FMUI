/**
 * NAVIGATION ENHANCEMENTS
 * Advanced navigation features including breadcrumbs, quick access, and contextual navigation
 * Improves user experience and workflow efficiency
 */

(function() {
    'use strict';

    console.log('🧭 NAVIGATION ENHANCEMENTS: Initializing advanced navigation system...');

    const NavigationEnhancements = {
        // Navigation state
        navigationHistory: [],
        favoriteSubscreens: new Set(),
        quickAccessItems: [],
        
        init() {
            console.log('🧭 NAVIGATION: Setting up enhanced navigation features...');
            
            this.setupBreadcrumbSystem();
            this.setupQuickAccess();
            this.setupNavigationHistory();
            this.setupKeyboardNavigation();
            this.setupContextualMenus();
            this.setupSearchNavigation();
            
            console.log('✅ NAVIGATION ENHANCEMENTS: Advanced navigation system ready');
        },

        setupBreadcrumbSystem() {
            console.log('🍞 Breadcrumb system disabled - using direct submenu access');
            // Breadcrumbs removed for streamlined navigation
        },

        updateBreadcrumb(tab, subscreen) {
            const breadcrumbContainer = document.getElementById('breadcrumb-navigation');
            if (!breadcrumbContainer) return;
            
            const tabDisplayName = this.getTabDisplayName(tab);
            const subscreenDisplayName = this.getSubscreenDisplayName(tab, subscreen);
            
            breadcrumbContainer.innerHTML = `
                <div class="breadcrumb-content">
                    <div class="breadcrumb-items">
                        <span class="breadcrumb-item home" onclick="navigateToSubscreen('overview', 'dashboard')">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                            </svg>
                        </span>
                        <span class="breadcrumb-separator">›</span>
                        <span class="breadcrumb-item tab" onclick="navigateToSubscreen('${tab}', '${this.getDefaultSubscreen(tab)}')">
                            ${tabDisplayName}
                        </span>
                        <span class="breadcrumb-separator">›</span>
                        <span class="breadcrumb-item subscreen current">
                            ${subscreenDisplayName}
                        </span>
                    </div>
                    <div class="breadcrumb-actions">
                        <button class="breadcrumb-btn" onclick="NavigationEnhancements.toggleQuickAccess()" title="Quick Access">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                            </svg>
                        </button>
                        <button class="breadcrumb-btn" onclick="NavigationEnhancements.toggleFavorite('${tab}', '${subscreen}')" title="Add to Favorites">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                            </svg>
                        </button>
                        <button class="breadcrumb-btn" onclick="NavigationEnhancements.showNavigationHistory()" title="History">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            // Track navigation
            this.trackNavigation(tab, subscreen);
        },

        getTabDisplayName(tab) {
            const displayNames = {
                'overview': 'Overview',
                'squad': 'Squad',
                'tactics': 'Tactics',
                'training': 'Training',
                'transfers': 'Transfers',
                'finances': 'Finances',
                'fixtures': 'Fixtures'
            };
            return displayNames[tab] || tab.charAt(0).toUpperCase() + tab.slice(1);
        },

        getSubscreenDisplayName(tab, subscreen) {
            const displayNames = {
                'dashboard': 'Dashboard',
                'reports': 'Reports',
                'statistics': 'Statistics',
                'news': 'News',
                'inbox': 'Inbox',
                'first-team': 'First Team',
                'reserves': 'Reserves',
                'youth': 'Youth',
                'staff': 'Staff',
                'dynamics': 'Squad Dynamics'
            };
            return displayNames[subscreen] || subscreen.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        },

        getDefaultSubscreen(tab) {
            const defaults = {
                'overview': 'dashboard',
                'squad': 'first-team',
                'tactics': 'formation',
                'training': 'schedule',
                'transfers': 'transfer-hub',
                'finances': 'overview',
                'fixtures': 'calendar'
            };
            return defaults[tab] || 'dashboard';
        },

        setupQuickAccess() {
            console.log('⚡ Setting up quick access system...');
            
            // Initialize with commonly used subscreens
            this.quickAccessItems = [
                { tab: 'overview', subscreen: 'dashboard', label: 'Dashboard' },
                { tab: 'squad', subscreen: 'first-team', label: 'First Team' },
                { tab: 'tactics', subscreen: 'formation', label: 'Formation' },
                { tab: 'transfers', subscreen: 'transfer-hub', label: 'Transfers' },
                { tab: 'fixtures', subscreen: 'calendar', label: 'Fixtures' }
            ];
            
            // Create quick access panel
            this.createQuickAccessPanel();
            
            console.log('✅ Quick access system ready');
        },

        createQuickAccessPanel() {
            const quickAccessPanel = document.createElement('div');
            quickAccessPanel.id = 'quick-access-panel';
            quickAccessPanel.className = 'quick-access-panel hidden';
            
            quickAccessPanel.innerHTML = `
                <div class="quick-access-header">
                    <span class="panel-title">Quick Access</span>
                    <button class="panel-close" onclick="NavigationEnhancements.toggleQuickAccess()">×</button>
                </div>
                <div class="quick-access-content">
                    <div class="access-section">
                        <div class="section-title">Favorites</div>
                        <div class="favorites-list" id="favorites-list">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                    <div class="access-section">
                        <div class="section-title">Recent</div>
                        <div class="recent-list" id="recent-list">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                    <div class="access-section">
                        <div class="section-title">Quick Actions</div>
                        <div class="quick-actions">
                            <button class="quick-action-btn" onclick="NavigationEnhancements.jumpToNextMatch()">Next Match</button>
                            <button class="quick-action-btn" onclick="NavigationEnhancements.jumpToSquadStatus()">Squad Status</button>
                            <button class="quick-action-btn" onclick="NavigationEnhancements.jumpToTransferHub()">Transfer Hub</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(quickAccessPanel);
        },

        toggleQuickAccess() {
            const panel = document.getElementById('quick-access-panel');
            if (panel) {
                panel.classList.toggle('hidden');
                
                if (!panel.classList.contains('hidden')) {
                    this.updateQuickAccessContent();
                }
            }
        },

        updateQuickAccessContent() {
            this.updateFavoritesList();
            this.updateRecentList();
        },

        updateFavoritesList() {
            const favoritesList = document.getElementById('favorites-list');
            if (!favoritesList) return;
            
            if (this.favoriteSubscreens.size === 0) {
                favoritesList.innerHTML = '<div class="empty-message">No favorites yet</div>';
                return;
            }
            
            let favoritesHTML = '';
            this.favoriteSubscreens.forEach(favorite => {
                const [tab, subscreen] = favorite.split('/');
                favoritesHTML += `
                    <div class="quick-access-item" onclick="navigateToSubscreen('${tab}', '${subscreen}')">
                        <span class="access-label">${this.getTabDisplayName(tab)} › ${this.getSubscreenDisplayName(tab, subscreen)}</span>
                        <button class="remove-favorite" onclick="event.stopPropagation(); NavigationEnhancements.removeFavorite('${tab}', '${subscreen}')">×</button>
                    </div>
                `;
            });
            
            favoritesList.innerHTML = favoritesHTML;
        },

        updateRecentList() {
            const recentList = document.getElementById('recent-list');
            if (!recentList) return;
            
            const recentItems = this.navigationHistory.slice(-5).reverse();
            
            if (recentItems.length === 0) {
                recentList.innerHTML = '<div class="empty-message">No recent navigation</div>';
                return;
            }
            
            let recentHTML = '';
            recentItems.forEach(item => {
                recentHTML += `
                    <div class="quick-access-item" onclick="navigateToSubscreen('${item.tab}', '${item.subscreen}')">
                        <span class="access-label">${this.getTabDisplayName(item.tab)} › ${this.getSubscreenDisplayName(item.tab, item.subscreen)}</span>
                        <span class="access-time">${this.formatTime(item.timestamp)}</span>
                    </div>
                `;
            });
            
            recentList.innerHTML = recentHTML;
        },

        setupNavigationHistory() {
            console.log('📚 Setting up navigation history tracking...');
            
            // Track navigation in subscreen system
            if (window.SubscreenSystem) {
                const originalNavigate = window.SubscreenSystem.navigateToSubscreen;
                
                window.SubscreenSystem.navigateToSubscreen = function(tab, subscreen) {
                    NavigationEnhancements.trackNavigation(tab, subscreen);
                    NavigationEnhancements.updateBreadcrumb(tab, subscreen);
                    
                    return originalNavigate.call(this, tab, subscreen);
                };
            }
            
            console.log('✅ Navigation history tracking active');
        },

        trackNavigation(tab, subscreen) {
            const navigationItem = {
                tab: tab,
                subscreen: subscreen,
                timestamp: Date.now(),
                url: `${tab}/${subscreen}`
            };
            
            // Add to history (avoid duplicates of consecutive same navigation)
            const lastItem = this.navigationHistory[this.navigationHistory.length - 1];
            if (!lastItem || lastItem.tab !== tab || lastItem.subscreen !== subscreen) {
                this.navigationHistory.push(navigationItem);
                
                // Keep only last 20 items
                if (this.navigationHistory.length > 20) {
                    this.navigationHistory = this.navigationHistory.slice(-20);
                }
            }
        },

        setupKeyboardNavigation() {
            console.log('⌨️ Setting up keyboard navigation shortcuts...');
            
            document.addEventListener('keydown', (e) => {
                // Only handle shortcuts when not in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    return;
                }
                
                // Ctrl/Cmd + number keys for tab switching
                if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '7') {
                    e.preventDefault();
                    const tabIndex = parseInt(e.key) - 1;
                    const tabs = ['overview', 'squad', 'tactics', 'training', 'transfers', 'finances', 'fixtures'];
                    if (tabs[tabIndex]) {
                        window.navigateToSubscreen(tabs[tabIndex], this.getDefaultSubscreen(tabs[tabIndex]));
                    }
                }
                
                // Alt + arrow keys for subscreen navigation
                if (e.altKey) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.navigateToPreviousSubscreen();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.navigateToNextSubscreen();
                    }
                }
                
                // Ctrl/Cmd + K for quick search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.showQuickSearch();
                }
                
                // Escape to close panels
                if (e.key === 'Escape') {
                    this.closeAllPanels();
                }
            });
            
            console.log('✅ Keyboard navigation shortcuts active');
        },

        navigateToPreviousSubscreen() {
            const currentSubmenu = document.querySelector('.nav-submenu.active');
            if (!currentSubmenu) return;
            
            const currentActive = currentSubmenu.querySelector('.submenu-item.active');
            const allItems = Array.from(currentSubmenu.querySelectorAll('.submenu-item'));
            const currentIndex = allItems.indexOf(currentActive);
            
            if (currentIndex > 0) {
                const previousItem = allItems[currentIndex - 1];
                const subscreen = previousItem.getAttribute('data-subscreen');
                if (subscreen) {
                    const tab = currentSubmenu.id.replace('-submenu', '');
                    window.navigateToSubscreen(tab, subscreen);
                }
            }
        },

        navigateToNextSubscreen() {
            const currentSubmenu = document.querySelector('.nav-submenu.active');
            if (!currentSubmenu) return;
            
            const currentActive = currentSubmenu.querySelector('.submenu-item.active');
            const allItems = Array.from(currentSubmenu.querySelectorAll('.submenu-item'));
            const currentIndex = allItems.indexOf(currentActive);
            
            if (currentIndex < allItems.length - 1) {
                const nextItem = allItems[currentIndex + 1];
                const subscreen = nextItem.getAttribute('data-subscreen');
                if (subscreen) {
                    const tab = currentSubmenu.id.replace('-submenu', '');
                    window.navigateToSubscreen(tab, subscreen);
                }
            }
        },

        setupContextualMenus() {
            console.log('📋 Setting up contextual right-click menus...');
            
            document.addEventListener('contextmenu', (e) => {
                // Handle right-click on submenu items
                if (e.target.classList.contains('submenu-item')) {
                    e.preventDefault();
                    this.showSubmenuContextMenu(e, e.target);
                }
                
                // Handle right-click on components
                if (e.target.closest('.subscreen-component')) {
                    e.preventDefault();
                    this.showComponentContextMenu(e, e.target.closest('.subscreen-component'));
                }
            });
            
            console.log('✅ Contextual menus active');
        },

        showSubmenuContextMenu(event, submenuItem) {
            const contextMenu = this.createContextMenu([
                { label: 'Open in New View', action: () => console.log('Open in new view') },
                { label: 'Add to Favorites', action: () => this.addToFavorites(submenuItem) },
                { label: 'Copy Link', action: () => this.copySubscreenLink(submenuItem) }
            ]);
            
            this.positionContextMenu(contextMenu, event.clientX, event.clientY);
        },

        showComponentContextMenu(event, component) {
            const contextMenu = this.createContextMenu([
                { label: 'Expand Component', action: () => this.expandComponent(component) },
                { label: 'Duplicate Component', action: () => this.duplicateComponent(component) },
                { label: 'Export Component', action: () => this.exportComponent(component) },
                { label: 'Component Settings', action: () => this.showComponentSettings(component) }
            ]);
            
            this.positionContextMenu(contextMenu, event.clientX, event.clientY);
        },

        createContextMenu(items) {
            // Remove existing context menu
            const existingMenu = document.getElementById('navigation-context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }
            
            const contextMenu = document.createElement('div');
            contextMenu.id = 'navigation-context-menu';
            contextMenu.className = 'context-menu';
            
            let menuHTML = '';
            items.forEach(item => {
                menuHTML += `
                    <div class="context-menu-item" onclick="this.action()">
                        ${item.label}
                    </div>
                `;
            });
            
            contextMenu.innerHTML = menuHTML;
            
            // Add event listeners for actions
            const menuItems = contextMenu.querySelectorAll('.context-menu-item');
            menuItems.forEach((menuItem, index) => {
                menuItem.addEventListener('click', () => {
                    items[index].action();
                    contextMenu.remove();
                });
            });
            
            document.body.appendChild(contextMenu);
            
            // Close menu on outside click
            setTimeout(() => {
                document.addEventListener('click', function closeMenu(e) {
                    if (!contextMenu.contains(e.target)) {
                        contextMenu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }, 0);
            
            return contextMenu;
        },

        positionContextMenu(menu, x, y) {
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            
            // Adjust if menu goes off screen
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
            }
        },

        setupSearchNavigation() {
            console.log('🔍 Setting up navigation search system...');
            
            // Create search overlay
            this.createSearchOverlay();
            
            console.log('✅ Navigation search system ready');
        },

        createSearchOverlay() {
            const searchOverlay = document.createElement('div');
            searchOverlay.id = 'navigation-search-overlay';
            searchOverlay.className = 'search-overlay hidden';
            
            searchOverlay.innerHTML = `
                <div class="search-container">
                    <div class="search-header">
                        <input type="text" class="search-input" placeholder="Search screens, actions, players..." 
                               oninput="NavigationEnhancements.handleSearchInput(this.value)">
                        <button class="search-close" onclick="NavigationEnhancements.hideQuickSearch()">×</button>
                    </div>
                    <div class="search-results" id="search-results">
                        <!-- Results populated dynamically -->
                    </div>
                    <div class="search-shortcuts">
                        <div class="shortcut-hint">
                            <kbd>↑↓</kbd> Navigate • <kbd>Enter</kbd> Select • <kbd>Esc</kbd> Close
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(searchOverlay);
        },

        showQuickSearch() {
            const searchOverlay = document.getElementById('navigation-search-overlay');
            if (searchOverlay) {
                searchOverlay.classList.remove('hidden');
                const searchInput = searchOverlay.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                    this.populateInitialSearchResults();
                }
            }
        },

        hideQuickSearch() {
            const searchOverlay = document.getElementById('navigation-search-overlay');
            if (searchOverlay) {
                searchOverlay.classList.add('hidden');
            }
        },

        populateInitialSearchResults() {
            const searchResults = document.getElementById('search-results');
            if (!searchResults) return;
            
            // Show popular subscreens initially
            const popularItems = [
                { tab: 'overview', subscreen: 'dashboard', label: 'Overview Dashboard', category: 'Quick Access' },
                { tab: 'squad', subscreen: 'first-team', label: 'First Team Squad', category: 'Squad' },
                { tab: 'tactics', subscreen: 'formation', label: 'Formation & Tactics', category: 'Tactics' },
                { tab: 'transfers', subscreen: 'transfer-hub', label: 'Transfer Hub', category: 'Transfers' },
                { tab: 'finances', subscreen: 'overview', label: 'Financial Overview', category: 'Finances' }
            ];
            
            let resultsHTML = '';
            popularItems.forEach(item => {
                resultsHTML += `
                    <div class="search-result-item" onclick="NavigationEnhancements.selectSearchResult('${item.tab}', '${item.subscreen}')">
                        <div class="result-main">
                            <span class="result-title">${item.label}</span>
                            <span class="result-category">${item.category}</span>
                        </div>
                        <div class="result-path">${this.getTabDisplayName(item.tab)} › ${this.getSubscreenDisplayName(item.tab, item.subscreen)}</div>
                    </div>
                `;
            });
            
            searchResults.innerHTML = resultsHTML;
        },

        handleSearchInput(query) {
            if (query.length < 2) {
                this.populateInitialSearchResults();
                return;
            }
            
            const results = this.searchSubscreens(query);
            this.displaySearchResults(results);
        },

        searchSubscreens(query) {
            const results = [];
            const queryLower = query.toLowerCase();
            
            // Search through all available subscreens
            if (window.SubscreenSystem && window.SubscreenSystem.subscreenDefinitions) {
                Object.entries(window.SubscreenSystem.subscreenDefinitions).forEach(([tab, tabDef]) => {
                    Object.entries(tabDef).forEach(([subscreen, subscreenDef]) => {
                        const tabName = this.getTabDisplayName(tab).toLowerCase();
                        const subscreenName = this.getSubscreenDisplayName(tab, subscreen).toLowerCase();
                        const title = subscreenDef.title?.toLowerCase() || '';
                        
                        if (tabName.includes(queryLower) || 
                            subscreenName.includes(queryLower) || 
                            title.includes(queryLower)) {
                            results.push({
                                tab: tab,
                                subscreen: subscreen,
                                title: subscreenDef.title || subscreenName,
                                relevance: this.calculateSearchRelevance(query, tabName, subscreenName, title)
                            });
                        }
                    });
                });
            }
            
            // Sort by relevance
            results.sort((a, b) => b.relevance - a.relevance);
            
            return results.slice(0, 8); // Limit to top 8 results
        },

        calculateSearchRelevance(query, tabName, subscreenName, title) {
            const queryLower = query.toLowerCase();
            let relevance = 0;
            
            if (subscreenName === queryLower) relevance += 100;
            else if (subscreenName.startsWith(queryLower)) relevance += 80;
            else if (subscreenName.includes(queryLower)) relevance += 60;
            
            if (tabName === queryLower) relevance += 50;
            else if (tabName.includes(queryLower)) relevance += 30;
            
            if (title.includes(queryLower)) relevance += 20;
            
            return relevance;
        },

        displaySearchResults(results) {
            const searchResults = document.getElementById('search-results');
            if (!searchResults) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No results found</div>';
                return;
            }
            
            let resultsHTML = '';
            results.forEach((result, index) => {
                resultsHTML += `
                    <div class="search-result-item ${index === 0 ? 'selected' : ''}" 
                         onclick="NavigationEnhancements.selectSearchResult('${result.tab}', '${result.subscreen}')">
                        <div class="result-main">
                            <span class="result-title">${result.title}</span>
                            <span class="result-category">${this.getTabDisplayName(result.tab)}</span>
                        </div>
                        <div class="result-path">${this.getTabDisplayName(result.tab)} › ${this.getSubscreenDisplayName(result.tab, result.subscreen)}</div>
                    </div>
                `;
            });
            
            searchResults.innerHTML = resultsHTML;
        },

        selectSearchResult(tab, subscreen) {
            this.hideQuickSearch();
            window.navigateToSubscreen(tab, subscreen);
        },

        // Favorite management
        toggleFavorite(tab, subscreen) {
            const favoriteKey = `${tab}/${subscreen}`;
            
            if (this.favoriteSubscreens.has(favoriteKey)) {
                this.favoriteSubscreens.delete(favoriteKey);
                console.log(`💔 Removed ${favoriteKey} from favorites`);
            } else {
                this.favoriteSubscreens.add(favoriteKey);
                console.log(`💖 Added ${favoriteKey} to favorites`);
            }
            
            // Update button appearance
            this.updateFavoriteButton(tab, subscreen);
            
            // Save to localStorage
            this.saveFavoritesToStorage();
        },

        updateFavoriteButton(tab, subscreen) {
            const favoriteKey = `${tab}/${subscreen}`;
            const breadcrumbContainer = document.getElementById('breadcrumb-navigation');
            if (breadcrumbContainer) {
                const favoriteBtn = breadcrumbContainer.querySelector('[title="Add to Favorites"]');
                if (favoriteBtn) {
                    const isFavorite = this.favoriteSubscreens.has(favoriteKey);
                    favoriteBtn.style.color = isFavorite ? '#ff6b35' : '';
                    favoriteBtn.title = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
                }
            }
        },

        saveFavoritesToStorage() {
            try {
                localStorage.setItem('fm-ui-favorites', JSON.stringify(Array.from(this.favoriteSubscreens)));
            } catch (e) {
                console.warn('Could not save favorites to localStorage');
            }
        },

        loadFavoritesFromStorage() {
            try {
                const saved = localStorage.getItem('fm-ui-favorites');
                if (saved) {
                    const favorites = JSON.parse(saved);
                    this.favoriteSubscreens = new Set(favorites);
                }
            } catch (e) {
                console.warn('Could not load favorites from localStorage');
            }
        },

        // Quick jump functions
        jumpToNextMatch() {
            window.navigateToSubscreen('overview', 'dashboard');
        },

        jumpToSquadStatus() {
            window.navigateToSubscreen('squad', 'first-team');
        },

        jumpToTransferHub() {
            window.navigateToSubscreen('transfers', 'transfer-hub');
        },

        // Utility functions
        formatTime(timestamp) {
            const diff = Date.now() - timestamp;
            const minutes = Math.floor(diff / 60000);
            
            if (minutes < 1) return 'now';
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        },

        closeAllPanels() {
            // Close quick access
            const quickAccess = document.getElementById('quick-access-panel');
            if (quickAccess) quickAccess.classList.add('hidden');
            
            // Close search
            this.hideQuickSearch();
            
            // Close context menus
            const contextMenu = document.getElementById('navigation-context-menu');
            if (contextMenu) contextMenu.remove();
        }
    };

    // Add navigation enhancement styles
    const navigationStyles = `
        /* Navigation Enhancement Styles */
        
        /* Breadcrumb Navigation - DISABLED for streamlined UX */
        
        /* Quick Access Panel */
        .quick-access-panel {
            position: fixed;
            top: 120px;
            right: 20px;
            width: 280px;
            background: var(--neutral-200);
            border: 1px solid var(--neutral-400);
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        .quick-access-panel.hidden {
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
        }
        
        .quick-access-header {
            background: var(--neutral-100);
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .panel-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-400);
        }
        
        .panel-close {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            font-size: 16px;
        }
        
        .quick-access-content {
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .access-section {
            margin-bottom: 16px;
        }
        
        .section-title {
            font-size: 10px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        
        .quick-access-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s ease;
            font-size: 11px;
            margin: 2px 0;
        }
        
        .quick-access-item:hover {
            background: rgba(0, 148, 204, 0.1);
        }
        
        .access-label {
            color: rgba(255, 255, 255, 0.9);
        }
        
        .access-time {
            color: rgba(255, 255, 255, 0.5);
            font-size: 9px;
        }
        
        .remove-favorite {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            font-size: 12px;
            padding: 0;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .remove-favorite:hover {
            color: #ff4757;
        }
        
        .quick-actions {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .quick-action-btn {
            background: rgba(0, 148, 204, 0.1);
            border: 1px solid rgba(0, 148, 204, 0.3);
            color: var(--primary-400);
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.2s ease;
        }
        
        .quick-action-btn:hover {
            background: rgba(0, 148, 204, 0.2);
            border-color: var(--primary-400);
        }
        
        /* Search Overlay */
        .search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 20vh;
            transition: opacity 0.2s ease;
        }
        
        .search-overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .search-container {
            background: var(--neutral-200);
            border: 1px solid var(--neutral-400);
            border-radius: 8px;
            width: 100%;
            max-width: 600px;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
        }
        
        .search-header {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .search-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--primary-400);
            box-shadow: 0 0 0 2px rgba(0, 148, 204, 0.2);
        }
        
        .search-close {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            font-size: 18px;
            padding: 4px;
        }
        
        .search-results {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .search-result-item {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            cursor: pointer;
            transition: background 0.2s ease;
        }
        
        .search-result-item:hover,
        .search-result-item.selected {
            background: rgba(0, 148, 204, 0.1);
        }
        
        .result-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        
        .result-title {
            color: white;
            font-weight: 500;
            font-size: 12px;
        }
        
        .result-category {
            color: var(--primary-400);
            font-size: 10px;
            font-weight: 600;
        }
        
        .result-path {
            color: rgba(255, 255, 255, 0.6);
            font-size: 10px;
        }
        
        .search-shortcuts {
            padding: 8px 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            background: rgba(0, 0, 0, 0.2);
        }
        
        .shortcut-hint {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            text-align: center;
        }
        
        kbd {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            padding: 2px 4px;
            font-size: 8px;
            font-family: monospace;
        }
        
        /* Context Menu */
        .context-menu {
            position: fixed;
            background: var(--neutral-300);
            border: 1px solid var(--neutral-400);
            border-radius: 4px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            min-width: 150px;
        }
        
        .context-menu-item {
            padding: 8px 12px;
            color: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            font-size: 11px;
            transition: background 0.2s ease;
        }
        
        .context-menu-item:hover {
            background: rgba(0, 148, 204, 0.2);
            color: white;
        }
        
        .context-menu-item:first-child {
            border-radius: 4px 4px 0 0;
        }
        
        .context-menu-item:last-child {
            border-radius: 0 0 4px 4px;
        }
        
        /* Adjust main content without breadcrumb */
        .app-container {
            padding-top: 108px !important; /* 40px header + 48px nav + 20px margin */
        }
        
        /* Empty state messages */
        .empty-message, .no-results {
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
            padding: 16px;
            font-size: 11px;
        }
    `;
    
    // Inject styles
    const style = document.createElement('style');
    style.id = 'navigation-enhancement-styles';
    style.textContent = navigationStyles;
    document.head.appendChild(style);

    // Initialize when ready
    if (document.readyState === 'complete') {
        setTimeout(() => {
            NavigationEnhancements.loadFavoritesFromStorage();
            NavigationEnhancements.init();
        }, 900);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                NavigationEnhancements.loadFavoritesFromStorage();
                NavigationEnhancements.init();
            }, 900);
        });
    }

    // Make available globally
    window.NavigationEnhancements = NavigationEnhancements;

})();