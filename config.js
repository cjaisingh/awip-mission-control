// AWIP Secure Configuration - Uses GitHub Secrets Environment Variables
// Version: 2.1.0 - SSOT COMPLIANT
// Last Updated: 2025-01-15

// Import SSOT configuration
const { SSOT_CONFIG } = require('./src/config/ssot');

const AWIP_CONFIG = {
    // Version and Environment - Now sourced from SSOT
    version: SSOT_CONFIG.app.version,
    environment: SSOT_CONFIG.app.environment,

    // Security Notice
    securityNotice: 'This configuration uses GitHub Secrets for all sensitive data',

    // Repository Configuration (NO TOKENS - Use environment variables)
    repositories: {
        frontend: {
            name: 'awip-mission-control',
            url: 'https://github.com/cjaisingh/awip-mission-control',
            type: 'public'
        },
        backend: {
            name: 'awip-backend',
            url: '[PRIVATE_REPOSITORY_URL]',
            type: 'private'
        }
    },

    // Database Configuration (NO CREDENTIALS - Use environment/vault)
    database: {
        provider: 'supabase',
        projectUrl: process.env.SUPABASE_URL || '[SET_IN_GITHUB_SECRETS]',
        // Environment variables expected:
        // - SUPABASE_URL
        // - SUPABASE_ANON_KEY
        // - SUPABASE_SERVICE_ROLE_KEY
        credentialFunction: 'get_awip_credential',
        connectionVerified: true,
        tablesAvailable: ['system_status', 'documents', 'agents']
    },

    // Agent System Configuration - Now sourced from SSOT
    agents: SSOT_CONFIG.agents,

    // GitHub Integration (SECURE - Uses Environment Variables)
    github: {
        token: process.env.MY_TOKEN || '[SET_IN_GITHUB_SECRETS]',
        repositories: {
            frontend: 'cjaisingh/awip-mission-control',
            backend: '[PRIVATE_REPO_NAME]'
        },
        api: {
            baseUrl: 'https://api.github.com',
            version: 'v3'
        }
    },

    // Desktop Foundation Configuration
    desktopFoundation: {
        layout: 'three-panel',
        panelSizes: {
            left: '280px',
            leftCollapsed: '60px',
            center: 'flexible',
            right: '280px',
            rightCollapsed: '60px'
        },
        designSystem: {
            framework: 'Tailwind CSS 2.2.19',
            icons: 'Font Awesome 6.4.0',
            charts: 'Chart.js',
            cognitiveGradient: SSOT_CONFIG.design.colors.gradients.cognitive
        },
        realTimeUpdates: {
            enabled: true,
            interval: 30000, // 30 seconds
            systemStatus: true,
            agentMonitoring: true
        }
    },

    // Security Settings
    security: {
        contentSecurityPolicy: true,
        sanitizeInputs: true,
        auditLogging: true,
        secretsManagement: 'github-secrets',
        credentialMasking: true
    },

    // Feature Flags
    features: {
        selfEvolution: true,
        componentEditor: true,
        workflowVisualization: true,
        realTimeMonitoring: true,
        multimodalProcessing: true,
        agent20HandoffProtocols: true
    }
};

// Secure Credentials Object - Uses Environment Variables Only
const SecureCredentials = {
    getSupabaseUrl: () => process.env.SUPABASE_URL,
    getSupabaseAnonKey: () => process.env.SUPABASE_ANON_KEY,
    getSupabaseServiceKey: () => process.env.SUPABASE_SERVICE_ROLE_KEY,
    getGitHubToken: () => process.env.MY_TOKEN,

    // Masked logging for security
    logCredentialStatus: () => {
        const supabaseUrl = process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 20)}***` : 'NOT_SET';
        const anonKey = process.env.SUPABASE_ANON_KEY ? `${process.env.SUPABASE_ANON_KEY.substring(0, 10)}***` : 'NOT_SET';
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}***` : 'NOT_SET';
        const githubToken = process.env.MY_TOKEN ? `${process.env.MY_TOKEN.substring(0, 7)}***` : 'NOT_SET';

        console.log('🔐 Credential Status (Masked):');
        console.log(`  SUPABASE_URL: ${supabaseUrl}`);
        console.log(`  SUPABASE_ANON_KEY: ${anonKey}`);
        console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceKey}`);
        console.log(`  MY_TOKEN: ${githubToken}`);
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AWIP_CONFIG, SecureCredentials };
} else if (typeof window !== 'undefined') {
    window.AWIP_CONFIG = AWIP_CONFIG;
    window.SecureCredentials = SecureCredentials;
}

// Initialize secure configuration
try {
    console.log('✅ AWIP Secure Configuration loaded successfully');
    console.log(`📊 Version: ${AWIP_CONFIG.version}`);
    console.log(`🤖 Agents: ${AWIP_CONFIG.agents.total} total, ${AWIP_CONFIG.agents.active} active`);
    console.log(`🔐 Security: GitHub Secrets management enabled`);
} catch (error) {
    console.error('❌ Secure Configuration validation failed:', error.message);
}
