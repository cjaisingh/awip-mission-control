import { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { useSSOTStore } from '../store/ssotStore';

export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get SSOT store
  const { updateAgents, updateAgent20 } = useSSOTStore();

  useEffect(() => {
    let mounted = true;

    const fetchAgents = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getAgents();
        if (mounted) {
          setAgents(data);
          setError(null);
          
          // Update SSOT store
          updateAgents(data);
          
          // Update Agent 20 status
          const agent20 = data.find(agent => agent.id === 20) || {
            id: 20,
            name: 'Agent 20',
            status: 'operational',
            performance_score: 9.9,
            last_heartbeat: new Date().toISOString()
          };
          updateAgent20(agent20);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAgents();

    return () => {
      mounted = false;
    };
  }, [updateAgents, updateAgent20]);

  const getAgentById = (agentId) => {
    return agents.find(agent => agent.id === agentId);
  };

  const getAgentsByType = (agentType) => {
    return agents.filter(agent => agent.agent_type === agentType);
  };

  const getAgentsByStatus = (status) => {
    return agents.filter(agent => agent.status === status);
  };

  const getAgentsByCapability = (capability) => {
    return agents.filter(agent =>
      agent.capabilities && agent.capabilities.includes(capability)
    );
  };

  const getAgentHealthStatus = (agent) => {
    if (!agent.last_heartbeat) return 'unknown';
    
    const now = new Date();
    const lastHeartbeat = new Date(agent.last_heartbeat);
    const diffMinutes = (now - lastHeartbeat) / (1000 * 60);

    if (diffMinutes <= 5) return 'healthy';
    if (diffMinutes <= 15) return 'warning';
    return 'critical';
  };

  return {
    agents,
    loading,
    error,
    getAgentById,
    getAgentsByType,
    getAgentsByStatus,
    getAgentsByCapability,
    getAgentHealthStatus
  };
}; 