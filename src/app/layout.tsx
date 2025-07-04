import type { Metadata } from "next";
import { satoshi, archivo } from "@/lib/fonts";
import "./globals.css";
import MainNav from "@/components/organisms/nav/components/MainNav";
import WavyToggleButton from "@/components/ui/wavy-button";
import ScrollRevealFooter from "@/components/organisms/footer/ScrollRevealFooter";

export const metadata: Metadata = {
	title: "CT Nightlife Archive - Echoes of Cape Town's Club Scene",
	description: "Interactive map and archive of Cape Town's nightlife from the 1980s and 1990s. Discover the clubs, DJs, and nights that defined a generation.",
	keywords: ["Cape Town", "nightlife", "clubs", "1980s", "1990s", "archive", "music", "DJ"],
	authors: [{ name: "CT Nightlife Archive Team" }],
	openGraph: {
		title: "CT Nightlife Archive - Echoes",
		description: "Interactive map and archive of Cape Town's nightlife from the 1980s and 1990s",
		type: "website",
		url: "https://ctnightlife.co.za",
	},
	twitter: {
		card: "summary_large_image",
		title: "CT Nightlife Archive - Echoes",
		description: "Interactive map and archive of Cape Town's nightlife from the 1980s and 1990s",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* Critical resource hints */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				
				{/* Google Maps API preconnect - but don't preload the script */}
				<link rel="dns-prefetch" href="//maps.googleapis.com" />
				<link rel="dns-prefetch" href="//maps.gstatic.com" />
				<link rel="preconnect" href="https://maps.googleapis.com" />
				<link rel="preconnect" href="https://maps.gstatic.com" />
				
				{/* Preload critical assets */}
				<link
					rel="preload"
					href="/icons/disco-icon.svg"
					as="image"
					type="image/svg+xml"
				/>
				
				{/* Prefetch likely navigation targets */}
				<link rel="prefetch" href="/the-clubs" />
				<link rel="prefetch" href="/djs" />
				
				{/* Performance hints */}
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				
				{/* Prevent render-blocking */}
				<style>{`
					/* Prevent layout shift during font loading */
					body { font-family: system-ui, -apple-system, sans-serif; }
					.font-satoshi { font-family: var(--font-satoshi), system-ui, -apple-system, sans-serif; }
					.font-archivo { font-family: var(--font-archivo), system-ui, -apple-system, sans-serif; }
				`}</style>
			</head>
			<body className={`${satoshi.variable} ${archivo.variable} antialiased font-satoshi`}>
				<MainNav />
				{children}
				<ScrollRevealFooter />
				<WavyToggleButton audioSrc="/media/AboveSmoke-SaveUs.mp3" />
			</body>
		</html>
	);
}
