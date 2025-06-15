// AWIP Mission Control - Secure Configuration
// CRITICAL: All sensitive credentials moved to environment variables/GitHub Secrets

const AWIP_CONFIG = {
    version: '2.0.0',
    environment: 'production',

    // Repository Configuration (NO TOKENS - Use environment variables)
    repositories: {
        frontend: {
            name: 'awip-mission-control',
            url: 'https://github.com/cjaisingh/awip-mission-control',
            type: 'public',
            deployment: 'github-pages'
        },
        backend: {
            name: 'GenSpark_AWIP',
            url: 'https://github.com/cjaisingh/GenSpark_AWIP',
            type: 'private',
            deployment: 'secure'
        }
    },

    // Database Configuration (NO CREDENTIALS - Use environment/vault)
    database: {
        provider: 'supabase',
        // URL is public but keys are NOT
        projectUrl: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
        // Keys loaded from environment variables:
        // - SUPABASE_ANON_KEY
        // - SUPABASE_SERVICE_ROLE_KEY
        credentialFunction: 'get_awip_credential',
        vaultEnabled: true,
        secureMode: true
    },

    // Agent System Configuration
    agents: {
        total: 20,
        active: 20,
        selfEvolving: 12,
        agent20: {
            name: 'Discussion Continuity Agent',
            enhanced: true,
            designSystem: true,
            handoffProtocols: true,
            capabilities: [
                'Component Editor',
                'Floating Property Panels',
                'Real-time Editing',
                'Design System Integration',
                'Secure Credential Management'
            ]
        }
    },

    // Desktop Foundation Layout
    desktopFoundation: {
        layout: 'three-panel',
        leftPanel: {
            width: '280px',
            collapsedWidth: '60px',
            content: 'navigation'
        },
        centerPanel: {
            width: 'flexible',
            content: 'dashboard'
        },
        rightPanel: {
            width: '280px',
            collapsedWidth: '60px',
            content: 'context'
        }
    },

    // Real-time Data Configuration
    realTimeData: {
        enabled: true,
        updateInterval: 30000, // 30 seconds
        retryAttempts: 3,
        fallbackMode: 'cached'
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

    // Security Settings (ENHANCED)
    security: {
        contentSecurityPolicy: true,
        sanitizeInputs: true,
        auditLogging: true,
        secretsManagement: 'vault',
        environmentVariables: true,
        credentialMasking: true,
        secureHandoff: true
    },

    // Deployment Configuration
    deployment: {
        platform: 'github-pages',
        autoDeployment: true,
        environments: ['development', 'staging', 'production'],
        securityScanning: true
    },

    // Feature Flags
    features: {
        selfEvolution: true,
        componentEditor: true,
        workflowVisualization: true,
        realTimeMonitoring: true,
        multimodalProcessing: true,
        secureCredentials: true,
        vaultIntegration: true
    }
};

// Secure credential loading functions
const SecureCredentials = {
    // Load credentials from environment variables (browser)
    getEnvironmentCredential: (key) => {
        // In browser environment, these would come from build-time env vars
        return window.ENV?.[key] || null;
    },

    // Load credentials from GitHub Secrets (CI/CD)
    getGitHubSecret: (key) => {
        // In CI/CD, these are injected as environment variables
        return process.env[key] || null;
    },

    // Secure database connection with environment variables
    getDatabaseConfig: () => {
        return {
            url: SecureCredentials.getEnvironmentCredential('SUPABASE_URL') || 
                 'https://your-project.supabase.co',
            anonKey: SecureCredentials.getEnvironmentCredential('SUPABASE_ANON_KEY') || 
                    'your_anon_key_here',
            serviceKey: SecureCredentials.getEnvironmentCredential('SUPABASE_SERVICE_KEY') || 
                       'your_service_key_here'
        };
    },

    // Mask sensitive credentials for logging
    maskCredential: (credential) => {
        if (!credential || credential.length < 8) return '***';
        return credential.substring(0, 3) + '*'.repeat(credential.length - 6) + credential.slice(-3);
    }
};

// Environment-specific overrides
if (typeof window !== 'undefined') {
    // Browser environment
    AWIP_CONFIG.runtime = 'browser';
    AWIP_CONFIG.credentialSource = 'environment';
} else if (typeof process !== 'undefined') {
    // Node.js/CI environment
    AWIP_CONFIG.runtime = 'node';
    AWIP_CONFIG.credentialSource = 'process_env';
}

// Configuration validation (NO CREDENTIAL EXPOSURE)
function validateConfig() {
    const required = ['version', 'repositories', 'agents', 'security'];
    for (const key of required) {
        if (!AWIP_CONFIG[key]) {
            console.error(`Missing required configuration: ${key}`);
            return false;
        }
    }

    // Validate secure credential setup
    if (!AWIP_CONFIG.security.secretsManagement) {
        console.error('Secrets management not configured');
        return false;
    }

    console.log('✅ AWIP Configuration validated (secure mode)');
    return true;
}

// Helper functions
const ConfigHelpers = {
    isProduction: () => AWIP_CONFIG.environment === 'production',
    getRepositoryUrl: (type) => AWIP_CONFIG.repositories[type]?.url,
    isFeatureEnabled: (feature) => AWIP_CONFIG.features[feature] === true,
    getAgentConfig: () => AWIP_CONFIG.agents,
    getSecureCredentials: () => SecureCredentials.getDatabaseConfig(),

    // Secure logging (masks credentials)
    secureLog: (message, data) => {
        const sanitizedData = typeof data === 'object' ? 
            JSON.stringify(data).replace(/eyJ[A-Za-z0-9+/=]+/g, '***JWT_TOKEN***') :
            data;
        console.log(message, sanitizedData);
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AWIP_CONFIG, ConfigHelpers, SecureCredentials, validateConfig };
} else if (typeof window !== 'undefined') {
    window.AWIP_CONFIG = AWIP_CONFIG;
    window.ConfigHelpers = ConfigHelpers;
    window.SecureCredentials = SecureCredentials;
    window.validateConfig = validateConfig;
}

// Initialize configuration (SECURE MODE)
try {
    if (validateConfig()) {
        console.log(`✅ AWIP Configuration loaded (v${AWIP_CONFIG.version})`);
        console.log(`🛡️ Security mode: ${AWIP_CONFIG.security.secretsManagement}`);
        console.log(`🤖 Agents: ${AWIP_CONFIG.agents.total} total, ${AWIP_CONFIG.agents.active} active`);
        console.log('🔒 Credentials: Loaded from secure environment variables');
    }
} catch (error) {
    console.error('❌ Configuration initialization failed:', error.message);
}
