import { useEffect, useState, useCallback } from 'react';

interface UseMapLoaderReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  retryLoad: () => void;
}

export function useMapLoader(): UseMapLoaderReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGoogleMaps = useCallback(() => {
    if (typeof window === "undefined") return;

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    const script = document.createElement("script");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key is not configured");
      setIsLoading(false);
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker&loading=async`;
    script.async = true;
    script.defer = true;
    script.setAttribute("loading", "async");

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError("Failed to load Google Maps API");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const retryLoad = useCallback(() => {
    setError(null);
    loadGoogleMaps();
  }, [loadGoogleMaps]);

  useEffect(() => {
    loadGoogleMaps();
  }, [loadGoogleMaps]);

  return {
    isLoaded,
    isLoading,
    error,
    retryLoad
  };
} 