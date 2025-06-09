import React from "react";
import Image from "next/image";

type DJ = {
	id: number;
	name: string;
	genre: string;
	imageUrl?: string;
};

const djs: DJ[] = [
	{ id: 1, name: "DJ One", genre: "Hip Hop", imageUrl: "/images/clubs/galaxy-d.png" },
	{ id: 2, name: "DJ Two", genre: "Techno", imageUrl: "/images/clubs/galaxy-d.png" },
	{ id: 3, name: "DJ Three", genre: "House", imageUrl: "/images/clubs/galaxy-d.png" },
	// Add more DJs as needed
];

export default function DJsPage() {
	return (
		<main className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">DJ Listings</h1>
			<ul className="space-y-4">
				{djs.map((dj) => (
					<li key={dj.id} className="flex items-center space-x-4 p-4 border rounded shadow-sm">
						{dj.imageUrl && <Image src={dj.imageUrl} alt={dj.name} width={64} height={64} className="w-16 h-16 object-cover rounded-full" />}
						<div>
							<div className="text-xl font-semibold">{dj.name}</div>
							<div className="text-gray-600">{dj.genre}</div>
						</div>
					</li>
				))}
			</ul>
		</main>
	);
}
