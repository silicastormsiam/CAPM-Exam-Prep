# File Name: app.py
# Owner: Andrew John Holland
# Purpose: Flask backend for CAPM Exam Prep, serving questions.json and static files.
# Version: 1.1.7 (August 03, 2025) - Adjusted paths for container environment.
# Change Log:
# [2025-08-03] Changed static_folder and questions_path to container paths '/app' (ID: stabilization-20250803-01).
# [2025-08-03] Fixed logging path to /volume1/CAPM_Exam/Error_Log (ID: logging-fix-20250803-01).
# [2025-08-03] Fixed Python syntax, replaced C-style comments with # (ID: syntax-fix-20250803-03).
# [2025-08-03] Added dependency check, enhanced error handling for /api/questions (ID: backend-fix-20250803-02).
# [2025-08-03] Enhanced /api/questions error handling, verified questions.json path (ID: backend-fix-20250803-01).
# [2025-08-03] Added /api/log endpoint and file-based logging to app_py_error_log_YYYYMMDD_HHMM.log (ID: logging-enhancement-20250803-01).
import logging
import os
import datetime
import json
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
# Check dependencies
try:
    import flask
    import flask_cors
except ImportError as e:
    print(f"Dependency missing: {e}")
    exit(1)
app = Flask(__name__, static_folder='/app')
CORS(app)
# Ensure Error_Log directory exists
log_dir = '/app/Error_Log'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)
# Configure logging to file with timestamp
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M")
log_filename = f'{log_dir}/app_py_error_log_{timestamp}.log'
logging.basicConfig(filename=log_filename, level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.info("Flask app initialized with static_folder=/app")
@app.route('/')
def serve_index():
    try:
        logger.debug("Serving index.html")
        return send_from_directory(app.static_folder, 'index.html')
    except Exception as e:
        logger.error(f"Error serving index.html: {str(e)}")
        return jsonify({"error": "Failed to serve index.html"}), 500
@app.route('/<path:path>')
def serve_static(path):
    try:
        logger.debug(f"Serving static file: {path}")
        return send_from_directory(app.static_folder, path)
    except Exception as e:
        logger.error(f"Error serving static file {path}: {str(e)}")
        return jsonify({"error": f"Failed to serve {path}"}), 404
@app.route('/api/questions')
def serve_questions():
    try:
        questions_path = '/app/questions.json'
        if not os.path.exists(questions_path):
            logger.error(f"questions.json not found at {questions_path}")
            return jsonify({"error": f"Questions file not found at {questions_path}"}), 404
        logger.debug("Loading questions.json")
        with open(questions_path, 'r') as f:
            questions = json.load(f)
        logger.info("Questions loaded successfully")
        return jsonify(questions)
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error in questions.json: {str(e)}")
        return jsonify({"error": "Invalid JSON in questions file"}), 500
    except Exception as e:
        logger.error(f"Error loading questions: {str(e)}")
        return jsonify({"error": "Failed to load questions"}), 500
@app.route('/api/log', methods=['POST'])
def log_error():
    try:
        data = request.json
        logger.error(f"Client log: {data.get('message', 'No message provided')}")
        return jsonify({"status": "logged"}), 200
    except Exception as e:
        logger.error(f"Error in /api/log: {str(e)}")
        return jsonify({"error": "Failed to log"}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8085, debug=True)