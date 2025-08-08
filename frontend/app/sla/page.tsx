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

const PAGE_SIZE = 5;

const SLAChart = () => {
  const [slaData, setSLAData] = useState<SLAData | null>(null);
  const [selectedRange, setSelectedRange] = useState<"1day" | "7days" | "30days">("7days");
  const [chartData, setChartData] = useState<any[]>([]);
  const [uptimePercentage, setUptimePercentage] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:3001/api/sla-logs")
      .then((res) => res.json())
      .then((data) => {
        setSLAData(data);
      });
  }, []);

  useEffect(() => {
    if (!slaData || !slaData[selectedRange]) return;

    let data = slaData[selectedRange];

    if (selectedRange === "7days") {
      const groupedByDate: { [date: string]: SensorData[] } = {};

      data.forEach((item) => {
        const date = new Date(item.timestamp);
        const formatted = date.toLocaleDateString("id-ID");
        if (!groupedByDate[formatted]) {
          groupedByDate[formatted] = [];
        }
        groupedByDate[formatted].push(item);
      });

      const latest7Dates = Object.keys(groupedByDate)
        .sort((a, b) => {
          const aDate = new Date(a.split("/").reverse().join("-")).getTime();
          const bDate = new Date(b.split("/").reverse().join("-")).getTime();
          return bDate - aDate;
        })
        .slice(0, 7)
        .reverse();

      data = latest7Dates.flatMap((date) => groupedByDate[date]);
    }

    const grouped: { [date: string]: { up: number; down: number; rawDate: Date } } = {};

    data.forEach((item) => {
      const dateObj = new Date(item.timestamp);
      const date = dateObj.toLocaleDateString("id-ID");

      if (!grouped[date]) {
        grouped[date] = { up: 0, down: 0, rawDate: dateObj };
      }

      if (item.status === "Up") grouped[date].up += 1;
      else grouped[date].down += 1;
    });

    const chart = Object.entries(grouped)
      .map(([date, { up, down, rawDate }]) => {
        const total = up + down;
        const uptime = total > 0 ? (up / total) * 100 : 0;
        return {
          date,
          uptime: Number(uptime.toFixed(2)),
          rawDate,
        };
      })
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

    const totalUptime = chart.reduce((sum, d) => sum + d.uptime, 0);
    const avgUptime = chart.length ? totalUptime / chart.length : 0;

    setChartData(chart);
    setUptimePercentage(Number(avgUptime.toFixed(2)));
    setPageIndex(0);
  }, [slaData, selectedRange]);

  const paginatedData =
    selectedRange === "30days"
      ? chartData.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)
      : chartData.slice(0, 7);

  const totalPages =
    selectedRange === "30days" ? Math.ceil(chartData.length / PAGE_SIZE) : 1;

  return (
    <div className="bg-[#0f172a] text-white rounded-xl p-6 space-y-6 shadow-lg min-h-screen">
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
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-green-400"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${uptimePercentage}, 100`}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
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
            <p className="text-sm">
              Per{" "}
              {selectedRange === "1day"
                ? "Hari"
                : selectedRange === "7days"
                ? "Minggu"
                : "Bulan"}{" "}
              (%)
            </p>
            <p className="text-xs text-gray-400">Periode: {selectedRange}</p>
          </div>
        </div>

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

      <div>
        <h3 className="text-lg font-semibold mb-2">SLA Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={paginatedData}>
            <defs>
              <linearGradient id="slaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      className="rounded-md border px-4 py-2"
                      style={{
                        backgroundColor: "#0f172a", 
                        borderColor: "#22c55e", 
                        color: "#22c55e", 
                      }}
                    >
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-sm">{`uptime : ${payload[0].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
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

        {selectedRange === "30days" && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-300">
              Halaman {pageIndex + 1} dari {totalPages}
            </span>
            <button
              onClick={() =>
                setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={pageIndex === totalPages - 1}
              className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SLAChart;