// AWIP Agent 20 Handoff Interface
// Purpose: Specialized interface for Agent 20 to update conversation state and generate handoffs

class Agent20HandoffInterface {
    constructor() {
        this.handoffManager = new AWIPHandoffManager();
        this.agentId = 'agent_20';
        this.sessionId = this.generateSessionId();
        this.autoReportInterval = null;

        console.log('ð¤ Agent 20 Handoff Interface initialized');
        this.startAutoReporting();
    }

    generateSessionId() {
        return `agent20_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    // Agent 20 reports current system status
    async reportSystemStatus(statusData) {
        console.log('ð Agent 20 reporting system status:', statusData);

        const reportData = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            systemHealth: statusData.systemHealth || 75,
            phase: statusData.phase || 'monitoring',
            working: statusData.workingComponents || {
                "github_repos": "operational",
                "database": "connected", 
                "mission_control": "deployed"
            },
            broken: statusData.brokenComponents || {},
            priorities: statusData.priorities || [
                'Maintain conversation continuity',
                'Monitor credit usage',
                'Prevent infinite loops'
            ],
            actions: statusData.immediateActions || [
                'Update conversation state',
                'Generate handoff prompts',
                'Monitor system health'
            ],
            issues: statusData.blockingIssues || [
                'Handoff delivery mechanism',
                'Conversation initialization'
            ],
            recommendations: statusData.recommendations || [
                'Use conversation bridge for handoff prompts',
                'Check system status before starting work',
                'Follow established design guidelines'
            ],
            creditStatus: statusData.creditBurnStatus || 'monitoring',
            conversationCount: statusData.conversationCount || 1,
            creditsUsed: statusData.creditsUsed || 0,
            successRate: statusData.successRate || 0.75
        };

        const success = await this.handoffManager.agent20Report(reportData);

        if (success) {
            console.log('â Agent 20 status report successful');
            return await this.generateCurrentHandoff();
        } else {
            console.error('â Agent 20 status report failed');
            return null;
        }
    }

    // Generate handoff prompt for current conversation state
    async generateCurrentHandoff() {
        try {
            const shortPrompt = await this.handoffManager.getHandoffPrompt(false);
            const fullPrompt = await this.handoffManager.getHandoffPrompt(true);

            return {
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                shortPrompt: shortPrompt,
                fullPrompt: fullPrompt,
                instructions: [
                    'Copy the handoff prompt from the conversation bridge',
                    'Start new conversation with the prompt',
                    'System will have full context and continue work',
                    'No need to rebuild or start from scratch'
                ],
                bridgeUrl: 'conversation_bridge.html',
                dashboardUrl: 'https://cjaisingh.github.io/awip-mission-control/'
            };
        } catch (error) {
            console.error('â Failed to generate handoff:', error);
            return null;
        }
    }

    // Report conversation completion and prepare for handoff
    async completeConversation(completionData) {
        console.log('ð Agent 20 conversation completion:', completionData);

        const finalReport = {
            systemHealth: completionData.finalHealth || 80,
            phase: completionData.nextPhase || 'handoff_ready',
            workingComponents: completionData.working || {},
            brokenComponents: completionData.broken || {},
            priorities: completionData.nextPriorities || [],
            immediateActions: completionData.nextActions || [],
            blockingIssues: completionData.issues || [],
            recommendations: [
                'Use conversation bridge for next session',
                'Continue from current system state',
                'Check mission control dashboard for status',
                ...completionData.recommendations || []
            ],
            creditBurnStatus: completionData.creditStatus || 'stable',
            conversationCount: (completionData.conversationCount || 0) + 1,
            creditsUsed: completionData.totalCreditsUsed || 0,
            successRate: completionData.successRate || 0.8
        };

        const handoff = await this.reportSystemStatus(finalReport);

        if (handoff) {
            console.log('ð Handoff prepared for next conversation');
            return {
                status: 'handoff_ready',
                message: 'Conversation completed. Handoff prompt ready for next session.',
                handoff: handoff,
                bridgeInstructions: [
                    '1. Open conversation_bridge.html',
                    '2. Copy the handoff prompt',
                    '3. Start new conversation with the prompt',
                    '4. Continue work with full context'
                ]
            };
        } else {
            return {
                status: 'handoff_failed',
                message: 'Failed to prepare handoff. Manual intervention required.',
                fallbackInstructions: [
                    'Check Supabase database connection',
                    'Verify system status manually',
                    'Use emergency startup prompt as fallback'
                ]
            };
        }
    }

    // Emergency status report for critical issues
    async emergencyReport(emergencyData) {
        console.log('ð¨ Agent 20 emergency report:', emergencyData);

        const emergencyReport = {
            systemHealth: 25, // Low health for emergency
            phase: 'emergency_recovery',
            workingComponents: emergencyData.stillWorking || {},
            brokenComponents: emergencyData.broken || {},
            priorities: [
                'Stop credit burn',
                'Restore basic functionality',
                'Prevent infinite loops'
            ],
            immediateActions: [
                'Access conversation bridge',
                'Check system status',
                'Use emergency protocols'
            ],
            blockingIssues: emergencyData.criticalIssues || [
                'System not responding',
                'Credit burn out of control',
                'Infinite conversation loops'
            ],
            recommendations: [
                'Use conversation bridge immediately',
                'Check emergency startup prompt',
                'Contact system administrator',
                'Implement emergency protocols'
            ],
            creditBurnStatus: 'critical',
            conversationCount: emergencyData.conversationCount || 1,
            creditsUsed: emergencyData.creditsUsed || 12000,
            successRate: 0.1 // Very low success rate for emergency
        };

        return await this.reportSystemStatus(emergencyReport);
    }

    // Auto-reporting every 5 minutes to maintain system state
    startAutoReporting() {
        // Report every 5 minutes
        this.autoReportInterval = setInterval(async () => {
            try {
                await this.reportSystemStatus({
                    systemHealth: 80,
                    phase: 'monitoring',
                    creditBurnStatus: 'monitoring'
                });
            } catch (error) {
                console.error('â Auto-report failed:', error);
            }
        }, 5 * 60 * 1000); // 5 minutes

        console.log('â° Auto-reporting started (every 5 minutes)');
    }

    stopAutoReporting() {
        if (this.autoReportInterval) {
            clearInterval(this.autoReportInterval);
            this.autoReportInterval = null;
            console.log('â° Auto-reporting stopped');
        }
    }

    // Get current handoff instructions for user
    async getHandoffInstructions() {
        const handoff = await this.generateCurrentHandoff();

        if (handoff) {
            return {
                title: "ð AWIP Conversation Handoff Instructions",
                instructions: [
                    "To continue work in a new conversation:",
                    "",
                    "1. Open the conversation bridge:",
                    "   â conversation_bridge.html",
                    "",
                    "2. Copy the handoff prompt displayed",
                    "",
                    "3. Start your new conversation with:",
                    `   â ${handoff.shortPrompt.split('\n')[0]}`,
                    "",
                    "4. System will have full context and continue work",
                    "",
                    "This prevents starting over and stops credit burn!"
                ],
                bridgeUrl: handoff.bridgeUrl,
                dashboardUrl: handoff.dashboardUrl,
                timestamp: handoff.timestamp
            };
        } else {
            return {
                title: "â Handoff System Error",
                instructions: [
                    "Failed to generate handoff instructions.",
                    "",
                    "Emergency fallback:",
                    "1. Read: /AWIP-PROJECT-MEMORY/EMERGENCY_STARTUP_PROMPT_UPDATED.txt",
                    "2. Use GitHub tokens: ghp_Lh691*** and ghp_MQf23***",
                    "3. Connect to Supabase database",
                    "4. Check mission control dashboard"
                ],
                error: "Handoff system not responding"
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Agent20HandoffInterface;
}

// Global instance for browser use
if (typeof window !== 'undefined') {
    window.Agent20HandoffInterface = Agent20HandoffInterface;
    window.agent20Interface = new Agent20HandoffInterface();

    console.log('ð Agent 20 Interface ready globally as window.agent20Interface');
}

// Example usage for Agent 20:
/*
// Report current system status
await agent20Interface.reportSystemStatus({
    systemHealth: 85,
    phase: 'active_development',
    workingComponents: { "frontend": "operational", "database": "connected" },
    priorities: ['Fix handoff system', 'Improve frontend'],
    creditBurnStatus: 'stable'
});

// Complete conversation and prepare handoff
await agent20Interface.completeConversation({
    finalHealth: 90,
    nextPhase: 'testing',
    nextPriorities: ['Test handoff system', 'Deploy changes'],
    successRate: 0.9
});

// Get handoff instructions for user
const instructions = await agent20Interface.getHandoffInstructions();
console.log(instructions.instructions.join('\n'));
*/
