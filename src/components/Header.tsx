import React from 'react';

const Header: React.FC = () => (
  <header className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 h-16">
    <div className="flex items-center space-x-4">
      <div className="flex flex-col">
        <span className="font-semibold text-lg text-gray-900 leading-tight">AWIP Control Panel</span>
        <span className="text-xs text-gray-500 -mt-1">Cognitive Domains</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" aria-label="Search">
        <i className="fas fa-search text-gray-600" />
      </button>
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
        <i className="fas fa-user" />
      </div>
    </div>
  </header>
);

export default Header; 