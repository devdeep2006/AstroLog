"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts"
import { Building2, Trophy, DollarSign, Rocket } from "lucide-react"

interface AgencyMetrics {
  agency: string
  country: string
  flag: string
  launches: number
  successRate: number
  budget: number
  innovation: number
  reliability: number
  costEfficiency: number
  globalReach: number
  technology: number
  overallScore: number
  color: string
}

export function SpaceAgencyComparison() {
  const [agencies, setAgencies] = useState<AgencyMetrics[]>([])
  const [selectedAgency, setSelectedAgency] = useState<string>("SpaceX")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateAgencyData = () => {
      const agencyData: AgencyMetrics[] = [
        {
          agency: "SpaceX",
          country: "United States",
          flag: "🇺🇸",
          launches: 96,
          successRate: 95,
          budget: 85,
          innovation: 98,
          reliability: 92,
          costEfficiency: 95,
          globalReach: 88,
          technology: 96,
          overallScore: 93,
          color: "#3B82F6",
        },
        {
          agency: "NASA",
          country: "United States",
          flag: "🇺🇸",
          launches: 45,
          successRate: 97,
          budget: 95,
          innovation: 90,
          reliability: 98,
          costEfficiency: 75,
          globalReach: 95,
          technology: 94,
          overallScore: 91,
          color: "#10B981",
        },
        {
          agency: "Roscosmos",
          country: "Russia",
          flag: "🇷🇺",
          launches: 38,
          successRate: 89,
          budget: 70,
          innovation: 75,
          reliability: 85,
          costEfficiency: 80,
          globalReach: 85,
          technology: 78,
          overallScore: 80,
          color: "#F59E0B",
        },
        {
          agency: "ESA",
          country: "Europe",
          flag: "🇪🇺",
          launches: 28,
          successRate: 94,
          budget: 80,
          innovation: 85,
          reliability: 92,
          costEfficiency: 78,
          globalReach: 90,
          technology: 88,
          overallScore: 86,
          color: "#8B5CF6",
        },
        {
          agency: "CNSA",
          country: "China",
          flag: "🇨🇳",
          launches: 52,
          successRate: 91,
          budget: 85,
          innovation: 82,
          reliability: 88,
          costEfficiency: 85,
          globalReach: 75,
          technology: 85,
          overallScore: 84,
          color: "#EF4444",
        },
        {
          agency: "ISRO",
          country: "India",
          flag: "🇮🇳",
          launches: 24,
          successRate: 93,
          budget: 60,
          innovation: 88,
          reliability: 90,
          costEfficiency: 98,
          globalReach: 70,
          technology: 82,
          overallScore: 83,
          color: "#06B6D4",
        },
      ]

      setAgencies(agencyData.sort((a, b) => b.overallScore - a.overallScore))
      setLoading(false)
    }

    generateAgencyData()
  }, [])

  const selectedAgencyData = agencies.find((a) => a.agency === selectedAgency)

  const radarData = selectedAgencyData
    ? [
        { metric: "Innovation", value: selectedAgencyData.innovation },
        { metric: "Reliability", value: selectedAgencyData.reliability },
        { metric: "Cost Efficiency", value: selectedAgencyData.costEfficiency },
        { metric: "Global Reach", value: selectedAgencyData.globalReach },
        { metric: "Technology", value: selectedAgencyData.technology },
        { metric: "Budget", value: selectedAgencyData.budget },
      ]
    : []

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Analyzing space agencies...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Building2 className="h-5 w-5 text-purple-400" />
          Space Agency Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Agency Selection */}
        <div>
          <h3 className="text-white font-medium mb-3">Select Agency for Detailed Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {agencies.map((agency) => (
              <button
                key={agency.agency}
                onClick={() => setSelectedAgency(agency.agency)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedAgency === agency.agency
                    ? "border-purple-500 bg-purple-500/20"
                    : "border-slate-600 bg-slate-900/30 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{agency.flag}</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{agency.agency}</p>
                    <p className="text-slate-400 text-xs">{agency.country}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Agency Radar Chart */}
        {selectedAgencyData && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{selectedAgencyData.flag}</span>
              <div>
                <h3 className="text-white font-medium">{selectedAgencyData.agency} Performance Profile</h3>
                <p className="text-slate-400 text-sm">Overall Score: {selectedAgencyData.overallScore}/100</p>
              </div>
              <Badge
                variant="outline"
                style={{
                  borderColor: selectedAgencyData.color,
                  color: selectedAgencyData.color,
                }}
              >
                #{agencies.findIndex((a) => a.agency === selectedAgencyData.agency) + 1}
              </Badge>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <Radar
                    name={selectedAgencyData.agency}
                    dataKey="value"
                    stroke={selectedAgencyData.color}
                    fill={selectedAgencyData.color}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-400">Launches (2024)</span>
                </div>
                <p className="text-xl font-bold text-white">{selectedAgencyData.launches}</p>
                <p className="text-xs text-slate-500">{selectedAgencyData.successRate}% success rate</p>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">Innovation Score</span>
                </div>
                <p className="text-xl font-bold text-white">{selectedAgencyData.innovation}/100</p>
                <Progress value={selectedAgencyData.innovation} className="mt-1 h-1" />
              </div>

              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-400">Cost Efficiency</span>
                </div>
                <p className="text-xl font-bold text-white">{selectedAgencyData.costEfficiency}/100</p>
                <Progress value={selectedAgencyData.costEfficiency} className="mt-1 h-1" />
              </div>
            </div>
          </div>
        )}

        {/* Agency Rankings */}
        <div>
          <h3 className="text-white font-medium mb-4">Global Rankings</h3>
          <div className="space-y-3">
            {agencies.map((agency, index) => (
              <div
                key={agency.agency}
                className={`bg-slate-900/30 rounded-lg p-3 border transition-all cursor-pointer ${
                  selectedAgency === agency.agency ? "border-purple-500" : "border-transparent hover:border-slate-600"
                }`}
                onClick={() => setSelectedAgency(agency.agency)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-slate-600 text-slate-300 w-8 text-center">
                      #{index + 1}
                    </Badge>
                    <span className="text-lg">{agency.flag}</span>
                    <div>
                      <p className="text-white font-medium">{agency.agency}</p>
                      <p className="text-slate-400 text-xs">{agency.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{agency.overallScore}/100</p>
                    <p className="text-slate-400 text-xs">{agency.launches} launches</p>
                  </div>
                </div>
                <Progress value={agency.overallScore} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-slate-900/30 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Most Innovative</p>
              <p className="text-blue-400 font-medium">
                {agencies.reduce((best, current) => (current.innovation > best.innovation ? current : best)).agency}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Most Cost Efficient</p>
              <p className="text-green-400 font-medium">
                {
                  agencies.reduce((best, current) => (current.costEfficiency > best.costEfficiency ? current : best))
                    .agency
                }
              </p>
            </div>
            <div>
              <p className="text-slate-400">Most Reliable</p>
              <p className="text-purple-400 font-medium">
                {agencies.reduce((best, current) => (current.reliability > best.reliability ? current : best)).agency}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
