# app.py
from flask import Flask
from flask_cors import CORS
from routes import home_bp, auth_bp, file_bp

app = Flask(__name__)

# CORS(app, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": ["*","http://localhost:3000","http://localhost:3000/"]}},supports_credentials=True)


# Register Blueprints
app.register_blueprint(home_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(file_bp, url_prefix='/api')


if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', threaded=True)
