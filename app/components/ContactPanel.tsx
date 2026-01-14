'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Calendar, MessageSquare } from 'lucide-react';

export default function ContactPanel() {
  const [contactData, setContactData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Array<{id: number; text: string; timestamp: string}>>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // Helper to request parent to resize iframe - try several common message types
    const requestResize = (height: number) => {
      try {
        window.parent.postMessage({ type: 'SET_HEIGHT', height }, '*');
      } catch {}
      try {
        window.parent.postMessage({ type: 'pipedrive:resize', height }, '*');
      } catch {}
      try {
        window.parent.postMessage({ type: 'resize', height }, '*');
      } catch {}
    };
    console.log('ContactPanel: mounted');

    // Listen for messages from Pipedrive
    const handleMessage = (event: MessageEvent) => {
      console.log('ContactPanel: received window.message', event?.origin, event?.data);
      try {
        const data = event?.data;
        if (!data) return;
        // Accept either stringified JSON or structured objects
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        if (payload?.type === 'PIPEDRIVE_CONTEXT' || payload?.type === 'pipedrive.context') {
          console.log('ContactPanel: setting contactData from Pipedrive payload', payload.data ?? payload);
          setContactData(payload.data ?? payload);
          setLoading(false);
          try { requestResize(600); } catch (e) { /* ignore */ }
          return;
        }

        // Some Pipedrive example payloads (and other hosts) send an object with
        // a `data` array. Accept that shape and map its first item to our UI.
        if (!payload.type && payload?.data && Array.isArray(payload.data) && payload.data.length > 0) {
          const item = payload.data[0];
          const mapped: any = {
            id: item.id,
            name: item.header ?? item.name ?? item.title,
            email: item.email ?? item.contact_email ?? null,
            phone: item.phone ?? item.contact_phone ?? null,
            organization: item.manufacturer ?? item.organization ?? item.project ?? null,
            lastContact: item.delivery_date ?? item.lastContact ?? null,
            dealValue: item.delivery_cost ? `${item.delivery_cost.code} ${item.delivery_cost.value}` : item.dealValue ?? null,
            status: item.status?.label ?? (item.status ?? null),
            _raw: item
          };
          console.log('ContactPanel: mapped host data to panel shape', mapped);
          setContactData(mapped);
          setLoading(false);
          try { requestResize(600); } catch (e) { /* ignore */ }
          return;
        }

        // If host passed only identifying URL params (resource + id), map them
        // into a minimal object so the panel shows something instead of the
        // fallback spinner/error.
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const resource = urlParams.get('resource') || urlParams.get('type');
          const id = urlParams.get('id') || urlParams.get('identifier') || urlParams.get('resource_id') || urlParams.get('person_id') || urlParams.get('deal_id');
          if (resource || id) {
            const mapped: any = {
              id: id ?? undefined,
              name: `${resource ?? 'Item'} ${id ?? ''}`.trim(),
              email: null,
              phone: null,
              organization: null,
              lastContact: null,
              dealValue: null,
              status: null,
              _urlParams: { resource, id }
            };
            console.log('ContactPanel: mapped URL params to panel shape', mapped);
            setContactData(mapped);
            setLoading(false);
            return;
          }
        } catch (e) {
          /* ignore */
        }
      } catch (err) {
        console.error('ContactPanel: error handling message', err);
      }
    };

    window.addEventListener('message', handleMessage);

    // Request context from Pipedrive
    try {
      console.log('ContactPanel: posting GET_CONTEXT to parent check if visible');
      window.parent.postMessage({ type: 'GET_CONTEXT' }, '*');
    } catch (err) {
      console.error('ContactPanel: postMessage failed', err);
    }

    // Log location and frame name to help debug host integration
    try {
      console.log('ContactPanel: location', window.location.href);
      console.log('ContactPanel: window.name', window.name);
      // Also check if host provided context via URL params (some examples do)
      try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (dataParam) {
          console.log('ContactPanel: found data in URL params, parsing');
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          // If parsed is an object with `data` array, map same as message handler
          if (parsed?.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
            const item = parsed.data[0];
            const mapped: any = {
              id: item.id,
              name: item.header ?? item.name ?? item.title,
              email: item.email ?? null,
              phone: item.phone ?? null,
              organization: item.manufacturer ?? item.organization ?? item.project ?? null,
              lastContact: item.delivery_date ?? null,
              dealValue: item.delivery_cost ? `${item.delivery_cost.code} ${item.delivery_cost.value}` : null,
              status: item.status?.label ?? (item.status ?? null),
              _raw: item
            };
            console.log('ContactPanel: mapped URL data to panel shape', mapped);
            setContactData(mapped);
            setLoading(false);
          }
        }
      } catch (e) {
        /* ignore parsing errors */
      }
    } catch (err) {
      /* ignore */
    }

    // Retry posting common GET_CONTEXT variants a few times in case the host
    // isn't ready immediately or expects a different message type.
    let attempts = 0;
    const retry = setInterval(() => {
      attempts += 1;
      if (attempts > 6) {
        clearInterval(retry);
        return;
      }
      console.log('ContactPanel: retrying GET_CONTEXT attempt', attempts);
      try { window.parent.postMessage({ type: 'GET_CONTEXT' }, '*'); } catch {};
      try { window.parent.postMessage({ type: 'getContext' }, '*'); } catch {};
      try { window.parent.postMessage({ type: 'pipedrive.getContext' }, '*'); } catch {};
      try { window.parent.postMessage({ type: 'REQUEST_CONTEXT' }, '*'); } catch {};
    }, 1000);

    // Fallback mock data for testing (only if nothing responds)
    const fallback = setTimeout(() => {
      setContactData((prev: any) => {
        if (prev) return prev;
        console.log('ContactPanel: using fallback mock data');
        setLoading(false);
        return {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          organization: 'Acme Corporation',
          lastContact: '2025-01-10',
          dealValue: '$15,000',
          status: 'Active'
        };
      });
    }, 1200);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallback);
      try { clearInterval(retry); } catch (e) { /* ignore */ }
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
        <div className="bg-white rounded-lg shadow p-4 border border-dashed">
          <h2 className="text-lg font-semibold mb-2">Test Data</h2>
          <p className="text-sm text-gray-600">ID: {contactData?.id ?? '—'}</p>
          <p className="text-sm text-gray-600">Name: {contactData?.name ?? '—'}</p>
          <p className="text-sm text-gray-600">Status: {contactData?.status ?? contactData?._raw?.status?.label ?? '—'}</p>
          <p className="text-sm text-gray-600">Deal Value: {contactData?.dealValue ?? (contactData?._raw?.delivery_cost ? `${contactData._raw.delivery_cost.code} ${contactData._raw.delivery_cost.value}` : '—')}</p>
          <p className="text-sm text-gray-600">Note: {contactData?._raw?.note?.value ?? contactData?._raw?.note ?? '—'}</p>
          <p className="text-sm text-gray-600">Tracking: {contactData?._raw?.tracking?.value ?? '—'}</p>
          <details className="mt-2">
            <summary className="text-sm text-blue-600 cursor-pointer">Raw payload</summary>
            <pre className="text-xs overflow-auto max-h-48 p-2">{JSON.stringify(contactData?._raw ?? contactData, null, 2)}</pre>
          </details>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contactData?.name}</h1>
              <span className="inline-block px-3 py-1 mt-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                {contactData?.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{contactData?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{contactData?.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="text-gray-900">{contactData?.organization}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Last Contact</p>
                <p className="text-gray-900">{contactData?.lastContact}</p>
              </div>
            </div>
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
