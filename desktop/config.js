// AWIP Mission Control Configuration - SSOT COMPLIANT
const { SSOT_CONFIG } = require('../src/config/ssot');

const AWIPConfig = {
    // System Configuration - Now sourced from SSOT
    system: {
        name: SSOT_CONFIG.app.name,
        version: SSOT_CONFIG.app.version,
        environment: SSOT_CONFIG.app.environment,
        debug: false,
        refreshInterval: SSOT_CONFIG.system.refreshInterval,
        maxLogEntries: SSOT_CONFIG.system.maxLogEntries
    },

    // API Configuration - Now sourced from SSOT
    api: SSOT_CONFIG.api,

    // UI Configuration
    ui: {
        theme: 'dark',
        animations: true,
        autoRefresh: true,
        panelSizes: {
            left: { default: 300, min: 200, max: 600 },
            right: { default: 350, min: 200, max: 600 }
        },
        defaultTab: 'logs'
    },

    // Panel Configuration
    panels: {
        left: {
            title: 'System Overview',
            collapsible: true,
            resizable: true,
            defaultWidth: 300,
            minWidth: 200,
            maxWidth: 600
        },
        center: {
            title: 'Agent Dashboard',
            minWidth: 400
        },
        right: {
            title: 'Control Panel',
            collapsible: true,
            resizable: true,
            defaultWidth: 350,
            minWidth: 200,
            maxWidth: 600,
            tabs: ['logs', 'config', 'deploy', 'monitor']
        }
    },

    // Agent Configuration - Now sourced from SSOT
    agents: {
        maxCount: SSOT_CONFIG.agents.total,
        healthCheckInterval: SSOT_CONFIG.system.healthCheckInterval,
        statusUpdateInterval: SSOT_CONFIG.system.statusUpdateInterval,
        healthThresholds: SSOT_CONFIG.agents.healthThresholds
    },

    // Monitoring Configuration - Now sourced from SSOT
    monitoring: SSOT_CONFIG.monitoring,

    // Deployment Configuration
    deployment: {
        platform: 'GitHub Pages',
        repository: 'cjaisingh/awip-mission-control',
        branch: 'main',
        path: '/desktop/',
        url: 'https://cjaisingh.github.io/awip-mission-control/desktop/',
        lastDeployed: new Date().toISOString(),
        version: SSOT_CONFIG.app.version
    },

    // Security Configuration - Now sourced from SSOT
    security: SSOT_CONFIG.security,

    // Logging Configuration
    logging: {
        level: 'info',
        enableConsole: true,
        enableRemote: false,
        maxEntries: 100,
        categories: ['system', 'agent', 'user', 'error', 'deploy']
    },

    // Feature Flags
    features: {
        realTimeUpdates: true,
        agentDetails: true,
        systemMetrics: true,
        deploymentTools: true,
        advancedLogging: true,
        panelResize: true,
        keyboardShortcuts: true,
        mobileOptimized: true
    }
};

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWIPConfig;
} else if (typeof window !== 'undefined') {
    window.AWIPConfig = AWIPConfig;
}