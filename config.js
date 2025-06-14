// AWIP Enhanced Configuration with Dual-Repository Operational Standards
// Comprehensive system configuration for frontend and backend coordination

const AWIPConfig = {
    // System Information
    version: "2.0.0",
    buildDate: new Date().toISOString(),
    environment: "production",

    // Dual-Repository Architecture Configuration
    repositories: {
        frontend: {
            name: "awip-mission-control",
            owner: "cjaisingh",
            url: "https://github.com/cjaisingh/awip-mission-control",
            deployment: "https://cjaisingh.github.io/awip-mission-control/",
            type: "public",
            technologies: ["HTML5", "CSS3", "JavaScript ES6+", "Tailwind CSS", "D3.js", "SortableJS"],
            operational_standards: {
                tools: ["GitHub_REST_API", "Direct_URL_Testing"],
                forbidden: ["jupyter_code_executor"],
                verification_method: "Live GitHub Pages URL testing",
                deployment_method: "GitHub Pages (automatic)"
            }
        },
        backend: {
            name: "Genspark-AWIP",
            owner: "cjaisingh", 
            url: "https://github.com/cjaisingh/Genspark-AWIP",
            type: "private",
            technologies: ["Node.js", "Supabase", "Agent Framework", "Self-Evolving Systems"],
            operational_standards: {
                tools: ["GitHub_REST_API", "Private_API_Testing"],
                forbidden: ["jupyter_code_executor"],
                verification_method: "Repository commit confirmation",
                deployment_method: "Private infrastructure deployment"
            }
        }
    },

    // Database Configuration
    database: {
        supabase: {
            url: "https://nkjckkaqcdscrtzmmyyt.supabase.co",
            project_ref: "nkjckkaqcdscrtzmmyyt",
            vault_enabled: true,
            vault_functions: {
                get_credential: "get_awip_credential",
                available_keys: ["github_token", "openai_api_key", "supabase_service_key"]
            }
        }
    },

    // API Configuration
    api: {
        github: {
            base_url: "https://api.github.com",
            endpoints: {
                repos: "/repos/{owner}/{repo}",
                contents: "/repos/{owner}/{repo}/contents/{path}",
                commits: "/repos/{owner}/{repo}/commits"
            }
        },
        supabase: {
            functions_url: "https://nkjckkaqcdscrtzmmyyt.supabase.co/functions/v1",
            rest_url: "https://nkjckkaqcdscrtzmmyyt.supabase.co/rest/v1"
        }
    },

    // Agent System Configuration
    agents: {
        total_count: 19,
        enhanced_agents: [20],
        agent_20: {
            name: "Discussion Continuity Agent",
            enhancements: [
                "Design System Integration",
                "Component Editor Capabilities", 
                "Floating Property Panels",
                "Self-Evolving Framework",
                "Cross-Repository Coordination"
            ],
            status: "enhanced",
            capabilities: [
                "discussion_continuity",
                "design_system_management",
                "component_editing",
                "workflow_visualization",
                "operational_standards_enforcement"
            ]
        },
        evolution_algorithms: {
            textgrad: {
                enabled: true,
                optimization_rate: 0.12,
                active_agents: 7,
                performance_improvement: "+12.4%"
            },
            aflow: {
                enabled: true,
                workflow_efficiency: 0.087,
                optimized_flows: 23,
                performance_improvement: "+8.7%"
            },
            mipro: {
                enabled: true,
                prompt_quality: 0.152,
                iterations: 156,
                performance_improvement: "+15.2%"
            }
        }
    },

    // Component Editor Configuration
    componentEditor: {
        enabled: true,
        features: {
            floating_panels: true,
            real_time_editing: true,
            drag_and_drop: true,
            property_editing: true,
            live_preview: true
        },
        panel_settings: {
            default_width: 320,
            default_height: "auto",
            backdrop_blur: "20px",
            border_color: "rgba(0, 212, 255, 0.3)",
            z_index: 1000
        },
        components: {
            header: { enabled: true, template: "awip-header-component" },
            navigation: { enabled: true, template: "awip-nav-component" },
            search: { enabled: true, template: "awip-search-component" },
            data_panel: { enabled: true, template: "awip-data-panel" }
        }
    },

    // Workflow Visualization Configuration
    visualization: {
        d3: {
            enabled: true,
            canvas_size: {
                width: "100%",
                height: "400px"
            },
            force_simulation: {
                charge_strength: -300,
                link_distance: 50,
                collision_radius: 30
            },
            styling: {
                primary_node_color: "#ff0080",
                secondary_node_color: "#00d4ff",
                link_color: "#00d4ff",
                text_color: "#ffffff"
            }
        },
        sortable: {
            enabled: true,
            animation_duration: 150,
            ghost_class: "sortable-ghost",
            chosen_class: "sortable-chosen"
        }
    },

    // Drag and Drop Configuration
    dragDrop: {
        sortablejs: {
            enabled: true,
            version: "1.15.0",
            cdn_url: "https://cdn.jsdelivr.net/npm/sortablejs@1.15.0",
            default_options: {
                animation: 150,
                ghostClass: "sortable-ghost",
                chosenClass: "sortable-chosen",
                dragClass: "sortable-drag"
            }
        }
    },

    // State Management Configuration
    stateManagement: {
        enabled: true,
        persistence: {
            local_storage: true,
            session_storage: false,
            history_limit: 100
        },
        events: {
            agent_update: true,
            workflow_change: true,
            component_edit: true,
            evolution_cycle: true
        }
    },

    // Performance Monitoring
    performance: {
        monitoring: {
            enabled: true,
            update_interval: 5000,
            metrics_retention: 100
        },
        evolution_cycle: {
            interval: 30000,
            algorithms: ["textgrad", "aflow", "mipro"]
        },
        real_time_updates: {
            system_metrics: 5000,
            agent_status: 5000,
            connection_status: 10000
        }
    },

    // UI Theme Configuration
    theme: {
        colors: {
            primary: "#00d4ff",
            secondary: "#ff0080", 
            background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
            text: "#ffffff",
            success: "#10b981",
            warning: "#f59e0b",
            error: "#ef4444",
            info: "#3b82f6"
        },
        effects: {
            glass_effect: "rgba(255, 255, 255, 0.05)",
            backdrop_blur: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
        },
        animations: {
            transition_duration: "0.3s",
            hover_transform: "translateY(-5px)",
            card_shadow: "0 20px 40px rgba(0, 212, 255, 0.2)"
        }
    },

    // Security Configuration
    security: {
        csrf_protection: true,
        content_security_policy: true,
        api_token_rotation: true,
        vault_encryption: true,
        operational_standards: {
            token_validation: "required_before_all_operations",
            verification_protocol: "live_url_and_commit_confirmation",
            error_handling: "graceful_fallback_with_user_notification"
        }
    },

    // Feature Flags
    features: {
        dual_repository_mode: true,
        agent_20_enhancements: true,
        self_evolving_framework: true,
        component_editor: true,
        workflow_visualization: true,
        floating_panels: true,
        operational_standards: true,
        cross_repository_coordination: true
    },

    // Deployment Configuration
    deployment: {
        frontend: {
            platform: "GitHub Pages",
            auto_deploy: true,
            url: "https://cjaisingh.github.io/awip-mission-control/",
            verification_endpoints: [
                "/",
                "/mobile.html",
                "/realtime-mobile.html",
                "/mobile-fixed.html"
            ]
        },
        backend: {
            platform: "Private Infrastructure",
            auto_deploy: false,
            verification_method: "commit_confirmation"
        }
    },

    // Environment-specific overrides
    environments: {
        development: {
            debug: true,
            verbose_logging: true,
            mock_data: true
        },
        staging: {
            debug: false,
            verbose_logging: true,
            mock_data: false
        },
        production: {
            debug: false,
            verbose_logging: false,
            mock_data: false
        }
    },

    // Integration Endpoints
    integrations: {
        supabase_vault: {
            endpoint: "rpc/get_awip_credential",
            method: "POST",
            auth_required: true
        },
        github_api: {
            base_url: "https://api.github.com",
            auth_method: "token",
            rate_limit: 5000
        }
    },

    // Operational Standards Enforcement
    operationalStandards: {
        repository_coordination: {
            frontend_backend_sync: "api_calls",
            authentication_flow: "supabase_vault_backend_frontend",
            deployment_sequence: [
                "update_backend_apis",
                "update_frontend_consumers", 
                "verify_integration",
                "document_changes"
            ]
        },
        tool_selection: {
            approved: ["GitHub_REST_API", "Direct_URL_Testing", "Private_API_Testing"],
            forbidden: ["jupyter_code_executor"],
            fallback_procedures: "manual_verification_with_user_guidance"
        },
        verification_requirements: {
            frontend: "live_github_pages_testing",
            backend: "commit_sha_verification",
            integration: "end_to_end_functionality_testing"
        }
    }
};

