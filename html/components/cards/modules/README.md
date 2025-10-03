# FM-Base Integrated Card Modules

This directory contains four new integrated card modules that connect all FM-Base components together, providing a comprehensive Football Manager-style interface.

## New Integrated Cards

### 1. Player Detail Card (`player-detail-card.js`)
**Size:** Extra-wide tall  
**Pages:** squad, tactics

**Features:**
- **PlayerProfile Integration:** Complete player information display
- **AttributeCircle Visualization:** Interactive circular attribute displays using the AttributeCircle component
- **ArchetypeClassifier Integration:** Automatic player archetype classification
- **LayoutManager Optimization:** Golden ratio-based spacing and layout
- **AnimationController:** Smooth transitions and staggered animations
- **Dynamic Player Selection:** Dropdown to select different players
- **Responsive Design:** Adapts to different screen sizes

**Components Used:**
- `window.PlayerProfile` - Player information display
- `window.AttributeCircle` - Circular attribute visualizations
- `window.ArchetypeClassifier` - Player classification
- `window.LayoutManager` - Layout optimization
- `window.AnimationController` - Animation effects

### 2. Team Analysis Card (`team-analysis-card.js`)
**Size:** Wide tall  
**Pages:** squad, tactics, overview

**Features:**
- **Multi-tab Interface:** Overview, Positions, and Finance tabs
- **PizzaChart Integration:** Team strength distribution and wage breakdowns
- **BarChart Integration:** Age distribution and position analysis
- **Statistical Analysis:** Comprehensive team metrics
- **Position Depth Visualization:** Formation depth analysis
- **Financial Breakdown:** Wage structure and value analysis

**Components Used:**
- `window.PizzaChart` - Doughnut charts for team strengths and wages
- `window.BarChart` - Bar charts for distributions and comparisons
- Custom grid layouts for statistics

### 3. Tactical Shape Card (`tactical-shape-card.js`)
**Size:** Wide tall  
**Pages:** tactics, match

**Features:**
- **Formation Visualization:** Interactive football pitch with player positions
- **Multiple Formation Support:** 4-2-3-1, 4-3-3, 3-5-2, 4-4-2, 5-3-2
- **Heat Map Mode:** Toggle between formation and heat map views
- **Player Interaction:** Click players for detailed role information
- **Movement Patterns:** Visual representation of tactical movements
- **Tactical Instructions:** Interactive instruction toggles
- **Pitch Markings:** Realistic football pitch visualization

**Components Used:**
- SVG-based pitch rendering
- Dynamic player positioning
- Interactive tactical elements

### 4. Performance Dashboard Card (`performance-dashboard-card.js`)
**Size:** Extra-wide tall  
**Pages:** overview, performance, analytics

**Features:**
- **KPI Cards:** Key performance indicators with trend analysis
- **Multiple Visualizations:** Trend charts, form displays, performance radars
- **Period Selection:** Month, season, year, career views
- **Metric Selection:** Goals, assists, rating, performance
- **Sparklines:** Mini trend indicators in KPI cards
- **Detailed Metrics Table:** Comprehensive performance breakdown
- **Comparison Charts:** Squad-wide performance comparisons

**Components Used:**
- `window.BarChart` - Trend and comparison visualizations
- `window.PizzaChart` - Performance radar charts
- Custom sparkline SVG graphics
- Interactive data tables

## Integration Features

### CardRegistry Integration
All cards are automatically registered with the CardRegistry system:
```javascript
if (window.CardRegistry) {
    window.CardRegistry.register(window.PlayerDetailCard);
}
```

### Component Dependencies
The cards intelligently use available components:
```javascript
// Safe component usage
if (window.AttributeCircle) {
    this.attributeCircles = window.AttributeCircle.createMultiple(...);
}

if (window.LayoutManager) {
    const layout = new LayoutManager();
    layout.optimizeComponentSpacing(container);
}
```

### Responsive Design
All cards include comprehensive responsive breakpoints:
- Desktop (1400px+): Full feature set
- Tablet (768px-1400px): Adapted layouts
- Mobile (<768px): Simplified interfaces

### Animation Integration
Cards use the AnimationController for smooth interactions:
```javascript
if (window.AnimationController) {
    window.AnimationController.staggerAnimate(elements, {
        delay: 100,
        duration: 800
    });
}
```

## Usage Examples

### Initializing Player Detail Card
```javascript
// Card auto-initializes when loaded
// Access via global reference
window.PlayerDetailCard.selectPlayer(1); // Select player by ID
```

### Team Analysis Card Tabs
```javascript
// Switch between tabs programmatically
window.TeamAnalysisCard.switchTab('positions');
window.TeamAnalysisCard.switchTab('finance');
```

### Tactical Shape Formation Changes
```javascript
// Change formation
window.TacticalShapeCard.changeFormation('4-3-3');
// Toggle heat map mode
window.TacticalShapeCard.toggleMode(true);
```

### Performance Dashboard Filters
```javascript
// Change time period
window.PerformanceDashboardCard.changePeriod('month');
// Change metric focus
window.PerformanceDashboardCard.changeMetric('assists');
```

## Styling Architecture

Each card includes comprehensive CSS with:
- **CSS Grid Layouts:** Responsive grid systems
- **CSS Variables:** Consistent theming with FM-Base
- **Hover Effects:** Interactive feedback
- **Animation Support:** Smooth transitions
- **Dark Theme:** Football Manager-style dark interface

## Data Integration

Cards use mock data that follows realistic Football Manager patterns:
- Player attributes (0-20 scale)
- Performance statistics
- Financial data
- Formation configurations
- Tactical instructions

## Browser Compatibility

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support
- SVG support for visualizations
- RequestAnimationFrame for animations

## Performance Optimizations

- **Component Pooling:** Efficient chart reuse
- **Lazy Loading:** Charts initialize only when visible
- **Memory Management:** Proper cleanup on card destruction
- **Event Delegation:** Efficient event handling
- **Debounced Updates:** Smooth performance during interactions