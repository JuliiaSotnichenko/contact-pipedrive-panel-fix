'use client';

import { useState } from 'react';
import { ChevronDown, MoreVertical, Trash2, Edit3, Copy } from 'lucide-react';

interface CampaignData {
  id: string;
  name: string;
  type: string;
  inviteSent?: boolean;
  reminderSent?: boolean;
  attendedOn?: string;
  createdAt?: string;
}

interface CampaignItemProps {
  campaign: CampaignData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onDuplicate: (campaign: CampaignData) => void;
}

export default function CampaignItem({
  campaign,
  onDelete,
  onUpdate,
  onDuplicate,
}: CampaignItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = () => {
    if (campaign.attendedOn) {
      return <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold tracking-wide">ATTENDED</span>;
    }
    if (campaign.reminderSent) {
      return <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold tracking-wide">REMINDED</span>;
    }
    if (campaign.inviteSent) {
      return <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold tracking-wide">INVITED</span>;
    }
    return <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-semibold tracking-wide">PENDING</span>;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white">
      {/* Campaign Header */}
      <div className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1 flex items-center space-x-4">
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{campaign.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{campaign.type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
          {getStatusBadge()}
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              title="Actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-max overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(campaign);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-700 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-medium">Duplicate</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(campaign.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2.5 text-left hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Details (Expanded) */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-5 py-5 bg-white space-y-5">
          {/* Campaign Type Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Campaign Type</p>
              <p className="text-base font-semibold text-gray-900 mt-2">{campaign.type}</p>
            </div>
            {campaign.createdAt && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Created</p>
                <p className="text-base font-semibold text-gray-900 mt-2">
                  {new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </p>
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="border-t border-gray-200 pt-5 space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={campaign.inviteSent || false}
                onChange={(e) => onUpdate(campaign.id, 'inviteSent', e.target.checked)}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-colors cursor-pointer"
              />
              <span className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Invite Sent
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={campaign.reminderSent || false}
                onChange={(e) => onUpdate(campaign.id, 'reminderSent', e.target.checked)}
                className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-colors cursor-pointer"
              />
              <span className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Reminder Sent
              </span>
            </label>

            {/* Attended Date */}
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={campaign.attendedOn || ''}
                onChange={(e) => onUpdate(campaign.id, 'attendedOn', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="mm/dd/yyyy"
              />
              <label className="text-base font-semibold text-gray-900 whitespace-nowrap">Attended on</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
