import ArchivePage from "@/components/maps/first-map";

export default function Home() {
	return (
		<main className="grid grid-rows-[120px_1fr] gap-6">
			<h1 className="text-3xl font-bold mb-6">Cape Town Club Archive</h1>
			<ArchivePage />
		</main>
	);
}
