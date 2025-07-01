"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, Eye, Heart, Share2, Clock, TrendingUp } from "lucide-react"

interface EngagementData {
  date: string
  activeUsers: number
  pageViews: number
  favorites: number
  shares: number
  avgSessionTime: number
  bounceRate: number
}

interface FeatureUsage {
  feature: string
  usage: number
  growth: number
  category: string
}

export function UserEngagementMetrics() {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([])
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateEngagementData = () => {
      const data: EngagementData[] = []
      const features: FeatureUsage[] = [
        { feature: "ISS Tracker", usage: 89, growth: 12, category: "Core" },
        { feature: "Space News", usage: 76, growth: 8, category: "Content" },
        { feature: "Launch Calendar", usage: 68, growth: 15, category: "Events" },
        { feature: "Satellite Tracker", usage: 54, growth: 22, category: "Tracking" },
        { feature: "Space Weather", usage: 45, growth: 18, category: "Data" },
        { feature: "Astronaut Info", usage: 62, growth: 5, category: "People" },
        { feature: "Analytics Dashboard", usage: 38, growth: 35, category: "Insights" },
        { feature: "User Favorites", usage: 71, growth: 9, category: "Personal" },
        { feature: "Pass Predictions", usage: 58, growth: 14, category: "Tracking" },
        { feature: "3D Globe View", usage: 42, growth: 28, category: "Visualization" },
      ]

      // Generate 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        // Simulate realistic engagement patterns
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const baseUsers = isWeekend ? 1200 : 1800
        const variation = Math.random() * 400 - 200

        data.push({
          date: date.toISOString().split("T")[0],
          activeUsers: Math.floor(baseUsers + variation),
          pageViews: Math.floor((baseUsers + variation) * (3 + Math.random() * 2)),
          favorites: Math.floor((baseUsers + variation) * 0.15),
          shares: Math.floor((baseUsers + variation) * 0.08),
          avgSessionTime: Math.floor(180 + Math.random() * 120), // 3-5 minutes
          bounceRate: Math.floor(25 + Math.random() * 15), // 25-40%
        })
      }

      setEngagementData(data)
      setFeatureUsage(features.sort((a, b) => b.usage - a.usage))
      setLoading(false)
    }

    generateEngagementData()
  }, [])

  const totalUsers = engagementData.reduce((sum, d) => sum + d.activeUsers, 0)
  const avgSessionTime = engagementData.reduce((sum, d) => sum + d.avgSessionTime, 0) / engagementData.length
  const totalPageViews = engagementData.reduce((sum, d) => sum + d.pageViews, 0)
  const avgBounceRate = engagementData.reduce((sum, d) => sum + d.bounceRate, 0) / engagementData.length

  const chartConfig = {
    activeUsers: { label: "Active Users", color: "hsl(var(--chart-1))" },
    pageViews: { label: "Page Views", color: "hsl(var(--chart-2))" },
    favorites: { label: "Favorites", color: "hsl(var(--chart-3))" },
    shares: { label: "Shares", color: "hsl(var(--chart-4))" },
    avgSessionTime: { label: "Session Time (min)", color: "hsl(var(--chart-5))" },
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Analyzing user engagement...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-green-400" />
          User Engagement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-slate-600">
              Features
            </TabsTrigger>
            <TabsTrigger value="behavior" className="data-[state=active]:bg-slate-600">
              Behavior
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-white">{(totalUsers / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-500">30 days</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-400">Page Views</span>
                </div>
                <p className="text-2xl font-bold text-white">{(totalPageViews / 1000).toFixed(0)}K</p>
                <p className="text-xs text-slate-500">Total views</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">Avg Session</span>
                </div>
                <p className="text-2xl font-bold text-white">{Math.floor(avgSessionTime / 60)}m</p>
                <p className="text-xs text-slate-500">{avgSessionTime % 60}s</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-400">Bounce Rate</span>
                </div>
                <p className="text-2xl font-bold text-white">{avgBounceRate.toFixed(0)}%</p>
                <p className="text-xs text-slate-500">Low is better</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Daily Active Users</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="var(--color-activeUsers)"
                      fill="var(--color-activeUsers)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Engagement Metrics</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="favorites"
                      stroke="var(--color-favorites)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-favorites)", strokeWidth: 2, r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="shares"
                      stroke="var(--color-shares)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-shares)", strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4">Feature Usage Statistics</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureUsage} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="feature" type="category" stroke="#9CA3AF" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="usage" fill="var(--color-activeUsers)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="space-y-3">
              {featureUsage.map((feature, index) => (
                <div key={feature.feature} className="bg-slate-900/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        #{index + 1}
                      </Badge>
                      <h4 className="text-white font-medium">{feature.feature}</h4>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{feature.usage}%</span>
                      <Badge
                        variant="outline"
                        className={`${
                          feature.growth > 0 ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
                        }`}
                      >
                        {feature.growth > 0 ? "+" : ""}
                        {feature.growth}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4">User Behavior Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    Most Favorited Content
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">ISS Live Tracking</span>
                      <span className="text-white font-medium">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Upcoming Launches</span>
                      <span className="text-white font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Space News</span>
                      <span className="text-white font-medium">22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Astronaut Profiles</span>
                      <span className="text-white font-medium">16%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-blue-400" />
                    Most Shared Content
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Launch Livestreams</span>
                      <span className="text-white font-medium">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Space Discoveries</span>
                      <span className="text-white font-medium">31%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ISS Photos</span>
                      <span className="text-white font-medium">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mission Updates</span>
                      <span className="text-white font-medium">9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">User Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Peak Usage Time</p>
                  <p className="text-white font-medium">8-10 PM UTC</p>
                </div>
                <div>
                  <p className="text-slate-400">Most Active Day</p>
                  <p className="text-white font-medium">Saturday</p>
                </div>
                <div>
                  <p className="text-slate-400">Return Rate</p>
                  <p className="text-green-400 font-medium">73%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
