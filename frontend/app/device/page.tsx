//device/page.tsx//
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import CardAddDevice from '../components/dashboard/CardAddDevice';

type Sensor = {
  device: string;
  sensor: string;
  status: string;
};

type DeviceMap = {
  [deviceName: string]: {
    sensors: Sensor[];
    status: 'Up' | 'Warning' | 'Down';
  };
};

export default function DevicePage() {
  const [devices, setDevices] = useState<DeviceMap>({});
  const [showAddDevice, setShowAddDevice] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/sensors');
        const data: Sensor[] = await res.json();

        const grouped: DeviceMap = {};
        const seen = new Set<string>();

        data.forEach((sensor) => {
          const { device, sensor: sensorName, status } = sensor;
          const uniqueKey = `${device}::${sensorName}`;

          if (seen.has(uniqueKey)) return;
          seen.add(uniqueKey);

          if (!grouped[device]) {
            grouped[device] = {
              sensors: [],
              status: 'Up',
            };
          }

          grouped[device].sensors.push(sensor);

          if (status === 'Warning' && grouped[device].status !== 'Down') {
            grouped[device].status = 'Warning';
          }
          if (status === 'Down') {
            grouped[device].status = 'Down';
          }
        });

        setDevices(grouped);
      } catch (error) {
        console.error('Gagal mengambil data device:', error);
      }
    };

    fetchDevices();
  }, []);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Up':
        return { color: 'text-green-400', icon: <CheckCircle size={20} /> };
      case 'Warning':
        return { color: 'text-yellow-400', icon: <AlertTriangle size={20} /> };
      case 'Down':
        return { color: 'text-red-500', icon: <XCircle size={20} /> };
      default:
        return { color: 'text-gray-400', icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">PRESOC</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            onClick={() => setShowAddDevice(true)}
          >
            Add Device
          </button>
        </div>

        <div className="bg-[#1e293b] rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-3 font-semibold text-sm border-b border-gray-600 pb-2 mb-2">
            <div>Status</div>
            <div>Devices</div>
            <div>Sensors</div>
          </div>

          {Object.entries(devices).map(([deviceName, { sensors, status }]) => {
            const { color, icon } = getStatusDetails(status);

            return (
              <div
                key={deviceName}
                className="grid grid-cols-3 text-sm items-center border-t border-gray-700 py-2"
              >
                <div className={`flex items-center gap-2 ${color}`}>
                  {icon} {status}
                </div>
                <div className="text-blue-400 underline">{deviceName}</div>
                <div>{sensors.length}</div>
              </div>
            );
          })}
        </div>

        {showAddDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-[#0f172a] p-6 rounded-lg w-full max-w-xl border border-blue-500">
              <CardAddDevice onCancel={() => setShowAddDevice(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}