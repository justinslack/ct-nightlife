"use client";

import { useEffect } from "react";

export default function GoogleMapsLoader({ onLoad }: { onLoad: () => void }) {
	useEffect(() => {
		if (typeof window === "undefined") return;

		if (!window.google) {
			const script = document.createElement("script");
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`;
			script.async = true;
			script.defer = true;
			script.setAttribute("loading", "async");
			script.onload = () => onLoad();
			document.head.appendChild(script);
		} else {
			onLoad();
		}
	}, [onLoad]);

	return null;
}
