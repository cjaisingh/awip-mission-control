// AWIP Enhanced Configuration - Comprehensive system configuration
// Includes: Database connections, API endpoints, agent configurations, optimization settings

const AWIPConfig = {
    // System Information
    system: {
        name: "AWIP Mission Control",
        version: "2.1.0-enhanced",
        description: "AI-powered Web Intelligence Platform with Enhanced Vanilla Implementation",
        completion: 99.2,
        lastUpdated: new Date().toISOString()
    },

    // Environment Configuration
    environment: {
        mode: "production", // development, staging, production
        debug: false,
        logging: {
            level: "info", // debug, info, warn, error
            console: true,
            remote: false
        }
    },

    // Database Configuration
    database: {
        supabase: {
            url: "https://nkjckkaqcdscrtzmmyyt.supabase.co",
            publicKey: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", // Masked for security
            serviceRoleKey: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", // Retrieved from vault
            vault: {
                enabled: true,
                credentialFunction: "get_awip_credential",
                credentials: {
                    github_token: "github_token",
                    openai_api_key: "openai_api_key",
                    supabase_service_key: "supabase_service_key"
                }
            }
        },
        tables: {
            agents: "awip_agents",
            metrics: "awip_metrics",
            workflows: "awip_workflows",
            components: "awip_components",
            evolution_history: "awip_evolution_history"
        }
    },

    // GitHub Integration
    github: {
        repositories: {
            public: {
                owner: "cjaisingh",
                name: "awip-mission-control",
                url: "https://github.com/cjaisingh/awip-mission-control",
                branch: "main"
            },
            private: {
                owner: "cjaisingh", 
                name: "Genspark-AWIP",
                url: "https://github.com/cjaisingh/Genspark-AWIP",
                branch: "main"
            }
        },
        api: {
            baseUrl: "https://api.github.com",
            timeout: 30000,
            retries: 3
        }
    },

    // Agent System Configuration
    agents: {
        count: 19,
        evolutionEnabled: true,
        evolutionInterval: 30000, // 30 seconds
        performanceThreshold: 90,

        // Agent types and configurations
        types: {
            coordinator: {
                capabilities: ["memory", "context", "continuity", "orchestration"],
                maxConcurrency: 5,
                timeout: 10000
            },
            analyzer: {
                capabilities: ["nlp", "sentiment", "classification", "pattern_recognition"],
                maxConcurrency: 3,
                timeout: 15000
            },
            processor: {
                capabilities: ["transform", "aggregate", "filter", "compute"],
                maxConcurrency: 10,
                timeout: 5000
            },
            validator: {
                capabilities: ["testing", "validation", "verification", "quality_check"],
                maxConcurrency: 2,
                timeout: 20000
            },
            monitor: {
                capabilities: ["metrics", "alerts", "diagnostics", "health_check"],
                maxConcurrency: 1,
                timeout: 5000
            }
        },

        // Self-evolution configuration
        evolution: {
            algorithms: {
                textgrad: {
                    enabled: true,
                    threshold: 70,
                    improvement_rate: 0.1,
                    max_iterations: 10
                },
                aflow: {
                    enabled: true,
                    threshold: 75,
                    structure_optimization: true,
                    workflow_analysis: true
                },
                mipro: {
                    enabled: true,
                    threshold: 80,
                    instruction_optimization: true,
                    prompt_engineering: true
                }
            },
            metrics: {
                f1_score: { weight: 0.4, target: 85 },
                response_time: { weight: 0.3, target: 2.0 },
                accuracy: { weight: 0.3, target: 95 }
            }
        }
    },

    // Component Editor Configuration
    componentEditor: {
        enabled: true,
        floatingPanels: {
            enabled: true,
            draggable: true,
            resizable: true,
            defaultPosition: { x: 20, y: 20 },
            maxPanels: 5
        },
        components: {
            header: {
                template: "awip-header-component",
                properties: {
                    title: { type: "text", default: "AWIP Header" },
                    backgroundColor: { type: "color", default: "#1a1f3a" },
                    textColor: { type: "color", default: "#ffffff" },
                    padding: { type: "range", min: 0, max: 50, default: 20 }
                }
            },
            navigation: {
                template: "awip-nav-component", 
                properties: {
                    title: { type: "text", default: "Cognitive Domains" },
                    backgroundColor: { type: "color", default: "#2a2f4a" },
                    itemSpacing: { type: "range", min: 0, max: 20, default: 8 }
                }
            },
            dataPanel: {
                template: "awip-data-panel",
                properties: {
                    title: { type: "text", default: "System Architecture" },
                    borderColor: { type: "color", default: "#00d4ff" },
                    padding: { type: "range", min: 10, max: 40, default: 20 }
                }
            }
        },
        realTimeEditing: {
            enabled: true,
            debounceTime: 300,
            autoSave: true,
            saveInterval: 5000
        }
    },

    // Workflow Visualization Configuration
    workflowVisualization: {
        d3: {
            enabled: true,
            canvas: {
                width: 800,
                height: 400,
                background: "rgba(0, 0, 0, 0.2)"
            },
            forces: {
                link: { distance: 100 },
                charge: { strength: -300 },
                collision: { radius: 30 }
            },
            nodes: {
                radius: 25,
                colors: ["#00d4ff", "#ff0080", "#10b981", "#f59e0b"],
                strokeWidth: 2,
                strokeColor: "#ffffff"
            },
            links: {
                color: "#00d4ff",
                opacity: 0.6,
                strengthMultiplier: 3
            }
        },
        realTime: {
            enabled: true,
            updateInterval: 5000,
            animationDuration: 1000
        }
    },

    // Drag and Drop Configuration (SortableJS)
    dragDrop: {
        enabled: true,
        sortable: {
            animation: 150,
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            dragClass: "sortable-drag",
            fallbackClass: "sortable-fallback",
            fallbackOnBody: true,
            swapThreshold: 0.65,
            invertSwap: false,
            invertedSwapThreshold: 0.1,
            direction: "vertical"
        },
        containers: {
            agentList: {
                selector: "#sortable-list",
                onEnd: "handleAgentReorder"
            },
            componentLibrary: {
                selector: "#component-library",
                onEnd: "handleComponentReorder"
            }
        }
    },

    // State Management Configuration
    stateManagement: {
        persistence: {
            enabled: true,
            storage: "localStorage",
            prefix: "awip_state_",
            maxHistorySize: 1000,
            persistedStates: [
                "dashboard-config",
                "agent-preferences", 
                "component-layouts",
                "user-settings"
            ]
        },
        realTime: {
            enabled: true,
            broadcastChannel: "awip_state_sync",
            syncInterval: 1000
        }
    },

    // Performance Monitoring
    performance: {
        metrics: {
            enabled: true,
            collectInterval: 5000,
            retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
            aggregationInterval: 60000 // 1 minute
        },
        alerts: {
            enabled: true,
            thresholds: {
                cpu_usage: 80,
                memory_usage: 85,
                response_time: 5000,
                error_rate: 5
            }
        },
        charts: {
            updateInterval: 3000,
            maxDataPoints: 50,
            colors: {
                performance: "#00d4ff",
                load: "#ff0080",
                memory: "#10b981",
                cpu: "#f59e0b"
            }
        }
    },

    // UI/UX Configuration
    ui: {
        theme: {
            name: "awip-dark",
            colors: {
                primary: "#00d4ff",
                secondary: "#ff0080", 
                background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
                surface: "rgba(255, 255, 255, 0.05)",
                text: "#ffffff",
                textSecondary: "#a0a0a0"
            },
            effects: {
                glassEffect: {
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                },
                gradientBorder: {
                    border: "2px solid transparent",
                    backgroundClip: "padding-box, border-box",
                    backgroundImage: "linear-gradient(135deg, #0a0e27, #1a1f3a), linear-gradient(45deg, #00d4ff, #ff0080)"
                }
            }
        },
        animations: {
            enabled: true,
            duration: {
                fast: 150,
                normal: 300,
                slow: 500
            },
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
        },
        responsive: {
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1280
            },
            adaptiveLayout: true
        }
    },

    // Security Configuration
    security: {
        authentication: {
            enabled: true,
            tokenValidation: true,
            sessionTimeout: 3600000, // 1 hour
            refreshThreshold: 300000 // 5 minutes
        },
        api: {
            rateLimiting: {
                enabled: true,
                requests: 100,
                window: 60000 // 1 minute
            },
            cors: {
                enabled: true,
                origins: ["https://cjaisingh.github.io", "https://localhost:3000"]
            }
        },
        dataProtection: {
            encryptSensitiveData: true,
            maskTokensInLogs: true,
            auditLogging: true
        }
    },

    // Development Tools
    development: {
        hotReload: {
            enabled: false, // Only in development
            watchFiles: ["*.html", "*.js", "*.css"],
            port: 3001
        },
        debugging: {
            performance: true,
            stateChanges: false,
            agentActions: false,
            componentUpdates: false
        },
        testing: {
            enabled: false,
            coverage: false,
            e2e: false
        }
    },

    // Feature Flags
    features: {
        selfEvolvingAgents: true,
        componentEditor: true,
        workflowVisualization: true,
        realTimeMetrics: true,
        dragAndDrop: true,
        floatingPanels: true,
        aiAssistance: false, // Future feature
        multiDevicePreview: false, // Future feature
        collaborativeEditing: false, // Future feature
        advancedAnalytics: false // Future feature
    },

    // API Endpoints
    api: {
        base: "https://api.awip.platform", // Placeholder
        endpoints: {
            agents: "/api/v1/agents",
            metrics: "/api/v1/metrics", 
            workflows: "/api/v1/workflows",
            components: "/api/v1/components",
            evolution: "/api/v1/evolution",
            health: "/api/v1/health"
        },
        timeout: 30000,
        retries: 3,
        retryDelay: 1000
    },

    // Deployment Configuration
    deployment: {
        environment: "github-pages",
        cdn: {
            tailwind: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css",
            fontawesome: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css",
            chartjs: "https://cdn.jsdelivr.net/npm/chart.js",
            d3: "https://cdn.jsdelivr.net/npm/d3@7",
            sortable: "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0"
        },
        caching: {
            enabled: true,
            staticAssets: 86400, // 24 hours
            apiResponses: 300 // 5 minutes
        }
    }
};

