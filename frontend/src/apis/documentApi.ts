import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5601';

export interface Document {
  id: string;
  filename: string;
  text_preview: string;
}

export const uploadDocument = async (file: File): Promise<{ doc_id: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const fetchDocuments = async (): Promise<Document[]> => {
  try {
    const response = await axios.get(`${API_URL}/documents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    return [];
  }
};