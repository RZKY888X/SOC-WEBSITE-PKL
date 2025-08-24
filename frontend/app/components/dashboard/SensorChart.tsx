"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { SensorData } from "@/lib/types";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF6384"];

interface SensorChartProps {
  title: string;
  data: SensorData[];
}

interface TooltipProps {
  dataIndex?: number;
}

export default function SensorChart({ title, data }: SensorChartProps) {
  return (
    <div className='bg-gradient-to-br from-[#1B263B] via-[#1a2538] to-[#162235] p-6 rounded-3xl shadow-2xl border border-white/10 text-center relative overflow-hidden'>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
          <ResponsiveContainer width='100%' height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='name'
                outerRadius={90}
                innerRadius={40}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props) => {
                  const index = (props as TooltipProps)?.dataIndex;
                  const unit = typeof index === "number" ? data[index]?.unit || "" : "";
                  return [`${value}${unit}`, name];
                }}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-xs text-gray-300 truncate">{entry.name}</span>
              <span className="text-xs font-semibold text-white ml-auto">
                {entry.value}{entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
}