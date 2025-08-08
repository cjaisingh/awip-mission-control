import React, { useState, useEffect, useMemo } from 'react';
import { fileIngestionAgent } from '../services/fileIngestionAgent';

interface Triple {
  subject: string;
  relation: string;
  object: string;
  source_file?: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'subject' | 'object';
  count: number;
  color: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  count: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const GraphRAGChart: React.FC = () => {
  const [triples, setTriples] = useState<Triple[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'analytics' | 'relationships'>('network');
  const [filterRelation, setFilterRelation] = useState<string>('');

  useEffect(() => {
    loadTriples();
  }, []);

  const loadTriples = async () => {
    try {
      setLoading(true);
      if ('queryTriples' in fileIngestionAgent) {
        const data = await fileIngestionAgent.queryTriples('');
        setTriples(data);
      } else {
        // Mock data for demonstration
        setTriples([
          { subject: 'Document', relation: 'contains', object: 'information', source_file: 'uploaded_file.txt' },
          { subject: 'Text', relation: 'processed_by', object: 'AI', source_file: 'uploaded_file.txt' },
          { subject: 'File', relation: 'uploaded_by', object: 'User', source_file: 'uploaded_file.txt' },
          { subject: 'AI', relation: 'analyzes', object: 'Document', source_file: 'uploaded_file.txt' },
          { subject: 'User', relation: 'uploads', object: 'File', source_file: 'uploaded_file.txt' },
          { subject: 'Information', relation: 'extracted_from', object: 'Text', source_file: 'uploaded_file.txt' }
        ]);
      }
    } catch (error) {
      console.error('Error loading triples:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process triples into graph data
  const graphData = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const edgeMap = new Map<string, GraphEdge>();

    triples.forEach(triple => {
      // Add subject node
      if (!nodeMap.has(triple.subject)) {
        nodeMap.set(triple.subject, {
          id: triple.subject,
          label: triple.subject,
          type: 'subject',
          count: 1,
          color: '#3B82F6' // Blue
        });
      } else {
        const node = nodeMap.get(triple.subject)!;
        node.count++;
      }

      // Add object node
      if (!nodeMap.has(triple.object)) {
        nodeMap.set(triple.object, {
          id: triple.object,
          label: triple.object,
          type: 'object',
          count: 1,
          color: '#10B981' // Green
        });
      } else {
        const node = nodeMap.get(triple.object)!;
        node.count++;
      }

      // Add edge
      const edgeKey = `${triple.subject}-${triple.relation}-${triple.object}`;
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          from: triple.subject,
          to: triple.object,
          label: triple.relation,
          count: 1
        });
      } else {
        const edge = edgeMap.get(edgeKey)!;
        edge.count++;
      }
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values())
    };
  }, [triples]);

  // Filter data based on relation
  const filteredGraphData = useMemo(() => {
    if (!filterRelation) return graphData;

    const filteredEdges = graphData.edges.filter(edge => 
      edge.label.toLowerCase().includes(filterRelation.toLowerCase())
    );

    const connectedNodes = new Set<string>();
    filteredEdges.forEach(edge => {
      connectedNodes.add(edge.from);
      connectedNodes.add(edge.to);
    });

    const filteredNodes = graphData.nodes.filter(node => 
      connectedNodes.has(node.id)
    );

    return {
      nodes: filteredNodes,
      edges: filteredEdges
    };
  }, [graphData, filterRelation]);

