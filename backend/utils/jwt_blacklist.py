# utils/jwt_blacklist.py
from pymongo import MongoClient
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
blacklist_collection = db["token_blacklist"]

def add_token_to_blacklist(jti, user_id):
    # Now datetime refers to the module, so datetime.datetime.utcnow() is correct
    # And timedelta is imported directly
    expires = datetime.utcnow() + timedelta(hours=1)
    blacklist_collection.insert_one({"jti": jti, "user_id": user_id, "expires": expires})

def is_token_blacklisted(jti):
    token = blacklist_collection.find_one({"jti": jti})
    # Now datetime refers to the module, so datetime.datetime.utcnow() is correct
    if token and token["expires"] > datetime.utcnow():
        return True
    return False

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
