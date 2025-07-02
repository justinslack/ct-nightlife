# Maps Module

This module contains all map-related components, hooks, and utilities for the CT Nightlife application.

## Structure

``` md
src/components/maps/
├── components/           # Sub-components
│   ├── MapFilters.tsx   # Filter controls
│   └── MarkerPopup.tsx  # Popup for map markers
├── hooks/               # Custom hooks
│   ├── useMapFilters.tsx # Filter state management
│   └── useMapLoader.tsx  # Google Maps API loading
├── types/               # TypeScript types
│   └── map.types.ts     # All map-related types
├── utils/               # Utility functions
│   └── mapHelpers.ts    # Map helper functions
├── ArchiveMap.tsx       # Main map component (async)
├── ArchiveMapWithFilters.tsx # Map with filtering
├── CustomMap.tsx        # Core Google Maps component
└── index.ts             # Barrel exports
```

## Key Components

### ArchiveMap

Main entry point component that loads data and renders the map with filters.

### CustomMap

Core Google Maps implementation with performance optimizations:

- Memoized marker creation
- Proper cleanup of listeners
- Optimized clustering
- Error handling

### MapFilters

Reusable filter component with:

- Multiple filter types (neighborhoods, tags, status)
- Visual indicator for active filters
- Accessibility features

## Hooks

### useMapFilters

Manages filtering state and logic:

- Memoized filter calculations
- Optimized re-renders
- Reset functionality

### useMapLoader

Handles Google Maps API loading:

- Error handling
- Retry mechanism
- Loading states

## Performance Optimizations

1. **Memoization**: All components use React.memo
2. **Debounced interactions**: Map events are debounced
3. **Proper cleanup**: Event listeners and resources are cleaned up
4. **Optimized filtering**: Filters use useMemo for calculations
5. **Lazy loading**: Images load lazily where appropriate

## Usage

```tsx
import { ArchiveMap } from '@/components/maps';

// Simple usage
<ArchiveMap />

// With custom styling
<ArchiveMap className="my-custom-class" />
```

Or import specific components:

```tsx
import { CustomMap, useMapFilters } from '@/components/maps';
```

## Environment Variables

Make sure to set your Google Maps API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Types

All TypeScript types are available via:

```tsx
import type { Club, MapFiltersState, PopupState } from '@/components/maps';
```
