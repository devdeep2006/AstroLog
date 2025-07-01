"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Sphere, Ring, Torus, Box, Cylinder } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Skull,
  Rocket,
  Home,
  CompassIcon as Comet,
  Infinity,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Star,
  Dna,
  Leaf,
  Users,
  Telescope,
  Satellite,
  Maximize,
  Minimize,
} from "lucide-react"
import type * as THREE from "three"

// Expanded cosmic events data with many more events
const cosmicEvents = [
  {
    id: 1,
    year: -13800000000,
    title: "The Big Bang",
    description:
      "The universe begins in an infinitely hot, dense point and rapidly expands, creating space, time, and all matter.",
    icon: Zap,
    color: "#ff6b6b",
    scene: "bigbang",
    fact: "In the first second, the universe expanded faster than the speed of light!",
    particles: 2000,
    intensity: 1.5,
    audio: "cosmic-explosion.mp3",
  },
  {
    id: 2,
    year: -13600000000,
    title: "First Stars Form",
    description: "The universe's first stars ignite, ending the cosmic dark age and beginning to forge heavy elements.",
    icon: Star,
    color: "#ffd93d",
    scene: "firststars",
    fact: "These first stars were 100 times more massive than our Sun and lived only a few million years!",
    particles: 1800,
    intensity: 1.3,
    audio: "stellar-birth.mp3",
  },
  {
    id: 3,
    year: -13200000000,
    title: "Milky Way Forms",
    description: "Our galaxy begins to take shape through the merger of smaller galaxies and dark matter halos.",
    icon: Star,
    color: "#9b59b6",
    scene: "galaxy",
    fact: "The Milky Way contains over 100 billion stars and is still growing by consuming smaller galaxies!",
    particles: 1500,
    intensity: 1.1,
    audio: "galactic-formation.mp3",
  },
  {
    id: 4,
    year: -4500000000,
    title: "Earth Forms",
    description:
      "Our planet coalesces from cosmic dust and debris, beginning its 4.5-billion-year journey to support life.",
    icon: Globe,
    color: "#4ecdc4",
    scene: "earth",
    fact: "Early Earth was a molten hellscape bombarded by asteroids for millions of years.",
    particles: 800,
    intensity: 0.8,
    audio: "planetary-formation.mp3",
  },
  {
    id: 5,
    year: -3800000000,
    title: "First Life on Earth",
    description: "Simple single-celled organisms emerge in Earth's primordial oceans, marking the beginning of life.",
    icon: Dna,
    color: "#2ecc71",
    scene: "firstlife",
    fact: "These first life forms were anaerobic bacteria that could survive without oxygen!",
    particles: 600,
    intensity: 0.7,
    audio: "life-emergence.mp3",
  },
  {
    id: 6,
    year: -2400000000,
    title: "Great Oxidation Event",
    description:
      "Cyanobacteria begin producing oxygen, fundamentally changing Earth's atmosphere and enabling complex life.",
    icon: Leaf,
    color: "#27ae60",
    scene: "oxidation",
    fact: "This event was actually toxic to most existing life forms - it was Earth's first mass extinction!",
    particles: 700,
    intensity: 0.9,
    audio: "atmospheric-change.mp3",
  },
  {
    id: 7,
    year: -540000000,
    title: "Cambrian Explosion",
    description: "Complex multicellular life rapidly diversifies, creating most major animal groups we see today.",
    icon: Dna,
    color: "#e74c3c",
    scene: "cambrian",
    fact: "In just 25 million years, life went from simple to incredibly complex with eyes, shells, and predators!",
    particles: 900,
    intensity: 1.0,
    audio: "evolution-burst.mp3",
  },
  {
    id: 8,
    year: -65000000,
    title: "Asteroid Impact",
    description:
      "A massive asteroid strikes Earth, ending the age of dinosaurs and paving the way for mammals to thrive.",
    icon: Skull,
    color: "#45b7d1",
    scene: "asteroid",
    fact: "The asteroid was about 6 miles wide and created a crater 93 miles across!",
    particles: 1500,
    intensity: 1.2,
    audio: "asteroid-impact.mp3",
  },
  {
    id: 9,
    year: -300000,
    title: "Modern Humans Emerge",
    description: "Homo sapiens evolve in Africa, developing language, tools, and the capacity for abstract thought.",
    icon: Users,
    color: "#f39c12",
    scene: "humans",
    fact: "All humans today descended from a population of just 1,000-10,000 individuals in Africa!",
    particles: 400,
    intensity: 0.6,
    audio: "human-evolution.mp3",
  },
  {
    id: 10,
    year: -10000,
    title: "Agricultural Revolution",
    description: "Humans begin farming, leading to permanent settlements, population growth, and civilization.",
    icon: Leaf,
    color: "#8e44ad",
    scene: "agriculture",
    fact: "Agriculture developed independently in at least 7 different regions around the world!",
    particles: 300,
    intensity: 0.5,
    audio: "civilization-dawn.mp3",
  },
  {
    id: 11,
    year: 1969,
    title: "Apollo 11 Moon Landing",
    description: "Humanity takes its first steps on another celestial body, marking a new era of space exploration.",
    icon: Rocket,
    color: "#f9ca24",
    scene: "apollo",
    fact: "Neil Armstrong's first step was watched by an estimated 650 million people worldwide.",
    particles: 500,
    intensity: 0.6,
    audio: "moon-landing.mp3",
  },
  {
    id: 12,
    year: 1990,
    title: "Hubble Space Telescope",
    description: "The Hubble Space Telescope launches, revolutionizing our understanding of the universe.",
    icon: Telescope,
    color: "#3498db",
    scene: "hubble",
    fact: "Hubble has made over 1.5 million observations and traveled more than 4 billion miles!",
    particles: 400,
    intensity: 0.7,
    audio: "space-discovery.mp3",
  },
  {
    id: 13,
    year: 2021,
    title: "James Webb Space Telescope",
    description: "The most powerful space telescope ever built begins observing the earliest galaxies and exoplanets.",
    icon: Telescope,
    color: "#e67e22",
    scene: "webb",
    fact: "Webb can see galaxies that formed just 400 million years after the Big Bang!",
    particles: 600,
    intensity: 0.8,
    audio: "deep-space.mp3",
  },
  {
    id: 14,
    year: 2025,
    title: "Artemis III Mission",
    description:
      "NASA returns humans to the Moon for the first time since 1972, including the first woman on the lunar surface.",
    icon: Rocket,
    color: "#6c5ce7",
    scene: "artemis",
    fact: "Artemis III will land near the Moon's south pole to search for water ice.",
    particles: 600,
    intensity: 0.7,
    audio: "lunar-return.mp3",
  },
  {
    id: 15,
    year: 2030,
    title: "Europa Clipper Mission",
    description: "NASA's spacecraft arrives at Jupiter's moon Europa to study its subsurface ocean for signs of life.",
    icon: Satellite,
    color: "#00cec9",
    scene: "europa",
    fact: "Europa's ocean contains twice as much water as all of Earth's oceans combined!",
    particles: 500,
    intensity: 0.8,
    audio: "ocean-world.mp3",
  },
  {
    id: 16,
    year: 2040,
    title: "First Mars Base",
    description: "Humanity establishes its first permanent settlement on Mars, becoming a multi-planetary species.",
    icon: Home,
    color: "#e17055",
    scene: "mars",
    fact: "A Mars base could house 100+ people and be self-sustaining within a decade.",
    particles: 700,
    intensity: 0.9,
    audio: "mars-colony.mp3",
  },
  {
    id: 17,
    year: 2122,
    title: "Halley's Comet Returns",
    description: "The famous comet makes its next close approach to Earth, visible to the naked eye once again.",
    icon: Comet,
    color: "#00b894",
    scene: "comet",
    fact: "Halley's Comet has been observed and recorded by humans for over 2,000 years.",
    particles: 1000,
    intensity: 1.0,
    audio: "comet-approach.mp3",
  },
  {
    id: 18,
    year: 4500000000,
    title: "Andromeda Collision",
    description:
      "The Andromeda Galaxy collides with the Milky Way, creating a new elliptical galaxy called 'Milkomeda'.",
    icon: Star,
    color: "#fd79a8",
    scene: "collision",
    fact: "Despite the collision, the chance of our solar system being affected is extremely small!",
    particles: 2000,
    intensity: 1.4,
    audio: "galactic-collision.mp3",
  },
  {
    id: 19,
    year: 5000000000,
    title: "Sun Becomes Red Giant",
    description: "Our Sun exhausts its hydrogen fuel and expands into a red giant, potentially engulfing Earth.",
    icon: Star,
    color: "#ff7675",
    scene: "redgiant",
    fact: "The Sun will expand to 200 times its current size, reaching beyond Mars' orbit!",
    particles: 1800,
    intensity: 1.3,
    audio: "stellar-death.mp3",
  },
  {
    id: 20,
    year: 1e100,
    title: "Heat Death of Universe",
    description:
      "The universe reaches maximum entropy. Stars have died, black holes evaporate, and only elementary particles remain.",
    icon: Infinity,
    color: "#2d3436",
    scene: "heatdeath",
    fact: "This is so far in the future that 10^100 years is longer than the age of the universe by 10^90 times!",
    particles: 100,
    intensity: 0.1,
    audio: "cosmic-silence.mp3",
  },
]

