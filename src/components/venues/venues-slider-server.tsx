import { getAllPosts } from "@/lib/mdx";
import { VenuesSliderClient } from "./venues-slider";

interface VenuesSliderProps {
  className?: string;
}

export default async function VenuesSlider({ className }: VenuesSliderProps) {
  try {
    const posts = await getAllPosts();
    const latest = posts.slice(0, 4).map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description || post.excerpt || "Discover this amazing venue and its story.",
      cover_image: post.cover_image || "/images/clubs/default.jpg",
      date: post.date,
    }));

    return <VenuesSliderClient venues={latest} className={className} />;
  } catch (error) {
    console.error("Error fetching venues:", error);
    return (
      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Failed to load venues. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
} 