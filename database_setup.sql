-- AWIP Mission Control Database Setup
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Current System State Table
CREATE TABLE IF NOT EXISTS current_system_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID,
    system_status VARCHAR(50) DEFAULT 'operational',
    overall_health INTEGER DEFAULT 98,
    active_agents INTEGER DEFAULT 20,
    total_agents INTEGER DEFAULT 20,
    cpu_usage DECIMAL(5,2) DEFAULT 45.0,
    memory_usage DECIMAL(5,2) DEFAULT 60.0,
    network_usage DECIMAL(5,2) DEFAULT 28.0,
    disk_usage DECIMAL(5,2) DEFAULT 35.0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Status Snapshots Table
CREATE TABLE IF NOT EXISTS system_status_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    system_status VARCHAR(50),
    overall_health INTEGER,
    active_agents INTEGER,
    total_agents INTEGER,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    network_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2)
);

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    performance_score INTEGER DEFAULT 95,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    capabilities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Status Table
CREATE TABLE IF NOT EXISTS agent_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id INTEGER REFERENCES agents(id),
    status VARCHAR(50) DEFAULT 'active',
    health_score INTEGER DEFAULT 95,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tools_available TEXT[],
    memory_usage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent Metrics Table
CREATE TABLE IF NOT EXISTS agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id INTEGER REFERENCES agents(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    response_time DECIMAL(10,3),
    success_rate DECIMAL(5,2),
    error_count INTEGER DEFAULT 0
);

-- Agent Performance Table
CREATE TABLE IF NOT EXISTS agent_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id INTEGER REFERENCES agents(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    performance_score INTEGER,
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    average_response_time DECIMAL(10,3)
);

-- System Health Table
CREATE TABLE IF NOT EXISTS system_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    overall_health INTEGER DEFAULT 98,
    cpu_health INTEGER DEFAULT 95,
    memory_health INTEGER DEFAULT 90,
    network_health INTEGER DEFAULT 85,
    disk_health INTEGER DEFAULT 92,
    alerts JSONB DEFAULT '[]'::jsonb
);

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    network_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    active_connections INTEGER DEFAULT 0,
    requests_per_minute INTEGER DEFAULT 0
);

-- System Alerts Table
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    alert_type VARCHAR(50),
    severity VARCHAR(20) DEFAULT 'info',
    message TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Conversation Handoffs Table
CREATE TABLE IF NOT EXISTS conversation_handoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID,
    from_agent_id INTEGER REFERENCES agents(id),
    to_agent_id INTEGER REFERENCES agents(id),
    handoff_reason TEXT,
    handoff_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Graph Triples Table for File Ingestion Agent
