'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (name: string, type: string) => void;
}

const CAMPAIGN_TYPES = [
  'Marketing Campaign',
  'Email Campaign',
  'Social Media',
  'Event',
  'Webinar',
  'Product Launch',
  'Seasonal Promotion',
  'Other'
];

export default function CampaignModal({ isOpen, onClose, onAddCampaign }: CampaignModalProps) {
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('Marketing Campaign');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignName.trim()) {
      setError('Campaign name is required');
      return;
    }

    onAddCampaign(campaignName.trim(), campaignType);
    setCampaignName('');
    setCampaignType('Marketing Campaign');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => {
                setCampaignName(e.target.value);
                setError('');
              }}
              placeholder="e.g., Summer Marketing 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors flex items-center justify-between"
              >
                {campaignType}
                <span className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {CAMPAIGN_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setCampaignType(type);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        campaignType === type ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Campaign</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
