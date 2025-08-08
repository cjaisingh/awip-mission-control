import React from 'react';
import { useSSOTStore } from '../store/ssotStore';
import { SSOT_CONFIG } from '../config/ssot';
import { FaDatabase, FaServer, FaRobot, FaSync, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const SSOTStatus: React.FC = () => {
  const {
    system,
    agents,
    metrics,
    health,
    database,
    realtime,
    langchain,
    getSystemStatus,
    getAgent20Status,
    getActiveAgentsCount,
    getOverallHealth,
    isDatabaseConnected,
    isRealtimeConnected,
    isLangChainInitialized
  } = useSSOTStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'active':
        return <span className="text-green-500">✅</span>;
      case 'degraded':
      case 'warning':
        return <span className="text-yellow-500">⚠️</span>;
      case 'critical':
      case 'error':
        return <span className="text-red-500">❌</span>;
      default:
        return <span className="text-gray-500">🔄</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'active':
        return 'text-green-600';
      case 'degraded':
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">🔄</span>
        Single Source of Truth Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* System Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">System</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(system.status)}
                <span className={`text-sm font-medium ${getStatusColor(system.status)}`}>
                  {system.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Health</span>
              <span className="text-sm font-medium">{system.health}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-medium">{system.uptime}</span>
            </div>
          </div>
        </div>

        {/* Agents Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Agents</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active</span>
              <span className="text-sm font-medium">{getActiveAgentsCount()}/{agents.totalCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Agent 20</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon('active')}
                <span className={`text-sm font-medium ${getStatusColor('active')}`}>
                  Active
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Health Score</span>
              <span className="text-sm font-medium">{SSOT_CONFIG.agents.agent20.healthScore}/10</span>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Database</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection</span>
              <div className="flex items-center space-x-2">
                {isDatabaseConnected() ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
                <span className={`text-sm font-medium ${isDatabaseConnected() ? 'text-green-600' : 'text-red-600'}`}>
                  {isDatabaseConnected() ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Sync</span>
              <span className="text-sm font-medium">
                {database.lastSync ? new Date(database.lastSync).toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Real-time</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection</span>
              <div className="flex items-center space-x-2">
                {isRealtimeConnected() ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
                <span className={`text-sm font-medium ${isRealtimeConnected() ? 'text-green-600' : 'text-red-600'}`}>
                  {isRealtimeConnected() ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <span className="text-sm font-medium">
                {new Date(realtime.lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* LangChain Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">LangChain</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Initialized</span>
              <div className="flex items-center space-x-2">
                {isLangChainInitialized() ? (
                  <span className="text-green-500">✅</span>
                ) : (
                  <span className="text-yellow-500">⚠️</span>
                )}
                <span className={`text-sm font-medium ${isLangChainInitialized() ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isLangChainInitialized() ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Session ID</span>
              <span className="text-sm font-medium">
                {langchain.sessionId ? langchain.sessionId.substring(0, 8) + '...' : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversations</span>
              <span className="text-sm font-medium">{langchain.conversationHistory.length}</span>
            </div>
          </div>
        </div>

        {/* Metrics Status */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Metrics</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">CPU</span>
              <span className="text-sm font-medium">{metrics.cpu}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Memory</span>
              <span className="text-sm font-medium">{metrics.memory}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Network</span>
              <span className="text-sm font-medium">{metrics.network}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Disk</span>
              <span className="text-sm font-medium">{metrics.disk}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Last Updated</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SSOTStatus;
