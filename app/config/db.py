from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI:
    raise Exception("❌ MONGO_URI no está configurado")

client = MongoClient(MONGO_URI)

db = client[DB_NAME]

print(f"✅ Conectado a MongoDB: {DB_NAME}")