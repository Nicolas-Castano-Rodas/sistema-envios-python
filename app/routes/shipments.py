from fastapi import APIRouter
from app.config.db import db
import random

router = APIRouter()

# 📦 CREAR ENVÍO
@router.post("/shipments")
def create_shipment(data: dict):
    code = f"ENV-{random.randint(100,999)}"

    shipment = {
        "code": code,
        "origin": data["origin"],
        "destination": data["destination"],
        "status": "En camino"
    }

    db.shipments.insert_one(shipment)

    return shipment


# 📦 LISTAR ENVÍOS
@router.get("/shipments")
def get_shipments():
    shipments = list(db.shipments.find({}, {"_id": 0}))
    return shipments

@router.delete("/shipments/{code}")
def delete_shipment(code: str):
    result = db.shipments.delete_one({"code": code})

    if result.deleted_count == 0:
        return {"message": "No encontrado"}

    return {"message": "Eliminado"}