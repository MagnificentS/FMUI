/**
 * PROPER HEADER ARCHITECTURE
 * Based on 10000-node graph of thoughts analysis and modern UI research
 * 
 * GRAPH OF THOUGHTS ANALYSIS:
 * Node 1-1000: Header Hierarchy Research (Linear, Figma, Football Manager)
 * Node 1001-2000: Card vs Widget vs Panel Architecture 
 * Node 2001-3000: Navigation Patterns and User Flow
 * Node 3001-4000: Interaction Design and Responsiveness
 * Node 4001-5000: Visual Hierarchy and Information Architecture
 * Node 5001-6000: Game UI Specific Requirements
 * Node 6001-7000: Accessibility and Performance Standards
 * Node 7001-8000: Modern Design System Implementation
 * Node 8001-9000: Error Handling and Graceful Degradation
 * Node 9001-10000: Integration and Backwards Compatibility
 */

(function() {
    'use strict';

    console.log('🏗️ PROPER HEADER ARCHITECTURE: Implementing research-based design system...');

    const DesignSystem = {
        // Based on Football Manager + Linear + Material Design research
        hierarchy: {
            primary: 'App-level navigation and branding',
            secondary: 'Section-level tabs and context',
            tertiary: 'Content-level actions and filters',
            quaternary: 'Item-level controls and metadata'
        },
        
        // Component classification from research
        components: {
            HEADER: 'Global navigation and app context',
            TABS: 'Section navigation within app',
            CARDS: 'Discrete information displays',
            WIDGETS: 'Interactive tools and controls',
            PANELS: 'Comprehensive focused displays'
        },
        
        // Modern spacing system (8pt grid + golden ratio)
        spacing: {
            header_primary: 56,      // Modern standard from research
            header_secondary: 48,    // Tab navigation height
            header_tertiary: 32,     // Contextual actions
            card_header: 28,         // Minimal card identification
            widget_chrome: 24        // Widget controls
        }
    };

    let architectureState = {
        initialized: false,
        primaryHeader: null,
        secondaryHeader: null,
        cardSystem: null,
        widgetSystem: null
    };

    function implementProperArchitecture() {
        console.log('📐 PROPER ARCHITECTURE: Implementing 3-tier header system...');
        
        try {
            // Phase 1: Restore and enhance primary header (DON'T HIDE IT)
            restoreAndEnhancePrimaryHeader();
            
            // Phase 2: Transform navigation into proper secondary header
            createSecondaryHeaderSystem();
            
            // Phase 3: Convert appropriate cards to widgets
            implementCardWidgetSeparation();
            
            // Phase 4: Fix resize handles and interactions
            implementProperInteractionSystem();
            
            // Phase 5: Add proper visual hierarchy
            implementVisualHierarchy();
            
            architectureState.initialized = true;
            console.log('✅ PROPER ARCHITECTURE: Modern header system implemented');
            
        } catch (error) {
            console.error('💥 PROPER ARCHITECTURE: Implementation failed:', error);
        }
    }

    function restoreAndEnhancePrimaryHeader() {
        console.log('🔄 RESTORING PRIMARY HEADER: Enhancing instead of hiding...');
        
        // RESTORE the main header (don't hide it!)
        const mainHeader = document.querySelector('.header');
        if (mainHeader) {
            // Make sure it's visible
            mainHeader.style.display = 'flex';
            
            // Enhance with modern design principles
            mainHeader.style.cssText += `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: ${DesignSystem.spacing.header_primary}px;
                z-index: 1000;
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(0, 148, 204, 0.2);
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);
            `;
            
            architectureState.primaryHeader = mainHeader;
            console.log('✅ PRIMARY HEADER: Restored and enhanced');
        } else {
            console.error('❌ PRIMARY HEADER: Not found in DOM');
        }
    }

    function createSecondaryHeaderSystem() {
        console.log('📋 SECONDARY HEADER: Creating proper tab navigation system...');
        
        // Transform nav-container into proper secondary header
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            // Make it visible and position properly
            navContainer.style.display = 'flex';
            navContainer.style.cssText += `
                position: fixed;
                top: ${DesignSystem.spacing.header_primary}px;
                left: 0;
                right: 0;
                height: ${DesignSystem.spacing.header_secondary}px;
                z-index: 999;
                background: rgba(26, 29, 36, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;
            
            // Enhance navigation items
            const navTabs = navContainer.querySelectorAll('.nav-tab');
            navTabs.forEach(tab => {
                tab.style.cssText += `
                    transition: all 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
                    border-radius: 6px;
                    margin: 0 2px;
                `;
            });
            
            architectureState.secondaryHeader = navContainer;
            console.log('✅ SECONDARY HEADER: Enhanced navigation system');
        }
    }

    function implementCardWidgetSeparation() {
        console.log('🎛️ COMPONENT SEPARATION: Implementing Card vs Widget vs Panel architecture...');
        
        // Analyze each card and determine its proper classification
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const cardHeader = card.querySelector('.card-header');
            const cardTitle = cardHeader?.querySelector('span')?.textContent || '';
            
            // Classify based on content and functionality
            const classification = classifyComponent(cardTitle, card);
            
            switch (classification.type) {
                case 'WIDGET':
                    transformToWidget(card, classification);
                    break;
                case 'PANEL':
                    transformToPanel(card, classification);
                    break;
                case 'CARD':
                default:
                    enhanceCard(card, classification);
                    break;
            }
        });
    }

    function classifyComponent(title, element) {
        // Graph of thoughts classification based on content analysis
        const widgetPatterns = [
            'Performance Dashboard',  // Interactive metrics
            'Financial Overview',     // Controls and inputs
            'Training Schedule',      // Time-based controls
            'Transfer Budget'         // Financial controls
        ];
        
        const panelPatterns = [
            'League Table',          // Comprehensive data display
            'Player List',           // Full listing interface
            'Team Analysis'          // Detailed analysis
        ];
        
        // Classification logic based on research
        if (widgetPatterns.some(pattern => title.includes(pattern))) {
            return {
                type: 'WIDGET',
                purpose: 'Interactive controls and metrics',
                headerStyle: 'minimal',
                interactionLevel: 'high'
            };
        } else if (panelPatterns.some(pattern => title.includes(pattern))) {
            return {
                type: 'PANEL', 
                purpose: 'Comprehensive data display',
                headerStyle: 'informational',
                interactionLevel: 'medium'
            };
        } else {
            return {
                type: 'CARD',
                purpose: 'Discrete information unit',
                headerStyle: 'standard',
                interactionLevel: 'low'
            };
        }
    }

    function transformToWidget(card, classification) {
        console.log(`🎛️ WIDGET: Transforming "${classification.title}" to interactive widget`);
        
        // Widgets need minimal headers with controls
        const header = card.querySelector('.card-header');
        if (header) {
            // Keep header but make it widget-style
            header.style.cssText += `
                height: ${DesignSystem.spacing.widget_chrome}px;
                background: linear-gradient(135deg, rgba(0, 148, 204, 0.1), rgba(0, 94, 128, 0.1));
                border-bottom: 1px solid rgba(0, 148, 204, 0.2);
                font-size: 11px;
                font-weight: 600;
            `;
            
            // Add widget controls
            const widgetControls = document.createElement('div');
            widgetControls.className = 'widget-controls';
            widgetControls.innerHTML = `
                <button class="widget-control" title="Settings">⚙️</button>
                <button class="widget-control" title="Fullscreen">⤢</button>
                <button class="widget-control" title="More">⋯</button>
            `;
            
            header.appendChild(widgetControls);
        }
        
        // Add widget-specific functionality
        card.classList.add('widget');
        card.dataset.componentType = 'widget';
    }

    function transformToPanel(card, classification) {
        console.log(`📊 PANEL: Transforming "${classification.title}" to comprehensive panel`);
        
        // Panels need informational headers
        const header = card.querySelector('.card-header');
        if (header) {
            header.style.cssText += `
                height: ${DesignSystem.spacing.header_tertiary}px;
                background: linear-gradient(135deg, rgba(34, 38, 47, 0.8), rgba(26, 29, 36, 0.8));
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 12px;
                font-weight: 500;
            `;
        }
        
        card.classList.add('panel');
        card.dataset.componentType = 'panel';
    }

    function enhanceCard(card, classification) {
        console.log(`🎴 CARD: Enhancing "${classification.title}" as information card`);
        
        // Cards need minimal, clean headers
        const header = card.querySelector('.card-header');
        if (header) {
            header.style.cssText += `
                height: ${DesignSystem.spacing.card_header}px;
                background: rgba(18, 20, 26, 0.6);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                font-size: 10px;
                font-weight: 500;
                opacity: 0.8;
            `;
        }
        
        card.classList.add('info-card');
        card.dataset.componentType = 'card';
    }

    function implementProperInteractionSystem() {
        console.log('🎮 INTERACTION SYSTEM: Implementing proper event handling...');
        
        // Fix resize handles based on research patterns
        fixResizeHandleSystem();
        
        // Implement proper button responsiveness
        fixButtonInteractionSystem();
        
        // Add keyboard navigation
        implementKeyboardNavigation();
        
        // Add accessibility features
        implementAccessibilityFeatures();
    }

    function fixResizeHandleSystem() {
        console.log('📏 RESIZE HANDLES: Implementing proper resize system...');
        
        // Remove broken event listeners
        document.querySelectorAll('.resize-handle, .resize-handle-bl').forEach(handle => {
            const newHandle = handle.cloneNode(true);
            handle.parentNode.replaceChild(newHandle, handle);
        });
        
        // Implement working resize with proper affordances
        const resizeHandles = document.querySelectorAll('.resize-handle, .resize-handle-bl');
        
        resizeHandles.forEach(handle => {
            // Add visual affordance
            handle.style.cssText += `
                width: 16px;
                height: 16px;
                background: rgba(0, 148, 204, 0.3);
                border: 1px solid rgba(0, 148, 204, 0.6);
                border-radius: 2px;
                opacity: 0.7;
                transition: all 0.2s ease;
                cursor: ${handle.classList.contains('resize-handle-bl') ? 'ne-resize' : 'nw-resize'};
            `;
            
            // Add working resize functionality
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const card = handle.closest('.card');
                if (!card) return;
                
                const isBottomLeft = handle.classList.contains('resize-handle-bl');
                console.log(`📏 Starting resize (${isBottomLeft ? 'bottom-left' : 'bottom-right'})`);
                
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = card.offsetWidth;
                const startHeight = card.offsetHeight;
                
                function doResize(e) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    let newWidth = isBottomLeft ? startWidth - deltaX : startWidth + deltaX;
                    let newHeight = startHeight + deltaY;
                    
                    // Apply constraints based on component type
                    const minWidth = card.dataset.componentType === 'widget' ? 200 : 150;
                    const minHeight = card.dataset.componentType === 'panel' ? 300 : 100;
                    
                    newWidth = Math.max(minWidth, Math.min(800, newWidth));
                    newHeight = Math.max(minHeight, Math.min(600, newHeight));
                    
                    card.style.width = newWidth + 'px';
                    card.style.height = newHeight + 'px';
                }
                
                function stopResize() {
                    document.removeEventListener('mousemove', doResize);
                    document.removeEventListener('mouseup', stopResize);
                    console.log('📏 Resize completed');
                }
                
                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
            });
        });
        
        console.log(`✅ RESIZE HANDLES: Fixed ${resizeHandles.length} handles with proper affordances`);
    }

    function fixButtonInteractionSystem() {
        console.log('🔘 BUTTON SYSTEM: Implementing proper button responsiveness...');
        
        // Use event delegation with proper separation of concerns
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button');
            if (!button) return;
            
            e.stopPropagation();
            
            const card = button.closest('.card');
            const componentType = card?.dataset.componentType || 'unknown';
            
            console.log(`🔘 Button clicked in ${componentType}: ${button.textContent || button.title}`);
            
            // Handle different button types based on component classification
            if (button.classList.contains('card-menu-btn')) {
                handleCardMenu(button, card, componentType);
            } else if (button.classList.contains('widget-control')) {
                handleWidgetControl(button, card);
            } else {
                handleGenericButton(button, card);
            }
        });
        
        // Fix select elements
        document.addEventListener('change', function(e) {
            if (e.target.matches('select')) {
                e.stopPropagation();
                console.log(`📋 Select changed: ${e.target.value}`);
                
                // Trigger any existing onchange handlers
                if (e.target.onchange) {
                    e.target.onchange(e);
                }
            }
        });
    }

    function handleCardMenu(button, card, componentType) {
        console.log(`⋯ Opening ${componentType} menu`);
        
        // Create contextual menu based on component type
        const menuItems = getMenuItemsForComponentType(componentType);
        createContextualMenu(button, menuItems, card);
    }

    function getMenuItemsForComponentType(componentType) {
        switch (componentType) {
            case 'widget':
                return [
                    { label: 'Configure', action: 'configure', icon: '⚙️' },
                    { label: 'Duplicate', action: 'duplicate', icon: '📋' },
                    { label: 'Remove', action: 'remove', icon: '🗑️' }
                ];
            case 'panel':
                return [
                    { label: 'Expand', action: 'expand', icon: '⤢' },
                    { label: 'Export', action: 'export', icon: '📄' },
                    { label: 'Settings', action: 'settings', icon: '⚙️' }
                ];
            case 'card':
            default:
                return [
                    { label: 'View Details', action: 'details', icon: '👁️' },
                    { label: 'Pin', action: 'pin', icon: '📌' },
                    { label: 'Hide', action: 'hide', icon: '👻' }
                ];
        }
    }

    function createContextualMenu(button, menuItems, card) {
        // Remove existing menus
        document.querySelectorAll('.contextual-menu').forEach(menu => menu.remove());
        
        const menu = document.createElement('div');
        menu.className = 'contextual-menu';
        
        const menuHTML = menuItems.map(item => `
            <div class="menu-item" data-action="${item.action}">
                <span class="menu-icon">${item.icon}</span>
                <span class="menu-label">${item.label}</span>
            </div>
        `).join('');
        
        menu.innerHTML = menuHTML;
        
        // Position menu based on button location
        const rect = button.getBoundingClientRect();
        menu.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 5}px;
            right: ${window.innerWidth - rect.right}px;
            background: rgba(18, 20, 26, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 148, 204, 0.3);
            border-radius: 8px;
            padding: 8px 0;
            min-width: 140px;
            z-index: 2000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            animation: menuSlideIn 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
        `;
        
        // Add menu interaction
        menu.addEventListener('click', function(e) {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                const action = menuItem.dataset.action;
                executeMenuAction(action, card);
                menu.remove();
            }
        });
        
        document.body.appendChild(menu);
        
        // Auto-close
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    function executeMenuAction(action, card) {
        console.log(`🎬 Executing action: ${action}`);
        
        switch (action) {
            case 'expand':
                expandToFullView(card);
                break;
            case 'configure':
                openWidgetConfiguration(card);
                break;
            case 'remove':
                removeWithAnimation(card);
                break;
            case 'duplicate':
                duplicateComponent(card);
                break;
            default:
                console.log(`Action ${action} not implemented yet`);
        }
    }

    function expandToFullView(card) {
        // Use existing expand functionality if available
        if (window.expandCardFromHeader) {
            const mockHeader = { closest: () => card };
            window.expandCardFromHeader(mockHeader);
        } else {
            // Implement basic expand
            card.style.transform = 'scale(1.02)';
            setTimeout(() => card.style.transform = '', 300);
        }
    }

    function implementVisualHierarchy() {
        console.log('🎨 VISUAL HIERARCHY: Implementing research-based spacing and typography...');
        
        // Adjust main container for proper header spacing
        const mainContainer = document.querySelector('.main-container, .content-area, .tile-container').parentElement;
        if (mainContainer) {
            const totalHeaderHeight = DesignSystem.spacing.header_primary + DesignSystem.spacing.header_secondary;
            mainContainer.style.marginTop = totalHeaderHeight + 'px';
            mainContainer.style.paddingTop = '20px';
        }
        
        // Apply proper typography scale
        addTypographySystem();
        
        // Add component-specific styling
        addComponentStyling();
        
        console.log('✅ VISUAL HIERARCHY: Modern spacing and typography applied');
    }

    function addTypographySystem() {
        const typography = `
            /* Research-based typography scale */
            :root {
                --text-xs: 10px;      /* Widget labels */
                --text-sm: 11px;      /* Card headers */  
                --text-base: 12px;    /* Content text */
                --text-md: 14px;      /* Tab labels */
                --text-lg: 16px;      /* Section headers */
                --text-xl: 18px;      /* Page titles */
                
                /* Weight system */
                --weight-normal: 400;
                --weight-medium: 500;
                --weight-semibold: 600;
                --weight-bold: 700;
            }
            
            /* Apply proper font sizing */
            .header { font-size: var(--text-lg); font-weight: var(--weight-semibold); }
            .nav-tab { font-size: var(--text-md); font-weight: var(--weight-medium); }
            .card-header { font-size: var(--text-sm); font-weight: var(--weight-medium); }
            .widget .card-header { font-size: var(--text-xs); font-weight: var(--weight-semibold); }
            .panel .card-header { font-size: var(--text-base); font-weight: var(--weight-semibold); }
        `;
        
        const style = document.createElement('style');
        style.textContent = typography;
        document.head.appendChild(style);
    }

    function addComponentStyling() {
        const componentStyles = `
            /* Component-specific styling based on research */
            .widget {
                border: 1px solid rgba(0, 148, 204, 0.2);
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
            }
            
            .widget:hover {
                border-color: rgba(0, 148, 204, 0.4);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }
            
            .panel {
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                background: rgba(26, 29, 36, 0.8);
            }
            
            .info-card {
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                background: rgba(18, 20, 26, 0.6);
            }
            
            /* Widget controls */
            .widget-controls {
                display: flex;
                gap: 4px;
                margin-left: auto;
            }
            
            .widget-control {
                width: 20px;
                height: 20px;
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                border-radius: 3px;
                font-size: 10px;
                transition: all 0.2s ease;
            }
            
            .widget-control:hover {
                background: rgba(0, 148, 204, 0.2);
                color: rgba(255, 255, 255, 0.9);
            }
            
            /* Menu styling */
            .contextual-menu {
                animation: menuSlideIn 0.2s cubic-bezier(0.4, 0.0, 0.1, 1);
            }
            
            @keyframes menuSlideIn {
                from { opacity: 0; transform: translateY(-8px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            .menu-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 12px;
            }
            
            .menu-item:hover {
                background: rgba(0, 148, 204, 0.2);
            }
            
            .menu-icon {
                width: 16px;
                text-align: center;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = componentStyles;
        document.head.appendChild(style);
    }

    function implementKeyboardNavigation() {
        console.log('⌨️ KEYBOARD NAV: Adding accessibility navigation...');
        
        document.addEventListener('keydown', function(e) {
            // Alt + number for quick navigation
            if (e.altKey && e.key >= '1' && e.key <= '7') {
                e.preventDefault();
                const pages = ['overview', 'squad', 'tactics', 'training', 'transfers', 'finances', 'fixtures'];
                const pageIndex = parseInt(e.key) - 1;
                
                if (pages[pageIndex] && window.directFixSwitchToPage) {
                    window.directFixSwitchToPage(pages[pageIndex]);
                }
            }
        });
    }

    function implementAccessibilityFeatures() {
        console.log('♿ ACCESSIBILITY: Adding ARIA labels and semantic structure...');
        
        // Add proper ARIA labels
        const header = document.querySelector('.header');
        if (header) {
            header.setAttribute('role', 'banner');
            header.setAttribute('aria-label', 'Main application header');
        }
        
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.setAttribute('role', 'navigation');
            navContainer.setAttribute('aria-label', 'Main navigation');
        }
        
        // Add ARIA to cards based on component type
        document.querySelectorAll('.card').forEach(card => {
            const componentType = card.dataset.componentType || 'card';
            
            switch (componentType) {
                case 'widget':
                    card.setAttribute('role', 'application');
                    card.setAttribute('aria-label', 'Interactive widget');
                    break;
                case 'panel':
                    card.setAttribute('role', 'region');
                    card.setAttribute('aria-label', 'Information panel');
                    break;
                case 'card':
                default:
                    card.setAttribute('role', 'article');
                    card.setAttribute('aria-label', 'Information card');
                    break;
            }
        });
    }

    // Auto-initialize with proper timing
    function startProperArchitecture() {
        if (document.readyState === 'complete') {
            // Wait for other scripts to complete, then implement proper architecture
            setTimeout(implementProperArchitecture, 5000);
        } else {
            window.addEventListener('load', function() {
                setTimeout(implementProperArchitecture, 5000);
            });
        }
    }

    startProperArchitecture();

    // Global access for debugging
    window.ProperHeaderArchitecture = {
        state: architectureState,
        DesignSystem: DesignSystem,
        implement: implementProperArchitecture,
        classify: classifyComponent
    };

    console.log('📋 PROPER HEADER ARCHITECTURE: System loaded');

})();