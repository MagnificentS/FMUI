/**
 * PIZZA CHART - Football Manager style pie and radar charts
 * Creates pie charts and radar charts with smooth animations
 * Following ZENITH principles with 60fps performance
 */

window.PizzaChart = class PizzaChart {
    constructor(options = {}) {
        this.options = {
            container: null,
            data: [],
            type: 'pie', // 'pie' or 'radar'
            size: 100,
            colors: ['#0094cc', '#00ff88', '#ffb800', '#ff6b35', '#ff4757', '#8066ff'],
            showLabels: true,
            showValues: true,
            animate: true,
            animationDuration: 800,
            ...options
        };
        
        this.element = null;
        this.svg = null;
        
        if (this.options.container) {
            this.init();
        }
    }
    
    init() {
        this.createElement();
        this.render();
        
        if (this.options.animate) {
            this.animateChart();
        }
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = `pizza-chart ${this.options.type}-chart`;
        this.element.style.cssText = `
            width: ${this.options.size}px;
            height: ${this.options.size}px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const container = typeof this.options.container === 'string' 
            ? document.querySelector(this.options.container)
            : this.options.container;
            
        if (container) {
            container.appendChild(this.element);
        }
    }
    
    render() {
        if (!this.options.data.length) return;
        
        if (this.options.type === 'pie') {
            this.renderPieChart();
        } else if (this.options.type === 'radar') {
            this.renderRadarChart();
        }
    }
    
    renderPieChart() {
        const size = this.options.size;
        const center = size / 2;
        const radius = center - 10;
        
        const total = this.options.data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;
        
        let svgContent = '';
        
        this.options.data.forEach((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const color = item.color || this.options.colors[index % this.options.colors.length];
            
            // Create pie slice path
            const startAngle = (currentAngle * Math.PI) / 180;
            const endAngle = ((currentAngle + angle) * Math.PI) / 180;
            
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
                `M ${center} ${center}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
            ].join(' ');
            
            svgContent += `
                <path 
                    d="${pathData}" 
                    fill="${color}" 
                    stroke="rgba(255,255,255,0.2)" 
                    stroke-width="1"
                    style="opacity: 0; transition: opacity 0.3s ease ${index * 100}ms;"
                    data-animate="true"
                />
            `;
            
            // Add label if enabled
            if (this.options.showLabels) {
                const labelAngle = currentAngle + angle / 2;
                const labelRadius = radius * 0.7;
                const labelX = center + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
                const labelY = center + labelRadius * Math.sin((labelAngle * Math.PI) / 180);
                
                svgContent += `
                    <text 
                        x="${labelX}" 
                        y="${labelY}" 
                        text-anchor="middle" 
                        dominant-baseline="middle"
                        fill="white" 
                        font-size="10" 
                        font-weight="600"
                        style="opacity: 0; transition: opacity 0.3s ease ${index * 100 + 200}ms;"
                        data-animate="true"
                    >${item.label}</text>
                `;
            }
            
            currentAngle += angle;
        });
        
        this.element.innerHTML = `
            <svg width="${size}" height="${size}">
                ${svgContent}
            </svg>
        `;
    }
    
    renderRadarChart() {
        const size = this.options.size;
        const center = size / 2;
        const radius = center - 20;
        const numPoints = this.options.data.length;
        
        // Create radar grid
        let svgContent = this.createRadarGrid(center, radius);
        
        // Create data polygon
        const points = this.options.data.map((item, index) => {
            const angle = (index / numPoints) * 2 * Math.PI - Math.PI / 2;
            const value = item.value / 100; // Normalize to 0-1
            const x = center + radius * value * Math.cos(angle);
            const y = center + radius * value * Math.sin(angle);
            return `${x},${y}`;
        });
        
        svgContent += `
            <polygon 
                points="${points.join(' ')}"
                fill="rgba(0, 148, 204, 0.3)"
                stroke="#0094cc"
                stroke-width="2"
                style="opacity: 0; transition: opacity 0.6s ease;"
                data-animate="true"
            />
        `;
        
        // Add data points
        this.options.data.forEach((item, index) => {
            const angle = (index / numPoints) * 2 * Math.PI - Math.PI / 2;
            const value = item.value / 100;
            const x = center + radius * value * Math.cos(angle);
            const y = center + radius * value * Math.sin(angle);
            
            svgContent += `
                <circle 
                    cx="${x}" 
                    cy="${y}" 
                    r="3"
                    fill="#0094cc"
                    stroke="white"
                    stroke-width="1"
                    style="opacity: 0; transition: opacity 0.3s ease ${index * 100}ms;"
                    data-animate="true"
                />
            `;
            
            // Add labels
            if (this.options.showLabels) {
                const labelRadius = radius + 15;
                const labelX = center + labelRadius * Math.cos(angle);
                const labelY = center + labelRadius * Math.sin(angle);
                
                svgContent += `
                    <text 
                        x="${labelX}" 
                        y="${labelY}" 
                        text-anchor="middle" 
                        dominant-baseline="middle"
                        fill="rgba(255,255,255,0.8)" 
                        font-size="9" 
                        font-weight="500"
                        style="opacity: 0; transition: opacity 0.3s ease ${index * 100 + 300}ms;"
                        data-animate="true"
                    >${item.label}</text>
                `;
            }
        });
        
        this.element.innerHTML = `
            <svg width="${size}" height="${size}">
                ${svgContent}
            </svg>
        `;
    }
    
    createRadarGrid(center, radius) {
        let gridContent = '';
        
        // Concentric circles
        for (let i = 1; i <= 5; i++) {
            const r = (radius / 5) * i;
            gridContent += `
                <circle 
                    cx="${center}" 
                    cy="${center}" 
                    r="${r}"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    stroke-width="1"
                />
            `;
        }
        
        // Radial lines
        const numPoints = this.options.data.length;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            
            gridContent += `
                <line 
                    x1="${center}" 
                    y1="${center}" 
                    x2="${x}" 
                    y2="${y}"
                    stroke="rgba(255,255,255,0.1)"
                    stroke-width="1"
                />
            `;
        }
        
        return gridContent;
    }
    
    animateChart() {
        // Animate all elements with data-animate attribute
        setTimeout(() => {
            const animatedElements = this.element.querySelectorAll('[data-animate="true"]');
            animatedElements.forEach(element => {
                element.style.opacity = '1';
            });
        }, 100);
    }
    
    updateData(newData) {
        this.options.data = newData;
        this.render();
        
        if (this.options.animate) {
            this.animateChart();
        }
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
};