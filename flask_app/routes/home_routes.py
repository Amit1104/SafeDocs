# routes/home_routes.py
from flask import Blueprint

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    return "Welcome to the Flask and MongoDB App!"
