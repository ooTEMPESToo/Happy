from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from collections import Counter

from utils.auth_helpers import get_user_role

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
users_collection = db["users"]
prediction_collection = db["predictions"]

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# Helper to check admin role
def is_admin(user_id):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return user and user.get("role") == "admin"


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    user_id = get_jwt_identity()
    if get_user_role(user_id) != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    users = list(users_collection.find({}, {"password": 0}))
    for user in users:
        user["_id"] = str(user["_id"])
    return jsonify({"users": users}), 200


@admin_bp.route('/user/<user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    requester_id = get_jwt_identity()
    if not is_admin(requester_id):
        return jsonify({"error": "Unauthorized"}), 403

    user = users_collection.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404

    user["_id"] = str(user["_id"])
    return jsonify(user), 200


@admin_bp.route('/history/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user_history(user_id):
    requester_id = get_jwt_identity()
    if not is_admin(requester_id):
        return jsonify({"error": "Unauthorized"}), 403

    prediction_collection.delete_many({"user_id": user_id})
    return jsonify({"message": "User history deleted"}), 200


@admin_bp.route('/promote/<user_id>', methods=['PUT'])
@jwt_required()
def promote_user(user_id):
    requester_id = get_jwt_identity()
    if not is_admin(requester_id):
        return jsonify({"error": "Unauthorized"}), 403

    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"role": "admin"}}
    )
    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User promoted to admin"}), 200
@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def admin_analytics():
    requester_id = get_jwt_identity()
    if not is_admin(requester_id):
        return jsonify({"error": "Unauthorized"}), 403

    total_users = users_collection.count_documents({})
    total_admins = users_collection.count_documents({"role": "admin"})
    total_regular = users_collection.count_documents({"role": "user"})
    total_predictions = prediction_collection.count_documents({})

    # Most active users by prediction count
    pipeline = [
        {"$group": {"_id": "$user_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    top_users_cursor = list(prediction_collection.aggregate(pipeline))
    top_users = []
    for u in top_users_cursor:
        user = users_collection.find_one({"_id": ObjectId(u["_id"])})
        if user:
            top_users.append({
                "name": user["name"],
                "email": user["email"],
                "predictions": u["count"]
            })

    # Optional: Users registered in the last 7 days (bar chart data)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_users = users_collection.find({"created_at": {"$gte": seven_days_ago}})
    daily_counts = Counter(u["created_at"].strftime("%Y-%m-%d") for u in recent_users if "created_at" in u)

    return jsonify({
        "total_users": total_users,
        "total_admins": total_admins,
        "total_regular_users": total_regular,
        "total_predictions": total_predictions,
        "top_users": top_users,
        "registrations_last_7_days": daily_counts  # Optional frontend chart
    }), 200