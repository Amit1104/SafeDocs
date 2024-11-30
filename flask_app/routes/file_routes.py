# routes/file_routes.py
import os
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
import jwt
from utils.temp_link import SECRET_KEY, generate_temporary_link
from datetime import datetime
from utils.encryption import encrypt_file
from auth import auth_required
from utils.encryption import decrypt_file, decrypt_file_path
from io import BytesIO
from db import users_collection  
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError


file_bp = Blueprint('file', __name__)

# Base directory for uploads
UPLOAD_FOLDER = 'uploads'


@file_bp.route('/files', methods=['GET'])
@auth_required
def get_uploaded_files(user_id):
    # Define the user-specific upload folder
    user_folder_prefix = f"{user_id}_"
    user_folders = [f for f in os.listdir(UPLOAD_FOLDER) if f.startswith(user_folder_prefix)]
    
    # Collect all files in user-specific folders
    user_files = []
    for folder in user_folders:
        folder_path = os.path.join(UPLOAD_FOLDER, folder)
        files = os.listdir(folder_path)
        for file in files:
            file_path = os.path.join(folder_path, file)
            file_size_kb = os.path.getsize(file_path) / 1024  # Get size in KB
            user_files.append({
                "file_name": file,
                "file_path": file_path,  # Path where file is stored
                "file_size_kb": round(file_size_kb, 2)  # Round size to 2 decimal places
            })

    return jsonify({"files": user_files})


@file_bp.route('/upload', methods=['POST'])
@auth_required
def upload_file(user_id):
    # Check if file is included in request
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    # Retrieve the file and its contents
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Encrypt the file data
    file_data = file.read()
    encrypted_data = encrypt_file(file_data)

    # Generate a dynamic folder path using user_id and current timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    dynamic_folder = os.path.join(UPLOAD_FOLDER, f"{user_id}_{timestamp}")
    os.makedirs(dynamic_folder, exist_ok=True)  # Create the folder if it doesn't exist

    # Define the file path with the encrypted file
    filename = secure_filename(file.filename)
    file_path = os.path.join(dynamic_folder, filename)

    # Save the encrypted file data
    with open(file_path, 'wb') as encrypted_file:
        encrypted_file.write(encrypted_data)

    return jsonify({"message": "File uploaded and encrypted successfully", "file_path": file_path})
    

@file_bp.route('/delete_file', methods=['POST'])
@auth_required
def delete_file(user_id):
    # Get filename from the request JSON payload
    data = request.json
    filename = data.get("filename")
    if not filename:
        return jsonify({"error": "Filename is required"}), 400

    # Define the user-specific folder prefix
    user_folder_prefix = f"{user_id}_"
    user_folders = [f for f in os.listdir(UPLOAD_FOLDER) if f.startswith(user_folder_prefix)]

    # Find the file in user's folders
    file_found = False
    for folder in user_folders:
        folder_path = os.path.join(UPLOAD_FOLDER, folder)
        file_path = os.path.join(folder_path, filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)  # Delete the file
            file_found = True
            
            # Check if the folder is empty after deleting the file
            if not os.listdir(folder_path):  # Folder is empty
                os.rmdir(folder_path)  # Delete the folder
            
            break

    if file_found:
        return jsonify({"message": f"File '{filename}' deleted successfully"}), 200
    else:
        return jsonify({"error": "File not found"}), 404


@file_bp.route('/download_file', methods=['GET'])
@auth_required
def download_file(user_id):
    # Get filename from the request arguments
    filename = request.args.get("filename")
    if not filename:
        return jsonify({"error": "Filename is required"}), 400

    # Define the user-specific folder prefix
    user_folder_prefix = f"{user_id}_"
    user_folders = [f for f in os.listdir(UPLOAD_FOLDER) if f.startswith(user_folder_prefix)]

    # Find the file in user's folders
    file_found = False
    for folder in user_folders:
        folder_path = os.path.join(UPLOAD_FOLDER, folder)
        file_path = os.path.join(folder_path, filename)
        if os.path.exists(file_path):
            file_found = True
            break

    if not file_found:
        return jsonify({"error": "File not found"}), 404

    # Read the encrypted file data
    with open(file_path, 'rb') as encrypted_file:
        encrypted_data = encrypted_file.read()

    # Decrypt the file data
    try:
        decrypted_data = decrypt_file(encrypted_data)
    except Exception as e:
        return jsonify({"error": "File decryption failed"}), 500

    # Send the decrypted file for download
    decrypted_file = BytesIO(decrypted_data)
    decrypted_file.seek(0)  # Move the pointer to the start of the BytesIO stream
    return send_file(
        decrypted_file,
        as_attachment=True,
        download_name=filename,  # Original filename for download
        mimetype='application/octet-stream'
    )


@file_bp.route('/generate_link', methods=['POST'])
def generate_link():
    data = request.json
    file_path = data.get("file_path")
    
    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # Generate the temporary link valid for 1 hour
    link = generate_temporary_link(file_path, expiration_minutes=60)
    return jsonify({"temporary_link": link})


@file_bp.route('/view_temporary_file', methods=['GET'])
def view_temporary_file():
    # Get the token from query parameters
    token = request.args.get("token")
    if not token:
        return jsonify({"error": "Token is missing"}), 400

    try:
        # Decode the token to get the file path
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        file_path = payload.get("file_path")
        # Ensure the file path exists
        if not file_path or not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404

        # Decrypt the file
        decrypted_data = decrypt_file_path(file_path)

        # Serve the decrypted file
        decrypted_file = BytesIO(decrypted_data)
        decrypted_file.seek(0)  # Move the pointer to the start of the BytesIO stream
        return send_file(
            decrypted_file,
            as_attachment=False,   # or True if you want to force download
            download_name=os.path.basename(file_path),  # Use original filename
            mimetype='application/octet-stream'
        )

    except ExpiredSignatureError:
        return jsonify({"error": "The link has expired"}), 403
    except InvalidTokenError:
        return jsonify({"error": "Invalid link"}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
