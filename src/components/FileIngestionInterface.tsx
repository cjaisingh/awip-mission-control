import React from 'react';
import { FaUpload, FaFile, FaDatabase } from 'react-icons/fa';

const FileIngestionInterface: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">📤</span>
        File Ingestion Agent
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500">📄</span>
            <div>
              <h4 className="font-medium text-blue-900">Document Processing</h4>
              <p className="text-sm text-blue-700">Upload and process documents for AI analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-900">Status: Active</div>
            <div className="text-xs text-blue-600">Processing: 0 files</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-green-500">🗄️</span>
            <div>
              <h4 className="font-medium text-green-900">GraphRAG Integration</h4>
              <p className="text-sm text-green-700">Triple extraction and knowledge graph building</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-900">Status: Ready</div>
            <div className="text-xs text-green-600">Triples: 0 extracted</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <span className="mx-auto text-gray-400 text-2xl mb-2">📤</span>
          <p className="text-gray-500">Drag and drop files here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Supports: PDF, DOC, TXT, CSV</p>
        </div>
      </div>
    </div>
  );
};

export default FileIngestionInterface;
