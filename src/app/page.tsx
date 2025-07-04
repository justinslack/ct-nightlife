import ArchiveMap from "@/components/maps/ArchiveMap";
import {Video} from "@/components/ui/video";
import VenuesSlider from "@/components/venues/venues-slider-server";

export default function Home() {
	return (
		<main className="grid grid-rows-auto gap-6">
			<Video 
				src="/media/HeroHomevideoTwo.mp4" 
				h1="ECHOES" 
				className="mb-6 font-archivo"
			/>
			<VenuesSlider />
			<section className="p-16">
				<ArchiveMap />
			</section>
		</main>
	);
}