  // Analytics data
  const analytics = useMemo(() => {
    const relationCounts = new Map<string, number>();
    const subjectCounts = new Map<string, number>();
    const objectCounts = new Map<string, number>();

    triples.forEach(triple => {
      relationCounts.set(triple.relation, (relationCounts.get(triple.relation) || 0) + 1);
      subjectCounts.set(triple.subject, (subjectCounts.get(triple.subject) || 0) + 1);
      objectCounts.set(triple.object, (objectCounts.get(triple.object) || 0) + 1);
    });

    return {
      totalTriples: triples.length,
      uniqueRelations: relationCounts.size,
      uniqueSubjects: subjectCounts.size,
      uniqueObjects: objectCounts.size,
      topRelations: Array.from(relationCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      topSubjects: Array.from(subjectCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      topObjects: Array.from(objectCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }, [triples]);

  // Get relationships for selected node
  const selectedNodeRelationships = useMemo(() => {
    if (!selectedNode) return [];

    return filteredGraphData.edges.filter(edge => 
      edge.from === selectedNode || edge.to === selectedNode
    );
  }, [selectedNode, filteredGraphData]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">GraphRAG Chart</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading graph data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">GraphRAG Chart</h3>
        <div className="flex space-x-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="network">Network View</option>
            <option value="analytics">Analytics</option>
            <option value="relationships">Relationships</option>
          </select>
          <input
            type="text"
            placeholder="Filter by relation..."
            value={filterRelation}
            onChange={(e) => setFilterRelation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {viewMode === 'network' && (
        <div className="space-y-4">
          {/* Network Visualization */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3">Knowledge Graph Network</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nodes */}
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">Nodes ({filteredGraphData.nodes.length})</h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredGraphData.nodes.map(node => (
                                         <div
                       key={node.id}
                       className={`p-2 rounded border cursor-pointer transition-colors ${
                         selectedNode === node.id 
                           ? 'border-blue-500 bg-blue-50' 
                           : 'border-gray-200 hover:border-gray-300'
                       }`}
                       onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' || e.key === ' ') {
                           e.preventDefault();
                           setSelectedNode(selectedNode === node.id ? null : node.id);
                         }
                       }}
                       role="button"
                       tabIndex={0}
                     >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: node.color }}>
                          {node.label}
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {node.count}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Type: {node.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edges */}
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">Relationships ({filteredGraphData.edges.length})</h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredGraphData.edges.map((edge, index) => (
                    <div key={index} className="p-2 rounded border border-gray-200 bg-white">
                      <div className="text-sm">
                        <span className="font-medium text-blue-600">{edge.from}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="font-medium text-green-600">{edge.label}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="font-medium text-purple-600">{edge.to}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Count: {edge.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Graph Summary */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-900">Total Nodes</div>
              <div className="text-2xl font-bold text-blue-600">{filteredGraphData.nodes.length}</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="font-medium text-green-900">Total Edges</div>
              <div className="text-2xl font-bold text-green-600">{filteredGraphData.edges.length}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="font-medium text-purple-900">Unique Relations</div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredGraphData.edges.map(e => e.label)).size}
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <div className="font-medium text-orange-900">Graph Density</div>
              <div className="text-2xl font-bold text-orange-600">
                {filteredGraphData.nodes.length > 0 
                  ? ((filteredGraphData.edges.length / filteredGraphData.nodes.length) * 100).toFixed(1)
                  : '0'
                }%
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalTriples}</div>
              <div className="text-sm text-blue-700">Total Triples</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.uniqueRelations}</div>
              <div className="text-sm text-green-700">Unique Relations</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.uniqueSubjects}</div>
              <div className="text-sm text-purple-700">Unique Subjects</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analytics.uniqueObjects}</div>
              <div className="text-sm text-orange-700">Unique Objects</div>
            </div>
          </div>

          {/* Top Relations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top Relations</h4>
            <div className="space-y-2">
              {analytics.topRelations.map(([relation, count]) => (
                <div key={relation} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">{relation}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / analytics.totalTriples) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Subjects and Objects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Subjects</h4>
              <div className="space-y-2">
                {analytics.topSubjects.map(([subject, count]) => (
                  <div key={subject} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium text-blue-700">{subject}</span>
                    <span className="text-sm text-blue-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Objects</h4>
              <div className="space-y-2">
                {analytics.topObjects.map(([object, count]) => (
                  <div key={object} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium text-green-700">{object}</span>
                    <span className="text-sm text-green-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'relationships' && selectedNode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Relationships for: <span className="text-blue-600">{selectedNode}</span>
            </h4>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Selection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outgoing Relationships */}
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Outgoing</h5>
              <div className="space-y-2">
                {selectedNodeRelationships
                  .filter(edge => edge.from === selectedNode)
                  .map((edge, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="text-sm">
                        <span className="font-medium text-blue-600">{selectedNode}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="font-medium text-green-600">{edge.label}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="font-medium text-purple-600">{edge.to}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Count: {edge.count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Incoming Relationships */}
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Incoming</h5>
              <div className="space-y-2">
                {selectedNodeRelationships
                  .filter(edge => edge.to === selectedNode)
                  .map((edge, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="text-sm">
                        <span className="font-medium text-purple-600">{edge.from}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="font-medium text-green-600">{edge.label}</span>
                        <span className="mx-2 text-gray-500">→</span>
                        <span className="font-medium text-blue-600">{selectedNode}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Count: {edge.count}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'relationships' && !selectedNode && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p>Click on a node in the Network View to see its relationships</p>
        </div>
      )}
    </div>
  );
};

export default GraphRAGChart;
