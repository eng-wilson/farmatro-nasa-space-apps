import React from "react";
import MetricCard from "./MetricCard";
import { Penalty } from "@/types/game";

interface MetricsDisplayProps {
  soilPH: number;
  cropHealth: number;
  soilMoisture: number;
  temperature: number;
  rainfall: number;
  // Optional props for showing updated metrics with changes
  updatedSoilPH?: number;
  updatedCropHealth?: number;
  updatedSoilMoisture?: number;
  updatedTemperature?: number;
  updatedRainfall?: number;
  activePenalties?: Penalty[];
  // Force animation for scenario autoEffects
  forceTemperatureAnimation?: boolean;
  forceRainfallAnimation?: boolean;
  // Direction for forced animations (true = increase, false = decrease)
  forceTemperatureDirection?: boolean;
  forceRainfallDirection?: boolean;
  shouldRenderAnimation?: boolean;
}

export default function MetricsDisplay({
  soilPH,
  cropHealth,
  soilMoisture,
  temperature,
  rainfall,
  updatedSoilPH,
  updatedCropHealth,
  updatedSoilMoisture,
  updatedTemperature,
  updatedRainfall,
  activePenalties = [],
  forceTemperatureAnimation = false,
  forceRainfallAnimation = false,
  forceTemperatureDirection = true,
  forceRainfallDirection = true,
  shouldRenderAnimation,
}: MetricsDisplayProps) {
  return (
    <div className="z-10 grid grid-cols-1 gap-3 p-6 mt-[-40px]">
      <MetricCard
        icon="🧪"
        label="pH"
        value={soilPH.toFixed(2)}
        updatedValue={
          updatedSoilPH !== undefined ? updatedSoilPH.toFixed(2) : undefined
        }
        bgGradient="bg-purple-700"
        iconBg="bg-purple-900"
        explanation="Soil pH measures acidity or alkalinity on a scale of 0-14. Most crops thrive in slightly acidic to neutral soil (pH 6-7). Values outside this range can affect nutrient availability."
        penalties={activePenalties}
        metricKey="soilPH"
        shouldRenderAnimation={shouldRenderAnimation}
      />
      <MetricCard
        icon="🌱"
        label="Crop Health"
        value={cropHealth.toFixed(2)}
        updatedValue={
          updatedCropHealth !== undefined
            ? updatedCropHealth.toFixed(2)
            : undefined
        }
        bgGradient="bg-green-700"
        iconBg="bg-green-900"
        explanation="Crop Health Index uses satellite imagery to measure plant health and density. Values range from -1 to 1, with higher values indicating healthier vegetation."
        penalties={activePenalties}
        metricKey="cropHealth"
        shouldRenderAnimation={shouldRenderAnimation}
      />
      <MetricCard
        icon="💧"
        label="Moisture"
        value={`${soilMoisture.toFixed(1)}%`}
        updatedValue={
          updatedSoilMoisture !== undefined
            ? `${updatedSoilMoisture.toFixed(1)}%`
            : undefined
        }
        bgGradient="bg-blue-700"
        iconBg="bg-blue-900"
        explanation="Soil Moisture indicates the water content in your soil. Optimal levels are crucial for crop growth - too little causes drought stress, too much can lead to root problems."
        penalties={activePenalties}
        metricKey="soilMoisture"
        shouldRenderAnimation={shouldRenderAnimation}
      />
      <MetricCard
        icon="🌡️"
        label="Temp."
        value={`${temperature.toFixed(1)}°C`}
        updatedValue={
          updatedTemperature !== undefined
            ? `${updatedTemperature.toFixed(1)}°C`
            : undefined
        }
        forceAnimation={forceTemperatureAnimation}
        forceAnimationDirection={forceTemperatureDirection}
        bgGradient="bg-orange-700"
        iconBg="bg-orange-900"
        explanation="Weather Temperature affects crop growth rates, water needs, and pest activity. Different crops have optimal temperature ranges for growth and development."
        penalties={activePenalties}
        metricKey="temperature"
        shouldRenderAnimation={shouldRenderAnimation}
        hideProgressBar={true}
      />
      <MetricCard
        icon="🌧️"
        label="Rainfall"
        value={`${rainfall.toFixed(1)}mm`}
        updatedValue={
          updatedRainfall !== undefined
            ? `${updatedRainfall.toFixed(1)}mm`
            : undefined
        }
        forceAnimation={forceRainfallAnimation}
        forceAnimationDirection={forceRainfallDirection}
        bgGradient="bg-cyan-700"
        iconBg="bg-cyan-900"
        explanation="Rainfall Forecast predicts upcoming precipitation. This NASA data helps you plan irrigation schedules and avoid overwatering when rain is expected."
        penalties={activePenalties}
        metricKey="rainfall"
        shouldRenderAnimation={shouldRenderAnimation}
        hideProgressBar={true}
      />
    </div>
  );
}
