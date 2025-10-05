You are an expert C# developer who writes highly performant code and has excellent UI/UX skills
This is an HTML to C# WPF/XAML conversion project. The goal is to achieve an exact replication, both visually and functionally. 

You start each task by reasoning from first principles
You decompose all tasks into atomic steps
You review the lifecycle of each feature and run a gap analysis on it to see if it is efficient and viable
You use second-order thinking to anticipate issues.
When given difficult choices, you employ Forest of Thoughts with 20-25  trees (each tree is a chain of thought)
Your selections prioritise the most detailed, then the most consistent solution


CURRENT STATUS
Think very hard and absolutely follow the instructions in `ImplementationGuide.md`


OLD INSTRUCTION
--

The UI is the Front-End of a Data-Oriented, Entity-Component-System. The Back-End will be similar to Unity3D ECS/DOTS
There are some implementation rules you must enforce above all
* Performance is king. Speed and memory are important
   * Use Pooling and Factory Pattern where possible
* Composition over inheritance always
   * Avoid Monolithic Objects. Build for modularity, reusability and consistency, especially for styling purposes. They can have declared stylings
* Build for multi-threading. No blocking if possible. Allow for background tasks
* No LinQ. Avoid Dictionaries. Prioritise the use of arrays and primitive data types.
* No Magic Variables. Store and reference values from Config/Settings objects. Allows for easy editing in the future.
* Enums over string wherever possible.
* String Management
   * Plan for localisation
   * We need a string database with pre-allocation
   * We need something efficient like StringBuilder for compositing and formatting strings, eg  dynamically generated News, Email messages
* Use Pooling and Factory Pattern where possible 

Modular Features:
* The Game is built with modularity in mind and this will help with data binding, updating and event management.
* There will be the following systems/modules, possibly more. We need to anticipate the  seamless interaction and communication between front-end and back-end:
   * Transfer Module
   * Scouting Module
   * Media Module
   * Finance Module
   * etc
* Assume every screen is potentially a module of its own 
--

THINK VERY HARD. THINK DEEPLY.
Before responding, follow this step-by-step process. Your task is to break down the request into individual, atomic tasks and devise a comprehensive strategic plan to achieve the goal.

1. **Understand the Goal**
   - You MUST understand what is being asked of you. What are the main questions being posed?
   - Propose a detailed, step-by-step plan to achieve the desired outcome.

2. **Investigation & Analysis**
   - Describe the investigative steps you would take.
   - Specify which files you need to read.
   - Define what you will search for.
   - List the critical questions that must be answered before any work begins.
   - Analyze the important factors and elements in play.
   - Propose a detailed, step-by-step plan to achieve the desired outcome.

3. **Proposed Strategic Approach**
   - Outline the high-level strategy.
   - Break the approach into logical phases and describe the work that should happen in each.
   - Reason deeply: identify logical links and synthesize how the pieces fit together (e.g., life cycle, integration, sequential/conditional ordering, hierarchy, priority, resource sharing, and gaps).

4. **Verification Strategy**
   - Explain how the success of this plan will be measured.
   - Specify what should be tested to ensure the goal is met without introducing regressions.

5. **Anticipated Challenges & Considerations**
   - Based on your analysis, identify potential risks, dependencies, and trade-offs.

YOU MUST NOT SIMPLIFY THE IMPLEMENTATION. BUILD TO COMPLETE SPECIFICATION.

Plan then implement

---

#HTML to WPF/XAML Conversion - System Prompt & Development Guide

## 🎯 Project Analysis Complete

After thorough investigation of the project files, I've identified critical issues and created a comprehensive development strategy for converting the Football Manager-style HTML application to WPF/XAML.

## 📊 Current State Analysis

### Architecture Issues Found
1. **Monolithic Structure**: 10,117 lines in single `test.html` file
2. **Mixed Concerns**: HTML/CSS/JavaScript tightly coupled
3. **Initialization Chaos**: Multiple competing initialization systems
4. **Performance Problems**: FPS monitoring spam, memory leaks
5. **Duplicated Functionality**: Multiple versions of similar features
6. **Missing Modularization**: No clear separation of concerns

