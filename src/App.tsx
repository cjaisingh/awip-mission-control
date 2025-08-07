import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { AgentStatus } from './pages/AgentStatus';
import SystemHealth from './pages/SystemHealth';
import Settings from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { initializeSSOTFromStorage } from './store/ssotStore';
import './styles/ssot-variables.css';

const App: React.FC = () => {
  // Initialize SSOT from localStorage on app start
  useEffect(() => {
    initializeSSOTFromStorage();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agent-status" element={<AgentStatus />} />
          <Route path="/system-health" element={<SystemHealth />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default App; 