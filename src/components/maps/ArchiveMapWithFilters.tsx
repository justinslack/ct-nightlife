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
			<MapFilters
				filters={filters}
				availableNeighborhoods={neighborhoods}
				availableTags={availableTags}
				availableStatuses={availableStatuses}
				onFilterChange={updateFilter}
				onReset={resetFilters}
				hasActiveFilters={hasActiveFilters}
			/>
			<CustomMap clubs={filteredClubs} />
		</div>
	);
});
