import type React from "react";
import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Card } from "@/components/ui/card";
import { mdxComponents } from "@/mdx-components";

const contentDirectory = path.join(process.cwd(), "src", "content");

export type Post = {
	title: string;
	slug: string;
	location: {
		lat: number;
		lng: number;
	};
	address: string;
	neighborhood: string;
	decades: string[];
	status: string;
	tags: string[];
	start_year: number;
	end_year: number | null;
	cover_image: string;
	gallery: string[];
	description: string;
	notable_events: {
		year: number;
		title: string;
		description: string;
	}[];
	sources: {
		title: string;
		url: string;
	}[];
	contributor: string;
	last_updated: string;
	content: React.ReactElement;
	excerpt?: string;
	author?: {
		name: string;
	};
	date: string;
	draft?: boolean;
	logo_image?: string;
};

export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		// Sanitize the slug to prevent path traversal
		const sanitizedSlug = path.basename(slug);

		const filePath = path.join(contentDirectory, "documents", `${sanitizedSlug}.mdx`);

		if (!fs.existsSync(filePath)) {
			console.log(`File not found: ${filePath}`);
			return null;
		}

		const fileContent = fs.readFileSync(filePath, "utf8");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { content: rawContent, data: frontmatter } = matter(fileContent);

		const { content } = await compileMDX({
			source: fileContent,
			options: {
				parseFrontmatter: true,
				mdxOptions: {
					remarkPlugins: [remarkGfm],
					rehypePlugins: [rehypeHighlight],
				},
			},
			components: { ...mdxComponents, Card },
		});

		if (!frontmatter.title || !frontmatter.date) {
			console.error(`Missing required frontmatter (title or date) in ${sanitizedSlug}.mdx`);
			return null;
		}

		// Check if the document is a draft and return null if it is
		const isDraft = frontmatter.draft ?? false;
		if (isDraft) {
			console.log(`Document ${sanitizedSlug} is a draft, not returning content`);
			return null;
		}

		return {
			slug: sanitizedSlug,
			title: frontmatter.title,
			location: frontmatter.location ?? { lat: 0, lng: 0 },
			address: frontmatter.address ?? "",
			neighborhood: frontmatter.neighborhood ?? "",
			decades: frontmatter.decades ?? [],
			status: frontmatter.status ?? "",
			tags: frontmatter.tags ?? [],
			start_year: frontmatter.start_year ?? 0,
			end_year: frontmatter.end_year ?? null,
			cover_image: frontmatter.cover_image ?? "",
			gallery: frontmatter.gallery ?? [],
			description: frontmatter.description ?? "",
			notable_events: frontmatter.notable_events ?? [],
			sources: frontmatter.sources ?? [],
			contributor: frontmatter.contributor ?? "",
			last_updated: frontmatter.last_updated ?? "",
			content,
			excerpt: frontmatter.excerpt,
			author: frontmatter.author ? { name: frontmatter.author.name ?? "NML" } : undefined,
			date: frontmatter.date,
			draft: frontmatter.draft ?? false,
			logo_image: frontmatter.logo_image ?? "",
		};
	} catch (error) {
		console.error(`Error processing ${slug}.mdx:`, error);
		return null;
	}
}

export async function getAllPosts(): Promise<Post[]> {
	if (!fs.existsSync(contentDirectory)) {
		return [];
	}

	const blogDirectory = path.join(contentDirectory, "documents");

	if (!fs.existsSync(blogDirectory)) {
		return [];
	}

	const files = fs.readdirSync(blogDirectory);
	const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

	const posts = await Promise.all(
		mdxFiles.map(async (file) => {
			try {
				const slug = file.replace(/\.mdx$/, "");
				const post = await getPostBySlug(slug);
				return post;
			} catch (error) {
				console.error(`Error processing ${file}:`, error);
				return null;
			}
		})
	);

	return posts.filter((post): post is Post => post !== null && !post.draft).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
