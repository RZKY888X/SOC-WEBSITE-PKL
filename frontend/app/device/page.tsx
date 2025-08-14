'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

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

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/sensors');
        const data: Sensor[] = await res.json();

        // Kelompokkan sensor unik per device
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

          // Update status device
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
        <h2 className="text-2xl font-bold mb-6">Devices</h2>

        {/* Grid 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(devices).map(([deviceName, { sensors, status }]) => {
            const { color, icon } = getStatusDetails(status);

            return (
              <div
                key={deviceName}
                className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-gray-700 hover:bg-[#334155] transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{deviceName}</h3>
                  <span className={`${color} flex items-center gap-1`}>
                    {icon}
                    {status}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-2">Jumlah Sensor</p>
                <p className="text-2xl font-bold">{sensors.length}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
