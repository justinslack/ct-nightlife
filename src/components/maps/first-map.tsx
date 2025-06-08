import { getAllPosts } from "@/lib/mdx";
import ArchiveMapWithFilters from "./ArchiveMapWithFilters";

export default async function ArchivePage() {
	const posts = await getAllPosts();
	const mapItems = posts.map((post) => ({
		title: post.title,
		slug: post.slug,
		location: post.location,
		status: (post.status === "closed" ? "closed" : "active") as "active" | "closed",
		neighborhood: post.neighborhood,
		tags: post.tags ?? [],
	}));

	const neighborhoods = Array.from(new Set(mapItems.map((item) => item.neighborhood))).sort();

	return <ArchiveMapWithFilters mapItems={mapItems} neighborhoods={neighborhoods} />;
}
