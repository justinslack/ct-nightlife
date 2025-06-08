"use client";

import { useEffect, useRef, useState } from "react";
import MarkerPopup from "./ClubMarker";
import GoogleMapsLoader from "./GoogleMapsLoader";

type Club = {
	title: string;
	slug: string;
	location: { lat: number; lng: number };
	status: "active" | "closed";
};

type PopupState = {
	x: number;
	y: number;
	club: Club;
};

export default function CustomMap({ clubs }: { clubs: Club[] }) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [popup, setPopup] = useState<PopupState | null>(null);

	useEffect(() => {
		if (!mapLoaded || !mapContainerRef.current) return;

		async function initMap() {
			const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
			const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

			const gmapElement = mapContainerRef.current?.querySelector("#gmap");
			if (!gmapElement) return;

			const map = new Map(gmapElement as HTMLElement, {
				center: { lat: -33.9249, lng: 18.4341 },
				zoom: 14,
				mapId: "fc59b2ef47016cea",
				clickableIcons: false,
				streetViewControl: false,
				fullscreenControl: false,
				mapTypeControl: false,
				gestureHandling: "greedy",
				zoomControl: true,
			});

			mapRef.current = map;

			clubs.forEach((club) => {
				const icon = document.createElement("img");
				icon.src = "/icons/disco-icon.svg";
				icon.className = "w-10 h-10";

				const marker = new AdvancedMarkerElement({
					map,
					position: club.location,
					title: club.title,
					content: icon,
				});

				marker.addListener("gmp-click", () => {
					const projection = map.getProjection();
					if (!projection) return;

					const latLng = new google.maps.LatLng(club.location.lat, club.location.lng);
					const point = projection.fromLatLngToPoint(latLng);
					const center = projection.fromLatLngToPoint(map.getCenter()!);
					const zoom = map.getZoom() ?? 11;
					const scale = Math.pow(2, zoom);

					if (!point || !center) return;

					const x = (point.x - center.x) * scale + map.getDiv().offsetWidth / 2 + 0; // +20px for spacing
					const y = (point.y - center.y) * scale + map.getDiv().offsetHeight / 2 - 0; // -40px to position above

					setPopup({
						x,
						y,
						club,
					});
				});
			});

			map.addListener("dragstart", () => setPopup(null));
			map.addListener("zoom_changed", () => setPopup(null));
		}

		initMap();
	}, [mapLoaded, clubs]);

	return (
		<>
			<GoogleMapsLoader onLoad={() => setMapLoaded(true)} />
			<div ref={mapContainerRef} className="relative w-full h-screen rounded-lg">
				<div id="gmap" className="absolute inset-0" />

				{popup && (
					<div
						className="absolute z-50"
						style={{
							left: `${popup.x}px`,
							top: `${popup.y}px`,
							transform: "translateY(-100%)",
						}}
					>
						<MarkerPopup title={popup.club.title} slug={popup.club.slug} onClose={() => setPopup(null)} status={popup.club.status} />
					</div>
				)}
			</div>
		</>
	);
}