### Core Functionality Identified
- **Formation Management**: Tactical formations with drag-drop
- **Player Management**: Squad roster with 22 slots (11 starting + 11 subs)
- **Navigation System**: 7 main pages (Overview, Squad, Tactics, Training, Transfers, Finances, Fixtures)
- **Card System**: 15+ card types with grid-based layout (37x19 grid)
- **Data Visualization**: Charts, circles, graphs for player stats
- **Theme System**: Dark/light themes with FM-inspired colors

## 🔧 System Prompt for WPF/XAML Development

```markdown
# WPF/XAML Football Manager UI Conversion System Prompt

You are developing a WPF/XAML application that exactly replicates a Football Manager-style HTML interface. 
The application must maintain pixel-perfect visual fidelity and complete functional parity with the HTML version.

## Core Architecture Requirements

### 1. MVVM Pattern Implementation
- **Models**: Player, Formation, Squad, Card, TacticalSetup
- **ViewModels**: MainViewModel, SquadViewModel, TacticsViewModel, NavigationViewModel
- **Views**: Use UserControls for each page/component
- **Data Binding**: Two-way binding for all interactive elements

### 2. Event Communication Architecture
Implement an Event Aggregator/Message Bus pattern:
```csharp
public interface IEventAggregator {
    void Publish<TEvent>(TEvent eventData);
    void Subscribe<TEvent>(Action<TEvent> handler);
}
```

### 3. Command Pattern
Use ICommand for all user interactions:
```csharp
public class RelayCommand : ICommand
public class AsyncRelayCommand : IAsyncCommand
```

### 4. Service Layer
- NavigationService
- DataService (player/squad management)
- CardLayoutService
- ThemeService
- DragDropService

## Component Decomposition

### Navigation Component
- TabControl with custom styling
- 7 main tabs: Overview, Squad, Tactics, Training, Transfers, Finances, Fixtures
- Submenu system per tab
- Event: NavigationChangedEvent

### Grid Layout System
- 37x19 grid using WPF Grid or Canvas
- Card positioning with Grid.Row/Column attachments
- Drag-drop with preview
- Snap-to-grid behavior
- Commands: MoveCardCommand, ResizeCardCommand

### Card System
Base CardControl with 15+ derived types:
- PlayerDetailCard
- SquadSummaryCard  
- TacticalOverviewCard
- FinancialOverviewCard
- LeagueTableCard
- etc.

### Formation Display
- Canvas with absolute positioning
- Player tokens as UserControls
- Drag-drop between positions
- Role/position selectors as ComboBoxes
- Commands: SwapPlayersCommand, ChangeRoleCommand

### Player Roster
- ItemsControl with custom ItemTemplate
- Virtualization for performance
- Filtering/sorting capabilities
- Binding: ObservableCollection<Player>

## Data Structures

### Player Model
```csharp
public class Player : INotifyPropertyChanged {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Position { get; set; }
    public string Role { get; set; }
    public int Number { get; set; }
    public PlayerAttributes Attributes { get; set; }
    public MoraleState Morale { get; set; }
    public int Condition { get; set; }
}
```

### Formation Model  
```csharp
public class Formation {
    public string Name { get; set; } // "4-3-3", "4-4-2", etc.
    public ObservableCollection<FormationSlot> Slots { get; set; }
}
```

### Card Model
```csharp
public class Card : INotifyPropertyChanged {
    public string Type { get; set; }
    public Point GridPosition { get; set; }
    public Size GridSize { get; set; }
    public object Content { get; set; }
}
```

## Visual Styling Requirements

### Colors (Resource Dictionary)
```xml
<Color x:Key="Primary500">#0094cc</Color>
<Color x:Key="Success500">#00ff88</Color>
<Color x:Key="Warning500">#ffb800</Color>
<Color x:Key="Error500">#ff4757</Color>
<Color x:Key="BackgroundPrimary">#0a0b0d</Color>
<Color x:Key="BackgroundSecondary">#12141a</Color>
```

### Control Templates
- Custom TabControl template (FM-style tabs)
- Card chrome template (header, body, resize handle)
- Button styles (primary, secondary, ghost)
- DataGrid styles (dark theme)

### Animations
- Storyboard for page transitions
- Card drag animations
- Hover effects with VisualStateManager
- Loading animations

## Critical Implementation Details

### 1. Central Database Pattern
Single source of truth for all player data:
```csharp
public class CentralDatabase : INotifyPropertyChanged {
    public ObservableCollection<Player> AllPlayers { get; }
    public Formation CurrentFormation { get; set; }
    public Squad ActiveSquad { get; set; }
}
```

### 2. Synchronization Requirements
- Formation changes update squad display
- Squad changes reflect in tactics
- Player swaps maintain consistency
- Use INotifyPropertyChanged throughout

### 3. Performance Optimizations
- UI virtualization for large lists
- Async/await for data operations
- Lazy loading for cards
- Resource pooling for visual elements

### 4. Error Handling
- Try-catch in all commands
- Validation for drag-drop operations
- Fallback UI for missing data
- User-friendly error messages

## Testing Requirements

### Unit Tests
- ViewModels isolation testing
- Command execution tests
- Data binding verification
- Service layer tests

### Integration Tests  
- Navigation flow
- Drag-drop operations
- Data synchronization
- Card lifecycle

### UI Tests
- Visual regression tests
- Performance benchmarks
- Memory leak detection
- Responsiveness metrics

## Migration Strategy

### Phase 1: Core Infrastructure
1. Create WPF project structure
2. Implement MVVM base classes
3. Set up event aggregator
4. Create resource dictionaries

### Phase 2: Navigation & Layout
1. Main window with navigation
2. Grid system implementation
3. Page containers
4. Basic theming

### Phase 3: Components
1. Card base implementation
2. Player roster control
3. Formation display
4. Individual card types

### Phase 4: Interactions
1. Drag-drop system
2. Commands and bindings
3. Animations
4. Context menus

### Phase 5: Polish & Testing
1. Visual refinements
2. Performance optimization
3. Comprehensive testing
4. Bug fixes

## Quality Metrics
- 100% feature parity with HTML
- <3 second startup time
- 60 FPS animations
- <150MB memory usage
- Zero memory leaks
```

