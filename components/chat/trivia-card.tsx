"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, RefreshCw, Trophy, Lightbulb } from "lucide-react"

const triviaQuestions = [
  {
          question: `What is the largest planet in our solar system?`,
          answer: "Jupiter",
          category: "Planetary Science",
          difficulty: "Easy",
          color: "from-blue-500 to-cyan-500",
  },
  {
          question: `Which planet is known as the Red Planet due to its reddish appearance?`,
          answer: "Mars",
          category: "Planetary Science",
          difficulty: "Easy",
          color: "from-red-500 to-orange-500",
  },
  {
          question: `What is the name of the galaxy that contains our Solar System?`,
          answer: "Milky Way",
          category: "Astronomy",
          difficulty: "Medium",
          color: "from-purple-500 to-indigo-500",
  },
  {
          question: `Which space telescope, launched in 1990, has provided stunning images of distant galaxies?`,
          answer: "Hubble Space Telescope",
          category: "Space Exploration",
          difficulty: "Medium",
          color: "from-blue-600 to-teal-500",
  },
  {
          question: `What is the primary source of energy for Earth's climate system?`,
          answer: "Sun",
          category: "Astrophysics",
          difficulty: "Easy",
          color: "from-orange-500 to-yellow-500",
  },
  {
            question: `Which star is known as the brightest in the night sky?`,
            answer: "Sirius",
            category: "Astronomy",
            difficulty: "Hard",
            color: "from-yellow-500 to-amber-500",
  },
  {
          question: `What is the primary source of energy for Earth's climate system?`,
          answer: "Sun",
          category: "Astrophysics",
          difficulty: "Easy",
          color: "from-orange-500 to-yellow-500",
  },
  {
            question: `Which moon of Jupiter is known for its potential subsurface ocean?`,
            answer: "Europa",
            category: "Planetary Science",
            difficulty: "Hard",
            color: "from-cyan-500 to-blue-500",
  },
  {
          question: `What is the name of the first human-made object to leave the Solar System?`,
          answer: "Voyager 1",
          category: "Space Exploration",
          difficulty: "Medium",
          color: "from-gray-500 to-slate-500",
  }
]

export function TriviaCard() {
  const [currentTrivia, setCurrentTrivia] = useState(triviaQuestions[0])
  const [showAnswer, setShowAnswer] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [score, setScore] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const getRandomTrivia = () => {
    setIsRefreshing(true)
    setShowAnswer(false)
    setIsFlipped(false)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * triviaQuestions.length)
      setCurrentTrivia(triviaQuestions[randomIndex])
      setIsRefreshing(false)
    }, 600)
  }

  const handleShowAnswer = () => {
    setIsFlipped(true)
    setTimeout(() => {
      setShowAnswer(true)
      setScore((prev) => prev + 1)
    }, 300)
  }

  useEffect(() => {
    getRandomTrivia()
  }, [])

  return (
    <motion.div whileHover={{ scale: 1.02, rotateY: 2 }} transition={{ duration: 0.3 }}>
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-xl shadow-2xl p-6 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r ${currentTrivia.color} opacity-10 rounded-full blur-xl`}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className={`p-3 bg-gradient-to-r ${currentTrivia.color} bg-opacity-20 rounded-xl backdrop-blur-sm`}
              >
                <Brain className="w-6 h-6 text-purple-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Daily Trivia
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span
                    className={`px-2 py-1 rounded-full bg-gradient-to-r ${currentTrivia.color} bg-opacity-20 text-xs font-medium`}
                  >
                    {currentTrivia.category}
                  </span>
                  <span className="text-xs">{currentTrivia.difficulty}</span>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-bold">{score}</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={getRandomTrivia}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 rounded-xl"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            key={currentTrivia.question}
            initial={{ opacity: 0, rotateY: 0 }}
            animate={{ opacity: 1, rotateY: isFlipped ? 0 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="p-6 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-600/30"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <p className="text-gray-100 font-medium leading-relaxed">{currentTrivia.question}</p>
              </div>
            </motion.div>

            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`p-6 bg-gradient-to-r ${currentTrivia.color} bg-opacity-20 border border-green-500/30 rounded-2xl backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 0.6 }}
                      className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center"
                    >
                      <Trophy className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <div>
                      <p className="text-green-300 font-bold text-lg">Answer: {currentTrivia.answer}</p>
                      <p className="text-green-400/80 text-sm">Great job! 🎉</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleShowAnswer}
                disabled={showAnswer}
                className={`w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                  showAnswer
                    ? "bg-green-600 cursor-not-allowed"
                    : `bg-gradient-to-r ${currentTrivia.color} hover:shadow-xl hover:shadow-purple-500/25`
                }`}
              >
                {showAnswer ? "✓ Revealed!" : "Show Answer"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
