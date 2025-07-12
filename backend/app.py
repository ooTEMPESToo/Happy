from datetime import timedelta
import certifi
from flask import Flask, jsonify
from flask_cors import CORS # Keep this import
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_limiter.errors import RateLimitExceeded

# Import the limiter instance from extension.py
from extension import limiter 

# Import blueprint for OTP (if it exists)
from api.otp import otp_bp

# Load .env variables
load_dotenv()

app = Flask(__name__)

# --- IMPORTANT CORS CHANGE ---
# For development, use a more permissive CORS configuration to ensure preflight requests are handled.
# This allows requests from http://localhost:3000 to all routes.
CORS(app, origins="http://localhost:3000", supports_credentials=True)
# If you still face issues, you can try `CORS(app)` to allow all origins during development,
# but `origins="http://localhost:3000"` is more secure.

# Register the OTP blueprint (if it exists and is correctly defined)
app.register_blueprint(otp_bp)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

jwt = JWTManager(app)

# Import the function to check if a token is revoked
from utils.jwt_blacklist import is_token_revoked

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    """
    Callback function to check if a JWT token is revoked.
    This is used by Flask-JWT-Extended to determine if an access token
    should be allowed or blocked.
    """
    return is_token_revoked(jwt_payload)

# MongoDB setup
# Ensure your MONGO_URI environment variable is correctly set
from pymongo import MongoClient
client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["healthsync"]

# Initialize the limiter with the Flask app instance
limiter.init_app(app)

# Re-instantiate limiter with default limits (this might be redundant if extension.py already sets it up)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]  # default for all routes
)

# Register Blueprints for different API sections
from api.auth import auth_bp
from api.predict import predict_bp
from api.history import history_bp

app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(history_bp)

# Error handler for rate limit exceeded
@app.errorhandler(RateLimitExceeded)
def ratelimit_handler(e):
    """
    Custom error handler for when a client exceeds the defined rate limits.
    Returns a JSON response with a 429 status code.
    """
    return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429

# Basic home route to check if the backend is running
@app.route('/')
def home():
    """
    A simple home route to confirm the backend server is operational.
    """
    return {"status": "Backend is running ✅"}

if __name__ == '__main__':
    # Run the Flask application in debug mode (for development)
    app.run(debug=True)

