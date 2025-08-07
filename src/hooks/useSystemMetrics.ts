import { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { useSSOTStore } from '../store/ssotStore';

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
  disk: number;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0
  });

  // Get SSOT store
  const { updateMetrics } = useSSOTStore();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await mockApi.getSystemMetrics();
        setMetrics(data);
        
        // Update SSOT store
        updateMetrics(data);
      } catch (error) {
        console.error('Error fetching system metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [updateMetrics]);

  return metrics;
}; 