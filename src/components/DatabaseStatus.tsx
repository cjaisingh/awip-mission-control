import React, { useState, useEffect } from 'react';
import { testDatabaseConnection, testSupabaseClient } from '../services/dbTest';

const DatabaseStatus: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [clientStatus, setClientStatus] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Test client status on component mount
    const clientInfo = testSupabaseClient();
    setClientStatus(clientInfo);
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testDatabaseConnection();
      setConnectionStatus(result);
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">🗄️</span>
        Database Connection Status
      </h3>
      
      <div className="space-y-4">
        {/* Client Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Supabase Client</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between">
              <span>URL:</span>
              <span className="font-mono text-xs">{clientStatus?.url || 'Loading...'}</span>
            </div>
            <div className="flex justify-between">
              <span>Configured:</span>
              <span className={clientStatus?.configured ? 'text-green-600' : 'text-red-600'}>
                {clientStatus?.configured ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Client Created:</span>
              <span className={clientStatus?.clientCreated ? 'text-green-600' : 'text-red-600'}>
                {clientStatus?.clientCreated ? '✅ Yes' : '❌ No'}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Test */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Connection Test</h4>
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
          
          {connectionStatus && (
            <div className={`p-3 rounded text-sm ${
              connectionStatus.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="font-medium">
                {connectionStatus.success ? '✅ Connected' : '❌ Connection Failed'}
              </div>
              <div className="text-xs mt-1">{connectionStatus.message}</div>
            </div>
          )}
        </div>

        {/* Real Database Info */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Database Information</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Provider:</span>
              <span>Supabase</span>
            </div>
            <div className="flex justify-between">
              <span>Project:</span>
              <span>lubapfzpcfffksxtusga</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600">✅ Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;
