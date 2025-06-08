"use client";

import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import GoogleMapsLoader from "./GoogleMapsLoader";
import MarkerPopup from "./ClubMarker";

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
	const clustererRef = useRef<MarkerClusterer | null>(null);

	useEffect(() => {
		if (!mapLoaded || !mapContainerRef.current) return;

		async function initMap() {
			const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
			const { AdvancedMarkerElement } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

			const gmapElement = mapContainerRef.current!.querySelector("#gmap");
			if (!gmapElement || !Map || !AdvancedMarkerElement) return;

			if (!mapRef.current) {
				const map = new Map(gmapElement as HTMLElement, {
					center: { lat: -33.9249, lng: 18.4341 },
					zoom: 12,
					mapId: "fc59b2ef47016cea",
					clickableIcons: false,
					streetViewControl: false,
					fullscreenControl: false,
					mapTypeControl: false,
					gestureHandling: "greedy",
					zoomControl: true,
				});

				map.addListener("dragstart", () => setPopup(null));
				map.addListener("zoom_changed", () => setPopup(null));
				mapRef.current = map;
			}

			const map = mapRef.current!;
			const markers: google.maps.marker.AdvancedMarkerElement[] = [];

			for (const club of clubs) {
				const icon = document.createElement("img");
				icon.src = "/icons/disco-icon.svg";
				icon.className = "w-10 h-10";

				const marker = new AdvancedMarkerElement({
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

					const x = (point.x - center.x) * scale + map.getDiv().offsetWidth / 2;
					const y = (point.y - center.y) * scale + map.getDiv().offsetHeight / 2;

					setPopup({ x, y, club });
				});

				markers.push(marker);
			}

			// Clear previous clusterer if exists
			if (clustererRef.current) {
				clustererRef.current.clearMarkers();
			}

			// Create new clusterer with basic count display
			const clusterer = new MarkerClusterer({
				map,
				markers,
				renderer: {
					render: ({ count, position }) => {
						const div = document.createElement("div");
						div.className = "cluster-marker";
						div.textContent = String(count);
						div.style.cssText = `
              width: 40px;
              height: 40px;
              background: #000;
              color: #fff;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: bold;
            `;

						return new google.maps.marker.AdvancedMarkerElement({
							position,
							content: div,
						});
					},
				},
			});

			clustererRef.current = clusterer;
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
