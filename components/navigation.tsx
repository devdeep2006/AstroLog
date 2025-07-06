"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Satellite, User, Settings, Heart, LogOut, BarChart3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "./auth/auth-modal"

export function Navigation() {
  const { user, signOut } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Satellite className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">AstroLog</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href='/map'>
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Star Map
                  </Button>
                </Link>
                <Link href='/timemachine'>
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    <Heart className="h-4 w-4 mr-2" />
                    Time Travel
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <Link href="/profile">
                      <DropdownMenuItem className="text-slate-300 hover:text-white">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="text-slate-300 hover:text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-slate-300 hover:text-white">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  )
}
