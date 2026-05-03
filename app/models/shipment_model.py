def shipment_serializer(shipment) -> dict:
    return {
        "id": str(shipment["_id"]),
        "code": shipment["code"],
        "origin": shipment["origin"],
        "destination": shipment["destination"],
        "status": shipment["status"]
    }