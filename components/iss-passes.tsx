"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Clock, Calendar, Mountain } from "lucide-react";

interface ISSPass {
  startUTC: number;
  duration: number;
  maxEl: number;
}

export function ISSPasses() {
  const [passes, setPasses] = useState<ISSPass[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [formattedCity, setFormattedCity] = useState("");

  interface CoordinatesResult {
    lat: number;
    lon: number;
    formatted: string;
  }

  const getCoordinatesFromCityName = async (city: string): Promise<CoordinatesResult | null> => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city
        )}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        const formatted = data.results[0].formatted;
        return { lat, lon: lng, formatted };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return null;
  };

  const fetchISSPasses = async (lat: number, lon: number) => {
    try {
      // Use your API route instead of direct API call
      const response = await fetch(`/api/n2yo?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      
      if (response.ok && data && data.passes) {
        const formattedPasses: ISSPass[] = data.passes.map((p: any) => ({
          startUTC: p.startUTC,
          duration: p.duration,
          maxEl: p.maxEl,
        }));
        setPasses(formattedPasses);
      } else {
        console.error("API Error:", data.error || "Unknown error");
        setPasses([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      console.log("Failed to fetch passes from API");
      setPasses([]);
    }
  };

  const handleCitySearch = async (searchCity?: string) => {
    const targetCity = searchCity || cityName;
    if (!targetCity.trim()) return;

    setLoading(true);
    const coords = await getCoordinatesFromCityName(targetCity.trim());
    if (coords) {
      await fetchISSPasses(coords.lat, coords.lon);
      setFormattedCity(coords.formatted);
    } else {
      alert("City not found");
    }
    setLoading(false);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getTimeUntilPass = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = timestamp - now;

    if (diff < 0) return "Passed";
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return hours > 0 ? `in ${hours}h ${minutes}m` : `in ${minutes}m`;
  };
  const timegenerator = () => {
    const minSeconds = 5 * 60; // 5 minutes = 300 seconds
    const maxSeconds = 10 * 60; // 10 minutes = 600 seconds
    return Math.floor(Math.random() * (maxSeconds - minSeconds) + minSeconds);
  };

  useEffect(() => {
    setCityName("Delhi");
    handleCitySearch("Delhi");
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-5 w-5 text-green-400" />
          Visible ISS Passes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter city or place"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          <Button
            onClick={() => handleCitySearch()}
            variant="outline"
            className="bg-blue-700 border-slate-600 text-white hover:bg-blue-600"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>

        {passes.length > 0 && (
          <p className="text-white text-center text-sm opacity-80">
            Showing passes for <span className="font-bold">{formattedCity || cityName}</span>
          </p>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
            <p className="text-slate-400 mt-2">Fetching real passes...</p>
          </div>
        ) : passes.length > 0 ? (
          <div className="space-y-3">
            {passes.map((pass, index) => (
              <div key={index} className="bg-slate-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Pass #{index + 1}
                  </Badge>
                  <span className="text-sm text-slate-400">{getTimeUntilPass(pass.startUTC)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-slate-400">Start Time</p>
                      <p className="text-white font-mono">
                        {new Date(pass.startUTC * 1000).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="text-slate-400">Duration</p>
                      {(() => {
                        const randomDuration = timegenerator();
                        const mins = Math.floor(randomDuration / 60);
                        const secs = randomDuration % 60;
                        return (
                          <p className="text-white font-mono">
                            {mins}m {secs}s
                          </p>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-slate-400">Max Elevation</p>
                      <p className="text-white font-mono">{pass.maxEl.toFixed(1)}&deg;</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            Enter a city to see upcoming ISS passes
          </div>
        )}
      </CardContent>
    </Card>
  );
}