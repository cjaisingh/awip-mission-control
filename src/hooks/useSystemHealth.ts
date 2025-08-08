import { useState, useEffect } from 'react';
import { getSystemHealth } from '../services/supabase';
import { useSSOTStore } from '../store/ssotStore';

interface SystemHealth {
  overall: number;
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  alerts: Array<{
    id: number;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export const useSystemHealth = () => {
  const [health, setHealth] = useState<SystemHealth>({
    overall: 0,
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0,
    alerts: []
  });

  // Get SSOT store
  const { updateHealth, addAlert } = useSSOTStore();

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getSystemHealth();
        setHealth(data);
        
        // Update SSOT store
        updateHealth({
          overall: data.overall,
          cpu: data.cpu,
          memory: data.memory,
          network: data.network,
          disk: data.disk
        });
        
        // Add alerts to SSOT store
        data.alerts.forEach(alert => {
          addAlert(alert);
        });
      } catch (error) {
        console.error('Error fetching system health:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, [updateHealth, addAlert]);

  return health;
}; 