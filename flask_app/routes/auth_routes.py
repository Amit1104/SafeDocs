# routes/auth_routes.py
from flask import Blueprint, jsonify, request, make_response
from db import users_collection
from auth import hash_password, check_password, generate_token, decode_token
from bson import ObjectId



auth_bp = Blueprint('auth', __name__)

# Registration API
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Validate required fields
    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required"}), 400

    # Check if user or email already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    # Hash the password and save user
    hashed_password = hash_password(password)
    user_id = users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    }).inserted_id

    return jsonify({"user_id": str(user_id)}), 201

# Auth API
@auth_bp.route('/auth-status', methods=['GET'])
def auth_status():
    token = request.cookies.get("token")
    if token:
        user_id = decode_token(token)
        if user_id:
            # Retrieve user information from the database
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user_info = {
                    "username": user["username"],
                    "email": user["email"]
                }
                return jsonify({"isAuthenticated": True, "user": user_info})
    
    return jsonify({"isAuthenticated": False, "user": None})

# Login API
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find user in the database by email
    user = users_collection.find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT token
    token = generate_token(user["_id"])

    # Create a response object and set the token as a cookie
    response = make_response(jsonify({
        "message": "Login successful",
        "user":{
            "name":user['username'],
            "email":user['email']
        }
        }))
    response.set_cookie(
        "token", token,
        httponly=True,     # Prevents JavaScript from accessing the cookie
        secure=True,       # Ensures the cookie is sent over HTTPS (only enable in production)
        samesite="Lax"     # Prevents CSRF attacks by restricting cookie sharing across sites
    )

    return response

# Logout API (removes cookie)
@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Create a response object and unset the cookie
    response = make_response(jsonify({"message": "Logout successful"}))
    response.set_cookie("token", "", expires=0)  # Unset the token cookie
    return response