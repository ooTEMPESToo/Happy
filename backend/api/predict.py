import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId # Needed for querying by user ID

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
# Define new collection for health records
health_records_collection = db["health_records"]

predict_bp = Blueprint('predict', __name__, url_prefix='/api/predict')

# Example prediction route (keep your existing prediction logic here)
@predict_bp.route('/your-prediction-route', methods=['POST'])
@jwt_required()
def make_prediction():
    # Your existing prediction logic would go here
    # For now, just a placeholder response
    return jsonify({"message": "Prediction endpoint hit!", "result": "Example result"}), 200


@predict_bp.route('/health-check', methods=['POST'])
@jwt_required()
def submit_health_check():
    """
    Receives health check data from the user and saves it to the database.
    """
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Define expected fields and their types/defaults
    health_data = {
        "user_id": ObjectId(user_id), # Store as ObjectId for proper linking
        "timestamp": datetime.datetime.utcnow(),
        "total_cholesterol": data.get("total_cholesterol"),
        "hdl_cholesterol": data.get("hdl_cholesterol"),
        "ldl_cholesterol": data.get("ldl_cholesterol"),
        "blood_pressure": data.get("blood_pressure"),
        "weight": data.get("weight"),
        "height": data.get("height"),
        "diabetes_status": data.get("diabetes_status"),
        "injury_description": data.get("injury_description"),
        "injury_date": data.get("injury_date"), # Store as string, or convert to datetime if format is consistent
        "injury_severity": data.get("injury_severity"),
    }

    try:
        # Insert the new health record
        health_records_collection.insert_one(health_data)
        return jsonify({"message": "Health data saved successfully!"}), 201
    except Exception as e:
        print(f"Error saving health data: {e}")
        return jsonify({"error": "Failed to save health data", "details": str(e)}), 500


@predict_bp.route('/latest-health-check', methods=['GET'])
@jwt_required()
def get_latest_health_check():
    """
    Retrieves the most recent health check record for the logged-in user.
    """
    user_id = get_jwt_identity()

    try:
        # Find the latest health record for the user, sorted by timestamp descending
        latest_record = health_records_collection.find_one(
            {"user_id": ObjectId(user_id)},
            sort=[("timestamp", -1)] # Sort by timestamp descending
        )

        if latest_record:
            # Convert ObjectId to string for JSON serialization
            latest_record['_id'] = str(latest_record['_id'])
            latest_record['user_id'] = str(latest_record['user_id'])
            # Convert datetime objects to ISO format strings for JSON serialization
            if 'timestamp' in latest_record and isinstance(latest_record['timestamp'], datetime.datetime):
                latest_record['timestamp'] = latest_record['timestamp'].isoformat()
            
            return jsonify({"data": latest_record}), 200
        else:
            return jsonify({"message": "No health data found for this user"}), 404
    except Exception as e:
        print(f"Error fetching latest health data: {e}")
        return jsonify({"error": "Failed to fetch health data", "details": str(e)}), 500

