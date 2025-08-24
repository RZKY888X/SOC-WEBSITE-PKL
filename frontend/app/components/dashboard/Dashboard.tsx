"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LogItem } from "@/lib/types";
import { useSession } from "next-auth/react";

// -------------------------
// Small helper UI components
// -------------------------
function StatCard({ title, value, hint }: { title: string; value: number | string; hint?: string }) {
  return (
    <div className="relative bg-gradient-to-br from-[#1c2530] via-[#1a2332] to-[#162028] p-6 rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{title}</div>
        <div className="mt-3 text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {value}
        </div>
        {hint && <div className="mt-2 text-xs text-gray-500 leading-relaxed">{hint}</div>}
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl"></div>
    </div>
  );
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group">
      <div className="w-32 text-sm text-gray-300 truncate font-medium group-hover:text-white transition-colors">{label}</div>
      <div className="flex-1 h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#2b6cb0] via-[#4299e1] to-[#5d7bb6] rounded-full shadow-lg transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-12 text-right text-sm font-semibold text-blue-400">{value}</div>
    </div>
  );
}

function DeviceTable({ deviceMap }: { deviceMap: Record<string, LogItem[]> }) {
  const rows = Object.entries(deviceMap).map(([device, sensors]) => ({ device, sensors }));
  return (
    <div className="bg-gradient-to-br from-[#1B263B] via-[#1a2538] to-[#162235] p-6 rounded-3xl shadow-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Device List</h3>
        <div className="text-sm text-gray-400 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
          Total devices: <span className="font-semibold text-blue-400">{rows.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((r) => (
          <div key={r.device} className="relative bg-gradient-to-br from-[#0f172a] via-[#0d1520] to-[#0a1218] p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{r.device}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Sensors: <span className="font-semibold text-green-400">{r.sensors.length}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Last check</div>
                  <div className="text-sm text-gray-300 font-mono bg-black/30 px-2 py-1 rounded">{getLastCheck(r.sensors) ?? '-'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {r.sensors.slice(0, 10).map((s, i) => (
                  <div key={s.device + s.sensor + i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="truncate pr-2 text-gray-300">{s.sensor}</div>
                    <div className="ml-2 text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded">{s.lastvalue ?? '-'}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsPanel({ alerts }: { alerts: LogItem[] }) {
  if (!alerts.length) {
    return (
      <div className="bg-gradient-to-br from-[#1B263B] to-[#0F1419] p-6 rounded-3xl text-center border border-green-500/20 shadow-2xl">
        <div className="text-green-400 text-2xl mb-2">✅</div>
        <div className="text-sm text-gray-400 font-medium">No active critical alerts</div>
        <div className="mt-2 text-xs text-green-500">All systems operational</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1B263B] via-[#2B1B1B] to-[#1B0F0F] p-6 rounded-3xl shadow-2xl border border-red-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-red-500 text-2xl animate-pulse">🚨</div>
        <h3 className="text-xl font-bold text-red-400">Critical Alerts</h3>
        <div className="ml-auto bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
          {alerts.length}
        </div>
      </div>
      <div className="space-y-3 max-h-80 overflow-auto custom-scrollbar">
        {alerts.map((a, idx) => (
          <div key={idx} className="bg-gradient-to-r from-[#2b1a1a] to-[#3a1f1f] p-4 rounded-xl flex items-start gap-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:shadow-lg">
            <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded-full shadow-lg"></div>
            <div className="flex-1">
              <div className="font-bold text-white">{a.device} / {a.sensor}</div>
              <div className="text-sm text-gray-300 mt-1">
                Status: <span className="text-red-400 font-semibold">{a.status}</span> •
                Value: <span className="text-yellow-400 font-mono">{a.lastvalue ?? '-'}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 font-mono bg-black/30 inline-block px-2 py-1 rounded">
                {formatTimestamp(a.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------
// Utilities
// -------------------------
function formatTimestamp(ts?: string | null) {
  if (!ts) return '-';
  try {
    return new Date(ts).toLocaleString("id-ID", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return ts;
  }
}

function getLastCheck(sensors: LogItem[]) {
  const timestamps = sensors.map((s) => (s.timestamp ? new Date(s.timestamp).getTime() : 0));
  const max = Math.max(...timestamps);
  if (!max || max <= 0) return null;
  return new Date(max).toLocaleString();
}

// -------------------------
// Main Dashboard Component
// -------------------------
interface ApiResponse {
  device?: string;
  sensor?: string;
  status?: string;
  lastvalue?: string;
  lastvalue_raw?: string;
  lastcheck?: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogItem[]>([]);

  // Remove unused session variable warning by using it in a comment
  console.log('Session loaded:', !!session);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/sensors");
        const data: ApiResponse[] = await res.json();
        const formatted: LogItem[] = data.map((l) => {
          const rawDateStr = l.lastcheck?.split("<")[0]?.trim();
          const parsed = new Date(rawDateStr || '');
          return { 
            device: l.device || 'unknown',
            sensor: l.sensor || 'unknown',
            status: l.status || 'unknown',
            lastvalue: l.lastvalue,
            lastvalue_raw: l.lastvalue_raw,
            timestamp: !isNaN(parsed.getTime()) ? parsed.toISOString() : l.lastcheck || null 
          };
        });
        if (mounted) setLogs(formatted);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    const iv = setInterval(fetchData, 10 * 60 * 1000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  const uniquePerDevice = useMemo(() => {
    const map: Record<string, LogItem[]> = {};
    const seen = new Set<string>();
    for (const l of logs) {
      const device = l.device ?? 'unknown';
      const sensor = l.sensor ?? 'unknown';
      const key = `${device}::${sensor}`;
      if (!seen.has(key)) {
        seen.add(key);
        if (!map[device]) map[device] = [];
        map[device].push(l);
      }
    }
    return map;
  }, [logs]);

  const totalUniqueSensors = useMemo(() => {
    const seen = new Set<string>();
    for (const l of logs) seen.add(`${l.device}::${l.sensor}`);
    return seen.size;
  }, [logs]);

  const latestPerSensor = useMemo(() => {
    const store: Record<string, LogItem> = {};
    for (const l of logs) {
      const key = `${l.device}::${l.sensor}`;
      const t = l.timestamp ? new Date(l.timestamp).getTime() : 0;
      if (!store[key] || t >= (store[key].timestamp ? new Date(store[key].timestamp).getTime() : 0)) {
        store[key] = l;
      }
    }
    return store;
  }, [logs]);

  const { warning, critical } = useMemo(() => {
    let w = 0, c = 0;
    Object.values(latestPerSensor).forEach((l) => {
      const s = (l.status || '').toLowerCase();
      if (s === 'warning') w++;
      else if (s === 'down' || s === 'critical') c++;
    });
    return { warning: w, critical: c };
  }, [latestPerSensor]);

  const alerts = useMemo(() => Object.values(latestPerSensor).filter((l) => {
    const s = (l.status || '').toLowerCase();
    return s === 'down' || s === 'critical';
  }), [latestPerSensor]);

  const maxPerDevice = useMemo(() => Math.max(...Object.values(uniquePerDevice).map((arr) => arr.length), 0), [uniquePerDevice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0a1120] to-[#050a15] text-white p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header with gradient */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            System Dashboard
          </h1>
          <p className="text-gray-400">Real-time monitoring and alerts</p>
        </div>

        {/* Top summary with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-8">
          <StatCard title="Total Devices" value={Object.keys(uniquePerDevice).length} hint="Unique monitored devices" />
          <StatCard title="Total Sensors" value={totalUniqueSensors} hint="Unique sensors across devices" />
          <StatCard title="Warning" value={warning} hint="Sensors with warning state" />
          <StatCard title="Critical" value={critical} hint="Sensors in critical/down state" />
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
          {/* Left: Sensor per Device */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-gradient-to-br from-[#1B263B] via-[#1a2538] to-[#162235] p-6 rounded-3xl flex-1 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Sensor Distribution
                </h3>
                <div className="text-sm text-gray-400 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  Max sensors: <span className="font-semibold text-blue-400">{maxPerDevice}</span>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(uniquePerDevice).map(([device, sensors]) => (
                  <MiniBar key={device} label={device} value={sensors.length} max={maxPerDevice} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Alerts + Quick Stats */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <AlertsPanel alerts={alerts} />
            <div className="bg-gradient-to-br from-[#1B263B] to-[#0F1419] p-6 rounded-3xl shadow-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-gray-400">Latest update:</span>
                  <span className="text-sm text-white font-mono">{logs.length ? formatTimestamp(logs[0]?.timestamp) : '-'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-gray-400">API Records:</span>
                  <span className="text-sm font-semibold text-blue-400">{logs.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-sm text-gray-400">Devices monitored:</span>
                  <span className="text-sm font-semibold text-green-400">{Object.keys(uniquePerDevice).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device list full width */}
        <div className="mt-8">
          <DeviceTable deviceMap={uniquePerDevice} />
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}