"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface SensorData {
  timestamp: string;
  status: string;
}

interface SLAData {
  "1day": SensorData[];
  "7days": SensorData[];
  "30days": SensorData[];
}

const SLAChart = () => {
  const [slaData, setSLAData] = useState<SLAData | null>(null);
  const [selectedRange, setSelectedRange] = useState<"1day" | "7days" | "30days">("7days");
  const [chartData, setChartData] = useState<any[]>([]);
  const [uptimePercentage, setUptimePercentage] = useState<number>(0);

  // Fetch data once on mount
  useEffect(() => {
    fetch("http://localhost:3001/api/sla-logs")
      .then((res) => res.json())
      .then((data) => {
        setSLAData(data);
      });
  }, []);

  // Process chart data when SLA data or range changes
  useEffect(() => {
    if (!slaData || !slaData[selectedRange]) return;

    const data = slaData[selectedRange];
    const grouped: { [date: string]: { up: number; down: number } } = {};

    data.forEach((item) => {
      const date = new Date(item.timestamp).toLocaleDateString("id-ID", {
        weekday: "long",
      });

      if (!grouped[date]) {
        grouped[date] = { up: 0, down: 0 };
      }

      if (item.status === "Up") grouped[date].up += 1;
      else grouped[date].down += 1;
    });

    const chart = Object.entries(grouped).map(([date, { up, down }]) => {
      const total = up + down;
      const uptime = total > 0 ? (up / total) * 100 : 0;
      return {
        date,
        up,
        down,
        total,
        uptime: Number(uptime.toFixed(2)),
      };
    });

    const totalUptime = chart.reduce((sum, d) => sum + d.uptime, 0);
    const avgUptime = chart.length ? totalUptime / chart.length : 0;

    setUptimePercentage(Number(avgUptime.toFixed(2)));
    setChartData(chart);
  }, [slaData, selectedRange]);

  return (
    <div className="bg-[#0f172a] text-white rounded-xl p-6 space-y-6 shadow-lg h-screen">
      {/* Rekap SLA */}
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-xl font-bold">Rekap SLA</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                className="text-gray-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-green-400"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${uptimePercentage}, 100`}
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
              {uptimePercentage}%
            </div>
          </div>
          <div>
            <p
              className={`text-xl font-semibold ${
                uptimePercentage >= 90 ? "text-green-400" : "text-red-400"
              }`}
            >
              {uptimePercentage >= 90 ? "Sesuai Standar" : "Tidak Sesuai"}
            </p>
            <p className="text-sm">Per Minggu (%)</p>
            <p className="text-xs text-gray-400">Periode: {selectedRange}</p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="range" className="text-sm text-gray-300">
            Pilih Range:
          </label>
          <select
            id="range"
            value={selectedRange}
            onChange={(e) =>
              setSelectedRange(e.target.value as "1day" | "7days" | "30days")
            }
            className="bg-gray-800 text-white border border-gray-600 rounded-md px-2 py-1"
          >
            <option value="1day">1 Hari</option>
            <option value="7days">7 Hari</option>
            <option value="30days">30 Hari</option>
          </select>
        </div>
      </div>

      {/* SLA Trend Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-2">SLA Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="slaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <Area
              type="monotone"
              dataKey="uptime"
              stroke="#22c55e"
              fill="url(#slaGradient)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SLAChart;
