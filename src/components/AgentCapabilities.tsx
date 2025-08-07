import React, { useState } from 'react';
import { allAgentTools } from '../services/agentFunctions';
import { FaCogs, FaDatabase, FaShieldAlt, FaChartLine, FaRoad, FaProjectDiagram, FaComments, FaCheckCircle, FaTachometerAlt, FaDollarSign, FaClipboardCheck, FaPlug, FaHdd, FaBell, FaFileAlt, FaPalette, FaBrain, FaEye, FaUsers, FaRobot } from 'react-icons/fa';

interface AgentCapability {
  name: string;
  description: string;
}

interface AgentInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  capabilities: AgentCapability[];
}

const AgentCapabilities: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('01');
  const [showDetails, setShowDetails] = useState(false);

  const agentIcons = {
    '01': <FaCogs className="text-blue-600" />,
    '02': <FaDatabase className="text-green-600" />,
    '03': <FaRoad className="text-purple-600" />,
    '04': <FaShieldAlt className="text-red-600" />,
    '05': <FaChartLine className="text-indigo-600" />,
    '06': <FaProjectDiagram className="text-orange-600" />,
    '07': <FaComments className="text-teal-600" />,
    '08': <FaCheckCircle className="text-emerald-600" />,
    '09': <FaTachometerAlt className="text-yellow-600" />,
    '10': <FaDollarSign className="text-green-600" />,
    '11': <FaClipboardCheck className="text-blue-600" />,
    '12': <FaPlug className="text-purple-600" />,
    '13': <FaHdd className="text-gray-600" />,
    '14': <FaBell className="text-red-600" />,
    '15': <FaFileAlt className="text-indigo-600" />,
    '16': <FaPalette className="text-pink-600" />,
    '17': <FaBrain className="text-cyan-600" />,
    '18': <FaEye className="text-violet-600" />,
    '19': <FaUsers className="text-orange-600" />,
    '21': <FaFileAlt className="text-blue-600" />
  };

  const agentNames = {
    '01': 'DevOps Agent',
    '02': 'Database Agent',
    '03': 'Strategic Agent',
    '04': 'Security Agent',
    '05': 'Analytics Agent',
    '06': 'Workflow Agent',
    '07': 'Communication Agent',
    '08': 'Quality Agent',
    '09': 'Performance Agent',
    '10': 'Finance Agent',
    '11': 'Compliance Agent',
    '12': 'Integration Agent',
    '13': 'Backup Agent',
    '14': 'Notification Agent',
    '15': 'Reporting Agent',
    '16': 'UI/UX Agent',
    '17': 'Learning Agent',
    '18': 'Prediction Agent',
    '19': 'Master Coordinator Agent',
    '21': 'File Ingestion Agent'
  };

  const agentDescriptions = {
    '01': 'Infrastructure automation, deployment management, and resource scaling',
    '02': 'Database optimization, backup management, and query analysis',
    '03': 'Strategic planning, roadmap creation, and competitive analysis',
    '04': 'Security monitoring, threat detection, and vulnerability scanning',
    '05': 'Data analytics, trend prediction, and performance analysis',
    '06': 'Workflow automation, process creation, and task execution',
    '07': 'Team communication, notifications, and meeting coordination',
    '08': 'Quality assurance, testing, and code review',
    '09': 'Performance benchmarking, optimization, and monitoring',
    '10': 'Cost analysis, budget forecasting, and financial management',
    '11': 'Compliance auditing, reporting, and regulatory adherence',
    '12': 'API integration, data synchronization, and system connectivity',
    '13': 'System backup, restoration, and data protection',
    '14': 'Alert management, notification scheduling, and system alerts',
    '15': 'Report generation, data export, and documentation',
    '16': 'User interface analysis, usability optimization, and UX improvement',
    '17': 'Machine learning model training and knowledge base updates',
    '18': 'Outcome prediction, trend forecasting, and scenario analysis',
    '19': 'Multi-agent coordination, workflow optimization, and system orchestration',
    '21': 'File ingestion, GraphRAG triple extraction, and knowledge graph building'
  };

  const getAgentCapabilities = (agentId: string): AgentCapability[] => {
    const agentKey = `agent_${agentId.padStart(2, '0')}` as keyof typeof allAgentTools;
    const tools = allAgentTools[agentKey];
    
    if (!tools) return [];
    
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description
    }));
  };

  const currentAgent: AgentInfo = {
    id: selectedAgent,
    name: agentNames[selectedAgent as keyof typeof agentNames],
    icon: agentIcons[selectedAgent as keyof typeof agentIcons],
    description: agentDescriptions[selectedAgent as keyof typeof agentDescriptions],
    capabilities: getAgentCapabilities(selectedAgent)
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <FaRobot className="mr-2" />
        Agent Capabilities & Functions
      </h3>

      {/* Agent Selection */}
      <div className="mb-6">
        <label htmlFor="agent-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Agent
        </label>
        <select
          id="agent-select"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {Object.entries(agentNames).map(([id, name]) => (
            <option key={id} value={id}>
              {id.padStart(2, '0')} - {name}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Agent Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-2xl">{currentAgent.icon}</div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{currentAgent.name}</h4>
            <p className="text-sm text-gray-600">{currentAgent.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {currentAgent.capabilities.length} capabilities available
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Agent Capabilities */}
      {showDetails && (
        <div className="space-y-4">
          <h5 className="font-medium text-gray-800">Available Functions</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentAgent.capabilities.map((capability, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h6 className="font-medium text-gray-800 mb-2">{capability.name}</h6>
                <p className="text-sm text-gray-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h5 className="font-medium text-gray-800 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              // Example: Delegate a task to the selected agent
              console.log(`Delegating task to Agent ${selectedAgent}`);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Delegate Task
          </button>
          <button
            onClick={() => {
              // Example: Get agent status
              console.log(`Getting status for Agent ${selectedAgent}`);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Check Status
          </button>
          <button
            onClick={() => {
              // Example: View agent logs
              console.log(`Viewing logs for Agent ${selectedAgent}`);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            View Logs
          </button>
        </div>
      </div>

      {/* Agent Status Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h5 className="font-medium text-gray-800 mb-3">Agent Status Summary</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">20</div>
            <div className="text-gray-600">Total Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">19</div>
            <div className="text-gray-600">Active Agents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">101</div>
            <div className="text-gray-600">Total Functions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">99.7%</div>
            <div className="text-gray-600">System Health</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCapabilities;
