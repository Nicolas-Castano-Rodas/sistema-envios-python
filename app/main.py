from fastapi import FastAPI
from app.routes import shipment_routes
from app.config.db import db
from app.auth import auth_routes
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tracking_ws
from app.routes.shipments import router as shipments_router
from app.routes import shipments


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:3000"],  # desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(shipment_routes.router)
app.include_router(auth_routes.router)
app.include_router(tracking_ws.router)

@app.get("/")
def root():
    return {"message": "Conectado a MongoDB 🚀"}

@app.get("/test-db")
def test_db():
    return {"collections": db.list_collection_names()}

app.include_router(shipments.router, prefix="/api")