// Configuration validation
AWIPConfig.validate = function() {
    const required = ['version', 'repositories', 'agents', 'operationalStandards'];
    const missing = required.filter(key => !this[key]);

    if (missing.length > 0) {
        console.error('❌ Missing required configuration:', missing);
        return false;
    }

    console.log('✅ AWIP Configuration validated successfully');
    return true;
};

// Environment-specific configuration loader
AWIPConfig.loadEnvironment = function(env = 'production') {
    const envConfig = this.environments[env];
    if (envConfig) {
        Object.assign(this, envConfig);
        console.log(`🔧 Environment configuration loaded: ${env}`);
    }
};

// Helper functions
AWIPConfig.getRepositoryConfig = function(type) {
    return this.repositories[type] || null;
};

AWIPConfig.getAgentConfig = function(agentId) {
    return this.agents[`agent_${agentId}`] || null;
};

AWIPConfig.isFeatureEnabled = function(feature) {
    return this.features[feature] === true;
};

AWIPConfig.getOperationalStandard = function(category) {
    return this.operationalStandards[category] || null;
};

// Initialize configuration
if (typeof window !== 'undefined') {
    window.AWIPConfig = AWIPConfig;
    AWIPConfig.validate();
    AWIPConfig.loadEnvironment();
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWIPConfig;
}

console.log('🚀 AWIP Enhanced Configuration loaded with dual-repository operational standards');