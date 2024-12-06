
import jwt
from datetime import datetime, timedelta
from flask import url_for

SECRET_KEY = "your_secret_key_here"

def generate_temporary_link(file_path, expiration_minutes=60):
    expiration_time = datetime.utcnow() + timedelta(minutes=expiration_minutes)
    payload = {
        "file_path": file_path,
        "exp": expiration_time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    link = url_for('file.view_temporary_file', token=token, _external=True)
    return link
