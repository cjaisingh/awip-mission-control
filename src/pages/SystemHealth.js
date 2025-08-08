import React from 'react';
import { Line } from 'react-chartjs-2';
import { FaServer, FaDatabase, FaNetworkWired, FaMemory } from 'react-icons/fa';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { useSystemMetrics } from '../hooks/useSystemMetrics';

function SystemHealth() {
  console.log('SystemHealth component rendered');
  
  const systemHealth = useSystemHealth();
  const systemMetrics = useSystemMetrics();

  const performanceData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'CPU Usage',
        data: [45, 52, 48, 55, 50, 47],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Memory Usage',
        data: [60, 65, 58, 62, 59, 61],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  };

  const metrics = [
    {
      title: 'CPU Usage',
      value: `${systemMetrics.cpu}%`,
      icon: <FaServer className="text-blue-500" />,
      trend: systemMetrics.cpu > 50 ? '+2%' : '-1%',
      trendColor: systemMetrics.cpu > 50 ? 'text-red-500' : 'text-green-500',
    },
    {
      title: 'Memory Usage',
      value: `${systemMetrics.memory}%`,
      icon: <FaMemory className="text-green-500" />,
      trend: systemMetrics.memory > 70 ? '+3%' : '-1%',
      trendColor: systemMetrics.memory > 70 ? 'text-red-500' : 'text-green-500',
    },
    {
      title: 'Database Load',
      value: `${systemMetrics.disk}%`,
      icon: <FaDatabase className="text-purple-500" />,
      trend: '0%',
      trendColor: 'text-gray-500',
    },
    {
      title: 'Network Traffic',
      value: `${systemMetrics.network}%`,
      icon: <FaNetworkWired className="text-orange-500" />,
      trend: systemMetrics.network > 50 ? '+5%' : '+1%',
      trendColor: systemMetrics.network > 50 ? 'text-red-500' : 'text-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Health</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Refresh Metrics
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{metric.icon}</div>
              <span className={`text-sm font-medium ${metric.trendColor}`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{metric.title}</h3>
            <div className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <Line data={performanceData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Alerts</h3>
          <div className="space-y-4">
            {systemHealth.alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-3 rounded ${
                alert.type === 'warning' ? 'bg-yellow-50' : 
                alert.type === 'error' ? 'bg-red-50' : 'bg-gray-50'
              }`}>
                <div>
                  <p className={`font-medium ${
                    alert.type === 'warning' ? 'text-yellow-800' : 
                    alert.type === 'error' ? 'text-red-800' : 'text-gray-800'
                  }`}>{alert.message}</p>
                  <p className={`text-sm ${
                    alert.type === 'warning' ? 'text-yellow-600' : 
                    alert.type === 'error' ? 'text-red-600' : 'text-gray-500'
                  }`}>{alert.type} alert</p>
                </div>
                <span className={`text-sm ${
                  alert.type === 'warning' ? 'text-yellow-500' : 
                  alert.type === 'error' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Events</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">System Update</p>
                <p className="text-sm text-gray-500">Security patches applied</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Backup Complete</p>
                <p className="text-sm text-gray-500">Daily backup completed successfully</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemHealth; 