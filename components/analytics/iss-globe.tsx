"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Satellite, Play, Pause, RotateCcw } from "lucide-react"
import ReactPlayer from "react-player"

interface ISSPosition {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
}

export function ISSVideoTracker() {
  const [issPosition, setIssPosition] = useState<ISSPosition>({
    latitude: 25.7617,
    longitude: -80.1918,
    altitude: 408,
    velocity: 7.66,
    timestamp: Date.now(),
  })
  const [isPlaying, setIsPlaying] = useState(true)
  const [loading, setLoading] = useState(true)

  const fetchISSPosition = async () => {
    try {
      // Simulate ISS movement
      setIssPosition((prev) => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 2,
        longitude: prev.longitude + 0.5,
        altitude: 408 + (Math.random() - 0.5) * 10,
        velocity: 7.66 + (Math.random() - 0.5) * 0.2,
        timestamp: Date.now(),
      }))
    } catch (error) {
      console.error("Error fetching ISS position:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchISSPosition()
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(fetchISSPosition, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  const resetView = () => {
    setIssPosition({
      latitude: 25.7617,
      longitude: -80.1918,
      altitude: 408,
      velocity: 7.66,
      timestamp: Date.now(),
    })
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            ISS Livestream
            <Badge variant="secondary" className="bg-green-600 text-white">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={resetView}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-120 w-full bg-slate-900/30 rounded-lg overflow-hidden relative">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=xRPjKQtRXR8&ab_channel=afarTV"
            playing={isPlaying}
            controls
            muted
            width="100%"
            height="100%"
            className="react-player rounded-lg"
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-white text-lg font-semibold">Paused</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
