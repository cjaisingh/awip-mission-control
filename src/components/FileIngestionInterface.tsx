import React, { useState, useCallback } from 'react';
import { fileIngestionAgent } from '../services/fileIngestionAgent';

interface ProcessingStatus {
  isProcessing: boolean;
  currentFile: string | null;
  processedFiles: number;
  totalFiles: number;
  triplesExtracted: number;
  error: string | null;
}

interface ProcessingResult {
  success: boolean;
  fileName: string;
  triplesCount?: number;
  error?: string;
}

const FileIngestionInterface: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    currentFile: null,
    processedFiles: 0,
    totalFiles: 0,
    triplesExtracted: 0,
    error: null
  });

  const [tripleStats, setTripleStats] = useState<any>(null);

  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  }, []);

  // Process files
  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setStatus(prev => ({
      ...prev,
      isProcessing: true,
      currentFile: null,
      processedFiles: 0,
      totalFiles: files.length,
      triplesExtracted: 0,
      error: null
    }));

    let totalTriples = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        setStatus(prev => ({
          ...prev,
          currentFile: file.name
        }));

        const result: ProcessingResult = await fileIngestionAgent.processLocalFile(file);
        
        if (result.success) {
          totalTriples += result.triplesCount || 0;
          setStatus(prev => ({
            ...prev,
            processedFiles: i + 1,
            triplesExtracted: totalTriples
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            error: `Error processing ${file.name}: ${result.error}`
          }));
        }
      }

      // Update triple statistics
      const stats = await fileIngestionAgent.getTripleStats();
      setTripleStats(stats);

    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    } finally {
      setStatus(prev => ({
        ...prev,
        isProcessing: false,
        currentFile: null
      }));
    }
  };

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">📤</span>
        File Ingestion Agent
      </h3>
      
      <div className="space-y-4">
        {/* Processing Status */}
        {status.isProcessing && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Processing Files</h4>
                <p className="text-sm text-blue-700">
                  {status.currentFile ? `Processing: ${status.currentFile}` : 'Preparing...'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-900">
                  {status.processedFiles}/{status.totalFiles} files
                </div>
                <div className="text-xs text-blue-600">
                  {status.triplesExtracted} triples extracted
                </div>
              </div>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(status.processedFiles / status.totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {status.error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-sm text-red-700">{status.error}</p>
            </div>
          </div>
        )}

        {/* Document Processing Status */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500">📄</span>
            <div>
              <h4 className="font-medium text-blue-900">Document Processing</h4>
              <p className="text-sm text-blue-700">Upload and process documents for AI analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-900">
              Status: {status.isProcessing ? 'Processing' : 'Ready'}
            </div>
            <div className="text-xs text-blue-600">
              Processed: {status.processedFiles} files
            </div>
          </div>
        </div>
        
        {/* GraphRAG Integration Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-green-500">🗄️</span>
            <div>
              <h4 className="font-medium text-green-900">GraphRAG Integration</h4>
              <p className="text-sm text-green-700">Triple extraction and knowledge graph building</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-900">
              Status: {tripleStats ? 'Active' : 'Ready'}
            </div>
            <div className="text-xs text-green-600">
              Triples: {tripleStats?.totalTriples || 0} extracted
            </div>
          </div>
        </div>

        {/* Triple Statistics */}
        {tripleStats && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Knowledge Graph Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Triples:</span>
                <span className="ml-2 font-medium">{tripleStats.totalTriples}</span>
              </div>
              <div>
                <span className="text-gray-600">Unique Subjects:</span>
                <span className="ml-2 font-medium">{tripleStats.uniqueSubjects}</span>
              </div>
              <div>
                <span className="text-gray-600">Unique Relations:</span>
                <span className="ml-2 font-medium">{tripleStats.uniqueRelations}</span>
              </div>
              <div>
                <span className="text-gray-600">Source Files:</span>
                <span className="ml-2 font-medium">{tripleStats.sourceFiles}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* File Upload Area */}
        <div 
          className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
            status.isProcessing 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <span className="mx-auto text-gray-400 text-2xl mb-2">📤</span>
          <p className="text-gray-500 mb-2">Drag and drop files here or click to upload</p>
          <p className="text-xs text-gray-400 mb-4">Supports: PDF, DOC, TXT, CSV</p>
          
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.csv"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={status.isProcessing}
          />
          <label
            htmlFor="file-upload"
            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              status.isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {status.isProcessing ? 'Processing...' : 'Choose Files'}
          </label>
        </div>

        {/* Recent Activity */}
        {status.processedFiles > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
            <div className="text-sm text-gray-600">
              <p>• Processed {status.processedFiles} files</p>
              <p>• Extracted {status.triplesExtracted} triples</p>
              <p>• Knowledge graph updated</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileIngestionInterface;
