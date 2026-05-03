import os
import requests

API_KEY = os.getenv("ORS_API_KEY")

# ==============================
# GEOCOORDENADAS
# ==============================
def get_coords(city: str):
    try:
        url = "https://api.openrouteservice.org/geocode/search"

        params = {
            "api_key": API_KEY,
            "text": city
        }

        res = requests.get(url, params=params)

        if res.status_code != 200:
            print("❌ GEO ERROR:", res.text)
            return None

        data = res.json()

        features = data.get("features")
        if not features:
            return None

        coords = features[0]["geometry"]["coordinates"]

        return [coords[1], coords[0]]

    except Exception as e:
        print("❌ ERROR GEO:", e)
        return None


# ==============================
# RUTA REAL
# ==============================
def get_route(start, end):
    try:
        url = "https://api.openrouteservice.org/v2/directions/driving-car"

        body = {
            "coordinates": [
                [start[1], start[0]],
                [end[1], end[0]]
            ]
        }

        headers = {
            "Authorization": API_KEY,
            "Content-Type": "application/json"
        }

        res = requests.post(url, json=body, headers=headers)

        if res.status_code != 200:
            print("❌ ROUTE ERROR:", res.text)
            return None

        data = res.json()

        if "routes" not in data:
            return None

        return data

    except Exception as e:
        print("❌ ERROR ROUTE:", e)
        return None