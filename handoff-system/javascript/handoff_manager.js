// AWIP Conversation Handoff Manager
// Purpose: Manage conversation state and generate handoff prompts to stop infinite loops

class AWIPHandoffManager {
    constructor() {
        this.supabaseUrl = 'https://nkjckkaqcdscrtzmmyyt.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ramNra2FxY2RzY3J0em1teXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc5NDQ2NzQsImV4cCI6MjAzMzUyMDY3NH0.6z6oIgqfPZJKnvGGU7YfEcq5l7VyAJj5G5PJv8-2XYI';
        this.currentConversationId = this.generateConversationId();
        this.systemState = {};

        console.log('AWIP Handoff Manager initialized:', this.currentConversationId);
    }

    generateConversationId() {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 8);
        return `conv_${timestamp}_${random}`;
    }

    // Update system state from Agent 20
    async updateSystemState(stateData) {
        console.log('Updating system state:', stateData);

        this.systemState = {
            conversation_id: this.currentConversationId,
            system_health_percentage: stateData.healthPercentage || 75,
            current_phase: stateData.currentPhase || 'active_development',
            working_components: stateData.workingComponents || {},
            broken_components: stateData.brokenComponents || {},
            current_priorities: stateData.priorities || [],
            immediate_actions: stateData.immediateActions || [],
            blocking_issues: stateData.blockingIssues || [],
            agent_20_status: stateData.agent20Status || 'active',
            agent_20_recommendations: stateData.recommendations || [],
            credit_burn_status: stateData.creditBurnStatus || 'monitoring',
            updated_at: new Date().toISOString()
        };

        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/conversation_handoffs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'apikey': this.supabaseKey,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(this.systemState)
            });

            if (!response.ok) {
                // Try update instead of insert
                await this.updateExistingState();
            }

            console.log('â System state updated in database');
            return true;
        } catch (error) {
            console.error('â Failed to update system state:', error);
            return false;
        }
    }

    async updateExistingState() {
        const response = await fetch(
            `${this.supabaseUrl}/rest/v1/conversation_handoffs?conversation_id=eq.${this.currentConversationId}`, 
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'apikey': this.supabaseKey
                },
                body: JSON.stringify(this.systemState)
            }
        );

        if (!response.ok) {
            throw new Error(`Update failed: ${response.statusText}`);
        }
    }

    // Generate standardized handoff prompt
    generateHandoffPrompt(includeFullContext = false) {
        const timestamp = new Date().toLocaleString();
        const state = this.systemState;

        const shortPrompt = `AWIP HANDOFF - ${timestamp}

CURRENT STATUS:
â¢ System Health: ${state.system_health_percentage || 75}%
â¢ Phase: ${state.current_phase || 'active_development'}
â¢ Agent 20: ${state.agent_20_status || 'active'}
â¢ Credit Burn: ${state.credit_burn_status || 'monitoring'}

IMMEDIATE PRIORITIES:
${(state.current_priorities || []).map(p => `â¢ ${p}`).join('\n')}

ESSENTIAL INSTRUCTIONS:
1. Read emergency startup prompt: /AWIP-PROJECT-MEMORY/EMERGENCY_STARTUP_PROMPT_UPDATED.txt
2. Load design guidelines: /AWIP-UI-UX-DESIGN-SYSTEM/AWIP_UI_UX_Design_System_Complete.json
3. Use GitHub tokens: ghp_Lh691*** (awip-mission-control), ghp_MQf23*** (GenSpark_AWIP)
4. Connect to Supabase for current status
5. Follow established patterns - NO random changes

BLOCKING ISSUES:
${(state.blocking_issues || []).map(i => `â¢ ${i}`).join('\n')}

Continue from where previous conversation left off.`;

        if (!includeFullContext) {
            return shortPrompt;
        }

        const fullPrompt = `${shortPrompt}

FULL SYSTEM CONTEXT:
Working Components: ${JSON.stringify(state.working_components || {}, null, 2)}
Broken Components: ${JSON.stringify(state.broken_components || {}, null, 2)}

AGENT 20 RECOMMENDATIONS:
${(state.agent_20_recommendations || []).map(r => `â¢ ${r}`).join('\n')}

IMMEDIATE ACTIONS:
${(state.immediate_actions || []).map(a => `â¢ ${a}`).join('\n')}

DATABASE CONNECTION:
â¢ URL: https://nkjckkaqcdscrtzmmyyt.supabase.co
â¢ Status: Connected
â¢ Tables: conversation_handoffs, system_status_snapshots

GITHUB REPOSITORIES:
â¢ Primary: https://github.com/cjaisingh/awip-mission-control
â¢ Secondary: https://github.com/cjaisingh/GenSpark_AWIP

Last Updated: ${state.updated_at || timestamp}
Conversation ID: ${this.currentConversationId}`;

        return fullPrompt;
    }

    // Get current system state from database
    async getCurrentState() {
        try {
            const response = await fetch(
                `${this.supabaseUrl}/rest/v1/current_system_state?select=*&limit=1`, 
                {
                    headers: {
                        'Authorization': `Bearer ${this.supabaseKey}`,
                        'apikey': this.supabaseKey
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch state: ${response.statusText}`);
            }

            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('â Failed to get current state:', error);
            return null;
        }
    }

    // Create system status snapshot
    async createSnapshot(metrics = {}) {
        const snapshot = {
            conversation_id: this.currentConversationId,
            system_health: this.systemState.system_health_percentage || 75,
            active_agents: metrics.activeAgents || 20,
            system_phase: this.systemState.current_phase || 'active_development',
            key_metrics: {
                conversation_count: metrics.conversationCount || 1,
                credits_used: metrics.creditsUsed || 0,
                success_rate: metrics.successRate || 0.0,
                ...metrics
            },
            error_log: metrics.errors || [],
            created_by: 'handoff_manager'
        };

        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/system_status_snapshots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'apikey': this.supabaseKey
                },
                body: JSON.stringify(snapshot)
            });

            if (response.ok) {
                console.log('â System snapshot created');
                return true;
            } else {
                console.error('â Failed to create snapshot:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('â Snapshot creation error:', error);
            return false;
        }
    }

    // Interface for Agent 20 to report status
    async agent20Report(reportData) {
        console.log('ð Agent 20 Report received:', reportData);

        const stateUpdate = {
            healthPercentage: reportData.systemHealth || 75,
            currentPhase: reportData.phase || 'monitoring',
            workingComponents: reportData.working || {},
            brokenComponents: reportData.broken || {},
            priorities: reportData.priorities || [],
            immediateActions: reportData.actions || [],
            blockingIssues: reportData.issues || [],
            agent20Status: 'active_reporting',
            recommendations: reportData.recommendations || [],
            creditBurnStatus: reportData.creditStatus || 'monitoring'
        };

        const success = await this.updateSystemState(stateUpdate);

        if (success) {
            await this.createSnapshot({
                activeAgents: 20,
                conversationCount: reportData.conversationCount || 1,
                creditsUsed: reportData.creditsUsed || 0,
                successRate: reportData.successRate || 0.5
            });
        }

        return success;
    }

    // Get handoff prompt for new conversation
    async getHandoffPrompt(includeFullContext = false) {
        // First try to get latest state from database
        const latestState = await this.getCurrentState();

        if (latestState) {
            this.systemState = latestState;
        }

        return this.generateHandoffPrompt(includeFullContext);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AWIPHandoffManager;
}

// Global instance for browser use
if (typeof window !== 'undefined') {
    window.AWIPHandoffManager = AWIPHandoffManager;
    window.awipHandoff = new AWIPHandoffManager();

    console.log('ð AWIP Handoff Manager ready globally as window.awipHandoff');
}
