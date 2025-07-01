"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Globe, Eye, Filter } from "lucide-react"

interface PassData {
  country: string
  region: string
  passes: number
  visibility: "excellent" | "good" | "fair" | "poor"
  nextPass: string
  coordinates: { lat: number; lng: number }
  flag: string
}

export function ISSPassMap() {
  const [passData, setPassData] = useState<PassData[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generatePassData = () => {
      const mockData: PassData[] = [
        {
          country: "United States",
          region: "North America",
          passes: 156,
          visibility: "excellent",
          nextPass: "Tonight 8:42 PM",
          coordinates: { lat: 39.8283, lng: -98.5795 },
          flag: "🇺🇸",
        },
        {
          country: "Russia",
          region: "Asia",
          passes: 142,
          visibility: "good",
          nextPass: "Tonight 9:15 PM",
          coordinates: { lat: 61.524, lng: 105.3188 },
          flag: "🇷🇺",
        },
        {
          country: "China",
          region: "Asia",
          passes: 138,
          visibility: "good",
          nextPass: "Tonight 10:22 PM",
          coordinates: { lat: 35.8617, lng: 104.1954 },
          flag: "🇨🇳",
        },
        {
          country: "Canada",
          region: "North America",
          passes: 134,
          visibility: "excellent",
          nextPass: "Tonight 8:55 PM",
          coordinates: { lat: 56.1304, lng: -106.3468 },
          flag: "🇨🇦",
        },
        {
          country: "Brazil",
          region: "South America",
          passes: 128,
          visibility: "good",
          nextPass: "Tonight 11:08 PM",
          coordinates: { lat: -14.235, lng: -51.9253 },
          flag: "🇧🇷",
        },
        {
          country: "Australia",
          region: "Oceania",
          passes: 118,
          visibility: "excellent",
          nextPass: "Tomorrow 6:33 AM",
          coordinates: { lat: -25.2744, lng: 133.7751 },
          flag: "🇦🇺",
        },
        {
          country: "India",
          region: "Asia",
          passes: 115,
          visibility: "fair",
          nextPass: "Tonight 9:47 PM",
          coordinates: { lat: 20.5937, lng: 78.9629 },
          flag: "🇮🇳",
        },
        {
          country: "Germany",
          region: "Europe",
          passes: 89,
          visibility: "good",
          nextPass: "Tonight 8:12 PM",
          coordinates: { lat: 51.1657, lng: 10.4515 },
          flag: "🇩🇪",
        },
        {
          country: "France",
          region: "Europe",
          passes: 85,
          visibility: "good",
          nextPass: "Tonight 8:28 PM",
          coordinates: { lat: 46.2276, lng: 2.2137 },
          flag: "🇫🇷",
        },
        {
          country: "United Kingdom",
          region: "Europe",
          passes: 82,
          visibility: "fair",
          nextPass: "Tonight 8:05 PM",
          coordinates: { lat: 55.3781, lng: -3.436 },
          flag: "🇬🇧",
        },
      ]

      setPassData(mockData)
      setLoading(false)
    }

    generatePassData()
  }, [])

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "excellent":
        return "bg-green-600 text-white"
      case "good":
        return "bg-blue-600 text-white"
      case "fair":
        return "bg-yellow-600 text-white"
      case "poor":
        return "bg-red-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const getHeatmapIntensity = (passes: number) => {
    const maxPasses = Math.max(...passData.map((d) => d.passes))
    return (passes / maxPasses) * 100
  }

  const filteredData = selectedRegion === "all" ? passData : passData.filter((d) => d.region === selectedRegion)
  const regions = ["all", ...Array.from(new Set(passData.map((d) => d.region)))]

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading ISS pass data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5 text-green-400" />
          ISS Pass Visibility Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="heatmap" className="data-[state=active]:bg-slate-600">
              Heatmap View
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-slate-600">
              Country List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-6 mt-6">
            {/* Region Filter */}
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-slate-400" />
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Button
                    key={region}
                    size="sm"
                    variant={selectedRegion === region ? "default" : "outline"}
                    onClick={() => setSelectedRegion(region)}
                    className={`text-xs ${
                      selectedRegion === region
                        ? "bg-green-600 text-white"
                        : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {region === "all" ? "All Regions" : region}
                  </Button>
                ))}
              </div>
            </div>

            {/* Simplified World Map Visualization */}
            <div className="bg-slate-900/30 rounded-lg p-6 h-80 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>

              {/* World Map Grid */}
              <div className="relative h-full">
                <div className="text-center text-white mb-4">
                  <h3 className="font-medium">ISS Pass Frequency Heatmap</h3>
                  <p className="text-slate-400 text-sm">Darker regions indicate more frequent ISS passes</p>
                </div>

                {/* Heatmap Grid */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 h-48">
                  {filteredData.map((country, index) => (
                    <div
                      key={country.country}
                      className="relative group cursor-pointer"
                      style={{
                        backgroundColor: `rgba(34, 197, 94, ${getHeatmapIntensity(country.passes) / 100})`,
                      }}
                    >
                      <div className="h-full bg-slate-800/50 rounded border border-slate-600 p-2 hover:bg-slate-700/50 transition-all">
                        <div className="text-center">
                          <span className="text-lg">{country.flag}</span>
                          <p className="text-white text-xs font-medium mt-1 truncate">{country.country}</p>
                          <p className="text-slate-400 text-xs">{country.passes}</p>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm whitespace-nowrap">
                            <p className="text-white font-medium">{country.country}</p>
                            <p className="text-slate-400">{country.passes} passes this month</p>
                            <p className="text-slate-400">Next: {country.nextPass}</p>
                            <Badge variant="secondary" className={getVisibilityColor(country.visibility)}>
                              {country.visibility}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <span className="text-slate-400 text-sm">Pass Frequency:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-900/30 rounded"></div>
                    <span className="text-slate-400 text-xs">Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600/60 rounded"></div>
                    <span className="text-slate-400 text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span className="text-slate-400 text-xs">High</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4 mt-6">
            <div className="space-y-3">
              {filteredData.map((country, index) => (
                <div
                  key={country.country}
                  className="bg-slate-900/30 rounded-lg p-4 hover:bg-slate-900/50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-slate-600 text-slate-300 w-8 text-center">
                        #{index + 1}
                      </Badge>
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <h4 className="text-white font-medium group-hover:text-green-400 transition-colors">
                          {country.country}
                        </h4>
                        <p className="text-slate-400 text-sm">{country.region}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{country.passes} passes</p>
                      <Badge variant="secondary" className={getVisibilityColor(country.visibility)}>
                        {country.visibility}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-slate-400">Next Visible Pass</p>
                        <p className="text-white font-medium">{country.nextPass}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-slate-400">Coordinates</p>
                        <p className="text-white font-medium font-mono">
                          {country.coordinates.lat.toFixed(2)}°, {country.coordinates.lng.toFixed(2)}°
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
