from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from utils.auth_helpers import get_user_role
from bson.objectid import ObjectId # Needed for querying by user ID

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
# Define new collection for medical reports
medical_reports_collection = db["medical_reports"]
# MongoDB setup
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



@history_bp.route('/reports', methods=['POST'])
@jwt_required()
def upload_report():
    """
    Allows a user to upload (record) a new medical report, including Base64 PDF content.
    Expects report_name, report_date, and base64_file_content in the request body.
    """
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    report_name = data.get("report_name")
    report_date = data.get("report_date") # Expecting YYYY-MM-DD format
    base64_file_content = data.get("base64_file_content") # New field for Base64 content
    file_mime_type = data.get("file_mime_type") # e.g., "application/pdf"

    if not report_name or not report_date or not base64_file_content or not file_mime_type:
        return jsonify({"error": "Missing required fields: report_name, report_date, base64_file_content, file_mime_type"}), 400

    # Basic validation for Base64 prefix (e.g., "data:application/pdf;base64,")
    if not base64_file_content.startswith(f"data:{file_mime_type};base64,"):
        return jsonify({"error": "Invalid Base64 file format or MIME type mismatch"}), 400

    try:
        report_document = {
            "user_id": ObjectId(user_id),
            "report_name": report_name,
            "report_date": report_date,
            "base64_file_content": base64_file_content,
            "file_mime_type": file_mime_type,
            "uploaded_at": datetime.utcnow()  # <- FIXED LINE
        }

        medical_reports_collection.insert_one(report_document)
        return jsonify({"message": "Medical report uploaded successfully!"}), 201
    except Exception as e:
        print(f"Error uploading report: {e}")
        return jsonify({"error": "Failed to upload report", "details": str(e)}), 500

@history_bp.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    """
    Retrieves all medical reports for the logged-in user, sorted by date.
    Includes base64_file_content.
    """
    user_id = get_jwt_identity()

    try:
        reports_cursor = medical_reports_collection.find(
            {"user_id": ObjectId(user_id)}
        ).sort("report_date", -1)

        reports = []
        for report in reports_cursor:
            report['_id'] = str(report['_id'])
            report['user_id'] = str(report['user_id'])
            if 'uploaded_at' in report and isinstance(report['uploaded_at'], datetime):  # FIXED LINE
                report['uploaded_at'] = report['uploaded_at'].isoformat()
            reports.append(report)

        
        return jsonify({"reports": reports}), 200
    except Exception as e:
        print(f"Error fetching reports: {e}")
        return jsonify({"error": "Failed to fetch reports", "details": str(e)}), 500

@history_bp.route('/reports/<report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    """
    Deletes a specific medical report for the logged-in user.
    """
    user_id = get_jwt_identity()

    try:
        result = medical_reports_collection.delete_one({
            "_id": ObjectId(report_id),
            "user_id": ObjectId(user_id)
        })

        if result.deleted_count == 1:
            return jsonify({"message": "Medical report deleted successfully!"}), 200
        else:
            return jsonify({"error": "Report not found or unauthorized"}), 404
    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({"error": "Failed to delete report", "details": str(e)}), 500

