"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, MapPin, Clock } from "lucide-react"
import ISSTrackerLeaflet from '@/components/ISSTrackerLeaflet'
interface ISSPosition {
  latitude: string
  longitude: string
  timestamp: number
  altitude: string
  velocity:string
}

export function ISSTracker() {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

const fetchISSPosition = async () => {
  try {
    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const data = await response.json();

    setIssPosition({
      latitude: data.latitude,   // ✅ Not data.iss_position.latitude
      longitude: data.longitude,
      timestamp: data.timestamp,
      altitude: data.altitude ? String(data.altitude) : "0",
      velocity: data.velocity ? String(data.velocity) : "0",
    });

    setLastUpdate(new Date());
  } catch (error) {
    console.error("Error fetching ISS position:", error);
    setIssPosition({
      latitude: "25.7617",
      longitude: "-80.1918",
      timestamp: Date.now() / 1000,
      altitude: "408",
      velocity: "27600",
    });

    setLastUpdate(new Date());
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchISSPosition()
    const interval = setInterval(fetchISSPosition, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const getLocationName = (lat: string, lon: string) => {
    const latitude = Number.parseFloat(lat)
    const longitude = Number.parseFloat(lon)

    if (latitude > 0) {
      return `${Math.abs(latitude).toFixed(2)}°N`
    } else {
      return `${Math.abs(latitude).toFixed(2)}°S`
    }
  }

  const getLongitudeName = (lon: string) => {
    const longitude = Number.parseFloat(lon)

    if (longitude > 0) {
      return `${Math.abs(longitude).toFixed(2)}°E`
    } else {
      return `${Math.abs(longitude).toFixed(2)}°W`
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Satellite className="h-5 w-5 text-blue-400" />
          ISS Live Tracker
          <Badge variant="secondary" className="bg-green-600 text-white ml-auto">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-slate-400 mt-2">Tracking ISS...</p>
          </div>
        ) : issPosition ? (
          <>
            <div className="bg-slate-900/50 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-mono text-white mb-2">
                    {getLocationName(issPosition.latitude, issPosition.longitude)}, {getLongitudeName(issPosition.longitude)}
                  </p>
                  <p className="text-slate-400 text-sm">Current ISS Position</p>
                </div>
              </div>
            </div>
            {issPosition && (
              <div className="rounded-lg overflow-hidden shadow-lg border border-slate-700 h-[400px]">
      <ISSTrackerLeaflet position={{
            latitude: Number(issPosition.latitude),
            longitude: Number(issPosition.longitude)
          }} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Latitude</span>
                </div>
                <p className="text-lg font-mono text-white">{Number.parseFloat(issPosition.latitude).toFixed(4)}°</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-400">Longitude</span>
                </div>
                <p className="text-lg font-mono text-white">{Number.parseFloat(issPosition.longitude).toFixed(4)}°</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Altitude</span>
                </div>
                <p className="text-lg font-mono text-white">{Number.parseFloat(issPosition.altitude).toFixed(4)} Km</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-400">Velocity</span>
                </div>
                <p className="text-lg font-mono text-white">{Number.parseFloat(issPosition.velocity).toFixed(4)} Km/hr</p>
              </div>
            </div>

            {lastUpdate && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock className="h-4 w-4" />
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-slate-400">Unable to fetch ISS position</div>
        )}
      </CardContent>
    </Card>
  )
}
