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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-base font-medium"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm font-medium mt-2">{error}</p>}
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Campaign Type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all flex items-center justify-between font-medium"
              >
                {campaignType}
                <span className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
                  {CAMPAIGN_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setCampaignType(type);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg font-medium border-b border-gray-100 last:border-b-0 ${
                        campaignType === type ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-900'
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
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Campaign</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
