// API Service for fetching NASA agricultural data
// This service handles communication with NASA APIs directly from the client

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface SoilMoistureData {
  value: number;
  unit: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  dataSource: {
    title: string;
    description: string;
    resolution: string;
    frequency: string;
  };
  quality: string;
  depth: string;
}

export interface TemperatureData {
  value: number;
  unit: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  dataSource: {
    title: string;
    description: string;
    resolution: string;
    frequency: string;
  };
  quality: string;
  type: string;
}

export interface RainfallData {
  value: number;
  unit: string;
  period: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  dataSource: {
    title: string;
    description: string;
    resolution: string;
    frequency: string;
  };
  quality: string;
  type: string;
}

export interface CropHealthData {
  ndvi: number;
  unit: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  dataSource: {
    title: string;
    description: string;
    resolution: string;
    frequency: string;
  };
  quality: string;
  type: string;
  interpretation: {
    health: string;
    status: string;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

// Default locations for demo purposes
export const DEFAULT_LOCATIONS: Location[] = [
  { latitude: -9.3963, longitude: -40.5121, name: "Northeast Brazil" },
];

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://balatro-react.vercel.app/api"
        : "http://localhost:3000/api";
  }

  private async fetchData<T>(
    endpoint: string,
    params: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null, loading: false };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        loading: false,
      };
    }
  }

  async getSoilMoisture(
    location: Location,
    date?: string
  ): Promise<ApiResponse<SoilMoistureData>> {
    const params: Record<string, string> = {
      lat: location.latitude.toString(),
      lon: location.longitude.toString(),
    };

    if (date) {
      params.date = date;
    }

    return this.fetchData<SoilMoistureData>("/soil-moisture", params);
  }

  async getTemperature(
    location: Location,
    date?: string
  ): Promise<ApiResponse<TemperatureData>> {
    const params: Record<string, string> = {
      lat: location.latitude.toString(),
      lon: location.longitude.toString(),
    };

    if (date) {
      params.date = date;
    }

    return this.fetchData<TemperatureData>("/temperature", params);
  }

  async getRainfall(
    location: Location,
    date?: string,
    period: string = "daily"
  ): Promise<ApiResponse<RainfallData>> {
    const params: Record<string, string> = {
      lat: location.latitude.toString(),
      lon: location.longitude.toString(),
      period,
    };

    if (date) {
      params.date = date;
    }

    return this.fetchData<RainfallData>("/rainfall", params);
  }

  async getCropHealth(
    location: Location,
    date?: string
  ): Promise<ApiResponse<CropHealthData>> {
    try {
      // Call MODIS API directly from client
      const modisUrl = new URL(
        "https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset"
      );
      modisUrl.searchParams.set("latitude", location.latitude.toString());
      modisUrl.searchParams.set("longitude", location.longitude.toString());
      modisUrl.searchParams.set("startDate", "A2023225");
      modisUrl.searchParams.set("endDate", "A2023365");
      modisUrl.searchParams.set("kmAboveBelow", "0");
      modisUrl.searchParams.set("kmLeftRight", "0");
      modisUrl.searchParams.set("band", "250m_16_days_NDVI");

      const response = await fetch(modisUrl.toString());

      if (!response.ok) {
        throw new Error(
          `MODIS API error: ${response.status} ${response.statusText}`
        );
      }

      const modisData = await response.json();

      // Extract the most recent NDVI value and scale it
      let ndviValue = 0.2; // Default fallback
      if (modisData?.subset && modisData.subset.length > 0) {
        const latestData = modisData.subset[modisData.subset.length - 1];
        const rawValue = latestData.data[0];
        const scale = parseFloat(modisData.scale || "0.0001");
        ndviValue = Math.round(rawValue * scale * 100) / 100; // Round to 2 decimal places
      }

      const cropHealthData: CropHealthData = {
        ndvi: ndviValue,
        unit: "index",
        timestamp: date || new Date().toISOString(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        dataSource: {
          title: "MODIS - Terra/Aqua Satellites",
          description:
            "Crop Health Index (Normalized Difference Vegetation Index) measures crop greenness and photosynthetic activity",
          resolution: "250m spatial resolution",
          frequency: "Daily observations (weather permitting)",
        },
        quality: "good",
        type: "NDVI",
        interpretation: {
          health:
            ndviValue >= 0.7
              ? "Excellent"
              : ndviValue >= 0.5
              ? "Good"
              : ndviValue >= 0.3
              ? "Moderate"
              : ndviValue >= 0.1
              ? "Poor"
              : "Very Poor",
          status:
            ndviValue >= 0.6
              ? "Healthy vegetation"
              : ndviValue >= 0.4
              ? "Moderate vegetation"
              : ndviValue >= 0.2
              ? "Sparse vegetation"
              : "Bare soil or stressed vegetation",
        },
      };

      return { data: cropHealthData, error: null, loading: false };
    } catch (error) {
      console.error("Crop health API error:", error);
      return {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch crop health data",
        loading: false,
      };
    }
  }

  // Fetch all agricultural data for a location
  async getAllAgriculturalData(
    location: Location,
    date?: string
  ): Promise<{
    soilMoisture: ApiResponse<SoilMoistureData>;
    temperature: ApiResponse<TemperatureData>;
    rainfall: ApiResponse<RainfallData>;
    cropHealth: ApiResponse<CropHealthData>;
  }> {
    const [soilMoisture, temperature, rainfall, cropHealth] = await Promise.all(
      [
        this.getSoilMoisture(location, date),
        this.getTemperature(location, date),
        this.getRainfall(location, date),
        this.getCropHealth(location, date),
      ]
    );

    return {
      soilMoisture,
      temperature,
      rainfall,
      cropHealth,
    };
  }

  // Convert API data to game metrics format
  convertToGameMetrics(apiData: {
    soilMoisture: ApiResponse<SoilMoistureData>;
    temperature: ApiResponse<TemperatureData>;
    rainfall: ApiResponse<RainfallData>;
    cropHealth: ApiResponse<CropHealthData>;
  }) {
    return {
      soilMoisture: apiData.soilMoisture.data?.value
        ? Math.round(apiData.soilMoisture.data.value * 100)
        : 45, // Convert to percentage
      temperature: apiData.temperature.data?.value
        ? Math.round(apiData.temperature.data.value)
        : 28,
      rainfall: apiData.rainfall.data?.value
        ? Math.round(apiData.rainfall.data.value)
        : 0,
      cropHealth: apiData.cropHealth.data?.ndvi
        ? Math.round(apiData.cropHealth.data.ndvi * 100) / 100
        : 0.2, // Round to 2 decimal places
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
