import { useEffect, useState, useCallback } from 'react';

interface UseMapLoaderReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  retryLoad: () => void;
}

// Global state to prevent multiple script loads
let isGoogleMapsLoading = false;
let googleMapsLoadPromise: Promise<void> | null = null;

export function useMapLoader(): UseMapLoaderReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGoogleMaps = useCallback(() => {
    if (typeof window === "undefined") return;

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Check if already loading globally
    if (isGoogleMapsLoading && googleMapsLoadPromise) {
      setIsLoading(true);
      googleMapsLoadPromise
        .then(() => {
          setIsLoaded(true);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load Google Maps API");
          setIsLoading(false);
        });
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      setIsLoading(true);
      // Wait for existing script to load
      existingScript.addEventListener('load', () => {
        setIsLoaded(true);
        setIsLoading(false);
      });
      existingScript.addEventListener('error', () => {
        setError("Failed to load Google Maps API");
        setIsLoading(false);
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    isGoogleMapsLoading = true;

    const script = document.createElement("script");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key is not configured");
      setIsLoading(false);
      isGoogleMapsLoading = false;
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=maps,marker`;
    script.async = true;
    script.defer = true;
    script.setAttribute("loading", "async");

    googleMapsLoadPromise = new Promise<void>((resolve, reject) => {
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
        isGoogleMapsLoading = false;
        resolve();
      };

      script.onerror = () => {
        const errorMsg = "Failed to load Google Maps API";
        setError(errorMsg);
        setIsLoading(false);
        isGoogleMapsLoading = false;
        reject(new Error(errorMsg));
      };
    });

    document.head.appendChild(script);
  }, []);

  const retryLoad = useCallback(() => {
    setError(null);
    isGoogleMapsLoading = false;
    googleMapsLoadPromise = null;
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