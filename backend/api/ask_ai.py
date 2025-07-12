import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
import requests # For making HTTP requests to Gemini API

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["healthsync"]
ai_conversations_collection = db["ai_conversations"] # New collection for AI chats

ask_ai_bp = Blueprint('ask_ai', __name__, url_prefix='/api/ai')

# Gemini API configuration (will be provided by Canvas runtime or user's env)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "") # Fallback to empty string
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

@ask_ai_bp.route('/conversations', methods=['POST'])
@jwt_required()
def create_conversation():
    """
    Creates a new AI conversation for the logged-in user.
    Optionally takes a 'title' in the request body.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get("title", f"New Chat - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")

    try:
        new_conversation = {
            "user_id": ObjectId(user_id),
            "title": title,
            "created_at": datetime.datetime.utcnow(),
            "messages": [] # Stores chat messages
        }
        result = ai_conversations_collection.insert_one(new_conversation)
        return jsonify({
            "message": "Conversation created",
            "conversation_id": str(result.inserted_id),
            "title": title,
            "created_at": new_conversation["created_at"].isoformat()
        }), 201
    except Exception as e:
        print(f"Error creating conversation: {e}")
        return jsonify({"error": "Failed to create conversation", "details": str(e)}), 500

@ask_ai_bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_all_conversations():
    """
    Retrieves a list of all conversations for the logged-in user.
    """
    user_id = get_jwt_identity()

    try:
        conversations_cursor = ai_conversations_collection.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1) # Sort by most recent

        conversations = []
        for conv in conversations_cursor:
            conversations.append({
                "_id": str(conv["_id"]),
                "title": conv["title"],
                "created_at": conv["created_at"].isoformat()
            })
        return jsonify({"conversations": conversations}), 200
    except Exception as e:
        print(f"Error fetching conversations: {e}")
        return jsonify({"error": "Failed to fetch conversations", "details": str(e)}), 500

@ask_ai_bp.route('/conversations/<conversation_id>', methods=['GET'])
@jwt_required()
def get_conversation_by_id(conversation_id):
    """
    Retrieves a specific conversation by its ID for the logged-in user.
    """
    user_id = get_jwt_identity()

    try:
        conversation = ai_conversations_collection.find_one({
            "_id": ObjectId(conversation_id),
            "user_id": ObjectId(user_id)
        })

        if conversation:
            # Convert ObjectId and datetime for JSON serialization
            conversation['_id'] = str(conversation['_id'])
            conversation['user_id'] = str(conversation['user_id'])
            conversation['created_at'] = conversation['created_at'].isoformat()
            # Ensure messages are also properly formatted if they contain non-string types
            for msg in conversation['messages']:
                if 'timestamp' in msg and isinstance(msg['timestamp'], datetime.datetime):
                    msg['timestamp'] = msg['timestamp'].isoformat()
            return jsonify({"conversation": conversation}), 200
        else:
            return jsonify({"error": "Conversation not found or unauthorized"}), 404
    except Exception as e:
        print(f"Error fetching conversation: {e}")
        return jsonify({"error": "Failed to fetch conversation", "details": str(e)}), 500

@ask_ai_bp.route('/conversations/<conversation_id>/messages', methods=['POST'])
@jwt_required()
def add_message_and_get_ai_response(conversation_id):
    """
    Adds a user message to a conversation, calls Gemini API, and adds AI response.
    Returns the updated conversation.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    user_message_text = data.get("text")

    if not user_message_text:
        return jsonify({"error": "No message text provided"}), 400

    try:
        # 1. Fetch the existing conversation
        conversation = ai_conversations_collection.find_one({
            "_id": ObjectId(conversation_id),
            "user_id": ObjectId(user_id)
        })

        if not conversation:
            return jsonify({"error": "Conversation not found or unauthorized"}), 404

        # 2. Add user message to conversation history
        user_message = {
            "role": "user",
            "text": user_message_text,
            "timestamp": datetime.datetime.utcnow()
        }
        conversation['messages'].append(user_message)

        # 3. Prepare chat history for Gemini API
        # Gemini API expects 'parts' to be a list of objects, each with a 'text' key
        chat_history_for_gemini = []
        for msg in conversation['messages']:
            chat_history_for_gemini.append({
                "role": msg["role"],
                "parts": [{"text": msg["text"]}]
            })

        # 4. Call Gemini API
        gemini_payload = { "contents": chat_history_for_gemini }
        gemini_headers = { 'Content-Type': 'application/json' }
        gemini_response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=gemini_headers,
            json=gemini_payload
        )
        gemini_response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        gemini_result = gemini_response.json()

        ai_response_text = "Sorry, I couldn't generate a response."
        if gemini_result.get('candidates') and len(gemini_result['candidates']) > 0 and \
           gemini_result['candidates'][0].get('content') and \
           gemini_result['candidates'][0]['content'].get('parts') and \
           len(gemini_result['candidates'][0]['content']['parts']) > 0:
            ai_response_text = gemini_result['candidates'][0]['content']['parts'][0].get('text', ai_response_text)

        # 5. Add AI response to conversation history
        ai_message = {
            "role": "model",
            "text": ai_response_text,
            "timestamp": datetime.datetime.utcnow()
        }
        conversation['messages'].append(ai_message)

        # 6. Update conversation in database
        ai_conversations_collection.update_one(
            {"_id": ObjectId(conversation_id)},
            {"$set": {"messages": conversation['messages']}}
        )

        # Return the updated conversation (with both user and AI messages)
        conversation['_id'] = str(conversation['_id'])
        conversation['user_id'] = str(conversation['user_id'])
        conversation['created_at'] = conversation['created_at'].isoformat()
        for msg in conversation['messages']: # Ensure all timestamps are isoformat
            if 'timestamp' in msg and isinstance(msg['timestamp'], datetime.datetime):
                msg['timestamp'] = msg['timestamp'].isoformat()

        return jsonify({"conversation": conversation}), 200

    except requests.exceptions.RequestException as req_err:
        print(f"Error calling Gemini API: {req_err}")
        return jsonify({"error": "Failed to get AI response from external API", "details": str(req_err)}), 502
    except Exception as e:
        print(f"Error adding message or processing AI response: {e}")
        return jsonify({"error": "Failed to process chat message", "details": str(e)}), 500

@ask_ai_bp.route('/conversations/<conversation_id>', methods=['DELETE'])
@jwt_required()
def delete_conversation(conversation_id):
    """
    Deletes a specific conversation for the logged-in user.
    """
    user_id = get_jwt_identity()

    try:
        result = ai_conversations_collection.delete_one({
            "_id": ObjectId(conversation_id),
            "user_id": ObjectId(user_id)
        })

        if result.deleted_count == 1:
            return jsonify({"message": "Conversation deleted successfully!"}), 200
        else:
            return jsonify({"error": "Conversation not found or unauthorized"}), 404
    except Exception as e:
        print(f"Error deleting conversation: {e}")
        return jsonify({"error": "Failed to delete conversation", "details": str(e)}), 500

