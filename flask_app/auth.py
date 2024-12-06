# auth.py
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import Config
from functools import wraps
from flask import request, jsonify



# Hash a password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Verify a password
def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Generate JWT token
def generate_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

# Decode JWT token
def decode_token(token):
    try:
        decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        return decoded["user_id"]
    except jwt.ExpiredSignatureError:
        return None

# Decorator to protect routes
def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("token")  # Retrieve token from cookies
        if not token:
            return jsonify({"error": "Token is missing"}), 403
        try:
            user_id = decode_token(token)
            if not user_id:
                return jsonify({"error": "Invalid or expired token"}), 403
        except:
            return jsonify({"error": "Invalid token"}), 403

        # Pass user_id to the route function
        return f(*args, user_id=user_id, **kwargs)
    return decorated
