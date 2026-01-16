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
      return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">ATTENDED</span>;
    }
    if (campaign.reminderSent) {
      return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">REMINDED</span>;
    }
    if (campaign.inviteSent) {
      return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">INVITED</span>;
    }
    return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">PENDING</span>;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Campaign Header */}
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
        <div className="flex-1 flex items-center space-x-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
          <div className="flex-1">
            <h3 className="text-md font-semibold text-gray-900">{campaign.name}</h3>
            <p className="text-sm text-gray-500">{campaign.type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          {getStatusBadge()}
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Actions"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(campaign);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 first:rounded-t-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Duplicate</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(campaign.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 last:rounded-b-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Details (Expanded) */}
      {isExpanded && (
        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 space-y-4">
          {/* Campaign Type Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Campaign Type</p>
              <p className="text-sm text-gray-900 mt-1">{campaign.type}</p>
            </div>
            {campaign.createdAt && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Created</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Checkboxes */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`invite-${campaign.id}`}
                checked={campaign.inviteSent || false}
                onChange={(e) => onUpdate(campaign.id, 'inviteSent', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`invite-${campaign.id}`} className="text-sm font-medium text-gray-700">
                Invite Sent
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`reminder-${campaign.id}`}
                checked={campaign.reminderSent || false}
                onChange={(e) => onUpdate(campaign.id, 'reminderSent', e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`reminder-${campaign.id}`} className="text-sm font-medium text-gray-700">
                Reminder Sent
              </label>
            </div>

            {/* Attended Date */}
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={campaign.attendedOn || ''}
                onChange={(e) => onUpdate(campaign.id, 'attendedOn', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Attended on</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
