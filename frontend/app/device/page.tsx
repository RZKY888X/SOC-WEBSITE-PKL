'use client';

import { useEffect, useState } from 'react';

type Sensor = {
  device: string;
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

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/sensors');
        const data: Sensor[] = await res.json();

        // Kelompokkan sensor berdasarkan device
        const grouped: DeviceMap = {};

        data.forEach((sensor) => {
          const { device, status } = sensor;
          if (!grouped[device]) {
            grouped[device] = {
              sensors: [],
              status: 'Up',
            };
          }

          grouped[device].sensors.push(sensor);

          // Update status device jika ada sensor Warning atau Down
          if (status === 'Warning') grouped[device].status = 'Warning';
          if (status === 'Down') grouped[device].status = 'Down';
        });

        setDevices(grouped);
      } catch (error) {
        console.error('Gagal mengambil data device:', error);
      }
    };

    fetchDevices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Up':
        return 'bg-green-400';
      case 'Warning':
        return 'bg-yellow-400';
      case 'Down':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <main className="p-6">
        <div className="bg-[#1e293b] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Devices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Device</th>
                  <th className="py-2 px-4">Jumlah Sensor</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(devices).map(([deviceName, { sensors, status }]) => (
                  <tr key={deviceName} className="border-b border-gray-700 hover:bg-[#334155]">
                    <td className="py-3 px-4 flex items-center">
                      <span className={`h-3 w-3 rounded-full ${getStatusColor(status)} mr-2`}></span>
                      {status}
                    </td>
                    <td className="py-3 px-4">{deviceName}</td>
                    <td className="py-3 px-4">{sensors.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
