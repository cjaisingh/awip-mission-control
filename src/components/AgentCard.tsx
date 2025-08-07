import React, { memo } from 'react';
import { Status, HealthStatus, getStatusColor, getHealthColor, formatTimestamp } from '../utils/statusUtils';

interface AgentCapability {
  name: string;
  description?: string;
}

interface Agent {
  id: string;
  name: string;
  domain: string;
  status: Status;
  performance_score?: number;
  last_heartbeat?: string | number | Date;
  capabilities?: AgentCapability[];
}

interface AgentCardProps {
  agent: Agent;
  healthStatus: HealthStatus;
}

const AgentCard: React.FC<AgentCardProps> = memo(({ agent, healthStatus }) => {
  const {
    name,
    domain,
    status,
    performance_score,
    last_heartbeat,
    capabilities
  } = agent;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{domain}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
          <div className={`w-2 h-2 rounded-full ${getHealthColor(healthStatus)}`} />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Performance Score</span>
          <span className="font-medium">{performance_score || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-500">Last Heartbeat</span>
          <span className="font-medium">{formatTimestamp(last_heartbeat || '')}</span>
        </div>
      </div>

      {capabilities && capabilities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((capability, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                title={capability.description}
              >
                {capability.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

AgentCard.displayName = 'AgentCard';

export default AgentCard; 