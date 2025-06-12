-- AWIP Multi-Agent Ecosystem Database Schema
-- Created: 2025-06-12T06:22:23.955112
-- Version: 1.0.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main agents registry table
CREATE TABLE IF NOT EXISTS agents (
    agent_id INTEGER PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    domain VARCHAR(200) NOT NULL,
    status VARCHAR(30) DEFAULT 'inactive',
    capabilities JSONB,
    configuration JSONB,
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inter-agent communication logs
CREATE TABLE IF NOT EXISTS agent_communications (
    comm_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_agent_id INTEGER REFERENCES agents(agent_id),
    receiver_agent_id INTEGER REFERENCES agents(agent_id),
    message_type VARCHAR(50) NOT NULL,
    message_content JSONB,
    status VARCHAR(30) DEFAULT 'sent',
    response JSONB,
    sent_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP
);

-- System-wide metrics collection
CREATE TABLE IF NOT EXISTS system_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id INTEGER REFERENCES agents(agent_id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,5),
    metric_unit VARCHAR(20),
    tags JSONB,
    collected_at TIMESTAMP DEFAULT NOW()
);

-- DevOps Agent specific tables
CREATE TABLE IF NOT EXISTS devops_deployments (
    deployment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    environment VARCHAR(50) NOT NULL,
    application VARCHAR(100) NOT NULL,
    version VARCHAR(50),
    status VARCHAR(30) DEFAULT 'pending',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    rollback_point VARCHAR(100),
    metrics JSONB,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Database Agent specific tables
CREATE TABLE IF NOT EXISTS database_operations (
    operation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_type VARCHAR(50) NOT NULL,
    database_name VARCHAR(100),
    query TEXT,
    execution_time DECIMAL(10,3),
    rows_affected INTEGER,
    status VARCHAR(30) DEFAULT 'completed',
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Strategic Agent specific tables
CREATE TABLE IF NOT EXISTS strategic_insights (
    insight_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    title VARCHAR(200),
    description TEXT,
    metrics JSONB,
    confidence_score DECIMAL(3,2),
    impact_level VARCHAR(20),
    recommendations JSONB,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Security Agent specific tables
CREATE TABLE IF NOT EXISTS security_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20),
    source_ip INET,
    target VARCHAR(200),
    description TEXT,
    threat_level INTEGER,
    status VARCHAR(30) DEFAULT 'investigating',
    mitigation_actions JSONB,
    false_positive BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Agent specific tables
CREATE TABLE IF NOT EXISTS analytics_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_type VARCHAR(50),
    value DECIMAL(15,5),
    unit VARCHAR(20),
    dimensions JSONB,
    tags JSONB,
    source VARCHAR(100),
    collected_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_communications_sender ON agent_communications(sender_agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_communications_receiver ON agent_communications(receiver_agent_id);
CREATE INDEX IF NOT EXISTS idx_system_metrics_agent ON system_metrics(agent_id);
CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_devops_deployments_status ON devops_deployments(status);
CREATE INDEX IF NOT EXISTS idx_database_operations_type ON database_operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_strategic_insights_type ON strategic_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_name ON analytics_metrics(metric_name);

-- Insert initial agent records
INSERT INTO agents (agent_id, agent_name, agent_type, domain, status, capabilities) VALUES
(1, 'DevOps Agent', 'Infrastructure Automation', 'DevOps & Deployment Management', 'active', 
 '{"infrastructure_provisioning": true, "cicd_automation": true, "container_orchestration": true, "monitoring": true}'),
(2, 'Database Agent', 'Data Management', 'Database Administration & Analytics', 'active',
 '{"performance_monitoring": true, "backup_management": true, "query_optimization": true, "analytics": true}'),
(3, 'Strategic Agent', 'Business Intelligence', 'Strategic Planning & Decision Support', 'active',
 '{"business_intelligence": true, "strategic_planning": true, "kpi_monitoring": true, "risk_assessment": true}'),
(4, 'Security Agent', 'Cybersecurity', 'Security & Compliance Monitoring', 'active',
 '{"threat_detection": true, "vulnerability_scanning": true, "compliance_monitoring": true, "incident_response": true}'),
(5, 'Analytics Agent', 'Performance Analytics', 'Performance Monitoring & Business Insights', 'active',
 '{"performance_monitoring": true, "predictive_analytics": true, "user_analytics": true, "data_visualization": true}');

-- Create views for agent ecosystem monitoring
CREATE OR REPLACE VIEW agent_ecosystem_status AS
SELECT 
    agent_id,
    agent_name,
    agent_type,
    status,
    last_heartbeat,
    CASE 
        WHEN last_heartbeat > NOW() - INTERVAL '2 minutes' THEN 'healthy'
        WHEN last_heartbeat > NOW() - INTERVAL '10 minutes' THEN 'warning'
        ELSE 'critical'
    END as health_status
FROM agents;

-- Create function for agent health monitoring
CREATE OR REPLACE FUNCTION update_agent_heartbeat(p_agent_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE agents 
    SET last_heartbeat = NOW(), updated_at = NOW()
    WHERE agent_id = p_agent_id;
END;
$$ LANGUAGE plpgsql;

-- Create function for logging agent communications
CREATE OR REPLACE FUNCTION log_agent_communication(
    p_sender_id INTEGER,
    p_receiver_id INTEGER,
    p_message_type VARCHAR(50),
    p_message_content JSONB
)
RETURNS UUID AS $$
DECLARE
    new_comm_id UUID;
BEGIN
    INSERT INTO agent_communications (sender_agent_id, receiver_agent_id, message_type, message_content)
    VALUES (p_sender_id, p_receiver_id, p_message_type, p_message_content)
    RETURNING comm_id INTO new_comm_id;

    RETURN new_comm_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Allow public read access on agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on agent_communications" ON agent_communications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on agent_communications" ON agent_communications FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on system_metrics" ON system_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on system_metrics" ON system_metrics FOR SELECT USING (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Initial system metrics for agents
INSERT INTO system_metrics (agent_id, metric_name, metric_value, metric_unit) VALUES
(1, 'deployments_successful', 127, 'count'),
(1, 'average_deployment_time', 245.5, 'seconds'),
(2, 'query_performance', 1.2, 'milliseconds'),
(2, 'database_uptime', 99.8, 'percent'),
(3, 'insights_generated', 23, 'count'),
(3, 'prediction_accuracy', 87.5, 'percent'),
(4, 'threats_detected', 15, 'count'),
(4, 'security_score', 94, 'score'),
(5, 'metrics_collected', 15847, 'count'),
(5, 'anomalies_detected', 3, 'count');

COMMIT;