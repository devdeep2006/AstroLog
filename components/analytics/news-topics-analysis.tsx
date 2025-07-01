"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Treemap, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Brain, Hash, MessageSquare } from "lucide-react"

interface TopicData {
  topic: string
  count: number
  percentage: number
  sentiment: "positive" | "neutral" | "negative"
  trend: "up" | "down" | "stable"
  keywords: string[]
}

interface KeywordData {
  keyword: string
  frequency: number
  category: string
}

const SENTIMENT_COLORS = {
  positive: "#10B981",
  neutral: "#6B7280",
  negative: "#EF4444",
}

const TREND_ICONS = {
  up: "📈",
  down: "📉",
  stable: "➡️",
}

export function NewsTopicsAnalysis() {
  const [topicsData, setTopicsData] = useState<TopicData[]>([])
  const [keywordsData, setKeywordsData] = useState<KeywordData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate NLP analysis results
    const generateNLPData = () => {
      const topics: TopicData[] = [
        {
          topic: "Mars Exploration",
          count: 45,
          percentage: 22.5,
          sentiment: "positive",
          trend: "up",
          keywords: ["Mars", "Perseverance", "Ingenuity", "Red Planet", "Exploration"],
        },
        {
          topic: "SpaceX Missions",
          count: 38,
          percentage: 19.0,
          sentiment: "positive",
          trend: "up",
          keywords: ["SpaceX", "Falcon", "Starship", "Launch", "Musk"],
        },
        {
          topic: "ISS Operations",
          count: 32,
          percentage: 16.0,
          sentiment: "neutral",
          trend: "stable",
          keywords: ["ISS", "Astronauts", "Spacewalk", "Expedition", "Research"],
        },
        {
          topic: "Artemis Program",
          count: 28,
          percentage: 14.0,
          sentiment: "positive",
          trend: "up",
          keywords: ["Artemis", "Moon", "Lunar", "Gateway", "SLS"],
        },
        {
          topic: "James Webb Telescope",
          count: 24,
          percentage: 12.0,
          sentiment: "positive",
          trend: "stable",
          keywords: ["JWST", "Webb", "Telescope", "Universe", "Discovery"],
        },
        {
          topic: "Satellite Technology",
          count: 18,
          percentage: 9.0,
          sentiment: "neutral",
          trend: "up",
          keywords: ["Satellite", "Starlink", "Communication", "Internet", "Orbit"],
        },
        {
          topic: "Space Weather",
          count: 15,
          percentage: 7.5,
          sentiment: "negative",
          trend: "down",
          keywords: ["Solar", "Storm", "Radiation", "Magnetic", "Weather"],
        },
      ]

      const keywords: KeywordData[] = [
        { keyword: "Mars", frequency: 156, category: "Planets" },
        { keyword: "SpaceX", frequency: 142, category: "Companies" },
        { keyword: "NASA", frequency: 138, category: "Agencies" },
        { keyword: "Launch", frequency: 124, category: "Operations" },
        { keyword: "Astronaut", frequency: 118, category: "People" },
        { keyword: "Rocket", frequency: 112, category: "Technology" },
        { keyword: "ISS", frequency: 108, category: "Infrastructure" },
        { keyword: "Moon", frequency: 98, category: "Planets" },
        { keyword: "Satellite", frequency: 89, category: "Technology" },
        { keyword: "Mission", frequency: 85, category: "Operations" },
        { keyword: "Discovery", frequency: 78, category: "Science" },
        { keyword: "Research", frequency: 72, category: "Science" },
        { keyword: "Telescope", frequency: 68, category: "Technology" },
        { keyword: "Orbit", frequency: 65, category: "Operations" },
        { keyword: "Space", frequency: 245, category: "General" },
      ]

      setTopicsData(topics)
      setKeywordsData(keywords)
      setLoading(false)
    }

    generateNLPData()
  }, [])

  const chartConfig = {
    count: {
      label: "Article Count",
      color: "hsl(var(--chart-1))",
    },
    frequency: {
      label: "Keyword Frequency",
      color: "hsl(var(--chart-2))",
    },
  }

  const treemapData = keywordsData.slice(0, 10).map((item) => ({
    name: item.keyword,
    size: item.frequency,
    category: item.category,
  }))

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Analyzing space news topics...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5 text-purple-400" />
          Space News Topic Analysis (NLP)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="topics" className="data-[state=active]:bg-slate-600">
              Topics
            </TabsTrigger>
            <TabsTrigger value="keywords" className="data-[state=active]:bg-slate-600">
              Keywords
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-slate-600">
              Sentiment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Most Covered Topics
              </h3>
              <ChartContainer config={chartConfig} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="topic"
                      stroke="#9CA3AF"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value, name, props) => [
                        `${value} articles (${props.payload.percentage}%)`,
                        props.payload.topic,
                      ]}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="space-y-3">
              {topicsData.map((topic, index) => (
                <div key={topic.topic} className="bg-slate-900/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        #{index + 1}
                      </Badge>
                      <h4 className="text-white font-medium">{topic.topic}</h4>
                      <span className="text-lg">{TREND_ICONS[topic.trend]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: SENTIMENT_COLORS[topic.sentiment],
                          color: SENTIMENT_COLORS[topic.sentiment],
                        }}
                      >
                        {topic.sentiment}
                      </Badge>
                      <span className="text-white font-medium">{topic.count} articles</span>
                    </div>
                  </div>

                  <Progress value={topic.percentage} className="mb-3 h-2" />

                  <div className="flex flex-wrap gap-1">
                    {topic.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6 mt-6">
            <div>
              <h3 className="text-white font-medium mb-4">Keyword Frequency Visualization</h3>
              <div className="h-64 bg-slate-900/30 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap data={treemapData} dataKey="size" aspectRatio={4 / 3} stroke="#374151" fill="#3B82F6">
                    {treemapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 50%)`} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Top Keywords by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(
                  keywordsData.reduce(
                    (acc, keyword) => {
                      if (!acc[keyword.category]) acc[keyword.category] = []
                      acc[keyword.category].push(keyword)
                      return acc
                    },
                    {} as Record<string, KeywordData[]>,
                  ),
                ).map(([category, keywords]) => (
                  <div key={category} className="bg-slate-900/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">{category}</h4>
                    <div className="space-y-2">
                      {keywords.slice(0, 5).map((keyword) => (
                        <div key={keyword.keyword} className="flex items-center justify-between">
                          <span className="text-slate-300">{keyword.keyword}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-blue-400 h-2 rounded-full"
                                style={{
                                  width: `${(keyword.frequency / Math.max(...keywordsData.map((k) => k.frequency))) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-slate-400 text-sm w-8 text-right">{keyword.frequency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(
                topicsData.reduce(
                  (acc, topic) => {
                    if (!acc[topic.sentiment]) acc[topic.sentiment] = { count: 0, topics: [] }
                    acc[topic.sentiment].count += topic.count
                    acc[topic.sentiment].topics.push(topic.topic)
                    return acc
                  },
                  {} as Record<string, { count: number; topics: string[] }>,
                ),
              ).map(([sentiment, data]) => (
                <div key={sentiment} className="bg-slate-900/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: SENTIMENT_COLORS[sentiment as keyof typeof SENTIMENT_COLORS] }}
                    />
                    <h4 className="text-white font-medium capitalize">{sentiment}</h4>
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">{data.count}</p>
                  <p className="text-slate-400 text-sm">articles</p>
                  <div className="mt-3 space-y-1">
                    {data.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="outline" className="border-slate-600 text-slate-300 text-xs block">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <h4 className="text-white font-medium">Sentiment Analysis Summary</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Overall Sentiment</p>
                  <p className="text-green-400 font-medium">Positive (67%)</p>
                </div>
                <div>
                  <p className="text-slate-400">Most Positive Topic</p>
                  <p className="text-white font-medium">Mars Exploration</p>
                </div>
                <div>
                  <p className="text-slate-400">Trending Sentiment</p>
                  <p className="text-blue-400 font-medium">Increasingly Positive</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
