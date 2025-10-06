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

    // For demo purposes, return mock data based on NASA SMAP specifications
    // In a real implementation, this would call NASA APIs or your data source
    const mockSoilMoisture = {
      value: 0.45, // 45% moisture (initial mocked data)
      unit: "m³/m³",
      timestamp: date || new Date().toISOString(),
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      dataSource: nasaDataInfo.smap,
      quality: "good",
      depth: "0-5cm", // SMAP measures top 5cm
    };

    return NextResponse.json(mockSoilMoisture, {
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Soil moisture API error:", error);
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
