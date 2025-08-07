import React, { useState } from 'react';
import { FaSave, FaUndo } from 'react-icons/fa';

function Settings() {
  const [settings, setSettings] = useState({
    databaseUrl: 'https://nkjckkaqcdscrtzmmyyt.supabase.co',
    apiKey: '••••••••••••••••',
    updateInterval: 30,
    maxConcurrentAgents: 20,
    healthCheckInterval: 5,
    autoRestartThreshold: 75,
    emailNotifications: true,
    systemAlerts: true,
    theme: 'Light',
    timeFormat: '12-hour',
    dateFormat: 'MM/DD/YYYY'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for persistence
      localStorage.setItem('awip-settings', JSON.stringify(settings));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      databaseUrl: 'https://nkjckkaqcdscrtzmmyyt.supabase.co',
      apiKey: '••••••••••••••••',
      updateInterval: 30,
      maxConcurrentAgents: 20,
      healthCheckInterval: 5,
      autoRestartThreshold: 75,
      emailNotifications: true,
      systemAlerts: true,
      theme: 'Light',
      timeFormat: '12-hour',
      dateFormat: 'MM/DD/YYYY'
    };
    setSettings(defaultSettings);
    setSaveMessage('Settings reset to defaults.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <FaSave className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <FaUndo className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="database-url" className="block text-sm font-medium text-gray-700">Database URL</label>
              <input
                id="database-url"
                type="text"
                value={settings.databaseUrl}
                onChange={(e) => handleInputChange('databaseUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                id="api-key"
                type="password"
                value={settings.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="update-interval" className="block text-sm font-medium text-gray-700">Update Interval (seconds)</label>
              <input
                id="update-interval"
                type="number"
                value={settings.updateInterval}
                onChange={(e) => handleInputChange('updateInterval', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Agent Configuration</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="max-concurrent-agents" className="block text-sm font-medium text-gray-700">Max Concurrent Agents</label>
              <input
                id="max-concurrent-agents"
                type="number"
                value={settings.maxConcurrentAgents}
                onChange={(e) => handleInputChange('maxConcurrentAgents', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="health-check-interval" className="block text-sm font-medium text-gray-700">Health Check Interval (minutes)</label>
              <input
                id="health-check-interval"
                type="number"
                value={settings.healthCheckInterval}
                onChange={(e) => handleInputChange('healthCheckInterval', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="auto-restart-threshold" className="block text-sm font-medium text-gray-700">Auto-restart Threshold</label>
              <input
                id="auto-restart-threshold"
                type="number"
                value={settings.autoRestartThreshold}
                onChange={(e) => handleInputChange('autoRestartThreshold', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="email-notifications" className="block text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive alerts via email</p>
              </div>
              <span className="relative inline-flex items-center cursor-pointer">
                <input 
                  id="email-notifications" 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="system-alerts" className="block text-sm font-medium text-gray-700">System Alerts</label>
                <p className="text-sm text-gray-500">Show system alerts in dashboard</p>
              </div>
              <span className="relative inline-flex items-center cursor-pointer">
                <input 
                  id="system-alerts" 
                  type="checkbox" 
                  checked={settings.systemAlerts}
                  onChange={(e) => handleInputChange('systemAlerts', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
              <select 
                id="theme" 
                value={settings.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label htmlFor="time-format" className="block text-sm font-medium text-gray-700">Time Format</label>
              <select 
                id="time-format" 
                value={settings.timeFormat}
                onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>12-hour</option>
                <option>24-hour</option>
              </select>
            </div>
            <div>
              <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">Date Format</label>
              <select 
                id="date-format" 
                value={settings.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 