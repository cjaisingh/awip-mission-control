import React from 'react';
import { AgentGrid } from '../components/AgentGrid';

export const AgentStatus = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Status</h1>
        <p className="mt-2 text-gray-600">
          Monitor the status and health of all agents in the system
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <AgentGrid />
        </div>
      </div>
    </div>
  );
}; 