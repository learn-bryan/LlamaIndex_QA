import React, { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import QueryInterface from './components/QueryInterface';
import DocumentList from './components/DocumentList';
import { Document, fetchDocuments } from './apis/documentApi';
import './App.css';

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'query'>('upload');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDocumentUploaded = () => {
    loadDocuments();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">LlamaIndex Qdrant RAG App</h1>
          <p className="mt-2">Upload documents and query them using AI</p>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === 'upload' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Documents
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === 'query' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('query')}
            >
              Query Documents
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'upload' ? (
              <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
            ) : (
              <QueryInterface />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading documents...</p>
          ) : (
            <DocumentList documents={documents} />
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>Built with LlamaIndex, Qdrant, React, and Flask</p>
        </div>
      </footer>
    </div>
  );
};

export default App;