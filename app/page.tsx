import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LiveStats } from "@/components/live-stats"
import { Navigation } from "@/components/navigation"
import Image from "next/image"
import SpaceBackground from "@/components/spacebg"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <Image
        src="/bg-image.png"
        alt="Background"
        fill
        priority
        style={{ objectFit: 'cover' }}
        className="z--2"
      />
      <SpaceBackground/>
      {/* Foreground content (above background) */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <LiveStats />
        <Features />
      </div>
    </div>
  )
}
