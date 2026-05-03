from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.config.db import db
from app.utils.maps import get_coords, get_route
import asyncio
import math
import random
import polyline
from datetime import datetime

router = APIRouter()

# ==============================
# MANAGER MULTIUSUARIO
# ==============================
class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, code: str, websocket: WebSocket):
        await websocket.accept()

        if code not in self.active_connections:
            self.active_connections[code] = []

        self.active_connections[code].append(websocket)

    def disconnect(self, code: str, websocket: WebSocket):
        if code in self.active_connections:
            if websocket in self.active_connections[code]:
                self.active_connections[code].remove(websocket)

    async def broadcast(self, code: str, data: dict):
        if code in self.active_connections:
            for connection in self.active_connections[code]:
                await connection.send_json(data)


manager = ConnectionManager()

# ==============================
# DISTANCIA (HAVERSINE)
# ==============================
def distance(a, b):
    R = 6371

    dlat = math.radians(b[0] - a[0])
    dlon = math.radians(b[1] - a[1])

    x = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(a[0]))
        * math.cos(math.radians(b[0]))
        * math.sin(dlon / 2) ** 2
    )

    return R * (2 * math.atan2(math.sqrt(x), math.sqrt(1 - x)))

# ==============================
# FALLBACK
# ==============================
def interpolate(start, end, steps=60):
    return [
        [
            start[0] + (end[0] - start[0]) * i / steps,
            start[1] + (end[1] - start[1]) * i / steps
        ]
        for i in range(steps + 1)
    ]

# ==============================
# EXTRAER RUTA REAL
# ==============================
def extract_route(route_data, origin, destination):
    try:
        geometry = route_data["routes"][0]["geometry"]

        # 🔥 polyline
        if isinstance(geometry, str):
            print("🔥 Decodificando polyline...")
            decoded = polyline.decode(geometry)
            return [[lat, lng] for lat, lng in decoded]

        # 🔥 dict
        elif isinstance(geometry, dict):
            coords = geometry.get("coordinates", [])
            return [[p[1], p[0]] for p in coords]

        # 🔥 lista
        elif isinstance(geometry, list):
            return [[p[1], p[0]] for p in geometry]

        else:
            print("⚠️ geometry desconocida → fallback")
            return interpolate(origin, destination)

    except Exception as e:
        print("❌ Error extrayendo geometría:", e)
        return interpolate(origin, destination)

# ==============================
# WEBSOCKET TRACKING
# ==============================
@router.websocket("/ws/tracking/{code}")
async def tracking_ws(websocket: WebSocket, code: str):
    await manager.connect(code, websocket)

    print(f"🟢 Cliente conectado: {code}")

    try:
        # =========================
        # 📦 BUSCAR O CREAR ENVÍO
        # =========================
        shipment = db.shipments.find_one({"code": code})

        if not shipment:
            print("⚠️ Shipment no encontrado, creando demo...")

            shipment = {
                "code": code,
                "origin": "Medellín",
                "destination": "Bogotá"
            }

            db.shipments.insert_one(shipment)

        print("📦 Shipment:", shipment)

        # =========================
        # 📍 COORDENADAS
        # =========================
        origin = get_coords(shipment["origin"] + ", Colombia")
        destination = get_coords(shipment["destination"] + ", Colombia")

        if not origin or not destination:
            print("❌ Error en coordenadas")
            await websocket.close()
            return

        # =========================
        # 🛣️ RUTA
        # =========================
        route_data = get_route(origin, destination)

        if not route_data:
            print("❌ route_data vacío")
            await websocket.close()
            return

        route = extract_route(route_data, origin, destination)

        print(f"🛣️ Total puntos ruta: {len(route)}")

        if len(route) < 2:
            print("❌ Ruta inválida")
            await websocket.close()
            return

        # =========================
        # 🚚 SIMULACIÓN
        # =========================
        speed = random.randint(40, 80)

        total_distance = sum(
            distance(route[i], route[i + 1])
            for i in range(len(route) - 1)
        )

        remaining_distance = total_distance

        for i, point in enumerate(route):

            if i > 0:
                remaining_distance -= distance(route[i - 1], route[i])

            eta = max((remaining_distance / speed) * 60, 0)
            progress = (i / (len(route) - 1)) * 100

            data = {
                "position": point,
                "route": route,
                "origin": origin,
                "destination": destination,
                "progress": progress,
                "eta": eta,
                "delivered": progress >= 100
            }

            # 💾 guardar historial
            db.tracking.insert_one({
                "code": code,
                "position": point,
                "timestamp": datetime.utcnow(),
                "progress": progress,
                "eta": eta
            })

            await manager.broadcast(code, data)

            await asyncio.sleep(0.5)

    except WebSocketDisconnect:
        manager.disconnect(code, websocket)
        print(f"🔴 Cliente desconectado: {code}")

    except Exception as e:
        print("❌ ERROR TRACKING:", e)