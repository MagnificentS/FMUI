/**
 * ATTRIBUTE CIRCLE - Football Manager style attribute visualization
 * Creates circular progress indicators for player attributes
 * Following ZENITH principles with smooth 60fps animations
 */

window.AttributeCircle = class AttributeCircle {
    constructor(options = {}) {
        this.options = {
            container: null,
            value: 0,
            label: '',
            size: 32,
            customColor: null,
            showLabel: true,
            showValue: true,
            animate: true,
            ...options
        };
        
        this.element = null;
        this.currentValue = 0;
        this.targetValue = this.options.value;
        this.animationId = null;
        
        if (this.options.container) {
            this.init();
        }
    }
    
    init() {
        this.createElement();
        this.render();
        
        if (this.options.animate) {
            this.animateToValue(this.options.value);
        } else {
            this.currentValue = this.options.value;
            this.updateVisual();
        }
    }
    
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'attribute-circle';
        this.element.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            position: relative;
        `;
        
        const container = typeof this.options.container === 'string' 
            ? document.querySelector(this.options.container)
            : this.options.container;
            
        if (container) {
            container.appendChild(this.element);
        }
    }
    
    render() {
        const circleSize = this.options.size;
        const strokeWidth = Math.max(2, circleSize / 16);
        const radius = (circleSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        
        this.element.innerHTML = `
            <div class="circle-container" style="position: relative; width: ${circleSize}px; height: ${circleSize}px;">
                <svg width="${circleSize}" height="${circleSize}" style="transform: rotate(-90deg);">
                    <circle 
                        cx="${circleSize/2}" 
                        cy="${circleSize/2}" 
                        r="${radius}"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        stroke-width="${strokeWidth}"
                    />
                    <circle 
                        class="progress-circle"
                        cx="${circleSize/2}" 
                        cy="${circleSize/2}" 
                        r="${radius}"
                        fill="none"
                        stroke="${this.getColor()}"
                        stroke-width="${strokeWidth}"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${circumference}"
                        stroke-linecap="round"
                        style="transition: stroke-dashoffset 0.3s cubic-bezier(0.4, 0.0, 0.1, 1);"
                    />
                </svg>
                <div class="circle-value" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: ${Math.max(8, circleSize / 4)}px;
                    font-weight: 600;
                    color: white;
                ">${Math.round(this.currentValue)}</div>
            </div>
            ${this.options.showLabel ? `<div class="circle-label" style="font-size: 10px; color: rgba(255,255,255,0.8); text-align: center;">${this.options.label}</div>` : ''}
        `;
    }
    
    getColor() {
        if (this.options.customColor) {
            return this.options.customColor;
        }
        
        // Color based on value (Football Manager style)
        if (this.currentValue >= 80) return '#00ff88'; // Excellent - Green
        if (this.currentValue >= 70) return '#ffb800'; // Good - Yellow
        if (this.currentValue >= 60) return '#ffa502'; // Average - Orange
        if (this.currentValue >= 50) return '#ff6b35'; // Poor - Light Red
        return '#ff4757'; // Very Poor - Red
    }
    
    updateVisual() {
        const circle = this.element.querySelector('.progress-circle');
        const valueElement = this.element.querySelector('.circle-value');
        
        if (circle && valueElement) {
            const radius = parseFloat(circle.getAttribute('r'));
            const circumference = 2 * Math.PI * radius;
            const progress = this.currentValue / 100;
            const dashOffset = circumference - (progress * circumference);
            
            circle.style.strokeDashoffset = dashOffset;
            circle.setAttribute('stroke', this.getColor());
            valueElement.textContent = Math.round(this.currentValue);
        }
    }
    
    animateToValue(targetValue) {
        this.targetValue = targetValue;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const startValue = this.currentValue;
        const startTime = performance.now();
        const duration = 800; // ZENITH timing
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // ZENITH easing - human movement
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.currentValue = startValue + (targetValue - startValue) * easeProgress;
            this.updateVisual();
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    updateValue(newValue) {
        if (this.options.animate) {
            this.animateToValue(newValue);
        } else {
            this.currentValue = newValue;
            this.updateVisual();
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
};