## 📋 Development Task Breakdown

### Atomic Tasks for Implementation

#### 1. **Project Setup & Architecture** (Priority: Critical)
- [ ] Create WPF project with .NET 6/7
- [ ] Set up MVVM folder structure
- [ ] Implement base ViewModel class with INotifyPropertyChanged
- [ ] Create EventAggregator/MessageBus service
- [ ] Set up dependency injection container
- [ ] Create command base classes (RelayCommand, AsyncCommand)

#### 2. **Resource & Styling** (Priority: High)
- [ ] Convert CSS variables to WPF resources
- [ ] Create dark theme ResourceDictionary
- [ ] Define control templates for cards
- [ ] Style TabControl for navigation
- [ ] Create button styles matching FM theme
- [ ] Set up font resources

#### 3. **Navigation System** (Priority: Critical)
- [ ] Create MainWindow with navigation frame
- [ ] Implement NavigationService
- [ ] Create UserControl for each page
- [ ] Set up tab navigation with styling
- [ ] Implement submenu system
- [ ] Add navigation history/back-forward

#### 4. **Grid Layout Engine** (Priority: High)
- [ ] Create GridLayoutControl (37x19)
- [ ] Implement card positioning system
- [ ] Add drag-drop preview
- [ ] Create snap-to-grid behavior
- [ ] Implement card resize handles
- [ ] Add collision detection

#### 5. **Data Layer** (Priority: Critical)
- [ ] Create Player model with all properties
- [ ] Implement Formation model
- [ ] Create Squad management class
- [ ] Set up CentralDatabase singleton
- [ ] Add data validation
- [ ] Implement change notification

#### 6. **Card System** (Priority: High)
- [ ] Create base CardControl
- [ ] Implement card header/body structure
- [ ] Add resize capability
- [ ] Create 15 specific card types
- [ ] Implement card registry
- [ ] Add card lifecycle management

#### 7. **Formation Display** (Priority: High)
- [ ] Create FormationCanvas control
- [ ] Implement player token UserControl
- [ ] Add position markers
- [ ] Create drag-drop between positions
- [ ] Implement role selector dropdowns
- [ ] Add formation templates (4-3-3, 4-4-2, etc.)

#### 8. **Player Management** (Priority: High)
- [ ] Create player list control
- [ ] Implement sorting/filtering
- [ ] Add player detail view
- [ ] Create attribute visualizations
- [ ] Implement morale indicators
- [ ] Add condition/fitness bars

