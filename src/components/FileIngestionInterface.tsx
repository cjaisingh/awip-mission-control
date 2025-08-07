import React, { useState, useRef } from 'react';
import { fileIngestionAgent } from '../services/fileIngestionAgent';
import { FaUpload, FaGoogle, FaDatabase, FaChartLine, FaDownload, FaSearch, FaCog, FaFileAlt, FaNetworkWired } from 'react-icons/fa';

interface FileIngestionInterfaceProps {
  className?: string;
}

interface ProcessingResult {
  success: boolean;
  fileName: string;
  triplesCount?: number;
  message?: string;
  error?: string;
}

const FileIngestionInterface: React.FC<FileIngestionInterfaceProps> = ({ className = '' }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'google-drive' | 'query' | 'analytics'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    const fileResults: ProcessingResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await fileIngestionAgent.processLocalFile(file);
        fileResults.push(result);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    }

    setResults(fileResults);
    setIsProcessing(false);
  };

  const handleGoogleDriveConnect = async () => {
    setIsProcessing(true);
    try {
      const connected = await fileIngestionAgent.connectGoogleDrive();
      if (connected) {
        const files = await fileIngestionAgent.listGoogleDriveFiles();
        console.log('Google Drive files:', files);
      }
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
    }
    setIsProcessing(false);
  };

  const handleSearchTriples = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await fileIngestionAgent.queryTriples(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching triples:', error);
    }
  };

  const handleGetStats = async () => {
    try {
      const stats = await fileIngestionAgent.getTripleStats();
      setStats(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
    }
  };

  const handleExportTriples = async (format: string) => {
    try {
      const exportData = await fileIngestionAgent.exportTriples(format);
      if (exportData) {
        // Create download link
        const dataString = typeof exportData === 'string' ? exportData : JSON.stringify(exportData);
        const blob = new Blob([dataString], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `triples.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting triples:', error);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaFileAlt className="mr-2" />
        File Ingestion Agent - GraphRAG
      </h3>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upload' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaUpload className="inline mr-2" />
          Upload Files
        </button>
        <button
          onClick={() => setActiveTab('google-drive')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'google-drive' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaGoogle className="inline mr-2" />
          Google Drive
        </button>
        <button
          onClick={() => setActiveTab('query')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'query' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaSearch className="inline mr-2" />
          Query Triples
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FaChartLine className="inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Upload Files Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FaUpload className="mx-auto text-3xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Upload files to extract GraphRAG triples (subject-relation-object)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Select Files'}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Processing Results</h4>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.fileName}</span>
                    <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? `${result.triplesCount} triples` : 'Failed'}
                    </span>
                  </div>
                  {result.message && <p className="text-sm text-gray-600 mt-1">{result.message}</p>}
                  {result.error && <p className="text-sm text-red-600 mt-1">{result.error}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Google Drive Tab */}
      {activeTab === 'google-drive' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Google Drive Integration</h4>
            <p className="text-sm text-blue-600 mb-4">
              Connect to Google Drive to process files and extract GraphRAG triples
            </p>
            <button
              onClick={handleGoogleDriveConnect}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing ? 'Connecting...' : 'Connect to Google Drive'}
            </button>
          </div>
        </div>
      )}

      {/* Query Triples Tab */}
      {activeTab === 'query' && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for entities, relations, or objects..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearchTriples}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Search Results</h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {searchResults.map((triple, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-600">{triple.subject}</span>
                      <span className="text-gray-500">→</span>
                      <span className="font-medium text-green-600">{triple.relation}</span>
                      <span className="text-gray-500">→</span>
                      <span className="font-medium text-purple-600">{triple.object}</span>
                    </div>
                    {triple.source_file && (
                      <p className="text-xs text-gray-500 mt-1">Source: {triple.source_file}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Graph Statistics</h4>
              <button
                onClick={handleGetStats}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Get Stats
              </button>
              {stats && (
                <div className="mt-3 space-y-1 text-sm">
                  <div>Total Triples: {stats.totalTriples}</div>
                  <div>Unique Entities: {stats.uniqueSubjects}</div>
                  <div>Unique Relations: {stats.uniqueRelations}</div>
                  <div>Source Files: {stats.sourceFiles}</div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Export Options</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleExportTriples('json')}
                  className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExportTriples('csv')}
                  className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportTriples('neo4j')}
                  className="w-full px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Export as Neo4j Cypher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>GraphRAG Agent Status: {isProcessing ? 'Processing' : 'Ready'}</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default FileIngestionInterface;
