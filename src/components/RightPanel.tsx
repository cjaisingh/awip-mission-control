import React, { useState } from 'react';

const tabs = [
  { key: 'db', label: 'DB Logs', icon: 'fas fa-database' },
  { key: 'github', label: 'GitHub Logs', icon: 'fab fa-github' },
  { key: 'config', label: 'Config', icon: 'fas fa-cog' },
  { key: 'deploy', label: 'Deploy', icon: 'fas fa-rocket' },
];

const mockLogs = {
  db: [
    { time: '23:15:42', message: 'System initialized', level: 'success' },
    { time: '23:16:10', message: 'DB connection established', level: 'info' },
    { time: '23:17:05', message: 'Query executed', level: 'info' },
  ],
  github: [
    { time: '23:18:00', message: 'Pushed commit to main', level: 'success' },
    { time: '23:18:30', message: 'Opened pull request #42', level: 'info' },
    { time: '23:19:10', message: 'GitHub Actions: Build passed', level: 'success' },
  ],
};

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('db');

  const logs = mockLogs[activeTab as 'db' | 'github'] || [];

  return (
    <aside className="backdrop-blur-md bg-white/40 border-l border-white/30 shadow-sm w-80 h-screen rounded-xl m-4 flex flex-col">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
        <h3 className="font-semibold">System Logs</h3>
      </div>
      <div className="flex border-b border-white/30">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white/60'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`${tab.icon} mr-2`} />{tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-2 text-sm">
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-gray-500">[{log.time}]</span>
                <span className={
                  log.level === 'success'
                    ? 'text-green-600'
                    : log.level === 'info'
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }>
                  {log.message}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No logs available.</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel; 