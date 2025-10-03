/**
 * Football Manager UI Components Module
 * Player selection, dropdowns, and visual components  
 * File size: <2000 lines
 */

// Player Selection Rendering
function renderCombinedPlayerList() {
    const container = document.getElementById('formation-all-players');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Initialize from central database if needed
    if (!window.FM_SQUAD_SLOTS.some(slot => slot.assignedPlayer)) {
        window.FM_FORMATION.initializeFromCentralDB();
    }
    
    // Render all 22 squad slots
    window.FM_SQUAD_SLOTS.forEach((slot, index) => {
        createAethelredSquadSlot(container, slot, index);
    });
}

// Create enhanced squad slot component
function createAethelredSquadSlot(container, slot, index) {
    const player = slot.assignedPlayer;
    const isStartingXI = slot.id <= 11;
    
    // Main container
    const squadSlot = document.createElement('div');
    squadSlot.className = 'aethelred-squad-slot';
    squadSlot.style.cssText = `
        display: flex; align-items: center; height: 42px;
        background: var(--neutral-300); border-radius: var(--border-radius);
        overflow: hidden; gap: 4px; margin-bottom: 4px;
    `;
    
    // Position badge
    const positionBadge = createPositionBadge(slot);
    squadSlot.appendChild(positionBadge);
    
    // Role dropdown (starting XI only)
    if (isStartingXI) {
        const roleDropdown = createRoleDropdown(slot);
        squadSlot.appendChild(roleDropdown);
    }
    
    // Player rating
    const ratingDisplay = createRatingDisplay(player);
    squadSlot.appendChild(ratingDisplay);
    
    // Player dropdown
    const playerDropdown = createPlayerDropdown(slot);
    squadSlot.appendChild(playerDropdown);
    
    // Player stats
    const playerStats = createPlayerStats(player);
    squadSlot.appendChild(playerStats);
    
    container.appendChild(squadSlot);
}

// Position badge component
function createPositionBadge(slot) {
    const badge = document.createElement('div');
    const positionColor = window.FM_CONFIG.getPositionColorVariable(slot.position);
    
    badge.style.cssText = `
        background: ${positionColor}; color: white;
        font-size: var(--font-size-sm); font-weight: 400;
        text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        padding: 0; border: none; border-radius: 0;
        min-width: 36px; height: 100%; display: flex;
        align-items: center; justify-content: center;
    `;
    badge.textContent = slot.position;
    
    return badge;
}

// Role dropdown component
function createRoleDropdown(slot) {
    const dropdown = document.createElement('select');
    const roleColor = window.FM_CONFIG.getRoleDropdownColor(slot.position);
    
    dropdown.style.cssText = `
        background: ${roleColor}; color: white;
        border: none; border-radius: 0; padding: 4px 8px;
        font-size: var(--font-size-xs); font-weight: 400;
        cursor: pointer; width: 60px; height: 100%;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    `;
    
    const roles = ['SK', 'WB', 'BPD', 'CD', 'DLP', 'BBM', 'AP', 'IF', 'W', 'CF'];
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        option.selected = role === slot.role;
        dropdown.appendChild(option);
    });
    
    dropdown.addEventListener('change', () => {
        changeSlotRole(slot.id, dropdown.value);
    });
    
    return dropdown;
}

// Rating display component
function createRatingDisplay(player) {
    const rating = document.createElement('div');
    rating.className = 'aethelred-rating-display';
    rating.style.cssText = `
        color: #ffd700; font-size: var(--font-size-xs);
        font-weight: 600; text-align: center; min-width: 40px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    `;
    
    if (player) {
        const starCount = Math.floor(player.rating / 20);
        const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
        rating.textContent = stars;
    } else {
        rating.textContent = '☆☆☆☆☆';
    }
    
    return rating;
}

// Player dropdown component
function createPlayerDropdown(slot) {
    const dropdown = document.createElement('select');
    const currentPlayer = slot.assignedPlayer;
    const isEmptySelected = !currentPlayer;
    
    dropdown.style.cssText = `
        background: var(--neutral-400); color: ${isEmptySelected ? '#C3C3C3' : 'white'};
        border: 1px solid var(--neutral-500); border-radius: 4px;
        padding: 4px 8px; font-size: var(--font-size-xs);
        cursor: pointer; flex: 1; height: 32px; margin: 4px;
    `;
    
    // Empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Empty';
    emptyOption.style.color = '#C3C3C3';
    dropdown.appendChild(emptyOption);
    
    // Player options
    window.FM_SQUAD_ROSTER.forEach(player => {
        const option = document.createElement('option');
        option.value = player.id;
        
        const isAssignedElsewhere = window.FM_SQUAD_SLOTS.some(s => 
            s.id !== slot.id && s.assignedPlayer && s.assignedPlayer.id === player.id
        );
        
        option.textContent = currentPlayer?.id === player.id ? 
            player.name : 
            isAssignedElsewhere ? `${player.name} (Swap)` : player.name;
        
        option.selected = currentPlayer?.id === player.id;
        option.style.color = 'white';
        dropdown.appendChild(option);
    });
    
    dropdown.addEventListener('change', () => {
        assignOrSwapPlayer(slot.id, dropdown.value);
    });
    
    return dropdown;
}

