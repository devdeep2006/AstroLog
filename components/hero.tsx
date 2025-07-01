"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Satellite, Users, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Hero() {
  const [issPosition, setIssPosition] = useState({ lat: 0, lon: 0 })
  const [astronautCount, setAstronautCount] = useState(6)

  useEffect(() => {
    // Simulate live ISS position updates
    const updatePosition = () => {
      setIssPosition({
        lat: (Math.random() - 0.5) * 180,
        lon: (Math.random() - 0.5) * 360,
      })
    }

    updatePosition()
    const interval = setInterval(updatePosition, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Live status badge */}
          <div className="flex justify-center mb-8">
            <Badge className="bg-green-600 text-white px-4 py-2 text-sm">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2"></div>
              ISS Live at {issPosition.lat.toFixed(1)}°, {issPosition.lon.toFixed(1)}°
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight font-thin">
            Track Space in
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Real-Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            Monitor the International Space Station, track satellites, get space weather updates, and stay informed
            about upcoming space missions—all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 px-8 py-4 text-lg"
            >
              View Live Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Satellite className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Live Tracking</h3>
              <p className="text-slate-400 text-sm">Real-time ISS & satellite positions</p>
            </div>

            <div className="text-center">
              <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">{astronautCount} Astronauts</h3>
              <p className="text-slate-400 text-sm">Currently in space</p>
            </div>

            <div className="text-center">
              <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Mission Calendar</h3>
              <p className="text-slate-400 text-sm">Upcoming launches & events</p>
            </div>

            <div className="text-center">
              <div className="bg-slate-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Space Weather</h3>
              <p className="text-slate-400 text-sm">Solar activity monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
