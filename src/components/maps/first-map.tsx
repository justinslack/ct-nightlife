import CustomMap from "@/components/maps/CustomMap";
import { getAllPosts } from "@/lib/mdx";

export default async function ArchivePage() {
	const posts = await getAllPosts();
	const mapItems = posts.map((post) => ({
		title: post.title,
		slug: post.slug,
		location: post.location,
	}));

	return (
		<div className="w-full mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold mb-6">Cape Town Club Archive</h1>
			<CustomMap clubs={mapItems} />
		</div>
	);
}