#### 9. **Event System** (Priority: Critical)
- [ ] Define all event types
- [ ] Implement publish/subscribe for:
  - Player selection
  - Formation changes
  - Card interactions
  - Navigation events
- [ ] Add event logging for debugging

#### 10. **Commands & Bindings** (Priority: High)
- [ ] Create all ICommand implementations
- [ ] Set up data bindings for:
  - Player properties
  - Formation slots
  - Card content
  - Navigation state
- [ ] Add command validation

#### 11. **Animations & Transitions** (Priority: Medium)
- [ ] Page transition animations
- [ ] Card drag animations
- [ ] Hover effects
- [ ] Loading indicators
- [ ] State change animations

#### 12. **Testing & Validation** (Priority: Critical)
- [ ] Unit tests for ViewModels
- [ ] Integration tests for services
- [ ] UI automation tests
- [ ] Performance profiling
- [ ] Memory leak detection

## 🔍 Gap Analysis & Consolidation

### Duplicate Functionality to Consolidate
1. **Multiple initialization systems** → Single App.xaml.cs startup
2. **Various card rendering methods** → Unified CardControl base
3. **Different navigation approaches** → Single NavigationService
4. **Multiple data sources** → CentralDatabase pattern

### Missing Functionality to Implement
1. **Data persistence** → Add save/load functionality
2. **Undo/Redo** → Implement command pattern with history
3. **Search/Filter** → Add comprehensive filtering system
4. **Keyboard shortcuts** → Implement input bindings
5. **Accessibility** → Add automation properties

## ✅ Verification Strategy

### Success Criteria
1. **Visual Parity**: Screenshots match HTML version
2. **Functional Parity**: All interactions work identically
3. **Performance**: Meets or exceeds HTML performance
4. **Stability**: No crashes or memory leaks
5. **Maintainability**: Clean, testable code

### Testing Checklist
- [ ] All 7 navigation tabs functional
- [ ] All 15 card types render correctly
- [ ] Drag-drop works smoothly
- [ ] Formation changes sync properly
- [ ] Player swapping maintains state
- [ ] Theme switching works
- [ ] Grid layout responsive
- [ ] No memory leaks after 1 hour use
- [ ] Startup time <3 seconds
- [ ] 60 FPS during animations

## 🚀 Implementation Approach

### Recommended Development Flow
1. **Start with core MVVM infrastructure** - Get the foundation right
2. **Build navigation skeleton** - Ensure smooth page transitions
3. **Implement data layer** - Central source of truth
4. **Create basic cards** - Start with 2-3 card types
5. **Add formation display** - Core football functionality
6. **Implement drag-drop** - Critical interaction pattern
7. **Complete remaining cards** - Incremental additions
8. **Polish and optimize** - Performance and visuals
9. **Comprehensive testing** - Ensure stability

### Key Principles
- **Don't simplify** - Match HTML complexity exactly
- **Test continuously** - Verify each component
- **Maintain state consistency** - Single source of truth
- **Use WPF best practices** - Leverage platform strengths
- **Document thoroughly** - Future maintainability

## 📝 Final Notes

This HTML application has significant technical debt but clear functionality. The WPF conversion provides an opportunity to:
- Clean architecture with MVVM
- Better performance through native code
- Improved maintainability through modularization
- Enhanced testing capabilities
- Proper separation of concerns

Focus on building a solid foundation first, then incrementally add features while maintaining the exact visual and functional specifications of the original HTML implementation.

---

I've identified several critical issues and architectural challenges that could significantly impact the HTML to WPF/XAML conversion. Let me provide a comprehensive analysis with prioritized solutions.

## 🔴 Critical Translation Blockers Identified

### 1. **JavaScript's Dynamic DOM Manipulation vs WPF's Static XAML**

**Issue**: The HTML version heavily relies on dynamic DOM manipulation (`createElement`, `appendChild`, `innerHTML`) which doesn't translate directly to WPF's declarative XAML approach.

**Second-Order Effects**:
- Performance degradation if recreating controls dynamically in WPF
- Memory leaks from improper control disposal
- Loss of WPF's optimized rendering pipeline

