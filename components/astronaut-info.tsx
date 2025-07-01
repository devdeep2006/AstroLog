"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Rocket, Calendar } from "lucide-react"

interface Astronaut {
  name: string
  craft: string
  country: string
  agency: string
  mission: string
  launchDate: string
  daysInSpace: number
  avatar?: string
  description:string,
}

// Dummy flag function
function getCountryFlag(country: string): string {
  return "🌎"
}
const astronautImages: { [name: string]: string } = {
  "Oleg Kononenko": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Oleg_Kononenko_Official_Portrait_%28jsc2023e052791%29.jpg/500px-Oleg_Kononenko_Official_Portrait_%28jsc2023e052791%29.jpg",
  "Nikolai Chub": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Nikolai_Chub_at_the_Expedition_68_State_Commission_meeting_on_September_20%2C_2022_%28NHQ202209200012%29_%28cropped%29_2.jpg/500px-Nikolai_Chub_at_the_Expedition_68_State_Commission_meeting_on_September_20%2C_2022_%28NHQ202209200012%29_%28cropped%29_2.jpg",
  "Tracy Caldwell Dyson": "data:image/webp;base64,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",
  "Matthew Dominick": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Matthew_Dominick%2C_NASA_portrait%2C_2017_%28cropped%29_2.jpg/500px-Matthew_Dominick%2C_NASA_portrait%2C_2017_%28cropped%29_2.jpg",
  "Michael Barratt": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Mike_Barratt_2023_%28portrait_crop%29.jpg/500px-Mike_Barratt_2023_%28portrait_crop%29.jpg",
  "Jeanette Epps": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jsc2023e047050_alt_%28cropped%29.jpg/500px-Jsc2023e047050_alt_%28cropped%29.jpg",
  "Alexander Grebenkin": "data:image/webp;base64,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",
  "Butch Wilmore": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Barry_Wilmore.jpg/500px-Barry_Wilmore.jpg",
  "Sunita Williams": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sunita_Williams_in_2018.jpg/500px-Sunita_Williams_in_2018.jpg",
  "Li Guangsu": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Li_Guangsu_at_Shenzhou_18_Press_Conference_2025.png/500px-Li_Guangsu_at_Shenzhou_18_Press_Conference_2025.png", // No public photo available
  "Li Cong": "https://upload.wikimedia.org/wikipedia/commons/2/26/%E6%9D%8E%E8%81%AA.png",    // No public photo available
  "Ye Guangfu": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ye_Guangfu_at_Shenzhou_18_Press_Conference_2025.png/330px-Ye_Guangfu_at_Shenzhou_18_Press_Conference_2025.png"
}

  export default function AstronautInfo() {
    const [astronauts, setAstronauts] = useState<Astronaut[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [totalAstronauts, setTotalAstronauts] = useState<number>(0)
    const [selectedAstronaut, setSelectedAstronaut] = useState<Astronaut | null>(null)
  const fetchAstronautDetails = async (name: string) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${name.replace(" ", "_")}`
    try {
      const res = await fetch(url)
      const data = await res.json()

      return {
        avatar: data.thumbnail?.source || "/placeholder.svg",
        description: data.description || "Unknown",
        extract: data.extract || "",
      }
    } catch (e) {
      console.error(`Failed to fetch Wikipedia for ${name}`, e)
      return {
        avatar: "/placeholder.svg",
        description: "Unknown",
        extract: "",
      }
    }
  }
  const fetchAstronauts = async () => {
    try {
      const res = await fetch("http://api.open-notify.org/astros.json")
      const data = await res.json()

      if (data.message !== "success") {
        throw new Error("API did not return success")
      }

      const enrichedAstronauts: Astronaut[] = await Promise.all(
        data.people.map(async (person: any) => {
          const wiki = await fetchAstronautDetails(person.name)

          return {
            name: person.name,
            craft: person.craft,
            country: wiki.description.includes("American") ? "USA"
                    : wiki.description.includes("Russian") ? "Russia"
                    : wiki.description.includes("China") ? "China"
                     : wiki.description.includes("Peixian") ? "Pei County"
                    : "Unknown",
            agency: wiki.description.includes("NASA") ? "NASA"
                  : wiki.description.includes("Roscosmos") ? "Roscosmos"
                  :wiki.description.includes("PLAAC") ? "PLAAC"
                  : "Unknown",
            mission: "N/A",
            launchDate: "",
            daysInSpace: 0,
            avatar: wiki.avatar,
            description:wiki.extract
          }
        })
      )

      setAstronauts(enrichedAstronauts)
      setTotalAstronauts(data.number)
    } catch (error) {
      console.error("Error fetching astronaut data:", error)
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchAstronauts()
    const interval = setInterval(fetchAstronauts, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleDetails = (astronaut: Astronaut) => {
    if (selectedAstronaut?.name === astronaut.name) {
      setSelectedAstronaut(null)
    } else {
      setSelectedAstronaut(astronaut)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-cyan-400" />
          Astronauts in Space
          <Badge variant="secondary" className="bg-cyan-600 text-white ml-auto">
            {totalAstronauts}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading astronaut data...</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-123 overflow-y-auto">
            {astronauts.map((astronaut, index) => (
              <div key={index} className="bg-slate-900/30 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={astronautImages[astronaut.name] || "/placeholder.svg"} alt={astronaut.name} />
                    <AvatarFallback className="bg-cyan-600 text-white text-xs">
                      {astronaut.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className="text-white font-medium text-sm truncate cursor-pointer hover:underline"
                        onClick={() => handleToggleDetails(astronaut)}
                      >
                        {astronaut.name}
                      </h4>
                      <span className="text-lg">{getCountryFlag(astronaut.country)}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Rocket className="h-3 w-3 text-cyan-400" />
                        <span className="text-slate-400">{astronaut.craft}</span>
                        <Badge variant="outline" className="border-cyan-500 text-cyan-400 text-xs px-1 py-0">
                          {astronaut.agency}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{astronaut.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAstronaut?.name === astronaut.name && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-800 border border-cyan-500 text-white animate-fade-in">
                    <div className="flex gap-4">
                      <img
                        src={astronautImages[astronaut.name] || "/placeholder.svg"}
                        alt={astronaut.name}
                        className="h-24 w-24 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm text-slate-300">
                          {astronaut.description}
                        </p>
                        <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(astronaut.name)}`} target="_blank" rel="noopener noreferrer"className="mt-2 text-xs text-cyan-400 underline hover:text-cyan-300">
                        Read more on Wikipedia →
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
