import { useState, useEffect } from 'react';
import { getSystemMetrics } from '../services/supabase';

interface SystemMetricsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }>;
}

export const useSystemMetricsChart = () => {
  const [chartData, setChartData] = useState<SystemMetricsData>({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        setLoading(true);
        const metrics = await getSystemMetrics('24h');
        
        // Sort by timestamp and take last 6 data points
        const sortedMetrics = metrics
          .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .slice(-6);

        const labels = sortedMetrics.map((metric: any, index: number) => {
          const time = new Date(metric.timestamp);
          return time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        });

        const cpuData = sortedMetrics.map((m: any) => m.cpu_usage);
        const memoryData = sortedMetrics.map((m: any) => m.memory_usage);
        const networkData = sortedMetrics.map((m: any) => m.network_usage);
        const diskData = sortedMetrics.map((m: any) => m.disk_usage);

        setChartData({
          labels,
          datasets: [
            {
              label: 'CPU Usage',
              data: cpuData,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
            },
            {
              label: 'Memory Usage',
              data: memoryData,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.1,
            },
            {
              label: 'Network Usage',
              data: networkData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.1,
            },
            {
              label: 'Disk Usage',
              data: diskData,
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgba(255, 205, 86, 0.2)',
              tension: 0.1,
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching system metrics for chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsData();
    const interval = setInterval(fetchMetricsData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { chartData, loading };
};
