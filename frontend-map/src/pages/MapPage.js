import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import truckImg from "../assets/truck.png";
import deliverySound from "../assets/delivery.mp3";

// ==============================
// FIX LEAFLET
// ==============================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ==============================
// ICONO CAMIÓN
// ==============================
const createTruckIcon = (angle) =>
  L.divIcon({
    html: `
      <img 
        src="${truckImg}" 
        style="
          width:60px;
          transform: rotate(${angle}deg);
          transition: transform 0.25s ease;
        " 
      />
    `,
    className: "",
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });

// ==============================
// CONTROL MAPA (SMART FOLLOW)
// ==============================
function MapController({ position }) {
  const map = useMap();
  const follow = useRef(true);

  useEffect(() => {
    const disable = () => (follow.current = false);

    map.on("dragstart", disable);
    map.on("zoomstart", disable);

    return () => {
      map.off("dragstart", disable);
      map.off("zoomstart", disable);
    };
  }, []);

  useEffect(() => {
    if (position && follow.current) {
      map.panTo(position, { animate: true });
    }
  }, [position]);

  return null;
}

function MapPage() {
  const { code } = useParams();

  const [fullRoute, setFullRoute] = useState([]); // 🗺️ ruta completa
  const [route, setRoute] = useState([]); // recorrido
  const [currentPosition, setCurrentPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(0);
  const [bearing, setBearing] = useState(0);

  const lastPosition = useRef(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);

  // ==============================
  // BEARING
  // ==============================
  const getBearing = (start, end) => {
    const lat1 = (start[0] * Math.PI) / 180;
    const lat2 = (end[0] * Math.PI) / 180;
    const dLon = ((end[1] - start[1]) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  // ==============================
  // VELOCIDAD REALISTA 🚦
  // ==============================
  const getDynamicDuration = () => {
    const base = 400;
    const traffic = Math.random() * 400; // variación
    return base + traffic;
  };

  // ==============================
  // ANIMACIÓN
  // ==============================
  const animateMovement = (start, end) => {
    if (!start) {
      setCurrentPosition(end);
      return;
    }

    const duration = getDynamicDuration();
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;

      setCurrentPosition([lat, lng]);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // ==============================
  // WEBSOCKET
  // ==============================
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/tracking/${code}`);
    audioRef.current = new Audio(deliverySound);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPos = data.position;

      if (!origin) setOrigin(data.origin);

      if (lastPosition.current) {
        setBearing(getBearing(lastPosition.current, newPos));
      }

      animateMovement(lastPosition.current, newPos);

      lastPosition.current = newPos;

      setRoute((prev) => [...prev, newPos]);
      setFullRoute(data.route || []);
      setDestination(data.destination);
      setProgress(data.progress);
      setEta(data.eta);

      if (data.delivered) {
        audioRef.current.play();
        alert("📦 Entregado");
      }
    };

    return () => {
      ws.close();
      cancelAnimationFrame(animationRef.current);
    };
  }, [code]);

  return (
    <>
      {/* UI PRO */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          background: "white",
          padding: "12px",
          borderRadius: "12px",
          zIndex: 999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h4>🚚 Envío {code}</h4>
        <p>📊 {progress.toFixed(1)}%</p>
        <p>⏱️ ETA: {(eta / 60).toFixed(1)} min</p>
      </div>

      <MapContainer center={[6.2, -75.5]} zoom={6} style={{ height: "100vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapController position={currentPosition} />

        {/* 🗺️ Ruta completa */}
        {fullRoute.length > 0 && (
          <Polyline positions={fullRoute} color="gray" />
        )}

        {/* 🚚 Ruta recorrida */}
        {route.length > 0 && (
          <Polyline positions={route} color="blue" />
        )}

        {/* 🚚 Camión */}
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={createTruckIcon(bearing)}
          />
        )}

        {/* 📍 Origen */}
        {origin && <Marker position={origin} />}

        {/* 📍 Destino */}
        {destination && <Marker position={destination} />}
      </MapContainer>
    </>
  );
}

export default MapPage;