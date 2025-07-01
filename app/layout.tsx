import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AstroLog - ISS Tracker & Space News",
  description: "Track the International Space Station in real-time and stay updated with the latest space news",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark`}>
          <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
