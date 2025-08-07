import React from 'react';

const Footer: React.FC = () => (
  <footer className="backdrop-blur-md bg-white/40 border-t border-white/30 shadow-sm px-6 py-3 rounded-xl mx-4 mb-4 flex items-center justify-between">
    <div className="flex items-center space-x-6">
      <span className="text-sm text-gray-500">© 2025 AWIP</span>
      <div className="flex items-center space-x-4">
        <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
        <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
      </div>
    </div>
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm text-gray-600">System Operational</span>
      </div>
      <div className="flex items-center space-x-1">
        <i className="fas fa-server text-xs text-gray-500" />
        <span className="text-sm text-gray-600">19 Agents Active</span>
      </div>
      <div className="text-sm text-gray-500">v1.2.0</div>
    </div>
  </footer>
);

export default Footer; 