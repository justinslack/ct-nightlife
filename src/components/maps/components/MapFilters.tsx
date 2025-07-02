"use client";

import React, { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { X, Filter } from "lucide-react";
import type { MapFilters as MapFiltersType, FilterType } from "../types/map.types";

interface MapFiltersProps {
  filters: MapFiltersType;
  availableNeighborhoods: string[];
  availableTags: string[];
  availableStatuses: string[];
  onFilterChange: (type: FilterType, value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const FilterSection = memo<{
  title: string;
  items: string[];
  selectedItems: string[];
  onToggle: (value: string) => void;
  columns?: number;
  capitalize?: boolean;
}>(({ title, items, selectedItems, onToggle, columns = 3, capitalize = false }) => (
  <div className="flex flex-col gap-2">
    <h3 className="font-medium">{title}</h3>
    <div className={`grid gap-2 md:grid-cols-${columns}`}>
      {items.map((item) => (
        <label key={item} className="flex items-center gap-2 cursor-pointer">
          <Checkbox 
            checked={selectedItems.includes(item)} 
            onCheckedChange={() => onToggle(item)} 
          />
          <span className={capitalize ? "capitalize" : ""}>
            {capitalize ? item : item.charAt(0).toUpperCase() + item.slice(1)}
          </span>
        </label>
      ))}
    </div>
  </div>
));

FilterSection.displayName = "FilterSection";

export default memo<MapFiltersProps>(function MapFilters({
  filters,
  availableNeighborhoods,
  availableTags,
  availableStatuses,
  onFilterChange,
  onReset,
  hasActiveFilters
}) {
  return (
    <div className="mb-6 flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Show me
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[90vw] md:w-[700px] max-w-[90vw] p-6 relative" 
          align="end"
        >
          <PopoverClose asChild>
            <button 
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors" 
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          </PopoverClose>
          
          <div className="grid gap-6">
            <FilterSection
              title="Neighbourhood"
              items={availableNeighborhoods}
              selectedItems={filters.neighborhoods}
              onToggle={(value) => onFilterChange('neighborhoods', value)}
              columns={3}
            />
            
            <FilterSection
              title="Tags"
              items={availableTags}
              selectedItems={filters.tags}
              onToggle={(value) => onFilterChange('tags', value)}
              columns={3}
            />
            
            <FilterSection
              title="Status"
              items={availableStatuses}
              selectedItems={filters.statuses}
              onToggle={(value) => onFilterChange('statuses', value)}
              columns={2}
              capitalize
            />
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {hasActiveFilters ? "Filters applied" : "No filters applied"}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset} 
              disabled={!hasActiveFilters}
            >
              Clear all
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}); 