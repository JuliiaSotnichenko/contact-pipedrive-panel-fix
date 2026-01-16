'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Calendar, MessageSquare, MapPin, Edit3, Check, X, ChevronDown, Baby, Gift, Plus } from 'lucide-react';
import AppExtensionsSDK, { Command } from '@pipedrive/app-extensions-sdk';
import CampaignModal from './CampaignModal';
import CampaignItem from './CampaignItem';

interface Campaign {
  id: string;
  name: string;
  type: string;
  inviteSent?: boolean;
  reminderSent?: boolean;
  attendedOn?: string;
  createdAt?: string;
}

export default function ContactPanel() {
  const [contactData, setContactData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    console.log('ContactPanel: mounted - NEW VERSION WITH SDK');
    let sdk: any = null;

    const initializeSDK = async () => {
      try {
        console.log('ContactPanel: initializing Pipedrive SDK - CAMPAIGNS VERSION v1.2');
        sdk = await new AppExtensionsSDK().initialize({ size: { height: 750 } });
        console.log('ContactPanel: SDK initialized successfully', sdk);
        
        // Try to resize to ensure panel is visible with new campaigns section
        try {
          await sdk.execute(Command.RESIZE, { height: 750 });
          console.log('ContactPanel: resized to 750px for campaigns (max allowed)');
        } catch (err) {
          console.error('ContactPanel: resize failed', err);
        }

        // Load data from fallback for testing
        setContactData({
          id: 1,
          name: 'Jetflier',
          email: 'j***@*****.com',
          phone: '+1 ***-***-8900',
          organization: 'Acme Corporation',
          address: '123 Business St, Suite 100, New York, NY 10001',
          lastContact: '2025-01-10',
          dealValue: '$15,000',
          status: 'Active',
          hasKids: 'Yes',
          giftsSent: ['Birthday Card', 'Holiday Gift']
        });
        setLoading(false);
        console.log('ContactPanel: data set and loading complete');
      } catch (err) {
        console.error('ContactPanel: SDK initialization failed', err);
        // Set fallback data anyway
        setContactData({
          id: 1,
          name: 'Jetflier (Fallback)',
          email: 'j***@*****.com',
          phone: '+1 ***-***-8900',
          organization: 'Acme Corporation',
          address: '123 Business St, Suite 100, New York, NY 10001',
          lastContact: '2025-01-10',
          dealValue: '$15,000',
          status: 'Active',
          hasKids: 'Yes',
          giftsSent: ['Birthday Card', 'Holiday Gift'],
          campaigns: {
            'Static Display 2026': {
              inviteSent: true,
              reminderSent: false,
              attendedOn: '2026-01-20'
            }
          }
        });
        setLoading(false);
      }
    };

    initializeSDK();

    return () => {
      // Cleanup
    };
  }, []);

  const handleCampaignCheckbox = (campaignName: string, field: string, value: boolean) => {
    setContactData((prev: any) => ({
      ...prev,
      campaigns: {
        ...prev.campaigns,
        [campaignName]: {
          inviteSent: false,
          reminderSent: false,
          attendedOn: '',
          ...prev.campaigns?.[campaignName],
          [field]: value
        }
      }
    }));
  };

  const handleCampaignDate = (campaignName: string, field: string, value: string) => {
    setContactData((prev: any) => ({
      ...prev,
      campaigns: {
        ...prev.campaigns,
        [campaignName]: {
          inviteSent: false,
          reminderSent: false,
          attendedOn: '',
          ...prev.campaigns?.[campaignName],
          [field]: value
        }
      }
    }));
  };

  const handleAddCampaign = (name: string, type: string) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name,
      type,
      inviteSent: false,
      reminderSent: false,
      attendedOn: '',
      createdAt: new Date().toISOString()
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleUpdateCampaign = (id: string, field: string, value: any) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      createdAt: new Date().toISOString(),
      inviteSent: false,
      reminderSent: false,
      attendedOn: ''
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField && editValue.trim()) {
      setContactData((prev: any) => ({
        ...prev,
        [editingField]: editValue
      }));
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleSingleSelect = (field: string, value: string) => {
    setContactData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setShowDropdown(null);
  };

  const handleMultiSelect = (field: string, value: string) => {
    setContactData((prev: any) => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  const renderSingleDropdown = (field: string, value: string, options: string[], icon: any, label: string) => {
    const isOpen = showDropdown === field;
    
    return (
      <div className="flex items-center space-x-3">
        {icon}
        <div className="flex-1 relative">
          <p className="text-sm text-gray-500">{label}</p>
          <button
            onClick={() => setShowDropdown(isOpen ? null : field)}
            className="flex items-center justify-between w-full text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span>{value || 'Select...'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => handleSingleSelect(field, option)}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg ${
                    value === option ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMultiDropdown = (field: string, values: string[], options: string[], icon: any, label: string) => {
    const isOpen = showDropdown === field;
    const displayValue = values?.length > 0 ? values.join(', ') : 'None selected';
    
    return (
      <div className="flex items-center space-x-3">
        {icon}
        <div className="flex-1 relative">
          <p className="text-sm text-gray-500">{label}</p>
          <button
            onClick={() => setShowDropdown(isOpen ? null : field)}
            className="flex items-center justify-between w-full text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span className="truncate">{displayValue}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
              {options.map(option => (
                <label
                  key={option}
                  className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                >
                  <input
                    type="checkbox"
                    checked={values?.includes(option) || false}
                    onChange={() => handleMultiSelect(field, option)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEditableField = (field: string, value: string, icon: any) => {
    const isEditing = editingField === field;
    
    return (
      <div className="flex items-center space-x-3">
        {icon}
        <div className="flex-1">
          <p className="text-sm text-gray-500 capitalize">{field === 'lastContact' ? 'Last Contact' : field}</p>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="text-gray-900 bg-transparent border-b border-blue-500 focus:outline-none flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
              />
              <button onClick={saveEdit} className="text-green-600 hover:text-green-700">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={cancelEdit} className="text-red-600 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 group">
              <p className="text-gray-900">{value}</p>
              <button 
                onClick={() => startEdit(field, value)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 bg-gray-50 w-full" style={{ minHeight: 350 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 w-full" style={{ minHeight: 420 }}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              {editingField === 'name' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b border-blue-500 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button onClick={saveEdit} className="text-green-600 hover:text-green-700">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={cancelEdit} className="text-red-600 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group">
                  <h1 className="text-2xl font-bold text-gray-900">{contactData?.name}</h1>
                  <button 
                    onClick={() => startEdit('name', contactData?.name)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              )}
              <span className="inline-block px-3 py-1 mt-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                {contactData?.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {renderEditableField('email', contactData?.email, <Mail className="w-5 h-5 text-gray-400" />)}
            {renderEditableField('phone', contactData?.phone, <Phone className="w-5 h-5 text-gray-400" />)}
            {renderEditableField('organization', contactData?.organization, <Building2 className="w-5 h-5 text-gray-400" />)}
            {renderEditableField('address', contactData?.address, <MapPin className="w-5 h-5 text-gray-400" />)}
            {renderEditableField('lastContact', contactData?.lastContact, <Calendar className="w-5 h-5 text-gray-400" />)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Marketing Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSingleDropdown(
              'hasKids', 
              contactData?.hasKids, 
              ['Yes', 'No', 'Unknown'], 
              <Baby className="w-5 h-5 text-gray-400" />, 
              'Has Kids'
            )}
            {renderMultiDropdown(
              'giftsSent', 
              contactData?.giftsSent || [], 
              ['Birthday Card', 'Holiday Gift', 'Welcome Package', 'Thank You Note', 'Product Sample', 'Voucher'], 
              <Gift className="w-5 h-5 text-gray-400" />, 
              'Gifts Sent'
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Deal Value</p>
              <p className="text-2xl font-bold text-blue-600">{contactData?.dealValue}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-purple-600">{campaigns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Campaigns</h2>
            </div>
            <button 
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Campaign</span>
            </button>
          </div>
          
          {campaigns.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No campaigns yet. Click "Add Campaign" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map(campaign => (
                <CampaignItem
                  key={campaign.id}
                  campaign={campaign}
                  onDelete={handleDeleteCampaign}
                  onUpdate={handleUpdateCampaign}
                  onDuplicate={handleDuplicateCampaign}
                />
              ))}
            </div>
          )}
        </div>

        <CampaignModal 
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          onAddCampaign={handleAddCampaign}
        />
      </div>
    </div>
  );
}
