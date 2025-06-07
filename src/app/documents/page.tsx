import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = {
	title: "Knowledge Shares",
	description: "Explore our client success stories and project knowledge shares",
};

export default async function KnowledgeSharesPage() {
	const knowledgeShares = await getAllPosts();

	return (
		<div className="max-w-7xl mx-auto py-10 px-8 mt-16">
			<h1 className="text-4xl font-bold mb-8">Knowledge Shares</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{knowledgeShares.map((knowledgeShare) => (
					<Link key={knowledgeShare.slug} href={`/documents/${knowledgeShare.slug}`}>
						<Card className="h-full hover:shadow-lg transition-shadow bg-white border-0">
							<CardHeader>
								<CardTitle className="text-desktop-h4 font-medium leading-[1.5]">{knowledgeShare.title}</CardTitle>
								<CardDescription>{formatDate(knowledgeShare.date)}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-desktop-body-caption">{knowledgeShare.excerpt}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
