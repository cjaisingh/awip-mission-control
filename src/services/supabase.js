import { createClient } from '@supabase/supabase-js';
import { mockApi } from './mockApi';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create Supabase client only if environment variables are available
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fallback to mock API if Supabase is not configured
const getDataWithFallback = async (supabaseFunction, mockFunction) => {
  if (isSupabaseConfigured && supabase) {
    try {
      return await supabaseFunction();
    } catch (error) {
      console.warn('Supabase query failed, falling back to mock data:', error);
      return await mockFunction();
    }
  } else {
    console.warn('Supabase not configured, using mock data');
    return await mockFunction();
  }
};

// Conversation Handoff System
export const getCurrentSystemState = async () => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('current_system_state')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getSystemStatus()
  );
};

export const getSystemStatusSnapshots = async (limit = 10) => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('system_status_snapshots')
        .select('*')
        .order('snapshot_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getSystemStatus()
  );
};

// Agent-related queries
export const getAgents = async () => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getAgents()
  );
};

export const getAgentStatus = async (agentId) => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('agent_status')
        .select('*')
        .eq('agent_id', agentId)
        .single();
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getAgentStatus()
  );
};

// New agent queries
export const getAgentMetrics = async (agentId, timeRange = '24h') => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .gte('timestamp', new Date(Date.now() - getTimeRangeInMs(timeRange)).toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getSystemMetrics()
  );
};

export const getAgentPerformance = async (agentId) => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('agent_performance')
        .select('*')
        .eq('agent_id', agentId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getAgentStatus()
  );
};

// System health queries
export const getSystemHealth = async () => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('system_health')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getSystemHealth()
  );
};

// New system health queries
export const getSystemMetrics = async (timeRange = '24h') => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('timestamp', new Date(Date.now() - getTimeRangeInMs(timeRange)).toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getSystemMetrics()
  );
};

export const getSystemAlerts = async (limit = 10) => {
  return getDataWithFallback(
    async () => {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
    async () => mockApi.getSystemHealth().then(health => health.alerts || [])
  );
};

// Real-time subscriptions (only work with Supabase)
export const subscribeToSystemState = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Real-time subscriptions require Supabase configuration');
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('system_state_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'conversation_handoffs' 
    }, callback)
    .subscribe();
};

export const subscribeToAgentStatus = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Real-time subscriptions require Supabase configuration');
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('agent_status_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'agent_status' 
    }, callback)
    .subscribe();
};

export const subscribeToSystemHealth = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Real-time subscriptions require Supabase configuration');
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('system_health_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'system_health' 
    }, callback)
    .subscribe();
};

// New real-time subscriptions
export const subscribeToAgentMetrics = (agentId, callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Real-time subscriptions require Supabase configuration');
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel(`agent_metrics_${agentId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'agent_metrics',
      filter: `agent_id=eq.${agentId}`
    }, callback)
    .subscribe();
};

export const subscribeToSystemAlerts = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Real-time subscriptions require Supabase configuration');
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('system_alerts')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'system_alerts'
    }, callback)
    .subscribe();
};

export const subscribeToSystemMetrics = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Real-time subscriptions require Supabase configuration');
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('system_metrics')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'system_metrics'
    }, callback)
    .subscribe();
};

// Utility functions
export const checkDatabaseConnection = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { connected: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('current_system_state')
      .select('conversation_id')
      .limit(1);
    
    if (error) throw error;
    return { connected: true, data };
  } catch (error) {
    console.error('Database connection error:', error);
    return { connected: false, error: error.message };
  }
};

const getTimeRangeInMs = (timeRange) => {
  const ranges = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  return ranges[timeRange] || ranges['24h'];
}; 