// Configuration Validation
const ConfigValidator = {
    validate() {
        const errors = [];

        // Validate required fields
        if (!AWIPConfig.database.supabase.url) {
            errors.push("Supabase URL is required");
        }

        if (!AWIPConfig.agents.count || AWIPConfig.agents.count < 1) {
            errors.push("Agent count must be greater than 0");
        }

        // Validate ranges
        if (AWIPConfig.agents.evolutionInterval < 1000) {
            errors.push("Evolution interval must be at least 1000ms");
        }

        if (AWIPConfig.performance.metrics.collectInterval < 1000) {
            errors.push("Metrics collection interval must be at least 1000ms");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

// Configuration Helper Functions
const ConfigHelper = {
    // Get nested configuration value with default fallback
    get(path, defaultValue = null) {
        return path.split('.').reduce((obj, key) => {
            return obj && obj[key] !== undefined ? obj[key] : defaultValue;
        }, AWIPConfig);
    },

    // Set nested configuration value
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, AWIPConfig);
        target[lastKey] = value;
    },

    // Check if feature is enabled
    isFeatureEnabled(feature) {
        return this.get(`features.${feature}`, false);
    },

    // Get database table name
    getTableName(table) {
        return this.get(`database.tables.${table}`, table);
    },

    // Get API endpoint
    getApiEndpoint(endpoint) {
        const base = this.get('api.base', '');
        const path = this.get(`api.endpoints.${endpoint}`, '');
        return base + path;
    },

    // Get theme color
    getThemeColor(color) {
        return this.get(`ui.theme.colors.${color}`, '#ffffff');
    },

    // Merge user configuration
    merge(userConfig) {
        function deepMerge(target, source) {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        deepMerge(AWIPConfig, userConfig);
    }
};

// Environment-specific configuration overrides
const EnvironmentConfig = {
    development: {
        environment: { debug: true, logging: { level: "debug" } },
        development: { hotReload: { enabled: true } },
        features: { aiAssistance: true }
    },

    staging: {
        environment: { debug: false, logging: { level: "info" } },
        api: { base: "https://staging-api.awip.platform" }
    },

    production: {
        environment: { debug: false, logging: { level: "warn" } },
        development: { debugging: { performance: false } },
        api: { base: "https://api.awip.platform" }
    }
};

// Apply environment-specific overrides
if (EnvironmentConfig[AWIPConfig.environment.mode]) {
    ConfigHelper.merge(EnvironmentConfig[AWIPConfig.environment.mode]);
}

// Validate configuration on load
const validation = ConfigValidator.validate();
if (!validation.valid) {
    console.error('AWIP Configuration Validation Failed:', validation.errors);
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AWIPConfig, ConfigHelper, ConfigValidator };
} else {
    window.AWIPConfig = AWIPConfig;
    window.ConfigHelper = ConfigHelper;
    window.ConfigValidator = ConfigValidator;
}

console.log('AWIP Enhanced Configuration Loaded - Version', AWIPConfig.system.version);
