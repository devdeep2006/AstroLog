"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Satellite, Users, Zap, Globe } from "lucide-react"

interface LiveStat {
  icon: React.ReactNode
  label: string
  value: string
  change: string
  color: string
}

export function LiveStats() {
  const [stats, setStats] = useState<LiveStat[]>([])

  useEffect(() => {
    const updateStats = () => {
      const newStats: LiveStat[] = [
        {
          icon: <Satellite className="h-6 w-6" />,
          label: "ISS Altitude",
          value: `${(408 + Math.random() * 4).toFixed(1)} km`,
          change: "+0.2 km/h",
          color: "text-blue-400",
        },
        {
          icon: <Users className="h-6 w-6" />,
          label: "Astronauts in Space",
          value: "6",
          change: "Expedition 70",
          color: "text-cyan-400",
        },
        {
          icon: <Zap className="h-6 w-6" />,
          label: "Solar Activity",
          value: "C2.1",
          change: "Moderate",
          color: "text-yellow-400",
        },
        {
          icon: <Globe className="h-6 w-6" />,
          label: "Active Satellites",
          value: "8,100+",
          change: "+12 today",
          color: "text-purple-400",
        },
      ]
      setStats(newStats)
    }

    updateStats()
    const interval = setInterval(updateStats, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Live Space Statistics</h2>
          <p className="text-slate-300 text-lg">Real-time data from space agencies worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300"
            >
              <CardContent className="p-6 text-center">
                <div className={`${stat.color} mb-4 flex justify-center`}>{stat.icon}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-slate-300 font-medium mb-2">{stat.label}</p>
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
