"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SensorPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const res = await axios.get("http://localhost:3001/api/sensors/desktop");
        const raw = res.data;

        const formatted = raw
          .filter(sensor =>
            sensor.sensor.toLowerCase().includes("http") &&
            sensor.value !== "" && sensor.value !== null
          )
          .map(sensor => {
            const value = parseFloat(sensor.value.replace(/[^\d.]/g, "")) || 0;

            return {
              time: new Date(sensor.timestamp).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              HTTP: value,
            };
          });

        // Urutkan berdasarkan waktu
        formatted.sort((a, b) => {
          const [aH, aM, aS] = a.time.split(":").map(Number);
          const [bH, bM, bS] = b.time.split(":").map(Number);
          return aH * 3600 + aM * 60 + aS - (bH * 3600 + bM * 60 + bS);
        });

        setData(formatted);
      } catch (err) {
        console.error("Gagal fetch data sensor:", err);
      }
    }

    fetchSensorData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      <main className="p-6">
        <div className="bg-[#1e293b] rounded-xl p-6 space-y-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Sensor Trend (HTTP only)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="httpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="time" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <Area
                  type="monotone"
                  dataKey="HTTP"
                  stroke="#3b82f6"
                  fill="url(#httpGradient)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
