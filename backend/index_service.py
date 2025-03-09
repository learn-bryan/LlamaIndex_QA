import os
import json
from llama_index.core import (
    SimpleDirectoryReader,
    Document,
    Settings,
    StorageContext,
)
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core.indices.vector_store import VectorStoreIndex
from qdrant_client import QdrantClient
from utils.document_processor import process_document

# Configuration
QDRANT_HOST = os.environ.get('QDRANT_HOST', 'localhost')
QDRANT_PORT = int(os.environ.get('QDRANT_PORT', 6333))
COLLECTION_NAME = "document_collection"
DOCUMENTS_METADATA_FILE = "documents_metadata.json"

class IndexService:
    def __init__(self):
        self.client = None
        self.vector_store = None
        self.index = None
        self.documents_metadata = {}
        self.load_documents_metadata()
    
    def load_documents_metadata(self):
        """Load documents metadata from file if it exists"""
        if os.path.exists(DOCUMENTS_METADATA_FILE):
            try:
                with open(DOCUMENTS_METADATA_FILE, 'r') as f:
                    self.documents_metadata = json.load(f)
            except:
                self.documents_metadata = {}
    
    def save_documents_metadata(self):
        """Save documents metadata to file"""
        with open(DOCUMENTS_METADATA_FILE, 'w') as f:
            json.dump(self.documents_metadata, f)
    
    def initialize(self):
        """Initialize connection to Qdrant and set up the index"""
        # Initialize Qdrant client
        self.client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        
        # Create vector store
        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=COLLECTION_NAME,
        )
        
        # Create index with the vector store
        storage_context = StorageContext.from_defaults(vector_store=self.vector_store)
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store,
            storage_context=storage_context
        )
        
        # We don't need to manually create the collection, as it will be created when documents are inserted
        print("Index service initialized")
    
    def insert_document(self, filepath, filename):
        """Process and insert a document into the index"""
        if self.index is None:
            self.initialize()
        
        # Process the document
        document_text, metadata = process_document(filepath)
        
        # Create LlamaIndex Document
        doc = Document(
            text=document_text,
            metadata={"filename": filename, "source": filepath}
        )
        
        # Split document into nodes
        parser = SentenceSplitter(chunk_size=1024, chunk_overlap=100)
        nodes = parser.get_nodes_from_documents([doc])
        
        # Insert nodes into the index
        self.index.insert_nodes(nodes)
        
        # Generate a document ID
        doc_id = filename
        
        # Store document metadata
        self.documents_metadata[doc_id] = {
            "filename": filename,
            "text_preview": document_text[:200] + "..." if len(document_text) > 200 else document_text,
            "node_count": len(nodes)
        }
        
        # Save updated metadata
        self.save_documents_metadata()
        
        return doc_id
    
    def query(self, query_text):
        """Query the index and return response with sources"""
        if self.index is None:
            self.initialize()
        
        # Create query engine
        query_engine = self.index.as_query_engine(
            similarity_top_k=3,
            response_mode="compact"
        )
        
        # Execute query
        response = query_engine.query(query_text)
        
        # Extract and format source nodes
        sources = []
        for source_node in response.source_nodes:
            sources.append({
                "text": source_node.node.get_text(),
                "doc_id": source_node.node.metadata.get("filename", "unknown"),
                "score": source_node.score
            })
        
        # Format the response
        result = {
            "text": str(response),
            "sources": sources
        }
        
        return result
    
    def get_documents(self):
        """Get list of documents in the index"""
        return [
            {"id": doc_id, "filename": metadata["filename"], "text_preview": metadata["text_preview"]}
            for doc_id, metadata in self.documents_metadata.items()
        ]