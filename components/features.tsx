import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Satellite, Users, Newspaper, Eye, Sun, Calendar, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Satellite className="h-8 w-8 text-blue-400" />,
    title: "Real-Time ISS Tracking",
    description:
      "Follow the International Space Station's exact position with live updates every 5 seconds. See current coordinates, altitude, and velocity.",
    highlights: ["Live position updates", "Orbital velocity tracking", "Pass predictions"],
  },
  {
    icon: <Users className="h-8 w-8 text-cyan-400" />,
    title: "Astronaut Information",
    description:
      "Meet the brave souls currently in space. View their missions, countries, agencies, and how long they've been orbiting Earth.",
    highlights: ["Current crew details", "Mission information", "Days in space counter"],
  },
  {
    icon: <Sun className="h-8 w-8 text-yellow-400" />,
    title: "Space Weather Monitor",
    description:
      "Stay informed about solar activity, geomagnetic storms, and radiation levels that affect both astronauts and technology on Earth.",
    highlights: ["Solar flare alerts", "Geomagnetic storm tracking", "Radiation monitoring"],
  },
  {
    icon: <Calendar className="h-8 w-8 text-purple-400" />,
    title: "Mission Calendar",
    description:
      "Never miss a launch, spacewalk, or major space event. Get detailed information about upcoming missions and space activities.",
    highlights: ["Upcoming launches", "Spacewalk schedules", "Mission timelines"],
  },
  {
    icon: <Eye className="h-8 w-8 text-green-400" />,
    title: "Satellite Tracking",
    description:
      "Track hundreds of satellites including Starlink, GPS, weather satellites, and more. Filter by type and see visibility predictions.",
    highlights: ["Multi-satellite tracking", "Visibility predictions", "Orbital data"],
  },
  {
    icon: <Newspaper className="h-8 w-8 text-orange-400" />,
    title: "Space News Feed",
    description:
      "Stay updated with the latest space exploration news, discoveries, and announcements from space agencies worldwide.",
    highlights: ["Latest space news", "Mission updates", "Scientific discoveries"],
  },
]

export function Features() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need to Track Space</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            AstroLog brings together real-time data from multiple space agencies and APIs to give you the most
            comprehensive view of space activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-slate-800/30 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm text-slate-400">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-slate-700">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Explore Space?</h3>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of space enthusiasts tracking the cosmos in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 px-8 py-4">
                <Bell className="mr-2 h-5 w-5" />
                Get Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
