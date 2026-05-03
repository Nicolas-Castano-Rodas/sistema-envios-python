from app.ai.locations import cities
from app.ai.distance import haversine

def estimate_delivery_days(origin: str, destination: str):

    coord1 = cities.get(origin)
    coord2 = cities.get(destination)

    if not coord1 or not coord2:
        return 3  # fallback

    distance_km = haversine(coord1, coord2)

    # lógica realista:
    # cada 300 km ≈ 1 día
    days = distance_km / 300

    return round(days, 2)