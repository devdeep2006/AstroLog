
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Satellite, Globe, Wifi, Eye } from "lucide-react"

interface SatelliteData {
  year: number
  month: string
  communication: number
  navigation: number
  earthObservation: number
  scientific: number
  military: number
  total: number
}

interface ConstellationData {
  name: string
  operator: string
  satellites: number
  purpose: string
  status: "Active" | "Deploying" | "Planned"
  color: string
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16"]

export function SatelliteDeploymentTrends() {
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([])
  const [constellations, setConstellations] = useState<ConstellationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateSatelliteData = () => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const data: SatelliteData[] = []
      const constellationData: ConstellationData[] = [
        {
          name: "Starlink",
          operator: "SpaceX",
          satellites: 7760,
          purpose: "Internet",
          status: "Active",
          color: "#3B82F6",
        },
        {
          name: "OneWeb",
          operator: "OneWeb",
          satellites: 654,
          purpose: "Internet",
          status: "Active",
          color: "#10B981",
        },
        {
          name: "GPS",
          operator: "US Space Force",
          satellites: 32,
          purpose: "Navigation",
          status: "Active",
          color: "#F59E0B",
        },
        {
          name: "Galileo",
          operator: "ESA",
          satellites: 28,
          purpose: "Navigation",
          status: "Active",
          color: "#8B5CF6",
        },
        {
          name: "GLONASS",
          operator: "Roscosmos",
          satellites: 24,
          purpose: "Navigation",
          status: "Active",
          color: "#EF4444",
        },
        {
          name: "BeiDou",
          operator: "CNSA",
          satellites: 35,
          purpose: "Navigation",
          status: "Active",
          color: "#06B6D4",
        },
        {
          name: "Planet Labs",
          operator: "Planet Labs",
          satellites: 200,
          purpose: "Earth Observation",
          status: "Active",
          color: "#84CC16",
        },
        {
          name: "Amazon Kuiper",
          operator: "Amazon",
          satellites: 0,
          purpose: "Internet",
          status: "Planned",
          color: "#F97316",
        },
      ]

      for (let year = 2023; year <= 2025; year++) {
        months.forEach((month, index) => {
          const baseDeployments = year === 2025 && index >= 5 ? 30 : 20
          const communication = Math.floor(Math.random() * 15 + baseDeployments)
          const navigation = Math.floor(Math.random() * 2 + 1)
          const earthObservation = Math.floor(Math.random() * 5 + 2)
          const scientific = Math.floor(Math.random() * 3 + 1)
          const military = Math.floor(Math.random() * 2 + 1)

          data.push({
            year,
            month,
            communication,
            navigation,
            earthObservation,
            scientific,
            military,
            total: communication + navigation + earthObservation + scientific + military,
          })
        })
      }

      setSatelliteData(data)
      setConstellations(constellationData.sort((a, b) => b.satellites - a.satellites))
      setLoading(false)
    }