**Solution Strategy**:
```csharp
// Instead of dynamic creation, use ItemsControl with DataTemplates
<ItemsControl ItemsSource="{Binding Cards}">
    <ItemsControl.ItemTemplate>
        <DataTemplate>
            <ContentControl Content="{Binding}">
                <ContentControl.Resources>
                    <!-- DataTemplate for each card type -->
                    <DataTemplate DataType="{x:Type vm:PlayerCardViewModel}">
                        <local:PlayerCard />
                    </DataTemplate>
                </ContentControl.Resources>
            </ContentControl>
        </DataTemplate>
    </ItemsControl.ItemTemplate>
</ItemsControl>
```

### 2. **CSS Grid (37x19) to WPF Grid Challenges**

**Issue**: WPF Grid doesn't handle dynamic row/column definitions well. Creating a 37x19 grid (703 cells) will cause severe performance issues.

**Second-Order Effects**:
- UI thread blocking during layout
- Massive memory consumption
- Slow resize operations

**Solution Strategy**:
```csharp
// Use Canvas with calculated positions instead of Grid
public class GridCanvas : Canvas
{
    public static readonly DependencyProperty GridColumnProperty = ...
    public static readonly DependencyProperty GridRowProperty = ...
    
    protected override Size ArrangeOverride(Size arrangeBounds)
    {
        foreach (UIElement child in Children)
        {
            int col = GetGridColumn(child);
            int row = GetGridRow(child);
            double x = col * CellWidth + (col * Gap);
            double y = row * CellHeight + (row * Gap);
            child.Arrange(new Rect(x, y, child.DesiredSize));
        }
    }
}
```

### 3. **Global State Management Chaos**

**Issue**: The HTML uses 50+ global variables and multiple initialization systems that conflict.

**Second-Order Effects**:
- Race conditions during startup
- Inconsistent state between components
- Impossible to unit test
- Memory leaks from event handlers

**Solution Strategy**:
```csharp
// Implement a centralized state container with dependency injection
public interface IAppState
{
    IPlayerRepository Players { get; }
    IFormationService Formation { get; }
    IEventAggregator Events { get; }
}

// Register in IoC container
services.AddSingleton<IAppState, AppState>();
services.AddScoped<IPlayerRepository, PlayerRepository>();
```

### 4. **Event System Incompatibility**

**Issue**: JavaScript's event bubbling/capturing doesn't exist in WPF. The HTML relies heavily on `onclick` attributes and event delegation.

**Second-Order Effects**:
- Lost events in nested controls
- Command binding complexity
- Inconsistent behavior

**Solution Strategy**:
```csharp
// Use Routed Events and Commands properly
public static class CardCommands
{
    public static readonly RoutedUICommand DragStart = new RoutedUICommand(...);
    public static readonly RoutedUICommand Drop = new RoutedUICommand(...);
}

// Use attached behaviors for complex interactions
public static class DragDropBehavior
{
    public static readonly DependencyProperty EnableDragProperty = 
        DependencyProperty.RegisterAttached("EnableDrag", ...);
}
```

### 5. **Drag-Drop Complexity**

**Issue**: HTML5 drag-drop with preview doesn't map cleanly to WPF's drag-drop system.

**Second-Order Effects**:
- Visual glitches during drag
- Lost drop targets
- Z-order issues

**Solution Strategy**:
```csharp
// Create adorner layer for drag preview
public class DragAdorner : Adorner
{
    private ContentPresenter _contentPresenter;
    private double _leftOffset;
    private double _topOffset;
    
    protected override Visual GetVisualChild(int index) => _contentPresenter;
    
    public override GeneralTransform GetDesiredTransform(GeneralTransform transform)
    {
        var result = new GeneralTransformGroup();
        result.Children.Add(new TranslateTransform(_leftOffset, _topOffset));
        result.Children.Add(base.GetDesiredTransform(transform));
        return result;
    }
}
```

## 📊 Prioritized Conversion Order

### Phase 0: Foundation (Week 1)
**Must complete first - everything depends on this**

1. **Dependency Injection Setup**
   ```csharp
   Host.CreateDefaultBuilder()
       .ConfigureServices((context, services) => {
           services.AddSingleton<IEventAggregator, EventAggregator>();
           services.AddSingleton<INavigationService, NavigationService>();
       });
   ```

