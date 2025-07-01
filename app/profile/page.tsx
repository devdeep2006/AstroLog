import { UserProfile } from "@/components/auth/user-profile"
import { Navigation } from "@/components/navigation"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">👨‍🚀 User Profile</h1>
            <p className="text-xl text-slate-300">Manage your preferences, notifications, and favorites</p>
          </div>
          <UserProfile />
        </div>
      </main>
    </div>
  )
}
