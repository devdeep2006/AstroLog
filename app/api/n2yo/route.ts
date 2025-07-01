import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const endpoint = searchParams.get('endpoint'); // New parameter for different endpoints
  const satelliteId = searchParams.get('satelliteId'); // For position/visual passes
  
  // Use N2YO_API_KEY without NEXT_PUBLIC_ prefix for server-side
  const API_KEY = process.env.N2YO_API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { error: "N2YO API key not configured" }, 
      { status: 500 }
    );
  }

  let apiUrl = '';

  try {
    if (endpoint === 'positions' && satelliteId) {
      // For satellite positions
      const observerAltitude = 0;
      const seconds = 2;
      apiUrl = `https://api.n2yo.com/rest/v1/satellite/positions/${satelliteId}/${lat}/${lon}/${observerAltitude}/${seconds}/?apiKey=${API_KEY}`;
    } else if (endpoint === 'visualpasses' && satelliteId) {
      // For visual passes
      const observerAltitude = 0;
      const days = 2;
      const minVisibility = 300;
      apiUrl = `https://api.n2yo.com/rest/v1/satellite/visualpasses/${satelliteId}/${lat}/${lon}/${observerAltitude}/${days}/${minVisibility}/?apiKey=${API_KEY}`;
    } else if (!endpoint) {
      // Default to radio passes (for ISS component)
      if (!lat || !lon) {
        return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
      }
      const observerAltitude = 0;
      const satelliteId = 25544; // ISS NORAD ID
      const passesCount = 5;
      apiUrl = `https://api.n2yo.com/rest/v1/satellite/radiopasses/${satelliteId}/${lat}/${lon}/${observerAltitude}/1/${passesCount}?apiKey=${API_KEY}`;
    } else {
      return NextResponse.json({ error: "Invalid endpoint or missing parameters" }, { status: 400 });
    }
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`N2YO API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err) {
    console.error("N2YO API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data from N2YO API" }, 
      { status: 500 }
    );
  }
}