from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify

def role_required(required_role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            user = get_jwt_identity()
            if user.get("role") != required_role:
                return jsonify({"error": "Forbidden: Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
