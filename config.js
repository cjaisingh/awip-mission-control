// AWIP Configuration - PUBLIC SAFE VERSION
// NO credentials - uses placeholder values only

const AWIP_CONFIG = {
    version: '2.0.0',
    environment: 'public-safe',
    lastUpdated: '2025-06-15T07:55:00.000Z',

    // Repository Configuration - Safe to include URLs
    repositories: {
        public: {
            url: 'https://github.com/cjaisingh/awip-mission-control',
            type: 'public',
            deployment: 'demo'
        },
        private: {
            url: 'https://github.com/cjaisingh/Genspark-AWIP',
            type: 'private', 
            deployment: 'secure'
        }
    },

    // Database Configuration - DEMO MODE ONLY
    database: {
        provider: 'supabase',
        projectUrl: '[CONFIGURED_IN_PRIVATE_REPO]',
        anonKey: '[CONFIGURED_IN_PRIVATE_REPO]',
        serviceKey: '[CONFIGURED_IN_PRIVATE_REPO]',
        credentialFunction: 'get_awip_credential',
        connectionVerified: false,
        tablesAvailable: ['demo_mode']
    },

    // Agent System Configuration
    agents: {
        total: 20,
        active: 20,
        agent20: {
            name: 'Discussion Continuity Agent',
            healthScore: 9.9,
            handoffProtocols: true,
            capabilities: ['automation', 'analysis', 'discussion_tracking']
        }
    },

    // Desktop Foundation Layout
    desktopFoundation: {
        layout: 'three-panel',
        panels: {
            left: { width: '280px', collapsedWidth: '60px' },
            center: { flexible: true },
            right: { width: '280px', collapsedWidth: '60px' }
        },
        design: {
            framework: 'Tailwind CSS 2.2.19',
            icons: 'Font Awesome 6.4.0',
            charts: 'Chart.js',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    },

    // Demo Mode Configuration
    demoMode: {
        enabled: true,
        message: 'This is a public demo. For full functionality, see private deployment.',
        mockData: true
    }
};

// Public Demo Notice
console.log('📢 AWIP Public Demo Version');
console.log('🔒 For secure deployment with real data, see private repository');
console.log('🎯 This version displays mock data only');

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AWIP_CONFIG };
} else if (typeof window !== 'undefined') {
    window.AWIP_CONFIG = AWIP_CONFIG;
}
