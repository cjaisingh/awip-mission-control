import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaRobot, FaServer, FaCog } from 'react-icons/fa';

function Sidebar() {
  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/agents', icon: <FaRobot />, label: 'Agent Status' },
    { path: '/system', icon: <FaServer />, label: 'System Health' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">AWIP Mission Control</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
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
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="text-sm text-gray-500">
          <p>System Status: Operational</p>
          <p>Uptime: 99.97%</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 