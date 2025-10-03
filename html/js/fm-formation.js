/**
 * Football Manager Formation Management Module  
 * Handles formation logic, rendering, and drag-drop
 * File size: <2000 lines
 */

// Formation Management State
let currentFormationPhase = 'attacking';
let isDraggingPlayer = false;
let draggedPlayerId = null;
let gridOccupancy = new Map();

// Formation Data Structure (legacy compatibility)
let formationData = {
    attacking: [],
    defending: [],
    transition_attack: [],
    transition_defense: []
};

// UNIFIED SWAP FUNCTION - Works for both pitch and player-selection
function unifiedPlayerSwap(playerIndex1, playerIndex2) {
    if (playerIndex1 === playerIndex2) return;
    
    const player1 = window.FM_CENTRAL_DB.players[playerIndex1];
    const player2 = window.FM_CENTRAL_DB.players[playerIndex2];
    
    if (!player1 || !player2) {
        console.error(`Invalid player indices: ${playerIndex1}, ${playerIndex2}`);
        return;
    }
    
    // Swap only the players and numbers, keep tactical positions and slot characteristics
    const temp = {
        id: player1.id,
        name: player1.name,
        number: player1.number
    };
    
    player1.id = player2.id;
    player1.name = player2.name;
    player1.number = player2.number;
    
    player2.id = temp.id;
    player2.name = temp.name;
    player2.number = temp.number;
    
    // Update all UI systems
    updateFormationFromCentralDB();
    updateGlobalSquadSlotsFromCentralDB();
    
    // Re-render everything
    renderFormationPlayers();
    window.renderCombinedPlayerList();
    
    console.log(`UNIFIED SWAP: ${temp.name} (slot ${playerIndex1+1}) ↔ ${player1.name} (slot ${playerIndex2+1})`);
}

// Update formationData from central database
function updateFormationFromCentralDB() {
    formationData[currentFormationPhase] = window.FM_CENTRAL_DB.players.map(player => ({
        id: player.id,
        x: player.tacticalPos.x,
        y: player.tacticalPos.y,
        position: player.position,
        number: player.number,
        name: player.name,
        role: player.role
    }));
}

// Update globalSquadSlots from central database
function updateGlobalSquadSlotsFromCentralDB() {
    window.FM_CENTRAL_DB.players.forEach((player, index) => {
        if (index < 11 && window.FM_SQUAD_SLOTS[index]) {
            window.FM_SQUAD_SLOTS[index].position = player.position;
            window.FM_SQUAD_SLOTS[index].role = player.role;
            window.FM_SQUAD_SLOTS[index].assignedPlayer = window.FM_SQUAD_ROSTER.find(p => p.id === player.id);
        }
    });
}

// Initialize systems from central database
function initializeFromCentralDB() {
    updateFormationFromCentralDB();
    updateGlobalSquadSlotsFromCentralDB();
}

