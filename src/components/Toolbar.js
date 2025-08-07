import React, { useState } from 'react';
import { FaCog, FaHistory, FaBell, FaChartLine } from 'react-icons/fa';
import { useAgentStatus } from '../hooks/useAgentStatus';

function Toolbar() {
  const [activeTool, setActiveTool] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const agentStatus = useAgentStatus();

  const tools = [
    { 
      icon: <FaCog />, 
      label: 'Configuration', 
      onClick: () => {
        setActiveTool('configuration');
        console.log('Configuration panel opened');
      } 
    },
    { 
      icon: <FaHistory />, 
      label: 'Recent Activity', 
      onClick: () => {
        setActiveTool('activity');
        console.log('Recent activity panel opened');
      } 
    },
    { 
      icon: <FaBell />, 
      label: 'Notifications', 
      onClick: () => {
        setActiveTool('notifications');
        console.log('Notifications panel opened');
      } 
    },
    { 
      icon: <FaChartLine />, 
      label: 'Analytics', 
      onClick: () => {
        setActiveTool('analytics');
        console.log('Analytics panel opened');
      } 
    },
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case 'configuration':
        return (
          <div className="p-4">
            <h3 className="font-semibold mb-3">Configuration</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="update-interval" className="block text-sm font-medium text-gray-700">Update Interval</label>
                <select id="update-interval" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>30 seconds</option>
                  <option>1 minute</option>
                  <option>5 minutes</option>
                </select>
              </div>
              <div>
                <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700">Theme</label>
                <select id="theme-select" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="p-4">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">System Update</p>
                <p className="text-gray-500">2 minutes ago</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="font-medium">Agent Status Change</p>
                <p className="text-gray-500">5 minutes ago</p>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-4">
            <h3 className="font-semibold mb-3">Notifications</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <p className="font-medium text-blue-800">System Alert</p>
                <p className="text-blue-600">High CPU usage detected</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="font-medium text-green-800">Success</p>
                <p className="text-green-600">Backup completed</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-4">
            <h3 className="font-semibold mb-3">Analytics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>System Uptime</span>
                <span className="font-medium">99.7%</span>
              </div>
              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="font-medium">45ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active Agents</span>
                <span className="font-medium">5/5</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Tools</h2>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {tools.map((tool, index) => (
            <button
              key={index}
              onClick={tool.onClick}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTool === tool.label.toLowerCase().replace(' ', '') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        {activeTool && (
          <div className="mt-6 border-t pt-4">
            {renderToolContent()}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Agent 20 Status</h3>
          <div className="text-sm text-blue-600">
            <p>Health Score: {agentStatus.healthScore}/10</p>
            <p>Status: {agentStatus.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Toolbar; 