"use client"

import { motion } from "framer-motion"
import { Sparkles, Star, Zap } from "lucide-react"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 text-blue-400/30"
      >
        <Sparkles size={24} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, 10, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-40 right-20 text-purple-400/30"
      >
        <Star size={20} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-40 left-20 text-pink-400/30"
      >
        <Zap size={18} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 25, 0],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute bottom-20 right-10 text-cyan-400/30"
      >
        <Sparkles size={22} />
      </motion.div>
    </div>
  )
}
