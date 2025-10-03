/**
 * DATA VISUALIZATION COMPONENTS
 * Advanced football management data visualization library
 * Built for professional sports analytics with real-time capabilities
 */

// ================================
// CORE VISUALIZATION ENGINE
// ================================

class DataVisualizationEngine {
    constructor() {
        this.charts = new Map();
        this.themes = this.initializeThemes();
        this.performance = new PerformanceMonitor();
        this.accessibility = new AccessibilityManager();
    }

    initializeThemes() {
        return {
            primary: {
                colors: {
                    success: '#10B981',
                    warning: '#F59E0B', 
                    danger: '#EF4444',
                    info: '#3B82F6',
                    primary: '#6366F1',
                    secondary: '#8B5CF6',
                    gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
                },
                typography: {
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontSize: {
                        xs: '0.75rem',
                        sm: '0.875rem', 
                        base: '1rem',
                        lg: '1.125rem'
                    }
                }
            }
        };
    }

    createChart(type, container, config) {
        const chart = new ChartFactory().create(type, container, config);
        this.charts.set(chart.id, chart);
        return chart;
    }
}

// ================================
// ADVANCED CHART LIBRARY
// ================================

class ChartFactory {
    create(type, container, config) {
        const charts = {
            line: () => new LineChart(container, config),
            bar: () => new BarChart(container, config),
            radar: () => new RadarChart(container, config),
            doughnut: () => new DoughnutChart(container, config),
            area: () => new AreaChart(container, config),
            scatter: () => new ScatterChart(container, config),
            gauge: () => new GaugeChart(container, config),
            heatmap: () => new HeatmapChart(container, config)
        };

        if (!charts[type]) {
            throw new Error(`Chart type "${type}" not supported`);
        }

        return charts[type]();
    }
}

class BaseChart {
    constructor(container, config) {
        this.id = this.generateId();
        this.container = typeof container === 'string' ? 
            document.querySelector(container) : container;
        this.config = this.mergeConfig(config);
        this.canvas = null;
        this.ctx = null;
        this.data = null;
        this.animationFrame = null;
        this.isResponsive = true;
        
        this.init();
    }

    generateId() {
        return 'chart_' + Math.random().toString(36).substr(2, 9);
    }

    mergeConfig(userConfig) {
        const defaultConfig = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            },
            colors: {
                primary: '#3B82F6',
                secondary: '#8B5CF6',
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444'
            },
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)',
                lineWidth: 1
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                textColor: '#ffffff',
                borderRadius: 6,
                padding: 12
            }
        };
        
        return this.deepMerge(defaultConfig, userConfig || {});
    }

    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.setupAccessibility();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.boxSizing = 'border-box';
        this.ctx = this.canvas.getContext('2d');
        
        this.container.appendChild(this.canvas);
        this.resize();
    }

    setupEventListeners() {
        if (this.isResponsive) {
            window.addEventListener('resize', this.debounce(() => this.resize(), 250));
        }
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e));
    }

    setupAccessibility() {
        this.canvas.setAttribute('role', 'img');
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        
        this.draw();
    }

    setData(data) {
        this.data = data;
        this.update();
    }

    update() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    draw() {
        // Override in child classes
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('resize', this.resize);
        this.container.removeChild(this.canvas);
    }
}

// ================================
// LINE CHART FOR PERFORMANCE TRENDS
// ================================

class LineChart extends BaseChart {
    constructor(container, config) {
        super(container, config);
        this.points = [];
        this.hoveredPoint = null;
    }

    draw() {
        if (!this.data) return;

        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Calculate dimensions
        const padding = 60;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Draw grid
        this.drawGrid(ctx, padding, chartWidth, chartHeight);
        
        // Draw axes
        this.drawAxes(ctx, padding, chartWidth, chartHeight);
        
        // Draw data lines
        this.drawLines(ctx, padding, chartWidth, chartHeight);
        
        // Draw points
        this.drawPoints(ctx, padding, chartWidth, chartHeight);
        
        // Draw tooltip
        if (this.hoveredPoint) {
            this.drawTooltip(ctx, this.hoveredPoint);
        }
    }

    drawGrid(ctx, padding, chartWidth, chartHeight) {
        if (!this.config.grid.display) return;
        
        ctx.strokeStyle = this.config.grid.color;
        ctx.lineWidth = this.config.grid.lineWidth;
        ctx.setLineDash([5, 5]);
        
        // Vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 8; i++) {
            const y = padding + (chartHeight / 8) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
    }

    drawAxes(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        // Draw labels
        this.drawAxisLabels(ctx, padding, chartWidth, chartHeight);
    }

    drawAxisLabels(ctx, padding, chartWidth, chartHeight) {
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        // X-axis labels
        if (this.data.labels) {
            this.data.labels.forEach((label, index) => {
                const x = padding + (chartWidth / (this.data.labels.length - 1)) * index;
                ctx.fillText(label, x, padding + chartHeight + 20);
            });
        }
        
        // Y-axis labels
        const maxValue = Math.max(...this.data.datasets.flatMap(d => d.data));
        const minValue = Math.min(...this.data.datasets.flatMap(d => d.data));
        
        for (let i = 0; i <= 8; i++) {
            const value = minValue + ((maxValue - minValue) / 8) * (8 - i);
            const y = padding + (chartHeight / 8) * i;
            ctx.textAlign = 'right';
            ctx.fillText(value.toFixed(1), padding - 10, y + 4);
        }
    }

