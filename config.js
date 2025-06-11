// AWIP Mission Control Dashboard Configuration
// This file contains configuration settings for the dashboard
// Sensitive credentials should be set via environment variables or GitHub secrets

const AWIP_CONFIG = {
    // GitHub Configuration
    github: {
        token: process.env.GITHUB_TOKEN || 'your-github-token-here',
        username: process.env.GITHUB_USERNAME || 'your-username',
        repository: 'Genspark-AWIP',
        apiUrl: 'https://api.github.com'
    },

    // Supabase Configuration  
    supabase: {
        url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
        serviceKey: process.env.SUPABASE_SERVICE_KEY || 'your-supabase-service-key',
        anonKey: process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key'
    },

    // Monitoring Configuration
    monitoring: {
        refreshInterval: 30000, // 30 seconds
        memoryThreshold: 80, // Percentage
        alertThreshold: 90, // Percentage
        maxLogEntries: 100
    },

    // Agent Configuration
    agents: [
        { id: 1, name: 'DevOps Agent', color: '#3b82f6', icon: 'fas fa-server' },
        { id: 2, name: 'Database Agent', color: '#10b981', icon: 'fas fa-database' },
        { id: 3, name: 'Strategic Agent', color: '#8b5cf6', icon: 'fas fa-brain' },
        { id: 15, name: 'AI Assistant Agent', color: '#f59e0b', icon: 'fas fa-robot' },
        { id: 16, name: 'UI/UX Agent', color: '#ec4899', icon: 'fas fa-paint-brush' }
    ],

    // Email Configuration
    email: {
        enabled: false, // Set to true when email service is configured
        alertEmail: 'your-email@example.com',
        smtpServer: 'smtp.gmail.com',
        smtpPort: 587
    },

    // Discussion Monitoring
    discussion: {
        tokenLimit: 4000,
        warningThreshold: 3200,
        criticalThreshold: 3600
    },

    // System Status Endpoints
    endpoints: {
        health: '/api/health',
        metrics: '/api/metrics',
        agents: '/api/agents',
        logs: '/api/logs'
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWIP_CONFIG;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.AWIP_CONFIG = AWIP_CONFIG;
}

// Setup instructions for sensitive data:
// 1. For GitHub Pages: Set repository secrets in GitHub Settings > Secrets and variables > Actions
// 2. For local development: Create a .env file with your credentials
// 3. For production: Use environment variables or secure configuration management

console.log('AWIP Dashboard Configuration Loaded');
console.log('Note: Please configure your API credentials before using the dashboard');
