import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
doctors_collection = db["doctors"]
doctor_consultations_collection = db["doctor_consultations"] # New collection for doctor-patient chats

doctors_bp = Blueprint('doctors', __name__, url_prefix='/api/doctors')

# --- Mock Data Insertion (Run once to populate your DB) ---
def insert_mock_doctors():
    if doctors_collection.count_documents({}) == 0:
        mock_doctors = [
            {
                "name": "Dr. Emily Smith",
                "specialty": "Cardiology",
                "rating": 4.8,
                "experience": 15,
                "availability": "Mon-Fri",
                "consultation_fee": 100,
                "avatar_url": "https://placehold.co/100x100/A8DADC/2C3E50?text=ES"
            },
            {
                "name": "Dr. John Davis",
                "specialty": "Dermatology",
                "rating": 4.5,
                "experience": 10,
                "availability": "Tue, Thu",
                "consultation_fee": 80,
                "avatar_url": "https://placehold.co/100x100/FFDDC1/8B4513?text=JD"
            },
            {
                "name": "Dr. Sarah Lee",
                "specialty": "Pediatrics",
                "rating": 4.9,
                "experience": 20,
                "availability": "Mon-Sat",
                "consultation_fee": 120,
                "avatar_url": "https://placehold.co/100x100/D4EDDA/155724?text=SL"
            },
            {
                "name": "Dr. Michael Brown",
                "specialty": "Neurology",
                "rating": 4.7,
                "experience": 12,
                "availability": "Wed, Fri",
                "consultation_fee": 110,
                "avatar_url": "https://placehold.co/100x100/C3B1E1/4A235A?text=MB"
            },
            {
                "name": "Dr. Jessica White",
                "specialty": "Orthopedics",
                "rating": 4.6,
                "experience": 8,
                "availability": "Mon-Fri",
                "consultation_fee": 90,
                "avatar_url": "https://placehold.co/100x100/F0F8FF/000080?text=JW"
            },
            {
                "name": "Dr. David Green",
                "specialty": "Ophthalmology",
                "rating": 4.7,
                "experience": 18,
                "availability": "Tue, Thu, Sat",
                "consultation_fee": 95,
                "avatar_url": "https://placehold.co/100x100/E0FFFF/008080?text=DG"
            },
            {
                "name": "Dr. Anya Sharma",
                "specialty": "Cardiology",
                "rating": 4.6,
                "experience": 10,
                "availability": "Mon, Wed, Fri",
                "consultation_fee": 105,
                "avatar_url": "https://placehold.co/100x100/F8C8DC/C71585?text=AS"
            },
            {
                "name": "Dr. Ben Carter",
                "specialty": "Dermatology",
                "rating": 4.4,
                "experience": 7,
                "availability": "Mon-Fri",
                "consultation_fee": 75,
                "avatar_url": "https://placehold.co/100x100/B0E0E6/4682B4?text=BC"
            },
        ]
        doctors_collection.insert_many(mock_doctors)
        print("Mock doctors inserted into the database.")

# Call this function when the blueprint is registered or app starts
# (It's safe to call multiple times, it only inserts if collection is empty)
insert_mock_doctors()

