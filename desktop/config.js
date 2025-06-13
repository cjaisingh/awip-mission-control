// AWIP Mission Control Configuration
const AWIPConfig = {
    // System Configuration
    system: {
        name: 'AWIP Mission Control',
        version: '2.1.0',
        environment: 'production',
        debug: false,
        refreshInterval: 30000, // 30 seconds
        maxLogEntries: 50
    },

    // API Configuration
    api: {
        baseUrl: window.location.origin,
        endpoints: {
            agents: '/api/agents',
            metrics: '/api/metrics',
            logs: '/api/logs',
            system: '/api/system'
        },
        timeout: 10000,
        retryAttempts: 3
    },

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

    // Agent Configuration
    agents: {
        maxCount: 20,
        healthCheckInterval: 15000,
        statusUpdateInterval: 30000,
        healthThresholds: {
            excellent: 95,
            good: 85,
            warning: 70,
            critical: 50
        }
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

    // Deployment Configuration
    deployment: {
        platform: 'GitHub Pages',
        repository: 'cjaisingh/awip-mission-control',
        branch: 'main',
        path: '/desktop/',
        url: 'https://cjaisingh.github.io/awip-mission-control/desktop/',
        lastDeployed: new Date().toISOString(),
        version: '2.1.0'
    },

    // Security Configuration
    security: {
        enableCSP: true,
        enableHTTPS: true,
        sessionTimeout: 3600000, // 1 hour
        maxLoginAttempts: 3
    },

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