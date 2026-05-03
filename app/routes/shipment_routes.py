from fastapi import APIRouter
from app.config.db import db
import random
import string
from datetime import datetime
from bson import ObjectId
from app.ai.prediction import estimate_delivery_days

router = APIRouter()

def generate_code():
    return "ENV-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))

@router.post("/shipments")
def create_shipment(data: dict):
    shipment = {
        "code": generate_code(),
        "origin": data["origin"],
        "destination": data["destination"],
        "status": "pendiente",
        "history": [
            {
                "status": "pendiente",
                "date": datetime.utcnow()
            }
        ]
    }

    result = db.shipments.insert_one(shipment)

    return {
        "id": str(result.inserted_id),
        "code": shipment["code"]
    }


@router.get("/shipments")
def get_shipments():
    shipments = []
    for s in db.shipments.find():
        shipments.append({
            "id": str(s["_id"]),
            "code": s["code"],
            "origin": s["origin"],
            "destination": s["destination"],
            "status": s["status"]
        })
    return shipments


@router.post("/shipments")
def create_shipment(data: dict):
    shipment = {
        "code": generate_code(),
        "origin": data["origin"],
        "destination": data["destination"],
        "status": "pendiente",
        "history": [
            {
                "status": "pendiente",
                "date": datetime.utcnow()
            }
        ]
    }

    result = db.shipments.insert_one(shipment)

    return {
        "id": str(result.inserted_id),
        "code": shipment["code"]
    }


@router.get("/shipments")
def get_shipments():
    return list(db.shipments.find())


@router.put("/shipments/{id}/status")
def update_status(id: str, status: str):

    shipment = db.shipments.find_one({"_id": ObjectId(id)})

    if not shipment:
        return {"error": "No encontrado"}

    db.shipments.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {"status": status},
            "$push": {
                "history": {
                    "status": status,
                    "date": datetime.utcnow()
                }
            }
        }
    )

    return {"message": "Estado actualizado"}



@router.get("/tracking/{code}")
def track_shipment(code: str):
    shipment = db.shipments.find_one({"code": code})

    if not shipment:
        return {"error": "No encontrado"}

    return {
        "code": shipment.get("code"),
        "origin": shipment.get("origin"),
        "destination": shipment.get("destination"),
        "status": shipment.get("status", "pendiente"),
        "history": shipment.get("history", [])  # 🔥 evita crash
    }