// AWIP Desktop Dashboard - Configuration
// Configuration for connecting to the functional Agent 20 backend

const AWIP_CONFIG = {
    // Environment Configuration
    ENVIRONMENT: 'production', // 'development', 'staging', 'production'

    // Supabase Configuration (from functional Agent 20)
    SUPABASE: {
        URL: 'https://nkjckkaqcdscrtzmmyyt.supabase.co',
        ANON_KEY: '', // To be configured by user
        SERVICE_ROLE_KEY: '', // For server-side operations only

        // Database Tables
        TABLES: {
            MEMORY: 'awip_memory',
            SESSIONS: 'awip_sessions',
            AGENTS: 'awip_agents'
        },

        // Database Functions
        FUNCTIONS: {
            SAVE_MEMORY: 'save_awip_memory',
            LOAD_MEMORY: 'load_session_memory',
            SEARCH_MEMORY: 'search_awip_memory',
            GET_SESSION: 'get_session_summary',
            STORE_CREDENTIAL: 'store_awip_credential',
            GET_CREDENTIAL: 'get_awip_credential',
            VERIFY_SETUP: 'verify_awip_setup',
            INITIALIZE_USER: 'initialize_awip_user'
        }
    },

    // API Configuration
    APIS: {
        // GitHub Integration
        GITHUB: {
            BASE_URL: 'https://api.github.com',
            TOKEN: '', // To be configured by user
            HEADERS: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'AWIP-Dashboard/1.0'
            }
        },

        // OpenAI Integration
        OPENAI: {
            BASE_URL: 'https://api.openai.com/v1',
            API_KEY: '', // To be configured by user
            MODEL: 'gpt-4',
            HEADERS: {
                'Content-Type': 'application/json'
            }
        },

        // Dashboard API (if separate backend)
        DASHBOARD: {
            BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://awip-dashboard.netlify.app',
            WEBSOCKET_URL: process.env.NODE_ENV === 'development' ? 'ws://localhost:3000/ws' : 'wss://awip-dashboard.netlify.app/ws',
            ENDPOINTS: {
                HEALTH: '/api/health',
                METRICS: '/api/metrics',
                AGENTS: '/api/agents',
                SESSIONS: '/api/sessions'
            }
        }
    },

    // Agent 20 Specific Configuration
    AGENT_20: {
        VERSION: '2.0.0',
        SESSION_PREFIX: 'awip_session_',
        MEMORY_RETENTION_DAYS: 90,
        MAX_CONTEXT_LENGTH: 4000,
        DEFAULT_IMPORTANCE_SCORE: 5,

        // Capabilities
        CAPABILITIES: [
            'memory_persistence',
            'credential_management',
            'system_integration',
            'real_api_connections',
            'session_continuity'
        ],

        // Response Configuration
        RESPONSE_CONFIG: {
            MAX_TOKENS: 1000,
            TEMPERATURE: 0.7,
            TIMEOUT: 30000 // 30 seconds
        }
    },

    // UI Configuration
    UI: {
        // Responsive Breakpoints (matches CSS)
        BREAKPOINTS: {
            MOBILE: 767,
            TABLET: 1024,
            DESKTOP: 1440
        },

        // Theme Configuration
        THEME: {
            PRIMARY_COLOR: '#3b82f6',
            COGNITIVE_GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            SUCCESS_COLOR: '#10b981',
            WARNING_COLOR: '#f59e0b',
            ERROR_COLOR: '#ef4444',
            INFO_COLOR: '#3b82f6'
        },

        // Layout Configuration
        LAYOUT: {
            SIDEBAR_WIDTH: 280,
            SIDEBAR_COLLAPSED: 60,
            HEADER_HEIGHT: 64,
            DEFAULT_PANEL_STATE: {
                leftVisible: true,
                leftCollapsed: false,
                rightVisible: true,
                rightCollapsed: false
            }
        },

        // Animation Configuration
        ANIMATIONS: {
            DURATION_FAST: 150,
            DURATION_NORMAL: 300,
            DURATION_SLOW: 500,
            EASING: 'ease'
        },

        // Data Refresh Intervals
        REFRESH_INTERVALS: {
            REAL_TIME: 5000,     // 5 seconds
            FREQUENT: 30000,     // 30 seconds
            MODERATE: 60000,     // 1 minute
            INFREQUENT: 300000   // 5 minutes
        }
    },

    // Performance Configuration
    PERFORMANCE: {
        // Caching
        CACHE_DURATION: 300000, // 5 minutes
        MAX_CACHE_SIZE: 100,

        // Pagination
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100,

        // Debouncing
        SEARCH_DEBOUNCE: 300,
        RESIZE_DEBOUNCE: 150,

        // Request Timeouts
        API_TIMEOUT: 10000,
        UPLOAD_TIMEOUT: 60000
    },

    // Security Configuration
    SECURITY: {
        // CORS Configuration
        CORS_ORIGINS: [
            'https://awip-dashboard.netlify.app',
            'https://awip-mission-control.vercel.app',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ],

        // Content Security Policy
        CSP_DIRECTIVES: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://unpkg.com', 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
            'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
            'img-src': ["'self'", 'data:', 'https:'],
            'connect-src': ["'self'", 'https://nkjckkaqcdscrtzmmyyt.supabase.co', 'https://api.github.com', 'https://api.openai.com'],
            'font-src': ["'self'", 'https:'],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"]
        },

        // Session Configuration
        SESSION_TIMEOUT: 3600000, // 1 hour
        TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes before expiry

        // Data Sanitization
        SANITIZE_INPUT: true,
        VALIDATE_SCHEMAS: true
    },

    // Error Handling Configuration
    ERROR_HANDLING: {
        // Retry Configuration
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        EXPONENTIAL_BACKOFF: true,

        // Error Levels
        LEVELS: {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            FATAL: 4
        },

        // Error Reporting
        REPORT_ERRORS: true,
        ERROR_ENDPOINT: '/api/errors',

        // User Messages
        USER_FRIENDLY_MESSAGES: {
            NETWORK_ERROR: 'Connection lost. Please check your internet connection.',
            API_ERROR: 'Service temporarily unavailable. Please try again.',
            VALIDATION_ERROR: 'Please check your input and try again.',
            AUTH_ERROR: 'Session expired. Please sign in again.',
            PERMISSION_ERROR: 'You don't have permission to perform this action.',
            NOT_FOUND: 'The requested resource was not found.',
            SERVER_ERROR: 'Internal server error. Please try again later.'
        }
    },

    // Feature Flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        OFFLINE_MODE: false,
        ADVANCED_ANALYTICS: true,
        EXPORT_FUNCTIONALITY: true,
        DARK_MODE: false,
        BETA_FEATURES: false,
        DEBUG_MODE: false
    },

    // Deployment Configuration
    DEPLOYMENT: {
        // GitHub Pages
        GITHUB_PAGES: {
            BASE_PATH: '/awip-desktop-dashboard',
            ASSET_PREFIX: '/awip-desktop-dashboard'
        },

        // Netlify
        NETLIFY: {
            SITE_ID: '', // To be configured
            BUILD_COMMAND: 'npm run build',
            PUBLISH_DIR: 'dist',
            FUNCTIONS_DIR: 'netlify/functions'
        },

        // Vercel
        VERCEL: {
            PROJECT_ID: '', // To be configured
            BUILD_COMMAND: 'npm run build',
            OUTPUT_DIRECTORY: 'dist'
        },

        // Environment Variables
        REQUIRED_ENV_VARS: [
            'SUPABASE_URL',
            'SUPABASE_ANON_KEY'
        ],

        OPTIONAL_ENV_VARS: [
            'GITHUB_TOKEN',
            'OPENAI_API_KEY',
            'DASHBOARD_API_URL'
        ]
    },

    // Development Configuration
    DEVELOPMENT: {
        // Hot Reload
        HOT_RELOAD: true,
        SOURCE_MAPS: true,

        // Debugging
        VERBOSE_LOGGING: true,
        SHOW_PERFORMANCE_METRICS: true,

        // Mock Data
        USE_MOCK_DATA: false,
        MOCK_DELAY: 1000,

        // Development Server
        DEV_SERVER: {
            PORT: 3000,
            HOST: 'localhost',
            OPEN_BROWSER: true
        }
    }
};

