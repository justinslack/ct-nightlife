import { getAllPosts } from "@/lib/mdx";
import ArchiveMapWithFilters from "./ArchiveMapWithFilters";
import type { Club } from "./types/map.types";

interface ArchiveMapProps {
  className?: string;
}

interface PostData {
  title?: string;
  slug?: string;
  location?: { lat: number; lng: number };
  status?: string;
  neighborhood?: string;
  tags?: string[];
}

function transformPostToClub(post: PostData): Club {
  return {
    title: post.title || "Untitled",
    slug: post.slug || "",
    location: post.location || { lat: 0, lng: 0 },
    status: (post.status === "closed" ? "closed" : "active") as "active" | "closed",
    neighborhood: post.neighborhood || "Unknown",
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

export default async function ArchiveMap({ className }: ArchiveMapProps) {
  try {
    const posts = await getAllPosts();
    
    // Transform and validate data
    const mapItems: Club[] = posts
      .map(transformPostToClub)
      .filter((club) => club.location.lat !== 0 && club.location.lng !== 0); // Filter out invalid locations

    // Extract unique neighborhoods and sort them
    const neighborhoods = Array.from(
      new Set(mapItems.map((item) => item.neighborhood))
    )
      .filter(Boolean) // Remove empty/null values
      .sort();

    if (mapItems.length === 0) {
      return (
        <div className={`w-full mx-auto ${className || ""}`}>
          <div className="text-center py-12 text-gray-500">
            <p>No clubs with valid locations found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <ArchiveMapWithFilters 
          mapItems={mapItems} 
          neighborhoods={neighborhoods} 
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load archive map data:", error);
    
    return (
      <div className={`w-full mx-auto ${className || ""}`}>
        <div className="text-center py-12 text-red-500">
          <p>Failed to load map data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
} 