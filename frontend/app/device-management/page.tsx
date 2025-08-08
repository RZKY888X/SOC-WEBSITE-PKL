'use client';

import { useEffect, useState } from 'react';
import AddDeviceForm from './components/AddDevice';

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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/sensors');
        const data: Sensor[] = await res.json();

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

          if (status === 'Down') {
            grouped[device].status = 'Down';
          } else if (status === 'Warning' && grouped[device].status !== 'Down') {
            grouped[device].status = 'Warning';
          }
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

  const handleAddDevice = (deviceName: string, sensorCount: number) => {
    const newSensors: Sensor[] = Array.from({ length: sensorCount }).map(() => ({
      device: deviceName,
      status: 'Up',
    }));

    setDevices((prev) => ({
      ...prev,
      [deviceName]: {
        sensors: newSensors,
        status: 'Up',
      },
    }));

    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 relative">
      <div className="bg-[#1e293b] rounded-xl p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Device</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition duration-200"
            onClick={() => setShowForm(true)}
          >
            Add Device
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Devices</th>
                <th className="py-2 px-4">Sensors</th>
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <AddDeviceForm onSubmit={handleAddDevice} onCancel={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}