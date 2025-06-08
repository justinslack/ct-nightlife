import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata = {
	title: "Clubs",
	description: "Explore our client success stories and project clubs",
};

export default async function ClubsPage() {
	const clubs = await getAllPosts();

	// Helper function to get bg color based on status
	const getBgColor = (status: string) => (status === "closed" ? "bg-red-100 border-red-300 text-red-800" : "bg-green-100 border-green-300 text-green-800");

	return (
		<div className="max-w-7xl mx-auto py-10 px-8 mt-16">
			<h1 className="text-4xl font-bold mb-8">Current archive</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{clubs.map((club) => (
					<Link key={club.slug} href={`/documents/${club.slug}`}>
						<Card className="h-full hover:shadow-lg transition-shadow bg-white border-0">
							<CardHeader>
								<CardTitle className="text-desktop-h4 font-medium leading-[1.5]">{club.title}</CardTitle>
								<CardDescription>{formatDate(club.date)}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-desktop-body-caption">{club.excerpt}</p>
								{club.status && <p className={`text-desktop-body-caption px-2 py-1 rounded inline-block ${getBgColor(club.status)}`}>{club.status}</p>}
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
