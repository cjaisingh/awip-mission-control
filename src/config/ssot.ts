// AWIP Mission Control - Single Source of Truth Configuration
// This file serves as the authoritative source for all application constants
// Version: 2.1.0

export const SSOT_CONFIG = {
  // Application Metadata
  app: {
    name: 'AWIP Mission Control',
    version: '2.1.0',
    description: 'AWIP Mission Control Dashboard - Enhanced with Operational Standards',
    environment: process.env.NODE_ENV || 'development',
    lastUpdated: '2025-01-15'
  },

  // Agent Configuration
  agents: {
    total: 20,
    active: 20,
    selfEvolving: 12,
    healthThresholds: {
      excellent: 95,
      good: 85,
      warning: 70,
      critical: 50
    },
    agent20: {
      name: 'Discussion Continuity Agent',
      enhanced: true,
      designSystem: true,
      handoffProtocols: true,
      healthScore: 9.9,
      capabilities: [
        'automation',
        'analysis', 
        'discussion_tracking',
        'Component Editor',
        'Floating Property Panels',
        'Real-time Editing',
        'Design System Integration'
      ]
    }
  },

  // UI/Design System
  design: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      gradients: {
        cognitive: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    },
    fonts: {
      sans: ['Inter', 'system-ui', 'sans-serif']
    },
    spacing: {
      panelSizes: {
        left: { default: 300, min: 200, max: 600 },
        right: { default: 350, min: 200, max: 600 }
      }
    }
  },

  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    endpoints: {
      agents: '/api/agents',
      metrics: '/api/metrics',
      logs: '/api/logs',
      system: '/api/system',
      health: '/api/health'
    },
    timeout: 10000,
    retryAttempts: 3
  },

  // Database Configuration
  database: {
    provider: 'supabase',
    projectUrl: process.env.REACT_APP_SUPABASE_URL || 'https://lubapfzpcfffksxtusga.supabase.co',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmFwZnpwY2ZmZmtzeHR1c2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTg5NDUsImV4cCI6MjA3MDIzNDk0NX0.cZ14GhRLDr5ENu6NeaxtehWCNjIIUFGyxZcrGjuLoo0',
    serviceRoleKey: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY,
    tables: ['system_status', 'documents', 'agents', 'handoffs']
  },

  // System Configuration
  system: {
    refreshInterval: 30000, // 30 seconds
    healthCheckInterval: 15000,
    statusUpdateInterval: 30000,
    maxLogEntries: 100,
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 3
  },

  // Monitoring Configuration
  monitoring: {
    metricsInterval: 5000,
    logUpdateInterval: 10000,
    systemStatsInterval: 30000,
    alertThresholds: {
      cpu: 80,
      memory: 85,
      network: 90,
      disk: 90
    }
  },

  // Security Configuration
  security: {
    enableCSP: true,
    enableHTTPS: true,
    sanitizeInputs: true,
    auditLogging: true,
    secretsManagement: 'environment-variables',
    credentialMasking: true
  },

  // Feature Flags
  features: {
    selfEvolution: true,
    componentEditor: true,
    workflowVisualization: true,
    realTimeMonitoring: true,
    multimodalProcessing: true,
    agent20HandoffProtocols: true,
    panelResize: true,
    keyboardShortcuts: true,
    mobileOptimized: true
  },

  // Repository Configuration
  repositories: {
    frontend: {
      name: 'awip-mission-control',
      url: 'https://github.com/cjaisingh/awip-mission-control',
      type: 'public'
    },
    backend: {
      name: 'awip-backend',
      url: process.env.BACKEND_REPO_URL || '[PRIVATE_REPOSITORY_URL]',
      type: 'private'
    }
  }
};

// Type definitions for TypeScript support
export interface SSOTConfig {
  app: {
    name: string;
    version: string;
    description: string;
    environment: string;
    lastUpdated: string;
  };
  agents: {
    total: number;
    active: number;
    selfEvolving: number;
    healthThresholds: {
      excellent: number;
      good: number;
      warning: number;
      critical: number;
    };
    agent20: {
      name: string;
      enhanced: boolean;
      designSystem: boolean;
      handoffProtocols: boolean;
      healthScore: number;
      capabilities: string[];
    };
  };
  design: {
    colors: {
      primary: Record<string, string>;
      gradients: {
        cognitive: string;
        primary: string;
      };
    };
    fonts: {
      sans: string[];
    };
    spacing: {
      panelSizes: {
        left: { default: number; min: number; max: number };
        right: { default: number; min: number; max: number };
      };
    };
  };
  api: {
    baseUrl: string;
    endpoints: Record<string, string>;
    timeout: number;
    retryAttempts: number;
  };
  database: {
    provider: string;
    projectUrl?: string;
    anonKey?: string;
    serviceRoleKey?: string;
    tables: string[];
  };
  system: {
    refreshInterval: number;
    healthCheckInterval: number;
    statusUpdateInterval: number;
    maxLogEntries: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  monitoring: {
    metricsInterval: number;
    logUpdateInterval: number;
    systemStatsInterval: number;
    alertThresholds: {
      cpu: number;
      memory: number;
      network: number;
      disk: number;
    };
  };
  security: {
    enableCSP: boolean;
    enableHTTPS: boolean;
    sanitizeInputs: boolean;
    auditLogging: boolean;
    secretsManagement: string;
    credentialMasking: boolean;
  };
  features: {
    selfEvolution: boolean;
    componentEditor: boolean;
    workflowVisualization: boolean;
    realTimeMonitoring: boolean;
    multimodalProcessing: boolean;
    agent20HandoffProtocols: boolean;
    panelResize: boolean;
    keyboardShortcuts: boolean;
    mobileOptimized: boolean;
  };
  repositories: {
    frontend: {
      name: string;
      url: string;
      type: string;
    };
    backend: {
      name: string;
      url: string;
      type: string;
    };
  };
}

// Utility functions for accessing SSOT configuration
export const getSSOTConfig = (): SSOTConfig => SSOT_CONFIG;

export const getVersion = (): string => SSOT_CONFIG.app.version;
export const getAgentCount = (): number => SSOT_CONFIG.agents.total;
export const getActiveAgentCount = (): number => SSOT_CONFIG.agents.active;
export const getPrimaryColor = (): string => SSOT_CONFIG.design.colors.primary[500];
export const getCognitiveGradient = (): string => SSOT_CONFIG.design.colors.gradients.cognitive;

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SSOT_CONFIG, getSSOTConfig, getVersion, getAgentCount, getActiveAgentCount, getPrimaryColor, getCognitiveGradient };
} else if (typeof window !== 'undefined') {
  (window as any).SSOT_CONFIG = SSOT_CONFIG;
  (window as any).getSSOTConfig = getSSOTConfig;
  (window as any).getVersion = getVersion;
  (window as any).getAgentCount = getAgentCount;
  (window as any).getActiveAgentCount = getActiveAgentCount;
  (window as any).getPrimaryColor = getPrimaryColor;
  (window as any).getCognitiveGradient = getCognitiveGradient;
}

export default SSOT_CONFIG;
