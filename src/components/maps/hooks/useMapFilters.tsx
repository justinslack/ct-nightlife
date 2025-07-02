import { useMemo, useState, useCallback } from 'react';
import type { Club, MapFilters, FilterType } from '../types/map.types';

export function useMapFilters(clubs: Club[], neighborhoods: string[]) {
  const [filters, setFilters] = useState<MapFilters>({
    neighborhoods,
    tags: [],
    statuses: []
  });

  const availableTags = useMemo(() => 
    Array.from(new Set(clubs.flatMap(c => c.tags))).sort(),
    [clubs]
  );

  const availableStatuses = useMemo(() => ["Active", "Closed"], []);

  const filteredClubs = useMemo(() => 
    clubs.filter(club => {
      const matchesNeighborhood = !filters.neighborhoods.length || 
        filters.neighborhoods.includes(club.neighborhood);
      const matchesTag = !filters.tags.length || 
        club.tags.some(tag => filters.tags.includes(tag));
      const matchesStatus = !filters.statuses.length || 
        filters.statuses.includes(club.status);
      return matchesNeighborhood && matchesTag && matchesStatus;
    }),
    [clubs, filters]
  );

  const updateFilter = useCallback((type: FilterType, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ 
      neighborhoods, 
      tags: [], 
      statuses: [] 
    });
  }, [neighborhoods]);

  const hasActiveFilters = useMemo(() => {
    return filters.tags.length > 0 || 
           filters.statuses.length > 0 || 
           filters.neighborhoods.length !== neighborhoods.length;
  }, [filters, neighborhoods]);

  return {
    filters,
    filteredClubs,
    availableTags,
    availableStatuses,
    updateFilter,
    resetFilters,
    hasActiveFilters
  };
} 