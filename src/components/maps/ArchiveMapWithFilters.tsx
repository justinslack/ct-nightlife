"use client";

import { useState } from "react";
import CustomMap from "@/components/maps/CustomMap";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";

type Club = {
	title: string;
	slug: string;
	location: { lat: number; lng: number };
	status: "active" | "closed";
	neighborhood: string;
	tags: string[];
};

export default function ArchiveMapWithFilters({ mapItems, neighborhoods }: { mapItems: Club[]; neighborhoods: string[] }) {
	const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(neighborhoods);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

	const tags = Array.from(new Set(mapItems.flatMap((c) => c.tags)));
	const statuses = ["active", "closed"];

	const toggleSelected = (set: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
		set((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
	};

	const resetFilters = () => {
		setSelectedNeighborhoods(neighborhoods);
		setSelectedTags([]);
		setSelectedStatuses([]);
	};

	const filtered = mapItems.filter((item) => {
		const matchesNeighborhood = !selectedNeighborhoods.length || selectedNeighborhoods.includes(item.neighborhood);
		const matchesTag = !selectedTags.length || item.tags.some((tag) => selectedTags.includes(tag));
		const matchesStatus = !selectedStatuses.length || selectedStatuses.includes(item.status);
		return matchesNeighborhood && matchesTag && matchesStatus;
	});

	return (
		<div className="w-full mx-auto">
			{/* Filter Panel */}
			<div className="mb-6 flex justify-end">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline">Filter</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[90vw] md:w-[700px] max-w-[90vw] p-6 relative" align="end">
						<PopoverClose asChild>
							<button className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" aria-label="Close">
								<X className="h-4 w-4" />
							</button>
						</PopoverClose>
						<div className="grid gap-6">
							{/* Neighborhoods */}
							<div className="flex flex-col gap-2">
								<h3 className="font-medium">Neighbourhood</h3>
								<div className="grid gap-2 md:grid-cols-3">
									{neighborhoods.map((neigh) => (
										<label key={neigh} className="flex items-center gap-2">
											<Checkbox checked={selectedNeighborhoods.includes(neigh)} onCheckedChange={() => toggleSelected(setSelectedNeighborhoods, neigh)} />
											{neigh}
										</label>
									))}
								</div>
							</div>
							{/* Tags */}
							<div className="flex flex-col gap-2">
								<h3 className="font-medium">Tags</h3>
								<div className="grid gap-2 md:grid-cols-3">
									{tags.map((tag) => (
										<label key={tag} className="flex items-center gap-2">
											<Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleSelected(setSelectedTags, tag)} />
											{tag.charAt(0).toUpperCase() + tag.slice(1)}
										</label>
									))}
								</div>
							</div>
							{/* Status */}
							<div className="flex flex-col gap-2">
								<h3 className="font-medium">Status</h3>
								<div className="grid md:grid-cols-2 gap-2">
									{statuses.map((status) => (
										<label key={status} className="flex items-center gap-2 capitalize">
											<Checkbox checked={selectedStatuses.includes(status)} onCheckedChange={() => toggleSelected(setSelectedStatuses, status)} />
											{status}
										</label>
									))}
								</div>
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button variant="ghost" size="sm" onClick={resetFilters} className="p-0">
								Clear selection
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* Map */}
			<CustomMap clubs={filtered} />
		</div>
	);
}