CREATE TABLE IF NOT EXISTS graph_triples (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    relation TEXT NOT NULL,
    object TEXT NOT NULL,
    source_file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data
INSERT INTO current_system_state (system_status, overall_health, active_agents, total_agents) 
VALUES ('operational', 98, 20, 20)
ON CONFLICT DO NOTHING;

-- Insert sample agents
INSERT INTO agents (id, name, domain, status, performance_score, capabilities) VALUES
(1, 'DevOps Agent', 'Infrastructure', 'active', 95, ARRAY['deployment', 'monitoring', 'automation']),
(2, 'Database Agent', 'Data Management', 'active', 92, ARRAY['optimization', 'backup', 'migration']),
(3, 'Strategic Agent', 'Planning', 'active', 88, ARRAY['analysis', 'forecasting', 'optimization']),
(4, 'Security Agent', 'Cybersecurity', 'active', 96, ARRAY['threat_detection', 'vulnerability_assessment', 'incident_response']),
(5, 'Analytics Agent', 'Data Analytics', 'active', 94, ARRAY['data_analysis', 'reporting', 'insights']),
(6, 'Workflow Agent', 'Process Management', 'active', 90, ARRAY['workflow_automation', 'process_optimization', 'task_coordination']),
(7, 'Communication Agent', 'Communication', 'active', 93, ARRAY['messaging', 'notifications', 'collaboration']),
(8, 'Quality Agent', 'Quality Assurance', 'active', 91, ARRAY['testing', 'validation', 'quality_control']),
(9, 'Performance Agent', 'Performance Monitoring', 'active', 89, ARRAY['performance_analysis', 'optimization', 'monitoring']),
(10, 'Finance Agent', 'Financial Management', 'active', 87, ARRAY['budget_tracking', 'cost_analysis', 'financial_reporting']),
(11, 'Compliance Agent', 'Regulatory Compliance', 'active', 94, ARRAY['compliance_monitoring', 'audit_trail', 'regulatory_reporting']),
(12, 'Integration Agent', 'System Integration', 'active', 92, ARRAY['api_integration', 'data_synchronization', 'system_connectivity']),
(13, 'Backup Agent', 'Data Backup', 'active', 95, ARRAY['backup_management', 'disaster_recovery', 'data_protection']),
(14, 'Notification Agent', 'Alert Management', 'active', 93, ARRAY['alert_distribution', 'notification_routing', 'escalation_management']),
(15, 'Reporting Agent', 'Report Generation', 'active', 90, ARRAY['report_generation', 'data_visualization', 'insight_delivery']),
(16, 'UI/UX Agent', 'User Experience', 'active', 88, ARRAY['interface_optimization', 'user_experience', 'design_improvement']),
(17, 'Learning Agent', 'Machine Learning', 'active', 91, ARRAY['model_training', 'prediction_analysis', 'learning_optimization']),
(18, 'Prediction Agent', 'Predictive Analytics', 'active', 89, ARRAY['trend_analysis', 'forecasting', 'predictive_modeling']),
(19, 'Master Coordinator Agent', 'System Coordination', 'active', 96, ARRAY['coordination', 'orchestration', 'system_management']),
(20, 'Agent 20', 'Mission Control', 'active', 98, ARRAY['mission_control', 'system_orchestration', 'real_time_monitoring'])
ON CONFLICT (id) DO NOTHING;

-- Insert initial agent statuses
INSERT INTO agent_status (agent_id, status, health_score, tools_available)
SELECT id, status, performance_score, capabilities FROM agents
ON CONFLICT DO NOTHING;

-- Insert initial system health record
INSERT INTO system_health (overall_health, cpu_health, memory_health, network_health, disk_health)
VALUES (98, 95, 90, 85, 92)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_status_agent_id ON agent_status(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_timestamp ON agent_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created_at ON system_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_handoffs_conversation_id ON conversation_handoffs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_graph_triples_subject ON graph_triples(subject);
CREATE INDEX IF NOT EXISTS idx_graph_triples_relation ON graph_triples(relation);
CREATE INDEX IF NOT EXISTS idx_graph_triples_object ON graph_triples(object);
CREATE INDEX IF NOT EXISTS idx_graph_triples_source_file ON graph_triples(source_file);

-- Enable Row Level Security (RLS)
ALTER TABLE current_system_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_status_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_triples ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for demo purposes)
CREATE POLICY "Allow public read access" ON current_system_state FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON system_status_snapshots FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agents FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agent_status FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agent_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON agent_performance FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON system_health FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON system_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON system_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON conversation_handoffs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON graph_triples FOR SELECT USING (true);

-- Create policies for authenticated insert/update access
CREATE POLICY "Allow authenticated insert" ON current_system_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON current_system_state FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert" ON system_status_snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON agent_status FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON agent_status FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert" ON agent_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON agent_performance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON system_health FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON system_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON system_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON system_alerts FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert" ON conversation_handoffs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON conversation_handoffs FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated insert" ON graph_triples FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON graph_triples FOR UPDATE USING (true);

-- Create a function to update system status
CREATE OR REPLACE FUNCTION update_system_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current system state
    UPDATE current_system_state 
    SET 
        system_status = NEW.system_status,
        overall_health = NEW.overall_health,
        last_updated = NOW()
    WHERE id = (SELECT id FROM current_system_state LIMIT 1);
    
    -- Insert snapshot
    INSERT INTO system_status_snapshots (
        system_status, overall_health, active_agents, total_agents,
        cpu_usage, memory_usage, network_usage, disk_usage
    ) VALUES (
        NEW.system_status, NEW.overall_health, 
        (SELECT active_agents FROM current_system_state LIMIT 1),
        (SELECT total_agents FROM current_system_state LIMIT 1),
        (SELECT cpu_usage FROM current_system_state LIMIT 1),
        (SELECT memory_usage FROM current_system_state LIMIT 1),
        (SELECT network_usage FROM current_system_state LIMIT 1),
        (SELECT disk_usage FROM current_system_state LIMIT 1)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for system health updates
CREATE TRIGGER system_health_update_trigger
    AFTER INSERT ON system_health
    FOR EACH ROW
    EXECUTE FUNCTION update_system_status();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Success message
SELECT 'Database setup completed successfully!' as status;
