"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Rocket,
  Users,
  Satellite,
  Clock,
  MapPin,
  ExternalLink,
  Bell,
  Star
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

interface SpaceEvent {
  id: string
  title: string
  type: string
  date: string
  time: string
  location: string
  agency: string
  description: string
  status: string
  livestream?: boolean
  importance: "low" | "medium" | "high"
  image?: string
}

export function SpaceEvents() {
  const { user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<SpaceEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("upcoming")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const fetchSpaceEvents = async () => {
    setLoading(true)
    try {
      const apiUrl = `https://ll.thespacedevs.com/2.2.0/event/${selectedTab === "upcoming" ? "upcoming" : "previous"}/?format=json`
      const res = await fetch(apiUrl)
      const data = await res.json()
      if (!data?.results) {
        setEvents([])
        return
      }

      const parsedEvents: SpaceEvent[] = data.results.map((e: any) => ({
        id: String(e.id),
        title: e.name,
        type: e.type?.name || "event",
        date: e.date?.split("T")[0] || "Unknown",
        time: e.date?.split("T")[1]?.slice(0, 5) || "00:00",
        location: e.location || "Unknown",
        agency: e.launch_service_provider?.name || "N/A",
        description: e.description || "No description available.",
        status: e.status?.name?.toLowerCase() || "scheduled",
        livestream: !!e.url,
        importance: "medium",
        image: e.feature_image || ""
      }))

      setEvents(parsedEvents)
    } catch (err) {
      console.error("Error fetching events:", err)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserFavorites = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("item_id")
        .eq("user_id", user.id)
        .eq("item_type", "event")

      if (error) throw error
      setFavorites(new Set(data.map((f) => f.item_id)))
    } catch (err) {
      console.error("Error fetching favorites:", err)
    }
  }

  const toggleFavorite = async (eventId: string, eventData: SpaceEvent) => {
    if (!user) return
    try {
      if (favorites.has(eventId)) {
        await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_type", "event")
          .eq("item_id", eventId)

        setFavorites((prev) => {
          const updated = new Set(prev)
          updated.delete(eventId)
          return updated
        })
      } else {
        await supabase.from("user_favorites").insert({
          user_id: user.id,
          item_type: "event",
          item_id: eventId,
          item_data: eventData
        })

        setFavorites((prev) => new Set([...prev, eventId]))
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "launch": return <Rocket className="h-4 w-4" />
      case "spacewalk": return <Users className="h-4 w-4" />
      case "docking": return <Satellite className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-600 text-white"
      case "scheduled": return "bg-blue-600 text-white"
      case "delayed": return "bg-yellow-600 text-white"
      case "completed": return "bg-slate-600 text-white"
      default: return "bg-slate-600 text-white"
    }
  }

  const getTimeUntilEvent = (date: string, time: string) => {
    const dt = new Date(`${date}T${time}Z`)
    const now = new Date()
    const diff = dt.getTime() - now.getTime()
    if (diff < 0) return "Past"
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return days > 0 ? `in ${days}d ${hours}h` : `in ${hours}h`
  }

  useEffect(() => {
    fetchSpaceEvents()
  }, [selectedTab])

  useEffect(() => {
    fetchUserFavorites()
  }, [user])

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5 text-purple-400" />
          Space Mission Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading events...</div>
        ) : (
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-600">Upcoming</TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-slate-600">Past</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4 mt-6">
              {events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-900/30 p-4 rounded-lg hover:bg-slate-800/50 transition cursor-pointer"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-56 object-cover rounded-md mb-3 border border-slate-700"
                      />
                    )}

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getEventIcon(event.type)}
                          <h3 className="text-white font-semibold">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          {event.livestream && (
                            <Badge variant="outline" className="border-red-500 text-red-400">LIVE</Badge>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm">{event.description}</p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{event.date} at {event.time} UTC</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge variant="outline" className="border-purple-500 text-purple-400">{event.agency}</Badge>
                          <span className="text-cyan-400 text-sm font-medium">{getTimeUntilEvent(event.date, event.time)}</span>
                        </div>
                      </div>

                      {user && (
                        <div className="ml-4 flex flex-col gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(event.id, event)
                            }}
                          >
                            <Star
                              className={`h-4 w-4 ${favorites.has(event.id) ? "fill-yellow-400 text-yellow-400" : "text-slate-400"}`}
                            />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                            <Bell className="h-4 w-4 text-slate-400" />
                          </Button>
                          {event.livestream && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(event.image, "e.livestream")
                              }}
                            >
                              <ExternalLink className="h-4 w-4 text-red-400" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No events found.</div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
