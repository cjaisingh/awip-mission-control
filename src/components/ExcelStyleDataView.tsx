import React, { useState, useEffect, useMemo } from 'react';
import { fileIngestionAgent } from '../services/fileIngestionAgent';

interface Triple {
  id?: number;
  subject: string;
  relation: string;
  object: string;
  source_file?: string;
  created_at?: string;
}

interface SortConfig {
  key: keyof Triple;
  direction: 'asc' | 'desc';
}

const ExcelStyleDataView: React.FC = () => {
  const [triples, setTriples] = useState<Triple[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'subject', direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filters, setFilters] = useState({
    subject: '',
    relation: '',
    object: '',
    source_file: ''
  });

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
          { id: 1, subject: 'Document', relation: 'contains', object: 'information', source_file: 'uploaded_file.txt', created_at: new Date().toISOString() },
          { id: 2, subject: 'Text', relation: 'processed_by', object: 'AI', source_file: 'uploaded_file.txt', created_at: new Date().toISOString() },
          { id: 3, subject: 'File', relation: 'uploaded_by', object: 'User', source_file: 'uploaded_file.txt', created_at: new Date().toISOString() }
        ]);
      }
    } catch (error) {
      console.error('Error loading triples:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = triples.filter(triple => {
      const matchesSearch = 
        triple.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        triple.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        triple.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (triple.source_file && triple.source_file.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilters = 
        (!filters.subject || triple.subject.toLowerCase().includes(filters.subject.toLowerCase())) &&
        (!filters.relation || triple.relation.toLowerCase().includes(filters.relation.toLowerCase())) &&
        (!filters.object || triple.object.toLowerCase().includes(filters.object.toLowerCase())) &&
        (!filters.source_file || (triple.source_file && triple.source_file.toLowerCase().includes(filters.source_file.toLowerCase())));

      return matchesSearch && matchesFilters;
    });

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

    return filtered;
  }, [triples, searchTerm, sortConfig, filters]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (key: keyof Triple) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => startIndex + index)));
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    const actualIndex = startIndex + index;
    
    if (newSelected.has(actualIndex)) {
      newSelected.delete(actualIndex);
    } else {
      newSelected.add(actualIndex);
    }
    setSelectedRows(newSelected);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Subject', 'Relation', 'Object', 'Source File', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...processedData.map(triple => [
        triple.id || '',
        `"${triple.subject}"`,
        `"${triple.relation}"`,
        `"${triple.object}"`,
        `"${triple.source_file || ''}"`,
        triple.created_at || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'triples_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      relation: '',
      object: '',
      source_file: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Excel-Style Data View</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Excel-Style Data View</h3>
        <div className="flex space-x-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            📊 Export CSV
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            🗑️ Clear Filters
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-2">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>

        {/* Column Filters */}
        <div className="grid grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Filter Subject..."
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Filter Relation..."
            value={filters.relation}
            onChange={(e) => setFilters(prev => ({ ...prev, relation: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Filter Object..."
            value={filters.object}
            onChange={(e) => setFilters(prev => ({ ...prev, object: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Filter Source File..."
            value={filters.source_file}
            onChange={(e) => setFilters(prev => ({ ...prev, source_file: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-2 py-2">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              {[
                { key: 'id', label: 'ID' },
                { key: 'subject', label: 'Subject' },
                { key: 'relation', label: 'Relation' },
                { key: 'object', label: 'Object' },
                { key: 'source_file', label: 'Source File' },
                { key: 'created_at', label: 'Created At' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="border border-gray-300 px-3 py-2 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(key as keyof Triple)}
                >
                  <div className="flex items-center justify-between">
                    {label}
                    {sortConfig.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((triple, index) => (
              <tr
                key={triple.id || index}
                className={`hover:bg-gray-50 ${
                  selectedRows.has(startIndex + index) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(startIndex + index)}
                    onChange={() => handleSelectRow(index)}
                    className="rounded"
                  />
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm">{triple.id || '-'}</td>
                <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-blue-600">
                  {triple.subject}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-green-600">
                  {triple.relation}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm font-medium text-purple-600">
                  {triple.object}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-600">
                  {triple.source_file || '-'}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-sm text-gray-500">
                  {triple.created_at ? new Date(triple.created_at).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, processedData.length)} of {processedData.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Records:</span> {processedData.length}
          </div>
          <div>
            <span className="font-medium">Selected:</span> {selectedRows.size}
          </div>
          <div>
            <span className="font-medium">Unique Subjects:</span> {new Set(processedData.map(t => t.subject)).size}
          </div>
          <div>
            <span className="font-medium">Unique Relations:</span> {new Set(processedData.map(t => t.relation)).size}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelStyleDataView;
