# 🚚 Sistema de Tracking de Envíos en Tiempo Real (Tipo Uber)

Plataforma full stack para seguimiento de envíos en tiempo real con visualización en mapa, simulación de rutas reales y comunicación en vivo mediante WebSockets.

---

## 🚀 Demo del Proyecto

📍 Visualización en mapa tipo Uber
🚚 Movimiento en tiempo real del vehículo
📦 Notificación de entrega
📊 Progreso y ETA dinámico

---

## 🧠 Tecnologías Utilizadas

### Backend

* FastAPI
* WebSockets (tiempo real)
* MongoDB
* OpenRouteService API (rutas reales)
* Polyline (decodificación de rutas)

### Frontend

* React
* React Leaflet (mapas)
* WebSocket client
* TailwindCSS (UI moderna)

---

## ⚙️ Funcionalidades Principales

✅ Tracking en tiempo real
✅ Simulación tipo Uber (movimiento progresivo)
✅ Cálculo de ETA dinámico
✅ Ruta real desde API externa
✅ Fallback inteligente (si falla la API)
✅ Rotación del vehículo según dirección
✅ Animación suave del recorrido
✅ Notificación al entregar
✅ Guardado de historial en MongoDB

---

## 🧭 Arquitectura

```
Frontend (React)
   ↓ WebSocket
Backend (FastAPI)
   ↓
MongoDB
   ↓
OpenRouteService API
```

---

## 📁 Estructura del Proyecto

```
app/
 ├── routes/
 │    └── tracking_ws.py
 ├── utils/
 │    └── maps.py
 ├── config/
 │    └── db.py
 └── main.py

frontend/
 ├── src/
 │    ├── pages/
 │    │    └── MapPage.js
 │    ├── assets/
 │    │    ├── truck.png
 │    │    └── delivery.mp3
 │    └── components/
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` en backend:

```
ORS_API_KEY=tu_api_key_aqui
MONGO_URI=mongodb://localhost:27017
```

---

## ▶️ Instalación

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🌍 Endpoint WebSocket

```
ws://localhost:8000/ws/tracking/{code}
```

Ejemplo:

```
ws://localhost:8000/ws/tracking/ENV-001
```

---

## 📦 Ejemplo de Datos en Tiempo Real

```json
{
  "position": [6.2442, -75.5812],
  "progress": 45.3,
  "eta": 32.5,
  "destination": [4.7110, -74.0721],
  "delivered": false
}
```

---

## 🎯 Objetivo del Proyecto

Simular un sistema real de logística tipo:

* Uber
* Rappi
* DHL Tracking

Aplicando conceptos de:

* Sistemas en tiempo real
* Geolocalización
* Arquitectura full stack moderna

---

## 📸 Próximas mejoras

* 🔥 Multi-vehículos (tipo flota)
* 📊 Dashboard analytics
* 🔔 Notificaciones push
* 🌐 Deploy en producción

---

## 👨‍💻 Autor

**Nicolás Castaño Rodas**
Desarrollador Full Stack
**Contacto**: [rodascastanonicolas@gmail.com](mailto:rodascastanonicolas@gmail.com)  
**GitHub**: [@Nicolas-Castano-Rodas](https://github.com/Nicolas-Castano-Rodas)

---

## ⭐ Si te gusta el proyecto

Dale estrella ⭐ en GitHub y compártelo 🚀
