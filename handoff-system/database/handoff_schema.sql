-- AWIP Conversation Handoff System Database Schema
-- Purpose: Stop infinite loops and credit burn through reliable conversation continuity

-- Main conversation state table
CREATE TABLE IF NOT EXISTS conversation_handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Current system state
    system_health_percentage INTEGER DEFAULT 0,
    current_phase TEXT DEFAULT 'unknown',
    working_components JSONB DEFAULT '{}',
    broken_components JSONB DEFAULT '{}',

    -- Project status
    project_roadmap JSONB DEFAULT '{}',
    current_priorities TEXT[] DEFAULT '{}',
    immediate_actions TEXT[] DEFAULT '{}',
    blocking_issues TEXT[] DEFAULT '{}',

    -- Technical context
    github_repos JSONB DEFAULT '{}',
    database_status TEXT DEFAULT 'unknown',
    frontend_status JSONB DEFAULT '{}',
    design_guidelines_url TEXT,

    -- Agent 20 context
    agent_20_status TEXT DEFAULT 'unknown',
    agent_20_recommendations TEXT[] DEFAULT '{}',
    credit_burn_status TEXT DEFAULT 'unknown',

    -- Handoff prompt data
    handoff_prompt_short TEXT,
    handoff_prompt_full TEXT,
    handoff_instructions TEXT[] DEFAULT '{}',

    -- Metadata
    conversation_count INTEGER DEFAULT 1,
    total_credits_used INTEGER DEFAULT 0,
    success_rate DECIMAL DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversation_handoffs_conversation_id 
    ON conversation_handoffs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_handoffs_updated_at 
    ON conversation_handoffs(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_handoffs_active 
    ON conversation_handoffs(is_active) WHERE is_active = TRUE;

-- Function to automatically update timestamp
CREATE OR REPLACE FUNCTION update_conversation_handoff_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_update_conversation_handoff_timestamp 
    ON conversation_handoffs;
CREATE TRIGGER trigger_update_conversation_handoff_timestamp
    BEFORE UPDATE ON conversation_handoffs
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_handoff_timestamp();

-- System status snapshot table for historical tracking
CREATE TABLE IF NOT EXISTS system_status_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id TEXT REFERENCES conversation_handoffs(conversation_id),
    snapshot_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    system_health INTEGER,
    active_agents INTEGER DEFAULT 0,
    system_phase TEXT,
    key_metrics JSONB DEFAULT '{}',
    error_log TEXT[] DEFAULT '{}',

    created_by TEXT DEFAULT 'agent_20'
);

-- Current system state view (always shows latest)
CREATE OR REPLACE VIEW current_system_state AS
SELECT 
    conversation_id,
    system_health_percentage,
    current_phase,
    working_components,
    broken_components,
    current_priorities,
    immediate_actions,
    blocking_issues,
    agent_20_status,
    agent_20_recommendations,
    credit_burn_status,
    handoff_prompt_short,
    handoff_instructions,
    updated_at
FROM conversation_handoffs 
WHERE is_active = TRUE 
ORDER BY updated_at DESC 
LIMIT 1;

-- Insert initial system state if none exists
INSERT INTO conversation_handoffs (
    conversation_id,
    system_health_percentage,
    current_phase,
    working_components,
    current_priorities,
    immediate_actions,
    blocking_issues,
    agent_20_status,
    credit_burn_status,
    handoff_prompt_short,
    handoff_instructions
) VALUES (
    'initial_system_state',
    75,
    'handoff_system_deployment',
    '{"github_repos": "operational", "database": "connected", "agent_20": "active"}',
    ARRAY['Fix conversation handoff', 'Stop credit burn', 'Enable system visibility'],
    ARRAY['Deploy handoff system', 'Create conversation bridge', 'Test handoff protocol'],
    ARRAY['Infinite conversation loops', 'No handoff delivery mechanism', 'Agent 20 isolation'],
    'active_but_isolated',
    'high_10k_daily',
    'System deployment in progress. Handoff mechanism being established.',
    ARRAY[
        'Read emergency startup prompt from /AWIP-PROJECT-MEMORY/',
        'Load design guidelines from /AWIP-UI-UX-DESIGN-SYSTEM/',
        'Use GitHub tokens: ghp_Lh691*** and ghp_MQf23***',
        'Connect to Supabase database for current status',
        'Follow established design patterns - no random changes'
    ]
) ON CONFLICT (conversation_id) DO UPDATE SET
    updated_at = NOW(),
    system_health_percentage = EXCLUDED.system_health_percentage,
    current_phase = EXCLUDED.current_phase;

-- Comments for documentation
COMMENT ON TABLE conversation_handoffs IS 
    'Stores conversation state for AWIP handoff system to prevent infinite loops';
COMMENT ON TABLE system_status_snapshots IS 
    'Historical snapshots of system state for tracking and analysis';
COMMENT ON VIEW current_system_state IS 
    'Always shows the most recent active conversation state for handoff purposes';