// Render players on the SVG field
function renderFormationPlayers() {
    const playersGroup = document.getElementById('formation-players');
    if (!playersGroup) return;
    
    playersGroup.innerHTML = '';
    
    // Initialize from central database on first render
    if (!formationData[currentFormationPhase] || formationData[currentFormationPhase].length === 0) {
        initializeFromCentralDB();
    }
    
    const currentPlayers = formationData[currentFormationPhase];
    
    // Create defs for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    playersGroup.appendChild(defs);
    
    // Render players on field
    currentPlayers.forEach(player => {
        const positionClass = window.FM_CONFIG.getPositionClass(player.position);
        
        // Create gradient
        const gradientId = `gradient-${player.id}`;
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('cx', '30%');
        gradient.setAttribute('cy', '30%');
        
        const colors = window.FM_CONFIG.getPositionColor(player.position);
        gradient.innerHTML = `
            <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1"/>
            <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.9"/>
        `;
        defs.appendChild(gradient);
        
        // Create player circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', player.x);
        circle.setAttribute('cy', player.y);
        circle.setAttribute('r', window.FM_CONFIG.TACTICAL_CONFIG.PLAYER.RADIUS);
        circle.setAttribute('fill', `url(#${gradientId})`);
        circle.setAttribute('stroke', 'rgba(255,255,255,0.8)');
        circle.setAttribute('stroke-width', window.FM_CONFIG.TACTICAL_CONFIG.PLAYER.STROKE_WIDTH);
        circle.setAttribute('data-player-id', player.id);
        circle.style.cursor = 'grab';
        circle.style.filter = `drop-shadow(0 2px 4px ${colors.shadow})`;
        
        // Create player number
        const numberText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        numberText.setAttribute('x', player.x);
        numberText.setAttribute('y', player.y + 0.8);
        numberText.setAttribute('text-anchor', 'middle');
        numberText.setAttribute('fill', 'white');
        numberText.setAttribute('font-size', window.FM_CONFIG.TACTICAL_CONFIG.PLAYER.FONTS.NUMBER);
        numberText.setAttribute('font-weight', 'bold');
        numberText.setAttribute('data-player-id', player.id);
        numberText.style.pointerEvents = 'none';
        numberText.textContent = player.number;
        
        // Create player name
        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('x', player.x);
        nameText.setAttribute('y', player.y + 4.5);
        nameText.setAttribute('text-anchor', 'middle');
        nameText.setAttribute('fill', 'white');
        nameText.setAttribute('font-size', window.FM_CONFIG.TACTICAL_CONFIG.PLAYER.FONTS.NAME);
        nameText.setAttribute('font-weight', '500');
        nameText.setAttribute('data-player-id', player.id);
        nameText.style.pointerEvents = 'none';
        nameText.style.textShadow = '0 0 2px rgba(0,0,0,0.8)';
        nameText.textContent = player.name;
        
        // Add event handlers
        circle.addEventListener('mousedown', (e) => startPlayerDrag(player.id, e));
        circle.addEventListener('mouseenter', () => { circle.style.cursor = 'grab'; });
        circle.addEventListener('mouseleave', () => { circle.style.cursor = 'grab'; });
        
        playersGroup.appendChild(circle);
        playersGroup.appendChild(numberText);
        playersGroup.appendChild(nameText);
    });
    
    // Update grid occupancy
    updateGridOccupancy();
    
    // Populate player list
    if (window.renderCombinedPlayerList) {
        window.renderCombinedPlayerList();
    }
}

// Update grid occupancy tracker
function updateGridOccupancy() {
    gridOccupancy.clear();
    const currentPlayers = formationData[currentFormationPhase];
    currentPlayers.forEach(player => {
        const gridKey = `${player.x},${player.y}`;
        gridOccupancy.set(gridKey, player);
    });
}

// Get player at position
function getPlayerAtPosition(x, y) {
    const gridKey = `${x},${y}`;
    return gridOccupancy.get(gridKey) || null;
}

// Drag and Drop Functions
function startPlayerDrag(playerId, e) {
    e.preventDefault();
    e.stopPropagation();
    
    isDraggingPlayer = true;
    draggedPlayerId = playerId;
    
    const playerCircle = document.querySelector(`circle[data-player-id="${playerId}"]`);
    const nameText = document.querySelector(`text[data-player-id="${playerId}"]`);
    
    if (playerCircle) {
        playerCircle.style.filter += ' brightness(1.2)';
        playerCircle.style.cursor = 'grabbing';
    }
    
    if (nameText) {
        nameText.style.opacity = '0';
    }
    
    showPitchGrid();
    document.body.style.cursor = 'grabbing';
    
    // Add event listeners
    document.addEventListener('mousemove', updatePlayerPosition, { capture: true });
    document.addEventListener('mouseup', stopPlayerDrag, { capture: true });
    
    console.log(`Started dragging player ${playerId}`);
}

