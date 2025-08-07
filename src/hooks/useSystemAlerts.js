import { useState, useEffect } from 'react';
import { getSystemAlerts, subscribeToSystemAlerts } from '../services/supabase';

export const useSystemAlerts = (limit = 10) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let subscription = null;

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await getSystemAlerts(limit);
        if (mounted) {
          setAlerts(data);
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

    const handleAlertUpdate = (payload) => {
      if (mounted) {
        setAlerts(prevAlerts => {
          const newAlerts = [...prevAlerts];
          
          switch (payload.eventType) {
            case 'INSERT':
              newAlerts.unshift(payload.new);
              if (newAlerts.length > limit) {
                newAlerts.pop();
              }
              break;
            case 'UPDATE':
              const index = newAlerts.findIndex(a => a.id === payload.new.id);
              if (index >= 0) {
                newAlerts[index] = payload.new;
              }
              break;
            case 'DELETE':
              return newAlerts.filter(a => a.id !== payload.old.id);
            default:
              break;
          }
          
          return newAlerts;
        });
      }
    };

    fetchAlerts();
    subscription = subscribeToSystemAlerts(handleAlertUpdate);

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [limit]);

  return { alerts, loading, error };
}; 