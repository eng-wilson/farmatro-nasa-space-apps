import { DataInfo } from "@/types/game";

export const nasaDataInfo: Record<string, DataInfo> = {
  smap: {
    title: "SMAP - Soil Moisture Active Passive",
    description:
      "Measures top 5cm of soil moisture using L-band radar from orbit",
    resolution: "9 km spatial resolution",
    frequency: "Updates every 2-3 days",
    limitations:
      "Does not measure deep root zone (only top 5cm), affected by dense vegetation canopy, reduced accuracy in frozen/snow-covered soil",
    applications:
      "Irrigation scheduling, drought monitoring, flood prediction, agricultural water management",
  },
  modis: {
    title: "MODIS - Terra/Aqua Satellites",
    description:
      "Crop Health Index (Normalized Difference Vegetation Index) measures crop greenness and photosynthetic activity",
    resolution: "250m spatial resolution",
    frequency: "Daily observations (weather permitting)",
    limitations:
      "Blocked by clouds, atmospheric interference, sensitive to soil background, saturation at high biomass",
    applications:
      "Productivity index monitoring, yield prediction, stress detection, variable-rate application mapping",
  },
  gpm: {
    title: "GPM - Global Precipitation Measurement",
    description:
      "Measures rainfall and precipitation using dual-frequency radar and microwave imagers",
    resolution: "10 km spatial resolution",
    frequency: "Every 3 hours",
    limitations:
      "Light rain detection challenges, orographic effects, limited coverage at poles",
    applications:
      "Irrigation planning, flood forecasting, water resource management",
  },
  merra2: {
    title: "MERRA-2 - Modern-Era Retrospective analysis",
    description:
      "Atmospheric reanalysis providing temperature, humidity, and weather data",
    resolution: "50 km spatial resolution",
    frequency: "Hourly updates",
    limitations:
      "Model-based (not direct observation), reduced accuracy in complex terrain",
    applications:
      "Crop modeling, growing degree days calculation, frost risk assessment",
  },
};
