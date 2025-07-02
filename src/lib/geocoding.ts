interface GeocodeResult {
  lat: number;
  lng: number;
  formatted_address?: string;
}

interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }>;
  status: string;
}

/**
 * Geocode an address using Google Maps Geocoding API
 * Requires GOOGLE_MAPS_API_KEY environment variable
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY environment variable is required for geocoding');
    return null;
  }

  if (!address || address.trim() === '') {
    console.warn('Empty address provided for geocoding');
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data: GeocodeResponse = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
      };
    } else {
      console.warn(`Geocoding failed for address "${address}": ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error geocoding address "${address}":`, error);
    return null;
  }
}

/**
 * Fallback geocoding using OpenStreetMap Nominatim (free, no API key required)
 * Less accurate but doesn't require API keys
 */
export async function geocodeAddressOSM(address: string): Promise<GeocodeResult | null> {
  if (!address || address.trim() === '') {
    console.warn('Empty address provided for geocoding');
    return null;
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CT-Nightlife-Geocoder'
      }
    });
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formatted_address: result.display_name,
      };
    } else {
      console.warn(`OSM Geocoding failed for address "${address}"`);
      return null;
    }
  } catch (error) {
    console.error(`Error geocoding address "${address}" with OSM:`, error);
    return null;
  }
}

/**
 * Try Google Geocoding first, fallback to OSM if Google fails or no API key
 */
export async function geocodeAddressWithFallback(address: string): Promise<GeocodeResult | null> {
  // Try Google first if API key is available
  const googleResult = await geocodeAddress(address);
  if (googleResult) {
    return googleResult;
  }
  
  // Fallback to OpenStreetMap
  console.log(`Falling back to OSM geocoding for address: ${address}`);
  return await geocodeAddressOSM(address);
} 