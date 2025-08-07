import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { SSOT_CONFIG } from '../config/ssot';

// SSOT (Single Source of Truth) Store
// This centralizes all application state and provides a single source of truth

export const useSSOTStore = create(
  subscribeWithSelector((set, get) => ({
    // System State
    system: {
      status: 'operational',
      health: 98,
      uptime: '99.97%',
      lastUpdated: new Date(),
      version: SSOT_CONFIG.app.version
    },

    // Agent State
    agents: {
      list: [],
      activeCount: 0,
      totalCount: SSOT_CONFIG.agents.total,
      agent20: {
        status: 'operational',
        healthScore: SSOT_CONFIG.agents.agent20.healthScore,
        lastActivity: new Date(),
        toolsAvailable: ['get_system_status', 'update_agent_status', 'generate_handoff_prompt', 'analyze_system_health']
      }
    },

    // System Metrics
    metrics: {
      cpu: 45,
      memory: 60,
      network: 28,
      disk: 35,
      lastUpdated: new Date()
    },

    // System Health
    health: {
      overall: 98,
      alerts: [],
      recommendations: [],
      lastUpdated: new Date()
    },

    // User Session
    session: {
      id: null,
      user: null,
      permissions: [],
      lastActivity: new Date()
    },

    // LangChain Agent State
    langchain: {
      isInitialized: false,
      sessionId: null,
      conversationHistory: [],
      tools: [],
      lastActivity: new Date()
    },

    // Database Connection
    database: {
      connected: false,
      url: process.env.REACT_APP_SUPABASE_URL,
      lastSync: null,
      error: null
    },

    // Real-time Updates
    realtime: {
      subscriptions: [],
      lastUpdate: new Date(),
      isConnected: false
    },

    // Actions - System
    updateSystemStatus: (status) => set((state) => ({
      system: {
        ...state.system,
        status,
        lastUpdated: new Date()
      }
    })),

    updateSystemHealth: (health) => set((state) => ({
      system: {
        ...state.system,
        health,
        lastUpdated: new Date()
      }
    })),

    // Actions - Agents
    updateAgents: (agents) => set((state) => ({
      agents: {
        ...state.agents,
        list: agents,
        activeCount: agents.filter(a => a.status === 'active').length,
        totalCount: agents.length,
        lastUpdated: new Date()
      }
    })),

    updateAgent20: (agent20Data) => set((state) => ({
      agents: {
        ...state.agents,
        agent20: {
          ...state.agents.agent20,
          ...agent20Data,
          lastActivity: new Date()
        }
      }
    })),

    // Actions - Metrics
    updateMetrics: (metrics) => set((state) => ({
      metrics: {
        ...state.metrics,
        ...metrics,
        lastUpdated: new Date()
      }
    })),

    // Actions - Health
    updateHealth: (health) => set((state) => ({
      health: {
        ...state.health,
        ...health,
        lastUpdated: new Date()
      }
    })),

    addAlert: (alert) => set((state) => ({
      health: {
        ...state.health,
        alerts: [...state.health.alerts, { ...alert, id: Date.now(), timestamp: new Date() }],
        lastUpdated: new Date()
      }
    })),

    // Actions - Session
    setSession: (session) => set((state) => ({
      session: {
        ...state.session,
        ...session,
        lastActivity: new Date()
      }
    })),

    clearSession: () => set((state) => ({
      session: {
        id: null,
        user: null,
        permissions: [],
        lastActivity: new Date()
      }
    })),

    // Actions - LangChain
    initializeLangChain: (sessionId) => set((state) => ({
      langchain: {
        ...state.langchain,
        isInitialized: true,
        sessionId,
        lastActivity: new Date()
      }
    })),

    updateConversationHistory: (message) => set((state) => ({
      langchain: {
        ...state.langchain,
        conversationHistory: [...state.langchain.conversationHistory, message],
        lastActivity: new Date()
      }
    })),

    // Actions - Database
    setDatabaseConnection: (connected, error = null) => set((state) => ({
      database: {
        ...state.database,
        connected,
        error,
        lastSync: connected ? new Date() : null
      }
    })),

    // Actions - Real-time
    setRealtimeConnection: (isConnected) => set((state) => ({
      realtime: {
        ...state.realtime,
        isConnected,
        lastUpdate: new Date()
      }
    })),

    // Utility Actions
    resetStore: () => set({
      system: {
        status: 'operational',
        health: 98,
        uptime: '99.97%',
        lastUpdated: new Date(),
        version: SSOT_CONFIG.app.version
      },
      agents: {
        list: [],
        activeCount: 0,
        totalCount: SSOT_CONFIG.agents.total,
        agent20: {
          status: 'operational',
          healthScore: SSOT_CONFIG.agents.agent20.healthScore,
          lastActivity: new Date(),
          toolsAvailable: ['get_system_status', 'update_agent_status', 'generate_handoff_prompt', 'analyze_system_health']
        }
      },
      metrics: {
        cpu: 45,
        memory: 60,
        network: 28,
        disk: 35,
        lastUpdated: new Date()
      },
      health: {
        overall: 98,
        alerts: [],
        recommendations: [],
        lastUpdated: new Date()
      },
      session: {
        id: null,
        user: null,
        permissions: [],
        lastActivity: new Date()
      },
      langchain: {
        isInitialized: false,
        sessionId: null,
        conversationHistory: [],
        tools: [],
        lastActivity: new Date()
      },
      database: {
        connected: false,
        url: process.env.REACT_APP_SUPABASE_URL,
        lastSync: null,
        error: null
      },
      realtime: {
        subscriptions: [],
        lastUpdate: new Date(),
        isConnected: false
      }
    }),

    // Computed Getters
    getSystemStatus: () => get().system.status,
    getAgent20Status: () => get().agents.agent20.status,
    getActiveAgentsCount: () => get().agents.activeCount,
    getOverallHealth: () => get().health.overall,
    isDatabaseConnected: () => get().database.connected,
    isRealtimeConnected: () => get().realtime.isConnected,
    isLangChainInitialized: () => get().langchain.isInitialized
  }))
);

// Auto-sync with localStorage
useSSOTStore.subscribe(
  (state) => {
    try {
      localStorage.setItem('awip-ssot-state', JSON.stringify({
        system: state.system,
        agents: state.agents,
        metrics: state.metrics,
        health: state.health,
        session: state.session,
        langchain: state.langchain,
        database: state.database,
        realtime: state.realtime
      }));
    } catch (error) {
      console.warn('Failed to save SSOT state to localStorage:', error);
    }
  }
);

// Initialize from localStorage on app start
export const initializeSSOTFromStorage = () => {
  try {
    const savedState = localStorage.getItem('awip-ssot-state');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      useSSOTStore.setState(parsedState);
    }
  } catch (error) {
    console.warn('Failed to load SSOT state from localStorage:', error);
  }
};

// Export for use in components
export default useSSOTStore;
