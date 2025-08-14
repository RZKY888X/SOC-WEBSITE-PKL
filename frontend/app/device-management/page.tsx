'use client';

import { useEffect, useState } from 'react';
import AddDeviceForm from './components/AddDevice';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type Device = {
  objid: string;
  device: string;
  parentid: string;
  status: number; // 0=Up, 1=Warning, 2=Down (PRTG status)
};

export default function DevicePage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // Mapping PRTG status number ke string dan icon/color
  const statusMap = {
    0: { label: 'Up', color: 'bg-green-400', icon: <CheckCircle size={20} className="text-green-400" /> },
    1: { label: 'Warning', color: 'bg-yellow-400', icon: <AlertTriangle size={20} className="text-yellow-400" /> },
    2: { label: 'Down', color: 'bg-red-500', icon: <XCircle size={20} className="text-red-500" /> },
  };

  const fetchDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/devices');
      if (!res.ok) throw new Error('Failed to fetch devices');
      const data = await res.json();
      // data kemungkinan berisi array device dari PRTG API
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

  // Tambah device ke backend (POST /api/devices)
  const handleAddDevice = async (deviceName: string, sensorCount: number) => {
    // Contoh: kita butuh parentId (gunakan 0 default atau sesuaikan)
    const parentId = '0'; // kamu bisa buat input select untuk parent group sebenarnya

    try {
      const res = await fetch('http://localhost:3001/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: deviceName, parentId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to add device');

      setShowForm(false);
      await fetchDevices();
    } catch (e: any) {
      alert('Error adding device: ' + e.message);
    }
  };

  // Delete device
  const handleDeleteDevice = async (objid: string) => {
    if (!confirm('Delete this device?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/devices/${objid}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete device');
      await fetchDevices();
    } catch (e: any) {
      alert('Error deleting device: ' + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 relative">
      <div className="bg-[#1e293b] rounded-xl p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Device List</h2>
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
                const st = statusMap[status] || { label: 'Unknown', color: 'bg-gray-400', icon: null };
                return (
                  <tr key={objid} className="border-b border-gray-700 hover:bg-[#334155]">
                    <td className="py-3 px-4 flex items-center gap-2">
                      {st.icon}
                      <span>{st.label}</span>
                    </td>
                    <td className="py-3 px-4">{device}</td>
                    <td className="py-3 px-4">
                      <button
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white text-sm"
                        onClick={() => handleDeleteDevice(objid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {devices.length === 0 && !loading && <tr><td colSpan={3} className="py-4 text-center">No devices found</td></tr>}
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