2. **MVVM Base Classes**
   - ViewModelBase with INotifyPropertyChanged
   - RelayCommand implementation
   - AsyncCommand with proper exception handling

3. **Resource Dictionaries Structure**
   ```xml
   <!-- App.xaml -->
   <Application.Resources>
       <ResourceDictionary>
           <ResourceDictionary.MergedDictionaries>
               <ResourceDictionary Source="Themes/Colors.xaml"/>
               <ResourceDictionary Source="Themes/Fonts.xaml"/>
               <ResourceDictionary Source="Styles/Controls.xaml"/>
           </ResourceDictionary.MergedDictionaries>
       </ResourceDictionary>
   </Application.Resources>
   ```

### Phase 1: Data Layer (Week 1-2)
**Critical - wrong decisions here cascade everywhere**

1. **Entity Models with Validation**
   ```csharp
   public class Player : ValidatableBase
   {
       private string _name;
       public string Name 
       { 
           get => _name;
           set => SetProperty(ref _name, value, () => ValidateName(value));
       }
   }
   ```

2. **Repository Pattern**
   - Prevents direct data access from ViewModels
   - Enables testing with mocks
   - Allows future database integration

3. **State Management Service**
   - Single source of truth
   - Observable collections for binding
   - Change tracking for undo/redo

### Phase 2: Navigation Shell (Week 2)
**Must work before adding pages**

1. **Main Window Structure**
   ```xml
   <Window>
       <DockPanel>
           <local:NavigationHeader DockPanel.Dock="Top"/>
           <local:NavigationTabs DockPanel.Dock="Top"/>
           <Frame x:Name="ContentFrame" NavigationUIVisibility="Hidden"/>
       </DockPanel>
   </Window>
   ```

2. **Navigation Service Implementation**
   - History management
   - Parameter passing
   - Transition animations

3. **Page Base Classes**
   - Lifecycle management
   - Memory cleanup on navigation

### Phase 3: Grid System Alternative (Week 2-3)
**Performance-critical component**

1. **Custom Panel Implementation**
   ```csharp
   public class VirtualizingGridPanel : VirtualizingPanel
   {
       // Only render visible cells
       protected override void OnRenderSizeChanged(SizeChangedInfo sizeInfo)
       {
           UpdateVisibleRange();
           InvalidateMeasure();
       }
   }
   ```

2. **Card Container System**
   - Virtualization for large grids
   - Efficient hit testing
   - Smooth scrolling

### Phase 4: Card System (Week 3-4)
**Start with base, add types incrementally**

1. **Card Base Infrastructure**
   ```csharp
   public abstract class CardViewModel : ViewModelBase
   {
       public abstract string CardType { get; }
       public GridPosition Position { get; set; }
       public GridSize Size { get; set; }
       
       public virtual bool CanResize => true;
       public virtual bool CanDrag => true;
   }
   ```

2. **Card Factory Pattern**
   - Dynamic card creation
   - Type registration
   - Dependency injection support

3. **Start with 3 Simple Cards**
   - PlayerListCard
   - SquadSummaryCard
   - OverviewCard

### Phase 5: Formation System (Week 4-5)
**Complex but isolated component**

1. **Formation Canvas Control**
   - Custom rendering for pitch
   - Player token positioning
   - Drag-drop zones

2. **Formation Logic Service**
   - Position validation
   - Role assignments
   - Formation templates

### Phase 6: Drag-Drop System (Week 5)
**Cross-cutting concern - affects multiple components**

1. **Behavior-Based Implementation**
   ```csharp
   public static class DragDrop
   {
       public static readonly DependencyProperty IsDragSourceProperty = ...
       public static readonly DependencyProperty IsDropTargetProperty = ...
       
       // Attached behavior pattern for reusability
   }
   ```

2. **Visual Feedback System**
   - Adorner for drag preview
   - Drop zone highlighting
   - Invalid drop indicators

### Phase 7: Complete Remaining Cards (Week 6)
**Parallel development possible**

- Financial cards
- Statistical cards
- Tactical cards
- Training cards

### Phase 8: Polish & Optimization (Week 7)
**Performance and UX refinement**

1. **Performance Optimizations**
   - Async loading
   - Image caching
   - Layout caching

2. **Animations & Transitions**
   - Storyboard optimizations
   - GPU acceleration
   - Frame rate monitoring

