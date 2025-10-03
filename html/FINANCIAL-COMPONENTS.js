/**
 * FINANCIAL COMPONENTS SYSTEM
 * Advanced financial visualization components for football management
 * Implements progressive disclosure and professional data visualization
 */

class FinancialComponentsSystem {
    constructor() {
        this.φ = 1.618033988749; // Golden ratio
        this.colors = this.initializeColorSystem();
        this.charts = new Map();
        this.animations = new Map();
        this.dataCache = new Map();
        
        this.initializeSystem();
    }

    initializeColorSystem() {
        return {
            financial: {
                profit: 'hsl(120, 60%, 50%)',      // Green
                loss: 'hsl(0, 70%, 55%)',          // Red
                neutral: 'hsl(200, 20%, 60%)',     // Gray-blue
                warning: 'hsl(45, 80%, 60%)',      // Amber
                critical: 'hsl(15, 85%, 55%)'      // Orange-red
            },
            ffp: {
                compliant: 'hsl(120, 50%, 45%)',
                warning: 'hsl(45, 70%, 50%)',
                breach: 'hsl(0, 75%, 50%)',
                monitoring: 'hsl(200, 60%, 50%)'
            },
            revenue: {
                matchday: 'hsl(220, 70%, 55%)',
                tv: 'hsl(280, 60%, 55%)',
                commercial: 'hsl(140, 60%, 45%)',
                transfer: 'hsl(30, 70%, 55%)'
            }
        };
    }

    initializeSystem() {
        this.createStyleSheet();
        this.setupEventListeners();
        this.loadSampleData();
    }

    createStyleSheet() {
        const style = document.createElement('style');
        style.textContent = `
            /* Financial Components Core Styles */
            .financial-dashboard {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                padding: 20px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 12px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .financial-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 20px;
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                backdrop-filter: blur(10px);
            }

            .financial-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .card-title {
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
                margin: 0;
            }

            .card-status {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .status-compliant { background: hsla(120, 50%, 45%, 0.2); color: hsl(120, 50%, 70%); }
            .status-warning { background: hsla(45, 70%, 50%, 0.2); color: hsl(45, 70%, 70%); }
            .status-critical { background: hsla(0, 75%, 50%, 0.2); color: hsl(0, 75%, 70%); }

            .financial-metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .metric-label {
                font-size: 14px;
                color: #b0b0b0;
                font-weight: 400;
            }

            .metric-value {
                font-size: 16px;
                font-weight: 600;
                color: #ffffff;
            }

            .metric-change {
                font-size: 12px;
                margin-left: 8px;
                padding: 2px 6px;
                border-radius: 4px;
            }

            .change-positive { background: hsla(120, 60%, 50%, 0.2); color: hsl(120, 60%, 70%); }
            .change-negative { background: hsla(0, 70%, 55%, 0.2); color: hsl(0, 70%, 70%); }

            .chart-container {
                position: relative;
                height: 300px;
                margin: 16px 0;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                padding: 16px;
            }

            .progress-ring {
                width: 120px;
                height: 120px;
                margin: 0 auto;
            }

            .progress-circle {
                fill: none;
                stroke-width: 8;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
            }

            .progress-background {
                stroke: rgba(255, 255, 255, 0.1);
            }

            .progress-foreground {
                stroke-linecap: round;
                transition: stroke-dasharray 1s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .revenue-stream {
                display: flex;
                align-items: center;
                padding: 8px 0;
                transition: all 0.2s ease;
            }

            .revenue-stream:hover {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                padding-left: 8px;
            }

            .stream-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 12px;
            }

            .stream-details {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .timeline-container {
                position: relative;
                height: 200px;
                overflow-x: auto;
                margin: 16px 0;
            }

            .timeline {
                display: flex;
                min-width: 800px;
                height: 100%;
                position: relative;
            }

            .timeline-item {
                flex: 1;
                position: relative;
                padding: 8px;
                margin: 0 2px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .timeline-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-2px);
            }

            .expandable-section {
                margin: 16px 0;
            }

            .section-header {
                display: flex;
                justify-content: between;
                align-items: center;
                padding: 12px 0;
                cursor: pointer;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.2s ease;
            }

            .section-header:hover {
                color: #4fc3f7;
            }

            .section-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            .section-content.expanded {
                max-height: 500px;
            }

            .player-card {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin: 8px 0;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 6px;
                border-left: 3px solid transparent;
                transition: all 0.3s ease;
            }

            .player-card:hover {
                background: rgba(255, 255, 255, 0.08);
                border-left-color: #4fc3f7;
            }

            .roi-indicator {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
            }

            .roi-excellent { background: hsla(120, 60%, 50%, 0.2); color: hsl(120, 60%, 70%); }
            .roi-good { background: hsla(80, 60%, 50%, 0.2); color: hsl(80, 60%, 70%); }
            .roi-average { background: hsla(45, 60%, 50%, 0.2); color: hsl(45, 60%, 70%); }
            .roi-poor { background: hsla(0, 60%, 50%, 0.2); color: hsl(0, 60%, 70%); }

            @media (max-width: 768px) {
                .financial-dashboard {
                    grid-template-columns: 1fr;
                    gap: 16px;
                    padding: 16px;
                }
                
                .chart-container {
                    height: 250px;
                }
                
                .timeline {
                    min-width: 600px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 1. FFP Compliance Dashboard
    createFFPDashboard() {
        const container = document.createElement('div');
        container.className = 'financial-card';
        
        const ffpData = this.dataCache.get('ffp') || this.generateFFPData();
        
        container.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">FFP Compliance</h3>
                <span class="card-status status-${ffpData.status}">${ffpData.statusText}</span>
            </div>
            
            <div class="chart-container">
                <canvas id="ffp-chart" width="400" height="200"></canvas>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Squad Cost Ratio</span>
                <span class="metric-value">
                    ${ffpData.squadCostRatio}%
                    <span class="metric-change change-${ffpData.ratioTrend > 0 ? 'negative' : 'positive'}">
                        ${ffpData.ratioTrend > 0 ? '+' : ''}${ffpData.ratioTrend}%
                    </span>
                </span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">3-Year Deficit</span>
                <span class="metric-value">
                    €${this.formatMoney(ffpData.threeYearDeficit)}
                    <span class="metric-change change-${ffpData.deficitTrend > 0 ? 'negative' : 'positive'}">
                        ${ffpData.deficitTrend > 0 ? '+' : ''}€${this.formatMoney(ffpData.deficitTrend)}
                    </span>
                </span>
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Transfer Impact Simulation</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    <div id="transfer-impact-${Date.now()}"></div>
                </div>
            </div>
        `;
        
        setTimeout(() => this.renderFFPChart(ffpData), 100);
        return container;
    }

