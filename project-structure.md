# LlamaIndex Web App with Qdrant Vector Store

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
