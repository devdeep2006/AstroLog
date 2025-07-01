import { ISSTracker } from "@/components/iss-tracker"
import { SpaceNews } from "@/components/space-news"
import { ISSPasses } from "@/components/iss-passes"
import { Navigation } from "@/components/navigation"
import AstronautInfo from "@/components/astronaut-info"
import { SpaceWeather } from "@/components/space-weather"
import {SatelliteTracker} from "@/components/satellite-tracker"
import { SpaceEvents } from "@/components/space-events"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">🚀 Mission Control</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real-time space tracking and mission monitoring dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ISSTracker />
          <ISSPasses />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <AstronautInfo />
          <SpaceWeather />
          <SatelliteTracker />
        </div>

        <div className="mb-8">
          <SpaceEvents />
        </div>

        <SpaceNews />
      </main>
    </div>
  )
}
