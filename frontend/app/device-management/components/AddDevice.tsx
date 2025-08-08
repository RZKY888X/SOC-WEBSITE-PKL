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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative z-50 w-full max-w-2xl bg-[#0F1E33] text-white p-8 rounded-2xl shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Add Device</h2>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Device Settings */}
          <div>
            <h3 className="text-md font-semibold mb-4">Basic Device Settings</h3>

            <label className="block text-sm mb-1">Device Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full p-2 rounded bg-[#1A2B47] border border-[#324b74] focus:outline-none"
            />

            <label className="block text-sm mt-4 mb-1">Sensor Count</label>
            <input
              type="number"
              min={1}
              value={sensorCount}
              onChange={(e) => setSensorCount(parseInt(e.target.value))}
              className="w-full p-2 rounded bg-[#1A2B47] border border-[#324b74] focus:outline-none"
            />

            <label className="block text-sm mt-4 mb-1">IP Version</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="ipVersion" defaultChecked />
                <span>IPv4 (default)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="ipVersion" />
                <span>IPv6</span>
              </label>
            </div>

            <label className="block text-sm mt-4 mb-1">IPv4 Address/DNS Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-[#1A2B47] border border-[#324b74] focus:outline-none"
            />
          </div>

          {/* Auto Discovery Settings */}
          <div>
            <h3 className="text-md font-semibold mb-4">Auto Discovery Settings</h3>
            <label className="block text-sm mb-2">Auto-Discovery Level</label>

            <div className="space-y-2">
              {[
                "No auto-discovery (default)",
                "Default auto-discovery (recommended)",
                "Detailed auto-discovery",
                "Auto-discovery with specific device templates",
              ].map((label, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="autoDiscovery"
                    defaultChecked={index === 0}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
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
  );
}