"use client"

import { useEffect, useRef } from "react"
import Globe from "globe.gl"

export function RealisticSolarSystem() {
  const globeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const globe = new Globe(globeRef.current!)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")
      .showAtmosphere(true)
      .atmosphereColor("#3fa9f5")
      .atmosphereAltitude(0.25)
      .pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0)

    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.5

    const resizeGlobe = () => {
      if (globeRef.current) {
        globe.width(globeRef.current.offsetWidth)
        globe.height(globeRef.current.offsetHeight)
      }
    }

    resizeGlobe()
    window.addEventListener("resize", resizeGlobe)

    return () => window.removeEventListener("resize", resizeGlobe)
  }, [])

  return <div ref={globeRef} className=" px-15 w-169 h-175 " />
}