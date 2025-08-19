"use client";

import React, { useEffect, useMemo, useState } from "react";
import { LogItem } from "@/app/lib/types";
import { useSession } from "next-auth/react";

// -------------------------
// Small helper UI components
// -------------------------
function StatCard({ title, value, hint }: { title: string; value: number | string; hint?: string }) {
  return (
    <div className="bg-[#1c2530] p-4 rounded-2xl shadow-sm border border-white/5 h-full">
      <div className="text-sm text-gray-300">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-sm text-gray-300 truncate">{label}</div>
      <div className="flex-1 h-3 bg-white/5 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#2b6cb0] to-[#5d7bb6]" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-12 text-right text-sm">{value}</div>
    </div>
  );
}

function DeviceTable({ deviceMap }: { deviceMap: Record<string, LogItem[]> }) {
  const rows = Object.entries(deviceMap).map(([device, sensors]) => ({ device, sensors }));
  return (
    <div className="bg-[#1B263B] p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Device List</h3>
        <div className="text-sm text-gray-400">Total devices: {rows.length}</div>
      </div>

      {/* Dibagi jadi 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rows.map((r) => (
          <div key={r.device} className="bg-[#0f172a] p-3 rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.device}</div>
                <div className="text-sm text-gray-400">Sensors: {r.sensors.length}</div>
              </div>
              <div className="text-sm text-gray-300">Last check: {getLastCheck(r.sensors) ?? '-'}</div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {r.sensors.slice(0, 10).map((s, i) => (
                <div key={s.device + s.sensor + i} className="flex items-center justify-between">
                  <div className="truncate pr-2">{s.sensor}</div>
                  <div className="ml-4 text-xs font-medium">{s.lastvalue ?? '-'}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsPanel({ alerts }: { alerts: LogItem[] }) {
  if (!alerts.length) return <div className="bg-[#1B263B] p-4 rounded-2xl text-sm text-gray-400">No active critical alerts</div>;
  return (
    <div className="bg-[#1B263B] p-4 rounded-2xl">
      <h3 className="text-lg font-semibold mb-3">Critical Alerts</h3>
      <div className="space-y-2 max-h-80 overflow-auto">
        {alerts.map((a, idx) => (
          <div key={idx} className="bg-[#2b1a1a] p-3 rounded flex items-start gap-3">
            <div className="w-2 h-8 bg-red-600 rounded" />
            <div className="flex-1">
              <div className="font-semibold">{a.device} / {a.sensor}</div>
              <div className="text-xs text-gray-300">Status: {a.status} • Value: {a.lastvalue ?? '-'}</div>
              <div className="text-xs text-gray-400 mt-1">{formatTimestamp(a.timestamp)}</div>
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
export default function DashboardPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/sensors");
        const data = await res.json();
        const formatted: LogItem[] = data.map((l: any) => {
          const rawDateStr = l.lastcheck?.split("<")[0]?.trim();
          const parsed = new Date(rawDateStr);
          return { ...l, timestamp: !isNaN(parsed.getTime()) ? parsed.toISOString() : l.lastcheck || null };
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
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      {/* Header kosong */}
      <div className="mb-4"></div>

      {/* Top summary full width */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mb-6">
        <StatCard title="Total Devices" value={Object.keys(uniquePerDevice).length} hint="Unique monitored devices" />
        <StatCard title="Total Sensors" value={totalUniqueSensors} hint="Unique sensors across devices" />
        <StatCard title="Warning" value={warning} hint="Sensors with warning state" />
        <StatCard title="Critical" value={critical} hint="Sensors in critical/down state" />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-stretch">
        {/* Left: Sensor per Device */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-[#1B263B] p-4 rounded-2xl flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sensor per Device</h3>
              <div className="text-sm text-gray-400">Max sensors: {maxPerDevice}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(uniquePerDevice).map(([device, sensors]) => (
                <MiniBar key={device} label={device} value={sensors.length} max={maxPerDevice} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Alerts + Quick Stats */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <AlertsPanel alerts={alerts} />
          <div className="bg-[#1B263B] p-4 rounded-2xl">
            <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-300">Latest update: {logs.length ? formatTimestamp(logs[0]?.timestamp) : '-'}</div>
              <div className="text-sm text-gray-300">API Records (logs): {logs.length}</div>
              <div className="text-sm text-gray-300">Devices monitored: {Object.keys(uniquePerDevice).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Device list full width, 2 kolom */}
      <div className="mt-6">
        <DeviceTable deviceMap={uniquePerDevice} />
      </div>
    </div>
  );
}
