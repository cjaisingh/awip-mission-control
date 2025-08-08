import { SSOT_CONFIG } from '../config/ssot';

// Mock API service to handle missing backend endpoints - SSOT Compliant
const mockData = {
  systemStatus: {
    database: true,
    github: true,
    agent20: true
  },
  agentStatus: {
    healthScore: 9.9,
    status: 'operational'
  },
  systemMetrics: {
    cpu: 45,
    memory: 60,
    network: 28,
    disk: 35
  },
  systemHealth: {
    overall: 98,
    cpu: 45,
    memory: 60,
    network: 28,
    disk: 35,
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'High CPU Usage',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'info',
        message: 'System Update Complete',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ]
  },
  agents: [
    {
      id: 1,
      name: 'DevOps Agent',
      domain: 'Infrastructure',
      status: 'active',
      performance_score: 95,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['CI/CD', 'Monitoring', 'Deployment']
    },
    {
      id: 2,
      name: 'Database Agent',
      domain: 'Data Management',
      status: 'active',
      performance_score: 88,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Backup', 'Optimization', 'Security']
    },
    {
      id: 3,
      name: 'Security Agent',
      domain: 'Security',
      status: 'active',
      performance_score: 92,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Threat Detection', 'Compliance', 'Audit']
    },
    {
      id: 4,
      name: 'Analytics Agent',
      domain: 'Data Analytics',
      status: 'active',
      performance_score: 85,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Reporting', 'Visualization', 'Insights']
    },
    {
      id: 5,
      name: 'Workflow Agent',
      domain: 'Process Automation',
      status: 'active',
      performance_score: 90,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Automation', 'Orchestration', 'Scheduling']
    },
    // Additional agents to match SSOT configuration
    {
      id: 6,
      name: 'Communication Agent',
      domain: 'Communication',
      status: 'active',
      performance_score: 93,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Messaging', 'Notifications', 'Integration']
    },
    {
      id: 7,
      name: 'Quality Agent',
      domain: 'Quality Assurance',
      status: 'active',
      performance_score: 89,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Testing', 'Validation', 'Standards']
    },
    {
      id: 8,
      name: 'Performance Agent',
      domain: 'Performance',
      status: 'active',
      performance_score: 91,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Optimization', 'Monitoring', 'Analysis']
    },
    {
      id: 9,
      name: 'Finance Agent',
      domain: 'Finance',
      status: 'active',
      performance_score: 94,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Budgeting', 'Cost Analysis', 'Reporting']
    },
    {
      id: 10,
      name: 'Compliance Agent',
      domain: 'Compliance',
      status: 'active',
      performance_score: 86,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Regulatory', 'Audit', 'Standards']
    },
    {
      id: 11,
      name: 'Integration Agent',
      domain: 'Integration',
      status: 'active',
      performance_score: 88,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['API Management', 'Data Sync', 'Connectivity']
    },
    {
      id: 12,
      name: 'Backup Agent',
      domain: 'Backup & Recovery',
      status: 'active',
      performance_score: 92,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Backup', 'Recovery', 'Disaster Planning']
    },
    {
      id: 13,
      name: 'Notification Agent',
      domain: 'Notifications',
      status: 'active',
      performance_score: 90,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Alerts', 'Messaging', 'Delivery']
    },
    {
      id: 14,
      name: 'Reporting Agent',
      domain: 'Reporting',
      status: 'active',
      performance_score: 87,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Analytics', 'Dashboards', 'Insights']
    },
    {
      id: 15,
      name: 'UI/UX Agent',
      domain: 'User Experience',
      status: 'active',
      performance_score: 93,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Design', 'Usability', 'Accessibility']
    },
    {
      id: 16,
      name: 'Learning Agent',
      domain: 'Machine Learning',
      status: 'active',
      performance_score: 89,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Training', 'Prediction', 'Optimization']
    },
    {
      id: 17,
      name: 'Prediction Agent',
      domain: 'Predictive Analytics',
      status: 'active',
      performance_score: 91,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Forecasting', 'Modeling', 'Analysis']
    },
    {
      id: 18,
      name: 'Master Coordinator Agent',
      domain: 'Coordination',
      status: 'active',
      performance_score: 96,
      last_heartbeat: new Date().toISOString(),
      capabilities: ['Orchestration', 'Management', 'Coordination']
    },
    {
      id: 19,
      name: SSOT_CONFIG.agents.total.name,
      domain: 'Continuity',
      status: 'active',
      performance_score: 99,
      last_heartbeat: new Date().toISOString(),
      capabilities: SSOT_CONFIG.agents.total.capabilities
    }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async getSystemStatus() {
    await delay(500);
    return mockData.systemStatus;
  },

  async getAgentStatus() {
    await delay(300);
    return {
      healthScore: 9.9,
      status: 'operational'
    };
  },

  async getSystemMetrics() {
    await delay(400);
    return mockData.systemMetrics;
  },

  async getSystemHealth() {
    await delay(600);
    return mockData.systemHealth;
  },

  async getAgents() {
    await delay(800);
    return mockData.agents;
  },

  async sendChatMessage(message) {
    await delay(1000);
    return {
      response: `Mock response to: ${message}`,
      timestamp: new Date().toISOString()
    };
  }
};
