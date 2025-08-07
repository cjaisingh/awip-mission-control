import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation Panel */}
      <div className="w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* Center Content Panel */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Right Tools Panel */}
      <div className="w-80 bg-white shadow-lg">
        <Toolbar />
      </div>
    </div>
  );
};

export default Layout;
