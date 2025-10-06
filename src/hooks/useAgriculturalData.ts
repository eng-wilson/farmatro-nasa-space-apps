import { useState, useEffect, useCallback } from "react";
import { apiService, Location, DEFAULT_LOCATIONS } from "@/services/apiService";

export interface AgriculturalDataState {
  soilMoisture: number;
  temperature: number;
  rainfall: number;
  cropHealth: number;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  location: Location;
}

export interface UseAgriculturalDataReturn {
  data: AgriculturalDataState;
  refreshData: () => Promise<void>;
  setLocation: (location: Location) => void;
  isLoading: boolean;
  hasError: boolean;
}

export function useAgriculturalData(
  initialLocation?: Location
): UseAgriculturalDataReturn {
  const [data, setData] = useState<AgriculturalDataState>({
    soilMoisture: 0, // Initial mocked data
    temperature: 0, // Initial mocked data
    rainfall: 0, // Initial mocked data
    cropHealth: 0, // Initial mocked data
    loading: true,
    error: null,
    lastUpdated: null,
    location: initialLocation || DEFAULT_LOCATIONS[0],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = useCallback(async (location: Location) => {
    setIsLoading(true);
    setHasError(false);

    try {
      const apiData = await apiService.getAllAgriculturalData(location);
      const gameMetrics = apiService.convertToGameMetrics(apiData);

      // Check if any API calls failed
      const hasApiError = Object.values(apiData).some(
        (response) => response.error
      );

      if (hasApiError) {
        const errors = Object.values(apiData)
          .filter((response) => response.error)
          .map((response) => response.error)
          .join(", ");

        setData((prev) => ({
          ...prev,
          loading: false,
          error: `API Error: ${errors}`,
          lastUpdated: new Date(),
        }));
        setHasError(true);
      } else {
        setData((prev) => ({
          ...prev,
          ...gameMetrics,
          loading: false,
          error: null,
          lastUpdated: new Date(),
          location,
        }));
      }
    } catch (error) {
      console.error("Error fetching agricultural data:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
        lastUpdated: new Date(),
      }));
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData(data.location);
  }, [fetchData, data.location]);

  const setLocation = useCallback(
    (location: Location) => {
      setData((prev) => ({ ...prev, location }));
      fetchData(location);
    },
    [fetchData]
  );

  // Initial data fetch
  useEffect(() => {
    fetchData(data.location);
  }, [fetchData, data.location]);

  return {
    data,
    refreshData,
    setLocation,
    isLoading,
    hasError,
  };
}

// Hook for getting available locations
export function useLocations() {
  return {
    locations: DEFAULT_LOCATIONS,
    getLocationByName: (name: string) =>
      DEFAULT_LOCATIONS.find((loc) => loc.name === name),
  };
}
