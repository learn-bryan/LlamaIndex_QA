import React, { useState } from 'react';
import { queryIndex, QueryResponse, QuerySource } from '../apis/queryApi';

const QueryInterface: React.FC = () => {
  const [queryText, setQueryText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await queryIndex(queryText);
      setResponse(result);
    } catch (err) {
      console.error('Query error:', err);
      setError('An error occurred while processing your query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Query Your Documents</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Your Question
          </label>
          <textarea
            id="query"
            rows={3}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!queryText.trim() || isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            !queryText.trim() || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : 'Submit Query'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Answer</h3>
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="whitespace-pre-line">{response.text}</p>
            </div>
          </div>

          {response.sources.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Sources</h3>
              <div className="space-y-3">
                {response.sources.map((source: QuerySource, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">From: {source.doc_id}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        Relevance: {(source.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {source.text.length > 300 
                        ? `${source.text.substring(0, 300)}...` 
                        : source.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryInterface;