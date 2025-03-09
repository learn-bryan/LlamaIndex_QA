import React from 'react';
import { Document } from '../apis/documentApi';

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No documents uploaded yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Upload documents to start querying them.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div key={doc.id} className="border rounded-md p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium mb-2 truncate" title={doc.filename}>
            {doc.filename}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-3">
            {doc.text_preview}
          </p>
          <div className="text-xs text-gray-400">
            ID: {doc.id}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;