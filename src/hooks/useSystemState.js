import { useState, useEffect } from 'react';
import { getCurrentSystemState, subscribeToSystemState } from '../services/supabase';

export const useSystemState = () => {
  const [systemState, setSystemState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystemState = async () => {
      try {
        const data = await getCurrentSystemState();
        setSystemState(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemState();

    // Subscribe to real-time updates
    const subscription = subscribeToSystemState((payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        setSystemState(payload.new);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { systemState, loading, error };
}; 