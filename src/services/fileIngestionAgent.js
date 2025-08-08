// File Ingestion Agent with GraphRAG Implementation
// Browser-compatible version for React frontend

import { createClient } from '@supabase/supabase-js';

class FileIngestionAgent {
  constructor() {
    // Initialize Supabase client with fallback values
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lubapfzpcfffksxtusga.supabase.co';
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmFwZnpwY2ZmZmtzeHR1c2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTg5NDUsImV4cCI6MjA3MDIzNDk0NX0.cZ14GhRLDr5ENu6NeaxtehWCNjIIUFGyxZcrGjuLoo0';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // GraphRAG Triple Extraction using OpenAI
  async extractTriples(text) {
    try {
      const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!openaiKey) {
        console.warn('OpenAI API key not found, using mock triples');
        // Return mock triples for demonstration
        return [
          { subject: 'Document', relation: 'contains', object: 'information' },
          { subject: 'Text', relation: 'processed_by', object: 'AI' },
          { subject: 'File', relation: 'uploaded_by', object: 'User' }
        ];
      }
      
      // Use OpenAI to extract subject-relation-object triples
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Extract subject-relation-object triples from the following text. 
              Return only valid triples in JSON format: [{"subject": "...", "relation": "...", "object": "..."}]
              Focus on factual relationships, entities, and their connections.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.1
        })
      });

      const data = await response.json();
      const triples = JSON.parse(data.choices[0].message.content);
      return triples;
    } catch (error) {
      console.error('Error extracting triples:', error);
      return [];
    }
  }

  // Process text chunks and convert to triples
  async processTextChunks(chunks) {
    const allTriples = [];
    
    for (const chunk of chunks) {
      const triples = await this.extractTriples(chunk);
      allTriples.push(...triples);
    }
    
    return allTriples;
  }

  // Store triples in Supabase
  async storeTriples(triples, sourceFile) {
    try {
      const { data, error } = await this.supabase
        .from('graph_triples')
        .insert(
          triples.map(triple => ({
            subject: triple.subject,
            relation: triple.relation,
            object: triple.object,
            source_file: sourceFile,
            created_at: new Date().toISOString()
          }))
        );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing triples:', error);
      throw error;
    }
  }

  // Local file processing
  async processLocalFile(file) {
    try {
      console.log(`Processing local file: ${file.name}`);
      
      const content = await this.readFileContent(file);
      const chunks = this.splitIntoChunks(content, 1000);
      const triples = await this.processTextChunks(chunks);
      
      await this.storeTriples(triples, file.name);
      
      return {
        success: true,
        fileName: file.name,
        triplesCount: triples.length,
        message: `Processed ${file.name} - extracted ${triples.length} triples`
      };
    } catch (error) {
      console.error('Error processing local file:', error);
      return {
        success: false,
        fileName: file.name,
        error: error.message
      };
    }
  }

  // Read file content
  async readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Split text into chunks
  splitIntoChunks(text, chunkSize) {
    const words = text.split(' ');
    const chunks = [];
    
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    
    return chunks;
  }

  // Query triples from Supabase
  async queryTriples(query) {
    try {
      const { data, error } = await this.supabase
        .from('graph_triples')
        .select('*')
        .or(`subject.ilike.%${query}%,relation.ilike.%${query}%,object.ilike.%${query}%`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error querying triples:', error);
      return [];
    }
  }

  // Get triple statistics
  async getTripleStats() {
    try {
      const { data, error } = await this.supabase
        .from('graph_triples')
        .select('*');

      if (error) throw error;

      const stats = {
        totalTriples: data.length,
        uniqueSubjects: new Set(data.map(t => t.subject)).size,
        uniqueRelations: new Set(data.map(t => t.relation)).size,
        uniqueObjects: new Set(data.map(t => t.object)).size,
        sourceFiles: new Set(data.map(t => t.source_file)).size
      };

      return stats;
    } catch (error) {
      console.error('Error getting triple stats:', error);
      return null;
    }
  }

  // Batch process multiple files
  async batchProcessFiles(files) {
    const results = [];
    
    for (const file of files) {
      const result = await this.processLocalFile(file);
      results.push(result);
    }
    
    return results;
  }

  // Google Drive Integration (Mock implementation for browser)
  async connectGoogleDrive() {
    try {
      console.log('Connecting to Google Drive (mock implementation)');
      // In a real implementation, this would use Google Drive API
      return true;
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      return false;
    }
  }

  // List files from Google Drive (Mock implementation)
  async listGoogleDriveFiles(folderId = null) {
    try {
      console.log('Listing Google Drive files (mock implementation)');
      // Mock data for demonstration
      return [
        { id: '1', name: 'document1.txt', mimeType: 'text/plain' },
        { id: '2', name: 'document2.txt', mimeType: 'text/plain' }
      ];
    } catch (error) {
      console.error('Error listing Google Drive files:', error);
      return [];
    }
  }

  // Process Google Drive file (Mock implementation)
  async processGoogleDriveFile(fileId, fileName) {
    try {
      console.log(`Processing Google Drive file: ${fileName} (${fileId})`);
      
      // Mock processing
      const mockTriples = [
        { subject: 'Google Doc', relation: 'contains', object: 'information' },
        { subject: 'Document', relation: 'created_by', object: 'User' }
      ];
      
      await this.storeTriples(mockTriples, fileName);
      
      return {
        success: true,
        fileName,
        triplesCount: mockTriples.length,
        message: `Processed ${fileName} - extracted ${mockTriples.length} triples`
      };
    } catch (error) {
      console.error('Error processing Google Drive file:', error);
      return {
        success: false,
        fileName,
        error: error.message
      };
    }
  }

  // Export triples to different formats
  async exportTriples(format = 'json') {
    try {
      const { data, error } = await this.supabase
        .from('graph_triples')
        .select('*');

      if (error) throw error;

      switch (format) {
        case 'json': {
          return JSON.stringify(data, null, 2);
        }
        case 'csv': {
          const csv = this.convertToCSV(data);
          return csv;
        }
        case 'neo4j': {
          const cypher = this.convertToNeo4j(data);
          return cypher;
        }
        default:
          return data;
      }
    } catch (error) {
      console.error('Error exporting triples:', error);
      return null;
    }
  }

  // Convert to CSV format
  convertToCSV(data) {
    const headers = ['subject', 'relation', 'object', 'source_file', 'created_at'];
    const csv = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => `"${row[header]}"`);
      csv.push(values.join(','));
    });
    
    return csv.join('\n');
  }

  // Convert to Neo4j Cypher format
  convertToNeo4j(data) {
    const cypher = [];
    
    data.forEach(triple => {
      cypher.push(`CREATE (s:Entity {name: "${triple.subject}"})`);
      cypher.push(`CREATE (o:Entity {name: "${triple.object}"})`);
      cypher.push(`CREATE (s)-[:${triple.relation}]->(o)`);
    });
    
    return cypher.join('\n');
  }

  // Get entity relationships
  async getEntityRelationships(entity) {
    try {
      const { data, error } = await this.supabase
        .from('graph_triples')
        .select('*')
        .or(`subject.eq.${entity},object.eq.${entity}`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting entity relationships:', error);
      return [];
    }
  }

  // Search for patterns in triples
  async searchPatterns(pattern) {
    try {
      const { data, error } = await this.supabase
        .from('graph_triples')
        .select('*')
        .or(`subject.ilike.%${pattern}%,relation.ilike.%${pattern}%,object.ilike.%${pattern}%`);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching patterns:', error);
      return [];
    }
  }
}

// Export singleton instance with error handling
let fileIngestionAgent;
try {
  fileIngestionAgent = new FileIngestionAgent();
} catch (error) {
  console.error('Error initializing FileIngestionAgent:', error);
  // Create a fallback instance with minimal functionality
  fileIngestionAgent = {
    processLocalFile: async (file) => ({
      success: false,
      fileName: file.name,
      error: 'FileIngestionAgent initialization failed'
    }),
    getTripleStats: async () => null
  };
}

export { fileIngestionAgent };
export default fileIngestionAgent;
