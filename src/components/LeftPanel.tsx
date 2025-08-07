import React from 'react';

const navItems = [
  { icon: 'fas fa-sitemap', label: 'System Architecture', color: 'text-blue-600' },
  { icon: 'fas fa-robot', label: 'Agent Control', color: 'text-purple-600' },
  { icon: 'fas fa-microphone', label: 'Voice Interface', color: 'text-green-600' },
];

const LeftPanel: React.FC = () => (
  <aside className="backdrop-blur-md bg-white/40 border-r border-white/30 shadow-sm w-80 h-screen rounded-xl m-4 flex flex-col">
    <div className="p-4 border-b border-white/30">
      <h3 className="font-semibold text-gray-800">System Controls</h3>
    </div>
    <nav className="p-4 space-y-2 flex-1">
      {navItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center p-3 rounded-lg hover:bg-white/60 cursor-pointer transition-colors"
        >
          <i className={`${item.icon} ${item.color} mr-3`} />
          <span className="font-medium text-gray-800">{item.label}</span>
        </div>
      ))}
    </nav>
  </aside>
);

export default LeftPanel; 