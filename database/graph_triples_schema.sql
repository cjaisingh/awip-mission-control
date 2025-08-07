-- GraphRAG Triples Schema for Supabase
-- Stores subject-relation-object triples extracted from documents

-- Create graph_triples table
CREATE TABLE IF NOT EXISTS graph_triples (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    relation TEXT NOT NULL,
    object TEXT NOT NULL,
    source_file TEXT,
    file_type TEXT,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_graph_triples_subject ON graph_triples(subject);
CREATE INDEX IF NOT EXISTS idx_graph_triples_relation ON graph_triples(relation);
CREATE INDEX IF NOT EXISTS idx_graph_triples_object ON graph_triples(object);
CREATE INDEX IF NOT EXISTS idx_graph_triples_source_file ON graph_triples(source_file);
CREATE INDEX IF NOT EXISTS idx_graph_triples_created_at ON graph_triples(created_at);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_graph_triples_subject_relation ON graph_triples(subject, relation);
CREATE INDEX IF NOT EXISTS idx_graph_triples_relation_object ON graph_triples(relation, object);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_graph_triples_search ON graph_triples USING GIN (
    to_tsvector('english', subject || ' ' || relation || ' ' || object)
);

-- Create files_processed table to track processed files
CREATE TABLE IF NOT EXISTS files_processed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    source_type TEXT NOT NULL, -- 'local', 'google_drive', 'dropbox', etc.
    source_id TEXT, -- Google Drive file ID, etc.
    triples_extracted INTEGER DEFAULT 0,
    processing_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for files_processed
CREATE INDEX IF NOT EXISTS idx_files_processed_status ON files_processed(processing_status);
CREATE INDEX IF NOT EXISTS idx_files_processed_source_type ON files_processed(source_type);
CREATE INDEX IF NOT EXISTS idx_files_processed_created_at ON files_processed(created_at);

-- Create entity_metadata table for additional entity information
CREATE TABLE IF NOT EXISTS entity_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_name TEXT NOT NULL UNIQUE,
    entity_type TEXT, -- 'person', 'organization', 'location', 'concept', etc.
    description TEXT,
    aliases TEXT[], -- Alternative names for the entity
    properties JSONB, -- Additional properties as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for entity_metadata
CREATE INDEX IF NOT EXISTS idx_entity_metadata_name ON entity_metadata(entity_name);
CREATE INDEX IF NOT EXISTS idx_entity_metadata_type ON entity_metadata(entity_type);

-- Create relation_metadata table for relation information
CREATE TABLE IF NOT EXISTS relation_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    relation_name TEXT NOT NULL UNIQUE,
    relation_type TEXT, -- 'hierarchical', 'temporal', 'spatial', 'causal', etc.
    description TEXT,
    inverse_relation TEXT, -- Name of the inverse relation
    properties JSONB, -- Additional properties as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for relation_metadata
CREATE INDEX IF NOT EXISTS idx_relation_metadata_name ON relation_metadata(relation_name);
CREATE INDEX IF NOT EXISTS idx_relation_metadata_type ON relation_metadata(relation_type);

-- Create graph_analytics table for storing analytics
CREATE TABLE IF NOT EXISTS graph_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_type TEXT NOT NULL, -- 'entity_frequency', 'relation_frequency', 'path_analysis', etc.
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for graph_analytics
CREATE INDEX IF NOT EXISTS idx_graph_analytics_type ON graph_analytics(analysis_type);
CREATE INDEX IF NOT EXISTS idx_graph_analytics_created_at ON graph_analytics(created_at);

-- Create RLS (Row Level Security) policies
ALTER TABLE graph_triples ENABLE ROW LEVEL SECURITY;
ALTER TABLE files_processed ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE relation_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all triples" ON graph_triples
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert triples" ON graph_triples
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update triples" ON graph_triples
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete triples" ON graph_triples
    FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Users can view processed files" ON files_processed
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert processed files" ON files_processed
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_entity_frequency()
RETURNS TABLE(entity_name TEXT, frequency BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT subject as entity_name, COUNT(*) as frequency
    FROM graph_triples
    GROUP BY subject
    ORDER BY frequency DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_relation_frequency()
RETURNS TABLE(relation_name TEXT, frequency BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT relation as relation_name, COUNT(*) as frequency
    FROM graph_triples
    GROUP BY relation
    ORDER BY frequency DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_entity_relationships(entity_name TEXT)
RETURNS TABLE(subject TEXT, relation TEXT, object TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT gt.subject, gt.relation, gt.object
    FROM graph_triples gt
    WHERE gt.subject = entity_name OR gt.object = entity_name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_triples(search_term TEXT)
RETURNS TABLE(subject TEXT, relation TEXT, object TEXT, source_file TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT gt.subject, gt.relation, gt.object, gt.source_file
    FROM graph_triples gt
    WHERE to_tsvector('english', gt.subject || ' ' || gt.relation || ' ' || gt.object) @@ plainto_tsquery('english', search_term);
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_graph_triples_updated_at
    BEFORE UPDATE ON graph_triples
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_processed_updated_at
    BEFORE UPDATE ON files_processed
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entity_metadata_updated_at
    BEFORE UPDATE ON entity_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relation_metadata_updated_at
    BEFORE UPDATE ON relation_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO graph_triples (subject, relation, object, source_file) VALUES
('John Smith', 'works_for', 'Tech Corp', 'sample_document.txt'),
('Tech Corp', 'located_in', 'San Francisco', 'sample_document.txt'),
('John Smith', 'has_role', 'Software Engineer', 'sample_document.txt'),
('Tech Corp', 'founded_in', '2010', 'sample_document.txt'),
('San Francisco', 'is_city_in', 'California', 'sample_document.txt');

-- Insert sample entity metadata
INSERT INTO entity_metadata (entity_name, entity_type, description) VALUES
('John Smith', 'person', 'Software engineer at Tech Corp'),
('Tech Corp', 'organization', 'Technology company based in San Francisco'),
('San Francisco', 'location', 'City in California'),
('Software Engineer', 'role', 'Technical position in software development');

-- Insert sample relation metadata
INSERT INTO relation_metadata (relation_name, relation_type, description) VALUES
('works_for', 'employment', 'Employment relationship between person and organization'),
('located_in', 'spatial', 'Geographic location relationship'),
('has_role', 'role', 'Role or position relationship'),
('founded_in', 'temporal', 'Temporal relationship for founding date'),
('is_city_in', 'hierarchical', 'Hierarchical geographic relationship');
