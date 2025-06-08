import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "CT Nightlife Archive",
		short_name: "CT Nightlife",
		description: "Map based archive of Cape Town nightlife from the 1980s and 1990s.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		screenshots: [
			{
				src: "/phone-hero.png",
				sizes: "746x798",
				type: "image/png",
				form_factor: "wide",
				label: "Atura",
			},
			{
				src: "/phone-hero.png",
				sizes: "746x798",
				type: "image/png",
				label: "Atura",
			},
			{
				src: "/phone-hero.png",
				sizes: "746x798",
				type: "image/png",
				form_factor: "wide",
				label: "Atura",
			},
			{
				src: "/phone-hero.png",
				sizes: "746x798",
				type: "image/png",
				label: "Atura",
			},
		],
		related_applications: [
			{
				platform: "web",
				url: "https://ctnightlife.co.za",
			},
			{
				platform: "play",
				url: "https://ctnightlife.co.za",
			},
		],
	};
}
