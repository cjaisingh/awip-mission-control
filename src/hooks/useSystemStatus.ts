import { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { useSSOTStore } from '../store/ssotStore';

interface SystemStatus {
  database: boolean;
  github: boolean;
  agent20: boolean;
}

export const useSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: false,
    github: false,
    agent20: false,
  });

  // Get SSOT store
  const { updateSystemStatus, updateDatabaseConnection } = useSSOTStore();

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const data = await mockApi.getSystemStatus();
        setSystemStatus(data);
        
        // Update SSOT store
        updateSystemStatus('operational');
        updateDatabaseConnection(true);
      } catch (error) {
        console.error('Error fetching system status:', error);
        updateSystemStatus('degraded');
        updateDatabaseConnection(false, error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updateSystemStatus, updateDatabaseConnection]);

  return { systemStatus };
}; 