"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, WifiOff } from "lucide-react";

type Sensor = {
  objid: string;
  sensor: string;
  device: string;
  status: number;
  lastvalue: string;
  timestamp: string;
};

type UserLog = {
  id: number;
  userId?: number | null;
  username?: string | null;
  action: string;
  userAgent?: string | null;
  createdAt: string;
};

type MultiLoginAlert = {
  username: string;
  userAgents: string[];
  lastLogin: string;
};

export default function AlertPage() {
  const [view, setView] = useState<"sensor" | "user">("sensor");
  const [sensorAlerts, setSensorAlerts] = useState<Sensor[]>([]);
  const [multiLoginAlerts, setMultiLoginAlerts] = useState<MultiLoginAlert[]>([]);

  // Fetch sensor alerts
  useEffect(() => {
    async function fetchSensorAlerts() {
      try {
        const res = await axios.get<Sensor[]>(
          "http://localhost:3001/api/sensors/"
        );
        let sensors = res.data;
        let downSensors = sensors.filter((s) => s.status !== 3);
        downSensors = downSensors.filter(
          (sensor, index, self) =>
            index === self.findIndex((s) => s.objid === sensor.objid)
        );
        setSensorAlerts(downSensors);
      } catch (err) {
        console.error("Gagal fetch sensor:", err);
      }
    }

    fetchSensorAlerts();
    const iv = setInterval(fetchSensorAlerts, 10000);
    return () => clearInterval(iv);
  }, []);

  // Fetch multi-login alerts
  useEffect(() => {
    async function fetchMultiLoginAlerts() {
      try {
        const res = await axios.get<UserLog[]>(
          "http://localhost:3001/api/user-logs"
        );
        const logs = res.data;
        const loginLogs = logs.filter((log) =>
          log.action.toLowerCase().includes("login")
        );

        const grouped: Record<string, Set<string>> = {};
        const lastLogin: Record<string, string> = {};

        loginLogs.forEach((log) => {
          if (!log.username || !log.userAgent) return;
          if (!grouped[log.username]) grouped[log.username] = new Set();
          grouped[log.username].add(log.userAgent);
          lastLogin[log.username] = log.createdAt;
        });

        const alerts: MultiLoginAlert[] = [];
        for (const username in grouped) {
          if (grouped[username].size > 1) {
            alerts.push({
              username,
              userAgents: Array.from(grouped[username]),
              lastLogin: lastLogin[username],
            });
          }
        }

        setMultiLoginAlerts(alerts);
      } catch (err) {
        console.error("Gagal fetch user logs:", err);
      }
    }

    fetchMultiLoginAlerts();
    const iv = setInterval(fetchMultiLoginAlerts, 10000);
    return () => clearInterval(iv);
  }, []);

  // Content untuk sensor
  const renderSensorAlerts = () => {
    if (sensorAlerts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
          <WifiOff size={40} className="mb-3 text-gray-500" />
          <p className="text-lg font-medium">Tidak ada sensor yang down</p>
        </div>
      );
    }

    return (
      <ul className="space-y-4">
        {sensorAlerts.map((alert) => (
          <li
            key={alert.objid}
            className="bg-[#334155] rounded-lg p-5 border-l-4 border-red-500 shadow hover:shadow-xl transition duration-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-red-400">
                {alert.sensor}
              </p>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  alert.status === 0
                    ? "bg-red-600 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {alert.status === 0
                  ? "Down"
                  : alert.status === 1
                  ? "Warning"
                  : "Unknown"}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Device: {alert.device}</p>
            <p className="text-sm text-gray-400">Last Value: {alert.lastvalue}</p>
            <p className="text-xs text-gray-500 mt-2">
              Terakhir update: {new Date(alert.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  // Content untuk multi-login
  const renderMultiLoginAlerts = () => {
    if (multiLoginAlerts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-300">
          <WifiOff size={40} className="mb-3 text-gray-500" />
          <p className="text-lg font-medium">
            Tidak ada akun login di lebih dari satu device
          </p>
        </div>
      );
    }

    return (
      <ul className="space-y-4">
        {multiLoginAlerts.map((alert) => (
          <li
            key={alert.username}
            className="bg-[#334155] rounded-lg p-5 border-l-4 border-red-500 shadow hover:shadow-xl transition duration-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-red-400">{alert.username}</p>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-600 text-white">
                Multi Login
              </span>
            </div>

            <p className="text-sm text-gray-300 mt-1">
              Devices/Browser:
              {alert.userAgents.map((ua) => (
                <span
                  key={ua}
                  className="ml-1 inline-block px-2 py-1 rounded bg-[#1E4DB7] text-white text-xs"
                >
                  {ua}
                </span>
              ))}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Last Login: {new Date(alert.lastLogin).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      {/* Sidebar */}
      <nav className="w-56 bg-[#0D1B2A] p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-4">Alerts</h2>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded font-medium text-sm ${
            view === "sensor" ? "bg-[#1E4DB7]" : "hover:bg-[#1E3C72]"
          }`}
          onClick={() => setView("sensor")}
        >
          <AlertTriangle size={18} />
          Sensor Alerts
        </button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded font-medium text-sm ${
            view === "user" ? "bg-[#1E4DB7]" : "hover:bg-[#1E3C72]"
          }`}
          onClick={() => setView("user")}
        >
          <AlertTriangle size={18} />
          User Alerts
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-semibold mb-4">
          {view === "sensor" ? "Sensor Alerts" : "User Alerts"}
        </h1>
        <div className="space-y-4">
          {view === "sensor" ? renderSensorAlerts() : renderMultiLoginAlerts()}
        </div>
      </main>
    </div>
  );
}
