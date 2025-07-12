from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
users_collection = db["users"]

def get_user_role(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return user.get("role") if user else None
