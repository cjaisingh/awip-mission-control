-- Create the graph_triples table for File Ingestion Agent
CREATE TABLE IF NOT EXISTS graph_triples (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    relation TEXT NOT NULL,
    object TEXT NOT NULL,
    source_file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_graph_triples_subject ON graph_triples(subject);
CREATE INDEX IF NOT EXISTS idx_graph_triples_relation ON graph_triples(relation);
CREATE INDEX IF NOT EXISTS idx_graph_triples_object ON graph_triples(object);
CREATE INDEX IF NOT EXISTS idx_graph_triples_source_file ON graph_triples(source_file);

-- Enable Row Level Security (RLS)
ALTER TABLE graph_triples ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON graph_triples FOR SELECT USING (true);

-- Create policies for authenticated insert/update access
CREATE POLICY "Allow authenticated insert" ON graph_triples FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON graph_triples FOR UPDATE USING (true);

-- Grant necessary permissions
GRANT ALL ON graph_triples TO anon;
GRANT USAGE, SELECT ON SEQUENCE graph_triples_id_seq TO anon;

-- Success message
SELECT 'Graph triples table created successfully!' as status;
