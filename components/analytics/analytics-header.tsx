"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, CalendarIcon, Filter, Bell } from "lucide-react"
import { format } from "date-fns"

interface AnalyticsHeaderProps {
  onDateRangeChange: (range: { from: Date; to: Date }) => void
  onSearchChange: (query: string) => void
  onFilterChange: (filters: any) => void
}

export function AnalyticsHeader({ onDateRangeChange, onSearchChange, onFilterChange }: AnalyticsHeaderProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value)
    const now = new Date()
    let from: Date

    switch (value) {
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const newRange = { from, to: now }
    setDateRange(newRange)
    onDateRangeChange(newRange)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left side - Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search agencies, missions, satellites..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      const newRange = { from: range.from, to: range.to }
                      setDateRange(newRange)
                      onDateRangeChange(newRange)
                    }
                  }}
                  numberOfMonths={2}
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Right side - Live indicators and notifications */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Live Data</span>
              <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                Updated 2m ago
              </Badge>
            </div>

            <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              <Badge variant="secondary" className="ml-2 bg-red-600 text-white text-xs">
                3
              </Badge>
            </Button>

            <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
