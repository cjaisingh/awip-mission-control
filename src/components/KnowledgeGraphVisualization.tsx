import React, { useState, useEffect } from 'react';
import { fileIngestionAgent } from '../services/fileIngestionAgent';

interface Triple {
  subject: string;
  relation: string;
  object: string;
  source_file?: string;
}

interface GraphData {
  nodes: Array<{ id: string; label: string; type: 'subject' | 'object' }>;
  edges: Array<{ from: string; to: string; label: string }>;
}

const KnowledgeGraphVisualization: React.FC = () => {
  const [triples, setTriples] = useState<Triple[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedTriple, setSelectedTriple] = useState<Triple | null>(null);

  useEffect(() => {
    loadTriples();
  }, []);

  const loadTriples = async () => {
    try {
      setLoading(true);
      // Query all triples from the database
      const data = await fileIngestionAgent.queryTriples('');
      setTriples(data);
      
      // Convert to graph format
      const nodes = new Set<string>();
      const edges: Array<{ from: string; to: string; label: string }> = [];
      
      data.forEach((triple: Triple) => {
        nodes.add(triple.subject);
        nodes.add(triple.object);
        edges.push({
          from: triple.subject,
          to: triple.object,
          label: triple.relation
        });
      });

      const graphNodes = Array.from(nodes).map(node => ({
        id: node,
        label: node,
        type: 'subject' as const
      }));

      setGraphData({ nodes: graphNodes, edges });
    } catch (error) {
      console.error('Error loading triples:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelationStats = () => {
    const relationCounts: { [key: string]: number } = {};
    triples.forEach(triple => {
      relationCounts[triple.relation] = (relationCounts[triple.relation] || 0) + 1;
    });
    return relationCounts;
  };

  const getSubjectStats = () => {
    const subjectCounts: { [key: string]: number } = {};
    triples.forEach(triple => {
      subjectCounts[triple.subject] = (subjectCounts[triple.subject] || 0) + 1;
    });
    return subjectCounts;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Knowledge Graph Visualization</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading knowledge graph...</span>
        </div>
      </div>
    );
  }

  const relationStats = getRelationStats();
  const subjectStats = getSubjectStats();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">🗺️</span>
        Knowledge Graph Visualization
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triple List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Extracted Triples ({triples.length})</h4>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {triples.map((triple, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTriple === triple ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTriple(triple)}
              >
                <div className="text-sm">
                  <span className="font-medium text-blue-600">{triple.subject}</span>
                  <span className="mx-2 text-gray-500">→</span>
                  <span className="font-medium text-green-600">{triple.relation}</span>
                  <span className="mx-2 text-gray-500">→</span>
                  <span className="font-medium text-purple-600">{triple.object}</span>
                </div>
                {triple.source_file && (
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {triple.source_file}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistics and Charts */}
        <div className="space-y-4">
          {/* Relation Distribution */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Relation Distribution</h4>
            <div className="space-y-2">
              {Object.entries(relationStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([relation, count]) => (
                  <div key={relation} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{relation}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / triples.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Subjects */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Top Subjects</h4>
            <div className="space-y-2">
              {Object.entries(subjectStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([subject, count]) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">{subject}</span>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Graph Summary */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Graph Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Nodes:</span>
                <span className="ml-2 font-medium">{graphData.nodes.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Edges:</span>
                <span className="ml-2 font-medium">{graphData.edges.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Unique Relations:</span>
                <span className="ml-2 font-medium">{Object.keys(relationStats).length}</span>
              </div>
              <div>
                <span className="text-gray-600">Unique Subjects:</span>
                <span className="ml-2 font-medium">{Object.keys(subjectStats).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Triple Details */}
      {selectedTriple && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selected Triple Details</h4>
          <div className="text-sm">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-gray-600">Subject:</span>
                <div className="font-medium text-blue-600">{selectedTriple.subject}</div>
              </div>
              <div>
                <span className="text-gray-600">Relation:</span>
                <div className="font-medium text-green-600">{selectedTriple.relation}</div>
              </div>
              <div>
                <span className="text-gray-600">Object:</span>
                <div className="font-medium text-purple-600">{selectedTriple.object}</div>
              </div>
            </div>
            {selectedTriple.source_file && (
              <div className="mt-2">
                <span className="text-gray-600">Source File:</span>
                <div className="font-medium">{selectedTriple.source_file}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraphVisualization;