    drawLines(ctx, padding, chartWidth, chartHeight) {
        const maxValue = Math.max(...this.data.datasets.flatMap(d => d.data));
        const minValue = Math.min(...this.data.datasets.flatMap(d => d.data));
        const valueRange = maxValue - minValue;
        
        this.data.datasets.forEach((dataset, datasetIndex) => {
            ctx.strokeStyle = dataset.borderColor || this.config.colors.primary;
            ctx.lineWidth = dataset.borderWidth || 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Create gradient if specified
            if (dataset.fill && dataset.backgroundColor) {
                const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
                if (Array.isArray(dataset.backgroundColor)) {
                    dataset.backgroundColor.forEach((color, index) => {
                        gradient.addColorStop(index / (dataset.backgroundColor.length - 1), color);
                    });
                } else {
                    gradient.addColorStop(0, dataset.backgroundColor);
                    gradient.addColorStop(1, 'transparent');
                }
                ctx.fillStyle = gradient;
            }
            
            ctx.beginPath();
            
            dataset.data.forEach((value, index) => {
                const x = padding + (chartWidth / (dataset.data.length - 1)) * index;
                const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Store points for interaction
                this.points.push({
                    x, y, value, index, datasetIndex,
                    dataset: dataset.label || `Dataset ${datasetIndex + 1}`
                });
            });
            
            ctx.stroke();
            
            // Fill area if specified
            if (dataset.fill) {
                ctx.lineTo(padding + chartWidth, padding + chartHeight);
                ctx.lineTo(padding, padding + chartHeight);
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    drawPoints(ctx, padding, chartWidth, chartHeight) {
        this.points.forEach(point => {
            ctx.fillStyle = point.datasetIndex === 0 ? 
                this.config.colors.primary : this.config.colors.secondary;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight hovered point
            if (this.hoveredPoint && 
                Math.abs(this.hoveredPoint.x - point.x) < 10 && 
                Math.abs(this.hoveredPoint.y - point.y) < 10) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }

    drawTooltip(ctx, point) {
        const tooltipWidth = 120;
        const tooltipHeight = 60;
        let tooltipX = point.x + 10;
        let tooltipY = point.y - tooltipHeight - 10;
        
        // Adjust position if tooltip would go outside canvas
        if (tooltipX + tooltipWidth > this.canvas.width) {
            tooltipX = point.x - tooltipWidth - 10;
        }
        if (tooltipY < 0) {
            tooltipY = point.y + 10;
        }
        
        // Draw tooltip background
        ctx.fillStyle = this.config.tooltip.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 6);
        ctx.fill();
        
        // Draw tooltip text
        ctx.fillStyle = this.config.tooltip.textColor;
        ctx.font = '12px Inter';
        ctx.textAlign = 'left';
        
        const nearestPoint = this.findNearestPoint(point.x, point.y);
        if (nearestPoint) {
            ctx.fillText(nearestPoint.dataset, tooltipX + 8, tooltipY + 20);
            ctx.fillText(`Value: ${nearestPoint.value}`, tooltipX + 8, tooltipY + 40);
        }
    }

    findNearestPoint(x, y) {
        let nearest = null;
        let minDistance = Infinity;
        
        this.points.forEach(point => {
            const distance = Math.sqrt(
                Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
            );
            if (distance < minDistance && distance < 20) {
                minDistance = distance;
                nearest = point;
            }
        });
        
        return nearest;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const nearestPoint = this.findNearestPoint(x, y);
        
        if (nearestPoint !== this.hoveredPoint) {
            this.hoveredPoint = nearestPoint;
            this.canvas.style.cursor = nearestPoint ? 'pointer' : 'default';
            this.update();
        }
    }
}

// ================================
// BAR CHART FOR STATISTICAL COMPARISONS
// ================================

class BarChart extends BaseChart {
    constructor(container, config) {
        super(container, config);
        this.bars = [];
        this.hoveredBar = null;
        this.orientation = config.orientation || 'vertical'; // 'vertical' or 'horizontal'
    }

    draw() {
        if (!this.data) return;

        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        const padding = 60;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        this.drawGrid(ctx, padding, chartWidth, chartHeight);
        this.drawAxes(ctx, padding, chartWidth, chartHeight);
        this.drawBars(ctx, padding, chartWidth, chartHeight);
        
        if (this.hoveredBar) {
            this.drawTooltip(ctx, this.hoveredBar);
        }
    }

    drawBars(ctx, padding, chartWidth, chartHeight) {
        const maxValue = Math.max(...this.data.datasets.flatMap(d => d.data));
        const minValue = Math.min(0, ...this.data.datasets.flatMap(d => d.data));
        const valueRange = maxValue - minValue;
        
        const categoryCount = this.data.labels.length;
        const datasetCount = this.data.datasets.length;
        
        const categoryWidth = chartWidth / categoryCount;
        const barWidth = (categoryWidth * 0.8) / datasetCount;
        const barSpacing = categoryWidth * 0.1;
        
        this.bars = []; // Reset bars array
        
        this.data.datasets.forEach((dataset, datasetIndex) => {
            const color = dataset.backgroundColor || this.getDatasetColor(datasetIndex);
            
            dataset.data.forEach((value, categoryIndex) => {
                const barHeight = Math.abs(value / valueRange) * chartHeight;
                const barX = padding + (categoryIndex * categoryWidth) + 
                            barSpacing + (datasetIndex * barWidth);
                
                let barY;
                if (value >= 0) {
                    const zeroY = padding + chartHeight - (Math.abs(minValue) / valueRange) * chartHeight;
                    barY = zeroY - barHeight;
                } else {
                    const zeroY = padding + chartHeight - (Math.abs(minValue) / valueRange) * chartHeight;
                    barY = zeroY;
                }
                
                // Create gradient for bars
                const gradient = ctx.createLinearGradient(0, barY, 0, barY + barHeight);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, this.adjustColor(color, -20));
                
                ctx.fillStyle = gradient;
                ctx.fillRect(barX, barY, barWidth, barHeight);
                
                // Add border to bars
                ctx.strokeStyle = this.adjustColor(color, -40);
                ctx.lineWidth = 1;
                ctx.strokeRect(barX, barY, barWidth, barHeight);
                
                // Store bar data for interactions
                this.bars.push({
                    x: barX,
                    y: barY,
                    width: barWidth,
                    height: barHeight,
                    value: value,
                    label: this.data.labels[categoryIndex],
                    dataset: dataset.label || `Dataset ${datasetIndex + 1}`,
                    color: color
                });
            });
        });
    }

    getDatasetColor(index) {
        const colors = [
            this.config.colors.primary,
            this.config.colors.secondary,
            this.config.colors.success,
            this.config.colors.warning,
            this.config.colors.danger
        ];
        return colors[index % colors.length];
    }

    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    drawGrid(ctx, padding, chartWidth, chartHeight) {
        if (!this.config.grid.display) return;
        
        ctx.strokeStyle = this.config.grid.color;
        ctx.lineWidth = this.config.grid.lineWidth;
        ctx.setLineDash([2, 4]);
        
        // Horizontal grid lines
        for (let i = 0; i <= 10; i++) {
            const y = padding + (chartHeight / 10) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
    }

    drawAxes(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.stroke();
        
        this.drawAxisLabels(ctx, padding, chartWidth, chartHeight);
    }

    drawAxisLabels(ctx, padding, chartWidth, chartHeight) {
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Inter';
        
        // X-axis labels (categories)
        ctx.textAlign = 'center';
        this.data.labels.forEach((label, index) => {
            const x = padding + (chartWidth / this.data.labels.length) * (index + 0.5);
            ctx.fillText(label, x, padding + chartHeight + 20);
        });
        
        // Y-axis labels (values)
        const maxValue = Math.max(...this.data.datasets.flatMap(d => d.data));
        const minValue = Math.min(0, ...this.data.datasets.flatMap(d => d.data));
        
        ctx.textAlign = 'right';
        for (let i = 0; i <= 10; i++) {
            const value = minValue + ((maxValue - minValue) / 10) * (10 - i);
            const y = padding + (chartHeight / 10) * i;
            ctx.fillText(value.toFixed(0), padding - 10, y + 4);
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const hoveredBar = this.bars.find(bar => 
            x >= bar.x && x <= bar.x + bar.width &&
            y >= bar.y && y <= bar.y + bar.height
        );
        
        if (hoveredBar !== this.hoveredBar) {
            this.hoveredBar = hoveredBar;
            this.canvas.style.cursor = hoveredBar ? 'pointer' : 'default';
            this.update();
        }
    }

    drawTooltip(ctx, bar) {
        const tooltipWidth = 140;
        const tooltipHeight = 80;
        let tooltipX = bar.x + bar.width / 2 - tooltipWidth / 2;
        let tooltipY = bar.y - tooltipHeight - 10;
        
        // Adjust position if tooltip would go outside canvas
        if (tooltipX + tooltipWidth > this.canvas.width) {
            tooltipX = this.canvas.width - tooltipWidth - 10;
        }
        if (tooltipX < 10) {
            tooltipX = 10;
        }
        if (tooltipY < 0) {
            tooltipY = bar.y + bar.height + 10;
        }
        
        // Draw tooltip background with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        
        ctx.fillStyle = this.config.tooltip.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        
        // Draw tooltip content
        ctx.fillStyle = this.config.tooltip.textColor;
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'left';
        
        ctx.fillText(bar.dataset, tooltipX + 10, tooltipY + 20);
        ctx.font = '11px Inter';
        ctx.fillText(`Category: ${bar.label}`, tooltipX + 10, tooltipY + 40);
        ctx.fillText(`Value: ${bar.value.toFixed(1)}`, tooltipX + 10, tooltipY + 60);
    }
}

// ================================
// RADAR CHART FOR MULTI-DIMENSIONAL ANALYSIS
// ================================

class RadarChart extends BaseChart {
    constructor(container, config) {
        super(container, config);
        this.center = { x: 0, y: 0 };
        this.radius = 0;
        this.angleStep = 0;
    }

    draw() {
        if (!this.data) return;

        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        this.center = { x: width / 2, y: height / 2 };
        this.radius = Math.min(width, height) / 2 - 60;
        this.angleStep = (Math.PI * 2) / this.data.labels.length;
        
        this.drawGrid(ctx);
        this.drawAxes(ctx);
        this.drawData(ctx);
        this.drawLabels(ctx);
    }

    drawGrid(ctx) {
        ctx.strokeStyle = this.config.grid.color;
        ctx.lineWidth = 1;
        
        // Draw concentric circles
        for (let i = 1; i <= 5; i++) {
            const radius = (this.radius / 5) * i;
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    drawAxes(ctx) {
        ctx.strokeStyle = this.config.grid.color;
        ctx.lineWidth = 1;
        
        // Draw axes from center to each point
        for (let i = 0; i < this.data.labels.length; i++) {
            const angle = i * this.angleStep - Math.PI / 2;
            const x = this.center.x + Math.cos(angle) * this.radius;
            const y = this.center.y + Math.sin(angle) * this.radius;
            
            ctx.beginPath();
            ctx.moveTo(this.center.x, this.center.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    drawData(ctx) {
        const maxValue = Math.max(...this.data.datasets.flatMap(d => d.data));
        
        this.data.datasets.forEach((dataset, index) => {
            const color = dataset.borderColor || this.getDatasetColor(index);
            const fillColor = dataset.backgroundColor || 
                             (color + (dataset.fill ? '30' : '00'));
            
            ctx.strokeStyle = color;
            ctx.fillStyle = fillColor;
            ctx.lineWidth = dataset.borderWidth || 2;
            
            ctx.beginPath();
            
            dataset.data.forEach((value, i) => {
                const angle = i * this.angleStep - Math.PI / 2;
                const distance = (value / maxValue) * this.radius;
                const x = this.center.x + Math.cos(angle) * distance;
                const y = this.center.y + Math.sin(angle) * distance;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.closePath();
            
            if (dataset.fill) {
                ctx.fill();
            }
            ctx.stroke();
            
            // Draw points
            dataset.data.forEach((value, i) => {
                const angle = i * this.angleStep - Math.PI / 2;
                const distance = (value / maxValue) * this.radius;
                const x = this.center.x + Math.cos(angle) * distance;
                const y = this.center.y + Math.sin(angle) * distance;
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }

    drawLabels(ctx) {
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        this.data.labels.forEach((label, i) => {
            const angle = i * this.angleStep - Math.PI / 2;
            const distance = this.radius + 20;
            const x = this.center.x + Math.cos(angle) * distance;
            const y = this.center.y + Math.sin(angle) * distance;
            
            // Adjust text alignment based on position
            if (Math.abs(Math.cos(angle)) > 0.5) {
                ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
            } else {
                ctx.textAlign = 'center';
            }
            
            ctx.fillText(label, x, y);
        });
    }

    getDatasetColor(index) {
        const colors = [
            this.config.colors.primary,
            this.config.colors.secondary,
            this.config.colors.success,
            this.config.colors.warning,
            this.config.colors.danger
        ];
        return colors[index % colors.length];
    }
}

// ================================
// DOUGHNUT CHART FOR CATEGORICAL DATA
// ================================

class DoughnutChart extends BaseChart {
    constructor(container, config) {
        super(container, config);
        this.segments = [];
        this.hoveredSegment = null;
        this.innerRadius = config.innerRadius || 0.5;
        this.animationProgress = 0;
    }

    draw() {
        if (!this.data) return;

        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.min(width, height) / 2 - 40;
        const innerRadius = outerRadius * this.innerRadius;
        
        // Animate the chart
        if (this.animationProgress < 1) {
            this.animationProgress += 0.02;
            requestAnimationFrame(() => this.draw());
        }
        
        this.drawSegments(ctx, centerX, centerY, innerRadius, outerRadius);
        this.drawCenterText(ctx, centerX, centerY);
        this.drawLegend(ctx);
    }

    drawSegments(ctx, centerX, centerY, innerRadius, outerRadius) {
        const total = this.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
        let currentAngle = -Math.PI / 2;
        
        this.segments = [];
        
        this.data.datasets[0].data.forEach((value, index) => {
            const segmentAngle = (value / total) * Math.PI * 2 * this.animationProgress;
            const color = this.data.datasets[0].backgroundColor[index] || 
                         this.getSegmentColor(index);
            
            // Draw segment
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, 
                   currentAngle + segmentAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + segmentAngle, 
                   currentAngle, true);
            ctx.closePath();
            ctx.fill();
            
            // Add subtle stroke
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Highlight hovered segment
            if (this.hoveredSegment === index) {
                ctx.strokeStyle = '#374151';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Draw segment slightly larger
                const expandedRadius = outerRadius + 10;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(centerX, centerY, expandedRadius, currentAngle, 
                       currentAngle + segmentAngle);
                ctx.arc(centerX, centerY, innerRadius, currentAngle + segmentAngle, 
                       currentAngle, true);
                ctx.closePath();
                ctx.fill();
            }
            
            // Store segment data
            this.segments.push({
                startAngle: currentAngle,
                endAngle: currentAngle + segmentAngle,
                value: value,
                percentage: (value / total * 100).toFixed(1),
                label: this.data.labels[index],
                color: color,
                index: index
            });
            
            currentAngle += segmentAngle;
        });
    }

    drawCenterText(ctx, centerX, centerY) {
        if (this.hoveredSegment !== null) {
            const segment = this.segments[this.hoveredSegment];
            
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 24px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillText(`${segment.percentage}%`, centerX, centerY - 10);
            
            ctx.font = '14px Inter';
            ctx.fillText(segment.label, centerX, centerY + 15);
        } else {
            // Show total
            const total = this.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
            
            ctx.fillStyle = '#374151';
            ctx.font = 'bold 20px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillText('Total', centerX, centerY - 10);
            ctx.fillText(total.toString(), centerX, centerY + 15);
        }
    }

    drawLegend(ctx) {
        const legendX = 20;
        let legendY = 40;
        const itemHeight = 25;
        
        ctx.font = '12px Inter';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        this.segments.forEach((segment, index) => {
            // Draw color box
            ctx.fillStyle = segment.color;
            ctx.fillRect(legendX, legendY - 6, 12, 12);
            
            // Draw text
            ctx.fillStyle = '#374151';
            ctx.fillText(
                `${segment.label}: ${segment.value} (${segment.percentage}%)`,
                legendX + 20,
                legendY
            );
            
            legendY += itemHeight;
        });
    }

    getSegmentColor(index) {
        const colors = [
            '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
            '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
        ];
        return colors[index % colors.length];
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;
        
        const outerRadius = Math.min(this.canvas.width, this.canvas.height) / 2 - 40;
        const innerRadius = outerRadius * this.innerRadius;
        
        let hoveredSegment = null;
        
        if (distance >= innerRadius && distance <= outerRadius) {
            this.segments.forEach((segment, index) => {
                if (normalizedAngle >= segment.startAngle && 
                    normalizedAngle <= segment.endAngle) {
                    hoveredSegment = index;
                }
            });
        }
        
        if (hoveredSegment !== this.hoveredSegment) {
            this.hoveredSegment = hoveredSegment;
            this.canvas.style.cursor = hoveredSegment !== null ? 'pointer' : 'default';
            this.update();
        }
    }
}

// ================================
// GAUGE CHART FOR KPI MONITORING
// ================================

class GaugeChart extends BaseChart {
    constructor(container, config) {
        super(container, config);
        this.value = config.value || 0;
        this.min = config.min || 0;
        this.max = config.max || 100;
        this.target = config.target || null;
        this.thresholds = config.thresholds || [];
        this.animatedValue = this.min;
    }

    draw() {
        if (!this.data && this.value === undefined) return;

        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        
        // Animate to target value
        const targetValue = this.data ? this.data.value : this.value;
        if (Math.abs(this.animatedValue - targetValue) > 0.5) {
            this.animatedValue += (targetValue - this.animatedValue) * 0.1;
            requestAnimationFrame(() => this.draw());
        }
        
        this.drawGaugeBackground(ctx, centerX, centerY, radius);
        this.drawGaugeArc(ctx, centerX, centerY, radius);
        this.drawNeedle(ctx, centerX, centerY, radius);
        this.drawCenterValue(ctx, centerX, centerY);
        this.drawTicks(ctx, centerX, centerY, radius);
    }

    drawGaugeBackground(ctx, centerX, centerY, radius) {
        // Background arc
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, Math.PI, 0);
        ctx.stroke();
    }

    drawGaugeArc(ctx, centerX, centerY, radius) {
        const progress = (this.animatedValue - this.min) / (this.max - this.min);
        const startAngle = Math.PI;
        const endAngle = Math.PI + (Math.PI * progress);
        
        // Create gradient
        const gradient = ctx.createLinearGradient(
            centerX - radius, centerY,
            centerX + radius, centerY
        );
        
        // Apply color based on thresholds
        const color = this.getColorForValue(this.animatedValue);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.adjustColor(color, 20));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 10, startAngle, endAngle);
        ctx.stroke();
        
        // Draw target indicator if specified
        if (this.target !== null) {
            const targetProgress = (this.target - this.min) / (this.max - this.min);
            const targetAngle = Math.PI + (Math.PI * targetProgress);
            
            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 5, targetAngle - 0.02, targetAngle + 0.02);
            ctx.stroke();
        }
    }

    drawNeedle(ctx, centerX, centerY, radius) {
        const progress = (this.animatedValue - this.min) / (this.max - this.min);
        const angle = Math.PI + (Math.PI * progress);
        
        const needleLength = radius - 30;
        const needleX = centerX + Math.cos(angle) * needleLength;
        const needleY = centerY + Math.sin(angle) * needleLength;
        
        // Draw needle
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(needleX, needleY);
        ctx.stroke();
        
        // Draw center circle
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCenterValue(ctx, centerX, centerY) {
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(
            Math.round(this.animatedValue).toString(),
            centerX,
            centerY + 40
        );
        
        if (this.config.unit) {
            ctx.font = '14px Inter';
            ctx.fillText(this.config.unit, centerX, centerY + 65);
        }
    }

    drawTicks(ctx, centerX, centerY, radius) {
        ctx.strokeStyle = '#6B7280';
        ctx.lineWidth = 2;
        
        const tickCount = 5;
        for (let i = 0; i <= tickCount; i++) {
            const progress = i / tickCount;
            const angle = Math.PI + (Math.PI * progress);
            const value = this.min + (this.max - this.min) * progress;
            
            const outerRadius = radius - 5;
            const innerRadius = radius - 15;
            
            const x1 = centerX + Math.cos(angle) * innerRadius;
            const y1 = centerY + Math.sin(angle) * innerRadius;
            const x2 = centerX + Math.cos(angle) * outerRadius;
            const y2 = centerY + Math.sin(angle) * outerRadius;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Draw tick labels
            ctx.fillStyle = '#6B7280';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const labelRadius = radius - 25;
            const labelX = centerX + Math.cos(angle) * labelRadius;
            const labelY = centerY + Math.sin(angle) * labelRadius;
            
            ctx.fillText(Math.round(value).toString(), labelX, labelY);
        }
    }

    getColorForValue(value) {
        if (this.thresholds.length === 0) {
            return this.config.colors.primary;
        }
        
        for (let i = this.thresholds.length - 1; i >= 0; i--) {
            if (value >= this.thresholds[i].value) {
                return this.thresholds[i].color;
            }
        }
        
        return this.config.colors.primary;
    }

    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    setValue(value) {
        this.value = Math.max(this.min, Math.min(this.max, value));
        this.update();
    }
}

// ================================
// PERFORMANCE TREND COMPONENTS
// ================================

class PerformanceTrendWidget {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.chart = null;
        this.init();
    }

    init() {
        this.createHTML();
        this.setupChart();
    }

    createHTML() {
        this.container.innerHTML = `
            <div class="performance-trend-widget">
                <div class="widget-header">
                    <h3 class="widget-title">${this.config.title || 'Performance Trend'}</h3>
                    <div class="widget-controls">
                        <select class="period-selector">
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                    </div>
                </div>
                <div class="chart-container" id="trend-chart-${Math.random().toString(36).substr(2, 9)}"></div>
                <div class="trend-stats">
                    <div class="stat-item">
                        <span class="stat-label">Current</span>
                        <span class="stat-value" id="current-value">--</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Change</span>
                        <span class="stat-value trend-change" id="trend-change">--</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Average</span>
                        <span class="stat-value" id="average-value">--</span>
                    </div>
                </div>
            </div>
        `;
        
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .performance-trend-widget {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border: 1px solid #E5E7EB;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .widget-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                }

                .period-selector {
                    padding: 6px 12px;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    font-size: 14px;
                    background: #ffffff;
                    color: #374151;
                    cursor: pointer;
                }

                .period-selector:focus {
                    outline: none;
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .chart-container {
                    height: 300px;
                    margin-bottom: 20px;
                }

                .trend-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }

                .stat-item {
                    text-align: center;
                    padding: 12px;
                    background: #F9FAFB;
                    border-radius: 8px;
                }

                .stat-label {
                    display: block;
                    font-size: 12px;
                    color: #6B7280;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .stat-value {
                    display: block;
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                }

                .trend-change.positive {
                    color: #10B981;
                }

                .trend-change.negative {
                    color: #EF4444;
                }

                .trend-change.neutral {
                    color: #6B7280;
                }
            </style>
        `;
        
        if (!document.querySelector('#performance-trend-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'performance-trend-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    setupChart() {
        const chartContainer = this.container.querySelector('.chart-container');
        const engine = new DataVisualizationEngine();
        
        this.chart = engine.createChart('line', chartContainer, {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            },
            colors: {
                primary: '#3B82F6',
                secondary: '#10B981'
            },
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
            }
        });
        
        // Setup period selector
        const periodSelector = this.container.querySelector('.period-selector');
        periodSelector.addEventListener('change', (e) => {
            this.updatePeriod(e.target.value);
        });
    }

    setData(data) {
        if (!this.chart) return;
        
        this.chart.setData(data);
        this.updateStats(data);
    }

    updateStats(data) {
        if (!data.datasets || data.datasets.length === 0) return;
        
        const values = data.datasets[0].data;
        const current = values[values.length - 1];
        const previous = values[values.length - 2];
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        // Update current value
        const currentElement = this.container.querySelector('#current-value');
        currentElement.textContent = current.toFixed(1);
        
        // Update change
        const changeElement = this.container.querySelector('#trend-change');
        const change = current - previous;
        const changePercent = ((change / previous) * 100).toFixed(1);
        
        changeElement.textContent = `${change > 0 ? '+' : ''}${changePercent}%`;
        changeElement.className = 'stat-value trend-change ' + 
            (change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral');
        
        // Update average
        const averageElement = this.container.querySelector('#average-value');
        averageElement.textContent = average.toFixed(1);
    }

    updatePeriod(period) {
        // Emit event for data update
        this.container.dispatchEvent(new CustomEvent('periodChange', {
            detail: { period }
        }));
    }
}

// ================================
// COMPARATIVE ANALYSIS WIDGETS
// ================================

class ComparisonWidget {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.charts = {};
        this.init();
    }

    init() {
        this.createHTML();
        this.setupCharts();
    }

    createHTML() {
        this.container.innerHTML = `
            <div class="comparison-widget">
                <div class="widget-header">
                    <h3 class="widget-title">${this.config.title || 'Comparison Analysis'}</h3>
                    <div class="comparison-controls">
                        <select class="metric-selector">
                            <option value="overall">Overall Rating</option>
                            <option value="attacking">Attacking</option>
                            <option value="defending">Defending</option>
                            <option value="physical">Physical</option>
                            <option value="mental">Mental</option>
                        </select>
                    </div>
                </div>
                <div class="comparison-content">
                    <div class="comparison-radar" id="radar-chart-${Math.random().toString(36).substr(2, 9)}"></div>
                    <div class="comparison-bars" id="bar-chart-${Math.random().toString(36).substr(2, 9)}"></div>
                </div>
                <div class="comparison-summary">
                    <div class="summary-item">
                        <span class="summary-label">Better in</span>
                        <span class="summary-value" id="better-count">--</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Equal in</span>
                        <span class="summary-value" id="equal-count">--</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Worse in</span>
                        <span class="summary-value" id="worse-count">--</span>
                    </div>
                </div>
            </div>
        `;
        
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .comparison-widget {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border: 1px solid #E5E7EB;
                }

                .comparison-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .comparison-radar,
                .comparison-bars {
                    height: 300px;
                    background: #F9FAFB;
                    border-radius: 8px;
                    padding: 15px;
                }

                .comparison-summary {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }

                .summary-item {
                    text-align: center;
                    padding: 12px;
                    background: #F3F4F6;
                    border-radius: 8px;
                }

                .summary-label {
                    display: block;
                    font-size: 12px;
                    color: #6B7280;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .summary-value {
                    display: block;
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                }

                @media (max-width: 768px) {
                    .comparison-content {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
        
        if (!document.querySelector('#comparison-widget-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'comparison-widget-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    setupCharts() {
        const engine = new DataVisualizationEngine();
        
        // Setup radar chart
        const radarContainer = this.container.querySelector('.comparison-radar');
        this.charts.radar = engine.createChart('radar', radarContainer, {
            responsive: true,
            colors: {
                primary: '#3B82F6',
                secondary: '#EF4444'
            }
        });
        
        // Setup bar chart
        const barContainer = this.container.querySelector('.comparison-bars');
        this.charts.bar = engine.createChart('bar', barContainer, {
            responsive: true,
            colors: {
                primary: '#3B82F6',
                secondary: '#EF4444'
            }
        });
        
        // Setup metric selector
        const metricSelector = this.container.querySelector('.metric-selector');
        metricSelector.addEventListener('change', (e) => {
            this.updateMetric(e.target.value);
        });
    }

    setComparisonData(data) {
        if (!data.player1 || !data.player2) return;
        
        // Update radar chart
        const radarData = {
            labels: data.attributes,
            datasets: [
                {
                    label: data.player1.name,
                    data: data.player1.values,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    fill: true
                },
                {
                    label: data.player2.name,
                    data: data.player2.values,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    fill: true
                }
            ]
        };
        
        this.charts.radar.setData(radarData);
        
        // Update bar chart
        const barData = {
            labels: data.attributes,
            datasets: [
                {
                    label: data.player1.name,
                    data: data.player1.values,
                    backgroundColor: '#3B82F6'
                },
                {
                    label: data.player2.name,
                    data: data.player2.values,
                    backgroundColor: '#EF4444'
                }
            ]
        };
        
        this.charts.bar.setData(barData);
        
        // Update summary
        this.updateSummary(data.player1.values, data.player2.values);
    }

    updateSummary(values1, values2) {
        let better = 0, equal = 0, worse = 0;
        
        values1.forEach((val1, index) => {
            const val2 = values2[index];
            if (val1 > val2) better++;
            else if (val1 === val2) equal++;
            else worse++;
        });
        
        this.container.querySelector('#better-count').textContent = better;
        this.container.querySelector('#equal-count').textContent = equal;
        this.container.querySelector('#worse-count').textContent = worse;
    }

    updateMetric(metric) {
        this.container.dispatchEvent(new CustomEvent('metricChange', {
            detail: { metric }
        }));
    }
}

// ================================
// REAL-TIME DASHBOARD METRICS
// ================================

class DashboardMetrics {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.widgets = new Map();
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.createHTML();
        this.setupWidgets();
        this.startRealTimeUpdates();
    }

    createHTML() {
        this.container.innerHTML = `
            <div class="dashboard-metrics">
                <div class="metrics-grid" id="metrics-grid">
                    <!-- Widgets will be dynamically added here -->
                </div>
                <div class="dashboard-controls">
                    <button class="refresh-btn" id="refresh-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                        </svg>
                        Refresh
                    </button>
                    <div class="update-indicator" id="update-indicator">
                        <span class="indicator-dot"></span>
                        Live
                    </div>
                </div>
            </div>
        `;
        
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .dashboard-metrics {
                    background: #F9FAFB;
                    border-radius: 12px;
                    padding: 20px;
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .dashboard-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 20px;
                    border-top: 1px solid #E5E7EB;
                }

                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: #3B82F6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .refresh-btn:hover {
                    background: #2563EB;
                }

                .update-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #6B7280;
                }

                .indicator-dot {
                    width: 8px;
                    height: 8px;
                    background: #10B981;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .metric-widget {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    border: 1px solid #E5E7EB;
                }

                .metric-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .metric-title {
                    font-size: 14px;
                    font-weight: 500;
                    color: #6B7280;
                    margin: 0;
                }

                .metric-value {
                    font-size: 32px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                    line-height: 1;
                }

                .metric-change {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    margin-top: 8px;
                }

                .metric-change.positive {
                    color: #10B981;
                }

                .metric-change.negative {
                    color: #EF4444;
                }

                .metric-change.neutral {
                    color: #6B7280;
                }

                .metric-chart {
                    height: 60px;
                    margin-top: 15px;
                }
            </style>
        `;
        
        if (!document.querySelector('#dashboard-metrics-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'dashboard-metrics-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    setupWidgets() {
        const grid = this.container.querySelector('#metrics-grid');
        
        // Setup refresh button
        const refreshBtn = this.container.querySelector('#refresh-btn');
        refreshBtn.addEventListener('click', () => {
            this.refreshAllWidgets();
        });
    }

    addMetricWidget(id, config) {
        const grid = this.container.querySelector('#metrics-grid');
        const widgetElement = document.createElement('div');
        widgetElement.className = 'metric-widget';
        widgetElement.id = `widget-${id}`;
        
        widgetElement.innerHTML = `
            <div class="metric-header">
                <h4 class="metric-title">${config.title}</h4>
                <div class="metric-status"></div>
            </div>
            <div class="metric-content">
                <h2 class="metric-value">--</h2>
                <div class="metric-change">
                    <span class="change-indicator"></span>
                    <span class="change-text">--</span>
                </div>
            </div>
            <div class="metric-chart" id="chart-${id}"></div>
        `;
        
        grid.appendChild(widgetElement);
        
        // Create chart if specified
        if (config.chartType) {
            const engine = new DataVisualizationEngine();
            const chartContainer = widgetElement.querySelector(`#chart-${id}`);
            
            const chart = engine.createChart(config.chartType, chartContainer, {
                responsive: true,
                animation: { duration: 300 },
                grid: { display: false },
                colors: { primary: config.color || '#3B82F6' }
            });
            
            this.widgets.set(id, {
                element: widgetElement,
                chart: chart,
                config: config,
                data: null
            });
        } else {
            this.widgets.set(id, {
                element: widgetElement,
                chart: null,
                config: config,
                data: null
            });
        }
        
        return widgetElement;
    }

    updateWidget(id, data) {
        const widget = this.widgets.get(id);
        if (!widget) return;
        
        const valueElement = widget.element.querySelector('.metric-value');
        const changeElement = widget.element.querySelector('.metric-change');
        
        // Update value
        if (typeof data.value === 'number') {
            valueElement.textContent = this.formatValue(data.value, widget.config.format);
        } else {
            valueElement.textContent = data.value;
        }
        
        // Update change indicator
        if (data.change !== undefined) {
            const changeText = widget.element.querySelector('.change-text');
            const changeIndicator = widget.element.querySelector('.change-indicator');
            
            const changeValue = Math.abs(data.change);
            const changePercent = data.changePercent || ((data.change / data.previousValue) * 100);
            
            changeText.textContent = `${Math.abs(changePercent).toFixed(1)}%`;
            
            if (data.change > 0) {
                changeElement.className = 'metric-change positive';
                changeIndicator.innerHTML = '↗';
            } else if (data.change < 0) {
                changeElement.className = 'metric-change negative';
                changeIndicator.innerHTML = '↘';
            } else {
                changeElement.className = 'metric-change neutral';
                changeIndicator.innerHTML = '→';
            }
        }
        
        // Update chart
        if (widget.chart && data.chartData) {
            widget.chart.setData(data.chartData);
        }
        
        widget.data = data;
    }

    formatValue(value, format) {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(value);
            case 'percentage':
                return `${value.toFixed(1)}%`;
            case 'decimal':
                return value.toFixed(2);
            case 'integer':
                return Math.round(value).toString();
            default:
                return value.toString();
        }
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.container.dispatchEvent(new CustomEvent('updateRequest'));
        }, 30000); // Update every 30 seconds
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    refreshAllWidgets() {
        this.container.dispatchEvent(new CustomEvent('refreshRequest'));
        
        // Add visual feedback
        const refreshBtn = this.container.querySelector('#refresh-btn');
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            refreshBtn.style.transform = '';
        }, 500);
    }

    destroy() {
        this.stopRealTimeUpdates();
        this.widgets.forEach(widget => {
            if (widget.chart) {
                widget.chart.destroy();
            }
        });
        this.widgets.clear();
    }
}

// ================================
// DATA TABLE ENHANCEMENTS
// ================================

class AdvancedDataTable {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.data = [];
        this.filteredData = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.currentPage = 1;
        this.pageSize = config.pageSize || 25;
        this.filters = new Map();
        this.init();
    }

    init() {
        this.createHTML();
        this.setupEventListeners();
    }

    createHTML() {
        this.container.innerHTML = `
            <div class="advanced-data-table">
                <div class="table-toolbar">
                    <div class="table-search">
                        <input type="text" placeholder="Search..." class="search-input" id="table-search">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                    </div>
                    <div class="table-actions">
                        <button class="action-btn" id="export-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export
                        </button>
                        <button class="action-btn" id="filter-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table" id="data-table">
                        <thead id="table-head">
                            <!-- Headers will be dynamically generated -->
                        </thead>
                        <tbody id="table-body">
                            <!-- Rows will be dynamically generated -->
                        </tbody>
                    </table>
                </div>
                <div class="table-footer">
                    <div class="table-info">
                        <span id="table-info-text">Showing 0 of 0 entries</span>
                    </div>
                    <div class="table-pagination">
                        <button class="pagination-btn" id="prev-btn" disabled>Previous</button>
                        <div class="pagination-numbers" id="pagination-numbers"></div>
                        <button class="pagination-btn" id="next-btn" disabled>Next</button>
                    </div>
                </div>
                <div class="filter-panel" id="filter-panel" style="display: none;">
                    <div class="filter-header">
                        <h4>Filters</h4>
                        <button class="close-filter" id="close-filter">×</button>
                    </div>
                    <div class="filter-content" id="filter-content">
                        <!-- Filter controls will be dynamically generated -->
                    </div>
                    <div class="filter-actions">
                        <button class="clear-filters" id="clear-filters">Clear All</button>
                        <button class="apply-filters" id="apply-filters">Apply</button>
                    </div>
                </div>
            </div>
        `;
        
        this.addStyles();
    }

    addStyles() {
        const styles = `
            <style>
                .advanced-data-table {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid #E5E7EB;
                    overflow: hidden;
                }

                .table-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: #F9FAFB;
                    border-bottom: 1px solid #E5E7EB;
                }

                .table-search {
                    position: relative;
                    max-width: 300px;
                    flex: 1;
                }

                .search-input {
                    width: 100%;
                    padding: 8px 12px 8px 36px;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    font-size: 14px;
                    background: white;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #3B82F6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6B7280;
                }

                .table-actions {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 12px;
                    background: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    background: #F3F4F6;
                    border-color: #9CA3AF;
                }

                .table-container {
                    overflow-x: auto;
                    max-height: 600px;
                    overflow-y: auto;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th {
                    background: #F9FAFB;
                    padding: 12px 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #E5E7EB;
                    position: sticky;
                    top: 0;
                    cursor: pointer;
                    user-select: none;
                }

                .data-table th:hover {
                    background: #F3F4F6;
                }

                .data-table th.sortable::after {
                    content: '';
                    margin-left: 8px;
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-bottom: 4px solid #9CA3AF;
                }

                .data-table th.sort-asc::after {
                    border-bottom: 4px solid #374151;
                    border-top: none;
                }

                .data-table th.sort-desc::after {
                    border-top: 4px solid #374151;
                    border-bottom: none;
                }

                .data-table td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #F3F4F6;
                    color: #374151;
                }

                .data-table tbody tr:hover {
                    background: #F9FAFB;
                }

                .table-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: #F9FAFB;
                    border-top: 1px solid #E5E7EB;
                }

                .table-info {
                    font-size: 14px;
                    color: #6B7280;
                }

                .table-pagination {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pagination-btn {
                    padding: 6px 12px;
                    background: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    font-size: 14px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .pagination-btn:hover:not(:disabled) {
                    background: #F3F4F6;
                }

                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-numbers {
                    display: flex;
                    gap: 4px;
                }

                .page-number {
                    padding: 6px 10px;
                    background: white;
                    border: 1px solid #D1D5DB;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .page-number:hover {
                    background: #F3F4F6;
                }

                .page-number.active {
                    background: #3B82F6;
                    color: white;
                    border-color: #3B82F6;
                }

                .filter-panel {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 300px;
                    height: 100%;
                    background: white;
                    border-left: 1px solid #E5E7EB;
                    box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                }

                .filter-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #E5E7EB;
                }

                .filter-header h4 {
                    margin: 0;
                    font-size: 16px;
                    color: #111827;
                }

                .close-filter {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #6B7280;
                    cursor: pointer;
                }

                .filter-content {
                    padding: 20px;
                    max-height: calc(100% - 120px);
                    overflow-y: auto;
                }

                .filter-group {
                    margin-bottom: 20px;
                }

                .filter-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 6px;
                }

                .filter-input,
                .filter-select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    font-size: 14px;
                    background: white;
                }

                .filter-actions {
                    padding: 16px 20px;
                    border-top: 1px solid #E5E7EB;
                    display: flex;
                    gap: 8px;
                }

                .clear-filters,
                .apply-filters {
                    flex: 1;
                    padding: 8px 16px;
                    border: 1px solid #D1D5DB;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .clear-filters {
                    background: white;
                    color: #374151;
                }

                .apply-filters {
                    background: #3B82F6;
                    color: white;
                    border-color: #3B82F6;
                }

                .clear-filters:hover {
                    background: #F3F4F6;
                }

                .apply-filters:hover {
                    background: #2563EB;
                }
            </style>
        `;
        
        if (!document.querySelector('#advanced-data-table-styles')) {
            const styleElement = document.createElement('div');
            styleElement.id = 'advanced-data-table-styles';
            styleElement.innerHTML = styles;
            document.head.appendChild(styleElement);
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = this.container.querySelector('#table-search');
        searchInput.addEventListener('input', (e) => {
            this.search(e.target.value);
        });

        // Export functionality
        const exportBtn = this.container.querySelector('#export-btn');
        exportBtn.addEventListener('click', () => {
            this.exportData();
        });

        // Filter panel
        const filterBtn = this.container.querySelector('#filter-btn');
        const filterPanel = this.container.querySelector('#filter-panel');
        const closeFilter = this.container.querySelector('#close-filter');

        filterBtn.addEventListener('click', () => {
            filterPanel.style.display = filterPanel.style.display === 'none' ? 'block' : 'none';
        });

        closeFilter.addEventListener('click', () => {
            filterPanel.style.display = 'none';
        });

        // Pagination
        const prevBtn = this.container.querySelector('#prev-btn');
        const nextBtn = this.container.querySelector('#next-btn');

        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTable();
            }
        });

        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTable();
            }
        });

        // Filter actions
        const clearFilters = this.container.querySelector('#clear-filters');
        const applyFilters = this.container.querySelector('#apply-filters');

        clearFilters.addEventListener('click', () => {
            this.clearAllFilters();
        });

        applyFilters.addEventListener('click', () => {
            this.applyFilters();
        });
    }

    setData(data, columns) {
        this.data = data;
        this.columns = columns;
        this.filteredData = [...data];
        this.renderHeaders();
        this.renderFilterPanel();
        this.renderTable();
    }

    renderHeaders() {
        const thead = this.container.querySelector('#table-head');
        const headerRow = document.createElement('tr');

        this.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title;
            th.dataset.column = column.key;
            
            if (column.sortable !== false) {
                th.classList.add('sortable');
                th.addEventListener('click', () => {
                    this.sort(column.key);
                });
            }

            headerRow.appendChild(th);
        });

        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    renderTable() {
        const tbody = this.container.querySelector('#table-body');
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        const pageData = this.filteredData.slice(start, end);

        tbody.innerHTML = '';

        pageData.forEach(row => {
            const tr = document.createElement('tr');

            this.columns.forEach(column => {
                const td = document.createElement('td');
                const value = this.getNestedValue(row, column.key);
                
                if (column.render) {
                    td.innerHTML = column.render(value, row);
                } else {
                    td.textContent = this.formatValue(value, column.format);
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        this.updatePagination();
        this.updateTableInfo();
    }

    renderFilterPanel() {
        const filterContent = this.container.querySelector('#filter-content');
        filterContent.innerHTML = '';

        this.columns.forEach(column => {
            if (column.filterable === false) return;

            const filterGroup = document.createElement('div');
            filterGroup.className = 'filter-group';

            const label = document.createElement('label');
            label.textContent = column.title;

            const input = document.createElement('input');
            input.className = 'filter-input';
            input.type = 'text';
            input.placeholder = `Filter by ${column.title.toLowerCase()}...`;
            input.dataset.column = column.key;

            filterGroup.appendChild(label);
            filterGroup.appendChild(input);
            filterContent.appendChild(filterGroup);
        });
    }

    sort(columnKey) {
        if (this.sortColumn === columnKey) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = columnKey;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            const aValue = this.getNestedValue(a, columnKey);
            const bValue = this.getNestedValue(b, columnKey);

            let comparison = 0;
            if (aValue > bValue) comparison = 1;
            if (aValue < bValue) comparison = -1;

            return this.sortDirection === 'desc' ? -comparison : comparison;
        });

        this.updateSortHeaders();
        this.renderTable();
    }

    updateSortHeaders() {
        const headers = this.container.querySelectorAll('th');
        headers.forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.column === this.sortColumn) {
                th.classList.add(`sort-${this.sortDirection}`);
            }
        });
    }

    search(query) {
        if (!query.trim()) {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(row => {
                return this.columns.some(column => {
                    const value = this.getNestedValue(row, column.key);
                    return value.toString().toLowerCase().includes(query.toLowerCase());
                });
            });
        }

        this.currentPage = 1;
        this.renderTable();
    }

    applyFilters() {
        const filterInputs = this.container.querySelectorAll('.filter-input');
        this.filters.clear();

        filterInputs.forEach(input => {
            if (input.value.trim()) {
                this.filters.set(input.dataset.column, input.value.trim().toLowerCase());
            }
        });

        this.filteredData = this.data.filter(row => {
            return Array.from(this.filters.entries()).every(([column, filterValue]) => {
                const value = this.getNestedValue(row, column);
                return value.toString().toLowerCase().includes(filterValue);
            });
        });

        this.currentPage = 1;
        this.renderTable();
        
        // Close filter panel
        this.container.querySelector('#filter-panel').style.display = 'none';
    }

    clearAllFilters() {
        this.filters.clear();
        const filterInputs = this.container.querySelectorAll('.filter-input');
        filterInputs.forEach(input => input.value = '');
        
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.renderTable();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        const prevBtn = this.container.querySelector('#prev-btn');
        const nextBtn = this.container.querySelector('#next-btn');
        const paginationNumbers = this.container.querySelector('#pagination-numbers');

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;

        // Generate page numbers
        paginationNumbers.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-number';
            pageBtn.textContent = i;
            
            if (i === this.currentPage) {
                pageBtn.classList.add('active');
            }

            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.renderTable();
            });

            paginationNumbers.appendChild(pageBtn);
        }
    }

    updateTableInfo() {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.filteredData.length);
        const total = this.filteredData.length;

        const infoText = this.container.querySelector('#table-info-text');
        infoText.textContent = `Showing ${start} to ${end} of ${total} entries`;
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((value, key) => value && value[key], obj) || '';
    }

    formatValue(value, format) {
        if (value === null || value === undefined) return '';
        
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);
            case 'percentage':
                return `${(value * 100).toFixed(1)}%`;
            case 'date':
                return new Date(value).toLocaleDateString();
            case 'number':
                return Number(value).toLocaleString();
            default:
                return value.toString();
        }
    }

    exportData() {
        const csvContent = this.convertToCSV(this.filteredData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'table-export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    convertToCSV(data) {
        if (data.length === 0) return '';

        const headers = this.columns.map(col => col.title);
        const rows = data.map(row => 
            this.columns.map(col => {
                const value = this.getNestedValue(row, col.key);
                return `"${value.toString().replace(/"/g, '""')}"`;
            })
        );

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
}

// ================================
// EXPORT MAIN LIBRARY
// ================================

// Global initialization
window.DataVisualization = {
    Engine: DataVisualizationEngine,
    Charts: {
        Line: LineChart,
        Bar: BarChart,
        Radar: RadarChart,
        Doughnut: DoughnutChart,
        Gauge: GaugeChart
    },
    Widgets: {
        PerformanceTrend: PerformanceTrendWidget,
        Comparison: ComparisonWidget,
        DashboardMetrics: DashboardMetrics,
        AdvancedTable: AdvancedDataTable
    }
};

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎯 Data Visualization Components Library Loaded');
    });
} else {
    console.log('🎯 Data Visualization Components Library Loaded');
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }

    startMeasure(id) {
        this.metrics.set(id, performance.now());
    }

    endMeasure(id) {
        const start = this.metrics.get(id);
        if (start) {
            const duration = performance.now() - start;
            console.log(`📊 ${id}: ${duration.toFixed(2)}ms`);
            this.metrics.delete(id);
            return duration;
        }
    }
}

// Accessibility manager
class AccessibilityManager {
    constructor() {
        this.announcer = this.createAnnouncer();
    }

    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);
        return announcer;
    }

    announce(message) {
        this.announcer.textContent = message;
    }
}

console.log('🚀 Football Management Data Visualization Library Ready');