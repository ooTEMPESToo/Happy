from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
import smtplib
import ssl
import random
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
otp_collection = db["otp"]

otp_bp = Blueprint("otp", __name__, url_prefix="/api/auth")

# Generate 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Send OTP email
def send_email(to_email, otp):
    context = ssl.create_default_context()
    message = f"""Subject: HealthSync Email Verification\n\nYour OTP is: {otp}"""
    
    with smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT"))) as server:
        server.starttls(context=context)
        server.login(os.getenv("EMAIL_ADDRESS"), os.getenv("EMAIL_PASSWORD"))
        server.sendmail(os.getenv("EMAIL_ADDRESS"), to_email, message)

# Route: Send OTP
@otp_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    otp = generate_otp()
    send_email(email, otp)

    # Save OTP with timestamp
    otp_collection.update_one(
        {'email': email},
        {'$set': {'otp': otp, 'timestamp': datetime.utcnow()}},
        upsert=True
    )
    return jsonify({'message': 'OTP sent successfully'}), 200

# Route: Verify OTP
@otp_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    record = otp_collection.find_one({'email': email})
    if not record or record['otp'] != otp:
        return jsonify({'error': 'Invalid OTP'}), 400

    # Check if OTP is expired (5 minutes)
    if datetime.utcnow() - record['timestamp'] > timedelta(minutes=5):
        return jsonify({'error': 'OTP expired'}), 400

    # OTP verified, optionally delete it
    otp_collection.delete_one({'email': email})
    return jsonify({'message': 'OTP verified'}), 200
