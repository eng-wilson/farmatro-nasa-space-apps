import { NextRequest, NextResponse } from "next/server";
import { nasaDataInfo } from "@/data/nasaData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const date = searchParams.get("date");
    const period = searchParams.get("period") || "daily"; // daily, weekly, monthly

    // Validate required parameters
    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // For demo purposes, return mock data based on NASA GPM specifications
    // In a real implementation, this would call NASA APIs or your data source
    const mockRainfall = {
      value: 0, // 0mm rainfall (initial mocked data)
      unit: "mm",
      period: period,
      timestamp: date || new Date().toISOString(),
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      dataSource: nasaDataInfo.gpm,
      quality: "good",
      type: "precipitation_rate",
    };

    return NextResponse.json(mockRainfall, {
      headers: {
        "Cache-Control": "public, max-age=1800", // Cache for 30 minutes
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Rainfall API error:", error);
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