// Utility Functions
const ConfigUtils = {
    // Get configuration value with fallback
    get: (path, fallback = null) => {
        return path.split('.').reduce((obj, key) => {
            return obj && obj[key] !== undefined ? obj[key] : fallback;
        }, AWIP_CONFIG);
    },

    // Check if feature is enabled
    isFeatureEnabled: (feature) => {
        return ConfigUtils.get(`FEATURES.${feature}`, false);
    },

    // Get API configuration
    getApiConfig: (apiName) => {
        return ConfigUtils.get(`APIS.${apiName.toUpperCase()}`, {});
    },

    // Get breakpoint value
    getBreakpoint: (breakpoint) => {
        return ConfigUtils.get(`UI.BREAKPOINTS.${breakpoint.toUpperCase()}`, 0);
    },

    // Check if environment is development
    isDevelopment: () => {
        return ConfigUtils.get('ENVIRONMENT') === 'development';
    },

    // Check if environment is production
    isProduction: () => {
        return ConfigUtils.get('ENVIRONMENT') === 'production';
    },

    // Get refresh interval
    getRefreshInterval: (type) => {
        return ConfigUtils.get(`UI.REFRESH_INTERVALS.${type.toUpperCase()}`, 30000);
    },

    // Validate required environment variables
    validateEnvironment: () => {
        const required = ConfigUtils.get('DEPLOYMENT.REQUIRED_ENV_VARS', []);
        const missing = required.filter(envVar => !localStorage.getItem(envVar));

        if (missing.length > 0) {
            console.warn('Missing required environment variables:', missing);
            return false;
        }

        return true;
    },

    // Initialize configuration from localStorage
    initializeFromStorage: () => {
        const settings = localStorage.getItem('awip_settings');
        if (settings) {
            try {
                const parsedSettings = JSON.parse(settings);

                // Update Supabase configuration
                if (parsedSettings.supabaseUrl) {
                    AWIP_CONFIG.SUPABASE.URL = parsedSettings.supabaseUrl;
                }
                if (parsedSettings.supabaseKey) {
                    AWIP_CONFIG.SUPABASE.ANON_KEY = parsedSettings.supabaseKey;
                }

                // Update API configurations
                if (parsedSettings.githubToken) {
                    AWIP_CONFIG.APIS.GITHUB.TOKEN = parsedSettings.githubToken;
                }
                if (parsedSettings.openaiKey) {
                    AWIP_CONFIG.APIS.OPENAI.API_KEY = parsedSettings.openaiKey;
                }

                return true;
            } catch (error) {
                console.error('Failed to parse settings from localStorage:', error);
                return false;
            }
        }

        return false;
    },

    // Save configuration to localStorage
    saveToStorage: (settings) => {
        try {
            localStorage.setItem('awip_settings', JSON.stringify(settings));
            ConfigUtils.initializeFromStorage();
            return true;
        } catch (error) {
            console.error('Failed to save settings to localStorage:', error);
            return false;
        }
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AWIP_CONFIG, ConfigUtils };
}

// Global access for browser environment
if (typeof window !== 'undefined') {
    window.AWIP_CONFIG = AWIP_CONFIG;
    window.ConfigUtils = ConfigUtils;

    // Initialize configuration on load
    document.addEventListener('DOMContentLoaded', () => {
        ConfigUtils.initializeFromStorage();
    });
}
