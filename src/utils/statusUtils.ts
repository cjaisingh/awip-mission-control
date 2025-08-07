export type Status = 'active' | 'inactive' | 'warning' | 'error';
export type HealthStatus = 'healthy' | 'warning' | 'critical';

export const getStatusColor = (status: Status): string => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };
  return statusColors[status] || statusColors.inactive;
};

export const getHealthColor = (health: HealthStatus): string => {
  const healthColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500'
  };
  return healthColors[health] || 'bg-gray-500';
};

export const formatTimestamp = (timestamp: string | number | Date): string => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleTimeString();
};

export const calculateHealthScore = (metrics: {
  uptime: number;
  performance: number;
  errors: number;
}): number => {
  const { uptime, performance, errors } = metrics;
  const uptimeWeight = 0.4;
  const performanceWeight = 0.4;
  const errorsWeight = 0.2;

  const uptimeScore = uptime * uptimeWeight;
  const performanceScore = performance * performanceWeight;
  const errorsScore = (1 - errors) * errorsWeight;

  return Math.round((uptimeScore + performanceScore + errorsScore) * 10) / 10;
}; 