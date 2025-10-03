/**
 * BAR CHART - Football Manager style bar chart visualization
 * Creates horizontal/vertical bar charts with smooth animations
 * Following ZENITH principles with 60fps performance
 */

window.BarChart = class BarChart {
    constructor(options = {}) {
        this.options = {
            container: null,
            data: [],
            orientation: 'horizontal',
            width: 300,
            height: 150,
            colors: ['#0094cc', '#00ff88', '#ffb800', '#ff6b35', '#ff4757'],
            showGrid: true,
            showAxis: true,
            showValues: true,
            animate: true,
            animationDuration: 600,
            ...options
        };
        
        this.element = null;
        this.bars = [];
        
        if (this.options.container) {
            this.init();
        }
    }
    
    init() {
        this.createElement();
        this.render();
        
        if (this.options.animate) {
            this.animateBars();
        }
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'bar-chart';
        this.element.style.cssText = `
            width: ${this.options.width}px;
            height: ${this.options.height}px;
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            overflow: hidden;
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
        
        const maxValue = Math.max(...this.options.data.map(d => d.value));
        const isHorizontal = this.options.orientation === 'horizontal';
        
        let html = '';
        
        // Add grid if enabled
        if (this.options.showGrid) {
            html += this.renderGrid();
        }
        
        // Render bars
        this.options.data.forEach((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const color = item.color || this.options.colors[index % this.options.colors.length];
            
            if (isHorizontal) {
                html += this.renderHorizontalBar(item, index, percentage, color);
            } else {
                html += this.renderVerticalBar(item, index, percentage, color);
            }
        });
        
        this.element.innerHTML = html;
    }
    
    renderGrid() {
        const gridLines = [];
        const lineCount = 4;
        
        for (let i = 1; i <= lineCount; i++) {
            const position = (i / (lineCount + 1)) * 100;
            
            if (this.options.orientation === 'horizontal') {
                gridLines.push(`
                    <div style="
                        position: absolute;
                        left: ${position}%;
                        top: 0;
                        bottom: 0;
                        width: 1px;
                        background: rgba(255, 255, 255, 0.1);
                    "></div>
                `);
            } else {
                gridLines.push(`
                    <div style="
                        position: absolute;
                        top: ${position}%;
                        left: 0;
                        right: 0;
                        height: 1px;
                        background: rgba(255, 255, 255, 0.1);
                    "></div>
                `);
            }
        }
        
        return gridLines.join('');
    }
    
    renderHorizontalBar(item, index, percentage, color) {
        const barHeight = 20;
        const barSpacing = 8;
        const totalBarHeight = barHeight + barSpacing;
        const topPosition = index * totalBarHeight + 10;
        
        return `
            <div class="bar-item" style="
                position: absolute;
                left: 60px;
                top: ${topPosition}px;
                height: ${barHeight}px;
                width: calc(100% - 80px);
                background: rgba(255, 255, 255, 0.05);
                border-radius: 2px;
            ">
                <div class="bar-fill" style="
                    height: 100%;
                    width: 0%;
                    background: ${color};
                    border-radius: 2px;
                    transition: width 0.6s cubic-bezier(0.4, 0.0, 0.1, 1);
                    transition-delay: ${index * 100}ms;
                " data-target-width="${percentage}%"></div>
                
                <div class="bar-label" style="
                    position: absolute;
                    left: -55px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.8);
                    white-space: nowrap;
                ">${item.label}</div>
                
                ${this.options.showValues ? `
                    <div class="bar-value" style="
                        position: absolute;
                        right: -25px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 10px;
                        font-weight: 600;
                        color: white;
                    ">${item.value}</div>
                ` : ''}
            </div>
        `;
    }
    
    renderVerticalBar(item, index, percentage, color) {
        const barWidth = 30;
        const barSpacing = 8;
        const totalBarWidth = barWidth + barSpacing;
        const leftPosition = index * totalBarWidth + 20;
        
        return `
            <div class="bar-item" style="
                position: absolute;
                left: ${leftPosition}px;
                bottom: 30px;
                width: ${barWidth}px;
                height: calc(100% - 50px);
                background: rgba(255, 255, 255, 0.05);
                border-radius: 2px;
            ">
                <div class="bar-fill" style="
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 0%;
                    background: ${color};
                    border-radius: 2px;
                    transition: height 0.6s cubic-bezier(0.4, 0.0, 0.1, 1);
                    transition-delay: ${index * 100}ms;
                " data-target-height="${percentage}%"></div>
                
                <div class="bar-label" style="
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.8);
                    white-space: nowrap;
                ">${item.label}</div>
                
                ${this.options.showValues ? `
                    <div class="bar-value" style="
                        position: absolute;
                        top: -20px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 10px;
                        font-weight: 600;
                        color: white;
                    ">${item.value}</div>
                ` : ''}
            </div>
        `;
    }
    
    animateBars() {
        // Animate bars to their target values
        setTimeout(() => {
            const bars = this.element.querySelectorAll('.bar-fill');
            bars.forEach(bar => {
                const targetWidth = bar.dataset.targetWidth;
                const targetHeight = bar.dataset.targetHeight;
                
                if (targetWidth) {
                    bar.style.width = targetWidth;
                }
                
                if (targetHeight) {
                    bar.style.height = targetHeight;
                }
            });
        }, 100);
    }
    
    updateData(newData) {
        this.options.data = newData;
        this.render();
        
        if (this.options.animate) {
            this.animateBars();
        }
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
};