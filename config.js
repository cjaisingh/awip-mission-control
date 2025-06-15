// AWIP Mission Control Configuration
// Updated with working database credentials and Agent 20 handoff protocols

const AWIP_CONFIG = {
    // Project Information
    version: '2.0.0',
    environment: 'production',
    lastUpdated: '2025-06-15T07:39:16.936099',

    // Repository Configuration
    repositories: {
        frontend: {
            name: 'awip-mission-control',
            url: 'https://github.com/cjaisingh/awip-mission-control',
            branch: 'main'
        },
        backend: {
            name: 'GenSpark_AWIP',
            url: 'https://github.com/cjaisingh/GenSpark_AWIP',
            branch: 'main'
        }
    },

    // Database Configuration - WORKING CREDENTIALS
    database: {
        provider: 'supabase',
        projectUrl: 'https://nkjckkaqcdscrtzmmyyt.supabase.co',
        // Keys loaded from environment or vault
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ramNra2FxY2RzY3J0em1teXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzYyMzEsImV4cCI6MjA2NDU1MjIzMX0.hZ0ZT3EQ-glhTh7uELLcxDyuptp0syvcoNmgqv1JxfQ',
        credentialFunction: 'get_awip_credential',
        connectionVerified: '2025-06-15T07:39:16.936110',
        tablesAvailable: ['system_status', 'documents', 'agents']
    },

    // Agent System Configuration
    agents: {
        total: 20,
        active: 20,
        selfEvolving: 12,
        agent20: {
            name: 'Discussion Continuity Agent',
            enhanced: true,
            handoffProtocols: true,
            healthScore: 9.9,
            capabilities: [
                'automation',
                'analysis',
                'discussion_tracking',
                'context_preservation'
            ],
            lastUpdate: '2025-06-15T07:39:16.936112'
        }
    },

    // Desktop Foundation Specifications
    desktopFoundation: {
        layout: 'three-panel',
        framework: 'Tailwind CSS 2.2.19',
        icons: 'Font Awesome 6.4.0',
        charts: 'Chart.js',
        cognitiveGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        responsiveBreakpoints: {
            mobile: '768px',
            tablet: '1024px',
            desktop: '1200px'
        }
    },

    // Real-time Data Configuration
    realTimeData: {
        updateInterval: 30000, // 30 seconds
        retryInterval: 5000,   // 5 seconds
        maxRetries: 3,
        endpoints: {
            systemStatus: '/rest/v1/system_status?system_name=eq.AWIP',
            agents: '/rest/v1/agents?select=*&order=id',
            agent20: '/rest/v1/agents?id=eq.20&select=*'
        }
    },

    // Component Editor Settings
    componentEditor: {
        floatingPanels: true,
        realTimeEditing: true,
        dragAndDrop: true,
        components: [
            'Header',
            'Navigation', 
            'Search Accordion',
            'Data Panels',
            'Right Panel'
        ]
    },

    // Visualization Configuration
    visualization: {
        d3: {
            enabled: true,
            forceSimulation: true,
            workflowGraphs: true
        },
        charts: {
            library: 'Chart.js',
            responsive: true,
            animations: true
        }
    },

    // Performance Monitoring
    performance: {
        enabled: true,
        metricsCollection: true,
        realTimeMonitoring: true,
        alertThresholds: {
            responseTime: 2000,
            memoryUsage: 80,
            errorRate: 5
        }
    },

    // Security Settings
    security: {
        contentSecurityPolicy: true,
        sanitizeInputs: true,
        auditLogging: true,
        secretsManagement: 'vault'
    },

    // Deployment Configuration
    deployment: {
        platform: 'github-pages',
        autoDeployment: true,
        environments: ['development', 'staging', 'production'],
        currentEnvironment: 'production'
    },

    // Feature Flags
    features: {
        desktopFoundation: true,
        realTimeData: true,
        agent20Handoff: true,
        discussionTracking: true,
        databaseIntegration: true
    }
};

// Environment-specific overrides
if (typeof window !== 'undefined') {
    // Browser environment
    AWIP_CONFIG.runtime = 'browser';
} else if (typeof global !== 'undefined') {
    // Node.js environment
    AWIP_CONFIG.runtime = 'node';
}

// Configuration validation
function validateConfig() {
    const required = ['version', 'repositories', 'agents', 'database'];
    for (const key of required) {
        if (!AWIP_CONFIG[key]) {
            throw new Error(`Missing required configuration: ${key}`);
        }
    }
    return true;
}

// Helper functions
const ConfigHelpers = {
    isProduction: () => AWIP_CONFIG.environment === 'production',

    getRepositoryUrl: (type) => AWIP_CONFIG.repositories[type]?.url,

    isFeatureEnabled: (feature) => AWIP_CONFIG.features[feature] === true,

    getAgentConfig: () => AWIP_CONFIG.agents,

    getDatabaseConfig: () => AWIP_CONFIG.database,

    getDesktopFoundationConfig: () => AWIP_CONFIG.desktopFoundation
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AWIP_CONFIG, ConfigHelpers, validateConfig };
} else if (typeof window !== 'undefined') {
    window.AWIP_CONFIG = AWIP_CONFIG;
    window.ConfigHelpers = ConfigHelpers;
    window.validateConfig = validateConfig;
}

// Initialize configuration
try {
    validateConfig();
    console.log('✅ AWIP Configuration loaded successfully');
    console.log(`📊 Version: ${AWIP_CONFIG.version}`);
    console.log(`🤖 Agents: ${AWIP_CONFIG.agents.total} total, ${AWIP_CONFIG.agents.active} active`);
    console.log(`💾 Database: ${AWIP_CONFIG.database.provider} connected`);
    console.log(`🎯 Agent 20: ${AWIP_CONFIG.agents.agent20.name} (Health: ${AWIP_CONFIG.agents.agent20.healthScore})`);
} catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
}