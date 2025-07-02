import type { Club, MapConfig } from '../types/map.types';

export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: { lat: -34.00838607138288, lng: 18.466771295682648 },
  zoom: 12,
  mapId: "fc59b2ef47016cea",
  minZoom: 8,
  maxZoom: 18
};

export const MAP_STYLES = {
  clusterer: `
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: transform 0.2s ease;
  `,
  clustererHover: `
    transform: scale(1.1);
  `
};

export function createMarkerIcon(): HTMLImageElement {
  const icon = document.createElement("img");
  icon.src = "/icons/disco-icon.svg";
  icon.className = "w-10 h-10 drop-shadow-md hover:scale-110 transition-transform duration-200";
  icon.alt = "Club location";
  return icon;
}

export function calculateMapBounds(clubs: Club[]): google.maps.LatLngBounds | null {
  if (clubs.length === 0) return null;
  
  const bounds = new google.maps.LatLngBounds();
  clubs.forEach((club) => {
    bounds.extend(club.location);
  });
  return bounds;
}

export function calculateMarkerPosition(
  map: google.maps.Map,
  location: { lat: number; lng: number }
): { x: number; y: number } | null {
  const projection = map.getProjection();
  if (!projection) return null;

  const latLng = new google.maps.LatLng(location.lat, location.lng);
  const point = projection.fromLatLngToPoint(latLng);
  const center = projection.fromLatLngToPoint(map.getCenter()!);
  const zoom = map.getZoom() ?? 11;
  const scale = Math.pow(2, zoom);

  if (!point || !center) return null;

  const x = (point.x - center.x) * scale + map.getDiv().offsetWidth / 2;
  const y = (point.y - center.y) * scale + map.getDiv().offsetHeight / 2;

  return { x, y };
}

export function createClusterRenderer() {
  return {
    render: ({ count, position }: { count: number; position: google.maps.LatLng }) => {
      const div = document.createElement("div");
      div.className = "cluster-marker";
      div.textContent = String(count);
      div.style.cssText = MAP_STYLES.clusterer;

      // Add hover effect
      div.addEventListener('mouseenter', () => {
        div.style.cssText = MAP_STYLES.clusterer + MAP_STYLES.clustererHover;
      });

      div.addEventListener('mouseleave', () => {
        div.style.cssText = MAP_STYLES.clusterer;
      });

      return new google.maps.marker.AdvancedMarkerElement({
        position,
        content: div,
      });
    },
  };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 