    generateSatelliteData()
  }, [])

  const totalDeployed = satelliteData.reduce((sum, d) => sum + d.total, 0)
  const avgPerMonth = totalDeployed / satelliteData.length

  const categoryTotals = satelliteData.reduce(
    (acc, curr) => ({
      communication: acc.communication + curr.communication,
      navigation: acc.navigation + curr.navigation,
      earthObservation: acc.earthObservation + curr.earthObservation,
      scientific: acc.scientific + curr.scientific,
      military: acc.military + curr.military,
    }),
    { communication: 0, navigation: 0, earthObservation: 0, scientific: 0, military: 0 },
  )

  const pieData = [
    { name: "Communication", value: categoryTotals.communication, color: "#3B82F6" },
    { name: "Earth Observation", value: categoryTotals.earthObservation, color: "#10B981" },
    { name: "Scientific", value: categoryTotals.scientific, color: "#F59E0B" },
    { name: "Military", value: categoryTotals.military, color: "#EF4444" },
    { name: "Navigation", value: categoryTotals.navigation, color: "#8B5CF6" },
  ]

  const chartConfig = {
    communication: { label: "Communication", color: "hsl(var(--chart-1))" },
    navigation: { label: "Navigation", color: "hsl(var(--chart-2))" },
    earthObservation: { label: "Earth Observation", color: "hsl(var(--chart-3))" },
    scientific: { label: "Scientific", color: "hsl(var(--chart-4))" },
    military: { label: "Military", color: "hsl(var(--chart-5))" },
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Analyzing satellite deployments...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm w-[800px] h-[700px] overflow-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Satellite className="h-5 w-5 text-cyan-400" />
          Satellite Deployment Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-slate-600">
              Categories
            </TabsTrigger>
            <TabsTrigger value="constellations" className="data-[state=active]:bg-slate-600">
              Constellations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Satellite className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-slate-400">Total Deployed</span>
                </div>
                <p className="text-2xl font-bold text-white">{totalDeployed.toLocaleString()}</p>
                <p className="text-xs text-slate-500">2023-2025</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Monthly Average</span>
                </div>
                <p className="text-2xl font-bold text-white">{avgPerMonth.toFixed(0)}</p>
                <p className="text-xs text-slate-500">Satellites</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-400">Communication</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {((categoryTotals.communication / totalDeployed) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-slate-500">Largest category</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-400">Active Constellations</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {constellations.filter((c) => c.status === "Active").length}
                </p>
                <p className="text-xs text-slate-500">Operational</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Monthly Deployment Trends</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={satelliteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="var(--color-communication)"
                      fill="var(--color-communication)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4">Deployment by Category</h3>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip formatter={(value, name) => [`${value} satellites`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full lg:w-1/2 space-y-3">
                  {pieData.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{category.value.toLocaleString()}</p>
                        <p className="text-slate-400 text-xs">{((category.value / totalDeployed) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Category Trends Over Time</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={satelliteData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="communication"
                      stackId="1"
                      stroke="var(--color-communication)"
                      fill="var(--color-communication)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="earthObservation"
                      stackId="1"
                      stroke="var(--color-earthObservation)"
                      fill="var(--color-earthObservation)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="scientific"
                      stackId="1"
                      stroke="var(--color-scientific)"
                      fill="var(--color-scientific)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="military"
                      stackId="1"
                      stroke="var(--color-military)"
                      fill="var(--color-military)"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="navigation"
                      stackId="1"
                      stroke="var(--color-navigation)"
                      fill="var(--color-navigation)"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="constellations" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4">Major Satellite Constellations</h3>
              <div className="space-y-3">
                {constellations.map((constellation, index) => (
                  <div key={constellation.name} className="bg-slate-900/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: constellation.color }} />
                        <div>
                          <h4 className="text-white font-medium">{constellation.name}</h4>
                          <p className="text-slate-400 text-sm">{constellation.operator}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            constellation.status === "Active"
                              ? "border-green-500 text-green-400"
                              : constellation.status === "Deploying"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-blue-500 text-blue-400"
                          }`}
                        >
                          {constellation.status}
                        </Badge>
                        <span className="text-white font-medium">{constellation.satellites.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Purpose</p>
                        <p className="text-white font-medium">{constellation.purpose}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Market Share</p>
                        <p className="text-white font-medium">
                          {constellation.satellites > 0
                            ? (
                                (constellation.satellites / constellations.reduce((sum, c) => sum + c.satellites, 0)) *
                                100
                              ).toFixed(1)
                            : "0"}
                          %
                        </p>
                      </div>
                    </div>

                    {constellation.satellites > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              backgroundColor: constellation.color,
                              width: `${Math.min((constellation.satellites / 8000) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Constellation Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Largest Constellation</p>
                  <p className="text-blue-400 font-medium">{constellations[0]?.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Active Satellites</p>
                  <p className="text-green-400 font-medium">
                    {constellations
                      .filter((c) => c.status === "Active")
                      .reduce((sum, c) => sum + c.satellites, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Planned Deployments</p>
                  <p className="text-purple-400 font-medium">
                    {constellations.filter((c) => c.status === "Planned").length} projects
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}