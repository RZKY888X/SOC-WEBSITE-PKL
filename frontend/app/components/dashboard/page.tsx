"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/dashboard/Card";
import SensorChart from "@/app/components/dashboard/SensorChart";
import DeviceTable from "@/app/components/dashboard/DeviceTable";
import LogActivity from "@/app/components/dashboard/LogActivity";
import { LogItem } from "@/app/lib/types";

export default function DashboardPages() {
  const [allLogs, setAllLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/sensors");
        const data = await res.json();

        const formatted = data.map((log) => {
          const rawDateStr = log.lastcheck?.split("<")[0]?.trim(); // ambil sebelum <span ...
          const parsedDate = new Date(rawDateStr);

          return {
            ...log,
            timestamp: !isNaN(parsedDate.getTime())
              ? parsedDate.toISOString()
              : null,
          };
        });

        setAllLogs(formatted);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const normal = allLogs.filter((log) => log.status === "Up").length;
  const warning = allLogs.filter((log) => log.status === "Warning").length;
  const critical = allLogs.filter((log) => log.status === "Down").length;
  const total = allLogs.length;

  const groupByDevice = allLogs.reduce((acc, log) => {
    acc[log.device] = acc[log.device] || [];
    acc[log.device].push(log);
    return acc;
  }, {});

  const totalDeviceData = Object.entries(groupByDevice).map(([device, sensors]) => ({
    name: device,
    value: sensors.length,
    unit: "",
  }));

  const recentLogs = allLogs
    .filter((log) => log.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
    .map((log) => ({
      ...log,
      timestamp: new Date(log.timestamp).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Normal" icon="✅" value={normal} />
        <Card title="Warning" icon="⚠️" value={warning} />
        <Card title="Critical" icon="❌" value={critical} />
        <Card title="Total Sensor" icon="📡" value={total} />
      </div>

      {/* Chart Total Device */}
      <div className="bg-[#1B263B] p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Sensor per Device</h2>
        <SensorChart title="Total Device" data={totalDeviceData} />
      </div>

      {/* Device Table & Sensor Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeviceTable deviceMap={groupByDevice} />

        <div className="bg-[#1B263B] p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">10 Sensor Terbaru</h2>
          <div className="flex justify-between text-sm font-bold border-b border-gray-700 pb-1">
            <span>Type</span>
            <span>Last Value</span>
          </div>
          {allLogs.slice(0, 10).map((sensor, index) => (
            <div
              key={`${sensor.device}-${sensor.sensor}-${index}`}
              className="flex justify-between text-sm py-1 border-b border-gray-700"
            >
              <span>{sensor.sensor}</span>
              <span>{sensor.lastvalue || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <LogActivity recentLogs={recentLogs} />
    </div>
  );
}