// Player stats component
function createPlayerStats(player) {
    const stats = document.createElement('div');
    stats.style.cssText = `
        display: flex; align-items: center; gap: 8px;
        padding: 4px; min-width: 120px;
    `;
    
    if (player) {
        stats.innerHTML = `
            ${createConditionIcon(player.condition)}
            ${createMoraleIcon(player.morale)}
            ${createFormIcon(85)}
            <div style="font-size: var(--font-size-xs); color: white; font-weight: 600;">${player.rating}</div>
        `;
    } else {
        stats.innerHTML = '<div style="color: var(--text-disabled);">-</div>';
    }
    
    return stats;
}

// Enhanced morale icon with thicker arrows
function createMoraleIcon(moraleValue) {
    let config;
    for (const [key, value] of Object.entries(window.FM_CONFIG.MORALE_CONFIG)) {
        if (moraleValue >= value.min) {
            config = value;
            break;
        }
    }
    
    if (!config) config = window.FM_CONFIG.MORALE_CONFIG.DEJECTED;
    
    return `
        <div title="Morale: ${moraleValue}%" style="width: 18px; height: 18px; position: relative; cursor: help;">
            <svg width="18" height="18" viewBox="0 0 24 24" style="position: absolute; transform: rotate(${config.rotation});">
                <path d="M12 1.5l5 10h-3v11.5h-4V11.5H7l5-10z" 
                      fill="${config.color}" 
                      stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
            </svg>
        </div>
    `;
}

// Condition icon
function createConditionIcon(condition) {
    const percentage = Math.max(0, Math.min(100, condition));
    const color = percentage >= 80 ? '#00ff88' : percentage >= 60 ? '#ffff00' : '#ff4757';
    const strokeColor = percentage >= 80 ? '#00dd66' : percentage >= 60 ? '#dddd00' : '#dd3344';
    
    return `
        <div title="Condition: ${condition}%" style="width: 18px; height: 18px; position: relative; cursor: help;">
            <svg width="18" height="18" viewBox="0 0 24 24" style="position: absolute;">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                      stroke="${strokeColor}" stroke-width="2" fill="none"/>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
                      fill="${color}" opacity="${Math.min(1.0, percentage / 70)}"/>
            </svg>
        </div>
    `;
}

// Form icon
function createFormIcon(form) {
    const color = form >= 80 ? '#00ff88' : form >= 60 ? '#ffff00' : '#ff4757';
    const strokeColor = form >= 80 ? '#00dd66' : form >= 60 ? '#dddd00' : '#dd3344';
    const intensity = Math.max(0.3, Math.min(1.0, form / 100));
    
    return `
        <div title="Form: ${form}%" style="width: 18px; height: 18px; position: relative; cursor: help;">
            <svg width="18" height="18" viewBox="0 0 24 24" style="position: absolute;">
                <path d="M13 2L8.5 12h3L10 22l4.5-10h-3L13 2z" 
                      fill="${color}" opacity="${intensity}"
                      stroke="${strokeColor}" stroke-width="1.5"/>
            </svg>
        </div>
    `;
}

