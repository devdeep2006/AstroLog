"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Satellite, Eye, Globe, Orbit, MapPin, Clock, AlertCircle } from "lucide-react"

interface SatellitePosition {
  satlatitude: number
  satlongitude: number
  sataltitude: number
  azimuth: number
  elevation: number
  timestamp: number
}

interface VisualPass {
  startUTC: number
  maxUTC: number
  endUTC: number
  maxEl: number
  mag: number
  duration: number
}

interface SatelliteData {
  id: number
  name: string
  type: "communication" | "navigation" | "weather" | "scientific" | "military"
  position?: SatellitePosition|null
  nextPass?: VisualPass|null
  isVisible: boolean
}

export function SatelliteTracker() {
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [apiKey, setApiKey] = useState<string>(process.env.NEXT_PUBLIC_N2YO_API_KEY || "")
  const [userLocation, setUserLocation] = useState({ lat: 41.702, lng: -76.014 }) // Default location
  const [showApiKeyInput, setShowApiKeyInput] = useState(!process.env.NEXT_PUBLIC_N2YO_API_KEY)

  // Popular satellites with their NORAD IDs and types
  const popularSatellites = [
    { id: 25544, name: "ISS (ZARYA)", type: "scientific" as const },
    { id: 20580, name: "HUBBLE SPACE TELESCOPE", type: "scientific" as const },
    { id: 43013, name: "STARLINK-1007", type: "communication" as const },
    { id: 28654, name: "GPS BIIR-2", type: "navigation" as const },
    { id: 33591, name: "NOAA-19", type: "weather" as const },
    { id: 37849, name: "TIANGONG-1", type: "scientific" as const },
    { id: 40614, name: "DEORBITSAIL", type: "scientific" as const },
    { id: 44713, name: "STARLINK-1130", type: "communication" as const },
  ]

  const fetchSatellitePosition = async (satelliteId: number): Promise<SatellitePosition | null> => {
    try {
      // Use the proxy API route instead of direct call
      const response = await fetch(
        `/api/n2yo?endpoint=positions&satelliteId=${satelliteId}&lat=${userLocation.lat}&lon=${userLocation.lng}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.positions && data.positions.length > 0 ? data.positions[0] : null
    } catch (error) {
      console.error(`Error fetching position for satellite ${satelliteId}:`, error)
      return null
    }
  }

  const fetchVisualPasses = async (satelliteId: number): Promise<VisualPass | null> => {
    try {
      // Use the proxy API route with correct parameters
      const response = await fetch(
        `/api/n2yo?endpoint=visualpasses&satelliteId=${satelliteId}&lat=${userLocation.lat}&lon=${userLocation.lng}`
      )
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      return data.passes?.[0] ?? null
    } catch (error) {
      console.error(`Error fetching visual passes for satellite ${satelliteId}:`, error)
      return null
    }
  }

  const fetchSatellites = async () => {
    // Remove the API key check since we're using the server-side proxy
    setLoading(true)
    setError("")

    try {
      const satellitePromises = popularSatellites.map(async (sat) => {
        try {
          const position = await fetchSatellitePosition(sat.id)
          const visualPass = await fetchVisualPasses(sat.id)

          return {
            ...sat,
            position,
            nextPass: visualPass,
            isVisible: position ? position.elevation > 0 : false,
          }
        } catch (satErr) {
          console.warn(`Failed to fetch data for satellite ${sat.name}`, satErr)
          return {
            ...sat,
            position: null,
            nextPass: null,
            isVisible: false,
          }
        }
      })

      const results = await Promise.all(satellitePromises)
      setSatellites(results)
    } catch (error) {
      console.error("Global error fetching satellite data:", error)
      setError("Failed to fetch satellite data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "communication":
        return "bg-blue-600 text-white"
      case "navigation":
        return "bg-green-600 text-white"
      case "weather":
        return "bg-orange-600 text-white"
      case "scientific":
        return "bg-purple-600 text-white"
      case "military":
        return "bg-red-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "communication":
        return <Globe className="h-3 w-3" />
      case "navigation":
        return <Satellite className="h-3 w-3" />
      case "weather":
        return <Eye className="h-3 w-3" />
      case "scientific":
        return <Orbit className="h-3 w-3" />
      default:
        return <Satellite className="h-3 w-3" />
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const filteredSatellites = selectedType === "all" ? satellites : satellites.filter((sat) => sat.type === selectedType)
  const satelliteTypes = ["all", "communication", "navigation", "weather", "scientific"]

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
          // Keep default location
        }
      )
    }

    // Auto-fetch satellites if using server-side proxy (no API key needed on client)
    if (!showApiKeyInput) {
      setTimeout(() => {
        fetchSatellites()
      }, 1000) // Small delay to allow location to be set
    }
  }, [showApiKeyInput])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Satellite className="h-5 w-5 text-indigo-400" />
            Real-Time Satellite Tracker
          </CardTitle>
          <p className="text-sm text-slate-400">
            Powered by N2YO API • Location: {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
          </p>
        </CardHeader>
        <CardContent>
          {showApiKeyInput && (
            <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">N2YO API Key Required</h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Add your N2YO API key to environment variables (.env.local):
                  </p>
                  <div className="bg-slate-800/50 rounded p-2 mb-3">
                    <code className="text-xs text-green-400">
                      N2YO_API_KEY=your_api_key_here
                    </code>
                    <p className="text-xs text-slate-400 mt-1">Add this to your .env.local file and restart the server</p>
                  </div>
                  <ol className="text-xs text-slate-400 mb-3 list-decimal list-inside space-y-1">
                    <li>Visit <a href="https://www.n2yo.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">N2YO.com</a> and create an account</li>
                    <li>Go to your profile page and generate an API key</li>
                    <li>Add the key to your environment variables</li>
                    <li>Restart your development server</li>
                  </ol>
                  <Button
                    onClick={() => {
                      setShowApiKeyInput(false)
                      fetchSatellites()
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!showApiKeyInput && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  {satelliteTypes.map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={selectedType === type ? "default" : "outline"}
                      onClick={() => setSelectedType(type)}
                      className={`text-xs ${
                        selectedType === type
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={fetchSatellites}
                  disabled={loading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Updating..." : "Refresh"}
                </Button>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto"></div>
                  <p className="text-slate-400 mt-3">Fetching real satellite data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredSatellites.map((satellite) => (
                      <div key={satellite.id} className="bg-slate-900/30 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium text-sm truncate">{satellite.name}</h4>
                              {satellite.isVisible && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="secondary" className={getTypeColor(satellite.type)}>
                                {getTypeIcon(satellite.type)}
                                <span className="ml-1 text-xs">{satellite.type}</span>
                              </Badge>
                              <span className="text-xs text-slate-400">NORAD: {satellite.id}</span>
                            </div>
                          </div>
                        </div>

                        {satellite.position && (
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                <span className="text-xs text-slate-400">Position</span>
                              </div>
                              <div className="text-xs">
                                <p className="text-white font-mono">
                                  {satellite.position.satlatitude.toFixed(3)}°, {satellite.position.satlongitude.toFixed(3)}°
                                </p>
                                <p className="text-slate-400">Alt: {satellite.position.sataltitude.toFixed(1)} km</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3 text-slate-400" />
                                <span className="text-xs text-slate-400">Observer</span>
                              </div>
                              <div className="text-xs">
                                <p className="text-white font-mono">
                                  Az: {satellite.position.azimuth.toFixed(1)}°
                                </p>
                                <p className="text-white font-mono">
                                  El: {satellite.position.elevation.toFixed(1)}°
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {satellite.nextPass && (
                          <div className="bg-slate-800/50 rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-3 w-3 text-green-400" />
                              <span className="text-xs text-slate-300">Next Visible Pass</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <p className="text-slate-400">Start Time</p>
                                <p className="text-white font-mono text-xs">
                                  {formatTime(satellite.nextPass.startUTC)}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-400">Max Elevation</p>
                                <p className="text-white font-mono">{satellite.nextPass.maxEl.toFixed(1)}°</p>
                              </div>
                              <div>
                                <p className="text-slate-400">Duration</p>
                                <p className="text-white font-mono">{Math.round(satellite.nextPass.duration)} sec</p>
                              </div>
                              <div>
                                <p className="text-slate-400">Brightness</p>
                                <p className="text-white font-mono">{satellite.nextPass.mag.toFixed(1)} mag</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {!satellite.position && !satellite.nextPass && (
                          <p className="text-xs text-slate-500 italic">Data unavailable</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Showing {filteredSatellites.length} satellites</span>
                    <span>Real-time data from N2YO.com</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}