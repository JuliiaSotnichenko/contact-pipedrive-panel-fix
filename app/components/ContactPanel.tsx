'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Calendar, MessageSquare, MapPin, Edit3, Check, X } from 'lucide-react';
import AppExtensionsSDK, { Command } from '@pipedrive/app-extensions-sdk';

export default function ContactPanel() {
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Array<{id: number; text: string; timestamp: string}>>([]);
  const [newNote, setNewNote] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    console.log('ContactPanel: mounted - NEW VERSION WITH SDK');
    let sdk: any = null;

    const initializeSDK = async () => {
      try {
        console.log('ContactPanel: initializing Pipedrive SDK - NEW VERSION');
        sdk = await new AppExtensionsSDK().initialize({ size: { height: 600 } });
        console.log('ContactPanel: SDK initialized successfully', sdk);
        
        // Try to resize to ensure panel is visible
        try {
          await sdk.execute(Command.RESIZE, { height: 600 });
          console.log('ContactPanel: resized to 600px');
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
          status: 'Active'
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
          status: 'Active'
        });
        setLoading(false);
      }
    };

    initializeSDK();

    return () => {
      // Cleanup
    };
  }, []);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        timestamp: new Date().toLocaleString()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Deal Value</p>
              <p className="text-2xl font-bold text-blue-600">{contactData?.dealValue}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Notes</p>
              <p className="text-2xl font-bold text-purple-600">{notes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
          </div>
          
          <div className="space-y-3 mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={handleAddNote}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No notes yet. Add one above!</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 mb-2">{note.text}</p>
                  <p className="text-xs text-gray-500">{note.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
