import ArchiveMap from "@/components/maps/ArchiveMap";
import {Video} from "@/components/ui/video";

export default function Home() {
	return (
		<main className="grid grid-rows-auto gap-6">
			<Video 
				src="/media/HeroHomevideoTwo.mp4" 
				h1="Echoes" 
				h2="The Clubs. The DJs. The Nights We Never Forgot."
				className="mb-6 font-archivo leading-tight font-light"
			/>
			<ArchiveMap />
		</main>
	);
}
