// AWIP Mission Control Configuration - Security Enhanced
// Version: 2.1.0 - Operational Standards Compliant

const AWIP_CONFIG = {
    // System Information
    version: '2.1.0',
    buildDate: new Date().toISOString(),
    environment: 'production',

    // Repository Configuration (NO TOKENS - Use environment variables or secure vault)
    repositories: {
        frontend: {
            name: 'awip-mission-control',
            url: 'https://github.com/cjaisingh/awip-mission-control',
            branch: 'main',
            deployment: 'https://cjaisingh.github.io/awip-mission-control/'
        },
        backend: {
            name: 'Genspark-AWIP',
            url: 'https://github.com/cjaisingh/Genspark-AWIP',
            branch: 'main'
        }
    },

    // Database Configuration (NO CREDENTIALS - Use environment/vault)
    database: {
        provider: 'supabase',
        projectUrl: 'https://nkjckkaqcdscrtzmmyyt.supabase.co',
        // Keys should be loaded from environment variables:
        // - SUPABASE_ANON_KEY
        // - SUPABASE_SERVICE_ROLE_KEY
        credentialFunction: 'get_awip_credential'
    },

    // Agent System Configuration
    agents: {
        total: 19,
        active: 19,
        selfEvolving: 12,
        agent20: {
            name: 'Discussion Continuity Agent',
            enhanced: true,
            designSystem: true,
            capabilities: [
                'Component Editor',
                'Floating Property Panels',
                'Real-time Editing',
                'Design System Integration'
            ]
        }
    },

    // Evolution Algorithms
    evolution: {
        textGrad: {
            enabled: true,
            optimizationTarget: 'prompt_performance',
            learningRate: 0.01
        },
        aflow: {
            enabled: true,
            workflowOptimization: true,
            structureEvolution: true
        },
        mipro: {
            enabled: true,
            multiStepOptimization: true,
            promptRefinement: true
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

    // Drag & Drop Configuration
    dragDrop: {
        library: 'SortableJS',
        animation: 150,
        ghostClass: 'awip-ghost',
        chosenClass: 'awip-chosen'
    },

    // State Management
    stateManagement: {
        enabled: true,
        persistent: true,
        historyDepth: 100
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
        environments: ['development', 'staging', 'production']
    },

    // Feature Flags
    features: {
        selfEvolution: true,
        componentEditor: true,
        workflowVisualization: true,
        realTimeMonitoring: true,
        multimodalProcessing: true
    },

    // Operational Standards
    operationalStandards: {
        version: '1.0',
        toolHierarchy: [
            'GitHub_REST_API',
            'Direct_URL_Testing',
            'GitHub_CLI'
        ],
        forbiddenTools: ['jupyter_code_executor'],
        verificationRequired: true,
        reliabilityProtocol: 'Only_Report_Verified_Results'
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
    const required = ['version', 'repositories', 'agents', 'operationalStandards'];
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

    getOperationalStandards: () => AWIP_CONFIG.operationalStandards
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
} catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
}
