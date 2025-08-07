import { useState, useEffect } from 'react';
import { getAgentMetrics, subscribeToAgentMetrics } from '../services/supabase';

export const useAgentMetrics = (agentId, timeRange = '24h') => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let subscription = null;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getAgentMetrics(agentId, timeRange);
        if (mounted) {
          setMetrics(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const handleMetricsUpdate = (payload) => {
      if (mounted) {
        setMetrics(prevMetrics => {
          const newMetrics = [...prevMetrics];
          const index = newMetrics.findIndex(m => m.id === payload.new.id);
          
          if (index >= 0) {
            newMetrics[index] = payload.new;
          } else {
            newMetrics.push(payload.new);
          }
          
          return newMetrics.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
        });
      }
    };

    fetchMetrics();
    subscription = subscribeToAgentMetrics(agentId, handleMetricsUpdate);

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [agentId, timeRange]);

  return { metrics, loading, error };
}; 