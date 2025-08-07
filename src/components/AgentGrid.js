import React from 'react';
import { useAgents } from '../hooks/useAgents';
import LoadingSpinner from './LoadingSpinner';

export const AgentGrid = () => {
  const {
    agents,
    loading,
    error,
    getAgentHealthStatus
  } = useAgents();

  if (loading) {
    return <LoadingSpinner size="large" text="Loading agents..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading agents</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {agents.map((agent) => {
        const healthStatus = getAgentHealthStatus(agent);
        return (
          <div
            key={agent.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.domain}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
                <div className={`w-2 h-2 rounded-full ${getHealthColor(healthStatus)}`} />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Performance Score</span>
                <span className="font-medium">{agent.performance_score || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Last Heartbeat</span>
                <span className="font-medium">
                  {agent.last_heartbeat
                    ? new Date(agent.last_heartbeat).toLocaleTimeString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            {agent.capabilities && agent.capabilities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 