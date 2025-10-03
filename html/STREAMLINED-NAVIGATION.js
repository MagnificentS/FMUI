/**
 * STREAMLINED NAVIGATION FIX
 * Remove breadcrumbs and make submenu items directly clickable
 * Simplify navigation for immediate access to subscreens
 */

(function() {
    'use strict';

    console.log('🎯 STREAMLINED NAVIGATION: Removing breadcrumbs and fixing direct submenu access...');

    const StreamlinedNavigation = {
        init() {
            console.log('🎯 STREAMLINED: Implementing direct submenu navigation...');
            
            this.removeBreadcrumbs();
            this.enhanceSubmenuClicks();
            this.adjustLayoutSpacing();
            this.addDirectNavigationFeedback();
            
            console.log('✅ STREAMLINED NAVIGATION: Direct access implemented');
        },

        removeBreadcrumbs() {
            console.log('🗑️ Removing breadcrumb navigation...');
            
            // Remove breadcrumb element if it exists
            const breadcrumb = document.getElementById('breadcrumb-navigation');
            if (breadcrumb) {
                breadcrumb.remove();
                console.log('✅ Breadcrumb removed');
            }
            
            // Remove breadcrumb CSS
            const breadcrumbStyles = document.getElementById('breadcrumb-styles');
            if (breadcrumbStyles) {
                breadcrumbStyles.remove();
            }
        },

        enhanceSubmenuClicks() {
            console.log('👆 Enhancing submenu click functionality...');
            
            // Make submenu items immediately responsive
            document.querySelectorAll('.submenu-item').forEach(item => {
                const subscreen = item.getAttribute('data-subscreen');
                const submenu = item.closest('.nav-submenu');
                
                if (subscreen && submenu) {
                    const tab = submenu.id.replace('-submenu', '');
                    
                    // Remove any existing handlers
                    item.onclick = null;
                    
                    // Add direct click handler
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log(`🎯 Direct navigation: ${tab} → ${subscreen}`);
                        
                        // Update active state immediately for visual feedback
                        this.updateSubmenuActiveState(submenu, item);
                        
                        // Navigate to subscreen
                        if (window.SubscreenSystem && window.SubscreenSystem.navigateToSubscreen) {
                            window.SubscreenSystem.navigateToSubscreen(tab, subscreen);
                        }
                    });
                    
                    console.log(`👆 Enhanced click: ${tab}/${subscreen}`);
                }
            });
            
            console.log('✅ Submenu clicks enhanced');
        },

        updateSubmenuActiveState(submenu, clickedItem) {
            // Remove active from all items in this submenu
            submenu.querySelectorAll('.submenu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active to clicked item
            clickedItem.classList.add('active');
        },

        adjustLayoutSpacing() {
            console.log('📐 Adjusting layout spacing without breadcrumbs...');
            
            // Add CSS to fix spacing
            const spacingCSS = `
                /* Streamlined Navigation Spacing */
                .app-container {
                    padding-top: 108px !important; /* 40px header + 48px nav + 20px margin */
                }
                
                /* Enhanced submenu visibility and interaction */
                .nav-submenu {
                    background: var(--neutral-200) !important;
                    border-bottom: 1px solid rgba(0, 148, 204, 0.2) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }
                
                .nav-submenu.active {
                    display: flex !important;
                }
                
                .submenu-content {
                    padding: 0 4px !important;
                }
                
                .submenu-item {
                    padding: 6px 14px !important;
                    font-size: 12px !important;
                    font-weight: 500 !important;
                    border-radius: 4px !important;
                    margin: 0 2px !important;
                    transition: all 0.15s ease !important;
                    cursor: pointer !important;
                    user-select: none !important;
                }
                
                .submenu-item:hover {
                    background: rgba(0, 148, 204, 0.2) !important;
                    color: #ffffff !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 6px rgba(0, 148, 204, 0.3) !important;
                }
                
                .submenu-item.active {
                    background: var(--primary-300) !important;
                    color: #ffffff !important;
                    font-weight: 600 !important;
                    box-shadow: 0 2px 4px rgba(0, 148, 204, 0.4) !important;
                }
                
                .submenu-item:active {
                    transform: translateY(0px) !important;
                    background: rgba(0, 148, 204, 0.4) !important;
                }
                
                /* Remove breadcrumb elements */
                #breadcrumb-navigation {
                    display: none !important;
                }
                
                /* Quick access moved to top right */
                .quick-access-panel {
                    top: 95px !important; /* Just below nav */
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'streamlined-navigation-fix';
            style.textContent = spacingCSS;
            document.head.appendChild(style);
            
            console.log('✅ Layout spacing adjusted');
        },

        addDirectNavigationFeedback() {
            console.log('💫 Adding visual feedback for direct navigation...');
            
            // Add CSS for better visual feedback
            const feedbackCSS = `
                /* Direct Navigation Visual Feedback */
                .submenu-item {
                    position: relative;
                    overflow: hidden;
                }
                
                .submenu-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(0, 148, 204, 0.3), transparent);
                    transition: left 0.3s ease;
                }
                
                .submenu-item:hover::before {
                    left: 100%;
                }
                
                /* Loading state for subscreen transitions */
                .tile-container.loading-subscreen {
                    opacity: 0.8;
                    transition: opacity 0.2s ease;
                }
                
                .tile-container.loading-subscreen::after {
                    content: 'Loading...';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 148, 204, 0.9);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 1000;
                    pointer-events: none;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'navigation-feedback-styles';
            style.textContent = feedbackCSS;
            document.head.appendChild(style);
            
            console.log('✅ Visual feedback added');
        },

        // Test direct navigation
        testDirectNavigation() {
            console.log('🧪 Testing direct submenu navigation...');
            
            const testSequence = [
                { tab: 'overview', subscreen: 'reports' },
                { tab: 'overview', subscreen: 'statistics' },
                { tab: 'squad', subscreen: 'youth' },
                { tab: 'squad', subscreen: 'reserves' }
            ];
            
            let testIndex = 0;
            const runNextTest = () => {
                if (testIndex < testSequence.length) {
                    const test = testSequence[testIndex];
                    console.log(`🧪 Test ${testIndex + 1}: ${test.tab}/${test.subscreen}`);
                    
                    if (window.SubscreenSystem) {
                        window.SubscreenSystem.navigateToSubscreen(test.tab, test.subscreen);
                    }
                    
                    testIndex++;
                    setTimeout(runNextTest, 1000);
                } else {
                    console.log('✅ Direct navigation test complete');
                }
            };
            
            runNextTest();
        }
    };

    // Apply streamlined navigation fixes immediately
    if (document.readyState === 'complete') {
        setTimeout(() => StreamlinedNavigation.init(), 200);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => StreamlinedNavigation.init(), 200);
        });
    }

    // Make available for testing
    window.StreamlinedNavigation = StreamlinedNavigation;
    window.testDirectNav = () => StreamlinedNavigation.testDirectNavigation();

})();