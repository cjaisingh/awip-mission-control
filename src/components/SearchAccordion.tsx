import React, { useState } from 'react';

const SearchAccordion: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="backdrop-blur-md bg-white/40 border-b border-white/30 shadow-sm rounded-xl mx-4 mt-4">
      <button
        className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-white/60 rounded-t-xl"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center space-x-3">
          <i className="fas fa-search text-gray-500" />
          <span className="font-medium text-gray-900">Advanced Search</span>
        </div>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'} text-gray-500 transition-transform`} />
      </button>
      {open && (
        <div className="px-6 pb-4 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>All Domains</option>
                <option>Project Management</option>
                <option>Finance</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAccordion; 