// Update player position during drag
function updatePlayerPosition(e) {
    if (!isDraggingPlayer || !draggedPlayerId) return;
    
    const field = document.getElementById('formation-players');
    if (!field) return;
    
    const rect = field.getBoundingClientRect();
    
    // Calculate position with viewBox offset correction
    const viewBoxX = ((e.clientX - rect.left) / rect.width) * 68;
    const viewBoxY = ((e.clientY - rect.top) / rect.height) * 109 + (-1);
    
    const rawX = viewBoxX;
    const rawY = Math.max(0, Math.min(108, viewBoxY));
    
    const constrainedX = Math.max(2, Math.min(66, rawX));
    const constrainedY = Math.max(2, Math.min(106, rawY));
    
    // Calculate grid snap target
    const nearestGridX = Math.round((constrainedX - 2) / 4) * 4 + 2;
    const nearestGridY = Math.round((constrainedY - 2) / 4) * 4 + 2;
    
    // Check for occupied position
    const occupant = getPlayerAtPosition(nearestGridX, nearestGridY);
    const isSwapTarget = occupant && occupant.id !== draggedPlayerId;
    
    // Show preview
    if (isSwapTarget) {
        showSwapIndicator(nearestGridX, nearestGridY);
        document.body.style.cursor = 'copy';
    } else {
        showGhostPreview(nearestGridX, nearestGridY);
        document.body.style.cursor = 'grabbing';
    }
    
    // Update visual position
    const circle = document.querySelector(`circle[data-player-id="${draggedPlayerId}"]`);
    const numberText = document.querySelector(`text[data-player-id="${draggedPlayerId}"]`);
    const nameTexts = document.querySelectorAll(`text[data-player-id="${draggedPlayerId}"]`);
    
    if (circle) {
        circle.setAttribute('cx', constrainedX);
        circle.setAttribute('cy', constrainedY);
    }
    if (numberText) {
        numberText.setAttribute('x', constrainedX);
        numberText.setAttribute('y', constrainedY + 0.8);
    }
    nameTexts.forEach(text => {
        if (text !== numberText) {
            text.setAttribute('x', constrainedX);
            text.setAttribute('y', constrainedY + 4.5);
        }
    });
    
    // Store snap target for final positioning
    window.tempSnapTarget = { x: nearestGridX, y: nearestGridY, isSwap: isSwapTarget, occupant };
}

// Stop dragging and finalize position
function stopPlayerDrag() {
    if (!isDraggingPlayer || !draggedPlayerId) return;
    
    const currentPlayers = formationData[currentFormationPhase];
    const player = currentPlayers.find(p => p.id === draggedPlayerId);
    
    if (player && window.tempSnapTarget) {
        const { x: finalX, y: finalY, isSwap, occupant } = window.tempSnapTarget;
        
        if (isSwap && occupant) {
            // Find indices for unified swap
            const draggedIndex = window.FM_CENTRAL_DB.players.findIndex(p => p.id === draggedPlayerId);
            const occupyingIndex = window.FM_CENTRAL_DB.players.findIndex(p => p.id === occupant.id);
            
            if (draggedIndex !== -1 && occupyingIndex !== -1) {
                unifiedPlayerSwap(draggedIndex, occupyingIndex);
            }
        } else {
            // Simple move
            player.x = finalX;
            player.y = finalY;
            
            // Update central database
            const playerIndex = window.FM_CENTRAL_DB.players.findIndex(p => p.id === draggedPlayerId);
            if (playerIndex !== -1) {
                window.FM_CENTRAL_DB.players[playerIndex].tacticalPos = { x: finalX, y: finalY };
            }
        }
        
        delete window.tempSnapTarget;
    }
    
    // Reset drag state
    isDraggingPlayer = false;
    draggedPlayerId = null;
    document.body.style.cursor = 'default';
    
    // Clean up visuals
    hidePitchGrid();
    hideGhostPreview();
    hideSwapIndicator();
    
    // Remove listeners
    document.removeEventListener('mousemove', updatePlayerPosition, { capture: true });
    document.removeEventListener('mouseup', stopPlayerDrag, { capture: true });
    
    // Re-render
    renderFormationPlayers();
}

