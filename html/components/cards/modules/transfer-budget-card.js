/* ==========================================
   TRANSFER BUDGET CARD - Modular Component
   ========================================== */

window.TransferBudgetCard = {
    id: 'transfer-budget',
    title: 'Budget Status',
    pages: ['transfers', 'finances'],
    size: 'normal',
    
    render() {
        return {
            className: 'card',
            draggable: true,
            innerHTML: `
                <div class="card-header">
                    <span>${this.title}</span>
                </div>
                <div class="card-body">
                    ${this.getContent()}
                </div>
                <div class="resize-handle"></div>
            `
        };
    },
    
    getContent() {
        const budget = this.getBudgetData();
        return `
            <div class="budget-content">
                <div class="stat-row">
                    <span class="stat-label">Transfer Budget</span>
                    <span class="stat-value">${budget.total}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Spent</span>
                    <span class="stat-value" style="color: #ef4444;">${budget.spent}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Remaining</span>
                    <span class="stat-value" style="color: #4ade80;">${budget.remaining}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Wage Budget</span>
                    <span class="stat-value">${budget.wages}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Available Wages</span>
                    <span class="stat-value">${budget.availableWages}</span>
                </div>
            </div>
        `;
    },
    
    getBudgetData() {
        return {
            total: '€150M',
            spent: '€62.5M',
            remaining: '€87.5M',
            wages: '€350k/w',
            availableWages: '€125k/w'
        };
    },
    
    update() {
        const card = document.querySelector(`[data-card-id="${this.id}"]`);
        if (card) {
            const body = card.querySelector('.card-body');
            if (body) {
                body.innerHTML = this.getContent();
            }
        }
    }
};

// Register card
if (window.CardRegistry) {
    window.CardRegistry.register(window.TransferBudgetCard);
}