# utils/jwt_blacklist.py
from pymongo import MongoClient
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
blacklist_collection = db["token_blacklist"]

def add_token_to_blacklist(jti, user_id):
    blacklist_collection.insert_one({
        "jti": jti,
        "user_id": user_id,
        "blacklisted_at": datetime.utcnow()
    })

def is_token_revoked(jwt_payload):
    jti = jwt_payload["jti"]
    token = blacklist_collection.find_one({"jti": jti})
    return token is not None  # ✅ If token found in blacklist, it's revoked
