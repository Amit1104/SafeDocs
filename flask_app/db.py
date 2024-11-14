# db.py
from pymongo import MongoClient
from config import Config

# Set up the MongoDB client
client = MongoClient(Config.MONGO_URI)
db = client.get_database()  # Replace with your database name

# Collections
users_collection = db.users
