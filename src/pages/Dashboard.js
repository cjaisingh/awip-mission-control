import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { useAgents } from '../hooks/useAgents';
import { useSystemMetricsChart } from '../hooks/useSystemMetricsChart';
import AgentTools from '../components/AgentTools';
import SSOTStatus from '../components/SSOTStatus';
import AgentCapabilities from '../components/AgentCapabilities';
import FileIngestionInterface from '../components/FileIngestionInterface';
import DatabaseStatus from '../components/DatabaseStatus';
import KnowledgeGraphVisualization from '../components/KnowledgeGraphVisualization';
import ExcelStyleDataView from '../components/ExcelStyleDataView';
import GraphRAGChart from '../components/GraphRAGChart';
import DebugEnvironment from '../components/DebugEnvironment';
import DebugFileIngestion from '../components/DebugFileIngestion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const systemHealth = useSystemHealth();
  const systemMetrics = useSystemMetrics();
  const { agents, loading: agentsLoading } = useAgents();
  const { chartData: systemMetricsChart, loading: chartLoading } = useSystemMetricsChart();



  const agentPerformanceData = {
    labels: agents.map(agent => agent.name),
    datasets: [
      {
        label: 'Performance Score',
        data: agents.map(agent => agent.performance_score || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const activeAgentsCount = agents.filter(agent => agent.status === 'active').length;
  const totalAgentsCount = agents.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">System Status</h3>
          <div className="text-3xl font-bold text-green-600">
            {systemHealth.overall > 90 ? 'Operational' : 'Degraded'}
          </div>
          <p className="text-gray-500 mt-2">Uptime: {systemHealth.overall}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Agents</h3>
          <div className="text-3xl font-bold text-blue-600">
            {agentsLoading ? '...' : `${activeAgentsCount}/${totalAgentsCount}`}
          </div>
          <p className="text-gray-500 mt-2">All systems nominal</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
          <div className="text-3xl font-bold text-purple-600">{systemMetrics.cpu}%</div>
          <p className="text-gray-500 mt-2">Current load</p>
        </div>
      </div>

      {/* SSOT Status Section */}
      <SSOTStatus />

      {/* Database Status Section */}
      <DatabaseStatus />

      {/* Debug Environment Section */}
      <DebugEnvironment />

      {/* Debug File Ingestion Section */}
      <DebugFileIngestion />

      {/* Agent Capabilities Section */}
      <AgentCapabilities />

      {/* File Ingestion Agent Section */}
      <FileIngestionInterface />

      {/* Knowledge Graph Visualization Section */}
      <KnowledgeGraphVisualization />

      {/* Excel-Style Data View Section */}
      <ExcelStyleDataView />

      {/* GraphRAG Chart Section */}
      <GraphRAGChart />

      {/* LangChain Agent Tools Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">LangChain Agent Tools</h3>
        <AgentTools />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Metrics (Real Data)</h3>
          {chartLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading real-time metrics...</div>
            </div>
          ) : (
            <Line data={systemMetricsChart} />
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Agent Performance (Real Data)</h3>
          <Line data={agentPerformanceData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {systemHealth.alerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm text-gray-500">{alert.type} alert</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 