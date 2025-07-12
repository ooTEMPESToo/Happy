from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.auth_helpers import get_user_role

load_dotenv()

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
prediction_collection = db["predictions"]

# Blueprint for history
history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_history():
    user_id = get_jwt_identity()
    if get_user_role(user_id) != "user":
        return jsonify({"error": "Only users can access history"}), 403

    history_cursor = prediction_collection.find({"user_id": user_id}, {"_id": 0})
    history = list(history_cursor)
    return jsonify({"history": history}), 200