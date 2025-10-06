# NASA Farm Navigator API Endpoints

This document describes the server-side API endpoints for retrieving agricultural data indexes used in the Farmatro game.

## Base URL

All endpoints are available at: `http://localhost:3000/api/`

## Endpoints

### 1. Soil Moisture

**Endpoint:** `GET /api/soil-moisture`

**Description:** Retrieves soil moisture data based on NASA SMAP (Soil Moisture Active Passive) satellite data.

**Parameters:**

- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate
- `date` (optional): Date in ISO format (defaults to current date)

**Example Request:**

```
GET /api/soil-moisture?lat=40.7128&lon=-74.0060&date=2024-01-15
```

**Response:**

```json
{
  "value": 0.35,
  "unit": "m³/m³",
  "timestamp": "2024-01-15T00:00:00.000Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "dataSource": {
    "title": "SMAP - Soil Moisture Active Passive",
    "description": "Measures top 5cm of soil moisture using L-band radar from orbit",
    "resolution": "9 km spatial resolution",
    "frequency": "Updates every 2-3 days"
  },
  "quality": "good",
  "depth": "0-5cm"
}
```

### 2. Temperature

**Endpoint:** `GET /api/temperature`

**Description:** Retrieves air temperature data based on NASA MERRA-2 atmospheric reanalysis.

**Parameters:**

- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate
- `date` (optional): Date in ISO format (defaults to current date)

**Example Request:**

```
GET /api/temperature?lat=40.7128&lon=-74.0060
```

**Response:**

```json
{
  "value": 25.5,
  "unit": "°C",
  "timestamp": "2024-01-15T00:00:00.000Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "dataSource": {
    "title": "MERRA-2 - Modern-Era Retrospective analysis",
    "description": "Atmospheric reanalysis providing temperature, humidity, and weather data",
    "resolution": "50 km spatial resolution",
    "frequency": "Hourly updates"
  },
  "quality": "good",
  "type": "air_temperature_2m"
}
```

### 3. Rainfall

**Endpoint:** `GET /api/rainfall`

**Description:** Retrieves precipitation data based on NASA GPM (Global Precipitation Measurement).

**Parameters:**

- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate
- `date` (optional): Date in ISO format (defaults to current date)
- `period` (optional): Time period - "daily", "weekly", or "monthly" (defaults to "daily")

**Example Request:**

```
GET /api/rainfall?lat=40.7128&lon=-74.0060&period=weekly
```

**Response:**

```json
{
  "value": 15.2,
  "unit": "mm",
  "period": "weekly",
  "timestamp": "2024-01-15T00:00:00.000Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "dataSource": {
    "title": "GPM - Global Precipitation Measurement",
    "description": "Measures rainfall and precipitation using dual-frequency radar and microwave imagers",
    "resolution": "10 km spatial resolution",
    "frequency": "Every 3 hours"
  },
  "quality": "good",
  "type": "precipitation_rate"
}
```

### 4. Crop Health (NDVI)

**Endpoint:** Client-side direct call to MODIS ORNL API

**Description:** Retrieves crop health data from real NASA MODIS NDVI (Normalized Difference Vegetation Index) via direct client-side call to MODIS ORNL API.

**Parameters:**

- `lat` (required): Latitude coordinate
- `lon` (required): Longitude coordinate
- `date` (optional): Date in ISO format (defaults to current date)

**Example Request:**

```
Client-side call via apiService.getCropHealth(location)
```

**Response:**

```json
{
  "ndvi": 0.75,
  "unit": "index",
  "timestamp": "2024-01-15T00:00:00.000Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.006
  },
  "dataSource": {
    "title": "MODIS - Terra/Aqua Satellites",
    "description": "Crop Health Index (Normalized Difference Vegetation Index) measures crop greenness and photosynthetic activity",
    "resolution": "250m spatial resolution",
    "frequency": "Daily observations (weather permitting)"
  },
  "quality": "good",
  "type": "NDVI",
  "interpretation": {
    "health": "Excellent",
    "status": "Healthy vegetation"
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `400 Bad Request`: Missing required parameters
- `500 Internal Server Error`: Server-side error

Error response format:

```json
{
  "error": "Error message description"
}
```

## CORS Support

All endpoints include CORS headers to support cross-origin requests from web applications.

## Caching

Endpoints include appropriate cache headers:

- Soil Moisture & Crop Health: 1 hour cache
- Temperature & Rainfall: 30 minutes cache

## AI Generation Disclosure

**These API endpoints include AI-generated mock data for demonstration purposes.** The crop health endpoint now connects to real NASA MODIS data via direct client-side calls to the ORNL API, while other endpoints use mock data. In a production environment, all endpoints would connect to real NASA data sources.

## Usage in Farmatro Game

These endpoints are designed to provide real-time agricultural data that can be integrated into the Farmatro game to:

- Update game metrics with real satellite data
- Provide educational context about NASA's agricultural monitoring capabilities
- Enhance the learning experience with actual scientific data sources