// Enhanced 3D Components (keeping existing ones and adding new scenes)
function FloatingParticles({ count, color, speed = 1 }: { count: number; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Points>(null)
  const particlesPosition = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * 50
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 50
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 50
  }

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.05
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlesPosition, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.1} transparent opacity={0.6} />
    </points>
  )
}

function AnimatedPlanet({
  position,
  color,
  size,
  rotationSpeed,
}: { position: [number, number, number]; color: string; size: number; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.2} />
      <Ring args={[size * 1.5, size * 1.8, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </Ring>
    </mesh>
  )
}

function CosmicPhenomena({ type, position }: { type: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {type === "blackhole" && (
        <>
          <Sphere args={[0.5, 32, 32]}>
            <meshBasicMaterial color="#000000" />
          </Sphere>
          <Torus args={[1, 0.1, 16, 100]}>
            <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
          </Torus>
          <Torus args={[1.5, 0.05, 16, 100]}>
            <meshBasicMaterial color="#ffa500" transparent opacity={0.6} />
          </Torus>
        </>
      )}
      {type === "pulsar" && (
        <>
          <Sphere args={[0.3, 32, 32]}>
            <meshBasicMaterial color="#00ffff" />
          </Sphere>
          <Cylinder args={[0.05, 0.05, 10, 8]} rotation={[0, 0, Math.PI / 2]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 10, 8]} rotation={[0, 0, -Math.PI / 2]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
          </Cylinder>
        </>
      )}
      {type === "nebula" && (
        <>
          <Sphere args={[2, 32, 32]}>
            <meshBasicMaterial color="#9b59b6" transparent opacity={0.3} />
          </Sphere>
          <FloatingParticles count={200} color="#9b59b6" speed={0.5} />
        </>
      )}
      {type === "galaxy" && (
        <>
          <Torus args={[3, 0.5, 16, 100]}>
            <meshBasicMaterial color="#9b59b6" transparent opacity={0.6} />
          </Torus>
          <Torus args={[2, 0.3, 16, 100]}>
            <meshBasicMaterial color="#ffd93d" transparent opacity={0.8} />
          </Torus>
          <FloatingParticles count={1000} color="#ffffff" speed={0.3} />
        </>
      )}
    </group>
  )
}

function Spacecraft({ type, position }: { type: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {type === "apollo" && (
        <>
          <Cylinder args={[0.3, 0.5, 2, 8]}>
            <meshStandardMaterial color="#c0c0c0" />
          </Cylinder>
          <Sphere args={[0.4, 16, 16]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </Sphere>
        </>
      )}
      {type === "artemis" && (
        <>
          <Box args={[0.8, 1.5, 0.8]}>
            <meshStandardMaterial color="#6c5ce7" />
          </Box>
          <Cylinder args={[0.2, 0.2, 0.5, 8]} position={[0, -1, 0]}>
            <meshStandardMaterial color="#ff6b6b" />
          </Cylinder>
        </>
      )}
      {type === "telescope" && (
        <>
          <Cylinder args={[0.4, 0.4, 3, 8]}>
            <meshStandardMaterial color="#2c3e50" />
          </Cylinder>
          <Box args={[2, 0.1, 2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#f39c12" />
          </Box>
        </>
      )}
    </group>
  )
}

function EnhancedCosmicBackground({ scene, intensity }: { scene: string; intensity: number }) {
  const starsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.05
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  const getSceneElements = () => {
    switch (scene) {
      case "bigbang":
        return (
          <>
            <FloatingParticles count={2000} color="#ff6b6b" speed={2} />
            <CosmicPhenomena type="pulsar" position={[0, 0, 0]} />
            <pointLight position={[0, 0, 0]} intensity={intensity} color="#ff6b6b" />
          </>
        )
      case "firststars":
        return (
          <>
            <FloatingParticles count={1800} color="#ffd93d" speed={1.5} />
            <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
              <meshBasicMaterial color="#ffd93d" />
            </Sphere>
            <pointLight position={[0, 0, 0]} intensity={intensity} color="#ffd93d" />
          </>
        )
      case "galaxy":
        return (
          <>
            <CosmicPhenomena type="galaxy" position={[0, 0, 0]} />
            <pointLight position={[5, 5, 5]} intensity={intensity} color="#9b59b6" />
          </>
        )
      case "earth":
        return (
          <>
            <AnimatedPlanet position={[0, 0, 0]} color="#4ecdc4" size={1.5} rotationSpeed={0.5} />
            <FloatingParticles count={800} color="#4ecdc4" speed={0.5} />
            <pointLight position={[5, 5, 5]} intensity={intensity} color="#4ecdc4" />
          </>
        )
      case "firstlife":
        return (
          <>
            <AnimatedPlanet position={[0, 0, 0]} color="#2ecc71" size={1.3} rotationSpeed={0.3} />
            <FloatingParticles count={600} color="#2ecc71" speed={0.4} />
            <pointLight position={[5, 5, 5]} intensity={intensity} color="#2ecc71" />
          </>
        )
      case "asteroid":
        return (
          <>
            <AnimatedPlanet position={[-2, 0, 0]} color="#4ecdc4" size={1.2} rotationSpeed={0.3} />
            <Box args={[0.5, 0.8, 0.6]} position={[2, 1, -1]}>
              <meshStandardMaterial color="#8b4513" roughness={1} />
            </Box>
            <FloatingParticles count={1500} color="#ff4757" speed={1.5} />
            <pointLight position={[0, 0, 0]} intensity={intensity} color="#ff4757" />
          </>
        )
      case "apollo":
        return (
          <>
            <AnimatedPlanet position={[-3, 0, 0]} color="#cccccc" size={1} rotationSpeed={0.1} />
            <Spacecraft type="apollo" position={[0, 0, 0]} />
            <FloatingParticles count={500} color="#f9ca24" speed={0.3} />
            <pointLight position={[10, 10, 10]} intensity={intensity} color="#f9ca24" />
          </>
        )
      case "hubble":
      case "webb":
        return (
          <>
            <Spacecraft type="telescope" position={[0, 0, 0]} />
            <FloatingParticles count={600} color="#3498db" speed={0.4} />
            <pointLight position={[8, 8, 8]} intensity={intensity} color="#3498db" />
          </>
        )
      case "artemis":
        return (
          <>
            <AnimatedPlanet position={[-3, 0, 0]} color="#cccccc" size={1} rotationSpeed={0.1} />
            <Spacecraft type="artemis" position={[0, 0, 0]} />
            <FloatingParticles count={600} color="#6c5ce7" speed={0.4} />
            <pointLight position={[10, 10, 10]} intensity={intensity} color="#6c5ce7" />
          </>
        )
      case "mars":
        return (
          <>
            <AnimatedPlanet position={[0, 0, 0]} color="#e17055" size={1.2} rotationSpeed={0.4} />
            <Box args={[0.3, 0.2, 0.3]} position={[1.8, -1, 0]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <FloatingParticles count={700} color="#e17055" speed={0.6} />
            <pointLight position={[8, 8, 8]} intensity={intensity} color="#e17055" />
          </>
        )
      case "comet":
        return (
          <>
            <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Cylinder args={[0.1, 0.5, 8, 8]} position={[-4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshBasicMaterial color="#00b894" transparent opacity={0.7} />
            </Cylinder>
            <FloatingParticles count={1000} color="#00b894" speed={1} />
            <pointLight position={[5, 5, 5]} intensity={intensity} color="#00b894" />
          </>
        )
      case "collision":
        return (
          <>
            <CosmicPhenomena type="galaxy" position={[-2, 0, 0]} />
            <CosmicPhenomena type="galaxy" position={[2, 0, 0]} />
            <FloatingParticles count={2000} color="#fd79a8" speed={1.2} />
            <pointLight position={[0, 0, 0]} intensity={intensity} color="#fd79a8" />
          </>
        )
      case "redgiant":
        return (
          <>
            <Sphere args={[3, 32, 32]} position={[0, 0, 0]}>
              <meshBasicMaterial color="#ff7675" transparent opacity={0.8} />
            </Sphere>
            <FloatingParticles count={1800} color="#ff7675" speed={0.8} />
            <pointLight position={[0, 0, 0]} intensity={intensity} color="#ff7675" />
          </>
        )
      case "heatdeath":
        return (
          <>
            <CosmicPhenomena type="blackhole" position={[0, 0, 0]} />
            <FloatingParticles count={100} color="#2d3436" speed={0.1} />
            <pointLight position={[10, 10, 10]} intensity={intensity * 0.5} color="#2d3436" />
          </>
        )
      default:
        return (
          <>
            <CosmicPhenomena type="nebula" position={[3, 2, -2]} />
            <CosmicPhenomena type="pulsar" position={[-3, -2, 2]} />
            <FloatingParticles count={1000} color="#ffffff" speed={0.5} />
          </>
        )
    }
  }

  return (
    <>
      <Stars ref={starsRef} radius={300} depth={60} count={2000} factor={7} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      {getSceneElements()}
    </>
  )
}

// Interactive Time Control Component
function TimeController({
  currentEventIndex,
  onEventChange,
  isPlaying,
  onPlayPause,
  onReset,
}: {
  currentEventIndex: number
  onEventChange: (index: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  onReset: () => void
}) {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-lg px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className=" bg-black/90 border-white/30 backdrop-blur-md shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-sm mb-2">Time Travel Controller</h3>
            <Badge variant="secondary" className="bg-white/10 text-white">
              Event {currentEventIndex + 1} of {cosmicEvents.length}
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-6 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              className="hover:bg-white/10 transition-all duration-200 hover:scale-110"
              title="Reset to Big Bang"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={onPlayPause}
              className="hover:bg-white/10 transition-all duration-200 hover:scale-110 px-6"
              style={{ backgroundColor: isPlaying ? "#ff6b6b20" : "#4ecdc420" }}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause Journey
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Journey
                </>
              )}
            </Button>

            <div className="text-center">
              <div className="text-xs text-gray-400">Speed</div>
              <div className="text-sm font-semibold text-white">4s/event</div>
            </div>
          </div>

          <div className="space-y-2">
            <Slider
              value={[currentEventIndex]}
              onValueChange={(value) => onEventChange(value[0])}
              max={cosmicEvents.length - 1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Big Bang</span>
              <span>Heat Death</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Floating Cosmic Facts

// Interactive Cosmic Map - Cleaner design


// Enhanced Zoom Controls with audio and fullscreen
function ZoomControls({
  zoom,
  onZoomChange,
  isAudioEnabled,
  onAudioToggle,
  isFullscreen,
  onFullscreenToggle,
}: {
  zoom: number
  onZoomChange: (zoom: number) => void
  isAudioEnabled: boolean
  onAudioToggle: () => void
  isFullscreen: boolean
  onFullscreenToggle: () => void
}) {
  return (
    <motion.div
      className="fixed top-4 right-4 z-20 flex flex-col gap-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onZoomChange(Math.max(0.5, zoom - 0.2))}
        className="bg-black/80 border-white/20 hover:bg-white/10"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onZoomChange(Math.min(2, zoom + 0.2))}
        className="bg-black/80 border-white/20 hover:bg-white/10"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onAudioToggle}
        className="bg-black/80 border-white/20 hover:bg-white/10"
      >
        {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFullscreenToggle}
        className="bg-black/80 border-white/20 hover:bg-white/10"
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
      <div className="text-xs text-center text-gray-400 mt-1">{zoom.toFixed(1)}x</div>
    </motion.div>
  )
}

function formatYear(year: number): string {
  if (year < 0) {
    const absYear = Math.abs(year)
    if (absYear >= 1000000000) {
      return `${(absYear / 1000000000).toFixed(1)}B years ago`
    } else if (absYear >= 1000000) {
      return `${(absYear / 1000000).toFixed(0)}M years ago`
    } else if (absYear >= 1000) {
      return `${(absYear / 1000).toFixed(0)}K years ago`
    }
    return `${absYear} years ago`
  } else if (year > 1000000000000) {
    return `10^${Math.log10(year).toFixed(0)} years from now`
  } else if (year > 2100) {
    return `${year} CE (Future)`
  }
  return `${year} CE`
}

export default function Component() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof cosmicEvents)[0] | null>(null)
  const [currentScene, setCurrentScene] = useState("default")
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentEventIndex((prev) => (prev + 1) % cosmicEvents.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  // Update scene when event changes
  useEffect(() => {
    const currentEvent = cosmicEvents[currentEventIndex]
    setCurrentScene(currentEvent.scene)
  }, [currentEventIndex])

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Audio functionality
  const playEventAudio = (audioFile: string) => {
    if (isAudioEnabled) {
      // Simulate audio playback
      toast({
        title: "🎵 Playing Cosmic Audio",
        description: `Now playing: ${audioFile}`,
      })
    }
  }

  // Share functionality
  const shareEvent = (event: (typeof cosmicEvents)[0]) => {
    const shareText = `🌠 ${event.title} (${formatYear(event.year)})\n\n${event.description}\n\n🧠 Cosmic Fact: ${event.fact}\n\n#CosmicTimeMachine #SpaceHistory`

    if (navigator.share) {
      navigator.share({
        title: `Cosmic Time Machine - ${event.title}`,
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "📤 Event Shared!",
        description: "Event details copied to clipboard",
      })
    }
  }

  // Download functionality
  const downloadEventData = (event: (typeof cosmicEvents)[0]) => {
    const eventData = {
      title: event.title,
      year: event.year,
      formattedYear: formatYear(event.year),
      description: event.description,
      fact: event.fact,
      particles: event.particles,
      intensity: event.intensity,
      scene: event.scene,
      color: event.color,
    }

    const dataStr = JSON.stringify(eventData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cosmic-event-${event.title.replace(/\s+/g, "-").toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "📥 Event Downloaded!",
      description: `${event.title} data saved as JSON`,
    })
  }

  const scrollToEvent = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleEventSelect = (eventId: number) => {
    const event = cosmicEvents.find((e) => e.id === eventId)
    if (event) {
      setSelectedEvent(event)
      setCurrentScene(event.scene)
      setCurrentEventIndex(cosmicEvents.findIndex((e) => e.id === eventId))
      if (isAudioEnabled) {
        playEventAudio(event.audio)
      }
    }
  }

  const handleReset = () => {
    setCurrentEventIndex(0)
    setIsPlaying(false)
    setZoom(1)
    toast({
      title: "🔄 Timeline Reset",
      description: "Returned to the Big Bang!",
    })
  }

  const currentEvent = cosmicEvents[currentEventIndex]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Enhanced 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5 * zoom], fov: 75 }}>
          <EnhancedCosmicBackground scene={currentScene} intensity={currentEvent?.intensity || 1} />
        </Canvas>
      </div>

      {/* UI Components with proper positioning */}

      {/* Enhanced Header */}
      <div className="relative z-10 pt-8 pb-4 px-4 text-center py-5">
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          🌠 Cosmic Time Machine
        </motion.h1>
        <motion.p
          className="text-base md:text-lg lg:text-xl text-gray-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Journey through 13.8 billion years of cosmic history
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Badge variant="secondary" className="bg-white/10 text-white text-xs sm:text-sm">
            Currently viewing: {currentEvent?.title}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs sm:text-sm"
            style={{ borderColor: currentEvent?.color, color: currentEvent?.color }}
          >
            {formatYear(currentEvent?.year || 0)}
          </Badge>
        </motion.div>
      </div>

      {/* Enhanced Timeline */}
      <div className="relative z-10 px-4 pb-40">
        {/* Timeline Navigation */}
        <div className="flex items-center justify-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToEvent("left")}
            className="mr-4 bg-black/80 border-white/20 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Badge variant="secondary" className="bg-white/10 text-white text-xs sm:text-sm">
            Scroll to explore {cosmicEvents.length} cosmic events
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToEvent("right")}
            className="ml-4 bg-black/80 border-white/20 hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide my-25"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
            }}
          >
            {cosmicEvents.map((event, index) => {
              const Icon = event.icon
              const isActive = index === currentEventIndex
              return (
                <motion.div
                  key={event.id}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`w-72 md:w-80 bg-black/60 border-white/20 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 cursor-pointer group ${
                      isActive ? "ring-2 ring-white/50 bg-black/70" : ""
                    }`}
                    onClick={() => {
                      setSelectedEvent(event)
                      setCurrentScene(event.scene)
                      setCurrentEventIndex(index)
                      if (isAudioEnabled) {
                        playEventAudio(event.audio)
                      }
                    }}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          className="p-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${event.color}20`, border: `2px solid ${event.color}` }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: event.color }} />
                        </motion.div>
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                          style={{ borderColor: event.color, color: event.color }}
                        >
                          {formatYear(event.year)}
                        </Badge>
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white flex-shrink-0"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: 100, repeatType: "loop" }}
                          />
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to explore →
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 rounded-full bg-white/30"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, delay: i * 0.2, repeat: 100, repeatType: "loop" }}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Time Controller */}
      <TimeController
        currentEventIndex={currentEventIndex}
        onEventChange={setCurrentEventIndex}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
      />
      

      {/* Enhanced Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-black/95 border border-white/20 rounded-2xl p-4 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-md"
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid justify-between items-start mb-6">
                <div className="flex items-center gap-3 flex-1">
                  <motion.div
                    className="p-2 md:p-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${selectedEvent.color}20`, border: `2px solid ${selectedEvent.color}` }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: 100, repeatType: "loop", ease: "linear" }}
                  >
                    <selectedEvent.icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: selectedEvent.color }} />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl md:text-3xl font-bold mb-1 break-words">{selectedEvent.title}</h2>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: selectedEvent.color, color: selectedEvent.color }}
                    >
                      {formatYear(selectedEvent.year)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedEvent(null)}
                  className="hover:bg-white/10 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">{selectedEvent.description}</p>

              <motion.div
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-blue-400 font-semibold mb-2">🧠 Cosmic Fact</h3>
                <p className="text-gray-300 text-sm md:text-base">{selectedEvent.fact}</p>
              </motion.div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-xl md:text-2xl mb-1">⭐</div>
                  <div className="text-xs text-gray-400">Particles</div>
                  <div className="text-sm font-semibold">{selectedEvent.particles}</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-xl md:text-2xl mb-1">💫</div>
                  <div className="text-xs text-gray-400">Intensity</div>
                  <div className="text-sm font-semibold">{selectedEvent.intensity}x</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-xl md:text-2xl mb-1">🌌</div>
                  <div className="text-xs text-gray-400">Scene</div>
                  <div className="text-sm font-semibold capitalize">{selectedEvent.scene}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1"
                  style={{ backgroundColor: selectedEvent.color }}
                  onClick={() => {
                    setCurrentScene(selectedEvent.scene)
                    if (isAudioEnabled) {
                      playEventAudio(selectedEvent.audio)
                    }
                  }}
                >
                  🔭 View in 3D
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 bg-transparent"
                  onClick={() => shareEvent(selectedEvent)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 bg-transparent"
                  onClick={() => downloadEventData(selectedEvent)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
