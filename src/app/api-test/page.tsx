"use client";

import React from "react";
import { useAgriculturalData } from "@/hooks/useAgriculturalData";

export default function ApiTestPage() {
  const { data, refreshData, isLoading } = useAgriculturalData();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          NASA Agricultural Data API Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location Selection</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">Current Location:</p>
              <p className="text-white font-medium">{data.location.name}</p>
              <p className="text-gray-400 text-xs">
                {data.location.latitude.toFixed(4)},{" "}
                {data.location.longitude.toFixed(4)}
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
              >
                {isLoading ? "Loading..." : "Refresh Data"}
              </button>
            </div>
          </div>

          {/* Data Display */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Data</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-300">Soil Moisture:</span>
                  <span className="text-white font-medium ml-2">
                    {data.soilMoisture}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Temperature:</span>
                  <span className="text-white font-medium ml-2">
                    {data.temperature}°C
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Rainfall:</span>
                  <span className="text-white font-medium ml-2">
                    {data.rainfall}mm
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Crop Health:</span>
                  <span className="text-white font-medium ml-2">
                    {(data.cropHealth * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              {data.error && (
                <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-xs">
                  {data.error}
                </div>
              )}
              {data.lastUpdated && (
                <p className="text-gray-400 text-xs mt-2">
                  Last updated: {data.lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Available API Endpoints
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-green-400 mb-2">Soil Moisture</h3>
              <p className="text-sm text-gray-300">SMAP satellite data</p>
              <code className="text-xs text-blue-300">/api/soil-moisture</code>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-blue-400 mb-2">Temperature</h3>
              <p className="text-sm text-gray-300">MERRA-2 atmospheric data</p>
              <code className="text-xs text-blue-300">/api/temperature</code>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-cyan-400 mb-2">Rainfall</h3>
              <p className="text-sm text-gray-300">GPM precipitation data</p>
              <code className="text-xs text-blue-300">/api/rainfall</code>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-400 mb-2">Crop Health</h3>
              <p className="text-sm text-gray-300">
                MODIS NDVI data (client-side)
              </p>
              <code className="text-xs text-blue-300">Direct MODIS API</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
