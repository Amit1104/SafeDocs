# db.py
from pymongo import MongoClient
from config import Config


client = MongoClient(Config.MONGO_URI)
db = client.get_database()

# Collections
users_collection = db.users
