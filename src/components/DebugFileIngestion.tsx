import React, { useState, useEffect } from 'react';
import { fileIngestionAgent } from '../services/fileIngestionAgent';

const DebugFileIngestion: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [triples, setTriples] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing File Ingestion Agent connection...');
      
      // Test 1: Get triple stats
      console.log('Getting triple stats...');
      const tripleStats = await fileIngestionAgent.getTripleStats();
      console.log('Triple stats:', tripleStats);
      setStats(tripleStats);
      
      // Test 2: Query triples
      console.log('Querying triples...');
      const triplesData = await fileIngestionAgent.queryTriples('');
      console.log('Triples data:', triplesData);
      setTriples(triplesData);
      
    } catch (err) {
      console.error('Debug test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">🔍 File Ingestion Debug</h3>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {stats && (
        <div className="mb-4">
          <h4 className="font-medium text-blue-700 mb-2">Triple Statistics:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Total Triples:</strong> {stats.totalTriples}</div>
            <div><strong>Unique Subjects:</strong> {stats.uniqueSubjects}</div>
            <div><strong>Unique Relations:</strong> {stats.uniqueRelations}</div>
            <div><strong>Unique Objects:</strong> {stats.uniqueObjects}</div>
            <div><strong>Source Files:</strong> {stats.sourceFiles}</div>
          </div>
        </div>
      )}

      {triples.length > 0 && (
        <div>
          <h4 className="font-medium text-blue-700 mb-2">Sample Triples ({triples.length} total):</h4>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {triples.slice(0, 5).map((triple, index) => (
              <div key={index} className="text-sm p-2 bg-white rounded border">
                <span className="font-medium text-blue-600">{triple.subject}</span>
                <span className="mx-2 text-gray-500">→</span>
                <span className="font-medium text-green-600">{triple.relation}</span>
                <span className="mx-2 text-gray-500">→</span>
                <span className="font-medium text-purple-600">{triple.object}</span>
                {triple.source_file && (
                  <span className="ml-2 text-xs text-gray-500">({triple.source_file})</span>
                )}
              </div>
            ))}
            {triples.length > 5 && (
              <div className="text-sm text-gray-500 italic">
                ... and {triples.length - 5} more triples
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugFileIngestion;
