import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { navigationItems } from '../config/navigation';
import { useSystemStatus } from '../hooks/useSystemStatus';

const Sidebar: React.FC = memo(() => {
  const { systemStatus } = useSystemStatus();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">AWIP Mission Control</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="text-lg">
                  📊
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="text-sm text-gray-500 space-y-1">
          <p>Database: {systemStatus.database ? 'Connected' : 'Disconnected'}</p>
          <p>GitHub: {systemStatus.github ? 'Active' : 'Inactive'}</p>
          <p>Agent 20: {systemStatus.agent20 ? 'Operational' : 'Offline'}</p>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 