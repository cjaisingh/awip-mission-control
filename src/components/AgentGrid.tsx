import React, { memo } from 'react';
import { useAgents } from '../hooks/useAgents';
import LoadingSpinner from './LoadingSpinner';
import AgentCard from './AgentCard';
import ErrorBoundary from './ErrorBoundary';
import { HealthStatus, Status, getStatusColor, getHealthColor, formatTimestamp } from '../utils/statusUtils';

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

const AgentGrid: React.FC = memo(() => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {agents.map((agent: Agent) => {
        const healthStatus = getAgentHealthStatus(agent) as HealthStatus;
        return (
          <ErrorBoundary
            key={agent.id}
            fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error loading agent card</p>
              </div>
            }
          >
            <AgentCard agent={agent} healthStatus={healthStatus} />
          </ErrorBoundary>
        );
      })}
    </div>
  );
});

AgentGrid.displayName = 'AgentGrid';

export default AgentGrid; 