// Grid and Preview Functions
function showPitchGrid() {
    const field = document.getElementById('formation-players');
    if (!field) return;
    
    const existingGrid = field.querySelector('.pitch-grid');
    if (existingGrid) existingGrid.remove();
    
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.classList.add('pitch-grid');
    
    // Draw grid lines
    for (let i = 0; i <= 17; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', i * 4);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', i * 4);
        line.setAttribute('y2', 108);
        line.setAttribute('stroke', 'rgba(255,255,255,0.4)');
        line.setAttribute('stroke-width', '0.3');
        line.setAttribute('stroke-dasharray', '1.5,1.5');
        gridGroup.appendChild(line);
    }
    
    for (let i = 0; i <= 27; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', i * 4);
        line.setAttribute('x2', 68);
        line.setAttribute('y2', i * 4);
        line.setAttribute('stroke', 'rgba(255,255,255,0.4)');
        line.setAttribute('stroke-width', '0.3');
        line.setAttribute('stroke-dasharray', '1.5,1.5');
        gridGroup.appendChild(line);
    }
    
    field.appendChild(gridGroup);
}

function hidePitchGrid() {
    const field = document.getElementById('formation-players');
    const grid = field?.querySelector('.pitch-grid');
    if (grid) grid.remove();
}

function showGhostPreview(x, y) {
    hideGhostPreview();
    
    const field = document.getElementById('formation-players');
    if (!field) return;
    
    const ghost = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ghost.setAttribute('cx', x);
    ghost.setAttribute('cy', y);
    ghost.setAttribute('r', '2.25');
    ghost.setAttribute('fill', 'rgba(0, 255, 136, 0.4)');
    ghost.setAttribute('stroke', 'rgba(0, 255, 136, 0.8)');
    ghost.setAttribute('stroke-width', '0.3');
    ghost.setAttribute('stroke-dasharray', '1,1');
    ghost.setAttribute('class', 'ghost-preview');
    ghost.style.pointerEvents = 'none';
    
    field.appendChild(ghost);
}

function hideGhostPreview() {
    const field = document.getElementById('formation-players');
    const ghost = field?.querySelector('.ghost-preview');
    if (ghost) ghost.remove();
}

function showSwapIndicator(x, y) {
    hideSwapIndicator();
    
    const field = document.getElementById('formation-players');
    if (!field) return;
    
    const swapIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    swapIndicator.setAttribute('cx', x);
    swapIndicator.setAttribute('cy', y);
    swapIndicator.setAttribute('r', '3');
    swapIndicator.setAttribute('fill', 'rgba(255, 165, 0, 0.3)');
    swapIndicator.setAttribute('stroke', 'rgba(255, 165, 0, 0.8)');
    swapIndicator.setAttribute('stroke-width', '0.4');
    swapIndicator.setAttribute('stroke-dasharray', '2,2');
    swapIndicator.setAttribute('class', 'swap-indicator');
    swapIndicator.style.pointerEvents = 'none';
    swapIndicator.style.animation = 'pulse 1s ease-in-out infinite alternate';
    
    field.appendChild(swapIndicator);
}

function hideSwapIndicator() {
    const field = document.getElementById('formation-players');
    const indicator = field?.querySelector('.swap-indicator');
    if (indicator) indicator.remove();
}

// Change formation phase
function changeFormationPhase(phase) {
    currentFormationPhase = phase;
    renderFormationPlayers();
    console.log(`Formation phase changed to: ${phase}`);
}

// Export functions for global access
window.FM_FORMATION = {
    unifiedPlayerSwap,
    renderFormationPlayers,
    changeFormationPhase,
    updateFormationFromCentralDB,
    updateGlobalSquadSlotsFromCentralDB,
    initializeFromCentralDB
};

// Export formationData for debugging
window.formationData = formationData;