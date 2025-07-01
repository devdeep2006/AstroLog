"use client"

import { motion } from "framer-motion"
import { Chatbot } from "@/components/chat/chatbot"
import { TriviaCard } from "@/components/chat/trivia-card"
import { ApodCard } from "@/components/chat/apo-card"
import { ParticleBackground } from "@/components/chat/particle-background"
import { FloatingElements } from "@/components/chat/floating-background"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 text-white relative overflow-hidden">
      <ParticleBackground />
      <FloatingElements />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Explore, Learn, and Discover</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Chatbot Section */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <Chatbot />
          </motion.div>

          {/* Side Components */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            <TriviaCard />
            <ApodCard />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
