import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import truckImg from "../assets/truck.png";

// 🚚 icono
const createTruckIcon = () =>
  L.divIcon({
    html: `<img src="${truckImg}" style="width:40px;" />`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

// 🎯 centrar
function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 10, { duration: 1.2 });
    }
  }, [position]);

  return null;
}

function MapPage() {
  const [shipments, setShipments] = useState([]);
  const [routes, setRoutes] = useState({});
  const [selected, setSelected] = useState(null);

  // =============================
  // 📦 CARGAR DESDE DASHBOARD
  // =============================
  useEffect(() => {
    axios
      .get("http://localhost:8000/shipments/active")
      .then((res) => {
        setShipments(res.data.shipments);

        res.data.shipments.forEach((s) => {
          connectWS(s.code);
        });
      })
      .catch(console.error);
  }, []);

  // =============================
  // 🔌 WEBSOCKET
  // =============================
  const connectWS = (code) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/tracking/${code}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setRoutes((prev) => ({
        ...prev,
        [code]: {
          ...data,
        },
      }));
    };
  };

  // =============================
  // 🎨 COLORES PRO
  // =============================
  const getColor = (code) => {
    if (selected === code) return "#22c55e"; // verde activo
    return "#64748b"; // gris otros
  };

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🗺️ MAPA */}
      <MapContainer
        center={[6.2, -75.5]}
        zoom={6}
        style={{ height: "100vh" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Object.entries(routes).map(([code, data]) => (
          <div key={code}>
            {/* 🛣️ ruta */}
            {data.route && (
              <Polyline
                positions={data.route}
                pathOptions={{
                  color: getColor(code),
                  weight: selected === code ? 5 : 2,
                }}
              />
            )}

            {/* 🚚 camion */}
            {data.position && (
              <Marker
                position={data.position}
                icon={createTruckIcon()}
              />
            )}
          </div>
        ))}

        {/* 🎯 focus */}
        {selected && routes[selected]?.position && (
          <MapController position={routes[selected].position} />
        )}
      </MapContainer>

      {/* 📦 PANEL DERECHO */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "300px",
          height: "100vh",
          background: "#020617",
          color: "white",
          padding: "15px",
          overflowY: "auto",
        }}
      >
        <h3>🚚 Flota en tiempo real</h3>

        {shipments.map((s) => {
          const data = routes[s.code];

          return (
            <div
              key={s.code}
              onClick={() => setSelected(s.code)}
              style={{
                padding: "10px",
                margin: "10px 0",
                cursor: "pointer",
                borderRadius: "10px",
                background:
                  selected === s.code ? "#22c55e" : "#1e293b",
              }}
            >
              <strong>{s.code}</strong>

              <p>📍 {s.origin} → {s.destination}</p>

              {data && (
                <>
                  <p>📊 {data.progress?.toFixed(1)}%</p>
                  <p>⏱️ {(data.eta / 60)?.toFixed(1)} min</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MapPage;