    generateFFPData() {
        const data = {
            status: 'warning',
            statusText: 'Monitoring',
            squadCostRatio: 67,
            ratioTrend: -3.2,
            threeYearDeficit: 45000000,
            deficitTrend: -8500000,
            yearlyData: [
                { year: '2022', deficit: 28000000, limit: 30000000 },
                { year: '2023', deficit: 22000000, limit: 30000000 },
                { year: '2024', deficit: 15000000, limit: 30000000 }
            ]
        };
        this.dataCache.set('ffp', data);
        return data;
    }

    renderFFPChart(data) {
        const canvas = document.getElementById('ffp-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Setup
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Draw background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(padding, padding, chartWidth, chartHeight);
        
        // Draw FFP limit line
        const limitY = padding + chartHeight * 0.3;
        ctx.strokeStyle = this.colors.ffp.warning;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, limitY);
        ctx.lineTo(padding + chartWidth, limitY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw deficit bars
        const barWidth = chartWidth / data.yearlyData.length;
        data.yearlyData.forEach((item, index) => {
            const x = padding + index * barWidth + barWidth * 0.2;
            const barHeight = (item.deficit / item.limit) * (chartHeight * 0.6);
            const y = padding + chartHeight - barHeight;
            
            // Bar color based on compliance
            const compliance = item.deficit / item.limit;
            ctx.fillStyle = compliance > 1 ? this.colors.ffp.breach : 
                           compliance > 0.8 ? this.colors.ffp.warning : 
                           this.colors.ffp.compliant;
            
            ctx.fillRect(x, y, barWidth * 0.6, barHeight);
            
            // Year label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.year, x + barWidth * 0.3, padding + chartHeight + 20);
        });
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('FFP Deficit vs Limit (€M)', padding, padding - 10);
    }

    // 2. Revenue Stream Visualization
    createRevenueStreamViz() {
        const container = document.createElement('div');
        container.className = 'financial-card';
        
        const revenueData = this.dataCache.get('revenue') || this.generateRevenueData();
        
        container.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Revenue Streams</h3>
                <span class="card-status status-compliant">Growing</span>
            </div>
            
            <div class="chart-container">
                <canvas id="revenue-chart" width="400" height="200"></canvas>
            </div>
            
            <div class="revenue-breakdown">
                ${revenueData.streams.map(stream => `
                    <div class="revenue-stream">
                        <div class="stream-color" style="background: ${stream.color}"></div>
                        <div class="stream-details">
                            <span class="metric-label">${stream.name}</span>
                            <span class="metric-value">
                                €${this.formatMoney(stream.amount)}
                                <span class="metric-change change-${stream.growth > 0 ? 'positive' : 'negative'}">
                                    ${stream.growth > 0 ? '+' : ''}${stream.growth}%
                                </span>
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Seasonal Trends</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    <div class="timeline-container">
                        <div class="timeline" id="revenue-timeline-${Date.now()}"></div>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            this.renderRevenueChart(revenueData);
            this.renderRevenueTrends(revenueData);
        }, 100);
        
        return container;
    }

    generateRevenueData() {
        const data = {
            total: 285000000,
            streams: [
                { name: 'Matchday', amount: 65000000, growth: 8.5, color: this.colors.revenue.matchday },
                { name: 'TV Rights', amount: 125000000, growth: 12.3, color: this.colors.revenue.tv },
                { name: 'Commercial', amount: 75000000, growth: 15.7, color: this.colors.revenue.commercial },
                { name: 'Transfers', amount: 20000000, growth: -23.1, color: this.colors.revenue.transfer }
            ],
            trends: this.generateMonthlyTrends()
        };
        this.dataCache.set('revenue', data);
        return data;
    }

    generateMonthlyTrends() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map(month => ({
            month,
            matchday: Math.random() * 8000000 + 2000000,
            tv: Math.random() * 12000000 + 8000000,
            commercial: Math.random() * 8000000 + 4000000,
            transfer: Math.random() * 15000000
        }));
    }

    renderRevenueChart(data) {
        const canvas = document.getElementById('revenue-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let currentAngle = 0;
        const total = data.streams.reduce((sum, stream) => sum + stream.amount, 0);
        
        data.streams.forEach(stream => {
            const sliceAngle = (stream.amount / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = stream.color;
            ctx.fill();
            
            // Add subtle stroke
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            currentAngle += sliceAngle;
        });
        
        // Center text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Total Revenue', centerX, centerY - 10);
        ctx.font = '14px Arial';
        ctx.fillText(`€${this.formatMoney(total)}`, centerX, centerY + 10);
    }

    // 3. Transfer Economics Components
    createTransferEconomics() {
        const container = document.createElement('div');
        container.className = 'financial-card';
        
        const transferData = this.dataCache.get('transfers') || this.generateTransferData();
        
        container.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Transfer Economics</h3>
                <span class="card-status status-compliant">Optimized</span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Available Budget</span>
                <span class="metric-value">€${this.formatMoney(transferData.availableBudget)}</span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Net Spend (Season)</span>
                <span class="metric-value">
                    €${this.formatMoney(transferData.netSpend)}
                    <span class="metric-change change-${transferData.netSpend > 0 ? 'negative' : 'positive'}">
                        ${transferData.efficiency}% efficiency
                    </span>
                </span>
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Recent Signings ROI</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    ${transferData.signings.map(signing => `
                        <div class="player-card">
                            <div>
                                <strong>${signing.name}</strong>
                                <div style="font-size: 12px; color: #b0b0b0;">${signing.position}</div>
                            </div>
                            <div style="text-align: right;">
                                <div>€${this.formatMoney(signing.fee)}</div>
                                <div class="roi-indicator roi-${signing.roiClass}">${signing.roi}% ROI</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Market Value Trends</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    <div class="chart-container">
                        <canvas id="market-trends-chart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => this.renderMarketTrends(transferData), 100);
        return container;
    }

    generateTransferData() {
        const data = {
            availableBudget: 75000000,
            netSpend: 45000000,
            efficiency: 87,
            signings: [
                { name: 'Roberto Silva', position: 'CM', fee: 25000000, roi: 23, roiClass: 'good' },
                { name: 'Alex Johnson', position: 'RW', fee: 18000000, roi: 45, roiClass: 'excellent' },
                { name: 'Marco Rossi', position: 'CB', fee: 12000000, roi: 8, roiClass: 'average' },
                { name: 'David Kim', position: 'GK', fee: 8000000, roi: -5, roiClass: 'poor' }
            ],
            marketTrends: this.generateMarketTrends()
        };
        this.dataCache.set('transfers', data);
        return data;
    }

    generateMarketTrends() {
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        let baseValue = 100;
        return months.map(month => {
            baseValue += (Math.random() - 0.5) * 10;
            return { month, index: Math.max(50, Math.min(150, baseValue)) };
        });
    }

    renderMarketTrends(data) {
        const canvas = document.getElementById('market-trends-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw trend line
        ctx.strokeStyle = this.colors.revenue.commercial;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.marketTrends.forEach((point, index) => {
            const x = padding + (chartWidth / (data.marketTrends.length - 1)) * index;
            const y = padding + chartHeight - ((point.index - 50) / 100) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add points
        ctx.fillStyle = this.colors.revenue.commercial;
        data.marketTrends.forEach((point, index) => {
            const x = padding + (chartWidth / (data.marketTrends.length - 1)) * index;
            const y = padding + chartHeight - ((point.index - 50) / 100) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // 4. Sponsorship Portfolio Manager
    createSponsorshipPortfolio() {
        const container = document.createElement('div');
        container.className = 'financial-card';
        
        const sponsorData = this.dataCache.get('sponsors') || this.generateSponsorData();
        
        container.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Sponsorship Portfolio</h3>
                <span class="card-status status-warning">3 Expiring</span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Total Annual Value</span>
                <span class="metric-value">€${this.formatMoney(sponsorData.totalValue)}</span>
            </div>
            
            <div class="timeline-container">
                <div class="timeline">
                    ${sponsorData.contracts.map(contract => `
                        <div class="timeline-item" style="background: ${this.getSponsorStatusColor(contract.status)};">
                            <div style="font-size: 12px; font-weight: 600;">${contract.sponsor}</div>
                            <div style="font-size: 11px; color: #b0b0b0;">${contract.type}</div>
                            <div style="font-size: 14px; margin: 4px 0;">€${this.formatMoney(contract.value)}/yr</div>
                            <div style="font-size: 10px; color: ${contract.status === 'expiring' ? '#ff6b6b' : '#4fc3f7'};">
                                ${contract.expiryDate}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Performance Bonuses</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    ${sponsorData.bonuses.map(bonus => `
                        <div class="financial-metric">
                            <span class="metric-label">${bonus.trigger}</span>
                            <span class="metric-value">€${this.formatMoney(bonus.amount)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return container;
    }

    generateSponsorData() {
        const data = {
            totalValue: 85000000,
            contracts: [
                { sponsor: 'SportsTech', type: 'Main Kit', value: 35000000, expiryDate: '2025-06', status: 'active' },
                { sponsor: 'GlobalBank', type: 'Stadium Rights', value: 25000000, expiryDate: '2024-12', status: 'expiring' },
                { sponsor: 'TechCorp', type: 'Training Ground', value: 12000000, expiryDate: '2026-01', status: 'active' },
                { sponsor: 'AutoBrand', type: 'Official Car', value: 8000000, expiryDate: '2024-08', status: 'expiring' },
                { sponsor: 'DrinkCo', type: 'Official Drink', value: 5000000, expiryDate: '2025-03', status: 'active' }
            ],
            bonuses: [
                { trigger: 'Champions League Qualification', amount: 5000000 },
                { trigger: 'Domestic Cup Final', amount: 2000000 },
                { trigger: 'Top 4 Finish', amount: 3000000 },
                { trigger: 'International Trophy', amount: 8000000 }
            ]
        };
        this.dataCache.set('sponsors', data);
        return data;
    }

    getSponsorStatusColor(status) {
        const colors = {
            active: 'rgba(76, 195, 247, 0.1)',
            expiring: 'rgba(255, 107, 107, 0.1)',
            negotiating: 'rgba(255, 193, 7, 0.1)'
        };
        return colors[status] || colors.active;
    }

    // 5. Stadium Economics Dashboard
    createStadiumEconomics() {
        const container = document.createElement('div');
        container.className = 'financial-card';
        
        const stadiumData = this.dataCache.get('stadium') || this.generateStadiumData();
        
        container.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Stadium Economics</h3>
                <span class="card-status status-compliant">Optimized</span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Average Attendance</span>
                <span class="metric-value">
                    ${stadiumData.avgAttendance.toLocaleString()}
                    <span class="metric-change change-positive">+${stadiumData.attendanceGrowth}%</span>
                </span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Revenue per Match</span>
                <span class="metric-value">€${this.formatMoney(stadiumData.revenuePerMatch)}</span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Capacity Utilization</span>
                <span class="metric-value">${stadiumData.capacityUtilization}%</span>
            </div>
            
            <div class="chart-container">
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <svg class="progress-ring" width="120" height="120">
                        <circle class="progress-circle progress-background" 
                                cx="60" cy="60" r="50"></circle>
                        <circle class="progress-circle progress-foreground" 
                                cx="60" cy="60" r="50"
                                stroke="${this.colors.revenue.matchday}"
                                stroke-dasharray="${stadiumData.capacityUtilization * 3.14}, 314"></circle>
                    </svg>
                </div>
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Revenue Breakdown</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    ${stadiumData.revenueBreakdown.map(item => `
                        <div class="financial-metric">
                            <span class="metric-label">${item.category}</span>
                            <span class="metric-value">€${this.formatMoney(item.amount)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return container;
    }

    generateStadiumData() {
        const data = {
            capacity: 65000,
            avgAttendance: 58500,
            attendanceGrowth: 8.5,
            capacityUtilization: 90,
            revenuePerMatch: 3200000,
            revenueBreakdown: [
                { category: 'Ticket Sales', amount: 2100000 },
                { category: 'Concessions', amount: 650000 },
                { category: 'Merchandise', amount: 280000 },
                { category: 'Corporate Hospitality', amount: 170000 }
            ]
        };
        this.dataCache.set('stadium', data);
        return data;
    }

    // 6. Youth Investment Analytics
    createYouthAnalytics() {
        const container = document.createElement('div');
        container.className = 'financial-card';
        
        const youthData = this.dataCache.get('youth') || this.generateYouthData();
        
        container.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">Youth Investment</h3>
                <span class="card-status status-compliant">Profitable</span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Academy ROI (3-year)</span>
                <span class="metric-value">
                    ${youthData.academyROI}%
                    <span class="metric-change change-positive">Excellent</span>
                </span>
            </div>
            
            <div class="financial-metric">
                <span class="metric-label">Development Costs</span>
                <span class="metric-value">€${this.formatMoney(youthData.developmentCosts)}/year</span>
            </div>
            
            <div class="expandable-section">
                <div class="section-header" onclick="this.nextElementSibling.classList.toggle('expanded')">
                    <span>Graduate Performance</span>
                    <span>▼</span>
                </div>
                <div class="section-content">
                    ${youthData.graduates.map(player => `
                        <div class="player-card">
                            <div>
                                <strong>${player.name}</strong>
                                <div style="font-size: 12px; color: #b0b0b0;">${player.position} • Age ${player.age}</div>
                            </div>
                            <div style="text-align: right;">
                                <div>€${this.formatMoney(player.currentValue)}</div>
                                <div style="font-size: 12px; color: #4fc3f7;">
                                    Cost: €${this.formatMoney(player.developmentCost)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        return container;
    }

    generateYouthData() {
        const data = {
            academyROI: 245,
            developmentCosts: 8500000,
            graduates: [
                { name: 'Tommy Wilson', position: 'CAM', age: 20, currentValue: 15000000, developmentCost: 2500000 },
                { name: 'Lucas Santos', position: 'CB', age: 19, currentValue: 12000000, developmentCost: 2000000 },
                { name: 'Ahmed Hassan', position: 'RB', age: 21, currentValue: 8000000, developmentCost: 1800000 },
                { name: 'Pedro Garcia', position: 'ST', age: 18, currentValue: 18000000, developmentCost: 1500000 }
            ]
        };
        this.dataCache.set('youth', data);
        return data;
    }

    // Main Dashboard Assembly
    createFinancialDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'financial-dashboard';
        dashboard.id = 'financial-dashboard';
        
        // Add all components
        dashboard.appendChild(this.createFFPDashboard());
        dashboard.appendChild(this.createRevenueStreamViz());
        dashboard.appendChild(this.createTransferEconomics());
        dashboard.appendChild(this.createSponsorshipPortfolio());
        dashboard.appendChild(this.createStadiumEconomics());
        dashboard.appendChild(this.createYouthAnalytics());
        
        return dashboard;
    }

    // Utility Methods
    formatMoney(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + 'K';
        }
        return amount.toLocaleString();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-header')) {
                const content = e.target.nextElementSibling;
                if (content) {
                    content.classList.toggle('expanded');
                    e.target.querySelector('span:last-child').textContent = 
                        content.classList.contains('expanded') ? '▲' : '▼';
                }
            }
        });
    }

    loadSampleData() {
        // Pre-generate all sample data
        this.generateFFPData();
        this.generateRevenueData();
        this.generateTransferData();
        this.generateSponsorData();
        this.generateStadiumData();
        this.generateYouthData();
    }

    // Real-time update methods
    updateFFPStatus(newData) {
        this.dataCache.set('ffp', { ...this.dataCache.get('ffp'), ...newData });
        this.refreshComponent('ffp');
    }

    updateRevenueStreams(newData) {
        this.dataCache.set('revenue', { ...this.dataCache.get('revenue'), ...newData });
        this.refreshComponent('revenue');
    }

    refreshComponent(type) {
        const dashboard = document.getElementById('financial-dashboard');
        if (dashboard) {
            // Re-render specific component
            const index = ['ffp', 'revenue', 'transfers', 'sponsors', 'stadium', 'youth'].indexOf(type);
            if (index !== -1) {
                const components = [
                    this.createFFPDashboard,
                    this.createRevenueStreamViz,
                    this.createTransferEconomics,
                    this.createSponsorshipPortfolio,
                    this.createStadiumEconomics,
                    this.createYouthAnalytics
                ];
                
                const oldComponent = dashboard.children[index];
                const newComponent = components[index].call(this);
                dashboard.replaceChild(newComponent, oldComponent);
            }
        }
    }

    // Integration with main UI system
    integrate() {
        // Add to main UI navigation
        if (window.fmUI && window.fmUI.addSubscreen) {
            window.fmUI.addSubscreen('financial-dashboard', {
                title: 'Financial Analytics',
                icon: '💰',
                content: this.createFinancialDashboard(),
                shortcut: 'F'
            });
        }
    }

    destroy() {
        // Cleanup method
        this.charts.forEach(chart => chart.destroy());
        this.animations.forEach(animation => animation.cancel());
        this.charts.clear();
        this.animations.clear();
        this.dataCache.clear();
    }
}

// Export and initialize
window.FinancialComponentsSystem = FinancialComponentsSystem;

// Auto-initialize if main UI system is available
document.addEventListener('DOMContentLoaded', () => {
    if (window.fmUI) {
        const financialSystem = new FinancialComponentsSystem();
        financialSystem.integrate();
        window.fmFinancials = financialSystem;
    }
});

// Sample integration code
function initializeFinancialComponents() {
    const financialSystem = new FinancialComponentsSystem();
    
    // Example: Add to page
    const container = document.querySelector('.main-content') || document.body;
    container.appendChild(financialSystem.createFinancialDashboard());
    
    // Example: Update data
    setTimeout(() => {
        financialSystem.updateFFPStatus({
            status: 'compliant',
            statusText: 'Healthy',
            squadCostRatio: 62
        });
    }, 3000);
    
    return financialSystem;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialComponentsSystem;
}