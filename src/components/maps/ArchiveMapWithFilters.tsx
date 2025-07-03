"use client";

import { memo } from "react";
import CustomMap from "@/components/maps/CustomMap";
import MapFilters from "@/components/maps/components/MapFilters";
import { useMapFilters } from "@/components/maps/hooks/useMapFilters";
import type { Club } from "@/components/maps/types/map.types";

interface ArchiveMapWithFiltersProps {
  mapItems: Club[];
  neighborhoods: string[];
}

export default memo<ArchiveMapWithFiltersProps>(function ArchiveMapWithFilters({ 
  mapItems, 
  neighborhoods 
}) {
	const {
		filters,
		filteredClubs,
		availableTags,
		availableStatuses,
		updateFilter,
		resetFilters,
		hasActiveFilters
	} = useMapFilters(mapItems, neighborhoods);

	return (
		<div className="w-full mx-auto">
			{/* Mobile layout: Show popover button */}
			<div className="block lg:hidden">
				<MapFilters
					filters={filters}
					availableNeighborhoods={neighborhoods}
					availableTags={availableTags}
					availableStatuses={availableStatuses}
					onFilterChange={updateFilter}
					onReset={resetFilters}
					hasActiveFilters={hasActiveFilters}
					layout="popover"
				/>
			</div>
			
			{/* Desktop layout: Two columns */}
			<div className="hidden lg:flex lg:gap-6">
				{/* Left column: Filters sidebar */}
				<div className="w-80 flex-shrink-0">
					<MapFilters
						filters={filters}
						availableNeighborhoods={neighborhoods}
						availableTags={availableTags}
						availableStatuses={availableStatuses}
						onFilterChange={updateFilter}
						onReset={resetFilters}
						hasActiveFilters={hasActiveFilters}
						layout="sidebar"
					/>
				</div>
				
				{/* Right column: Map */}
				<div className="flex-1">
					<CustomMap clubs={filteredClubs} />
				</div>
			</div>
			
			{/* Mobile layout: Full width map */}
			<div className="block lg:hidden">
				<CustomMap clubs={filteredClubs} />
			</div>
		</div>
	);
});
