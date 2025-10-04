# FMUI WPF Conversion Scaffold

This directory contains a manually-authored WPF solution that mirrors the Football Manager-style HTML prototype. The project is structured to provide an immediate visual shell — navigation chrome, theming resources, and placeholder tactical grid — so feature teams can iterate on data-driven modules without reworking the application frame.

## Solution Layout

```
WPF/
├── FMUI.Wpf.sln
├── FMUI.Wpf/
│   ├── App.xaml
│   ├── App.xaml.cs
│   ├── FMUI.Wpf.csproj
│   ├── Controls/
│   │   ├── CardDragThumb.cs
│   │   ├── CardResizeThumb.cs
│   │   └── VirtualizingCardPanel.cs
│   ├── Infrastructure/
│   │   ├── AsyncRelayCommand.cs
│   │   ├── EventAggregator.cs
│   │   ├── NavigationSectionChangedEvent.cs
│   │   ├── ObservableObject.cs
│   │   └── RelayCommand.cs
│   ├── Models/
│   │   ├── CardLayoutStateSnapshot.cs
│   │   ├── CardModels.cs
│   │   ├── ClubDataSnapshot.cs
│   │   └── NavigationModels.cs
│   ├── Resources/
│   │   └── Theme.xaml
│   ├── Services/
│   │   ├── CardInteractionService.cs
│   │   ├── CardLayoutCatalog.cs
│   │   ├── CardLayoutStatePersistence.cs
│   │   ├── CardLayoutStateService.cs
│   │   ├── ClubDataService.cs
│   │   └── NavigationCatalog.cs
│   ├── Data/
│   │   └── club-data.json
│   ├── ViewModels/
│   │   ├── CardSurfaceViewModel.cs
│   │   ├── CardViewModel.cs
│   │   ├── MainViewModel.cs
│   │   ├── NavigationSubItemViewModel.cs
│   │   └── NavigationTabViewModel.cs
│   └── Views/
│       ├── CardSurfaceView.xaml
│       ├── CardSurfaceView.xaml.cs
│       ├── MainWindow.xaml
│       └── MainWindow.xaml.cs
└── README.md
```

## Implemented Features

- **Dependency-injected MVVM shell** powered by the .NET Generic Host so view models, services, and windows resolve through a single composition root.
- **Navigation shell** with the seven Football Manager tabs, contextual sub-navigation, and state-aware styling.
- **Message-driven card surface** that listens for navigation events via an event aggregator and materialises layouts from the catalog without direct coupling.
- **Theming system** that ports the dark palette, gradients, and control styles from the HTML prototype into reusable WPF Resource Dictionaries.
- **Interactive card canvas** with drag, resize, and a custom virtualizing panel that keeps only on-screen cards realised while sharing viewport state through the interaction service.
- **Snapping previews and collision guards** that render drag ghosts for active selections, flag invalid drops in real time, and block commits when card geometry would overlap existing content.
- **Selection-aware workspace tooling** covering multi-card selection, keyboard nudging, and undo/redo history so layout edits can be grouped, reversed, and persisted like the HTML reference.
- **Sample layout catalog** that mirrors real Football Manager content, including formation breakdowns, instructional lists, and metric summaries to guide downstream feature parity work across every navigation section.
- **JSON-backed data services** that hydrate tactics, squad, training, transfer, finance, and fixture cards from structured seed files instead of hard-coded strings.
- **Durable layout state persistence** that stores per-section card geometry on disk so drag and resize edits survive application restarts.

## Next Steps

1. Install the .NET 8 SDK locally if it is not already available.
2. Restore and build the solution:
   ```bash
   dotnet build WPF/FMUI.Wpf.sln
   ```
3. Expand the interaction layer with player drag/drop, card creation/removal workflows, and performance instrumentation to match the HTML orchestrators.
4. Introduce automated tests and telemetry to validate interaction flows and capture performance regressions early.

The scaffold now reflects the navigation, theming, messaging, and interaction patterns required for the full Football Manager UI conversion.
