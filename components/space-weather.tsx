"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sun, Zap, Shield, AlertTriangle, TrendingUp } from "lucide-react"

interface SpaceWeatherData {
  solarActivity: {
    flareClass: string
    flareLevel: number
    status: "low" | "moderate" | "high" | "extreme"
  }
  geomagneticStorm: {
    kIndex: number
    level: "quiet" | "unsettled" | "storm" | "severe"
    forecast: string
  }
  solarWind: {
    speed: number
    density: number
    temperature: number
  }
  radiation: {
    level: number
    status: "normal" | "elevated" | "high"
  }
  magneticField: {
    level: number
    status: "normal" | "elevated" | "high"
  }
  lastUpdate: string
}

export function SpaceWeather() {
  const [weatherData, setWeatherData] = useState<SpaceWeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSpaceWeather = async () => {
    try {
      const [
        flaresRes,
        kpRes,
        windRes,
        radiationRes,
        magnetic
      ] = await Promise.all([
        fetch("https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json"),
        fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json"),
        fetch("https://services.swpc.noaa.gov/products/solar-wind/plasma-5-minute.json"),
        fetch("https://services.swpc.noaa.gov/json/goes/primary/integral-protons-7-day.json"),
        fetch("https://services.swpc.noaa.gov/products/solar-wind/mag-5-minute.json")
      ])

      const flares = await flaresRes.json()
      const kp = await kpRes.json()
      const wind = await windRes.json()
      const radiation = await radiationRes.json()
      const mag=await magnetic.json()

      const latestFlare = flares[0] || {}
      const latestKp = kp.at(-1) || {}
      const latestWind = wind.at(-1) || {}
      const latestRadiation = radiation.at(-1) || {}
      const latestmag = mag.at(-1) || {}
      const spacemag={
        level:parseFloat(latestmag[6]),
      }
      const solarWind = {
        speed: parseFloat(latestWind[2]),
        density: parseFloat(latestWind[1]),
        temperature: parseFloat(latestWind[3]),
      }
      const imfStatus = (x:number): SpaceWeatherData["magneticField"]["status"] => {
        if (x < 10) return "normal"
        if (x < 100) return "elevated"
        return "high"
      }
      const getFlareStatus = (classType: string): SpaceWeatherData["solarActivity"]["status"] => {
        if (classType.startsWith("X")) return "extreme"
        if (classType.startsWith("M")) return "high"
        if (classType.startsWith("C")) return "moderate"
        return "low"
      }

      const getKpLevel = (k: number): SpaceWeatherData["geomagneticStorm"]["level"] => {
        if (k < 2) return "quiet"
        if (k < 4) return "unsettled"
        if (k < 6) return "storm"
        return "severe"
      }

      const getRadiationStatus = (flux: number): SpaceWeatherData["radiation"]["status"] => {
        if (flux < 10) return "normal"
        if (flux < 100) return "elevated"
        return "high"
      }

      const data: SpaceWeatherData = {
        solarActivity: {
          flareClass: latestFlare.class_type || "None",
          flareLevel: parseFloat(latestFlare.peak || "0"),
          status: getFlareStatus(latestFlare.class_type || ""),
        },
        geomagneticStorm: {
          kIndex: latestKp.kp_index || 0,
          level: getKpLevel(latestKp.kp_index || 0),
          forecast: "Based on real-time data", // NOAA doesn’t expose text forecasts anymore
        },
        solarWind: {
          speed: parseFloat(latestWind[2]),
          density: parseFloat(latestWind[1]),
          temperature: parseFloat(latestWind[3]),
        },
        radiation: {
          level: latestRadiation.flux || 0,
          status: getRadiationStatus(latestRadiation.flux || 0),
        },
        magneticField:{
          level:spacemag.level||0,
          status:imfStatus(spacemag.level||0),
        },
        lastUpdate: new Date().toISOString()
      }

      setWeatherData(data)
    } catch (error) {
      console.error("Error fetching space weather data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
      case "quiet":
      case "normal":
        return "text-green-400 border-green-500"
      case "moderate":
      case "unsettled":
      case "elevated":
        return "text-yellow-400 border-yellow-500"
      case "high":
      case "storm":
        return "text-orange-400 border-orange-500"
      case "extreme":
      case "severe":
        return "text-red-400 border-red-500"
      default:
        return "text-slate-400 border-slate-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "low":
      case "quiet":
      case "normal":
        return <Shield className="h-4 w-4" />
      case "moderate":
      case "unsettled":
      case "elevated":
        return <TrendingUp className="h-4 w-4" />
      case "high":
      case "storm":
      case "extreme":
      case "severe":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  useEffect(() => {
    fetchSpaceWeather()
    const interval = setInterval(fetchSpaceWeather, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sun className="h-5 w-5 text-yellow-400" />
          Space Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading space weather...</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-4">
            {/* Solar Activity */}
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-slate-300">Solar Flares</span>
                </div>
                <Badge variant="outline" className={getStatusColor(weatherData.solarActivity.status)}>
                  {weatherData.solarActivity.flareClass}
                </Badge>
              </div>
              <Progress value={weatherData.solarActivity.flareLevel} className="h-2 bg-slate-700" />
              <p className="text-xs text-slate-400 mt-1 capitalize">{weatherData.solarActivity.status} activity</p>
            </div>

            {/* Geomagnetic Storm */}
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(weatherData.geomagneticStorm.level)}
                  <span className="text-sm text-slate-300">Geomagnetic</span>
                </div>
                <Badge variant="outline" className={getStatusColor(weatherData.geomagneticStorm.level)}>
                  K{weatherData.geomagneticStorm.kIndex}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 capitalize">{weatherData.geomagneticStorm.level} conditions</p>
              <p className="text-xs text-slate-500 mt-1">{weatherData.geomagneticStorm.forecast}</p>
            </div>

            {/* Solar Wind */}
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Solar Wind</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Speed</p>
                  <p className="text-white font-mono">{weatherData.solarWind.speed} km/s</p>
                </div>
                <div>
                  <p className="text-slate-400">Density</p>
                  <p className="text-white font-mono">{weatherData.solarWind.density} p/cm³</p>
                </div>
              </div>
            </div>

            {/* Radiation */}
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Radiation</span>
                </div>
                <Badge variant="outline" className={getStatusColor(weatherData.radiation.status)}>
                  {weatherData.radiation.status}
                </Badge>
              </div>
              <Progress value={weatherData.radiation.level} className="h-2 bg-slate-700" />
            </div>
            {/*IMF RADIATION */}
            <div className="bg-slate-900/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Interplanetary Magnetic Field</span>
                </div>
                <Badge variant="outline" className={getStatusColor(weatherData.magneticField.status)}>
                  {weatherData.magneticField.status}
                </Badge>
              </div>
              <Progress value={weatherData.magneticField.level} className="h-2 bg-slate-700" />
            </div>

            <p className="text-xs text-slate-500 text-center">
              Last updated: {new Date(weatherData.lastUpdate).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">Unable to fetch space weather data</div>
        )}
      </CardContent>
    </Card>
  )
}
