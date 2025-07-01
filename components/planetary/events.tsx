"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Eye, MapPin, Star, Moon, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function Component() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const celestialEvents = [
    {
      id: 5,
      type: "Lunar Eclipse",
      title: "Total Lunar Eclipse",
      date: "September 7, 2025",
      time: "9:30 PM - 1:15 AM",
      visibility: "Americas, Europe, Africa",
      description:
        "A total lunar eclipse will turn the Moon a deep red color, visible across the Americas, Europe, and Africa.",
      details:
        "Totality will last for 1 hour and 25 minutes, making this one of the longer lunar eclipses of the decade. The Moon will appear copper-red during totality.",
      observationTips:
        "Safe to view with the naked eye, binoculars, or telescope. The entire eclipse process takes about 5 hours from start to finish.",
      icon: <Moon className="h-5 w-5" />,
      color: "bg-red-100/20 text-red-300 border-red-400/30",
    },
  {
    id: 7,
    type: "Planetary Alignment",
    title: "Venus–Jupiter Conjunction",
    date: "August 11–12, 2025",
    time: "Evening twilight",
    visibility: "Worldwide",
    description:
      "Venus and Jupiter, the two brightest planets, will appear extremely close together in the western sky after sunset.",
    details:
      "They will be separated by only ~0.3°, creating a bright double-point in the evening sky.",
    observationTips:
      "Look west 30–45 minutes after sunset. Binoculars will enhance the view.",
    icon: <Star className="h-5 w-5" />,
    color: "bg-yellow-100/20 text-yellow-300 border-yellow-400/30",
  },
  {
    id: 8,
    type: "Lunar Eclipse",
    title: "Total Lunar Eclipse",
    date: "September 7–8, 2025",
    time: "9:00 PM – 2:30 AM (IST)",
    visibility: "Americas, Europe, Africa, parts of Asia",
    description:
      "A total lunar eclipse will turn the Moon a coppery red. One of the longest of the decade.",
    details:
      "Totality lasts ~82 minutes. Best seen in Europe and Africa, partial in India.",
    observationTips:
      "Safe to view with naked eye or binoculars. Best viewed around midnight.",
    icon: <Moon className="h-5 w-5" />,
    color: "bg-red-100/20 text-red-300 border-red-400/30",
  },
  {
    id: 9,
    type: "Solar Eclipse",
    title: "Partial Solar Eclipse",
    date: "September 21, 2025",
    time: "17:30–21:55 UTC",
    visibility: "Oceania, Antarctica",
    description:
      "The Moon will partially obscure the Sun, with up to 86% coverage visible in southern polar regions.",
    details:
      "This is a partial eclipse, not visible from India. Greatest eclipse at ~19:43 UTC.",
    observationTips:
      "Always use certified eclipse glasses or a solar filter. Never look directly at the Sun.",
    icon: <Moon className="h-5 w-5" />,
    color: "bg-orange-100/20 text-orange-300 border-orange-400/30",
  },
  {
    id: 10,
    type: "Meteor Shower",
    title: "Orionid Meteor Shower",
    date: "October 22–23, 2025",
    time: "After Midnight",
    visibility: "Both Hemispheres",
    description:
      "The Orionids will peak with about 20 meteors per hour, with fast-moving bright trails.",
    details:
      "Debris from Halley's Comet. Minimal moonlight provides excellent viewing conditions.",
    observationTips:
      "Find a dark location and look east after midnight toward the constellation Orion.",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-purple-100/20 text-purple-300 border-purple-400/30",
  },
  {
    id: 11,
    type: "Meteor Shower",
    title: "Leonid Meteor Shower",
    date: "November 16–17, 2025",
    time: "After Midnight",
    visibility: "Both Hemispheres",
    description:
      "The Leonids may produce 10–15 meteors per hour. Possible outbursts expected from ancient comet trails.",
    details:
      "Originating from Comet Tempel-Tuttle, known for fast, bright meteors. Low moonlight favors good visibility.",
    observationTips:
      "Look northeast after midnight. Best in rural areas with little light pollution.",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-indigo-100/20 text-indigo-300 border-indigo-400/30",
  },
  {
    id: 12,
    type: "Meteor Shower",
    title: "Geminid Meteor Shower",
    date: "December 13–14, 2025",
    time: "After Midnight",
    visibility: "Worldwide",
    description:
      "The Geminids are one of the strongest meteor showers of the year, producing up to 120 meteors/hour.",
    details:
      "Debris from asteroid 3200 Phaethon. Meteors are bright and slow-moving, best visible post-midnight.",
    observationTips:
      "Find a clear, dark spot and look toward the constellation Gemini. Dress warmly!",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-green-100/20 text-green-300 border-green-400/30",
  },
  {
    id: 13,
    type: "Meteor Shower",
    title: "Ursid Meteor Shower",
    date: "December 21–22, 2025",
    time: "Midnight – Pre-dawn",
    visibility: "Northern Hemisphere",
    description:
      "The Ursids offer modest activity (~5–10 meteors/hr), but 2025 offers dark skies for excellent viewing.",
    details:
      "Originates from Comet 8P/Tuttle. Low activity but dark skies may reveal more faint meteors.",
    observationTips:
      "Look northward toward Ursa Minor just before dawn. Let your eyes adjust to the dark.",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-gray-100/20 text-gray-300 border-gray-400/30",
  },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Planetary Alignment":
        return <Star className="h-4 w-4" />
      case "Solar Eclipse":
      case "Lunar Eclipse":
        return <Moon className="h-4 w-4" />
      case "Meteor Shower":
        return <Zap className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  // Generate random stars for background
  const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      animationDelay: Math.random() * 4,
      animationDuration: Math.random() * 3 + 2,
    }))
  }

  const stars = generateStars(1500)

  return (
    <div>
      {/* Animated Starfield Background */}
      <div className="absolute w-full h-screen">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('')",
          }}
        />

        {/* Stars Layer (Animated Overlay) */}
        <div className="absolute inset-0 overflow-hidden z-10">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-12 max-w-12xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div
          className={`text-center space-y-4 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-shimmer">
            Upcoming Celestial Events
          </h1>

        </div>

        {/* Events Grid */}
        <div className="grid gap-6 xl :grid-cols-3 lg:grid-cols-3">
          {celestialEvents.map((event, index) => (
            <Card
              key={event.id}
              className={`w-full h-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-float-up group ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${3 + (index % 3)}s`,
              }}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`${event.color} backdrop-blur-sm transition-all duration-300 group-hover:scale-110`}
                  >
                    <div className="flex items-center gap-1">
                      {getTypeIcon(event.type)}
                      {event.type}
                    </div>
                  </Badge>
                  <div className="animate-pulse group-hover:animate-spin transition-all duration-300">{event.icon}</div>
                </div>
                <CardTitle className="text-xl text-slate-100 group-hover:text-white transition-colors duration-300">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                  {event.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span>{event.visibility}</span>
                  </div>
                </div>

                <Separator className="bg-slate-600/50" />

                {/* Detailed Information */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-slate-200">Details</h4>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {event.details}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-1 text-slate-200">
                      <Eye className="h-3 w-3 text-yellow-400" />
                      Observation Tips
                    </h4>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                      {event.observationTips}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Information */}
        <div
          className={`bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-slate-700/50 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ animationDelay: "0.8s" }}
        >
          <h3 className="text-lg font-semibold text-slate-100">General Viewing Tips</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium mb-2 text-slate-200">Best Viewing Conditions</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Find a location away from city lights
                </li>
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Allow 20-30 minutes for your eyes to adjust to darkness
                </li>
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Check weather conditions for clear skies
                </li>
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Use red flashlight to preserve night vision
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium mb-2 text-slate-200">Safety Reminders</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Never look directly at the Sun without proper filters
                </li>
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Use certified eclipse glasses for solar events
                </li>
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Lunar eclipses are safe to view with naked eyes
                </li>
                <li className="hover:text-slate-300 transition-colors duration-200">
                  • Consider using astronomy apps for precise timing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
