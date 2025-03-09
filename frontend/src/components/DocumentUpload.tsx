import React, { useState } from 'react';
import { uploadDocument } from '../apis/documentApi';

interface DocumentUploadProps {
  onDocumentUploaded: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success?: string;
    error?: string;
  }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus({});
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({ error: 'Please select a file to upload' });
      return;
    }

    setIsUploading(true);
    setUploadStatus({});

    try {
      await uploadDocument(file);
      setUploadStatus({ success: `File ${file.name} uploaded successfully!` });
      setFile(null);
      onDocumentUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ error: 'An error occurred during upload. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Document
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
        />
        <p className="mt-2 text-sm text-gray-500">
          Supports text files, PDFs, and more
        </p>
      </div>

      {file && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium">Selected file: {file.name}</p>
          <p className="text-xs text-gray-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {uploadStatus.success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          {uploadStatus.success}
        </div>
      )}

      {uploadStatus.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {uploadStatus.error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          !file || isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
};

export default DocumentUpload;