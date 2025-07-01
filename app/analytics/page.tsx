"use client"
import { Navigation } from "@/components/navigation"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { SpaceExperimentsPanel } from "@/components/analytics/live-events-panel"
import { ISSVideoTracker } from "@/components/analytics/iss-globe"
import { ISSPassMap } from "@/components/analytics/iss-pass-map"
import { LaunchAnalytics } from "@/components/analytics/launch-analytics"
import { EnhancedAgencyComparison } from "@/components/analytics/enhanced-agency-comparison"
import { UserEngagementMetrics } from "@/components/analytics/user-engagement-metrics"
import { SatelliteDeploymentTrends } from "@/components/analytics/satellite-deployment-trends"
import {RealisticSolarSystem} from "@/components/analytics/iss-metrics-charts"
import { NewsTopicsAnalysis } from "@/components/analytics/news-topics-analysis"
import { SpaceAnalytics } from "@/components/analytics/space-analytics"

export default function AnalyticsPage() {
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    console.log("Date range changed:", range)
    // Implement date filtering logic
  }

  const handleSearchChange = (query: string) => {
    console.log("Search query:", query)
    // Implement search filtering logic
  }

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters)
    // Implement filter logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">📊 Space Analytics Hub</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive insights into space missions, launches, user engagement, and the future of space exploration
          </p>
        </div>

        {/* Live Events Panel */}
        <div className="mb-8">
          <LaunchAnalytics />
        </div>

        {/* 3D Globe and ISS Pass Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ISSVideoTracker />
          <ISSPassMap />
        </div>


        {/* Enhanced Agency Comparison */}
        <div className="mb-8">
          <SpaceExperimentsPanel/>
          <EnhancedAgencyComparison />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SatelliteDeploymentTrends />
          <RealisticSolarSystem />
        </div>



        {/* Satellite Trends and News Analysis */}

        {/* Comprehensive Analytics */}   
        <SpaceAnalytics />
          
      </main>
    </div>
  )
}
