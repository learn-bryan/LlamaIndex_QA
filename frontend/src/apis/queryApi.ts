import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5601';

export interface QuerySource {
  text: string;
  doc_id: string;
  score: number;
}

export interface QueryResponse {
  text: string;
  sources: QuerySource[];
}

export const queryIndex = async (queryText: string): Promise<QueryResponse> => {
  try {
    const response = await axios.get(`${API_URL}/query`, {
      params: { text: queryText },
    });
    return response.data;
  } catch (error) {
    console.error('Error querying index:', error);
    throw error;
  }
};