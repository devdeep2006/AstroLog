"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, ExternalLink, Calendar, Eye, Heart, Share } from "lucide-react"

interface ApodData {
  title: string
  explanation: string
  url: string
  date: string
  media_type: string
}
const KEY=process.env.NEXT_PUBLIC_NASA_API_KEY;

export function ApodCard() {
  const [apodData, setApodData] = useState<ApodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [views, setViews] = useState(Math.floor(Math.random() * 1000) + 100)
      // title: "The Horsehead Nebula in Infrared",
      // explanation:
      //   "One of the most identifiable nebulae in the sky, the Horsehead Nebula in Orion, is part of a large, dark, molecular cloud. Also known as Barnard 33, the unusual shape was first discovered on a photographic plate in the late 1800s. The red glow originates from hydrogen gas predominantly behind the nebula, ionized by the nearby bright star Sigma Orionis. This infrared image reveals intricate details of the cosmic dust and gas formations that are invisible to the naked eye.",
      // url: "/placeholder.svg?height=300&width=400",
      // date: new Date().toISOString().split("T")[0],
      // media_type: "image",
  useEffect(() => {
    // Simulated APOD data
    const fetchdata= async ()=>{
      try{
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${KEY}`)
        const data = await res.json()
        console.log("Fetched APOD:", data);
        console.log("fetched");
        const article: ApodData = {
          title: data.title,
          explanation: data.explanation,
          url: data.hdurl,
          date: data.date,
          media_type: data.media_type,
        }
        setApodData(article);
      }
      catch(error){
        console.error("Failed to fetch");
      }
      finally{
        setLoading(false)
      }

    };
    fetchdata(); 
  }, []);

  const handleLike = () => {
    setLiked(!liked)
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl"
          >
            <Rocket className="w-6 h-6 text-orange-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">Astronomy Picture</h3>
            <p className="text-sm text-gray-400">Loading cosmic wonders...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 h-48 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="bg-gray-700/50 h-4 rounded-full w-3/4"></div>
            <div className="bg-gray-700/50 h-4 rounded-full w-1/2"></div>
            <div className="bg-gray-700/50 h-4 rounded-full w-2/3"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!apodData) return null

  return (
    <motion.div whileHover={{ scale: 1.02, rotateY: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,165,0,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,69,0,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(255,140,0,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,165,0,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-0"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl backdrop-blur-sm border border-orange-500/20"
              >
                <Rocket className="w-6 h-6 text-orange-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Astronomy Picture of the Day
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{apodData.date}</span>
                  <div className="flex items-center gap-1 ml-2">
                    <Eye className="w-3 h-3" />
                    <span>{views}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            {apodData.media_type === "image" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl group"
              >
                <img
                  src={apodData.url || "/placeholder.svg"}
                  alt={apodData.title}
                  className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      liked ? "bg-red-500/80 text-white" : "bg-white/20 text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white"
                  >
                    <Share className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            <div>
              <motion.h4
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white font-bold text-lg mb-3 leading-tight"
              >
                {apodData.title}
              </motion.h4>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-sm leading-relaxed"
              >
                {apodData?.explanation &&(expanded? apodData.explanation: `${apodData.explanation.substring(0, 150)}...`)}
              </motion.p>
            </div>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  onClick={() => setExpanded(!expanded)}
                  variant="outline"
                  className="w-full bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 rounded-xl h-10"
                >
                  {expanded ? "Show Less" : "Read More"}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href={apodData.url} target="_blank">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30 text-orange-300 hover:from-orange-600/30 hover:to-red-600/30 rounded-xl h-10 px-4"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  NASA
                </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
