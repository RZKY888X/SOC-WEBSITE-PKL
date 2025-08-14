'use client';

import { useState } from 'react';

export default function AddDeviceForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (deviceName: string, sensorCount: number) => void;
  onCancel: () => void;
}) {
  const [deviceName, setDeviceName] = useState('');
  const [sensorCount, setSensorCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || sensorCount <= 0) return;
    onSubmit(deviceName, sensorCount);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-full max-w-md bg-[#0F1E33] text-white p-8 rounded-2xl shadow-lg overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Add Device</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Device Name</label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="w-full p-2 rounded bg-[#1A2B47] border border-[#324b74] focus:outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Sensor Count</label>
              <input
                type="number"
                min={1}
                value={sensorCount}
                onChange={(e) => setSensorCount(Number(e.target.value))}
                className="w-full p-2 rounded bg-[#1A2B47] border border-[#324b74] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-[#2C3E5D] rounded text-white hover:bg-[#3b4a6d]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1656CC] hover:bg-[#1f6eff] rounded text-white"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
