'use client';

import { useEffect, useState } from 'react';
import AddDeviceForm from './components/AddDevice';
import { CheckCircle, AlertTriangle, XCircle, Pencil } from 'lucide-react';

type Device = {
  objid: string;
  device: string;
  host: string;
  parentid: string;
  status: number; // 0=Up, 1=Warning, 2=Down (PRTG status)
};

export default function DevicePage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const statusMap = {
    0: { label: 'Up', icon: <CheckCircle size={20} className="text-green-400" /> },
    1: { label: 'Warning', icon: <AlertTriangle size={20} className="text-yellow-400" /> },
    2: { label: 'Down', icon: <XCircle size={20} className="text-red-500" /> },
  };

  const fetchDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/devices');
      if (!res.ok) throw new Error('Failed to fetch devices');
      const data = await res.json();
      setDevices(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = async (deviceName: string, host: string, parentId: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: deviceName, host, parentId }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add device");
  
      alert("✅ Device berhasil ditambahkan (ID: " + data.objectId + ")");
      setShowForm(false);
      await fetchDevices();
    } catch (e: any) {
      alert("Error adding device: " + e.message);
    }
  };
  

  const handleDeleteDevice = async (objid: string) => {
    if (!confirm('Delete this device?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/devices/${objid}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete device');
      fetchDevices();
    } catch (e: any) {
      alert('Error deleting device: ' + e.message);
    }
  };

  const handleEditDevice = (objid: string, currentName: string) => {
    setEditingId(objid);
    setEditName(currentName);
  };

  const handleUpdateDevice = async (objid: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/devices/${objid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: editName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update device');
      setEditingId(null);
      fetchDevices();
    } catch (e: any) {
      alert('Error updating device: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 relative">
      <div className="bg-[#1e293b] rounded-xl p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Device Management</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition duration-200"
            onClick={() => setShowForm(true)}
          >
            Add Device
          </button>
        </div>

        {loading && <p>Loading devices...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Device Name</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(({ objid, device, status }) => {
                const st = statusMap[status] || { label: 'Unknown', icon: null };
                return (
                  <tr key={objid} className="border-b border-gray-700 hover:bg-[#334155]">
                    <td className="py-3 px-4 flex items-center gap-2">{st.icon}<span>{st.label}</span></td>
                    <td className="py-3 px-4">
                      {editingId === objid ? (
                        <input
                          type="text"
                          className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        device
                      )}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      {editingId === objid ? (
                        <>
                          <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-white text-sm" onClick={() => handleUpdateDevice(objid)}>Save</button>
                          <button className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600 text-white text-sm" onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700 text-white text-sm flex items-center gap-1" onClick={() => handleEditDevice(objid, device)}><Pencil size={14} /> Edit</button>
                          <button className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white text-sm" onClick={() => handleDeleteDevice(objid)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {devices.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">No devices found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <AddDeviceForm onSubmit={handleAddDevice} onCancel={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}
