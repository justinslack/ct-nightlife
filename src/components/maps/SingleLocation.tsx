// components/InteractiveMap.tsx
"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type SingleLocationProps = {
	lat: number;
	lng: number;
	zoom?: number;
	markerLabel?: string;
};

const containerStyle = {
	width: "100%",
	height: "400px",
	borderRadius: "0.5rem",
	overflow: "hidden",
};

export default function SingleLocationMap({ lat, lng, zoom = 14, markerLabel = "Location" }: SingleLocationProps) {
	const center = { lat, lng };

	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
				<Marker position={center} label={markerLabel} />
			</GoogleMap>
		</LoadScript>
	);
}
