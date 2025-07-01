
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Rocket, TrendingUp, Target, Calendar } from "lucide-react"

interface LaunchData {
  year: number
  month: string
  agency: string
  launches: number
  successes: number
  failures: number
  successRate: number
  cost: number
  payload: number
}

interface AgencyStats {
  agency: string
  launches: number
  successRate: number
  totalPayload: number
  avgCost: number
  color: string
}

interface LaunchYearData {
  [agency: string]: { launches: number; successes: number; avgPayload: number; avgCost: number }
}

interface YearlyLaunches {
  [year: string]: LaunchYearData
}

const AGENCY_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export function LaunchAnalytics() {
  const [launchData, setLaunchData] = useState<LaunchData[]>([])
  const [agencyStats, setAgencyStats] = useState<AgencyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateLaunchData = () => {
      const agencies = ["SpaceX", "NASA", "Roscosmos", "ESA", "CNSA", "ISRO"]
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const data: LaunchData[] = []
      const agencyTotals: Record<string, AgencyStats> = {}

      // 2024 and 2025 launch data
      const yearlyLaunches: YearlyLaunches = {
        "2024": {
          SpaceX: { launches: 138, successes: 133, avgPayload: 22.8, avgCost: 90 },
          CNSA: { launches: 68, successes: 65, avgPayload: 10, avgCost: 70 },
          Roscosmos: { launches: 9, successes: 9, avgPayload: 7.5, avgCost: 50 },
          ISRO: { launches: 5, successes: 4, avgPayload: 5, avgCost: 30 },
          ESA: { launches: 3, successes: 2, avgPayload: 15, avgCost: 100 },
          NASA: { launches: 6, successes: 5, avgPayload: 20, avgCost: 100 },
        },
        "2025": {
          SpaceX: { launches: 169, successes: 167, avgPayload: 22.8, avgCost: 90 },
          CNSA: { launches: 70, successes: 67, avgPayload: 10, avgCost: 70 },
          Roscosmos: { launches: 10, successes: 10, avgPayload: 7.5, avgCost: 50 },
          ISRO: { launches: 29, successes: 23, avgPayload: 5, avgCost: 30 },
          ESA: { launches: 4, successes: 3, avgPayload: 15, avgCost: 100 },
          NASA: { launches: 6, successes: 5, avgPayload: 20, avgCost: 100 },
        },
      }

      // Distribute launches across months
      for (let year = 2024; year <= 2025; year++) {
        agencies.forEach((agency) => {
          // Check if yearlyLaunches[year][agency] exists
          if (!yearlyLaunches[String(year)] || !yearlyLaunches[String(year)][agency]) {
            console.error(`Data missing for year ${year}, agency ${agency}`)
            return
          }

          const totalLaunches = yearlyLaunches[String(year)][agency].launches
          const successes = yearlyLaunches[String(year)][agency].successes
          const avgPayload = yearlyLaunches[String(year)][agency].avgPayload
          const avgCost = yearlyLaunches[String(year)][agency].avgCost
          const monthlyLaunches = Math.floor(totalLaunches / 12)
          const remainder = totalLaunches % 12

          months.forEach((month, monthIndex) => {
            // For 2025, limit to June for confirmed data
            if (year === 2025 && monthIndex > 5) return
            let launches = monthlyLaunches
            if (monthIndex < remainder) launches += 1
            if (launches === 0) return // Skip months with no launches

            const successRate = (successes / totalLaunches) * 100
            const failures = launches - Math.round((successes / totalLaunches) * launches)

            data.push({
              year,
              month,
              agency,
              launches,
              successes: Math.round((successes / totalLaunches) * launches),
              failures,
              successRate,
              cost: avgCost,
              payload: avgPayload,
            })

            // Aggregate agency stats
            if (!agencyTotals[agency]) {
              agencyTotals[agency] = {
                agency,
                launches: 0,
                successRate: 0,
                totalPayload: 0,
                avgCost: 0,
                color: AGENCY_COLORS[agencies.indexOf(agency)],
              }
            }

            agencyTotals[agency].launches += launches
            agencyTotals[agency].totalPayload += avgPayload * launches
            agencyTotals[agency].avgCost += avgCost * launches
          })
        })
      }

      // Calculate averages
      Object.values(agencyTotals).forEach((agency) => {
        const agencyData = data.filter((d) => d.agency === agency.agency)
        const totalSuccesses = agencyData.reduce((sum, d) => sum + d.successes, 0)
        agency.successRate = (totalSuccesses / agency.launches) * 100
        agency.avgCost = agency.avgCost / agencyData.length
      })

      setLaunchData(data)
      setAgencyStats(Object.values(agencyTotals).sort((a, b) => b.launches - a.launches))
      setLoading(false)
    }

    generateLaunchData()
  }, [])

  const monthlyTotals = launchData.reduce(
    (acc, curr) => {
      const key = `${curr.year}-${curr.month}`
      if (!acc[key]) {
        acc[key] = { period: key, launches: 0, successes: 0, failures: 0 }
      }
      acc[key].launches += curr.launches
      acc[key].successes += curr.successes
      acc[key].failures += curr.failures
      return acc
    },
    {} as Record<string, any>,
  )

  const monthlyData = Object.values(monthlyTotals).map((item: any) => ({
    ...item,
    successRate: (item.successes / item.launches) * 100,
  }))

  const totalLaunches = launchData.reduce((sum, d) => sum + d.launches, 0)
  const totalSuccesses = launchData.reduce((sum, d) => sum + d.successes, 0)
  const overallSuccessRate = (totalSuccesses / totalLaunches) * 100

  const chartConfig = {
    launches: { label: "Launches", color: "hsl(var(--chart-1))" },
    successes: { label: "Successes", color: "hsl(var(--chart-2))" },
    failures: { label: "Failures", color: "hsl(var(--chart-3))" },
    successRate: { label: "Success Rate (%)", color: "hsl(var(--chart-4))" },
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Analyzing launch data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Rocket className="h-5 w-5 text-blue-400" />
          Global Launch Analytics (2024-2025)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="agencies" className="data-[state=active]:bg-slate-600">
              Agencies
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-slate-600">
              Trends
            </TabsTrigger>
            <TabsTrigger value="success" className="data-[state=active]:bg-slate-600">
              Success Rates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Rocket className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Total Launches</span>
                </div>
                <p className="text-2xl font-bold text-white">{totalLaunches}</p>
                <p className="text-xs text-slate-500">2024-2025</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-400">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-green-400">{overallSuccessRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Industry Average</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-400">Active Agencies</span>
                </div>
                <p className="text-2xl font-bold text-white">{agencyStats.length}</p>
                <p className="text-xs text-slate-500">Global Players</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">Avg per Month</span>
                </div>
                <p className="text-2xl font-bold text-white">{(totalLaunches / 18).toFixed(1)}</p>
                <p className="text-xs text-slate-500">Launch Frequency</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4 text-center">Monthly Launch Activity</h3>
              <ChartContainer config={chartConfig} className="h-64 mx-auto max-w-4xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="period" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="successes" stackId="a" fill="var(--color-successes)" />
                    <Bar dataKey="failures" stackId="a" fill="var(--color-failures)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="agencies" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4 text-center">Agency Performance Comparison</h3>
              <div className="h-80 flex justify-center">
                <ChartContainer config={chartConfig} className="max-w-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={agencyStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="launches"
                        label={({ agency, launches }) => `${agency}: ${launches}`}
                      >
                        {agencyStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        formatter={(value, name, props) => [
                          `${value} launches`,
                          `${props.payload.successRate.toFixed(1)}% success rate`,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            <div className="space-y-3">
              {agencyStats.map((agency, index) => (
                <div key={agency.agency} className="bg-slate-900/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: agency.color }} />
                      <h4 className="text-white font-medium">{agency.agency}</h4>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{agency.launches} launches</p>
                      <p className="text-slate-400 text-sm">{agency.successRate.toFixed(1)}% success</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Total Payload</p>
                      <p className="text-white font-medium">{agency.totalPayload.toFixed(0)} tons</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Avg Cost</p>
                      <p className="text-white font-medium">${agency.avgCost.toFixed(0)}M</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Market Share</p>
                      <p className="text-white font-medium">{((agency.launches / totalLaunches) * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <Progress value={agency.successRate} className="mt-3 h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4 text-center">Launch Frequency Trends</h3>
              <ChartContainer config={chartConfig} className="h-64 mx-auto max-w-4xl">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="period" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="launches"
                      stroke="var(--color-launches)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-launches)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Growth Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">YoY Growth</span>
                    <span className="text-green-400 font-medium">+20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peak Month</span>
                    <span className="text-white font-medium">Jun 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Busiest Agency</span>
                    <span className="text-white font-medium">{agencyStats[0]?.agency}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Industry Trends</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commercial Share</span>
                    <span className="text-blue-400 font-medium">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reusability Rate</span>
                    <span className="text-green-400 font-medium">80%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cost Reduction</span>
                    <span className="text-purple-400 font-medium">-40%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="success" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4 text-center">Success Rate Evolution</h3>
              <ChartContainer config={chartConfig} className="h-64 mx-auto max-w-4xl">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="period" stroke="#9CA3AF" />
                    <YAxis domain={[80, 100]} stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke="var(--color-successRate)"
                      strokeWidth={3}
                      dot={{ fill: "var(--color-successRate)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="bg-slate-900/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Success Rate Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Industry Average</p>
                  <p className="text-white font-medium text-lg">{overallSuccessRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Best Performing</p>
                  <p className="text-green-400 font-medium">
                    {
                      agencyStats.reduce((best, current) => (current.successRate > best.successRate ? current : best))
                        .agency
                    }
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Improvement Trend</p>
                  <p className="text-blue-400 font-medium">+2.5% YoY</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}