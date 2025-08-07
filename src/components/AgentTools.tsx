import React, { useState } from 'react';
import { FaTools, FaCog, FaPlay, FaStop, FaHistory } from 'react-icons/fa';
import { useAgentStatus } from '../hooks/useAgentStatus';

interface Tool {
  name: string;
  description: string;
  parameters: any;
}

const AgentTools: React.FC = () => {
  const { toolsAvailable, executeAgentAction, lastActivity, memoryUsage } = useAgentStatus();
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string>('');

  const tools: Tool[] = [
    {
      name: 'get_system_status',
      description: 'Get current system status and health metrics',
      parameters: { component: 'database' }
    },
    {
      name: 'update_agent_status',
      description: 'Update the status of a specific agent',
      parameters: { agentId: 'agent_20', status: 'operational', health: 90 }
    },
    {
      name: 'generate_handoff_prompt',
      description: 'Generate a handoff prompt for conversation continuity',
      parameters: { context: 'Current conversation context', nextAgent: 'agent_20' }
    },
    {
      name: 'analyze_system_health',
      description: 'Analyze overall system health and provide recommendations',
      parameters: { metrics: JSON.stringify({ cpu: 45, memory: 60, network: 28 }) }
    }
  ];

  const handleToolExecution = async (toolName: string, parameters: any) => {
    setIsExecuting(true);
    setExecutionResult('');

    try {
      const result = await executeAgentAction(toolName, parameters);
      setExecutionResult(JSON.stringify(result, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setExecutionResult(`Error: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Agent Tools</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FaHistory />
          <span>Last Activity: {lastActivity.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FaTools className="text-blue-500" />
            <span className="font-medium">Available Tools</span>
          </div>
          <div className="text-sm text-gray-600">
            {toolsAvailable.length} tools loaded
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FaCog className="text-green-500" />
            <span className="font-medium">Memory Usage</span>
          </div>
          <div className="text-sm text-gray-600">
            {memoryUsage.toFixed(1)}% used
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Tool Execution</h4>
        
        {tools.map((tool) => (
          <div key={tool.name} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h5 className="font-medium text-gray-800">{tool.name}</h5>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
              <button
                onClick={() => handleToolExecution(tool.name, tool.parameters)}
                disabled={isExecuting}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {isExecuting ? <FaStop /> : <FaPlay />}
                <span>{isExecuting ? 'Executing...' : 'Execute'}</span>
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              Parameters: {JSON.stringify(tool.parameters)}
            </div>
          </div>
        ))}
      </div>

      {executionResult && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Execution Result</h4>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {executionResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AgentTools;
