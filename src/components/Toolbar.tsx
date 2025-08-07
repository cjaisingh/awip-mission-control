import React, { memo } from 'react';
import { toolItems } from '../config/navigation';
import { useAgentStatus } from '../hooks/useAgentStatus';

const Toolbar: React.FC = memo(() => {
  const { healthScore, status } = useAgentStatus();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Tools</h2>
      </div>
      
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {toolItems.map((tool, index) => (
            <button
              key={index}
              onClick={tool.action}
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">
                <tool.icon />
              </span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Agent 20 Status</h3>
          <div className="text-sm text-blue-600">
            <p>Health Score: {healthScore}/10</p>
            <p>Status: {status}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar; 