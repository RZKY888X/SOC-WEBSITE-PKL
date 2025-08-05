'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AlertPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await axios.get('http://localhost:3001/api/sensors/desktop');
        const sensors = res.data;

        // Filter hanya sensor yang status-nya bukan "3" (3 = OK)
        const downSensors = sensors.filter((s) => s.status !== 3);

        setAlerts(downSensors);
      } catch (err) {
        console.error('Gagal fetch sensor:', err);
      }
    }

    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      <main className="p-6">
        <div className="bg-[#1e293b] rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Alerts (Sensor Down)</h2>
          {alerts.length === 0 ? (
            <p className="text-white">Tidak ada sensor yang down</p>
          ) : (
            <ul className="space-y-4">
              {alerts.map((alert, index) => (
                <li
                  key={index}
                  className="bg-[#334155] rounded-lg p-4 border-l-4 border-red-500 shadow"
                >
                  <p className="text-lg font-semibold text-red-400">{alert.sensor}</p>
                  <p className="text-sm text-gray-300">Device: {alert.device}</p>
                  <p className="text-sm text-gray-300">Status: {alert.status === 0 ? 'Down' : 'Warning'}</p>
                  <p className="text-sm text-gray-400">Last Value: {alert.lastvalue}</p>
                  <p className="text-sm text-gray-500">
                    Terakhir update: {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
