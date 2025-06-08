import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
// import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/maps/Gallery";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
	try {
		const { slug } = await params;
		const post = await getPostBySlug(slug);

		if (!post) {
			return {
				title: "Post Not Found",
			};
		}

		return {
			title: post.title,
			description: post.description,
			openGraph: {
				title: post.title,
				description: post.description,
				type: "article",
				publishedTime: post.last_updated,
				authors: post.contributor ? [post.contributor] : [],
			},
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "Error Loading Post",
		};
	}
}

export async function generateStaticParams() {
	try {
		const posts = await getAllPosts();
		return posts.map((post) => ({
			slug: post.slug,
		}));
	} catch (error) {
		console.error("Error generating static params:", error);
		return [];
	}
}

export default async function DocsPage({ params }: { params: Params }) {
	try {
		const { slug } = await params;
		const post = await getPostBySlug(slug);

		if (!post) notFound();

		const { title, address, neighborhood, start_year, end_year, tags, gallery, contributor, notable_events, sources, content: Content } = post;

		return (
			<article className="mx-auto py-10 my-8 md:my-32 max-w-[1024px] flex flex-col gap-20 px-8">
				<div className="pb-8 border-b border-b-secondary">
					<h1 className="text-desktop-h1 font-medium mb-2 leading-[1.2]">{title}</h1>

					<div className="text-desktop-caption mt-4 space-y-1">
						<div>
							📍 <strong>Address:</strong> {address}
						</div>
						<div>
							🗺️ <strong>Neighborhood:</strong> {neighborhood}
						</div>
						<div>
							📅 <strong>Years Active:</strong> {start_year} – {end_year ?? "Present"}
						</div>
						<div>
							🎤 <strong>Contributor:</strong> {contributor}
						</div>
					</div>

					<div className="flex gap-2 flex-wrap my-4">
						{tags?.map((tag) => (
							<span key={tag} className="font-medium text-secondary text-desktop-caption">
								#{tag}
							</span>
						))}
					</div>
				</div>

				{/* <SingleLocationMap lat={location.lat} lng={location.lng} markerLabel={title} /> */}

				<div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">{Content}</div>

				{gallery?.length > 0 && (
					<div>
						<h2 className="text-2xl font-semibold mb-4">Gallery</h2>
						<Gallery images={gallery} />
					</div>
				)}

				{notable_events?.length > 0 && (
					<div className="mt-12">
						<h2 className="text-2xl font-semibold mb-4">Notable Events</h2>
						<ul className="list-disc pl-5">
							{notable_events.map((event, index) => (
								<li key={index}>
									<strong>{event.year}:</strong> {event.title} – {event.description}
								</li>
							))}
						</ul>
					</div>
				)}

				{sources?.length > 0 && (
					<div className="mt-12">
						<h2 className="text-2xl font-semibold mb-4">Sources</h2>
						<ul className="list-disc pl-5">
							{sources.map((source, index) => (
								<li key={index}>
									<a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
										{source.title}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}

				<div className="mt-12 pt-8 border-t">
					<Link href="/documents" className="text-primary hover:underline">
						← Back to all documents
					</Link>
				</div>
			</article>
		);
	} catch (error) {
		console.error("Error rendering document:", error);
		return (
			<div className="container mx-auto py-10">
				<h1 className="text-4xl font-bold mb-4">Error Loading Post</h1>
				<p>There was an error loading this post. Please try again later.</p>
				<div className="mt-12 pt-8 border-t">
					<Link href="/documents" className="text-primary hover:underline">
						← Back to all documents
					</Link>
				</div>
			</div>
		);
	}
}
