import { useState, useEffect } from 'react';
import { agentExecutor } from '../services/langchainConfig';

interface AgentStatus {
  healthScore: number;
  status: 'operational' | 'degraded' | 'maintenance';
  lastActivity: Date;
  toolsAvailable: string[];
  memoryUsage: number;
}

export const useAgentStatus = () => {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    healthScore: 9.9,
    status: 'operational',
    lastActivity: new Date(),
    toolsAvailable: ['get_system_status', 'update_agent_status', 'generate_handoff_prompt', 'analyze_system_health'],
    memoryUsage: 0
  });

  useEffect(() => {
    const checkAgentHealth = async () => {
      try {
        // Test agent functionality
        const testResult = await agentExecutor.invoke({
          input: 'What is the current system status?',
          context: 'Agent health check'
        });

        // Update status based on agent performance
        const newStatus: AgentStatus = {
          healthScore: testResult.output ? 9.9 : 7.5,
          status: testResult.output ? 'operational' : 'degraded',
          lastActivity: new Date(),
          toolsAvailable: ['get_system_status', 'update_agent_status', 'generate_handoff_prompt', 'analyze_system_health'],
          memoryUsage: Math.random() * 100 // Mock memory usage
        };

        setAgentStatus(newStatus);
      } catch (error) {
        console.error('Error checking agent status:', error);
        // Keep using default values on error
        setAgentStatus(prev => ({
          ...prev,
          status: 'degraded' as const,
          healthScore: 7.0
        }));
      }
    };

    checkAgentHealth();
    const interval = setInterval(checkAgentHealth, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const executeAgentAction = async (action: string, parameters: any) => {
    try {
      const result = await agentExecutor.invoke({
        input: `Execute action: ${action} with parameters: ${JSON.stringify(parameters)}`,
        context: 'Agent action execution'
      });

      // Update last activity
      setAgentStatus(prev => ({
        ...prev,
        lastActivity: new Date()
      }));

      return result;
    } catch (error) {
      console.error('Agent action execution error:', error);
      throw error;
    }
  };

  return {
    ...agentStatus,
    executeAgentAction
  };
}; 