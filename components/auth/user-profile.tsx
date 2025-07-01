"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Bell, Heart, Save, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

interface Profile {
  full_name: string | null
  location: string | null
  timezone: string | null
}

interface NotificationSettings {
  iss_pass: { enabled: boolean; advance_minutes: number }
  space_event: { enabled: boolean; advance_hours: number }
  space_weather: { enabled: boolean; severity_threshold: string }
  news: { enabled: boolean; frequency: string }
}

interface Favorite {
  id: string
  item_type: string
  item_id: string
  item_data: any
  created_at: string
}

export function UserProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    location: "",
    timezone: "UTC",
  })
  const [notifications, setNotifications] = useState<NotificationSettings>({
    iss_pass: { enabled: true, advance_minutes: 30 },
    space_event: { enabled: true, advance_hours: 24 },
    space_weather: { enabled: false, severity_threshold: "moderate" },
    news: { enabled: false, frequency: "daily" },
  })
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchNotificationSettings()
      fetchFavorites()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, location, timezone")
        .eq("id", user?.id)
        .single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setProfile(data)
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message)
    }
  }

  const fetchNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_notifications")
        .select("type, enabled, settings")
        .eq("user_id", user?.id)

      if (error) throw error

      const notificationMap: any = {}
      data?.forEach((item) => {
        notificationMap[item.type] = {
          enabled: item.enabled,
          ...item.settings,
        }
      })

      setNotifications((prev) => ({ ...prev, ...notificationMap }))
    } catch (error: any) {
      console.error("Error fetching notifications:", error.message)
    }
  }

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setFavorites(data || [])
    } catch (error: any) {
      console.error("Error fetching favorites:", error.message)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        ...profile,
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateNotificationSettings = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const updates = Object.entries(notifications).map(([type, settings]) => ({
        user_id: user?.id,
        type,
        enabled: settings.enabled,
        settings: { ...settings, enabled: undefined },
      }))
      const { error } = await supabase
        .from("user_notifications")
        .upsert(updates, { onConflict: 'user_id,type' }) // composite key


      if (error) throw error

      setMessage({
        type: "success",
        text: "Notification settings updated!",
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase.from("user_favorites").delete().eq("id", favoriteId)

      if (error) throw error

      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId))
    } catch (error: any) {
      console.error("Error removing favorite:", error.message)
    }
  }

  const getFavoriteIcon = (type: string) => {
    switch (type) {
      case "event":
        return "🚀"
      case "satellite":
        return "🛰️"
      case "news":
        return "📰"
      default:
        return "⭐"
    }
  }

  if (!user) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <p className="text-slate-400">Please sign in to view your profile.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-blue-400" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-slate-600">
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-600">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-slate-600">
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ""}
                    disabled
                    className="bg-slate-700 border-slate-600 text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location || ""}
                    onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone || ""}
                    onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="UTC"
                  />
                </div>
              </div>

              <Button onClick={updateProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">ISS Pass Notifications</h4>
                    <p className="text-slate-400 text-sm">Get notified when ISS passes over your location</p>
                  </div>
                  <Switch
                    checked={notifications.iss_pass.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        iss_pass: { ...prev.iss_pass, enabled: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Space Event Alerts</h4>
                    <p className="text-slate-400 text-sm">Notifications for launches, spacewalks, and missions</p>
                  </div>
                  <Switch
                    checked={notifications.space_event.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        space_event: { ...prev.space_event, enabled: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Space Weather Warnings</h4>
                    <p className="text-slate-400 text-sm">Alerts for solar storms and space weather events</p>
                  </div>
                  <Switch
                    checked={notifications.space_weather.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        space_weather: { ...prev.space_weather, enabled: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Space News Digest</h4>
                    <p className="text-slate-400 text-sm">Daily or weekly space news summaries</p>
                  </div>
                  <Switch
                    checked={notifications.news.enabled}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        news: { ...prev.news, enabled: checked },
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={updateNotificationSettings}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Bell className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4 mt-6">
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFavoriteIcon(favorite.item_type)}</span>
                        <div>
                          <h4 className="text-white font-medium">
                            {favorite.item_data?.title ||
                              favorite.item_data?.name ||
                              `${favorite.item_type} #${favorite.item_id}`}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              {favorite.item_type}
                            </Badge>
                            <span className="text-slate-500 text-xs">
                              Added {new Date(favorite.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No favorites yet</p>
                  <p className="text-slate-500 text-sm">
                    Start favoriting space events, satellites, and news articles!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {message && (
            <Alert className={`mt-4 ${message.type === "error" ? "border-red-500" : "border-green-500"}`}>
              <AlertDescription className={message.type === "error" ? "text-red-400" : "text-green-400"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
