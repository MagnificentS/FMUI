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
│   │   ├── FormationPlayerThumb.cs
│   │   ├── LineChartControl.cs
│   │   ├── RadialGaugeControl.cs
│   │   ├── TimelineControl.cs
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
│   │   ├── NavigationCatalog.cs
│   │   ├── NavigationIndicatorService.cs
│   │   └── NavigationPermissionService.cs
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
- **Tactical pitch player drag/drop** with draggable formation tokens, collision-aware snapping, and persisted player geometry that flows through undo/redo history and file-backed storage.
- **Card catalog and mutable layouts** featuring a palette overlay, add/remove commands, and undoable history entries that persist custom cards and hidden defaults per navigation section.
- **Accessible catalog overlay** with themed controls, keyboard navigation, focus management, and backdrop dismissal so add/remove workflows meet Football Manager UX expectations.
- **Section-specific palette presets** that introduce curated card templates beyond the default layout, giving analysts ready-made variants for finance, tactics, training, transfers, and fixtures.
- **Sample layout catalog** that mirrors real Football Manager content, including formation breakdowns, instructional lists, and metric summaries to guide downstream feature parity work across every navigation section.
- **Interaction guardrails** preventing card removal during active drags or previews so persisted layouts remain consistent even under rapid mutation.
- **Event-driven club data repository** that hydrates every domain from structured JSON, persists user overrides, and broadcasts snapshot updates so layouts refresh without restarting.
- **Durable layout state persistence** that stores per-section card geometry on disk so drag and resize edits survive application restarts.
- **Specialised analytics visuals** with custom line charts, radial gauges, and fixture timelines bound to the live repository so finance, training, transfers, and fixtures cards now reflect the HTML reference interactions.
- **Contextual overlays and animated visuals** delivering hover tooltips, eased entrance animations, and interpolated values across charts, gauges, and timelines for parity with the HTML hover experience.
- **Finance budget forecasting card** with a slider-driven scenario model, live impact calculations, and repository persistence so analysts can project balance, transfer, and wage outcomes directly from the dashboard.
- **Card editing overlay** with dedicated list, gauge, and training session editors so squad key players, competition expectations, five-year plans, player issues, training intensity, focus areas, weekly schedules, detailed session slots, budget usage, active deals, recent activity, budgets, and overall balance can be adjusted through the live repository and persisted to disk.
- **Training workload heatmap** that mirrors the HTML recovery-to-high intensity grid with interactive cell tooltips, legend scaling, and a dedicated editor for tuning unit loads across every session.
- **Weekly training calendar** presented as a drag-enabled grid so analysts can reschedule sessions by dropping them into new day/slot combinations with live repository persistence and inline status messaging.
- **Fixtures calendar workspace** with competition filters, an interactive monthly grid, and repository-backed match detail overlays for managing travel logistics, preparation notes, and status updates without leaving the fixtures tab.
- **Workload heatmap editor** extending the card overlay catalogue so analysts can rebalance unit intensities, adjust load values, and annotate session details with undo-safe persistence through the live repository.
- **Formation swap editor** that lets analysts assign any player from the tactical pool to a formation slot with validation, undo integration, and repository-backed persistence.
- **Squad roster intelligence board** featuring a virtualised, filterable player table with inline comparison overlays so analysts can slice by role, surface minutes and conditioning, and benchmark selected players without leaving the squad tab.
- **Drag-to-reschedule list editing** – every list-based editor now supports pointer drag/drop reordering in addition to keyboard nudging so training calendars and scouting queues can be reshuffled fluidly.
- **Dynamic navigation indicators** that derive badge counts and severity pulses from live club data, surfacing fixtures, medical risks, player issues, and transfer activity directly in the tab chrome.
- **Enhanced list and metric cards** with animated hover treatments and styled tooltips so dense dashboards expose secondary details without expanding every card.
- **Permission-aware navigation** driven by a live permission service that hides tabs or sections lacking clearance while broadcasting updates as club data changes.
- **Responsive navigation chrome** with adaptive spacing, animated tab highlights, compact header states, and scrollable overflow so the shell stays usable on narrower window widths.
- **Transfer negotiation workspace** rendering active deals with per-term progress, status pills, and summary insights sourced from the live repository so analysts can track offer momentum directly on the transfer centre canvas.
- **Negotiation editor overlay** that drives stage/status combos, slider-based fee, wage, and bonus adjustments, and regenerates active-deal summaries while persisting changes through the event-driven club data service.
- **Negotiation deal management** with add/remove commands, live validation messaging, and default term templates so recruitment teams can spin up new talks, retire stale negotiations, and expand stage/status vocabularies without editing JSON.
- **Scouting assignment board** combining a dedicated card, hover metrics, and an editor overlay so recruitment analysts can reprioritise regions, stages, scouts, and deadlines with undo-safe persistence that also refreshes the list summaries.
- **Shortlist management workspace** featuring an interactive shortlist card, drag-to-order editing overlay, and repository-backed status/action pipelines so analysts can curate target priorities, follow-up actions, and notes without manual JSON edits.

## Next Steps

1. Install the .NET 8 SDK locally if it is not already available.
2. Restore and build the solution:
   ```bash
   dotnet build WPF/FMUI.Wpf.sln
   ```
3. Layer preset management and undo grouping onto finance scenario experiments, scouting assignment templates, and shortlist batches so analysts can flip between saved what-if models.
4. Extend formation and status-specific overlays (role presets, contextual menus) to reuse the shared tooltip/animation system while continuing to harden accessibility semantics.
5. Build automation and performance coverage (UI/integration tests, telemetry) to protect the growing interaction surface as live data workflows expand.

The scaffold now reflects the navigation, theming, messaging, and interaction patterns required for the full Football Manager UI conversion.
