import React from 'react';

const DebugEnvironment: React.FC = () => {
  const envVars = {
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    OPENAI_KEY: process.env.REACT_APP_OPENAI_API_KEY ? 'SET' : 'NOT SET'
  };

  return (
    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔧 Environment Debug</h3>
      <div className="space-y-1 text-sm">
        <div><strong>SUPABASE_URL:</strong> {envVars.SUPABASE_URL || 'NOT SET'}</div>
        <div><strong>SUPABASE_KEY:</strong> {envVars.SUPABASE_KEY}</div>
        <div><strong>OPENAI_KEY:</strong> {envVars.OPENAI_KEY}</div>
      </div>
    </div>
  );
};

export default DebugEnvironment;