// Player Assignment Function
function assignOrSwapPlayer(slotId, playerId) {
    console.log(`Assigning/swapping player ${playerId} to slot ${slotId}`);
    
    const targetIndex = slotId - 1; // Convert slot ID to array index
    
    // If clearing the slot
    if (!playerId || playerId === '') {
        if (targetIndex >= 0 && targetIndex < 11) {
            const targetSlot = window.FM_SQUAD_SLOTS[targetIndex];
            window.FM_CENTRAL_DB.players[targetIndex] = { 
                index: targetIndex, 
                id: null, 
                name: '', 
                position: targetSlot.position, 
                role: targetSlot.role, 
                number: 0, 
                tacticalPos: window.FM_CENTRAL_DB.players[targetIndex]?.tacticalPos || { x: 34, y: 50 } 
            };
            
            window.FM_FORMATION.updateFormationFromCentralDB();
            window.FM_FORMATION.updateGlobalSquadSlotsFromCentralDB();
            window.FM_FORMATION.renderFormationPlayers();
            renderCombinedPlayerList();
        }
        return;
    }
    
    // Find source player index in central database
    const sourceIndex = window.FM_CENTRAL_DB.players.findIndex(p => p.id == playerId);
    
    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
        // SWAP: Use unified swap function
        window.FM_FORMATION.unifiedPlayerSwap(targetIndex, sourceIndex);
    } else if (sourceIndex === -1) {
        // NEW ASSIGNMENT: Player not currently in formation
        const player = window.FM_SQUAD_ROSTER.find(p => p.id == playerId);
        if (player && targetIndex >= 0 && targetIndex < 11) {
            const targetSlot = window.FM_SQUAD_SLOTS[targetIndex];
            window.FM_CENTRAL_DB.players[targetIndex] = {
                index: targetIndex,
                id: player.id,
                name: player.name,
                position: targetSlot.position,
                role: targetSlot.role,
                number: player.number,
                tacticalPos: window.FM_CENTRAL_DB.players[targetIndex]?.tacticalPos || { x: 34, y: 50 }
            };
            
            window.FM_FORMATION.updateFormationFromCentralDB();
            window.FM_FORMATION.updateGlobalSquadSlotsFromCentralDB();
            window.FM_FORMATION.renderFormationPlayers();
            renderCombinedPlayerList();
        }
    }
}

// Change slot role
function changeSlotRole(slotId, newRole) {
    console.log(`Changing slot ${slotId} role to ${newRole}`);
    
    const slot = window.FM_SQUAD_SLOTS.find(s => s.id == slotId);
    if (slot) {
        slot.role = newRole;
        
        // Update central database
        const playerIndex = slotId - 1;
        if (playerIndex >= 0 && playerIndex < 11 && window.FM_CENTRAL_DB.players[playerIndex]) {
            window.FM_CENTRAL_DB.players[playerIndex].role = newRole;
        }
        
        renderCombinedPlayerList();
    }
}

// Squad Analysis Function
function showSquadAnalysis() {
    const startingXI = window.FM_CENTRAL_DB.players.filter(p => p.id);
    const avgRating = startingXI.reduce((sum, p) => {
        const player = window.FM_SQUAD_ROSTER.find(r => r.id === p.id);
        return sum + (player?.rating || 0);
    }, 0) / Math.max(1, startingXI.length);
    
    const avgMorale = startingXI.reduce((sum, p) => {
        const player = window.FM_SQUAD_ROSTER.find(r => r.id === p.id);
        return sum + (player?.morale || 0);
    }, 0) / Math.max(1, startingXI.length);
    
    alert(`Squad Analysis:
Formation: 4-2-3-1 Wide (${startingXI.length}/11 players assigned)
Average Rating: ${avgRating.toFixed(1)}/100
Average Morale: ${avgMorale.toFixed(1)}%
Tactical Balance: ${startingXI.length >= 11 ? 'Complete' : 'Incomplete'}
Overall Assessment: ${avgRating >= 80 ? 'Excellent' : avgRating >= 70 ? 'Good' : 'Needs Improvement'}`);
}

// Filter and utility functions
function openFilterDialog() {
    alert('Filter functionality - Position, rating, form filters');
}

function clearFormation() {
    if (confirm('Clear all player assignments?')) {
        window.FM_CENTRAL_DB.players.forEach(player => {
            player.id = null;
            player.name = '';
            player.number = 0;
        });
        
        window.FM_SQUAD_SLOTS.forEach(slot => {
            slot.assignedPlayer = null;
        });
        
        window.FM_FORMATION.updateFormationFromCentralDB();
        window.FM_FORMATION.updateGlobalSquadSlotsFromCentralDB();
        window.FM_FORMATION.renderFormationPlayers();
        renderCombinedPlayerList();
        
        console.log('Formation cleared');
    }
}

function autoPickFormation(strategy) {
    if (!strategy) return;
    
    console.log(`Auto-picking formation using ${strategy} strategy`);
    // Auto-pick logic would go here
}

// Export functions globally
window.renderCombinedPlayerList = renderCombinedPlayerList;
window.assignOrSwapPlayer = assignOrSwapPlayer;
window.changeSlotRole = changeSlotRole;
window.showSquadAnalysis = showSquadAnalysis;
window.openFilterDialog = openFilterDialog;
window.clearFormation = clearFormation;
window.autoPickFormation = autoPickFormation;