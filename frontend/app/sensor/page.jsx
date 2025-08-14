'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SensorPage() {
  const [sensors, setSensors] = useState([]);
  const [stats, setStats] = useState({ up: 0, warning: 0, down: 0 });

  useEffect(() => {
    async function fetchSensors() {
      try {
        const res = await axios.get('http://localhost:3001/api/sensors');
        let data = res.data;

        // Urutkan dari terbaru
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Ambil hanya 1 data terbaru per objid
        const latestByObjid = {};
        data.forEach(sensor => {
          if (!latestByObjid[sensor.objid]) {
            latestByObjid[sensor.objid] = sensor;
          }
        });

        // Konversi kembali ke array
        const latestSensors = Object.values(latestByObjid);

        // Hitung statistik
        const up = latestSensors.filter(s => s.status === 'Up').length;
        const warning = latestSensors.filter(s => s.status === 'Warning').length;
        const down = latestSensors.filter(s => s.status === 'Down').length;

        setSensors(latestSensors);
        setStats({ up, warning, down });
      } catch (err) {
        console.error('Gagal fetch data sensor:', err);
      }
    }

    fetchSensors();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Up':
        return 'bg-green-500';
      case 'Warning':
        return 'bg-yellow-500';
      case 'Down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <main className="p-6 space-y-6">
        {/* Statistik Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold">Up</h3>
            <p className="text-3xl font-bold text-green-400">{stats.up}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold">Warning</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.warning}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold">Down</h3>
            <p className="text-3xl font-bold text-red-400">{stats.down}</p>
          </div>
        </div>

        {/* Tabel Sensor */}
        <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Daftar Sensor (Terbaru per Device)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-2 px-4">Device</th>
                  <th className="py-2 px-4">Sensor</th>
                  <th className="py-2 px-4">Last Value</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {sensors.map(sensor => (
                  <tr
                    key={sensor.id}
                    className="border-b border-gray-700 hover:bg-[#334155]"
                  >
                    <td className="py-3 px-4">{sensor.device}</td>
                    <td className="py-3 px-4">{sensor.sensor}</td>
                    <td className="py-3 px-4">{sensor.lastvalue}</td>
                    <td className="py-3 px-4 flex items-center">
                      <span
                        className={`h-3 w-3 rounded-full ${getStatusColor(sensor.status)} mr-2`}
                      ></span>
                      {sensor.status}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(sensor.timestamp).toLocaleString('id-ID')}
                    </td>
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
