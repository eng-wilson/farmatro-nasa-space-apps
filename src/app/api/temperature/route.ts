import { NextRequest, NextResponse } from "next/server";
import { nasaDataInfo } from "@/data/nasaData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const date = searchParams.get("date");

    // Validate required parameters
    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // For demo purposes, return mock data based on NASA MERRA-2 specifications
    // In a real implementation, this would call NASA APIs or your data source
    const mockTemperature = {
      value: 28, // 28°C (initial mocked data)
      unit: "°C",
      timestamp: date || new Date().toISOString(),
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      dataSource: nasaDataInfo.merra2,
      quality: "good",
      type: "air_temperature_2m", // MERRA-2 2-meter air temperature
    };

    return NextResponse.json(mockTemperature, {
      headers: {
        "Cache-Control": "public, max-age=1800", // Cache for 30 minutes
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Temperature API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
