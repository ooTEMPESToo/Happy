import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv
from email_validator import validate_email, EmailNotValidError
from utils.jwt_blacklist import add_token_to_blacklist
from bson.objectid import ObjectId

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
users_collection = db["users"]

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # 'profile_image_url' is now an optional field, so remove it from required_fields
    required_fields = ['email', 'password', 'name', 'age', 'gender', 'history']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    email = data['email']
    
    try:
        valid = validate_email(email)
        email = valid.email
    except EmailNotValidError as e:
        return jsonify({'error': str(e)}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user = {
        'email': email,
        'password': hashed_pw,
        'name': data['name'],
        'age': data['age'],
        'gender': data['gender'],
        'history': data['history'],
        "role": "user",
        "created_at": datetime.datetime.utcnow()
    }

    # NEW: Conditionally add profile_image_url if provided in the request data
    # Ensure the key matches what the frontend sends
    if 'profile_image_url' in data and data['profile_image_url']:
        user['profile_image_url'] = data['profile_image_url']
    
    users_collection.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'email': data['email']})
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=str(user['_id']))
    return jsonify({'token': token, 'user': {'name': user['name'], 'email': user['email']}}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    user_id = get_jwt_identity()
    add_token_to_blacklist(jti, user_id)
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    """
    Retrieves the user's profile information.
    Requires a valid JWT access token.
    Returns user details like name, email, age, gender, history, and profile_image_url.
    """
    current_user_id = get_jwt_identity()
    
    try:
        user = users_collection.find_one(
            {'_id': ObjectId(current_user_id)},
            {'password': 0} # Exclude password
        )
        
        if user:
            # Convert ObjectId to string for JSON serialization
            for key, value in user.items():
                if isinstance(value, ObjectId):
                    user[key] = str(value)
            
            return jsonify({'user': user}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Invalid user ID or database error: {str(e)}'}), 500

