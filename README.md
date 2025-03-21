# LlamaIndex Web App

A full-stack web application that uses LlamaIndex for document processing and querying, with a Flask backend and React+TypeScript frontend.

## Project Overview

This project demonstrates how to build a web application that allows users to:
- Upload documents to build a knowledge base
- Query the knowledge base using natural language
- View the sources of information used to answer queries

The application consists of two main components:
1. A **Flask Backend** that handles document processing and querying using LlamaIndex
2. A **React Frontend** that provides a user interface for interacting with the backend

## Technology Stack

### Backend
- Python 3.11
- Flask (API server)
- LlamaIndex (document indexing and querying)
- multiprocessing.managers (for handling concurrent requests)

### Frontend
- TypeScript
- React
- Fetch API for backend communication

### Vector Store
- QDRant

## Project Structure
```
llamaindex-qdrant-app/
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py
│   ├── index_service.py
│   ├── temp_documents/
│   └── utils/
│       ├── __init__.py
│       └── document_processor.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── DocumentUpload.tsx
│   │   │   ├── QueryInterface.tsx
│   │   │   └── DocumentList.tsx
│   │   └── apis/
│   │       ├── documentApi.ts
│   │       └── queryApi.ts
│   └── tsconfig.json
└── qdrant/
    └── data/
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd flask_backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set your OpenAI API key:
   ```bash
   # For local testing only, do NOT deploy with your key hardcoded
   export OPENAI_API_KEY="your-key-here"
   ```

5. Start the index server:
   ```bash
   python index_server.py
   ```

6. In a separate terminal, start the Flask server:
   ```bash
   python flask_demo.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd react_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Usage

### Uploading Documents

1. Click on the "Upload" button in the navigation
2. Select a document from your file system
3. Click "Upload" to add the document to the index

### Querying the Index

1. Navigate to the "Query" page
2. Enter your question in the input field
3. Click "Submit" to get an answer
4. View the answer and the source documents that contributed to it

## API Endpoints

The Flask backend exposes the following endpoints:

- `GET /query?text=<query_text>` - Query the index with the specified text
- `POST /uploadFile` - Upload a file to be added to the index
- `GET /getDocuments` - Get a list of all documents in the index

## Development

### Backend Development

The backend consists of two main Python files:

- `index_server.py` - Handles index operations (initialization, querying, insertion)
- `flask_demo.py` - Provides API endpoints for the frontend

### Frontend Development

The frontend is organized into several key components:

- API clients in the `src/apis` directory
- React components for the user interface

## Deployment

For production deployment, consider the following:

1. Secure your API key handling
2. Set up proper CORS policies
3. Implement user authentication
4. Use a production-ready server like Gunicorn for Flask
5. Store the index and documents in a persistent storage solution (e.g., S3)

## License

[MIT License](LICENSE)

## Acknowledgments

This project is based on the LlamaIndex starter pack guide.