import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/ui/Gallery";
import Image from "next/image";
import { BookUser, MapPin, Calendar, Tags } from "lucide-react";

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

		const {
			title,
			address,
			neighborhood,
			start_year,
			end_year,
			tags,
			cover_image,
			gallery,
			notable_events,
			sources,
			logo_image,
			status,
			content: Content,
		} = post;

		return (
			<article className="mx-auto pb-10">
				{gallery?.length > 0 && (
					<div className="relative">
						<div
							className="gallery-bg bg-pink-700 absolute inset-0 dark:bg-gray-800 mix-blend-multiply"
							style={
								cover_image
									? {
											backgroundImage: `url(${cover_image})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
											backgroundRepeat: "no-repeat",
											// backgroundBlendMode: "darken",
									  }
									: undefined
							}
						></div>
						<Gallery images={gallery} cover_image={cover_image} />
					</div>
				)}
				<div className="p-8 border-b border-b-secondary prose prose-lg dark:prose-invert max-w-7xl mx-auto my-16">
					This venue is {status}
					<h1 className="flex items-center">
						{logo_image && (
							<Image src={logo_image} alt={`${title} logo`} className="rounded-md inline-block h-10 not-prose mr-2 my-0" width={40} height={40} priority />
						)}
						{title}
					</h1>
					<div className="text-desktop-caption mt-4 space-y-1">
						<div className="flex items-center gap-2">
							<BookUser /> <strong>Address:</strong> {address}
						</div>
						<div className="flex items-center gap-2">
							<MapPin /> <strong>Neighborhood:</strong> {neighborhood}
						</div>
						<div className="flex items-center gap-2">
							<Calendar /> <strong>Years Active:</strong> {start_year} - {end_year ?? "Present"}
						</div>
					</div>
					<h3>Tagged</h3>
					<div className="flex gap-2 flex-wrap my-4 items-center">
						<Tags />
						{tags?.map((tag) => (
							<span key={tag} className="font-medium text-desktop-caption text-pink-600">
								#{tag}
							</span>
						))}
					</div>
				</div>

				<div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
					{Content}

					{notable_events?.length > 0 && (
						<div className="mt-12">
							<h2 className="text-2xl font-semibold mb-4">Notable Events</h2>
							<ul className="list-disc pl-5">
								{notable_events.map((event, index) => (
									<li key={index}>
										<strong>{event.year}:</strong> {event.title} - {event.description}
									</li>
								))}
							</ul>
						</div>
					)}

					{sources?.length > 0 && (
						<div className="mt-12">
							<h2 className="text-2xl font-semibold mb-4">Links</h2>
							<ul className="list-disc pl-5">
								{sources.map((source, index) => (
									<li key={index}>
										<a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">
											{source.title}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="mt-12 pt-8 border-t">
						<Link href="/the-clubs" className="text-primary hover:underline">
							← Back to the archive
						</Link>
					</div>
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
					<Link href="/the-clubs" className="text-primary hover:underline">
						← Back to all documents
					</Link>
				</div>
			</div>
		);
	}
}