# --- Doctor Endpoints ---
@doctors_bp.route('/', methods=['GET'])
@jwt_required()
def get_doctors():
    """
    Retrieves a list of doctors, with optional filtering, searching, and sorting.
    Query parameters:
    - specialty: Filter by specialty (e.g., 'Cardiology')
    - search: Search by doctor name or specialty
    - sort_by: Field to sort by (e.g., 'rating', 'experience', 'name')
    - sort_order: 'asc' or 'desc' (default 'desc' for rating/experience, 'asc' for name)
    """
    user_id = get_jwt_identity() # Ensure user is authenticated

    query = {}
    specialty = request.args.get('specialty')
    search_query = request.args.get('search')
    sort_by = request.args.get('sort_by')
    sort_order = request.args.get('sort_order', 'desc') # Default to descending

    if specialty:
        query["specialty"] = specialty

    if search_query:
        # Case-insensitive search on name and specialty
        query["$or"] = [
            {"name": {"$regex": search_query, "$options": "i"}},
            {"specialty": {"$regex": search_query, "$options": "i"}}
        ]

    sort_criteria = []
    if sort_by:
        order = 1 if sort_order == 'asc' else -1
        sort_criteria.append((sort_by, order))
    else:
        # Default sorting if no sort_by is provided
        sort_criteria.append(("rating", -1)) # Sort by rating descending by default

    try:
        doctors_cursor = doctors_collection.find(query).sort(sort_criteria)
        
        doctors = []
        for doctor in doctors_cursor:
            doctor['_id'] = str(doctor['_id']) # Convert ObjectId to string
            doctors.append(doctor)
        
        return jsonify({"doctors": doctors}), 200
    except Exception as e:
        print(f"Error fetching doctors: {e}")
        return jsonify({"error": "Failed to fetch doctors", "details": str(e)}), 500

# --- Consultation Endpoints ---
@doctors_bp.route('/consultation/initiate', methods=['POST'])
@jwt_required()
def initiate_consultation():
    """
    Simulates payment and initiates a new consultation chat session.
    Expects doctor_id in the request body.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    doctor_id = data.get("doctor_id")

    if not doctor_id:
        return jsonify({"error": "Doctor ID is required"}), 400

    try:
        # Verify doctor exists
        doctor = doctors_collection.find_one({"_id": ObjectId(doctor_id)})
        if not doctor:
            return jsonify({"error": "Doctor not found"}), 404
        
        # --- Simulate Payment ---
        # In a real app, this would involve a payment gateway integration
        print(f"Simulating payment for user {user_id} with doctor {doctor['name']} (Fee: ${doctor['consultation_fee']})")
        # For now, payment is always "successful"

        # Create a new consultation record
        new_consultation = {
            "user_id": ObjectId(user_id),
            "doctor_id": ObjectId(doctor_id),
            "doctor_name": doctor["name"],
            "doctor_specialty": doctor["specialty"],
            "started_at": datetime.datetime.utcnow(),
            "status": "active",
            "messages": [
                {
                    "role": "model", # Doctor's initial message
                    "text": f"Hello, I'm Dr. {doctor['name'].split()[-1]}. How can I assist you today regarding your {doctor['specialty']} concerns?",
                    "timestamp": datetime.datetime.utcnow()
                }
            ]
        }
        result = doctor_consultations_collection.insert_one(new_consultation)
        
        # Return the consultation ID and initial message
        return jsonify({
            "message": "Consultation initiated successfully!",
            "consultation_id": str(result.inserted_id),
            "initial_messages": [
                {
                    "role": "model",
                    "text": new_consultation["messages"][0]["text"],
                    "timestamp": new_consultation["messages"][0]["timestamp"].isoformat()
                }
            ]
        }), 200
    except Exception as e:
        print(f"Error initiating consultation: {e}")
        return jsonify({"error": "Failed to initiate consultation", "details": str(e)}), 500

@doctors_bp.route('/consultation/<consultation_id>/message', methods=['POST'])
@jwt_required()
def add_consultation_message(consultation_id):
    """
    Adds a user message to an existing consultation and provides a mock doctor response.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    message_text = data.get("text")
    sender_role = data.get("role") # 'user' or 'doctor' (though only 'user' will be sent from frontend)

    if not message_text or not sender_role:
        return jsonify({"error": "Message text and sender role are required"}), 400

    try:
        consultation = doctor_consultations_collection.find_one({
            "_id": ObjectId(consultation_id),
            "user_id": ObjectId(user_id) # Ensure user owns this consultation
        })

        if not consultation:
            return jsonify({"error": "Consultation not found or unauthorized"}), 404

        # Add user message
        user_message = {
            "role": sender_role,
            "text": message_text,
            "timestamp": datetime.datetime.utcnow()
        }
        consultation['messages'].append(user_message)

        # Simulate doctor's response (simple mock for now)
        doctor_response_text = "Thank you for sharing. I'm reviewing your message and will get back to you shortly."
        if "headache" in message_text.lower():
            doctor_response_text = "Regarding your headache, please describe its frequency and severity. Have you noticed any triggers?"
        elif "sleep" in message_text.lower():
            doctor_response_text = "For sleep issues, can you tell me about your sleep routine and any recent changes in your lifestyle?"
        elif "pain" in message_text.lower():
            doctor_response_text = "Where exactly is the pain located, and how would you describe it? Is it constant or intermittent?"

        doctor_message = {
            "role": "model", # Using 'model' role for doctor responses to match AI chat structure
            "text": doctor_response_text,
            "timestamp": datetime.datetime.utcnow()
        }
        consultation['messages'].append(doctor_message)

        # Update database
        doctor_consultations_collection.update_one(
            {"_id": ObjectId(consultation_id)},
            {"$set": {"messages": consultation['messages']}}
        )

        # Return updated messages for frontend to display
        updated_messages = []
        for msg in consultation['messages']:
            msg['_id'] = str(msg.get('_id', '')) # Ensure _id is string if it exists
            if 'timestamp' in msg and isinstance(msg['timestamp'], datetime.datetime):
                msg['timestamp'] = msg['timestamp'].isoformat()
            updated_messages.append(msg)

        return jsonify({"messages": updated_messages}), 200
    except Exception as e:
        print(f"Error adding consultation message: {e}")
        return jsonify({"error": "Failed to add message", "details": str(e)}), 500

