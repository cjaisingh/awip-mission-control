
-- ============================================================================
-- AWIP AGENTS ECOSYSTEM - ADDITIONAL SCHEMA FOR AGENTS 6-19
-- ============================================================================

-- Additional tables for new agents (6-19)

-- WORKFLOW AGENT (Agent #6) Tables
CREATE TABLE IF NOT EXISTS workflow_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    process_name VARCHAR(200) NOT NULL,
    process_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    priority INTEGER DEFAULT 3,
    steps_total INTEGER DEFAULT 0,
    steps_completed INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    estimated_duration INTERVAL,
    actual_duration INTERVAL,
    assigned_to VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID REFERENCES workflow_processes(id),
    task_name VARCHAR(200) NOT NULL,
    task_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    priority INTEGER DEFAULT 3,
    dependencies JSONB,
    assigned_to VARCHAR(100),
    estimated_duration INTERVAL,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- COMMUNICATION AGENT (Agent #7) Tables
CREATE TABLE IF NOT EXISTS communication_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    channel_name VARCHAR(200) NOT NULL,
    channel_type VARCHAR(100), -- email, slack, webhook, sms, etc.
    status VARCHAR(50) DEFAULT 'active',
    configuration JSONB,
    last_used TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communication_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES communication_channels(id),
    message_type VARCHAR(100),
    sender VARCHAR(200),
    recipient VARCHAR(200),
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority INTEGER DEFAULT 3,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- QUALITY AGENT (Agent #8) Tables
CREATE TABLE IF NOT EXISTS quality_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(100),
    test_suite VARCHAR(200),
    status VARCHAR(50) DEFAULT 'pending',
    environment VARCHAR(100),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration INTERVAL,
    passed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    skipped_count INTEGER DEFAULT 0,
    coverage_percentage DECIMAL(5,2),
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    metric_name VARCHAR(200) NOT NULL,
    metric_type VARCHAR(100),
    value DECIMAL(10,4),
    target_value DECIMAL(10,4),
    unit VARCHAR(50),
    status VARCHAR(50),
    measured_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PERFORMANCE AGENT (Agent #9) Tables
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    metric_name VARCHAR(200) NOT NULL,
    metric_category VARCHAR(100),
    current_value DECIMAL(10,4),
    target_value DECIMAL(10,4),
    threshold_warning DECIMAL(10,4),
    threshold_critical DECIMAL(10,4),
    unit VARCHAR(50),
    status VARCHAR(50),
    trend VARCHAR(50),
    measured_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_optimizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    optimization_name VARCHAR(200) NOT NULL,
    optimization_type VARCHAR(100),
    target_component VARCHAR(200),
    status VARCHAR(50) DEFAULT 'proposed',
    priority INTEGER DEFAULT 3,
    expected_improvement DECIMAL(5,2),
    actual_improvement DECIMAL(5,2),
    implemented_at TIMESTAMP,
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- FINANCE AGENT (Agent #10) Tables
CREATE TABLE IF NOT EXISTS finance_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    budget_name VARCHAR(200) NOT NULL,
    budget_category VARCHAR(100),
    period_type VARCHAR(50), -- monthly, quarterly, yearly
    period_start DATE,
    period_end DATE,
    allocated_amount DECIMAL(12,2),
    spent_amount DECIMAL(12,2) DEFAULT 0,
    committed_amount DECIMAL(12,2) DEFAULT 0,
    remaining_amount DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'active',
    currency VARCHAR(10) DEFAULT 'USD',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES finance_budgets(id),
    transaction_type VARCHAR(100),
    description TEXT,
    amount DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'USD',
    transaction_date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(100),
    vendor VARCHAR(200),
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by VARCHAR(100),
    approved_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- COMPLIANCE AGENT (Agent #11) Tables
CREATE TABLE IF NOT EXISTS compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    framework_name VARCHAR(200) NOT NULL,
    framework_type VARCHAR(100),
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    compliance_score DECIMAL(5,2),
    last_audit_date DATE,
    next_audit_date DATE,
    requirements_total INTEGER DEFAULT 0,
    requirements_met INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID REFERENCES compliance_frameworks(id),
    requirement_code VARCHAR(100) NOT NULL,
    requirement_title VARCHAR(500),
    requirement_description TEXT,
    priority VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    evidence_required BOOLEAN DEFAULT false,
    last_reviewed DATE,
    next_review_date DATE,
    assigned_to VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- INTEGRATION AGENT (Agent #12) Tables
CREATE TABLE IF NOT EXISTS integration_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    endpoint_name VARCHAR(200) NOT NULL,
    endpoint_type VARCHAR(100),
    endpoint_url TEXT,
    authentication_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    last_sync TIMESTAMP,
    sync_frequency INTERVAL,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    configuration JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_syncs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id UUID REFERENCES integration_endpoints(id),
    sync_type VARCHAR(100),
    sync_direction VARCHAR(50), -- inbound, outbound, bidirectional
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    records_processed INTEGER DEFAULT 0,
    records_success INTEGER DEFAULT 0,
    records_error INTEGER DEFAULT 0,
    error_details JSONB,
    metadata JSONB
);

-- BACKUP AGENT (Agent #13) Tables
CREATE TABLE IF NOT EXISTS backup_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    schedule_name VARCHAR(200) NOT NULL,
    backup_type VARCHAR(100),
    frequency VARCHAR(100), -- daily, weekly, monthly
    retention_days INTEGER DEFAULT 30,
    source_location TEXT,
    destination_location TEXT,
    status VARCHAR(50) DEFAULT 'active',
    last_backup TIMESTAMP,
    next_backup TIMESTAMP,
    backup_size_gb DECIMAL(10,2),
    compression_enabled BOOLEAN DEFAULT true,
    encryption_enabled BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backup_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES backup_schedules(id),
    operation_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration INTERVAL,
    size_gb DECIMAL(10,2),
    files_backed_up INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    error_details JSONB,
    backup_location TEXT,
    metadata JSONB
);

-- NOTIFICATION AGENT (Agent #14) Tables - Enhanced
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    template_name VARCHAR(200) NOT NULL,
    template_type VARCHAR(100),
    channel VARCHAR(100), -- email, sms, slack, webhook
    priority INTEGER DEFAULT 3,
    subject_template TEXT,
    body_template TEXT,
    variables JSONB,
    status VARCHAR(50) DEFAULT 'active',
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES notification_templates(id),
    recipient VARCHAR(200),
    channel VARCHAR(100),
    priority INTEGER DEFAULT 3,
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    scheduled_at TIMESTAMP DEFAULT NOW(),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    error_details JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- REPORTING AGENT (Agent #15) Tables - Enhanced
CREATE TABLE IF NOT EXISTS report_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(100),
    data_sources JSONB,
    schedule VARCHAR(100),
    output_format VARCHAR(50),
    recipients JSONB,
    status VARCHAR(50) DEFAULT 'active',
    last_generated TIMESTAMP,
    next_generation TIMESTAMP,
    template_config JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    definition_id UUID REFERENCES report_definitions(id),
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration INTERVAL,
    records_processed INTEGER DEFAULT 0,
    output_size_kb INTEGER DEFAULT 0,
    output_location TEXT,
    error_details JSONB,
    metadata JSONB
);

-- UI/UX AGENT (Agent #16) Tables
CREATE TABLE IF NOT EXISTS ui_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    component_name VARCHAR(200) NOT NULL,
    component_type VARCHAR(100),
    component_category VARCHAR(100),
    design_system VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    accessibility_score DECIMAL(5,2),
    usage_count INTEGER DEFAULT 0,
    performance_score DECIMAL(5,2),
    last_updated TIMESTAMP DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ui_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES ui_components(id),
    metric_name VARCHAR(200),
    metric_value DECIMAL(10,4),
    metric_unit VARCHAR(50),
    user_segment VARCHAR(100),
    device_type VARCHAR(100),
    measured_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- LEARNING AGENT (Agent #17) Tables
CREATE TABLE IF NOT EXISTS ml_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    model_name VARCHAR(200) NOT NULL,
    model_type VARCHAR(100),
    algorithm VARCHAR(100),
    version VARCHAR(50),
    status VARCHAR(50) DEFAULT 'training',
    training_data_size INTEGER DEFAULT 0,
    accuracy_score DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    training_started TIMESTAMP,
    training_completed TIMESTAMP,
    last_inference TIMESTAMP,
    inference_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml_training_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES ml_models(id),
    job_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'queued',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration INTERVAL,
    data_samples INTEGER DEFAULT 0,
    epochs INTEGER DEFAULT 0,
    learning_rate DECIMAL(10,8),
    batch_size INTEGER DEFAULT 32,
    validation_score DECIMAL(5,4),
    error_details JSONB,
    hyperparameters JSONB,
    metadata JSONB
);

-- PREDICTION AGENT (Agent #18) Tables
CREATE TABLE IF NOT EXISTS prediction_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    model_name VARCHAR(200) NOT NULL,
    prediction_type VARCHAR(100),
    target_variable VARCHAR(200),
    time_horizon VARCHAR(100),
    accuracy_percentage DECIMAL(5,2),
    confidence_interval DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'active',
    last_prediction TIMESTAMP,
    prediction_count INTEGER DEFAULT 0,
    feature_importance JSONB,
    model_config JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES prediction_models(id),
    prediction_type VARCHAR(100),
    input_data JSONB,
    predicted_value DECIMAL(15,6),
    confidence_score DECIMAL(5,4),
    prediction_range_min DECIMAL(15,6),
    prediction_range_max DECIMAL(15,6),
    prediction_date TIMESTAMP DEFAULT NOW(),
    target_date TIMESTAMP,
    actual_value DECIMAL(15,6),
    accuracy_score DECIMAL(5,4),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- MASTER COORDINATOR AGENT (Agent #19) Tables
CREATE TABLE IF NOT EXISTS ecosystem_coordination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    coordination_type VARCHAR(100),
    participating_agents JSONB,
    priority INTEGER DEFAULT 3,
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration INTERVAL,
    success_rate DECIMAL(5,2),
    coordination_results JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coordinator_agent_id UUID REFERENCES agents(id),
    resource_type VARCHAR(100),
    resource_name VARCHAR(200),
    allocated_to_agent_id UUID REFERENCES agents(id),
    allocation_amount DECIMAL(10,2),
    allocation_unit VARCHAR(50),
    priority INTEGER DEFAULT 3,
    status VARCHAR(50) DEFAULT 'active',
    allocated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    usage_percentage DECIMAL(5,2),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Additional indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_workflow_processes_status ON workflow_processes(status);
CREATE INDEX IF NOT EXISTS idx_workflow_processes_priority ON workflow_processes(priority);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_status ON workflow_tasks(status);
CREATE INDEX IF NOT EXISTS idx_communication_messages_status ON communication_messages(status);
CREATE INDEX IF NOT EXISTS idx_quality_tests_status ON quality_tests(status);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_measured_at ON performance_metrics(measured_at);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_date ON finance_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_compliance_requirements_status ON compliance_requirements(status);
CREATE INDEX IF NOT EXISTS idx_backup_operations_status ON backup_operations(status);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_status ON notification_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_report_generations_status ON report_generations(status);
CREATE INDEX IF NOT EXISTS idx_ml_models_status ON ml_models(status);
CREATE INDEX IF NOT EXISTS idx_predictions_prediction_date ON predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_ecosystem_coordination_status ON ecosystem_coordination(status);

-- Functions for the new agents
CREATE OR REPLACE FUNCTION get_agent_workflow_summary(agent_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_processes', COUNT(*),
        'active_processes', COUNT(*) FILTER (WHERE status = 'active'),
        'completed_processes', COUNT(*) FILTER (WHERE status = 'completed'),
        'avg_completion_time', AVG(EXTRACT(EPOCH FROM actual_duration))
    ) INTO result
    FROM workflow_processes 
    WHERE agent_id = agent_uuid;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_ecosystem_event(
    event_type VARCHAR(100),
    agent_uuid UUID,
    event_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO agent_communications (
        source_agent_id,
        message_type,
        content,
        metadata,
        created_at
    ) VALUES (
        agent_uuid,
        event_type,
        'Ecosystem event logged',
        event_data,
        NOW()
    ) RETURNING id INTO event_id;

    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- View for ecosystem status monitoring
CREATE OR REPLACE VIEW ecosystem_health_status AS
SELECT 
    a.id as agent_id,
    a.name as agent_name,
    a.domain,
    a.status as agent_status,
    a.performance_score,
    COALESCE(ac.communication_count, 0) as communication_count,
    COALESCE(sm.metric_count, 0) as metric_count,
    a.last_heartbeat,
    CASE 
        WHEN a.last_heartbeat > NOW() - INTERVAL '5 minutes' THEN 'healthy'
        WHEN a.last_heartbeat > NOW() - INTERVAL '15 minutes' THEN 'warning'
        ELSE 'critical'
    END as health_status
FROM agents a
LEFT JOIN (
    SELECT source_agent_id, COUNT(*) as communication_count
    FROM agent_communications 
    WHERE created_at > NOW() - INTERVAL '1 hour'
    GROUP BY source_agent_id
) ac ON a.id = ac.source_agent_id
LEFT JOIN (
    SELECT agent_id, COUNT(*) as metric_count
    FROM system_metrics 
    WHERE recorded_at > NOW() - INTERVAL '1 hour'
    GROUP BY agent_id
) sm ON a.id = sm.agent_id
ORDER BY a.id;

-- Insert initial data for all new agents (6-19)
INSERT INTO agents (id, name, domain, status, capabilities, performance_score, api_endpoints, last_heartbeat, created_at) VALUES
(gen_random_uuid(), 'Workflow Agent', 'Process Automation', 'active', ARRAY['Process orchestration', 'Task automation', 'Workflow monitoring', 'Efficiency optimization'], 95.0, '{"health": "/api/v1/workflow/health", "tasks": "/api/v1/workflow/tasks", "processes": "/api/v1/workflow/processes"}', NOW(), NOW()),
(gen_random_uuid(), 'Communication Agent', 'Messaging & Communication', 'active', ARRAY['Message routing', 'Communication protocols', 'Notification delivery', 'Contact management'], 96.5, '{"health": "/api/v1/communication/health", "send": "/api/v1/communication/send", "channels": "/api/v1/communication/channels"}', NOW(), NOW()),
(gen_random_uuid(), 'Quality Agent', 'Quality Assurance', 'active', ARRAY['Test automation', 'Quality metrics', 'Code review', 'Compliance testing'], 94.2, '{"health": "/api/v1/quality/health", "tests": "/api/v1/quality/tests", "metrics": "/api/v1/quality/metrics"}', NOW(), NOW()),
(gen_random_uuid(), 'Performance Agent', 'System Optimization', 'active', ARRAY['Performance tuning', 'Resource optimization', 'Bottleneck detection', 'Capacity planning'], 97.1, '{"health": "/api/v1/performance/health", "metrics": "/api/v1/performance/metrics", "optimize": "/api/v1/performance/optimize"}', NOW(), NOW()),
(gen_random_uuid(), 'Finance Agent', 'Financial Management', 'active', ARRAY['Budget analysis', 'Cost optimization', 'Financial reporting', 'ROI tracking'], 93.8, '{"health": "/api/v1/finance/health", "budgets": "/api/v1/finance/budgets", "transactions": "/api/v1/finance/transactions"}', NOW(), NOW()),
(gen_random_uuid(), 'Compliance Agent', 'Regulatory Compliance', 'active', ARRAY['Compliance monitoring', 'Audit preparation', 'Regulatory tracking', 'Policy enforcement'], 96.0, '{"health": "/api/v1/compliance/health", "frameworks": "/api/v1/compliance/frameworks", "audit": "/api/v1/compliance/audit"}', NOW(), NOW()),
(gen_random_uuid(), 'Integration Agent', 'System Integration', 'active', ARRAY['API management', 'Data synchronization', 'System connectivity', 'Integration monitoring'], 95.5, '{"health": "/api/v1/integration/health", "endpoints": "/api/v1/integration/endpoints", "sync": "/api/v1/integration/sync"}', NOW(), NOW()),
(gen_random_uuid(), 'Backup Agent', 'Data Protection', 'active', ARRAY['Backup scheduling', 'Data recovery', 'Disaster planning', 'Archive management'], 98.2, '{"health": "/api/v1/backup/health", "schedules": "/api/v1/backup/schedules", "restore": "/api/v1/backup/restore"}', NOW(), NOW()),
(gen_random_uuid(), 'Notification Agent', 'Alert Management', 'active', ARRAY['Alert routing', 'Escalation management', 'Multi-channel delivery', 'Priority management'], 96.8, '{"health": "/api/v1/notification/health", "send": "/api/v1/notification/send", "templates": "/api/v1/notification/templates"}', NOW(), NOW()),
(gen_random_uuid(), 'Reporting Agent', 'Business Intelligence', 'active', ARRAY['Report generation', 'Data visualization', 'Business metrics', 'Executive dashboards'], 94.7, '{"health": "/api/v1/reporting/health", "generate": "/api/v1/reporting/generate", "schedule": "/api/v1/reporting/schedule"}', NOW(), NOW()),
(gen_random_uuid(), 'UI/UX Agent', 'User Experience', 'active', ARRAY['Interface design', 'User experience analysis', 'Accessibility optimization', 'Design systems'], 95.3, '{"health": "/api/v1/uiux/health", "components": "/api/v1/uiux/components", "analytics": "/api/v1/uiux/analytics"}', NOW(), NOW()),
(gen_random_uuid(), 'Learning Agent', 'Machine Learning', 'active', ARRAY['Model training', 'Pattern recognition', 'Predictive modeling', 'AI optimization'], 97.5, '{"health": "/api/v1/learning/health", "train": "/api/v1/learning/train", "models": "/api/v1/learning/models"}', NOW(), NOW()),
(gen_random_uuid(), 'Prediction Agent', 'Predictive Analytics', 'active', ARRAY['Trend analysis', 'Forecasting models', 'Risk prediction', 'Market analysis'], 96.2, '{"health": "/api/v1/prediction/health", "predict": "/api/v1/prediction/predict", "models": "/api/v1/prediction/models"}', NOW(), NOW()),
(gen_random_uuid(), 'Master Coordinator Agent', 'Ecosystem Coordination', 'active', ARRAY['Agent orchestration', 'Resource allocation', 'Priority management', 'Ecosystem optimization'], 98.8, '{"health": "/api/v1/coordinator/health", "orchestrate": "/api/v1/coordinator/orchestrate", "allocate": "/api/v1/coordinator/allocate"}', NOW(), NOW());

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
