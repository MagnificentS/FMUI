/**
 * PHASE 1: CONTAINER INFRASTRUCTURE FIX
 * Fix container positioning to match v19-old.html specs exactly
 * Address critical grid overlaps and positioning issues from issues.txt
 */

(function() {
    'use strict';

    console.log('📐 PHASE 1 CONTAINER FIX: Fixing container positioning to match v19-old.html specs...');

    const ContainerFix = {
        // Exact specs from v19-old.html analysis
        correctSpecs: {
            appContainer: {
                paddingTop: '20px',     // line 353 in v19-old.html
                maxWidth: '1920px',
                margin: '0 auto'
            },
            mainPanel: {
                marginTop: '-10px',     // line 361 in v19-old.html  
                padding: '20px',        // line 358 in v19-old.html
                width: '100%'
            },
            tileContainer: {
                width: '1504px',        // --container-width
                height: '788px',        // --container-height
                columns: 37,            // --grid-columns
                rows: 19,               // --grid-rows
                cellSize: '32px',       // --grid-cell-size
                gap: '8px',             // --grid-gap
                paddingV: '18px',       // --grid-padding-v
                paddingH: '16px'        // --grid-padding-h
            }
        },
        
        init() {
            console.log('📐 CONTAINER FIX: Applying exact v19-old.html container specifications...');
            
            this.fixContainerCSS();
            this.fixHeaderPositioning();
            this.fixGridConfiguration();
            this.validateContainerFix();
            
            console.log('✅ PHASE 1 CONTAINER FIX: Container infrastructure corrected');
        },
        
        fixContainerCSS() {
            console.log('🔧 Fixing container CSS to match v19-old.html exactly...');
            
            // Remove any conflicting styles first
            const existingFix = document.getElementById('container-specs-fix');
            if (existingFix) {
                existingFix.remove();
            }
            
            const exactContainerCSS = `
                /* EXACT v19-old.html Container Specifications */
                :root {
                    --grid-columns: 37;
                    --grid-rows: 19;
                    --grid-cell-size: 32px;
                    --grid-gap: 8px;
                    --grid-padding-v: 18px;
                    --grid-padding-h: 16px;
                    --container-width: 1504px;
                    --container-height: 788px;
                    --border-radius: 8px;
                    --shadow-intensity: 4px;
                }
                
                /* App Container - Match v19-old.html line 345-354 */
                .app-container {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: flex-start !important;
                    height: 100vh !important;
                    position: relative !important;
                    width: 100% !important;
                    max-width: 1920px !important;
                    margin: 0 auto !important;
                    padding-top: 20px !important; /* Exact match line 353 */
                }
                
                /* Main Panel - Match v19-old.html line 356-365 */
                .main-panel {
                    width: 100% !important;
                    padding: 20px !important; /* Exact match line 358 */
                    overflow: hidden !important;
                    position: relative !important;
                    margin-top: -10px !important; /* Exact match line 361 */
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                }
                
                /* Tile Container - Match v19-old.html line 470-487 */
                .tile-container {
                    display: grid !important;
                    grid-template-columns: repeat(var(--grid-columns), var(--grid-cell-size)) !important;
                    grid-template-rows: repeat(var(--grid-rows), var(--grid-cell-size)) !important;
                    gap: var(--grid-gap) !important;
                    padding: var(--grid-padding-v) var(--grid-padding-h) !important;
                    width: var(--container-width) !important;
                    height: var(--container-height) !important;
                    overflow: hidden !important;
                    background: rgba(0, 0, 0, 0.12) !important;
                    border-radius: var(--border-radius) !important;
                    backdrop-filter: blur(13px) !important;
                    position: relative !important;
                    margin: 0 auto !important; /* Exact match line 486 */
                }
                
                /* Header positioning fix */
                .header {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    height: 40px !important;
                    z-index: 100 !important;
                }
                
                .nav-container {
                    position: fixed !important;
                    top: 40px !important;
                    left: 0 !important;
                    right: 0 !important;
                    height: 48px !important;
                    z-index: 99 !important;
                }
            `;
            
            const style = document.createElement('style');
            style.id = 'exact-container-fix';
            style.textContent = exactContainerCSS;
            document.head.appendChild(style);
            
            console.log('✅ Container CSS fixed to match v19-old.html specs');
        },
        
        fixHeaderPositioning() {
            console.log('🔧 Fixing header positioning...');
            
            // Apply positioning directly to elements
            const header = document.querySelector('.header');
            if (header) {
                header.style.position = 'fixed';
                header.style.top = '0';
                header.style.left = '0';
                header.style.right = '0';
                header.style.zIndex = '100';
            }
            
            const nav = document.querySelector('.nav-container');
            if (nav) {
                nav.style.position = 'fixed';
                nav.style.top = '40px';
                nav.style.left = '0';
                nav.style.right = '0';
                nav.style.zIndex = '99';
            }
            
            console.log('✅ Header positioning applied');
        },
        
        fixGridConfiguration() {
            console.log('📏 Fixing grid configuration...');
            
            // Ensure GRID_CONFIG matches exactly
            if (window.GRID_CONFIG) {
                window.GRID_CONFIG.columns = 37;
                window.GRID_CONFIG.rows = 19;
                window.GRID_CONFIG.cellSize = 32;
                window.GRID_CONFIG.gap = 8;
                window.GRID_CONFIG.paddingV = 18;
                window.GRID_CONFIG.paddingH = 16;
                window.GRID_CONFIG.containerWidth = 1504;
                window.GRID_CONFIG.containerHeight = 788;
                
                console.log('✅ GRID_CONFIG updated to match v19-old.html');
            }
        },
        
        validateContainerFix() {
            console.log('🧪 Validating container fix...');
            
            // Check container dimensions
            const container = document.querySelector('.tile-container');
            if (container) {
                const style = window.getComputedStyle(container);
                const width = style.width;
                const height = style.height;
                
                console.log(`📏 Container dimensions: ${width} × ${height}`);
                
                if (width === '1504px' && height === '788px') {
                    console.log('✅ Container dimensions correct');
                } else {
                    console.error(`❌ Container dimensions wrong: expected 1504px × 788px, got ${width} × ${height}`);
                }
            }
            
            // Check app container positioning
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                const style = window.getComputedStyle(appContainer);
                const paddingTop = style.paddingTop;
                
                console.log(`📏 App container padding-top: ${paddingTop}`);
                
                if (paddingTop === '20px') {
                    console.log('✅ App container positioning correct');
                } else {
                    console.error(`❌ App container positioning wrong: expected 20px, got ${paddingTop}`);
                }
            }
        }
    };

    // Initialize immediately
    ContainerFix.init();

    // Make available for testing
    window.ContainerFix = ContainerFix;

})();