// AWIP Mission Control Dashboard Configuration
const AWIP_CONFIG = {
    // Supabase Configuration - Use environment variables in production
    supabase: {
        url: process.env.SUPABASE_URL || 'https://nkjckkaqcdscrtzmmyyt.supabase.co',
        anonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_KEY_HERE'
    },

    // GitHub Configuration - Use environment variables in production
    github: {
        token: process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE',
        repository: 'cjaisingh/awip-mission-control',
        api_base: 'https://api.github.com'
    },

    // Monitoring Configuration
    monitoring: {
        refreshInterval: 30000, // 30 seconds
        memoryThreshold: 85, // Percentage
        emailAlerts: false,
        maxLogEntries: 50,
        chartDataPoints: 10
    },

    // Agent Configuration
    agents: [
        {
            id: 'ai-assistant',
            name: 'AI Assistant Agent',
            description: 'Conversational Interface',
            color: '#3b82f6',
            icon: 'fas fa-comments',
            status: 'active'
        },
        {
            id: 'devops',
            name: 'DevOps Agent',
            description: 'Infrastructure Monitoring',
            color: '#10b981',
            icon: 'fas fa-server',
            status: 'monitoring'
        },
        {
            id: 'database',
            name: 'Database Agent', 
            description: 'Data Management',
            color: '#3b82f6',
            icon: 'fas fa-database',
            status: 'high-load'
        },
        {
            id: 'strategic',
            name: 'Strategic Agent',
            description: 'Strategic Planning',
            color: '#8b5cf6',
            icon: 'fas fa-chart-line',
            status: 'idle'
        }
    ],

    // Email Configuration (for alerts)
    email: {
        enabled: false,
        service: 'emailjs',
        serviceId: '',
        templateId: '',
        userId: ''
    },

    // Discussion Memory Configuration
    discussion: {
        maxTokens: 4000,
        warningThreshold: 0.8, // 80%
        criticalThreshold: 0.9 // 90%
    },

    // API Endpoints
    endpoints: {
        supabase_tables: '/rest/v1/information_schema.tables',
        github_repo: '/repos/cjaisingh/awip-mission-control',
        system_health: '/api/v1/system/health'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWIP_CONFIG;
}