from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError  # Only import this
from config import Config

try:
    # Attempt to connect to the MongoDB server
    client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)  # 5 seconds timeout for connection
    db = client.get_database()


    # Test the connection
    client.admin.command('ping')  # This is a simple ping to test connectivity

    # Collections
    users_collection = db.users

except ServerSelectionTimeoutError as e:
    # Handle connection errors
    print(f"Error connecting to MongoDB: {e}")
    # You could also log the error or terminate the application if needed
    exit(1)  # Exit the program if the connection fails

except Exception as e:
    # Catch any other unexpected errors
    print(f"An unexpected error occurred: {e}")
    exit(1)  # Exit the program if the connection fails
