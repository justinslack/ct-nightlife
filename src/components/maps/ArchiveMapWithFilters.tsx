"use client";

import { useState } from "react";
import CustomMap from "@/components/maps/CustomMap";

type Club = {
	title: string;
	slug: string;
	location: { lat: number; lng: number };
	status: "active" | "closed";
	neighborhood: string;
};

export default function ArchiveMapWithFilters({ mapItems, neighborhoods }: { mapItems: Club[]; neighborhoods: string[] }) {
	// Initialize with all neighborhoods selected
	const [selected, setSelected] = useState<string[]>(neighborhoods);

	const handleChange = (neigh: string) => {
		setSelected((prev) => (prev.includes(neigh) ? prev.filter((n) => n !== neigh) : [...prev, neigh]));
	};

	const filtered = selected.length ? mapItems.filter((item) => selected.includes(item.neighborhood)) : mapItems;

	return (
		<div className="w-full mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold mb-6">Cape Town Club Archive</h1>
			<div className="mb-6 flex flex-wrap gap-4">
				{neighborhoods.map((neigh) => (
					<label key={neigh} className="flex items-center gap-2">
						<input type="checkbox" checked={selected.includes(neigh)} onChange={() => handleChange(neigh)} />
						<span>{neigh}</span>
					</label>
				))}
			</div>
			<CustomMap clubs={filtered} />
		</div>
	);
}
