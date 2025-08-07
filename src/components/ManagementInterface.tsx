import React, { memo } from 'react';
import { FaShieldAlt, FaKey } from 'react-icons/fa';
import { useSystemHealth } from '../hooks/useSystemHealth';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = memo(({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 transition-colors"
  >
    <span className="text-indigo-500">{icon}</span>
    <span>{label}</span>
  </button>
));

NavItem.displayName = 'NavItem';

const ManagementInterface: React.FC = memo(() => {
  const systemHealth = useSystemHealth();

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">AWIP Control</h1>
        </div>
        <nav className="p-4">
          <NavItem
            icon={<FaShieldAlt />}
            label="Agent Policies"
            onClick={() => console.log('Agent Policies clicked')}
          />
          <NavItem
            icon={<FaKey />}
            label="Secrets Manager"
            onClick={() => console.log('Secrets Manager clicked')}
          />
        </nav>
      </div>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          System Health Overview
        </h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-700">
            System Health: {systemHealth.overall}/100
          </p>
        </div>
      </main>
    </div>
  );
});

ManagementInterface.displayName = 'ManagementInterface';

export default ManagementInterface; 