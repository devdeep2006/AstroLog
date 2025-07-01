"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Globe, MapPin } from "lucide-react"

interface CountryPassData {
  country: string
  passes: number
  flag: string
  continent: string
  population: number
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

export function CountryPassAnalysis() {
  const [countryData, setCountryData] = useState<CountryPassData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate realistic country pass data
    const generateCountryData = () => {
      const countries: CountryPassData[] = [
        { country: "United States", passes: 156, flag: "🇺🇸", continent: "North America", population: 331000000 },
        { country: "Russia", passes: 142, flag: "🇷🇺", continent: "Asia", population: 146000000 },
        { country: "China", passes: 138, flag: "🇨🇳", continent: "Asia", population: 1440000000 },
        { country: "Canada", passes: 134, flag: "🇨🇦", continent: "North America", population: 38000000 },
        { country: "Brazil", passes: 128, flag: "🇧🇷", continent: "South America", population: 215000000 },
        { country: "Australia", passes: 118, flag: "🇦🇺", continent: "Oceania", population: 26000000 },
        { country: "India", passes: 115, flag: "🇮🇳", continent: "Asia", population: 1380000000 },
        { country: "Kazakhstan", passes: 108, flag: "🇰🇿", continent: "Asia", population: 19000000 },
        { country: "Argentina", passes: 102, flag: "🇦🇷", continent: "South America", population: 45000000 },
        { country: "Mongolia", passes: 98, flag: "🇲🇳", continent: "Asia", population: 3000000 },
        { country: "Germany", passes: 89, flag: "🇩🇪", continent: "Europe", population: 83000000 },
        { country: "France", passes: 85, flag: "🇫🇷", continent: "Europe", population: 68000000 },
      ]

      // Sort by passes descending
      countries.sort((a, b) => b.passes - a.passes)
      setCountryData(countries)
      setLoading(false)
    }

    generateCountryData()
  }, [])

  const chartConfig = {
    passes: {
      label: "ISS Passes",
      color: "hsl(var(--chart-1))",
    },
  }

  const topCountries = countryData.slice(0, 8)
  const continentData = countryData.reduce(
    (acc, country) => {
      const existing = acc.find((item) => item.continent === country.continent)
      if (existing) {
        existing.passes += country.passes
        existing.countries += 1
      } else {
        acc.push({
          continent: country.continent,
          passes: country.passes,
          countries: 1,
        })
      }
      return acc
    },
    [] as { continent: string; passes: number; countries: number }[],
  )

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Analyzing country pass data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5 text-green-400" />
          ISS Passes by Country (30 days)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Countries Bar Chart */}
        <div>
          <h3 className="text-white font-medium mb-4">Top Countries by Pass Count</h3>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCountries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="country"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name, props) => [
                    `${value} passes`,
                    `${props.payload.flag} ${props.payload.country}`,
                  ]}
                />
                <Bar dataKey="passes" fill="var(--color-passes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Continent Distribution Pie Chart */}
        <div>
          <h3 className="text-white font-medium mb-4">Distribution by Continent</h3>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={continentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="passes"
                    label={({ continent, passes }) => `${continent}: ${passes}`}
                  >
                    {continentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value} passes`, `${props.payload.countries} countries`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-1/2 space-y-2">
              {continentData.map((continent, index) => (
                <div
                  key={continent.continent}
                  className="flex items-center justify-between p-2 bg-slate-900/30 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-white text-sm">{continent.continent}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{continent.passes} passes</p>
                    <p className="text-slate-400 text-xs">{continent.countries} countries</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Countries List */}
        <div>
          <h3 className="text-white font-medium mb-4">Detailed Country Rankings</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {countryData.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-slate-600 text-slate-300 w-8 text-center">
                    #{index + 1}
                  </Badge>
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <p className="text-white font-medium">{country.country}</p>
                    <p className="text-slate-400 text-xs">{country.continent}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{country.passes} passes</p>
                  <p className="text-slate-400 text-xs">{(country.population / 1000000).toFixed(0)}M people</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span className="text-white font-medium">Analysis Insights</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Total Countries</p>
              <p className="text-white font-medium">{countryData.length}</p>
            </div>
            <div>
              <p className="text-slate-400">Total Passes</p>
              <p className="text-white font-medium">{countryData.reduce((sum, c) => sum + c.passes, 0)}</p>
            </div>
            <div>
              <p className="text-slate-400">Average per Country</p>
              <p className="text-white font-medium">
                {(countryData.reduce((sum, c) => sum + c.passes, 0) / countryData.length).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
