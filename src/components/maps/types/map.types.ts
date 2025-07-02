export interface Club {
  title: string;
  slug: string;
  location: { lat: number; lng: number };
  status: "active" | "closed";
  neighborhood: string;
  tags: string[];
}

export interface MapFilters {
  neighborhoods: string[];
  tags: string[];
  statuses: string[];
}

export interface PopupState {
  x: number;
  y: number;
  club: Club;
}

export type FilterType = keyof MapFilters;

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  mapId?: string;
  styles?: google.maps.MapTypeStyle[];
  minZoom?: number;
  maxZoom?: number;
} 