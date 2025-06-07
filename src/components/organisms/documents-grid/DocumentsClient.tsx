"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Post = {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags?: string[];
	author?: {
		name: string;
		avatar?: string;
	};
};

function DocumentsContent({ posts }: { posts: Post[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tagFromURL = searchParams.get("tag") ?? "";
	const initialTags = useMemo(() => (tagFromURL ? tagFromURL.split(",") : []), [tagFromURL]);

	const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

	useEffect(() => {
		setSelectedTags(initialTags);
	}, [initialTags, tagFromURL]);

	const handleTagToggle = (tag: string) => {
		const updated = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag];

		setSelectedTags(updated);

		const params = new URLSearchParams(searchParams);
		if (updated.length === 0) {
			params.delete("tag");
		} else {
			params.set("tag", updated.join(","));
		}
		router.replace(`?${params.toString()}`);
	};

	const allTags = Array.from(new Set(posts.flatMap((post) => post.tags ?? [])));

	const filteredPosts = selectedTags.length === 0 ? posts : posts.filter((post) => post.tags?.some((tag) => selectedTags.includes(tag)));

	const tagCounts: Record<string, number> = posts.reduce((acc, post) => {
		(post.tags ?? []).forEach((tag) => {
			acc[tag] = (acc[tag] || 0) + 1;
		});
		return acc;
	}, {} as Record<string, number>);

	return (
		<div className="max-w-7xl mx-auto py-10 px-8 mt-16">
			<div className="flex items-start justify-between mb-8 flex-wrap gap-4">
				<div>
					<h1 className="text-4xl font-bold">Documents</h1>
				</div>
				<div className="flex items-center gap-2">
					<span>Filter</span>
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" className=" hover:bg-accent rounded-full">
								Select Tags
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-64 p-4 bg-white border-0" side="bottom" align="end">
							<div className="grid gap-3">
								{allTags.map((tag) => (
									<label key={tag} className="flex items-center justify-between gap-2 cursor-pointer hover:bg-neutral-100 px-2 py-1 rounded">
										<div className="flex items-center gap-2">
											<Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => handleTagToggle(tag)} id={`tag-${tag}`} />
											<span className="text-sm">{tag}</span>
										</div>
										<span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{tagCounts[tag] ?? 0}</span>
									</label>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
			{selectedTags.length > 0 && (
				<div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-2 items-center mb-8 justify-between">
					<div className="flex items-center gap-2">
						Viewing:
						{selectedTags.map((tag) => (
							<Button key={tag} variant="outline" className="h-6 px-3 rounded-full text-small" onClick={() => handleTagToggle(tag)}>
								{tag} ×
							</Button>
						))}
						<Button
							variant="ghost"
							className="text-small underline text-neutral-600 hover:bg-transparent px-2 py-0 h-6 hover:text-neutral-700"
							onClick={() => {
								setSelectedTags([]);
								const params = new URLSearchParams(searchParams);
								params.delete("tag");
								router.replace(`?${params.toString()}`);
							}}
						>
							Clear all
						</Button>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
				{filteredPosts.map((post) => (
					<Link key={post.slug} href={`/documents/${post.slug}`}>
						<Card className="h-full hover:shadow-lg transition-shadow bg-white border-0">
							<CardHeader>
								<CardTitle className="text-desktop-h4 font-medium leading-[1.5]">{post.title}</CardTitle>
								<CardDescription>{formatDate(post.date)}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-desktop-body-caption">{post.excerpt}</p>
							</CardContent>
							<CardFooter className="mt-auto">
								<div className="flex gap-2 flex-wrap">
									{post.tags?.map((tag) => (
										<span key={tag} className="bg-neutral-100 px-4 py-1 rounded-2xl font-medium text-secondary text-sm">
											{tag}
										</span>
									))}
								</div>
							</CardFooter>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}

export function DocumentsClient({ posts }: { posts: Post[] }) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DocumentsContent posts={posts} />
		</Suspense>
	);
}