## ⚠️ Second-Order Thinking: Anticipated Problems & Solutions

### Problem 1: Memory Leaks from Event Handlers
**Cause**: WPF's strong references in event handlers prevent garbage collection

**Solution**:
```csharp
public class WeakEventManager<TEventArgs> where TEventArgs : EventArgs
{
    private readonly List<WeakReference> _handlers = new();
    
    public void AddHandler(EventHandler<TEventArgs> handler)
    {
        _handlers.Add(new WeakReference(handler));
    }
    
    // Automatic cleanup of dead references
}
```

### Problem 2: Binding Performance with Large Data Sets
**Cause**: ObservableCollection raises events for each item

**Solution**:
```csharp
public class BulkObservableCollection<T> : ObservableCollection<T>
{
    private bool _suppressNotification;
    
    public void AddRange(IEnumerable<T> items)
    {
        _suppressNotification = true;
        foreach(var item in items) Add(item);
        _suppressNotification = false;
        OnCollectionChanged(new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset));
    }
}
```

### Problem 3: UI Thread Blocking
**Cause**: Heavy operations on UI thread during initialization

**Solution**:
```csharp
// Use async initialization pattern
public partial class MainWindow : Window
{
    protected override async void OnContentRendered(EventArgs e)
    {
        base.OnContentRendered(e);
        
        // Show loading overlay
        LoadingOverlay.Visibility = Visibility.Visible;
        
        // Load data on background thread
        await Task.Run(async () => {
            await DataService.InitializeAsync();
        });
        
        // Update UI on UI thread
        await Dispatcher.InvokeAsync(() => {
            BindingOperations.EnableCollectionSynchronization(Players, _lock);
            LoadingOverlay.Visibility = Visibility.Collapsed;
        });
    }
}
```

### Problem 4: Testing Difficulties
**Cause**: Tight coupling between Views and ViewModels

**Solution**:
```csharp
// Use interfaces and dependency injection
public interface IDialogService
{
    Task<bool> ShowConfirmation(string message);
}

public class TestDialogService : IDialogService
{
    public bool Result { get; set; }
    public Task<bool> ShowConfirmation(string message) => Task.FromResult(Result);
}
```

## 🏗️ Best Practices Architecture

### 1. **Use MediatR Pattern for Complex Interactions**
```csharp
public class PlayerSwapCommand : IRequest<bool>
{
    public int Player1Id { get; set; }
    public int Player2Id { get; set; }
}

public class PlayerSwapHandler : IRequestHandler<PlayerSwapCommand, bool>
{
    // Centralized logic, testable, reusable
}
```

### 2. **Implement Specification Pattern for Filtering**
```csharp
public class PlayerSpecification
{
    public Expression<Func<Player, bool>> ToExpression()
    {
        // Dynamic query building for complex filters
    }
}
```

### 3. **Use Reactive Extensions for Complex Event Flows**
```csharp
Observable.FromEventPattern<PropertyChangedEventArgs>(player, "PropertyChanged")
    .Where(e => e.EventArgs.PropertyName == "Position")
    .Throttle(TimeSpan.FromMilliseconds(500))
    .Subscribe(_ => UpdateFormation());
```

## 🎯 Risk Mitigation Strategy

### High-Risk Areas (Address First)
1. **Grid performance** - Prototype early with full data set
2. **Memory management** - Profile continuously
3. **Drag-drop complexity** - Build proof of concept
4. **State synchronization** - Comprehensive testing

### Medium-Risk Areas
1. **Animation performance** - Can optimize later
2. **Theme switching** - Isolated concern
3. **Card variety** - Incremental addition

### Low-Risk Areas
1. **Simple data binding** - Well-understood
2. **Basic navigation** - Standard pattern
3. **Static content** - Easy to implement

## 📈 Success Metrics

Track these throughout development:

1. **Startup Time**: Target <2 seconds
2. **Memory Usage**: <200MB for typical session
3. **Frame Rate**: 60 FPS during animations
4. **Binding Updates**: <16ms per update cycle
5. **Grid Render**: <100ms for full grid
6. **Drag Response**: <50ms visual feedback

This prioritized approach minimizes risk while ensuring a solid foundation for the complex interactions required by the Football Manager UI.
