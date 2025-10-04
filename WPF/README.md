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
│   ├── Infrastructure/
│   │   ├── AsyncRelayCommand.cs
│   │   ├── ObservableObject.cs
│   │   └── RelayCommand.cs
│   ├── Models/
│   │   └── NavigationModels.cs
│   ├── Services/
│   │   └── NavigationCatalog.cs
│   ├── ViewModels/
│   │   ├── MainViewModel.cs
│   │   ├── NavigationSubItemViewModel.cs
│   │   └── NavigationTabViewModel.cs
│   ├── Resources/
│   │   └── Theme.xaml
│   └── Views/
│       ├── MainWindow.xaml
│       └── MainWindow.xaml.cs
└── README.md
```

## Implemented Features

- **Navigation shell** with the seven Football Manager tabs, contextual sub-navigation, and state-aware styling.
- **Theming system** that ports the dark palette, gradients, and control styles from the HTML prototype into reusable WPF Resource Dictionaries.
- **MVVM scaffolding** (models, view-models, relay commands) to keep presentation logic testable and ready for integration with the forthcoming data services.
- **Data-driven tactical canvas** powered by a 37×19 grid layout service that renders metric, list, and formation cards for the Club Vision, Tactics Overview, and Training Overview sections.
- **Sample layout catalog** that mirrors real Football Manager content, including formation breakdowns, instructional lists, and metric summaries to guide downstream feature parity work.

## Next Steps

1. Install the .NET 8 SDK locally if it is not already available.
2. Restore and build the solution:
   ```bash
   dotnet build WPF/FMUI.Wpf.sln
   ```
3. Replace the placeholder tactical grid with live card layouts, formation drag/drop, and data-driven widgets using the MVVM scaffolding provided here.
4. Introduce persistence and data services aligned with the HTML orchestrators to ensure functional parity across modules.

The scaffold now reflects the navigation, theming, and interaction patterns required for the full Football Manager UI conversion.
