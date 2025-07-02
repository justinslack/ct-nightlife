"use client";

import { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMapLoader } from "./hooks/useMapLoader";
import MarkerPopup from "./components/MarkerPopup";
import { 
  DEFAULT_MAP_CONFIG, 
  createMarkerIcon, 
  calculateMapBounds, 
  calculateMarkerPosition,
  createClusterRenderer,
  createClusterClickHandler,
  debounce
} from "./utils/mapHelpers";
import type { Club, PopupState } from "./types/map.types";

interface CustomMapProps {
  clubs: Club[];
}

export default memo<CustomMapProps>(function CustomMap({ clubs }) {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const clustererRef = useRef<MarkerClusterer | null>(null);
	const markersRef = useRef<(google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[]>([]);
	const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
	
	const [popup, setPopup] = useState<PopupState | null>(null);
	const { isLoaded: mapLoaded, isLoading, error, retryLoad } = useMapLoader();

	const closePopup = useCallback(() => setPopup(null), []);
	
	// Debounced popup close for map interactions
	const debouncedClosePopup = useMemo(
		() => debounce(() => setPopup(null), 100),
		[]
	);

	const handleMarkerClick = useCallback((club: Club) => {
		const map = mapRef.current;
		if (!map) return;

		const position = calculateMarkerPosition(map, club.location);
		if (position) {
			setPopup({ ...position, club });
		}
	}, []);

	// Cleanup function
	const cleanup = useCallback(() => {
		// Remove event listeners
		listenersRef.current.forEach(listener => {
			google.maps.event.removeListener(listener);
		});
		listenersRef.current = [];

		// Clear clusterer
		if (clustererRef.current) {
			clustererRef.current.clearMarkers();
			clustererRef.current = null;
		}

		// Clear regular markers from map (Advanced Markers are handled by clusterer)
		markersRef.current.forEach(marker => {
			if ('setMap' in marker) {
				// This is a regular Marker
				marker.setMap(null);
			}
		});

		// Clear markers array
		markersRef.current = [];
	}, []);

	useEffect(() => {
		if (!mapLoaded || !mapContainerRef.current) return;

		async function initMap() {
			try {
				const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
				
				// Only load Advanced Markers if we have a mapId
				const useAdvancedMarkers = !!DEFAULT_MAP_CONFIG.mapId;
				let AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement | undefined;
				let Marker: typeof google.maps.Marker | undefined;
				
				if (useAdvancedMarkers) {
					const markerLibrary = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
					AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
				} else {
					Marker = google.maps.Marker;
				}

				const gmapElement = mapContainerRef.current!.querySelector("#gmap");
				if (!gmapElement || !Map) return;

				// Initialize map if it doesn't exist
				if (!mapRef.current) {
					const map = new Map(gmapElement as HTMLElement, {
						...DEFAULT_MAP_CONFIG,
						clickableIcons: false,
						streetViewControl: false,
						fullscreenControl: false,
						mapTypeControl: false,
						gestureHandling: "greedy",
						zoomControl: true,
					});

					mapRef.current = map;
				}

				const map = mapRef.current;
				
				// Clean up previous markers and clusterer
				cleanup();
				
				// Add map event listeners for popup closing (after cleanup)
				const dragListener = map.addListener("dragstart", debouncedClosePopup);
				const zoomListener = map.addListener("zoom_changed", debouncedClosePopup);
				
				listenersRef.current.push(dragListener, zoomListener);

				// Create markers for clubs
				const markers: (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[] = [];

				for (const club of clubs) {
					if (useAdvancedMarkers && AdvancedMarkerElement) {
						// Use Advanced Markers (requires mapId)
						const icon = createMarkerIcon();
						
						const marker = new AdvancedMarkerElement({
							position: club.location,
							title: club.title,
							content: icon,
						});

						const clickListener = marker.addListener("gmp-click", () => {
							handleMarkerClick(club);
						});
						
						listenersRef.current.push(clickListener);
						markers.push(marker);
					} else if (Marker) {
						// Use regular Markers (no mapId needed)
						const marker = new Marker({
							position: club.location,
							title: club.title,
							map,
							icon: {
								url: "/icons/disco-icon.svg",
								scaledSize: new google.maps.Size(40, 40),
							}
						});

						const clickListener = marker.addListener("click", () => {
							handleMarkerClick(club);
						});
						
						listenersRef.current.push(clickListener);
						markers.push(marker);
					}
				}

				markersRef.current = markers;

				// Set map bounds if clubs exist
				const bounds = calculateMapBounds(clubs);
				if (bounds && clubs.length > 1) {
					// Fit bounds with padding, then reduce zoom by 1 level for more space (same as cluster behavior)
					map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
					
					// Wait for fitBounds to complete, then reduce zoom slightly for extra space
					setTimeout(() => {
						const currentZoom = map.getZoom();
						if (currentZoom && currentZoom > DEFAULT_MAP_CONFIG.minZoom!) {
							map.setZoom(currentZoom - 1);
						}
					}, 100);
				} else if (clubs.length === 1) {
					map.setCenter(clubs[0].location);
					map.setZoom(14);
				}

				// Create clusterer with custom renderer
				if (markers.length > 0) {
					if (useAdvancedMarkers) {
						// Use MarkerClusterer with Advanced Markers
						const advancedMarkers = markers as google.maps.marker.AdvancedMarkerElement[];
						const clusterer = new MarkerClusterer({
							map,
							markers: advancedMarkers,
							renderer: createClusterRenderer(),
							onClusterClick: createClusterClickHandler(map),
						});
						clustererRef.current = clusterer;
					} else {
						// Regular markers are already added to the map individually
						// MarkerClusterer doesn't work well with regular markers in newer versions
						// So we skip clustering for regular markers
						console.log("Using regular markers - clustering disabled");
					}
				}
			} catch (error) {
				console.error("Failed to initialize map:", error);
			}
		}

		initMap();

		// Cleanup on unmount
		return cleanup;
	}, [mapLoaded, clubs, handleMarkerClick, debouncedClosePopup, cleanup]);

	// Loading states
	if (error) {
		return (
			<div className="relative w-full h-[calc(100vh-10rem)] rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-red-600 mb-4">Failed to load map: {error}</p>
					<button 
						onClick={retryLoad}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div ref={mapContainerRef} className="relative w-full h-[calc(100vh-10rem)] rounded-lg overflow-hidden">
			{/* Loading overlay */}
			{isLoading && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
					<div className="flex items-center space-x-3">
						<div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
						<span className="text-lg font-medium text-blue-700">Loading map…</span>
					</div>
				</div>
			)}
			
			{/* Map container */}
			<div id="gmap" className="absolute inset-0 z-0" />
			
			{/* Popup overlay */}
			{popup && (
				<div
					className="absolute z-50 pointer-events-none"
					style={{
						left: `${popup.x}px`,
						top: `${popup.y}px`,
						transform: "translateY(-100%)",
					}}
				>
					<div className="pointer-events-auto">
						<MarkerPopup 
							title={popup.club.title} 
							slug={popup.club.slug} 
							onClose={closePopup} 
							status={popup.club.status} 
						/>
					</div>
				</div>
			)}
		</div>
	);
});
