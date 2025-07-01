"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, Heart, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context" // your auth context

interface NewsArticle {
  id: string
  title: string
  summary: string
  url: string
  imageUrl: string
  publishedAt: string
  source: string
}

export function SpaceNews() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("favoriteArticles")
    if (stored) setFavorites(new Set(JSON.parse(stored)))
  }, [])

  useEffect(() => {
    localStorage.setItem("favoriteArticles", JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/")
        const data = await res.json()
        const articles: NewsArticle[] = data.results.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          summary: item.summary,
          url: item.url,
          imageUrl: item.image_url,
          publishedAt: item.published_at,
          source: item.news_site,
        }))
        setArticles(articles)
      } catch (error) {
        console.error("Failed to fetch articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

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

    const toggleFavorite = async (eventId: string, eventData: NewsArticle) => {
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase()) ||
      article.source.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Newspaper className="h-5 w-5 text-orange-400" />
          Latest Space News
        </CardTitle>
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full rounded bg-slate-700 border border-slate-600 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
        />
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-400 mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading space news...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No articles found.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                className="bg-slate-900/30 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="aspect-video bg-slate-700 relative">
                  <img
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/fallback-image.jpeg")}
                  />
                  <div className="absolute top-2 right-2">
                    <motion.div whileTap={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Toggle Favorite"
                        title="Toggle Favorite"
                        onClick={() => toggleFavorite(article.id, article)}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.has(article.id) ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-orange-500 text-orange-400">
                      {article.source}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(article.publishedAt)}
                    </div>
                  </div>

                  <h3 className="text-white font-semibold line-clamp-2">{article.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-3">{article.summary}</p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    onClick={() => window.open(article.url, "_blank")}
                  >
                    Read More
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
