import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import tempfile
from werkzeug.utils import secure_filename
import json
from index_service import IndexService

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize the IndexService
index_service = IndexService()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join('temp_documents', filename)
        file.save(filepath)
        
        # Insert document into index
        doc_id = index_service.insert_document(filepath, filename)
        
        # Remove temporary file after insertion
        os.remove(filepath)
        
        return jsonify({
            "message": "File uploaded and indexed successfully",
            "doc_id": doc_id
        }), 200
    
    except Exception as e:
        # Clean up temporary file if error occurs
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": str(e)}), 500

@app.route('/query', methods=['GET'])
def query_index():
    query_text = request.args.get('text', None)
    if query_text is None:
        return jsonify({"error": "No text parameter provided"}), 400
    
    try:
        response = index_service.query(query_text)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/documents', methods=['GET'])
def get_documents():
    try:
        documents = index_service.get_documents()
        return jsonify(documents), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Create temp_documents directory if it doesn't exist
    os.makedirs('temp_documents', exist_ok=True)
    
    # Ensure the index is initialized
    index_service.initialize()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5601, debug=False)