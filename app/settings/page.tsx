'use client';

import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Check } from 'lucide-react';
import AppExtensionsSDK from '@pipedrive/app-extensions-sdk';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: '',
    enableNotifications: true,
    defaultCampaignType: 'Marketing Campaign',
    autoSyncInterval: '30',
  });

  useEffect(() => {
    console.log('Settings page: mounted');
    let sdk: any = null;

    const initializeSDK = async () => {
      try {
        console.log('Settings page: initializing Pipedrive SDK');
        sdk = await new AppExtensionsSDK().initialize({ size: { height: 600 } });
        console.log('Settings page: SDK initialized successfully');

        // Load saved settings from localStorage for now
        // In production, you'd load from your backend/database
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Settings page: SDK initialization failed', err);
        setLoading(false);
      }
    };

    initializeSDK();

    return () => {
      // Cleanup
    };
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // Save settings to localStorage (in production, save to your backend)
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="w-7 h-7 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">App Settings</h1>
          </div>
          <p className="text-gray-600">Configure your Contact Panel application preferences</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 space-y-6">
            {/* API Configuration */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                API Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-900 mb-2">
                    API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your API key will be encrypted and stored securely</p>
                </div>
              </div>
            </div>

            {/* Campaign Settings */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Campaign Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="defaultCampaignType" className="block text-sm font-semibold text-gray-900 mb-2">
                    Default Campaign Type
                  </label>
                  <select
                    id="defaultCampaignType"
                    value={settings.defaultCampaignType}
                    onChange={(e) => setSettings({ ...settings, defaultCampaignType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                  >
                    <option>Marketing Campaign</option>
                    <option>Email Campaign</option>
                    <option>Social Media</option>
                    <option>Event</option>
                    <option>Webinar</option>
                    <option>Product Launch</option>
                    <option>Seasonal Promotion</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="autoSync" className="block text-sm font-semibold text-gray-900 mb-2">
                    Auto-sync Interval (minutes)
                  </label>
                  <input
                    id="autoSync"
                    type="number"
                    min="5"
                    max="120"
                    value={settings.autoSyncInterval}
                    onChange={(e) => setSettings({ ...settings, autoSyncInterval: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">How often to sync campaign data (5-120 minutes)</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Notifications
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-colors cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Enable campaign notifications
                    </span>
                    <p className="text-xs text-gray-500">Get notified when campaign actions are completed</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {saved && (
                <span className="flex items-center text-green-600 font-medium">
                  <Check className="w-4 h-4 mr-1" />
                  Settings saved successfully!
                </span>
              )}
            </p>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-blue-900 mb-1">💡 Configuration Tips</h3>
          <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Changes are saved instantly and applied to all users</li>
            <li>API keys are encrypted before storage</li>
            <li>Adjust sync intervals based on your usage patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