@doctors_bp.route('/consultation/<consultation_id>/messages', methods=['GET'])
@jwt_required()
def get_consultation_messages(consultation_id):
    """
    Retrieves all messages for a specific consultation.
    """
    user_id = get_jwt_identity()

    try:
        consultation = doctor_consultations_collection.find_one({
            "_id": ObjectId(consultation_id),
            "user_id": ObjectId(user_id)
        })

        if not consultation:
            return jsonify({"error": "Consultation not found or unauthorized"}), 404

        messages = []
        for msg in consultation.get('messages', []):
            msg['_id'] = str(msg.get('_id', '')) # Ensure _id is string if it exists
            if 'timestamp' in msg and isinstance(msg['timestamp'], datetime.datetime):
                msg['timestamp'] = msg['timestamp'].isoformat()
            messages.append(msg)

        return jsonify({"messages": messages}), 200
    except Exception as e:
        print(f"Error fetching consultation messages: {e}")
        return jsonify({"error": "Failed to fetch messages", "details": str(e)}), 500

@doctors_bp.route('/consultation/<consultation_id>', methods=['DELETE'])
@jwt_required()
def end_consultation(consultation_id):
    """
    Ends (deletes) a specific consultation.
    """
    user_id = get_jwt_identity()

    try:
        result = doctor_consultations_collection.delete_one({
            "_id": ObjectId(consultation_id),
            "user_id": ObjectId(user_id)
        })

        if result.deleted_count == 1:
            return jsonify({"message": "Consultation ended successfully!"}), 200
        else:
            return jsonify({"error": "Consultation not found or unauthorized"}), 404
    except Exception as e:
        print(f"Error ending consultation: {e}")
        return jsonify({"error": "Failed to end consultation", "details": str(e)}), 500

# In api/doctors.py
@doctors_bp.route('/<doctor_id>', methods=['GET'])
@jwt_required()
def get_doctor_by_id(doctor_id):
    """
    Retrieves a single doctor by their ID.
    """
    user_id = get_jwt_identity() # Ensure user is authenticated

    try:
        doctor = doctors_collection.find_one({"_id": ObjectId(doctor_id)})
        if not doctor:
            return jsonify({"error": "Doctor not found"}), 404
        
        doctor['_id'] = str(doctor['_id']) # Convert ObjectId to string
        return jsonify({"doctor": doctor}), 200
    except Exception as e:
        print(f"Error fetching doctor by ID: {e}")
        return jsonify({"error": "Failed to fetch doctor", "details": str(e)}), 500