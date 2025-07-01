"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

type Props = {
  position: {
    latitude: number;
    longitude: number;
  };
};

const issIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg",
  iconSize: [40, 40],
  className: "drop-shadow-md",
});

function AnimateISS({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      animate: true,
      duration: 1.2,
    });
  }, [lat, lng, map]);

  return null;
}

export default function ISSTrackerLeaflet({ position }: Props) {
  const lat = Number(position.latitude);
  const lng = Number(position.longitude);

  const trailRef = useRef<[number, number][]>([]);
  const [trail, setTrail] = useState<[number, number][]>([]);

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const currentPos: [number, number] = [lat, lng];
    trailRef.current.push(currentPos);
    if (trailRef.current.length > 50) {
      trailRef.current.shift();
    }
    setTrail([...trailRef.current]);
  }, [lat, lng]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/60 backdrop-blur-sm">
      <MapContainer
        center={[lat, lng]}
        zoom={3}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution="&copy; Carto"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]} icon={issIcon}>
          <Popup>🚀 ISS Current Location</Popup>
        </Marker>
        <Polyline
          positions={trail}
          pathOptions={{ color: "#00ffff", weight: 2 }}
        />
        <AnimateISS lat={lat} lng={lng} />
      </MapContainer>

      {/* Collapsible overlay */}
      <div
        className="absolute top-4 right-4 bg-black/70 text-white rounded-lg shadow z-10 backdrop-blur-sm cursor-pointer select-none transition-all duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Always-visible header */}
        <div className="flex items-center justify-between px-4 py-2">
          <p className="font-semibold">🛰 ISS Info</p>
          <span className="text-sm">{expanded ? "▲" : "▼"}</span>
        </div>

        {/* Expandable content */}
        {expanded && (
          <div className="px-4 pb-3 space-y-1 text-sm text-gray-200">
            <p>
              <span className="text-gray-300">Current Time (UTC):</span>{" "}
              {new Date().toUTCString()}
            </p>
            <p>
              <span className="text-gray-300">Estimated Speed:</span> ~7.66
              km/s
            </p>
            <p>
              <span className="text-gray-300">Altitude:</span> ~420 km
            </p>
            <p className="text-xs text-gray-400 italic pt-1">
              “Orbiting Earth every ~90 minutes”
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
