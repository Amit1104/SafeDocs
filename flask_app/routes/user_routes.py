# routes/user_routes.py
from flask import Blueprint, jsonify, request
from db import users_collection

user_bp = Blueprint('user', __name__)

@user_bp.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    user_id = users_collection.insert_one(data).inserted_id
    return jsonify({"user_id": str(user_id)})

@user_bp.route('/get_users', methods=['GET'])
def get_users():
    users = list(users_collection.find())
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string for JSON serialization
    return jsonify(users)
