/**
 * RESIZE FIX - Simple solution for working resize handles
 * Based on what I see in error.png - the layout is actually good!
 */

(function() {
    'use strict';

    console.log('📏 RESIZE FIX: Making resize handles actually work...');

    function fixResizeHandles() {
        // Wait for cards to be loaded
        if (document.querySelectorAll('.card').length === 0) {
            setTimeout(fixResizeHandles, 500);
            return;
        }

        console.log('📏 RESIZE FIX: Setting up working resize functionality...');

        // Find all resize handles
        const bottomRightHandles = document.querySelectorAll('.resize-handle');
        const bottomLeftHandles = document.querySelectorAll('.resize-handle-bl');

        console.log(`📏 Found ${bottomRightHandles.length} bottom-right handles`);
        console.log(`📏 Found ${bottomLeftHandles.length} bottom-left handles`);

        // Make sure handles are visible
        const handleStyle = document.createElement('style');
        handleStyle.textContent = `
            .resize-handle, .resize-handle-bl {
                opacity: 0.6 !important;
                background: rgba(0, 148, 204, 0.3) !important;
                border: 1px solid rgba(0, 148, 204, 0.5) !important;
                transition: all 0.2s ease !important;
            }
            
            .card:hover .resize-handle,
            .card:hover .resize-handle-bl {
                opacity: 1 !important;
                background: rgba(0, 148, 204, 0.6) !important;
            }
            
            .resize-handle {
                cursor: nw-resize !important;
            }
            
            .resize-handle-bl {
                cursor: ne-resize !important;
            }
        `;
        document.head.appendChild(handleStyle);

        // Remove any existing broken listeners
        [...bottomRightHandles, ...bottomLeftHandles].forEach(handle => {
            const newHandle = handle.cloneNode(true);
            handle.parentNode.replaceChild(newHandle, handle);
        });

        // Add working resize functionality
        document.addEventListener('mousedown', function(e) {
            if (e.target.matches('.resize-handle')) {
                startResize(e, 'bottom-right');
            } else if (e.target.matches('.resize-handle-bl')) {
                startResize(e, 'bottom-left');
            }
        });

        function startResize(e, corner) {
            e.preventDefault();
            e.stopPropagation();

            const handle = e.target;
            const card = handle.closest('.card');
            
            if (!card) return;

            console.log(`📏 Starting resize: ${corner}`);

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = card.offsetWidth;
            const startHeight = card.offsetHeight;
            const startLeft = card.offsetLeft;

            // Show visual feedback
            card.style.outline = '2px solid rgba(0, 148, 204, 0.5)';

            function doResize(e) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newWidth, newHeight;

                if (corner === 'bottom-right') {
                    newWidth = Math.max(150, startWidth + deltaX);
                    newHeight = Math.max(100, startHeight + deltaY);
                } else { // bottom-left
                    newWidth = Math.max(150, startWidth - deltaX);
                    newHeight = Math.max(100, startHeight + deltaY);
                    
                    // For bottom-left, also adjust position
                    const newLeft = startLeft + (startWidth - newWidth);
                    card.style.left = newLeft + 'px';
                }

                card.style.width = newWidth + 'px';
                card.style.height = newHeight + 'px';
            }

            function stopResize() {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
                
                // Remove visual feedback
                card.style.outline = '';
                
                console.log(`📏 Resize complete: ${card.offsetWidth}x${card.offsetHeight}`);
            }

            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
        }

        console.log('✅ RESIZE FIX: Working resize handles implemented');
    }

    // Wait for DOM to be ready, then fix resize
    if (document.readyState === 'complete') {
        setTimeout(fixResizeHandles, 3000);
    } else {
        window.addEventListener('load', function() {
            setTimeout(fixResizeHandles, 3000);
        });
    }

})();